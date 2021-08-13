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
    int selectColor = OWLOSWarningColor;
    String text = "";
    
public:
    int x;
    int y;
    int text_x;
    int text_y;    
    void (*OnTouchEvent)();

    int touch = BUTTON_TOUCH_NOTDEFINE;
    //column - 1,2,3,4
    //         0,2 - align left  (0, width / 2)
    //         1,3 - align right (width / 2, width)
    //row --> row * Glod8 = y
    ButtonControlClass(String _text, int _fgColor, int _bgColor, int _selectColor, int column, int row);
    void refresh();
    void draw();
};

#endif