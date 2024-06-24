/******************************************************************************
SparkFunCCS811.h
CCS811 Arduino library

Marshall Taylor @ SparkFun Electronics
Nathan Seidle @ SparkFun Electronics

April 4, 2017

https://github.com/sparkfun/CCS811_Air_Quality_Breakout
https://github.com/sparkfun/SparkFun_CCS811_Arduino_Library

Resources:
Uses Wire.h for i2c operation

Development environment specifics:
Arduino IDE 1.8.1

This code is released under the [MIT License](http://opensource.org/licenses/MIT).

Please review the LICENSE.md file included with this example. If you have any questions 
or concerns with licensing, please contact techsupport@sparkfun.com.

Distributed as-is; no warranty is given.
******************************************************************************/

#ifndef __CCS811_H__
#define __CCS811_H__

#include "stdint.h"
#include <Wire.h>

//Register addresses
#define CSS811_STATUS 0x00
#define CSS811_MEAS_MODE 0x01
#define CSS811_ALG_RESULT_DATA 0x02
#define CSS811_RAW_DATA 0x03
#define CSS811_ENV_DATA 0x05
#define CSS811_NTC 0x06 //NTC compensation no longer supported
#define CSS811_THRESHOLDS 0x10
#define CSS811_BASELINE 0x11
#define CSS811_HW_ID 0x20
#define CSS811_HW_VERSION 0x21
#define CSS811_FW_BOOT_VERSION 0x23
#define CSS811_FW_APP_VERSION 0x24
#define CSS811_ERROR_ID 0xE0
#define CSS811_APP_START 0xF4
#define CSS811_SW_RESET 0xFF

//This is the core operational class of the driver.
//  CCS811Core contains only read and write operations towards the sensor.
//  To use the higher level functions, use the class CCS811 which inherits
//  this class.

class CCS811Core
{
public:
	// Return values
	typedef enum
	{
		CCS811_Stat_SUCCESS,
		CCS811_Stat_ID_ERROR,
		CCS811_Stat_I2C_ERROR,
		CCS811_Stat_INTERNAL_ERROR,
		CCS811_Stat_NUM,
		CCS811_Stat_GENERIC_ERROR
		//...
	} CCS811_Status_e;

	CCS811Core(uint8_t);
	~CCS811Core() = default;

	CCS811_Status_e beginCore(TwoWire &wirePort);

	//***Reading functions***//

	//readRegister reads one 8-bit register
	CCS811_Status_e readRegister(uint8_t offset, uint8_t *outputPointer);
	//multiReadRegister takes a uint8 array address as input and performs
	//  a number of consecutive reads
	CCS811_Status_e multiReadRegister(uint8_t offset, uint8_t *outputPointer, uint8_t length);

	//***Writing functions***//

	//Writes an 8-bit byte;
	CCS811_Status_e writeRegister(uint8_t offset, uint8_t dataToWrite);
	//multiWriteRegister takes a uint8 array address as input and performs
	//  a number of consecutive writes
	CCS811_Status_e multiWriteRegister(uint8_t offset, uint8_t *inputPointer, uint8_t length);

protected:
	//Variables
	TwoWire *_i2cPort; //The generic connection to user's chosen I2C hardware
	uint8_t I2CAddress;
};

//This is the highest level class of the driver.
//
//  class CCS811 inherits the CCS811Core and makes use of the beginCore()
//method through its own begin() method.  It also contains user settings/values.

class CCS811 : public CCS811Core
{
public:
	CCS811(uint8_t);

	//Call to check for errors, start app, and set default mode 1
	bool begin(TwoWire &wirePort = Wire);							  //Use the Wire hardware by default
	CCS811_Status_e beginWithStatus(TwoWire &wirePort = Wire);		  //Use the Wire hardware by default
	const char *statusString(CCS811_Status_e stat = CCS811_Stat_NUM); // Returns a human-readable status message. Defaults to status member, but prints string for supplied status if supplied

	CCS811_Status_e readAlgorithmResults(void);
	bool checkForStatusError(void);
	bool dataAvailable(void);
	bool appValid(void);
	uint8_t getErrorRegister(void);
	uint16_t getBaseline(void);
	CCS811_Status_e setBaseline(uint16_t);
	CCS811_Status_e enableInterrupts(void);
	CCS811_Status_e disableInterrupts(void);
	CCS811_Status_e setDriveMode(uint8_t mode);
	CCS811_Status_e setEnvironmentalData(float relativeHumidity, float temperature);
	void setRefResistance(float); //Unsupported feature. Refer to CPP file for more information.
	CCS811_Status_e readNTC(void); //Unsupported feature. Refer to CPP file for more information.
	uint16_t getTVOC(void);
	uint16_t getCO2(void);
	float getResistance(void); //Unsupported feature. Refer to CPP file for more information.
	float getTemperature(void); //Unsupported feature. Refer to CPP file for more information.

private:
	//These are the air quality values obtained from the sensor
	float refResistance; //Unsupported feature. Refer to CPP file for more information.
	float resistance; //Unsupported feature. Refer to CPP file for more information.
	uint16_t tVOC;
	uint16_t CO2;
	uint16_t vrefCounts = 0;
	uint16_t ntcCounts = 0;
	float temperature;
};

#endif // End of definition check
