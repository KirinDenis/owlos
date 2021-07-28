
#include "UXCore.h"
#include "../config.h"

TFT_eSPI tft = TFT_eSPI(); // Invoke custom library with default width and height


int currentMode = TRANSPORT_MODE;

//column - 1,2,3,4
//         0,2 - align left  (0, width / 2)
//         1,3 - align right (width / 2, width)
//row --> row * Glod8 = y
TextItemClass::TextItemClass(int column, int row)
{
    if (column == 0)
    {
        x = GOLD_9;
    }
    else if (column == 2)
    {
        x = (WIDTH / 2) + GOLD_9;
    }
    else
    {
        leftAlign = false;
        if (column == 1)
        {
            x = WIDTH / 2;
        }
        else
        {
            x = WIDTH;
        }
        x -= GOLD_9;
    }
    y = row * GOLD_8 + GOLD_11;
}

void TextItemClass::drawText()
{
    if (leftAlign)
    {
        tft.drawString(text, x, y, size);
    }
    else
    {
        tft.drawRightString(text, x, y, size);
    }
}

void TextItemClass::draw(String _text, int _fgColor, int _bgColor, int _size)
{
    //если текст не совпадает - закрываем предидущий текст цветом предидущего фона
    if ((!_text.equals(text)) || (_size != size))
    {
        tft.setTextColor(bgColor, bgColor);
        drawText();
    }
    //если один из параметров текстра изменился, перерисовываем с новыми параметрами
    if ((!_text.equals(text)) || (fgColor != _fgColor) || (bgColor != _bgColor) || (_size != size))
    {
        text = _text;
        fgColor = _fgColor;
        bgColor = _bgColor;
        size = _size;
        tft.setTextColor(fgColor, bgColor);
        drawText();
    }
}

//--------------------------------------------------------------------------------------------------
void drawArc(int x, int y, int radiusFrom, int radiusTo, double angleFrom, double angleTo, int color)
{
    double xp1, yp1, xp2, yp2;

    for (double radius = radiusFrom; radius < radiusTo; radius += 0.5)
    {
        xp2 = -1;
        for (double angle = angleFrom; angle < angleTo; angle += 0.05)
        {
            xp1 = radius * sin(angle) + x;
            yp1 = radius * cos(angle) + y;

            if (xp2 != -1)
            {
                tft.drawLine(xp1, yp1, xp2, yp2, color);
                tft.drawPixel(xp1, yp1 - 1, 0xAAAA);
                tft.drawPixel(xp1, yp1 + 1, 0xAAAA);
                tft.drawPixel(xp1, yp1, color);
            }

            xp2 = xp1;
            yp2 = yp1;
        }
    }
}

void drawWifiIcon(int x, int y, int dBm)
{
    double angleFrom = 3.14 - 0.7;
    double angleTo = 3.14 + 0.7;

    int color;

    int radius = GOLD_8;

    if (dBm > -50)
    {
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 1, radius - 0, angleFrom, angleTo, color);

    if (dBm > -67)
    {
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 8, radius - 7, angleFrom, angleTo, color);

    if (dBm > -70)
    {
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 15, radius - 14, angleFrom, angleTo, color);

    if (dBm > -80)
    {
        color = OWLOSLightColor;
    }
    else
    {
        color = 0xBBBB;
    }
    drawArc(x, y, radius - 22, radius - 21, angleFrom, angleTo, color);

    //tft.setTextColor(OWLOSLightColor, OWLOSDarkColor);
    //tft.drawString(String(dBm) + " dBn", x + GOLD_9, y + GOLD_11, 1);
}
