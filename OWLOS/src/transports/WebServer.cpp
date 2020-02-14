//#define USESSL
#define NOTUSESSL

#include <ESP.h>
#include <FS.h>
#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266mDNS.h>

#ifdef USESSL
#include <ESP8266WebServerSecure.h>
#endif

#ifdef NOTUSESSL
#include <ESP8266WebServer.h>
#endif

#include "WebServer.h"
#include "..\Managers\DeviceManager.h"
#include "..\Managers\ScriptManager.h"
#include "..\Managers\UpdateManager.h"
#include "..\..\UnitProperties.h"
#include "..\..\WebProperties.h"


#ifdef USESSL
BearSSL::ESP8266WebServerSecure webServer(unitGetRESTfulServerPort());
#endif

#ifdef NOTUSESSL
ESP8266WebServer webServer(unitGetRESTfulServerPort());
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
	String clientIP = webServer.client().remoteIP().toString();
	debugOut(WebServerId, "client: " + clientIP + " ask: " + webServer.uri());

	if (unitGetRESTfulAvailable() == 1)
	{
		webServer.sendHeader("Access-Control-Max-Age", "10000");
		webServer.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS, PUT, POST"); //only GET allowed at this version
		webServer.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		webServer.sendHeader("Access-Control-Allow-Origin", "*");
		webServer.sendHeader("Server", "HELLO " + clientIP);
		webServer.sendHeader("Server", "OWL OS " + unitGetUnitId());
	}
	else
	{
		debugOut(WebServerId, "RESTful stop by configuration flag");
		webServer.stop();
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

	if (!webServer.authenticate(stringToChar(unitGetRESTfulServerUsername()), stringToChar(unitGetRESTfulServerPassword())))
	{
		return webServer.requestAuthentication(DIGEST_AUTH, "OWL OS", "no auth");
	}


	//Web UI section -----------
	String fileName = webServer.uri().substring(1);

	if (fileName.length() == 0) fileName = "index.html";

	String contentType = getContentType(fileName);

	if (filesExists(fileName + ".gz")) fileName = fileName + ".gz";

	if (filesExists(fileName))
	{
		File download = SPIFFS.open(fileName, "r");
		if (download)
		{
			webServer.streamFile(download, contentType);
			download.close();
			return;
		}
	}

	//404 section --------------
	String helloString = unitGetUnitId() + "::Ready IoT Solution::OWLOS";
	String message = "<html><header><title>" + helloString + "</title>";
	message += "<style>a{color: #00DC00;text-decoration: none;} a:hover {text-decoration: underline;} a:active {text-decoration: underline;}}</style></header>";
	message += "<body  bgcolor='#4D4D4D'><font color='#A5A5A5'>" + GetLogoHTML() + "<h3>" + helloString + "</h3>";
	message += "<b>URI not found http://" + ip + webServer.uri() + " or http://" + acip + webServer.uri() + "</b><br>";
	message += "Method: ";
	message += (webServer.method() == HTTP_GET) ? "GET" : "POST";
	message += "<br>Arguments: ";
	message += webServer.args();
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
	message += "<br><b>Device's API:</b><br>";
	message += "<a href='http://" + ip + "/adddevice?type=foo&id=bar&pin1=foo&pin2=foo&pin3=foo&pin4=foo' target='_blank'>http://" + ip + "/adddevice?type=foo&id=bar&pin1=foo&pin2=foo&pin3=foo&pin4=foo</a> add new device<br>";
	message += "<a href='http://" + ip + "/getdevicesid' target='_blank'>http://" + ip + "/getdevicesid</a> get all devices IDs<br>";
	message += "<a href='http://" + ip + "/getdeviceproperty?id=foo&property=bar' target='_blank'>http://" + ip + "/getdeviceproperty?id=foo&property=bar</a> get device property<br>";
	message += "<a href='http://" + ip + "/setdeviceproperty?id=foo&property=bar&value=bar' target='_blank'>http://" + ip + "/setdeviceproperty?id=foo&property=bar&value=bar</a> set device property<br>";
	message += "<a href='http://" + ip + "/getdeviceproperties?id=foo' target='_blank'>http://" + ip + "/getdeviceproperties?id=foo</a> get device's all properties<br>";
	message += "<a href='http://" + ip + "/getalldevicesproperties' target='_blank'>http://" + ip + "/getalldevicesproperties</a> get all devices all properties<br>";
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
	message += "<br><b>Device's API:</b><br>";
	message += "<a href='http://" + acip + "/getdevicesid' target='_blank'>http://" + acip + "/getdevicesid</a> get all devices IDs<br>";
	message += "<a href='http://" + acip + "/getdeviceproperty?id=foo&property=bar' target='_blank'>http://" + acip + "/getdeviceproperty?id=foo&property=bar</a> get device property<br>";
	message += "<a href='http://" + acip + "/setdeviceproperty?id=foo&property=bar&value=bar' target='_blank'>http://" + acip + "/setdeviceproperty?id=foo&property=bar&value=bar</a> set device property<br>";
	message += "<a href='http://" + acip + "/getdeviceproperties?id=foo' target='_blank'>http://" + acip + "/getdeviceproperties?id=foo</a> get device's all properties<br>";
	message += "<a href='http://" + acip + "/getalldevicesproperties' target='_blank'>http://" + acip + "/getalldevicesproperties</a> get all devices all properties<br>";


	message += "</font></body></html>";

	for (uint8_t i = 0; i < webServer.args(); i++) {
		message += " " + webServer.argName(i) + ": " + webServer.arg(i) + "\n";
	}

	debugOut(WebServerId, "404: URI not found http://" + ip + webServer.uri() + "or http://" + acip + webServer.uri());
	webServer.send(404, "text/html", message);

}
//----------------------------------------------------------------------------------------------
void handleCORS()
{
	webServerAddCORSHeaders();
	webServer.send(200, "text/plain", "");
}

//----------------------------------------------------------------------------------------------
void handleGetLog()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("number"))
		{
			String log = "wrong log number argument";
			if (webServer.arg(0).equals("1"))
			{
				log = filesReadString(LogFile1);
			}
			else
			{
				log = filesReadString(LogFile2);
			}
			webServer.send(200, "text/plain", log);
			return;
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleGetFileList()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("path"))
		{
			webServer.send(200, "text/plain", filesGetList(webServer.arg(0)));
			return;
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleDeleteFile()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("name"))
		{
			webServer.send(200, "text/plain", String(filesDelete(webServer.arg(0))));
			return;
		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleDownloadFile()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("name"))
		{
			String filename = webServer.arg(0);
			if (filesExists(filename))
			{
				File download = SPIFFS.open(filename, "r");
				if (download)
				{
					webServer.sendHeader("Content-Type", "text/text");
					webServer.sendHeader("Content-Disposition", "attachment; filename=" + filename);
					webServer.sendHeader("Connection", "close");
					webServer.streamFile(download, "application/octet-stream");
					download.close();
					return;
				}
				else
				{
					webServer.send(403, "text/plain", "file '" + filename + "' can't be open");
					return;
				}
			}
			webServer.send(403, "text/plain", "file '" + filename + "' not exist");
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
	webServer.send(200, "text/html", html);
}
//----------------------------------------------------------------------------------------------
File fs_uploadFile;
void handleUploadFile()
{
	webServerAddCORSHeaders();
	HTTPUpload& http_uploadFile = webServer.upload();
	debugOut(WebServerId, "upload: " + http_uploadFile.filename + " status: " + String(http_uploadFile.status));
	if (http_uploadFile.status == UPLOAD_FILE_START)
	{
		debugOut(WebServerId, "upload start: " + http_uploadFile.filename);
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
					debugOut(WebServerId, "upload aborted, reson: end of unit heap");
					webServer.send(504, "text/plain", "upload aborted, reson: end of unit heap");
				}
				else
				{
					fs_uploadFile.write(http_uploadFile.buf, http_uploadFile.currentSize);
					debugOut(WebServerId, "upload write: " + String(http_uploadFile.currentSize));
				}

			}
			else
			{
				debugOut(WebServerId, "upload write error");
			}
		}
		else
			if (http_uploadFile.status == UPLOAD_FILE_END)
			{
				if (fs_uploadFile)
				{
					fs_uploadFile.close();
					String html = http_uploadFile.filename;
					debugOut(WebServerId, "uploaded success: " + html);
					webServer.send(200, "text/plain", html);
				}
				else
				{
					debugOut(WebServerId, "upload can't create file");
					webServer.send(503, "text/plain", http_uploadFile.filename);
				}
			}
			else
				if (http_uploadFile.status == UPLOAD_FILE_ABORTED)
				{
					debugOut(WebServerId, "upload aborted");
					webServer.send(504, "text/plain", http_uploadFile.filename);
				}
				else
				{
					debugOut(WebServerId, "upload bad file name, size or content for ESP FlashFileSystem");
					webServer.send(505, "text/plain", "upload bad file name, size or content for ESP FlashFileSystem");
				}
}

//----------------------------------------------------------------------------------------------
void handleGetUnitProperty()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("property"))
		{
			String unitProp = unitOnMessage(unitGetTopic() + "/get" + decode(webServer.arg(0)), "", NoTransportMask);
			if ((unitProp.length() == 0) || (unitProp.equals(WrongPropertyName)))
			{
				unitProp = "wrong unit property: " + webServer.arg(0);
				webServer.send(404, "text/html", unitProp);
				return;
			}
			else
			{
				webServer.send(200, "text/plain", unitProp);
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
	if (webServer.args() > 1)
	{
		if ((webServer.argName(0).equals("property")) && (webServer.argName(1).equals("value")))
		{
			String result = unitOnMessage(unitGetTopic() + "/set" + decode(webServer.arg(0)), decode(webServer.arg(1)), NoTransportMask);
			if ((result.length() == 0) || (result.equals("0")))
			{
				result = "wrong unit property set: " + webServer.arg(0) + "=" + webServer.arg(1);
				webServer.send(404, "text/html", result);
				return;
			}
			else
			{
				webServer.send(200, "text/plain", result);
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
	webServer.send(200, "text/plain", unitGetAllProperties());
	return;
}

//----------------------------------------------------------------------------------------------
void handleAddDevice()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 5)
	{
		if ((webServer.argName(0).equals("type")) && (webServer.argName(1).equals("id")) && (webServer.argName(2).equals("pin1"))
			&& (webServer.argName(3).equals("pin2")) && (webServer.argName(4).equals("pin3")) && (webServer.argName(5).equals("pin4")))
		{
			int _type = std::atoi(webServer.arg(0).c_str());
			String _id = webServer.arg(1);
			int _pin1 = devicesPinNameToValue(webServer.arg(2));
			int _pin2 = devicesPinNameToValue(webServer.arg(3));
			int _pin3 = devicesPinNameToValue(webServer.arg(4));
			int _pin4 = devicesPinNameToValue(webServer.arg(5));

			String result = devicesAdd(_type, _id, _pin1, _pin2, _pin3, _pin4);
			if (!result.equals("1"))
			{
				webServer.send(503, "text/html", result);
			}
			else
			{
				if (!devicesSaveToConfig(_type, _id, _pin1, _pin2, _pin3, _pin4))
				{
					webServer.send(503, "text/html", "bad, device added but not stored to configuration file");
				}
				else
				{
					webServer.send(200, "text/html", "1");
				}
			}
			return;
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleGetDevicesId()
{
	webServerAddCORSHeaders();
	webServer.send(200, "text/plain", devicesGetDevicesId());
}

//----------------------------------------------------------------------------------------------
void handleGetDeviceProperties()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("id"))
		{
			String deviceProp = devicesGetDeviceProperties(webServer.arg(0));
			if (deviceProp.length() == 0)
			{
				deviceProp = "wrong device id: " + webServer.arg(0) + " use GetDevicesId API to get all devices list";
				webServer.send(404, "text/html", deviceProp);
			}
			else
			{
				webServer.send(200, "text/plain", deviceProp);
			}
			return;
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleGetDeviceProperty()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 1)
	{
		if ((webServer.argName(0).equals("id")) && (webServer.argName(1).equals("property")))
		{
			String deviceProp = devicesGetDeviceProperty(webServer.arg(0), decode(webServer.arg(1)));
			if (deviceProp.length() == 0) //then try get this property from unit 
			{
				deviceProp = unitOnMessage(unitGetTopic() + "/get" + decode(webServer.arg(1)), "", NoTransportMask);
			}

			if (deviceProp.length() == 0)
			{
				deviceProp = "wrong device id: " + webServer.arg(0) + " use GetDevicesId API to get all devices list";
				webServer.send(404, "text/html", deviceProp);
			}
			else if (deviceProp.equals(NotAvailable))
			{
				deviceProp = "device property: " + webServer.arg(1) + " set as NOT Available";
				webServer.send(404, "text/html", deviceProp);
			}
			else if (deviceProp.equals(WrongPropertyName))
			{
				deviceProp = "device property: " + webServer.arg(1) + " not exists";
				webServer.send(404, "text/html", deviceProp);
			}
			else
			{
				webServer.send(200, "text/plain", deviceProp);
			}
			return;
		}
	}
	handleNotFound();
}
//----------------------------------------------------------------------------------------------
void handleSetDeviceProperty()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 2)
	{
		if ((webServer.argName(0).equals("id")) && (webServer.argName(1).equals("property")) && (webServer.argName(2).equals("value")))
		{
			String result = devicesSetDeviceProperty(webServer.arg(0), decode(webServer.arg(1)), decode(webServer.arg(2)));
			if (result.length() == 0) //try set unit property
			{
				result = unitOnMessage(unitGetTopic() + "/set" + decode(webServer.arg(1)), decode(webServer.arg(2)), NoTransportMask);
			}

			if (result.length() == 0)
			{
				result = "wrong device id: " + webServer.arg(0) + " use GetDevicesId API to get all devices list";
				webServer.send(404, "text/html", result);
			}
			else if (result.equals(NotAvailable))
			{
				result = "device property: " + webServer.arg(1) + " set as NOT Available";
				webServer.send(404, "text/html", result);
			}
			else if (result.equals(WrongPropertyName))
			{
				result = "device property: " + webServer.arg(1) + " not exists";
				webServer.send(404, "text/html", result);
			}
			else if (result.equals("0"))
			{
				result = "device property: " + webServer.arg(1) + " can't be modify";
				webServer.send(404, "text/html", result);
			}
			else
			{
				webServer.send(200, "text/plain", result);
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
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("property"))
		{
			//String configProperties = webOnMessage(unitGetTopic() + "/get" + decode(webServer.arg(0)), "");

			File download = SPIFFS.open("web.config", "r");
			if (download)
			{
				webServer.streamFile(download, "text/html");
				download.close();
				return;
			}
			/*
			if ((configProperties.length() == 0) || (configProperties.equals(WrongPropertyName)))
			{
				configProperties = "wrong web property: " + webServer.arg(0);
				webServer.send(404, "text/html", configProperties);
				return;
			}
			else
			{
				webServer.send(200, "text/plain", configProperties);
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
	if (webServer.args() > 1)
	{
		if (webServer.argName(1).equals("property"))
		{

			String result = webOnMessage(unitGetTopic() + "/set" + decode(webServer.arg(1)), decode(webServer.arg(0)));

			debugOut("web", result);
			if ((result.length() == 0) || (result.equals("0")))
			{
				result = "wrong unit property set: " + webServer.arg(0) + "=" + webServer.arg(1);
				webServer.send(404, "text/html", result);
				return;
			}
			else
			{
				webServer.send(200, "text/plain", result);
				return;
			}

		}
	}
	handleNotFound();
}

//----------------------------------------------------------------------------------------------
void handleGetAllDevicesProperties() {
	webServerAddCORSHeaders();
	webServer.send(200, "text/plain", devicesGetAllDevicesProperties());
}

//----------------------------------------------------------------------------------------------
void handleReset() {
	webServerAddCORSHeaders();
	webServer.send(200, "text/plain", "1");
	unitSetESPReset(1);
}

//work with pins
//----------------------------------------------------------------------------------------------
void handlesetpinmode()
{
	webServerAddCORSHeaders();
	if (webServer.args() < 2)
	{
		handleNotFound();
		return;
	}
	if (!(webServer.argName(0).equals("pin")) || !(webServer.argName(1).equals("mode")))
	{
		handleNotFound();
		return;
	}
	int pin = -1;
	if (webServer.arg(0).equals("BUILTIN_LED")) pin = BUILTIN_LED;
	else pin = devicesPinNameToValue(webServer.arg(0));
	if (pin == -1)
	{
		webServer.send(404, "text/html", "wrong pin: " + webServer.arg(0));
		return;
	}
	if (checkPinBusy(pin))
	{
		webServer.send(404, "text/html", "busy pin: " + webServer.arg(0));
		return;
	}
	String _mode = webServer.arg(1);
	_mode.toUpperCase();
	int mode = 0;
	if (_mode.equals("INPUT")) mode = INPUT;
	else if (_mode.equals("OUTPUT")) mode = OUTPUT;
	else if (_mode.equals("INPUT_PULLUP")) mode = INPUT_PULLUP;
	else
	{
		webServer.send(404, "text/html", "wrong pin mode: " + webServer.arg(1));
		return;
	}
	pinMode(pin, mode);
	webServer.send(200, "text/html", "1");
	return;
}
//----------------------------------------------------------------------------------------------
void handlereadpin()
{
	webServerAddCORSHeaders();
	if (webServer.args() < 1)
	{
		handleNotFound();
		return;
	}
	if (!webServer.argName(0).equals("pin"))
	{
		handleNotFound();
		return;
	}
	int pin = devicesPinNameToValue(webServer.arg(0));
	if (pin == -1)
	{
		webServer.send(404, "text/html", "wrong pin: " + webServer.arg(0));
		return;
	}
	if (checkPinBusy(pin))
	{
		webServer.send(404, "text/html", "busy pin: " + webServer.arg(0));
		return;
	}
	int result = -1;
	if (pin = A0) result = analogRead(pin);
	else result = digitalRead(pin);
	webServer.send(200, "text/html", String(result));
	return;
}
//----------------------------------------------------------------------------------------------
void handlewritepin()
{
	webServerAddCORSHeaders();
	if (webServer.args() < 2)
	{
		handleNotFound();
		return;
	}
	if (!(webServer.argName(0).equals("pin")) || !(webServer.argName(1).equals("value")))
	{
		handleNotFound();
		return;
	}
	int pin = -1;
	if (webServer.arg(0).equals("BUILTIN_LED")) pin = BUILTIN_LED;
	else pin = devicesPinNameToValue(webServer.arg(0));
	if (pin == -1)
	{
		webServer.send(404, "text/html", "wrong pin: " + webServer.arg(0));
		return;
	}
	if (checkPinBusy(pin))
	{
		webServer.send(404, "text/html", "busy pin: " + webServer.arg(0));
		return;
	}
	String _value = webServer.arg(1);
	_value.toUpperCase();
	int value = 0;
	if (_value.equals("LOW")) value = LOW;
	else if (_value.equals("HIGH")) value = HIGH;
	else value = std::atoi(webServer.arg(1).c_str());
	if (pin == A0) analogWrite(pin, value);
	else digitalWrite(pin, value);
	webServer.send(200, "text/html", "1");
	return;
}
//Update UI ------------------------------------------------------------------------------------
void handleUpdateLog()
{
	webServerAddCORSHeaders();
	webServer.send(200, "text/plain", updateGetUpdateLog());
}

void handleUpdateUI()
{
	webServerAddCORSHeaders();
	if (updateGetUpdatePossible() < 1)
	{
		webServer.send(503, "text/plain", "0");
	}
	else
		if (updateGetUpdateUIStatus() < 2)
		{
			webServer.send(504, "text/plain", "0");
		}
		else
		{
			webServer.send(200, "text/plain", "1");
			updateUI();
		}
}

void handleUpdateFirmware()
{
	webServerAddCORSHeaders();
	if (updateGetUpdatePossible() < 2)
	{
		webServer.send(503, "text/plain", "0");
	}
	else
		if (updateGetUpdateFirmwareStatus() < 2)
		{
			webServer.send(504, "text/plain", "0");
		}
		else
		{
			webServer.send(200, "text/plain", "1");
			updateFirmware();
		}
}
//----------------------------------------------------------------------------------------------
//Create script 
void handleCreateScript()
{
	debugOut("script create request", "1");
	webServerAddCORSHeaders();
	if (webServer.args() > 1)
		debugOut("script create request", "2"); {
		if (webServer.argName(1).equals("name"))
		{
			debugOut("script create request", "3");
			debugOut("script create request", decode(webServer.arg(0)));
			String result = String(scriptsCreate(decode(webServer.arg(1)), decode(webServer.arg(0))));

			debugOut("script create result", result);
			if ((result.length() == 0) || (result.equals("0")))
			{
				result = "wrong script: " + webServer.arg(0) + "=" + webServer.arg(1);
				webServer.send(404, "text/html", result);
				return;
			}
			else
			{
				webServer.send(200, "text/plain", result);
				return;
			}

		}
	}
	handleNotFound();
}

void handleGetAllScripts() {
	webServerAddCORSHeaders();
	webServer.send(200, "text/plain", scriptsGetAll());
}

void handleDeleteScript()
{
	webServerAddCORSHeaders();
	if (webServer.args() > 0)
	{
		if (webServer.argName(0).equals("name"))
		{
			webServer.send(200, "text/plain", String(scriptsDelete(webServer.arg(0))));
			return;
		}
	}
	handleNotFound();
}


//----------------------------------------------------------------------------------------------
bool webServerBegin()
{
	if (started) return true;
	debugOut(WebServerId, "RESTful start by configuration flag");
	/* Time disable for Access Point no Internet mode
	configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov");

	debugOut(WebServerId,"Waiting for NTP time sync: ");
	time_t now = time(nullptr);
	while (now < 8 * 3600 * 2) {
	  delay(500);
	  debugOut(WebServerId,".");
	  now = time(nullptr);
	}

	struct tm timeinfo;
	gmtime_r(&now, &timeinfo);
	*/

#ifdef USESSL
	if (MDNS.begin("OWLOS.local"))
	{
		debugOut(WebServerId, "MDNS responder started OWLOS.local");
	}
	webServer.setBufferSizes(1024, 1024);
	webServer.setRSACert(new BearSSL::X509List(serverCert), new BearSSL::PrivateKey(serverKey));
#endif

	webServer.on("/", HTTP_OPTIONS, handleCORS);
	webServer.onNotFound(handleNotFound);
	webServer.on("/getlog", handleGetLog);
	webServer.on("/getfilelist", handleGetFileList);
	webServer.on("/deletefile", handleDeleteFile);
	webServer.on("/downloadfile", handleDownloadFile);
	webServer.on("/upload", handleUpload);
	webServer.on("/uploadfile", HTTP_POST, []() { webServer.send(200);}, handleUploadFile);
	webServer.on("/getunitproperty", handleGetUnitProperty);
	webServer.on("/setunitproperty", handleSetUnitProperty);
	webServer.on("/getallunitproperties", handleGetAllUnitProperties);
	webServer.on("/adddevice", handleAddDevice);
	webServer.on("/getdevicesid", handleGetDevicesId);
	webServer.on("/getdeviceproperty", handleGetDeviceProperty);
	webServer.on("/setdeviceproperty", handleSetDeviceProperty);
	webServer.on("/getdeviceproperties", handleGetDeviceProperties);
	webServer.on("/getalldevicesproperties", handleGetAllDevicesProperties);
	webServer.on("/getwebproperty", handleGetWebProperty);
	webServer.on("/setwebproperty", HTTP_POST, handleSetWebProperty);
	webServer.on("/reset", handleReset);
	//work with pins
	webServer.on("/setpinmode", handlesetpinmode);
	webServer.on("/readpin", handlereadpin);
	webServer.on("/writepin", handlewritepin);
	//update
	webServer.on("/updatelog", handleUpdateLog);
	webServer.on("/updateui", handleUpdateUI);
	webServer.on("/updatefirmware", handleUpdateFirmware);
	webServer.on("/createscript", HTTP_POST, handleCreateScript);
	webServer.on("/getallscripts", handleGetAllScripts);
	webServer.on("/deletescript", handleDeleteScript);
	
	webServer.begin();

	debugOut(WebServerId, "started at access point as: " + unitGetWiFiAccessPointIP() + ":" + String(unitGetRESTfulServerPort()) + " at local network as: " + unitGetWiFiIP() + ":" + String(unitGetRESTfulServerPort()));
	started = true;
	return true;
}

bool webServerLoop()
{
	webServer.handleClient();
#ifdef USESSL
	MDNS.update();
#endif
	return true;
}
