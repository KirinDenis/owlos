#include "SensorDevice.h"

bool SensorDevice::init()
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);

  getPin();
  pinMode(pin, INPUT);
}


bool SensorDevice::begin(String _topic)
{
  BaseDevice::begin(_topic);
  available = true;
  setType(Sensor);
  setAvailable(available);
  return available;
}

bool SensorDevice::query()
{
  if (BaseDevice::query())
  {
    //for sensor publish data() as it changed 
    String _data = data;
    if (!_data.equals(getData()))
    {
       onInsideChange("data", data);
	   //TODO getData return int, check if getData == 0
	   sensorTriger++;
    }

	//Fill array of history data
	if (millis() >= lastHistoryMillis + historyInterval)
	{
		lastHistoryMillis = millis();
		setHistoryData(sensorTriger);
	}

    return true;
  }
  return false;
};


String SensorDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "data=" + data + "//rb\n";
  result += "pin=" + String(pin) + "//i\n";
  return result;
}


bool SensorDevice::publish()
{
  if (BaseDevice::publish())
  {
    onInsideChange("data", data);
    return true;
  }
  return false;
};

String SensorDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;
  //Sensor sensor GPIO 1-pin (A0 by default)
  if (String(topic + "/getpin").equals(_topic))
  {
    result = onGetProperty("pin", String(getPin()), transportMask);
  }
  else if (String(topic + "/setpin").equals(_topic))
  {
          result = String(setPin(std::atoi(_payload.c_str())));
  }
  else if ((String(topic + "/getdata").equals(_topic)) ||  (String(topic + "/setdata").equals(_topic)))
  {
    result = onGetProperty("data", getData(), transportMask);
  }
  return result;
}

//Sensor Sensor 1-pin (A0 by default) ----------------------------------------------------
int SensorDevice::getPin()
{
  if (filesExists(id + ".pin"))
  {
    pin = filesReadInt(id + ".pin");
  }
    if (DetailedDebug) debugOut(id, "pin=" + String(pin));
  return pin;
}

bool SensorDevice::setPin(int _pin)
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


String SensorDevice::getData()
{
  int _data = digitalRead(pin);
  data = String(_data);
    if (DetailedDebug) debugOut(id, "data=" + data);
  return data;
}
