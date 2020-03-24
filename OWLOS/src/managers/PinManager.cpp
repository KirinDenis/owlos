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
		result += "driverid=" + pins[i].driverId + "\n";
		result += "driverpintype=" + String(pins[i].driverPinType) + "\n";
		result += "driverpintypedecoded=" + decodePinType[pins[i].driverPinType] + "\n";
		result += "driverpinindex=" + String(pins[i].driverPinIndex) + "\n";
		result += "drivei2caddr=" + String(pins[i].driveI2CAddr) + "\n";
		for (int j = 0; j < PIN_TYPE_COUNT; j++)
		{
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
		if (pin.pinTypes[i].type == pinType)
		{
			return true;
		}
	}
	return false;
}

int getDriverPinsCount(String driverId)
{
	int count = 0;
	for (int i = 0; i < pinCount; i++)
	{
		if (pins[i].driverId.equals(driverId))
		{
			count++;
		}
	}
	return count;
}

Pin * getDriverPin(String driverId, int driverPinIndex)
{
	for (int i = 0; i < pinCount; i++)
	{
		if ((pins[i].driverId.equals(driverId)) && (pins[i].driverPinIndex == driverPinIndex))
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
			if (pins[i].driverId.length() == 0)
			{
				if (pinTypeSupported(pins[i], pinType))
				{
					if (existsPin != nullptr)
					{
						existsPin->driverId = "";
						existsPin->driverPinIndex = -1;
						pins[i].driverPinType = existsPin->driverPinType;
					}
					else
					{
						pins[i].driverPinType = pinType;
					}
					pins[i].driverId = driverId;
					pins[i].driverPinIndex = driverPinIndex;
					return "";
				}
				else
				{
					return "pin " + pinName + " not conpatable with " + pins[i].driverId + " driver, as pin number " + String(pins[i].driverPinIndex);
				}
			}
			else
			{
				return "pin " + pinName + " is busy by " + pins[i].driverId + " driver, as pin number " + String(pins[i].driverPinIndex);
			}
		}
	}
	return "pin " + pinName + " is not exists";
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
}

Pin getPin()
{
	Pin pin;
	return pin;
}