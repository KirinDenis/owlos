#include "config.h"
#include "UnitProperties.h"
#include "src\Managers\FileManager.h"

#define id "webproperties"

bool webSetWebConfig(String _webConfig)
{
	debugOut(id, "|<- inside change webconfig=" + _webConfig);
	filesWriteString("web.webconfig", _webConfig);
	return true;
}

String webGetWebConfig()
{
	String result = "";
	if (filesExists("web.webconfig"))
	{
		result = filesReadString("web.webconfig");
	}
	else
	{
		webSetWebConfig(result);
	}

	debugOut(id, "webconfig=" + result);
	return result;
}


String webGetAllProperties()
{
	String result = "webconfig=" + webGetWebConfig() + "//\n";
	return result;
}

String webOnMessage(String _topic, String _payload)
{
	debugOut(id, "WEBPROP" + _topic);
	debugOut(id, "WEBPROP" + _payload);
	String result = WrongPropertyName;
	if (String(unitGetTopic() + "/getwebconfig").equals(_topic)) return webGetWebConfig();
	else
		if (String(unitGetTopic() + "/setwebconfig").equals(_topic)) return String(webSetWebConfig(_payload));
	return result;
}


