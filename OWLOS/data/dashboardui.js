/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

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

(Этот файл — часть Ready IoT Solution - OWLOS.

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

        var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");
        
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

        //driver select 
        var driverLabel = formGroup.appendChild(document.createElement("label"));
        driverLabel.setAttribute("for", "driverSelect");
        driverLabel.innerText = getLang("nodeslist");
        var driverSelect = formGroup.appendChild(document.createElement('select'));
        driverSelect.className = "form-control form-control-sm";
        driverSelect.id = "typeSelect";

        for (var node in configProperties.nodes) {

            for (var i = 0; i < configProperties.nodes[node].drivers.length; i++) {
                var valueSelectOption = driverSelect.appendChild(document.createElement('option'));
                valueSelectOption.innerText = getLang(configProperties.nodes[node].drivers[i]._nodenickname + "/" + configProperties.nodes[node].drivers[i]._id);
                valueSelectOption.driver = configProperties.nodes[node].drivers[i];
            }
        }

        driverSelect.onchange = dashboardUI.onDriverSelect;
        //driver property select 

        var driverPropLabel = formGroup.appendChild(document.createElement("label"));
        driverPropLabel.setAttribute("for", "driverPropSelect");
        driverPropLabel.innerText = getLang("driversporplist");
        var driverPropSelect = formGroup.appendChild(document.createElement('select'));
        driverPropSelect.className = "form-control form-control-sm";
        driverPropSelect.id = "typeSelect";

        driverPropSelect.onchange = dashboardUI.onDriverPropSelect;

        //widgets 
        //driver select 
        var widgetLabel = formGroup.appendChild(document.createElement("label"));
        widgetLabel.setAttribute("for", "widgetSelect");
        widgetLabel.innerText = getLang("widgetslist");
        var widgetSelect = formGroup.appendChild(document.createElement('select'));
        widgetSelect.className = "form-control form-control-sm";
        widgetSelect.id = "typeSelect";



        driverSelect.driverPropSelect = driverPropSelect;
        driverPropSelect.driverSelect = driverSelect;
        driverSelect.widgetSelect = widgetSelect;

        var event = { currentTarget: driverSelect };
        dashboardUI.onDriverSelect(event);


        //end of Body form ----------
        var widgetButton = modalFooter.appendChild(document.createElement("button"));
        widgetButton.type = "button";
        widgetButton.className = "btn btn-sm btn-success";
        widgetButton.id = "widgetModalButton";
        widgetButton.driverSelect = driverSelect;
        widgetButton.onclick = dashboardUI.addWidgetClick;
        widgetButton.innerText = getLang("dashboardaddwidgetbutton");

        $("#widgetModal").modal('show');


    },

    onDriverSelect: function (event) {
        var driverSelect = event.currentTarget;
        var driverPropSelect = driverSelect.driverPropSelect;
        var widgetSelect = driverSelect.widgetSelect;
        var valueSelectOption = driverSelect.options[driverSelect.selectedIndex];


        var driver = valueSelectOption.driver;

        driverPropSelect.options.length = 0;
        for (var driverProp in driver) {
            if ((driver[driverProp].name == undefined) || (driver[driverProp].type == undefined)) continue;
            var propSelectOption = driverPropSelect.appendChild(document.createElement('option'));
            propSelectOption.innerText = driver[driverProp].name;
            propSelectOption.driverProp = driver[driverProp];
        }

        var driverPropSelectOption = driverPropSelect.options[driverPropSelect.selectedIndex];
        var driverProp = driverPropSelectOption.driverProp;
        dashboardUI.refreshWidgetsSelect(widgetSelect, driver, driverProp);
    },

    onDriverPropSelect: function (event) {
        var driverPropSelect = event.currentTarget;
        var driverSelect = driverPropSelect.driverSelect;
        var widgetSelect = driverSelect.widgetSelect;

        var driverSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = driverSelectOption.driver;
        var driverPropSelectOption = driverPropSelect.options[driverPropSelect.selectedIndex];
        var driverProp = driverPropSelectOption.driverProp;
        dashboardUI.refreshWidgetsSelect(widgetSelect, driver, driverProp);
    },

    refreshWidgetsSelect: function (widgetSelect, driver, driverProp) {
        widgetSelect.options.length = 0;
        for (var widget in WidgetsLayer) {
            if (WidgetsLayer[widget].widget == undefined) continue;
            if ((WidgetsLayer[widget].driversTypes.indexOf(";" + driver.type.value + ";") != -1) || (WidgetsLayer[widget].driversTypes == "any")) {
                if ((WidgetsLayer[widget].driversProperties.indexOf(";" + driverProp.name + ";") != -1) || (WidgetsLayer[widget].driversProperties == "any")) {
                    var widgetSelectOption = widgetSelect.appendChild(document.createElement('option'));
                    widgetSelectOption.innerText = WidgetsLayer[widget].name;
                    widgetSelectOption.widgetLayer = WidgetsLayer[widget];
                }
            }
        }

    },

    addWidgetClick: function (event) {
        var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");
        var button = event.currentTarget;
        var driverSelect = button.driverSelect;
        var driverPropSelect = driverSelect.driverPropSelect;
        var widgetSelect = driverSelect.widgetSelect;

        var valueSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = valueSelectOption.driver;
        var driverProp = driverPropSelect.options[driverPropSelect.selectedIndex].driverProp;
        var widgetLayer = widgetSelect.options[widgetSelect.selectedIndex].widgetLayer;

        new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {

            var configPropertiesWidget = config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);

            widgetWrapper.widget.onchange = config.onWidgetChange;
            widgetWrapper.widget.ondelete = config.onWidgetDelete;


            $("#widgetModal").modal('hide');
        };

        /*
            var driversWidgetsPanel = document.getElementById("widgetsPanelDataDiv");
            var driver = drivers.getDriverById("temperature");    
            new TemperatureWidgetWrapper(driversWidgetsPanel, driver, driver.temperature);
            new TemperatureWidgetWrapper(driversWidgetsPanel, driver, driver.temperature, 1);
        
            var driver = drivers.getDriverById("humidiry");
            new HumidityDriver(driversWidgetsPanel, driver, driver.humidity);
            new HumidityDriver(driversWidgetsPanel, driver, driver.humidity, 1);
    
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











