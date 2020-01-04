#include "OptoDevice.h"


bool OptoDevice::init()
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);
  //init properies
  getPin1();
  getPin2();

  pinMode(pin1, INPUT);
  pinMode(pin2, INPUT);

}

bool OptoDevice::begin(String _topic)
{
  BaseDevice::begin(_topic);
  setType(Opto);
  setAvailable(available);
  /*BaseDevice::*/setQueryInterval(queryInterval);
  return available;
}

bool OptoDevice::query()
{
  if (BaseDevice::query())
  {
    //for Opto publish data as it changed 
    String _data = data;
    if (!_data.equals(getData()))
    {
       onInsideChange("data", data);
    }
    return true;
  }
  return false;
};


String OptoDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "data=" + data + "\n";
  result += "pin1=" + String(pin1) + "\n";
  result += "pin2=" + String(pin2) + "\n";
  return result;
}


bool OptoDevice::publish()
{
  if (BaseDevice::publish())
  {
    onInsideChange("data", data);
    return true;
  }
  return false;
};

String OptoDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;
  //Opto sensor GPIO 2-pin (D5 by default)
  if (String(topic + "/getpin1").equals(_topic))
  {
    result = onGetProperty("pin1", String(getPin1()), transportMask);
  }
  else if (String(topic + "/setpin1").equals(_topic))
  {
          result = String(setPin1(std::atoi(_payload.c_str())));
  }
  //Opto GPIO 3-pin (D6 by default)
  else if (String(topic + "/getpin2").equals(_topic))
  {
    result = onGetProperty("pin2", String(getPin2()), transportMask);
  }
  else if (String(topic + "/setpin2").equals(_topic))
  {
          result = String(setPin2(std::atoi(_payload.c_str())));
  }
  else if ((String(topic + "/getdata").equals(_topic)) ||  (String(topic + "/setdata").equals(_topic)))
  {
    result = onGetProperty("data", getData(), transportMask);
  }
  return result;
}

//Opto -pin1 GPIO 2 (D5 by default) ----------------------------------------------------
int OptoDevice::getPin1()
{
  if (filesExists(id + ".pin1"))
  {
    pin1 = filesReadInt(id + ".pin1");
  }
    if (DetailedDebug) debugOut(id, "pin1=" + String(pin1));
  return pin1;
}

bool OptoDevice::setPin1(int _pin1)
{
  pin1 = _pin1;
  pinMode(pin1, INPUT);
  filesWriteInt(id + ".pin1", pin1);
  return onInsideChange("pin1", String(pin1));
}

//Opto -pin2 GPIO 3 (D6 by default) ----------------------------------------------------
int OptoDevice::getPin2()
{
  if (filesExists(id + ".pin2"))
  {
    pin2 = filesReadInt(id + ".pin2");
  }
    if (DetailedDebug) debugOut(id, "pin2=" + String(pin2));
  return pin2;
}

bool OptoDevice::setPin2(int _pin2)
{
  pin2 = _pin2;
  pinMode(pin2, INPUT);
  filesWriteInt(id + ".pin2", pin2);
  return onInsideChange("pin2", String(pin2));
}

String OptoDevice::getData()
{
  sensor1Condition = digitalRead(pin1);
  sensor2Condition = digitalRead(pin2);

  if (sensor1Condition == HIGH)
  { // first sensor is lighted
    if (sensor2Condition == HIGH)
    { // first sensor is lighted, second sensor is lighted
      if (motionPhase == 1 || motionPhase == 2 || motionPhase == 11 || motionPhase == 12 || motionPhase == 22) // return of motion
      {
        dataInt = 0;
      }
      if (motionPhase == 3) 
      {
        dataInt = 1;
      }
      if (motionPhase == 13) 
      {
        dataInt = 2;
      }
      // final activity
      motionPhase = 0;
      backMotionCount = 0;
    } // first sensor is lighted, second sensor is lighted
    else
    { // first sensor is lighted, second sensor is darked
      if (motionPhase == 0) 
      {
        motionPhase = 11;
        dataInt = 3;
      }
      if (motionPhase == 1) 
      {
        motionPhase = 22;
        dataInt = 3;
      }
       if (motionPhase == 2) motionPhase = 3;
      if (motionPhase == 12) 
      {
        backMotionCount ++;
        motionPhase = 11;
      }
      if (motionPhase == 13) 
      {
        motionPhase = 22;
        dataInt = 4;
      }
    } // first sensor is lighted, second sensor is darked
  } // first sensor is lighted
  else
  { // first sensor is darked
     if (sensor2Condition == HIGH)
    { // first sensor is darked, second sensor is lighted
       if (motionPhase == 0) 
      {
        motionPhase = 1;
        dataInt = 3;
      }
      if (motionPhase == 2) 
      {
        backMotionCount ++;
        motionPhase = 1;
      }
      if (motionPhase == 3 || motionPhase == 11) 
      {
        motionPhase = 22;
        dataInt = 4;
      }
      if (motionPhase == 12) motionPhase = 13;
    } // first sensor is darked, second sensor is lighted
    else
    { // first sensor is darked, second sensor is darked
      if (motionPhase == 0) 
      {
        motionPhase = 22;
        dataInt = 4;
      }
      if (motionPhase == 1) motionPhase = 2;
      if (motionPhase == 3) 
      {
        backMotionCount ++;
        motionPhase = 2;
      }
      if (motionPhase == 11) motionPhase = 12;
      if (motionPhase == 13) 
      {
        backMotionCount ++;
        motionPhase = 12;
      }
    } // first sensor is darked, second sensor is darked
  } // first sensor is darked

  data = String(dataInt);
    if (DetailedDebug) debugOut(id, "data=" + data);
  return data;
}
;
