/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2021 by:
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

#include "ButtonControl.h"
extern TFT_eSPI tft;

extern uint16_t touchX, touchY;
extern bool touch;
//Button Class
//column - 1,2,3,4
//         0,2 - align left  (0, width / 2)
//         1,3 - align right (width / 2, width)
//row --> row * Glod8 = y
ButtonControlClass::ButtonControlClass(String _text, int _fgColor, int _bgColor, int _touchColor, int column, int row)
{
    text = _text;
    fgColor = _fgColor;
    bgColor = _bgColor;
    touchColor = _touchColor;

    x = (column - 1) * (WIDTH / 4) + GOLD_11;
    y = row * GOLD_8 + GOLD_11;

    text_x = x + (WIDTH / 4 - tft.textWidth(_text, 2)) / 2;
    text_y = y + GOLD_7 / 4;
}

void ButtonControlClass::refresh()
{
    if (!selected)
    {
        tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, bgColor);
        tft.setTextColor(fgColor, bgColor);
    }
    else
    {
        tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, selectColor);
        tft.setTextColor(fgColor, selectColor);
        tft.drawFastHLine(x, y + GOLD_7, WIDTH / 4 - GOLD_11, bgColor);
    }
    tft.drawString(text, text_x, text_y, 2);
}

void ButtonControlClass::draw()
{
    
    if (touch)
    {
        if ((touchX > x) && (touchX < x + WIDTH / 4) && (touchY > y) && (touchY < y + GOLD_8 * 2))
        {
            if (inTouch != BUTTON_TOUCH_YES)
            {
                if (!selected)
                {
                    tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, touchColor);
                    tft.setTextColor(fgColor, touchColor);
                }
                else
                {
                    tft.fillRect(x, y, WIDTH / 4 - GOLD_11, GOLD_7, selectColor);
                    tft.setTextColor(fgColor, selectColor);
                    tft.drawFastHLine(x, y + GOLD_7, WIDTH / 4 - GOLD_11, bgColor);
                }
                tft.drawString(text, text_x, text_y, 2);
                if (OnTouchEvent != nullptr)
                {
                    (*OnTouchEvent)();
                }
            }
            inTouch = BUTTON_TOUCH_YES;
        }
    }
    else
    {
        if (inTouch != BUTTON_TOUCH_NO)
        {
            refresh();
        }
        inTouch = BUTTON_TOUCH_NO;
    }
}
