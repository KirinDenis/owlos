#include "ButtonControl.h"
extern TFT_eSPI tft;

//Button Class
//column - 1,2,3,4
//         0,2 - align left  (0, width / 2)
//         1,3 - align right (width / 2, width)
//row --> row * Glod8 = y
ButtonControlClass::ButtonControlClass(String _text, int _fgColor, int _bgColor, int _selectColor, int column, int row)
{
    text = _text;
    fgColor = _fgColor;
    bgColor = _bgColor;
    selectColor = _selectColor;

    x = (column - 1) * (WIDTH / 4) + GOLD_11;
    y = row * GOLD_8 + GOLD_11;

    text_x = x + (WIDTH / 4 - tft.textWidth(_text, 2)) / 2;
    text_y = y + GOLD_7 / 4;
}

void ButtonControlClass::draw()
{
    uint16_t tx, ty;
    if (tft.getTouch(&tx, &ty))
    {
        if ((tx > x) && (tx < x + WIDTH / 4) && (ty > y) && (ty < ty + GOLD_8 * 2))
        {
            if (touch != BUTTON_TOUCH_YES)
            {
                tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, selectColor);
                tft.setTextColor(fgColor, selectColor);
                tft.drawString(text, text_x, text_y, 2);
                (*OnTouchEvent)();
            }
            touch = BUTTON_TOUCH_YES;
        }
    }
    else
    {
        if (touch != BUTTON_TOUCH_NO)
        {
            tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, bgColor);
            tft.setTextColor(fgColor, bgColor);
            tft.drawString(text, text_x, text_y, 2);
        }
        touch = BUTTON_TOUCH_NO;
    }
}
