
#include "../config.h"
#ifdef USE_OTA_SERVICE
#ifdef USE_ESP_DRIVER
#ifndef OTASERVICE_H
#define OTASERVICE_H

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <WiFi.h>
#include <ESPmDNS.h>
#endif

#include <Arduino.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

void OTABegin();
void OTALoop();
#endif
#endif
#endif