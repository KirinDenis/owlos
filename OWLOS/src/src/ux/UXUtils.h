#ifndef UXCORE_H
#define UXCORE_H

#pragma once

#include <TFT_eSPI.h> // Hardware-specific library
#include <SPI.h>

#include "UXColors.h"

#define CENTRE 240
#define WIDTH 480
#define HEIGHT 320

#define GOLD_1 (uint16_t)WIDTH
#define GOLD_2 (uint16_t)297
#define GOLD_3 (uint16_t)184
#define GOLD_4 (uint16_t)114
#define GOLD_5 (uint16_t)70
#define GOLD_6 (uint16_t)43
#define GOLD_7 (uint16_t)27
#define GOLD_8 (uint16_t)17
#define GOLD_9 (uint16_t)11
#define GOLD_10 (uint16_t)7
#define GOLD_11 (uint16_t)4
#define GOLD_12 (uint16_t)3
#define GOLD_13 (uint16_t)2
#define GOLD_14 (uint16_t)1

#define TRANSPORT_MODE 0x01
#define SENSORS_MODE 0x02
#define LOG_MODE 0x03
#define HOME_MODE 0x04

#define OWLOSPrimaryColor rgb32_to_rgb16(0x6faeca)
#define OWLOSSecondaryColor rgb32_to_rgb16(0x213944)
#define OWLOSSuccessColor rgb32_to_rgb16(0x43ca15)
#define OWLOSInfoColor rgb32_to_rgb16(0x3c83a4)
#define OWLOSWarningColor rgb32_to_rgb16(0xdd7815)
#define OWLOSDangerColor rgb32_to_rgb16(0xdd2415)
#define OWLOSLightColor rgb32_to_rgb16(0xf4f9f4)
#define OWLOSDarkColor rgb32_to_rgb16(0x141515)

void drawArc(int x, int y, int radiusFrom, int radiusTo, double angleFrom, double angleTo, int color);
void drawWifiIcon(int x, int y, int dBm);

#endif