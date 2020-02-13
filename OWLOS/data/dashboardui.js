//Dashboard --------------------------------------------------------------------------------------------------------
var dashboardUI = {

    dashboardModeListners: [],
    dashboardViewMode: true,

    addDashboardModeListner: function (_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
        //check event listner and setup current network status 
        try {
            _event(_sender, this);
        } catch (exception) {
            console.error(exception);
            return; // don't add bad listner
        }
        dashboardUI.dashboardModeListners.push(event = { event: _event, sender: _sender });
    },

    onConfigLoad: function (configProperties) {


        var saveButtonPanel = document.getElementById("saveButtonPanel");

        var saveWidgetsButton = saveButtonPanel.appendChild(document.createElement('input'));
        saveWidgetsButton.className = "btn btn-warning btn-sm";
        saveWidgetsButton.type = "button";
        saveWidgetsButton.value = getLang("saveaddedwidget");
        saveWidgetsButton.hidden = true;
        saveWidgetsButton.id = "saveWidgetsButton";
        saveWidgetsButton.onclick = dashboardUI.saveAddedWidget;  
        config.onChange = dashboardUI.onConfigChange;


        var dashboardButtonsPanel = document.getElementById("dashboardButtonsPanel");
        var headerModeButton = dashboardButtonsPanel.appendChild(document.createElement('input'));
        headerModeButton.className = "btn btn-secondary btn-sm";
        headerModeButton.type = "button";
        headerModeButton.value = getLang("dashboardedit");
        headerModeButton.onclick = dashboardUI.changeDashboadMode;        

        var addWidgetButton = dashboardButtonsPanel.appendChild(document.createElement('input'));
        addWidgetButton.className = "btn btn-success btn-sm";
        addWidgetButton.type = "button";
        addWidgetButton.value = getLang("dashboardaddwidget");
        addWidgetButton.onclick = dashboardUI.addWidgetMode;

        var devicesWidgetsPanel = document.getElementById("devicesWidgetsPanel");
        
        for (var i = 0; i < configProperties.dashboards[0].widgets.length; i++) {
            try {
                var widgetProp = configProperties.dashboards[0].widgets[i];
                var widgetLayer = WidgetsLayer.getWidgetById(widgetProp.widgetWrapperId);
                if (widgetLayer != undefined) {
                    var widgetWrapper = new widgetLayer.widget(devicesWidgetsPanel, undefined, undefined, configProperties.dashboards[0].widgets[i], widgetProp.widgetProperties);
                                                          

                    widgetWrapper.offlineStarter(devicesWidgetsPanel, widgetProp.deviceId, widgetProp.deviceProperty);                    
                    widgetWrapper.widget.onchange = config.onWidgetChange;
                    widgetWrapper.widget.ondelete = config.onWidgetDelete;
                    widgetWrapper.widget.properties = widgetProp.widgetProperties;
                }
            }
            catch (exception) {
                console.error(exception);
                addToLogNL("ERROR starting exception: " + exception, 2);
                addToLogNL("ERROR at widget: " + widgetProp, 2);
            }
        }

    },

    changeDashboadMode: function (event) {
        var headerModeButton = event.currentTarget;
        dashboardUI.dashboardViewMode = !dashboardUI.dashboardViewMode;

        if (dashboardUI.dashboardViewMode) {
            headerModeButton.value = getLang("dashboardedit");
            headerModeButton.className = "btn btn-secondary btn-sm";
        }
        else {
            headerModeButton.value = getLang("dashboardview");
            headerModeButton.className = "btn btn-info btn-sm";
        }


        for (var k = 0; k < dashboardUI.dashboardModeListners.length; k++) {
            dashboardUI.dashboardModeListners[k].event(dashboardUI.dashboardModeListners[k].sender, dashboardUI.dashboardViewMode);
        }

        return false;
    },

    addWidgetMode: function () {

        makeModalDialog("resetPanel", "widget", getLang("dashboardaddwidget"), getLang("areYouSure"));
        var modalBody = document.getElementById("widgetModalBody");
        modalBody.innerHTML = "";
        var modalFooter = document.getElementById("widgetModalFooter");
        //Body form -----------------
        var formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";

        //device select 
        var deviceLabel = formGroup.appendChild(document.createElement("label"));
        deviceLabel.setAttribute("for", "deviceSelect");
        deviceLabel.innerText = getLang("nodeslist");
        var deviceSelect = formGroup.appendChild(document.createElement('select'));
        deviceSelect.className = "form-control form-control-sm";
        deviceSelect.id = "typeSelect";

        for (var node in configProperties.nodes) {

            for (var i = 0; i < configProperties.nodes[node].devices.length; i++) {
                var valueSelectOption = deviceSelect.appendChild(document.createElement('option'));
                valueSelectOption.innerText = getLang(configProperties.nodes[node].devices[i]._nodenickname + "/" + configProperties.nodes[node].devices[i]._id);
                valueSelectOption.device = configProperties.nodes[node].devices[i];
            }
        }

        deviceSelect.onchange = dashboardUI.onDeviceSelect;
        //device property select 

        var devicePropLabel = formGroup.appendChild(document.createElement("label"));
        devicePropLabel.setAttribute("for", "devicePropSelect");
        devicePropLabel.innerText = getLang("devicesporplist");
        var devicePropSelect = formGroup.appendChild(document.createElement('select'));
        devicePropSelect.className = "form-control form-control-sm";
        devicePropSelect.id = "typeSelect";

        devicePropSelect.onchange = dashboardUI.onDevicePropSelect;

        //widgets 
        //device select 
        var widgetLabel = formGroup.appendChild(document.createElement("label"));
        widgetLabel.setAttribute("for", "widgetSelect");
        widgetLabel.innerText = getLang("widgetslist");
        var widgetSelect = formGroup.appendChild(document.createElement('select'));
        widgetSelect.className = "form-control form-control-sm";
        widgetSelect.id = "typeSelect";



        deviceSelect.devicePropSelect = devicePropSelect;
        devicePropSelect.deviceSelect = deviceSelect;
        deviceSelect.widgetSelect = widgetSelect;

        var event = { currentTarget: deviceSelect };
        dashboardUI.onDeviceSelect(event);


        //end of Body form ----------
        var widgetButton = modalFooter.appendChild(document.createElement("button"));
        widgetButton.type = "button";
        widgetButton.className = "btn btn-sm btn-success";
        widgetButton.id = "widgetModalButton";
        widgetButton.deviceSelect = deviceSelect;
        widgetButton.onclick = dashboardUI.addWidgetClick;
        widgetButton.innerText = getLang("dashboardaddwidgetbutton");

        $("#widgetModal").modal('show');


    },

    onDeviceSelect: function (event) {
        var deviceSelect = event.currentTarget;
        var devicePropSelect = deviceSelect.devicePropSelect;
        var widgetSelect = deviceSelect.widgetSelect;
        var valueSelectOption = deviceSelect.options[deviceSelect.selectedIndex];


        var device = valueSelectOption.device;

        devicePropSelect.options.length = 0;
        for (var deviceProp in device) {
            if ((device[deviceProp].name == undefined) || (device[deviceProp].type == undefined)) continue;
            var propSelectOption = devicePropSelect.appendChild(document.createElement('option'));
            propSelectOption.innerText = device[deviceProp].name;
            propSelectOption.deviceProp = device[deviceProp];
        }

        var devicePropSelectOption = devicePropSelect.options[devicePropSelect.selectedIndex];
        var deviceProp = devicePropSelectOption.deviceProp;
        dashboardUI.refreshWidgetsSelect(widgetSelect, device, deviceProp);
    },

    onDevicePropSelect: function (event) {
        var devicePropSelect = event.currentTarget;
        var deviceSelect = devicePropSelect.deviceSelect;
        var widgetSelect = deviceSelect.widgetSelect;

        var deviceSelectOption = deviceSelect.options[deviceSelect.selectedIndex];
        var device = deviceSelectOption.device;
        var devicePropSelectOption = devicePropSelect.options[devicePropSelect.selectedIndex];
        var deviceProp = devicePropSelectOption.deviceProp;
        dashboardUI.refreshWidgetsSelect(widgetSelect, device, deviceProp);
    },

    refreshWidgetsSelect: function (widgetSelect, device, deviceProp) {
        widgetSelect.options.length = 0;
        for (var widget in WidgetsLayer) {
            if (WidgetsLayer[widget].widget == undefined) continue;
            if ((WidgetsLayer[widget].devicesTypes.indexOf(";" + device.type.value + ";") != -1) || (WidgetsLayer[widget].devicesTypes == "any")) {
                if ((WidgetsLayer[widget].devicesProperties.indexOf(";" + deviceProp.name + ";") != -1) || (WidgetsLayer[widget].devicesProperties == "any")) {
                    var widgetSelectOption = widgetSelect.appendChild(document.createElement('option'));
                    widgetSelectOption.innerText = WidgetsLayer[widget].name;
                    widgetSelectOption.widgetLayer = WidgetsLayer[widget];
                }
            }
        }

    },

    addWidgetClick: function (event) {
        var devicesWidgetsPanel = document.getElementById("devicesWidgetsPanel");
        var button = event.currentTarget;
        var deviceSelect = button.deviceSelect;
        var devicePropSelect = deviceSelect.devicePropSelect;
        var widgetSelect = deviceSelect.widgetSelect;

        var valueSelectOption = deviceSelect.options[deviceSelect.selectedIndex];
        var device = valueSelectOption.device;
        var deviceProp = devicePropSelect.options[devicePropSelect.selectedIndex].deviceProp;
        var widgetLayer = widgetSelect.options[widgetSelect.selectedIndex].widgetLayer;

        new widgetLayer.widget(devicesWidgetsPanel, device, deviceProp).onload = function (widgetWrapper) {

            var configPropertiesWidget = config.addWidget("main", device._id, deviceProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);

            widgetWrapper.widget.onchange = config.onWidgetChange;
            widgetWrapper.widget.ondelete = config.onWidgetDelete;


            $("#widgetModal").modal('hide');
        };

        /*
            var devicesWidgetsPanel = document.getElementById("widgetsPanelDataDiv");
            var device = devices.getDeviceById("temperature");    
            new TemperatureWidgetWrapper(devicesWidgetsPanel, device, device.temperature);
            new TemperatureWidgetWrapper(devicesWidgetsPanel, device, device.temperature, 1);
        
            var device = devices.getDeviceById("humidiry");
            new HumidityDevice(devicesWidgetsPanel, device, device.humidity);
            new HumidityDevice(devicesWidgetsPanel, device, device.humidity, 1);
    
        */

    },

    saveAddedWidget: function (event) {
        var buttonSave = event.currentTarget;
        config.cancel = false;
        // buttonSave.hidden = true;

        var modalBody = document.getElementById("saveConfigModalBody");

        if (modalBody == null || modalBody == undefined) {

            makeModalDialog("resetPanel", "saveConfig", getLang("saveaddedwidget"), getLang("areYouSure"));
            modalBody = document.getElementById("saveConfigModalBody");
            modalBody.innerHTML = "";

            //Body saving status text and progress bar

            var divSavingStatus = modalBody.appendChild(document.createElement("div"));
            var textStatus = divSavingStatus.appendChild(document.createElement("p"));
            textStatus.className = "text-center";
            textStatus.id = "savingTextStatus";

            var divProgressClass = modalBody.appendChild(document.createElement("div"));
            divProgressClass.className = "progress";
            divProgressClass.id = "divProgressClass";

            var progressBar = divProgressClass.appendChild(document.createElement("div"));
            progressBar.className = "progress-bar progress-bar-striped bg-info";
            progressBar.id = "saveProgressBar";
            progressBar.setAttribute("role", "progressbar");
            progressBar.setAttribute("aria-valuenow", "0");
            progressBar.setAttribute("aria-valuemin", "0");
            progressBar.setAttribute("aria-valuemax", "100");
            progressBar.setAttribute("style", "width: 0%");
            progressBar.innerHTML = "0%";

            // Footer addition button "Close"
            var modalFooter = document.getElementById("saveConfigModalFooter");
            var saveCloseButton = modalFooter.appendChild(document.createElement("button"));
            saveCloseButton.type = "button";
            saveCloseButton.className = "btn btn-sm btn-success";
            saveCloseButton.setAttribute("data-dismiss", "modal");
            saveCloseButton.setAttribute("aria-label", "Close");
            saveCloseButton.innerText = getLang("closebutton");
            saveCloseButton.id = "saveConfigsaveCloseButton";
            saveCloseButton.hidden = true;
      

            //Button cancel interrapt function
            var savingCloseButton = document.getElementById("saveConfigcloseButton");
            savingCloseButton.onclick = dashboardUI.addWidgetCancel;
        }


        $('#saveConfigModal').on('hide.bs.modal', function (event) {

            if (config.cancel === true) {
                config.cancel = false;
                return true;
            }
            else {
  
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
            }
            
        });


        $("#saveConfigModal").modal('show');

        config.save();
    },

    addWidgetCancel: function (event) {

        var buttonCancel = event.currentTarget;
        var saveButtonAtPanel = document.getElementById("saveWidgetsButton");

        if (saveButtonAtPanel !== null && saveButtonAtPanel !== undefined) {
            saveButtonAtPanel.hidden = true;
        }

        config.cancel = true;
    },

    onConfigChange: function (configProperties) {
        var saveButton = document.getElementById("saveWidgetsButton");
        saveButton.hidden = false;
    }

}











