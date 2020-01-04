#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "actuator1"
#define ActuatorLoopInterval 200

class ActuatorDevice : public BaseDevice {
  public:
    bool init();
    bool begin(String _topic);
    bool query();
    String getAllProperties();
    bool publish();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin();
    bool setPin(int _pin);
    int getData();
    bool setData(int _toPosition,  bool doEvent);


  private:
    int pin = ACTUATORPIN;

    int data = 0;
};
