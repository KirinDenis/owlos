﻿/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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
#include "../config.h"

#ifdef USE_DRIVERS

#ifndef DRIVERSERVICE_H
#define DRIVERSERVICE_H

#include "../drivers/BaseDriver.h"

#ifdef USE_ACTUATOR_DRIVER
#include "../drivers/ActuatorDriver.h"
#endif

#ifdef USE_SENSOR_DRIVER
#include "../drivers/SensorDriver.h"
#endif

#ifdef USE_DHT_DRIVER
#include "../drivers/DHTDriver.h"
#endif

#ifdef USE_LCD_DRIVER
#include "../drivers/LCDDriver.h"
#endif

#ifdef USE_STEPPER_DRIVER
#include "../drivers/StepperDriver.h"
#endif

#ifdef USE_VALVE_DRIVER
#include "../drivers/ValveDriver.h"
#endif

#ifdef USE_BMP280_DRIVER
#include "../drivers/BMP280Driver.h"
#endif

#ifdef USE_ADS1X15_DRIVER
#include "../drivers/ADS1X15Driver.h"
#endif

#ifdef USE_CCS811_DRIVER
#include "../drivers/CCS811Driver.h"
#endif

void driversInit(String _topic);
void driversBegin(String thingTopic);
void driversLoop();
String driversGetAccessable();
void driversSubscribe();
void driversCallback(String _topic, String _payload);
String driversGetDriversId();
BaseDriver *driversGetDriver(String id);
String driversGetDriverProperty(String id, String property);
String driversSetDriverProperty(String id, String property, String value);
String driversGetDriverProperties(String id);
String driversGetAllDriversProperties();

bool checkPinBusy(int pin);
String driversGetBusyPins();
String driversGetPinsMap();
int driversPinNameToValue(String pinName);
String driversValueToPinName(int pinValue);

bool driversSaveList();
String driversLoadFromConfig();

String driversAdd(int type, String id, String pins);

String driversChangePin(String pinName, String driverId, int driverPinIndex);
String driversDelete(String id);

#endif
#endif