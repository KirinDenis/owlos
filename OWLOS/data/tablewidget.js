var TableWidget =
    
    function () {
        "use strict";

        function TableWidget(nodePropAnchors, nodesPropsPanel, device, size) {
            //панели в UI для рендеринга таблиц
            this.nodePropAnchors = nodePropAnchors; //document.getElementById("nodePropAnchors");

            this.nodesPropsPanel = nodesPropsPanel; // document.getElementById("nodesPropsPanel");

            this.device = device;
            this.size = size; //devices.addNewDeviceListner(this.newTable, this); //подписываемся на событие devices о создании нового устройства
            //devices.addDeviceLoadedListner(this.deviceLoaded, this); //подписываемся на событие devices о создании нового устройства
            //if (document.getElementById(this.device._nodenickname + "_" + this.device._id) != undefined) return; 

            this.newTable(); //this.nodePropAnchors.innerHTML = "";
            
            //this.nodesPropsPanel.innerHTML = "";
        } //слушатель (получатель) событие создания нового устройство (устройство не содержит свойств на данном этапе)


        var _proto = TableWidget.prototype;

        _proto.newTable = function newTable() {
            //добавляет кнопку в панель быстрого выбора устройств
            if (this.nodePropAnchors != undefined) { }
            /*
            var deviceNavItem = this.nodePropAnchors.appendChild(document.createElement("li"));
            deviceNavItem.className = "nav-item";
            var deviceHRef = deviceNavItem.appendChild(document.createElement("a"));
            deviceHRef.className = "nav-link";
            if (firstDevice) {
                deviceHRef.className += " active";
            }
            deviceHRef.setAttribute("data-toggle", "tab");
            deviceHRef.innerText = getLang(this.device._nodenickname + "/" + this.device._id);
            deviceHRef.href = "#" + this.device._nodenickname + "_" + this.device._id;
            */

            /*
            var anchorHref = this.nodePropAnchors.appendChild(document.createElement('button'));
            anchorHref.type = "button";
            anchorHref.href = "#" + this.device._id;
            anchorHref.onclick = this.deviceAnchorClick;
            anchorHref.innerText = this.device._id;
            anchorHref.className = "btn btn-default";
            */
            //добавлет таблицу для свойств нового устройства


            var div = this.nodesPropsPanel.appendChild(document.createElement('div'));

            if (this.nodePropAnchors != undefined) {
                // div.className = "col-md-" + this.size + " devicediv tab-pane fade";
                div.className = "devicediv tab-pane fade"; //if (firstDevice) {
                //div.className += " active show";
                //firstDevice = false;
                //}
            } else {
                div.className = "col-md-" + this.size + " devicediv TableWidget";
            }

            div.id = this.device._nodenickname + "_" + this.device._id;
            /*
            var deviceDiv = div.appendChild(document.createElement('div'));
            deviceDiv.className = "col-md-12 border-0 devicecard";
            var deviceDivHeader = deviceDiv.appendChild(document.createElement('div'));
            deviceDivHeader.className = "card-header text-light";
            deviceDivHeader.innerText = this.device._id;
            var tableDiv = deviceDiv.appendChild(document.createElement('div'));
            tableDiv.className = "card-body"; 
            */
            //таблица

            this.table = div.appendChild(document.createElement('table'));
            this.table.className = "table table-striped table-sm";
            this.table.id = "devicetable" + this.device._nodenickname + "_" + this.device._id;
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
            th.className = "w-5";
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-5";
            th.scope = "col"; //ссылка в последней колонки для перехода вверх таблицы

            var anchorTopHref = th.appendChild(document.createElement('a'));
            anchorTopHref.href = "#top";
            anchorTopHref.innerText = getLang("top"); //создает tbody

            this.tbody = this.table.appendChild(document.createElement('tbody')); //назначает счетчик свойств устройства (строк таблицы)

            this.tbody.propertyCount = 0;
            /*---------------------------------------------
            //подписывается на событие вызываемое при создании нового свойства устройства 
            //передает текущий tbody в качестве сендера
            device.addNewPropertyListner(deviceTable.newProperty, tbody);
            */

            for (var _i = 0, _Object$keys = Object.keys(this.device); _i < _Object$keys.length; _i++) {
                var devicePropertyKey = _Object$keys[_i];

                if (this.device[devicePropertyKey].parentid != undefined) {
                    this.addProperty(this.device[devicePropertyKey]);
                }
            }

            if (this.device._new) {
                // $("#devicetable" + this.device._id).DataTable({ searching: false, paging: false, info: false });
                $("#devicetable" + this.device._nodenickname + "_" + this.device._id).DataTable({
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
        } //слушатель события создания нового свойства устройства - добавляет соответствующею строку в последнею созданую таблицу
            //tbody последней таблицы 
            //deviceProperty объек с новым свойством устройства, смотрите devices.newDeviceProperty() в конце метода
            ;

        _proto.addProperty = function addProperty(deviceProperty) {
            var node = config.getNodeByHost(deviceProperty.parenthost);
            if (node == undefined) return;
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
            //тут надо рассмотреть deviceProperty.addValueListner(..) метод - посмотрите на него - при назначении 
            //слушателя, для его проверки он вызовет матод слушателя (для проверки, секция try{}catch)
            //сейчас этот метод deviceTable.onDevicePropValueChangeGetaHref() из текущего объекта
            //а sender для этого метода текущая ссылка getPropHref
            //при вызове deviceTable.onDevicePropValueChangeGetaHref() в качестве параметра передадут DevicePorperty объект который 
            //связан с этой строкой таблицы ибо он "deviceProperty" ниже
            //Посмотрите сейчас на метод deviceTable.onDevicePropValueChangeGetaHref - он настраивает ссылку getPropHref согласно 
            //свойствам deviceProperty - таким образом мы "убиваем двух зайцев" - и настраиваем внешний вид элемента (ссылки) и готовим 
            //метод слушатель события изменения значения свойства - теперь как бы не менялось свойста, у нас есть код который будет "перерисовать" связанный
            //                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
            //элемент и нам не надо более не о чем заботиться.
            //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            deviceProperty.addValueListner(this.onDevicePropValueChangeGetaHref, getPropHref); //третъя колонка, текущее значение свойства устройства 

            var valueTd = tr.appendChild(document.createElement('td'));
            var valueSpan = valueTd.appendChild(document.createElement('span'));
            valueSpan.className = "align-middle"; //ссылка вызывающая API для назначения свойства устройства, так же как для воторой колонки 

            var setPropHref = valueSpan.appendChild(document.createElement('a'));
            setPropHref.target = "_blank";
            setPropHref.setAttribute("data-toggle", "tooltip");
            setPropHref.setAttribute("data-placement", "top"); //так же как и для второй колонки - назначаем метод слушатель изменения объекта, он же "рисует" setPropHref элемент в 
            //зависимости от текущего значения свойства

            deviceProperty.addValueListner(this.onDevicePropValueChangeSetaHref, setPropHref); //четвертая колонка - редактор значения свойства, реализован так же как элементы для второй и третей колонки, со своим слушателем события
            //учитывает тип свойства устройства - создает соответствующие типы редакторов createValueEdit() <-- TODO: метод старый, нуждается в рефакторинге 

            var edit = createValueEdit(tr.appendChild(document.createElement('td')), deviceProperty.name, deviceProperty.value, deviceProperty.type);
            deviceProperty.addValueListner(this.onDevicePropValueChangeEdit, edit); //пятая и шестая колонка, кнопки Set value и Get Value 

            var setButtonTd = tr.appendChild(document.createElement('td'));
            var getButtonTd = tr.appendChild(document.createElement('td')); //кнопка Get value 

            var getSpan = getButtonTd.appendChild(document.createElement('a'));
            getSpan.className = "badge badge-secondary";
            getSpan.href = "#";
            getSpan.style.margin = "1px 0px 1px 0px";
            getSpan.style.height = "25px";
            getSpan.style.width = "50px";
            getSpan.innerText = "get";
            getSpan.deviceProperty = deviceProperty; //кнопка запоминает свойство устройства 

            getSpan.onclick = this.getDeviceClick; //обработчик клика - должне бызвать в объекте со свойством устройство асинхронный вызов API и обработать результа

            deviceProperty.addNetworkStatusListner(this.onDevicePropNetworkStatusChange, getSpan); //кнопка так же является получателем изменения статуса свойства устройства

            node.addNetworkStatusListner(this.onDevicePropNetworkStatusChange, getSpan); //подписка на глобальный сетевой статус
            //кнопка Set value не создается если свойство ReadOnly

            if (!deviceProperty.type.indexOf("r")!=-1) {
                //так же как и Set value кнопка - асинхронно меняет значение свойства и ожидает результат
                var span = setButtonTd.appendChild(document.createElement('a'));
                span.className = "badge badge-secondary";
                span.href = "#";
                span.style.margin = "1px 0px 1px 0px";
                span.style.height = "25px";
                span.style.width = "50px";
                span.setAttribute("data-toggle", "tooltip");
                span.setAttribute("data-placement", "top");
                span.deviceProperty = deviceProperty;
                span.edit = edit;
                span.onclick = this.setDeviceClick;
                span.innerText = "set";
                deviceProperty.addNetworkStatusListner(this.onDevicePropNetworkStatusChange, span);
                node.addNetworkStatusListner(this.onDevicePropNetworkStatusChange, span);
            }

            return tr; //FFR: возвращет созданую строку таблицы, пока не используется
        };

        _proto.deviceLoaded = function deviceLoaded(sender, device) { } //кноки подписываются на изменение сетевого статуса свойства устройства, этот метод слушатель соответствующего события в свойстве устройства
            //и будет вызвать если сетевой статус изменится (обе кнопки Get и Set подписаны этом методом и будут представлены как sender)
            ;

        _proto.onDevicePropNetworkStatusChange = function onDevicePropNetworkStatusChange(sender, deviceProperty) {
            if (deviceProperty.networkStatus == NET_ONLINE) {
                sender.className = "badge badge-success";
            } else if (deviceProperty.networkStatus == NET_RECONNECT) {
                sender.className = "badge badge-warning";
            } else if (deviceProperty.networkStatus == NET_OFFLINE) {
                sender.className = "badge badge-secondary";
            } else //error
                if (deviceProperty.networkStatus == NET_ERROR) {
                    sender.className = "badge badge-danger";
                }
        } //обработчик слушатель события изменения свойста для ссылки из второй колонки таблицы (смотрите метод создания строки таблицы)
            ;

        _proto.onDevicePropValueChangeGetaHref = function onDevicePropValueChangeGetaHref(sender, deviceProperty) {
            //ссылка представлена тут как sender 
            sender.title = "Get '" + deviceProperty.name + "' device property value [RESTful API execute]"; //настройка подсказки

            sender.innerText = deviceProperty.name;

            if (deviceProperty.type.indexOf("s") != -1) {
                sender.className = "text-warning";
            }

            sender.href = deviceProperty.parenthost + "getdeviceproperty?id=" + deviceProperty.parentid + "&property=" + deviceProperty.name; //настройка вызова RESTful API по клику на ссылку
        } //обработчик слушатель события изменения свойста для ссылки из третей (так же как и для второй, только вызов RESTful API Set )
            ;

        _proto.onDevicePropValueChangeSetaHref = function onDevicePropValueChangeSetaHref(sender, deviceProperty) {
            sender.title = "Set '" + deviceProperty.name + "' device property value [RESTful API execute][return '1' if success]";
            sender.href = deviceProperty.parenthost + "setdeviceproperty?id=" + deviceProperty.parentid + "&property=" + deviceProperty.name + "&value=" + deviceProperty.value;

            if (deviceProperty.type.indexOf("b") != -1) {
                //если тип свойства устройства boolean 
                if (deviceProperty.value === "1") sender.innerText = "true"; else sender.innerText = "false";
            } else {
                //иначе текстовое представление - текст может быть очень длинным, ограничиваем в 20 символов
                var cutValue = deviceProperty.value;

                if (cutValue.length > 20) {
                    cutValue = cutValue.slice(0, 20) + "...";
                }

                if (deviceProperty.type.indexOf("p") != -1) {
                    var temp = "";
                    for (var i = 0; i < cutValue.length; i++) {
                        temp += "*";
                    }
                    cutValue = temp;
                }

                sender.innerText = cutValue;
            }
        } //обработчик слушатель события изменения свойста для редактора свойствае, если свойство изменит значение - редактор предложит пользователю новое измененое значение
            //это интересно работает когда несколько пользователей независимо редактируют разные свойства устройств независимо друг от другда
            ;

        _proto.onDevicePropValueChangeEdit = function onDevicePropValueChangeEdit(sender, deviceProperty) {
            if (deviceProperty.type.indexOf("b") != -1) {
                //boolean
                if (deviceProperty.value == "1") {
                    sender.selectedIndex = 0;
                } else {
                    sender.selectedIndex = 1;
                }
            } else {
                sender.value = deviceProperty.value;
            }
        } //когда пользоватеь кликнет кнопку Set в одной из строк таблицы (изменение значения свойства устройства)
            //для понимания этого метода необходимо учитывать, что все остальные элементы строки, связаные с текущем свойством, 
            //были подписаны на его изменениея - смотрите newProperty() метод этого объекта
            //По этой причине, все кнопке остается только "попросить" объект свойства устройства изменить его значения и не заботится о результате
            //все что произойдет далее с RESTful API, Unit, свойством - будет выслано самим объектом DeviceProperty соответствующим подписчикам
            ;

        _proto.setDeviceClick = function setDeviceClick(event) {
            event.stopPropagation();
            var button = event.currentTarget; //вытаскиваем "кликнутую" кнопку из event 

            var deviceProperty = button.deviceProperty; //вытаскиваем из кнопки - связанное с ней свойство устройства  

            if (deviceProperty.networkStatus != NET_RECONNECT) {
                //если свойство устройства не в статуре "в реботе" - асинхронность это хорошо, но переполнять очередь это преступление
                var edit = button.edit; //вытаскиваем редактор свойства (он в строке таблицы вместе с кнопкой)

                var value = edit.value; //получаем значение свойства устройства введенное пользователем

                if (edit.proptype.indexOf("b") != -1) // boolean - представлен в виде combobox а не редактора 
                {
                    if (edit.selectedIndex == 0) value = "1"; //для устройства 1 - true, 0 - false
                    else value = "0";
                } //вызываем метод свойства устройства для начала процедуры изменения этого свойства с новым значением value
                //не назначаем вторичных получателей undefined, undefined - все получатели уже подписаны ранее


                deviceProperty.setValue(value, undefined, undefined);
            }

            return false;
        } //клик на кнопку получить значение свойства устройства - так же как и setDeviceClick, с той разницей что никакое value не передается, а полученое value будет 
            //передано всем подписчикам DeviceProperty.value 
            ;

        _proto.getDeviceClick = function getDeviceClick(event) {
            event.stopPropagation();
            var button = event.currentTarget;
            var deviceProperty = button.deviceProperty;

            if (deviceProperty.networkStatus != NET_RECONNECT) {
                deviceProperty.getValue(undefined, undefined);
            }

            return false;
        };

        return TableWidget;
    }(); //ENDOF deviceTable