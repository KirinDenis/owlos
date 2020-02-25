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
