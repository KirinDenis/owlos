/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2021 by:
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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
#ifdef USE_ADS1X15_DRIVER

#ifndef ADS1X15DRIVER_H
#define ADS1X15DRIVER_H

#include "../libraries/Adafruit_ADS1015/Adafruit_ADS1X15.h"

#define SDA_INDEX 0
#define SCL_INDEX 1
#define I2CADDR_INDEX 2
#define I2C_VCC5_INDEX 3
#define I2C_GND_INDEX 4

class ADS1X15Driver : public BaseDriver
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
		case SDA_INDEX:
			return SDA_MASK;
		case SCL_INDEX:
			return SCL_MASK;
		case I2CADDR_INDEX:
			return I2CADDR_MASK;
		case I2C_VCC5_INDEX:
			return VCC5_MASK | VCC33_MASK;
		case I2C_GND_INDEX:
			return GND_MASK;
		default:
			return NO_MASK;
		}
	}

	bool init();

	bool begin(String _topic);
	bool query();
	String getAllProperties();
	String onMessage(String route, String _payload, int8_t transportMask);

	String getChanel_0();
	String getChanel_0_Volts();
	String getChanel_0_HistoryData();
	bool setChanel_0_HistoryData(float _historydata);

	String getChanel_1();
	String getChanel_1_Volts();
	String getChanel_1_HistoryData();
	bool setChanel_1_HistoryData(float _historydata);

	String getChanel_2();
	String getChanel_2_Volts();
	String getChanel_2_HistoryData();
	bool setChanel_2_HistoryData(float _historydata);

	String getChanel_3();
	String getChanel_3_Volts();
	String getChanel_3_HistoryData();
	bool setChanel_3_HistoryData(float _historydata);

private:
	Adafruit_ADS1X15 *ads1x15 = nullptr;

	String chanel_0 = "nan";
	String chanel_0_volts = "nan";
	String chanel_1 = "nan";
	String chanel_1_volts = "nan";
	String chanel_2 = "nan";
	String chanel_2_volts = "nan";
	String chanel_3 = "nan";
	String chanel_3_volts = "nan";

	int chanel_0_HistoryCount = 0;
	float *chanel_0_HistoryData = new float[historySize]();

	int chanel_1_HistoryCount = 0;
	float *chanel_1_HistoryData = new float[historySize]();

	int chanel_2_HistoryCount = 0;
	float *chanel_2_HistoryData = new float[historySize]();

	int chanel_3_HistoryCount = 0;
	float *chanel_3_HistoryData = new float[historySize]();
};
#endif
#endif