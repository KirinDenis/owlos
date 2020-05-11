
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
        
        create: function () {
            document.getElementById("addDriverPanel").innerHTML = ""; //TODO: remake this modal to

            var parentPanel = document.getElementById("showDialogPanel");
            if ((parentPanel == null) || (parentPanel == undefined)) {
                addToLog("no parent for modal dialog");
                return;
            }
            $("#showDialogPanel").empty();

            id = "showDialogPanelDialog";
            $("#showDialogPanelDialog").remove();
            
            this.fade = parentPanel.appendChild(document.createElement("div"));
            this.fade.className = "modal fade";
            this.fade.id = id + "Modal";
            this.fade.tabindex = "-1";
            this.fade.setAttribute("role", "dialog");
            this.fade.setAttribute("aria-labelledby", id + "ModalLabel");
            this.fade.setAttribute("aria-hidden", "true");

            this.dialog = this.fade.appendChild(document.createElement("div"));
            this.dialog.className = "modal-dialog";
            this.dialog.role = "document";

            this.content = this.dialog.appendChild(document.createElement("div"));
            this.content.className = "modal-content";

            this.header = this.content.appendChild(document.createElement("div"));
            this.header.className = "modal-header";

            this.title = this.header.appendChild(document.createElement("h5"));

            this.title.className = "modal-title";
            this.title.id = id + "ModalLabel";
            this.title.innerText = this.titleText;

            this.body = this.content.appendChild(document.createElement("div"));
            this.body.id = id + "ModalBody"
            this.body.className = "modal-body";
            this.body.innerText = this.bodyText;

            this.formGroup = this.body.appendChild(document.createElement("div"));
            this.formGroup.className = "form-group";

            this.footer = this.content.appendChild(document.createElement("div"));
            this.footer.id = id + "ModalFooter";
            this.footer.className = "modal-footer";

            var closeHeaderButton = this.header.appendChild(document.createElement("button"));
            closeHeaderButton.type = "button"
            closeHeaderButton.className = "close"
            closeHeaderButton.id = id + "closeHeaderButton";
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
            this.closeButton.id = id + "closeButton";
        },

        appendChildToForm: function(element) {
            this.formGroup.appendChild(element);
        }, 

        appendChildToFooter: function (element) {
            this.footer.appendChild(element);
        }, 

        appendDialogInputToForm: function (dialogInput) {
            this.appendChildToForm(dialogInput.label);
            this.appendChildToForm(dialogInput.input);
        }, 


        show: function () {
            $("#" + id + "Modal").modal('show');
        }
    };

    modalDialog.create();
    return modalDialog;

}

