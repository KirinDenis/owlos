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

var RadialWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(RadialWidget, _BaseWidget);

        function RadialWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        RadialWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget._properties.linewidth =
            {
                tab: "G",
                value: 10,
                type: "i"
            };

            widget._properties.rangetype =
            {
                tab: "G",
                value: 'true',
                type: "b"
            };

            widget._properties.min =
            {
                tab: "G",
                value: 0,
                type: "f"
            };

            widget._properties.max =
            {
                tab: "G",
                value: 100,
                type: "f"
            };

            widget._properties.percentbackgroundcolor =
            {
                tab: "C",
                value: theme.secondary,
                type: "c"
            };

            widget._properties.percentbackgroundopacity =
            {
                tab: "O",
                value: 0.5,
                type: "f"
            };

            widget._properties.percentcolor =
            {
                tab: "C",
                value: theme.success,
                type: "c"
            };

            widget.radius = widget.size / 3;
            widget.topMargin = widget.centreY + widget.size / 10;
            widget.SVGArcBack = new SVGArc(widget.SVGViewBox, widget.id + "arcback", widget.centreX, widget.topMargin, widget.radius, widget._properties.linewidth);
            widget.SVGArcWidget = new SVGArc(widget.SVGViewBox, widget.id + "arcwidget", widget.centreX, widget.topMargin, widget.radius, widget._properties.linewidth);
            widget.SVGArcSpinner.y = widget.topMargin;
            widget.clickableToTop();
            widget.proprties = widget._properties;
            widget.doOnLoad();
        }

        RadialWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            if (this.SVGArcBack == undefined) return;

            var _data = this.data;
            if (this._properties.rangetype.value !== 'true') { //когда randge
                var range = this._properties.max.value - this._properties.min.value;
                _data = this.data / (range / 100);
            }
            else {
                //TODO Error Write Ситуация когда проценты
                if ((_data > 100) || (_data < 0)) {
                    this.toColor(this.SVGArcWidget, theme.warning);
                }
            }

            var oneHangPercent = 360 + 90 + 30 - 240;
            var drawPercent = _data * (oneHangPercent / 100); //back radial widget

            this.SVGArcBack.linewidth = this._properties.linewidth.value;
            this.SVGArcWidget.linewidth = this._properties.linewidth.value;

            this.SVGArcBack.color = this._properties.percentbackgroundcolor.value;
            this.SVGArcBack.opacity = this._properties.percentbackgroundopacity.value;

            this.SVGArcBack.draw(240, 240 + oneHangPercent); //radial widget

            this.SVGArcWidget.draw(240, 240 + drawPercent);

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.SVGArcWidget, this._properties.percentcolor.value);
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