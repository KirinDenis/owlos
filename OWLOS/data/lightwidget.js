var LightWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LightWidget, _BaseWidget);

        function LightWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        LightWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 10;
            widget.topMargin = widget.height - widget.size / 6;
            widget.animated = false;
            widget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(widget.SVGViewBox, widget.id + "arcback1" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 14);
                SVGlevelArc.index = i;
                SVGlevelArc.opacity = i * 0.2;

                widget.levelArc.push(SVGlevelArc);
            }

            widget.SVGArcSpinner.y = widget.topMargin;
            widget.SVGArcSpinner.radius = widget.radius * 4.5;

            widget.clickableToTop();

            widget._properties.lightcolor =
                {
                    tab: "C",
                    value: theme.warning,
                    type: "c"
                };

            widget.properties = widget._properties;

            if (widget.onload != undefined) {
                widget.onload(widget);
            }

        }

        LightWidget.prototype.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        LightWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
            if (this.SVGWidgetText == undefined) return;
            this.SVGWidgetText.y = this.size / 5 + this.SVGWidgetText.height / 2;

        };

        LightWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);
            if (this.levelArc == undefined) return;
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