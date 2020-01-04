#include "OTAManager.h"
#include "..\..\UnitProperties.h"
#include "..\Utils\Utils.h"

#define OTAID "OTA"

void OTABegin()
{
   ArduinoOTA.setPort(unitGetOTAPort());
  
   ArduinoOTA.setHostname(unitGetOTAID().c_str());

   ArduinoOTA.setPassword(unitGetOTAPassword().c_str());

  ArduinoOTA.onStart([]() 
  {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) 
    {
      type = "sketch";
    } 
   else 
    { // U_SPIFFS
      type = "filesystem";
    }

    // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
    debugOut(OTAID,"begin updating " + type);
  });

  ArduinoOTA.onEnd([]() 
  {
    debugOut(OTAID,"complete");
  });

  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) 
  {
    int value = progress / (total / 100);
    if (value % 25 == 0)
    {
      debugOut(OTAID, "do update " + String(value) + "%");
    }

  });

  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) {
      debugOut(OTAID,"Auth Failed");
    } else if (error == OTA_BEGIN_ERROR) {
      debugOut(OTAID,"Begin Failed");
    } else if (error == OTA_CONNECT_ERROR) {
      debugOut(OTAID,"Connect Failed");
    } else if (error == OTA_RECEIVE_ERROR) {
      debugOut(OTAID,"Receive Failed");
    } else if (error == OTA_END_ERROR) {
      debugOut(OTAID,"End Failed");
    }
  });
  ArduinoOTA.begin();

}

void OTALoop()
{
    ArduinoOTA.handle();
}
