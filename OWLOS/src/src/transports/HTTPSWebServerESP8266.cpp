/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Vladimir Kovalevich (covalevich@gmail.com)
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

#include "HTTPSWebServer.h"

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0

#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
#ifdef USE_ESP_DRIVER

#define HTTPServerId "HTTPServer"

#include <ESP.h>
#ifdef USE_HTTPS_SERVER
#include <BearSSLHelpers.h>
#include <WiFiServerSecureBearSSL.h>
#include <WiFiClientSecure.h>
#else
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#endif
#include <ESP8266mDNS.h>
#include <FS.h>

#include <MD5Builder.h>

#include "HTTPServerThings.h"
#include "../drivers/ESPDriver.h"
#include "../services/DriverService.h"
#include "../services/ScriptService.h"
#include "../services/UpdateService.h"
#include "../services/FileService.h"
#include "../Utils/Utils.h"
#include "../Utils/WebProperties.h"

#define HTTP_METHODS " GET, POST, OPTIONS"

#ifdef USE_HTTPS_SERVER
WiFiServerSecure *server;
#else
WiFiServer *server;
#endif

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

#ifdef USE_HTTPS_SERVER
static const char serverCert[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIB1jCCAYACEyE/NQ2eFWYAetidG/ckGeQP3S4wDQYJKoZIhvcNAQELBQAwbTEL
MAkGA1UEBhMCVUExCjAIBgNVBAgMAUsxDTALBgNVBAcMBEtpZXYxHTAbBgNVBAoM
FHlvdXJjb21wYW55bmFtZSBbUk9dMQ4wDAYDVQQLDAVPV0xPUzEUMBIGA1UEAwwL
T1dMT1MubG9jYWwwHhcNMjAwNDAzMjI1MTIxWhcNMjEwNDAzMjI1MTIxWjBtMQsw
CQYDVQQGEwJVQTEKMAgGA1UECAwBSzENMAsGA1UEBwwES2lldjEdMBsGA1UECgwU
eW91cmNvbXBhbnluYW1lIFtST10xDjAMBgNVBAsMBU9XTE9TMRQwEgYDVQQDDAtP
V0xPUy5sb2NhbDBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQDOnlX/u8+hppPYUXUA
6F9D4OtOZpPPLWwx3DOpGgqVovzTGip899gUAk9gwgLd+gENkuZPMo8MdDU5j28F
MaeVAgMBAAEwDQYJKoZIhvcNAQELBQADQQAkxDO5o1Jlj79pF9pjiBIEcAmSevbW
UXyZcQv5Gm/PuOC5QrG6wi18yadCifHCvpS0WbmrGLnUVxy454Pa7k8e
-----END CERTIFICATE-----
)EOF";

static const char serverKey[] PROGMEM = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
MIIBPAIBAAJBAM6eVf+7z6Gmk9hRdQDoX0Pg605mk88tbDHcM6kaCpWi/NMaKnz3
2BQCT2DCAt36AQ2S5k8yjwx0NTmPbwUxp5UCAwEAAQJAC8tUA2YYIxUcKWP09tlM
3tYO+Im4dEIWg/4a4NNAuWvbGqnfH/8/Jt2Rs5GxNHALooYt3JYNRVX9XIbGTJ8i
HQIhAOhFp+qz73yQvDgG59o8jnuk7L0x/sjPz1WTwgctVzD3AiEA47nKihw4HK9/
zt+KCqYf5meipOvwGyITNHd3IE5HFNMCIQCIB/N1w3foriNtdK3o5DpWM5rqmxMq
rHozFlw2M9mytQIhAL0VNycV50FqNyT+VxAgf7w/sLxfay4cTPXze+ZHGJ4hAiEA
5eaYQ5UwRHjh1AASRkNB74XO/WqcxChmwWtuBuXe7Io=
-----END RSA PRIVATE KEY-----
)EOF";
#endif

void calculateToken()
{
#ifdef NOT_SECURE_TOKEN
	MD5Builder md5;
	md5.begin();
	md5.add("OWLOSadmin" + nodeGetESPFlashChipId());
	md5.calculate();
	token = md5.toString();
#endif
}

bool checkToken(String _token)
{
#ifndef NOT_SECURE_TOKEN
	if (token.length() == 0)
		return false;
#endif // !NOT_SECURE_TOKEN

	return token.equals(_token);
}

bool auth(String username, String password)
{
#ifndef NOT_SECURE_TOKEN
	if (token.length() == 0)
		return false;
#endif // !NOT_SECURE_TOKEN

	MD5Builder md5;
	md5.begin();
	md5.add(username + password + nodeGetESPFlashChipId());
	md5.calculate();
	return token.equals(md5.toString());
}

void HTTPSWebServerBegin()
{
	calculateToken();

#ifdef USE_HTTPS_SERVER
	server = new WiFiServerSecure(443);

	if (MDNS.begin("OWLSmartHouseUnit.local"))
	{
#ifdef DEBUG
		debugOut("MDNS", "MDNS responder started OWLSmartHouseUnit.local");
#endif
	}
	server->setBufferSizes(256, 256);
	server->setRSACert(new BearSSL::X509List(serverCert), new BearSSL::PrivateKey(serverKey));

	server->begin();
#else
	server = new WiFiServer(80);
	server->begin();
#endif
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
	client.println("Server: " + String(FIRMWARE_VERSION));
	client.println("");
}

void send(int HTTPResponseCode, String contentType, String content, WiFiClient client)
{
	sendResponseHeader(HTTPResponseCode, contentType, "", client);
	//content += "\n\r";
	client.write(content.c_str(), content.length());
}

String parsePostBody(WiFiClient client)
{
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
					if (data.indexOf(sectionSign) != -1) //endof section parsing
					{
//TODO somthing with body
#ifdef DEBUG
						debugOut("d_body", body);
#endif
#ifdef DETAILED_DEBUG
#ifdef DEBUG
						debugOut("BODY", body);
#endif
#endif
						break;
					}
					else
					{
						if (data.indexOf("Content-Disposition:") != -1) //section header
						{
							//
						}
						else if (data.length() != 0)
						{
							body += data;
#ifdef DEBUG
							debugOut("c_body", data);
#endif
						}
					}
				}

				data = "";
			}
			else if (c != '\r')
			{
				data += c;
			}
		}
	}
	return body;
}

void handleNotFound(WiFiClient client)
{
	if (uri.indexOf("/favicon.ico") != -1)
	{
		sendResponseHeader(405, "text/html", "", client);
		return;
	}

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

//HTTPServer API -----------------------------------------------

void handleGetLog(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("number"))
		{
			String log = "wrong log number argument";
			if (arg[0].equals("1"))
			{
				log = filesReadString(DEBUG_LOG_FILE1_NAME);
			}
			else
			{
				log = filesReadString(DEBUG_LOG_FILE2_NAME);
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

//----------------------------------------------------------------------------------------------
void handleGetUnitProperty(WiFiClient client)
{

	if (argsCount > 0)
	{
		if (argName[0].equals("property"))
		{
			String nodeProp = nodeOnMessage(nodeGetTopic() + "/get" + decode(arg[0]), "", NO_TRANSPORT_MASK);
			if ((nodeProp.length() == 0) || (nodeProp.equals(WRONG_PROPERTY_NAME)))
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
			String result = nodeOnMessage(nodeGetTopic() + "/set" + decode(arg[0]), decode(arg[1]), NO_TRANSPORT_MASK);
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
			String driverResult = driversSetDriverProperty(arg[0], decode(arg[1]), decode(arg[2]));
			if (driverResult.equals("1"))
			{
				driverResult = "";
			}
			else if (driverResult.equals("0"))
			{
				driverResult = "bad set property";
			}
			else
			{
				driverResult = WRONG_PROPERTY_NAME;
			}

			String nodeResult = "";
			if (driverResult.equals(WRONG_PROPERTY_NAME)) //try set node property
			{
				driverResult = "";
				nodeResult = nodeOnMessage(nodeGetTopic() + "/set" + decode(arg[1]), decode(arg[2]), NO_TRANSPORT_MASK);
				if (nodeResult.equals("1"))
				{
					nodeResult = "";
				}
				else if (nodeResult.equals("0"))
				{
					nodeResult = "Wrong set ESP propertry ";
				}
			}

			if (driverResult.length() != 0)
			{
				send(502, "text/html", "wrong driver set property " + arg[0] + "\n" + driverResult, client);
			}
			else if (nodeResult.length() != 0)
			{
				send(502, "text/html", "wrong ESP drivers set property " + arg[0] + "\n" + nodeResult, client);
			}
			else
			{
				send(200, "text/plain", "1", client);
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
			if ((configProperties.length() == 0) || (configProperties.equals(WRONG_PROPERTY_NAME)))
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
#ifdef USE_UPDATE
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
	else if (updateGetUpdateUIStatus() < 2)
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
	else if (updateGetUpdateFirmwareStatus() < 2)
	{
		send(504, "text/plain", "0", client);
	}
	else
	{
		send(200, "text/plain", "1", client);
		updateFirmware();
	}
}
#endif
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
void handleAuth(WiFiClient client)
{
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
				driverProp = nodeOnMessage(nodeGetTopic() + "/get" + decode(arg[1]), "", NO_TRANSPORT_MASK);
			}

			if (driverProp.length() == 0)
			{
				driverProp = "wrong driver id: " + arg[0] + " use GetDriversId API to get all drivers list";
				send(404, "text/html", driverProp, client);
			}
			else if (driverProp.equals(NOT_AVAILABLE))
			{
				driverProp = "driver property: " + arg[1] + " set as NOT Available";
				send(404, "text/html", driverProp, client);
			}
			else if (driverProp.equals(WRONG_PROPERTY_NAME))
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

void handleGetAllDriversProperties(WiFiClient client)
{
	send(200, "text/plain", driversGetAllDriversProperties(), client);
}

void handleGetDriversAccessable(WiFiClient client)
{
	send(200, "text/plain", driversGetAccessable(), client);
}

#ifdef USE_SCRIPT
void handleGetAllScripts(WiFiClient client)
{
	send(200, "text/plain", scriptsGetAll(), client);
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

#endif

void handleGetPinMap(WiFiClient client)
{
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

			if (result != -1)
			{
				send(200, "text/plain", String(result), client);
			}
			else
			{
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

			if (result.length() == 0)
			{
				send(200, "text/plain", String(result), client);
			}
			else
			{
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

			if (result.length() == 0)
			{
				send(200, "text/plain", String(result), client);
			}
			else
			{
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

//TODO: Using upload file
void handleSetWebProperty(WiFiClient client)
{
	//File fs_uploadFile;
	if (argsCount > 0)
	{
#ifdef DEBUG
		debugOut("upload param", arg[0]);
#endif
	}

	String data = "";
	String sectionSign = "";
	//String body = "";
	String fileName = "/web.config";
	File fs_uploadFile;

#define UPLOAD_DATA_LENGTH 200
#define UPLOAD_BUFFER_SIZE 500
	uint8_t *buf = nullptr;
	int bufCount = 0;

	bool append = false;
	while (client.connected())
	{
		if (client.available())
		{
			yield();
			char c = client.read();

			if (append)
			{
				if (buf == nullptr)
				{
					buf = new uint8_t[UPLOAD_BUFFER_SIZE];
				}

				if (bufCount < UPLOAD_BUFFER_SIZE - 1)
				{
					buf[bufCount] = c;
					bufCount++;
				}
				else
				{
					buf[bufCount] = c;
					fs_uploadFile.write(buf, bufCount + 1);
					bufCount = 0;
				}
			}

			if (c == '\n')
			{
				if (sectionSign.length() == 0) //first entry
				{
					int length = data.length();
					data.remove(length - 1, 1);
					sectionSign = data;
				}
				else
				{
					{
						if (data.indexOf("Content-Type:") != -1)
						{
							while (client.connected())
							{
								yield();
								if ((!client.available()) || (client.read() == '\n'))
								{
									break;
								}
							}

#ifdef DEBUG
							debugOut("file_name", fileName);
#endif
							if (!append)
							{
								//filesDelete(fileName);
								fs_uploadFile = SPIFFS.open(fileName, "w");
								append = true;
							}
						}
						else if (data.indexOf("Content-Disposition:") != -1) //section header
						{
							/*
							if (data.indexOf("filename=\"") == -1)
							{
								send(501, "text/html", "wrong file name", client);
								#ifdef DEBUG
debugOut("Upload", "501");
#endif
								return;
							}
							fileName = data.substring(data.indexOf("filename=\"") + String("filename=\"").length());
							fileName = "/" + fileName.substring(0, fileName.indexOf("\""));
							*/
						}
						else if (data.length() != 0)
						{

							if (data.indexOf(sectionSign) != -1)
							{
								if (append)
								{
#ifdef DEBUG
									debugOut("buffer1", String(bufCount));
#endif

									bufCount -= (sectionSign.length() + 6);
#ifdef DEBUG
									debugOut("buffer1", String(bufCount));
#endif
									if (bufCount > 0)
									{
										fs_uploadFile.write(buf, bufCount);
									}
								}
								break;
							}
							else
							{
								fs_uploadFile.write(buf, bufCount);
								bufCount = 0;
							}
						}
					}
				}
				data = "";
			}
			if (data.length() < UPLOAD_DATA_LENGTH)
			{
				data += c;
			}
		}
	}

	fs_uploadFile.close();
	if (buf != nullptr)
	{
		delete[] buf;
	}

	send(200, "text/html", "", client);

	/*
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
	*/
}

void handleGetDriverPin(WiFiClient client)
{
	send(200, "text/plain", getDriverPin(), client);
}

File fs_uploadFile;
void handleUploadFile(WiFiClient client)
{

	if (argsCount > 0)
	{
#ifdef DEBUG
		debugOut("upload param", arg[0]);
#endif
	}

	String data = "";
	String sectionSign = "";
	//String body = "";
	String fileName = "";
	File fs_uploadFile;

#define UPLOAD_DATA_LENGTH 200
#define UPLOAD_BUFFER_SIZE 500
	uint8_t *buf = nullptr;
	int bufCount = 0;

	bool append = false;
	while (client.connected())
	{
		if (client.available())
		{
			yield();
			char c = client.read();

			if (append)
			{
				if (buf == nullptr)
				{
					buf = new uint8_t[UPLOAD_BUFFER_SIZE];
				}

				if (bufCount < UPLOAD_BUFFER_SIZE - 1)
				{
					buf[bufCount] = c;
					bufCount++;
				}
				else
				{
					buf[bufCount] = c;
					fs_uploadFile.write(buf, bufCount + 1);
					bufCount = 0;
				}
			}

			if (c == '\n')
			{
				if (sectionSign.length() == 0) //first entry
				{
					int length = data.length();
					data.remove(length - 1, 1);
					sectionSign = data;
				}
				else
				{
					{
						if (data.indexOf("Content-Type:") != -1)
						{
							while (client.connected())
							{
								yield();
								if ((!client.available()) || (client.read() == '\n'))
								{
									break;
								}
							}

#ifdef DEBUG
							debugOut("file_name", fileName);
#endif
							if (!append)
							{
								//filesDelete(fileName);
								fs_uploadFile = SPIFFS.open(fileName, "w");
								append = true;
							}
						}
						else if (data.indexOf("Content-Disposition:") != -1) //section header
						{
							if (data.indexOf("filename=\"") == -1)
							{
								send(501, "text/html", "wrong file name", client);
#ifdef DEBUG
								debugOut("Upload", "501");
#endif
								return;
							}
							fileName = data.substring(data.indexOf("filename=\"") + String("filename=\"").length());
							fileName = "/" + fileName.substring(0, fileName.indexOf("\""));
						}
						else if (data.length() != 0)
						{

							if (data.indexOf(sectionSign) != -1)
							{
								if (append)
								{
#ifdef DEBUG
									debugOut("buffer1", String(bufCount));
#endif

									bufCount -= (sectionSign.length() + 6);
#ifdef DEBUG
									debugOut("buffer1", String(bufCount));
#endif
									if (bufCount > 0)
									{
										fs_uploadFile.write(buf, bufCount);
									}
								}
								break;
							}
							else
							{
								fs_uploadFile.write(buf, bufCount);
								bufCount = 0;
							}
						}
					}
				}
				data = "";
			}
			if (data.length() < UPLOAD_DATA_LENGTH)
			{
				data += c;
			}
		}
	}

	fs_uploadFile.close();
	if (buf != nullptr)
	{
		delete[] buf;
	}

	send(200, "text/html", "", client);
}

void HTTPSWebServerLoop()
{

#ifdef USE_HTTPS_SERVER
	WiFiClientSecure client = server->available();
#else
	WiFiClient client = server->available();
#endif

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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
						debugOut("---", firstLine);
#endif
#endif
						method = firstLine.substring(0, firstLine.indexOf(" "));

						if (String(HTTP_METHODS).indexOf(" " + method) != -1)
						{

							uri = firstLine.substring(firstLine.indexOf(" ") + 1);
							uri = uri.substring(0, uri.indexOf(" "));
							if ((uri.length() == 0) || (uri.equals("/")))
								uri = "/index.html";
#ifdef DETAILED_DEBUG
#ifdef DEBUG
							debugOut("-->", uri);
#endif
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
#ifdef DETAILED_DEBUG
#ifdef DEBUG
								debugOut("METHOD", method);
#endif
#endif
								yield();
								if (method.equals("OPTIONS"))
								{
									sendResponseHeader(200, "text/plain", "", client);
								}
								else if (method.equals("GET"))
								{
									if (firstLine.indexOf("/getlog") != -1)
									{
										handleGetLog(client);
									}
									else if (firstLine.indexOf("/getfilelist") != -1)
									{
										handleGetFileList(client);
									}
									else if (firstLine.indexOf("/deletefile") != -1)
									{
										handleDeleteFile(client);
									}
									else if (firstLine.indexOf("/getnodeproperty") != -1)
									{
										handleGetUnitProperty(client);
									}
									else if (firstLine.indexOf("/setnodeproperty") != -1)
									{
										handleSetUnitProperty(client);
									}
									else if (firstLine.indexOf("/getallnodeproperties") != -1)
									{
										handleGetAllKernel(client);
									}
									else if (firstLine.indexOf("/adddriver") != -1)
									{
										handleAddDriver(client);
									}
									else if (firstLine.indexOf("/deletedriver") != -1)
									{
										handleDeleteDriver(client);
									}
									else if (firstLine.indexOf("/getdriversid") != -1)
									{
										handleGetDriversId(client);
									}
									else if (firstLine.indexOf("/getdriverproperty") != -1)
									{
										handleGetDriverProperty(client);
									}
									else if (firstLine.indexOf("/setdriverproperty") != -1)
									{
										handleSetDriverProperty(client);
									}
									else if (firstLine.indexOf("/getdriverproperties") != -1)
									{
										handleGetDriverProperties(client);
									}
									else if (firstLine.indexOf("/getalldriversproperties") != -1)
									{
										handleGetAllDriversProperties(client);
									}
									else if (firstLine.indexOf("/getdriversaccessable") != -1)
									{
										handleGetDriversAccessable(client);
									}
									else if (firstLine.indexOf("/getpinmap") != -1)
									{
										handleGetPinMap(client);
									}
									else if (firstLine.indexOf("/getpinmode") != -1)
									{
										handleGetPinMode(client);
									}
									else if (firstLine.indexOf("/getdriverpin") != -1)
									{
										handleGetDriverPin(client);
									}
									else if (firstLine.indexOf("/setdriverpinmode") != -1)
									{
										handleSetDriverPinMode(client);
									}
									else if (firstLine.indexOf("/driverpinwrite") != -1)
									{
										handleDriverPinWrite(client);
									}
									else if (firstLine.indexOf("/driverpinread") != -1)
									{
										handleDriverPinRead(client);
									}
									else if (firstLine.indexOf("/getwebproperty") != -1)
									{
										handleGetWebProperty(client);
									}
									else if (firstLine.indexOf("/reset") != -1)
									{
										handleReset(client);
									}
									else
#ifdef USE_UPDATE
										if (firstLine.indexOf("/updatelog") != -1)
									{
										handleUpdateLog(client);
									}
									else if (firstLine.indexOf("/updateui") != -1)
									{
										handleUpdateUI(client);
									}
									else if (firstLine.indexOf("/updatefirmware") != -1)
									{
										handleUpdateFirmware(client);
									}
									else if (firstLine.indexOf("/getallscripts") != -1)
									{
										handleGetAllScripts(client);
									}
									else if (firstLine.indexOf("/startdebugscript") != -1)
									{
										handleStartDebugScript(client);
									}
									else if (firstLine.indexOf("/debugnextscript") != -1)
									{
										handleDebugNextScript(client);
									}
									else
#endif
										if (firstLine.indexOf("/getdriverproperties") != -1)
									{
										handleGetDriverProperties(client);
									}
									else if (firstLine.indexOf("/getalldriversproperties") != -1)
									{
										handleGetAllDriversProperties(client);
									}
									else
									{
										handleNotFound(client);
									}
								}
								else
									//POST Section
									if (method.equals("POST"))
								{
#ifdef USE_SCRIPT
									if (firstLine.indexOf("/createscript") != -1)
									{
										handleCreateScript(client);
									}
									else
#endif
										if (firstLine.indexOf("/setwebproperty") != -1)
									{
										handleSetWebProperty(client);
									}
									else if (firstLine.indexOf("/uploadfile") != -1)
									{
										handleUploadFile(client);
									}
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
				else if (receiveChar != '\r')
				{
					currentLine += receiveChar;
				}
			}
		}
	}
	client.stop();
}

#endif
#endif
#endif
