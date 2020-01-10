/*-------------------------------------------------------------------------------------------------------------------------
  OWLOS
  
  

  ------------------------------------------------------------------------------------------------------------------------*/
#pragma once //<- the BaseDevice unit must INCLUDE ONCE TO THE PROJECT, else we have REDEFINITION error 
#include <Arduino.h>
#include "..\Utils\Utils.h"
#include "..\Utils\GPIOMap.h"
#include "..\Managers\TransportManager.h"
#include "..\Managers\FileManager.h"

/*

  Base Device Class
  -----------------
  This class is a common ancestor for all classes that implement various devices.
  This class describes the general (basic) behavior for all device's classes,
  as well as implements basic properties and methods.
  Please NOTE: The class itself is never used as a device class.
                                                                            (...One morning thick snow fell in Babylon...) */
class BaseDevice
{
  public:
    //Device id property, used with topic and identify device inside system
    String id = "";

    //Device topic property, unique to the entire system, used to address messages TO and FROM the device
    //Device topic is compiled value from UnitTopic and Device ID (current version also use ESPChipID, but it temporary solution, please see Main::Setup() to actuate this information)
    String topic = "";

    //Method init() calls before transport accessable, from Main::Setup()->DevicesInit()
    //The device must check here physical state and preload property values stored by Flash file system (if exists)
    virtual bool init(String _id);

    //Method begin(..) calls after(IF) transport is available and Unit "know" self and devices ID's and Topic's (see: Main::Loop()->DevicesBegin())
    virtual bool begin(String _topic);

    //The query() method calls from Main::Loop()->DevicesLoop()->... and give the device time quantum to check here physical part (get physical light power from LRS like sample)
    //the method work both with publish() method, but must call here "core section" more often as publish()
    virtual bool query();

    //Get all Device properties at .INI format
    //propName1=prop1Value
    //propName2=prop2Value
    //...
    //propNameNNN=propNNNValue
    virtual String getAllProperties();
    
    //The publish() method as query() metohod calls from Main::Loop()->DevicesLoop()->..., but less often then publish(), not ask physical device values, but publish() the value via transport()
    //to all subscribed to device topic clients
    virtual bool publish();

    //Called from Main::Loop()->DevicesSubsribe(), after Transport going to AVAILABLE (ONCE) and subsribe device to here topics (actuly the device properties values)
    void subscribe();

    //This method works both with subscribe() method and receive all messages pushed to this device subscribed topics
    virtual String onMessage(String _topic, String _payload, int transportMask);

    //Available property GET<->SET wrappers
    int getAvailable();
    bool setAvailable(int _available);

    //Type property GET<->SET wrappers
    int getType();
    bool setType(int _type);

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
    //TRUE(1) if device physical available
    //FALSE(0) if not physical availabel
    //FALSE by default
    int available = 0;

    //Current device type code, see Utils.h for device's types codes
    int type;

    float trap = 0;

	//String historyFileName = "";

 
	//Default size of history data array. By default array size allows store data during 5 minuts every 10 seconds
	int historySize = 30;

	//Current device array for storing history the data. By default array size allows store history data during 5 minuts every 10 seconds
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

	//Set count how often the put the device data in the LogData array, by default logInterval is equal to one minute
	unsigned long historyInterval = ONESECOND * 10;

	//Set count how often the put the device data in the LogData array, by default logInterval is equal to one minute
	unsigned long historyFileWriteInterval = ONESECOND * 60; // ONESECOND * 60;

    //Calls when client get property from network
    String onGetProperty(String _property, String _payload, int transportMask);

    //This method calls from properties SET wrappers methods (setNNN()) and publish to transport message (event) on any wrapped property values is changed
    //The sended message topic is Device compiled topic (Unit/DeviceId)/PropertyName
    //Sample: if available propery is changed at "stepper1" device on unit "unit2544" the SET wrapper calls onInsideChange(), and the topic to be somthing like "world0/area1/front1/room1/unit2544/stepper1/available"
    bool onInsideChange(String _property, String _payload);
};
