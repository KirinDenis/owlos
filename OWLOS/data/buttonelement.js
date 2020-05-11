
function createButton(_id, _class, _text) {

    var button = {
        id: _id,
        class: _class,
        text: _text,

        button: undefined,
        
        create: function () {
            this.button = document.createElement("button");
            this.button.type = "button";
            this.button.className = "btn btn-sm " + this.class;
            this.button.id = this.id;
            this.button.innerText = this.text;
        }
    };

    button.create();
    return button;
}

