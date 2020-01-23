function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RadialWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(RadialWidget, _BaseWidget);

        function RadialWidget(parentPanel, id, size) {
            var baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            baseWidget.radius = baseWidget.size / 3;
            baseWidget.topMargin = baseWidget.centreY + baseWidget.size / 10;
            baseWidget.SVGArcBack = new SVGArc(baseWidget.svgElement, baseWidget.id + "arcback", baseWidget.centreX, baseWidget.topMargin, baseWidget.radius, baseWidget.size / 14);
            baseWidget.SVGArcBack.color = theme.secondary;
            baseWidget.SVGArcBack.opacity = 0.5;
            baseWidget.SVGArcWidget = new SVGArc(baseWidget.svgElement, baseWidget.id + "arcwidget", baseWidget.centreX, baseWidget.topMargin, baseWidget.radius, baseWidget.size / 14);
            baseWidget.SVGArcWidget.color = theme.secondary;
            baseWidget.SVGArcSpinner.y = baseWidget.topMargin;

            baseWidget.clickableToTop();

            baseWidget.proprties = baseWidget._properties;

            return baseWidget;
        }

        var _proto = RadialWidget.prototype;

        _proto.drawWidget = function drawWidget() {
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