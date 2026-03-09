/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var DEFAULT_MASK = 0;
var ICONS_MASK = 1;

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
                widget.widgetType = DEFAULT_MASK;
                widget.SVGArcBack = new SVGArc(widget.SVGViewBox, widget.id + "arcback", widget.centreX, widget.centreY + widget.topMargin, widget.radius + widget.size / 20, widget.size / 100);
                widget.SVGArcBack.color = theme.secondary;
                widget.SVGArcWidget = new SVGArc(widget.SVGViewBox, widget.id + "arcwidget", widget.centreX, widget.centreY + widget.topMargin, widget.radius, widget.size / 14);
                widget.SVGArcWidget.color = theme.secondary;
                widget.SVGArcWidget.fill = theme.secondary;
            } else {
                widget.widgetType = ICONS_MASK;
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
            widget.doOnLoad();
        }
        ActuatorWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            if (this.SVGArcBack == undefined) return;

            if (this.widgetType == DEFAULT_MASK) {
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