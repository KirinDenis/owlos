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

#ifndef TEXTCONTROL_H
#define TEXTCONTROL_H

//#include <Arduino.h>
#include "../UXColors.h"
#include "../UXUtils.h"

/* ------------------------------------------------------
Класс рисует один item 
Вводная:
- 4 колонки на весь экран
- Gold8 высота одной строчки
- align 
  |col1          |col2       |col3          |col4       |
  |Left          |      Right|Left          |      Right|
         
*/
class TextControlClass
{
protected:
  bool leftAlign = true;
  bool inTouch = false;
  int size = 1;
  int fgColor = OWLOSLightColor;
  int bgColor = OWLOSDarkColor;
  String text = "";
  void draw();

public:
  void (*OnTouchEvent)() = nullptr;
  
  int x;
  int y;
  //column - 1,2,3,4
  //         0,2 - align left  (0, width / 2)
  //         1,3 - align right (width / 2, width)
  //row --> row * Glod8 = y
  TextControlClass(int column, int row);
  void refresh();
  void draw(String _text, int _fgColor, int _bgColor, int _size);
};

#endif