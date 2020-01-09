var DEFAULT_TYPE = 0;
var ICONS_TYPE = 1;

class ActuatorWidget extends BaseWidget {
    constructor(parentPanel, id, size, iconOn, iconOff) {
        super(parentPanel, id, size);

        if ((iconOn == undefined) && (iconOff == undefined)) {
            this.widgetType = DEFAULT_TYPE;
            this.SVGArcBack = new SVGArc(this.svgElement, this.id + "arcback", this.centreX, this.centreY + this.topMargin, this.radius + this.size / 20, this.size / 100);
            this.SVGArcBack.color = theme.secondary;

            this.SVGArcWidget = new SVGArc(this.svgElement, this.id + "arcwidget", this.centreX, this.centreY + this.topMargin, this.radius, this.size / 14);
            this.SVGArcWidget.color = theme.secondary;
            this.SVGArcWidget.fill = theme.secondary;
        }
        else {
            this.widgetType = ICONS_TYPE;
            this.rowSize = this.size / 2.5;
            this.iconOn = iconOn;
            this.SVGIconOn = new SVGIcon(this.svgElement, this.iconOn, this.width / 2 - this.rowSize / 2, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
            this.SVGIconOn.fill = theme.success;
            this.SVGIconOn.SVGIcon.widget = this;
            this.SVGIconOn.hide();

            this.iconOff = iconOff;
            this.SVGIconOff = new SVGIcon(this.svgElement, this.iconOff, this.width / 2 - this.rowSize / 2, this.height / 2 - this.rowSize / 2, this.rowSize, this.rowSize);
            this.SVGIconOff.fill = theme.success;
            this.SVGIconOff.SVGIcon.widget = this;
            this.SVGIconOff.hide();

            this.SVGArcSpinner.y = this.centreY;
        }


        this.SVGWidgetText.hide();
        this.ShowEqualizer = false;
        this.clickableToTop();
    }


    drawWidget() {

        super.drawWidget();

        if (this.widgetType == DEFAULT_TYPE) {
            //back radial widget
            this.SVGArcBack.draw(0, 359.99);

            //radial widget
            if (this.data != 0) {
                this.SVGArcWidget.draw(0, 359.99);
            }
            else {
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
                default: //offline
                    this.toColor(this.SVGArcBack, theme.secondary);
                    this.toColor(this.SVGArcWidget, theme.secondary, false);
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


