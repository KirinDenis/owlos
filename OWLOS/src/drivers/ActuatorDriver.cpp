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

#include "ActuatorDriver.h"

bool ActuatorDriver::init()
{
	if (id.length() == 0) id = DRIVER_ID;
	BaseDriver::init(id);


	DriverPin * driverPin = getDriverPinByDriverId(id, PIN0_INDEX);    //командный пин "закрыть"
	if (driverPin != nullptr)
	{
		if (setDriverPinMode(id, PIN0_INDEX, OUTPUT).length() == 0)
		{
			//если используемый пин поддерживает ЦАП, то драйвер актуратора переходит в аналоговый режим
			//свойство дата 0..1023 (где 1023 уровень логической единицы)
			setAnalog(driverPin->driverPinType & ANALOG_O_MASK, false);
			//на случай перезагрузки, в файле сохранено последнее состояние актуатора
			getData(); //прочесть последнее состояние 
			setData(data, false); //вернуть последнее запомненное состояние 
			return true;
		}
	}
	return false;
}


bool ActuatorDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(Actuator);
	setAvailable(available);
	return available;
}

bool ActuatorDriver::query()
{
	if (BaseDriver::query())
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

String ActuatorDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "analog=" + String(analog) + "//br\n";
	result += "data=" + String(data) + "//i\n";
	return result;
}

bool ActuatorDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("data", String(data));
		return true;
	}
	return false;
};

String ActuatorDriver::onMessage(String _topic, String _payload, int8_t transportMask)
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
		else
			if (String(topic + "/setdata").equals(_topic))
			{
				result = String(setData(std::atoi(_payload.c_str()), true));
			}
	return result;
}

//Analog ------------------------------------------
bool ActuatorDriver::getAnalog()
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

bool ActuatorDriver::setAnalog(bool _analog, bool doEvent)
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
int ActuatorDriver::getData()
{
	data = -1;
	if (filesExists(id + ".data"))
	{
		data = filesReadInt(id + ".data");
	}
#ifdef DetailedDebug
	debugOut(id, "data=" + String(data));
#endif

	return data;
}

bool ActuatorDriver::setData(int _data, bool doEvent)
{
	data = _data;
	if (driverPinWrite(id, PIN0_INDEX, data).length() == 0)
	{
		filesWriteInt(id + ".data", data);
		if (doEvent)
		{
			return onInsideChange("data", String(data));
		}
		return true;
	}

	return false;
};
