#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>

#include "../transports/WebServer.h"
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
		updateLog += downloadFileWithLog("jquery.min.js.gz");
		updateUIStatus = UpdateStatusAtProcess;
		webServerLoop();

		updateLog += downloadFileWithLog("jquery.min.js.gz");
		updateLog += downloadFileWithLog("popper.min.js.gz");
		updateLog += downloadFileWithLog("bootstrap.min.css.gz");
		updateLog += downloadFileWithLog("bootstrap.min.js.gz");
		updateLog += downloadFileWithLog("jquery.dataTables.min.js.gz");
		updateLog += downloadFileWithLog("dataTables.min.css.gz");
		updateLog += downloadFileWithLog("dataTables.min.js.gz");
		webServerLoop();

		updateLog += downloadFileWithLog("ui.css.gz");
		webServerLoop();

		updateLog += downloadFileWithLog("bootcore.js.gz");
		updateLog += downloadFileWithLog("restclientcore.js.gz");
		updateLog += downloadFileWithLog("configcore.js.gz");
		updateLog += downloadFileWithLog("devicescore.js.gz");
		updateLog += downloadFileWithLog("drawcore.js.gz");
		updateLog += downloadFileWithLog("languagescore.js.gz");
		updateLog += downloadFileWithLog("speechcore.js.gz");
		webServerLoop();

		updateLog += downloadFileWithLog("basewidget.js.gz");
		updateLog += downloadFileWithLog("actuatorwidget.js.gz");
		updateLog += downloadFileWithLog("temperaturewidget.js.gz");
		updateLog += downloadFileWithLog("graphwidget.js.gz");
		updateLog += downloadFileWithLog("tablewidget.js.gz");
		updateLog += downloadFileWithLog("lcdwidget.js.gz");
		updateLog += downloadFileWithLog("lightwidget.js.gz");
		updateLog += downloadFileWithLog("lcdwidget.js.gz");
		updateLog += downloadFileWithLog("lightwidget.js.gz");
		updateLog += downloadFileWithLog("motionwidget.js.gz");
		updateLog += downloadFileWithLog("radialwidget.js.gz");
		updateLog += downloadFileWithLog("smokewidget.js.gz");
		updateLog += downloadFileWithLog("stepperwidget.js.gz");
		updateLog += downloadFileWithLog("valuewidget.js.gz");		
		webServerLoop();

		updateLog += downloadFileWithLog("widgetswrappers.js.gz");

		updateLog += downloadFileWithLog("devicesui.js.gz");
		updateLog += downloadFileWithLog("settingsui.js.gz");
		updateLog += downloadFileWithLog("filespanelui.js.gz");
		updateLog += downloadFileWithLog("dashboardui.js.gz");

		updateLog += downloadFileWithLog("index.js.gz");
		updateLog += downloadFileWithLog("index.html.gz");

		updateUIStatus = UpdateStatusComplete;
		updateLog += "update UI complete\n";
		webServerLoop();
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



