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
#ifdef USE_BMP280_DRIVER

#ifndef BMP280DRIVER_H
#define BMP280DRIVER_H

#include "../libraries/Adafruit_BMP280/Adafruit_BMP280.h" 
#define SDA_INDEX 0
#define SCL_INDEX 1
#define I2CADDR_INDEX 2
#define I2C_VCC5_INDEX 3
#define I2C_GND_INDEX 4

class BMP280Driver : public BaseDriver
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
    String getPressure();
	String getAltitude();
	String getTemperature();

	String getPressureHistoryData();
	bool setPressureHistoryData(float _historydata);

	String getAltitudeHistoryData();
	bool setAltitudeHistoryData(float _historydata);

	String getTemperatureHistoryData();
	bool setTemperatureHistoryData(float _historydata);

private:
	Adafruit_BMP280 *bmp280 = nullptr;
	String pressure = "nan";
	String altitude = "nan";
	String temperature = "nan";

	int pressureHistoryCount = 0;
	float *pressureHistoryData = new float[historySize]();

	int altitudeHistoryCount = 0;
	float *altitudeHistoryData = new float[historySize]();

	int temperatureHistoryCount = 0;
	float *temperatureHistoryData = new float[historySize]();

};
#endif
#endif