#include "TextControl.h"

extern TFT_eSPI tft;

//column - 1,2,3,4
//         0,2 - align left  (0, width / 2)
//         1,3 - align right (width / 2, width)
//row --> row * Glod8 = y
TextControlClass::TextControlClass(int column, int row)
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

void TextControlClass::draw()
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

void TextControlClass::refresh()
{
    tft.setTextColor(fgColor, bgColor);
    draw();
}

void TextControlClass::draw(String _text, int _fgColor, int _bgColor, int _size)
{
    //если текст не совпадает - закрываем предидущий текст цветом предидущего фона
    if ((!_text.equals(text)) || (_size != size))
    {
        tft.setTextColor(bgColor, bgColor);
        draw();
    }
    //если один из параметров текстра изменился, перерисовываем с новыми параметрами
    if ((!_text.equals(text)) || (fgColor != _fgColor) || (bgColor != _bgColor) || (_size != size))
    {
        text = _text;
        fgColor = _fgColor;
        bgColor = _bgColor;
        size = _size;    
        refresh();
    }
}