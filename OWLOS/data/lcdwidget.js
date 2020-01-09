class LCDWidget extends BaseWidget {
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.topMargin = this.size / 20;
        //this.panding = 5;
        this.width = this.size * 2 ;
        this.height = this.size - this.panding;

        this.centreX = this.width / 2;
      //  this.centreY = this.height / 2;

        this.widgetTextSize = this.size / 110;

        this.svgElement.setAttributeNS(null, "viewBox", this.halfPanding + " " + this.halfPanding + " " + this.width + " " + this.height);        
        this.svgElement.setAttributeNS(null, "width", this.width);
        this.SVGBackpanel.width = this.width;
        this.SVGBackpanel.height = this.height;
        this.SVGBackdownpanel.width = this.width;
        

        this.SVGWidgetText1 = new SVGText(this.svgElement, this.id + "widgettext1", this.widgetTextSize);
        this.SVGWidgetText1.fontFamily = "monospace";
        this.SVGWidgetText2 = new SVGText(this.svgElement, this.id + "widgettext2", this.widgetTextSize);
        this.SVGWidgetText2.fontFamily = "monospace";
        this.SVGWidgetText3 = new SVGText(this.svgElement, this.id + "widgettext3", this.widgetTextSize);
        this.SVGWidgetText3.fontFamily = "monospace";
        this.SVGWidgetText4 = new SVGText(this.svgElement, this.id + "widgettext4", this.widgetTextSize);
        this.SVGWidgetText4.fontFamily = "monospace";

        this.SVGWidgetText1.text = "1234567890ABCSDEFGHL"; //20 chars 
        this.SVGLabel.text = "LCD";

        this.textWidth = this.SVGWidgetText1.width;
        this.textHeight = this.SVGWidgetText1.height;

        this.widgetLeft = this.centreX - this.textWidth / 2;
        this.widgetTop = (this.centreY + this.SVGLabel.height) - (this.textHeight * 4) / 2;

        this.SVGWidgetBack = new SVGRect(this.svgElement, this.id + "widgetback",
            this.widgetLeft - this.panding,
            this.widgetTop - parseFloat(this.textHeight - this.panding),
            this.textWidth + this.panding * 2,
            this.textHeight * 4 + this.panding);

        this.SVGWidgetBack.opacity = 0.2;
        this.SVGWidgetBack.color = theme.secondary;

        this.SVGWidgetText1.text = "";
        this.SVGLabel.text = "";
        
        this.SVGWidgetText.hide();
        this.SVGArcSpinner.x = this.centreX;

        this.rPanel.onclick = this.showEditor;

        //Popup editor 
        this.pre = this.rPanel.appendChild(document.createElement('pre'));
        this.pre.className = "LCDTextArea";
        this.pre.style.display = 'none';

        this.textarea = this.pre.appendChild(document.createElement('textarea'));
        this.textarea.className = "form-control text-white bg-primary";
        this.textarea.id = "textarea" + this.id;
        this.textarea.rows = "4";
        this.textarea.cols = "25";

        var elementHeight = this.pre.getBoundingClientRect().height;
        this.pre.style.marginTop = - (elementHeight / 2.0 + this.size / 1.8) + "px";


        this.btnGroup = this.rPanel.appendChild(document.createElement("p"));
        this.btnGroup.style.display = 'none';
        this.btnGroup.className = "LCDButtons";
        this.btnGroup.role = "group";

        this.textElement = this.btnGroup.appendChild(document.createElement('div'));
        this.textElement.className = "text-white";

        this.lcdButton = this.btnGroup.appendChild(document.createElement('input'));
        this.lcdButton.className = "btn btn-success text-white LCDButton";
        this.lcdButton.id = this.id + "lcdbutton";
        this.lcdButton.type = "button";
        this.lcdButton.edit = this.textarea;
        this.lcdButton.lcdid = this.id;
        this.lcdButton.widget = this;
        // this.lcdButton.onclick = lcdButtonClick;
        this.lcdButton.value = getLang("send");

        this.lightButton = this.btnGroup.appendChild(document.createElement('input'));
        this.lightButton.className = "btn btn-info text-white LCDButton";
        this.lightButton.id = this.id + "clearbutton";
        this.lightButton.type = "button";
        this.lightButton.edit = this.textarea;
        this.lightButton.lcdid = this.id;
        this.lightButton.widget = this;
        //  this.lightButton.onclick = lightButtonClick;
        this.lightButton.value = getLang("shortlight");

        this.ShowEqualizer = false;

    }

    refresh(widgetText, label, light) {        
        label = getLang(label);
        this.widgetText = widgetText;
        this.label = label;
        this.spinnerAngle = 0;

        if (light != undefined) {
            this.light = light;
        }
        else {
            this.light = 0;
        }

        this.redrawAll();
    }

    showEditor(event) {
        event.stopPropagation();
        var rPanel = event.currentTarget;
        var lcdWidget = rPanel.widget;

        if (!lcdWidget.pre.style.display.includes("block")) {
            lcdWidget.textarea.value = lcdWidget.widgetText;
            lcdWidget.pre.style.display = 'block';
            lcdWidget.btnGroup.style.display = 'block';
        }
        else {
          //TODO: direct click     
          //  lcdWidget.hideEditor(); 
        }
        return true;
    }

    hideEditor() {
        this.pre.style.display = 'none';
        this.btnGroup.style.display = 'none';
    }

/*
    get _newtorkStatus() {
        return this.networkStatus;
    }

    set _networkStatus(networkStatus) {
        if ((networkStatus >= NET_OFFLINE) && (networkStatus <= NET_RECONNECT)) {
            this.networkStatus = networkStatus;
            this.redrawAll();
        }
    }

    get _percent() {
        return this.percent;
    }

    set _percent(percent) {
        if ((percent >= 0) && (percent <= 100)) {
            this.percent = percent;
            this.redrawAll();
        }
    }

    //---------------------------------------------------------------------------------------
    redrawAll() {
        this.drawText();
        this.starttime = 0;
        requestAnimationFrame(() => this.drawWidget());


    }
    */
    //---------------------------------------------------------------------------------------
    //draw element text labels - percent value and text 
    drawText() {
        super.drawText();

        switch (this._networkStatus) {
            case NET_ONLINE:
                this.SVGWidgetText1.color = theme.light;
                this.SVGWidgetText2.color = theme.light;
                this.SVGWidgetText3.color = theme.light;
                this.SVGWidgetText4.color = theme.light;
                break;
            case NET_RECONNECT:
                this.SVGWidgetText1.color = theme.info;
                this.SVGWidgetText2.color = theme.info;
                this.SVGWidgetText3.color = theme.info;
                this.SVGWidgetText4.color = theme.info;
                break;
            default: //offline
                this.SVGWidgetText1.color = theme.secondary;
                this.SVGWidgetText2.color = theme.secondary;
                this.SVGWidgetText3.color = theme.secondary;
                this.SVGWidgetText4.color = theme.secondary;
                break;
        }

        if (this.widgetText == undefined) {
            this.widgetText = "";            
        }

            this.SVGWidgetText1.text = this.widgetText.substring(0, 20);
            this.SVGWidgetText2.text = this.widgetText.substring(20, 40);
            this.SVGWidgetText3.text = this.widgetText.substring(40, 60);
            this.SVGWidgetText4.text = this.widgetText.substring(60);

            this.SVGWidgetText1.x = this.widgetLeft;
            this.SVGWidgetText1.y = this.widgetTop;

            this.SVGWidgetText2.x = this.widgetLeft;
            this.SVGWidgetText2.y = this.SVGWidgetText1.y + this.SVGWidgetText1.height;

            this.SVGWidgetText3.x = this.widgetLeft;
            this.SVGWidgetText3.y = this.SVGWidgetText2.y + this.SVGWidgetText2.height;

            this.SVGWidgetText4.x = this.widgetLeft;
            this.SVGWidgetText4.y = this.SVGWidgetText3.y + this.SVGWidgetText4.height;
        

        /*
        this.SVGLabel.text = this.label;
        this.SVGLabel.x = this.width / 2 - this.SVGLabel.width / 2;
        this.SVGLabel.y = this.SVGLabel.height - this.panding;

        switch (this.networkStatus) {
            case NET_ONLINE: this.SVGLabel.color = theme.light; break;
            case NET_ERROR: this.SVGLabel.color = theme.danger; break;
            case NET_RECONNECT: this.SVGLabel.color = theme.info; break;
            default: //offline
                this.SVGLabel.color = theme.secondary; break;
        }



        this.SVGWidgetText1.color = theme.light;
        this.SVGWidgetText2.color = theme.light;
        this.SVGWidgetText3.color = theme.light;
        this.SVGWidgetText4.color = theme.light;

        this.SVGWidgetText1.text = this.widgetText.substring(0, 20);
        this.SVGWidgetText2.text = this.widgetText.substring(20, 40);
        this.SVGWidgetText3.text = this.widgetText.substring(40, 60);
        this.SVGWidgetText4.text = this.widgetText.substring(60);

        this.SVGWidgetText1.x = this.widgetLeft;
        this.SVGWidgetText1.y = this.widgetTop;

        this.SVGWidgetText2.x = this.widgetLeft;
        this.SVGWidgetText2.y = this.SVGWidgetText1.y + this.SVGWidgetText1.height;

        this.SVGWidgetText3.x = this.widgetLeft;
        this.SVGWidgetText3.y = this.SVGWidgetText2.y + this.SVGWidgetText2.height;

        this.SVGWidgetText4.x = this.widgetLeft;
        this.SVGWidgetText4.y = this.SVGWidgetText3.y + this.SVGWidgetText4.height;

         */ 
        /*        
        //var newValue = getParsedDeviceProperty(this.id, "text");
        if (this.percent !== this.textarea.storedValue) {
            this.textarea.value = this.percent;
            this.textarea.storedValue = this.percent;
        }

        this.textElement.innerHTML = this.text;
        
        switch (this.networkStatus) {
            case NET_ONLINE:

                this.textElement.className = "text-white text-center";
                this.hintElement.innerHTML = getLang("rid_online");
                this.hintElement.className = "LCDWidgetHint text-secondary text-center";
                break;
            case NET_ERROR:
                this.textElement.className = "text-danger text-center";
                this.hintElement.innerHTML = getLang("rid_error");
                this.hintElement.className = "LCDWidgetHint text-danger text-center";
                break;
            case NET_RECONNECT:
                this.textElement.className = "text-info text-center";
                this.hintElement.innerHTML = getLang("rid_connect");
                this.hintElement.className = "LCDWidgetHint text-info text-center";
                break;
            default: //offline
                this.textElement.className = "text-secondary text-center";
                this.hintElement.innerHTML = getLang("rid_offline");
                this.hintElement.className = "LCDWidgetHint text-secondary text-center";
                break;
        }
        */
    }

  
    drawWidget() {

        
        if (this.light == 1) {
            this.SVGWidgetBack.color = theme.info;
        }
        else {
            this.SVGWidgetBack.color = theme.secondary;
        }

        super.drawWidget();

/*
        if (this.light == 1) {
            this.SVGWidgetBack.color = theme.info;
        }
        else {
            this.SVGWidgetBack.color = theme.secondary;
        }

        //spinner 
        if (this.networkStatus == NET_RECONNECT) {
            this.spinnerAngle += 1.5;
            this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
            requestAnimationFrame(() => this.drawWidget());
        }
        else {
            this.SVGArcSpinner.hide();
        }
        
        */
    }
    
}

