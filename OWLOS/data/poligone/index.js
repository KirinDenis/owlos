var theme = {};

//Global flags 
const NET_OFFLINE = 0;
const NET_ONLINE = 1;
const NET_ERROR = 2;
const NET_RECONNECT = 3;

$(document).ready(function () {
    var style = getComputedStyle(document.body);
    theme.primary = style.getPropertyValue('--primary');
    theme.secondary = style.getPropertyValue('--secondary');
    //theme.secondary = " #5A5A5A";
    theme.success = style.getPropertyValue('--success');
    theme.info = style.getPropertyValue('--info');
    theme.warning = style.getPropertyValue('--warning');
    theme.danger = style.getPropertyValue('--danger');
    theme.light = style.getPropertyValue('--light');
    theme.dark = style.getPropertyValue('--dark');
    theme.fontFamily = style.fontFamily;

    var devicesWidgetsPanel = document.getElementById("devicesWidgetsPanel");

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150, temperatureIcon);
    graphWidget.refresh("temperature", "temperature", "4;1000.10;0.30;2500.40;1000.010;");
    graphWidget.networkStatus = NET_ONLINE;


    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150);
    graphWidget.refresh("temperature", "temperature", "4;1000.10;0.30;2500.40;1000.010;");
    graphWidget.networkStatus = NET_RECONNECT;

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150);
    graphWidget.refresh("temperature", "temperature", "30;25.10;25.30;25.40;26.00;26.00;25.00;27.00;25.00;25.00;27.00;25.10;25.20;25.40;25.50;25.30;25.10;26.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;35.00;");   
    graphWidget.networkStatus = NET_OFFLINE;

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150);
    graphWidget.refresh("temperature", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");   
    graphWidget.networkStatus = NET_ERROR;

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150);
    graphWidget.refresh("temperature", "temperature", "60;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");   
    graphWidget.networkStatus = NET_ONLINE;

    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150);
//    motionWidget.refresh(1, "detect", "motion", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");
//short
    motionWidget.refresh(1, "detect", "motion", "5;2.00;2.00;4.00;2.00;4.00;");
    motionWidget.networkStatus = NET_ONLINE;


    var temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150);
    temperatureWidget.refresh(25, "25C", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");

    temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150);
    temperatureWidget.refresh(-5, "-5C", "temperature");
    temperatureWidget.networkStatus = NET_RECONNECT;

    temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150);
    temperatureWidget.refresh(50, "50C", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");

    temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150);
    temperatureWidget.refresh(27, "27C", "temperature");
    temperatureWidget.networkStatus = NET_ERROR;




    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150);
    lightWidget.refresh(10, "low", "light");
    lightWidget.networkStatus = NET_ONLINE;

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150);
    lightWidget.refresh(50, "norm", "light");
    lightWidget.networkStatus = NET_ONLINE;

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150);
    lightWidget.refresh(61, "high", "light");
    lightWidget.networkStatus = NET_ONLINE;

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150);
    lightWidget.refresh(100, "high", "light");
    lightWidget.networkStatus = NET_ONLINE;

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150);
    lightWidget.refresh(40, "low", "light");
    lightWidget.networkStatus = NET_RECONNECT;

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150);
    lightWidget.refresh(50, "norm", "light");

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150);
    lightWidget.refresh(75, "high", "light");
    lightWidget.networkStatus = NET_ERROR;


    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150);
    smokeWidget.refresh(10, "smokelow", "smoke");
    smokeWidget.networkStatus = NET_ONLINE;

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150);
    smokeWidget.refresh(50, "smokenorm", "smoke");
    smokeWidget.networkStatus = NET_ONLINE;

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150);
    smokeWidget.refresh(61, "smokehigh", "smoke");
    smokeWidget.networkStatus = NET_ONLINE;

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150);
    smokeWidget.refresh(100, "smokehigh", "smoke");
    smokeWidget.networkStatus = NET_ONLINE;

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150);
    smokeWidget.refresh(50, "smokelow", "smoke");
    smokeWidget.networkStatus = NET_RECONNECT;

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150);
    smokeWidget.refresh(72, "smokenorm", "smoke");

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150);
    smokeWidget.refresh(83, "smokehigh", "smoke");
    smokeWidget.networkStatus = NET_ERROR;

    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150);
    motionWidget.refresh(1, "detect", "motion");
    motionWidget.networkStatus = NET_ONLINE;


    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150);
    motionWidget.refresh(0, "notdetect", "motion");
    motionWidget.networkStatus = NET_RECONNECT;

    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150);
    motionWidget.refresh(1, "detect", "motion");

    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150);
    motionWidget.refresh(1, "notdetect", "motion");
    motionWidget.networkStatus = NET_ERROR;



    var radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(1, "1%", "humidity");

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(50, "50%", "humidity");
    radialWidget.networkStatus = NET_RECONNECT;

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(100, "100%", "humidity");

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(50, "27C", "temperature");
    radialWidget.networkStatus = NET_ERROR;

    var radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(1, "1%", "humidity");

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(50, "50%", "humidity");
    radialWidget.networkStatus = NET_RECONNECT;

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(100, "100%", "humidity");

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(50, "27C", "temperature");
    radialWidget.networkStatus = NET_ERROR;


    var actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150);
    actuatorWidget.refresh(1, "on", "humidity");
    actuatorWidget._networkStatus = NET_ONLINE;

    actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150);
    actuatorWidget.refresh(0, "off", "humidity");
    actuatorWidget._networkStatus = NET_OFFLINE;

    actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150);
    actuatorWidget.refresh(0, "off", "humidity");
    actuatorWidget._networkStatus = NET_ERROR;

    actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150);
    actuatorWidget.refresh(100, "on", "humidity");
    actuatorWidget._networkStatus = NET_RECONNECT;



    var radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(1, "1%", "humidity");

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(50, "50%", "humidity");
    radialWidget._networkStatus = NET_RECONNECT;

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150);
    radialWidget.refresh(100, "100%", "humidity");

    var lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150);
    lcdWidget.refresh("1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL", "LCD", 0);

    var lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150);
    lcdWidget.refresh("sad 123e123 123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
    lcdWidget.networkStatus = NET_ONLINE;

    var lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150);
    lcdWidget.refresh("1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL", "LCD", 0);

    var lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150);
    lcdWidget.refresh("123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
    lcdWidget.networkStatus = NET_RECONNECT;

    var lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150);
    lcdWidget.refresh("sad 123e123 123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
    lcdWidget.networkStatus = NET_ONLINE;


    /*
    stepperWidget = new StepperWidget(devicesWidgetsPanel, "stepper", 150);
    stepperWidget.refresh(80, 20, "80%", "stepper");

    stepperWidget = new StepperWidget(devicesWidgetsPanel, "stepper", 150);
    stepperWidget.refresh(50, 50, "25%", "stepper");
    */


}
);


//----------------------------------------------------------------------------------------------------------------------------------
// Devices Panels
//----------------------------------------------------------------------------------------------------------------------------------
// Actuator
function drawActuator(id, parentPanel) {
    var checkBox = document.getElementById(id + "checkBox");
    var checkBoxLabel = document.getElementById(id + "checkBoxLabel");
    if (checkBox == null) {
        var actuator = parentPanel.appendChild(document.createElement('div'));

        actuator.className = "card col-md-1 devicePanelDiv";
        actuator.style.cursor = "pointer";

        var controlDiv = actuator.appendChild(document.createElement('div'));
        controlDiv.className = "custom-control custom-switch  float-right";
        controlDiv.parentActuator = actuator;
        checkBox = controlDiv.appendChild(document.createElement('input'));
        checkBox.type = "checkbox";
        checkBox.className = "custom-control-input";
        checkBox.id = id + "checkBox";
        checkBox.device = id;
        checkBox.parentActuator = actuator;

        _checkBoxLabel = controlDiv.appendChild(document.createElement('label'));
        _checkBoxLabel.className = "custom-control-label";
        _checkBoxLabel.setAttribute("for", id + "checkBox");
        _checkBoxLabel.parentActuator = actuator;




        var h2 = actuator.appendChild(document.createElement('h2'));
        h2.className = "text-info middleContainer";

        checkBoxLabel = h2.appendChild(document.createElement('label'));
        checkBoxLabel.id = id + "checkBoxLabel";

        checkBoxLabel.parentActuator = actuator;
        checkBox.label = checkBoxLabel;



        var idDiv = actuator.appendChild(document.createElement('div'));
        idDiv.className = "buttomContainer";
        idDiv.innerHTML = id;
        idDiv.parentActuator = actuator;

        var offlineDiv = actuator.appendChild(document.createElement('div'));
        offlineDiv.className = "text-danger middleContainer";
        offlineDiv.innerHTML = "offline";
        offlineDiv.style.display = 'none';
        offlineDiv.parentActuator = actuator;

        var spinner = actuator.appendChild(document.createElement('div'));
        spinner.className = "spinner-border text-info";
        spinner.style = "width: 6rem; height: 6rem;";
        spinner.role = "status";
        spinner.style.display = 'none';
        // spinner.setAttribute("aria-hidden", "true");


        actuator.checkBox = checkBox;
        actuator.checkBoxLabel = checkBoxLabel;
        actuator.spinner = spinner;
        actuator.offline = offlineDiv;
        actuator.onclick = actuatorCheckBoxClick;



    }

    drawActuatorData(actuator, getParsedDeviceProperty(id, "data"));
}

function drawActuatorData(actuator, data) {
    if (actuator == null) return;
    actuator.spinner.style.display = 'none';
    actuator.offline.style.display = 'none';

    if (data == "1") {
        actuator.className = "card col-md-1 border-primary devicePanelDiv";
        actuator.checkBox.checked = true;
        actuator.checkBoxLabel.innerHTML = "On";
        actuator.checkBox.disabled = false;
    }
    else
        if (data == "0") {
            actuator.className = "card col-md-1 devicePanelDiv bg-dark";
            actuator.checkBox.checked = "";
            actuator.checkBoxLabel.innerHTML = "Off";
            actuator.checkBox.disabled = false;
        }

        else {
            actuator.className = "card col-md-1 text-white devicePanelDiv border-danger bg-dark";
            actuator.checkBoxLabel.innerHTML = "";
            actuator.offline.className = "text-danger middleContainer";
            actuator.offline.style.display = 'block';
            actuator.offline.innerHTML = "offline";
        }

}

function actuatorCheckBoxClick(event) {

    event.stopPropagation();
    var actuator = event.target;
    if (actuator == null) return true;
    if (actuator.parentActuator != null) actuator = actuator.parentActuator;
    if (actuator == null) return true;
    if (actuator.checkBox == null) return true;

    if (actuator.checkBox.disabled == true) { //back to online 
        actuator.className = "card col-md-1 text-white devicePanelDiv border-warning bg-dark";
        actuator.spinner.style.display = 'block';
        actuator.offline.className = "text-warning middleContainer";
        actuator.offline.innerHTML = "back to online";
        getDevicePropertyAsyncWithReciever(actuator.checkBox.device, "data", actuatorReturnOnline, actuator);
    }
    else { //send data to unit 
        actuator.checkBox.disabled = true;
        actuator.spinner.style.display = 'block';
        actuator.offline.style.display = 'none';


        if (actuator.checkBox.checked) {
            setDevicePropertyAsyncWithReciever(actuator.checkBox.device, "data", "0", actuatorComplete, actuator);
            actuator.checkBox.label.innerHTML = "Do";
        }
        else {
            setDevicePropertyAsyncWithReciever(actuator.checkBox.device, "data", "1", actuatorComplete, actuator);
            actuator.checkBox.label.innerHTML = "Do";
        }
    }


    return true;
}

function actuatorComplete(_data, actuator) {
    if (_data == "1") //call API OK = 1
    {
        //reverse current stait
        if (actuator.checkBox.checked) _data = "0";
        else
            _data = "1";

    }
    else {
        _data += "bad"; //error code +bad keyword
    }
    drawActuatorData(actuator, _data);
    return true;
}

function actuatorReturnOnline(_data, actuator) {
    //the result is getProperty actualy data - 1, 0 or error
    drawActuatorData(actuator, _data);
    return true;
}

