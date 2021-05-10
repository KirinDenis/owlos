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

#include "_SampleDriver.h"
#ifdef USE_SAMPLE_DRIVER
#define DRIVER_MASK "_SampleDriver"
#define DRIVER_ID "_Sample1"
#define _SampleLoopInterval 200

bool _SampleDriver::init()
{
	if (id.length() == 0)
	{
		id = DRIVER_ID;
	}
	BaseDriver::init(id);

	DriverPin *driverPin = getDriverPinByDriverId(id, PIN0_INDEX);
	if (driverPin != nullptr)
	{
		if (setDriverPinMode(id, PIN0_INDEX, OUTPUT).length() == 0)
		{
			getProp1();			  
			setProp1(prop1, false); 

			getProp2();			  
			setProp2(prop2, false); 

			return true;
		}
	}
	return false;
}

bool _SampleDriver::begin(String _topic)
{	
	BaseDriver::begin(_topic);	
	setType(SAMPLE_DRIVER_TYPE);
	setAvailable(available);	
	return available;
}

bool _SampleDriver::query()
{
	if (BaseDriver::query())
	{
		//for _Sample publish data() as it changed
		int _prop1 = prop1;
		if (_prop1 != getProp1())
		{
			onInsideChange("prop1", String(prop1));
		}
		return true;
	}
	return false;
};

String _SampleDriver::getAllProperties()
{
	return BaseDriver::getAllProperties() +
		   
			"prop1=" + String(prop1) + "//is\n" + "prop2=" + String(prop2) + "//is\n";
}

bool _SampleDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("prop1", String(prop1));
		onInsideChange("prop2", String(prop1));
		return true;
	}
	return false;
};

String _SampleDriver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;

	else if (matchRoute(route, topic, "/getprop1"))
	{
		result = onGetProperty("prop1", String(getProp1()), transportMask);
	}
	else if (matchRoute(route, topic, "/getprop2"))
	{
		result = onGetProperty("prop2", String(getProp2()), transportMask);
	}

	return result;
}


//Prop1 -------------------------------------------
int _SampleDriver::getProp1()
{
	prop1 = 0; //default is false for digital and zero level for analog
	if (filesExists(id + ".prop1"))
	{
		prop1 = filesReadInt(id + ".prop1");
	}
	else
	{ //initial set data
		setProp1(prop1, 0);
	}

	return prop1;
}

bool _SampleDriver::setProp1(int _prop1, bool doEvent)
{

	int storeProp1 = prop1;

	prop1 = _prop1;

	return false;
};

//Prop2 -------------------------------------------
int _SampleDriver::getProp2()
{
	prop2 = 0; //default is false for digital and zero level for analog
	if (filesExists(id + ".prop2"))
	{
		prop2 = filesReadInt(id + ".prop2");
	}
	else
	{ //initial set data
		setProp2(prop2, 0);
	}

	return prop2;
}

bool _SampleDriver::setProp2(int _prop2, bool doEvent)
{

	int storeProp2 = prop2;

	prop2 = _prop2;

	return false;
};

#endif
