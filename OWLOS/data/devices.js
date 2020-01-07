const TestDeviceType = 0;
const DHTDeviceType = 1;
const LightDeviceType = 2;
const SmokeDeviceType = 3;
const MotionDeviceType = 4;
const SensorDeviceType = 5;
const StepperDeviceType = 6;
const LCDDeviceType = 7;
const ActuatorDeviceType = 8;
const OptoDeviceType = 9;
const ValveDeviceType = 10;
const WiFiTypeDeviceType = 11;
const NetworkTypeDeviceType = 12;
const ESPTypeDeviceType = 13;
const ConfigDeviceType = 14;
//-------------------------------------------------------------------------------------------------------------------------
var devicesObjectsList;

//TEMPORARY ---------------------------------
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
        deviceAhref.node = WebProperties.getNodeByHost(device._host);
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

            var RESTfulPanel = getStatusIndicator(device._alies +"restfulStatus", "RESTful");
            device.restfulavailable.addValueListner(onRESTfulStatusChange, RESTfulPanel);
            var node = WebProperties.getNodeByHost(device._host);
            node.addNetworkStatusListner(onRESTfulOnlineStatusChange, RESTfulPanel);

            var MQTTPanel = getStatusIndicator(device._alies +"mqttStatus", "MQTT");
            device.mqttclientstate.addValueListner(onMQTTStatusChange, MQTTPanel);

            var OTAPanel = getStatusIndicator(device._alies +"otaStatus", "OTA");
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

function deviceOnWebConfigChange(sender, webProperties) {

    
    if (webProp.nodes.length == 0) return;
        
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


    for (var nodeKey in webProp.nodes) {
        var node = webProp.nodes[nodeKey];
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

    if (WebProperties.addNode(document.getElementById("hostInput").value, document.getElementById("aliesInput").value)) {
        if (WebProperties.save()) {
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
    if (aHref.nodefadepanel!= undefined) {
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



//TEMPORARY ---------------------------------

//TEMPORARY ---------------------------------
function _initDevicesTable() {
    //temp ------------------------------------------------------------------------
    
    var devicesAnchors = document.getElementById("devicesAnchors");

    var devicesNavBar = devicesAnchors.appendChild(document.createElement("ul"));
    devicesNavBar.style.height = "0px";
    devicesNavBar.id = "devicesNavBar";
    devicesNavBar.className = "nav nav-tabs";

/*
    var deviceNavItem = devicesNavBar.appendChild(document.createElement("li"));
    deviceNavItem.className = "nav-item";


    var deviceHRef = deviceNavItem.appendChild(document.createElement("a"));
    deviceHRef.className = "nav-link";
    deviceHRef.style.background = theme.success;
    deviceHRef.setAttribute("data-toggle", "tab");
    deviceHRef.onclick = addDeviceClick;
    deviceHRef.innerText = getLang("adddevice");
    deviceHRef.href = href = "#home";
    */
    
}

//-------------------------------------------
/*
class DevicesObjectsList {
    constructor() {
        this.devicesObjectsList = [];
    }

    getDevice(id) {
        for (var i = 0; i < this.devicesObjectsList.length; i++) {
            if (this.devicesObjectsList[i].id == id) {
                return this.devicesObjectsList[i];
            }
        }
        return null;
    }

    refresh(devicesList, devicesIndicatorsPanel) {

        if ((status_online == NET_ONLINE) && (devicesList.length > 0)) {
            for (var i = 0; i < devicesList.length; i++) {

                var deviceType = getParsedDeviceProperty(devicesList[i], "type");
                var deviceId = getParsedDeviceProperty(devicesList[i], "id");
                var device = this.getDevice(deviceId);

                if (device == null) {
                    switch (deviceType) {
                        case "0":
                            device = new TemperatureDevice(devicesIndicatorsPanel, deviceId, "temperature");
                            //TEMPORARY
                            var device2 = new TemperatureDevice(devicesIndicatorsPanel, deviceId, "temperature", 1);
                            this.devicesObjectsList.push(device2);
                            //device2.refresh();
                            device.twin = device2;
                            device2.twin = device;
                            break;
                        case "1":
                            device = new HumidityDevice(devicesIndicatorsPanel, deviceId, "humidity");
                            //TEMPORARY
                            var device2 = new HumidityDevice(devicesIndicatorsPanel, deviceId, "humidity", 1);
                            this.devicesObjectsList.push(device2);
                            //device2.refresh();
                            device.twin = device2;
                            device2.twin = device;
                            break;
                        case "2": device = new LightDevice(devicesIndicatorsPanel, deviceId, "light"); break;
                        case "3": device = new SmokeDevice(devicesIndicatorsPanel, deviceId, "smoke"); break;
                        case "4":
                            device = new MotionDevice(devicesIndicatorsPanel, deviceId, "motion");
                            //TEMPORARY
                            var device2 = new MotionDevice(devicesIndicatorsPanel, deviceId, "motion", 1);
                            this.devicesObjectsList.push(device2);
                            //device2.refresh();
                            device.twin = device2;
                            device2.twin = device;
                            break;                            
                        case "5": device = new SensorDevice(devicesIndicatorsPanel, deviceId, "data"); break;
                        case "6": device = new StepperDevice(devicesIndicatorsPanel, deviceId, "position"); break;
                        case "7": device = new LCDDevice(devicesIndicatorsPanel, deviceId, "text"); break;
                        case "8": device = new ActuatorDevice(devicesIndicatorsPanel, deviceId, "data"); break;
                        default: break; //FFR add unknown device 

                    }
                    if (device != null) { //TEMP
                        this.devicesObjectsList.push(device);
                    }
                }

                if (device != null) { //TEMP
                    device.refresh();
                    if (device.twin != undefined) {
                        device.twin.refresh();
                    }
                }

                /*
                if (deviceType === "6") { //stepper

                    var range = getParsedDeviceProperty(devicesList[i], "range")
                    var position = getParsedDeviceProperty(devicesList[i], "position")
                    var percent = Math.round(position / (range / 100.0));
                    //var stepperPanel = document.getElementById("devicesIndicatorsPanel").appendChild(document.createElement('div'));
                    //addDeviceIndicator(devicesIndicatorPanel, percent, percent, "%", devicesList[i]);
                    addDeviceIndicator(devicesIndicatorPanel, deviceId, percent, pervent + "%");

                    var buttonsPanel = document.getElementById("buttonsPanel" + devicesList[i]);
                    if (buttonsPanel == null) {
                        buttonsPanel = stepperPanel.appendChild(document.createElement('div'));
                        buttonsPanel.id = "buttonsPanel" + devicesList[i];
                        buttonsPanel.class = "btn-group";
                        buttonsPanel.role = "group";
                    }
                    else {
                        buttonsPanel.innerHTML = "";
                    }

                    var toOpenButton = devicesIndicatorPanel.appendChild(document.createElement('a'));
                    toOpenButton.className = "badge badge-primary";
                    toOpenButton.href = "#";
                    toOpenButton.id = "toopen" + devicesList[i];
                    toOpenButton.stepperid = devicesList[i];
                    toOpenButton.toposition = 0;
                    toOpenButton.onclick = topositionClick;
                    toOpenButton.innerText = "0%";

                    var toMiddleButton = devicesIndicatorPanel.appendChild(document.createElement('a'));
                    toMiddleButton.className = "badge badge-primary";
                    toMiddleButton.href = "#";
                    toMiddleButton.id = "tomiddle" + devicesList[i];
                    toMiddleButton.stepperid = devicesList[i];
                    toMiddleButton.toposition = range / 2;
                    toMiddleButton.onclick = topositionClick;
                    toMiddleButton.innerText = "50%";

                    var toCloseButton = devicesIndicatorPanel.appendChild(document.createElement('a'));
                    toCloseButton.className = "badge badge-primary";
                    toCloseButton.href = "#";
                    toCloseButton.id = "toclose" + devicesList[i];
                    toCloseButton.stepperid = devicesList[i];
                    toCloseButton.toposition = range;
                    toCloseButton.onclick = topositionClick;
                    toCloseButton.innerText = "100%";

                }
                else
  
                if (deviceType === "9") { //opto                            
                    var Sensor = document.getElementById(devicesList[i] + "sensor");
                    if (Sensor == null) {
                        var Sensor = devicesIndicatorsPanel.appendChild(document.createElement('div'));
                        Sensor.className = "card col-md-1 devicePanelDiv";
                        Sensor.id = devicesList[i] + "sensor";
                    }

                    if (getParsedDeviceProperty(devicesList[i], "data") === "0") {
                        Sensor.innerHTML = "<h4 class='text-info'>NO</h4><br>";
                        Sensor.innerHTML += deviceId;
                    }
                    else
                        if (getParsedDeviceProperty(devicesList[i], "data") === "1") {
                            Sensor.innerHTML = "<h4 class='text-info'>F. to S.</h4><br>";
                            Sensor.innerHTML += deviceId;
                        }
                        else {
                            Sensor.innerHTML = "<h4 class='text-info'>S. to F.</h4><br>";
                            Sensor.innerHTML += deviceId;
                        }
                }
            }
        }
        //Offline
        else {
            for (var i = 0; i < this.devicesObjectsList.length; i++) {
                this.devicesObjectsList[i].networkStatus = NET_OFFLINE;
            }
        }

    }
}
              */
//-----------------------------------------------------------------------------------
//Devices classes -------------------------------------------------------------------
//Base radial class 
//-----------------------------------------------------------------------------------
class RadialIndicatorsDeviceBase {

    constructor(parentPanel, device, deviceProperty, noIndicator, webPropIndicator) {
        this.webPropIndicator = webPropIndicator;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noIndicator);
            this.joinDevice(device, deviceProperty);

        }
    }

    offlineStarter(parentPanel, deviceId, devicePropertyName, noIndicator) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;

        addDashboardModeListner(this.onDashboardModeChange, this);
        if ((noIndicator == undefined) || (!noIndicator)) {
            this.indicator = new RadialIndicator(parentPanel, deviceId, 150);
            this.indicator.deviceClass = this;
            this.indicator.rPanel.onclick = this.indicatorClick;
            this.draw();
        }
    }

    joinDevice(device, deviceProperty) {
        this.device = device;
        this.deviceProperty = deviceProperty;
        this.indicator.deviceClass.deviceProperty = deviceProperty;
        this.node = WebProperties.getNodeByHost(device._host);
        //devices.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.node.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addValueListner(this.onValueChange, this);
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            /*
            sender.device = device;
            sender.deviceProperty = device[sender.devicePropertyName];
            sender.indicator.deviceClass.deviceProperty = sender.deviceProperty;
            devices.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addValueListner(sender.onValueChange, sender);
            */
            sender.joinDevice(device, device[sender.devicePropertyName]);
        }
    }

    onValueChange(sender, deviceProperty) {
        sender.draw();
    }

    onNetworkStatusChange(sender, deviceProperty) {
        if (sender.indicator != undefined) {
            sender.indicator.networkStatus = deviceProperty.networkStatus;
        }
    }

    onDashboardModeChange(sender, mode) {
        if (sender.indicator != undefined) {
            if (mode) {
                sender.indicator.mode = WORK_MODE;
            }
            else {
                sender.indicator.mode = MOVE_MODE;
            }
        }

    }


    indicatorClick(event) {
        event.stopPropagation();
        var indicatorPanel = event.currentTarget;
        var indicator = indicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            indicator.deviceClass.deviceProperty.getValue();
        }
        return true;
    }

    refresh() { }

    draw() { }
}

class TemperatureDevice extends RadialIndicatorsDeviceBase {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);
        this.indicator = new TemperatureIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        super(parentPanel, device, deviceProperty, true, webPropIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.indicator.refresh(this.deviceProperty.value, Math.round(this.deviceProperty.value) + " C", this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}
//-----------------------------------------------------------------------------------------------------------------------
class HumidityDevice extends RadialIndicatorsDeviceBase {


    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new RadialIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        super(parentPanel, device, deviceProperty, true, webPropIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.indicator.refresh(this.deviceProperty.value, Math.round(this.deviceProperty.value) + "%", this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}
//HistoryData Graph ------------------------------------------------------------------------------------------------------
class HistoryDataGraphDevice extends RadialIndicatorsDeviceBase {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);
        this.indicator = new GraphIndicator(parentPanel, deviceId, 150, temperatureIcon);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        super(parentPanel, device, deviceProperty, true, webPropIndicator);
        if (device == undefined) return;
    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.indicator.refresh(this.deviceProperty.value, this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}


class LightDevice extends RadialIndicatorsDeviceBase {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new LightIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        super(parentPanel, device, deviceProperty, true, webPropIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = Math.round(this.deviceProperty.value / (1024.0 / 100.0));
            if (this.deviceProperty.value < 50) {
                this.indicator.refresh(percent, getLang("low"), this.device._id, this.device.historydata.value);
            }
            else
                if (this.deviceProperty.value < 150) {
                    this.indicator.refresh(percent, getLang("norm"), this.device._id, this.device.historydata.value);
                }
                else {
                    this.indicator.refresh(percent, getLang("high"), this.device._id, this.device.historydata.value);
                }
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }

}


class SmokeDevice extends RadialIndicatorsDeviceBase {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new SmokeIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        super(parentPanel, device, deviceProperty, true, webPropIndicator);
        if (device == undefined) return;

    }


    draw() {

        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = Math.round(this.deviceProperty.value / (1024.0 / 100.0));
            if (this.deviceProperty.value < 50) {
                this.indicator.refresh(percent, getLang("smokelow"), this.device._id, this.device.historydata.value);
            }
            else
                if (this.deviceProperty.value < 150) {
                    this.indicator.refresh(percent, getLang("smokenorm"), this.device._id, this.device.historydata.value);
                }
                else {
                    this.indicator.refresh(percent, getLang("smokehigh"), this.device._id, this.device.historydata.value);
                }
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }

}

class MotionDevice extends RadialIndicatorsDeviceBase {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new MotionIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        super(parentPanel, device, deviceProperty, true, webPropIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {

            var data = this.deviceProperty.value;
            if (this.device.historydata.value != undefined) {
                var splitHistory = this.device.historydata.value.split(";");
                var count = parseInt(splitHistory[0]);
                var lastMotion = 0;
                if (count > 6) { //last minute 
                    for (var i = count - 6; i < count + 1; i++) {
                        lastMotion += parseFloat(splitHistory[i]);
                    }
                }
                else {
                    for (var i = 1; i < count + 1; i++) {
                        lastMotion += parseFloat(splitHistory[i]);
                    }
                }
                if (lastMotion != 0) {
                    data = 1;
                }
            }
            var text = "notdetect";
            if (data == 1) {
                text = "detect";
            }
            this.indicator.refresh(data, text, this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

class SensorDevice extends RadialIndicatorsDeviceBase {
    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = 0;
            var text = getLang("non");
            if (this.deviceProperty.value == 1) {
                percent = 100;
                text = getLang("yes");
            }

            this.indicator.refresh(percent, text, this.device._id);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

//Acturator ----------------------------------------------------------------------------------
class ActuatorDevice {


    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;
        devices.addNetworkStatusListner(this.onNetworkStatusChange, this);

        addDashboardModeListner(this.onDashboardModeChange, this);

        this.indicator = new ActuatorIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.actuatorIndicatorClick;
        this.draw();

    }


    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        this.webPropIndicator = webPropIndicator;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noIndicator);
            this.device = device;
            this.deviceProperty = deviceProperty;
            this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.deviceProperty.addValueListner(this.onValueChange, this);

        }
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            sender.device = device;
            sender.deviceProperty = device[sender.devicePropertyName];
            sender.indicator.deviceClass.deviceProperty = sender.deviceProperty;
            devices.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addValueListner(sender.onValueChange, sender);
        }
    }



    onValueChange(sender, deviceProperty) {
        sender.draw();
    }

    onNetworkStatusChange(sender, deviceProperty) {
        if (sender.indicator != undefined) {
            sender.indicator.networkStatus = deviceProperty.networkStatus;
        }
    }

    onDashboardModeChange(sender, mode) {
        if (sender.indicator != undefined) {
            if (mode) {
                sender.indicator.mode = WORK_MODE;
            }
            else {
                sender.indicator.mode = MOVE_MODE;
            }
        }

    }


    actuatorIndicatorClick(event) {
        event.stopPropagation();
        var actuatorIndicatorPanel = event.currentTarget;
        var indicator = actuatorIndicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            var deviceProperty = indicator.deviceClass.deviceProperty;
            if (parseInt(deviceProperty.value) == 1) {
                deviceProperty.setValue(0);
            }
            else {
                deviceProperty.setValue(1);
            }
        }
        //return actuatorIndicator;
        return true;
    }
    draw() {

        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var text = "off";
            if (parseInt(this.deviceProperty.value) == 1) {
                text = "on";
            }

            this.indicator.refresh(this.deviceProperty.value, text, this.device._id);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

//LCD ----------------------------------------------------------------------------------
class LCDDevice {

    offlineStarter(parentPanel, deviceId, devicePropertyName, noIndicator) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;
        devices.addNetworkStatusListner(this.onNetworkStatusChange, this);

        addDashboardModeListner(this.onDashboardModeChange, this);

        this.indicator = new LCDIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.lcdButton.onclick = this.lcdTextClick;
        this.indicator.lightButton.onclick = this.lcdLightClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, webPropIndicator) {
        this.webPropIndicator = webPropIndicator;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name);
            this.device = device;
            this.device["text"].addNetworkStatusListner(this.onTextChange, this);
            this.device["text"].addValueListner(this.onTextChange, this);
            this.device["backlight"].addValueListner(this.onLightChange, this);

          //  this.deviceProperty = deviceProperty;
         //   this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
         //  this.deviceProperty.addValueListner(this.onValueChange, this);

        }
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            sender.device = device;

            sender.device["text"].addNetworkStatusListner(sender.onTextChange, sender);
            sender.device["text"].addValueListner(sender.onTextChange, sender);
            sender.device["backlight"].addValueListner(sender.onLightChange, sender);

            devices.addNetworkStatusListner(sender.onNetworkStatusChange, sender);

        }
    }

    onDashboardModeChange(sender, mode) {
        if (sender.indicator != undefined) {
            if (mode) {
                sender.indicator.mode = WORK_MODE;
            }
            else {
                sender.indicator.mode = MOVE_MODE;
            }
        }

    }


    onNetworkStatusChange(sender, deviceProperty) {
        if (sender.indicator != undefined) {
            sender.indicator.networkStatus = deviceProperty.networkStatus;
        }
    }

    onTextChange(sender, deviceProperty) {
        sender.draw();
    }

    onLightChange(sender, deviceProperty) {
        sender.draw();
    }


    lcdTextClick(event) {
        event.stopPropagation();
        var lcdIndicatorPanel = event.currentTarget;
        var indicator = lcdIndicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            indicator.hideEditor();
            var deviceProperty = indicator.deviceClass.device["text"];
            deviceProperty.setValue(indicator.textarea.value);

        }
    }


    lcdLightClick(event) {
        event.stopPropagation();
        var lcdIndicatorPanel = event.currentTarget;
        var indicator = lcdIndicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            indicator.hideEditor();
            var deviceProperty = indicator.deviceClass.device["backlight"];
            if (parseInt(deviceProperty.value) == 1) {
                deviceProperty.setValue(0);
            }
            else {
                deviceProperty.setValue(1);
            }
        }
    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.device == undefined) return;
        if (this.device["text"].networkStatus == NET_ONLINE) {

            if (this.device["text"].value != undefined) {
                this.indicator.refresh(this.device["text"].value, this.device._id, this.device["backlight"].value);
            }
            else {
                this.indicator.refresh("", this.device._id, this.device["backlight"].value);
            } 

        }
        else {
            this.indicator.refresh("", this.device._id, 0);
        }
        this.indicator.networkStatus = this.device["text"].networkStatus;
        return true;

        /*
        if (!data.startsWith("%error")) {
            this.lcdIndicator.refresh(data, this.id, light);
            this.lcdIndicator.networkStatus = NET_ONLINE;
        }
        else {
            this.lcdIndicator.refresh("", this.id, 0);
            this.lcdIndicator.networkStatus = NET_ERROR;
        }
        */

    }

    //set _networkStatus(networkStatus) {
    //this.lcdIndicator.networkStatus = networkStatus;
    //}
}

//Stepper ----------------------------------------------------------------------------------
class StepperDevice {
    constructor(parentPanel, id, propertyName) {
        this.id = id;
        this.propertyName = propertyName;
        this.stepperIndicator = new StepperIndicator(parentPanel, id, 150);
        this.stepperIndicator.deviceClass = this;
        this.stepperIndicator.positionChangeReciever = this.positionChange;
    }

    positionChange(toPercent) { //this is caller (stepperIndicator)
        if (this.atProcess) {
            //todo cancel
            this.atProcess = false;
            return;
        }
        this.atProcess = true;
        var deviceClass = this.deviceClass;
        var newToPosition = toPercent * (deviceClass.range / 100);
        setDevicePropertyAsyncWithReciever(deviceClass.id, "toposition", newToPosition, deviceClass.clientCallback, deviceClass);
    }


    clientCallback(data, deviceClass) {
        if (!data.startsWith("%error")) {
            deviceClass.stepperIndicator.networkStatus = NET_RECONNECT;
        }
        else {
            if (!data.includes("response")) { //offline 
                //  deviceClass.stepperIndicator.networkStatus = NET_OFFLINE;
            }
            else { //device error
                deviceClass.draw(data);
            }
        }
    }



    refresh() {
        if (status_online == NET_ONLINE) {
            this.position = getParsedDeviceProperty(this.id, "position");
            this.toposition = getParsedDeviceProperty(this.id, "toposition");
            this.range = getParsedDeviceProperty(this.id, "range");
            this.draw(this.position, this.toposition, this.range);
        }
        else {
            this.stepperIndicator.networkStatus = status_online;
        }
    }

    draw(position, toposition, range) {
        if (this.deviceProperty == undefined) return;
        if (!isNaN(position)) {
            var percent = position / (range / 100);
            var toPercent = toposition / (range / 100);
            this.stepperIndicator.refresh(percent, toPercent, Math.round(percent) + "%", this.id);
            this.stepperIndicator.networkStatus = NET_ONLINE;
        }
        else {
            //TODO
            // this.stepperIndicator.refresh(0, 0, "--", this.id);
            // this.stepperIndicator.networkStatus = NET_ERROR;
        }
    }

    set _networkStatus(networkStatus) {
        this.stepperIndicator.networkStatus = networkStatus;
    }
}

//Indicator layer -------------------------------------------------
var IndicatorsLayer = {
    /*
    RadialIndicator: {
        id: "radialindicator",
        name: getLang("radial"),
        indicator: RadialIndicatorsDeviceBase
    },
    */
    TemperatureIndicator: {
        id: "temperature",
        name: getLang("temperature"),
        indicator: TemperatureDevice,
        devicesTypes: ";" + DHTDeviceType + ";",
        devicesProperties: ";temperature;"
    },
    HumidityIndicator: {
        id: "humidity",
        name: getLang("humidity"),
        indicator: HumidityDevice,
        devicesTypes: ";" + DHTDeviceType + ";",
        devicesProperties: ";humidity;"
    },
    HistoryDataGraphIndicator: {
        id: "historydatagraph",
        name: getLang("historydatagraph"),
        indicator: HistoryDataGraphDevice,
        devicesTypes: "any",
        devicesProperties: ";historydata;",
    },
    LightIndicator: {
        id: "light",
        name: getLang("light"),
        indicator: LightDevice,
        devicesTypes: ";" + LightDeviceType + ";",
        devicesProperties: ";light;",

    },
    SmokeIndicator: {
        id: "smoke",
        name: getLang("smoke"),
        indicator: SmokeDevice,
        devicesTypes: ";" + SmokeDeviceType + ";",
        devicesProperties: ";smoke;",
    },
    MotionIndicator: {
        id: "motion",
        name: getLang("motion"),
        indicator: MotionDevice,
        devicesTypes: ";" + MotionDeviceType + ";",
        devicesProperties: ";motion;",

    },
    SensorIndicator: {
        id: "sensor",
        name: getLang("sensor"),
        indicator: SensorDevice,
        devicesTypes: ";" + SensorDeviceType + ";",
        devicesProperties: ";data;",

    },
    LCDIndicator: {
        id: "lcd",
        name: getLang("lcd"),
        indicator: LCDDevice,
        devicesTypes: ";" + LCDDeviceType + ";",
        devicesProperties: "any",

    },
    ActuatorIndicator: {
        id: "actuator",
        name: getLang("actuator"),
        indicator: ActuatorDevice,
        devicesTypes: ";" + ActuatorDeviceType + ";",
        devicesProperties: ";data;",

    },

    getIndicatorById: function (id) {
        if (id == undefined) return undefined;
        for (var indicatorProp in IndicatorsLayer) {
            if (IndicatorsLayer[indicatorProp].id == undefined) continue;
            if (IndicatorsLayer[indicatorProp].id == id) {
                return IndicatorsLayer[indicatorProp];
            }
        }
        return undefined;
    }

}
//Dashboard --------------------------------------------------------------------------------------------------------

var dashboardModeListners = [];

function addDashboardModeListner(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
    //check event listner and setup current network status 
    try { _event(_sender, this); } catch {
        return; // don't add bad listner
    }
    dashboardModeListners.push(event = { event: _event, sender: _sender });
}

var dashboardViewMode = true;

function _initDashboard() {
    var devicesIndicatorsPanel = document.getElementById("devicesIndicatorsPanel");
    var indicatorsPanel = devicesIndicatorsPanel.appendChild(document.createElement('div'));
    indicatorsPanel.id = "indicatorsPanel";
    indicatorsPanel.className = "col-md-12";
    var infoDiv = indicatorsPanel.appendChild(document.createElement('div'));
    infoDiv.className = "card text-white bg-dark mb-3";
    var headerDiv = infoDiv.appendChild(document.createElement('div'));
    headerDiv.className = "card-header";

    var headerText = headerDiv.appendChild(document.createElement('div'));
    headerText.innerHTML = getLang("Dashboard");

    var headerModeButton = headerText.appendChild(document.createElement('input'));
    headerModeButton.className = "btn btn-secondary btn-sm close";
    headerModeButton.type = "button";
    headerModeButton.value = "V";
    headerModeButton.onclick = changeDashboadMode;

    var addIndicatorButton = headerText.appendChild(document.createElement('input'));
    addIndicatorButton.className = "btn btn-success btn-sm close";
    addIndicatorButton.type = "button";
    addIndicatorButton.value = "+";
    addIndicatorButton.onclick = addIndicatorMode;

    var dataDiv = infoDiv.appendChild(document.createElement('div'));
    dataDiv.id = "indicatorsPanelDataDiv"
    dataDiv.className = "card-body";

    var devicesIndicatorsPanel = document.getElementById("indicatorsPanelDataDiv");
    for (var i = 0; i < webProp.dashboards[0].indicators.length; i++) {
        var indicatorProp = webProp.dashboards[0].indicators[i];
        var indicator = IndicatorsLayer.getIndicatorById(indicatorProp.indicatorId);
        if (indicator != undefined) {
            var indicatorDevice = new indicator.indicator(devicesIndicatorsPanel, undefined, undefined, webProp.dashboards[0].indicators[i]);
            indicatorDevice.offlineStarter(devicesIndicatorsPanel, indicatorProp.deviceId, indicatorProp.deviceProperty);
            indicatorDevice.indicator.addEventListner(WebProperties.indicatorEvent, webProp.dashboards[0].indicators[i]);

        }
    }

}

function changeDashboadMode() {
    dashboardViewMode = !dashboardViewMode;

    for (var k = 0; k < dashboardModeListners.length; k++) {
        dashboardModeListners[k].event(dashboardModeListners[k].sender, dashboardViewMode);
    }
}

function addIndicatorMode() {

    makeModalDialog("resetPanel", "indicator", getLang("indicatorunit"), getLang("areYouSure"));
    var modalBody = document.getElementById("indicatorModalBody");
    modalBody.innerHTML = "";
    var modalFooter = document.getElementById("indicatorModalFooter");
    //Body form -----------------
    var formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";

    //device select 
    var deviceLabel = formGroup.appendChild(document.createElement("label"));
    deviceLabel.setAttribute("for", "deviceSelect");
    deviceLabel.innerText = getLang("deviceslist");
    var deviceSelect = formGroup.appendChild(document.createElement('select'));
    deviceSelect.className = "form-control form-control-sm";
    deviceSelect.id = "typeSelect";

    for (var node in webProp.nodes) {
        
        for (var i = 0; i < webProp.nodes[node].devices.length; i++) {
            var valueSelectOption = deviceSelect.appendChild(document.createElement('option'));
            valueSelectOption.innerText = getLang(webProp.nodes[node].devices[i]._alies + "/" + webProp.nodes[node].devices[i]._id);
            valueSelectOption.device = webProp.nodes[node].devices[i];
        }
    }

    deviceSelect.onchange = onDeviceSelect;
    //device property select 

    var devicePropLabel = formGroup.appendChild(document.createElement("label"));
    devicePropLabel.setAttribute("for", "devicePropSelect");
    devicePropLabel.innerText = getLang("devicesporplist");
    var devicePropSelect = formGroup.appendChild(document.createElement('select'));
    devicePropSelect.className = "form-control form-control-sm";
    devicePropSelect.id = "typeSelect";

    devicePropSelect.onchange = onDevicePropSelect;

    //indicators 
    //device select 
    var indicatorLabel = formGroup.appendChild(document.createElement("label"));
    indicatorLabel.setAttribute("for", "indicatorSelect");
    indicatorLabel.innerText = getLang("indicatorslist");
    var indicatorSelect = formGroup.appendChild(document.createElement('select'));
    indicatorSelect.className = "form-control form-control-sm";
    indicatorSelect.id = "typeSelect";



    deviceSelect.devicePropSelect = devicePropSelect;
    devicePropSelect.deviceSelect = deviceSelect;
    deviceSelect.indicatorSelect = indicatorSelect;

    var event = { currentTarget: deviceSelect };
    onDeviceSelect(event)


    //end of Body form ----------
    var indicatorButton = modalFooter.appendChild(document.createElement("button"));
    indicatorButton.type = "button";
    indicatorButton.className = "btn btn-sm btn-success";
    indicatorButton.id = "indicatorModalButton";
    indicatorButton.deviceSelect = deviceSelect;
    indicatorButton.onclick = addIndicatorClick;
    indicatorButton.innerText = getLang("addindicatorbutton");

    $("#indicatorModal").modal('show');


}

function onDeviceSelect(event) {
    var deviceSelect = event.currentTarget;
    var devicePropSelect = deviceSelect.devicePropSelect;
    var indicatorSelect = deviceSelect.indicatorSelect;
    var valueSelectOption = deviceSelect.options[deviceSelect.selectedIndex];


    var device = valueSelectOption.device;

    devicePropSelect.options.length = 0;
    for (var deviceProp in device) {
        if ((device[deviceProp].name == undefined) || (device[deviceProp].type == undefined)) continue;
        var propSelectOption = devicePropSelect.appendChild(document.createElement('option'));
        propSelectOption.innerText = device[deviceProp].name;
        propSelectOption.deviceProp = device[deviceProp];
    }

    var devicePropSelectOption = devicePropSelect.options[devicePropSelect.selectedIndex];
    var deviceProp = devicePropSelectOption.deviceProp;
    refreshIndicatorsSelect(indicatorSelect, device, deviceProp);
}

function onDevicePropSelect(event) {
    var devicePropSelect = event.currentTarget;
    var deviceSelect = devicePropSelect.deviceSelect;
    var indicatorSelect = deviceSelect.indicatorSelect;

    var deviceSelectOption = deviceSelect.options[deviceSelect.selectedIndex];
    var device = deviceSelectOption.device;
    var devicePropSelectOption = devicePropSelect.options[devicePropSelect.selectedIndex];
    var deviceProp = devicePropSelectOption.deviceProp;
    refreshIndicatorsSelect(indicatorSelect, device, deviceProp);
}

function refreshIndicatorsSelect(indicatorSelect, device, deviceProp) {
    indicatorSelect.options.length = 0;
    for (var indicator in IndicatorsLayer) {
        if (IndicatorsLayer[indicator].indicator == undefined) continue;
        if ((IndicatorsLayer[indicator].devicesTypes.includes(";" + device.type.value + ";")) || (IndicatorsLayer[indicator].devicesTypes == "any")) {
            if ((IndicatorsLayer[indicator].devicesProperties.includes(";" + deviceProp.name + ";")) || (IndicatorsLayer[indicator].devicesProperties == "any")) {
                var indicatorSelectOption = indicatorSelect.appendChild(document.createElement('option'));
                indicatorSelectOption.innerText = IndicatorsLayer[indicator].name;
                indicatorSelectOption.indicator = IndicatorsLayer[indicator];
            }
        }
    }

}


function addIndicatorClick(event) {
    var devicesIndicatorsPanel = document.getElementById("indicatorsPanelDataDiv");
    var button = event.currentTarget;
    var deviceSelect = button.deviceSelect;
    var devicePropSelect = deviceSelect.devicePropSelect;
    var indicatorSelect = deviceSelect.indicatorSelect;

    var valueSelectOption = deviceSelect.options[deviceSelect.selectedIndex];
    var device = valueSelectOption.device;
    var deviceProp = devicePropSelect.options[devicePropSelect.selectedIndex].deviceProp;
    var indicator = indicatorSelect.options[indicatorSelect.selectedIndex].indicator;

    var indicatorDevice = new indicator.indicator(devicesIndicatorsPanel, device, deviceProp);

    var webPropIndicator = WebProperties.addIndicator("main", device._id, deviceProp.name, indicator.id)

    indicatorDevice.indicator.addEventListner(WebProperties.indicatorEvent, webPropIndicator);




    $("#indicatorModal").modal('hide');

    /*
        var devicesIndicatorsPanel = document.getElementById("indicatorsPanelDataDiv");
        var device = devices.getDeviceById("temperature");    
        new TemperatureDevice(devicesIndicatorsPanel, device, device.temperature);
        new TemperatureDevice(devicesIndicatorsPanel, device, device.temperature, 1);
    
        var device = devices.getDeviceById("humidiry");
        new HumidityDevice(devicesIndicatorsPanel, device, device.humidity);
        new HumidityDevice(devicesIndicatorsPanel, device, device.humidity, 1);

    */

}

function onOnlineStatusChange(sender, devices) {
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
}


function onWiFiAPStatusChange(sender, deviceProperty) {
    if (deviceProperty.value == 1) {
        sender.className = "badge badge-success";

    }
    else {
        sender.className = "badge badge-secondary";
    }
}

function onWiFiSTStatusChange(sender, deviceProperty) {
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
}

function onRESTfulStatusChange(sender, deviceProperty) {
    if (deviceProperty.value == 1) {
        sender.className = "badge badge-success";

    }
    else {
        sender.className = "badge badge-secondary";
    }
}

function onRESTfulOnlineStatusChange(sender, devices) {
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
}

function onMQTTStatusChange(sender, deviceProperty) {

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
}

function onOTAStatusChange(sender, deviceProperty) {
    if (deviceProperty.value == 1) {
        sender.className = "badge badge-success";

    }
    else {
        sender.className = "badge badge-secondary";
    }
}




//ENDOF Dashboard --------------------------------------------------------------------------------------------------------



