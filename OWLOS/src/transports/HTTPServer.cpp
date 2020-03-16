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
#define WebServerId "WebServer"

#include <ESP8266WiFi.h>

#include <ESP.h>
#include <Arduino.h>
#include <WiFiClient.h>
#include <FS.h>

#include "..\..\UnitProperties.h"
#include "..\..\WebProperties.h"

#include "..\Managers\DriverManager.h"
#include "..\Managers\ScriptManager.h"
#include "..\Managers\UpdateManager.h"
#include "..\Managers\FileManager.h"
#include "..\Utils\Utils.h"



String _GetLogoHTML()
{
	String result = "<font size='1'><pre><code><span>";
	result += "                                         \n";
	result += "@@@@@@@@#                       #@@@@@@@@\n";
	result += "@@@@@@@@@@@@@/             ,@@@@@@@@@@@@@\n";
	result += "@@@@@@@@@&(@@@@@@@.   .@@@@@@@(%@@@@@@@@@\n";
	result += "@@@@@  .@@@/  ,@@@@@@@@@@@*  .@@@,  %@@@@\n";
	result += "&@@@@@@,   .@@&    *@#    %@@*   ,@@@@@@@\n";
	result += "%@@ @@@@@&     %@@     @@%     %@@@@@ @@&\n";
	result += "(@@  @@%.@@@       @@@.      @@@,#@@% @@#\n";
	result += ",@@, @@@ &@@@@             (@@@@ &@@  @@*\n";
	result += " @@(  @@  @@@@@           @@@@@  @@#  @@.\n";
	result += " @@&  @@(   @@@@@       @@@@@,  /@@  .@@ \n";
	result += " @@@    &@@@. @@@@@,  @@@@@. &@@@    @@@ \n";
	result += " ,@@@@@*  .@@@@@@@@@@@@@@@@@@@/  .@@@@@/ \n";
	result += "     &@@@@@, #@@@@@@.@@@@@@@  @@@@@@     \n";
	result += "        #@@@@@@@&       %@@@@@@@%        \n";
	result += "          ,@@@@@@@   @@@@@@@(            \n";
	result += "             .@@@@@@@@@@@.               \n";
	result += "                 /@@@/                   \n";
	result += "                                         \n";
	result += "</code></pre></span></font><br>";
	return result;
}

WiFiServer  * server;

String uri = "";
int argsCount = 0;
String arg[22];
String argName[22];

void HTTPServerBegin(uint16_t port)
{
	server = new WiFiServer(port);
	server->begin();
}

String _getContentType(String fileName)
{
	if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return "text/html";
	if (fileName.endsWith(".css")) return "text/css";
	if (fileName.endsWith(".js")) return "application/javascript";
	if (fileName.endsWith(".ico")) return "image/x-icon";
	if (fileName.endsWith(".gz")) return "application/x-gzip";
	return "text/plain";
}


String createResponseHeader(int HTTPResponseCode, String contentType, String ContentEncoding)
{
	return "HTTP/1.1 " + String(HTTPResponseCode) + " OK\n\r" +
		"Content-type: " + contentType + "\n\r" +
		"Content-Encoding: " + ContentEncoding + "\n\r" +
		"Access-Control-Max-Age: 10000"
		"Access-Control-Allow-Methods: GET, OPTIONS, PUT, POST\n\r" +
		"Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\n\r" +
		"Access-Control-Allow-Origin: *\n\r" +
		"Server: OWLOS\n\r\n\r";

}

void sendResponseHeader(int HTTPResponseCode, String contentType, String ContentEncoding, WiFiClient client)
{
	client.println("HTTP/1.1 " + String(HTTPResponseCode) + " OK");
	client.println("Content-type: " + contentType);
	client.println("Content-Encoding: " + ContentEncoding);
	client.println("Access-Control-Max-Age: 10000");
	client.println("Access-Control-Allow-Methods: GET, OPTIONS, PUT, POST");
	client.println("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	client.println("Access-Control-Allow-Origin: *");
	client.println("Server: OWLOS");
	client.println("");

}


void send(int HTTPResponseCode, String contentType, String content, WiFiClient client)
{
	//content = createResponseHeader(HTTPResponseCode, contentType, "") + content + "/n/r/n/r";
	sendResponseHeader(HTTPResponseCode, contentType, "", client);
	client.write(content.c_str(), content.length());
}

void handleNotFound(WiFiClient client)
{
	if ((filesExists(uri)) || (filesExists(uri + ".gz")))
	{

		String contentType = _getContentType(uri);
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

	String acip = unitGetWiFiAccessPointIP() + ":" + String(unitGetRESTfulServerPort());
	String ip = unitGetWiFiIP() + ":" + String(unitGetRESTfulServerPort());


	//404 section --------------
	String helloString = unitGetUnitId() + "::Ready IoT Solution::OWLOS";
	String message = createResponseHeader(404, "text/html", "");
	message += "<html><header><title>" + helloString + "</title>";
	message += "<style>a{color: #00DC00;text-decoration: none;} a:hover {text-decoration: underline;} a:active {text-decoration: underline;}}</style></header>";
	message += "<body  bgcolor='#4D4D4D'><font color='#A5A5A5'>" + _GetLogoHTML() + "<h3>" + helloString + "</h3>";
	message += "<b>URI not found http://" + ip + uri + " or http://" + acip + uri + "</b><br>";
	message += "Method: ";
	//message += (webServer->method() == HTTP_GET) ? "GET" : "POST";
	message += "<br>Arguments: ";
	//message += webServer->args();
	message += "<br>";
	message += "<font color='#208ECD'><h3>Available RESTful APIs for local network " + unitGetWiFiSSID() + ":</h3></font>";
	message += "<b>Log's API:</b><br>";
	message += "<a href='http://" + ip + "/getlog?number=1' target='_blank'>http://" + ip + "/getlog?number=1</a> get first log file<br>";
	message += "<a href='http://" + ip + "/getlog?number=2' target='_blank'>http://" + ip + "/getlog?number=2</a> get second log file<br>";
	message += "<br><b>File's API:</b><br>";
	message += "<a href='http://" + ip + "/getfilelist?path=' target='_blank'>http://" + ip + "/getfilelist?path=</a> get list of unit files<br>";
	message += "<a href='http://" + ip + "/deletefile?name=' target='_blank'>http://" + ip + "/deletefile?path=</a> delete file<br>";
	message += "<a href='http://" + ip + "/downloadfile?name=foo' target='_blank'>http://" + ip + "/downloadfile?name=foo</a> download file<br>";
	message += "<a href='http://" + ip + "/upload' target='_blank'>http://" + ip + "/upload</a> upload file WebForm (not API, use uploadfile POST request to upload file)<br>";
	message += "<br><b>Unit's API:</b><br>";
	message += "<a href='http://" + ip + "/getunitproperty?property=id' target='_blank'>http://" + ip + "/getproperty?property=id</a> get unit property<br>";
	message += "<a href='http://" + ip + "/getallunitproperties' target='_blank'>http://" + ip + "/getallunitproperties</a> get all unit's properties<br>";
	message += "<a href='http://" + ip + "/setunitproperty?property=foo&value=bar' target='_blank'>http://" + ip + "/setproperty?property=foo&value=bar</a> set unit property<br>";
	message += "<font color='red'><b>Be careful, changing the unit's properties can do its unmanagement</b></font><br>";
	message += "The unit must be rebooted after changing the property value<br>";
	message += "<br><b>Driver's API:</b><br>";
	message += "<a href='http://" + ip + "/adddriver?type=foo&id=bar&pin1=foo&pin2=foo&pin3=foo&pin4=foo' target='_blank'>http://" + ip + "/adddriver?type=foo&id=bar&pin1=foo&pin2=foo&pin3=foo&pin4=foo</a> add new driver<br>";
	message += "<a href='http://" + ip + "/getdriversid' target='_blank'>http://" + ip + "/getdriversid</a> get all drivers IDs<br>";
	message += "<a href='http://" + ip + "/getdriverproperty?id=foo&property=bar' target='_blank'>http://" + ip + "/getdriverproperty?id=foo&property=bar</a> get driver property<br>";
	message += "<a href='http://" + ip + "/setdriverproperty?id=foo&property=bar&value=bar' target='_blank'>http://" + ip + "/setdriverproperty?id=foo&property=bar&value=bar</a> set driver property<br>";
	message += "<a href='http://" + ip + "/getdriverproperties?id=foo' target='_blank'>http://" + ip + "/getdriverproperties?id=foo</a> get driver's all properties<br>";
	message += "<a href='http://" + ip + "/getalldriversproperties' target='_blank'>http://" + ip + "/getalldriversproperties</a> get all drivers all properties<br>";
	message += "<a href='http://" + ip + "/reset' target='_blank'>http://" + ip + "/reset</a> reset unit<br>";

	message += "<font color='#208ECD'><h3>Available RESTful APIs for access point " + unitGetWiFiAccessPointSSID() + ":</h3></font>";
	message += "<b>Log's API:</b><br>";
	message += "<a href='http://" + acip + "/getlog?number=1' target='_blank'>http://" + acip + "/getlog?number=1</a> get first log file<br>";
	message += "<a href='http://" + acip + "/getlog?number=2' target='_blank'>http://" + acip + "/getlog?number=2</a> get second log file<br>";
	message += "<br><b>Unit's API:</b><br>";
	message += "<a href='http://" + acip + "/getunitproperty?property=id' target='_blank'>http://" + acip + "/getproperty?property=id</a> get unit property<br>";
	message += "<a href='http://" + acip + "/getallunitproperties' target='_blank'>http://" + acip + "/getallunitproperties</a> get all unit's properties<br>";
	message += "<a href='http://" + acip + "/setunitproperty?property=foo&value=bar' target='_blank'>http://" + acip + "/setproperty?property=foo&value=bar</a> set unit property<br>";
	message += "<font color='red'><b>Be careful, changing the unit's properties can do its unmanagement</b></font><br>";
	message += "The unit must be rebooted after changing the property value<br>";
	message += "<br><b>Driver's API:</b><br>";
	message += "<a href='http://" + acip + "/getdriversid' target='_blank'>http://" + acip + "/getdriversid</a> get all drivers IDs<br>";
	message += "<a href='http://" + acip + "/getdriverproperty?id=foo&property=bar' target='_blank'>http://" + acip + "/getdriverproperty?id=foo&property=bar</a> get driver property<br>";
	message += "<a href='http://" + acip + "/setdriverproperty?id=foo&property=bar&value=bar' target='_blank'>http://" + acip + "/setdriverproperty?id=foo&property=bar&value=bar</a> set driver property<br>";
	message += "<a href='http://" + acip + "/getdriverproperties?id=foo' target='_blank'>http://" + acip + "/getdriverproperties?id=foo</a> get driver's all properties<br>";
	message += "<a href='http://" + acip + "/getalldriversproperties' target='_blank'>http://" + acip + "/getalldriversproperties</a> get all drivers all properties<br>";


	message += "</font></body></html>";

	//for (uint8_t i = 0; i < webServer->args(); i++) {
//		message += " " + webServer->argName(i) + ": " + webServer->arg(i) + "\n";
//	}

	debugOut(WebServerId, "404: URI not found http://" + ip + uri + "or http://" + acip + uri);
	client.print(message);
	client.println();
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

				char c = client.read();

				//Serial.write(c);

				if (c == '\n')
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
						debugOut("---", firstLine);
						uri = firstLine.substring(firstLine.indexOf(" ") + 1);
						uri = uri.substring(0, uri.indexOf(" "));
						if ((uri.length() == 0) || (uri.equals("/"))) uri = "/index.html";

						debugOut("-->", uri);


						argsCount = 0;
						int hasArgs = firstLine.indexOf('?');
						if (hasArgs != -1)
						{
							int argPos = 0;
							String argsStr = firstLine.substring(hasArgs + 1);
							argsStr = argsStr.substring(0, argsStr.indexOf(" "));
							Serial.println("-------");
							Serial.println(argsStr);
							argsStr += "&";
							while ((argPos = argsStr.indexOf("&")) != -1)
							{
								String currentArg = argsStr.substring(0, argPos);
								Serial.println(currentArg);
								argName[argsCount] = currentArg.substring(0, currentArg.indexOf("="));
								arg[argsCount] = currentArg.substring(currentArg.indexOf("=") + 1);

								Serial.println(argName[argsCount]);
								Serial.println(arg[argsCount]);
								Serial.println(String(argsCount).c_str());
								argsCount++;

								argsStr.remove(0, argPos + 1);
							}
						}
						Serial.println("Get");
						if (firstLine.indexOf("/getdriverproperties?") != -1)
						{
							handleGetDriverProperties(client);
						}
						else
							if (firstLine.indexOf("/getalldriversproperties ") != -1)
							{
								handleGetAllDriversProperties(client);
							}
							else
							{
								Serial.println("Not found");
								handleNotFound(client);
							}

						break;
					}
				}
				else
					if (c != '\r')
					{
						currentLine += c;
					}
			}
		}
	}
	// close the connection		
	client.stop();
}
