#include <core_version.h>
#include "PinManager.h"


String decodePinType[14] = { "NO_TYPE", "GPIO_TYPE", "DIGITALIO_TYPE", "DIGITALI_TYPE", "DIGITALO_TYPE", "ANALOGIO_TYPE", "ANALOGI_TYPE", "ANALOGO_TYPE", "SDA_TYPE",  "SCL_TYPE", "I2CADDR_TYPE", "VCC5_TYPE",  "VCC33_TYPE",  "GND_TYPE" };
String decodePinFamily[3] = { "NO_FAMILY", "I2C_FAMILY", "VCC_FAMILY" };

int pinCount = 0;
Pin pins[40];

String pinDecodeType(int typeCode)
{
	return decodePinType[typeCode];
}

String getPinMap()
{
	String result = "";
	for (int i = 0; i < pinCount; i++)
	{
		result += "name:" + pins[i].name + "\n";
		result += "gpio=" + String(pins[i].GPIONumber) + "\n";
		result += "chipnumber=" + String(pins[i].chipNumber) + "\n";
		result += "location=" + pins[i].location + "\n";
		result += "driverid=" + pins[i].driverId[0] + "\n";
		result += "driverpintype=" + String(pins[i].driverPinType[0]) + "\n";
		result += "driverpintypedecoded=" + decodePinType[pins[i].driverPinType[0]] + "\n";
		result += "driverpinindex=" + String(pins[i].driverPinIndex[0]) + "\n";
		result += "drivei2caddr=" + String(pins[i].driveI2CAddr[0]) + "\n";
		for (int j = 0; j < PIN_TYPE_COUNT; j++)
		{
			if (pins[i].pinTypes[j].type == NO_TYPE)
			{
				break;
			}
			result += "role:" + String(j) + "\n";
			result += "family=" + String(pins[i].pinTypes[j].family) + "\n";
			result += "familydecode=" + decodePinFamily[pins[i].pinTypes[j].family] + "\n";
			result += "type=" + String(pins[i].pinTypes[j].type) + "\n";
			result += "typedecode=" + decodePinType[pins[i].pinTypes[j].type] + "\n";
			result += "neighbor=" + String(pins[i].pinTypes[j].neighbor) + "\n";
		}

	}
	return result;
}

bool pinTypeSupported(Pin pin, int pinType)
{
	for (int i = 0; i < PIN_TYPE_COUNT; i++)
	{
		//если тип пина I/O или I и требуемый драйвером тип I/O или I
		if (((pin.pinTypes[i].type == DIGITALIO_TYPE) || (pin.pinTypes[i].type == DIGITALI_TYPE)) && ((pinType == DIGITALIO_TYPE) || (pinType == DIGITALI_TYPE)))
		{
			return true;
		}
		else //если тип пина I/O или O и требуемый драйвером тип I/O или O
			if (((pin.pinTypes[i].type == DIGITALIO_TYPE) || (pin.pinTypes[i].type == DIGITALO_TYPE)) && ((pinType == DIGITALIO_TYPE) || (pinType == DIGITALO_TYPE)))
			{
				return true;
			}
			else
				if (pin.pinTypes[i].type == pinType)
				{
					return true;
				}
	}
	return false;
}

int getDriverPinsCount(String driverId)
{
	Serial.println("DRIVER COUNT");
	Serial.println(driverId);
	int count = 0;
	for (int i = 0; i < pinCount; i++)
	{
		Serial.println(pins[i].driverId[0]);
		if (pins[i].driverId[0].indexOf(driverId + ";") >= 0)
		{
			Serial.println("DRIVER COUNT++");
			count++;
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
		Serial.println("PIN " + pins[i].driverId[0]);
		if ((pins[i].driverId[0].indexOf(driverId + ";") >= 0) && (pins[i].driverPinIndex[0] == driverPinIndex))		
		{
			Serial.println("FOUND " + pins[i].driverId[0]);
			
			pinDriverInfo->name = pins[i].name;
				pinDriverInfo->GPIONumber = pins[i].GPIONumber;
				pinDriverInfo->driverPinType = pins[i].driverPinType[0];
				pinDriverInfo->driverPinIndex = pins[i].driverPinIndex[0];
				pinDriverInfo->driveI2CAddr = pins[i].driveI2CAddr[0];
			
			return true;
		}
	}
	return false;
}

Pin * getDriverPin(String driverId, int driverPinIndex)
{
	for (int i = 0; i < pinCount; i++)
	{
		if ((pins[i].driverId[0].indexOf(driverId + ";") >= 0) && (pins[i].driverPinIndex[0] == driverPinIndex))
		{
			return &pins[i];
		}
	}
	return nullptr;
}


String setDriverPin(String pinName, String driverId, int driverPinIndex, int pinType)
{
	//if exists 
	Pin * existsPin = getDriverPin(driverId, driverPinIndex);

	for (int i = 0; i < pinCount; i++)
	{
		if (pins[i].name.equals(pinName))
		{
			if (pinTypeSupported(pins[i], pinType))
			{
				//на цифровом пине может быть только один драйвер
				if ((pinType == DIGITALIO_TYPE) || (pinType == DIGITALI_TYPE) || (pinType == DIGITALO_TYPE))
				{
					if ((pins[i].driverId[0].length() == 0))
					{
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

						pins[i].driverId[0] += driverId + ";";
						pins[i].driverPinIndex[0] = driverPinIndex;
						return "";
					}
					else
					{
						return "pin " + pinName + " is busy by " + pins[i].driverId[0] + " driver, as pin number " + String(pins[i].driverPinIndex[0]) + " (one digital device can use one digital pin)";
					}
				}
				else

					if ((pins[i].driverId[0].length() == 0) || (pinType == GND_TYPE) || (pinType == VCC33_TYPE) || (pinType == VCC5_TYPE))
					{
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

						pins[i].driverId[0] += driverId + ";";
						pins[i].driverPinIndex[0] = driverPinIndex;
						return "";
					}
					else
					{

						return "pin " + pinName + " is busy by " + pins[i].driverId[0] + " driver, as pin number " + String(pins[i].driverPinIndex[0]);
					}
			}
			else
			{
				return "pin " + pinName + " not conpatable with " + pins[i].driverId[0] + " driver, as pin number " + String(pins[i].driverPinIndex[0]);
			}
		}
	}
	return "pin " + pinName + " is not exists";
}

void freeDriverPin(String driverId, int driverPinIndex)
{
	for (int i = 0; i < pinCount; i++)
	{
		if ((pins[i].driverId[0].indexOf(driverId + ";") >= 0) && (pins[i].driverPinIndex[0] == driverPinIndex))
		{
			pins[i].driverId[0] = "";
			pins[i].driverPinIndex[0] = -1;
		}
	}
	return;
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
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l1";

	pinCount++;
	pins[pinCount].name = "D1";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l2";

	pinCount++;
	pins[pinCount].name = "D2";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l3";

	pinCount++;
	pins[pinCount].name = "D3";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l4";

	pinCount++;
	pins[pinCount].name = "D4";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l5";

	pinCount++;
	pins[pinCount].name = "D5";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l6";

	pinCount++;
	pins[pinCount].name = "D6";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l7";

	pinCount++;
	pins[pinCount].name = "D7";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l8";

	pinCount++;
	pins[pinCount].name = "D8";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l9";
#ifdef ARDUINO_ESP8266_NODEMCU
	pinCount++;
	pins[pinCount].name = "D9";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l10";

	pinCount++;
	pins[pinCount].name = "D10";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].location = "l11";
#endif

	pinCount++;
	pins[pinCount].name = "A0";
	pins[pinCount].GPIONumber = pinNameToValue(pins[pinCount].name);
	pins[pinCount].pinTypes[0].type = ANALOGIO_TYPE;
	pins[pinCount].location = "r1";
#endif


#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	pinCount = 0;
	pins[pinCount].GPIONumber = 23;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D23";
	pins[pinCount].location = "l1";

	pinCount++;
	pins[pinCount].GPIONumber = 22;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].pinTypes[1].family = I2C_FAMILY;
	pins[pinCount].pinTypes[1].type = SCL_TYPE;
	pins[pinCount].pinTypes[1].neighbor = 4;
	pins[pinCount].name = "D22";
	pins[pinCount].location = "l2";

	pinCount++;
	pins[pinCount].GPIONumber = 1;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D1";
	pins[pinCount].location = "l3";

	pinCount++;
	pins[pinCount].GPIONumber = 3;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D3";
	pins[pinCount].location = "l4";

	pinCount++;
	pins[pinCount].GPIONumber = 21;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].pinTypes[1].family = I2C_FAMILY;
	pins[pinCount].pinTypes[1].type = SDA_TYPE;
	pins[pinCount].pinTypes[1].neighbor = 1;
	pins[pinCount].name = "D21";
	pins[pinCount].location = "l5";

	pinCount++;
	pins[pinCount].GPIONumber = 19;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D19";
	pins[pinCount].location = "l6";

	pinCount++;
	pins[pinCount].GPIONumber = 18;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D18";
	pins[pinCount].location = "l7";

	pinCount++;
	pins[pinCount].GPIONumber = 5;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D5";
	pins[pinCount].location = "l8";

	pinCount++;
	pins[pinCount].GPIONumber = 17;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D17";
	pins[pinCount].location = "l9";

	pinCount++;
	pins[pinCount].GPIONumber = 16;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].name = "D16";
	pins[pinCount].location = "l10";

	pinCount++;
	pins[pinCount].GPIONumber = 4;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].pinTypes[1].type = ANALOGIO_TYPE;
	pins[pinCount].name = "D4";
	pins[pinCount].location = "l11";

	pinCount++;
	pins[pinCount].GPIONumber = 2;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].pinTypes[1].type = ANALOGIO_TYPE;
	pins[pinCount].name = "D2";
	pins[pinCount].location = "l12";

	pinCount++;
	pins[pinCount].GPIONumber = 15;
	pins[pinCount].pinTypes[0].type = DIGITALIO_TYPE;
	pins[pinCount].pinTypes[1].type = ANALOGIO_TYPE;
	pins[pinCount].name = "D15";
	pins[pinCount].location = "l13";

#endif

	pinCount++;
	pins[pinCount].GPIONumber = -1;
	pins[pinCount].pinTypes[0].type = GND_TYPE;
	pins[pinCount].name = "GND";
	pins[pinCount].location = "l14";

	pinCount++;
	pins[pinCount].GPIONumber = -1;
	pins[pinCount].pinTypes[0].type = VCC33_TYPE;
	pins[pinCount].name = "VCC33";
	pins[pinCount].location = "l15";

	pinCount++;
	pins[pinCount].GPIONumber = -1;
	pins[pinCount].pinTypes[0].type = VCC5_TYPE;
	pins[pinCount].name = "VCC5";
	pins[pinCount].location = "l16";


	pinCount++;
	}

Pin getPin()
{
	Pin pin;
	return pin;
}