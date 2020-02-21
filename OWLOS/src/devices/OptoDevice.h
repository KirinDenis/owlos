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
with OWL OS. If not, see < https://www.gnu.org/licenses/>.

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
#include "BaseDevice.h"

#define DeviceID "opto"

class OptoDevice : public BaseDevice {
  public:
    bool init();
    bool begin(String _topic);
    bool query();
    String getAllProperties();
    bool publish();
    String onMessage(String _topic, String _payload, int transportMask);

    int getPin1();
    bool setPin1(int _pin1);
    int getPin2();
    bool setPin2(int _pin2);
    String getData();

  private:
    int pin1 = OPTOSENSORPIN1;
    int pin2 = OPTOSENSORPIN2;
    String data = "nan";

    unsigned long queryInterval = ONETENTHOFSECOND;
    int sensor1Condition = 0;
    int sensor2Condition = 0;
    int dataInt = 0;
    /* returned phase of motion:
      0 - no motion
      1 - end of motion from sensor1 to sensor2
      2 - end of motion from sensor2 to sensor1
      3 - motion
      4 - dimension error*/
    int motionPhase = 0;
    /* phase of motion:
      0 - no motion or motion is ended, null phase
      1 - sensor1 is darked, motion is starting from sensor1 to sensor2
      2 - sensor 1 and sensor 2 are darked, motion is continueing from sensor1 to sensor2
      3 - sensor 2 is darked, motion is ending from sensor1 to sensor2
      11 - sensor2 is darked, motion is starting from sensor2 to sensor1
      12 - sensor1 and sensor2 are darked, motion is continueing from sensor2 to sensor1
      13 - sensor1 is darked, motion is ending from sensor2 to sensor1
      22 - error */
    int backMotionCount = 0;

};
