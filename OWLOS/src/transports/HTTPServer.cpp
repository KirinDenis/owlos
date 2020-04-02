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
#define HTTPServerId "HTTPServer"

#include <core_version.h>

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <FS.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <WiFi.h>
#include <ESPmDNS.h>
#include <SPIFFS.h>
#endif

#include <Arduino.h>
#include <WiFiClient.h>
#include <MD5Builder.h>

#include "HTTPServerThings.h"
#include "..\Managers\DriverManager.h"
#include "..\Managers\ScriptManager.h"
#include "..\Managers\UpdateManager.h"
#include "..\Managers\FileManager.h"
#include "..\Utils\Utils.h"
#include "..\..\Kernel.h"
#include "..\..\WebProperties.h"


#define HTTP_METHODS " GET, POST, OPTIONS"

WiFiServer  * server;

String uri = "";
String method = "";
int argsCount = 0;
String arg[22];
String argName[22];

//если вы определили NOT_SECURE_TOKEN то токен будет генерироваться каждый раз при старте из username, password и chipid
//если вы их измените - изменится токен, все кто был со "старым" токеном не смогут соединиться. Но узнал логин и пароль это станет возможно

//более безопасный способ, не определяйте NOT_SECURE_TOKEN, генерируется токен один раз и разместите его в переменной token
//после этого username, password и chipid не будут иметь никакого значения при авторизации. 

#define NOT_SECURE_TOKEN

#ifdef NOT_SECURE_TOKEN
String token = "";
#else
String token = ""; //type your secure token here
#endif // DEBUG


void calculateToken()
{
#ifdef NOT_SECURE_TOKEN
	MD5Builder md5;
	md5.begin();
	md5.add(nodeGetRESTfulServerUsername() + nodeGetRESTfulServerPassword() + nodeGetESPFlashChipId());
	md5.calculate();
	token = md5.toString();
#endif
}

bool checkToken(String _token)
{
#ifndef NOT_SECURE_TOKEN
	if (token.length() == 0) return false;
#endif // !NOT_SECURE_TOKEN

	return token.equals(_token);
}

bool auth(String username, String password)
{
#ifndef NOT_SECURE_TOKEN
	if (token.length() == 0) return false;
#endif // !NOT_SECURE_TOKEN

	MD5Builder md5;
	md5.begin();
	md5.add(username + password + nodeGetESPFlashChipId());
	md5.calculate();
	return token.equals(md5.toString());
}

void HTTPServerBegin(uint16_t port)
{
	calculateToken();
	server = new WiFiServer(port);
	server->begin();
}

void sendResponseHeader(int HTTPResponseCode, String contentType, String ContentEncoding, WiFiClient client)
{
	client.println("HTTP/1.1 " + String(HTTPResponseCode) + " OK");
	client.println("Content-type: " + contentType);
	client.println("Content-Encoding: " + ContentEncoding);
	client.println("Access-Control-Max-Age: 10000");
	client.println("Access-Control-Allow-Methods: " + String(HTTP_METHODS));
	client.println("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	client.println("Access-Control-Allow-Origin: *");
	client.println("Server: OWLOS");
	client.println("");
}

void send(int HTTPResponseCode, String contentType, String content, WiFiClient client)
{
	sendResponseHeader(HTTPResponseCode, contentType, "", client);
	//content += "\n\r";
	client.write(content.c_str(), content.length());
}

String parsePostBody(WiFiClient client) {
	String data = "";
	String sectionSign = "";
	String body = "";
	while (client.connected())
	{
		if (client.available())
		{
			char c = client.read();
			if (c == '\n')
			{
				if (sectionSign.length() == 0) //first entry
				{
					sectionSign = data;
				}
				else
				{
					if (data.indexOf(sectionSign) != -1)//endof section parsing
					{
						//TODO somthing with body
#ifdef DetailedDebug 
						debugOut("BODY", body);
#endif
						break;
					}
					else
					{
						if (data.indexOf("Content-Disposition:") != -1) //section header
						{
							//
						}
						else
							if (data.length() != 0)
							{
								body += data;
							}
					}
				}

				data = "";
			}
			else
				if (c != '\r')
				{
					data += c;
				}
		}
	}
	return body;
}


void handleNotFound(WiFiClient client)
{
	if ((filesExists(uri)) || (filesExists(uri + ".gz")))
	{
		String contentType = getContentType(uri);
		String responseHeader = "";
		if (filesExists(uri + ".gz"))
		{
			uri = uri + ".gz";
			sendResponseHeader(200, contentType, "gzip", client);
		}
		else
		{
			sendResponseHeader(200, contentType, "", client);
		}

		File download = SPIFFS.open(uri, "r");
		if (download)
		{
			client.write(download);
			download.close();
			return;
		}
	}

	send(404, "text/html", GetNotFoundHTML(), client);
}


//RESTful API -----------------------------------------------

void handleGetLog(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("number"))
		{
			String log = "wrong log number argument";
			if (arg[0].equals("1"))
			{
				log = filesReadString(LogFile1);
			}
			else
			{
				log = filesReadString(LogFile2);
			}
			send(200, "text/plain", log, client);
			return;
		}
	}
	handleNotFound(client);
}

//----------------------------------------------------------------------------------------------
void handleGetFileList(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("path"))
		{
			send(200, "text/plain", filesGetList(arg[0]), client);
			return;
		}
	}
	handleNotFound(client);
}

//----------------------------------------------------------------------------------------------
void handleDeleteFile(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("name"))
		{
			send(200, "text/plain", String(filesDelete(arg[0])), client);
			return;
		}
	}
	handleNotFound(client);
}

//----------------------------------------------------------------------------------------------
/*
void handleDownloadFile(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("name"))
		{
			String filename = arg[0];
			if (filesExists(filename))
			{
				File download = SPIFFS.open(filename, "r");
				if (download)
				{
					sendHeader("Content-Type", "text/text");
					sendHeader("Content-Disposition", "attachment; filename=" + filename);
					sendHeader("Connection", "close");
					webServer->streamFile(download, "application/octet-stream");
					download.close();
					return;
				}
				else
				{
					send(403, "text/plain", "file '" + filename + "' can't be open");
					return;
				}
			}
			send(403, "text/plain", "file '" + filename + "' not exist");
			return;
		}
	}
	handleNotFound(client);
}
*/
//----------------------------------------------------------------------------------------------
//It is not API - it web page for send select file form, to make POST request at UI level  
void handleUpload(WiFiClient client)
{

	String html = "<h3>Select file to upload</h3>";
	html += "<FORM action='/uploadfile' method='post' enctype='multipart/form-data'>";
	html += "<input class='buttons' style='width:50%' type='file' name='fileupload' id = 'fileupload' value=''><br>";
	html += "<br><button class='buttons' style='width:10%' type='submit'>upload</button><br>";
	send(200, "text/html", html, client);
}
//----------------------------------------------------------------------------------------------
File fs_uploadFile;
void handleUploadFile(WiFiClient client)
{
	/*
		HTTPUpload& http_uploadFile = webServer->upload();
	#ifdef DetailedDebug
		debugOut(HTTPServerId, "upload: " + http_uploadFile.filename + " status: " + String(http_uploadFile.status));
	#endif
		if (http_uploadFile.status == UPLOAD_FILE_START)
		{
	#ifdef DetailedDebug
			debugOut(HTTPServerId, "upload start: " + http_uploadFile.filename);
	#endif
			String filename = "/" + http_uploadFile.filename;
			//if (!filename.startsWith("/")) filename = "/"+filename;
			//Serial.print("Upload File Name: "); Serial.println(filename);
			filesDelete(filename);
			fs_uploadFile = SPIFFS.open(filename, "w");
			filename = String();
		}
		else
			if (http_uploadFile.status == UPLOAD_FILE_WRITE)
			{
				if (fs_uploadFile)
				{
					if (http_uploadFile.currentSize * 2 > ESP.getFreeHeap()) //HEAP is end
					{
	#ifdef DetailedDebug
						debugOut(HTTPServerId, "upload aborted, reson: end of node heap");
	#endif
						send(504, "text/plain", "upload aborted, reson: end of node heap", client);
					}
					else
					{
						fs_uploadFile.write(http_uploadFile.buf, http_uploadFile.currentSize);
	#ifdef DetailedDebug
						debugOut(HTTPServerId, "upload write: " + String(http_uploadFile.currentSize));
	#endif
					}

				}
				else
				{
	#ifdef DetailedDebug
					debugOut(HTTPServerId, "upload write error");
	#endif
				}
			}
			else
				if (http_uploadFile.status == UPLOAD_FILE_END)
				{
					if (fs_uploadFile)
					{
						fs_uploadFile.close();
						String html = http_uploadFile.filename;
	#ifdef DetailedDebug
						debugOut(HTTPServerId, "uploaded success: " + html);
	#endif
						send(200, "text/plain", html, client);
					}
					else
					{
	#ifdef DetailedDebug
						debugOut(HTTPServerId, "upload can't create file");
	#endif
						send(503, "text/plain", http_uploadFile.filename, client);
					}
				}
				else
					if (http_uploadFile.status == UPLOAD_FILE_ABORTED)
					{
	#ifdef DetailedDebug
						debugOut(HTTPServerId, "upload aborted");
	#endif
						send(504, "text/plain", http_uploadFile.filename, client);
					}
					else
					{
	#ifdef DetailedDebug
						debugOut(HTTPServerId, "upload bad file name, size or content for ESP FlashFileSystem");
	#endif
						send(505, "text/plain", "upload bad file name, size or content for ESP FlashFileSystem", client);
					}
	*/
}

//----------------------------------------------------------------------------------------------
void handleGetUnitProperty(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("property"))
		{
			String nodeProp = nodeOnMessage(nodeGetTopic() + "/get" + decode(arg[0]), "", NoTransportMask);
			if ((nodeProp.length() == 0) || (nodeProp.equals(WrongPropertyName)))
			{
				nodeProp = "wrong node property: " + arg[0];
				send(404, "text/html", nodeProp, client);
				return;
			}
			else
			{
				send(200, "text/plain", nodeProp, client);
				return;
			}
		}
	}
	handleNotFound(client);
}
//----------------------------------------------------------------------------------------------
void handleSetUnitProperty(WiFiClient client)
{
	if (argsCount > 1)
	{
		if ((argName[0].equals("property")) && (argName[1].equals("value")))
		{
			String result = nodeOnMessage(nodeGetTopic() + "/set" + decode(arg[0]), decode(arg[1]), NoTransportMask);
			if ((result.length() == 0) || (result.equals("0")))
			{
				result = "wrong node property set: " + arg[0] + "=" + arg[1];
				send(404, "text/html", result, client);
				return;
			}
			else
			{
				send(200, "text/plain", result, client);
				return;
			}
		}
	}
	handleNotFound(client);
}

void handleGetAllKernel(WiFiClient client)
{
	send(200, "text/plain", nodeGetAllProperties(), client);
	return;
}


void handleAddDriver(WiFiClient client)
{
	if (argsCount > 2)
	{
		if ((argName[0].equals("type")) && (argName[1].equals("id")) && (argName[2].equals("pins")))
		{
			int _type = std::atoi(arg[0].c_str());
			String _id = decode(arg[1]);
			String _pins = decode(arg[2]);
			String result = driversAdd(_type, _id, _pins);
			if (!result.equals("1"))
			{
				send(503, "text/html", result, client);
			}
			else
			{
				if (!driversSaveList())
				{
					send(503, "text/html", "bad, driver added but not stored to configuration file", client);
				}
				else
				{
					send(200, "text/html", "1", client);
				}
			}
			return;
		}
	}
	handleNotFound(client);
}

void handleDeleteDriver(WiFiClient client)
{
	if (argsCount > 0)
	{
		if (argName[0].equals("id"))
		{
			String result = driversDelete(arg[0].c_str());
			if (result.length() == 0)
			{
				send(200, "text/html", "1", client);
			}
			else
			{
				send(503, "text/html", result, client);
			}
			return;
		}
	}
	handleNotFound(client);
}


void handleGetDriversId(WiFiClient client)
{
	send(200, "text/plain", driversGetDriversId(), client);
}

void handleSetDriverProperty(WiFiClient client)
{
	if (argsCount > 2)
	{
		if ((argName[0].equals("id")) && (argName[1].equals("property")) && (argName[2].equals("value")))
		{
			String result = driversSetDriverProperty(arg[0], decode(arg[1]), decode(arg[2]));
			if (result.length() == 0) //try set node property
			{
				result = nodeOnMessage(nodeGetTopic() + "/set" + decode(arg[1]), decode(arg[2]), NoTransportMask);
			}

			if (result.length() == 0)
			{
				result = "wrong driver id: " + arg[0] + " use GetDriversId API to get all drivers list";
				send(404, "text/html", result, client);
			}
			else if (result.equals(NotAvailable))
			{
				result = "driver property: " + arg[1] + " set as NOT Available";
				send(404, "text/html", result, client);
			}
			else if (result.equals(WrongPropertyName))
			{
				result = "driver property: " + arg[1] + " not exists";
				send(404, "text/html", result, client);
			}
			else if (result.equals("0"))
			{
				result = "driver property: " + arg[1] + " can't be modify";
				send(404, "text/html", result, client);
			}
			else
			{
				send(200, "text/plain", result, client);
			}
			return;
		}
	}
	handleNotFound(client);
}

void handleGetWebProperty(WiFiClient client)
{
	if (argsCount > 0)
	{
		if (argName[0].equals("property"))
		{
			//String configProperties = webOnMessage(nodeGetTopic() + "/get" + decode(arg[0)), "");

			File download = SPIFFS.open("/web.config", "r");
			if (download)
			{
				sendResponseHeader(200, "text/html", "", client);
				client.write(download);

				download.close();
				return;
			}
			/*
			if ((configProperties.length() == 0) || (configProperties.equals(WrongPropertyName)))
			{
				configProperties = "wrong web property: " + arg[0);
				send(404, "text/html", configProperties);
				return;
			}
			else
			{
				send(200, "text/plain", configProperties);
				return;
			}
			*/
		}
	}
	handleNotFound(client);
}

void handleReset(WiFiClient client)
{

	send(200, "text/plain", "1", client);
	nodeSetESPReset(1);
}

//----------------------------------------------------------------------------------------------
//Update UI ------------------------------------------------------------------------------------
void handleUpdateLog(WiFiClient client)
{

	send(200, "text/plain", updateGetUpdateLog(), client);
}

void handleUpdateUI(WiFiClient client)
{

	if (updateGetUpdatePossible() < 1)
	{
		send(503, "text/plain", "0", client);
	}
	else
		if (updateGetUpdateUIStatus() < 2)
		{
			send(504, "text/plain", "0", client);
		}
		else
		{
			send(200, "text/plain", "1", client);
			updateUI();
		}
}

void handleUpdateFirmware(WiFiClient client)
{

	if (updateGetUpdatePossible() < 2)
	{
		send(503, "text/plain", "0", client);
	}
	else
		if (updateGetUpdateFirmwareStatus() < 2)
		{
			send(504, "text/plain", "0", client);
		}
		else
		{
			send(200, "text/plain", "1", client);
			updateFirmware();
		}
}

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
void handleAuth(WiFiClient client) {
	if (argsCount > 1)
	{
		if ((argName[0].equals("username")) && (argName[1].equals("password")))
		{
			if (auth(arg[0], arg[1]))
			{
				send(200, "text/plain", token, client);
			}
			else
			{
				send(401, "text/plain", "bad username or password, use /auth?username=YOUR_USER_NAME&password=YOUR_PASSWORD ", client);
			}
			return;
		}
	}
	handleNotFound(client);
}

void handleGetDriverProperty(WiFiClient client)
{
	if (argsCount > 1)
	{
		if ((argName[0].equals("id")) && (argName[1].equals("property")))
		{
			String driverProp = driversGetDriverProperty(arg[0], decode(arg[1]));
			if (driverProp.length() == 0) //then try get this property from node 
			{
				driverProp = nodeOnMessage(nodeGetTopic() + "/get" + decode(arg[1]), "", NoTransportMask);
			}

			if (driverProp.length() == 0)
			{
				driverProp = "wrong driver id: " + arg[0] + " use GetDriversId API to get all drivers list";
				send(404, "text/html", driverProp, client);
			}
			else if (driverProp.equals(NotAvailable))
			{
				driverProp = "driver property: " + arg[1] + " set as NOT Available";
				send(404, "text/html", driverProp, client);
			}
			else if (driverProp.equals(WrongPropertyName))
			{
				driverProp = "driver property: " + arg[1] + " not exists";
				send(404, "text/html", driverProp, client);
			}
			else
			{
				send(200, "text/plain", driverProp, client);
			}
			return;
		}
	}
	handleNotFound(client);
}


void handleGetDriverProperties(WiFiClient client)
{
	if (argsCount > 0)
	{
		if (argName[0].equals("id"))
		{
			String driverProp = driversGetDriverProperties(arg[0]);
			if (driverProp.length() == 0)
			{
				driverProp = "wrong driver id: " + arg[0] + " use GetDriversId API to get all drivers list";
				send(404, "text/html", driverProp, client);
			}
			else
			{
				send(200, "text/plain", driverProp, client);
			}
			return;
		}
	}
	handleNotFound(client);
}

void handleGetAllDriversProperties(WiFiClient client) {
	send(200, "text/plain", driversGetAllDriversProperties(), client);
}

void handleGetAllScripts(WiFiClient client) {

	send(200, "text/plain", scriptsGetAll(), client);
}


void handleGetPinMap(WiFiClient client) {
	send(200, "text/plain", getPinMap(), client);
}

void handleGetPinMode(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("pin"))
		{
			uint32_t pinInt = std::atoi(arg[0].c_str());
			int result = getPinMode(pinInt);

			if (result != -1) {
				send(200, "text/plain", String(result), client);
			}
			else {
				send(503, "text/plain", "wrong pin value", client);
			}

			return;
		}
	}
	handleNotFound(client);
}

//String setDriverPinMode(String driverId, int driverPin, int mode);
void handleSetDriverPinMode(WiFiClient client)
{
	if (argsCount > 2)
	{
		if ((argName[0].equals("driverid")) && (argName[1].equals("driverpin")) && (argName[2].equals("mode")))
		{
			int driverPin = std::atoi(arg[1].c_str());
			int mode = std::atoi(arg[2].c_str());
			String result = setDriverPinMode(arg[0], driverPin, mode);

			if (result.length() == 0) {
				send(200, "text/plain", String(result), client);
			}
			else {
				send(503, "text/plain", result, client);
			}

			return;
		}
	}
	handleNotFound(client);
}

//String drivePinWrite(String driverId, int driverPin, int data);
//if (firstLine.indexOf("/driverpinwrite") != -1) { handleDriverPinWrite(client); }
void handleDriverPinWrite(WiFiClient client)
{
	if (argsCount > 2)
	{
		if ((argName[0].equals("driverid")) && (argName[1].equals("driverpin")) && (argName[2].equals("data")))
		{
			int driverPin = std::atoi(arg[1].c_str());
			int data = std::atoi(arg[2].c_str());
			String result = driverPinWrite(arg[0], driverPin, data);

			if (result.length() == 0) {
				send(200, "text/plain", String(result), client);
			}
			else {
				send(503, "text/plain", result, client);
			}

			return;
		}
	}
	handleNotFound(client);
}

void handleDriverPinRead(WiFiClient client)
{
	if (argsCount > 1)
	{
		if ((argName[0].equals("driverid")) && (argName[1].equals("driverpin")))
		{
			int driverPin = std::atoi(arg[1].c_str());

			send(200, "text/plain", String(driverPinRead(arg[0], driverPin)), client);

			return;
		}
	}
	handleNotFound(client);
}

void handleStartDebugScript(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("name"))
		{
			send(200, "text/plain", String(scriptsStartDebug(arg[0])), client);
			return;
		}
	}
	handleNotFound(client);
}

void handleDebugNextScript(WiFiClient client)
{
	if (argsCount > 0)
	{
		if (argName[0].equals("name"))
		{
			send(200, "text/plain", String(scriptsDebugNext(arg[0])), client);
			return;
		}
	}
	handleNotFound(client);
}

void handleDeleteScript(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("name"))
		{
			send(200, "text/plain", String(scriptsDelete(arg[0])), client);
			return;
		}
	}
	handleNotFound(client);
}


//POST
void handleCreateScript(WiFiClient client)
{
	if (argsCount > 0)
	{
		if (argName[0].equals("name"))
		{
			String result = String(scriptsCreate(decode(arg[0]), decode(parsePostBody(client))));
			if (result.length() != 0)
			{
				send(503, "text/html", result, client);
				return;
			}
			else
			{
				send(200, "text/plain", result, client);
				return;
			}
		}
	}
	handleNotFound(client);
}

void handleSetWebProperty(WiFiClient client)
{
	if (argsCount > 0)
	{
		if (argName[0].equals("property"))
		{
			String result = webOnMessage(nodeGetTopic() + "/set" + decode(arg[0]), decode(parsePostBody(client)));
			if ((result.length() == 0) || (result.equals("0")))
			{

				send(404, "text/html", "wrong node property set: " + arg[0], client);
				return;
			}
			else
			{
				send(200, "text/plain", result, client);
				return;
			}
		}
	}
	handleNotFound(client);
}



void HTTPServerLoop()
{

	WiFiClient client = server->available();

	if (client)
	{
		String currentLine = "";
		String firstLine = "";
		while (client.connected())
		{
			if (client.available())
			{
				char receiveChar = client.read();

				if (receiveChar == '\n')
				{

					if (currentLine.length() != 0)
					{
						if (firstLine.length() == 0)
						{
							firstLine = currentLine; //store first line 							
						}
						currentLine = ""; //next header line 
					}
					else // currentLine.length() == 0 END OF HEADER RECIEVE
					{
#ifdef DetailedDebug 
						debugOut("---", firstLine);
#endif
						method = firstLine.substring(0, firstLine.indexOf(" "));

						if (String(HTTP_METHODS).indexOf(" " + method) != -1)
						{

							uri = firstLine.substring(firstLine.indexOf(" ") + 1);
							uri = uri.substring(0, uri.indexOf(" "));
							if ((uri.length() == 0) || (uri.equals("/"))) uri = "/index.html";
#ifdef DetailedDebug 
							debugOut("-->", uri);
#endif
							argsCount = 0;
							int hasArgs = firstLine.indexOf('?');
							if (hasArgs != -1)
							{
								int argPos = 0;
								String argsStr = firstLine.substring(hasArgs + 1);
								argsStr = argsStr.substring(0, argsStr.indexOf(" "));
								argsStr += "&";
								while ((argPos = argsStr.indexOf("&")) != -1)
								{
									String currentArg = argsStr.substring(0, argPos);
									argName[argsCount] = currentArg.substring(0, currentArg.indexOf("="));
									arg[argsCount] = currentArg.substring(currentArg.indexOf("=") + 1);
									argsCount++;
									argsStr.remove(0, argPos + 1);
								}
							}

							if (firstLine.indexOf("/auth?") != -1)
							{
								handleAuth(client);
							}

							if (firstLine.indexOf("token=" + token) == -1)
							{
								//GET section 
#ifdef DetailedDebug 
								debugOut("METHOD", method);
#endif
								if (method.equals("OPTIONS"))
								{
									sendResponseHeader(200, "text/plain", "", client);
								}
								else
									if (method.equals("GET"))
									{
										if (firstLine.indexOf("/getlog") != -1) { handleGetLog(client); }
										else
											if (firstLine.indexOf("/getfilelist") != -1) { handleGetFileList(client); }
											else
												if (firstLine.indexOf("/deletefile") != -1) { handleDeleteFile(client); }
												else
													if (firstLine.indexOf("/getnodeproperty") != -1) { handleGetUnitProperty(client); }
													else
														if (firstLine.indexOf("/setnodeproperty") != -1) { handleSetUnitProperty(client); }
														else
															if (firstLine.indexOf("/getallnodeproperties") != -1) { handleGetAllKernel(client); }
															else
																if (firstLine.indexOf("/adddriver") != -1) { handleAddDriver(client); }
																else
																	if (firstLine.indexOf("/deletedriver") != -1) { handleDeleteDriver(client); }
																	else
																		if (firstLine.indexOf("/getdriversid") != -1) { handleGetDriversId(client); }
																		else
																			if (firstLine.indexOf("/getdriverproperty") != -1) { handleGetDriverProperty(client); }
																			else
																				if (firstLine.indexOf("/setdriverproperty") != -1) { handleSetDriverProperty(client); }
																				else
																					if (firstLine.indexOf("/getdriverproperties") != -1) { handleGetDriverProperties(client); }
																					else
																						if (firstLine.indexOf("/getalldriversproperties") != -1) { handleGetAllDriversProperties(client); }
																						else
																							if (firstLine.indexOf("/getpinmap") != -1) { handleGetPinMap(client); }
																							else
																								if (firstLine.indexOf("/getpinmode") != -1) { handleGetPinMode(client); }
																								else
																									if (firstLine.indexOf("/setdriverpinmode") != -1) { handleSetDriverPinMode(client); }
																									else
																										if (firstLine.indexOf("/driverpinwrite") != -1) { handleDriverPinWrite(client); }
																										else
																											if (firstLine.indexOf("/driverpinread") != -1) { handleDriverPinRead(client); }
																											else




																												if (firstLine.indexOf("/getwebproperty") != -1) { handleGetWebProperty(client); }
																												else
																													if (firstLine.indexOf("/reset") != -1) { handleReset(client); }
																													else
																														if (firstLine.indexOf("/updatelog") != -1) { handleUpdateLog(client); }
																														else
																															if (firstLine.indexOf("/updateui") != -1) { handleUpdateUI(client); }
																															else
																																if (firstLine.indexOf("/updatefirmware") != -1) { handleUpdateFirmware(client); }
																																else
																																	if (firstLine.indexOf("/getallscripts") != -1) { handleGetAllScripts(client); }
																																	else
																																		if (firstLine.indexOf("/startdebugscript") != -1) { handleStartDebugScript(client); }
																																		else
																																			if (firstLine.indexOf("/debugnextscript") != -1) { handleDebugNextScript(client); }
																																			else
																																				if (firstLine.indexOf("/getdriverproperties") != -1) { handleGetDriverProperties(client); }
																																				else
																																					if (firstLine.indexOf("/getalldriversproperties") != -1) { handleGetAllDriversProperties(client); }
																																					else
																																					{
																																						handleNotFound(client);
																																					}
									}
									else
										//POST Section 
										if (method.equals("POST"))
										{
											if (firstLine.indexOf("/createscript") != -1) { handleCreateScript(client); }
											else
												if (firstLine.indexOf("/setwebproperty") != -1) { handleSetWebProperty(client); }
												else
												{
													handleNotFound(client);
												}
										}
							}
							else
							{
								send(401, "text/plain", "bad username or password, use /auth?username=YOUR_USER_NAME&password=YOUR_PASSWORD", client);
							}
						}
						else
						{
							send(405, "text/plain", "method not allowed", client);
						}

						break;
					}
				}
				else
					if (receiveChar != '\r')
					{
						currentLine += receiveChar;
					}
			}
		}
	}
	client.stop();
}
