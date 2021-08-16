#ifndef LOGSCREEN_H
#define LOGSCREEN_H

#include "../UXUtils.h"

void logScreenInit();
void logScreenRefresh();     
void logScreenDraw();
void logScreenAddText(String tag, String text);

#endif