#include "LogScreen.h"

#include "../Controls/ButtonControl.h"

extern TFT_eSPI tft;

extern int currentMode;

int logCount = 0;

bool lockScreen = false;


extern ButtonControlClass homeButton;
extern ButtonControlClass sensorsButton;
extern ButtonControlClass transportButton;
extern ButtonControlClass logButton;

void logScreenInit()
{
}

void logScreenRefresh()
{
  tft.fillScreen(OWLOSDarkColor);
  tft.setCursor(0, 0);
  logCount = 0;

    homeButton.refresh();
    sensorsButton.refresh();    
    transportButton.refresh();
    logButton.refresh();

}

void logScreenDraw()
{
    homeButton.draw();
    sensorsButton.draw();
    transportButton.draw();
    logButton.draw();
}

void logScreenAddText(String tag, String text)
{
  if ((currentMode == LOG_MODE) && (!lockScreen))
  {
    lockScreen = true;
    logCount += tft.fontHeight(1);
    if (logCount > HEIGHT)
    {
      logScreenRefresh();
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
