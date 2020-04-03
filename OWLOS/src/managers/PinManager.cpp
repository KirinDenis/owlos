#include <core_version.h>
#include "PinManager.h"

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include "../libraries/ESP32_AnalogWrite/src/analogWrite.h"
#endif


//String decodePinType[14] = { "NO_MASK", "GP_IO_MASK", "DIGITAL_IO_MASK", "DIGITALI_MASK", "DIGITALO_MASK", "ANALOG_IO_MASK", "ANALOGI_MASK", "ANALOGO_MASK", "SDA_MASK",  "SCL_MASK", "I2CADDR_MASK", "VCC5_MASK",  "VCC33_MASK",  "GND_MASK" };
//String decodePinFamily[3] = { "NO_FAMILY", "I2C_FAMILY", "VCC_FAMILY" };

int pinCount = 0;
Pin pins[40];

String decodePinTypes(uint16_t pinType) {
	
	String decodedPinTypes;

	if (pinType & DIGITAL_I_MASK) { decodedPinTypes += "DIGITAL_I_MASK,"; }

	if (pinType & DIGITAL_O_MASK) { decodedPinTypes += " DIGITAL_O_MASK,"; }

	if (pinType & ANALOG_I_MASK) { decodedPinTypes += " ANALOG_I_MASK,"; }

	if (pinType & ANALOG_O_MASK) { decodedPinTypes += " ANALOG_O_MASK,"; }

	if (pinType & SDA_MASK) { decodedPinTypes += " SDA_MASK,"; }

	if (pinType & SCL_MASK) { decodedPinTypes += " SCL_MASK,"; }

	if (pinType & I2CADDR_MASK) { decodedPinTypes += " SDA_MASK,"; }

	if (pinType & VCC5_MASK) { decodedPinTypes += " VCC5_MASK,"; }

	if (pinType & VCC33_MASK) { decodedPinTypes += " VCC33_MASK,"; }

	if (pinType & GND_MASK) { decodedPinTypes += " GND_MASK,"; }

	if (!(pinType | NO_MASK)) { decodedPinTypes += " NO_MASK,"; }

	if (decodedPinTypes.length() > 0) {

		decodedPinTypes = decodedPinTypes.substring(0, decodedPinTypes.length() - 1);
	}
	else {
		decodedPinTypes += "NO_MASK";
	}

	
	return decodedPinTypes;

}


String pinDecodeType(uint16_t typeCode)
{
	return decodePinTypes(typeCode);
}

String getPinMap()
{
	String result = "";
	for (int i = 0; i < pinCount; i++)
	{
		result += "name:" + pins[i].name + "\n";
		result += "mode=" + String(pins[i].mode) + "\n";
		result += "pintypes=" + String(pins[i].pinTypes) + "\n";
		result += "decodedpintypes=" + decodePinTypes( pins[i].pinTypes ) + "\n";
		result += "gpio=" + String(pins[i].GPIONumber) + "\n";
		result += "chipnumber=" + String(pins[i].chipNumber) + "\n";
		result += "neighbourpin=" + String(pins[i].neighbourPin) + "\n";
		result += "location=" + pins[i].location + "\n";
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if (pins[i].driverId[j].length() != 0)
			{
				result += "driverid:" + pins[i].driverId[j] + "\n";
				result += "driverpintype=" + String(pins[i].driverPinType[j]) + "\n";
				result += "driverpintypedecoded=" + decodePinTypes(pins[i].driverPinType[j]) + "\n";
				result += "driverpinindex=" + String(pins[i].driverPinIndex[j]) + "\n";
				result += "drivei2caddr=" + String(pins[i].driverI2CAddr[j]) + "\n";
			}
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
}

bool pinTypeSupported(Pin pin, uint16_t pinType)
{
	return (pin.pinTypes & pinType);
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

int getDriverPinsCount(String driverId)
{
	Serial.println("DRIVER COUNT");
	Serial.println(driverId);
	int count = 0;
	for (int i = 0; i < pinCount; i++)
	{
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if (pins[i].driverId[j].equals(driverId))
			{
				count++;
				if (pins[i].driverPinType[j] & SDA_MASK)
				{
					count++;
				}

				break;
			}
		}
	}
	return count;
}

bool getDriverPinInfo(String driverId, int driverPinIndex, PinDriverInfo * pinDriverInfo)
{
	Serial.println("GET PIN INFO " + driverId);
	if (pinDriverInfo == nullptr) return false;
	for (int i = 0; i < pinCount; i++)
	{
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if ((pins[i].driverId[j].equals(driverId)) && (pins[i].driverPinIndex[j] == driverPinIndex))
			{
				pinDriverInfo->name = pins[i].name;
				pinDriverInfo->GPIONumber = pins[i].GPIONumber;
				///получение типа пина от для передачи данных о пине в драйвер
				pinDriverInfo->driverPinType = pins[i].driverPinType[j];
				pinDriverInfo->driverPinIndex = pins[i].driverPinIndex[j];
				pinDriverInfo->driverI2CAddr = pins[i].driverI2CAddr[j];

				return true;
			}

		
			///если пин поддерживает тип SDA  
			if (pins[i].pinTypes & SDA_MASK)
			{
				if ((pins[i].driverId[j].equals(driverId)) && (pins[i].driverI2CAddrPinIndex[j] == driverPinIndex))
				{
						pinDriverInfo->name = "ADDR0x" + String(pins[i].driverI2CAddr[j], HEX);
						pinDriverInfo->GPIONumber = -1;
						pinDriverInfo->driverPinType = I2CADDR_MASK;
						pinDriverInfo->driverPinIndex = pins[i].driverI2CAddrPinIndex[j];
						pinDriverInfo->driverI2CAddr = pins[i].driverI2CAddr[j];

						return true;
				}
			}
			
		}

	}
	return false;
}

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

String setDriverI2CAddr(bool checkOnly, String pinName, String driverId, int driverPinIndex)
{
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
		if ((SDA_PinDriverInfo.driverPinType & SDA_MASK)!= SDA_MASK)
		{
			return "SDA pin not set for " + driverId + " driver, set SDA pin first (before set I2C address)";
		}

		if ((SCL_PinDriverInfo.driverPinType & SCL_MASK)!= SCL_MASK)
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
}


String setDriverPin(bool checkOnly, String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType)
{
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
							
							if ( ((pins[i].driverPinType[j] & pinType) == 0)  &&  (pins[i].driverPinType[j] != 0) )
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
}

void freeDriverPin(String driverId, int driverPinIndex)
{
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
}

//https://github.com/arduino/Arduino/issues/4606
int getPinMode(uint32_t pin)
{

	if ((pin >= NUM_DIGITAL_PINS) || (pin < 0)) return (-1);

	uint32_t bit = digitalPinToBitMask(pin);
	uint32_t port = digitalPinToPort(pin);
	volatile uint32_t *reg = portModeRegister(port);
	if (*reg & bit) return (OUTPUT);

	volatile uint32_t *out = portOutputRegister(port);
	return ((*out & bit) ? INPUT_PULLUP : INPUT);
}

String setDriverPinMode(String driverId, int driverPin, int mode)
{
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
}

String driverPinWrite(String driverId, int driverPin, int data)
{
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
}

int driverPinRead(String driverId, int driverPin)
{
	for (int i = 0; i < pinCount; i++)
	{
		for (int j = 0; j < PIN_DRIVER_COUNT; j++)
		{
			if ((pins[i].driverId[j].equals(driverId)) && (pins[i].driverPinIndex[j] == driverPin))
			{

				pins[i].mode = getPinMode(pins[i].GPIONumber);
				if (pins[i].mode == INPUT)
				{
					if (pins[i].pinTypes & ANALOG_I_MASK)
					{
						return analogRead(pins[i].GPIONumber);
					}
					else
					{
						return digitalRead(pins[i].GPIONumber);
					}
				}
			}
		}
	}
	return 0;
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


void initPins()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	pinCount = 0;
	pins[pinCount].name = "D0";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l1";

	pinCount++;
	pins[pinCount].name = "D1";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l2";
/*
	pinCount++;
	pins[pinCount].name = "D2";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//	pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l3";

	pinCount++;
	pins[pinCount].name = "D3";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l4";

	pinCount++;
	pins[pinCount].name = "D4";
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l5";

	pinCount++;
	pins[pinCount].name = "D5";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l6";

	pinCount++;
	pins[pinCount].name = "D6";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l7";

	pinCount++;
	pins[pinCount].name = "D7";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l8";

	pinCount++;
	pins[pinCount].name = "D8";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l9";
#ifdef ARDUINO_ESP8266_NODEMCU
	pinCount++;
	pins[pinCount].name = "D9";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l10";

	pinCount++;
	pins[pinCount].name = "D10";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].location = "l11";
#endif

	pinCount++;
	pins[pinCount].name = "A0";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes = ANALOG_I_MASK | ANALOG_O_MASK;
	//pins[pinCount].pinTypes[0].type = ANALOG_IO_MASK;
	pins[pinCount].location = "r1";
*/
#endif


#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	pinCount = 0;
	pins[pinCount].GPIONumber = 23;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D23";
	pins[pinCount].location = "l1";

	pinCount++;
	pins[pinCount].GPIONumber = 22;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | SCL_MASK;
	/*pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	//pins[pinCount].pinTypes[1].family = I2C_FAMILY;
	//pins[pinCount].pinTypes[1].type = SCL_MASK;
	pins[pinCount].pinTypes[1].neighbor = 4; */
	pins[pinCount].neighbourPin = 4;
	pins[pinCount].name = "D22";
	pins[pinCount].location = "l2";

	pinCount++;
	pins[pinCount].GPIONumber = 1;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D1";
	pins[pinCount].location = "l3";

	pinCount++;
	pins[pinCount].GPIONumber = 3;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D3";
	pins[pinCount].location = "l4";

	pinCount++;
	pins[pinCount].GPIONumber = 21;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | SDA_MASK;
	/*pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].pinTypes[1].family = I2C_FAMILY;
	pins[pinCount].pinTypes[1].type = SDA_MASK;
	pins[pinCount].pinTypes[1].neighbor = 1;
	*/
	pins[pinCount].neighbourPin = 1; 
	pins[pinCount].name = "D21";
	pins[pinCount].location = "l5";

	pinCount++;
	pins[pinCount].GPIONumber = 19;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D19";
	pins[pinCount].location = "l6";

	pinCount++;
	pins[pinCount].GPIONumber = 18;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D18";
	pins[pinCount].location = "l7";

	pinCount++;
	pins[pinCount].GPIONumber = 5;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D5";
	pins[pinCount].location = "l8";

	pinCount++;
	pins[pinCount].GPIONumber = 17;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D17";
	pins[pinCount].location = "l9";

	pinCount++;
	pins[pinCount].GPIONumber = 16;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	//pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].name = "D16";
	pins[pinCount].location = "l10";

	pinCount++;
	pins[pinCount].GPIONumber = 4;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK |ANALOG_O_MASK;
	/*pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].pinTypes[1].type = ANALOG_IO_MASK;*/
	pins[pinCount].name = "D4";
	pins[pinCount].location = "l11";

	pinCount++;
	pins[pinCount].GPIONumber = 2;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK | ANALOG_O_MASK;
	/*pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].pinTypes[1].type = ANALOG_IO_MASK;*/
	pins[pinCount].name = "D2";
	pins[pinCount].location = "l12";

	pinCount++;
	pins[pinCount].GPIONumber = 15;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK | ANALOG_O_MASK;
	/*pins[pinCount].pinTypes[0].type = DIGITAL_IO_MASK;
	pins[pinCount].pinTypes[1].type = ANALOG_IO_MASK;*/
	pins[pinCount].name = "D15";
	pins[pinCount].location = "l13";

	pinCount++;
	pins[pinCount].GPIONumber = 16;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | ANALOG_O_MASK;
	pins[pinCount].name = "D16";
	pins[pinCount].location = "l14";

	pinCount++;
	pins[pinCount].GPIONumber = 26;
	pins[pinCount].pinTypes = DIGITAL_I_MASK | ANALOG_I_MASK;	
	pins[pinCount].name = "D26";
	pins[pinCount].location = "l15";


#endif

	pinCount++;
	pins[pinCount].GPIONumber = -1;
	pins[pinCount].pinTypes = GND_MASK ;
	//pins[pinCount].pinTypes[0].type = GND_MASK;
	pins[pinCount].name = "GND";
	pins[pinCount].location = "l14";

	pinCount++;
	pins[pinCount].GPIONumber = -1;
	pins[pinCount].pinTypes = VCC33_MASK;
	//pins[pinCount].pinTypes[0].type = VCC33_MASK;
	pins[pinCount].name = "VCC33";
	pins[pinCount].location = "l15";

	pinCount++;
	pins[pinCount].GPIONumber = -1;
	pins[pinCount].pinTypes = VCC5_MASK;
	//pins[pinCount].pinTypes[0].type = VCC5_MASK;
	pins[pinCount].name = "VCC5";
	pins[pinCount].location = "l16";


	pinCount++;

	for (int i = 0; i < pinCount; i++)
	{
		pins[i].mode = getPinMode(pins[i].GPIONumber);
	}
}

Pin getPin()
{
	Pin pin;
	return pin;
}

