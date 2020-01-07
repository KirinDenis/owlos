var unitId;
var refreshDevicesHandle;
var autorefreshbutton;
var refreshbutton;

var status_online = NET_OFFLINE;
var status_wifiap = NET_OFFLINE;
var status_wifist = NET_OFFLINE;
var status_restful = NET_OFFLINE;
var status_mqtt = NET_OFFLINE;
var status_ota = NET_OFFLINE;

var theme = {};

var wifiap = 0;

//Connection state for WiFiST and MQTTClient
var mqttState = getLang("disconnected");
var wifiSTconection = getLang("disconnected");

var firstTime = true;

$(document).ready(function () {

    addToLogNL("OK loading scripts");
    addToLogNL("[START]", 1);
    addToLog("parse page...");

    //------------------
    //temp
    //    drawActuator("actuator", document.getElementById("panelForStyleTesting")); 
    //    return;
    //------------------
    //    visualStatuses();

    addToLogEnd("OK", 1);

    var style = getComputedStyle(document.body);
    theme.primary = style.getPropertyValue('--primary');
    theme.secondary = style.getPropertyValue('--secondary');
    theme.success = style.getPropertyValue('--success');
    theme.info = style.getPropertyValue('--info');
    theme.warning = style.getPropertyValue('--warning');
    theme.danger = style.getPropertyValue('--danger');
    theme.light = style.getPropertyValue('--light');
    theme.dark = style.getPropertyValue('--dark');
    theme.fontFamily = style.fontFamily;


    //addToLogNL("check unit's RESTful API...");    
   // unitId = getUnitProperty("unitid");
    addToLogNL("get UI configuration...");
    WebProperties.addChangeListner(deviceOnWebConfigChange, undefined);
    if (WebProperties.load()) {
        status_online = NET_ONLINE;

//TEMP-----------------
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });

        _initDevicesTable();
        _initDashboard();
//---------------------

        devices.addDeviceLoadedListner(_deviceLoaded, null);        

        for (var node in webProp.nodes) {
            devices.refresh(webProp.nodes[node]);
        }


        
        addToLogNL(getLang("prepareUnit"));

        
        document.getElementById("home-tab").innerText = getLang("homeTab");
    //    document.getElementById("unit-tab").innerText = getLang("unitTab");
        document.getElementById("settings-tab").innerText = getLang("settingsTab");
     //   document.getElementById("files-tab").innerText = getLang("filesTab");
        document.getElementById("console-tab").innerText = getLang("consoleTab");

        refreshDevicesHandle = setInterval(refreshDevices, 10000);

        document.getElementById("mainContainer").style.display = "block";
        var boot = document.getElementById("boot");
        boot.parentElement.removeChild(boot);
        document.getElementById("consolePanel").appendChild(boot);

        speak("Owl operation system is started");

        speak("Owl operation system is ready");
    }
    else {
        status_online = NET_OFFLINE;
        speak("ERROR with host: " + host);
        addToLogNL("ERROR with host: " + host, 2);
    }
    
});



/*

function renderMainPageDevices() {
    var devicesIndicatorsPanel = document.getElementById("devicesIndicatorsPanel");
    if (firstTime) {
        devicesIndicatorsPanel.innerHTML = "";
        firstTime = false;
    }

}
*/

function addPropertyView(panelDiv, deviceProperty, text, sufix) {
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
        deviceProperty.addValueListner(onPropertyViewedValueChange, propTextDiv);
    }
}

function addSpaceView(panelDiv, number) {
    var propElementId = panelDiv.id + number;
    var propTextDiv = document.getElementById(propElementId);
    if (propTextDiv == null) {
        propTextDiv = panelDiv.appendChild(document.createElement('div'));
        propTextDiv.id = propElementId;
        propTextDiv.className = "text-primary";
        propTextDiv.innerHTML = "<br>";

    }
}

function onPropertyViewedValueChange(sender, deviceProperty) {
    sender.innerHTML = "<strong>" + sender.propertyText + ":</strong> " + deviceProperty.value + " " + sender.propertySufix + "<br>";
}

function onUpdateInfoValueChange(sender, deviceProperty) { //means esp.updateinfo property
    

    
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
    
}




        //Firmware<>Update panel ----------------------------------------------------------------------------------------------
        /*
        if (document.getElementById("updatePropPanel") == null) {
            var updatePropPanel = basicPanel.appendChild(document.createElement('div'));
            updatePropPanel.id = "updatePropPanel";
            updatePropPanel.className = "col-md-4";
            var infoDiv = updatePropPanel.appendChild(document.createElement('div'));
            infoDiv.className = "card bg-light mb-3";
            var headerDiv = infoDiv.appendChild(document.createElement('div'));
            headerDiv.className = "card-header";
            headerDiv.innerText = getLang("update");
            var dataDiv = infoDiv.appendChild(document.createElement('div'));
            dataDiv.id = "updatePropPanelDataDiv"
            dataDiv.className = "card-body";

            addPropertyView(dataDiv, espDevice.firmwareversion, getLang("firmwareversion"));
            addPropertyView(dataDiv, espDevice.firmwarebuildnumber, getLang("firmwarebuildnumber"));
            addSpaceView(dataDiv, "5");



            //Update watcher panel 
            var updateWatcherId = "updateWatcher";
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

                networkDevice.updateinfo.addValueListner(onUpdateInfoValueChange, updateWatcherDiv);
                networkDevice.updatepossible.addValueListner(onUpdateInfoValueChange, updateWatcherDiv);
            }

        }
        else {
            var dataDiv = document.getElementById("updatePropPanelDataDiv");
        }
        */

//--------------------------------------------------------------------------------------------------------------------
function makeModalDialog(parentId, id, titleText, bodyText) {
    document.getElementById("addDevicePanel").innerHTML = ""; //TODO: remake this modal to

    var parentPanel = document.getElementById(parentId);
    parentPanel.innerHTML = "";
    var modalFade = parentPanel.appendChild(document.createElement("div"));

    modalFade.className = "modal fade";
    modalFade.id = id + "Modal";
    modalFade.tabindex = "-1";
    modalFade.setAttribute("role", "dialog");
    modalFade.setAttribute("aria-labelledby", id + "ModalLabel");
    modalFade.setAttribute("aria-hidden", "true");

    var modalDialog = modalFade.appendChild(document.createElement("div"));
    modalDialog.className = "modal-dialog";
    modalDialog.role = "document";

    var modalContent = modalDialog.appendChild(document.createElement("div"));
    modalContent.className = "modal-content";

    var modalHeader = modalContent.appendChild(document.createElement("div"));
    modalHeader.className = "modal-header";

    var modalTitle = modalHeader.appendChild(document.createElement("h5"));

    modalTitle.className = "modal-title";
    modalTitle.id = id + "ModalLabel";
    modalTitle.innerText = titleText;

    var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));

    closeHeaderButton.type = "button"
    closeHeaderButton.className = "close"
    closeHeaderButton.setAttribute("data-dismiss", "modal");
    closeHeaderButton.setAttribute("aria-label", "Close");

    var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerText = "x"

    var modalBody = modalContent.appendChild(document.createElement("div"));
    modalBody.id = id + "ModalBody"
    modalBody.className = "modal-body";
    modalBody.innerText = bodyText;

    var modalFooter = modalContent.appendChild(document.createElement("div"));
    modalFooter.id = id + "ModalFooter";
    modalFooter.className = "modal-footer";

    var closeButton = modalFooter.appendChild(document.createElement("button"));
    closeButton.type = "button";
    closeButton.className = "btn btn-sm btn-info";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.innerText = getLang("cancel");
}


//--------------------------------------------------------------------------------------------------------------------
function modalUpdateUIClick() {

    makeModalDialog("resetPanel", "update", getLang("updateunit"), getLang("areYouSure"));
    var modalFooter = document.getElementById("updateModalFooter");

    var updateButton = modalFooter.appendChild(document.createElement("button"));
    updateButton.type = "button";
    updateButton.className = "btn btn-sm btn-success";
    updateButton.id = "updateModalButton";
    updateButton.onclick = updateUIClick;
    updateButton.innerText = getLang("updateuibutton");

    $("#updateModal").modal('show');

    return false;
}

function updateUIClick(event) {

    var modalFooter = document.getElementById("updateModalFooter");
    modalFooter.removeChild(event.currentTarget);

    var modalBody = document.getElementById("updateModalBody");
    modalBody.innerHTML = "";
    var updateLog = modalBody.appendChild(document.createElement("pre"));
    updateLog.innerHTML = "Update UI started, please wait...<br>";
    updateUIAsync();

    sleep(10000).then(() => {
        getUpdateLogAsyncWithReciever(updateLogReciever, undefined, updateLog, undefined);
        return false;
    });
    return false;
}

function updateLogReciever(HTTPResult, upperReciever, sender, upperSender) {
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
}

//--------------------------------------------------------------------------------------------------------------------
function modalUpdateFirmwareClick() {

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
}

function updateFirmwareClick(event) {

    var modalFooter = document.getElementById("firmwareModalFooter");
    modalFooter.removeChild(event.currentTarget);

    var modalBody = document.getElementById("firmwareModalBody");
    modalBody.innerHTML = "";
    var updateLog = modalBody.appendChild(document.createElement("div"));
    updateLog.innerHTML = getLang("updatefirmware");
    updateFirmwareAsync();
    getUpdateLogAsyncWithReciever(updateLogReciever, undefined, updateLog, undefined);


    sleep(30000).then(() => {
        location.reload();
        return false;
    });


    return false;
}

function updateLogReciever(HTTPResult, upperReciever, sender, upperSender) {
    if (!HTTPResult.startsWith("%error")) {
        sender.innerHTML = "Update log:<br>" + HTTPResult;
    }
    else {
        sender.innerHTML += "HTTP client - " + HTTPResult;
    }
}


//--------------------------------------------------------------------------------------------------------------------
function modalResetClick(event) {

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
}
//--------------------------------------------------------------------------------------------------------------------

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


function resetClick(event) {
    reset(event.currentTarget.deviceHost);

    sleep(5000).then(() => {
        location.reload();
        return false;
    });
}

function refreshDevices() {
    for (var node in webProp.nodes) {
        devices.refresh(webProp.nodes[node]);
    }
}

/*


function refreshDevicesAsync() {
    if (document.getElementById("autorefreshbutton").data === "on") {
        refresh();
    }
    else {
        //requestUnitProperties();
        //requestDevicesProperties();
        // requestFilesList();
        renderMainPageDevices();

    }

    //TEMPORARY 
    for (var node in webProp.nodes) {
        devices.refresh(webProp.nodes[node]);
    }



}

function refreshUnitAsync() {
    renderMainPageUnit();
}

function lcdButtonClick(event) {
    event.stopPropagation();
    var lcdButton = event.target;

    lcdButton.value = "Do..."
    var httpResult = setDeviceProperty(lcdButton.lcdid, "text", lcdButton.edit.value);
    if (httpResult === "1") {
        lcdButton.value = "Send"
    }
    else {
        lcdButton.value = "Bad"
    }

    return true;
}

function clearButtonClick(event) {
    event.stopPropagation();
    var clearButton = event.target;

    clearButton.value = "Do..."
    var httpResult = setDeviceProperty(clearButton.lcdid, "clear", "1") && setDeviceProperty(clearButton.lcdid, "text", "");
    if (httpResult === "1") {
        clearButton.edit.value = "";
        clearButton.value = "Clear"
    }
    else {
        clearButton.value = "Bad"
    }

    return true;
}


function autoRefreshClick(event) {
    var button = event.target;
    if (button.data === "on") {
        button.className = "badge badge-default";
        button.data = "off";
        button.innerHTML = getLang("autorefreshoff");
    }
    else {
        button.className = "badge badge-warning";
        button.data = "on";
        button.innerHTML = getLang("autorefreshon");
    }
    refresh();

    return false;
}

function refreshClick(event) {
    refresh();
    return false;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function topositionClick() {
    var button = event.target;
    setDevicePropertyAsync(button.stepperid, "toposition", button.toposition);
    return false;
}
*/
