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

#include "ValveDriver.h"

bool ValveDriver::init()
{
	if (id.length() == 0) id = DriverID;
	BaseDriver::init(id);
	//init properies
	getPin1();
	getPin2();
	getPin3();
	pinMode(pin1, OUTPUT);
	digitalWrite(pin1, HIGH);
	pinMode(pin2, OUTPUT);
	digitalWrite(pin2, HIGH);
	pinMode(pin3, INPUT);
	return true;
}

bool ValveDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(Valve);
	setAvailable(available);
	return available;
}

bool ValveDriver::query()
{
	if (BaseDriver::query())
	{
		// publish Valve data if they are changed 
		int oldPosition = position;
		if (oldPosition != getPosition())
		{
			onInsideChange("position", String(position));
		}
		int oldphysicalposition = physicalposition;
		if (oldphysicalposition != getphysicalposition())
		{
			onInsideChange("physicalposition", String(physicalposition));
		}
		return true;
	}
	return false;
};

String ValveDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "position=" + String(position) + "\n";
	result += "pin1=" + String(pin1) + "\n";
	result += "pin2=" + String(pin2) + "\n";
	result += "pin3=" + String(pin3) + "\n";
	result += "physicalposition=" + String(physicalposition) + "\n";
	result += "minimumphysicalposition=" + String(minimumphysicalposition) + "\n";
	result += "maximumphysicalposition=" + String(maximumphysicalposition) + "\n";
	return result;
}


bool ValveDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("position", String(position));
		onInsideChange("physicalposition", String(physicalposition));
		return true;
	}
	return false;
};

String ValveDriver::onMessage(String _topic, String _payload, int transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);
	if (!available) return result;
	//Valve close pin1 (D1 by default)
	if (String(topic + "/getpin1").equals(_topic))
	{
		result = onGetProperty("pin1", String(getPin1()), transportMask);
	}
	else if (String(topic + "/setpin1").equals(_topic))
	{
		result = String(setPin1(std::atoi(_payload.c_str())));
	}

	//Valve open pin (D2 by default)
	else if (String(topic + "/getpin2").equals(_topic))
	{
		result = onGetProperty("pin2", String(getPin2()), transportMask);
	}
	else if (String(topic + "/setpin2").equals(_topic))
	{
		result = String(setPin2(std::atoi(_payload.c_str())));
	}

	//Valve physical position pin3 (A0 by default)
	else if (String(topic + "/getpin3").equals(_topic))
	{
		result = onGetProperty("pin3", String(getPin3()), transportMask);
	}
	else if (String(topic + "/setpin3").equals(_topic))
	{
		result = String(setPin3(std::atoi(_payload.c_str())));
	}

	else if (String(topic + "/getposition").equals(_topic))
	{
		result = onGetProperty("position", String(getPosition()), transportMask);
	}
	else if (String(topic + "/setposition").equals(_topic))
	{
		result = String(setPosition(std::atoi(_payload.c_str())));
	}

	else if (String(topic + "/getphysicalposition").equals(_topic))
	{
		result = onGetProperty("physicalposition", String(getphysicalposition()), transportMask);
	}

	else if (String(topic + "/getminimumphysicalposition").equals(_topic))
	{
		result = onGetProperty("minimumphysicalposition", String(getMinimumphysicalposition()), transportMask);
	}

	else if (String(topic + "/getmaximumphysicalposition").equals(_topic))
	{
		result = onGetProperty("maximumphysicalposition", String(getMaximumphysicalposition()), transportMask);
	}
	return result;
}

int ValveDriver::getPin1()
{
	if (filesExists(id + ".pin1"))
	{
		pin1 = filesReadInt(id + ".pin1");
	}
#ifdef DetailedDebug
	debugOut(id, "pin1=" + String(pin1));
#endif
	return pin1;
}

bool ValveDriver::setPin1(int _pin1)
{
	pin1 = _pin1;
	pinMode(pin1, OUTPUT);
	digitalWrite(pin1, HIGH);
	filesWriteInt(id + ".pin1", pin1);
	return onInsideChange("pin1", String(pin1));
}

int ValveDriver::getPin2()
{
	if (filesExists(id + ".pin2"))
	{
		pin2 = filesReadInt(id + ".pin2");
	}
#ifdef DetailedDebug
	debugOut(id, "pin2=" + String(pin2));
#endif
	return pin2;
}

bool ValveDriver::setPin2(int _pin2)
{
	pin2 = _pin2;
	pinMode(pin2, OUTPUT);
	digitalWrite(pin2, HIGH);
	filesWriteInt(id + ".pin2", pin2);
	return onInsideChange("pin2", String(pin2));
}

int ValveDriver::getPin3()
{
	if (filesExists(id + ".pin3"))
	{
		pin3 = filesReadInt(id + ".pin3");
	}
#ifdef DetailedDebug
	debugOut(id, "pin3=" + String(pin3));
#endif
	return pin3;
}

bool ValveDriver::setPin3(int _pin3)
{
	pin3 = _pin3;
	pinMode(pin3, INPUT);
	filesWriteInt(id + ".pin3", pin3);
	return onInsideChange("pin3", String(pin3));
}

int ValveDriver::getphysicalposition()
{
	if (filesExists(id + ".physicalposition"))
	{
		physicalposition = filesReadInt(id + ".physicalposition");
	}
#ifdef DetailedDebug
	debugOut(id, "physicalposition=" + String(physicalposition));
#endif
	return physicalposition;
}

int ValveDriver::getMinimumphysicalposition()
{
	if (filesExists(id + ".minimumphysicalposition"))
	{
		minimumphysicalposition = filesReadInt(id + ".minimumphysicalposition");
	}
#ifdef DetailedDebug
	debugOut(id, "minimumphysicalposition=" + String(minimumphysicalposition));
#endif
	return minimumphysicalposition;
}

int ValveDriver::getMaximumphysicalposition()
{
	if (filesExists(id + ".maximumphysicalposition"))
	{
		maximumphysicalposition = filesReadInt(id + ".maximumphysicalposition");
	}
#ifdef DetailedDebug
	debugOut(id, "maximumphysicalposition=" + String(maximumphysicalposition));
#endif
	return maximumphysicalposition;
}

int ValveDriver::getPosition()
{
	if (filesExists(id + ".position"))
	{
		position = filesReadInt(id + ".position");
	}
#ifdef DetailedDebug
	debugOut(id, "position=" + String(position));
#endif
	return position;
}

bool ValveDriver::setPosition(int _position)
{
	// valve stop commands, valve has veto for all output pins LOW level
	bool result = false;
	digitalWrite(pin1, HIGH);
	digitalWrite(pin2, HIGH);
	if (_position == 0)
	{ // closing valve
		toMinMaxPosition(pin1);
		minimumphysicalposition = physicalposition;
		filesWriteInt(id + ".minimumphysicalposition", minimumphysicalposition);
		result = onInsideChange("minimumphysicalposition", String(minimumphysicalposition));
	}
	else if (_position == 100)
	{ // opening valve
		toMinMaxPosition(pin2);
		maximumphysicalposition = physicalposition;
		filesWriteInt(id + ".maximumphysicalposition", maximumphysicalposition);
		result = onInsideChange("maximumphysicalposition", String(maximumphysicalposition));
	}
	else return result; // _position must be equal 0 or 100
	// after mooving
	position = _position;
	filesWriteInt(id + ".position", position);
	onInsideChange("position", String(position));
	filesWriteInt(id + ".physicalposition", physicalposition);
	return onInsideChange("physicalposition", String(physicalposition));
}

void ValveDriver::toMinMaxPosition(int _pin)
{
	physicalposition = analogRead(pin3);
	digitalWrite(_pin, LOW); //move command
	for (int i = 0; i < 100; i++)
	{
		delay(500); // mooving
		newphysicalposition = analogRead(pin3);
		if (newphysicalposition == physicalposition) break; // valve is stoped
		physicalposition = newphysicalposition;
	} // for
	digitalWrite(_pin, HIGH); // stop command
}
;
