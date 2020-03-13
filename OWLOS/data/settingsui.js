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

    onConfigLoad: function (configProperties) {

        if (configProperties.nodes.length == 0) return;

        var nodesSideBar = document.getElementById("settingsSideBarUl");
        //  nodesSideBar.style.background = theme.primary;

        //add addNodeNavItem first --------------------------------------------------
        if (document.getElementById("addNodeNavItem") == undefined) {

            var nodeNavItem = nodesSideBar.appendChild(document.createElement("li"));
            nodeNavItem.className = "nav-item";
            nodeNavItem.id = "addNodeNavItem";
            var nodeHRef = nodeNavItem.appendChild(document.createElement("a"));
            nodeHRef.className = "nav-link";
            nodeHRef.style.color = theme.warning;
            nodeHRef.parentLi = nodeLi;
            //nodeHRef.style.color = theme.success;
            nodeHRef.setAttribute("data-toggle", "tab");
            nodeHRef.onclick = settingsUI.addNodeClick;
            nodeHRef.innerHTML = getLang("addnode");
            nodeHRef.href = "#home";

            //панель не видна, она существует для организии SideBar, сами панели со свойствами драйвер сделаны на основе navBar - так сложилось исторически, SideBar только переключает их
            var nodePropAnchors = document.getElementById("nodePropAnchors");
            //NavTabs панель для панелей со свойствами нод
            var nodePropNavBar = nodePropAnchors.appendChild(document.createElement("ul"));
            nodePropNavBar.style.height = "0px";
            nodePropNavBar.id = "nodePropNavBar";
            nodePropNavBar.className = "nav nav-tabs";
        }

        for (var nodeKey in configProperties.nodes) {
            var node = configProperties.nodes[nodeKey];
            if (document.getElementById("nodeNavItem" + node.nodenickname) == undefined) {
                var nodeLi = nodesSideBar.appendChild(document.createElement("li"));
                nodeLi.id = "nodeNavItem" + node.nodenickname;
                nodeLi.node = node;

                var nodeAhref = nodeLi.appendChild(document.createElement("a"));
                nodeAhref.href = "#" + node.nodenickname + "submenu";
                nodeAhref.setAttribute("data-toggle", "collapse");
                nodeAhref.setAttribute("aria-expanded", "false");
                nodeAhref.innerHTML = node.nodenickname;
                nodeAhref.id = node.nodenickname + "ahref";


                //nodeAhref.onclick = settingsUI.driverAnchorClick;
                nodeAhref.parentLi = nodeLi;
                nodeAhref.node = node;
                node.addNetworkStatusListner(settingsUI.onNetworkChange, nodeAhref);
                var nodeSubmenuUl = nodeLi.appendChild(document.createElement("ul"));

                nodeLi.nodeSubmenuUl = nodeSubmenuUl;
                nodeSubmenuUl.className = "collapse list-unstyled";
                nodeSubmenuUl.id = node.nodenickname + "submenu";



                //Node Tab panel ----------------------
                var nodePanelNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                nodePanelNavItem.className = "nav-item";
                var nodePanelHRef = nodePanelNavItem.appendChild(document.createElement("a"));
                nodePanelHRef.id = node.nodenickname + "nodePropsHref";
                nodePanelHRef.className = "nav-link";
                nodePanelHRef.parentLi = nodeLi;
                //nodePanelHRef.style.color = theme.warning;
                nodePanelHRef.setAttribute("data-toggle", "tab");
                nodePanelHRef.onclick = settingsUI.driverAnchorClick;
                nodePanelHRef.innerText = getLang("nodeproperties");
                nodePanelHRef.href = "#" + node.nodenickname + "nodePropsPanel";
                nodePanelHRef.node = node;
                var nodesPropsPanel = document.getElementById("nodesPropsPanel");

                //--- nodePropsPanel ---------------------------------------------------------------------------
                //панель для панелей с быстрым доступам к основным свойствам ноды
                var nodePropsPanel = nodesPropsPanel.appendChild(document.createElement('div'));
                nodePropsPanel.className = "tab-pane fade";
                nodePropsPanel.id = node.nodenickname + "nodePropsPanel";
                nodeAhref.nodefadepanel = nodePropsPanel;

                var nodePropHolderPanel = nodePropsPanel.appendChild(document.createElement('div'));
                nodePropHolderPanel.id = node.nodenickname + "bodePropHoder";
                nodePropHolderPanel.className = "row";

                //подготавливаем панели со свойствами ноды (для каждой ноды своя панель id = node.nodenickname + "nodePropPanel")
                //смотрите обработчик события onDriverLoaded() - он запоняет эту панель
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "NetworkNodeProp", getLang("networknodeprop"), 12);
                var networkNodePropBody = document.getElementById(node.nodenickname + "NetworkNodePropBody");
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody1", 4);
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody2", 4);
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody3", 4);

                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "WifiNodeProp", getLang("wifinodeprop"), 4); //WifiNodePropPanel - свойства WiFi                
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "SystemNodeProp", getLang("systemnodeprop"), 4);
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "UpdateNodeProp", getLang("updatenodeprop"), 4);


                //--- EndOf nodePropsPanel ---------------------------------------------------------------------------



                //restful items main menu ----------------------
                var RESTfulNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                RESTfulNavItem.className = "nav-item";
                RESTfulNavItem.id = node.nodenickname + "restfulsubmenu2";

                var RESTfulAhref = RESTfulNavItem.appendChild(document.createElement("a"));
                RESTfulAhref.setAttribute("data-toggle", "collapse");
                RESTfulAhref.parentLi = RESTfulNavItem;
                RESTfulAhref.href = "#" + node.nodenickname + "restfulsubmenu";
                RESTfulAhref.node = node;

                RESTfulAhref.appendChild(document.createElement("i")).className = "fa fa-cog";
                var RESTfulAhrefSpan = RESTfulAhref.appendChild(document.createElement("span"));
                RESTfulAhrefSpan.className = "menu-text";
                RESTfulAhrefSpan.innerHTML = "<b>" + getLang("RESTful") + "</b>";

                RESTfulAhrefSpan = RESTfulAhref.appendChild(document.createElement("span"));
                RESTfulAhrefSpan.className = "badge badge-pill badge-warning";
                RESTfulAhrefSpan.id = node.nodenickname + "RESTfulAhrefDriverCountSpan";
                RESTfulAhrefSpan.innerHTML = "0";
                RESTfulAhrefSpan.driversCount = 0;


                var RESTfulSubmenuUl = RESTfulNavItem.appendChild(document.createElement("ul"));
                RESTfulSubmenuUl.className = "collapse list-unstyled";
                RESTfulSubmenuUl.id = node.nodenickname + "restfulsubmenu";

                //Add driver submenuitem ----------------
                var driverNavItem = RESTfulSubmenuUl.appendChild(document.createElement("li"));
                driverNavItem.className = "nav-item";
                var driverHRef = driverNavItem.appendChild(document.createElement("a"));
                driverHRef.className = "nav-link";
                driverHRef.style.color = theme.warning;
                driverHRef.parentLi = nodeLi;
                //driverHRef.style.color = theme.success;
                driverHRef.setAttribute("data-toggle", "tab");
                driverHRef.onclick = driversUI.addDriverClick;
                driverHRef.innerHTML = getLang("adddriver");
                driverHRef.href = "#home";
                driverHRef.node = node;


                //аdd script submenuitem ------------------
                var scriptsNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                scriptsNavItem.className = "nav-item";
                var scriptsAhref = scriptsNavItem.appendChild(document.createElement("a"));
                scriptsAhref.className = "nav-link";
                scriptsAhref.parentLi = nodeLi;
                //filesHRef.style.color = theme.warning;
                scriptsAhref.setAttribute("data-toggle", "collapse");
                scriptsAhref.onclick = settingsUI.driverAnchorClick;
                scriptsAhref.href = "#" + node.nodenickname + "scriptssubmenu";
                scriptsAhref.node = node;

                scriptsAhref.appendChild(document.createElement("i")).className = "fa fa-bolt";

                var scriptsAhrefSpan = scriptsAhref.appendChild(document.createElement("span"));
                scriptsAhrefSpan.className = "menu-text";
                scriptsAhrefSpan.innerHTML = "<b>" + getLang("scripts") + "</b>";

                scriptsAhrefSpan = scriptsAhref.appendChild(document.createElement("span"));
                scriptsAhrefSpan.className = "badge badge-pill badge-warning";
                scriptsAhrefSpan.id = node.nodenickname + "scriptsAhrefDriverCountSpan";
                scriptsAhrefSpan.innerHTML = "0";
                scriptsAhrefSpan.driversCount = 0;


                var scriptsSubmenuUl = scriptsNavItem.appendChild(document.createElement("ul"));
                scriptsSubmenuUl.className = "collapse list-unstyled";
                scriptsSubmenuUl.id = node.nodenickname + "scriptssubmenu";

                //+add script submenu item 
                var scriptsAddLi = scriptsSubmenuUl.appendChild(document.createElement("li"));
                scriptsAddLi.className = "nav-item";

                var scriptsAddAhref = scriptsAddLi.appendChild(document.createElement("a"));
                scriptsAddAhref.id = node.nodenickname + "scriptaddahref";
                scriptsAddAhref.className = "nav-link";
                scriptsAddAhref.style.color = theme.warning;
                scriptsAddAhref.setAttribute("data-toggle", "tab");
                scriptsAddAhref.href = "#";
                scriptsAddAhref.node = node; //привязываем пункт меню к ноде 
                scriptsAddAhref.innerHTML = getLang("createscript");
                scriptsAddAhref.onclick = settingsUI.createScriptClick;
                scriptsAddAhref.parentLi = scriptsAddLi; //сохраняем родительский driverId

                scriptsManager.onNew = settingsUI.onScriptNew;
                scriptsManager.onChange = settingsUI.onScriptChange;
                scriptsManager.onDelete = settingsUI.onScriptDelete;



                //Add files submenuitem ------------------
                var filesNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                filesNavItem.className = "nav-item";
                var filesHRef = filesNavItem.appendChild(document.createElement("a"));
                filesHRef.className = "nav-link";
                filesHRef.parentLi = nodeLi;
                //filesHRef.style.color = theme.warning;
                filesHRef.setAttribute("data-toggle", "tab");
                filesHRef.onclick = settingsUI.driverAnchorClick;
                filesHRef.innerText = getLang("files");
                filesHRef.href = "#" + node.nodenickname + "filesfadepanel";
                filesHRef.node = node;

                //new files tab ----------------
                var nodesPropsPanel = document.getElementById("nodesPropsPanel");
                var filesDiv = nodesPropsPanel.appendChild(document.createElement('div'));
                filesDiv.className = "tab-pane fade";
                filesDiv.id = node.nodenickname + "filesfadepanel";
                filesHRef.filesList = new FilesList(filesDiv, node);



                // add Node Status Panel ---------------------------------------------
                var nodeStatusPanel = document.createElement("div");
                nodeStatusPanel.id = node.nodenickname + "nodestatuspanel";
                nodeAhref.nodeStatusPanel = nodeStatusPanel;

                nodeAhref.onlinePanel = settingsUI.getStatusWidget(node.nodenickname + "onlineStatus", "Online", nodeStatusPanel);

                node.addNetworkStatusListner(settingsUI.onOnlineStatusChange, nodeAhref.onlinePanel);
                nodeAhref.WiFiAPPanel = settingsUI.getStatusWidget(node.nodenickname + "wifiapStatus", "WiFi AP", nodeStatusPanel);

                nodeAhref.WiFiSTPanel = settingsUI.getStatusWidget(node.nodenickname + "wifistStatus", "WiFi ST", nodeStatusPanel);
                nodeAhref.RESTfulPanel = settingsUI.getStatusWidget(node.nodenickname + "restfulStatus", "RESTful", nodeStatusPanel);
                nodeAhref.MQTTPanel = settingsUI.getStatusWidget(node.nodenickname + "mqttStatus", "MQTT", nodeStatusPanel);
                nodeAhref.OTAPanel = settingsUI.getStatusWidget(node.nodenickname + "otaStatus", "OTA", nodeStatusPanel);

                document.getElementById("nodeStatusPanel").appendChild(nodeStatusPanel);

                var nodeStatusPanelText = document.createElement("div");
                nodeStatusPanelText.innerHTML = " <strong>" + node.nodenickname + "</strong> at <a href='" + node.host + "' target='_blank'>" + node.host + "</a>";
                document.getElementById("nodeStatusPanelText").appendChild(nodeStatusPanelText);

                nodeStatusPanel.nodeStatusPanelText = nodeStatusPanelText;
                nodeStatusPanel.style.display = "none";
                nodeStatusPanelText.style.display = "none";
            }
        }
    },

    onScriptNew: function (script) {
        var scriptsSubmenuUl = document.getElementById(script.node.nodenickname + "scriptssubmenu");
        if (scriptsSubmenuUl == undefined) return;

        var scriptsLi = scriptsSubmenuUl.appendChild(document.createElement("li"));
        scriptsLi.id = script.node.nodenickname + "_" + script.name + "li";
        scriptsLi.className = "nav-item";

        var scriptsAhref = scriptsLi.appendChild(document.createElement("a"));
        scriptsAhref.id = script.node.nodenickname + "_" + script.name + "scriptahref";
        scriptsAhref.className = "nav-link";
        scriptsAhref.setAttribute("data-toggle", "tab");
        scriptsAhref.href = "#" + script.node.nodenickname + "_" + script.name + "panel"; //якорь на панель 
        scriptsAhref.node = script.node; //привязываем пункт меню к ноде 
        scriptsAhref.innerText = script.name;
        scriptsAhref.onclick = settingsUI.driverAnchorClick; //обработчик клика на пунк меню (переключение панелей)
        scriptsAhref.parentLi = scriptsLi; //сохраняем родительский driverId
        scriptsLi.scriptsAhref = scriptsAhref;

        switch (parseInt(script.status)) {
            case stopScriptStatus: scriptsAhref.style.color = ""; break;
            case runScriptStatus: scriptsAhref.style.color = theme.success; break;
            case compilerScriptErrorStatus: scriptsAhref.style.color = theme.warning; break;
            default:
                scriptsAhref.style.color = theme.danger; break;
        }


        //Script panel 
        var nodesPropsPanel = document.getElementById("nodesPropsPanel");
        var scriptTab = nodesPropsPanel.appendChild(document.createElement('div'));
        scriptTab.id = script.node.nodenickname + "_" + script.name + "panel";
        scriptTab.className = "tab-pane fade md-form";
        scriptsLi.panel = scriptTab;

        var scriptHolder = scriptTab.appendChild(document.createElement('div'));
        scriptHolder.className = "row";

        var byteCodeCardDiv = scriptHolder.appendChild(document.createElement('div'));
        byteCodeCardDiv.className = "col-md-8";
        var byteCodeCard = byteCodeCardDiv.appendChild(document.createElement('div'));
        byteCodeCard.className = "card text-white bg-primary mb-3";
        var byteCodeCardHeader = byteCodeCard.appendChild(document.createElement('div'));
        byteCodeCardHeader.className = "card-header";
        byteCodeCardHeader.innerText = script.name + " script bytecode";
        var byteCodeCardBody = byteCodeCard.appendChild(document.createElement('div'));
        byteCodeCardBody.className = "card-body";
        var pre = byteCodeCardBody.appendChild(document.createElement('pre'));
        var textArea = pre.appendChild(document.createElement('textarea'));
        textArea.id = script.node.nodenickname + "_" + script.name + "textarea";
        textArea.className = "md-textarea form-control";
        textArea.placeholder = getLang("inputcodehere");
        textArea.cols = 80;
        textArea.rows = 20;
        textArea.value = script.bytecode;
        textArea.onkeydown = settingsUI.textAreaOnKeyDown;

        var scriptExecuteButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptExecuteButton.type = "button";
        scriptExecuteButton.id = script.node.nodenickname + "_" + script.name + "executionButton";
        scriptExecuteButton.className = "btn btn-sm btn-success";
        scriptExecuteButton.script = script;
        scriptExecuteButton.textArea = textArea;
        scriptExecuteButton.labels = label;
        scriptExecuteButton.onclick = settingsUI.scriptExecuteClick;
        scriptExecuteButton.appendChild(document.createElement("i")).className = "fa fa-bolt";
        var scriptExecuteButtonSpan = scriptExecuteButton.appendChild(document.createElement("span"));
        scriptExecuteButtonSpan.innerHTML = " " + getLang("scriptexecute");

        textArea.scriptExecuteButton = scriptExecuteButton;

        var scriptPauseButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptPauseButton.type = "button";
        scriptPauseButton.id = script.node.nodenickname + "_" + script.name + "pauseButton";
        scriptPauseButton.className = "btn btn-sm btn-warning";
        scriptPauseButton.script = script;
        scriptPauseButton.node = script.node; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptPauseButton.scriptExecuteButton = scriptExecuteButton;
        scriptPauseButton.textArea = textArea;
        scriptPauseButton.labels = label;
        scriptPauseButton.onclick = settingsUI.scriptPauseClick;
        scriptPauseButton.appendChild(document.createElement("i")).className = "fa fa-pause";
        var scriptPauseButtonSpan = scriptPauseButton.appendChild(document.createElement("span"));
        scriptPauseButtonSpan.innerHTML = " " + getLang("scriptpause");

        scriptExecuteButton.scriptPauseButton = scriptPauseButton;

        var scriptDebugButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptDebugButton.type = "button";
        scriptDebugButton.id = script.node.nodenickname + "_" + script.name + "pauseButton";
        scriptDebugButton.className = "btn btn-sm btn-warning";
        scriptDebugButton.script = script;
        scriptDebugButton.node = script.node;
        scriptDebugButton.scriptExecuteButton = scriptExecuteButton;
        scriptDebugButton.textArea = textArea;
        scriptDebugButton.labels = label;
        scriptDebugButton.onclick = settingsUI.scriptDebugClick;
        scriptDebugButton.appendChild(document.createElement("i")).className = "fa fa-bug";
        scriptDebugButton.debugNext = false;
        var scriptDebugButtonSpan = scriptDebugButton.appendChild(document.createElement("span"));
        scriptDebugButtonSpan.innerHTML = " " + getLang("scriptstartdebug");

        var scriptDeleteButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptDeleteButton.type = "button";
        scriptDeleteButton.id = script.node.nodenickname + "_" + script.name + "deleteButton";
        scriptDeleteButton.className = "btn btn-sm btn-danger";
        scriptDeleteButton.script = script;
        scriptDeleteButton.node = script.node; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptDeleteButton.scriptExecuteButton = scriptExecuteButton;
        scriptDeleteButton.scriptPauseButton = scriptPauseButton;
        scriptDeleteButton.textArea = textArea;
        scriptDeleteButton.labels = label;
        scriptDeleteButton.onclick = settingsUI.scriptDeleteClick;
        scriptDeleteButton.appendChild(document.createElement("i")).className = "fa fa-trash";
        var scriptDeleteButtonSpan = scriptDeleteButton.appendChild(document.createElement("span"));
        scriptDeleteButtonSpan.innerHTML = " " + getLang("scriptdelete");


        scriptExecuteButton.scriptDeleteButton = scriptDeleteButton;

        var label = byteCodeCardDiv.appendChild(document.createElement('label'));
        label.id = script.node.nodenickname + "_" + script.name + "label";
        label.for = script.node.nodenickname + "_" + script.name + "textarea";
        scriptExecuteButton.label = label;

        var scriptStatusCardDiv = scriptHolder.appendChild(document.createElement('div'));
        scriptStatusCardDiv.className = "col-md-4";
        var scriptStatusCard = scriptStatusCardDiv.appendChild(document.createElement('div'));
        scriptStatusCard.className = "card text-white bg-primary mb-3";
        var scriptStatusCardHeader = scriptStatusCard.appendChild(document.createElement('div'));
        scriptStatusCardHeader.className = "card-header";
        scriptStatusCardHeader.innerText = script.name + " status";
        var scriptStatusCardBody = scriptStatusCard.appendChild(document.createElement('div'));
        scriptStatusCardBody.className = "card-body";
        var scriptStatusPre = scriptStatusCardBody.appendChild(document.createElement('pre'));
        var statusLabel = scriptStatusPre.appendChild(document.createElement('label'));
        statusLabel.id = script.node.nodenickname + "_" + script.name + "statuslabel";
        settingsUI.buildScriptStatus(script);

    },

    onScriptChange: function (script) {
        var scriptsAhref = document.getElementById(script.node.nodenickname + "_" + script.name + "scriptahref");
        if (scriptsAhref == undefined) return;
        scriptsAhref.innerText = script.name;

        switch (parseInt(script.status)) {
            case stopScriptStatus: scriptsAhref.style.color = ""; break;
            case runScriptStatus: scriptsAhref.style.color = theme.success; break;
            case compilerScriptErrorStatus: scriptsAhref.style.color = theme.warning; break;
            default:
                scriptsAhref.style.color = theme.danger; break;
        }


        var textArea = document.getElementById(script.node.nodenickname + "_" + script.name + "textarea");
        var label = document.getElementById(script.node.nodenickname + "_" + script.name + "label");
        if (textArea.value !== script.bytecode) {
            if (textArea === document.activeElement) {
                label.style.color = theme.danger;
                label.innerHTML = "script: " + script.name + " Warning: changed outside or not save";
            }
            else {
                label.innerHTML = "script: " + script.name;
                label.style.color = "";
                textArea.value = script.bytecode;
            }
        }
        settingsUI.buildScriptStatus(script);
        if (script.status == debugScriptStatus) {
            settingsUI.selectCodeLine(textArea, script.debuglinenumber);
        }
    },

    //https://stackoverflow.com/questions/13650534/how-to-select-line-of-text-in-textarea
    selectCodeLine: function selectTextareaLine(tarea, lineNum) {
        lineNum--; // array starts at 0
        var lines = tarea.value.split("\n");

        // calculate start/end
        var startPos = 0, endPos = tarea.value.length;
        for (var x = 0; x < lines.length; x++) {
            if (x == lineNum) {
                break;
            }
            startPos += (lines[x].length + 1);

        }

        var endPos = lines[lineNum].length + startPos;

        // do selection
        // Chrome / Firefox

        if (typeof (tarea.selectionStart) != "undefined") {
            tarea.focus();
            tarea.selectionStart = startPos;
            tarea.selectionEnd = endPos;
            return true;
        }

        // IE
        if (document.selection && document.selection.createRange) {
            tarea.focus();
            tarea.select();
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveEnd("character", endPos);
            range.moveStart("character", startPos);
            range.select();
            return true;
        }

        return false;
    },

    scriptDebugClick: function (event) {
        var scriptDebugButton = event.currentTarget;
        if (scriptDebugButton.debugNext == false) {
            scriptDebugButton.debugNext = true;
            scriptsManager.startDebug(scriptDebugButton.script);
        }
        else {
            scriptsManager.debugNext(scriptDebugButton.script);
            
        }
    },

    buildScriptStatus: function (script) {
        var statusLabel = document.getElementById(script.node.nodenickname + "_" + script.name + "statuslabel");
        statusLabel.innerHTML = "<b>Status: </b>" + script.status + "\n" +
            "<b>debuglinenumber: </b>" + script.debuglinenumber + "\n" +
            "<b>codecount: </b>" + script.codecount + "\n" +
            "<b>datacount: </b>" + script.datacount + "\n" +
            "<b>timequant: </b>" + script.timequant + "\n" +
            "<b>ip: </b>" + script.ip + "\n" +
            "<b>variables: </b>" + script.variables;
    },

    onScriptDelete: function (script) {
        var scriptsLi = document.getElementById(script.node.nodenickname + "_" + script.name + "li");
        scriptsLi.parentElement.removeChild(scriptsLi);
        scriptsLi.innerHTML = "";

        var scriptsPanel = document.getElementById(script.node.nodenickname + "_" + script.name + "panel");
        scriptsPanel.parentElement.removeChild(scriptsPanel);
        scriptsPanel.innerHTML = "";

        var scriptsSubmenuUl = document.getElementById(script.node.nodenickname + "scriptssubmenu");
        for (childKey in scriptsSubmenuUl.childNodes) {
            var scriptsLi = scriptsSubmenuUl.childNodes[childKey];
            if (scriptsLi.scriptsAhref != undefined) {
                var event = {
                    currentTarget: scriptsLi.scriptsAhref
                }
                settingsUI.driverAnchorClick(event);
                $(scriptsLi.scriptsAhref).toggleClass("active");
                $(scriptsLi.panel).toggleClass("active show");
                return;
            }
        }

        var nodePanelHRef = document.getElementById(script.node.nodenickname + "nodePropsHref");
        var nodePropsPanel = document.getElementById(script.node.nodenickname + "nodePropsPanel");
        var event = {
            currentTarget: nodePanelHRef
        }
        settingsUI.driverAnchorClick(event);
        $(nodePanelHRef).toggleClass("active");
        $(nodePropsPanel).toggleClass("active show");
    },
    //https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
    textAreaOnKeyDown: function (event) {
        var keyCode = event.keyCode || event.which;
        var textArea = event.currentTarget;

        if (keyCode == 0x09) { //tab key code
            event.preventDefault();
            var start = textArea.selectionStart;
            var end = textArea.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            $(textArea).val($(textArea).val().substring(0, start)
                + "\t"
                + $(textArea).val().substring(end));

            // put caret at right position again
            textArea.selectionStart =
                textArea.selectionEnd = start + 1;
        }
        else
            if (keyCode == 0x77) { //F8
                event = {
                    currentTarget: textArea.scriptExecuteButton
                }
                settingsUI.scriptExecuteClick(event);
            }

    },

    scriptExecuteClick: function (event) {
        var scriptExecuteButton = event.currentTarget;
        scriptExecuteButton.className = "btn btn-sm btn-secondary";
        var textArea = scriptExecuteButton.textArea;
        var script = scriptExecuteButton.script;
        script.bytecode = textArea.value;

        var scriptPauseButton = scriptExecuteButton.scriptPauseButton;
        scriptPauseButton.className = "btn btn-sm btn-secondary";
        var scriptDeleteButton = scriptExecuteButton.scriptDeleteButton;
        scriptDeleteButton.className = "btn btn-sm btn-secondary";
        var textArea = scriptExecuteButton.textArea;
        textArea.style.backgroundColor = theme.secondary;
        textArea.disabled = true;


        scriptsManager.createOrReplace(script, settingsUI.executeScriptAsyncReciever, scriptExecuteButton);
        return false;
    },

    executeScriptAsyncReciever: function (HTTPResult, sender) {
        var scriptExecuteButton = sender;
        var label = scriptExecuteButton.label;
        var script = scriptExecuteButton.script;

        var scriptPauseButton = scriptExecuteButton.scriptPauseButton;
        scriptPauseButton.className = "btn btn-sm btn-warning";
        var scriptDeleteButton = scriptExecuteButton.scriptDeleteButton;
        scriptDeleteButton.className = "btn btn-sm btn-danger";
        var textArea = scriptExecuteButton.textArea;
        textArea.style.backgroundColor = "";
        textArea.disabled = false;


        if (!HTTPResult.indexOf("%error") == 0) {
            scriptExecuteButton.className = "btn btn-sm btn-success";
            script.node.networkStatus = NET_ONLINE;
            scriptsManager.refresh(script.node);
            label.style.color = theme.success;
            label.innerText = "execute-OK";

        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (HTTPResult.indexOf("reponse") != -1) {
                script.node.networkStatus = NET_ERROR;
            }
            else {
                script.node.networkStatus = NET_OFFLINE;
            }
            scriptExecuteButton.className = "btn btn-sm btn-danger";
            label.style.color = theme.danger;
            label.innerText = HTTPResult;
        }
    },

    scriptDeleteClick: function (event) {
        var scriptDeleteButton = event.currentTarget;

        makeModalDialog("resetPanel", "deletescript", getLang("deletescript"), "");
        var modalBody = document.getElementById("deletescriptModalBody");
        modalBody.appendChild(document.createElement('label')).innerHTML = getLang("areyousuredeletescript");

        var modalFooter = document.getElementById("deletescriptModalFooter");

        var scriptModalDeleteButton = modalFooter.appendChild(document.createElement('button'));
        scriptModalDeleteButton.type = "button";
        scriptModalDeleteButton.id = event.currentTarget.id + "modal";
        scriptModalDeleteButton.className = "btn btn-sm btn-danger";
        scriptModalDeleteButton.scriptDeleteButton = event.currentTarget;
        scriptModalDeleteButton.onclick = settingsUI.scriptModalDeleteClick;
        scriptModalDeleteButton.appendChild(document.createElement("i")).className = "fa fa-trash";
        var scriptModalDeleteButtonSpan = scriptModalDeleteButton.appendChild(document.createElement("span"));
        scriptModalDeleteButtonSpan.innerHTML = " " + getLang("scriptdelete");

        $("#deletescriptModal").modal('show');
        return false;
    },

    scriptModalDeleteClick: function (event) {
        var scriptModalDeleteButton = event.currentTarget;
        var scriptDeleteButton = scriptModalDeleteButton.scriptDeleteButton;
        $("#deletescriptModal").modal('hide');

        scriptDeleteButton.className = "btn btn-sm btn-secondary";
        var script = scriptDeleteButton.script;

        var scriptExecuteButton = scriptDeleteButton.scriptExecuteButton;
        scriptExecuteButton.className = "btn btn-sm btn-secondary";

        var scriptPauseButton = scriptDeleteButton.scriptPauseButton;
        scriptPauseButton.className = "btn btn-sm btn-secondary";

        var textArea = scriptDeleteButton.textArea;
        textArea.style.backgroundColor = theme.secondary;
        textArea.disabled = true;

        scriptsManager.delete(script, settingsUI.scriptDeleteAsyncReciever, scriptDeleteButton);
        return false;
    },

    scriptDeleteAsyncReciever: function (HTTPResult, sender) {

        var scriptExecuteButton = sender;
        var label = scriptExecuteButton.label;
        var node = scriptExecuteButton.node;

        if (!HTTPResult.indexOf("%error") == 0) {
            node.networkStatus = NET_ONLINE; //UI редактора скрипта удалит onScriptDelete
            scriptsManager.refresh(node);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат


            if (HTTPResult.indexOf("reponse") != -1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            scriptExecuteButton.className = "btn btn-sm btn-danger";
            label.style.color = theme.danger;
            label.innerText = HTTPResult;
        }
    },


    createScriptClick: function (event) {
        var scriptsAddAhref = event.currentTarget;
        event.stopPropagation();

        makeModalDialog("resetPanel", "addscript", getLang("addscriptheader"), "");
        var modalFooter = document.getElementById("addscriptModalFooter");
        var modalBody = document.getElementById("addscriptModalBody");

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "hostEdit");
        label.innerText = getLang("addscriptname");
        var addScriptEdit = formGroup.appendChild(document.createElement('input'));
        addScriptEdit.className = "form-control form-control-sm";
        addScriptEdit.placeholder = "";
        addScriptEdit.id = "addscriptInput";

        var addScriptButton = modalFooter.appendChild(document.createElement("button"));
        addScriptButton.type = "button";
        addScriptButton.id = "addscriptModalButton";
        addScriptButton.className = "btn btn-sm btn-success";
        addScriptButton.node = scriptsAddAhref.node;
        addScriptButton.onclick = settingsUI.createScriptUIClick;
        addScriptButton.innerText = getLang("addscriptbutton");

        var addScriptError = formGroup.appendChild(document.createElement("label"));
        addScriptError.className = "text-danger";

        addScriptButton.addScriptEdit = addScriptEdit;
        addScriptButton.addScriptError = addScriptError;

        $("#addscriptModal").modal('show');

        return false;
    },

    createScriptUIClick: function (event) {
        var addScriptButton = event.currentTarget;
        var addScriptEdit = addScriptButton.addScriptEdit;
        var node = addScriptButton.node;
        if (addScriptButton.script == undefined) {
            addScriptButton.script = createScript(node);
        }
        addScriptButton.script.name = addScriptEdit.value;
        scriptsManager.createOrReplace(addScriptButton.script, settingsUI.createScriptAsynReciever, addScriptButton);
        return false;
    },

    createScriptAsynReciever: function (HTTPResult, sender) {
        var addScriptButton = sender;
        var addScriptError = addScriptButton.addScriptError;
        var node = addScriptButton.node;

        if (!HTTPResult.indexOf("%error") == 0) {
            node.networkStatus = NET_ONLINE;
            $("#addscriptModal").modal('hide');
            scriptsManager.refresh(node);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (HTTPResult.indexOf("reponse") != -1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            addScriptError.innerText = HTTPResult;
        }
    },

    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //когда очередная нода загружает очередное драйвер - строим индикаторы в верхней панели "Настройки" - Online, WiFi AP, WiFi ST, RESTful, MQTT, OTA
    //и подготавлием панель управления нодой (с кнопками Update, Reset и основными свойствами ноды) - смотрите onConfigChange такая панель создается для каждой
    //ноды id = node.nodenickname + "nodePropPanel"    
    onDriverLoaded: function (sender, driver) {
        if (driver._new) { //если это драйвер загружено впервые (вновь созданные драйвера так же вызовут этот метод)

            var nodeSubmenuUl = document.getElementById(driver._nodenickname + "restfulsubmenu"); //ищем пункт sideBar соответствующий ноде которой принадлежит драйвер
            if (nodeSubmenuUl == undefined) return; //если такого пункта нет - выходим

            var node = config.getNodeByHost(driver._host); //узнаем какой ноде принадлежит драйвер
            if (node == undefined) return; //выходим если нода не найдена

            var driverLi = nodeSubmenuUl.appendChild(document.createElement("li")); //добавляем дочерний пукт в меню ноды в sideBar
            driverLi.className = "nav-item";

            //submenu drivers count 

            var RESTfulAhrefSpan = document.getElementById(driver._nodenickname + "RESTfulAhrefDriverCountSpan");
            RESTfulAhrefSpan.driversCount++;
            RESTfulAhrefSpan.innerHTML = parseInt(RESTfulAhrefSpan.driversCount);

            var driverAhref = driverLi.appendChild(document.createElement("a")); //отображаемая часть меню - гиперссылка
            driverAhref.className = "nav-link";
            driverAhref.setAttribute("data-toggle", "tab");
            driverAhref.href = "#" + driver._nodenickname + "_" + driver._id; //якорь на панель с таблицей со свойствами выбранного драйвера (создается один раз)
            driverAhref.node = config.getNodeByHost(driver._host); //привязываем пункт меню к ноде которой принадлежит драйвера (используется для быстрого поска ноды в будущем)
            driverAhref.innerText = driver._id; //пункт меню отображает ID нового драйвера
            driverAhref.onclick = settingsUI.driverAnchorClick; //обработчик клика на пунк меню (переключение панелей)
            driverAhref.parentLi = driverLi; //сохраняем родительский driverId

            var nodePropAnchors = document.getElementById("nodePropNavBar"); //старая навигационная панель для отображения панелей свойств
            var nodesPropsPanel = document.getElementById("nodesPropsPanel");
            var wifiPropPanel = document.getElementById(node.nodenickname + "WifiNodePropBody"); //панель для cвойств            
            var systemPropPanel = document.getElementById(node.nodenickname + "SystemNodePropBody");
            var updatePropPanel = document.getElementById(node.nodenickname + "UpdateNodePropBody");
            var networkPropPanel1 = document.getElementById(node.nodenickname + "NetworkNodePropBody1");
            var networkPropPanel2 = document.getElementById(node.nodenickname + "NetworkNodePropBody2");
            var networkPropPanel3 = document.getElementById(node.nodenickname + "NetworkNodePropBody3");
            //добавляем панель с таблицей со свойствами нового "driver" драйвера в панель nodesPropsPanel, якорим навигацию на nodePropAnchors, bootstrap cell size -> 12             
            new TableWidget(nodePropAnchors, nodesPropsPanel, driver, 12);

            //если очередное загруженое драйвер WiFi
            if (driver.type.value == WiFiDriverType) {
                //индикатор(widget) в верхней панеле для WiFi AP и Wifi ST - подключаем их к событиям WiFi текущей node.WifiDriver - теперь WifiDriver будет отправлять событие 
                //о своем состоянии непосредственно индикаторам 
                //сколько будет node столько будет индикаторов для их WiFi driver - мы отображаем только индикаторы выбранной в SideBar (текущей) node и ее драйвер
                //смотрите getStatusWidget() метод - если индикатора нет его создадут и подпишут id как node.nodenickname + "wifiapStatus"
                var WiFiAPPanel = settingsUI.getStatusWidget(node.nodenickname + "wifiapStatus", "WiFi AP", undefined);
                //подписываем свойство драйвера WiFi.wifiaccesspointavailable на обработчик settingsUI.onWiFiAPStatusChange
                //если WiFi.wifiaccesspointavailable изменит значение, будет вызван settingsUI.onWiFiAPStatusChange
                driver.wifiaccesspointavailable.addValueListner(settingsUI.onWiFiAPStatusChange, WiFiAPPanel);

                //так же как и WiFi AP
                var WiFiSTPanel = settingsUI.getStatusWidget(node.nodenickname + "wifistStatus", "WiFi ST", undefined); //
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

                    // settingsUI.addPropertyView(updatePropPanel, driver.firmwareversion, getLang("firmwareversion"));
                    //  settingsUI.addPropertyView(updatePropPanel, driver.firmwarebuildnumber, getLang("firmwarebuildnumber"));


                }
                else
                    if (driver.type.value == NetworkDriverType) {
                        // document.title = driver.unitid.value + " :: OWLOS"; //ToDo detect "local" node

                        var RESTfulPanel = settingsUI.getStatusWidget(node.nodenickname + "restfulStatus", "RESTful");
                        driver.restfulavailable.addValueListner(settingsUI.onRESTfulStatusChange, RESTfulPanel);
                        var node = config.getNodeByHost(driver._host);
                        node.addNetworkStatusListner(settingsUI.onRESTfulOnlineStatusChange, RESTfulPanel);

                        var MQTTPanel = settingsUI.getStatusWidget(node.nodenickname + "mqttStatus", "MQTT");
                        driver.mqttclientstate.addValueListner(settingsUI.onMQTTStatusChange, MQTTPanel);

                        var OTAPanel = settingsUI.getStatusWidget(node.nodenickname + "otaStatus", "OTA");
                        driver.otaavailable.addValueListner(settingsUI.onOTAStatusChange, OTAPanel);

                        var RESTfulCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel1, driver.restfulavailable, getLang("restfulavailable"), "");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.webserverlogin, getLang("webserverlogin"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.webserverpwd, getLang("webserverpwd"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.restfulserverport, getLang("restfulserverport"), ""));
                        settingsUI.addSpaceView(networkPropPanel1, "2");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.restfulclienturl, getLang("restfulclienturl"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.restfulclientport, getLang("restfulclientport"), ""));
                        settingsUI.onPropertyCheckboxValueChange(RESTfulCheckbox, RESTfulCheckbox.driverProperty);

                        var MQTTCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel2, driver.mqttavailable, getLang("mqttavailable"), "");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqtturl, getLang("mqtturl"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttport, getLang("mqttport"), ""));
                        settingsUI.addSpaceView(networkPropPanel2, "3");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttid, getLang("mqttid"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttlogin, getLang("mqttlogin"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttpassword, getLang("mqttpassword"), ""));
                        settingsUI.onPropertyCheckboxValueChange(MQTTCheckbox, MQTTCheckbox.driverProperty);

                        var OTACheckbox = settingsUI.addPropertyCheckbox(networkPropPanel3, driver.otaavailable, getLang("otaavailable"), "");
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otaid, getLang("otaid"), ""));
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otaport, getLang("otaport"), ""));
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otapassword, getLang("otapassword"), ""));
                        settingsUI.onPropertyCheckboxValueChange(OTACheckbox, OTACheckbox.driverProperty);

                        settingsUI.addPropertyView(updatePropPanel, driver.firmwareversion, getLang("firmwareversion"));
                        settingsUI.addPropertyView(updatePropPanel, driver.firmwarebuildnumber, getLang("firmwarebuildnumber"));

                        settingsUI.addSpaceView(updatePropPanel, "5");
                        settingsUI.addPropertyEdit(updatePropPanel, driver.updatehost, getLang("updatehost"), "");

                        //Update watcher panel 
                        //Панель обновлений
                        var updateWatcherId = node.nodenickname + "updateWatcher";
                        var updateWatcherDiv = document.getElementById(updateWatcherId);
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
                        //}
                    }
        }
    },

    driverAnchorClick: function (event) {

        var aHref = event.currentTarget;


        $(aHref).removeClass('active');

        document.getElementById("sidebarText").style.display = "none";
        document.getElementById("sidebarText").innerText = "";
        document.getElementById("dashboardButtonsPanel").style.display = "none";

        //$(aHref).toggleClass("active");

        document.location = aHref.href;



        var node = aHref.node;
        if (node != undefined) {

            if (aHref.nodeStatusPanel == undefined) {
                aHref = document.getElementById(node.nodenickname + "ahref");
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
        //         document.documentElement.scrollTop = document.documentElement.scrollTop - event.clientY - event.currentTarget.offsetHeight;
        //     }


        return false;
    },


    addNodeClick: function (event) {

        event.stopPropagation();

        makeModalDialog("resetPanel", "addnode", getLang("addnodeheader"), "");
        var modalFooter = document.getElementById("addnodeModalFooter");
        var modalBody = document.getElementById("addnodeModalBody");

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "hostEdit");
        label.innerText = getLang("addnodehost");
        var hostEdit = formGroup.appendChild(document.createElement('input'));
        hostEdit.className = "form-control form-control-sm";
        hostEdit.placeholder = "http://host:port/ or https://host:port/";
        hostEdit.id = "hostInput";

        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "nodenicknameEdit");
        label.innerText = getLang("addnodenickname");
        var nodenicknameEdit = formGroup.appendChild(document.createElement('input'));
        nodenicknameEdit.className = "form-control form-control-sm";
        nodenicknameEdit.id = "nodenicknameInput";
        nodenicknameEdit.placeholder = "room, kitchen, bathroom... ";

        var addNodeButton = modalFooter.appendChild(document.createElement("button"));
        addNodeButton.type = "button";
        addNodeButton.className = "btn btn-sm btn-success";
        addNodeButton.id = "addnodeModalButton";
        addNodeButton.onclick = settingsUI.addNodeUIClick;
        addNodeButton.innerText = getLang("addnodebutton");

        var addNodeError = formGroup.appendChild(document.createElement("label"));
        addNodeError.className = "text-danger";

        addNodeButton.hostEdit = hostEdit;
        addNodeButton.nodenicknameEdit = nodenicknameEdit;
        addNodeButton.addNodeError = addNodeError;

        $("#addnodeModal").modal('show');

        return false;
    },

    addNodeUIClick: function (event) {
        event.stopPropagation();

        var addNodeButton = event.currentTarget;
        var hostEdit = addNodeButton.hostEdit;
        var nodenicknameEdit = addNodeButton.nodenicknameEdit
        var addNodeError = addNodeButton.addNodeError;

        if (hostEdit.value.length == 0) {
            addNodeError.innerText = getLang("addnodeerror_hostempty");
            return false;
        }

        var regexp = RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})");

        if (!hostEdit.value.match(regexp)) {
            addNodeError.innerText = getLang("addnodeerror_hostnoturl");
            return false;
        }

        if (nodenicknameEdit.value.length == 0) {
            addNodeError.innerText = getLang("addnodeerror_nicknameempty");
            return false;
        }

        if (hostEdit.value.slice(-1) !== '/') {
            hostEdit.value += '/';
        }

        if (config.addNode(hostEdit.value, nodenicknameEdit.value)) {
            $("#addnodeModal").modal('hide');
        }
        else {
            addNodeError.innerText = getLang("addnodeerror_cantsaveconfig");
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

        var driverHost = event.currentTarget.driverHost;

        makeModalDialog("resetPanel", "reset", getLang("resetunit"), getLang("areYouSure"));
        var modalFooter = document.getElementById("resetModalFooter");

        var resetButton = modalFooter.appendChild(document.createElement("button"));
        resetButton.type = "button";
        resetButton.className = "btn btn-sm btn-danger";
        resetButton.id = "resetModalButton";
        resetButton.nodeHost = driverHost;
        resetButton.onclick = settingsUI.resetClick;
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
                resetButton.nodeHost = nodeHost;
                resetButton.onclick = SettingsIU.resetClick;
                resetButton.innerText = getLang("reset");
            }

        }
        else {
            sender.innerHTML += "HTTP client - " + HTTPResult;
        }
    },
    resetClick: function (event) {
        var resetButton = event.currentTarget;
        reset(resetButton.nodeHost);

        sleep(5000).then(function () {
            location.reload();
            return false;
        });

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
            propTextDiv.className = "text-light";
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
            propText.className = "input-group-text";
            propText.setAttribute("for", propElementId + "edit");
            propTextDiv.propText = propText;

            var propEdit = createValueEdit(inputGroup, driverProperty.name, driverProperty.value, driverProperty.type)
            //var propEdit = inputGroup.appendChild(document.createElement('input'));
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
                    sender.dependetPanels[i].propText.disabled =
                        sender.dependetPanels[i].propEdit.disabled =
                        sender.dependetPanels[i].propSetButton.disabled = false;
                }
                else {
                    sender.dependetPanels[i].propText.disabled =
                        sender.dependetPanels[i].propEdit.disabled =
                        sender.dependetPanels[i].propSetButton.disabled = true;
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

        return false;

    },

    applyCheckboxChangeClick: function (event) {
        event.stopPropagation();
        var checkChengButton = event.currentTarget;
        var propCheckbox = checkChengButton.propCheckbox;
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
        $("#checkboxchangeModal").modal('hide');
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
            sender.className = "badge badge-success";

        }
        else {
            sender.className = "badge badge-secondary";
        }
    },

    onWiFiSTStatusChange: function (sender, driverProperty) {
        var wifiSTconection = getLang("nostate");
        sender.className = "badge badge-secondary";

        switch (parseInt(driverProperty.value)) {
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

    onRESTfulStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "badge badge-success";

        }
        else {
            sender.className = "badge badge-secondary";
        }
    },

    onRESTfulOnlineStatusChange: function (sender, drivers) {
        var onlineStatus = getLang("netonline");
        if (drivers.networkStatus == NET_ONLINE) {
            sender.className = "badge badge-success";
        }
        else
            if (drivers.networkStatus == NET_ERROR) {
                sender.className = "badge badge-danger";
            }
            else
                if (drivers.networkStatus == NET_OFFLINE) {

                    sender.className = "badge badge-secondary";
                }
    },

    onMQTTStatusChange: function (sender, driverProperty) {

        sender.className = "badge badge-secondary";
        mqttState = getLang("nostate");

        switch (parseInt(driverProperty.value)) {
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

    onOTAStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "badge badge-success";
        }
        else {
            sender.className = "badge badge-secondary";
        }
    }

}
