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
#include "UpdateService.h"
#ifdef USE_UPDATE_SERVICE
#ifdef USE_ESP_DRIVER

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <HTTPClient.h>
#include <HTTPUpdate.h>
HTTPUpdate ESPhttpUpdate;
#endif

#include "../drivers/ESPDriver.h"
#include "../transports/HTTPSWebServer.h"
#include "../transports/HTTPWebClient.h"
#include "../services/FileService.h"

#define updateid "update"

#define UpdateInfoFile "updateinfo.html"

#define UpdateNotBegin -2
#define UpdateNOT_AVAILABLE -1
#define UpdateServerNOT_AVAILABLE 0
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

#define UPDATE_SKIP_COUNT 200

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
	if (nodeGetUpdateAvailable() != 1)
	{
		updatePossible = UpdateNOT_AVAILABLE;
	}
	else
	{
		skipLoopCount++;
		if (skipLoopCount > UPDATE_SKIP_COUNT)
		{
			skipLoopCount = 0;
			if (!downloadFile(UpdateInfoFile, nodeGetUpdateHost() + UpdateInfoFile))
			{
				updatePossible = UpdateServerNOT_AVAILABLE;
			}
			else
			{
				//update info downloaded OK
				updateInfo = filesReadString(UpdateInfoFile);
				if (nodeGetESPBootMode() > 0) //booting with hardware reset
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

#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(updateid, "check update possible result: " + String(updatePossible));
#endif
#endif
	return updatePossible;
}

int updateGetUpdateUIStatus()
{
	return updateUIStatus;
}

String downloadFileWithLog(String fileName)
{
	String host = nodeGetUpdateHost();
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
		updateLog = F("update UI started\n");
		updateUIStatus = UpdateStatusStarted;
		updateLog += downloadFileWithLog(F("jquery.min.js.gz"));
		updateUIStatus = UpdateStatusAtProcess;
#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerLoop();
#endif

		updateLog += downloadFileWithLog(F("jquery.min.js.gz"));
		updateLog += downloadFileWithLog(F("popper.min.js.gz"));
		updateLog += downloadFileWithLog(F("bootstrap.min.css.gz"));
		updateLog += downloadFileWithLog(F("bootstrap.min.js.gz"));
		updateLog += downloadFileWithLog(F("jquery.dataTables.min.js.gz"));
		updateLog += downloadFileWithLog(F("dataTables.min.css.gz"));
		updateLog += downloadFileWithLog(F("dataTables.min.js.gz"));
#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerLoop();
#endif

		updateLog += downloadFileWithLog(F("ui.css.gz"));
#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerLoop();
#endif

		updateLog += downloadFileWithLog(F("bootcore.js.gz"));
		updateLog += downloadFileWithLog(F("restclientcore.js.gz"));
		updateLog += downloadFileWithLog(F("configcore.js.gz"));
		updateLog += downloadFileWithLog(F("driverscore.js.gz"));
		updateLog += downloadFileWithLog(F("drawcore.js.gz"));
		updateLog += downloadFileWithLog(F("languagescore.js.gz"));
		updateLog += downloadFileWithLog(F("speechcore.js.gz"));
		updateLog += downloadFileWithLog(F("scriptcore.js.gz"));
#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerLoop();
#endif

		updateLog += downloadFileWithLog(F("basewidget.js.gz"));
		updateLog += downloadFileWithLog(F("actuatorwidget.js.gz"));
		updateLog += downloadFileWithLog(F("temperaturewidget.js.gz"));
		updateLog += downloadFileWithLog(F("graphwidget.js.gz"));
		updateLog += downloadFileWithLog(F("tablewidget.js.gz"));
		updateLog += downloadFileWithLog(F("lcdwidget.js.gz"));
		updateLog += downloadFileWithLog(F("lightwidget.js.gz"));
		updateLog += downloadFileWithLog(F("lcdwidget.js.gz"));
		updateLog += downloadFileWithLog(F("lightwidget.js.gz"));
		updateLog += downloadFileWithLog(F("motionwidget.js.gz"));
		updateLog += downloadFileWithLog(F("radialwidget.js.gz"));
		updateLog += downloadFileWithLog(F("smokewidget.js.gz"));
		updateLog += downloadFileWithLog(F("stepperwidget.js.gz"));
		updateLog += downloadFileWithLog(F("valuewidget.js.gz"));
#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
		HTTPSWebServerLoop();
#endif
		updateLog += downloadFileWithLog(F("widgetswrappers.js.gz"));

		updateLog += downloadFileWithLog(F("driversui.js.gz"));
		updateLog += downloadFileWithLog(F("settingsui.js.gz"));
		updateLog += downloadFileWithLog(F("filespanelui.js.gz"));
		updateLog += downloadFileWithLog(F("dashboardui.js.gz"));

		updateLog += downloadFileWithLog(F("index.js.gz"));
		updateLog += downloadFileWithLog(F("index.html.gz"));

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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(updateid, "Update firmware started\n");
#endif
#endif
		String host = nodeGetUpdateHost();
		WiFiClient client;

#ifdef LED_BUILTIN
		ESPhttpUpdate.setLedPin(LED_BUILTIN, LOW);
#endif
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

		switch (ret)
		{
		case HTTP_UPDATE_FAILED:
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(updateid, "update error: [" + String(ESPhttpUpdate.getLastError()) + "] " + ESPhttpUpdate.getLastErrorString().c_str());
#endif
#endif
			break;
		case HTTP_UPDATE_NO_UPDATES:
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(updateid, "no updates");
#endif
#endif
			break;
		case HTTP_UPDATE_OK:
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(updateid, "update OK");
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(updateid, "Update firmware fail");
#endif
#endif
		updateLog += "update firmware fail\n";
	}
	return 0;
}

#endif
#endif
