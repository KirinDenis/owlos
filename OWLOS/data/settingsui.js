﻿

var settingsUI = {

    onConfigChange: function (sender, configPropertieserties) {

        if (configProperties.nodes.length == 0) return;

        var nodesSideBar = document.getElementById("nodesSideBar");
        nodesSideBar.style.background = theme.primary;
        var firstDevice = false;
        //add addNodeNavItem first --------------------------------------------------
        if (document.getElementById("addNodeNavItem") == undefined) {
            firstDevice = true;
            var nodeNavItem = nodesSideBar.appendChild(document.createElement("li"));
            nodeNavItem.className = "nav-item";
            nodeNavItem.id = "addNodeNavItem";
            var nodeHRef = nodeNavItem.appendChild(document.createElement("a"));
            nodeHRef.className = "nav-link";
            nodeHRef.parentLi = nodeLi;
            nodeHRef.style.color = theme.success;
            nodeHRef.setAttribute("data-toggle", "tab");
            nodeHRef.onclick = settingsUI.addNodeClick;
            nodeHRef.innerHTML = "<b>" + getLang("addnode") + "</b>";
            nodeHRef.href = "#home";

            //панель не видна, она существует для организии SideBar, сами панели со свойствами устройств сделаны на основе navBar - так сложилось исторически, SideBar только переключает их
            var nodePropAnchors = document.getElementById("nodePropAnchors");
            //NavTabs панель для панелей со свойствами нод
            var nodePropNavBar = nodePropAnchors.appendChild(document.createElement("ul"));
            nodePropNavBar.style.height = "0px";
            nodePropNavBar.id = "nodePropNavBar";
            nodePropNavBar.className = "nav nav-tabs";
        }

        for (var nodeKey in configProperties.nodes) {
            var node = configProperties.nodes[nodeKey];
            if (document.getElementById("nodeNavItem" + node.alies) == undefined) {
                var nodeLi = nodesSideBar.appendChild(document.createElement("li"));
                nodeLi.id = "nodeNavItem" + node.alies;
                nodeLi.node = node;

                if (firstDevice) {
                    nodeLi.className = "active";
                    nodesSideBar.activeLi = nodeLi;
                }
                var nodeAhref = nodeLi.appendChild(document.createElement("a"));
                nodeAhref.id = node.alies + "ahref";
                nodeAhref.href = "#" + node.alies + "submenu";

                if (firstDevice) {
                    nodeAhref.setAttribute("data-toggle", "collapse");
                    nodeAhref.setAttribute("aria-expanded", "true");

                }
                else {
                    nodeAhref.setAttribute("data-toggle", "collapse");
                    nodeAhref.setAttribute("aria-expanded", "false");
                }
                nodeAhref.innerHTML = "<b>" + node.alies + "</b>";
                //nodeAhref.onclick = settingsUI.deviceAnchorClick;
                nodeAhref.parentLi = nodeLi;
                nodeAhref.node = node;
                node.addNetworkStatusListner(settingsUI.onNetworkChange, nodeAhref);
                var nodeSubmenuUl = nodeLi.appendChild(document.createElement("ul"));

                nodeLi.nodeSubmenuUl = nodeSubmenuUl;
                nodeSubmenuUl.className = "collapse list-unstyled";
                nodeSubmenuUl.id = node.alies + "submenu";

                //Add device submenuitem ----------------

                var deviceNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                deviceNavItem.className = "nav-item";
                var deviceHRef = deviceNavItem.appendChild(document.createElement("a"));
                deviceHRef.className = "nav-link";
                deviceHRef.parentLi = nodeLi;
                deviceHRef.style.color = theme.success;
                deviceHRef.setAttribute("data-toggle", "tab");
                deviceHRef.onclick = devicesUI.addDeviceClick;
                deviceHRef.innerText = getLang("adddevice");
                deviceHRef.href = "#home";
                deviceHRef.node = node;

                //Node Tab panel ----------------------
                var nodePanelNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                nodePanelNavItem.className = "nav-item";
                var nodePanelHRef = nodePanelNavItem.appendChild(document.createElement("a"));
                nodePanelHRef.className = "nav-link";
                nodePanelHRef.parentLi = nodeLi;
                nodePanelHRef.style.color = theme.warning;
                nodePanelHRef.setAttribute("data-toggle", "tab");
                nodePanelHRef.onclick = settingsUI.deviceAnchorClick;
                nodePanelHRef.innerText = getLang("properties");
                nodePanelHRef.href = "#" + node.alies + "nodePropsPanel";
                nodePanelHRef.node = node;
                var nodesPropsPanel = document.getElementById("nodesPropsPanel");

                //--- nodePropsPanel ---------------------------------------------------------------------------
                //панель для панелей с быстрым доступам к основным свойствам ноды
                var nodePropsPanel = nodesPropsPanel.appendChild(document.createElement('div'));
                nodePropsPanel.className = "devicediv tab-pane fade";
                if (firstDevice) {
                    nodePropsPanel.className += " active show"; //панель свойств первой ноды активна изначально
                }
                nodePropsPanel.id = node.alies + "nodePropsPanel";
                nodeAhref.nodefadepanel = nodePropsPanel;

                var nodePropHolderPanel = nodePropsPanel.appendChild(document.createElement('div'));
                nodePropHolderPanel.id = node.alies + "bodePropHoder";
                nodePropHolderPanel.className = "row";

                //подготавливаем панели со свойствами ноды (для каждой ноды своя панель id = node.alies + "nodePropPanel")
                //смотрите обработчик события onDeviceLoaded() - он запоняет эту панель
                sender.addCard(nodePropHolderPanel, node.alies + "WifiNodeProp", getLang("wifinodeprop"), 4); //WifiNodePropPanel - свойства WiFi
                sender.addCard(nodePropHolderPanel, node.alies + "NetworkNodeProp", getLang("networknodeprop"), 4);
                sender.addCard(nodePropHolderPanel, node.alies + "SystemNodeProp", getLang("systemnodeprop"), 4);
                sender.addCard(nodePropHolderPanel, node.alies + "UpdateNodeProp", getLang("updatenodeprop"), 4);

                //--- EndOf nodePropsPanel ---------------------------------------------------------------------------

                //Add files submenuitem ------------------
                var filesNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                filesNavItem.className = "nav-item";
                var filesHRef = filesNavItem.appendChild(document.createElement("a"));
                filesHRef.className = "nav-link";
                filesHRef.parentLi = nodeLi;
                filesHRef.style.color = theme.warning;
                filesHRef.setAttribute("data-toggle", "tab");
                filesHRef.onclick = settingsUI.deviceAnchorClick;
                filesHRef.innerText = getLang("files");
                filesHRef.href = "#" + node.alies + "filesfadepanel";
                filesHRef.node = node;

                //new files tab ----------------
                var nodesPropsPanel = document.getElementById("nodesPropsPanel");
                var filesDiv = nodesPropsPanel.appendChild(document.createElement('div'));
                filesDiv.className = "devicediv tab-pane fade";
                filesDiv.id = node.alies + "filesfadepanel";
                filesHRef.filesList = new FilesList(filesDiv, node);

                // add Node Status Panel ---------------------------------------------
                var nodeStatusPanel = document.createElement("div");
                nodeStatusPanel.id = node.alies + "nodestatuspanel";
                nodeAhref.nodeStatusPanel = nodeStatusPanel;

                nodeAhref.onlinePanel = settingsUI.getStatusWidget(node.alies + "onlineStatus", "Online", nodeStatusPanel);

                node.addNetworkStatusListner(settingsUI.onOnlineStatusChange, nodeAhref.onlinePanel);
                nodeAhref.WiFiAPPanel = settingsUI.getStatusWidget(node.alies + "wifiapStatus", "WiFi AP", nodeStatusPanel);

                nodeAhref.WiFiSTPanel = settingsUI.getStatusWidget(node.alies + "wifistStatus", "WiFi ST", nodeStatusPanel);
                nodeAhref.RESTfulPanel = settingsUI.getStatusWidget(node.alies + "restfulStatus", "RESTful", nodeStatusPanel);
                nodeAhref.MQTTPanel = settingsUI.getStatusWidget(node.alies + "mqttStatus", "MQTT", nodeStatusPanel);
                nodeAhref.OTAPanel = settingsUI.getStatusWidget(node.alies + "otaStatus", "OTA", nodeStatusPanel);

                document.getElementById("nodeStatusPanel").appendChild(nodeStatusPanel);

                var nodeStatusPanelText = document.createElement("div");
                nodeStatusPanelText.innerHTML = " <strong>" + node.alies + "</strong> at <a href='" + node.host + "' target='_blank'>" + node.host + "</a>";
                document.getElementById("nodeStatusPanelText").appendChild(nodeStatusPanelText);

                nodeStatusPanel.nodeStatusPanelText = nodeStatusPanelText;
                if (firstDevice) {
                    document.getElementById("nodeStatusPanel").currentStatusPanel = nodeStatusPanel;
                    nodeStatusPanel.style.display = "block";
                    nodeStatusPanelText.style.display = "block";
                }
                else {
                    nodeStatusPanel.style.display = "none";
                    nodeStatusPanelText.style.display = "none";
                }
                firstDevice = false;
            }
        }
    },

    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //когда очередная нода загружает очередное устройство - строим индикаторы в верхней панели "Настройки" - Online, WiFi AP, WiFi ST, RESTful, MQTT, OTA
    //и подготавлием панель управления нодой (с кнопками Update, Reset и основными свойствами ноды) - смотрите onConfigChange такая панель создается для каждой
    //ноды id = node.alies + "nodePropPanel"    
    onDeviceLoaded: function (sender, device) {
        if (device._new) { //если это устройство загружено впервые (вновь созданные устройства так же вызовут этот метод)

            var nodeSubmenuUl = document.getElementById(device._alies + "submenu"); //ищем пункт sideBar соответствующий ноде которой принадлежит устройство
            if (nodeSubmenuUl == undefined) return; //если такого пункта нет - выходим

            var node = config.getNodeByHost(device._host); //узнаем какой ноде принадлежит устройство
            if (node == undefined) return; //выходим если нода не найдена

            var deviceLi = nodeSubmenuUl.appendChild(document.createElement("li")); //добавляем дочерний пукт в меню ноды в sideBar
            deviceLi.className = "nav-item";

            var deviceAhref = deviceLi.appendChild(document.createElement("a")); //отображаемая часть меню - гиперссылка
            deviceAhref.className = "nav-link";
            deviceAhref.setAttribute("data-toggle", "tab");
            deviceAhref.href = "#" + device._alies + "_" + device._id; //якорь на панель с таблицей со свойствами выбранного устройства (создается один раз)
            deviceAhref.node = config.getNodeByHost(device._host); //привязываем пункт меню к ноде которой принадлежит устройства (используется для быстрого поска ноды в будущем)
            deviceAhref.innerText = device._id; //пункт меню отображает ID нового устройства
            deviceAhref.onclick = settingsUI.deviceAnchorClick; //обработчик клика на пунк меню (переключение панелей)
            deviceAhref.parentLi = deviceLi; //сохраняем родительский deviceId

            

            var nodePropAnchors = document.getElementById("nodePropNavBar"); //старая навигационная панель для отображения панелей свойств
            var wifiPropPanel = document.getElementById(node.alies + "WifiNodePropBody"); //панель для cвойств
            var networkPropPanel = document.getElementById(node.alies + "NetworkNodePropBody"); 
            var systemPropPanel = document.getElementById(node.alies + "SystemNodePropBody"); 
            var updatePropPanel = document.getElementById(node.alies + "UpdateNodePropBody"); 
            //добавляем панель с таблицей со свойствами нового "device" устройства в панель nodesPropsPanel, якорим навигацию на nodePropAnchors, bootstrap cell size -> 12             
            new TableWidget(nodePropAnchors, nodesPropsPanel, device, 12);

            //если очередное загруженое устройство WiFi
            if (device.type.value == WiFiDeviceType) {
                //индикатор(widget) в верхней панеле для WiFi AP и Wifi ST - подключаем их к событиям WiFi текущей node.WifiDevice - теперь WifiDevice будет отправлять событие 
                //о своем состоянии непосредственно индикаторам 
                //сколько будет node столько будет индикаторов для их WiFi device - мы отображаем только индикаторы выбранной в SideBar (текущей) node и ее устройств
                //смотрите getStatusWidget() метод - если индикатора нет его создадут и подпишут id как node.alies + "wifiapStatus"
                var WiFiAPPanel = settingsUI.getStatusWidget(node.alies + "wifiapStatus", "WiFi AP", undefined);
                //подписываем свойство устройства WiFi.wifiaccesspointavailable на обработчик settingsUI.onWiFiAPStatusChange
                //если WiFi.wifiaccesspointavailable изменит значение, будет вызван settingsUI.onWiFiAPStatusChange
                device.wifiaccesspointavailable.addValueListner(settingsUI.onWiFiAPStatusChange, WiFiAPPanel);

                //так же как и WiFi AP
                var WiFiSTPanel = settingsUI.getStatusWidget(node.alies + "wifistStatus", "WiFi ST", undefined);
                device.wifistatus.addValueListner(settingsUI.onWiFiSTStatusChange, WiFiSTPanel);

                //панель со свойствами node - добавляем отображени уровня WiFi сигнала (так же подписываем на событие изменения значения WiFi.wifirssi)
                settingsUI.addPropertyView(wifiPropPanel, device.wifirssi, getLang("wifirssi"), "dBm");
                settingsUI.addSpaceView(wifiPropPanel, "1");
            }
            else
                if (device.type.value == ESPDeviceType) {

                    settingsUI.addPropertyView(systemPropPanel, device.espfreesketchspace, getLang("espfreesketchspace"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, device.espfreeheap, getLang("espfreeheap"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, device.espcpufreqmhz, getLang("espcpufreqmhz"), "mHz");                    
                    settingsUI.addPropertyView(systemPropPanel, device.espresetreason, getLang("espresetreason"));
                    
                    var resetButton = systemPropPanel.appendChild(document.createElement('input'));
                    resetButton.className = "btn btn-danger btn-sm";
                    resetButton.type = "button";
                    resetButton.setAttribute("data-toggle", "modal");
                    resetButton.setAttribute("data-target", "#resetModal");
                    resetButton.value = getLang("reset");
                    resetButton.deviceHost = device._host;
                    resetButton.onclick = settingsUI.modalResetClick;

                    settingsUI.addPropertyView(updatePropPanel, device.firmwareversion, getLang("firmwareversion"));
                    settingsUI.addPropertyView(updatePropPanel, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));
                    
                }
                else
                    if (device.type.value == NetworkDeviceType) {
                        // document.title = device.unitid.value + " :: OWL OS"; //ToDo detect "local" node

                        var RESTfulPanel = settingsUI.getStatusWidget(node.alies + "restfulStatus", "RESTful");
                        device.restfulavailable.addValueListner(settingsUI.onRESTfulStatusChange, RESTfulPanel);
                        var node = config.getNodeByHost(device._host);
                        node.addNetworkStatusListner(settingsUI.onRESTfulOnlineStatusChange, RESTfulPanel);

                        var MQTTPanel = settingsUI.getStatusWidget(node.alies + "mqttStatus", "MQTT");
                        device.mqttclientstate.addValueListner(settingsUI.onMQTTStatusChange, MQTTPanel);

                        var OTAPanel = settingsUI.getStatusWidget(node.alies + "otaStatus", "OTA");
                        device.otaavailable.addValueListner(settingsUI.onOTAStatusChange, OTAPanel);

                        settingsUI.addPropertyView(updatePropPanel, device.firmwareversion, getLang("firmwareversion"));
                        settingsUI.addPropertyView(updatePropPanel, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));

                        //Update watcher panel 
                        //Панель обновлений
                        var updateWatcherId = node.alies + "updateWatcher";
                        var updateWatcherDiv = document.getElementById(updateWatcherId);
                        if (updateWatcherDiv == null) {
                            updateWatcherDiv = updatePropPanel.appendChild(document.createElement('div'));                            
                            updateWatcherDiv.id = updateWatcherId;
                            updateWatcherDiv.className = "text-primary";
                            //one listner to two properties
                            
                            var updateButtonHolder = updatePropPanel.appendChild(document.createElement('div'));
                            updateButtonHolder.className = "row";
                            var updateuiButton = updateButtonHolder.appendChild(document.createElement('input'));
                            updateuiButton.id = node.alies +"updateuibutton";
                            updateuiButton.className = "btn btn-success btn-sm float-right";
                            updateuiButton.type = "button";
                            updateuiButton.setAttribute("data-toggle", "modal");
                            updateuiButton.setAttribute("data-target", "#resetModal");
                            updateuiButton.value = getLang("updateuibutton");
                            updateuiButton.node = node;
                            updateuiButton.onclick = settingsUI.modalUpdateUIClick;

                            var updatefirmwareButton = updateButtonHolder.appendChild(document.createElement('input'));
                            updatefirmwareButton.id = node.alies +"updatefirmwarebutton";
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

                            device.updateinfo.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                            device.updatepossible.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                        }
                        //}
                    }
        }
    },

    deviceAnchorClick: function (event) {

        var aHref = event.currentTarget;

        var nodesSideBar = document.getElementById("nodesSideBar");
        $(this).removeClass('active');
        nodesSideBar.activeLi.className = "";
        if (nodesSideBar.acriveHref != undefined) {
            if (nodesSideBar.acriveHref.nodefadepanel != undefined) {
                nodesSideBar.acriveHref.nodefadepanel.className = "devicediv tab-pane fade";
            }
        }
        nodesSideBar.acriveHref = aHref;
        if (aHref.nodefadepanel != undefined) {
            aHref.nodefadepanel.className = "devicediv tab-pane fade active show";
        }

        aHref.parentLi.className = "active";
        nodesSideBar.activeLi = aHref.parentLi;
        document.location = aHref.href;

        var node = aHref.node;
        if (node != undefined) {

            if (aHref.nodeStatusPanel == undefined) {
                aHref = document.getElementById(node.alies + "ahref");
            }
            if (aHref.nodeStatusPanel != undefined) {
                var nodeStatusPanel = document.getElementById("nodeStatusPanel");
                if (nodeStatusPanel.currentStatusPanel != undefined) {
                    nodeStatusPanel.currentStatusPanel.style.display = "none";
                    nodeStatusPanel.currentStatusPanel.nodeStatusPanelText.style.display = "none";
                }
                nodeStatusPanel.currentStatusPanel = aHref.nodeStatusPanel;
                nodeStatusPanel.currentStatusPanel.style.display = "block";
                nodeStatusPanel.currentStatusPanel.nodeStatusPanelText.style.display = "block";
            }

        }

        //     if (aHref.getAttribute("aria-expanded") == "true") {
        //         document.documentElement.scrollTop = document.documentElement.scrollTop - event.clientY - event.target.offsetHeight;
        //     }

        return false;
    },


    addNodeClick: function (event) {

        event.stopPropagation();

        makeModalDialog("resetPanel", "addnode", getLang("addnode"), "");
        var modalFooter = document.getElementById("addnodeModalFooter");
        var modalBody = document.getElementById("addnodeModalBody");

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "hostEdit");
        label.innerText = getLang("host");
        var hostEdit = formGroup.appendChild(document.createElement('input'));
        hostEdit.className = "form-control form-control-sm";
        hostEdit.id = "hostInput";

        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "aliesEdit");
        label.innerText = getLang("alies");
        var aliesEdit = formGroup.appendChild(document.createElement('input'));
        aliesEdit.className = "form-control form-control-sm";
        aliesEdit.id = "aliesInput";

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "addnodeModalButton";
        updateButton.onclick = settingsUI.addNodeUIClick;
        updateButton.innerText = getLang("addnodebutton");

        $("#addnodeModal").modal('show');

        return false;
    },

    addNodeUIClick: function (event) {
        event.stopPropagation();

        if (config.addNode(document.getElementById("hostInput").value, document.getElementById("aliesInput").value)) {
            if (config.save()) {
                $("#addnodeModal").modal('hide');
            }
        }
        //else todo ERROR
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

        var deviceHost = event.currentTarget.deviceHost;

        makeModalDialog("resetPanel", "reset", getLang("resetunit"), getLang("areYouSure"));
        var modalFooter = document.getElementById("resetModalFooter");

        var resetButton = modalFooter.appendChild(document.createElement("button"));
        resetButton.type = "button";
        resetButton.className = "btn btn-sm btn-danger";
        resetButton.id = "resetModalButton";
        resetButton.deviceHost = deviceHost;
        resetButton.onclick = resetClick;
        resetButton.innerText = getLang("reset");

        $("#resetModal").modal('show');

        return false;
    },

    modalUpdateUIClick: function (event) {

        var updateuiButton = event.currentTarget;
        var node = updateuiButton.node;

        makeModalDialog("resetPanel", "update", getLang("updateunit"), getLang("areYouSure"));
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
                resetButton.deviceHost = node.host;
                resetButton.onclick = resetClick;
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

        /*
        sleep(30000).then(() => {
            location.reload();
            return false;
        });
        */
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
        card.className = "card text-white bg-primary mb-3";
        var header = card.appendChild(document.createElement('div'));
        header.className = "card-header";
        var headerText = header.appendChild(document.createElement('div'));
        headerText.innerHTML = text;
        var body = card.appendChild(document.createElement('div'));
        body.id = id + "Body"
        body.className = "card-body";
    },

    addPropertyView: function (panelDiv, deviceProperty, text, sufix) {
        if (deviceProperty == undefined) return;
        var propElementId = panelDiv.id + deviceProperty.parentid + deviceProperty.name;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            propTextDiv.className = "text-light";
            propTextDiv.propertyText = text;
            if (sufix == undefined) sufix = "";
            propTextDiv.propertySufix = sufix;
            deviceProperty.addValueListner(settingsUI.onPropertyViewedValueChange, propTextDiv);
        }
    },

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

    onPropertyViewedValueChange: function (sender, deviceProperty) {
        sender.innerHTML = "<strong>" + sender.propertyText + ":</strong> " + deviceProperty.value + " " + sender.propertySufix + "<br>";
    },

    onUpdateInfoValueChange: function (sender, deviceProperty) { //means esp.updateinfo property

        var networkDevice = devices.getDeviceById("network", deviceProperty.parenthost);
        //var espDevice = devices.getDeviceById("esp", deviceProperty.parenthost);

        var updateInfo = networkDevice.updateinfo.value.split(";");
        if (updateInfo.length < 3) {
            sender.innerHTML = "<strong class='text-light'>" + getLang("updateinfo") + ":</strong> " + getLang("noupdateinfo") + "<br>";
        }
        else {
            var firmware = updateInfo[0].split(":")[1];
            var updateBuildVersion = parseInt(updateInfo[1].split(":")[1]);
            var innerHTML = "<div class='text-light'><strong class='text-light'>" + getLang("updateinfo") + ":</strong> " + firmware + " [<b class='text-warning'>" + getLang("firmwarebuildnumber") + ": </b>" + updateBuildVersion + "]</div><br>";
            var buildVersion = parseInt(networkDevice.firmwarebuildnumber.value);
            if (buildVersion < updateBuildVersion) {
                innerHTML += "<strong class='text-success'>" + getLang("updateexists") + "</strong> - ";
            }
            else {
                innerHTML += "<strong class='text-light'>" + getLang("updatenosense") + "</strong> - ";
            }

            updateuibutton = sender.updateuiButton; // document.getElementById("updateuibutton");
            updatefirmwarebutton = sender.updatefirmwareButton; // document.getElementById("updatefirmwarebutton");

            if (parseInt(networkDevice.updatepossible.value) < 1) {
                //hide buttons
                if (updateuibutton != undefined) {
                    updateuibutton.style.display = "none";
                    updatefirmwarebutton.style.display = "none";
                }
                innerHTML += "<strong class='text-warning'>" + getLang("updateunpossible") + "</strong>";
            }
            else {
                //Show update buttons
                if (parseInt(networkDevice.updatepossible.value) < 2) {
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

    onOnlineStatusChange: function (sender, devices) {
        var onlineStatus = getLang("netonline");
        if (devices.networkStatus == NET_ONLINE) {
            sender.className = "badge badge-success";

        }
        else
            if (devices.networkStatus == NET_REFRESH) {
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


    onWiFiAPStatusChange: function (sender, deviceProperty) {
        if (deviceProperty.value == 1) {
            sender.className = "badge badge-success";

        }
        else {
            sender.className = "badge badge-secondary";
        }
    },

    onWiFiSTStatusChange: function (sender, deviceProperty) {
        var wifiSTconection = getLang("nostate");
        sender.className = "badge badge-secondary";

        switch (parseInt(deviceProperty.value)) {
            case 0:
                wifiSTconection = getLang("idlestatus");
                sender.className = "badge badge-warning";
                break;
            case 1:
                wifiSTconection = getLang("nossidavailable");
                sender.className = "badge badge-danger";
                break;
            case 2:
                wifiSTconection = getLang("scancompleted");
                sender.className = "badge badge-warning";
                break;
            case 3:
                wifiSTconection = getLang("connected");
                sender.className = "badge badge-success";
                break;
            case 4:
                wifiSTconection = getLang("connectfailed");
                sender.className = "badge badge-danger";
                break;
            case 5:
                wifiSTconection = getLang("connectionlost");
                sender.className = "badge badge-danger";
                break;
            case 6:
                wifiSTconection = getLang("disconnected");
                sender.className = "badge badge-secondary";
                break;
            default:
                break;
        }

        sender.setAttribute("data-original-title", "WiFi Station");
        sender.setAttribute("data-content", getLang("connectionstatus") + wifiSTconection);
        $('[data-toggle="popover"]').popover();
    },

    onRESTfulStatusChange: function (sender, deviceProperty) {
        if (deviceProperty.value == 1) {
            sender.className = "badge badge-success";

        }
        else {
            sender.className = "badge badge-secondary";
        }
    },

    onRESTfulOnlineStatusChange: function (sender, devices) {
        var onlineStatus = getLang("netonline");
        if (devices.networkStatus == NET_ONLINE) {
            sender.className = "badge badge-success";
        }
        else
            if (devices.networkStatus == NET_ERROR) {
                sender.className = "badge badge-danger";
            }
            else
                if (devices.networkStatus == NET_OFFLINE) {

                    sender.className = "badge badge-secondary";
                }
    },

    onMQTTStatusChange: function (sender, deviceProperty) {

        sender.className = "badge badge-secondary";
        mqttState = getLang("nostate");

        switch (parseInt(deviceProperty.value)) {
            case -5:
                sender.className = "badge badge-warning";
                mqttState = getLang("debugmode");
                break;

            case -4:
                sender.className = "badge badge-danger";
                mqttState = getLang("connectiontimeout");
                break;

            case -3:
                sender.className = "badge badge-danger";
                mqttState = getLang("connectionlost");
                break;

            case -2:
                sender.className = "badge badge-danger";
                mqttState = getLang("connectfailed");
                break;

            case -1:
                sender.className = "badge badge-secondary";
                mqttState = getLang("disconnected");
                break;

            case 0:
                sender.className = "badge badge-success";
                mqttState = getLang("connected");
                break;

            case 1:
                sender.className = "badge badge-danger";
                mqttState = getLang("badprotocol");
                break;

            case 2:
                sender.className = "badge badge-danger";
                mqttState = getLang("badclientid");
                break;

            case 3:
                sender.className = "badge badge-secondary";
                mqttState = getLang("unavailable");
                break;

            case 4:
                sender.className = "badge badge-danger";
                mqttState = getLang("badcredentials");
                break;

            case 5:
                sender.className = "badge badge-danger";
                mqttState = getLang("unauthorized");
                break;

            default:
                break;

        }
        sender.setAttribute("data-original-title", "MQTT");
        sender.setAttribute("data-content", getLang("connectionstatus") + mqttState);
        $('[data-toggle="popover"]').popover();
    },

    onOTAStatusChange: function (sender, deviceProperty) {
        if (deviceProperty.value == 1) {
            sender.className = "badge badge-success";
        }
        else {
            sender.className = "badge badge-secondary";
        }
    }

}
