var ValueWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ValueWidget, _BaseWidget);

        function ValueWidget(parentPanel, id, size) {
            var baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            baseWidget.radius = baseWidget.size / 3;
            baseWidget.topMargin = baseWidget.centreY + baseWidget.size / 10;
            baseWidget.clickableToTop();

            baseWidget._properties.textfontsize =
                {
                    name: "Value text size",
                    value: 1.0,
                    type: "f"
                };

            baseWidget.properties = baseWidget._properties;

            return baseWidget;
        }

        var _proto = ValueWidget.prototype;


        _proto.drawText = function drawText() {
            if (this.properties.textfontsize !== undefined) {
                this.SVGWidgetText.size = this.properties.textfontsize.value;
            }
            _BaseWidget.prototype.drawText.call(this);
            this.SVGWidgetText.color = theme.danger;
            
        };


        _proto.drawWidget = function drawWidget() {
        
            _BaseWidget.prototype.drawWidget.call(this);
        };

        return ValueWidget;
    }(BaseWidget);