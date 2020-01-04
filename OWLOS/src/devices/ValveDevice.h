#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "valve"

class ValveDevice : public BaseDevice {
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
    int getPin3();
    bool setPin3(int _pin3);
    int getPosition();
    bool setPosition(int _position);
    int getMinimumphysicalposition();
    int getMaximumphysicalposition();
    int getphysicalposition();

  private:
  void toMinMaxPosition(int _pin);
    int pin1 = D1;
    int pin2 = D2;
    int pin3 = A0;
    int position=0; // 0 - close, 100 - open
    int minimumphysicalposition = 0; // valve is close
    int maximumphysicalposition = 1023; // valve is open
    int physicalposition = 0; // valve first is close
    int newphysicalposition=0;

};
