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

var driversUI = {
    thing: undefined,
    createDialog: undefined,

    addDriver(thing) {
        driversUI.thing = thing;

        driversUI.createDialog = createModalDialog(getLang("createdriverdialog"), "");
        driversUI.createDialog.appendSelect(createDialogSelect("drivertype", getLang("drivertype")));

        var driverSelect = driversUI.createDialog.getChild("drivertype");
        driverSelect.onchange = driversUI.onDriverSelectChange;

        for (var i = 0; i < driversUI.thing.accessableDrivers.length; i++) {
            var driverSelectOption = driverSelect.dialogSelect.appendOption(driversUI.thing.accessableDrivers[i].name);
            driverSelectOption.driver = driversUI.thing.accessableDrivers[i];
        }

        var event = { currentTarget: driverSelect }
        driversUI.onDriverSelectChange(event);

        driversUI.createDialog.onOK = driversUI.doAddDriverClick;
        driversUI.createDialog.show();
        return false;
    },

    onDriverSelectChange: function (event) {
        var driverSelect = event.currentTarget;
        if (driverSelect.selectedIndex == -1) {
            return true;
        }
        var driverSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = driverSelectOption.driver;

        var driverDialogChildId = [];
        for (var i = 0; i < driversUI.createDialog.getChildCount(); i++) {
            if ((driversUI.createDialog.getChildId(i) !== driverSelect.id)
                &&
                (driversUI.createDialog.getChildId(i) !== driverSelect.id + "label")) {
                driverDialogChildId.push(driversUI.createDialog.getChildId(i));
            }
        }

        for (var i = 0; i < driverDialogChildId.length; i++) {
            driversUI.createDialog.deleteChild(driverDialogChildId[i]);
        }

        driversUI.createDialog.appendInput(createDialogInput("driverid", getLang("driverid"), driver.name));
        driversUI.createDialog.getChild("driverid").value = driver.name;

        //Pin selects
        for (var i = 0; i < driver.pinscount; i++) {


            if ((driver["pintype" + i] & I2CADDR_MASK) == 0) { //not I2C ADDR
                driversUI.createDialog.appendSelect(createDialogSelect("pinselect" + i, "pin " + String(i + 1) + driver["pintypedecoded" + i]));
                var pinSelect = driversUI.createDialog.getChild("pinselect" + i);

                var pins = getFreePins(driversUI.thing, driver["pintype" + i]);
                if (pins.length > 0) {
                    pinSelect.dialogSelect.appendOption(getLang("PleaseSelectPin"));
                    for (var j = 0; j < pins.length; j++) {
                        var pinSelectOption = pinSelect.dialogSelect.appendOption(pins[j].name);
                        pinSelectOption.pin = pins[j];
                        pinSelectOption.driverPinNumber = i;
                    }
                }
                else {
                    pinSelect.enable = false;
                    pinSelect.dialogSelect.appendOption(getLang("NoFreePinsOfThisType"));
                }
            }
            else { //I2C Addr 
                driversUI.createDialog.appendInput(createDialogInput("driverport" + i, "I2C Address at 'ADDR0xNN' format", getLang("driveridplaceholder")));
                driversUI.createDialog.getChild("driverport" + i).value = "ADDR0x..";
            }
        }
    },

    doAddDriverClick: function (masterThingDialog) {
        var driverSelect = document.getElementById("drivertype");
        var driverSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = driverSelectOption.driver;
        var pinsString = "";
        for (var i = 0; i < driver.pinscount; i++) {
            var pinSelect = document.getElementById("pinselect" + i);
            if (pinSelect != undefined) {
                pinsString += pinSelect.options[pinSelect.selectedIndex].innerText + ",";
            }
            else {
                var I2CAdddrEdit = document.getElementById("driverport" + i);
                if (I2CAdddrEdit != undefined) {
                    pinsString += I2CAdddrEdit.value + ",";
                }
            }
        }
        //Example:
        //http://192.168.1.9:8084/adddriver?type=7&id=lcd1&pins=D21,D22,ADDR0x3F,VCC5,GND
        pinsString = "type=" + driver.type + "&id=" + document.getElementById("driverid").value + "&pins=" + pinsString;
        //TODO: decode Type from name 
        var httpResult = addDriver(driversUI.thing.host, pinsString);

        if (httpResult == 1) {

            var autoAddWidgetCheckBox = document.getElementById("autoAddWidget");
            if (autoAddWidgetCheckBox !== null) {

                if (autoAddWidgetCheckBox.checked == true) {

                    var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");
                    var defaultWidgets = [];
                    var widgetLayer = "";
                    var widgetWrapper = "";
                }
            }
            return true;
        }
        masterThingDialog.errorLabel.innerText = httpResult;
        return false;
    },
}
