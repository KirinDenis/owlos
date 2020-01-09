class MotionWidget extends BaseWidget {
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.radius = this.size / 30;
        this.topMargin = this.centreY + this.size / 20;

        this.animated = false;
        this.radar1 = [];
        this.radar2 = [];
        this.radar3 = [];
        this.radar4 = [];

        for (var i = 1; i < 5; i++) {
            var SVGRadarArc1 = new SVGArc(this.svgElement, this.id + "arcback1" + i, this.centreX, this.topMargin, i * this.radius, this.size / 34);
            var SVGRadarArc2 = new SVGArc(this.svgElement, this.id + "arcback2" + i, this.centreX, this.topMargin, i * this.radius, this.size / 34);
            var SVGRadarArc3 = new SVGArc(this.svgElement, this.id + "arcback3" + i, this.centreX, this.topMargin, i * this.radius, this.size / 34);
            var SVGRadarArc4 = new SVGArc(this.svgElement, this.id + "arcback4" + i, this.centreX, this.topMargin, i * this.radius, this.size / 34);
            SVGRadarArc1.index = SVGRadarArc2.index = SVGRadarArc3.index = SVGRadarArc4.index = i;
            SVGRadarArc1.color = SVGRadarArc2.color = SVGRadarArc3.color = SVGRadarArc4.color = theme.success;
            this.radar1.push(SVGRadarArc1);
            this.radar2.push(SVGRadarArc2);
            this.radar3.push(SVGRadarArc3);
            this.radar4.push(SVGRadarArc4);
        }

        this.SVGArcSpinner.y = this.topMargin;
        this.clickableToTop();
    }

    refresh(data, widgetText, label, historyData) {
        widgetText = getLang(widgetText);
        super.refresh(data, widgetText, label, historyData);
    }


    drawText() {
        super.drawText();
    }

    animate() {
        if (this.animated) {
            for (var i = 0; i < 4; i++) {

                this.radar1[i].radius += 0.5;
                this.radar1[i].opacity -= 0.01;
                if (this.radar1[i].radius > this.radius * 8) {
                    this.radar1[i].radius = this.radius;
                    this.radar1[i].opacity = 0.9;
                }
                this.radar1[i].draw(270 + 15, 350 - 15);

                this.radar2[i].radius = this.radar3[i].radius = this.radar4[i].radius = this.radar1[i].radius;
                this.radar2[i].opacity = this.radar3[i].opacity = this.radar4[i].opacity = this.radar1[i].opacity;

                this.radar2[i].draw(15, 90 - 15);
                this.radar3[i].draw(90 + 16, 180 - 15);
                this.radar4[i].draw(180 + 15, 270 - 15);
            }
            requestAnimationFrame(() => this.animate());
        }
    }

    drawWidget() {
        super.drawWidget();



        if ((this._networkStatus == NET_ONLINE) && (this._data == 1)) {
            if (!this.animated) {
                this.animated = true;
                requestAnimationFrame(() => this.animate());
            }
        }
        else {
            this.animated = false;
            for (var i = 0; i < 4; i++) {
                this.radar1[i].hide();
                this.radar2[i].hide();
                this.radar3[i].hide();
                this.radar4[i].hide();
            }
        }

    }
}

