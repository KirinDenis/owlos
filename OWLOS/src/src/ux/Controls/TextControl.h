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
    int size = 1;
    int fgColor = OWLOSLightColor;
    int bgColor = OWLOSDarkColor;
    String text = "";
    void draw();

public:
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