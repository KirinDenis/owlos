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

#include "SmokeDriver.h"

bool SmokeDriver::begin(String _topic)
{
	if (id.length() == 0) id = DRIVER_ID;
	BaseDriver::init(id);

	BaseDriver::begin(_topic);
	available = true;

	trap = 80;
	setType(Smoke);
	setAvailable(available);
	return available;
}

String SmokeDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "smoke=" + smoke + "//rsi\n";
	result += "pin=" + String(pin) + "//i\n";
	return result;
}

bool SmokeDriver::query()
{
	if (BaseDriver::query())
	{
		int _smoke = std::atoi(smoke.c_str());
		getSmoke();
		float different = std::atoi(smoke.c_str()) - _smoke;
		if ((different > trap) || (different < -trap))
		{
			onInsideChange("smoke", smoke);
		}
		return true;
	}
	return false;
}

bool SmokeDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("smoke", smoke);
		return true;
	}
	return false;
}

String SmokeDriver::onMessage(String _topic, String _payload, int transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);
	if (!available) return result;
	//Smoke sensor GPIO 1-pin (A0 by default)
	if (String(topic + "/getpin").equals(_topic))
	{
		result = onGetProperty("pin", String(getPin()), transportMask);
	}
	else if (String(topic + "/setpin").equals(_topic))
	{
		result = String(setPin(std::atoi(_payload.c_str())));
	}
	else if ((String(topic + "/getsmoke").equals(_topic)) || (String(topic + "/setsmoke").equals(_topic)))
	{
		result = onGetProperty("smoke", getSmoke(), transportMask);
	}
	return result;
}

//Smoke Sensor 1-pin (A0 by default) ----------------------------------------------------
int SmokeDriver::getPin()
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

bool SmokeDriver::setPin(int _pin)
{
	pin = _pin;
	pinMode(pin, INPUT);
	filesWriteInt(id + ".pin", pin);
	return onInsideChange("pin", String(pin));
}


String SmokeDriver::getSmoke()
{
	int _smoke = analogRead(pin);
	smoke = String(_smoke);
#ifdef DetailedDebug
	debugOut(id, "smoke=" + smoke);
#endif
	return smoke;
}
