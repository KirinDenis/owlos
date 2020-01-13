var DEFAULT_TYPE = 0;
var ICONS_TYPE = 1;

var ActuatorWidget =
    /*#__PURE__*/
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ActuatorWidget, _BaseWidget);

        function ActuatorWidget(parentPanel, id, size, iconOn, iconOff) {
            var _this;

            _this = _BaseWidget.call(this, parentPanel, id, size) || this;

            if (iconOn == undefined && iconOff == undefined) {
                _this.widgetType = DEFAULT_TYPE;
                _this.SVGArcBack = new SVGArc(_this.svgElement, _this.id + "arcback", _this.centreX, _this.centreY + _this.topMargin, _this.radius + _this.size / 20, _this.size / 100);
                _this.SVGArcBack.color = theme.secondary;
                _this.SVGArcWidget = new SVGArc(_this.svgElement, _this.id + "arcwidget", _this.centreX, _this.centreY + _this.topMargin, _this.radius, _this.size / 14);
                _this.SVGArcWidget.color = theme.secondary;
                _this.SVGArcWidget.fill = theme.secondary;
            } else {
                _this.widgetType = ICONS_TYPE;
                _this.rowSize = _this.size / 2.5;
                _this.iconOn = iconOn;
                _this.SVGIconOn = new SVGIcon(_this.svgElement, _this.iconOn, _this.width / 2 - _this.rowSize / 2, _this.height / 2 - _this.rowSize / 2, _this.rowSize, _this.rowSize);
                _this.SVGIconOn.fill = theme.success;
                _this.SVGIconOn.SVGIcon.widget = _assertThisInitialized(_this);

                _this.SVGIconOn.hide();

                _this.iconOff = iconOff;
                _this.SVGIconOff = new SVGIcon(_this.svgElement, _this.iconOff, _this.width / 2 - _this.rowSize / 2, _this.height / 2 - _this.rowSize / 2, _this.rowSize, _this.rowSize);
                _this.SVGIconOff.fill = theme.success;
                _this.SVGIconOff.SVGIcon.widget = _assertThisInitialized(_this);

                _this.SVGIconOff.hide();

                _this.SVGArcSpinner.y = _this.centreY;
            }

            _this.SVGWidgetText.hide();

            _this.ShowEqualizer = false;

            _this.clickableToTop();

            return _this;
        }

        var _proto = ActuatorWidget.prototype;

        _proto.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            if (this.widgetType == DEFAULT_TYPE) {
                //back radial widget
                this.SVGArcBack.draw(0, 359.99); //radial widget

                if (this.data != 0) {
                    this.SVGArcWidget.draw(0, 359.99);
                } else {
                    this.SVGArcWidget.hide();
                }

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.SVGArcBack, theme.success);
                        this.toColor(this.SVGArcWidget, theme.success, false);
                        break;

                    case NET_ERROR:
                        this.toColor(this.SVGArcBack, theme.danger);
                        this.toColor(this.SVGArcWidget, theme.danger, false);
                        break;

                    case NET_RECONNECT:
                        this.toColor(this.SVGArcBack, theme.info);
                        this.toColor(this.SVGArcWidget, theme.info, false);
                        break;

                    default:
                        //offline
                        this.toColor(this.SVGArcBack, theme.secondary);
                        this.toColor(this.SVGArcWidget, theme.secondary, false);
                        break;
                }
            } else {
                if (this.data != 0) {
                    this.SVGIconOn.draw();
                    this.SVGIconOff.hide();
                } else {
                    this.SVGIconOn.hide();
                    this.SVGIconOff.draw();
                }

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.SVGIconOn.fill = theme.success;
                        this.SVGIconOff.fill = theme.success;
                        break;

                    case NET_ERROR:
                        this.SVGIconOn.fill = theme.danger;
                        this.SVGIconOff.fill = theme.danger;
                        break;

                    case NET_RECONNECT:
                        this.SVGIconOn.fill = theme.info;
                        this.SVGIconOff.fill = theme.info;
                        break;

                    default:
                        //offline
                        this.SVGIconOn.fill = theme.secondary;
                        this.SVGIconOff.fill = theme.secondary;
                        break;
                }
            }
        };

        return ActuatorWidget;
    }(BaseWidget);