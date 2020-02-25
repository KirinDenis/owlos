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

#include "TransportManager.h"
#include "..\..\UnitProperties.h"
#include "..\Managers\OTAManager.h"
#include "..\Transports\WebServer.h"
#include "..\Utils\Utils.h"

ESP8266WiFiMulti WiFiMulti;
WiFiClient wifiClient;
MQTTClient _MQTTClient(wifiClient);

bool WiFiAccessPointConnected(false);
long lastTryCheck(-ONESECOND);
long lastTryReconnect(-ONEMINUTE);
long lastTryMQTTReconnect(-ONEMINUTE);

int storedWiFiAPState(-1);
int storedWiFiSTState(-1);

MQTTClient* getMQTTClient() {
	return &_MQTTClient;
}

bool transportBegin()
{
#ifdef DetailedDebug 
	debugOut(TransportID, "begin");
#endif

	if ((unitGetWiFiAccessPointAvailable() == 1) && (unitGetWiFiAvailable() == 1))
	{
		unitSetWiFiMode(WIFI_AP_STA);
		debugOut(TransportID, "WiFi mode Access Point and Station (both)");
	}
	else
		if (unitGetWiFiAccessPointAvailable() == 1)
		{
			unitSetWiFiMode(WIFI_AP);
			wifi_station_disconnect();
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
				wifi_station_disconnect();
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

	if ((unitGetWiFiAvailable() == 1) && (WiFiMulti.run() == WL_CONNECTED))
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
		if (WiFi.softAP(unitGetWiFiAccessPointSSID(), unitGetWiFiAccessPointPassword()))
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
	if (WiFiMulti.run() == WL_CONNECTED) return true;

	if (unitGetWiFiAvailable() == 1)
	{

		String WiFiSSID = unitGetWiFiSSID();
		if (WiFiSSID.length() == 0)
		{
			debugOut(TransportID, "WiFi SSID not defined");
			return false;
		}

		if (WiFiMulti.run() != WL_CONNECTED)
		{
			debugOut(TransportID, "try to connect to - " + WiFiSSID + " wait ");
			if (!WiFiMulti.existsAP(WiFiSSID.c_str(), unitGetWiFiPassword().c_str()))
			{
				WiFiMulti.addAP(WiFiSSID.c_str(), unitGetWiFiPassword().c_str());
			}

			int wait = 0;
			while (WiFiMulti.run() != WL_CONNECTED)
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

			if (WiFiMulti.run() == WL_CONNECTED)
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
	bool wifiAPResult = false;
	bool wifiResult = false;

	if ((unitGetWiFiAccessPointAvailable() == 1) && (!WiFiAccessPointConnected))
	{
		wifiAPResult = WiFiAccessPointReconnect();
	}
	else
	{
		if (unitGetWiFiAccessPointAvailable() == 1) wifiAPResult = true;
	}

	if ((unitGetWiFiAvailable() == 1) && (WiFiMulti.run() != WL_CONNECTED))
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
		if (!_MQTTClient.connected())
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
			_MQTTClient.setServer(stringToChar(unitGetMQTTURL()), unitGetMQTTPort());    // Configure MQTT connexion
			if (_MQTTClient.connect(unitGetMQTTID().c_str(), unitGetMQTTLogin().c_str(), unitGetMQTTPassword().c_str()))
			{
				debugOut(TransportID, "OK");
				return true;
			}
			else {
				debugOut(TransportID, "Fail - " + String(_MQTTClient.state()));
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
		_MQTTClient.setCallback(callback);
	}
}

void transportSubscribe(String _topic)
{
	if (MQTTReconnect())
	{
#ifdef DetailedDebug 
		debugOut(TransportID, "Subscribe to - " + _topic);
#endif
		_MQTTClient.subscribe(_topic.c_str());
	}

}

void transportLoop()
{
	if (MQTTReconnect())
	{
		MQTTReconnect();
		_MQTTClient.loop();
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

bool transportPublish(String _topic, String _payload)
{
	if (MQTTReconnect())
	{
		return _MQTTClient.publish(_topic.c_str(), _payload.c_str(), true);
	}
	return true; //if MQTT is not available and RESTful change the property
}

ESP8266WiFiMulti transportGetWifiMulti()
{
	return WiFiMulti;
}

