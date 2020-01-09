class LightWidget extends BaseWidget {
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.radius = this.size / 10;
        this.topMargin = this.height - this.size / 6;

        this.animated = false;

        this.levelArc = [];

        for (var i = 1; i < 5; i++) {
            var SVGlevelArc = new SVGArc(this.svgElement, this.id + "arcback1" + i, this.centreX, this.topMargin, i * this.radius, this.size / 14);           
            SVGlevelArc.index = i;
            SVGlevelArc.color = theme.warning;
            SVGlevelArc.opacity = 0.7;
            this.levelArc.push(SVGlevelArc);
        }

        this.SVGArcSpinner.y = this.topMargin;
        this.SVGArcSpinner.radius = this.radius * 4.5;

        this.clickableToTop();
    }

    refresh(data, widgetText, label) {
        widgetText = getLang(widgetText);
        super.refresh(data, widgetText, label);
    }


    drawText() {
        super.drawText();
        this.SVGWidgetText.y = this.size / 5 + this.SVGWidgetText.height / 2;;
    }


    drawWidget() {
        super.drawWidget();
        
        for (var i = 0; i < 4; i++) {                       
            this.levelArc[i].hide();

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.levelArc[i], theme.warning);
                    this.levelArc[i].opacity = 0.7;
                    break;
                case NET_ERROR:
                    this.toColor(this.levelArc[i], theme.danger);
                    this.levelArc[i].opacity = 0.4;
                    break;
                case NET_RECONNECT:
                    this.toColor(this.levelArc[i], theme.info);
                    this.levelArc[i].opacity = 0.4;
                    break;
                default: //offline
                    this.toColor(this.levelArc[i], theme.secondary);
                    this.levelArc[i].opacity = 0.4;
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


    }
}

