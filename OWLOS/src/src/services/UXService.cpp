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
#include "../utils/colors.h"
#include "../drivers/WifiDriver.h"
#include "../drivers/NetworkDriver.h"
#include "../drivers/ESPDriver.h"

#ifdef USE_HTTP_CLIENT
#include "../transports/HTTPWebClient.h"
#endif

#ifdef USE_MQTT
#include "../transports/MQTTClient.h"
#endif

#ifdef USE_UART
#include "../transports/UART.h"
#endif

TFT_eSPI tft = TFT_eSPI(); // Invoke custom library with default width and height
unsigned long lastSavedTickCount = 0;

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

#define OWLOSPrimaryColor rgb32_to_rgb16(0x6faeca)
#define OWLOSSecondaryColor rgb32_to_rgb16(0x213944)
#define OWLOSSuccessColor rgb32_to_rgb16(0x43ca15)
#define OWLOSInfoColor rgb32_to_rgb16(0x3c83a4)
#define OWLOSWarningColor rgb32_to_rgb16(0xdd7815)
#define OWLOSDangerColor rgb32_to_rgb16(0xdd2415)
#define OWLOSLightColor rgb32_to_rgb16(0xf4f9f4)
#define OWLOSDarkColor rgb32_to_rgb16(0x141515)

#define CONNECTED_STATUS "[connected]"
#define ONLINE_STATUS "[online]"
#define DISCONNECTED_STATUS "[disconnected]"
#define ERROR_STATUS "[error]"
#define AVAILABLE_STATUS "[available]"
#define DISABLED_STATUS "[disabled]"

#define CALIBRATION_FILE "/TFTCalibration"
/* ------------------------------------------------------
Класс рисует один item 
Вводная:
- 4 колонки на весь экран
- Gold8 высота одной строчки
- align 
  |col1          |col2       |col3          |col4       |
  |Left          |      Right|Left          |      Right|
         
*/
class TextItemClass
{
private:
    bool leftAlign = true;
    int size = 1;
    int fgColor = OWLOSLightColor;
    int bgColor = OWLOSDarkColor;
    String text = "";

    void drawText()
    {
        if (leftAlign)
        {
            tft.drawString(text, x, y, size);
        }
        else
        {
            tft.drawRightString(text, x, y, size);
        }
    }

public:
    int x;
    int y;
    //column - 1,2,3,4
    //         0,2 - align left  (0, width / 2)
    //         1,3 - align right (width / 2, width)
    //row --> row * Glod8 = y
    TextItemClass(int column, int row)
    {
        if (column == 0)
        {
            x = GOLD_9;
        }
        else if (column == 2)
        {
            x = (WIDTH / 2) + GOLD_9;
        }
        else
        {
            leftAlign = false;
            if (column == 1)
            {
                x = WIDTH / 2;
            }
            else
            {
                x = WIDTH;
            }
            x -= GOLD_9;
        }
        y = row * GOLD_8 + GOLD_11;
    }

    void draw(String _text, int _fgColor, int _bgColor, int _size)
    {
        //если текст не совпадает - закрываем предидущий текст цветом предидущего фона
        if ((!_text.equals(text)) || (_size != size))
        {
            tft.setTextColor(bgColor, bgColor);
            drawText();
        }
        //если один из параметров текстра изменился, перерисовываем с новыми параметрами
        if ((!_text.equals(text)) || (fgColor != _fgColor) || (bgColor != _bgColor) || (_size != size))
        {
            text = _text;
            fgColor = _fgColor;
            bgColor = _bgColor;
            size = _size;
            tft.setTextColor(fgColor, bgColor);
            drawText();
        }
    }
};

//--------------------------------------------------------------------------------------------------
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
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 1, radius - 0, angleFrom, angleTo, color);

    if (dBm > -67)
    {
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 8, radius - 7, angleFrom, angleTo, color);

    if (dBm > -70)
    {
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 15, radius - 14, angleFrom, angleTo, color);

    if (dBm > -80)
    {
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 22, radius - 21, angleFrom, angleTo, color);

    //tft.setTextColor(OWLOSLightColor, OWLOSDarkColor);
    //tft.drawString(String(dBm) + " dBn", x + GOLD_9, y + GOLD_11, 1);
}

//------------------------------------------------------------------------------------------------------
//TextItems
TextItemClass stHeaderItem(0, 0);
TextItemClass stSSIDItem(1, 1);
TextItemClass stGWIPItem(1, 2);
TextItemClass stIPItem(1, 3);
TextItemClass stdBmItem(0, 2);
TextItemClass stStatusItem(0, 3);

TextItemClass apHeaderItem(2, 0);
TextItemClass apSSIDItem(3, 1);
TextItemClass apIPItem(3, 3);
TextItemClass apStatusItem(2, 3);

//HTTP(S) Server Items
TextItemClass hsHeaderItem(0, 4);
TextItemClass hsStStatusItem(0, 5);
TextItemClass hsStIPItem(1, 5);
TextItemClass hssStStatusItem(0, 6);
TextItemClass hssStIPItem(1, 6);
TextItemClass hsApStatusItem(2, 5);
TextItemClass hsApIPItem(3, 5);
TextItemClass hssApStatusItem(2, 6);
TextItemClass hssApIPItem(3, 6);

//HTTP Client
TextItemClass hcHeaderItem(0, 7);
TextItemClass hcHeaderSendItem(2, 7);
TextItemClass hcHeaderRecvItem(3, 7);
TextItemClass hcStatusItem(0, 8);
TextItemClass hcServerIPItem(1, 8);
TextItemClass hcSendItem(2, 8);
TextItemClass hcRecvItem(3, 8);

//MQTT Client
TextItemClass mqttHeaderItem(0, 9);
TextItemClass mqttHeaderSendItem(2, 9);
TextItemClass mqttHeaderRecvItem(3, 9);
TextItemClass mqttStatusItem(0, 10);
TextItemClass mqttServerIPItem(1, 10);
TextItemClass mqttSendItem(2, 10);
TextItemClass mqttRecvItem(3, 10);

//UART Client
TextItemClass uartHeaderItem(0, 11);
TextItemClass uartHeaderSendItem(2, 11);
TextItemClass uartHeaderRecvItem(3, 11);
TextItemClass uartStatusItem(0, 12);
TextItemClass uartSpeedItem(1, 12);
TextItemClass uartSendItem(2, 12);
TextItemClass uartRecvItem(3, 12);

TextItemClass systemHeaderItem(0, 13);
TextItemClass systemHeaderLoopItem(1, 13);
TextItemClass systemHeaderLifeTimeItem(2, 13);
TextItemClass systemHeaderHeapItem(3, 13);

TextItemClass systemIdItem(0, 14);
TextItemClass systemLoopItem(1, 14);
TextItemClass systemLifeTimeItem(2, 14);
TextItemClass systemHeapItem(3, 14);

void initDrawNetworkStatus()
{
    tft.fillRect(0, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.fillRect(WIDTH / 2, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.drawFastVLine(WIDTH / 2, 0, GOLD_8, OWLOSDarkColor);
    tft.drawFastVLine(WIDTH / 2, GOLD_8, GOLD_5, OWLOSSecondaryColor);

    int hOffset = GOLD_8 * 4 + GOLD_11;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, OWLOSSecondaryColor);
    tft.drawFastVLine(WIDTH / 2, hOffset, GOLD_8, OWLOSDarkColor);
    tft.drawFastVLine(WIDTH / 2, hOffset + GOLD_8, GOLD_8 * 2, OWLOSSecondaryColor);

    hOffset += GOLD_8 * 3;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, OWLOSSecondaryColor);
    hOffset += GOLD_8 * 2;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, OWLOSSecondaryColor);
    hOffset += GOLD_8 * 2;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, OWLOSSecondaryColor);
    hOffset += GOLD_8 * 2;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, OWLOSSecondaryColor);

    stGWIPItem.y += GOLD_10;
    stdBmItem.x += GOLD_7;
    stdBmItem.y += GOLD_10;

    hsHeaderItem.y += GOLD_11;

    hcHeaderRecvItem.y = hcHeaderSendItem.y = hcHeaderItem.y += GOLD_11;
    hcHeaderSendItem.draw("send", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    hcHeaderRecvItem.draw("recv", OWLOSWarningColor, OWLOSSecondaryColor, 1);

    mqttHeaderRecvItem.y = mqttHeaderSendItem.y = mqttHeaderItem.y += GOLD_11;
    mqttHeaderSendItem.draw("send", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    mqttHeaderRecvItem.draw("recv", OWLOSWarningColor, OWLOSSecondaryColor, 1);

    uartHeaderRecvItem.y = uartHeaderSendItem.y = uartHeaderItem.y += GOLD_11;
    uartHeaderSendItem.draw("send", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    uartHeaderRecvItem.draw("recv", OWLOSWarningColor, OWLOSSecondaryColor, 1);

    systemHeaderItem.y = systemHeaderLoopItem.y = systemHeaderLifeTimeItem.y = systemHeaderHeapItem.y += GOLD_11;
    systemHeaderItem.draw("System", OWLOSLightColor, OWLOSSecondaryColor, 1);
    systemHeaderLoopItem.draw("loop", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    systemHeaderLifeTimeItem.draw("life time", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    systemHeaderHeapItem.draw("heap", OWLOSWarningColor, OWLOSSecondaryColor, 1);
}
//-----------------------------------
String convertingByteToString(int bytesCount)
{
    if (bytesCount > 1024 * 1024 * 1024)
    {
        return String(bytesCount / (1024 * 1024 * 1024)) + " Gb";
    }
    else if (bytesCount > 1024 * 1024)
    {
        return String(bytesCount / (1024 * 1024)) + " Mb";
    }
    else if (bytesCount > 1024)
    {
        return String(bytesCount / (1024)) + " Kb";
    }
    else
    {
        return String(bytesCount) + " B";
    }
}

//-----------------------------------
//WiFi Station
void drawSTNetworkStatus(int stAvailable, int stStatus, int stdBm, String stSSID, String stIp, String apGWIp)
{
    int statusColor = OWLOSLightColor;
    int textColor = OWLOSLightColor;
    if (stAvailable != 1)
    {
        statusColor = OWLOSDangerColor;
        textColor = OWLOSPrimaryColor;
    }

    stHeaderItem.draw("WiFi Station", statusColor, OWLOSSecondaryColor, 1);

    stdBm = stdBm - (stdBm % 10);

    drawWifiIcon(GOLD_7, GOLD_7 + GOLD_8, stdBm);

    if (stSSID.length() < 10)
    {
        stSSIDItem.draw(stSSID, textColor, OWLOSDarkColor, 4);
    }
    else
    {
        stSSIDItem.draw(stSSID, textColor, OWLOSDarkColor, 2);
    }

    stGWIPItem.draw("[GW:" + apGWIp + "]", textColor, OWLOSDarkColor, 1);
    stIPItem.draw(stIp, textColor, OWLOSDarkColor, 2);

    /*
 	 "0:WL_IDLE_STATUS;"; //default
	 "1:WL_NO_SSID_AVAIL; ";
	 "2:WL_SCAN_COMPLETED;";
	 "3:WL_CONNECTED;";
	 "4:WL_CONNECT_FAILED;";
	 "5:WL_CONNECTION_LOST;";
	 "6:WL_DISCONNECTED;";
    */

    String statusText = "";
    switch (stStatus)
    {
    case 1:
        statusColor = OWLOSDangerColor;
        statusText = "[no ssid]";
        break;

    case 2:
        statusColor = OWLOSSuccessColor;
        statusText = "[scan completed]";
        break;

    case 3:
        statusColor = OWLOSSuccessColor;
        statusText = CONNECTED_STATUS;
        break;

    case 4:
        statusColor = OWLOSDangerColor;
        statusText = "[connected failded]";
        break;

    case 5:
        statusColor = OWLOSPrimaryColor;
        statusText = "[connection lost]";
        break;

    case 6:
        statusColor = OWLOSPrimaryColor;
        statusText = DISCONNECTED_STATUS;
        break;

    default:
        statusColor = OWLOSPrimaryColor;
        statusText = "[idle]";
        break;
    }

    stdBmItem.draw(String(stdBm) + " dBn", statusColor, OWLOSDarkColor, 1);
    stStatusItem.draw(statusText, statusColor, OWLOSDarkColor, 2);
}

//-----------------------------------
//WiFi Access Point
void drawAPNetworkStatus(int apAvailable, String apSSID, String apIp)
{
    int statusColor = OWLOSLightColor;
    int textColor = OWLOSLightColor;
    if (apAvailable != 1)
    {
        statusColor = OWLOSDangerColor;
        textColor = OWLOSPrimaryColor;
        apStatusItem.draw("OFFLINE", statusColor, OWLOSDarkColor, 2);
    }
    else
    {
        apStatusItem.draw(ONLINE_STATUS, statusColor, OWLOSDarkColor, 2);
    }

    apHeaderItem.draw("WiFi Access Point", statusColor, OWLOSSecondaryColor, 1);

    if (apSSID.length() < 10)
    {
        apSSIDItem.draw(apSSID, textColor, OWLOSDarkColor, 4);
    }
    else
    {
        apSSIDItem.draw(apSSID, textColor, OWLOSDarkColor, 2);
    }
    apIPItem.draw(apIp, textColor, OWLOSDarkColor, 2);
}

//HTTP(S) Server
//------------------------------------
void drawHTTPServerStatus(int hsStAvailable, int hssStAvailable, int hsApAvailable, int hssApAvailable, String hsStAddress, String hssStAddress, String hsApAddress, String hssApAddress)
{
    if ((hsStAvailable != 1) && (hssStAvailable != 1) && (hsApAvailable != 1) && (hssApAvailable != 1))
    {
        hsHeaderItem.draw("Embeded HTTP(S) Server", OWLOSDangerColor, OWLOSSecondaryColor, 1);
    }
    else
    {
        hsHeaderItem.draw("Embeded HTTP(S) Server", OWLOSLightColor, OWLOSSecondaryColor, 1);
    }

    if (hsStAvailable != 1)
    {
        hsStStatusItem.draw(DISABLED_STATUS, OWLOSPrimaryColor, OWLOSDarkColor, 2);
        hsStIPItem.draw("", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    }
    else
    {
        hsStStatusItem.draw(AVAILABLE_STATUS, OWLOSSuccessColor, OWLOSDarkColor, 2);
        hsStIPItem.draw(hsStAddress, OWLOSLightColor, OWLOSDarkColor, 2);
    }

    if (hssStAvailable != 1)
    {
        hssStStatusItem.draw(DISABLED_STATUS, OWLOSPrimaryColor, OWLOSDarkColor, 2);
        hssStIPItem.draw("", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    }
    else
    {
        hssStStatusItem.draw(AVAILABLE_STATUS, OWLOSSuccessColor, OWLOSDarkColor, 2);
        hssStIPItem.draw(hssStAddress, OWLOSLightColor, OWLOSDarkColor, 2);
    }

    if (hsApAvailable != 1)
    {
        hsApStatusItem.draw(DISABLED_STATUS, OWLOSPrimaryColor, OWLOSDarkColor, 2);
        hsApIPItem.draw("", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    }
    else
    {
        hsApStatusItem.draw(AVAILABLE_STATUS, OWLOSSuccessColor, OWLOSDarkColor, 2);
        hsApIPItem.draw(hsApAddress, OWLOSLightColor, OWLOSDarkColor, 2);
    }

    if (hssApAvailable != 1)
    {
        hssApStatusItem.draw(DISABLED_STATUS, OWLOSPrimaryColor, OWLOSDarkColor, 2);
        hssApIPItem.draw("", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    }
    else
    {
        hssApStatusItem.draw(AVAILABLE_STATUS, OWLOSSuccessColor, OWLOSDarkColor, 2);
        hssApIPItem.draw(hssStAddress, OWLOSLightColor, OWLOSDarkColor, 2);
    }
}

//HTTP(S) Client
//------------------------------------
void drawHTTPClientStatus(int hcAvailable, int hcStatus, String hcServerIP, int hcSend, int hcRecv)
{
    if (hcAvailable != 1)
    {
        hcHeaderItem.draw("HTTP(S) Client", OWLOSDangerColor, OWLOSSecondaryColor, 1);
    }
    else
    {
        hcHeaderItem.draw("HTTP(S) Client", OWLOSLightColor, OWLOSSecondaryColor, 1);
    }

    if (hcStatus == -1)
    {
        hcStatusItem.draw(ERROR_STATUS, OWLOSPrimaryColor, OWLOSDarkColor, 2);
    }
    else if (hcStatus == -2)
    {
        hcStatusItem.draw("IDLE", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    }
    else if ((hcStatus >= 200) && (hcStatus < 400))
    {
        hcStatusItem.draw(String(hcStatus), OWLOSSuccessColor, OWLOSDarkColor, 2);
    }
    else
    {
        hcStatusItem.draw(String(hcStatus), OWLOSDangerColor, OWLOSDarkColor, 2);
    }

    hcServerIPItem.draw(hcServerIP, OWLOSLightColor, OWLOSDarkColor, 2);
    hcSendItem.draw(convertingByteToString(hcSend), OWLOSPrimaryColor, OWLOSDarkColor, 2);
    hcRecvItem.draw(convertingByteToString(hcRecv), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//MQTT Client
//------------------------------------
void drawMQTTClientStatus(int mqttAvailable, int mqttStatus, String mqttServerIP, int mqttSend, int mqttRecv)
{
    if (mqttAvailable != 1)
    {
        mqttHeaderItem.draw("MQTT Client", OWLOSDangerColor, OWLOSSecondaryColor, 1);
    }
    else
    {
        mqttHeaderItem.draw("MQTT Client", OWLOSLightColor, OWLOSSecondaryColor, 1);
    }

    if (mqttStatus != 1)
    {
        mqttStatusItem.draw(ERROR_STATUS, OWLOSDangerColor, OWLOSDarkColor, 2);
    }
    else
    {
        mqttStatusItem.draw(CONNECTED_STATUS, OWLOSSuccessColor, OWLOSDarkColor, 2);
    }

    mqttServerIPItem.draw(mqttServerIP, OWLOSLightColor, OWLOSDarkColor, 2);
    mqttSendItem.draw(convertingByteToString(mqttSend), OWLOSPrimaryColor, OWLOSDarkColor, 2);
    mqttRecvItem.draw(convertingByteToString(mqttRecv), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//UART Client
//------------------------------------
void drawUARTClientStatus(int uartAvailable, int uartStatus, int uartSpeed, int uartSend, int uartRecv)
{

    if (uartAvailable != 1)
    {
        uartHeaderItem.draw("UART", OWLOSDangerColor, OWLOSSecondaryColor, 1);
    }
    else
    {
        uartHeaderItem.draw("UART", OWLOSLightColor, OWLOSSecondaryColor, 1);
    }

    if (uartStatus != 1)
    {
        uartStatusItem.draw("---", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    }
    else
    {
        uartStatusItem.draw(AVAILABLE_STATUS, OWLOSSuccessColor, OWLOSDarkColor, 2);
    }

    uartSpeedItem.draw(String(uartSpeed), OWLOSLightColor, OWLOSDarkColor, 2);
    uartSendItem.draw(convertingByteToString(uartSend), OWLOSPrimaryColor, OWLOSDarkColor, 2);
    uartRecvItem.draw(convertingByteToString(uartRecv), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//System
//------------------------------------
void drawSystemStatus(String id, int loop, unsigned long lifeTime, int heap)
{
    systemIdItem.draw(id, OWLOSLightColor, OWLOSDarkColor, 2);
    systemLoopItem.draw(String(loop) + " ms", OWLOSPrimaryColor, OWLOSDarkColor, 2);

    lifeTime = lifeTime / 1000; //to seconds
    int days = (lifeTime / (24 * 60 * 60));
    lifeTime = lifeTime - days * (24 * 60 * 60);
    byte hours = lifeTime / (60 * 60);
    lifeTime = lifeTime - hours * (60 * 60);
    byte minutes = lifeTime / 60;
    byte seconds = lifeTime - minutes * 60;

    String lifeTimeString = String(days) + "d." + String(hours) + ":" + String(minutes) + ":" + String(seconds);

    systemLifeTimeItem.draw(lifeTimeString, OWLOSPrimaryColor, OWLOSDarkColor, 2);
    systemHeapItem.draw(convertingByteToString(heap), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//------------------------------------------------------------------------------------------
//Draw Transport Statuses
void drawTransportStatuses()
{
    drawSTNetworkStatus(thingGetWiFiAvailable(), thingGetWiFiStatus(), thingGetWiFiRSSI(), thingGetWiFiSSID(), thingGetWiFiIP(), String(thingGetWiFiGateWayIP()));
    drawAPNetworkStatus(thingGetWiFiAccessPointAvailable(), thingGetWiFiAccessPointSSID(), thingGetWiFiAccessPointIP());

#ifdef USE_HTTP_SERVER
    int useHTTPServer = 1;
#else
    int useHTTPServer = 0;
#endif

#ifdef USE_HTTPS_SERVER
    int useHTTPSServer = 1;
#else
    int useHTTPSServer = 0;
#endif

    drawHTTPServerStatus(useHTTPServer && thingGetWiFiAvailable() && thingGetWiFiIsConnected(),
                         useHTTPSServer && thingGetWiFiAvailable() && thingGetWiFiIsConnected(),
                         useHTTPServer && thingGetWiFiAccessPointAvailable(),
                         useHTTPSServer && thingGetWiFiAccessPointAvailable(),
                         "http://" + thingGetWiFiIP() + ":" + String(thingGetHTTPServerPort()),
                         "http://" + thingGetWiFiIP() + ":443\n",
                         "https://" + thingGetWiFiAccessPointIP() + ":" + String(thingGetHTTPServerPort()),
                         "https://" + thingGetWiFiAccessPointIP() + ":443\n");

#ifdef USE_HTTP_CLIENT
    int useHTTPClient = thingGetHTTPClientAvailable() && thingGetWiFiAvailable() && thingGetWiFiIsConnected();

    String hcServerIP = thingGetHTTPClientURL() + ":" + String(thingGetHTTPClientPort());
    drawHTTPClientStatus(useHTTPClient, HTTPClientGetStatus(), hcServerIP, HTTPClientGetSend(), HTTPClientGetRecv());
#else
    drawHTTPClientStatus(0, -1, "", 0, 0);
#endif

#ifdef USE_MQTT
    int useMQTTClient = thingGetMQTTAvailable() && thingGetWiFiAvailable() && thingGetWiFiIsConnected();
    drawMQTTClientStatus(useMQTTClient, thingGetMQTTClientConnected(), thingGetMQTTURL() + ":" + String(thingGetMQTTPort()), MQTTGetSend(), MQTTGetRecv());
#else
    drawMQTTClientStatus(0, -1, "", 0, 0);
#endif

#ifdef USE_UART
    drawUARTClientStatus(1, Serial.available(), Serial.baudRate(), UARTGetSend(), UARTGetRecv());
#else
    drawUARTClientStatus(0, -1, Serial.baudRate(), 0, 0);
#endif

    int loopPeriod = millis() - lastSavedTickCount;
    if (lastSavedTickCount == 0)
    {
        loopPeriod = -1;
    }

    lastSavedTickCount = millis();

    drawSystemStatus(FIRMWARE_VERSION, loopPeriod, lastSavedTickCount, thingGetESPFreeHeap());
}

//------------------------------------------------------------------------------------------
//Init
bool UXServiceInit()
{

    // Setup the LCD
    tft.init();
    tft.setRotation(1);
    tft.fillScreen(OWLOSDarkColor);

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
        tft.calibrateTouch(calibrationData, OWLOSLightColor, OWLOSDangerColor, 15);
        filesWriteInt(CALIBRATION_FILE "0", calibrationData[0]);
        filesWriteInt(CALIBRATION_FILE "1", calibrationData[1]);
        filesWriteInt(CALIBRATION_FILE "2", calibrationData[2]);
        filesWriteInt(CALIBRATION_FILE "3", calibrationData[3]);
        filesWriteInt(CALIBRATION_FILE "4", calibrationData[4]);
    }

    initDrawNetworkStatus();
    drawTransportStatuses();

    return true;
}

void UXServiceLoop()
{
    drawTransportStatuses();
}

#endif
