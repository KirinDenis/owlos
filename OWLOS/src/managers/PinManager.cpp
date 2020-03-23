#include "PinManager.h"




Pin pins[40];

void initPins()
{
//#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	int pinCount = 0;
	pins[pinCount].GPIONumber = 23;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D23";
	pins[pinCount].location = "l1";

	pinCount++;
	pins[pinCount].GPIONumber = 22;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].pinRoles[1].family = I2C_FAMILY;
	pins[pinCount].pinRoles[1].type = SCL_TYPE;
	pins[pinCount].pinRoles[1].neighbor = 4;
	pins[pinCount].name = "D22";
	pins[pinCount].location = "l2";

	pinCount++;
	pins[pinCount].GPIONumber = 1;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D1";
	pins[pinCount].location = "l3";

	pinCount++;
	pins[pinCount].GPIONumber = 3;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D3";
	pins[pinCount].location = "l4";

	pinCount++;
	pins[pinCount].GPIONumber = 21;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].pinRoles[1].family = I2C_FAMILY;
	pins[pinCount].pinRoles[1].type = SDA_TYPE;
	pins[pinCount].pinRoles[1].neighbor = 1;
	pins[pinCount].name = "D21";
	pins[pinCount].location = "l5";

	pinCount++;
	pins[pinCount].GPIONumber = 19;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D19";
	pins[pinCount].location = "l6";

	pinCount++;
	pins[pinCount].GPIONumber = 18;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D18";
	pins[pinCount].location = "l7";

	pinCount++;
	pins[pinCount].GPIONumber = 5;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D5";
	pins[pinCount].location = "l8";

	pinCount++;
	pins[pinCount].GPIONumber = 17;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D17";
	pins[pinCount].location = "l9";

	pinCount++;
	pins[pinCount].GPIONumber = 16;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].name = "D16";
	pins[pinCount].location = "l10";

	pinCount++;
	pins[pinCount].GPIONumber = 4;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].pinRoles[1].type = ANALOG_TYPE;
	pins[pinCount].name = "D4";
	pins[pinCount].location = "l11";

	pinCount++;
	pins[pinCount].GPIONumber = 2;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].pinRoles[1].type = ANALOG_TYPE;
	pins[pinCount].name = "D2";
	pins[pinCount].location = "l12";

	pinCount++;
	pins[pinCount].GPIONumber = 15;
	pins[pinCount].pinRoles[0].type = DIGITAL_TYPE;
	pins[pinCount].pinRoles[1].type = ANALOG_TYPE;
	pins[pinCount].name = "D15";
	pins[pinCount].location = "l13";

//#endif

}

Pin getPin()
{
	Pin pin;
	return pin;
}