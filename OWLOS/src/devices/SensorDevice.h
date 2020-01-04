#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "sensor"

class SensorDevice : public BaseDevice {
  public:
    bool init();
    bool begin(String _Topic);
    bool query();
    String getAllProperties();
    bool publish();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin();
    bool setPin(int _pin);

    String getData();
  private:
    int pin = SENSORPIN;
    String data = "nan";
	float sensorTriger = 0;
};
