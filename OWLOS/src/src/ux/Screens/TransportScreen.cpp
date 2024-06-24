/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2021 by:
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

#include "../Controls/TextControl.h"
#include "../Controls/ButtonControl.h"
#include "../Controls/EditControl.h"

#include "../../drivers/WifiDriver.h"
#include "../../drivers/NetworkDriver.h"
#include "../../drivers/ESPDriver.h"

#include "SensorsScreen.h"

#ifdef USE_HTTP_CLIENT
#include "../../transports/HTTPWebClient.h"
#endif

#ifdef USE_MQTT
#include "../../transports/MQTTClient.h"
#endif

#ifdef USE_UART
#include "../../transports/UART.h"
#endif

extern TFT_eSPI tft;

extern int currentMode;

#define CONNECTED_STATUS "[connected]"
#define ONLINE_STATUS "[online]"
#define DISCONNECTED_STATUS "[disconnected]"
#define ERROR_STATUS "[error]"
#define AVAILABLE_STATUS "[available]"
#define DISABLED_STATUS "[disabled]"

unsigned long lastSavedTickCount = 0;

//------------------------------------------------------------------------------------------------------
//TextItems
TextControlClass stHeaderItem(0, 0);
TextControlClass stSSIDItem(1, 1);
TextControlClass stGWIPItem(1, 2);
TextControlClass stIPItem(1, 3);
TextControlClass stdBmItem(0, 2);
TextControlClass stStatusItem(0, 3);

TextControlClass apHeaderItem(2, 0);
TextControlClass apSSIDItem(3, 1);
TextControlClass apIPItem(3, 3);
TextControlClass apStatusItem(2, 3);

//HTTP(S) Server Items
TextControlClass hsHeaderItem(0, 4);
TextControlClass hsStStatusItem(0, 5);
TextControlClass hsStIPItem(1, 5);
TextControlClass hssStStatusItem(0, 6);
TextControlClass hssStIPItem(1, 6);
TextControlClass hsApStatusItem(2, 5);
TextControlClass hsApIPItem(3, 5);
TextControlClass hssApStatusItem(2, 6);
TextControlClass hssApIPItem(3, 6);

//HTTP Client
TextControlClass hcHeaderItem(0, 7);
TextControlClass hcHeaderSendItem(2, 7);
TextControlClass hcHeaderRecvItem(3, 7);
TextControlClass hcStatusItem(0, 8);
TextControlClass hcServerIPItem(1, 8);
TextControlClass hcSendItem(2, 8);
TextControlClass hcRecvItem(3, 8);

//MQTT Client
TextControlClass mqttHeaderItem(0, 9);
TextControlClass mqttHeaderSendItem(2, 9);
TextControlClass mqttHeaderRecvItem(3, 9);
TextControlClass mqttStatusItem(0, 10);
TextControlClass mqttServerIPItem(1, 10);
TextControlClass mqttSendItem(2, 10);
TextControlClass mqttRecvItem(3, 10);

//UART Client
TextControlClass uartHeaderItem(0, 11);
TextControlClass uartHeaderSendItem(2, 11);
TextControlClass uartHeaderRecvItem(3, 11);
TextControlClass uartStatusItem(0, 12);
TextControlClass uartSpeedItem(1, 12);
TextControlClass uartSendItem(2, 12);
TextControlClass uartRecvItem(3, 12);

TextControlClass systemHeaderItem(0, 13);
TextControlClass systemHeaderLoopItem(1, 13);
TextControlClass systemHeaderLifeTimeItem(2, 13);
TextControlClass systemHeaderHeapItem(3, 13);

TextControlClass systemIdItem(0, 14);
TextControlClass systemLoopItem(1, 14);
TextControlClass systemLifeTimeItem(2, 14);
TextControlClass systemHeapItem(3, 14);

extern ButtonControlClass homeButton;
extern ButtonControlClass sensorsButton;
extern ButtonControlClass transportButton;
extern ButtonControlClass logButton;

extern ButtonControlClass OKButton;
extern ButtonControlClass CancelButton;


void transportScreenRefresh()
{
    tft.fillScreen(OWLOSDarkColor);
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

    hcHeaderSendItem.draw("send", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    hcHeaderRecvItem.draw("recv", OWLOSWarningColor, OWLOSSecondaryColor, 1);

    mqttHeaderSendItem.draw("send", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    mqttHeaderRecvItem.draw("recv", OWLOSWarningColor, OWLOSSecondaryColor, 1);

    uartHeaderSendItem.draw("send", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    uartHeaderRecvItem.draw("recv", OWLOSWarningColor, OWLOSSecondaryColor, 1);

    systemHeaderItem.draw("System", OWLOSLightColor, OWLOSSecondaryColor, 1);
    systemHeaderLoopItem.draw("loop", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    systemHeaderLifeTimeItem.draw("life time", OWLOSWarningColor, OWLOSSecondaryColor, 1);
    systemHeaderHeapItem.draw("heap", OWLOSWarningColor, OWLOSSecondaryColor, 1);

    //TextItems
    stHeaderItem.refresh();
    stSSIDItem.refresh();
    stGWIPItem.refresh();
    stIPItem.refresh();
    stdBmItem.refresh();
    stStatusItem.refresh();

    apHeaderItem.refresh();
    apSSIDItem.refresh();
    apIPItem.refresh();
    apStatusItem.refresh();

    //HTTP(S) Server Items
    hsHeaderItem.refresh();
    hsStStatusItem.refresh();
    hsStIPItem.refresh();
    hssStStatusItem.refresh();
    hssStIPItem.refresh();
    hsApStatusItem.refresh();
    hsApIPItem.refresh();
    hssApStatusItem.refresh();
    hssApIPItem.refresh();

    //HTTP Client
    hcHeaderItem.refresh();
    hcHeaderSendItem.refresh();
    hcHeaderRecvItem.refresh();
    hcStatusItem.refresh();
    hcServerIPItem.refresh();
    hcSendItem.refresh();
    hcRecvItem.refresh();

    //MQTT Client
    mqttHeaderItem.refresh();
    mqttHeaderSendItem.refresh();
    mqttHeaderRecvItem.refresh();
    mqttStatusItem.refresh();
    mqttServerIPItem.refresh();
    mqttSendItem.refresh();
    mqttRecvItem.refresh();

    //UART Client
    uartHeaderItem.refresh();
    uartHeaderSendItem.refresh();
    uartHeaderRecvItem.refresh();
    uartStatusItem.refresh();
    uartSpeedItem.refresh();
    uartSendItem.refresh();
    uartRecvItem.refresh();

    systemHeaderItem.refresh();
    systemHeaderLoopItem.refresh();
    systemHeaderLifeTimeItem.refresh();
    systemHeaderHeapItem.refresh();

    systemIdItem.refresh();
    systemLoopItem.refresh();
    systemLifeTimeItem.refresh();
    systemHeapItem.refresh();

    homeButton.refresh();
    sensorsButton.refresh();
    transportButton.refresh();
    logButton.refresh();
}

//Touch events handlers ------------------------------------------------------------
//SSIDEDIT 
void EditCancel()
{
   currentMode = TRANSPORT_MODE;        
   transportScreenRefresh();
}
//SSIDEDIT 
void WiFiPasswordEditOK()
{
   currentMode = TRANSPORT_MODE;        
   transportScreenRefresh();

   String newPassword = EditControlGetText();
   thingSetWiFiPassword(newPassword);
}
//SSIDEDIT 
void WiFiSSIDEditOK()
{   
   String newSSID = EditControlGetText();
   thingSetWiFiSSID(newSSID);

   OKButton.OnTouchEvent = WiFiPasswordEditOK;

   EditControlSetText(thingGetWiFiPassword());
   EditControlSetLable("Enter new WiFi password:");
   EditControlRefresh();
}
//SSIDEDIT 
void SSIDOnTouch()
{    
    OKButton.OnTouchEvent = WiFiSSIDEditOK;
    CancelButton.OnTouchEvent = EditCancel;

    EditControlSetText(thingGetWiFiSSID());
    EditControlSetLable("Enter new WiFi SSID:");
    EditControlRefresh();
    currentMode = EDITCONTROL_MODE;        
}

//HTTPCLIENTEDIT
void HTTPClientPortEditOK()
{
   currentMode = TRANSPORT_MODE;        
   transportScreenRefresh();

   int port = atoi(EditControlGetText().c_str());
   thingSetHTTPClientPort(port);

}

void HTTPClientURLEditOK()
{      
   thingSetHTTPClientURL(EditControlGetText());

   OKButton.OnTouchEvent = HTTPClientPortEditOK;

   EditControlSetText(String(thingGetHTTPClientPort()));
   EditControlSetLable("Enter new HTTP Client port:");
   EditControlRefresh();
   currentMode = EDITCONTROL_MODE;        
}

void HTTPClientOnTouch()
{    
    OKButton.OnTouchEvent = HTTPClientURLEditOK;
    CancelButton.OnTouchEvent = EditCancel;

    EditControlSetText(thingGetHTTPClientURL());
    EditControlSetLable("Enter new HTTP Client URL:");
    EditControlRefresh();
    currentMode = EDITCONTROL_MODE;        
}

//----------------------------------------------------------------------------------
void transportScreenInit()
{
    stGWIPItem.y += GOLD_10;
    stdBmItem.x += GOLD_7;
    stdBmItem.y += GOLD_10;
    hsHeaderItem.y += GOLD_11;

    hcHeaderRecvItem.y = hcHeaderSendItem.y = hcHeaderItem.y += GOLD_11;
    mqttHeaderRecvItem.y = mqttHeaderSendItem.y = mqttHeaderItem.y += GOLD_11;
    uartHeaderRecvItem.y = uartHeaderSendItem.y = uartHeaderItem.y += GOLD_11;
    systemHeaderItem.y = systemHeaderLoopItem.y = systemHeaderLifeTimeItem.y = systemHeaderHeapItem.y += GOLD_11;

    stSSIDItem.OnTouchEvent = SSIDOnTouch;
    hcServerIPItem.OnTouchEvent = HTTPClientOnTouch;
}

//-----------------------------------
//WiFi Station
void drawSTNetworkStatus(int stAvailable, int stStatus, int stdBm, String stSSID, String stIp, String apGWIp)
{
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
    }

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

    stSSIDItem.draw(stSSID, textColor, OWLOSDarkColor, 2);
    
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
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
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
    }

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
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
    }

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
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
    }

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
    hcSendItem.draw(bytesToString(hcSend), OWLOSPrimaryColor, OWLOSDarkColor, 2);
    hcRecvItem.draw(bytesToString(hcRecv), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//MQTT Client
//------------------------------------
void drawMQTTClientStatus(int mqttAvailable, int mqttStatus, String mqttServerIP, int mqttSend, int mqttRecv)
{
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
    }

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
    mqttSendItem.draw(bytesToString(mqttSend), OWLOSPrimaryColor, OWLOSDarkColor, 2);
    mqttRecvItem.draw(bytesToString(mqttRecv), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//UART Client
//------------------------------------
void drawUARTClientStatus(int uartAvailable, int uartStatus, int uartSpeed, int uartSend, int uartRecv)
{
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
    }

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
    uartSendItem.draw(bytesToString(uartSend), OWLOSPrimaryColor, OWLOSDarkColor, 2);
    uartRecvItem.draw(bytesToString(uartRecv), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//System
//------------------------------------
void drawSystemStatus(String id, int loop, unsigned long lifeTime, int heap)
{
    if (currentMode != TRANSPORT_MODE)
    {
        return;    
    }

    systemIdItem.draw(id, OWLOSLightColor, OWLOSDarkColor, 2);
    systemLoopItem.draw(String(loop) + " ms", OWLOSPrimaryColor, OWLOSDarkColor, 2);

    String lifeTimeString = millisToDate(lifeTime);

    systemLifeTimeItem.draw(lifeTimeString, OWLOSPrimaryColor, OWLOSDarkColor, 2);
    systemHeapItem.draw(bytesToString(heap), OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//------------------------------------------------------------------------------------------
//Draw Transport Statuses
void transportScreenDraw()
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

    homeButton.draw();
    sensorsButton.draw();
    transportButton.draw();
    logButton.draw();
}
