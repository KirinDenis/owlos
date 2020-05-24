var scriptsUI = {
onScriptNew: function (script) {
    var scriptsSubmenuUl = document.getElementById(script.node.nodenickname + "scriptssubmenu");
    if (scriptsSubmenuUl == undefined) return;

    /*
    var scriptsLi = scriptsSubmenuUl.appendChild(document.createElement("li"));
    scriptsLi.id = script.node.nodenickname + "_" + script.name + "li";
    scriptsLi.className = "nav-item";

    var scriptsAhref = scriptsLi.appendChild(document.createElement("a"));
    scriptsAhref.id = script.node.nodenickname + "_" + script.name + "scriptahref";
    scriptsAhref.className = "";
    scriptsAhref.setAttribute("data-toggle", "tab");
    scriptsAhref.href = "#" + script.node.nodenickname + "_" + script.name + "panel"; //якорь на панель 
    scriptsAhref.node = script.node; //привязываем пункт меню к ноде 
    scriptsAhref.innerText = script.name;
    scriptsAhref.onclick = settingsUI.driverAnchorClick; //обработчик клика на пунк меню (переключение панелей)
    scriptsAhref.parentLi = scriptsLi; //сохраняем родительский driverId
    scriptsLi.scriptsAhref = scriptsAhref;
    */
   var scriptsLi = sideBar.createItem(scriptsSubmenuUl, script.node.nodenickname + "_" + script.name, "#" + script.node.nodenickname + "_" + script.name + "panel", script.name, settingsUI.driverAnchorClick, "fa fa-bolt", undefined);
   

    switch (parseInt(script.status)) {
        case stopScriptStatus: scriptsLi.href.style.color = ""; break;
        case runScriptStatus: scriptsLi.href.style.color = theme.success; break;
        case compilerScriptErrorStatus: scriptsLi.href.style.color = theme.warning; break;
        default:
            scriptsLi.href.style.color = theme.danger; break;
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
    textArea.onkeydown = scriptsUI.textAreaOnKeyDown;

    var scriptExecuteButton = byteCodeCardDiv.appendChild(document.createElement('button'));
    scriptExecuteButton.type = "button";
    scriptExecuteButton.id = script.node.nodenickname + "_" + script.name + "executionButton";
    scriptExecuteButton.className = "btn btn-sm btn-success";
    scriptExecuteButton.script = script;
    scriptExecuteButton.textArea = textArea;
    scriptExecuteButton.labels = label;
    scriptExecuteButton.onclick = scriptsUI.scriptExecuteClick;
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
    scriptPauseButton.onclick = scriptsUI.scriptPauseClick;
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
    scriptDebugButton.onclick = scriptsUI.scriptDebugClick;
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
    scriptDeleteButton.onclick = scriptsUI.scriptDeleteClick;
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
    scriptsUI.buildScriptStatus(script);

},

onScriptChange: function (script) {
    var scriptsAhref = document.getElementById(script.node.nodenickname + "_" + script.name + "href");
    if (scriptsAhref == undefined) return;
    scriptsAhref.textSpan.innerHTML = script.name;

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
    scriptsUI.buildScriptStatus(script);
    if (script.status == debugScriptStatus) {
        scriptsUI.selectCodeLine(textArea, script.debuglinenumber);
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
            scriptsUI.driverAnchorClick(event);
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
    scriptsUI.driverAnchorClick(event);
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
            scriptsUI.scriptExecuteClick(event);
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


    scriptsManager.createOrReplace(script, scriptsUI.executeScriptAsyncReciever, scriptExecuteButton);
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
    scriptModalDeleteButton.onclick = scriptsUI.scriptModalDeleteClick;
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

    scriptsManager.delete(script, scriptsUI.scriptDeleteAsyncReciever, scriptDeleteButton);
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

    var newScriptDialog = createModalDialog(getLang("addscriptheader"), "");
    newScriptDialog.node = scriptsAddAhref.node;
    newScriptDialog.appendInput(createDialogInput("addscriptInput", getLang("addscriptname"), ""));
    
    newScriptDialog.onOK = scriptsUI.createScriptUIClick;
    newScriptDialog.show();

    return false;
},

createScriptUIClick: function (newScriptDialog) {

    var node = newScriptDialog.node;
    var addscriptInput = newScriptDialog.getChild("addscriptInput");
    if (addscriptInput.value === "") {
        newScriptDialog.errorLabel.innerText = getLang("scriptnameempty");
        return;
    }

    var script = createScript(node);
    script.name = addscriptInput.value;
    scriptsManager.createOrReplace(script, scriptsUI.createScriptAsynReciever, newScriptDialog);

    return false;

},

createScriptAsynReciever: function (HTTPResult, newScriptDialog) {
    var node = newScriptDialog.node;

    if (!HTTPResult.indexOf("%error") == 0) {
        node.networkStatus = NET_ONLINE;
        newScriptDialog.hide();
        scriptsManager.refresh(node);
    }
    else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
        if (HTTPResult.indexOf("reponse") != -1) {
            node.networkStatus = NET_ERROR;
        }
        else {
            node.networkStatus = NET_OFFLINE;
        }
        newScriptDialog.errorLabel.innerText = HTTPResult;
    }
}
}
