#include "config.h"
#include "UnitProperties.h"
#include "src\Managers\FileManager.h"

#define id "webproperties"

bool webSetWebConfig(String _webConfig)
{
	debugOut(id, "|<- inside change config=" + _webConfig);
	filesWriteString("web.config", _webConfig);
	return true;
}

String webGetWebConfig()
{
	String result = "";
	if (filesExists("web.config"))
	{
		result = filesReadString("web.config");
	}
	else
	{
		webSetWebConfig(result);
	}

	debugOut(id, "config=" + result);
	return result;
}


String webGetAllProperties()
{
	String result = "config=" + webGetWebConfig() + "//\n";
	return result;
}

String webOnMessage(String _topic, String _payload)
{
	debugOut(id, "WEBPROP" + _topic);
	debugOut(id, "WEBPROP" + _payload);
	String result = WrongPropertyName;
	if (String(unitGetTopic() + "/getconfig").equals(_topic)) return webGetWebConfig();
	else
		if (String(unitGetTopic() + "/setconfig").equals(_topic)) return String(webSetWebConfig(_payload));
	return result;
}


