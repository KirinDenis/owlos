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
	if (String(topic + "/getpin").equals(_topic))
	{
		result = onGetProperty("pin", String(getPin()), transportMask);
	}
	else
		if (String(topic + "/setpin").equals(_topic))
		{
			result = String(setPin(std::atoi(_payload.c_str())));
		}
		else
			//Position -----------------------------------------------------------------
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

//Actuator GPIO 1-pin (D4 by default) ----------------------------------------------------
int ActuatorDevice::getPin()
{
	if (filesExists(id + ".pin"))
	{
		pin = filesReadInt(id + ".pin");
	}
#ifdef DetailedDebug
	debugOut(id, "pin=" + String(pin));
#endif

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
#ifdef DetailedDebug
	debugOut(id, "data=" + String(data));
#endif

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
};
