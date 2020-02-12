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

    appendDeviceDigitalOnlyPins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
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
    },

    appendDeviceAnalogOnlyPins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "A0";
    },


    appendDeviceNotUsedPins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("notused");
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
        typeSelect.onchange = devicesUI.pinsAndWidget;


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
        formGroup.id = "pin1Div";
        formGroup.style.display = "none";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin1Select");
        label.innerText = getLang("pin") + " 1";
        var pin1Select = formGroup.appendChild(document.createElement('select'));
        pin1Select.className = "form-control form-control-sm";
        pin1Select.id = "pin1Select";
        devicesUI.appendDeviceNotUsedPins(pin1Select);

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        formGroup.id = "pin2Div";
        formGroup.style.display = 'none';
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin2Select");
        label.innerText = getLang("pin") + " 2";
        var pin2Select = formGroup.appendChild(document.createElement('select'));
        pin2Select.className = "form-control form-control-sm";
        pin2Select.id = "pin2Select";
        devicesUI.appendDeviceNotUsedPins(pin2Select);

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        formGroup.id = "pin3Div";
        formGroup.style.display = 'none';
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin3Select"); 
        label.innerText = getLang("pin") + " 3";
        var pin3Select = formGroup.appendChild(document.createElement('select'));
        pin3Select.className = "form-control form-control-sm";
        pin3Select.id = "pin3Select";
        devicesUI.appendDeviceNotUsedPins(pin3Select);

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        formGroup.id = "pin4Div";
        formGroup.style.display = 'none';
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin4Select");
        label.innerText = getLang("pin") + " 4";
        var pin4Select = formGroup.appendChild(document.createElement('select'));
        pin4Select.className = "form-control form-control-sm";
        pin4Select.id = "pin4Select";
        devicesUI.appendDeviceNotUsedPins(pin4Select);

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
        addWidgetGroup.style.display = "none"; //"block"
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

        event = { currentTarget: typeSelect };
        devicesUI.pinsAndWidget(event);

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

    pinsAndWidget: function (event) {
        var deviceSelected = event.currentTarget;
        var maxPinsAmount = 4;
        var currentDiv = "";
        var currentOptions = "";
        var pinsInfo = [];
        
        switch (deviceSelected.selectedIndex+1) {
            case 1:
                pinsInfo.push("digital");
                console.log("dht");
                break; 
            case 2: 
                pinsInfo.push("analog");
                console.log("light sensor");
                break;
            case 3:
                pinsInfo.push("analog");
                console.log("smoke detector");
                break;
            case 4:
                pinsInfo.push("digital");
                console.log("motion detector");
                break;
            case 5:
                pinsInfo.push("digital");
                console.log("sensor device");
                break;
            case 6:
                pinsInfo.push("digital", "digital", "digital", "digital");
                console.log("stepper device");
                break;
            case 7:
                pinsInfo.push("digital", "digital");
                console.log("LCD");
                break;
            case 8:
                pinsInfo.push("digital");
                console.log("Actuator");
                break;
            case 9:
                pinsInfo.push("digital", "digital");
                console.log("Opto device");
                break;
            case 10:
                pinsInfo.push("digital", "digital", "analog");
                console.log("valve device");
                break;


            default:
                pinsInfo.push("notused");
                console.log('default');
        }

        for (var pinsIndex = 0; pinsIndex < maxPinsAmount; pinsIndex++){

            var divId = pinsIndex + 1;

            currentDiv = document.getElementById("pin" + divId + "Div");

            if (currentDiv !== null) {

                if (pinsIndex < pinsInfo.length) {
                    currentDiv.style.display = 'block';
                }
                else {
                    currentDiv.style.display = 'none';
                }
            }

            currentOptions = document.getElementById("pin" + divId + "Select");

            if (currentOptions !== null) {

                currentOptions.options.length = 0;

                if (pinsIndex < pinsInfo.length) {
                    switch (pinsInfo[pinsIndex]) {
                        case "digital":
                            devicesUI.appendDeviceDigitalOnlyPins(currentOptions);
                            console.log("digital");
                            break;
                        case "analog":
                            devicesUI.appendDeviceAnalogOnlyPins(currentOptions);
                            console.log("analog");
                            break;
                        case "universal":
                            devicesUI.appendDevicePins(currentOptions);
                            console.log("universal");
                            break;
                        default:
                            devicesUI.appendDeviceNotUsedPins(currentOptions);
                            console.log('notused');
                    }
                }
                else {
                    devicesUI.appendDeviceNotUsedPins(currentOptions);
                }
            }



        }

        pinsInfo.length = 0;
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

            var autoAddWidgetCheckBox = document.getElementById("autoAddWidget");
            if (autoAddWidgetCheckBox !== null) {

                if (autoAddWidgetCheckBox.checked == true) {

                    var devicesWidgetsPanel = document.getElementById("devicesWidgetsPanel");

                    var defaultWidgets = [];
                    var widgetLayer = "";
                    var widgetWrapper = "";

                    switch (addButton.typeSelect.selectedIndex + 1) {

                        case 1:

                            defaultWidgets.push({
                                widgetType: "temperature",
                                devicePropertyName: "temperature"
                            }, {
                                widgetType: "humidity",
                                devicePropertyName: "humidity"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "humidityhistorydata"
                            },{
                                    widgetType: "historydatagraph",
                                    devicePropertyName: "temperaturehistorydata"
                            });


                            console.log("dht widgets");
                            break;
                        case 2:

                            defaultWidgets.push({
                                widgetType: "light",
                                devicePropertyName: "light"
                            });


                            console.log("light sensor widgets");
                            break;
                        case 3:

                            defaultWidgets.push({
                                widgetType: "smoke",
                                devicePropertyName: "smoke"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "historydata"
                            });


                            console.log("smoke detector widgets");
                            break;
                        case 4:

                            defaultWidgets.push({
                                widgetType: "motion",
                                devicePropertyName: "motion"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "historydata"
                            });

                            console.log("motion detector");
                            break;
                        case 5:

                            defaultWidgets.push({
                                widgetType: "sensor",
                                devicePropertyName: "sensor"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "historydata"
                            });

                            console.log("sensor device");
                            break;
                        case 6:

                            defaultWidgets.push({
                                widgetType: "value",
                                devicePropertyName: "position"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "historydata"
                            });

                            console.log("stepper device");
                            break;
                        case 7:
                            defaultWidgets.push({
                                widgetType: "lcd",
                                devicePropertyName: "text"
                            });
                            
                            console.log("LCD");
                            break;
                        case 8:

                            defaultWidgets.push({
                                widgetType: "actuator",
                                devicePropertyName: "data"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "historydata"
                            });

                            console.log("Actuator");
                            break;
                        case 9:

                            defaultWidgets.push({
                                widgetType: "value",
                                devicePropertyName: "data"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "historydata"
                            });


                            console.log("Opto device");
                            break;
                        case 10:

                            defaultWidgets.push({
                                widgetType: "value",
                                devicePropertyName: "position"
                            }, {
                                widgetType: "historydatagraph",
                                devicePropertyName: "historydata"
                            });

                            console.log("valve device");
                            break;

                        default:
                            alert("Нет таких значений");
                    }

                    if (defaultWidgets.length !== 0) {
                        for (var defaultWidgetIndex = 0; defaultWidgetIndex < defaultWidgets.length; defaultWidgetIndex++) {
                            widgetLayer = WidgetsLayer.getWidgetById(defaultWidgets[defaultWidgetIndex].widgetType); ///тип виджета (widget id)
                            if (widgetLayer !== undefined) {

                                widgetWrapper = new widgetLayer.widget(devicesWidgetsPanel, undefined, undefined, configProperties.dashboards[0].widgets[0], undefined);
                                widgetWrapper.offlineStarter(devicesWidgetsPanel, addButton.idEdit.value, defaultWidgets[defaultWidgetIndex].devicePropertyName);
                                widgetWrapper.widget.onchange = config.onWidgetChange;
                                widgetWrapper.widget.ondelete = config.onWidgetDelete;
                                config.addWidget("main", addButton.idEdit.value, defaultWidgets[defaultWidgetIndex].devicePropertyName, defaultWidgets[defaultWidgetIndex].widgetType, widgetWrapper.widget.id, widgetWrapper.widget.properties);

                            }
                        }
                    }

                    defaultWidgets.length = 0;
  
                }
            }


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
 //TODO сменить на "block" давая возможность выбрать свойство и виджет 
            divGroup.style.display = "none";
        }
        else {

            divGroup.style.display = "none";
        }

        return true;
    }
}
