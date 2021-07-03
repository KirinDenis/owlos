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
#include "HTTPWebClient.h"

#ifdef USE_ESP_DRIVER
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <SPIFFS.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include "../libraries/HTTPClient/HTTPClient.h"
#include <HTTPUpdate.h>
#endif

#include <FS.h>

#include "../utils/Utils.h"
#include "../services/FileService.h"

#define webclientid "WebClient"
HTTPClient http;

const char* ca = \ 
"-----BEGIN CERTIFICATE-----\n" \  
"MIIEkjCCA3qgAwIBAgIQCgFBQgAAAVOFc2oLheynCDANBgkqhkiG9w0BAQsFADA/\n" \  
"MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT\n" \  
"DkRTVCBSb290IENBIFgzMB4XDTE2MDMxNzE2NDA0NloXDTIxMDMxNzE2NDA0Nlow\n" \  
"SjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUxldCdzIEVuY3J5cHQxIzAhBgNVBAMT\n" \  
"GkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5IFgzMIIBIjANBgkqhkiG9w0BAQEFAAOC\n" \  
"AQ8AMIIBCgKCAQEAnNMM8FrlLke3cl03g7NoYzDq1zUmGSXhvb418XCSL7e4S0EF\n" \  
"q6meNQhY7LEqxGiHC6PjdeTm86dicbp5gWAf15Gan/PQeGdxyGkOlZHP/uaZ6WA8\n" \  
"SMx+yk13EiSdRxta67nsHjcAHJyse6cF6s5K671B5TaYucv9bTyWaN8jKkKQDIZ0\n" \  
"Z8h/pZq4UmEUEz9l6YKHy9v6Dlb2honzhT+Xhq+w3Brvaw2VFn3EK6BlspkENnWA\n" \  
"a6xK8xuQSXgvopZPKiAlKQTGdMDQMc2PMTiVFrqoM7hD8bEfwzB/onkxEz0tNvjj\n" \  
"/PIzark5McWvxI0NHWQWM6r6hCm21AvA2H3DkwIDAQABo4IBfTCCAXkwEgYDVR0T\n" \  
"AQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAYYwfwYIKwYBBQUHAQEEczBxMDIG\n" \  
"CCsGAQUFBzABhiZodHRwOi8vaXNyZy50cnVzdGlkLm9jc3AuaWRlbnRydXN0LmNv\n" \  
"bTA7BggrBgEFBQcwAoYvaHR0cDovL2FwcHMuaWRlbnRydXN0LmNvbS9yb290cy9k\n" \  
"c3Ryb290Y2F4My5wN2MwHwYDVR0jBBgwFoAUxKexpHsscfrb4UuQdf/EFWCFiRAw\n" \  
"VAYDVR0gBE0wSzAIBgZngQwBAgEwPwYLKwYBBAGC3xMBAQEwMDAuBggrBgEFBQcC\n" \  
"ARYiaHR0cDovL2Nwcy5yb290LXgxLmxldHNlbmNyeXB0Lm9yZzA8BgNVHR8ENTAz\n" \  
"MDGgL6AthitodHRwOi8vY3JsLmlkZW50cnVzdC5jb20vRFNUUk9PVENBWDNDUkwu\n" \  
"Y3JsMB0GA1UdDgQWBBSoSmpjBH3duubRObemRWXv86jsoTANBgkqhkiG9w0BAQsF\n" \  
"AAOCAQEA3TPXEfNjWDjdGBX7CVW+dla5cEilaUcne8IkCJLxWh9KEik3JHRRHGJo\n" \  
"uM2VcGfl96S8TihRzZvoroed6ti6WqEBmtzw3Wodatg+VyOeph4EYpr/1wXKtx8/\n" \  
"wApIvJSwtmVi4MFU5aMqrSDE6ea73Mj2tcMyo5jMd6jmeWUHK8so/joWUoHOUgwu\n" \  
"X4Po1QYz+3dszkDqMp4fklxBwXRsW10KXzPMTZ+sOPAveyxindmjkW8lGy+QsRlG\n" \  
"PfZ+G6Z6h7mjem0Y+iWlkYcV4PIWL1iwBi8saCbGS5jN2p8M+X+Q7UNKEkROb3N6\n" \  
"KOqkqm57TH2H3eDJAkSnh6/DNFu0Qg==\n" \  
"-----END CERTIFICATE-----\n";

bool downloadFile(String fileName, String url)
{
	bool result = false;

#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(webclientid, "download: " + fileName + " from: " + url);
#endif
#endif

	if (!filesBegin())
	{
		//An Error has occurred while mounting file system
		return result;
		;
	}

	http.begin(url);
	int httpCode = http.GET();
	if (httpCode > 0)
	{

		File file = SPIFFS.open(fileName, "w");
		if (!file)
		{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(webclientid, "There was an error opening the file for writing: " + fileName);
#endif
#endif
			return result;
		}

		if (httpCode == HTTP_CODE_OK)
		{
			int len = http.getSize();
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(webclientid, "download size: " + String(len));
#endif
#endif
			uint8_t buff[128] = {0};
			WiFiClient *stream = http.getStreamPtr();
			int dotCount = 0;
			while (http.connected() && (len > 0 || len == -1))
			{
				size_t size = stream->available();
				if (size)
				{
					dotCount++;
					if (dotCount > 40)
					{
						dotCount = 0;
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(webclientid, "download=OK");
#endif
#endif
			result = true;
		}
		else
		{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(webclientid, "download=fail HTTPResult=" + String(httpCode));
#endif
#endif
		}
	}
	else
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(webclientid, "download=fail");
#endif
#endif
	}
	http.end();
	return result;
}

void HTTPWebClientPublish(String _topic, String _payload)
{
	Serial.println("HTTP CLIENT ---------->");
		http.begin("https://192.168.1.100:5004/Things/AirQuality/");


//_payload = "-----------------------------130282268939037817141630335151\n\r" 
//"Content-Disposition: form-data; name=\"AirQualityData\"\n\r\n\r" +
//_payload +
//"\n\r-----------------------------130282268939037817141630335151--\n\r\n\r";

  //      http.addHeader("Content-Type", "multipart/form-data; boundary=-----------------------------130282268939037817141630335151");

	    int httpCode = http.POST(_payload);
		Serial.println(httpCode);
	    //if (httpCode > 0) //TODO: Log
		http.end();
}

#endif