#include <Arduino.h>

#define NO_TYPE  -1
#define GPIO_TYPE  1
#define DIGITAL_TYPE  2
#define ANALOG_TYPE  3
#define SDA_TYPE  4
#define SCL_TYPE  5
#define VCC5  6
#define VCC33  7
#define GND  8

#define NO_FAMILY  -1
#define I2C_FAMILY  2
#define VCC_FAMILY  3

#define ROLE_COUNT 5

typedef struct PinType
{
	int family = NO_FAMILY;
	int type = NO_TYPE;
	int neighbor = -1;
};

typedef struct Pin
{
	PinType pinTypes[ROLE_COUNT];
	int GPIONumber = -1;
	int chipNumber = -1;
	bool io = true;
	String name = "";
	String location = "";
	String driverId = "";
	int driverPinType = -1;
	int driverPinIndex = -1;
	int driveI2CAddr = -1;
};

void initPins();
int getDriverPinsCount(String driverId);
Pin * getDriverPin(String driverId, int driverPinIndex);
String setDriverPin(String pinName, String driverId, int driverPinIndex, int pinType);
Pin getPin();