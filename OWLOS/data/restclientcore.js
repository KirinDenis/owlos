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

//var boardhost = "http://81.95.178.177:8084/"; //DEBUG
var boardhost = "http://192.168.1.7:8084/"; //DEBUG as WiFi Access Point
//var boardhost = ""; //UI loading from ESPxxxx


function getUnitProperty(host, property) {
    return httpGetWithErrorReson(host + "getnodeproperty?property=" + escape(property));
}

function setUnitProperty(host, property, value) {
    return httpGetWithErrorReson(host + "setnodeproperty?property=" + escape(property) + "&value=" + escape(value));
}

function setDriverProperty(host, id, property, value) {
    return httpGetWithErrorReson(host + "setdriverproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value));
}

function setDriverPropertyAsync(host, id, property, value) {
    return httpGetAsync(host + "setdriverproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value));
}

function setDriverPropertyAsyncWithReciever(host, id, property, value, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "setdriverproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value), asyncReciever, upperAsyncReciever, sender, upperSender);
}

function getDriverProperty(host, id, property) {
    return httpGetWithErrorReson(host + "getdriverproperty?id=" + id + "&property=" + escape(property));
}

function getDriverPropertyAsyncWithReciever(host, id, property, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "getdriverproperty?id=" + id + "&property=" + escape(property), asyncReciever, upperAsyncReciever, sender, upperSender);
}


function deleteFile(host, name) {
    return httpGet(host + "deletefile?name=" + name);
}

function deleteScriptAsync(host, name, asyncReciever, sender) {
    return httpGetAsyncWithReciever(host + "deletescript?name=" + name, asyncReciever, sender);
}


function reset(host) {
    return httpGetAsync(host + "reset");
}

function addDriver(host, apiParams) {

    
    return httpGetWithErrorReson(host + "adddriver?" + apiParams);
}

function updateUIAsync(host) {
    return httpGetAsync(host + "updateui");
}

function updateFirmwareAsync(host) {
    return httpGetAsync(host + "updatefirmware");
}


function getUpdateLogAsyncWithReciever(host, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "updatelog", asyncReciever, upperAsyncReciever, sender, upperSender);
}


function httpGet(_url) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: false,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",

        success: function (data) {
            addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful sync: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }            
        }
    });

    return _data;
}

function httpGetWithErrorReson(_url) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: false,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",

        success: function (data) {
            addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful sync: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
        }
    });

    return _data;
}

function httpPostWithErrorReson(_url, _postdata) {

    var formData = new FormData();
    var postdata = [];
    postdata.push(_postdata);
    formData.append('postdata', postdata);

    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        type: "POST",


        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        async: false,

        success: function (data) {
            addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call POST sync: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }            
        }
    });

    return _data;
}

//POST Async
function httpPostAsyncWithErrorReson(_url, arg, _postdata, asyncReciever, counter, dataString, length) {

    var formData = new FormData();
    var postdata = [];
    postdata.push(_postdata);
    formData.append('postdata', postdata);

    var _data = null;
    $.ajax({
        url: encodeURI(_url + arg),
        type: "POST",


        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        async: true,

        success: function (data) {
             addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
            if (asyncReciever != undefined) {
                asyncReciever(_data, counter, dataString, length, _url);
            }
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
             addToLogNL("call POST async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            if (asyncReciever != undefined) {
                asyncReciever(_data, counter, dataString, length, _url);
            }
        }
    });

    return _data;
}


function httpGetAsync(_url, asyncReciever, upperAsyncReciever, sender, upperSender, _timeout = 30000) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: true,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",
        timeout: _timeout,

        success: function (_data) {
            addToLogNL("call RESTful async: " + _url + " result OK", 1);
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }

        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }
        }
    });

    return _data;
}

function httpGetAsyncWithReciever(_url, asyncReciever, upperAsyncReciever, sender, upperSender, _timeout = 30000) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: true,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",
        timeout: _timeout,

        success: function (data) {
            addToLogNL("call RESTful async: " + _url + " result OK", 1);
            _data = data;
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }
        },
        
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }

            //XMLHttpRequest.host;
        }

    });

    return _data;
}
