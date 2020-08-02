
#ifndef HTTPWEBSERVER_H
#define HTTPWEBSERVER_H

#include "../config.h"
#ifdef USE_ESP_DRIVER

#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)
void HTTPSWebServerBegin();
void HTTPSWebServerLoop();
#endif

#endif
#endif