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

#include <core_version.h>
#include "..\Utils\Utils.h"

#define FileSystem "File System"

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <FS.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <FS.h>
#include <SPIFFS.h>
#endif

#define FORMAT_SPIFFS_IF_FAILED true

//NOTE: DON'T forget "Tools/Flash Size" set to 1M-2M, it is desable by default
//http://wikihandbk.com/wiki/ESP8266:%D0%9F%D1%80%D0%BE%D1%88%D0%B8%D0%B2%D0%BA%D0%B8/Arduino/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0_%D1%81_%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%BE%D0%B9_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%BE%D0%B9_%D0%B2_%D0%B0%D0%B4%D0%B4%D0%BE%D0%BD%D0%B5_ESP8266_%D0%B4%D0%BB%D1%8F_IDE_Arduino
//https://github.com/esp8266/arduino-esp8266fs-plugin/releases/download/0.3.0/ESP8266FS-0.3.0.zip
bool filesBegin()
{
	if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED))
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "File system not available before, try MOUNT new FLASH drive, please wait...");
#endif
		SPIFFS.format();
	}

	bool result = SPIFFS.begin();

	if (result)
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "File system mount OK");
#endif
	}
	else
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "File system mount FAIL");
#endif
	}

	return result;
}

bool filesExists(String fileName)
{
	return SPIFFS.exists(fileName);
}

int filesGetSize(String fileName)
{
	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return -1;
	}

	if (!filesExists(fileName)) return -2;

	// open file for reading
	File file = SPIFFS.open(fileName, "r");

	if (!file) {
#ifdef DetailedDebug 
		debugOut(FileSystem, "There was an error opening the file: " + fileName);
#endif
		return -3;
	}

	int result = file.size();
	file.close();
	return result;
}

bool filesDelete(String fileName)
{
	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return false;
	}

	if (!filesExists(fileName)) return false;

	SPIFFS.remove(fileName);

	return true;
}

bool filesRename(String source, String dest)
{
	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return false;
	}

	if (!filesExists(source)) return false;

	if (filesExists(dest))
	{
		SPIFFS.remove(dest);
	}

	SPIFFS.rename(source, dest);

	return true;
}

String filesReadString(String fileName)
{
	String result = String();
	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return result;
	}

	// open file for reading
	File file = SPIFFS.open(fileName, "r");

	if (!file) {
#ifdef DetailedDebug 
		debugOut(FileSystem, "There was an error opening the file for reading: " + fileName);
#endif

		return result;
	}

	result = file.readString();
	file.close();
	return result;
}

bool filesWriteString(String fileName, String value)
{

	if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED))
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return false;
	}

	File file = SPIFFS.open(fileName, "w");
	if (!file) {
#ifdef DetailedDebug 
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
		return false;
	}

	if (!file.print(value))
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "File write failed");
#endif
	}
	file.close();
	return true;
}

bool filesAppendString(String fileName, String value)
{

	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return false;
	}

	File file = SPIFFS.open(fileName, "a");
	if (!file) {
#ifdef DetailedDebug 
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
		return false;
	}

	if (!file.println(value))
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "File write failed");
#endif
	}
	file.close();
	return true;
}

bool filesAddString(String fileName, String value)
{

	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
#endif
		return false;
	}

	File file = SPIFFS.open(fileName, "a");
	if (!file) {
#ifdef DetailedDebug 
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
		return false;
	}

	if (!file.print(value))
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "File write failed");
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
		return std::atoi(str.c_str());
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
		return std::atof(str.c_str());
	}
	return 0.0;
}

bool filesWriteFloat(String fileName, float value)
{
	return filesWriteString(fileName, String(value));
}

String filesGetList(String path)
{
	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "An Error has occurred while mounting file system");
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
	File root = SPIFFS.open("/");

	File file = root.openNextFile();

	while (file) {
		result += String(file.name()) + " " + String(file.size()) + "\n";
		file = root.openNextFile();
	}
#endif
	return result;
}

bool filesWriteStructure(String fileName, void *value)
{
	if (!SPIFFS.begin())
	{
#ifdef DetailedDebug debugOut(FileSystem, "An Error has occurred while mounting file system");
		return false;
#endif
	}

	File file = SPIFFS.open(fileName, "w");
	if (!file) {
#ifdef DetailedDebug 
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
#endif
		return false;
	}

	int writedSize = file.write((byte*)&value, sizeof(value));
	if (writedSize != sizeof(value))
	{
#ifdef DetailedDebug 
		debugOut(FileSystem, "File write failed");
#endif
		return false;
	}
	file.close();
	return true;
}
