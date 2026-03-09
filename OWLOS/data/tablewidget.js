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

var TableWidget =

    function () {
        "use strict";

        function TableWidget(thingPropAnchors, thingsPropsPanel, driver, size) {
            //панели в UI для рендеринга таблиц
            this.thingPropAnchors = thingPropAnchors; //document.getElementById("thingPropAnchors");
            this.thingsPropsPanel = thingsPropsPanel; // document.getElementById("thingsPropsPanel");
            this.driver = driver;
            this.size = size; //drivers.addNewDriverListner(this.newTable, this); //подписываемся на событие drivers о создании нового драйвера
            this.newTable(); //this.thingPropAnchors.innerHTML = "";
        } //слушатель (получатель) событие создания нового драйвер (драйвер не содержит свойств на данном этапе)


        var _proto = TableWidget.prototype;
        

        _proto.newTable = function newTable() {
            //добавляет кнопку в панель быстрого выбора драйвер
            if (this.thingPropAnchors != undefined) { }
            //добавлет таблицу для свойств нового драйвера
            var div = this.thingsPropsPanel.appendChild(document.createElement('div'));

            if (this.thingPropAnchors != undefined) {
                div.className = "driverdiv tab-pane fade"; //if (firstDriver) {
                //}
            } else {
                div.className = "col-md-" + this.size + " driverdiv TableWidget";
            }

            div.id = this.driver._thingnickname + "_" + this.driver._id;
            //таблица

            this.table = div.appendChild(document.createElement('table'));
            this.table.className = "table table-striped table-sm";
            this.table.id = "drivertable" + this.driver._thingnickname + "_" + this.driver._id;
            this.table.cellspacing = "0"; //колонки

            var thead = this.table.appendChild(document.createElement('thead'));
            var tr = thead.appendChild(document.createElement('tr'));
            var th = tr.appendChild(document.createElement('th'));
            th.className = "w-2";
            th.innerText = "#";
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-10";
            th.innerText = getLang("property");
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-25";
            th.innerText = getLang("value");
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-25";
            th.innerText = getLang("newvalue");
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-2";
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-2";
            th.scope = "col"; //ссылка в последней колонки для перехода вверх таблицы

            var anchorTopHref = th.appendChild(document.createElement('a'));
            anchorTopHref.href = "#top";
            anchorTopHref.innerText = getLang("top"); //создает tbody

            this.tbody = this.table.appendChild(document.createElement('tbody')); //назначает счетчик свойств драйвера (строк таблицы)

            this.tbody.propertyCount = 0;
            /*---------------------------------------------
            //подписывается на событие вызываемое при создании нового свойства драйвера 
            //передает текущий tbody в качестве сендера
            driver.addNewPropertyListner(driverTable.newProperty, tbody);
            */

            for (var _i = 0, _Object$keys = Object.keys(this.driver); _i < _Object$keys.length; _i++) {
                var driverPropertyKey = _Object$keys[_i];

                if (this.driver[driverPropertyKey].parentid != undefined) {
                    this.addProperty(this.driver[driverPropertyKey]);
                }
            }

            if (this.driver._new) {
                // $("#drivertable" + this.driver._id).DataTable({ searching: false, paging: false, info: false });
                $("#drivertable" + this.driver._thingnickname + "_" + this.driver._id).DataTable({
                    "language": {
                        "lengthMenu": getLang("dt_display") + " _MENU_ " + getLang("dt_recordsperpage"),
                        "info": getLang("dt_showing") + " _START_ " + getLang("dt_to") + " _END_ " + getLang("dt_of") + " _TOTAL_ " + getLang("dt_entries"),
                        "search": getLang("dt_search"),
                        "paginate": {
                            "first": getLang("dt_first"),
                            "last": getLang("dt_last"),
                            "next": getLang("dt_next"),
                            "previous": getLang("dt_previous")
                        }
                    },
                    "pageLength": 50
                });
                $('.dataTables_length').addClass('bs-select');
                $('[data-toggle="tooltip"]').tooltip();
            }
        } //слушатель события создания нового свойства драйвера - добавляет соответствующею строку в последнею созданую таблицу
            //tbody последней таблицы 
            //driverProperty объек с новым свойством драйвера, смотрите drivers.newDriverProperty() в конце метода
            ;

        _proto.addProperty = function addProperty(driverProperty) {
            var thing = config.getThingByHost(driverProperty.parenthost);
            if (thing == undefined) return;
            this.tbody.propertyCount++; //инкрементируем счетчик свойств

            var tr = this.tbody.appendChild(document.createElement('tr'));
            var th = tr.appendChild(document.createElement('th'));
            th.scope = "row";
            th.innerHTML = this.tbody.propertyCount; //первая колонка номер свойства 
            //вторая колонка, название свойства, а так же ссылка на вызов RESTful API для получения значения этого свойства (для Справки)

            var nameTd = tr.appendChild(document.createElement('td'));
            var getPropHref = nameTd.appendChild(document.createElement('a')); //сиздаем ссылку

            getPropHref.target = "_blank";
            getPropHref.setAttribute("data-toggle", "tooltip");
            getPropHref.setAttribute("data-placement", "top"); //назначаем слушатель события изменения значения свойства, использующий созданную ссылку в качестве Sender 
            //тут надо рассмотреть driverProperty.addValueListner(..) метод - посмотрите на него - при назначении 
            //слушателя, для его проверки он вызовет матод слушателя (для проверки, секция try{}catch)
            //сейчас этот метод driverTable.onDriverPropValueChangeGetaHref() из текущего объекта
            //а sender для этого метода текущая ссылка getPropHref
            //при вызове driverTable.onDriverPropValueChangeGetaHref() в качестве параметра передадут DriverPorperty объект который 
            //связан с этой строкой таблицы ибо он "driverProperty" ниже
            //Посмотрите сейчас на метод driverTable.onDriverPropValueChangeGetaHref - он настраивает ссылку getPropHref согласно 
            //свойствам driverProperty - таким образом мы "убиваем двух зайцев" - и настраиваем внешний вид элемента (ссылки) и готовим 
            //метод слушатель события изменения значения свойства - теперь как бы не менялось свойста, у нас есть код который будет "перерисовать" связанный
            //                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
            //элемент и нам не надо более не о чем заботиться.
            //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            driverProperty.addValueListner(this.onDriverPropValueChangeGetaHref, getPropHref); //третъя колонка, текущее значение свойства драйвера 

            var valueTd = tr.appendChild(document.createElement('td'));
            var valueSpan = valueTd.appendChild(document.createElement('span'));
            valueSpan.className = "align-middle"; //ссылка вызывающая API для назначения свойства драйвера, так же как для воторой колонки 

            var setPropHref = valueSpan.appendChild(document.createElement('a'));
            setPropHref.target = "_blank";
            setPropHref.setAttribute("data-toggle", "tooltip");
            setPropHref.setAttribute("data-placement", "top"); //так же как и для второй колонки - назначаем метод слушатель изменения объекта, он же "рисует" setPropHref элемент в 
            //зависимости от текущего значения свойства

            driverProperty.addValueListner(this.onDriverPropValueChangeSetaHref, setPropHref); //четвертая колонка - редактор значения свойства, реализован так же как элементы для второй и третей колонки, со своим слушателем события
            //учитывает тип свойства драйвера - создает соответствующие типы редакторов createValueEdit() <-- TODO: метод старый, нуждается в рефакторинге 

            var propValueTD = tr.appendChild(document.createElement('td'));
            if (driverProperty.type.indexOf("r") == -1) {
                var edit = createValueEdit(propValueTD, driverProperty.name, driverProperty.value, driverProperty.type);
                driverProperty.addValueListner(this.onDriverPropValueChangeEdit, edit); //пятая и шестая колонка, кнопки Set value и Get Value 
            }

            var setButtonTd = tr.appendChild(document.createElement('td'));
            var getButtonTd = tr.appendChild(document.createElement('td')); //кнопка Get value 

            var getSpan = getButtonTd.appendChild(document.createElement('a'));
            getSpan.className = "badge badge-secondary";
            getSpan.href = "#";
            getSpan.style.margin = "1px 0px 1px 0px";
            getSpan.style.height = "25px";
            getSpan.style.width = "50px";
            getSpan.innerText = "get";
            getSpan.driverProperty = driverProperty; //кнопка запоминает свойство драйвера 

            getSpan.onclick = this.getDriverClick; //обработчик клика - должне бызвать в объекте со свойством драйвер асинхронный вызов API и обработать результа

            driverProperty.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, getSpan); //кнопка так же является получателем изменения статуса свойства драйвера

            thing.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, getSpan); //подписка на глобальный сетевой статус
            //кнопка Set value не создается если свойство ReadOnly

            if (driverProperty.type.indexOf("r") == -1) {
                //так же как и Set value кнопка - асинхронно меняет значение свойства и ожидает результат
                var span = setButtonTd.appendChild(document.createElement('a'));
                span.className = "badge badge-secondary";
                span.href = "#";
                span.style.margin = "1px 0px 1px 0px";
                span.style.height = "25px";
                span.style.width = "50px";
                span.setAttribute("data-toggle", "tooltip");
                span.setAttribute("data-placement", "top");
                span.driverProperty = driverProperty;
                span.edit = edit;
                span.onclick = this.setDriverClick;
                span.innerText = "set";
                driverProperty.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, span);
                thing.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, span);
            }

            return tr; //FFR: возвращет созданую строку таблицы, пока не используется
        };

        _proto.driverLoaded = function driverLoaded(sender, driver) { } //кноки подписываются на изменение сетевого статуса свойства драйвера, этот метод слушатель соответствующего события в свойстве драйвера
            //и будет вызвать если сетевой статус изменится (обе кнопки Get и Set подписаны этом методом и будут представлены как sender)
            ;

        _proto.onDriverPropNetworkStatusChange = function onDriverPropNetworkStatusChange(sender, driverProperty) {
            if (driverProperty.networkStatus == NET_ONLINE) {
                sender.className = "badge badge-success";
            } else if (driverProperty.networkStatus == NET_RECONNECT) {
                sender.className = "badge badge-warning";
            } else if (driverProperty.networkStatus == NET_OFFLINE) {
                sender.className = "badge badge-secondary";
            } else //error
                if (driverProperty.networkStatus == NET_ERROR) {
                    sender.className = "badge badge-danger";
                }
        } //обработчик слушатель события изменения свойста для ссылки из второй колонки таблицы (смотрите метод создания строки таблицы)
            ;

        _proto.onDriverPropValueChangeGetaHref = function onDriverPropValueChangeGetaHref(sender, driverProperty) {
            //ссылка представлена тут как sender 
            sender.title = "Get '" + driverProperty.name + "' driver property value [RESTful API execute]"; //настройка подсказки

            sender.innerText = driverProperty.name;

            if (driverProperty.type.indexOf("s") != -1) {
                sender.className = "text-warning";
            }

            sender.href = driverProperty.parenthost + "getdriverproperty?id=" + driverProperty.parentid + "&property=" + driverProperty.name; //настройка вызова RESTful API по клику на ссылку
        } //обработчик слушатель события изменения свойста для ссылки из третей (так же как и для второй, только вызов RESTful API Set )
            ;

        _proto.onDriverPropValueChangeSetaHref = function onDriverPropValueChangeSetaHref(sender, driverProperty) {
            sender.title = "Set '" + driverProperty.name + "' driver property value [RESTful API execute][return '1' if success]";
            sender.href = driverProperty.parenthost + "setdriverproperty?id=" + driverProperty.parentid + "&property=" + driverProperty.name + "&value=" + driverProperty.value;

            if (driverProperty.type.indexOf("b") != -1) {
                //если тип свойства драйвера boolean 
                if (driverProperty.value === "1") sender.innerText = "true"; else sender.innerText = "false";
            } else {
                //иначе текстовое представление - текст может быть очень длинным, ограничиваем в 20 символов
                var cutValue = driverProperty.value;

                if (cutValue.length > 50) {
                    cutValue = cutValue.slice(0, 50) + "...";
                }

                if (driverProperty.type.indexOf("p") != -1) {
                    var temp = "";
                    for (var i = 0; i < cutValue.length; i++) {
                        temp += "*";
                    }
                    cutValue = temp;
                }

                sender.innerText = cutValue;
            }
        } //обработчик слушатель события изменения свойста для редактора свойствае, если свойство изменит значение - редактор предложит пользователю новое измененое значение
            //это интересно работает когда несколько пользователей независимо редактируют разные свойства драйвер независимо друг от другда
            ;

        _proto.onDriverPropValueChangeEdit = function onDriverPropValueChangeEdit(sender, driverProperty) {
            if (driverProperty.type.indexOf("b") != -1) {
                //boolean
                if (driverProperty.value == "1") {
                    sender.selectedIndex = 0;
                } else {
                    sender.selectedIndex = 1;
                }
            } else {
                sender.value = driverProperty.value;
            }
        } //когда пользоватеь кликнет кнопку Set в одной из строк таблицы (изменение значения свойства драйвера)
            //для понимания этого метода необходимо учитывать, что все остальные элементы строки, связаные с текущем свойством, 
            //были подписаны на его изменениея - смотрите newProperty() метод этого объекта
            //По этой причине, все кнопке остается только "попросить" объект свойства драйвера изменить его значения и не заботится о результате
            //все что произойдет далее с RESTful API, Unit, свойством - будет выслано самим объектом DriverProperty соответствующим подписчикам
            ;

        _proto.setDriverClick = function setDriverClick(event) {
            event.stopPropagation();
            var button = event.currentTarget; //вытаскиваем "кликнутую" кнопку из event 

            var driverProperty = button.driverProperty; //вытаскиваем из кнопки - связанное с ней свойство драйвера  

            if (driverProperty.networkStatus != NET_RECONNECT) {
                //если свойство драйвера не в статуре "в реботе" - асинхронность это хорошо, но переполнять очередь это преступление
                var edit = button.edit; //вытаскиваем редактор свойства (он в строке таблицы вместе с кнопкой)

                var value = edit.value; //получаем значение свойства драйвера введенное пользователем

                if (edit.proptype.indexOf("b") != -1) // boolean - представлен в виде combobox а не редактора 
                {
                    if (edit.selectedIndex == 0) value = "1"; //для драйвера 1 - true, 0 - false
                    else value = "0";
                } //вызываем метод свойства драйвера для начала процедуры изменения этого свойства с новым значением value
                //не назначаем вторичных получателей undefined, undefined - все получатели уже подписаны ранее


                driverProperty.setValue(value, undefined, undefined);
            }

            return false;
        } //клик на кнопку получить значение свойства драйвера - так же как и setDriverClick, с той разницей что никакое value не передается, а полученое value будет 
            //передано всем подписчикам DriverProperty.value 
            ;

        _proto.getDriverClick = function getDriverClick(event) {
            event.stopPropagation();
            var button = event.currentTarget;
            var driverProperty = button.driverProperty;

            if (driverProperty.networkStatus != NET_RECONNECT) {
                driverProperty.getValue(undefined, undefined);
            }

            return false;
        };

        return TableWidget;
    }(); //ENDOF driverTable
