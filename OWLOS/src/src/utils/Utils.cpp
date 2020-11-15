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

char *stringToChar(String src)
{
	char *data = (char *)malloc(src.length() + 1);
	src.toCharArray(data, src.length() + 1);
	return data;
}

#ifdef DEBUG
void debugOut(const String &tag, const String &text)
{
#ifdef USE_ESP_DRIVER
	#ifdef SERIAL_COLORIZED_OUTPUT
		String _text = text + " \033\033[1;32m [" + String(ESP.getFreeHeap()) + "]";
	#else
		String _text = text + " [" + String(ESP.getFreeHeap()) + "]";
	#endif
#else
    String _text = text;
#endif

#ifdef SERIAL_COLORIZED_OUTPUT
	Serial.print("\033\033[1;35m DEBUG: \033\033[1;36m " + tag + " \033\033[1;34m " + _text + "\n");
	Serial.print("\033\033[0m");
#else
	Serial.print("DEBUG: " + tag + " - " + _text + "\n");
#endif

	if (WRITE_DEBUG_LOG_FILES)
	{
		if (filesAtRecurse)
			return;
		filesAtRecurse = true;
		int log1Size = filesGetSize(DEBUG_LOG_FILE1_NAME);
		int log2Size = filesGetSize(DEBUG_LOG_FILE2_NAME);

		if (log1Size < DEBUG_LOG_FILES_SIZE)
		{
			writeDebugLogFile(DEBUG_LOG_FILE1_NAME, log1Size, tag, _text);
			log1Size = filesGetSize(DEBUG_LOG_FILE1_NAME);
			if (log1Size >= DEBUG_LOG_FILES_SIZE)
			{
				filesDelete(DEBUG_LOG_FILE2_NAME);
			}
		}
		else
		{
			if (log2Size < DEBUG_LOG_FILES_SIZE)
			{
				writeDebugLogFile(DEBUG_LOG_FILE2_NAME, log2Size, tag, _text);
			}
			else
			{
				filesDelete(DEBUG_LOG_FILE1_NAME);
				writeDebugLogFile(DEBUG_LOG_FILE1_NAME, log1Size, tag, _text);
			}
		}
		filesAtRecurse = false;
	}
}
#endif

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

bool matchRoute(const String &route, const String &topic, const char *path)
{
	return matchRoute(route.c_str(), topic.c_str(), path);
}
// Route = a/b/c/d /getsomething
//   topic=^^^^^^^|^^^^^^^^^^^^^=path
bool matchRoute(const char *route, const char *topic, const char *path)
{
	if (!route || !topic || !path)
		return false;

	int len = strlen(route);
	const char *routePath = NULL;
	//Find last /
	for (int i = len; i >= 0; i--)
	{
		if (route[i] == '/')
		{
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
