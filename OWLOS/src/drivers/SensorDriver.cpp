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

bool SensorDriver::init()
{
	if (id.length() == 0) id = DRIVER_ID;
	BaseDriver::init(id);

	PinDriverInfo pinDriverInfo;
	if (getDriverPinInfo(id, PIN0_INDEX, &pinDriverInfo))
	{
		//TODO: INPUT_PULLUP/INPUT_PULLDOWN
		if (setDriverPinMode(id, PIN0_INDEX, INPUT).length() == 0)
		{
			//если используемый пин поддерживает АЦП, то драйвер сенсора переходит в аналоговый режим
			//свойство дата 0..1023 (где 1023 уровень логической единицы)
			setAnalog(pinDriverInfo.driverPinType & ANALOG_I_MASK, false);
			
			if (getData() != -1) 
			{
			   return true;
			}
		}
	}
	return false;

	
}

void SensorDriver::del()
{
	BaseDriver::del();
	return;
}



bool SensorDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	available = true;
	setType(Sensor);
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


String SensorDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "analog=" + String(analog) + "//br\n";
	result += "data=" + String(data) + "//ri\n";

	return result;
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

String SensorDriver::onMessage(String _topic, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);

	if (!available) return result;

	if (String(topic + "/getanalog").equals(_topic))
	{
		result = onGetProperty("analog", String(getAnalog()), transportMask);
	}
	else
	
	if (String(topic + "/getdata").equals(_topic)) 
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
		data = filesReadInt(id + ".analog");
	}
#ifdef DetailedDebug
	debugOut(id, "analog=" + String(data));
#endif

	return data;
}

bool SensorDriver::setAnalog(bool _analog, bool doEvent)
{
	analog = _analog;
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
	data = -1;
	
	PinDriverInfo pinDriverInfo;
	if (getDriverPinInfo(id, PIN0_INDEX, &pinDriverInfo))
	{
		data = driverPinRead(id, pinDriverInfo.GPIONumber);
	  
	}   

	return data;
}

