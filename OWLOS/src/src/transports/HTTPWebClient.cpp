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

#ifdef USE_HTTP_CLIENT
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
#include <WiFiClientSecure.h>
#endif

#include <FS.h>

#include "../drivers/NetworkDriver.h"
#include "../utils/Utils.h"
#include "../services/FileService.h"

#define webclientid "WebClient"

#define HTTP_CLIENT_TIMEOUT 500

HTTPClient http;
WiFiClientSecure *secureClient = nullptr;

int HTTPClientStatus = -2;
int HTTPClientSend = 0;
int HTTPClientRecv = 0;

#define TIME_OUT_SKIP_COUNT 10
int TimeOut_Skip = 0;
bool TimeOut_Skip_Flag = false;

//https://techtutorialsx.com/2017/11/18/esp32-arduino-https-get-request/
//^^^About cetifivation ESP32 HTTP Client

//https://github.com/espressif/arduino-esp32/blob/master/libraries/HTTPClient/examples/BasicHttpsClient/BasicHttpsClient.ino
// This is GandiStandardSSLCA2.pem, the root Certificate Authority that signed
// the server certifcate for the demo server https://jigsaw.w3.org in this
// example. This certificate is valid until Sep 11 23:59:59 2024 GMT
const char *rootCACertificate =
	"-----BEGIN CERTIFICATE-----\n"
	"MIIDDDCCAfSgAwIBAgIIVb+tdeqOFs0wDQYJKoZIhvcNAQELBQAwFDESMBAGA1UE\n"
	"AxMJbG9jYWxob3N0MB4XDTIxMDYyMDE2NDMxMFoXDTIyMDYyMDE2NDMxMFowFDES\n"
	"MBAGA1UEAxMJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\n"
	"AQEApVOsURJIWkNfXyyBnTQM//r7XpWIXnrxC+iBV7zs8UXIwrTAmkW89gFO/6kz\n"
	"Ed4gymMr+iIdoBtQjz2oaQbHR1jVoiq7cM1EL6Ume6xTW8BHQaLhJkwH50kB1CES\n"
	"9vX38b7Tj7nSDALeljIvtgmnK/vwC32Sr+xxHWhIgpMJiy5y1l8FYCBaY+PD4gMq\n"
	"WYgVX22efploP14OcgcZrrlSSKg3hqEyLdayi6gJja7e7aBBDztZ3ag+yVMfr6st\n"
	"8SzN0CZlSMXE2fLwTHcUCZY2CmAUBml6SIFo7eZQyLS8rdbxbkRQp0gpHioThdxV\n"
	"mEFmYCfHLFMWiLbR0BoQX4+huQIDAQABo2IwYDAMBgNVHRMBAf8EAjAAMA4GA1Ud\n"
	"DwEB/wQEAwIFoDAWBgNVHSUBAf8EDDAKBggrBgEFBQcDATAXBgNVHREBAf8EDTAL\n"
	"gglsb2NhbGhvc3QwDwYKKwYBBAGCN1QBAQQBAjANBgkqhkiG9w0BAQsFAAOCAQEA\n"
	"EszVECtO2KDCnPz07zAPdkGI9/UtrhDNN1a+qK5swp7uJAz62lM/cZOGrNbQqgPF\n"
	"wkXxOT0xC3VwM5iDA0iDpTMHNP4GNMXLgOibxCyljRfHaG9OfbOBhzoHcEU0lQA/\n"
	"KSrAdOnM59JkM2eP0HWzLXAyDJLjlhLAXc7A8kkholUT/K+ilJxBmXT9w2xGaG8K\n"
	"kWWXfhQJU//etfwRf/L4G9K0f2acqrAxhwUC2dGSxouDsNWlmIcWfvJbGFKMwp1o\n"
	"ZCBv/I3IEGQYW1TgawUzVi3rDot9w3VCk2383NYf3MIjNAq6YQDgb3k/Bb+lWBVF\n"
	"SLgwDhZsbgYy/9Tb1ZKktw==\n"
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

//FROM: https://github.com/espressif/arduino-esp32/blob/master/libraries/HTTPClient/examples/BasicHttpsClient/BasicHttpsClient.ino
//BasicHTTPSClient.ino
void setClock()
{
	configTime(0, 0, "pool.ntp.org");

#ifdef DEBUG
	debugOut(webclientid, "Waiting for NTP time sync: ");
#endif

	time_t nowSecs = time(nullptr);
	while (nowSecs < 8 * 3600 * 2)
	{
		delay(500);
#ifdef DEBUG
		debugOut(webclientid, ".");
#endif
		yield(); //конем косточку WDT
		nowSecs = time(nullptr);
	}

	Serial.println();
	struct tm timeinfo;
	gmtime_r(&nowSecs, &timeinfo);
#ifdef DEBUG
	debugOut(webclientid, asctime(&timeinfo));
#endif
}

void HTTPWebClientPublish(String _topic, String _payload)
{
	if (thingGetHTTPClientAvailable() == 1)
	{
		if ((thingGetHTTPClientAirQualityOnly() == 0) || (_payload.indexOf("airqualityonly") != -1))
		{
			_payload = "topic:" + _topic + "\n" +
					   "token:" + thingGetHTTPClientToken() + "\n" + _payload;

			http.setTimeout(HTTP_CLIENT_TIMEOUT);

			if (TimeOut_Skip_Flag)
			{
				TimeOut_Skip++;
				if (TimeOut_Skip < TIME_OUT_SKIP_COUNT)
				{
					debugOut(webclientid, "HTTP Client skip session, time out ", DEBUG_WARNING);
					return;
				}
				//try again
				TimeOut_Skip = 0;
			}
			//store time on begin session
			long BeginTime = millis();

			if (thingGetHTTPClientUseHTTPS() == 1)
			{
				if (!secureClient)
				{
					setClock();
					secureClient = new WiFiClientSecure;
				}
				if (secureClient)
				{
					secureClient->setCACert(rootCACertificate);
					http.begin(thingGetHTTPClientURL() + ":" + String(thingGetHTTPClientPort()) + "/Things/AirQuality/", rootCACertificate);
				}
				else
				{
#ifdef DEBUG
					debugOut(webclientid, "HTTP Client HTTPS Secure client problem", DEBUG_DANGER);
#endif
					return;
				}
			}
			else
			{
				http.begin(thingGetHTTPClientURL() + ":" + String(thingGetHTTPClientPort()) + "/Things/AirQuality/");
			}

			HTTPClientSend += _payload.length();
			HTTPClientStatus = http.POST(_payload);
			if (HTTPClientStatus != -1)
			{
				HTTPClientRecv += http.getSize();
			}
#ifdef DEBUG
			if ((HTTPClientStatus >= 200) && (HTTPClientStatus <= 300))
			{
				TimeOut_Skip_Flag = false;
				debugOut(webclientid, thingGetHTTPClientURL() + ":" + String(thingGetHTTPClientPort()) + " OK", DEBUG_SUCCESS);
			}
			else
			{
				if (HTTPClientStatus == -1)
				{
					if (millis() - BeginTime > HTTP_CLIENT_TIMEOUT)
					{
						if (!TimeOut_Skip_Flag)
						{
							TimeOut_Skip_Flag = true;
							TimeOut_Skip = 0;
							debugOut(webclientid, "HTTP Client time out, skip session enabled", DEBUG_WARNING);
						}
					}
					debugOut(webclientid, thingGetHTTPClientURL() + ":" + String(thingGetHTTPClientPort()) + " socket error", DEBUG_DANGER);
				}
				else
				{
					TimeOut_Skip_Flag = false;
					debugOut(webclientid, thingGetHTTPClientURL() + ":" + String(thingGetHTTPClientPort()) + " result " + String(HTTPClientStatus), DEBUG_WARNING);
				}
			}
#else
#endif
			http.end();
		}
	}
}

int HTTPClientGetStatus()
{
	return HTTPClientStatus;
}

int HTTPClientGetSend()
{
	return HTTPClientSend;
}

int HTTPClientGetRecv()
{
	return HTTPClientRecv;
}

#endif
#endif