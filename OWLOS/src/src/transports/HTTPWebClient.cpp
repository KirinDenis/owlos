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
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#endif

#include <FS.h>

#include "../utils/Utils.h"
#include "../services/FileService.h"

#define webclientid "WebClient"
HTTPClient http;

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
#endif