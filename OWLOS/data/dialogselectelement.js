
function createDialogSelect(_id, _labelText) {

    var dialogSelect = {
        id: _id,
        labelText: _labelText,
        
        label: undefined,
        select: undefined,

        create: function () {
            this.label = document.createElement("label");
            this.label.setAttribute("for", this.id);
            this.label.innerText = this.labelText;   
            this.label.id = this.id + "label";
            this.select = document.createElement('select');
            this.select.className = "form-control form-control-sm";
            this.select.dialogSelect = this;
            this.select.id = this.id;
        },

        appendOption: function (_text) {
            var selectOption = this.select.appendChild(document.createElement('option'));
            selectOption.innerText = _text;
            return selectOption;
        }
    };

    dialogSelect.create();
    return dialogSelect;
}

