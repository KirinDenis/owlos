/*-------------------------------------------------------------------------------------------------------------------------
  Define used GPIO (ESP (Wemos) PINS) values for ALL physical DEVICES
  -------------------------------------------------------------------------------------------------------------------------*/

#include <core_version.h>
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
//#define LED_BUILTIN 2
#define BUILTIN_LED 2
#define D0 1
#define D1 2
#define D2 3
#define D3 4
#define D4 5
#define D5 6
#define D6 7
#define D7 8
#define D8 9
#define D9 10
#define D10 11
#endif


#define SMOKEPIN A0
#define LIGHTPIN A0
#define ACTUATORPIN D2
#define DHTPIN D5
#define SENSORPIN D3
#define STEPPERPIN1 D4
#define STEPPERPIN2 D5
#define STEPPERPIN3 D6
#define STEPPERPIN4 D7
#define MOTIONPIN D8
#define OPTOSENSORPIN1 D5
#define OPTOSENSORPIN2 D6
#define VALVECLOSEPIN1 D1
#define VALVEOPENPIN2 D2
#define VALVEPHYSICALPOSITIONPIN3 A0

