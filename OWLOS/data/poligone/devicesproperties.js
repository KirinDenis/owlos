var parsedDevices = "";

function requestDevicesProperties() {
    var httpResult = httpGet(host + "getalldevicesproperties");
    if (httpResult != "%error") {
        parsedDevices = httpResult.split("\n");
    }
    else {
        parsedDevices = "";
    }
}

function requestDevicesPropertiesAsync(asyncReciever) {
    httpGetAsyncWithReciever(host + "getalldevicesproperties", devicePropertiesAsyncReciever, asyncReciever);
}

function devicePropertiesAsyncReciever(httpResult, asyncReciever) {
    if (httpResult != "%error") {
        parsedDevices = httpResult.split("\n");
    }
    else {
        parsedDevices = "";
    }
    if (asyncReciever != null) {
        asyncReciever();
    }
}


function renderDevicesProperties() {

    requestDevicesProperties();
    if (parsedDevices !== "") {

        var devicesAnchors = document.getElementById("devicesAnchors");
        devicesAnchors.innerHTML = "";
        var devicesPanel = document.getElementById("devicesPanel");
        devicesPanel.innerHTML = "";

        var addDeviceButton = devicesAnchors.appendChild(document.createElement('button'));
        addDeviceButton.className = "btn btn-success";
        addDeviceButton.type = "button";
        addDeviceButton.setAttribute("data-toggle", "modal");
        addDeviceButton.setAttribute("data-target", "#addDeviceModal");
        addDeviceButton.onclick = addDeviceClick;
        addDeviceButton.innerText = "add device";

        var table;
        var tbody;
        var currentId;
        var propCount;
        for (var i = 0; i < parsedDevices.length; i++) {
            if (parsedDevices[i] === "") continue;
            if (parsedDevices[i].includes("properties for:")) {
                propCount = 1;
                currentId = parsedDevices[i].split(":")[1];

                var anchorHref = devicesAnchors.appendChild(document.createElement('button'));
                anchorHref.type = "button";
                anchorHref.href = "#" + currentId;
                anchorHref.onclick = deviceClick;
                anchorHref.innerText = currentId;
                anchorHref.className = "btn btn-default";

                var div = devicesPanel.appendChild(document.createElement('div'));
                div.className = "col-md-12 devicediv";
                div.id = currentId;
                var deviceDiv = div.appendChild(document.createElement('div'));
                //deviceDiv.className = "card mb-3 border-0 devicecard";
                deviceDiv.className = "col-md-12 border-0 devicecard";
                var deviceDivHeader = deviceDiv.appendChild(document.createElement('div'));
                deviceDivHeader.className = "card-header";
                deviceDivHeader.innerText = currentId;
                var tableDiv = deviceDiv.appendChild(document.createElement('div'));
                tableDiv.className = "card-body";

                table = tableDiv.appendChild(document.createElement('table'));
                table.className = "table table-striped table-sm";
                table.id = "devicetable" + currentId;
                table.cellspacing = "0";

                var thead = table.appendChild(document.createElement('thead'));
                var tr = thead.appendChild(document.createElement('tr'));

                var th = tr.appendChild(document.createElement('th'))
                th.className = "w-2";
                th.innerText = "#";
                th.scope = "col";

                th = tr.appendChild(document.createElement('th'))
                th.className = "w-10";
                th.innerText = "property";
                th.scope = "col";


                th = tr.appendChild(document.createElement('th'))
                th.className = "w-25";
                th.innerText = "value";
                th.scope = "col";


                th = tr.appendChild(document.createElement('th'))
                th.className = "w-25";
                th.innerText = "new value";
                th.scope = "col";


                th = tr.appendChild(document.createElement('th'))
                th.className = "w-5";
                th.scope = "col";


                th = tr.appendChild(document.createElement('th'))
                th.className = "w-5";
                th.scope = "col";


                var anchorTopHref = th.appendChild(document.createElement('a'));
                anchorTopHref.href = "#top";
                anchorTopHref.innerText = "top";

                tbody = table.appendChild(document.createElement('tbody'));

            }
            else {
                var parsedProp = parsedDevices[i].split("=");
                var propertyName = parsedProp[0];
                var _value = parsedProp[1].split("//");
                var propertyValue = _value[0];
                var propertyType = "";
                if (_value.length > 1) {
                    propertyType = _value[1];
                }


                var tr = tbody.appendChild(document.createElement('tr'));
                var th = tr.appendChild(document.createElement('th'));
                th.scope = "row";
                th.innerHTML = propCount;
                propCount++;

                var nameTd = tr.appendChild(document.createElement('td'));
                var getPropHref = nameTd.appendChild(document.createElement('a'));

                if (propertyType.includes("s")) { //selected
                    getPropHref.className = "text-warning"; //"btn btn-success"; 
                    //getPropHref.className = "badge badge-warning font-weight-bold"; 
                    //getPropHref.style.margin = "4px 0px 0px 0px";
                }
                getPropHref.href = host + "getdeviceproperty?id=" + currentId + "&property=" + propertyName;
                getPropHref.target = "_blank";

                getPropHref.setAttribute("data-toggle", "tooltip");
                getPropHref.setAttribute("data-placement", "top");
                getPropHref.title = "Get '" + propertyName + "' device property value [RESTful API execute]";
                getPropHref.innerText = propertyName;
                getPropHref.id = "getPropHref" + propertyName;

                var valueTd = tr.appendChild(document.createElement('td'));
                var valueSpan = valueTd.appendChild(document.createElement('span'));
                valueSpan.className = "align-middle";
                var setPropHref = valueSpan.appendChild(document.createElement('a'));
                setPropHref.href = host + "setdeviceproperty?id=" + currentId + "&property=" + propertyName + "&value=" + propertyValue;
                setPropHref.target = "_blank";
                setPropHref.setAttribute("data-toggle", "tooltip");
                setPropHref.setAttribute("data-placement", "top");
                setPropHref.title = "Set '" + propertyName + "' device property value [RESTful API execute][return '1' if success]";

                if (propertyType.includes("b")) {
                    if (propertyValue === "1") setPropHref.innerText = "true";
                    else
                        setPropHref.innerText = "false";
                }
                else {
                    setPropHref.innerText = propertyValue;
                }

               // if (propertyType.includes("s")) { //selected
               //     setPropHref.className = "font-weight-bold";
//
  //              }

                //var editTd = tr.appendChild(document.createElement('td'));
                var edit = createValueEdit(tr.appendChild(document.createElement('td')), propertyName, propertyValue, propertyType);

                var setButtonTd = tr.appendChild(document.createElement('td'));
                var getButtonTd = tr.appendChild(document.createElement('td'));


                if (autorefreshbutton.data === "off") {

                    var getSpan = getButtonTd.appendChild(document.createElement('a'));
                    getSpan.className = "badge badge-info";
                    getSpan.href = "#";
                    getSpan.style.margin = "4px 0px 0px 0px";
                    getSpan.id = "_" + propertyName;
                    getSpan.deviceid = currentId;
                    getSpan.valueTd = setPropHref;
                    getSpan.propname = propertyName;
                    getSpan.onclick = getDeviceClick;
                    getSpan.innerText = "get";

                    if (!propertyType.includes("r")) {
                        getSpan.edit = edit;
                        var span = setButtonTd.appendChild(document.createElement('a'));
                        span.className = "badge badge-warning";
                        span.href = "#";
                        span.style.margin = "4px 0px 0px 0px";
                        span.id = "_" + propertyName;
                        span.deviceid = currentId;
                        span.edit = edit;
                        span.valueTd = setPropHref;
                        span.onclick = setDeviceClick;
                        span.innerText = "set";
                        span.setAttribute("data-toggle", "tooltip");
                        span.setAttribute("data-placement", "top");
                    }


                }
            }
        }
        //OK parse data
        var devices = getParsedDevices();
        for (var i = 0; i < devices.length; i++) {
            $("#devicetable" + devices[i]).DataTable({ searching: false, paging: false, info: false });
        }
        $('.dataTables_length').addClass('bs-select');
        $('[data-toggle="tooltip"]').tooltip();

    }
    else {
        parsedDevices = "";
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getParsedDevices() {

    var result = [];
    if (parsedDevices !== "") {
        for (var i = 0; i < parsedDevices.length; i++) {
            if (parsedDevices[i] === "") continue;
            if (parsedDevices[i].includes("properties for:")) {
                result.push(parsedDevices[i].split(":")[1]);
            }
        }
    }
    return result;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getParsedDeviceProperty(id, property) {
    if (parsedDevices !== "") {
        for (var i = 0; i < parsedDevices.length; i++) {
            if (parsedDevices[i] === "") continue;
            if (parsedDevices[i].includes("properties for:" + id)) {
                for (var j = i + 1; j < parsedDevices.length; j++) {
                    if (parsedDevices[j].includes("properties for:")) { break; }
                    if (parsedDevices[j].includes(property + "=")) {
                        return parsedDevices[j].split("=")[1].split("//")[0];
                    }
                }
                break;
            }
        }
    }
    return "";
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function appendDevicePins(valueSelect) {
    var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "not used";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D0";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D1";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D2";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D3";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D4";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D5";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D6";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D7";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D8";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "D9";
    valueSelectOption = valueSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "A0";

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function addDeviceClick(event) {
    event.stopPropagation();
    var addDevicePanel = document.getElementById("addDevicePanel");
    addDevicePanel.innerHTML = "";
    var modalFade = addDevicePanel.appendChild(document.createElement("div"));

    modalFade.className = "modal fade";
    modalFade.id = "addDeviceModal";
    modalFade.tabindex = "-1";
    modalFade.setAttribute("role", "dialog");
    modalFade.setAttribute("aria-labelledby", "addDeviceModalLabel");
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
    modalTitle.id = "addDeviceModalLabel";
    modalTitle.innerText = "Add new device";

    var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));

    closeHeaderButton.type = "button"
    closeHeaderButton.className = "close"
    closeHeaderButton.setAttribute("data-dismiss", "modal");
    closeHeaderButton.setAttribute("aria-label", "Close");

    var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerText = "x"

    var modalBody = modalContent.appendChild(document.createElement("div"));
    modalBody.className = "modal-body";
    //body ---------------------------
    //var form = modalBody.appendChild(document.createElement("form"));


    var formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    var label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "typeSelect");
    label.innerText = "device";
    var inputDiv = formGroup.appendChild(document.createElement("div"));

    var typeSelect = formGroup.appendChild(document.createElement('select'));
    typeSelect.className = "form-control form-control-sm";
    typeSelect.id = "typeSelect";

    var valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Temperature";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Humidity";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Light";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Smoke";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Motion";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Sensor";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Stepper";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "LCD";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Actuator";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Opto";
    valueSelectOption = typeSelect.appendChild(document.createElement('option'));
    valueSelectOption.innerText = "Valve";


    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "idEdit");
    label.innerText = "id";
    var idEdit = formGroup.appendChild(document.createElement('input'));
    idEdit.className = "form-control form-control-sm";
    idEdit.id = "idInput";

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin1Select");
    label.innerText = "pin1";
    var pin1Select = formGroup.appendChild(document.createElement('select'));
    pin1Select.className = "form-control form-control-sm";
    pin1Select.id = "pin1Select";
    appendDevicePins(pin1Select);

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin2Select");
    label.innerText = "pin2";
    var pin2Select = formGroup.appendChild(document.createElement('select'));
    pin2Select.className = "form-control form-control-sm";
    pin2Select.id = "pin2Select";
    appendDevicePins(pin2Select);

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin3Select");
    label.innerText = "pin3";
    var pin3Select = formGroup.appendChild(document.createElement('select'));
    pin3Select.className = "form-control form-control-sm";
    pin3Select.id = "pin3Select";
    appendDevicePins(pin3Select);

    formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";
    label = formGroup.appendChild(document.createElement("label"));
    label.setAttribute("for", "pin4Select");
    label.innerText = "pin4";
    var pin4Select = formGroup.appendChild(document.createElement('select'));
    pin4Select.className = "form-control form-control-sm";
    pin4Select.id = "pin4Select";
    appendDevicePins(pin4Select);



    var alertDiv = modalBody.appendChild(document.createElement('div'));

    var modalFooter = modalContent.appendChild(document.createElement("div"));
    modalFooter.className = "modal-footer";

    var addButton = modalFooter.appendChild(document.createElement("button"));
    addButton.type = "button";
    addButton.className = "btn btn-success";
    addButton.id = "addDeviceModalButton";
    //   addButton.setAttribute("data-dismiss", "modal");
    addButton.typeSelect = typeSelect;
    addButton.idEdit = idEdit;
    addButton.pin1Select = pin1Select;
    addButton.pin2Select = pin2Select;
    addButton.pin3Select = pin3Select;
    addButton.pin4Select = pin4Select;
    addButton.alertDiv = alertDiv;
    addButton.onclick = doAddDeviceClick;
    addButton.innerText = "add";

    var closeButton = modalFooter.appendChild(document.createElement("button"));
    closeButton.type = "button";
    closeButton.className = "btn btn-info";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.innerText = "cancel";

    $("#addDeviceModal").modal('show');

    return false;
}

function doAddDeviceClick() {
    event.stopPropagation();
    var addButton = event.target;

    addButton.className = "btn btn-warning";
    addButton.value = 'do...';
    addButton.disable = true;

    var httpResult = addDevice(addButton.typeSelect.selectedIndex, addButton.idEdit.value, addButton.pin1Select.value, addButton.pin2Select.value, addButton.pin3Select.value, addButton.pin4Select.value);

    if (httpResult == 1) {
        $("#addDeviceModal").modal('hide');
        renderDevicesProperties();
    }
    else {
        addButton.alertDiv.innerHTML = "";
        var addDeviceAlert = addButton.alertDiv.appendChild(document.createElement('div'));
        addDeviceAlert.className = "alert alert-danger";
        addDeviceAlert.role = "alert";
        addDeviceAlert.innerText = httpResult;

        addButton.className = "btn btn-success";
        addButton.value = 'add';
    }
    addButton.disable = false;
    return false;

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function setDeviceClick(event) {


    event.stopPropagation();
    var button = event.target;

    var edit = button.edit;
    var value = edit.value;
    if (edit.proptype.includes("b")) // boolean 
    {
        if (edit.selectedIndex == 0) value = "1";
        else value = "0";
    }

    button.className = "badge badge-warning";
    button.innerText = 'do...';
    button.disable = true;

    var httpResult = setDeviceProperty(button.deviceid, edit.propname, value);


    if (httpResult == 1) {
        button.className = "badge badge-success";
        button.innerText = 'set';
        button.valueTd.innerText = edit.value;
    }
    else {
        button.className = "badge badge-danger";
        button.innerText = "bad:\n" + httpResult;
    }
    button.disable = false;
    //httpResult = 1 if OK
    return false;
}

function getDeviceClick(event) {

    event.stopPropagation();
    var button = event.target;

    var edit = button.edit;

    button.className = "badge badge-warning";
    button.innerText = 'do...';
    button.disable = true;

    var httpResult = getDeviceProperty(button.deviceid, button.propname);

    if (!httpResult.includes("error")) {
        button.className = "badge badge-success";
        button.innerText = 'get';
        if (edit != null) {
            if (edit.proptype.includes("b")) // boolean 
            {
                if (httpResult === "1") edit.selectedIndex = 0;
                else edit.selectedIndex = 1;
            }
            else {
                edit.value = httpResult;
            }
            button.valueTd.innerText = edit.value;
        }
        else {
            button.valueTd.innerText = httpResult;
        }
    }
    else {
        button.className = "badge badge-danger";
        button.innerText = "bad:\n" + httpResult;
    }
    button.disable = false;
    //httpResult = 1 if OK
    return false;
}


function deviceClick(event) {
    var button = event.target;
    document.location = button.href;
    return false;
}

