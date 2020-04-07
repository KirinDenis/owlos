#include <Arduino.h>

#define NO_MASK         0x0000
#define DIGITAL_I_MASK  0x0001  
#define DIGITAL_O_MASK  0x0002
#define ANALOG_I_MASK   0x0004
#define ANALOG_O_MASK   0x0008
#define SDA_MASK        0x0010
#define SCL_MASK        0x0020
#define I2CADDR_MASK    0x0040
#define VCC5_MASK       0x0080
#define VCC33_MASK      0x0100
#define GND_MASK        0x0200  

#define DIGITAL_IO_MASK DIGITAL_I_MASK | DIGITAL_O_MASK

#define NO_FAMILY   0	   
#define I2C_FAMILY  1	   
#define VCC_FAMILY  2	   
						   
//typedef struct PinType	   
//{
//	int family = NO_FAMILY;
//	int type = NO_MASK;
//	int neighbor = -1;
//};

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
	int8_t SDAPinName; 
};


//структура для передачи данных о пине в драйвер, так как на одном пине может быть много драйверов
typedef struct PinDriverInfo
{
	String name = "";	
	int8_t GPIONumber = -1;
	uint16_t driverPinType;
	int8_t driverPinIndex;
	int driverI2CAddr;
};

String getPinMap();
void initPins();

String pinDecodeType(int typeCode);



bool getDriverPinInfo(String driverId, int driverPinIndex, PinDriverInfo * pinDriverInfo);
String checkDriverPin(String pinName, uint16_t pinType, String SDAPinName = "");
String setDriverPin(bool checkOnly, String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType);
String decodePinTypes(uint16_t pinType);

void freeDriverPin(String driverId, int driverPinIndex);
Pin getPin();
int getPinMode(uint32_t pin);

int getDriverPinsCount(String driverId);

int getDriversByPinType(int pinType, DriverPin * _driverPins);
int getDriverPinsByGPIONumber(int GPIONumber, DriverPin * _driverPins);
DriverPin * getDriverPinByDriverId(String  driverId, int driverPinIndex);

String setDriverPinMode(String driverId, int driverPin, int mode);
String driverPinWrite(String driverId, int driverPin, int data);
int driverPinRead(String driverId, int driverPin);

int parseI2CAddr(String addrStr);

