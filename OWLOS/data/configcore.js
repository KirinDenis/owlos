
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
    //temp!!!!!!!
    locksave: true,
    changeListners: [],
    onChange: function () {
        for (var k = 0; k < this.changeListners.length; k++) {
            this.changeListners[k].event(this.changeListners[k].sender, this);
        }
    },
    addChangeListner: function(_event, _sender) {
        try {
            _event(_sender, this);
        } catch(exception) {
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

    addWidget: function (_dashboardId, _daviceId, _deviceProperty, _widgetId) {
        var dashboard = this.getDashboardById(_dashboardId);
        if (dashboard != undefined) {

            
                var widget = {
                    dashboardId: _dashboardId,
                    deviceId: _daviceId,
                    deviceProperty: _deviceProperty,
                    widgetId: _widgetId,
                }
                dashboard.widgets.push(widget);
            

            if (!this.locksave) this.save();
            return widget;
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
            addNetworkStatusListner: function(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                //check event listner and setup current network status 
                try {
                    _event(_sender, this);
                } catch(exception) {
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
        //STOP point
        //  return;
        if (stringifyConfig.indexOf("OWLOSConfig") == 0) {
            try {
                configProperties = defaultWebProp();
                stringifyConfigLines = stringifyConfig.split(";");
                addToLogNL(stringifyConfigLines);
                for (var i = 1; i < stringifyConfigLines.length; i++) {
                    if ((!stringifyConfigLines[i].indexOf("dd:")==0) && (!stringifyConfigLines[i].indexOf("ne:")==0)) {
                        var key = stringifyConfigLines[i].split("=")[0];
                        var value = stringifyConfigLines[i].split("=")[1];
                        configProperties[key] = value;
                    }
                    else { 
                        if (stringifyConfigLines[i].indexOf("dd:")==0) {  //parse dashboards
                            var id = stringifyConfigLines[i].split(":")[1];
                            var dashboard = this.addDashboard(id);
                            for (var j = i + 1; j < stringifyConfigLines.length; j++) {
                                if (stringifyConfigLines[j].indexOf("dd:")==0) { i = j - 1; break; }
                                if (stringifyConfigLines[j].indexOf("ne:")==0) { i = j - 1; break; }

                                if (stringifyConfigLines[j].indexOf("wt:")==0) {
                                    var widget = this.addWidget(dashboard.id);
                                    //widget.dashboardId = stringifyConfigLines[j + 1].split("=")[1];
                                    widget.deviceId = stringifyConfigLines[j + 2].split("=")[1]
                                    widget.deviceProperty = stringifyConfigLines[j + 3].split("=")[1]
                                    widget.widgetId = stringifyConfigLines[j + 4].split("=")[1]
                                    i = j + 4;
                                    continue;
                                }
                            }
                        }  //end of parse dashboards
                        else {
                            if (stringifyConfigLines[i].indexOf("ne:")==0) {  //parse nodes                                
                                this.addNode(stringifyConfigLines[i + 1].split("=")[1], stringifyConfigLines[i + 2].split("=")[1]);
                                i += 2;
                            }  //end of parse nodes

                        }
                    }
                }
                
                result = true;
                this.locksave = false;
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
            this.addNode("http://176.100.2.105:8085/", "solomon_1");
            this.addNode("http://176.100.2.105:8086/", "solomon_2");
            this.addNode("http://81.95.178.177:8084/", "home_1");
            this.addNode("http://192.168.1.11:8084/", "home_2");

            result = this.save();

        }
        

        return result;
    },

    save: function () {

        var endOfLine = ";";
        var stringifyConfig = "OWLOSConfig:" + endOfLine;
        //for (var m = 0; m < 100; m++) {
        //    stringifyConfig += m + ",";
        //}
        
        for (var key in configProperties) {
            if (typeof (configProperties[key]) === 'object') continue;
            stringifyConfig += key + "=" + configProperties[key] + endOfLine;
        }

        for (var dashboardKey in configProperties.dashboards) {
            var dashboard = configProperties.dashboards[dashboardKey];
            stringifyConfig += "dd:" + escape(dashboard.id) + endOfLine;
            stringifyConfig += "id=" + escape(dashboard.id) + endOfLine;

            for (var widgetKey in dashboard.widgets) {
                var widget = dashboard.widgets[widgetKey];
                stringifyConfig += "wt:" + endOfLine;;
                stringifyConfig += "d2=" + escape(widget.dashboardId) + endOfLine;
                stringifyConfig += "d3=" + escape(widget.deviceId) + endOfLine;
                stringifyConfig += "d4=" + escape(widget.deviceProperty) + endOfLine;
                stringifyConfig += "wd=" + escape(widget.widgetId) + endOfLine;
            }
        }

        for (var nodeKey in configProperties.nodes) {
            var node = configProperties.nodes[nodeKey];
            stringifyConfig += "ne:" + endOfLine;            
            stringifyConfig += "ht=" + escape(node.host) + endOfLine;
            stringifyConfig += "as=" + escape(node.alies) + endOfLine;
        }


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

