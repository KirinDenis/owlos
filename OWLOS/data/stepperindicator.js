

class StepperIndicator {
    constructor(parentPanel, id, size) {
        this.parentPanel = parentPanel;
        this.id = id;
        this.size = size;

        this.networkStatus = NET_ONLINE;

        this.indicatorWidht = this.size / 10;
        this.radius = this.size / 2 - this.indicatorWidht;

        this.alphaValue = "80";

        this.rPanel = this.parentPanel.appendChild(document.createElement("div"));
        this.rPanel.id = id + "StepperIndicator";
        this.rPanel.stepperIndicator = this;
        this.rPanel.className = "ActuatorIndicator";
        this.rPanel.style.cursor = "pointer";

        this.sPandingTop = this.size / 4;
        this.sPandingLeft = this.size / 7;
        this.sWidth = this.size - this.sPandingLeft * 2;
        this.sHeight = this.size - this.size / 10 - this.sPandingTop;

        this.userMovePosition = false;
        this.atProcess = false;
        this.positionChangeReciever = null;    

        this.rCanvas = $("<canvas></canvas>").attr({ width: size, height: size }).get(0),
            this.rContext = this.rCanvas.getContext("2d");

        var _rCanvas = $(this.rPanel).children("canvas");
        if (_rCanvas.length !== 0) {
            _rCanvas.replaceWith(this.rCanvas);
        } else {
            $(this.rCanvas).appendTo($(this.rPanel));
        }

        this.rCanvas.onmousemove = this.mousemove;
        this.rCanvas.stepperIndicator = this;
        
    }

    mousemove(event) {
        event.stopPropagation();
        var stepperIndicator = event.currentTarget.stepperIndicator;
        if (stepperIndicator.atProcess) {
            stepperIndicator.atProcess = false;
            return true; //OR cancel operation todo 
        }
        if (event.buttons == 1)
        {            
            if ((event.offsetY > stepperIndicator.sPandingTop) && (event.offsetY < stepperIndicator.sPandingTop + stepperIndicator.sHeight)) {

                var lenght = event.offsetY - stepperIndicator.sPandingTop;
                var toPercent = lenght / (stepperIndicator.sHeight / 100);
                stepperIndicator.userMovePosition = true;
                stepperIndicator.refresh(stepperIndicator.percent, toPercent, stepperIndicator.indicatorText, stepperIndicator.text);        
                return true;
            }
        }
        if (stepperIndicator.userMovePosition) {
            if (stepperIndicator.positionChangeReciever != null) {
                stepperIndicator.userMovePosition = false;
                stepperIndicator.positionChangeReciever(stepperIndicator.toPercent);
            }
        }

        stepperIndicator.userMovePosition = false;
        stepperIndicator.refresh(stepperIndicator.percent, stepperIndicator.toPercent, stepperIndicator.indicatorText, stepperIndicator.text);        

        
        return false;

    } 

    refresh(percent, toPercent, indicatorText, text) {
        text = getLang(text);
        //if ((this.percent == percent) && (this.toPercent == toPercent) && (this.indicatorText == indicatorText) && (this.text == text)) return;
       
        this.percent = Math.round(percent);
        this.toPercent = Math.round(toPercent);
        this.indicatorText = indicatorText;
        this.text = text;

        

        this.spinnerAngle = 0;
        this.redrawAll();
    }



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
        this.starttime = 0;
        requestAnimationFrame(() => this.drawIndicator());
        this.drawText();

    }
    //---------------------------------------------------------------------------------------
    //draw element text labels - percent value and text 
    drawText() {
        //draw pervent text ----------
        var elementWidth = 0;
        var elementHeight = 0;
        /*
        if (this.indicatorElement == null) {
            this.indicatorElement = this.rPanel.appendChild(document.createElement("h4"));            
            this.indicatorElement.firstTime = true;
        }
        
        switch (this.networkStatus) {
            case NET_ONLINE: this.indicatorElement.className = "ActuatorIndicatorPercent text-success"; break;
            case NET_ERROR: this.indicatorElement.className = "ActuatorIndicatorPercent text-danger"; break;
            case NET_RECONNECT: this.indicatorElement.className = "ActuatorIndicatorPercent text-info"; break;
            default: //offline
                this.indicatorElement.className = "ActuatorIndicatorPercent text-secondary"; break;
        }

        this.indicatorElement.innerHTML = this.indicatorText;
       // this.indicatorElement.innerHTML = "";

        if (this.indicatorElement.firstTime) {
            var elementWidth = this.indicatorElement.getBoundingClientRect().width;

            if (elementWidth < this.size) {
                this.indicatorElement.style.fontSize = (this.size / 2) / elementWidth + "rem";
            }

            elementWidth = this.indicatorElement.getBoundingClientRect().width;
            this.indicatorElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";

            var elementHeight = this.indicatorElement.getBoundingClientRect().height;
            this.indicatorElement.style.marginTop = - (elementHeight / 2.0 + this.size / 2.0) + "px";

            this.indicatorElement.firstTime = false;
        }
        */
        //draw text label --------------
        if (this.textElement == null) {
            this.textElement = this.rPanel.appendChild(document.createElement("div"));
            this.textElement.firstTime = true;
        }

        switch (this.networkStatus) {
            case NET_ONLINE: this.textElement.className = "ActuatorIndicatorText text-white text-center"; break;
            case NET_ERROR: this.textElement.className = "ActuatorIndicatorText text-danger text-center"; break;
            case NET_RECONNECT: this.textElement.className = "ActuatorIndicatorText text-info text-center"; break;
            default: //offline
                this.textElement.className = "ActuatorIndicatorText text-secondary text-center"; break;
        }

        if (this.textElement.firstTime) {
            this.textElement.innerHTML = "WWWWWW"; //8 chars
            elementWidth = this.textElement.getBoundingClientRect().width;

            if (elementWidth < this.size) {
                this.textElement.style.fontSize = (this.size / 2) / elementWidth + "rem";
            }
        }

        this.textElement.innerHTML = this.text;

        if (this.textElement.firstTime) {
            elementWidth = this.textElement.getBoundingClientRect().width;
            this.textElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";
            this.textElement.firstTime = false;
        }

        //draw hint --------------
        if (this.hintElement == null) {
            this.hintElement = this.rPanel.appendChild(document.createElement("div"));
            this.hintElement.firstTime = true;
        }

        switch (this.networkStatus) {
            case NET_ONLINE: this.hintElement.className = "ActuatorIndicatorHint text-secondary text-center"; break;
            case NET_ERROR: this.hintElement.className = "ActuatorIndicatorHint text-danger text-center"; break;
            case NET_RECONNECT: this.hintElement.className = "ActuatorIndicatorHint text-info text-center"; break;
            default: //offline
                this.hintElement.className = "ActuatorIndicatorHint text-secondary text-center"; break;
        }
        
        if (this.hintElement.firstTime) {
            this.hintElement.innerHTML = "WWWWW"; //4 chars
            elementWidth = this.hintElement.getBoundingClientRect().width;

            if (elementWidth < this.size) {
                this.hintElement.style.fontSize = (this.size / 2) / elementWidth + "rem";
            }
        }

        switch (this.networkStatus) {
            case NET_ONLINE: this.hintElement.innerHTML = getLang("rid_online"); break;
            case NET_ERROR: this.hintElement.innerHTML = getLang("rid_error"); break;
            case NET_RECONNECT: this.hintElement.innerHTML = getLang("rid_connect"); break;
            default: //offline
                this.hintElement.innerHTML = this.hintElement.innerHTML = getLang("rid_offline"); break;
        }

        //  if (this.hintElement.firstTime) {
        elementWidth = this.hintElement.getBoundingClientRect().width;
        this.hintElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";
        this.hintElement.firstTime = false;
        //   }


    }



    drawIndicator() {
        this.rContext.save();
        this.rContext.clearRect(0, 0, this.rCanvas.width, this.rCanvas.height);
       this.rContext.imageSmoothingEnabled = false;
    //    
        

        var radius = 25;
        var panding = 5;
        var width = this.size - panding;
        var height = this.size - panding;

        //background --------------------------------------------------------------------------------
        this.rContext.beginPath();
        this.rContext.rect(panding, height, width, height+panding);
        this.rContext.fillStyle = theme.danger;
        switch (this.networkStatus) {
            case NET_ONLINE: this.rContext.fillStyle = theme.success; break;
            case NET_ERROR: this.rContext.fillStyle = theme.danger; break;
            case NET_RECONNECT: this.rContext.fillStyle = theme.info + this.alphaValue; break;
            default: //offline
                this.rContext.fillStyle = theme.secondary; break;
        }                    
        this.rContext.closePath();
        this.rContext.fill();

        this.rContext.beginPath();
        this.rContext.rect(panding, panding, width, height);
        this.rContext.fillStyle = theme.secondary + "10";        
        this.rContext.closePath();
        this.rContext.fill();
        //end off background -----------------------------------------------------------------------
        
        this.rContext.lineCap = "";
        this.rContext.lineWidth = 1;

        var pixPercent = (this.sHeight / 100) * this.percent;
        var pixToPercent = (this.sHeight / 100) * this.toPercent;

        //inside fill (window)
        this.rContext.beginPath();
        this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, this.sHeight);
        this.rContext.fillStyle = theme.info + this.alphaValue;        
        this.rContext.closePath();
        this.rContext.fill();

        //current position - percent
        this.rContext.beginPath();
        this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, pixPercent);
        this.rContext.fillStyle = theme.secondary;        
        this.rContext.closePath();
        this.rContext.fill();
        //end of 
        //draw stepper possition line ----------------------------------------------------
        this.rContext.beginPath();
        this.rContext.rect(this.sPandingLeft, this.sPandingTop + pixPercent, this.sWidth, 2);
        this.rContext.fillStyle = theme.info;     
        this.rContext.closePath();
        this.rContext.fill();

        //draw stepper TO possition line ----------------------------------------------------
        this.rContext.beginPath();
        this.rContext.rect(this.sPandingLeft, this.sPandingTop + pixToPercent, this.sWidth, 2);
        if (this.userMovePosition) {
            this.rContext.fillStyle = theme.danger;
        }
        else {
            this.rContext.fillStyle = theme.success;
        }
        this.rContext.closePath();
        this.rContext.fill();

        //--------------------------------------------------------------------
        //draw stepper to Position pointers
        this.rContext.beginPath();
        var triagleSize = this.size / 25;
        //left
        this.rContext.moveTo(this.sPandingLeft, this.sPandingTop + pixToPercent );
        this.rContext.lineTo(this.sPandingLeft  - triagleSize, this.sPandingTop + pixToPercent + triagleSize);
        this.rContext.lineTo(this.sPandingLeft  - triagleSize, this.sPandingTop + pixToPercent - triagleSize);
        //right
        this.rContext.moveTo(this.sPandingLeft + this.sWidth, this.sPandingTop + pixToPercent);
        this.rContext.lineTo(this.sPandingLeft + this.sWidth + triagleSize, this.sPandingTop + pixToPercent + triagleSize);
        this.rContext.lineTo(this.sPandingLeft + this.sWidth + triagleSize, this.sPandingTop + pixToPercent - triagleSize);

        if (this.userMovePosition) {
            this.rContext.fillStyle = theme.danger;
        }
        else {
            this.rContext.fillStyle = theme.success;
        }        
        this.rContext.closePath();
        this.rContext.fill();

        //draw rows        
        var tenPercent = (this.sHeight / 100) * 10;
        for (var i = tenPercent; i < this.sHeight; i += tenPercent) {            

            this.rContext.beginPath();
            this.rContext.moveTo(this.sPandingLeft, this.sPandingTop + i);
            this.rContext.lineTo(this.sPandingLeft + 5, this.sPandingTop + i);

            this.rContext.moveTo(this.sPandingLeft + this.sWidth, this.sPandingTop + i);
            this.rContext.lineTo(this.sPandingLeft + this.sWidth - 5, this.sPandingTop + i);

            this.rContext.strokeStyle = theme.light + this.alphaValue;
            this.rContext.stroke();            
            this.rContext.closePath();
        }
        
        //border 
        this.rContext.beginPath();
        this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, this.sHeight);
        this.rContext.strokeStyle = theme.light + this.alphaValue;
        this.rContext.stroke();
        this.rContext.closePath();

        this.rContext.restore();

        //text -----------------------------------------------------------
        this.rContext.save();
        this.rContext.beginPath();
       
       
        
        this.rContext.font = "400 50px " + theme.fontFamily.toString();
        this.rContext.textAlign = 'center';        
        this.rContext.fillStyle = theme.success;


        this.rContext.shadowBlur = 1;
        this.rContext.shadowColor = this.rContext.fillStyle;
        this.rContext.shadowOffsetX = 0;
        this.rContext.shadowOffsetY = 0;

        this.rContext.fillText("90%", this.size / 2, this.size / 2, 100);
        


        this.rContext.closePath();
        this.rContext.restore();

        //spinner   ---------------
        if (this.networkStatus == NET_RECONNECT)
        {
            var x = this.rCanvas.width / 2;
            var y = this.rCanvas.height / 2 + this.size / 22;

            this.spinnerAngle += 0.05;
            var counterClockwise = false;
            this.rContext.beginPath();
            this.rContext.lineWidth = this.indicatorWidht / 3;
            this.rContext.arc(x, y, this.radius - this.indicatorWidht - this.size / 15, this.spinnerAngle, this.spinnerAngle + Math.PI, counterClockwise);
            this.rContext.strokeStyle = theme.info + 40;
            this.rContext.stroke();
            this.rContext.closePath();
            requestAnimationFrame(() => this.drawIndicator());

        }

    }
}

