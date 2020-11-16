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
#ifdef USE_VALVE_DRIVER

//Драйвер запорной арматуры (ValveDriver) с электроприводом и резистивным сенсором положения
//WiKi:
//https://ru.wikipedia.org/wiki/%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%BF%D1%80%D0%B8%D0%B2%D0%BE%D0%B4_%D0%B0%D1%80%D0%BC%D0%B0%D1%82%D1%83%D1%80%D1%8B
//Обзор:
//https://www.youtube.com/watch?v=tt9oZyzgMZ8
//Примечания:
// - поддерживается редукторная запорная арматура, с двумя командными контакторами - "открыть", "закрыть".
// - возможно использование сенсора положения - переменный регистр прикрепленный к затвору. Требует калибровки - замер сопротивления в положение "открыто" и в положение "закрыто".
//   резистор подключается к АЦП ESPxx, оцифрованное значение уровня сигнала используется драйвером для выполнения команд "открыть" "закрыть".
//   без использования сенсора положения - необходимо выделять время на выполнения команд. Время необходимо установить экспериментально - переключая запорную арматуру между положениями.
//   для безопасности увеличьте полученное значение на два.
// Вам понадобится два цифровых Output пина и один аналоговый Input (АЦП) пин.

#define DRIVER_ID "valve"

//проверка доступности Valve
bool ValveDriver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);

	/*
	DriverPin * closePinDriverInfo = getDriverPinByDriverId(id, CLOSE_PIN_INDEX);    //командный пин "закрыть"
	DriverPin * openPinDriverInfo = getDriverPinByDriverId(id, OPEN_PIN_INDEX);     //командный пин "открыть"
	DriverPin * positionPinDriverInfo = getDriverPinByDriverId(id, POSITION_PIN_INDEX); //пин сенсора положения
	if ((closePinDriverInfo != nullptr)
		&& (openPinDriverInfo != nullptr)
		&& (positionPinDriverInfo != nullptr))
	{
	*/
	if ((setDriverPinMode(id, CLOSE_PIN_INDEX, OUTPUT).length() == 0) && (setDriverPinMode(id, OPEN_PIN_INDEX, OUTPUT).length() == 0) && (setDriverPinMode(id, POSITION_PIN_INDEX, INPUT).length() == 0))
	{
		//PinService разрешил использования всех необходимых Valve пинов, отправляем две команды стоп
		driverPinWrite(id, CLOSE_PIN_INDEX, MOTOR_STOP_COMMAND);
		driverPinWrite(id, OPEN_PIN_INDEX, MOTOR_STOP_COMMAND);
		//Valve готова
		return true;
	}
	//}
	//Valve не может быть использована
	return false;
}
//Появилось сетевое подключение, Valve готовится принимать команды
bool ValveDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(VALVE_DRIVER_TYPE);
	setAvailable(available);
	return available;
}
//Опрос состояния Valve каждый queryInterval
bool ValveDriver::query()
{
	if (BaseDriver::query())
	{
		// publish Valve data if they are changed
		int oldPosition = position;
		if (oldPosition != getPosition()) //получить и передать текущее положение заслонки в процентах
		{
			onInsideChange("position", String(position));
		}
		int oldphysicalposition = physicalposition;
		if (oldphysicalposition != getphysicalposition()) //значение положения прочитанное с сенсора
		{
			onInsideChange("physicalposition", String(physicalposition));
		}
		return true;
	}
	return false;
};
//Возвращает все свойства драйвера Valve
String ValveDriver::getAllProperties()
{
	return BaseDriver::getAllProperties() +
		   "position=" + String(position) + "\n"
											"physicalposition=" +
		   String(physicalposition) + "\n"
									  "minimumphysicalposition=" +
		   String(minimumphysicalposition) + "\n"
											 "maximumphysicalposition=" +
		   String(maximumphysicalposition) + "\n";
}
//Отправка данных о положении заслонки Valva в сеть по publishInterval
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
//Обработка внешних команд для драйвера Valve
String ValveDriver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;

	else if (matchRoute(route, topic, "/getposition"))
	{
		result = onGetProperty("position", String(getPosition()), transportMask);
	}
	else if (matchRoute(route, topic, "/setposition"))
	{
		result = String(setPosition(atoi(_payload.c_str())));
	}

	else if (matchRoute(route, topic, "/getphysicalposition"))
	{
		result = onGetProperty("physicalposition", String(getphysicalposition()), transportMask);
	}

	else if (matchRoute(route, topic, "/getminimumphysicalposition"))
	{
		result = onGetProperty("minimumphysicalposition", String(getMinimumphysicalposition()), transportMask);
	}

	else if (matchRoute(route, topic, "/getmaximumphysicalposition"))
	{
		result = onGetProperty("maximumphysicalposition", String(getMaximumphysicalposition()), transportMask);
	}
	return result;
}
//Получить физическое положение заслонки
int ValveDriver::getphysicalposition()
{
	if (filesExists(id + ".physicalposition")) //положение было ранее прочитано в query()
	{
		physicalposition = filesReadInt(id + ".physicalposition");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "physicalposition=" + String(physicalposition));
#endif
#endif
	return physicalposition;
}

int ValveDriver::getMinimumphysicalposition()
{
	if (filesExists(id + ".minimumphysicalposition"))
	{
		minimumphysicalposition = filesReadInt(id + ".minimumphysicalposition");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "minimumphysicalposition=" + String(minimumphysicalposition));
#endif
#endif
	return minimumphysicalposition;
}

int ValveDriver::getMaximumphysicalposition()
{
	if (filesExists(id + ".maximumphysicalposition"))
	{
		maximumphysicalposition = filesReadInt(id + ".maximumphysicalposition");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "maximumphysicalposition=" + String(maximumphysicalposition));
#endif
#endif
	return maximumphysicalposition;
}

int ValveDriver::getPosition()
{
	if (filesExists(id + ".position"))
	{
		position = filesReadInt(id + ".position");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "position=" + String(position));
#endif
#endif
	return position;
}

bool ValveDriver::setPosition(int _position)
{
	// valve stop commands, valve has veto for all output pins LOW level
	bool result = false;
	//команда стоп
	if ((driverPinWrite(id, CLOSE_PIN_INDEX, MOTOR_STOP_COMMAND).length() == 0) && (driverPinWrite(id, OPEN_PIN_INDEX, MOTOR_STOP_COMMAND).length() == 0))
	{

		//закрыть заслонку
		if (_position == 0)
		{ // closing valve
			toMinMaxPosition(CLOSE_PIN_INDEX);
			minimumphysicalposition = physicalposition;
			filesWriteInt(id + ".minimumphysicalposition", minimumphysicalposition);
			result = onInsideChange("minimumphysicalposition", String(minimumphysicalposition));
		}
		else
			//открыть заслонку
			if (_position == 100)
		{ // opening valve
			toMinMaxPosition(OPEN_PIN_INDEX);
			maximumphysicalposition = physicalposition;
			filesWriteInt(id + ".maximumphysicalposition", maximumphysicalposition);
			result = onInsideChange("maximumphysicalposition", String(maximumphysicalposition));
		}
		else
			return result; // _position must be equal 0 or 100
						   // after mooving
		position = _position;
		filesWriteInt(id + ".position", position);
		onInsideChange("position", String(position));
		filesWriteInt(id + ".physicalposition", physicalposition);
		return onInsideChange("physicalposition", String(physicalposition));
	}
	return false;
}

void ValveDriver::toMinMaxPosition(int _pin)
{
	physicalposition = driverPinRead(id, POSITION_PIN_INDEX);
	if (driverPinWrite(id, _pin, MOTOR_START_COMMAND).length() == 0)
	{
		for (int i = 0; i < 100; i++)
		{
			delay(500); // mooving
			newphysicalposition = driverPinRead(id, POSITION_PIN_INDEX);
			if (newphysicalposition == physicalposition)
				break; // valve is stoped
			if (newphysicalposition == -1)
				break;
			physicalposition = newphysicalposition;
		}										// for
		digitalWrite(_pin, MOTOR_STOP_COMMAND); // stop command
	}
};
#endif
