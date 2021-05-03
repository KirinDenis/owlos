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
extern String thingid;

#ifdef USE_HTTP_SERVER
#define DEFAULT_HTTP_SERVER_AVAILABLE true
#define DEFAULT_HTTP_SERVER_USERNAME "ThingsManager"
#define DEFAULT_HTTP_SERVER_PASSWORD "ThingsManager"
#define DEFAULT_HTTP_SERVER_PORT 80
#endif

#ifdef USE_HTTPS_SERVER
#define DEFAULT_HTTPS_SERVER_AVAILABLE false
#define DEFAULT_HTTPS_SERVER_USERNAME "ThingsManager"
#define DEFAULT_HTTPS_SERVER_PASSWORD "ThingsManager"
#define DEFAULT_HTTPS_SERVER_PORT 443
#endif

#ifdef USE_HTTP_CLIENT
#define DEFAULT_HTTP_CLIENT_PORT 8080
#define DEFAULT_HTTP_CLIENT_URL ""
#endif

#ifdef USE_MQTT
#define DEFAULT_MQTT_CLIENT_AVAILABLE true
#define DEFAULT_MQTT_CLIENT_PORT 1883
#define DEFAULT_MQTT_CLIENT_URL "mqtt.eclipse.org"
#define DEFAULT_MQTT_CLIENT_ID ""
#define DEFAULT_MQTT_CLIENT_LOGIN ""
#define DEFAULT_MQTT_CLIENT_PASSWORD ""
#endif

#ifdef USE_OTA_SERVICE
#define DEFAULT_OTA_CLIENT_AVAILABLE false
#define DEFAULT_OTA_CLIENT_PORT 8266
#define DEFAULT_OTA_CLIENT_ID "owlthing"
#define DEFAULT_OTA_CLIENT_PASSWORD "owlos"
#endif

#ifdef USE_UPDATE_SERVICE
#define DEFAULT_UPDATE_AVAILABLE true
#define DEFAULT_UPDATE_HOST "https://github.com/KirinDenis/owlos/tree/master/OWLOS"
#endif

#ifdef USE_HTTP_SERVER
int httpserveravailable(DEFAULT_HTTP_SERVER_AVAILABLE);
String httpserverlogin(DEFAULT_HTTP_SERVER_USERNAME);
String httpserverpwd(DEFAULT_HTTP_SERVER_PASSWORD);
int httpserverport(DEFAULT_HTTP_SERVER_PORT);
#endif

#ifdef USE_HTTPS_SERVER
int httpsserveravailable(DEFAULT_HTTPS_SERVER_AVAILABLE);
String httpsserverlogin(DEFAULT_HTTPS_SERVER_USERNAME);
String httpsserverpwd(DEFAULT_HTTPS_SERVER_PASSWORD);
int httpsserverport(DEFAULT_HTTPS_SERVER_PORT);
#endif

#ifdef USE_HTTP_CLIENT
int httpclientport(DEFAULT_HTTP_CLIENT_PORT);
String httpclienturl(DEFAULT_HTTP_CLIENT_URL);
#endif

#ifdef USE_MQTT
int mqttavailable(DEFAULT_MQTT_CLIENT_AVAILABLE);
int mqttport(DEFAULT_MQTT_CLIENT_PORT);
String mqtturl(DEFAULT_MQTT_CLIENT_URL);
String mqttid(DEFAULT_MQTT_CLIENT_URL);
String mqttlogin(DEFAULT_MQTT_CLIENT_LOGIN);
String mqttpassword(DEFAULT_MQTT_CLIENT_PASSWORD);
//int mqttclientconnected(DefaultMQTTClientConnected);
#endif

#ifdef USE_OTA_SERVICE
int otaavailable(DEFAULT_OTA_CLIENT_AVAILABLE);
int otaport(DEFAULT_OTA_CLIENT_PORT);
String otaid(DEFAULT_OTA_CLIENT_ID);
String otapassword(DEFAULT_OTA_CLIENT_PASSWORD);
#endif

#ifdef USE_UPDATE_SERVICE
int updateavailable(DEFAULT_UPDATE_AVAILABLE);
String updatehost(DEFAULT_UPDATE_HOST);
#endif

String thingGetNetworkProperties()
{
    return 		   "properties for:network\n"
		   "id=network//r\n"
		   "type=" +
		   String(NETWORK_DRIVER_TYPE) + "//r\n"
								 "firmwareversion=" +
		   thingGetFirmwareVersion() + "//r\n"
									  "firmwarebuildnumber=" +
		   String(thingGetFirmwareBuildNumber()) + "//ri\n"
												  "thingid=" +
		   thingGetUnitId() + "//\n"
							 "topic=" +
		   thingGetTopic() + "//\n"

#ifdef USE_HTTP_SERVER
			"httpserveravailable=" + String(thingGetHTTPServerAvailable()) + "//bs\n"
			"httpserverlogin=" + thingGetHTTPServerUsername() + "//\n"
			"httpserverpwd=" + thingGetHTTPServerPassword() + "//sp\n"
			"httpserverport=" + String(thingGetHTTPServerPort()) + "//i\n"
#endif			

#ifdef USE_HTTPS_SERVER
			"httpsserveravailable=" + String(thingGetHTTPSServerAvailable()) + "//bs\n"
			"httpsserverlogin=" + thingGetHTTPSServerUsername() + "//\n"
			"httpsserverpwd=" + thingGetHTTPSServerPassword() + "//sp\n"
			"httpsserverport=" + String(thingGetHTTPSServerPort()) + "//i\n"
#endif						

#ifdef USE_HTTP_CLIENT
												"httpclientport=" + String(thingGetHTTPClientPort()) + "//i\n"
												"httpclienturl=" +thingGetHTTPClientURL() + "//\n"
#endif												

#ifdef USE_MQTT
									   "mqttavailable=" +
		   String(thingGetMQTTAvailable()) + "//bs\n"
											"mqttport=" +
		   String(thingGetMQTTPort()) + "//i\n"
									   "mqtturl=" +
		   thingGetMQTTURL() + "//\n"
							  "mqttid=" +
		   thingGetMQTTID() + "//\n"
							 "mqttlogin=" +
		   thingGetMQTTLogin() + "//\n"
								"mqttpassword=" +
		   thingGetMQTTPassword() + "//p\n"
								   "mqttclientconnected=" +
		   String(thingGetMQTTClientConnected()) + "//bs\n"
												  "mqttclientstate=" +
		   String(thingGetMQTTClientState()) + "//i\n"
#endif

#ifdef USE_OTA_SERVICE
											  "otaavailable=" +
		   String(thingGetOTAAvailable()) + "//bs\n"
										   "otaport=" +
		   String(thingGetOTAPort()) + "//i\n"
									  "otaid=" +
		   thingGetOTAID() + "//\n"
							"otapassword=" +
		   thingGetOTAPassword() + "//p\n"
#endif		   

#ifdef USE_UPDATE_SERVICE
								  "updateavailable=" +
		   String(thingGetUpdateAvailable()) + "//bs\n"

											  "updatepossible=" +
		   String(updateGetUpdatePossible()) + "//ir\n"
											   "updateinfo=" +
		   String(updateGetUpdateInfo()) + "//r\n"
										   "updateuistatus=" +
		   String(updateGetUpdateUIStatus()) + "//ir\n"
											   "updatefirmwarestatus=" +
		   String(updateGetUpdateFirmwareStatus()) + "//ir\n"

													 "updatehost=" +
		   thingGetUpdateHost() + "//s\n"
#endif		   
;

}

String networkOnMessage(String route, String _payload, int8_t transportMask)
{
#ifdef USE_HTTP_SERVER	
    if (matchRoute(route, topic, "/gethttpserveravailable"))
	{
		return onGetProperty("httpserveravailable", String(thingGetHTTPServerAvailable()), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpserveravailable"))
	{
		return String(thingSetHTTPServerAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/gethttpserverlogin"))
	{
		return onGetProperty("httpserverlogin", thingGetHTTPServerUsername(), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpserverlogin"))
	{
		return String(thingSetHTTPServerUsername(_payload));
	}
	else if (matchRoute(route, topic, "/gethttpserverpwd"))
	{
		return onGetProperty("httpserverpwd", thingGetHTTPServerPassword(), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpserverpwd"))
	{
		return String(thingSetHTTPServerPassword(_payload));
	}
	else if (matchRoute(route, topic, "/gethttpserverport"))
	{
		return onGetProperty("httpserverport", String(thingGetHTTPServerPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpserverport"))
	{
		return String(thingSetHTTPServerPort(atoi(_payload.c_str())));
	}
	//HTTPS ---
    else 
#endif	

#ifdef USE_HTTPS_SERVER
	if (matchRoute(route, topic, "/gethttpsserveravailable"))
	{
		return onGetProperty("httpsserveravailable", String(thingGetHTTPSServerAvailable()), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpsserveravailable"))
	{
		return String(thingSetHTTPSServerAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/gethttpsserverlogin"))
	{
		return onGetProperty("httpsserverlogin", thingGetHTTPSServerUsername(), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpsserverlogin"))
	{
		return String(thingSetHTTPSServerUsername(_payload));
	}
	else if (matchRoute(route, topic, "/gethttpsserverpwd"))
	{
		return onGetProperty("httpsserverpwd", thingGetHTTPSServerPassword(), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpsserverpwd"))
	{
		return String(thingSetHTTPSServerPassword(_payload));
	}
	else if (matchRoute(route, topic, "/gethttpsserverport"))
	{
		return onGetProperty("httpsserverport", String(thingGetHTTPSServerPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpsserverport"))
	{
		return String(thingSetHTTPSServerPort(atoi(_payload.c_str())));
	}
	else 
#endif	
	
#ifdef USE_HTTP_CLIENT	
	if (matchRoute(route, topic, "/gethttpclientport"))
	{
		return onGetProperty("httpclientport", String(thingGetHTTPClientPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpclientport"))
	{
		return String(thingSetHTTPClientPort(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/gethttpclienturl"))
	{
		return onGetProperty("httpclienturl", thingGetHTTPClientURL(), transportMask);
	}
	else if (matchRoute(route, topic, "/sethttpclienturl"))
	{
		return String(thingSetHTTPClientURL(_payload));
	}
	else 
#endif	

#ifdef USE_MQTT
	if (matchRoute(route, topic, "/getmqttavailable"))
	{
		return onGetProperty("mqttavailable", String(thingGetMQTTAvailable()), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttavailable"))
	{
		return String(thingSetMQTTAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getmqttport"))
	{
		return onGetProperty("mqttport", String(thingGetMQTTPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttport"))
	{
		return String(thingSetMQTTPort(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getmqtturl"))
	{
		return onGetProperty("mqtturl", thingGetMQTTURL(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqtturl"))
	{
		return String(thingSetMQTTURL(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttid"))
	{
		return onGetProperty("mqttid", thingGetMQTTID(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttid"))
	{
		return String(thingSetMQTTID(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttlogin"))
	{
		return onGetProperty("mqttlogin", thingGetMQTTLogin(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttlogin"))
	{
		return String(thingSetMQTTLogin(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttpassword"))
	{
		return onGetProperty("mqttpassword", thingGetMQTTPassword(), transportMask);
	}
	else if (matchRoute(route, topic, "/setmqttpassword"))
	{
		return String(thingSetMQTTPassword(_payload));
	}
	else if (matchRoute(route, topic, "/getmqttclientconnected"))
	{
		return String(thingGetMQTTClientConnected());
	}
	else if (matchRoute(route, topic, "/getmqttclientstate"))
	{
		return String(thingGetMQTTClientState());
	}
	else 
#endif	

#ifdef USE_OTA_SERVICE
	if (matchRoute(route, topic, "/getotaavailable"))
	{
		return onGetProperty("otaavailable", String(thingGetOTAAvailable()), transportMask);
	}
	else if (matchRoute(route, topic, "/setotaavailable"))
	{
		return String(thingSetOTAAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getotaport"))
	{
		return onGetProperty("otaport", String(thingGetOTAPort()), transportMask);
	}
	else if (matchRoute(route, topic, "/setotaport"))
	{
		return String(thingSetOTAPort(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getotaid"))
	{
		return onGetProperty("otaid", thingGetOTAID(), transportMask);
	}
	else if (matchRoute(route, topic, "/setotaid"))
	{
		return String(thingSetOTAID(_payload));
	}
	else if (matchRoute(route, topic, "/getotapassword"))
	{
		return onGetProperty("otapassword", thingGetOTAPassword(), transportMask);
	}
	else if (matchRoute(route, topic, "/setotapassword"))
	{
		return String(thingSetOTAPassword(_payload));
		//ESP class parameters
	}
	else 
#endif	
#ifdef USE_UPDATE_SERVICE
	if (matchRoute(route, topic, "/getupdateavailable"))
	{
		return onGetProperty("updateavailable", String(thingGetUpdateAvailable()), transportMask);
	}

	else if (matchRoute(route, topic, "/setupdateavailable"))
	{
		return String(thingSetUpdateAvailable(atoi(_payload.c_str())));
	}
	else if (matchRoute(route, topic, "/getupdatepossible"))
	{
		return onGetProperty("updatepossible", String(updateGetUpdatePossible()), transportMask);
	}
	else if (matchRoute(route, topic, "/getupdateinfo"))
	{
		return onGetProperty("updateinfo", String(updateGetUpdateInfo()), transportMask);
	}
	else if (matchRoute(route, topic, "/getupdateuistatus"))
	{
		return onGetProperty("updateuistatus", String(updateGetUpdateUIStatus()), transportMask);
	}
	else if (matchRoute(route, topic, "/getupdatefirmwarestatus"))
	{
		return onGetProperty("updateufirmwarestatus", String(updateGetUpdateFirmwareStatus()), transportMask);
	}

	else if (matchRoute(route, topic, "/getupdatehost"))
	{
		return onGetProperty("updatehost", thingGetUpdateHost(), transportMask);
	}
	else if (matchRoute(route, topic, "/setupdatehost"))
	{
		return String(thingSetUpdateHost(_payload));
	}
#endif		
	return WRONG_THING_PROPERTY_NAME;
}

#ifdef USE_HTTP_SERVER
//HTTPServerAvailable()
int thingGetHTTPServerAvailable()
{
	if (propertyFileReaded.indexOf("httpserveravailable;") < 0)
	{
		return httpserveravailable = _getIntPropertyValue("httpserveravailable", DEFAULT_HTTP_SERVER_AVAILABLE);
	}
	else
	{
		return httpserveravailable;
	}
}
bool thingSetHTTPServerAvailable(int _httpserveravailable)
{
	httpserveravailable = _httpserveravailable;
	return onInsideChange("httpserveravailable", String(httpserveravailable));
}

//HTTPSServerUsername
String thingGetHTTPServerUsername()
{
	if (propertyFileReaded.indexOf("httpserverlogin;") < 0)
		return httpserverlogin = _getStringPropertyValue("httpserverlogin", DEFAULT_HTTP_SERVER_USERNAME);
	else
		return httpserverlogin;
}
bool thingSetHTTPServerUsername(String _httpserverlogin)
{
	httpserverlogin = _httpserverlogin;
	return onInsideChange("httpserverlogin", String(httpserverlogin));
}

//HTTPSServerPassword
String thingGetHTTPServerPassword()
{
	if (propertyFileReaded.indexOf("httpserverpwd;") < 0)
		return httpserverpwd = _getStringPropertyValue("httpserverpwd", DEFAULT_HTTP_SERVER_PASSWORD);
	else
		return httpserverpwd;
}
bool thingSetHTTPServerPassword(String _httpserverpwd)
{
	httpserverpwd = _httpserverpwd;
	return onInsideChange("httpserverpwd", String(httpserverpwd));
}

//HTTPSServerPort()
int thingGetHTTPServerPort()
{	
	if (propertyFileReaded.indexOf("httpserverport;") < 0)
	{	
		return httpserverport = _getIntPropertyValue("httpserverport", DEFAULT_HTTP_SERVER_PORT);
	}
	else
	{	
		return httpserverport;
	}
}
bool thingSetHTTPServerPort(int _httpserverport)
{
	httpserverport = _httpserverport;
	return onInsideChange("httpserverport", String(httpserverport));
}
#endif

#ifdef USE_HTTPS_SERVER
//HTTPSServerAvailable() ---
int thingGetHTTPSServerAvailable()
{
	if (propertyFileReaded.indexOf("httpsserveravailable;") < 0)
	{
		return httpsserveravailable = _getIntPropertyValue("httpsserveravailable", DEFAULT_HTTPS_SERVER_AVAILABLE);
	}
	else
	{
		return httpsserveravailable;
	}
}
bool thingSetHTTPSServerAvailable(int _httpsserveravailable)
{
	httpsserveravailable = _httpsserveravailable;
	return onInsideChange("httpsserveravailable", String(httpsserveravailable));
}

//HTTPSServerUsername
String thingGetHTTPSServerUsername()
{
	if (propertyFileReaded.indexOf("httpsserverlogin;") < 0)
		return httpsserverlogin = _getStringPropertyValue("httpsserverlogin", DEFAULT_HTTPS_SERVER_USERNAME);
	else
		return httpsserverlogin;
}
bool thingSetHTTPSServerUsername(String _httpsserverlogin)
{
	httpsserverlogin = _httpsserverlogin;
	return onInsideChange("httpsserverlogin", String(httpsserverlogin));
}

//HTTPSServerPassword
String thingGetHTTPSServerPassword()
{
	if (propertyFileReaded.indexOf("httpsserverpwd;") < 0)
		return httpsserverpwd = _getStringPropertyValue("httpsserverpwd", DEFAULT_HTTPS_SERVER_PASSWORD);
	else
		return httpsserverpwd;
}
bool thingSetHTTPSServerPassword(String _httpsserverpwd)
{
	httpsserverpwd = _httpsserverpwd;
	return onInsideChange("httpsserverpwd", String(httpsserverpwd));
}

//HTTPServerPort()
int thingGetHTTPSServerPort()
{
	if (propertyFileReaded.indexOf("httpsserverport;") < 0)
	{
		return httpsserverport = _getIntPropertyValue("httpsserverport", DEFAULT_HTTPS_SERVER_PORT);
	}
	else
	{
		return httpsserverport;
	}
}
bool thingSetHTTPSServerPort(int _httpsserverport)
{
	httpsserverport = _httpsserverport;
	return onInsideChange("httpsserverport", String(httpsserverport));
}
#endif

#ifdef USE_HTTP_CLIENT
//HTTPClientPort()
int thingGetHTTPClientPort()
{
	if (propertyFileReaded.indexOf("httpclientport;") < 0)
		return httpclientport = _getIntPropertyValue("httpclientport", DEFAULT_HTTP_CLIENT_PORT);
	else
		return httpclientport;
}
bool thingSetHTTPClientPort(int _httpclientport)
{
	httpclientport = _httpclientport;
	return onInsideChange("httpclientport", String(httpclientport));
}

//HTTPClientURL()
String thingGetHTTPClientURL()
{
	if (propertyFileReaded.indexOf("httpclienturl;") < 0)
		return httpclienturl = _getStringPropertyValue("httpclienturl", DEFAULT_HTTP_CLIENT_URL);
	else
		return httpclienturl;
}
bool thingSetHTTPClientURL(String _httpclienturl)
{
	httpclienturl = _httpclienturl;
	return onInsideChange("httpclienturl", String(httpclienturl));
}
#endif

#ifdef USE_MQTT
//MQTTAvailable()
int thingGetMQTTAvailable()
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
bool thingSetMQTTAvailable(int _mqttavailable)
{
	mqttavailable = _mqttavailable;
	return onInsideChange("mqttavailable", String(mqttavailable));
}

//MQTTPort()
int thingGetMQTTPort()
{
	if (propertyFileReaded.indexOf("mqttport;") < 0)
		return mqttport = _getIntPropertyValue("mqttport", DEFAULT_MQTT_CLIENT_PORT);
	else
		return mqttport;
}
bool thingSetMQTTPort(int _mqttport)
{
	mqttport = _mqttport;
	return onInsideChange("mqttport", String(mqttport));
}

//MQTTURL()
String thingGetMQTTURL()
{
	if (propertyFileReaded.indexOf("mqtturl;") < 0)
		return mqtturl = _getStringPropertyValue("mqtturl", DEFAULT_MQTT_CLIENT_URL);
	else
		return mqtturl;
}
bool thingSetMQTTURL(String _mqtturl)
{
	mqtturl = _mqtturl;
	return onInsideChange("mqtturl", String(mqtturl));
}

//MQTTID()
String thingGetMQTTID()
{
	if (propertyFileReaded.indexOf("mqttid;") < 0)
		return mqttid = _getStringPropertyValue("mqttid", DEFAULT_MQTT_CLIENT_ID);
	else
		return mqttid;
}

bool thingSetMQTTID(String _mqttid)
{
	mqttid = _mqttid;
	return onInsideChange("mqttid", String(mqttid));
}

//MQTTLogin()
String thingGetMQTTLogin()
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
bool thingSetMQTTLogin(String _mqttlogin)
{
	mqttlogin = _mqttlogin;
	return onInsideChange("mqttlogin", String(mqttlogin));
}

//MQTTPassword()
String thingGetMQTTPassword()
{
	if (propertyFileReaded.indexOf("mqttpassword;") < 0)
		return mqttpassword = _getStringPropertyValue("mqttpassword", DEFAULT_MQTT_CLIENT_PASSWORD);
	else
		return mqttpassword;
}
bool thingSetMQTTPassword(String _mqttpassword)
{
	mqttpassword = _mqttpassword;
	return onInsideChange("mqttpassword", String(mqttpassword));
}

//MQTTClientConnected
int thingGetMQTTClientConnected()
{
	//	return (int)(getMQTTClient()->connected());
	return 1;
}

//MQTTClientState
int thingGetMQTTClientState()
{
	//	return getMQTTClient()->state();
	return 1;
}
#endif

#ifdef USE_OTA_SERVICE
//OTAAvailable()
int thingGetOTAAvailable()
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
bool thingSetOTAAvailable(int _otaavailable)
{
	otaavailable = _otaavailable;
	return onInsideChange("otaavailable", String(otaavailable));
}

//OTAPort()
int thingGetOTAPort()
{
	if (propertyFileReaded.indexOf("otaport;") < 0)
		return otaport = _getIntPropertyValue("otaport", DEFAULT_OTA_CLIENT_PORT);
	else
		return otaport;
}
bool thingSetOTAPort(int _otaport)
{
	otaport = _otaport;
	return onInsideChange("otaport", String(otaport));
}

//OTAID()
String thingGetOTAID()
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
bool thingSetOTAID(String _otaid)
{
	otaid = _otaid;
	return onInsideChange("otaid", String(otaid));
}

//OTAPassword()
String thingGetOTAPassword()
{
	if (propertyFileReaded.indexOf("otapassword;") < 0)
		return otapassword = _getStringPropertyValue("otapassword", DEFAULT_OTA_CLIENT_PASSWORD);
	else
		return otapassword;
}
bool thingSetOTAPassword(String _otapassword)
{
	otapassword = _otapassword;
	return onInsideChange("otapassword", String(otapassword));
}
#endif

#ifdef USE_UPDATE_SERVICE
//UpdateAvailable()
int thingGetUpdateAvailable()
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
bool thingSetUpdateAvailable(int _updateavailable)
{
	updateavailable = _updateavailable;
	return onInsideChange("updateavailable", String(updateavailable));
}

//UpdateHost
String thingGetUpdateHost()
{
	if (propertyFileReaded.indexOf("updatehost;") < 0)
		return updatehost = _getStringPropertyValue("updatehost", DEFAULT_UPDATE_HOST);
	else
		return updatehost;
}
bool thingSetUpdateHost(String _updatehost)
{
	updatehost = _updatehost;
	return onInsideChange("updatehost", updatehost);
}
#endif

#endif