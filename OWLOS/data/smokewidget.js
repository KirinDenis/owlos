function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var SmokeWidget =
    /*#__PURE__*/
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(SmokeWidget, _BaseWidget);

        function SmokeWidget(parentPanel, id, size) {
            var _this;

            _this = _BaseWidget.call(this, parentPanel, id, size) || this;
            _this.radius = _this.size / 30;
            _this.topMargin = _this.centreY + _this.size / 15;
            _this.animated = false;
            _this.levelRectWidth = _this.size / 10;
            _this.levelRectHeight = _this.size / 100;
            _this.levelLeft = _this.width - _this.levelRectWidth - _this.halfPanding;
            _this.levelTop = (_this.height - _this.levelRectHeight * 60 / 2) / 3;
            _this.level1 = [];
            _this.level2 = [];

            for (var i = 0; i < 10; i++) {
                _this.SVGLevelRect1 = new SVGRect(_this.svgElement, _this.id + "levelrect1" + i, _this.levelLeft, _this.levelTop + i * (_this.levelRectHeight * 2), _this.levelRectWidth, _this.levelRectHeight);
                _this.SVGLevelRect2 = new SVGRect(_this.svgElement, _this.id + "levelrect2" + i, _this.panding, _this.levelTop + i * (_this.levelRectHeight * 2), _this.levelRectWidth, _this.levelRectHeight);
                _this.SVGLevelRect1.opacity = _this.SVGLevelRect2.opacity = i / 30;
                _this.SVGLevelRect1.color = _this.SVGLevelRect2.color = theme.danger;

                _this.level1.push(_this.SVGLevelRect1);

                _this.level2.push(_this.SVGLevelRect2);
            }

            for (var i = 10; i < 20; i++) {
                _this.SVGLevelRect1 = new SVGRect(_this.svgElement, _this.id + "levelrect" + i, _this.levelLeft, _this.levelTop + i * (_this.levelRectHeight * 2), _this.levelRectWidth, _this.levelRectHeight);
                _this.SVGLevelRect2 = new SVGRect(_this.svgElement, _this.id + "levelrect2" + i, _this.panding, _this.levelTop + i * (_this.levelRectHeight * 2), _this.levelRectWidth, _this.levelRectHeight);
                _this.SVGLevelRect1.opacity = _this.SVGLevelRect2.opacity = i / 30;
                _this.SVGLevelRect1.color = _this.SVGLevelRect2.color = theme.warning;

                _this.level1.push(_this.SVGLevelRect1);

                _this.level2.push(_this.SVGLevelRect2);
            }

            for (var i = 20; i < 30; i++) {
                _this.SVGLevelRect1 = new SVGRect(_this.svgElement, _this.id + "levelrect" + i, _this.levelLeft, _this.levelTop + i * (_this.levelRectHeight * 2), _this.levelRectWidth, _this.levelRectHeight);
                _this.SVGLevelRect2 = new SVGRect(_this.svgElement, _this.id + "levelrect2" + i, _this.panding, _this.levelTop + i * (_this.levelRectHeight * 2), _this.levelRectWidth, _this.levelRectHeight);
                _this.SVGLevelRect1.opacity = _this.SVGLevelRect2.opacity = i / 30;
                _this.SVGLevelRect1.color = _this.SVGLevelRect2.color = theme.success;

                _this.level1.push(_this.SVGLevelRect1);

                _this.level2.push(_this.SVGLevelRect2);
            }

            _this.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(_this.svgElement, _this.id + "arcback1" + i, _this.centreX, _this.levelTop, i * _this.radius, _this.size / 34);
                SVGlevelArc.index = i;
                SVGlevelArc.color = theme.danger;

                _this.levelArc.push(SVGlevelArc);
            }

            _this.SVGArcSpinner.y = _this.topMargin;

            _this.clickableToTop();

            return _this;
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
            var _this2 = this;

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
                    return _this2.animate();
                });
            }
        };

        _proto.drawWidget = function drawWidget() {
            var _this3 = this;

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
                        return _this3.animate();
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