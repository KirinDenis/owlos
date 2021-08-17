#include "EditControl.h"

#include "KeyButtonControl.h"

#define BLINK_TIME 500

#define KEYBOARD_LINE_1  "`1234567890-+"
#define KEYBOARD_LINE_2  "qwertyuiop[]"
#define KEYBOARD_LINE_3  "asdfghjkl;'\\"
#define KEYBOARD_LINE_4  "\\zxcvbnm,./ "

extern TFT_eSPI tft;

extern int currentMode;

extern uint16_t tx, ty;
extern bool inTouch;


bool cursorBlink = false;
int cursorPosition = 0;

unsigned long lastBlink = 0;


#define KEYS_COUNT sizeof(KEYBOARD_LINE_1) + sizeof(KEYBOARD_LINE_2) + sizeof(KEYBOARD_LINE_3) + sizeof(KEYBOARD_LINE_4)
KeyButtonControlClass *keysList[KEYS_COUNT];

String text = "";

void KeyTouchEvent(String key)
{
    text += key;
    cursorPosition = text.length() + 1;
}

void EditControlInit()
{
    tft.fillScreen(OWLOSDarkColor);

    int keyCount = 0;
    int top = GOLD_8*4;
    int center = (WIDTH - (sizeof(KEYBOARD_LINE_1)-1) * (GOLD_7 + GOLD_11)) / 2;
    for (int i=0; i < sizeof(KEYBOARD_LINE_1)-1; i++)
    {        
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_1[i]),OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7 );
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }

    top += GOLD_7 + GOLD_11;
    center = (WIDTH - (sizeof(KEYBOARD_LINE_2)-1) * (GOLD_7 + GOLD_11)) / 2;
    for (int i=0; i < sizeof(KEYBOARD_LINE_2)-1; i++)
    {        
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_2[i]),OWLOSLightColor, OWLOSPrimaryColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7 );
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }

    top += GOLD_7 + GOLD_11;
    center = (WIDTH - (sizeof(KEYBOARD_LINE_3)-1) * (GOLD_7 + GOLD_11)) / 2;
    for (int i=0; i < sizeof(KEYBOARD_LINE_3)-1; i++)
    {        
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_3[i]),OWLOSLightColor, OWLOSPrimaryColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7 );
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }

    top += GOLD_7 + GOLD_11;
    center = (WIDTH - (sizeof(KEYBOARD_LINE_4)-1) * (GOLD_7 + GOLD_11)) / 2;
    for (int i=0; i < sizeof(KEYBOARD_LINE_4)-1; i++)
    {        
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_4[i]),OWLOSLightColor, OWLOSPrimaryColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7 );
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }
}

void EditControlRefresh()
{
    tft.drawRect(0, GOLD_8, WIDTH, tft.fontHeight(2) + GOLD_9, OWLOSInfoColor);
}

void EditControlDraw()
{
    tft.setTextColor(OWLOSLightColor, OWLOSDarkColor);
    tft.drawString(text + " ", GOLD_9, GOLD_8 + GOLD_11, 2);

    if (cursorBlink)
    {
        int cursorLeft = tft.textWidth(text, 2);
        char cursorChar = ' ';
        if (cursorPosition <= text.length())
        {
          cursorLeft = tft.textWidth(text.substring(0, cursorPosition), 2);            
          cursorChar = text[cursorPosition];          
        }

        tft.setTextColor(OWLOSDarkColor, OWLOSLightColor);
        tft.drawString(String(cursorChar), GOLD_9 + cursorLeft, GOLD_8 + GOLD_11, 2);
    }

    if (lastBlink + BLINK_TIME < millis())
    {
        cursorBlink = !cursorBlink;
        lastBlink = millis();
    }

    tx = 0; 
    ty = 0;
    inTouch = false;

    for (int i=0; i < KEYS_COUNT; i++)
    {   
        if (keysList[i] != nullptr)     
        {
           keysList[i]->draw();
           if (keysList[i]->touch == BUTTON_TOUCH_YES)
           {
               break;
           }
        }
    }

}
