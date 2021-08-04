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

#define Light_Driver_Id "light"
#define Light_Driver_Pind "IO33,VCC33,GND"

#define Resistor_Driver_Id "resistor"
#define Resistor_Driver_Pind "IO32,VCC33,GND"

#define MQ7_Driver_Id "mq7"
#define MQ7_Driver_Pind "IO35,VCC33,GND"

#define BMP280_Driver_Id "bmp280"
#define BMP280_Driver_Pind "IO21,IO22,ADDR0x76,VCC33,GND"
                             
DHTDriver *_DHTDriver = nullptr;
SensorDriver *_LightDriver = nullptr;
SensorDriver *_ResistorDriver = nullptr;
SensorDriver *_MQ7Driver = nullptr;
BMP280Driver *_BMP280Driver = nullptr;

void AirQualityBegin(String __topic)
{
    _topic = __topic + "/AirQuality";

    driversAdd(DHT_DRIVER_TYPE, DHT22_Driver_Id, DHT22_Driver_Pind);
    _DHTDriver = (DHTDriver*)driversGetDriver(DHT22_Driver_Id);

//    driversAdd(SENSOR_DRIVER_TYPE, Light_Driver_Id, Light_Driver_Pind);
//    _LightDriver = (SensorDriver*)driversGetDriver(Light_Driver_Id);

    //driversAdd(SENSOR_DRIVER_TYPE, Resistor_Driver_Id, Resistor_Driver_Pind);    
    //_ResistorDriver = (SensorDriver*)driversGetDriver(Resistor_Driver_Id);

    //driversAdd(SENSOR_DRIVER_TYPE, MQ7_Driver_Id, MQ7_Driver_Pind);    
    //_MQ7Driver = (SensorDriver*)driversGetDriver(MQ7_Driver_Id);

    driversAdd(BMP280_DRIVER_TYPE, BMP280_Driver_Id, BMP280_Driver_Pind);    
    _BMP280Driver = (BMP280Driver*)driversGetDriver(BMP280_Driver_Id);
    
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
          AirQualityPropertiesMode += "DHT22temp:" +  _DHTDriver->getStoredTemperature() + "\n";
          AirQualityPropertiesMode += "DHT22temph:" +  _DHTDriver->getTemperatureHistoryData() + "\n";
          AirQualityPropertiesMode += "DHT22hum:" +  _DHTDriver->getStoredHumidity() + "\n";
          AirQualityPropertiesMode += "DHT22humh:" +  _DHTDriver->getHumidityHistoryData() + "\n";
          AirQualityPropertiesMode += "DHT22heat:" +  _DHTDriver->getStoredHeatIndex() + "\n";
          AirQualityPropertiesMode += "DHT22heath:" +  _DHTDriver->getHeatIndexHistoryData() + "\n";
          AirQualityPropertiesMode += "DHT22c:" +  _DHTDriver->getStoredCelsius() + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "DHT22:no\n";
      }

      if (_LightDriver != nullptr)
      {
          AirQualityPropertiesMode += "Light:yes\n";
          AirQualityPropertiesMode += "Lightdata:" +  String(_LightDriver->getData()) + "\n";
          AirQualityPropertiesMode += "Lightdatah:" +  _LightDriver->getHistoryData() + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "Light:no\n";
      }

      if (_ResistorDriver != nullptr)
      {
          AirQualityPropertiesMode += "Resistor:yes\n";
          AirQualityPropertiesMode += "Resistordata:" +  String(_ResistorDriver->getData()) + "\n";
          AirQualityPropertiesMode += "Resistordatah:" +  _ResistorDriver->getHistoryData() + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "Resistor:no\n";
      }

      if (_MQ7Driver != nullptr)
      {
          AirQualityPropertiesMode += "MQ7:yes\n";
          AirQualityPropertiesMode += "MQ7data:" +  String(_MQ7Driver->getData()) + "\n";
          AirQualityPropertiesMode += "MQ7datah:" +  _MQ7Driver->getHistoryData() + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "MQ7:no\n";
      }

      if (_BMP280Driver != nullptr)
      {
          AirQualityPropertiesMode += "BMP280:yes\n";
          AirQualityPropertiesMode += "BMP280pressure:" +  String(_BMP280Driver->getPressure()) + "\n";          
      }
      else 
      {
          AirQualityPropertiesMode += "BMP280:no\n";
      }


      transportPublish(_topic, AirQualityPropertiesMode);
  }
}

#endif