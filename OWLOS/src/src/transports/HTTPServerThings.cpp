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

#include "../drivers/ESPDriver.h"

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
	if (fileName.endsWith(".html") || fileName.endsWith(".htm"))
		return "text/html";
	if (fileName.endsWith(".css"))
		return "text/css";
	if (fileName.endsWith(".js"))
		return "application/javascript";
	if (fileName.endsWith(".ico"))
		return "image/x-icon";
	if (fileName.endsWith(".gz"))
		return "application/x-gzip";
	return "text/plain";
}

String GetLogoHTML()
{

	String result = "<font color='#62add0' size='2'><pre><code><span>";
	result += "                                         \n";
	result += "000000001                       100000000\n";
	result += "0000000000000               0000000000000\n";
	result += "000000000010000000     000000010000000000\n";
	result += "00000  10001  1000000000001  10001  10000\n";
	result += " 0000001   1001    101    0001   1000000 \n";
	result += " 00 000001     100     001     100000 00 \n";
	result += " 00  000 000       0001      000  00  00 \n";
	result += " 00  000  0000              0000  00  00 \n";
	result += " 00   00  00000           00000  00   00 \n";
	result += " 00&  00    00000       00000    00  100 \n";
	result += " 000     000  00000  00000  000     000 \n";
	result += "  000001  100000000000000000001  10000  \n";
	result += "      000001 0000000 0000000  000000     \n";
	result += "         00000000       00000000         \n";
	result += "           0000000   0000000             \n";
	result += "              00000000000                \n";
	result += "                  000                    \n";
	result += "                                         \n";
	result += "</span></code></pre></font><br>";
	return result;
}

String GetNotFoundHTML()
{

	String helloString = FIRMWARE_VERSION; //nodeGetUnitId()
	String acip = nodeGetWiFiAccessPointIP() + ":" + String(nodeGetRESTfulServerPort());
	String ip = nodeGetWiFiIP() + ":" + String(nodeGetRESTfulServerPort());

	String message = "<html><header><title>" + helloString + "</title>";
	message += "<style>a{color: #3b99c4;text-decoration: none;} a:hover {text-decoration: underline;} a:active {text-decoration: underline;}table td, table td * {vertical-align: top;}</style></header>";
	message += "<body  bgcolor='#272B30'><font color='#272B30'><table><tr><td>" +
			   message += GetLogoHTML();
	message += "</td><td><pre><code><span><font color='#89c2dc' size=4><br>";
	message += "&#x1F989;<b>" + helloString + "</b>\n";
	message += "&#x1F30D;<a href='https://github.com/KirinDenis/owlos' target='_blank'>GitHub OWLOS</a><br>\n";
	message += "&#x1F409;Copyright 2019, 2020 by:\n";
	message += "	Serhii Lehkii (sergey@light.kiev.ua)\n";
	message += "	Konstantin Brul (konstabrul@gmail.com)\n";
	message += "	Vitalii Glushchenko (cehoweek@gmail.com)\n";
	message += "	Stanislav Kvashchuk (skat@ukr.net)\n";
	message += "	Vladimir Kovalevich (covalevich@gmail.com)\n";
	message += "	Denys Melnychuk (meldenvar@gmail.com)\n";
	message += "	Denis Kirin (deniskirinacs@gmail.com)\n<br>";
	message += "&#x1F4E1;RESTful API endpoints:\n";
	message += "	for Palata#13 <a href='http://" + ip + "/getallnodeproperties' target='_blank'>http://" + ip + "/</a>\n";
	message += "	for owlnodef9ab6224 <a href='http://" + acip + "/getallnodeproperties' target='_blank'>http://" + acip + "/</a>\n";
	message += "</span></code></pre>";
	message += "</font>";
	message += "</td>";
	message += "</tr> ";
	message += "</table></body>";

	return message;
}