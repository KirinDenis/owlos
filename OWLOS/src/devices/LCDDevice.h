#include <LiquidCrystal_I2C.h> //https://www.dfrobot.com/wiki/index.php/I2C/TWI_LCD1602_Module_(Gadgeteer_Compatible)_(SKU:_DFR0063)   http://www.dfrobot.com/wiki/index.php?title=I2C/TWI_LCD1602_Module_(SKU:_DFR0063) Download: http://www.dfrobot.com/image/data/DFR0154/LiquidCrystal_I2Cv1-1.rar
#include <Arduino.h>
#include "BaseDevice.h"

#define DeviceID "lcd"
#define LCDLoopInterval 200

class LCDDevice : public BaseDevice {
  public:
    bool init();
    bool begin(String _topic);
    String getAllProperties();
    String onMessage(String _topic, String _payload, int transportMask);

    int getAddr();
    bool setAddr(int _addr,  bool doEvent);

    int getCols();
    bool setCols(int _cols,  bool doEvent);

    int getRows();
    bool setRows(int _rows,  bool doEvent);

    String getText();
    bool setText(String _text,  bool doEvent);

    int getBacklight();
    bool setBacklight(int _backlight,  bool doEvent);

    int getClear();
    bool setClear(int _clear,  bool doEvent);

    int getX();
    bool setX(int _x,  bool doEvent);

    int getY();
    bool setY(int _y,  bool doEvent);


  private:
    int addr = 0x3F; 
    int cols = 20;
    int rows = 4;
    int backlight = 1;
    int clear = 0;
    int x = 0;
    int y = 0;
    String text = "";
};
