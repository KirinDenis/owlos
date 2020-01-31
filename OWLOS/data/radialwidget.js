﻿var RadialWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(RadialWidget, _BaseWidget);

        function RadialWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        RadialWidget.prototype.onrPanelLoad = function onrPanelLoad(event) {
            _BaseWidget.prototype.onrPanelLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget._properties.linewidth =
                {
                    name: "line width",
                    value: 10,
                    type: "i"
                };


            widget._properties.rangetype =
                {
                    name: "range type percent",
                    value: 'true',
                    type: "b"
                };


            widget._properties.min =
                {
                    name: "min",
                    value: 0,
                    type: "f"
                };

            widget._properties.max =
                {
                    name: "max",
                    value: 100,
                    type: "f"
                };

            widget._properties.percentbackgroundcolor =
              {
                name: "percent bacground color",
                value: theme.secondary,
                type: "c"
                };

            widget._properties.percentbackgroundopacity =
                {
                name: "percent bacground opacity",
                    value: 0.5,
                    type: "f"
                };


            widget._properties.percentcolor =
                {
                    name: "percent color",
                    value: theme.info,
                    type: "c"
                };


            widget.radius = widget.size / 3;
            widget.topMargin = widget.centreY + widget.size / 10;
            widget.SVGArcBack = new SVGArc(widget.svgElement, widget.id + "arcback", widget.centreX, widget.topMargin, widget.radius, widget._properties.linewidth);
            widget.SVGArcWidget = new SVGArc(widget.svgElement, widget.id + "arcwidget", widget.centreX, widget.topMargin, widget.radius, widget._properties.linewidth);            
            widget.SVGArcSpinner.y = widget.topMargin;


            widget.clickableToTop();


            widget.proprties = widget._properties;

            if (widget.onload != undefined) {
                widget.onload(widget);
            }

        }

        

        RadialWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            if (this.SVGArcBack == undefined) return;

            var _data = this.data;
            if (this._properties.rangetype.value !== 'true') { //когда randge
                var range = this._properties.max.value - this._properties.min.value;
                _data = this.data / (range / 100);
            }
            else {
                //TODO Error Write Ситуация когда проценты
                if ((_data > 100) || (_data < 0)) {
                    this.toColor(this.SVGArcWidget, theme.warning);
                }
            }

            var oneHangPercent = 360 + 90 + 30 - 240;
            var drawPercent = _data * (oneHangPercent / 100); //back radial widget

            this.SVGArcBack.linewidth = this._properties.linewidth.value;
            this.SVGArcWidget.linewidth = this._properties.linewidth.value;

            this.SVGArcBack.color = this._properties.percentbackgroundcolor.value;
            this.SVGArcBack.opacity = this._properties.percentbackgroundopacity.value;
            
            this.SVGArcBack.draw(240, 240 + oneHangPercent); //radial widget

            this.SVGArcWidget.draw(240, 240 + drawPercent);

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.SVGArcWidget, this._properties.percentcolor.value);
                    break;

                case NET_ERROR:
                    this.toColor(this.SVGArcWidget, theme.danger);
                    break;

                case NET_RECONNECT:
                    this.toColor(this.SVGArcWidget, theme.info);
                    break;

                default:
                    //offline
                    this.toColor(this.SVGArcWidget, theme.light);
                    break;
            }
        };

        return RadialWidget;
    }(BaseWidget);