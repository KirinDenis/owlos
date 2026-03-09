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


var GraphWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(GraphWidget, _BaseWidget);

        function GraphWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        GraphWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;
            widget.widgetHolder.className = "col-6 col-sm-4 col-lg-2 widgetHolder";
            widget.topMargin = widget.size / 20; //this.panding = 5;
            widget.width = widget.size * 2;
            widget.height = widget.size;
            widget.centreX = widget.width / 2; //  this.centreY = this.height / 2;
            widget.widgetTextSize = widget.size / 110;
            widget.graphWidth = widget.width - widget.panding;
            widget.graphHeight = widget.height - widget.size / 3.4;
            widget.graphTop = widget.size / 3.7;
            widget.SVGViewBox.setAttributeNS(null, "viewBox", "0 0 " + widget.width + " " + widget.height);
            widget.SVGBackgroundPanel.drawRoundedRect(widget.width - 5, widget.height - 6, 5, 10, true, true, true, true);
            widget.SVGBackdownpanel.drawRoundedRect(widget.width - 5, 10, 5, 0, false, false, true, true);
            widget.SVGHeaderPanel.drawRoundedRect(widget.width, 26, 5, 0, true, true, false, false);
            widget._properties.lineColor = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.lineOpacity = { tab: "Graph", value: 0.5, type: "f" };
            widget._properties.backOpacity = { tab: "Graph", value: 0.4, type: "f" };
            widget._properties.gradient1Color = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.gradient1Opacity = { tab: "Graph", value: 0.7, type: "f" };
            widget._properties.gradient1Offset = { tab: "Graph", value: 0, type: "i" };
            widget._properties.gradient2Color = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.gradient2Opacity = { tab: "Graph", value: 0.4, type: "f" };
            widget._properties.gradient2Offset = { tab: "Graph", value: 60, type: "i" };

            widget._properties.gradient3Color = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.gradient3Opacity = { tab: "Graph", value: 0.2, type: "f" };
            widget._properties.gradient3Offset = { tab: "Graph", value: 80, type: "i" };

            widget.SVGBackdownpanel.width = widget.width;
            widget.stop1 = document.createElementNS(xmlns, 'stop');
            widget.stop2 = document.createElementNS(xmlns, 'stop');
            widget.stop2.setAttribute('class', 'stop2');
            widget.stop3 = document.createElementNS(xmlns, 'stop');
            widget.stop3.setAttribute('class', 'stop3');

            widget.gradient = document.createElementNS(xmlns, 'linearGradient');
            widget.gradient.id = widget.id + 'GraphGradient';
            widget.gradient.setAttribute('x1', '0');
            widget.gradient.setAttribute('x2', '0');
            widget.gradient.setAttribute('y1', '0');
            widget.gradient.setAttribute('y2', '1');
            widget.gradient.appendChild(widget.stop1);
            widget.gradient.appendChild(widget.stop2);
            widget.gradient.appendChild(widget.stop3);

            widget.SVGViewBox.appendChild(widget.gradient);

            widget.SVGPath1 = new SVGArc(widget.SVGViewBox, widget.id + "path1", widget.graphTop + " " + widget.halfPanding + " " + widget.graphWidth + " " + widget.graphHeight);
            widget.SVGPath1.fill = 'url(#' + widget.id + 'GraphGradient)';

            widget.SVGPath2 = new SVGArc(widget.SVGViewBox, widget.id + "path2", widget.graphTop + " " + widget.halfPanding + " " + widget.graphWidth + " " + widget.graphHeight);
            widget.SVGHeaderText.text = "Graph";
            widget.widgetLeft = widget.centreX - widget.textWidth / 2;
            widget.widgetTop = widget.centreY + widget.SVGHeaderText.height - widget.textHeight * 4 / 2;
            var labelTextSize = widget.size / 210;
            widget.SVGTopLabel = new SVGText(widget.SVGViewBox, widget.id + "toplabel", labelTextSize);
            widget.SVGTopLabel.color = theme.secondary;
            widget.SVGMiddleLabel = new SVGText(widget.SVGViewBox, widget.id + "toplabel", labelTextSize);
            widget.SVGMiddleLabel.color = theme.secondary;
            widget.SVGDownLabel = new SVGText(widget.SVGViewBox, widget.id + "toplabel", labelTextSize);
            widget.SVGDownLabel.color = theme.secondary;
            widget.SVGTopLabel.x = widget.SVGMiddleLabel.x = widget.SVGDownLabel.x = widget.width / 40;
            widget.SVGTopLine = new SVGRect(widget.SVGViewBox, widget.id + "topline", widget.width / 48, 0, widget.graphWidth, 1);
            widget.SVGTopLine.opacity = 0.1;
            widget.SVGTopLine.color = theme.secondary;
            widget.SVGMiddleLine = new SVGRect(widget.SVGViewBox, widget.id + "middlieline", widget.width / 48, 0, widget.graphWidth, 1);
            widget.SVGMiddleLine.opacity = 0.1;
            widget.SVGMiddleLine.color = theme.secondary;
            widget.SVGDownLine = new SVGRect(widget.SVGViewBox, widget.id + "downline", widget.width / 48, 0, widget.graphWidth, 1);
            widget.SVGDownLine.opacity = 0.1;
            widget.SVGDownLine.color = theme.secondary;
            //widget.SVGIcon = new SVGIcon(widget.SVGViewBox, addIcon, widget.width - widget.size / 6, widget.size / 24, widget.size / 8, widget.size / 8);
            //widget.SVGIcon.fill = theme.secondary;
            widget.SVGWidgetText.hide();
            widget.SVGArcSpinner.x = widget.centreX;
            widget.ShowEqualizer = false;
            widget.SVGRightIcon.x = widget.width - widget.rowSize; //  this.SVGPlusIcon.x = this.width / 2 - this.rowSize / 2;
            widget.SVGPropertiesIcon.x = widget.width / 2 - widget.rowSize / 2;
            widget.SVGDeleteIcon.x = widget.width - widget.rowSize + widget.size / 55;
            widget.clickableToTop();
            widget.proprties = widget._properties;
            widget.resize(widget.width);

            widget.doOnLoad();
        };

        GraphWidget.prototype.resize = function resize(size) {
            this.size = size;
            if (this.SVGViewBox == undefined) return;
            this.SVGViewBox.setAttributeNS(null, "width", size);
            this.SVGViewBox.setAttributeNS(null, "height", size / 2);

        };

        //  var GraphWidget.prototype = GraphWidget.prototype;

        GraphWidget.prototype.refresh = function refresh(widgetText, label, historyData) {
            label = getLang(label);
            this.widgetText = widgetText;
            this.label = label;
            this.historyData = historyData;
            this.spinnerAngle = 0;
            this.redrawAll();
        };

        GraphWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        GraphWidget.prototype.drawWidget = function drawWidget() {
            if (this.graphWidth == undefined) {
                return;
            }
            if (this.historyData != undefined) {


                this.stop1.setAttribute('stop-color', this.properties.gradient1Color.value);
                this.stop1.setAttribute('stop-opacity', this.properties.gradient1Opacity.value);
                this.stop1.setAttribute('offset', this.properties.gradient1Offset.value + '%');

                this.stop2.setAttribute('stop-color', this.properties.gradient2Color.value);
                this.stop2.setAttribute('stop-opacity', this.properties.gradient2Opacity.value);
                this.stop2.setAttribute('offset', this.properties.gradient2Offset.value + '%');

                this.stop3.setAttribute('stop-color', ' ' + this.properties.gradient3Color.value);
                this.stop3.setAttribute('stop-opacity', this.properties.gradient3Opacity.value);
                this.stop3.setAttribute('offset', this.properties.gradient3Offset.value + '%');

                //reset 
                var updatedFilteredData = this.historyDataFilter(this.graphWidth, this.historyData, 1, 1); //It is important to draw Y lalues at first and curve after!!!

                this.grawYValuesPoints(this.SVGTopLabel, this.SVGMiddleLabel, this.SVGDownLabel, updatedFilteredData);
                var d = this.curveForDrawing(updatedFilteredData, this.graphHeight, this.graphTop, this.panding);

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.SVGPath1.opacity = this._properties.backOpacity.value;
                        this.SVGPath2.opacity = this._properties.lineOpacity.value;
                        this.toColor(this.SVGPath2, this._properties.lineColor.value);
                        this.toColor(this.SVGTopLabel, theme.secondary);
                        this.toColor(this.SVGMiddleLabel, theme.secondary);
                        this.toColor(this.SVGDownLabel, theme.secondary);
                      //  this.SVGIcon.fill = theme.info;
                        break;

                    case NET_ERROR:
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.danger);
                        this.toColor(this.SVGTopLabel, theme.danger);
                        this.toColor(this.SVGMiddleLabel, theme.danger);
                        this.toColor(this.SVGDownLabel, theme.danger);
                     //   this.SVGIcon.fill = theme.danger;
                        break;

                    case NET_RECONNECT:
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.info);
                        this.toColor(this.SVGTopLabel, theme.info);
                        this.toColor(this.SVGMiddleLabel, theme.info);
                        this.toColor(this.SVGDownLabel, theme.info);
                     //   this.SVGIcon.fill = theme.info;
                        break;

                    default:
                        //offline
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.secondary);
                        this.toColor(this.SVGTopLabel, theme.secondary);
                        this.toColor(this.SVGMiddleLabel, theme.secondary);
                        this.toColor(this.SVGDownLabel, theme.secondary);
                       // this.SVGIcon.fill = theme.secondary;
                        break;
                }

                this.SVGTopLabel.y = this.SVGTopLine.y = this.graphTop;
                this.SVGTopLine.x = this.SVGTopLabel.x + this.SVGTopLabel.width;
                this.SVGMiddleLabel.y = this.SVGMiddleLine.y = this.graphTop + this.graphHeight / 2;
                this.SVGMiddleLine.x = this.SVGMiddleLabel.x + this.SVGMiddleLabel.width;
                this.SVGDownLabel.y = this.SVGDownLine.y = this.graphTop + this.graphHeight - this.size / 100;
                this.SVGDownLine.x = this.SVGDownLabel.x + this.SVGDownLabel.width;
                this.SVGPath1.drawPath(d);
                this.SVGPath2.drawPath(d);

                _BaseWidget.prototype.drawWidget.call(this);
            }
        };

        GraphWidget.prototype.isIntegerNumber = function isIntegerNumber(num) {
            return (num ^ 0) === num;
        }

        GraphWidget.prototype.grawYValuesPoints = function grawYValuesPoints(topLable, middleLable, downLable, filteredArrayForDrawY) {
            var maxValueY;
            var minValueY;

            for (var gLocal = 0; gLocal < filteredArrayForDrawY.length; gLocal++) {
                var valueYLocal = parseFloat(filteredArrayForDrawY[gLocal]);

                if (maxValueY == undefined || valueYLocal > maxValueY) {
                    maxValueY = valueYLocal;
                }

                if (minValueY == undefined || valueYLocal < minValueY) {
                    minValueY = valueYLocal;
                }
            }

            var middleValueY;

            if (minValueY == maxValueY) {
                minValueY -= minValueY * 0.1;
                maxValueY += maxValueY * 0.1;
                middleValueY = minValueY + (maxValueY - minValueY) / 2;
            } else {
                middleValueY = (maxValueY - minValueY) / 2;
                maxValueY += middleValueY;
                minValueY -= middleValueY;
                middleValueY = minValueY + (maxValueY - minValueY) / 2;
            }

            if (!this.isIntegerNumber(maxValueY) || !this.isIntegerNumber(middleValueY) || !this.isIntegerNumber(minValueY)) {
                maxValueY = maxValueY.toFixed(2);
                minValueY = minValueY.toFixed(2);
                middleValueY = middleValueY.toFixed(2);
            }

            topLable.text = maxValueY;
            middleLable.text = middleValueY;
            downLable.text = minValueY;
        }

        GraphWidget.prototype._trunc = function _trunc(x) {
            if (isNaN(x)) {
                return NaN;
            }
            if (x > 0) {
                return Math.floor(x);
            }
            return Math.ceil(x);
        }

        GraphWidget.prototype.grawXValues = function grawXValues(parentPanel, id, graphPlotWidth, graphPlotHight, graphTopY, startXpoint, historyDataArr, lastPointTimeMiliseconds, timeUnitInMinutes, zoomInOut, shiftLeftRight) {
            var maxPointsX = 3 * (this._trunc((graphPlotWidth - 20) / 30) + 1);
            var splitHistoryDataXArray = historyDataArr.split(";");
            var historyDataXCount = splitHistoryDataXArray.length - 1;
            var xPointsArray;

            if (maxPointsX >= historyDataXCount) {
                xPointsArray = new Array(historyDataXCount);

                for (var ix = 0; ix < xPointsArray.length; ix++) {
                    xPointsArray[ix] = lastPointTimeMiliseconds - timeUnitInMinutes * 1000 * 60 * (xPointsArray.length - 1 - ix);
                }
            } else {
                xPointsArray = new Array(maxPointsX);
                var historyDataXZeroPosition = 0; //checking if history data has more then 1440 elements

                if (historyDataXCount > 1440) {
                    historyDataXZeroPosition = historyDataXCount - 1440;
                }

                var dayHistoryXLength = historyDataXCount - historyDataXZeroPosition;
                var historyDataXFilterStep = _trunc(dayHistoryXLength / xPointsArray.length);
                var deltaTime = dayHistoryXLength - historyDataXFilterStep * xPointsArray.length;

                if (deltaTime <= 0) {
                    for (var ixp = 0; ixp < xPointsArray.length; ixp++) {
                        xPointsArray[ixp] = lastPointTimeMiliseconds - 1000 * 60 * timeUnitInMinutes * historyDataXFilterStep * (xPointsArray.length - (ixp + 1));
                    }
                } else {
                    for (var ixpd = 0; ixpd < xPointsArray.length; ixpd++) {
                        xPointsArray[ixpd] = lastPointTimeMiliseconds - 1000 * 60 * timeUnitInMinutes * (deltaTime + historyDataXFilterStep * (xPointsArray.length - (ixpd + 1)));
                    }
                }
            }

            var startXValue = new Date(xPointsArray[0]);
            var SVGTTextXValue = new SVGText(parentPanel, id + "startXValue", graphPlotHight / 255);
            SVGTTextXValue.x = startXpoint;
            SVGTTextXValue.y = graphTopY + graphPlotHight + 10;
            SVGTTextXValue.text = startXValue.getHours() + ":" + startXValue.getMinutes();
            var nextXTestPosition = startXpoint + SVGTTextXValue.getTextWidth();
            var finishXValue = new Date(xPointsArray[xPointsArray.length - 1]);
            var SVGTTextXFinishValue = new SVGText(parentPanel, id + "finishXValue", graphPlotHight / 255);
            SVGTTextXFinishValue.x = startXpoint + _trunc(graphPlotWidth / xPointsArray.length) * (xPointsArray.length - 1) - 20;
            SVGTTextXFinishValue.y = graphTopY + graphPlotHight + 10;
            SVGTTextXFinishValue.text = finishXValue.getHours() + ":" + finishXValue.getMinutes();
        }

        GraphWidget.prototype.curveForDrawing = function curveForDrawing(filteredDataArray, graphPlotHight, graphTopY, graphStartX) {
            var maxLocalValue;
            var minLocalValue; //Find max and min value

            for (var mLocal = 0; mLocal < filteredDataArray.length; mLocal++) {
                var valueLocal = parseFloat(filteredDataArray[mLocal]);

                if (maxLocalValue == undefined || valueLocal > maxLocalValue) {
                    maxLocalValue = valueLocal;
                }

                if (minLocalValue == undefined || valueLocal < minLocalValue) {
                    minLocalValue = valueLocal;
                }
            }

            var stepLocal = 10;
            var halfStepLocal = stepLocal / 3; //If min == max then we decrease small value and increase big value by 10%

            if (maxLocalValue == minLocalValue) {
                maxLocalValue += maxLocalValue * 0.1;
                minLocalValue -= minLocalValue * 0.1;
            } else {
                var middleLocalValue = (maxLocalValue - minLocalValue) / 2;
                maxLocalValue += middleLocalValue;
                minLocalValue -= middleLocalValue;
            }

            var proportionLocal = graphPlotHight / (maxLocalValue - minLocalValue); //normalize Y

            for (var lLocal = 0; lLocal < filteredDataArray.length; lLocal++) {
                filteredDataArray[lLocal] = parseFloat(graphTopY + (graphPlotHight - (filteredDataArray[lLocal] - minLocalValue) * proportionLocal));
            }

            var topOffsetLocal = parseFloat(graphPlotHight + graphTopY);
            var dLocal = "M " + graphStartX + ", " + topOffsetLocal;

            for (var nLocal = 0; nLocal < filteredDataArray.length; nLocal++) {
                if (nLocal == 0) {
                    dLocal += " C " + graphStartX + ", " + filteredDataArray[nLocal] + " " + graphStartX + ", " + topOffsetLocal + " " + graphStartX + ", " + filteredDataArray[nLocal] + " ";
                } else {
                    var s1 = parseFloat(graphStartX + nLocal * stepLocal - halfStepLocal * 2);
                    var s2 = parseFloat(graphStartX + nLocal * stepLocal - halfStepLocal);
                    var s3 = parseFloat(graphStartX + nLocal * stepLocal);
                    dLocal += " C " + s1 + ", " + filteredDataArray[nLocal - 1] + " " + s2 + ", " + filteredDataArray[nLocal] + " " + s3 + ", " + filteredDataArray[nLocal] + " ";
                }
            }

            dLocal += " C " + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " " + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " " + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " ";
            return dLocal;
        }

        GraphWidget.prototype.historyDataFilter = function historyDataFilter(historyDataGraphPlotWidth, historyDataAsString, zoomInOut, shiftLeftRight) {
            var maxPossiblePlotPoints = 3 * (this._trunc((historyDataGraphPlotWidth - 20) / 30) + 1);
            var splitHistoryDataFromString = historyDataAsString.split(";");
            var historyDataLength = splitHistoryDataFromString.length - 1;
            var filteredHistoryDataArray;

            if (maxPossiblePlotPoints >= historyDataLength) {
                filteredHistoryDataArray = new Array(historyDataLength);

                for (var hdi = 0; hdi < filteredHistoryDataArray.length; hdi++) {
                    filteredHistoryDataArray[hdi] = splitHistoryDataFromString[hdi];
                }
            } else {
                var filteredHistoryDataArrayLength = 3 * this._trunc(maxPossiblePlotPoints / 3);
                filteredHistoryDataArray = new Array(filteredHistoryDataArrayLength);
                var filterStep = this._trunc(3 * historyDataLength / filteredHistoryDataArray.length);
                var historyDataStartPosition = historyDataLength - filteredHistoryDataArray.length * filterStep / 3; //fill the filltered array from last element to first.It is nessary to save last (more fresh) history datas

                for (var hdj = 0; hdj < filteredHistoryDataArray.length / 3; hdj++) {
                    var localBigValue;
                    var localSmallValue;
                    var localMiddleValue;
                    var localBigValueIndex;
                    var localSmallValueIndex;
                    var localMiddleValueIndex;
                    var localDeltaValue;

                    for (var hdjj = 0; hdjj < filterStep; hdjj++) {
                        var currentValue = parseFloat(splitHistoryDataFromString[historyDataStartPosition + filterStep * hdj + hdjj]);

                        if (localBigValue == null || localBigValue == undefined || currentValue > localBigValue) {
                            localBigValue = currentValue;
                            localBigValueIndex = historyDataStartPosition + filterStep * hdj + hdjj;
                        }

                        if (localSmallValue == null || localSmallValue == undefined || currentValue < localSmallValue) {
                            localSmallValue = currentValue;
                            localSmallValueIndex = historyDataStartPosition + filterStep * hdj + hdjj;
                        }

                        if (hdjj == 0) {
                            localMiddleValue = currentValue;
                        } else {
                            localMiddleValue += currentValue;
                        }
                    } // if small value = max value => middle = (small+max)/2;


                    if (localSmallValue == localBigValue) {
                        localMiddleValue = (localSmallValue + localBigValue) / 2;
                        filteredHistoryDataArray[3 * hdj] = localSmallValue;
                        filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                        filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                    } else {
                        //Calculate the local middle value as arithmetical mean
                        localMiddleValue = localMiddleValue / filterStep; //find the local MiddleValue index

                        for (var jt = 0; jt < filterStep; jt++) {
                            var currentValueForFindIndex = parseFloat(splitHistoryDataFromString[historyDataStartPosition + filterStep * hdj + jt]);

                            if (localDeltaValue == null || localDeltaValue == undefined || Math.abs(localMiddleValue - currentValueForFindIndex) < localDeltaValue) {
                                localDeltaValue = Math.abs(localMiddleValue - currentValueForFindIndex);
                                localMiddleValueIndex = historyDataStartPosition + filterStep * hdj + jt;
                            }
                        } //Odering local max, min and middle value by their indexes

                        if (localSmallValueIndex < localBigValueIndex) {
                            if (localSmallValueIndex < localMiddleValueIndex) {
                                filteredHistoryDataArray[3 * hdj] = localSmallValue;

                                if (localMiddleValueIndex < localBigValueIndex) {
                                    filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                                } else {
                                    filteredHistoryDataArray[3 * hdj + 1] = localBigValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localMiddleValue;
                                }
                            } else {
                                filteredHistoryDataArray[3 * hdj] = localMiddleValue;
                                filteredHistoryDataArray[3 * hdj + 1] = localSmallValue;
                                filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                            }
                        } else {
                            if (localBigValueIndex > localMiddleValueIndex) {
                                filteredHistoryDataArray[3 * hdj] = localMiddleValue;
                                filteredHistoryDataArray[3 * hdj + 1] = localBigValue;
                                filteredHistoryDataArray[3 * hdj + 2] = localSmallValue;
                            } else {
                                filteredHistoryDataArray[3 * hdj] = localBigValue;

                                if (localMiddleValueIndex < localSmallValueIndex) {
                                    filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localSmallValue;
                                } else {
                                    filteredHistoryDataArray[3 * hdj + 1] = localSmallValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localMiddleValue;
                                }
                            }
                        }
                    } //Clear the local values for next filtered set


                    localBigValue = null;
                    localSmallValue = null;
                    localMiddleValue = null;
                    localBigValueIndex = null;
                    localSmallValueIndex = null;
                    localMiddleValueIndex = null;
                    localDeltaValue = null;
                }
            }

            return filteredHistoryDataArray;
        }

        return GraphWidget;
    }(BaseWidget);

