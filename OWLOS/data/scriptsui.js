/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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

var scriptsUI = {
    onScriptNew: function (script) {
        var scriptsSubmenuUl = document.getElementById(script.thing.thingnickname + "scriptssubmenu");
        if (scriptsSubmenuUl == undefined) return;
        var scriptsLi = sideBar.createItem(scriptsSubmenuUl, script.thing.thingnickname + "_" + script.name, "#" + script.thing.thingnickname + "_" + script.name + "panel", script.name, sidebarItemClick, "fa fa-bolt", undefined);
        switch (parseInt(script.status)) {
            case stopScriptStatus: scriptsLi.href.style.color = ""; break;
            case runScriptStatus: scriptsLi.href.style.color = theme.success; break;
            case compilerScriptErrorStatus: scriptsLi.href.style.color = theme.warning; break;
            default:
                scriptsLi.href.style.color = theme.danger; break;
        }


        //Script panel 
        var thingsPropsPanel = document.getElementById("thingsPropsPanel");
        var scriptTab = thingsPropsPanel.appendChild(document.createElement('div'));
        scriptTab.id = script.thing.thingnickname + "_" + script.name + "panel";
        scriptTab.className = "tab-pane fade md-form";
        scriptsLi.panel = scriptTab;

        var scriptHolder = scriptTab.appendChild(document.createElement('div'));
        scriptHolder.className = "row";

        var byteCodeCardDiv = scriptHolder.appendChild(document.createElement('div'));
        byteCodeCardDiv.className = "col-md-8";
        var byteCodeCard = byteCodeCardDiv.appendChild(document.createElement('div'));
        byteCodeCard.className = "card bg-dark border-info mb-3";
        var byteCodeCardHeader = byteCodeCard.appendChild(document.createElement('div'));
        byteCodeCardHeader.className = "card-header";
        byteCodeCardHeader.innerText = script.name + " script bytecode";
        var byteCodeCardBody = byteCodeCard.appendChild(document.createElement('div'));
        byteCodeCardBody.className = "card-body";
        var pre = byteCodeCardBody.appendChild(document.createElement('pre'));
        var textArea = pre.appendChild(document.createElement('textarea'));
        textArea.id = script.thing.thingnickname + "_" + script.name + "textarea";
        textArea.className = "md-textarea text-primary form-control bg-dark";
        textArea.placeholder = getLang("inputcodehere");
        textArea.cols = 80;
        textArea.rows = 20;
        textArea.value = script.bytecode;
        textArea.onkeydown = scriptsUI.textAreaOnKeyDown;

        var scriptExecuteButton = headerPanelUI.addButton(script.thing.thingnickname + "_" + script.name + "executionButton", "fa fa-bolt", getLang("scriptexecute"), headerPanelUI.scriptButtonRole);
        scriptExecuteButton.script = script;
        scriptExecuteButton.textArea = textArea;
        scriptExecuteButton.labels = label;
        scriptExecuteButton.onclick = scriptsUI.scriptExecuteClick;        
        scriptsLi.href.scriptExecuteButton = scriptExecuteButton;

        textArea.scriptExecuteButton = scriptExecuteButton;        

        var scriptPauseButton = headerPanelUI.addButton(script.thing.thingnickname + "_" + script.name + "pauseButton", "fa fa-pause", getLang("scriptpause"), headerPanelUI.scriptButtonRole);
        scriptPauseButton.script = script;
        scriptPauseButton.thing = script.thing; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptPauseButton.scriptExecuteButton = scriptExecuteButton;
        scriptPauseButton.textArea = textArea;
        scriptPauseButton.labels = label;
        scriptPauseButton.onclick = scriptsUI.scriptPauseClick;
        scriptsLi.href.scriptPauseButton = scriptPauseButton;
        
        scriptExecuteButton.scriptPauseButton = scriptPauseButton;

        var scriptDebugButton = headerPanelUI.addButton(script.thing.thingnickname + "_" + script.name + "debugButton", "fa fa-bug", getLang("scriptstartdebug"), headerPanelUI.scriptButtonRole);                    
        scriptDebugButton.script = script;
        scriptDebugButton.thing = script.thing;
        scriptDebugButton.scriptExecuteButton = scriptExecuteButton;
        scriptDebugButton.textArea = textArea;
        scriptDebugButton.labels = label;
        scriptDebugButton.onclick = scriptsUI.scriptDebugClick;
        scriptDebugButton.debugNext = false;
        
        scriptsLi.href.scriptDebugButton = scriptDebugButton;
        
        var scriptDeleteButton = headerPanelUI.addButton(script.thing.thingnickname + "_" + script.name + "deleteButton", "fa fa-trash", getLang("scriptdelete"), headerPanelUI.scriptButtonRole);                                            
        scriptDeleteButton.script = script;
        scriptDeleteButton.thing = script.thing; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptDeleteButton.scriptExecuteButton = scriptExecuteButton;
        scriptDeleteButton.scriptPauseButton = scriptPauseButton;
        scriptDeleteButton.textArea = textArea;
        scriptDeleteButton.labels = label;
        scriptDeleteButton.onclick = scriptsUI.scriptDeleteClick;

        scriptExecuteButton.scriptDeleteButton = scriptDeleteButton;
        scriptsLi.href.scriptDeleteButton = scriptDeleteButton;


        /*
        var scriptExecuteButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptExecuteButton.type = "button";
        scriptExecuteButton.id = script.thing.thingnickname + "_" + script.name + "executionButton";
        scriptExecuteButton.className = "btn btn-sm btn-success";
        scriptExecuteButton.script = script;
        scriptExecuteButton.textArea = textArea;
        scriptExecuteButton.labels = label;
        scriptExecuteButton.onclick = scriptsUI.scriptExecuteClick;
        scriptExecuteButton.appendChild(document.createElement("i")).className = "fa fa-bolt";
        var scriptExecuteButtonSpan = scriptExecuteButton.appendChild(document.createElement("span"));
        scriptExecuteButtonSpan.innerHTML = " " + getLang("scriptexecute");
        */

        
/*
        var scriptPauseButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptPauseButton.type = "button";
        scriptPauseButton.id = script.thing.thingnickname + "_" + script.name + "pauseButton";
        scriptPauseButton.className = "btn btn-sm btn-warning";
        scriptPauseButton.script = script;
        scriptPauseButton.thing = script.thing; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptPauseButton.scriptExecuteButton = scriptExecuteButton;
        scriptPauseButton.textArea = textArea;
        scriptPauseButton.labels = label;
        scriptPauseButton.onclick = scriptsUI.scriptPauseClick;
        scriptPauseButton.appendChild(document.createElement("i")).className = "fa fa-pause";
        var scriptPauseButtonSpan = scriptPauseButton.appendChild(document.createElement("span"));
        scriptPauseButtonSpan.innerHTML = " " + getLang("scriptpause");
        */

        /*

        var scriptDebugButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptDebugButton.type = "button";
        scriptDebugButton.id = script.thing.thingnickname + "_" + script.name + "pauseButton";
        scriptDebugButton.className = "btn btn-sm btn-warning";
        scriptDebugButton.script = script;
        scriptDebugButton.thing = script.thing;
        scriptDebugButton.scriptExecuteButton = scriptExecuteButton;
        scriptDebugButton.textArea = textArea;
        scriptDebugButton.labels = label;
        scriptDebugButton.onclick = scriptsUI.scriptDebugClick;
        scriptDebugButton.appendChild(document.createElement("i")).className = "fa fa-bug";
        scriptDebugButton.debugNext = false;
        var scriptDebugButtonSpan = scriptDebugButton.appendChild(document.createElement("span"));
        scriptDebugButtonSpan.innerHTML = " " + getLang("scriptstartdebug");
        */

        /*
        var scriptDeleteButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptDeleteButton.type = "button";
        scriptDeleteButton.id = script.thing.thingnickname + "_" + script.name + "deleteButton";
        scriptDeleteButton.className = "btn btn-sm btn-danger";
        scriptDeleteButton.script = script;
        scriptDeleteButton.thing = script.thing; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptDeleteButton.scriptExecuteButton = scriptExecuteButton;
        scriptDeleteButton.scriptPauseButton = scriptPauseButton;
        scriptDeleteButton.textArea = textArea;
        scriptDeleteButton.labels = label;
        scriptDeleteButton.onclick = scriptsUI.scriptDeleteClick;
        scriptDeleteButton.appendChild(document.createElement("i")).className = "fa fa-trash";
        var scriptDeleteButtonSpan = scriptDeleteButton.appendChild(document.createElement("span"));
        scriptDeleteButtonSpan.innerHTML = " " + getLang("scriptdelete");


        scriptExecuteButton.scriptDeleteButton = scriptDeleteButton;
        */

        var label = byteCodeCardDiv.appendChild(document.createElement('label'));
        label.id = script.thing.thingnickname + "_" + script.name + "label";
        label.for = script.thing.thingnickname + "_" + script.name + "textarea";
        scriptExecuteButton.label = label;

        var scriptStatusCardDiv = scriptHolder.appendChild(document.createElement('div'));
        scriptStatusCardDiv.className = "col-md-4";
        var scriptStatusCard = scriptStatusCardDiv.appendChild(document.createElement('div'));
        scriptStatusCard.className = "card bg-dark border-info mb-3";
        var scriptStatusCardHeader = scriptStatusCard.appendChild(document.createElement('div'));
        scriptStatusCardHeader.className = "card-header";
        scriptStatusCardHeader.innerText = script.name + " status";
        var scriptStatusCardBody = scriptStatusCard.appendChild(document.createElement('div'));
        scriptStatusCardBody.className = "card-body";
        var scriptStatusPre = scriptStatusCardBody.appendChild(document.createElement('pre'));
        var statusLabel = scriptStatusPre.appendChild(document.createElement('label'));
        statusLabel.id = script.thing.thingnickname + "_" + script.name + "statuslabel";
        scriptsUI.buildScriptStatus(script);

    },

    onScriptChange: function (script) {
        var scriptsAhref = document.getElementById(script.thing.thingnickname + "_" + script.name + "href");
        if (scriptsAhref == undefined) return;
        scriptsAhref.textSpan.innerHTML = script.name;

        switch (parseInt(script.status)) {
            case stopScriptStatus: scriptsAhref.style.color = ""; break;
            case runScriptStatus: scriptsAhref.style.color = theme.success; break;
            case compilerScriptErrorStatus: scriptsAhref.style.color = theme.warning; break;
            default:
                scriptsAhref.style.color = theme.danger; break;
        }


        var textArea = document.getElementById(script.thing.thingnickname + "_" + script.name + "textarea");
        var label = document.getElementById(script.thing.thingnickname + "_" + script.name + "label");
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

        if (lineNum < 0) return;
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
            scriptsService.startDebug(scriptDebugButton.script);
        }
        else {
            scriptsService.debugNext(scriptDebugButton.script);

        }
    },

    buildScriptStatus: function (script) {
        var statusLabel = document.getElementById(script.thing.thingnickname + "_" + script.name + "statuslabel");
        statusLabel.innerHTML = "<b>Status: </b>" + script.status + "\n" +
            "<b>debuglinenumber: </b>" + script.debuglinenumber + "\n" +
            "<b>codecount: </b>" + script.codecount + "\n" +
            "<b>datacount: </b>" + script.datacount + "\n" +
            "<b>timequant: </b>" + script.timequant + "\n" +
            "<b>ip: </b>" + script.ip + "\n" +
            "<b>variables: </b>" + script.variables;
    },

    onScriptDelete: function (script) {
        var scriptsLi = document.getElementById(script.thing.thingnickname + "_" + script.name + "li");
        scriptsLi.parentElement.removeChild(scriptsLi);
        scriptsLi.innerHTML = "";

        var scriptsPanel = document.getElementById(script.thing.thingnickname + "_" + script.name + "panel");
        scriptsPanel.parentElement.removeChild(scriptsPanel);
        scriptsPanel.innerHTML = "";

        var scriptsSubmenuUl = document.getElementById(script.thing.thingnickname + "scriptssubmenu");
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

        var thingPanelHRef = document.getElementById(script.thing.thingnickname + "thingPropsHref");
        var thingPropsPanel = document.getElementById(script.thing.thingnickname + "thingPropsPanel");
        var event = {
            currentTarget: thingPanelHRef
        }
        scriptsUI.driverAnchorClick(event);
        $(thingPanelHRef).toggleClass("active");
        $(thingPropsPanel).toggleClass("active show");
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


        scriptsService.createOrReplace(script, scriptsUI.executeScriptAsyncReciever, scriptExecuteButton);
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
            script.thing.networkStatus = NET_ONLINE;
            scriptsService.refresh(script.thing);
            label.style.color = theme.success;
            label.innerText = "execute-OK";

        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (HTTPResult.indexOf("reponse") != -1) {
                script.thing.networkStatus = NET_ERROR;
            }
            else {
                script.thing.networkStatus = NET_OFFLINE;
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

        scriptsService.delete(script, scriptsUI.scriptDeleteAsyncReciever, scriptDeleteButton);
        return false;
    },

    scriptDeleteAsyncReciever: function (HTTPResult, sender) {

        var scriptExecuteButton = sender;
        var label = scriptExecuteButton.label;
        var thing = scriptExecuteButton.thing;

        if (!HTTPResult.indexOf("%error") == 0) {
            thing.networkStatus = NET_ONLINE; //UI редактора скрипта удалит onScriptDelete
            scriptsService.refresh(thing);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат


            if (HTTPResult.indexOf("reponse") != -1) {
                thing.networkStatus = NET_ERROR;
            }
            else {
                thing.networkStatus = NET_OFFLINE;
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
        newScriptDialog.thing = scriptsAddAhref.thing;
        newScriptDialog.appendInput(createDialogInput("addscriptInput", getLang("addscriptname"), ""));

        newScriptDialog.onOK = scriptsUI.createScriptUIClick;
        newScriptDialog.show();

        return false;
    },

    createScriptUIClick: function (newScriptDialog) {

        var thing = newScriptDialog.thing;
        var addscriptInput = newScriptDialog.getChild("addscriptInput");
        if (addscriptInput.value === "") {
            newScriptDialog.errorLabel.innerText = getLang("scriptnameempty");
            return;
        }

        var script = createScript(thing);
        script.name = addscriptInput.value;
        scriptsService.createOrReplace(script, scriptsUI.createScriptAsynReciever, newScriptDialog);

        return false;

    },

    createScriptAsynReciever: function (HTTPResult, newScriptDialog) {
        var thing = newScriptDialog.thing;

        if (!HTTPResult.indexOf("%error") == 0) {
            thing.networkStatus = NET_ONLINE;
            newScriptDialog.hide();
            scriptsService.refresh(thing);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (HTTPResult.indexOf("reponse") != -1) {
                thing.networkStatus = NET_ERROR;
            }
            else {
                thing.networkStatus = NET_OFFLINE;
            }
            newScriptDialog.errorLabel.innerText = HTTPResult;
        }
    }
}
