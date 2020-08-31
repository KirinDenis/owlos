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
//ESP32 ONLY --------------------------------------------------------------------------
#ifdef ARDUINO_ESP32_RELEASE_1_0_4

#ifdef USE_ESP_DRIVER

#include "../drivers/ESPDriver.h"
#include "../services/OTAService.h"
#include "../services/DriverService.h"
#include "../Transports/HTTPSWebServer.h"

#ifdef USE_MQTT
#include "../transports/MQTTClient.h"
#endif

#include <esp_wifi.h>
#include <WiFiAP.h>
extern "C" {
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

	if (nodeGetWiFiAvailable() == 1)
	{
		String WiFiSSID = nodeGetWiFiSSID();
		String WiFiPassword = nodeGetWiFiPassword();
		if (WiFiSSID.length() == 0)
		{
#ifdef DetailedDebug
			debugOut(TransportID, "WiFi SSID not defined");
#endif
			return;
		}

		
		{
#ifdef DetailedDebug
			debugOut(TransportID, "try to connect to - " + WiFiSSID + ":" + WiFiPassword + " wait ");
#endif

			_WiFiMulti.addAP(WiFiSSID.c_str(), WiFiPassword.c_str());

			int wait = 0;
			while (_WiFiMulti.run() != WL_CONNECTED)
			{
				delay(100);
				wait++;
#ifdef DetailedDebug
				debugOut(TransportID, "Wait for WiFi [" + String(wait) + "] from [10]");
#endif
				if (wait > 9)
				{
#ifdef DetailedDebug
					debugOut(TransportID, "Wait for WiFi TimeOut...break");
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
		xTimerStop(wifiSTReconnectTimer, 0);				

		break;
	case SYSTEM_EVENT_STA_DISCONNECTED:
		debugOut(TransportID, "Disconnected from WiFi access point");		
		wifiResult = false;
#ifdef USE_MQTT		
		MQTTDisconnect();
#endif		
		xTimerStart(wifiSTReconnectTimer, 0);		
		break;
	case SYSTEM_EVENT_STA_AUTHMODE_CHANGE:
		debugOut(TransportID, "Authentication mode of access point has changed");		
		break;
	case SYSTEM_EVENT_STA_GOT_IP:
		//TODO: setIP
		 wifiResult = true;
#ifdef DetailedDebug
				debugOut(TransportID, "WiFi connected as Client success, local IP: " + nodeGetWiFiIP());
#endif
		xTimerStop(wifiSTReconnectTimer, 0);				
#ifdef USE_MQTT				
		MQTTConnect();
#endif		

#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerBegin();
#endif				
		
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
		wifiAPResult = true;
		break;
	case SYSTEM_EVENT_AP_STOP:
		debugOut(TransportID, "WiFi access point stopped");		
		break;
	case SYSTEM_EVENT_AP_STACONNECTED:
		debugOut(TransportID, "Client connected");		
		break;
	case SYSTEM_EVENT_AP_STADISCONNECTED:
	    wifiAPResult = false;
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
	default:
	    debugOut(TransportID, "Unknown WiFi event");
		break;
	}
}


bool transportBegin()
{
#ifdef DetailedDebug
	debugOut(TransportID, "begin");
#endif

    WiFi.onEvent(WiFiEvent);	
#ifdef DetailedDebug	
	//esp_wifi_set_ps(WIFI_PS_NONE);
	//esp_wifi_set_ps(WIFI_PS_MAX_MODEM);
#endif

#ifdef USE_MQTT
     MQTTBegin();	
#endif

#ifdef DetailedDebug
		debugOut(TransportID, "no WiFi mode select, WiFi not accessable");
#endif
//WiFi Access Point and Station mode ---
	if ((nodeGetWiFiAccessPointAvailable() == 1) && (nodeGetWiFiAvailable() == 1))
	{
		nodeSetWiFiMode(WIFI_AP_STA);
#ifdef DetailedDebug
		debugOut(TransportID, "WiFi mode Access Point and Station (both)");
#endif
	}
	else 
//WiFi Access Point mode ---	
	if (nodeGetWiFiAccessPointAvailable() == 1)
	{
		if (_WiFiMulti.run() == WL_CONNECTED)
		{
			esp_wifi_disconnect();
			esp_wifi_stop();
			esp_wifi_deinit();
		}
		nodeSetWiFiMode(WIFI_AP);
#ifdef DetailedDebug
		debugOut(TransportID, "WiFi mode Access Point");
#endif
	}
	else 
//WiFi Station mode ---	
	if (nodeGetWiFiAvailable() == 1)
	{
#ifdef DetailedDebug
		debugOut(TransportID, "WiFi mode Station");
#endif


    

		WiFi.softAPdisconnect(true);
		nodeSetWiFiMode(WIFI_STA);		
		wifiSTReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(10000), pdTRUE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(WiFiSTReconnect));
		WiFiSTReconnect();
	}
//No WiFi mode ---	
	else	
	{		
		nodeSetWiFiMode(WIFI_OFF);
		WiFi.softAPdisconnect(true);
		esp_wifi_disconnect();
		esp_wifi_stop();
		esp_wifi_deinit();
		return false;
	}

	return true;
}

void transportLoop()
{

	if ((wifiAPResult) || (wifiResult))
	{

#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)			
		if (nodeGetRESTfulAvailable() == 1)
		{
			HTTPSWebServerLoop();
		}
#endif					

#ifdef USE_OTA_SERVICE						
		if (nodeGetOTAAvailable() == 1)
		{
			OTALoop();
		}
#endif		

 if (Serial.available())
 {

	 String data = Serial.readStringUntil('\n');
	 String topic = data.substring(0, data.indexOf(" "));
	 String payload = data.substring(data.indexOf(" ")+ 1);
    if (nodeOnMessage(String(topic), String(payload), MQTTMask).equals(WrongPropertyName))
    {
        //if not UNIT property
        //Put recieved message to all drivers, each driver can process any topic recieved by Unit
        #ifdef USE_DRIVERS			
        driversCallback(String(topic), String(payload));
        #endif			

    }
 }
	}

	
}


void transportSubscribe(String _topic)
{
	#ifdef USE_MQTT
	 MQTTSubscribe(_topic);
	#endif
}


bool transportPublish(String _topic, String _payload)
{
	#ifdef USE_MQTT
	 MQTTPublish(_topic, _payload);
	#endif
	 Serial.println("[DATA] " + _topic + " " + _payload);
	return true; //if MQTT is not available and RESTful change the property
}


WiFiMulti transportGetWifiMulti()
{
	return _WiFiMulti;
}


#endif
#endif
