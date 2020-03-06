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

#include <Arduino.h>
#include "BaseDriver.h"

#define DriverID "stepper1"
#define StepperLoopInterval 200

class StepperDriver : public BaseDriver {
  public:
    bool init();
    bool begin(String _topic);
    String getAllProperties();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin1();
    bool setPin1(int _pin1);
    int getPin2();
    bool setPin2(int _pin2);
    int getPin3();
    bool setPin3(int _pin3);
    int getPin4();
    bool setPin4(int _pin4);
    int getToPosition();
    bool setToPosition(int _toPosition);
    int getBusy();
    bool setBusy(int _busy);
    int getStop();
    bool setStop(int _stop);
    int getPosition();
    bool setPosition(int _toPosition,  bool doEvent);
    int getRange();
    bool setRange(int _range);
    int getSpeed();
    bool setSpeed(int _speed);


  private:
    int pin1 = STEPPERPIN1;
    int pin2 = STEPPERPIN2;
    int pin3 = STEPPERPIN3;
    int pin4 = STEPPERPIN4;

    int toPosition = 5000;
    int busy = 0;
    int stop = 1;
    int position = 5000;
    int range = 10000;
    int speed = 2000;

    int lookup[8] = {B01000, B01100, B00100, B00110, B00010, B00011, B00001, B01001};
    int countsperrev = 512; // number of steps per full revolution

    void doStop();
    void doOutput(int out);
};
