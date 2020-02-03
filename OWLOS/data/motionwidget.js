var MotionWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(MotionWidget, _BaseWidget);

        function MotionWidget(parentPanel, id, size) {

            return _BaseWidget.call(this, parentPanel, id, size) || this;
            
        }

        MotionWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 30;
            widget.topMargin = widget.centreY + widget.size / 20;
            widget.animated = false;
            widget.radar1 = [];
            widget.radar2 = [];
            widget.radar3 = [];
            widget.radar4 = [];

            for (var i = 1; i < 5; i++) {
                var SVGRadarArc1 = new SVGArc(widget.SVGViewBox, widget.id + "arcback1" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                var SVGRadarArc2 = new SVGArc(widget.SVGViewBox, widget.id + "arcback2" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                var SVGRadarArc3 = new SVGArc(widget.SVGViewBox, widget.id + "arcback3" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                var SVGRadarArc4 = new SVGArc(widget.SVGViewBox, widget.id + "arcback4" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                SVGRadarArc1.index = SVGRadarArc2.index = SVGRadarArc3.index = SVGRadarArc4.index = i;
                SVGRadarArc1.color = SVGRadarArc2.color = SVGRadarArc3.color = SVGRadarArc4.color = theme.success;

                widget.radar1.push(SVGRadarArc1);

                widget.radar2.push(SVGRadarArc2);

                widget.radar3.push(SVGRadarArc3);

                widget.radar4.push(SVGRadarArc4);
            }

            widget.SVGArcSpinner.y = widget.topMargin;

            widget.clickableToTop();

            widget.proprties = widget._properties;

            if (widget.onload != undefined) {
                widget.onload(widget);
            }

        };

        MotionWidget.prototype.refresh = function refresh(data, widgetText, label, historyData) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label, historyData);
        };

        MotionWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        MotionWidget.prototype.animate = function animate() {
            var baseWidget2 = this;
            if (this.radar1 == undefined) return;
            if (this.animated) {
                for (var i = 0; i < 4; i++) {
                    this.radar1[i].radius += 0.5;
                    this.radar1[i].opacity -= 0.01;

                    if (this.radar1[i].radius > this.radius * 8) {
                        this.radar1[i].radius = this.radius;
                        this.radar1[i].opacity = 0.9;
                    }

                    this.radar1[i].draw(270 + 15, 350 - 15);
                    this.radar2[i].radius = this.radar3[i].radius = this.radar4[i].radius = this.radar1[i].radius;
                    this.radar2[i].opacity = this.radar3[i].opacity = this.radar4[i].opacity = this.radar1[i].opacity;
                    this.radar2[i].draw(15, 90 - 15);
                    this.radar3[i].draw(90 + 16, 180 - 15);
                    this.radar4[i].draw(180 + 15, 270 - 15);
                }

                requestAnimationFrame(function () {
                    return baseWidget2.animate();
                });
            }
        };

        MotionWidget.prototype.drawWidget = function drawWidget() {
            var baseWidget3 = this;

            _BaseWidget.prototype.drawWidget.call(this);
            if (this.radar1 == undefined) return;

            if (this._networkStatus == NET_ONLINE && this._data == 1) {
                if (!this.animated) {
                    this.animated = true;
                    requestAnimationFrame(function () {
                        return baseWidget3.animate();
                    });
                }
            } else {
                this.animated = false;

                for (var i = 0; i < 4; i++) {
                    this.radar1[i].hide();
                    this.radar2[i].hide();
                    this.radar3[i].hide();
                    this.radar4[i].hide();
                }
            }
        };

        return MotionWidget;
    }(BaseWidget);