/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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
#ifndef HTTPSERVERTHINGS_H
#define HTTPSERVERTHINGS_H

#include "../config.h"
#ifdef USE_ESP_DRIVER

static const char OWLOSLogo[] PROGMEM = "<font color='#62add0' size='2'><pre><code><span>\n"
										"000000001                       100000000\n"
										"0000000000000               0000000000000\n"
										"000000000010000000     000000010000000000\n"
										"00000  10001  1000000000001  10001  10000\n"
										" 0000001   1001    101    0001   1000000\n"
										" 00 000001     100     001     100000 00\n"
										" 00  000 000       0001      000  00  00\n"
										" 00  000  0000              0000  00  00\n"
										" 00   00  00000           00000  00   00\n"
										" 00&  00    00000       00000    00  100\n"
										" 000     000  00000  00000  000     000\n"
										" 000001  100000000000000000001  10000\n"
										"    000001 0000000 0000000  000000\n"
										"        00000000       00000000\n"
										"          0000000   0000000\n"
										"             00000000000\n"
										"                 000\n"
										"\n"
										"</span></code></pre></font><br>";


String decode(String param);
String getContentType(String fileName);
String GetNotFoundHTML();
#endif
#endif