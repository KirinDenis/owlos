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
#define DHT22_Driver_Pind "IO23,VCC33,GND"

#define Light_Driver_Id "light"
#define Light_Driver_Pind "IO33,VCC33,GND"

#define Resistor_Driver_Id "resistor"
#define Resistor_Driver_Pind "IO32,VCC33,GND"

#define MQ7_Driver_Id "mq7"
#define MQ7_Driver_Pind "IO35,VCC33,GND"

#define Motion_Driver_Id "motion"
#define Motion_Driver_Pind "IO22,VCC33,GND"

DHTDriver *_DHTDriver = nullptr;
SensorDriver *_LightDriver = nullptr;
SensorDriver *_ResistorDriver = nullptr;
SensorDriver *_MQ7Driver = nullptr;
SensorDriver *_MotionDriver = nullptr;

void AirQualityBegin(String __topic)
{
    _topic = __topic + "/AirQuality";

    driversAdd(DHT_DRIVER_TYPE, DHT22_Driver_Id, DHT22_Driver_Pind);
    _DHTDriver = (DHTDriver*)driversGetDriver(DHT22_Driver_Id);

    driversAdd(SENSOR_DRIVER_TYPE, Light_Driver_Id, Light_Driver_Pind);
    _LightDriver = (SensorDriver*)driversGetDriver(Light_Driver_Id);

    driversAdd(SENSOR_DRIVER_TYPE, Resistor_Driver_Id, Resistor_Driver_Pind);    
    _ResistorDriver = (SensorDriver*)driversGetDriver(Resistor_Driver_Id);

    driversAdd(SENSOR_DRIVER_TYPE, MQ7_Driver_Id, MQ7_Driver_Pind);    
    _MQ7Driver = (SensorDriver*)driversGetDriver(MQ7_Driver_Id);

    driversAdd(SENSOR_DRIVER_TYPE, Motion_Driver_Id, Motion_Driver_Pind);    
    _MotionDriver = (SensorDriver*)driversGetDriver(Motion_Driver_Id);
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

      if (_MotionDriver != nullptr)
      {
          AirQualityPropertiesMode += "Motion:yes\n";
          AirQualityPropertiesMode += "Motiondata:" +  String(_MotionDriver->getData()) + "\n";
          AirQualityPropertiesMode += "Motiondatah:" +  _MotionDriver->getHistoryData() + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "Motion:no\n";
      }


      transportPublish(_topic, AirQualityPropertiesMode);
  }
}

#endif