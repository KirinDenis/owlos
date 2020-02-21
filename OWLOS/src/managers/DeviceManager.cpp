/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWL OS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/


//ALL DEVICES constructors must be called here, current unit topic must be puted as parameter
#include "DeviceManager.h"
#include "..\..\UnitProperties.h"

String __topic;
String busyPins;

#define DevicesLimit 20
int devicesCount = 0;
BaseDevice * devicesList[DevicesLimit];


void devicesInit(String _topic)
{
	__topic = _topic;
	
#ifdef DetailedDebug
	debugOut("deviceconfig", devicesLoadFromConfig());
#else
	devicesLoadFromConfig();
#endif

}

void devicesBegin(String unitTopic)
{
	for (int i = 0; i < devicesCount; i++)
	{
		devicesList[i]->begin(unitTopic);
	}
}

void devicesLoop()
{
	//ALL DEVICES must be call .publish() method from this main loop procedure
	for (int i = 0; i < devicesCount; i++)
	{
		devicesList[i]->query();
		devicesList[i]->publish();
	}
}

void devicesSubscribe()
{
	//ALL DEVICES method .subscribe() must be called here with current _topic and _payload values
	for (int i = 0; i < devicesCount; i++)
	{
		devicesList[i]->subscribe();
	}
}

void devicesCallback(String _topic, String _payload)
{
	//ALL DEVICES method .onMessage() must be called here with current _topic and _payload values
	for (int i = 0; i < devicesCount; i++)
	{
		devicesList[i]->onMessage(_topic, _payload, MQTTMask);
	}
}

String devicesGetDevicesId()
{
	String result = "deviceid;type;available\n";
	for (int i = 0; i < devicesCount; i++)
	{
		result += devicesList[i]->id + ";" + String(devicesList[i]->getType()) + ";" + String(devicesList[i]->getAvailable()) + "\n";
	}
	return result;
};

BaseDevice* devicesGetDevice(String id)
{
	for (int i = 0; i < devicesCount; i++)
	{
		if (devicesList[i]->id.equals(id))
		{
			return devicesList[i];
		}
	}
	return NULL;
}

String devicesGetDeviceProperty(String id, String property)
{
	BaseDevice* baseDevice = devicesGetDevice(id);
	if (baseDevice == NULL) return "";

	return baseDevice->onMessage(__topic + "/" + id + "/get" + property, "", NoTransportMask);
}

String devicesSetDeviceProperty(String id, String property, String value)
{
	BaseDevice* baseDevice = devicesGetDevice(id);
	if (baseDevice == NULL) return "";

	return baseDevice->onMessage(__topic + "/" + id + "/set" + property, value, MQTTMask);
}

String devicesGetDeviceProperties(String id)
{
	BaseDevice* baseDevice = devicesGetDevice(id);
	if (baseDevice == NULL) return "";
	return baseDevice->getAllProperties();
}

String devicesGetAllDevicesProperties()
{
	String result = unitGetAllProperties();
	for (int i = 0; i < devicesCount; i++)
	{
		result += "properties for:" + devicesList[i]->id + "\n";
		result += devicesList[i]->getAllProperties();
	}
	return result;
}

bool checkPinBusy(int pin)
{
	if (pin < 0) return false;
	if (busyPins.indexOf(":" + String(pin) + ";") >= 0) return true;
}

void addBusyPin(int type, String id, int pin)
{
	busyPins += "[" + String(type) + "]" + id + ":" + String(pin) + ";";
}

String devicesGetBusyPins()
{
	return busyPins;
}

String checkPinMaping(int pin)
{
	switch (pin)
	{
	case -1: //pin not used
	case D0:
	case D1:
	case D2:
	case D3:
	case D4:
	case D5:
	case D6:
	case D7:
	case D8:
#ifdef ARDUINO_ESP8266_NODEMCU
	case D9:
	case D10:
#endif
	case A0: return String();
	}
	return "wrong pin maping value, at this board model available next pin's values: " + devicesGetPinsMap();
}


String devicesGetPinsMap()
{
	return "D0-" + String(D0) + ";" +
		"D1-" + String(D1) + ";" +
		"D2-" + String(D2) + ";" +
		"D3-" + String(D3) + ";" +
		"D4-" + String(D4) + ";" +
		"D5-" + String(D5) + ";" +
		"D6-" + String(D6) + ";" +
		"D7-" + String(D7) + ";" +
		"D8-" + String(D8) + ";" +
#ifdef ARDUINO_ESP8266_NODEMCU
		"D9-" + String(D9) + ";" +
		"D10-" + String(D10) + ";" +
#endif
		"BUILTIN_LED-" + String(BUILTIN_LED) + ";" +
		"A0-" + String(A0) + ";";
}

int devicesPinNameToValue(String pinName)
{
	if (pinName.equals("D0")) return D0;
	if (pinName.equals("D1")) return D1;
	if (pinName.equals("D2")) return D2;
	if (pinName.equals("D3")) return D3;
	if (pinName.equals("D4")) return D4;
	if (pinName.equals("D5")) return D5;
	if (pinName.equals("D6")) return D6;
	if (pinName.equals("D7")) return D7;
	if (pinName.equals("D8")) return D8;
#ifdef ARDUINO_ESP8266_NODEMCU
	if (pinName.equals("D9")) return D9;
	if (pinName.equals("D10")) return D10;
#endif
	if (pinName.equals("A0")) return A0;
	return -1;
}

String devicesValueToPinName(int pinValue)
{
	if (pinValue == D0) return "D0";
	if (pinValue == D1) return "D1";
	if (pinValue == D2) return "D2";
	if (pinValue == D3) return "D3";
	if (pinValue == D4) return "D4";
	if (pinValue == D5) return "D5";
	if (pinValue == D6) return "D6";
	if (pinValue == D7) return "D7";
	if (pinValue == D8) return "D8";
#ifdef ARDUINO_ESP8266_NODEMCU
	if (pinValue == D9) return "D9";
	if (pinValue == D10) return "D10";
#endif
	if (pinValue == A0) return "A0";
	return String();
}

bool devicesSaveToConfig(int type, String id, int pin1, int pin2, int pin3, int pin4)
{
	String device = String(type) + ";" + id + ";" + String(pin1) + ";" + String(pin2) + ";" + String(pin3) + ";" + String(pin4) + ";\n";
	return filesAppendString("deviceslist", device);
}

String devicesLoadFromConfig()
{
#ifdef DetailedDebug
	debugOut("deviceconfig", "load");
#endif
	String deviceList = filesReadString("deviceslist");
	if (deviceList.length() == 0) return "bad device list counfig file";

	String result = String();

	String lineDelimiter = "\n";
	String valueDelimiter = ";";

	int linePos = 0;
	String line;

#ifdef DetailedDebug
	debugOut("deviceconfig", "doparse");
#endif

	while ((linePos = deviceList.indexOf(lineDelimiter)) != -1)
	{
		line = deviceList.substring(0, linePos);
		int valuePos = 0;
		int valueCount = 0;
		String value;
		String type;
		String id;
		String pin1;
		String pin2;
		String pin3;
		String pin4;
		while ((valuePos = line.indexOf(valueDelimiter)) != -1)
		{
			value = line.substring(0, valuePos);
			switch (valueCount)
			{
			case 0: type = value; break;
			case 1: id = value; break;
			case 2: pin1 = value; break;
			case 3: pin2 = value; break;
			case 4: pin3 = value; break;
			case 5: pin4 = value; break;
			}
			valueCount++;
			line.remove(0, valuePos + valueDelimiter.length());
		}
		if (id.length() != 0)
		{
			result += "{" + devicesAdd(std::atoi(type.c_str()), id, std::atoi(pin1.c_str()), std::atoi(pin2.c_str()), std::atoi(pin3.c_str()), std::atoi(pin4.c_str())) + "}";
		}

		deviceList.remove(0, linePos + lineDelimiter.length());
	}
	return result;
}

//External device manager API -------------------------------------------------
String devicesAdd(int type, String id, int pin1, int pin2, int pin3, int pin4)
{
#ifdef DetailedDebug
	debugOut("devicesadd", id);
	debugOut("devicesadd", busyPins);
#endif
	if (devicesCount >= DevicesLimit) return "bad, devices count out of limit range";
	if (id.length() == 0) return "bad, id is zero length string";
	if (type < 0) return "bad, device type";

	if (checkPinBusy(pin1)) return "bad, pin1:" + String(pin1) + " busy " + busyPins;
	if (checkPinBusy(pin2)) return "bad, pin2:" + String(pin2) + " busy " + busyPins;
	if (checkPinBusy(pin3)) return "bad, pin3:" + String(pin3) + " busy " + busyPins;
	if (checkPinBusy(pin4)) return "bad, pin4:" + String(pin4) + " busy " + busyPins;

	String pinMaping = checkPinMaping(pin1);
	if (pinMaping.length() != 0) return "bad, pin1:" + String(pin1) + " " + pinMaping;
	pinMaping = checkPinMaping(pin2);
	if (pinMaping.length() != 0) return "bad, pin2:" + String(pin2) + " " + pinMaping;
	pinMaping = checkPinMaping(pin3);
	if (pinMaping.length() != 0) return "bad, pin3:" + String(pin3) + " " + pinMaping;
	pinMaping = checkPinMaping(pin4);
	if (pinMaping.length() != 0) return "bad, pin4:" + String(pin4) + " " + pinMaping;

	id.toLowerCase();

	for (int i = 0; i < devicesCount; i++)
	{
		if (devicesList[i]->id.equals(id)) return "bad, id: " + id + " exists";
	}

	if (type == DHTDeviceType)
	{

		DHTDevice * dhtDevice = new DHTDevice;
		dhtDevice->init(id);
		dhtDevice->id = id;
		dhtDevice->setPin(pin1);
		addBusyPin(type, id + "DHT", pin1);
		devicesCount++;
		devicesList[devicesCount - 1] = dhtDevice;
	}
	else
			if (type == Light)
			{
				if (pin1 < 0) return "bad, pin1 wrong value";
				LightDevice * lightDevice = new LightDevice;
				lightDevice->init(id);
				lightDevice->setPin(pin1);
				addBusyPin(type, id, pin1);
				devicesCount++;
				devicesList[devicesCount - 1] = lightDevice;
			}
			else
				if (type == Smoke)
				{
					if (pin1 <= 0) return "bad, pin1 wrong value";
					SmokeDevice * smokeDevice = new SmokeDevice;
					smokeDevice->init(id);
					smokeDevice->setPin(pin1);
					addBusyPin(type, id, pin1);
					devicesCount++;
					devicesList[devicesCount - 1] = smokeDevice;
				}
				else
					if (type == Motion)
					{
						if (pin1 < 0) return "bad, pin1 wrong value";
						MotionDevice * motionDevice = new MotionDevice;
						motionDevice->id = id;
						motionDevice->setPin(pin1);
						addBusyPin(type, id, pin1);
						motionDevice->init();
						devicesCount++;
						devicesList[devicesCount - 1] = motionDevice;
					}
					else
						if (type == Sensor)
						{
							if (pin1 < 0) return "bad, pin1 wrong value";
							SensorDevice * sensorDevice = new SensorDevice;
							sensorDevice->id = id;
							sensorDevice->setPin(pin1);
							addBusyPin(type, id, pin1);
							sensorDevice->init();
							devicesCount++;
							devicesList[devicesCount - 1] = sensorDevice;
						}
						else
							if (type == Stepper)
							{
								if (pin1 < 0) return "bad, pin1 wrong value";
								if (pin2 < 0) return "bad, pin2 wrong value";
								if (pin3 < 0) return "bad, pin3 wrong value";
								if (pin4 < 0) return "bad, pin4 wrong value";
								if ((pin1 == pin2) || (pin1 == pin3) || (pin1 == pin4) || (pin2 == pin3) || (pin2 == pin4) || (pin3 == pin4)) return "bad, duplicate pins values";
								StepperDevice * stepperDevice = new StepperDevice;
								stepperDevice->id = id;
								stepperDevice->setPin1(pin1);
								stepperDevice->setPin2(pin2);
								stepperDevice->setPin3(pin3);
								stepperDevice->setPin4(pin4);
								addBusyPin(type, id, pin1);
								addBusyPin(type, id, pin2);
								addBusyPin(type, id, pin3);
								addBusyPin(type, id, pin4);
								stepperDevice->init();
								devicesCount++;
								devicesList[devicesCount - 1] = stepperDevice;
							}
							else
								if (type == LCD)
								{
									if (checkPinBusy(D1)) return "bad, CLOCK pin busy:" + String(D1) + " busy " + busyPins;
									if (checkPinBusy(D2)) return "bad, DATA pin busy:" + String(D2) + " busy " + busyPins;
									LCDDevice * lcdDevice = new LCDDevice;
									lcdDevice->id = id;
									addBusyPin(type, id, D1);
									addBusyPin(type, id, D2);
									lcdDevice->init();
									devicesCount++;
									devicesList[devicesCount - 1] = lcdDevice;
								}
								else
									if (type == Actuator)
									{
										if (pin1 < 0) return "bad, pin1 wrong value";
										ActuatorDevice * actuatorDevice = new ActuatorDevice;
										actuatorDevice->id = id;
										actuatorDevice->init();
										actuatorDevice->setPin(pin1);
										addBusyPin(type, id, pin1);
										devicesCount++;
										devicesList[devicesCount - 1] = actuatorDevice;
									}
									else
										if (type == Opto)
										{
											if (pin1 < 0) return "bad, pin1 wrong value";
											if (pin2 < 0) return "bad, pin2 wrong value";
											if (pin1 == pin2) return "bad, dublicate pins values";
											OptoDevice * optoDevice = new OptoDevice;
											optoDevice->init();
											optoDevice->id = id;
											optoDevice->setPin1(pin1);
											optoDevice->setPin2(pin2);
											addBusyPin(type, id, pin1);
											addBusyPin(type, id, pin2);
											devicesCount++;
											devicesList[devicesCount - 1] = optoDevice;
										}
										else
											if (type == Valve)
											{
												if (pin1 < 0) return "bad, pin1 wrong value";
												if (pin2 < 0) return "bad, pin2 wrong value";
												if (pin3 < 0) return "bad, pin3 wrong value";
												if ((pin1 == pin2) || (pin1 == pin3) || (pin2 == pin3)) return "bad, duplicate pins values";
												ValveDevice * valveDevice = new ValveDevice;
												valveDevice->init();
												valveDevice->id = id;
												valveDevice->setPin1(pin1);
												valveDevice->setPin2(pin2);
												valveDevice->setPin3(pin3);
												addBusyPin(type, id, pin1);
												addBusyPin(type, id, pin2);
												addBusyPin(type, id, pin3);
												devicesCount++;
												devicesList[devicesCount - 1] = valveDevice;
											}
											else
											{
												return "bad, device type";
											}
	//if device added at RUNTIME
	if (transportAvailable()) devicesList[devicesCount - 1]->begin(unitGetTopic());
#ifdef DetailedDebug
	debugOut("devicesadd", "OK");
#endif

	return "1";
}