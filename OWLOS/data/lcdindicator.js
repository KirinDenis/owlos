class LCDIndicator extends BaseIndicator {
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.topMargin = this.size / 20;
        //this.panding = 5;
        this.width = this.size * 2 ;
        this.height = this.size - this.panding;

        this.centreX = this.width / 2;
      //  this.centreY = this.height / 2;

        this.indicatorTextSize = this.size / 110;

        this.svgElement.setAttributeNS(null, "viewBox", this.halfPanding + " " + this.halfPanding + " " + this.width + " " + this.height);        
        this.svgElement.setAttributeNS(null, "width", this.width);
        this.SVGBackpanel.width = this.width;
        this.SVGBackpanel.height = this.height;
        this.SVGBackdownpanel.width = this.width;
        

        this.SVGIndicatorText1 = new SVGText(this.svgElement, this.id + "indicatortext1", this.indicatorTextSize);
        this.SVGIndicatorText1.fontFamily = "monospace";
        this.SVGIndicatorText2 = new SVGText(this.svgElement, this.id + "indicatortext2", this.indicatorTextSize);
        this.SVGIndicatorText2.fontFamily = "monospace";
        this.SVGIndicatorText3 = new SVGText(this.svgElement, this.id + "indicatortext3", this.indicatorTextSize);
        this.SVGIndicatorText3.fontFamily = "monospace";
        this.SVGIndicatorText4 = new SVGText(this.svgElement, this.id + "indicatortext4", this.indicatorTextSize);
        this.SVGIndicatorText4.fontFamily = "monospace";

        this.SVGIndicatorText1.text = "1234567890ABCSDEFGHL"; //20 chars 
        this.SVGLabel.text = "LCD";

        this.textWidth = this.SVGIndicatorText1.width;
        this.textHeight = this.SVGIndicatorText1.height;

        this.indicatorLeft = this.centreX - this.textWidth / 2;
        this.indicatorTop = (this.centreY + this.SVGLabel.height) - (this.textHeight * 4) / 2;

        this.SVGIndicatorBack = new SVGRect(this.svgElement, this.id + "indicatorback",
            this.indicatorLeft - this.panding,
            this.indicatorTop - parseFloat(this.textHeight - this.panding),
            this.textWidth + this.panding * 2,
            this.textHeight * 4 + this.panding);

        this.SVGIndicatorBack.opacity = 0.2;
        this.SVGIndicatorBack.color = theme.secondary;

        this.SVGIndicatorText1.text = "";
        this.SVGLabel.text = "";
        
        this.SVGIndicatorText.hide();
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
        this.lcdButton.indicator = this;
        // this.lcdButton.onclick = lcdButtonClick;
        this.lcdButton.value = getLang("send");

        this.lightButton = this.btnGroup.appendChild(document.createElement('input'));
        this.lightButton.className = "btn btn-info text-white LCDButton";
        this.lightButton.id = this.id + "clearbutton";
        this.lightButton.type = "button";
        this.lightButton.edit = this.textarea;
        this.lightButton.lcdid = this.id;
        this.lightButton.indicator = this;
        //  this.lightButton.onclick = lightButtonClick;
        this.lightButton.value = getLang("shortlight");

        this.ShowEqualizer = false;

    }

    refresh(indicatorText, label, light) {        
        label = getLang(label);
        this.indicatorText = indicatorText;
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
        var lcdIndicator = rPanel.indicator;

        if (!lcdIndicator.pre.style.display.includes("block")) {
            lcdIndicator.textarea.value = lcdIndicator.indicatorText;
            lcdIndicator.pre.style.display = 'block';
            lcdIndicator.btnGroup.style.display = 'block';
        }
        else {
          //TODO: direct click     
          //  lcdIndicator.hideEditor(); 
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
        requestAnimationFrame(() => this.drawIndicator());


    }
    */
    //---------------------------------------------------------------------------------------
    //draw element text labels - percent value and text 
    drawText() {
        super.drawText();

        switch (this._networkStatus) {
            case NET_ONLINE:
                this.SVGIndicatorText1.color = theme.light;
                this.SVGIndicatorText2.color = theme.light;
                this.SVGIndicatorText3.color = theme.light;
                this.SVGIndicatorText4.color = theme.light;
                break;
            case NET_RECONNECT:
                this.SVGIndicatorText1.color = theme.info;
                this.SVGIndicatorText2.color = theme.info;
                this.SVGIndicatorText3.color = theme.info;
                this.SVGIndicatorText4.color = theme.info;
                break;
            default: //offline
                this.SVGIndicatorText1.color = theme.secondary;
                this.SVGIndicatorText2.color = theme.secondary;
                this.SVGIndicatorText3.color = theme.secondary;
                this.SVGIndicatorText4.color = theme.secondary;
                break;
        }

        if (this.indicatorText == undefined) {
            this.indicatorText = "";            
        }

            this.SVGIndicatorText1.text = this.indicatorText.substring(0, 20);
            this.SVGIndicatorText2.text = this.indicatorText.substring(20, 40);
            this.SVGIndicatorText3.text = this.indicatorText.substring(40, 60);
            this.SVGIndicatorText4.text = this.indicatorText.substring(60);

            this.SVGIndicatorText1.x = this.indicatorLeft;
            this.SVGIndicatorText1.y = this.indicatorTop;

            this.SVGIndicatorText2.x = this.indicatorLeft;
            this.SVGIndicatorText2.y = this.SVGIndicatorText1.y + this.SVGIndicatorText1.height;

            this.SVGIndicatorText3.x = this.indicatorLeft;
            this.SVGIndicatorText3.y = this.SVGIndicatorText2.y + this.SVGIndicatorText2.height;

            this.SVGIndicatorText4.x = this.indicatorLeft;
            this.SVGIndicatorText4.y = this.SVGIndicatorText3.y + this.SVGIndicatorText4.height;
        

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



        this.SVGIndicatorText1.color = theme.light;
        this.SVGIndicatorText2.color = theme.light;
        this.SVGIndicatorText3.color = theme.light;
        this.SVGIndicatorText4.color = theme.light;

        this.SVGIndicatorText1.text = this.indicatorText.substring(0, 20);
        this.SVGIndicatorText2.text = this.indicatorText.substring(20, 40);
        this.SVGIndicatorText3.text = this.indicatorText.substring(40, 60);
        this.SVGIndicatorText4.text = this.indicatorText.substring(60);

        this.SVGIndicatorText1.x = this.indicatorLeft;
        this.SVGIndicatorText1.y = this.indicatorTop;

        this.SVGIndicatorText2.x = this.indicatorLeft;
        this.SVGIndicatorText2.y = this.SVGIndicatorText1.y + this.SVGIndicatorText1.height;

        this.SVGIndicatorText3.x = this.indicatorLeft;
        this.SVGIndicatorText3.y = this.SVGIndicatorText2.y + this.SVGIndicatorText2.height;

        this.SVGIndicatorText4.x = this.indicatorLeft;
        this.SVGIndicatorText4.y = this.SVGIndicatorText3.y + this.SVGIndicatorText4.height;

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
                this.hintElement.className = "LCDIndicatorHint text-secondary text-center";
                break;
            case NET_ERROR:
                this.textElement.className = "text-danger text-center";
                this.hintElement.innerHTML = getLang("rid_error");
                this.hintElement.className = "LCDIndicatorHint text-danger text-center";
                break;
            case NET_RECONNECT:
                this.textElement.className = "text-info text-center";
                this.hintElement.innerHTML = getLang("rid_connect");
                this.hintElement.className = "LCDIndicatorHint text-info text-center";
                break;
            default: //offline
                this.textElement.className = "text-secondary text-center";
                this.hintElement.innerHTML = getLang("rid_offline");
                this.hintElement.className = "LCDIndicatorHint text-secondary text-center";
                break;
        }
        */
    }

  
    drawIndicator() {

        
        if (this.light == 1) {
            this.SVGIndicatorBack.color = theme.info;
        }
        else {
            this.SVGIndicatorBack.color = theme.secondary;
        }

        super.drawIndicator();

/*
        if (this.light == 1) {
            this.SVGIndicatorBack.color = theme.info;
        }
        else {
            this.SVGIndicatorBack.color = theme.secondary;
        }

        //spinner 
        if (this.networkStatus == NET_RECONNECT) {
            this.spinnerAngle += 1.5;
            this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
            requestAnimationFrame(() => this.drawIndicator());
        }
        else {
            this.SVGArcSpinner.hide();
        }
        
        */
    }
    
}

