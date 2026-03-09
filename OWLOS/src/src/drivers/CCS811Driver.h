/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2021 by:
- Boris Pavlov (hiroyashy@gmail.com)
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
#ifdef USE_CCS811_DRIVER

#ifndef CCS811DRIVER_H
#define CCS811DRIVER_H

#include "../libraries/SparkFunCCS811/SparkFunCCS811.h" 
#define SDA_INDEX 0
#define SCL_INDEX 1
#define I2CADDR_INDEX 2
#define I2C_VCC5_INDEX 3
#define I2C_GND_INDEX 4

class CCS811Driver : public BaseDriver
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

	bool readData();

    String getCO2();
	String getCO2HistoryData();
	bool setCO2HistoryData(float _historydata);

    String getTVOC();
	String getTVOCHistoryData();
	bool setTVOCHistoryData(float _historydata);

    String getResistence();
	String getResistenceHistoryData();
	bool setResistenceHistoryData(float _historydata);

    String getTemperature();
	String getTemperatureHistoryData();
	bool setTemperatureHistoryData(float _historydata);

	String CO2 = "nan";
	String TVOC = "nan";
	String resistence = "nan";
	String temperature = "nan";

private:
	CCS811 *ccs811 = nullptr;

	int CO2HistoryCount = 0;
	float *CO2HistoryData = new float[historySize]();

	int TVOCHistoryCount = 0;
	float *TVOCHistoryData = new float[historySize]();

	int resistenceHistoryCount = 0;
	float *resistenceHistoryData = new float[historySize]();

	int temperatureHistoryCount = 0;
	float *temperatureHistoryData = new float[historySize]();
};
#endif
#endif