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
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

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


var settingsUI = {

    //добавляет новый пунк в сайдбар (раздел Узлы(Ноды))
    addNodeSidebarItem: function (node, _parent, _id, _href, _text, _onclick, _icon, _span) {
        var newSidebarItem = sideBar.createItem(_parent, _id + node.nodenickname, "#" + node.nodenickname + _href, _text, _onclick, "fa fa-microchip", _span);
        newSidebarItem.href.node = node;
        return newSidebarItem;
    },

    onConfigLoad: function (configProperties) {

        if (configProperties.nodes.length == 0) return;

        for (var nodeKey in configProperties.nodes) {
            var node = configProperties.nodes[nodeKey];
            if (document.getElementById("nodeNavItem" + node.nodenickname) == undefined) {
                var nodeNavItem = this.addNodeSidebarItem(node, sideBar.nodeSubItem, "nodeNavItem", "submenu", node.nodenickname, sidebarItemClick, "fa fa-microchip", undefined);

                var nodeNavSubItem = sideBar.createDeepItem(nodeNavItem, node.nodenickname + "submenu");

                //node properties subItem 
                var nodePropItem = this.addNodeSidebarItem(node, nodeNavSubItem, "nodepropitem", "nodePropsPanel", getLang("nodeproperties"), sidebarItemClick, "fa fa-cog", undefined);
                node.nodePropItem = nodePropItem;
                //node drivers                                 
                var driversItem = this.addNodeSidebarItem(node, nodeNavSubItem, "driversitem", "driverssubmenu", getLang("drivers"), sidebarItemClick, undefined, "0");
                var driversSubItem = sideBar.createDeepItem(driversItem, node.nodenickname + "driverssubmenu");
                var addDriverItem = this.addNodeSidebarItem(node, driversSubItem, "adddriveritem", "adddriveritem", getLang("adddriver"), settingsUI.addDriverClick, "fa fa-plus", undefined);
                addDriverItem.href.style.color = theme.warning;

                //node scripts                
                var scriptsItem = this.addNodeSidebarItem(node, nodeNavSubItem, "scriptsitem", "scriptssubmenu", getLang("scripts"), settingsUI.scriptAnchorClick, undefined, undefined);
                var scriptsSubItem = sideBar.createDeepItem(scriptsItem, node.nodenickname + "scriptssubmenu");
                var addScriptItem = this.addNodeSidebarItem(node, scriptsSubItem, "addscriptitem", "addscriptitem", getLang("createscript"), scriptsUI.createScriptClick, "fa fa-plus", undefined);
                addScriptItem.href.style.color = theme.warning;

                //node files                 
                var filesItem = this.addNodeSidebarItem(node, nodeNavSubItem, "filesitem", "_filesfadepanel", getLang("files"), sidebarItemClick, undefined, undefined);

                //--- nodePropsPanel ---------------------------------------------------------------------------
                //панель для панелей с быстрым доступам к основным свойствам ноды

                var nodesPropsPanel = document.getElementById("nodesPropsPanel");

                //--- nodePropsPanel ---------------------------------------------------------------------------
                //панель для панелей с быстрым доступам к основным свойствам ноды
                var nodePropsPanel = nodesPropsPanel.appendChild(document.createElement('div'));
                nodePropsPanel.className = "tab-pane fade";
                nodePropsPanel.id = node.nodenickname + "nodePropsPanel";
                nodePropItem.href.nodefadepanel = nodePropsPanel;

                var nodePropHolderPanel = nodePropsPanel.appendChild(document.createElement('div'));
                nodePropHolderPanel.id = node.nodenickname + "bodePropHoder";
                nodePropHolderPanel.className = "row";

                //подготавливаем панели со свойствами ноды (для каждой ноды своя панель id = node.nodenickname + "nodePropPanel")
                //смотрите обработчик события onDriverLoaded() - он запоняет эту панель
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "NetworkNodeProp", getLang("networknodeprop"), 12);
                var networkNodePropBody = document.getElementById(node.nodenickname + "NetworkNodePropBody");
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody1", 4);
                $("#" + node.nodenickname + "NetworkNodePropBody1").toggleClass("node-prop-col");
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody2", 4);
                $("#" + node.nodenickname + "NetworkNodePropBody2").toggleClass("node-prop-col1");
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody3", 4);
                $("#" + node.nodenickname + "NetworkNodePropBody3").toggleClass("node-prop-col2");

                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "WifiNodeProp", getLang("wifinodeprop"), 4); //WifiNodePropPanel - свойства WiFi                
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "SystemNodeProp", getLang("systemnodeprop"), 4);
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "UpdateNodeProp", getLang("updatenodeprop"), 4);
                //--- EndOf nodePropsPanel ---------------------------------------------------------------------------

                // Add Node Status Panel -----------------------------------------------------------------------------
                var nodeStatusPanel = document.createElement("div");
                nodeStatusPanel.id = node.nodenickname + "nodestatuspanel";
                nodeNavItem.href.nodeStatusPanel = nodeStatusPanel;

                var deleteNodeButton = headerPanelUI.addButton(node.nodenickname + "DeleteNodeButton", "fa fa-minus", "delete node: " + node.nodenickname, headerPanelUI.nodePoropertiesPanelButtonRole);
                deleteNodeButton.node = node;
                deleteNodeButton.onclick = settingsUI.onDeleteNode;
                nodePropItem.href.deleteNodeButton = deleteNodeButton;
                nodeNavItem.href.deleteNodeButton = deleteNodeButton;

                nodeNavItem.href.onlinePanel = settingsUI.getStatusWidget(node.nodenickname + "onlineStatus", "Online", nodeStatusPanel);

                node.addNetworkStatusListner(settingsUI.onOnlineStatusChange, nodeNavItem.href.onlinePanel);
                nodeNavItem.href.WiFiAPPanel = settingsUI.getStatusWidget(node.nodenickname + "wifiapStatus", "WiFi AP", nodeStatusPanel);

                nodeNavItem.href.WiFiSTPanel = settingsUI.getStatusWidget(node.nodenickname + "wifistStatus", "WiFi ST", nodeStatusPanel);
                nodeNavItem.href.RESTfulPanel = settingsUI.getStatusWidget(node.nodenickname + "restfulStatus", "RESTful", nodeStatusPanel);
                nodeNavItem.href.MQTTPanel = settingsUI.getStatusWidget(node.nodenickname + "mqttStatus", "MQTT", nodeStatusPanel);
                nodeNavItem.href.OTAPanel = settingsUI.getStatusWidget(node.nodenickname + "otaStatus", "OTA", nodeStatusPanel);

                var filesDiv = nodesPropsPanel.appendChild(document.createElement('div'));
                filesDiv.className = "tab-pane fade";
                filesDiv.id = node.nodenickname + "_filesfadepanel";
                filesItem.href.filesList = new FilesList(filesDiv, node);
                //--- EndOf Node files panel --------------------------------------------
            }
        }
    },


    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //когда очередная нода загружает очередное драйвер - строим индикаторы в верхней панели "Настройки" - Online, WiFi AP, WiFi ST, RESTful, MQTT, OTA
    //и подготавлием панель управления нодой (с кнопками Update, Reset и основными свойствами ноды) - смотрите onConfigChange такая панель создается для каждой
    //ноды id = node.nodenickname + "nodePropPanel"    
    onDriverLoaded: function (sender, driver) {
        if ((driver == undefined) || (driver.type == undefined)) return;
        if (driver._new) { //если это драйвер загружено впервые (вновь созданные драйвера так же вызовут этот метод)

            var nodeSubmenuUl = document.getElementById(driver._nodenickname + "driverssubmenu"); //ищем пункт sideBar соответствующий ноде которой принадлежит драйвер
            if (nodeSubmenuUl == undefined) return; //если такого пункта нет - выходим

            var node = config.getNodeByHost(driver._host); //узнаем какой ноде принадлежит драйвер
            if (node == undefined) return; //выходим если нода не найдена

            //submenu drivers count 
            driversitemlocalspan
            var driverSpan = document.getElementById("driversitem" + driver._nodenickname + "span");
            if (driverSpan != null) {
                if (driverSpan.driversCount == undefined) {
                    driverSpan.driversCount = 0;
                }
                driverSpan.driversCount++;
                driverSpan.innerHTML = parseInt(driverSpan.driversCount);
            }

            var driverItem = settingsUI.addNodeSidebarItem(node, nodeSubmenuUl, "_" + driver._id, "_" + driver._id, driver._id, sidebarItemClick, "fa fa-sliders-h", undefined);
            driver.driverItem = driverItem;
            driverItem.href.node = node;
            var deleteDriverButton = headerPanelUI.addButton(node.nodenickname + "DeleteDriverButton", "fa fa-minus", "delete driver: " + driver._id, headerPanelUI.driverButtonRole);
            deleteDriverButton.node = node;
            deleteDriverButton.driver = driver;
            deleteDriverButton.onclick = settingsUI.onDeleteDriver;
            driverItem.href.deleteDriverButton = deleteDriverButton;

            var nodePropAnchors = document.getElementById("nodePropNavBar"); //старая навигационная панель для отображения панелей свойств
            var nodesPropsPanel = document.getElementById("nodesPropsPanel");
            var wifiPropPanel = document.getElementById(node.nodenickname + "WifiNodePropBody"); //панель для cвойств            
            var systemPropPanel = document.getElementById(node.nodenickname + "SystemNodePropBody");
            var updatePropPanel = document.getElementById(node.nodenickname + "UpdateNodePropBody");
            var networkPropPanel1 = document.getElementById(node.nodenickname + "NetworkNodePropBody1");
            var networkPropPanel2 = document.getElementById(node.nodenickname + "NetworkNodePropBody2");
            var networkPropPanel3 = document.getElementById(node.nodenickname + "NetworkNodePropBody3");

            //добавляем панель с таблицей со свойствами нового "driver" драйвера в панель nodesPropsPanel, якорим навигацию на nodePropAnchors, bootstrap cell size -> 12             
            driver.driverPropTable = new TableWidget(nodePropAnchors, nodesPropsPanel, driver, 12);

            //если очередное загруженое драйвер WiFi
            if (driver.type.value == WiFiDriverType) {
                //индикатор(widget) в верхней панеле для WiFi AP и Wifi ST - подключаем их к событиям WiFi текущей node.WifiDriver - теперь WifiDriver будет отправлять событие 
                //о своем состоянии непосредственно индикаторам 
                //сколько будет node столько будет индикаторов для их WiFi driver - мы отображаем только индикаторы выбранной в SideBar (текущей) node и ее драйвер
                //смотрите headerPanelUI.addStatus() метод - если индикатора нет его создадут и подпишут id как node.nodenickname + "wifiapStatus"

                //#ST_PANEL
                //WiFi Access Point header status indicator ----------------------------             
                var WiFiAPPanel = headerPanelUI.addStatus(node, node.nodenickname + "wifiapStatus", "WiFi AP");
                //подписываем свойство драйвера WiFi.wifiaccesspointavailable на обработчик settingsUI.onWiFiAPStatusChange
                //если WiFi.wifiaccesspointavailable изменит значение, будет вызван settingsUI.onWiFiAPStatusChange
                driver.wifiaccesspointavailable.addValueListner(settingsUI.onWiFiAPStatusChange, WiFiAPPanel);
                //EndOf WiFi Access Point header status indicator ----------------------
                //так же как и WiFi AP
                //var WiFiSTPanel = settingsUI.getStatusWidget(node.nodenickname + "wifistStatus", "WiFi ST", undefined); //
                var WiFiSTPanel = headerPanelUI.addStatus(node, node.nodenickname + "wifistStatus", "WiFi ST"); //
                driver.wifistatus.addValueListner(settingsUI.onWiFiSTStatusChange, WiFiSTPanel);
                //панель со свойствами node - добавляем отображени уровня WiFi сигнала (так же подписываем на событие изменения значения WiFi.wifirssi)
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

                    if (node.host == boardhost) { //the local node 


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

                        var RESTfulPanel = headerPanelUI.addStatus(node, node.nodenickname + "restfulStatus", "RESTful");
                        driver.httpserveravailable.addValueListner(settingsUI.onRESTfulStatusChange, RESTfulPanel);

                        var node = config.getNodeByHost(driver._host);
                        node.addNetworkStatusListner(settingsUI.onRESTfulOnlineStatusChange, RESTfulPanel);


                        if (driver.mqttclientstate !== undefined) {
                            var MQTTPanel = headerPanelUI.addStatus(node, node.nodenickname + "mqttStatus", "MQTT");
                            driver.mqttclientstate.addValueListner(settingsUI.onMQTTStatusChange, MQTTPanel);
                        }

                        if (driver.otaavailable !== undefined) {
                            var OTAPanel = headerPanelUI.addStatus(node, node.nodenickname + "otaStatus", "OTA");
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

                        if (driver.mqttavailable !== undefined)
                        {
                        var MQTTCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel2, driver.mqttavailable, getLang("mqttavailable"), "");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqtturl, getLang("mqtturl"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttport, getLang("mqttport"), ""));
                        settingsUI.addSpaceView(networkPropPanel2, "3");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttid, getLang("mqttid"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttlogin, getLang("mqttlogin"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttpassword, getLang("mqttpassword"), ""));
                        settingsUI.onPropertyCheckboxValueChange(MQTTCheckbox, MQTTCheckbox.driverProperty);
                        }

                        if (driver.otaavailable !== undefined)
                        {
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
                        var updateWatcherId = node.nodenickname + "updateWatcher";
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
                                updateuiButton.id = node.nodenickname + "updateuibutton";
                                updateuiButton.className = "btn btn-success btn-sm float-right";
                                updateuiButton.type = "button";
                                updateuiButton.setAttribute("data-toggle", "modal");
                                updateuiButton.setAttribute("data-target", "#resetModal");
                                updateuiButton.value = getLang("updateuibutton");
                                updateuiButton.node = node;
                                updateuiButton.onclick = settingsUI.modalUpdateUIClick;

                                var updatefirmwareButton = updateButtonHolder.appendChild(document.createElement('input'));
                                updatefirmwareButton.id = node.nodenickname + "updatefirmwarebutton";
                                updatefirmwareButton.className = "btn btn-success btn-sm float-right";
                                updatefirmwareButton.type = "button";
                                updatefirmwareButton.setAttribute("data-toggle", "modal");
                                updatefirmwareButton.setAttribute("data-target", "#resetModal");
                                updatefirmwareButton.value = getLang("updatefirmwarebutton");
                                updatefirmwareButton.node = node;
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
        }
    },

    addNodeClick: function (event) {
        event.stopPropagation();
        var newNodeDialog = createModalDialog(getLang("addnodeheader"), "");
        newNodeDialog.appendInput(createDialogInput("newnodename", getLang("addnodename"), ""));
        newNodeDialog.appendInput(createDialogInput("newnodehost", getLang("addnodehost"), "http://host:port/ or https://host:port/"));

        newNodeDialog.onOK = settingsUI.addNodeUIClick;
        newNodeDialog.show();
        return false;
    },

    addNodeUIClick: function (newNodeDialog) {

        var inputName = newNodeDialog.getChild("newnodename");
        var inputHost = newNodeDialog.getChild("newnodehost");

        if (inputHost.value.length == 0) {
            newNodeDialog.errorLabel.innerText = getLang("addnodeerror_hostempty");
            return false;
        }

        if (inputHost.value.indexOf("http") != 0) {
            inputHost.value = "http://" + inputHost.value;
        }

        var regexp = RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})");

        if (!inputHost.value.match(regexp)) {
            newNodeDialog.errorLabel.innerText = getLang("addnodeerror_hostnoturl");
            return false;
        }

        if (inputHost.value.slice(-1) !== '/') {
            inputHost.value += '/';
        }

        //boardhost = input.value;
        if (config.addNode(inputHost.value, inputName.value)) {
            addToLogNL("Connection to master node " + boardhost + "...");
            //use it as ping            
            return true;
        }
        return false;
    },

    onNetworkChange: function (sender, node) {
        if (node.networkStatus == NET_ONLINE) {
            sender.className = "text-success";
        }
        else
            if ((node.networkStatus == NET_RECONNECT) || (node.networkStatus == NET_REFRESH)) {
                sender.className = "text-info";
            }
            else
                if (node.networkStatus == NET_OFFLINE) {
                    sender.className = "text-secondary";
                }
                else  //error
                    if (node.networkStatus == NET_ERROR) {
                        sender.className = "text-danger";
                    }
    },

    modalResetClick: function (event) {
        event.stopPropagation();
        var driverHost = event.currentTarget.driverHost;
        var resetDialog = createModalDialog(getLang("reset"), "");
        resetDialog.formGroup.innerHTML = getLang("areYouSure");
        resetDialog.nodeHost = driverHost;
        resetDialog.onOK = settingsUI.onResetOK;
        resetDialog.show();
        return false;
    },

    onResetOK: function (resetDialog) {
        resetNodeOneWayTicket(resetDialog.nodeHost);

        sleep(5000).then(function () {
            location.reload();
            return false;
        });

    },


    modalUpdateUIClick: function (event) {

        var updateuiButton = event.currentTarget;
        var node = updateuiButton.node;

        makeModalDialog("resetPanel", "update", getLang("updatenode"), getLang("areYouSure"));
        var modalFooter = document.getElementById("updateModalFooter");

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "updateModalButton";
        updateButton.onclick = settingsUI.updateUIClick;
        updateButton.node = node;
        updateButton.innerText = getLang("updateuibutton");

        $("#updateModal").modal('show');

        return false;
    },

    updateUIClick: function (event) {

        var updateButton = event.currentTarget;
        var node = updateButton.node;
        var modalFooter = document.getElementById("updateModalFooter");
        modalFooter.removeChild(event.currentTarget);

        var modalBody = document.getElementById("updateModalBody");
        modalBody.innerHTML = "";
        var updateLog = modalBody.appendChild(document.createElement("pre"));
        updateLog.innerHTML = "Update UI started, please wait...<br>";
        updateUIAsync(node.host);


        settingsUI.updateUILogTimer(node, updateLog);
        return false;
    },

    updateUILogTimer: function (node, updateLog) {
        "use strict";
        sleep(1000).then(function () {
            getUpdateLogAsyncWithReciever(node.host, settingsUI.updateUILogReciever, node, updateLog, undefined);
            return false;
        });

    },
    updateUILogReciever: function (HTTPResult, node, sender, upperSender) {
        if (!HTTPResult.indexOf("%error") == 0) {
            sender.innerHTML = "Update log:<br>" + HTTPResult;

            if (HTTPResult.indexOf("complete") == -1) {
                settingsUI.updateUILogTimer(node, sender);
            }
            else {
                var modalFooter = document.getElementById("updateModalFooter");
                var resetButton = modalFooter.appendChild(document.createElement("button"));
                resetButton.type = "button";
                resetButton.className = "btn btn-sm btn-danger";
                resetButton.id = "resetModalButton";
                resetButton.nodeHost = nodeHost;
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
        var node = updateButton.node;

        makeModalDialog("resetPanel", "firmware", getLang("firmware"), getLang("areYouSure"));
        var modalFooter = document.getElementById("firmwareModalFooter");

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "firmwareModalButton";
        updateButton.onclick = settingsUI.updateFirmwareClick;
        updateButton.node = node;
        updateButton.innerText = getLang("firmwarebutton");

        $("#firmwareModal").modal('show');

        return false;
    },

    updateFirmwareClick: function (event) {
        var updateButton = event.currentTarget;
        var node = updateButton.node;

        var modalFooter = document.getElementById("firmwareModalFooter");
        modalFooter.removeChild(event.currentTarget);

        var modalBody = document.getElementById("firmwareModalBody");
        modalBody.innerHTML = "";
        var updateLog = modalBody.appendChild(document.createElement("div"));
        updateLog.innerHTML = getLang("updatefirmware");
        updateFirmwareAsync(node.host);
        getUpdateLogAsyncWithReciever(node.host, settingsUI.updateLogReciever, undefined, updateLog, undefined);

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
    //обычно используется для отображения свойств ноды Node/Properties в SideBar разделе Settings
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

    getStatusWidget: function (id, text, nodeStatusPanel) {
        var selectedStatus = document.getElementById(id);
        if (selectedStatus == null) {
            if (nodeStatusPanel == undefined) return undefined;
            selectedStatus = nodeStatusPanel.appendChild(document.createElement('span'));
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
        driversUI.addDriver(addDriverAhref.node);
    },

    onDeleteNode: function (event) {
        event.stopPropagation();
    },

    onDeleteDriver: function (event) {
        event.stopPropagation();
        var deleteDriverButton = event.currentTarget;
        var node = deleteDriverButton.node;
        var driver = deleteDriverButton.driver;

        var deleteDriverDialog = createModalDialog(getLang("reset"), "");
        deleteDriverDialog.formGroup.innerHTML = getLang("areYouSure");
        deleteDriverDialog.node = node;
        deleteDriverDialog.driver = driver;
        deleteDriverDialog.onOK = settingsUI.onDeleteDriverOK;
        deleteDriverDialog.show();
        return false;
    },

    onDeleteDriverOK: function (deleteDriverDialog) {
        deleteDriverAsync(deleteDriverDialog.node.host, deleteDriverDialog.driver._id, settingsUI.onDriverDeleteReciever, deleteDriverDialog);
    },


    onDriverDeleteReciever: function (HTTPResult, deleteDriverDialog) {
        if (HTTPResult == "1") {
            deleteDriverDialog.hide();
            deleteDriverDialog.driver.driverItem.style.display = "none";
            document.getElementById(deleteDriverDialog.driver._nodenickname + "_" + deleteDriverDialog.driver._id).innerHTML = "";
        }
        else {
            deleteDriverDialog.errorLabel.innerHTML = HTTPResult;
        }
    }

}
