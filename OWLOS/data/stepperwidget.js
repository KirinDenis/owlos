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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StepperWidget =

    function () {
        "use strict";

        function StepperWidget(parentPanel, id, size) {
            this.parentPanel = parentPanel;
            this.id = id;
            this.size = size;
            this.networkStatus = NET_ONLINE;
            this.widgetWidht = this.size / 10;
            this.radius = this.size / 2 - this.widgetWidht;
            this.alphaValue = "80";
            this.widgetHolder = this.parentPanel.appendChild(document.createElement("div"));
            this.widgetHolder.id = id + "StepperWidget";
            this.widgetHolder.stepperWidget = this;
            this.widgetHolder.className = "ActuatorWidget";
            this.widgetHolder.style.cursor = "pointer";
            this.sPandingTop = this.size / 4;
            this.sPandingLeft = this.size / 7;
            this.sWidth = this.size - this.sPandingLeft * 2;
            this.sHeight = this.size - this.size / 10 - this.sPandingTop;
            this.userMovePosition = false;
            this.atProcess = false;
            this.positionChangeReciever = null;
            this.rCanvas = $("<canvas></canvas>").attr({
                width: size,
                height: size
            }).get(0), this.rContext = this.rCanvas.getContext("2d");

            var _rCanvas = $(this.widgetHolder).children("canvas");

            if (_rCanvas.length !== 0) {
                _rCanvas.replaceWith(this.rCanvas);
            } else {
                $(this.rCanvas).appendTo($(this.widgetHolder));
            }

            this.rCanvas.onmousemove = this.mousemove;
            this.rCanvas.stepperWidget = this;
        }

        var _proto = StepperWidget.prototype;

        _proto.mousemove = function mousemove(event) {
            event.stopPropagation();
            var stepperWidget = event.currentTarget.stepperWidget;

            if (stepperWidget.atProcess) {
                stepperWidget.atProcess = false;
                return true; //OR cancel operation todo 
            }

            if (event.buttons == 1) {
                if (event.offsetY > stepperWidget.sPandingTop && event.offsetY < stepperWidget.sPandingTop + stepperWidget.sHeight) {
                    var lenght = event.offsetY - stepperWidget.sPandingTop;
                    var toPercent = lenght / (stepperWidget.sHeight / 100);
                    stepperWidget.userMovePosition = true;
                    stepperWidget.refresh(stepperWidget.percent, toPercent, stepperWidget.widgetText, stepperWidget.text);
                    return true;
                }
            }

            if (stepperWidget.userMovePosition) {
                if (stepperWidget.positionChangeReciever != null) {
                    stepperWidget.userMovePosition = false;
                    stepperWidget.positionChangeReciever(stepperWidget.toPercent);
                }
            }

            stepperWidget.userMovePosition = false;
            stepperWidget.refresh(stepperWidget.percent, stepperWidget.toPercent, stepperWidget.widgetText, stepperWidget.text);
            return false;
        };

        _proto.refresh = function refresh(percent, toPercent, widgetText, text) {
            text = getLang(text); 

            this.percent = Math.round(percent);
            this.toPercent = Math.round(toPercent);
            this.widgetText = widgetText;
            this.text = text;
            this.spinnerAngle = 0;
            this.redrawAll();
        };

        //---------------------------------------------------------------------------------------
        _proto.redrawAll = function redrawAll() {
            var _this = this;

            this.starttime = 0;
            requestAnimationFrame(function () {
                return _this.drawWidget();
            });
            this.drawText();
        } //---------------------------------------------------------------------------------------
            //draw element text labels - percent value and text 
            ;

        _proto.drawText = function drawText() {
            //draw pervent text ----------
            var elementWidth = 0;
            var elementHeight = 0;
            //draw text label --------------

            if (this.textElement == null) {
                this.textElement = this.widgetHolder.appendChild(document.createElement("div"));
                this.textElement.firstTime = true;
            }

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.textElement.className = "ActuatorWidgetText text-white text-center";
                    break;

                case NET_ERROR:
                    this.textElement.className = "ActuatorWidgetText text-danger text-center";
                    break;

                case NET_RECONNECT:
                    this.textElement.className = "ActuatorWidgetText text-info text-center";
                    break;

                default:
                    //offline
                    this.textElement.className = "ActuatorWidgetText text-secondary text-center";
                    break;
            }

            if (this.textElement.firstTime) {
                this.textElement.innerHTML = "WWWWWW"; //8 chars

                elementWidth = this.textElement.getBoundingClientRect().width;

                if (elementWidth < this.size) {
                    this.textElement.style.fontSize = this.size / 2 / elementWidth + "rem";
                }
            }

            this.textElement.innerHTML = this.text;

            if (this.textElement.firstTime) {
                elementWidth = this.textElement.getBoundingClientRect().width;
                this.textElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";
                this.textElement.firstTime = false;
            } //draw hint --------------


            if (this.hintElement == null) {
                this.hintElement = this.widgetHolder.appendChild(document.createElement("div"));
                this.hintElement.firstTime = true;
            }

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.hintElement.className = "ActuatorWidgetHint text-secondary text-center";
                    break;

                case NET_ERROR:
                    this.hintElement.className = "ActuatorWidgetHint text-danger text-center";
                    break;

                case NET_RECONNECT:
                    this.hintElement.className = "ActuatorWidgetHint text-info text-center";
                    break;

                default:
                    //offline
                    this.hintElement.className = "ActuatorWidgetHint text-secondary text-center";
                    break;
            }

            if (this.hintElement.firstTime) {
                this.hintElement.innerHTML = "WWWWW"; //4 chars

                elementWidth = this.hintElement.getBoundingClientRect().width;

                if (elementWidth < this.size) {
                    this.hintElement.style.fontSize = this.size / 2 / elementWidth + "rem";
                }
            }

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.hintElement.innerHTML = getLang("rid_online");
                    break;

                case NET_ERROR:
                    this.hintElement.innerHTML = getLang("rid_error");
                    break;

                case NET_RECONNECT:
                    this.hintElement.innerHTML = getLang("rid_connect");
                    break;

                default:
                    //offline
                    this.hintElement.innerHTML = this.hintElement.innerHTML = getLang("rid_offline");
                    break;
            } //  if (this.hintElement.firstTime) {


            elementWidth = this.hintElement.getBoundingClientRect().width;
            this.hintElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";
            this.hintElement.firstTime = false; //   }
        };

        _proto.drawWidget = function drawWidget() {
            var _this2 = this;

            this.rContext.save();
            this.rContext.clearRect(0, 0, this.rCanvas.width, this.rCanvas.height);
            this.rContext.imageSmoothingEnabled = false; //    

            var radius = 25;
            var panding = 5;
            var width = this.size - panding;
            var height = this.size - panding; //background --------------------------------------------------------------------------------

            this.rContext.beginPath();
            this.rContext.rect(panding, height, width, height + panding);
            this.rContext.fillStyle = theme.danger;

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.rContext.fillStyle = theme.success;
                    break;

                case NET_ERROR:
                    this.rContext.fillStyle = theme.danger;
                    break;

                case NET_RECONNECT:
                    this.rContext.fillStyle = theme.info + this.alphaValue;
                    break;

                default:
                    //offline
                    this.rContext.fillStyle = theme.secondary;
                    break;
            }

            this.rContext.closePath();
            this.rContext.fill();
            this.rContext.beginPath();
            this.rContext.rect(panding, panding, width, height);
            this.rContext.fillStyle = theme.secondary + "10";
            this.rContext.closePath();
            this.rContext.fill(); //end off background -----------------------------------------------------------------------

            this.rContext.lineCap = "";
            this.rContext.lineWidth = 1;
            var pixPercent = this.sHeight / 100 * this.percent;
            var pixToPercent = this.sHeight / 100 * this.toPercent; //inside fill (window)

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, this.sHeight);
            this.rContext.fillStyle = theme.info + this.alphaValue;
            this.rContext.closePath();
            this.rContext.fill(); //current position - percent

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, pixPercent);
            this.rContext.fillStyle = theme.secondary;
            this.rContext.closePath();
            this.rContext.fill(); //end of 
            //draw stepper possition line ----------------------------------------------------

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop + pixPercent, this.sWidth, 2);
            this.rContext.fillStyle = theme.info;
            this.rContext.closePath();
            this.rContext.fill(); //draw stepper TO possition line ----------------------------------------------------

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop + pixToPercent, this.sWidth, 2);

            if (this.userMovePosition) {
                this.rContext.fillStyle = theme.danger;
            } else {
                this.rContext.fillStyle = theme.success;
            }

            this.rContext.closePath();
            this.rContext.fill(); //--------------------------------------------------------------------
            //draw stepper to Position pointers

            this.rContext.beginPath();
            var triagleSize = this.size / 25; //left

            this.rContext.moveTo(this.sPandingLeft, this.sPandingTop + pixToPercent);
            this.rContext.lineTo(this.sPandingLeft - triagleSize, this.sPandingTop + pixToPercent + triagleSize);
            this.rContext.lineTo(this.sPandingLeft - triagleSize, this.sPandingTop + pixToPercent - triagleSize); //right

            this.rContext.moveTo(this.sPandingLeft + this.sWidth, this.sPandingTop + pixToPercent);
            this.rContext.lineTo(this.sPandingLeft + this.sWidth + triagleSize, this.sPandingTop + pixToPercent + triagleSize);
            this.rContext.lineTo(this.sPandingLeft + this.sWidth + triagleSize, this.sPandingTop + pixToPercent - triagleSize);

            if (this.userMovePosition) {
                this.rContext.fillStyle = theme.danger;
            } else {
                this.rContext.fillStyle = theme.success;
            }

            this.rContext.closePath();
            this.rContext.fill(); //draw rows        

            var tenPercent = this.sHeight / 100 * 10;

            for (var i = tenPercent; i < this.sHeight; i += tenPercent) {
                this.rContext.beginPath();
                this.rContext.moveTo(this.sPandingLeft, this.sPandingTop + i);
                this.rContext.lineTo(this.sPandingLeft + 5, this.sPandingTop + i);
                this.rContext.moveTo(this.sPandingLeft + this.sWidth, this.sPandingTop + i);
                this.rContext.lineTo(this.sPandingLeft + this.sWidth - 5, this.sPandingTop + i);
                this.rContext.strokeStyle = theme.light + this.alphaValue;
                this.rContext.stroke();
                this.rContext.closePath();
            } //border 


            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, this.sHeight);
            this.rContext.strokeStyle = theme.light + this.alphaValue;
            this.rContext.stroke();
            this.rContext.closePath();
            this.rContext.restore(); //text -----------------------------------------------------------

            this.rContext.save();
            this.rContext.beginPath();
            this.rContext.font = "400 50px " + theme.fontFamily.toString();
            this.rContext.textAlign = 'center';
            this.rContext.fillStyle = theme.success;
            this.rContext.shadowBlur = 1;
            this.rContext.shadowColor = this.rContext.fillStyle;
            this.rContext.shadowOffsetX = 0;
            this.rContext.shadowOffsetY = 0;
            this.rContext.fillText("90%", this.size / 2, this.size / 2, 100);
            this.rContext.closePath();
            this.rContext.restore(); //spinner   ---------------

            if (this.networkStatus == NET_RECONNECT) {
                var x = this.rCanvas.width / 2;
                var y = this.rCanvas.height / 2 + this.size / 22;
                this.spinnerAngle += 0.05;
                var counterClockwise = false;
                this.rContext.beginPath();
                this.rContext.lineWidth = this.widgetWidht / 3;
                this.rContext.arc(x, y, this.radius - this.widgetWidht - this.size / 15, this.spinnerAngle, this.spinnerAngle + Math.PI, counterClockwise);
                this.rContext.strokeStyle = theme.info + 40;
                this.rContext.stroke();
                this.rContext.closePath();
                requestAnimationFrame(function () {
                    return _this2.drawWidget();
                });
            }
        };

        _createClass(StepperWidget, [{
            key: "_newtorkStatus",
            get: function get() {
                return this.networkStatus;
            }
        }, {
            key: "_networkStatus",
            set: function set(networkStatus) {
                if (networkStatus >= NET_OFFLINE && networkStatus <= NET_RECONNECT) {
                    this.networkStatus = networkStatus;
                    this.redrawAll();
                }
            }
        }, {
            key: "_percent",
            get: function get() {
                return this.percent;
            },
            set: function set(percent) {
                if (percent >= 0 && percent <= 100) {
                    this.percent = percent;
                    this.redrawAll();
                }
            }
        }]);

        return StepperWidget;
    }();