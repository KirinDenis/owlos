var boardhost = "http://192.168.1.10:8084/"; //DEBUG
//var boardhost = "http://192.168.4.1:8084/"; //DEBUG as WiFi Access Point
//var boardhost = "";

function getUnitProperty(host, property) {
    return httpGetWithErrorReson(host + "getunitproperty?property=" + escape(property));
}

function setUnitProperty(host, property, value) {
    return httpGetWithErrorReson(host + "setunitproperty?property=" + escape(property) + "&value=" + escape(value));
}

function setDeviceProperty(host, id, property, value) {
    return httpGetWithErrorReson(host + "setdeviceproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value));
}

function setDevicePropertyAsync(host, id, property, value) {
    return httpGetAsync(host + "setdeviceproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value));
}

function setDevicePropertyAsyncWithReciever(host, id, property, value, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "setdeviceproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value), asyncReciever, upperAsyncReciever, sender, upperSender);
}

function getDeviceProperty(host, id, property) {
    return httpGetWithErrorReson(host + "getdeviceproperty?id=" + id + "&property=" + escape(property));
}

function getDevicePropertyAsyncWithReciever(host, id, property, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "getdeviceproperty?id=" + id + "&property=" + escape(property), asyncReciever, upperAsyncReciever, sender, upperSender);
}


function deleteFile(host, name) {
    return httpGet(host + "deletefile?name=" + name);
}

function reset(host) {
    return httpGetAsync(host + "reset");
}

function addDevice(host, type, id, pin1, pin2, pin3, pin4, pin5) {
    return httpGetWithErrorReson(host + "adddevice?type=" + type + "&id=" + id + "&pin1=" + pin1 + "&pin2=" + pin2 + "&pin3=" + pin3 + "&pin4=" + pin4);
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
            asyncReciever(_data, upperAsyncReciever, sender, upperSender);
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
            asyncReciever(_data, upperAsyncReciever, sender, upperSender);
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
            asyncReciever(_data, upperAsyncReciever, sender, upperSender);
        }
    });

    return _data;
}



function httpGetAsync(_url) {
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

        success: function (data) {
            addToLogNL("call RESTful async: " + _url + " result OK", 1);
            _data = data;
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            asyncReciever(_data, upperAsyncReciever, sender, upperSender);
        }
    });

    return _data;
}

function httpGetAsyncWithReciever(_url, asyncReciever, upperAsyncReciever, sender, upperSender) {
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

        success: function (data) {
            addToLogNL("call RESTful async: " + _url + " result OK", 1);
            _data = data;
            asyncReciever(_data, upperAsyncReciever, sender, upperSender);
        },
        
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            XMLHttpRequest.ha
        }

    });

    return _data;
}
