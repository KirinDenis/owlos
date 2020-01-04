#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "opto"

class OptoDevice : public BaseDevice {
  public:
    bool init();
    bool begin(String _topic);
    bool query();
    String getAllProperties();
    bool publish();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin1();
    bool setPin1(int _pin1);
    int getPin2();
    bool setPin2(int _pin2);
    String getData();

  private:
    int pin1 = OPTOSENSORPIN1;
    int pin2 = OPTOSENSORPIN2;
    String data = "nan";

    unsigned long queryInterval = ONETENTHOFSECOND;
    int sensor1Condition = 0;
    int sensor2Condition = 0;
    int dataInt = 0;
    /* returned phase of motion:
      0 - no motion
      1 - end of motion from sensor1 to sensor2
      2 - end of motion from sensor2 to sensor1
      3 - motion
      4 - dimension error*/
    int motionPhase = 0;
    /* phase of motion:
      0 - no motion or motion is ended, null phase
      1 - sensor1 is darked, motion is starting from sensor1 to sensor2
      2 - sensor 1 and sensor 2 are darked, motion is continueing from sensor1 to sensor2
      3 - sensor 2 is darked, motion is ending from sensor1 to sensor2
      11 - sensor2 is darked, motion is starting from sensor2 to sensor1
      12 - sensor1 and sensor2 are darked, motion is continueing from sensor2 to sensor1
      13 - sensor1 is darked, motion is ending from sensor2 to sensor1
      22 - error */
    int backMotionCount = 0;

};
