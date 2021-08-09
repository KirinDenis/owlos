#include "../UXUtils.h"

#include "../Controls/ButtonControl.h"
#include "TransportScreen.h"

extern TFT_eSPI tft;

extern int currentMode;

void TransportButtonTouch()
{
    if (currentMode == SENSORS_MODE)
    {
        currentMode = TRANSPORT_MODE;
        refreshTransportStatuses();
    }
}

//extern ButtonControlClass button1;
//extern ButtonControlClass button2;
//extern ButtonControlClass button3;
ButtonControlClass transportButton("transport", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 4, 16);

void initSensorStatuses()
{
    transportButton.OnTouchEvent = TransportButtonTouch;
}

void refreshSensorStatuses()
{
    tft.fillScreen(OWLOSDarkColor);
    tft.fillRect(0, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.fillRect(WIDTH / 2, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.drawFastVLine(WIDTH / 2, 0, GOLD_8, OWLOSDarkColor);
    tft.drawFastVLine(WIDTH / 2, GOLD_8, GOLD_5, OWLOSSecondaryColor);


    //button1.draw();
    //button2.draw();
    //button3.draw();
    transportButton.draw();
}

//------------------------------------------------------------------------------------------
//Draw Transport Statuses
void drawSensorStatuses()
{
    //    button1.draw();
    //button2.draw();
    //button3.draw();
    transportButton.draw();
}