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

#include "..\..\Kernel.h"

String decode(String param)
{
	param.replace("+", " ");
	param.replace("%20", " ");
	param.replace("%21", "!");
	param.replace("%23", "#");
	param.replace("%24", "$");
	param.replace("%26", "&");
	param.replace("%27", "'");
	param.replace("%28", "(");
	param.replace("%29", ")");
	param.replace("%2A", "*");
	param.replace("%2B", "+");
	param.replace("%2C", ",");
	param.replace("%2F", "/");
	param.replace("%3A", ":");
	param.replace("%3B", ";");
	param.replace("%3D", "=");
	param.replace("%3F", "?");
	param.replace("%40", "@");
	param.replace("%5B", "[");
	param.replace("%5D", "]");
	param.replace("%3E", ">");
	param.replace("%3C", "<");
	param.replace("%0A", "\n");
	param.replace("%0D", "\n");
	param.replace("%09", "\t");

	param.replace("%25+", " ");
	param.replace("%2520", " ");
	param.replace("%2521", "!");
	param.replace("%2523", "#");
	param.replace("%2524", "$");
	param.replace("%2526", "&");
	param.replace("%2527", "'");
	param.replace("%2528", "(");
	param.replace("%2529", ")");
	param.replace("%252A", "*");
	param.replace("%252B", "+");
	param.replace("%252C", ",");
	param.replace("%252F", "/");
	param.replace("%253A", ":");
	param.replace("%253B", ";");
	param.replace("%253D", "=");
	param.replace("%253F", "?");
	param.replace("%2540", "@");
	param.replace("%255B", "[");
	param.replace("%255D", "]");
	param.replace("%253E", ">");
	param.replace("%253C", "<");
	param.replace("%250A", "\n");
	param.replace("%250D", "\n");
	param.replace("%2509", "\t");

	return param;
}

String getContentType(String fileName)
{
	if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return "text/html";
	if (fileName.endsWith(".css")) return "text/css";
	if (fileName.endsWith(".js")) return "application/javascript";
	if (fileName.endsWith(".ico")) return "image/x-icon";
	if (fileName.endsWith(".gz")) return "application/x-gzip";
	return "text/plain";
}

String GetLogoHTML()
{
	String result = "<font size='1'><pre><code><span>";
	result += "                                         \n";
	result += "@@@@@@@@#                       #@@@@@@@@\n";
	result += "@@@@@@@@@@@@@/             ,@@@@@@@@@@@@@\n";
	result += "@@@@@@@@@&(@@@@@@@.   .@@@@@@@(%@@@@@@@@@\n";
	result += "@@@@@  .@@@/  ,@@@@@@@@@@@*  .@@@,  %@@@@\n";
	result += "&@@@@@@,   .@@&    *@#    %@@*   ,@@@@@@@\n";
	result += "%@@ @@@@@&     %@@     @@%     %@@@@@ @@&\n";
	result += "(@@  @@%.@@@       @@@.      @@@,#@@% @@#\n";
	result += ",@@, @@@ &@@@@             (@@@@ &@@  @@*\n";
	result += " @@(  @@  @@@@@           @@@@@  @@#  @@.\n";
	result += " @@&  @@(   @@@@@       @@@@@,  /@@  .@@ \n";
	result += " @@@    &@@@. @@@@@,  @@@@@. &@@@    @@@ \n";
	result += " ,@@@@@*  .@@@@@@@@@@@@@@@@@@@/  .@@@@@/ \n";
	result += "     &@@@@@, #@@@@@@.@@@@@@@  @@@@@@     \n";
	result += "        #@@@@@@@&       %@@@@@@@%        \n";
	result += "          ,@@@@@@@   @@@@@@@(            \n";
	result += "             .@@@@@@@@@@@.               \n";
	result += "                 /@@@/                   \n";
	result += "                                         \n";
	result += "</code></pre></span></font><br>";
	return result;
}

String GetNotFoundHTML()
{

	String helloString = unitGetUnitId() + "::Ready IoT Solution::OWLOS";
	String acip = unitGetWiFiAccessPointIP() + ":" + String(unitGetRESTfulServerPort());
	String ip = unitGetWiFiIP() + ":" + String(unitGetRESTfulServerPort());

	String message = "<html><header><title>" + helloString + "</title>";
	message += "<style>a{color: #00DC00;text-decoration: none;} a:hover {text-decoration: underline;} a:active {text-decoration: underline;}}</style></header>";
	message += "<body  bgcolor='#4D4D4D'><font color='#A5A5A5'>" + GetLogoHTML() + "<h3>" + helloString + "</h3>";	
	message += "Method: ";
	//message += (webServer->method() == HTTP_GET) ? "GET" : "POST";
	message += "<br>Arguments: ";
	//message += argsCount;
	message += "<br>";
	message += "<font color='#208ECD'><h3>Available RESTful APIs for local network " + unitGetWiFiSSID() + ":</h3></font>";
	message += "<b>Log's API:</b><br>";
	message += "<a href='http://" + ip + "/getlog?number=1' target='_blank'>http://" + ip + "/getlog?number=1</a> get first log file<br>";
	message += "<a href='http://" + ip + "/getlog?number=2' target='_blank'>http://" + ip + "/getlog?number=2</a> get second log file<br>";
	message += "<br><b>File's API:</b><br>";
	message += "<a href='http://" + ip + "/getfilelist?path=' target='_blank'>http://" + ip + "/getfilelist?path=</a> get list of unit files<br>";
	message += "<a href='http://" + ip + "/deletefile?name=' target='_blank'>http://" + ip + "/deletefile?path=</a> delete file<br>";

	message += "<a href='http://" + ip + "/upload' target='_blank'>http://" + ip + "/upload</a> upload file WebForm (not API, use uploadfile POST request to upload file)<br>";
	message += "<br><b>Unit's API:</b><br>";
	message += "<a href='http://" + ip + "/getunitproperty?property=id' target='_blank'>http://" + ip + "/getproperty?property=id</a> get unit property<br>";
	message += "<a href='http://" + ip + "/getallunitproperties' target='_blank'>http://" + ip + "/getallunitproperties</a> get all unit's properties<br>";
	message += "<a href='http://" + ip + "/setunitproperty?property=foo&value=bar' target='_blank'>http://" + ip + "/setproperty?property=foo&value=bar</a> set unit property<br>";
	message += "<font color='red'><b>Be careful, changing the unit's properties can do its unmanagement</b></font><br>";
	message += "The unit must be rebooted after changing the property value<br>";
	message += "<br><b>Driver's API:</b><br>";
	message += "<a href='http://" + ip + "/adddriver?type=foo&id=bar&pin1=foo&pin2=foo&pin3=foo&pin4=foo' target='_blank'>http://" + ip + "/adddriver?type=foo&id=bar&pin1=foo&pin2=foo&pin3=foo&pin4=foo</a> add new driver<br>";
	message += "<a href='http://" + ip + "/getdriversid' target='_blank'>http://" + ip + "/getdriversid</a> get all drivers IDs<br>";
	message += "<a href='http://" + ip + "/getdriverproperty?id=foo&property=bar' target='_blank'>http://" + ip + "/getdriverproperty?id=foo&property=bar</a> get driver property<br>";
	message += "<a href='http://" + ip + "/setdriverproperty?id=foo&property=bar&value=bar' target='_blank'>http://" + ip + "/setdriverproperty?id=foo&property=bar&value=bar</a> set driver property<br>";
	message += "<a href='http://" + ip + "/getdriverproperties?id=foo' target='_blank'>http://" + ip + "/getdriverproperties?id=foo</a> get driver's all properties<br>";
	message += "<a href='http://" + ip + "/getalldriversproperties' target='_blank'>http://" + ip + "/getalldriversproperties</a> get all drivers all properties<br>";
	message += "<a href='http://" + ip + "/reset' target='_blank'>http://" + ip + "/reset</a> reset unit<br>";

	message += "<font color='#208ECD'><h3>Available RESTful APIs for access point " + unitGetWiFiAccessPointSSID() + ":</h3></font>";
	message += "<b>Log's API:</b><br>";
	message += "<a href='http://" + acip + "/getlog?number=1' target='_blank'>http://" + acip + "/getlog?number=1</a> get first log file<br>";
	message += "<a href='http://" + acip + "/getlog?number=2' target='_blank'>http://" + acip + "/getlog?number=2</a> get second log file<br>";
	message += "<br><b>Unit's API:</b><br>";
	message += "<a href='http://" + acip + "/getunitproperty?property=id' target='_blank'>http://" + acip + "/getproperty?property=id</a> get unit property<br>";
	message += "<a href='http://" + acip + "/getallunitproperties' target='_blank'>http://" + acip + "/getallunitproperties</a> get all unit's properties<br>";
	message += "<a href='http://" + acip + "/setunitproperty?property=foo&value=bar' target='_blank'>http://" + acip + "/setproperty?property=foo&value=bar</a> set unit property<br>";
	message += "<font color='red'><b>Be careful, changing the unit's properties can do its unmanagement</b></font><br>";
	message += "The unit must be rebooted after changing the property value<br>";
	message += "<br><b>Driver's API:</b><br>";
	message += "<a href='http://" + acip + "/getdriversid' target='_blank'>http://" + acip + "/getdriversid</a> get all drivers IDs<br>";
	message += "<a href='http://" + acip + "/getdriverproperty?id=foo&property=bar' target='_blank'>http://" + acip + "/getdriverproperty?id=foo&property=bar</a> get driver property<br>";
	message += "<a href='http://" + acip + "/setdriverproperty?id=foo&property=bar&value=bar' target='_blank'>http://" + acip + "/setdriverproperty?id=foo&property=bar&value=bar</a> set driver property<br>";
	message += "<a href='http://" + acip + "/getdriverproperties?id=foo' target='_blank'>http://" + acip + "/getdriverproperties?id=foo</a> get driver's all properties<br>";
	message += "<a href='http://" + acip + "/getalldriversproperties' target='_blank'>http://" + acip + "/getalldriversproperties</a> get all drivers all properties<br>";


	message += "</font></body></html>";
	return message;
}