#include "LightDevice.h"

bool LightDevice::begin(String _topic)
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);

  BaseDevice::begin(_topic);
  available = true;
  setType(Light);
  setAvailable(available);
  //TEMP:
  trap = 50;
  return available;
}

bool LightDevice::query()
{
  if (BaseDevice::query())
  {
    int _light = std::atoi(light.c_str());
    getLight();
    int different =  std::atoi(light.c_str()) - _light;
    if ((different > trap) || (different < -trap))
    {
      onInsideChange("light", light);
    }
    return true;
  }
  return false;
};


String LightDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "light=" + light + "\n";
  result += "pin=" + String(pin) + "\n";
  return result;
}


bool LightDevice::publish()
{
  if (BaseDevice::publish())
  {
    onInsideChange("light", light);
    return true;
  }
  return false;
};

String LightDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;

  //Light sensor GPIO 1-pin (A0 by default)
  if (String(topic + "/getpin").equals(_topic))
  {
    result = onGetProperty("pin", String(getPin()), transportMask);
  }
  else if (String(topic + "/setpin").equals(_topic))
  {
          result = String(setPin(std::atoi(_payload.c_str())));
  }
  else if ((String(topic + "/getlight").equals(_topic)) ||  (String(topic + "/setlight").equals(_topic)))
  {
    result = onGetProperty("light", getLight(), transportMask);
  }
  return result;
}

//Light Sensor 1-pin (A0 by default) ----------------------------------------------------
int LightDevice::getPin()
{
  if (filesExists(id + ".pin"))
  {
    pin = filesReadInt(id + ".pin");
  }
    if (DetailedDebug) debugOut(id, "pin=" + String(pin));
  return pin;
}

bool LightDevice::setPin(int _pin)
{
  pin = _pin;
  pinMode(pin, INPUT);
  filesWriteInt(id + ".pin", pin);
  if (available)
  {
    return onInsideChange("pin", String(pin));
  }
  return true;
}


String LightDevice::getLight()
{
  int _light = analogRead(pin);
  light = String(_light);
    if (DetailedDebug) debugOut(id, "light=" + light);
  return light;
}
