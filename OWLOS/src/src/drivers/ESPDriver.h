/* ----------------------------------------------------------------------------
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

#ifdef USE_ESP_DRIVER
#ifndef ESP_DRIVER_H
#define ESP_DRIVER_H

#include "WifiDriver.h"
#include "NetworkDriver.h"


#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <rom/rtc.h>
#endif

#define DEFAULT_ZERO_VALUE 0x00
#define DEFAULT_EMPTY_STR_VALUE ""

bool thingInit();

String thingGetAllProperties();

void thingSubscribe();

String thingOnMessage(const String &route, const String &_payload, int8_t transportMask);

String thingGetUnitId();
bool thingSetUnitId(String _thingid);

String thingGetTopic();
bool thingSetTopic(String _topic);

String thingGetFirmwareVersion();
bool thingSetFirmwareVersion(String _firmwareversion);

int thingGetFirmwareBuildNumber();
bool thingSetFirmwareBuildNumber(int _firmwarebuildnumber);


/**/
String thingGetESPResetInfo();
bool thingSetESPResetInfo(String _espresetinfo);

int thingGetESPReset();
bool thingSetESPReset(int _espreset);

int thingGetESPRestart();
bool thingSetESPRestart(int _esprestart);

uint16_t thingGetESPVcc();
bool thingSetESPVcc(int _espvcc);

uint32_t thingGetESPChipId();
bool thingSetESPChipId(int _espchipid);

uint32_t thingGetESPFreeHeap();
bool thingSetESPFreeHeap(int _espfreeheap);

uint16_t thingGetESPMaxFreeBlockSize();
bool thingSetESPMaxFreeBlockSize(int _espmaxfreeblocksize);

uint8_t thingGetESPHeapFragmentation();
bool thingSetESPHeapFragmentation(int _espheapfragmentation);

String thingGetESPSdkVersion();
bool thingSetESPSdkVersion(String _espsdkversion);

String thingGetESPCoreVersion();
bool thingSetESPCoreVersion(String _espcoreversion);

String thingGetESPFullVersion();
bool thingSetESPFullVersion(String _espfullversion);

uint8_t thingGetESPBootVersion();
bool thingSetESPBootVersion(int _espbootversion);

uint8_t thingGetESPBootMode();
bool thingSetESPBootMode(int _espbootmode);

uint8_t thingGetESPCpuFreqMHz();
bool thingSetESPCpuFreqMHz(int _espcpufreqmhz);

uint32_t thingGetESPFlashChipId();
bool thingSetESPFlashChipId(int _espflashchipid);

uint8_t thingGetESPFlashChipVendorId();
bool thingSetESPFlashChipVendorId(int _espflashchipvendorid);

uint32_t thingGetESPFlashChipRealSize();
bool thingSetESPFlashChipRealSize(int _espflashchiprealsize);

uint32_t thingGetESPFlashChipSize();
bool thingSetESPFlashChipSize(int _espflashchipsize);

uint32_t thingGetESPFlashChipSpeed();
bool thingSetESPFlashChipSpeed(int _espflashchipspeed);

uint32_t thingGetESPSketchSize();
bool thingSetESPSketchSize(int _espsketchsize);

uint32_t thingGetESPFreeSketchSpace();
bool thingSetESPFreeSketchSpace(int _espfreesketchspace);

FlashMode_t thingGetESPFlashChipMode();
bool thingSetESPFlashChipMode(int _espflashchipmode);

String thingGetESPSketchMD5();
bool thingSetESPSketchMD5(String _espsketchmd5);

String thingGetESPResetReason();
bool thingSetESPResetReason(String _espresetreason);

uint32_t thingGetESPMagicFlashChipSize(uint8_t byte);
bool thingSetESPMagicFlashChipSize(int _espmagicflashchipsize);

uint32_t thingGetESPMagicFlashChipSpeed(uint8_t byte);
bool thingSetESPMagicFlashChipSpeed(int _espmagicflashchipspeed);

FlashMode_t thingGetESPMagicFlashChipMode(uint8_t byte);
bool thingSetESPMagicFlashChipMode(int _espmagicflashchipmode);

String thingGetBusyPins();
String thingGetPinsMap();


#ifdef ESP_ENABLE_INTERNAL_API
String onGetProperty(String _property, String _payload, int8_t transportMask);
bool onInsideChange(String _property, String _value);
int _getIntPropertyValue(String _property, int _defaultvalue);
String _getStringPropertyValue(String _property, String _defaultvalue);
#endif
#endif
#endif
