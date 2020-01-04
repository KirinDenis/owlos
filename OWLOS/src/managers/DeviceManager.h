#include <Arduino.h>

#include "..\Utils\Utils.h"

#include "..\Devices\BaseDevice.h"
#include "..\Devices\DHTDevice.h"
#include "..\Devices\StepperDevice.h"
#include "..\Devices\LightDevice.h"
#include "..\Devices\SmokeDevice.h"
#include "..\Devices\MotionDevice.h"
#include "..\Devices\SensorDevice.h"
#include "..\Devices\ActuatorDevice.h"
#include "..\Devices\LCDDevice.h"
#include "..\Devices\OptoDevice.h"
#include "..\Devices\ValveDevice.h"

void devicesInit(String _topic);
void devicesBegin(String unitTopic);
void devicesLoop();
void devicesSubscribe();
void devicesCallback(String _topic, String _payload);
String devicesGetDevicesId();
BaseDevice* devicesGetDevice(String id);
String devicesGetDeviceProperty(String id, String property);
String devicesSetDeviceProperty(String id, String property, String value);
String devicesGetDeviceProperties(String id);
String devicesGetAllDevicesProperties();

bool checkPinBusy(int pin);
String devicesGetBusyPins();
String devicesGetPinsMap();
int devicesPinNameToValue(String pinName);
String devicesValueToPinName(int pinValue);
bool devicesSaveToConfig(int type, String id, int pin1, int pin2, int pin3, int pin4);
String devicesLoadFromConfig();
String devicesAdd(int type, String id, int pin1, int pin2, int pin3, int pin4);