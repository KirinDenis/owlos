function createScript(_nodehost) {
    return {
        nodehost: _nodehost,
        name: "",
        status: "",
        bytecode: "",
        codecount: 0,
        datacount: 0,
        timequant: 0
    };
}

var scriptsManager = {
    scripts: [],

    _onnew: [],
    doOnNew: function (script) {
        for (var key in scriptsManager._onnew) {
            scriptsManager._onnew[key](script);
        }
    },

    set onNew(onnew) {
        scriptsManager._onnew.push(onnew);
    },

    _onchange: [],
    doOnChange: function (script) {
        for (var key in scriptsManager._onchange) {
            scriptsManager._onchange[key](script);
        }
    },

    set onChange(onchange) {
        scriptsManager._onchange.push(onchange);
    },


    refresh: function (node) {
        node.networkStatus = NET_REFRESH;
        // асинхронный HTTP запрос
        // this.refreshResult - метод который будет вызван HTTPClient-ом по окончанию асинхронного запроса
        // this - ссылка на экземпляр этого объекта        
        httpGetAsyncWithReciever(node.host + "getallscripts", scriptsManager.refreshResult, node);
    },

    //вызывается асинхронным HTTPClient по окончанию запроса, указан как параметр в httpGetAsyncWithReciever, смотрите this.refresh()
    //httpResult - результат запроса
    //asyncReciever - ссылка на объект сделавший запрос (этот метод будет вызван в контексте другого потока, для него this. это другой объект - занимательный мир JS)
    //мы не можем использовать this, для обращения к методам этого объекта, поэтому заведомо передали себе ссылку на себя "asyncReciever"
    refreshResult: function (httpResult, node) {
        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произошел TimeOut
        if (!httpResult.indexOf("%error") == 0) {
            node.networkStatus = NET_ONLINE;
            scriptsManager.parseScripts(httpResult, node);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (httpResult.indexOf("reponse") != -1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            
        }
    },

    getScript: function (nodehost, name) {
        for (var scriptKey in scriptsManager.scripts) {
            if ((scriptsManager.scripts[scriptKey].nodehost === nodehost) && (scriptsManager.scripts[scriptKey].name === name)) {
                return scriptsManager.scripts[scriptKey];
            }
        }
        return undefined;
    },

    createOrReplace: function (script) {
        httpPostAsyncWithErrorReson(script.nodehost + "createscript", "?name=" + escape(script.name), escape(script.bytecode));
    },

    pushScript: function (script) {
        var existScript = scriptsManager.getScript(script.nodehost, script.name);
        if (existScript != undefined) { 
            existScript = script;
            this.doOnChange(script);
        }
        else {
            scriptsManager.scripts.push(script); //TODO onNew event 
            this.doOnNew(script);            
        }
    },

    parseScripts: function (httpResult, node) {
        var recievedScripts = httpResult.split("\r");

        if (recievedScripts !== "") {//если первичный парсинг удался

            var script = undefined;

            for (var i = 0; i < recievedScripts.length; i++) {//перечисляем все строки в HTTPResult 
                if (recievedScripts[i] === "") continue; //если строка пуста, берем следующею

                if (recievedScripts[i].indexOf("script:") == 0) { //если заголовок устройства найден                    
                    //add previos 
                    if (script != undefined) {
                        scriptsManager.pushScript(script);
                    }

                    script = createScript(node.host);
                    script.name = recievedScripts[i].split(":")[1];
                }
                else {
                    if (script == undefined) continue;

                    var splitterPos = recievedScripts[i].indexOf("=");
                    if (splitterPos != -1) {
                        var key = recievedScripts[i].slice(0, splitterPos);
                        var value = recievedScripts[i].slice(splitterPos + 1, recievedScripts[i].lenght);
                        if (script[key] != undefined) {
                            script[key] = value;
                        }
                    }
                }
            }
            if (script != undefined) {
                scriptsManager.pushScript(script);
            }
        }

    }

}