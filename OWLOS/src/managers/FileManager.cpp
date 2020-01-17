#include <FS.h>
#include "..\Utils\Utils.h"

#define FileSystem "File System"

//NOTE: DON'T forget "Tools/Flash Size" set to 1M-2M, it is desable by default
//http://wikihandbk.com/wiki/ESP8266:%D0%9F%D1%80%D0%BE%D1%88%D0%B8%D0%B2%D0%BA%D0%B8/Arduino/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0_%D1%81_%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%BE%D0%B9_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%BE%D0%B9_%D0%B2_%D0%B0%D0%B4%D0%B4%D0%BE%D0%BD%D0%B5_ESP8266_%D0%B4%D0%BB%D1%8F_IDE_Arduino
//https://github.com/esp8266/arduino-esp8266fs-plugin/releases/download/0.3.0/ESP8266FS-0.3.0.zip
bool filesBegin()
{
  if (!SPIFFS.begin())
  {
    debugOut(FileSystem, "File system not available before, try MOUNT new FLASH drive, please wait...");
    SPIFFS.format();
  }

  bool result = SPIFFS.begin();

  if (result)
  {
    debugOut(FileSystem, "File system mount OK");
  }
  else
  {
    debugOut(FileSystem, "File system mount FAIL");
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
    debugOut(FileSystem, "An Error has occurred while mounting file system");
    return -1;
  }

  if (!filesExists(fileName)) return -2;

  // open file for reading
  File file = SPIFFS.open(fileName, "r");

  if (!file) {
    debugOut(FileSystem, "There was an error opening the file: " + fileName);
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
    debugOut(FileSystem, "An Error has occurred while mounting file system");
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
		debugOut(FileSystem, "An Error has occurred while mounting file system");
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
    debugOut(FileSystem, "An Error has occurred while mounting file system");
    return result;
  }

  // open file for reading
  File file = SPIFFS.open(fileName, "r");

  if (!file) {
    debugOut(FileSystem, "There was an error opening the file for reading: " + fileName);
    return result;
  }

  result = file.readString();
  file.close();
  return result;
}

bool filesWriteString(String fileName, String value)
{

  if (!SPIFFS.begin())
  {
    debugOut(FileSystem, "An Error has occurred while mounting file system");
    return false;
  }

  File file = SPIFFS.open(fileName, "w");
  if (!file) {
    debugOut(FileSystem, "There was an error opening the file for writing: "  + fileName);
    return false;
  }

  if (!file.print(value))
  {
    debugOut(FileSystem, "File write failed");
  }
  file.close();
}

bool filesAppendString(String fileName, String value)
{

  if (!SPIFFS.begin())
  {
    debugOut(FileSystem, "An Error has occurred while mounting file system");
    return false;
  }

  File file = SPIFFS.open(fileName, "a");
  if (!file) {
    debugOut(FileSystem, "There was an error opening the file for writing: "  + fileName);
    return false;
  }

  if (!file.println(value))
  {
    debugOut(FileSystem, "File write failed");
  }
  file.close();
}

bool filesAddString(String fileName, String value)
{

	if (!SPIFFS.begin())
	{
		debugOut(FileSystem, "An Error has occurred while mounting file system");
		return false;
	}

	File file = SPIFFS.open(fileName, "a");
	if (!file) {
		debugOut(FileSystem, "There was an error opening the file for writing: " + fileName);
		return false;
	}

	if (!file.print(value))
	{
		debugOut(FileSystem, "File write failed");
	}
	file.close();
}


int filesReadInt(String fileName)
{
  String str = filesReadString(fileName);
  if (str.length() != 0)
  {
    return std::atoi(str.c_str());
  }
  else
  {
    return -1;
  }
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
	else
	{
		return -1;
	}
}

bool filesWriteFloat(String fileName, float value)
{
	return filesWriteString(fileName, String(value));
}


String filesGetList(String path)
{
  String result = "";
  Dir dir = SPIFFS.openDir(path);
  while (dir.next()) 
  {
    result += dir.fileName() + " " + dir.fileSize() + "\n";
  }
  return result;
}
