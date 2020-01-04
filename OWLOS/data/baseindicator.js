var WORK_MODE = 0;
var MOVE_MODE = 1;

var EVENT_NO = 0;
var EVENT_DELETE = 1;

class BaseIndicator {
    constructor(parentPanel, id, size) {
        this.parentPanel = parentPanel;

        //properties --------------------------------
        this.id = id;        
        this._networkStatus = NET_OFFLINE
        this._event = EVENT_NO;
        this.eventListners = [];
              
        this.panding = size / 25;
        this.halfPanding = this.panding / 2;
        this.size = size;
        this.radius = this.size / 7;

        this.width = this.size - this.halfPanding;
        this.height = this.size - this.halfPanding;

        this.centreX = this.width / 2 + this.panding / 2;
        this.centreY = this.height / 2;
        this.topMargin = this.height / 20;

        this.svgElement = document.createElementNS(xmlns, "svg");

        this.svgElement.setAttributeNS(null, "viewBox", this.halfPanding + " " + this.halfPanding + " " + this.width + " " + this.height);
        this.svgElement.setAttributeNS(null, "width", size);
        this.svgElement.setAttributeNS(null, "height", size);
        this.svgElement.style.display = "block";

        this.SVGIndicatorText = new SVGText(this.svgElement, this.id + "indicatortext", this.size / 100);
        this.SVGIndicatorText.color = theme.secondary;
        this.SVGLabel = new SVGText(this.svgElement, this.id + "label", this.size / 150);
        this.SVGLabel.color = theme.secondary;
        this.SVGHint = new SVGText(this.svgElement, this.id + "hint", this.size / 150);
        this.SVGHint.color = theme.secondary;

        this.SVGBackpanel = new SVGRect(this.svgElement, this.id + "backpanel", 0, 0, this.width, this.height);
        this.SVGBackpanel.opacity = 0.1;
        this.SVGBackpanel.color = theme.secondary;

        this.SVGBackdownpanel = new SVGRect(this.svgElement, this.id + "backdownpanel", 0, this.height, this.width, this.halfPanding);
        this.SVGBackdownpanel.opacity = 0.9;
        this.SVGBackdownpanel.color = theme.secondary;


        var stop1 = document.createElementNS(xmlns, 'stop');
        stop1.setAttribute('stop-color', theme.info);
        stop1.setAttribute('stop-opacity', "0.7");
        stop1.setAttribute('offset', "0%");

        var stop2 = document.createElementNS(xmlns, 'stop');
        stop2.setAttribute('class', 'stop2');
        stop2.setAttribute('stop-color', theme.info);
        stop2.setAttribute('stop-opacity', "0.4");
        stop2.setAttribute('offset', "20%");

        var stop3 = document.createElementNS(xmlns, 'stop');
        stop3.setAttribute('class', 'stop3');
        stop3.setAttribute('stop-color', theme.info);
        stop3.setAttribute('stop-opacity', "0.0");
        stop3.setAttribute('offset', "60%");

        var gradient = document.createElementNS(xmlns, 'linearGradient');
        gradient.id = 'Gradient';
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        this.svgElement.appendChild(gradient);

        this.SVGArcSpinner = new SVGArc(this.svgElement, this.id + "arcindicator", this.centreX, this.centreY + this.topMargin, this.size / 4, this.size / 24);
        this.SVGArcSpinner.color = 'url(#Gradient)';
        this.SVGArcSpinner.opacity = 0.4;

        //equalizer 
        //width = 20 
        //height = 5

        this.eCount = 30;
        this.eWidth = this.size / (this.eCount + 40);
        this.eRWidth = this.width / 40;
        this.eHeight = this.eWidth;


        this.eX = this.width / 2 - this.eWidth * 2 * this.eCount / 2 + this.halfPanding;
        this.eY = this.height - this.eHeight * 2 * 5

        this.equalizerX = []; //row

        for (var x = 0; x < this.eCount; x++) {
            var equalizerY = [];
            for (var y = 0; y < 5; y++) {
                var SVGBackpanel = new SVGRect(this.svgElement, this.id + "backpanel", this.eX + x * this.eWidth * 2, this.eY + y * this.eHeight * 2, this.eRWidth, this.eRWidth);
                SVGBackpanel.opacity = 0.0;
                SVGBackpanel.color = theme.secondary;
                equalizerY.push(SVGBackpanel);
            }
            this.equalizerX.push(equalizerY);
        }

        this.ShowEqualizer = true;        

        this.rowSize = this.size / 4;
        this.SVGLeftIcon = new SVGIcon(this.svgElement, leftIcon, this.panding, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
        this.SVGLeftIcon.fill = theme.light;
        this.SVGLeftIcon.SVGIcon.indicator = this;
        this.SVGLeftIcon.SVGIcon.onclick = this.moveLeft;
        this.SVGLeftIcon.hide();

        this.SVGRightIcon = new SVGIcon(this.svgElement, rightIcon, this.width - this.rowSize, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
        this.SVGRightIcon.fill = theme.light;
        this.SVGRightIcon.SVGIcon.indicator = this;
        this.SVGRightIcon.SVGIcon.onclick = this.moveRight;
        this.SVGRightIcon.hide();

        /*
        this.SVGPlusIcon = new SVGIcon(this.svgElement, plusIcon, this.width / 2 - this.rowSize / 2, 0, this.rowSize, this.rowSize);
        this.SVGPlusIcon.fill = theme.light;
        this.SVGPlusIcon.SVGIcon.indicator = this;
        this.SVGPlusIcon.SVGIcon.onclick = this.plusSize;
        this.SVGPlusIcon.hide();
        */

        this.SVGMinusIcon = new SVGIcon(this.svgElement, minusIcon, this.width / 2 - this.rowSize / 2, this.height - this.rowSize, this.rowSize, this.rowSize);
        this.SVGMinusIcon.fill = theme.light;
        this.SVGMinusIcon.SVGIcon.indicator = this;
        this.SVGMinusIcon.SVGIcon.onclick = this.minusSize;
        this.SVGMinusIcon.hide();

        /*
        this.SVGModeIcon = new SVGIcon(this.svgElement, menuIcon, this.width / 24, this.size / 30, this.size / 8, this.size / 8);
        this.SVGModeIcon.fill = theme.secondary;
        this.SVGModeIcon.SVGIcon.indicator = this;
        this.SVGModeIcon.SVGIcon.onclick = this.modeChangeClick;
        */

        this.rPanel = this.parentPanel.appendChild(document.createElement("div"));
        this.rPanel.id = id + "BaseIndicator";
        this.rPanel.indicator = this;
        this.rPanel.className = "Indicator";
        this.rPanel.style.cursor = "pointer";

        this.mouseEnter = false;
        this.rPanel.onmouseover = this.mouseOver;
        this.rPanel.onmouseout = this.mouseOut;


        this.rPanel.appendChild(this.svgElement);
        this.mode = WORK_MODE;
    }

    
    set event(event) { 
        this._event = event; 
        for (var k = 0; k < this.eventListners.length; k++) { 
            this.eventListners[k].event(this.eventListners[k].sender, this);
        }
    }

    get event() {
        return this._event;
    }

    addEventListner(_event, _sender) {        
        try { _event(_sender, this); } catch {
            return; // don't add bad listner
        }
        this.eventListners.push(event = { event: _event, sender: _sender });
    }

    clickableToTop() {
        this.svgElement.insertBefore(this.SVGLeftIcon.SVGIcon, this.svgElement.childNodes.lastChild);
        this.svgElement.insertBefore(this.SVGRightIcon.SVGIcon, this.svgElement.childNodes.lastChild);
       // this.svgElement.insertBefore(this.SVGPlusIcon.SVGIcon, this.svgElement.childNodes.lastChild);
        this.svgElement.insertBefore(this.SVGMinusIcon.SVGIcon, this.svgElement.childNodes.lastChild);
    }


    moveLeft(event) {
        var indicator = event.currentTarget.indicator;
        if (indicator.mode == MOVE_MODE) {
            var index = Array.prototype.slice.call(indicator.parentPanel.childNodes).indexOf(indicator.rPanel);
            indicator.parentPanel.removeChild(indicator.rPanel);
            indicator.parentPanel.insertBefore(indicator.rPanel, indicator.parentPanel.childNodes[index - 1]);
        }
        return true;
    }

    moveRight(event) {
        var indicator = event.currentTarget.indicator;
        if (indicator.mode == MOVE_MODE) {
            var index = Array.prototype.slice.call(indicator.parentPanel.childNodes).indexOf(indicator.rPanel);
            indicator.parentPanel.removeChild(indicator.rPanel);
            indicator.parentPanel.insertBefore(indicator.rPanel, indicator.parentPanel.childNodes[index + 1]);
        }
        return true;
    }

    plusSize(event) {
        var indicator = event.currentTarget.indicator;
        if (indicator.mode == MOVE_MODE) {
            indicator.svgElement.setAttributeNS(null, "width", indicator.width += 25);
            indicator.svgElement.setAttributeNS(null, "height", indicator.height += 25);
        }
        return true;
    }
    //TEMP: NOW IS USED AS DELETE BUTTON !
    minusSize(event) {
        
        var indicator = event.currentTarget.indicator;
        indicator.event = EVENT_DELETE;
        Array.prototype.slice.call(indicator.parentPanel.childNodes).indexOf(indicator.rPanel);
        indicator.parentPanel.removeChild(indicator.rPanel);
        indicator.rPanel.innerHTML = "";
        /*
        if (indicator.mode == MOVE_MODE) {
            indicator.svgElement.setAttributeNS(null, "width", indicator.width -= 25);
            indicator.svgElement.setAttributeNS(null, "height", indicator.height -= 25);
        }
        */
        return true;
    }

    modeChangeClick(event) {
        var indicator = event.currentTarget.indicator;
        if (indicator.mode == WORK_MODE) {
            indicator.mode = MOVE_MODE;
        }
        else {
            indicator.mode = WORK_MODE;
        }
        return true;
    }

    mouseOver(event) {
        var indicator = event.currentTarget.indicator;
        indicator.mouseEnter = true;
        indicator.drawMouseEnter();
        return true;
    }

    mouseOut(event) {
        var indicator = event.currentTarget.indicator;
        indicator.mouseEnter = false;
        indicator.drawMouseEnter();
        return true;
    }

    set mode(mode) {
        this._mode = mode;
        if (mode == WORK_MODE) {
            this.SVGBackpanel.opacity = 0.1;
            this.SVGLeftIcon.hide();
            this.SVGRightIcon.hide();
          //  this.SVGPlusIcon.hide();
            this.SVGMinusIcon.hide();
        }
        else 
            if (mode == MOVE_MODE) {
                this.SVGBackpanel.opacity = 0.5;
                this.SVGLeftIcon.draw();
                this.SVGRightIcon.draw();
             //   this.SVGPlusIcon.draw();
                this.SVGMinusIcon.draw();
            }
    }

    get mode() {
        return this._mode;
    }


    refresh(data, indicatorText, label, historyData) {
        if ((this._data == data) && (this.indicatorText == indicatorText) && (this.label == label)) return;

        if (this.indicatorText != indicatorText) {
            speak(label + " " + indicatorText);
        }

        label = getLang(label);
        this.historyData = historyData;
        this._data = data;
        this.indicatorText = indicatorText;
        this.label = label;
        this.spinnerAngle = 0;
        this.redrawAll();
    }

    

    get networkStatus() {
        return this._networkStatus;
    }
set networkStatus(networkStatus) {
        if ((networkStatus >= NET_OFFLINE) && (networkStatus <= NET_RECONNECT)) {
            this._networkStatus = networkStatus;
            this.redrawAll();
        }
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = _data;
        this.redrawAll();
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
        //Indicator text         
        this.SVGIndicatorText.text = this.indicatorText;
        if (this.SVGIndicatorText.width != 0) {
            this.SVGIndicatorText.x = this.centreX - this.SVGIndicatorText.width / 2;
            this.SVGIndicatorText.y = this.centreY + this.SVGIndicatorText.height / 2;
        }

        switch (this._networkStatus) {
            case NET_ONLINE: this.toColor(this.SVGIndicatorText, theme.success); break;
            case NET_ERROR: this.toColor(this.SVGIndicatorText, theme.danger); break;
            case NET_RECONNECT: this.toColor(this.SVGIndicatorText, theme.info); break;
            default: //offline
                this.toColor(this.SVGIndicatorText, theme.secondary); break;
        }

        //Label 
        this.SVGLabel.text = this.label;
        if (this.SVGLabel.width != 0) {
            this.SVGLabel.x = this.centreX - this.SVGLabel.width / 2;
            this.SVGLabel.y = this.SVGLabel.height;
        }

        switch (this._networkStatus) {
            case NET_ONLINE: this.toColor(this.SVGLabel, theme.light); break;
            case NET_ERROR: this.toColor(this.SVGLabel, theme.danger); break;
            case NET_RECONNECT: this.toColor(this.SVGLabel, theme.info); break;
            default: //offline
                this.toColor(this.SVGLabel, theme.secondary); break;
        }

        //Hint
        switch (this._networkStatus) {
            case NET_ONLINE:
                this.SVGHint.text = getLang("rid_online");
                this.toColor(this.SVGHint, theme.success);
                break;
            case NET_ERROR:
                this.SVGHint.text = getLang("rid_error");
                this.toColor(this.SVGHint, theme.danger);
                break;
            case NET_RECONNECT:
                this.SVGHint.text = getLang("rid_connect");
                this.toColor(this.SVGHint, theme.info);
                break;
            default: //offline
                this.SVGHint.text = getLang("rid_offline");
                this.toColor(this.SVGHint, theme.secondary);
                break;
        }

        if (this.SVGHint != 0) {
            this.SVGHint.x = this.centreX - this.SVGHint.width / 2;
            this.SVGHint.y = this.height - this.SVGHint.height / 2;
        }
    }

    //method true is color, false is fill
    toColor(element, color, method) {
        if (method == undefined) method = true;
        if (element == null) return;
        if (element.animantion == null) {
            element.animantion = false;
        }

        if (element.animantion) {
            element.animantion = false;
            window.cancelAnimationFrame(element.animantionFrame);
            this.animateColor(element, color, method);
        }
        element.animantion = true;
        this.animateColor(element, color, method);
    }

    animateColor(element, color, method) {
        if (!element.animantion) return;

        var rgbSrc = element.colorRGB;

        var rgbDst = colorToRGB(color);
        if ((rgbSrc[0] == rgbDst[0]) && (rgbSrc[1] == rgbDst[1]) && (rgbSrc[2] == rgbDst[2])) {
            window.cancelAnimationFrame(element.animantionFrame);
            element.animantion = false;
            return;
        }
        if (rgbSrc[0] != rgbDst[0])
            if (rgbSrc[0] < rgbDst[0]) rgbSrc[0]++; else rgbSrc[0]--;
        if (rgbSrc[1] != rgbDst[1])
            if (rgbSrc[1] < rgbDst[1]) rgbSrc[1]++; else rgbSrc[1]--;
        if (rgbSrc[2] != rgbDst[2])
            if (rgbSrc[2] < rgbDst[2]) rgbSrc[2]++; else rgbSrc[2]--;


        element.colorRGB = rgbSrc;
        if (!method) {
            element.fillRGB = rgbSrc;
        }

        if (element.animantion) {
            element.animantionFrame = window.requestAnimationFrame(() => this.animateColor(element, color, method));
        }

    }

    drawIndicator() {
        var oneHangPercent = 360 + 90 + 30 - 240;
        var drawPercent = this._data * (oneHangPercent / 100);

        //backdown panel
        /*
        switch (this._networkStatus) {
            case NET_ONLINE: this.SVGBackdownpanel.color = theme.success; break;
            case NET_ERROR: this.SVGBackdownpanel.color = theme.danger; break;
            case NET_RECONNECT: this.SVGBackdownpanel.color = theme.info; break;
            default: //offline
                this.SVGBackdownpanel.color = theme.light; break;
        }
        */

        switch (this._networkStatus) {
            case NET_ONLINE: this.toColor(this.SVGBackdownpanel, theme.success); break;
            case NET_ERROR: this.toColor(this.SVGBackdownpanel, theme.danger); break;
            case NET_RECONNECT: this.toColor(this.SVGBackdownpanel, theme.info); break;
            default: //offline
                this.toColor(this.SVGBackdownpanel, theme.light); break;
        }


        //equalizer --------------------------
        for (var x = 0; x < this.eCount; x++) {
            var equalizerY = this.equalizerX[x];
            for (var y = 0; y < 5; y++) {
                if ((this._networkStatus == NET_ONLINE) && (this.ShowEqualizer)) {
                    equalizerY[y].opacity = (y + 1) * 0.09;
                }
                else {
                    equalizerY[y].opacity = 0.0;
                }
                equalizerY[y].color = theme.secondary;
            }
        }

        if ((this._networkStatus == NET_ONLINE) && (this.ShowEqualizer)) {
            if (this.historyData != undefined) {
                //reset 

                var splitHistory = this.historyData.split(";");
                var count = splitHistory[0];
                var prop = count / this.eCount;
                var bigValue;

                for (var x = 0; x < count; x++) {
                    var equalizerY = this.equalizerX[parseInt(x / prop)];
                    var value = splitHistory[x + 1];
                    if ((bigValue == undefined) || (value > bigValue)) {
                        bigValue = value;
                    }
                }

                var propValue = parseFloat(bigValue / 5);

                for (var x = 0; x < count; x++) {
                    if (count < this.eCount) {
                        var equalizerY = this.equalizerX[x];
                    }
                    else {
                        var equalizerY = this.equalizerX[parseInt(x / prop)];
                    }

                    var value = parseInt(splitHistory[x + 1] / propValue);
                    for (var y = 0; y < value; y++) {
                        equalizerY[4 - y].opacity = 1.0 - parseFloat(y / 8.0);
                        equalizerY[4 - y].color = theme.success;
                    }
                }
            }
        }

        //spinner 
        if (this._networkStatus == NET_RECONNECT) {
            this.spinnerAngle += 1.5;
            if (this.SVGArcSpinner.opacity < 0.8) {
                this.SVGArcSpinner.opacity += 0.01;
            }
            this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
            requestAnimationFrame(() => this.drawIndicator());
        }
        else {
            this.SVGArcSpinner.opacity = 0.0;
            this.SVGArcSpinner.hide();
        }

    }

    drawMouseEnter() {
        if (this._mode != WORK_MODE) return;
        if (this.mouseEnter) {
            if (this.SVGBackpanel.opacity < 0.3) {
                this.SVGBackpanel.opacity += 0.005;
                requestAnimationFrame(() => this.drawMouseEnter());
            }
        }
        else {
            if (this.SVGBackpanel.opacity > 0.1) {
                this.SVGBackpanel.opacity -= 0.005;
                requestAnimationFrame(() => this.drawMouseEnter());
            }
        }
    }
}


