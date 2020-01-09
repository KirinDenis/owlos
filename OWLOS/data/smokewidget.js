class SmokeWidget extends BaseWidget {
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.radius = this.size / 30;
        this.topMargin = this.centreY + this.size / 15;

        this.animated = false;

        this.levelRectWidth = this.size / 10;
        this.levelRectHeight = this.size / 100;
        this.levelLeft = this.width - this.levelRectWidth - this.halfPanding;        
        this.levelTop = (this.height - this.levelRectHeight * 60 / 2) / 3;

        this.level1 = [];
        this.level2 = [];
        for (var i = 0; i < 10; i++) {
            this.SVGLevelRect1 = new SVGRect(this.svgElement, this.id + "levelrect1" + i, this.levelLeft, this.levelTop + i * (this.levelRectHeight * 2), this.levelRectWidth, this.levelRectHeight);
            this.SVGLevelRect2 = new SVGRect(this.svgElement, this.id + "levelrect2" + i, this.panding, this.levelTop + i * (this.levelRectHeight * 2), this.levelRectWidth, this.levelRectHeight);
            this.SVGLevelRect1.opacity = this.SVGLevelRect2.opacity = i / 30;
            this.SVGLevelRect1.color = this.SVGLevelRect2.color = theme.danger;
            this.level1.push(this.SVGLevelRect1);
            this.level2.push(this.SVGLevelRect2);
        }

        for (var i = 10; i < 20; i++) {
            this.SVGLevelRect1 = new SVGRect(this.svgElement, this.id + "levelrect" + i, this.levelLeft, this.levelTop + i * (this.levelRectHeight * 2), this.levelRectWidth, this.levelRectHeight);
            this.SVGLevelRect2 = new SVGRect(this.svgElement, this.id + "levelrect2" + i, this.panding, this.levelTop + i * (this.levelRectHeight * 2), this.levelRectWidth, this.levelRectHeight);
            this.SVGLevelRect1.opacity = this.SVGLevelRect2.opacity = i / 30;
            this.SVGLevelRect1.color = this.SVGLevelRect2.color = theme.warning;
            this.level1.push(this.SVGLevelRect1);
            this.level2.push(this.SVGLevelRect2);
        }

        for (var i = 20; i < 30; i++) {
            this.SVGLevelRect1 = new SVGRect(this.svgElement, this.id + "levelrect" + i, this.levelLeft, this.levelTop + i * (this.levelRectHeight * 2), this.levelRectWidth, this.levelRectHeight);
            this.SVGLevelRect2 = new SVGRect(this.svgElement, this.id + "levelrect2" + i, this.panding, this.levelTop + i * (this.levelRectHeight * 2), this.levelRectWidth, this.levelRectHeight);
            this.SVGLevelRect1.opacity = this.SVGLevelRect2.opacity = i / 30;
            this.SVGLevelRect1.color = this.SVGLevelRect2.color = theme.success;
            this.level1.push(this.SVGLevelRect1);
            this.level2.push(this.SVGLevelRect2);
        }


        this.levelArc = [];

        for (var i = 1; i < 5; i++) {
            var SVGlevelArc = new SVGArc(this.svgElement, this.id + "arcback1" + i, this.centreX, this.levelTop , i * this.radius, this.size / 34);
            SVGlevelArc.index = i;
            SVGlevelArc.color = theme.danger;
            this.levelArc.push(SVGlevelArc);
        }

        this.SVGArcSpinner.y = this.topMargin;

        this.clickableToTop();
    }

    refresh(data, widgetText, label) {
        widgetText = getLang(widgetText);
        super.refresh(data, widgetText, label);
    }


    drawText() {
        super.drawText();
    }

    animate() {
        if (this.animated) {
            for (var i = 0; i < 4; i++) {

                this.levelArc[i].radius += 1.5;
                this.levelArc[i].opacity -= 0.01;
                if (this.levelArc[i].radius > this.radius * 15) {
                    this.levelArc[i].radius = this.radius;
                    this.levelArc[i].opacity = 0.9;
                }
                this.levelArc[i].draw(90 + 60, 270 - 60);

            }
            requestAnimationFrame(() => this.animate());
        }
    }


    drawWidget() {
        super.drawWidget();

        for (var i = 0; i < 30; i++) {
            this.level1[i].opacity = this.level2[i].opacity = 0.0;
        }

        var position = (30 / 100) * this._data;

        if (position > 30) {            
            position = 30;
        }
        for (var i = 29; i > 30 - position; i--) {
            this.level1[i].opacity = this.level2[i].opacity = 1.2 - i / 30;
            
        }

        if ((this._networkStatus == NET_ONLINE) && (this._data > 60)) {
            if (!this.animated) {
                this.animated = true;
                requestAnimationFrame(() => this.animate());

            }
        }
        else {
            this.animated = false;
            for (var i = 0; i < 4; i++) {
                this.levelArc[i].hide();
            }
        }

    }
}

