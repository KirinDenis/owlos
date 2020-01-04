#include "StepperDevice.h"


bool StepperDevice::init()
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);

  //init properies
  getPin1();
  getPin2();
  getPin3();
  getPin4();
  getToPosition();
  getBusy();
  getStop();
  getPosition();
  getRange();
  getSpeed();

  pinMode(pin1, OUTPUT);
  pinMode(pin2, OUTPUT);
  pinMode(pin3, OUTPUT);
  pinMode(pin4, OUTPUT);

  doStop();

  if (toPosition != position)
  {
    setBusy(0);
    setToPosition(position);
  }
}

bool StepperDevice::begin(String _topic)
{
  setBusy(0);
  setStop(0);
  BaseDevice::begin(_topic);
  setType(Stepper);
  setAvailable(available);
  return available;
}

String StepperDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "position=" + String(position) + "//is\n";
  result += "pin1=" + String(pin1) + "//i\n";
  result += "pin2=" + String(pin2) + "//i\n";
  result += "pin3=" + String(pin3) + "//i\n";
  result += "pin4=" + String(pin4) + "//i\n";
  result += "toposition=" + String(toPosition) + "//is\n";
  result += "busy=" + String(busy) + "//rb\n";
  result += "stop=" + String(stop) + "//b\n";
  result += "range=" + String(range) + "//i\n";
  result += "speed=" + String(speed) + "//i\n";
  return result;
}

String StepperDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;
  //Stepper GPIO 1-pin (D4 by default)
  if (String(topic + "/getpin1").equals(_topic))
  {
    result = onGetProperty("pin1", String(getPin1()), transportMask);
  }
  else if (String(topic + "/setpin1").equals(_topic))
  {
          result = String(setPin1(std::atoi(_payload.c_str())));
  }
  else
    //Stepper GPIO 2-pin (D5 by default)
    if (String(topic + "/getpin2").equals(_topic))
    {
      result = onGetProperty("pin2", String(getPin2()), transportMask);
    }
    else if (String(topic + "/setpin2").equals(_topic))
    {
            result = String(setPin2(std::atoi(_payload.c_str())));
    }
    else
      //Stepper GPIO 3-pin (D6 by default)
      if (String(topic + "/getpin3").equals(_topic))
      {
        result = onGetProperty("pin3", String(getPin3()), transportMask);
      }
      else if (String(topic + "/setpin3").equals(_topic))
      {
              result = String(setPin3(std::atoi(_payload.c_str())));
      }
      else
        //Stepper GPIO 4-pin (D7 by default) -----------------------------------------
        if (String(topic + "/getpin4").equals(_topic))
        {
          result = onGetProperty("pin4", String(getPin4()), transportMask);
        }
        else if (String(topic + "/setpin4").equals(_topic))
        {
                result = String(setPin4(std::atoi(_payload.c_str())));
        }
        else
          //Stepper device to position step counter -----------------------------------
          if (String(topic + "/gettoposition").equals(_topic))
          {
            result = onGetProperty("toposition", String(getToPosition()), transportMask);
          }
          else if (String(topic + "/settoposition").equals(_topic))
          {
                  result = String(setToPosition(std::atoi(_payload.c_str())));
          }
          else
            //Busy ----------------------------------------------------------------------
            if (String(topic + "/getbusy").equals(_topic))
            {
              result = onGetProperty("busy", String(getBusy()), transportMask);
            }
            else if (String(topic + "/setbusy").equals(_topic))
            {
                    result = String(setBusy(std::atoi(_payload.c_str())));
            }
            else
              //Stop ----------------------------------------------------------------------
              if (String(topic + "/getstop").equals(_topic))
              {
                result = onGetProperty("stop", String(getStop()), transportMask);
              }
              else if (String(topic + "/setstop").equals(_topic))
              {
                      result = String(setStop(std::atoi(_payload.c_str())));
              }
              else
                //Position -----------------------------------------------------------------
                if (String(topic + "/getposition").equals(_topic))
                {
                  result = onGetProperty("position", String(getPosition()), transportMask);
                }
                else if (String(topic + "/setposition").equals(_topic))
                {
                        result = String(setPosition(std::atoi(_payload.c_str()), true));
                }
                else
                  //Range -----------------------------------------------------------------
                  if (String(topic + "/getrange").equals(_topic))
                  {
                    result = onGetProperty("range", String(getRange()), transportMask);
                  }
                  else if (String(topic + "/setrange").equals(_topic))
                  {
                          result = String(setRange(std::atoi(_payload.c_str())));
                  }
  //Speed ----------------------------------------------------------------
  if (String(topic + "/getspeed").equals(_topic))
  {
    result = onGetProperty("speed", String(getSpeed()), transportMask);
  }
  else if (String(topic + "/setspeed").equals(_topic))
  {
          result = String(setSpeed(std::atoi(_payload.c_str())));
  }
  return result;

}

//Stepper GPIO 1-pin (D4 by default) ----------------------------------------------------
int StepperDevice::getPin1()
{
  if (filesExists(id + ".pin1"))
  {
    pin1 = filesReadInt(id + ".pin1");
  }
    if (DetailedDebug) debugOut(id, "pin1=" + String(pin1));
  return pin1;
}

bool StepperDevice::setPin1(int _pin1)
{
  pin1 = _pin1;
  pinMode(pin1, OUTPUT);
  filesWriteInt(id + ".pin1", pin1);
  return onInsideChange("pin1", String(pin1));
}

//Stepper GPIO 2-pin (D5 by default) ----------------------------------------------------
int StepperDevice::getPin2()
{
  if (filesExists(id + ".pin2"))
  {
    pin2 = filesReadInt(id + ".pin2");
  }
    if (DetailedDebug) debugOut(id, "pin2=" + String(pin2));
  return pin2;
}

bool StepperDevice::setPin2(int _pin2)
{
  pin2 = _pin2;
  pinMode(pin2, OUTPUT);
  filesWriteInt(id + ".pin2", pin2);
  return onInsideChange("pin2", String(pin2));
}

//Stepper GPIO 3-pin (D6 by default) ----------------------------------------------------
int StepperDevice::getPin3()
{
  if (filesExists(id + ".pin3"))
  {
    pin3 = filesReadInt(id + ".pin3");
  }
    if (DetailedDebug) debugOut(id, "pin3=" + String(pin3));
  return pin3;
}

bool StepperDevice::setPin3(int _pin3)
{
  pin3 = _pin3;
  pinMode(pin3, OUTPUT);
  filesWriteInt(id + ".pin3", pin3);
  return onInsideChange("pin3", String(pin3));
}

//Stepper GPIO 4-pin (D7 by default) ----------------------------------------------------
int StepperDevice::getPin4()
{
  if (filesExists(id + ".pin4"))
  {
    pin4 = filesReadInt(id + ".pin4");
  }
    if (DetailedDebug) debugOut(id, "pin4=" + String(pin4));
  return pin4;
}

bool StepperDevice::setPin4(int _pin4)
{
  pin4 = _pin4;
  pinMode(pin4, OUTPUT);
  filesWriteInt(id + ".pin4", pin4);
  return onInsideChange("pin4", String(pin4));
}

// TO POSITION -----------------------------------------------------------------------------------------------------------
//Set toPosition property - stepper count steps to -> _toPosition value (Position property change by the stepper count way
//------------------------------------------------------------------------------------------------------------------------
int StepperDevice::getToPosition()
{
  if (filesExists(id + ".toposition"))
  {
    toPosition = filesReadInt(id + ".toposition");
  }
    if (DetailedDebug) debugOut(id, "toposition=" + String(toPosition));
  return toPosition;
}

bool StepperDevice::setToPosition(int _toPosition)
{
  if (busy == 1)
  {
    onInsideChange("busy", String(busy));
      if (DetailedDebug) debugOut(id, "Stepper busy ");
    return false;
  }
  setBusy(1);
  setStop(0);


  toPosition = _toPosition;

  if (toPosition > range)
  {
    toPosition = range;
  }
  else if (toPosition < 0)
  {
    toPosition = 0;
  }

    if (DetailedDebug) debugOut(id, "setToPosition: " + String(_toPosition) + "->" + String(toPosition));
  filesWriteInt(id + ".toposition", toPosition);
  onInsideChange("toposition", String(toPosition));

  int count = toPosition - position;

  while ( count > 0 ) {
    if (stop == 1) break;
    for (int i = 0; i < 8; i++)
    {
      doOutput(i);
      delayMicroseconds(speed);
    }
    count--;
    setPosition(++position, false);

    if (position % 5 == 0)
    {
      transportLoop();
    }
    if (position % StepperLoopInterval == 0)
    {
      setPosition(position, true);
    }
  }

  while ( count < 0 ) {
    if (stop == 1) break;
    for (int i = 7; i >= 0; i--)
    {
      doOutput(i);
      delayMicroseconds(speed);
    }
    count++;

    setPosition(--position, false);
    if (position % 5 == 0)
    {
      transportLoop();
    }
    if (position % StepperLoopInterval == 0)
    {
      setPosition(position, true);
    }
  }
  setPosition(position, true);
  setStop(1);
  setBusy(0);
  return true;
}

// Busy -------------------------------------------
int StepperDevice::getBusy()
{
  if (filesExists(id + ".busy"))
  {
    busy = filesReadInt(id + ".busy");
  }
    if (DetailedDebug) debugOut(id, "busy=" + String(busy));
  return busy;
}

bool StepperDevice::setBusy(int _busy)
{
  busy = _busy;
  filesWriteInt(id + ".busy", busy);
  return onInsideChange("busy", String(busy));
}

// Stop -------------------------------------------
int StepperDevice::getStop()
{
  if (filesExists(id + ".stop"))
  {
    stop = filesReadInt(id + ".stop");
  }
    if (DetailedDebug) debugOut(id, "stop=" + String(stop));
  return stop;
}

bool StepperDevice::setStop(int _stop) {
  stop = _stop;
  filesWriteInt(id + ".stop", stop);
  bool result = onInsideChange("stop", String(stop));
  if (stop == 1)
  {
    doStop();
  }
  return result;
}

//Position -------------------------------------------
int StepperDevice::getPosition()
{
  if (filesExists(id + ".position"))
  {
    position = filesReadInt(id + ".position");
  }
    if (DetailedDebug) debugOut(id, "position=" + String(position));
  return position;
}

bool StepperDevice::setPosition(int _position, bool doEvent)
{
  position = _position;

  if (doEvent)
  {
    filesWriteInt(id + ".position", position);
    return onInsideChange("position", String(position));
  }
  return true;
}

//Range -------------------------------------------
int StepperDevice::getRange()
{
  if (filesExists(id + ".range"))
  {
    range = filesReadInt(id + ".range");
  }
    if (DetailedDebug) debugOut(id, "range=" + String(range));
  return range;
}

bool StepperDevice::setRange(int _range)
{
  range = _range;
  filesWriteInt(id + ".range", range);
  return onInsideChange("range", String(range));
}

//Speed -------------------------------------------
int StepperDevice::getSpeed()
{
  if (filesExists(id + ".speed"))
  {
    speed = filesReadInt(id + ".speed");
  }
    if (DetailedDebug) debugOut(id, "speed=" + String(speed));
  return speed;
}

bool StepperDevice::setSpeed(int _speed)
{
  speed = _speed;
  filesWriteInt(id + ".speed", speed);
  return onInsideChange("speed", String(speed));
}


//------------------------------------------------------------------------------------------------
//DO ---------------------------------------------------------------------------------------------
//DO Stop ----------------------------------------------------------------------------------------
void StepperDevice::doStop()
{
  digitalWrite(pin1, B00000);
  digitalWrite(pin2, B00000);
  digitalWrite(pin3, B00000);
  digitalWrite(pin4, B00000);
}

void StepperDevice::doOutput(int out) {
  digitalWrite(pin1, bitRead(lookup[out], 0));
  digitalWrite(pin2, bitRead(lookup[out], 1));
  digitalWrite(pin3, bitRead(lookup[out], 2));
  digitalWrite(pin4, bitRead(lookup[out], 3));
};
