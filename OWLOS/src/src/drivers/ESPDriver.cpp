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

#include "ESPDriver.h"
#ifdef USE_ESP_DRIVER

#include "../services/DriverService.h"
#include "../services/FileService.h"
#include "../services/UpdateService.h"
#include "../services/TransportService.h"


#ifdef ARDUINO_ESP32_RELEASE_1_0_4
extern "C" int rom_phy_get_vdd33();
#endif

//to make read property from file once, use this CSV string
String propertyFileReaded("");

//Unit Private properties
String nodeid(DEFAULT_ID);	 //current Unit ID for transport (MQTT) topic and other identification inside system
String topic(DEFAULT_TOPIC); //current Unit ROOT topic
String firmwareversion(FIRMWARE_VERSION);
int firmwarebuildnumber(FIRMWARE_BUILD_NUMBER);


// ESP properties
String espresetinfo(DEFAULT_EMPTY_STR_VALUE);
int espreset(DEFAULT_ZERO_VALUE);
int esprestart(DEFAULT_ZERO_VALUE);
uint16_t espvcc(DEFAULT_ZERO_VALUE);
uint32_t espchipid(DEFAULT_ZERO_VALUE);
uint32_t espfreeheap(DEFAULT_ZERO_VALUE);
uint16_t espmaxfreeblocksize(DEFAULT_ZERO_VALUE);
uint8_t espheapfragmentation(DEFAULT_ZERO_VALUE);
String espsdkversion(DEFAULT_EMPTY_STR_VALUE);
String espcoreversion(DEFAULT_EMPTY_STR_VALUE);
String espfullversion(DEFAULT_EMPTY_STR_VALUE);
uint8_t espbootversion(DEFAULT_ZERO_VALUE);
uint8_t espbootmode(DEFAULT_ZERO_VALUE);
uint8_t espcpufreqmhz(DEFAULT_ZERO_VALUE);
uint32_t espflashchipid(DEFAULT_ZERO_VALUE);
uint8_t espflashchipvendorid(DEFAULT_ZERO_VALUE);
uint32_t espflashchiprealsize(DEFAULT_ZERO_VALUE);
uint32_t espflashchipsize(DEFAULT_ZERO_VALUE);
uint32_t espflashchipspeed(DEFAULT_ZERO_VALUE);
uint32_t espsketchsize(DEFAULT_ZERO_VALUE);
uint32_t espfreesketchspace(DEFAULT_ZERO_VALUE);
FlashMode_t espflashchipmode((FlashMode_t)DEFAULT_ZERO_VALUE);
String espsketchmd5(DEFAULT_EMPTY_STR_VALUE);
String espresetreason(DEFAULT_EMPTY_STR_VALUE);
uint32_t espmagicflashchipsize(DEFAULT_ZERO_VALUE);
uint32_t espmagicflashchipspeed(DEFAULT_ZERO_VALUE);
FlashMode_t espmagicflashchipmode((FlashMode_t)DEFAULT_ZERO_VALUE);


/*-----------------------------------------------------------------------------
OWLOS ESP drivers section (ESP Driver, WiFi Driver, Network Driver
------------------------------------------------------------------------------*/

bool nodeInit()
{
	nodeGetUnitId();
	nodeGetTopic();
	return true;
}

//flags started with "//" chars at end of the string:
//r - read only
//s - selected
//p - password
//
//b - boolean
//f - float
//i - integer
//if no type = string
//if not read only - write accessable
//this flags needed to UI and SDK builder - determinate API parameters types and SET API available

String nodeGetAllProperties()
{

	return nodeGetWiFiProperties() +
	       nodeGetNetworkProperties() +

								 "properties for:esp\n"
								 "id=esp//r\n"
								 "type=" +
		   String(ESP_DRIVER_TYPE) + "//r\n"
							 "espresetinfo=" +
		   nodeGetESPResetInfo() + "//r\n"
								   "espreset=" +
		   String(nodeGetESPReset()) + "//sb\n"
									   "esprestart=" +
		   String(nodeGetESPRestart()) + "//b\n"
										 "espvcc=" +
		   String(nodeGetESPVcc()) + "//r\n"
									 "espchipid=" +
		   String(nodeGetESPChipId()) + "//sr\n"
										"espfreeheap=" +
		   String(nodeGetESPFreeHeap()) + "//sri\n"
										  "espmaxfreeblocksize=" +
		   String(nodeGetESPMaxFreeBlockSize()) + "//ri\n"
												  "espheapfragmentation=" +
		   String(nodeGetESPHeapFragmentation()) + "//ri\n"
												   "espsdkversion=" +
		   nodeGetESPSdkVersion() + "//r\n"
											 "espcoreversion=" +
		   nodeGetESPCoreVersion() + "//r\n"
									 "espfullversion=" +
		   nodeGetESPFullVersion() + "//r\n"
									 "espbootversion=" +
		   String(nodeGetESPBootVersion()) + "//r\n"
											 "espbootmode=" +
		   String(nodeGetESPBootMode()) + "//r\n"
										  "espcpufreqmhz=" +
		   String(nodeGetESPCpuFreqMHz()) + "//r\n"
											"espflashchipid=" +
		   String(nodeGetESPFlashChipId()) + "//r\n"
											 "espflashchipvendorid=" +
		   String(nodeGetESPFlashChipVendorId()) + "//r\n"
												   "espflashchiprealsize=" +
		   String(nodeGetESPFlashChipRealSize()) + "//r\n"
												   "espflashchipsize=" +
		   String(nodeGetESPFlashChipSize()) + "//r\n"
											   "espflashchipspeed=" +
		   String(nodeGetESPFlashChipSpeed()) + "//r\n"
												"espsketchsize=" +
		   String(nodeGetESPSketchSize()) + "//r\n"
											"espfreesketchspace=" +
		   String(nodeGetESPFreeSketchSpace()) + "//r\n"
												 "espflashchipmode=" +
		   String(nodeGetESPFlashChipMode()) + "//r\n"
											   "espsketchmd5=" +
		   nodeGetESPSketchMD5() + "//r\n"
								   "espresetreason=" +
		   nodeGetESPResetReason() + "//sr\n"
									 "espmagicflashchipsize=" +
		   String(espmagicflashchipsize) + "//r\n"
										   "espmagicflashchipspeed=" +
		   String(espmagicflashchipspeed) + "//r\n"
											"espmagicflashchipmode=" +
		   String(espmagicflashchipmode) + "//r\n";
}

void nodeSubscribe()
{
	transportSubscribe(topic + "/#");
}

String onGetProperty(String _property, String _payload, int8_t transportMask)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(nodeid, "|-> get property " + _property + " = " + _payload);
#endif
#endif
	if (transportMask && MQTT_TRANSPORT_MASK != 0)
	{
		transportPublish(topic + "/" + _property, _payload);
	}
	return _payload;
}

String nodeOnMessage(const String &route, const String &_payload, int8_t transportMask)
{
	String result = wifiOnMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_NODE_PROPERTY_NAME))
	{
		return result;
	}

	result = networkOnMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_NODE_PROPERTY_NAME))
	{
		return result;
	}

	if (matchRoute(route, topic, "/getnodeid"))
	{
		return onGetProperty("id", nodeGetUnitId(), transportMask);
	}
	else if (matchRoute(route, topic, "/setnodeid"))
	{
		return String(nodeSetUnitId(_payload));
	}
	else if (matchRoute(route, topic, "/gettopic"))
	{
		return onGetProperty("topic", nodeGetTopic(), transportMask);
	}
	else if (matchRoute(route, topic, "/settopic"))
	{
		return String(nodeSetTopic(_payload));
	}
	else if (matchRoute(route, topic, "/getfirmwareversion"))
	{
		return onGetProperty("firmwareversion", nodeGetFirmwareVersion(), transportMask);
	}
	else if (matchRoute(route, topic, "/setfirmwareversion"))
	{
		return String(nodeSetFirmwareVersion(_payload));
	}
	else if (matchRoute(route, topic, "/getfirmwarebuildnumber"))
	{
		return onGetProperty("firmwarebuildnumber", String(nodeGetFirmwareBuildNumber()), transportMask);
	}
	else if (matchRoute(route, topic, "/setfirmwarebuildnumber"))
	{
		return String(nodeSetFirmwareBuildNumber(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespresetinfo"))
	{
		return onGetProperty("espresetinfo", nodeGetESPResetInfo(), transportMask);
	}
	else if (matchRoute(route, topic, "/setespresetinfo"))
	{
		return String(nodeSetESPResetInfo(_payload));
	}
	else if (matchRoute(route, topic, "/getespreset"))
	{
		return onGetProperty("espreset", String(nodeGetESPReset()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespreset"))
	{
		return String(nodeSetESPReset(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getesprestart"))
	{
		return onGetProperty("esprestart", String(nodeGetESPRestart()), transportMask);
	}
	else if (matchRoute(route, topic, "/setesprestart"))
	{
		return String(nodeSetESPRestart(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespvcc"))
	{
		return onGetProperty("espvcc", String(nodeGetESPVcc()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespvcc"))
	{
		return String(nodeSetESPVcc(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespchipid"))
	{
		return onGetProperty("espchipid", String(nodeGetESPChipId()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespchipid"))
	{
		return String(nodeSetESPChipId(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespfreeheap"))
	{
		return onGetProperty("espfreeheap", String(nodeGetESPFreeHeap()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespfreeheap"))
	{
		return String(nodeSetESPFreeHeap(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespmaxfreeblocksize"))
	{
		return onGetProperty("espmaxfreeblocksize", String(nodeGetESPMaxFreeBlockSize()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespmaxfreeblocksize"))
	{
		return String(nodeSetESPMaxFreeBlockSize(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespheapfragmentation"))
	{
		return onGetProperty("espheapfragmentation", String(nodeGetESPHeapFragmentation()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespheapfragmentation"))
	{
		return String(nodeSetESPHeapFragmentation(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespsdkversion"))
	{
		return onGetProperty("espsdkversion", nodeGetESPSdkVersion(), transportMask);
	}
	else if (matchRoute(route, topic, "/setespsdkversion"))
	{
		return String(nodeSetESPSdkVersion(_payload));
	}
	else if (matchRoute(route, topic, "/getespcoreversion"))
	{
		return onGetProperty("espcoreversion", nodeGetESPCoreVersion(), transportMask);
	}
	else if (matchRoute(route, topic, "/setespcoreversion"))
	{
		return String(nodeSetESPCoreVersion(_payload));
	}
	else if (matchRoute(route, topic, "/getespfullversion"))
	{
		return onGetProperty("espfullversion", nodeGetESPFullVersion(), transportMask);
	}
	else if (matchRoute(route, topic, "/setespfullversion"))
	{
		return String(nodeSetESPFullVersion(_payload));
	}
	else if (matchRoute(route, topic, "/getespbootversion"))
	{
		return onGetProperty("espbootversion", String(nodeGetESPBootVersion()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespbootversion"))
	{
		return String(nodeSetESPBootVersion(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespbootmode"))
	{
		return onGetProperty("espbootmode", String(nodeGetESPBootMode()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespbootmode"))
	{
		return String(nodeSetESPBootMode(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespcpufreqmhz"))
	{
		return onGetProperty("espcpufreqmhz", String(nodeGetESPCpuFreqMHz()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespcpufreqmhz"))
	{
		return String(nodeSetESPCpuFreqMHz(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespflashchipid"))
	{
		return onGetProperty("espflashchipid", String(nodeGetESPFlashChipId()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespflashchipid"))
	{
		return String(nodeSetESPFlashChipId(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespflashchipvendorid"))
	{
		return onGetProperty("espflashchipvendorid", String(nodeGetESPFlashChipVendorId()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespflashchipvendorid"))
	{
		return String(nodeSetESPFlashChipVendorId(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespflashchiprealsize"))
	{
		return onGetProperty("espflashchiprealsize", String(nodeGetESPFlashChipRealSize()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespflashchiprealsize"))
	{
		return String(nodeSetESPFlashChipRealSize(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespflashchipsize"))
	{
		return onGetProperty("espflashchipsize", String(nodeGetESPFlashChipSize()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespflashchipsize"))
	{
		return String(nodeSetESPFlashChipSize(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespflashchipspeed"))
	{
		return onGetProperty("espflashchipspeed", String(nodeGetESPFlashChipSpeed()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespflashchipspeed"))
	{
		return String(nodeSetESPFlashChipSpeed(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespsketchsize"))
	{
		return onGetProperty("espsketchsize", String(nodeGetESPSketchSize()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespsketchsize"))
	{
		return String(nodeSetESPSketchSize(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespfreesketchspace"))
	{
		return onGetProperty("espfreesketchspace", String(nodeGetESPFreeSketchSpace()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespfreesketchspace"))
	{
		return String(nodeSetESPFreeSketchSpace(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespflashchipmode"))
	{
		return onGetProperty("espflashchipmode", String(nodeGetESPFlashChipMode()), transportMask);
	}
	else if (matchRoute(route, topic, "/setespflashchipmode"))
	{
		return String(nodeSetESPFlashChipMode(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespsketchmd5"))
	{
		return onGetProperty("espsketchmd5", nodeGetESPSketchMD5(), transportMask);
	}
	else if (matchRoute(route, topic, "/setespsketchmd5"))
	{
		return String(nodeSetESPSketchMD5(_payload));
	}
	else if (matchRoute(route, topic, "/getespresetreason"))
	{
		return onGetProperty("espresetreason", nodeGetESPResetReason(), transportMask);
	}
	else if (matchRoute(route, topic, "/setespresetreason"))
	{
		return String(nodeSetESPResetReason(_payload));
	}
	else if (matchRoute(route, topic, "/getespmagicflashchipsize"))
	{
		return onGetProperty("espmagicflashchipsize", String(nodeGetESPMagicFlashChipSize((uint8_t)atoi(_payload.c_str()))), transportMask);
	}
	else if (matchRoute(route, topic, "/setespmagicflashchipsize"))
	{
		return String(nodeSetESPMagicFlashChipSize(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespmagicflashchipspeed"))
	{
		return onGetProperty("espmagicflashchipspeed", String(nodeGetESPMagicFlashChipSpeed((uint8_t)atoi(_payload.c_str()))), transportMask);
	}
	else if (matchRoute(route, topic, "/setespmagicflashchipspeed"))
	{
		return String(nodeSetESPMagicFlashChipSpeed(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getespmagicflashchipmode"))
	{
		return onGetProperty("espmagicflashchipmode", String(nodeGetESPMagicFlashChipMode((uint8_t)atoi(_payload.c_str()))), transportMask);
	}
	else if (matchRoute(route, topic, "/setespmagicflashchipmode"))
	{
		return String(nodeSetESPMagicFlashChipMode(atoi(_payload.c_str())));
		//Pins
	}
	else 
		
		return result;
	return "";
}

bool lock = false;

bool onInsideChange(String _property, String _value)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(nodeid, "|<- inside change " + _property + " = " + _value);
#endif
#endif

	bool result = false;
	if (!lock)
	{
		lock = true;
		result = filesWriteString(String(DEFAULT_ID) + "." + _property, _value);

		result = transportPublish(topic + "/" + _property, _value);

#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(nodeid, "|-> inside change ");
#endif
#endif
		lock = false;
	}

	return result;
}
//-------------------------------------------------------------------------------------------
//Internal - get any node property value by name
//-------------------------------------------------------------------------------------------
String _getStringPropertyValue(String _property, String _defaultvalue)
{
#ifdef DONT_USE_FILES
	return _defaultvalue;
#endif

	String result = _defaultvalue;
	if (filesExists(String(DEFAULT_ID) + "." + _property))
	{
		result = filesReadString(String(DEFAULT_ID) + "." + _property);
	}
	else
	{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		nodeOnMessage(topic + "/set" + _property, result, NO_TRANSPORT_MASK);
#endif
	}
	propertyFileReaded += _property + ";";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(nodeid, _property + "=" + result);
#endif
#endif
	return result;
}
//Integer property
int _getIntPropertyValue(String _property, int _defaultvalue)
{
#ifdef DONT_USE_FILES
	return _defaultvalue;
#endif

	int result = _defaultvalue;
	if (filesExists(String(DEFAULT_ID) + "." + _property))
	{
		result = filesReadInt(String(DEFAULT_ID) + "." + _property);
	}
	else
	{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		nodeOnMessage(topic + "/set" + _property, String(result), NO_TRANSPORT_MASK);
#endif
	}
	propertyFileReaded += _property + ";";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(nodeid, _property + "=" + String(result));
#endif
#endif
	return result;
}

//Getters and Setters section ---------------------------------------------------------------
String nodeGetUnitId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("nodeid;") < 0)
		return nodeid = _getStringPropertyValue("nodeid", DEFAULT_ID + String(ESP.getChipId(), HEX));
	else
		return nodeid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4

	if (propertyFileReaded.indexOf("nodeid;") < 0)
		return nodeid = _getStringPropertyValue("nodeid", DEFAULT_ID + String((int)ESP.getEfuseMac(), (unsigned char)HEX));

	else
		return nodeid;
#endif
}

bool nodeSetUnitId(String _nodeid)
{
	nodeid = _nodeid;
	return onInsideChange("nodeid", String(nodeid));
}

//Topic --------------------------------------------------------------------------------------
String nodeGetTopic()
{
	if (propertyFileReaded.indexOf("topic;") < 0)
		return topic = _getStringPropertyValue("topic", DEFAULT_TOPIC + nodeid);
	else
		return topic;
}

bool nodeSetTopic(String _topic)
{
	topic = _topic;
	return onInsideChange("topic", String(topic));
}

//GetFirmwareVersion
String nodeGetFirmwareVersion()
{
	/*  if (propertyFileReaded.indexOf("firmwareversion;") < 0) return firmwareversion = _getStringPropertyValue("firmwareversion", FIRMWARE_VERSION);
	  else */
	return firmwareversion;
}
bool nodeSetFirmwareVersion(String _firmwareversion)
{
	return false;
}

//GetFirmwareBuildNumber
int nodeGetFirmwareBuildNumber()
{
	/*  if (propertyFileReaded.indexOf("firmwarebuildnumber;") < 0) return firmwarebuildnumber = _getIntPropertyValue("firmwarebuildnumber", FIRMWARE_BUILD_NUMBER);
	  else */
	return firmwarebuildnumber;
}
bool nodeSetFirmwareBuildNumber(int _firmwarebuildnumber)
{
	return false;
}


/**/
//ESPResetInfo()
String nodeGetESPResetInfo()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espresetinfo;") < 0)
		return espresetinfo = ESP.getResetInfo();
	else
		return espresetinfo;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("espresetinfo;") < 0)
		return espresetinfo = "CPU1: " + String(rtc_get_reset_reason(0)) + ";CPU2: " + String(rtc_get_reset_reason(1)) + ";";
	else
		return espresetinfo;
#endif
}
bool nodeSetESPResetInfo(String _espresetinfo)
{
	return false;
}

//ESPReset()
int nodeGetESPReset()
{
	if (propertyFileReaded.indexOf("espreset;") < 0)
		return espreset = DEFAULT_ZERO_VALUE;
	else
		return espreset;
}
bool nodeSetESPReset(int _espreset)
{
	espreset = _espreset;
	bool result = onInsideChange("espreset", String(espreset));
	if (espreset == 1)
	{
		delay(100);
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		ESP.reset();
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
		ESP.restart();
#endif
	}
	return result;
}

//ESPRestart()
int nodeGetESPRestart()
{
	if (propertyFileReaded.indexOf("esprestart;") < 0)
		return esprestart = DEFAULT_ZERO_VALUE;
	else
		return esprestart;
}
bool nodeSetESPRestart(int _esprestart)
{
	esprestart = 1;
	bool result = onInsideChange("esprestart", String(esprestart));
	if (esprestart == 1)
	{
		delay(100);
		ESP.restart();
	}
	return result;
}

//ESPGetVcc()
uint16_t nodeGetESPVcc()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0	
		return espvcc = ESP.getVcc();
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4		
		return espvcc = rom_phy_get_vdd33();
#endif
}

bool nodeSetESPVcc(int _espvcc)
{
	return false;
}

//ESPGetChipId()
uint32_t nodeGetESPChipId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espchipid;") < 0)
		return espchipid = ESP.getChipId();
	else
		return espchipid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("espchipid;") < 0)
		return espchipid = (int)ESP.getEfuseMac();
	else
		return espchipid;
#endif
}
bool nodeSetESPChipId(int _espchipid)
{
	return false;
}

//ESPGetFreeHeap()
uint32_t nodeGetESPFreeHeap()
{
	if (propertyFileReaded.indexOf("espfreeheap;") < 0)
		return espfreeheap = ESP.getFreeHeap();
	else
		return espfreeheap;
}
bool nodeSetESPFreeHeap(int _espfreeheap)
{
	return false;
}

//ESPGetMaxFreeBlockSize
uint16_t nodeGetESPMaxFreeBlockSize()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espmaxfreeblocksize;") < 0)
		return espmaxfreeblocksize = ESP.getMaxFreeBlockSize();
	else
		return espmaxfreeblocksize;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool nodeSetESPMaxFreeBlockSize(int _espmaxfreeblocksize)
{
	return false;
}

//ESPGetHeapFragmentation
uint8_t nodeGetESPHeapFragmentation()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espheapfragmentation;") < 0)
		return espheapfragmentation = ESP.getHeapFragmentation();
	else
		return espheapfragmentation;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool nodeSetESPHeapFragmentation(int _espheapfragmentation)
{
	return false;
}

//ESPGetSdkVersion
String nodeGetESPSdkVersion()
{
	if (propertyFileReaded.indexOf("espsdkversion;") < 0)
	{	
		return espsdkversion = ESP.getSdkVersion();
	}
	else
		return espsdkversion;
}
bool nodeSetESPSdkVersion(String _espsdkversion)
{
	return false;
}

//ESPGetCoreVersion
String nodeGetESPCoreVersion()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espcoreversion;") < 0)
		return espcoreversion = ESP.getCoreVersion();
	else
		return espcoreversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return NOT_AVAILABLE;
#endif
}
bool nodeSetESPCoreVersion(String _espcoreversion)
{
	return false;
}

//ESPGetFullVersion
String nodeGetESPFullVersion()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espfullversion;") < 0)
		return espfullversion = ESP.getFullVersion();
	else
		return espfullversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return NOT_AVAILABLE;
#endif
}

bool nodeSetESPFullVersion(String _espfullversion)
{
	return false;
}

//ESPGetBootVersion
uint8_t nodeGetESPBootVersion()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espbootversion;") < 0)
		return espbootversion = ESP.getBootVersion();
	else
		return espbootversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool nodeSetESPBootVersion(int _espbootversion)
{
	return false;
}

//ESPGetBootMode
uint8_t nodeGetESPBootMode()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espbootmode;") < 0)
		return espbootmode = ESP.getBootMode();
	else
		return espbootmode;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool nodeSetESPBootMode(int _espbootmode)
{
	return false;
}

//ESPGetCpuFreqMHz
uint8_t nodeGetESPCpuFreqMHz()
{
	if (propertyFileReaded.indexOf("espcpufreqmhz;") < 0)
		return espcpufreqmhz = ESP.getCpuFreqMHz();
	else
		return espcpufreqmhz;
}
bool nodeSetESPCpuFreqMHz(int _espcpufreqmhz)
{
	return false;
}

//ESPGetFlashChipId
uint32_t nodeGetESPFlashChipId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espflashchipid;") < 0)
		return espflashchipid = ESP.getFlashChipId();
	else
		return espflashchipid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool nodeSetESPFlashChipId(int _espflashchipid)
{
	return false;
}

//ESPGetFlashChipVendorId
uint8_t nodeGetESPFlashChipVendorId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espflashchipvendorid;") < 0)
		return espflashchipvendorid = ESP.getFlashChipVendorId();
	else
		return espflashchipvendorid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool nodeSetESPFlashChipVendorId(int _espflashchipvendorid)
{
	return false;
}

//ESPGetFlashChipRealSize
uint32_t nodeGetESPFlashChipRealSize()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espflashchiprealsize;") < 0)
		return espflashchiprealsize = ESP.getFlashChipRealSize();
	else
		return espflashchiprealsize;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool nodeSetESPFlashChipRealSize(int _espflashchiprealsize)
{
	return false;
}

//ESPGetFlashChipSize
uint32_t nodeGetESPFlashChipSize()
{
	if (propertyFileReaded.indexOf("espflashchipsize;") < 0)
		return espflashchipsize = ESP.getFlashChipSize();
	else
		return espflashchipsize;
}
bool nodeSetESPFlashChipSize(int _espflashchipsize)
{
	return false;
}

//ESPGetFlashChipSpeed
uint32_t nodeGetESPFlashChipSpeed()
{
	if (propertyFileReaded.indexOf("espflashchipspeed;") < 0)
		return espflashchipspeed = ESP.getFlashChipSpeed();
	else
		return espflashchipspeed;
}
bool nodeSetESPFlashChipSpeed(int _espflashchipspeed)
{
	return false;
}

//ESPGetSketchSize
uint32_t nodeGetESPSketchSize()
{
	if (propertyFileReaded.indexOf("espsketchsize;") < 0)
		return espsketchsize = ESP.getSketchSize();
	else
		return espsketchsize;
}
bool nodeSetESPSketchSize(int _espsketchsize)
{
	return false;
}

//ESPGetFreeSketchSpace
uint32_t nodeGetESPFreeSketchSpace()
{
	if (propertyFileReaded.indexOf("espfreesketchspace;") < 0)
		return espfreesketchspace = ESP.getFreeSketchSpace();
	else
		return espfreesketchspace;
}
bool nodeSetESPFreeSketchSpace(int _espfreesketchspace)
{
	return false;
}

//ESPGetFlashChipMode
FlashMode_t nodeGetESPFlashChipMode()
{
	if (propertyFileReaded.indexOf("espflashchipmode;") < 0)
		return espflashchipmode = ESP.getFlashChipMode();
	else
		return espflashchipmode;
}
bool nodeSetESPFlashChipMode(int _espflashchipmode)
{
	return false;
}

//ESPGetSketchMD5
String nodeGetESPSketchMD5()
{
	if (propertyFileReaded.indexOf("espsketchmd5;") < 0)
		return espsketchmd5 = ESP.getSketchMD5();
	else
		return espsketchmd5;
}
bool nodeSetESPSketchMD5(String _espsketchmd5)
{
	return false;
}

//ESPGetResetReason
String nodeGetESPResetReason()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espresetreason;") < 0)
		return espresetreason = ESP.getResetReason();
	else
		return espresetreason;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("espresetreason;") < 0)
		return espresetreason = "CPU1: " + String(rtc_get_reset_reason(0)) + ";CPU2: " + String(rtc_get_reset_reason(1)) + ";";
	else
		return espresetreason;

#endif
}
bool nodeSetESPResetReason(String _espresetreason)
{
	return false;
}

//ESPGetMagicFlashChipSize
uint32_t nodeGetESPMagicFlashChipSize(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipsize;") < 0)
		return espmagicflashchipsize = ESP.magicFlashChipSize(byte);
	else
		return espmagicflashchipsize;
}
bool nodeSetESPMagicFlashChipSize(int _espmagicflashchipsize)
{
	return false;
}

//ESPGetMagicFlashChipSpeed
uint32_t nodeGetESPMagicFlashChipSpeed(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipspeed;") < 0)
		return espmagicflashchipspeed = ESP.magicFlashChipSpeed(byte);
	else
		return espmagicflashchipspeed;
}
bool nodeSetESPMagicFlashChipSpeed(int _espmagicflashchipspeed)
{
	return false;
}

//ESPGetMagicFlashChipMode
FlashMode_t nodeGetESPMagicFlashChipMode(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipmode;") < 0)
		return espmagicflashchipmode = ESP.magicFlashChipMode(byte);
	else
		return espmagicflashchipmode;
}
bool nodeSetESPMagicFlashChipMode(int _espmagicflashchipmode)
{
	return false;
}

#endif
