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
#include "../Kernel.h"
#include "../Managers\OTAManager.h"
#include "../Managers\DriverManager.h"
#include "../Transports\HTTPServer.h"
#include "../Utils\Utils.h"

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

bool wifiStatus = false;
bool wifiAPResult = false;
bool wifiResult = false;


MQTTClient* getMQTTClient() {
	return _MQTTClient;
}

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
void WiFiEvent(WiFiEvent_t event)
{
	switch (event) {
	case SYSTEM_EVENT_WIFI_READY:
		debugOut(TransportID, "WiFi interface ready");
		break;
	case SYSTEM_EVENT_SCAN_DONE:
		debugOut(TransportID, "Completed scan for access points");
		break;
	case SYSTEM_EVENT_STA_START:
		debugOut(TransportID, "WiFi client started");
		break;
	case SYSTEM_EVENT_STA_STOP:
		debugOut(TransportID, "WiFi clients stopped");
		break;
	case SYSTEM_EVENT_STA_CONNECTED:
		debugOut(TransportID, "Connected to access point");
		break;
	case SYSTEM_EVENT_STA_DISCONNECTED:
		debugOut(TransportID, "Disconnected from WiFi access point");
		break;
	case SYSTEM_EVENT_STA_AUTHMODE_CHANGE:
		debugOut(TransportID, "Authentication mode of access point has changed");
		break;
	case SYSTEM_EVENT_STA_GOT_IP:
		//TODO: setIP
		break;
	case SYSTEM_EVENT_STA_LOST_IP:
		debugOut(TransportID, "Lost IP address and IP address is reset to 0");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_SUCCESS:
		debugOut(TransportID, "WiFi Protected Setup (WPS): succeeded in enrollee mode");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_FAILED:
		debugOut(TransportID, "WiFi Protected Setup (WPS): failed in enrollee mode");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_TIMEOUT:
		debugOut(TransportID, "WiFi Protected Setup (WPS): timeout in enrollee mode");
		break;
	case SYSTEM_EVENT_STA_WPS_ER_PIN:
		debugOut(TransportID, "WiFi Protected Setup (WPS): pin code in enrollee mode");
		break;
	case SYSTEM_EVENT_AP_START:
		debugOut(TransportID, "WiFi access point started");
		break;
	case SYSTEM_EVENT_AP_STOP:
		debugOut(TransportID, "WiFi access point  stopped");
		break;
	case SYSTEM_EVENT_AP_STACONNECTED:
		debugOut(TransportID, "Client connected");
		break;
	case SYSTEM_EVENT_AP_STADISCONNECTED:
		debugOut(TransportID, "Client disconnected");
		break;
	case SYSTEM_EVENT_AP_STAIPASSIGNED:
		debugOut(TransportID, "Assigned IP address to client");
		break;
	case SYSTEM_EVENT_AP_PROBEREQRECVED:
		debugOut(TransportID, "Received probe request");
		break;
	case SYSTEM_EVENT_GOT_IP6:
		debugOut(TransportID, "IPv6 is preferred");
		break;
	case SYSTEM_EVENT_ETH_START:
		debugOut(TransportID, "Ethernet started");
		break;
	case SYSTEM_EVENT_ETH_STOP:
		debugOut(TransportID, "Ethernet stopped");
		break;
	case SYSTEM_EVENT_ETH_CONNECTED:
		debugOut(TransportID, "Ethernet connected");
		break;
	case SYSTEM_EVENT_ETH_DISCONNECTED:
		debugOut(TransportID, "Ethernet disconnected");
		break;
	case SYSTEM_EVENT_ETH_GOT_IP:
		debugOut(TransportID, "Obtained IP address");
		break;
	default: break;
	}
}
#endif

bool transportBegin()
{
#ifdef DetailedDebug 
	debugOut(TransportID, "begin");
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#ifdef DetailedDebug 
	WiFi.onEvent(WiFiEvent);
	//esp_wifi_set_ps(WIFI_PS_NONE);
	//esp_wifi_set_ps(WIFI_PS_MAX_MODEM);
#endif
#endif

	if (_MQTTClient == nullptr)
	{
		_MQTTClient = new MQTTClient(wifiClient);
	}

	if ((nodeGetWiFiAccessPointAvailable() == 1) && (nodeGetWiFiAvailable() == 1))
	{
		nodeSetWiFiMode(WIFI_AP_STA);
		debugOut(TransportID, "WiFi mode Access Point and Station (both)");
	}
	else
		if (nodeGetWiFiAccessPointAvailable() == 1)
		{
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
			if (_WiFiMulti.run() == WL_CONNECTED)
			{
				esp_wifi_disconnect();
				esp_wifi_stop();
				esp_wifi_deinit();
			}
#endif

			nodeSetWiFiMode(WIFI_AP);

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
			wifi_station_disconnect();
#endif

			debugOut(TransportID, "WiFi mode Access Point");
		}
		else
			if (nodeGetWiFiAvailable() == 1)
			{
				nodeSetWiFiMode(WIFI_STA);
				WiFi.softAPdisconnect(true);
				debugOut(TransportID, "WiFi mode Station");
			}
			else
			{
				nodeSetWiFiMode(WIFI_OFF);
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
	
	if (lastTryCheck + TENSECOND > millis())
	{
		return wifiStatus;
	}
	lastTryCheck = millis();
	

	//  if ((storedWiFiAPState != nodeGetWiFiAccessPointAvailable()) || (storedWiFiSTState != nodeGetWiFiAvailable()))
	//  {
	//     transportBegin();
	//  }
	//  storedWiFiAPState = nodeGetWiFiAccessPointAvailable();
	//  storedWiFiSTState = nodeGetWiFiAvailable();

	bool result = false;
	bool wifiAPResult = false;
	bool wifiResult = false;


	if ((nodeGetWiFiAccessPointAvailable() == 1) && (WiFiAccessPointConnected == true))
	{
		wifiAPResult = true;
	}
	else
	{
		if (nodeGetWiFiAccessPointAvailable() == 0)  wifiAPResult = true;
	}

	if ((nodeGetWiFiAvailable() == 1) && (WiFi.status() == WL_CONNECTED))
	{
		wifiResult = true;
	}
	else
	{
		if (nodeGetWiFiAvailable() == 0)  wifiResult = true;
	}

#ifdef DetailedDebug 
	debugOut(TransportID, "WiFi AP=" + String(nodeGetWiFiAccessPointAvailable()) + ":" + String(wifiAPResult) + "|" + "WiFi ST=" + String(nodeGetWiFiAvailable()) + ":" + String(wifiResult));

#endif

	wifiStatus = wifiAPResult & wifiResult;

	return wifiStatus;
}

//--------------------------------------------------------------------------------------------------------------
bool WiFiAccessPointReconnect()
{

	if (nodeGetWiFiAccessPointAvailable() == 1)
	{
		if (WiFiAccessPointConnected) return true;
		String accessPointIP = nodeGetWiFiAccessPointIP(); //this API set Access Point IP from Unit Property OR set this Property as default IP OR return Utils.NaN
		bool softAPResult = false;
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		softAPResult = WiFi.softAP(nodeGetWiFiAccessPointSSID(), nodeGetWiFiAccessPointPassword());
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
		softAPResult = WiFi.softAP(nodeGetWiFiAccessPointSSID().c_str(), nodeGetWiFiAccessPointPassword().c_str());
#endif

		if (softAPResult)
		{

#ifdef DetailedDebug 
			/*
			esp_wifi_set_ps(WIFI_PS_MAX_MODEM);
			wifi_country_t wifi_country;
			int res = esp_wifi_get_country(&wifi_country);
			debugOut("WiFi AP Get Country", String(res));
			debugOut("cc", String(wifi_country.cc));
			debugOut("schan", String(wifi_country.schan));
			debugOut("nchan", String(wifi_country.nchan));
			debugOut("power", String(wifi_country.max_tx_power));
			debugOut("policy", String(wifi_country.policy));


			wifi_country.cc[0] = 'E';
			wifi_country.cc[1] = 'U';

			wifi_country.schan = 1;
			wifi_country.nchan = 5;

			debugOut("cc", String(wifi_country.cc));
			wifi_country.max_tx_power = 78; // WIFI_POWER_19_5dBm ;
			wifi_country.policy = WIFI_COUNTRY_POLICY_MANUAL;
			//wifi_country.policy = WIFI_COUNTRY_POLICY_AUTO;

			res = esp_wifi_get_country(&wifi_country);
			debugOut("WiFi AP Get Country", String(res));
			debugOut("cc", String(wifi_country.cc));
			debugOut("schan", String(wifi_country.schan));
			debugOut("nchan", String(wifi_country.nchan));
			debugOut("power", String(wifi_country.max_tx_power));
			debugOut("policy", String(wifi_country.policy));


			ESP_ERROR_CHECK(esp_wifi_set_country(&wifi_country));
			debugOut("WiFi AP Set Country", String(res));

			int8_t power;
			esp_wifi_get_max_tx_power(&power);
			debugOut("esp_wifi_get_max_tx_power", String(power));

			res = esp_wifi_set_max_tx_power(78);
			debugOut("esp_wifi_set_max_tx_power", String(res));
			esp_wifi_get_max_tx_power(&power);
			debugOut("esp_wifi_get_max_tx_power", String(power));

			debugOut("-------------", "------------");

			debugOut("WiFi AP Power", String(WiFi.getTxPower()));
			//debugOut("WiFi set API Power", String(WiFi.setTxPower(100)));
			//debugOut("WiFi AP Power", String(WiFi.getTxPower()));
*/


#endif

			WiFiAccessPointConnected = true;
			debugOut(TransportID, "Started as WiFi Access Point: " + nodeGetWiFiAccessPointSSID() + " IP: " + accessPointIP);

			return true;
		}
		else
		{
			WiFiAccessPointConnected = false;
			debugOut(TransportID, "WiFi Access Point not started as " + nodeGetWiFiAccessPointSSID());
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
	if (WiFi.status() == WL_CONNECTED) return true;

	if (nodeGetWiFiAvailable() == 1)
	{

		String WiFiSSID = nodeGetWiFiSSID();
		String WiFiPassword = nodeGetWiFiPassword();
		if (WiFiSSID.length() == 0)
		{
			debugOut(TransportID, "WiFi SSID not defined");
			return false;
		}

		if (WiFi.status() != WL_CONNECTED)
		{
			debugOut(TransportID, "try to connect to - " + WiFiSSID + ":" + WiFiPassword + " wait ");
			nodeGetScanWiFiNetworks();
			debugOut(TransportID, nodeGetWiFiNetworksParameters());

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


			if (WiFi.status() == WL_CONNECTED)
			{
				debugOut(TransportID, "WiFi connected as Client success, local IP: " + nodeGetWiFiIP());
				return true;
			}
		}
	}

	return false;
}

/*-------------------------------------------------------------------------------------------------------------------------
  Main Callback
  If MQTT Client recieve published packet with subscrabed topic - this procedure is called ASYNC
  -------------------------------------------------------------------------------------------------------------------------*/
void Callback(char* _topic, byte* _payload, unsigned int length) {

	if (nodeGetMQTTAvailable() == 1)
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
		if (nodeOnMessage(String(_topic), String(payload_buff), MQTTMask).equals(WrongPropertyName))
		{
			//if not UNIT property
			//Put recieved message to all drivers, each driver can process any topic recieved by Unit
			driversCallback(String(_topic), String(payload_buff));
		}
	}
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

	debugOut(TransportID, "begin reconnect, WiFi AP=" + String(nodeGetWiFiAccessPointAvailable()) + " WiFi ST=" + String(nodeGetWiFiAvailable()));

	bool result = false;

	if ((nodeGetWiFiAccessPointAvailable() == 1) && (!WiFiAccessPointConnected))
	{
		wifiAPResult = WiFiAccessPointReconnect();
	}
	else
	{
		if (nodeGetWiFiAccessPointAvailable() == 1) wifiAPResult = true;
	}

	if ((nodeGetWiFiAvailable() == 1) && (_WiFiMulti.run() != WL_CONNECTED))
	{
		wifiResult = WiFiReconnect();
	}
	else
	{
		if (nodeGetWiFiAvailable() == 1) wifiAPResult = true;
	}

	debugOut(TransportID, "reconnect result, WiFi AP=" + String(wifiAPResult) + " WiFi ST=" + String(wifiResult));

	wifiStatus = wifiAPResult | wifiResult;
	result = wifiAPResult | wifiResult;

	if (result)
	{
		if (nodeGetRESTfulAvailable() == 1)
		{
			HTTPServerBegin(nodeGetRESTfulServerPort());
		}

		if (nodeGetOTAAvailable() == 1)
		{
			OTABegin();
		}

		if (nodeGetMQTTAvailable() == 1)
		{
			MQTTReconnect();
			transportSetCallBack(Callback); //Regist Callback function for loopback subscribed messages (from MQTT Publishers)
		}
	}

	return result;
}

bool MQTTReconnect()
{
	if (nodeGetMQTTAvailable() == 1)
	{
		if (!_MQTTClient->connected())
		{

			if (lastTryMQTTReconnect + ONEMINUTE > millis())
			{
				return false;
			}

			debugOut(TransportID, "try connect to Brokker - " + String(nodeGetMQTTURL()) + ":" + String(nodeGetMQTTPort()));
			lastTryMQTTReconnect = millis();


#ifdef DetailedDebug 
			debugOut(TransportID, "Connecting to MQTT broker ...");
#endif
			_MQTTClient->setServer(stringToChar(nodeGetMQTTURL()), nodeGetMQTTPort());    // Configure MQTT connexion
			if (_MQTTClient->connect(nodeGetMQTTID().c_str(), nodeGetMQTTLogin().c_str(), nodeGetMQTTPassword().c_str()))
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

		if (nodeGetRESTfulAvailable() == 1)
		{			
			HTTPServerLoop();
		}

		if (nodeGetOTAAvailable() == 1)
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


