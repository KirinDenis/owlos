#pragma once
#include <Arduino.h>
#include <DHT.h>
#include "BaseDevice.h"

#define DeviceID "DHT"

class DHTDevice : public BaseDevice {
public:
	bool DHTsetup(int pin, int dhttype);
	float DHTgetTemperature();
	float DHTgetHumidity();

	bool begin(String _Topic);
	bool query();
	String getAllProperties();
	bool publish();
	String onMessage(String _topic, String _payload, int transportMask);
	int getPin();
	bool setPin(int _pin);
	int getDHTType();
	bool setDHTType(int _dhttype);
	String getTemperature();
	String getHumidity();
private:
	bool DHTSetuped = false;
	bool DHTSetupResult = false;
	DHT * dht = nullptr;
	int pin = DHTPIN;
	int dhttype = DHT22;
	String temperature = "nan";
	String humidity = "nan";
};
