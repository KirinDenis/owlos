#include "ValveDevice.h"

bool ValveDevice::init()
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);
  //init properies
  getPin1();
  getPin2();
  getPin3();
  pinMode(pin1, OUTPUT);
  digitalWrite(pin1, HIGH);
  pinMode(pin2, OUTPUT);
  digitalWrite(pin2, HIGH);
  pinMode(pin3, INPUT);
  return true;
}

bool ValveDevice::begin(String _topic)
{
  BaseDevice::begin(_topic);
  setType(Valve);
  setAvailable(available);
  return available;
}

bool ValveDevice::query()
{
  if (BaseDevice::query())
  {
    // publish Valve data if they are changed 
    int oldPosition = position;
    if (oldPosition != getPosition())
    {
      onInsideChange("position", String(position));
    }
    int oldphysicalposition = physicalposition;
    if (oldphysicalposition != getphysicalposition())
    {
      onInsideChange("physicalposition", String(physicalposition));
    }
    return true;
  }
  return false;
};

String ValveDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "position=" + String(position) + "\n";
  result += "pin1=" + String(pin1) + "\n";
  result += "pin2=" + String(pin2) + "\n";
  result += "pin3=" + String(pin3) + "\n";
  result += "physicalposition=" + String(physicalposition) + "\n";
  result += "minimumphysicalposition=" + String(minimumphysicalposition) + "\n";
  result += "maximumphysicalposition=" + String(maximumphysicalposition) + "\n";
  return result;
}


bool ValveDevice::publish()
{
  if (BaseDevice::publish())
  {
    onInsideChange("position", String(position));
    onInsideChange("physicalposition", String(physicalposition));
    return true;
  }
  return false;
};

String ValveDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;
  //Valve close pin1 (D1 by default)
  if (String(topic + "/getpin1").equals(_topic))
  {
    result = onGetProperty("pin1", String(getPin1()), transportMask);
  }
  else if (String(topic + "/setpin1").equals(_topic))
  {
          result = String(setPin1(std::atoi(_payload.c_str())));
  }

  //Valve open pin (D2 by default)
  else if (String(topic + "/getpin2").equals(_topic))
  {
    result = onGetProperty("pin2", String(getPin2()), transportMask);
  }
  else if (String(topic + "/setpin2").equals(_topic))
  {
          result = String(setPin2(std::atoi(_payload.c_str())));
  }

  //Valve physical position pin3 (A0 by default)
  else if (String(topic + "/getpin3").equals(_topic))
  {
    result = onGetProperty("pin3", String(getPin3()), transportMask);
  }
  else if (String(topic + "/setpin3").equals(_topic))
  {
          result = String(setPin3(std::atoi(_payload.c_str())));
  }

  else if (String(topic + "/getposition").equals(_topic))
  {
    result = onGetProperty("position", String(getPosition()), transportMask);
  }
  else if (String(topic + "/setposition").equals(_topic))
  {
          result = String(setPosition(std::atoi(_payload.c_str())));
  }

  else if (String(topic + "/getphysicalposition").equals(_topic))
  {
    result = onGetProperty("physicalposition", String(getphysicalposition()), transportMask);
  }

  else if (String(topic + "/getminimumphysicalposition").equals(_topic))
  {
    result = onGetProperty("minimumphysicalposition", String(getMinimumphysicalposition()), transportMask);
  }

  else if (String(topic + "/getmaximumphysicalposition").equals(_topic))
  {
    result = onGetProperty("maximumphysicalposition", String(getMaximumphysicalposition()), transportMask);
  }
  return result;
}

int ValveDevice::getPin1()
{
  if (filesExists(id + ".pin1"))
  {
    pin1 = filesReadInt(id + ".pin1");
  }
    if (DetailedDebug) debugOut(id, "pin1=" + String(pin1));
  return pin1;
}

bool ValveDevice::setPin1(int _pin1)
{
  pin1 = _pin1;
  pinMode(pin1, OUTPUT);
  digitalWrite(pin1, HIGH);
  filesWriteInt(id + ".pin1", pin1);
  return onInsideChange("pin1", String(pin1));
}

int ValveDevice::getPin2()
{
  if (filesExists(id + ".pin2"))
  {
    pin2 = filesReadInt(id + ".pin2");
  }
    if (DetailedDebug) debugOut(id, "pin2=" + String(pin2));
  return pin2;
}

bool ValveDevice::setPin2(int _pin2)
{
  pin2 = _pin2;
  pinMode(pin2, OUTPUT);
  digitalWrite(pin2, HIGH);
  filesWriteInt(id + ".pin2", pin2);
  return onInsideChange("pin2", String(pin2));
}

int ValveDevice::getPin3()
{
  if (filesExists(id + ".pin3"))
  {
    pin3 = filesReadInt(id + ".pin3");
  }
    if (DetailedDebug) debugOut(id, "pin3=" + String(pin3));
  return pin3;
}

bool ValveDevice::setPin3(int _pin3)
{
  pin3 = _pin3;
  pinMode(pin3, INPUT);
  filesWriteInt(id + ".pin3", pin3);
  return onInsideChange("pin3", String(pin3));
}

int ValveDevice::getphysicalposition()
{
  if (filesExists(id + ".physicalposition"))
  {
    physicalposition = filesReadInt(id + ".physicalposition");
  }
    if (DetailedDebug) debugOut(id, "physicalposition=" + String(physicalposition));
  return physicalposition;
}

int ValveDevice::getMinimumphysicalposition()
{
  if (filesExists(id + ".minimumphysicalposition"))
  {
    minimumphysicalposition = filesReadInt(id + ".minimumphysicalposition");
  }
    if (DetailedDebug) debugOut(id, "minimumphysicalposition=" + String(minimumphysicalposition));
  return minimumphysicalposition;
}

int ValveDevice::getMaximumphysicalposition()
{
  if (filesExists(id + ".maximumphysicalposition"))
  {
    maximumphysicalposition = filesReadInt(id + ".maximumphysicalposition");
  }
    if (DetailedDebug) debugOut(id, "maximumphysicalposition=" + String(maximumphysicalposition));
  return maximumphysicalposition;
}

int ValveDevice::getPosition()
{
  if (filesExists(id + ".position"))
  {
    position = filesReadInt(id + ".position");
  }
    if (DetailedDebug) debugOut(id, "position=" + String(position));
  return position;
}

bool ValveDevice::setPosition(int _position)
{
  // valve stop commands, valve has veto for all output pins LOW level
  bool result = false;
  digitalWrite(pin1, HIGH);
  digitalWrite(pin2, HIGH);
  if (_position == 0) 
  { // closing valve
    toMinMaxPosition(pin1);
    minimumphysicalposition = physicalposition;
    filesWriteInt(id + ".minimumphysicalposition", minimumphysicalposition);
    result = onInsideChange("minimumphysicalposition", String(minimumphysicalposition));
  }
  else if(_position == 100) 
  { // opening valve
    toMinMaxPosition(pin2);
    maximumphysicalposition = physicalposition;
    filesWriteInt(id + ".maximumphysicalposition", maximumphysicalposition);
    result = onInsideChange("maximumphysicalposition", String(maximumphysicalposition));
  }
  else return result; // _position must be equal 0 or 100
  // after mooving
  position = _position;
  filesWriteInt(id + ".position", position);
  onInsideChange("position", String(position));
  filesWriteInt(id + ".physicalposition", physicalposition);
  return onInsideChange("physicalposition", String(physicalposition));
}

void ValveDevice::toMinMaxPosition(int _pin)
{
  physicalposition = analogRead(pin3);
  digitalWrite(_pin, LOW); //move command
  for (int i=0; i<100; i++)
  {
    delay(500); // mooving
    newphysicalposition = analogRead(pin3);
    if (newphysicalposition == physicalposition) break; // valve is stoped
    physicalposition = newphysicalposition;
  } // for
  digitalWrite(_pin, HIGH); // stop command
}
;
