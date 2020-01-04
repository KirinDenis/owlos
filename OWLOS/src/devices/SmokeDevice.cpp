#include "SmokeDevice.h"

bool SmokeDevice::begin(String _topic)
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);

  BaseDevice::begin(_topic);
  available = true;

  trap = 80;
  setType(Smoke);
  setAvailable(available);
  return available;
}

String SmokeDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "smoke=" + smoke + "//rsi\n";
  result += "pin=" + String(pin) + "//i\n";
  return result;
}

bool SmokeDevice::query()
{
  if (BaseDevice::query())
  {
    int _smoke = std::atoi(smoke.c_str());
    getSmoke();
    float different =  std::atoi(smoke.c_str()) - _smoke;
    if ((different > trap) || (different < -trap))
    {
      onInsideChange("smoke", smoke);
    }    
    return true;
  }
  return false;
}


bool SmokeDevice::publish()
{
  if (BaseDevice::publish())
  {
    onInsideChange("smoke", smoke);
    return true;
  }
  return false;
}

String SmokeDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;
  //Smoke sensor GPIO 1-pin (A0 by default)
  if (String(topic + "/getpin").equals(_topic))
  {
    result = onGetProperty("pin", String(getPin()), transportMask);
  }
  else if (String(topic + "/setpin").equals(_topic))
  {
          result = String(setPin(std::atoi(_payload.c_str())));
  }
  else if ((String(topic + "/getsmoke").equals(_topic)) ||  (String(topic + "/setsmoke").equals(_topic)))
  {
    result = onGetProperty("smoke", getSmoke(), transportMask);
  }
  return result;
}

//Smoke Sensor 1-pin (A0 by default) ----------------------------------------------------
int SmokeDevice::getPin()
{
  if (filesExists(id + ".pin"))
  {
    pin = filesReadInt(id + ".pin");
  }
    if (DetailedDebug) debugOut(id, "pin=" + String(pin));
  return pin;
}

bool SmokeDevice::setPin(int _pin)
{
  pin = _pin;
  pinMode(pin, INPUT);
  filesWriteInt(id + ".pin", pin);
  return onInsideChange("pin", String(pin));
}


String SmokeDevice::getSmoke()
{
  int _smoke = analogRead(pin);
  smoke = String(_smoke);
    if (DetailedDebug) debugOut(id, "smoke=" + smoke);
  return smoke;
}
