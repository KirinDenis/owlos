var unitId;
var nodesRefreshHandle;
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


    addToLogNL("get UI configuration...");
    config.addChangeListner(settingsUI.onConfigChange, settingsUI);
    if (config.load()) {
        status_online = NET_ONLINE;
        speak("OWL OS is started");


        document.getElementById("home-tab").innerText = getLang("homeTab");
        document.getElementById("settings-tab").innerText = getLang("settingsTab");
        document.getElementById("console-tab").innerText = getLang("consoleTab");

        addToLogNL(getLang("prepareUnit"));



        devices.addDeviceLoadedListner(settingsUI.onDeviceLoaded, settingsUI);        
        nodesRefresh();

        dashboardUI.initDashboard();
               
        document.getElementById("mainContainer").style.display = "block";
        var boot = document.getElementById("boot");
        boot.parentElement.removeChild(boot);
        document.getElementById("consolePanel").appendChild(boot);

        nodesRefreshHandle = setInterval(nodesRefresh, 10000);

        //$('#sidebarCollapse').on('click', function () {
        //    $('#sidebar').toggleClass('active');
        //});

        speak("OWL OS is ready");
    }
    else {
        status_online = NET_OFFLINE;
        speak("ERROR with host: " + host);
        addToLogNL("ERROR with host: " + host, 2);
    }
    
});

function nodesRefresh() {
    for (var node in configProperties.nodes) {
        devices.refresh(configProperties.nodes[node]);
    }
}

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



