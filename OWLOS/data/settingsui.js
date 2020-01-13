

var settingsUI = {

    onConfigChange: function (sender, configPropertieserties) {

        if (configProperties.nodes.length == 0) return;

        var nodesSideBar = document.getElementById("nodesSideBar");
        nodesSideBar.style.background = theme.primary;
        var firstDevice = false;
        //add addNodeNavItem first --------------------------------------------------
        if (document.getElementById("devicesPanelFade") == undefined) {
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

            var devicesAnchors = document.getElementById("devicesAnchors");

            var devicesNavBar = devicesAnchors.appendChild(document.createElement("ul"));
            devicesNavBar.style.height = "0px";
            devicesNavBar.id = "devicesNavBar";
            devicesNavBar.className = "nav nav-tabs";

            var devicesPanel = document.getElementById("devicesPanel");
            devicesPanel = devicesPanel.appendChild(document.createElement("div"));
            devicesPanel.id = "devicesPanelFade";
            devicesPanel.className = "tab-content col-md-12";
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
                nodePanelHRef.href = "#" + node.alies + "fadepanel";
                nodePanelHRef.node = node;
                var devicesPanel = document.getElementById("devicesPanelFade");
                var div = devicesPanel.appendChild(document.createElement('div'));

                // div.className = "col-md-" + this.size + " devicediv tab-pane fade";
                div.className = "devicediv tab-pane fade";
                if (firstDevice) {
                    div.className += " active show";

                }
                div.id = node.alies + "fadepanel";

                nodeAhref.nodefadepanel = div;
                var dataDiv = div.appendChild(document.createElement('div'));
                dataDiv.id = node.alies + "updatePropPanelDataDiv"
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
                var devicesPanel = document.getElementById("devicesPanelFade");
                var filesDiv = devicesPanel.appendChild(document.createElement('div'));
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

    onDeviceLoaded: function (sender, device) {
        if (device._new) {

            var nodeSubmenuUl = document.getElementById(device._alies + "submenu");
            if (nodeSubmenuUl == undefined) return;
            var deviceLi = nodeSubmenuUl.appendChild(document.createElement("li"));
            deviceLi.className = "nav-item";
            var deviceAhref = deviceLi.appendChild(document.createElement("a"));
            deviceAhref.className = "nav-link";
            deviceAhref.setAttribute("data-toggle", "tab");

            deviceAhref.href = "#" + device._alies + "_" + device._id;
            deviceAhref.node = config.getNodeByHost(device._host);
            deviceAhref.innerText = device._id;
            deviceAhref.onclick = settingsUI.deviceAnchorClick;
            deviceAhref.parentLi = deviceLi;

            var devicesWidgetsPanel = document.getElementById("widgetsPanelDataDiv");
            var devicesAnchors = document.getElementById("devicesNavBar");
            var devicesPanel = document.getElementById("devicesPanelFade");
            new TableWidget(devicesAnchors, devicesPanel, device, 12);
            //network widgets ----------------------------------------------
            if (device._id == "wifi") {
                var WiFiAPPanel = settingsUI.getStatusWidget(device._alies + "wifiapStatus", "WiFi AP", undefined);
                device.wifiaccesspointavailable.addValueListner(settingsUI.onWiFiAPStatusChange, WiFiAPPanel);

                var WiFiSTPanel = settingsUI.getStatusWidget(device._alies + "wifistStatus", "WiFi ST", undefined);
                device.wifistatus.addValueListner(settingsUI.onWiFiSTStatusChange, WiFiSTPanel);

                var dataDiv = document.getElementById(device._alies + "updatePropPanelDataDiv");
                if (dataDiv != undefined) {
                    settingsUI.addPropertyView(dataDiv, device.wifirssi, getLang("wifirssi"), "dBm");
                    settingsUI.addSpaceView(dataDiv, "1");

                }
            }

            if (device._id == "esp") {

                var dataDiv = document.getElementById(device._alies + "updatePropPanelDataDiv");
                if (dataDiv != undefined) {

                    settingsUI.addPropertyView(dataDiv, device.espfreesketchspace, getLang("espfreesketchspace"), "byte");
                    settingsUI.addPropertyView(dataDiv, device.espfreeheap, getLang("espfreeheap"), "byte");
                    settingsUI.addPropertyView(dataDiv, device.espcpufreqmhz, getLang("espcpufreqmhz"), "mHz");
                    settingsUI.addSpaceView(dataDiv, "3");
                    settingsUI.addPropertyView(dataDiv, device.espresetreason, getLang("espresetreason"));
                    settingsUI.addSpaceView(dataDiv, "2");

                    var resetButton = dataDiv.appendChild(document.createElement('input'));
                    resetButton.className = "btn btn-danger btn-sm";
                    resetButton.type = "button";
                    resetButton.setAttribute("data-toggle", "modal");
                    resetButton.setAttribute("data-target", "#resetModal");
                    resetButton.value = getLang("reset");
                    resetButton.deviceHost = device._host;
                    resetButton.onclick = settingsUI.modalResetClick;

                    settingsUI.addPropertyView(dataDiv, device.firmwareversion, getLang("firmwareversion"));
                    settingsUI.addPropertyView(dataDiv, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));
                    settingsUI.addSpaceView(dataDiv, "5");
                }
            }


            if (device._id == "network") {
               // document.title = device.unitid.value + " :: OWL OS"; //ToDo detect "local" node

                var RESTfulPanel = settingsUI.getStatusWidget(device._alies + "restfulStatus", "RESTful");
                device.restfulavailable.addValueListner(settingsUI.onRESTfulStatusChange, RESTfulPanel);
                var node = config.getNodeByHost(device._host);
                node.addNetworkStatusListner(settingsUI.onRESTfulOnlineStatusChange, RESTfulPanel);

                var MQTTPanel = settingsUI.getStatusWidget(device._alies + "mqttStatus", "MQTT");
                device.mqttclientstate.addValueListner(settingsUI.onMQTTStatusChange, MQTTPanel);

                var OTAPanel = settingsUI.getStatusWidget(device._alies + "otaStatus", "OTA");
                device.otaavailable.addValueListner(settingsUI.onOTAStatusChange, OTAPanel);

                //Node Fade Panel --------------------------------------------------------
                var dataDiv = document.getElementById(device._alies + "updatePropPanelDataDiv");
                if (dataDiv != undefined) {


                    //   addPropertyView(dataDiv, espDevice.firmwareversion, getLang("firmwareversion"));
                    //  addPropertyView(dataDiv, espDevice.firmwarebuildnumber, getLang("firmwarebuildnumber"));
                    //  addSpaceView(dataDiv, "5");


                    settingsUI.addPropertyView(dataDiv, device.firmwareversion, getLang("firmwareversion"));
                    settingsUI.addPropertyView(dataDiv, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));

                    //Update watcher panel 
                    var updateWatcherId = device._alies + "updateWatcher";
                    var updateWatcherDiv = document.getElementById(updateWatcherId);
                    if (updateWatcherDiv == null) {
                        updateWatcherDiv = dataDiv.appendChild(document.createElement('div'));
                        updateWatcherDiv.id = updateWatcherId;
                        updateWatcherDiv.className = "text-primary";
                        //one listner to two properties
                        settingsUI.addSpaceView(dataDiv, "9");

                        var updateuiButton = dataDiv.appendChild(document.createElement('input'));
                        updateuiButton.id = "updateuibutton";
                        updateuiButton.className = "btn btn-success btn-sm";
                        updateuiButton.type = "button";
                        updateuiButton.setAttribute("data-toggle", "modal");
                        updateuiButton.setAttribute("data-target", "#resetModal");
                        updateuiButton.value = getLang("updateuibutton");
                        updateuiButton.node = deviceAhref.node;
                        updateuiButton.onclick = settingsUI.modalUpdateUIClick;

                        settingsUI.addSpaceView(dataDiv, "8");

                        var updatefirmwareButton = dataDiv.appendChild(document.createElement('input'));
                        updatefirmwareButton.id = "updatefirmwarebutton";
                        updatefirmwareButton.className = "btn btn-success btn-sm";
                        updatefirmwareButton.type = "button";
                        updatefirmwareButton.setAttribute("data-toggle", "modal");
                        updatefirmwareButton.setAttribute("data-target", "#resetModal");
                        updatefirmwareButton.value = getLang("updatefirmwarebutton");
                        updatefirmwareButton.onclick = settingsUI.modalUpdateFirmwareClick;

                        updateuiButton.style.display = "none";
                        updatefirmwareButton.style.display = "none";

                        updateWatcherDiv.updateuiButton = updateuibutton; // document.getElementById("updateuibutton");
                        updateWatcherDiv.updatefirmwareButton = updatefirmwarebutton;

                        device.updateinfo.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                        device.updatepossible.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                    }
                }
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
        updateButton.onclick = updateUIClick;
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

        "use strict";

        sleep(10000).then(function () {
            getUpdateLogAsyncWithReciever(node.host, updateLogReciever, undefined, updateLog, undefined);
            return false;
        });
        /*
        sleep(10000).then(() => {
            getUpdateLogAsyncWithReciever(node.host, updateLogReciever, undefined, updateLog, undefined);
            return false;
        });
        */
        return false;
    },

    updateLogReciever: function (HTTPResult, upperReciever, sender, upperSender) {
        if (!HTTPResult.startsWith("%error")) {
            sender.innerHTML = "Update log:<br>" + HTTPResult;

            var modalFooter = document.getElementById("updateModalFooter");
            var resetButton = modalFooter.appendChild(document.createElement("button"));
            resetButton.type = "button";
            resetButton.className = "btn btn-sm btn-danger";
            resetButton.id = "resetModalButton";
            resetButton.onclick = resetClick;
            resetButton.innerText = getLang("reset");
        }
        else {
            sender.innerHTML += "HTTP client - " + HTTPResult;
        }
    },

    //--------------------------------------------------------------------------------------------------------------------
    modalUpdateFirmwareClick: function () {

        makeModalDialog("resetPanel", "firmware", getLang("firmware"), getLang("areYouSure"));
        var modalFooter = document.getElementById("firmwareModalFooter");

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "firmwareModalButton";
        updateButton.onclick = updateFirmwareClick;
        updateButton.innerText = getLang("firmwarebutton");

        $("#firmwareModal").modal('show');

        return false;
    },

    updateFirmwareClick: function (event) {

        var modalFooter = document.getElementById("firmwareModalFooter");
        modalFooter.removeChild(event.currentTarget);

        var modalBody = document.getElementById("firmwareModalBody");
        modalBody.innerHTML = "";
        var updateLog = modalBody.appendChild(document.createElement("div"));
        updateLog.innerHTML = getLang("updatefirmware");
        updateFirmwareAsync();
        getUpdateLogAsyncWithReciever(updateLogReciever, undefined, updateLog, undefined);

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
        if (!HTTPResult.startsWith("%error")) {
            sender.innerHTML = "Update log:<br>" + HTTPResult;
        }
        else {
            sender.innerHTML += "HTTP client - " + HTTPResult;
        }
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
            var build = updateInfo[1].split(":")[1];
            var innerHTML = "<div class='text-light'><strong class='text-light'>" + getLang("updateinfo") + ":</strong> " + firmware + " [<b class='text-warning'>" + getLang("firmwarebuildnumber") + ": </b>" + build + "]</div><br>";
            if (parseInt(build) > parseInt(networkDevice.firmwarebuildnumber.value)) {
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
                    }
                    innerHTML += "<strong class='text-success'>" + getLang("updateuipossible") + "</strong>";
                }
                else {
                    if (updateuibutton != undefined) {
                        updateuibutton.style.display = "block";
                        updatefirmwarebutton.style.display = "block";
                    }
                    innerHTML += "<strong class='text-success'>" + getLang("updatepossible") + "</strong>";
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
