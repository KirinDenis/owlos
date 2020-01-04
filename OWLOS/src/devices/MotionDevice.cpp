#include "MotionDevice.h"

bool MotionDevice::init()
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);

  //init properies
  getPin();
  pinMode(pin, INPUT);
}

bool MotionDevice::begin(String _topic)
{
  BaseDevice::begin(_topic);
  available = true;
  setType(Motion);
  setAvailable(available);
  return available;
}

String MotionDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "motion=" + String(motion) + "\n";
  result += "pin=" + String(pin) + "\n";
  return result;
}

bool MotionDevice::query()
{
  if (BaseDevice::query())
  {
    int _motion = motion;
    getMotion();
    if (_motion != motion)
    {
      onInsideChange("motion", String(motion));
      motionTriger++;
    }

	//Fill array of history data
	if (millis() >= lastHistoryMillis + historyInterval)
	{
                if (motion == 1)  motionTriger++; //motion all time at "1"
		lastHistoryMillis = millis();
		setHistoryData(motionTriger);
		motionHistoryFileTriger = motionTriger;
		motionTriger = 0.0;
	}

	//Write history data to file
	if (millis() >= lastHistoryFileWriteMillis + historyFileWriteInterval)
	{
		if (motion == 1)  motionHistoryFileTriger++; //motion all time at "1"
		lastHistoryFileWriteMillis = millis();
		writeHistoryFile(motionHistoryFileTriger);
		motionHistoryFileTriger = 0.0;
	}


    return true;
  }
  return false;
};


bool MotionDevice::publish()
{
  if (BaseDevice::publish())
  {
    onInsideChange("motion", String(motion));
    return true;
  }
  return false;
};

String MotionDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;
  //Motion sensor GPIO 1-pin (A0 by default)
  if (String(topic + "/getpin").equals(_topic))
  {
    result = onGetProperty("pin", String(getPin()), transportMask);
  }
  else if (String(topic + "/setpin").equals(_topic))
  {
          result = String(setPin(std::atoi(_payload.c_str())));
  }
  else if ((String(topic + "/getmotion").equals(_topic)) ||  (String(topic + "/setmotion").equals(_topic)))
  {
    result = onGetProperty("motion", String(getMotion()), transportMask);
  }
  return result;
}

//Motion Sensor 1-pin (A0 by default) ----------------------------------------------------
int MotionDevice::getPin()
{
  if (filesExists(id + ".pin"))
  {
    pin = filesReadInt(id + ".pin");
  }
    if (DetailedDebug) debugOut(id, "pin=" + String(pin));
  return pin;
}

bool MotionDevice::setPin(int _pin)
{
  pin = _pin;
  pinMode(pin, INPUT);
  filesWriteInt(id + ".pin", pin);
  return onInsideChange("pin", String(pin));
}


int MotionDevice::getMotion()
{
  motion = digitalRead(pin);
  if (DetailedDebug) debugOut(id, "motion=" + String(motion));  
  return motion;
}
