#include <ESP8266WiFi.h>
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

WiFiMode_t unitGetWiFiMode();
bool unitSetWiFiMode(WiFiMode_t _wifimode);
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