
function createDialogInput(_id, _labelText, _editPlaceholder) {

    var dialogInput = {
        id: _id,
        labelText: _labelText,
        editPlaceholder: _editPlaceholder,

        label: undefined,
        input: undefined,

        create: function () {
            this.label = document.createElement("label");
            this.label.setAttribute("for", this.id + "input");
            this.label.innerText = this.labelText;            
            this.input = document.createElement('input');
            this.input.className = "form-control form-control-sm";
            this.input.placeholder = this.editPlaceholder;
            this.input.id = this.id + "input";
        },
    };

    dialogInput.create();
    return dialogInput;
}

