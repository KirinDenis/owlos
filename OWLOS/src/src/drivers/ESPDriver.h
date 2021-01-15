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
#include "../config.h"

#ifdef USE_ESP_DRIVER
#ifndef ESP_DRIVER_H
#define ESP_DRIVER_H

#include "WifiDriver.h"
#include "NetworkDriver.h"

#define FIRMWARE_VERSION "OWLOS version 1.11 (RC)"
#define FIRMWARE_BUILD_NUMBER 108

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <rom/rtc.h>
#endif

#define DEFAULT_ZERO_VALUE 0x00
#define DEFAULT_EMPTY_STR_VALUE ""

bool nodeInit();

String nodeGetAllProperties();

void nodeSubscribe();

String nodeOnMessage(const String &route, const String &_payload, int8_t transportMask);

String nodeGetUnitId();
bool nodeSetUnitId(String _nodeid);

String nodeGetTopic();
bool nodeSetTopic(String _topic);

String nodeGetFirmwareVersion();
bool nodeSetFirmwareVersion(String _firmwareversion);

int nodeGetFirmwareBuildNumber();
bool nodeSetFirmwareBuildNumber(int _firmwarebuildnumber);


/**/
String nodeGetESPResetInfo();
bool nodeSetESPResetInfo(String _espresetinfo);

int nodeGetESPReset();
bool nodeSetESPReset(int _espreset);

int nodeGetESPRestart();
bool nodeSetESPRestart(int _esprestart);

uint16_t nodeGetESPVcc();
bool nodeSetESPVcc(int _espvcc);

uint32_t nodeGetESPChipId();
bool nodeSetESPChipId(int _espchipid);

uint32_t nodeGetESPFreeHeap();
bool nodeSetESPFreeHeap(int _espfreeheap);

uint16_t nodeGetESPMaxFreeBlockSize();
bool nodeSetESPMaxFreeBlockSize(int _espmaxfreeblocksize);

uint8_t nodeGetESPHeapFragmentation();
bool nodeSetESPHeapFragmentation(int _espheapfragmentation);

String nodeGetESPSdkVersion();
bool nodeSetESPSdkVersion(String _espsdkversion);

String nodeGetESPCoreVersion();
bool nodeSetESPCoreVersion(String _espcoreversion);

String nodeGetESPFullVersion();
bool nodeSetESPFullVersion(String _espfullversion);

uint8_t nodeGetESPBootVersion();
bool nodeSetESPBootVersion(int _espbootversion);

uint8_t nodeGetESPBootMode();
bool nodeSetESPBootMode(int _espbootmode);

uint8_t nodeGetESPCpuFreqMHz();
bool nodeSetESPCpuFreqMHz(int _espcpufreqmhz);

uint32_t nodeGetESPFlashChipId();
bool nodeSetESPFlashChipId(int _espflashchipid);

uint8_t nodeGetESPFlashChipVendorId();
bool nodeSetESPFlashChipVendorId(int _espflashchipvendorid);

uint32_t nodeGetESPFlashChipRealSize();
bool nodeSetESPFlashChipRealSize(int _espflashchiprealsize);

uint32_t nodeGetESPFlashChipSize();
bool nodeSetESPFlashChipSize(int _espflashchipsize);

uint32_t nodeGetESPFlashChipSpeed();
bool nodeSetESPFlashChipSpeed(int _espflashchipspeed);

uint32_t nodeGetESPSketchSize();
bool nodeSetESPSketchSize(int _espsketchsize);

uint32_t nodeGetESPFreeSketchSpace();
bool nodeSetESPFreeSketchSpace(int _espfreesketchspace);

FlashMode_t nodeGetESPFlashChipMode();
bool nodeSetESPFlashChipMode(int _espflashchipmode);

String nodeGetESPSketchMD5();
bool nodeSetESPSketchMD5(String _espsketchmd5);

String nodeGetESPResetReason();
bool nodeSetESPResetReason(String _espresetreason);

uint32_t nodeGetESPMagicFlashChipSize(uint8_t byte);
bool nodeSetESPMagicFlashChipSize(int _espmagicflashchipsize);

uint32_t nodeGetESPMagicFlashChipSpeed(uint8_t byte);
bool nodeSetESPMagicFlashChipSpeed(int _espmagicflashchipspeed);

FlashMode_t nodeGetESPMagicFlashChipMode(uint8_t byte);
bool nodeSetESPMagicFlashChipMode(int _espmagicflashchipmode);

String nodeGetBusyPins();
String nodeGetPinsMap();


#ifdef ESP_ENABLE_INTERNAL_API
String onGetProperty(String _property, String _payload, int8_t transportMask);
bool onInsideChange(String _property, String _value);
int _getIntPropertyValue(String _property, int _defaultvalue);
String _getStringPropertyValue(String _property, String _defaultvalue);
#endif
#endif
#endif
