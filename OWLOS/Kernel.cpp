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

#include "Kernel.h"
#include "src\Managers\DriverManager.h"
#include "src\Managers\FileManager.h"
#include "src\Managers\TransportManager.h"
#include "src\Managers\UpdateManager.h"
#include "src\Utils\Utils.h"
#include "src\Managers\ScriptManager.h"





#define FIRMWARE_VERSION "OWLOS version 1.7 (beta)"
#define FIRMWARE_BUILD_NUMBER 60

#define DEFAULT_ZERO_VALUE 0x00
#define DEFAULT_EMPTY_STR_VALUE ""

#define DEFAULT_ID "owlnode"
#define DEFAULT_TOPIC "world0/area1/front1/room1/"

#define DEFAULT_WIFI_ACCESS_POINT_AVAILABLE 1
#define DEFAULT_WIFI_ACCESS_POINT_SSID "owlnode"
#define DEFAULT_WIFI_ACCESS_POINT_PASSWORD  "1122334455"
#define DEFAULT_WIFI_ACCESS_POINT_IP  "192.168.4.1"

#define DEFAULT_WIFI_STATION_AVAILABLE 0
#define DEFAULT_WIFI_STATION_SSID "Palata#13"
#define DEFAULT_WIFI_STATION_PASSWORD "qweasdzxc1234"

#define DEFAULT_HTTP_SERVER_AVAILABLE true
#define DEFAULT_HTTP_SERVER_USERNAME "admin"
#define DEFAULT_HTTP_SERVER_PASSWORD "admin"
#define DEFAULT_HTTP_SERVER_PORT 8084
#define DEFAULT_HTTP_CLIENT_PORT 8080
#define DEFAULT_HTTP_CLIENT_URL ""

#define DEFAULT_MQTT_CLIENT_AVAILABLE false
#define DEFAULT_MQTT_CLIENT_PORT 1883
#define DEFAULT_MQTT_CLIENT_URL "192.168.1.6"
#define DEFAULT_MQTT_CLIENT_LOGIN "owluser"
#define DEFAULT_MQTT_CLIENT_PASSWORD ""

#define DEFAULT_OTA_CLIENT_AVAILABLE false
#define DEFAULT_OTA_CLIENT_PORT 8266
#define DEFAULT_OTA_CLIENT_ID "owlunit"
#define DEFAULT_OTA_CLIENT_PASSWORD "cas777"

// WiFi properties
#define DEFAULT_WIFI_MODE WIFI_OFF
#define DEFAULT_WIFI_STATUS WL_DISCONNECTED
#define DEFAULT_WIFI_STATUS_TO_STR WL_DISCONNECTED

//Update 
#define DEFAULT_UPDATE_AVAILABLE true
#define DEFAULT_UPDATE_HOST "http://81.95.178.177:8080/update/"

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
extern "C" int rom_phy_get_vdd33();
#endif

//to make read property from file once, use this CSV string
String propertyFileReaded("");

//Unit Private properties
String unitid(DEFAULT_ID); //current Unit ID for transport (MQTT) topic and other identification inside system 
String topic(DEFAULT_TOPIC); //current Unit ROOT topic
String firmwareversion(FIRMWARE_VERSION);
int firmwarebuildnumber(FIRMWARE_BUILD_NUMBER);
int wifiapavailable(DEFAULT_WIFI_ACCESS_POINT_AVAILABLE);
String wifiaccesspointssid(DEFAULT_WIFI_ACCESS_POINT_SSID);
String wifiappassword(DEFAULT_WIFI_ACCESS_POINT_PASSWORD);
String wifiaccesspointip(DEFAULT_WIFI_ACCESS_POINT_IP);
int wifiavailable(DEFAULT_WIFI_STATION_AVAILABLE);
String wifissid(DEFAULT_WIFI_STATION_SSID);
String wifipassword(DEFAULT_WIFI_STATION_PASSWORD);
String wifiip(NotAvailable);
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
int32_t wifirssi((int32_t)DEFAULT_ZERO_VALUE);

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
WiFiMode_t wifimode((WiFiMode_t)DEFAULT_WIFI_MODE);
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
wifi_mode_t wifimode((wifi_mode_t)DEFAULT_WIFI_MODE);
#endif

wl_status_t wifistatus((wl_status_t)DEFAULT_WIFI_STATUS);
String wifistatustostring(DEFAULT_WIFI_STATUS_TO_STR);
int wifiisconnected(DEFAULT_ZERO_VALUE);
String connectedwifissid(DEFAULT_EMPTY_STR_VALUE);
int8_t wifinetworkscount((int8_t)DEFAULT_ZERO_VALUE);

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

bool kernelSetup()
{
	Serial.begin(PORTSPEED);  //setup Serial Monitor at PORTSPEED BAUD speed - see Utils.h for Constant definition
	delay(ONETENTHOFSECOND);  //sleep 1/10 of second

	debugOut("setup", "started...");//if Utils.h "Debug=true" start writing log to Serial

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	ESP.wdtEnable(ONEMINUTE); //Software watch dog
	//ESP.wdtDisable();
#endif

	filesBegin(); //prepare Flash file systeme (see Tools/Flash size item - use 2M Flash Size, is ZERO size by default -> switch to 2M    
	unitInit();
	driversInit(unitGetTopic()); //prepare onboard Unit's drivers
	scriptsLoad();
	//Setup network stack - WiFi -> after MQTT -- if both available Transport accessable, if not Unit try reconnect forever (every 5 sec by default)
	//Ther is not connected at begin(), see Main::Loop() transportReconnect() function using
	//The begin() just setup connection properties
	transportBegin();
	//The OWLOS harvester started up and went quietly...
#ifdef DetailedDebug 
	debugOut("setup", "complete");//if Utils.h "Debug=true" start writing log to Serial
#endif

}

/*-------------------------------------------------------------------------------------------------------------------------
  Main Callback
  If MQTT Client recieve published packet with subscrabed topic - this procedure is called ASYNC
  -------------------------------------------------------------------------------------------------------------------------*/
void Callback(char* _topic, byte* _payload, unsigned int length) {

	if (unitGetMQTTAvailable() == 1)
	{
#ifdef DetailedDebug 
		debugOut(TransportID, "onMessage topic - " + String(_topic));
#endif

		char payload_buff[PayloadBufferSize]; // create character buffer with ending by null terminator (zero string format)
		int i;
		//copy byte values to char array (buffer) char by char
		for (i = 0; i < length; i++)
		{
			payload_buff[i] = _payload[i];
		}
		payload_buff[i] = '\0'; //terminate string with zero

		//first check is Unit property?
		if (unitOnMessage(String(_topic), String(payload_buff), MQTTMask).equals(WrongPropertyName))
		{
			//if not UNIT property
			//Put recieved message to all drivers, each driver can process any topic recieved by Unit
			driversCallback(String(_topic), String(payload_buff));
		}
	}

}


bool kernelLoop()
{
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	filesLoop();
#endif

	//check WiFi and MQTT stack are available
	//first time Main::loop() calling the transport is not available

	if (!transportAvailable()) //if not connected
	{
		if (transportReconnect()) //DO connection routin, see Transport.cpp
		{
#ifdef DetailedDebug 
			debugOut(unitGetUnitId(), "Transport available"); //if HEAD and MQTT Brokker is available setuping drivers
#endif
			transportSetCallBack(Callback); //Regist Callback function for loopback subscribed messages (from MQTT Publishers)
			driversBegin(unitGetTopic()); //initilize drivers network properties, each driver must publish() here TYPE and AVAILABLE status
			unitSubscribe();
			//driversSubscribe();  //subscribe() all AVAILABLE drivers to here topics (see: driverID), the topic -> UnitTopic+ESPChipID/DriverId

		}
	}
	//  else //if network (Transport) to be available
	{
		transportLoop(); //Ping MQTT (at this version MQTT used only, FFR Ping RESTful to
		//give CPU time quantum to each driver. Like are sample -> temperature sensor can check physical sensor value
		driversLoop(); //the driverLoop() more actual for sensors drivers, the actuator drivers wait until Sub()->OnMessage() happens, see Main::Callback(...) function
		//Scripts loop
		scriptsRun();
	}

	delay(ONETENTHOFSECOND); //Main::loop() sleep interval
}



bool unitInit()
{
	unitGetUnitId();
	unitGetTopic();
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

String unitGetAllProperties()
{
	String result = "properties for:wifi\n";
	result += "id=wifi//r\n";
	result += "type=" + String(WiFiType) + "//r\n";
	result += "wifiaccesspointavailable=" + String(unitGetWiFiAccessPointAvailable()) + "//bs\n";
	result += "wifiaccesspointssid=" + unitGetWiFiAccessPointSSID() + "//s\n";
	result += "wifiappassword=" + unitGetWiFiAccessPointPassword() + "//sp\n";
	result += "wifiaccesspointip=" + unitGetWiFiAccessPointIP() + "//\n";
	result += "wifiavailable=" + String(unitGetWiFiAvailable()) + "//bs\n";
	result += "wifissid=" + unitGetWiFiSSID() + "//s\n";
	result += "wifipassword=" + unitGetWiFiPassword() + "//ps\n";
	result += "wifiip=" + unitGetWiFiIP() + "//\n";
	result += "wifiisconnected=" + String(unitGetWiFiIsConnected()) + "//bs\n";
	result += "connectedwifissid=" + unitGetConnectedWiFiSSID() + "//s\n";
	result += "wifirssi=" + String(unitGetWiFiRSSI()) + "//r\n";
	result += "wifimode=" + String(unitGetWiFiMode()) + "//r\n";
	result += unitGetAllWiFiModes() + "//r\n";
	result += "wifistatus=" + String(unitGetWiFiStatus()) + "//r\n";
	result += "wifistatustostring=" + String(unitGetWiFiStatusToString()) + "//\n";
	result += unitGetAllWiFiStatuses() + "//r\n";
	result += unitGetWiFiNetworksParameters() + "//r\n";
	result += unitGetAllWiFiEncryptionTypes() + "//r\n";

	result += "properties for:network\n";
	result += "id=network//r\n";
	result += "type=" + String(NetworkType) + "//r\n";
	result += "firmwareversion=" + unitGetFirmwareVersion() + "//r\n";
	result += "firmwarebuildnumber=" + String(unitGetFirmwareBuildNumber()) + "//ri\n";
	result += "unitid=" + unitGetUnitId() + "//\n";
	result += "topic=" + unitGetTopic() + "//\n";
	result += "restfulavailable=" + String(unitGetRESTfulAvailable()) + "//bs\n";
	result += "webserverlogin=" + unitGetRESTfulServerUsername() + "//\n";
	result += "webserverpwd=" + unitGetRESTfulServerPassword() + "//sp\n";
	result += "restfulserverport=" + String(unitGetRESTfulServerPort()) + "//i\n";
	result += "restfulclientport=" + String(unitGetRESTfulClientPort()) + "//i\n";
	result += "restfulclienturl=" + unitGetRESTfulClientURL() + "//\n";
	result += "mqttavailable=" + String(unitGetMQTTAvailable()) + "//bs\n";
	result += "mqttport=" + String(unitGetMQTTPort()) + "//i\n";
	result += "mqtturl=" + unitGetMQTTURL() + "//\n";
	result += "mqttid=" + unitGetMQTTID() + "//\n";
	result += "mqttlogin=" + unitGetMQTTLogin() + "//\n";
	result += "mqttpassword=" + unitGetMQTTPassword() + "//p\n";
	result += "mqttclientconnected=" + String(unitGetMQTTClientConnected()) + "//bs\n";
	result += "mqttclientstate=" + String(unitGetMQTTClientState()) + "//i\n";

	result += "otaavailable=" + String(unitGetOTAAvailable()) + "//bs\n";
	result += "otaport=" + String(unitGetOTAPort()) + "//i\n";
	result += "otaid=" + unitGetOTAID() + "//\n";
	result += "otapassword=" + unitGetOTAPassword() + "//p\n";
	result += "updateavailable=" + String(unitGetUpdateAvailable()) + "//bs\n";
	result += "updatepossible=" + String(updateGetUpdatePossible()) + "//ir\n";
	result += "updateinfo=" + String(updateGetUpdateInfo()) + "//r\n";
	result += "updateuistatus=" + String(updateGetUpdateUIStatus()) + "//ir\n";
	result += "updatefirmwarestatus=" + String(updateGetUpdateFirmwareStatus()) + "//ir\n";
	result += "updatehost=" + unitGetUpdateHost() + "//s\n";



	result += "properties for:esp\n";
	result += "id=esp//r\n";
	result += "type=" + String(ESPType) + "//r\n";
	result += "espresetinfo=" + unitGetESPResetInfo() + "//r\n";
	result += "espreset=" + String(unitGetESPReset()) + "//sb\n";
	result += "esprestart=" + String(unitGetESPRestart()) + "//b\n";
	result += "espvcc=" + String(unitGetESPVcc()) + "//r\n";
	result += "espchipid=" + String(unitGetESPChipId()) + "//sr\n";
	result += "espfreeheap=" + String(unitGetESPFreeHeap()) + "//sri\n";
	result += "espmaxfreeblocksize=" + String(unitGetESPMaxFreeBlockSize()) + "//ri\n";
	result += "espheapfragmentation=" + String(unitGetESPHeapFragmentation()) + "//ri\n";
	result += "espsdkversion=" + String(*unitGetESPSdkVersion()) + "//r\n";
	result += "espcoreversion=" + unitGetESPCoreVersion() + "//r\n";
	result += "espfullversion=" + unitGetESPFullVersion() + "//r\n";
	result += "espbootversion=" + String(unitGetESPBootVersion()) + "//r\n";
	result += "espbootmode=" + String(unitGetESPBootMode()) + "//r\n";
	result += "espcpufreqmhz=" + String(unitGetESPCpuFreqMHz()) + "//r\n";
	result += "espflashchipid=" + String(unitGetESPFlashChipId()) + "//r\n";
	result += "espflashchipvendorid=" + String(unitGetESPFlashChipVendorId()) + "//r\n";
	result += "espflashchiprealsize=" + String(unitGetESPFlashChipRealSize()) + "//r\n";
	result += "espflashchipsize=" + String(unitGetESPFlashChipSize()) + "//r\n";
	result += "espflashchipspeed=" + String(unitGetESPFlashChipSpeed()) + "//r\n";
	result += "espsketchsize=" + String(unitGetESPSketchSize()) + "//r\n";
	result += "espfreesketchspace=" + String(unitGetESPFreeSketchSpace()) + "//r\n";
	result += "espflashchipmode=" + String(unitGetESPFlashChipMode()) + "//r\n";
	result += "espsketchmd5=" + unitGetESPSketchMD5() + "//r\n";
	result += "espresetreason=" + unitGetESPResetReason() + "//sr\n";
	result += "espmagicflashchipsize=" + String(espmagicflashchipsize) + "//r\n";
	result += "espmagicflashchipspeed=" + String(espmagicflashchipspeed) + "//r\n";
	result += "espmagicflashchipmode=" + String(espmagicflashchipmode) + "//r\n";
	//Pins 
	//result += "busypins=" + unitGetBusyPins() + "//rs\n";
	//result += "pinsmap=" + unitGetPinsMap() + "//r\n";

	return result;
}


void unitSubscribe()
{
	transportSubscribe(topic + "/#");
}

String onGetProperty(String _property, String _payload, int transportMask)
{
#ifdef DetailedDebug 
	debugOut(unitid, "|-> get property " + _property + " = " + _payload);
#endif 
	if (transportMask && MQTTMask != 0)
	{
		transportPublish(topic + "/" + _property, _payload);
	}
	return _payload;
}

String unitOnMessage(String _topic, String _payload, int transportMask)
{
	String result = WrongPropertyName;
	if (String(topic + "/getunitid").equals(_topic)) return onGetProperty("id", unitGetUnitId(), transportMask);
	else
		if (String(topic + "/setunitid").equals(_topic)) return String(unitSetUnitId(_payload));
		else
			if (String(topic + "/gettopic").equals(_topic)) return onGetProperty("topic", unitGetTopic(), transportMask);
			else
				if (String(topic + "/settopic").equals(_topic)) return String(unitSetTopic(_payload));
				else
					if (String(topic + "/getfirmwareversion").equals(_topic)) return onGetProperty("firmwareversion", unitGetFirmwareVersion(), transportMask);
					else
						if (String(topic + "/setfirmwareversion").equals(_topic)) return String(unitSetFirmwareVersion(_payload));
						else
							if (String(topic + "/getfirmwarebuildnumber").equals(_topic)) return onGetProperty("firmwarebuildnumber", String(unitGetFirmwareBuildNumber()), transportMask);
							else
								if (String(topic + "/setfirmwarebuildnumber").equals(_topic)) return String(unitSetFirmwareBuildNumber(std::atoi(_payload.c_str())));
								else
									if (String(topic + "/getwifiaccesspointavailable").equals(_topic)) return String(onGetProperty("wifiapavailable", String(unitGetWiFiAccessPointAvailable()), transportMask));
									else
										if (String(topic + "/setwifiaccesspointavailable").equals(_topic)) return String(unitSetWiFiAccessPointAvailable(std::atoi(_payload.c_str())));
										else
											if (String(topic + "/getwifiaccesspointssid").equals(_topic)) return onGetProperty("wifiaccesspointssid", unitGetWiFiAccessPointSSID(), transportMask);
											else
												if (String(topic + "/setwifiaccesspointssid").equals(_topic)) return String(unitSetWiFiAccessPointSSID(_payload));
												else
													if (String(topic + "/getwifiappassword").equals(_topic)) return onGetProperty("wifipassword", unitGetWiFiAccessPointPassword(), transportMask);
													else
														if (String(topic + "/setwifiappassword").equals(_topic)) return String(unitSetWiFiAccessPointPassword(_payload));
														else
															if (String(topic + "/getwifiaccesspointip").equals(_topic)) return onGetProperty("wifiaccesspointip", unitGetWiFiAccessPointIP(), transportMask);
															else
																if (String(topic + "/setwifiaccesspointip").equals(_topic)) return String(unitSetWiFiAccessPointIP(_payload));
																else
																	if (String(topic + "/getwifiavailable").equals(_topic)) return String(onGetProperty("wifiavailable", String(unitGetWiFiAvailable()), transportMask));
																	else
																		if (String(topic + "/setwifiavailable").equals(_topic)) return String(unitSetWiFiAvailable(std::atoi(_payload.c_str())));
																		else
																			if (String(topic + "/getwifissid").equals(_topic)) return onGetProperty("wifissid", unitGetWiFiSSID(), transportMask);
																			else
																				if (String(topic + "/setwifissid").equals(_topic)) return String(unitSetWiFiSSID(_payload));
																				else
																					if (String(topic + "/getwifipassword").equals(_topic)) return onGetProperty("wifipassword", unitGetWiFiPassword(), transportMask);
																					else
																						if (String(topic + "/setwifipassword").equals(_topic)) return String(unitSetWiFiPassword(_payload));
																						else
																							if (String(topic + "/getwifiip").equals(_topic)) return onGetProperty("wifiip", unitGetWiFiIP(), transportMask);
																							else
																								if (String(topic + "/setwifiip").equals(_topic)) return String(unitSetWiFiIP(_payload));
																								else
																									if (String(topic + "/getwifiisconnected").equals(_topic)) return onGetProperty("wifiisconnected", String(unitGetWiFiIsConnected()), transportMask);
																									else
																										if (String(topic + "/setwifiisconnected").equals(_topic)) return String(unitSetWiFiIsConnected(std::atoi(_payload.c_str())));
																										else
																											if (String(topic + "/getconnectedwifissid").equals(_topic)) return onGetProperty("connectedwifissid", unitGetConnectedWiFiSSID(), transportMask);

																											else
																												if (String(topic + "/getrestfulavailable").equals(_topic)) return onGetProperty("restfulavailable", String(unitGetRESTfulAvailable()), transportMask);
																												else
																													if (String(topic + "/setrestfulavailable").equals(_topic)) return String(unitSetRESTfulAvailable(std::atoi(_payload.c_str())));
																													else
																														if (String(topic + "/getwebserverlogin").equals(_topic)) return onGetProperty("webserverlogin", unitGetRESTfulServerUsername(), transportMask);
																														else
																															if (String(topic + "/setwebserverlogin").equals(_topic)) return String(unitSetRESTfulServerUsername(_payload));
																															else
																																if (String(topic + "/getwebserverpwd").equals(_topic)) return onGetProperty("webserverpwd", unitGetRESTfulServerPassword(), transportMask);
																																else
																																	if (String(topic + "/setwebserverpwd").equals(_topic)) return String(unitSetRESTfulServerPassword(_payload));
																																	else
																																		if (String(topic + "/getrestfulserverport").equals(_topic)) return onGetProperty("restfulserverport", String(unitGetRESTfulServerPort()), transportMask);
																																		else
																																			if (String(topic + "/setrestfulserverport").equals(_topic)) return String(unitSetRESTfulServerPort(std::atoi(_payload.c_str())));
																																			else
																																				if (String(topic + "/getrestfulclientport").equals(_topic)) return onGetProperty("restfulclientport", String(unitGetRESTfulClientPort()), transportMask);
																																				else
																																					if (String(topic + "/setrestfulclientport").equals(_topic)) return String(unitSetRESTfulClientPort(std::atoi(_payload.c_str())));
																																					else
																																						if (String(topic + "/getrestfulclienturl").equals(_topic)) return onGetProperty("restfulclienturl", unitGetRESTfulClientURL(), transportMask);
																																						else
																																							if (String(topic + "/setrestfulclienturl").equals(_topic)) return String(unitSetRESTfulClientURL(_payload));
																																							else
																																								if (String(topic + "/getmqttavailable").equals(_topic)) return onGetProperty("mqttavailable", String(unitGetMQTTAvailable()), transportMask);
																																								else
																																									if (String(topic + "/setmqttavailable").equals(_topic)) return String(unitSetMQTTAvailable(std::atoi(_payload.c_str())));
																																									else
																																										if (String(topic + "/getmqttport").equals(_topic)) return onGetProperty("mqttport", String(unitGetMQTTPort()), transportMask);
																																										else
																																											if (String(topic + "/setmqttport").equals(_topic)) return String(unitSetMQTTPort(std::atoi(_payload.c_str())));
																																											else
																																												if (String(topic + "/getmqtturl").equals(_topic)) return onGetProperty("mqtturl", unitGetMQTTURL(), transportMask);
																																												else
																																													if (String(topic + "/setmqtturl").equals(_topic)) return String(unitSetMQTTURL(_payload));
																																													else
																																														if (String(topic + "/getmqttid").equals(_topic)) return onGetProperty("mqttid", unitGetMQTTID(), transportMask);
																																														else
																																															if (String(topic + "/setmqttid").equals(_topic)) return String(unitSetMQTTID(_payload));
																																															else
																																																if (String(topic + "/getmqttlogin").equals(_topic)) return onGetProperty("mqttlogin", unitGetMQTTLogin(), transportMask);
																																																else
																																																	if (String(topic + "/setmqttlogin").equals(_topic)) return String(unitSetMQTTLogin(_payload));
																																																	else
																																																		if (String(topic + "/getmqttpassword").equals(_topic)) return onGetProperty("mqttpassword", unitGetMQTTPassword(), transportMask);
																																																		else
																																																			if (String(topic + "/setmqttpassword").equals(_topic)) return String(unitSetMQTTPassword(_payload));
																																																			else
																																																				if (String(topic + "/getmqttclientconnected").equals(_topic)) return String(unitGetMQTTClientConnected());
																																																				else
																																																					if (String(topic + "/getmqttclientstate").equals(_topic)) return String(unitGetMQTTClientState());
																																																					else
																																																						if (String(topic + "/getotaavailable").equals(_topic)) return onGetProperty("otaavailable", String(unitGetOTAAvailable()), transportMask);
																																																						else
																																																							if (String(topic + "/setotaavailable").equals(_topic)) return String(unitSetOTAAvailable(std::atoi(_payload.c_str())));
																																																							else
																																																								if (String(topic + "/getotaport").equals(_topic)) return onGetProperty("otaport", String(unitGetOTAPort()), transportMask);
																																																								else
																																																									if (String(topic + "/setotaport").equals(_topic)) return String(unitSetOTAPort(std::atoi(_payload.c_str())));
																																																									else
																																																										if (String(topic + "/getotaid").equals(_topic)) return onGetProperty("otaid", unitGetOTAID(), transportMask);
																																																										else
																																																											if (String(topic + "/setotaid").equals(_topic)) return String(unitSetOTAID(_payload));
																																																											else
																																																												if (String(topic + "/getotapassword").equals(_topic)) return onGetProperty("otapassword", unitGetMQTTPassword(), transportMask);
																																																												else
																																																													if (String(topic + "/setotapassword").equals(_topic)) return String(unitSetOTAPassword(_payload));
	// WiFi parameters
																																																													else
																																																														if (String(topic + "/getwifirssi").equals(_topic)) return onGetProperty("wifirssi", String(unitGetWiFiRSSI()), transportMask);
																																																														else
																																																															if (String(topic + "/setwifirssi").equals(_topic)) return String(unitSetWiFiRSSI(std::atoi(_payload.c_str())));
																																																															else
																																																																if (String(topic + "/getwifimode").equals(_topic)) return onGetProperty("wifimode", String(unitGetWiFiMode()), transportMask);
																																																																else
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
																																																																	if (String(topic + "/setwifimode").equals(_topic)) return String(unitSetWiFiMode((WiFiMode_t)std::atoi(_payload.c_str())));
																																																																	else
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
																																																																		if (String(topic + "/setwifimode").equals(_topic)) return String(unitSetWiFiMode((wifi_mode_t)std::atoi(_payload.c_str())));
																																																																		else

#endif
																																																																			if (String(topic + "/getwifistatus").equals(_topic)) return onGetProperty("wifistatus", String(unitGetWiFiStatus()), transportMask);
																																																																			else
																																																																				if (String(topic + "/setwifistatus").equals(_topic)) return String(unitSetWiFiStatus(std::atoi(_payload.c_str())));
																																																																				else
																																																																					if (String(topic + "/getwifistatustostring").equals(_topic)) return onGetProperty("wifistatustostring", String(unitGetWiFiStatusToString()), transportMask);
																																																																					else
																																																																						if (String(topic + "/getscanwifinetworks").equals(_topic)) return onGetProperty("wifinetworkscount", String(unitGetScanWiFiNetworks()), transportMask);
																																																																						else
																																																																							if (String(topic + "/setscanwifinetworks").equals(_topic)) return String(unitSetScanWiFiNetworks(std::atoi(_payload.c_str())));
																																																																							else
																																																																								if (String(topic + "/getwifinetworkscount").equals(_topic)) return onGetProperty("wifinetworkscount", String(unitGetWiFiNetworksCount()), transportMask);
																																																																								else
																																																																									if (String(topic + "/setwifinetworkscount").equals(_topic)) return String(unitSetWiFiNetworksCount(std::atoi(_payload.c_str())));
																																																																									else
																																																																										if (String(topic + "/getwifinetworksparameters").equals(_topic)) return unitGetWiFiNetworksParameters();
																																																																										else
																																																																											if (String(topic + "/getallwifimodes").equals(_topic)) return unitGetAllWiFiModes();
																																																																											else
																																																																												if (String(topic + "/getallwifistatuses").equals(_topic)) return String(unitGetAllWiFiStatuses());
																																																																												else
																																																																													if (String(topic + "/getallwifiencryptiontypes").equals(_topic)) return String(unitGetAllWiFiEncryptionTypes());

	/**/
	//ESP class parameters
																																																																													else
																																																																														if (String(topic + "/getespresetinfo").equals(_topic)) return onGetProperty("espresetinfo", unitGetESPResetInfo(), transportMask);
																																																																														else
																																																																															if (String(topic + "/setespresetinfo").equals(_topic)) return String(unitSetESPResetInfo(_payload));
																																																																															else
																																																																																if (String(topic + "/getespreset").equals(_topic)) return onGetProperty("espreset", String(unitGetESPReset()), transportMask);
																																																																																else
																																																																																	if (String(topic + "/setespreset").equals(_topic)) return String(unitSetESPReset(std::atoi(_payload.c_str())));
																																																																																	else
																																																																																		if (String(topic + "/getesprestart").equals(_topic)) return onGetProperty("esprestart", String(unitGetESPRestart()), transportMask);
																																																																																		else
																																																																																			if (String(topic + "/setesprestart").equals(_topic)) return String(unitSetESPRestart(std::atoi(_payload.c_str())));
																																																																																			else
																																																																																				if (String(topic + "/getespvcc").equals(_topic)) return onGetProperty("espvcc", String(unitGetESPVcc()), transportMask);
																																																																																				else
																																																																																					if (String(topic + "/setespvcc").equals(_topic)) return String(unitSetESPVcc(std::atoi(_payload.c_str())));
																																																																																					else
																																																																																						if (String(topic + "/getespchipid").equals(_topic)) return onGetProperty("espchipid", String(unitGetESPChipId()), transportMask);
																																																																																						else
																																																																																							if (String(topic + "/setespchipid").equals(_topic)) return String(unitSetESPChipId(std::atoi(_payload.c_str())));
																																																																																							else
																																																																																								if (String(topic + "/getespfreeheap").equals(_topic)) return onGetProperty("espfreeheap", String(unitGetESPFreeHeap()), transportMask);
																																																																																								else
																																																																																									if (String(topic + "/setespfreeheap").equals(_topic)) return String(unitSetESPFreeHeap(std::atoi(_payload.c_str())));
																																																																																									else
																																																																																										if (String(topic + "/getespmaxfreeblocksize").equals(_topic)) return onGetProperty("espmaxfreeblocksize", String(unitGetESPMaxFreeBlockSize()), transportMask);
																																																																																										else
																																																																																											if (String(topic + "/setespmaxfreeblocksize").equals(_topic)) return String(unitSetESPMaxFreeBlockSize(std::atoi(_payload.c_str())));
																																																																																											else
																																																																																												if (String(topic + "/getespheapfragmentation").equals(_topic)) return onGetProperty("espheapfragmentation", String(unitGetESPHeapFragmentation()), transportMask);
																																																																																												else
																																																																																													if (String(topic + "/setespheapfragmentation").equals(_topic)) return String(unitSetESPHeapFragmentation(std::atoi(_payload.c_str())));
																																																																																													else
																																																																																														if (String(topic + "/getespsdkversion").equals(_topic)) return onGetProperty("espsdkversion", String(*unitGetESPSdkVersion()), transportMask);
																																																																																														else
																																																																																															if (String(topic + "/setespsdkversion").equals(_topic)) return String(unitSetESPSdkVersion(_payload));
																																																																																															else
																																																																																																if (String(topic + "/getespcoreversion").equals(_topic)) return onGetProperty("espcoreversion", unitGetESPCoreVersion(), transportMask);
																																																																																																else
																																																																																																	if (String(topic + "/setespcoreversion").equals(_topic)) return String(unitSetESPCoreVersion(_payload));
																																																																																																	else
																																																																																																		if (String(topic + "/getespfullversion").equals(_topic)) return onGetProperty("espfullversion", unitGetESPFullVersion(), transportMask);
																																																																																																		else
																																																																																																			if (String(topic + "/setespfullversion").equals(_topic)) return String(unitSetESPFullVersion(_payload));
																																																																																																			else
																																																																																																				if (String(topic + "/getespbootversion").equals(_topic)) return onGetProperty("espbootversion", String(unitGetESPBootVersion()), transportMask);
																																																																																																				else
																																																																																																					if (String(topic + "/setespbootversion").equals(_topic)) return String(unitSetESPBootVersion(std::atoi(_payload.c_str())));
																																																																																																					else
																																																																																																						if (String(topic + "/getespbootmode").equals(_topic)) return onGetProperty("espbootmode", String(unitGetESPBootMode()), transportMask);
																																																																																																						else
																																																																																																							if (String(topic + "/setespbootmode").equals(_topic)) return String(unitSetESPBootMode(std::atoi(_payload.c_str())));
																																																																																																							else
																																																																																																								if (String(topic + "/getespcpufreqmhz").equals(_topic)) return onGetProperty("espcpufreqmhz", String(unitGetESPCpuFreqMHz()), transportMask);
																																																																																																								else
																																																																																																									if (String(topic + "/setespcpufreqmhz").equals(_topic)) return String(unitSetESPCpuFreqMHz(std::atoi(_payload.c_str())));
																																																																																																									else
																																																																																																										if (String(topic + "/getespflashchipid").equals(_topic)) return onGetProperty("espflashchipid", String(unitGetESPFlashChipId()), transportMask);
																																																																																																										else
																																																																																																											if (String(topic + "/setespflashchipid").equals(_topic)) return String(unitSetESPFlashChipId(std::atoi(_payload.c_str())));
																																																																																																											else
																																																																																																												if (String(topic + "/getespflashchipvendorid").equals(_topic)) return onGetProperty("espflashchipvendorid", String(unitGetESPFlashChipVendorId()), transportMask);
																																																																																																												else
																																																																																																													if (String(topic + "/setespflashchipvendorid").equals(_topic)) return String(unitSetESPFlashChipVendorId(std::atoi(_payload.c_str())));
																																																																																																													else
																																																																																																														if (String(topic + "/getespflashchiprealsize").equals(_topic)) return onGetProperty("espflashchiprealsize", String(unitGetESPFlashChipRealSize()), transportMask);
																																																																																																														else
																																																																																																															if (String(topic + "/setespflashchiprealsize").equals(_topic)) return String(unitSetESPFlashChipRealSize(std::atoi(_payload.c_str())));
																																																																																																															else
																																																																																																																if (String(topic + "/getespflashchipsize").equals(_topic)) return onGetProperty("espflashchipsize", String(unitGetESPFlashChipSize()), transportMask);
																																																																																																																else
																																																																																																																	if (String(topic + "/setespflashchipsize").equals(_topic)) return String(unitSetESPFlashChipSize(std::atoi(_payload.c_str())));
																																																																																																																	else
																																																																																																																		if (String(topic + "/getespflashchipspeed").equals(_topic)) return onGetProperty("espflashchipspeed", String(unitGetESPFlashChipSpeed()), transportMask);
																																																																																																																		else
																																																																																																																			if (String(topic + "/setespflashchipspeed").equals(_topic)) return String(unitSetESPFlashChipSpeed(std::atoi(_payload.c_str())));
																																																																																																																			else
																																																																																																																				if (String(topic + "/getespsketchsize").equals(_topic)) return onGetProperty("espsketchsize", String(unitGetESPSketchSize()), transportMask);
																																																																																																																				else
																																																																																																																					if (String(topic + "/setespsketchsize").equals(_topic)) return String(unitSetESPSketchSize(std::atoi(_payload.c_str())));
																																																																																																																					else
																																																																																																																						if (String(topic + "/getespfreesketchspace").equals(_topic)) return onGetProperty("espfreesketchspace", String(unitGetESPFreeSketchSpace()), transportMask);
																																																																																																																						else
																																																																																																																							if (String(topic + "/setespfreesketchspace").equals(_topic)) return String(unitSetESPFreeSketchSpace(std::atoi(_payload.c_str())));
																																																																																																																							else
																																																																																																																								if (String(topic + "/getespflashchipmode").equals(_topic)) return onGetProperty("espflashchipmode", String(unitGetESPFlashChipMode()), transportMask);
																																																																																																																								else
																																																																																																																									if (String(topic + "/setespflashchipmode").equals(_topic)) return String(unitSetESPFlashChipMode(std::atoi(_payload.c_str())));
																																																																																																																									else
																																																																																																																										if (String(topic + "/getespsketchmd5").equals(_topic)) return onGetProperty("espsketchmd5", unitGetESPSketchMD5(), transportMask);
																																																																																																																										else
																																																																																																																											if (String(topic + "/setespsketchmd5").equals(_topic)) return String(unitSetESPSketchMD5(_payload));
																																																																																																																											else
																																																																																																																												if (String(topic + "/getespresetreason").equals(_topic)) return onGetProperty("espresetreason", unitGetESPResetReason(), transportMask);
																																																																																																																												else
																																																																																																																													if (String(topic + "/setespresetreason").equals(_topic)) return String(unitSetESPResetReason(_payload));
																																																																																																																													else
																																																																																																																														if (String(topic + "/getespmagicflashchipsize").equals(_topic)) return onGetProperty("espmagicflashchipsize", String(unitGetESPMagicFlashChipSize((uint8_t)std::atoi(_payload.c_str()))), transportMask);
																																																																																																																														else
																																																																																																																															if (String(topic + "/setespmagicflashchipsize").equals(_topic)) return String(unitSetESPMagicFlashChipSize(std::atoi(_payload.c_str())));
																																																																																																																															else
																																																																																																																																if (String(topic + "/getespmagicflashchipspeed").equals(_topic)) return onGetProperty("espmagicflashchipspeed", String(unitGetESPMagicFlashChipSpeed((uint8_t)std::atoi(_payload.c_str()))), transportMask);
																																																																																																																																else
																																																																																																																																	if (String(topic + "/setespmagicflashchipspeed").equals(_topic)) return String(unitSetESPMagicFlashChipSpeed(std::atoi(_payload.c_str())));
																																																																																																																																	else
																																																																																																																																		if (String(topic + "/getespmagicflashchipmode").equals(_topic)) return onGetProperty("espmagicflashchipmode", String(unitGetESPMagicFlashChipMode((uint8_t)std::atoi(_payload.c_str()))), transportMask);
																																																																																																																																		else
																																																																																																																																			if (String(topic + "/setespmagicflashchipmode").equals(_topic)) return String(unitSetESPMagicFlashChipMode(std::atoi(_payload.c_str())));
	//Pins
																																																																																																																																			else
																																																																																																																																				//if (String(topic + "/getbusypins").equals(_topic)) return unitGetBusyPins();
																																																																																																																																				//else
																																																																																																																																					//if (String(topic + "/getpinsmap").equals(_topic)) return unitGetPinsMap();
																																																																																																																																					//else
																																																																																																																																				if (String(topic + "/getupdateavailable").equals(_topic)) return onGetProperty("updateavailable", String(unitGetUpdateAvailable()), transportMask);
																																																																																																																																				else
																																																																																																																																					if (String(topic + "/setupdateavailable").equals(_topic)) return String(unitSetUpdateAvailable(std::atoi(_payload.c_str())));
																																																																																																																																					else
																																																																																																																																						if (String(topic + "/getupdatepossible").equals(_topic)) return onGetProperty("updatepossible", String(updateGetUpdatePossible()), transportMask);
																																																																																																																																						else
																																																																																																																																							if (String(topic + "/getupdateinfo").equals(_topic)) return onGetProperty("updateinfo", String(updateGetUpdateInfo()), transportMask);
																																																																																																																																							else
																																																																																																																																								if (String(topic + "/getupdateuistatus").equals(_topic)) return onGetProperty("updateuistatus", String(updateGetUpdateUIStatus()), transportMask);
																																																																																																																																								else
																																																																																																																																									if (String(topic + "/getupdatefirmwarestatus").equals(_topic)) return onGetProperty("updateufirmwarestatus", String(updateGetUpdateFirmwareStatus()), transportMask);
																																																																																																																																									else
																																																																																																																																										if (String(topic + "/getupdatehost").equals(_topic)) return onGetProperty("updatehost", unitGetUpdateHost(), transportMask);
																																																																																																																																										else
																																																																																																																																											if (String(topic + "/setupdatehost").equals(_topic)) return String(unitSetUpdateHost(_payload));
																																																																																																																																											else
																																																																																																																																												//Update 
																																																																																																																																												return result;
}

bool lock = false;

bool onInsideChange(String _property, String _value)
{
#ifdef DetailedDebug 
	debugOut(unitid, "|<- inside change " + _property + " = " + _value);
#endif

	bool result = false;
	if (!lock)
	{
		lock = true;
		result = filesWriteString(String(DEFAULT_ID) + "." + _property, _value);

		if (transportAvailable())
		{
			result = transportPublish(topic + "/" + _property, _value);
		}

#ifdef DetailedDebug 
		debugOut(unitid, "|-> inside change ");
#endif
		lock = false;
	}

	return result;
}
//-------------------------------------------------------------------------------------------
//Internal - get any unit property value by name
//-------------------------------------------------------------------------------------------
String _getStringPropertyValue(String _property, String _defaultvalue)
{
	String result = _defaultvalue;
	if (filesExists(String(DEFAULT_ID) + "." + _property))
	{
		result = filesReadString(String(DEFAULT_ID) + "." + _property);
	}
	else
	{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		unitOnMessage(topic + "/set" + _property, result, NoTransportMask);
#endif
	}
	propertyFileReaded += _property + ";";
#ifdef DetailedDebug 
	debugOut(unitid, _property + "=" + result);
#endif
	return result;
}
//Integer property
int _getIntPropertyValue(String _property, int _defaultvalue)
{
	int result = _defaultvalue;
	if (filesExists(String(DEFAULT_ID) + "." + _property))
	{
		result = filesReadInt(String(DEFAULT_ID) + "." + _property);
	}
	else
	{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		unitOnMessage(topic + "/set" + _property, String(result), NoTransportMask);
#endif
	}
	propertyFileReaded += _property + ";";
#ifdef DetailedDebug 	
	debugOut(unitid, _property + "=" + String(result));
#endif	
	return result;
}

//Getters and Setters section ---------------------------------------------------------------
String unitGetUnitId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("unitid;") < 0) return unitid = _getStringPropertyValue("unitid", DEFAULT_ID + String(ESP.getChipId(), HEX));
	else return unitid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4

	if (propertyFileReaded.indexOf("unitid;") < 0) return unitid = _getStringPropertyValue("unitid", DEFAULT_ID + String((int)ESP.getEfuseMac(), (unsigned char)HEX));

	else return unitid;
#endif
}

bool unitSetUnitId(String _unitid)
{
	unitid = _unitid;
	return onInsideChange("unitid", String(unitid));
}

//Topic --------------------------------------------------------------------------------------
String unitGetTopic()
{
	if (propertyFileReaded.indexOf("topic;") < 0) return topic = _getStringPropertyValue("topic", topic + unitid);
	else return topic;
}

bool unitSetTopic(String _topic)
{
	topic = _topic;
	return  onInsideChange("topic", String(topic));
}

//GetFirmwareVersion
String unitGetFirmwareVersion()
{
	/*  if (propertyFileReaded.indexOf("firmwareversion;") < 0) return firmwareversion = _getStringPropertyValue("firmwareversion", FIRMWARE_VERSION);
	  else */ return firmwareversion;
}
bool unitSetFirmwareVersion(String _firmwareversion)
{
	return false;
}

//GetFirmwareBuildNumber
int unitGetFirmwareBuildNumber()
{
	/*  if (propertyFileReaded.indexOf("firmwarebuildnumber;") < 0) return firmwarebuildnumber = _getIntPropertyValue("firmwarebuildnumber", FIRMWARE_BUILD_NUMBER);
	  else */ return firmwarebuildnumber;
}
bool unitSetFirmwareBuildNumber(int _firmwarebuildnumber)
{
	return false;
}

//WiFi -----------------------------------------------------------------------------------------
//WiFiAccessPointAvailable
int unitGetWiFiAccessPointAvailable()
{
	if (propertyFileReaded.indexOf("wifiapavailable;") < 0) return wifiapavailable = _getIntPropertyValue("wifiapavailable", DEFAULT_WIFI_ACCESS_POINT_AVAILABLE);
	else return wifiapavailable;
}

bool unitSetWiFiAccessPointAvailable(int _wifiapavailable)
{
	wifiapavailable = _wifiapavailable;
	return  onInsideChange("wifiapavailable", String(wifiapavailable));
}

//WiFiAccessPointSSID
String unitGetWiFiAccessPointSSID()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("wifiaccesspointssid;") < 0) return wifiaccesspointssid = _getStringPropertyValue("wifiaccesspointssid", DEFAULT_ID + String(ESP.getChipId()));
	else return wifiaccesspointssid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("wifiaccesspointssid;") < 0) return wifiaccesspointssid = _getStringPropertyValue("wifiaccesspointssid", DEFAULT_ID + String((int)ESP.getEfuseMac()));
	else return wifiaccesspointssid;
#endif
}

bool unitSetWiFiAccessPointSSID(String _wifiaccesspointssid)
{
	wifiaccesspointssid = _wifiaccesspointssid;
	return  onInsideChange("wifiaccesspointssid", String(wifiaccesspointssid));
}
//WiFiAccessPointPassword
String unitGetWiFiAccessPointPassword()
{
	if (propertyFileReaded.indexOf("wifiappassword;") < 0) return wifiappassword = _getStringPropertyValue("wifiappassword", DEFAULT_WIFI_ACCESS_POINT_PASSWORD);
	else return wifiappassword;
}

bool unitSetWiFiAccessPointPassword(String _wifiappassword)
{
	wifiappassword = _wifiappassword;
	return  onInsideChange("wifiappassword", String(wifiappassword));
}
//WiFiAccessPointIP
String unitGetWiFiAccessPointIP()
{
	if (unitGetWiFiAccessPointAvailable() == 1)
	{
		IPAddress real_wifiaccesspointip = WiFi.softAPIP();
#ifdef DetailedDebug 
		debugOut(unitid, "Current Access Point IP: " + real_wifiaccesspointip.toString());
#endif
		if (propertyFileReaded.indexOf("wifiaccesspointip;") < 0) wifiaccesspointip = _getStringPropertyValue("wifiaccesspointip", real_wifiaccesspointip.toString());

		if (!real_wifiaccesspointip.toString().equals(wifiaccesspointip))
		{
#ifdef DetailedDebug 
			debugOut(unitid, "Current Access Point IP not equals");
#endif

			if (!unitSetWiFiAccessPointIP(wifiaccesspointip))
			{
#ifdef DetailedDebug 
				debugOut(unitid, "Can't change Access Point IP to: " + wifiaccesspointip);
#endif

				wifiaccesspointip = NotAvailable;
			}
		}
	}
	else
	{
		WiFi.softAPdisconnect(true);
		wifiaccesspointip = NotAvailable;
	}
#ifdef DetailedDebug 
	debugOut(unitid, "wifiaccesspointip=" + wifiaccesspointip);
#endif

	return wifiaccesspointip;
}

bool unitSetWiFiAccessPointIP(String _wifiaccesspointip)
{
	IPAddress real_wifiaccesspointip;
#ifdef DetailedDebug 
	debugOut(unitid, "Current Access Point IP: " + WiFi.softAPIP().toString());
#endif

	if (real_wifiaccesspointip.fromString(_wifiaccesspointip))
	{
		if (WiFi.softAPConfig(real_wifiaccesspointip, real_wifiaccesspointip, IPAddress(255, 255, 255, 0)))
		{
			wifiaccesspointip = _wifiaccesspointip;
			return onInsideChange("wifiaccesspointip", wifiaccesspointip);
		}
	}

	return false;
}

//WiFiAvailable
int unitGetWiFiAvailable()
{
	if (propertyFileReaded.indexOf("wifiavailable;") < 0) return wifiavailable = _getIntPropertyValue("wifiavailable", DEFAULT_WIFI_STATION_AVAILABLE);
	else return wifiavailable;
}

bool unitSetWiFiAvailable(int _wifiavailable)
{
	wifiavailable = _wifiavailable;
	return  onInsideChange("wifiavailable", String(wifiavailable));
}

//WiFiSSID
String unitGetWiFiSSID()
{
	if (propertyFileReaded.indexOf("wifissid;") < 0) return wifissid = _getStringPropertyValue("wifissid", DEFAULT_WIFI_STATION_SSID);
	else return wifissid;
}

bool unitSetWiFiSSID(String _wifissid)
{
	wifissid = _wifissid;
	return  onInsideChange("wifissid", String(wifissid));
}
//WiFiPassword
String unitGetWiFiPassword()
{
	if (propertyFileReaded.indexOf("wifipassword;") < 0) return wifipassword = _getStringPropertyValue("wifipassword", DEFAULT_WIFI_STATION_PASSWORD);
	else return wifipassword;
}

bool unitSetWiFiPassword(String _wifipassword)
{
	wifipassword = _wifipassword;
	return  onInsideChange("wifipassword", String(wifipassword));
}
//WiFiIP
String unitGetWiFiIP()
{
	wifiip = WiFi.localIP().toString();
	return wifiip;
}
bool unitSetWiFiIP(String _wifiip)
{
	return false; //local (client) WiFi IP can't be changed manualy
}


//RESTfulAvailable()  
int unitGetRESTfulAvailable()
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
bool unitSetRESTfulAvailable(int _restfulavailable)
{
	restfulavailable = _restfulavailable;
	return  onInsideChange("restfulavailable", String(restfulavailable));
}

//RESTfulServerUsername
String unitGetRESTfulServerUsername()
{
	if (propertyFileReaded.indexOf("webserverlogin;") < 0) return webserverlogin = _getStringPropertyValue("webserverlogin", DEFAULT_HTTP_SERVER_USERNAME);
	else return webserverlogin;
}
bool unitSetRESTfulServerUsername(String _webserverlogin)
{
	webserverlogin = _webserverlogin;
	return  onInsideChange("webserverlogin", String(webserverlogin));
}

//RESTfulServerPassword
String unitGetRESTfulServerPassword()
{
	if (propertyFileReaded.indexOf("webserverpwd;") < 0) return webserverpwd = _getStringPropertyValue("webserverpwd", DEFAULT_HTTP_SERVER_PASSWORD);
	else return webserverpwd;
}
bool unitSetRESTfulServerPassword(String _webserverpwd)
{
	webserverpwd = _webserverpwd;
	return  onInsideChange("webserverpwd", String(webserverpwd));
}

//RESTfulServerPort()  
int unitGetRESTfulServerPort()
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
bool unitSetRESTfulServerPort(int _restfulserverport)
{
	restfulserverport = _restfulserverport;
	return  onInsideChange("restfulserverport", String(restfulserverport));
}

//RESTfulClientPort()  
int unitGetRESTfulClientPort()
{
	if (propertyFileReaded.indexOf("restfulclientport;") < 0) return restfulclientport = _getIntPropertyValue("restfulclientport", DEFAULT_HTTP_CLIENT_PORT);
	else return restfulclientport;
}
bool unitSetRESTfulClientPort(int _restfulclientport)
{
	restfulclientport = _restfulclientport;
	return  onInsideChange("restfulclientport", String(restfulclientport));
}

//RESTfulClientURL()  
String unitGetRESTfulClientURL()
{
	if (propertyFileReaded.indexOf("restfulclienturl;") < 0) return restfulclienturl = _getStringPropertyValue("restfulclienturl", DEFAULT_HTTP_CLIENT_URL);
	else return restfulclienturl;
}
bool unitSetRESTfulClientURL(String _restfulclienturl)
{
	restfulclienturl = _restfulclienturl;
	return  onInsideChange("restfulclienturl", String(restfulclienturl));
}

//MQTTAvailable()  
int unitGetMQTTAvailable()
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
bool unitSetMQTTAvailable(int _mqttavailable)
{
	mqttavailable = _mqttavailable;
	return  onInsideChange("mqttavailable", String(mqttavailable));
}

//MQTTPort()  
int unitGetMQTTPort()
{
	if (propertyFileReaded.indexOf("mqttport;") < 0) return mqttport = _getIntPropertyValue("mqttport", DEFAULT_MQTT_CLIENT_PORT);
	else return mqttport;
}
bool unitSetMQTTPort(int _mqttport)
{
	mqttport = _mqttport;
	return  onInsideChange("mqttport", String(mqttport));
}

//MQTTURL()  
String unitGetMQTTURL()
{
	if (propertyFileReaded.indexOf("mqtturl;") < 0) return mqtturl = _getStringPropertyValue("mqtturl", DEFAULT_MQTT_CLIENT_URL);
	else return mqtturl;
}
bool unitSetMQTTURL(String _mqtturl)
{
	mqtturl = _mqtturl;
	return  onInsideChange("mqtturl", String(mqtturl));
}

//MQTTID()  
String unitGetMQTTID()
{
	if (propertyFileReaded.indexOf("mqttid;") < 0) return mqttid = _getStringPropertyValue("mqttid", DEFAULT_MQTT_CLIENT_URL);
	else return mqttid;
}

bool unitSetMQTTID(String _mqttid)
{
	mqttid = _mqttid;
	return  onInsideChange("mqttid", String(mqttid));
}

//MQTTLogin()  
String unitGetMQTTLogin()
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
bool unitSetMQTTLogin(String _mqttlogin)
{
	mqttlogin = _mqttlogin;
	return  onInsideChange("mqttlogin", String(mqttlogin));
}

//MQTTPassword()  
String unitGetMQTTPassword()
{
	if (propertyFileReaded.indexOf("mqttpassword;") < 0) return mqttpassword = _getStringPropertyValue("mqttpassword", DEFAULT_MQTT_CLIENT_PASSWORD);
	else return mqttpassword;
}
bool unitSetMQTTPassword(String _mqttpassword)
{
	mqttpassword = _mqttpassword;
	return  onInsideChange("mqttpassword", String(mqttpassword));
}

//MQTTClientConnected
int unitGetMQTTClientConnected()
{
	return (int)(getMQTTClient()->connected());
}

//MQTTClientState
int unitGetMQTTClientState()
{
	return getMQTTClient()->state();
}

//OTAAvailable()  
int unitGetOTAAvailable()
{
	if (propertyFileReaded.indexOf("otaavailable;") < 0)
	{
		return otaavailable = _getIntPropertyValue("otaavailable", DEFAULT_OTA_CLIENT_AVAILABLE);
	}
	else
	{
		return otaavailable;
	}
}
bool unitSetOTAAvailable(int _otaavailable)
{
	otaavailable = _otaavailable;
	return  onInsideChange("otaavailable", String(otaavailable));
}


//OTAPort()  
int unitGetOTAPort()
{
	if (propertyFileReaded.indexOf("otaport;") < 0) return otaport = _getIntPropertyValue("otaport", DEFAULT_OTA_CLIENT_PORT);
	else return otaport;
}
bool unitSetOTAPort(int _otaport)
{
	otaport = _otaport;
	return  onInsideChange("otaport", String(otaport));
}

//OTAID()  
String unitGetOTAID()
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
bool unitSetOTAID(String _otaid)
{
	otaid = _otaid;
	return  onInsideChange("otaid", String(otaid));
}

//OTAPassword()  
String unitGetOTAPassword()
{
	if (propertyFileReaded.indexOf("otapassword;") < 0) return otapassword = _getStringPropertyValue("otapassword", DEFAULT_OTA_CLIENT_PASSWORD);
	else return otapassword;
}
bool unitSetOTAPassword(String _otapassword)
{
	otapassword = _otapassword;
	return onInsideChange("otapassword", String(otapassword));
}

// WiFi parameters
//WiFiMode
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
WiFiMode_t unitGetWiFiMode()
{
	WiFiMode_t _wifimode = WiFi.getMode();
	if (_wifimode != wifimode) onInsideChange("wifimode", String(_wifimode));
	return wifimode = _wifimode;
}

bool unitSetWiFiMode(WiFiMode_t _wifimode)
{
	if (WiFi.mode(_wifimode))
	{
		wifimode = _wifimode;
		return onInsideChange("wifimode", String(wifimode));
	}
	return false;
}
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
wifi_mode_t unitGetWiFiMode()
{
	wifi_mode_t _wifimode = WiFi.getMode();
	if (_wifimode != wifimode) onInsideChange("wifimode", String(_wifimode));
	return wifimode = _wifimode;
}

bool unitSetWiFiMode(wifi_mode_t _wifimode)
{
	if (WiFi.mode(_wifimode))
	{
		wifimode = _wifimode;
		return onInsideChange("wifimode", String(wifimode));
	}
	return false;
}
#endif


// Get all WiFi modes
String unitGetAllWiFiModes()
{
	String result = "allwifimodes=";
	result += "0:WIFI_OFF;1:WIFI_STA;2:WIFI_AP;3:WIFI_AP_STA;";
	return result;
}

//GetWiFiRSSI
int32_t unitGetWiFiRSSI()
{
	int32_t _wifirssi = WiFi.RSSI();
	if (_wifirssi != wifirssi) onInsideChange("wifirssi", String(_wifirssi));
	return wifirssi = _wifirssi;
}
bool unitSetWiFiRSSI(int _wifirssi)
{
	return false;
}

//GetWiFiStatus
wl_status_t unitGetWiFiStatus()
{
	wl_status_t _wifistatus = WiFi.status();
	if (_wifistatus != wifistatus) onInsideChange("wifistatus", String(_wifistatus));
	return wifistatus = _wifistatus;
}
bool unitSetWiFiStatus(int _wifistatus)
{
	return false;
}

// Get all WiFi statuses
String unitGetAllWiFiStatuses()
{
	String result = "allwifistatuses=";
	result += "0:WL_IDLE_STATUS;";
	result += "1:WL_NO_SSID_AVAIL; ";
	result += "2:WL_SCAN_COMPLETED;";
	result += "3:WL_CONNECTED;";
	result += "4:WL_CONNECT_FAILED;";
	result += "5:WL_CONNECTION_LOST;";
	result += "6:WL_DISCONNECTED;";
	return result;
}

// Get WiFi status in String format
String unitGetWiFiStatusToString()
{
	wl_status_t wifistatus = unitGetWiFiStatus();
	if (wifistatus == WL_IDLE_STATUS) return "WL_IDLE_STATUS";
	if (wifistatus == WL_NO_SSID_AVAIL) return "WL_NO_SSID_AVAIL";
	if (wifistatus == WL_SCAN_COMPLETED) return "WL_SCAN_COMPLETED";
	if (wifistatus == WL_CONNECTED) return "WL_CONNECTED";
	if (wifistatus == WL_CONNECT_FAILED) return "WL_CONNECT_FAILED";
	if (wifistatus == WL_CONNECTION_LOST) return "WL_CONNECTION_LOST";
	if (wifistatus == WL_DISCONNECTED) return "WL_DISCONNECTED";
	return "unknown Wi-Fi status " + String(wifistatus);
}

//GetScanWiFiNetworks
int8_t unitGetScanWiFiNetworks()
{
	//TEMP
  //  if (wifinetworkscount != 0) return wifinetworkscount;
	bool asyncFalse = false;
	bool show_hiddenTrue = true;
	wifinetworkscount = WiFi.scanNetworks(asyncFalse, show_hiddenTrue);
	onInsideChange("wifinetworkscount", String(wifinetworkscount));
	return wifinetworkscount;
}
bool unitSetScanWiFiNetworks(int _scanwifinetworks)
{
	return false;
}

//GetWiFiNetworksCount
int8_t unitGetWiFiNetworksCount()
{
	return wifinetworkscount;
}
bool unitSetWiFiNetworksCount(int _wifinetworkscount)
{
	return false;
}

//GetWiFiNetworksParameters
String unitGetWiFiNetworksParameters()
{
	String result = "wifinetworkscount=" + String(unitGetWiFiNetworksCount()) + "//r\n";
	for (int8_t i = 0; i < wifinetworkscount; i++)
	{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		result += "wifinetwork" + String(i) + "=SSID:" + WiFi.SSID(i) + ";RSSI:" + String(WiFi.RSSI(i)) + ";channel:" + String(WiFi.channel(i)) + ";BSSID:" + WiFi.BSSIDstr(i) + ";encryption:" + String(WiFi.encryptionType(i)) + ";hinden:" + String(WiFi.isHidden(i)) + ";//r\n";
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
		result += "wifinetwork" + String(i) + "=SSID:" + WiFi.SSID(i) + ";RSSI:" + String(WiFi.RSSI(i)) + ";channel:" + String(WiFi.channel(i)) + ";BSSID:" + WiFi.BSSIDstr(i) + ";encryption:" + String(WiFi.encryptionType(i)) + ";//r\n";
#endif
	}
	return result;
}
//bool unitSetWiFiNetworksParameters(String _wifinetworksparameters)
//{
//  return false;
//}

// Get all WiFi encryption types
String unitGetAllWiFiEncryptionTypes()
{
	String result = "allwifiencryptiontypes=";
	result += "5:ENC_TYPE_WEP;";
	result += "2:ENC_TYPE_TKIP;";
	result += "4:ENC_TYPE_CCMP;";
	result += "7:ENC_TYPE_NONE;";
	result += "8:ENC_TYPE_AUTO;";
	return result;
}

//WiFiIsConnected
int unitGetWiFiIsConnected()
{
	int _wifiisconnected = (int)WiFi.isConnected();
	if (_wifiisconnected != wifiisconnected) onInsideChange("wifiisconnected", String(_wifiisconnected));
	unitGetWiFiStatus();
	return wifiisconnected = _wifiisconnected;
}

//https://github.com/KirinDenis/owlos/issues/7
bool unitSetWiFiIsConnected(int _connected1disconnected0)
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	int _wifiisconnected;
	if (_connected1disconnected0 == 1) // command to connect
	{
		if (WiFi.begin(unitGetWiFiSSID(), unitGetWiFiPassword()) == WL_CONNECTED)
			_wifiisconnected = 1; // successful connection
		else _wifiisconnected = 0;
	}
	else if (_connected1disconnected0 == 0) // command to disconnect
	{
		WiFi.disconnect();
		_wifiisconnected = 0;
	}
	else return false;  // connected command don't 0 or 1
	// continue
	if (wifiisconnected != _wifiisconnected) onInsideChange("wifiisconnected", String(_wifiisconnected));
	unitGetWiFiStatus();
	wifiisconnected = _wifiisconnected;
	return true;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return false;
#endif

}

//GetConnectedWiFiSSID
String unitGetConnectedWiFiSSID()
{
	String _connectedwifissid = WiFi.SSID();
	if (!String(_connectedwifissid).equals(connectedwifissid)) onInsideChange("connectedwifissid", String(_connectedwifissid));
	connectedwifissid = _connectedwifissid;
	if (connectedwifissid.length() == 0) return " ";
	else return connectedwifissid;
}

/**/
//ESPResetInfo()  
String unitGetESPResetInfo()
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
bool unitSetESPResetInfo(String _espresetinfo)
{
	return false;
}

//ESPReset()  
int unitGetESPReset()
{
	if (propertyFileReaded.indexOf("espreset;") < 0) return espreset = DEFAULT_ZERO_VALUE;
	else return espreset;
}
bool unitSetESPReset(int _espreset)
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
int unitGetESPRestart()
{
	if (propertyFileReaded.indexOf("esprestart;") < 0) return esprestart = DEFAULT_ZERO_VALUE;
	else return esprestart;
}
bool unitSetESPRestart(int _esprestart)
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
uint16_t unitGetESPVcc()
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

bool unitSetESPVcc(int _espvcc)
{
	return false;
}

//ESPGetChipId()  
uint32_t unitGetESPChipId()
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
bool unitSetESPChipId(int _espchipid)
{
	return false;
}

//ESPGetFreeHeap()  
uint32_t unitGetESPFreeHeap()
{
	if (propertyFileReaded.indexOf("espfreeheap;") < 0) return espfreeheap = ESP.getFreeHeap();
	else return espfreeheap;
}
bool unitSetESPFreeHeap(int _espfreeheap)
{
	return false;
}

//ESPGetMaxFreeBlockSize
uint16_t unitGetESPMaxFreeBlockSize()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espmaxfreeblocksize;") < 0) return espmaxfreeblocksize = ESP.getMaxFreeBlockSize();
	else return espmaxfreeblocksize;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif	
}
bool unitSetESPMaxFreeBlockSize(int _espmaxfreeblocksize)
{
	return false;
}

//ESPGetHeapFragmentation
uint8_t unitGetESPHeapFragmentation()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espheapfragmentation;") < 0) return espheapfragmentation = ESP.getHeapFragmentation();
	else return espheapfragmentation;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool unitSetESPHeapFragmentation(int _espheapfragmentation)
{
	return false;
}

//ESPGetSdkVersion
const char * unitGetESPSdkVersion()
{
	if (propertyFileReaded.indexOf("espsdkversion;") < 0) return espsdkversion = ESP.getSdkVersion();
	else return espsdkversion;
}
bool unitSetESPSdkVersion(String _espsdkversion)
{
	return false;
}

//ESPGetCoreVersion
String unitGetESPCoreVersion()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espcoreversion;") < 0) return espcoreversion = ESP.getCoreVersion();
	else return espcoreversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return NotAvailable;
#endif
}
bool unitSetESPCoreVersion(String _espcoreversion)
{
	return false;
}

//ESPGetFullVersion
String unitGetESPFullVersion()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espfullversion;") < 0) return espfullversion = ESP.getFullVersion();
	else return espfullversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return NotAvailable;
#endif
}

bool unitSetESPFullVersion(String _espfullversion)
{
	return false;
}

//ESPGetBootVersion
uint8_t unitGetESPBootVersion()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espbootversion;") < 0) return espbootversion = ESP.getBootVersion();
	else return espbootversion;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif

}
bool unitSetESPBootVersion(int _espbootversion)
{
	return false;
}

//ESPGetBootMode
uint8_t unitGetESPBootMode()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espbootmode;") < 0) return espbootmode = ESP.getBootMode();
	else return espbootmode;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif


}
bool unitSetESPBootMode(int _espbootmode)
{
	return false;
}

//ESPGetCpuFreqMHz
uint8_t unitGetESPCpuFreqMHz()
{
	if (propertyFileReaded.indexOf("espcpufreqmhz;") < 0) return espcpufreqmhz = ESP.getCpuFreqMHz();
	else return espcpufreqmhz;
}
bool unitSetESPCpuFreqMHz(int _espcpufreqmhz)
{
	return false;
}

//ESPGetFlashChipId
uint32_t unitGetESPFlashChipId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espflashchipid;") < 0) return espflashchipid = ESP.getFlashChipId();
	else return espflashchipid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif
}
bool unitSetESPFlashChipId(int _espflashchipid)
{
	return false;
}

//ESPGetFlashChipVendorId
uint8_t unitGetESPFlashChipVendorId()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espflashchipvendorid;") < 0) return espflashchipvendorid = ESP.getFlashChipVendorId();
	else return espflashchipvendorid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif

}
bool unitSetESPFlashChipVendorId(int _espflashchipvendorid)
{
	return false;
}

//ESPGetFlashChipRealSize
uint32_t unitGetESPFlashChipRealSize()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("espflashchiprealsize;") < 0) return espflashchiprealsize = ESP.getFlashChipRealSize();
	else return espflashchiprealsize;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return -1;
#endif

}
bool unitSetESPFlashChipRealSize(int _espflashchiprealsize)
{
	return false;
}

//ESPGetFlashChipSize
uint32_t unitGetESPFlashChipSize()
{
	if (propertyFileReaded.indexOf("espflashchipsize;") < 0) return espflashchipsize = ESP.getFlashChipSize();
	else return espflashchipsize;
}
bool unitSetESPFlashChipSize(int _espflashchipsize)
{
	return false;
}

//ESPGetFlashChipSpeed
uint32_t unitGetESPFlashChipSpeed()
{
	if (propertyFileReaded.indexOf("espflashchipspeed;") < 0) return espflashchipspeed = ESP.getFlashChipSpeed();
	else return espflashchipspeed;
}
bool unitSetESPFlashChipSpeed(int _espflashchipspeed)
{
	return false;
}

//ESPGetSketchSize
uint32_t unitGetESPSketchSize()
{
	if (propertyFileReaded.indexOf("espsketchsize;") < 0) return espsketchsize = ESP.getSketchSize();
	else return espsketchsize;
}
bool unitSetESPSketchSize(int _espsketchsize)
{
	return false;
}

//ESPGetFreeSketchSpace
uint32_t unitGetESPFreeSketchSpace()
{
	if (propertyFileReaded.indexOf("espfreesketchspace;") < 0) return espfreesketchspace = ESP.getFreeSketchSpace();
	else return espfreesketchspace;
}
bool unitSetESPFreeSketchSpace(int _espfreesketchspace)
{
	return false;
}

//ESPGetFlashChipMode
FlashMode_t unitGetESPFlashChipMode()
{
	if (propertyFileReaded.indexOf("espflashchipmode;") < 0) return espflashchipmode = ESP.getFlashChipMode();
	else return espflashchipmode;
}
bool unitSetESPFlashChipMode(int _espflashchipmode)
{
	return false;
}

//ESPGetSketchMD5
String unitGetESPSketchMD5()
{
	if (propertyFileReaded.indexOf("espsketchmd5;") < 0) return espsketchmd5 = ESP.getSketchMD5();
	else return espsketchmd5;
}
bool unitSetESPSketchMD5(String _espsketchmd5)
{
	return false;
}

//ESPGetResetReason
String unitGetESPResetReason()
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
bool unitSetESPResetReason(String _espresetreason)
{
	return false;
}

//ESPGetMagicFlashChipSize
uint32_t unitGetESPMagicFlashChipSize(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipsize;") < 0) return espmagicflashchipsize = ESP.magicFlashChipSize(byte);
	else return espmagicflashchipsize;
}
bool unitSetESPMagicFlashChipSize(int _espmagicflashchipsize)
{
	return false;
}

//ESPGetMagicFlashChipSpeed
uint32_t unitGetESPMagicFlashChipSpeed(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipspeed;") < 0) return espmagicflashchipspeed = ESP.magicFlashChipSpeed(byte);
	else return espmagicflashchipspeed;
}
bool unitSetESPMagicFlashChipSpeed(int _espmagicflashchipspeed)
{
	return false;
}

//ESPGetMagicFlashChipMode
FlashMode_t unitGetESPMagicFlashChipMode(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipmode;") < 0) return espmagicflashchipmode = ESP.magicFlashChipMode(byte);
	else return espmagicflashchipmode;
}
bool unitSetESPMagicFlashChipMode(int _espmagicflashchipmode)
{
	return false;
}

//Pins 
String unitGetBusyPins()
{
	/*
	String __busyPins = driversGetBusyPins();
	if (!String(__busyPins).equals(_busyPins)) onInsideChange("busypins", String(__busyPins));
	if (__busyPins.length() == 0) return " ";
	else return _busyPins = __busyPins;
	*/
}

String unitGetPinsMap()
{
	/*
	String _pinsMap = driversGetPinsMap();
	if (!String(_pinsMap).equals(pinsMap)) onInsideChange("pinsmap", String(_pinsMap));
	return pinsMap = _pinsMap;
	*/
}

//UpdateAvailable()  
int unitGetUpdateAvailable()
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
bool unitSetUpdateAvailable(int _updateavailable)
{
	updateavailable = _updateavailable;
	return  onInsideChange("updateavailable", String(updateavailable));
}

//UpdateHost
String unitGetUpdateHost()
{
	if (propertyFileReaded.indexOf("updatehost;") < 0) return updatehost = _getStringPropertyValue("updatehost", DEFAULT_UPDATE_HOST);
	else return updatehost;
}
bool unitSetUpdateHost(String _updatehost)
{
	updatehost = _updatehost;
	return onInsideChange("updatehost", updatehost);
}
