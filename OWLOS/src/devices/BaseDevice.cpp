/*-------------------------------------------------------------------------------------------------------------------------
  OWLOS
  version 1.0 alpha [Small Land]
  (c) Konstantin Brule, Denis Kirin

  Base Device Class
  -----------------
  This class is a common ancestor for all classes that implement various devices.
  This class describes the general (basic) behavior for all device's classes,
  as well as implements basic properties and methods.
  Please NOTE: The class itself is never used as a device class.
                                                                            (...One morning thick snow fell in Babylon...)
  ------------------------------------------------------------------------------------------------------------------------*/

#include "BaseDevice.h"

//init() is called before transport accessable, when ESP is Setupping()
//Devices load default GPIO and other property values from Flash file system thanks to Init()
bool BaseDevice::init(String _id)
{
  id = _id;

  for (int i = 0; i < filesIndexesSize; i++)
  {
	  historyFilesIndexes[i] = i;
	  String fileNameCheck = id + "." + String(i + 1) + ".history";
	  if (filesExists(fileNameCheck))
	  {
		  filesDelete(fileNameCheck);
	  }
  }

  getAvailable();
  getTrap();
  getPublishInterval();
  return true;
}

//begin(..) is called after transport accessable when Unit knows its and devices' IDs and Topics
bool BaseDevice::begin(String _topic)
{
  topic = _topic + '/' + id; 
  debugOut(id, "available with topic " + topic);
  subscribe();
  available = true;
  return available;
}

bool BaseDevice::query()
{
  if (available)
  {
    if (millis() >= lastQueryMillis + queryInterval) {
      lastQueryMillis = millis();
      return true;
    }
  }
  return false;
}

//Gets all Device properties at .INI format:
//propName1=prop1Value
//propName2=prop2Value
//...
//propNameNNN=propNNNValue
String BaseDevice::getAllProperties()
{
//flags started with "//" chars at end of the string:
//r - read only
//s - selected
//
//b - boolean
//f - float
//i - integer
//if no type = string
//if not read only - write accessable
//this flags needed to UI and SDK builder - determinate API parameters types and SET API available
 String result = "id=" + id + "//r\n";
 result += "topic=" + topic + "//r\n";
 result += "available=" + String(available)+ "//bs\n";
 result += "type=" + String(type) + "//r\n";
 result += "trap=" + String(trap)+ "//fs\n";
 result += "lastquerymillis=" + String(lastQueryMillis)+ "//ir\n";
 result += "lastpublishmillis=" + String(lastPublishMillis)+ "//ir\n";
 result += "queryinterval=" + String(queryInterval)+ "//i\n";
 result += "publishinterval=" + String(publishInterval)+ "//i\n";
 result += "historydata=" + getHistoryData() + "//r\n";
 return result;
}

bool BaseDevice::publish()
{
  if (available)
  {
    if (millis() >= lastPublishMillis + publishInterval) {
      lastPublishMillis = millis();
      return true;
    }
  }
  return false;
}

void BaseDevice::subscribe()
{
  //now UnitProperties.cpp subscribes to all
  //transportSubscribe(topic + "/#");
}

String BaseDevice::onMessage(String _topic, String _payload, int transportMask)
{
  //ID --------------------------------------------------------------------
  if (String(topic + "/getid").equals(_topic))
  {
    return onGetProperty("id", id, transportMask); 
  }
  else
  if (String(topic + "/setid").equals(_topic))
  {
     return NotAvailable;
  }
  else
  //Topic --------------------------------------------------------------------
  if (String(topic + "/gettopic").equals(_topic))
  {
    return onGetProperty("topic", topic, transportMask); 
  }
  else
  if (String(topic + "/settopic").equals(_topic))
  {
     return NotAvailable;
  }
  else
  //Available --------------------------------------------------------------------
  if (String(topic + "/getavailable").equals(_topic))
  {
    return onGetProperty("available", String(getAvailable()), transportMask); //Available can be changed only inside Unit!
  }
  else
  if (String(topic + "/setavailable").equals(_topic))
  {
     return String(setAvailable(std::atoi (_payload.c_str())));
  }
  else
    //Type --------------------------------------------------------------------
    if ((String(topic + "/gettype").equals(_topic)) || (String(topic + "/settype").equals(_topic)))
    {
      return onGetProperty("type", String(getType()), transportMask);
    }
  //Trap ----------------------------------------------------------------------
    else if (String(topic + "/gettrap").equals(_topic))
    {
      return onGetProperty("trap", String(getTrap()), transportMask);
    }
    else if (String(topic + "/settrap").equals(_topic))
    {
      return String(setTrap(std::atof (_payload.c_str())));
    }
    else if (String(topic + "/getlastquerymillis").equals(_topic))
    {
      return onGetProperty("lastquerymillis", String(lastQueryMillis), transportMask);
    }
    else if (String(topic + "/getlastpublishmillis").equals(_topic))
    {
      return onGetProperty("lastpublishmillis", String(lastPublishMillis), transportMask);
    }
  //Query Interval -----------------------------------------------------------
    else if (String(topic + "/getqueryinterval").equals(_topic))
    {
      return onGetProperty("queryinterval", String(getQueryInterval()), transportMask);
    }
    else if (String(topic + "/setqueryinterval").equals(_topic))
    {
      return String(setQueryInterval(std::atoi (_payload.c_str())));
    }
  //Publish Interval -----------------------------------------------------------
    else if (String(topic + "/getpublishinterval").equals(_topic))
    {
      return onGetProperty("publishinterval", String(getPublishInterval()), transportMask);
    }
    else if (String(topic + "/setpublishinterval").equals(_topic))
    {
      return String(setPublishInterval(std::atoi (_payload.c_str())));
    }
  
    //History data -------------------------------------------------------------
	else if (String(topic + "/gethistorydata").equals(_topic))
	{
		return onGetProperty("historydata", String(getHistoryData()), transportMask);
	}

  //Read history file contents-------------------------------------------------------------
	else if (String(topic + "/gethistoryfile").equals(_topic))
	{
		return onGetProperty("historyfile", String(readHistoryFile()), transportMask);
	}
    return WrongPropertyName;
}

//Called when client gets a property from network
String BaseDevice::onGetProperty(String _property, String _payload, int transportMask)
{
    if (DetailedDebug) debugOut(id, "|-> get property " + _property + " = " +  _payload);
  if (transportMask && MQTTMask != 0)
  {
  	transportPublish(topic + "/" + _property, _payload);
  }
  return _payload;
}


bool BaseDevice::onInsideChange(String _property, String _payload/*, int transportMask*/)
{
    if (DetailedDebug) debugOut(id, "|<- inside change " + _property + " = " +  _payload);
  return transportPublish(topic + "/" + _property, _payload);

  //FFR for mutliple transport
  /*
  bool result = true;
    if (DetailedDebug) debugOut(id, "|<- inside change " + _property + " = " +  _payload);
  if (transportMask && MQTTMask > 1)
  {
     result = result & transportPublish(topic + "/" + _property, _payload);
  }
  return result; 
  */
}

int BaseDevice::getAvailable()
{
  if (filesExists(id + ".available"))
  {
    available = filesReadInt(id + ".available");
  }  
  if (DetailedDebug) debugOut(id, "available=" + String(available));
  return available;
}

bool BaseDevice::setAvailable(int _available)
{
  available = _available;
  filesWriteInt(id + ".available", available);
  return onInsideChange("available", String(available));
}

int BaseDevice::getType()
{
    if (DetailedDebug) debugOut(id, "type=" + type);
  return type;
}

bool BaseDevice::setType(int _type)
{
  type = _type;
  filesWriteInt(id + ".type", type);
  return onInsideChange("type", String(type));
}

float BaseDevice::getTrap()
{
  if (filesExists(id + ".trap"))
  {
    trap = filesReadFloat(id + ".trap");
  }
    if (DetailedDebug) debugOut(id, "trap=" + String(trap));
  return trap;
}

bool BaseDevice::setTrap(float _trap)
{
  trap = _trap;
  filesWriteFloat(id + ".trap", trap);
  return onInsideChange("trap", String(trap));
}

int BaseDevice::getQueryInterval()
{
  if (filesExists(id + ".queryinterval"))
  {
    queryInterval = filesReadInt(id + ".queryinterval");
  }
    if (DetailedDebug) debugOut(id, "queryinterval=" + String(queryInterval));
  return queryInterval;
}

bool BaseDevice::setQueryInterval(int _queryInterval)
{
  queryInterval = _queryInterval;
  filesWriteInt(id + ".queryinterval", queryInterval);
  return onInsideChange("queryinterval", String(queryInterval));
}

int BaseDevice::getPublishInterval()
{
  if (filesExists(id + ".publishinterval"))
  {
    publishInterval = filesReadInt(id + ".publishinterval");
  }
    if (DetailedDebug) debugOut(id, "publishinterval=" + String(publishInterval));
  return publishInterval;
}

bool BaseDevice::setPublishInterval(int _publishInterval)
{
  publishInterval = _publishInterval;
  filesWriteInt(id + ".publishinterval", publishInterval);
  return onInsideChange("publishinterval", String(publishInterval));
}

//HistoryData property GET<->SET wrappers
String BaseDevice::getHistoryData()
{
	String	dataHistory = String(historyCount) + ";";

	for (int k = 0; k < historyCount; k++)
	{
	    dataHistory += String(historyData[k]) + ";";	
	}

	return dataHistory;
}

bool BaseDevice::setHistoryData(float _historydata) 
{

	if (historyCount < historySize) {
		historyData[historyCount] = _historydata;
		historyCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++) {
			historyData[k - 1] = historyData[k];
		}

		historyData[historySize - 1] = _historydata;
	}

	return true;
}

//HistoryFile property Read<->Write wrappers
String BaseDevice::readHistoryFile()
{
	String result = "";
	for (int i = 0; i < filesIndexesSize; i++)
	{
		String file = id + "." + String(historyFilesIndexes[i]+1) + ".history";
		if (filesExists(file))
		{
		  result += filesReadString(file);
		}
	}	
	return result;
}


bool BaseDevice::writeHistoryFile(float _historydata)
{

	bool result = false;

	String _historyfilename;
	

	if (historyFileCount < historyFileWriteTime)
	{
		historyFileCount++;
	} 
	else
	{
		historyFileCount = 1;

		if (currentFileIndex < filesIndexesSize)
		{
	        //Write to history file at the begining
			currentFile = historyFilesIndexes[currentFileIndex];
			currentFileIndex++;
		}
		else
		{
	    
			currentFileIndex = filesIndexesSize;

			//Take value from historyFilesIndexes[0]
			currentFile = historyFilesIndexes[0];
			
			//Shift array element one step to left
			for (int i = 1; i < filesIndexesSize; i++)
			{
				historyFilesIndexes[i - 1] = historyFilesIndexes[i];
			}

			//Put the current file to the end of array
			historyFilesIndexes[filesIndexesSize-1] = currentFile;
		
		}	

		//delete file with oldest history
		filesDelete(id + "." + String(currentFile + 1) + ".history");
	}

	_historyfilename = id + "." + String(currentFile + 1) + ".history";
		
	if (!filesExists(_historyfilename))
	{
		result = filesWriteString(_historyfilename, String(_historydata) + ";");
	}
	else
	{	
		 result = filesAddString(_historyfilename, String(_historydata)+";");
	}

	return result;
}

;
