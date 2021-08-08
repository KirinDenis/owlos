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

var langua = "prepareUnit=Підготовка інтерфейсу користувача\n" +
    "dashboardTab=Панель пристроїв\n" +
    "OK=Застосувати\n" +
    "thingTab=Модуль\n" +
    "settingsTab=Вузли\n" +
    "filesTab=Файли\n" +
    "consoleTab=Консоль\n" +
    "network=Мережа\n" +
    "thing=Модуль\n" +
    "esp=Esp\n" +
    "reset=Скидання\n" +
    "cancel=Скасувати\n" +
    "areYouSure=Ви впевнені?\n" +
    "resetthing=Перезавантажити модуль\n" +
    "autorefreshoff=Автооновлення: вимкн.\n" +
    "autorefreshon=Автообновление: вкл.\n" +
    "name=Ім'я\n" +
    "value=Значення\n" +
    "newvalue=Нове значення\n" +
    "property=Властивість\n" +
    "top=Вгору\n" +
    "dt_display=Відображати\n" +
    "dt_recordsperpage=записів на сторінці\n" +
    "dt_showing=Відображається c\n" +
    "dt_to=по\n" +
    "dt_of=всього\n" +
    "dt_entries=записів\n" +
    "dt_search=Пошук:\n" +
    "dt_first=Перша\n" +
    "dt_last=Остання\n" +
    "dt_next=Наступна\n" +
    "dt_previous=Попередня\n" +
    "adddriver=Додати драйвер\n" +
    "addthing=Додати вузол\n" +
    "addthingheader=Додати вузол\n" +
    "addthinghost=Адреса вузла в мережі\n" +
    "addthingnickname=Ім'я вузла\n" +
    "addthingbutton=Додати\n" +
    "addthingerror_hostempty=Адреса вузла не може бути порожньою\n" +
    "addthingerror_hostnoturl=Адреса вузла не відповідає формату HTTP(S) URL\n" +
    "addthingerror_nicknameempty=Iм'я не може бути порожнім\n" +
    "addthingerror_cantsaveconfig=Неможливо зберегти налаштування в вузлі\n" +
    "addthingerror_cantaddthing=Неможливо додати вузол\n" +
    "upload=Завантажити\n" +
    "files=Файли\n" +
    "uploadfiles=Завантажити файли до вузла\n" +
    "selectfiles=Будь ласка, виберіть файли\n" +
    "temperature=Температура\n" +
    "humidity=Вологість\n" +
    "dht=Датчик температури і вологості (DHT)\n" +
    "sensor=Датчик \n" +
    "actuator=Цифровий привід\n" +
    "opto=Оптична пара\n" +
    "valve=Вентиль\n" +
    "light=Детектор світла\n" +
    "shortlight=Освітленість\n" +
    "smoke=Детерктор задимлення\n" +
    "stepper=Кроковий двигун\n" +
    "lcd=Рідко-кристалічний екран\n" +
    "led=Світлодіод\n" +
    "beep=Зумер\n" +
    "relay=Реле\n" +
    "motion=Детектор руху\n" +
    "dark=Темно\n" +
    "norm=Середня\n" +
    "high=Висока\n" +
    "low=Низька\n" +
    "smokelow=Низька\n" +
    "smokenorm=Середня\n" +
    "smokehigh=Висока\n" +
    "yesmotion=Рух\n" +
    "nomotion=Немає\n" +
    "rid_online=В мережі\n" +
    "rid_error=Помилка\n" +
    "rid_connect=З'єднання...\n" +
    "rid_offline=Не в мережі\n" +
    "lcd=Екран\n" +
    "send=Відпр.\n" +
    "clear=Підсв.\n" +
    //connection statuses
    "connected=З'єднано\n" +
    "disconnected=Роз'єднано\n" +
    "idlestatus=Зміна статусу\n" +
    "nossidavailable=Обрана мережа недоступна\n" +
    "scancompleted=Сканування виконано\n" +
    "connectfailed=Не вдається підключитися\n" +
    "connectionlost=Підключення втрачено\n" +
    "nostate=Не визначено\n" +
    "debugmode=Режим налагодження\n" +
    "connectiontimeout=Тайм-аут з'єднання\n" +
    "badprotocol=Невірний протокол\n" +
    "badclientid=Невірний ідентифікатор клієнта\n" +
    "unavailable=Недоступно\n" +
    "badcredentials=Невірні облікові дані\n" +
    "unauthorized=Не дозволено\n" +
    "connectionstatus=Статус підключення: \n" +
    "detect=Є рух\n" +
    "notdetect=Немає\n" +
    "getconfig=Завантаження налаштувань UI\n" +
    "getconfigfailsparse=Помилка завантаження налаштувань UI\n" +
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
    "firmware=Прошивка\n" +
    "firmwareversion=Версія прошивки\n" +
    "firmwarebuildnumber=Збірка\n" +
    "updateuibutton=Оновити UI\n" +
    "updatefirmwarebutton=Оновити прошивку\n" +
    "updatething=Оновлення\n" +
    "updateuibutton=Почати оновлення UI\n" +
    "firmwarebutton=Почати оновлення прошивки\n" +
    "updatefirmware=Після закінчення оновлення прошивки, модуль перезавантажиться автоматично. UI перезавантажиться через 30 секунд. Використовуйте монітор порту для більшої інформації\n" +
    "dashboard=Панель пристроїв\n" +
    "dashboardview=Режим перегляду\n" +
    "dashboardedit=Режим редагування\n" +
    "dashboardaddwidget=Додати віджет\n" +
    "dashboardaddwidgetbutton=Додати\n" +
    "thingslist=Список вузлів/драйверів\n" +
    "driversporplist=Властивості драйвера\n" +
    "widgetslist=Список виджетів для обраної властивості\n" +
    "networkthingprop=Мережеві налаштування ноди\n" +
    "restfulavailable=Включити підтримку Web (RESTful)\n" +
    "webserverlogin=Логін для Web сервера\n" +
    "webserverpwd=Пароль для Web сервера\n" +
    "restfulserverport=Порт Web сервера\n" +
    "restfulclienturl=URL RESTful сервера для клієнта\n" +
    "restfulclientport=Порт RESTful сервера для клієнта\n" +
    "mqttavailable=Включити підтримку MQTT\n" +
    "mqtturl=URL MQTT сервера\n" +
    "mqttport=Порт MQTT сервера\n" +
    "mqttid=ID клієнта для MQTT\n" +
    "mqttlogin=Логін\n" +
    "mqttpassword=Пароль\n" +
    "otaavailable=Включити підтримку OTA\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA порт\n" +
    "otapassword=Клієнтський пароль\n" +
    "wifithingprop=Налаштування WiFi модуля\n" +
    "wifiaccesspointavailable=Включити режим WiFi точки доступу\n" +
    "wifiaccesspointssid=SSID для точки доступу\n" +
    "wifiappassword=Пароль для точки доступу\n" +
    "wifiavailable=Включити режим WiFi станції (клієнта)\n" +
    "wifissid=SSID WiFi роутера\n" +
    "wifipassword=Пароль WiFi роутера\n" +
    "wifiip=Клієнтський IP\n" +
    "systemthingprop=Властивості системи\n" +
    "updatehost=URL сервера оновлень\n" +
    "updatethingprop=Панель оновлень прошивки\n" +
    "thingproperties=Властивості вузла\n" +
    "drivers=Драйвери\n" +
    "adddriverdigalog=Додати драйвер до вузлу\n" +
    "drivertype=Тип драйвера\n" +
    "driverid=ID драйвера\n" +
    "driveridplaceholder=Маленькими латинськими буквами без пробілів\n" +
    "pin=Контактний роз'єм\n" +
    "adddriverbutton=Додати\n" +
    "notused=Не використовується\n" +
    "checkchangedialog=Застосувати зміни\n" +
    "applycheck=Застосувати\n" +
    "showproperties=Властивості віджета\n" +
    "setallwidgetspropbutton=Застосувати до всіх\n" +
    "setpropbutton=Застосувати\n" +
    "saveaddedwidget=Збереження\n" +
    "closebutton=Закрити\n" +
    "createscript=Додати скріпт\n" +
    "scripts=Скріпти\n" +
    "scriptexecute=Виконати (F8)\n" +
    "scriptpause=Пауза\n" +
    "scriptdelete=Вилучити\n" +
    "scriptstartdebug=Відлагоджувати\n" +
    "addscriptheader=Додати скріпт\n" +
    "addscriptbutton=Додати\n" +
    "addscriptname=Iм'я скріпта\n" +
    "inputcodehere=Сюди введіть код скріпту\n" +
    "autoaddwidget=Додати віджет\n" +
    "сhangessaved=Зміни збережені \n" +
    "savechangeserror=Помилка. Зміни не збережені. Спробуйте ще раз \n" +
    "savingchanges=Збереження змін\n" +
    "thingselect=Виберіть вузол\n" +
    "driverselect=Виберіть драйвер\n" +
    "propselect=Виберіть властивість\n" +
    "widgetselect=Виберіть віджет\n" +
    "tooglesidebar=Переключити бічну панель\n" +
    "pinsidebar=Закріпити бічну панель\n" +
    "saveconfiguration=Зберегти налаштування\n" +
    "tooglewidgetsmode=Переключити режим віджетів\n" +
    "addwidget=Додати віджет\n" +
    "createdriverdialog=Додати драйвер\n" +
    "addthingname=Додати вузол\n" +
    "size=розмір\n" +
    "radialwidget=Radial\n" +
    "language=ukraine\n";


var langen = "prepareUnit=prepare UI, please wait...\n" +
    "OK=Confirm\n" +
    "thingselect=1) Please select thing\n" +
    "driverselect=2) Select driver on selected thing\n" +
    "propselect=3) Select property of selected driver\n" +
    "widgetselect=4) Select widget to visualize selected driver property\n" +
    "thingTab=Thing\n" +
    "settingsTab=Things\n" +
    "filesTab=Files\n" +
    "consoleTab=Console\n" +
    "network=Network\n" +
    "thing=Thing\n" +
    "esp=ESP\n" +
    "reset=Reset\n" +
    "cancel=Сancel\n" +
    "areYouSure=Are you sure?\n" +
    "resetthing=Reset thing\n" +
    "autorefreshoff=Auto refresh: OFF\n" +
    "autorefreshon=Auto refresh: ON\n" +
    "name=Name\n" +
    "value=Value\n" +
    "newvalue=New value\n" +
    "property=Property\n" +
    "top=Top\n" +
    "dt_display=Display\n" +
    "dt_recordsperpage=Records per page\n" +
    "dt_showing=Showing\n" +
    "dt_to=to\n" +
    "dt_of=of\n" +
    "dt_entries=Enteries\n" +
    "dt_search=Search:\n" +
    "dt_first=First\n" +
    "dt_last=Laset\n" +
    "dt_next=Next\n" +
    "dt_previous=Previous\n" +
    "adddriver=Add driver\n" +
    "upload=Upload\n" +
    "files=Files\n" +
    "uploadfiles=Upload files\n" +
    "selectfiles=Select files\n" +
    "rid_online=Online \n" +
    "rid_error=Error \n" +
    "rid_connect=Connecting...\n" +
    "rid_offline=Offline\n" +
    "connected=Connected\n" +
    "disconnected=Disconnected\n" +
    "idlestatus=Idle status\n" +
    "nossidavailable=No SSID available\n" +
    "scancompleted=Scan is completed\n" +
    "connectfailed=Connection is failed\n" +
    "connectionlost=Connection is lost\n" +
    "nostate=No state\n" +
    "debugmode=Debug mode\n" +
    "connectiontimeout=Connection time-out\n" +
    "badprotocol=Bad protocol\n" +
    "badclientid=Bad client ID\n" +
    "unavailable=Unavailable\n" +
    "badcredentials=Bad credentials\n" +
    "unauthorized=Unauthorized\n" +
    "connectionstatus=Connection status: \n" +
    "shortlight=Light\n" +
    "getconfig=Loading UI configuration\n" +
    "getconfigfailsparse=Fail loading of UI configuration\n" +
    "espfreesketchspace=Free firmware space\n" +
    "espfreeheap=Free dynamic memory\n" +
    "wifirssi=WiFi signal strength\n" +
    "espcpufreqmhz=CPU frequency\n" +
    "espresetreason=Type of last reset\n" +
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
    "updateuibutton=Update UI\n" +
    "updatefirmwarebutton=Update Firmware\n" +
    "updatething=Update\n" +
    "updateuibutton=Starting update UI\n" +
    "firmwarebutton=Starting update Firmware\n" +
    "updatefirmware=After firmware is updating, the thing self restarting. Please wait 30 sec, before the page after reloading. See Serial Monitor for more information.\n" +
    "networkthingprop=Thing network properties\n" +
    "restfulavailable=Enable Web(RESTful) supporting\n" +
    "webserverlogin=Web server login\n" +
    "webserverpwd=Web server password\n" +
    "restfulserverport=Web server port\n" +
    "restfulclienturl=RESTful client URL\n" +
    "restfulclientport=RESTful client port\n" +
    "mqttavailable=Enable MQTT supporting\n" +
    "mqtturl=MQTT server URL\n" +
    "mqttport=MQTT server port\n" +
    "mqttid=MQTT client ID\n" +
    "mqttlogin=Login\n" +
    "mqttpassword=Password\n" +
    "otaavailable=Enable OTA supporting\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA port\n" +
    "otapassword=OTA client password\n" +
    "wifithingprop=Thing WiFi properties\n" +
    "wifiaccesspointavailable=Enable WiFi Access Point mode \n" +
    "wifiaccesspointssid=WiFi Access Point SSID\n" +
    "wifiappassword=WiFi Access Point password\n" +
    "wifiavailable=Enable WiFi Station mode\n" +
    "wifissid=WiFi router SSID\n" +
    "wifipassword=WiFi router password\n" +
    "wifiip=Client IP\n" +
    "systemthingprop=Thing system properties\n" +
    "updatehost=Update server URL\n" +
    "updatethingprop=Thing update panel\n" +
    "thingproperties=Thing properties\n" +
    "addthingerror_hostempty=Host can't be empty\n" +
    "addthingerror_hostnoturl=Host is not HTTP(S) URL\n" +
    "addthingerror_nicknameempty=Name can't be empty\n" +
    "addthingerror_cantsaveconfig=Can't save configuration to thing\n" +
    "addthingerror_cantaddthing=Can't add thing\n" +
    "drivertype=Driver type\n" +
    "driverid=Driver ID\n" +
    "driveridplaceholder=In small latin letters without spaces\n" +
    "pin=Pin connector \n" +
    "adddriverbutton=Add\n" +
    "notused=Not used\n" +
    "checkchangedialog=Apply this changes\n" +
    "applycheck=Apply\n" +
    "dashboardTab=Dashboard\n" +
    "addthing=Add thing\n" +
    "addthingheader=Adding thing\n" +
    "addthinghost=Thing network address\n" +
    "addthingnickname=Thing name\n" +
    "addthingbutton=Add\n" +
    "temperature=Temperature\n" +
    "humidity=Humidity\n" +
    "dht=Temperature & Humidity Sensor(DHT)\n" +
    "sensor=Sensor\n" +
    "actuator=Actuator\n" +
    "opto=Optocoupler\n" +
    "valve=Valve\n" +
    "light=Light detector\n" +
    "smoke=Smoke detector\n" +
    "stepper=Stepper motor\n" +
    "lcd=Liquid crystal display\n" +
    "led=Luminodiode\n" +
    "beep=Beep\n" +
    "relay=Relay\n" +
    "motion=Motion detector\n" +
    "dark=Dark\n" +
    "norm=Avarage\n" +
    "high=High\n" +
    "low=Low\n" +
    "smokelow=Low\n" +
    "smokenorm=Average\n" +
    "smokehigh=High\n" +
    "yesmotion=Motion\n" +
    "nomotion=No motion\n" +
    "lcd=Liquid crystal display\n" +
    "send=Send\n" +
    "clear=Clear\n" +
    "detect=Detected\n" +
    "notdetect=No motion\n" +
    "downdateuipossible=Old data\n" +
    "dashboard=Drivers panel\n" +
    "dashboardview=View mode\n" +
    "dashboardedit=Edit mode\n" +
    "dashboardaddwidget=Add widget\n" +
    "dashboardaddwidgetbutton=Add\n" +
    "thingslist=List of things/drivers \n" +
    "driversporplist=Drivers properties\n" +
    "widgetslist=List of compatible widgets\n" +
    "autoaddwidget=Add widget\n" +
    "drivers=Drivers\n" +
    "adddriverdigalog=Adding driver to thing\n" +
    "showproperties=Widget properties\n" +
    "setallwidgetspropbutton=Apply to all\n" +
    "setpropbutton=Apply\n" +
    "saveaddedwidget=Save\n" +
    "closebutton=Close\n" +
    "createscript=Add script\n" +
    "scripts=Scripts\n" +
    "scriptexecute=Run (F8)\n" +
    "scriptpause=Pause\n" +
    "scriptdelete=Delete\n" +
    "scriptstartdebug=Debug\n" +
    "addscriptheader=Adding script\n" +
    "addscriptbutton=Add\n" +
    "addscriptname=Script name\n" +
    "inputcodehere=Input script code here\n" +
    "сhangessaved=Changes saved\n" +
    "savechangeserror=Saving changes error. Close this window and try again later! \n" +
    "savingchanges=Saving changes\n" +
    "radialwidget=Radial\n" +
    "language=english\n";

var langru = "prepareUnit=Подготовка интерфейса пользователя\n" +
    "thingTab=Нода\n" +
    "settingsTab=Узлы\n" +
    "filesTab=Файлы\n" +
    "consoleTab=Консоль\n" +
    "network=Сетъ\n" +
    "thing=Нода\n" +
    "esp=ESP\n" +
    "reset=Сброс\n" +
    "cancel=Отмена\n" +
    "areYouSure=Вы уверены?\n" +
    "resetthing=Перезагрузить ноду\n" +
    "autorefreshoff=Автообновление: выкл.\n" +
    "autorefreshon=Автообновление: вкл\n" +
    "name=Имя\n" +
    "value=Значение\n" +
    "newvalue=Новое значение\n" +
    "property=Свойство\n" +
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
    "dt_previous=Предыдущая\n" +
    "adddriver=Добавить драйвер\n" +
    "upload=Загрузить\n" +
    "files=Файлы\n" +
    "uploadfiles=Загрузить файлы в ноду\n" +
    "selectfiles=Выбирите файлы\n" +
    "temperature=Температура\n" +
    "humidity=Влажность\n" +
    "light=Датчик освещённости\n" +
    "shortlight=Освещенность\n" +
    "smoke=Датчик задымления\n" +
    "led=Светодиод\n" +
    "beep=Зумер\n" +
    "relay=Реле\n" +
    "motion=Датчик движения\n" +
    "dark=Темно\n" +
    "norm=Среднее\n" +
    "high=Высокое\n" +
    "low=Низкое\n" +
    "smokelow=Низкое\n" +
    "smokenorm=Среднее\n" +
    "smokehigh=Высокое\n" +
    "yesmotion=Движение\n" +
    "nomotion=Нет\n" +
    "rid_online=В сети\n" +
    "rid_error=Ошибка\n" +
    "rid_connect=Соединение...\n" +
    "rid_offline=Не в сети\n" +
    "lcd=Жидкокристаллический экран\n" +
    "send=Отпр.\n" +
    "clear=Очис.\n" +
    "connected=Подключено\n" +
    "disconnected=Разъединено\n" +
    "idlestatus=Смена статуса\n" +
    "nossidavailable=Выбранная сеть не доступна\n" +
    "scancompleted=Сканирование завершено\n" +
    "connectfailed=Не удается подключиться\n" +
    "connectionlost=Подключение утрачено\n" +
    "nostate=Не определен\n" +
    "debugmode=Режим отладки\n" +
    "connectiontimeout=Время соединения вышло\n" +
    "badprotocol=Неверный протокол\n" +
    "badclientid=Неверный идентификатор клиента\n" +
    "unavailable=Не доступно\n" +
    "badcredentials=Неверные учетные данные\n" +
    "unauthorized=Не разрешено\n" +
    "connectionstatus=Статус подключения: \n" +
    "detect=Движение\n" +
    "notdetect=Нет\n" +
    "getconfig=Загрузка настроек UI\n" +
    "getconfigfailsparse=Ошибка загрузки настроек UI\n" +
    "espfreesketchspace=Свободное место прошивки\n" +
    "espfreeheap=Свободная динамическая память\n" +
    "wifirssi=Уровень WiFi сигнала\n" +
    "espcpufreqmhz=Частота CPU\n" +
    "espresetreason=Тип последнего сброса\n" +
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
    "updateuibutton=Обновить UI\n" +
    "updatefirmwarebutton=Обновить прошивку\n" +
    "updatething=Обновление\n" +
    "updateuibutton=Начать обновление UI\n" +
    "firmwarebutton=Начать обновление прошивки\n" +
    "updatefirmware=После окончания обновления прошивки, модуть перезапустится автоматически. UI перезагрузится через 30 секунд. Используйте монитор порта для большей информации\n" +
    "restfulavailable=Включить поддержку Web(RESTful)\n" +
    "webserverlogin=Логин для Web сервера\n" +
    "webserverpwd=Пароль для Web сервера\n" +
    "restfulserverport=Порт Web сервера\n" +
    "restfulclienturl=URL RESTful сервера для клиента\n" +
    "restfulclientport=Порт RESTful сервера для клиента\n" +
    "mqttavailable=Включить поддержку MQTT\n" +
    "mqtturl=URL MQTT сервера\n" +
    "mqttport=Порт MQTT сервера\n" +
    "mqttid=ID клиента для MQTT\n" +
    "mqttlogin=Логин\n" +
    "mqttpassword=Пароль\n" +
    "otaavailable=Включить поддержку OTA\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA порт\n" +
    "otapassword=Клиентский пароль\n" +
    "wifithingprop=Настройки WiFi модуля\n" +
    "wifiaccesspointavailable=Включить режим WiFi точки доступа\n" +
    "wifiaccesspointssid=SSID для точки доступа\n" +
    "wifiappassword=Пароль для точки доступа\n" +
    "wifiavailable=Включить режим WiFi станции (клиента)\n" +
    "wifissid=SSID WiFi роутера\n" +
    "wifipassword=Пароль WiFi роутера\n" +
    "wifiip=Клиентский IP\n" +
    "systemthingprop=Свойства системы\n" +
    "updatehost=URL сервера обновлений\n" +
    "updatethingprop=Панель обновлений прошивки\n" +
    "addthingerror_hostempty=Хост не может быть пуст\n" +
    "addthingerror_hostnoturl=хост не соответствует HTTP(S) URL\n" +
    "addthingerror_nicknameempty=Имя не может быть пустым\n" +
    "addthingerror_cantsaveconfig=Невозможно сохранить настройки в узле\n" +
    "addthingerror_cantaddthing=Невозможно добавить ноду\n" +
    "drivertype=Тип драйвера\n" +
    "driverid=ID драйвера\n" +
    "driveridplaceholder=Маленькими латинскими буквами без пробелов\n" +
    "pin=Контактный разьем \n" +
    "adddriverbutton=Добавить\n" +
    "dashboardTab=Панель устройств\n" +
    "addthing=Добавить узел\n" +
    "addthingheader=Добавить узел\n" +
    "addthinghost=Адрес узла в сети\n" +
    "addthingnickname=Имя узла\n" +
    "addthingbutton=Добавить\n" +
    "dht=Датчик температуры и влажности (DHT)\n" +
    "sensor=Датчик \n" +
    "actuator=Цифровое устройство \n" +
    "opto=Оптопара\n" +
    "valve=Вентиль\n" +
    "stepper=Шаговый двигатель\n" +
    "downdateuipossible=Старые данные\n" +
    "dashboard=Панель устройств\n" +
    "dashboardview=Режим просмотра\n" +
    "dashboardedit=Режим редактирования\n" +
    "dashboardaddwidget=Добавить виджет\n" +
    "dashboardaddwidgetbutton=Добавить \n" +
    "thingslist=Список узлов/драйверов \n" +
    "driver=Драйвер\n" +
    "driversporplist=Свойства драйвера\n" +
    "widgetslist=Список виджетов для выбранного свойства\n" +
    "networkthingprop=Сетевые настройки узла\n" +
    "thingproperties=Свойства узла\n" +
    "drivers=Драйвера\n" +
    "adddriverdigalog=Добавить драйвер к узлу\n" +
    "notused=Не используется\n" +
    "checkchangedialog=Принять изменения\n" +
    "applycheck=Принять\n" +
    "showproperties=Свойства виджета\n" +
    "setallwidgetspropbutton=Применить ко всем\n" +
    "setpropbutton=Применить\n" +
    "saveaddedwidget=Сохранение\n" +
    "closebutton=Закрыть\n" +
    "createscript=Добавить скрипт\n" +
    "scripts=Скрипты\n" +
    "scriptexecute=Выполнить (F8)\n" +
    "scriptpause=Пауза\n" +
    "scriptdelete=Удалить\n" +
    "scriptstartdebug=Отладка\n" +
    "addscriptheader=Добавить скрипт\n" +
    "addscriptbutton=Добавить\n" +
    "addscriptname=Имя скрипта\n" +
    "inputcodehere=Здесь введите код скрипта\n" +
    "autoaddwidget=Добавить виджет\n" +
    "сhangessaved=Изменения внесены\n" +
    "savechangeserror=Ошибка сохранения изменений. Поробуйте еще раз\n" +
    "savingchanges=Сохранение изменений\n" +
    "thingselect=Select thing\n" +
    "driverselect=Select driver\n" +
    "propselect=Select property\n" +
    "widgetselect=Select widget\n" +
    "tooglesidebar=Toogle sidebar\n" +
    "pinsidebar=Pin sidebar\n" +
    "saveconfiguration=Save configuration\n" +
    "tooglewidgetsmode=Toogle widgets mode\n" +
    "addwidget=Add widget\n" +
    "createdriverdialog=Add driver\n" +
    "addthingname=Add thing\n" +
    "radialwidget=Radial\n" +
    "language=russian\n";


var currentLang = "en";
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
            if (configProperties.language.indexOf("ua") == 0) { //ua
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

    } catch (exception) {
        //return "key" if exception or not found
    }
    return key;
}

function langCompare(source, dest, panel) {
    var sourceLang = source.split("\n");
    var destLang = dest.split("\n");

    dest += "------------=---------\n"

    for (var i = 0; i < sourceLang.length; i++) {
        if (sourceLang[i] === "") continue;
        var sourceKey = sourceLang[i].split("=")[0];
        var found = false;
        for (var j = 0; j < destLang.length; j++) {
            if (destLang[j].indexOf(sourceKey + "=") == 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            dest += sourceLang[i] + "\n"
        }
    }

    var destLang = dest.split("\n");
    dest = "";

    for (var i = 0; i < destLang.length; i++) {
        if (destLang[i] === "") continue;
        var destKey = destLang[i].split("=")[0];
        var found = false;
        for (var j = 0; j < sourceLang.length; j++) {
            if (sourceLang[j].indexOf(destKey + "=") == 0) {
                dest += '"' + destLang[i] + '\\n" +\n';
                break;
            }
        }
    }
    panel.innerHTML = dest;
}