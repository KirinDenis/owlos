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

function createModalDialog(_titleText, _bodyText) {
    var modalDialog = {
        id: undefined,
        titleText: _titleText,
        bodyText: _bodyText,

        fade: undefined,
        content: undefined,
        dialog: undefined,

        header: undefined,
        body: undefined,
        formGroup: undefined,
        footer: undefined,

        closeHeaderButton: undefined,
        useCloseButton: false,
        closeButton: undefined,
        OKButton: undefined,
        errorLabel: undefined,

        onOK: undefined,

        create: function () {
            document.getElementById("addDriverPanel").innerHTML = ""; //TODO: remake this modal to

            var parentPanel = document.getElementById("showDialogPanel");
            if ((parentPanel == null) || (parentPanel == undefined)) {
                addToLog("no parent for modal dialog");
                return;
            }
            $("#showDialogPanel").empty();

            this.id = "showDialogPanelDialog";
            $("#showDialogPanelDialog").remove();

            this.fade = parentPanel.appendChild(document.createElement("div"));
            this.fade.className = "modal fade";
            this.fade.id = this.id + "Modal";
            this.fade.tabindex = "-1";
            this.fade.setAttribute("role", "dialog");
            this.fade.setAttribute("aria-labelledby", this.id + "ModalLabel");
            this.fade.setAttribute("aria-hidden", "true");
            this.fade.ModalDialog = this;

            this.dialog = this.fade.appendChild(document.createElement("div"));
            this.dialog.className = "modal-dialog";
            this.dialog.role = "document";

            this.content = this.dialog.appendChild(document.createElement("div"));
            this.content.className = "modal-content bg-dark border-info";

            this.header = this.content.appendChild(document.createElement("div"));
            this.header.className = "modal-header";

            this.title = this.header.appendChild(document.createElement("h5"));

            this.title.className = "modal-title";
            this.title.id = this.id + "ModalLabel";
            this.title.innerHTML = this.titleText;

            this.body = this.content.appendChild(document.createElement("div"));
            this.body.id = this.id + "ModalBody"
            this.body.className = "modal-body";
            this.body.innerHTML = this.bodyText;

            this.formGroup = this.body.appendChild(document.createElement("div"));
            this.formGroup.className = "form-group";

            this.footer = this.content.appendChild(document.createElement("div"));
            this.footer.id = this.id + "ModalFooter";
            this.footer.className = "modal-footer";

            var closeHeaderButton = this.header.appendChild(document.createElement("button"));
            closeHeaderButton.type = "button"
            closeHeaderButton.className = "close"
            closeHeaderButton.id = this.id + "closeHeaderButton";
            closeHeaderButton.setAttribute("data-dismiss", "modal");
            closeHeaderButton.setAttribute("aria-label", "Close");

            var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
            closeSpan.setAttribute("aria-hidden", "true");
            closeSpan.innerText = "x"

            if (this.useCloseButton) {
                this.closeButton = this.footer.appendChild(document.createElement("button"));
                this.closeButton.type = "button";
                this.closeButton.className = "btn btn-sm btn-success";
                this.closeButton.setAttribute("data-dismiss", "modal");
                this.closeButton.setAttribute("aria-label", "Close");
                this.closeButton.innerText = getLang("cancel");
                this.closeButton.id = this.id + "closeButton";
            }

            this.OKButton = this.footer.appendChild(document.createElement("button"));
            this.OKButton.type = "button";
            this.OKButton.className = "btn btn-sm btn-info";
            this.OKButton.setAttribute("data-dismiss", "modal");
            this.OKButton.setAttribute("aria-label", "Close");
            this.OKButton.id = this.id + "OKButton";
            this.OKButton.innerText = getLang("OK");
            this.OKButton.onclick = this.OKButtonClick;

            this.errorLabel = this.body.appendChild(document.createElement("label"));
            this.errorLabel.className = "text-danger";

            $('#' + this.id + "Modal").on('hide.bs.modal', function (event) {
                var modalDialog = event.currentTarget.ModalDialog;
                if (modalDialog != undefined) {
                    if (modalDialog.OKButton.clicked != undefined) {
                        if (modalDialog.onOK != undefined) {
                            modalDialog.OKButton.clicked = undefined;
                            if (!modalDialog.onOK(modalDialog)) {
                                event.preventDefault();
                                event.stopImmediatePropagation();
                                return false;
                            }
                        }
                    }
                }
                //TODO: Clear innerHTML

                return true;

            });
        },

        show: function () {
            $("#" + this.id + "Modal").modal('show');
        },

        hide: function () {
            this.OKButton.clicked = undefined;
            $("#" + this.id + "Modal").modal('hide');
        },

        OKButtonClick: function (event) {
            event.currentTarget.clicked = true;
        },

        appendChildToForm: function (element) {
            return this.formGroup.appendChild(element);
        },

        getChild: function (childId) {
            for (var child in this.formGroup.childNodes) {
                if (childId === this.formGroup.childNodes[child].id) {
                    return this.formGroup.childNodes[child];
                }
            }
        },

        getChildCount: function () {
            return this.formGroup.childNodes.length;
        },

        getChildId: function (index) {
            return this.formGroup.childNodes[index].id;
        },

        deleteChild: function (childId) {
            for (var child in this.formGroup.childNodes) {
                if (childId === this.formGroup.childNodes[child].id) {
                    var element = this.formGroup.childNodes[child];
                    this.formGroup.removeChild(element);
                    element.innerHTML = "";
                    return;
                }
            }
        },


        appendChildToFooter: function (element) {
            this.footer.appendChild(element);
        },

        appendInput: function (dialogInput) {
            this.appendChildToForm(dialogInput.label);
            this.appendChildToForm(dialogInput.input);
        },

        appendSelect: function (dialogSelect) {
            this.appendChildToForm(dialogSelect.label);
            this.appendChildToForm(dialogSelect.select);
        }

    };

    modalDialog.create();
    return modalDialog;

}

