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

#include "LightDevice.h"

bool LightDevice::begin(String _topic)
{
	if (id.length() == 0) id = DeviceID;
	BaseDevice::init(id);

	BaseDevice::begin(_topic);
	available = true;
	setType(Light);
	setAvailable(available);
	//TEMP:
	trap = 50;
	return available;
}

bool LightDevice::query()
{
	if (BaseDevice::query())
	{
		int _light = std::atoi(light.c_str());
		getLight();
		int different = std::atoi(light.c_str()) - _light;
		if ((different > trap) || (different < -trap))
		{
			onInsideChange("light", light);
		}
		return true;
	}
	return false;
};


String LightDevice::getAllProperties()
{
	String result = BaseDevice::getAllProperties();
	result += "light=" + light + "\n";
	result += "pin=" + String(pin) + "\n";
	return result;
}


bool LightDevice::publish()
{
	if (BaseDevice::publish())
	{
		onInsideChange("light", light);
		return true;
	}
	return false;
};

String LightDevice::onMessage(String _topic, String _payload, int transportMask)
{
	String result = BaseDevice::onMessage(_topic, _payload, transportMask);
	if (!available) return result;

	//Light sensor GPIO 1-pin (A0 by default)
	if (String(topic + "/getpin").equals(_topic))
	{
		result = onGetProperty("pin", String(getPin()), transportMask);
	}
	else if (String(topic + "/setpin").equals(_topic))
	{
		result = String(setPin(std::atoi(_payload.c_str())));
	}
	else if ((String(topic + "/getlight").equals(_topic)) || (String(topic + "/setlight").equals(_topic)))
	{
		result = onGetProperty("light", getLight(), transportMask);
	}
	return result;
}

//Light Sensor 1-pin (A0 by default) ----------------------------------------------------
int LightDevice::getPin()
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

bool LightDevice::setPin(int _pin)
{
	pin = _pin;
	pinMode(pin, INPUT);
	filesWriteInt(id + ".pin", pin);
	if (available)
	{
		return onInsideChange("pin", String(pin));
	}
	return true;
}

String LightDevice::getLight()
{
	int _light = analogRead(pin);
	light = String(_light);
#ifdef DetailedDebug
	debugOut(id, "light=" + light);
#endif
	return light;
}
