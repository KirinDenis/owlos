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

#include <core_version.h>

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266WiFi.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiType.h>
#include <rom/rtc.h>
#endif



#include "src\Utils\Utils.h"

bool unitInit();

String unitGetAllProperties();

void unitSubscribe();

String unitOnMessage(String _topic, String _payload, int transportMask);

String unitGetUnitId();
bool unitSetUnitId(String _unitid);

String unitGetTopic();
bool unitSetTopic(String _topic);

String unitGetFirmwareVersion();
bool unitSetFirmwareVersion(String _firmwareversion);

int unitGetFirmwareBuildNumber();
bool unitSetFirmwareBuildNumber(int _firmwarebuildnumber);

int unitGetWiFiAccessPointAvailable();
bool unitSetWiFiAccessPointAvailable(int _wifiaccesspointavailable);

String unitGetWiFiAccessPointSSID();
bool unitSetWiFiAccessPointSSID(String _wifissid);

String unitGetWiFiAccessPointPassword();
bool unitSetWiFiAccessPointPassword(String _wifipassword);

String unitGetWiFiAccessPointIP();
bool unitSetWiFiAccessPointIP(String _wifiaccesspointip);

int unitGetWiFiAvailable();
bool unitSetWiFiAvailable(int _wifiavailable);

String unitGetWiFiSSID();
bool unitSetWiFiSSID(String _wifissid);

String unitGetWiFiPassword();
bool unitSetWiFiPassword(String _wifipassword);

String unitGetWiFiIP();
bool unitSetWiFiIP(String _wifiip);

int unitGetRESTfulAvailable();
bool unitSetRESTfulAvailable(int _restfulavailable);

String unitGetRESTfulServerUsername();
bool unitSetRESTfulServerUsername(String _restfulserverusername);

String unitGetRESTfulServerPassword();
bool unitSetRESTfulServerPassword(String _restfulserverpassword);

int unitGetRESTfulServerPort();
bool unitSetRESTfulServerPort(int _restfulserverport);

int unitGetRESTfulClientPort();
bool unitSetRESTfulClientPort(int _restfulclientport);

String unitGetRESTfulClientURL();
bool unitSetRESTfulClientURL(String _restfulclienturl);

int unitGetMQTTAvailable();
bool unitSetMQTTAvailable(int _mqttavailable);

int unitGetMQTTPort();
bool unitSetMQTTPort(int _mqttport);

String unitGetMQTTURL();
bool unitSetMQTTURL(String _mqtturl);

String unitGetMQTTID();
bool unitSetMQTTID(String _mqttid);

String unitGetMQTTLogin();
bool unitSetMQTTLogin(String _mqttlogin);

String unitGetMQTTPassword();
bool unitSetMQTTPassword(String _mqttpassword);

int unitGetMQTTClientConnected();
int unitGetMQTTClientState();

int unitGetOTAAvailable();
bool unitSetOTAAvailable(int _otaavailable);

int unitGetOTAPort();
bool unitSetOTAPort(int _otaport);

String unitGetOTAID();
bool unitSetOTAID(String _otaid);

String unitGetOTAPassword();
bool unitSetOTAPassword(String _otapassword);

// WiFi parameters
int32_t unitGetWiFiRSSI();
bool unitSetWiFiRSSI(int _currentwifirssi);


#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
WiFiMode_t unitGetWiFiMode();
bool unitSetWiFiMode(WiFiMode_t _wifimode);
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
wifi_mode_t unitGetWiFiMode();
bool unitSetWiFiMode(wifi_mode_t _wifimode);
#endif


String unitGetAllWiFiModes();

wl_status_t unitGetWiFiStatus();
bool unitSetWiFiStatus(int _wifistatus);
String unitGetAllWiFiStatuses();
String unitGetWiFiStatusToString();

int8_t unitGetScanWiFiNetworks();
bool unitSetScanWiFiNetworks(int _scanwifinetworks);

int8_t unitGetWiFiNetworksCount();
bool unitSetWiFiNetworksCount(int _wifinetworkscount);

String unitGetWiFiNetworksParameters();
//bool unitSetWiFiNetworksParameters(String _wifinetworksparameters);
String unitGetAllWiFiEncryptionTypes();

int unitGetWiFiIsConnected();
bool unitSetWiFiIsConnected(int _wifiisconnected);

int unitGetWiFiIsDisconnected();
int unitSetWiFiIsDisconnected();

String unitGetConnectedWiFiSSID();

/**/
String unitGetESPResetInfo();
bool unitSetESPResetInfo(String _espresetinfo);

int unitGetESPReset();
bool unitSetESPReset(int _espreset);

int unitGetESPRestart();
bool unitSetESPRestart(int _esprestart);

uint16_t unitGetESPVcc();
bool unitSetESPVcc(int _espvcc);

uint32_t unitGetESPChipId();
bool unitSetESPChipId(int _espchipid);

uint32_t unitGetESPFreeHeap();
bool unitSetESPFreeHeap(int _espfreeheap);

uint16_t unitGetESPMaxFreeBlockSize();
bool unitSetESPMaxFreeBlockSize(int _espmaxfreeblocksize);

uint8_t unitGetESPHeapFragmentation();
bool unitSetESPHeapFragmentation(int _espheapfragmentation);

const char * unitGetESPSdkVersion();
bool unitSetESPSdkVersion(String _espsdkversion);

String unitGetESPCoreVersion();
bool unitSetESPCoreVersion(String _espcoreversion);

String unitGetESPFullVersion();
bool unitSetESPFullVersion(String _espfullversion);

uint8_t unitGetESPBootVersion();
bool unitSetESPBootVersion(int _espbootversion);

uint8_t unitGetESPBootMode();
bool unitSetESPBootMode(int _espbootmode);

uint8_t unitGetESPCpuFreqMHz();
bool unitSetESPCpuFreqMHz(int _espcpufreqmhz);

uint32_t unitGetESPFlashChipId();
bool unitSetESPFlashChipId(int _espflashchipid);

uint8_t unitGetESPFlashChipVendorId();
bool unitSetESPFlashChipVendorId(int _espflashchipvendorid);

uint32_t unitGetESPFlashChipRealSize();
bool unitSetESPFlashChipRealSize(int _espflashchiprealsize);

uint32_t unitGetESPFlashChipSize();
bool unitSetESPFlashChipSize(int _espflashchipsize);

uint32_t unitGetESPFlashChipSpeed();
bool unitSetESPFlashChipSpeed(int _espflashchipspeed);

uint32_t unitGetESPSketchSize();
bool unitSetESPSketchSize(int _espsketchsize);

uint32_t unitGetESPFreeSketchSpace();
bool unitSetESPFreeSketchSpace(int _espfreesketchspace);

FlashMode_t unitGetESPFlashChipMode();
bool unitSetESPFlashChipMode(int _espflashchipmode);

String unitGetESPSketchMD5();
bool unitSetESPSketchMD5(String _espsketchmd5);

String unitGetESPResetReason();
bool unitSetESPResetReason(String _espresetreason);

uint32_t unitGetESPMagicFlashChipSize(uint8_t byte);
bool unitSetESPMagicFlashChipSize(int _espmagicflashchipsize);

uint32_t unitGetESPMagicFlashChipSpeed(uint8_t byte);
bool unitSetESPMagicFlashChipSpeed(int _espmagicflashchipspeed);

FlashMode_t unitGetESPMagicFlashChipMode(uint8_t byte);
bool unitSetESPMagicFlashChipMode(int _espmagicflashchipmode);

String unitGetBusyPins();
String unitGetPinsMap();

int unitGetUpdateAvailable();
bool unitSetUpdateAvailable(int _updateavailable);

String unitGetUpdateHost();
bool unitSetUpdateHost(String _updatehost);