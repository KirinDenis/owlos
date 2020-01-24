var LightWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LightWidget, _BaseWidget);

        function LightWidget(parentPanel, id, size) {
            var baseWidget;

            baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            baseWidget.radius = baseWidget.size / 10;
            baseWidget.topMargin = baseWidget.height - baseWidget.size / 6;
            baseWidget.animated = false;
            baseWidget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(baseWidget.svgElement, baseWidget.id + "arcback1" + i, baseWidget.centreX, baseWidget.topMargin, i * baseWidget.radius, baseWidget.size / 14);
                SVGlevelArc.index = i;                
                SVGlevelArc.opacity = i * 0.2;

                baseWidget.levelArc.push(SVGlevelArc);
            }

            baseWidget.SVGArcSpinner.y = baseWidget.topMargin;
            baseWidget.SVGArcSpinner.radius = baseWidget.radius * 4.5;

            baseWidget.clickableToTop();

            baseWidget._properties.lightcolor =
                {
                    name: "light indicator color",
                    value: theme.warning,
                    type: "c"
                };



                
            baseWidget.properties = baseWidget._properties;

            return baseWidget;
        }

        var _proto = LightWidget.prototype;

        _proto.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        _proto.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);

            this.SVGWidgetText.y = this.size / 5 + this.SVGWidgetText.height / 2;
            ;
        };

        _proto.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);
            if (this.levelArc == undefined) return;
            this._data = 80;
            for (var i = 0; i < 4; i++) {
                this.levelArc[i].hide();
             

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.levelArc[i], this.properties.lightcolor.value);
                      //  this.levelArc[i].opacity = 0.7;
                        break;

                    case NET_ERROR:
                        this.toColor(this.levelArc[i], theme.danger);
                       // this.levelArc[i].opacity = 0.4;
                        break;

                    case NET_RECONNECT:
                        this.toColor(this.levelArc[i], theme.info);
                       // this.levelArc[i].opacity = 0.4;
                        break;

                    default:
                        //offline
                        this.toColor(this.levelArc[i], theme.secondary);
                       // this.levelArc[i].opacity = 0.4;
                        break;
                }
            }

            if (this._data > 30) {
                this.levelArc[0].draw(270, 360 + 90);
            }

            if (this._data > 50) {
                this.levelArc[1].draw(270, 360 + 90);
            }

            if (this._data > 70) {
                this.levelArc[2].draw(270, 360 + 90);
            }

            if (this._data > 90) {
                this.levelArc[3].draw(270, 360 + 90);
            }
        };

        return LightWidget;
    }(BaseWidget);