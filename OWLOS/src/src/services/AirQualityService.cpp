/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
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
#ifndef AIRQUALITY_SERVICE
#define AIRQUALITY_SERVICE

#include "../config.h"
#include "../drivers/NetworkDriver.h"
#include "AirQualityService.h"
#include "DriverService.h"
#include "TransportService.h"

String _topic;

unsigned long lastPublishMillis = 0;

//--------------------------------------------------------------
//Driver settings:
//DHT22 IO23

#define DHT22_Driver_Id "dht22"
#define DHT22_Driver_Pind "IO32,VCC33,GND"

#define BMP280_Driver_Id "bmp280"
#define BMP280_Driver_Pind "IO21,IO22,ADDR0x76,VCC33,GND"

#define ADS1X15_Driver_Id "ads1x15"
#define ADS1X15_Driver_Pind "IO21,IO22,ADDR0x48,VCC33,GND"

#define CCS811_Driver_Id "ccs811"
#define CCS811_Driver_Pind "IO21,IO22,ADDR0x5A,VCC33,GND"
                             
DHTDriver *_DHTDriver = nullptr;
BMP280Driver *_BMP280Driver = nullptr;
ADS1X15Driver *_ADS1X15Driver = nullptr;
CCS811Driver *_CCS811Driver = nullptr;

void AirQualityBegin(String __topic)
{
    _topic = __topic + "/AirQuality";

    driversAdd(DHT_DRIVER_TYPE, DHT22_Driver_Id, DHT22_Driver_Pind);
    _DHTDriver = (DHTDriver*)driversGetDriver(DHT22_Driver_Id);

    driversAdd(BMP280_DRIVER_TYPE, BMP280_Driver_Id, BMP280_Driver_Pind);    
    _BMP280Driver = (BMP280Driver*)driversGetDriver(BMP280_Driver_Id);

    driversAdd(ADS1X15_DRIVER_TYPE, ADS1X15_Driver_Id, ADS1X15_Driver_Pind);    
    _ADS1X15Driver = (ADS1X15Driver*)driversGetDriver(ADS1X15_Driver_Id);

    driversAdd(CCS811_DRIVER_TYPE, CCS811_Driver_Id, CCS811_Driver_Pind);    
    _CCS811Driver = (CCS811Driver*)driversGetDriver(CCS811_Driver_Id);
}

void AirQualityLoop()
{
  if (millis() > lastPublishMillis + thingGetHTTPClientQueryInterval())  
  {
      //TODO: Query 
      lastPublishMillis = millis();

      String AirQualityPropertiesMode = "airqualityonly:" + String(thingGetHTTPClientAirQualityOnly()) + "\nqueryTime:" + String(lastPublishMillis) + "\n";

      if (_DHTDriver != nullptr)
      {
          AirQualityPropertiesMode += "DHT22:yes\n";
          AirQualityPropertiesMode += "DHT22temp:" +  _DHTDriver->temperature + "\n";
          AirQualityPropertiesMode += "DHT22temph:" +  _DHTDriver->getTemperatureHistoryData() + "\n";
          AirQualityPropertiesMode += "DHT22hum:" +  _DHTDriver->humidity + "\n";
          AirQualityPropertiesMode += "DHT22humh:" +  _DHTDriver->getHumidityHistoryData() + "\n";
          AirQualityPropertiesMode += "DHT22heat:" +  _DHTDriver->heatIndex + "\n";
          AirQualityPropertiesMode += "DHT22heath:" +  _DHTDriver->getHeatIndexHistoryData() + "\n";
          AirQualityPropertiesMode += "DHT22c:" +  String(_DHTDriver->celsius) + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "DHT22:no\n";
      }

      if (_BMP280Driver != nullptr)
      {
          AirQualityPropertiesMode += "BMP280:yes\n";
          AirQualityPropertiesMode += "BMP280pressure:" +  String(_BMP280Driver->pressure) + "\n";          
          AirQualityPropertiesMode += "BMP280pressureh:" +  String(_BMP280Driver->getPressureHistoryData()) + "\n";
          AirQualityPropertiesMode += "BMP280altitude:" +  String(_BMP280Driver->altitude) + "\n";
          AirQualityPropertiesMode += "BMP280altitudeh:" +  String(_BMP280Driver->getAltitudeHistoryData()) + "\n";
          AirQualityPropertiesMode += "BMP280temperature:" +  String(_BMP280Driver->temperature) + "\n";
          AirQualityPropertiesMode += "BMP280temperatureh:" +  String(_BMP280Driver->getTemperatureHistoryData()) + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "BMP280:no\n";
      }

      if (_ADS1X15Driver != nullptr)
      {
          AirQualityPropertiesMode += "ADS1X15:yes\n";
          AirQualityPropertiesMode += "ADS1X15MQ135:" +  String(_ADS1X15Driver->chanel_1) + "\n"; //Chanel 1 MQ135                   
          AirQualityPropertiesMode += "ADS1X15MQ135h:" +  String(_ADS1X15Driver->getChanel_1_HistoryData()) + "\n";
          AirQualityPropertiesMode += "ADS1X15MQ7:" +  String(_ADS1X15Driver->chanel_2) + "\n"; //Chanel 2 MQ7                   
          AirQualityPropertiesMode += "ADS1X15MQ7h:" +  String(_ADS1X15Driver->getChanel_2_HistoryData()) + "\n";
          AirQualityPropertiesMode += "ADS1X15Light:" +  String(_ADS1X15Driver->chanel_3) + "\n"; //Chanel 3 Light
          AirQualityPropertiesMode += "ADS1X15Lighth:" +  String(_ADS1X15Driver->getChanel_3_HistoryData()) + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "ADS1X15:no\n";
      }

      if (_CCS811Driver != nullptr)
      {
           _CCS811Driver->readData();

          AirQualityPropertiesMode += "CCS811:yes\n";
          AirQualityPropertiesMode += "CCS811CO2:" +  String(_CCS811Driver->CO2) + "\n";          
          AirQualityPropertiesMode += "CCS811CO2h:" +  String(_CCS811Driver->getCO2HistoryData()) + "\n"; 
          AirQualityPropertiesMode += "CCS811TVOC:" +  String(_CCS811Driver->TVOC) + "\n";          
          AirQualityPropertiesMode += "CCS811TVOCh:" +  String(_CCS811Driver->getTVOCHistoryData()) + "\n";          
          AirQualityPropertiesMode += "CCS811resistence:" +  String(_CCS811Driver->resistence) + "\n";          
          AirQualityPropertiesMode += "CCS811resistenceh:" +  String(_CCS811Driver->getResistenceHistoryData()) + "\n";          
          AirQualityPropertiesMode += "CCS811temp:" +  String(_CCS811Driver->temperature) + "\n";          
          AirQualityPropertiesMode += "CCS811temph:" +  String(_CCS811Driver->getTemperatureHistoryData()) + "\n";          
      }
      else 
      {
          AirQualityPropertiesMode += "CCS811:no\n";
      }

      transportPublish(_topic, AirQualityPropertiesMode);
  }
}

#endif