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
#include "DHTDriver.h"
#ifdef USE_DHT_DRIVER

/*-------------------------------------------------------------------------------------------------------------------------
  Setup DHT sensor
  Based on \OWLOS\src\libraries\DHT_sensor_library\DHT.cpp -> by Adafruit Industries
  -------------------------------------------------------------------------------------------------------------------------*/
//параметр dhttype - тип DHT сенсора от Adafruit
// DHT11 11
// DHT12 12
// DHT22 22
// DHT21 21
// AM2301 21
//вернет TRUE если DHT сенсор доступен
bool DHTDriver::DHTsetup(int dhttype)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "setup");
#endif
#endif
	//если DHT уже был настроен выходим
	if (DHTSetuped)
		return DHTSetupResult;
	//устанавливаем этот флажок - мы попытались настроить DHT - возможно не удачно
	DHTSetuped = true;
	//запрашиваем PIN назначенный DHT
	DriverPin *pinDriverInfo = getDriverPinByDriverId(id, PIN0_INDEX);
	if (pinDriverInfo != nullptr)
	{
		//если PIN выделен и закреплен за DHT инкапсулируем класс обслуживавший DHT от Adafruit Industries
		dht = new DHT(pinDriverInfo->GPIONumber, dhttype);
		//стартуем DHT сенсор
		dht->begin();
		//пробуем прочесть значение температуры
		float _temperature = dht->readTemperature();
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "DHT temperature " + String(_temperature));
#endif
#endif
		//если DHT сломан, не присоединен, ошиблись с PIN _temperature = NAN, ниже проверка на NAN (неопределенное состояние float переменной )
		if (_temperature == _temperature)
			DHTSetupResult = true; //float NAN at C/C++ check as float == float
		else
			DHTSetupResult = false; //сенсор не доступен
									//сообщаем на верх о результате
		return DHTSetupResult;
	}
	return false;
}
/*-------------------------------------------------------------------------------------------------------------------------
  DHT sensor get temperature value
  -------------------------------------------------------------------------------------------------------------------------*/
//получить температуру - если сенсор недоступен вернет NAN (сенсор может "отвалиться" на ходу)
float DHTDriver::DHTgetTemperature(bool _celsius)
{
	if (dht == nullptr)
	{
		return 0;
	}
	else
	{
		if (_celsius)
		{
			return dht->readTemperature(false, false); //dht->readTemperature(false, ...=> true Force read sensor => false read with time intervals
		}
		else
		{
			return dht->readTemperature(true, false); //first parameter is "S" flag - convert C to F
		}
	}
}
/*-------------------------------------------------------------------------------------------------------------------------
  DHT sensor get humidity value
  -------------------------------------------------------------------------------------------------------------------------*/
//получаем влажность, если DHT недоступно вернет NAN
float DHTDriver::DHTgetHumidity()
{
	if (dht == nullptr)
	{
		return 0;
	}
	else
	{
		return dht->readHumidity();
	}
}
/*-------------------------------------------------------------------------------------------------------------------------
  DHT sensor get heat index 
  -------------------------------------------------------------------------------------------------------------------------*/
//получить heat index - если сенсор недоступен вернет NAN
float DHTDriver::DHTgetHeatIndex(bool _celsius)
{
	if (dht == nullptr)
	{
		return 0;
	}
	else
	{
		return dht->computeHeatIndex(atof(temperature.c_str()), atof(humidity.c_str()), !_celsius); //для Цельсия - false, фля Фаренгейта true
	}
}
//В каждом драйвере вызывают метод begin когда транспорт готов к работе
bool DHTDriver::begin(String _topic)
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);

	if (BaseDriver::begin(_topic))
	{
		getDHTType();		   //забираем из файла или константы тип DHT сенсора
		if (DHTsetup(dhttype)) //пробуем подключится к DHT
		{
			available = true; //сенсор доступен
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(id, "Physical DHT sensor available");
#endif
#endif
		}
		else
		{
			available = false; //сенсор не доступен
#ifdef DETAILED_DEBUG
#ifdef DEBUG
			debugOut(id, "Physical DHT sensor NOT available");
#endif
#endif
		}
	}

	trap = 0.1f;
	setType(DHT_DRIVER_TYPE);
	setAvailable(available); //сообщаем наверх о доступности сенсора
	return available;
}

/*
регулярный опрос показаний сенсора, в частности для срабатывания ловушки Trap
таким образом клиенты могут опрашивать этот сенсор в достаточно длительные интервалы времени, 
но если за время queryInterval значение перейдет значение Trap в положительную или отрицательную сторону, 
сработает ловушка. Например если температуры резко возросла на 5 градусов. 
Так же собираем показания температуры и влажности в файлы и массивы с историями изменения показаний
*/
bool DHTDriver::query()
{
	if (BaseDriver::query())
	{
		float _temperature = atof(temperature.c_str());
		getTemperature();
		//проверка ловушки
		float different = atof(temperature.c_str()) - _temperature;
		if ((different > trap) || (different < -trap))
		{
			onInsideChange("temperature", temperature);
		}
		//Write history data to file
		if (millis() >= lastHistoryFileWriteMillis + historyFileWriteInterval)
		{
			lastHistoryFileWriteMillis = millis();
			writeHistoryFile(atof(temperature.c_str()));
		}
		//Humidity --------------------------------------------------------------
		float _humidity = atof(humidity.c_str());

		getHumidity();
		//проверка ловушки влажности
		different = atof(humidity.c_str()) - _humidity;
		if ((different > trap) || (different < -trap))
		{
			onInsideChange("humidity", humidity);
		}
		//HeatIndex -------------------------------------------------------------
		getHeatIndex();

		//Fill array of history data ---------------------------
		if (millis() >= lastHistoryMillis + historyInterval)
		{
			lastHistoryMillis = millis();
			setTemperatureHistoryData(atof(temperature.c_str()));
			setHumidityHistoryData(atof(humidity.c_str()));
			setHeatIndexHistoryData(atof(heatIndex.c_str()));
		}
		return true;
	}
	return false;
}

//сборщик свойств драйвера, по этим свойствам строится карта HTTPServer API и MQTT подписки
String DHTDriver::getAllProperties()
{
	return BaseDriver::getAllProperties() +
		   "dhttype=" + String(dhttype) + "//i\n"
										  "celsius=" +
		   String(getCelsius()) + "//b\n"
								  "temperature=" +
		   getTemperature() + "//rf\n"
							  "temperaturehistorydata=" +
		   getTemperatureHistoryData() + "//r\n"
										 "temperaturehistoryfile=//r\n"
										 "humidity=" +
		   getHumidity() + "//rf\n"
						   "humidityhistorydata=" +
		   getHumidityHistoryData() + "//r\n"
									  "heatindex=" +
		   getHeatIndex() + "//rf\n"
							"heatindexhistorydata=" +
		   getHeatIndexHistoryData() + "//r\n";
}

//драйвер отправляет свои показания подписантам раз в pulishInterval
bool DHTDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("temperature", temperature);
		onInsideChange("humidity", humidity);
		onInsideChange("heatindex", heatIndex);
		return true;
	}
	return false;
}
//опрос свойств драйвера для чтения записи от HTTPServer или MQTT
String DHTDriver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);
	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;

	if (matchRoute(route, topic, "/getdhttype"))
	{
		result = onGetProperty("dhttype", String(getDHTType()), transportMask);
	}
	else if (matchRoute(route, topic, "/setdhttype"))
	{
		result = String(setDHTType(atoi(_payload.c_str())));
	}

	if (!available)
		return result;

	if (matchRoute(route, topic, "/getcelsius"))
	{
		result = onGetProperty("celsius", String(getCelsius()), transportMask);
	}
	else if (matchRoute(route, topic, "/setcelsius"))
	{
		result = String(setCelsius(atoi(_payload.c_str())));
	}
	else if ((matchRoute(route, topic, "/gettemperature")) || (matchRoute(route, topic, "/settemperature")))
	{
		result = onGetProperty("temperature", getTemperature(), transportMask);
	}
	else if ((matchRoute(route, topic, "/gethumidity")) || (matchRoute(route, topic, "/sethumidity")))
	{
		result = onGetProperty("humidity", getHumidity(), transportMask);
	}
	else if ((matchRoute(route, topic, "/getheatindex")) || (matchRoute(route, topic, "/setheatindex")))
	{
		result = onGetProperty("heatindex", getHeatIndex(), transportMask);
	}
	//Temperature history data -------------------------------------------------------------
	else if (matchRoute(route, topic, "/gettemperaturehistorydata"))
	{
		return onGetProperty("temperaturehistorydata", String(getTemperatureHistoryData()), transportMask);
	}
	//Read history file contents-------------------------------------------------------------
	else if (matchRoute(route, topic, "/gettemperaturehistoryfile"))
	{
		return onGetProperty("temperaturehistoryfile", String(readTemperatureHistoryFile()), transportMask);
	}

	else if (matchRoute(route, topic, "/gethumidityhistorydata"))
	{
		return onGetProperty("humidityhistorydata", String(getHumidityHistoryData()), transportMask);
	}

	else if (matchRoute(route, topic, "/getheatindexhistorydata"))
	{
		return onGetProperty("heatindexhistorydata", String(getHeatIndexHistoryData()), transportMask);
	}

	return result;
}
//получить значение свойства драйвера определяющее тип сенсора
int DHTDriver::getDHTType()
{
	if (filesExists(id + ".dhttype"))
	{
		dhttype = filesReadInt(id + ".dhttype");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "dhttype=" + String(dhttype));
#endif
#endif
	return dhttype;
}
//установить тип сенсора (типы сенсоров можно менять "на лету", по умолчанию DHT22, если у вас другой сенсор, подключитесь к OWLOS и
//измените значение этого свойства
bool DHTDriver::setDHTType(int _dhttype)
{
	dhttype = _dhttype;
	filesWriteInt(id + ".dhttype", dhttype);
	DHTSetuped = false;
	if (DHTsetup(_dhttype))
	{
		if (available)
		{
			return onInsideChange("dhttype", String(dhttype));
		}
		return true;
	}
	else
	{
		DHTSetuped = false;
		return false;
	}
}
//Свойство Celsius переключает режимы Целсии - Фаренгейты
//Если свойство Celsius == true все температурные данные в Цельсиях, иначе в Фаренгейтах
bool DHTDriver::getCelsius()
{
	if (filesExists(id + ".celsius"))
	{
		celsius = filesReadInt(id + ".celsius");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "celsius=" + String(celsius));
#endif
#endif
	return celsius;
}
//Переключает режимы Целсии - Фаренгейты
//Если свойство _celsius == true все температурные данные в Цельсиях, иначе в Фаренгейтах
bool DHTDriver::setCelsius(bool _celsius)
{
	celsius = _celsius;
	filesWriteInt(id + ".celsius", celsius);
	//если пользователь изменил режим, сбрасываются все журналы связаные со сбором температурных показателей
	if (DHTSetuped)
	{
		if (available)
		{
			temperatureHistoryCount = 0;
			humidityHistoryCount = 0;
			heatIndexHistoryCount = 0;

			currentTemperatureFile = 0;
			currentTemperatureFileIndex = 0;
			historyTemperatureFileCount = 0;

			getTemperature();
			getHumidity();
			getHeatIndex();
		}
		return true;
	}
	else
	{
		return false;
	}
}
//опрос температуры
String DHTDriver::getTemperature()
{
	//если нет обслуживающего класса
	if (dht == nullptr)
	{
		setAvailable(false);
		temperature = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "DHT object not ready");
#endif
#endif
		return temperature;
	}
	//пробуем получить значение от сенсора
	float _temperature = DHTgetTemperature(celsius);
	if (_temperature != _temperature) //float NAN check
	{
		//если сенсор не доступем
		setAvailable(false);
		temperature = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "Going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{
		temperature = String(_temperature);
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "temperature=" + temperature);
#endif
#endif
	return temperature;
}
//смотрите getTemperature
String DHTDriver::getHumidity()
{

	if (dht == nullptr)
	{
		setAvailable(false);
		humidity = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "DHT object not ready");
#endif
#endif
		return humidity;
	}

	float _humidity = DHTgetHumidity();
	if (_humidity != _humidity) //float NAN check
	{
		setAvailable(false);
		humidity = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "Going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{
		humidity = String(_humidity);
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "humidity=" + humidity);
#endif
#endif
	return humidity;
}
//забираем вычесленный heat index (6 июля 2020 года в Киеве особенно актуально)
String DHTDriver::getHeatIndex()
{

	if (dht == nullptr)
	{
		setAvailable(false);
		heatIndex = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "DHT object not ready");
#endif
#endif
		return heatIndex;
	}

	float _heatIndex = DHTgetHeatIndex(celsius);
	if (_heatIndex != _heatIndex) //float NAN check
	{
		setAvailable(false);
		heatIndex = "nan";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(id, "Going to NOT available now, check sensor");
#endif
#endif
	}
	else
	{
		heatIndex = String(_heatIndex);
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "humidity=" + humidity);
#endif
#endif
	return heatIndex;
}
//получение накопленных данных о показаниях сенсора температуры
String DHTDriver::getTemperatureHistoryData()
{
	String dataHistory = String(temperatureHistoryCount) + ";";

	for (int k = 0; k < temperatureHistoryCount; k++)
	{
		dataHistory += String(temperatureHistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения температуры в историю
bool DHTDriver::setTemperatureHistoryData(float _historydata)
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
//так же как и для температуры
String DHTDriver::getHumidityHistoryData()
{
	String dataHistory = String(humidityHistoryCount) + ";";

	for (int k = 0; k < humidityHistoryCount; k++)
	{
		dataHistory += String(humidityHistoryData[k]) + ";";
	}

	return dataHistory;
}
//так же как и для температуры
bool DHTDriver::setHumidityHistoryData(float _historydata)
{
	if (isnan(_historydata))
		return false;
	if (humidityHistoryCount < historySize)
	{
		humidityHistoryData[humidityHistoryCount] = _historydata;
		humidityHistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			humidityHistoryData[k - 1] = humidityHistoryData[k];
		}

		humidityHistoryData[historySize - 1] = _historydata;
	}

	return true;
}
//получение накопленных данных о вычесленных Heat индексах
String DHTDriver::getHeatIndexHistoryData()
{
	String dataHistory = String(heatIndexHistoryCount) + ";";

	for (int k = 0; k < heatIndexHistoryCount; k++)
	{
		dataHistory += String(heatIndexHistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения температуры в историю
bool DHTDriver::setHeatIndexHistoryData(float _heatindexdata)
{
	if (isnan(_heatindexdata))
		return false;

	if (heatIndexHistoryCount < historySize)
	{
		heatIndexHistoryData[heatIndexHistoryCount] = _heatindexdata;
		heatIndexHistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++)
		{
			heatIndexHistoryData[k - 1] = heatIndexHistoryData[k];
		}

		heatIndexHistoryData[historySize - 1] = _heatindexdata;
	}

	return true;
}

//TemperatureHistoryFile property Read<->Write wrappers
String DHTDriver::readTemperatureHistoryFile()
{
	String result = "";
	for (int i = 0; i < filesIndexesSize; i++)
	{
		String file = id + "." + String(temperatureHistoryFilesIndexes[i] + 1) + ".history";
		if (filesExists(file))
		{
			result += filesReadString(file);
		}
	}
	return result;
}

bool DHTDriver::writeTemperatureHistoryFile(float _historydata)
{
	bool result = false;
	String _historyfilename;
	if (historyTemperatureFileCount < historyFileWriteTime)
	{
		historyTemperatureFileCount++;
	}
	else
	{
		historyTemperatureFileCount = 1;
		if (currentTemperatureFileIndex < filesIndexesSize)
		{
			//Write to history file at the begining
			currentTemperatureFile = temperatureHistoryFilesIndexes[currentFileIndex];
			currentTemperatureFileIndex++;
		}
		else
		{
			currentTemperatureFileIndex = filesIndexesSize;
			//Take value from historyFilesIndexes[0]
			currentFile = historyFilesIndexes[0];
			//Shift array element one step to left
			for (int i = 1; i < filesIndexesSize; i++)
			{
				temperatureHistoryFilesIndexes[i - 1] = temperatureHistoryFilesIndexes[i];
			}
			//Put the current file to the end of array
			temperatureHistoryFilesIndexes[filesIndexesSize - 1] = currentTemperatureFile;
		}

		//delete file with oldest history
		filesDelete(id + "." + String(currentTemperatureFile + 1) + ".history");
	}

	_historyfilename = id + "." + String(currentTemperatureFile + 1) + ".history";

	if (!filesExists(_historyfilename))
	{
		result = filesWriteString(_historyfilename, String(_historydata) + ";");
	}
	else
	{
		result = filesAddString(_historyfilename, String(_historydata) + ";");
	}
	return result;
}
#endif
