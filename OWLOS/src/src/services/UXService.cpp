/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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
#ifndef UX_SERVICE
#define UX_SERVICE

#include <TFT_eSPI.h> // Hardware-specific library
#include <SPI.h>

#include "FileService.h"
#include "../drivers/WifiDriver.h"
#include "../drivers/NetworkDriver.h"

TFT_eSPI tft = TFT_eSPI(); // Invoke custom library with default width and height

#define CENTRE 240
#define WIDTH 480
#define HEIGHT 320

#define GOLD_1 WIDTH
#define GOLD_2 297
#define GOLD_3 184
#define GOLD_4 114
#define GOLD_5 70
#define GOLD_6 43
#define GOLD_7 27
#define GOLD_8 17
#define GOLD_9 11
#define GOLD_10 7
#define GOLD_11 4
#define GOLD_12 3
#define GOLD_13 2
#define GOLD_14 1

#define CALIBRATION_FILE "/TFTCalibration"

void drawArc(int x, int y, int radiusFrom, int radiusTo, double angleFrom, double angleTo, int color)
{
    double xp1, yp1, xp2, yp2;

    for (double radius = radiusFrom; radius < radiusTo; radius += 0.5)
    {
        xp2 = -1;
        for (double angle = angleFrom; angle < angleTo; angle += 0.05)
        {
            xp1 = radius * sin(angle) + x;
            yp1 = radius * cos(angle) + y;

            if (xp2 != -1)
            {
                tft.drawLine(xp1, yp1, xp2, yp2, color);
                tft.drawPixel(xp1, yp1 - 1, 0xAAAA);
                tft.drawPixel(xp1, yp1 + 1, 0xAAAA);
                tft.drawPixel(xp1, yp1, color);
            }

            xp2 = xp1;
            yp2 = yp1;
        }
    }
}

void drawWifiIcon(int x, int y, int dBm)
{
    double angleFrom = 3.14 - 0.7;
    double angleTo = 3.14 + 0.7;

    int color;

    int radius = GOLD_8;

    if (dBm > -50)
    {
        color = TFT_WHITE;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 1, radius - 0, angleFrom, angleTo, color);

    if (dBm > -67)
    {
        color = TFT_WHITE;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 8, radius - 7, angleFrom, angleTo, color);

    if (dBm > -70)
    {
        color = TFT_WHITE;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 15, radius - 14, angleFrom, angleTo, color);

    if (dBm > -80)
    {
        color = TFT_WHITE;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 22, radius - 21, angleFrom, angleTo, color);

    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.drawString(String(dBm) + " dBn", x + GOLD_9, y + GOLD_11, 1);
}

void drawNetworkStatus(int stAvailable, int stStatus, int stdBm, String stSSID, String stIp, String GWIp)
{
    //-----------------------------------
    //WiFi Station
    int statusColor = TFT_GREEN;
    int textColor = TFT_WHITE;
    if (stAvailable != 1)
    {
        statusColor = TFT_RED;
        textColor = TFT_DARKGREY;
    }

    tft.fillRect(0, 0, WIDTH / 2, GOLD_8, TFT_DARKGREY);
    tft.setTextColor(statusColor, TFT_DARKGREY);
    tft.drawString("WiFi Access Point", GOLD_9, GOLD_11, 1);

    drawWifiIcon(GOLD_7, GOLD_7 + GOLD_8, stdBm);

    tft.setTextColor(textColor, TFT_BLACK);
    if (stSSID.length() < 10)
    {
        tft.drawRightString(stSSID, WIDTH / 2 - GOLD_9, GOLD_12 + GOLD_8, 4);
    }
    else
    {
        tft.drawRightString(stSSID, WIDTH / 2 - GOLD_9, GOLD_12 + GOLD_8, 2);
    }
    
    tft.drawRightString("[GW:" + GWIp + "]", WIDTH / 2 - GOLD_9, GOLD_12 + GOLD_7 + GOLD_8, 1);
    tft.drawRightString(stIp, WIDTH / 2 - GOLD_9, GOLD_6 + GOLD_8, 2);

    /*
 	 "0:WL_IDLE_STATUS;"; //default
	 "1:WL_NO_SSID_AVAIL; ";
	 "2:WL_SCAN_COMPLETED;";
	 "3:WL_CONNECTED;";
	 "4:WL_CONNECT_FAILED;";
	 "5:WL_CONNECTION_LOST;";
	 "6:WL_DISCONNECTED;";
*/

    statusColor = TFT_DARKGREY;
    String statusText = "IDLE";

    if (stStatus == 1)
    {
        statusColor = TFT_RED;
        statusText = "NO SSID AVAIL";
    }
    else if (stStatus == 2)
    {
        statusColor = TFT_GREEN;
        statusText = "SCAN COMPLETED";
    }
    else if (stStatus == 3)
    {
        statusColor = TFT_GREEN;
        statusText = "CONNECTED";
    }
    else if (stStatus == 4)
    {
        statusColor = TFT_RED;
        statusText = "CONNECT FAILED";
    }
    else if (stStatus == 5)
    {
        statusColor = TFT_DARKGREY;
        statusText = "CONNECTION LOST";
    }
    else if (stStatus == 6)
    {
        statusColor = TFT_DARKGREY;
        statusText = "DISCONNECTED";
    }

    tft.setTextColor(statusColor, TFT_BLACK);
    tft.drawString(statusText, GOLD_9, GOLD_6 + GOLD_8, 2);

    //-----------------------------------
    //WiFi Access Point
    tft.fillRect(WIDTH / 2, 0, WIDTH / 2, GOLD_8, TFT_DARKGREY);
    tft.setTextColor(TFT_BLACK, TFT_DARKGREY);
    tft.drawString("WiFi Station", WIDTH / 2 + GOLD_9, GOLD_11, 1);

    drawWifiIcon(WIDTH / 2 + GOLD_7, GOLD_7 + GOLD_8, -90);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("OWLOSTHING_A25", WIDTH / 2 + WIDTH / 2 - GOLD_9, GOLD_12 + GOLD_8, 2);

    tft.drawRightString("[WSP2]", WIDTH / 2 + WIDTH / 2 - GOLD_9, GOLD_12 + GOLD_7 + GOLD_8, 1);

    tft.setTextColor(TFT_RED, TFT_BLACK);
    tft.drawString("Disabled", WIDTH / 2 + GOLD_9, GOLD_6 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("192.168.4.1", WIDTH / 2 + WIDTH / 2 - GOLD_9, GOLD_6 + GOLD_8, 2);

    //------------------------------------

    tft.drawFastVLine(WIDTH / 2, 0, GOLD_8, TFT_BLACK);
    tft.drawFastVLine(WIDTH / 2, GOLD_8, GOLD_5, TFT_DARKGREY);
    //tft.drawFastHLine(0, GOLD_5 + GOLD_8, WIDTH, TFT_WHITE);

    //------------------------------------
    //HTTP Server
    int hOffset = GOLD_5 + GOLD_8;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, TFT_DARKGREY);
    tft.setTextColor(TFT_GREEN, TFT_DARKGREY);
    tft.drawString("HTTP(S) Server", GOLD_9, hOffset + GOLD_11, 1);

    //HTTP Station
    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.drawString("Enabled", GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.drawRightString("http://192.168.1.101:80", WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("send: 203Kb recv: 10Kb", WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8, 2);

    //HTTPS Station
    tft.setTextColor(TFT_RED, TFT_BLACK);
    tft.drawString("Disable", GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8, 2);

    tft.setTextColor(0xAAAA, TFT_BLACK);
    tft.drawRightString("https://192.168.1.101:443", WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("send: --- recv: ---", WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8 + GOLD_8, 2);

    //HTTP Access Point
    tft.setTextColor(TFT_RED, TFT_BLACK);
    tft.drawString("N/A", WIDTH / 2 + GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(0xAAAA, TFT_BLACK);
    tft.drawRightString("http://192.168.4.1:80", WIDTH / 2 + WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("send: --- recv: ---", WIDTH / 2 + WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8, 2);

    //HTTPS Access Point
    tft.setTextColor(TFT_RED, TFT_BLACK);
    tft.drawString("N/A", WIDTH / 2 + GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8, 2);

    tft.setTextColor(0xAAAA, TFT_BLACK);
    tft.drawRightString("https://192.168.4.1:443", WIDTH / 2 + WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("send: --- recv: ---", WIDTH / 2 + WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8 + GOLD_8, 2);

    //------------------------------------
    tft.drawFastVLine(WIDTH / 2, hOffset, GOLD_8, TFT_BLACK);
    tft.drawFastVLine(WIDTH / 2, hOffset + GOLD_8, GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8 + GOLD_8, TFT_DARKGREY);
    //------------------------------------
    //HTTP(S) Client
    hOffset += GOLD_12 + GOLD_8 + GOLD_8 + GOLD_8 + GOLD_8 + GOLD_8;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, TFT_DARKGREY);
    tft.setTextColor(TFT_GREEN, TFT_DARKGREY);
    tft.drawString("HTTP(S) Client", GOLD_9, hOffset + GOLD_11, 1);

    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.drawString("Enabled", GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.drawRightString("https://owlos.org:443", WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.drawString("connect", WIDTH / 2 + GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("send: 103Kb recv: 12Kb", WIDTH / 2 + WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    //MQTT Client
    hOffset += GOLD_12 + GOLD_8 + GOLD_8;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, TFT_DARKGREY);
    tft.setTextColor(TFT_GREEN, TFT_DARKGREY);
    tft.drawString("MQTT Client", GOLD_9, hOffset + GOLD_11, 1);

    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.drawString("Enabled", GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.drawRightString("owlos.org:1883", WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.drawString("connect", WIDTH / 2 + GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("send: 103Kb recv: 12Kb", WIDTH / 2 + WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    //UART 1
    hOffset += GOLD_12 + GOLD_8 + GOLD_8;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, TFT_DARKGREY);
    tft.setTextColor(TFT_GREEN, TFT_DARKGREY);
    tft.drawString("UART 1 (RX/TX)", GOLD_9, hOffset + GOLD_11, 1);

    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.drawString("Enabled", GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.drawRightString("9600 bad", WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);

    tft.setTextColor(TFT_DARKGREY, TFT_BLACK);
    tft.drawRightString("send: 103Kb recv: 12Kb", WIDTH / 2 + WIDTH / 2 - GOLD_9, hOffset + GOLD_12 + GOLD_8, 2);
}

//------------------------------------------------------------------------------------------
//Init
bool UXServiceInit()
{

    // Setup the LCD
    tft.init();
    tft.setRotation(1);
    tft.fillScreen(TFT_BLACK);

    uint16_t calibrationData[5];    

    if (filesExists(CALIBRATION_FILE "0"))
    {
        calibrationData[0] = filesReadInt(CALIBRATION_FILE "0");
        calibrationData[1] = filesReadInt(CALIBRATION_FILE "1");
        calibrationData[2] = filesReadInt(CALIBRATION_FILE "2");
        calibrationData[3] = filesReadInt(CALIBRATION_FILE "3");
        calibrationData[4] = filesReadInt(CALIBRATION_FILE "4");
        tft.setTouch(calibrationData);
    }
    else
    {
        // data not valid. recalibrate
        tft.calibrateTouch(calibrationData, TFT_WHITE, TFT_RED, 15);
        filesWriteInt(CALIBRATION_FILE "0", calibrationData[0]);
        filesWriteInt(CALIBRATION_FILE "1", calibrationData[1]);
        filesWriteInt(CALIBRATION_FILE "2", calibrationData[2]);
        filesWriteInt(CALIBRATION_FILE "3", calibrationData[3]);
        filesWriteInt(CALIBRATION_FILE "4", calibrationData[4]);
    }

    drawNetworkStatus(thingGetWiFiAvailable(), thingGetWiFiStatus(), thingGetWiFiRSSI(), thingGetWiFiSSID(), thingGetWiFiIP(), String(thingGetWiFiIsConnected()));
    return true;
}

int hs1 = 200;
int hr1 = 10;

int hs2 = 10;
int hr2 = 0;

void UXServiceLoop()
{
    //void drawNetworkStatus(bool stAvailable, int stdBm, String stSSID, String stSec, String stIp, String stStatus)
    thingGetConnectedWiFiSSID();
    drawNetworkStatus(thingGetWiFiAvailable(), thingGetWiFiStatus(), thingGetWiFiRSSI(), thingGetWiFiSSID(), thingGetWiFiIP(), thingGetWiFiGateWayIP());
}

#endif
