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

    cancel: false,
    _onchange: [],
    doOnChange: function () {
        for (var key in config._onchange) {
            config._onchange[key](configProperties);
        }
    },

    set onChange(onchange) {
        config._onchange.push(onchange);
    },

    _onload: [],
    doOnLoad: function () {
        for (var key in config._onload) {
            config._onload[key](configProperties);
        }
    },

    set onLoad(onload) {
        config._onload.push(onload);
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

    addWidget: function (_dashboardId, _daviceId, _deviceProperty, _widgetWrapperId,  _widgetId, _widgetProperties) {
        var dashboard = this.getDashboardById(_dashboardId);
        if (dashboard != undefined) {
            var widget = {
                dashboardId: _dashboardId,
                deviceId: _daviceId,
                deviceProperty: _deviceProperty,
                widgetWrapperId: _widgetWrapperId,
                widgetId: _widgetId,
                widgetProperties: _widgetProperties
            };
            dashboard.widgets.push(widget);
            config.doOnChange();            
            return widget;
        }
        return undefined;
    },

    getWidgetConfigPropById: function (id) {
        for (var i = 0; i < configProperties.dashboards[0].widgets.length; i++) {
            if (configProperties.dashboards[0].widgets[i].widgetId === id) {
                return configProperties.dashboards[0].widgets[i];
            }
        }
        return undefined;
    },

    onWidgetChange: function (widget) {
        var widgetConfigProp = config.getWidgetConfigPropById(widget.id);
        if (widgetConfigProp == undefined) {
            return;
        }
        widgetConfigProp.widgetProperties = widget.properties;
        config.doOnChange();
    },

    onWidgetDelete: function (widget) {
        var widgetConfigProp = config.getWidgetConfigPropById(widget.id);
        if (widgetConfigProp == undefined) return;

        //TODO: поправить удаление из массива
        configProperties.dashboards[0].widgets.splice(configProperties.dashboards[0].widgets.indexOf(widgetConfigProp), 1);
        config.doOnChange();
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
                    console.error(exception);
                    return; // don't add bad listner
                }
                this.networkStatusListners.push(event = { event: _event, sender: _sender });
            },

            devices: []
        }
        configProperties.nodes.push(node);
        config.doOnChange();
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
                                try {
                                    _event(_sender, this);
                                }
                                catch (exception) {
                                    console.error(exception);
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
                    result = true;

                    this.doOnLoad();
                    
                }
                else {
                    configProperties = "";
                }
            }
            catch (exception) {
                console.error(exception);
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

    // асинхронный метод сохранения внесенных изменений в настройки (передача строки разбитой на небольшие части в ноду) 
    save: function () {

        //формирование строки из текущих настроек подключенных нод
        var tempProp = defaultWebProp();
        //кнопка сохранения виджета
        var saveButton = document.getElementById("saveWidgetsButton");
        if (saveButton !== undefined && saveButton !== null) { 
            saveButton.hidden = true;
        } 


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

        //конвертирование в формат JSON
        var stringifyConfig = JSON.stringify(tempProp);

        //установка размера подстроки
        var subStringLength = 1024;

        // вызов функции сохранения
        var saveConfigResult = this.configSendAsync("Start", 0, stringifyConfig, subStringLength, boardhost);

        return saveConfigResult;

    },

    //функция асинхронной передачи строки через RESTfull POST запрос с/без отображением(я) состояния передачи строки в модельном окне
    //эта функция является одноврененно и функцией обратного вызова для выполняемого RESTfull POST запроса 
    //аргументы функции: httpResult - результат выполнения RESTfull POST запроса, counter - счетчик, dataString - вся передаваемая строка, lengthDataSubString - длина подстроки, url - адрес для отправки RESTfull POST запроса
    configSendAsync: function (httpResult, counter, dataString, lengthDataSubString, url) {
        // передаваемая подстрока
        var subString = "";
        // информация о передаваемой части строки для сохранения в файл web.config (для временного хранения передаваемых данных файл web.temp)
        var filePartName = "";
        // расчет количества подстрок (строка разбирая на подстроки) для передачи
        var countedSections = Math.floor(dataString.length / lengthDataSubString);
        // часть переданной строки в %
        var sendingAmount = "0";

        // текущий статус передачи строки отображающийся в модельном окне
        var savingCurrentStatus = "Saving changes";

        // элементы модального окна отобрающего процесс передачи строки
        var saveProgressBar = document.getElementById("saveProgressBar");
        var saveTextStatus = document.getElementById("savingTextStatus");
        var savingCloseButton = document.getElementById("saveConfigcloseButton");
        var saveButton = document.getElementById("saveWidgetsButton");
        var closeButton = document.getElementById("saveConfigsaveCloseButton");

        //Проверка была ли отменена передача строки
        if (config.cancel == false) {

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

                    sendingAmount = Math.floor((lengthDataSubString * counter / dataString.length) * 100).toString();


                }
                else {

                    if (counter == countedSections) {

                        subString = dataString.slice(counter * lengthDataSubString);


                        if (counter == 0) {

                            filePartName = "setwebproperty?property=head";

                        }

                        else {

                            filePartName = "setwebproperty?property=tail";
                            sendingAmount = "100";

                            if (savingCloseButton !== undefined && savingCloseButton !== null) {
                                savingCloseButton.disabled = true;
                            }

                        }

                    }

                    else {



                        if (countedSections !== 0) {


                            sendingAmount = "100";
                            if (saveProgressBar !== undefined && saveProgressBar !== null) {
                                saveProgressBar.setAttribute("aria-valuenow", sendingAmount);
                                saveProgressBar.setAttribute("style", "width:" + sendingAmount + "%");
                                saveProgressBar.innerHTML = sendingAmount + "%";

                               // saveButton.hidden = true;
                                saveTextStatus.innerHTML = "Changes saved";
                                savingCloseButton.hidden = true;
                                closeButton.hidden = false;
                                config.cancel = true;
                            } 
                           

                            addToLogNL("Sending long config string. FINISHED. Result = OK!");
                            
                            return true;


                        }
                        else {

                            if (counter == 1) {

                                filePartName = "setwebproperty?property=tail";
                                subString = "";
                                sendingAmount = "100";

                                if (savingCloseButton !== undefined && savingCloseButton !== null) {
                                    savingCloseButton.disabled = true;
                                }


                            }
                            else {


                                sendingAmount = "100";
                                if (saveProgressBar !== undefined && saveProgressBar !== null) {
                                    saveProgressBar.setAttribute("aria-valuenow", sendingAmount);
                                    saveProgressBar.setAttribute("style", "width:" + sendingAmount + "%");
                                    saveProgressBar.innerHTML = sendingAmount + "%";

                                 //   saveButton.hidden = true;
                                    saveTextStatus.innerHTML = "Changes saved";
                                    savingCloseButton.hidden = true;
                                    closeButton.hidden = false;
                                    config.cancel = true;
                                }
                             
                                addToLogNL("Sending short config string. FINISHED. Result = OK!");
                                
                                return true;

                            }
                        }
                    }

                }

                counter++;


                if (saveProgressBar !== undefined && saveProgressBar !== null) {
                    saveProgressBar.setAttribute("aria-valuenow", sendingAmount);
                    saveProgressBar.setAttribute("style", "width:" + sendingAmount + "%");
                    saveProgressBar.innerHTML = sendingAmount + "%";
                    saveTextStatus.innerHTML = savingCurrentStatus;
                }
                

                addToLogNL("Sending config string. Still sending! " + filePartName);
                //вызов функции асинхронного выполнения RESTfull POST запроса 
                httpPostAsyncWithErrorReson(url, filePartName, subString, config.configSendAsync, counter, dataString, lengthDataSubString);

            }
            else { 

                //если HTTPClient вернул ошибку, сообщаем об ошибке в модальном окне если оно открыто, возвращаем false
                if (saveTextStatus !== undefined && saveTextStatus !== null) {
                    saveTextStatus.innerHTML = "Saving changes error. Close this window and try again later!";
                    savingCloseButton.hidden = true;
                    closeButton.hidden = false;
                    config.cancel = true;
                }
                //возвращаем кнопку сохранить изменения
                if (saveButton !== undefined && saveButton !== null) {
                    saveButton.hidden = false;
                } 

               addToLogNL("Sending config string ERROR!" + httpResult);
                return false;

            }
        }
        else {
            // если была отменена передача строки (нажатие кнопки "отменить" в модельном окне), закрываем модельное окно и возвращаем false

            var modalWindowBody = document.getElementById("saveConfigModalBody");
            if (modalWindowBody !== null && modalWindowBody !== undefined) {
                $('#saveConfigModal').on('shown.bs.modal', function (e) {
                    $("#saveConfigModal").modal('hide');
                });
            }
 
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

