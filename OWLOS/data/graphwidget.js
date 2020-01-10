class GraphWidget extends BaseWidget {
    constructor(parentPanel, id, size, icon) {
        super(parentPanel, id, size);

        this.topMargin = this.size / 20;
        //this.panding = 5;
        this.width = this.size * 2;
        this.height = this.size - this.panding;

        this.centreX = this.width / 2;
        //  this.centreY = this.height / 2;

        this.widgetTextSize = this.size / 110;

        this.graphWidth = this.width;
        this.graphHeight = this.height - this.size / 4.5;
        this.graphTop = this.size / 4.3;


        this.svgElement.setAttributeNS(null, "viewBox", this.halfPanding + " " + this.halfPanding + " " + this.width + " " + this.height);
        this.svgElement.setAttributeNS(null, "width", this.width);
        this.SVGBackpanel.width = this.width;
        this.SVGBackpanel.height = this.height;
        this.SVGBackdownpanel.width = this.width;


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
        this.svgElement.appendChild(gradient);

        this.SVGPath1 = new SVGArc(this.svgElement, this.id + "path1", this.graphTop + " " + this.halfPanding + " " + this.graphWidth + " " + this.graphHeight);
        this.SVGPath1.fill = 'url(#GraphGradient)';
        this.SVGPath1.opacity = 0.4;

        this.SVGPath2 = new SVGArc(this.svgElement, this.id + "path2", this.graphTop + " " + this.halfPanding + " " + this.graphWidth + " " + this.graphHeight);
        this.SVGPath2.color = theme.secondary;
        this.SVGPath2.opacity = 0.5;
        
        this.SVGLabel.text = "Graph";

        this.widgetLeft = this.centreX - this.textWidth / 2;
        this.widgetTop = (this.centreY + this.SVGLabel.height) - (this.textHeight * 4) / 2;

        var labelTextSize = this.size / 210;

        this.SVGTopLabel = new SVGText(this.svgElement, this.id + "toplabel", labelTextSize);
        this.SVGTopLabel.color = theme.secondary;

        this.SVGMiddleLabel = new SVGText(this.svgElement, this.id + "toplabel", labelTextSize);
        this.SVGMiddleLabel.color = theme.secondary;

        this.SVGDownLabel = new SVGText(this.svgElement, this.id + "toplabel", labelTextSize);
        this.SVGDownLabel.color = theme.secondary;

        this.SVGTopLabel.x = this.SVGMiddleLabel.x = this.SVGDownLabel.x = this.width / 48;

        this.SVGTopLine = new SVGRect(this.svgElement, this.id + "topline", this.width / 48, 0, this.graphWidth, 1);
        this.SVGTopLine.opacity = 0.1;
        this.SVGTopLine.color = theme.secondary;

        this.SVGMiddleLine = new SVGRect(this.svgElement, this.id + "middlieline", this.width / 48, 0, this.graphWidth, 1);
        this.SVGMiddleLine.opacity = 0.1;
        this.SVGMiddleLine.color = theme.secondary;

        this.SVGDownLine = new SVGRect(this.svgElement, this.id + "downline", this.width / 48, 0, this.graphWidth, 1);
        this.SVGDownLine.opacity = 0.1;
        this.SVGDownLine.color = theme.secondary;

        if (icon != undefined) {
            this.SVGIcon = new SVGIcon(this.svgElement, icon, this.width - this.size / 6, this.size / 24, this.size / 8, this.size / 8);
        }
        else {
            this.SVGIcon = new SVGIcon(this.svgElement, addIcon, this.width - this.size / 6, this.size / 24, this.size / 8, this.size / 8);
        } 

        this.SVGIcon.fill = theme.secondary;

        this.SVGWidgetText.hide();
        this.SVGArcSpinner.x = this.centreX;

        this.ShowEqualizer = false;
        
        this.SVGRightIcon.x = this.width - this.rowSize;
      //  this.SVGPlusIcon.x = this.width / 2 - this.rowSize / 2;
        this.SVGMinusIcon.x = this.width / 2 - this.rowSize / 2;

        this.clickableToTop();

    }

    refresh(widgetText, label, historyData) {
        label = getLang(label);
        this.widgetText = widgetText;
        this.label = label;
        
        this.historyData = historyData;
        this.spinnerAngle = 0;
        this.redrawAll();
    }

    //---------------------------------------------------------------------------------------
    //draw element text labels - percent value and text 
    drawText() {
        super.drawText();
    }

    drawWidget() {


        if (this.historyData != undefined) {
            //reset 
       
            var updatedFilteredData = historyDataFilter(this.graphWidth, this.historyData, 1, 1);

            //It is important to draw Y lalues at first and curve after!!!
            grawYValuesPoints(this.SVGTopLabel, this.SVGMiddleLabel, this.SVGDownLabel, updatedFilteredData);

            var d = curveForDrawing(updatedFilteredData, this.graphHeight, this.graphTop, 5);
           
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
                default: //offline
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


            super.drawWidget();
        }
    }

}

function isIntegerNumber(num) {
    return (num ^ 0) === num;
}


function grawYValuesPoints(topLable, middleLable, downLable, filteredArrayForDrawY) {
    var maxValueY;
    var minValueY;

    for (var gLocal = 0; gLocal < filteredArrayForDrawY.length; gLocal++) {
        var valueYLocal = parseFloat(filteredArrayForDrawY[gLocal]);

        if ((maxValueY == undefined) || (valueYLocal > maxValueY)) {
            maxValueY = valueYLocal;
        }

        if ((minValueY == undefined) || (valueYLocal < minValueY)) {
            minValueY = valueYLocal;
        }
    }

    var middleValueY;

    if (minValueY == maxValueY) {
        minValueY -= minValueY * 0.1;
        maxValueY += maxValueY * 0.1;
        middleValueY = minValueY + (maxValueY - minValueY) / 2;
    }
    else {

        middleValueY = (maxValueY - minValueY) / 2;
        maxValueY += middleValueY;
        minValueY -= middleValueY;

        middleValueY = minValueY + (maxValueY - minValueY) / 2;
    }

    if (!isIntegerNumber(maxValueY) || !isIntegerNumber(middleValueY) || !isIntegerNumber(minValueY)) {
        maxValueY = maxValueY.toFixed(2);
        minValueY = minValueY.toFixed(2);
        middleValueY = middleValueY.toFixed(2);
    }

    topLable.text = maxValueY;
    middleLable.text = middleValueY;
    downLable.text = minValueY;

}

function grawXValues(parentPanel, id, graphPlotWidth, graphPlotHight, graphTopY, startXpoint, historyDataArr, lastPointTimeMiliseconds, timeUnitInMinutes, zoomInOut, shiftLeftRight) {
    var maxPointsX = 3 * (Math.trunc((graphPlotWidth - 20) / 30) + 1);

    var splitHistoryDataXArray = historyDataArr.split(";");
    var historyDataXCount = splitHistoryDataXArray.length - 1;
    let xPointsArray;



    if (maxPointsX >= historyDataXCount) {


        xPointsArray = new Array(historyDataXCount);
        for (var ix = 0; ix < xPointsArray.length; ix++) {
            xPointsArray[ix] = lastPointTimeMiliseconds - timeUnitInMinutes * 1000 * 60 * (xPointsArray.length - 1 - ix);
        }

    }
    else {

        xPointsArray = new Array(maxPointsX);
        var historyDataXZeroPosition = 0;

        //checking if history data has more then 1440 elements
        if (historyDataXCount > 1440) {
            historyDataXZeroPosition = historyDataXCount - 1440;
        }

        var dayHistoryXLength = historyDataXCount - historyDataXZeroPosition;
        var historyDataXFilterStep = Math.trunc(dayHistoryXLength / xPointsArray.length);
        var deltaTime = dayHistoryXLength - historyDataXFilterStep * xPointsArray.length;

        if (deltaTime <= 0) {

            for (var ixp = 0; ixp < xPointsArray.length; ixp++) {
                xPointsArray[ixp] = lastPointTimeMiliseconds - 1000 * 60 * timeUnitInMinutes * historyDataXFilterStep * (xPointsArray.length - (ixp + 1));
            }
        }
        else {
            for (var ixpd = 0; ixpd < xPointsArray.length; ixpd++) {
                xPointsArray[ixpd] = lastPointTimeMiliseconds - 1000 * 60 * timeUnitInMinutes * (deltaTime + historyDataXFilterStep * (xPointsArray.length - (ixpd + 1)));
            }
        }

    }


    let startXValue = new Date(xPointsArray[0]);

    var SVGTTextXValue = new SVGText(parentPanel, id + "startXValue", graphPlotHight / 255);
    SVGTTextXValue.x = startXpoint;
    SVGTTextXValue.y = graphTopY + graphPlotHight + 10;
    SVGTTextXValue.text = startXValue.getHours() + ":" + startXValue.getMinutes();
    var nextXTestPosition = startXpoint + SVGTTextXValue.getTextWidth();


    let finishXValue = new Date(xPointsArray[xPointsArray.length - 1]);

    var SVGTTextXFinishValue = new SVGText(parentPanel, id + "finishXValue", graphPlotHight / 255);
    SVGTTextXFinishValue.x = startXpoint + Math.trunc(graphPlotWidth / (xPointsArray.length)) * (xPointsArray.length - 1) - 20;
    SVGTTextXFinishValue.y = graphTopY + graphPlotHight + 10;
    SVGTTextXFinishValue.text = finishXValue.getHours() + ":" + finishXValue.getMinutes();

}


function curveForDrawing(filteredDataArray, graphPlotHight, graphTopY, graphStartX) {

    var maxLocalValue;
    var minLocalValue;

    //Find max and min value
    for (var mLocal = 0; mLocal < filteredDataArray.length; mLocal++) {

        var valueLocal = parseFloat(filteredDataArray[mLocal]);

        if ((maxLocalValue == undefined) || (valueLocal > maxLocalValue)) {
            maxLocalValue = valueLocal;
        }

        if ((minLocalValue == undefined) || (valueLocal < minLocalValue)) {
            minLocalValue = valueLocal;
        }
    }

    var stepLocal = 10;

    var halfStepLocal = stepLocal / 3;


    //If min == max then we decrease small value and increase big value by 10%
    if (maxLocalValue == minLocalValue) {
        maxLocalValue += maxLocalValue * 0.1;
        minLocalValue -= minLocalValue * 0.1;
    }
    else {
        var middleLocalValue = (maxLocalValue - minLocalValue) / 2;
        maxLocalValue += middleLocalValue;
        minLocalValue -= middleLocalValue;
    }

    var proportionLocal = graphPlotHight / (maxLocalValue - minLocalValue);

    //normalize Y
    for (var lLocal = 0; lLocal < filteredDataArray.length; lLocal++) {
        filteredDataArray[lLocal] = parseFloat(graphTopY + (graphPlotHight - (filteredDataArray[lLocal] - minLocalValue) * proportionLocal));
    }

    var topOffsetLocal = parseFloat(graphPlotHight + graphTopY);

    var dLocal = "M " + graphStartX + ", " + topOffsetLocal;

    for (var nLocal = 0; nLocal < filteredDataArray.length; nLocal++) {

        if (nLocal == 0) {
            dLocal += " C " + graphStartX + ", " + filteredDataArray[nLocal] + " "
                + graphStartX + ", " + topOffsetLocal + " "
                + graphStartX + ", " + filteredDataArray[nLocal] + " ";
        }
        else {

            var s1 = parseFloat(graphStartX + nLocal * stepLocal - halfStepLocal * 2);
            var s2 = parseFloat(graphStartX + nLocal * stepLocal - halfStepLocal);
            var s3 = parseFloat(graphStartX + nLocal * stepLocal);

            dLocal += " C " + s1 + ", " + filteredDataArray[nLocal - 1] + " "
                + s2 + ", " + filteredDataArray[nLocal] + " "
                + s3 + ", " + filteredDataArray[nLocal] + " ";
        }

    }

    dLocal += " C " + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " "
        + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " "
        + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " ";

    return dLocal;
}


function historyDataFilter(historyDataGraphPlotWidth, historyDataAsString, zoomInOut, shiftLeftRight) {

    var maxPossiblePlotPoints = 3 * (Math.trunc((historyDataGraphPlotWidth - 20) / 30) + 1);

    var splitHistoryDataFromString = historyDataAsString.split(";");

    var historyDataLength = splitHistoryDataFromString.length - 1;

    let filteredHistoryDataArray;

    if (maxPossiblePlotPoints >= historyDataLength) {

        filteredHistoryDataArray = new Array(historyDataLength);
        for (var hdi = 0; hdi < filteredHistoryDataArray.length; hdi++) {
            filteredHistoryDataArray[hdi] = splitHistoryDataFromString[hdi];
        }

    }
    else {

        filteredHistoryDataArrayLength = 3 * Math.trunc(maxPossiblePlotPoints / 3);

        filteredHistoryDataArray = new Array(filteredHistoryDataArrayLength);

        var filterStep = Math.trunc(3 * historyDataLength / filteredHistoryDataArray.length);


        var historyDataStartPosition = historyDataLength - ((filteredHistoryDataArray.length * filterStep) / 3);

        //fill the filltered array from last element to first.It is nessary to save last (more fresh) history datas

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

                if ((localBigValue == null) || (localBigValue == undefined) || (currentValue > localBigValue)) {
                    localBigValue = currentValue;
                    localBigValueIndex = historyDataStartPosition + filterStep * hdj + hdjj;
                }

                if ((localSmallValue == null) || (localSmallValue == undefined) || (currentValue < localSmallValue)) {
                    localSmallValue = currentValue;
                    localSmallValueIndex = historyDataStartPosition + filterStep * hdj + hdjj;
                }

                if (hdjj == 0) {
                    localMiddleValue = currentValue;
                }
                else {
                    localMiddleValue += currentValue;
                }
            }



            // if small value = max value => middle = (small+max)/2;
            if (localSmallValue == localBigValue) {
                localMiddleValue = (localSmallValue + localBigValue) / 2;

                filteredHistoryDataArray[3 * hdj] = localSmallValue;
                filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
            }
            else {
                //Calculate the local middle value as arithmetical mean
                localMiddleValue = localMiddleValue / filterStep;

                //find the local MiddleValue index
                for (var jt = 0; jt < filterStep; jt++) {
                    var currentValueForFindIndex = parseFloat(splitHistoryDataFromString[historyDataStartPosition + filterStep * hdj + jt]);
                    if ((localDeltaValue == null) || (localDeltaValue == undefined) || (Math.abs(localMiddleValue - currentValueForFindIndex) < localDeltaValue)) {
                        localDeltaValue = Math.abs(localMiddleValue - currentValueForFindIndex);
                        localMiddleValueIndex = historyDataStartPosition + filterStep * hdj + jt;
                    }
                }


                //Odering local max, min and middle value by their indexes
                if (localSmallValueIndex < localBigValueIndex) {
                    if (localSmallValueIndex < localMiddleValueIndex) {
                        filteredHistoryDataArray[3 * hdj] = localSmallValue;
                        if (localMiddleValueIndex < localBigValueIndex) {
                            filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                            filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                        }
                        else {
                            filteredHistoryDataArray[3 * hdj + 1] = localBigValue;
                            filteredHistoryDataArray[3 * hdj + 2] = localMiddleValue;
                        }
                    }
                    else {
                        filteredHistoryDataArray[3 * hdj] = localMiddleValue;
                        filteredHistoryDataArray[3 * hdj + 1] = localSmallValue;
                        filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                    }
                }
                else {
                    if (localBigValueIndex > localMiddleValueIndex) {
                        filteredHistoryDataArray[3 * hdj] = localMiddleValue;
                        filteredHistoryDataArray[3 * hdj + 1] = localBigValue;
                        filteredHistoryDataArray[3 * hdj + 2] = localSmallValue;
                    }
                    else {
                        filteredHistoryDataArray[3 * hdj] = localBigValue;
                        if (localMiddleValueIndex < localSmallValueIndex) {
                            filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                            filteredHistoryDataArray[3 * hdj + 2] = localSmallValue;
                        }
                        else {
                            filteredHistoryDataArray[3 * hdj + 1] = localSmallValue;
                            filteredHistoryDataArray[3 * hdj + 2] = localMiddleValue;
                        }

                    }

                }

            }


            //Clear the local values for next filtered set
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

