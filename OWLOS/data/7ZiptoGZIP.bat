REM 
REM The integrated web server OWLOS supports .GZ archiving to reduce traffic.
REM If the Web server does not find the corresponding .GZ file, it searches for the uncompressed file, otherwise
REM issues HTTP Code 404.
REM 
REM Examples:
REM 
REM 1)
REM The files exists: bootcore.js.gz and bootcore.js
REM HTTP client query bootcore.js - web server return bootcore.js.gz
REM 
REM 2)
REM The file exist: bootcore.js.gz 
REM HTTP client query bootcore.js - web server return bootcore.js.gz
REM 
REM 3)
REM The file exist: bootcore.js
REM HTTP client query bootcore.js - web server return bootcore.js
REM 
REM 4)
REM No one file exist
REM HTTP client query bootcore.js - web server return HTTP Code 404
REM 
REM NOTE: We provide the .BAT file for faster repack UI content. Use 7Zip util and settup 
REM Path from "D:\7Zip\7z.exe" to your native 

D:\7Zip\7z.exe a -mx9 actuatorwidget.js.gz actuatorwidget.js
D:\7Zip\7z.exe a -mx9 basewidget.js.gz basewidget.js 
D:\7Zip\7z.exe a -mx9 bootcore.js.gz bootcore.js 
D:\7Zip\7z.exe a -mx9 bootstrap.min.css.gz bootstrap.min.css
D:\7Zip\7z.exe a -mx9 bootstrap.min.js.gz bootstrap.min.js 
D:\7Zip\7z.exe a -mx9 restclientcore.js.gz restclientcore.js 
D:\7Zip\7z.exe a -mx9 ui.css.gz ui.css 
D:\7Zip\7z.exe a -mx9 dataTables.min.css.gz dataTables.min.css 
D:\7Zip\7z.exe a -mx9 dataTables.min.js.gz dataTables.min.js 
D:\7Zip\7z.exe a -mx9 dashboardui.js.gz dashboardui.js 
D:\7Zip\7z.exe a -mx9 widgetswrappers.js.gz widgetswrappers.js 
D:\7Zip\7z.exe a -mx9 driverscore.js.gz driverscore.js 
D:\7Zip\7z.exe a -mx9 driversui.js.gz driversui.js 
D:\7Zip\7z.exe a -mx9 drawcore.js.gz drawcore.js 
D:\7Zip\7z.exe a -mx9 filespanelui.js.gz filespanelui.js 
D:\7Zip\7z.exe a -mx9 index.html.gz index.html 
D:\7Zip\7z.exe a -mx9 index.js.gz index.js 
D:\7Zip\7z.exe a -mx9 jquery.dataTables.min.js.gz jquery.dataTables.min.js
D:\7Zip\7z.exe a -mx9 jquery.min.js.gz jquery.min.js
D:\7Zip\7z.exe a -mx9 languagescore.js.gz languagescore.js
D:\7Zip\7z.exe a -mx9 lcdwidget.js.gz lcdwidget.js
D:\7Zip\7z.exe a -mx9 lightwidget.js.gz lightwidget.js
D:\7Zip\7z.exe a -mx9 lcdwidget.js.gz lcdwidget.js
D:\7Zip\7z.exe a -mx9 lightwidget.js.gz lightwidget.js
D:\7Zip\7z.exe a -mx9 motionwidget.js.gz motionwidget.js
D:\7Zip\7z.exe a -mx9 settingsui.js.gz settingsui.js
D:\7Zip\7z.exe a -mx9 radialwidget.js.gz radialwidget.js
D:\7Zip\7z.exe a -mx9 smokewidget.js.gz smokewidget.js
D:\7Zip\7z.exe a -mx9 speechcore.js.gz speechcore.js
D:\7Zip\7z.exe a -mx9 stepperwidget.js.gz stepperwidget.js
D:\7Zip\7z.exe a -mx9 temperaturewidget.js.gz temperaturewidget.js
D:\7Zip\7z.exe a -mx9 valuewidget.js.gz valuewidget.js
D:\7Zip\7z.exe a -mx9 graphwidget.js.gz graphwidget.js
D:\7Zip\7z.exe a -mx9 configcore.js.gz configcore.js
D:\7Zip\7z.exe a -mx9 tablewidget.js.gz tablewidget.js
D:\7Zip\7z.exe a -mx9 scriptcore.js.gz scriptcore.js
