#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
#include <FS.h>

#include "..\utils\Utils.h"
#include "..\managers\FileManager.h"

#define webclientid "webclient"
HTTPClient http;

bool downloadFile(String fileName, String  url) {
	bool result = false;
	debugOut(webclientid, "download: " + fileName + " from: " + url);

	if (!filesBegin())
	{
		//An Error has occurred while mounting file system
		return result;;
	}

	http.begin(url);
	int httpCode = http.GET();
	if (httpCode > 0) {

		File file = SPIFFS.open(fileName, "w");
		if (!file) {
			debugOut(webclientid, "There was an error opening the file for writing: " + fileName);
			return result;
		}

		if (httpCode == HTTP_CODE_OK) {
			int len = http.getSize();
			debugOut(webclientid, "download size: " + String(len));
			uint8_t buff[128] = { 0 };
			WiFiClient * stream = http.getStreamPtr();
			int dotCount = 0;
			while (http.connected() && (len > 0 || len == -1)) {
				size_t size = stream->available();
				if (size) {					
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
			debugOut(webclientid, "download=OK");
			result = true;

		}
		else
		{
			debugOut(webclientid, "download=fail HTTPResult=" + String(httpCode));
		}
	}
	else
	{
		debugOut(webclientid, "download=fail");
		Serial.println("fail " + url + "[" + String(httpCode) + "]");
	}
	http.end();
	return result;
}
