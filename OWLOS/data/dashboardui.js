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

//Dashboard UI
var dashboardUI = {

    dashboardModeListners: [],
    dashboardViewMode: true,
    mainProperties: ",data,historydata,historyfile,temperature,humidity,temperaturehistoryfile,temperaturehistorydata,humidityhistoryfile,humidityhistorydata,text",
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

        /*
        headerPanelUI.addButton("dashboardButtonsPanel", "fa fa-pan", "toogle widgets mode");

        var saveButtonPanel = document.getElementById("saveButtonPanel");

        var saveWidgetsButton = saveButtonPanel.appendChild(document.createElement('input'));
        saveWidgetsButton.className = "btn btn-warning btn-sm";
        saveWidgetsButton.type = "button";
        saveWidgetsButton.value = getLang("saveaddedwidget");
        saveWidgetsButton.hidden = true;
        saveWidgetsButton.id = "saveWidgetsButton";
        saveWidgetsButton.onclick = dashboardUI.saveAddedWidget;
        config.onChange = dashboardUI.onConfigChange;
        */
       var saveWidgetsButton = headerPanelUI.addButton("saveaddedwidget", "fa fa-save", "save configuration");
       saveWidgetsButton.onclick = dashboardUI.saveAddedWidget;


       /*
        var dashboardButtonsPanel = document.getElementById("dashboardButtonsPanel");
        var headerModeButton = dashboardButtonsPanel.appendChild(document.createElement('input'));
        headerModeButton.className = "btn btn-sm";
        headerModeButton.type = "button";
        headerModeButton.value = getLang("dashboardedit");
        headerModeButton.onclick = dashboardUI.changeDashboadMode;
        */
        var headerModeButton = headerPanelUI.addButton("dashboardaddwidget", "fa fa-edit", "toogle widgets mode");
        headerModeButton.onclick = dashboardUI.changeDashboadMode;

        var addWidgetButton = headerPanelUI.addButton("dashboardaddwidget", "fa fa-plus", "add widget");
        addWidgetButton.onclick = dashboardUI.onAddWidgetClick;

        /*
        var addWidgetButton = dashboardButtonsPanel.appendChild(document.createElement('input'));
        addWidgetButton.className = "btn btn-sm";
        addWidgetButton.type = "button";
        addWidgetButton.value = getLang("dashboardaddwidget");
        addWidgetButton.onclick = dashboardUI.onAddWidgetClick;
        */

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

    //Widgets panel -----------------------------------------------------------------------------------------------
    onAddWidgetClick: function () {

        var addWidgetDialog = createModalDialog(getLang("dashboardaddwidget"), "");
        addWidgetDialog.appendSelect(createDialogSelect("nodeselect", "<strong>" + getLang("nodeselect") + "</strong>"));

        var nodeSelect = addWidgetDialog.getChild("nodeselect");
        nodeSelect.onchange = dashboardUI.onNodeSelectChange;
        nodeSelect.addWidgetDialog = addWidgetDialog;

        for (var node in configProperties.nodes) {
            var nodeSelectOption = nodeSelect.dialogSelect.appendOption(configProperties.nodes[node].nodenickname);
            nodeSelectOption.node = configProperties.nodes[node];
        }

        addWidgetDialog.appendSelect(createDialogSelect("driverselect", getLang("driverselect")));
        var driverSelect = addWidgetDialog.getChild("driverselect");
        nodeSelect.driverSelect = driverSelect;
        driverSelect.onchange = dashboardUI.onDriverSelectChange;

        addWidgetDialog.appendSelect(createDialogSelect("propselect", getLang("propselect")));
        var propSelect = addWidgetDialog.getChild("propselect");
        driverSelect.propSelect = propSelect;
        propSelect.onchange = dashboardUI.onPropSelectChange;

        addWidgetDialog.appendSelect(createDialogSelect("widgetselect", getLang("widgetselect")));
        var widgetSelect = addWidgetDialog.getChild("widgetselect");
        propSelect.widgetSelect = widgetSelect;
        
        dashboardUI.onNodeSelectChange(event = { currentTarget: nodeSelect });

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
        return true;
    },

    onNodeSelectChange: function (event) {
        var nodeSelect = event.currentTarget;
        var nodeSelectOption = nodeSelect.options[nodeSelect.selectedIndex];
        var node = nodeSelectOption.node;
        var driverSelect = nodeSelect.driverSelect;

        driverSelect.options.length = 0;
        for (var i = 0; i < node.drivers.length; i++) {
            if (dashboardUI.secondaryDrivers.indexOf("," + node.drivers[i]._id) == -1) {
                var driverSelectOption = driverSelect.dialogSelect.appendOption(node.drivers[i]._id, 0);
                driverSelectOption.className = "bold-option";
            }
            else {
                var driverSelectOption = driverSelect.dialogSelect.appendOption(node.drivers[i]._id, 0);
            }
            driverSelectOption.driver = node.drivers[i];
        }
        if (node.drivers.length == 0) {
            driverSelect.disabled = true;
            nodeSelect.addWidgetDialog.errorLabel.innerHTML = getLang("nodeoffline");
        }
        else {
            driverSelect.disabled = false;
            driverSelect.selectedIndex = 0;
            nodeSelect.addWidgetDialog.errorLabel.innerHTML = "";
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
                if (dashboardUI.mainProperties.indexOf("," + driver[driverProp].name) != -1) {
                    var propSelectOption = propSelect.dialogSelect.appendOption(driver[driverProp].name, 0);
                    propSelectOption.className = "bold-option";
                }
                else {
                    var propSelectOption = propSelect.dialogSelect.appendOption(driver[driverProp].name);
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

    //OLD Save Widgets ---------------------------------------------------------------------------------

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

        // buttonSave.hidden = true;
        
        /*
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
        */

        
    },

    addWidgetCancel: function () {

        config.cancel = true;
        $("#showDialogPanelDialogModal").modal('hide');
        /*
        var buttonCancel = event.currentTarget;
        var saveButtonAtPanel = document.getElementById("saveWidgetsButton");

        if (saveButtonAtPanel !== null && saveButtonAtPanel !== undefined) {
            saveButtonAtPanel.hidden = true;
        }
        */

       
    },

    onConfigChange: function (configProperties) {
        var saveButton = document.getElementById("saveWidgetsButton");
        saveButton.hidden = false;
    }

}











