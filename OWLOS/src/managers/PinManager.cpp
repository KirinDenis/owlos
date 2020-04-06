#include <core_version.h>
#include "PinManager.h"

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include "../libraries/ESP32_AnalogWrite/src/analogWrite.h"
#endif


//String decodePinType[14] = { "NO_MASK", "GP_IO_MASK", "DIGITAL_IO_MASK", "DIGITALI_MASK", "DIGITALO_MASK", "ANALOG_IO_MASK", "ANALOGI_MASK", "ANALOGO_MASK", "SDA_MASK",  "SCL_MASK", "I2CADDR_MASK", "VCC5_MASK",  "VCC33_MASK",  "GND_MASK" };
//String decodePinFamily[3] = { "NO_FAMILY", "I2C_FAMILY", "VCC_FAMILY" };

typedef struct Pin
{
	//Информация о пине, которую он получает в зависимости от типа контроллера
	String name = "";
	int mode = -1;
	uint16_t pinTypes = NO_MASK;
	int8_t GPIONumber = -1;
	int8_t chipNumber = -1;
	int8_t neighbourPin = -1;
	String location = "";

};

typedef struct DriverPin
{
	//Информация о подключенных на данный момент к пину драйверах (в зависимости от поддерживаемых типов к пину можно подключить несколько драйверов)
	int GPIONumber = -1;
	String driverId; // хранит id подключенных к данному пину драйверов 
	uint16_t driverPinType; // хранит типы подключенных к данному пину драйверов 
	int8_t driverPinIndex; //  хранит индекс пина подключенных к данному пину драйверов 
	int driverI2CAddr;    //    хранит порядковый I2CAddr  каждого подключенного  к данному пину драйвера
	int8_t driverI2CAddrPinIndex; // хранит порядковый номер I2CAddr для каждого подключенного  к данному пину драйвера
}

int pinCount = 0;
int driverPinCount = 0;
Pin * pins[] = nullptr;
DriverPin * driverPins[] = nullptr;

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


int addDriverPin(DriverPin driverPin)
{
	driverPinCount++;

	DriverPin * newDriverPins = new Pin[driverPinCount];
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


void initPins()
{


Pin pin;
	
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	
	pins.name = "D0";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l1";
	addPin(pin);

	pins.name = "D1";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l2";
	addPin(pin);

	pins.name = "D2";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l3";
	addPin(pin);

	pins.name = "D3";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l4";
	addPin(pin);

	pins.name = "D4";
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.location = "l5";
	addPin(pin);

	
	pins.name = "D5";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l6";
	addPin(pin);

	pins.name = "D6";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l7";
	addPin(pin);

	
	pins.name = "D7";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l8";
	addPin(pin);

	pins.name = "D8";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l9";
	addPin(pin);

#ifdef ARDUINO_ESP8266_NODEMCU
	
	pins.name = "D9";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l10";
	addPin(pin);

	pinCount++;
	pins.name = "D10";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.location = "l11";
	addPin(pin);
#endif

	pins.name = "A0";
	pins.GPIONumber = pinNameToValue(pins.name);
	pins.pinTypes = ANALOG_I_MASK | ANALOG_O_MASK;
	pins.location = "r1";
	addPin(pin);

#endif


#ifdef ARDUINO_ESP32_RELEASE_1_0_4


	pins.GPIONumber = 23;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D23";
	pins.location = "l1";
	addPin(pin);

	pins.GPIONumber = 22;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | SCL_MASK;
	pins.neighbourPin = 4;
	pins.name = "D22";
	pins.location = "l2";
	addPin(pin);

	pins.GPIONumber = 1;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D1";
	pins.location = "l3";
	addPin(pin);

	
	pins.GPIONumber = 3;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D3";
	pins.location = "l4";
	addPin(pin);

	
	pins.GPIONumber = 21;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | SDA_MASK;
	pins.neighbourPin = 1; 
	pins.name = "D21";
	pins.location = "l5";
	addPin(pin);


	pins.GPIONumber = 19;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D19";
	pins.location = "l6";
	addPin(pin);

	
	pins.GPIONumber = 18;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D18";
	pins.location = "l7";
	addPin(pin);


	pins.GPIONumber = 5;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D5";
	pins.location = "l8";
	addPin(pin);

	
	pins.GPIONumber = 17;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D17";
	pins.location = "l9";
	addPin(pin);


	pins.GPIONumber = 16;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK;
	pins.name = "D16";
	pins.location = "l10";
	addPin(pin);

	
	pins.GPIONumber = 4;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK |ANALOG_O_MASK;
	pins.name = "D4";
	pins.location = "l11";
	addPin(pin);

	
	pins.GPIONumber = 2;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK | ANALOG_O_MASK;
	pins.name = "D2";
	pins.location = "l12";
	addPin(pin);

	
	pins.GPIONumber = 15;
	pins.pinTypes = DIGITAL_I_MASK | DIGITAL_O_MASK | ANALOG_I_MASK | ANALOG_O_MASK;
	pins.name = "D15";
	pins.location = "l13";
	addPin(pin);

	
	pins.GPIONumber = 16;
	pins.pinTypes = DIGITAL_I_MASK | ANALOG_O_MASK;
	pins.name = "D16";
	pins.location = "l14";
	addPin(pin);

	
	pins.GPIONumber = 26;
	pins.pinTypes = DIGITAL_I_MASK | ANALOG_I_MASK;	
	pins.name = "D26";
	pins.location = "l15";


#endif



    pin.GPIONumber = -1;
    pin.pinTypes = GND_MASK ;
    pin.name = "GND";
    pin.location = "l14";
    addPin(pin)

    pin.GPIONumber = -1;
    pin.pinTypes = VCC33_MASK;
    pin.name = "VCC33";
    pin.location = "l15";
	addPin(pin);

	
	pins.GPIONumber = -1;
	pins.pinTypes = VCC5_MASK;
	pins.name = "VCC5";
	pins.location = "l16";
	addPin(pin);



}

Pin getPin()
{
	Pin pin;
	return pin;
}

