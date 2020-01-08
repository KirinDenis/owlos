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
#define APSSID "Palata#13" //<-- YOUR WIFI ACCESS POINT SSID	      
#define APPSK  "qweasdzxc1234" //<-- YOUR WIFI ACCESS POINT PASSWORS	      

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
	ESP.wdtDisable(); //disable ESP8266 software watch dog
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
			download("actuatorindicator.js.gz", host + "actuatorindicator.js.gz");
			download("baseindicator.js.gz", host + "baseindicator.js.gz");
			download("boot.js.gz", host + "boot.js.gz");
			download("bootstrap.min.css.gz", host + "bootstrap.min.css.gz");
			download("bootstrap.min.js.gz", host + "bootstrap.min.js.gz");
			download("client.js.gz", host + "client.js.gz");
			download("custom.css.gz", host + "custom.css.gz");
			download("dataTables.min.css.gz", host + "dataTables.min.css.gz");
			download("dataTables.min.js.gz", host + "dataTables.min.js.gz");
			download("devices.js.gz", host + "devices.js.gz");
			download("devicesproperties.js.gz", host + "devicesproperties.js.gz");
			download("draw.js.gz", host + "draw.js.gz");
			download("files.js.gz", host + "files.js.gz");
			download("index.html.gz", host + "index.html.gz");
			download("index.js.gz", host + "index.js.gz");
			download("jquery.dataTables.min.js.gz", host + "jquery.dataTables.min.js.gz");
			download("jquery.min.js.gz", host + "jquery.min.js.gz");
			download("language.js.gz", host + "language.js.gz");
			download("lcdindicator.js.gz", host + "lcdindicator.js.gz");
			download("lightindicator.js.gz", host + "lightindicator.js.gz");
			download("lcdindicator.js.gz", host + "lcdindicator.js.gz");
			download("lightindicator.js.gz", host + "lightindicator.js.gz");
			download("motionindicator.js.gz", host + "motionindicator.js.gz");
			download("popper.min.js.gz", host + "popper.min.js.gz");
			download("radialindicator.js.gz", host + "radialindicator.js.gz");
			download("smokeindicator.js.gz", host + "smokeindicator.js.gz");
			download("speech.js.gz", host + "speech.js.gz");
			download("stepperindicator.js.gz", host + "stepperindicator.js.gz");
			download("temperatureindicator.js.gz", host + "temperatureindicator.js.gz");
			download("graphindicator.js.gz", host + "graphindicator.js.gz");
			download("webproperties.js.gz", host + "webproperties.js.gz");
			download("tableindicator.js.gz", host + "tableindicator.js.gz");

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
