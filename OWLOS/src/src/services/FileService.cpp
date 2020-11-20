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

#include "FileService.h"

#define FileSystem "File System"

/*--------------------------------------------------------------------------------------
Arduino File System ------------------------------------------------------------------------
--------------------------------------------------------------------------------------*/
#ifdef USE_ARDUINO_BOARDS

bool filesBegin()
{
	return false;
}
bool filesLoop() { return true; }
bool filesExists(String fileName) { return true; }
int filesGetSize(String fileName) { return 0; }
bool filesDelete(String fileName) { return true; }
bool filesRename(String source, String dest) { return true; }

String filesReadString(String fileName) { return String(); }
bool filesWriteStringDirect(String fileName, String value) { return true; }
bool filesWriteString(String fileName, String value) { return true; }
bool filesAppendString(String fileName, String value) { return true; }
bool filesAddString(String fileName, String value) { return true; }

int filesReadInt(String fileName) { return 0; }
bool filesWriteInt(String fileName, int value) { return true; }

float filesReadFloat(String fileName) { return 0.0; }
bool filesWriteFloat(String fileName, float value) { return true; }

String filesGetList(String path) { return ""; }
bool filesWriteStructure(String fileName, void *value) { return true; }

#else

/*--------------------------------------------------------------------------------------
ESP File System ------------------------------------------------------------------------
--------------------------------------------------------------------------------------*/
#if defined(ARDUINO_ESP8266_RELEASE_2_5_0) || defined(ARDUINO_ESP32_RELEASE_1_0_4)

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <FS.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <FS.h>
#include <SPIFFS.h>
#define FORMAT_SPIFFS_IF_FAILED true
bool readyBegin = false;

struct fileWriteItem
{
	String fileName;
	String value;
};

#define filesWriteCacheSize 40

fileWriteItem filesWriteCache[filesWriteCacheSize];
#endif

//NOTE: DON'T forget "Tools/Flash Size" set to 1M-2M, it is desable by default
//http://wikihandbk.com/wiki/ESP8266:%D0%9F%D1%80%D0%BE%D1%88%D0%B8%D0%B2%D0%BA%D0%B8/Arduino/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0_%D1%81_%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%BE%D0%B9_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%BE%D0%B9_%D0%B2_%D0%B0%D0%B4%D0%B4%D0%BE%D0%BD%D0%B5_ESP8266_%D0%B4%D0%BB%D1%8F_IDE_Arduino
//https://github.com/esp8266/arduino-esp8266fs-plugin/releases/download/0.3.0/ESP8266FS-0.3.0.zip

bool _SPIFFSBegin()
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	return SPIFFS.begin();
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	if (!readyBegin)
	{
		readyBegin = SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED);
	}
	return readyBegin;
#endif
}

String normalizeFileName(String fileName)
{
	if (fileName.indexOf("/") != 0)
	{
		fileName = "/" + fileName;
	}

	return fileName;
}

bool filesBegin()
{
	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "File system not available before, try MOUNT new FLASH drive, please wait...");
#endif
#endif
		SPIFFS.format();
	}

	bool result = _SPIFFSBegin();

	if (result)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "File system mount OK");
#endif
#endif
	}
	else
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "File system mount FAIL");
#endif
#endif
	}

	return result;
}

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
bool filesLoop()
{
	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return false;
	}

	for (int i = 0; i < filesWriteCacheSize; i++)
	{
		if (filesWriteCache[i].fileName.length() != 0)
		{

			File file = SPIFFS.open(filesWriteCache[i].fileName, FILE_WRITE);
			filesWriteCache[i].fileName = "";
			if (!file)
			{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
				debugOut(FileSystem, "There was an error opening the file for writing");
#endif
#endif
				return false;
			}

			if (!file.print(filesWriteCache[i].value))
			{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
				debugOut(FileSystem, "fileWriteString failed");
#endif
#endif
			}
			filesWriteCache[i].value = "";
			file.close();
		}
	}
	return true;
}

bool appendFileToWriteCache(String fileName, String value)
{
	fileName = normalizeFileName(fileName);
	for (int i = 0; i < filesWriteCacheSize; i++)
	{
		if (filesWriteCache[i].fileName.length() == 0)
		{
			filesWriteCache[i].fileName = fileName;
			filesWriteCache[i].value = value;
			return true;
		}
	}
	return false;
}
#endif

bool filesExists(String fileName)
{
	fileName = normalizeFileName(fileName);
	return SPIFFS.exists(fileName);
}

int filesGetSize(String fileName)
{

	fileName = normalizeFileName(fileName);

	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return -1;
	}

	if (!filesExists(fileName))
		return -2;

	// open file for reading
	File file = SPIFFS.open(fileName, "r");

	if (!file)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "There was an error opening the file: " + fileName);
#endif
#endif
		return -3;
	}

	int result = file.size();

	file.close();

	return result;
}

bool filesDelete(String fileName)
{
	fileName = normalizeFileName(fileName);
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(FileSystem, "|-> filesDelete: " + fileName);
#endif
#endif

	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return false;
	}

	if (!filesExists(fileName))
		return false;

	SPIFFS.remove(fileName);

	return true;
}

bool filesDeleteAllFiles()
{

	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return false;
	}

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	//TODO
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4

	File root = SPIFFS.open("/");
	File file = root.openNextFile();

	//достаточно опасный способ, поэтому предуматриваем пересчитывания индекса первого файла
	//после каждого удаления -> file = root.openNextFile();
	while (file)
	{
		SPIFFS.remove(file.name());

#ifdef DETAILED_DEBUG
		debugOut(FileSystem, "Deleted: " + String(file.name()));
#endif

		root = SPIFFS.open("/");
		file = root.openNextFile();
	}
#endif
	return true;
}

bool filesRename(String source, String dest)
{
	source = normalizeFileName(source);
	dest = normalizeFileName(dest);

	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return false;
	}

	if (!filesExists(source))
		return false;

	if (filesExists(dest))
	{
		SPIFFS.remove(dest);
	}

	SPIFFS.rename(source, dest);

	return true;
}

String filesReadString(String fileName)
{
	fileName = normalizeFileName(fileName);

	String result = String();
	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return result;
	}

	// open file for reading
	File file = SPIFFS.open(fileName, "r");

	if (!file)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "There was an error opening the file for reading: " + fileName);
#endif
#endif

		return result;
	}

	result = file.readString();

	file.close();

	return result;
}

bool filesWriteStringDirect(String fileName, String value)
{

	fileName = normalizeFileName(fileName);
	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return false;
	}

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	File file = SPIFFS.open(fileName, "w");

	if (!file)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
#endif
		return false;
	}

	if (!file.print(value))
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "fileWriteString failed: " + fileName);
#endif
#endif
	}

	file.close();

	return true;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	File file = SPIFFS.open(fileName, FILE_WRITE);

	if (!file)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "There was an error opening the file for writing");
#endif
#endif
		return false;
	}

	if (!file.print(value))
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "fileWriteString failed");
#endif
#endif
	}
	file.close();
	return true;
#endif
}

bool filesWriteString(String fileName, String value)
{
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	return filesWriteStringDirect(fileName, value);
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	return appendFileToWriteCache(fileName, value);
#endif
}

bool filesAppendString(String fileName, String value)
{
	fileName = normalizeFileName(fileName);

	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return false;
	}

	File file = SPIFFS.open(fileName, "a");
	if (!file)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
#endif
		return false;
	}

	if (!file.println(value))
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "fileAppendString failed: " + fileName);
#endif
#endif
	}

	file.close();

	return true;
}

bool filesAddString(String fileName, String value)
{
	fileName = normalizeFileName(fileName);
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(FileSystem, "|-> filesAddString: " + fileName);
#endif
#endif

	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return false;
	}

	if (value.length() == 0)
	{
		return true;
	}

	File file = SPIFFS.open(fileName, "a");
	if (!file)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
#endif
		return false;
	}

	if (!file.print(value))
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "fileAddString failed: " + fileName);
#endif
#endif
	}

	file.close();

	return true;
}

int filesReadInt(String fileName)
{
	String str = filesReadString(fileName);
	if (str.length() != 0)
	{
		return atoi(str.c_str());
	}

	return 0;
}

bool filesWriteInt(String fileName, int value)
{
	return filesWriteString(fileName, String(value));
}

float filesReadFloat(String fileName)
{
	String str = filesReadString(fileName);
	if (str.length() != 0)
	{
		return atof(str.c_str());
	}
	return 0.0;
}

bool filesWriteFloat(String fileName, float value)
{
	return filesWriteString(fileName, String(value));
}

String filesGetList(String path)
{
	path = normalizeFileName(path);
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(FileSystem, "|-> filesGetList: " + path);
#endif
#endif

	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
#endif
		return "";
	}

	String result = "";
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	Dir dir = SPIFFS.openDir(path);
	while (dir.next())
	{
		result += dir.fileName() + " " + dir.fileSize() + "\n";
	}
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	File root = SPIFFS.open(path);

	File file = root.openNextFile();

	while (file)
	{
		result += String(file.name()) + " " + String(file.size()) + "\n";
		file = root.openNextFile();
	}
#endif
	return result;
}



bool filesWriteStructure(String fileName, void *value)
{
	if (!_SPIFFSBegin())
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return false;
#endif
	}

	File file = SPIFFS.open("/" + fileName, "w");
	if (!file)
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
#endif
		return false;
	}

	int writedSize = file.write((byte *)&value, sizeof(value));
	if (writedSize != sizeof(value))
	{
#ifdef DETAILED_DEBUG
#ifdef DEBUG
		debugOut(FileSystem, "File write failed");
#endif
#endif
		return false;
	}

	file.close();

	return true;
}
#endif
#endif