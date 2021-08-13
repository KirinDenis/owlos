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


extern ButtonControlClass button1;
extern ButtonControlClass button2;
extern ButtonControlClass button3;
ButtonControlClass transportButton("transport", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 4, 16);

void TransportButtonTouch()
{
    if (currentMode == SENSORS_MODE)
    {
        currentMode = TRANSPORT_MODE;
        refreshTransportStatuses();
    }
}

void initSensorStatuses()
{
    GasHeaderItem.y += GOLD_11;    
    transportButton.OnTouchEvent = TransportButtonTouch;
    
}

void refreshSensorStatuses()
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

    button1.refresh();
    button2.refresh();
    button3.refresh();
    transportButton.refresh();
}

//-------------------------------------------------
//DHT
void drawDHTStatus()
{
    int statusColor = OWLOSDangerColor;
    int textColor = OWLOSPrimaryColor;
    if ((_DHTDriver != nullptr) && (_DHTDriver->getAvailable() == 1))
    {
        statusColor = OWLOSLightColor;
        textColor = OWLOSLightColor;

        if (_DHTDriver->getCelsius() == 1)
        {
            dhtTempValueItem.draw(_DHTDriver->getTemperature() + "C", textColor, OWLOSDarkColor, 2);
        }
        else
        {
            dhtTempValueItem.draw(_DHTDriver->getTemperature() + "F", textColor, OWLOSDarkColor, 2);
        }
        dhtHumValueItem.draw(_DHTDriver->getHumidity() + "%", textColor, OWLOSDarkColor, 2);
        dhtHeatValueItem.draw(_DHTDriver->getHeatIndex(), textColor, OWLOSDarkColor, 2);
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
    if ((_BMP280Driver != nullptr) && (_BMP280Driver->getAvailable() == 1))
    {
        statusColor = OWLOSLightColor;
        textColor = OWLOSLightColor;

        float kPa = atof(_BMP280Driver->getPressure().c_str()) / 1000.0f;
        float mmHg = kPa * 7.5006375541921;

        bmp280PressureValueItem.draw(String(kPa) + "kPa/" + String(mmHg) + "mmHg", textColor, OWLOSDarkColor, 2);
        bmp280AltitudeValueItem.draw(_BMP280Driver->getAltitude() + "m", textColor, OWLOSDarkColor, 2);
        bmp280TemperatureValueItem.draw(_BMP280Driver->getTemperature() + "C", textColor, OWLOSDarkColor, 2);
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
        CO2ValueItem.draw(_CCS811Driver->getCO2(), textColor, OWLOSDarkColor, 2);        
        TVOCValueItem.draw(_CCS811Driver->getTVOC(), textColor, OWLOSDarkColor, 2);        
        MQ7ValueItem.draw(_ADS1X15Driver->getChanel_2_Volts(), textColor, OWLOSDarkColor, 2);        
        MQ135ValueItem.draw(_ADS1X15Driver->getChanel_1_Volts(), textColor, OWLOSDarkColor, 2);        
        ResistenceValueItem.draw(_CCS811Driver->getResistence(), textColor, OWLOSDarkColor, 2);        
        LightValueItem.draw(_ADS1X15Driver->getChanel_3_Volts(), textColor, OWLOSDarkColor, 2);
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
void drawSensorStatuses()
{
    drawDHTStatus();
    drawBMP280Status();
    drawGasStatus();

    button1.draw();
    button2.draw();
    button3.draw();
    transportButton.draw();
}