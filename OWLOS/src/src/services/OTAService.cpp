//Оригинальный код:
//https://github.com/esp8266/Arduino/tree/master/libraries/ArduinoOTA/examples/BasicOTA
//https://github.com/esp8266/Arduino/blob/master/LICENSE


#include "OTAService.h"
#ifdef USE_OTA_SERVICE
#ifdef USE_ESP_DRIVER
#include "../drivers/ESPDriver.h"
#include "../Utils\Utils.h"

#define OTAID "OTA"

void OTABegin()
{
	ArduinoOTA.setPort(nodeGetOTAPort());

	ArduinoOTA.setHostname(nodeGetOTAID().c_str());

	ArduinoOTA.setPassword(nodeGetOTAPassword().c_str());

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
#ifdef DetailedDebug 
		debugOut(OTAID, "begin updating " + type);
#endif
	});

	ArduinoOTA.onEnd([]()
	{
#ifdef DetailedDebug 
		debugOut(OTAID, "complete");
#endif
	});

	ArduinoOTA.onProgress([](unsigned int progress, unsigned int total)
	{
		int value = progress / (total / 100);
		if (value % 25 == 0)
		{
#ifdef DetailedDebug 
			debugOut(OTAID, "do update " + String(value) + "%");
#endif
		}

	});

	ArduinoOTA.onError([](ota_error_t error) {
#ifdef DetailedDebug 
		
		if (error == OTA_AUTH_ERROR) {
			debugOut(OTAID, "Auth Failed");
		}
		else if (error == OTA_BEGIN_ERROR) {
			debugOut(OTAID, "Begin Failed");
		}
		else if (error == OTA_CONNECT_ERROR) {
			debugOut(OTAID, "Connect Failed");
		}
		else if (error == OTA_RECEIVE_ERROR) {
			debugOut(OTAID, "Receive Failed");
		}
		else if (error == OTA_END_ERROR) {
			debugOut(OTAID, "End Failed");
		}
#endif
	});
	ArduinoOTA.begin();

}

void OTALoop()
{
	ArduinoOTA.handle();
}
#endif
#endif