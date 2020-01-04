//0..100
//-50..50


class TemperatureIndicator extends BaseIndicator{
    constructor(parentPanel, id, size) {
        super(parentPanel, id, size);

        this.tempWidth = (this.width - this.panding * 2) / 40;
        this.tempHeight = this.height / 10;
        this.tempTop = this.height / 1.5 - this.tempHeight / 2;

        this.tempItem = [];
        for (var i = 0; i < 20; i++) {
            var svgRect = new SVGRect(this.svgElement, this.id + "tempItem" + i, this.panding + this.tempWidth * 2 * i, this.tempTop, this.tempWidth, this.tempHeight);
            if (i < 7) svgRect.color = theme.info;
            else 
                if (i < 14) svgRect.color = theme.warning;
                else 
                    svgRect.color = theme.danger;
            svgRect.opacity = 0.0;
            this.tempItem.push(svgRect);
        }

        this.tempIndexWidth = (this.width - this.panding * 3) / 80;
        this.tempIndexHeight = this.height / 5;
        this.tempIndexTop = this.height / 1.5 - this.tempIndexHeight / 2;

        this.svgTempIndex = new SVGRect(this.svgElement, this.id + "tempIndex" + i, 0, this.tempIndexTop, this.tempIndexWidth, this.tempIndexHeight);
        this.svgTempIndex.opacity = 0.7;
        this.svgTempIndex.color = theme.light;
        this.clickableToTop();
    }

    drawText() {
        super.drawText(0);
        this.SVGIndicatorText.y = this.height / 2.5 + this.tempHeight / 2; // this.tempTop + this.panding * 3 +  this.SVGIndicatorText.height;
    }


    drawIndicator() {
        super.drawIndicator();

        var percent = parseFloat(this._data) + 50;
        var tempSize = (20 / 100) * percent;

        for (var i = 0; i < 20; i++) {
            this.tempItem[i].opacity = 0.0;
        }

        
        for (var i = 0; i < tempSize; i++) {
            this.tempItem[i].opacity =  1.0 - ( 1.0 - i / 20 );
        }

        this.svgTempIndex.x = this.panding  + tempSize * this.tempWidth * 2;
        


    }
}

