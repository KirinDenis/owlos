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

#include "LCDDriver.h"




bool LCDDriver::init()
{
	if (id.length() == 0) id = DriverID;
	BaseDriver::init(id);

	getCols();
	getRows();

	PinDriverInfo pinDriverInfo;
	if (getDriverPinInfo(id, I2CADDR_INDEX, &pinDriverInfo))
	{
		debugOut("LCD", String(pinDriverInfo.driverI2CAddr));
		lcd = new LiquidCrystal_I2C(pinDriverInfo.driverI2CAddr, cols, rows); //port = 0x27 for PCF8574T and PCF8574AT for 0x3F, 16 cols, 2 raws
		lcd->init();  //init properies

		getDisplay();
		setDisplay(display, false);

		getBacklight();
		setBacklight(backlight, false);

		getCursor();
		setCursor(cursor, false);

		getBlink();
		setBlink(blink, false);

		getAutoscroll();
		setAutoscroll(autoscroll, false);

		getX();
		setX(x, false);

		getY();
		setY(y, false);

		getText();
		setText(text, false);

		return true;
	}
	return false;
}

bool LCDDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(LCD);
	setAvailable(available);
	return available;
}

String LCDDriver::getAllProperties()
{
	String result = BaseDriver::getAllProperties();
	result += "text=" + text + "//s\n";
	result += "textbyrows=" + text + "//s\n"; //the same text 
	result += "display=" + String(display) + "//b\n";
	result += "backlight=" + String(backlight) + "//b\n";
	result += "cursor=" + String(cursor) + "//b\n";
	result += "blink=" + String(blink) + "//b\n";
	result += "autoscroll=" + String(autoscroll) + "//b\n";
	result += "clear=" + String(clear) + "//b\n";
	result += "x=" + String(x) + "//i\n";
	result += "y=" + String(y) + "//i\n";
	result += "cols=" + String(cols) + "//i\n";
	result += "rows=" + String(rows) + "//i\n";
	return result;
}

String LCDDriver::onMessage(String _topic, String _payload, int transportMask)
{
	String result = BaseDriver::onMessage(_topic, _payload, transportMask);
	if (!available) return result;

	if (String(topic + "/gettext").equals(_topic))
	{
		result = onGetProperty("text", String(getText()), transportMask);
	}
	else if (String(topic + "/settext").equals(_topic))
	{
		result = String(setText(_payload, true));
	}
	else if (String(topic + "/gettextbyrows").equals(_topic)) //just getText call - the text same for both API
	{
		result = onGetProperty("text", String(getText()), transportMask);
	}
	else if (String(topic + "/settextbyrows").equals(_topic))
	{
		result = String(setTextByRows(_payload, true));
	}
	//Display
	else if (String(topic + "/getdisplay").equals(_topic))
	{
		result = onGetProperty("display", String(getDisplay()), transportMask);
	}
	else if (String(topic + "/setdisplay").equals(_topic))
	{
		result = String(setDisplay(std::atoi(_payload.c_str()), true));
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
	//Blink
	else if (String(topic + "/getblink").equals(_topic))
	{
		result = onGetProperty("blink", String(getBlink()), transportMask);
	}
	else if (String(topic + "/setblink").equals(_topic))
	{
		result = String(setBlink(std::atoi(_payload.c_str()), true));
	}
	//Cursor
	else if (String(topic + "/getcursor").equals(_topic))
	{
		result = onGetProperty("cursor", String(getCursor()), transportMask);
	}
	else if (String(topic + "/setcursor").equals(_topic))
	{
		result = String(setCursor(std::atoi(_payload.c_str()), true));
	}
	//Autoscroll
	else if (String(topic + "/getautoscroll").equals(_topic))
	{
		result = onGetProperty("autoscroll", String(getAutoscroll()), transportMask);
	}
	else if (String(topic + "/setautoscroll").equals(_topic))
	{
		result = String(setAutoscroll(std::atoi(_payload.c_str()), true));
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
	else if (String(topic + "/setpin" + String(I2CADDR_INDEX)).equals(_topic))
	{
		//base is put the new address to to PinManager
		result = init(); //init() get Address from PinManger	
	}


	return result;
}

//Text -------------------------------------------
String LCDDriver::getText()
{
	if (filesExists(id + ".text"))
	{
		text = filesReadString(id + ".text");
	}
#ifdef DetailedDebug
	debugOut(id, "text=" + String(text));
#endif
	return text;
}

bool LCDDriver::setText(String _text, bool doEvent)
{
	text = _text;
	lcd->print(text);
	filesWriteString(id + ".text", text);
	if (doEvent)
	{

		return onInsideChange("text", String(text));
	}
	return true;
}


bool LCDDriver::setTextByRows(String _text, bool doEvent)
{
	text = _text;

	//TODO Array related to LCD driver rows count
	setClear(1, false);
	String textRows[rows];
	for (int i = 0; i < rows; i++)
	{
		if (i == 0)
		{
			textRows[i] = text.substring(cols * i + 1, cols + cols * i);
		}
		else
		{
			textRows[i] = text.substring(cols * i, cols + cols * i);
		}

		if (textRows[i].length() != 0)
		{
			lcd->setCursor(0, i);
			lcd->print(textRows[i]);
		}
		else
		{
			break;
		}
	}

	//String r1 = text.substring(0, cols);
	//String r2 = text.substring(cols + 1, cols * 2);
	//String r3 = text.substring(cols * 2 + 1, cols * 3);
	//String r4 = text.substring(cols * 3 + 1, cols * 4);

	//lcd->setCursor(0, 0);
	//lcd->print(r1);
	//lcd->setCursor(0, 1);
	//lcd->print(r2);
	//lcd->setCursor(0, 2);
	//lcd->print(r3);
	//lcd->setCursor(0, 3);
	//lcd->print(r4);

	filesWriteString(id + ".text", text);
	if (doEvent)
	{

		return onInsideChange("text", String(text));
	}
	return true;
}



//Cols --------------------------------------------------------------
int LCDDriver::getCols()
{
	if (filesExists(id + ".cols"))
	{
		cols = filesReadInt(id + ".cols");
	}
#ifdef DetailedDebug
	debugOut(id, "cols=" + String(cols));
#endif
	return cols;
}

bool LCDDriver::setCols(int _cols, bool doEvent)
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
int LCDDriver::getRows()
{
	if (filesExists(id + ".rows"))
	{
		rows = filesReadInt(id + ".rows");
	}
#ifdef DetailedDebug
	debugOut(id, "rows=" + String(rows));
#endif
	return rows;
}

bool LCDDriver::setRows(int _rows, bool doEvent)
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

//Display
int LCDDriver::getDisplay()
{
	if (filesExists(id + ".display"))
	{
		display = filesReadInt(id + ".display");
	}
#ifdef DetailedDebug
	debugOut(id, "display=" + String(display));
#endif
	return display;
}

bool LCDDriver::setDisplay(int _display, bool doEvent)
{
	display = _display;
	if (display)
	{
		lcd->display();
	}
	else
	{
		lcd->noDisplay();
	}

	filesWriteInt(id + ".display", display);
	if (doEvent)
	{
		return onInsideChange("display", String(display));
	}
	return true;
}


//Backlight
int LCDDriver::getBacklight()
{
	if (filesExists(id + ".backlight"))
	{
		backlight = filesReadInt(id + ".backlight");
	}
#ifdef DetailedDebug
	debugOut(id, "backlight=" + String(backlight));
#endif
	return backlight;
}

bool LCDDriver::setBacklight(int _backlight, bool doEvent)
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

//Blink
int LCDDriver::getBlink()
{
	if (filesExists(id + ".blink"))
	{
		blink = filesReadInt(id + ".blink");
	}
#ifdef DetailedDebug
	debugOut(id, "blink=" + String(blink));
#endif
	return blink;
}

bool LCDDriver::setBlink(int _blink, bool doEvent)
{
	blink = _blink;
	if (blink)
	{
		lcd->blink();
	}
	else
	{
		lcd->noBlink();
	}

	filesWriteInt(id + ".blink", blink);
	if (doEvent)
	{
		return onInsideChange("blink", String(blink));
	}
	return true;
}

//Cursor
int LCDDriver::getCursor()
{
	if (filesExists(id + ".cursor"))
	{
		cursor = filesReadInt(id + ".cursor");
	}
#ifdef DetailedDebug
	debugOut(id, "cursor=" + String(cursor));
#endif
	return cursor;
}

bool LCDDriver::setCursor(int _cursor, bool doEvent)
{
	cursor = _cursor;
	if (cursor)
	{
		lcd->cursor();
	}
	else
	{
		lcd->noCursor();
	}

	filesWriteInt(id + ".cursor", cursor);
	if (doEvent)
	{
		return onInsideChange("cursor", String(cursor));
	}
	return true;
}

//Autoscroll
int LCDDriver::getAutoscroll()
{
	if (filesExists(id + ".autoscroll"))
	{
		autoscroll = filesReadInt(id + ".autoscroll");
	}
#ifdef DetailedDebug
	debugOut(id, "autoscroll=" + String(autoscroll));
#endif
	return autoscroll;
}

bool LCDDriver::setAutoscroll(int _autoscroll, bool doEvent)
{
	autoscroll = _autoscroll;
	if (autoscroll)
	{
		lcd->autoscroll();
	}
	else
	{
		lcd->noAutoscroll();
	}

	filesWriteInt(id + ".autoscroll", autoscroll);
	if (doEvent)
	{
		return onInsideChange("autoscroll", String(autoscroll));
	}
	return true;
}


//Clear
int LCDDriver::getClear()
{
	clear = 0; //clear is function, 0 is not executed now
#ifdef DetailedDebug
	debugOut(id, "clear=" + String(clear));
#endif
	return clear;
}

bool LCDDriver::setClear(int _clear, bool doEvent)
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
int LCDDriver::getX()
{
	if (filesExists(id + ".x"))
	{
		x = filesReadInt(id + ".x");
	}
#ifdef DetailedDebug
	debugOut(id, "x=" + String(x));
#endif
	return x;
}

bool LCDDriver::setX(int _x, bool doEvent)
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
int LCDDriver::getY()
{
	if (filesExists(id + ".y"))
	{
		y = filesReadInt(id + ".y");
	}
#ifdef DetailedDebug
	debugOut(id, "y=" + String(y));
#endif
	return y;
}

bool LCDDriver::setY(int _y, bool doEvent)
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
