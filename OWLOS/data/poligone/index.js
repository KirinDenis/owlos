var theme = {};


$(document).ready(function () {
    "use strict";
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

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150, temperatureIcon).onload = function (widget) {
        widget.refresh("temperature", "temperature", "4;1000.10;0.30;2500.40;1000.010;");
        widget.networkStatus = NET_ONLINE;
    };

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("temperature", "temperature", "4;1000.10;0.30;2500.40;1000.010;");
        widget.networkStatus = NET_RECONNECT;
    };

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("temperature", "temperature", "30;25.10;25.30;25.40;26.00;26.00;25.00;27.00;25.00;25.00;27.00;25.10;25.20;25.40;25.50;25.30;25.10;26.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;35.00;");
        widget.networkStatus = NET_OFFLINE;
    };

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("temperature", "temperature", "30;25.10;25.30;25.40;26.00;26.00;25.00;27.00;25.00;25.00;27.00;25.10;25.20;25.40;25.50;25.30;25.10;26.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;25.00;35.00;");
        widget.networkStatus = NET_ERROR;
    };

    var graphWidget = new GraphWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("temperature", "temperature", "60;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");
        widget.networkStatus = NET_ONLINE;
    };

    var motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "detect", "motion", "5;2.00;2.00;4.00;2.00;4.00;");
        widget.networkStatus = NET_ONLINE;
    };

    var temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(25, "+25", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");
        widget.networkStatus = NET_ONLINE;
    };

    temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(-5, "-5", "temperature");
        widget.networkStatus = NET_RECONNECT;
    };

    temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "50", "temperature", "30;2.00;2.00;4.00;2.00;4.00;4.00;2.00;4.00;1.00;4.00;4.00;4.00;2.00;4.00;2.00;4.00;4.00;3.00;4.00;2.00;4.00;2.00;4.00;2.00;4.00;4.00;4.00;3.00;4.00;4.00;");
    };

    temperatureWidget = new TemperatureWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(27, "27", "temperature");
        widget.networkStatus = NET_ERROR;
    };

    var lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(10, "low", "light");
        widget.networkStatus = NET_ONLINE;
    }

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "norm", "light");
        widget.networkStatus = NET_ONLINE;
    }

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(61, "high", "light");
        widget.networkStatus = NET_ONLINE;
    }

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(100, "high", "light");
        widget.networkStatus = NET_ONLINE;
    }

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(40, "low", "light");
        widget.networkStatus = NET_RECONNECT;
    }

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "norm", "light");
    }

    lightWidget = new LightWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(75, "high", "light");
        widget.networkStatus = NET_ERROR;
    }

    var smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(10, "smokelow", "smoke");
        widget.networkStatus = NET_ONLINE;
    }

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "smokenorm", "smoke");
        widget.networkStatus = NET_ONLINE;
    }

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(61, "smokehigh", "smoke");
        widget.networkStatus = NET_ONLINE;
    }

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(100, "smokehigh", "smoke");
        widget.networkStatus = NET_ONLINE;
    }

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "smokelow", "smoke");
        widget.networkStatus = NET_RECONNECT;
    }

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(72, "smokenorm", "smoke");
    }

    smokeWidget = new SmokeWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(83, "smokehigh", "smoke");
        widget.networkStatus = NET_ERROR;
    }

    var motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "detect", "motion");
        widget.networkStatus = NET_ONLINE;
    }

    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(0, "notdetect", "motion");
        widget.networkStatus = NET_RECONNECT;
    }

    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "detect", "motion");
    }

    motionWidget = new MotionWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "notdetect", "motion");
        widget.networkStatus = NET_ERROR;
    }

    var radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "1%", "humidity");
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "50%", "humidity");
        widget.networkStatus = NET_RECONNECT;
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(100, "100%", "humidity");
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(20, "20%", "temperature");
        widget.networkStatus = NET_ERROR;
    }

    var radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "1%", "humidity");
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "50%", "humidity");
        widget.networkStatus = NET_RECONNECT;
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(100, "100%", "humidity");
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "27C", "temperature");
        widget.networkStatus = NET_ERROR;
    }


    var actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "on", "humidity");
        widget._networkStatus = NET_ONLINE;
    }

    actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(0, "off", "humidity");
        widget._networkStatus = NET_OFFLINE;
    }

    actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(0, "off", "humidity");
        widget._networkStatus = NET_ERROR;
    }

    actuatorWidget = new ActuatorWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(100, "on", "humidity");
        widget._networkStatus = NET_RECONNECT;
    }

    var radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(1, "1%", "humidity");
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(50, "50%", "humidity");
        widget._networkStatus = NET_RECONNECT;
    }

    radialWidget = new RadialWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh(100, "100%", "humidity");
    }

    var lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL", "LCD", 0);
    }

    var lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("sad 123e123 123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
        widget.networkStatus = NET_ONLINE;
    }

    lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL1234567890ABCSDEFGHL", "LCD", 0);
    }

    lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
        widget.networkStatus = NET_RECONNECT;
    }

    lcdWidget = new LCDWidget(devicesWidgetsPanel, "temperature", 150).onload = function (widget) {
        widget.refresh("sad 123e123 123456 EFGH     L1234   56789 0ABCSDEFGHL", "LCD", 1);
        widget.networkStatus = NET_ONLINE;
    }


    /*
    stepperWidget = new StepperWidget(devicesWidgetsPanel, "stepper", 150);
    stepperWidget.refresh(80, 20, "80%", "stepper");

    stepperWidget = new StepperWidget(devicesWidgetsPanel, "stepper", 150);
    stepperWidget.refresh(50, 50, "25%", "stepper");
    */


}
);



