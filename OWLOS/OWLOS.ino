/***
  version 1.7 beta 
  -------------------------------------------------------------------------------------------------------------------------
  Ready IoT Solution OWLOS 
  (c) Konstantin Brul, Vitalii Glushchenko, Denys Melnychuk, Denis Kirin


  ------------------------------------------------------------------------------------------------------------------------*/

#include "UnitProperties.h"
#include "src\Utils\Utils.h"
#include "src\Managers\DeviceManager.h"
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
  //ESP.wdtEnable(0); //Software watch dog
  ESP.wdtDisable();

  scriptsLoad();

  filesBegin(); //prepare Flash file systeme (see Tools/Flash size item - use 2M Flash Size, is ZERO size by default -> switch to 2M  
  unitInit();
  devicesInit(unitGetTopic()); //prepare onboard Unit's devices

  //Setup network stack - WiFi -> after MQTT -- if both available Transport accessable, if not Unit try reconnect forever (every 5 sec by default)
  //Ther is not connected at begin(), see Main::Loop() transportReconnect() function using
  //The begin() just setup connection properties
  transportBegin();
  debugOut("setup", "complete");//if Utils.h "Debug=true" start writing log to Serial
}

/*-------------------------------------------------------------------------------------------------------------------------
  Main Loop
  -------------------------------------------------------------------------------------------------------------------------*/
void loop() {
  scriptsRun();
  //check WiFi and MQTT stack are available
  //first time Main::loop() calling the transport is not available
  if (!transportAvailable()) //if not connected
  {
    if (transportReconnect()) //DO connection routin, see Transport.cpp
    {
      debugOut(unitGetUnitId(), "Transport available"); //if HEAD and MQTT Brokker is available setuping devices
      transportSetCallBack(Callback); //Regist Callback function for loopback subscribed messages (from MQTT Publishers)
      devicesBegin(unitGetTopic()); //initilize devices network properties, each device must publish() here TYPE and AVAILABLE status
      unitSubscribe();
      //devicesSubscribe();  //subscribe() all AVAILABLE devices to here topics (see: deviceID), the topic -> UnitTopic+ESPChipID/DeviceId
      
    }
    else //if can't connect to transport
    {
      debugOut(unitGetUnitId(), "Transport NOT available, check network connection, WiFi and URLs at Unit properties");
    }
  }
//  else //if network (Transport) to be available
  {
    transportLoop(); //Ping MQTT (at this version MQTT used only, FFR Ping RESTful to
    //give CPU time quantum to each device. Like are sample -> temperature sensor can check physical sensor value
    devicesLoop(); //the deviceLoop() more actual for sensors devices, the actuator devices wait until Sub()->OnMessage() happens, see Main::Callback(...) function

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
  	debugOut(TransportID, "onMessage topic - " + String(_topic));

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
	    //Put recieved message to all devices, each device can process any topic recieved by Unit
	    devicesCallback(String(_topic), String(payload_buff));
	  }
  }
}
