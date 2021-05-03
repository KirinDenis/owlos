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


String thingGetWiFiProperties();
String wifiOnMessage(String route, String _payload, int8_t transportMask);

int thingGetWiFiAccessPointAvailable();
bool thingSetWiFiAccessPointAvailable(int _wifiaccesspointavailable);

String thingGetWiFiAccessPointSSID();
bool thingSetWiFiAccessPointSSID(String _wifissid);

String thingGetWiFiAccessPointPassword();
bool thingSetWiFiAccessPointPassword(String _wifipassword);

String thingGetWiFiAccessPointIP();
bool thingSetWiFiAccessPointIP(String _wifiaccesspointip);

int thingGetWiFiAvailable();
bool thingSetWiFiAvailable(int _wifiavailable);

String thingGetWiFiSSID();
bool thingSetWiFiSSID(String _wifissid);

String thingGetWiFiPassword();
bool thingSetWiFiPassword(String _wifipassword);

String thingGetWiFiIP();
bool thingSetWiFiIP(String _wifiip);

// WiFi parameters
int32_t thingGetWiFiRSSI();
bool thingSetWiFiRSSI(int _currentwifirssi);

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
WiFiMode_t thingGetWiFiMode();
bool thingSetWiFiMode(WiFiMode_t _wifimode);
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
wifi_mode_t thingGetWiFiMode();
bool thingSetWiFiMode(wifi_mode_t _wifimode);
#endif

String thingGetAllWiFiModes();

wl_status_t thingGetWiFiStatus();
bool thingSetWiFiStatus(int _wifistatus);
String thingGetAllWiFiStatuses();
String thingGetWiFiStatusToString();

int8_t thingGetScanWiFiNetworks();
bool thingSetScanWiFiNetworks(int _scanwifinetworks);

int8_t thingGetWiFiNetworksCount();
bool thingSetWiFiNetworksCount(int _wifinetworkscount);

String thingGetWiFiNetworksParameters();
String thingGetAllWiFiEncryptionTypes();

int thingGetWiFiIsConnected();
bool thingSetWiFiIsConnected(int _wifiisconnected);

int thingGetWiFiIsDisconnected();
int thingSetWiFiIsDisconnected();

String thingGetConnectedWiFiSSID();

#endif
#endif
