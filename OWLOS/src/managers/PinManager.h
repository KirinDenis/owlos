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
#define PIN_DRIVER_COUNT 20	   
						   
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
	int8_t GPIONumber = -1;
	int8_t chipNumber = -1;
	String location = "";
	String driverId[PIN_DRIVER_COUNT];
	int8_t driverPinType[PIN_DRIVER_COUNT];
	int8_t driverPinIndex[PIN_DRIVER_COUNT];
	int driverI2CAddr[PIN_DRIVER_COUNT];
	int8_t driverI2CAddrPinIndex[PIN_DRIVER_COUNT];
};

//структура для передачи данных о пине в драйвер, так как на одном пине может быть много драйверов
typedef struct PinDriverInfo
{
	String name = "";	
	int8_t GPIONumber = -1;
	int8_t driverPinType;
	int8_t driverPinIndex;
	int driverI2CAddr;
};

void initPins();
String pinDecodeType(int typeCode);
int getDriverPinsCount(String driverId);
bool getDriverPinInfo(String driverId, int driverPinIndex, PinDriverInfo * pinDriverInfo);
String setDriverPin(bool checkOnly, String pinName, String driverId, int driverPinIndex, int pinType);
void freeDriverPin(String driverId, int driverPinIndex);
Pin getPin();