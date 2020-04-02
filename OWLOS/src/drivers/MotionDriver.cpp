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

#include "MotionDriver.h"

bool MotionDriver::init()
{
	if (id.length() == 0) id = DRIVER_ID;
	BaseDriver::init(id);
	//init properies
	getPin();
	pinMode(pin, INPUT);
}

bool MotionDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	available = true;
	setType(Motion);
	setAvailable(available);
	return available;
}

String MotionDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "motion=" + String(motion) + "\n";
	result += "pin=" + String(pin) + "\n";
	return result;
}

bool MotionDriver::query()
{
	if (BaseDriver::query())
	{
		int _motion = motion;
		getMotion();
		if (_motion != motion)
		{
			onInsideChange("motion", String(motion));
			motionTriger++;
		}

		//Fill array of history data
		if (millis() >= lastHistoryMillis + historyInterval)
		{
			if (motion == 1)  motionTriger++; //motion all time at "1"
			lastHistoryMillis = millis();
			setHistoryData(motionTriger);
			motionHistoryFileTriger = motionTriger;
			motionTriger = 0.0;
		}

		//Write history data to file
		if (millis() >= lastHistoryFileWriteMillis + historyFileWriteInterval)
		{
			if (motion == 1)  motionHistoryFileTriger++; //motion all time at "1"
			lastHistoryFileWriteMillis = millis();
			writeHistoryFile(motionHistoryFileTriger);
			motionHistoryFileTriger = 0.0;
		}


		return true;
	}
	return false;
};

bool MotionDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("motion", String(motion));
		return true;
	}
	return false;
};

String MotionDriver::onMessage(String _topic, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);
	if (!available) return result;
	//Motion sensor GPIO 1-pin (A0 by default)
	if (String(topic + "/getpin").equals(_topic))
	{
		result = onGetProperty("pin", String(getPin()), transportMask);
	}
	else if (String(topic + "/setpin").equals(_topic))
	{
		result = String(setPin(std::atoi(_payload.c_str())));
	}
	else if ((String(topic + "/getmotion").equals(_topic)) || (String(topic + "/setmotion").equals(_topic)))
	{
		result = onGetProperty("motion", String(getMotion()), transportMask);
	}
	return result;
}

//Motion Sensor 1-pin (A0 by default) ----------------------------------------------------
int MotionDriver::getPin()
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

bool MotionDriver::setPin(int _pin)
{
	pin = _pin;
	pinMode(pin, INPUT);
	filesWriteInt(id + ".pin", pin);
	return onInsideChange("pin", String(pin));
}

int MotionDriver::getMotion()
{
	motion = digitalRead(pin);
#ifdef DetailedDebug
	debugOut(id, "motion=" + String(motion));
#endif
	return motion;
}
