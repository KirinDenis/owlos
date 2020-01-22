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

    jQuery.readyException = function (error) {
        addToLogNL("jQuery error: " + error, 2);
    };

    $(document).ajaxError(function (event, request, settings) {
        addToLogNL("Ajax error: " + settings.url, 2);
    });

    /*
    window.onresize = function (event) {
        var width = window.screen.availWidth;
        var height = window.screen.availHeight;

        var content = document.getElementById("content");
        content.style.width = (width - 300) + "px";

        
    };
    */

    var style = window.getComputedStyle(document.body, null);    
    theme.primary = style.getPropertyValue('--primary');
    theme.secondary = style.getPropertyValue('--secondary');
    theme.success = style.getPropertyValue('--success');
    theme.info = style.getPropertyValue('--info');
    theme.warning = style.getPropertyValue('--warning');
    theme.danger = style.getPropertyValue('--danger');
    theme.light = style.getPropertyValue('--light');
    theme.dark = style.getPropertyValue('--dark');
    theme.fontFamily = style.fontFamily;

    if (theme.primary === '') { //default dark
        theme.primary = '#3A3F44';
        theme.secondary = '#7A8288';
        theme.success = '#62c462';
        theme.info = '#5bc0de';
        theme.warning = '#f89406';
        theme.danger = '#ee5f5b';
        theme.light = '#e9ecef';
        theme.dark = '#272B30';
    }

    

    addToLogNL("get UI configuration...");
    try {
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

            $('#sidebarCollapse').on('click', function () {
               $('#sidebar').toggleClass('active');
            });

            speak("OWL OS is ready");
        }
        else {
            status_online = NET_OFFLINE;
            speak("ERROR with host: " + host);
            addToLogNL("ERROR with host: " + host, 2);
    }


}


    catch (exception) {
        status_online = NET_OFFLINE;
        addToLogNL("ERROR starting exception: " + exception, 2);
        addToLogNL("ERROR delete configurations files can help fix it: [your host]/deletefile?name=web.config", 2);
    }
   }
);

function nodesRefresh() {
    for (var node in configProperties.nodes) {
        devices.refresh(configProperties.nodes[node]);
    }
}

function sleep(time) {

    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
    /*
    return new Promise((resolve) => setTimeout(resolve, time));
    */
}

function resetClick(event) {
    reset(event.currentTarget.deviceHost);

    sleep(5000).then(function () {
        location.reload();
        return false;
    });

    /*
    sleep(5000).then(() => {
        location.reload();
        return false;
    });
    */
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
    closeHeaderButton.id = id + "closeHeaderButton";
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
    closeButton.id = id + "closeButton";
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Объект создает таблицы отображающе свойства устройств
// Реализован упрощенно, для работы в паре с devices парсером - не запоминает ссылкии на созданные таблицы - подразумевается что таблицы и строки 
// будут создаваться в той же последовательности в которой парястся устройства - device1, prop1, prop2...propN, device2, prop1, prop2...propN...DeviceN...
function createValueEdit(parentElement, propertyName, propertyValue, propertyType) {
    var edit = "";

    if (!propertyType.indexOf("r") != -1) {
        if (propertyType.indexOf("b") != -1) //boolean
        {
            edit = parentElement.appendChild(document.createElement('select'));
            edit.className = "form-control form-control-sm";
            edit.style.width = "100%";
            var valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "true";
            valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "false";
            if (propertyValue === "1") edit.selectedIndex = 0; else edit.selectedIndex = 1;
        } else {
            edit = parentElement.appendChild(document.createElement('input'));
            edit.className = "form-control form-control-sm";

            if (propertyType.indexOf("p") != -1) //password
            {
                edit.type = "password";
                edit.placeholder = "Password";
            }

            if (propertyType.indexOf("i") != -1) //integer
            {
                edit.type = "number";
            }

            if (propertyType.indexOf("f") != -1) //float
            {
                edit.type = "number";
                edit.step = "0.01";
            }

            edit.style.width = "100%";
            edit.value = propertyValue;
        }

        if (propertyType.indexOf("s") != -1) //selected
        {
            edit.style.backgroundColor = "#FAFAF0";
        }

        edit.id = "propValueInput_" + propertyName;
        edit.propname = propertyName;
        edit.propvalue = propertyValue; //default

        edit.proptype = propertyType;
    }

    return edit;
}


