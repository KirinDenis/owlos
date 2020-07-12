
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

REM (Этот файл — часть Ready IoT Solution - OWLOS.

REM OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
REM ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
REM была опубликована Фондом свободного программного обеспечения; версии 3
REM лицензии, любой более поздней версии.

REM OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
REM ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
REM ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
REM Подробнее см.в Стандартной общественной лицензии GNU.

REM Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
REM этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)


rem Compile and pack firware for NodeMCU, WeMos D1R1 and WeMos D1R2_mini
rem select path to arduino.exe
rem setup path for D:\BUILD - binnary store folder

rem NodeMCU ------------------------------------------------------------------------------------------------
@ECHO OFF

@ECHO GZ and copy JavaScript sources
CD data

D:\7Zip\7z.exe a -mx9 actuatorwidget.js.gz actuatorwidget.js
REM copy  "actuatorwidget.js.gz" "actuatorwidget.js.gz"
D:\7Zip\7z.exe a -mx9 basewidget.js.gz basewidget.js 
REM copy  "basewidget.js.gz" "basewidget.js.gz"
D:\7Zip\7z.exe a -mx9 bootcore.js.gz bootcore.js 
REM copy  "bootcore.js.gz" "bootcore.js.gz"
D:\7Zip\7z.exe a -mx9 bootstrap.min.css.gz bootstrap.min.css
REM copy  "bootstrap.min.css.gz" "bootstrap.min.css.gz"
D:\7Zip\7z.exe a -mx9 bootstrap.min.js.gz bootstrap.min.js 
REM copy  "bootstrap.min.js.gz" "bootstrap.min.js.gz"
D:\7Zip\7z.exe a -mx9 restclientcore.js.gz restclientcore.js 
REM copy  "restclientcore.js.gz" "restclientcore.js.gz"
D:\7Zip\7z.exe a -mx9 ui.css.gz ui.css 
REM copy  "ui.css.gz" "ui.css.gz"
D:\7Zip\7z.exe a -mx9 dataTables.min.css.gz dataTables.min.css 
REM copy  "dataTables.min.css.gz" "dataTables.min.css.gz"
D:\7Zip\7z.exe a -mx9 dataTables.min.js.gz dataTables.min.js 
REM copy  "dataTables.min.js.gz" "dataTables.min.js.gz"
D:\7Zip\7z.exe a -mx9 widgetswrappers.js.gz widgetswrappers.js 
REM copy  "widgetswrappers.js.gz" "widgetswrappers.js.gz"
D:\7Zip\7z.exe a -mx9 driverscore.js.gz driverscore.js 
REM copy  "driverscore.js.gz" "driverscore.js.gz"
D:\7Zip\7z.exe a -mx9 driversui.js.gz driversui.js 
REM copy  "driversui.js.gz" "driversui.js.gz"
D:\7Zip\7z.exe a -mx9 drawcore.js.gz drawcore.js 
REM copy  "drawcore.js.gz" "drawcore.js.gz"
D:\7Zip\7z.exe a -mx9 dashboardui.js.gz dashboardui.js 
REM copy  "dashboardui.js.gz" "dashboardui.js.gz"
D:\7Zip\7z.exe a -mx9 filespanelui.js.gz filespanelui.js 
REM copy  "filespanelui.js.gz" "filespanelui.js.gz"
D:\7Zip\7z.exe a -mx9 index.html.gz index.html 
REM copy  "index.html.gz" "index.html.gz"
D:\7Zip\7z.exe a -mx9 index.js.gz index.js 
REM copy  "index.js.gz" "index.js.gz"
D:\7Zip\7z.exe a -mx9 jquery.dataTables.min.js.gz jquery.dataTables.min.js
REM copy  "jquery.dataTables.min.js.gz" "jquery.dataTables.min.js.gz"
D:\7Zip\7z.exe a -mx9 jquery.min.js.gz jquery.min.js
REM copy  "jquery.min.js.gz" "jquery.min.js.gz"
D:\7Zip\7z.exe a -mx9 languagescore.js.gz languagescore.js
REM copy  "languagescore.js.gz" "languagescore.js.gz"
D:\7Zip\7z.exe a -mx9 lcdwidget.js.gz lcdwidget.js
REM copy  "lcdwidget.js.gz" "lcdwidget.js.gz"
D:\7Zip\7z.exe a -mx9 lightwidget.js.gz lightwidget.js
REM copy  "lightwidget.js.gz" "lightwidget.js.gz"
D:\7Zip\7z.exe a -mx9 lcdwidget.js.gz lcdwidget.js
REM copy  "lcdwidget.js.gz" "lcdwidget.js.gz"
D:\7Zip\7z.exe a -mx9 lightwidget.js.gz lightwidget.js
REM copy  "lightwidget.js.gz" "lightwidget.js.gz"
D:\7Zip\7z.exe a -mx9 motionwidget.js.gz motionwidget.js
REM copy  "motionwidget.js.gz" "motionwidget.js.gz"
D:\7Zip\7z.exe a -mx9 settingsui.js.gz settingsui.js
REM copy  "settingsui.gz" "settingsui.gz"
D:\7Zip\7z.exe a -mx9 radialwidget.js.gz radialwidget.js
REM copy  "radialwidget.js.gz" "radialwidget.js.gz"
D:\7Zip\7z.exe a -mx9 smokewidget.js.gz smokewidget.js
REM copy  "smokewidget.js.gz" "smokewidget.js.gz"
D:\7Zip\7z.exe a -mx9 speechcore.js.gz speechcore.js
REM copy  "speechcore.js.gz" "speechcore.js.gz"
D:\7Zip\7z.exe a -mx9 stepperwidget.js.gz stepperwidget.js
REM copy  "stepperwidget.js.gz" "stepperwidget.js.gz"
D:\7Zip\7z.exe a -mx9 temperaturewidget.js.gz temperaturewidget.js
REM copy  "temperaturewidget.js.gz" "temperaturewidget.js.gz"
D:\7Zip\7z.exe a -mx9 graphwidget.js.gz graphwidget.js
REM copy  "graphwidget.js.gz" "graphwidget.js.gz"
D:\7Zip\7z.exe a -mx9 configcore.js.gz configcore.js
REM copy  "configcore.js.gz" "configcore.js.gz"
D:\7Zip\7z.exe a -mx9 tablewidget.js.gz tablewidget.js
REM copy  "tablewidget.js.gz" "tablewidget.js.gz"
D:\7Zip\7z.exe a -mx9 valuewidget.js.gz valuewidget.js
REM copy  "valuewidget.js.gz" "valuewidget.js.gz"
D:\7Zip\7z.exe a -mx9 scriptscore.js.gz scriptscore.js
REM copy  "scriptscore.js.gz" "scriptscore.js.gz"


REM copy "updateinfo.html" "updateinfo.html"

CD ..

@ECHO NodeMCU compile

RD /S /Q "D:\build\"
D:\Arduino\arduino --pref build.path="D:\build" --board esp8266:esp8266:nodemcu:xtal=160,vt=flash,exception=disabled,eesz=4M2M,ip=lm2f,dbg=Disabled,lvl=None____,wipe=none,baud=921600 -v --verify "OWLOS.ino"

@ECHO wait for NodeMCU binnary
:waitnodemcu
IF EXIST "D:\build\OWLOS.ino.bin" GOTO nodemcuready
TIMEOUT /T 5 >nul
@ECHO .
GOTO waitnodemcu

:nodemcuready
copy "D:\build\OWLOS.ino.bin" "OWLOS.ino.nodemcu.bin"

rem WeMos D1 ------------------------------------------------------------------------------------------------
RD /S /Q "D:\build\"
D:\Arduino\arduino --pref build.path="D:\build" --board esp8266:esp8266:d1:xtal=160,vt=flash,exception=disabled,eesz=4M2M,ip=lm2f,dbg=Disabled,lvl=None____,wipe=none,baud=921600 -v --verify "OWLOS.ino"

@ECHO wait for WeMos D1 binnary
:waitwemosd1
IF EXIST "D:\build\OWLOS.ino.bin" GOTO wemosd1ready
TIMEOUT /T 5 >nul
@ECHO .
GOTO waitwemosd1

:wemosd1ready
copy "D:\build\OWLOS.ino.bin" "OWLOS.ino.d1.bin"

rem WeMos D1R2 mini -----------------------------------------------------------------------------------------------
RD /S /Q "D:\build\"
D:\Arduino\arduino --pref build.path="D:\build" --board esp8266:esp8266:d1_mini:xtal=160,vt=flash,exception=disabled,eesz=4M2M,ip=lm2f,dbg=Disabled,lvl=None____,wipe=none,baud=921600 -v --verify "OWLOS.ino"

@ECHO wait for WeMos D1 R2 mini binnary
:waitwemosd1r2
IF EXIST "D:\build\OWLOS.ino.bin" GOTO wemosd1r2ready
TIMEOUT /T 5 >nul
@ECHO .
GOTO waitwemosd1r2

:wemosd1r2ready
copy "D:\build\OWLOS.ino.bin" "OWLOS.ino.d1_mini.bin"

@ECHO -- Compile OK

