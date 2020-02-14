

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


                //nodeAhref.onclick = settingsUI.deviceAnchorClick;
                nodeAhref.parentLi = nodeLi;
                nodeAhref.node = node;
                node.addNetworkStatusListner(settingsUI.onNetworkChange, nodeAhref);
                var nodeSubmenuUl = nodeLi.appendChild(document.createElement("ul"));

                nodeLi.nodeSubmenuUl = nodeSubmenuUl;
                nodeSubmenuUl.className = "collapse list-unstyled";
                nodeSubmenuUl.id = node.nodenickname + "submenu";



                //аdd script submenuitem ------------------
                var scriptsNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                scriptsNavItem.className = "nav-item";
                var scriptsAhref = scriptsNavItem.appendChild(document.createElement("a"));
                scriptsAhref.className = "nav-link";
                scriptsAhref.parentLi = nodeLi;
                //filesHRef.style.color = theme.warning;
                scriptsAhref.setAttribute("data-toggle", "collapse");
                scriptsAhref.onclick = settingsUI.deviceAnchorClick;                
                scriptsAhref.href = "#" + node.nodenickname + "scriptssubmenu";
                scriptsAhref.node = node;

                scriptsAhref.appendChild(document.createElement("i")).className = "fa fa-bolt";

                var scriptsAhrefSpan = scriptsAhref.appendChild(document.createElement("span"));
                scriptsAhrefSpan.className = "menu-text";
                scriptsAhrefSpan.innerHTML = "<b>" + getLang("scripts") + "</b>";                

                scriptsAhrefSpan = scriptsAhref.appendChild(document.createElement("span"));
                scriptsAhrefSpan.className = "badge badge-pill badge-warning";
                scriptsAhrefSpan.id = node.nodenickname + "scriptsAhrefDeviceCountSpan";
                scriptsAhrefSpan.innerHTML = "0";
                scriptsAhrefSpan.devicesCount = 0;

               
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
                scriptsAddAhref.parentLi = scriptsAddLi; //сохраняем родительский deviceId


                
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
                RESTfulAhrefSpan.id = node.nodenickname + "RESTfulAhrefDeviceCountSpan";
                RESTfulAhrefSpan.innerHTML = "0";
                RESTfulAhrefSpan.devicesCount = 0;


                var RESTfulSubmenuUl = RESTfulNavItem.appendChild(document.createElement("ul"));
                RESTfulSubmenuUl.className = "collapse list-unstyled";
                RESTfulSubmenuUl.id = node.nodenickname + "restfulsubmenu";

                //Add device submenuitem ----------------
                var deviceNavItem = RESTfulSubmenuUl.appendChild(document.createElement("li"));
                deviceNavItem.className = "nav-item";
                var deviceHRef = deviceNavItem.appendChild(document.createElement("a"));
                deviceHRef.className = "nav-link";
                deviceHRef.style.color = theme.warning;
                deviceHRef.parentLi = nodeLi;
                //deviceHRef.style.color = theme.success;
                deviceHRef.setAttribute("data-toggle", "tab");
                deviceHRef.onclick = devicesUI.addDeviceClick;
                deviceHRef.innerHTML = getLang("adddevice");
                deviceHRef.href = "#home";
                deviceHRef.node = node;



                //Node Tab panel ----------------------
                var nodePanelNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                nodePanelNavItem.className = "nav-item";
                var nodePanelHRef = nodePanelNavItem.appendChild(document.createElement("a"));
                nodePanelHRef.className = "nav-link";
                nodePanelHRef.parentLi = nodeLi;
                //nodePanelHRef.style.color = theme.warning;
                nodePanelHRef.setAttribute("data-toggle", "tab");
                nodePanelHRef.onclick = settingsUI.deviceAnchorClick;
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
                //смотрите обработчик события onDeviceLoaded() - он запоняет эту панель
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "NetworkNodeProp", getLang("networknodeprop"), 12);
                var networkNodePropBody = document.getElementById(node.nodenickname + "NetworkNodePropBody");
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody1", 4);
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody2", 4);
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody3", 4);

                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "WifiNodeProp", getLang("wifinodeprop"), 4); //WifiNodePropPanel - свойства WiFi                
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "SystemNodeProp", getLang("systemnodeprop"), 4);
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "UpdateNodeProp", getLang("updatenodeprop"), 4);


                //--- EndOf nodePropsPanel ---------------------------------------------------------------------------

                //Add files submenuitem ------------------
                var filesNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                filesNavItem.className = "nav-item";
                var filesHRef = filesNavItem.appendChild(document.createElement("a"));
                filesHRef.className = "nav-link";
                filesHRef.parentLi = nodeLi;
                //filesHRef.style.color = theme.warning;
                filesHRef.setAttribute("data-toggle", "tab");
                filesHRef.onclick = settingsUI.deviceAnchorClick;
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
        scriptsLi.className = "nav-item";

        var scriptsAhref = scriptsLi.appendChild(document.createElement("a")); 
        scriptsAhref.id = script.node.nodenickname + "_" + script.name + "scriptahref";
        scriptsAhref.className = "nav-link";
        scriptsAhref.setAttribute("data-toggle", "tab");
        scriptsAhref.href = "#" + script.node.nodenickname + "_" + script.name + "panel"; //якорь на панель 
        scriptsAhref.node = script.node; //привязываем пункт меню к ноде 
        scriptsAhref.innerText = script.name; 
        scriptsAhref.onclick = settingsUI.deviceAnchorClick; //обработчик клика на пунк меню (переключение панелей)
        scriptsAhref.parentLi = scriptsLi; //сохраняем родительский deviceId

        switch (parseInt(script.status)) {
            case stopScriptStatus: scriptsAhref.style.color = ""; break;
            case runScriptStatus: scriptsAhref.style.color = theme.success; break;
            case compilerScriptErrorStatus: scriptsAhref.style.color = theme.warning; break;
            default:
                scriptsAhref.style.color = theme.danger; break;
        }


        //Script panel 
        var nodesPropsPanel = document.getElementById("nodesPropsPanel");
        var div = nodesPropsPanel.appendChild(document.createElement('div'));
        div.id = script.node.nodenickname + "_" + script.name + "panel";
        div.className = "devicediv tab-pane fade md-form"; 

        var pre = div.appendChild(document.createElement('pre'));
        var textArea = pre.appendChild(document.createElement('textarea'));
        textArea.id = script.node.nodenickname + "_" + script.name + "textarea";
        textArea.className = "md-textarea form-control";
        textArea.cols = 80;
        textArea.rows = 20;
        textArea.value = script.bytecode;


        var scriptExecuteButton = pre.appendChild(document.createElement('button'));
        scriptExecuteButton.type = "button";
        scriptExecuteButton.id = script.node.nodenickname + "_" + script.name + "executionButton";
        scriptExecuteButton.className = "btn btn-sm btn-success";
        scriptExecuteButton.script = script;
        scriptExecuteButton.textArea = textArea;
        scriptExecuteButton.labels = label;
        scriptExecuteButton.onclick = settingsUI.scriptExecuteClick;
        scriptExecuteButton.innerText = getLang("scriptexecute");

        var deleteExecuteButton = pre.appendChild(document.createElement('button'));
        deleteExecuteButton.type = "button";
        deleteExecuteButton.id = script.node.nodenickname + "_" + script.name + "deleteButton";
        deleteExecuteButton.className = "btn btn-sm btn-warning";
        deleteExecuteButton.script = script;
        deleteExecuteButton.textArea = textArea;
        deleteExecuteButton.labels = label;
        deleteExecuteButton.onclick = settingsUI.scriptDeleteClick;
        deleteExecuteButton.innerText = getLang("scriptdelete");

        var label = pre.appendChild(document.createElement('label'));
        label.id = script.node.nodenickname + "_" + script.name + "label";
        label.for = script.node.nodenickname + "_" + script.name + "textarea";
        label.innerHTML = "script: " + script.name;        
    },

    scriptExecuteClick: function(event) {
        var scriptExecuteButton = event.currentTarget;
        scriptExecuteButton.className = "btn btn-sm btn-default";
        var textArea = scriptExecuteButton.textArea;
        var script = scriptExecuteButton.script;
        script.bytecode = textArea.value;

        scriptsManager.createOrReplace(script, settingsUI.executeScriptAsynReciever, scriptExecuteButton);
        return false; 
    },

    scriptDeleteClick: function (event) {
        var scriptDeleteButton = event.currentTarget;
        scriptDeleteButton.className = "btn btn-sm btn-default";        
        var script = scriptDeleteButton.script;
       
        scriptsManager.delete(script); //, settingsUI.executeScriptAsynReciever, scriptExecuteButton);
        return false;
    },


    executeScriptAsynReciever: function (HTTPResult, sender) {
        var scriptExecuteButton = sender;
        var label = scriptExecuteButton.label;
        var node = scriptExecuteButton.node;

        if (!HTTPResult.indexOf("%error") == 0) {
            scriptExecuteButton.className = "btn btn-sm btn-success";
            node.networkStatus = NET_ONLINE;            
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
    //когда очередная нода загружает очередное устройство - строим индикаторы в верхней панели "Настройки" - Online, WiFi AP, WiFi ST, RESTful, MQTT, OTA
    //и подготавлием панель управления нодой (с кнопками Update, Reset и основными свойствами ноды) - смотрите onConfigChange такая панель создается для каждой
    //ноды id = node.nodenickname + "nodePropPanel"    
    onDeviceLoaded: function (sender, device) {
        if (device._new) { //если это устройство загружено впервые (вновь созданные устройства так же вызовут этот метод)

            var nodeSubmenuUl = document.getElementById(device._nodenickname + "restfulsubmenu"); //ищем пункт sideBar соответствующий ноде которой принадлежит устройство
            if (nodeSubmenuUl == undefined) return; //если такого пункта нет - выходим

            var node = config.getNodeByHost(device._host); //узнаем какой ноде принадлежит устройство
            if (node == undefined) return; //выходим если нода не найдена

            var deviceLi = nodeSubmenuUl.appendChild(document.createElement("li")); //добавляем дочерний пукт в меню ноды в sideBar
            deviceLi.className = "nav-item";

            //submenu devices count 
            
            var RESTfulAhrefSpan = document.getElementById(device._nodenickname + "RESTfulAhrefDeviceCountSpan");
            RESTfulAhrefSpan.devicesCount++;
            RESTfulAhrefSpan.innerHTML = parseInt(RESTfulAhrefSpan.devicesCount);

            var deviceAhref = deviceLi.appendChild(document.createElement("a")); //отображаемая часть меню - гиперссылка
            deviceAhref.className = "nav-link";
            deviceAhref.setAttribute("data-toggle", "tab");
            deviceAhref.href = "#" + device._nodenickname + "_" + device._id; //якорь на панель с таблицей со свойствами выбранного устройства (создается один раз)
            deviceAhref.node = config.getNodeByHost(device._host); //привязываем пункт меню к ноде которой принадлежит устройства (используется для быстрого поска ноды в будущем)
            deviceAhref.innerText = device._id; //пункт меню отображает ID нового устройства
            deviceAhref.onclick = settingsUI.deviceAnchorClick; //обработчик клика на пунк меню (переключение панелей)
            deviceAhref.parentLi = deviceLi; //сохраняем родительский deviceId

            var nodePropAnchors = document.getElementById("nodePropNavBar"); //старая навигационная панель для отображения панелей свойств
            var nodesPropsPanel = document.getElementById("nodesPropsPanel");
            var wifiPropPanel = document.getElementById(node.nodenickname + "WifiNodePropBody"); //панель для cвойств            
            var systemPropPanel = document.getElementById(node.nodenickname + "SystemNodePropBody");
            var updatePropPanel = document.getElementById(node.nodenickname + "UpdateNodePropBody");
            var networkPropPanel1 = document.getElementById(node.nodenickname + "NetworkNodePropBody1");
            var networkPropPanel2 = document.getElementById(node.nodenickname + "NetworkNodePropBody2");
            var networkPropPanel3 = document.getElementById(node.nodenickname + "NetworkNodePropBody3");
            //добавляем панель с таблицей со свойствами нового "device" устройства в панель nodesPropsPanel, якорим навигацию на nodePropAnchors, bootstrap cell size -> 12             
            new TableWidget(nodePropAnchors, nodesPropsPanel, device, 12);

            //если очередное загруженое устройство WiFi
            if (device.type.value == WiFiDeviceType) {
                //индикатор(widget) в верхней панеле для WiFi AP и Wifi ST - подключаем их к событиям WiFi текущей node.WifiDevice - теперь WifiDevice будет отправлять событие 
                //о своем состоянии непосредственно индикаторам 
                //сколько будет node столько будет индикаторов для их WiFi device - мы отображаем только индикаторы выбранной в SideBar (текущей) node и ее устройств
                //смотрите getStatusWidget() метод - если индикатора нет его создадут и подпишут id как node.nodenickname + "wifiapStatus"
                var WiFiAPPanel = settingsUI.getStatusWidget(node.nodenickname + "wifiapStatus", "WiFi AP", undefined);
                //подписываем свойство устройства WiFi.wifiaccesspointavailable на обработчик settingsUI.onWiFiAPStatusChange
                //если WiFi.wifiaccesspointavailable изменит значение, будет вызван settingsUI.onWiFiAPStatusChange
                device.wifiaccesspointavailable.addValueListner(settingsUI.onWiFiAPStatusChange, WiFiAPPanel);

                //так же как и WiFi AP
                var WiFiSTPanel = settingsUI.getStatusWidget(node.nodenickname + "wifistStatus", "WiFi ST", undefined); //
                device.wifistatus.addValueListner(settingsUI.onWiFiSTStatusChange, WiFiSTPanel);

                //панель со свойствами node - добавляем отображени уровня WiFi сигнала (так же подписываем на событие изменения значения WiFi.wifirssi)


                var wifiAPCheckbox = settingsUI.addPropertyCheckbox(wifiPropPanel, device.wifiaccesspointavailable, getLang("wifiaccesspointavailable"), "");

                wifiAPCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, device.wifiaccesspointssid, getLang("wifiaccesspointssid"), ""));
                wifiAPCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, device.wifiaccesspointpassword, getLang("wifiaccesspointpassword"), ""));

                settingsUI.onPropertyCheckboxValueChange(wifiAPCheckbox, wifiAPCheckbox.deviceProperty);

                settingsUI.addSpaceView(wifiPropPanel, "1");

                var wifiSTCheckbox = settingsUI.addPropertyCheckbox(wifiPropPanel, device.wifiavailable, getLang("wifiavailable"), "");
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, device.wifissid, getLang("wifissid"), ""));
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, device.wifipassword, getLang("wifipassword"), ""));
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, device.wifiip, getLang("wifiip"), ""));

                settingsUI.onPropertyCheckboxValueChange(wifiSTCheckbox, wifiSTCheckbox.deviceProperty);

                settingsUI.addPropertyView(wifiPropPanel, device.wifirssi, getLang("wifirssi"), "dBm");


            }
            else
                if (device.type.value == ESPDeviceType) {

                    if (node.host == boardhost) { //the local node 


                        var deviceProperty = {
                            parentid: boardhost,
                            name: "language",
                            type: "",
                            value: configProperties["language"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, deviceProperty, getLang(deviceProperty.name), "");

                        var deviceProperty = {
                            parentid: boardhost,
                            name: "widgetssize",
                            type: "i",
                            value: configProperties["widgetssize"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, deviceProperty, getLang(deviceProperty.name), "");

                        var deviceProperty = {
                            parentid: boardhost,
                            name: "speak",
                            type: "b",
                            value: configProperties["speak"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, deviceProperty, getLang(deviceProperty.name), "");

                        var deviceProperty = {
                            parentid: boardhost,
                            name: "voice",
                            type: "i",
                            value: configProperties["voice"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, deviceProperty, getLang(deviceProperty.name), "");

                    }

                    settingsUI.addPropertyView(systemPropPanel, device.espfreesketchspace, getLang("espfreesketchspace"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, device.espfreeheap, getLang("espfreeheap"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, device.espcpufreqmhz, getLang("espcpufreqmhz"), "mHz");
                    settingsUI.addPropertyView(systemPropPanel, device.espresetreason, getLang("espresetreason"));

                    settingsUI.addSpaceView(systemPropPanel, "4");
                    var resetButton = systemPropPanel.appendChild(document.createElement('input'));
                    resetButton.className = "btn btn-danger btn-sm";
                    resetButton.type = "button";
                    resetButton.setAttribute("data-toggle", "modal");
                    resetButton.setAttribute("data-target", "#resetModal");
                    resetButton.value = getLang("reset");
                    resetButton.deviceHost = device._host;
                    resetButton.onclick = settingsUI.modalResetClick;

                    // settingsUI.addPropertyView(updatePropPanel, device.firmwareversion, getLang("firmwareversion"));
                    //  settingsUI.addPropertyView(updatePropPanel, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));


                }
                else
                    if (device.type.value == NetworkDeviceType) {
                        // document.title = device.unitid.value + " :: OWL OS"; //ToDo detect "local" node

                        var RESTfulPanel = settingsUI.getStatusWidget(node.nodenickname + "restfulStatus", "RESTful");
                        device.restfulavailable.addValueListner(settingsUI.onRESTfulStatusChange, RESTfulPanel);
                        var node = config.getNodeByHost(device._host);
                        node.addNetworkStatusListner(settingsUI.onRESTfulOnlineStatusChange, RESTfulPanel);

                        var MQTTPanel = settingsUI.getStatusWidget(node.nodenickname + "mqttStatus", "MQTT");
                        device.mqttclientstate.addValueListner(settingsUI.onMQTTStatusChange, MQTTPanel);

                        var OTAPanel = settingsUI.getStatusWidget(node.nodenickname + "otaStatus", "OTA");
                        device.otaavailable.addValueListner(settingsUI.onOTAStatusChange, OTAPanel);

                        var RESTfulCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel1, device.restfulavailable, getLang("restfulavailable"), "");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, device.restfulserverusername, getLang("restfulserverusername"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, device.restfulserverpassword, getLang("restfulserverpassword"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, device.restfulserverport, getLang("restfulserverport"), ""));
                        settingsUI.addSpaceView(networkPropPanel1, "2");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, device.restfulclienturl, getLang("restfulclienturl"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, device.restfulclientport, getLang("restfulclientport"), ""));
                        settingsUI.onPropertyCheckboxValueChange(RESTfulCheckbox, RESTfulCheckbox.deviceProperty);

                        var MQTTCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel2, device.mqttavailable, getLang("mqttavailable"), "");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, device.mqtturl, getLang("mqtturl"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, device.mqttport, getLang("mqttport"), ""));
                        settingsUI.addSpaceView(networkPropPanel2, "3");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, device.mqttid, getLang("mqttid"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, device.mqttlogin, getLang("mqttlogin"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, device.mqttpassword, getLang("mqttpassword"), ""));
                        settingsUI.onPropertyCheckboxValueChange(MQTTCheckbox, MQTTCheckbox.deviceProperty);

                        var OTACheckbox = settingsUI.addPropertyCheckbox(networkPropPanel3, device.otaavailable, getLang("otaavailable"), "");
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, device.otaid, getLang("otaid"), ""));
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, device.otaport, getLang("otaport"), ""));
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, device.otapassword, getLang("otapassword"), ""));
                        settingsUI.onPropertyCheckboxValueChange(OTACheckbox, OTACheckbox.deviceProperty);

                        settingsUI.addPropertyView(updatePropPanel, device.firmwareversion, getLang("firmwareversion"));
                        settingsUI.addPropertyView(updatePropPanel, device.firmwarebuildnumber, getLang("firmwarebuildnumber"));

                        settingsUI.addSpaceView(updatePropPanel, "5");
                        settingsUI.addPropertyEdit(updatePropPanel, device.updatehost, getLang("updatehost"), "");

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

                            device.updateinfo.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                            device.updatepossible.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                        }
                        //}
                    }
        }
    },

    deviceAnchorClick: function (event) {

        var aHref = event.currentTarget;


        $(this).removeClass('active');

        document.getElementById("sidebarText").style.display = "none";
        document.getElementById("sidebarText").innerText = "";
        document.getElementById("dashboardButtonsPanel").style.display = "none";

        aHref.parentLi.className = "active";

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

        var deviceHost = event.currentTarget.deviceHost;

        makeModalDialog("resetPanel", "reset", getLang("resetunit"), getLang("areYouSure"));
        var modalFooter = document.getElementById("resetModalFooter");

        var resetButton = modalFooter.appendChild(document.createElement("button"));
        resetButton.type = "button";
        resetButton.className = "btn btn-sm btn-danger";
        resetButton.id = "resetModalButton";
        resetButton.nodeHost = deviceHost;
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


    //добавляет строку со названием и значением свойства на panelDiv, deviceProperty - отображаемое свойство (подписывается на изменения свойства)
    //обычно используется для отображения свойств ноды Node/Properties в SideBar разделе Settings
    addPropertyView: function (panelDiv, deviceProperty, text, sufix) {
        if (deviceProperty == undefined) return;
        var propElementId = panelDiv.id + deviceProperty.parentid + deviceProperty.name; //дормируем уникальный ID элемента
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
            deviceProperty.addValueListner(settingsUI.onPropertyViewedValueChange, propTextDiv);
        }
        return propTextDiv;
    },
    //работает в паре с addPropertyView, "следит" за значением свойства
    onPropertyViewedValueChange: function (sender, deviceProperty) {
        sender.innerHTML = "<strong>" + sender.propertyText + ":</strong> " + deviceProperty.value + " " + sender.propertySufix + "<br>";
    },

    //добавляет редактор указаного свойства deviceProperty на указанную панель panelDiv
    //работает так же как addPropertyView, но позволяет изменять значение свойства 
    addPropertyEdit: function (panelDiv, deviceProperty, text, sufix) {
        if (deviceProperty == undefined) return;
        var propElementId = panelDiv.id + deviceProperty.parentid + deviceProperty.name;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            propTextDiv.className = "text-light";
            propTextDiv.deviceProperty = deviceProperty;
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

            var propEdit = createValueEdit(inputGroup, deviceProperty.name, deviceProperty.value, deviceProperty.type)
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

            if (deviceProperty.addValueListner != undefined) {
                deviceProperty.addValueListner(settingsUI.onPropertyEditedValueChange, propTextDiv);
                deviceProperty.addNetworkStatusListner(settingsUI.onPropertyEditNetworkChange, propTextDiv);
            }
            else {
                propText.innerText = text;
                propEdit.value = deviceProperty.value;
            }
        }
        return propTextDiv;
    },
    //работает в паре с addPropertyEdit
    onPropertyEditedValueChange: function (sender, deviceProperty) {
        sender.propText.innerText = sender.propertyText;
        sender.propEdit.value = deviceProperty.value;
        //+ deviceProperty.value + " " + sender.propertySufix + "<br>";
    },

    onPropertyEditNetworkChange: function (sender, deviceProperty) {

        if (deviceProperty.networkStatus == NET_ONLINE) {
            sender.propEdit.disabled = false;

            sender.propSetButton.className = "btn btn-outline-success btn-sm";
        } else if (deviceProperty.networkStatus == NET_RECONNECT) {
            sender.propEdit.disabled = true;
            sender.propSetButton.className = "btn btn-outline-info btn-sm";
        } else if (deviceProperty.networkStatus == NET_OFFLINE) {
            sender.propEdit.disabled = true;
            sender.propSetButton.className = "btn btn-outline-secondary btn-sm";
        } else //error
            if (deviceProperty.networkStatus == NET_ERROR) {
                sender.propEdit.disabled = true;
                sender.propSetButton.className = "btn btn-outline-danger btn-sm";
            }

    },

    propSetButtonClick: function (event) {
        event.stopPropagation();
        var propSetButton = event.currentTarget; //вытаскиваем "кликнутую" кнопку из event 
        var propTextDiv = propSetButton.propTextDiv; //вытаскиваем панель со свойством
        var deviceProperty = propTextDiv.deviceProperty; //вытастиваем свойство устройства

        if (deviceProperty.addValueListner != undefined) {

            if (deviceProperty.networkStatus != NET_RECONNECT) {
                //если свойство устройства не в статуре "в реботе" - асинхронность это хорошо, но переполнять очередь это преступление

                var value = propTextDiv.propEdit.value; //получаем значение свойства устройства введенное пользователем

                if (deviceProperty.type.indexOf("b") != -1) // boolean - представлен в виде combobox а не редактора 
                {
                    if (propTextDiv.propEdit.selectedIndex == 0) value = "1"; //для устройства 1 - true, 0 - false
                    else value = "0";
                } //вызываем метод свойства устройства для начала процедуры изменения этого свойства с новым значением value
                //не назначаем вторичных получателей undefined, undefined - все получатели уже подписаны ранее

                deviceProperty.setValue(value, undefined, undefined);
            }
        }
        else {
            var result = false;

            propTextDiv.propEdit.disabled = true;
            propTextDiv.propSetButton.className = "btn btn-outline-info btn-sm";

            try {
                configProperties[deviceProperty.name] = propTextDiv.propEdit.value;
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
    addPropertyCheckbox: function (panelDiv, deviceProperty, text, sufix) {
        if (deviceProperty == undefined) return;
        var propElementId = panelDiv.id + deviceProperty.parentid + deviceProperty.name;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.className = "input-group input-group-sm mb-3";
            propTextDiv.id = propElementId;
            propTextDiv.deviceProperty = deviceProperty;
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

            deviceProperty.addValueListner(settingsUI.onPropertyCheckboxValueChange, propTextDiv);
            deviceProperty.addNetworkStatusListner(settingsUI.onPropertyCheckboxNetworkChange, propTextDiv);


        }
        return propTextDiv;
    },
    //работает в паре с addPropertyCheckbox
    onPropertyCheckboxValueChange: function (sender, deviceProperty) {
        sender.propText.innerHTML = "&nbsp;" + sender.propertyText;
        if (deviceProperty.value === '1') {
            sender.propCheckbox.checked = true;
        }
        else {
            sender.propCheckbox.checked = false;
        }

        if (sender.dependetPanels != undefined) {
            for (var i = 0; i < sender.dependetPanels.length; i++) {
                if (deviceProperty.value === '1') {
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

    onPropertyCheckboxNetworkChange: function (sender, deviceProperty) {

        if (deviceProperty.networkStatus == NET_ONLINE) {
            sender.propCheckbox.disabled = false;
            sender.propText.disabled = false;
        } else if (deviceProperty.networkStatus == NET_RECONNECT) {
            sender.propCheckbox.disabled = true;
            sender.propText.disabled = true;
        } else if (deviceProperty.networkStatus == NET_OFFLINE) {
            sender.propCheckbox.disabled = true;
            sender.propText.disabled = true;
        } else //error
            if (deviceProperty.networkStatus == NET_ERROR) {
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
        var deviceProperty = propTextDiv.deviceProperty;
        var propTextDiv = propCheckbox.propTextDiv;
        var deviceProperty = propTextDiv.deviceProperty;

        if (deviceProperty.networkStatus != NET_RECONNECT) {
            if (propCheckbox.checked) {
                deviceProperty.setValue("1", undefined, undefined);
            }
            else {
                deviceProperty.setValue("0", undefined, undefined);
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
