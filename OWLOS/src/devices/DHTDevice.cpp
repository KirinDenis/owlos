#include "DHTDevice.h"


/*-------------------------------------------------------------------------------------------------------------------------
  Setup DHT sensor
  -------------------------------------------------------------------------------------------------------------------------*/
bool DHTDevice::DHTsetup(int pin, int dhttype)
{
	debugOut(id, "setup");
	if (DHTSetuped) return DHTSetupResult;
	DHTSetuped = true;
	//pinMode(pin, INPUT);
	
	dht = new DHT(pin, dhttype);
	
	dht->begin();
	
	float _temperature = dht->readTemperature();
	debugOut(id, "DHT temperature " + String(_temperature));
	if (_temperature == _temperature) DHTSetupResult = true; //float NAN at C/C++ check as float == float
	else
		DHTSetupResult = false;

	return DHTSetupResult;
}

/*-------------------------------------------------------------------------------------------------------------------------
  DHT sensor get temperature value
  -------------------------------------------------------------------------------------------------------------------------*/
float DHTDevice::DHTgetTemperature()
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
float DHTDevice::DHTgetHumidity()
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


bool DHTDevice::begin(String _topic)
{
	
	if (id.length() == 0) id = DeviceID;
	BaseDevice::init(id);
	
	if (BaseDevice::begin(_topic))
	{
	
		getPin();
		getDHTType();
	
		if (DHTsetup(pin, dhttype))
		{
	
			available = true;
			if (DetailedDebug) debugOut(id, "Physical DHT sensor available");
		}
		else
		{
			available = false;
			if (DetailedDebug) debugOut(id, "Physical DHT sensor NOT available");
		}
	}

	trap = 0.1f;
	setType(DHTDeviceType);
	setAvailable(available);
	return available;
}

bool DHTDevice::query()
{
	
	if (BaseDevice::query())
	{
	
		float _temperature = std::atof(temperature.c_str());
	
		getTemperature();
	
		float different = std::atof(temperature.c_str()) - _temperature;
		if ((different > trap) || (different < -trap))
		{
			onInsideChange("temperature", temperature);
		}

		//Fill array of history data
		if (millis() >= lastHistoryMillis + historyInterval)
		{
			lastHistoryMillis = millis();
			setHistoryData(std::atof(temperature.c_str()));
		}

		//Write history data to file
		if (millis() >= lastHistoryFileWriteMillis + historyFileWriteInterval)
		{

			lastHistoryFileWriteMillis = millis();
			writeHistoryFile(std::atof(temperature.c_str()));
		}
	
		return true;
	}
	return false;
}

String DHTDevice::getAllProperties()
{
	
	String result = BaseDevice::getAllProperties();
	result += "temperature=" + getTemperature() + "//rf\n";
	result += "humidity=" + getHumidity() + "//rf\n";
	result += "pin=" + String(pin) + "//i\n";
	result += "dhttype=" + String(dhttype) + "//i\n";
	return result;
}


bool DHTDevice::publish()
{	
	if (BaseDevice::publish())
	{
		onInsideChange("temperature", temperature);
		onInsideChange("humidity", humidity);
		return true;
	}
	return false;
}

String DHTDevice::onMessage(String _topic, String _payload, int transportMask)
{
	
	String result = BaseDevice::onMessage(_topic, _payload, transportMask);
	if (!available) return result;
	if (String(topic + "/getpin").equals(_topic))
	{
		result = onGetProperty("pin", String(getPin()), transportMask);
	}
	else if ((String(topic + "/gettemperature").equals(_topic)) || (String(topic + "/settemperature").equals(_topic)))
	{
		result = onGetProperty("temperature", getTemperature(), transportMask);
	}
	else if ((String(topic + "/gethumidity").equals(_topic)) || (String(topic + "/sethumidity").equals(_topic)))
	{
		result = onGetProperty("humidity", getHumidity(), transportMask);
	}

	return result;
}

int DHTDevice::getPin()
{
	if (filesExists(id + ".pin"))
	{
		pin = filesReadInt(id + ".pin");
	}
	if (DetailedDebug) debugOut(id, "pin=" + String(pin));
	return pin;
}

bool DHTDevice::setPin(int _pin)
{
	pin = _pin;
	DHTSetuped = false;
	//pinMode(pin, INPUT);
	filesWriteInt(id + ".pin", pin);
	if (available)
	{
		return onInsideChange("pin", String(pin));
	}
	return true;
}

int DHTDevice::getDHTType()
{
	if (filesExists(id + ".dhttype"))
	{
		dhttype = filesReadInt(id + ".dhttype");
	}
	if (DetailedDebug) debugOut(id, "dhttype=" + String(dhttype));
	return dhttype;
}

bool DHTDevice::setDHTType(int _dhttype)
{
	dhttype = _dhttype;
	DHTSetuped = false;
	filesWriteInt(id + ".dhttype", dhttype);
	if (available)
	{
		return onInsideChange("dhttype", String(dhttype));
	}
	return true;
}


String DHTDevice::getTemperature()
{
	if (dht == nullptr)
	{
		setAvailable(false);
		temperature = "nan";
		if (DetailedDebug) debugOut(id, "DHT object not ready");
		return temperature;
	}

	float _temperature = DHTgetTemperature();
	if (_temperature != _temperature)  //float NAN check
	{
		setAvailable(false);
		temperature = "nan";
		if (DetailedDebug) debugOut(id, "Going to NOT available now, check sensor");
	}
	else
	{
		temperature = String(_temperature);
	}
	if (DetailedDebug) debugOut(id, "temperature=" + temperature);
	return temperature;
}

String DHTDevice::getHumidity()
{

	if (dht == nullptr)
	{
		setAvailable(false);
		humidity = "nan";
		if (DetailedDebug) debugOut(id, "DHT object not ready");
		return humidity;
	}

	float _humidity = DHTgetHumidity();
	if (_humidity != _humidity)  //float NAN check
	{
		setAvailable(false);
		humidity = "nan";
		if (DetailedDebug) debugOut(id, "Going to NOT available now, check sensor");
	}
	else
	{
		humidity = String(_humidity);
	}
	if (DetailedDebug) debugOut(id, "humidity=" + humidity);
	return humidity;
}

