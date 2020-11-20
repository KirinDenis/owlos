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

#include "DriverService.h"
#ifdef USE_DRIVERS

//ALL DEVICES constructors must be called here, current node topic must be puted as parameter
//#include "PinService.h"

#ifdef USE_ESP_DRIVER
#include "../drivers/ESPDriver.h"
#endif

String __topic;
String busyPins;

#define DRIVERS_LIMIT 50
int _driversCount = 0;
BaseDriver *driversList[DRIVERS_LIMIT];

#define lineDelimiter "\n"
#define valueDelimiter ";"
#define pinDelimiter ","

void driversInit(String _topic)
{
	__topic = _topic;
	initPins();
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut("driverconfig", driversLoadFromConfig());
#endif
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

#ifdef USE_ACTUATOR_DRIVER
	result += "name:ActuatorDriver\n";
	result += "type=" + String(ACTUATOR_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(ActuatorDriver::getPinsCount()) + "\n";
	for (int i = 0; i < ActuatorDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + ActuatorDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(ActuatorDriver::getPinType(i)) + "\n";
	}
#endif

#ifdef USE_SENSOR_DRIVER
	result += "name:SensorDriver\n";
	result += "type=" + String(SENSOR_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(SensorDriver::getPinsCount()) + "\n";
	for (int i = 0; i < SensorDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + SensorDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(SensorDriver::getPinType(i)) + "\n";
	}

	result += "name:LightDriver\n";
	result += "type=" + String(SENSOR_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(SensorDriver::getPinsCount()) + "\n";
	for (int i = 0; i < SensorDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + SensorDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(SensorDriver::getPinType(i)) + "\n";
	}

	result += "name:SmokeDriver\n";
	result += "type=" + String(SENSOR_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(SensorDriver::getPinsCount()) + "\n";
	for (int i = 0; i < SensorDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + SensorDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(SensorDriver::getPinType(i)) + "\n";
	}

	result += "name:MotionDriver\n";
	result += "type=" + String(SENSOR_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(SensorDriver::getPinsCount()) + "\n";
	for (int i = 0; i < SensorDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + SensorDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(SensorDriver::getPinType(i)) + "\n";
	}
#endif
#ifdef USE_LCD_DRIVER
	result += "name:LCDDriver\n";
	result += "type=" + String(LCD_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(LCDDriver::getPinsCount()) + "\n";
	for (int i = 0; i < LCDDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + LCDDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(LCDDriver::getPinType(i)) + "\n";
	}
#endif

#ifdef USE_DHT_DRIVER
	result += "name:DHTDriver\n";
	result += "type=" + String(DHT_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(DHTDriver::getPinsCount()) + "\n";
	for (int i = 0; i < DHTDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + DHTDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(DHTDriver::getPinType(i)) + "\n";
	}
#endif
#ifdef USE_STEPPER_DRIVER
	result += "name:StepperDriver\n";
	result += "type=" + String(STEPPER_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(StepperDriver::getPinsCount()) + "\n";
	for (int i = 0; i < StepperDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + StepperDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(StepperDriver::getPinType(i)) + "\n";
	}
#endif

#ifdef USE_VALVE_DRIVER
	result += "name:ValveDriver\n";
	result += "type=" + String(VALVE_DRIVER_TYPE) + "\n";
	result += "pinscount=" + String(ValveDriver::getPinsCount()) + "\n";
	for (int i = 0; i < ValveDriver::getPinsCount(); i++)
	{
		result += "pintype" + String(i) + "=" + ValveDriver::getPinType(i) + "\n";
		result += "pintypedecoded" + String(i) + "=" + decodePinTypes(ValveDriver::getPinType(i)) + "\n";
	}
#endif
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
			driversList[i]->onMessage(_topic, _payload, MQTT_TRANSPORT_MASK);
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

BaseDriver *driversGetDriver(String id)
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
	BaseDriver *baseDriver = driversGetDriver(id);
	if (baseDriver == NULL)
		return "";

	return baseDriver->onMessage(__topic + "/" + id + "/get" + property, "", NO_TRANSPORT_MASK);
}

String driversSetDriverProperty(String id, String property, String value)
{
	BaseDriver *baseDriver = driversGetDriver(id);
	if (baseDriver == NULL)
	{
		return WRONG_DRIVER_NAME;
	}
	String result = baseDriver->onMessage(__topic + "/" + id + "/set" + property, value, MQTT_TRANSPORT_MASK);
	return result;
}

String driversGetDriverProperties(String id)
{
	BaseDriver *baseDriver = driversGetDriver(id);
	if (baseDriver == NULL)
		return "";
	return baseDriver->getAllProperties();
}

String driversGetAllDriversProperties()
{
	String result = "";
#ifdef USE_ESP_DRIVER
	result = nodeGetAllProperties();
#endif
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

bool driversSaveList()
{
	String driverlist = "";
	DriverPin *driverPins = nullptr;
	int count = 0;
	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			driverlist += String(driversList[i]->getType()) + ";" + driversList[i]->id + ";";

			count = getDriverPinsByDriverId(driversList[i]->id, &driverPins);
			if (count > 0)
			{
				for (int j = 0; j < count; j++)
				{

					if (driverPins[j].driverPinType != I2CADDR_MASK)
					{
						driverlist += driverPins[j].name;
					}
					else
					{
						driverlist += "ADDR0x" + String(driverPins[j].driverI2CAddr, HEX);
					}

					if (j < count - 1)
					{
						driverlist += pinDelimiter;
					}
				}
				delete[] driverPins;
			}

			driverlist += ";\n";
		}
	}
	return filesWriteString("driverslist", driverlist);
}

String driversLoadFromConfig()
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut("driverconfig", "load");
#endif
#endif
	String driverList = filesReadString("driverslist");
	if (driverList.length() == 0)
	{
		return "bad driver list counfig file";
	}

	String result = String();

	int linePos = 0;
	String line;

#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut("driverconfig", "do parse");
#endif
#endif

	while ((linePos = driverList.indexOf(lineDelimiter)) != -1)
	{

		line = driverList.substring(0, linePos);
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("driverconfig_load line_", line);
#endif
#endif
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
			case 0:
				type = value;
				break;
			case 1:
				id = value;
				break;
			case 2:
				pins = value;
				break;
			}
			valueCount++;
			line.remove(0, valuePos + 1);
		}
		if (id.length() != 0)
		{
			result += "{" + driversAdd(atoi(type.c_str()), id, pins) + "}";
		}

		driverList.remove(0, linePos + 1);
	}
	return result;
}

//External driver Service API -------------------------------------------------
String driversAdd(int type, String id, String pins) //String D1,D3,GND,....
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut("driversadd_id", id);
#endif
#ifdef DEBUG
	debugOut("driversadd_pins", pins);
#endif
#endif
	int driversCount = driversGetCount();
	if (driversCount >= DRIVERS_LIMIT)
		return "bad, drivers count out of limit range";
	if (id.length() == 0)
		return "bad, id is zero length string";
	if (type < 0)
		return "bad, driver type";

	String result = "";
//http://192.168.1.9:8084/adddriver?type=7&id=lcd1&pins=D21,D22,ADDR0x3F,VCC5,GND
#define DRIVER_PIN_LIMIT 10

	String _pins[DRIVER_PIN_LIMIT];
	int pinCount = 0;
	int pinPos = 0;
	pins += pinDelimiter;
	while ((pinPos = pins.indexOf(pinDelimiter)) != -1)
	{
		_pins[pinCount] = pins.substring(0, pinPos);
		if (_pins[pinCount].length() == 0)
			break;
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("pin", _pins[pinCount]);
#endif
#endif
		pinCount++;
		pins.remove(0, pinPos + 1);
	}

	id.toLowerCase();

	for (int i = 0; i < DRIVERS_LIMIT; i++)
	{
		if (driversList[i] != nullptr)
		{
			if (driversList[i]->id.equals(id))
				return "bad, id: " + id + " exists";
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
#ifdef USE_ACTUATOR_DRIVER
	if (type == ACTUATOR_DRIVER_TYPE)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("pin", String(pinCount));
#endif
#endif
		if (pinCount != ActuatorDriver::getPinsCount())
		{
			return "ActuatorDriver's pins quantity does not match, must be " + String(ActuatorDriver::getPinsCount());
		}

		result = checkDriverPin(_pins[PIN0_INDEX], ActuatorDriver::getPinType(PIN0_INDEX)) + checkDriverPin(_pins[PIN1_INDEX], ActuatorDriver::getPinType(PIN1_INDEX));

#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("DCResult", result);
#endif
#endif

		if (result.length() != 0)
			return result;

		result = setDriverPin(_pins[PIN0_INDEX], id, PIN0_INDEX, ActuatorDriver::getPinType(PIN0_INDEX)) + setDriverPin(_pins[PIN1_INDEX], id, PIN1_INDEX, ActuatorDriver::getPinType(PIN1_INDEX));

		if (result.length() != 0)
			return result;

		ActuatorDriver *actuatorDriver = new ActuatorDriver;
		actuatorDriver->id = id;
		actuatorDriver->init();
		driversList[freeIndex] = actuatorDriver;
	}
	else
#endif

#ifdef USE_SENSOR_DRIVER
		if ((type == SENSOR_DRIVER_TYPE) || (type == LIGHT_DRIVER_TYPE) || (type == SMOKE_DRIVER_TYPE) || (type == MOTION_DRIVER_TYPE))
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("pin", String(pinCount));
#endif
#endif
		if (pinCount != SensorDriver::getPinsCount())
		{
			return "SensorDriver's pins quantity does not match, must be " + String(SensorDriver::getPinsCount());
		}

		result = checkDriverPin(_pins[PIN0_INDEX], SensorDriver::getPinType(PIN0_INDEX)) + checkDriverPin(_pins[PIN1_INDEX], SensorDriver::getPinType(PIN1_INDEX)) + checkDriverPin(_pins[PIN2_INDEX], SensorDriver::getPinType(PIN2_INDEX));

#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("DCResult", result);
#endif
#endif

		if (result.length() != 0)
			return result;

		result = setDriverPin(_pins[PIN0_INDEX], id, PIN0_INDEX, SensorDriver::getPinType(PIN0_INDEX)) + setDriverPin(_pins[PIN1_INDEX], id, PIN1_INDEX, SensorDriver::getPinType(PIN1_INDEX)) + setDriverPin(_pins[PIN2_INDEX], id, PIN2_INDEX, SensorDriver::getPinType(PIN2_INDEX));

		if (result.length() != 0)
			return result;

		SensorDriver *sensorDriver = new SensorDriver;
		sensorDriver->id = id;
		sensorDriver->init();
		driversList[freeIndex] = sensorDriver;
	}
	else
#endif
#ifdef USE_LCD_DRIVER
		if (type == LCD_DRIVER_TYPE)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("pin", String(pinCount));
#endif
#endif
		if (pinCount != LCDDriver::getPinsCount())
		{
			return "LCDDriver's pins quantity does not match, must be " + String(LCDDriver::getPinsCount());
		}

		result = checkDriverPin(_pins[SDA_INDEX], LCDDriver::getPinType(SDA_INDEX)) + checkDriverPin(_pins[SCL_INDEX], LCDDriver::getPinType(SCL_INDEX)) + _checkDriverPin(_pins[I2CADDR_INDEX], LCDDriver::getPinType(I2CADDR_INDEX), _pins[SDA_INDEX]) + checkDriverPin(_pins[_VCC5_INDEX], LCDDriver::getPinType(_VCC5_INDEX)) + checkDriverPin(_pins[_GND_INDEX], LCDDriver::getPinType(_GND_INDEX));

		if (result.length() != 0)
			return result;

		result = setDriverPin(_pins[SDA_INDEX], id, SDA_INDEX, LCDDriver::getPinType(SDA_INDEX)) + setDriverPin(_pins[SCL_INDEX], id, SCL_INDEX, LCDDriver::getPinType(SCL_INDEX)) + _setDriverPin(_pins[I2CADDR_INDEX], id, I2CADDR_INDEX, LCDDriver::getPinType(I2CADDR_INDEX), _pins[SDA_INDEX]) + setDriverPin(_pins[_VCC5_INDEX], id, _VCC5_INDEX, LCDDriver::getPinType(_VCC5_INDEX)) + setDriverPin(_pins[_GND_INDEX], id, _GND_INDEX, LCDDriver::getPinType(_GND_INDEX));

		if (result.length() != 0)
			return result;

		LCDDriver *lcdDriver = new LCDDriver;
		lcdDriver->id = id;
		lcdDriver->init();
		driversList[freeIndex] = lcdDriver;
	}
	else
#endif

#ifdef USE_DHT_DRIVER
		if (type == DHT_DRIVER_TYPE)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut("pin", String(pinCount));
#endif
#endif
		if (pinCount != DHTDriver::getPinsCount())
		{
			return "DHTDriver's pins quantity does not match, must be " + String(DHTDriver::getPinsCount());
		}

		result = checkDriverPin(_pins[PIN0_INDEX], DHTDriver::getPinType(PIN0_INDEX)) + checkDriverPin(_pins[PIN1_INDEX], DHTDriver::getPinType(PIN1_INDEX)) + checkDriverPin(_pins[PIN2_INDEX], DHTDriver::getPinType(PIN2_INDEX));

		if (result.length() != 0)
			return result;

		result = setDriverPin(_pins[PIN0_INDEX], id, PIN0_INDEX, DHTDriver::getPinType(PIN0_INDEX)) + setDriverPin(_pins[PIN1_INDEX], id, PIN1_INDEX, DHTDriver::getPinType(PIN1_INDEX)) + setDriverPin(_pins[PIN2_INDEX], id, PIN2_INDEX, DHTDriver::getPinType(PIN2_INDEX));

		if (result.length() != 0)
			return result;

		DHTDriver *dhtDriver = new DHTDriver;
		dhtDriver->init(id);
		dhtDriver->id = id;
		driversList[freeIndex] = dhtDriver;
	}
	else
#endif
	{
		return "not supported";
	}

#ifdef USE_ESP_DRIVER
	//if driver added at RUNTIME
	driversList[freeIndex]->begin(nodeGetTopic());
#else 	
    driversList[freeIndex]->begin("owlosnode");
#endif
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut("driversadd", "OK");
#endif
#endif

	return "1";
}

String driversChangePin(String pinName, String driverId, int driverPinIndex)
{
	//String result = checkDriverPin(pinName, NO_MASK);

	//if (result.length() != 0)
	//{
	//	return result;
	//}

	String result = setDriverPin(pinName, driverId, driverPinIndex, NO_MASK);

	if (result.length() != 0)
	{
		return result;
	}

	if (driversSaveList())
	{
		return "";
	}

	return "can't save driverslist";
}

String driversDelete(String id)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut("driversdelete", id);
#endif
#endif
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
#endif