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

#include "LogScreen.h"

#include "../Controls/ButtonControl.h"
#include "../../utils/Utils.h"

extern TFT_eSPI tft;

extern int currentMode;

int logCount = 0;

bool lockScreen = false;

extern bool SetupComplete;

extern ButtonControlClass homeButton;
extern ButtonControlClass sensorsButton;
extern ButtonControlClass transportButton;
extern ButtonControlClass logButton;

#define LOG_HEIGHT 14 * GOLD_8 

void logScreenInit()
{
}

void logScreenRefresh()
{
  tft.fillScreen(OWLOSDarkColor);
  logCount = 0;
  tft.setCursor(0, logCount);

  if (SetupComplete)
  {
    homeButton.refresh();
    sensorsButton.refresh();
    transportButton.refresh();
    logButton.refresh();
  }
}

void logScreenDraw()
{
  if (SetupComplete)
  {
    homeButton.draw();
    sensorsButton.draw();
    transportButton.draw();
    logButton.draw();
  }
}

void logScreenAddText(String tag, String text, int code)
{
  if ((currentMode == LOG_MODE) && (!lockScreen))
  {
    lockScreen = true;

    logCount += tft.fontHeight(1) + GOLD_12;
    if (logCount > LOG_HEIGHT)
    {
      logCount = 0;
    }

    tft.setCursor(0, logCount);
    tft.setTextColor(OWLOSInfoColor, OWLOSDarkColor);
    tft.print("[" + millisToDate(millis()) + " " + String(ESP.getFreeHeap()) + "] ");
    tft.setTextColor(OWLOSLightColor, OWLOSDarkColor);
    tft.print(tag + " ");

    switch (code)
    {
    case DEBUG_SUCCESS:
       tft.setTextColor(OWLOSSuccessColor, OWLOSDarkColor);
      break;

    case DEBUG_WARNING:
       tft.setTextColor(OWLOSWarningColor, OWLOSDarkColor);
      break;

    case DEBUG_DANGER:
       tft.setTextColor(OWLOSDangerColor, OWLOSDarkColor);
      break;

    
    default:
      tft.setTextColor(OWLOSPrimaryColor, OWLOSDarkColor);
      break;
    }
    
    tft.println(text);

    if (logCount < (LOG_HEIGHT - (tft.fontHeight(1) + GOLD_12) * 3))
    {
      tft.fillRect(0, logCount + tft.fontHeight(1), WIDTH, (tft.fontHeight(1) + GOLD_12) * 3, OWLOSDarkColor);
    }

    lockScreen = false;
  }
}
