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

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Этот класс реализует объектную модель устройств подключенных к микроконтроллеру.
// 
// Перед началом изучения этого класса - вызовите API getalldevicesproperties и изучите формат передачи
// свойств устройств: http://youruniturl:yourunitport/getalldevicesproperties (например http://192.168.1.10:8084/getalldevicesproperties)

// Примечания:
// "парсинг" - синтаксический анализ https://ru.wikipedia.org/wiki/%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7
// "распарсить" - подвергнуть синтаксическому анализу
// "актуатор" - исполнительное устройство https://ru.wikipedia.org/wiki/%D0%98%D1%81%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%BE
// "сенсор" - датчик https://ru.wikipedia.org/wiki/%D0%94%D0%B0%D1%82%D1%87%D0%B8%D0%BA
// "event" - событие
// "device" - устройство, в данном контексте любой сенсор или актуатор подключенный к микроконтроллеру

/*
 *  The structure:
 *  devices.devices[*] (events: newDevice, deviceLoaded)
 *                  |--->device1[*] (events: newProperty)
 *                  |            |--->property1[*] (events: networkStatus, value)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus  
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property2[*] (events: networkStatus, value)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property...[*]
 *                  |            |
 *                  |--->device2[*] (events: newProperty)
 *                  |            |--->property1[*] (events: networkStatus, value)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property2[*] (...)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property...[*]
 *                  |--->device...[*]
 *                  |            |--->property...[*]
 *                  |            |              |-->... 
 * ----------------------------------------------------------------------------------------------------------
 * События (events):
 * Уровня объекта devices:
 * - networkStatus сетевое состояние всего модуля
 * - newDevice новое устройство найдено при парсинге
 * - deviceLoaded парсинг свойств очередного устройства завершен (обратите внимание на свойство device._new - true если это новое устройство)
 * Уровня объекта device:
 * - newProperty когда при парсинге найдено новое свойство устройства
 * Уровня объекта deviceProperty:
 * - networkStatus когда состояние сети изменилось - Online, Offline, Error или Reconnect
 * - value когда значение свойства устройство изменилось (либо при парсинге, либо программно - например актуатор поменял состояние с OFF на ON)
 */

//Devices type codes:
const TestDeviceType = 0;
const DHTDeviceType = 1;
const LightDeviceType = 2;
const SmokeDeviceType = 3;
const MotionDeviceType = 4;
const SensorDeviceType = 5;
const StepperDeviceType = 6;
const LCDDeviceType = 7;
const ActuatorDeviceType = 8;
const OptoDeviceType = 9;
const ValveDeviceType = 10;
const WiFiDeviceType = 11;
const NetworkDeviceType = 12;
const ESPDeviceType = 13;
const ConfigDeviceType = 14;

var devices = {
    // результат getalldevicesproperties либо пустая строка
    
    //массив объектов с устройствами
    //devices: [],

    //запросить свойства устройств, если удачно - распарсить результат, обновить свойства объектов с устройствами (devices[])
    //асинхронный
    //вызывается внешним кодом, обычно с интервалом 10-15 секунд (смотрите index.js)
    refresh: function (node) {
        node.networkStatus = NET_REFRESH;
        // асинхронный HTTP запрос
        // this.refreshResult - метод который будет вызван HTTPClient-ом по окончанию асинхронного запроса
        // this - ссылка на экземпляр этого объекта        
        httpGetAsyncWithReciever(node.host + "getalldevicesproperties", this.refreshResult, node);
    },

    //вызывается асинхронным HTTPClient по окончанию запроса, указан как параметр в httpGetAsyncWithReciever, смотрите this.refresh()
    //httpResult - результат запроса
    //asyncReciever - ссылка на объект сделавший запрос (этот метод будет вызван в контексте другого потока, для него this. это другой объект - занимательный мир JS)
    //мы не можем использовать this, для обращения к методам этого объекта, поэтому заведомо передали себе ссылку на себя "asyncReciever"
    refreshResult: function (httpResult, node) {
        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произошел TimeOut
        if (!httpResult.indexOf("%error")==0) {
            node.networkStatus = NET_ONLINE;
            //если запрос был выполнен удачно, парсим новые данные об устройствах, изменяем свойства devices[] и добавляем новые device если они появились
            //перед изучением парсинга, посмотрите результат API getalldevicesproperties как текст
            //!-> asyncReciever это этот же класс devices!
            devices.parseDevices(httpResult, node);

        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (httpResult.indexOf("reponse")!=-1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            node.parsedDevices = "";
        }
    },
    //-------------------------------------------------------------------------------------------------------------
    //реализация механизма событий по принципу Listners 
    //в этом случае сторонние объекты подписываются на события этого объекта, который в свою очередь обязуется их вызвать 
    //подписанные методы, если соответствующие события произойдут
    //массив "подписантов", содержит ссылки на объекты типа {метод, объект} - где метод который надо вызвать, объект - ссылка на объект 
    //делавший подписку    
    newDeviceListners: [],
    //подписка для внешних объектов - _event - метод в классе подписчике для вызова, _sender класс подписчик
    //--> данная подписка для события которое вызовется в случае добавления нового устройства в список
    addNewDeviceListner: function (_event, _sender) {
        this.newDeviceListners.push(event = {
            event: _event,
            sender: _sender
        });
    },

    deviceLoadedListners: [],
    addDeviceLoadedListner: function (_event, _sender) {
        this.deviceLoadedListners.push(event = {
            event: _event,
            sender: _sender
        });
    },
    onDeviceLoaded: function (device) {
        for (var k = 0; k < this.deviceLoadedListners.length; k++) {
            this.deviceLoadedListners[k].event(this.deviceLoadedListners[k].sender, device);
        }
    },
    //получить объект устройства по его ID
    getDeviceById: function (deviceId, host) {
        var node = config.getNodeByHost(host);
        if (node == undefined) return undefined;
        for (var i = 0; i < node.devices.length; i++) {
            if (node.devices[i]._id === deviceId) {
               return node.devices[i];
            }                
        }
        return undefined;
    },
    //-------------------------------------------------------------------------------------------------------------
    //парсинг (синтаксический разбор) свойств устройств прошедших от микроконтроллер - смотрите refresh()
    //этот метод будет вызываться множество раз, по этой причине он не только создает устройства и их свойства
    //а так же проверяет было ли устройство создано и как изменились его свойства после предыдущего парсинга
    parseDevices: function (httpResult, node) {
        //первичный парсинг, помещаем строку пришедшую от HTTPClient в массив строк, разделяя по "\n"
        node.recievedDevicesProperties = httpResult.split("\n");
        
        if (node.recievedDevicesProperties !== "") {//если первичный парсинг удался
            
            var device = undefined; //сбрасываем будущий объект со свойствами устройства 
            
            for (var i = 0; i < node.recievedDevicesProperties.length; i++) {//перечисляем все строки в HTTPResult 
                if (node.recievedDevicesProperties[i] === "") continue; //если строка пуста, берем следующею
                //--> разбор устройств
                if (node.recievedDevicesProperties[i].indexOf("properties for:")==0) { //если заголовок устройства найден                    

                    if (device != undefined) {
                        this.onDeviceLoaded(device);
                    }
                    device = undefined;
                    //извлекаем ID очередного устройства
                    currentId = node.recievedDevicesProperties[i].split(":")[1];
                    //пробуем отыскать устройство с таким ID среди уже существующих 
                    for (var j = 0; j < node.devices.length; j++) {
                        if (node.devices[j]._id === currentId) { //устройство с таким ID существует
                            device = node.devices[j]; //указываем существующее устройство как обрабатываемое в текущей итерации 
                            device._new = false;
                            newDevice = false; //указываем для текущее устройство уже существует
                            break; //прекращаем поиск, устройство найдено
                        }
                    }

                    if (device == undefined) {//если устройство с текущем ID еще не существуем 
                        device = this.addDevice(currentId, node);
                    }
                }
                //--> разбор свойств устройств
                else {//если текущая строка не является объявлением очередного устройства, значит эта строка со свойством и значением свойства от последнего найденного устройства
                    //свойства устройств должны быть в формате [PropertyName]=[PropertyValue]<[//]PropertyType>
                    //где:
                    //PropertyName - название свойства(уникальное в рамках одного устройства)
                    //PropertyValue - значение этого свойства
                    //если после значения свойства указаны "//" то после них должны идти флаги с PropertyType типом свойства
                    //PropertyType флаги: один символ-один флаг, регистр имеет значение                    
                    //r - read only
                    //s - selected
                    //p - password
                    //
                    //b - boolean
                    //f - float
                    //i - integer
                    //if no type = string <!-------- ЕСЛИ типы b,f,i не указаны то свойства считается string (строка)
                    //if not read only - write accessable

                    //вторичный парсинг, помещаем строку в массив, разделяя по "=", первый элемент название, второй значение и тип
                    var parsedProp = node.recievedDevicesProperties[i].split("=");
                    if (parsedProp.length < 2) continue; //не удалось распарсить свойство
                    //забираем название свойства
                    var propertyName = parsedProp[0];
                    //третичный парсинг, разделяем по "//", первый элемент значение, второй либо тип либо (если тип не указан) массив будет состоять из одного элемента
                    //NOTE: не указание "//" на стороне сборщика свойств - является ошибкой, хотя бы пустые скобки
                    var splitterPos = parsedProp[1].lastIndexOf("//");
                    if (splitterPos != -1) {
                        var propertyValue = parsedProp[1].slice(0, splitterPos);
                        var propertyType = parsedProp[1].slice(splitterPos + 2, parsedProp[1].lenght);
                    }
                    else {
                        var propertyValue = parsedProp[1];
                        var propertyType = "";
                    } 

                    if (device[propertyName] != undefined) {//если такое свойство уже существует
                        if (device[propertyName].value != propertyValue) {//и если предыдущее значение не равно текущему                            
                            device[propertyName].value = propertyValue;//меняем значение свойства на новое
                        }
                    }
                    else { //если такого свойства еще нет у объекта, создаем его, смотрите метод "newDeviceProperty"
                        this.newDeviceProperty(device, propertyName, propertyValue, propertyType);
                    }
                }
            } //ENDOF for
            if (device != undefined) {
                this.onDeviceLoaded(device);
            }
        }
    }, //ENDOF parse devices

    addDevice: function (currentId, node) {
        device = { //создаем новый объект представляющий устройство
            _id: currentId, //навастриваем уникальный ID устройства, для идентификации объекта с устройством в будущем
            _new: true,
            _nodenickname: node.nodenickname,
            _host: node.host,
            //создаем внутри объекта устройства, свойства и методы для обслуживания сторонних объектов желающих подписаться на
            //событие - создания нового свойства у устройства, смотрите newDeviceListners[] в классе devices для большей информации
            //массив подписчиков на newProperty event
            newPropertyListners: [],
            //метод для организации подписки
            addNewPropertyListner: function (_event, _sender) {
                this.newPropertyListners.push(event = {
                    event: _event,
                    sender: _sender
                });
            },
        }; //новый объект для устройства сформирован
        //добавляем объект устройство в список устройств для объекта devices
        node.devices.push(device);
        //произошло событие newDevice -> вызываем всех его подписчиков(точнее вызываем методы которые подписчики предоставили ранее, смотрите: addNewDeviceListner )
        for (var k = 0; k < this.newDeviceListners.length; k++) {
            this.newDeviceListners[k].event(this.newDeviceListners[k].sender, device);
        }
        return device;
    },

    //добавляет новое свойство в существующее устройство
    //ну вот казалось бы - того свойства - название, значение, тип...но на практике, в целостной системе есть множество зависимых объектов
    //взаимодействующих со свойствами устройств - изменяют их, зависят от их значения и так далее.
    //Например, индикатор температуры "следит" за значением свойства tepmerature в устройстве termometr
    //За этим же свойством следит и график температуры и таблица отображающая свойства  termometr
    //есть два пути как решать такую задачу
    //1) все "заинтересованные" объекты, по мере надобности опрашивают соответствующие свойства устройства
    //2) все "заинтересованные" объекты подписываются на событие которое будет вызвано объектом устройства, только в том случае если значение свойства изменится.
    //мы идем по второму пути - следящих объектов может быть сколько угодно, они ничего не делают пока свойство устройства не изменится.
    //по этой причине, хоть это может и показаться странным - в классе devices больше кода обслуживает не само устройства, а его свойства. 
    newDeviceProperty: function (device, propertyName, propertyValue, propertyType) {
        //создаем новое свойство
        device[propertyName] = {
            parenthost: device._host,
            parentid: device._id, //запоминаем какому устройству оно принадлежит
            name: propertyName, //назначаем имя свойства            
            _value: propertyValue, //истинное прямое значение свойства
            set value(value) { //метод для изменения значения свойства (для внешнего вызова)
                this._value = value; //запоминаем предложение новое значение свойства
                //перечисляем всех подписчиков события изменения свойства устройства
                for (var k = 0; k < this.valueListners.length; k++) {
                    this.valueListners[k].event(this.valueListners[k].sender, this); //вызываем всех кто подписался
                }
            },
            get value() { //для тех объектов которые хотят получить значение свойства 
                return this._value;
            },
            valueListners: [], //массив подписчиков на событие изменения свойства(смотрите this.newDeviceListners для большей информации о механизме событий)
            addValueListner: function (_event, _sender) { //регистрация подписки на изменения свойства                
                try { //проверяем готов ли метод слушателя для обработчики этого события
                    _event(_sender, this);
                } catch(exception)
                {
                    console.error(exception);
                    return; //неправильный метод либо не существует, либо вызовет исключение, не включаем его в число подписчиков
                }
                //добавляем нового подписчика в valueListners: [], добавляется как объект-элемент массива, где _event метод обработчик из другого объекта, _sender подписанный объект
                this.valueListners.push(event = {
                    event: _event,
                    sender: _sender
                });
            },
            //endof device property value ---------------------------------
            type: propertyType, //тип свойства -> "si" - выделенный integer, "p" - пароль, "br" - boolean readonly, "" - string которую можно изменять

            //далее идут свойсва и методы необходимые для организации асинхронного RESTful взаимодействия свойства объекта с устройством
            sendedValue: undefined, //временно хранилища, для желаемого нового значения свойства, которое будет назначено если HTTPCient не вернет ошибки            
            //сетевое состояние свойства - онлайн, оффлайн, пере подсоединение ("в работе"), ошибка --> по умолчанию онлайн
            _networkStatus: NET_ONLINE,
            set networkStatus(networkStatus) { //для контроля изменения _networkStatus, для оповещения подписчиков
                this._networkStatus = networkStatus; //сохранить новое сетевое состояние
                for (var k = 0; k < this.networkStatusListners.length; k++) { //оповестить всех подписчиков
                    this.networkStatusListners[k].event(this.networkStatusListners[k].sender, this);
                }
            },
            get networkStatus() {//получить текущее сетевое состояние
                return this._networkStatus;
            },
            networkStatusListners: [], //подписчики на изменение сетевого состояния свойства
            addNetworkStatusListner: function (_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                //check event listner and setup current network status 
                try {
                    _event(_sender, this);
                } catch (exception) {
                    console.error(exception);
                    return; // don't add bad listner
                }
                this.networkStatusListners.push(event = { event: _event, sender: _sender });
            },
            //endof network status property, event and listners       
            //сетевое ("физическое") изменение свойства устройства 
            //вызов этого метода приведет к асинхронному вызову RESTful API изменяющей свойства устройства на стороне Unit
            setValue: function (_value, upperReciever, upperSender) {
                if (this.networkStatus == NET_RECONNECT) {//если текущее сетевое состояния свойства - в работе (пере подключение), ничего не делаем выходим
                    return;
                }
                else {
                    if (this.networkStatus == NET_ONLINE) {//если текущее состояние "в сети" можем вызывать API
                        this.networkStatus = NET_RECONNECT; //переключаем сетевое состояние в режим "в работе"
                        this.sendedValue = _value; //сохраняем новое значение(которое пытаемся установить) во временное свойство
                        //мы не проверяем тип свойства - перекладывая это на сторону микроконтроллера - мог ошибится автор UI или автор прошивки.
                        //например если автор UI не учел реакцию на флаг "r"-eadonly --> API вернет ошибку
                        //делаем асинхронный вызов API                        
                        //передаем метод в этом объекте который надо вызвать по окончанию ссылку на этот объект свойства this.setValueReciever и this
                        //обратите внимание - передаем не value а this.sendedValue - значение на которое хотим изменить это свойство
                        setDevicePropertyAsyncWithReciever(this.parenthost, this.parentid, this.name, this.sendedValue, this.setValueReciever, upperReciever, this, upperSender);
                    }
                    else { //если сетевое состояние "не в сети" или "пере подключение", заменяем вызов для установки значения, на вызов для пере подключения и получения текущего значения
                        //идея в том, что на верхнем уровне, если пользователь попытается изменить значение свойство, в тот момент когда устройство было не в сети или содержало ошибку
                        //то вместо назначения свойства, будет проведено пере подключение и попытка получить текущее значение с устройства.
                        //например, реле и лампочкой управляет 5 пользователей, произошел сетевой сбой, и все ушли в офлайн.За какое то время сеть восстановилась, но некоторые
                        //пользователя запомнили состояние реле как включено, некоторые как выключено - и те и другие пробуют изменить это значения, не зная о его текущем состоянии.
                        //По этой причине, мы перекрываем такие действия, переводя их в направлении получения значения, перед тем как оно будет изменено.
                        //НО - не запрещаем "обновить" статус свойства и получить новое значение - изменить его можно будет после возвращения в онлайн и получения последнего актуального значения. 
                        this.getValue(upperReciever, upperSender);
                    }
                }
            },
            //асинхронный получатель будет вызван из HTTPClient после попытки изменить свойство устройства
            //как было сказано выше - это будет другой поток и мы не имеем право использовать this
            setValueReciever: function (HTTPResult, upperReciever, sender, upperSender) {
                if (!HTTPResult.indexOf("%error")==0) {//если не было сетевой ошибки
                    if (HTTPResult === "1") { //микроконтроллер  вернет "1" в качестве результата, если удалось изменить значения свойства устройства
                        sender.networkStatus = NET_ONLINE; //разрешаем сетевой статус как "в сети" - до этого мы переходили в статус "в работе"
                        sender.value = sender.sendedValue; //ранее мы сохранили желаемое значение свойства, назначаем его в качестве нового значения свойства устройства
                        //^^смотрите реализацию setter-a свойства value - все подписчики узнают о том что свойство было изменено                        
                    }
                    else {
                        sender.networkStatus = NET_ERROR; //если HTTPClient сказал OK-200 но Unit не вернул "1" нам не удалось изменить свойство, переходим в статус "ошибка"
                    }
                }
                else {
                    if (!HTTPResult.indexOf("response")!=-1) {//если HTTPClient вернул "%error" и в этой строке не было слова "response" - соединение не было установлено, статус "не в сети"
                        sender.networkStatus = NET_OFFLINE;
                    }
                    else { //если ответ был, но он не HTTPResult 200 OK - ошибка либо устройства либо Unit 
                        sender.networkStatus = NET_ERROR;
                    }
                }
                if (upperReciever != undefined) { //если были назначены вторичные получатели асинхронного вызова - их вызовут здесь
                    upperReciever(upperSender, sender); //(!НЕ ПУТАТЬ С ПОДПИСЧИКАМИ!)
                }
            },
            //получение значения свойства устройства, асинхронно через RESTful API - реализовано так же как и setValueReciever
            //с той разницей что будет вызвано при всех статусах кроме "в работе"
            getValue: function (upperReciever, upperSender) {
                if (this.networkStatus == NET_RECONNECT) {
                    return;
                }
                this.networkStatus = NET_RECONNECT;
                getDevicePropertyAsyncWithReciever(this.parenthost, this.parentid, this.name, this.getValueReciever, upperReciever, this, upperSender);
            },
            //асинхронный получатель значения свойства, отличается от "Set", там что примет от HTTPClient новое значение свойства, если не было ошибки сети
            getValueReciever: function (HTTPResult, upperReciever, sender, upperSender) {
                if (!HTTPResult.indexOf("%error")==0) {
                    sender.networkStatus = NET_ONLINE; //возвращаемся в онлайн, были "в работе"
                    sender.value = HTTPResult; //новое значение свойства, все подписчики узнают об его изменении                    
                }
                else {
                    if (!HTTPResult.indexOf("response")!=-1) { //уходим в оффлайн если ошибки
                        sender.networkStatus = NET_OFFLINE;
                    }
                    else { //device error
                        sender.networkStatus = NET_ERROR;
                    }
                }
                if (upperReciever != undefined) { //вызов вторичных получателей (НЕ ПУТАТЬ С ПОДПИСЧИКАМИ)
                    upperReciever(upperSender, sender);
                }
            }
        }//ENDOF creation new device property object
        //после того как новое свойство устройства создано, вызовем всех подписчиков соответствующего события
        for (var k = 0; k < device.newPropertyListners.length; k++) {
            device.newPropertyListners[k].event(device.newPropertyListners[k].sender, device[propertyName]);
        }

    }//ENDOF newDeviceProperty method 
} //ENDOF devices object 


