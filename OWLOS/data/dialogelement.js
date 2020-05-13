
function createModalDialog(_titleText, _bodyText) {

        //makeModalDialog("resetPanel", "addnode", getLang("addnodeheader"), "");
        //var modalFooter = document.getElementById("addnodeModalFooter");
        //var modalBody = document.getElementById("addnodeModalBody");

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
            this.content.className = "modal-content";

            this.header = this.content.appendChild(document.createElement("div"));
            this.header.className = "modal-header";

            this.title = this.header.appendChild(document.createElement("h5"));

            this.title.className = "modal-title";
            this.title.id = this.id + "ModalLabel";
            this.title.innerText = this.titleText;

            this.body = this.content.appendChild(document.createElement("div"));
            this.body.id = this.id + "ModalBody"
            this.body.className = "modal-body";
            this.body.innerText = this.bodyText;

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

            this.closeButton = this.footer.appendChild(document.createElement("button"));
            this.closeButton.type = "button";
            this.closeButton.className = "btn btn-sm btn-info";
            this.closeButton.setAttribute("data-dismiss", "modal");
            this.closeButton.setAttribute("aria-label", "Close");
            this.closeButton.innerText = getLang("cancel");
            this.closeButton.id = this.id + "closeButton";

            this.OKButton = this.footer.appendChild(document.createElement("button"));
            this.OKButton.type = "button";
            this.OKButton.className = "btn btn-sm btn-success";
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

        OKButtonClick: function (event) {
            event.currentTarget.clicked = true;
        },

        appendChildToForm: function (element) {
            this.formGroup.appendChild(element);
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
        }, 

        show: function () {
            $("#" + this.id + "Modal").modal('show');
        }
    };

    modalDialog.create();
    return modalDialog;

}

