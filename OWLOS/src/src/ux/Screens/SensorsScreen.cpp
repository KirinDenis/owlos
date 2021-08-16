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

#include "../UXUtils.h"

#include "../../services/DriverService.h"
#include "../../services/AirQualityService.h"

#include "../Controls/TextControl.h"
#include "../Controls/ButtonControl.h"
#include "TransportScreen.h"

extern TFT_eSPI tft;

extern int currentMode;

extern DHTDriver *_DHTDriver;
extern BMP280Driver *_BMP280Driver;
extern ADS1X15Driver *_ADS1X15Driver;
extern CCS811Driver *_CCS811Driver;

TextControlClass dhtHeaderItem(0, 0);
TextControlClass dhtTempItem(0, 1);
TextControlClass dhtTempValueItem(1, 1);
TextControlClass dhtHumItem(0, 2);
TextControlClass dhtHumValueItem(1, 2);
TextControlClass dhtHeatItem(0, 3);
TextControlClass dhtHeatValueItem(1, 3);

TextControlClass bmp280HeaderItem(2, 0);
TextControlClass bmp280PressureItem(2, 1);
TextControlClass bmp280PressureValueItem(3, 1);
TextControlClass bmp280AltitudeItem(2, 2);
TextControlClass bmp280AltitudeValueItem(3, 2);
TextControlClass bmp280TemperatureItem(2, 3);
TextControlClass bmp280TemperatureValueItem(3, 3);

TextControlClass GasHeaderItem(0, 4);
TextControlClass CO2Item(0, 5);
TextControlClass CO2ValueItem(1, 5);
TextControlClass TVOCItem(2, 5);
TextControlClass TVOCValueItem(3, 5);
TextControlClass MQ7Item(0, 6);
TextControlClass MQ7ValueItem(1, 6);
TextControlClass MQ135Item(2, 6);
TextControlClass MQ135ValueItem(3, 6);
TextControlClass ResistenceItem(0, 7);
TextControlClass ResistenceValueItem(1, 7);
TextControlClass LightItem(2, 7);
TextControlClass LightValueItem(3, 7);

extern ButtonControlClass homeButton;
extern ButtonControlClass sensorsButton;
extern ButtonControlClass transportButton;
extern ButtonControlClass logButton;

void sensorsScreenInit()
{
    GasHeaderItem.y += GOLD_11;
}

void sensorsScreenRefresh()
{
    tft.fillScreen(OWLOSDarkColor);
    tft.fillRect(0, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.fillRect(WIDTH / 2, 0, WIDTH / 2, GOLD_8, OWLOSSecondaryColor);
    tft.drawFastVLine(WIDTH / 2, 0, GOLD_8, OWLOSDarkColor);
    tft.drawFastVLine(WIDTH / 2, GOLD_8, GOLD_5, OWLOSSecondaryColor);

    int hOffset = GOLD_8 * 4 + GOLD_11;
    tft.fillRect(0, hOffset, WIDTH, GOLD_8, OWLOSSecondaryColor);

    dhtHeaderItem.refresh();
    dhtTempItem.refresh();
    dhtTempValueItem.refresh();
    dhtHumItem.refresh();
    dhtHumValueItem.refresh();
    dhtHeatItem.refresh();
    dhtHeatValueItem.refresh();

    bmp280HeaderItem.refresh();
    bmp280PressureItem.refresh();
    bmp280PressureValueItem.refresh();
    bmp280AltitudeItem.refresh();
    bmp280AltitudeValueItem.refresh();
    bmp280TemperatureItem.refresh();
    bmp280TemperatureValueItem.refresh();

    GasHeaderItem.refresh();
    CO2Item.refresh();
    CO2ValueItem.refresh();
    TVOCItem.refresh();
    TVOCValueItem.refresh();
    MQ7Item.refresh();
    MQ7ValueItem.refresh();
    MQ135Item.refresh();
    MQ135ValueItem.refresh();
    ResistenceItem.refresh();
    ResistenceValueItem.refresh();
    LightItem.refresh();
    LightValueItem.refresh();

    homeButton.refresh();
    sensorsButton.refresh();
    transportButton.refresh();
    logButton.refresh();
}

//-------------------------------------------------
//DHT
void drawDHTStatus()
{
    int statusColor = OWLOSDangerColor;
    int textColor = OWLOSPrimaryColor;
    if ((_DHTDriver != nullptr) && (_DHTDriver->available == 1))
    {
        statusColor = OWLOSLightColor;
        textColor = OWLOSLightColor;

        if (_DHTDriver->celsius == 1)
        {
            dhtTempValueItem.draw(_DHTDriver->temperature + "C", textColor, OWLOSDarkColor, 2);
        }
        else
        {
            dhtTempValueItem.draw(_DHTDriver->temperature + "F", textColor, OWLOSDarkColor, 2);
        }
        dhtHumValueItem.draw(_DHTDriver->humidity + "%", textColor, OWLOSDarkColor, 2);
        dhtHeatValueItem.draw(_DHTDriver->heatIndex, textColor, OWLOSDarkColor, 2);
    }
    else
    {
        dhtTempValueItem.draw("--", textColor, OWLOSDarkColor, 2);
        dhtHumValueItem.draw("--", textColor, OWLOSDarkColor, 2);
        dhtHeatValueItem.draw("--", textColor, OWLOSDarkColor, 2);
    }

    dhtHeaderItem.draw("DHT 22", statusColor, OWLOSSecondaryColor, 1);
    textColor = OWLOSPrimaryColor;
    dhtTempItem.draw("temperature", textColor, OWLOSDarkColor, 2);
    dhtHumItem.draw("humidity", textColor, OWLOSDarkColor, 2);
    dhtHeatItem.draw("heat index", textColor, OWLOSDarkColor, 2);
}

//-------------------------------------------------
//BMP280
void drawBMP280Status()
{
    int statusColor = OWLOSDangerColor;
    int textColor = OWLOSPrimaryColor;
    if ((_BMP280Driver != nullptr) && (_BMP280Driver->available == 1))
    {
        statusColor = OWLOSLightColor;
        textColor = OWLOSLightColor;

        float kPa = atof(_BMP280Driver->pressure.c_str()) / 1000.0f;
        float mmHg = kPa * 7.5006375541921;

        bmp280PressureValueItem.draw(String(kPa) + "kPa/" + String(mmHg) + "mmHg", textColor, OWLOSDarkColor, 2);
        bmp280AltitudeValueItem.draw(_BMP280Driver->altitude + "m", textColor, OWLOSDarkColor, 2);
        bmp280TemperatureValueItem.draw(_BMP280Driver->temperature + "C", textColor, OWLOSDarkColor, 2);
    }
    else
    {
        bmp280PressureValueItem.draw("--", textColor, OWLOSDarkColor, 2);
        bmp280AltitudeValueItem.draw("--", textColor, OWLOSDarkColor, 2);
        bmp280TemperatureValueItem.draw("--", textColor, OWLOSDarkColor, 2);
    }

    bmp280HeaderItem.draw("BMP 280", statusColor, OWLOSSecondaryColor, 1);
    textColor = OWLOSPrimaryColor;
    bmp280PressureItem.draw("pressure", textColor, OWLOSDarkColor, 2);
    bmp280AltitudeItem.draw("altitude", textColor, OWLOSDarkColor, 2);
    bmp280TemperatureItem.draw("temperature", textColor, OWLOSDarkColor, 2);
}

//-------------------------------------------------
//Gas
void drawGasStatus()
{
    int statusColor = OWLOSLightColor;
    int textColor = OWLOSLightColor;

    if ((_CCS811Driver != nullptr) && (_ADS1X15Driver != nullptr))
    {
        CO2ValueItem.draw(_CCS811Driver->CO2, textColor, OWLOSDarkColor, 2);
        TVOCValueItem.draw(_CCS811Driver->TVOC, textColor, OWLOSDarkColor, 2);
        MQ7ValueItem.draw(_ADS1X15Driver->chanel_2_volts, textColor, OWLOSDarkColor, 2);
        MQ135ValueItem.draw(_ADS1X15Driver->chanel_1_volts, textColor, OWLOSDarkColor, 2);
        ResistenceValueItem.draw(_CCS811Driver->resistence, textColor, OWLOSDarkColor, 2);
        LightValueItem.draw(_ADS1X15Driver->chanel_3_volts, textColor, OWLOSDarkColor, 2);
    }
    else
    {
        CO2ValueItem.draw("---", textColor, OWLOSDarkColor, 2);
        TVOCValueItem.draw("---", textColor, OWLOSDarkColor, 2);
        MQ7ValueItem.draw("---", textColor, OWLOSDarkColor, 2);
        MQ135ValueItem.draw("---", textColor, OWLOSDarkColor, 2);
        ResistenceValueItem.draw("---", textColor, OWLOSDarkColor, 2);
        LightValueItem.draw("---", textColor, OWLOSDarkColor, 2);
    }
    GasHeaderItem.draw("CO2, Gas, Light", statusColor, OWLOSSecondaryColor, 1);
    CO2Item.draw("CO2", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    TVOCItem.draw("TVOC", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    MQ7Item.draw("MQ 7", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    MQ135Item.draw("MQ 135", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    ResistenceItem.draw("Resistence", OWLOSPrimaryColor, OWLOSDarkColor, 2);
    LightItem.draw("Light", OWLOSPrimaryColor, OWLOSDarkColor, 2);
}

//------------------------------------------------------------------------------------------
//Draw Transport Statuses
void sensorsScreenDraw()
{
    drawDHTStatus();
    drawBMP280Status();
    drawGasStatus();

    homeButton.draw();
    sensorsButton.draw();
    transportButton.draw();
    logButton.draw();
}