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
//NOTE: don't use auto format for this file

#ifndef CONFIG_H
#define CONFIG_H

#define USE_ESP_BOARDS
    #ifdef USE_ESP_BOARDS
        #include <core_version.h>
        #define USE_ESP_DRIVER
            #ifdef USE_ESP_DRIVER
                //#define USE_HTTPS_SERVER
                #define USE_HTTP_SERVER         
                //#define USE_UPDATE_SERVICE
                //#define USE_OTA_SERVICE
#ifdef ARDUINO_ESP32_RELEASE_1_0_4                
               //#define USE_MQTT                
#endif                
            #endif
    #else
        #define USE_ARDUINO_BOARDS
    #endif

#include "utils/Utils.h"

#define USE_DRIVERS
    #ifdef USE_DRIVERS
        #define USE_ACTUATOR_DRIVER
        #define USE_SENSOR_DRIVER
        #define USE_DHT_DRIVER
        //#define USE_LCD_DRIVER
        //#define USE_STEPPER_DRIVER
        //#define USE_VALVE_DRIVER
    #endif
#endif

//#define USE_SCRIPT
