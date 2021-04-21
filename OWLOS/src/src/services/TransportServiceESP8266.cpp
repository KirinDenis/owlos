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

#include "TransportService.h"
//ESP8266 ONLY --------------------------------------------------------------------------
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0

#ifdef USE_ESP_DRIVER

#include "../drivers/ESPDriver.h"

#include "../services/OTAService.h"
#include "../services/DriverService.h"
#include "../Transports/HTTPSWebServer.h"

ESP8266WiFiMulti _WiFiMulti;
WiFiClient wifiClient;

bool WiFiAccessPointConnected(false);
unsigned long lastTryCheck(-ONESECOND);
unsigned long lastTryReconnect(-ONEMINUTE);
unsigned long lastTryMQTTReconnect(-ONEMINUTE);

int storedWiFiAPState(-1);
int storedWiFiSTState(-1);

bool wifiStatus = false;
bool wifiAPResult = false;
bool wifiResult = false;

bool transportBegin()
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(TransportID, "begin");
#endif
#endif

	if ((nodeGetWiFiAccessPointAvailable() == 1) && (nodeGetWiFiAvailable() == 1))
	{
		nodeSetWiFiMode(WIFI_AP_STA);
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(TransportID, "WiFi mode Access Point and Station (both)");
#endif
#endif
	}
	else if (nodeGetWiFiAccessPointAvailable() == 1)
	{
		nodeSetWiFiMode(WIFI_AP);
		wifi_station_disconnect();
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(TransportID, "WiFi mode Access Point");
#endif
#endif
	}
	else if (nodeGetWiFiAvailable() == 1)
	{
		nodeSetWiFiMode(WIFI_STA);
		WiFi.softAPdisconnect(true);
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(TransportID, "WiFi mode Station");
#endif
#endif
	}
	else
	{
		nodeSetWiFiMode(WIFI_OFF);
		WiFi.softAPdisconnect(true);
		wifi_station_disconnect();
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(TransportID, "no WiFi mode select, WiFi not accessable");
#endif
#endif
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

	bool result = false;
	bool wifiAPResult = false;
	bool wifiResult = false;

	if ((nodeGetWiFiAccessPointAvailable() == 1) && (WiFiAccessPointConnected == true))
	{
		wifiAPResult = true;
	}
	else
	{
		if (nodeGetWiFiAccessPointAvailable() == 0)
			wifiAPResult = true;
	}

	if ((nodeGetWiFiAvailable() == 1) && (WiFi.status() == WL_CONNECTED))
	{
		wifiResult = true;
	}
	else
	{
		if (nodeGetWiFiAvailable() == 0)
			wifiResult = true;
	}

#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(TransportID, "WiFi AP=" + String(nodeGetWiFiAccessPointAvailable()) + ":" + String(wifiAPResult) + "|" + "WiFi ST=" + String(nodeGetWiFiAvailable()) + ":" + String(wifiResult) + " (" + nodeGetWiFiIP() + ")");
#endif
#endif
	wifiStatus = wifiAPResult & wifiResult;
	return wifiStatus;
}

//--------------------------------------------------------------------------------------------------------------
bool WiFiAccessPointReconnect()
{

	if (nodeGetWiFiAccessPointAvailable() == 1)
	{
		if (WiFiAccessPointConnected)
			return true;
		String accessPointIP = nodeGetWiFiAccessPointIP(); //this API set Access Point IP from Unit Property OR set this Property as default IP OR return Utils.NaN
		bool softAPResult = false;
		softAPResult = WiFi.softAP(nodeGetWiFiAccessPointSSID(), nodeGetWiFiAccessPointPassword());
		if (softAPResult)
		{
			WiFiAccessPointConnected = true;
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(TransportID, "Started as WiFi Access Point: " + nodeGetWiFiAccessPointSSID() + " IP: " + accessPointIP);
#endif
#endif
			return true;
		}
		else
		{
			WiFiAccessPointConnected = false;
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(TransportID, "WiFi Access Point not started as " + nodeGetWiFiAccessPointSSID());
#endif
#endif
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
	if (WiFi.status() == WL_CONNECTED)
		return true;

	if (nodeGetWiFiAvailable() == 1)
	{
		String WiFiSSID = nodeGetWiFiSSID();
		String WiFiPassword = nodeGetWiFiPassword();
		if (WiFiSSID.length() == 0)
		{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(TransportID, "WiFi SSID not defined");
#endif
#endif
			return false;
		}

		if (WiFi.status() != WL_CONNECTED)
		{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(TransportID, "try to connect to - " + WiFiSSID + ":" + WiFiPassword + " wait ");
#endif
#endif
			nodeGetScanWiFiNetworks();
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(TransportID, nodeGetWiFiNetworksParameters());
#endif
#endif
			if (!_WiFiMulti.existsAP(WiFiSSID.c_str(), WiFiPassword.c_str()))
			{
				_WiFiMulti.addAP(WiFiSSID.c_str(), WiFiPassword.c_str());
			}
			_WiFiMulti.addAP(WiFiSSID.c_str(), WiFiPassword.c_str());
			int wait = 0;
			while (_WiFiMulti.run() != WL_CONNECTED)
			{
				delay(500);
				wait++;
#ifdef DETAILED_DEBUG
#ifdef DEBUG
				debugOut(TransportID, "Wait for WiFi [" + String(wait) + "] from [10]");
#endif
#endif
				if (wait > 9)
				{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
					debugOut(TransportID, "Wait for WiFi TimeOut...break");
#endif
#endif
					break;
				}
			}

			if (WiFi.status() == WL_CONNECTED)
			{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
				debugOut(TransportID, "WiFi connected as Client success, local IP: " + nodeGetWiFiIP());
#endif
#endif
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
void Callback(char *_topic, byte *_payload, unsigned int length)
{
#ifdef USE_MQTT	
	if (nodeGetMQTTAvailable() == 1)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(TransportID, "onMessage topic - " + String(_topic));
#endif
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
		if (nodeOnMessage(String(_topic), String(payload_buff), MQTT_TRANSPORT_MASK).equals(WRONG_PROPERTY_NAME))
		{
			//if not UNIT property
			//Put recieved message to all drivers, each driver can process any topic recieved by Unit
			driversCallback(String(_topic), String(payload_buff));
		}
	}
	#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(TransportID, "begin reconnect, WiFi AP=" + String(nodeGetWiFiAccessPointAvailable()) + " WiFi ST=" + String(nodeGetWiFiAvailable()));
#endif
#endif

	bool result = false;

	if ((nodeGetWiFiAccessPointAvailable() == 1) && (!WiFiAccessPointConnected))
	{
		wifiAPResult = WiFiAccessPointReconnect();
	}
	else
	{
		if (nodeGetWiFiAccessPointAvailable() == 1)
			wifiAPResult = true;
	}

	if ((nodeGetWiFiAvailable() == 1) && (_WiFiMulti.run() != WL_CONNECTED))
	{
		wifiResult = WiFiReconnect();
	}
	else
	{
		if (nodeGetWiFiAvailable() == 1)
			wifiAPResult = true;
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(TransportID, "reconnect result, WiFi AP=" + String(wifiAPResult) + " WiFi ST=" + String(wifiResult));
#endif
#endif

	wifiStatus = wifiAPResult | wifiResult;
	result = wifiAPResult | wifiResult;

	if (result)
	{
		if (nodeGetHTTPServerAvailable() == 1)
		{
			//nodeGetHTTPServerServerPort()
			HTTPSWebServerBegin();
		}

#ifdef USE_OTA
		if (nodeGetOTAAvailable() == 1)
		{
			OTABegin();
		}
#endif

#ifdef USE_MQTT
		if (nodeGetMQTTAvailable() == 1)
		{

		}
#endif		
	}

	return result;
}

void transportSubscribe(String _topic)
{
}

void transportLoop()
{
	if ((wifiAPResult) || (wifiResult))
	{

		if (nodeGetHTTPServerAvailable() == 1)
		{
			HTTPSWebServerLoop();
		}

#ifdef USE_OTA
		if (nodeGetOTAAvailable() == 1)
		{
			OTALoop();
		}
#endif		
	}
}

bool transportPublish(String _topic, String _payload)
{
	return true; //if MQTT is not available and HTTPServer change the property
}

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
ESP8266WiFiMulti transportGetWifiMulti()
{
	return _WiFiMulti;
}
#endif

#endif
#endif
