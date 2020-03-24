#include <Arduino.h>

#define NO_TYPE  0
#define GPIO_TYPE  1
#define DIGITALIO_TYPE  2
#define DIGITALI_TYPE  3
#define DIGITALO_TYPE  4
#define ANALOGIO_TYPE  5
#define ANALOGI_TYPE  6
#define ANALOGO_TYPE  7
#define SDA_TYPE  8
#define SCL_TYPE  9
#define I2CADDR_TYPE  10
#define VCC5_TYPE  11
#define VCC33_TYPE  12
#define GND_TYPE  13



#define NO_FAMILY   0	   
#define I2C_FAMILY  1	   
#define VCC_FAMILY  2	   


						   
#define PIN_TYPE_COUNT 5	   
						   
typedef struct PinType	   
{
	int family = NO_FAMILY;
	int type = NO_TYPE;
	int neighbor = -1;
};

typedef struct Pin
{
	String name = "";
	PinType pinTypes[PIN_TYPE_COUNT];
	int GPIONumber = -1;
	int chipNumber = -1;
	String location = "";
	String driverId = "";
	int driverPinType = NO_TYPE;
	int driverPinIndex = -1;
	int driveI2CAddr = -1;
};

void initPins();
String pinDecodeType(int typeCode);
int getDriverPinsCount(String driverId);
Pin * getDriverPin(String driverId, int driverPinIndex);
String setDriverPin(String pinName, String driverId, int driverPinIndex, int pinType);
Pin getPin();