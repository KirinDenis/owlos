class GraphIndicator extends BaseIndicator {
    constructor(parentPanel, id, size, icon) {
        super(parentPanel, id, size);

        this.topMargin = this.size / 20;
        //this.panding = 5;
        this.width = this.size * 2;
        this.height = this.size - this.panding;

        this.centreX = this.width / 2;
        //  this.centreY = this.height / 2;

        this.indicatorTextSize = this.size / 110;

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

        this.indicatorLeft = this.centreX - this.textWidth / 2;
        this.indicatorTop = (this.centreY + this.SVGLabel.height) - (this.textHeight * 4) / 2;

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

        this.SVGIndicatorText.hide();
        this.SVGArcSpinner.x = this.centreX;

        this.ShowEqualizer = false;
        
        this.SVGRightIcon.x = this.width - this.rowSize;
      //  this.SVGPlusIcon.x = this.width / 2 - this.rowSize / 2;
        this.SVGMinusIcon.x = this.width / 2 - this.rowSize / 2;

        this.clickableToTop();

    }

    refresh(indicatorText, label, historyData) {
        label = getLang(label);
        this.indicatorText = indicatorText;
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

    drawIndicator() {


        if (this.historyData != undefined) {
            //reset 

            var splitHistory = this.historyData.split(";");
            var count = parseInt(splitHistory[0]);
            var step = parseFloat(this.graphWidth / (count-1));
            var halfStep = step / 3;

            var bigValue;
            var smallValue;

            for (var x = 1; x < count+1; x++) {                
                var value = parseFloat(splitHistory[x]);
                if ((bigValue == undefined) || (value > bigValue)) {
                    bigValue = value;
                }

                if ((smallValue == undefined) || (value < smallValue)) {
                    smallValue = value;
                }

            }

            var proportion = this.graphHeight / (bigValue - smallValue);
            //normalize Y
            for (var x = 1; x < count + 1; x++) {
                splitHistory[x] = parseFloat(this.graphTop + (this.graphHeight - (splitHistory[x] - smallValue) * proportion));
            }

            var topOffset = parseFloat(this.graphHeight + this.graphTop);

            var d = "M 0, " + topOffset;

            var s1 = parseFloat(step - halfStep * 2);
            var s2 = parseFloat(step - halfStep);
            var s3 = parseFloat(step);

            d += " C 0, " + splitHistory[1] + " "
                + "0, " + splitHistory[1] + " "
                + "0, " + splitHistory[1] + " ";


            for (var x = 2; x < count+1; x++) {
                var s1 = parseFloat((x - 1) * step - halfStep * 2);
                var s2 = parseFloat((x - 1) * step - halfStep);
                var s3 = parseFloat((x - 1) * step);
                d += " C " + s1 + ", " + splitHistory[x-1] + " "
                    + s2 + ", " + splitHistory[x] + " "
                    + s3 + ", " + splitHistory[x] + " ";
            }

            d += " C " + this.width + "," + topOffset +" "
                + this.width + "," + topOffset + " "
                + this.width + "," + topOffset + " ";

           
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


            this.SVGTopLabel.text = parseFloat(bigValue).toFixed(2);;
            this.SVGMiddleLabel.text = parseFloat(bigValue - (bigValue - smallValue) / 2).toFixed(2);;
            this.SVGDownLabel.text = parseFloat(smallValue).toFixed(2);;

            
            this.SVGTopLabel.y = this.SVGTopLine.y = this.graphTop;
            this.SVGTopLine.x = this.SVGTopLabel.x + this.SVGTopLabel.width;
            this.SVGMiddleLabel.y = this.SVGMiddleLine.y = this.graphTop + this.graphHeight / 2;
            this.SVGMiddleLine.x = this.SVGMiddleLabel.x + this.SVGMiddleLabel.width;
            this.SVGDownLabel.y = this.SVGDownLine.y = this.graphTop + this.graphHeight - this.size / 100;
            this.SVGDownLine.x = this.SVGDownLabel.x + this.SVGDownLabel.width;

            this.SVGPath1.drawPath(d);
            this.SVGPath2.drawPath(d);


            super.drawIndicator();
        }
    }

}

