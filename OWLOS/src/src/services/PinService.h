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

#include "../config.h"

#ifdef USE_DRIVERS
#ifndef PINSERVICE_H
#define PINSERVICE_H

//Arduino.h GPIO FUNCTIONS fix for ESP8266 analog input
#define ANALOG_INPUT 0x01

//Маски типов пинов
#define NO_MASK 0x0000		  //без маски
#define DIGITAL_I_MASK 0x0001 //цифровой пин только чтение
#define DIGITAL_O_MASK 0x0002 //цифровой пин только запись
#define ANALOG_I_MASK 0x0004  //аналоговый пин только чтение
#define ANALOG_O_MASK 0x0008  //аналоговый пин только запись
#define SDA_MASK 0x0010		  //пин SDA канала I2C шины
#define SCL_MASK 0x0020		  //пин SCL канала I2C шины
#define I2CADDR_MASK 0x0040	  //используется для привязки I2C адреса подчинённого устройства на шине I2C
#define VCC5_MASK 0x0080	  //5 Вольт пин питания
#define VCC33_MASK 0x0100	  //3.3 Вольта пин питания
#define GND_MASK 0x0200		  //узел цепи, потенциал которого условно принимается за ноль :)
#define RESET_MASK 0x0400	  //пин hardware reset

#define DIGITAL_IO_MASK DIGITAL_I_MASK | DIGITAL_O_MASK //цифровой пин чтения/записи
#define ANALOG_IO_MASK ANALOG_I_MASK | ANALOG_O_MASK	//аналоговый пин чтения/записи

//Расширенные (дополнительные) маски пинов (не хватило 16 бит для описания всех типов пинов)
#define SPI_MOSI_EXTEND_MASK 0x0001 //SPI_MasterOutputSlaveInput пин
#define SPI_MISO_EXTEND_MASK 0x0002 //SPI_MasterInputSlaveOutput пин
#define SPI_SCK_EXTEND_MASK 0x0004	//SPI_Clock пин
#define SPI_SS_EXTEND_MASK 0x0008	//SPI_SlaveSelect пин
#define RST_EXTEND_MASK 0x0010		//UART_RST пин
#define TXD_EXTEND_MASK 0x0020		//UART_TX пин
#define RXD_EXTEND_MASK 0x0040		//UART_RX пин
#define TOUCH_EXTEND_MASK 0x0080	//резистивный пин

#define NO_FAMILY 0	 //пин не имеет семейства
#define I2C_FAMILY 1 //пин входит в семейство I2C
#define VCC_FAMILY 2 //пин входит в семейство пинов питания

//смотрите PinService.cpp для пояснения полей этой записи
struct Pin
{
	String name = "";
	int mode = -1;
	uint16_t pinTypes = NO_MASK;
	uint16_t extenedpintypes = NO_MASK;
	int8_t GPIONumber = -1;
	int8_t chipNumber = -1;
	int8_t neighbourPin = -1;
	String location = "";
};

//смотрите PinService.cpp для пояснения полей этой записи
struct DriverPin
{
	String name = "";
	int GPIONumber = -1;
	String driverId;
	uint16_t driverPinType;
	int8_t driverPinIndex;
	int driverI2CAddr;
	String SDAPinName;
};

//описание функций смотрите в PinService.cpp
String getPinMap();
String getDriverPin();
String decodePinTypes(uint16_t pinType);
String _checkDriverPin(String pinName, uint16_t pinType, String SDAPinName);
String _setDriverPin(String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType, String SDAPinName);
String checkDriverPin(String pinName, uint16_t pinType);
String setDriverPin(String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType);
Pin *getPinByGPIONumber(int GPIONumber);
Pin *getPinByName(String pinName);
Pin *getPinByDriverId(String driverId, int driverPinIndex);
int getPinMode(uint32_t pin);
int getDriverPinsCount(String driverId);
int getDriverPinsByPinType(int pinType, DriverPin **_driverPins);
int getDriverPinsByGPIONumber(int GPIONumber, DriverPin **_driverPins);
int getDriverPinsByDriverId(String GPIONumber, DriverPin **_driverPins);
DriverPin *getDriverPinByDriverId(String driverId, int driverPinIndex);
String setDriverPinMode(String driverId, int driverPinIndex, int mode);
String _driverPinWrite(String driverId, int driverPinIndex, int data, bool pwm);
String driverPinWrite(String driverId, int driverPinIndex, int data);
int driverPinRead(String driverId, int driverPinIndex);
int addDriverPin(DriverPin driverPin);
void deleteDriverPin(String driverId, int driverPinIndex);
int parseI2CAddr(String addrStr);
void initPins();

#endif
#endif