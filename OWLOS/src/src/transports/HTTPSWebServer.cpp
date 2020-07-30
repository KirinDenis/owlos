/*
  This unint based on the ESP32 HTTP(S) Webserver
  https://github.com/fhessel/esp32_https_server
  https://platformio.org/lib/show/5887/esp32_https_server/installation
  */

// Include certificate data (see note above)
#include "cert.h"
#include "private_key.h"

// We will use wifi
//#include <WiFi.h>

// Includes for the server
// Note: We include HTTPServer and HTTPSServer
#include <HTTPSServer.hpp>
#include <HTTPServer.hpp>
#include <SSLCert.hpp>
#include <HTTPRequest.hpp>
#include <HTTPResponse.hpp>

//#include <stdio.h>
//#include <stdint.h>
//#include <stddef.h>
//#include <string.h>
//#include "esp_wifi.h"
//#include "esp_system.h"
//#include "nvs_flash.h"
//#include "esp_event.h"
//#include "tcpip_adapter.h"
//#include "esp_transport_ssl.h"
//#include "esp_transport.h"
//#include "protocol_examples_common.h"

//#include "freertos/FreeRTOS.h"
//#include "freertos/task.h"
//#include "freertos/semphr.h"
//#include "freertos/queue.h"

//#include "lwip/sockets.h"
//#include "lwip/dns.h"
//#include "lwip/netdb.h"
#include <SPIFFS.h>
#include "HTTPServerThings.h"
#include "../drivers/ESPDriver.h"
#include "../Managers/DriverManager.h"
#include "../Managers/ScriptManager.h"
//#include "../Managers/UpdateManager.h"
#include "../Managers/FileManager.h"
//#include "../Utils/Utils.h"

// The HTTPS Server comes in a separate namespace. For easier use, include it here.
using namespace httpsserver;

// Create an SSL certificate object from the files included above
SSLCert cert = SSLCert(
    example_crt_DER, example_crt_DER_len,
    example_key_DER, example_key_DER_len);

// First, we create the HTTPSServer with the certificate created above
HTTPSServer secureServer = HTTPSServer(&cert);

// Additionally, we create an HTTPServer for unencrypted traffic
HTTPServer insecureServer = HTTPServer();

void handleOther(HTTPRequest *req, HTTPResponse *res)
{
  //req->discardRequestBody();
  res->setStatusCode(200);
  //res->setStatusText("Not Found");
  res->setHeader("Content-Type", "text/html");
  res->println(GetNotFoundHTML());
}

void corsCallback(HTTPRequest *req, HTTPResponse *res)
{
  res->setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res->setHeader("Access-Control-Allow-Origin", "*");
  res->setHeader("Access-Control-Allow-Headers", "*");
  res->setHeader("Server", FIRMWARE_VERSION);
}

void handleNotFound(HTTPRequest *req, HTTPResponse *res)
{
  req->discardRequestBody();
  res->setStatusCode(404);
  res->setStatusText("Not Found");
  res->setHeader("Content-Type", "text/html");
}

//RESTful APIs ---
void handleNodeGetAllProperties(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(nodeGetAllProperties());
  return;
}

void handleGetLog(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string paramVal;
  if (params->getQueryParameter("number", paramVal))
  {
    {
      res->setStatusCode(200);
      if (paramVal == "1")
      {
        res->println(filesReadString(LogFile1));
      }
      else
      {
        res->println(filesReadString(LogFile2));
      }
      return;
    }
  }
  handleNotFound(req, res);
}

void handleGetFileList(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string paramVal;
  if (params->getQueryParameter("path", paramVal))
  {
    {
      res->setStatusCode(200);
      res->println(filesGetList(String(paramVal.c_str())));
      return;
    }
  }
  handleNotFound(req, res);
}

void handleDeleteFile(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string paramVal;
  if (params->getQueryParameter("name", paramVal))
  {
    res->setStatusCode(200);
    res->println(filesDelete(String(paramVal.c_str())));
    return;
  }
  handleNotFound(req, res);
}

void handleGetNodeProperty(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string paramVal;
  if (params->getQueryParameter("property", paramVal))
  {
    String nodeProp = nodeOnMessage(nodeGetTopic() + "/get" + decode(String(paramVal.c_str())), "", NoTransportMask);
    if ((nodeProp.length() == 0) || (nodeProp.equals(WrongPropertyName)))
    {
      req->discardRequestBody();
      res->setStatusCode(405);
      res->setStatusText("wrong node property: " + paramVal);
      res->setHeader("Content-Type", "text/html");
    }
    else
    {
      res->setStatusCode(200);
      res->println(nodeProp);
    }
    return;
  }
  handleNotFound(req, res);
}

void handleSetNodeProperty(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string propertyParam;
  std::string valParam;
  if ((params->getQueryParameter("property", propertyParam)) && (params->getQueryParameter("value", valParam)))
  {
    String result = nodeOnMessage(nodeGetTopic() + "/set" + decode(String(propertyParam.c_str())), decode(String(valParam.c_str())), NoTransportMask);
    if ((result.length() == 0) || (result.equals("0")))
    {
      req->discardRequestBody();
      res->setStatusCode(503);
      res->setStatusText("wrong node property: " + valParam);
      res->setHeader("Content-Type", "text/html");
    }
    else
    {
      res->setStatusCode(200);
      res->println(result);
    }
    return;
  }
  handleNotFound(req, res);
}

void handleAddDriver(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string typeParam;
  std::string idParam;
  std::string pinsParam;

  if ((params->getQueryParameter("type", typeParam)) && (params->getQueryParameter("id", idParam)) && (params->getQueryParameter("pins", pinsParam)))
  {
    int _type = std::atoi(typeParam.c_str());
    String _id = decode(String(idParam.c_str()));
    String _pins = decode(String(pinsParam.c_str()));
    String result = driversAdd(_type, _id, _pins);
    if (!result.equals("1"))
    {
      req->discardRequestBody();
      res->setStatusCode(503);
      res->setStatusText(result.c_str());
      res->setHeader("Content-Type", "text/html");
    }
    else
    {
      if (!driversSaveList())
      {
        req->discardRequestBody();
        res->setStatusCode(503);
        res->setStatusText("bad, driver added but not stored to configuration file");
        res->setHeader("Content-Type", "text/html");
      }
      else
      {
        res->setStatusCode(200);
        res->println(result);
      }
    }
    return;
  }

  handleNotFound(req, res);
}

void handleDeleteDriver(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string idParam;

  if (params->getQueryParameter("id", idParam))
  {
    String result = driversDelete(String(idParam.c_str()));
    if (result.length() != 0)
    {
      req->discardRequestBody();
      res->setStatusCode(503);
      res->setStatusText(result.c_str());
      res->setHeader("Content-Type", "text/html");
    }
    else
    {
      res->setStatusCode(200);
      res->println("1");
    }
    return;
  }
  handleNotFound(req, res);
}

void handleGetDriversId(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(driversGetDriversId().c_str());
  return;
}

void handleGetDriverProperty(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string idParam;
  std::string propertyParam;

  if ((params->getQueryParameter("id", idParam)) && (params->getQueryParameter("property", propertyParam)))
  {
    String result = driversGetDriverProperty(decode(String(idParam.c_str())), decode(String(propertyParam.c_str())));
    if (result.length() == 0) //then try get this property from node
    {
      result = nodeOnMessage(nodeGetTopic() + "/get" + decode(String(propertyParam.c_str())), "", NoTransportMask);
    }

    if (result.length() == 0)
    {
      req->discardRequestBody();
      res->setStatusCode(404);
      res->setStatusText("wrong driver id: " + idParam + " use GetDriversId API to get all drivers list");
      res->setHeader("Content-Type", "text/html");
    }
    else if (result.equals(NotAvailable))
    {
      req->discardRequestBody();
      res->setStatusCode(404);
      res->setStatusText("driver property: " + propertyParam + " set as NOT Available");
      res->setHeader("Content-Type", "text/html");
    }
    else if (result.equals(WrongPropertyName))
    {
      req->discardRequestBody();
      res->setStatusCode(404);
      res->setStatusText("driver property: " + propertyParam + " not exists");
      res->setHeader("Content-Type", "text/html");
    }
    else
    {
      res->setStatusCode(200);
      res->println(result.c_str());
    }
    return;
  }
  handleNotFound(req, res);
}

void handleSetDriverProperty(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string idParam;
  std::string propertyParam;
  std::string valueParam;

  if ((params->getQueryParameter("id", idParam)) && (params->getQueryParameter("property", propertyParam)) && (params->getQueryParameter("value", valueParam)))
  {
    String result = driversSetDriverProperty(decode(String(idParam.c_str())), decode(String(propertyParam.c_str())), decode(String(valueParam.c_str())));
    if (result.equals("1"))
    {
      res->setStatusCode(200);
      res->println(result);
    }
    else
    {
      if (!result.equals(WrongPropertyName))
      {
        req->discardRequestBody();
        res->setStatusCode(503);
        res->setStatusText(result.c_str());
        res->setHeader("Content-Type", "text/html");
      }
      else
      {
        handleSetNodeProperty(req, res);
      }
    }
    return;
  }
  handleNotFound(req, res);
}

void handleGetDriverProperties(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string idParam;

  if (params->getQueryParameter("id", idParam))
  {
    String result = driversGetDriverProperties(String(idParam.c_str()));
    if (result.length() != 0)
    {
      req->discardRequestBody();
      res->setStatusCode(503);
      res->setStatusText(result.c_str());
      res->setHeader("Content-Type", "text/html");
    }
    else
    {
      res->setStatusCode(200);
      res->println(result.c_str());
    }
    return;
  }
  handleNotFound(req, res);
}

void handleGetAllDriversProperties(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(driversGetAllDriversProperties().c_str());
}

void handleGetDriversAccessable(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(driversGetAccessable().c_str());
}

void handleGetAllScripts(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(scriptsGetAll().c_str());
}

void handleGetPinMap(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(getPinMap().c_str());
}

void handleGetDriverPin(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(getDriverPin());
}

void handleGetWebProperty(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(filesReadString("/web.config"));
}

void handleSetWebProperty(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  // Stream the incoming request body to the response body
  // Theoretically, this should work for every request size.
  byte buffer[256];

  File fs_uploadFile;
  fs_uploadFile = SPIFFS.open("/web.config", "w");
  // HTTPReqeust::requestComplete can be used to check whether the
  // body has been parsed completely.

  while (!(req->requestComplete()))
  {
    yield();
    // HTTPRequest::readBytes provides access to the request body.
    // It requires a buffer, the max buffer length and it will return
    // the amount of bytes that have been written to the buffer.
    size_t s = req->readBytes(buffer, 256);

    // The response does not only implement the Print interface to
    // write character data to the response but also the write function
    // to write binary data to the response.
    res->write(buffer, s);
    fs_uploadFile.write(buffer, s);
  }
	fs_uploadFile.close();
  
}

//ENDOF RESTful APIs ---

void setResourceNode(const std::string &path, const std::string &method, const HTTPSCallbackFunction *callback)
{
  ResourceNode *resourceNode = new ResourceNode(path, method, callback);
  secureServer.registerNode(resourceNode);
  insecureServer.registerNode(resourceNode);
}

void HTTPSWebServerBegin()
{
  setResourceNode("/*", "OPTIONS", &corsCallback);
  setResourceNode("/", "GET", &handleOther);

  setResourceNode("/getallnodeproperties", "GET", &handleNodeGetAllProperties);
  setResourceNode("/getlog", "GET", &handleGetLog);
  setResourceNode("/getfilelist", "GET", &handleGetFileList);
  setResourceNode("/deletefile", "GET", &handleDeleteFile);
  setResourceNode("/deletefile", "DELETE", &handleDeleteFile);
  setResourceNode("/getnodeproperty", "GET", &handleGetNodeProperty);
  setResourceNode("/setnodeproperty", "GET", &handleSetNodeProperty);
  setResourceNode("/adddriver", "GET", &handleAddDriver);
  setResourceNode("/deletedriver", "GET", &handleDeleteDriver);
  setResourceNode("/deletedriver", "DELETE", &handleDeleteDriver);
  setResourceNode("/getdriversid", "GET", &handleGetDriversId);
  setResourceNode("/getdriverproperty", "GET", &handleGetDriverProperty);
  setResourceNode("/setdriverproperty", "GET", &handleSetDriverProperty);
  setResourceNode("/getdriverproperties", "GET", &handleGetDriverProperties);
  setResourceNode("/getalldriversproperties", "GET", &handleGetAllDriversProperties);
  setResourceNode("/getdriversaccessable", "GET", &handleGetDriversAccessable);
  setResourceNode("/getallscripts", "GET", &handleGetAllScripts);
  setResourceNode("/getpinmap", "GET", &handleGetPinMap);
  setResourceNode("/getdriverpin", "GET", &handleGetDriverPin);
  setResourceNode("/getwebproperty", "GET", &handleGetWebProperty);
  setResourceNode("/setwebproperty", "POST", &handleSetWebProperty);

  // Connect to WiFi

  // For every resource available on the server, we need to create a ResourceNode
  // The ResourceNode links URL and HTTP method to a handler function
  //ResourceNode * nodeRoot = new ResourceNode("/", "GET", &handleRoot);
  //ResourceNode * corsNode   = new ResourceNode("/*", "OPTIONS", &corsCallback);
  //ResourceNode * node404  = new ResourceNode("", "GET", &handle404);

  // Add the root node to the servers. We can use the same ResourceNode on multiple
  // servers (you could also run multiple HTTPS servers)
  //secureServer.registerNode(nodeRoot);
  //insecureServer.registerNode(nodeRoot);

  // We do the same for the default Node
  //secureServer.setDefaultNode(node404);
  //insecureServer.setDefaultNode(node404);

  //secureServer.registerNode(corsNode);
  //insecureServer.registerNode(corsNode);

  Serial.println("Starting HTTPS server...");
  secureServer.start();
  Serial.println("Starting HTTP server...");
  insecureServer.start();
  //if (secureServer.isRunning() && insecureServer.isRunning()) {
  //   Serial.println("Servers ready.");
  //  }
}

void HTTPSWebServerLoop()
{
  // We need to call both loop functions here
  secureServer.loop();
  insecureServer.loop();
}
