function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var LightWidget =
    /*#__PURE__*/
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LightWidget, _BaseWidget);

        function LightWidget(parentPanel, id, size) {
            var _this;

            _this = _BaseWidget.call(this, parentPanel, id, size) || this;
            _this.radius = _this.size / 10;
            _this.topMargin = _this.height - _this.size / 6;
            _this.animated = false;
            _this.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(_this.svgElement, _this.id + "arcback1" + i, _this.centreX, _this.topMargin, i * _this.radius, _this.size / 14);
                SVGlevelArc.index = i;
                SVGlevelArc.color = theme.warning;
                SVGlevelArc.opacity = 0.7;

                _this.levelArc.push(SVGlevelArc);
            }

            _this.SVGArcSpinner.y = _this.topMargin;
            _this.SVGArcSpinner.radius = _this.radius * 4.5;

            _this.clickableToTop();

            return _this;
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

            for (var i = 0; i < 4; i++) {
                this.levelArc[i].hide();

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.levelArc[i], theme.warning);
                        this.levelArc[i].opacity = 0.7;
                        break;

                    case NET_ERROR:
                        this.toColor(this.levelArc[i], theme.danger);
                        this.levelArc[i].opacity = 0.4;
                        break;

                    case NET_RECONNECT:
                        this.toColor(this.levelArc[i], theme.info);
                        this.levelArc[i].opacity = 0.4;
                        break;

                    default:
                        //offline
                        this.toColor(this.levelArc[i], theme.secondary);
                        this.levelArc[i].opacity = 0.4;
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