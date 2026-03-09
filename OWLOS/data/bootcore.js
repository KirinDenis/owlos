/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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

//--------------------------------------------------------------------------------------------------------------------------------------------------
//Загрузчик OWLOS front части.
//Загружает JavaScript и CSS модули необходимые для работы OWLOS.
//Проверяет возможность подключения к Internet - если нет - меняет путь загрузки некоторых модулей, подгружая их из Модуля (что медлено, но дает возможность автономной работы)
//при начальной загрузкой браузером, подгружается только index.html и bootcore.js -> которая в свою очередь в фоновом режиме грузит весь остальной контент. 
//index.html в начале загрузки отображает консоль вывода, что позволяет bootcore.js информировать пользователя о процессе загрузки и возможных проблемах. (смотрите index.html)

//Существует 3 способа загрузки UI OWLOS:
// 1) Браузер грузит UI подключивший к модулю как к WiFi станции в локальной сети или через Интернет forwarding (проброшен порт и модуль выставлен в мир)
// - index.html и bootcore.js загружаются из flash памяти модуля, через встроенный web сервер, после чего bootcore.js - определяет доступен ли интернет,
// -- если ДА - "стандартный" контент (jQury, bootstrap, dataTable...) грузятся из интернет, в свою очередь OWLOS модули из flash модуля.
// -- если НЕТ - все грузится из flash  
// 2) Браузер грузит UI подключившись к модулю в режиме WiFi точки доступа (режим "чистое поле" интернета нет)
//    компьютер или телефон должен быть подключен к модулю как станция, IP модуля по умолчанию 192.168.4.1
// - также как и в первом случае БЕЗ интернета
// 3) [отладка] Файлы входящие в OWLOS UI должны быть на вашем локальном диске. Откройте restclientcore.js и укажите host=[текущий адрес модуля в сети http://адрес:port], 
//    откройте index.html браузером как файл. Это самый быстрый способ загрузки UI и хороший способ для отладки. 

//NOTE: функции работы с консолью реализованы в этом же модули ниже, по завершению загрузки консоль переместится в соответствующий раздел главного меню 
//OWLOS UI - там можно детально изучить процесс загрузки
//^^^---------------------------------------------------------------------------------------------------------------------------------------------------

//Global flags 
const NET_OFFLINE = 0;
const NET_ONLINE = 1;
const NET_ERROR = 2;
const NET_RECONNECT = 3;
const NET_REFRESH = 4; //используется объектом drivers только (устанавливается в момент начала цикла перезагрузки данных драйвер)

//var UIWatch = 'light';
var UIWatch = '';

function boot() {
    try { //first jQuery and chech internet access (if not internet - loading library from local)                
        addToLogNL("[BOOT]", 1);
        addToLogNL("Welcome to Free [O]bjects[W]rapper[L]ayer OS"); //приветствие, пишем в консоль
        addToLogNL("--------------------------------------------");
        addToLogNL("loading scripts...");
        //первым пробуем загрузить из Интернет jQuery если это получится - пойдем по пути подгрузки "стандартных" модулей из Интернет (jQuery, bootstrup, dataTables)
        var jQueryScript = document.createElement('script');
        //NOTE: что бы лучше понять этот код сверните jQueryScript.onerror обработчик до строки с кодом 
        //jQueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"; 
        //^^^сначала назначаем обработчики событий onload onerror - потом приступаем к загрузке, по результатам выберим режим загрузки - с интернетом или без
        jQueryScript.onload = function () { //событие будет вызвано если jQuery удалось загрузить из Интернет
            addToLogEnd("...OK", 1);
            addToLogNL("Internet accessable mode", 1);
            loadingScripts(true); //грузим контент рассчитывая на то что у нас есть интернет
        };
        jQueryScript.onerror = function () { //если не удалось загрузить jQuery из сети
            addToLogEnd("...ERROR", 2);
            addToLogNL("Internet unaccessable mode", 2);
            addToLog("loading jQuery from local");
            var jQueryScriptLocal = document.createElement('script'); //"переигрываем" грузим jQuery через web server модуля (без интернет)
            jQueryScriptLocal.onload = function () {
                addToLogEnd("...OK", 1);
                loadingScripts(false); //загрузка из flash памяти модуля, через наш web server
            };
            jQueryScriptLocal.onerror = function () {//если все совсем, совсем плохо - не интернета, не нужных файлов во flash памяти модуля
                addToLogEnd("...ERROR", 2);
                addToLogNL("Error booting thing, check local thing's files..."); //NOTE: мы оборвем процесс загрузки (((
            };

            jQueryScriptLocal.src = "jquery.min.js";
            document.getElementsByTagName('head')[0].appendChild(jQueryScriptLocal);
        };
        //начинаем попытку загрузить jQuery из интернет, смотрите onload и onerror
        jQueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";
        addToLog("loading jQuery from " + jQueryScript.src);
        document.getElementsByTagName('head')[0].appendChild(jQueryScript);
    } catch (error) { //если что то пошло совсем не так
        console.error(error);
        addToLogNL("loading scripts exception: " + error, 2);
    }
}
//Загрузка контента с интернет или без него, с учетом зависимости модулей (загрузка некоторых модулей, требует предварительной загрузки других,
//так как мы используем асинхронный метод загрузки - некоторые модули должне "дождатъся" загрузки тех от кого они зависят)
//...и да - нет никакого списка загрузки, как не странно здесь удобен хардкод
function loadingScripts(withInternet) {

    jQuery.readyException = function (error) {
        addToLogNL("jQuery error: " + error, 2);
    };

    $(document).ajaxError(function (event, request, settings) {
        addToLogNL("Ajax error: " + settings.url, 2);
    });

    //bottstrap css
    new Promise(function (resolve, reject) {//первым грузим bootstrap.css и ожидаем окончание
        var link = document.createElement('link');
        link.rel = 'stylesheet';

        if (UIWatch === 'light') {
            if (withInternet) link.href = "https://bootswatch.com/4/flatly/bootstrap.min.css";
            else link.href = "bootstrap.spacelab.min.css"; //если мы без интернет
        }
        else {//default 
            //if (withInternet) link.href = "https://bootswatch.com/4/slate/bootstrap.min.css"; //если мы с интернет //link.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
            //else 
            //all time local copy loading
            link.href = "bootstrap.min.css"; //если мы без интернет

        }
        addToLog("loading bootstrap.css from " + link.href); //намерения загрузить в консоль
        document.getElementsByTagName("head")[0].appendChild(link);
        link.onload = function () {//если получится загрузить bootstap.css
            addToLogEnd("..OK", 1);//отметим в консоле об успехе 
            resolve();//говорим наверх что все хорошо -> https://learn.javascript.ru/promise
            //if (withInternet) loadCSS("https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.css"); //следующий CSS с интернет
            //else 
            loadCSS("dataTables.min.css");//без 
            loadCSS("ui.css"); //это OWLOS UI CSS - его грузим из модуля
            //first jQuery Tables
            var jQueryTablesScript = document.createElement('script'); //многие зависят от jQueryTables, например datatables.js - по этому будем ожидать его загрузки что бы продолжить
            jQueryTablesScript.onload = function () {//jQueryTables.js загрузились
                //грузим зависимый datatables.js
                if (withInternet) loadingScript("https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.js");
                else loadingScript("dataTables.min.js");
                //от poperScript тоже много кто зависит, будем ждать
                var poperScript = document.createElement('script');
                poperScript.onload = function () {//poperScript.js загрузились

                    var bootstrapScript = document.createElement('script'); //и ОН САМЫЙ, без него никак, грузим - ждем
                    bootstrapScript.onload = function () {//готово
                        loadingScript("configcore.js");
                        var languageScript = document.createElement('script');
                        languageScript.onload = function () {
                            //loadingScript("languagescore.js"); //все модулю без URL принадлежать OWS OS и всегда грузятся с flash
                            loadingScript("speechcore.js");
                            loadingScript("drawcore.js");
                            loadingScript("restclientcore.js");
                            loadingScript("driverscore.js");
                            loadingScript("scriptscore.js");
                            loadingScript("pinscore.js");

                            loadingScript("dialogelement.js");
                            loadingScript("dialoginputelement.js");
                            loadingScript("buttonelement.js");
                            loadingScript("dialogselectelement.js");
                            loadingScript("sidebarelement.js");
                            loadingScript("valueeditorelement.js");
                            loadingScript("dialoglabelelement.js");
                            loadingScript("dialogprogressbarelement.js");

                            var baseWidgetScript = document.createElement('script');
                            baseWidgetScript.onload = function () {
                                //  loadingScript("basewidget.js");
                                loadingScript("radialwidget.js");
                                loadingScript("actuatorwidget.js");
                                loadingScript("lcdwidget.js");
                                loadingScript("stepperwidget.js");
                                loadingScript("motionwidget.js");
                                loadingScript("smokewidget.js");
                                loadingScript("lightwidget.js");
                                loadingScript("temperaturewidget.js");
                                loadingScript("graphwidget.js");
                                loadingScript("tablewidget.js");
                                loadingScript("valuewidget.js");
                                loadingScript("widgetswrappers.js");
                                loadingScript("headerpanelui.js");
                                loadingScript("scriptsui.js");
                                loadingScript("filespanelui.js");
                                loadingScript("driversui.js");
                                loadingScript("dashboardui.js");
                                loadingScript("settingsui.js");

                                loadingScript("index.js"); //ядро OWLOS UI, грузится последним, стартует систему
                                //}
                                //--> NOTE: код ниже - обратное сворачивание загрузчкив контента (стек загрузки)
                                //thingPropertiesScript.src = "thingproperties.js";
                                //addToLogNL("loading thingproperties from " + thingPropertiesScript.src);
                                //document.getElementsByTagName('head')[0].appendChild(thingPropertiesScript);
                            }
                            //--> NOTE: код ниже - обратное сворачивание загрузчкив контента (стек загрузки)
                            baseWidgetScript.src = "basewidget.js";
                            addToLogNL("loading basewidget from " + baseWidgetScript.src);
                            document.getElementsByTagName('head')[0].appendChild(baseWidgetScript);
                        }
                        languageScript.src = "languagescore.js";
                        addToLogNL("loading languagescore from " + languageScript.src);
                        document.getElementsByTagName('head')[0].appendChild(languageScript);
                    }
                    //--> NOTE: код ниже - обратное сворачивание загрузчкив контента (стек загрузки)
                    if (withInternet) bootstrapScript.src = "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js";
                    else bootstrapScript.src = "bootstrap.min.js";
                    addToLogNL("loading bootstrap from " + bootstrapScript.src);
                    document.getElementsByTagName('head')[0].appendChild(bootstrapScript);
                }
                if (withInternet) poperScript.src = "https://unpkg.com/popper.js@1.15.0/dist/umd/popper.min.js";
                else poperScript.src = "popper.min.js";
                addToLogNL("loading poper from " + poperScript.src);
                document.getElementsByTagName('head')[0].appendChild(poperScript);

            };
            if (withInternet) jQueryTablesScript.src = "https://cdn.datatables.net/1.10.18/js/jquery.dataTables.min.js";
            else jQueryTablesScript.src = "jquery.dataTables.min.js";
            addToLogNL("loading jQueryTables from " + jQueryTablesScript.src);
            document.getElementsByTagName('head')[0].appendChild(jQueryTablesScript);
        };
    });

}
//для очистки кода loadingScripts часто используемый участок вынесен в отдельную фунцию
function loadingScript(scriptURL) {
    addToLogNL("loading script from " + scriptURL);
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", scriptURL);
    document.getElementsByTagName("head")[0].appendChild(script);
}
//для очистки кода loadingScripts часто используемый участок вынесен в отдельную фунцию
function loadCSS(cssURL) {
    addToLogNL("loading css from " + cssURL);
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssURL;
        document.getElementsByTagName("head")[0].appendChild(link);
        link.onload = function () {
            resolve();
        };

        link.onerror = function () {
        };
    });
}
//CLASS to Object supporting 
function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps);
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps); return Constructor;
    }
}
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    } return self;
}
//see: https://learn.javascript.ru/prototype
function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
}
function waitForElement(element, callBack) {
    window.setTimeout(function () {
        if ($("#" + element.id).length) {
            var event = {
                currentTarget: element
            }
            callBack(event);
        } else {
            waitForElement(element, callBack);
        }
    }, 500)
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
//работа с консолью реализована в bootcore.js - здесь этот код используется и не надо грузить лишние модули из index.html
//даже если что то совсем пойдет не так - у нас есть возможность информировать пользователя, так как мы загрузили Log скрипты при помощи браузера
//добавить строку обычным цветом
function addToLog(text) {
    addToLog(text, 0);
}
//добавить строку с кодом цвета (кодом события)
//NOTE: для указания цвета используется bootstrap - одна в начале загрузки его не будет, консоль "окрасится" если получится загрузить bootstrap
function addToLog(text, code) {
    var bootLog = document.getElementById("bootLog");

    while (bootLog.childNodes.length > 100) {
        bootLog.removeChild(bootLog.lastChild);
    }

    var consoleDateText = document.createElement('text');
    consoleDateText.className = "text-secondary";
    consoleDateText.innerText = new Date().toLocaleString();

    var consoleText = document.createElement('text');
    //consoleText.className = "text-primary console-text";
    consoleText.innerText = text;

    bootLog.insertBefore(consoleText, bootLog.firstChild);
    bootLog.insertBefore(consoleDateText, consoleText);



    if (code == 1) { //success
        consoleText.className = "text-primary console-text";
    }
    else
        if (code == 2) { //error    
            consoleText.className = "text-danger console-text";
        }
        else {
            consoleText.className = "text-info console-text";
        }

}
//добавить строку обычным цветом и перевести карретку
function addToLogNL(text) {
    addToLog(text + "\n", 0);
}
//добавить строку с кодом цвета и перевести карретку
function addToLogNL(text, code) {

    addToLog(text + "\n", code);
}
//добавить строку в конец текущей
function addToLogEnd(text) {
    addToLogEnd(text, 0);

}
//добавить строку в конец текущей с цветом
//очень удобно, печатаем серым "loading poper.js..." и если удалось добавляем в конец строки зеленым "ок" или красным "error"
function addToLogEnd(text, code) {
    addToLogNL(text, code);
    /*
    var bootLog = document.getElementById("bootLog");
    if (code == 1) { //success
        bootLog.innerHTML = "<text class='text-success'> " + text + "\n</text>" + bootLog.innerHTML;
    }
    else
        if (code == 2) { //error    
            bootLog.innerHTML = "<text class='text-danger'> " + text + "\n</text>" + bootLog.innerHTML;
        }
        else {
            bootLog.innerHTML = text + "\n" + bootLog.innerHTML;
        }
    */
}
