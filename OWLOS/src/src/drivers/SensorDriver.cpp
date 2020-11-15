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
#include "SensorDriver.h"
#ifdef USE_SENSOR_DRIVER
#define DRIVER_ID "sensor"

bool SensorDriver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);

	DriverPin *driverPin = getDriverPinByDriverId(id, PIN0_INDEX); //командный пин "закрыть"
	if (driverPin != nullptr)
	{
		//TODO: INPUT_PULLUP/INPUT_PULLDOWN

		setAnalog(getPinByName(driverPin->name)->pinTypes & ANALOG_I_MASK, false);

		if ((setDriverPinMode(id, PIN0_INDEX, INPUT).length() == 0) || (analog))
		{
			if (getData() != -1)
			{

				return true;
			}
		}
	}
	return false;
}

bool SensorDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	available = true;
	setType(SENSOR_DRIVER_TYPE);
	setAvailable(available);
	return available;
}

bool SensorDriver::query()
{
	if (BaseDriver::query())
	{
		//for sensor publish data() as it changed
		int _data = data;
		if (_data != getData())
		{
			onInsideChange("data", String(data));
			//TODO getData return int, check if getData == 0
			sensorTriger++;
		}

		if (analog)
		{
			//Fill array of history data
			if (millis() >= lastHistoryMillis + historyInterval)
			{
				lastHistoryMillis = millis();
				setHistoryData((float)data);
			}

			//History file array of history data
			if (millis() >= lastHistoryFileWriteMillis + historyFileWriteInterval)
			{
				lastHistoryFileWriteMillis = millis();
				writeHistoryFile((float)data);
			}
		}
		else
		{
			//Fill array of history data
			if (millis() >= lastHistoryMillis + historyInterval)
			{
				lastHistoryMillis = millis();
				setHistoryData((float)sensorTriger);
			}

			//History file array of history data
			if (millis() >= lastHistoryFileWriteMillis + historyFileWriteInterval)
			{
				lastHistoryFileWriteMillis = millis();
				writeHistoryFile((float)sensorTriger);
			}
		}

		return true;
	}
	return false;
};

String SensorDriver::getAllProperties()
{
	return BaseDriver::getAllProperties() +
		   "analog=" + String(analog) + "//br\n"
										"data=" +
		   String(data) + "//ris\n";
}

bool SensorDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("data", String(data));
		return true;
	}
	return false;
};

String SensorDriver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;

	if (matchRoute(route, topic, "/getanalog"))
	{
		result = onGetProperty("analog", String(getAnalog()), transportMask);
	}
	else

		if (matchRoute(route, topic, "/getdata"))
	{
		result = onGetProperty("data", String(getData()), transportMask);
	}

	return result;
}

//Analog ------------------------------------------
bool SensorDriver::getAnalog()
{
	if (filesExists(id + ".analog"))
	{
		analog = filesReadInt(id + ".analog");
	}
	return analog;
}

bool SensorDriver::setAnalog(bool _analog, bool doEvent)
{
	analog = _analog;

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	//TODO: Sensor Driver properties for control ESP32 Analog Input parameters
	DriverPin *driverPin = getDriverPinByDriverId(id, PIN0_INDEX);
	adcStart(driverPin->GPIONumber);
	pinMode(driverPin->GPIONumber, INPUT);
	analogSetAttenuation(ADC_11db);
	analogSetWidth(12);
	analogSetCycles(255);
	analogSetSamples(1);
	analogReadResolution(12);
#endif

	filesWriteInt(id + ".analog", analog);
	if (doEvent)
	{
		return onInsideChange("analog", String(analog));
	}
	return true;
}

//Data -------------------------------------------

int SensorDriver::getData()
{
	data = driverPinRead(id, PIN0_INDEX);
	return data;
}
#endif
