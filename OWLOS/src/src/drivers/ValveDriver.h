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
#ifdef USE_VALVE_DRIVER
#ifndef VALVEDRIVER_H
#define VALVEDRIVER_H

#define CLOSE_PIN_INDEX 0
#define OPEN_PIN_INDEX 1
#define POSITION_PIN_INDEX 2
#define _VCC5_INDEX 3
#define _GND_INDEX 4

#define MOTOR_STOP_COMMAND HIGH
#define MOTOR_START_COMMAND LOW

class ValveDriver : public BaseDriver
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
		case CLOSE_PIN_INDEX:
			return DIGITAL_O_MASK;
		case OPEN_PIN_INDEX:
			return DIGITAL_O_MASK;
		case POSITION_PIN_INDEX:
			return ANALOG_I_MASK;
		case _VCC5_INDEX:
			return VCC5_MASK || VCC33_MASK;
		case _GND_INDEX:
			return GND_MASK;
		default:
			return NO_MASK;
		}
	}

	bool init();
	bool begin(String _topic);
	bool query();
	String getAllProperties();
	bool publish();
	String onMessage(String route, String _payload, int8_t transportMask);

	int getPosition();
	bool setPosition(int _position);
	int getMinimumphysicalposition();
	int getMaximumphysicalposition();
	int getphysicalposition();

private:
	void toMinMaxPosition(int _pin);
	int position = 0;					// 0 - close, 100 - open
	int minimumphysicalposition = 0;	// valve is close
	int maximumphysicalposition = 1023; // valve is open
	int physicalposition = 0;			// valve first is close
	int newphysicalposition = 0;
};
#endif
#endif