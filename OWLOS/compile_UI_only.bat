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


REM unREM copy and put destination path, to copy content to different path
@ECHO GZ and REM copy  JavaScript sources
CD data
MKDIR "CompressedFull"
del /Q "CompressedFull\*.*"

MKDIR "CompressedPackOne"
del /Q "CompressedPackOne\*.*"


D:\7Zip\7z.exe a -mx9 index.html.gz index.html 
move  "index.html.gz" "CompressedFull\index.html.gz"

D:\7Zip\7z.exe a -mx9 indexpack.html.gz indexpack.html
move  "indexpack.html.gz" "CompressedPackOne\index.html.gz"
copy "indexpack.html" "CompressedPackOne\index.html"

D:\7Zip\7z.exe a -mx9 jquery.min.js.gz jquery.min.js
move  "jquery.min.js.gz" "CompressedFull\jquery.min.js.gz"
type  "jquery.min.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 jquery.dataTables.min.js.gz jquery.dataTables.min.js
move  "jquery.dataTables.min.js.gz" "CompressedFull\jquery.dataTables.min.js.gz"
type  "jquery.dataTables.min.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 dataTables.min.css.gz dataTables.min.css 
move  "dataTables.min.css.gz" "CompressedFull\dataTables.min.css.gz"
type  "dataTables.min.css" >> "CompressedPackOne\owlos.css"

D:\7Zip\7z.exe a -mx9 popper.min.js.gz popper.min.js 
move  "popper.min.js.gz" "CompressedFull\popper.min.js.gz"
type  "popper.min.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 bootstrap.min.css.gz bootstrap.min.css
move  "bootstrap.min.css.gz" "CompressedFull\bootstrap.min.css.gz"
type  "bootstrap.min.css" >> "CompressedPackOne\owlos.css"

D:\7Zip\7z.exe a -mx9 bootstrap.min.js.gz bootstrap.min.js 
move  "bootstrap.min.js.gz" "CompressedFull\bootstrap.min.js.gz"
type  "bootstrap.min.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 ui.css.gz ui.css 
move  "ui.css.gz" "CompressedFull\ui.css.gz"
type  "ui.css" >> "CompressedPackOne\owlos.css"

D:\7Zip\7z.exe a -mx9 dialoginputelement.js.gz dialoginputelement.js 
move  "dialoginputelement.js.gz" "CompressedFull\dialoginputelement.js.gz"
type  "dialoginputelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 buttonelement.js.gz buttonelement.js 
move  "buttonelement.js.gz" "CompressedFull\buttonelement.js.gz"
type  "buttonelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 dialogelement.js.gz dialogelement.js 
move  "dialogelement.js.gz" "CompressedFull\dialogelement.js.gz"
type  "dialogelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 dialoglabelelement.js.gz dialoglabelelement.js
move  "dialoglabelelement.js.gz" "CompressedFull\dialoglabelelement.js.gz"
type  "dialoglabelelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 dialoginputelement.js.gz dialoginputelement.js
move  "dialoginputelement.js.gz" "CompressedFull\dialoginputelement.js.gz"
type  "dialoginputelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 dialogprogressbarelement.js.gz dialogprogressbarelement.js
move  "dialogprogressbarelement.js.gz" "CompressedFull\dialogprogressbarelement.js.gz"
type  "dialogprogressbarelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 dialogselectelement.js.gz dialogselectelement.js
move  "dialogselectelement.js.gz" "CompressedFull\dialogselectelement.js.gz"
type  "dialogselectelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 sidebarelement.js.gz sidebarelement.js
move  "sidebarelement.js.gz" "CompressedFull\sidebarelement.js.gz"
type  "sidebarelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 valueeditorelement.js.gz valueeditorelement.js
move  "valueeditorelement.js.gz" "CompressedFull\valueeditorelement.js.gz"
type  "valueeditorelement.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 headerpanelui.js.gz headerpanelui.js 
move  "headerpanelui.js.gz" "CompressedFull\headerpanelui.js.gz"
type  "headerpanelui.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 scriptsui.js.gz scriptsui.js
move  "scriptsui.js.gz" "CompressedFull\scriptsui.js.gz"
type  "scriptsui.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 dashboardui.js.gz dashboardui.js 
move  "dashboardui.js.gz" "CompressedFull\dashboardui.js.gz"
type  "dashboardui.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 filespanelui.js.gz filespanelui.js 
move  "filespanelui.js.gz" "CompressedFull\filespanelui.js.gz"
type  "filespanelui.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 basewidget.js.gz basewidget.js 
move  "basewidget.js.gz" "CompressedFull\basewidget.js.gz"
type  "basewidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 lcdwidget.js.gz lcdwidget.js
move  "lcdwidget.js.gz" "CompressedFull\lcdwidget.js.gz"
type  "lcdwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 lightwidget.js.gz lightwidget.js
move  "lightwidget.js.gz" "CompressedFull\lightwidget.js.gz"
type  "lightwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 lcdwidget.js.gz lcdwidget.js
move  "lcdwidget.js.gz" "CompressedFull\lcdwidget.js.gz"
type  "lcdwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 lightwidget.js.gz lightwidget.js
move  "lightwidget.js.gz" "CompressedFull\lightwidget.js.gz"
type  "lightwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 motionwidget.js.gz motionwidget.js
move  "motionwidget.js.gz" "CompressedFull\motionwidget.js.gz"
type  "motionwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 settingsui.js.gz settingsui.js
move  "settingsui.js.gz" "CompressedFull\settingsui.js.gz"
type  "settingsui.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 radialwidget.js.gz radialwidget.js
move  "radialwidget.js.gz" "CompressedFull\radialwidget.js.gz"
type  "radialwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 smokewidget.js.gz smokewidget.js
move  "smokewidget.js.gz" "CompressedFull\smokewidget.js.gz"
type  "smokewidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 stepperwidget.js.gz stepperwidget.js
move  "stepperwidget.js.gz" "CompressedFull\stepperwidget.js.gz"
type  "stepperwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 temperaturewidget.js.gz temperaturewidget.js
move  "temperaturewidget.js.gz" "CompressedFull\temperaturewidget.js.gz"
type  "temperaturewidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 graphwidget.js.gz graphwidget.js
move  "graphwidget.js.gz" "CompressedFull\graphwidget.js.gz"
type  "graphwidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 tablewidget.js.gz tablewidget.js
move  "tablewidget.js.gz" "CompressedFull\tablewidget.js.gz"
type  "tablewidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 valuewidget.js.gz valuewidget.js
move  "valuewidget.js.gz" "CompressedFull\valuewidget.js.gz"
type  "valuewidget.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 actuatorwidget.js.gz actuatorwidget.js
move  "actuatorwidget.js.gz" "CompressedFull\actuatorwidget.js.gz"
type "actuatorwidget.js" >> "CompressedPackOne\owlos.js"


D:\7Zip\7z.exe a -mx9 restclientcore.js.gz restclientcore.js 
move  "restclientcore.js.gz" "CompressedFull\restclientcore.js.gz"
type  "restclientcore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 scriptscore.js.gz scriptscore.js
move  "scriptscore.js.gz" "CompressedFull\scriptscore.js.gz"
type  "scriptscore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 configcore.js.gz configcore.js
move  "configcore.js.gz" "CompressedFull\configcore.js.gz"
type  "configcore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 speechcore.js.gz speechcore.js
move  "speechcore.js.gz" "CompressedFull\speechcore.js.gz"
type  "speechcore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 driverscore.js.gz driverscore.js 
move  "driverscore.js.gz" "CompressedFull\driverscore.js.gz"
type  "driverscore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 driversui.js.gz driversui.js 
move  "driversui.js.gz" "CompressedFull\driversui.js.gz"
type  "driversui.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 drawcore.js.gz drawcore.js 
move  "drawcore.js.gz" "CompressedFull\drawcore.js.gz"
type  "drawcore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 languagescore.js.gz languagescore.js
move  "languagescore.js.gz" "CompressedFull\languagescore.js.gz"
type  "languagescore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 widgetswrappers.js.gz widgetswrappers.js 
move  "widgetswrappers.js.gz" "CompressedFull\widgetswrappers.js.gz"
type  "widgetswrappers.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 bootcore.js.gz bootcore.js 
move  "bootcore.js.gz" "CompressedFull\bootcore.js.gz"
type  "bootcore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 pinscore.js.gz pinscore.js 
move  "pinscore.js.gz" "CompressedFull\pinscore.js.gz"
type  "pinscore.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 index.js.gz index.js 
move  "index.js.gz" "CompressedFull\index.js.gz"
type  "index.js" >> "CompressedPackOne\owlos.js"

D:\7Zip\7z.exe a -mx9 index.js.gz index.js 
move  "index.js.gz" "CompressedFull\index.js.gz"
type  "index.js" >> "CompressedPackOne\owlos.js"

CD "CompressedPackOne"
D:\7Zip\7z.exe a -mx9 owlos.js.gz owlos.js 
D:\7Zip\7z.exe a -mx9 owlos.css.gz owlos.css 


REM copy  "updateinfo.html" "updateinfo.html"

CD ..