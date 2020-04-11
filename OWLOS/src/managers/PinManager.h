/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/
//---------------------------------------------------------------------------------------------------------------------------------------
//ВНИМАНИЕ!
//Важно:
//МЫ НЕ ПРОПАГАНДИРУЕМ ГОРЯЧУЮ ЗАМЕНУ УСТРОЙСТВ НА МИКРОКОНТРОЛЛЕРЕ! МЫ ПРОТИВ ЭТОГО!
//ЕСЛИ ВЫ ОШИБЛИС С ИМЕНЕМ ПИНА - выключите ваш микроконтроллер, отключите устройство, включите заново, укажите правильный пин, выключите
//микроконтроллер - подключите устройство. В противном случае вы рискуете "сжечь" пин или микроконтроллер целиком. Особенно это важно для
//пинов работающих в режиме OUTPUT.
//---------------------------------------------------------------------------------------------------------------------------------------

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
#define RESET_MASK      0x0400  

#define DIGITAL_IO_MASK DIGITAL_I_MASK | DIGITAL_O_MASK
#define ANALOG_IO_MASK ANALOG_I_MASK | ANALOG_O_MASK

#define SPI_MOSI_EXTEND_MASK     0x0001
#define SPI_MISO_EXTEND_MASK     0x0002
#define SPI_SCK_EXTEND_MASK      0x0004
#define SPI_SS_EXTEND_MASK       0x0008
#define RST_EXTEND_MASK          0x0010
#define TXD_EXTEND_MASK          0x0020
#define RXD_EXTEND_MASK          0x0040
#define TOUCH_EXTEND_MASK        0x0080

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
	uint16_t extendPinTypes = NO_MASK;
	int8_t GPIONumber = -1;
	int8_t chipNumber = -1;
	int8_t neighbourPin = -1;
	String location = "";

};

typedef struct DriverPin
{
	//Информация о подключенных на данный момент к пину драйверах (в зависимости от поддерживаемых типов к пину можно подключить несколько драйверов)
	String name = "";
	int GPIONumber = -1;
	String driverId; // хранит id подключенных к данному пину драйверов 
	uint16_t driverPinType; // хранит типы подключенных к данному пину драйверов 
	int8_t driverPinIndex; //  хранит индекс пина подключенных к данному пину драйверов 
	int driverI2CAddr;    //    хранит порядковый I2CAddr  каждого подключенного  к данному пину драйвера
	String SDAPinName; 
};


String getPinMap();
void initPins();

String decodePinTypes(uint16_t pinType);


String _checkDriverPin(String pinName, uint16_t pinType, String SDAPinName);
String _setDriverPin(String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType, String SDAPinName);

String checkDriverPin(String pinName, uint16_t pinType);
String setDriverPin(String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType);





Pin * getPinByGPIONumber(int GPIONumber);
Pin * getPinByName(String pinName);
Pin * getPinByDriverId(String  driverId, int driverPinIndex);

int getPinMode(uint32_t pin);

int getDriverPinsCount(String driverId);



int getDriverPinsByPinType(int pinType, DriverPin **_driverPins);
int getDriverPinsByGPIONumber(int GPIONumber, DriverPin **_driverPins);
int getDriverPinsByDriverId(String GPIONumber, DriverPin **_driverPins);

DriverPin * getDriverPinByDriverId(String  driverId, int driverPinIndex);


String setDriverPinMode(String driverId, int driverPinIndex, int mode);
String driverPinWrite(String driverId, int driverPinIndex, int data);
int driverPinRead(String driverId, int driverPinIndex);

int addDriverPin(DriverPin driverPin);
void deleteDriverPin(String driverId, int driverPinIndex);

int parseI2CAddr(String addrStr);

