var DEFAULT_TYPE = 0;
var ICONS_TYPE = 1;

var ActuatorWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ActuatorWidget, _BaseWidget);

        function ActuatorWidget(parentPanel, id, size, iconOn, iconOff) {
            var _baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            _baseWidget.iconOn = iconOn;
            _baseWidget.iconOff = iconOff;
            return _baseWidget;
        }

        ActuatorWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            if (widget.iconOn == undefined && widget.iconOff == undefined) {
                widget.widgetType = DEFAULT_TYPE;
                widget.SVGArcBack = new SVGArc(widget.SVGViewBox, widget.id + "arcback", widget.centreX, widget.centreY + widget.topMargin, widget.radius + widget.size / 20, widget.size / 100);
                widget.SVGArcBack.color = theme.secondary;
                widget.SVGArcWidget = new SVGArc(widget.SVGViewBox, widget.id + "arcwidget", widget.centreX, widget.centreY + widget.topMargin, widget.radius, widget.size / 14);
                widget.SVGArcWidget.color = theme.secondary;
                widget.SVGArcWidget.fill = theme.secondary;
            } else {
                widget.widgetType = ICONS_TYPE;
                widget.rowSize = widget.size / 2.5;                
                widget.SVGIconOn = new SVGIcon(widget.SVGViewBox, widget.iconOn, widget.width / 2 - widget.rowSize / 2, widget.height / 2 - widget.rowSize / 2, widget.rowSize, widget.rowSize);
                widget.SVGIconOn.fill = theme.success;
                widget.SVGIconOn.SVGIcon.widget = _assertThisInitialized(widget);
                widget.SVGIconOn.hide();

                
                widget.SVGIconOff = new SVGIcon(widget.SVGViewBox, widget.iconOff, widget.width / 2 - widget.rowSize / 2, widget.height / 2 - widget.rowSize / 2, widget.rowSize, widget.rowSize);
                widget.SVGIconOff.fill = theme.success;
                widget.SVGIconOff.SVGIcon.widget = _assertThisInitialized(widget);

                widget.SVGIconOff.hide();

                widget.SVGArcSpinner.y = widget.centreY;
            }

            widget.SVGWidgetText.hide();

            widget.ShowEqualizer = false;

            widget.clickableToTop();

            widget.proprties = widget._properties;

            if (widget.onload != undefined) {
                widget.onload(widget);
            }

        }



        ActuatorWidget.prototype.drawWidget = function drawWidget() {
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