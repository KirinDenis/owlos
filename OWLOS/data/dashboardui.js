/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

//Dashboard UI
var dashboardUI = {
    dashboardModeListners: [],
    dashboardViewMode: true,
    mainProperties: ",data,historydata,historyfile,temperature,humidity,temperaturehistoryfile,temperaturehistorydata,humidityhistoryfile,humidityhistorydata,text,heatindexhistorydata",
    secondaryDrivers: ",wifi,esp,network",
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
        var saveWidgetsButton = headerPanelUI.addButton("saveaddedwidget", "fa fa-save", getLang("saveconfiguration"), headerPanelUI.widgetsPanelButtonRole);
        saveWidgetsButton.onclick = dashboardUI.saveAddedWidget;
        var headerModeButton = headerPanelUI.addButton("dashboardaddwidget", "fa fa-edit", getLang("tooglewidgetsmode"), headerPanelUI.widgetsPanelButtonRole);
        headerModeButton.onclick = dashboardUI.changeDashboadMode;
        var addWidgetButton = headerPanelUI.addButton("dashboardaddwidget", "fa fa-plus", getLang("addwidget"), headerPanelUI.widgetsPanelButtonRole);
        addWidgetButton.onclick = dashboardUI.onAddWidgetClick;

        //эта панель появляется когда виджетов нет
        var noWidgetsPanel = document.getElementById("noWidgetsPanel");
        //эта кнопка описана в index.html, появляется когда виджетов нет
        var noOneAddWidgetButton = document.getElementById("noOneAddWidgetButton");
        if (noOneAddWidgetButton != undefined) {
        document.getElementById("noOneAddWidgetButton").onclick = dashboardUI.onAddWidgetClick; 
        }

        sideBar.dashboardItem.href.saveWidgetsButton = saveWidgetsButton;
        sideBar.dashboardItem.href.headerModeButton = headerModeButton;
        sideBar.dashboardItem.href.addWidgetButton = addWidgetButton;

        var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");

        //если есть хоть какие то виджеты грузим их
        if (configProperties.dashboards[0].widgets.length > 0) {
            noWidgetsPanel.style.display = "none";
            for (var i = 0; i < configProperties.dashboards[0].widgets.length; i++) {
                try {
                    var widgetProp = configProperties.dashboards[0].widgets[i];
                    var widgetLayer = WidgetsLayer.getWidgetById(widgetProp.widgetWrapperId);
                    if (widgetLayer != undefined) {
                        var widgetWrapper = new widgetLayer.widget(driversWidgetsPanel, undefined, undefined, configProperties.dashboards[0].widgets[i], widgetProp.widgetProperties);
                        widgetWrapper.offlineStarter(driversWidgetsPanel, widgetProp.driverId, widgetProp.driverProperty);
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
        }
        else { //очень времено - создаем виджеты для стандартных драйверов по умолчания
            document.getElementById("noWidgetsPanel").style.display = "block";
            noWidgetsPanel.style.display = "block";
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
    //Widgets panel -----------------------------------------------------------------------------------------------
    onAddWidgetClick: function () {

        var addWidgetDialog = createModalDialog(getLang("dashboardaddwidget"), "");
        addWidgetDialog.appendSelect(createDialogSelect("thingselect", "<strong>" + getLang("thingselect") + "</strong>"));

        var thingSelect = addWidgetDialog.getChild("thingselect");
        thingSelect.onchange = dashboardUI.onThingSelectChange;
        thingSelect.addWidgetDialog = addWidgetDialog;

        for (var thing in configProperties.things) {
            var thingSelectOption = thingSelect.dialogSelect.appendOption(configProperties.things[thing].thingnickname);
            thingSelectOption.thing = configProperties.things[thing];
        }

        addWidgetDialog.appendSelect(createDialogSelect("driverselect", getLang("driverselect")));
        var driverSelect = addWidgetDialog.getChild("driverselect");
        thingSelect.driverSelect = driverSelect;
        driverSelect.onchange = dashboardUI.onDriverSelectChange;

        addWidgetDialog.appendSelect(createDialogSelect("propselect", getLang("propselect")));
        var propSelect = addWidgetDialog.getChild("propselect");
        driverSelect.propSelect = propSelect;
        propSelect.onchange = dashboardUI.onPropSelectChange;

        addWidgetDialog.appendSelect(createDialogSelect("widgetselect", getLang("widgetselect")));
        var widgetSelect = addWidgetDialog.getChild("widgetselect");
        propSelect.widgetSelect = widgetSelect;

        dashboardUI.onThingSelectChange(event = { currentTarget: thingSelect });

        addWidgetDialog.onOK = dashboardUI.doAddWidget;
        addWidgetDialog.show();
    },
    doAddWidget: function (addWidgetDialog) {
        var driverSelect = addWidgetDialog.getChild("driverselect");
        var driver = driverSelect.options[driverSelect.selectedIndex].driver;
        var propSelect = addWidgetDialog.getChild("propselect");
        var driverProp = propSelect.options[propSelect.selectedIndex].prop;
        var widgetSelect = addWidgetDialog.getChild("widgetselect");
        var widgetLayer = widgetSelect.options[widgetSelect.selectedIndex].widgetLayer;

        var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");

        new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {
            var configPropertiesWidget = config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);
            widgetWrapper.widget.onchange = config.onWidgetChange;
            widgetWrapper.widget.ondelete = config.onWidgetDelete;
        };
        document.getElementById("noWidgetsPanel").style.display = "none";
        return true;
    },
    onThingSelectChange: function (event) {
        var thingSelect = event.currentTarget;
        var thingSelectOption = thingSelect.options[thingSelect.selectedIndex];
        var thing = thingSelectOption.thing;
        var driverSelect = thingSelect.driverSelect;

        driverSelect.options.length = 0;
        for (var i = 0; i < thing.drivers.length; i++) {
            if (dashboardUI.secondaryDrivers.indexOf("," + thing.drivers[i]._id) == -1) {
                var driverSelectOption = driverSelect.dialogSelect.appendOption(thing.drivers[i]._id, 0);
                driverSelectOption.className = "bold-option";
            }
            else {
                var driverSelectOption = driverSelect.dialogSelect.appendOption(thing.drivers[i]._id, 0);
            }
            driverSelectOption.driver = thing.drivers[i];
        }
        if (thing.drivers.length == 0) {
            driverSelect.disabled = true;
            thingSelect.addWidgetDialog.errorLabel.innerHTML = getLang("thingoffline");
        }
        else {
            driverSelect.disabled = false;
            driverSelect.selectedIndex = 0;
            thingSelect.addWidgetDialog.errorLabel.innerHTML = "";
        }
        dashboardUI.onDriverSelectChange(event = { currentTarget: driverSelect });
        return false;
    },
    onDriverSelectChange: function (event) {
        var driverSelect = event.currentTarget;
        var propSelect = driverSelect.propSelect;
        propSelect.options.length = 0;
        propSelect.disabled = driverSelect.disabled;
        if (!driverSelect.disabled) {
            var driverSelectOption = driverSelect.options[driverSelect.selectedIndex];
            var driver = driverSelectOption.driver;
            for (var driverProp in driver) {
                if ((driver[driverProp].name == undefined) || (driver[driverProp].type == undefined)) continue;
                var driverPropValue = driver[driverProp].value;
                if (driverPropValue.length > 10) {
                    driverPropValue = driverPropValue.substr(0,7) + "...";
                }
                if (dashboardUI.mainProperties.indexOf("," + driver[driverProp].name) != -1) {
                    var propSelectOption = propSelect.dialogSelect.appendOption(driver[driverProp].name + " [" + driverPropValue + "]", 0);
                    propSelectOption.className = "bold-option";
                }
                else {
                    var propSelectOption = propSelect.dialogSelect.appendOption(driver[driverProp].name + " [" + driverPropValue + "]");
                }
                propSelectOption.prop = driver[driverProp];
                propSelectOption.driver = driver;
            }
            //три драйвера есть всегда, если нода online у этих драйверов точно есть свойства
            propSelect.selectedIndex = 0;
        }
        dashboardUI.onPropSelectChange(event = { currentTarget: propSelect });
        return false;
    },
    onPropSelectChange: function (event) {
        var propSelect = event.currentTarget;
        var widgetSelect = propSelect.widgetSelect;
        widgetSelect.options.length = 0;
        widgetSelect.disabled = propSelect.disabled;
        if (!widgetSelect.disabled) {
            var propSelectOption = propSelect.options[propSelect.selectedIndex];
            var prop = propSelectOption.prop;
            var driver = propSelectOption.driver;
            for (var widget in WidgetsLayer) {
                if (WidgetsLayer[widget].widget == undefined) continue;
                if ((WidgetsLayer[widget].driversTypes.indexOf(";" + driver.type.value + ";") != -1) || (WidgetsLayer[widget].driversTypes == "any")) {
                    if ((WidgetsLayer[widget].driversProperties.indexOf(";" + prop.name + ";") != -1) || (WidgetsLayer[widget].driversProperties == "any")) {
                        var widgetSelectOption = widgetSelect.dialogSelect.appendOption(WidgetsLayer[widget].name);
                        widgetSelectOption.widgetLayer = WidgetsLayer[widget];
                    }
                }
            }
        }
        return false;
    },
    saveAddedWidget: function (event) {
        var buttonSave = event.currentTarget;
        config.cancel = false;
        var saveDialog = createModalDialog(getLang("saveaddedwidget"), "");
        saveDialog.appendChildToForm(createDialogLabel("savetext", "").label);
        saveDialog.appendChildToForm(createDialogProgressbar("saveProgressBar").progressbarDiv);
        saveDialog.OKButton.innerText = getLang("cancelbutton");
        saveDialog.onOK = dashboardUI.addWidgetCancel;
        saveDialog.show();
        config.save();
    },
    addWidgetCancel: function () {

        config.cancel = true;
        $("#showDialogPanelDialogModal").modal('hide');
    },
    onConfigChange: function (configProperties) {
        var saveButton = document.getElementById("saveWidgetsButton");
        saveButton.hidden = false;
    }
}











