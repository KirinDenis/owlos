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

    if (theme.primary === '') { //default dark
        theme.primary = '#3A3F44';
        theme.secondary = '#7A8288';
        theme.success = '#62c462';
        theme.info = '#5bc0de';
        theme.warning = '#f89406';
        theme.danger = '#ee5f5b';
        theme.light = '#e9ecef';
        theme.dark = '#272B30';
    }

    var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");

    var radialWidget = new RadialWidget(driversWidgetsPanel, "temperature", 250).onload = function (widget) {
        widget.refresh(1, "10%", "radial");
        widget.networkStatus = 1;
    }




}
);



