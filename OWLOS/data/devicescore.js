//--------------------------------------------------------------------------------------------------------------------------------------------------
// Этот класс реализует объектную модель устройств (девайсов) подключенных к Unit.
// Основной способ получения состояния устройств - вызов API "getalldevicesproperties"
// Перед началом изучения этого класса - вызовите API из unit и ознакомтесь с форматом передачи
// состояния свойст устройств: http://youruniturl:yourunitport/getalldevicesproperties (например http://192.168.1.10:8084/getalldevicesproperties)

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
 * - networkStatus когде состояние сети изменилось - Online, Offline, Error или Reconnect
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
const WiFiTypeDeviceType = 11;
const NetworkTypeDeviceType = 12;
const ESPTypeDeviceType = 13;
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
        // this.refreshResult - метод который будет вызван HTTPClient-ом по окончаню асинхронного запроса
        // this - ссылка на экзепляр этого объекта        
        httpGetAsyncWithReciever(node.host + "getalldevicesproperties", this.refreshResult, node);
    },

    //вызывается асинхронным HTTPClient по окончанию запроса, указан как параметр в httpGetAsyncWithReciever, смотрите this.refresh()
    //httpResult - результат запроса
    //asyncReciever - ссылка на объект сделавший запрос (этот метод будет вызван в контексте другого потока, для него this. это другой объект - занимательный мир JS)
    //мы не можем использовать this, для обращения к методам этого объекта, поэтому заведомо передали себе ссылку на себя "asyncReciever"
    refreshResult: function (httpResult, node) {
        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произашел TimeOut
        if (!httpResult.startsWith("%error")) {
            node.networkStatus = NET_ONLINE;
            //если запрос был выполнен удачно, парсим новые данные об устройствах, изменяем свойства devices[] и добавляем новые device если они появились
            //перед изучением парсинга, посмотрите результат API getalldevicesproperties как текст
            //!-> asyncReciever это этот же класс devices!
            devices.parseDevices(httpResult, node);

        }
        else { //если HTTPClient вернул ошибку, сбрасывам предидущий результат, а текущий объявлям пустой строкой
            if (httpResult.includes("reponse")) {
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
    //в этом случае стороние объекты подписываются на события этого объекта, который в свою очередь обязуется их вызвать 
    //подписанные методы, если соответствующие события произойдут
    //массив "подписантов", содержит ссылки на объекты типа {метод, объект} - где метод который надо вызвать, объект - ссылка на объект 
    //делавший подписку    
    newDeviceListners: [],
    //подписка для внешних объектов - _event - метод в классе подписчике для вызова, _sender класс подписчик
    //--> данная подписка для события которое вызовется в случае добавления нового устройства в список
    addNewDeviceListner(_event, _sender) {
        this.newDeviceListners.push(event = {
            event: _event,
            sender: _sender
        });
    },

    deviceLoadedListners: [],
    addDeviceLoadedListner(_event, _sender) {
        this.deviceLoadedListners.push(event = {
            event: _event,
            sender: _sender
        });
    },
    onDeviceLoaded(device) {
        for (var k = 0; k < this.deviceLoadedListners.length; k++) {
            this.deviceLoadedListners[k].event(this.deviceLoadedListners[k].sender, device);
        }
    },
    //получить объект устройства по его ID
    getDeviceById(deviceId, host) {
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
    //парсинг (синтаксический разбор) свойств устройств прошедших от unit - смотрите refresh()
    //этот метод будет вызыватся множество раз, по этой причине он не только создает устройства и их свойства
    //а так же проверяет было ли устройство созданно и как изменились его свойства после предидущего парсинга
    parseDevices: function (httpResult, node) {
        //первичный парсинг, помещаем строку пришедшую от HTTPClient в массив строк, разделяя по "\n"
        node.recievedDevicesProperties = httpResult.split("\n");
        
        if (node.recievedDevicesProperties !== "") {//если первичный парсинг удался
            
            var device = undefined; //сбрасываем будущий объект со свойствами устройства 
            
            for (var i = 0; i < node.recievedDevicesProperties.length; i++) {//перечесляем все строки в HTTPResult 
                if (node.recievedDevicesProperties[i] === "") continue; //если строка пуста, берем следующею
                //--> разбор устройств
                if (node.recievedDevicesProperties[i].startsWith("properties for:")) { //если заголовок устройства найден                    

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
                            break; //прикращаем поиск, устройство найдедо
                        }
                    }

                    if (device == undefined) {//если устройство с текущем ID еще не существуем 
                        device = this.addDevice(currentId, node);
                    }
                }
                //--> разбор свойств устройств
                else {//если текущая строка не является объявлением очередного устройства, значит эта строка со свойством и значением свойства от последнего найденого устройства
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
                        if (device[propertyName].value != propertyValue) {//и если предидущее значение не равно текущему                            
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

    addDevice(currentId, node) {
        device = { //создаем новый объект представляющий устройство
            _id: currentId, //настриваем уникальный ID устройства, для идентификации объекта с устройством в будущем
            _new: true,
            _alies: node.alies,
            _host: node.host,
            //создаем внутри объекта устройства, свойства и методы для обслуживания стороних объектов желающих подписаться на
            //событие - создания нового свойства у устройства, смотрите newDeviceListners[] в классе devices для большей информации
            //массив подписчиков на newProperty event
            newPropertyListners: [],
            //метод для организации подписки
            addNewPropertyListner(_event, _sender) {
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
    //Например, индикатор температуры "следит" за значением свойства tepmerature в удстройстве termometr
    //За этим же свойством следит и график температуры и таблица отображающая свойства  termometr
    //есть два пути как решать такую задачу
    //1) все "заинтересованные" объекты, по мере надобности опрашивают соответствующие свойста устройства
    //2) все "заинтересованные" объекты подписываются на событие которое будет вызвано объектом устройства, только в том случае если значение свойства изменится.
    //мы идем по второму пути - следящих объектов может быть сколько угодно, они ничего не делают пока свойство устройства не изменится.
    //по этой причине, хоть это может и показатся стренным - в классе devices больше кода обслуживает не само устройства, а его свойства. 
    newDeviceProperty(device, propertyName, propertyValue, propertyType) {
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
            addValueListner(_event, _sender) { //регистрация подписки на изменения свойства                
                try { //проверяем готов ли метод слушателя для обработчки этого события
                    _event(_sender, this);
                } catch
                {
                    return; //неправильный метод либо не существует, либо вызовет исключение, не включаем его в число подписчиков
                }
                //добавляем нового подписчика в valueListners: [], добавляется как объект-элемент массива, где _event метод обработчик из другого объекта, _sender подписанный объект
                this.valueListners.push(event = {
                    event: _event,
                    sender: _sender
                });
            },
            //endof device property value ---------------------------------
            type: propertyType, //тип свойства -> "si" - выделенный integer, "p" - пароль, "br" - boolean readonly, "" - string которую можено изменять

            //далее идут свойсва и методы необходимые для организации асинхронного RESTful взаимодействия свойства объекта с устройством
            sendedValue: undefined, //временно хранилища, для желаемого нового значения свойства, которое будет назначено если HTTPCient не вернет ошибки            
            //сетевое состояние свойства - онлайн, офлайн, переподсоединение ("в работе"), ошибка --> по умолчанию онлайн
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
            addNetworkStatusListner(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                //check event listner and setup current network status 
                try { _event(_sender, this); } catch {
                    return; // don't add bad listner
                }
                this.networkStatusListners.push(event = { event: _event, sender: _sender });
            },
            //endof network status property, event and listners       
            //сетевое ("физическое") изменение свойства устройства 
            //вызов этого метода приведет к асинхронному вызову RESTful API изменяющей свойства устройства на стороне Unit
            setValue: function (_value, upperReciever, upperSender) {
                if (this.networkStatus == NET_RECONNECT) {//если текущее сетевое состояния свойства - в работе (переподключение), ничего не делаем выходим
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
                    else { //если сетевое сотояние "не в сети" или "переподключение", заменяем вызов для установки значения, на вызов для переподключения и получения текущего значения
                        //идея в том, что на верхнем уровне, если пользователь попытается изменить значение свойство, в тот момент когда устройство было не в сети или содержало ошибку
                        //то вместо назначения свойства, будет проведено переподключение и попытка получить текущее значение с устройства.
                        //например, реле и лампочкой управляет 5 пользователей, произошел сетевой сбой, и все ушли в офлайн.За какоето время сеть востановилась, но некоторые
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
                if (!HTTPResult.startsWith("%error")) {//если небыло сетевой ошибки
                    if (HTTPResult === "1") { //unit вернет "1" в качестве результата, если удалось изменить значения свойства устройства
                        sender.networkStatus = NET_ONLINE; //разрешаем сетевой статус как "в сети" - до этого мы переходили в статус "в работе"
                        sender.value = sender.sendedValue; //ранее мы сохранили желаемое значение свойства, назначаем его в качестве нового значения свойства устройства
                        //^^смотрите реализацую setter-a свойства value - все подписчики узнают о том что свойство было изменено                        
                    }
                    else {
                        sender.networkStatus = NET_ERROR; //если HTTPClient сказал OK-200 но Unit не вернул "1" нам не учалось изменить свойство, переходим в статус "ошибка"
                    }
                }
                else {
                    if (!HTTPResult.includes("response")) {//если HTTPClient вернул "%error" и в этой строке небыло слова "response" - соединение не было установлено, статус "не в сети"
                        sender.networkStatus = NET_OFFLINE;
                    }
                    else { //если ответ был, но он не HTTPResult 200 OK - ошибка либо устройства либо Unit 
                        sender.networkStatus = NET_ERROR;
                    }
                }
                if (upperReciever != undefined) { //если были назначены вторичные получатели асинхронного вызова - их вызобут здесь
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
            //асинхронный получатель значения свойства, отличается от "Set", там что приймет от HTTPClient новое значение свойства, если небыло ошибки сети
            getValueReciever: function (HTTPResult, upperReciever, sender, upperSender) {
                if (!HTTPResult.startsWith("%error")) {
                    sender.networkStatus = NET_ONLINE; //возвращаемся в онлайн, были "в работе"
                    sender.value = HTTPResult; //новое значение свойства, все подписчики узнают об его изменении                    
                }
                else {
                    if (!HTTPResult.includes("response")) { //уходим в офлайн если ошибки
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


//OLD ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//OLD ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//OLD ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var parsedDevices = "";

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getParsedDevices() {

    var result = [];
    if (parsedDevices !== "") {
        for (var i = 0; i < parsedDevices.length; i++) {
            if (parsedDevices[i] === "") continue;
            if (parsedDevices[i].startsWith("properties for:")) {
                result.push(parsedDevices[i].split(":")[1]);
            }
        }
    }
    return result;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getParsedDeviceProperty(id, property) {
    if (parsedDevices !== "") {
        for (var i = 0; i < parsedDevices.length; i++) {
            if (parsedDevices[i] === "") continue;
            if (parsedDevices[i].startsWith("properties for:" + id)) {
                for (var j = i + 1; j < parsedDevices.length; j++) {
                    if (parsedDevices[j].startsWith("properties for:")) { break; }
                    if (parsedDevices[j].startsWith(property + "=")) {
                        return parsedDevices[j].split("=")[1].split("//")[0];
                    }
                }
                break;
            }
        }
    }
    return "";
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function appendDevicePins(valueSelect) {
    var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "not used";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D0";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D1";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D2";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D3";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D4";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D5";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D6";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D7";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D8";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D9";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "A0";

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function addDeviceClick(event) {
    event.stopPropagation();
    settingsUI.deviceAnchorClick(event);
    var addDevicePanel = document.getElementById("addDevicePanel");
    addDevicePanel.innerHTML = "";
    var modalFade = addDevicePanel.appendChild(document.createElement("div"));

    modalFade.className = "modal fade";
    modalFade.id = "addDeviceModal";
    modalFade.tabindex = "-1";
    modalFade.setAttribute("role", "dialog");
    modalFade.setAttribute("aria-labelledby", "addDeviceModalLabel");
    modalFade.setAttribute("aria-hidden", "true");

    var modalDialog = modalFade.appendChild(document.createElement("div"));
    modalDialog.className = "modal-dialog";
    modalDialog.role = "document";

    var modalContent = modalDialog.appendChild(document.createElement("div"));
    modalContent.className = "modal-content";

    var modalHeader = modalContent.appendChild(document.createElement("div"));
    modalHeader.className = "modal-header";

    var modalTitle = modalHeader.appendChild(document.createElement("h5"));

    modalTitle.className = "modal-title";
    modalTitle.id = "addDeviceModalLabel";
    modalTitle.innerText = "Add new device";

    var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));

    closeHeaderButton.type = "button"
    closeHeaderButton.className = "close"
    closeHeaderButton.setAttribute("data-dismiss", "modal");
    closeHeaderButton.setAttribute("aria-label", "Close");

    var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerText = "x"

    var modalBody = modalContent.appendChild(document.createElement("div"));
    modalBody.className = "modal-body";
    //body ---------------------------
    //var form = modalBody.appendChild(document.createElement("form"));


    var formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    var label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "typeSelect");
    label.innerText = "device";
    var inputDiv = formGroup.appendChild(document.createElement("div"));

    var typeSelect = formGroup.appendChild(document.createElement('select'));
    typeSelect.className = "form-control form-control-sm";
    typeSelect.id = "typeSelect";

    var valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "DHT";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Light";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Smoke";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Motion";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Sensor";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Stepper";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "LCD";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Actuator";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Opto";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Valve";


    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "idEdit");
    label.innerText = "id";
    var idEdit = formGroup.appendChild(document.createElement('input'));
    idEdit.className = "form-control form-control-sm";
    idEdit.id = "idInput";

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin1Select");
    label.innerText = "pin1";
    var pin1Select = formGroup.appendChild(document.createElement('select'));
    pin1Select.className = "form-control form-control-sm";
    pin1Select.id = "pin1Select";
    appendDevicePins(pin1Select);

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin2Select");
    label.innerText = "pin2";
    var pin2Select = formGroup.appendChild(document.createElement('select'));
    pin2Select.className = "form-control form-control-sm";
    pin2Select.id = "pin2Select";
    appendDevicePins(pin2Select);

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin3Select");
    label.innerText = "pin3";
    var pin3Select = formGroup.appendChild(document.createElement('select'));
    pin3Select.className = "form-control form-control-sm";
    pin3Select.id = "pin3Select";
    appendDevicePins(pin3Select);

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin4Select");
    label.innerText = "pin4";
    var pin4Select = formGroup.appendChild(document.createElement('select'));
    pin4Select.className = "form-control form-control-sm";
    pin4Select.id = "pin4Select";
    appendDevicePins(pin4Select);



    var alertDiv = modalBody.appendChild(document.createElement('div'));

    var modalFooter = modalContent.appendChild(document.createElement("div"));
    modalFooter.className = "modal-footer";

    var addButton = modalFooter.appendChild(document.createElement("button"));
    addButton.type = "button";
    addButton.className = "btn btn-success";
    addButton.id = "addDeviceModalButton";
    //   addButton.setAttribute("data-dismiss", "modal");
    addButton.typeSelect = typeSelect;
    addButton.idEdit = idEdit;
    addButton.pin1Select = pin1Select;
    addButton.pin2Select = pin2Select;
    addButton.pin3Select = pin3Select;
    addButton.pin4Select = pin4Select;
    addButton.alertDiv = alertDiv;
    addButton.onclick = doAddDeviceClick;
    addButton.innerText = getLang("add");

    var closeButton = modalFooter.appendChild(document.createElement("button"));
    closeButton.type = "button";
    closeButton.className = "btn btn-info";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.innerText = "cancel";

    $("#addDeviceModal").modal('show');

    return false;
}

function doAddDeviceClick(event) {
    event.stopPropagation();
    var addButton = event.target;

    addButton.className = "btn btn-warning";
    addButton.value = 'do...';
    addButton.disable = true;

    var httpResult = addDevice(boardhost, addButton.typeSelect.selectedIndex + 1, addButton.idEdit.value, addButton.pin1Select.value, addButton.pin2Select.value, addButton.pin3Select.value, addButton.pin4Select.value);

    if (httpResult == 1) {
        $("#addDeviceModal").modal('hide');
       // renderDevicesProperties(); TODO model refresh
    }
    else {
        addButton.alertDiv.innerHTML = "";
        var addDeviceAlert = addButton.alertDiv.appendChild(document.createElement('div'));
        addDeviceAlert.className = "alert alert-danger";
        addDeviceAlert.role = "alert";
        addDeviceAlert.innerText = httpResult;

        addButton.className = "btn btn-success";
        addButton.value = 'add';
    }
    addButton.disable = false;
    return false;

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



function deviceClick(event) {
    var button = event.target;
    document.location = button.href;
    return false;
}

