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
//#define USESSL
#define NOTUSESSL

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <FS.h>
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
#include <WiFi.h>
#include <ESPmDNS.h>
#include <SPIFFS.h>
#endif


#include <ESP.h>

#include <Arduino.h>

#include <WiFiClient.h>


#ifdef USESSL
	#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	#include <ESP8266WebServerSecure.h>
	#endif

	#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	#include <WebServerSecure.h>
	#endif

#endif

#ifdef NOTUSESSL
	#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	#include <ESP8266WebServer.h>
	#endif

	#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	#include <WebServer.h>
	#endif
#endif

#include "WebServer.h"
#include "..\Managers\DriverManager.h"
#include "..\Managers\ScriptManager.h"
#include "..\Managers\UpdateManager.h"
#include "..\..\UnitProperties.h"
#include "..\..\WebProperties.h"


#ifdef USESSL

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
BearSSL::ESP8266WebServerSecure * webServer;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
BearSSL::WebServerSecure * webServer;
#endif

#endif

#ifdef NOTUSESSL

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
ESP8266WebServer * webServer;
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
WebServer * webServer;
#endif

#endif

int __RESTfulPort;
bool started(false);

//----------------------------------------------------------------------------------------------
String GetLogoHTML()
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

#ifdef USESSL
static const char serverCert[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIICDTCCAbcCFBTk1fdozzaP8yDg/XnD8A5cF8agMA0GCSqGSIb3DQEBCwUAMIGH
MQswCQYDVQQGEwJVQTEKMAgGA1UECAwBSzENMAsGA1UEBwwES2lldjEfMB0GA1UE
CgwWQ2xvdWRzQW5kU29mdHdhcmUgW1JPXTEaMBgGA1UECwwRT1dMU21hcnRIb3Vz
ZVVuaXQxIDAeBgNVBAMMF09XTFNtYXJ0SG91c2VVbml0LmxvY2FsMB4XDTE5MDkz
MDE2MDcyMFoXDTIwMDkyOTE2MDcyMFowgYcxCzAJBgNVBAYTAlVBMQowCAYDVQQI
DAFLMQ0wCwYDVQQHDARLaWV2MR8wHQYDVQQKDBZDbG91ZHNBbmRTb2Z0d2FyZSBb
Uk9dMRowGAYDVQQLDBFPV0xTbWFydEhvdXNlVW5pdDEgMB4GA1UEAwwXT1dMU21h
cnRIb3VzZVVuaXQubG9jYWwwXDANBgkqhkiG9w0BAQEFAANLADBIAkEAuD58qM0d
d+ZljZB9bNE+a+MaEBfAvvImYq0KJxbGlGH7l8n/WaYhAn+R7GFMtampcxEXWvh7
sAigWcd/C6JvkwIDAQABMA0GCSqGSIb3DQEBCwUAA0EAmFrZhY2A2yRs/hrsoqaz
OtXnBzbWh8qoOVKnG7VQTOVsrqRnDPQC+p9f5Cu+YxcJSUHQmAEOKK1NEp5dwrR3
EQ==
-----END CERTIFICATE-----
)EOF";

static const char serverKey[] PROGMEM = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBALg+fKjNHXfmZY2QfWzRPmvjGhAXwL7yJmKtCicWxpRh+5fJ/1mm
IQJ/kexhTLWpqXMRF1r4e7AIoFnHfwuib5MCAwEAAQJBAIfoGB6QR1eFjY2ycsLN
SsVcnYIXc2emyefqCt4wr8UNjC5R5MGTvLjAAZrW+myPMUHGHMtj+hG2+ADkq7Fx
HIECIQDukEsUZw8ZuwhoWYKgxO5NhHNPtPWmF1bn0YS4gGCCUwIhAMW11WXmsu8h
Dweq4GF01y6+7wqfiot4xzC0IAi15zXBAiA5n5TjCrm1B15ShjxtROQiyTlpKVak
lcKiIBOk1S16jQIhAMQwmO8Ci6MBkhGQvhHXSMSpUTmgcXHPSxIIXBVotGPBAiAF
aA4UzF0VOAUXbuowgVHJwkZJKGVfLiyhJGOidLAUlw==
-----END RSA PRIVATE KEY-----
)EOF";
#endif

void webServerAddCORSHeaders()
{
	String clientIP = webServer->client().remoteIP().toString();
#ifdef DetailedDebug 
	debugOut(WebServerId, "client: " + clientIP + " ask: " + webServer->uri());
#endif

	if (unitGetRESTfulAvailable() == 1)
	{
		webServer->sendHeader("Access-Control-Max-Age", "10000");
		webServer->sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS, PUT, POST"); //only GET allowed at this version
		webServer->sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		webServer->sendHeader("Access-Control-Allow-Origin", "*");
		webServer->sendHeader("Server", "HELLO " + clientIP);
		webServer->sendHeader("Server", "OWLOS " + unitGetUnitId());
	}
	else
	{
		debugOut(WebServerId, "RESTful stop by configuration flag");
		webServer->stop();
	}
}

//----------------------------------------------------------------------------------------------
String getContentType(String fileName)
{
	if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return "text/html";
	if (fileName.endsWith(".css")) return "text/css";
	if (fileName.endsWith(".js")) return "application/javascript";
	if (fileName.endsWith(".ico")) return "image/x-icon";
	if (fileName.endsWith(".gz")) return "application/x-gzip";
	return "text/plain";
}

String decode(String param)
{
	param.replace("+", " ");
	param.replace("%20", " ");
	param.replace("%21", "!");
	param.replace("%23", "#");
	param.replace("%24", "$");
	param.replace("%26", "&");
	param.replace("%27", "'");
	param.replace("%28", "(");
	param.replace("%29", ")");
	param.replace("%2A", "*");
	param.replace("%2B", "+");
	param.replace("%2C", ",");
	param.replace("%2F", "/");
	param.replace("%3A", ":");
	param.replace("%3B", ";");
	param.replace("%3D", "=");
	param.replace("%3F", "?");
	param.replace("%40", "@");
	param.replace("%5B", "[");
	param.replace("%5D", "]");
	param.replace("%3E", ">");
	param.replace("%3C", "<");
	param.replace("%0A", "\n");
	param.replace("%0D", "\n");
	param.replace("%09", "\t");
	return param;
}

//----------------------------------------------------------------------------------------------
void handleNotFound() {
	webServerAddCORSHeaders();
	String acip = unitGetWiFiAccessPointIP() + ":" + String(unitGetRESTfulServerPort());
	String ip = unitGetWiFiIP() + ":" + String(unitGetRESTfulServerPort());

	if (!webServer->authenticate(stringToChar(unitGetRESTfulServerUsername()), stringToChar(unitGetRESTfulServerPassword())))
	{
		return webServer->requestAuthentication(DIGEST_AUTH, "OWLOS", "no auth");
	}


	//Web UI section -----------
	String fileName = webServer->uri().substring(1);

	if (fileName.length() == 0) fileName = "index.html";

	String contentType = getContentType(fileName);

	if (filesExists(fileName + ".gz")) fileName = fileName + ".gz";

	if (filesExists(fileName))
	{
		File download = SPIFFS.open(fileName, "r");
		if (download)
		{
			webServer->streamFile(download, contentType);
			download.close();
			return;
		}
	}

	//404 section --------------
	String helloString = unitGetUnitId() + "::Ready IoT Solution::OWLOS";
	String message = "<html><header><title>" + helloString + "</title>";
	message += "<style>a{color: #00DC00;text-decoration: none;} a:hover {text-decoration: underline;} a:active {text-decoration: underline;}}</style></header>";
	message += "<body  bgcolor='#4D4D4D'><font color='#A5A5A5'>" + GetLogoHTML() + "<h3>" + helloString + "</h3>";
	message += "<b>URI not found http://" + ip + webServer->uri() + " or http://" + acip + webServer->uri() + "</b><br>";
	message += "Method: ";
	message += (webServer->method() == HTTP_GET) ? "GET" : "POST";
	message += "<br>Arguments: ";
	message += webServer->args();
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

	for (uint8_t i = 0; i < webServer->args(); i++) {
		message += " " + webServer->argName(i) + ": " + webServer->arg(i) + "\n";
	}

	debugOut(WebServerId, "404: URI not found http://" + ip + webServer->uri() + "or http://" + acip + webServer->uri());
	webServer->send(404, "text/html", message);

}
//----------------------------------------------------------------------------------------------
void handleCORS()
{
	webServerAddCORSHeaders();
	webServer->send(200, "text/plain", "");
}

//----------------------------------------------------------------------------------------------
void handleGetLog()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("number"))
		{
			String log = "wrong log number argument";
			if (webServer->arg(0).equals("1"))
			{
				log = filesReadString(LogFile1);
			}
			else
			{
				log = filesReadString(LogFile2);
			}
			webServer->send(200, "text/plain", log);
			return;
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleGetFileList()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("path"))
		{
			webServer->send(200, "text/plain", filesGetList(webServer->arg(0)));
			return;
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleDeleteFile()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("name"))
		{
			webServer->send(200, "text/plain", String(filesDelete(webServer->arg(0))));
			return;
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleDownloadFile()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("name"))
		{
			String filename = webServer->arg(0);
			if (filesExists(filename))
			{
				File download = SPIFFS.open(filename, "r");
				if (download)
				{
					webServer->sendHeader("Content-Type", "text/text");
					webServer->sendHeader("Content-Disposition", "attachment; filename=" + filename);
					webServer->sendHeader("Connection", "close");
					webServer->streamFile(download, "application/octet-stream");
					download.close();
					return;
				}
				else
				{
					webServer->send(403, "text/plain", "file '" + filename + "' can't be open");
					return;
				}
			}
			webServer->send(403, "text/plain", "file '" + filename + "' not exist");
			return;
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
//It is not API - it web page for send select file form, to make POST request at UI level  
void handleUpload() {
	webServerAddCORSHeaders();
	String html = "<h3>Select file to upload</h3>";
	html += "<FORM action='/uploadfile' method='post' enctype='multipart/form-data'>";
	html += "<input class='buttons' style='width:50%' type='file' name='fileupload' id = 'fileupload' value=''><br>";
	html += "<br><button class='buttons' style='width:10%' type='submit'>upload</button><br>";
	webServer->send(200, "text/html", html);
}
//----------------------------------------------------------------------------------------------
File fs_uploadFile;
void handleUploadFile()
{
	webServerAddCORSHeaders();
	HTTPUpload& http_uploadFile = webServer->upload();
#ifdef DetailedDebug
	debugOut(WebServerId, "upload: " + http_uploadFile.filename + " status: " + String(http_uploadFile.status));
#endif
	if (http_uploadFile.status == UPLOAD_FILE_START)
	{
#ifdef DetailedDebug
		debugOut(WebServerId, "upload start: " + http_uploadFile.filename);
#endif
		String filename = http_uploadFile.filename;
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
					debugOut(WebServerId, "upload aborted, reson: end of unit heap");
#endif
					webServer->send(504, "text/plain", "upload aborted, reson: end of unit heap");
				}
				else
				{
					fs_uploadFile.write(http_uploadFile.buf, http_uploadFile.currentSize);
#ifdef DetailedDebug
					debugOut(WebServerId, "upload write: " + String(http_uploadFile.currentSize));
#endif
				}

			}
			else
			{
#ifdef DetailedDebug
				debugOut(WebServerId, "upload write error");
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
					debugOut(WebServerId, "uploaded success: " + html);
#endif
					webServer->send(200, "text/plain", html);
				}
				else
				{
#ifdef DetailedDebug
					debugOut(WebServerId, "upload can't create file");
#endif
					webServer->send(503, "text/plain", http_uploadFile.filename);
				}
			}
			else
				if (http_uploadFile.status == UPLOAD_FILE_ABORTED)
				{
#ifdef DetailedDebug
					debugOut(WebServerId, "upload aborted");
#endif
					webServer->send(504, "text/plain", http_uploadFile.filename);
				}
				else
				{
#ifdef DetailedDebug
					debugOut(WebServerId, "upload bad file name, size or content for ESP FlashFileSystem");
#endif
					webServer->send(505, "text/plain", "upload bad file name, size or content for ESP FlashFileSystem");
				}
}

//----------------------------------------------------------------------------------------------
void handleGetUnitProperty()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("property"))
		{
			String unitProp = unitOnMessage(unitGetTopic() + "/get" + decode(webServer->arg(0)), "", NoTransportMask);
			if ((unitProp.length() == 0) || (unitProp.equals(WrongPropertyName)))
			{
				unitProp = "wrong unit property: " + webServer->arg(0);
				webServer->send(404, "text/html", unitProp);
				return;
			}
			else
			{
				webServer->send(200, "text/plain", unitProp);
				return;
			}

		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleSetUnitProperty()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 1)
	{
		if ((webServer->argName(0).equals("property")) && (webServer->argName(1).equals("value")))
		{
			String result = unitOnMessage(unitGetTopic() + "/set" + decode(webServer->arg(0)), decode(webServer->arg(1)), NoTransportMask);
			if ((result.length() == 0) || (result.equals("0")))
			{
				result = "wrong unit property set: " + webServer->arg(0) + "=" + webServer->arg(1);
				webServer->send(404, "text/html", result);
				return;
			}
			else
			{
				webServer->send(200, "text/plain", result);
				return;
			}

		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleGetAllUnitProperties()
{
	webServerAddCORSHeaders();
	webServer->send(200, "text/plain", unitGetAllProperties());
	return;
}

//----------------------------------------------------------------------------------------------
void handleAddDriver()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 5)
	{
		if ((webServer->argName(0).equals("type")) && (webServer->argName(1).equals("id")) && (webServer->argName(2).equals("pin1"))
			&& (webServer->argName(3).equals("pin2")) && (webServer->argName(4).equals("pin3")) && (webServer->argName(5).equals("pin4")))
		{
			int _type = std::atoi(webServer->arg(0).c_str());
			String _id = webServer->arg(1);
			int _pin1 = driversPinNameToValue(webServer->arg(2));
			int _pin2 = driversPinNameToValue(webServer->arg(3));
			int _pin3 = driversPinNameToValue(webServer->arg(4));
			int _pin4 = driversPinNameToValue(webServer->arg(5));

			String result = driversAdd(_type, _id, _pin1, _pin2, _pin3, _pin4);
			if (!result.equals("1"))
			{
				webServer->send(503, "text/html", result);
			}
			else
			{
				if (!driversSaveToConfig(_type, _id, _pin1, _pin2, _pin3, _pin4))
				{
					webServer->send(503, "text/html", "bad, driver added but not stored to configuration file");
				}
				else
				{
					webServer->send(200, "text/html", "1");
				}
			}
			return;
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleGetDriversId()
{
	webServerAddCORSHeaders();
	webServer->send(200, "text/plain", driversGetDriversId());
}

//----------------------------------------------------------------------------------------------
void handleGetDriverProperties()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("id"))
		{
			String driverProp = driversGetDriverProperties(webServer->arg(0));
			if (driverProp.length() == 0)
			{
				driverProp = "wrong driver id: " + webServer->arg(0) + " use GetDriversId API to get all drivers list";
				webServer->send(404, "text/html", driverProp);
			}
			else
			{
				webServer->send(200, "text/plain", driverProp);
			}
			return;
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleGetDriverProperty()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 1)
	{
		if ((webServer->argName(0).equals("id")) && (webServer->argName(1).equals("property")))
		{
			String driverProp = driversGetDriverProperty(webServer->arg(0), decode(webServer->arg(1)));
			if (driverProp.length() == 0) //then try get this property from unit 
			{
				driverProp = unitOnMessage(unitGetTopic() + "/get" + decode(webServer->arg(1)), "", NoTransportMask);
			}

			if (driverProp.length() == 0)
			{
				driverProp = "wrong driver id: " + webServer->arg(0) + " use GetDriversId API to get all drivers list";
				webServer->send(404, "text/html", driverProp);
			}
			else if (driverProp.equals(NotAvailable))
			{
				driverProp = "driver property: " + webServer->arg(1) + " set as NOT Available";
				webServer->send(404, "text/html", driverProp);
			}
			else if (driverProp.equals(WrongPropertyName))
			{
				driverProp = "driver property: " + webServer->arg(1) + " not exists";
				webServer->send(404, "text/html", driverProp);
			}
			else
			{
				webServer->send(200, "text/plain", driverProp);
			}
			return;
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleSetDriverProperty()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 2)
	{
		if ((webServer->argName(0).equals("id")) && (webServer->argName(1).equals("property")) && (webServer->argName(2).equals("value")))
		{
			String result = driversSetDriverProperty(webServer->arg(0), decode(webServer->arg(1)), decode(webServer->arg(2)));
			if (result.length() == 0) //try set unit property
			{
				result = unitOnMessage(unitGetTopic() + "/set" + decode(webServer->arg(1)), decode(webServer->arg(2)), NoTransportMask);
			}

			if (result.length() == 0)
			{
				result = "wrong driver id: " + webServer->arg(0) + " use GetDriversId API to get all drivers list";
				webServer->send(404, "text/html", result);
			}
			else if (result.equals(NotAvailable))
			{
				result = "driver property: " + webServer->arg(1) + " set as NOT Available";
				webServer->send(404, "text/html", result);
			}
			else if (result.equals(WrongPropertyName))
			{
				result = "driver property: " + webServer->arg(1) + " not exists";
				webServer->send(404, "text/html", result);
			}
			else if (result.equals("0"))
			{
				result = "driver property: " + webServer->arg(1) + " can't be modify";
				webServer->send(404, "text/html", result);
			}
			else
			{
				webServer->send(200, "text/plain", result);
			}
			return;
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleGetWebProperty()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("property"))
		{
			//String configProperties = webOnMessage(unitGetTopic() + "/get" + decode(webServer->arg(0)), "");

			File download = SPIFFS.open("web.config", "r");
			if (download)
			{
				webServer->streamFile(download, "text/html");
				download.close();
				return;
			}
			/*
			if ((configProperties.length() == 0) || (configProperties.equals(WrongPropertyName)))
			{
				configProperties = "wrong web property: " + webServer->arg(0);
				webServer->send(404, "text/html", configProperties);
				return;
			}
			else
			{
				webServer->send(200, "text/plain", configProperties);
				return;
			}
			*/
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
//POST
void handleSetWebProperty()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 1)
	{
		if (webServer->argName(1).equals("property"))
		{
			String result = webOnMessage(unitGetTopic() + "/set" + decode(webServer->arg(1)), decode(webServer->arg(0)));			
			if ((result.length() == 0) || (result.equals("0")))
			{
				result = "wrong unit property set: " + webServer->arg(0) + "=" + webServer->arg(1);
				webServer->send(404, "text/html", result);
				return;
			}
			else
			{
				webServer->send(200, "text/plain", result);
				return;
			}
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleGetAllDriversProperties() {
	webServerAddCORSHeaders();
	webServer->send(200, "text/plain", driversGetAllDriversProperties());
}

//----------------------------------------------------------------------------------------------
void handleReset() {
	webServerAddCORSHeaders();
	webServer->send(200, "text/plain", "1");
	unitSetESPReset(1);
}

//work with pins
//----------------------------------------------------------------------------------------------
void handlesetpinmode()
{
	webServerAddCORSHeaders();
	if (webServer->args() < 2)
	{
		handleNotFound();
		return;
	}
	if (!(webServer->argName(0).equals("pin")) || !(webServer->argName(1).equals("mode")))
	{
		handleNotFound();
		return;
	}
	int pin = -1;
	if (webServer->arg(0).equals("BUILTIN_LED")) pin = BUILTIN_LED;
	else pin = driversPinNameToValue(webServer->arg(0));
	if (pin == -1)
	{
		webServer->send(404, "text/html", "wrong pin: " + webServer->arg(0));
		return;
	}
	if (checkPinBusy(pin))
	{
		webServer->send(404, "text/html", "busy pin: " + webServer->arg(0));
		return;
	}
	String _mode = webServer->arg(1);
	_mode.toUpperCase();
	int mode = 0;
	if (_mode.equals("INPUT")) mode = INPUT;
	else if (_mode.equals("OUTPUT")) mode = OUTPUT;
	else if (_mode.equals("INPUT_PULLUP")) mode = INPUT_PULLUP;
	else
	{
		webServer->send(404, "text/html", "wrong pin mode: " + webServer->arg(1));
		return;
	}
	pinMode(pin, mode);
	webServer->send(200, "text/html", "1");
	return;
}
//----------------------------------------------------------------------------------------------
void handlereadpin()
{
	webServerAddCORSHeaders();
	if (webServer->args() < 1)
	{
		handleNotFound();
		return;
	}
	if (!webServer->argName(0).equals("pin"))
	{
		handleNotFound();
		return;
	}
	int pin = driversPinNameToValue(webServer->arg(0));
	if (pin == -1)
	{
		webServer->send(404, "text/html", "wrong pin: " + webServer->arg(0));
		return;
	}
	if (checkPinBusy(pin))
	{
		webServer->send(404, "text/html", "busy pin: " + webServer->arg(0));
		return;
	}
	int result = -1;
	if (pin = A0) result = analogRead(pin);
	else result = digitalRead(pin);
	webServer->send(200, "text/html", String(result));
	return;
}
//----------------------------------------------------------------------------------------------
void handlewritepin()
{
	webServerAddCORSHeaders();
	if (webServer->args() < 2)
	{
		handleNotFound();
		return;
	}
	if (!(webServer->argName(0).equals("pin")) || !(webServer->argName(1).equals("value")))
	{
		handleNotFound();
		return;
	}
	int pin = -1;
	if (webServer->arg(0).equals("BUILTIN_LED")) pin = BUILTIN_LED;
	else pin = driversPinNameToValue(webServer->arg(0));
	if (pin == -1)
	{
		webServer->send(404, "text/html", "wrong pin: " + webServer->arg(0));
		return;
	}
	if (checkPinBusy(pin))
	{
		webServer->send(404, "text/html", "busy pin: " + webServer->arg(0));
		return;
	}
	String _value = webServer->arg(1);
	_value.toUpperCase();
	int value = 0;
	if (_value.equals("LOW")) value = LOW;
	else if (_value.equals("HIGH")) value = HIGH;
	else value = std::atoi(webServer->arg(1).c_str());
#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
	if (pin == A0) analogWrite(pin, value);
	else digitalWrite(pin, value);
#endif
	webServer->send(200, "text/html", "1");
	return;
}
//Update UI ------------------------------------------------------------------------------------
void handleUpdateLog()
{
	webServerAddCORSHeaders();
	webServer->send(200, "text/plain", updateGetUpdateLog());
}

void handleUpdateUI()
{
	webServerAddCORSHeaders();
	if (updateGetUpdatePossible() < 1)
	{
		webServer->send(503, "text/plain", "0");
	}
	else
		if (updateGetUpdateUIStatus() < 2)
		{
			webServer->send(504, "text/plain", "0");
		}
		else
		{
			webServer->send(200, "text/plain", "1");
			updateUI();
		}
}

void handleUpdateFirmware()
{
	webServerAddCORSHeaders();
	if (updateGetUpdatePossible() < 2)
	{
		webServer->send(503, "text/plain", "0");
	}
	else
		if (updateGetUpdateFirmwareStatus() < 2)
		{
			webServer->send(504, "text/plain", "0");
		}
		else
		{
			webServer->send(200, "text/plain", "1");
			updateFirmware();
		}
}
//----------------------------------------------------------------------------------------------
//Create script 
void handleCreateScript()
{	
	webServerAddCORSHeaders();
	if (webServer->args() > 1)
	{
		if (webServer->argName(1).equals("name"))
		{
			String result = String(scriptsCreate(decode(webServer->arg(1)), decode(webServer->arg(0))));
			if (result.length() != 0)
			{				
				webServer->send(503, "text/html", result);
				return;
			}
			else
			{
				webServer->send(200, "text/plain", result);
				return;
			}

		}
	}
	handleNotFound();
}

void handleGetAllScripts() {
	webServerAddCORSHeaders();
	webServer->send(200, "text/plain", scriptsGetAll());
}

void handleDeleteScript()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{
		if (webServer->argName(0).equals("name"))
		{
			webServer->send(200, "text/plain", String(scriptsDelete(webServer->arg(0))));
			return;
		}
	}
	handleNotFound();
}

void handleStartDebugScript()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{		
		if (webServer->argName(0).equals("name"))
		{	
			webServer->send(200, "text/plain", String(scriptsStartDebug(webServer->arg(0))));
			return;
		}
	}
	handleNotFound();
}

void handleDebugNextScript()
{
	webServerAddCORSHeaders();
	if (webServer->args() > 0)
	{		
		if (webServer->argName(0).equals("name"))
		{
			webServer->send(200, "text/plain", String(scriptsDebugNext(webServer->arg(0))));
			return;
		}
	}
	handleNotFound();
}



//----------------------------------------------------------------------------------------------
bool webServerBegin()
{
	if (started) return true;
#ifdef DetailedDebug
	debugOut(WebServerId, "RESTful start by configuration flag");
#endif


#ifdef USESSL

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0	
	webServer = new BearSSL::ESP8266WebServerSecure(unitGetRESTfulServerPort());
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4	
	 webServer = new BearSSL::WebServerSecure(unitGetRESTfulServerPort());
#endif

#endif

#ifdef NOTUSESSL

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0	
	webServer = new ESP8266WebServer(unitGetRESTfulServerPort());
#endif

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
	
	webServer = new WebServer(unitGetRESTfulServerPort());
#endif

#endif




#ifdef USESSL
	if (MDNS.begin("OWLOS.local"))
	{
		debugOut(WebServerId, "MDNS responder started OWLOS.local");
	}
	webServer->setBufferSizes(1024, 1024);
	webServer->setRSACert(new BearSSL::X509List(serverCert), new BearSSL::PrivateKey(serverKey));
#endif

	webServer->on("/", HTTP_OPTIONS, handleCORS);
	webServer->onNotFound(handleNotFound);
	webServer->on("/getlog", handleGetLog);
	webServer->on("/getfilelist", handleGetFileList);
	webServer->on("/deletefile", handleDeleteFile);
	webServer->on("/downloadfile", handleDownloadFile);
	webServer->on("/upload", handleUpload);
	webServer->on("/uploadfile", HTTP_POST, []() { webServer->send(200);}, handleUploadFile);
	webServer->on("/getunitproperty", handleGetUnitProperty);
	webServer->on("/setunitproperty", handleSetUnitProperty);
	webServer->on("/getallunitproperties", handleGetAllUnitProperties);
	webServer->on("/adddriver", handleAddDriver);
	webServer->on("/getdriversid", handleGetDriversId);
	webServer->on("/getdriverproperty", handleGetDriverProperty);
	webServer->on("/setdriverproperty", handleSetDriverProperty);
	webServer->on("/getdriverproperties", handleGetDriverProperties);
	webServer->on("/getalldriversproperties", handleGetAllDriversProperties);
	webServer->on("/getwebproperty", handleGetWebProperty);
	webServer->on("/setwebproperty", HTTP_POST, handleSetWebProperty);
	webServer->on("/reset", handleReset);
	//work with pins
	webServer->on("/setpinmode", handlesetpinmode);
	webServer->on("/readpin", handlereadpin);
	webServer->on("/writepin", handlewritepin);
	//update
	webServer->on("/updatelog", handleUpdateLog);
	webServer->on("/updateui", handleUpdateUI);
	webServer->on("/updatefirmware", handleUpdateFirmware);
	webServer->on("/createscript", HTTP_POST, handleCreateScript);
	webServer->on("/getallscripts", handleGetAllScripts);
	webServer->on("/startdebugscript", handleStartDebugScript);
	webServer->on("/debugnextscript", handleDebugNextScript);
		
	webServer->begin();

	debugOut(WebServerId, "started at access point as: " + unitGetWiFiAccessPointIP() + ":" + String(unitGetRESTfulServerPort()) + " at local network as: " + unitGetWiFiIP() + ":" + String(unitGetRESTfulServerPort()));

	started = true;
	return true;
}

bool webServerLoop()
{	
	webServer->handleClient();
#ifdef USESSL
	MDNS.update();
#endif
	return true;
}
