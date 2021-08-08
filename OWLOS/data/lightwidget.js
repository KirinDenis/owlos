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

var LightWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LightWidget, _BaseWidget);

        function LightWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        LightWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 10;
            widget.topMargin = widget.height - widget.size / 6;
            widget.animated = false;
            widget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(widget.SVGViewBox, widget.id + "arcback1" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 14);
                SVGlevelArc.index = i;
                SVGlevelArc.opacity = i * 0.2;

                widget.levelArc.push(SVGlevelArc);
            }

            widget.SVGArcSpinner.y = widget.topMargin;
            widget.SVGArcSpinner.radius = widget.radius * 4.5;

            widget.clickableToTop();

            widget._properties.lightcolor =
                {
                    tab: "C",
                    value: theme.warning,
                    type: "c"
                };

            widget.properties = widget._properties;

            widget.doOnLoad();
        }

        LightWidget.prototype.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        LightWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
            if (this.SVGWidgetText == undefined) return;
            this.SVGWidgetText.y = this.size / 5 + this.SVGWidgetText.height / 2;

        };

        LightWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);
            if (this.levelArc == undefined) return;
            for (var i = 0; i < 4; i++) {
                this.levelArc[i].hide();


                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.levelArc[i], this.properties.lightcolor.value);
                        //  this.levelArc[i].opacity = 0.7;
                        break;

                    case NET_ERROR:
                        this.toColor(this.levelArc[i], theme.danger);
                        // this.levelArc[i].opacity = 0.4;
                        break;

                    case NET_RECONNECT:
                        this.toColor(this.levelArc[i], theme.info);
                        // this.levelArc[i].opacity = 0.4;
                        break;

                    default:
                        //offline
                        this.toColor(this.levelArc[i], theme.secondary);
                        // this.levelArc[i].opacity = 0.4;
                        break;
                }
            }
 
            
             
            if (this._data > 30) {
                this.levelArc[0].draw(270, 360 + 90);
            }

            if (this._data > 50) {
                this.levelArc[1].draw(270, 360 + 90);
            }

            if (this._data > 70) {
                this.levelArc[2].draw(270, 360 + 90);
            }

            if (this._data > 90) {
                this.levelArc[3].draw(270, 360 + 90);
            }
        };

        return LightWidget;
    }(BaseWidget);