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

    var devicesIndicatorsPanel = document.getElementById("devicesIndicatorsPanel");

    var graphIndicator = new GraphIndicator(devicesIndicatorsPanel, "temperature", 150, temperatureIcon);
    graphIndicator.refresh("temperature", "temperature", "4;1000.10;0.30;2500.40;1000.010;");
    graphIndicator.networkStatus = NET_ONLINE;


    var graphIndicator = new GraphIndicator(devicesIndicatorsPanel, "temperature", 150);
    graphIndicator.refresh("temperature", "temperature", "4;1000.10;0.30;2500.40;1000.010;");
    graphIndicator.networkStatus = NET_RECONNECT;

    var graphIndicator = new GraphIndicator(devicesIndicatorsPanel, "temperature", 150);
    graphIndicator.refresh("temperature", "temperature", "30;25.10;25.30;25.40;26.00;26.00;25.00;27.00;25.00;25.00;27.00;25.10;25.20;25.40;25.50;25.30;25.10;26.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;35.00;");   
    graphIndicator.networkStatus = NET_OFFLINE;

    var graphIndicator = new GraphIndicator(devicesIndicatorsPanel, "temperature", 150);
    graphIndicator.refresh("temperature", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");   
    graphIndicator.networkStatus = NET_ERROR;

    var graphIndicator = new GraphIndicator(devicesIndicatorsPanel, "temperature", 150);
    graphIndicator.refresh("temperature", "temperature", "60;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");   
    graphIndicator.networkStatus = NET_ONLINE;

    motionIndicator = new MotionIndicator(devicesIndicatorsPanel, "temperature", 150);
//    motionIndicator.refresh(1, "detect", "motion", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");
//short
    motionIndicator.refresh(1, "detect", "motion", "5;2.00;2.00;4.00;2.00;4.00;");
    motionIndicator.networkStatus = NET_ONLINE;


    var temperatureIndicator = new TemperatureIndicator(devicesIndicatorsPanel, "temperature", 150);
    temperatureIndicator.refresh(25, "25C", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");

    temperatureIndicator = new TemperatureIndicator(devicesIndicatorsPanel, "temperature", 150);
    temperatureIndicator.refresh(-5, "-5C", "temperature");
    temperatureIndicator.networkStatus = NET_RECONNECT;

    temperatureIndicator = new TemperatureIndicator(devicesIndicatorsPanel, "temperature", 150);
    temperatureIndicator.refresh(50, "50C", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");

    temperatureIndicator = new TemperatureIndicator(devicesIndicatorsPanel, "temperature", 150);
    temperatureIndicator.refresh(27, "27C", "temperature");
    temperatureIndicator.networkStatus = NET_ERROR;




    lightIndicator = new LightIndicator(devicesIndicatorsPanel, "temperature", 150);
    lightIndicator.refresh(10, "low", "light");
    lightIndicator.networkStatus = NET_ONLINE;

    lightIndicator = new LightIndicator(devicesIndicatorsPanel, "temperature", 150);
    lightIndicator.refresh(50, "norm", "light");
    lightIndicator.networkStatus = NET_ONLINE;

    lightIndicator = new LightIndicator(devicesIndicatorsPanel, "temperature", 150);
    lightIndicator.refresh(61, "high", "light");
    lightIndicator.networkStatus = NET_ONLINE;

    lightIndicator = new LightIndicator(devicesIndicatorsPanel, "temperature", 150);
    lightIndicator.refresh(100, "high", "light");
    lightIndicator.networkStatus = NET_ONLINE;

    lightIndicator = new LightIndicator(devicesIndicatorsPanel, "temperature", 150);
    lightIndicator.refresh(40, "low", "light");
    lightIndicator.networkStatus = NET_RECONNECT;

    lightIndicator = new LightIndicator(devicesIndicatorsPanel, "temperature", 150);
    lightIndicator.refresh(50, "norm", "light");

    lightIndicator = new LightIndicator(devicesIndicatorsPanel, "temperature", 150);
    lightIndicator.refresh(75, "high", "light");
    lightIndicator.networkStatus = NET_ERROR;


    smokeIndicator = new SmokeIndicator(devicesIndicatorsPanel, "temperature", 150);
    smokeIndicator.refresh(10, "smokelow", "smoke");
    smokeIndicator.networkStatus = NET_ONLINE;

    smokeIndicator = new SmokeIndicator(devicesIndicatorsPanel, "temperature", 150);
    smokeIndicator.refresh(50, "smokenorm", "smoke");
    smokeIndicator.networkStatus = NET_ONLINE;

    smokeIndicator = new SmokeIndicator(devicesIndicatorsPanel, "temperature", 150);
    smokeIndicator.refresh(61, "smokehigh", "smoke");
    smokeIndicator.networkStatus = NET_ONLINE;

    smokeIndicator = new SmokeIndicator(devicesIndicatorsPanel, "temperature", 150);
    smokeIndicator.refresh(100, "smokehigh", "smoke");
    smokeIndicator.networkStatus = NET_ONLINE;

    smokeIndicator = new SmokeIndicator(devicesIndicatorsPanel, "temperature", 150);
    smokeIndicator.refresh(50, "smokelow", "smoke");
    smokeIndicator.networkStatus = NET_RECONNECT;

    smokeIndicator = new SmokeIndicator(devicesIndicatorsPanel, "temperature", 150);
    smokeIndicator.refresh(72, "smokenorm", "smoke");

    smokeIndicator = new SmokeIndicator(devicesIndicatorsPanel, "temperature", 150);
    smokeIndicator.refresh(83, "smokehigh", "smoke");
    smokeIndicator.networkStatus = NET_ERROR;

    motionIndicator = new MotionIndicator(devicesIndicatorsPanel, "temperature", 150);
    motionIndicator.refresh(1, "detect", "motion");
    motionIndicator.networkStatus = NET_ONLINE;


    motionIndicator = new MotionIndicator(devicesIndicatorsPanel, "temperature", 150);
    motionIndicator.refresh(0, "notdetect", "motion");
    motionIndicator.networkStatus = NET_RECONNECT;

    motionIndicator = new MotionIndicator(devicesIndicatorsPanel, "temperature", 150);
    motionIndicator.refresh(1, "detect", "motion");

    motionIndicator = new MotionIndicator(devicesIndicatorsPanel, "temperature", 150);
    motionIndicator.refresh(1, "notdetect", "motion");
    motionIndicator.networkStatus = NET_ERROR;



    var radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(1, "1%", "humidity");

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(50, "50%", "humidity");
    radialIndicator.networkStatus = NET_RECONNECT;

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(100, "100%", "humidity");

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(50, "27C", "temperature");
    radialIndicator.networkStatus = NET_ERROR;

    var radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(1, "1%", "humidity");

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(50, "50%", "humidity");
    radialIndicator.networkStatus = NET_RECONNECT;

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(100, "100%", "humidity");

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(50, "27C", "temperature");
    radialIndicator.networkStatus = NET_ERROR;


    var actuatorIndicator = new ActuatorIndicator(devicesIndicatorsPanel, "temperature", 150);
    actuatorIndicator.refresh(1, "on", "humidity");
    actuatorIndicator._networkStatus = NET_ONLINE;

    actuatorIndicator = new ActuatorIndicator(devicesIndicatorsPanel, "temperature", 150);
    actuatorIndicator.refresh(0, "off", "humidity");
    actuatorIndicator._networkStatus = NET_OFFLINE;

    actuatorIndicator = new ActuatorIndicator(devicesIndicatorsPanel, "temperature", 150);
    actuatorIndicator.refresh(0, "off", "humidity");
    actuatorIndicator._networkStatus = NET_ERROR;

    actuatorIndicator = new ActuatorIndicator(devicesIndicatorsPanel, "temperature", 150);
    actuatorIndicator.refresh(100, "on", "humidity");
    actuatorIndicator._networkStatus = NET_RECONNECT;



    var radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(1, "1%", "humidity");

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(50, "50%", "humidity");
    radialIndicator._networkStatus = NET_RECONNECT;

    radialIndicator = new RadialIndicator(devicesIndicatorsPanel, "temperature", 150);
    radialIndicator.refresh(100, "100%", "humidity");

    var lcdIndicator = new LCDIndicator(devicesIndicatorsPanel, "temperature", 150);
    lcdIndicator.refresh("1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL", "LCD", 0);

    var lcdIndicator = new LCDIndicator(devicesIndicatorsPanel, "temperature", 150);
    lcdIndicator.refresh("sad 123e123 123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
    lcdIndicator.networkStatus = NET_ONLINE;

    var lcdIndicator = new LCDIndicator(devicesIndicatorsPanel, "temperature", 150);
    lcdIndicator.refresh("1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL", "LCD", 0);

    var lcdIndicator = new LCDIndicator(devicesIndicatorsPanel, "temperature", 150);
    lcdIndicator.refresh("123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
    lcdIndicator.networkStatus = NET_RECONNECT;

    var lcdIndicator = new LCDIndicator(devicesIndicatorsPanel, "temperature", 150);
    lcdIndicator.refresh("sad 123e123 123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
    lcdIndicator.networkStatus = NET_ONLINE;


    /*
    stepperIndicator = new StepperIndicator(devicesIndicatorsPanel, "stepper", 150);
    stepperIndicator.refresh(80, 20, "80%", "stepper");

    stepperIndicator = new StepperIndicator(devicesIndicatorsPanel, "stepper", 150);
    stepperIndicator.refresh(50, 50, "25%", "stepper");
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

