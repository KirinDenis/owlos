/***
  version 1.7 beta
  -------------------------------------------------------------------------------------------------------------------------
  Ready IoT Solution OWLOS
  (c) Konstantin Brul, Vitalii Glushchenko, Denys Melnychuk, Denis Kirin
  -------------------------------------------------------------------------------------------------------------------------

  Instruction:

  Arduino Studio Setup
  --------------------
  - Download and isnstall COM port driver for ESP8266 https://wiki.wemos.cc/downloads
  - Download and install File\Preferenses -> Addition board managers -> http://arduino.esp8266.com/stable/package_esp8266com_index.json (NOTE: version 2.5.0)
  * see: https://github.com/wemos/Arduino_D1 and use Tools\Board..Board manager - install D1 board support tools

  This Sketh Setup
  ----------------
  - Put your WiFi SSID and Password to:                                                                 */
#ifndef APSSID
#define APSSID "YOURSSID_HERE" //<-- YOUR WIFI ACCESS POINT SSID	      
#define APPSK  "YOURPASSWORD_HERE" //<-- YOUR WIFI ACCESS POINT PASSWORS	      

#endif
  //-------------------------------------------------------------------------------------------------------------------------

#define boardNotSelected

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
#include <FS.h>

String host = "http://81.95.178.177:8082/update/";
ESP8266WiFiMulti WiFiMulti;

bool readyToUpdate = false;

void setup() {
	ESP.wdtEnable(0); //disable ESP8266 software watch dog
	Serial.begin(115200);
	delay(1000);

	Serial.println("OWSOS updater version: 1.7");
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
	Serial.println(" - Connect to WiFi access point 'owlunit" + String(ESP.getChipId()) + "' PWD: 1122334455");
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

void download(String fileName, String  url) {
	if (!SPIFFS.begin())
	{
		Serial.println("An Error has occurred while mounting file system");
		return;
	}
	HTTPClient http;
	Serial.print("download: ");
	Serial.print(fileName);
	Serial.print("...");
	Serial.printf("GET ", url.c_str());

	http.begin(url);
	int httpCode = http.GET();
	if (httpCode > 0) {
		File file = SPIFFS.open(fileName, "w");
		if (!file) {
			Serial.println("There was an error opening the file for writing: " + fileName);
		}
		if (httpCode == HTTP_CODE_OK) {
			int len = http.getSize();
			Serial.println(" size: " + String(len));
			uint8_t buff[128] = { 0 };
			WiFiClient * stream = http.getStreamPtr();
			int dotCount = 0;
			while (http.connected() && (len > 0 || len == -1)) {
				size_t size = stream->available();
				if (size) {
					Serial.print(".");
					dotCount++;
					if (dotCount > 40)
					{
						dotCount = 0;
						Serial.println();
					}
					int c = stream->readBytes(buff, ((size > sizeof(buff)) ? sizeof(buff) : size));
					file.write(buff, c);
					if (len > 0) {
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
		Serial.println("fail " + url + "[" + String(httpCode) + "]");
	}
	http.end();
}

void loop() {
	if (readyToUpdate)
	{
		if ((WiFiMulti.run() == WL_CONNECTED)) {
			Serial.println("Downloading files...");

			
			download("jquery.min.js.gz", host + "jquery.min.js.gz");
			download("popper.min.js.gz", host + "popper.min.js.gz");
			download("bootstrap.min.css.gz", host + "bootstrap.min.css.gz");
			download("bootstrap.min.js.gz", host + "bootstrap.min.js.gz");
			download("jquery.dataTables.min.js.gz", host + "jquery.dataTables.min.js.gz");
			download("dataTables.min.css.gz", host + "dataTables.min.css.gz");
			download("dataTables.min.js.gz", host + "dataTables.min.js.gz");

			download("ui.css.gz", host + "ui.css.gz");
			
			download("bootcore.js.gz", host + "bootcore.js.gz");
			download("restclientcore.js.gz", host + "restclientcore.js.gz");
			download("configcore.js.gz", host + "configcore.js.gz");
			download("devicescore.js.gz", host + "devicescore.js.gz");
			download("drawcore.js.gz", host + "drawcore.js.gz");
			download("languagescore.js.gz", host + "languagescore.js.gz");
			download("speechcore.js.gz", host + "speechcore.js.gz");

			download("basewidget.js.gz", host + "basewidget.js.gz");
			download("actuatorwidget.js.gz", host + "actuatorwidget.js.gz");
			download("temperaturewidget.js.gz", host + "temperaturewidget.js.gz");
			download("graphwidget.js.gz", host + "graphwidget.js.gz");
			download("tablewidget.js.gz", host + "tablewidget.js.gz");
			download("lcdwidget.js.gz", host + "lcdwidget.js.gz");
			download("lightwidget.js.gz", host + "lightwidget.js.gz");
			download("lcdwidget.js.gz", host + "lcdwidget.js.gz");
			download("lightwidget.js.gz", host + "lightwidget.js.gz");
			download("motionwidget.js.gz", host + "motionwidget.js.gz");
			download("radialwidget.js.gz", host + "radialwidget.js.gz");
			download("smokewidget.js.gz", host + "smokewidget.js.gz");			
			download("stepperwidget.js.gz", host + "stepperwidget.js.gz");
			download("valuewidget.js.gz", host + "valuewidget.js.gz");
						
			download("widgetswrappers.js.gz", host + "widgetswrappers.js.gz");

			download("devicesui.js.gz", host + "devicesui.js.gz");
			download("settingsui.js.gz", host + "settingsui.js.gz");			
			download("filespanelui.js.gz", host + "filespanelui.js.gz");
			download("dashboardui.js.gz", host + "dashboardui.js.gz");

			download("index.js.gz", host + "index.js.gz");

			download("index.html.gz", host + "index.html.gz");

			Serial.println("----------------------------------------------------------");
			Serial.println("Start updating firmware (onboard led must faster blinking)");
			Serial.println("Please wait until board self restarting...");

			WiFiClient client;
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

			switch (ret) {
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
