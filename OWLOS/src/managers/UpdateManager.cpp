#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>

#include "../transports/WebClient.h"
#include "../managers/FileManager.h"
#include "../../UnitProperties.h"

#define updateid "update"

#define UpdateInfoFile "updateinfo.html"

#define UpdateNotBegin -2
#define UpdateNotAvailable -1
#define UpdateServerNotAvailable 0
#define UpdateOnlyUI 1
#define UpdateBoth 2



//-2 no getUpdatePossible is called
//-1 not possible, available disable
//0 not possible server not available
//1 possible only UI, need Reset
//2 possible both firmware and UI
int updatePossible = UpdateNotBegin;

String updateLog("[not started, check update possible]");

#define UpdateStatusStarted 0
#define UpdateStatusAtProcess 1
#define UpdateStatusComplete 2
#define UpdateStatusUndefined 3

int updateUIStatus = UpdateStatusUndefined;

int updateFirmwareStatus = UpdateStatusUndefined;

#define DefaultUpdateInfo "[none]"
String updateInfo(DefaultUpdateInfo);

String updateGetUpdateLog()
{
	return updateLog;
}

String updateGetUpdateInfo()
{
	return updateInfo;
}


int updateGetUpdatePossible()
{
	if (unitGetUpdateAvailable() != 1)
	{
		updatePossible = UpdateNotAvailable;
	}
	else
	{
		if (!downloadFile(UpdateInfoFile, unitGetUpdateHost() + UpdateInfoFile))
		{
			updatePossible = UpdateServerNotAvailable;
		}
		else
		{  
			//update info downloaded OK
			updateInfo = filesReadString(UpdateInfoFile);
			if (unitGetESPBootMode() > 0) //booting with hardware reset
			{
				updatePossible = UpdateBoth;
			}
			else
			{ //software or other boot				
				updatePossible = UpdateOnlyUI;
			}
		}
	}
	debugOut(updateid, "check update possible result: " + String(updatePossible));
	return updatePossible;
}

int updateGetUpdateUIStatus()
{
	return updateUIStatus;
}

String downloadFileWithLog(String fileName)
{
	String host = unitGetUpdateHost();
	int result = downloadFile(fileName, host + fileName);
	if (result == 1)
	{
		return host + fileName + " OK"  + "\n";
	}
	else
	{
		return host + fileName + " fail" + "\n";
	}	
}

String updateUI()
{
	if (updateGetUpdatePossible() > 0)
	{
		updateLog = "update UI started\n";
		updateUIStatus = UpdateStatusStarted;
		updateLog += downloadFileWithLog("actuatorindicator.js.gz");
		updateUIStatus = UpdateStatusAtProcess;
		updateLog += downloadFileWithLog("baseindicator.js.gz");
		updateLog += downloadFileWithLog("boot.js.gz");
		updateLog += downloadFileWithLog("bootstrap.min.css.gz");
		updateLog += downloadFileWithLog("bootstrap.min.js.gz");
		updateLog += downloadFileWithLog("client.js.gz");
		updateLog += downloadFileWithLog("custom.css.gz");
		updateLog += downloadFileWithLog("dataTables.min.css.gz");
		updateLog += downloadFileWithLog("dataTables.min.js.gz");
		updateLog += downloadFileWithLog("devices.js.gz");
		updateLog += downloadFileWithLog("devicesproperties.js.gz");
		updateLog += downloadFileWithLog("draw.js.gz");
		updateLog += downloadFileWithLog("files.js.gz");
		updateLog += downloadFileWithLog("index.html.gz");
		updateLog += downloadFileWithLog("index.js.gz");
		updateLog += downloadFileWithLog("jquery.dataTables.min.js.gz");
		updateLog += downloadFileWithLog("jquery.min.js.gz");
		updateLog += downloadFileWithLog("language.js.gz");
		updateLog += downloadFileWithLog("lcdindicator.js.gz");
		updateLog += downloadFileWithLog("lightindicator.js.gz");
		updateLog += downloadFileWithLog("lcdindicator.js.gz");
		updateLog += downloadFileWithLog("lightindicator.js.gz");
		updateLog += downloadFileWithLog("motionindicator.js.gz");
		updateLog += downloadFileWithLog("popper.min.js.gz");
		updateLog += downloadFileWithLog("radialindicator.js.gz");
		updateLog += downloadFileWithLog("smokeindicator.js.gz");
		updateLog += downloadFileWithLog("speech.js.gz");
		updateLog += downloadFileWithLog("stepperindicator.js.gz");
		updateLog += downloadFileWithLog("temperatureindicator.js.gz");
		updateLog += downloadFileWithLog("graphindicator.js.gz");
		updateLog += downloadFileWithLog("webproperties.js.gz");
		updateLog += downloadFileWithLog("tableindicator.js.gz");
		updateUIStatus = UpdateStatusComplete;
		updateLog += "update UI complete\n";
	}
	else
	{
		updateUIStatus = UpdateStatusUndefined;
		updateLog += "Update UI unpossible\n";
	}
	return updateLog;
}

int updateGetUpdateFirmwareStatus()
{
	return updateFirmwareStatus;
}

int updateFirmware()
{
	if (updateGetUpdatePossible() > 1)
	{
		updateLog += "update firmware started\n";
		updateFirmwareStatus = UpdateStatusStarted;
		debugOut(updateid, "Update firmware started\n");
		String host = unitGetUpdateHost();
		WiFiClient client;
		ESPhttpUpdate.setLedPin(LED_BUILTIN, LOW);
		t_httpUpdate_return ret = HTTP_UPDATE_NO_UPDATES;
		updateFirmwareStatus = UpdateStatusAtProcess;

#ifdef ARDUINO_ESP8266_NODEMCU
		ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.nodemcu.bin");
#endif

#ifdef ARDUINO_ESP8266_WEMOS_D1R1
		ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.d1.bin");
#endif

#ifdef ARDUINO_ESP8266_WEMOS_D1MINI
		ret = ESPhttpUpdate.update(client, host + "OWLOS.ino.d1_mini.bin");
#endif

		switch (ret) {
		case HTTP_UPDATE_FAILED:
			debugOut(updateid, "update error: [" + String(ESPhttpUpdate.getLastError()) + "] " + ESPhttpUpdate.getLastErrorString().c_str());
			break;
		case HTTP_UPDATE_NO_UPDATES:
			debugOut(updateid, "no updates");
			break;
		case HTTP_UPDATE_OK:
			debugOut(updateid, "update OK");
			break;
		}
		updateFirmwareStatus = UpdateStatusComplete;
		updateLog += "update firmware complete";
		return 1;
	}
	else
	{
		updateFirmwareStatus = UpdateStatusUndefined;
		debugOut(updateid, "Update firmware fail");
		updateLog += "update firmware fail\n";
	}
	return 0;
}



