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

/*
Важно:
Вы должны быть знакомы с архитектурой и устройством OWLOS драйверов - перед тем как использовать этот модуль. 
1.	OWLOS драйвер Network содержит свойствa для управления MQTT клиентом:
-	topic – это свойство определяет путь к текущему устройству под управлением OWLOS для MQTT Broker.
-	mqttavailable – включает MQTT Client.
-	Mqttport – порт MQTT Broker
-	Mqtturl – адрес MQTT Broker
-	Mqttid – Id MQTT клиента
-	Mqttlogin – логин 
-	Mqttpassword - пароль
-	Mqttclientconnected – состояние соединения
-	Mqttclientstate  - статус соединения


2.	OWLOS выстраивает полный путь к каждому свойству, каждого драйвера используя путь из NetworkDriver.topic. 
Например если топик “owlnode3415” и  есть драйвер актуатора с Id – led24 то путь к его управляющему свойству 
data будет “owlnode3415/led24/data”.
Таким образом если у вас несколько OWLOS устройств с одинаковыми Id драйверов, адресация для MQTT Broker может выглядеть так:
-	owlnode3415/led24/data
-	kitchen/led24/data
-	room1/led24/data

3.	OWLOS подписывается (Subscribe) на все свойства всех своих драйверов, используя путь (топик “owlnode3415/#”)

4.	Для каждого свойства предусмотрено ТРИ топика, два для управления и один для мониторинга. На примере led24.data:
-	owlnode3415/led24/data – высылается OWLOS к MQTT Broker когда значение свойства изменило свое значение. 
    Все подписанты этого топика получат данные о том что это свойство изменилось. 
-	owlnode3415/led24/setdata – префикс “set” позволяет установить значение свойства драйвера. Так как OWLOS является 
    подписантом корневого топика “owlnode3415/#” все топики нижнего уровня будут получены (другими словами OWLOS является 
    подписантом самой-себя). Любой клиент MQTT Broker к которому подключена OWLOS может изменять значения ее свойств 
    (разумеется если эти свойства доступны для записи). 
    ВАЖНО – новое значение свойства необходимо помещать в payload.
-	owlnode3415/led24/getdata – префикс “get” используется для опроса свойства OWLOS. Дело в том, что OWLOS отправляет 
    (publish) только значения тех свойств значения которых изменились. При этом очень часто возникает необходимость получить 
    значение свойства (даже если оно не было изменено). Сообщение отправленное с префиксом “get” заставит OWLOS отправить 
    в ответ (Publish) значение этого свойства со «стандартным» топиком owlnode3415/led24/data. 
*/

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
#ifdef DEBUG
    debugOut("MQTT", "OnConnected to MQTT, Session present: " + String(sessionPresent));
#endif
#ifdef USE_ESP_DRIVER
    nodeSubscribe();
#endif
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
#ifdef DEBUG
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
#ifdef DEBUG
        debugOut("MQTT", disconnectReason);
#endif
    }

    if (WiFi.isConnected())
    {
        xTimerStart(mqttReconnectTimer, 0);
    }
#endif
}

void onMqttSubscribe(uint16_t packetId, uint8_t qos)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
    debugOut("MQTT", "OnSubscribe acknowledged, packetId: " + String(packetId) + "  Qos: " + String(qos));
#endif
#endif
}

void onMqttUnsubscribe(uint16_t packetId)
{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
    debugOut("MQTT", "OnUnsubscribe acknowledged: " + String(packetId));
#endif
#endif
}

void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total)
{
    //cut payload buffer
    String _payload = String(payload).substring(index, len);
    String _topic = String(topic);
#ifdef DETAILED_DEBUG
#ifdef DEBUG
    debugOut("MQTT", "OnPublish received: " + _topic + " payload: " + _payload);
#endif
#endif
#ifdef USE_ESP_DRIVER
    //first check is Unit property?
    if (nodeOnMessage(_topic, _payload, MQTT_TRANSPORT_MASK).equals(WRONG_NODE_PROPERTY_NAME))
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
    debugOut("MQTT", "OnPublish acknowledged, packetId: " + String(packetId));
#endif
#endif
}

void MQTTPublish(String _topic, String _payload)
{
    if (WiFi.isConnected() && mqttClient.connected())
    {
#ifdef DETAILED_DEBUG
        uint16_t packetIdPub = mqttClient.publish(_topic.c_str(), 0, true, _payload.c_str());
#ifdef DEBUG
        debugOut("MQTT", "[DO]->Publish: " + _topic + " payload: " + _payload + " packetIdPub: " + String(packetIdPub));
#endif
#else
        mqttClient.publish(_topic.c_str(), 0, true, _payload.c_str());
#endif
    }
    //TODO: say about ignore publish to hight level
}

void MQTTSubscribe(String _topic)
{
#ifdef DETAILED_DEBUG
    uint16_t packetIdSub = mqttClient.subscribe(_topic.c_str(), 2);
#ifdef DEBUG
    debugOut("MQTT", "[DO]->Subscribe: " + _topic + " QoS 2, packetId: " + String(packetIdSub));
#endif
#else
    mqttClient.subscribe(_topic.c_str(), 2);
#endif
}

bool connectionAsyncBlocker = false;
void reconnectToMQTT()
{
    if (!connectionAsyncBlocker)
    {
        connectionAsyncBlocker = true;
        if ((WiFi.isConnected()) && (!mqttClient.connected()))
        {
#ifdef DEBUG
            debugOut("MQTT", "[DO]->Connecting to MQTT broker...");
#endif
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
#ifdef DEBUG
    debugOut("MQTT", "[DO]->Disconnect from MQTT");
#endif
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

    mqttClient.setClientId(stringToChar(nodeGetMQTTID()));
    mqttClient.setCredentials(stringToChar(nodeGetMQTTLogin()), stringToChar(nodeGetMQTTPassword()));
    mqttClient.setServer(stringToChar(nodeGetMQTTURL()), 1883);

#ifdef DEBUG
    debugOut("MQTT", "Client Id:" + nodeGetMQTTID());
#endif
#ifdef DEBUG
    debugOut("MQTT", "URL:" + nodeGetMQTTURL() + ":" + String(nodeGetMQTTPort()));
#endif
    return true;
}

#endif