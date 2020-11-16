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

                // ВАЖНО:
                // DONT_USE_FILES флаг запрещает ESP драйверу сохранять значения свойств в файловой системе. 
                // Если этот флаг установлен при каждой перезагрузке ESP драйвер будет возвращаться к значениям 
                // свойств по умолчанию - это более безопасно и делает невозможным перенастроить ESP драйвер удаленно. 
                // Однако требует пересборки и перенастройки для каждого устройства отдельно. 
                // Если ваше устройство с OWLOS работает стационарно и не предусматривается частого изменения 
                // настройки сети - используйте этот флаг.
                //
                //#define DONT_USE_FILES

                //Свойства WiFi по умолчанию. Если используется DONT_USE_FILES, иначе приоритетны значения этих свойств из файлов настроек
                //Если соответствующий файл отсутствует, используется значения из этих #define

                //Внимание! для проверки OWLOS в режиме точки доступа:
                // - включите устройство с OWLOS 
                // - просканируйте доступные вам WiFi сети, должна быть сеть с названием из DEFAULT_WIFI_ACCESS_POINT_SSID, по умолчанию "owlnode"
                // - соеденитесь с этой сетью использую пароль DEFAULT_WIFI_ACCESS_POINT_PASSWORD
                // - откройте браузер и перейдите по адресу иказаному в DEFAULT_WIFI_ACCESS_POINT_IP должно открытся страница с приветствием OWLOS.
                //   ^^^ Разумеется в том случае есть #define USE_HTTP_SERVER включен

                //Включает/Выключает (1/0) WiFi режим точки доступа (другие WiFi устройства могут подключатся к OWLOS если включено).
                #define DEFAULT_WIFI_ACCESS_POINT_AVAILABLE 0               //файл /owlnode.wifiapavailable

                //Если WiFi режим точки доступа включен – название точки доступа (WiFi сети)
                #define DEFAULT_WIFI_ACCESS_POINT_SSID "owlnode"            //файл /owlnode.wifiaccesspointssid

                //Если WiFi режим точки доступа включен – пароль для подключения к точке доступа (для станций, клиентов)
                //Внимание! -> Измените этот пароль!
                #define DEFAULT_WIFI_ACCESS_POINT_PASSWORD  "1122334455"    //файл /owlnode.wifiappassword

                //Если WiFi режим точки доступа включен – IP адрес точки доступа (OWLOS устройства в ее WiFi сети)
                //Если вы используете файлы для хранения настроек, это IP адрес будет сброшен в 0.0.0.0 при первом включение. 
                //В этом случае установите нужный IP адрес (рекомендуем: 192.168.4.1)                
                #define DEFAULT_WIFI_ACCESS_POINT_IP  "192.168.4.1"         //файл /owlnode.wifiaccesspointip

                //Включает/Выключает (1/0) WiFi режим станции (подключается к указаной WiFi сети (точки доступа))
                #define DEFAULT_WIFI_STATION_AVAILABLE 0

                //Название подключаемой точки доступа (WiFi сети)
                //При запуске OWLOS сделает 10 попыток подключится к DEFAULT_WIFI_STATION_SSID сети, в случае неудачи 
                //до перезапуска попыток подключения не будет. 
                //Если при запуске OWLOS подключилась к указаной сети, но в процессе работы соединение было разорвано 
                //OWLOS будет делать попытки соединения постоянно, до перезагрузки. 
                //Такой способ страхует от неправильного указания названия точки доступа - дело в том что процесс подключения
                //занимает очень много ресурсов и делает устройство OWLOS медленным. 
                #define DEFAULT_WIFI_STATION_SSID "" //Palata#13

                //Пароль подключаемой точки доступа. 
                #define DEFAULT_WIFI_STATION_PASSWORD "" //qweasdzxc1234

                //Название этого устройсва с OWLOS для формирования Topic (уникального пути к устройству в сети)
                #define DEFAULT_ID "owlnode"

                //Topic - путь к устройству в сети по умолчанию
                #define DEFAULT_TOPIC "world0/area1/front1/room1/"

                //Включает в сборку OWLOS HTTPS Server (обратите внимание на необходимость перегенерации сертификата)
                //#define USE_HTTPS_SERVER

                //Включает в сборку OWLOS HTTP Server 
                #define USE_HTTP_SERVER  

                #define USE_HTTP_CLIENT

                //Включает поиск и установку обновлений OWLOS в сети Internet
                //Новые версии готовых прошивок находятся здесь: https://github.com/KirinDenis/owlos/tree/master/OWLOS
                // - OWLOS.ino.esp32.bin для ESP32 
                // - OWLOS.ino.nodemcu.bin для ESP8266 NodeMcu
                //#define USE_UPDATE_SERVICE

                //Включает OTA (Over The Air) возможность загружать новые прошивки по локальной WiFi сети (без использования UART)
                //#define USE_OTA_SERVICE

                #ifdef ARDUINO_ESP32_RELEASE_1_0_4       
                    //Включает в сборку MQTT клиент
                    #define USE_MQTT                
                #endif                
            #endif
    #else
        #define USE_ARDUINO_BOARDS
    #endif
    

#define USE_UART

#include "utils/Utils.h"

//Включить в сборку драйвера 
#define USE_DRIVERS    
    #ifdef USE_DRIVERS
        //Универсальный драйвер исполнительных устройств (цифровых и аналоговых)(с подержкой ШИМ)    
        #define USE_ACTUATOR_DRIVER

        //Универсальный драйвер сенсоров (датчиков)(цифровых и аналоговых)
        #define USE_SENSOR_DRIVER

        //Драйвер цифровых серсоров температуры и влажности (Digital Humidity and Temperature) - DHT11, DTH22 и прочих
        #define USE_DHT_DRIVER

        //Драйвер I2C LCD дисплеев, поддерживает более одного дисплея на шине I2C
        #define USE_LCD_DRIVER

        //Драйвер шаговых двигателей
        #define USE_STEPPER_DRIVER
        
        //Драйвер запорных арматур (закрыть, открыть, положени)
        #define USE_VALVE_DRIVER
    #endif
#endif


//Включить поддержку скриптов
#define USE_SCRIPT
