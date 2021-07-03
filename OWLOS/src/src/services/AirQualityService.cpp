#ifndef AIRQUALITY_SERVICE
#define AIRQUALITY_SERVICE

#include "../config.h"
#include "AirQualityService.h"
#include "DriverService.h"
#include "TransportService.h"

String _topic;
int QueryInterval = 60 *  1000;
unsigned long lastPublishMillis = 0;

//--------------------------------------------------------------
//Driver settings:
//DHT22 IO23

#define DHT22_Driver_Id "dht22"
#define DHT22_Driver_Pind "IO23,VCC33,GND"

DHTDriver *_DHTDriver = nullptr;

void AirQualityBegin(String __topic)
{
    _topic = __topic + "/AirQuality";
    driversAdd(DHT_DRIVER_TYPE, DHT22_Driver_Id, DHT22_Driver_Pind);
    _DHTDriver = (DHTDriver*)driversGetDriver(DHT22_Driver_Id);
}

void AirQualityLoop()
{
  if (millis() > lastPublishMillis + QueryInterval)  
  {
      //TODO: Query 
      lastPublishMillis = millis();

      String AirQualityPropertiesMode = "token:todoToken\n" 
      "queryTime:" + String(lastPublishMillis) + "\n";

      if (_DHTDriver != nullptr)
      {
          AirQualityPropertiesMode += "DHT22:yes\n";
          AirQualityPropertiesMode += "DHT22temp:" +  _DHTDriver->getStoredTemperature() + "\n";
          AirQualityPropertiesMode += "DHT22hum:" +  _DHTDriver->getStoredHumidity() + "\n";
          AirQualityPropertiesMode += "DHT22heat:" +  _DHTDriver->getStoredHeatIndex() + "\n";
          AirQualityPropertiesMode += "DHT22c:" +  _DHTDriver->getStoredCelsius() + "\n";
      }
      else 
      {
          AirQualityPropertiesMode += "DHT22:no\n";
      }

      transportPublish(_topic, AirQualityPropertiesMode);


  }
}

#endif