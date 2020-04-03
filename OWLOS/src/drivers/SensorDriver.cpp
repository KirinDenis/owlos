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
		//TODO: INPUT-PULLUP
		if (setDriverPinMode(id, PIN0_INDEX, INPUT).length() == 0)
		{
			//если используемый пин поддерживает ЦАП, то драйвер актуратора переходит в аналоговый режим
			//свойство дата 0..1023 (где 1023 уровень логической единицы)
			setAnalog(pinDriverInfo.driverPinType & ANALOG_O_MASK, false);
			//на случай перезагрузки, в файле сохранено последнее состояние актуатора
			getData(); //прочесть последнее состояние 
			setData(data, false); //вернуть последнее запомненное состояние 
			return true;
		}
	}
	return false;


	//getPin();
	//pinMode(pin, INPUT);
}

void ActuatorDriver::del()
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


String SensorDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "data=" + data + "//rb\n";
	result += "pin=" + String(pin) + "//i\n";
	return result;
}


bool SensorDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("data", data);
		return true;
	}
	return false;
};

String SensorDriver::onMessage(String _topic, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);
	if (!available) return result;
	//Sensor sensor GPIO 1-pin (A0 by default)
   if ((String(topic + "/getdata").equals(_topic)) || (String(topic + "/setdata").equals(_topic)))
	{
		result = onGetProperty("data", getData(), transportMask);
	}
	return result;
}


String SensorDriver::getData()
{
	int _data = digitalRead(pin);
	data = String(_data);
#ifdef DetailedDebug
	debugOut(id, "data=" + data);
#endif
	return data;
}
