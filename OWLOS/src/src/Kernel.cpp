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
#include <core_version.h>

#include "Kernel.h"
#include "drivers/ESPDriver.h"
#include "Managers/DriverManager.h"
#include "Managers/FileManager.h"
#include "Managers/TransportManager.h"
#include "Managers/UpdateManager.h"
#include "Managers/ScriptManager.h"


/*-----------------------------------------------------------------------------
OWLOS Kernel setup section 
------------------------------------------------------------------------------*/

bool kernelSetup()
{
	Serial.begin(PORTSPEED);  //setup Serial Monitor at PORTSPEED BAUD speed - see Utils.h for Constant definition
	delay(ONETENTHOFSECOND);  //sleep 1/10 of second
	Serial.println("");

#if defined(ARDUINO_ESP8266_RELEASE_2_5_0) || defined(ARDUINO_ESP32_RELEASE_1_0_4)

	debugOut("kernel setup", "started...");//if Utils.h "Debug=true" start writing log to Serial

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	ESP.wdtEnable(ONEMINUTE); //Software watch dog
	// ESP.wdtDisable(); //try it for you ESP8266 WDT
#endif

	filesBegin(); //prepare Flash file systeme (see Tools/Flash size item - use 2M Flash Size, is ZERO size by default -> switch to 2M    
	nodeInit();
	driversInit(nodeGetTopic()); //prepare onboard Unit's drivers
	scriptsLoad();
	//Setup network stack - WiFi -> after MQTT -- if both available Transport accessable, if not Unit try reconnect forever (every 5 sec by default)
	//Ther is not connected at begin(), see Main::Loop() transportReconnect() function using
	//The begin() just setup connection properties
	transportBegin();
	//The OWLOS harvester started up and went quietly...
#ifdef DetailedDebug 
	debugOut("kernel setup", "complete");//if Utils.h "Debug=true" start writing log to Serial
#endif
#else
	debugOut("OWLOS kernel", "building problem");
	debugOut("OWLOS kernel", "can's start, please install ESP32 RELEASE 1.0.4 or ESP8266 RELEASE 2.5.0 for building");
	debugOut("ESP32 RELEASE 1.0.4", "https://github.com/espressif/arduino-esp32/releases/tag/1.0.4");
	debugOut("ESP8266 RELEASE 2.5.0", "https://github.com/esp8266/Arduino/releases/tag/2.5.0");
	return false;
#endif
 return true;
}


/*-----------------------------------------------------------------------------
OWLOS Kernel loop section
------------------------------------------------------------------------------*/

bool kernelLoop()
{
#if defined(ARDUINO_ESP8266_RELEASE_2_5_0) || defined(ARDUINO_ESP32_RELEASE_1_0_4)
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	filesLoop();
#endif
	//check WiFi and MQTT stack are available
	//first time Main::loop() calling the transport is not available
	if (!transportAvailable()) //if not connected
	{
		if (transportReconnect()) //DO connection routin, see Transport.cpp
		{
#ifdef DetailedDebug 
			debugOut(nodeGetUnitId(), "Transport available"); //if HEAD and MQTT Brokker is available setuping drivers
#endif			
			driversBegin(nodeGetTopic()); //initilize drivers network properties, each driver must publish() here TYPE and AVAILABLE status
			nodeSubscribe(); //subscribe() all AVAILABLE drivers to here topics (see: driverID), the topic -> UnitTopic+ESPChipID/DriverId
			//driversSubscribe();  
		}
	}
	else //if network (Transport) to be available
	{
		transportLoop(); //Ping MQTT (at this version MQTT used only, FFR Ping RESTful to
	}

	//give CPU time quantum to each driver. Like are sample -> temperature sensor can check physical sensor value
	driversLoop(); //the driverLoop() more actual for sensors drivers, the actuator drivers wait until Sub()->OnMessage() happens, see Main::Callback(...) function
	//Scripts loop
	scriptsRun();
	delay(ONETENTHOFSECOND); //Main::loop() sleep interval
	return true;
#endif
  return false;
}
