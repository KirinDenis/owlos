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

	ArduinoOTA.onStart([]() {
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(OTAID, "begin updating " + type);
#endif
#endif
	});

	ArduinoOTA.onEnd([]() {
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(OTAID, "complete");
#endif
#endif
	});

	ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
		int value = progress / (total / 100);
		if (value % 25 == 0)
		{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(OTAID, "do update " + String(value) + "%");
#endif
#endif
		}
	});

	ArduinoOTA.onError([](ota_error_t error) {
#ifdef DETAILED_DEBUG
		if (error == OTA_AUTH_ERROR)
		{
#ifdef DEBUG
			debugOut(OTAID, "Auth Failed");
#endif
		}
		else if (error == OTA_BEGIN_ERROR)
		{
#ifdef DEBUG
			debugOut(OTAID, "Begin Failed");
#endif
		}
		else if (error == OTA_CONNECT_ERROR)
		{
#ifdef DEBUG
			debugOut(OTAID, "Connect Failed");
#endif
		}
		else if (error == OTA_RECEIVE_ERROR)
		{
#ifdef DEBUG
			debugOut(OTAID, "Receive Failed");
#endif
		}
		else if (error == OTA_END_ERROR)
		{
#ifdef DEBUG
			debugOut(OTAID, "End Failed");
#endif
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