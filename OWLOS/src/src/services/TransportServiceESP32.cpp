/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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
//ESP32 ONLY --------------------------------------------------------------------------
#ifdef ARDUINO_ESP32_RELEASE_1_0_4

#ifdef USE_ESP_DRIVER

#include "../utils/Utils.h"

#include "../drivers/ESPDriver.h"

#include "../services/OTAService.h"
#include "../services/DriverService.h"
#include "../transports/HTTPSWebServer.h"

#ifdef USE_HTTP_CLIENT
#include "../transports/HTTPWebClient.h"
#endif
#ifdef USE_MQTT
#include "../transports/MQTTClient.h"
#endif

#ifdef USE_UART
#include "../transports/UART.h"
#endif

#include <esp_wifi.h>
#include <WiFiAP.h>
extern "C"
{
#include "freertos/FreeRTOS.h"
#include "freertos/timers.h"
}

WiFiMulti _WiFiMulti;
WiFiClient wifiClient;
TimerHandle_t wifiSTReconnectTimer;

bool WiFiAccessPointConnected(false);
unsigned long lastTryCheck(-ONESECOND);
unsigned long lastTryReconnect(-ONEMINUTE);
unsigned long lastTryMQTTReconnect(-ONEMINUTE);

int storedWiFiAPState(-1);
int storedWiFiSTState(-1);

bool wifiStatus = false;
bool wifiAPResult = false;
bool wifiResult = false;

void WiFiSTReconnect()
{
	if (WiFi.status() == WL_CONNECTED)
	{
		xTimerStop(wifiSTReconnectTimer, 0);
		return;
	}

	if (thingGetWiFiAvailable() == 1)
	{
		String WiFiSSID = thingGetWiFiSSID();
		String WiFiPassword = thingGetWiFiPassword();
		if (WiFiSSID.length() == 0)
		{
#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
			debugOut(TransportID, "WiFi SSID not defined");
#endif
#endif
			return;
		}

		{
#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
			debugOut(TransportID, "try to connect to - " + WiFiSSID + ":" + WiFiPassword + " wait ");
#endif
#endif

			_WiFiMulti.addAP(WiFiSSID.c_str(), WiFiPassword.c_str());

			int wait = 0;
			while (_WiFiMulti.run() != WL_CONNECTED)
			{
				delay(100);
				wait++;
#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
				debugOut(TransportID, "Wait for WiFi [" + String(wait) + "] from [10]");
#endif
#endif
				if (wait > 9)
				{
#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
					debugOut(TransportID, "Wait for WiFi TimeOut...break");
#endif
#endif
					break;
				}
			}
		}
	}
}

void WiFiEvent(WiFiEvent_t event)
{
	switch (event)
	{
	case SYSTEM_EVENT_WIFI_READY:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi interface ready");
#endif
		break;
	case SYSTEM_EVENT_SCAN_DONE:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Completed scan for access points");
#endif
		break;
	case SYSTEM_EVENT_STA_START:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi client started");
#endif
		break;
	case SYSTEM_EVENT_STA_STOP:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi clients stopped");
#endif
		break;
	case SYSTEM_EVENT_STA_CONNECTED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Connected to access point");
#endif
		xTimerStop(wifiSTReconnectTimer, 0);

		break;
	case SYSTEM_EVENT_STA_DISCONNECTED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Disconnected from WiFi access point");
#endif
		wifiResult = false;
#ifdef USE_MQTT
		MQTTDisconnect();
#endif
		xTimerStart(wifiSTReconnectTimer, 0);
		break;
	case SYSTEM_EVENT_STA_AUTHMODE_CHANGE:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Authentication mode of access point has changed");
#endif
		break;
	case SYSTEM_EVENT_STA_GOT_IP:
		//TODO: setIP
		wifiResult = true;
#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi connected as Client success, local IP: " + thingGetWiFiIP());
#endif
#endif
		xTimerStop(wifiSTReconnectTimer, 0);
#ifdef USE_MQTT
		if (thingGetMQTTAvailable() == 1)
		{
			MQTTBegin();
			MQTTConnect();
		}
#endif

#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerBegin();
#endif

#ifdef USE_OTA_SERVICE
		if (thingGetOTAAvailable() == 1)
		{
			OTABegin();
		}
#endif		

		break;
	case SYSTEM_EVENT_STA_LOST_IP:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Lost IP address and IP address is reset to 0");
#endif
		break;
	case SYSTEM_EVENT_STA_WPS_ER_SUCCESS:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi Protected Setup (WPS): succeeded in enrollee mode");
#endif
		break;
	case SYSTEM_EVENT_STA_WPS_ER_FAILED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi Protected Setup (WPS): failed in enrollee mode");
#endif
		break;
	case SYSTEM_EVENT_STA_WPS_ER_TIMEOUT:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi Protected Setup (WPS): timeout in enrollee mode");
#endif
		break;
	case SYSTEM_EVENT_STA_WPS_ER_PIN:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi Protected Setup (WPS): pin code in enrollee mode");
#endif
		break;
	case SYSTEM_EVENT_AP_START:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi access point started");
#endif
		wifiAPResult = true;
#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerBegin();
#endif

		break;
	case SYSTEM_EVENT_AP_STOP:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi access point stopped");
#endif
		break;
	case SYSTEM_EVENT_AP_STACONNECTED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Client connected");
#endif
		break;
	case SYSTEM_EVENT_AP_STADISCONNECTED:
		wifiAPResult = false;
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Client disconnected");
#endif
		break;
	case SYSTEM_EVENT_AP_STAIPASSIGNED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Assigned IP address to client");
#endif
		break;
	case SYSTEM_EVENT_AP_PROBEREQRECVED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Received probe request");
#endif
		break;
	case SYSTEM_EVENT_GOT_IP6:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "IPv6 is preferred");
#endif
		break;
	case SYSTEM_EVENT_ETH_START:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Ethernet started");
#endif
		break;
	case SYSTEM_EVENT_ETH_STOP:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Ethernet stopped");
#endif
		break;
	case SYSTEM_EVENT_ETH_CONNECTED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Ethernet connected");
#endif
		break;
	case SYSTEM_EVENT_ETH_DISCONNECTED:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Ethernet disconnected");
#endif
		break;
	case SYSTEM_EVENT_ETH_GOT_IP:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Obtained IP address");
#endif
		break;
	default:
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "Unknown WiFi event");
#endif
		break;
	}
}

bool transportBegin()
{
#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
	debugOut(TransportID, "begin");
#endif
#endif

	WiFi.onEvent(WiFiEvent);
#ifdef DETAILED_DEBUG
	//esp_wifi_set_ps(WIFI_PS_NONE);
	//esp_wifi_set_ps(WIFI_PS_MAX_MODEM);
#endif

#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
	debugOut(TransportID, "Prepare to select WiFi mode...");
#endif
#endif
	//WiFi Access Point and Station mode ---
	if ((thingGetWiFiAccessPointAvailable() == 1) && (thingGetWiFiAvailable() == 1))
	{
		esp_wifi_connect();
		thingSetWiFiMode(WIFI_AP_STA);
		//enable watch WiFi station timer
		wifiSTReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(10000), pdTRUE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(WiFiSTReconnect));
		WiFiSTReconnect();

		WiFi.softAP(thingGetWiFiAccessPointSSID().c_str(), thingGetWiFiAccessPointPassword().c_str());
		thingSetWiFiAccessPointIP(WiFi.softAPIP().toString());

#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi mode Access Point and Station (both)");
#endif
#endif
	}
	else
		//WiFi Access Point mode ---
		if (thingGetWiFiAccessPointAvailable() == 1)
	{
		//STOP all
		thingSetWiFiMode(WIFI_OFF);
		esp_wifi_disconnect();

		//esp_wifi_deinit();
		//START as access point
		esp_wifi_connect();
		thingSetWiFiMode(WIFI_AP);
		WiFi.softAP(thingGetWiFiAccessPointSSID().c_str(), thingGetWiFiAccessPointPassword().c_str());
		thingSetWiFiAccessPointIP(WiFi.softAPIP().toString());

#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi mode Access Point");
#endif
#endif
	}
	else
		//WiFi Station mode ---
		if (thingGetWiFiAvailable() == 1)
	{
#ifdef DETAILED_DEBUG
#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
		debugOut(TransportID, "WiFi mode Station");
#endif
#endif
		esp_wifi_connect();
		WiFi.softAPdisconnect(false);
		thingSetWiFiMode(WIFI_STA);
		wifiSTReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(10000), pdTRUE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(WiFiSTReconnect));
		WiFiSTReconnect();
	}
	//No WiFi mode ---
	else
	{
		thingSetWiFiMode(WIFI_OFF);
		WiFi.softAPdisconnect(true);
		esp_wifi_disconnect();
		//	esp_wifi_stop(); //make crash if wifi not running before
		//esp_wifi_deinit();
		return false;
	}

	return true;
}

void transportLoop()
{

	if ((wifiAPResult) || (wifiResult))
	{

#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
			HTTPSWebServerLoop();		
#endif

#ifdef USE_OTA_SERVICE
		if (thingGetOTAAvailable() == 1)
		{
			OTALoop();
		}
#endif
	}

#ifdef USE_UART
	UARTRecv();
#endif

}

void transportSubscribe(String _topic)
{
#ifdef USE_MQTT
	if (thingGetMQTTAvailable() == 1)
	{
		MQTTSubscribe(_topic);
	}
#endif
}

bool transportPublish(String _topic, String _payload)
{
#ifdef USE_MQTT

	if ((thingGetWiFiAvailable() == 1) && (thingGetMQTTAvailable() == 1) && (WiFi.isConnected()))
	{
		MQTTPublish(_topic, _payload);
	}

#endif

#ifdef USE_UART
	UARTSend(_topic, _payload);
#endif

#ifdef USE_HTTP_CLIENT
 	if ((thingGetWiFiAvailable() == 1) && (WiFi.isConnected()))
 	{
  	   HTTPWebClientPublish(_topic, _payload);
 	}
#endif  

	return true;
}

WiFiMulti transportGetWifiMulti()
{
	return _WiFiMulti;
}

#endif
#endif
