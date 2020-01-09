function _deviceLoaded(sender, device) {
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
        deviceAhref.onclick = deviceAnchorClick;
        deviceAhref.parentLi = deviceLi;

        var devicesIndicatorsPanel = document.getElementById("indicatorsPanelDataDiv");
        var devicesAnchors = document.getElementById("devicesNavBar");
        var devicesPanel = document.getElementById("devicesPanelFade");
        new TableIndicator(devicesAnchors, devicesPanel, device, 12);
        //network indicators ----------------------------------------------
        if (device._id == "wifi") {
            var WiFiAPPanel = getStatusIndicator(device._alies + "wifiapStatus", "WiFi AP", undefined);
            device.wifiaccesspointavailable.addValueListner(onWiFiAPStatusChange, WiFiAPPanel);

            var WiFiSTPanel = getStatusIndicator(device._alies + "wifistStatus", "WiFi ST", undefined);
            device.wifistatus.addValueListner(onWiFiSTStatusChange, WiFiSTPanel);

            var dataDiv = document.getElementById(device._alies + "updatePropPanelDataDiv");
            if (dataDiv != undefined) {
                addPropertyView(dataDiv, device.wifirssi, getLang("wifirssi"), "dBm");
                addSpaceView(dataDiv, "1");

            }
        }

        if (device._id == "esp") {

            var dataDiv = document.getElementById(device._alies + "updatePropPanelDataDiv");
            if (dataDiv != undefined) {

                addPropertyView(dataDiv, device.espfreesketchspace, getLang("espfreesketchspace"), "byte");
                addPropertyView(dataDiv, device.espfreeheap, getLang("espfreeheap"), "byte");
                addPropertyView(dataDiv, device.espcpufreqmhz, getLang("espcpufreqmhz"), "mHz");
                addSpaceView(dataDiv, "3");
                addPropertyView(dataDiv, device.espresetreason, getLang("espresetreason"));
                addSpaceView(dataDiv, "2");


                var resetButton = dataDiv.appendChild(document.createElement('input'));
                resetButton.className = "btn btn-danger btn-sm";
                resetButton.type = "button";
                resetButton.setAttribute("data-toggle", "modal");
                resetButton.setAttribute("data-target", "#resetModal");
                resetButton.value = getLang("reset");
                resetButton.deviceHost = device._host;
                resetButton.onclick = modalResetClick;


                addPropertyView(dataDiv, device.firmwareversion, getLang("firmwareversion"));
                addPropertyView(dataDiv, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));
                addSpaceView(dataDiv, "5");
            }
        }


        if (device._id == "network") {
            document.title = device.unitid.value + " :: OWL OS";

            var RESTfulPanel = getStatusIndicator(device._alies + "restfulStatus", "RESTful");
            device.restfulavailable.addValueListner(onRESTfulStatusChange, RESTfulPanel);
            var node = config.getNodeByHost(device._host);
            node.addNetworkStatusListner(onRESTfulOnlineStatusChange, RESTfulPanel);

            var MQTTPanel = getStatusIndicator(device._alies + "mqttStatus", "MQTT");
            device.mqttclientstate.addValueListner(onMQTTStatusChange, MQTTPanel);

            var OTAPanel = getStatusIndicator(device._alies + "otaStatus", "OTA");
            device.otaavailable.addValueListner(onOTAStatusChange, OTAPanel);

            //Node Fade Panel --------------------------------------------------------
            var dataDiv = document.getElementById(device._alies + "updatePropPanelDataDiv");
            if (dataDiv != undefined) {


                //   addPropertyView(dataDiv, espDevice.firmwareversion, getLang("firmwareversion"));
                //  addPropertyView(dataDiv, espDevice.firmwarebuildnumber, getLang("firmwarebuildnumber"));
                //  addSpaceView(dataDiv, "5");


                addPropertyView(dataDiv, device.firmwareversion, getLang("firmwareversion"));
                addPropertyView(dataDiv, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));

                //Update watcher panel 
                var updateWatcherId = device._alies + "updateWatcher";
                var updateWatcherDiv = document.getElementById(updateWatcherId);
                if (updateWatcherDiv == null) {
                    updateWatcherDiv = dataDiv.appendChild(document.createElement('div'));
                    updateWatcherDiv.id = updateWatcherId;
                    updateWatcherDiv.className = "text-primary";
                    //one listner to two properties
                    addSpaceView(dataDiv, "9");

                    var updateuiButton = dataDiv.appendChild(document.createElement('input'));
                    updateuiButton.id = "updateuibutton";
                    updateuiButton.className = "btn btn-success btn-sm";
                    updateuiButton.type = "button";
                    updateuiButton.setAttribute("data-toggle", "modal");
                    updateuiButton.setAttribute("data-target", "#resetModal");
                    updateuiButton.value = getLang("updateuibutton");
                    updateuiButton.node = deviceAhref.node;
                    updateuiButton.onclick = modalUpdateUIClick;


                    addSpaceView(dataDiv, "8");

                    var updatefirmwareButton = dataDiv.appendChild(document.createElement('input'));
                    updatefirmwareButton.id = "updatefirmwarebutton";
                    updatefirmwareButton.className = "btn btn-success btn-sm";
                    updatefirmwareButton.type = "button";
                    updatefirmwareButton.setAttribute("data-toggle", "modal");
                    updatefirmwareButton.setAttribute("data-target", "#resetModal");
                    updatefirmwareButton.value = getLang("updatefirmwarebutton");
                    updatefirmwareButton.onclick = modalUpdateFirmwareClick;

                    updateuiButton.style.display = "none";
                    updatefirmwareButton.style.display = "none";

                    updateWatcherDiv.updateuiButton = updateuibutton; // document.getElementById("updateuibutton");
                    updateWatcherDiv.updatefirmwareButton = updatefirmwarebutton;

                    device.updateinfo.addValueListner(onUpdateInfoValueChange, updateWatcherDiv);
                    device.updatepossible.addValueListner(onUpdateInfoValueChange, updateWatcherDiv);
                }




            }
        }




    }
}

var firstDevice = true;

function deviceOnWebConfigChange(sender, configPropertieserties) {


    if (configProperties.nodes.length == 0) return;

    var nodesSideBar = document.getElementById("nodesSideBar");
    nodesSideBar.style.background = theme.primary;

    //add addNodeNavItem first --------------------------------------------------
    if (document.getElementById("addNodeNavItem") == undefined) {

        var nodeNavItem = nodesSideBar.appendChild(document.createElement("li"));
        nodeNavItem.className = "nav-item";
        nodeNavItem.id = "addNodeNavItem";
        var nodeHRef = nodeNavItem.appendChild(document.createElement("a"));
        nodeHRef.className = "nav-link";
        nodeHRef.parentLi = nodeLi;
        nodeHRef.style.color = theme.success;
        nodeHRef.setAttribute("data-toggle", "tab");
        nodeHRef.onclick = addNodeClick;
        nodeHRef.innerHTML = "<b>" + getLang("addnode") + "</b>";
        nodeHRef.href = "#home";


    }


    for (var nodeKey in configProperties.nodes) {
        var node = configProperties.nodes[nodeKey];
        if (document.getElementById("nodeNavItem" + node.alies) == undefined) {

            var nodeLi = nodesSideBar.appendChild(document.createElement("li"));
            nodeLi.id = "nodeNavItem" + node.alies;
            nodeLi.node = node;

            if (firstDevice) {
                //   nodeLi.className = "active";
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
            //nodeAhref.onclick = deviceAnchorClick;
            nodeAhref.parentLi = nodeLi;
            nodeAhref.node = node;
            node.addNetworkStatusListner(nodeOnNetworkChange, nodeAhref);
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
            deviceHRef.onclick = addDeviceClick;
            deviceHRef.innerText = getLang("adddevice");
            deviceHRef.href = "#home";
            deviceHRef.node = node;

            if (firstDevice) {
                var devicesPanel = document.getElementById("devicesPanel");
                devicesPanel = devicesPanel.appendChild(document.createElement("div"));
                devicesPanel.id = "devicesPanelFade";
                devicesPanel.className = "tab-content col-md-12";
            }


            //Node Tab panel ----------------------

            var nodePanelNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
            nodePanelNavItem.className = "nav-item";
            var nodePanelHRef = nodePanelNavItem.appendChild(document.createElement("a"));
            nodePanelHRef.className = "nav-link";
            nodePanelHRef.parentLi = nodeLi;
            nodePanelHRef.style.color = theme.warning;
            nodePanelHRef.setAttribute("data-toggle", "tab");
            nodePanelHRef.onclick = deviceAnchorClick;
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
            //makeNodeFadePanel(div, node);

            /*
            var updatePropPanel = div.appendChild(document.createElement('div'));
            updatePropPanel.id = node.alies + "updatePropPanel";
            updatePropPanel.className = "col-md-12";
            var infoDiv = updatePropPanel.appendChild(document.createElement('div'));
            infoDiv.className = "card bg-primary mb-3";
            var headerDiv = infoDiv.appendChild(document.createElement('div'));
            headerDiv.className = "card-header";
            headerDiv.innerText = getLang("unit");
            */
            var dataDiv = div.appendChild(document.createElement('div'));
            dataDiv.id = node.alies + "updatePropPanelDataDiv"
            //dataDiv.className = "card-body";



            //------------------------------------------------------------------------------------
            //Add files submenuitem ------------------

            var filesNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
            filesNavItem.className = "nav-item";
            var filesHRef = filesNavItem.appendChild(document.createElement("a"));
            filesHRef.className = "nav-link";
            filesHRef.parentLi = nodeLi;
            filesHRef.style.color = theme.warning;
            filesHRef.setAttribute("data-toggle", "tab");
            filesHRef.onclick = deviceAnchorClick;
            filesHRef.innerText = getLang("files");
            filesHRef.href = "#" + node.alies + "filesfadepanel";
            filesHRef.node = node;


            //var filesAnchors = document.getElementById("filesAnchors");
            //new files tab ----------------
            var devicesPanel = document.getElementById("devicesPanelFade");
            var filesDiv = devicesPanel.appendChild(document.createElement('div'));

            // div.className = "col-md-" + this.size + " devicediv tab-pane fade";
            filesDiv.className = "devicediv tab-pane fade";
            filesDiv.id = node.alies + "filesfadepanel";

            filesHRef.filesList = new FilesList(filesDiv, node);

            // add Node Status Panel ---------------------------------------------
            var nodeStatusPanel = document.createElement("div");
            nodeStatusPanel.id = node.alies + "nodestatuspanel";
            nodeAhref.nodeStatusPanel = nodeStatusPanel;
            nodeAhref.onlinePanel = getStatusIndicator(node.alies + "onlineStatus", "Online", nodeStatusPanel);

            node.addNetworkStatusListner(onOnlineStatusChange, nodeAhref.onlinePanel);
            nodeAhref.WiFiAPPanel = getStatusIndicator(node.alies + "wifiapStatus", "WiFi AP", nodeStatusPanel);

            nodeAhref.WiFiSTPanel = getStatusIndicator(node.alies + "wifistStatus", "WiFi ST", nodeStatusPanel);
            nodeAhref.RESTfulPanel = getStatusIndicator(node.alies + "restfulStatus", "RESTful", nodeStatusPanel);
            nodeAhref.MQTTPanel = getStatusIndicator(node.alies + "mqttStatus", "MQTT", nodeStatusPanel);
            nodeAhref.OTAPanel = getStatusIndicator(node.alies + "otaStatus", "OTA", nodeStatusPanel);

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

}

function getStatusIndicator(id, text, nodeStatusPanel) {
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
}


function addNodeClick(event) {

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
    updateButton.onclick = addNodeUIClick;
    updateButton.innerText = getLang("addnodebutton");

    $("#addnodeModal").modal('show');

    return false;

}

function addNodeUIClick(event) {
    event.stopPropagation();

    if (config.addNode(document.getElementById("hostInput").value, document.getElementById("aliesInput").value)) {
        if (config.save()) {
            $("#addnodeModal").modal('hide');
        }
    }
    //else todo ERROR
    return false;
}

function deviceAnchorClick(event) {


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
    //  aHref.setAttribute("aria-expanded", "true");


    nodesSideBar.activeLi = aHref.parentLi;
    //nodesSideBar.activeLi.className = "active";
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

    if (aHref.getAttribute("aria-expanded") == "true") {
        document.documentElement.scrollTop = document.documentElement.scrollTop - event.clientY - event.target.offsetHeight;
    }

    return false;
}

function nodeOnNetworkChange(sender, node) {
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
}

