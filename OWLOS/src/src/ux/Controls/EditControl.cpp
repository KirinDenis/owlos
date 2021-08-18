#include "EditControl.h"

#include "KeyButtonControl.h"

#define BLINK_TIME 500

#define KEYBOARD_LINE_1 "`1234567890-="
#define KEYBOARD_LINE_2 "qwertyuiop[]"
#define KEYBOARD_LINE_3 "asdfghjkl;'\\"
#define KEYBOARD_LINE_4 "\\zxcvbnm,./"

#define KEYBOARD_LINE_1_SHIFT "~!@#$%^&*()_+"
#define KEYBOARD_LINE_2_SHIFT "QWERTYUIOP{}"
#define KEYBOARD_LINE_3_SHIFT "ASDFGHJKL:\"|"
#define KEYBOARD_LINE_4_SHIFT "|ZXCVBNM<>?"

extern TFT_eSPI tft;

extern int currentMode;

extern uint16_t tx, ty;
extern bool inTouch;

bool cursorBlink = false;
int cursorPosition = 0;

unsigned long lastBlink = 0;

String textLabel = "Text to edit:";

#define KEYS_COUNT sizeof(KEYBOARD_LINE_1) + sizeof(KEYBOARD_LINE_2) + sizeof(KEYBOARD_LINE_3) + sizeof(KEYBOARD_LINE_4) + 3

bool inShift = false;

KeyButtonControlClass *keysList[KEYS_COUNT];

String text = "";

void KeyTouchEvent(String key)
{
    text += key;
    cursorPosition = text.length() + 1;
}

void BackSpaceTouchEvent()
{
    if (text.length() > 0)
    {
        text = text.substring(0, text.length() - 1);
        cursorPosition--;
    }
}

void ShiftTouchEvent()
{
    inShift = !inShift;
    int keyCount = 0;
    if (!inShift)
    {
        for (int i = 0; i < sizeof(KEYBOARD_LINE_1) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_1[i]));
            keyCount++;
        }
        //skip backSpace
        keyCount++;
        for (int i = 0; i < sizeof(KEYBOARD_LINE_2) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_2[i]));
            keyCount++;
        }
        for (int i = 0; i < sizeof(KEYBOARD_LINE_3) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_3[i]));
            keyCount++;
        }
        for (int i = 0; i < sizeof(KEYBOARD_LINE_4) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_4[i]));
            keyCount++;
        }
    }
    else
    {
        for (int i = 0; i < sizeof(KEYBOARD_LINE_1_SHIFT) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_1_SHIFT[i]));
            keyCount++;
        }
        //skip backSpace
        keyCount++;
        for (int i = 0; i < sizeof(KEYBOARD_LINE_2_SHIFT) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_2_SHIFT[i]));
            keyCount++;
        }
        for (int i = 0; i < sizeof(KEYBOARD_LINE_3_SHIFT) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_3_SHIFT[i]));
            keyCount++;
        }
        for (int i = 0; i < sizeof(KEYBOARD_LINE_4_SHIFT) - 1; i++)
        {
            keysList[keyCount]->setText(String(KEYBOARD_LINE_4_SHIFT[i]));
            keyCount++;
        }
    }

    for (int i = 0; i < KEYS_COUNT; i++)
    {
        if (keysList[i] != nullptr)
        {
            keysList[i]->refresh();
        }
    }
}

void EditControlInit()
{
    tft.fillScreen(OWLOSDarkColor);

    int keyCount = 0;
    int top = GOLD_8 * 5;
    int center = (WIDTH - (sizeof(KEYBOARD_LINE_1) - 1) * (GOLD_7 + GOLD_11) - GOLD_6 / 2) / 2;
    for (int i = 0; i < sizeof(KEYBOARD_LINE_1) - 1; i++)
    {
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_1[i]), OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7);
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }

    //backspace
    keysList[keyCount] = new KeyButtonControlClass("BkSpc", OWLOSLightColor, OWLOSWarningColor, OWLOSDangerColor, keyCount * (GOLD_7 + GOLD_11) + center, top, GOLD_6, GOLD_7);
    keysList[keyCount]->OnTouchEvent = BackSpaceTouchEvent;
    keyCount++;

    top += GOLD_7 + GOLD_11;
    center = (WIDTH - (sizeof(KEYBOARD_LINE_2) - 1) * (GOLD_7 + GOLD_11)) / 2;
    for (int i = 0; i < sizeof(KEYBOARD_LINE_2) - 1; i++)
    {
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_2[i]), OWLOSLightColor, OWLOSPrimaryColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7);
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }

    top += GOLD_7 + GOLD_11;
    center = (WIDTH - (sizeof(KEYBOARD_LINE_3) - 1) * (GOLD_7 + GOLD_11)) / 2;
    for (int i = 0; i < sizeof(KEYBOARD_LINE_3) - 1; i++)
    {
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_3[i]), OWLOSLightColor, OWLOSPrimaryColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7);
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }

    top += GOLD_7 + GOLD_11;
    center = (WIDTH - (sizeof(KEYBOARD_LINE_4) - 1) * (GOLD_7 + GOLD_11)) / 2;
    for (int i = 0; i < sizeof(KEYBOARD_LINE_4) - 1; i++)
    {
        keysList[keyCount] = new KeyButtonControlClass(String(KEYBOARD_LINE_4[i]), OWLOSLightColor, OWLOSPrimaryColor, OWLOSWarningColor, i * (GOLD_7 + GOLD_11) + center, top, GOLD_7, GOLD_7);
        keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
        keyCount++;
    }

    //Shift
    keysList[keyCount] = new KeyButtonControlClass("Shift", OWLOSLightColor, OWLOSSuccessColor, OWLOSWarningColor, center - GOLD_6 - GOLD_11, top, GOLD_6, GOLD_7);
    keysList[keyCount]->OnTouchEvent = ShiftTouchEvent;
    keyCount++;

    //Space
    top += GOLD_7 + GOLD_11;
    center = (WIDTH - GOLD_4) / 2;
    keysList[keyCount] = new KeyButtonControlClass(" ", OWLOSLightColor, OWLOSPrimaryColor, OWLOSWarningColor, center, top, GOLD_4, GOLD_7);
    keysList[keyCount]->OnKeyTouchEvent = KeyTouchEvent;
    keyCount++;
}

void EditControlRefresh()
{
    tft.setTextColor(OWLOSInfoColor, OWLOSDarkColor);
    tft.drawString(textLabel, GOLD_9, GOLD_8, 2);

    tft.drawRect(0, GOLD_8 * 2, WIDTH, tft.fontHeight(2) + GOLD_9, OWLOSInfoColor);
}

void EditControlDraw()
{
    tft.setTextColor(OWLOSLightColor, OWLOSDarkColor);
    tft.drawString(text + "   ", GOLD_9, GOLD_8 * 2 + GOLD_11, 2);

    if (cursorBlink)
    {
        int cursorLeft = tft.textWidth(text, 2);
        char cursorChar = ' ';
        if (cursorPosition < text.length())
        {
            cursorLeft = tft.textWidth(text.substring(0, cursorPosition), 2);
            cursorChar = text[cursorPosition];
        }

        tft.setTextColor(OWLOSDarkColor, OWLOSLightColor);
        tft.drawString(String(cursorChar), GOLD_9 + cursorLeft, GOLD_8 * 2 + GOLD_11, 2);
    }

    if (lastBlink + BLINK_TIME < millis())
    {
        cursorBlink = !cursorBlink;
        lastBlink = millis();
    }

    tx = 0;
    ty = 0;
    inTouch = false;

    for (int i = 0; i < KEYS_COUNT; i++)
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
