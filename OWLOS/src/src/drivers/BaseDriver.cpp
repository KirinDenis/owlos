/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

#include "BaseDriver.h"
#include "../Managers\DriverManager.h"


  //init() is called before transport accessable, when ESP is Setupping()
  //Drivers load default GPIO and other property values from Flash file system thanks to Init()
bool BaseDriver::init(String _id)
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

void BaseDriver::del()
{
	int count = getDriverPinsCount(id);
	for (int i = 0; i < count; i++)
	{
		deleteDriverPin(id, i);
	}
	available = false;
	return;
}

//begin(..) is called after transport accessable when Unit knows its and drivers' IDs and Topics
bool BaseDriver::begin(String _topic)
{
	topic = _topic + '/' + id;
	#ifdef DetailedDebug 
	debugOut(id, "available with topic " + topic);
#endif

	subscribe();
	available = true;
	return available;
}

bool BaseDriver::query()
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

//Gets all Driver properties at .INI format:
//propName1=prop1Value
//propName2=prop2Value
//...
//propNameNNN=propNNNValue
String BaseDriver::getAllProperties()
{

	String pins = "";
	int count = getDriverPinsCount(id);
	for (int i = 0; i < count; i++)
	{		
		DriverPin * driverPin = getDriverPinByDriverId(id, i);
		if (driverPin != nullptr)
		{
			pins += "pin" + String(i) + "=" + driverPin->name + "//s\n";
			//pins += "pintype" + String(i) + "=" + driverPin->driverPinType  + "\n";
		    pins += "pintype" + String(i) + "=" + decodePinTypes(driverPin->driverPinType) + "//r\n";
		}
		else
		{
			debugOut("PIN", "NULL");
		}
	}
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
	result += pins;
	result += "topic=" + topic + "//r\n";
	result += "available=" + String(available) + "//bs\n";
	result += "type=" + String(type) + "//r\n";
	result += "trap=" + String(trap) + "//fs\n";
	result += "lastquerymillis=" + String(lastQueryMillis) + "//ir\n";
	result += "lastpublishmillis=" + String(lastPublishMillis) + "//ir\n";
	result += "queryinterval=" + String(queryInterval) + "//i\n";
	result += "publishinterval=" + String(publishInterval) + "//i\n";
	result += "historydata=" + getHistoryData() + "//r\n";
	result += "historyfile=//r\n";	
	return result;
}

bool BaseDriver::publish()
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

void BaseDriver::subscribe()
{
	//now Kernel.cpp subscribes to all
	//transportSubscribe(topic + "/#");
}

int BaseDriver::parsePinNumber(String _topic, String getPinStr)
{
	return std::atoi(_topic.substring(_topic.indexOf(topic +  getPinStr) + String(topic + getPinStr).length()).c_str());
}

String BaseDriver::onMessage(String _topic, String _payload, int8_t transportMask)
{
	if (_topic.indexOf(topic + "/getpintype") == 0)
	{
		int pinIndex = parsePinNumber(_topic, "/getpintype");
		DriverPin * driverPin = getDriverPinByDriverId(id, pinIndex);
		if (driverPin != nullptr)				
		{
			return String(driverPin->driverPinType);
		}
		else
		{
			return String(NO_MASK);
		}
	}
	else	
		if (_topic.indexOf(topic + "/getpin") == 0)
		{
			int pinIndex = parsePinNumber(_topic, "/getpin");
			DriverPin * driverPin = getDriverPinByDriverId(id, pinIndex);
			if (driverPin != nullptr)
			{
				return String(driverPin->name);
			}
			else
			{
				return String(-1);
			}
		}
		else
			if (_topic.indexOf(topic + "/setpin") == 0)
			{				
				int pinIndex = parsePinNumber(_topic, "/setpin");				
				return  driversChangePin(_payload, id, pinIndex);
			}
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
							return String(setAvailable(std::atoi(_payload.c_str())));
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
								return String(setTrap(std::atof(_payload.c_str())));
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
								return String(setQueryInterval(std::atoi(_payload.c_str())));
							}
	//Publish Interval -----------------------------------------------------------
							else if (String(topic + "/getpublishinterval").equals(_topic))
							{
								return onGetProperty("publishinterval", String(getPublishInterval()), transportMask);
							}
							else if (String(topic + "/setpublishinterval").equals(_topic))
							{
								return String(setPublishInterval(std::atoi(_payload.c_str())));
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
String BaseDriver::onGetProperty(String _property, String _payload, int8_t transportMask)
{
#ifdef DetailedDebug
	debugOut(id, "|-> get property " + _property + " = " + _payload);
#endif
	if (transportMask && MQTTMask != 0)
	{
		transportPublish(topic + "/" + _property, _payload);
	}
	return _payload;
}

bool BaseDriver::onInsideChange(String _property, String _payload/*, int8_t transportMask*/)
{
#ifdef DetailedDebug
	debugOut(id, "|<- inside change " + _property + " = " + _payload);
#endif

	return transportPublish(topic + "/" + _property, _payload);

	//FFR for mutliple transport
	/*
	bool result = true;
	  #ifdef
	  DetailedDebug debugOut(id, "|<- inside change " + _property + " = " +  _payload);
	  #endif
	if (transportMask && MQTTMask > 1)
	{
	   result = result & transportPublish(topic + "/" + _property, _payload);
	}
	return result;
	*/
}

int BaseDriver::getAvailable()
{
	if (filesExists(id + ".available"))
	{
		available = filesReadInt(id + ".available");
	}
#ifdef DetailedDebug
	debugOut(id, "available=" + String(available));
#endif
	return available;
}

bool BaseDriver::setAvailable(int _available)
{
	available = _available;
	filesWriteInt(id + ".available", available);
	return onInsideChange("available", String(available));
}


int BaseDriver::getType()
{
#ifdef DetailedDebug
	debugOut(id, "type=" + type);
#endif
	return type;
}

bool BaseDriver::setType(int _type)
{
	type = _type;
	filesWriteInt(id + ".type", type);
	return onInsideChange("type", String(type));
}

float BaseDriver::getTrap()
{
	if (filesExists(id + ".trap"))
	{
		trap = filesReadFloat(id + ".trap");
	}
#ifdef DetailedDebug
	debugOut(id, "trap=" + String(trap));
#endif
	return trap;
}

bool BaseDriver::setTrap(float _trap)
{
	trap = _trap;
	filesWriteFloat(id + ".trap", trap);
	return onInsideChange("trap", String(trap));
}

int BaseDriver::getQueryInterval()
{
	if (filesExists(id + ".queryinterval"))
	{
		queryInterval = filesReadInt(id + ".queryinterval");
	}
#ifdef DetailedDebug
	debugOut(id, "queryinterval=" + String(queryInterval));
#endif
	return queryInterval;
}

bool BaseDriver::setQueryInterval(int _queryInterval)
{
	queryInterval = _queryInterval;
	filesWriteInt(id + ".queryinterval", queryInterval);
	return onInsideChange("queryinterval", String(queryInterval));
}

int BaseDriver::getPublishInterval()
{
	if (filesExists(id + ".publishinterval"))
	{
		publishInterval = filesReadInt(id + ".publishinterval");
	}
#ifdef DetailedDebug
	debugOut(id, "publishinterval=" + String(publishInterval));
#endif
	return publishInterval;
}

bool BaseDriver::setPublishInterval(int _publishInterval)
{
	publishInterval = _publishInterval;
	filesWriteInt(id + ".publishinterval", publishInterval);
	return onInsideChange("publishinterval", String(publishInterval));
}

//HistoryData property GET<->SET wrappers
String BaseDriver::getHistoryData()
{
	String	dataHistory = String(historyCount) + ";";

	for (int k = 0; k < historyCount; k++)
	{
		dataHistory += String(historyData[k]) + ";";
	}

	return dataHistory;
}

bool BaseDriver::setHistoryData(float _historydata)
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
String BaseDriver::readHistoryFile()
{
	String result = "";
	for (int i = 0; i < filesIndexesSize; i++)
	{
		String file = id + "." + String(historyFilesIndexes[i] + 1) + ".history";
		if (filesExists(file))
		{
			result += filesReadString(file);
		}
	}
	return result;
}


bool BaseDriver::writeHistoryFile(float _historydata)
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
			historyFilesIndexes[filesIndexesSize - 1] = currentFile;

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
		result = filesAddString(_historyfilename, String(_historydata) + ";");
	}

	return result;
}


