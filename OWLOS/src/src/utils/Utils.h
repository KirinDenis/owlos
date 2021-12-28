﻿/* ----------------------------------------------------------------------------
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
#ifndef UTILS_H
#define UTILS_H

#include <Arduino.h>

//#define SERIAL_COLORIZED_OUTPUT
//#define DEBUG
#ifdef DEBUG
//	#define DETAILED_DEBUG
#endif

    #define DEBUG_INFO      0x00
    #define DEBUG_SUCCESS   0x01
    #define DEBUG_WARNING   0x02
    #define DEBUG_DANGER    0x04


#define WRITE_DEBUG_LOG_FILES false
#define DEBUG_LOG_FILES_SIZE 10240L
#define DEBUG_LOG_FILE1_NAME "log1"
#define DEBUG_LOG_FILE2_NAME "log2"
#define PORTSPEED 115200
#define ONETENTHOFSECOND 100L
#define ONEHUNDREDTH 10L
#define ONESECOND 1000L
#define TENSECOND 10000L
#define ONEMINUTE 60000L

//Transport masks
#define NO_TRANSPORT_MASK 0b00000000
#define MQTT_TRANSPORT_MASK 0b00000001
#define RESTFUL_TRANSPORT_MASK 0b00000010
#define GSM_TRANSPORT_MASK 0b00000100
#define UART_TRANSPORT_MASK 0b00001000 //debug is transport by this flag

//Not available selector
#define NOT_AVAILABLE F("nan")
#define WRONG_PROPERTY_NAME F("Drivers: wrong property name")
#define WRONG_DRIVER_NAME F("Drivers: wrong driver name")
#define WRONG_THING_PROPERTY_NAME F("Thing: wrong thing property name")

#define TEST_DRIVER_TYPE 0
#define DHT_DRIVER_TYPE 1
#define LIGHT_DRIVER_TYPE 2
#define SMOKE_DRIVER_TYPE 3
#define MOTION_DRIVER_TYPE 4
#define SENSOR_DRIVER_TYPE 5
#define STEPPER_DRIVER_TYPE 6
#define LCD_DRIVER_TYPE 7
#define ACTUATOR_DRIVER_TYPE 8
#define OPTO_DRIVER_TYPE 9
#define VALVE_DRIVER_TYPE 10
#define WIFI_DRIVER_TYPE 11
#define NETWORK_DRIVER_TYPE 12
#define ESP_DRIVER_TYPE 13
#define CONFIG_DRIVER_TYPE 14
#define SAMPLE_DRIVER_TYPE 15
#define BMP280_DRIVER_TYPE 16
#define ADS1X15_DRIVER_TYPE 17
#define CCS811_DRIVER_TYPE 18

char *stringToChar(String src);
#if defined (DEBUG) || defined (LOG_SCREEN_UX)
void debugOut(const String &tag, const String &text);
void debugOut(const String &tag, const String &text, int code);
#endif

void writeDebugLogFile(String fileName, int fileSize, String tag, String text);
bool matchRoute(const char *route, const char *topic, const char *path);
bool matchRoute(const String &route, const String &topic, const char *path);

String GetFeatures();

#endif
