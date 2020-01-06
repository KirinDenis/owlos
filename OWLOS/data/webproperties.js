
function defaultWebProp() {
    return {
        language: "ua",
        speak: false,
        voice: 0,
        dashboards: [],
        nodes: []
    };

}

var webProp = defaultWebProp();



var webPropDevice;

var WebProperties = {

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
        webProp.dashboards.push(dashboard);
    },

    getDashboardById: function (_id) {
        for (var i = 0; i < webProp.dashboards.length; i++) {
            if (webProp.dashboards[i].id == _id) {
                return webProp.dashboards[i];
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
        if (this.getNodeByHost(_host) != undefined) return;

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
        webProp.nodes.push(node);
    },

    getNodeByHost: function (_host) {
        for (var node in webProp.nodes) {
            if (webProp.nodes[node].host == _host) {
                return webProp.nodes[node];
            }
        }
        return undefined;
    },
    
    indicatorEvent: function (webPropIndicator, indicator) {
        //indicator.event the event what happend
        if (indicator.event == EVENT_DELETE) {
            for (var i = 0; i < webProp.dashboards[0].indicators.length; i++) {
                if (webPropIndicator == webProp.dashboards[0].indicators[i]) {
                    webProp.dashboards[0].indicators.splice(i,1);
                    WebProperties.save();
                    return;
                }
            }
        }
    },

    load: function () {
        var result = false;
        var webPropJson = httpGetWithErrorReson(boardhost + "getwebproperty?property=webconfig"); //boardhost host контроллера с которого идет первичная загрузка
        if (!webPropJson.startsWith("%error")) {
            try {
                webProp = JSON.parse(unescape(webPropJson));
                //check 
                if (this.getDashboardById("main") != undefined) {

                    var tempNodes = [];
                    for (var nodeKey in webProp.nodes) {
                        
                        var tempNode = {
                            id: webProp.nodes[nodeKey].id,
                            host: webProp.nodes[nodeKey].host,
                            alies: webProp.nodes[nodeKey].alies,
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
                    webProp.nodes = tempNodes;

                    this.onChange();
                    result = true;
                }
                else {
                    webProp = "";
                }
            }
            catch {
            }
        }

        if (!result) { //пробуем создать свойства по умолчанию, если их еще нет
            //parse problem, reset properties
            webProp = defaultWebProp();

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

        for(var key in webProp) {
            if (key != "nodes") {
                tempProp[key] = webProp[key];
            }
        }

        for (var node in webProp.nodes) {
            var jsonNode = {
                id: webProp.nodes[node].id,
                host: webProp.nodes[node].host,
                alies: webProp.nodes[node].alies,
                recievedDevicesProperties: "",
                _networkStatus: NET_OFFLINE,
                devices: []

            }

            tempProp.nodes.push(jsonNode);
        }


        var webPropJson =  JSON.stringify(tempProp);
        var HTTPResult = httpGetWithErrorReson(boardhost + "setwebproperty?property=webconfig&value=" + escape(webPropJson));
        if (!HTTPResult.startsWith("%error")) {
            this.onChange();
            return true;
        }
        else {
            return false;
        }
    },

    webPropToDevice: function () {
        var webPropDevice = devices.addDevice("config");
        devices.newDeviceProperty(webPropDevice, "type", 14, "ri"); //14 is config device type
        devices.newDeviceProperty(webPropDevice, "language", webProp.language, "");
        devices.newDeviceProperty(webPropDevice, "speak", webProp.speack, "b");
        devices.newDeviceProperty(webPropDevice, "voice", webProp.voice, "i");
        devices.onDeviceLoaded(webPropDevice);
    }
}