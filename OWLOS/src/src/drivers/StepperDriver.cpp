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
#ifdef USE_STEPPER_DRIVER

//Драйвер шагового электродвигателя (HALF-STEP DRIVE)
//WiKi:
//https://en.wikipedia.org/wiki/Stepper_motor
//https://ru.wikipedia.org/wiki/%D0%A8%D0%B0%D0%B3%D0%BE%D0%B2%D1%8B%D0%B9_%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%B4%D0%B2%D0%B8%D0%B3%D0%B0%D1%82%D0%B5%D0%BB%D1%8C

//Данный драйвер реализует следующею модель управления шаговым электродвигателем:
//- свойство position хранит текущею позицию
//- свойство range задает границы - количество шагов от "начала" до "конца" (0..range) - position обязана находится в рамках означенных range.
//- свойство toPosition указывает желаемую позицию, таким образом пока toPosition != position драйвер начинает циклично переключать обмотки шагового электродвигателя
//используя маски включения обмоток из массива stepMask (маски задают half-step метод управления обмотками - смотрите WiKi, вы можете изменить эти маски и использовать другие
//методы).
//- position подсчитывает количество переключения обмоток, таким образом когда toPosition == position, драйвер прекратит переключать обмотки, до следующего изменения toPosition.

//После сборки физической части - вам потребуется калибровка:
//- установите ваше устройство в начальную позицию.
//- в драйвере указжите position = 0
//- укажите range=1000 (первая калибровочная метка)
//- укажите toPosition=1000
//- шаговый двигатель начнет движение от postion-0 в сторону position-1000
//- когда физически будет достигнута позиция 1000 - вы сможете оценить сколько шагов в вашем range, например 2250. Физически верните устройство в позицию 0, измените
//  свойства драйвера position=0, повторите с toPosition=2250 - если устройство достигнет нужной отметки - калибровка закончена.

//Внимание - шаговые электродвигатели склоны к проскальзыванию, например если сильно нагрузить вал, при этом погрешность может быть в обе стороны.
//Внимание - откалибруйте свойство speed - скорость переключения обмоток, для достижения оптимальной скорости работы шагового электродвигателя - у каждого двигателя интервал
//переключения обмоток индивидуален.

//Вы можете расширить возможности этого драйвера и избежать калибровки - если используете схему с двумя концевыми выключателями, например герконами. Подключите их к микроконтроллеру, установите
//для них два SensorDriver, после чего используйте Battle Humster script - когда устройство будет достигать очередного выключателя - отправляйте команду stop в StepperDriver.
//https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D1%86%D0%B5%D0%B2%D0%BE%D0%B9_%D0%B2%D1%8B%D0%BA%D0%BB%D1%8E%D1%87%D0%B0%D1%82%D0%B5%D0%BB%D1%8C

//Основной метод драйвера setToPostion() - начните изучение драйвера с него.
#define DRIVER_ID "StepperDriver"

#ifdef USE_ESP_DRIVER
#include "../services/TransportService.h"
#endif

bool StepperDriver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);
	//все указанные пользователем пины должны быть доступны и переключаться в режим OUTPUT
	if ((getDriverPinByDriverId(id, PIN0_INDEX) != nullptr) &&
		(getDriverPinByDriverId(id, PIN1_INDEX) != nullptr) &
			(getDriverPinByDriverId(id, PIN2_INDEX) != nullptr) &&
		(getDriverPinByDriverId(id, PIN3_INDEX) != nullptr))
	{
		if ((setDriverPinMode(id, PIN0_INDEX, OUTPUT).length() == 0) &&
			(setDriverPinMode(id, PIN1_INDEX, OUTPUT).length() == 0) &&
			(setDriverPinMode(id, PIN2_INDEX, OUTPUT).length() == 0) &&
			(setDriverPinMode(id, PIN3_INDEX, OUTPUT).length() == 0))
		{
			getToPosition();
			getBusy();
			getStop();
			getPosition();
			getRange();
			getSpeed();
			doStop();

			if (toPosition != position)
			{
				setBusy(0);
				setToPosition(position);
			}

			return true;
		}
	}
	return false;
}

bool StepperDriver::begin(String _topic)
{
	setBusy(0);
	setStop(0);
	BaseDriver::begin(_topic);
	setType(STEPPER_DRIVER_TYPE);
	setAvailable(available);
	return available;
}

String StepperDriver::getAllProperties()
{
	return BaseDriver::getAllProperties() +
		   "position=" + String(position) + "//is\n"
											"toposition=" +
		   String(toPosition) + "//is\n"
								"busy=" +
		   String(busy) + "//rb\n"
						  "stop=" +
		   String(stop) + "//b\n"
						  "range=" +
		   String(range) + "//i\n"
						   "speed=" +
		   String(speed) + "//i\n";
}

String StepperDriver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;
	//Stepper driver to position step counter -----------------------------------
	if (matchRoute(route, topic, "/gettoposition"))
	{
		result = onGetProperty("toposition", String(getToPosition()), transportMask);
	}
	else if (matchRoute(route, topic, "/settoposition"))
	{
		result = String(setToPosition(atoi(_payload.c_str())));
	}
	//Busy ----------------------------------------------------------------------
	else if (matchRoute(route, topic, "/getbusy"))
	{
		result = onGetProperty("busy", String(getBusy()), transportMask);
	}
	else if (matchRoute(route, topic, "/setbusy"))
	{
		result = String(setBusy(atoi(_payload.c_str())));
	}
	//Stop ----------------------------------------------------------------------
	else if (matchRoute(route, topic, "/getstop"))
	{
		result = onGetProperty("stop", String(getStop()), transportMask);
	}
	else if (matchRoute(route, topic, "/setstop"))
	{
		result = String(setStop(atoi(_payload.c_str())));
	}
	//Position -----------------------------------------------------------------
	else if (matchRoute(route, topic, "/getposition"))
	{
		result = onGetProperty("position", String(getPosition()), transportMask);
	}
	else if (matchRoute(route, topic, "/setposition"))
	{
		result = String(setPosition(atoi(_payload.c_str()), true));
	}
	//Range -----------------------------------------------------------------
	else if (matchRoute(route, topic, "/getrange"))
	{
		result = onGetProperty("range", String(getRange()), transportMask);
	}
	else if (matchRoute(route, topic, "/setrange"))
	{
		result = String(setRange(atoi(_payload.c_str())));
	}
	//Speed ----------------------------------------------------------------
	else if (matchRoute(route, topic, "/getspeed"))
	{
		result = onGetProperty("speed", String(getSpeed()), transportMask);
	}
	else if (matchRoute(route, topic, "/setspeed"))
	{
		result = String(setSpeed(atoi(_payload.c_str())));
	}
	return result;
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "toposition=" + String(toPosition));
#endif
#endif
	return toPosition;
}

//Основной метод управления шаговым электродвигателем (связан со свойством toPosition)
//Этот метод переключает обмотки шагового электродвигателя до тех пор пока свойство toPosition не будет равно
//значению свойства position.
//Метод усложняется требованиями накладываемыми IoT - узел должен оставаться в сети и обрабатывать сетевые запросы.
//Например если понадобится немедленно остановить двигатель.
bool StepperDriver::setToPosition(int _toPosition)
{
	//если двигатель уже находится в движении, сообщаем об этом "наверх", ничего не делаем
	if (busy == 1)
	{
		onInsideChange("busy", String(busy));
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "Stepper busy ");
#endif
#endif
		return false;
	}
	//занимаем двигатель
	setBusy(1);
	//выключаем обмотки (возможно в предыдущий раз произошел сбой и физический драйвер двигателя держит некоторые обмотки включенными)
	setStop(0);
	//сохраняем (применяем) новое значение для toPosition
	toPosition = _toPosition;
	//если новое значение toPosition вышла за рамки range - выровняем toPosition по range
	if (toPosition > range)
	{
		toPosition = range;
	}
	else if (toPosition < 0)
	{
		toPosition = 0;
	}

#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "setToPosition: " + String(_toPosition) + "->" + String(toPosition));
#endif
#endif
	//запоминаем новую toPostion
	//в этой реализации драйвера, если в момент движение произойдет сбой, после восстановления - движение продолжится
	filesWriteInt(id + ".toposition", toPosition);
	onInsideChange("toposition", String(toPosition));
	//вычисляем количество шагов необходимое для достижения position (может иметь отрицательное значение при обратном движении)
	int count = toPosition - position;
	//начинаем движение "вперед" если count положительный (последовательно переключаем обмотки двигателя)
	while (count > 0)
	{
		if (stop == 1)
			break;							  //если никто не вызвал stop продолжаем движение
		for (int i = 0; i < STEPS_COUNT; i++) //выполняем один цикл переключения обмоток
		{
			doOutput(i); //ВАЖНО: посмотрите на содержимое массива stepMask и прочитайте в WiKi о методах включения обмоток (этот драйвер рассчитан на 4-х обмоточные двигатели, и использует half-step метод переключения обмоток)
				//doOutput() делает одну(очередную "i") выборку из массива stepMask
			delayMicroseconds(speed); //задержка между переключениями обмоток - очень важно! Если задержка слишком коротка, обмотки не успеют притянуть якорь, если слишком велика - двигатель перегреется
									  //подбирается для каждого двигателя индивидуально.
		}
		count--;						//считаем что сделали один шаг после цикла переключения обмоток
		setPosition(++position, false); //сохраняем новую "физическую" позицию

		if (position % 5 == 0) //если шагов много, через определенный интервал - даем возможность отработать сети (возможно срабатывание WDT https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%BE%D1%80%D0%BE%D0%B6%D0%B5%D0%B2%D0%BE%D0%B9_%D1%82%D0%B0%D0%B9%D0%BC%D0%B5%D1%80)
		{
#ifdef USE_ESP_DRIVER
			transportLoop();
#endif
		}
		if (position % STEPPER_LOOP_INTERVAL == 0) //так же, через определенный интервал отправляем "наверх" информацию о текущем физическом положении двигателя
		{
			setPosition(position, true);
		}
	}
	//движение "назад", так же как вперед, но с обратным перебором включения обмоток двигателя
	while (count < 0)
	{
		if (stop == 1)
			break;
		for (int i = STEPS_COUNT - 1; i >= 0; i--) //обратный перебор обмоток
		{
			doOutput(i);
			delayMicroseconds(speed);
		}
		count++;

		setPosition(--position, false);
		if (position % 5 == 0)
		{
#ifdef USE_ESP_DRIVER
			transportLoop();
#endif
		}
		if (position % STEPPER_LOOP_INTERVAL == 0)
		{
			setPosition(position, true);
		}
	}
	//сохраняем точную позицию, и сообщаем о ней "наверх" (потому как "if (position % 5 == 0)" сообщала позиции кратные интервалу и в конечном итоге нарастет погрешность
	setPosition(position, true);
	//выключаем все обмотки
	setStop(1);
	//говорим что двигатель свободен для следующей команды
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "busy=" + String(busy));
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "stop=" + String(stop));
#endif
#endif
	return stop;
}

bool StepperDriver::setStop(int _stop)
{
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "position=" + String(position));
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "range=" + String(range));
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "speed=" + String(speed));
#endif
#endif
	return speed;
}

bool StepperDriver::setSpeed(int _speed)
{
	speed = _speed;
	filesWriteInt(id + ".speed", speed);
	return onInsideChange("speed", String(speed));
}

//DO Stop ----------------------------------------------------------------------------------------
//ВНИМАНИЕ:
//выключаем все обмотки электродвигателя - если вы не будете вызывать этот метод - после остановки
//физический драйвер "не поймет" что обмотками никто не управляет, последние включенные обмотки останутся
//включены, двигатель начнет греться.
void StepperDriver::doStop()
{
	driverPinWrite(id, PIN0_INDEX, B00000);
	driverPinWrite(id, PIN1_INDEX, B00000);
	driverPinWrite(id, PIN2_INDEX, B00000);
	driverPinWrite(id, PIN3_INDEX, B00000);
}

//Do Move ------------------------------------------------------------------------------------------
//выполняет одну выборку из массива масок управления обмотками и включает обмотки в определенной последовательности
//один вызов этого метода не приведет к движению - необходимо последовательно вызывать этот метод с определенным интервалом
//speed и последовательной сменой параметра out
void StepperDriver::doOutput(int out)
{
	driverPinWrite(id, PIN0_INDEX, bitRead(stepMask[out], 0));
	driverPinWrite(id, PIN1_INDEX, bitRead(stepMask[out], 1));
	driverPinWrite(id, PIN2_INDEX, bitRead(stepMask[out], 2));
	driverPinWrite(id, PIN3_INDEX, bitRead(stepMask[out], 3));
};
#endif
