#include "config.h"
#include "UnitProperties.h"
#include "src\Managers\FileManager.h"

#define id "webproperties"

String webGetWebConfig()
{
	String result = "";
	if (filesExists("web.config"))
	{
		result = filesReadString("web.config");
	}

	debugOut(id, "config=" + result);
	return result;
}

bool webSetHead(String _webConfig)
{
	debugOut(id, "|<- inside change config=" + _webConfig);
	filesWriteString("web.temp", _webConfig);
	return true;
}

bool webSetBody(String _webConfig)
{
	debugOut(id, "|<- inside change config=" + _webConfig);
	filesAddString("web.temp", _webConfig);	
	return true;
}

bool webSetTail(String _webConfig)
{
	debugOut(id, "|<- inside change config=" + _webConfig);
	filesAddString("web.temp", _webConfig);
	filesRename("web.temp", "web.config");
	return true;
}


String webGetAllProperties()
{
	String result = "config=" + webGetWebConfig() + "//\n";
	return result;
}

String webOnMessage(String _topic, String _payload)
{
	String result = WrongPropertyName;
	if (String(unitGetTopic() + "/getconfig").equals(_topic)) return webGetWebConfig();
	else
		if (String(unitGetTopic() + "/sethead").equals(_topic)) return String(webSetHead(_payload));
		else
			if (String(unitGetTopic() + "/setbody").equals(_topic)) return String(webSetBody(_payload));
			else
				if (String(unitGetTopic() + "/settail").equals(_topic)) return String(webSetTail(_payload));

	return result;
}


