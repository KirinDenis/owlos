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

#include <Arduino.h>

#include "..\Utils\Utils.h"

#include "..\Devices\BaseDevice.h"
#include "..\Devices\DHTDevice.h"
#include "..\Devices\StepperDevice.h"
#include "..\Devices\LightDevice.h"
#include "..\Devices\SmokeDevice.h"
#include "..\Devices\MotionDevice.h"
#include "..\Devices\SensorDevice.h"
#include "..\Devices\ActuatorDevice.h"
#include "..\Devices\LCDDevice.h"
#include "..\Devices\OptoDevice.h"
#include "..\Devices\ValveDevice.h"

void devicesInit(String _topic);
void devicesBegin(String unitTopic);
void devicesLoop();
void devicesSubscribe();
void devicesCallback(String _topic, String _payload);
String devicesGetDevicesId();
BaseDevice* devicesGetDevice(String id);
String devicesGetDeviceProperty(String id, String property);
String devicesSetDeviceProperty(String id, String property, String value);
String devicesGetDeviceProperties(String id);
String devicesGetAllDevicesProperties();

bool checkPinBusy(int pin);
String devicesGetBusyPins();
String devicesGetPinsMap();
int devicesPinNameToValue(String pinName);
String devicesValueToPinName(int pinValue);
bool devicesSaveToConfig(int type, String id, int pin1, int pin2, int pin3, int pin4);
String devicesLoadFromConfig();
String devicesAdd(int type, String id, int pin1, int pin2, int pin3, int pin4);