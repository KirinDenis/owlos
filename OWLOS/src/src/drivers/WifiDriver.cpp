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


#include "WifiDriver.h"
#ifdef USE_ESP_DRIVER
#define ESP_ENABLE_INTERNAL_API
#include "ESPDriver.h"
#include "../services/DriverService.h"
#include "../services/FileService.h"
#include "../services/UpdateService.h"
#include "../services/TransportService.h"

extern String propertyFileReaded;
extern String topic;
extern String nodeid;
int wifiapavailable(DEFAULT_WIFI_ACCESS_POINT_AVAILABLE);
String wifiaccesspointssid(DEFAULT_WIFI_ACCESS_POINT_SSID);
String wifiappassword(DEFAULT_WIFI_ACCESS_POINT_PASSWORD);
String wifiaccesspointip(DEFAULT_WIFI_ACCESS_POINT_IP);
int wifiavailable(DEFAULT_WIFI_STATION_AVAILABLE);
String wifissid(DEFAULT_WIFI_STATION_SSID);
String wifipassword(DEFAULT_WIFI_STATION_PASSWORD);
String wifiip(NotAvailable);
int32_t wifirssi((int32_t)DEFAULT_ZERO_VALUE);

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
WiFiMode_t wifimode((WiFiMode_t)DEFAULT_WIFI_MODE);
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
wifi_mode_t wifimode((wifi_mode_t)DEFAULT_WIFI_MODE);
#endif

wl_status_t wifistatus((wl_status_t)DEFAULT_WIFI_STATUS);
String wifistatustostring(DEFAULT_WIFI_STATUS_TO_STR);
int wifiisconnected(DEFAULT_ZERO_VALUE);
String connectedwifissid(DEFAULT_EMPTY_STR_VALUE);
int8_t wifinetworkscount((int8_t)DEFAULT_ZERO_VALUE);

String nodeGetWiFiProperties() { 
	String result = "properties for:wifi\n";
	result += "id=wifi//r\n";
	result += "type=" + String(WiFiType) + "//r\n";
	result += "wifiaccesspointavailable=" + String(nodeGetWiFiAccessPointAvailable()) + "//bs\n";
	result += "wifiaccesspointssid=" + nodeGetWiFiAccessPointSSID() + "//s\n";
	result += "wifiappassword=" + nodeGetWiFiAccessPointPassword() + "//sp\n";
	result += "wifiaccesspointip=" + nodeGetWiFiAccessPointIP() + "//\n";
	result += "wifiavailable=" + String(nodeGetWiFiAvailable()) + "//bs\n";
	result += "wifissid=" + nodeGetWiFiSSID() + "//s\n";
	result += "wifipassword=" + nodeGetWiFiPassword() + "//ps\n";
	result += "wifiip=" + nodeGetWiFiIP() + "//\n";
	result += "wifiisconnected=" + String(nodeGetWiFiIsConnected()) + "//bs\n";
	result += "connectedwifissid=" + nodeGetConnectedWiFiSSID() + "//sr\n";
	result += "wifirssi=" + String(nodeGetWiFiRSSI()) + "//r\n";
	result += "wifimode=" + String(nodeGetWiFiMode()) + "//r\n";
	result += nodeGetAllWiFiModes() + "//r\n";
	result += "wifistatus=" + String(nodeGetWiFiStatus()) + "//r\n";
	result += "wifistatustostring=" + String(nodeGetWiFiStatusToString()) + "//r\n";
	result += nodeGetAllWiFiStatuses() + "//r\n";
	result += nodeGetWiFiNetworksParameters() + "//r\n";
	result += nodeGetAllWiFiEncryptionTypes() + "//r\n";

    return result;
}


String wifiOnMessage(String _topic, String _payload, int8_t transportMask) {
    String result = WrongPropertyName;
    if (String(topic + "/getwifiaccesspointavailable").equals(_topic)) {
        return String(onGetProperty("wifiapavailable", String(nodeGetWiFiAccessPointAvailable()), transportMask));
    } else if (String(topic + "/setwifiaccesspointavailable").equals(_topic)) {
        return String(nodeSetWiFiAccessPointAvailable(atoi(_payload.c_str())));
    } else if (String(topic + "/getwifiaccesspointssid").equals(_topic)) {
        return onGetProperty("wifiaccesspointssid", nodeGetWiFiAccessPointSSID(), transportMask);
    } else if (String(topic + "/setwifiaccesspointssid").equals(_topic)) {
        return String(nodeSetWiFiAccessPointSSID(_payload));
    } else if (String(topic + "/getwifiappassword").equals(_topic)) {
        return onGetProperty("wifipassword", nodeGetWiFiAccessPointPassword(), transportMask);
    } else if (String(topic + "/setwifiappassword").equals(_topic)) {
        return String(nodeSetWiFiAccessPointPassword(_payload));
    } else if (String(topic + "/getwifiaccesspointip").equals(_topic)) {
        return onGetProperty("wifiaccesspointip", nodeGetWiFiAccessPointIP(), transportMask);
    } else if (String(topic + "/setwifiaccesspointip").equals(_topic)) {
        return String(nodeSetWiFiAccessPointIP(_payload));
    } else if (String(topic + "/getwifiavailable").equals(_topic)) {
        return String(onGetProperty("wifiavailable", String(nodeGetWiFiAvailable()), transportMask));
    } else if (String(topic + "/setwifiavailable").equals(_topic)) {
        return String(nodeSetWiFiAvailable(atoi(_payload.c_str())));
    } else if (String(topic + "/getwifissid").equals(_topic)) {
        return onGetProperty("wifissid", nodeGetWiFiSSID(), transportMask);
    } else if (String(topic + "/setwifissid").equals(_topic)) {
        return String(nodeSetWiFiSSID(_payload));
    } else if (String(topic + "/getwifipassword").equals(_topic)) {
        return onGetProperty("wifipassword", nodeGetWiFiPassword(), transportMask);
    } else if (String(topic + "/setwifipassword").equals(_topic)) {
        return String(nodeSetWiFiPassword(_payload));
    } else if (String(topic + "/getwifiip").equals(_topic)) {
        return onGetProperty("wifiip", nodeGetWiFiIP(), transportMask);
    } else if (String(topic + "/setwifiip").equals(_topic)) {
        return String(nodeSetWiFiIP(_payload));
    } else if (String(topic + "/getwifiisconnected").equals(_topic)) {
        return onGetProperty("wifiisconnected", String(nodeGetWiFiIsConnected()), transportMask);
    } else if (String(topic + "/setwifiisconnected").equals(_topic)) {
        return String(nodeSetWiFiIsConnected(atoi(_payload.c_str())));
    } else if (String(topic + "/getconnectedwifissid").equals(_topic)) {
        return onGetProperty("connectedwifissid", nodeGetConnectedWiFiSSID(), transportMask);
    } else if (String(topic + "/getwifirssi").equals(_topic)) {
        return onGetProperty("wifirssi", String(nodeGetWiFiRSSI()), transportMask);
    } else if (String(topic + "/setwifirssi").equals(_topic)) {
        return String(nodeSetWiFiRSSI(atoi(_payload.c_str())));
    } else if (String(topic + "/getwifimode").equals(_topic)) {
        return onGetProperty("wifimode", String(nodeGetWiFiMode()), transportMask);
 #ifdef ARDUINO_ESP8266_RELEASE_2_5_0
    } else if (String(topic + "/setwifimode").equals(_topic)) {
        return String(nodeSetWiFiMode((WiFiMode_t)atoi(_payload.c_str())));
#endif
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
    } else if (String(topic + "/setwifimode").equals(_topic)) {
        return String(nodeSetWiFiMode((wifi_mode_t)atoi(_payload.c_str())));
#endif
    } else if (String(topic + "/getwifistatus").equals(_topic)) {
        return onGetProperty("wifistatus", String(nodeGetWiFiStatus()), transportMask);
    } else if (String(topic + "/setwifistatus").equals(_topic)) {
        return String(nodeSetWiFiStatus(atoi(_payload.c_str())));
    } else if (String(topic + "/getwifistatustostring").equals(_topic)) {
        return onGetProperty("wifistatustostring", String(nodeGetWiFiStatusToString()), transportMask);
    } else if (String(topic + "/getscanwifinetworks").equals(_topic)) {
        return onGetProperty("wifinetworkscount", String(nodeGetScanWiFiNetworks()), transportMask);
    } else if (String(topic + "/setscanwifinetworks").equals(_topic)) {
        return String(nodeSetScanWiFiNetworks(atoi(_payload.c_str())));
    } else if (String(topic + "/getwifinetworkscount").equals(_topic)) {
        return onGetProperty("wifinetworkscount", String(nodeGetWiFiNetworksCount()), transportMask);
    } else if (String(topic + "/setwifinetworkscount").equals(_topic)) {
        return String(nodeSetWiFiNetworksCount(atoi(_payload.c_str())));
    } else if (String(topic + "/getwifinetworksparameters").equals(_topic)) {
        return nodeGetWiFiNetworksParameters();
    } else if (String(topic + "/getallwifimodes").equals(_topic)) {
        return nodeGetAllWiFiModes();
    } else if (String(topic + "/getallwifistatuses").equals(_topic)) {
        return String(nodeGetAllWiFiStatuses());
    } else if (String(topic + "/getallwifiencryptiontypes").equals(_topic)) {
        return String(nodeGetAllWiFiEncryptionTypes());
    } 
 return WrongPropertyName;
}


//WiFi -----------------------------------------------------------------------------------------
//WiFiAccessPointAvailable
int nodeGetWiFiAccessPointAvailable()
{
	if (propertyFileReaded.indexOf("wifiapavailable;") < 0) return wifiapavailable = _getIntPropertyValue("wifiapavailable", DEFAULT_WIFI_ACCESS_POINT_AVAILABLE);
	else return wifiapavailable;
}

bool nodeSetWiFiAccessPointAvailable(int _wifiapavailable)
{
    debugOut("MY","nodeSetWiFiAccessPointAvailable");
	wifiapavailable = _wifiapavailable;
	return  onInsideChange("wifiapavailable", String(wifiapavailable));
}

//WiFiAccessPointSSID
String nodeGetWiFiAccessPointSSID()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (propertyFileReaded.indexOf("wifiaccesspointssid;") < 0) return wifiaccesspointssid = _getStringPropertyValue("wifiaccesspointssid", DEFAULT_ID + String(ESP.getChipId()));
	else return wifiaccesspointssid;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (propertyFileReaded.indexOf("wifiaccesspointssid;") < 0) return wifiaccesspointssid = _getStringPropertyValue("wifiaccesspointssid", DEFAULT_ID + String((int)ESP.getEfuseMac()));
	else return wifiaccesspointssid;
#endif
}

bool nodeSetWiFiAccessPointSSID(String _wifiaccesspointssid)
{
	wifiaccesspointssid = _wifiaccesspointssid;
	return  onInsideChange("wifiaccesspointssid", String(wifiaccesspointssid));
}
//WiFiAccessPointPassword
String nodeGetWiFiAccessPointPassword()
{
	if (propertyFileReaded.indexOf("wifiappassword;") < 0) return wifiappassword = _getStringPropertyValue("wifiappassword", DEFAULT_WIFI_ACCESS_POINT_PASSWORD);
	else return wifiappassword;
}

bool nodeSetWiFiAccessPointPassword(String _wifiappassword)
{
	wifiappassword = _wifiappassword;
	return  onInsideChange("wifiappassword", String(wifiappassword));
}
//WiFiAccessPointIP
String nodeGetWiFiAccessPointIP()
{
	if (nodeGetWiFiAccessPointAvailable() == 1)
	{
		IPAddress real_wifiaccesspointip = WiFi.softAPIP();
#ifdef DetailedDebug 
		debugOut(nodeid, "Current Access Point IP: " + real_wifiaccesspointip.toString());
#endif
		if (propertyFileReaded.indexOf("wifiaccesspointip;") < 0) wifiaccesspointip = _getStringPropertyValue("wifiaccesspointip", real_wifiaccesspointip.toString());

		if (!real_wifiaccesspointip.toString().equals(wifiaccesspointip))
		{
#ifdef DetailedDebug 
			debugOut(nodeid, "Current Access Point IP not equals");
#endif

			if (!nodeSetWiFiAccessPointIP(wifiaccesspointip))
			{
#ifdef DetailedDebug 
				debugOut(nodeid, "Can't change Access Point IP to: " + wifiaccesspointip);
#endif

				wifiaccesspointip = NotAvailable;
			}
		}
	}
	else
	{
		WiFi.softAPdisconnect(true);
		wifiaccesspointip = NotAvailable;
	}
#ifdef DetailedDebug 
	debugOut(nodeid, "wifiaccesspointip=" + wifiaccesspointip);
#endif

	return wifiaccesspointip;
}

bool nodeSetWiFiAccessPointIP(String _wifiaccesspointip)
{
	IPAddress real_wifiaccesspointip;
#ifdef DetailedDebug 
	debugOut(nodeid, "Current Access Point IP: " + WiFi.softAPIP().toString());
#endif

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
int nodeGetWiFiAvailable()
{
	if (propertyFileReaded.indexOf("wifiavailable;") < 0) return wifiavailable = _getIntPropertyValue("wifiavailable", DEFAULT_WIFI_STATION_AVAILABLE);
	else return wifiavailable;
}

bool nodeSetWiFiAvailable(int _wifiavailable)
{
	wifiavailable = _wifiavailable;
	return  onInsideChange("wifiavailable", String(wifiavailable));
}

//WiFiSSID
String nodeGetWiFiSSID()
{
	if (propertyFileReaded.indexOf("wifissid;") < 0) return wifissid = _getStringPropertyValue("wifissid", DEFAULT_WIFI_STATION_SSID);
	else return wifissid;
}

bool nodeSetWiFiSSID(String _wifissid)
{
	wifissid = _wifissid;
	return  onInsideChange("wifissid", String(wifissid));
}
//WiFiPassword
String nodeGetWiFiPassword()
{
	if (propertyFileReaded.indexOf("wifipassword;") < 0) return wifipassword = _getStringPropertyValue("wifipassword", DEFAULT_WIFI_STATION_PASSWORD);
	else return wifipassword;
}

bool nodeSetWiFiPassword(String _wifipassword)
{
	wifipassword = _wifipassword;
	return  onInsideChange("wifipassword", String(wifipassword));
}
//WiFiIP
String nodeGetWiFiIP()
{
	wifiip = WiFi.localIP().toString();
	return wifiip;
}
bool nodeSetWiFiIP(String _wifiip)
{
	return false; //local (client) WiFi IP can't be changed manualy
}

// WiFi parameters
//WiFiMode
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
WiFiMode_t nodeGetWiFiMode()
{
	WiFiMode_t _wifimode = WiFi.getMode();
	if (_wifimode != wifimode) onInsideChange("wifimode", String(_wifimode));
	return wifimode = _wifimode;
}

bool nodeSetWiFiMode(WiFiMode_t _wifimode)
{
	if (WiFi.mode(_wifimode))
	{
		wifimode = _wifimode;
		return onInsideChange("wifimode", String(wifimode));
	}
	return false;
}
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
wifi_mode_t nodeGetWiFiMode()
{
	wifi_mode_t _wifimode = WiFi.getMode();
	if (_wifimode != wifimode) onInsideChange("wifimode", String(_wifimode));
	return wifimode = _wifimode;
}

bool nodeSetWiFiMode(wifi_mode_t _wifimode)
{
	if (WiFi.mode(_wifimode))
	{
		wifimode = _wifimode;
		return onInsideChange("wifimode", String(wifimode));
	}
	return false;
}
#endif


// Get all WiFi modes
String nodeGetAllWiFiModes()
{
	String result = "allwifimodes=";
	result += "0:WIFI_OFF;1:WIFI_STA;2:WIFI_AP;3:WIFI_AP_STA;";
	return result;
}

//GetWiFiRSSI
int32_t nodeGetWiFiRSSI()
{
	int32_t _wifirssi = WiFi.RSSI();
	if (_wifirssi != wifirssi) onInsideChange("wifirssi", String(_wifirssi));
	return wifirssi = _wifirssi;
}
bool nodeSetWiFiRSSI(int _wifirssi)
{
	return false;
}

//GetWiFiStatus
wl_status_t nodeGetWiFiStatus()
{
	wl_status_t _wifistatus = WiFi.status();
	if (_wifistatus != wifistatus) onInsideChange("wifistatus", String(_wifistatus));
	return wifistatus = _wifistatus;
}
bool nodeSetWiFiStatus(int _wifistatus)
{
	return false;
}

// Get all WiFi statuses
String nodeGetAllWiFiStatuses()
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
String nodeGetWiFiStatusToString()
{
	wl_status_t wifistatus = nodeGetWiFiStatus();
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
int8_t nodeGetScanWiFiNetworks()
{
	//TEMP
  //  if (wifinetworkscount != 0) return wifinetworkscount;
	bool asyncFalse = false;
	bool show_hiddenTrue = true;
	wifinetworkscount = WiFi.scanNetworks(asyncFalse, show_hiddenTrue);
	onInsideChange("wifinetworkscount", String(wifinetworkscount));
	return wifinetworkscount;
}
bool nodeSetScanWiFiNetworks(int _scanwifinetworks)
{
	return false;
}

//GetWiFiNetworksCount
int8_t nodeGetWiFiNetworksCount()
{
	return wifinetworkscount;
}
bool nodeSetWiFiNetworksCount(int _wifinetworkscount)
{
	return false;
}

//GetWiFiNetworksParameters
String nodeGetWiFiNetworksParameters()
{
	String result = "wifinetworkscount=" + String(nodeGetWiFiNetworksCount()) + "//r\n";
	for (int8_t i = 0; i < wifinetworkscount; i++)
	{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
		result += "wifinetwork" + String(i) + "=SSID:" + WiFi.SSID(i) + ";RSSI:" + String(WiFi.RSSI(i)) + ";channel:" + String(WiFi.channel(i)) + ";BSSID:" + WiFi.BSSIDstr(i) + ";encryption:" + String(WiFi.encryptionType(i)) + ";hinden:" + String(WiFi.isHidden(i)) + ";//r\n";
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
		result += "wifinetwork" + String(i) + "=SSID:" + WiFi.SSID(i) + ";RSSI:" + String(WiFi.RSSI(i)) + ";channel:" + String(WiFi.channel(i)) + ";BSSID:" + WiFi.BSSIDstr(i) + ";encryption:" + String(WiFi.encryptionType(i)) + ";//r\n";
#endif
	}
	return result;
}
//bool nodeSetWiFiNetworksParameters(String _wifinetworksparameters)
//{
//  return false;
//}

// Get all WiFi encryption types
String nodeGetAllWiFiEncryptionTypes()
{
	String result = "allwifiencryptiontypes=";
	result += "5:ENC_MASK_WEP;";
	result += "2:ENC_MASK_TKIP;";
	result += "4:ENC_MASK_CCMP;";
	result += "7:ENC_MASK_NONE;";
	result += "8:ENC_MASK_AUTO;";
	return result;
}

//WiFiIsConnected
int nodeGetWiFiIsConnected()
{
	int _wifiisconnected = (int)WiFi.isConnected();
	if (_wifiisconnected != wifiisconnected) onInsideChange("wifiisconnected", String(_wifiisconnected));
	nodeGetWiFiStatus();
	return wifiisconnected = _wifiisconnected;
}

//https://github.com/KirinDenis/owlos/issues/7
bool nodeSetWiFiIsConnected(int _connected1disconnected0)
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	int _wifiisconnected;
	if (_connected1disconnected0 == 1) // command to connect
	{
		if (WiFi.begin(nodeGetWiFiSSID(), nodeGetWiFiPassword()) == WL_CONNECTED)
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
	nodeGetWiFiStatus();
	wifiisconnected = _wifiisconnected;
	return true;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return false;
#endif

}

//GetConnectedWiFiSSID
String nodeGetConnectedWiFiSSID()
{
	String _connectedwifissid = WiFi.SSID();
	if (!String(_connectedwifissid).equals(connectedwifissid)) onInsideChange("connectedwifissid", String(_connectedwifissid));
	connectedwifissid = _connectedwifissid;
	if (connectedwifissid.length() == 0) return " ";
	else return connectedwifissid;
}


#endif
