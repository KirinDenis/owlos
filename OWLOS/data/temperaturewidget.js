function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

//0..100
//-50..50
var TemperatureWidget =
    /*#__PURE__*/
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(TemperatureWidget, _BaseWidget);

        function TemperatureWidget(parentPanel, id, size) {
            var _this;

            _this = _BaseWidget.call(this, parentPanel, id, size) || this;
            _this.tempWidth = (_this.width - _this.panding * 2) / 40;
            _this.tempHeight = _this.height / 10;
            _this.tempTop = _this.height / 1.5 - _this.tempHeight / 2;
            _this.tempItem = [];

            for (var i = 0; i < 20; i++) {
                var svgRect = new SVGRect(_this.svgElement, _this.id + "tempItem" + i, _this.panding + _this.tempWidth * 2 * i, _this.tempTop, _this.tempWidth, _this.tempHeight);
                if (i < 7) svgRect.color = theme.info; else if (i < 14) svgRect.color = theme.warning; else svgRect.color = theme.danger;
                svgRect.opacity = 0.0;

                _this.tempItem.push(svgRect);
            }

            _this.tempIndexWidth = (_this.width - _this.panding * 3) / 80;
            _this.tempIndexHeight = _this.height / 5;
            _this.tempIndexTop = _this.height / 1.5 - _this.tempIndexHeight / 2;
            _this.svgTempIndex = new SVGRect(_this.svgElement, _this.id + "tempIndex" + i, 0, _this.tempIndexTop, _this.tempIndexWidth, _this.tempIndexHeight);
            _this.svgTempIndex.opacity = 0.7;
            _this.svgTempIndex.color = theme.light;

            _this.clickableToTop();

            return _this;
        }

        var _proto = TemperatureWidget.prototype;

        _proto.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this, 0);

            this.SVGWidgetText.y = this.height / 2.5 + this.tempHeight / 2; // this.tempTop + this.panding * 3 +  this.SVGWidgetText.height;
        };

        _proto.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            var percent = parseFloat(this._data) + 50;
            var tempSize = 20 / 100 * percent;

            for (var i = 0; i < 20; i++) {
                this.tempItem[i].opacity = 0.0;
            }

            for (var i = 0; i < tempSize; i++) {
                this.tempItem[i].opacity = 1.0 - (1.0 - i / 20);
            }

            this.svgTempIndex.x = this.panding + tempSize * this.tempWidth * 2;
        };

        return TemperatureWidget;
    }(BaseWidget);