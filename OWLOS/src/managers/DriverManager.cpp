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
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

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
#include <core_version.h>
#include "../utils/GPIOMap.h"

//ALL DEVICES constructors must be called here, current node topic must be puted as parameter
//#include "PinManager.h"
#include "DriverManager.h"
#include "..\..\Kernel.h"

String __topic;
String busyPins;

#define DRIVERS_LIMIT 50
int _driversCount = 0;
BaseDriver * driversList[DRIVERS_LIMIT];

#define lineDelimiter  "\n"
#define valueDelimiter  ";"
#define pinDelimiter  ","

void driversInit(String _topic)
{
	debugOut("---------------", String(ActuatorDriver::getPinsCount()));

	__topic = _topic;
	initPins();
#ifdef DetailedDebug
	debugOut("driverconfig", driversLoadFromConfig());
#else
	driversLoadFromConfig();
#endif
}

void driversBegin(String nodeTopic)
{
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			driversList[i]->begin(nodeTopic);
		}
	}
}

void driversLoop()
{
	//ALL DEVICES must be call .publish() method from this main loop procedure
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			driversList[i]->query();
			driversList[i]->publish();
		}
	}
}

int driversGetCount()
{
	int driversCount = 0;
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			driversCount++;
		}
	}
	return driversCount;
}


String driversGetAccessable()
{
	String result = "";

	result += "name:ActuatorDriver\n";
	for (int i = 0; i < ActuatorDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + ActuatorDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + pinDecodeType(ActuatorDriver::getPinType(i)) + "\n";
	}

	result += "name:SensorDriver\n";
	for (int i = 0; i < SensorDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + SensorDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + pinDecodeType(SensorDriver::getPinType(i)) + "\n";
	}

	result += "name:LCDDriver\n";
	for (int i = 0; i < LCDDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + LCDDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + pinDecodeType(LCDDriver::getPinType(i)) + "\n";
	}


	debugOut("PINS", result);
	return result;

}

void driversSubscribe()
{
	//ALL DEVICES method .subscribe() must be called here with current _topic and _payload values
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			driversList[i]->subscribe();

		}
	}
}

void driversCallback(String _topic, String _payload)
{
	//ALL DEVICES method .onMessage() must be called here with current _topic and _payload values
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			driversList[i]->onMessage(_topic, _payload, MQTTMask);
		}
	}
}

String driversGetDriversId()
{
	String result = "driverid;type;available\n";
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			result += driversList[i]->id + ";" + String(driversList[i]->getType()) + ";" + String(driversList[i]->getAvailable()) + "\n";
		}
	}
	return result;
};

BaseDriver* driversGetDriver(String id)
{
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			if (driversList[i]->id.equals(id))
			{
				return driversList[i];
			}
		}
	}
	return NULL;
}

String driversGetDriverProperty(String id, String property)
{
	BaseDriver* baseDriver = driversGetDriver(id);
	if (baseDriver == NULL) return "";

	return baseDriver->onMessage(__topic + "/" + id + "/get" + property, "", NoTransportMask);
}

String driversSetDriverProperty(String id, String property, String value)
{
	BaseDriver* baseDriver = driversGetDriver(id);
	if (baseDriver == NULL) return "";

	return baseDriver->onMessage(__topic + "/" + id + "/set" + property, value, MQTTMask);
}

String driversGetDriverProperties(String id)
{
	BaseDriver* baseDriver = driversGetDriver(id);
	if (baseDriver == NULL) return "";
	return baseDriver->getAllProperties();
}

String driversGetAllDriversProperties()
{
	String result = nodeGetAllProperties();
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			result += "properties for:" + driversList[i]->id + "\n";
			result += driversList[i]->getAllProperties();
		}
	}
	return result;
}

/*
bool checkPinBusy(int pin)
{
	if (pin < 0) return false;
	if (busyPins.indexOf(":" + String(pin) + ";") >= 0) return true;
}

void addBusyPin(int type, String id, int pin)
{
	busyPins += "[" + String(type) + "]" + id + ":" + String(pin) + ";";
}

String driversGetBusyPins()
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
	return "wrong pin maping value, at this board model available next pin's values: " + driversGetPinsMap();
}


String driversGetPinsMap()
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

int driversPinNameToValue(String pinName)
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

String driversValueToPinName(int pinValue)
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


bool driversSaveToConfig(int type, String id, String pins)
{
	String driver = String(type) + ";" + id + ";" + pins + ";\n";
	return filesAppendString("driverslist", driver);
}
*/

bool driversSaveList()
{
	String driverlist = "";
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			driverlist += String(driversList[i]->getType()) + ";" + driversList[i]->id + ";";
			int pinCount = getDriverPinsCount(driversList[i]->id);
			for (int j = 0; j < pinCount; j++)
			{
				debugOut("PIN_SAVE", driversList[i]->id);
				debugOut("PIN_COUNT", String(pinCount));
				PinDriverInfo pinDriverInfo;
				if (getDriverPinInfo(driversList[i]->id, j, &pinDriverInfo))
				{
					debugOut("D_INFO", pinDriverInfo.name);
					if (pinDriverInfo.driverPinType != I2CADDR_TYPE)
					{
						driverlist += pinDriverInfo.name;
					}
					else
					{
						driverlist += "ADDR0x" + String(pinDriverInfo.driverI2CAddr, HEX);
					}

					if (j < pinCount - 1)
					{
						driverlist += pinDelimiter;
					}
				}
				debugOut("D_INFO_NEXT", "");
			}
			driverlist += ";\n";
		}

	}

	return filesWriteString("driverslist", driverlist);
}


String driversLoadFromConfig()
{
#ifdef DetailedDebug
	debugOut("driverconfig", "load");
#endif
	String driverList = filesReadString("driverslist");
	if (driverList.length() == 0) return "bad driver list counfig file";

	String result = String();

	int linePos = 0;
	String line;

#ifdef DetailedDebug
	debugOut("driverconfig", "do parse");
#endif

	while ((linePos = driverList.indexOf(lineDelimiter)) != -1)
	{

		line = driverList.substring(0, linePos);
		debugOut("driverconfig_load line_", line);
		int valuePos = 0;
		int valueCount = 0;
		String value;
		String type;
		String id;
		String pins;
		while ((valuePos = line.indexOf(valueDelimiter)) != -1)
		{
			value = line.substring(0, valuePos);
			switch (valueCount)
			{
			case 0: type = value; break;
			case 1: id = value; break;
			case 2: pins = value; break;
			}
			valueCount++;
			line.remove(0, valuePos + 1);
		}
		if (id.length() != 0)
		{
			result += "{" + driversAdd(std::atoi(type.c_str()), id, pins) + "}";
		}

		driverList.remove(0, linePos + 1);
	}
	return result;
}

//External driver manager API -------------------------------------------------
String driversAdd(int type, String id, String pins) //String D1;D3;GND;....
{
#ifdef DetailedDebug
	debugOut("driversadd_id", id);
	debugOut("driversadd_pins", pins);
#endif
	int driversCount = driversGetCount();
	if (driversCount >= DRIVERS_LIMIT) return "bad, drivers count out of limit range";
	if (id.length() == 0) return "bad, id is zero length string";
	if (type < 0) return "bad, driver type";

	String result = "";

#define DRIVER_PIN_LIMIT 10

	String _pins[DRIVER_PIN_LIMIT];
	int pinCount = 0;
	int pinPos = 0;
	pins += pinDelimiter;
	while ((pinPos = pins.indexOf(pinDelimiter)) != -1)
	{
		_pins[pinCount] = pins.substring(0, pinPos);
		if (_pins[pinCount].length() == 0) break;
		debugOut("pin", _pins[pinCount]);
		pinCount++;
		pins.remove(0, pinPos + 1);
	}




	/*
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
	*/

	id.toLowerCase();

	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			if (driversList[i]->id.equals(id)) return "bad, id: " + id + " exists";
		}
	}

	int freeIndex = -1;
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] == nullptr)
		{
			freeIndex = i;
			break;
		}
	}

	if (freeIndex == -1)
	{
		return "no space for locate new driver";
	}



	if (type == Actuator)
	{
		debugOut("pin", String(pinCount));
		if (pinCount != ActuatorDriver::getPinsCount())
		{
			return "ActuatorDriver's pins quantity does not match, must be " + String(ActuatorDriver::getPinsCount());
		}

		result = setDriverPin(true, _pins[PIN0_INDEX], id, PIN0_INDEX, ActuatorDriver::getPinType(PIN0_INDEX)) + "\n"
			+ setDriverPin(true, _pins[PIN1_INDEX], id, PIN1_INDEX, ActuatorDriver::getPinType(PIN1_INDEX));

		if (result.length() > 1) return result;

		result = setDriverPin(false, _pins[PIN0_INDEX], id, PIN0_INDEX, ActuatorDriver::getPinType(PIN0_INDEX)) + "\n"
			+ setDriverPin(false, _pins[PIN1_INDEX], id, PIN1_INDEX, ActuatorDriver::getPinType(PIN1_INDEX));

		if (result.length() > 1) return result;


		ActuatorDriver * actuatorDriver = new ActuatorDriver;
		actuatorDriver->id = id;
		actuatorDriver->init();
		debugOut("ADD_DRIVER 1", "");
		driversList[freeIndex] = actuatorDriver;
		debugOut("ADD_DRIVER 2", "");
	}
	else
		if (type == LCD)
		{
			debugOut("pin", String(pinCount));
			if (pinCount != LCDDriver::getPinsCount())
			{
				return "LCDDriver's pins quantity does not match, must be " + String(LCDDriver::getPinsCount());
			}

			result = setDriverPin(true, _pins[SDA_INDEX], id, SDA_INDEX, LCDDriver::getPinType(SDA_INDEX)) + "\n"
				+ setDriverPin(true, _pins[SCL_INDEX], id, SCL_INDEX, LCDDriver::getPinType(SCL_INDEX)) + "\n"
				+ setDriverPin(true, _pins[I2CADDR_INDEX], id, I2CADDR_INDEX, LCDDriver::getPinType(I2CADDR_INDEX)) + "\n"
				+ setDriverPin(true, _pins[VCC5_INDEX], id, VCC5_INDEX, LCDDriver::getPinType(VCC5_INDEX)) + "\n"
				+ setDriverPin(true, _pins[GND_INDEX], id, GND_INDEX, LCDDriver::getPinType(GND_INDEX));


			if (result.length() > 4) return result;

			result = setDriverPin(false, _pins[SDA_INDEX], id, SDA_INDEX, LCDDriver::getPinType(SDA_INDEX)) + "\n"
				+ setDriverPin(false, _pins[SCL_INDEX], id, SCL_INDEX, LCDDriver::getPinType(SCL_INDEX)) + "\n"
				+ setDriverPin(false, _pins[I2CADDR_INDEX], id, I2CADDR_INDEX, LCDDriver::getPinType(I2CADDR_INDEX)) + "\n"
				+ setDriverPin(false, _pins[VCC5_INDEX], id, VCC5_INDEX, LCDDriver::getPinType(VCC5_INDEX)) + "\n"
				+ setDriverPin(false, _pins[GND_INDEX], id, GND_INDEX, LCDDriver::getPinType(GND_INDEX));

			if (result.length() > 4) return result;


			LCDDriver * lcdDriver = new LCDDriver;
			lcdDriver->id = id;
			lcdDriver->init();
			debugOut("ADD_DRIVER 1", "");
			driversList[freeIndex] = lcdDriver;
			debugOut("ADD_DRIVER 2", "");
		}
		else
			if (type == DHTDriverType)
			{
				debugOut("pin", String(pinCount));
				if (pinCount != DHTDriver::getPinsCount())
				{
					return "DHTDriver's pins quantity does not match, must be " + String(DHTDriver::getPinsCount());
				}

				result = setDriverPin(true, _pins[PIN0_INDEX], id, PIN0_INDEX, DHTDriver::getPinType(PIN0_INDEX)) + "\n"
					+ setDriverPin(true, _pins[PIN1_INDEX], id, PIN1_INDEX, DHTDriver::getPinType(PIN1_INDEX)) + "\n"
					+ setDriverPin(true, _pins[PIN2_INDEX], id, PIN2_INDEX, DHTDriver::getPinType(PIN2_INDEX));

				if (result.length() > 2) return result;

				result = setDriverPin(false, _pins[PIN0_INDEX], id, PIN0_INDEX, DHTDriver::getPinType(PIN0_INDEX)) + "\n"
					+ setDriverPin(false, _pins[PIN1_INDEX], id, PIN1_INDEX, DHTDriver::getPinType(PIN1_INDEX)) + "\n"
					+ setDriverPin(false, _pins[PIN2_INDEX], id, PIN2_INDEX, DHTDriver::getPinType(PIN2_INDEX));

				if (result.length() > 2) return result;

				DHTDriver * dhtDriver = new DHTDriver;
				dhtDriver->init(id);
				dhtDriver->id = id;
				driversList[freeIndex] = dhtDriver;
			}

			else
			{
				return "not supported";
			}


	/*
	if (type == DHTDriverType)
	{

		DHTDriver * dhtDriver = new DHTDriver;
		dhtDriver->init(id);
		dhtDriver->id = id;
		dhtDriver->setPin(pin1);
		addBusyPin(type, id + "DHT", pin1);
		driversCount++;
		driversList[driversCount - 1] = dhtDriver;
	}
	else
			if (type == Light)
			{
				if (pin1 < 0) return "bad, pin1 wrong value";
				LightDriver * lightDriver = new LightDriver;
				lightDriver->init(id);
				lightDriver->setPin(pin1);
				addBusyPin(type, id, pin1);
				driversCount++;
				driversList[driversCount - 1] = lightDriver;
			}
			else
				if (type == Smoke)
				{
					if (pin1 <= 0) return "bad, pin1 wrong value";
					SmokeDriver * smokeDriver = new SmokeDriver;
					smokeDriver->init(id);
					smokeDriver->setPin(pin1);
					addBusyPin(type, id, pin1);
					driversCount++;
					driversList[driversCount - 1] = smokeDriver;
				}
				else
					if (type == Motion)
					{
						if (pin1 < 0) return "bad, pin1 wrong value";
						MotionDriver * motionDriver = new MotionDriver;
						motionDriver->id = id;
						motionDriver->setPin(pin1);
						addBusyPin(type, id, pin1);
						motionDriver->init();
						driversCount++;
						driversList[driversCount - 1] = motionDriver;
					}
					else
						if (type == Sensor)
						{
							if (pin1 < 0) return "bad, pin1 wrong value";
							SensorDriver * sensorDriver = new SensorDriver;
							sensorDriver->id = id;
							sensorDriver->setPin(pin1);
							addBusyPin(type, id, pin1);
							sensorDriver->init();
							driversCount++;
							driversList[driversCount - 1] = sensorDriver;
						}
						else
							if (type == Stepper)
							{
								if (pin1 < 0) return "bad, pin1 wrong value";
								if (pin2 < 0) return "bad, pin2 wrong value";
								if (pin3 < 0) return "bad, pin3 wrong value";
								if (pin4 < 0) return "bad, pin4 wrong value";
								if ((pin1 == pin2) || (pin1 == pin3) || (pin1 == pin4) || (pin2 == pin3) || (pin2 == pin4) || (pin3 == pin4)) return "bad, duplicate pins values";
								StepperDriver * stepperDriver = new StepperDriver;
								stepperDriver->id = id;
								stepperDriver->setPin1(pin1);
								stepperDriver->setPin2(pin2);
								stepperDriver->setPin3(pin3);
								stepperDriver->setPin4(pin4);
								addBusyPin(type, id, pin1);
								addBusyPin(type, id, pin2);
								addBusyPin(type, id, pin3);
								addBusyPin(type, id, pin4);
								stepperDriver->init();
								driversCount++;
								driversList[driversCount - 1] = stepperDriver;
							}
							else
								if (type == LCD)
								{
									if (checkPinBusy(D1)) return "bad, CLOCK pin busy:" + String(D1) + " busy " + busyPins;
									if (checkPinBusy(D2)) return "bad, DATA pin busy:" + String(D2) + " busy " + busyPins;
									LCDDriver * lcdDriver = new LCDDriver;
									lcdDriver->id = id;
									addBusyPin(type, id, D1);
									addBusyPin(type, id, D2);
									lcdDriver->init();
									driversCount++;
									driversList[driversCount - 1] = lcdDriver;
								}
								else
									if (type == Actuator)
									{
										if (pin1 < 0) return "bad, pin1 wrong value";
										 //setDriverPin(pinName1, id, 0, ActuatorDriver.getPinType(0)); // == ""

										ActuatorDriver * actuatorDriver = new ActuatorDriver;
										actuatorDriver->id = id;

										actuatorDriver->init();

										//actuatorDriver->setPin(pin1);
										addBusyPin(type, id, pin1);
										driversCount++;
										driversList[driversCount - 1] = actuatorDriver;
									}
									else
										if (type == Opto)
										{
											if (pin1 < 0) return "bad, pin1 wrong value";
											if (pin2 < 0) return "bad, pin2 wrong value";
											if (pin1 == pin2) return "bad, dublicate pins values";
											OptoDriver * optoDriver = new OptoDriver;
											optoDriver->init();
											optoDriver->id = id;
											optoDriver->setPin1(pin1);
											optoDriver->setPin2(pin2);
											addBusyPin(type, id, pin1);
											addBusyPin(type, id, pin2);
											driversCount++;
											driversList[driversCount - 1] = optoDriver;
										}
										else
											if (type == Valve)
											{
												if (pin1 < 0) return "bad, pin1 wrong value";
												if (pin2 < 0) return "bad, pin2 wrong value";
												if (pin3 < 0) return "bad, pin3 wrong value";
												if ((pin1 == pin2) || (pin1 == pin3) || (pin2 == pin3)) return "bad, duplicate pins values";
												ValveDriver * valveDriver = new ValveDriver;
												valveDriver->init();
												valveDriver->id = id;
												valveDriver->setPin1(pin1);
												valveDriver->setPin2(pin2);
												valveDriver->setPin3(pin3);
												addBusyPin(type, id, pin1);
												addBusyPin(type, id, pin2);
												addBusyPin(type, id, pin3);
												driversCount++;
												driversList[driversCount - 1] = valveDriver;
											}
											else
											{
												return "bad, driver type";
											}
*/
//if driver added at RUNTIME
	if (transportAvailable()) driversList[freeIndex]->begin(nodeGetTopic());
#ifdef DetailedDebug
	debugOut("driversadd", "OK");
#endif

	return "1";
}


String driversChangePin(String pinName, String driverId, int driverPinIndex)
{
	String result = setDriverPin(true, pinName, driverId, driverPinIndex, NO_TYPE);
	if (result.length() != 0)
	{
		return result;
	}

	result = setDriverPin(false, pinName, driverId, driverPinIndex, NO_TYPE);
	if (result.length() != 0)
	{
		return result;
	}

	if (driversSaveList())
	{
		return "1";
	}

	return "can't save driverslist";
}

String driversDelete(String id)
{
	debugOut("driversdelete", id);
	bool found = false;
	String driverlist = "";
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			if (driversList[i]->id.equals(id))
			{
				driversList[i]->del();
				driversList[i] = nullptr;
				found = true;
				break;
			}
		}
	}

	if (found)
	{
		if (driversSaveList())
		{
			return "";
		}
		else
		{
			return "can't save driverslist";
		}
	}
	return "driver id=" + id + " not found, can't be deleted";
}

