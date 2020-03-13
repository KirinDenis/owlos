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
#include <core_version.h>
#include "TransportManager.h"
#include "..\..\UnitProperties.h"
#include "..\Managers\OTAManager.h"
#include "..\Transports\WebServer.h"
#include "..\Utils\Utils.h"

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	ESP8266WiFiMulti _WiFiMulti;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
    #include <esp_wifi.h>
	#include <WiFiAP.h>
	WiFiMulti _WiFiMulti;
#endif

WiFiClient wifiClient;
MQTTClient * _MQTTClient;

bool WiFiAccessPointConnected(false);
long lastTryCheck(-ONESECOND);
long lastTryReconnect(-ONEMINUTE);
long lastTryMQTTReconnect(-ONEMINUTE);

int storedWiFiAPState(-1);
int storedWiFiSTState(-1);

bool wifiAPResult = false;
bool wifiResult = false;


MQTTClient* getMQTTClient() {
	return _MQTTClient;
}


void WiFiEvent(WiFiEvent_t event)
{
	switch (event) {
	case SYSTEM_EVENT_WIFI_READY:
		debugOut(TransportID,"WiFi interface ready");
		break;
	case SYSTEM_EVENT_SCAN_DONE:
		debugOut(TransportID,"Completed scan for access points");
		break;
	case SYSTEM_EVENT_STA_START:
		debugOut(TransportID,"WiFi client started");
		break;
	case SYSTEM_EVENT_STA_STOP:
		debugOut(TransportID,"WiFi clients stopped");
		break;
	case SYSTEM_EVENT_STA_CONNECTED:
		debugOut(TransportID,"Connected to access point");
		break;
	case SYSTEM_EVENT_STA_DISCONNECTED:
		debugOut(TransportID,"Disconnected from WiFi access point");
		break;
	case SYSTEM_EVENT_STA_AUTHMODE_CHANGE:
		debugOut(TransportID,"Authentication mode of access point has changed");
		break;
	case SYSTEM_EVENT_STA_GOT_IP:
		//TODO: setIP
		break;
	case SYSTEM_EVENT_STA_LOST_IP:
		debugOut(TransportID,"Lost IP address and IP address is reset to 0");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_SUCCESS:
		debugOut(TransportID,"WiFi Protected Setup (WPS): succeeded in enrollee mode");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_FAILED:
		debugOut(TransportID,"WiFi Protected Setup (WPS): failed in enrollee mode");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_TIMEOUT:
		debugOut(TransportID,"WiFi Protected Setup (WPS): timeout in enrollee mode");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_PIN:
		debugOut(TransportID,"WiFi Protected Setup (WPS): pin code in enrollee mode");
		break;
	case SYSTEM_EVENT_AP_START:
		debugOut(TransportID,"WiFi access point started");
		break;
	case SYSTEM_EVENT_AP_STOP:
		debugOut(TransportID,"WiFi access point  stopped");
		break;
	case SYSTEM_EVENT_AP_STACONNECTED:
		debugOut(TransportID,"Client connected");
		break;
	case SYSTEM_EVENT_AP_STADISCONNECTED:
		debugOut(TransportID,"Client disconnected");
		break;
	case SYSTEM_EVENT_AP_STAIPASSIGNED:
		debugOut(TransportID,"Assigned IP address to client");
		break;
	case SYSTEM_EVENT_AP_PROBEREQRECVED:
		debugOut(TransportID,"Received probe request");
		break;
	case SYSTEM_EVENT_GOT_IP6:
		debugOut(TransportID,"IPv6 is preferred");
		break;
	case SYSTEM_EVENT_ETH_START:
		debugOut(TransportID,"Ethernet started");
		break;
	case SYSTEM_EVENT_ETH_STOP:
		debugOut(TransportID,"Ethernet stopped");
		break;
	case SYSTEM_EVENT_ETH_CONNECTED:
		debugOut(TransportID,"Ethernet connected");
		break;
	case SYSTEM_EVENT_ETH_DISCONNECTED:
		debugOut(TransportID,"Ethernet disconnected");
		break;
	case SYSTEM_EVENT_ETH_GOT_IP:
		debugOut(TransportID,"Obtained IP address");
		break;
	default: break;
	}
}


bool transportBegin()
{
#ifdef DetailedDebug 
	debugOut(TransportID, "begin");
	WiFi.onEvent(WiFiEvent);
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	//disable ESP32 Power Save
	debugOut(TransportID, "ESP32 Power Mode UP");
	esp_wifi_set_ps(WIFI_PS_NONE);
	WiFi.setSleep(false);
#endif

	if (_MQTTClient == nullptr)
	{
		_MQTTClient = new MQTTClient(wifiClient);
	}

	if ((unitGetWiFiAccessPointAvailable() == 1) && (unitGetWiFiAvailable() == 1))
	{
		unitSetWiFiMode(WIFI_AP_STA);
		debugOut(TransportID, "WiFi mode Access Point and Station (both)");
	}
	else
		if (unitGetWiFiAccessPointAvailable() == 1)
		{
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
			if (_WiFiMulti.run() == WL_CONNECTED)
			{
				esp_wifi_disconnect();
				esp_wifi_stop();
				esp_wifi_deinit();
		}
#endif

			unitSetWiFiMode(WIFI_AP);

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
			wifi_station_disconnect();
#endif

			debugOut(TransportID, "WiFi mode Access Point");
		}
		else
			if (unitGetWiFiAvailable() == 1)
			{
				unitSetWiFiMode(WIFI_STA);
				WiFi.softAPdisconnect(true);
				debugOut(TransportID, "WiFi mode Station");
			}
			else
			{
				unitSetWiFiMode(WIFI_OFF);
				WiFi.softAPdisconnect(true);
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
				wifi_station_disconnect();
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
				esp_wifi_disconnect();
				esp_wifi_stop();
				esp_wifi_deinit();
#endif

				debugOut(TransportID, "no WiFi mode select, WiFi not accessable");
				return false;
			}
	return true;
}

bool transportAvailable()
{

	if (lastTryCheck + ONESECOND > millis())
	{
		return true;
	}
	lastTryCheck = millis();

	//  if ((storedWiFiAPState != unitGetWiFiAccessPointAvailable()) || (storedWiFiSTState != unitGetWiFiAvailable()))
	//  {
	//     transportBegin();
	//  }
	//  storedWiFiAPState = unitGetWiFiAccessPointAvailable();
	//  storedWiFiSTState = unitGetWiFiAvailable();

	bool result = false;
	bool wifiAPResult = false;
	bool wifiResult = false;


	if ((unitGetWiFiAccessPointAvailable() == 1) && (WiFiAccessPointConnected == true))
	{
		wifiAPResult = true;
	}
	else
	{
		if (unitGetWiFiAccessPointAvailable() == 0)  wifiAPResult = true;
	}

	if ((unitGetWiFiAvailable() == 1) && (_WiFiMulti.run() == WL_CONNECTED))
	{
		wifiResult = true;
	}
	else
	{
		if (unitGetWiFiAvailable() == 0)  wifiResult = true;
	}

#ifdef DetailedDebug 
	debugOut(TransportID, "WiFi AP=" + String(unitGetWiFiAccessPointAvailable()) + ":" + String(wifiAPResult) + "|" + "WiFi ST=" + String(unitGetWiFiAvailable()) + ":" + String(wifiResult));
#endif

	return wifiAPResult & wifiResult;
}

//--------------------------------------------------------------------------------------------------------------
bool WiFiAccessPointReconnect()
{

	if (unitGetWiFiAccessPointAvailable() == 1)
	{
		if (WiFiAccessPointConnected) return true;
		String accessPointIP = unitGetWiFiAccessPointIP(); //this API set Access Point IP from Unit Property OR set this Property as default IP OR return Utils.NaN
		bool softAPResult = false;
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		softAPResult = WiFi.softAP(unitGetWiFiAccessPointSSID(), unitGetWiFiAccessPointPassword());
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
		softAPResult = WiFi.softAP(unitGetWiFiAccessPointSSID().c_str(), unitGetWiFiAccessPointPassword().c_str());
#endif

		if (softAPResult)
		{
			WiFiAccessPointConnected = true;
			debugOut(TransportID, "Started as WiFi Access Point: " + unitGetWiFiAccessPointSSID() + " IP: " + accessPointIP);

			return true;
		}
		else
		{
			WiFiAccessPointConnected = false;
			debugOut(TransportID, "WiFi Access Point not started as " + unitGetWiFiAccessPointSSID());
		}
	}
	else
	{
		WiFi.softAPdisconnect(true);
	}


	return false;
}
//--------------------------------------------------------------------------------------------------------------
bool WiFiReconnect()
{
	if (_WiFiMulti.run() == WL_CONNECTED) return true;

	if (unitGetWiFiAvailable() == 1)
	{

		String WiFiSSID = unitGetWiFiSSID();
		String WiFiPassword = unitGetWiFiPassword();
		if (WiFiSSID.length() == 0)
		{
			debugOut(TransportID, "WiFi SSID not defined");
			return false;
		}

		if (_WiFiMulti.run() != WL_CONNECTED)
		{
			debugOut(TransportID, "try to connect to - " + WiFiSSID + ":" + WiFiPassword  + " wait ");
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
			if (!_WiFiMulti.existsAP(WiFiSSID.c_str(), WiFiPassword.c_str()))
			{
				_WiFiMulti.addAP(WiFiSSID.c_str(), WiFiPassword.c_str());
			}


#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4			
			_WiFiMulti.addAP(WiFiSSID.c_str(), WiFiPassword.c_str());
#endif
			
			int wait = 0;
			while (_WiFiMulti.run() != WL_CONNECTED)
			{
				delay(500);
				wait++;
				debugOut(TransportID, "Wait for WiFi [" + String(wait) + "] from [10]");
				if (wait > 9)
				{
					debugOut(TransportID, "Wait for WiFi TimeOut...break");
					break;
				}
			}


			if (_WiFiMulti.run() == WL_CONNECTED)
			{
				debugOut(TransportID, "WiFi connected as Client success, local IP: " + unitGetWiFiIP());
				return true;
			}
		}
	}

	return false;
}
//-----------------------------------------------------------------------------------------------------------------------------------------
bool transportReconnect()
{

	//reconnect once at 
	if (lastTryReconnect + ONEMINUTE > millis())
	{
		return false;
	}

	lastTryReconnect = millis();

	debugOut(TransportID, "begin reconnect, WiFi AP=" + String(unitGetWiFiAccessPointAvailable()) + " WiFi ST=" + String(unitGetWiFiAvailable()));

	bool result = false;

	if ((unitGetWiFiAccessPointAvailable() == 1) && (!WiFiAccessPointConnected))
	{
		wifiAPResult = WiFiAccessPointReconnect();
	}
	else
	{
		if (unitGetWiFiAccessPointAvailable() == 1) wifiAPResult = true;
	}

	if ((unitGetWiFiAvailable() == 1) && (_WiFiMulti.run() != WL_CONNECTED))
	{
		wifiResult = WiFiReconnect();
	}
	else
	{
		if (unitGetWiFiAvailable() == 1) wifiAPResult = true;
	}

	debugOut(TransportID, "reconnect result, WiFi AP=" + String(wifiAPResult) + " WiFi ST=" + String(wifiResult));

	result = wifiAPResult | wifiResult;

	if (result)
	{
		if (unitGetRESTfulAvailable() == 1)
		{
			//TODO: check webserver ON   
			webServerBegin();
		}

		if (unitGetOTAAvailable() == 1)
		{
			OTABegin();
		}

		if (unitGetMQTTAvailable() == 1)
		{
			MQTTReconnect();
		}
	}

	return result;
}

bool MQTTReconnect()
{
	if (unitGetMQTTAvailable() == 1)
	{
		if (!_MQTTClient->connected())
		{

			if (lastTryMQTTReconnect + ONEMINUTE > millis())
			{
				return false;
			}

			debugOut(TransportID, "try connect to Brokker - " + String(unitGetMQTTURL()) + ":" + String(unitGetMQTTPort()));
			lastTryMQTTReconnect = millis();


#ifdef DetailedDebug 
			debugOut(TransportID, "Connecting to MQTT broker ...");
#endif
			_MQTTClient->setServer(stringToChar(unitGetMQTTURL()), unitGetMQTTPort());    // Configure MQTT connexion
			if (_MQTTClient->connect(unitGetMQTTID().c_str(), unitGetMQTTLogin().c_str(), unitGetMQTTPassword().c_str()))
			{
				debugOut(TransportID, "OK");
				return true;
			}
			else {
				debugOut(TransportID, "Fail - " + String(_MQTTClient->state()));
				return false;
			}
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}

void transportSetCallBack(MQTT_CALLBACK_SIGNATURE)
{
	if (MQTTReconnect())
	{
		_MQTTClient->setCallback(callback);
	}
}

void transportSubscribe(String _topic)
{
	if (MQTTReconnect())
	{
#ifdef DetailedDebug 
		debugOut(TransportID, "Subscribe to - " + _topic);
#endif
		_MQTTClient->subscribe(_topic.c_str());
	}

}

void transportLoop()
{
	if ((wifiAPResult) || (wifiResult)) 
	{
		
	if (MQTTReconnect())
	{
		MQTTReconnect();
		_MQTTClient->loop();
	}

	if (unitGetRESTfulAvailable() == 1)
	{
		webServerLoop();
	}

	if (unitGetOTAAvailable() == 1)
	{
		OTALoop();
	}
	}
}

bool transportPublish(String _topic, String _payload)
{
	if (MQTTReconnect())
	{
		return _MQTTClient->publish(_topic.c_str(), _payload.c_str(), true);
	}
	return true; //if MQTT is not available and RESTful change the property
}

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
ESP8266WiFiMulti transportGetWifiMulti()
{
	return _WiFiMulti;
}
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
WiFiMulti transportGetWifiMulti()
{
	return _WiFiMulti;
}
#endif


