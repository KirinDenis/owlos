var SmokeWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(SmokeWidget, _BaseWidget);

        function SmokeWidget(parentPanel, id, size) {

            return _BaseWidget.call(this, parentPanel, id, size) || this;          
        }

        SmokeWidget.prototype.onrPanelLoad = function onrPanelLoad(event) {
            _BaseWidget.prototype.onrPanelLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 30;
            widget.topMargin = widget.centreY + widget.size / 15;
            widget.animated = false;
            widget.levelRectWidth = widget.size / 15;
            widget.levelRectHeight = widget.size / 100;
            widget.levelLeft = widget.width - widget.levelRectWidth + widget.halfPanding;
            widget.levelTop = (widget.height - widget.levelRectHeight * 60 / 2) / 3;
            widget.level1 = [];
            widget.level2 = [];

            for (var i = 0; i < 10; i++) {
                widget.SVGLevelRect1 = new SVGRect(widget.svgElement, widget.id + "levelrect1" + i, widget.levelLeft, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect2 = new SVGRect(widget.svgElement, widget.id + "levelrect2" + i, widget.panding, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect1.opacity = widget.SVGLevelRect2.opacity = i / 30;
                widget.SVGLevelRect1.fill = widget.SVGLevelRect2.fill = theme.danger;

                widget.level1.push(widget.SVGLevelRect1);

                widget.level2.push(widget.SVGLevelRect2);
            }

            for (var i = 10; i < 20; i++) {
                widget.SVGLevelRect1 = new SVGRect(widget.svgElement, widget.id + "levelrect" + i, widget.levelLeft, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect2 = new SVGRect(widget.svgElement, widget.id + "levelrect2" + i, widget.panding, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect1.opacity = widget.SVGLevelRect2.opacity = i / 30;
                widget.SVGLevelRect1.fill = widget.SVGLevelRect2.fill = theme.warning;

                widget.level1.push(widget.SVGLevelRect1);

                widget.level2.push(widget.SVGLevelRect2);
            }

            for (var i = 20; i < 30; i++) {
                widget.SVGLevelRect1 = new SVGRect(widget.svgElement, widget.id + "levelrect" + i, widget.levelLeft, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect2 = new SVGRect(widget.svgElement, widget.id + "levelrect2" + i, widget.panding, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect1.opacity = widget.SVGLevelRect2.opacity = i / 30;
                widget.SVGLevelRect1.fill = widget.SVGLevelRect2.fill = theme.success;

                widget.level1.push(widget.SVGLevelRect1);

                widget.level2.push(widget.SVGLevelRect2);
            }

            widget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(widget.svgElement, widget.id + "arcback1" + i, widget.centreX, widget.levelTop, i * widget.radius, widget.size / 34);
                SVGlevelArc.index = i;
                SVGlevelArc.fill = theme.danger;

                widget.levelArc.push(SVGlevelArc);
            }

            widget.SVGArcSpinner.y = widget.topMargin;

            widget.clickableToTop();

            widget.proprties = widget._properties;

            if (widget.onload != undefined) {
                widget.onload(widget);
            }
        };
        
        SmokeWidget.prototype.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        SmokeWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        SmokeWidget.prototype.animate = function animate() {
            var baseWidget2 = this;

            if (this.animated) {
                for (var i = 0; i < 4; i++) {
                    this.levelArc[i].radius += 1.5;
                    this.levelArc[i].opacity -= 0.01;

                    if (this.levelArc[i].radius > this.radius * 15) {
                        this.levelArc[i].radius = this.radius;
                        this.levelArc[i].opacity = 0.9;
                    }

                    this.levelArc[i].draw(90 + 60, 270 - 60);
                }

                requestAnimationFrame(function () {
                    return baseWidget2.animate();
                });
            }
        };

        SmokeWidget.prototype.drawWidget = function drawWidget() {
            var baseWidget3 = this;
            if (this.level1 == undefined) return;
            _BaseWidget.prototype.drawWidget.call(this);

            for (var i = 0; i < 30; i++) {
                this.level1[i].opacity = this.level2[i].opacity = 0.0;
            }

            var position = 30 / 100 * this._data;

            if (position > 30) {
                position = 30;
            }

            for (var i = 29; i > 30 - position; i--) {
                this.level1[i].opacity = this.level2[i].opacity = 1.2 - i / 30;
            }

            if (this._networkStatus == NET_ONLINE && this._data > 60) {
                if (!this.animated) {
                    this.animated = true;
                    requestAnimationFrame(function () {
                        return baseWidget3.animate();
                    });
                }
            } else {
                this.animated = false;

                for (var i = 0; i < 4; i++) {
                    this.levelArc[i].hide();
                }
            }
        };

        return SmokeWidget;
    }(BaseWidget);