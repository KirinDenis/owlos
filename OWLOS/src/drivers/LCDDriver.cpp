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

LiquidCrystal_I2C * lcd;

bool LCDDriver::init()
{
	if (id.length() == 0) id = DriverID;
	BaseDriver::init(id);

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
	result += "backlight=" + String(backlight) + "//b\n";
	result += "clear=" + String(clear) + "//b\n";
	result += "x=" + String(x) + "//i\n";
	result += "y=" + String(y) + "//i\n";
	result += "addr=" + String(addr) + "//i\n";
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
	if ((x == 0) && (y == 0))
	{
		//TODO Array related to LCD driver rows count
		setClear(1, false);
		String r1 = text.substring(0, cols);
		String r2 = text.substring(cols + 1, cols * 2);
		String r3 = text.substring(cols * 2 + 1, cols * 3);
		String r4 = text.substring(cols * 3 + 1, cols * 4);

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
int LCDDriver::getAddr()
{
	if (filesExists(id + ".addr"))
	{
		addr = filesReadInt(id + ".addr");
	}
#ifdef DetailedDebug
	debugOut(id, "addr=" + String(addr));
#endif
	return addr;
}

bool LCDDriver::setAddr(int _addr, bool doEvent)
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
