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

var nodeId;
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
var runOnce = true;

var sideBar = undefined;

function testHTTPS() {
    httpGetAsyncWithReciever("http://192.168.1.5/", HTTPSResult, null);
    //httpGetAsyncWithReciever("https://192.168.1.5/", HTTPSResult, null);
}

function HTTPSResult (httpResult, node) {
    //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произошел TimeOut
    if (!httpResult.indexOf("%error") == 0) {
        

    }
    else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
    }
}




$(document).ready(function () {

    if (!runOnce) return;
    runOnce = false;

    addToLogNL("OK loading scripts");
    addToLogNL("[START]", 1);


    //!!connection test 
    
    setInterval(testHTTPS, 100);

    return; 
    //-----------------

    //setup UX color theme 
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

    if (theme.primary === '') { //default dark UX theme 
        theme.primary = '#3A3F44';
        theme.secondary = '#7A8288';
        theme.success = '#62c462';
        theme.info = '#5bc0de';
        theme.warning = '#f89406';
        theme.danger = '#ee5f5b';
        theme.light = '#e9ecef';
        theme.dark = '#272B30';
    }
    //widget theme
    widgetsTheme.primary = '#89c2dc';
    widgetsTheme.secondary = '#3589b1';
    widgetsTheme.success = '#3b99c4';
    widgetsTheme.info = '#62add0';
    widgetsTheme.warning = '#c43b5d';
    widgetsTheme.danger = '#ee5f5b';
    widgetsTheme.light = '#e9ecef';
    widgetsTheme.dark = '#272B30';


    addToLogNL("Connection to master node " + boardhost + "...");
    //use it as node ping
    httpGetAsyncWithReciever(boardhost + "getalldriversproperties", onNodeAnswer, null, null, null, 20000);
}
);

function onNodeAnswer(httpResult) {
    if (!httpResult.indexOf("%error") == 0) {
        addToLogNL("get UI configuration...");
        config.load(onLoadConfig);
    }
    else {
        status_online = NET_OFFLINE;
        speak("ERROR with host: " + boardhost);
        addToLogNL("ERROR with host: " + boardhost, 2);
        var masterNodeDialog = createModalDialog(getLang("addnodeheader"), "");
        masterNodeDialog.appendInput(createDialogInput("masterhost", getLang("addnodehost"), "http://host:port/ or https://host:port/"));
        masterNodeDialog.getChild("masterhost").value = boardhost;
        masterNodeDialog.onOK = masterNodeDialogOKClick;
        masterNodeDialog.show();
    }
}

function masterNodeDialogOKClick(masterNodeDialog) {

    var input = masterNodeDialog.getChild("masterhost");

    if (input.value.length == 0) {
        masterNodeDialog.errorLabel.innerText = getLang("addnodeerror_hostempty");
        return false;
    }

    if (input.value.indexOf("http") != 0) {
        input.value = "http://" + input.value;
    }

    var regexp = RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})");

    if (!input.value.match(regexp)) {
        masterNodeDialog.errorLabel.innerText = getLang("addnodeerror_hostnoturl");
        return false;
    }

    if (input.value.slice(-1) !== '/') {
        input.value += '/';
    }

    boardhost = input.value;
    addToLogNL("Connection to master node " + boardhost + "...");
    //use it as ping
    httpGetAsyncWithReciever(boardhost + "getalldriversproperties", onNodeAnswer, null, null, null, 5000);
    return true;
}

function onLoadConfig(result) {
    try {
        if (result) {
            sideBar = createSidebar();
            

            settingsUI.onConfigLoad(configProperties);
            dashboardUI.onConfigLoad(configProperties);

            status_online = NET_ONLINE;
            speak("OWLOS is started");

            addToLogNL(getLang("prepareUnit"));

            scriptsManager.onNew = scriptsUI.onScriptNew;
            scriptsManager.onChange = scriptsUI.onScriptChange;
            scriptsManager.onDelete = scriptsUI.onScriptDelete;

            drivers.addDriverLoadedListner(settingsUI.onDriverLoaded, settingsUI);
            
            var boot = document.getElementById("boot");
            boot.parentElement.removeChild(boot);
            document.getElementById("consolePanel").appendChild(boot);

            sidebarItemClick({currentTarget: sideBar.dashboardItem.href});
            
            speak("OWLOS is ready");
        }
        else {
            status_online = NET_OFFLINE;
            speak("ERROR with host: " + boardhost);
            addToLogNL("ERROR with host: " + boardhost, 2);
            config.restoreDefault();
        }
    }
    catch (exception) {
        status_online = NET_OFFLINE;
        addToLogNL("ERROR starting exception: " + exception, 2);
        addToLogNL("ERROR delete configurations files can help fix it: [your host]/deletefile?name=web.config", 2);
    }
}

function nodesRefresh() {
    /*
    for (var node in configProperties.nodes) {
        drivers.refresh(configProperties.nodes[node]);
        pins.refresh(configProperties.nodes[node]);
        driverPins.refresh(configProperties.nodes[node]);
        accessableDrivers.refresh(configProperties.nodes[node]);
        scriptsManager.refresh(configProperties.nodes[node]);
    }
    */
}

function sleep(time) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
}
