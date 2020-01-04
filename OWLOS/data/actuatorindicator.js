var DEFAULT_TYPE = 0;
var ICONS_TYPE = 1;

class ActuatorIndicator extends BaseIndicator {
    constructor(parentPanel, id, size, iconOn, iconOff) {
        super(parentPanel, id, size);

        if ((iconOn == undefined) && (iconOff == undefined)) {
            this.indicatorType = DEFAULT_TYPE;
            this.SVGArcBack = new SVGArc(this.svgElement, this.id + "arcback", this.centreX, this.centreY + this.topMargin, this.radius + this.size / 20, this.size / 100);
            this.SVGArcBack.color = theme.secondary;

            this.SVGArcIndicator = new SVGArc(this.svgElement, this.id + "arcindicator", this.centreX, this.centreY + this.topMargin, this.radius, this.size / 14);
            this.SVGArcIndicator.color = theme.secondary;
            this.SVGArcIndicator.fill = theme.secondary;
        }
        else {
            this.indicatorType = ICONS_TYPE;
            this.rowSize = this.size / 2.5;
            this.iconOn = iconOn;
            this.SVGIconOn = new SVGIcon(this.svgElement, this.iconOn, this.width / 2 - this.rowSize / 2, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
            this.SVGIconOn.fill = theme.success;
            this.SVGIconOn.SVGIcon.indicator = this;
            this.SVGIconOn.hide();

            this.iconOff = iconOff;
            this.SVGIconOff = new SVGIcon(this.svgElement, this.iconOff, this.width / 2 - this.rowSize / 2, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
            this.SVGIconOff.fill = theme.success;
            this.SVGIconOff.SVGIcon.indicator = this;
            this.SVGIconOff.hide();

            this.SVGArcSpinner.y = this.centreY;
        }


        this.SVGIndicatorText.hide();
        this.ShowEqualizer = false;
        this.clickableToTop();
    }


    drawIndicator() {

        super.drawIndicator();

        if (this.indicatorType == DEFAULT_TYPE) {
            //back radial indicator
            this.SVGArcBack.draw(0, 359.99);

            //radial indicator
            if (this.data != 0) {
                this.SVGArcIndicator.draw(0, 359.99);
            }
            else {
                this.SVGArcIndicator.hide();
            }

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.SVGArcBack, theme.success);
                    this.toColor(this.SVGArcIndicator, theme.success, false);
                    break;
                case NET_ERROR:
                    this.toColor(this.SVGArcBack, theme.danger);
                    this.toColor(this.SVGArcIndicator, theme.danger, false);
                    break;
                case NET_RECONNECT:
                    this.toColor(this.SVGArcBack, theme.info);
                    this.toColor(this.SVGArcIndicator, theme.info, false);
                    break;
                default: //offline
                    this.toColor(this.SVGArcBack, theme.secondary);
                    this.toColor(this.SVGArcIndicator, theme.secondary, false);
                    break;
            }
        }
        else {
            if (this.data != 0) {
                this.SVGIconOn.draw();
                this.SVGIconOff.hide();
            }
            else {
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
                default: //offline
                    this.SVGIconOn.fill = theme.secondary;
                    this.SVGIconOff.fill = theme.secondary;
                    break;
            }

        }

    }
}


