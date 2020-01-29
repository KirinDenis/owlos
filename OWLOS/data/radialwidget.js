var RadialWidget =
    
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

            widget.radius = widget.size / 3;
            widget.topMargin = widget.centreY + widget.size / 10;
            widget.SVGArcBack = new SVGArc(widget.svgElement, widget.id + "arcback", widget.centreX, widget.topMargin, widget.radius, widget.size / 14);
            widget.SVGArcBack.color = theme.secondary;
            widget.SVGArcBack.opacity = 0.5;
            widget.SVGArcWidget = new SVGArc(widget.svgElement, widget.id + "arcwidget", widget.centreX, widget.topMargin, widget.radius, widget.size / 14);
            widget.SVGArcWidget.color = theme.secondary;
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

            var oneHangPercent = 360 + 90 + 30 - 240;
            var drawPercent = this.data * (oneHangPercent / 100); //back radial widget

            this.SVGArcBack.draw(240, 240 + oneHangPercent); //radial widget

            this.SVGArcWidget.draw(240, 240 + drawPercent);

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.SVGArcWidget, theme.success);
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