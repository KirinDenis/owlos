
#ifndef HTTPWEBSERVER_H
#define HTTPWEBSERVER_H

#include "../config.h"
#ifdef USE_ESP_DRIVER

void HTTPSWebServerBegin();
void HTTPSWebServerLoop();

#endif
#endif