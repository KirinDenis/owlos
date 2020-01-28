
function defaultWebProp() {
    return {
        language: "ua",
        speak: false,
        voice: 0,
        widgetssize: 150,
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
    addChangeListner: function (_event, _sender) {
        try {
            _event(_sender, this);
        } catch (exception) {
            return; // don't add bad listner
        }
        this.changeListners.push(event = { event: _event, sender: _sender });
    },

    addDashboard: function (_id) {
        var dashboard = {
            id: _id,
            widgets: []
        }
        configProperties.dashboards.push(dashboard);
        return dashboard;
    },

    getDashboardById: function (_id) {
        for (var i = 0; i < configProperties.dashboards.length; i++) {
            if (configProperties.dashboards[i].id == _id) {
                return configProperties.dashboards[i];
            }
        }
        return undefined;
    },

    addWidget: function (_dashboardId, _daviceId, _deviceProperty, _widgetId, _widgetProperties) {
        var dashboard = this.getDashboardById(_dashboardId);
        if (dashboard != undefined) {


            var widget = {
                dashboardId: _dashboardId,
                deviceId: _daviceId,
                deviceProperty: _deviceProperty,
                widgetId: _widgetId,
                widgetProperties: _widgetProperties
            }
            dashboard.widgets.push(widget);

            this.save();
            return widget;
        }
        return undefined;
    },

    addNode: function (_host, _nodenickname) {
        if (this.getNodeByHost(_host) != undefined) return false;

        var node = {
            host: _host,
            nodenickname: _nodenickname,
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
            addNetworkStatusListner: function (_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                //check event listner and setup current network status 
                try {
                    _event(_sender, this);
                } catch (exception) {
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

    widgetEvent: function (configPropertiesWidget, widget) {
        //widget.event the event what happend
        if (widget.event == EVENT_DELETE) {
            for (var i = 0; i < configProperties.dashboards[0].widgets.length; i++) {
                if (configPropertiesWidget == configProperties.dashboards[0].widgets[i]) {
                    configProperties.dashboards[0].widgets.splice(i, 1);
                    config.save();
                    return;
                }
            }
        }
    },

    load: function () {
        var result = false;


        var stringifyConfig = httpGetWithErrorReson(boardhost + "getwebproperty?property=config"); //boardhost host контроллера с которого идет первичная загрузка
        if (!stringifyConfig.indexOf("%error") == 0) {
            try {
                configProperties = JSON.parse(unescape(stringifyConfig));
                //check 
                if (this.getDashboardById("main") != undefined) {

                    var tempNodes = [];
                    for (var nodeKey in configProperties.nodes) {

                        var tempNode = {
                            id: configProperties.nodes[nodeKey].id,
                            host: configProperties.nodes[nodeKey].host,
                            nodenickname: configProperties.nodes[nodeKey].nodenickname,
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

                            addNetworkStatusListner: function(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                                //check event listner and setup current network status 
                                try { _event(_sender, this); } catch(exception) {
                                    return; // don't add bad listner
                                }
                                this.networkStatusListners.push(event = { event: _event, sender: _sender });
                            }
                        }
                        tempNodes.push(tempNode);
                    }
                    configProperties.nodes = tempNodes;

                    //First node all time is boardhost 
                    configProperties.nodes[0].host = boardhost;

                    this.onChange();
                    result = true;
                }
                else {
                    configProperties = "";
                }

                result = true;                
                this.onChange();

            }
            catch (exception) {
                addToLogNL(getLang("getconfigfailsparse") + exception, 2);
            }
        }


        if (!result) { //пробуем создать свойства по умолчанию, если их еще нет
            //parse problem, reset properties
            configProperties = defaultWebProp();


            addToLogNL(getLang("restoredefault"), 1);
            this.addDashboard("main");
            this.addNode(boardhost, "local");
            /*
            this.addNode("http://176.100.2.105:8085/", "solomon_1");
            this.addNode("http://176.100.2.105:8086/", "solomon_2");
            this.addNode("http://81.95.178.177:8084/", "home_1");
            this.addNode("http://192.168.1.11:8084/", "home_2");
            */

            result = this.save();

        }


        return result;
    },

    save: function () {


        var tempProp = defaultWebProp();

        for (var key in configProperties) {
            if (key != "nodes") {
                tempProp[key] = configProperties[key];
            }
        }

        for (var node in configProperties.nodes) {
            var jsonNode = {
                id: configProperties.nodes[node].id,
                host: configProperties.nodes[node].host,
                nodenickname: configProperties.nodes[node].nodenickname,
                recievedDevicesProperties: "",
                _networkStatus: NET_OFFLINE,
                devices: []

            }

            tempProp.nodes.push(jsonNode);
        }


        var stringifyConfig = JSON.stringify(tempProp);

        var subStringLength = 1024;

        var saveConfigResult = this.configSendAsync("Start", 0, stringifyConfig, subStringLength, boardhost);

        return saveConfigResult;

    },

    configSendAsync: function (httpResult, counter, dataString, lengthDataSubString, url) {
        var subString = "";
        var filePartName = "";
        var countedSections = Math.floor(dataString.length / lengthDataSubString);




        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произашел TimeOut
        if (!httpResult.indexOf("%error") == 0) {

            if (counter < countedSections) {

                subString = dataString.slice(counter * lengthDataSubString, (counter + 1) * lengthDataSubString);


                if (counter == 0) {

                    filePartName = "setwebproperty?property=head";

                }
                else {

                    filePartName = "setwebproperty?property=body";

                }

            }
            else {

                if (counter == countedSections) {

                    subString = dataString.slice(counter * lengthDataSubString);


                    if (counter == 0) {

                        filePartName = "setwebproperty?property=head";

                    }

                    else {

                        filePartName = "setwebproperty?property=tail";

                    }

                }

                else {

                    if (countedSections !== 0) {

                        addToLogNL("Sending long config string. FINISHED. Result = OK!");
                        config.onChange();
                        return true;


                    }
                    else {

                        if (counter == 1) {

                            filePartName = "setwebproperty?property=tail";
                            subString = "";

                        }
                        else {

                            addToLogNL("Sending short config string. FINISHED. Result = OK!");
                            config.onChange();
                            return true;

                        }
                    }
                }

            }

            counter++;
            addToLogNL("Sending config string. Still sending! " + filePartName);
            httpPostAsyncWithErrorReson(url, filePartName, subString, config.configSendAsync, counter, dataString, lengthDataSubString);

        }
        else { //если HTTPClient вернул ошибку, возвращаем false 

            addToLogNL("Sending config string ERROR!" + httpResult);
            return false;

        }


    }

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

