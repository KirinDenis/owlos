REM 
REM The integrated web server OWL OS supports .GZ archiving to reduce traffic.
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

D:\7Zip\7z.exe a -mx9 actuatorindicator.js.gz actuatorindicator.js
D:\7Zip\7z.exe a -mx9 baseindicator.js.gz baseindicator.js 
D:\7Zip\7z.exe a -mx9 bootcore.js.gz bootcore.js 
D:\7Zip\7z.exe a -mx9 bootstrap.min.css.gz bootstrap.min.css
D:\7Zip\7z.exe a -mx9 bootstrap.min.js.gz bootstrap.min.js 
D:\7Zip\7z.exe a -mx9 restclientcore.js.gz restclientcore.js 
D:\7Zip\7z.exe a -mx9 ui.css.gz ui.css 
D:\7Zip\7z.exe a -mx9 dataTables.min.css.gz dataTables.min.css 
D:\7Zip\7z.exe a -mx9 dataTables.min.js.gz dataTables.min.js 
D:\7Zip\7z.exe a -mx9 indicatorswrappers.js.gz indicatorswrappers.js 
D:\7Zip\7z.exe a -mx9 devicescore.js.gz devicescore.js 
D:\7Zip\7z.exe a -mx9 drawcore.js.gz drawcore.js 
D:\7Zip\7z.exe a -mx9 filespanelui.js.gz filespanelui.js 
D:\7Zip\7z.exe a -mx9 index.html.gz index.html 
D:\7Zip\7z.exe a -mx9 index.js.gz index.js 
D:\7Zip\7z.exe a -mx9 jquery.dataTables.min.js.gz jquery.dataTables.min.js
D:\7Zip\7z.exe a -mx9 jquery.min.js.gz jquery.min.js
D:\7Zip\7z.exe a -mx9 languagescore.js.gz languagescore.js
D:\7Zip\7z.exe a -mx9 lcdindicator.js.gz lcdindicator.js
D:\7Zip\7z.exe a -mx9 lightindicator.js.gz lightindicator.js
D:\7Zip\7z.exe a -mx9 lcdindicator.js.gz lcdindicator.js
D:\7Zip\7z.exe a -mx9 lightindicator.js.gz lightindicator.js
D:\7Zip\7z.exe a -mx9 motionindicator.js.gz motionindicator.js
D:\7Zip\7z.exe a -mx9 settingsui.js.gz settingsui.js
D:\7Zip\7z.exe a -mx9 popper.min.js.gz popper.min.js
D:\7Zip\7z.exe a -mx9 radialindicator.js.gz radialindicator.js
D:\7Zip\7z.exe a -mx9 smokeindicator.js.gz smokeindicator.js
D:\7Zip\7z.exe a -mx9 speechcore.js.gz speechcore.js
D:\7Zip\7z.exe a -mx9 stepperindicator.js.gz stepperindicator.js
D:\7Zip\7z.exe a -mx9 temperatureindicator.js.gz temperatureindicator.js
D:\7Zip\7z.exe a -mx9 graphindicator.js.gz graphindicator.js
D:\7Zip\7z.exe a -mx9 configcore.js.gz configcore.js
D:\7Zip\7z.exe a -mx9 tableindicator.js.gz tableindicator.js
