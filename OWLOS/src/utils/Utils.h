#include <Arduino.h>

#define Debug true
#define DetailedDebug false
#define WriteDebugLogs false
#define LogFilesSize 1024*10
#define LogFile1 "log1"
#define LogFile2 "log2"
#define PORTSPEED 115200
#define ONETENTHOFSECOND 100
#define ONESECOND 1000
#define ONEMINUTE 60000 

#define PayloadBufferSize 255

#define WebServerDefaultPort 8080

#define TestDeviceType 0 
#define DHTDeviceType  1
#define Light  2
#define Smoke  3
#define Motion  4
#define Sensor  5
#define Stepper  6
#define LCD  7
#define Actuator 8
#define Opto  9
#define Valve 10
#define WiFiType 11
#define NetworkType 12
#define ESPType 13
#define Config 14

//Transport masks
#define NoTransportMask		0b00000000
#define MQTTMask 		0b00000001
#define RESTfulClientMask	0b00000010
#define GSMMask			0b00000100
#define RxTxMask		0b00001000  //debug is transport by this flag

//Not available selector
#define NotAvailable "nan"
#define WrongPropertyName "!NOT"


char* stringToChar(String src);
void debugOut(String tag, String text);
void writeDebugLogFile(String fileName, int fileSize, String tag, String text);