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
#ifdef USE_DRIVERS
#include "../services/DriverService.h"

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
bool BaseDriver::begin(const String _topic)
{
	topic = _topic + '/' + id;
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "available with topic " + topic);
#endif
#endif

	subscribe();
	available = true;
	return available;
}

bool BaseDriver::query()
{
	if (available)
	{
		if (millis() >= lastQueryMillis + queryInterval)
		{
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
		DriverPin *driverPin = getDriverPinByDriverId(id, i);
		if (driverPin != nullptr)
		{
			pins += "pin" + String(i) + "=" + driverPin->name + "//s\n";
			//pins += "pintype" + String(i) + "=" + driverPin->driverPinType  + "\n";
			pins += "pintype" + String(i) + "=" + decodePinTypes(driverPin->driverPinType) + "//r\n";
		}
		else
		{
#ifdef DEBUG
			debugOut("PIN", "NULL");
#endif
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
	return "id=" + id + "//r\n" + pins +
		   "topic=" + topic + "//r\n"
							  "available=" +
		   String(available) + "//bs\n"
							   "type=" +
		   String(type) + "//r\n"
						  "trap=" +
		   String(trap) + "//fs\n"
						  "lastquerymillis=" +
		   String(lastQueryMillis) + "//ir\n"
									 "lastpublishmillis=" +
		   String(lastPublishMillis) + "//ir\n"
									   "queryinterval=" +
		   String(queryInterval) + "//i\n"
								   "publishinterval=" +
		   String(publishInterval) + "//i\n"
									 "historydata=" +
		   getHistoryData() + "//r\n"
							  "historyfile=//r\n";
}

bool BaseDriver::publish()
{
	if (available)
	{
		if (millis() >= lastPublishMillis + publishInterval)
		{
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
	return atoi(_topic.substring(_topic.indexOf(topic + getPinStr) + String(topic + getPinStr).length()).c_str());
}

String BaseDriver::onMessage(const String route, const String _payload, int8_t transportMask)
{
	if (route.indexOf(topic + "/getpintype") == 0)
	{
		int pinIndex = parsePinNumber(route, "/getpintype");
		DriverPin *driverPin = getDriverPinByDriverId(id, pinIndex);
		if (driverPin != nullptr)
		{
			return String(driverPin->driverPinType);
		}
		else
		{
			return String(NO_MASK);
		}
	}
	else if (route.indexOf(topic + "/getpin") == 0)
	{
		int pinIndex = parsePinNumber(route, "/getpin");
		DriverPin *driverPin = getDriverPinByDriverId(id, pinIndex);
		if (driverPin != nullptr)
		{
			return String(driverPin->name);
		}
		else
		{
			return String(-1);
		}
	}
	else if (route.indexOf(topic + "/setpin") == 0)
	{
		int pinIndex = parsePinNumber(route, "/setpin");
		return driversChangePin(_payload, id, pinIndex);
	}
	else if (matchRoute(route, topic, "/getid"))
	{
		return onGetProperty("id", id, transportMask);
	}
	else if (matchRoute(route, topic, "/setid"))
	{
		return NOT_AVAILABLE;
	}
	//Topic --------------------------------------------------------------------
	else if (matchRoute(route, topic, "/gettopic"))
	{
		return onGetProperty("topic", topic, transportMask);
	}
	else if (matchRoute(route, topic, "/settopic"))
	{
		return NOT_AVAILABLE;
	}
	//Available --------------------------------------------------------------------
	else if (matchRoute(route, topic, "/getavailable"))
	{
		return onGetProperty("available", String(getAvailable()), transportMask); //Available can be changed only inside Unit!
	}
	else if (matchRoute(route, topic, "/setavailable"))
	{
		return String(setAvailable(atoi(_payload.c_str())));
	}
	//Type --------------------------------------------------------------------
	else if ((matchRoute(route, topic, "/gettype")) || (matchRoute(route, topic, "/settype")))
	{
		return onGetProperty("type", String(getType()), transportMask);
	}
	//Trap ----------------------------------------------------------------------
	else if (matchRoute(route, topic, "/gettrap"))
	{
		return onGetProperty("trap", String(getTrap()), transportMask);
	}
	else if (matchRoute(route, topic, "/settrap"))
	{
		return String(setTrap(atof(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getlastquerymillis"))
	{
		return onGetProperty("lastquerymillis", String(lastQueryMillis), transportMask);
	}
	else if (matchRoute(route, topic, "/getlastpublishmillis"))
	{
		return onGetProperty("lastpublishmillis", String(lastPublishMillis), transportMask);
	}
	//Query Interval -----------------------------------------------------------
	else if (matchRoute(route, topic, "/getqueryinterval"))
	{
		return onGetProperty("queryinterval", String(getQueryInterval()), transportMask);
	}
	else if (matchRoute(route, topic, "/setqueryinterval"))
	{
		return String(setQueryInterval(atoi(_payload.c_str())));
	}
	//Publish Interval -----------------------------------------------------------
	else if (matchRoute(route, topic, "/getpublishinterval"))
	{
		return onGetProperty("publishinterval", String(getPublishInterval()), transportMask);
	}
	else if (matchRoute(route, topic, "/setpublishinterval"))
	{
		return String(setPublishInterval(atoi(_payload.c_str())));
	}

	//History data -------------------------------------------------------------
	else if (matchRoute(route, topic, "/gethistorydata"))
	{
		return onGetProperty("historydata", String(getHistoryData()), transportMask);
	}

	//Read history file contents-------------------------------------------------------------
	else if (matchRoute(route, topic, "/gethistoryfile"))
	{
		return onGetProperty("historyfile", String(readHistoryFile()), transportMask);
	}
	return WRONG_PROPERTY_NAME;
}

//Called when client gets a property from network
String BaseDriver::onGetProperty(String _property, String _payload, int8_t transportMask)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "|-> get property " + _property + " = " + _payload);
#endif
#endif

	if (transportMask && MQTT_TRANSPORT_MASK != 0)
	{
#ifdef USE_ESP_DRIVER
		transportPublish(topic + "/" + _property, _payload);
#endif
	}
	return _payload;
}

bool BaseDriver::onInsideChange(String _property, String _payload /*, int8_t transportMask*/)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "|<- inside change " + _property + " = " + _payload);
#endif
#endif

#ifdef USE_ESP_DRIVER
	return transportPublish(topic + "/" + _property, _payload);
#else
	return true;
#endif

	//FFR for mutliple transport
	/*
	bool result = true;
	  #ifdef
	  DETAILED_DEBUG #ifdef DEBUG
debugOut(id, "|<- inside change " + _property + " = " +  _payload);
#endif
	  #endif
	if (transportMask && MQTT_TRANSPORT_MASK > 1)
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "available=" + String(available));
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "type=" + type);
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "trap=" + String(trap));
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "queryinterval=" + String(queryInterval));
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "publishinterval=" + String(publishInterval));
#endif
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
	String dataHistory = String(historyCount) + ";";

	for (int k = 0; k < historyCount; k++)
	{
		dataHistory += String(historyData[k]) + ";";
	}

	return dataHistory;
}

bool BaseDriver::setHistoryData(float _historydata)
{

	if (historyCount < historySize)
	{
		historyData[historyCount] = _historydata;
		historyCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
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
#endif
