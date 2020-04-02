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

#include "StepperDriver.h"

bool StepperDriver::init()
{
	if (id.length() == 0) id = DRIVER_ID;
	BaseDriver::init(id);

	//init properies
	getPin1();
	getPin2();
	getPin3();
	getPin4();
	getToPosition();
	getBusy();
	getStop();
	getPosition();
	getRange();
	getSpeed();

	pinMode(pin1, OUTPUT);
	pinMode(pin2, OUTPUT);
	pinMode(pin3, OUTPUT);
	pinMode(pin4, OUTPUT);

	doStop();

	if (toPosition != position)
	{
		setBusy(0);
		setToPosition(position);
	}
}

bool StepperDriver::begin(String _topic)
{
	setBusy(0);
	setStop(0);
	BaseDriver::begin(_topic);
	setType(Stepper);
	setAvailable(available);
	return available;
}

String StepperDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "position=" + String(position) + "//is\n";
	result += "pin1=" + String(pin1) + "//i\n";
	result += "pin2=" + String(pin2) + "//i\n";
	result += "pin3=" + String(pin3) + "//i\n";
	result += "pin4=" + String(pin4) + "//i\n";
	result += "toposition=" + String(toPosition) + "//is\n";
	result += "busy=" + String(busy) + "//rb\n";
	result += "stop=" + String(stop) + "//b\n";
	result += "range=" + String(range) + "//i\n";
	result += "speed=" + String(speed) + "//i\n";
	return result;
}

String StepperDriver::onMessage(String _topic, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);
	if (!available) return result;
	//Stepper GPIO 1-pin (D4 by default)
	if (String(topic + "/getpin1").equals(_topic))
	{
		result = onGetProperty("pin1", String(getPin1()), transportMask);
	}
	else if (String(topic + "/setpin1").equals(_topic))
	{
		result = String(setPin1(std::atoi(_payload.c_str())));
	}
	else
		//Stepper GPIO 2-pin (D5 by default)
		if (String(topic + "/getpin2").equals(_topic))
		{
			result = onGetProperty("pin2", String(getPin2()), transportMask);
		}
		else if (String(topic + "/setpin2").equals(_topic))
		{
			result = String(setPin2(std::atoi(_payload.c_str())));
		}
		else
			//Stepper GPIO 3-pin (D6 by default)
			if (String(topic + "/getpin3").equals(_topic))
			{
				result = onGetProperty("pin3", String(getPin3()), transportMask);
			}
			else if (String(topic + "/setpin3").equals(_topic))
			{
				result = String(setPin3(std::atoi(_payload.c_str())));
			}
			else
				//Stepper GPIO 4-pin (D7 by default) -----------------------------------------
				if (String(topic + "/getpin4").equals(_topic))
				{
					result = onGetProperty("pin4", String(getPin4()), transportMask);
				}
				else if (String(topic + "/setpin4").equals(_topic))
				{
					result = String(setPin4(std::atoi(_payload.c_str())));
				}
				else
					//Stepper driver to position step counter -----------------------------------
					if (String(topic + "/gettoposition").equals(_topic))
					{
						result = onGetProperty("toposition", String(getToPosition()), transportMask);
					}
					else if (String(topic + "/settoposition").equals(_topic))
					{
						result = String(setToPosition(std::atoi(_payload.c_str())));
					}
					else
						//Busy ----------------------------------------------------------------------
						if (String(topic + "/getbusy").equals(_topic))
						{
							result = onGetProperty("busy", String(getBusy()), transportMask);
						}
						else if (String(topic + "/setbusy").equals(_topic))
						{
							result = String(setBusy(std::atoi(_payload.c_str())));
						}
						else
							//Stop ----------------------------------------------------------------------
							if (String(topic + "/getstop").equals(_topic))
							{
								result = onGetProperty("stop", String(getStop()), transportMask);
							}
							else if (String(topic + "/setstop").equals(_topic))
							{
								result = String(setStop(std::atoi(_payload.c_str())));
							}
							else
								//Position -----------------------------------------------------------------
								if (String(topic + "/getposition").equals(_topic))
								{
									result = onGetProperty("position", String(getPosition()), transportMask);
								}
								else if (String(topic + "/setposition").equals(_topic))
								{
									result = String(setPosition(std::atoi(_payload.c_str()), true));
								}
								else
									//Range -----------------------------------------------------------------
									if (String(topic + "/getrange").equals(_topic))
									{
										result = onGetProperty("range", String(getRange()), transportMask);
									}
									else if (String(topic + "/setrange").equals(_topic))
									{
										result = String(setRange(std::atoi(_payload.c_str())));
									}
	//Speed ----------------------------------------------------------------
	if (String(topic + "/getspeed").equals(_topic))
	{
		result = onGetProperty("speed", String(getSpeed()), transportMask);
	}
	else if (String(topic + "/setspeed").equals(_topic))
	{
		result = String(setSpeed(std::atoi(_payload.c_str())));
	}
	return result;

}

//Stepper GPIO 1-pin (D4 by default) ----------------------------------------------------
int StepperDriver::getPin1()
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

bool StepperDriver::setPin1(int _pin1)
{
	pin1 = _pin1;
	pinMode(pin1, OUTPUT);
	filesWriteInt(id + ".pin1", pin1);
	return onInsideChange("pin1", String(pin1));
}

//Stepper GPIO 2-pin (D5 by default) ----------------------------------------------------
int StepperDriver::getPin2()
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

bool StepperDriver::setPin2(int _pin2)
{
	pin2 = _pin2;
	pinMode(pin2, OUTPUT);
	filesWriteInt(id + ".pin2", pin2);
	return onInsideChange("pin2", String(pin2));
}

//Stepper GPIO 3-pin (D6 by default) ----------------------------------------------------
int StepperDriver::getPin3()
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

bool StepperDriver::setPin3(int _pin3)
{
	pin3 = _pin3;
	pinMode(pin3, OUTPUT);
	filesWriteInt(id + ".pin3", pin3);
	return onInsideChange("pin3", String(pin3));
}

//Stepper GPIO 4-pin (D7 by default) ----------------------------------------------------
int StepperDriver::getPin4()
{
	if (filesExists(id + ".pin4"))
	{
		pin4 = filesReadInt(id + ".pin4");
	}
#ifdef DetailedDebug
	debugOut(id, "pin4=" + String(pin4));
#endif
	return pin4;
}

bool StepperDriver::setPin4(int _pin4)
{
	pin4 = _pin4;
	pinMode(pin4, OUTPUT);
	filesWriteInt(id + ".pin4", pin4);
	return onInsideChange("pin4", String(pin4));
}

// TO POSITION -----------------------------------------------------------------------------------------------------------
//Set toPosition property - stepper count steps to -> _toPosition value (Position property change by the stepper count way
//------------------------------------------------------------------------------------------------------------------------
int StepperDriver::getToPosition()
{
	if (filesExists(id + ".toposition"))
	{
		toPosition = filesReadInt(id + ".toposition");
	}
#ifdef DetailedDebug
	debugOut(id, "toposition=" + String(toPosition));
#endif
	return toPosition;
}

bool StepperDriver::setToPosition(int _toPosition)
{
	if (busy == 1)
	{
		onInsideChange("busy", String(busy));
#ifdef DetailedDebug
		debugOut(id, "Stepper busy ");
#endif
		return false;
	}
	setBusy(1);
	setStop(0);


	toPosition = _toPosition;

	if (toPosition > range)
	{
		toPosition = range;
	}
	else if (toPosition < 0)
	{
		toPosition = 0;
	}

#ifdef DetailedDebug
	debugOut(id, "setToPosition: " + String(_toPosition) + "->" + String(toPosition));
#endif
	filesWriteInt(id + ".toposition", toPosition);
	onInsideChange("toposition", String(toPosition));

	int count = toPosition - position;

	while (count > 0) {
		if (stop == 1) break;
		for (int i = 0; i < 8; i++)
		{
			doOutput(i);
			delayMicroseconds(speed);
		}
		count--;
		setPosition(++position, false);

		if (position % 5 == 0)
		{
			transportLoop();
		}
		if (position % StepperLoopInterval == 0)
		{
			setPosition(position, true);
		}
	}

	while (count < 0) {
		if (stop == 1) break;
		for (int i = 7; i >= 0; i--)
		{
			doOutput(i);
			delayMicroseconds(speed);
		}
		count++;

		setPosition(--position, false);
		if (position % 5 == 0)
		{
			transportLoop();
		}
		if (position % StepperLoopInterval == 0)
		{
			setPosition(position, true);
		}
	}
	setPosition(position, true);
	setStop(1);
	setBusy(0);
	return true;
}

// Busy -------------------------------------------
int StepperDriver::getBusy()
{
	if (filesExists(id + ".busy"))
	{
		busy = filesReadInt(id + ".busy");
	}
#ifdef DetailedDebug
	debugOut(id, "busy=" + String(busy));
#endif
	return busy;
}

bool StepperDriver::setBusy(int _busy)
{
	busy = _busy;
	filesWriteInt(id + ".busy", busy);
	return onInsideChange("busy", String(busy));
}

// Stop -------------------------------------------
int StepperDriver::getStop()
{
	if (filesExists(id + ".stop"))
	{
		stop = filesReadInt(id + ".stop");
	}
#ifdef DetailedDebug
	debugOut(id, "stop=" + String(stop));
#endif
	return stop;
}

bool StepperDriver::setStop(int _stop) {
	stop = _stop;
	filesWriteInt(id + ".stop", stop);
	bool result = onInsideChange("stop", String(stop));
	if (stop == 1)
	{
		doStop();
	}
	return result;
}

//Position -------------------------------------------
int StepperDriver::getPosition()
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

bool StepperDriver::setPosition(int _position, bool doEvent)
{
	position = _position;

	if (doEvent)
	{
		filesWriteInt(id + ".position", position);
		return onInsideChange("position", String(position));
	}
	return true;
}

//Range -------------------------------------------
int StepperDriver::getRange()
{
	if (filesExists(id + ".range"))
	{
		range = filesReadInt(id + ".range");
	}
#ifdef DetailedDebug
	debugOut(id, "range=" + String(range));
#endif
	return range;
}

bool StepperDriver::setRange(int _range)
{
	range = _range;
	filesWriteInt(id + ".range", range);
	return onInsideChange("range", String(range));
}

//Speed -------------------------------------------
int StepperDriver::getSpeed()
{
	if (filesExists(id + ".speed"))
	{
		speed = filesReadInt(id + ".speed");
	}
#ifdef DetailedDebug
	debugOut(id, "speed=" + String(speed));
#endif
	return speed;
}

bool StepperDriver::setSpeed(int _speed)
{
	speed = _speed;
	filesWriteInt(id + ".speed", speed);
	return onInsideChange("speed", String(speed));
}


//------------------------------------------------------------------------------------------------
//DO ---------------------------------------------------------------------------------------------
//DO Stop ----------------------------------------------------------------------------------------
void StepperDriver::doStop()
{
	digitalWrite(pin1, B00000);
	digitalWrite(pin2, B00000);
	digitalWrite(pin3, B00000);
	digitalWrite(pin4, B00000);
}

void StepperDriver::doOutput(int out) {
	digitalWrite(pin1, bitRead(lookup[out], 0));
	digitalWrite(pin2, bitRead(lookup[out], 1));
	digitalWrite(pin3, bitRead(lookup[out], 2));
	digitalWrite(pin4, bitRead(lookup[out], 3));
};
