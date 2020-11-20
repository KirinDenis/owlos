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
#ifndef TRANSPORTSERVICE_H
#define TRANSPORTSERVICE_H

#include "../config.h"
#ifdef USE_ESP_DRIVER

#define TransportID "Transport"

#ifdef ARDUINO_ESP32_RELEASE_1_0_4

#include <WiFiMulti.h>

#define TransportID "Transport"
bool transportBegin();

void transportSubscribe(String topic);
void transportLoop();
bool transportPublish(String topic, String payload);

WiFiMulti transportGetWifiMulti();

#endif

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

bool transportBegin();
bool transportAvailable();
bool WiFiAccessPointReconnect();
bool transportReconnect();
bool MQTTReconnect();
void transportSubscribe(String topic);
void transportLoop();
bool transportPublish(String topic, String payload);

ESP8266WiFiMulti transportGetWifiMulti();

#endif
#endif

#if defined(USE_ARDUINO_BOARDS) || !defined(USE_ESP_DRIVER)
bool transportBegin();
bool transportAvailable();
void transportLoop();
bool transportPublish(String topic, String payload);

#endif

#endif

