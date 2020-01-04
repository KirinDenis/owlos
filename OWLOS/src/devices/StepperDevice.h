#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "stepper1"
#define StepperLoopInterval 200

class StepperDevice : public BaseDevice {
  public:
    bool init();
    bool begin(String _topic);
    String getAllProperties();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin1();
    bool setPin1(int _pin1);
    int getPin2();
    bool setPin2(int _pin2);
    int getPin3();
    bool setPin3(int _pin3);
    int getPin4();
    bool setPin4(int _pin4);
    int getToPosition();
    bool setToPosition(int _toPosition);
    int getBusy();
    bool setBusy(int _busy);
    int getStop();
    bool setStop(int _stop);
    int getPosition();
    bool setPosition(int _toPosition,  bool doEvent);
    int getRange();
    bool setRange(int _range);
    int getSpeed();
    bool setSpeed(int _speed);


  private:
    int pin1 = STEPPERPIN1;
    int pin2 = STEPPERPIN2;
    int pin3 = STEPPERPIN3;
    int pin4 = STEPPERPIN4;

    int toPosition = 5000;
    int busy = 0;
    int stop = 1;
    int position = 5000;
    int range = 10000;
    int speed = 2000;

    int lookup[8] = {B01000, B01100, B00100, B00110, B00010, B00011, B00001, B01001};
    int countsperrev = 512; // number of steps per full revolution

    void doStop();
    void doOutput(int out);
};
