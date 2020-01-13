function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var MotionWidget =
    /*#__PURE__*/
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(MotionWidget, _BaseWidget);

        function MotionWidget(parentPanel, id, size) {
            var _this;

            _this = _BaseWidget.call(this, parentPanel, id, size) || this;
            _this.radius = _this.size / 30;
            _this.topMargin = _this.centreY + _this.size / 20;
            _this.animated = false;
            _this.radar1 = [];
            _this.radar2 = [];
            _this.radar3 = [];
            _this.radar4 = [];

            for (var i = 1; i < 5; i++) {
                var SVGRadarArc1 = new SVGArc(_this.svgElement, _this.id + "arcback1" + i, _this.centreX, _this.topMargin, i * _this.radius, _this.size / 34);
                var SVGRadarArc2 = new SVGArc(_this.svgElement, _this.id + "arcback2" + i, _this.centreX, _this.topMargin, i * _this.radius, _this.size / 34);
                var SVGRadarArc3 = new SVGArc(_this.svgElement, _this.id + "arcback3" + i, _this.centreX, _this.topMargin, i * _this.radius, _this.size / 34);
                var SVGRadarArc4 = new SVGArc(_this.svgElement, _this.id + "arcback4" + i, _this.centreX, _this.topMargin, i * _this.radius, _this.size / 34);
                SVGRadarArc1.index = SVGRadarArc2.index = SVGRadarArc3.index = SVGRadarArc4.index = i;
                SVGRadarArc1.color = SVGRadarArc2.color = SVGRadarArc3.color = SVGRadarArc4.color = theme.success;

                _this.radar1.push(SVGRadarArc1);

                _this.radar2.push(SVGRadarArc2);

                _this.radar3.push(SVGRadarArc3);

                _this.radar4.push(SVGRadarArc4);
            }

            _this.SVGArcSpinner.y = _this.topMargin;

            _this.clickableToTop();

            return _this;
        }

        var _proto = MotionWidget.prototype;

        _proto.refresh = function refresh(data, widgetText, label, historyData) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label, historyData);
        };

        _proto.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        _proto.animate = function animate() {
            var _this2 = this;

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
                    return _this2.animate();
                });
            }
        };

        _proto.drawWidget = function drawWidget() {
            var _this3 = this;

            _BaseWidget.prototype.drawWidget.call(this);

            if (this._networkStatus == NET_ONLINE && this._data == 1) {
                if (!this.animated) {
                    this.animated = true;
                    requestAnimationFrame(function () {
                        return _this3.animate();
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