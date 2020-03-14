/*----------------------------------------------------------------------------
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

#include "UnitProperties.h"
#include "src\Utils\Utils.h"
#include "src\Managers\DriverManager.h"
#include "src\Managers\ScriptManager.h"
#include "src\Managers\FileManager.h"
#include "src\Managers\TransportManager.h"


/*-------------------------------------------------------------------------------------------------------------------------
  Main Setup
  -------------------------------------------------------------------------------------------------------------------------*/
void setup() {  
  Serial.begin(PORTSPEED);  //setup Serial Monitor at PORTSPEED BAUD speed - see Utils.h for Constant definition
  delay(ONETENTHOFSECOND);  //sleep 1/10 of second
  
  debugOut("setup", "started...");//if Utils.h "Debug=true" start writing log to Serial
  
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
  ESP.wdtEnable(ONEMINUTE); //Software watch dog
  //ESP.wdtDisable();
#endif

  filesBegin(); //prepare Flash file systeme (see Tools/Flash size item - use 2M Flash Size, is ZERO size by default -> switch to 2M    
  unitInit();
  driversInit(unitGetTopic()); //prepare onboard Unit's drivers
  scriptsLoad();
  //Setup network stack - WiFi -> after MQTT -- if both available Transport accessable, if not Unit try reconnect forever (every 5 sec by default)
  //Ther is not connected at begin(), see Main::Loop() transportReconnect() function using
  //The begin() just setup connection properties
  transportBegin();
  #ifdef DetailedDebug 
  debugOut("setup", "complete");//if Utils.h "Debug=true" start writing log to Serial
  #endif
  
}

/*-------------------------------------------------------------------------------------------------------------------------
  Main Loop
  -------------------------------------------------------------------------------------------------------------------------*/
void loop() {  
  //check WiFi and MQTT stack are available
  //first time Main::loop() calling the transport is not available
  
  if (!transportAvailable()) //if not connected
  {
    if (transportReconnect()) //DO connection routin, see Transport.cpp
    {
      #ifdef DetailedDebug 
	  debugOut(unitGetUnitId(), "Transport available"); //if HEAD and MQTT Brokker is available setuping drivers
	  #endif
      transportSetCallBack(Callback); //Regist Callback function for loopback subscribed messages (from MQTT Publishers)
      driversBegin(unitGetTopic()); //initilize drivers network properties, each driver must publish() here TYPE and AVAILABLE status
      unitSubscribe();
      //driversSubscribe();  //subscribe() all AVAILABLE drivers to here topics (see: driverID), the topic -> UnitTopic+ESPChipID/DriverId
      
    }
  }
//  else //if network (Transport) to be available
  {
    transportLoop(); //Ping MQTT (at this version MQTT used only, FFR Ping RESTful to
    //give CPU time quantum to each driver. Like are sample -> temperature sensor can check physical sensor value
    driversLoop(); //the driverLoop() more actual for sensors drivers, the actuator drivers wait until Sub()->OnMessage() happens, see Main::Callback(...) function
	//Scripts loop
	scriptsRun();
  }
  
  delay(ONETENTHOFSECOND); //Main::loop() sleep interval
}

/*-------------------------------------------------------------------------------------------------------------------------
  Main Callback
  If MQTT Client recieve published packet with subscrabed topic - this procedure is called ASYNC
  -------------------------------------------------------------------------------------------------------------------------*/
void Callback(char* _topic, byte* _payload, unsigned int length) {

  if (unitGetMQTTAvailable() == 1)
  {
  	#ifdef DetailedDebug 
	debugOut(TransportID, "onMessage topic - " + String(_topic));
	#endif

  	char payload_buff[PayloadBufferSize]; // create character buffer with ending by null terminator (zero string format)
  	int i;
	  //copy byte values to char array (buffer) char by char
	  for (i = 0; i < length; i++)
	  {
	    payload_buff[i] = _payload[i];
	  }
	  payload_buff[i] = '\0'; //terminate string with zero

	  //first check is Unit property?
	  if (unitOnMessage(String(_topic), String(payload_buff), MQTTMask).equals(WrongPropertyName))
	  {
	    //if not UNIT property
	    //Put recieved message to all drivers, each driver can process any topic recieved by Unit
	    driversCallback(String(_topic), String(payload_buff));
	  }
  }

}
