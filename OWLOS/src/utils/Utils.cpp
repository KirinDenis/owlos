#include "Utils.h"
#include "..\Managers\FileManager.h"


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
		text = text + " [HEAP: " + String(ESP.getFreeHeap()) + "]";
		Serial.println("DEBUG: " + tag + " - " + text);
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

