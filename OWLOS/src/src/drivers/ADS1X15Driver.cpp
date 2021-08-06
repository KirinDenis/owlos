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
#include "ADS1X15Driver.h"
#ifdef USE_ADS1X15_DRIVER

#define DRIVER_ID "ads1x15280"
#define ADS1X15_LOOP_INTERVAL 2000

//ADS1X15_ADDRESS (0x48) ///< 1001 000 (ADDR = GND)

bool ADS1X15Driver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);
	//считываем количество колонок и строк дисплея из файла или из константы (по умолчанию 20x4)
	available = false;
	//получаем I2C Slave адрес для обращения к текущему ADS1X15 на I2C шине
	DriverPin *pinDriverInfo = getDriverPinByDriverId(id, I2CADDR_INDEX);
	if (pinDriverInfo != nullptr)
	{
//если пользователь задал адрес, инкапсулируем класс обслуживающий ADS1X15 и пробуем работать с через указанный порт
#ifdef DEBUG
		debugOut("ADS1X15", String(pinDriverInfo->driverI2CAddr));
		debugOut("ADS1X15","Getting single-ended readings from AIN0..3");
  		debugOut("ADS1X15","ADC Range: +/- 6.144V (1 bit = 3mV/ADS1015, 0.1875mV/ADS1115)");
  // The ADC input range (or gain) can be changed via the following
  // functions, but be careful never to exceed VDD +0.3V max, or to
  // exceed the upper and lower limits if you adjust the input range!
  // Setting these values incorrectly may destroy your ADC!  
  //                                                                -------  -------
  // ads.setGain(GAIN_TWOTHIRDS);  // 2/3x gain +/- 6.144V  1 bit = 3mV      0.1875mV (default)
  // ads.setGain(GAIN_ONE);        // 1x gain   +/- 4.096V  1 bit = 2mV      0.125mV
  // ads.setGain(GAIN_TWO);        // 2x gain   +/- 2.048V  1 bit = 1mV      0.0625mV
  // ads.setGain(GAIN_FOUR);       // 4x gain   +/- 1.024V  1 bit = 0.5mV    0.03125mV
  // ads.setGain(GAIN_EIGHT);      // 8x gain   +/- 0.512V  1 bit = 0.25mV   0.015625mV
  // ads.setGain(GAIN_SIXTEEN);    // 16x gain  +/- 0.256V  1 bit = 0.125mV  0.0078125mV

#endif
		ads1x15 = new Adafruit_ADS1X15();
		if (ads1x15->begin(pinDriverInfo->driverI2CAddr))
		{
			available = true;
		}
#ifdef DEBUG
	else 
	{
		debugOut("ADS1X15", "Begin problem");
	}
#endif

	}
#ifdef DEBUG
	else 
	{
		debugOut("ADS1X15", "Pins problem");
	}
#endif	
	return available;
}

//когда сеть доступна
bool ADS1X15Driver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(ADS1X15_DRIVER_TYPE);
	setAvailable(available);
	return available;
}

bool ADS1X15Driver::query()
{
	if (BaseDriver::query())
	{
		//Fill array of history data ---------------------------
		if (millis() >= lastHistoryMillis + historyInterval)
		{
			lastHistoryMillis = millis();
			setChanel_0_HistoryData(atof(getChanel_0().c_str()));
			setChanel_1_HistoryData(atof(getChanel_1().c_str()));			
			setChanel_2_HistoryData(atof(getChanel_2().c_str()));			
			setChanel_3_HistoryData(atof(getChanel_3().c_str()));
		}
		return true;
	}
	return false;
}

//возвращает свойства драйвера ADS1X15
String ADS1X15Driver::getAllProperties()
{
	return BaseDriver::getAllProperties() +
	"chanel_0=" + getChanel_0() + "//sr\n" 
	"chanel_0_volts=" + getChanel_0_Volts() + "//r\n" 
	"chanel_0_historydata=" + getChanel_0_HistoryData() + "//r\n"

	"chanel_1=" + getChanel_1() + "//sr\n" 
	"chanel_1_volts=" + getChanel_1_Volts() + "//r\n" 
	"chanel_1_historydata=" + getChanel_1_HistoryData() + "//r\n"

	"chanel_2=" + getChanel_2() + "//sr\n" 
	"chanel_2_volts=" + getChanel_2_Volts() + "//r\n" 
	"chanel_2_historydata=" + getChanel_2_HistoryData() + "//r\n"

	"chanel_3=" + getChanel_3() + "//sr\n" 
	"chanel_3_volts=" + getChanel_3_Volts() + "//r\n" 
	"chanel_3_historydata=" + getChanel_3_HistoryData() + "//r\n"
	;
}
//управление свойствами ADS1X15 драйвера
String ADS1X15Driver::onMessage(String route, String _payload, int8_t transportMask)
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

	if (matchRoute(route, topic, "/getchanel_0"))
	{
		result = onGetProperty("chanel_0", String(getChanel_0()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_0_volts"))
	{
		getChanel_0();
		result = onGetProperty("chanel_0_volts", String(getChanel_0_Volts()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_0_historydata"))
	{		
		result = onGetProperty("chanel_0_historydata", String(getChanel_0_HistoryData()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_1"))
	{
		result = onGetProperty("chanel_1", String(getChanel_1()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_1_volts"))
	{
		getChanel_1();
		result = onGetProperty("chanel_1_volts", String(getChanel_1_Volts()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_1_historydata"))
	{		
		result = onGetProperty("chanel_1_historydata", String(getChanel_1_HistoryData()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_2"))
	{
		result = onGetProperty("chanel_2", String(getChanel_2()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_2_volts"))
	{
		getChanel_2();
		result = onGetProperty("chanel_2_volts", String(getChanel_2_Volts()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_2_historydata"))
	{		
		result = onGetProperty("chanel_2_historydata", String(getChanel_2_HistoryData()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_3"))
	{
		result = onGetProperty("chanel_3", String(getChanel_3()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_3_volts"))
	{
		getChanel_3();
		result = onGetProperty("chanel_3_volts", String(getChanel_3_Volts()), transportMask);
	}
	else 
	if (matchRoute(route, topic, "/getchanel_3_historydata"))
	{		
		result = onGetProperty("chanel_3_historydata", String(getChanel_3_HistoryData()), transportMask);
	}

	return result;
}

//Chanel_0 ------------------------------------------------
String ADS1X15Driver::getChanel_0()
{
	//если нет обслуживающего класса
	if (ads1x15 == nullptr)
	{
		setAvailable(false);
		chanel_0 = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 object not ready");
#endif
#endif
		return chanel_0;
	}
	//пробуем получить значение от сенсора	

	int16_t _chanel_0 = ads1x15->readADC_SingleEnded(0);
	
	if (_chanel_0 != _chanel_0) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		chanel_0 = "nan";
		chanel_0_volts = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{		
		chanel_0 = String(_chanel_0);
		chanel_0_volts = String(ads1x15->computeVolts(_chanel_0));
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "ADS1X15 pressure=" + pressure);
#endif
#endif
	return chanel_0;
}

String ADS1X15Driver::getChanel_0_Volts()
{
	return chanel_0_volts;
}

//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String ADS1X15Driver::getChanel_0_HistoryData()
{
	String dataHistory = String(chanel_0_HistoryCount) + ";";

	for (int k = 0; k < chanel_0_HistoryCount; k++)
	{
		dataHistory += String(chanel_0_HistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения давления в историю
bool ADS1X15Driver::setChanel_0_HistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (chanel_0_HistoryCount < historySize)
	{
		chanel_0_HistoryData[chanel_0_HistoryCount] = _historydata;
		chanel_0_HistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			chanel_0_HistoryData[k - 1] = chanel_0_HistoryData[k];
		}

		chanel_0_HistoryData[historySize - 1] = _historydata;
	}
	return true;
}

//Chanel_1 ------------------------------------------------
String ADS1X15Driver::getChanel_1()
{
	//если нет обслуживающего класса
	if (ads1x15 == nullptr)
	{
		setAvailable(false);
		chanel_1 = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 object not ready");
#endif
#endif
		return chanel_1;
	}
	//пробуем получить значение от сенсора	

	int16_t _chanel_1 = ads1x15->readADC_SingleEnded(1);
	
	if (_chanel_1 != _chanel_1) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		chanel_1 = "nan";
		chanel_1_volts = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{		
		chanel_1 = String(_chanel_1);
		chanel_1_volts = String(ads1x15->computeVolts(_chanel_1));
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "ADS1X15 pressure=" + pressure);
#endif
#endif
	return chanel_1;
}

String ADS1X15Driver::getChanel_1_Volts()
{
	return chanel_1_volts;
}

//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String ADS1X15Driver::getChanel_1_HistoryData()
{
	String dataHistory = String(chanel_1_HistoryCount) + ";";

	for (int k = 0; k < chanel_1_HistoryCount; k++)
	{
		dataHistory += String(chanel_1_HistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения давления в историю
bool ADS1X15Driver::setChanel_1_HistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (chanel_1_HistoryCount < historySize)
	{
		chanel_1_HistoryData[chanel_1_HistoryCount] = _historydata;
		chanel_1_HistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			chanel_1_HistoryData[k - 1] = chanel_1_HistoryData[k];
		}

		chanel_1_HistoryData[historySize - 1] = _historydata;
	}
	return true;
}

//Chanel_2 ------------------------------------------------
String ADS1X15Driver::getChanel_2()
{
	//если нет обслуживающего класса
	if (ads1x15 == nullptr)
	{
		setAvailable(false);
		chanel_2 = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 object not ready");
#endif
#endif
		return chanel_2;
	}
	//пробуем получить значение от сенсора	

	int16_t _chanel_2 = ads1x15->readADC_SingleEnded(2);
	
	if (_chanel_2 != _chanel_2) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		chanel_2 = "nan";
		chanel_2_volts = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{		
		chanel_2 = String(_chanel_2);
		chanel_2_volts = String(ads1x15->computeVolts(_chanel_2));
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "ADS1X15 pressure=" + pressure);
#endif
#endif
	return chanel_2;
}

String ADS1X15Driver::getChanel_2_Volts()
{
	return chanel_2_volts;
}

//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String ADS1X15Driver::getChanel_2_HistoryData()
{
	String dataHistory = String(chanel_2_HistoryCount) + ";";

	for (int k = 0; k < chanel_2_HistoryCount; k++)
	{
		dataHistory += String(chanel_2_HistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения давления в историю
bool ADS1X15Driver::setChanel_2_HistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (chanel_2_HistoryCount < historySize)
	{
		chanel_2_HistoryData[chanel_2_HistoryCount] = _historydata;
		chanel_2_HistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			chanel_2_HistoryData[k - 1] = chanel_2_HistoryData[k];
		}

		chanel_2_HistoryData[historySize - 1] = _historydata;
	}
	return true;
}

//Chanel_3 ------------------------------------------------
String ADS1X15Driver::getChanel_3()
{
	//если нет обслуживающего класса
	if (ads1x15 == nullptr)
	{
		setAvailable(false);
		chanel_3 = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 object not ready");
#endif
#endif
		return chanel_3;
	}
	//пробуем получить значение от сенсора	

	int16_t _chanel_3 = ads1x15->readADC_SingleEnded(3);
	
	if (_chanel_3 != _chanel_3) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		chanel_3 = "nan";
		chanel_3_volts = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "ADS1X15 going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{		
		chanel_3 = String(_chanel_3);
		chanel_3_volts = String(ads1x15->computeVolts(_chanel_3));
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "ADS1X15 pressure=" + pressure);
#endif
#endif
	return chanel_3;
}

String ADS1X15Driver::getChanel_3_Volts()
{
	return chanel_3_volts;
}

//History data ------------------------------------------------
//получение накопленных данных о показаниях сенсора давления
String ADS1X15Driver::getChanel_3_HistoryData()
{
	String dataHistory = String(chanel_3_HistoryCount) + ";";

	for (int k = 0; k < chanel_3_HistoryCount; k++)
	{
		dataHistory += String(chanel_3_HistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения давления в историю
bool ADS1X15Driver::setChanel_3_HistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;

	if (chanel_3_HistoryCount < historySize)
	{
		chanel_3_HistoryData[chanel_3_HistoryCount] = _historydata;
		chanel_3_HistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			chanel_3_HistoryData[k - 1] = chanel_3_HistoryData[k];
		}

		chanel_3_HistoryData[historySize - 1] = _historydata;
	}
	return true;
}



#endif
