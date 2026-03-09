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


var settingsUI = {

    //добавляет новый пунк в сайдбар (раздел Узлы(Ноды))
    addThingSidebarItem: function (thing, _parent, _id, _href, _text, _onclick, _icon, _span) {
        var newSidebarItem = sideBar.createItem(_parent, _id + thing.thingnickname, "#" + thing.thingnickname + _href, _text, _onclick, "fa fa-microchip", _span);
        newSidebarItem.href.thing = thing;
        return newSidebarItem;
    },

    onConfigLoad: function (configProperties) {

        if (configProperties.things.length == 0) return;

        for (var thingKey in configProperties.things) {
            var thing = configProperties.things[thingKey];
            if (document.getElementById("thingNavItem" + thing.thingnickname) == undefined) {
                var thingNavItem = this.addThingSidebarItem(thing, sideBar.thingSubItem, "thingNavItem", "submenu", thing.thingnickname, sidebarItemClick, "fa fa-microchip", undefined);

                var thingNavSubItem = sideBar.createDeepItem(thingNavItem, thing.thingnickname + "submenu");

                //thing properties subItem 
                var thingPropItem = this.addThingSidebarItem(thing, thingNavSubItem, "thingpropitem", "thingPropsPanel", getLang("thingproperties"), sidebarItemClick, "fa fa-cog", undefined);
                thing.thingPropItem = thingPropItem;
                //thing drivers                                 
                var driversItem = this.addThingSidebarItem(thing, thingNavSubItem, "driversitem", "driverssubmenu", getLang("drivers"), sidebarItemClick, undefined, "0");
                var driversSubItem = sideBar.createDeepItem(driversItem, thing.thingnickname + "driverssubmenu");
                var addDriverItem = this.addThingSidebarItem(thing, driversSubItem, "adddriveritem", "adddriveritem", getLang("adddriver"), settingsUI.addDriverClick, "fa fa-plus", undefined);
                addDriverItem.href.style.color = theme.warning;

                //thing scripts                
                var scriptsItem = this.addThingSidebarItem(thing, thingNavSubItem, "scriptsitem", "scriptssubmenu", getLang("scripts"), settingsUI.scriptAnchorClick, undefined, undefined);
                var scriptsSubItem = sideBar.createDeepItem(scriptsItem, thing.thingnickname + "scriptssubmenu");
                var addScriptItem = this.addThingSidebarItem(thing, scriptsSubItem, "addscriptitem", "addscriptitem", getLang("createscript"), scriptsUI.createScriptClick, "fa fa-plus", undefined);
                addScriptItem.href.style.color = theme.warning;

                //thing files                 
                var filesItem = this.addThingSidebarItem(thing, thingNavSubItem, "filesitem", "_filesfadepanel", getLang("files"), sidebarItemClick, undefined, undefined);

                //--- thingPropsPanel ---------------------------------------------------------------------------
                //панель для панелей с быстрым доступам к основным свойствам ноды

                var thingsPropsPanel = document.getElementById("thingsPropsPanel");

                //--- thingPropsPanel ---------------------------------------------------------------------------
                //панель для панелей с быстрым доступам к основным свойствам ноды
                var thingPropsPanel = thingsPropsPanel.appendChild(document.createElement('div'));
                thingPropsPanel.className = "tab-pane fade";
                thingPropsPanel.id = thing.thingnickname + "thingPropsPanel";
                thingPropItem.href.thingfadepanel = thingPropsPanel;

                var thingPropHolderPanel = thingPropsPanel.appendChild(document.createElement('div'));
                thingPropHolderPanel.id = thing.thingnickname + "bodePropHoder";
                thingPropHolderPanel.className = "row";

                //подготавливаем панели со свойствами ноды (для каждой ноды своя панель id = thing.thingnickname + "thingPropPanel")
                //смотрите обработчик события onDriverLoaded() - он запоняет эту панель
                settingsUI.addCard(thingPropHolderPanel, thing.thingnickname + "NetworkThingProp", getLang("networkthingprop"), 12);
                var networkThingPropBody = document.getElementById(thing.thingnickname + "NetworkThingPropBody");
                settingsUI.addDiv(networkThingPropBody, thing.thingnickname + "NetworkThingPropBody1", 4);
                $("#" + thing.thingnickname + "NetworkThingPropBody1").toggleClass("thing-prop-col");
                settingsUI.addDiv(networkThingPropBody, thing.thingnickname + "NetworkThingPropBody2", 4);
                $("#" + thing.thingnickname + "NetworkThingPropBody2").toggleClass("thing-prop-col1");
                settingsUI.addDiv(networkThingPropBody, thing.thingnickname + "NetworkThingPropBody3", 4);
                $("#" + thing.thingnickname + "NetworkThingPropBody3").toggleClass("thing-prop-col2");

                settingsUI.addCard(thingPropHolderPanel, thing.thingnickname + "WifiThingProp", getLang("wifithingprop"), 4); //WifiThingPropPanel - свойства WiFi                
                settingsUI.addCard(thingPropHolderPanel, thing.thingnickname + "SystemThingProp", getLang("systemthingprop"), 4);
                settingsUI.addCard(thingPropHolderPanel, thing.thingnickname + "UpdateThingProp", getLang("updatethingprop"), 4);
                //--- EndOf thingPropsPanel ---------------------------------------------------------------------------

                // Add Thing Status Panel -----------------------------------------------------------------------------
                var thingStatusPanel = document.createElement("div");
                thingStatusPanel.id = thing.thingnickname + "thingstatuspanel";
                thingNavItem.href.thingStatusPanel = thingStatusPanel;

                var deleteThingButton = headerPanelUI.addButton(thing.thingnickname + "DeleteThingButton", "fa fa-minus", "delete thing: " + thing.thingnickname, headerPanelUI.thingPoropertiesPanelButtonRole);
                deleteThingButton.thing = thing;
                deleteThingButton.onclick = settingsUI.onDeleteThing;
                thingPropItem.href.deleteThingButton = deleteThingButton;
                thingNavItem.href.deleteThingButton = deleteThingButton;

                thingNavItem.href.onlinePanel = settingsUI.getStatusWidget(thing.thingnickname + "onlineStatus", "Online", thingStatusPanel);

                thing.addNetworkStatusListner(settingsUI.onOnlineStatusChange, thingNavItem.href.onlinePanel);
                thingNavItem.href.WiFiAPPanel = settingsUI.getStatusWidget(thing.thingnickname + "wifiapStatus", "WiFi AP", thingStatusPanel);

                thingNavItem.href.WiFiSTPanel = settingsUI.getStatusWidget(thing.thingnickname + "wifistStatus", "WiFi ST", thingStatusPanel);
                thingNavItem.href.RESTfulPanel = settingsUI.getStatusWidget(thing.thingnickname + "restfulStatus", "RESTful", thingStatusPanel);
                thingNavItem.href.MQTTPanel = settingsUI.getStatusWidget(thing.thingnickname + "mqttStatus", "MQTT", thingStatusPanel);
                thingNavItem.href.OTAPanel = settingsUI.getStatusWidget(thing.thingnickname + "otaStatus", "OTA", thingStatusPanel);

                var filesDiv = thingsPropsPanel.appendChild(document.createElement('div'));
                filesDiv.className = "tab-pane fade";
                filesDiv.id = thing.thingnickname + "_filesfadepanel";
                filesItem.href.filesList = new FilesList(filesDiv, thing);
                //--- EndOf Thing files panel --------------------------------------------
            }
        }
    },




    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //когда очередная нода загружает очередное драйвер - строим индикаторы в верхней панели "Настройки" - Online, WiFi AP, WiFi ST, RESTful, MQTT, OTA
    //и подготавлием панель управления нодой (с кнопками Update, Reset и основными свойствами ноды) - смотрите onConfigChange такая панель создается для каждой
    //ноды id = thing.thingnickname + "thingPropPanel"    
    onDriverLoaded: function (sender, driver) {
        if ((driver == undefined) || (driver.type == undefined)) return;
        if (driver._new) { //если это драйвер загружено впервые (вновь созданные драйвера так же вызовут этот метод)

            var thingSubmenuUl = document.getElementById(driver._thingnickname + "driverssubmenu"); //ищем пункт sideBar соответствующий ноде которой принадлежит драйвер
            if (thingSubmenuUl == undefined) return; //если такого пункта нет - выходим

            var thing = config.getThingByHost(driver._host); //узнаем какой ноде принадлежит драйвер
            if (thing == undefined) return; //выходим если нода не найдена

            //submenu drivers count 
            driversitemlocalspan
            var driverSpan = document.getElementById("driversitem" + driver._thingnickname + "span");
            if (driverSpan != null) {
                if (driverSpan.driversCount == undefined) {
                    driverSpan.driversCount = 0;
                }
                driverSpan.driversCount++;
                driverSpan.innerHTML = parseInt(driverSpan.driversCount);
            }

            var driverItem = settingsUI.addThingSidebarItem(thing, thingSubmenuUl, "_" + driver._id, "_" + driver._id, driver._id, sidebarItemClick, "fa fa-sliders-h", undefined);
            driver.driverItem = driverItem;
            driverItem.href.thing = thing;
            var deleteDriverButton = headerPanelUI.addButton(thing.thingnickname + "DeleteDriverButton", "fa fa-minus", "delete driver: " + driver._id, headerPanelUI.driverButtonRole);
            deleteDriverButton.thing = thing;
            deleteDriverButton.driver = driver;
            deleteDriverButton.onclick = settingsUI.onDeleteDriver;
            driverItem.href.deleteDriverButton = deleteDriverButton;

            var thingPropAnchors = document.getElementById("thingPropNavBar"); //старая навигационная панель для отображения панелей свойств
            var thingsPropsPanel = document.getElementById("thingsPropsPanel");
            var wifiPropPanel = document.getElementById(thing.thingnickname + "WifiThingPropBody"); //панель для cвойств            
            var systemPropPanel = document.getElementById(thing.thingnickname + "SystemThingPropBody");
            var updatePropPanel = document.getElementById(thing.thingnickname + "UpdateThingPropBody");
            var networkPropPanel1 = document.getElementById(thing.thingnickname + "NetworkThingPropBody1");
            var networkPropPanel2 = document.getElementById(thing.thingnickname + "NetworkThingPropBody2");
            var networkPropPanel3 = document.getElementById(thing.thingnickname + "NetworkThingPropBody3");

            //добавляем панель с таблицей со свойствами нового "driver" драйвера в панель thingsPropsPanel, якорим навигацию на thingPropAnchors, bootstrap cell size -> 12             
            driver.driverPropTable = new TableWidget(thingPropAnchors, thingsPropsPanel, driver, 12);

            //если очередное загруженое драйвер WiFi
            if (driver.type.value == WiFiDriverType) {
                //индикатор(widget) в верхней панеле для WiFi AP и Wifi ST - подключаем их к событиям WiFi текущей thing.WifiDriver - теперь WifiDriver будет отправлять событие 
                //о своем состоянии непосредственно индикаторам 
                //сколько будет thing столько будет индикаторов для их WiFi driver - мы отображаем только индикаторы выбранной в SideBar (текущей) thing и ее драйвер
                //смотрите headerPanelUI.addStatus() метод - если индикатора нет его создадут и подпишут id как thing.thingnickname + "wifiapStatus"

                //#ST_PANEL
                //WiFi Access Point header status indicator ----------------------------             
                var WiFiAPPanel = headerPanelUI.addStatus(thing, thing.thingnickname + "wifiapStatus", "WiFi AP");
                //подписываем свойство драйвера WiFi.wifiaccesspointavailable на обработчик settingsUI.onWiFiAPStatusChange
                //если WiFi.wifiaccesspointavailable изменит значение, будет вызван settingsUI.onWiFiAPStatusChange
                driver.wifiaccesspointavailable.addValueListner(settingsUI.onWiFiAPStatusChange, WiFiAPPanel);
                //EndOf WiFi Access Point header status indicator ----------------------
                //так же как и WiFi AP
                //var WiFiSTPanel = settingsUI.getStatusWidget(thing.thingnickname + "wifistStatus", "WiFi ST", undefined); //
                var WiFiSTPanel = headerPanelUI.addStatus(thing, thing.thingnickname + "wifistStatus", "WiFi ST"); //
                driver.wifistatus.addValueListner(settingsUI.onWiFiSTStatusChange, WiFiSTPanel);
                //панель со свойствами thing - добавляем отображени уровня WiFi сигнала (так же подписываем на событие изменения значения WiFi.wifirssi)
                var wifiAPCheckbox = settingsUI.addPropertyCheckbox(wifiPropPanel, driver.wifiaccesspointavailable, getLang("wifiaccesspointavailable"), "");

                wifiAPCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifiaccesspointssid, getLang("wifiaccesspointssid"), ""));
                wifiAPCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifiappassword, getLang("wifiappassword"), ""));

                settingsUI.onPropertyCheckboxValueChange(wifiAPCheckbox, wifiAPCheckbox.driverProperty);

                settingsUI.addSpaceView(wifiPropPanel, "1");

                var wifiSTCheckbox = settingsUI.addPropertyCheckbox(wifiPropPanel, driver.wifiavailable, getLang("wifiavailable"), "");
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifissid, getLang("wifissid"), ""));
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifipassword, getLang("wifipassword"), ""));
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifiip, getLang("wifiip"), ""));

                settingsUI.onPropertyCheckboxValueChange(wifiSTCheckbox, wifiSTCheckbox.driverProperty);

                settingsUI.addPropertyView(wifiPropPanel, driver.wifirssi, getLang("wifirssi"), "dBm");
            }
            else
                if (driver.type.value == ESPDriverType) {

                    if (thing.host == boardhost) { //the local thing 


                        var driverProperty = {
                            parentid: boardhost,
                            name: "language",
                            type: "",
                            value: configProperties["language"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                        var driverProperty = {
                            parentid: boardhost,
                            name: "widgetssize",
                            type: "i",
                            value: configProperties["widgetssize"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                        var driverProperty = {
                            parentid: boardhost,
                            name: "speak",
                            type: "b",
                            value: configProperties["speak"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                        var driverProperty = {
                            parentid: boardhost,
                            name: "voice",
                            type: "i",
                            value: configProperties["voice"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                    }

                    settingsUI.addPropertyView(systemPropPanel, driver.espfreesketchspace, getLang("espfreesketchspace"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, driver.espfreeheap, getLang("espfreeheap"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, driver.espcpufreqmhz, getLang("espcpufreqmhz"), "mHz");
                    settingsUI.addPropertyView(systemPropPanel, driver.espresetreason, getLang("espresetreason"));

                    settingsUI.addSpaceView(systemPropPanel, "4");
                    var resetButton = systemPropPanel.appendChild(document.createElement('input'));
                    resetButton.className = "btn btn-danger btn-sm";
                    resetButton.type = "button";
                    resetButton.setAttribute("data-toggle", "modal");
                    resetButton.setAttribute("data-target", "#resetModal");
                    resetButton.value = getLang("reset");
                    resetButton.driverHost = driver._host;
                    resetButton.onclick = settingsUI.modalResetClick;

                }
                else
                    if (driver.type.value == NetworkDriverType) {

                        var RESTfulPanel = headerPanelUI.addStatus(thing, thing.thingnickname + "restfulStatus", "RESTful");
                        driver.httpserveravailable.addValueListner(settingsUI.onRESTfulStatusChange, RESTfulPanel);

                        var thing = config.getThingByHost(driver._host);
                        thing.addNetworkStatusListner(settingsUI.onRESTfulOnlineStatusChange, RESTfulPanel);


                        if (driver.mqttclientstate !== undefined) {
                            var MQTTPanel = headerPanelUI.addStatus(thing, thing.thingnickname + "mqttStatus", "MQTT");
                            driver.mqttclientstate.addValueListner(settingsUI.onMQTTStatusChange, MQTTPanel);
                        }

                        if (driver.otaavailable !== undefined) {
                            var OTAPanel = headerPanelUI.addStatus(thing, thing.thingnickname + "otaStatus", "OTA");
                            driver.otaavailable.addValueListner(settingsUI.onOTAStatusChange, OTAPanel);
                        }

                        var RESTfulCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel1, driver.httpserveravailable, getLang("httpserveravailable"), "");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpserverlogin, getLang("httpserverlogin"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpserverpwd, getLang("httpserverpwd"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpserverport, getLang("httpserverport"), ""));
                        settingsUI.addSpaceView(networkPropPanel1, "2");

                        settingsUI.addPropertyCheckbox(networkPropPanel1, driver.httpsserveravailable, getLang("httpsserveravailable"), "");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpsserverlogin, getLang("httpsserverlogin"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpsserverpwd, getLang("httpsserverpwd"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpsserverport, getLang("httpsserverport"), ""));
                        settingsUI.addSpaceView(networkPropPanel1, "2");

                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpclienturl, getLang("httpclienturl"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.httpclientport, getLang("httpclientport"), ""));
                        settingsUI.onPropertyCheckboxValueChange(RESTfulCheckbox, RESTfulCheckbox.driverProperty);

                        if (driver.mqttavailable !== undefined) {
                            var MQTTCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel2, driver.mqttavailable, getLang("mqttavailable"), "");
                            MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqtturl, getLang("mqtturl"), ""));
                            MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttport, getLang("mqttport"), ""));
                            settingsUI.addSpaceView(networkPropPanel2, "3");
                            MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttid, getLang("mqttid"), ""));
                            MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttlogin, getLang("mqttlogin"), ""));
                            MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttpassword, getLang("mqttpassword"), ""));
                            settingsUI.onPropertyCheckboxValueChange(MQTTCheckbox, MQTTCheckbox.driverProperty);
                        }

                        if (driver.otaavailable !== undefined) {
                            var OTACheckbox = settingsUI.addPropertyCheckbox(networkPropPanel3, driver.otaavailable, getLang("otaavailable"), "");
                            OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otaid, getLang("otaid"), ""));
                            OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otaport, getLang("otaport"), ""));
                            OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otapassword, getLang("otapassword"), ""));
                            settingsUI.onPropertyCheckboxValueChange(OTACheckbox, OTACheckbox.driverProperty);
                        }

                        settingsUI.addPropertyView(updatePropPanel, driver.firmwareversion, getLang("firmwareversion"));
                        settingsUI.addPropertyView(updatePropPanel, driver.firmwarebuildnumber, getLang("firmwarebuildnumber"));

                        settingsUI.addSpaceView(updatePropPanel, "5");
                        settingsUI.addPropertyEdit(updatePropPanel, driver.updatehost, getLang("updatehost"), "");

                        //Update watcher panel 
                        //Панель обновлений
                        var updateWatcherId = thing.thingnickname + "updateWatcher";
                        var updateWatcherDiv = document.getElementById(updateWatcherId);
                        if (driver.updateinfo != undefined) {
                            if (updateWatcherDiv == null) {
                                updateWatcherDiv = updatePropPanel.appendChild(document.createElement('div'));
                                updateWatcherDiv.id = updateWatcherId;
                                updateWatcherDiv.className = "text-primary";
                                //one listner to two properties

                                var updateButtonHolder = updatePropPanel.appendChild(document.createElement('div'));
                                updateButtonHolder.className = "row";
                                var updateuiButton = updateButtonHolder.appendChild(document.createElement('input'));
                                updateuiButton.id = thing.thingnickname + "updateuibutton";
                                updateuiButton.className = "btn btn-success btn-sm float-right";
                                updateuiButton.type = "button";
                                updateuiButton.setAttribute("data-toggle", "modal");
                                updateuiButton.setAttribute("data-target", "#resetModal");
                                updateuiButton.value = getLang("updateuibutton");
                                updateuiButton.thing = thing;
                                updateuiButton.onclick = settingsUI.modalUpdateUIClick;

                                var updatefirmwareButton = updateButtonHolder.appendChild(document.createElement('input'));
                                updatefirmwareButton.id = thing.thingnickname + "updatefirmwarebutton";
                                updatefirmwareButton.className = "btn btn-success btn-sm float-right";
                                updatefirmwareButton.type = "button";
                                updatefirmwareButton.setAttribute("data-toggle", "modal");
                                updatefirmwareButton.setAttribute("data-target", "#resetModal");
                                updatefirmwareButton.value = getLang("updatefirmwarebutton");
                                updatefirmwareButton.thing = thing;
                                updatefirmwareButton.onclick = settingsUI.modalUpdateFirmwareClick;

                                updateuiButton.style.display = "none";
                                updatefirmwareButton.style.display = "none";

                                updateWatcherDiv.updateuiButton = updateuiButton; // document.getElementById("updateuibutton");
                                updateWatcherDiv.updatefirmwareButton = updatefirmwareButton;

                                driver.updateinfo.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                                driver.updatepossible.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                            }
                        }
                    }
                    else
                    //Air Quality widgets -----------------------
                    {
                        document.getElementById("noWidgetsPanel").style.display = "none";
                        var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");
                        var driverProp;
                        var widgetLayer;
                        if (driver._id === "dht22") {

                            driverProp = driver["temperature"];
                            widgetLayer = WidgetsLayer["TemperatureWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "DHT22 Temperature";
                                widgetWrapper.widget.drawText();
                                //block edit-delete    
                                //widgetWrapper.widget.onchange = config.onWidgetChange;
                                //widgetWrapper.widget.ondelete = config.onWidgetDelete;
                            }

                            driverProp = driver["temperaturehistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "DHT22 Temperature";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["humidity"];
                            widgetLayer = WidgetsLayer["RadialWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {

                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "DHT22 Humidity";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["humidityhistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "DHT22 Humidity";
                                widgetWrapper.widget.drawText();
                            }


                            driverProp = driver["heatindex"];
                            widgetLayer = WidgetsLayer["RadialWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {

                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "DHT22 HeatIndex";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["heatindexhistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "DHT22 HeatIndex";
                                widgetWrapper.widget.drawText();
                            }
                        }
                        if (driver._id === "bmp280") 
                        {
                            driverProp = driver["pressure"];
                            widgetLayer = WidgetsLayer["ValueWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "BMP280 pressure(Pa)";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["pressurehistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "BMP280 pressure(Pa)";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["altitude"];
                            widgetLayer = WidgetsLayer["ValueWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "BMP280 altitude(m)";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["altitudehistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "BMP280 altitude(m)";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["temperature"];
                            widgetLayer = WidgetsLayer["TemperatureWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "BMP280 Temperature";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["temperaturehistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "BMP280 Temperature";
                                widgetWrapper.widget.drawText();
                            }
                        }

                        if (driver._id === "ads1x15") {

                            driverProp = driver["chanel_3"];
                            widgetLayer = WidgetsLayer["LightWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "Light";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["chanel_3_historydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "Light";
                                widgetWrapper.widget.drawText();
                            }
                            
                            driverProp = driver["chanel_2"];
                            widgetLayer = WidgetsLayer["SmokeWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "MQ 7";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["chanel_2_historydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "MQ 7 Carbon Monoxide";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["chanel_1"];
                            widgetLayer = WidgetsLayer["SmokeWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "MQ 135";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["chanel_1_historydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "MQ 135 Gas";
                                widgetWrapper.widget.drawText();
                            }
                        }

                        if (driver._id === "ccs811") {

                            driverProp = driver["co2"];
                            widgetLayer = WidgetsLayer["ValueWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "CO2";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["co2historydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "CO2";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["tvoc"];
                            widgetLayer = WidgetsLayer["RadialWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "TVOC";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["tvochistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "TVOC";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["resistence"];
                            widgetLayer = WidgetsLayer["ValueWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "Resistence";
                                widgetWrapper.widget.drawText();
                            }

                            driverProp = driver["resistencehistorydata"];
                            widgetLayer = WidgetsLayer["HistoryDataGraphWidget"];
                            new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
                                config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
                                widgetWrapper.widget.properties.headertext.value = "Resistence";
                                widgetWrapper.widget.drawText();
                            }


                        }


                    }

        }
    },

    addThingClick: function (event) {
        event.stopPropagation();
        var newThingDialog = createModalDialog(getLang("addthingheader"), "");
        newThingDialog.appendInput(createDialogInput("newthingname", getLang("addthingname"), ""));
        newThingDialog.appendInput(createDialogInput("newthinghost", getLang("addthinghost"), "http://host:port/ or https://host:port/"));

        newThingDialog.onOK = settingsUI.addThingUIClick;
        newThingDialog.show();
        return false;
    },

    addThingUIClick: function (newThingDialog) {

        var inputName = newThingDialog.getChild("newthingname");
        var inputHost = newThingDialog.getChild("newthinghost");

        if (inputHost.value.length == 0) {
            newThingDialog.errorLabel.innerText = getLang("addthingerror_hostempty");
            return false;
        }

        if (inputHost.value.indexOf("http") != 0) {
            inputHost.value = "http://" + inputHost.value;
        }

        var regexp = RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})");

        if (!inputHost.value.match(regexp)) {
            newThingDialog.errorLabel.innerText = getLang("addthingerror_hostnoturl");
            return false;
        }

        if (inputHost.value.slice(-1) !== '/') {
            inputHost.value += '/';
        }

        //boardhost = input.value;
        if (config.addThing(inputHost.value, inputName.value)) {
            addToLogNL("Connection to master thing " + boardhost + "...");
            //use it as ping            
            return true;
        }
        return false;
    },

    onNetworkChange: function (sender, thing) {
        if (thing.networkStatus == NET_ONLINE) {
            sender.className = "text-success";
        }
        else
            if ((thing.networkStatus == NET_RECONNECT) || (thing.networkStatus == NET_REFRESH)) {
                sender.className = "text-info";
            }
            else
                if (thing.networkStatus == NET_OFFLINE) {
                    sender.className = "text-secondary";
                }
                else  //error
                    if (thing.networkStatus == NET_ERROR) {
                        sender.className = "text-danger";
                    }
    },

    modalResetClick: function (event) {
        event.stopPropagation();
        var driverHost = event.currentTarget.driverHost;
        var resetDialog = createModalDialog(getLang("reset"), "");
        resetDialog.formGroup.innerHTML = getLang("areYouSure");
        resetDialog.thingHost = driverHost;
        resetDialog.onOK = settingsUI.onResetOK;
        resetDialog.show();
        return false;
    },

    onResetOK: function (resetDialog) {
        resetThingOneWayTicket(resetDialog.thingHost);

        sleep(5000).then(function () {
            location.reload();
            return false;
        });

    },


    modalUpdateUIClick: function (event) {

        var updateuiButton = event.currentTarget;
        var thing = updateuiButton.thing;

        makeModalDialog("resetPanel", "update", getLang("updatething"), getLang("areYouSure"));
        var modalFooter = document.getElementById("updateModalFooter");

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "updateModalButton";
        updateButton.onclick = settingsUI.updateUIClick;
        updateButton.thing = thing;
        updateButton.innerText = getLang("updateuibutton");

        $("#updateModal").modal('show');

        return false;
    },

    updateUIClick: function (event) {

        var updateButton = event.currentTarget;
        var thing = updateButton.thing;
        var modalFooter = document.getElementById("updateModalFooter");
        modalFooter.removeChild(event.currentTarget);

        var modalBody = document.getElementById("updateModalBody");
        modalBody.innerHTML = "";
        var updateLog = modalBody.appendChild(document.createElement("pre"));
        updateLog.innerHTML = "Update UI started, please wait...<br>";
        updateUIAsync(thing.host);


        settingsUI.updateUILogTimer(thing, updateLog);
        return false;
    },

    updateUILogTimer: function (thing, updateLog) {
        "use strict";
        sleep(1000).then(function () {
            getUpdateLogAsyncWithReciever(thing.host, settingsUI.updateUILogReciever, thing, updateLog, undefined);
            return false;
        });

    },
    updateUILogReciever: function (HTTPResult, thing, sender, upperSender) {
        if (!HTTPResult.indexOf("%error") == 0) {
            sender.innerHTML = "Update log:<br>" + HTTPResult;

            if (HTTPResult.indexOf("complete") == -1) {
                settingsUI.updateUILogTimer(thing, sender);
            }
            else {
                var modalFooter = document.getElementById("updateModalFooter");
                var resetButton = modalFooter.appendChild(document.createElement("button"));
                resetButton.type = "button";
                resetButton.className = "btn btn-sm btn-danger";
                resetButton.id = "resetModalButton";
                resetButton.thingHost = thingHost;
                resetButton.onclick = SettingsIU.resetClick;
                resetButton.innerText = getLang("reset");
            }

        }
        else {
            sender.innerHTML += "HTTP client - " + HTTPResult;
        }
    },
    //--------------------------------------------------------------------------------------------------------------------
    modalUpdateFirmwareClick: function (event) {
        var updateButton = event.currentTarget;
        var thing = updateButton.thing;

        makeModalDialog("resetPanel", "firmware", getLang("firmware"), getLang("areYouSure"));
        var modalFooter = document.getElementById("firmwareModalFooter");

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "firmwareModalButton";
        updateButton.onclick = settingsUI.updateFirmwareClick;
        updateButton.thing = thing;
        updateButton.innerText = getLang("firmwarebutton");

        $("#firmwareModal").modal('show');

        return false;
    },

    updateFirmwareClick: function (event) {
        var updateButton = event.currentTarget;
        var thing = updateButton.thing;

        var modalFooter = document.getElementById("firmwareModalFooter");
        modalFooter.removeChild(event.currentTarget);

        var modalBody = document.getElementById("firmwareModalBody");
        modalBody.innerHTML = "";
        var updateLog = modalBody.appendChild(document.createElement("div"));
        updateLog.innerHTML = getLang("updatefirmware");
        updateFirmwareAsync(thing.host);
        getUpdateLogAsyncWithReciever(thing.host, settingsUI.updateLogReciever, undefined, updateLog, undefined);

        "use strict";

        sleep(30000).then(function () {
            location.reload();
            return false;
        });
        return false;
    },

    updateLogReciever: function (HTTPResult, upperReciever, sender, upperSender) {
        if (!HTTPResult.indexOf("%error") == 0) {
            sender.innerHTML = "Update log:<br>" + HTTPResult;
        }
        else {
            sender.innerHTML += "HTTP client - " + HTTPResult;
        }
    },

    addCard: function (parentDiv, id, text, cellSize) {
        var cardPanel = parentDiv.appendChild(document.createElement('div'));
        cardPanel.id = id + "Panel";
        cardPanel.className = "col-md-" + cellSize;
        var card = cardPanel.appendChild(document.createElement('div'));
        card.className = "card bg-dark border-info mb-3";
        var header = card.appendChild(document.createElement('div'));
        header.className = "card-header";
        var headerText = header.appendChild(document.createElement('div'));
        headerText.innerHTML = text;
        var body = card.appendChild(document.createElement('div'));
        body.id = id + "Body"
        body.className = "card-body";
        return cardPanel;
    },

    addDiv: function (parentDiv, id, cellSize) {
        parentDiv.className = "card-body row";
        var divPanel = parentDiv.appendChild(document.createElement('div'));
        divPanel.id = id;
        divPanel.className = "col-md-" + cellSize;
        return divPanel;
    },


    //добавляет строку со названием и значением свойства на panelDiv, driverProperty - отображаемое свойство (подписывается на изменения свойства)
    //обычно используется для отображения свойств ноды Thing/Properties в SideBar разделе Settings
    addPropertyView: function (panelDiv, driverProperty, text, sufix) {
        if (driverProperty == undefined) return;
        var propElementId = panelDiv.id + driverProperty.parentid + driverProperty.name; //дормируем уникальный ID элемента
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            //propTextDiv.className = "text-light";
            propTextDiv.propertyText = text;
            if (sufix == undefined) sufix = "";
            propTextDiv.propertySufix = sufix;
            //settingsUI.onPropertyViewedValueChange опрашивает значение указанного свойства и формирует HTML для propTextDiv 
            //смотрите onPropertyViewedValueChange - он работает в паре с этим методом
            driverProperty.addValueListner(settingsUI.onPropertyViewedValueChange, propTextDiv);
        }
        return propTextDiv;
    },
    //работает в паре с addPropertyView, "следит" за значением свойства
    onPropertyViewedValueChange: function (sender, driverProperty) {
        sender.innerHTML = "<strong>" + sender.propertyText + ":</strong> " + driverProperty.value + " " + sender.propertySufix + "<br>";
    },

    //добавляет редактор указаного свойства driverProperty на указанную панель panelDiv
    //работает так же как addPropertyView, но позволяет изменять значение свойства 
    addPropertyEdit: function (panelDiv, driverProperty, text, sufix) {
        if (driverProperty == undefined) return;
        var propElementId = panelDiv.id + driverProperty.parentid + driverProperty.name;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            propTextDiv.className = "text-light";
            propTextDiv.driverProperty = driverProperty;
            propTextDiv.propertyText = text;
            if (sufix == undefined) sufix = "";
            propTextDiv.propertySufix = sufix;

            inputGroup = propTextDiv.appendChild(document.createElement("div"));
            inputGroup.className = "input-group input-group-sm mb-3";

            var prependDiv = inputGroup.appendChild(document.createElement("div"));
            prependDiv.className = "input-group-prepend";

            propText = prependDiv.appendChild(document.createElement("label"));
            propText.className = "input-group-text smlabel";
            propText.setAttribute("for", propElementId + "edit");
            propTextDiv.propText = propText;

            var propEdit = createValueEdit(inputGroup, driverProperty.name, driverProperty.value, driverProperty.type)
            //var propEdit = inputGroup.appendChild(document.createElement('input'));
            propEdit.style.width = "";
            propEdit.className = "form-control";
            propEdit.id = propElementId + "edit";

            propTextDiv.propEdit = propEdit;

            var appendDiv = inputGroup.appendChild(document.createElement("div"));
            appendDiv.className = "input-group-append";

            var propSetButton = appendDiv.appendChild(document.createElement("Button"));
            propSetButton.type = "button";
            propSetButton.className = "btn btn-outline-success btn-sm";
            propSetButton.innerText = getLang("set");
            propSetButton.onclick = settingsUI.propSetButtonClick;
            propSetButton.propTextDiv = propTextDiv;
            propTextDiv.propSetButton = propSetButton;

            if (driverProperty.addValueListner != undefined) {
                driverProperty.addValueListner(settingsUI.onPropertyEditedValueChange, propTextDiv);
                driverProperty.addNetworkStatusListner(settingsUI.onPropertyEditNetworkChange, propTextDiv);
            }
            else {
                propText.innerText = text;
                propEdit.value = driverProperty.value;
            }
        }
        return propTextDiv;
    },
    //работает в паре с addPropertyEdit
    onPropertyEditedValueChange: function (sender, driverProperty) {
        sender.propText.innerText = sender.propertyText;
        sender.propEdit.value = driverProperty.value;
        //+ driverProperty.value + " " + sender.propertySufix + "<br>";
    },

    onPropertyEditNetworkChange: function (sender, driverProperty) {

        if (driverProperty.networkStatus == NET_ONLINE) {
            sender.propEdit.disabled = false;

            sender.propSetButton.className = "btn btn-outline-success btn-sm";
        } else if (driverProperty.networkStatus == NET_RECONNECT) {
            sender.propEdit.disabled = true;
            sender.propSetButton.className = "btn btn-outline-info btn-sm";
        } else if (driverProperty.networkStatus == NET_OFFLINE) {
            sender.propEdit.disabled = true;
            sender.propSetButton.className = "btn btn-outline-secondary btn-sm";
        } else //error
            if (driverProperty.networkStatus == NET_ERROR) {
                sender.propEdit.disabled = true;
                sender.propSetButton.className = "btn btn-outline-danger btn-sm";
            }

    },

    propSetButtonClick: function (event) {
        event.stopPropagation();
        var propSetButton = event.currentTarget; //вытаскиваем "кликнутую" кнопку из event 
        var propTextDiv = propSetButton.propTextDiv; //вытаскиваем панель со свойством
        var driverProperty = propTextDiv.driverProperty; //вытастиваем свойство драйвера

        if (driverProperty.addValueListner != undefined) {

            if (driverProperty.networkStatus != NET_RECONNECT) {
                //если свойство драйвера не в статуре "в реботе" - асинхронность это хорошо, но переполнять очередь это преступление

                var value = propTextDiv.propEdit.value; //получаем значение свойства драйвера введенное пользователем

                if (driverProperty.type.indexOf("b") != -1) // boolean - представлен в виде combobox а не редактора 
                {
                    if (propTextDiv.propEdit.selectedIndex == 0) value = "1"; //для драйвера 1 - true, 0 - false
                    else value = "0";
                } //вызываем метод свойства драйвера для начала процедуры изменения этого свойства с новым значением value
                //не назначаем вторичных получателей undefined, undefined - все получатели уже подписаны ранее

                driverProperty.setValue(value, undefined, undefined);
            }
        }
        else {
            var result = false;

            propTextDiv.propEdit.disabled = true;
            propTextDiv.propSetButton.className = "btn btn-outline-info btn-sm";

            try {
                configProperties[driverProperty.name] = propTextDiv.propEdit.value;
                config.save();

                propTextDiv.propEdit.disabled = false;
                propTextDiv.propSetButton.className = "btn btn-outline-success btn-sm";

                result = true;

            } catch (exception) {
                console.error(exception);
                addToLogNL("ERROR save value: " + exception, 2);
            }

            if (!result) {
                propTextDiv.propEdit.disabled = true;
                propTextDiv.propSetButton.className = "btn btn-outline-danger btn-sm";
            }
        }

        return false;
    },

    //добавляет флажек связанный с указаным свойствам (свойство обезательно Boolean)
    //работает так же как addPropertyEdit
    addPropertyCheckbox: function (panelDiv, driverProperty, text, sufix) {
        if (driverProperty == undefined) return;
        var propElementId = panelDiv.id + driverProperty.parentid + driverProperty.name;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.className = "input-group input-group-sm mb-3";
            propTextDiv.id = propElementId;
            propTextDiv.driverProperty = driverProperty;
            propTextDiv.propertyText = text;
            propTextDiv.dependetPanels = [];
            if (sufix == undefined) sufix = "";
            propTextDiv.propertySufix = sufix;

            // var propFormCheck = propTextDiv.appendChild(document.createElement("form-check"));
            // propFormCheck.className = "form-check";


            var propCheckbox = propTextDiv.appendChild(document.createElement('input'));
            propCheckbox.id = propElementId + "checkbox";
            propCheckbox.className = "checkbox";
            propCheckbox.type = "checkbox";
            propCheckbox.value = "";
            propCheckbox.checked = "";
            propCheckbox.onchange = settingsUI.onPropertyCheckboxChange;

            propText = propTextDiv.appendChild(document.createElement("label"));
            propText.className = "form-check-label";
            propText.setAttribute("for", propElementId + "checkbox");
            propTextDiv.propText = propText;

            propCheckbox.propTextDiv = propTextDiv;
            propTextDiv.propCheckbox = propCheckbox;

            driverProperty.addValueListner(settingsUI.onPropertyCheckboxValueChange, propTextDiv);
            driverProperty.addNetworkStatusListner(settingsUI.onPropertyCheckboxNetworkChange, propTextDiv);


        }
        return propTextDiv;
    },
    //работает в паре с addPropertyCheckbox
    onPropertyCheckboxValueChange: function (sender, driverProperty) {
        sender.propText.innerHTML = "&nbsp;" + sender.propertyText;
        if (driverProperty.value === '1') {
            sender.propCheckbox.checked = true;
        }
        else {
            sender.propCheckbox.checked = false;
        }

        if (sender.dependetPanels != undefined) {
            for (var i = 0; i < sender.dependetPanels.length; i++) {
                if (driverProperty.value === '1') {
                    if (sender.dependetPanels[i] !== undefined) {
                        sender.dependetPanels[i].propText.disabled =
                            sender.dependetPanels[i].propEdit.disabled =
                            sender.dependetPanels[i].propSetButton.disabled = false;
                    }
                }
                else {
                    if (sender.dependetPanels[i] !== undefined) {
                        sender.dependetPanels[i].propText.disabled =
                            sender.dependetPanels[i].propEdit.disabled =
                            sender.dependetPanels[i].propSetButton.disabled = true;
                    }
                }
            }
        }
    },

    onPropertyCheckboxNetworkChange: function (sender, driverProperty) {

        if (driverProperty.networkStatus == NET_ONLINE) {
            sender.propCheckbox.disabled = false;
            sender.propText.disabled = false;
        } else if (driverProperty.networkStatus == NET_RECONNECT) {
            sender.propCheckbox.disabled = true;
            sender.propText.disabled = true;
        } else if (driverProperty.networkStatus == NET_OFFLINE) {
            sender.propCheckbox.disabled = true;
            sender.propText.disabled = true;
        } else //error
            if (driverProperty.networkStatus == NET_ERROR) {
                sender.propCheckbox.disabled = true;
                sender.propText.disabled = true;
            }


    },


    onPropertyCheckboxChange: function (event) {
        event.stopPropagation();
        var propCheckbox = event.currentTarget;
        var chekboxDialog = createModalDialog(getLang("applyChanges"), "");
        chekboxDialog.formGroup.innerHTML = getLang("areYouSure");
        chekboxDialog.propCheckbox = propCheckbox;
        chekboxDialog.onOK = settingsUI.applyCheckboxChangeClick;
        chekboxDialog.show();


        /*
        makeModalDialog("resetPanel", "checkboxchange", getLang("checkchangedialog"), getLang("areYouSure"));


        var closeHeaderButton = document.getElementById("checkboxchangecloseHeaderButton");
        var closeButton = document.getElementById("checkboxchangecloseButton");
        closeHeaderButton.propCheckbox = closeButton.propCheckbox = propCheckbox;
        closeHeaderButton.onclick = closeButton.onclick = settingsUI.checkboxRollBack;

        var modalFooter = document.getElementById("checkboxchangeModalFooter");
        var checkChengButton = modalFooter.appendChild(document.createElement("button"));
        checkChengButton.type = "button";
        checkChengButton.className = "btn btn-sm btn-danger";
        checkChengButton.id = "changecheckboxModalButton";
        checkChengButton.propCheckbox = propCheckbox;
        checkChengButton.onclick = settingsUI.applyCheckboxChangeClick;
        checkChengButton.innerText = getLang("applycheck");

        $("#checkboxchangeModal").modal('show');
        */

        return false;

    },

    applyCheckboxChangeClick: function (chekboxDialog) {
        var propCheckbox = chekboxDialog.propCheckbox;
        var propTextDiv = propCheckbox.propTextDiv;
        var driverProperty = propTextDiv.driverProperty;
        var propTextDiv = propCheckbox.propTextDiv;
        var driverProperty = propTextDiv.driverProperty;

        if (driverProperty.networkStatus != NET_RECONNECT) {
            if (propCheckbox.checked) {
                driverProperty.setValue("1", undefined, undefined);
            }
            else {
                driverProperty.setValue("0", undefined, undefined);
            }
        }
        chekboxDialog.hide();
        //$("#checkboxchangeModal").modal('hide');
        return false;
    },

    checkboxRollBack: function (event) {
        //non ecent.stopPropagation();
        var closeButton = event.currentTarget;
        var propCheckbox = closeButton.propCheckbox;
        propCheckbox.checked = !propCheckbox.checked;
        return false;
    },


    //добавляет разделитель (пустое пространства) между свойствами для панели свойств
    addSpaceView: function (panelDiv, number) {
        var propElementId = panelDiv.id + number;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            propTextDiv.className = "text-primary";
            propTextDiv.innerHTML = "<br>";

        }
    },

    getStatusWidget: function (id, text, thingStatusPanel) {
        var selectedStatus = document.getElementById(id);
        if (selectedStatus == null) {
            if (thingStatusPanel == undefined) return undefined;
            selectedStatus = thingStatusPanel.appendChild(document.createElement('span'));
            selectedStatus.style.cursor = "pointer";
            selectedStatus.className = "badge badge-secondary";
            selectedStatus.setAttribute("data-toggle", "popover");
            selectedStatus.setAttribute("data-container", "body");
            selectedStatus.setAttribute("data-placement", "bottom");
            selectedStatus.id = id;
            selectedStatus.innerText = text;

        }
        return selectedStatus;
    },

    onUpdateInfoValueChange: function (sender, driverProperty) { //means esp.updateinfo property

        var networkDriver = drivers.getDriverById("network", driverProperty.parenthost);
        //var espDriver = drivers.getDriverById("esp", driverProperty.parenthost);

        var updateInfo = networkDriver.updateinfo.value.split(";");
        if (updateInfo.length < 3) {
            sender.innerHTML = "<strong class='text-light'>" + getLang("updateinfo") + ":</strong> " + getLang("noupdateinfo") + "<br>";
        }
        else {
            var firmware = updateInfo[0].split(":")[1];
            var updateBuildVersion = parseInt(updateInfo[1].split(":")[1]);
            var innerHTML = "<div class='text-light'><strong class='text-light'>" + getLang("updateinfo") + ":</strong> " + firmware + " [<b class='text-warning'>" + getLang("firmwarebuildnumber") + ": </b>" + updateBuildVersion + "]</div><br>";
            var buildVersion = parseInt(networkDriver.firmwarebuildnumber.value);
            if (buildVersion < updateBuildVersion) {
                innerHTML += "<strong class='text-success'>" + getLang("updateexists") + "</strong> - ";
            }
            else {
                innerHTML += "<strong class='text-light'>" + getLang("updatenosense") + "</strong> - ";
            }

            updateuibutton = sender.updateuiButton; // document.getElementById("updateuibutton");
            updatefirmwarebutton = sender.updatefirmwareButton; // document.getElementById("updatefirmwarebutton");

            if (parseInt(networkDriver.updatepossible.value) < 1) {
                //hide buttons
                if (updateuibutton != undefined) {
                    updateuibutton.style.display = "none";
                    updatefirmwarebutton.style.display = "none";
                }
                innerHTML += "<strong class='text-warning'>" + getLang("updateunpossible") + "</strong>";
            }
            else {
                //Show update buttons
                if (parseInt(networkDriver.updatepossible.value) < 2) {
                    if (updateuibutton != undefined) {
                        updateuibutton.style.display = "block";
                        if (buildVersion < updateBuildVersion) {
                            updateuibutton.className = "btn btn-success btn-sm float-sm-right";
                            innerHTML += "<strong class='text-success'>" + getLang("updateuipossible") + "</strong>";
                        }
                        else {
                            updateuibutton.className = "btn btn-default btn-sm float-sm-right";
                            innerHTML += "<strong class='text-secondary'>" + getLang("downdateuipossible") + "</strong>";
                        }

                    }

                }
                else {
                    if (updateuibutton != undefined) {
                        updateuibutton.style.display = "block";
                        updatefirmwarebutton.style.display = "block";

                        if (buildVersion < updateBuildVersion) {
                            updateuibutton.className = "btn btn-success btn-sm float-sm-right";
                            updatefirmwarebutton.className = "btn btn-success btn-sm float-sm-right";
                            innerHTML += "<strong class='text-success'>" + getLang("updatepossible") + "</strong>";
                        }
                        else {
                            updateuibutton.className = "btn btn-default btn-sm float-sm-right";
                            updatefirmwarebutton.className = "btn btn-default btn-sm float-sm-right";
                            innerHTML += "<strong class='text-secondary'>" + getLang("downdateuipossible") + "</strong>";
                        }

                    }

                }
            }
            sender.innerHTML = innerHTML;
        }
    },
    onOnlineStatusChange: function (sender, drivers) {
        var onlineStatus = getLang("netonline");
        if (drivers.networkStatus == NET_ONLINE) {
            sender.className = "badge badge-success";

        }
        else
            if (drivers.networkStatus == NET_REFRESH) {
                sender.className = "badge badge-info";
                onlineStatus = getLang("netrefresh");
            }
            else { //Error or Offline is danger
                sender.className = "badge badge-danger";
                onlineStatus = getLang("netoffline");
            }

        sender.setAttribute("data-original-title", getLang("network"));
        sender.setAttribute("data-content", getLang("connectionstatus") + onlineStatus);
        $('[data-toggle="popover"]').popover();
    },
    onWiFiAPStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "text-success"

        }
        else {
            sender.className = "text-secondary";
        }
    },

    onWiFiSTStatusChange: function (sender, driverProperty) {
        var wifiSTconection = getLang("nostate");
        sender.className = "text-secondary";

        switch (parseInt(driverProperty.value)) {
            case 0:
                wifiSTconection = getLang("idlestatus");
                sender.className = "text-warning";
                break;
            case 1:
                wifiSTconection = getLang("nossidavailable");
                sender.className = "text-danger";
                break;
            case 2:
                wifiSTconection = getLang("scancompleted");
                sender.className = "text-warning";
                break;
            case 3:
                wifiSTconection = getLang("connected");
                sender.className = "text-success";
                break;
            case 4:
                wifiSTconection = getLang("connectfailed");
                sender.className = "text-danger";
                break;
            case 5:
                wifiSTconection = getLang("connectionlost");
                sender.className = "text-danger";
                break;
            case 6:
                wifiSTconection = getLang("disconnected");
                sender.className = "text-secondary";
                break;
            default:
                break;
        }

        sender.setAttribute("data-original-title", "WiFi Station");
        sender.setAttribute("data-content", getLang("connectionstatus") + wifiSTconection);
        $('[data-toggle="popover"]').popover();
    },

    onRESTfulStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "text-success";

        }
        else {
            sender.className = "text-secondary";
        }
    },

    onRESTfulOnlineStatusChange: function (sender, drivers) {
        var onlineStatus = getLang("netonline");
        if (drivers.networkStatus == NET_ONLINE) {
            sender.className = "text-success";
        }
        else
            if (drivers.networkStatus == NET_ERROR) {
                sender.className = "text-danger";
            }
            else
                if (drivers.networkStatus == NET_OFFLINE) {

                    sender.className = "text-secondary";
                }
    },

    onMQTTStatusChange: function (sender, driverProperty) {

        sender.className = "text-secondary";
        mqttState = getLang("nostate");

        switch (parseInt(driverProperty.value)) {
            case -5:
                sender.className = "text-warning";
                mqttState = getLang("debugmode");
                break;

            case -4:
                sender.className = "text-danger";
                mqttState = getLang("connectiontimeout");
                break;

            case -3:
                sender.className = "text-danger";
                mqttState = getLang("connectionlost");
                break;

            case -2:
                sender.className = "text-danger";
                mqttState = getLang("connectfailed");
                break;

            case -1:
                sender.className = "text-secondary";
                mqttState = getLang("disconnected");
                break;

            case 0:
                sender.className = "text-success";
                mqttState = getLang("connected");
                break;

            case 1:
                sender.className = "text-danger";
                mqttState = getLang("badprotocol");
                break;

            case 2:
                sender.className = "text-danger";
                mqttState = getLang("badclientid");
                break;

            case 3:
                sender.className = "text-secondary";
                mqttState = getLang("unavailable");
                break;

            case 4:
                sender.className = "text-danger";
                mqttState = getLang("badcredentials");
                break;

            case 5:
                sender.className = "text-danger";
                mqttState = getLang("unauthorized");
                break;

            default:
                break;

        }
        sender.setAttribute("data-original-title", "MQTT");
        sender.setAttribute("data-content", getLang("connectionstatus") + mqttState);
        $('[data-toggle="popover"]').popover();
    },

    onOTAStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "text-success";
        }
        else {
            sender.className = "text-secondary";
        }
    },

    addDriverClick: function (event) {
        event.stopPropagation();
        sidebarItemClick(event);
        var addDriverAhref = event.currentTarget;
        driversUI.addDriver(addDriverAhref.thing);
    },

    onDeleteThing: function (event) {
        event.stopPropagation();
    },

    onDeleteDriver: function (event) {
        event.stopPropagation();
        var deleteDriverButton = event.currentTarget;
        var thing = deleteDriverButton.thing;
        var driver = deleteDriverButton.driver;

        var deleteDriverDialog = createModalDialog(getLang("reset"), "");
        deleteDriverDialog.formGroup.innerHTML = getLang("areYouSure");
        deleteDriverDialog.thing = thing;
        deleteDriverDialog.driver = driver;
        deleteDriverDialog.onOK = settingsUI.onDeleteDriverOK;
        deleteDriverDialog.show();
        return false;
    },

    onDeleteDriverOK: function (deleteDriverDialog) {
        deleteDriverAsync(deleteDriverDialog.thing.host, deleteDriverDialog.driver._id, settingsUI.onDriverDeleteReciever, deleteDriverDialog);
    },


    onDriverDeleteReciever: function (HTTPResult, deleteDriverDialog) {
        if (HTTPResult == "1") {
            deleteDriverDialog.hide();
            deleteDriverDialog.driver.driverItem.style.display = "none";
            document.getElementById(deleteDriverDialog.driver._thingnickname + "_" + deleteDriverDialog.driver._id).innerHTML = "";
        }
        else {
            deleteDriverDialog.errorLabel.innerHTML = HTTPResult;
        }
    }

}
