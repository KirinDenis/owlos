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

#include "HomeScreen.h"

#include "../Controls/ButtonControl.h"
#include "LogScreen.h"
#include "SensorsScreen.h"
#include "TransportScreen.h"

extern TFT_eSPI tft;

ButtonControlClass homeButton("home", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 1, 16);
ButtonControlClass sensorsButton("sensors", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 2, 16);
ButtonControlClass transportButton("transport", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 3, 16);
ButtonControlClass logButton("log", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 4, 16);

extern int currentMode;

void HomeButtonTouch()
{
    if (currentMode != HOME_MODE)
    {
        homeButton.selected = true;
        homeScreenRefresh();
        sensorsButton.selected = transportButton.selected = logButton.selected = false;
        sensorsButton.refresh();
        transportButton.refresh();
        logButton.refresh();

        currentMode = HOME_MODE;        
    }
}

void SensorButtonTouch()
{
    if (currentMode != SENSORS_MODE)
    {
        sensorsButton.selected = true;
        sensorsScreenRefresh();
        homeButton.selected = transportButton.selected = logButton.selected = false;        
        homeButton.refresh();
        transportButton.refresh();
        logButton.refresh();

        currentMode = SENSORS_MODE;
    }
}

void TransportButtonTouch()
{
    if (currentMode != TRANSPORT_MODE)
    {
        transportButton.selected = true;
        transportScreenRefresh();
        homeButton.selected = sensorsButton.selected = logButton.selected = false;        
        homeButton.refresh();
        sensorsButton.refresh();
        logButton.refresh();

        currentMode = TRANSPORT_MODE;
    }
}

void LogButtonTouch()
{
    if (currentMode != LOG_MODE)
    {
        logButton.selected = true;
        logScreenRefresh();
        homeButton.selected = sensorsButton.selected = transportButton.selected = false;        
        homeButton.refresh();
        sensorsButton.refresh();
        transportButton.refresh();

        currentMode = LOG_MODE;
    }
}

void homeScreenInit()
{
    homeButton.OnTouchEvent = HomeButtonTouch;
    sensorsButton.OnTouchEvent = SensorButtonTouch;
    transportButton.OnTouchEvent = TransportButtonTouch;
    logButton.OnTouchEvent = LogButtonTouch;
}

void homeScreenRefresh()
{
    tft.fillScreen(OWLOSDarkColor);
    homeButton.refresh();
    sensorsButton.refresh();
    transportButton.refresh();
    logButton.refresh();
}

void homeScreenDraw()
{
    homeButton.draw();
    sensorsButton.draw();
    transportButton.draw();
    logButton.draw();
}
