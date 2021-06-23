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

var headerPanelUI = {
    //роли кнопок headerPanel 
    sideBarButtonRole: 0b00000001,
    widgetsPanelButtonRole: 0b00000010,
    thingPoropertiesPanelButtonRole: 0b00000100,
    driverButtonRole: 0b00001000,
    scriptButtonRole: 0b00010000,
    filesButtonRole: 0b00100000,
    consoleButtonRole: 0b01000000,
    buttons: [],
    statusPanels: [],
    addButton: function (id, faIcon, title, buttonRole) {
        var headerPanel = document.getElementById("header-panel-form");
        if (headerPanel == undefined) {
            return undefined;
        }
        var button = document.createElement("button");
        button.className = "btn btn-sm btn-secondary header-button";
        button.id = id;
        button.setAttribute("data-toggle", "tooltip");
        button.setAttribute("data-placement", "right");
        button.buttonRole = buttonRole;
        if (buttonRole != this.sideBarButtonRole) {
            button.style.display = "none";
        }

        button.title = title;
        var span = document.createElement("span");
        span.className = faIcon;
        button.appendChild(span);
        headerPanel.appendChild(button);
        this.buttons.push(button);
        return button;
    },

    addStatusPanel: function (thing) {
        var headerPanelStatuses = document.getElementById("header-panel-statuses");
        if (headerPanelStatuses == undefined) {
            return undefined;
        }

        var statusPanel = document.createElement("div");
        statusPanel.thing = thing;
        statusPanel.statuses = [];
        statusPanel.style.display = "none";
        headerPanelStatuses.appendChild(statusPanel);

        var thingHref = document.createElement("a");
        thingHref.href = thing.host;
        thingHref.target = "_blank";
        thingHref.innerText = thing.thingnickname;
        statusPanel.appendChild(thingHref);

        var sepparator = document.createElement("text");
        sepparator.className = "text-secondary";
        sepparator.innerHTML = "<strong>|</strong>";
        statusPanel.appendChild(sepparator);
        this.statusPanels.push(statusPanel);
        return statusPanel;
    },

    hideAllButtons: function () {
        for (var buttonIndex in this.buttons) {
            if (this.buttons[buttonIndex].buttonRole != this.sideBarButtonRole) {
                this.buttons[buttonIndex].style.display = "none";
            }
        }
    },


    getStatusesPanel: function (thing) {
        for (var statusPanelIndex in this.statusPanels) {
            if (this.statusPanels[statusPanelIndex].thing === thing) {
                return this.statusPanels[statusPanelIndex];
            }
        }
        return undefined;
    },

    showStatusPanel: function (thing) {
        var statusPanel = this.getStatusesPanel(thing);
        if (statusPanel != undefined) {
            statusPanel.style.display = "block";
        }
    },

    hideStatusPanel: function (thing) {
        var statusPanel = this.getStatusesPanel(thing);
        if (statusPanel != undefined) {
            statusPanel.style.display = "none";
        }
    },

    hideAllStatusesPanels: function () {
        for (var statusPanelIndex in this.statusPanels) {
            this.statusPanels[statusPanelIndex].style.display = "none";
        }
    },

    addStatus: function (thing, id, text) {
        var statusPanel = this.getStatusesPanel(thing);
        if (statusPanel == undefined) {
            statusPanel = this.addStatusPanel(thing);
        }

        var status = document.createElement("text");
        status.id = thing.nickname + id;
        status.className = "text-secondary";
        status.innerHTML = text;
        statusPanel.appendChild(status);
        statusPanel.statuses.push(status);

        var sepparator = document.createElement("text");
        sepparator.className = "text-secondary";
        sepparator.innerHTML = "<strong>|</strong>";
        statusPanel.appendChild(sepparator);

        return status;
    },

    getButton: function (id) {
        for (var buttonIndex in this.buttons) {
            if (buttons[buttonIndex].id === id) {
                return buttons[buttonIndex];
            }
        }
        return undefined;
    },

    getStatus: function (thing, id) {
        return document.getElementById(thing.nickname + id)
    },

    setStatusSuccess: function (thing, id) {
        var status = this.getStatus(thing, id);
        if (status != undefined) {
            status.className = "text-success";
        }
    },

    setStatusUnknown: function (thing, id) {
        var status = this.getStatus(id);
        if (status != undefined) {
            status.className = "text-secondary";
        }
    },

    setStatusError: function (thing, id) {
        var status = this.getStatus(id);
        if (status != undefined) {
            status.className = "text-danger";
        }
    }
}