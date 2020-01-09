function _initDevicesTable() {
    
    
    var devicesAnchors = document.getElementById("devicesAnchors");

    var devicesNavBar = devicesAnchors.appendChild(document.createElement("ul"));
    devicesNavBar.style.height = "0px";
    devicesNavBar.id = "devicesNavBar";
    devicesNavBar.className = "nav nav-tabs";

    
}


//-----------------------------------------------------------------------------------
//Devices classes -------------------------------------------------------------------
//Base radial class 
//-----------------------------------------------------------------------------------
class RadialIndicatorWrapper {

    constructor(parentPanel, device, deviceProperty, noIndicator, configPropertiesIndicator) {
        this.configPropertiesIndicator = configPropertiesIndicator;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noIndicator);
            this.joinDevice(device, deviceProperty);

        }
    }

    offlineStarter(parentPanel, deviceId, devicePropertyName, noIndicator) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;

        addDashboardModeListner(this.onDashboardModeChange, this);
        if ((noIndicator == undefined) || (!noIndicator)) {
            this.indicator = new RadialIndicator(parentPanel, deviceId, 150);
            this.indicator.deviceClass = this;
            this.indicator.rPanel.onclick = this.indicatorClick;
            this.draw();
        }
    }

    joinDevice(device, deviceProperty) {
        this.device = device;
        this.deviceProperty = deviceProperty;
        this.indicator.deviceClass.deviceProperty = deviceProperty;
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
            sender.indicator.deviceClass.deviceProperty = sender.deviceProperty;
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
        if (sender.indicator != undefined) {
            sender.indicator.networkStatus = deviceProperty.networkStatus;
        }
    }

    onDashboardModeChange(sender, mode) {
        if (sender.indicator != undefined) {
            if (mode) {
                sender.indicator.mode = WORK_MODE;
            }
            else {
                sender.indicator.mode = MOVE_MODE;
            }
        }

    }


    indicatorClick(event) {
        event.stopPropagation();
        var indicatorPanel = event.currentTarget;
        var indicator = indicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            indicator.deviceClass.deviceProperty.getValue();
        }
        return true;
    }

    refresh() { }

    draw() { }
}

class TemperatureIndicatorWrapper extends RadialIndicatorWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);
        this.indicator = new TemperatureIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        super(parentPanel, device, deviceProperty, true, configPropertiesIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.indicator.refresh(this.deviceProperty.value, Math.round(this.deviceProperty.value) + " C", this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}
//-----------------------------------------------------------------------------------------------------------------------
class HumidityIndicatorWrapper extends RadialIndicatorWrapper {


    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new RadialIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        super(parentPanel, device, deviceProperty, true, configPropertiesIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.indicator.refresh(this.deviceProperty.value, Math.round(this.deviceProperty.value) + "%", this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}
//HistoryData Graph ------------------------------------------------------------------------------------------------------
class HistoryDataGraphIndicatorWrapper extends RadialIndicatorWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);
        this.indicator = new GraphIndicator(parentPanel, deviceId, 150, temperatureIcon);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        super(parentPanel, device, deviceProperty, true, configPropertiesIndicator);
        if (device == undefined) return;
    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            this.indicator.refresh(this.deviceProperty.value, this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}


class LightIndicatorWrapper extends RadialIndicatorWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new LightIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        super(parentPanel, device, deviceProperty, true, configPropertiesIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = Math.round(this.deviceProperty.value / (1024.0 / 100.0));
            if (this.deviceProperty.value < 50) {
                this.indicator.refresh(percent, getLang("low"), this.device._id, this.device.historydata.value);
            }
            else
                if (this.deviceProperty.value < 150) {
                    this.indicator.refresh(percent, getLang("norm"), this.device._id, this.device.historydata.value);
                }
                else {
                    this.indicator.refresh(percent, getLang("high"), this.device._id, this.device.historydata.value);
                }
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }

}


class SmokeIndicatorWrapper extends RadialIndicatorWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new SmokeIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        super(parentPanel, device, deviceProperty, true, configPropertiesIndicator);
        if (device == undefined) return;

    }


    draw() {

        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = Math.round(this.deviceProperty.value / (1024.0 / 100.0));
            if (this.deviceProperty.value < 50) {
                this.indicator.refresh(percent, getLang("smokelow"), this.device._id, this.device.historydata.value);
            }
            else
                if (this.deviceProperty.value < 150) {
                    this.indicator.refresh(percent, getLang("smokenorm"), this.device._id, this.device.historydata.value);
                }
                else {
                    this.indicator.refresh(percent, getLang("smokehigh"), this.device._id, this.device.historydata.value);
                }
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }

}

class MotionIndicatorWrapper extends RadialIndicatorWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName) {
        super.offlineStarter(parentPanel, deviceId, devicePropertyName, true);

        this.indicator = new MotionIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.indicatorClick;
        this.draw();
    }

    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        super(parentPanel, device, deviceProperty, true, configPropertiesIndicator);
        if (device == undefined) return;

    }

    draw() {
        if (this.indicator == undefined) return;
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
            this.indicator.refresh(data, text, this.device._id, this.device.historydata.value);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

class SensorIndicatorWrapper extends RadialIndicatorWrapper {
    draw() {
        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var percent = 0;
            var text = getLang("non");
            if (this.deviceProperty.value == 1) {
                percent = 100;
                text = getLang("yes");
            }

            this.indicator.refresh(percent, text, this.device._id);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

//Acturator ----------------------------------------------------------------------------------
class ActuatorIndicatorWrapper {


    constructor(parentPanel, device, deviceProperty, noIndicator, configPropertiesIndicator) {
        this.configPropertiesIndicator = configPropertiesIndicator;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noIndicator);
            this.joinDevice(device, deviceProperty);

        }
    }

    offlineStarter(parentPanel, deviceId, devicePropertyName, noIndicator) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;

        addDashboardModeListner(this.onDashboardModeChange, this);
        if ((noIndicator == undefined) || (!noIndicator)) {
            this.indicator = new ActuatorIndicator(parentPanel, deviceId, 150);
            this.indicator.deviceClass = this;
            this.indicator.rPanel.onclick = this.indicatorClick;
            this.draw();
        }
    }

    joinDevice(device, deviceProperty) {
        this.device = device;
        this.deviceProperty = deviceProperty;
        this.indicator.deviceClass.deviceProperty = deviceProperty;
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

        addDashboardModeListner(this.onDashboardModeChange, this);

        this.indicator = new ActuatorIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.rPanel.onclick = this.actuatorIndicatorClick;
        this.draw();

    }


    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        this.configPropertiesIndicator = configPropertiesIndicator;
        if (device == undefined) {
            devices.addDeviceLoadedListner(this.onDeviceLoaded, this);
        }
        else {
            this.offlineStarter(parentPanel, device._id, deviceProperty.name, noIndicator);
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
            sender.indicator.deviceClass.deviceProperty = sender.deviceProperty;
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
        if (sender.indicator != undefined) {
            sender.indicator.networkStatus = deviceProperty.networkStatus;
        }
    }

    onDashboardModeChange(sender, mode) {
        if (sender.indicator != undefined) {
            if (mode) {
                sender.indicator.mode = WORK_MODE;
            }
            else {
                sender.indicator.mode = MOVE_MODE;
            }
        }

    }


    indicatorClick(event) {
        event.stopPropagation();
        var actuatorIndicatorPanel = event.currentTarget;
        var indicator = actuatorIndicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            var deviceProperty = indicator.deviceClass.deviceProperty;
            if (parseInt(deviceProperty.value) == 1) {
                deviceProperty.setValue(0);
            }
            else {
                deviceProperty.setValue(1);
            }
        }
        //return actuatorIndicator;
        return true;
    }
    draw() {

        if (this.indicator == undefined) return;
        if (this.deviceProperty == undefined) return;
        if (this.deviceProperty.networkStatus == NET_ONLINE) {
            var text = "off";
            if (parseInt(this.deviceProperty.value) == 1) {
                text = "on";
            }

            this.indicator.refresh(this.deviceProperty.value, text, this.device._id);
        }
        else {
            this.indicator.refresh(0, "--", this.device._id);
        }
        this.indicator.networkStatus = this.deviceProperty.networkStatus;
        return true;
    }
}

//LCD ----------------------------------------------------------------------------------
class LCDIndicatorWrapper {

    offlineStarter(parentPanel, deviceId, devicePropertyName, noIndicator) {
        this.deviceId = deviceId;
        this.devicePropertyName = devicePropertyName;
        devices.addNetworkStatusListner(this.onNetworkStatusChange, this);

        addDashboardModeListner(this.onDashboardModeChange, this);

        this.indicator = new LCDIndicator(parentPanel, deviceId, 150);
        this.indicator.deviceClass = this;
        this.indicator.lcdButton.onclick = this.lcdTextClick;
        this.indicator.lightButton.onclick = this.lcdLightClick;
        this.draw();

    }

    constructor(parentPanel, device, deviceProperty, configPropertiesIndicator) {
        this.configPropertiesIndicator = configPropertiesIndicator;
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

    onDashboardModeChange(sender, mode) {
        if (sender.indicator != undefined) {
            if (mode) {
                sender.indicator.mode = WORK_MODE;
            }
            else {
                sender.indicator.mode = MOVE_MODE;
            }
        }

    }


    onNetworkStatusChange(sender, deviceProperty) {
        if (sender.indicator != undefined) {
            sender.indicator.networkStatus = deviceProperty.networkStatus;
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
        var lcdIndicatorPanel = event.currentTarget;
        var indicator = lcdIndicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            indicator.hideEditor();
            var deviceProperty = indicator.deviceClass.device["text"];
            deviceProperty.setValue(indicator.textarea.value);

        }
    }


    lcdLightClick(event) {
        event.stopPropagation();
        var lcdIndicatorPanel = event.currentTarget;
        var indicator = lcdIndicatorPanel.indicator;
        if (indicator.mode == WORK_MODE) {
            indicator.hideEditor();
            var deviceProperty = indicator.deviceClass.device["backlight"];
            if (parseInt(deviceProperty.value) == 1) {
                deviceProperty.setValue(0);
            }
            else {
                deviceProperty.setValue(1);
            }
        }
    }

    draw() {
        if (this.indicator == undefined) return;
        if (this.device == undefined) return;
        if (this.device["text"].networkStatus == NET_ONLINE) {

            if (this.device["text"].value != undefined) {
                this.indicator.refresh(this.device["text"].value, this.device._id, this.device["backlight"].value);
            }
            else {
                this.indicator.refresh("", this.device._id, this.device["backlight"].value);
            } 

        }
        else {
            this.indicator.refresh("", this.device._id, 0);
        }
        this.indicator.networkStatus = this.device["text"].networkStatus;
        return true;

        /*
        if (!data.startsWith("%error")) {
            this.lcdIndicator.refresh(data, this.id, light);
            this.lcdIndicator.networkStatus = NET_ONLINE;
        }
        else {
            this.lcdIndicator.refresh("", this.id, 0);
            this.lcdIndicator.networkStatus = NET_ERROR;
        }
        */

    }

    //set _networkStatus(networkStatus) {
    //this.lcdIndicator.networkStatus = networkStatus;
    //}
}

//Stepper ----------------------------------------------------------------------------------
class StepperIndicatorWrapper {
    constructor(parentPanel, id, propertyName) {
        this.id = id;
        this.propertyName = propertyName;
        this.stepperIndicator = new StepperIndicator(parentPanel, id, 150);
        this.stepperIndicator.deviceClass = this;
        this.stepperIndicator.positionChangeReciever = this.positionChange;
    }

    positionChange(toPercent) { //this is caller (stepperIndicator)
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
            deviceClass.stepperIndicator.networkStatus = NET_RECONNECT;
        }
        else {
            if (!data.includes("response")) { //offline 
                //  deviceClass.stepperIndicator.networkStatus = NET_OFFLINE;
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
            this.stepperIndicator.networkStatus = status_online;
        }
    }

    draw(position, toposition, range) {
        if (this.deviceProperty == undefined) return;
        if (!isNaN(position)) {
            var percent = position / (range / 100);
            var toPercent = toposition / (range / 100);
            this.stepperIndicator.refresh(percent, toPercent, Math.round(percent) + "%", this.id);
            this.stepperIndicator.networkStatus = NET_ONLINE;
        }
        else {
            //TODO
            // this.stepperIndicator.refresh(0, 0, "--", this.id);
            // this.stepperIndicator.networkStatus = NET_ERROR;
        }
    }

    set _networkStatus(networkStatus) {
        this.stepperIndicator.networkStatus = networkStatus;
    }
}

//Indicator layer -------------------------------------------------
var IndicatorsLayer = {
    /*
    RadialIndicator: {
        id: "radialindicator",
        name: getLang("radial"),
        indicator: RadialIndicatorWrapper
    },
    */
    TemperatureIndicator: {
        id: "temperature",
        name: getLang("temperature"),
        indicator: TemperatureIndicatorWrapper,
        devicesTypes: ";" + DHTDeviceType + ";",
        devicesProperties: ";temperature;"
    },
    HumidityIndicator: {
        id: "humidity",
        name: getLang("humidity"),
        indicator: HumidityIndicatorWrapper,
        devicesTypes: ";" + DHTDeviceType + ";",
        devicesProperties: ";humidity;"
    },
    HistoryDataGraphIndicator: {
        id: "historydatagraph",
        name: getLang("historydatagraph"),
        indicator: HistoryDataGraphIndicatorWrapper,
        devicesTypes: "any",
        devicesProperties: ";historydata;",
    },
    LightIndicator: {
        id: "light",
        name: getLang("light"),
        indicator: LightIndicatorWrapper,
        devicesTypes: ";" + LightDeviceType + ";",
        devicesProperties: ";light;",

    },
    SmokeIndicator: {
        id: "smoke",
        name: getLang("smoke"),
        indicator: SmokeIndicatorWrapper,
        devicesTypes: ";" + SmokeDeviceType + ";",
        devicesProperties: ";smoke;",
    },
    MotionIndicator: {
        id: "motion",
        name: getLang("motion"),
        indicator: MotionIndicatorWrapper,
        devicesTypes: ";" + MotionDeviceType + ";",
        devicesProperties: ";motion;",

    },
    SensorIndicator: {
        id: "sensor",
        name: getLang("sensor"),
        indicator: SensorIndicatorWrapper,
        devicesTypes: ";" + SensorDeviceType + ";",
        devicesProperties: ";data;",

    },
    LCDIndicator: {
        id: "lcd",
        name: getLang("lcd"),
        indicator: LCDIndicatorWrapper,
        devicesTypes: ";" + LCDDeviceType + ";",
        devicesProperties: "any",

    },
    ActuatorIndicator: {
        id: "actuator",
        name: getLang("actuator"),
        indicator: ActuatorIndicatorWrapper,
        devicesTypes: ";" + ActuatorDeviceType + ";",
        devicesProperties: ";data;",

    },

    getIndicatorById: function (id) {
        if (id == undefined) return undefined;
        for (var indicatorProp in IndicatorsLayer) {
            if (IndicatorsLayer[indicatorProp].id == undefined) continue;
            if (IndicatorsLayer[indicatorProp].id == id) {
                return IndicatorsLayer[indicatorProp];
            }
        }
        return undefined;
    }

}
//Dashboard --------------------------------------------------------------------------------------------------------

var dashboardModeListners = [];

function addDashboardModeListner(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
    //check event listner and setup current network status 
    try { _event(_sender, this); } catch {
        return; // don't add bad listner
    }
    dashboardModeListners.push(event = { event: _event, sender: _sender });
}

var dashboardViewMode = true;

function _initDashboard() {
    var devicesIndicatorsPanel = document.getElementById("devicesIndicatorsPanel");
    var indicatorsPanel = devicesIndicatorsPanel.appendChild(document.createElement('div'));
    indicatorsPanel.id = "indicatorsPanel";
    indicatorsPanel.className = "col-md-12";
    var infoDiv = indicatorsPanel.appendChild(document.createElement('div'));
    infoDiv.className = "card text-white bg-dark mb-3";
    var headerDiv = infoDiv.appendChild(document.createElement('div'));
    headerDiv.className = "card-header";

    var headerText = headerDiv.appendChild(document.createElement('div'));
    headerText.innerHTML = getLang("Dashboard");

    var headerModeButton = headerText.appendChild(document.createElement('input'));
    headerModeButton.className = "btn btn-secondary btn-sm close";
    headerModeButton.type = "button";
    headerModeButton.value = "V";
    headerModeButton.onclick = changeDashboadMode;

    var addIndicatorButton = headerText.appendChild(document.createElement('input'));
    addIndicatorButton.className = "btn btn-success btn-sm close";
    addIndicatorButton.type = "button";
    addIndicatorButton.value = "+";
    addIndicatorButton.onclick = addIndicatorMode;

    var dataDiv = infoDiv.appendChild(document.createElement('div'));
    dataDiv.id = "indicatorsPanelDataDiv"
    dataDiv.className = "card-body";

    var devicesIndicatorsPanel = document.getElementById("indicatorsPanelDataDiv");
    for (var i = 0; i < configProperties.dashboards[0].indicators.length; i++) {
        var indicatorProp = configProperties.dashboards[0].indicators[i];
        var indicator = IndicatorsLayer.getIndicatorById(indicatorProp.indicatorId);
        if (indicator != undefined) {
            var indicatorWrapper = new indicator.indicator(devicesIndicatorsPanel, undefined, undefined, configProperties.dashboards[0].indicators[i]);
            indicatorWrapper.offlineStarter(devicesIndicatorsPanel, indicatorProp.deviceId, indicatorProp.deviceProperty);
            indicatorWrapper.indicator.addEventListner(config.indicatorEvent, configProperties.dashboards[0].indicators[i]);

        }
    }

}

function changeDashboadMode() {
    dashboardViewMode = !dashboardViewMode;

    for (var k = 0; k < dashboardModeListners.length; k++) {
        dashboardModeListners[k].event(dashboardModeListners[k].sender, dashboardViewMode);
    }
}

function addIndicatorMode() {

    makeModalDialog("resetPanel", "indicator", getLang("indicatorunit"), getLang("areYouSure"));
    var modalBody = document.getElementById("indicatorModalBody");
    modalBody.innerHTML = "";
    var modalFooter = document.getElementById("indicatorModalFooter");
    //Body form -----------------
    var formGroup = modalBody.appendChild(document.createElement("div"));
    formGroup.className = "form-group";

    //device select 
    var deviceLabel = formGroup.appendChild(document.createElement("label"));
    deviceLabel.setAttribute("for", "deviceSelect");
    deviceLabel.innerText = getLang("deviceslist");
    var deviceSelect = formGroup.appendChild(document.createElement('select'));
    deviceSelect.className = "form-control form-control-sm";
    deviceSelect.id = "typeSelect";

    for (var node in configProperties.nodes) {
        
        for (var i = 0; i < configProperties.nodes[node].devices.length; i++) {
            var valueSelectOption = deviceSelect.appendChild(document.createElement('option'));
            valueSelectOption.innerText = getLang(configProperties.nodes[node].devices[i]._alies + "/" + configProperties.nodes[node].devices[i]._id);
            valueSelectOption.device = configProperties.nodes[node].devices[i];
        }
    }

    deviceSelect.onchange = onDeviceSelect;
    //device property select 

    var devicePropLabel = formGroup.appendChild(document.createElement("label"));
    devicePropLabel.setAttribute("for", "devicePropSelect");
    devicePropLabel.innerText = getLang("devicesporplist");
    var devicePropSelect = formGroup.appendChild(document.createElement('select'));
    devicePropSelect.className = "form-control form-control-sm";
    devicePropSelect.id = "typeSelect";

    devicePropSelect.onchange = onDevicePropSelect;

    //indicators 
    //device select 
    var indicatorLabel = formGroup.appendChild(document.createElement("label"));
    indicatorLabel.setAttribute("for", "indicatorSelect");
    indicatorLabel.innerText = getLang("indicatorslist");
    var indicatorSelect = formGroup.appendChild(document.createElement('select'));
    indicatorSelect.className = "form-control form-control-sm";
    indicatorSelect.id = "typeSelect";



    deviceSelect.devicePropSelect = devicePropSelect;
    devicePropSelect.deviceSelect = deviceSelect;
    deviceSelect.indicatorSelect = indicatorSelect;

    var event = { currentTarget: deviceSelect };
    onDeviceSelect(event)


    //end of Body form ----------
    var indicatorButton = modalFooter.appendChild(document.createElement("button"));
    indicatorButton.type = "button";
    indicatorButton.className = "btn btn-sm btn-success";
    indicatorButton.id = "indicatorModalButton";
    indicatorButton.deviceSelect = deviceSelect;
    indicatorButton.onclick = addIndicatorClick;
    indicatorButton.innerText = getLang("addindicatorbutton");

    $("#indicatorModal").modal('show');


}

function onDeviceSelect(event) {
    var deviceSelect = event.currentTarget;
    var devicePropSelect = deviceSelect.devicePropSelect;
    var indicatorSelect = deviceSelect.indicatorSelect;
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
    refreshIndicatorsSelect(indicatorSelect, device, deviceProp);
}

function onDevicePropSelect(event) {
    var devicePropSelect = event.currentTarget;
    var deviceSelect = devicePropSelect.deviceSelect;
    var indicatorSelect = deviceSelect.indicatorSelect;

    var deviceSelectOption = deviceSelect.options[deviceSelect.selectedIndex];
    var device = deviceSelectOption.device;
    var devicePropSelectOption = devicePropSelect.options[devicePropSelect.selectedIndex];
    var deviceProp = devicePropSelectOption.deviceProp;
    refreshIndicatorsSelect(indicatorSelect, device, deviceProp);
}

function refreshIndicatorsSelect(indicatorSelect, device, deviceProp) {
    indicatorSelect.options.length = 0;
    for (var indicator in IndicatorsLayer) {
        if (IndicatorsLayer[indicator].indicator == undefined) continue;
        if ((IndicatorsLayer[indicator].devicesTypes.includes(";" + device.type.value + ";")) || (IndicatorsLayer[indicator].devicesTypes == "any")) {
            if ((IndicatorsLayer[indicator].devicesProperties.includes(";" + deviceProp.name + ";")) || (IndicatorsLayer[indicator].devicesProperties == "any")) {
                var indicatorSelectOption = indicatorSelect.appendChild(document.createElement('option'));
                indicatorSelectOption.innerText = IndicatorsLayer[indicator].name;
                indicatorSelectOption.indicator = IndicatorsLayer[indicator];
            }
        }
    }

}


function addIndicatorClick(event) {
    var devicesIndicatorsPanel = document.getElementById("indicatorsPanelDataDiv");
    var button = event.currentTarget;
    var deviceSelect = button.deviceSelect;
    var devicePropSelect = deviceSelect.devicePropSelect;
    var indicatorSelect = deviceSelect.indicatorSelect;

    var valueSelectOption = deviceSelect.options[deviceSelect.selectedIndex];
    var device = valueSelectOption.device;
    var deviceProp = devicePropSelect.options[devicePropSelect.selectedIndex].deviceProp;
    var indicator = indicatorSelect.options[indicatorSelect.selectedIndex].indicator;

    var indicatorIndicatorWrapper = new indicator.indicator(devicesIndicatorsPanel, device, deviceProp);

    var configPropertiesIndicator = config.addIndicator("main", device._id, deviceProp.name, indicator.id)

    indicatorWrapper.indicator.addEventListner(config.indicatorEvent, configPropertiesIndicator);




    $("#indicatorModal").modal('hide');

    /*
        var devicesIndicatorsPanel = document.getElementById("indicatorsPanelDataDiv");
        var device = devices.getDeviceById("temperature");    
        new TemperatureIndicatorWrapper(devicesIndicatorsPanel, device, device.temperature);
        new TemperatureIndicatorWrapper(devicesIndicatorsPanel, device, device.temperature, 1);
    
        var device = devices.getDeviceById("humidiry");
        new HumidityDevice(devicesIndicatorsPanel, device, device.humidity);
        new HumidityDevice(devicesIndicatorsPanel, device, device.humidity, 1);

    */

}

function onOnlineStatusChange(sender, devices) {
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
}


function onWiFiAPStatusChange(sender, deviceProperty) {
    if (deviceProperty.value == 1) {
        sender.className = "badge badge-success";

    }
    else {
        sender.className = "badge badge-secondary";
    }
}

function onWiFiSTStatusChange(sender, deviceProperty) {
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
}

function onRESTfulStatusChange(sender, deviceProperty) {
    if (deviceProperty.value == 1) {
        sender.className = "badge badge-success";

    }
    else {
        sender.className = "badge badge-secondary";
    }
}

function onRESTfulOnlineStatusChange(sender, devices) {
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
}

function onMQTTStatusChange(sender, deviceProperty) {

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
}

function onOTAStatusChange(sender, deviceProperty) {
    if (deviceProperty.value == 1) {
        sender.className = "badge badge-success";

    }
    else {
        sender.className = "badge badge-secondary";
    }
}




//ENDOF Dashboard --------------------------------------------------------------------------------------------------------



