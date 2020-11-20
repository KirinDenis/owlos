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
#include "HTTPServerThings.h"

#if defined(USE_HTTPS_SERVER) || defined(USE_HTTP_SERVER)

#ifdef USE_ESP_DRIVER

#include "../drivers/ESPDriver.h"

String decode(String param)
{
	param.replace(F("+"), F(" "));
	param.replace(F("%20"), F(" "));
	param.replace(F("%21"), F("!"));
	param.replace(F("%23"), F("#"));
	param.replace(F("%24"), F("$"));
	param.replace(F("%26"), F("&"));
	param.replace(F("%27"), F("'"));
	param.replace(F("%28"), F("(F("));
	param.replace(F("%29"), F(")"));
	param.replace(F("%2A"), F("*"));
	param.replace(F("%2B"), F("+"));
	param.replace(F("%2C"), F(","));
	param.replace(F("%2F"), F("/"));
	param.replace(F("%3A"), F(":"));
	param.replace(F("%3B"), F(";"));
	param.replace(F("%3D"), F("="));
	param.replace(F("%3F"), F("?"));
	param.replace(F("%40"), F("@"));
	param.replace(F("%5B"), F("["));
	param.replace(F("%5D"), F("]"));
	param.replace(F("%3E"), F(">"));
	param.replace(F("%3C"), F("<"));
	param.replace(F("%0A"), F("\n"));
	param.replace(F("%0D"), F("\n"));
	param.replace(F("%09"), F("\t"));

	param.replace(F("%25+"), F(" "));
	param.replace(F("%2520"), F(" "));
	param.replace(F("%2521"), F("!"));
	param.replace(F("%2523"), F("#"));
	param.replace(F("%2524"), F("$"));
	param.replace(F("%2526"), F("&"));
	param.replace(F("%2527"), F("'"));
	param.replace(F("%2528"), F("("));
	param.replace(F("%2529"), F(")"));
	param.replace(F("%252A"), F("*"));
	param.replace(F("%252B"), F("+"));
	param.replace(F("%252C"), F(","));
	param.replace(F("%252F"), F("/"));
	param.replace(F("%253A"), F(":"));
	param.replace(F("%253B"), F(";"));
	param.replace(F("%253D"), F("="));
	param.replace(F("%253F"), F("?"));
	param.replace(F("%2540"), F("@"));
	param.replace(F("%255B"), F("["));
	param.replace(F("%255D"), F("]"));
	param.replace(F("%253E"), F(">"));
	param.replace(F("%253C"), F("<"));
	param.replace(F("%250A"), F("\n"));
	param.replace(F("%250D"), F("\n"));
	param.replace(F("%2509"), F("\t"));

	return param;
}

String getContentType(String fileName)
{
	if (fileName.endsWith(F(".html")) || fileName.endsWith(F(".htm")))
		return F("text/html");
	if (fileName.endsWith(F(".css")))
		return F("text/css");
	if (fileName.endsWith(F(".js")))
		return F("application/javascript");
	if (fileName.endsWith(F(".ico")))
		return F("image/x-icon");
	if (fileName.endsWith(F(".gz")))
		return F("application/x-gzip");
	return F("text/plain");
}

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

static const char OWLOSCopyLeft[] PROGMEM = "&#x1F30D;<a href='https://github.com/KirinDenis/owlos' target='_blank'>GitHub OWLOS</a><br>\n"
											"&#x1F409;Copyright 2019, 2020 by:\n"
											"	Serhii Lehkii (sergey@light.kiev.ua)\n"
											"	Konstantin Brul (konstabrul@gmail.com)\n"
											"	Vitalii Glushchenko (cehoweek@gmail.com)\n"
											"	Stanislav Kvashchuk (skat@ukr.net)\n"
											"	Vladimir Kovalevich (covalevich@gmail.com)\n"
											"	Denys Melnychuk (meldenvar@gmail.com)\n"
											"	Denis Kirin (deniskirinacs@gmail.com)\n<br>"
											"&#x1F4E1;HTTPServer API endpoints:\n";

String GetNotFoundHTML()
{

	return "<html><header><title>" + String(FIRMWARE_VERSION) + FPSTR("</title>"
																	  "<style>a{color: #3b99c4;text-decoration: none;} a:hover {text-decoration: underline;} a:active {text-decoration: underline;}table td, table td * {vertical-align: top;}</style></header>"
																	  "<body  bgcolor='#272B30'><font color='#272B30'><table><tr><td>") +
		   OWLOSLogo + "</td><td><pre><code><span><font color='#89c2dc' size=4><br>&#x1F989;<b>" +
		   FIRMWARE_VERSION + "</b>\n" + OWLOSCopyLeft + "</span></code></pre></font></td></tr></table></body>";
}
#endif
#endif