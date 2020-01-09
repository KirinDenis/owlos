class RadialWidget extends BaseWidget{
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.radius = this.size / 3;
        this.topMargin = this.centreY + this.size / 15;

        this.SVGArcBack = new SVGArc(this.svgElement, this.id + "arcback", this.centreX, this.topMargin, this.radius, this.size / 14);
        this.SVGArcBack.color = theme.secondary;
        this.SVGArcBack.opacity = 0.5;

        this.SVGArcWidget = new SVGArc(this.svgElement, this.id + "arcwidget", this.centreX, this.topMargin, this.radius, this.size / 14);
        this.SVGArcWidget.color = theme.secondary;

        this.SVGArcSpinner.y = this.topMargin;

        this.clickableToTop();

    }


    drawWidget() {
        super.drawWidget();

        var oneHangPercent = 360 + 90 + 30 - 240;
        var drawPercent = this.data * (oneHangPercent / 100);

        //back radial widget
        this.SVGArcBack.draw(240, 240 + oneHangPercent);

        //radial widget
        this.SVGArcWidget.draw(240, 240 + drawPercent);

        switch (this._networkStatus) {
            case NET_ONLINE: this.toColor(this.SVGArcWidget, theme.success); break;
            case NET_ERROR: this.toColor(this.SVGArcWidget, theme.danger); break;
            case NET_RECONNECT: this.toColor(this.SVGArcWidget, theme.info); break;
            default: //offline
                this.toColor(this.SVGArcWidget, theme.light); break;
        }

    }
}

