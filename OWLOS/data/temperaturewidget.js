var TemperatureWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(TemperatureWidget, _BaseWidget);

        function TemperatureWidget(parentPanel, id, size) {
            
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        TemperatureWidget.prototype.onrPanelLoad = function onrPanelLoad(event) {
            _BaseWidget.prototype.onrPanelLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.tempWidth = (widget.width - widget.panding * 2) / 20;
            widget.tempHeight = widget.height / 15;
            widget.tempTop = widget.height / 4.5 - widget.tempHeight / 2;
            widget.tempItem = [];

            widget.SVGWidgetExtText = new SVGText(widget.svgElement, this.id + "widgetexttext", this.size / 160);
            widget.SVGWidgetExtText.color = theme.secondary;


            for (var i = 0; i < 20; i++) {
                var svgRect = new SVGRect(widget.svgElement, widget.id + "tempItem" + i, widget.panding + widget.tempWidth * i, widget.tempTop, widget.tempWidth - 2, widget.tempHeight);
                if (i < 7) {
                    svgRect.fill = theme.info;

                }
                else {
                    if (i < 14) {
                        svgRect.fill = theme.warning;
                    }
                    else {
                        svgRect.fill = theme.danger;
                    }
                }

                svgRect.opacity = 0.0;

                widget.tempItem.push(svgRect);
            }

            widget.tempIndexWidth = (widget.width - widget.panding * 3) / 80;
            widget.tempIndexHeight = widget.height / 7;
            widget.tempIndexTop = widget.height / 3.5 - widget.tempIndexHeight / 2;


            widget.clickableToTop();

            widget.proprties = widget._properties;

            if (widget.onload != undefined) {
                widget.onload(widget);
            }


        }


        TemperatureWidget.prototype.drawText = function drawText() {
            var baseWidget = _BaseWidget.prototype;
            if (this.SVGWidgetExtText == undefined) return;

            var tempwidgetText = this.widgetText;
            this.widgetText = " C"; //two space width
            baseWidget.drawText.call(this, 0);
            var charW = this.SVGWidgetText.width;
            this.widgetText = tempwidgetText;

            this.SVGWidgetText.text = tempwidgetText + " C"; //ToDo F

            if (this.SVGWidgetText.width != 0) {
                this.SVGWidgetExtText.text = "o";
                this.SVGWidgetText.x = this.centreX - this.SVGWidgetText.width / 2;
                this.SVGWidgetText.y = this.centreY + this.SVGWidgetText.height / 2;
                this.SVGWidgetExtText.x = this.SVGWidgetText.x + this.SVGWidgetText.width - charW - this.SVGWidgetExtText.width / 2;
                this.SVGWidgetExtText.y = this.centreY + this.SVGWidgetExtText.height / 5;

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.SVGWidgetExtText, theme.light);
                        break;
                    case NET_ERROR:
                        this.toColor(this.SVGWidgetExtText, theme.danger);
                        break;
                    case NET_RECONNECT:
                        this.toColor(this.SVGWidgetExtText, theme.info);
                        break;
                    default:                        
                        this.toColor(this.SVGWidgetExtText, theme.secondary);
                        break;
                }
            }
                else {
                this.SVGWidgetExtText.text = "";
            }
          
        };

        TemperatureWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);
            if (this.tempItem == undefined) return;
            var percent = parseFloat(this._data) + 50;
            var tempSize = 20 / 100 * percent;

            for (var i = 0; i < 20; i++) {
                this.tempItem[i].opacity = 0.1;
            }

            for (var i = 0; i < tempSize; i++) {
                this.tempItem[i].opacity = 1.0 - (1.0 - i / 20);
            }

           // this.svgTempIndex.x = this.panding + tempSize * this.tempWidth * 2;
        };

        return TemperatureWidget;
    }(BaseWidget);