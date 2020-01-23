var DEFAULT_TYPE = 0;
var ICONS_TYPE = 1;

var ActuatorWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ActuatorWidget, _BaseWidget);

        function ActuatorWidget(parentPanel, id, size, iconOn, iconOff) {
            
            var baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;

            if (iconOn == undefined && iconOff == undefined) {
                baseWidget.widgetType = DEFAULT_TYPE;
                baseWidget.SVGArcBack = new SVGArc(baseWidget.svgElement, baseWidget.id + "arcback", baseWidget.centreX, baseWidget.centreY + baseWidget.topMargin, baseWidget.radius + baseWidget.size / 20, baseWidget.size / 100);
                baseWidget.SVGArcBack.color = theme.secondary;
                baseWidget.SVGArcWidget = new SVGArc(baseWidget.svgElement, baseWidget.id + "arcwidget", baseWidget.centreX, baseWidget.centreY + baseWidget.topMargin, baseWidget.radius, baseWidget.size / 14);
                baseWidget.SVGArcWidget.color = theme.secondary;
                baseWidget.SVGArcWidget.fill = theme.secondary;
            } else {
                baseWidget.widgetType = ICONS_TYPE;
                baseWidget.rowSize = baseWidget.size / 2.5;
                baseWidget.iconOn = iconOn;
                baseWidget.SVGIconOn = new SVGIcon(baseWidget.svgElement, baseWidget.iconOn, baseWidget.width / 2 - baseWidget.rowSize / 2, baseWidget.height / 2 - baseWidget.rowSize / 2, baseWidget.rowSize, baseWidget.rowSize);
                baseWidget.SVGIconOn.fill = theme.success;
                baseWidget.SVGIconOn.SVGIcon.widget = _assertThisInitialized(baseWidget);

                baseWidget.SVGIconOn.hide();

                baseWidget.iconOff = iconOff;
                baseWidget.SVGIconOff = new SVGIcon(baseWidget.svgElement, baseWidget.iconOff, baseWidget.width / 2 - baseWidget.rowSize / 2, baseWidget.height / 2 - baseWidget.rowSize / 2, baseWidget.rowSize, baseWidget.rowSize);
                baseWidget.SVGIconOff.fill = theme.success;
                baseWidget.SVGIconOff.SVGIcon.widget = _assertThisInitialized(baseWidget);

                baseWidget.SVGIconOff.hide();

                baseWidget.SVGArcSpinner.y = baseWidget.centreY;
            }

            baseWidget.SVGWidgetText.hide();

            baseWidget.ShowEqualizer = false;

            baseWidget.clickableToTop();

            baseWidget.proprties = baseWidget._properties;

            return baseWidget;
        }

        var _proto = ActuatorWidget.prototype;

        _proto.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            if (this.SVGArcBack == undefined) return;

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