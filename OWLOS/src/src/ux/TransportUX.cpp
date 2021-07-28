#include "UXCore.h"

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

extern TFT_eSPI tft;

#define CONNECTED_STATUS "[connected]"
#define ONLINE_STATUS "[online]"
#define DISCONNECTED_STATUS "[disconnected]"
#define ERROR_STATUS "[error]"
#define AVAILABLE_STATUS "[available]"
#define DISABLED_STATUS "[disabled]"

unsigned long lastSavedTickCount = 0;

extern int currentMode;

void SensorButtonTouch()
{
    currentMode = SENSORS_MODE;
}

//-----------------------------------------------------------------------------------------
//Button Class
class ButtonClass
{
protected:
    bool leftAlign = true;
    int fgColor = OWLOSLightColor;
    int bgColor = OWLOSInfoColor;
    int selectColor = OWLOSWarningColor;
    String text = "";
    TextItemClass *stHeaderItem;

    void drawButton();

public:
    int x;
    int y;
    int text_x;
    int text_y;
    void (*OnTouchEvent)();

#define BUTTON_TOUCH_NOTDEFINE 0
#define BUTTON_TOUCH_YES 1
#define BUTTON_TOUCH_NO 2

    int touch = BUTTON_TOUCH_NOTDEFINE;
    //column - 1,2,3,4
    //         0,2 - align left  (0, width / 2)
    //         1,3 - align right (width / 2, width)
    //row --> row * Glod8 = y
    ButtonClass(String _text, int _fgColor, int _bgColor, int _selectColor, int column, int row)
    {
        text = _text;
        fgColor = _fgColor;
        bgColor = _bgColor;
        selectColor = _selectColor;
        

        x = (column - 1) * (WIDTH / 4) + GOLD_11;
        y = row * GOLD_8 + GOLD_11;

        //tft.fillRect(x, y, WIDTH / 4, GOLD_8 * 2, bgColor);

        //stHeaderItem = new TextItemClass(column, row);
        text_x = x + (WIDTH / 4 - tft.textWidth(_text, 2)) / 2;
        text_y = y + GOLD_7 / 4;
        //tft.setTextColor(fgColor, bgColor);
        //tft.drawString(text, text_x, text_y, 2);
        //stHeaderItem->draw(_text, fgColor, bgColor, 2);
        //draw();
    }
    void draw()
    {
        uint16_t tx, ty;
        if (tft.getTouch(&tx, &ty))
        {
            if ((tx > x) && (tx < x + WIDTH / 4) && (ty > y) && (ty < ty + GOLD_8 * 2))
            {
                if (touch != BUTTON_TOUCH_YES)
                {
                    tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, selectColor);
                    tft.setTextColor(fgColor, selectColor);
                    tft.drawString(text, text_x, text_y, 2);
                    (*OnTouchEvent)();
                }
                touch = BUTTON_TOUCH_YES;
            }
        }
        else
        {
            if (touch != BUTTON_TOUCH_NO)
            {
                tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, bgColor);
                tft.setTextColor(fgColor, bgColor);
                tft.drawString(text, text_x, text_y, 2);
            }
            touch = BUTTON_TOUCH_NO;
        }
    }
};

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

ButtonClass button1("home", OWLOSLightColor, OWLOSSuccessColor, OWLOSWarningColor, 1, 16);
ButtonClass button2("system", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 2, 16);
ButtonClass button3("log", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 3, 16);
ButtonClass button4("sensors", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 4, 16);

void initDrawTransportStatus()
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

    button4.OnTouchEvent = SensorButtonTouch;

    button1.draw();
    button2.draw();
    button3.draw();
    button4.draw();
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

    button1.draw();
    button2.draw();
    button3.draw();
    button4.draw();
}
