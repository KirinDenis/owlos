var ValueWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ValueWidget, _BaseWidget);

        function ValueWidget(parentPanel, id, size) {
            var baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            baseWidget.radius = baseWidget.size / 3;
            baseWidget.topMargin = baseWidget.centreY + baseWidget.size / 10;
            baseWidget.clickableToTop();

            return baseWidget;
        }

        var _proto = ValueWidget.prototype;


        _proto.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
            this.SVGWidgetText.color = theme.danger;
        };


        _proto.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

        };

        return ValueWidget;
    }(BaseWidget);