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
#include "CCS811Driver.h"
#ifdef USE_CCS811_DRIVER

#define DRIVER_ID "ccs811"
#define CCS811_LOOP_INTERVAL 2000

//CCS811_ADDR 0x5A Default I2C Address

bool CCS811Driver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);
	//считываем количество колонок и строк дисплея из файла или из константы (по умолчанию 20x4)
	available = false;
	//получаем I2C Slave адрес для обращения к текущему CCS811 на I2C шине
	DriverPin *pinDriverInfo = getDriverPinByDriverId(id, I2CADDR_INDEX);
	if (pinDriverInfo != nullptr)
	{
		//если пользователь задал адрес, инкапсулируем класс обслуживающий CCS811 и пробуем работать с через указанный порт
		ccs811 = new CCS811(pinDriverInfo->driverI2CAddr);
		if (ccs811->begin())
		{
#if defined(DEBUG) || defined(LOGO_SCREEN_UX)
			debugOut("CCS811", "OK", DEBUG_SUCCESS);
#endif
			available = true;
		}
#if defined(DEBUG) || defined(LOGO_SCREEN_UX)
		else
		{
			debugOut("CCS811", "Begin problem", DEBUG_DANGER);
		}
#endif
	}
#if defined(DEBUG) || defined(LOGO_SCREEN_UX)
	else
	{
		debugOut("CCS811", "Pins problem", DEBUG_WARNING);
	}
#endif

	return available;
}

//когда сеть доступна
bool CCS811Driver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(CCS811_DRIVER_TYPE);
	setAvailable(available);
	return available;
}

bool CCS811Driver::query()
{
	if (BaseDriver::query())
	{
		//Fill array of history data ---------------------------
		if (millis() >= lastHistoryMillis + historyInterval)
		{
			lastHistoryMillis = millis();
			if (readData())
			{
				setCO2HistoryData(atof(CO2.c_str()));
				setTVOCHistoryData(atof(TVOC.c_str()));
				setResistenceHistoryData(atof(resistence.c_str()));
				setTemperatureHistoryData(atof(temperature.c_str()));
			}
			else
			{
				setCO2HistoryData(NAN);
				setTVOCHistoryData(NAN);
				setResistenceHistoryData(NAN);
				setTemperatureHistoryData(NAN);
			}
		}
		return true;
	}
	return false;
}

//возвращает свойства драйвера CCS811
String CCS811Driver::getAllProperties()
{
	readData();
	return BaseDriver::getAllProperties() +
		   "co2=" + CO2 + "//sr\n"
						  "co2historydata=" +
		   getCO2HistoryData() + "//r\n"
								 "tvoc=" +
		   TVOC + "//sr\n"
				  "tvochistorydata=" +
		   getTVOCHistoryData() + "//r\n"
								  "resistence=" +
		   resistence + "//sr\n"
						"resistencehistorydata=" +
		   getResistenceHistoryData() + "//r\n"
										"temperature=" +
		   temperature + "//sr\n"
						 "temperaturehistorydata=" +
		   getTemperatureHistoryData() + "//r\n";
}
//управление свойствами CCS811 драйвера
String CCS811Driver::onMessage(String route, String _payload, int8_t transportMask)
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

	readData();
	if (matchRoute(route, topic, "/getco2"))
	{
		result = onGetProperty("co2", CO2, transportMask);
	}
	else if (matchRoute(route, topic, "/getco2historydata"))
	{
		return onGetProperty("co2historydata", String(getCO2HistoryData()), transportMask);
	}
	else if (matchRoute(route, topic, "/gettvoc"))
	{
		result = onGetProperty("tvoc", TVOC, transportMask);
	}
	else if (matchRoute(route, topic, "/gettvochistorydata"))
	{
		return onGetProperty("tvochistorydata", String(getTVOCHistoryData()), transportMask);
	}
	else if (matchRoute(route, topic, "/getresistence"))
	{
		result = onGetProperty("resistence", resistence, transportMask);
	}
	else if (matchRoute(route, topic, "/getresistencehistorydata"))
	{
		return onGetProperty("resistencehistorydata", String(getResistenceHistoryData()), transportMask);
	}
	else if (matchRoute(route, topic, "/gettemperature"))
	{
		result = onGetProperty("temperature", temperature, transportMask);
	}
	else if (matchRoute(route, topic, "/gettemperaturehistorydata"))
	{
		return onGetProperty("temperaturehistorydata", String(getTemperatureHistoryData()), transportMask);
	}

	return result;
}

//Read data ----------------------------------------------
bool CCS811Driver::readData()
{

	CO2 = "nan";
	TVOC = "nan";
	resistence = "nan";
	temperature = "nan";

	if (ccs811 == nullptr) //compile boolean expression must be enabled
	{
		setAvailable(false);
#ifdef DETAILED_DEBUG
#if defined(DEBUG) || defined(LOGO_SCREEN_UX)
		debugOut(id, "CCS811 object not ready");
#endif
#endif
		return false;
	}

	if (ccs811->dataAvailable())
	{
		//пробуем получить значение от сенсора
		ccs811->readAlgorithmResults();

		CO2 = String(ccs811->getCO2());
		TVOC = String(ccs811->getTVOC());

		ccs811->readNTC();

		resistence = String(ccs811->getResistance());
		temperature = String(ccs811->getTemperature());
		return true;
	}

	return false;
}

//CO2 ------------------------------------------------
String CCS811Driver::getCO2()
{
	return CO2;
}
//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String CCS811Driver::getCO2HistoryData()
{
	String dataHistory = String(CO2HistoryCount) + ";";

	for (int k = 0; k < CO2HistoryCount; k++)
	{
		dataHistory += String(CO2HistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения давления в историю
bool CCS811Driver::setCO2HistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (CO2HistoryCount < historySize)
	{
		CO2HistoryData[CO2HistoryCount] = _historydata;
		CO2HistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			CO2HistoryData[k - 1] = CO2HistoryData[k];
		}

		CO2HistoryData[historySize - 1] = _historydata;
	}
	return true;
}

//TVOC ------------------------------------------------
String CCS811Driver::getTVOC()
{
	return TVOC;
}
//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String CCS811Driver::getTVOCHistoryData()
{
	String dataHistory = String(TVOCHistoryCount) + ";";

	for (int k = 0; k < TVOCHistoryCount; k++)
	{
		dataHistory += String(TVOCHistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения давления в историю
bool CCS811Driver::setTVOCHistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (TVOCHistoryCount < historySize)
	{
		TVOCHistoryData[TVOCHistoryCount] = _historydata;
		TVOCHistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			TVOCHistoryData[k - 1] = TVOCHistoryData[k];
		}

		TVOCHistoryData[historySize - 1] = _historydata;
	}
	return true;
}

//Resistence ------------------------------------------------
String CCS811Driver::getResistence()
{
	return resistence;
}
//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String CCS811Driver::getResistenceHistoryData()
{
	String dataHistory = String(resistenceHistoryCount) + ";";

	for (int k = 0; k < resistenceHistoryCount; k++)
	{
		dataHistory += String(resistenceHistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения давления в историю
bool CCS811Driver::setResistenceHistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (resistenceHistoryCount < historySize)
	{
		resistenceHistoryData[resistenceHistoryCount] = _historydata;
		resistenceHistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			resistenceHistoryData[k - 1] = resistenceHistoryData[k];
		}

		resistenceHistoryData[historySize - 1] = _historydata;
	}
	return true;
}

//Temperature ------------------------------------------------
String CCS811Driver::getTemperature()
{
	return temperature;
}
//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String CCS811Driver::getTemperatureHistoryData()
{
	String dataHistory = String(temperatureHistoryCount) + ";";

	for (int k = 0; k < temperatureHistoryCount; k++)
	{
		dataHistory += String(temperatureHistoryData[k]) + ";";
	}

	return dataHistory;
}

//добавление очередного значения давления в историю
bool CCS811Driver::setTemperatureHistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (temperatureHistoryCount < historySize)
	{
		temperatureHistoryData[temperatureHistoryCount] = _historydata;
		temperatureHistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			temperatureHistoryData[k - 1] = temperatureHistoryData[k];
		}

		temperatureHistoryData[historySize - 1] = _historydata;
	}
	return true;
}

#endif
