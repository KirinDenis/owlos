
function defaultWebProp() {
    return {
        language: "ua",
        speak: false,
        voice: 0,
        dashboards: [],
        nodes: []
    };

}

var configProperties = defaultWebProp();

//var configPropertiesDevice;

var config = {

    changeListners: [], 
    onChange: function () {
        for (var k = 0; k < this.changeListners.length; k++) { 
            this.changeListners[k].event(this.changeListners[k].sender, this);
        }
    },    
    addChangeListner(_event, _sender) {         
        try { _event(_sender, this); } catch {
            return; // don't add bad listner
        }
        this.changeListners.push(event = { event: _event, sender: _sender });
    },

    addDashboard: function (_id) {
        var dashboard = {
            id: _id,
            indicators: []
        }
        configProperties.dashboards.push(dashboard);
    },

    getDashboardById: function (_id) {
        for (var i = 0; i < configProperties.dashboards.length; i++) {
            if (configProperties.dashboards[i].id == _id) {
                return configProperties.dashboards[i];
            }
        }
        return undefined;
    },

    addIndicator: function (_dashboardId, _daviceId, _deviceProperty, _indicatorId) {
        var dashboard = this.getDashboardById(_dashboardId);
        if (dashboard != undefined) {
                var indicator = {
                    dashboardId: _dashboardId,
                    deviceId: _daviceId,
                    deviceProperty: _deviceProperty,
                    indicatorId: _indicatorId,                    
                }
                dashboard.indicators.push(indicator);
                this.save();
                return indicator;
        }
        return undefined;
    },

    addNode: function (_host, _alies) {
        if (this.getNodeByHost(_host) != undefined) return false;

        var node = {
            host: _host,
            alies: _alies,
            recievedDevicesProperties: "",
            //-------------------------------------------------------------------------------------------------------------
            //сетевое состояние модуля - онлайн, офлайн, переподсоединение ("в работе"), ошибка --> по умолчанию онлайн
            //NOTE: у каждого свойства есть свое сетевое состояние и связанные события - это глобальный флаг для всех устройств и элементов UI
            _networkStatus: NET_OFFLINE, //offline по умолчанию
            set networkStatus(networkStatus) { //для контроля изменения _networkStatus, для оповещения подписчиков
                this._networkStatus = networkStatus; //сохранить новое сетевое состояние
                for (var k = 0; k < this.networkStatusListners.length; k++) { //оповестить всех подписчиков
                    this.networkStatusListners[k].event(this.networkStatusListners[k].sender, this);
                }
            },
            get networkStatus() {//получить текущее сетевое состояние
                return this._networkStatus;
            },
            networkStatusListners: [], //подписчики на изменение сетевого состояния 
            addNetworkStatusListner(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                //check event listner and setup current network status 
                try { _event(_sender, this); } catch {
                    return; // don't add bad listner
                }
                this.networkStatusListners.push(event = { event: _event, sender: _sender });
            },

            devices: []
        }
        configProperties.nodes.push(node);
        return true;
    },

    getNodeByHost: function (_host) {
        for (var node in configProperties.nodes) {
            if (configProperties.nodes[node].host == _host) {
                return configProperties.nodes[node];
            }
        }
        return undefined;
    },
    
    indicatorEvent: function (configPropertiesIndicator, indicator) {
        //indicator.event the event what happend
        if (indicator.event == EVENT_DELETE) {
            for (var i = 0; i < configProperties.dashboards[0].indicators.length; i++) {
                if (configPropertiesIndicator == configProperties.dashboards[0].indicators[i]) {
                    configProperties.dashboards[0].indicators.splice(i,1);
                    config.save();
                    return;
                }
            }
        }
    },

    load: function () {
        var result = false;
        var configPropertiesJson = httpGetWithErrorReson(boardhost + "getwebproperty?property=webconfig"); //boardhost host контроллера с которого идет первичная загрузка
        if (!configPropertiesJson.startsWith("%error")) {
            try {
                configProperties = JSON.parse(unescape(configPropertiesJson));
                //check 
                if (this.getDashboardById("main") != undefined) {

                    var tempNodes = [];
                    for (var nodeKey in configProperties.nodes) {
                        
                        var tempNode = {
                            id: configProperties.nodes[nodeKey].id,
                            host: configProperties.nodes[nodeKey].host,
                            alies: configProperties.nodes[nodeKey].alies,
                            recievedDevicesProperties: "",
                            _networkStatus: NET_OFFLINE,
                            devices: [],
                            networkStatusListners: [], //подписчики на изменение сетевого состояния                         
                            set networkStatus(networkStatus) { //для контроля изменения _networkStatus, для оповещения подписчиков
                                this._networkStatus = networkStatus; //сохранить новое сетевое состояние
                                for (var k = 0; k < this.networkStatusListners.length; k++) { //оповестить всех подписчиков
                                    this.networkStatusListners[k].event(this.networkStatusListners[k].sender, this);
                                }
                            },

                            get networkStatus() {//получить текущее сетевое состояние
                                return this._networkStatus;
                            },

                            addNetworkStatusListner(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                                //check event listner and setup current network status 
                                try { _event(_sender, this); } catch {
                                    return; // don't add bad listner
                                }
                                this.networkStatusListners.push(event = { event: _event, sender: _sender });
                            }
                        }
                        tempNodes.push(tempNode);
                    }
                    configProperties.nodes = tempNodes;

                    this.onChange();
                    result = true;
                }
                else {
                    configProperties = "";
                }
            }
            catch {
            }
        }

        if (!result) { //пробуем создать свойства по умолчанию, если их еще нет
            //parse problem, reset properties
            configProperties = defaultWebProp();

            addToLogNL(getLang("getwebconfigfailsparse"), 2);
            addToLogNL(getLang("restoredefault"), 1);
            this.addDashboard("main");
            this.addNode(boardhost, "local");
            this.addNode("http://176.100.2.105:8085/", "solomon_1");
            this.addNode("http://176.100.2.105:8086/", "solomon_2");
            this.addNode("http://81.95.178.177:8084/", "home_1");
            this.addNode("http://192.168.1.11:8084/", "home_2");

            result = this.save();

        }
        
        return result;
    },

    save: function () {
        var tempProp = defaultWebProp();

        for(var key in configProperties) {
            if (key != "nodes") {
                tempProp[key] = configProperties[key];
            }
        }

        for (var node in configProperties.nodes) {
            var jsonNode = {
                id: configProperties.nodes[node].id,
                host: configProperties.nodes[node].host,
                alies: configProperties.nodes[node].alies,
                recievedDevicesProperties: "",
                _networkStatus: NET_OFFLINE,
                devices: []

            }

            tempProp.nodes.push(jsonNode);
        }


        var configPropertiesJson =  JSON.stringify(tempProp);
        var HTTPResult = httpGetWithErrorReson(boardhost + "setwebproperty?property=webconfig&value=" + escape(configPropertiesJson));
        if (!HTTPResult.startsWith("%error")) {
            this.onChange();
            return true;
        }
        else {
            return false;
        }
    },

    /*
    configPropertiesToDevice: function () {
        var configPropertiesDevice = devices.addDevice("config");
        devices.newDeviceProperty(configPropertiesDevice, "type", 14, "ri"); //14 is config device type
        devices.newDeviceProperty(configPropertiesDevice, "language", configProperties.language, "");
        devices.newDeviceProperty(configPropertiesDevice, "speak", configProperties.speack, "b");
        devices.newDeviceProperty(configPropertiesDevice, "voice", configProperties.voice, "i");
        devices.onDeviceLoaded(configPropertiesDevice);
    }
    */
}