/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
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

#include "../ux/UXUtils.h"
#include "../ux/Screens/TransportScreen.h"
#include "../ux/Screens/SensorScreen.h"
#include "FileService.h"

extern TFT_eSPI tft;

#define CALIBRATION_FILE "/TFTCalibration"

extern int currentMode;
int previosMode;

bool SetupComplete = false;

//------------------------------------------------------------------------------------------
//Init
bool UXServiceInit()
{
    // Setup the LCD
    tft.init();
    tft.setRotation(1);

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

    currentMode = LOG_MODE;
    previosMode = LOG_MODE;

    initTransportStatuses();
    initSensorStatuses();

    //refreshTransportStatuses();
    //drawTransportStatuses();

    //refreshSensorStatuses();
    //drawSensorStatuses();

    return true;
}

void UXServiceLoop()
{
    if (!SetupComplete)
    {
        SetupComplete = true;
        currentMode = SENSORS_MODE;
        previosMode = SENSORS_MODE;
        refreshSensorStatuses();
        drawSensorStatuses();
    }

    if (currentMode != previosMode)
    {
        Serial.println("!-------" + String(currentMode));
        switch (currentMode)
        {
        case TRANSPORT_MODE:
            refreshTransportStatuses();
            break;

        case SENSORS_MODE:
            refreshSensorStatuses();
            break;
        default:
            break;
        }
    }

    switch (currentMode)
    {
    case TRANSPORT_MODE:
        drawTransportStatuses();
        break;

    case SENSORS_MODE:
        drawSensorStatuses();
        break;
    default:
        break;
    }

    previosMode = currentMode;
}

#endif
