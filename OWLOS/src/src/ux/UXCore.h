#ifndef UXCORE_H
#define UXCORE_H

#pragma once

#include <TFT_eSPI.h> // Hardware-specific library
#include <SPI.h>

#include "colors.h"

#define CENTRE 240
#define WIDTH 480
#define HEIGHT 320

#define GOLD_1 WIDTH
#define GOLD_2 297
#define GOLD_3 184
#define GOLD_4 114
#define GOLD_5 70
#define GOLD_6 43
#define GOLD_7 27
#define GOLD_8 17
#define GOLD_9 11
#define GOLD_10 7
#define GOLD_11 4
#define GOLD_12 3
#define GOLD_13 2
#define GOLD_14 1

#define OWLOSPrimaryColor rgb32_to_rgb16(0x6faeca)
#define OWLOSSecondaryColor rgb32_to_rgb16(0x213944)
#define OWLOSSuccessColor rgb32_to_rgb16(0x43ca15)
#define OWLOSInfoColor rgb32_to_rgb16(0x3c83a4)
#define OWLOSWarningColor rgb32_to_rgb16(0xdd7815)
#define OWLOSDangerColor rgb32_to_rgb16(0xdd2415)
#define OWLOSLightColor rgb32_to_rgb16(0xf4f9f4)
#define OWLOSDarkColor rgb32_to_rgb16(0x141515)


/* ------------------------------------------------------
Класс рисует один item 
Вводная:
- 4 колонки на весь экран
- Gold8 высота одной строчки
- align 
  |col1          |col2       |col3          |col4       |
  |Left          |      Right|Left          |      Right|
         
*/
class TextItemClass
{
protected:
    bool leftAlign = true;
    int size = 1;
    int fgColor = OWLOSLightColor;
    int bgColor = OWLOSDarkColor;
    String text = "";

    void drawText();
public:
    int x;
    int y;
    //column - 1,2,3,4
    //         0,2 - align left  (0, width / 2)
    //         1,3 - align right (width / 2, width)
    //row --> row * Glod8 = y
    TextItemClass(int column, int row);
    void draw(String _text, int _fgColor, int _bgColor, int _size);
};


void drawArc(int x, int y, int radiusFrom, int radiusTo, double angleFrom, double angleTo, int color);
void drawWifiIcon(int x, int y, int dBm);

#endif