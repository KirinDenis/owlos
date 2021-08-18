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

#include "KeyButtonControl.h"
extern TFT_eSPI tft;

uint16_t tx, ty;
bool inTouch = false;

KeyButtonControlClass::KeyButtonControlClass(String _text, int _fgColor, int _bgColor, int _touchColor, int _x, int _y, int _width, int _height)
    : ButtonControlClass(_text, _fgColor, _bgColor, _touchColor, 0, 0)
{
    //text = _text;
    //fgColor = _fgColor;
    //bgColor = _bgColor;
    //touchColor = _touchColor;

    x = _x;
    y = _y;
    width = _width;
    height = _height;

    text_x = x + (width - tft.textWidth(_text, 2)) / 2;
    text_y = y + (height - tft.fontHeight(2)) / 2;
}

void KeyButtonControlClass::refresh()
{
    if (!selected)
    {
        tft.fillRect(x, y, width, height, bgColor);
        tft.setTextColor(fgColor, bgColor);
    }
    else
    {
        tft.fillRect(x, y, width, height, selectColor);
        tft.setTextColor(fgColor, selectColor);
        //tft.drawFastHLine(x, y + GOLD_7, width - GOLD_11, bgColor);
    }
    tft.drawString(text, text_x, text_y, 2);
}

void KeyButtonControlClass::draw()
{
    if ((tx == 0) || (ty == 0))
    {
        inTouch = tft.getTouch(&tx, &ty);
    }
    //Serial.println(tx) ;
    //Serial.println(ty) ;
    //Serial.println(inTouch);
    //Serial.println(text);
    //Serial.println("----");

    if (inTouch)
    {
        if ((tx > x) && (tx < x + width) && (ty > y) && (ty < y + height))
        {
            if (touch != BUTTON_TOUCH_YES)
            {
                if (!selected)
                {
                    tft.fillRect(x, y, width, height, touchColor);
                    tft.setTextColor(fgColor, touchColor);
                }
                else
                {
                    tft.fillRect(x, y, width, height, selectColor);
                    tft.setTextColor(fgColor, selectColor);
                    tft.drawFastHLine(x, y + GOLD_7, width - GOLD_11, bgColor);
                }
                tft.drawString(text, text_x, text_y, 2);
                if (OnKeyTouchEvent != nullptr)
                {
                    (*OnKeyTouchEvent)(text);
                }
                if (OnTouchEvent != nullptr)
                {
                    (*OnTouchEvent)();
                }
            }
            touch = BUTTON_TOUCH_YES;
        }
    }
    else
    {
        if (touch != BUTTON_TOUCH_NO)
        {
            refresh();
        }
        touch = BUTTON_TOUCH_NO;
    }
}

void KeyButtonControlClass::setText(String _text)
{
    text = _text;
}
