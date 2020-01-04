#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "smoke"

class SmokeDevice : public BaseDevice {
  public:
    bool begin(String _Topic);
    bool query();
    String getAllProperties();
    bool publish();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin();
    bool setPin(int _pin);

    String getSmoke();
  private:
    int pin = SMOKEPIN;
    String smoke = "nan";
};
