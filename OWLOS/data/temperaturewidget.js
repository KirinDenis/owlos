var TemperatureWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(TemperatureWidget, _BaseWidget);

        function TemperatureWidget(parentPanel, id, size) {
            
            var baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            baseWidget.tempWidth = (baseWidget.width - baseWidget.panding * 2) / 20;
            baseWidget.tempHeight = baseWidget.height / 15;
            baseWidget.tempTop = baseWidget.height / 4.5 - baseWidget.tempHeight / 2;
            baseWidget.tempItem = [];

            this.SVGWidgetExtText = new SVGText(baseWidget.svgElement, this.id + "widgetexttext", this.size / 160);            
            this.SVGWidgetExtText.color = theme.secondary;


            for (var i = 0; i < 20; i++) {
                var svgRect = new SVGRect(baseWidget.svgElement, baseWidget.id + "tempItem" + i, baseWidget.panding + baseWidget.tempWidth * i, baseWidget.tempTop, baseWidget.tempWidth-2, baseWidget.tempHeight);
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

                baseWidget.tempItem.push(svgRect);
            }

            baseWidget.tempIndexWidth = (baseWidget.width - baseWidget.panding * 3) / 80;
            baseWidget.tempIndexHeight = baseWidget.height / 7;
            baseWidget.tempIndexTop = baseWidget.height / 3.5 - baseWidget.tempIndexHeight / 2;


            baseWidget.clickableToTop();

            return baseWidget;
        }

        TemperatureWidget.prototype.drawText = function drawText() {
            var baseWidget = _BaseWidget.prototype;

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