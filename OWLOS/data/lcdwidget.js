function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var LCDWidget =
    /*#__PURE__*/
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LCDWidget, _BaseWidget);

        function LCDWidget(parentPanel, id, size) {
            var _this;

            _this = _BaseWidget.call(this, parentPanel, id, size) || this;
            _this.topMargin = _this.size / 20; //this.panding = 5;

            _this.width = _this.size * 2;
            _this.height = _this.size - _this.panding;
            _this.centreX = _this.width / 2; //  this.centreY = this.height / 2;

            _this.widgetTextSize = _this.size / 110;

            _this.svgElement.setAttributeNS(null, "viewBox", _this.halfPanding + " " + _this.halfPanding + " " + _this.width + " " + _this.height);

            _this.svgElement.setAttributeNS(null, "width", _this.width);

            _this.SVGBackpanel.width = _this.width;
            _this.SVGBackpanel.height = _this.height;
            _this.SVGBackdownpanel.width = _this.width;
            _this.SVGWidgetText1 = new SVGText(_this.svgElement, _this.id + "widgettext1", _this.widgetTextSize);
            _this.SVGWidgetText1.fontFamily = "monospace";
            _this.SVGWidgetText2 = new SVGText(_this.svgElement, _this.id + "widgettext2", _this.widgetTextSize);
            _this.SVGWidgetText2.fontFamily = "monospace";
            _this.SVGWidgetText3 = new SVGText(_this.svgElement, _this.id + "widgettext3", _this.widgetTextSize);
            _this.SVGWidgetText3.fontFamily = "monospace";
            _this.SVGWidgetText4 = new SVGText(_this.svgElement, _this.id + "widgettext4", _this.widgetTextSize);
            _this.SVGWidgetText4.fontFamily = "monospace";
            _this.SVGWidgetText1.text = "1234567890ABCSDEFGHL"; //20 chars 

            _this.SVGLabel.text = "LCD";
            _this.textWidth = _this.SVGWidgetText1.width;
            _this.textHeight = _this.SVGWidgetText1.height;
            _this.widgetLeft = _this.centreX - _this.textWidth / 2;
            _this.widgetTop = _this.centreY + _this.SVGLabel.height - _this.textHeight * 4 / 2;
            _this.SVGWidgetBack = new SVGRect(_this.svgElement, _this.id + "widgetback", _this.widgetLeft - _this.panding, _this.widgetTop - parseFloat(_this.textHeight - _this.panding), _this.textWidth + _this.panding * 2, _this.textHeight * 4 + _this.panding);
            _this.SVGWidgetBack.opacity = 0.2;
            _this.SVGWidgetBack.color = theme.secondary;
            _this.SVGWidgetText1.text = "";
            _this.SVGLabel.text = "";

            _this.SVGWidgetText.hide();

            _this.SVGArcSpinner.x = _this.centreX;
            _this.rPanel.onclick = _this.showEditor; //Popup editor 

            _this.pre = _this.rPanel.appendChild(document.createElement('pre'));
            _this.pre.className = "LCDTextArea";
            _this.pre.style.display = 'none';
            _this.textarea = _this.pre.appendChild(document.createElement('textarea'));
            _this.textarea.className = "form-control text-white bg-primary";
            _this.textarea.id = "textarea" + _this.id;
            _this.textarea.rows = "4";
            _this.textarea.cols = "25";

            var elementHeight = _this.pre.getBoundingClientRect().height;

            _this.pre.style.marginTop = -(elementHeight / 2.0 + _this.size / 1.8) + "px";
            _this.btnGroup = _this.rPanel.appendChild(document.createElement("p"));
            _this.btnGroup.style.display = 'none';
            _this.btnGroup.className = "LCDButtons";
            _this.btnGroup.role = "group";
            _this.textElement = _this.btnGroup.appendChild(document.createElement('div'));
            _this.textElement.className = "text-white";
            _this.lcdButton = _this.btnGroup.appendChild(document.createElement('input'));
            _this.lcdButton.className = "btn btn-success text-white LCDButton";
            _this.lcdButton.id = _this.id + "lcdbutton";
            _this.lcdButton.type = "button";
            _this.lcdButton.edit = _this.textarea;
            _this.lcdButton.lcdid = _this.id;
            _this.lcdButton.widget = _assertThisInitialized(_this); // this.lcdButton.onclick = lcdButtonClick;

            _this.lcdButton.value = getLang("send");
            _this.lightButton = _this.btnGroup.appendChild(document.createElement('input'));
            _this.lightButton.className = "btn btn-info text-white LCDButton";
            _this.lightButton.id = _this.id + "clearbutton";
            _this.lightButton.type = "button";
            _this.lightButton.edit = _this.textarea;
            _this.lightButton.lcdid = _this.id;
            _this.lightButton.widget = _assertThisInitialized(_this); //  this.lightButton.onclick = lightButtonClick;

            _this.lightButton.value = getLang("shortlight");
            _this.ShowEqualizer = false;
            return _this;
        }

        var _proto = LCDWidget.prototype;

        _proto.refresh = function refresh(widgetText, label, light) {
            label = getLang(label);
            this.widgetText = widgetText;
            this.label = label;
            this.spinnerAngle = 0;

            if (light != undefined) {
                this.light = light;
            } else {
                this.light = 0;
            }

            this.redrawAll();
        };

        _proto.showEditor = function showEditor(event) {
            event.stopPropagation();
            var rPanel = event.currentTarget;
            var lcdWidget = rPanel.widget;

            if (!lcdWidget.pre.style.display.indexOf("block")!=-1) {
                lcdWidget.textarea.value = lcdWidget.widgetText;
                lcdWidget.pre.style.display = 'block';
                lcdWidget.btnGroup.style.display = 'block';
            } else {//TODO: direct click     
                //  lcdWidget.hideEditor(); 
            }

            return true;
        };

        _proto.hideEditor = function hideEditor() {
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
            ;

        _proto.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);

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

                default:
                    //offline
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
        };

        _proto.drawWidget = function drawWidget() {
            if (this.light == 1) {
                this.SVGWidgetBack.color = theme.info;
            } else {
                this.SVGWidgetBack.color = theme.secondary;
            }

            _BaseWidget.prototype.drawWidget.call(this);
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

        };

        return LCDWidget;
    }(BaseWidget);