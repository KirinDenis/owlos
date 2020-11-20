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
#ifdef USE_ACTUATOR_DRIVER
#define DRIVER_MASK "ActuatorDriver"
#define DRIVER_ID "actuator1"
#define ActuatorLoopInterval 200

bool ActuatorDriver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);

	DriverPin *driverPin = getDriverPinByDriverId(id, PIN0_INDEX); //командный пин "закрыть"
	if (driverPin != nullptr)
	{
		if (setDriverPinMode(id, PIN0_INDEX, OUTPUT).length() == 0)
		{
			//если используемый пин поддерживает ЦАП, то драйвер актуратора переходит в аналоговый режим
			//свойство дата 0..1023 (где 1023 уровень логической единицы)
			//получаем тип выбранного под актуатор пина по его имени getPinByName(driverPin->name)->pinTypes
			//с масской ANALOG_O_MASK, если флаг ANALOG_O_MASK взведен то AND с типом пина будет больше нуля
			setAnalog(getPinByName(driverPin->name)->pinTypes & ANALOG_O_MASK, false);
			//на случай перезагрузки, в файле сохранено последнее состояние актуатора
			getData();			  //прочесть последнее состояние
			setData(data, false); //вернуть последнее запомненное состояние
			return true;
		}
	}
	return false;
}

bool ActuatorDriver::begin(String _topic)
{	
	BaseDriver::begin(_topic);	
	setType(ACTUATOR_DRIVER_TYPE);
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
	return BaseDriver::getAllProperties() +
		   "analog=" + String(analog) + "//br\n"
										"data=" +
		   String(data) + "//is\n"
						  "pwm=" +
		   String(pwm) + "//b\n"
						 "pwmdelay=" +
		   String(pwmdelay) + "//i\n"
							  "invert=" +
		   String(invert) + "//b\n";
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

String ActuatorDriver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;

	if (matchRoute(route, topic, "/getanalog"))
	{
		result = onGetProperty("analog", String(getAnalog()), transportMask);
	}
	else if (matchRoute(route, topic, "/getdata"))
	{
		result = onGetProperty("data", String(getData()), transportMask);
	}
	else if (matchRoute(route, topic, "/setdata"))
	{
		result = String(setData(atoi(_payload.c_str()), true));
	}
	else if (matchRoute(route, topic, "/getpwm"))
	{
		result = onGetProperty("pwm", String(getPWM()), transportMask);
	}
	else if (matchRoute(route, topic, "/setpwm"))
	{
		result = String(setPWM(atoi(_payload.c_str()), true));
	}
	else if (matchRoute(route, topic, "/getpwmdelay"))
	{
		result = onGetProperty("pwmdelay", String(getPWMDelay()), transportMask);
	}
	else if (matchRoute(route, topic, "/setpwmdelay"))
	{
		result = String(setPWMDelay(atoi(_payload.c_str()), true));
	}
	else if (matchRoute(route, topic, "/getinvert"))
	{
		result = onGetProperty("invert", String(getInvert()), transportMask);
	}
	else if (matchRoute(route, topic, "/setinvert"))
	{
		result = String(setInvert(atoi(_payload.c_str()), true));
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "analog=" + String(data));
#endif
#endif

	return data;
}

bool ActuatorDriver::setAnalog(bool _analog, bool doEvent)
{
//see init() if target pin is not analog the mask set _analog to "0" false
#ifdef DEBUG
	debugOut("ANALOG", String(_analog));
#endif
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
	data = 0; //default is false for digital and zero level for analog
	if (filesExists(id + ".data"))
	{
		data = filesReadInt(id + ".data");
	}
	else
	{ //initial set data
		setData(data, 0);
	}

	return data;
}

bool ActuatorDriver::setData(int _data, bool doEvent)
{

	int storeData = data;

	data = _data;

	if (invert)
	{
		if (analog || pwm)
		{
			_data = 1024 - _data;
			storeData = 1024 - storeData;
		}
		else
		{
			_data = 1 - _data;
			storeData = 1 - storeData;
		}
	}

	if ((pwm) && (pwmdelay > 0))
	{
		//if ESP OPTION with  interval = 0 do not do this
		if (storeData > _data)
		{
			for (int i = storeData; i > _data; i--)
			{
				if (_driverPinWrite(id, PIN0_INDEX, i, pwm).length() != 0)
					break;
				delay(pwmdelay); //TODO ESP OPTION with this interval
				yield();		 //throw a bone to watch dog
			}
		}
		else
		{
			for (int i = storeData; i < _data; i++)
			{
				if (_driverPinWrite(id, PIN0_INDEX, i, pwm).length() != 0)
					break;
				delay(pwmdelay); //TODO ESP OPTION with this interval
				yield();		 //throw a bone to watch dog
			}
		}
	}

	if (_driverPinWrite(id, PIN0_INDEX, _data, pwm).length() == 0)
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

//PWM -------------------------------------------
bool ActuatorDriver::getPWM()
{
	pwm = false; //default is false for digital and zero level for analog
	if (filesExists(id + ".pwm"))
	{
		pwm = filesReadInt(id + ".pwm");
	}
	else
	{ //initial set data
		setPWM(pwm, false);
	}

	return pwm;
}

bool ActuatorDriver::setPWM(bool _pwm, bool doEvent)
{
	pwm = _pwm;

	filesWriteInt(id + ".pwm", pwm);
	if (doEvent)
	{
		return onInsideChange("pwm", String(pwm));
	}
	return true;
};

//PWM Delay -------------------------------------------
int ActuatorDriver::getPWMDelay()
{
	pwmdelay = 1; //default is 1, if zero - no delay
	if (filesExists(id + ".pwmdelay"))
	{
		pwmdelay = filesReadInt(id + ".pwmdelay");
	}
	else
	{ //initial set data
		setPWMDelay(pwmdelay, 0);
	}

	return pwmdelay;
}

bool ActuatorDriver::setPWMDelay(int _pwmdelay, bool doEvent)
{
	pwmdelay = _pwmdelay;

	filesWriteInt(id + ".pwmdelay", pwmdelay);
	if (doEvent)
	{
		return onInsideChange("pwmdelayt", String(pwmdelay));
	}
	return true;
};

//Invert -------------------------------------------
bool ActuatorDriver::getInvert()
{
	invert = false;
	if (filesExists(id + ".invert"))
	{
		invert = filesReadInt(id + ".invert");
	}
	else
	{ //initial set data
		setInvert(invert, 0);
	}

	return invert;
}

bool ActuatorDriver::setInvert(bool _invert, bool doEvent)
{
	invert = _invert;

	filesWriteInt(id + ".invert", invert);
	if (doEvent)
	{
		return onInsideChange("invert", String(invert));
	}
	return true;
};

#endif
