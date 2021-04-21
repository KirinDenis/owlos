#include "../config.h"

#ifdef USE_ESP_DRIVER
#ifndef WiFi_DRIVER_H
#define WiFi_DRIVER_H

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266WiFi.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <rom/rtc.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiType.h>

#endif


String nodeGetWiFiProperties();
String wifiOnMessage(String route, String _payload, int8_t transportMask);

int nodeGetWiFiAccessPointAvailable();
bool nodeSetWiFiAccessPointAvailable(int _wifiaccesspointavailable);

String nodeGetWiFiAccessPointSSID();
bool nodeSetWiFiAccessPointSSID(String _wifissid);

String nodeGetWiFiAccessPointPassword();
bool nodeSetWiFiAccessPointPassword(String _wifipassword);

String nodeGetWiFiAccessPointIP();
bool nodeSetWiFiAccessPointIP(String _wifiaccesspointip);

int nodeGetWiFiAvailable();
bool nodeSetWiFiAvailable(int _wifiavailable);

String nodeGetWiFiSSID();
bool nodeSetWiFiSSID(String _wifissid);

String nodeGetWiFiPassword();
bool nodeSetWiFiPassword(String _wifipassword);

String nodeGetWiFiIP();
bool nodeSetWiFiIP(String _wifiip);

// WiFi parameters
int32_t nodeGetWiFiRSSI();
bool nodeSetWiFiRSSI(int _currentwifirssi);

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
WiFiMode_t nodeGetWiFiMode();
bool nodeSetWiFiMode(WiFiMode_t _wifimode);
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
wifi_mode_t nodeGetWiFiMode();
bool nodeSetWiFiMode(wifi_mode_t _wifimode);
#endif

String nodeGetAllWiFiModes();

wl_status_t nodeGetWiFiStatus();
bool nodeSetWiFiStatus(int _wifistatus);
String nodeGetAllWiFiStatuses();
String nodeGetWiFiStatusToString();

int8_t nodeGetScanWiFiNetworks();
bool nodeSetScanWiFiNetworks(int _scanwifinetworks);

int8_t nodeGetWiFiNetworksCount();
bool nodeSetWiFiNetworksCount(int _wifinetworkscount);

String nodeGetWiFiNetworksParameters();
String nodeGetAllWiFiEncryptionTypes();

int nodeGetWiFiIsConnected();
bool nodeSetWiFiIsConnected(int _wifiisconnected);

int nodeGetWiFiIsDisconnected();
int nodeSetWiFiIsDisconnected();

String nodeGetConnectedWiFiSSID();

#endif
#endif
