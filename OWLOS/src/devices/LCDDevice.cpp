#include "LCDDevice.h"

LiquidCrystal_I2C * lcd;

bool LCDDevice::init()
{
  if (id.length() == 0) id = DeviceID;
  BaseDevice::init(id);

  getAddr();
  getCols();
  getRows();

  delete lcd;
  lcd = NULL;
  lcd = new LiquidCrystal_I2C(addr, cols, rows); //port = 0x27 for PCF8574T and PCF8574AT for 0x3F, 16 cols, 2 raws
  lcd->init();  //init properies

  getBacklight();
  setBacklight(backlight, false);

  getX();
  setX(x, false); 

  getY();
  setY(y, false); 

  getText();
  setText(text, false);

}

bool LCDDevice::begin(String _topic)
{
  BaseDevice::begin(_topic);
  setType(LCD);
  setAvailable(available);
  return available;
}

String LCDDevice::getAllProperties()
{
  String result = BaseDevice::getAllProperties();
  result += "text=" + text + "//s\n";
  result += "backlight=" + String(backlight) + "//b\n";
  result += "clear=" + String(clear) + "//b\n";
  result += "x=" + String(x) + "//i\n";
  result += "y=" + String(y) + "//i\n";
  result += "addr=" + String(addr) + "//i\n";
  result += "cols=" + String(cols) + "//i\n";
  result += "rows=" + String(rows) + "//i\n";
  return result;
}

String LCDDevice::onMessage(String _topic, String _payload, int transportMask)
{
  String result = BaseDevice::onMessage(_topic, _payload, transportMask);
  if (!available) return result;

  if (String(topic + "/gettext").equals(_topic))
  {
    result = onGetProperty("text", String(getText()), transportMask);
  }
  else if (String(topic + "/settext").equals(_topic))
  {
          result = String(setText(_payload, true));
  }
  //Backlight
  else if (String(topic + "/getbacklight").equals(_topic))
  {
    result = onGetProperty("backlight", String(getBacklight()), transportMask);
  }
  else if (String(topic + "/setbacklight").equals(_topic))
  {
          result = String(setBacklight(std::atoi(_payload.c_str()), true));
  }
  //Clear
  else if (String(topic + "/getclear").equals(_topic))
  {
    result = onGetProperty("clear", String(getClear()), transportMask);
  }
  else if (String(topic + "/setclear").equals(_topic))
  {
          result = String(setClear(std::atoi(_payload.c_str()), true));
  }
  //X
  else if (String(topic + "/getx").equals(_topic))
  {
    result = onGetProperty("x", String(getX()), transportMask);
  }
  else if (String(topic + "/setx").equals(_topic))
  {
          result = String(setX(std::atoi(_payload.c_str()), true));
  }
  //Y
  else if (String(topic + "/gety").equals(_topic))
  {
    result = onGetProperty("y", String(getY()), transportMask);
  }
  else if (String(topic + "/sety").equals(_topic))
  {
          result = String(setY(std::atoi(_payload.c_str()), true));
  }
  //Addr
  else if (String(topic + "/getaddr").equals(_topic))
  {
    result = onGetProperty("addr", String(getAddr()), transportMask);
  }
  else if (String(topic + "/setaddr").equals(_topic))
  {
          result = String(setAddr(std::atoi(_payload.c_str()), true));
  }
  //Cols
  else if (String(topic + "/getcols").equals(_topic))
  {
    result = onGetProperty("cols", String(getCols()), transportMask);
  }
  else if (String(topic + "/setcols").equals(_topic))
  {
          result = String(setCols(std::atoi(_payload.c_str()), true));
  }
  //Rows
  else if (String(topic + "/getrows").equals(_topic))
  {
    result = onGetProperty("rows", String(getRows()), transportMask);
  }
  else if (String(topic + "/setrows").equals(_topic))
  {
          result = String(setRows(std::atoi(_payload.c_str()), true));
  }


  return result;
}

//Text -------------------------------------------
String LCDDevice::getText()
{
  if (filesExists(id + ".text"))
  {
    text = filesReadString(id + ".text");
  }
  if (DetailedDebug) debugOut(id, "text=" + String(text));
  return text;
}

bool LCDDevice::setText(String _text, bool doEvent)
{
  text = _text;
  if ((x == 0) && (y == 0))
  {
    //TODO Array related to LCD device rows count
    setClear(1, false);
    String r1 = text.substring(0, cols);
    String r2 = text.substring(cols+1, cols*2);
    String r3 = text.substring(cols*2+1, cols*3);
    String r4 = text.substring(cols*3+1, cols*4);

    lcd->setCursor(0, 0);
    lcd->print(r1);
    lcd->setCursor(0, 1);    
    lcd->print(r2);
    lcd->setCursor(0, 2);    
    lcd->print(r3);
    lcd->setCursor(0, 3);    
    lcd->print(r4);

  }
  else 
  {
    lcd->print(text);
  }

  filesWriteString(id + ".text", text);
  if (doEvent)
  {

    return onInsideChange("text", String(text));
  }
  return true;
}

//Addr --------------------------------------------------------------
int LCDDevice::getAddr()
{
  if (filesExists(id + ".addr"))
  {
    addr = filesReadInt(id + ".addr");
  }
  if (DetailedDebug) debugOut(id, "addr=" + String(addr));
  return addr;
}

bool LCDDevice::setAddr(int _addr, bool doEvent)
{
  addr = _addr;
  filesWriteInt(id + ".addr", addr);
  init();
  if (doEvent)
  {
    return onInsideChange("addr", String(addr));
  }
  return true;
}

//Cols --------------------------------------------------------------
int LCDDevice::getCols()
{
  if (filesExists(id + ".cols"))
  {
    cols = filesReadInt(id + ".cols");
  }
  if (DetailedDebug) debugOut(id, "cols=" + String(cols));
  return cols;
}

bool LCDDevice::setCols(int _cols, bool doEvent)
{
  cols = _cols;
  filesWriteInt(id + ".cols", cols);
  init();
  if (doEvent)
  {
    return onInsideChange("cols", String(cols));
  }
  return true;
}

//Rows --------------------------------------------------------------
int LCDDevice::getRows()
{
  if (filesExists(id + ".rows"))
  {
    rows = filesReadInt(id + ".rows");
  }
  if (DetailedDebug) debugOut(id, "rows=" + String(rows));
  return rows;
}

bool LCDDevice::setRows(int _rows, bool doEvent)
{
  rows = _rows;
  filesWriteInt(id + ".rows", rows);
  init();
  if (doEvent)
  {
    return onInsideChange("rows", String(rows));
  } 
  return true;
}


//Backlight
int LCDDevice::getBacklight()
{
  if (filesExists(id + ".backlight"))
  {
    backlight = filesReadInt(id + ".backlight");
  }
  if (DetailedDebug) debugOut(id, "backlight=" + String(backlight));
  return backlight;
}

bool LCDDevice::setBacklight(int _backlight, bool doEvent)
{
  backlight = _backlight;
  if (backlight)
  {
    lcd->backlight();
  }
  else
  {
    lcd->noBacklight();
  }

  filesWriteInt(id + ".backlight", backlight);
  if (doEvent)
  {
    return onInsideChange("backlight", String(backlight));
  }
  return true;
}
//Clear
int LCDDevice::getClear()
{
  clear = 0; //clear is function, 0 is not executed now
  if (DetailedDebug) debugOut(id, "clear=" + String(clear));
  return clear;
}

bool LCDDevice::setClear(int _clear, bool doEvent)
{
  clear = _clear;
  if (clear)
  {
    lcd->clear();
  }

  if (doEvent)
  {
    return onInsideChange("clear", String(clear));
  }
  clear = 0; //Clear is doit
  return true;
}
//X
int LCDDevice::getX()
{
  if (filesExists(id + ".x"))
  {
    x = filesReadInt(id + ".x");
  }
    if (DetailedDebug) debugOut(id, "x=" + String(x));
  return x;
}

bool LCDDevice::setX(int _x, bool doEvent)
{
  if (_x < 0) _x = 0;
  if (_x > cols) _x = cols;
  x = _x;
  lcd->setCursor(x, y);
  filesWriteInt(id + ".x", x);
  if (doEvent)
  {
    return onInsideChange("x", String(x));
  }
  return true;
}

//Y
int LCDDevice::getY()
{
  if (filesExists(id + ".y"))
  {
    y = filesReadInt(id + ".y");
  }
    if (DetailedDebug) debugOut(id, "y=" + String(y));
  return y;
}

bool LCDDevice::setY(int _y, bool doEvent)
{
  if (_y < 0) _y = 0;
  if (_y > rows) _y = rows;
  y = _y;
  lcd->setCursor(x, y);
  filesWriteInt(id + ".y", y);
  if (doEvent)
  {
    return onInsideChange("y", String(y));
  }
  return true;
}

;
