/* ----------------------------------------------------------------------
  This unint based on the ESP32 HTTP(S) Webserver
  https://github.com/fhessel/esp32_https_server
  https://platformio.org/lib/show/5887/esp32_https_server/installation
------------------------------------------------------------------------*/

#include "HTTPSWebServer.h"
#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
#ifdef USE_ESP_DRIVER
// Include certificate data (see note above)

#define HTTPS_LOGLEVEL 0

#ifdef USE_HTTPS_SERVER
#include "cert.h"
#include "private_key.h"
#endif

// Includes for the server
// Note: We include HTTPServer and HTTPSServer
#ifdef USE_HTTPS_SERVER
#include <HTTPSServer.hpp>
#include <SSLCert.hpp>
#endif
#ifdef USE_HTTP_SERVER
#include <HTTPServer.hpp>
#endif
#include <HTTPRequest.hpp>
#include <HTTPResponse.hpp>

#include <SPIFFS.h>
#include "HTTPServerThings.h"
#include "../drivers/ESPDriver.h"
#ifdef USE_DRIVERS
#include "../services/DriverService.h"
#endif
#ifdef USE_SCRIPT
#include "../services/ScriptService.h"
#endif
#ifdef USE_UPDATE_SERVICE
#include "../services/UpdateService.h"
#endif
#include "../services/FileService.h"

// The HTTPS Server comes in a separate namespace. For easier use, include it here.
using namespace httpsserver;

#ifdef USE_HTTPS_SERVER
// Create an SSL certificate object from the files included above
SSLCert cert = SSLCert(
    example_crt_DER, example_crt_DER_len,
    example_key_DER, example_key_DER_len);

// First, we create the HTTPSServer with the certificate created above
HTTPSServer secureServer = HTTPSServer(&cert);
#endif

#ifdef USE_HTTP_SERVER
// Additionally, we create an HTTPServer for unencrypted traffic
HTTPServer insecureServer = HTTPServer();
#endif

void handleOther(HTTPRequest *req, HTTPResponse *res)
{
  res->setStatusCode(200);
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

#ifdef USE_DRIVERS
void handleAddDriver(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  ResourceParameters *params = req->getParams();
  std::string typeParam;
  std::string idParam;
  std::string pinsParam;

  if ((params->getQueryParameter("type", typeParam)) && (params->getQueryParameter("id", idParam)) && (params->getQueryParameter("pins", pinsParam)))
  {
    int _type = atoi(typeParam.c_str());
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
#endif

#ifdef USE_SCRIPT
void handleGetAllScripts(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(scriptsGetAll().c_str());
}
#endif

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

#ifdef USE_UPDATE_SERVICE
void handleUpdateLog(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  res->setStatusCode(200);
  res->println(filesReadString("/web.config"));
}

void handleUpdateUI(HTTPRequest *req, HTTPResponse *res)
{
  corsCallback(req, res);
  if (updateGetUpdatePossible() < 1)
  {
    res->setStatusCode(503);
    res->println("0");
  }
  else if (updateGetUpdateUIStatus() < 2)
  {
    res->setStatusCode(504);
    res->println("0");
  }
  else
  {
    res->setStatusCode(200);
    res->println("1");
    updateUI();
  }
}

void handleUpdateFirmware(HTTPRequest *req, HTTPResponse *res)
{

  if (updateGetUpdatePossible() < 2)
  {
    res->setStatusCode(503);
    res->println("0");
  }
  else if (updateGetUpdateFirmwareStatus() < 2)
  {
    res->setStatusCode(504);
    res->println("0");
  }
  else
  {
    res->setStatusCode(200);
    res->println("1");
    updateFirmware();
  }
}
#endif

//ENDOF RESTful APIs ---

void setResourceNode(const std::string &path, const std::string &method, const HTTPSCallbackFunction *callback)
{
  ResourceNode *resourceNode = new ResourceNode(path, method, callback);
#ifdef USE_HTTS_SERVER
  secureServer.registerNode(resourceNode);
#endif
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
#ifdef USE_DRIVERS  
  setResourceNode("/adddriver", "GET", &handleAddDriver);
  setResourceNode("/deletedriver", "GET", &handleDeleteDriver);
  setResourceNode("/deletedriver", "DELETE", &handleDeleteDriver);
  setResourceNode("/getdriversid", "GET", &handleGetDriversId);
  setResourceNode("/getdriverproperty", "GET", &handleGetDriverProperty);
  setResourceNode("/setdriverproperty", "GET", &handleSetDriverProperty);
  setResourceNode("/getdriverproperties", "GET", &handleGetDriverProperties);
  setResourceNode("/getalldriversproperties", "GET", &handleGetAllDriversProperties);
  setResourceNode("/getdriversaccessable", "GET", &handleGetDriversAccessable);
  setResourceNode("/getpinmap", "GET", &handleGetPinMap);
  setResourceNode("/getdriverpin", "GET", &handleGetDriverPin);
#endif  
#ifdef USE_SCRIPTS  
  setResourceNode("/getallscripts", "GET", &handleGetAllScripts);
#endif  
  setResourceNode("/getwebproperty", "GET", &handleGetWebProperty);
  setResourceNode("/setwebproperty", "POST", &handleSetWebProperty);

#ifdef USE_UPDATE_SERVICE
  setResourceNode("/updatelog", "GET", &handleUpdateLog);
  setResourceNode("/updateui", "GET", &handleUpdateUI);
  setResourceNode("/updatefirmware", "GET", &handleUpdateFirmware);
 #endif

#ifdef USE_HTTPS_SERVER
#ifdef DetailedDebug
  debugOut("HTTPS Server", "Starting HTTPS server...");
#endif
  secureServer.start();
#ifdef DetailedDebug
  if (secureServer.isRunning())
  {
    debugOut("HTTPS Server", "HTTPS server ready");
  }
#endif
#endif

#ifdef USE_HTTP_SERVER
#ifdef DetailedDebug
  debugOut("HTTP Server", "Starting HTTP server...");
#endif
  insecureServer.start();
#ifdef DetailedDebug
  if (insecureServer.isRunning())
  {
    debugOut("HTTP Server", "HTTP server ready");
  }
#endif
#endif
}

void HTTPSWebServerLoop()
{
  // We need to call both loop functions here
#ifdef USE_HTTPS_SERVER
  secureServer.loop();
#endif

#ifdef USE_HTTP_SERVER
  insecureServer.loop();
#endif
}
#endif
#endif