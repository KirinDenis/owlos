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
#include "../config.h"

#ifdef USE_ESP_DRIVER
#ifndef NETWORK_DRIVER_H
#define NETWORK_DRIVER_H

String nodeGetNetworkProperties();
String networkOnMessage(String route, String _payload, int8_t transportMask);

#ifdef USE_HTTP_SERVER
int nodeGetHTTPServerAvailable();
bool nodeSetHTTPServerAvailable(int _httpavailable);

String nodeGetHTTPServerUsername();
bool nodeSetHTTPServerUsername(String _httpserverlogin);

String nodeGetHTTPServerPassword();
bool nodeSetHTTPServerPassword(String _httpserverpwd);

int nodeGetHTTPServerPort();
bool nodeSetHTTPServerPort(int _httpserverport);
#endif

#ifdef USE_HTTPS_SERVER
int nodeGetHTTPSServerAvailable();
bool nodeSetHTTPSServerAvailable(int _httpsavailable);

String nodeGetHTTPSServerUsername();
bool nodeSetHTTPSServerUsername(String _httpsserverlogin);

String nodeGetHTTPSServerPassword();
bool nodeSetHTTPSServerPassword(String _httpsserverpwd);

int nodeGetHTTPSServerPort();
bool nodeSetHTTPSServerPort(int _httpsserverport);
#endif

#ifdef USE_HTTP_CLIENT
int nodeGetHTTPClientPort();
bool nodeSetHTTPClientPort(int _httpclientport);

String nodeGetHTTPClientURL();
bool nodeSetHTTPClientURL(String _httpclienturl);
#endif

#ifdef USE_MQTT
int nodeGetMQTTAvailable();
bool nodeSetMQTTAvailable(int _mqttavailable);

int nodeGetMQTTPort();
bool nodeSetMQTTPort(int _mqttport);

String nodeGetMQTTURL();
bool nodeSetMQTTURL(String _mqtturl);

String nodeGetMQTTID();
bool nodeSetMQTTID(String _mqttid);

String nodeGetMQTTLogin();
bool nodeSetMQTTLogin(String _mqttlogin);

String nodeGetMQTTPassword();
bool nodeSetMQTTPassword(String _mqttpassword);

int nodeGetMQTTClientConnected();
int nodeGetMQTTClientState();
#endif

#ifdef USE_OTA_SERVICE
int nodeGetOTAAvailable();
bool nodeSetOTAAvailable(int _otaavailable);

int nodeGetOTAPort();
bool nodeSetOTAPort(int _otaport);

String nodeGetOTAID();
bool nodeSetOTAID(String _otaid);

String nodeGetOTAPassword();
bool nodeSetOTAPassword(String _otapassword);
#endif

#ifdef USE_UPDATE_SERVICE
int nodeGetUpdateAvailable();
bool nodeSetUpdateAvailable(int _updateavailable);

String nodeGetUpdateHost();
bool nodeSetUpdateHost(String _updatehost);
#endif

#endif
#endif