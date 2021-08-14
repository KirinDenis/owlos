#include "LogoScreen.h"

extern TFT_eSPI tft;

extern int currentMode;

int logCount = 0;

bool lockScreen = false;

void logoScreenInit()
{
}

void logoScreenRefresh()
{
  tft.fillScreen(OWLOSDarkColor);
  tft.setCursor(0, 0);
  logCount = 0;
}

void logoScreenDraw()
{
}

void logoScreenAddText(String tag, String text)
{
  if ((currentMode == LOG_MODE) && (!lockScreen))
  {
    lockScreen = true;
    logCount += tft.fontHeight(1);
    if (logCount > HEIGHT)
    {
      logoScreenRefresh();
    }

    tft.setTextColor(OWLOSInfoColor, OWLOSDarkColor);
    tft.print("[" + String(ESP.getFreeHeap()) + "] ");
    tft.setTextColor(OWLOSLightColor, OWLOSDarkColor);
    tft.print(tag + " ");
    tft.setTextColor(OWLOSPrimaryColor, OWLOSDarkColor);
    tft.println(text);    
    lockScreen = false;
  }
}
