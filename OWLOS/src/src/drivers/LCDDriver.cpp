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
#ifdef USE_LCD_DRIVER

//I2C LCD driver based on OWLOS\src\libraries\LiquidCrystal_I2C\LiquidCrystal_I2C.cpp by https://gitlab.com/tandembyte/liquidcrystal_i2c
//
//Известные I2C адрес для разных типов PCF8574хх чипов (если перемычки не соединенны)
//порт 0x27 для PCF8574T
//порт 0x3F для PCF8574AT
//если вам известны адреса для других типов - передайте их нам
//https://raspberrypi.stackexchange.com/questions/39773/how-can-i-use-multiple-lcd-with-connected-via-i2c-on-same-raspberry-project
//A0 | A1 | A2 | 8574 | 8574A
//----+----+----+------+-------
//  L |  L |  L | 0x20 | 0x38
//  L |  L |  H | 0x21 | 0x39
//  L |  H |  L | 0x22 | 0x3A
//  L |  H |  H | 0x23 | 0x3B
//  H |  L |  L | 0x24 | 0x3C
//  H |  L |  H | 0x25 | 0x3D
//  H |  H |  L | 0x26 | 0x3E
//  H |  H |  H | 0x27 | 0x3F
//
//Хорошая лекция по I2C шине:
//https://www.youtube.com/watch?v=_4KD29qnhNM
//WiKi:
//https://ru.wikipedia.org/wiki/I%C2%B2C
//https://ru.wikipedia.org/wiki/%D0%96%D0%B8%D0%B4%D0%BA%D0%BE%D0%BA%D1%80%D0%B8%D1%81%D1%82%D0%B0%D0%BB%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%B4%D0%B8%D1%81%D0%BF%D0%BB%D0%B5%D0%B9
//контроллер LCD
//https://ru.wikipedia.org/wiki/HD44780

//примечание: драйвер LCD требует I2C адрес подчиненного устройства на шине. Для совместимости с общей архитектурой драйверов - I2C адрес представлен внешне в роли
//пина. Что делает возможность управления адресом из PinService.

#define DRIVER_ID "lcd"
#define LCD_LOOP_INTERVAL 200

bool LCDDriver::init()
{
	if (id.length() == 0)
		id = DRIVER_ID;
	BaseDriver::init(id);
	//считываем количество колонок и строк дисплея из файла или из константы (по умолчанию 20x4)
	getCols();
	getRows();
	//получаем I2C Slave адрес для обращения к текущему LCD на I2C шине
	DriverPin *pinDriverInfo = getDriverPinByDriverId(id, I2CADDR_INDEX);
	if (pinDriverInfo != nullptr)
	{
//если пользователь задал адрес, инкапсулируем класс обслуживающий LCD и пробуем работать с дисплеем через указанный порт
#ifdef DEBUG
		debugOut("LCD", String(pinDriverInfo->driverI2CAddr));
#endif
		lcd = new LiquidCrystal_I2C(pinDriverInfo->driverI2CAddr, cols, rows); //port = 0x27 for PCF8574T and PCF8574AT for 0x3F, 16 cols, 2 raws
		lcd->init();														   //init properies
		//мы не проверяем удалось ли подключить дисплей, пробуем применить настройки, пользователь визуально определит - прошло ли действие успешно
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
#ifdef DEBUG
	debugOut("LCD", "NUL NUL NUL");
#endif
	return false;
}
//когда сеть доступна
bool LCDDriver::begin(String _topic)
{
	BaseDriver::begin(_topic);
	setType(LCD_DRIVER_TYPE);
	setAvailable(available);
	return available;
}
//возвращает свойства драйвера LCD
String LCDDriver::getAllProperties()
{
	return BaseDriver::getAllProperties();
	"text=" + text + "//s\n"
					 "textbyrows=" +
		text + "//s\n"
			   "display=" +
		String(display) + "//b\n"
						  "backlight=" +
		String(backlight) + "//b\n"
							"cursor=" +
		String(cursor) + "//b\n"
						 "blink=" +
		String(blink) + "//b\n";
	"autoscroll=" + String(autoscroll) + "//b\n"
										 "clear=" +
		String(clear) + "//b\n"
						"x=" +
		String(x) + "//i\n"
					"y=" +
		String(y) + "//i\n"
					"cols=" +
		String(cols) + "//i\n"
					   "rows=" +
		String(rows) + "//i\n";
}
//управление свойствами LCD драйвера
String LCDDriver::onMessage(String route, String _payload, int8_t transportMask)
{
	String result = BaseDriver::onMessage(route, _payload, transportMask);

	//обычно драйвер не управляет свойствами пинов, но в данном драйвере адрес I2C порта использован в роли Pin - для совместимости
	//с архитектурой, по этой причине необходим отдельный обработчик I2CADDR пина
	if (matchRoute(route, topic, "/setpin"))
	{
		//base is put the new address to to PinService
		result = init(); //init() get Address from PinManger
	}

	if (!result.equals(WRONG_PROPERTY_NAME))
		return result;

	if (matchRoute(route, topic, "/gettext"))
	{
		result = onGetProperty("text", String(getText()), transportMask);
	}
	else if (matchRoute(route, topic, "/settext"))
	{
		result = String(setText(_payload, true));
	}
	else if (matchRoute(route, topic, "/gettextbyrows"))
	{
		result = onGetProperty("text", String(getText()), transportMask);
	}
	else if (matchRoute(route, topic, "/settextbyrows"))
	{
		result = String(setTextByRows(_payload, true));
	}
	//Display
	else if (matchRoute(route, topic, "/getdisplay"))
	{
		result = onGetProperty("display", String(getDisplay()), transportMask);
	}
	else if (matchRoute(route, topic, "/setdisplay"))
	{
		result = String(setDisplay(atoi(_payload.c_str()), true));
	}
	//Backlight
	else if (matchRoute(route, topic, "/getbacklight"))
	{
		result = onGetProperty("backlight", String(getBacklight()), transportMask);
	}
	else if (matchRoute(route, topic, "/setbacklight"))
	{
		result = String(setBacklight(atoi(_payload.c_str()), true));
	}
	//Blink
	else if (matchRoute(route, topic, "/getblink"))
	{
		result = onGetProperty("blink", String(getBlink()), transportMask);
	}
	else if (matchRoute(route, topic, "/setblink"))
	{
		result = String(setBlink(atoi(_payload.c_str()), true));
	}
	//Cursor
	else if (matchRoute(route, topic, "/getcursor"))
	{
		result = onGetProperty("cursor", String(getCursor()), transportMask);
	}
	else if (matchRoute(route, topic, "/setcursor"))
	{
		result = String(setCursor(atoi(_payload.c_str()), true));
	}
	//Autoscroll
	else if (matchRoute(route, topic, "/getautoscroll"))
	{
		result = onGetProperty("autoscroll", String(getAutoscroll()), transportMask);
	}
	else if (matchRoute(route, topic, "/setautoscroll"))
	{
		result = String(setAutoscroll(atoi(_payload.c_str()), true));
	}
	//Clear
	else if (matchRoute(route, topic, "/getclear"))
	{
		result = onGetProperty("clear", String(getClear()), transportMask);
	}
	else if (matchRoute(route, topic, "/setclear"))
	{
		result = String(setClear(atoi(_payload.c_str()), true));
	}
	//X
	else if (matchRoute(route, topic, "/getx"))
	{
		result = onGetProperty("x", String(getX()), transportMask);
	}
	else if (matchRoute(route, topic, "/setx"))
	{
		result = String(setX(atoi(_payload.c_str()), true));
	}
	//Y
	else if (matchRoute(route, topic, "/gety"))
	{
		result = onGetProperty("y", String(getY()), transportMask);
	}
	else if (matchRoute(route, topic, "/sety"))
	{
		result = String(setY(atoi(_payload.c_str()), true));
	}
	//Cols
	else if (matchRoute(route, topic, "/getcols"))
	{
		result = onGetProperty("cols", String(getCols()), transportMask);
	}
	else if (matchRoute(route, topic, "/setcols"))
	{
		result = String(setCols(atoi(_payload.c_str()), true));
	}
	//Rows
	else if (matchRoute(route, topic, "/getrows"))
	{
		result = onGetProperty("rows", String(getRows()), transportMask);
	}
	else if (matchRoute(route, topic, "/setrows"))
	{
		result = String(setRows(atoi(_payload.c_str()), true));
	}

	return result;
}
//Возвращает последний напечатанный текст (Внимание - не весь текст на дисплеи, а только последний переданный через setТехт() или SetTextByRows
String LCDDriver::getText()
{
	if (filesExists(id + ".text"))
	{
		text = filesReadString(id + ".text");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "text=" + String(text));
#endif
#endif
	return text;
}
//Печатает текст в позицию курсора
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
//Печатает текст от левого верхнего угла дисплея, слева на право, сверху вниз. Учитывает размер дисплея.
//Если используется дисплей 20x4 и передан _text длиной 48 символов - то он будет размещен в трех верхних строках
//дисплея, при этом в последней строке будет всего 8 символов.
//Позиция курсора изменяется.
bool LCDDriver::setTextByRows(String _text, bool doEvent)
{
	text = _text;
	setClear(1, false);
	String textRows[rows];		   //массив соответствует указанному количеству строк дисплея
	for (int i = 0; i < rows; i++) //"нарезаем" _text на указанное количество колонок (длине строки дисплея)
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
	filesWriteString(id + ".text", text);
	if (doEvent)
	{

		return onInsideChange("text", String(text));
	}
	return true;
}
//Возвращает указанное количество колонок (длина строки) дисплея. По умолчанию 20.
int LCDDriver::getCols()
{
	if (filesExists(id + ".cols"))
	{
		cols = filesReadInt(id + ".cols");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "cols=" + String(cols));
#endif
#endif
	return cols;
}
//Устанавливает длину строки дисплея (количество колонок)
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
//Возвращает указанное количество строк
int LCDDriver::getRows()
{
	if (filesExists(id + ".rows"))
	{
		rows = filesReadInt(id + ".rows");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "rows=" + String(rows));
#endif
#endif
	return rows;
}
//Устанавливает количество строк
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
//Возвращает состояние жидкокристаллической матрицы дисплея (не путать с подсветкой)
int LCDDriver::getDisplay()
{
	if (filesExists(id + ".display"))
	{
		display = filesReadInt(id + ".display");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "display=" + String(display));
#endif
#endif
	return display;
}
//Включает или выключает жидкокристаллическую матрицу
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
//!Важно: большинство I2C блоков управления дисплеем обладают физическим переключателем (джампером) - включающим и выключающим подсветку.
//Если это переключатель выключен - подсветка дисплея программно доступна не будет.

//Возвращает состояние подсветки - не физическое состояние, а последнее установленное.
int LCDDriver::getBacklight()
{
	if (filesExists(id + ".backlight"))
	{
		backlight = filesReadInt(id + ".backlight");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "backlight=" + String(backlight));
#endif
#endif
	return backlight;
}
//Устанавливает состояние подстветки
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
//Возвращает режим мерцания курсора
int LCDDriver::getBlink()
{
	if (filesExists(id + ".blink"))
	{
		blink = filesReadInt(id + ".blink");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "blink=" + String(blink));
#endif
#endif
	return blink;
}
//Устанавливает режим мерцания курсора
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
//Состояние курсора - виден, невиден
int LCDDriver::getCursor()
{
	if (filesExists(id + ".cursor"))
	{
		cursor = filesReadInt(id + ".cursor");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "cursor=" + String(cursor));
#endif
#endif
	return cursor;
}
//Устанавливает состояние курсора (видимость)
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
//Возвращает режим авто прокрутки содержимого дисплея (если включен, новый текст добавляется в нижний часть дисплея, предыдущий текст сдвигается вверх)
int LCDDriver::getAutoscroll()
{
	if (filesExists(id + ".autoscroll"))
	{
		autoscroll = filesReadInt(id + ".autoscroll");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "autoscroll=" + String(autoscroll));
#endif
#endif
	return autoscroll;
}
//Устанавливает режим авто прокрутки
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
//Формально возвращает состояние очистки дисплея
int LCDDriver::getClear()
{
	clear = 0; //clear is function, 0 is not executed now
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "clear=" + String(clear));
#endif
#endif
	return clear;
}
//Очищает содержимое дисплея если передать _clear = TRUE
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
//Позиция курсора по X (колонки)
int LCDDriver::getX()
{
	if (filesExists(id + ".x"))
	{
		x = filesReadInt(id + ".x");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "x=" + String(x));
#endif
#endif
	return x;
}
//Установить курсор в указанную колонку (x координата)
bool LCDDriver::setX(int _x, bool doEvent)
{
	if (lcd == nullptr)
	{
		return false;
	}
	if (_x < 0)
		_x = 0;
	if (_x > cols)
		_x = cols;
	x = _x;
	lcd->setCursor(x, y);
	filesWriteInt(id + ".x", x);
	if (doEvent)
	{
		return onInsideChange("x", String(x));
	}
	return true;
}
//Позиция курсора по Y (строки)
int LCDDriver::getY()
{
	if (filesExists(id + ".y"))
	{
		y = filesReadInt(id + ".y");
	}
#ifdef DETAILED_DEBUG
#ifdef DEBUG
	debugOut(id, "y=" + String(y));
#endif
#endif
	return y;
}
//Установить курсор в указанную строку (Y координата)
bool LCDDriver::setY(int _y, bool doEvent)
{
	if (_y < 0)
		_y = 0;
	if (_y > rows)
		_y = rows;
	y = _y;
	lcd->setCursor(x, y);
	filesWriteInt(id + ".y", y);
	if (doEvent)
	{
		return onInsideChange("y", String(y));
	}
	return true;
};
#endif
