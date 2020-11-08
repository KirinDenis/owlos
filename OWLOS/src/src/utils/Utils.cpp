/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

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

(Этот файл — часть Ready IoT Solution - OWLOS.

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

#include "Utils.h"
#include "../services/FileService.h"


bool filesAtRecurse = false;

char* stringToChar(String src)
{
	char* data = (char *)malloc(src.length() + 1);
	src.toCharArray(data, src.length() + 1);
	return data;
}

void debugOut(String tag, String text)
{
	if (Debug)
	{
#ifdef USE_ESP_DRIVER		
#ifdef SERIAL_COLORIZED_OUTPUT		
		text = text + " \033\033[1;32m [" + String(ESP.getFreeHeap()) + "]";
#else
        text = text + " [" + String(ESP.getFreeHeap()) + "]";
#endif		

#endif		
 
#ifdef SERIAL_COLORIZED_OUTPUT		        
		Serial.println("\033\033[1;35m DEBUG: \033\033[1;36m " + tag + " \033\033[1;34m " + text);
		Serial.print("\033\033[0m");
#else
		Serial.print("DEBUG: " + tag + " - " + text + "\n");
#endif		
		if (WriteDebugLogs)
		{
			if (filesAtRecurse) return;
			filesAtRecurse = true;
			int log1Size = filesGetSize(LogFile1);
			int log2Size = filesGetSize(LogFile2);

			if (log1Size < LogFilesSize)
			{
				writeDebugLogFile(LogFile1, log1Size, tag, text);
				log1Size = filesGetSize(LogFile1);
				if (log1Size >= LogFilesSize)
				{
					filesDelete(LogFile2);
				}
			}
			else
			{
				if (log2Size < LogFilesSize)
				{
					writeDebugLogFile(LogFile2, log2Size, tag, text);
				}
				else
				{
					filesDelete(LogFile1);
					writeDebugLogFile(LogFile1, log1Size, tag, text);
				}
			}
			filesAtRecurse = false;
		}
	}
}

void writeDebugLogFile(String fileName, int fileSize, String tag, String text)
{
	if (fileSize < 0)
	{
		filesWriteString(fileName, tag + "\t" + text);
	}
	else
	{
		filesAppendString(fileName, tag + "\t" + text);
	}
}

bool matchRoute(String route, String topic, const char* path) {
    return matchRoute(route.c_str(), topic.c_str(), path);
}
// Route = a/b/c/d /getsomething
//   topic=^^^^^^^|^^^^^^^^^^^^^=path
bool matchRoute(const char* route, const char* topic, const char* path)
{
    if (!route || !topic || !path)
        return false;

    int len = strlen(route);
    const char * routePath = NULL;
    //Find last /
    for (int i = len; i >= 0; i--) {
        if (route[i] == '/') {
            routePath = route + i;
            break;
        }
    }
    if (!routePath)
        return false;

    //First check path
    if (strcmp(routePath, path) != 0)
        return false;
    // Check only the topic part of route
    if (strncmp(topic, route, len - strlen(routePath)) != 0)
        return false;

    return true;

}
