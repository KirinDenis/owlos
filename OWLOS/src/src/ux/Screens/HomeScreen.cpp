#include "HomeScreen.h"

#include "../Controls/ButtonControl.h"

ButtonControlClass homeButton("home", OWLOSLightColor, OWLOSSuccessColor, OWLOSWarningColor, 1, 16);
ButtonControlClass sensorsButton("sensors", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 2, 16);
ButtonControlClass transportButton("transport", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 3, 16);
ButtonControlClass logButton("log", OWLOSLightColor, OWLOSInfoColor, OWLOSWarningColor, 4, 16);

extern int currentMode;

void HomeButtonTouch()
{        
    if (currentMode != HOME_MODE)
    {
       currentMode = HOME_MODE;
    }   
}

void SensorButtonTouch()
{        
    if (currentMode != SENSORS_MODE)
    {
       currentMode = SENSORS_MODE;
       //refreshSensorStatuses();
    }   
}

void TransportButtonTouch()
{        
    if (currentMode != TRANSPORT_MODE)
    {
       currentMode = TRANSPORT_MODE;
    }   
}

void LogButtonTouch()
{        
    if (currentMode != LOG_MODE)
    {
       currentMode = LOG_MODE;
    }   
}

void homeScreenInit()
{
  homeButton.OnTouchEvent = HomeButtonTouch;
  sensorsButton.OnTouchEvent = SensorButtonTouch;
  transportButton.OnTouchEvent = TransportButtonTouch;
  logButton.OnTouchEvent = LogButtonTouch;
}

void homeScreenRefresh()
{
    homeButton.refresh();
    sensorsButton.refresh();    
    transportButton.refresh();
    logButton.refresh();
}

void homeScreenDraw()
{
    homeButton.draw();
    sensorsButton.draw();
    transportButton.draw();
    logButton.draw();
}
