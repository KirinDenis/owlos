function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var SmokeWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(SmokeWidget, _BaseWidget);

        function SmokeWidget(parentPanel, id, size) {

            var baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            baseWidget.radius = baseWidget.size / 30;
            baseWidget.topMargin = baseWidget.centreY + baseWidget.size / 15;
            baseWidget.animated = false;
            baseWidget.levelRectWidth = baseWidget.size / 15;
            baseWidget.levelRectHeight = baseWidget.size / 100;
            baseWidget.levelLeft = baseWidget.width - baseWidget.levelRectWidth + baseWidget.halfPanding;
            baseWidget.levelTop = (baseWidget.height - baseWidget.levelRectHeight * 60 / 2) / 3;
            baseWidget.level1 = [];
            baseWidget.level2 = [];

            for (var i = 0; i < 10; i++) {
                baseWidget.SVGLevelRect1 = new SVGRect(baseWidget.svgElement, baseWidget.id + "levelrect1" + i, baseWidget.levelLeft, baseWidget.levelTop + i * (baseWidget.levelRectHeight * 2), baseWidget.levelRectWidth, baseWidget.levelRectHeight);
                baseWidget.SVGLevelRect2 = new SVGRect(baseWidget.svgElement, baseWidget.id + "levelrect2" + i, baseWidget.panding, baseWidget.levelTop + i * (baseWidget.levelRectHeight * 2), baseWidget.levelRectWidth, baseWidget.levelRectHeight);
                baseWidget.SVGLevelRect1.opacity = baseWidget.SVGLevelRect2.opacity = i / 30;
                baseWidget.SVGLevelRect1.fill = baseWidget.SVGLevelRect2.fill = theme.danger;

                baseWidget.level1.push(baseWidget.SVGLevelRect1);

                baseWidget.level2.push(baseWidget.SVGLevelRect2);
            }

            for (var i = 10; i < 20; i++) {
                baseWidget.SVGLevelRect1 = new SVGRect(baseWidget.svgElement, baseWidget.id + "levelrect" + i, baseWidget.levelLeft, baseWidget.levelTop + i * (baseWidget.levelRectHeight * 2), baseWidget.levelRectWidth, baseWidget.levelRectHeight);
                baseWidget.SVGLevelRect2 = new SVGRect(baseWidget.svgElement, baseWidget.id + "levelrect2" + i, baseWidget.panding, baseWidget.levelTop + i * (baseWidget.levelRectHeight * 2), baseWidget.levelRectWidth, baseWidget.levelRectHeight);
                baseWidget.SVGLevelRect1.opacity = baseWidget.SVGLevelRect2.opacity = i / 30;
                baseWidget.SVGLevelRect1.fill = baseWidget.SVGLevelRect2.fill = theme.warning;

                baseWidget.level1.push(baseWidget.SVGLevelRect1);

                baseWidget.level2.push(baseWidget.SVGLevelRect2);
            }

            for (var i = 20; i < 30; i++) {
                baseWidget.SVGLevelRect1 = new SVGRect(baseWidget.svgElement, baseWidget.id + "levelrect" + i, baseWidget.levelLeft, baseWidget.levelTop + i * (baseWidget.levelRectHeight * 2), baseWidget.levelRectWidth, baseWidget.levelRectHeight);
                baseWidget.SVGLevelRect2 = new SVGRect(baseWidget.svgElement, baseWidget.id + "levelrect2" + i, baseWidget.panding, baseWidget.levelTop + i * (baseWidget.levelRectHeight * 2), baseWidget.levelRectWidth, baseWidget.levelRectHeight);
                baseWidget.SVGLevelRect1.opacity = baseWidget.SVGLevelRect2.opacity = i / 30;
                baseWidget.SVGLevelRect1.fill = baseWidget.SVGLevelRect2.fill = theme.success;

                baseWidget.level1.push(baseWidget.SVGLevelRect1);

                baseWidget.level2.push(baseWidget.SVGLevelRect2);
            }

            baseWidget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(baseWidget.svgElement, baseWidget.id + "arcback1" + i, baseWidget.centreX, baseWidget.levelTop, i * baseWidget.radius, baseWidget.size / 34);
                SVGlevelArc.index = i;
                SVGlevelArc.fill = theme.danger;

                baseWidget.levelArc.push(SVGlevelArc);
            }

            baseWidget.SVGArcSpinner.y = baseWidget.topMargin;

            baseWidget.clickableToTop();

            return baseWidget;
        }

        var _proto = SmokeWidget.prototype;

        _proto.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        _proto.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        _proto.animate = function animate() {
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

        _proto.drawWidget = function drawWidget() {
            var baseWidget3 = this;

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