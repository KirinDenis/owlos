REM Ready IoT Solution - OWLOS
REM Copyright 2019, 2020 by:
REM - Konstantin Brul (konstabrul@gmail.com)
REM - Vitalii Glushchenko (cehoweek@gmail.com)
REM - Denys Melnychuk (meldenvar@gmail.com)
REM - Denis Kirin (deniskirinacs@gmail.com)

REM This file is part of Ready IoT Solution - OWLOS

REM OWLOS is free software : you can redistribute it and/or modify it under the
REM terms of the GNU General Public License as published by the Free Software
REM Foundation, either version 3 of the License, or (at your option) any later
REM version.

REM OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
REM WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
REM FOR A PARTICULAR PURPOSE.
REM See the GNU General Public License for more details.

REM You should have received a copy of the GNU General Public License along
REM with OWLOS. If not, see < https://www.gnu.org/licenses/>.

REM GitHub: https://github.com/KirinDenis/owlos
REM :: UTF-8 CodePage 

copy .pio\build\nodemcu\firmware.bin firmware\OWLOS.ino.nodemcu.bin
copy .pio\build\d1\firmware.bin firmware\OWLOS.ino.d1.bin
copy .pio\build\d1_mini\firmware.bin firmware\OWLOS.ino.d1_mini.bin
copy .pio\build\esp32\firmware.bin firmware\OWLOS.ino.esp32.bin
copy .pio\build\esp32dev\firmware.bin firmware\OWLOS.ino.esp32dev.bin

copy  data\CompressedPackOne\*.gz firmware\*.gz