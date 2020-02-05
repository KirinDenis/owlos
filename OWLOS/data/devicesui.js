var devicesUI = {


    appendDevicePins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("notused");
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

    },

    addDeviceClick: function (event) {
        event.stopPropagation();
        settingsUI.deviceAnchorClick(event);

        var addDeviceAhref = event.currentTarget;
        var node = addDeviceAhref.node;

        makeModalDialog("resetPanel", "addDevice", getLang("adddevicedigalog") + " " + node.nodenickname, "");
        var modalFooter = document.getElementById("addDeviceModalFooter");
        var modalBody = document.getElementById("addDeviceModalBody");

        var titleDeviceText = modalBody.appendChild(document.createElement("p"));
        titleDeviceText.innerHTML = getLang("device");
        titleDeviceText.className = "text-center";

        var formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";

        var label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "typeSelect");
        label.innerText = getLang("devicetype");
        var inputDiv = formGroup.appendChild(document.createElement("div"));

        var typeSelect = formGroup.appendChild(document.createElement('select'));
        typeSelect.className = "form-control form-control-sm";
        typeSelect.id = "typeSelect";


        var valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("dht");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("light");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("smoke");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("motion");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("sensor");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("stepper");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("lcd");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("actuator");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("opto");
        valueSelectOption = typeSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("valve");


        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "idEdit");
        label.innerText = getLang("deviceid");
        var idEdit = formGroup.appendChild(document.createElement('input'));
        idEdit.className = "form-control form-control-sm";
        idEdit.id = "idInput";
        idEdit.placeholder = getLang("deviceidplaceholder");

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin1Select");
        label.innerText = getLang("pin") + " 1";
        var pin1Select = formGroup.appendChild(document.createElement('select'));
        pin1Select.className = "form-control form-control-sm";
        pin1Select.id = "pin1Select";
        devicesUI.appendDevicePins(pin1Select);

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin2Select");
        label.innerText = getLang("pin") + " 2";
        var pin2Select = formGroup.appendChild(document.createElement('select'));
        pin2Select.className = "form-control form-control-sm";
        pin2Select.id = "pin2Select";
        devicesUI.appendDevicePins(pin2Select);

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin3Select");
        label.innerText = getLang("pin") + " 3";
        var pin3Select = formGroup.appendChild(document.createElement('select'));
        pin3Select.className = "form-control form-control-sm";
        pin3Select.id = "pin3Select";
        devicesUI.appendDevicePins(pin3Select);

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin4Select");
        label.innerText = getLang("pin") + " 4";
        var pin4Select = formGroup.appendChild(document.createElement('select'));
        pin4Select.className = "form-control form-control-sm";
        pin4Select.id = "pin4Select";
        devicesUI.appendDevicePins(pin4Select);

        //Checkbox for auto widget adding
        var checkBoxDiv = modalBody.appendChild(document.createElement("div"));
        checkBoxDiv.className = "custom-control custom-checkbox";


        var checkBoxInput = checkBoxDiv.appendChild(document.createElement("input"));
        checkBoxInput.type = "checkbox";
        checkBoxInput.className = "custom-control-input";
        checkBoxInput.id = "autoAddWidget";
        checkBoxInput.checked = true;
        checkBoxInput.onchange = devicesUI.checkBoxClick;

        var checkBoxLabel = checkBoxDiv.appendChild(document.createElement("label"));
        checkBoxLabel.className = "custom-control-label";
        checkBoxLabel.setAttribute("for", "autoAddWidget");
        checkBoxLabel.innerHTML = getLang("autoaddwidget");

        var addWidgetGroup = modalBody.appendChild(document.createElement("div"));
        addWidgetGroup.style.display = "block";
        addWidgetGroup.id = "addWidgetGroup";

        var titleWidgetText = addWidgetGroup.appendChild(document.createElement("p"));
        titleWidgetText.innerHTML = getLang("widget");
        titleWidgetText.className = "text-center";
        
        //device properties select
        var formGroupDeviceProperties = addWidgetGroup.appendChild(document.createElement("div"));
        var devicePropLabel = formGroupDeviceProperties.appendChild(document.createElement("label"));
        devicePropLabel.setAttribute("for", "devicePropSelect");
        devicePropLabel.innerText = getLang("devicesporplist");
        var devicePropSelect = formGroupDeviceProperties.appendChild(document.createElement('select'));
        devicePropSelect.className = "form-control form-control-sm";
        devicePropSelect.id = "devicePropertySelected";

        //widgets select 
        var formGroupWidgetSelect = addWidgetGroup.appendChild(document.createElement("div"));
        var widgetLabel = formGroupWidgetSelect.appendChild(document.createElement("label"));
        widgetLabel.setAttribute("for", "widgetSelect");
        widgetLabel.innerText = getLang("widgetslist");
        var widgetSelect = formGroupWidgetSelect.appendChild(document.createElement('select'));
        widgetSelect.className = "form-control form-control-sm";
        widgetSelect.id = "widgetTypeSelected";



        var alertDiv = modalBody.appendChild(document.createElement('div'));

       // var modalFooter = modalContent.appendChild(document.createElement("div"));
       // modalFooter.className = "modal-footer";



        var addButton = modalFooter.appendChild(document.createElement("button"));
        addButton.type = "button";
        addButton.className = "btn btn-success btn-sm";
        addButton.id = "addDeviceModalButton";
        addButton.node = node;
        //   addButton.setAttribute("data-dismiss", "modal");
        addButton.typeSelect = typeSelect;
        addButton.idEdit = idEdit;
        addButton.pin1Select = pin1Select;
        addButton.pin2Select = pin2Select;
        addButton.pin3Select = pin3Select;
        addButton.pin4Select = pin4Select;
        addButton.alertDiv = alertDiv;
        addButton.onclick =  devicesUI.doAddDeviceClick;
        addButton.innerText = getLang("adddevicebutton");


        $("#addDeviceModal").modal('show');

        return false;
    },

    doAddDeviceClick: function (event) {
        event.stopPropagation();
        var addButton = event.currentTarget;
        var node = addButton.node;

        addButton.className = "btn btn-warning btn-sm";
        addButton.value = 'do...';
        addButton.disable = true;

        //TODO: decode Type from name 
        var httpResult = addDevice(node.host, addButton.typeSelect.selectedIndex + 1, addButton.idEdit.value, addButton.pin1Select.value, addButton.pin2Select.value, addButton.pin3Select.value, addButton.pin4Select.value);

        if (httpResult == 1) {
            $("#addDeviceModal").modal('hide');
            // renderDevicesProperties(); TODO model refresh
        }
        else {
            addButton.alertDiv.innerHTML = "";
            var addDeviceAlert = addButton.alertDiv.appendChild(document.createElement('div'));
            addDeviceAlert.className = "alert alert-danger";
            addDeviceAlert.role = "alert";
            addDeviceAlert.innerText = httpResult;

            addButton.className = "btn btn-success btn-sm";
            addButton.value = 'add';
        }
        addButton.disable = false;
        return false;

    },


    deviceClick: function (event) {
        var button = event.currentTarget;
        document.location = button.href;
        return false;
    },

    checkBoxClick: function (event) {
        var checkBox = event.currentTarget;
        var divGroup = document.getElementById("addWidgetGroup");

        if (checkBox.checked == true) {

            divGroup.style.display = "block";
        }
        else {

            divGroup.style.display = "none";
        }

        return true;
    }
}
