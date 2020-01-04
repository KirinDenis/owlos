#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "motion"

class MotionDevice : public BaseDevice {
  public:
    bool init();
    bool begin(String _Topic);
    bool query();
    String getAllProperties();
    bool publish();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin();
    bool setPin(int _pin);

    int getMotion();
  private:
    int pin = MOTIONPIN;
    int motion = 0;
    float motionTriger = 0.0;
	float motionHistoryFileTriger = 0.0;
};
