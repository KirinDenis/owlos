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

#define DONT_USE_FILES


#define DEFAULT_HTTP_SERVER_AVAILABLE true
#define DEFAULT_HTTP_SERVER_USERNAME "admin"
#define DEFAULT_HTTP_SERVER_PASSWORD "admin"
#define DEFAULT_HTTP_SERVER_PORT 8084
#define DEFAULT_HTTP_CLIENT_PORT 8080
#define DEFAULT_HTTP_CLIENT_URL ""

#define DEFAULT_MQTT_CLIENT_AVAILABLE true
#define DEFAULT_MQTT_CLIENT_PORT 1883
#define DEFAULT_MQTT_CLIENT_URL "mqtt.eclipse.org"
#define DEFAULT_MQTT_CLIENT_ID ""
#define DEFAULT_MQTT_CLIENT_LOGIN ""
#define DEFAULT_MQTT_CLIENT_PASSWORD ""

#define DEFAULT_OTA_CLIENT_AVAILABLE false
#define DEFAULT_OTA_CLIENT_PORT 8266
#define DEFAULT_OTA_CLIENT_ID "owlnode"
#define DEFAULT_OTA_CLIENT_PASSWORD "cas777"

//Update 
#define DEFAULT_UPDATE_AVAILABLE true
#define DEFAULT_UPDATE_HOST "http://81.95.178.177:8080/update/"

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
extern "C" int rom_phy_get_vdd33();
#endif

//to make read property from file once, use this CSV string
String propertyFileReaded("");

//Unit Private properties
String nodeid(DEFAULT_ID); //current Unit ID for transport (MQTT) topic and other identification inside system 
String topic(DEFAULT_TOPIC); //current Unit ROOT topic
String firmwareversion(FIRMWARE_VERSION);
int firmwarebuildnumber(FIRMWARE_BUILD_NUMBER);
int restfulavailable(DEFAULT_HTTP_SERVER_AVAILABLE);
String webserverlogin(DEFAULT_HTTP_SERVER_USERNAME);
String webserverpwd(DEFAULT_HTTP_SERVER_PASSWORD);
int restfulserverport(DEFAULT_HTTP_SERVER_PORT);
int restfulclientport(DEFAULT_HTTP_CLIENT_PORT);
String restfulclienturl(DEFAULT_HTTP_CLIENT_URL);
int mqttavailable(DEFAULT_MQTT_CLIENT_AVAILABLE);
int mqttport(DEFAULT_MQTT_CLIENT_PORT);
String mqtturl(DEFAULT_MQTT_CLIENT_URL);
String mqttid(DEFAULT_MQTT_CLIENT_URL);
String mqttlogin(DEFAULT_MQTT_CLIENT_LOGIN);
String mqttpassword(DEFAULT_MQTT_CLIENT_PASSWORD);
//int mqttclientconnected(DefaultMQTTClientConnected);
int otaavailable(DEFAULT_OTA_CLIENT_AVAILABLE);
int otaport(DEFAULT_OTA_CLIENT_PORT);
String otaid(DEFAULT_OTA_CLIENT_ID);
String otapassword(DEFAULT_OTA_CLIENT_PASSWORD);

//WiFi properties

// ESP properties
String espresetinfo(DEFAULT_EMPTY_STR_VALUE);
int espreset(DEFAULT_ZERO_VALUE);
int esprestart(DEFAULT_ZERO_VALUE);
uint16_t espvcc(DEFAULT_ZERO_VALUE);
uint32_t espchipid(DEFAULT_ZERO_VALUE);
uint32_t espfreeheap(DEFAULT_ZERO_VALUE);
uint16_t espmaxfreeblocksize(DEFAULT_ZERO_VALUE);
uint8_t espheapfragmentation(DEFAULT_ZERO_VALUE);
const char * espsdkversion(DEFAULT_EMPTY_STR_VALUE);
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

//Update 
int updateavailable(DEFAULT_UPDATE_AVAILABLE);
String updatehost(DEFAULT_UPDATE_HOST);


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

	String result = nodeGetWiFiProperties();
	result += "properties for:network\n";
	result += "id=network//r\n";
	result += "type=" + String(NetworkType) + "//r\n";
	result += "firmwareversion=" + nodeGetFirmwareVersion() + "//r\n";
	result += "firmwarebuildnumber=" + String(nodeGetFirmwareBuildNumber()) + "//ri\n";
	result += "nodeid=" + nodeGetUnitId() + "//\n";
	result += "topic=" + nodeGetTopic() + "//\n";
	result += "restfulavailable=" + String(nodeGetRESTfulAvailable()) + "//bs\n";
	result += "webserverlogin=" + nodeGetRESTfulServerUsername() + "//\n";
	result += "webserverpwd=" + nodeGetRESTfulServerPassword() + "//sp\n";
	result += "restfulserverport=" + String(nodeGetRESTfulServerPort()) + "//i\n";
	result += "restfulclientport=" + String(nodeGetRESTfulClientPort()) + "//i\n";
	result += "restfulclienturl=" + nodeGetRESTfulClientURL() + "//\n";
	result += "mqttavailable=" + String(nodeGetMQTTAvailable()) + "//bs\n";
	result += "mqttport=" + String(nodeGetMQTTPort()) + "//i\n";
	result += "mqtturl=" + nodeGetMQTTURL() + "//\n";
	result += "mqttid=" + nodeGetMQTTID() + "//\n";
	result += "mqttlogin=" + nodeGetMQTTLogin() + "//\n";
	result += "mqttpassword=" + nodeGetMQTTPassword() + "//p\n";
	result += "mqttclientconnected=" + String(nodeGetMQTTClientConnected()) + "//bs\n";
	result += "mqttclientstate=" + String(nodeGetMQTTClientState()) + "//i\n";

	result += "otaavailable=" + String(nodeGetOTAAvailable()) + "//bs\n";
	result += "otaport=" + String(nodeGetOTAPort()) + "//i\n";
	result += "otaid=" + nodeGetOTAID() + "//\n";
	result += "otapassword=" + nodeGetOTAPassword() + "//p\n";
	result += "updateavailable=" + String(nodeGetUpdateAvailable()) + "//bs\n";
#ifdef USE_UPDATE	
	result += "updatepossible=" + String(updateGetUpdatePossible()) + "//ir\n";
	result += "updateinfo=" + String(updateGetUpdateInfo()) + "//r\n";
	result += "updateuistatus=" + String(updateGetUpdateUIStatus()) + "//ir\n";
	result += "updatefirmwarestatus=" + String(updateGetUpdateFirmwareStatus()) + "//ir\n";
#endif	
	result += "updatehost=" + nodeGetUpdateHost() + "//s\n";



	result += "properties for:esp\n";
	result += "id=esp//r\n";
	result += "type=" + String(ESPType) + "//r\n";
	result += "espresetinfo=" + nodeGetESPResetInfo() + "//r\n";
	result += "espreset=" + String(nodeGetESPReset()) + "//sb\n";
	result += "esprestart=" + String(nodeGetESPRestart()) + "//b\n";
	result += "espvcc=" + String(nodeGetESPVcc()) + "//r\n";
	result += "espchipid=" + String(nodeGetESPChipId()) + "//sr\n";
	result += "espfreeheap=" + String(nodeGetESPFreeHeap()) + "//sri\n";
	result += "espmaxfreeblocksize=" + String(nodeGetESPMaxFreeBlockSize()) + "//ri\n";
	result += "espheapfragmentation=" + String(nodeGetESPHeapFragmentation()) + "//ri\n";
	result += "espsdkversion=" + String(*nodeGetESPSdkVersion()) + "//r\n";
	result += "espcoreversion=" + nodeGetESPCoreVersion() + "//r\n";
	result += "espfullversion=" + nodeGetESPFullVersion() + "//r\n";
	result += "espbootversion=" + String(nodeGetESPBootVersion()) + "//r\n";
	result += "espbootmode=" + String(nodeGetESPBootMode()) + "//r\n";
	result += "espcpufreqmhz=" + String(nodeGetESPCpuFreqMHz()) + "//r\n";
	result += "espflashchipid=" + String(nodeGetESPFlashChipId()) + "//r\n";
	result += "espflashchipvendorid=" + String(nodeGetESPFlashChipVendorId()) + "//r\n";
	result += "espflashchiprealsize=" + String(nodeGetESPFlashChipRealSize()) + "//r\n";
	result += "espflashchipsize=" + String(nodeGetESPFlashChipSize()) + "//r\n";
	result += "espflashchipspeed=" + String(nodeGetESPFlashChipSpeed()) + "//r\n";
	result += "espsketchsize=" + String(nodeGetESPSketchSize()) + "//r\n";
	result += "espfreesketchspace=" + String(nodeGetESPFreeSketchSpace()) + "//r\n";
	result += "espflashchipmode=" + String(nodeGetESPFlashChipMode()) + "//r\n";
	result += "espsketchmd5=" + nodeGetESPSketchMD5() + "//r\n";
	result += "espresetreason=" + nodeGetESPResetReason() + "//sr\n";
	result += "espmagicflashchipsize=" + String(espmagicflashchipsize) + "//r\n";
	result += "espmagicflashchipspeed=" + String(espmagicflashchipspeed) + "//r\n";
	result += "espmagicflashchipmode=" + String(espmagicflashchipmode) + "//r\n";
	//Pins 
	//result += "busypins=" + nodeGetBusyPins() + "//rs\n";
	//result += "pinsmap=" + nodeGetPinsMap() + "//r\n";

	return result;
}


void nodeSubscribe()
{
	transportSubscribe(topic + "/#");
}

String onGetProperty(String _property, String _payload, int8_t transportMask)
{
#ifdef DetailedDebug 
	debugOut(nodeid, "|-> get property " + _property + " = " + _payload);
#endif 
	if (transportMask && MQTTMask != 0)
	{
		transportPublish(topic + "/" + _property, _payload);
	}
	return _payload;
}

String nodeOnMessage(String _topic, String _payload, int8_t transportMask)
{	
	String result = wifiOnMessage(_topic, _payload, transportMask);
    if (!result.equals(WrongPropertyName))
        return result;
	if (String(topic + "/getnodeid").equals(_topic)) return onGetProperty("id", nodeGetUnitId(), transportMask);
	else
		if (String(topic + "/setnodeid").equals(_topic)) return String(nodeSetUnitId(_payload));
		
		else
			if (String(topic + "/gettopic").equals(_topic)) return onGetProperty("topic", nodeGetTopic(), transportMask);
			else
				if (String(topic + "/settopic").equals(_topic)) return String(nodeSetTopic(_payload));
				else
					if (String(topic + "/getfirmwareversion").equals(_topic)) return onGetProperty("firmwareversion", nodeGetFirmwareVersion(), transportMask);
					else
						if (String(topic + "/setfirmwareversion").equals(_topic)) return String(nodeSetFirmwareVersion(_payload));
						else
							if (String(topic + "/getfirmwarebuildnumber").equals(_topic)) return onGetProperty("firmwarebuildnumber", String(nodeGetFirmwareBuildNumber()), transportMask);
							else
								if (String(topic + "/setfirmwarebuildnumber").equals(_topic)) return String(nodeSetFirmwareBuildNumber(atoi(_payload.c_str())));
																											else
																												if (String(topic + "/getrestfulavailable").equals(_topic)) return onGetProperty("restfulavailable", String(nodeGetRESTfulAvailable()), transportMask);
																												else
																													if (String(topic + "/setrestfulavailable").equals(_topic)) return String(nodeSetRESTfulAvailable(atoi(_payload.c_str())));
																													else
																														if (String(topic + "/getwebserverlogin").equals(_topic)) return onGetProperty("webserverlogin", nodeGetRESTfulServerUsername(), transportMask);
																														else
																															if (String(topic + "/setwebserverlogin").equals(_topic)) return String(nodeSetRESTfulServerUsername(_payload));
																															else
																																if (String(topic + "/getwebserverpwd").equals(_topic)) return onGetProperty("webserverpwd", nodeGetRESTfulServerPassword(), transportMask);
																																else
																																	if (String(topic + "/setwebserverpwd").equals(_topic)) return String(nodeSetRESTfulServerPassword(_payload));
																																	else
																																		if (String(topic + "/getrestfulserverport").equals(_topic)) return onGetProperty("restfulserverport", String(nodeGetRESTfulServerPort()), transportMask);
																																		else
																																			if (String(topic + "/setrestfulserverport").equals(_topic)) return String(nodeSetRESTfulServerPort(atoi(_payload.c_str())));
																																			else
																																				if (String(topic + "/getrestfulclientport").equals(_topic)) return onGetProperty("restfulclientport", String(nodeGetRESTfulClientPort()), transportMask);
																																				else
																																					if (String(topic + "/setrestfulclientport").equals(_topic)) return String(nodeSetRESTfulClientPort(atoi(_payload.c_str())));
																																					else
																																						if (String(topic + "/getrestfulclienturl").equals(_topic)) return onGetProperty("restfulclienturl", nodeGetRESTfulClientURL(), transportMask);
																																						else
																																							if (String(topic + "/setrestfulclienturl").equals(_topic)) return String(nodeSetRESTfulClientURL(_payload));
																																							else
																																								if (String(topic + "/getmqttavailable").equals(_topic)) return onGetProperty("mqttavailable", String(nodeGetMQTTAvailable()), transportMask);
																																								else
																																									if (String(topic + "/setmqttavailable").equals(_topic)) return String(nodeSetMQTTAvailable(atoi(_payload.c_str())));
																																									else
																																										if (String(topic + "/getmqttport").equals(_topic)) return onGetProperty("mqttport", String(nodeGetMQTTPort()), transportMask);
																																										else
																																											if (String(topic + "/setmqttport").equals(_topic)) return String(nodeSetMQTTPort(atoi(_payload.c_str())));
																																											else
																																												if (String(topic + "/getmqtturl").equals(_topic)) return onGetProperty("mqtturl", nodeGetMQTTURL(), transportMask);
																																												else
																																													if (String(topic + "/setmqtturl").equals(_topic)) return String(nodeSetMQTTURL(_payload));
																																													else
																																														if (String(topic + "/getmqttid").equals(_topic)) return onGetProperty("mqttid", nodeGetMQTTID(), transportMask);
																																														else
																																															if (String(topic + "/setmqttid").equals(_topic)) return String(nodeSetMQTTID(_payload));
																																															else
																																																if (String(topic + "/getmqttlogin").equals(_topic)) return onGetProperty("mqttlogin", nodeGetMQTTLogin(), transportMask);
																																																else
																																																	if (String(topic + "/setmqttlogin").equals(_topic)) return String(nodeSetMQTTLogin(_payload));
																																																	else
																																																		if (String(topic + "/getmqttpassword").equals(_topic)) return onGetProperty("mqttpassword", nodeGetMQTTPassword(), transportMask);
																																																		else
																																																			if (String(topic + "/setmqttpassword").equals(_topic)) return String(nodeSetMQTTPassword(_payload));
																																																			else
																																																				if (String(topic + "/getmqttclientconnected").equals(_topic)) return String(nodeGetMQTTClientConnected());
																																																				else
																																																					if (String(topic + "/getmqttclientstate").equals(_topic)) return String(nodeGetMQTTClientState());
																																																					else
																																																						if (String(topic + "/getotaavailable").equals(_topic)) return onGetProperty("otaavailable", String(nodeGetOTAAvailable()), transportMask);
																																																						else
																																																							if (String(topic + "/setotaavailable").equals(_topic)) return String(nodeSetOTAAvailable(atoi(_payload.c_str())));
																																																							else
																																																								if (String(topic + "/getotaport").equals(_topic)) return onGetProperty("otaport", String(nodeGetOTAPort()), transportMask);
																																																								else
																																																									if (String(topic + "/setotaport").equals(_topic)) return String(nodeSetOTAPort(atoi(_payload.c_str())));
																																																									else
																																																										if (String(topic + "/getotaid").equals(_topic)) return onGetProperty("otaid", nodeGetOTAID(), transportMask);
																																																										else
																																																											if (String(topic + "/setotaid").equals(_topic)) return String(nodeSetOTAID(_payload));
																																																											else
																																																												if (String(topic + "/getotapassword").equals(_topic)) return onGetProperty("otapassword", nodeGetMQTTPassword(), transportMask);
																																																												else
																																																													if (String(topic + "/setotapassword").equals(_topic)) return String(nodeSetOTAPassword(_payload));
	// WiFi parameters
	
	//ESP class parameters
																																																																													else
																																																																														if (String(topic + "/getespresetinfo").equals(_topic)) return onGetProperty("espresetinfo", nodeGetESPResetInfo(), transportMask);
																																																																														else
																																																																															if (String(topic + "/setespresetinfo").equals(_topic)) return String(nodeSetESPResetInfo(_payload));
																																																																															else
																																																																																if (String(topic + "/getespreset").equals(_topic)) return onGetProperty("espreset", String(nodeGetESPReset()), transportMask);
																																																																																else
																																																																																	if (String(topic + "/setespreset").equals(_topic)) return String(nodeSetESPReset(atoi(_payload.c_str())));
																																																																																	else
																																																																																		if (String(topic + "/getesprestart").equals(_topic)) return onGetProperty("esprestart", String(nodeGetESPRestart()), transportMask);
																																																																																		else
																																																																																			if (String(topic + "/setesprestart").equals(_topic)) return String(nodeSetESPRestart(atoi(_payload.c_str())));
																																																																																			else
																																																																																				if (String(topic + "/getespvcc").equals(_topic)) return onGetProperty("espvcc", String(nodeGetESPVcc()), transportMask);
																																																																																				else
																																																																																					if (String(topic + "/setespvcc").equals(_topic)) return String(nodeSetESPVcc(atoi(_payload.c_str())));
																																																																																					else
																																																																																						if (String(topic + "/getespchipid").equals(_topic)) return onGetProperty("espchipid", String(nodeGetESPChipId()), transportMask);
																																																																																						else
																																																																																							if (String(topic + "/setespchipid").equals(_topic)) return String(nodeSetESPChipId(atoi(_payload.c_str())));
																																																																																							else
																																																																																								if (String(topic + "/getespfreeheap").equals(_topic)) return onGetProperty("espfreeheap", String(nodeGetESPFreeHeap()), transportMask);
																																																																																								else
																																																																																									if (String(topic + "/setespfreeheap").equals(_topic)) return String(nodeSetESPFreeHeap(atoi(_payload.c_str())));
																																																																																									else
																																																																																										if (String(topic + "/getespmaxfreeblocksize").equals(_topic)) return onGetProperty("espmaxfreeblocksize", String(nodeGetESPMaxFreeBlockSize()), transportMask);
																																																																																										else
																																																																																											if (String(topic + "/setespmaxfreeblocksize").equals(_topic)) return String(nodeSetESPMaxFreeBlockSize(atoi(_payload.c_str())));
																																																																																											else
																																																																																												if (String(topic + "/getespheapfragmentation").equals(_topic)) return onGetProperty("espheapfragmentation", String(nodeGetESPHeapFragmentation()), transportMask);
																																																																																												else
																																																																																													if (String(topic + "/setespheapfragmentation").equals(_topic)) return String(nodeSetESPHeapFragmentation(atoi(_payload.c_str())));
																																																																																													else
																																																																																														if (String(topic + "/getespsdkversion").equals(_topic)) return onGetProperty("espsdkversion", String(*nodeGetESPSdkVersion()), transportMask);
																																																																																														else
																																																																																															if (String(topic + "/setespsdkversion").equals(_topic)) return String(nodeSetESPSdkVersion(_payload));
																																																																																															else
																																																																																																if (String(topic + "/getespcoreversion").equals(_topic)) return onGetProperty("espcoreversion", nodeGetESPCoreVersion(), transportMask);
																																																																																																else
																																																																																																	if (String(topic + "/setespcoreversion").equals(_topic)) return String(nodeSetESPCoreVersion(_payload));
																																																																																																	else
																																																																																																		if (String(topic + "/getespfullversion").equals(_topic)) return onGetProperty("espfullversion", nodeGetESPFullVersion(), transportMask);
																																																																																																		else
																																																																																																			if (String(topic + "/setespfullversion").equals(_topic)) return String(nodeSetESPFullVersion(_payload));
																																																																																																			else
																																																																																																				if (String(topic + "/getespbootversion").equals(_topic)) return onGetProperty("espbootversion", String(nodeGetESPBootVersion()), transportMask);
																																																																																																				else
																																																																																																					if (String(topic + "/setespbootversion").equals(_topic)) return String(nodeSetESPBootVersion(atoi(_payload.c_str())));
																																																																																																					else
																																																																																																						if (String(topic + "/getespbootmode").equals(_topic)) return onGetProperty("espbootmode", String(nodeGetESPBootMode()), transportMask);
																																																																																																						else
																																																																																																							if (String(topic + "/setespbootmode").equals(_topic)) return String(nodeSetESPBootMode(atoi(_payload.c_str())));
																																																																																																							else
																																																																																																								if (String(topic + "/getespcpufreqmhz").equals(_topic)) return onGetProperty("espcpufreqmhz", String(nodeGetESPCpuFreqMHz()), transportMask);
																																																																																																								else
																																																																																																									if (String(topic + "/setespcpufreqmhz").equals(_topic)) return String(nodeSetESPCpuFreqMHz(atoi(_payload.c_str())));
																																																																																																									else
																																																																																																										if (String(topic + "/getespflashchipid").equals(_topic)) return onGetProperty("espflashchipid", String(nodeGetESPFlashChipId()), transportMask);
																																																																																																										else
																																																																																																											if (String(topic + "/setespflashchipid").equals(_topic)) return String(nodeSetESPFlashChipId(atoi(_payload.c_str())));
																																																																																																											else
																																																																																																												if (String(topic + "/getespflashchipvendorid").equals(_topic)) return onGetProperty("espflashchipvendorid", String(nodeGetESPFlashChipVendorId()), transportMask);
																																																																																																												else
																																																																																																													if (String(topic + "/setespflashchipvendorid").equals(_topic)) return String(nodeSetESPFlashChipVendorId(atoi(_payload.c_str())));
																																																																																																													else
																																																																																																														if (String(topic + "/getespflashchiprealsize").equals(_topic)) return onGetProperty("espflashchiprealsize", String(nodeGetESPFlashChipRealSize()), transportMask);
																																																																																																														else
																																																																																																															if (String(topic + "/setespflashchiprealsize").equals(_topic)) return String(nodeSetESPFlashChipRealSize(atoi(_payload.c_str())));
																																																																																																															else
																																																																																																																if (String(topic + "/getespflashchipsize").equals(_topic)) return onGetProperty("espflashchipsize", String(nodeGetESPFlashChipSize()), transportMask);
																																																																																																																else
																																																																																																																	if (String(topic + "/setespflashchipsize").equals(_topic)) return String(nodeSetESPFlashChipSize(atoi(_payload.c_str())));
																																																																																																																	else
																																																																																																																		if (String(topic + "/getespflashchipspeed").equals(_topic)) return onGetProperty("espflashchipspeed", String(nodeGetESPFlashChipSpeed()), transportMask);
																																																																																																																		else
																																																																																																																			if (String(topic + "/setespflashchipspeed").equals(_topic)) return String(nodeSetESPFlashChipSpeed(atoi(_payload.c_str())));
																																																																																																																			else
																																																																																																																				if (String(topic + "/getespsketchsize").equals(_topic)) return onGetProperty("espsketchsize", String(nodeGetESPSketchSize()), transportMask);
																																																																																																																				else
																																																																																																																					if (String(topic + "/setespsketchsize").equals(_topic)) return String(nodeSetESPSketchSize(atoi(_payload.c_str())));
																																																																																																																					else
																																																																																																																						if (String(topic + "/getespfreesketchspace").equals(_topic)) return onGetProperty("espfreesketchspace", String(nodeGetESPFreeSketchSpace()), transportMask);
																																																																																																																						else
																																																																																																																							if (String(topic + "/setespfreesketchspace").equals(_topic)) return String(nodeSetESPFreeSketchSpace(atoi(_payload.c_str())));
																																																																																																																							else
																																																																																																																								if (String(topic + "/getespflashchipmode").equals(_topic)) return onGetProperty("espflashchipmode", String(nodeGetESPFlashChipMode()), transportMask);
																																																																																																																								else
																																																																																																																									if (String(topic + "/setespflashchipmode").equals(_topic)) return String(nodeSetESPFlashChipMode(atoi(_payload.c_str())));
																																																																																																																									else
																																																																																																																										if (String(topic + "/getespsketchmd5").equals(_topic)) return onGetProperty("espsketchmd5", nodeGetESPSketchMD5(), transportMask);
																																																																																																																										else
																																																																																																																											if (String(topic + "/setespsketchmd5").equals(_topic)) return String(nodeSetESPSketchMD5(_payload));
																																																																																																																											else
																																																																																																																												if (String(topic + "/getespresetreason").equals(_topic)) return onGetProperty("espresetreason", nodeGetESPResetReason(), transportMask);
																																																																																																																												else
																																																																																																																													if (String(topic + "/setespresetreason").equals(_topic)) return String(nodeSetESPResetReason(_payload));
																																																																																																																													else
																																																																																																																														if (String(topic + "/getespmagicflashchipsize").equals(_topic)) return onGetProperty("espmagicflashchipsize", String(nodeGetESPMagicFlashChipSize((uint8_t)atoi(_payload.c_str()))), transportMask);
																																																																																																																														else
																																																																																																																															if (String(topic + "/setespmagicflashchipsize").equals(_topic)) return String(nodeSetESPMagicFlashChipSize(atoi(_payload.c_str())));
																																																																																																																															else
																																																																																																																																if (String(topic + "/getespmagicflashchipspeed").equals(_topic)) return onGetProperty("espmagicflashchipspeed", String(nodeGetESPMagicFlashChipSpeed((uint8_t)atoi(_payload.c_str()))), transportMask);
																																																																																																																																else
																																																																																																																																	if (String(topic + "/setespmagicflashchipspeed").equals(_topic)) return String(nodeSetESPMagicFlashChipSpeed(atoi(_payload.c_str())));
																																																																																																																																	else
																																																																																																																																		if (String(topic + "/getespmagicflashchipmode").equals(_topic)) return onGetProperty("espmagicflashchipmode", String(nodeGetESPMagicFlashChipMode((uint8_t)atoi(_payload.c_str()))), transportMask);
																																																																																																																																		else
																																																																																																																																			if (String(topic + "/setespmagicflashchipmode").equals(_topic)) return String(nodeSetESPMagicFlashChipMode(atoi(_payload.c_str())));
	//Pins
																																																																																																																																			else
																																																																																																																																				//if (String(topic + "/getbusypins").equals(_topic)) return nodeGetBusyPins();
																																																																																																																																				//else
																																																																																																																																					//if (String(topic + "/getpinsmap").equals(_topic)) return nodeGetPinsMap();
																																																																																																																																					//else
																																																																																																																																				if (String(topic + "/getupdateavailable").equals(_topic)) return onGetProperty("updateavailable", String(nodeGetUpdateAvailable()), transportMask);
																																																																																																																																				else
																																																																																																																																				#ifdef USE_UPDATE	
																																																																																																																																					if (String(topic + "/setupdateavailable").equals(_topic)) return String(nodeSetUpdateAvailable(atoi(_payload.c_str())));
																																																																																																																																					else
																																																																																																																																					if (String(topic + "/getupdatepossible").equals(_topic)) return onGetProperty("updatepossible", String(updateGetUpdatePossible()), transportMask);
																																																																																																																																					else
																																																																																																																																						if (String(topic + "/getupdateinfo").equals(_topic)) return onGetProperty("updateinfo", String(updateGetUpdateInfo()), transportMask);
																																																																																																																																						else
																																																																																																																																								if (String(topic + "/getupdateuistatus").equals(_topic)) return onGetProperty("updateuistatus", String(updateGetUpdateUIStatus()), transportMask);
																																																																																																																																								else																																																																																																																																								
																																																																																																																																									if (String(topic + "/getupdatefirmwarestatus").equals(_topic)) return onGetProperty("updateufirmwarestatus", String(updateGetUpdateFirmwareStatus()), transportMask);
																																																																																																																																									else
																																																																																																																																									#endif
																																																																																																																																										if (String(topic + "/getupdatehost").equals(_topic)) return onGetProperty("updatehost", nodeGetUpdateHost(), transportMask);
																																																																																																																																										else
																																																																																																																																											if (String(topic + "/setupdatehost").equals(_topic)) return String(nodeSetUpdateHost(_payload));
																																																																																																																																											else
																																																																																																																																											
																																																																																																																																												//Update 
																																																																																																																																												return result;
		
 return "";																																																																																																																																										
}

bool lock = false;

bool onInsideChange(String _property, String _value)
{
#ifdef DetailedDebug 
	debugOut(nodeid, "|<- inside change " + _property + " = " + _value);
#endif

	bool result = false;
	if (!lock)
	{
		lock = true;
		result = filesWriteString(String(DEFAULT_ID) + "." + _property, _value);

		
			result = transportPublish(topic + "/" + _property, _value);

#ifdef DetailedDebug 
		debugOut(nodeid, "|-> inside change ");
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
		nodeOnMessage(topic + "/set" + _property, result, NoTransportMask);
#endif
	}
	propertyFileReaded += _property + ";";
#ifdef DetailedDebug 
	debugOut(nodeid, _property + "=" + result);
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
		nodeOnMessage(topic + "/set" + _property, String(result), NoTransportMask);
#endif
	}
	propertyFileReaded += _property + ";";
#ifdef DetailedDebug 	
	debugOut(nodeid, _property + "=" + String(result));
#endif	
	return result;
}

//Getters and Setters section ---------------------------------------------------------------
String nodeGetUnitId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("nodeid;") < 0) return nodeid = _getStringPropertyValue("nodeid", DEFAULT_ID + String(ESP.getChipId(), HEX));
	else return nodeid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4

	if (propertyFileReaded.indexOf("nodeid;") < 0) return nodeid = _getStringPropertyValue("nodeid", DEFAULT_ID + String((int)ESP.getEfuseMac(), (unsigned char)HEX));

	else return nodeid;
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
	if (propertyFileReaded.indexOf("topic;") < 0) return topic = _getStringPropertyValue("topic", DEFAULT_TOPIC + nodeid);
	else return topic;
}

bool nodeSetTopic(String _topic)
{
	topic = _topic;
	return  onInsideChange("topic", String(topic));
}

//GetFirmwareVersion
String nodeGetFirmwareVersion()
{
	/*  if (propertyFileReaded.indexOf("firmwareversion;") < 0) return firmwareversion = _getStringPropertyValue("firmwareversion", FIRMWARE_VERSION);
	  else */ return firmwareversion;
}
bool nodeSetFirmwareVersion(String _firmwareversion)
{
	return false;
}

//GetFirmwareBuildNumber
int nodeGetFirmwareBuildNumber()
{
	/*  if (propertyFileReaded.indexOf("firmwarebuildnumber;") < 0) return firmwarebuildnumber = _getIntPropertyValue("firmwarebuildnumber", FIRMWARE_BUILD_NUMBER);
	  else */ return firmwarebuildnumber;
}
bool nodeSetFirmwareBuildNumber(int _firmwarebuildnumber)
{
	return false;
}

//RESTfulAvailable()  
int nodeGetRESTfulAvailable()
{
	if (propertyFileReaded.indexOf("restfulavailable;") < 0)
	{
		return restfulavailable = _getIntPropertyValue("restfulavailable", DEFAULT_HTTP_SERVER_AVAILABLE);
	}
	else
	{
		return restfulavailable;
	}
}
bool nodeSetRESTfulAvailable(int _restfulavailable)
{
	restfulavailable = _restfulavailable;
	return  onInsideChange("restfulavailable", String(restfulavailable));
}

//RESTfulServerUsername
String nodeGetRESTfulServerUsername()
{
	if (propertyFileReaded.indexOf("webserverlogin;") < 0) return webserverlogin = _getStringPropertyValue("webserverlogin", DEFAULT_HTTP_SERVER_USERNAME);
	else return webserverlogin;
}
bool nodeSetRESTfulServerUsername(String _webserverlogin)
{
	webserverlogin = _webserverlogin;
	return  onInsideChange("webserverlogin", String(webserverlogin));
}

//RESTfulServerPassword
String nodeGetRESTfulServerPassword()
{
	if (propertyFileReaded.indexOf("webserverpwd;") < 0) return webserverpwd = _getStringPropertyValue("webserverpwd", DEFAULT_HTTP_SERVER_PASSWORD);
	else return webserverpwd;
}
bool nodeSetRESTfulServerPassword(String _webserverpwd)
{
	webserverpwd = _webserverpwd;
	return  onInsideChange("webserverpwd", String(webserverpwd));
}

//RESTfulServerPort()  
int nodeGetRESTfulServerPort()
{
	if (propertyFileReaded.indexOf("restfulserverport;") < 0)
	{
		return restfulserverport = _getIntPropertyValue("restfulserverport", DEFAULT_HTTP_SERVER_PORT);
	}
	else
	{
		return restfulserverport;
	}
}
bool nodeSetRESTfulServerPort(int _restfulserverport)
{
	restfulserverport = _restfulserverport;
	return  onInsideChange("restfulserverport", String(restfulserverport));
}

//RESTfulClientPort()  
int nodeGetRESTfulClientPort()
{
	if (propertyFileReaded.indexOf("restfulclientport;") < 0) return restfulclientport = _getIntPropertyValue("restfulclientport", DEFAULT_HTTP_CLIENT_PORT);
	else return restfulclientport;
}
bool nodeSetRESTfulClientPort(int _restfulclientport)
{
	restfulclientport = _restfulclientport;
	return  onInsideChange("restfulclientport", String(restfulclientport));
}

//RESTfulClientURL()  
String nodeGetRESTfulClientURL()
{
	if (propertyFileReaded.indexOf("restfulclienturl;") < 0) return restfulclienturl = _getStringPropertyValue("restfulclienturl", DEFAULT_HTTP_CLIENT_URL);
	else return restfulclienturl;
}
bool nodeSetRESTfulClientURL(String _restfulclienturl)
{
	restfulclienturl = _restfulclienturl;
	return  onInsideChange("restfulclienturl", String(restfulclienturl));
}

//MQTTAvailable()  
int nodeGetMQTTAvailable()
{
	if (propertyFileReaded.indexOf("mqttavailable;") < 0)
	{
		return mqttavailable = _getIntPropertyValue("mqttavailable", DEFAULT_MQTT_CLIENT_AVAILABLE);
	}
	else
	{
		return mqttavailable;
	}
}
bool nodeSetMQTTAvailable(int _mqttavailable)
{
	mqttavailable = _mqttavailable;
	return  onInsideChange("mqttavailable", String(mqttavailable));
}

//MQTTPort()  
int nodeGetMQTTPort()
{
	if (propertyFileReaded.indexOf("mqttport;") < 0) return mqttport = _getIntPropertyValue("mqttport", DEFAULT_MQTT_CLIENT_PORT);
	else return mqttport;
}
bool nodeSetMQTTPort(int _mqttport)
{
	mqttport = _mqttport;
	return  onInsideChange("mqttport", String(mqttport));
}

//MQTTURL()  
String nodeGetMQTTURL()
{
	if (propertyFileReaded.indexOf("mqtturl;") < 0) return mqtturl = _getStringPropertyValue("mqtturl", DEFAULT_MQTT_CLIENT_URL);
	else return mqtturl;
}
bool nodeSetMQTTURL(String _mqtturl)
{
	mqtturl = _mqtturl;
	return  onInsideChange("mqtturl", String(mqtturl));
}

//MQTTID()  
String nodeGetMQTTID()
{
	if (propertyFileReaded.indexOf("mqttid;") < 0) return mqttid = _getStringPropertyValue("mqttid", DEFAULT_MQTT_CLIENT_ID);
	else return mqttid;
}

bool nodeSetMQTTID(String _mqttid)
{
	mqttid = _mqttid;
	return  onInsideChange("mqttid", String(mqttid));
}

//MQTTLogin()  
String nodeGetMQTTLogin()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("mqttlogin;") < 0) return mqttlogin = _getStringPropertyValue("mqttlogin", DEFAULT_MQTT_CLIENT_LOGIN + String(ESP.getChipId(), HEX));
	else return mqttlogin;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("mqttlogin;") < 0) return mqttlogin = _getStringPropertyValue("mqttlogin", DEFAULT_MQTT_CLIENT_LOGIN + String((int)ESP.getEfuseMac(), (unsigned char)HEX));
	else return mqttlogin;
#endif	
}
bool nodeSetMQTTLogin(String _mqttlogin)
{
	mqttlogin = _mqttlogin;
	return  onInsideChange("mqttlogin", String(mqttlogin));
}

//MQTTPassword()  
String nodeGetMQTTPassword()
{
	if (propertyFileReaded.indexOf("mqttpassword;") < 0) return mqttpassword = _getStringPropertyValue("mqttpassword", DEFAULT_MQTT_CLIENT_PASSWORD);
	else return mqttpassword;
}
bool nodeSetMQTTPassword(String _mqttpassword)
{
	mqttpassword = _mqttpassword;
	return  onInsideChange("mqttpassword", String(mqttpassword));
}

//MQTTClientConnected
int nodeGetMQTTClientConnected()
{
//	return (int)(getMQTTClient()->connected());
return 1;
}

//MQTTClientState
int nodeGetMQTTClientState()
{
//	return getMQTTClient()->state();
return 1;
}

//OTAAvailable()  
int nodeGetOTAAvailable()
{	
	if (propertyFileReaded.indexOf("otaavailable;") < 0)
	{
		otaavailable = _getIntPropertyValue("otaavailable", DEFAULT_OTA_CLIENT_AVAILABLE);
		return otaavailable;
	}
	else
	{
		return otaavailable;
	}
}
bool nodeSetOTAAvailable(int _otaavailable)
{
	otaavailable = _otaavailable;
	return  onInsideChange("otaavailable", String(otaavailable));
}

//OTAPort()  
int nodeGetOTAPort()
{
	if (propertyFileReaded.indexOf("otaport;") < 0) return otaport = _getIntPropertyValue("otaport", DEFAULT_OTA_CLIENT_PORT);
	else return otaport;
}
bool nodeSetOTAPort(int _otaport)
{
	otaport = _otaport;
	return  onInsideChange("otaport", String(otaport));
}

//OTAID()  
String nodeGetOTAID()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("otaid;") < 0) return otaid = _getStringPropertyValue("otaid", DEFAULT_OTA_CLIENT_ID + String(ESP.getChipId()));
	else return otaid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("otaid;") < 0) return otaid = _getStringPropertyValue("otaid", DEFAULT_OTA_CLIENT_ID + String((int)ESP.getEfuseMac()));
	else return otaid;
#endif

}
bool nodeSetOTAID(String _otaid)
{
	otaid = _otaid;
	return  onInsideChange("otaid", String(otaid));
}

//OTAPassword()  
String nodeGetOTAPassword()
{
	if (propertyFileReaded.indexOf("otapassword;") < 0) return otapassword = _getStringPropertyValue("otapassword", DEFAULT_OTA_CLIENT_PASSWORD);
	else return otapassword;
}
bool nodeSetOTAPassword(String _otapassword)
{
	otapassword = _otapassword;
	return onInsideChange("otapassword", String(otapassword));
}

/**/
//ESPResetInfo()  
String nodeGetESPResetInfo()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espresetinfo;") < 0) return espresetinfo = ESP.getResetInfo();
	else return espresetinfo;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("espresetinfo;") < 0) return espresetinfo = "CPU1: " + String(rtc_get_reset_reason(0)) + ";CPU2: " + String(rtc_get_reset_reason(1)) + ";";
	else return espresetinfo;
#endif
}
bool nodeSetESPResetInfo(String _espresetinfo)
{
	return false;
}

//ESPReset()  
int nodeGetESPReset()
{
	if (propertyFileReaded.indexOf("espreset;") < 0) return espreset = DEFAULT_ZERO_VALUE;
	else return espreset;
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
	if (propertyFileReaded.indexOf("esprestart;") < 0) return esprestart = DEFAULT_ZERO_VALUE;
	else return esprestart;
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
	if (propertyFileReaded.indexOf("espvcc;") < 0) return espvcc = ESP.getVcc();
	else return espvcc;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4

	if (propertyFileReaded.indexOf("espvcc;") < 0) return espvcc = rom_phy_get_vdd33();
	else return espvcc;
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
	if (propertyFileReaded.indexOf("espchipid;") < 0) return espchipid = ESP.getChipId();
	else return espchipid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4	
	if (propertyFileReaded.indexOf("espchipid;") < 0) return espchipid = (int)ESP.getEfuseMac();
	else return espchipid;
#endif
}
bool nodeSetESPChipId(int _espchipid)
{
	return false;
}

//ESPGetFreeHeap()  
uint32_t nodeGetESPFreeHeap()
{
	if (propertyFileReaded.indexOf("espfreeheap;") < 0) return espfreeheap = ESP.getFreeHeap();
	else return espfreeheap;
}
bool nodeSetESPFreeHeap(int _espfreeheap)
{
	return false;
}

//ESPGetMaxFreeBlockSize
uint16_t nodeGetESPMaxFreeBlockSize()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espmaxfreeblocksize;") < 0) return espmaxfreeblocksize = ESP.getMaxFreeBlockSize();
	else return espmaxfreeblocksize;
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
	if (propertyFileReaded.indexOf("espheapfragmentation;") < 0) return espheapfragmentation = ESP.getHeapFragmentation();
	else return espheapfragmentation;
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
const char * nodeGetESPSdkVersion()
{
	if (propertyFileReaded.indexOf("espsdkversion;") < 0) return espsdkversion = ESP.getSdkVersion();
	else return espsdkversion;
}
bool nodeSetESPSdkVersion(String _espsdkversion)
{
	return false;
}

//ESPGetCoreVersion
String nodeGetESPCoreVersion()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espcoreversion;") < 0) return espcoreversion = ESP.getCoreVersion();
	else return espcoreversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return NotAvailable;
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
	if (propertyFileReaded.indexOf("espfullversion;") < 0) return espfullversion = ESP.getFullVersion();
	else return espfullversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return NotAvailable;
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
	if (propertyFileReaded.indexOf("espbootversion;") < 0) return espbootversion = ESP.getBootVersion();
	else return espbootversion;
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
	if (propertyFileReaded.indexOf("espbootmode;") < 0) return espbootmode = ESP.getBootMode();
	else return espbootmode;
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
	if (propertyFileReaded.indexOf("espcpufreqmhz;") < 0) return espcpufreqmhz = ESP.getCpuFreqMHz();
	else return espcpufreqmhz;
}
bool nodeSetESPCpuFreqMHz(int _espcpufreqmhz)
{
	return false;
}

//ESPGetFlashChipId
uint32_t nodeGetESPFlashChipId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espflashchipid;") < 0) return espflashchipid = ESP.getFlashChipId();
	else return espflashchipid;
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
	if (propertyFileReaded.indexOf("espflashchipvendorid;") < 0) return espflashchipvendorid = ESP.getFlashChipVendorId();
	else return espflashchipvendorid;
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
	if (propertyFileReaded.indexOf("espflashchiprealsize;") < 0) return espflashchiprealsize = ESP.getFlashChipRealSize();
	else return espflashchiprealsize;
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
	if (propertyFileReaded.indexOf("espflashchipsize;") < 0) return espflashchipsize = ESP.getFlashChipSize();
	else return espflashchipsize;
}
bool nodeSetESPFlashChipSize(int _espflashchipsize)
{
	return false;
}

//ESPGetFlashChipSpeed
uint32_t nodeGetESPFlashChipSpeed()
{
	if (propertyFileReaded.indexOf("espflashchipspeed;") < 0) return espflashchipspeed = ESP.getFlashChipSpeed();
	else return espflashchipspeed;
}
bool nodeSetESPFlashChipSpeed(int _espflashchipspeed)
{
	return false;
}

//ESPGetSketchSize
uint32_t nodeGetESPSketchSize()
{
	if (propertyFileReaded.indexOf("espsketchsize;") < 0) return espsketchsize = ESP.getSketchSize();
	else return espsketchsize;
}
bool nodeSetESPSketchSize(int _espsketchsize)
{
	return false;
}

//ESPGetFreeSketchSpace
uint32_t nodeGetESPFreeSketchSpace()
{
	if (propertyFileReaded.indexOf("espfreesketchspace;") < 0) return espfreesketchspace = ESP.getFreeSketchSpace();
	else return espfreesketchspace;
}
bool nodeSetESPFreeSketchSpace(int _espfreesketchspace)
{
	return false;
}

//ESPGetFlashChipMode
FlashMode_t nodeGetESPFlashChipMode()
{
	if (propertyFileReaded.indexOf("espflashchipmode;") < 0) return espflashchipmode = ESP.getFlashChipMode();
	else return espflashchipmode;
}
bool nodeSetESPFlashChipMode(int _espflashchipmode)
{
	return false;
}

//ESPGetSketchMD5
String nodeGetESPSketchMD5()
{
	if (propertyFileReaded.indexOf("espsketchmd5;") < 0) return espsketchmd5 = ESP.getSketchMD5();
	else return espsketchmd5;
}
bool nodeSetESPSketchMD5(String _espsketchmd5)
{
	return false;
}

//ESPGetResetReason
String nodeGetESPResetReason()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espresetreason;") < 0) return espresetreason = ESP.getResetReason();
	else return espresetreason;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("espresetreason;") < 0) return espresetreason = "CPU1: " + String(rtc_get_reset_reason(0)) + ";CPU2: " + String(rtc_get_reset_reason(1)) + ";";
	else return espresetreason;

#endif


}
bool nodeSetESPResetReason(String _espresetreason)
{
	return false;
}

//ESPGetMagicFlashChipSize
uint32_t nodeGetESPMagicFlashChipSize(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipsize;") < 0) return espmagicflashchipsize = ESP.magicFlashChipSize(byte);
	else return espmagicflashchipsize;
}
bool nodeSetESPMagicFlashChipSize(int _espmagicflashchipsize)
{
	return false;
}

//ESPGetMagicFlashChipSpeed
uint32_t nodeGetESPMagicFlashChipSpeed(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipspeed;") < 0) return espmagicflashchipspeed = ESP.magicFlashChipSpeed(byte);
	else return espmagicflashchipspeed;
}
bool nodeSetESPMagicFlashChipSpeed(int _espmagicflashchipspeed)
{
	return false;
}

//ESPGetMagicFlashChipMode
FlashMode_t nodeGetESPMagicFlashChipMode(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipmode;") < 0) return espmagicflashchipmode = ESP.magicFlashChipMode(byte);
	else return espmagicflashchipmode;
}
bool nodeSetESPMagicFlashChipMode(int _espmagicflashchipmode)
{
	return false;
}

//UpdateAvailable()  
int nodeGetUpdateAvailable()
{
	if (propertyFileReaded.indexOf("updateavailable;") < 0)
	{
		return updateavailable = _getIntPropertyValue("updateavailable", DEFAULT_UPDATE_AVAILABLE);
	}
	else
	{
		return updateavailable;
	}
}
bool nodeSetUpdateAvailable(int _updateavailable)
{
	updateavailable = _updateavailable;
	return  onInsideChange("updateavailable", String(updateavailable));
}

//UpdateHost
String nodeGetUpdateHost()
{
	if (propertyFileReaded.indexOf("updatehost;") < 0) return updatehost = _getStringPropertyValue("updatehost", DEFAULT_UPDATE_HOST);
	else return updatehost;
}
bool nodeSetUpdateHost(String _updatehost)
{
	updatehost = _updatehost;
	return onInsideChange("updatehost", updatehost);
}
#endif
