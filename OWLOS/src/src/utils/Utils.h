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
#ifndef UTILS_H
#define UTILS_H

#include <Arduino.h>

//#define SERIAL_COLORIZED_OUTPUT
//#define DEBUG
#ifdef DEBUG
//#define DetailedDebug 
#endif
#define WriteDebugLogs false
#define LogFilesSize 1024*10
#define LogFile1 "log1"
#define LogFile2 "log2"
#define PORTSPEED 115200
#define ONETENTHOFSECOND 100L
#define ONESECOND 1000L
#define TENSECOND 10000L
#define ONEMINUTE 60000L 

#define PayloadBufferSize 255

#define HTTPServerDefaultPort 8080

#define TestDriverType 0 
#define DHTDriverType  1
#define Light  2
#define Smoke  3
#define Motion  4
#define Sensor  5
#define Stepper  6
#define LCD  7
#define Actuator 8
#define Opto  9
#define Valve 10
#define WiFiType 11
#define NetworkType 12
#define ESPType 13
#define Config 14


//Transport masks
#define NoTransportMask 0b00000000
#define MQTTMask 0b00000001
#define RESTfulClientMask 0b00000010
#define GSMMask	0b00000100
#define RxTxMask 0b00001000  //debug is transport by this flag

//Not available selector
#define NotAvailable "nan"
#define WrongPropertyName "Drivers: wrong property name"
#define WrongDriverName "Drivers: wrong driver name"
#define WrongNodePropertyName "Node: wrong node property name"

char* stringToChar(String src);
#ifdef DEBUG
void  debugOut(String tag, String text);
#endif
void writeDebugLogFile(String fileName, int fileSize, String tag, String text);
bool matchRoute(const char* route, const char* topic, const char* path);
bool matchRoute(String &route, String &topic, const char* path);

#endif
