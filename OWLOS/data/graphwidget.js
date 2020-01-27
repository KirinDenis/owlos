

var GraphWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(GraphWidget, _BaseWidget);

        function GraphWidget(parentPanel, id, size, icon) {

            var baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;

            baseWidget.rPanel.className = "col-sm-2";
           // baseWidget.rPanel.removeChild(baseWidget.svgElement);

            
            baseWidget.topMargin = baseWidget.size / 20; //this.panding = 5;

            baseWidget.width = baseWidget.size * 2;
            baseWidget.height = baseWidget.size;
            baseWidget.centreX = baseWidget.width / 2; //  this.centreY = this.height / 2;

            baseWidget.widgetTextSize = baseWidget.size / 110;
            baseWidget.graphWidth = baseWidget.width - baseWidget.panding;
            baseWidget.graphHeight = baseWidget.height - baseWidget.size / 3.4 ;
            baseWidget.graphTop = baseWidget.size / 3.7;

            baseWidget.svgElement.setAttributeNS(null, "viewBox", "0 0 " + baseWidget.width + " " + baseWidget.height);
            
            baseWidget.svgElement.setAttributeNS(null, "width", baseWidget.width);
            baseWidget.svgElement.setAttributeNS(null, "height", baseWidget.height);

            baseWidget.SVGBackpanel.drawRoundedRect(baseWidget.width, baseWidget.height, 5, 10, true, true, true, true);
            baseWidget.SVGBoxBackpanel.drawRoundedRect(baseWidget.width, 26, 5, 0, true, true, false, false);
            baseWidget.SVGBackdownpanel.y += 3;
            baseWidget.SVGBackdownpanel.drawRoundedRect(baseWidget.width, 10, 5, 0, false, false, true, true);

            baseWidget.SVGBackdownpanel.width = baseWidget.width;
            baseWidget.SVGBackdownpanel.y = baseWidget.height;
            var stop1 = document.createElementNS(xmlns, 'stop');
            stop1.setAttribute('stop-color', theme.success);
            stop1.setAttribute('stop-opacity', "0.7");
            stop1.setAttribute('offset', "0%");
            var stop2 = document.createElementNS(xmlns, 'stop');
            stop2.setAttribute('class', 'stop2');
            stop2.setAttribute('stop-color', theme.success);
            stop2.setAttribute('stop-opacity', "0.4");
            stop2.setAttribute('offset', "60%");
            var stop3 = document.createElementNS(xmlns, 'stop');
            stop3.setAttribute('class', 'stop3');
            stop3.setAttribute('stop-color', theme.success);
            stop3.setAttribute('stop-opacity', "0.2");
            stop3.setAttribute('offset', "80%");
            var gradient = document.createElementNS(xmlns, 'linearGradient');
            gradient.id = 'GraphGradient';
            gradient.setAttribute('x1', '0');
            gradient.setAttribute('x2', '0');
            gradient.setAttribute('y1', '0');
            gradient.setAttribute('y2', '1');
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            gradient.appendChild(stop3);

            baseWidget.svgElement.appendChild(gradient);

            baseWidget.SVGPath1 = new SVGArc(baseWidget.svgElement, baseWidget.id + "path1", baseWidget.graphTop + " " + baseWidget.halfPanding  + " " + baseWidget.graphWidth + " " + baseWidget.graphHeight);
            baseWidget.SVGPath1.fill = 'url(#GraphGradient)';
            baseWidget.SVGPath1.opacity = 0.4;
            baseWidget.SVGPath2 = new SVGArc(baseWidget.svgElement, baseWidget.id + "path2", baseWidget.graphTop + " " + baseWidget.halfPanding + " " + baseWidget.graphWidth + " " + baseWidget.graphHeight);
            baseWidget.SVGPath2.color = theme.secondary;
            baseWidget.SVGPath2.opacity = 0.5;
            baseWidget.SVGLabel.text = "Graph";
            baseWidget.widgetLeft = baseWidget.centreX - baseWidget.textWidth / 2;
            baseWidget.widgetTop = baseWidget.centreY + baseWidget.SVGLabel.height - baseWidget.textHeight * 4 / 2;
            var labelTextSize = baseWidget.size / 210;
            baseWidget.SVGTopLabel = new SVGText(baseWidget.svgElement, baseWidget.id + "toplabel", labelTextSize);
            baseWidget.SVGTopLabel.color = theme.secondary;
            baseWidget.SVGMiddleLabel = new SVGText(baseWidget.svgElement, baseWidget.id + "toplabel", labelTextSize);
            baseWidget.SVGMiddleLabel.color = theme.secondary;
            baseWidget.SVGDownLabel = new SVGText(baseWidget.svgElement, baseWidget.id + "toplabel", labelTextSize);
            baseWidget.SVGDownLabel.color = theme.secondary;
            baseWidget.SVGTopLabel.x = baseWidget.SVGMiddleLabel.x = baseWidget.SVGDownLabel.x = baseWidget.width / 48;
            baseWidget.SVGTopLine = new SVGRect(baseWidget.svgElement, baseWidget.id + "topline", baseWidget.width / 48, 0, baseWidget.graphWidth, 1);
            baseWidget.SVGTopLine.opacity = 0.1;
            baseWidget.SVGTopLine.color = theme.secondary;
            baseWidget.SVGMiddleLine = new SVGRect(baseWidget.svgElement, baseWidget.id + "middlieline", baseWidget.width / 48, 0, baseWidget.graphWidth, 1);
            baseWidget.SVGMiddleLine.opacity = 0.1;
            baseWidget.SVGMiddleLine.color = theme.secondary;
            baseWidget.SVGDownLine = new SVGRect(baseWidget.svgElement, baseWidget.id + "downline", baseWidget.width / 48, 0, baseWidget.graphWidth, 1);
            baseWidget.SVGDownLine.opacity = 0.1;
            baseWidget.SVGDownLine.color = theme.secondary;

            if (icon != undefined) {
                baseWidget.SVGIcon = new SVGIcon(baseWidget.svgElement, icon, baseWidget.width - baseWidget.size / 6, baseWidget.size / 24, baseWidget.size / 8, baseWidget.size / 8);
            } else {
                baseWidget.SVGIcon = new SVGIcon(baseWidget.svgElement, addIcon, baseWidget.width - baseWidget.size / 6, baseWidget.size / 24, baseWidget.size / 8, baseWidget.size / 8);
            }

            baseWidget.SVGIcon.fill = theme.secondary;

            baseWidget.SVGWidgetText.hide();

            baseWidget.SVGArcSpinner.x = baseWidget.centreX;
            baseWidget.ShowEqualizer = false;
            baseWidget.SVGRightIcon.x = baseWidget.width - baseWidget.rowSize; //  this.SVGPlusIcon.x = this.width / 2 - this.rowSize / 2;

            baseWidget.SVGMinusIcon.x = baseWidget.width / 2 - baseWidget.rowSize / 2;

         //   baseWidget.rPanel.appendChild(baseWidget.svgElement);

            baseWidget.clickableToTop();

            return baseWidget;
        }

        GraphWidget.prototype.resize = function resize(size) {
            _BaseWidget.prototype.resize.call(this, size);

            this.svgElement.setAttributeNS(null, "width", size);
            this.svgElement.setAttributeNS(null, "height", size / 2);

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
            if (this.historyData != undefined) {
                //reset 
                var updatedFilteredData = this.historyDataFilter(this.graphWidth, this.historyData, 1, 1); //It is important to draw Y lalues at first and curve after!!!

                this.grawYValuesPoints(this.SVGTopLabel, this.SVGMiddleLabel, this.SVGDownLabel, updatedFilteredData);
                var d = this.curveForDrawing(updatedFilteredData, this.graphHeight, this.graphTop, this.panding * 1.2);

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.SVGPath1.opacity = 0.4;
                        this.toColor(this.SVGPath2, theme.success);
                        this.toColor(this.SVGTopLabel, theme.secondary);
                        this.toColor(this.SVGMiddleLabel, theme.secondary);
                        this.toColor(this.SVGDownLabel, theme.secondary);
                        this.SVGIcon.fill = theme.secondary;
                        break;

                    case NET_ERROR:
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.danger);
                        this.toColor(this.SVGTopLabel, theme.danger);
                        this.toColor(this.SVGMiddleLabel, theme.danger);
                        this.toColor(this.SVGDownLabel, theme.danger);
                        this.SVGIcon.fill = theme.danger;
                        break;

                    case NET_RECONNECT:
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.info);
                        this.toColor(this.SVGTopLabel, theme.info);
                        this.toColor(this.SVGMiddleLabel, theme.info);
                        this.toColor(this.SVGDownLabel, theme.info);
                        this.SVGIcon.fill = theme.info;
                        break;

                    default:
                        //offline
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.secondary);
                        this.toColor(this.SVGTopLabel, theme.secondary);
                        this.toColor(this.SVGMiddleLabel, theme.secondary);
                        this.toColor(this.SVGDownLabel, theme.secondary);
                        this.SVGIcon.fill = theme.secondary;
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

