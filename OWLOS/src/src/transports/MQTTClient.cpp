#include "MQTTClient.h"

#ifdef USE_ESP_DRIVER
#include "../drivers/ESPDriver.h"
#ifdef USE_DRIVERS
#include "../services/DriverService.h"
#endif
#endif

#ifdef USE_MQTT
#include "../libraries/AsyncMqttClient/AsyncMqttClient.h"
#include <WiFi.h>

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;

void onMqttConnect(bool sessionPresent)
{
    xTimerStop(mqttReconnectTimer, 0);
    debugOut("MQTT", "OnConnected to MQTT, Session present: " + String(sessionPresent));
#ifdef USE_ESP_DRIVER
    nodeSubscribe();
#endif
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
    if (Debug)
    {
        String disconnectReason = "OnDisconnected from MQTT: ";
        switch (reason)
        {

        case AsyncMqttClientDisconnectReason::TCP_DISCONNECTED:
            disconnectReason += "TCP_DISCONNECTED";
            break;

        case AsyncMqttClientDisconnectReason::MQTT_UNACCEPTABLE_PROTOCOL_VERSION:
            disconnectReason += "MQTT_UNACCEPTABLE_PROTOCOL_VERSION";
            break;

        case AsyncMqttClientDisconnectReason::MQTT_IDENTIFIER_REJECTED:
            disconnectReason += "MQTT_IDENTIFIER_REJECTED";
            break;

        case AsyncMqttClientDisconnectReason::MQTT_SERVER_UNAVAILABLE:
            disconnectReason += "MQTT_SERVER_UNAVAILABLE";
            break;

        case AsyncMqttClientDisconnectReason::MQTT_MALFORMED_CREDENTIALS:
            disconnectReason += "MQTT_MALFORMED_CREDENTIALS";
            break;

        case AsyncMqttClientDisconnectReason::MQTT_NOT_AUTHORIZED:
            disconnectReason += "MQTT_NOT_AUTHORIZED";
            break;

        case AsyncMqttClientDisconnectReason::ESP8266_NOT_ENOUGH_SPACE:
            disconnectReason += "ESP8266_NOT_ENOUGH_SPACE/ESP32?";
            break;

        case AsyncMqttClientDisconnectReason::TLS_BAD_FINGERPRINT:
            disconnectReason += "TLS_BAD_FINGERPRINT";
            break;

        default:
            disconnectReason += "UNKNOWN";
            break;
        }
        debugOut("MQTT", disconnectReason);
    }

    if (WiFi.isConnected())
    {
        xTimerStart(mqttReconnectTimer, 0);
    }
}

void onMqttSubscribe(uint16_t packetId, uint8_t qos)
{
    debugOut("MQTT", "OnSubscribe acknowledged, packetId: " + String(packetId) + "  Qos: " + String(qos));
}

void onMqttUnsubscribe(uint16_t packetId)
{
    debugOut("MQTT", "OnUnsubscribe acknowledged: " + String(packetId));
}

void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total)
{
    //cut payload buffer
    String _payload = String(payload).substring(index, len);
    String _topic = String(topic);
    debugOut("MQTT", "OnPublish received: " + _topic + " payload: " + _payload);
#ifdef USE_ESP_DRIVER
    //first check is Unit property?
    if (nodeOnMessage(_topic, _payload, MQTTMask).equals(WrongPropertyName))
    {
        //if not UNIT property
        //Put recieved message to all drivers, each driver can process any topic recieved by Unit
#ifdef USE_DRIVERS
        driversCallback(_topic, _payload);
#endif
    }
#endif
}

void onMqttPublish(uint16_t packetId)
{
    debugOut("MQTT", "OnPublish acknowledged, packetId: " + String(packetId));
}

void MQTTPublish(String _topic, String _payload)
{
    if (WiFi.isConnected() && mqttClient.connected())
    {
        uint16_t packetIdPub = mqttClient.publish(_topic.c_str(), 0, true, _payload.c_str());
        debugOut("MQTT", "[DO]->Publish: " + _topic + " payload: " + _payload + " packetIdPub: " + String(packetIdPub));
    }
    //TODO: say about ignore publish to hight level
}

void MQTTSubscribe(String _topic)
{
    uint16_t packetIdSub = mqttClient.subscribe(_topic.c_str(), 2);
    debugOut("MQTT", "[DO]->Subscribe: " + _topic + " QoS 2, packetId: " + String(packetIdSub));
}

bool connectionAsyncBlocker = false;
void reconnectToMQTT()
{
    if (!connectionAsyncBlocker)
    {
        connectionAsyncBlocker = true;
        if ((WiFi.isConnected()) && (!mqttClient.connected()))
        {
            debugOut("MQTT", "[DO]->Connecting to MQTT broker...");
            mqttClient.connect();
        }
        else
        {
            xTimerStop(mqttReconnectTimer, 0);
        }
        connectionAsyncBlocker = false;
    }
}

void MQTTDisconnect()
{
    debugOut("MQTT", "[DO]->Disconnect from MQTT");
    xTimerStop(mqttReconnectTimer, 0);
    mqttClient.disconnect();
}

void MQTTConnect()
{
    xTimerStart(mqttReconnectTimer, 0);
}

bool MQTTBegin()
{
    mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(2000), pdFALSE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(reconnectToMQTT));

    mqttClient.onConnect(onMqttConnect);
    mqttClient.onDisconnect(onMqttDisconnect);
    mqttClient.onSubscribe(onMqttSubscribe);
    mqttClient.onUnsubscribe(onMqttUnsubscribe);
    mqttClient.onMessage(onMqttMessage);
    mqttClient.onPublish(onMqttPublish);

    //  mqttClient.setClientId(nodeGetMQTTID().c_str());
    //String _url = nodeGetMQTTURL();
    String _url = "mqtt.eclipse.org";
    

    mqttClient.setServer("mqtt.eclipse.org", 1883);
    //mqttClient.setServer(nodeGetMQTTURL().c_str(), nodeGetMQTTPort());
    
    debugOut("MQTT", "Client Id:" + nodeGetMQTTID());
    debugOut("MQTT", "URL:" + nodeGetMQTTURL() + ":" + String(nodeGetMQTTPort()));
    return true;
}

#endif