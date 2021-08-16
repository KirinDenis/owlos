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

#ifndef BUTTONCONTROL_H
#define BUTTONCONTROL_H

#include <Arduino.h>
#include "../UXColors.h"
#include "../UXUtils.h"

#define BUTTON_TOUCH_NOTDEFINE 0
#define BUTTON_TOUCH_YES 1
#define BUTTON_TOUCH_NO 2

//Button Class
class ButtonControlClass
{
protected:
    bool leftAlign = true;
    int fgColor = OWLOSLightColor;
    int bgColor = OWLOSInfoColor;
    int touchColor = OWLOSWarningColor;
    int selectColor = OWLOSDarkColor;
    String text = "";

public:
    int x;
    int y;
    int text_x;
    int text_y;
    int touch = BUTTON_TOUCH_NOTDEFINE;
    bool selected = false;

    void (*OnTouchEvent)();
    //column - 1,2,3,4
    //         0,2 - align left  (0, width / 2)
    //         1,3 - align right (width / 2, width)
    //row --> row * Glod8 = y
    ButtonControlClass(String _text, int _fgColor, int _bgColor, int _selectColor, int column, int row);
    void refresh();
    void draw();
};

#endif