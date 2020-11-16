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
#include "../config.h"
#ifdef USE_DRIVERS
#ifndef BASE_H
#define BASE_H

#pragma once //<- the BaseDriver node must INCLUDE ONCE TO THE PROJECT, else we have REDEFINITION error
//#include "../config.h"
#include "../services/PinService.h"
#include "../services/TransportService.h"
#include "../services/FileService.h"

/*

  Base Driver Class
  -----------------
  This class is a common ancestor for all classes that implement various drivers.
  This class describes the general (basic) behavior for all driver's classes,
  as well as implements basic properties and methods.
  Please NOTE: The class itself is never used as a driver class.
                                                                            (...One morning thick snow fell in Babylon...) */



#define PIN0_INDEX 0
#define PIN1_INDEX 1
#define PIN2_INDEX 2
#define PIN3_INDEX 3


class BaseDriver
{
public:
    static int getPinsCount()
    {
        return 0;
    }

    static uint16_t getPinType(int pinIndex)
    {
        return NO_MASK;
    }

    //Driver id property, used with topic and identify driver inside system
    String id = "";

    //Driver topic property, unique to the entire system, used to address messages TO and FROM the driver
    //Driver topic is compiled value from UnitTopic and Driver ID (current version also use ESPChipID, but it temporary solution, please see Main::Setup() to actuate this information)
    String topic = "";

    //Method init() calls before transport accessable, from Main::Setup()->DriversInit()
    //The driver must check here physical state and preload property values stored by Flash file system (if exists)
    virtual bool init(String _id);

    void del();

    //Method begin(..) calls after(IF) transport is available and Unit "know" self and drivers ID's and Topic's (see: Main::Loop()->DriversBegin())
    virtual bool begin(const String _topic);

    //The query() method calls from Main::Loop()->DriversLoop()->... and give the driver time quantum to check here physical part (get physical light power from LRS like sample)
    //the method work both with publish() method, but must call here "core section" more often as publish()
    virtual bool query();

    //Get all Driver properties at .INI format
    //propName1=prop1Value
    //propName2=prop2Value
    //...
    //propNameNNN=propNNNValue
    virtual String getAllProperties();

    //The publish() method as query() metohod calls from Main::Loop()->DriversLoop()->..., but less often then publish(), not ask physical driver values, but publish() the value via transport()
    //to all subscribed to driver topic clients
    virtual bool publish();

    //Called from Main::Loop()->DriversSubsribe(), after Transport going to AVAILABLE (ONCE) and subsribe driver to here topics (actuly the driver properties values)
    void subscribe();

    //This method works both with subscribe() method and receive all messages pushed to this driver subscribed topics
    virtual String onMessage(const String route, const String _payload, int8_t transportMask);

    //Available property GET<->SET wrappers
    int getAvailable();
    bool setAvailable(int _available);

    //Type property GET<->SET wrappers
    int getType();
    bool setType(int _type);

    //Trap settings
    float getTrap();
    bool setTrap(float _trap);

    //QueryInterval property GET<->SET wrappers
    int getQueryInterval();
    bool setQueryInterval(int _queryInterval);

    //PublishInterval property GET<->SET wrappers
    int getPublishInterval();
    bool setPublishInterval(int _publishInterval);

    //HistoryData property GET<->SET wrappers
    String getHistoryData();
    bool setHistoryData(float _historydata);

    //History file property Read<->Write wrappers
    String readHistoryFile();
    bool writeHistoryFile(float _historydata);

protected:
    int parsePinNumber(String _topic, String getPinStr);
    //TRUE(1)
    //FALSE(0)
    //FALSE by default
    int available = 0;

    //Current driver type code, see Utils.h for driver's types codes
    int type;

    float trap = 0;

    //String historyFileName = "";

    //Default size of history data array. By default array size allows store data during 5 minuts every 10 seconds
    int historySize = 30;

    //Current driver array for storing history the data. By default array size allows store history data during 5 minuts every 10 seconds
    float *historyData = new float[historySize]();

    //Count the amount of times a history file is written.

    //Set time for writing history file
    int historyFileWriteTime = 60;
    int filesIndexesSize = 25; //24 with history + 1 for current writting;

    int currentFile = 0;
    int currentFileIndex = 0;
    int historyFileCount = 0;
    int *historyFilesIndexes = new int[filesIndexesSize]();

    //accomulate last query() method call time (see: queryInterval property and query() method)
    unsigned long lastQueryMillis = 0;

    //accomulate last publish() method call time (see: publishInterval property and publish() method)
    unsigned long lastPublishMillis = 0;

    //accomulate last publish() method call time (see: publishInterval property and publish() method)
    unsigned long lastHistoryMillis = 0;

    //Amount of history elements
    int historyCount = 0;

    //accomulate last writeHistoryFile method call time
    unsigned long lastHistoryFileWriteMillis = 0;

    //Set count how often the query() method "core section" must be called  (NOTE: for stabale works queryInterval property MUST BE BIGGER THAN publishInterval property)
    unsigned long queryInterval = ONESECOND;

    //Set count how often the publish() method "core section" must be called
    unsigned long publishInterval = ONESECOND * 600;

    //Set count how often the put the driver data in the LogData array, by default logInterval is equal to one minute
    unsigned long historyInterval = ONESECOND * 10;

    //Set count how often the put the driver data in the LogData array, by default logInterval is equal to one minute
    unsigned long historyFileWriteInterval = ONESECOND * 60; // ONESECOND * 60;

    //Calls when client get property from network
    String onGetProperty(String _property, String _payload, int8_t transportMask);

    //This method calls from properties SET wrappers methods (setNNN()) and publish to transport message (event) on any wrapped property values is changed
    //The sended message topic is Driver compiled topic (Unit/DriverId)/PropertyName
    //Sample: if available propery is changed at "stepper1" driver on node "node2544" the SET wrapper calls onInsideChange(), and the topic to be somthing like "world0/area1/front1/room1/node2544/stepper1/available"
    bool onInsideChange(String _property, String _payload);
};
#endif
#endif