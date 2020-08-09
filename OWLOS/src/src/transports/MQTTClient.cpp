#include "MQTTClient.h"

#ifdef USE_MQTT
#include "../libraries/AsyncMqttClient/AsyncMqttClient.h"
#include <WiFi.h>

#ifdef USE_ESP_DRIVER
#include "../drivers/ESPDriver.h"
#ifdef USE_DRIVERS			
#include "../services/DriverService.h"
#endif
#endif

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;

void onMqttConnect(bool sessionPresent) {

    xTimerStop(mqttReconnectTimer, 0);
    debugOut("MQTT", "Connected to MQTT");
    debugOut("MQTT","Session present: " + sessionPresent);
    
    #ifdef USE_ESP_DRIVER
    nodeSubscribe();
    #endif
    /*
     uint16_t packetIdSub = mqttClient.subscribe("test/lol", 2);
     //Serial.print("Subscribing at QoS 2, packetId: ");
     //Serial.println(packetIdSub);
     mqttClient.publish("test/lol", 0, true, "test 1");
     //Serial.println("Publishing at QoS 0");
     uint16_t packetIdPub1 = mqttClient.publish("test/lol", 1, true, "test 2");
     //Serial.print("Publishing at QoS 1, packetId: ");
     //Serial.println(packetIdPub1);
     uint16_t packetIdPub2 = mqttClient.publish("test/lol", 2, true, "test 3");
     //Serial.print("Publishing at QoS 2, packetId: ");
     //Serial.println(packetIdPub2);
    */
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
    debugOut("MQTT","Disconnected from MQTT");

    if (WiFi.isConnected()) {
        xTimerStart(mqttReconnectTimer, 0);
    }
}

void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
    debugOut("MQTT","Subscribe acknowledged.");
    debugOut("MQTT","  packetId: ");
    debugOut("MQTT", String(packetId));
    debugOut("MQTT","  qos: ");
    debugOut("MQTT", String(qos));
}

void onMqttUnsubscribe(uint16_t packetId) {
    //Serial.println("Unsubscribe acknowledged.");
    //Serial.print("  packetId: ");
    //Serial.println(packetId);
}

void onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
    debugOut("MQTT","Publish received.");
    debugOut("MQTT","  topic: ");
    debugOut("MQTT",topic);

    #ifdef USE_ESP_DRIVER
    //first check is Unit property?
    if (nodeOnMessage(String(topic), String(payload), MQTTMask).equals(WrongPropertyName))
    {
        //if not UNIT property
        //Put recieved message to all drivers, each driver can process any topic recieved by Unit
        #ifdef USE_DRIVERS			
        driversCallback(String(topic), String(payload));
        #endif			

    }
    #endif			    

    //Serial.print("  qos: ");
    //Serial.println(properties.qos);
    //Serial.print("  dup: ");
    //Serial.println(properties.dup);
    //Serial.print("  retain: ");
    //Serial.println(properties.retain);
    //Serial.print("  len: ");
    //Serial.println(len);
    //Serial.print("  index: ");
    //Serial.println(index);
    //Serial.print("  total: ");
    //Serial.println(total);
}

void onMqttPublish(uint16_t packetId) {
    debugOut("MQTT","Publish acknowledged.");
    debugOut("MQTT","  packetId: ");
    debugOut("MQTT", String(packetId));
}

void MQTTPublish(String _topic, String _payload)
{
    //Serial.print("Publish ");
    //Serial.println(_topic);
    uint16_t packetIdPub1 =   mqttClient.publish(_topic.c_str(), 0, true, _payload.c_str());
    //Serial.print("Publishing at QoS 1, packetId: ");
    //Serial.println(packetIdPub1);
}

void MQTTSubscribe(String _topic)
{
    debugOut("MQTT","Subscribe ");
    debugOut("MQTT",_topic);

    uint16_t packetIdSub = mqttClient.subscribe(_topic.c_str(), 2);
    debugOut("MQTT","Subscribing at QoS 2, packetId: ");
    debugOut("MQTT", String(packetIdSub));
}
/*
  //uint16_t packetIdSub = mqttClient.subscribe("test/lol", 2);
  ////Serial.print("Subscribing at QoS 2, packetId: ");
  ////Serial.println(packetIdSub);
  //mqttClient.publish("test/lol", 0, true, "test 1");
  ////Serial.println("Publishing at QoS 0");
  uint16_t packetIdPub1 = mqttClient.publish("test/lol", 1, true, "test 2");
  //Serial.print("Publishing at QoS 1, packetId: ");
  //Serial.println(packetIdPub1);
  uint16_t packetIdPub2 = mqttClient.publish("test/lol", 2, true, "test 3");
  //Serial.print("Publishing at QoS 2, packetId: ");
  //Serial.println(packetIdPub2);
*/

void reconnectToMQTT() {
    debugOut("MQTT","Connecting to MQTT...");
    if ((WiFi.isConnected()) && (!mqttClient.connected()))
    {
        mqttClient.connect();
    }
    else
    {
        xTimerStop(mqttReconnectTimer, 0);
    }
}

void MQTTDisconnect() {
    debugOut("MQTT","Disconnect to MQTT...");
    xTimerStop(mqttReconnectTimer, 0);
    mqttClient.disconnect();
}

void MQTTConnect() {
    xTimerStart(mqttReconnectTimer, 0);
}

bool MQTTBegin()
{
    mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(2000), pdTRUE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(reconnectToMQTT));

    mqttClient.onConnect(onMqttConnect);
    mqttClient.onDisconnect(onMqttDisconnect);
    mqttClient.onSubscribe(onMqttSubscribe);
    mqttClient.onUnsubscribe(onMqttUnsubscribe);
    mqttClient.onMessage(onMqttMessage);
    mqttClient.onPublish(onMqttPublish);
    mqttClient.setClientId("clientId-6KJqY90E1s");
    mqttClient.setServer("broker.mqttdashboard.com", 1883);

    return true;
}

#endif