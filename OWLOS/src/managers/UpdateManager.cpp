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
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <HTTPClient.h>
#include <HTTPUpdate.h>
HTTPUpdate ESPhttpUpdate;
#endif


#include <Arduino.h>

#include "../transports/HTTPServer.h"
#include "../transports/WebClient.h"
#include "../managers/FileManager.h"
#include "../utils/GPIOMap.h"
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
byte updatePossible = UpdateNotBegin;

String updateLog("[not started, check update possible]");

#define UpdateStatusStarted 0
#define UpdateStatusAtProcess 1
#define UpdateStatusComplete 2
#define UpdateStatusUndefined 3

byte updateUIStatus = UpdateStatusUndefined;
byte updateFirmwareStatus = UpdateStatusUndefined;

#define UPDATE_SKIP_COUNT 20

byte skipLoopCount = 0;

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
		skipLoopCount++;
		if (skipLoopCount > UPDATE_SKIP_COUNT)
		{
			skipLoopCount = 0;
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
	}

#ifdef DetailedDebug 
	debugOut(updateid, "check update possible result: " + String(updatePossible));
#endif
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
		return host + fileName + " OK" + "\n";
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
		HTTPServerLoop();

		updateLog += downloadFileWithLog("jquery.min.js.gz");
		updateLog += downloadFileWithLog("popper.min.js.gz");
		updateLog += downloadFileWithLog("bootstrap.min.css.gz");
		updateLog += downloadFileWithLog("bootstrap.min.js.gz");
		updateLog += downloadFileWithLog("jquery.dataTables.min.js.gz");
		updateLog += downloadFileWithLog("dataTables.min.css.gz");
		updateLog += downloadFileWithLog("dataTables.min.js.gz");
		HTTPServerLoop();

		updateLog += downloadFileWithLog("ui.css.gz");
		HTTPServerLoop();

		updateLog += downloadFileWithLog("bootcore.js.gz");
		updateLog += downloadFileWithLog("restclientcore.js.gz");
		updateLog += downloadFileWithLog("configcore.js.gz");
		updateLog += downloadFileWithLog("driverscore.js.gz");
		updateLog += downloadFileWithLog("drawcore.js.gz");
		updateLog += downloadFileWithLog("languagescore.js.gz");
		updateLog += downloadFileWithLog("speechcore.js.gz");
		updateLog += downloadFileWithLog("scriptcore.js.gz");
		HTTPServerLoop();

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
		HTTPServerLoop();

		updateLog += downloadFileWithLog("widgetswrappers.js.gz");

		updateLog += downloadFileWithLog("driversui.js.gz");
		updateLog += downloadFileWithLog("settingsui.js.gz");
		updateLog += downloadFileWithLog("filespanelui.js.gz");
		updateLog += downloadFileWithLog("dashboardui.js.gz");

		updateLog += downloadFileWithLog("index.js.gz");
		updateLog += downloadFileWithLog("index.html.gz");

		updateUIStatus = UpdateStatusComplete;
		updateLog += "update UI complete\n";
		HTTPServerLoop();
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
#ifdef DetailedDebug 
		debugOut(updateid, "Update firmware started\n");
#endif
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
#ifdef DetailedDebug 
			debugOut(updateid, "update error: [" + String(ESPhttpUpdate.getLastError()) + "] " + ESPhttpUpdate.getLastErrorString().c_str());
#endif
			break;
		case HTTP_UPDATE_NO_UPDATES:
#ifdef DetailedDebug 
			debugOut(updateid, "no updates");
#endif
			break;
		case HTTP_UPDATE_OK:
#ifdef DetailedDebug 
			debugOut(updateid, "update OK");
#endif
			break;
		}
		updateFirmwareStatus = UpdateStatusComplete;
		updateLog += "update firmware complete";
		return 1;
	}
	else
	{
		updateFirmwareStatus = UpdateStatusUndefined;
#ifdef DetailedDebug 
		debugOut(updateid, "Update firmware fail");
#endif
		updateLog += "update firmware fail\n";
	}
	return 0;
}



