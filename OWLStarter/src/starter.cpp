/*----------------------------------------------------------------------------
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
--------------------------------------------------------------------------------------

  Instruction:

  Arduino Studio Setup
  --------------------
  - Download and isnstall COM port driver for ESP8266 https://wiki.wemos.cc/downloads
  - Download and install File\Preferenses -> Addition board services -> http://arduino.esp8266.com/stable/package_esp8266com_index.json (NOTE: version 2.5.0)
  * see: https://github.com/wemos/Arduino_D1 and use Tools\Board..Board Service - install D1 board support tools

  This Sketh Setup
  ----------------
  - Put your WiFi SSID and Password to:                                                                 */
#ifndef APSSID
#define APSSID "YOURSSID_HERE"	  //<-- YOUR WIFI ACCESS POINT SSID
#define APPSK "YOURPASSWORD_HERE" //<-- YOUR WIFI ACCESS POINT PASSWORS

#endif
//-------------------------------------------------------------------------------------------------------------------------

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
#include <FS.h>
#include "starter.h"

#define boardNotSelected

String host = "https://raw.githubusercontent.com/KirinDenis/owlos/master/OWLOS/firmware/";
const uint8_t fingerprint[] PROGMEM = "5F 3F 7A C2 56 9F 50 A4 66 76 47 C6 A1 8C A0 07 AA ED BB 8E";
ESP8266WiFiMulti WiFiMulti;

bool readyToUpdate = false;

void starter_setup()
{
	ESP.wdtEnable(0); //disable ESP8266 software watch dog
	Serial.begin(115200);
	delay(1000);

	Serial.println("OWLOS firmware installer: 1.8");
	if ((APSSID == "YOURSSID_HERE") || (APPSK == "YOURPASSWORD_HERE"))
	{
		Serial.println("");
		Serial.println("ERROR: Put your WiFi SSID and Password to sketch source code");
		Serial.println("Update unimpossible");
		return;
	}

	Serial.println("");
	Serial.println("WARNING: If you just Upload this sketch, please manualy reboot the board");
	Serial.println("");
	Serial.println("------------------------------------------------------------------------");
	Serial.println("");
	Serial.println("After updating: ");
	Serial.println(" - Connect to WiFi access point 'owlnode" + String(ESP.getChipId()) + "' PWD: 1122334455");
	Serial.println(" - Browse http://192.168.4.1:8084 LGN: admin PWD: admin");
	Serial.println("");
	Serial.println("------------------------------------------------------------------------");

	Serial.println("SPIFFS mounting flash file system, please wait...");
	if (!SPIFFS.begin())
	{
		Serial.println("File system not available before, try MOUNT new FLASH drive, please wait...");
		SPIFFS.format();
	}
	bool result = SPIFFS.begin();
	if (result)
	{
		Serial.println("SPIFFS file system mount OK");
	}
	else
	{
		Serial.println("ERROR: SPIFFS file system mount FAIL");
		return;
	}

	WiFi.mode(WIFI_STA);
	WiFiMulti.addAP(APSSID, APPSK);

	Serial.print("waiting for WiFi: ");
	Serial.println(APSSID);
	int wait = 0;
	while (WiFiMulti.run() != WL_CONNECTED)
	{
		delay(500);
		wait++;
		Serial.println("Wait for WiFi [" + String(wait) + "] from [20]");
		if (wait > 19)
		{
			Serial.println("Wait for WiFi TimeOut...break");
			break;
		}
	}

	if (WiFiMulti.run() == WL_CONNECTED)
	{
		Serial.println();
		Serial.println("WiFi connected");
		readyToUpdate = true;
	}
	else
	{
		Serial.println();
		Serial.println("ERROR WiFi notconnected");
		Serial.println("Update unimpossible");
	}
}

void download(String fileName, String _url)
{
	if (!SPIFFS.begin())
	{
		Serial.println("An Error has occurred while mounting file system");
		return;
	}
	HTTPClient http;
	Serial.print("download: ");
	Serial.print(fileName);
	Serial.print("...");
	Serial.printf("GET ", _url.c_str());

	WiFiClientSecure client;
	client.setFingerprint(fingerprint);
	client.setInsecure();

	http.begin(client, _url);

	int httpCode = http.GET();
	if (httpCode == 200)
	{
		File file = SPIFFS.open(fileName, "w");
		if (!file)
		{
			Serial.println("There was an error opening the file for writing: " + fileName);
		}
		if (httpCode == HTTP_CODE_OK)
		{
			int len = http.getSize();
			Serial.println(" size: " + String(len));
			uint8_t buff[128] = {0};
			WiFiClient *stream = http.getStreamPtr();
			int dotCount = 0;
			while (http.connected() && (len > 0 || len == -1))
			{
				size_t size = stream->available();
				if (size)
				{
					Serial.print(".");
					dotCount++;
					if (dotCount > 40)
					{
						dotCount = 0;
						Serial.println();
					}
					int c = stream->readBytes(buff, ((size > sizeof(buff)) ? sizeof(buff) : size));
					file.write(buff, c);
					if (len > 0)
					{
						len -= c;
					}
				}
				delay(10);
			}
			file.close();
			Serial.println("OK");
		}
	}
	else
	{
		Serial.println("fail " + _url + " [HTTP CODE: " + String(httpCode) + "]");
	}
	http.end();
}

void starter_loop()
{
	if (readyToUpdate)
	{
		if ((WiFiMulti.run() == WL_CONNECTED))
		{
			Serial.println("Downloading files...");

			download("index.html.gz", host + "index.html.gz");
			download("owlos.css.gz", host + "owlos.css.gz");
			download("owlos.js.gz", host + "owlos.js.gz");

			Serial.println("----------------------------------------------------------");
			Serial.println("Start updating firmware (onboard led must faster blinking)");
			Serial.println("Please wait until board self restarting...");

			WiFiClientSecure client;
			client.setFingerprint(fingerprint);
			client.setInsecure();

			ESPhttpUpdate.setLedPin(LED_BUILTIN, LOW);

			t_httpUpdate_return ret = HTTP_UPDATE_NO_UPDATES;
#ifdef ARDUINO_ESP8266_NODEMCU
			ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.nodemcu.bin");
#endif

#ifdef ARDUINO_ESP8266_WEMOS_D1R1
			ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.d1.bin");
#endif

#ifdef ARDUINO_ESP8266_WEMOS_D1MINI
			ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.d1_mini.bin");
#endif

#ifdef ARDUINO_ESP32
			ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.esp32.bin");
#endif

#ifdef ARDUINO_ESP32DEV
			ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.esp32dev.bin");
#endif

			switch (ret)
			{
			case HTTP_UPDATE_FAILED:
				Serial.printf("ERROR (%d): %s\n", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
				delay(15000);
				Serial.println("");
				Serial.println("try again...");
				Serial.println("");
				break;
			case HTTP_UPDATE_NO_UPDATES:
				Serial.println("no updates");
				delay(15000);
				Serial.println("");
				Serial.println("try again...");
				Serial.println("");
				break;
			case HTTP_UPDATE_OK:
				Serial.println("update OK");
				break;
			}
		}
	}
	delay(1000);
}
