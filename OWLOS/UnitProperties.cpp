
#include "UnitProperties.h"
#include "src\Managers\DeviceManager.h"
#include "src\Managers\FileManager.h"
#include "src\Managers\TransportManager.h"
#include "src\Managers\UpdateManager.h"

#define DefaultFirmwareVersion "OWL OS IoT Unit version 1.7 (beta)"
#define DefaultFirmwareBuildNumber 54

#define DefaultId "owlunit"
#define DefaultTopic "world0/area1/front1/room1/"

#define DefaultWiFiAccessPointAvailable 1
#define DefaultWiFiAccessPointSSID "owlunit"
#define DefaultWiFiAccessPointPassword  "1122334455"
#define DefaultWiFiAccessPointIP  "192.168.0.1"


//->TODO:Clear WiFi settings before release
// office
// Dennis home
#define DefaultWiFiAvailable 0
#define DefaultWiFiSSID ""
#define DefaultWiFiPassword ""
// test for office


#define DefaultRESTfulAvailable true
#define DefaultRESTfulServerUsername "admin"
#define DefaultRESTfulServerPassword "admin"
#define DefaultRESTfulServerPort 8084
#define DefaultRESTfulClientPort 8082
#define DefaultRESTfulClientURL ""

//->TODO:Clear MQTT settings before release
#define DefaultMQTTAvailable false
#define DefaultMQTTPort 1883
// Dennis home
#define DefaultMQTTURL "192.168.1.6"
// office
//#define DefaultMQTTURL "192.168.9.6"
#define DefaultMQTTLogin "owluser"
#define DefaultMQTTPassword ""
//#define DefaultMQTTClientConnected 0

#define DefaultOTAAvailable false
#define DefaultOTAPort 8266
#define DefaultOTAID "owlunit"
#define DefaultOTAPassword "cas777"

// WiFi properties
#define DefaultWiFiRSSI 0
#define DefaultWiFiMode WIFI_OFF
#define DefaultWiFiStatus WL_DISCONNECTED
#define DefaultWiFiStatusToString WL_DISCONNECTED
#define DefaultWiFiIsConnected 0
#define DefaultConnectedWiFiSSID ""
#define DefaultWiFiNetworksCount 0

/**/
// ESP class properties
#define DefaultESPResetInfo ""
#define DefaultESPReset 0
#define DefaultESPRestart 0
#define DefaultESPVcc 0
#define DefaultESPChipId 0
#define DefaultESPFreeHeap 0
#define DefaultESPMaxFreeBlockSize 0
#define DefaultESPHeapFragmentation 0
#define DefaultESPSdkVersion ""
#define DefaultESPCoreVersion ""
#define DefaultESPFullVersion ""
#define DefaultESPBootVersion 0
#define DefaultESPBootMode 0
#define DefaultESPCpuFreqMHz 0
#define DefaultESPFlashChipId 0
#define DefaultESPFlashChipVendorId 0
#define DefaultESPFlashChipRealSize 0
#define DefaultESPFlashChipSize 0
#define DefaultESPFlashChipSpeed 0
#define DefaultESPSketchSize 0
#define DefaultESPFreeSketchSpace 0
#define DefaultESPFlashChipMode 0x00
#define DefaultESPSketchMD5 ""
#define DefaultESPResetReason ""
#define DefaultESPMagicFlashChipSize 0
#define DefaultESPMagicFlashChipSpeed 0
#define DefaultESPMagicFlashChipMode 0x00

#define DefaultBusyPins ""
#define DefaultPinsMap ""

//Update 
#define DefaultUpdateAvailable true
#define DefaultUpdateHost "http://81.95.178.177:8082/update/"

//to make read property from file once, use this CSV string
String propertyFileReaded("");

//Unit Private properties
String unitid(DefaultId); //current Unit ID for transport (MQTT) topic and other identification inside system 
String topic(DefaultTopic); //current Unit ROOT topic
String firmwareversion(DefaultFirmwareVersion);
int firmwarebuildnumber(DefaultFirmwareBuildNumber);
int wifiapavailable(DefaultWiFiAccessPointAvailable);
String wifiaccesspointssid(DefaultWiFiAccessPointSSID);
String wifiaccesspointpassword(DefaultWiFiAccessPointPassword);
String wifiaccesspointip(DefaultWiFiAccessPointIP);
int wifiavailable(DefaultWiFiAvailable);
String wifissid(DefaultWiFiSSID);
String wifipassword(DefaultWiFiPassword);
String wifiip(NotAvailable);
int restfulavailable(DefaultRESTfulAvailable);
String restfulserverusername(DefaultRESTfulServerUsername);
String restfulserverpassword(DefaultRESTfulServerPassword);
int restfulserverport(DefaultRESTfulServerPort);
int restfulclientport(DefaultRESTfulClientPort);
String restfulclienturl(DefaultRESTfulClientURL);
int mqttavailable(DefaultMQTTAvailable);
int mqttport(DefaultMQTTPort);
String mqtturl(DefaultMQTTURL);
String mqttid(DefaultMQTTURL);
String mqttlogin(DefaultMQTTLogin);
String mqttpassword(DefaultMQTTPassword);
//int mqttclientconnected(DefaultMQTTClientConnected);
int otaavailable(DefaultOTAAvailable);
int otaport(DefaultOTAPort);
String otaid(DefaultOTAID);
String otapassword(DefaultOTAPassword);

//WiFi properties
int32_t wifirssi((int32_t)DefaultWiFiRSSI);
WiFiMode_t wifimode((WiFiMode_t)DefaultWiFiMode);
wl_status_t wifistatus((wl_status_t)DefaultWiFiStatus);
String wifistatustostring(DefaultWiFiStatusToString);
int wifiisconnected(DefaultWiFiIsConnected);
String connectedwifissid(DefaultConnectedWiFiSSID);
int8_t wifinetworkscount((int8_t)DefaultWiFiNetworksCount);

/**/
// ESP properties
String espresetinfo(DefaultESPResetInfo);
int espreset(DefaultESPReset);
int esprestart(DefaultESPRestart);
uint16_t espvcc(DefaultESPVcc);
uint32_t espchipid(DefaultESPChipId);
uint32_t espfreeheap(DefaultESPFreeHeap);
uint16_t espmaxfreeblocksize(DefaultESPMaxFreeBlockSize);
uint8_t espheapfragmentation(DefaultESPHeapFragmentation);
const char * espsdkversion(DefaultESPSdkVersion);
String espcoreversion(DefaultESPCoreVersion);
String espfullversion(DefaultESPFullVersion);
uint8_t espbootversion(DefaultESPBootVersion);
uint8_t espbootmode(DefaultESPBootMode);
uint8_t espcpufreqmhz(DefaultESPCpuFreqMHz);
uint32_t espflashchipid(DefaultESPFlashChipId);
uint8_t espflashchipvendorid(DefaultESPFlashChipVendorId);
uint32_t espflashchiprealsize(DefaultESPFlashChipRealSize);
uint32_t espflashchipsize(DefaultESPFlashChipSize);
uint32_t espflashchipspeed(DefaultESPFlashChipSpeed);
uint32_t espsketchsize(DefaultESPSketchSize);
uint32_t espfreesketchspace(DefaultESPFreeSketchSpace);
FlashMode_t espflashchipmode((FlashMode_t)DefaultESPFlashChipMode);
String espsketchmd5(DefaultESPSketchMD5);
String espresetreason(DefaultESPResetReason);
uint32_t espmagicflashchipsize(DefaultESPMagicFlashChipSize);
uint32_t espmagicflashchipspeed(DefaultESPMagicFlashChipSpeed);
FlashMode_t espmagicflashchipmode((FlashMode_t)DefaultESPMagicFlashChipMode);

//Pins routins 
//busyPins variable is original declarated at DevicesManager, this flag only control changes of state
String _busyPins(DefaultBusyPins);
String pinsMap(DefaultPinsMap);

//Update 
int updateavailable(DefaultUpdateAvailable);
String updatehost(DefaultUpdateHost);

bool unitInit()
{
	unitGetUnitId();
	unitGetTopic();
	return true;
}

//flags started with "//" chars at end of the string:
//r - read only
//s - selected
//p - password
//
//b - boolean
//f - float
//i - integer
//if no type = string
//if not read only - write accessable
//this flags needed to UI and SDK builder - determinate API parameters types and SET API available

String unitGetAllProperties()
{
    String result = "properties for:wifi\n"; 
	result += "id=wifi//r\n";    
	result += "type=" + String(WiFiType) + "//r\n";    
	result += "wifiaccesspointavailable=" + String(unitGetWiFiAccessPointAvailable()) + "//bs\n";
	result += "wifiaccesspointssid=" + unitGetWiFiAccessPointSSID() + "//s\n";
	result += "wifiaccesspointpassword=" + unitGetWiFiAccessPointPassword() + "//sp\n";
	result += "wifiaccesspointip=" + unitGetWiFiAccessPointIP() + "//\n";
	result += "wifiavailable=" + String(unitGetWiFiAvailable()) + "//bs\n";
	result += "wifissid=" + unitGetWiFiSSID() + "//s\n";
	result += "wifipassword=" + unitGetWiFiPassword() + "//ps\n";
	result += "wifiip=" + unitGetWiFiIP() + "//\n";
	result += "wifiisconnected=" + String(unitGetWiFiIsConnected()) + "//bs\n";
	result += "connectedwifissid=" + unitGetConnectedWiFiSSID() + "//s\n";
	result += "wifirssi=" + String(unitGetWiFiRSSI()) + "//r\n";
	result += "wifimode=" + String(unitGetWiFiMode()) + "//r\n";
	result += unitGetAllWiFiModes() + "//r\n";
	result += "wifistatus=" + String(unitGetWiFiStatus()) + "//r\n";
	result += "wifistatustostring=" + String(unitGetWiFiStatusToString()) + "//\n";
	result += unitGetAllWiFiStatuses() + "//r\n";
	result += unitGetWiFiNetworksParameters() + "//r\n";
	result += unitGetAllWiFiEncryptionTypes() + "//r\n";


    result += "properties for:network\n"; 
	result += "id=network//r\n";    
	result += "type=" + String(NetworkType) + "//r\n";
	result += "firmwareversion=" + unitGetFirmwareVersion() + "//r\n";
	result += "firmwarebuildnumber=" + String(unitGetFirmwareBuildNumber()) + "//ri\n";
	result += "unitid=" + unitGetUnitId() + "//\n";
	result += "topic=" + unitGetTopic() + "//\n";
	result += "restfulavailable=" + String(unitGetRESTfulAvailable()) + "//bs\n";
	result += "restfulserverusername=" + unitGetRESTfulServerUsername() + "//\n";
	result += "restfulserverpassword=" + unitGetRESTfulServerPassword() + "//sp\n";
	result += "restfulserverport=" + String(unitGetRESTfulServerPort()) + "//i\n";
	result += "restfulclientport=" + String(unitGetRESTfulClientPort()) + "//i\n";
	result += "restfulclienturl=" + unitGetRESTfulClientURL() + "//\n";
	result += "mqttavailable=" + String(unitGetMQTTAvailable()) + "//bs\n";
	result += "mqttport=" + String(unitGetMQTTPort()) + "//i\n";
	result += "mqtturl=" + unitGetMQTTURL() + "//\n";
	result += "mqttid=" + unitGetMQTTID() + "//\n";
	result += "mqttlogin=" + unitGetMQTTLogin() + "//\n";
	result += "mqttpassword=" + unitGetMQTTPassword() + "//p\n";
	result += "mqttclientconnected=" + String(unitGetMQTTClientConnected()) + "//bs\n";
	result += "mqttclientstate=" + String(unitGetMQTTClientState()) + "//i\n";
	result += "otaavailable=" + String(unitGetOTAAvailable()) + "//bs\n";
	result += "otaport=" + String(unitGetOTAPort()) + "//i\n";
	result += "otaid=" + unitGetOTAID() + "//\n";
	result += "otapassword=" + unitGetOTAPassword() + "//p\n";
	result += "updateavailable=" + String(unitGetUpdateAvailable()) + "//bs\n";
	result += "updatepossible=" + String(updateGetUpdatePossible()) + "//ir\n";
	result += "updateinfo=" + String(updateGetUpdateInfo()) + "//r\n";
	result += "updateuistatus=" + String(updateGetUpdateUIStatus()) + "//ir\n";
	result += "updatefirmwarestatus=" + String(updateGetUpdateFirmwareStatus()) + "//ir\n";
	result += "updatehost=" + unitGetUpdateHost() + "//s\n";
	
	/**/
        result += "properties for:esp\n"; 
	result += "id=esp//r\n";    
	result += "type=" + String(ESPType) + "//r\n";    
	result += "espresetinfo=" + unitGetESPResetInfo() + "//r\n";
	result += "espreset=" + String(unitGetESPReset()) + "//sb\n";
	result += "esprestart=" + String(unitGetESPRestart()) + "//b\n";
	result += "espvcc=" + String(unitGetESPVcc()) + "//r\n";
	result += "espchipid=" + String(unitGetESPChipId()) + "//sr\n";
	result += "espfreeheap=" + String(unitGetESPFreeHeap()) + "//sri\n";
	result += "espmaxfreeblocksize=" + String(unitGetESPMaxFreeBlockSize()) + "//ri\n";
	result += "espheapfragmentation=" + String(unitGetESPHeapFragmentation()) + "//ri\n";
	result += "espsdkversion=" + String(*unitGetESPSdkVersion()) + "//r\n";
	result += "espcoreversion=" + unitGetESPCoreVersion() + "//r\n";
	result += "espfullversion=" + unitGetESPFullVersion() + "//r\n";
	result += "espbootversion=" + String(unitGetESPBootVersion()) + "//r\n";
	result += "espbootmode=" + String(unitGetESPBootMode()) + "//r\n";
	result += "espcpufreqmhz=" + String(unitGetESPCpuFreqMHz()) + "//r\n";
	result += "espflashchipid=" + String(unitGetESPFlashChipId()) + "//r\n";
	result += "espflashchipvendorid=" + String(unitGetESPFlashChipVendorId()) + "//r\n";
	result += "espflashchiprealsize=" + String(unitGetESPFlashChipRealSize()) + "//r\n";
	result += "espflashchipsize=" + String(unitGetESPFlashChipSize()) + "//r\n";
	result += "espflashchipspeed=" + String(unitGetESPFlashChipSpeed()) + "//r\n";
	result += "espsketchsize=" + String(unitGetESPSketchSize()) + "//r\n";
	result += "espfreesketchspace=" + String(unitGetESPFreeSketchSpace()) + "//r\n";
	result += "espflashchipmode=" + String(unitGetESPFlashChipMode()) + "//r\n";
	result += "espsketchmd5=" + unitGetESPSketchMD5() + "//r\n";
	result += "espresetreason=" + unitGetESPResetReason() + "//sr\n";
	result += "espmagicflashchipsize=" + String(espmagicflashchipsize) + "//r\n";
	result += "espmagicflashchipspeed=" + String(espmagicflashchipspeed) + "//r\n";
	result += "espmagicflashchipmode=" + String(espmagicflashchipmode) + "//r\n";
	//Pins 
	result += "busypins=" + unitGetBusyPins() + "//rs\n";
	result += "pinsmap=" + unitGetPinsMap() + "//r\n";

	return result;
}


void unitSubscribe()
{
	transportSubscribe(topic + "/#");
}

String onGetProperty(String _property, String _payload, int transportMask)
{
	debugOut(unitid, "|-> get property " + _property + " = " + _payload);
	if (transportMask && MQTTMask != 0)
	{
		transportPublish(topic + "/" + _property, _payload);
	}
	return _payload;
}

String unitOnMessage(String _topic, String _payload, int transportMask)
{
  String result = WrongPropertyName;
  if (String(topic + "/getunitid").equals(_topic)) return onGetProperty("id", unitGetUnitId(), transportMask); 
  else
  if (String(topic + "/setunitid").equals(_topic)) return String(unitSetUnitId(_payload));
  else 
  if (String(topic + "/gettopic").equals(_topic)) return onGetProperty("topic", unitGetTopic(), transportMask); 
  else
  if (String(topic + "/settopic").equals(_topic)) return String(unitSetTopic(_payload));
  else 
  if (String(topic + "/getfirmwareversion").equals(_topic)) return onGetProperty("firmwareversion", unitGetFirmwareVersion(), transportMask); 
  else
  if (String(topic + "/setfirmwareversion").equals(_topic)) return String(unitSetFirmwareVersion(_payload));
  else 
  if (String(topic + "/getfirmwarebuildnumber").equals(_topic)) return onGetProperty("firmwarebuildnumber", String(unitGetFirmwareBuildNumber()), transportMask); 
  else
  if (String(topic + "/setfirmwarebuildnumber").equals(_topic)) return String(unitSetFirmwareBuildNumber(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getwifiaccesspointavailable").equals(_topic)) return String(onGetProperty("wifiapavailable", String(unitGetWiFiAccessPointAvailable()), transportMask)); 
  else
  if (String(topic + "/setwifiaccesspointavailable").equals(_topic)) return String(unitSetWiFiAccessPointAvailable(std::atoi(_payload.c_str())));
  else 
  if (String(topic + "/getwifiaccesspointssid").equals(_topic)) return onGetProperty("wifiaccesspointssid", unitGetWiFiAccessPointSSID(), transportMask); 
  else
  if (String(topic + "/setwifiaccesspointssid").equals(_topic)) return String(unitSetWiFiAccessPointSSID(_payload));
  else 
  if (String(topic + "/getwifiaccesspointpassword").equals(_topic)) return onGetProperty("wifipassword", unitGetWiFiAccessPointPassword(), transportMask); 
  else
  if (String(topic + "/setwifiaccesspointpassword").equals(_topic)) return String(unitSetWiFiAccessPointPassword(_payload));
  else 
  if (String(topic + "/getwifiaccesspointip").equals(_topic)) return onGetProperty("wifiaccesspointip", unitGetWiFiAccessPointIP(), transportMask); 
  else
  if (String(topic + "/setwifiaccesspointip").equals(_topic)) return String(unitSetWiFiAccessPointIP(_payload));
  else 
  if (String(topic + "/getwifiavailable").equals(_topic)) return String(onGetProperty("wifiavailable", String(unitGetWiFiAvailable()), transportMask)); 
  else
  if (String(topic + "/setwifiavailable").equals(_topic)) return String(unitSetWiFiAvailable(std::atoi(_payload.c_str())));
  else 
  if (String(topic + "/getwifissid").equals(_topic)) return onGetProperty("wifissid", unitGetWiFiSSID(), transportMask); 
  else
  if (String(topic + "/setwifissid").equals(_topic)) return String(unitSetWiFiSSID(_payload));
  else 
  if (String(topic + "/getwifipassword").equals(_topic)) return onGetProperty("wifipassword", unitGetWiFiPassword(), transportMask); 
  else
  if (String(topic + "/setwifipassword").equals(_topic)) return String(unitSetWiFiPassword(_payload));
  else 
  if (String(topic + "/getwifiip").equals(_topic)) return onGetProperty("wifiip", unitGetWiFiIP(), transportMask); 
  else
  if (String(topic + "/setwifiip").equals(_topic)) return String(unitSetWiFiIP(_payload));
  else 
  if (String(topic + "/getwifiisconnected").equals(_topic)) return onGetProperty("wifiisconnected", String(unitGetWiFiIsConnected()), transportMask); 
  else
  if (String(topic + "/setwifiisconnected").equals(_topic)) return String(unitSetWiFiIsConnected(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getconnectedwifissid").equals(_topic)) return onGetProperty("connectedwifissid", unitGetConnectedWiFiSSID(), transportMask); 

  else 
  if (String(topic + "/getrestfulavailable").equals(_topic)) return onGetProperty("restfulavailable", String(unitGetRESTfulAvailable()), transportMask); 
  else
  if (String(topic + "/setrestfulavailable").equals(_topic)) return String(unitSetRESTfulAvailable(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getrestfulserverusername").equals(_topic)) return onGetProperty("restfulserverusername", unitGetRESTfulServerUsername(), transportMask); 
  else
  if (String(topic + "/setrestfulserverusername").equals(_topic)) return String(unitSetRESTfulServerUsername(_payload));
  else 
  if (String(topic + "/getrestfulserverpassword").equals(_topic)) return onGetProperty("restfulserverpassword", unitGetRESTfulServerPassword(), transportMask); 
  else
  if (String(topic + "/setrestfulserverpassword").equals(_topic)) return String(unitSetRESTfulServerPassword(_payload));
  else 
  if (String(topic + "/getrestfulserverport").equals(_topic)) return onGetProperty("restfulserverport", String(unitGetRESTfulServerPort()), transportMask); 
  else
  if (String(topic + "/setrestfulserverport").equals(_topic)) return String(unitSetRESTfulServerPort(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getrestfulclientport").equals(_topic)) return onGetProperty("restfulclientport", String(unitGetRESTfulClientPort()), transportMask); 
  else
  if (String(topic + "/setrestfulclientport").equals(_topic)) return String(unitSetRESTfulClientPort(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getrestfulclienturl").equals(_topic)) return onGetProperty("restfulclienturl", unitGetRESTfulClientURL(), transportMask); 
  else
  if (String(topic + "/setrestfulclienturl").equals(_topic)) return String(unitSetRESTfulClientURL(_payload));
  else 
  if (String(topic + "/getmqttavailable").equals(_topic)) return onGetProperty("mqttavailable", String(unitGetMQTTAvailable()), transportMask); 
  else
  if (String(topic + "/setmqttavailable").equals(_topic)) return String(unitSetMQTTAvailable(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getmqttport").equals(_topic)) return onGetProperty("mqttport", String(unitGetMQTTPort()), transportMask); 
  else
  if (String(topic + "/setmqttport").equals(_topic)) return String(unitSetMQTTPort(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getmqtturl").equals(_topic)) return onGetProperty("mqtturl", unitGetMQTTURL(), transportMask); 
  else
  if (String(topic + "/setmqtturl").equals(_topic)) return String(unitSetMQTTURL(_payload));
  else 
  if (String(topic + "/getmqttid").equals(_topic)) return onGetProperty("mqttid", unitGetMQTTID(), transportMask); 
  else
  if (String(topic + "/setmqttid").equals(_topic)) return String(unitSetMQTTID(_payload));
  else 
  if (String(topic + "/getmqttlogin").equals(_topic)) return onGetProperty("mqttlogin", unitGetMQTTLogin(), transportMask); 
  else
  if (String(topic + "/setmqttlogin").equals(_topic)) return String(unitSetMQTTLogin(_payload));
  else 
  if (String(topic + "/getmqttpassword").equals(_topic)) return onGetProperty("mqttpassword", unitGetMQTTPassword(), transportMask); 
  else
  if (String(topic + "/setmqttpassword").equals(_topic)) return String(unitSetMQTTPassword(_payload));
  else 
  if (String(topic + "/getmqttclientconnected").equals(_topic)) return String(unitGetMQTTClientConnected()); 
  else 
  if (String(topic + "/getmqttclientstate").equals(_topic)) return String(unitGetMQTTClientState()); 
  else 
  if (String(topic + "/getotaavailable").equals(_topic)) return onGetProperty("otaavailable", String(unitGetOTAAvailable()), transportMask); 
  else
  if (String(topic + "/setotaavailable").equals(_topic)) return String(unitSetOTAAvailable(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getotaport").equals(_topic)) return onGetProperty("otaport", String(unitGetOTAPort()), transportMask); 
  else
  if (String(topic + "/setotaport").equals(_topic)) return String(unitSetOTAPort(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getotaid").equals(_topic)) return onGetProperty("otaid", unitGetOTAID(), transportMask); 
  else
  if (String(topic + "/setotaid").equals(_topic)) return String(unitSetOTAID(_payload));
  else 
  if (String(topic + "/getotapassword").equals(_topic)) return onGetProperty("otapassword", unitGetMQTTPassword(), transportMask); 
  else
  if (String(topic + "/setotapassword").equals(_topic)) return String(unitSetOTAPassword(_payload));
// WiFi parameters
  else 
  if (String(topic + "/getwifirssi").equals(_topic)) return onGetProperty("wifirssi", String(unitGetWiFiRSSI()), transportMask); 
  else
  if (String(topic + "/setwifirssi").equals(_topic)) return String(unitSetWiFiRSSI(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getwifimode").equals(_topic)) return onGetProperty("wifimode", String(unitGetWiFiMode()), transportMask); 
  else
  if (String(topic + "/setwifimode").equals(_topic)) return String(unitSetWiFiMode((WiFiMode_t)std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getwifistatus").equals(_topic)) return onGetProperty("wifistatus", String(unitGetWiFiStatus()), transportMask); 
  else
  if (String(topic + "/setwifistatus").equals(_topic)) return String(unitSetWiFiStatus(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getwifistatustostring").equals(_topic)) return onGetProperty("wifistatustostring", String(unitGetWiFiStatusToString()), transportMask); 
  else 
  if (String(topic + "/getscanwifinetworks").equals(_topic)) return onGetProperty("wifinetworkscount", String(unitGetScanWiFiNetworks()), transportMask); 
  else
  if (String(topic + "/setscanwifinetworks").equals(_topic)) return String(unitSetScanWiFiNetworks(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getwifinetworkscount").equals(_topic)) return onGetProperty("wifinetworkscount", String(unitGetWiFiNetworksCount()), transportMask); 
  else
  if (String(topic + "/setwifinetworkscount").equals(_topic)) return String(unitSetWiFiNetworksCount(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getwifinetworksparameters").equals(_topic)) return unitGetWiFiNetworksParameters(); 
  else 
  if (String(topic + "/getallwifimodes").equals(_topic)) return unitGetAllWiFiModes(); 
  else 
  if (String(topic + "/getallwifistatuses").equals(_topic)) return String(unitGetAllWiFiStatuses()); 
  else 
  if (String(topic + "/getallwifiencryptiontypes").equals(_topic)) return String(unitGetAllWiFiEncryptionTypes()); 

/**/
//ESP class parameters
  else 
  if (String(topic + "/getespresetinfo").equals(_topic)) return onGetProperty("espresetinfo", unitGetESPResetInfo(), transportMask); 
  else
  if (String(topic + "/setespresetinfo").equals(_topic)) return String(unitSetESPResetInfo(_payload));
  else 
  if (String(topic + "/getespreset").equals(_topic)) return onGetProperty("espreset", String(unitGetESPReset()), transportMask); 
  else
  if (String(topic + "/setespreset").equals(_topic)) return String(unitSetESPReset(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getesprestart").equals(_topic)) return onGetProperty("esprestart", String(unitGetESPRestart()), transportMask); 
  else
  if (String(topic + "/setesprestart").equals(_topic)) return String(unitSetESPRestart(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespvcc").equals(_topic)) return onGetProperty("espvcc", String(unitGetESPVcc()), transportMask); 
  else
  if (String(topic + "/setespvcc").equals(_topic)) return String(unitSetESPVcc(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespchipid").equals(_topic)) return onGetProperty("espchipid", String(unitGetESPChipId()), transportMask); 
  else
  if (String(topic + "/setespchipid").equals(_topic)) return String(unitSetESPChipId(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespfreeheap").equals(_topic)) return onGetProperty("espfreeheap", String(unitGetESPFreeHeap()), transportMask); 
  else
  if (String(topic + "/setespfreeheap").equals(_topic)) return String(unitSetESPFreeHeap(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespmaxfreeblocksize").equals(_topic)) return onGetProperty("espmaxfreeblocksize", String(unitGetESPMaxFreeBlockSize()), transportMask); 
  else
  if (String(topic + "/setespmaxfreeblocksize").equals(_topic)) return String(unitSetESPMaxFreeBlockSize(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespheapfragmentation").equals(_topic)) return onGetProperty("espheapfragmentation", String(unitGetESPHeapFragmentation()), transportMask); 
  else
  if (String(topic + "/setespheapfragmentation").equals(_topic)) return String(unitSetESPHeapFragmentation(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespsdkversion").equals(_topic)) return onGetProperty("espsdkversion", String(*unitGetESPSdkVersion()), transportMask); 
  else
  if (String(topic + "/setespsdkversion").equals(_topic)) return String(unitSetESPSdkVersion(_payload));
  else 
  if (String(topic + "/getespcoreversion").equals(_topic)) return onGetProperty("espcoreversion", unitGetESPCoreVersion(), transportMask); 
  else
  if (String(topic + "/setespcoreversion").equals(_topic)) return String(unitSetESPCoreVersion(_payload));
  else 
  if (String(topic + "/getespfullversion").equals(_topic)) return onGetProperty("espfullversion", unitGetESPFullVersion(), transportMask); 
  else
  if (String(topic + "/setespfullversion").equals(_topic)) return String(unitSetESPFullVersion(_payload));
  else 
  if (String(topic + "/getespbootversion").equals(_topic)) return onGetProperty("espbootversion", String(unitGetESPBootVersion()), transportMask); 
  else
  if (String(topic + "/setespbootversion").equals(_topic)) return String(unitSetESPBootVersion(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespbootmode").equals(_topic)) return onGetProperty("espbootmode", String(unitGetESPBootMode()), transportMask); 
  else
  if (String(topic + "/setespbootmode").equals(_topic)) return String(unitSetESPBootMode(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespcpufreqmhz").equals(_topic)) return onGetProperty("espcpufreqmhz", String(unitGetESPCpuFreqMHz()), transportMask); 
  else
  if (String(topic + "/setespcpufreqmhz").equals(_topic)) return String(unitSetESPCpuFreqMHz(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespflashchipid").equals(_topic)) return onGetProperty("espflashchipid", String(unitGetESPFlashChipId()), transportMask); 
  else
  if (String(topic + "/setespflashchipid").equals(_topic)) return String(unitSetESPFlashChipId(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespflashchipvendorid").equals(_topic)) return onGetProperty("espflashchipvendorid", String(unitGetESPFlashChipVendorId()), transportMask); 
  else
  if (String(topic + "/setespflashchipvendorid").equals(_topic)) return String(unitSetESPFlashChipVendorId(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespflashchiprealsize").equals(_topic)) return onGetProperty("espflashchiprealsize", String(unitGetESPFlashChipRealSize()), transportMask); 
  else
  if (String(topic + "/setespflashchiprealsize").equals(_topic)) return String(unitSetESPFlashChipRealSize(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespflashchipsize").equals(_topic)) return onGetProperty("espflashchipsize", String(unitGetESPFlashChipSize()), transportMask); 
  else
  if (String(topic + "/setespflashchipsize").equals(_topic)) return String(unitSetESPFlashChipSize(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespflashchipspeed").equals(_topic)) return onGetProperty("espflashchipspeed", String(unitGetESPFlashChipSpeed()), transportMask); 
  else
  if (String(topic + "/setespflashchipspeed").equals(_topic)) return String(unitSetESPFlashChipSpeed(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespsketchsize").equals(_topic)) return onGetProperty("espsketchsize", String(unitGetESPSketchSize()), transportMask); 
  else
  if (String(topic + "/setespsketchsize").equals(_topic)) return String(unitSetESPSketchSize(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespfreesketchspace").equals(_topic)) return onGetProperty("espfreesketchspace", String(unitGetESPFreeSketchSpace()), transportMask); 
  else
  if (String(topic + "/setespfreesketchspace").equals(_topic)) return String(unitSetESPFreeSketchSpace(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespflashchipmode").equals(_topic)) return onGetProperty("espflashchipmode", String(unitGetESPFlashChipMode()), transportMask); 
  else
  if (String(topic + "/setespflashchipmode").equals(_topic)) return String(unitSetESPFlashChipMode(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespsketchmd5").equals(_topic)) return onGetProperty("espsketchmd5", unitGetESPSketchMD5(), transportMask); 
  else
  if (String(topic + "/setespsketchmd5").equals(_topic)) return String(unitSetESPSketchMD5(_payload));
  else 
  if (String(topic + "/getespresetreason").equals(_topic)) return onGetProperty("espresetreason", unitGetESPResetReason(), transportMask); 
  else
  if (String(topic + "/setespresetreason").equals(_topic)) return String(unitSetESPResetReason(_payload));
  else 
  if (String(topic + "/getespmagicflashchipsize").equals(_topic)) return onGetProperty("espmagicflashchipsize", String(unitGetESPMagicFlashChipSize((uint8_t)std::atoi (_payload.c_str()))), transportMask); 
  else
  if (String(topic + "/setespmagicflashchipsize").equals(_topic)) return String(unitSetESPMagicFlashChipSize(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespmagicflashchipspeed").equals(_topic)) return onGetProperty("espmagicflashchipspeed", String(unitGetESPMagicFlashChipSpeed((uint8_t)std::atoi (_payload.c_str()))), transportMask); 
  else
  if (String(topic + "/setespmagicflashchipspeed").equals(_topic)) return String(unitSetESPMagicFlashChipSpeed(std::atoi (_payload.c_str())));
  else 
  if (String(topic + "/getespmagicflashchipmode").equals(_topic)) return onGetProperty("espmagicflashchipmode", String(unitGetESPMagicFlashChipMode((uint8_t)std::atoi (_payload.c_str()))), transportMask); 
  else
  if (String(topic + "/setespmagicflashchipmode").equals(_topic)) return String(unitSetESPMagicFlashChipMode(std::atoi (_payload.c_str())));
  //Pins
  else 
  if (String(topic + "/getbusypins").equals(_topic)) return unitGetBusyPins();
  else 
  if (String(topic + "/getpinsmap").equals(_topic)) return unitGetPinsMap();  
  else
  if (String(topic + "/getupdateavailable").equals(_topic)) return onGetProperty("updateavailable", String(unitGetUpdateAvailable()), transportMask);
  else
  if (String(topic + "/setupdateavailable").equals(_topic)) return String(unitSetUpdateAvailable(std::atoi(_payload.c_str())));
  else
  if (String(topic + "/getupdatepossible").equals(_topic)) return onGetProperty("updatepossible", String(updateGetUpdatePossible()), transportMask);
  else
  if (String(topic + "/getupdateinfo").equals(_topic)) return onGetProperty("updateinfo", String(updateGetUpdateInfo()), transportMask);
  else
  if (String(topic + "/getupdateuistatus").equals(_topic)) return onGetProperty("updateuistatus", String(updateGetUpdateUIStatus()), transportMask);
  else
  if (String(topic + "/getupdatefirmwarestatus").equals(_topic)) return onGetProperty("updateufirmwarestatus", String(updateGetUpdateFirmwareStatus()), transportMask);
  else
  if (String(topic + "/getupdatehost").equals(_topic)) return onGetProperty("updatehost", unitGetUpdateHost(), transportMask);
  else
  if (String(topic + "/setupdatehost").equals(_topic)) return String(unitSetUpdateHost(_payload));
  else 
  //Update 
  return result;
}

bool onInsideChange(String _property, String _value)
{
	debugOut(unitid, "|<- inside change " + _property + " = " + _value);
	filesWriteString(String(DefaultId) + "." + _property, _value);
	if (transportAvailable())
	{
		return transportPublish(topic + "/" + _property, _value);
	}
	return true;
}
//-------------------------------------------------------------------------------------------
//Internal - get any unit property value by name
//-------------------------------------------------------------------------------------------
String _getStringPropertyValue(String _property, String _defaultvalue)
{
	String result = _defaultvalue;
	if (filesExists(String(DefaultId) + "." + _property))
	{
		result = filesReadString(String(DefaultId) + "." + _property);
	}
	else
	{
		unitOnMessage(topic + "/set" + _property, result, NoTransportMask);
	}
	propertyFileReaded += _property + ";";
	debugOut(unitid, _property + "=" + result);
	return result;
}
//Integer property
int _getIntPropertyValue(String _property, int _defaultvalue)
{
	int result = _defaultvalue;
	if (filesExists(String(DefaultId) + "." + _property))
	{
		result = filesReadInt(String(DefaultId) + "." + _property);
	}
	else
	{
		unitOnMessage(topic + "/set" + _property, String(result), NoTransportMask);
	}
	propertyFileReaded += _property + ";";
	debugOut(unitid, _property + "=" + String(result));
	return result;
}

//Getters and Setters section ---------------------------------------------------------------
String unitGetUnitId()
{
	if (propertyFileReaded.indexOf("unitid;") < 0) return unitid = _getStringPropertyValue("unitid", DefaultId + String(ESP.getChipId(), HEX));
	else return unitid;
}

bool unitSetUnitId(String _unitid)
{
	unitid = _unitid;
	return onInsideChange("unitid", String(unitid));
}

//Topic --------------------------------------------------------------------------------------
String unitGetTopic()
{
	if (propertyFileReaded.indexOf("topic;") < 0) return topic = _getStringPropertyValue("topic", topic + unitid);
	else return topic;
}

bool unitSetTopic(String _topic)
{
	topic = _topic;
	return  onInsideChange("topic", String(topic));
}

//GetFirmwareVersion
String unitGetFirmwareVersion()
{
	/*  if (propertyFileReaded.indexOf("firmwareversion;") < 0) return firmwareversion = _getStringPropertyValue("firmwareversion", DefaultFirmwareVersion);
	  else */ return firmwareversion;
}
bool unitSetFirmwareVersion(String _firmwareversion)
{
	return false;
}

//GetFirmwareBuildNumber
int unitGetFirmwareBuildNumber()
{
	/*  if (propertyFileReaded.indexOf("firmwarebuildnumber;") < 0) return firmwarebuildnumber = _getIntPropertyValue("firmwarebuildnumber", DefaultFirmwareBuildNumber);
	  else */ return firmwarebuildnumber;
}
bool unitSetFirmwareBuildNumber(int _firmwarebuildnumber)
{
	return false;
}

//WiFi -----------------------------------------------------------------------------------------
//WiFiAccessPointAvailable
int unitGetWiFiAccessPointAvailable()
{
	if (propertyFileReaded.indexOf("wifiapavailable;") < 0) return wifiapavailable = _getIntPropertyValue("wifiapavailable", DefaultWiFiAccessPointAvailable);
	else return wifiapavailable;
}

bool unitSetWiFiAccessPointAvailable(int _wifiapavailable)
{
	wifiapavailable = _wifiapavailable;
	return  onInsideChange("wifiapavailable", String(wifiapavailable));
}

//WiFiAccessPointSSID
String unitGetWiFiAccessPointSSID()
{
	if (propertyFileReaded.indexOf("wifiaccesspointssid;") < 0) return wifiaccesspointssid = _getStringPropertyValue("wifiaccesspointssid", DefaultId + String(ESP.getChipId()));
	else return wifiaccesspointssid;
}

bool unitSetWiFiAccessPointSSID(String _wifiaccesspointssid)
{
	wifiaccesspointssid = _wifiaccesspointssid;
	return  onInsideChange("wifiaccesspointssid", String(wifiaccesspointssid));
}
//WiFiAccessPointPassword
String unitGetWiFiAccessPointPassword()
{
	if (propertyFileReaded.indexOf("wifiaccesspointpassword;") < 0) return wifiaccesspointpassword = _getStringPropertyValue("wifiaccesspointpassword", DefaultWiFiAccessPointPassword);
	else return wifiaccesspointpassword;
}

bool unitSetWiFiAccessPointPassword(String _wifiaccesspointpassword)
{
	wifiaccesspointpassword = _wifiaccesspointpassword;
	return  onInsideChange("wifiaccesspointpassword", String(wifiaccesspointpassword));
}
//WiFiAccessPointIP
String unitGetWiFiAccessPointIP()
{
	if (unitGetWiFiAccessPointAvailable() == 1)
	{
		IPAddress real_wifiaccesspointip = WiFi.softAPIP();
		debugOut(unitid, "Current Access Point IP: " + real_wifiaccesspointip.toString());
		if (propertyFileReaded.indexOf("wifiaccesspointip;") < 0) wifiaccesspointip = _getStringPropertyValue("wifiaccesspointip", real_wifiaccesspointip.toString());

		if (!real_wifiaccesspointip.toString().equals(wifiaccesspointip))
		{
			debugOut(unitid, "Current Access Point IP not equals");
			if (!unitSetWiFiAccessPointIP(wifiaccesspointip))
			{
				debugOut(unitid, "Can't change Access Point IP to: " + wifiaccesspointip);
				wifiaccesspointip = NotAvailable;
			}
		}
	}
	else
	{
		WiFi.softAPdisconnect(true);
		wifiaccesspointip = NotAvailable;
	}

	debugOut(unitid, "wifiaccesspointip=" + wifiaccesspointip);
	return wifiaccesspointip;
}

bool unitSetWiFiAccessPointIP(String _wifiaccesspointip)
{
	IPAddress real_wifiaccesspointip;
	debugOut(unitid, "Current Access Point IP: " + WiFi.softAPIP().toString());
	if (real_wifiaccesspointip.fromString(_wifiaccesspointip))
	{
		if (WiFi.softAPConfig(real_wifiaccesspointip, real_wifiaccesspointip, IPAddress(255, 255, 255, 0)))
		{
			wifiaccesspointip = _wifiaccesspointip;
			return onInsideChange("wifiaccesspointip", wifiaccesspointip);
		}
	}

	return false;
}

//WiFiAvailable
int unitGetWiFiAvailable()
{
	if (propertyFileReaded.indexOf("wifiavailable;") < 0) return wifiavailable = _getIntPropertyValue("wifiavailable", DefaultWiFiAvailable);
	else return wifiavailable;
}

bool unitSetWiFiAvailable(int _wifiavailable)
{
	wifiavailable = _wifiavailable;
	return  onInsideChange("wifiavailable", String(wifiavailable));
}

//WiFiSSID
String unitGetWiFiSSID()
{
	if (propertyFileReaded.indexOf("wifissid;") < 0) return wifissid = _getStringPropertyValue("wifissid", DefaultWiFiSSID);
	else return wifissid;
}

bool unitSetWiFiSSID(String _wifissid)
{
	wifissid = _wifissid;
	return  onInsideChange("wifissid", String(wifissid));
}
//WiFiPassword
String unitGetWiFiPassword()
{
	if (propertyFileReaded.indexOf("wifipassword;") < 0) return wifipassword = _getStringPropertyValue("wifipassword", DefaultWiFiPassword);
	else return wifipassword;
}

bool unitSetWiFiPassword(String _wifipassword)
{
	wifipassword = _wifipassword;
	return  onInsideChange("wifipassword", String(wifipassword));
}
//WiFiIP
String unitGetWiFiIP()
{
	wifiip = WiFi.localIP().toString();
	return wifiip;
}
bool unitSetWiFiIP(String _wifiip)
{
	return false; //local (client) WiFi IP can't be changed manualy
}


//RESTfulAvailable()  
int unitGetRESTfulAvailable()
{
	if (propertyFileReaded.indexOf("restfulavailable;") < 0)
	{
		return restfulavailable = _getIntPropertyValue("restfulavailable", DefaultRESTfulAvailable);
	}
	else
	{
		return restfulavailable;
	}
}
bool unitSetRESTfulAvailable(int _restfulavailable)
{
	restfulavailable = _restfulavailable;
	return  onInsideChange("restfulavailable", String(restfulavailable));
}

//RESTfulServerUsername
String unitGetRESTfulServerUsername()
{
	if (propertyFileReaded.indexOf("restfulserverusername;") < 0) return restfulserverusername = _getStringPropertyValue("restfulserverusername", DefaultRESTfulServerUsername);
	else return restfulserverusername;
}
bool unitSetRESTfulServerUsername(String _restfulserverusername)
{
	restfulserverusername = _restfulserverusername;
	return  onInsideChange("restfulserverusername", String(restfulserverusername));
}

//RESTfulServerPassword
String unitGetRESTfulServerPassword()
{
	if (propertyFileReaded.indexOf("restfulserverpassword;") < 0) return restfulserverpassword = _getStringPropertyValue("restfulserverpassword", DefaultRESTfulServerPassword);
	else return restfulserverpassword;
}
bool unitSetRESTfulServerPassword(String _restfulserverpassword)
{
	restfulserverpassword = _restfulserverpassword;
	return  onInsideChange("restfulserverpassword", String(restfulserverpassword));
}

//RESTfulServerPort()  
int unitGetRESTfulServerPort()
{
	debugOut(unitid, "get port step 1");
	if (propertyFileReaded.indexOf("restfulserverport;") < 0)
	{
		debugOut(unitid, "get port step 2");
		restfulserverport = _getIntPropertyValue("restfulserverport", DefaultRESTfulServerPort);
		debugOut(unitid, "get port result=" + String(restfulserverport));
		return restfulserverport;
	}
	else
	{
		debugOut(unitid, "get port step 3");
		return restfulserverport;
	}
}
bool unitSetRESTfulServerPort(int _restfulserverport)
{
	restfulserverport = _restfulserverport;
	return  onInsideChange("restfulserverport", String(restfulserverport));
}

//RESTfulClientPort()  
int unitGetRESTfulClientPort()
{
	if (propertyFileReaded.indexOf("restfulclientport;") < 0) return restfulclientport = _getIntPropertyValue("restfulclientport", DefaultRESTfulClientPort);
	else return restfulclientport;
}
bool unitSetRESTfulClientPort(int _restfulclientport)
{
	restfulclientport = _restfulclientport;
	return  onInsideChange("restfulclientport", String(restfulclientport));
}

//RESTfulClientURL()  
String unitGetRESTfulClientURL()
{
	if (propertyFileReaded.indexOf("restfulclienturl;") < 0) return restfulclienturl = _getStringPropertyValue("restfulclienturl", DefaultRESTfulClientURL);
	else return restfulclienturl;
}
bool unitSetRESTfulClientURL(String _restfulclienturl)
{
	restfulclienturl = _restfulclienturl;
	return  onInsideChange("restfulclienturl", String(restfulclienturl));
}

//MQTTAvailable()  
int unitGetMQTTAvailable()
{
	if (propertyFileReaded.indexOf("mqttavailable;") < 0)
	{
		return mqttavailable = _getIntPropertyValue("mqttavailable", DefaultMQTTAvailable);
	}
	else
	{
		return mqttavailable;
	}
}
bool unitSetMQTTAvailable(int _mqttavailable)
{
	mqttavailable = _mqttavailable;
	return  onInsideChange("mqttavailable", String(mqttavailable));
}

//MQTTPort()  
int unitGetMQTTPort()
{
	if (propertyFileReaded.indexOf("mqttport;") < 0) return mqttport = _getIntPropertyValue("mqttport", DefaultMQTTPort);
	else return mqttport;
}
bool unitSetMQTTPort(int _mqttport)
{
	mqttport = _mqttport;
	return  onInsideChange("mqttport", String(mqttport));
}

//MQTTURL()  
String unitGetMQTTURL()
{
	if (propertyFileReaded.indexOf("mqtturl;") < 0) return mqtturl = _getStringPropertyValue("mqtturl", DefaultMQTTURL);
	else return mqtturl;
}
bool unitSetMQTTURL(String _mqtturl)
{
	mqtturl = _mqtturl;
	return  onInsideChange("mqtturl", String(mqtturl));
}

//MQTTID()  
String unitGetMQTTID()
{
	if (propertyFileReaded.indexOf("mqttid;") < 0) return mqttid = _getStringPropertyValue("mqttid", DefaultMQTTURL);
	else return mqttid;
}

bool unitSetMQTTID(String _mqttid)
{
	mqttid = _mqttid;
	return  onInsideChange("mqttid", String(mqttid));
}

//MQTTLogin()  
String unitGetMQTTLogin()
{
	if (propertyFileReaded.indexOf("mqttlogin;") < 0) return mqttlogin = _getStringPropertyValue("mqttlogin", DefaultMQTTLogin + String(ESP.getChipId(), HEX));
	else return mqttlogin;
}
bool unitSetMQTTLogin(String _mqttlogin)
{
	mqttlogin = _mqttlogin;
	return  onInsideChange("mqttlogin", String(mqttlogin));
}

//MQTTPassword()  
String unitGetMQTTPassword()
{
	if (propertyFileReaded.indexOf("mqttpassword;") < 0) return mqttpassword = _getStringPropertyValue("mqttpassword", DefaultMQTTPassword);
	else return mqttpassword;
}
bool unitSetMQTTPassword(String _mqttpassword)
{
	mqttpassword = _mqttpassword;
	return  onInsideChange("mqttpassword", String(mqttpassword));
}

//MQTTClientConnected
int unitGetMQTTClientConnected()
{
	return (int)(getMQTTClient()->connected());
}

//MQTTClientState
int unitGetMQTTClientState()
{
	return getMQTTClient()->state();
}

//OTAAvailable()  
int unitGetOTAAvailable()
{
	if (propertyFileReaded.indexOf("otaavailable;") < 0)
	{
		return otaavailable = _getIntPropertyValue("otaavailable", DefaultOTAAvailable);
	}
	else
	{
		return otaavailable;
	}
}
bool unitSetOTAAvailable(int _otaavailable)
{
	otaavailable = _otaavailable;
	return  onInsideChange("otaavailable", String(otaavailable));
}


//OTAPort()  
int unitGetOTAPort()
{
	if (propertyFileReaded.indexOf("otaport;") < 0) return otaport = _getIntPropertyValue("otaport", DefaultOTAPort);
	else return otaport;
}
bool unitSetOTAPort(int _otaport)
{
	otaport = _otaport;
	return  onInsideChange("otaport", String(otaport));
}

//OTAID()  
String unitGetOTAID()
{
	if (propertyFileReaded.indexOf("otaid;") < 0) return otaid = _getStringPropertyValue("otaid", DefaultOTAID + String(ESP.getChipId()));
	else return otaid;
}
bool unitSetOTAID(String _otaid)
{
	otaid = _otaid;
	return  onInsideChange("otaid", String(otaid));
}

//OTAPassword()  
String unitGetOTAPassword()
{
	if (propertyFileReaded.indexOf("otapassword;") < 0) return otapassword = _getStringPropertyValue("otapassword", DefaultOTAPassword);
	else return otapassword;
}
bool unitSetOTAPassword(String _otapassword)
{
	otapassword = _otapassword;
	return onInsideChange("otapassword", String(otapassword));
}

// WiFi parameters
//WiFiMode
WiFiMode_t unitGetWiFiMode()
{
	WiFiMode_t _wifimode = WiFi.getMode();
	if (_wifimode != wifimode) onInsideChange("wifimode", String(_wifimode));
	return wifimode = _wifimode;
}
bool unitSetWiFiMode(WiFiMode_t _wifimode)
{
	if (WiFi.mode(_wifimode))
	{
		wifimode = _wifimode;
		return onInsideChange("wifimode", String(wifimode));
	}
	return false;
}

// Get all WiFi modes
String unitGetAllWiFiModes()
{
	String result = "allwifimodes=";
	result += "0:WIFI_OFF;1:WIFI_STA;2:WIFI_AP;3:WIFI_AP_STA;";
	return result;
}

//GetWiFiRSSI
int32_t unitGetWiFiRSSI()
{
	int32_t _wifirssi = WiFi.RSSI();
	if (_wifirssi != wifirssi) onInsideChange("wifirssi", String(_wifirssi));
	return wifirssi = _wifirssi;
}
bool unitSetWiFiRSSI(int _wifirssi)
{
	return false;
}

//GetWiFiStatus
wl_status_t unitGetWiFiStatus()
{
	wl_status_t _wifistatus = WiFi.status();
	if (_wifistatus != wifistatus) onInsideChange("wifistatus", String(_wifistatus));
	return wifistatus = _wifistatus;
}
bool unitSetWiFiStatus(int _wifistatus)
{
	return false;
}

// Get all WiFi statuses
String unitGetAllWiFiStatuses()
{
	String result = "allwifistatuses=";
	result += "0:WL_IDLE_STATUS;";
	result += "1:WL_NO_SSID_AVAIL; ";
	result += "2:WL_SCAN_COMPLETED;";
	result += "3:WL_CONNECTED;";
	result += "4:WL_CONNECT_FAILED;";
	result += "5:WL_CONNECTION_LOST;";
	result += "6:WL_DISCONNECTED;";
	return result;
}

// Get WiFi status in String format
String unitGetWiFiStatusToString()
{
	wl_status_t wifistatus = unitGetWiFiStatus();
	if (wifistatus == WL_IDLE_STATUS) return "WL_IDLE_STATUS";
	if (wifistatus == WL_NO_SSID_AVAIL) return "WL_NO_SSID_AVAIL";
	if (wifistatus == WL_SCAN_COMPLETED) return "WL_SCAN_COMPLETED";
	if (wifistatus == WL_CONNECTED) return "WL_CONNECTED";
	if (wifistatus == WL_CONNECT_FAILED) return "WL_CONNECT_FAILED";
	if (wifistatus == WL_CONNECTION_LOST) return "WL_CONNECTION_LOST";
	if (wifistatus == WL_DISCONNECTED) return "WL_DISCONNECTED";
	return "unknown Wi-Fi status " + String(wifistatus);
}

//GetScanWiFiNetworks
int8_t unitGetScanWiFiNetworks()
{
	//TEMP
  //  if (wifinetworkscount != 0) return wifinetworkscount;
	bool asyncFalse = false;
	bool show_hiddenTrue = true;
	wifinetworkscount = WiFi.scanNetworks(asyncFalse, show_hiddenTrue);
	onInsideChange("wifinetworkscount", String(wifinetworkscount));
	return wifinetworkscount;
}
bool unitSetScanWiFiNetworks(int _scanwifinetworks)
{
	return false;
}

//GetWiFiNetworksCount
int8_t unitGetWiFiNetworksCount()
{
	/*if (wifinetworkscount != 0)*/ return wifinetworkscount;
	unitGetScanWiFiNetworks();
	onInsideChange("wifinetworkscount", String(wifinetworkscount));
	return wifinetworkscount;
}
bool unitSetWiFiNetworksCount(int _wifinetworkscount)
{
	return false;
}

//GetWiFiNetworksParameters
String unitGetWiFiNetworksParameters()
{
	String result = "wifinetworkscount=" + String(unitGetWiFiNetworksCount()) + "//r\n";
	for (int8_t i = 0; i < wifinetworkscount; i++)
	{
		String hidden;
		if (WiFi.isHidden(i))  hidden = ";hidden";
		else hidden = "";
		String encr;
		if (WiFi.encryptionType(i) == ENC_TYPE_NONE) encr = ";open";
		else encr = "";
		result += "wifinetwork" + String(i) + "=SSID:" + WiFi.SSID(i) + ";RSSI:" + String(WiFi.RSSI(i)) + ";channel:" + String(WiFi.channel(i)) + ";BSSID:" + WiFi.BSSIDstr(i) + encr + hidden + ";//r\n";
	}
	return result;
}
//bool unitSetWiFiNetworksParameters(String _wifinetworksparameters)
//{
//  return false;
//}

// Get all WiFi encryption types
String unitGetAllWiFiEncryptionTypes()
{
	String result = "allwifiencryptiontypes=";
	result += "5:ENC_TYPE_WEP;";
	result += "2:ENC_TYPE_TKIP;";
	result += "4:ENC_TYPE_CCMP;";
	result += "7:ENC_TYPE_NONE;";
	result += "8:ENC_TYPE_AUTO;";
	return result;
}

//WiFiIsConnected
int unitGetWiFiIsConnected()
{
	int _wifiisconnected = (int)WiFi.isConnected();
	if (_wifiisconnected != wifiisconnected) onInsideChange("wifiisconnected", String(_wifiisconnected));
	unitGetWiFiStatus();
	return wifiisconnected = _wifiisconnected;
}

bool unitSetWiFiIsConnected(int _connected1disconnected0)
{
	int _wifiisconnected;
	if (_connected1disconnected0 == 1) // command to connect
	{
		if (WiFi.begin(unitGetWiFiSSID(), unitGetWiFiPassword()) == WL_CONNECTED)
			_wifiisconnected = 1; // successful connection
		else _wifiisconnected = 0;
	}
	else if (_connected1disconnected0 == 0) // command to disconnect
	{
		WiFi.disconnect();
		_wifiisconnected = 0;
	}
	else return false;  // connected command don't 0 or 1
	// continue
	if (wifiisconnected != _wifiisconnected) onInsideChange("wifiisconnected", String(_wifiisconnected));
	unitGetWiFiStatus();
	wifiisconnected = _wifiisconnected;
	return true;
}

//GetConnectedWiFiSSID
String unitGetConnectedWiFiSSID()
{
	String _connectedwifissid = WiFi.SSID();
	if (!String(_connectedwifissid).equals(connectedwifissid)) onInsideChange("connectedwifissid", String(_connectedwifissid));
	connectedwifissid = _connectedwifissid;
	if (connectedwifissid.length() == 0) return " ";
	else return connectedwifissid;
}

/**/
//ESPResetInfo()  
String unitGetESPResetInfo()
{
	if (propertyFileReaded.indexOf("espresetinfo;") < 0) return espresetinfo = ESP.getResetInfo();
	else return espresetinfo;
}
bool unitSetESPResetInfo(String _espresetinfo)
{
	return false;
}

//ESPReset()  
int unitGetESPReset()
{
	if (propertyFileReaded.indexOf("espreset;") < 0) return espreset = DefaultESPReset;
	else return espreset;
}
bool unitSetESPReset(int _espreset)
{
	espreset = _espreset;
	bool result = onInsideChange("espreset", String(espreset));
	if (espreset == 1)
	{
		delay(100);
		ESP.reset();
	}
	return result;
}

//ESPRestart()  
int unitGetESPRestart()
{
	if (propertyFileReaded.indexOf("esprestart;") < 0) return esprestart = DefaultESPRestart;
	else return esprestart;
}
bool unitSetESPRestart(int _esprestart)
{
	esprestart = 1;
	bool result = onInsideChange("esprestart", String(esprestart));
	if (esprestart == 1)
	{
		delay(100);
		ESP.restart();
	}
	return result;
}

//ESPGetVcc()  
uint16_t unitGetESPVcc()
{
	if (propertyFileReaded.indexOf("espvcc;") < 0) return espvcc = ESP.getVcc();
	else return espvcc;
}
bool unitSetESPVcc(int _espvcc)
{
	return false;
}

//ESPGetChipId()  
uint32_t unitGetESPChipId()
{
	if (propertyFileReaded.indexOf("espchipid;") < 0) return espchipid = ESP.getChipId();
	else return espchipid;
}
bool unitSetESPChipId(int _espchipid)
{
	return false;
}

//ESPGetFreeHeap()  
uint32_t unitGetESPFreeHeap()
{
	if (propertyFileReaded.indexOf("espfreeheap;") < 0) return espfreeheap = ESP.getFreeHeap();
	else return espfreeheap;
}
bool unitSetESPFreeHeap(int _espfreeheap)
{
	return false;
}

//ESPGetMaxFreeBlockSize
uint16_t unitGetESPMaxFreeBlockSize()
{
	if (propertyFileReaded.indexOf("espmaxfreeblocksize;") < 0) return espmaxfreeblocksize = ESP.getMaxFreeBlockSize();
	else return espmaxfreeblocksize;
}
bool unitSetESPMaxFreeBlockSize(int _espmaxfreeblocksize)
{
	return false;
}

//ESPGetHeapFragmentation
uint8_t unitGetESPHeapFragmentation()
{
	if (propertyFileReaded.indexOf("espheapfragmentation;") < 0) return espheapfragmentation = ESP.getHeapFragmentation();
	else return espheapfragmentation;
}
bool unitSetESPHeapFragmentation(int _espheapfragmentation)
{
	return false;
}

//ESPGetSdkVersion
const char * unitGetESPSdkVersion()
{
	if (propertyFileReaded.indexOf("espsdkversion;") < 0) return espsdkversion = ESP.getSdkVersion();
	else return espsdkversion;
}
bool unitSetESPSdkVersion(String _espsdkversion)
{
	return false;
}

//ESPGetCoreVersion
String unitGetESPCoreVersion()
{
	if (propertyFileReaded.indexOf("espcoreversion;") < 0) return espcoreversion = ESP.getCoreVersion();
	else return espcoreversion;
}
bool unitSetESPCoreVersion(String _espcoreversion)
{
	return false;
}

//ESPGetFullVersion
String unitGetESPFullVersion()
{
	if (propertyFileReaded.indexOf("espfullversion;") < 0) return espfullversion = ESP.getFullVersion();
	else return espfullversion;
}

bool unitSetESPFullVersion(String _espfullversion)
{
	return false;
}

//ESPGetBootVersion
uint8_t unitGetESPBootVersion()
{
	if (propertyFileReaded.indexOf("espbootversion;") < 0) return espbootversion = ESP.getBootVersion();
	else return espbootversion;
}
bool unitSetESPBootVersion(int _espbootversion)
{
	return false;
}

//ESPGetBootMode
uint8_t unitGetESPBootMode()
{
	if (propertyFileReaded.indexOf("espbootmode;") < 0) return espbootmode = ESP.getBootMode();
	else return espbootmode;
}
bool unitSetESPBootMode(int _espbootmode)
{
	return false;
}

//ESPGetCpuFreqMHz
uint8_t unitGetESPCpuFreqMHz()
{
	if (propertyFileReaded.indexOf("espcpufreqmhz;") < 0) return espcpufreqmhz = ESP.getCpuFreqMHz();
	else return espcpufreqmhz;
}
bool unitSetESPCpuFreqMHz(int _espcpufreqmhz)
{
	return false;
}

//ESPGetFlashChipId
uint32_t unitGetESPFlashChipId()
{
	if (propertyFileReaded.indexOf("espflashchipid;") < 0) return espflashchipid = ESP.getFlashChipId();
	else return espflashchipid;
}
bool unitSetESPFlashChipId(int _espflashchipid)
{
	return false;
}

//ESPGetFlashChipVendorId
uint8_t unitGetESPFlashChipVendorId()
{
	if (propertyFileReaded.indexOf("espflashchipvendorid;") < 0) return espflashchipvendorid = ESP.getFlashChipVendorId();
	else return espflashchipvendorid;
}
bool unitSetESPFlashChipVendorId(int _espflashchipvendorid)
{
	return false;
}

//ESPGetFlashChipRealSize
uint32_t unitGetESPFlashChipRealSize()
{
	if (propertyFileReaded.indexOf("espflashchiprealsize;") < 0) return espflashchiprealsize = ESP.getFlashChipRealSize();
	else return espflashchiprealsize;
}
bool unitSetESPFlashChipRealSize(int _espflashchiprealsize)
{
	return false;
}

//ESPGetFlashChipSize
uint32_t unitGetESPFlashChipSize()
{
	if (propertyFileReaded.indexOf("espflashchipsize;") < 0) return espflashchipsize = ESP.getFlashChipSize();
	else return espflashchipsize;
}
bool unitSetESPFlashChipSize(int _espflashchipsize)
{
	return false;
}

//ESPGetFlashChipSpeed
uint32_t unitGetESPFlashChipSpeed()
{
	if (propertyFileReaded.indexOf("espflashchipspeed;") < 0) return espflashchipspeed = ESP.getFlashChipSpeed();
	else return espflashchipspeed;
}
bool unitSetESPFlashChipSpeed(int _espflashchipspeed)
{
	return false;
}

//ESPGetSketchSize
uint32_t unitGetESPSketchSize()
{
	if (propertyFileReaded.indexOf("espsketchsize;") < 0) return espsketchsize = ESP.getSketchSize();
	else return espsketchsize;
}
bool unitSetESPSketchSize(int _espsketchsize)
{
	return false;
}

//ESPGetFreeSketchSpace
uint32_t unitGetESPFreeSketchSpace()
{
	if (propertyFileReaded.indexOf("espfreesketchspace;") < 0) return espfreesketchspace = ESP.getFreeSketchSpace();
	else return espfreesketchspace;
}
bool unitSetESPFreeSketchSpace(int _espfreesketchspace)
{
	return false;
}

//ESPGetFlashChipMode
FlashMode_t unitGetESPFlashChipMode()
{
	if (propertyFileReaded.indexOf("espflashchipmode;") < 0) return espflashchipmode = ESP.getFlashChipMode();
	else return espflashchipmode;
}
bool unitSetESPFlashChipMode(int _espflashchipmode)
{
	return false;
}

//ESPGetSketchMD5
String unitGetESPSketchMD5()
{
	if (propertyFileReaded.indexOf("espsketchmd5;") < 0) return espsketchmd5 = ESP.getSketchMD5();
	else return espsketchmd5;
}
bool unitSetESPSketchMD5(String _espsketchmd5)
{
	return false;
}

//ESPGetResetReason
String unitGetESPResetReason()
{
	if (propertyFileReaded.indexOf("espresetreason;") < 0) return espresetreason = ESP.getResetReason();
	else return espresetreason;
}
bool unitSetESPResetReason(String _espresetreason)
{
	return false;
}

//ESPGetMagicFlashChipSize
uint32_t unitGetESPMagicFlashChipSize(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipsize;") < 0) return espmagicflashchipsize = ESP.magicFlashChipSize(byte);
	else return espmagicflashchipsize;
}
bool unitSetESPMagicFlashChipSize(int _espmagicflashchipsize)
{
	return false;
}

//ESPGetMagicFlashChipSpeed
uint32_t unitGetESPMagicFlashChipSpeed(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipspeed;") < 0) return espmagicflashchipspeed = ESP.magicFlashChipSpeed(byte);
	else return espmagicflashchipspeed;
}
bool unitSetESPMagicFlashChipSpeed(int _espmagicflashchipspeed)
{
	return false;
}

//ESPGetMagicFlashChipMode
FlashMode_t unitGetESPMagicFlashChipMode(uint8_t byte)
{
	if (propertyFileReaded.indexOf("espmagicflashchipmode;") < 0) return espmagicflashchipmode = ESP.magicFlashChipMode(byte);
	else return espmagicflashchipmode;
}
bool unitSetESPMagicFlashChipMode(int _espmagicflashchipmode)
{
	return false;
}

//Pins 
String unitGetBusyPins()
{
	String __busyPins = devicesGetBusyPins();
	if (!String(__busyPins).equals(_busyPins)) onInsideChange("busypins", String(__busyPins));
	if (__busyPins.length() == 0) return " ";
	else return _busyPins = __busyPins;
}

String unitGetPinsMap()
{
	String _pinsMap = devicesGetPinsMap();
	if (!String(_pinsMap).equals(pinsMap)) onInsideChange("pinsmap", String(_pinsMap));
	return pinsMap = _pinsMap;
}

//UpdateAvailable()  
int unitGetUpdateAvailable()
{
	if (propertyFileReaded.indexOf("updateavailable;") < 0)
	{
		return updateavailable = _getIntPropertyValue("updateavailable", DefaultUpdateAvailable);
	}
	else
	{
		return updateavailable;
	}
}
bool unitSetUpdateAvailable(int _updateavailable)
{
	updateavailable = _updateavailable;
	return  onInsideChange("updateavailable", String(updateavailable));
}

//UpdateHost
String unitGetUpdateHost()
{
	if (propertyFileReaded.indexOf("updatehost;") < 0) return updatehost = _getStringPropertyValue("updatehost", DefaultUpdateHost);
	else return updatehost;
}
bool unitSetUpdateHost(String _updatehost)
{	
	updatehost = _updatehost;
	return onInsideChange("updatehost", updatehost);
}
