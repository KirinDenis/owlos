var WORK_MODE = 0;
var MOVE_MODE = 1;

var EVENT_NO = 0;
var EVENT_DELETE = 1;

function defaultWidgetProperties() {
    return {
        headertext: {
            name: "header text",
            value: "---",
            type: "s"
        },

        headercolor: {
            name: "header color",
            value: theme.info,
            type: "c"
        },

        headeropacity: {
            name: "header opacity",
            value: 0.1,
            type: "f"
        },

        backgroundcolor: {
            name: "baground color",
            value: theme.dark,
            type: "c"
        },

        backgroundopacity: {
            name: "background opacity",
            value: 0.1,
            type: "f"
        },

        backgroundselectopacity: {
            name: "background select opacity",
            value: 0.2,
            type: "f"
        },

        showequalizer: {
            name: "Show equalizer",
            value: true,
            type: "b"
        }

    }
}

var BaseWidget =

    function () {
        "use strict";

        function BaseWidget(parentPanel, id, size) {
            this.parentPanel = parentPanel;

            this.id = id;
            this._networkStatus = NET_OFFLINE;
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
            this.SVGWidgetText = new SVGText(this.svgElement, this.id + "widgettext", this.size / 80);
            this.SVGWidgetText.opacity = 0.7;
            this.SVGWidgetText.color = theme.secondary;
            this.SVGLabel = new SVGText(this.svgElement, this.id + "label", this.size / 150);
            this.SVGLabel.color = theme.secondary;
            this.SVGHint = new SVGText(this.svgElement, this.id + "hint", this.size / 150);
            this.SVGHint.color = theme.secondary;

            this.SVGBackpanel = new SVGArc(this.svgElement, this.id + "backpanel", 0, 0, this.width, 1);
            this.SVGBackpanel.drawRoundedRect(this.width, this.height, 5, 10, true, true, true, true);
            //this.SVGBackpanel.opacity = 0.3;

            this.SVGBoxBackpanel = new SVGArc(this.svgElement, this.id + "boxbackpanel", 0, 0, this.width, 1);
            this.SVGBoxBackpanel.drawRoundedRect(this.width, 25, 5, 0, true, true, false, false);

            this.SVGBackdownpanel = new SVGArc(this.svgElement, this.id + "backdownpanel", 0, this.height - 10, this.width, 1);
            this.SVGBackdownpanel.drawRoundedRect(this.width, 10, 5, 0, false, false, true, true);
            this.SVGBackdownpanel.opacity = 0.5;
            this.SVGBackdownpanel.fill = theme.secondary;

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
            this.SVGArcSpinner = new SVGArc(this.svgElement, this.id + "arcwidget", this.centreX, this.centreY + this.topMargin, this.size / 4, this.size / 24);
            this.SVGArcSpinner.color = 'url(#Gradient)';
            this.SVGArcSpinner.opacity = 0.4; //equalizer 
            //width = 20 
            //height = 5

            this.eCount = 30;
            this.eWidth = this.size / (this.eCount + 50);
            this.eRWidth = this.width / 40;
            this.eHeight = this.eWidth;
            this.eX = this.width / 2 - this.eWidth * 2 * this.eCount / 2 + this.halfPanding / 2 + 2;
            this.eY = this.height - this.eHeight * 2 * 5 - 2;
            this.equalizerX = []; //row

            for (var x = 0; x < this.eCount; x++) {
                var equalizerY = [];

                for (var y = 0; y < 5; y++) {
                    var SVGEqualizerpanel = new SVGRect(this.svgElement, this.id + "backpanel", this.eX + x * this.eWidth * 2, this.eY + y * this.eHeight * 2, this.eRWidth, this.eRWidth);
                    SVGEqualizerpanel.opacity = 0.0;
                    SVGEqualizerpanel.fill = theme.secondary;

                    equalizerY.push(SVGEqualizerpanel);
                }

                this.equalizerX.push(equalizerY);
            }
            
            this.rowSize = this.size / 4;
            this.SVGLeftIcon = new SVGIcon(this.svgElement, leftIcon, this.panding, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
            this.SVGLeftIcon.fill = theme.light;
            this.SVGLeftIcon.SVGIcon.widget = this;
            this.SVGLeftIcon.SVGIcon.onclick = this.moveLeft;
            this.SVGLeftIcon.hide();
            this.SVGRightIcon = new SVGIcon(this.svgElement, rightIcon, this.width - this.rowSize, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
            this.SVGRightIcon.fill = theme.light;
            this.SVGRightIcon.SVGIcon.widget = this;
            this.SVGRightIcon.SVGIcon.onclick = this.moveRight;
            this.SVGRightIcon.hide();

            this.SVGMinusIcon = new SVGIcon(this.svgElement, minusIcon, this.width / 2 - this.rowSize / 2, this.height - this.rowSize, this.rowSize, this.rowSize);
            this.SVGMinusIcon.fill = theme.light;
            this.SVGMinusIcon.SVGIcon.widget = this;
            this.SVGMinusIcon.SVGIcon.onclick = this.deleteWidgetClick;
            this.SVGMinusIcon.hide();

            this.SVGPropertiesIcon = new SVGIcon(this.svgElement, menuIcon, this.width / 2 - this.rowSize / 2, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
            this.SVGPropertiesIcon.fill = theme.light;
            this.SVGPropertiesIcon.SVGIcon.widget = this;
            this.SVGPropertiesIcon.SVGIcon.onclick = this.propertiesClick;
            this.SVGPropertiesIcon.hide();


            this.rPanel = this.parentPanel.appendChild(document.createElement("div"));
            this.rPanel.id = id + "BaseWidget";
            this.rPanel.widget = this;
            this.rPanel.className = "Widget";
            this.rPanel.style.cursor = "pointer";
            this.mouseEnter = false;
            this.rPanel.onmouseover = this.mouseOver;
            this.rPanel.onmouseout = this.mouseOut;
            this.rPanel.appendChild(this.svgElement);

            this.properties = defaultWidgetProperties();
            this.mode = WORK_MODE;
        }

        BaseWidget.prototype.addEventListner = function addEventListner(_event, _sender) {
            try {
                _event(_sender, this);
            } catch (exception) {
                return; // don't add bad listner
            }

            this.eventListners.push(event = {
                event: _event,
                sender: _sender
            });
        };

        BaseWidget.prototype.clickableToTop = function clickableToTop() {
            this.svgElement.insertBefore(this.SVGWidgetText.SVGText, this.svgElement.childNodes.lastChild);
            this.svgElement.insertBefore(this.SVGLeftIcon.SVGIcon, this.svgElement.childNodes.lastChild);
            this.svgElement.insertBefore(this.SVGRightIcon.SVGIcon, this.svgElement.childNodes.lastChild); // this.svgElement.insertBefore(this.SVGPlusIcon.SVGIcon, this.svgElement.childNodes.lastChild);
            this.svgElement.insertBefore(this.SVGMinusIcon.SVGIcon, this.svgElement.childNodes.lastChild);
            this.svgElement.insertBefore(this.SVGPropertiesIcon.SVGIcon, this.svgElement.childNodes.lastChild);
        };

        BaseWidget.prototype.showProperties = function showProperties(_event, _sender) {
            

            _sender.storedProperties = {}; 

            _sender.inParentIndex = Array.prototype.slice.call(_sender.parentPanel.childNodes).indexOf(_sender.rPanel);                        
            _sender.parentPanel.removeChild(_sender.rPanel);
            _sender.mode = WORK_MODE;

            makeModalDialog("resetPanel", "showProperties", getLang("showProperties"), "");
            var modalFooter = document.getElementById("showPropertiesModalFooter");
            var modalBody = document.getElementById("showPropertiesModalBody");

            modalBody.appendChild(_sender.rPanel);

            var formGroup = modalBody.appendChild(document.createElement("div"));
            formGroup.className = "form-group";

            
            

            for (var key in _sender.properties) {

                _sender.storedProperties[key] = {
                    name: _sender.properties[key].name,
                    value: _sender.properties[key].value,
                    type: _sender.properties[key].type                    
                }

                var label = formGroup.appendChild(document.createElement("label"));
                label.setAttribute("for", "hostEdit");
                label.innerText = _sender.properties[key].name;
                var propEdit = createValueEdit(formGroup, _sender.properties[key].name, _sender.properties[key].value, _sender.properties[key].type);
                propEdit.className = "form-control form-control-sm";
                propEdit.placeholder = "type value here";
                propEdit.id = "widgetproperty" + key;
                
                //propEdit.value = _sender.properties[key].value;
                propEdit.widgetProperty = _sender.properties[key];
                propEdit.widget = _sender;
                propEdit.originalOnChange = propEdit.onchange;
                propEdit.onchange = _sender.onPropertyChange;
            }

            var closeHeaderButton = document.getElementById("showPropertiescloseHeaderButton");
            closeHeaderButton.widget = _sender;
            closeHeaderButton.onclick = _sender.discardProperties;

            var closeButton = document.getElementById("showPropertiescloseButton");
            closeButton.widget = _sender;
            closeButton.onclick = _sender.discardProperties;


            var addNodeButton = modalFooter.appendChild(document.createElement("button"));
            addNodeButton.type = "button";
            addNodeButton.className = "btn btn-sm btn-success";
            addNodeButton.id = "addnodeModalButton";
            addNodeButton.widget = _sender;
            addNodeButton.onclick = _sender.setProperties;
            addNodeButton.innerText = getLang("addnodebutton");

            var addNodeError = formGroup.appendChild(document.createElement("label"));
            addNodeError.className = "text-danger";

            addNodeButton.propEdit = propEdit;

            addNodeButton.addNodeError = addNodeError;

            $("#showPropertiesModal").modal('show');

        };


        BaseWidget.prototype.setProperties = function setProperties(event) {
            var button = event.currentTarget;
            var widget = button.widget;

            widget.parentPanel.insertBefore(widget.rPanel, widget.parentPanel.childNodes[widget.inParentIndex]);
            widget.mode = MOVE_MODE;

            for (var key in widget.properties) {
                var propEdit = document.getElementById("widgetproperty" + key);
                widget.properties[key].value = propEdit.value;
            }

            widget.properties = widget.properties;

            config.save();

            $("#showPropertiesModal").modal('hide');
            return false;
        };

        BaseWidget.prototype.discardProperties = function discardtProperties(event) {
            var button = event.currentTarget;
            var widget = button.widget;

            widget.parentPanel.insertBefore(widget.rPanel, widget.parentPanel.childNodes[widget.inParentIndex]);
            widget.mode = MOVE_MODE;
            widget.properties = widget.storedProperties;

            //$("#showPropertiesModal").modal('hide');
            return false;
        };


        BaseWidget.prototype.onPropertyChange = function onPropertyChange(event) {

            var propEdit = event.currentTarget;
            var widget = propEdit.widget;

            for (var key in widget.properties) {
                var _propEdit = document.getElementById("widgetproperty" + key);
                widget.properties[key].value = _propEdit.value;
            }

            widget.properties = widget.properties;

            if (propEdit.originalOnChange != undefined) {
                propEdit.originalOnChange(event);
            }

            return false;

        };

        

        BaseWidget.prototype.moveLeft = function moveLeft(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                var index = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.rPanel);
                widget.parentPanel.removeChild(widget.rPanel);
                widget.parentPanel.insertBefore(widget.rPanel, widget.parentPanel.childNodes[index - 1]);
            }

            return true;
        };

        BaseWidget.prototype.moveRight = function moveRight(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                var index = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.rPanel);
                widget.parentPanel.removeChild(widget.rPanel);
                widget.parentPanel.insertBefore(widget.rPanel, widget.parentPanel.childNodes[index + 1]);
            }

            return true;
        };

        BaseWidget.prototype.propertiesClick = function movepropertiesClick(event) {
            event.stopPropagation();
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                widget.showProperties(event, widget);
            }

            return true;
        };


        BaseWidget.prototype.plusSize = function plusSize(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                widget.svgElement.setAttributeNS(null, "width", widget.width += 25);
                widget.svgElement.setAttributeNS(null, "height", widget.height += 25);
            }

            return true;
        } //TEMP: NOW IS USED AS DELETE BUTTON !
            ;

        BaseWidget.prototype.deleteWidgetClick = function deleteWidgetClick(event) {
            var widget = event.currentTarget.widget;
            if (widget.mode == MOVE_MODE) {
                widget._event = EVENT_DELETE;
                Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.rPanel);
                widget.parentPanel.removeChild(widget.rPanel);
                widget.rPanel.innerHTML = "";
            }
            return true;
        };

        BaseWidget.prototype.modeChangeClick = function modeChangeClick(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == WORK_MODE) {
                widget.mode = MOVE_MODE;
            } else {
                widget.mode = WORK_MODE;
            }

            return true;
        };

        BaseWidget.prototype.mouseOver = function mouseOver(event) {
            var widget = event.currentTarget.widget;
            widget.mouseEnter = true;
            widget.drawMouseEnter();
            return true;
        };

        BaseWidget.prototype.mouseOut = function mouseOut(event) {
            var widget = event.currentTarget.widget;
            widget.mouseEnter = false;
            widget.drawMouseEnter();
            return true;
        };

        BaseWidget.prototype.refresh = function refresh(data, widgetText, label, historyData) {
            if (this._event == EVENT_DELETE) {
                return;
            }

            if (this._data == data && this.widgetText == widgetText && this._properties.headertext == label) return;

            if (this._properties.headertext.value === '---') {
                this._properties.headertext.value = label;
            }


            if (this.widgetText != widgetText) {
                speak(this._properties.headertext + " " + widgetText);
            }

            
            this.historyData = historyData;
            this._data = data;
            this.widgetText = widgetText;
            
            this.spinnerAngle = 0;
            this.redrawAll();
        };

        //---------------------------------------------------------------------------------------
        BaseWidget.prototype.redrawAll = function redrawAll() {

            if (this._event == EVENT_DELETE) {
                return;
            }
            var _this = this;
            this.starttime = 0;
            requestAnimationFrame(function () {
                return _this.drawWidget();
            });
            this.drawText();
        };

        BaseWidget.prototype.drawText = function drawText() {
            if (this._event == EVENT_DELETE) {
                return;
            }

            //Widget text         
            this.SVGWidgetText.text = this.widgetText;

            if (this.SVGWidgetText.width != 0) {
                this.SVGWidgetText.x = this.centreX - this.SVGWidgetText.width / 2;
                this.SVGWidgetText.y = this.centreY + this.SVGWidgetText.height / 2;
            }

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.SVGWidgetText, theme.light);
                    break;

                case NET_ERROR:
                    this.toColor(this.SVGWidgetText, theme.danger);
                    break;

                case NET_RECONNECT:
                    this.toColor(this.SVGWidgetText, theme.info);
                    break;

                default:
                    //offline
                    this.toColor(this.SVGWidgetText, theme.secondary);
                    break;
            } //Label 


            this.SVGLabel.text = this._properties.headertext.value;
            if (this.SVGLabel.width > this.size) {
                var coef = this.SVGLabel.width / (this._properties.headertext.value.length + 3);
                var charCount = (this.size - this.size / 3) / coef;
                this.SVGLabel.text = this._properties.headertext.value.slice(0, parseInt(charCount)) + "...";

            }

            if (this.SVGLabel.width != 0) {
                this.SVGLabel.x = this.centreX - this.SVGLabel.width / 2;
                this.SVGLabel.y = this.SVGLabel.height;
            }

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.SVGLabel, theme.light);
                    break;

                case NET_ERROR:
                    this.toColor(this.SVGLabel, theme.danger);
                    break;

                case NET_RECONNECT:
                    this.toColor(this.SVGLabel, theme.info);
                    break;

                default:
                    //offline
                    this.toColor(this.SVGLabel, theme.secondary);
                    break;
            } //Hint


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

                default:
                    //offline
                    this.SVGHint.text = getLang("rid_offline");
                    this.toColor(this.SVGHint, theme.secondary);
                    break;
            }

            if (this.SVGHint != 0) {
                this.SVGHint.x = this.centreX - this.SVGHint.width / 2;
                this.SVGHint.y = this.height - this.SVGHint.height / 2;
            }
        } //method true is color, false is fill
            ;

        BaseWidget.prototype.toColor = function toColor(element, color, method) {
            if (this._event == EVENT_DELETE) {
                return;
            }

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
        };

        BaseWidget.prototype.animateColor = function animateColor(element, color, method) {
            var _this2 = this;

            if (!element.animantion) return;
            var rgbSrc = element.colorRGB;
            var rgbDst = colorToRGB(color);

            if (rgbSrc[0] == rgbDst[0] && rgbSrc[1] == rgbDst[1] && rgbSrc[2] == rgbDst[2]) {
                window.cancelAnimationFrame(element.animantionFrame);
                element.animantion = false;
                return;
            }

            if (rgbSrc[0] != rgbDst[0]) if (rgbSrc[0] < rgbDst[0]) rgbSrc[0]++; else rgbSrc[0]--;
            if (rgbSrc[1] != rgbDst[1]) if (rgbSrc[1] < rgbDst[1]) rgbSrc[1]++; else rgbSrc[1]--;
            if (rgbSrc[2] != rgbDst[2]) if (rgbSrc[2] < rgbDst[2]) rgbSrc[2]++; else rgbSrc[2]--;
            element.colorRGB = rgbSrc;

            if (!method) {
                element.fillRGB = rgbSrc;
            }

            if (element.animantion) {
                element.animantionFrame = window.requestAnimationFrame(function () {
                    return _this2.animateColor(element, color, method);
                });
            }
        };

        BaseWidget.prototype.drawWidget = function drawWidget() {
            if (this._event == EVENT_DELETE) {
                return;
            }

            this.SVGBackpanel.color = this._properties.backgroundcolor.value;
            this.SVGBackpanel.fill = this._properties.backgroundcolor.value;
            this.SVGBackpanel.opacity = this._properties.backgroundopacity.value;

            this.SVGBoxBackpanel.opacity = this._properties.headeropacity.value;
            this.SVGBoxBackpanel.fill = this._properties.headercolor.value;


            var oneHangPercent = 360 + 90 + 30 - 240;
            var drawPercent = this._data * (oneHangPercent / 100); //backdown panel

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
                case NET_ONLINE:
                    //this.toColor(this.SVGBackdownpanel, theme.success);
                    this.SVGBackdownpanel.fill = theme.success;
                    break;

                case NET_ERROR:
                    //this.toColor(this.SVGBackdownpanel, theme.danger);
                    this.SVGBackdownpanel.fill = theme.danger;
                    break;

                case NET_RECONNECT:
                    //this.toColor(this.SVGBackdownpanel, theme.info);
                    this.SVGBackdownpanel.fill = theme.info;
                    break;

                default:
                    //offline
                    //this.toColor(this.SVGBackdownpanel, theme.light);
                    this.SVGBackdownpanel.fill = theme.light;
                    break;
            } //equalizer --------------------------


            if (this._properties.showequalizer.value === 'true') {
                for (var x = 0; x < this.eCount; x++) {
                    var equalizerY = this.equalizerX[x];

                    for (var y = 0; y < 5; y++) {
                        if (this._networkStatus == NET_ONLINE && (this._properties.showequalizer.value === 'true')) {
                            equalizerY[y].opacity = (y + 1) * 0.08;
                        } else {
                            equalizerY[y].opacity = 0.0;
                        }

                        equalizerY[y].fill = theme.secondary;
                    }
                }

                if (this._networkStatus == NET_ONLINE && (this._properties.showequalizer.value === 'true')) {
                    if (this.historyData != undefined) {
                        //reset 
                        var splitHistory = this.historyData.split(";");
                        var count = splitHistory[0];
                        var prop = count / this.eCount;
                        var bigValue;

                        for (var x = 0; x < count; x++) {
                            var equalizerY = this.equalizerX[parseInt(x / prop)];
                            var value = splitHistory[x + 1];

                            if (bigValue == undefined || value > bigValue) {
                                bigValue = value;
                            }
                        }

                        var propValue = parseFloat(bigValue / 5);

                        for (var x = 0; x < count; x++) {
                            if (count < this.eCount) {
                                var equalizerY = this.equalizerX[x];
                            } else {
                                var equalizerY = this.equalizerX[parseInt(x / prop)];
                            }

                            var value = parseInt(splitHistory[x + 1] / propValue);

                            for (var y = 0; y < value; y++) {
                                equalizerY[4 - y].opacity = (1.0 - parseFloat(y / 4.0)) / 2.0;
                                equalizerY[4 - y].fill = theme.success;
                            }
                        }
                    }
                }
            }
            else { //no equalizer
                for (var x = 0; x < this.eCount; x++) {
                    var equalizerY = this.equalizerX[x];
                    for (var y = 0; y < 5; y++) {
                            equalizerY[y].opacity = 0.0;

                    }
                }

            }


            if (this._networkStatus == NET_RECONNECT) {
                this.spinnerAngle += 1.5;

                if (this.SVGArcSpinner.opacity < 0.8) {
                    this.SVGArcSpinner.opacity += 0.01;
                }

                this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
                var _this = this;
                requestAnimationFrame(function () {
                    return _this.drawWidget();
                });
            } else {
                this.SVGArcSpinner.opacity = 0.0;
                this.SVGArcSpinner.hide();
            }
        };

        BaseWidget.prototype.drawMouseEnter = function drawMouseEnter() {
            if (this._mode != WORK_MODE) return;
            var _this = this;

            if (this.mouseEnter) {
                if (this.SVGBackpanel.opacity < this._properties.backgroundselectopacity.value) {
                    this.SVGBackpanel.opacity += 0.005;
                    requestAnimationFrame(function () {
                        return _this.drawMouseEnter();
                    });
                }
            } else {
                if (this.SVGBackpanel.opacity > this._properties.backgroundopacity.value) {
                    this.SVGBackpanel.opacity -= 0.005;
                    requestAnimationFrame(function () {
                        return _this.drawMouseEnter();
                    });
                }
            }
        };

        _createClass(BaseWidget, [{
            key: "event",
            set: function set(event) {
                this._event = event;

                for (var k = 0; k < this.eventListners.length; k++) {
                    this.eventListners[k].event(this.eventListners[k].sender, this);
                }
            },
            get: function get() {
                return this._event;
            }
        }, {
            key: "mode",
            set: function set(mode) {
                this._mode = mode;

                if (mode == WORK_MODE) {
                    this.SVGBackpanel.opacity = this._properties.backgroundopacity.value;
                    this.SVGLeftIcon.hide();
                    this.SVGRightIcon.hide(); //  this.SVGPlusIcon.hide();

                    this.SVGMinusIcon.hide();
                    this.SVGPropertiesIcon.hide();

                } else if (mode == MOVE_MODE) {
                    this.SVGBackpanel.opacity = this._properties.backgroundopacity.value * 3;
                    this.SVGLeftIcon.draw();
                    this.SVGRightIcon.draw(); //   this.SVGPlusIcon.draw();

                    this.SVGMinusIcon.draw();
                    this.SVGPropertiesIcon.draw();
                }
            },
            get: function get() {
                return this._mode;
            }
        }, {
            key: "networkStatus",
            get: function get() {
                return this._networkStatus;
            },
            set: function set(networkStatus) {
                if (networkStatus >= NET_OFFLINE && networkStatus <= NET_RECONNECT) {
                    this._networkStatus = networkStatus;
                    this.redrawAll();
                }
            }
        },

        {
            key: "properties",
            get: function get() {
                return this._properties;
            },
            set: function set(properties) {
                this._properties = properties;
                this.drawText();
                this.drawWidget();
            }
        },
        {
            key: "data",
            get: function get() {
                return this._data;
            },
            set: function set(data) {
                this._data = _data;
                this.redrawAll();
            }
        }]);

        return BaseWidget;
    }();