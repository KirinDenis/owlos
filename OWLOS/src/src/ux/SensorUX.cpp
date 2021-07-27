#include "UXCore.h"

extern TFT_eSPI tft;


void initDrawSensorStatus()
{
    tft.fillScreen(OWLOSDarkColor);

    tft.fillRect(0, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.fillRect(WIDTH / 2, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.drawFastVLine(WIDTH / 2, 0, GOLD_8, OWLOSDarkColor);
    tft.drawFastVLine(WIDTH / 2, GOLD_8, GOLD_5, OWLOSSecondaryColor);
}

//------------------------------------------------------------------------------------------
//Draw Transport Statuses
void drawSensorStatuses()
{
    tft.fillRect(0, 0, WIDTH / 2, GOLD_8, OWLOSLightColor);
    tft.fillRect(0, 0, WIDTH / 2, GOLD_8, OWLOSWarningColor);
}