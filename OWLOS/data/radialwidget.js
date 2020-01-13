function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RadialWidget =
    /*#__PURE__*/
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(RadialWidget, _BaseWidget);

        function RadialWidget(parentPanel, id, size) {
            var _this;

            _this = _BaseWidget.call(this, parentPanel, id, size) || this;
            _this.radius = _this.size / 3;
            _this.topMargin = _this.centreY + _this.size / 15;
            _this.SVGArcBack = new SVGArc(_this.svgElement, _this.id + "arcback", _this.centreX, _this.topMargin, _this.radius, _this.size / 14);
            _this.SVGArcBack.color = theme.secondary;
            _this.SVGArcBack.opacity = 0.5;
            _this.SVGArcWidget = new SVGArc(_this.svgElement, _this.id + "arcwidget", _this.centreX, _this.topMargin, _this.radius, _this.size / 14);
            _this.SVGArcWidget.color = theme.secondary;
            _this.SVGArcSpinner.y = _this.topMargin;

            _this.clickableToTop();

            return _this;
        }

        var _proto = RadialWidget.prototype;

        _proto.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

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