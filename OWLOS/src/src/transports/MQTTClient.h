#ifndef MQTTCLIENT_H
#define MQTTCLIENT_H
#include "../config.h"

#ifdef USE_MQTT
bool MQTTBegin();
void MQTTPublish(String _topic, String _payload);
void MQTTSubscribe(String _topic);

#endif
#endif