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

#include "Utils.h"
#include "../services/FileService.h"
#include "../drivers/WifiDriver.h"
#include "../drivers/NetworkDriver.h"

#ifdef LOGO_SCREEN_UX
#include "../ux/Screens/LogScreen.h"
#endif


bool filesAtRecurse = false;

char *stringToChar(String src)
{
	char *data = (char *)malloc(src.length() + 1);
	src.toCharArray(data, src.length() + 1);
	return data;
}

#if defined (DEBUG) || defined (LOGO_SCREEN_UX)
void debugOut(const String &tag, const String &text)
{
#ifdef LOGO_SCREEN_UX
  logScreenAddText(tag, text);
#endif

#ifdef DEBUG
#ifdef USE_ESP_DRIVER
#ifdef SERIAL_COLORIZED_OUTPUT
	String _text = text + " \033\033[1;32m [" + String(ESP.getFreeHeap()) + "]";
#else
	String _text = text + " [" + String(ESP.getFreeHeap()) + "]";
#endif
#else
	String _text = text;
#endif

#ifdef SERIAL_COLORIZED_OUTPUT
	Serial.print("\033\033[1;35m DEBUG: \033\033[1;36m " + tag + " \033\033[1;34m " + _text + "\n");
	Serial.print("\033\033[0m");
#else
	Serial.print("DEBUG: " + tag + " - " + _text + "\n");
#endif

	if (WRITE_DEBUG_LOG_FILES)
	{
		if (filesAtRecurse)
			return;
		filesAtRecurse = true;
		int log1Size = filesGetSize(DEBUG_LOG_FILE1_NAME);
		int log2Size = filesGetSize(DEBUG_LOG_FILE2_NAME);

		if (log1Size < DEBUG_LOG_FILES_SIZE)
		{
			writeDebugLogFile(DEBUG_LOG_FILE1_NAME, log1Size, tag, _text);
			log1Size = filesGetSize(DEBUG_LOG_FILE1_NAME);
			if (log1Size >= DEBUG_LOG_FILES_SIZE)
			{
				filesDelete(DEBUG_LOG_FILE2_NAME);
			}
		}
		else
		{
			if (log2Size < DEBUG_LOG_FILES_SIZE)
			{
				writeDebugLogFile(DEBUG_LOG_FILE2_NAME, log2Size, tag, _text);
			}
			else
			{
				filesDelete(DEBUG_LOG_FILE1_NAME);
				writeDebugLogFile(DEBUG_LOG_FILE1_NAME, log1Size, tag, _text);
			}
		}
		filesAtRecurse = false;
	}
#endif	
}
#endif

void writeDebugLogFile(String fileName, int fileSize, String tag, String text)
{
	if (fileSize < 0)
	{
		filesWriteString(fileName, tag + "\t" + text);
	}
	else
	{
		filesAppendString(fileName, tag + "\t" + text);
	}
}

bool matchRoute(const String &route, const String &topic, const char *path)
{
	return matchRoute(route.c_str(), topic.c_str(), path);
}
// Route = a/b/c/d /getsomething
//   topic=^^^^^^^|^^^^^^^^^^^^^=path
bool matchRoute(const char *route, const char *topic, const char *path)
{
	if (!route || !topic || !path)
		return false;

	int len = strlen(route);
	const char *routePath = NULL;
	//Find last /
	for (int i = len; i >= 0; i--)
	{
		if (route[i] == '/')
		{
			routePath = route + i;
			break;
		}
	}
	if (!routePath)
		return false;

	//First check path
	if (strcmp(routePath, path) != 0)
		return false;
	// Check only the topic part of route
	if (strncmp(topic, route, len - strlen(routePath)) != 0)
		return false;

	return true;
}

String GetFeatures()
{

	String features = "OWLOSfeatures:\n"
					  "Version=" FIRMWARE_VERSION_NUMVER "\n"
					  "Build=" +
					  String(FIRMWARE_BUILD_NUMBER) + "\n" +
#if defined(ARDUINO_ESP8266_RELEASE_2_5_0)
					  "Board=ESP8266\n";
#else
#if defined(ARDUINO_ESP32_RELEASE_1_0_4)
					  "Board=ESP32\n";
#else
					  "Board=Arduino family\n";
#endif
#endif

#ifdef DONT_USE_FILES
	features += "FileSystem=no\n";
#else 
    features += "FileSystem=yes\n";
#endif

#ifdef DEBUG
	features += "Debug=yes\n";
#else 
    features += "Debug=no\n";
#endif

if (WRITE_DEBUG_LOG_FILES)
{
	features += "Log=yes\n";
}
else 
{
	features += "Log=no\n";
}

//--- Use ESP Section
#ifdef USE_ESP_DRIVER
	features += "ESP:yes\n";

	if (thingGetWiFiAccessPointAvailable())
	{
		features += "WiFiAP=yes\n"; 	
		features += "WiFiAPSSID=" + thingGetWiFiAccessPointSSID() +"\n"; 	
		features += "WiFiAPSSID=" + thingGetWiFiAccessPointIP() +"\n"; 	
	}
	else 
	{
		features += "WiFiAP=no\n"; 	
	}

	if (thingGetWiFiAvailable())				
	{
	  features += "WiFiST=yes\n"; 	
	  features += "WiFiSTSSID=" DEFAULT_WIFI_STATION_SSID  "\n";
	  if (thingGetWiFiIsConnected())
	  {
        features += "WiFiSTConnected=yes\n"; 	
		features += "WiFiSTIP="+ thingGetWiFiIP()+"\n"; 	
	  }
	  else 
	  {
        features += "WiFiSTConnected=no\n"; 	
	  }
	}

#ifdef USE_HTTPS_SERVER
	if (thingGetHTTPServerAvailable())
	{
		features += "HTTPSecureServer:yes\n";
		if ((thingGetWiFiAvailable()) &&  (thingGetWiFiIsConnected())) 
		{				
		  features += "HTTPSecureServerST=http://" + thingGetWiFiIP() + ":443\n";
		}
		else 
		{
		  features += "HTTPSecureServerST=not connected\n";	
		}

		if (thingGetWiFiAccessPointAvailable()) 
		{				
		  features += "HTTPSecureServerAP=https://" + thingGetWiFiAccessPointIP() + ":443\n";
		}
		else 
		{
		  features += "HTTPSecureServerAP=not connected\n";	
		}

	}
	else
	{
		features += "HTTPSecureServer:disabled\n";
	}
#else
	features += "HTTPSecureServer:no\n";
#endif

#ifdef USE_HTTP_SERVER
	if (thingGetHTTPServerAvailable())
	{
		features += "HTTPServer:yes\n";
		if ((thingGetWiFiAvailable()) &&  (thingGetWiFiIsConnected())) 
		{				
		  features += "HTTPServerST=http://" + thingGetWiFiIP() + ":" + String(thingGetHTTPServerPort()) + "\n";
		}
		else 
		{
		  features += "HTTPServerST=not connected\n";	
		}

		if (thingGetWiFiAccessPointAvailable()) 
		{				
		  features += "HTTPServerAP=https://" + thingGetWiFiAccessPointIP() + ":" + String(thingGetHTTPServerPort()) + "\n";
		}
		else 
		{
		  features += "HTTPServerAP=not connected\n";	
		}
	}
	else
	{
		features += "HTTPServer:disabled\n";
	}
#else
	features += "HTTPServer:no\n";
#endif

#ifdef USE_HTTP_CLIENT
	features += "HTTPClient=yes\n";
#else
	features += "HTTPClient=no\n";
#endif

#ifdef USE_OTA_SERVICE
	features += "OTA=yes\n";
	if ((thingGetWiFiAvailable()) &&  (thingGetWiFiIsConnected()))
	{
		features += "OTAConnected=yes\n";
	} 
	else 
	{
		features += "OTAConnected=no\n";
	}	
#else
	features += "OTA=no\n";
#endif

#ifdef USE_MQTT
	if (thingGetMQTTAvailable())
	{
		features += "MQTTBroker:" + thingGetMQTTURL() + ":" + String(thingGetMQTTPort()) + "\n";
		if ((thingGetWiFiAvailable()) &&  (thingGetWiFiIsConnected()))
		{
		 features += "MQTTBrokerNetwork=yes\n";	
		 if (thingGetMQTTClientConnected())
		 {
		  features += "MQTTBrokerConnected=yes\n";		 
		 }
		 else 
		 {
		  features += "MQTTBrokerConnected=no\n";		 	 
	 }
		}
		else 
		{
		 features += "MQTTBrokerNetwork=no\n";	
		 features += "MQTTBrokerConnected=no\n";		 	 
		}
	}
	else
	{
		features += "MQTTBroker=disabled\n";
	}
#else
	features += "MQTTBroker:no\n";
#endif

#else
	features += "ESP:no\n";
#endif
	//ENDOF Use ESP Section ---

#ifdef USE_UART
	features += "UART=" + String(PORTSPEED) + "\n";
#else
	features += "UART=no\n";
#endif

//--- Use Drivers Section
#ifdef USE_DRIVERS
	features += "Drivers:yes\n";

#ifdef USE_ACTUATOR_DRIVER
	features += "Actuator=yes\n";
#else
	features += "Actuator=no\n";
#endif

#ifdef USE_SENSOR_DRIVER
	features += "Sensor=yes\n";
#else
	features += "Sensor=no\n";
#endif

#ifdef USE_DHT_DRIVER
	features += "DHT=yes\n";
#else
	features += "DHT=no\n";
#endif

#ifdef USE_LCD_DRIVER
	features += "LCD=yes\n";
#else
	features += "LCD=no\n";
#endif

#ifdef USE_STEPPER_DRIVER
	features += "Stepper=yes\n";
#else
	features += "Stepper=no\n";
#endif

#ifdef USE_VALVE_DRIVER
	features += "Valve=yes\n";
#else
	features += "Valve=no\n";
#endif
#else
	features += "Drivers:no\n";
#endif
	//ENDOF Use Drivers Section ---

#ifdef USE_SCRIPT
	features += "Script:yes\n";
#else
	features += "Script:no\n";
#endif

	return features;
}