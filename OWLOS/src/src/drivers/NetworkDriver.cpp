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

#include "NetworkDriver.h"
#ifdef USE_ESP_DRIVER
#define ESP_ENABLE_INTERNAL_API

#include "ESPDriver.h"
#include "../services/DriverService.h"
#include "../services/FileService.h"
#include "../services/UpdateService.h"
#include "../services/TransportService.h"

extern String propertyFileReaded;
extern String topic;
extern String nodeid;

#define DEFAULT_HTTP_SERVER_AVAILABLE true
#define DEFAULT_HTTP_SERVER_USERNAME "admin"
#define DEFAULT_HTTP_SERVER_PASSWORD "admin"
#define DEFAULT_HTTP_SERVER_PORT 80

#define DEFAULT_HTTPS_SERVER_AVAILABLE true
#define DEFAULT_HTTPS_SERVER_USERNAME "admin"
#define DEFAULT_HTTPS_SERVER_PASSWORD "admin"
#define DEFAULT_HTTPS_SERVER_PORT 443

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
#define DEFAULT_OTA_CLIENT_PASSWORD "owlos"

//Update
#define DEFAULT_UPDATE_AVAILABLE true
#define DEFAULT_UPDATE_HOST "http://81.95.178.177:8080/update/"

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

//Update
int updateavailable(DEFAULT_UPDATE_AVAILABLE);
String updatehost(DEFAULT_UPDATE_HOST);

String nodeGetNetworkProperties()
{
    return 		   "properties for:network\n"
		   "id=network//r\n"
		   "type=" +
		   String(NETWORK_DRIVER_TYPE) + "//r\n"
								 "firmwareversion=" +
		   nodeGetFirmwareVersion() + "//r\n"
									  "firmwarebuildnumber=" +
		   String(nodeGetFirmwareBuildNumber()) + "//ri\n"
												  "nodeid=" +
		   nodeGetUnitId() + "//\n"
							 "topic=" +
		   nodeGetTopic() + "//\n"
							"restfulavailable=" +
		   String(nodeGetRESTfulAvailable()) + "//bs\n"
											   "webserverlogin=" +
		   nodeGetRESTfulServerUsername() + "//\n"
											"webserverpwd=" +
		   nodeGetRESTfulServerPassword() + "//sp\n"
											"restfulserverport=" +
		   String(nodeGetRESTfulServerPort()) + "//i\n"
												"restfulclientport=" +
		   String(nodeGetRESTfulClientPort()) + "//i\n"
												"restfulclienturl=" +
		   nodeGetRESTfulClientURL() + "//\n"
									   "mqttavailable=" +
		   String(nodeGetMQTTAvailable()) + "//bs\n"
											"mqttport=" +
		   String(nodeGetMQTTPort()) + "//i\n"
									   "mqtturl=" +
		   nodeGetMQTTURL() + "//\n"
							  "mqttid=" +
		   nodeGetMQTTID() + "//\n"
							 "mqttlogin=" +
		   nodeGetMQTTLogin() + "//\n"
								"mqttpassword=" +
		   nodeGetMQTTPassword() + "//p\n"
								   "mqttclientconnected=" +
		   String(nodeGetMQTTClientConnected()) + "//bs\n"
												  "mqttclientstate=" +
		   String(nodeGetMQTTClientState()) + "//i\n"

											  "otaavailable=" +
		   String(nodeGetOTAAvailable()) + "//bs\n"
										   "otaport=" +
		   String(nodeGetOTAPort()) + "//i\n"
									  "otaid=" +
		   nodeGetOTAID() + "//\n"
							"otapassword=" +
		   nodeGetOTAPassword() + "//p\n"
								  "updateavailable=" +
		   String(nodeGetUpdateAvailable()) + "//bs\n"
#ifdef USE_UPDATE
											  "updatepossible=" +
		   String(updateGetUpdatePossible()) + "//ir\n"
											   "updateinfo=" +
		   String(updateGetUpdateInfo()) + "//r\n"
										   "updateuistatus=" +
		   String(updateGetUpdateUIStatus()) + "//ir\n"
											   "updatefirmwarestatus=" +
		   String(updateGetUpdateFirmwareStatus()) + "//ir\n"
#endif
													 "updatehost=" +
		   nodeGetUpdateHost() + "//s\n";

}

String networkOnMessage(String route, String _payload, int8_t transportMask)
{
 if (matchRoute(route, topic, "/getrestfulavailable"))
	{
		return onGetProperty("restfulavailable", String(nodeGetRESTfulAvailable()), transportMask);
	}
	else if (matchRoute(route, topic, "/setrestfulavailable"))
	{
		return String(nodeSetRESTfulAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getwebserverlogin"))
	{
		return onGetProperty("webserverlogin", nodeGetRESTfulServerUsername(), transportMask);
	}
	else if (matchRoute(route, topic, "/setwebserverlogin"))
	{
		return String(nodeSetRESTfulServerUsername(_payload));
	}
	else if (matchRoute(route, topic, "/getwebserverpwd"))
	{
		return onGetProperty("webserverpwd", nodeGetRESTfulServerPassword(), transportMask);
	}
	else if (matchRoute(route, topic, "/setwebserverpwd"))
	{
		return String(nodeSetRESTfulServerPassword(_payload));
	}
	else if (matchRoute(route, topic, "/getrestfulserverport"))
	{
		return onGetProperty("restfulserverport", String(nodeGetRESTfulServerPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/setrestfulserverport"))
	{
		return String(nodeSetRESTfulServerPort(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getrestfulclientport"))
	{
		return onGetProperty("restfulclientport", String(nodeGetRESTfulClientPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/setrestfulclientport"))
	{
		return String(nodeSetRESTfulClientPort(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getrestfulclienturl"))
	{
		return onGetProperty("restfulclienturl", nodeGetRESTfulClientURL(), transportMask);
	}
	else if (matchRoute(route, topic, "/setrestfulclienturl"))
	{
		return String(nodeSetRESTfulClientURL(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttavailable"))
	{
		return onGetProperty("mqttavailable", String(nodeGetMQTTAvailable()), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttavailable"))
	{
		return String(nodeSetMQTTAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getmqttport"))
	{
		return onGetProperty("mqttport", String(nodeGetMQTTPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttport"))
	{
		return String(nodeSetMQTTPort(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getmqtturl"))
	{
		return onGetProperty("mqtturl", nodeGetMQTTURL(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqtturl"))
	{
		return String(nodeSetMQTTURL(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttid"))
	{
		return onGetProperty("mqttid", nodeGetMQTTID(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttid"))
	{
		return String(nodeSetMQTTID(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttlogin"))
	{
		return onGetProperty("mqttlogin", nodeGetMQTTLogin(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttlogin"))
	{
		return String(nodeSetMQTTLogin(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttpassword"))
	{
		return onGetProperty("mqttpassword", nodeGetMQTTPassword(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttpassword"))
	{
		return String(nodeSetMQTTPassword(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttclientconnected"))
	{
		return String(nodeGetMQTTClientConnected());
	}
	else if (matchRoute(route, topic, "/getmqttclientstate"))
	{
		return String(nodeGetMQTTClientState());
	}
	else if (matchRoute(route, topic, "/getotaavailable"))
	{
		return onGetProperty("otaavailable", String(nodeGetOTAAvailable()), transportMask);
	}
	else if (matchRoute(route, topic, "/setotaavailable"))
	{
		return String(nodeSetOTAAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getotaport"))
	{
		return onGetProperty("otaport", String(nodeGetOTAPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/setotaport"))
	{
		return String(nodeSetOTAPort(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getotaid"))
	{
		return onGetProperty("otaid", nodeGetOTAID(), transportMask);
	}
	else if (matchRoute(route, topic, "/setotaid"))
	{
		return String(nodeSetOTAID(_payload));
	}
	else if (matchRoute(route, topic, "/getotapassword"))
	{
		return onGetProperty("otapassword", nodeGetMQTTPassword(), transportMask);
	}
	else if (matchRoute(route, topic, "/setotapassword"))
	{
		return String(nodeSetOTAPassword(_payload));
		//ESP class parameters
	}
	return WRONG_NODE_PROPERTY_NAME;
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
	return onInsideChange("restfulavailable", String(restfulavailable));
}

//RESTfulServerUsername
String nodeGetRESTfulServerUsername()
{
	if (propertyFileReaded.indexOf("webserverlogin;") < 0)
		return webserverlogin = _getStringPropertyValue("webserverlogin", DEFAULT_HTTP_SERVER_USERNAME);
	else
		return webserverlogin;
}
bool nodeSetRESTfulServerUsername(String _webserverlogin)
{
	webserverlogin = _webserverlogin;
	return onInsideChange("webserverlogin", String(webserverlogin));
}

//RESTfulServerPassword
String nodeGetRESTfulServerPassword()
{
	if (propertyFileReaded.indexOf("webserverpwd;") < 0)
		return webserverpwd = _getStringPropertyValue("webserverpwd", DEFAULT_HTTP_SERVER_PASSWORD);
	else
		return webserverpwd;
}
bool nodeSetRESTfulServerPassword(String _webserverpwd)
{
	webserverpwd = _webserverpwd;
	return onInsideChange("webserverpwd", String(webserverpwd));
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
	return onInsideChange("restfulserverport", String(restfulserverport));
}

//RESTfulClientPort()
int nodeGetRESTfulClientPort()
{
	if (propertyFileReaded.indexOf("restfulclientport;") < 0)
		return restfulclientport = _getIntPropertyValue("restfulclientport", DEFAULT_HTTP_CLIENT_PORT);
	else
		return restfulclientport;
}
bool nodeSetRESTfulClientPort(int _restfulclientport)
{
	restfulclientport = _restfulclientport;
	return onInsideChange("restfulclientport", String(restfulclientport));
}

//RESTfulClientURL()
String nodeGetRESTfulClientURL()
{
	if (propertyFileReaded.indexOf("restfulclienturl;") < 0)
		return restfulclienturl = _getStringPropertyValue("restfulclienturl", DEFAULT_HTTP_CLIENT_URL);
	else
		return restfulclienturl;
}
bool nodeSetRESTfulClientURL(String _restfulclienturl)
{
	restfulclienturl = _restfulclienturl;
	return onInsideChange("restfulclienturl", String(restfulclienturl));
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
	return onInsideChange("mqttavailable", String(mqttavailable));
}

//MQTTPort()
int nodeGetMQTTPort()
{
	if (propertyFileReaded.indexOf("mqttport;") < 0)
		return mqttport = _getIntPropertyValue("mqttport", DEFAULT_MQTT_CLIENT_PORT);
	else
		return mqttport;
}
bool nodeSetMQTTPort(int _mqttport)
{
	mqttport = _mqttport;
	return onInsideChange("mqttport", String(mqttport));
}

//MQTTURL()
String nodeGetMQTTURL()
{
	if (propertyFileReaded.indexOf("mqtturl;") < 0)
		return mqtturl = _getStringPropertyValue("mqtturl", DEFAULT_MQTT_CLIENT_URL);
	else
		return mqtturl;
}
bool nodeSetMQTTURL(String _mqtturl)
{
	mqtturl = _mqtturl;
	return onInsideChange("mqtturl", String(mqtturl));
}

//MQTTID()
String nodeGetMQTTID()
{
	if (propertyFileReaded.indexOf("mqttid;") < 0)
		return mqttid = _getStringPropertyValue("mqttid", DEFAULT_MQTT_CLIENT_ID);
	else
		return mqttid;
}

bool nodeSetMQTTID(String _mqttid)
{
	mqttid = _mqttid;
	return onInsideChange("mqttid", String(mqttid));
}

//MQTTLogin()
String nodeGetMQTTLogin()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("mqttlogin;") < 0)
		return mqttlogin = _getStringPropertyValue("mqttlogin", DEFAULT_MQTT_CLIENT_LOGIN + String(ESP.getChipId(), HEX));
	else
		return mqttlogin;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("mqttlogin;") < 0)
		return mqttlogin = _getStringPropertyValue("mqttlogin", DEFAULT_MQTT_CLIENT_LOGIN + String((int)ESP.getEfuseMac(), (unsigned char)HEX));
	else
		return mqttlogin;
#endif
}
bool nodeSetMQTTLogin(String _mqttlogin)
{
	mqttlogin = _mqttlogin;
	return onInsideChange("mqttlogin", String(mqttlogin));
}

//MQTTPassword()
String nodeGetMQTTPassword()
{
	if (propertyFileReaded.indexOf("mqttpassword;") < 0)
		return mqttpassword = _getStringPropertyValue("mqttpassword", DEFAULT_MQTT_CLIENT_PASSWORD);
	else
		return mqttpassword;
}
bool nodeSetMQTTPassword(String _mqttpassword)
{
	mqttpassword = _mqttpassword;
	return onInsideChange("mqttpassword", String(mqttpassword));
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
	return onInsideChange("otaavailable", String(otaavailable));
}

//OTAPort()
int nodeGetOTAPort()
{
	if (propertyFileReaded.indexOf("otaport;") < 0)
		return otaport = _getIntPropertyValue("otaport", DEFAULT_OTA_CLIENT_PORT);
	else
		return otaport;
}
bool nodeSetOTAPort(int _otaport)
{
	otaport = _otaport;
	return onInsideChange("otaport", String(otaport));
}

//OTAID()
String nodeGetOTAID()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("otaid;") < 0)
		return otaid = _getStringPropertyValue("otaid", DEFAULT_OTA_CLIENT_ID + String(ESP.getChipId()));
	else
		return otaid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("otaid;") < 0)
		return otaid = _getStringPropertyValue("otaid", DEFAULT_OTA_CLIENT_ID + String((int)ESP.getEfuseMac()));
	else
		return otaid;
#endif
}
bool nodeSetOTAID(String _otaid)
{
	otaid = _otaid;
	return onInsideChange("otaid", String(otaid));
}

//OTAPassword()
String nodeGetOTAPassword()
{
	if (propertyFileReaded.indexOf("otapassword;") < 0)
		return otapassword = _getStringPropertyValue("otapassword", DEFAULT_OTA_CLIENT_PASSWORD);
	else
		return otapassword;
}
bool nodeSetOTAPassword(String _otapassword)
{
	otapassword = _otapassword;
	return onInsideChange("otapassword", String(otapassword));
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
	return onInsideChange("updateavailable", String(updateavailable));
}

//UpdateHost
String nodeGetUpdateHost()
{
	if (propertyFileReaded.indexOf("updatehost;") < 0)
		return updatehost = _getStringPropertyValue("updatehost", DEFAULT_UPDATE_HOST);
	else
		return updatehost;
}
bool nodeSetUpdateHost(String _updatehost)
{
	updatehost = _updatehost;
	return onInsideChange("updatehost", updatehost);
}


#endif