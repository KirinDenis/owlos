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

    initDashboard: function () {
        var devicesWidgetsPanel = document.getElementById("devicesWidgetsPanel");
        var widgetsPanel = devicesWidgetsPanel.appendChild(document.createElement('div'));
        widgetsPanel.id = "widgetsPanel";
        widgetsPanel.className = "col-md-12";
        var infoDiv = widgetsPanel.appendChild(document.createElement('div'));
        infoDiv.className = "card bg-dark  mb-1";
        var headerDiv = infoDiv.appendChild(document.createElement('div'));
        headerDiv.className = "card-header";

        var headerText = headerDiv.appendChild(document.createElement('div'));
        headerText.innerHTML = getLang("dashboard");

        var cardHeaderButtonsPanel = headerText.appendChild(document.createElement('div'));
        cardHeaderButtonsPanel.className = 'cardHeaderButton';

        var headerModeButton = cardHeaderButtonsPanel.appendChild(document.createElement('input'));
        headerModeButton.className = "btn btn-secondary btn-sm";
        headerModeButton.type = "button";
        headerModeButton.value = getLang("dashboardview");
        headerModeButton.onclick = dashboardUI.changeDashboadMode;

        var addWidgetButton = cardHeaderButtonsPanel.appendChild(document.createElement('input'));
        addWidgetButton.className = "btn btn-success btn-sm";
        addWidgetButton.type = "button";
        addWidgetButton.value = getLang("dashboardaddwidget");
        addWidgetButton.onclick = dashboardUI.addWidgetMode;
        
        var dataDiv = infoDiv.appendChild(document.createElement('div'));
        dataDiv.id = "widgetsPanelDataDiv"
        dataDiv.className = "card-body";

        var p = dataDiv.appendChild(document.createElement('p'));
        p.className = "card-text";
        



        var devicesWidgetsPanel = p.appendChild(document.createElement('div'));
        devicesWidgetsPanel.className = "row";

        //var devicesWidgetsPanel = document.getElementById("widgetsPanelDataDiv");
        for (var i = 0; i < configProperties.dashboards[0].widgets.length; i++) {
            try {
                var widgetProp = configProperties.dashboards[0].widgets[i];
                var widget = WidgetsLayer.getWidgetById(widgetProp.widgetId);
                if (widget != undefined) {
                    var widgetWrapper = new widget.widget(devicesWidgetsPanel, undefined, undefined, configProperties.dashboards[0].widgets[i]);
                    
                    widgetWrapper.offlineStarter(devicesWidgetsPanel, widgetProp.deviceId, widgetProp.deviceProperty);
                    widgetWrapper.widget.addEventListner(config.widgetEvent, configProperties.dashboards[0].widgets[i]);
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

    changeDashboadMode: function () {
        dashboardUI.dashboardViewMode = !dashboardUI.dashboardViewMode;

        for (var k = 0; k < dashboardUI.dashboardModeListners.length; k++) {
            dashboardUI.dashboardModeListners[k].event(dashboardUI.dashboardModeListners[k].sender, dashboardUI.dashboardViewMode);
        }
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
        dashboardUI.onDeviceSelect(event)


        //end of Body form ----------
        var widgetButton = modalFooter.appendChild(document.createElement("button"));
        widgetButton.type = "button";
        widgetButton.className = "btn btn-sm btn-success";
        widgetButton.id = "widgetModalButton";
        widgetButton.deviceSelect = deviceSelect;
        widgetButton.onclick = dashboardUI.addWidgetClick;
        widgetButton.innerText = getLang("widgetslist");

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
                    widgetSelectOption.widget = WidgetsLayer[widget];
                }
            }
        }

    },

    addWidgetClick: function (event) {
        var devicesWidgetsPanel = document.getElementById("widgetsPanelDataDiv");
        var button = event.currentTarget;
        var deviceSelect = button.deviceSelect;
        var devicePropSelect = deviceSelect.devicePropSelect;
        var widgetSelect = deviceSelect.widgetSelect;

        var valueSelectOption = deviceSelect.options[deviceSelect.selectedIndex];
        var device = valueSelectOption.device;
        var deviceProp = devicePropSelect.options[devicePropSelect.selectedIndex].deviceProp;
        var widget = widgetSelect.options[widgetSelect.selectedIndex].widget;

        var widgetWrapper = new widget.widget(devicesWidgetsPanel, device, deviceProp);

        var configPropertiesWidget = config.addWidget("main", device._id, deviceProp.name, widget.id, widgetWrapper.widget.properties);

        widgetWrapper.widget.addEventListner(config.widgetEvent, configPropertiesWidget);

        $("#widgetModal").modal('hide');

        /*
            var devicesWidgetsPanel = document.getElementById("widgetsPanelDataDiv");
            var device = devices.getDeviceById("temperature");    
            new TemperatureWidgetWrapper(devicesWidgetsPanel, device, device.temperature);
            new TemperatureWidgetWrapper(devicesWidgetsPanel, device, device.temperature, 1);
        
            var device = devices.getDeviceById("humidiry");
            new HumidityDevice(devicesWidgetsPanel, device, device.humidity);
            new HumidityDevice(devicesWidgetsPanel, device, device.humidity, 1);
    
        */

    }
}











