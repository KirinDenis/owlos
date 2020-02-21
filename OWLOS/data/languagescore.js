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
with OWL OS. If not, see < https://www.gnu.org/licenses/>.

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

var langua = "prepareUnit=підготовка інтерфейсу користувача\n" +
    "dashboardTab=Панель пристроїв\n" +
    "unitTab=Модуль\n" +
    "settingsTab=Налаштування\n" +
    "filesTab=Файли\n" +
    "consoleTab=Консоль\n" +
    "network=мережа\n" +
    "unit=Модуль\n" +
    "esp=esp\n" +
    "reset=скидання\n"+
    "cancel=скасування\n"+
    "areYouSure=Ви впевнені?\n"+
    "resetunit=Перезавантажити модуль\n"+
    "autorefreshoff=автообновление: викл.\n"+
    "autorefreshon=автообновление: вкл\n"+
    "name=навзаніе\n"+
    "value=значення\n"+
    "newvalue=нове значення\n"+
    "property=властивість\n"+
    "top=вгору\n"+
    "dt_display=Відображати\n"+
    "dt_recordsperpage=записів на сторінці\n"+
    "dt_showing=Відображається c\n"+
    "dt_to=по\n"+
    "dt_of=всього\n"+
    "dt_entries=записів\n"+
    "dt_search=Пошук:\n"+
    "dt_first=Перша\n"+
    "dt_last=Остання\n"+
    "dt_next=Наступна\n"+
    "dt_previous=Попередня\n"+
    "adddevice=+ додати пристрій\n" +
    "addnode=+ додати вузол\n" +
    "addnodeheader=додати вузол\n" +
    "addnodehost=адреса вузла в мережі\n" +
    "addnodenickname=прізвисько\n" +
    "addnodebutton=додати\n" +
    "addnodeerror_hostempty=адреса вузла не може бути порожній\n" +
    "addnodeerror_hostnoturl=адреса вузла не відповідає HTTP(S) URL\n" +
    "addnodeerror_nicknameempty=прізвисько не може бути порожнім\n" +
    "addnodeerror_cantsaveconfig=неможливо зберегти настройки в модулі\n" +
    "addnodeerror_cantaddnode=неможливо додати модуль\n" +
    "upload=завантажити\n"+
    "files=файли\n"+
    "uploadfiles=завантажити файли в модуль\n"+
    "selectfiles=Будь ласка, виберіть файли\n" +
    "temperature=температура\n" +
    "humidity=вологість\n" +
    "dht=датчик температури і вологості (DHT)\n" +
    "sensor=датчик (sensor)\n" +
    "actuator=цифровий привід (actuator)\n" +
    "opto=оптична пара\n" +
    "valve=вентиль\n" +
    "light=освітленість\n" +
    "shortlight=освіт.\n" +
    "smoke=задимлення\n" +
    "stepper=кроковий двигун\n" +
    "lcd=рідко-кристалічний екран\n" +
    "led=світлодіод\n" +
    "beep=зумер\n" +
    "relay=реле\n" +
    "motion=рух\n" +
    "dark=темно\n" +
    "norm=середньо\n" +
    "high=висока\n" +
    "low=низька\n" +
    "smokelow=низьке\n" +
    "smokenorm=середне\n" +
    "smokehigh=високе\n" +    
    "yesmotion=є\n" +
    "nomotion=немає\n" +
    "rid_online=\n" +
    "rid_error=помилка\n" +
    "rid_connect=з'єднання...\n" +
    "rid_offline=не в мережі\n" +
    "lcd=екран\n" +
    "send=відпр.\n" +
    "clear=підсв.\n" +
	//connection statuses
	"connected=з'єднано\n"+
	"disconnected=роз'єднано\n" +
	"idlestatus=зміна статусу\n"+
    "nossidavailable=обрана мережа недоступна\n"+ 
	"scancompleted=сканування виконано\n"+
	"connectfailed=не вдається підключитися\n"+
    "connectionlost=підключення втрачено\n"+
    "nostate=не визначено\n"+
    "debugmode=режим налагодження\n"+
    "connectiontimeout=тайм-аут з'єднання\n"+
	"badprotocol=невірний протокол\n"+
    "badclientid=невірний ідентифікатор клієнта\n"+
    "unavailable=недоступно\n"+
    "badcredentials=невірні облікові дані\n"+
    "unauthorized=не дозволено\n"+
    "connectionstatus=Статус підключення: \n" +
    "detect=виявлено\n" +
    "notdetect=немає\n" +
    "getconfig=загрузка настроек UI\n" +
    "getconfigfailsparse=ошибка загрузки настроек UI\n" +
    "espfreesketchspace=Вільне місце прошивки\n" +
    "espfreeheap=Вільна динамічна пам'ять\n" +
    "wifirssi=Рівень WiFi сигналу\n" +
    "espcpufreqmhz=Частота CPU\n" +
    "espresetreason=Тип останнього скидання\n" +
    "update=Оновлення\n" +
    "updateinfo=Інформація про оновлення\n" +
    "noupdateinfo=Немає інформації про оновлення\n" +
    "updateexists=Оновлення доступні\n" +
    "updatenosense=Ви використовуєте останню версію\n" +
    "updateunpossible=Оновлення неможливо\n" +
    "updateuipossible=Можливо оновити тільки UI (потрібен апаратнэ скидання)\n" +
    "updatepossible=Оновлення можливі\n" +
    "downdateuipossible=Остарення можливі\n" +
    "firmware=Firmware\n" +
    "firmwareversion=Версія прошивки\n" +
    "firmwarebuildnumber=Збірка\n" +
    "updateuibutton=оновити UI\n" +
    "updatefirmwarebutton=оновити Firmware\n" +
    "updateunit=Оновлення\n" +
    "updateuibutton=почати оновлення UI\n" +
    "firmwarebutton=почати оновлення Firmware\n" +
    "updatefirmware=Після закінчення оновлення Firmware, модуль перезавантажиться автоматично. UI перезавантажиться через 30 секунд. Використовуйте монітор порту для більшої інформації\n" +
    "dashboard=Панель пристроїв\n" +
    "dashboardview=режим перегляду\n" +
    "dashboardedit=режим редагування\n" +
    "dashboardaddwidget=додати віджет\n" +
    "dashboardaddwidgetbutton=додати\n" +
    "nodeslist=список вузлів та пристроїв\n" +
    "devicesporplist=властивості пристроїв\n" +
    "widgetslist=список виджетів для вибраної властивості\n" +
    "networknodeprop=мережеві налаштування модуля\n" +
    "restfulavailable=включити підтримку Web (RESTful)\n" +
    "restfulserverusername=логін для Web сервера\n" +
    "restfulserverpassword=пароль для Web сервера\n" +
    "restfulserverport=порт Web сервера\n" +
    "restfulclienturl=URL RESTful сервера для клієнта\n" +
    "restfulclientport=порт RESTful сервера для клієнта\n" +
    "mqttavailable=включити підтримку MQTT\n" +
    "mqtturl=URL MQTT сервера\n" +
    "mqttport=порт MQTT сервера\n" +
    "mqttid=ID клієнта для MQTT\n" +
    "mqttlogin=логін\n" +
    "mqttpassword=пароль\n" +
    "otaavailable=включити підтримку OTA\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA порт\n" +
    "otapassword=клієнтський пароль\n" +
    "wifinodeprop=настройки WiFi модуля\n" +
    "wifiaccesspointavailable=включити режим WiFi точки доступу\n" +
    "wifiaccesspointssid=SSID для точки доступу\n" +
    "wifiaccesspointpassword=пароль для точки доступу\n" +
    "wifiavailable=включити режим WiFi станції (клієнта)\n" +
    "wifissid=SSID WiFi роутера\n" +
    "wifipassword=пароль WiFi роутера\n" +
    "wifiip=клієнтський IP\n" +
    "systemnodeprop=властивості системи\n" +
    "updatehost=URL сервера оновлень\n" +
    "updatenodeprop=панель оновлень прошивки\n" +
    "nodeproperties=властивості вузла\n" +
    "RESTful=пристрої\n" +  
    "adddevicedigalog=додати новий пристрій до вузлу\n" +
    "devicetype=тип пристрою\n" +
    "deviceid=ID пристрою\n" +
    "deviceidplaceholder=маленькими латинськими буквами без пробілів\n" +
    "pin=контактний роз'єм\n" +
    "adddevicebutton=додати\n" +
    "notused=не використовується\n" +
    "checkchangedialog=застосувати ці зміни\n" +
    "applycheck=застосувати\n" +    
    "showproperties=Властивості віджета\n" +
    "setallwidgetspropbutton=Застосувати до всіх\n" +
    "setpropbutton=Застосувати\n" +
    "saveaddedwidget=Збереження\n" +
    "closebutton=Закрити\n" +
    "createscript=+ додати скріпт\n" +
    "scripts=скріпти\n" +
    "scriptexecute=виконати (F8)\n" +
    "scriptpause=пауза\n" +
    "scriptdelete=вилучити\n" +    
    "language=ukraine\n";

var langen = "prepareUnit=prepare UI, please wait...\n" +
    "homeTab=Home\n" +
    "unitTab=Unit\n" +
    "settingsTab=Settings\n" +
    "filesTab=Files\n" +
    "consoleTab=Console\n" +
    "network=network\n" +
    "unit=unit\n" +
    "esp=ESP\n" +
    "reset=reset\n" +
    "cancel=cancel\n" +
    "areYouSure=Are you sure?\n" +
    "resetunit=Reset unit\n" +
    "autorefreshoff=auto refresh: OFF\n" +
    "autorefreshon=auto refresh: ON\n" +
    "name=name\n" +
    "value=value\n" +
    "newvalue=new value\n" +
    "property=property\n" +
    "top=top\n" +
    "dt_display=Display\n" +
    "dt_recordsperpage=records per page\n" +
    "dt_showing=Showing\n" +
    "dt_to=to\n" +
    "dt_of=of\n" +
    "dt_entries=enteries\n" +
    "dt_search=Search:\n" +
    "dt_first=First\n" +
    "dt_last=Laset\n" +
    "dt_next=Next\n" +
    "dt_previous=Previous\n" +
    "adddevice=+ add device\n" +
    "upload=upload\n" +
    "files=files\n" +
    "uploadfiles=upload files\n" +
    "selectfiles=select files\n" +
    "rid_online=\n" +
    "rid_error=error\n" +
    "rid_connect=connecting...\n" +
    "rid_offline=offline\n" +
    //connection statuses 
    "connected=connected\n" +
    "disconnected=disconnected\n" +
    "idlestatus=idle status\n" +
    "nossidavailable=no SSID available\n" +
    "scancompleted=scan is completed\n" +
    "connectfailed=connect is failed\n" +
    "connectionlost=connection is lost\n" +
    "nostate=no state\n" +
    "debugmode=debug mode\n" +
    "connectiontimeout=connection time-out\n" +
    "badprotocol=bad protocol\n" +
    "badclientid=bad client ID\n" +
    "unavailable=unavailable\n" +
    "badcredentials=bad credentials\n" +
    "unauthorized=unauthorized\n" +
    "connectionstatus=Connection status: \n" +
    "shortlight=light\n" +
    "getconfig=loading UI configuration\n" +
    "getconfigfailsparse=fail loading of UI configuration\n" +
    "espfreesketchspace=free firmware space\n" +
    "espfreeheap=free dynamic memory\n" +
    "wifirssi=WiFi signal strength\n" +
    "espcpufreqmhz=CPU frequency\n" +
    "espresetreason=type of last reset\n" +
    "update=Update\n" +
    "updateinfo=Update information\n" +
    "noupdateinfo=No information about update\n" +
    "updateexists=Update exists\n" +
    "updatenosense=You use lase version\n" +
    "updateunpossible=Update unpossible\n" +
    "updateuipossible=Posible update only UI (need hard reset)\n" +
    "updatepossible=Update possible\n" +
    "firmware=Firmware\n" +
    "firmwareversion=Firmware version\n" +
    "firmwarebuildnumber=Build\n" +
    "updateuibutton=update UI\n" +
    "updatefirmwarebutton=update Firmware\n" +
    "updateunit=Update\n" +
    "updateuibutton=starting update UI\n" +
    "firmwarebutton=starting update Firmware\n" +
    "updatefirmware=After firmware is updating, the unit self restarting. Please wait 30 sec, before the page after reloading. See Serial Monitor for more information.\n" +
    "networknodeprop=node network properties\n" +
    "restfulavailable=enable Web(RESTful) supporting\n" +
    "restfulserverusername=Web server login\n" +
    "restfulserverpassword=Web server password\n" +
    "restfulserverport=Web server port\n" +
    "restfulclienturl=RESTful client URL\n" +
    "restfulclientport=RESTful client port\n" +
    "mqttavailable=Enable MQTT supporting\n" +
    "mqtturl=MQTT server URL\n" +
    "mqttport=MQTT server port\n" +
    "mqttid=MQTT client ID\n" +
    "mqttlogin=login\n" +
    "mqttpassword=password\n" +
    "otaavailable=enable OTA supporting\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA port\n" +
    "otapassword=OTA client password\n" +
    "wifinodeprop=node WiFi properties\n" +
    "wifiaccesspointavailable=enable WiFi Access Point mode \n" +
    "wifiaccesspointssid=WiFi Access Point SSID\n" +
    "wifiaccesspointpassword=WiFi Access Point password\n" +
    "wifiavailable=enable WiFi Station mode\n" +
    "wifissid=WiFi router SSID\n" +
    "wifipassword=WiFi router password\n" +
    "wifiip=client IP\n" +
    "systemnodeprop=node system properties\n" +
    "updatehost=Update server URL\n" +
    "updatenodeprop=node update panel\n" +
    "nodeproperties=node properties\n" +
    "RESTfull=devices (RESTful API)\n" +
    "addnodeerror_hostempty=host can't be empty\n" +
    "addnodeerror_hostnoturl=host is not HTTP(S) URL\n" +
    "addnodeerror_nicknameempty=nickname can't be empty\n" +
    "addnodeerror_cantsaveconfig=can't save configuration to node\n" +
    "addnodeerror_cantaddnode=can't add node\n" +
    "adddevicedialog=add device\n" +
    "devicetype=device type\n" +
    "deviceid=device ID\n" +
    "deviceidplaceholder=in small latin letters without spaces\n" +
    "pin=pin connector \n" +
    "adddevicebutton=add device\n" +
    "notused=not used\n" +
    "checkchangedialog=apply this changes\n" +
    "applycheck=apply\n" +    
    "language=english\n";

var langru = "prepareUnit=подготовка интерфейса пользователя\n" +
    "homeTab=Главная\n" +
    "unitTab=Модуль\n" +
    "settingsTab=Настройки\n" +
    "filesTab=Файлы\n" +
    "consoleTab=Консоль\n" +
    "network=Сетъ\n" +
    "unit=Модуль\n" +
    "esp=ESP\n" +
    "reset=сброс\n" +
    "cancel=отмена\n" +
    "areYouSure=Вы уверены?\n" +
    "resetunit=Перезагрузить модуль\n" +
    "autorefreshoff=автообновление: выкл.\n" +
    "autorefreshon=автообновление: вкл\n" +
    "name=навзание\n" +
    "value=значение\n" +
    "newvalue=новое значение\n" +
    "property=свойство\n" +
    "top=вверх\n" +
    "dt_display=Отображать\n" +
    "dt_recordsperpage=записей на странице\n" +
    "dt_showing=Отображается c\n" +
    "dt_to=по\n" +
    "dt_of=всего\n" +
    "dt_entries=записей\n" +
    "dt_search=Поиск:\n" +
    "dt_first=Первая\n" +
    "dt_last=Последняя\n" +
    "dt_next=Следующая\n" +
    "dt_previous=Предидущая\n" +
    "adddevice=+ добавить устройство\n" +
    "upload=загрузить\n" +
    "files=файлы\n" +
    "uploadfiles=загрузить файлы в модуль\n" +
    "selectfiles=выбирите файлы\n" +
    //devices IDs translate
    "temperature=температура\n" +
    "humidity=влажность\n" +
    "light=освещённость\n" +
    "shortlight=освіт.\n" +
    "smoke=задымление\n" +
    "led=светодиод\n" +
    "beep=зумер\n" +
    "relay=реле\n" +
    "motion=движение\n" +
    "dark=темно\n" +
    "norm=средне\n" +
    "high=высокое\n" +
    "low=низкое\n" +
    "smokelow=низкое\n" +
    "smokenorm=средне\n" +
    "smokehigh=высокое\n" +    
    "yesmotion=есть\n" +
    "nomotion=нет\n" +

    "rid_online=\n" +
    "rid_error=ошибка\n" +
    "rid_connect=соединение...\n" +
    "rid_offline=не в сети\n" +
    "lcd=экран\n" +
    "send=отпр.\n" +
    "clear=очис.\n" +
	//connection statuses
	"connected=подключено\n"+
	"disconnected=разъединено\n" +
	"idlestatus=смена статуса\n"+
    "nossidavailable=выбранная сеть не доступна\n"+ 
	"scancompleted=сканирование завершено\n"+
	"connectfailed=не удается подключиться\n"+
    "connectionlost=подключение утрачено\n"+
    "nostate=не определен\n"+
    "debugmode=режим отладки\n"+
    "connectiontimeout=время соединения вышло\n"+
	"badprotocol=неверный протокол\n"+
    "badclientid=неверный идентификатор клиента\n"+
    "unavailable=не доступно\n"+
    "badcredentials=неверные учетные данные\n"+
    "unauthorized=не разрешено\n"+
    "connectionstatus=Статус подключения: \n" +
    "detect=обнаружено\n" +
    "notdetect=нет\n" +
    "getconfig=загрузка настроек UI\n" +
    "getconfigfailsparse=ошибка загрузки настроек UI\n" +
    "espfreesketchspace=свободное место прошивки\n" +
    "espfreeheap=свободная динамическая память\n" +
    "wifirssi=уровень WiFi сигнала\n" +
    "espcpufreqmhz=частота CPU\n" +
    "espresetreason=тип последнего сброса\n" +
    "update=Обнобления\n" +
    "updateinfo=Информация об обновлениях\n" +
    "noupdateinfo=Нет информации об обновлениях\n" +
    "updateexists=Обновления доступны\n" +
    "updatenosense=Вы используете последнею версию\n" +
    "updateunpossible=Обновление невозможно\n" +
    "updateuipossible=Возможно обновить только UI (нужен аппаратный сброс)\n" +
    "updatepossible=Обновления возможны\n" +
    "firmware=Прошивка\n" +
    "firmwareversion=Версия прошивки\n" +
    "firmwarebuildnumber=Сборка\n" +
    "updateuibutton=обновить UI\n" +
    "updatefirmwarebutton=обновить прошивку\n" +
    "updateunit=Обновление\n" +
    "updateuibutton=начать обновление UI\n" +
    "firmwarebutton=начать обновление Firmware\n" +
    "updatefirmware=После окончания обновления прошивки, модуть перезапустится автоматически. UI перезагрузится через 30 секунд. Используйте монитор порта для большей информации\n" +
    "restfulavailable=включить поддержку Web(RESTful)\n" +
    "restfulserverusername=логин для Web сервера\n" +
    "restfulserverpassword=пароль для Web сервера\n" +
    "restfulserverport=порт Web сервера\n" +
    "restfulclienturl=URL RESTful сервера для клиента\n" +
    "restfulclientport=порт RESTful сервера для клиента\n" +
    "mqttavailable=Включить поддержку MQTT\n" +
    "mqtturl=URL MQTT сервера\n" +
    "mqttport=порт MQTT сервера\n" +
    "mqttid=ID клиента для MQTT\n" +
    "mqttlogin=логин\n" +
    "mqttpassword=пароль\n" +
    "otaavailable=включить поддержку OTA\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA порт\n" +
    "otapassword=клиентский пароль\n" +
    "wifinodeprop=настройки WiFi модуля\n" +
    "wifiaccesspointavailable=включить режим WiFi точки доступа\n" +
    "wifiaccesspointssid=SSID для точки доступа\n" +
    "wifiaccesspointpassword=password для точки доступа\n" +
    "wifiavailable=включить режим WiFi станции (клиента)\n" +
    "wifissid=SSID WiFi роутера\n" +
    "wifipassword=пароль WiFi роутера\n" +
    "wifiip=клиентский IP\n" +
    "systemnodeprop=свойства системы\n" +
    "updatehost=URL сервера обновлений\n" +
    "updatenodeprop=панель обновлений прошивки\n" +
    "addnodeerror_hostempty=хост не может быть пуст\n" +
    "addnodeerror_hostnoturl=хост не соответствует HTTP(S) URL\n" +
    "addnodeerror_nicknameempty=никнаме не может быть пустым\n" +
    "addnodeerror_cantsaveconfig=невозможно сохранить настройки в модуле\n" +
    "addnodeerror_cantaddnode=невозможно добавить модуль\n" +
    "adddevicedialog=добавить новое устройство\n" +
    "devicetype=тип устройства\n" +
    "deviceid=ID устройства\n" +
    "deviceidplaceholder=маленькими латинскими буквами без пробелов\n" +
    "pin=контактный разьем \n" +
    "adddevicebutton=добавить\n" +
    "language=russian\n";


var currentLang = "";
var lastLang = "";

function getLang(key) {
    try {
        if (configProperties != undefined) {
            if (configProperties.language !== lastLang) {
                lastLang = configProperties.language;
                currentLang = "";
            }
        }
        else {
            currentLang = "en";
        }

        if (currentLang == "") {
            if (configProperties.language.indexOf("ua") == 0) {
                currentLang = langua.split("\n");
            }
            else
                if (configProperties.language.indexOf("ru") == 0) {
                    currentLang = langru.split("\n");
                }
                else {
                    currentLang = langen.split("\n");
                }
        }

        for (var i = 0; i < currentLang.length; i++) {
            if (currentLang[i] === "") continue;
            if (currentLang[i].indexOf(key + "=") == 0) {
                return currentLang[i].split("=")[1];
            }
        }
        
    } catch (exceptio) {
        //return "key" if exception or not found
    }
    return key;
}