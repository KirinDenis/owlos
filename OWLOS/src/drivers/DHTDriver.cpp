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
#ifdef DetailedDebug 
	debugOut(id, "setup");
#endif
	//если DHT уже был настроен выходим
	if (DHTSetuped) return DHTSetupResult;
	//устанавливаем этот флажок - мы попытались настроить DHT - возможно не удачно
	DHTSetuped = true; 
	//запрашиваем PIN назначенный DHT
	PinDriverInfo pinDriverInfo;
	if (getDriverPinInfo(id, PIN0_INDEX, &pinDriverInfo))
	{
		//если PIN выделен и закреплен за DHT инкапсулируем класс обслуживавший DHT от Adafruit Industries
		dht = new DHT(pinDriverInfo.GPIONumber, dhttype);
		//стартуем DHT сенсор
		dht->begin();
		//пробуем прочесть значение температуры 
		float _temperature = dht->readTemperature();
#ifdef DetailedDebug 
		debugOut(id, "DHT temperature " + String(_temperature));
#endif
		//если DHT сломан, не присоединен, ошиблись с PIN _temperature = NAN, ниже проверка на NAN (неопределенное состояние float переменной )
		if (_temperature == _temperature) DHTSetupResult = true; //float NAN at C/C++ check as float == float
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
float DHTDriver::DHTgetTemperature()
{
	if (dht == nullptr)
	{
		return 0;
	}
	else
	{
		return dht->readTemperature();
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

//В каждом драйвере вызывают метод begin когда транспорт готов к работе 
bool DHTDriver::begin(String _topic)
{
	if (id.length() == 0) id = DRIVER_ID;
	BaseDriver::init(id);

	if (BaseDriver::begin(_topic))
	{
		getDHTType(); //забираем из файла или константы тип DHT сенсора
		if (DHTsetup(dhttype)) //пробуем подключится к DHT
		{
			available = true; //сенсор доступен
#ifdef DetailedDebug
			debugOut(id, "Physical DHT sensor available");
#endif
		}
		else
		{
			available = false; //сенсор не доступен
#ifdef DetailedDebug
			debugOut(id, "Physical DHT sensor NOT available");
#endif
		}
	}

	trap = 0.1f;
	setType(DHTDriverType);
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
		float _temperature = std::atof(temperature.c_str());
		getTemperature();
		//проверка ловушки
		float different = std::atof(temperature.c_str()) - _temperature;
		if ((different > trap) || (different < -trap))
		{
			onInsideChange("temperature", temperature);
		}
		//Write history data to file
		if (millis() >= lastHistoryFileWriteMillis + historyFileWriteInterval)
		{

			lastHistoryFileWriteMillis = millis();
			writeHistoryFile(std::atof(temperature.c_str()));
		}
		//Humidity --------------------------------------------------------------
		float _humidity = std::atof(humidity.c_str());

		getHumidity();
		//проверка ловушки влажности
		different = std::atof(humidity.c_str()) - _humidity;
		if ((different > trap) || (different < -trap))
		{
			onInsideChange("humidity", humidity);
		}
		//Fill array of history data
		if (millis() >= lastHistoryMillis + historyInterval)
		{
			lastHistoryMillis = millis();
			setTemperatureHistoryData(std::atof(temperature.c_str()));
			setHumidityHistoryData(std::atof(humidity.c_str()));
		}
		return true;
	}
	return false;
}

//сборщик свойств драйвера, по этим свойствам строится карта RESTful API и MQTT подписки 
String DHTDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "temperature=" + getTemperature() + "//rf\n";
	result += "temperaturehistorydata=" + getTemperatureHistoryData() + "//r\n";
	result += "temperaturehistoryfile=//r\n";
	result += "humidity=" + getHumidity() + "//rf\n";
	result += "humidityhistorydata=" + getHumidityHistoryData() + "//r\n";
	result += "dhttype=" + String(dhttype) + "//i\n";
	return result;
}

//драйвер отправляет свои показания подписантам раз в pulishInterval
bool DHTDriver::publish()
{
	if (BaseDriver::publish())
	{
		onInsideChange("temperature", temperature);
		onInsideChange("humidity", humidity);
		return true;
	}
	return false;
}
//опрос свойств драйвера для чтения записи от RESTful или MQTT 
String DHTDriver::onMessage(String _topic, String _payload, int transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);

	if (String(topic + "/getdhttype").equals(_topic))
	{
		result = onGetProperty("dhttype", String(getDHTType()), transportMask);
	}
	else if (String(topic + "/setdhttype").equals(_topic))
	{
		result = String(setDHTType(std::atoi(_payload.c_str())));
	}

	if (!available) return result;

	if ((String(topic + "/gettemperature").equals(_topic)) || (String(topic + "/settemperature").equals(_topic)))
	{
		result = onGetProperty("temperature", getTemperature(), transportMask);
	}
	else if ((String(topic + "/gethumidity").equals(_topic)) || (String(topic + "/sethumidity").equals(_topic)))
	{
		result = onGetProperty("humidity", getHumidity(), transportMask);
	}
	//Temperature history data -------------------------------------------------------------
	else if (String(topic + "/gettemperaturehistorydata").equals(_topic))
	{
		return onGetProperty("temperaturehistorydata", String(getTemperatureHistoryData()), transportMask);
	}
	//Read history file contents-------------------------------------------------------------
	else if (String(topic + "/gettemperaturehistoryfile").equals(_topic))
	{
		return onGetProperty("temperaturehistoryfile", String(readTemperatureHistoryFile()), transportMask);
	}

	else if (String(topic + "/gethumidityhistorydata").equals(_topic))
	{
		return onGetProperty("humidityhistorydata", String(getHumidityHistoryData()), transportMask);
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
#ifdef DetailedDebug
	debugOut(id, "dhttype=" + String(dhttype));
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
//опрос температуры 
String DHTDriver::getTemperature()
{
	//если нет обслуживающего класса 
	if (dht == nullptr)
	{
		setAvailable(false);
		temperature = "nan";
#ifdef DetailedDebug
		debugOut(id, "DHT object not ready");
#endif
		return temperature;
	}
	//пробуем получить значение от сенсора 
	float _temperature = DHTgetTemperature();
	if (_temperature != _temperature)  //float NAN check
	{
		//если сенсор не доступем 
		setAvailable(false);
		temperature = "nan";
#ifdef DetailedDebug
		debugOut(id, "Going to NOT available now, check sensor");
#endif
	}
	else
	{
		temperature = String(_temperature);
	}
#ifdef DetailedDebug
	debugOut(id, "temperature=" + temperature);
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
#ifdef DetailedDebug
		debugOut(id, "DHT object not ready");
#endif
		return humidity;
	}

	float _humidity = DHTgetHumidity();
	if (_humidity != _humidity)  //float NAN check
	{
		setAvailable(false);
		humidity = "nan";
#ifdef DetailedDebug
		debugOut(id, "Going to NOT available now, check sensor");
#endif
	}
	else
	{
		humidity = String(_humidity);
	}
#ifdef DetailedDebug
	debugOut(id, "humidity=" + humidity);
#endif
	return humidity;
}
//получение накопленных данных о показаниях сенсора температуры
String DHTDriver::getTemperatureHistoryData()
{
	String	dataHistory = String(temperatureHistoryCount) + ";";

	for (int k = 0; k < temperatureHistoryCount; k++)
	{
		dataHistory += String(temperatureHistoryData[k]) + ";";
	}

	return dataHistory;
}
//добавление очередного значения температуры в историю
bool DHTDriver::setTemperatureHistoryData(float _historydata)
{
	if (isnan(_historydata)) return false;

	if (temperatureHistoryCount < historySize) {
		temperatureHistoryData[temperatureHistoryCount] = _historydata;
		temperatureHistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++) {
			temperatureHistoryData[k - 1] = temperatureHistoryData[k];
		}

		temperatureHistoryData[historySize - 1] = _historydata;
	}

	return true;
}
//так же как и для температуры
String DHTDriver::getHumidityHistoryData()
{
	String	dataHistory = String(humidityHistoryCount) + ";";

	for (int k = 0; k < humidityHistoryCount; k++)
	{
		dataHistory += String(humidityHistoryData[k]) + ";";
	}

	return dataHistory;
}
//так же как и для температуры
bool DHTDriver::setHumidityHistoryData(float _historydata)
{
	if (isnan(_historydata)) return false;
	if (humidityHistoryCount < historySize) {
		humidityHistoryData[humidityHistoryCount] = _historydata;
		humidityHistoryCount++;
	}
	else
	{
		for (int k = 1; k < historySize; k++) {
			humidityHistoryData[k - 1] = humidityHistoryData[k];
		}

		humidityHistoryData[historySize - 1] = _historydata;
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
