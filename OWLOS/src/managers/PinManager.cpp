﻿#include <core_version.h>
#include "PinManager.h"

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include "../libraries/ESP32_AnalogWrite/src/analogWrite.h"
#endif


//String decodePinType[14] = { "NO_MASK", "GP_IO_MASK", "DIGITAL_IO_MASK", "DIGITALI_MASK", "DIGITALO_MASK", "ANALOG_IO_MASK", "ANALOGI_MASK", "ANALOGO_MASK", "SDA_MASK",  "SCL_MASK", "I2CADDR_MASK", "VCC5_MASK",  "VCC33_MASK",  "GND_MASK" };
//String decodePinFamily[3] = { "NO_FAMILY", "I2C_FAMILY", "VCC_FAMILY" };


int pinCount = 0;
int driverPinCount = 0;
Pin * pins = nullptr;
DriverPin * driverPins = nullptr;


String decodePinTypes(uint16_t pinType) {
	/*
	String decodedPinTypes;

	if (pinType & DIGITAL_I_MASK) { decodedPinTypes += "DIGITAL_I,"; }

	if (pinType & DIGITAL_O_MASK) { decodedPinTypes += " DIGITAL_O,"; }

	if (pinType & ANALOG_I_MASK) { decodedPinTypes += " ANALOG_I,"; }

	if (pinType & ANALOG_O_MASK) { decodedPinTypes += " ANALOG_O,"; }

	if (pinType & SDA_MASK) { decodedPinTypes += " SDA,"; }

	if (pinType & SCL_MASK) { decodedPinTypes += " SCL,"; }

	if (pinType & I2CADDR_MASK) { decodedPinTypes += " I2C_ADDR,"; }

	if (pinType & VCC5_MASK) { decodedPinTypes += " VCC5,"; }

	if (pinType & VCC33_MASK) { decodedPinTypes += " VCC33,"; }

	if (pinType & GND_MASK) { decodedPinTypes += " GND,"; }

	if (!(pinType | NO_MASK)) { decodedPinTypes += " UNKNOWN_PIN_TYPE,"; }

	if (decodedPinTypes.length() > 0) {

		decodedPinTypes = decodedPinTypes.substring(0, decodedPinTypes.length() - 1);
	}
	else {
		decodedPinTypes += "UNKNOWN_PIN_TYPE";
	}


	return decodedPinTypes;
	*/
}


String pinDecodeType(uint16_t typeCode)
{
	//return decodePinTypes(typeCode);
}

String getPinMap()
{
	
	/*
	String result = "";
	DriverPin * _driverPins = nullptr;
	int _count = 0;
	for (int i = 0; i < pinCount; i++)
	{
		result += "name:" + pins[i].name + "\n";
		result += "mode=" + String(pins[i].mode) + "\n";
		result += "pintypes=" + String(pins[i].pinTypes) + "\n";
		result += "decodedpintypes=" + decodePinTypes(pins[i].pinTypes) + "\n";
		result += "gpio=" + String(pins[i].GPIONumber) + "\n";
		result += "chipnumber=" + String(pins[i].chipNumber) + "\n";
		result += "neighbourpin=" + String(pins[i].neighbourPin) + "\n";
		result += "location=" + pins[i].location + "\n";

		_count = getDriverPinsByGPIONumber(pins[i].GPIONumber, _driverPins);
		if (_count > 0)
		{
			for (int j = 0; j < _count; j++)
			{
				result += "driverid:" + _driverPins[j].driverId + "\n";
				result += "driverpintype=" + String(_driverPins[j].driverPinType) + "\n";
				result += "driverpintypedecoded=" + decodePinTypes(_driverPins[j].driverPinType) + "\n";
				result += "driverpinindex=" + String(_driverPins[j].driverPinIndex) + "\n";
				result += "drivei2caddr=" + String(_driverPins[j].driverI2CAddr) + "\n";
			}
			delete[] _driverPins;
		}

		//for (int j = 0; j < PIN_MASK_COUNT; j++)
		//{
		//	if (pins[i].pinTypes[j].type == NO_MASK)
		//	{
		//		break;
		//	}
		//	result += "role:" + String(j) + "\n";
		//	result += "family=" + String(pins[i].pinTypes[j].family) + "\n";
		//	result += "familydecode=" + decodePinFamily[pins[i].pinTypes[j].family] + "\n";
		//	result += "type=" + String(pins[i].pinTypes[j].type) + "\n";
		//	result += "typedecode=" + decodePinType[pins[i].pinTypes[j].type] + "\n";
		//	result += "neighbor=" + String(pins[i].pinTypes[j].neighbor) + "\n";
		//}

	}
	return result;
	*/
}

Pin * getPin(int GPIONumber)
{
	/*
	for (int i = 0; i < pinCount; i++)
	{
		if (pins[i].GPIONumber == GPIONumber)
		{
			return &pins[i];
		}
	}
	return nullptr;
	*/
}


bool pinTypeSupported(Pin pin, uint16_t pinType)
{
	//return (pin.pinTypes & pinType);
	//	//если тип пина I/O или I и требуемый драйвером тип I/O или I
	//	if (((pin.pinTypes & pinType (DIGITAL_I_MASK | DIGITAL_O_MASK) || (pin.pinTypes & DIGITAL_I_MASK)) && (pinType & (DIGITAL_I_MASK | DIGITAL_O_MASK) || (pinType & DIGITAL_I_MASK)))
	//	{
	//		return true;
	//	}
	//	else //если тип пина I/O или O и требуемый драйвером тип I/O или O
	//		if (((pin.pinTypes & (DIGITAL_I_MASK | DIGITAL_O_MASK) || (pin.pinTypes & DIGITAL_O_MASK)) && ((pinType == DIGITAL_IO_MASK) || (pinType == DIGITALO_MASK)))
	//		{
	//			return true;
	//		}
	//		else
	//			if (pin.pinTypes[i].type == pinType)
	//			{
	//				return true;
	//			}

	//return false;
}


/*
Pin * getDriverPin(String driverId, int driverPinIndex)
{
	for (int i = 0; i < pinCount; i++)
	{
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if ((pins[i].driverId[j].equals(driverId)) && (pins[i].driverPinIndex[j] == driverPinIndex))
			{
				return &pins[i];
			}



			if (pins[i].pinTypes & SDA_MASK)
			{
				if ((pins[i].driverId[j].equals(driverId)) && (pins[i].driverI2CAddrPinIndex[j] == driverPinIndex))
				{
					return &pins[i];
				}
			}


		}
	}
	return nullptr;
}
*/

String setDriverI2CAddr(bool checkOnly, String pinName, String driverId, int driverPinIndex)
{
	/*
	Serial.println(pinName);
	if (pinName.indexOf("ADDR0x") < 0)
	{
		return "bad I2C address format for " + driverId + " driver (mustbe ADDR0x00..ADDR0xFF)";
	}

	pinName = pinName.substring(String("ADDR").length());
	Serial.println(pinName);
	int i2cAddr = (int)strtol(&pinName[0], NULL, 16);
	Serial.println(String(i2cAddr));

	//сначала надо узнать назначены ли SDA и SCL для этого драйвера 
	PinDriverInfo SDA_PinDriverInfo;
	SDA_PinDriverInfo.driverPinType = NO_MASK;
	PinDriverInfo SCL_PinDriverInfo;
	SCL_PinDriverInfo.driverPinType = NO_MASK;

	int count = getDriverPinsCount(driverId);
	for (int i = 0; i < count; i++)
	{
		PinDriverInfo pinDriverInfo;
		if (getDriverPinInfo(driverId, i, &pinDriverInfo))
		{
			if (pinDriverInfo.driverPinType & SDA_MASK)
			{
				SDA_PinDriverInfo = pinDriverInfo;
			}

			if (pinDriverInfo.driverPinType & SCL_MASK)
			{
				SCL_PinDriverInfo = pinDriverInfo;
			}
		}
	}
	Serial.println(SDA_PinDriverInfo.name);
	Serial.println(SCL_PinDriverInfo.name);
	if (!checkOnly)
	{
		if ((SDA_PinDriverInfo.driverPinType & SDA_MASK) != SDA_MASK)
		{
			return "SDA pin not set for " + driverId + " driver, set SDA pin first (before set I2C address)";
		}

		if ((SCL_PinDriverInfo.driverPinType & SCL_MASK) != SCL_MASK)
		{
			return "SCL pin not set for " + driverId + " driver, set SCL pin first (before set I2C address)";
		}
	}

	//проверяем не занят ли I2C адрес другим драйвером
	for (int i = 0; i < pinCount; i++)
	{
		if (pins[i].name.equals(SDA_PinDriverInfo.name) || pins[i].name.equals(SCL_PinDriverInfo.name))
		{
			for (int j = 0; j < PIN_DRIVER_COUNT; j++)
			{
				if ((pins[i].driverPinType[j] & SDA_MASK) || (pins[i].driverPinType[j] & SCL_MASK))
				{
					if (pins[i].driverI2CAddr[j] == i2cAddr)
					{

						return "address " + pinName + " is busy by " + pins[i].driverId[j] + " and can't be use for " + driverId + " driver";
					}
				}
			}
		}
	}

	if (!checkOnly)
	{
		for (int i = 0; i < pinCount; i++)
		{
			if (pins[i].name.equals(SDA_PinDriverInfo.name) || pins[i].name.equals(SCL_PinDriverInfo.name))
			{
				for (int j = 0; j < PIN_DRIVER_COUNT; j++)
				{
					if ((pins[i].driverId[j].equals(driverId)) && ((pins[i].driverPinType[j] & SDA_MASK) || (pins[i].driverPinType[j] & SCL_MASK)))
					{

						pins[i].driverI2CAddr[j] = i2cAddr;
						pins[i].driverI2CAddrPinIndex[j] = driverPinIndex;

					}
				}
			}
		}
	}

	return "";
	*/
}


String setDriverPin(bool checkOnly, String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType)
{
	/*
	//if exists 
	Serial.println("---");
	Serial.println(String(driverPinIndex));
	Serial.println(String(pinType));
	Pin * existsPin = getDriverPin(driverId, driverPinIndex);
	int existsDriverIndex = -1;
	if (existsPin != nullptr)
	{
		Serial.println("Exists");
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if ((existsPin->driverId[j].equals(driverId)) && (existsPin->driverPinIndex[j] == driverPinIndex))
			{
				existsDriverIndex = j;
				pinType = existsPin->driverPinType[j];
				break;
			}


			if ((existsPin->pinTypes) & SDA_MASK)
			{
				if ((existsPin->driverId[j].equals(driverId)) && (existsPin->driverI2CAddrPinIndex[j] == driverPinIndex))
				{
					existsDriverIndex = j;
					pinType = I2CADDR_MASK;
					break;
				}
			}


		}
		if (existsDriverIndex == -1)
		{
			return "bad exists driver info, at pin " + existsPin->name;
		}
	}


	Serial.println(String(pinType));
	if (pinType & I2CADDR_MASK)
	{
		return setDriverI2CAddr(checkOnly, pinName, driverId, driverPinIndex);
	}
	else
	{
		for (int i = 0; i < pinCount; i++)
		{
			if (pins[i].name.equals(pinName))
			{
				if (pinTypeSupported(pins[i], pinType))
				{

					if ((pinType & SDA_MASK) || (pinType & SCL_MASK))
					{
						int freeDriverIdIndex = -1;
						for (int j = 0; j < PIN_DRIVER_COUNT; j++)
						{
							if (pins[i].driverId[j].length() == 0)
							{
								if (freeDriverIdIndex == -1)
								{
									freeDriverIdIndex = j;
								}
							}

							//прjверка занят ли пин другим типом драйвера (отличного от совместимого с I2C)

							if (((pins[i].driverPinType[j] & pinType) == 0) && (pins[i].driverPinType[j] != 0))
							{
								return "pin " + pinName + " is busy by driver " + pins[i].driverId[j] + " as non I2C pin (SDA or SCL)";
							}
						}
						if (freeDriverIdIndex == -1)
						{
							return "to many devices to one pin, limit: " + String(PIN_DRIVER_COUNT);
						}
						//TODO: проверить соседей 
						if (!checkOnly)
						{
							pins[i].driverId[freeDriverIdIndex] = driverId;
							pins[i].driverPinType[freeDriverIdIndex] = pinType;
							pins[i].driverPinIndex[freeDriverIdIndex] = driverPinIndex;
						}
						return "";
					}
					else


						//на цифровом или аналоговом пине может быть только один драйвер
						if ((pinType & DIGITAL_O_MASK) || (pinType & DIGITAL_I_MASK) || (pinType & ANALOG_O_MASK) || (pinType & ANALOG_I_MASK))
						{
							if ((pins[i].driverId[0].length() == 0)) //one digital on one pin
							{
								if (!checkOnly)
								{
									if (existsPin != nullptr)
									{
										existsPin->driverId[existsDriverIndex] = "";
										existsPin->driverPinIndex[existsDriverIndex] = -1;
										pins[i].driverPinType[0] = existsPin->driverPinType[0];
									}
									else
									{
										pins[i].driverPinType[0] = pinType;
									}

									pins[i].driverId[0] = driverId;
									pins[i].driverPinType[0] = pinType;
									pins[i].driverPinIndex[0] = driverPinIndex;
								}
								return "";
							}
							else
							{
								return "pin " + pinName + " is busy by " + pins[i].driverId[0] + " driver, as pin number " + String(pins[i].driverPinIndex[0]) + " (one digital device can use one digital pin)";
							}
						}
						else


							if ((pinType & GND_MASK) || (pinType & VCC33_MASK) || (pinType & VCC5_MASK))
							{
								int freeDriverIdIndex = -1;
								for (int j = 0; j < PIN_DRIVER_COUNT; j++)
								{
									if (pins[i].driverId[j].length() == 0)
									{
										freeDriverIdIndex = j;
										break;
									}
								}
								if (freeDriverIdIndex == -1)
								{
									return "to many devices to one pin, limit: " + String(PIN_DRIVER_COUNT);
								}
								*/
								/* TODO change GND and VCC pins
								if (existsPin != nullptr)
								{
									existsPin->driverId[0] = "";
									existsPin->driverPinIndex[0] = -1;
									pins[i].driverPinType[0] = existsPin->driverPinType[0];
								}
								else
								{
									pins[i].driverPinType[0] = pinType;
								}
								*/
/*
								if (!checkOnly)
								{
									pins[i].driverId[freeDriverIdIndex] = driverId;
									pins[i].driverPinType[freeDriverIdIndex] = pinType;
									pins[i].driverPinIndex[freeDriverIdIndex] = driverPinIndex;
								}
								return "";
							}

				}
				else
				{
					return "pin " + pinName + " not compatable with " + driverId + " driver, as pin number " + String(driverPinIndex) + " type " + decodePinTypes(pinType);
				}
			}
		}
	}
	return "pin " + pinName + " is not exists";
	*/
}

void freeDriverPin(String driverId, int driverPinIndex)
{
	/*
	for (int i = 0; i < pinCount; i++)
	{
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if ((pins[i].driverId[j].indexOf(driverId) >= 0) && (pins[i].driverPinIndex[j] == driverPinIndex))
			{
				pins[i].driverId[j] = "";
				pins[i].driverPinIndex[j] = -1;
				return;
			}
		}
	}
	return;
	*/
}

//https://github.com/arduino/Arduino/issues/4606
int getPinMode(uint32_t pin)
{
	/*
	if ((pin >= NUM_DIGITAL_PINS) || (pin < 0)) return (-1);

	uint32_t bit = digitalPinToBitMask(pin);
	uint32_t port = digitalPinToPort(pin);
	volatile uint32_t *reg = portModeRegister(port);
	if (*reg & bit) return (OUTPUT);

	volatile uint32_t *out = portOutputRegister(port);
	return ((*out & bit) ? INPUT_PULLUP : INPUT);
	*/
}

String setDriverPinMode(String driverId, int driverPin, int mode)
{
	/*
	for (int i = 0; i < pinCount; i++)
	{
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if ((pins[i].driverId[j].equals(driverId)) && (pins[i].driverPinIndex[j] == driverPin))
			{
				pinMode(pins[i].GPIONumber, mode);
				pins[i].mode = getPinMode(pins[i].GPIONumber);
				if (pins[i].mode == mode)
				{
					return "";
				}
				else
				{
					return "can't switch pin mode for:" + driverId + " pin:" + String(driverPin) + " to mode=:" + String(mode);
				}
			}
		}

	}
	return "pin not found";
	*/
}

String driverPinWrite(String driverId, int driverPin, int data)
{
	/*
	for (int i = 0; i < pinCount; i++)
	{
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if ((pins[i].driverId[j].equals(driverId)) && (pins[i].driverPinIndex[j] == driverPin))
			{

				pins[i].mode = getPinMode(pins[i].GPIONumber);
				if (pins[i].mode == OUTPUT)
				{
					if (pins[i].pinTypes & ANALOG_O_MASK)
					{
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
						analogWrite(pins[i].GPIONumber, 1024); //TODO Define here 1024
#else	
						analogWrite(pins[i].GPIONumber, data);
#endif
					}
					else
					{
						if (data == 0)
						{
							digitalWrite(pins[i].GPIONumber, LOW);
						}
						else
						{
							digitalWrite(pins[i].GPIONumber, HIGH);
						}
					}
					return "";
				}
				else
				{
					return "can't write pin mode for:" + driverId + " pin:" + String(driverPin) + " to data=:" + String(data);
				}
			}
		}
	}
	return "pin not found";
	*/
}


//Digital or A nalog read - write 
int driverPinRead(String driverId, int driverPinIndex)
{
	/*
	DriverPin * driverPin = getDriverPinByDriverId(driverId, driverPinIndex);
	if (driverPin != nullptr)
	{
		if (getPinMode(driverPin->GPIONumber) == INPUT)
		{
			if (driverPin->driverPinType & ANALOG_I_MASK)
			{
				return analogRead(driverPin->GPIONumber);
			}
			else
			{
				return digitalRead(driverPin->GPIONumber);
			}
		}
	}
	return -1;
	*/
}



String setPinMode(String pinName, int mode)
{
	//перевести пин в режим, проверить режим, если перешел - пустая строка
	//проверить не занят ли пин драйвером, если занят ошибка

//	pinMode(pins[i].GPIONumber, mode);
//	pins[i].mode = getPinMode(pins[i].GPIONumber);

}

String setPinWrite(String pinName, int data)
{
	//проверить не занят ли пин драйвером, если занят ошибка
	//записать данные - аналоговые или цифровые вызывающая сторона не знает, либо в 0 или 1 или int 0..1024 тоже проверить
}

int setPinRead(String pinName, int data)
{

	//проверить не занят ли пин драйвером, если занят ошибка
	//прочитать данные - аналоговые или цифровые вызывающая сторона не знает, либо в 0 или 1 или int 0..1024 тоже проверить

}


#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
int pinNameToValue(String pinName)
{
	if (pinName.equals("D0")) return D0;
	if (pinName.equals("D1")) return D1;
	if (pinName.equals("D2")) return D2;
	if (pinName.equals("D3")) return D3;
	if (pinName.equals("D4")) return D4;
	if (pinName.equals("D5")) return D5;
	if (pinName.equals("D6")) return D6;
	if (pinName.equals("D7")) return D7;
	if (pinName.equals("D8")) return D8;
#ifdef ARDUINO_ESP8266_NODEMCU
	if (pinName.equals("D9")) return D9;
	if (pinName.equals("D10")) return D10;
#endif
	if (pinName.equals("A0")) return A0;
	return -1;
}
#endif



int addPin(Pin pin)
{
	
	pinCount++;

	Pin * newPinsPtr = new Pin[pinCount];
	Pin * tempPinsPtr = pins;
	pins = newPinsPtr;

	for (int i = 0; i < pinCount - 1; i++)
	{
		pins[i] = tempPinsPtr[i];
	}

	pins[pinCount - 1] = pin;
	pins[pinCount - 1].mode = getPinMode(pins[pinCount - 1].GPIONumber);

	if (tempPinsPtr != nullptr)
	{
		delete[] tempPinsPtr;
	}

	return pinCount;
}

//Drivers pins ---------------------------------------------------------------------
int addDriverPin(DriverPin driverPin)
{
	driverPinCount++;

	DriverPin * newDriverPins = new DriverPin[driverPinCount];
	DriverPin * tempDriverPins = driverPins;
	driverPins = newDriverPins;

	for (int j = 0; j < driverPinCount - 1; j++)
	{
		driverPins[j] = tempDriverPins[j];
	}

	driverPins[driverPinCount - 1] = driverPin;

	if (tempDriverPins != nullptr)
	{
		delete[] tempDriverPins;
	}

	return driverPinCount;
}

//заполнить структуру PinDriverInfo для драйвера driverId пина driverPinIndex
bool getDriverPinInfo(String driverId, int driverPinIndex, PinDriverInfo * pinDriverInfo)
{
	if (pinDriverInfo == nullptr) return false;

	DriverPin * driverPin = getDriverPinByDriverId(driverId, driverPinIndex);

	if (driverPin == nullptr)  return false;

	Pin * pin = getPin(driverPin->GPIONumber);

	if (pin == nullptr)  return false;

	pinDriverInfo->name = pin->name;
	pinDriverInfo->GPIONumber = driverPin->GPIONumber;
	pinDriverInfo->driverPinType = driverPin->driverPinType;
	pinDriverInfo->driverPinIndex = driverPin->driverPinIndex;
	pinDriverInfo->driverI2CAddr = driverPin->driverI2CAddr;

	return false;
}


//дать количество пинов задействованных под драйвер 
int getDriverPinsCount(String driverId)
{
	int _count = 0;
	for (int i = 0; i < driverPinCount; i++)
	{
		if (driverPins[i].driverId.equals(driverId))
		{
			_count++;
		}
	}
	return _count;
}

//все драйвера которые используют этот пин
int getDriversByGPIONumber(int GPIONumber, DriverPin * _driverPins)
{
	int _count;
	for (int i = 0; i < driverPinCount; i++)
	{
		if (driverPins[i].GPIONumber == GPIONumber)
		{
			_count++;
		}
	}

	if (_count > 0)
	{
		_driverPins = new DriverPin[_count];
		for (int i = 0; i < driverPinCount; i++)
		{
			if (driverPins[i].GPIONumber == GPIONumber)
			{
				_driverPins[i] = driverPins[i];
			}
		}
	}
	return _count;
}

DriverPin * getDriverPinByDriverId(String  driverId, int driverPinIndex)
{
	int _count = 0;
	for (int i = 0; i < driverPinCount; i++)
	{
		if ((driverPins[i].driverId.equals(driverId)) && (driverPins[i].driverPinIndex == driverPinIndex))
		{
			return &driverPins[i];
		}
	}
	return nullptr;
}




void initPins()
{


	Pin pin;

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0

	pin.name = "D0";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l1";
	addPin(pin);

	pin.name = "D1";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l2";
	addPin(pin);

	pin.name = "D2";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l3";
	addPin(pin);

	pin.name = "D3";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l4";
	addPin(pin);

	pin.name = "D4";
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.location = "l5";
	addPin(pin);


	pin.name = "D5";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l6";
	addPin(pin);

	pin.name = "D6";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l7";
	addPin(pin);


	pin.name = "D7";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l8";
	addPin(pin);

	pin.name = "D8";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l9";
	addPin(pin);

#ifdef ARDUINO_ESP8266_NODEMCU

	pin.name = "D9";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l10";
	addPin(pin);

	pinCount++;
	pin.name = "D10";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.location = "l11";
	addPin(pin);
#endif

	pin.name = "A0";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = ANALOG_I_MASK | ANALOG_O_MASK;
	pin.location = "r1";
	addPin(pin);

#endif


#ifdef ARDUINO_ESP32_RELEASE_1_0_4


	pin.GPIONumber = 23;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D23";
	pin.location = "l1";
	addPin(pin);

	pin.GPIONumber = 22;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | SCL_MASK;
	pin.neighbourPin = 4;
	pin.name = "D22";
	pin.location = "l2";
	addPin(pin);

	pin.GPIONumber = 1;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D1";
	pin.location = "l3";
	addPin(pin);


	pin.GPIONumber = 3;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D3";
	pin.location = "l4";
	addPin(pin);


	pin.GPIONumber = 21;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | SDA_MASK;
	pin.neighbourPin = 1;
	pin.name = "D21";
	pin.location = "l5";
	addPin(pin);


	pin.GPIONumber = 19;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D19";
	pin.location = "l6";
	addPin(pin);


	pin.GPIONumber = 18;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D18";
	pin.location = "l7";
	addPin(pin);


	pin.GPIONumber = 5;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D5";
	pin.location = "l8";
	addPin(pin);


	pin.GPIONumber = 17;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D17";
	pin.location = "l9";
	addPin(pin);


	pin.GPIONumber = 16;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pin.name = "D16";
	pin.location = "l10";
	addPin(pin);


	pin.GPIONumber = 4;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK | ANALOG_O_MASK;
	pin.name = "D4";
	pin.location = "l11";
	addPin(pin);


	pin.GPIONumber = 2;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK | ANALOG_O_MASK;
	pin.name = "D2";
	pin.location = "l12";
	addPin(pin);


	pin.GPIONumber = 15;
	pin.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK | ANALOG_O_MASK;
	pin.name = "D15";
	pin.location = "l13";
	addPin(pin);


	pin.GPIONumber = 16;
	pin.pinTypes = DIGITAL_I_MASK | ANALOG_O_MASK;
	pin.name = "D16";
	pin.location = "l14";
	addPin(pin);


	pin.GPIONumber = 26;
	pin.pinTypes = DIGITAL_I_MASK | ANALOG_I_MASK;
	pin.name = "D26";
	pin.location = "l15";


#endif



	pin.GPIONumber = -1;
	pin.pinTypes = GND_MASK;
	pin.name = "GND";
	pin.location = "l14";
	addPin(pin);

	pin.GPIONumber = -1;
	pin.pinTypes = VCC33_MASK;
	pin.name = "VCC33";
	pin.location = "l15";
	addPin(pin);


	pin.GPIONumber = -1;
	pin.pinTypes = VCC5_MASK;
	pin.name = "VCC5";
	pin.location = "l16";
	addPin(pin);



}


