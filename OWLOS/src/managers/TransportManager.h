#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

#include "..\Transports\MQTTClient.h"

#define TransportID "Transport"
MQTTClient* getMQTTClient();

bool transportBegin();
bool transportAvailable();
bool WiFiAccessPointReconnect();
bool transportReconnect();
bool MQTTReconnect();
void transportSetCallBack(MQTT_CALLBACK_SIGNATURE);
void MQTTCallback(char* topic, byte* payload, unsigned int length);
void transportSubscribe(String topic);
void transportLoop();
bool transportPublish(String topic, String payload);

ESP8266WiFiMulti transportGetWifiMulti();

