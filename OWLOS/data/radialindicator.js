class RadialIndicator extends BaseIndicator{
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.radius = this.size / 3;
        this.topMargin = this.centreY + this.size / 15;

        this.SVGArcBack = new SVGArc(this.svgElement, this.id + "arcback", this.centreX, this.topMargin, this.radius, this.size / 14);
        this.SVGArcBack.color = theme.secondary;
        this.SVGArcBack.opacity = 0.5;

        this.SVGArcIndicator = new SVGArc(this.svgElement, this.id + "arcindicator", this.centreX, this.topMargin, this.radius, this.size / 14);
        this.SVGArcIndicator.color = theme.secondary;

        this.SVGArcSpinner.y = this.topMargin;

        this.clickableToTop();

    }


    drawIndicator() {
        super.drawIndicator();

        var oneHangPercent = 360 + 90 + 30 - 240;
        var drawPercent = this.data * (oneHangPercent / 100);

        //back radial indicator
        this.SVGArcBack.draw(240, 240 + oneHangPercent);

        //radial indicator
        this.SVGArcIndicator.draw(240, 240 + drawPercent);

        switch (this._networkStatus) {
            case NET_ONLINE: this.toColor(this.SVGArcIndicator, theme.success); break;
            case NET_ERROR: this.toColor(this.SVGArcIndicator, theme.danger); break;
            case NET_RECONNECT: this.toColor(this.SVGArcIndicator, theme.info); break;
            default: //offline
                this.toColor(this.SVGArcIndicator, theme.light); break;
        }

    }
}

