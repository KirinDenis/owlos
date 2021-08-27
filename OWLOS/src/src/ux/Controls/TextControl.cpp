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
    if (OnTouchEvent != nullptr)
    {
        uint16_t tx, ty;
        if (tft.getTouch(&tx, &ty))
        {
            if (!inTouch)
            {
                inTouch = true;
                /*
                if (leftAlign)
                {
                    tft.fillRect(x, y, tft.textWidth(text, size), tft.fontHeight(size), OWLOSDangerColor);
                }
                else
                {
                    tft.fillRect(x - tft.textWidth(text, size), y, tft.textWidth(text, size), tft.fontHeight(size), OWLOSDangerColor);
                }
                */
                _bgColor = OWLOSDangerColor;
              //  refresh();
            }

            if (leftAlign)
            {
                if ((tx > x) && (tx < x + tft.textWidth(text, size)) && (ty > y) && (ty < y + tft.fontHeight(size)))
                {
                    (*OnTouchEvent)();
                    return;
                }
            }
            else
            {
                if ((tx < x) && (tx > x - tft.textWidth(text, size)) && (ty > y) && (ty < y + tft.fontHeight(size)))
                {

                    (*OnTouchEvent)();
                    return;
                }
            }
        }
        else
        {
            if (inTouch)
            {
                inTouch = false;
                /*
                if (leftAlign)
                {
                    tft.drawRect(x, y, tft.textWidth(text, size), tft.fontHeight(size), bgColor);
                }
                else
                {
                    tft.drawRect(x - tft.textWidth(text, size), y, tft.textWidth(text, size), tft.fontHeight(size), bgColor);
                }
                refresh();
                */
            }
        }
    }

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