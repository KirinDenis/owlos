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

#include "WebProperties.h"
#ifdef USE_ESP_DRIVER

#include "../drivers/ESPDriver.h"
#include "../services/FileService.h"

#define id "webproperties"

String webGetWebConfig()
{
	String result = "";
	if (filesExists("web.config"))
	{
		result = filesReadString("web.config");
	}

#ifdef DETAILED_DEBUG 
	#ifdef DEBUG
debugOut(id, "config=" + result);
#endif
#endif
	return result;
}

bool webSetHead(String _webConfig)
{
#ifdef DETAILED_DEBUG 
	#ifdef DEBUG
debugOut(id, "|<- inside change config=" + _webConfig);
#endif
#endif
	filesWriteString("web.temp", _webConfig);
	return true;
}

bool webSetBody(String _webConfig)
{
#ifdef DETAILED_DEBUG 
	#ifdef DEBUG
debugOut(id, "|<- inside change config=" + _webConfig);
#endif
#endif
	filesAddString("web.temp", _webConfig);
	return true;
}

bool webSetTail(String _webConfig)
{
#ifdef DETAILED_DEBUG 
	#ifdef DEBUG
debugOut(id, "|<- inside change config=" + _webConfig);
#endif
#endif
	filesRename("web.config", "oldweb.config");
	if (filesAddString("web.temp", _webConfig))
	{
		filesRename("web.temp", "web.config");
	}
	return true;
}

String webGetAllProperties()
{
	String result = "config=" + webGetWebConfig() + "//\n";
	return result;
}

String webOnMessage(String _topic, String _payload)
{
	String result = WRONG_PROPERTY_NAME;
	if (String(nodeGetTopic() + "/getconfig").equals(_topic)) return webGetWebConfig();
	else
		if (String(nodeGetTopic() + "/sethead").equals(_topic)) return String(webSetHead(_payload));
		else
			if (String(nodeGetTopic() + "/setbody").equals(_topic)) return String(webSetBody(_payload));
			else
				if (String(nodeGetTopic() + "/settail").equals(_topic)) return String(webSetTail(_payload));

	return result;
}

#endif
