//-----------------------------------------------------------------------------------
//Devices classes -------------------------------------------------------------------
//Base radial class 
//-----------------------------------------------------------------------------------
class RadialWidgetWrapper {

    constructor(parentPanel, device, deviceProperty, noWidget, configPropertiesWidget) {
        this.configPropertiesWidget = configPropertiesWidget;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noWidget);
            this.joinDevice(device, deviceProperty);

        }
    }

    offlineStarter(parentPanel, deviceId, devicePropertyName, noWidget) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;

        dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);
        if ((noWidget == undefined) || (!noWidget)) {
            this.widget = new RadialWidget(parentPanel, deviceId, 150);
            this.widget.deviceClass = this;
            this.widget.rPanel.onclick = this.widgetClick;
            this.draw();
        }
    }

    joinDevice(device, deviceProperty) {
        this.device = device;
        this.deviceProperty = deviceProperty;
        this.widget.deviceClass.deviceProperty = deviceProperty;
        this.node = config.getNodeByHost(device._host);
        //devices.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.node.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addValueListner(this.onValueChange, this);
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            /*
            sender.device = device;
            sender.deviceProperty = device[sender.devicePropertyName];
            sender.widget.deviceClass.deviceProperty = sender.deviceProperty;
            devices.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addValueListner(sender.onValueChange, sender);
            */
            sender.joinDevice(device, device[sender.devicePropertyName]);
        }
    }

    onValueChange(sender, deviceProperty) {
        sender.draw();
    }

    onNetworkStatusChange(sender, deviceProperty) {
        if (sender.widget != undefined) {
            sender.widget.networkStatus = deviceProperty.networkStatus;
        }
    }

    onDashboardModeChange(sender, mode) {
        if (sender.widget != undefined) {
            if (mode) {
                sender.widget.mode = WORK_MODE;
            }
            else {
                sender.widget.mode = MOVE_MODE;
            }
        }

    }


    widgetClick(event) {
        event.stopPropagation();
        var widgetPanel = event.currentTarget;
        var widget = widgetPanel.widget;
        if (widget.mode == WORK_MODE) {
            widget.deviceClass.deviceProperty.getValue();
        }
        return true;
    }

    refresh() { }

    draw() { }
}

class TemperatureWidgetWrapper extends RadialWidgetWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);
        this.widget = new TemperatureWidget(parentPanel, deviceId, 150);
        this.widget.deviceClass = this;
        this.widget.rPanel.onclick = this.widgetClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        super(parentPanel, device, deviceProperty, true, configPropertiesWidget);
        if (device == undefined) return;

    }

    draw() {
        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.widget.refresh(this.deviceProperty.value, Math.round(this.deviceProperty.value) + " C", this.device._id, this.device.historydata.value);
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}
//-----------------------------------------------------------------------------------------------------------------------
class HumidityWidgetWrapper extends RadialWidgetWrapper {


    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.widget = new RadialWidget(parentPanel, deviceId, 150);
        this.widget.deviceClass = this;
        this.widget.rPanel.onclick = this.widgetClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        super(parentPanel, device, deviceProperty, true, configPropertiesWidget);
        if (device == undefined) return;

    }

    draw() {
        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.widget.refresh(this.deviceProperty.value, Math.round(this.deviceProperty.value) + "%", this.device._id, this.device.historydata.value);
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}
//HistoryData Graph ------------------------------------------------------------------------------------------------------
class HistoryDataGraphWidgetWrapper extends RadialWidgetWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);
        this.widget = new GraphWidget(parentPanel, deviceId, 150, temperatureIcon);
        this.widget.deviceClass = this;
        this.widget.rPanel.onclick = this.widgetClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        super(parentPanel, device, deviceProperty, true, configPropertiesWidget);
        if (device == undefined) return;
    }

    draw() {
        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.widget.refresh(this.deviceProperty.value, this.device._id, this.deviceProperty.value);
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}


class LightWidgetWrapper extends RadialWidgetWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.widget = new LightWidget(parentPanel, deviceId, 150);
        this.widget.deviceClass = this;
        this.widget.rPanel.onclick = this.widgetClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        super(parentPanel, device, deviceProperty, true, configPropertiesWidget);
        if (device == undefined) return;

    }

    draw() {
        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = Math.round(this.deviceProperty.value / (1024.0 / 100.0));
            if (this.deviceProperty.value < 50) {
                this.widget.refresh(percent, getLang("low"), this.device._id, this.device.historydata.value);
            }
            else
                if (this.deviceProperty.value < 150) {
                    this.widget.refresh(percent, getLang("norm"), this.device._id, this.device.historydata.value);
                }
                else {
                    this.widget.refresh(percent, getLang("high"), this.device._id, this.device.historydata.value);
                }
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }

}


class SmokeWidgetWrapper extends RadialWidgetWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.widget = new SmokeWidget(parentPanel, deviceId, 150);
        this.widget.deviceClass = this;
        this.widget.rPanel.onclick = this.widgetClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        super(parentPanel, device, deviceProperty, true, configPropertiesWidget);
        if (device == undefined) return;

    }


    draw() {

        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = Math.round(this.deviceProperty.value / (1024.0 / 100.0));
            if (this.deviceProperty.value < 50) {
                this.widget.refresh(percent, getLang("smokelow"), this.device._id, this.device.historydata.value);
            }
            else
                if (this.deviceProperty.value < 150) {
                    this.widget.refresh(percent, getLang("smokenorm"), this.device._id, this.device.historydata.value);
                }
                else {
                    this.widget.refresh(percent, getLang("smokehigh"), this.device._id, this.device.historydata.value);
                }
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }

}

class MotionWidgetWrapper extends RadialWidgetWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.widget = new MotionWidget(parentPanel, deviceId, 150);
        this.widget.deviceClass = this;
        this.widget.rPanel.onclick = this.widgetClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        super(parentPanel, device, deviceProperty, true, configPropertiesWidget);
        if (device == undefined) return;

    }

    draw() {
        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {

            var data = this.deviceProperty.value;
            if (this.device.historydata.value != undefined) {
                var splitHistory = this.device.historydata.value.split(";");
                var count = parseInt(splitHistory[0]);
                var lastMotion = 0;
                if (count > 6) { //last minute 
                    for (var i = count - 6; i < count + 1; i++) {
                        lastMotion += parseFloat(splitHistory[i]);
                    }
                }
                else {
                    for (var i = 1; i < count + 1; i++) {
                        lastMotion += parseFloat(splitHistory[i]);
                    }
                }
                if (lastMotion != 0) {
                    data = 1;
                }
            }
            var text = "notdetect";
            if (data == 1) {
                text = "detect";
            }
            this.widget.refresh(data, text, this.device._id, this.device.historydata.value);
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

class SensorWidgetWrapper extends RadialWidgetWrapper {
    draw() {
        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = 0;
            var text = getLang("non");
            if (this.deviceProperty.value == 1) {
                percent = 100;
                text = getLang("yes");
            }

            this.widget.refresh(percent, text, this.device._id);
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

//Acturator ----------------------------------------------------------------------------------
class ActuatorWidgetWrapper {


    constructor(parentPanel, device, deviceProperty, noWidget, configPropertiesWidget) {
        this.configPropertiesWidget = configPropertiesWidget;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noWidget);
            this.joinDevice(device, deviceProperty);

        }
    }

    offlineStarter(parentPanel, deviceId, devicePropertyName, noWidget) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;

        dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);
        if ((noWidget == undefined) || (!noWidget)) {
            this.widget = new ActuatorWidget(parentPanel, deviceId, 150);
            this.widget.deviceClass = this;
            this.widget.rPanel.onclick = this.widgetClick;
            this.draw();
        }
    }

    joinDevice(device, deviceProperty) {
        this.device = device;
        this.deviceProperty = deviceProperty;
        this.widget.deviceClass.deviceProperty = deviceProperty;
        this.node = config.getNodeByHost(device._host);
        //devices.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.node.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addValueListner(this.onValueChange, this);
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            sender.joinDevice(device, device[sender.devicePropertyName]);
        }
    }

/*

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;
        devices.addNetworkStatusListner(this.onNetworkStatusChange, this);

        dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

        this.widget = new ActuatorWidget(parentPanel, deviceId, 150);
        this.widget.deviceClass = this;
        this.widget.rPanel.onclick = this.actuatorWidgetClick;
        this.draw();

    }


    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        this.configPropertiesWidget = configPropertiesWidget;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noWidget);
            this.device = device;
            this.deviceProperty = deviceProperty;
            this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.deviceProperty.addValueListner(this.onValueChange, this);

        }
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            sender.device = device;
            sender.deviceProperty = device[sender.devicePropertyName];
            sender.widget.deviceClass.deviceProperty = sender.deviceProperty;
            devices.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
            sender.deviceProperty.addValueListner(sender.onValueChange, sender);
        }
    }
    */


    onValueChange(sender, deviceProperty) {
        sender.draw();
    }

    onNetworkStatusChange(sender, deviceProperty) {
        if (sender.widget != undefined) {
            sender.widget.networkStatus = deviceProperty.networkStatus;
        }
    }

    onDashboardModeChange(sender, mode) {
        if (sender.widget != undefined) {
            if (mode) {
                sender.widget.mode = WORK_MODE;
            }
            else {
                sender.widget.mode = MOVE_MODE;
            }
        }

    }


    widgetClick(event) {
        event.stopPropagation();
        var actuatorWidgetPanel = event.currentTarget;
        var widget = actuatorWidgetPanel.widget;
        if (widget.mode == WORK_MODE) {
            var deviceProperty = widget.deviceClass.deviceProperty;
            if (parseInt(deviceProperty.value) == 1) {
                deviceProperty.setValue(0);
            }
            else {
                deviceProperty.setValue(1);
            }
        }
        //return actuatorWidget;
        return true;
    }
    draw() {

        if (this.widget == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var text = "off";
            if (parseInt(this.deviceProperty.value) == 1) {
                text = "on";
            }

            this.widget.refresh(this.deviceProperty.value, text, this.device._id);
        }
        else {
            this.widget.refresh(0, "--", this.device._id);
        }
        this.widget.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

//LCD ----------------------------------------------------------------------------------
class LCDWidgetWrapper {


    constructor(parentPanel, device, deviceProperty, noWidget, configPropertiesWidget) {
        this.configPropertiesWidget = configPropertiesWidget;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noWidget);
            this.joinDevice(device, deviceProperty);

        }
    }

    offlineStarter(parentPanel, deviceId, devicePropertyName, noWidget) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;

        dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);
        if ((noWidget == undefined) || (!noWidget)) {
            this.widget = new  LCDWidget(parentPanel, deviceId, 150);
            this.widget.deviceClass = this;
           // this.widget.rPanel.onclick = this.widgetClick;
            this.widget.lcdButton.onclick = this.lcdTextClick;
            this.widget.lightButton.onclick = this.lcdLightClick;
            this.draw();
        }
    }

    joinDevice(device, deviceProperty) {
        this.device = device;
        this.device["text"].addNetworkStatusListner(this.onTextChange, this);
        this.device["text"].addValueListner(this.onTextChange, this);
        this.device["backlight"].addValueListner(this.onLightChange, this);
        this.deviceProperty = deviceProperty;
        this.widget.deviceClass.deviceProperty = deviceProperty;
        this.node = config.getNodeByHost(device._host);        
        this.node.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
        this.deviceProperty.addValueListner(this.onValueChange, this);
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            sender.joinDevice(device, device[sender.devicePropertyName]);
        }
    }
    //---------------------------------------
    /*
    offlineStarter(parentPanel, deviceId, devicePropertyName, noWidget) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;
        devices.addNetworkStatusListner(this.onNetworkStatusChange, this);

        dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

        this.widget = new LCDWidget(parentPanel, deviceId, 150);
        this.widget.deviceClass = this;
        this.widget.lcdButton.onclick = this.lcdTextClick;
        this.widget.lightButton.onclick = this.lcdLightClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, configPropertiesWidget) {
        this.configPropertiesWidget = configPropertiesWidget;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name);
            this.device = device;
            this.device["text"].addNetworkStatusListner(this.onTextChange, this);
            this.device["text"].addValueListner(this.onTextChange, this);
            this.device["backlight"].addValueListner(this.onLightChange, this);

          //  this.deviceProperty = deviceProperty;
         //   this.deviceProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
         //  this.deviceProperty.addValueListner(this.onValueChange, this);

        }
    }


    onDeviceLoaded(sender, device) {
        if (sender.device != undefined) return;
        if (sender.deviceId == device._id) {
            sender.device = device;

            sender.device["text"].addNetworkStatusListner(sender.onTextChange, sender);
            sender.device["text"].addValueListner(sender.onTextChange, sender);
            sender.device["backlight"].addValueListner(sender.onLightChange, sender);

            devices.addNetworkStatusListner(sender.onNetworkStatusChange, sender);

        }
    }
    */

    onDashboardModeChange(sender, mode) {
        if (sender.widget != undefined) {
            if (mode) {
                sender.widget.mode = WORK_MODE;
            }
            else {
                sender.widget.mode = MOVE_MODE;
            }
        }

    }


    onNetworkStatusChange(sender, deviceProperty) {
        if (sender.widget != undefined) {
            sender.widget.networkStatus = deviceProperty.networkStatus;
        }
    }

    onTextChange(sender, deviceProperty) {
        sender.draw();
    }

    onLightChange(sender, deviceProperty) {
        sender.draw();
    }


    lcdTextClick(event) {
        event.stopPropagation();
        var lcdWidgetPanel = event.currentTarget;
        var widget = lcdWidgetPanel.widget;
        if (widget.mode == WORK_MODE) {
            widget.hideEditor();
            var deviceProperty = widget.deviceClass.device["text"];
            deviceProperty.setValue(widget.textarea.value);

        }
    }


    lcdLightClick(event) {
        event.stopPropagation();
        var lcdWidgetPanel = event.currentTarget;
        var widget = lcdWidgetPanel.widget;
        if (widget.mode == WORK_MODE) {
            widget.hideEditor();
            var deviceProperty = widget.deviceClass.device["backlight"];
            if (parseInt(deviceProperty.value) == 1) {
                deviceProperty.setValue(0);
            }
            else {
                deviceProperty.setValue(1);
            }
        }
    }

    draw() {
        if (this.widget == undefined) return;
        if (this.device == undefined) return;
        if (this.device["text"].networkStatus == NET_ONLINE) {

            if (this.device["text"].value != undefined) {
                this.widget.refresh(this.device["text"].value, this.device._id, this.device["backlight"].value);
            }
            else {
                this.widget.refresh("", this.device._id, this.device["backlight"].value);
            } 

        }
        else {
            this.widget.refresh("", this.device._id, 0);
        }
        this.widget.networkStatus = this.device["text"].networkStatus;
        return true;

        /*
        if (!data.startsWith("%error")) {
            this.lcdWidget.refresh(data, this.id, light);
            this.lcdWidget.networkStatus = NET_ONLINE;
        }
        else {
            this.lcdWidget.refresh("", this.id, 0);
            this.lcdWidget.networkStatus = NET_ERROR;
        }
        */

    }

    //set _networkStatus(networkStatus) {
    //this.lcdWidget.networkStatus = networkStatus;
    //}
}

//Stepper ----------------------------------------------------------------------------------
class StepperWidgetWrapper {
    constructor(parentPanel, id, propertyName) {
        this.id = id;
        this.propertyName = propertyName;
        this.stepperWidget = new StepperWidget(parentPanel, id, 150);
        this.stepperWidget.deviceClass = this;
        this.stepperWidget.positionChangeReciever = this.positionChange;
    }

    positionChange(toPercent) { //this is caller (stepperWidget)
        if (this.atProcess) {
            //todo cancel
            this.atProcess = false;
            return;
        }
        this.atProcess = true;
        var deviceClass = this.deviceClass;
        var newToPosition = toPercent * (deviceClass.range / 100);
        setDevicePropertyAsyncWithReciever(deviceClass.id, "toposition", newToPosition, deviceClass.clientCallback, deviceClass);
    }

    clientCallback(data, deviceClass) {
        if (!data.startsWith("%error")) {
            deviceClass.stepperWidget.networkStatus = NET_RECONNECT;
        }
        else {
            if (!data.includes("response")) { //offline 
                //  deviceClass.stepperWidget.networkStatus = NET_OFFLINE;
            }
            else { //device error
                deviceClass.draw(data);
            }
        }
    }

    refresh() {
        if (status_online == NET_ONLINE) {
            this.position = getParsedDeviceProperty(this.id, "position");
            this.toposition = getParsedDeviceProperty(this.id, "toposition");
            this.range = getParsedDeviceProperty(this.id, "range");
            this.draw(this.position, this.toposition, this.range);
        }
        else {
            this.stepperWidget.networkStatus = status_online;
        }
    }

    draw(position, toposition, range) {
        if (this.deviceProperty == undefined) return;
        if (!isNaN(position)) {
            var percent = position / (range / 100);
            var toPercent = toposition / (range / 100);
            this.stepperWidget.refresh(percent, toPercent, Math.round(percent) + "%", this.id);
            this.stepperWidget.networkStatus = NET_ONLINE;
        }
        else {
            //TODO
            // this.stepperWidget.refresh(0, 0, "--", this.id);
            // this.stepperWidget.networkStatus = NET_ERROR;
        }
    }

    set _networkStatus(networkStatus) {
        this.stepperWidget.networkStatus = networkStatus;
    }
}

//Widget layer -------------------------------------------------
var WidgetsLayer = {
    /*
    RadialWidget: {
        id: "radialwidget",
        name: getLang("radial"),
        widget: RadialWidgetWrapper
    },
    */
    TemperatureWidget: {
        id: "temperature",
        name: getLang("temperature"),
        widget: TemperatureWidgetWrapper,
        devicesTypes: ";" + DHTDeviceType + ";",
        devicesProperties: ";temperature;"
    },
    HumidityWidget: {
        id: "humidity",
        name: getLang("humidity"),
        widget: HumidityWidgetWrapper,
        devicesTypes: ";" + DHTDeviceType + ";",
        devicesProperties: ";humidity;"
    },
    HistoryDataGraphWidget: {
        id: "historydatagraph",
        name: getLang("historydatagraph"),
        widget: HistoryDataGraphWidgetWrapper,
        devicesTypes: "any",
        devicesProperties: ";historydata;historyfile;temperaturehistorydata;humidityhistorydata;",
    },
    LightWidget: {
        id: "light",
        name: getLang("light"),
        widget: LightWidgetWrapper,
        devicesTypes: ";" + LightDeviceType + ";",
        devicesProperties: ";light;",

    },
    SmokeWidget: {
        id: "smoke",
        name: getLang("smoke"),
        widget: SmokeWidgetWrapper,
        devicesTypes: ";" + SmokeDeviceType + ";",
        devicesProperties: ";smoke;",
    },
    MotionWidget: {
        id: "motion",
        name: getLang("motion"),
        widget: MotionWidgetWrapper,
        devicesTypes: ";" + MotionDeviceType + ";",
        devicesProperties: ";motion;",

    },
    SensorWidget: {
        id: "sensor",
        name: getLang("sensor"),
        widget: SensorWidgetWrapper,
        devicesTypes: ";" + SensorDeviceType + ";",
        devicesProperties: ";data;",

    },
    LCDWidget: {
        id: "lcd",
        name: getLang("lcd"),
        widget: LCDWidgetWrapper,
        devicesTypes: ";" + LCDDeviceType + ";",
        devicesProperties: "any",

    },
    ActuatorWidget: {
        id: "actuator",
        name: getLang("actuator"),
        widget: ActuatorWidgetWrapper,
        devicesTypes: ";" + ActuatorDeviceType + ";",
        devicesProperties: ";data;",

    },
    /*
    StepperWidget: {
        id: "stepper",
        name: getLang("stepper"),
        widget: StepperWidgetWrapper,
        devicesTypes: ";" + StepperDeviceType + ";",
        devicesProperties: "any",

    },
    */


    getWidgetById: function (id) {
        if (id == undefined) return undefined;
        for (var widgetProp in WidgetsLayer) {
            if (WidgetsLayer[widgetProp].id == undefined) continue;
            if (WidgetsLayer[widgetProp].id == id) {
                return WidgetsLayer[widgetProp];
            }
        }
        return undefined;
    }

}

