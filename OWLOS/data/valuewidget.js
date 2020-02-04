var ValueWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ValueWidget, _BaseWidget);

        function ValueWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        };

        ValueWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 3;
            widget.topMargin = widget.centreY + widget.size / 10;
            
            widget._properties.textfontsize =
                {
                    name: "Value text size",
                    value: 1.0,
                    type: "f"
                };

            widget.clickableToTop();
            widget.properties = widget._properties;
            widget.doOnLoad();

        };


        ValueWidget.prototype.drawText = function drawText() {
            if (this.SVGWidgetText == undefined) return;
            if (this.properties.textfontsize !== undefined) {
                this.SVGWidgetText.size = this.properties.textfontsize.value;
            }
            _BaseWidget.prototype.drawText.call(this);
            this.SVGWidgetText.color = theme.danger;
            
        };


        ValueWidget.prototype.drawWidget = function drawWidget() {
        
            _BaseWidget.prototype.drawWidget.call(this);
        };

        return ValueWidget;
    }(BaseWidget);