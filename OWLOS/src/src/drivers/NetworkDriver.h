/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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

String thingGetNetworkProperties();
String networkOnMessage(String route, String _payload, int8_t transportMask);

#ifdef USE_HTTP_SERVER
int thingGetHTTPServerAvailable();
bool thingSetHTTPServerAvailable(int _httpavailable);

String thingGetHTTPServerUsername();
bool thingSetHTTPServerUsername(String _httpserverlogin);

String thingGetHTTPServerPassword();
bool thingSetHTTPServerPassword(String _httpserverpwd);

int thingGetHTTPServerPort();
bool thingSetHTTPServerPort(int _httpserverport);
#endif

#ifdef USE_HTTPS_SERVER
int thingGetHTTPSServerAvailable();
bool thingSetHTTPSServerAvailable(int _httpsavailable);

String thingGetHTTPSServerUsername();
bool thingSetHTTPSServerUsername(String _httpsserverlogin);

String thingGetHTTPSServerPassword();
bool thingSetHTTPSServerPassword(String _httpsserverpwd);

int thingGetHTTPSServerPort();
bool thingSetHTTPSServerPort(int _httpsserverport);
#endif

#ifdef USE_HTTP_CLIENT
int thingGetHTTPClientAvailable();
bool thingSetHTTPClientAvailable(int _httpclientavailable);

int thingGetHTTPClientQueryInterval();
bool thingSetHTTPClientQueryInterval(int _httpclientqueryinterval);

int thingGetHTTPClientAirQualityOnly();
bool thingSetHTTPClientAirQualityOnly(int _httpclientairqualityonly);

String thingGetHTTPClientToken();
bool thingSetHTTPClientToken(String _httpclienttoken);

int thingGetHTTPClientPort();
bool thingSetHTTPClientPort(int _httpclientport);

String thingGetHTTPClientURL();
bool thingSetHTTPClientURL(String _httpclienturl);

int thingGetHTTPClientUseHTTPS();
bool thingSetHTTPClientUseHTTPS(int _httpclientusehttps);
#endif

#ifdef USE_MQTT
int thingGetMQTTAvailable();
bool thingSetMQTTAvailable(int _mqttavailable);

int thingGetMQTTPort();
bool thingSetMQTTPort(int _mqttport);

String thingGetMQTTURL();
bool thingSetMQTTURL(String _mqtturl);

String thingGetMQTTID();
bool thingSetMQTTID(String _mqttid);

String thingGetMQTTLogin();
bool thingSetMQTTLogin(String _mqttlogin);

String thingGetMQTTPassword();
bool thingSetMQTTPassword(String _mqttpassword);

int thingGetMQTTClientConnected();
int thingGetMQTTClientState();
#endif

#ifdef USE_OTA_SERVICE
int thingGetOTAAvailable();
bool thingSetOTAAvailable(int _otaavailable);

int thingGetOTAPort();
bool thingSetOTAPort(int _otaport);

String thingGetOTAID();
bool thingSetOTAID(String _otaid);

String thingGetOTAPassword();
bool thingSetOTAPassword(String _otapassword);
#endif

#ifdef USE_UPDATE_SERVICE
int thingGetUpdateAvailable();
bool thingSetUpdateAvailable(int _updateavailable);

String thingGetUpdateHost();
bool thingSetUpdateHost(String _updatehost);
#endif

#endif
#endif