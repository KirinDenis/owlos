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
#include "BMP280Driver.h"
#ifdef USE_BMP280_DRIVER

#define DRIVER_ID "bmp280"
#define BMP280_LOOP_INTERVAL 200

//BMP280_ADDRESS 0x77 The default I2C address for the sensor. 
//BMP280_ADDRESS_ALT 0x76 Alternative I2C address for the sensor. 
//BMP280_CHIPID (0x58)


bool BMP280Driver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);
	//считываем количество колонок и строк дисплея из файла или из константы (по умолчанию 20x4)
	available = false;
	//получаем I2C Slave адрес для обращения к текущему BMP280 на I2C шине
	DriverPin *pinDriverInfo = getDriverPinByDriverId(id, I2CADDR_INDEX);
	if (pinDriverInfo != nullptr)
	{
//если пользователь задал адрес, инкапсулируем класс обслуживающий BMP280 и пробуем работать с через указанный порт
#ifdef DEBUG
		debugOut("BMP280", String(pinDriverInfo->driverI2CAddr));
#endif
		bmp280 = new Adafruit_BMP280();
		if (bmp280->begin(pinDriverInfo->driverI2CAddr, BMP280_CHIPID))
		{
			/* Default settings from datasheet. */
			bmp280->setSampling(Adafruit_BMP280::MODE_NORMAL,	  /* Operating Mode. */
								Adafruit_BMP280::SAMPLING_X2,	  /* Temp. oversampling */
								Adafruit_BMP280::SAMPLING_X16,	  /* Pressure oversampling */
								Adafruit_BMP280::FILTER_X16,	  /* Filtering. */
								Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
			available = true;
		}
#ifdef DEBUG
	else 
	{
		debugOut("BMP280", "Begin problem");
	}
#endif

	}
#ifdef DEBUG
	else 
	{
		debugOut("BMP280", "Pins problem");
	}
#endif
	
	return available;
}

//когда сеть доступна
bool BMP280Driver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(BMP280_DRIVER_TYPE);
	setAvailable(available);
	return available;
}
//возвращает свойства драйвера BMP280
String BMP280Driver::getAllProperties()
{
	return BaseDriver::getAllProperties() +
	"pressure=" + getPressure() + "//sr\n" +
	"altitude=" + getAltitude() + "//sr\n" +
	"temperature=" + getTemperature() + "//sr\n";
}
//управление свойствами BMP280 драйвера
String BMP280Driver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);

	//обычно драйвер не управляет свойствами пинов, но в данном драйвере адрес I2C порта использован в роли Pin - для совместимости
	//с архитектурой, по этой причине необходим отдельный обработчик I2CADDR пина
	if (matchRoute(route, topic, "/setpin"))
	{
		//base is put the new address to to PinService
		result = init(); //init() get Address from PinManger
	}

	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;

	if (matchRoute(route, topic, "/getpressure"))
	{
		result = onGetProperty("pressure", String(getPressure()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getaltitude"))
	{
		result = onGetProperty("altitude", String(getAltitude()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/gettemperature"))
	{
		result = onGetProperty("temperature", String(getTemperature()), transportMask);
	}

	return result;
}

//Pressure ------------------------------------------------
String BMP280Driver::getPressure()
{
	//если нет обслуживающего класса
	if (bmp280 == nullptr)
	{
		setAvailable(false);
		pressure = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "BMP280 object not ready");
#endif
#endif
		return pressure;
	}
	//пробуем получить значение от сенсора	
	float _pressure = bmp280->readPressure();
	if (_pressure != _pressure) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		pressure = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "BMP280 going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{
		pressure = String(_pressure);
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "BMP280 pressure=" + pressure);
#endif
#endif
	return pressure;
}

//Altitude ------------------------------------------------
String BMP280Driver::getAltitude()
{
	//если нет обслуживающего класса
	if (bmp280 == nullptr)
	{
		setAvailable(false);
		altitude = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "BMP280 object not ready");
#endif
#endif
		return altitude;
	}
	//пробуем получить значение от сенсора	
	float _altitude = bmp280->readAltitude();
	if (_altitude != _altitude) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		altitude = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "BMP280 going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{
		altitude = String(_altitude);
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "BMP280 altitude=" + altitude);
#endif
#endif
	return altitude;
}

//Temperature ------------------------------------------------
String BMP280Driver::getTemperature()
{
	//если нет обслуживающего класса
	if (bmp280 == nullptr)
	{
		setAvailable(false);
		temperature = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "BMP280 object not ready");
#endif
#endif
		return temperature;
	}
	//пробуем получить значение от сенсора	
	float _temperature = bmp280->readTemperature();
	if (_temperature != _temperature) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		temperature = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "BMP280 going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{
		temperature = String(_temperature);
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "BMP280 temperature=" + temperature);
#endif
#endif
	return temperature;
}


#endif
