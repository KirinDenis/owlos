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

#include "BaseDriver.h"
#ifdef USE_STEPPER_DRIVER
#ifndef STEPPERDRIVER_H
#define STEPPERDRIVER_H

#define VCC5_INDEX 4
#define GND_INDEX 5

#define STEPPER_LOOP_INTERVAL 200

#define STEPS_COUNT 8 //количество комбинаций включение 4-x обмоток
#define DEFAULT_TO_POSITION 5000
#define DEFAULT_BUSY 0
#define DEFAULT_STOP 1
#define DEFAULT_POSITION 5000
#define DEFAULT_RANGE 10000
#define DEFAULT_SPEED 2000
#define DEFAULT_COUNTS_PER_REVOLUTION 512

class StepperDriver : public BaseDriver
{
public:
	static int getPinsCount()
	{
		return 5;
	}

	static uint16_t getPinType(int pinIndex)
	{
		switch (pinIndex)
		{
		case PIN0_INDEX:
			return DIGITAL_O_MASK;
		case PIN1_INDEX:
			return DIGITAL_O_MASK;
		case PIN2_INDEX:
			return DIGITAL_O_MASK;
		case PIN3_INDEX:
			return DIGITAL_O_MASK;
		case VCC5_INDEX:
			return VCC5_MASK;
		case GND_INDEX:
			return GND_MASK;
		default:
			return NO_MASK;
		}
	}

	bool init();
	void del();
	bool begin(String _topic);
	String getAllProperties();
	String onMessage(String route, String _payload, int8_t transportMask);

	int getToPosition();
	bool setToPosition(int _toPosition);
	int getBusy();
	bool setBusy(int _busy);
	int getStop();
	bool setStop(int _stop);
	int getPosition();
	bool setPosition(int _toPosition, bool doEvent);
	int getRange();
	bool setRange(int _range);
	int getSpeed();
	bool setSpeed(int _speed);

private:
	//HALF-STEP drive bit masks
	int stepMask[STEPS_COUNT] = {0b1000, 0b1100, 0b0100, 0b0110, 0b0010, 0b0011, 0b0001, 0b1001}; //0bABCD если 1 обмотка включена
	int toPosition = DEFAULT_TO_POSITION;														  //заданная позиция к которой мотор отсчитывает "шаги" относительно текущей позиции position
	int busy = DEFAULT_BUSY;																	  //флажок, если драйвер занят перебором шагов (1)
	int stop = DEFAULT_STOP;																	  //если мотор остановлен (1)
	int position = DEFAULT_POSITION;															  //текущая позиция (оценочная - шаговые моторы склоны к проскальзыванию при перегрузке вала, требует калибровки)
	int range = DEFAULT_RANGE;																	  //количество шагов от 0..range в пределе которых мотор может "шагать"
	int speed = DEFAULT_SPEED;																	  //скорость переключения обмоток - индивидуальная для каждого мотора - слишком маленькое значение - обмотки не успеют притянуть якорь, слишком большое обмотки начнут сильно греться а скорость вращения будет медленной

	void doStop();
	void doOutput(int out);
};
#endif
#endif