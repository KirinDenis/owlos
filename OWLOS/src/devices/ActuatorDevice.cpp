#include "ActuatorDevice.h"

bool ActuatorDevice::init()
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);
  //init properies 
  getPin();
  pinMode(pin, OUTPUT);  

  getData();  
  setData(data, false);
}

bool ActuatorDevice::begin(String _topic)
{  
  BaseDevice::begin(_topic);    
  setType(Actuator);
  setAvailable(available);
  return available;
}

bool ActuatorDevice::query()
{
  if (BaseDevice::query())
  {
    //for actuator publish data() as it changed 
    int _data = data;
    if (_data != getData())
    {
       onInsideChange("data", String(data));
    }
    return true;
  }
  return false;
};


String ActuatorDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "data=" + String(data) + "//b\n";
  result += "pin=" + String(pin) + "//i\n";
  return result;
}


bool ActuatorDevice::publish()
{
  if (BaseDevice::publish())
  {
    onInsideChange("data", String(data));
    return true;
  }
  return false;
};


String ActuatorDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);

  if (!available) return result;

  //Actuator GPIO 1-pin (D4 by default)
  if (String(topic+"/getpin").equals(_topic)) 
  {
    result = onGetProperty("pin", String(getPin()), transportMask);
  }
  else   
  if (String(topic+"/setpin").equals(_topic)) 
  {
          result = String(setPin(std::atoi(_payload.c_str())));
  }  
  else   
  //Position -----------------------------------------------------------------
  if (String(topic+"/getdata").equals(_topic)) 
  {
    result = onGetProperty("data", String(getData()), transportMask);
  }
  else        
  if (String(topic+"/setdata").equals(_topic)) 
  {
          result = String(setData(std::atoi(_payload.c_str()), true));
  }      
  return result;
}

//Actuator GPIO 1-pin (D4 by default) ----------------------------------------------------
int ActuatorDevice::getPin()
{
  if (filesExists(id + ".pin"))
  {
    pin = filesReadInt(id + ".pin");
  }
    if (DetailedDebug) debugOut(id, "pin=" + String(pin));   
  return pin;
}

bool ActuatorDevice::setPin(int _pin)
{
  pin = _pin;
  pinMode(pin, OUTPUT);  
  filesWriteInt(id + ".pin", pin);
  if (available)
  {
    return onInsideChange("pin", String(pin));  
  }
  return true;
}


//Data -------------------------------------------
int ActuatorDevice::getData()
{
  if (filesExists(id + ".data"))
  {
    data = filesReadInt(id + ".data");
  }
    if (DetailedDebug) debugOut(id, "data=" + String(data));   
  return data;
}

bool ActuatorDevice::setData(int _data, bool doEvent)
{
  data = _data;
  digitalWrite(pin, data);
  if (doEvent)
  {
    filesWriteInt(id + ".data", data);
    return onInsideChange("data", String(data));
  }
  return true;
}
;
