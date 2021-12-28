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

/*
 
Виджет (Widget) - https://ru.wikipedia.org/wiki/%D0%AD%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82_%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B0
 
Реализация базового(родительского) виджета.Все виджеты наследники объекта BaseWidget описанного в этом файле. 
-------------------------------------------------------------------------------------------------------------

Особенности реализации, примечания:
-----------------------------------
- Виджеты в этом проекте реализуются как можно более независимо от остальных модулей, идея заключается в том, что виджеты можно использовать для других проектов, особо не модифицируя код. 

- Для визуализации был выбран SVG - векторная графика, относительно быстрый рендеринг, отсутствие "пиксилиризации".Изначально, в первых версиях использовался классический HTML Canvas, что 
вызвало ряд проблем, в том числе - "пиксилиризация" шрифтов, сложности масштабирования.

- Так как виджеты "отвязаны" от основного проекта, существует ряд объектов "оберток"(Wrappers), их реализацию можно увидеть в файле WidgetsWrappers.js.

- Для совместимости с Internet Explorer пришлось отказаться от классов и "правильного" наследования https://babeljs.io/docs/en/learn/

Архитектура и свойства виджетов:
--------------------------------
- виджет формирует изображение(рисует векторную картинку, рендерит контент) в корневом HTML DIV элементе - WidgetHolder, WidgetHolder родительский элемент для всех используемых
  SVG элементов виджета. Так же, в данной реализации WidgetHolder осуществляет сопряжение виджетов с сеткой Bootstrap, сопрягая расположение элементов внутри страницы. 

- для большинства SVG элементов реализованы классы обертки, регламентирующие прямое использование свойств DOM SVG элементов, все классы расположены в файле DrawCore.js.
  DrawCore.js самодостаточный файл, вы можете использовать его отдельно для свои SVG проектов. 

- как правило на верхний уровень WidgetHolder помещается только один SVG ViewBox элемент SVGViewBox - на этом уровне SVGViewBox отвечает за скалинг остальных элементов. Таким образом 
  WidgetHolder позволяет масштабировать и позиционировать виджет используя Bootstrap, а в SVGViewBox отвечает за масштаб элементов внутри виджета. 

- для правильного внутреннего масштабирования, SVG элементы должны "знать" исходный размер области экрана для от рисовки (изначально), по этой причине инициализация виджета происходит в 
  два этапа - "конструктор" (классы не поддерживаются - поэтому метод function BaseWidget(...) формально играет роль конструктора) 
    1) инкапсулирует WidgetHolder элемент, назначает ему Bootstrap HTML ClassName - например "col-sm-1" (одна ячайка в 12 разрядной сетке).

    2) создает функция с потоком ожидания готовности WidgetHolder waitForElement(), этой функции передается адрес метода onWidgetHolderLoad() который будет вызван как только ожидающий поток 
    "обнаружит" возможность работать со свойствами WidgetHolder в рамках DOM.

    3) В момент вызова onWidgetHolderLoad() WidgetHolder находится на экране и получил все необходимые DOM свойства, в частности размер. onWidgetHolderLoad() инкапсулирует SVGViewBox и все необходимые 
    SVG элементы - привязываясь к текущему размеру WidgetHolder.
    3.1) виджет предоставляет событие .onload - реализовав обработчик этого события, внешняя программа может "узнать" о том когда виджет загружен и готов к использованию. 

    4) "конструктор" function BaseWidget(...) назначает обработчик события document..body.onresize - таким образом все привязанные к первоначальному размеру WidgetHolder элементы могут "узнают" об 
    изменениях масштаба экрана. А так как все они помещены в SVGViewBox - достаточно изменять его размер симметрично изменениям размера экрана и сетки bootstrap.

 - методы refresh(), drawText(), drawWidget():
 -- все виджеты обязаны наследовать и перекрывать эти методы для внесения изменений в визуализацию виджита. 
 -- refresh() создан для передачи отображаемых данных в виджет (в данном случае данных микроконтроллера)
 -- drawText() управляет SVG текстовыми элементами виджета. 
 -- drawWidget() управляет SVG графическими элементами виджета. 
 -- drawText() и DrawWidget() реализованы отдельно, по той причине что многие изменяемые данные, представляют собой текст - для экономии ресурсов и повышения производительности, были решено 
    "перерисовывать" текст отдельно. 

Использование:
 - вызвать baseWidget(), в параметрах назначить родительский HTML элемент. 
 - по необходимости реализовать baseWidget.onload обработчик, и настроить виджет в этом обработчике. 
 - по мере необходимости вызывать метод refresh() передавая новые данные для отображения виджетом (данные зависят от конкретного типа виджета)

*/

//палитра виджетов, настраивается при старте (смотрите index.js)
var widgetsTheme = {};

// флажки режимов виджета
var WORK_MODE = 0; // в этом режиме виджет отображает данные
var MOVE_MODE = 1; // в этом режиме виджет отображает элементы управления собой - переместить, изменить свойства, удалить

// флажки состояний виджета
var EVENT_NO = 0; // ничего нет 
var EVENT_DELETE = 1; // виджет удаляется 

//------------------------------------------------------------------------------------------------------------------------------------------
// Объект базового виджета, общее описание находится в начале этого файла
var BaseWidget =

    function () {
        "use strict"; //https://www.w3schools.com/js/js_strict.asp
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // "конструктор" виджета, все "наследники" обязаны вызывать этот метод первым
        // parentPanel - HTML элемент в который будет помещен виджет
        // id - уникальный идентификатор этого виджета (не путать с DOM HTML element.id)
        function BaseWidget(parentPanel, id) {

            this.parentPanel = parentPanel; // сохраняем родительскую панель в свойство виджета 
            this.id = id; // сохраняем id виджита
            this._networkStatus = NET_OFFLINE; // по умолчанию виджет "считает" что не подключен к сети
            this._event = EVENT_NO; // никаких состояний нет 
            this.mouseEnter = false; // сбрасываем индикатор нахождения мыши над виджетом

            // подготовка основной (родительский) панели виджета (все остальные элементы будут дочерний к этой панели)
            this.widgetHolder = this.parentPanel.appendChild(document.createElement("div"));
            this.widgetHolder.id = id + "BaseWidget"; // назначаем DOM HTML element.id панели (он должен быть уникален для всего DOM)
            this.widgetHolder.widget = this; // в дальнейшем эта панель будет использована в других потоках, сохраним ссылку на текущий виджет в ее свойстве
            //see: http://shoelace.io/
            //see: https://getbootstrap.com/docs/4.0/layout/grid/
            //container width  None (auto)  540px     720px    960px    1140px
            //Class prefix        col-     col-sm-  col-md-   col-lg-   col-xl- (1..12)
            //по умолчанию (когда длина меньше чем 540 - под два виджета на панель, когда больше 6 виджетов, более 960 - двенадцать виджетов 
            this.widgetHolder.className = "col-3 col-sm-2 col-lg-1 widgetHolder"; // назначаем Bootstrap класс для панели (одна ячейка из двенадцати по умолчанию) (в случае использования с Bootstrap)
            this.widgetHolder.style.cursor = "pointer"; // переопределяем тип курсора
            this.widgetHolder.onmouseover = this.mouseOver; // когда пользователь наведет мышью на виджет сработает этот обработчик события 
            this.widgetHolder.onmouseout = this.mouseOut; // когда пользователь уберет мышь этот обработчик 
            this.widgetHolder.style.display = "block";

            // вызываем функцию с отдельным потоком ожидания появления панели widgetHolder в текущем DOM
            // когда панель будет готова к использованию waitForElement() вызовет метод onWidgetHolderLoad() в этом объекте
            waitForElement(this.widgetHolder, this.onWidgetHolderLoad);

            // назначаем обработчик события body.onresize в этом объекте виджета, когда окно браузера изменит размер - виджет узнает об этом
            var body = document.getElementsByTagName("BODY")[0];
            // первый созданный виджет назначает обработчик для события body.onresize
            // если первый виджет будет удален - он переназначит обработчик другому (первому найденному) виджету 
            if (body.onresize == null) {
                body.onresize = this.onPanelResize;
            }
            // добавляем в body свойство body.widgets - массив всех созданных виджетов - если виджет первый он создаст это свойство
            if (body.widgets == undefined) {
                body.widgets = [];
            }
            // помещаем вновь созданный виджет в body.widgets[] массив
            body.widgets.push(this);
            // NOTЕ: "конструктор" завершается, далее waitForElement() вызовет onWidgetHolderLoad() для того что бы продолжить создание виджета            
        }
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // вызывается из потока ожидания когда WrapperHolder готов к пользованию (DOM properties ready)
        BaseWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            // так как метод будет вызван из другого потока, невозможно использовать this или прямую ссылку на объект
            // waitForElement поместит ссылку на widget в event.currentTarget
            var widgetHolder = event.currentTarget;
            // WrapperHolder содержит ссылку на "свой" виджет, изымаем ее, теперь widget ссылка на текущий виджет (смотрите метод "конструктор" выше)
            var widget = widgetHolder.widget;
            // onWidgetHolderLoad вызывается тогда когда widgetHolder получил DOM свойства - используем текущий DOM размер widgetHolder для масштабирования всех SVG элементов
            widget.size = widget.widgetHolder.clientWidth;

            // получив текущий масштаб готовим константы для расстановки SVG элементов внутри виджета
            widget.panding = widget.size / 25; // отступ от края виджета 1/25 его размера
            widget.halfPanding = widget.panding / 2;
            widget.radius = widget.size / 7; // для встроенных радиальных элементов
            widget.width = widget.size - widget.halfPanding; // внутренние размеры области прорисовки
            widget.height = widget.size - widget.halfPanding;
            widget.topMargin = widget.height / 20; // отступ от верхней границы
            widget.centreX = widget.width / 2 + widget.panding / 2; // центр по горизонтали
            widget.centreY = widget.height / 2; // центр по вертикали

            // инкапсулируем SVG ViewBox - все остальные SVG элементы будут помещены в него. Обратите внимание на масштаб. 
            widget.SVGViewBox = document.createElementNS(xmlns, "svg");
            widget.SVGViewBox.setAttributeNS(null, "viewBox", "0 " + "0 " + widget.size + " " + widget.size);
            widget.SVGViewBox.style.display = "block"; // HTML DOM -> https://www.w3schools.com/cssref/pr_class_display.asp

            // фоновая панель (подложка) виджета (фон и бордюр)
            widget.SVGBackgroundPanel = new SVGArc(widget.SVGViewBox, widget.id + "backgroundpanel", 0, 0, widget.width, 1);
            widget.SVGBackgroundPanel.drawRoundedRect(widget.width, widget.height, 5, 10, true, true, true, true);
            // панель для заголовка (верхняя часть виджета с его названием)
            widget.SVGHeaderPanel = new SVGArc(widget.SVGViewBox, widget.id + "headerpanel", 0, 0, widget.width, 1);
            widget.SVGHeaderPanel.drawRoundedRect(widget.width, 25, 5, 0, true, true, false, false);
            // нижняя панель виджета, отображает сетевое состояние
            widget.SVGBackdownpanel = new SVGArc(widget.SVGViewBox, widget.id + "backdownpanel", 0, widget.height - 10, widget.width, 1);
            widget.SVGBackdownpanel.drawRoundedRect(widget.width, 10, 5, 0, false, false, true, true);
            widget.SVGBackdownpanel.opacity = 0.9;
            widget.SVGBackdownpanel.fill = widgetsTheme.secondary;
            // основной текст виджета - обычно расположен в центре. Используется многими виджетами для отображения данных 
            // widget.size / 80 - размер шрифта текст относительно текущего масштаба widgetHolder
            widget.SVGWidgetText = new SVGText(widget.SVGViewBox, widget.id + "widgettext", widget.size / 80);
            widget.SVGWidgetText.opacity = 0.7;
            widget.SVGWidgetText.color = widgetsTheme.secondary;
            // текст для заголовка виджета, находится над SVGHeaderPanel панелью
            widget.SVGHeaderText = new SVGText(widget.SVGViewBox, widget.id + "headertext", widget.size / 150);
            widget.SVGHeaderText.color = widgetsTheme.success;
            // подпись внизу виджета, обычно информация о сетевом состоянии виджета (находится над SVGBackdownpanel)
            widget.SVGHint = new SVGText(widget.SVGViewBox, widget.id + "hint", widget.size / 150);
            widget.SVGHint.color = widgetsTheme.secondary;

            // подготавливаем градиент для спиннера (спиннер будет отображаться когда виджет уходит в состояния ожидания)
            var stop1 = document.createElementNS(xmlns, 'stop'); // первый фрагмент градиента 
            stop1.setAttribute('stop-color', widgetsTheme.info);
            stop1.setAttribute('stop-opacity', "0.7");
            stop1.setAttribute('offset', "0%");
            var stop2 = document.createElementNS(xmlns, 'stop'); // второй фрагмент градиента 
            stop2.setAttribute('class', 'stop2');
            stop2.setAttribute('stop-color', widgetsTheme.info);
            stop2.setAttribute('stop-opacity', "0.4");
            stop2.setAttribute('offset', "20%");
            var stop3 = document.createElementNS(xmlns, 'stop'); // третий фрагмент градиента 
            stop3.setAttribute('class', 'stop3');
            stop3.setAttribute('stop-color', widgetsTheme.info);
            stop3.setAttribute('stop-opacity', "0.0");
            stop3.setAttribute('offset', "60%");
            var gradient = document.createElementNS(xmlns, 'linearGradient'); // создаем градиент 
            gradient.id = widget.id + 'widgetspinnergradient'; //глобальное ID для этого градиента
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            gradient.appendChild(stop3);
            widget.SVGViewBox.appendChild(gradient); // SVGViewBox будет удерживать градиент в DOM                        
            // создаем спиннер
            widget.SVGArcSpinner = new SVGArc(widget.SVGViewBox, widget.id + "arcwidget", widget.centreX, widget.centreY + widget.topMargin, widget.size / 4, widget.size / 24);
            widget.SVGArcSpinner.color = 'url(#' + widget.id + 'widgetspinnergradient)'; // цвет спиннера - градиент 
            widget.SVGArcSpinner.opacity = 0.4; //полупрозрачный 

            // создаем эквалайзер 
            // состоит из множества элементов, каждый элемент находится в своем массиве (столбце), каждый такой массив в массиве столбцов
            // 30 столбцов по 5 элементов в каждом (150 элементов в эквалайзере)
            widget.eCount = 30; // эквалайзер из 30 секций
            widget.eWidth = widget.size / (widget.eCount + 50); // ширина эквалайзера
            widget.eRWidth = widget.width / 40; // ширина одного элемента
            widget.eHeight = widget.eWidth; // высота элемента
            widget.eX = widget.width / 2 - widget.eWidth * 2 * widget.eCount / 2 + widget.halfPanding / 2 + 2; // сдвиг слева 
            widget.eY = widget.height - widget.eHeight * 2 * 5 - 2; // сдвиг сверху
            widget.equalizerX = []; // массив для хранения элементов эквалайзера (столбцов с элементами)
            // инкапсулируем элементы эквалайзера
            for (var x = 0; x < widget.eCount; x++) { // движемся по колонкам слева направо 
                var equalizerY = []; // элементы одного столбца 
                for (var y = 0; y < 5; y++) { // 5 элементов в одном столбце 
                    // инкапсулируем каждый элемент и помещаем на свое место 
                    var SVGEqualizerpanel = new SVGRect(widget.SVGViewBox, widget.id + "equalizerpanel" + parseInt(x) + "_" + parseInt(y), widget.eX + x * widget.eWidth * 2, widget.eY + y * widget.eHeight * 2, widget.eRWidth, widget.eRWidth);
                    SVGEqualizerpanel.opacity = 0.0; // по умолчанию элемент не виден
                    SVGEqualizerpanel.fill = widgetsTheme.secondary;
                    // помещаем элемент в столбец
                    equalizerY.push(SVGEqualizerpanel);
                }
                // помещаем столбец с элементами в массив столбцов эквалайзера 
                widget.equalizerX.push(equalizerY);
            }
            // кнопки управления виджетом - отображаются в режиме "Редактирования виджета" (сдвиг влево, сдвиг вправо, удаление, настройка свойств виджета)
            // кнопки реализованы на основе SVGImage (Icons)
            widget.rowSize = widget.size / 6; // относительный размер одной кнопки 
            // кнопка сдвига влево
            // данные для прорисовки иконки кнопки "leftIcon" находится в DrawCore.js 
            widget.SVGLeftIcon = new SVGIcon(widget.SVGViewBox, leftIcon, widget.panding, widget.height - widget.rowSize, widget.rowSize, widget.rowSize);
            widget.SVGLeftIcon.fill = widgetsTheme.light;
            widget.SVGLeftIcon.SVGIcon.widget = widget;
            widget.SVGLeftIcon.SVGIcon.onclick = widget.moveLeft; // назначаем обработчик события по клику на эту кнопку (смотрите метод moveLeft())
            widget.SVGLeftIcon.hide(); // по умолчанию кнопка скрыта 
            // кнопка сдвига вправо
            widget.SVGRightIcon = new SVGIcon(widget.SVGViewBox, rightIcon, widget.width - widget.rowSize, widget.height - widget.rowSize, widget.rowSize, widget.rowSize);
            widget.SVGRightIcon.fill = widgetsTheme.light;
            widget.SVGRightIcon.SVGIcon.widget = widget;
            widget.SVGRightIcon.SVGIcon.onclick = widget.moveRight;
            widget.SVGRightIcon.hide();
            // кнопка удаления виджета 
            widget.SVGDeleteIcon = new SVGIcon(widget.SVGViewBox, deleteIcon, widget.width - widget.rowSize + widget.size / 28, 0, widget.rowSize, widget.rowSize);
            widget.SVGDeleteIcon.fill = widgetsTheme.light;
            widget.SVGDeleteIcon.SVGIcon.widget = widget;
            widget.SVGDeleteIcon.SVGIcon.onclick = widget.deleteWidgetClick;
            widget.SVGDeleteIcon.hide();
            // кнопка отображения диалога редактирования свойств виджета 
            widget.SVGPropertiesIcon = new SVGIcon(widget.SVGViewBox, buildIcon, widget.width / 2 - widget.rowSize / 2, widget.height - widget.rowSize, widget.rowSize, widget.rowSize);
            widget.SVGPropertiesIcon.fill = widgetsTheme.light;
            widget.SVGPropertiesIcon.SVGIcon.widget = widget;
            widget.SVGPropertiesIcon.SVGIcon.onclick = widget.propertiesClick;
            widget.SVGPropertiesIcon.hide();

            // помещаем созданные SVG элементы в панель widgetHolder 
            widget.widgetHolder.appendChild(widget.SVGViewBox);

            // применяем свойства отображения виджета по умолчанию (пользователь может изменять свойства виджета runtime, смотрите диалог редактирования свойств виджета)
            // NOTE:
            // вызов widget._properties не приводит к вызову setter "properties" (смотрите в этом объекте setter properties)
            // в свою очередь вызов widget.properties вызовет setter, который вызовет методы drawText() и drawWidget() - таким образом, изменив свойства отображения виджета и 
            // вызвав widget.properties = someNewProperties или даже widget.properties = widget.properties вы "заставите" виджет перерисовать SVG элементы и визуально изменить стиль.
            //      -> родительский объекты baseWidget намерено использует вызов widget._properties, не производит перерисовку SVG элементов
            //      -> все дочерние объекты baseWidget обязаны явно вызвать setter widget.properties в своих перезагруженных методах onWidgetHolderLoad и применить свои стили для SVG
            //      элементов виджета
            widget._properties = widget.defaultWidgetProperties();

            // применяем текущий размер widgetHolder к SVGViewBox
            widget.resize(widget.widgetHolder.clientWidth);
            // переводим виджет в режим WORK_MODE
            widget.mode = WORK_MODE;

            // NOTE:
            // BaseWidget не вызывает событие .onload - это обязаны сделать наследники этого объекта, для того что бы оповестить внешний код о завершении загрузки
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // отрисовка текстовых SVG элементов виджета
        BaseWidget.prototype.drawText = function drawText() {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет в состоянии удаления, не рисуем ничего

            if (this.SVGWidgetText == undefined) return; // если SVG элементы не готовы (не был вызван onWidgetHolderLoad()) и кто то обратился к этому методу 

            // центральный текст виджета, обычно отображает данные, помещаем в него текст  
            if (this.widgetText != undefined) { // если свойство уже определено внешним кодом
                this.SVGWidgetText.text = this.widgetText;
            }
            else { // иначе сбрасываем текст (что бы не печатать "undefined")
                this.SVGWidgetText.text = "";
            }
            // размер текста и размера шрифта могли изменится - пере центрируем текст внутри виджета 
            // также может изменится размер самого виджета и текст нуждается в новой центровке
            if (this.SVGWidgetText.width != 0) { // если текст не пуст (назначения не пустой строки в качестве текста виджета должно было изменить его ширину)
                this.SVGWidgetText.x = this.centreX - this.SVGWidgetText.width / 2; // центрируем по горизонтали 
                this.SVGWidgetText.y = this.centreY + this.SVGWidgetText.height / 2; // центрируем по вертикали 
            }

            // текст заголовка виджета 
            if (this._properties.headertext.value != undefined) {
                if (this.SVGHeaderText.text !== this._properties.headertext.value) { // если текст изменился 
                    this.SVGHeaderText.text = this._properties.headertext.value; // переносим текст в SVG элемент 
                    if (this.SVGHeaderText.width > this.size) { // если ширина текста более ширины виджета 
                        // вычисляем допустимое количество символов для заголовка (что бы умещались в ширину виджета)
                        var coef = this.SVGHeaderText.width / (this._properties.headertext.value.length + 3);
                        var charCount = (this.size - this.size / 3) / coef;
                        // отрезаем допустимое количество символов, дополняем строку "..."
                        this.SVGHeaderText.text = this._properties.headertext.value.slice(0, parseInt(charCount)) + "...";
                    }
                }
            }
            else {
                this.SVGHeaderText.text = "";
            }
            // центрируем текст заголовка 
            if (this.SVGHeaderText.width > 0) {
                this.SVGHeaderText.x = this.centreX - this.SVGHeaderText.width / 2;
                this.SVGHeaderText.y = this.SVGHeaderText.height;
            }

            // цвета текстовых SVG элементов, зависят от сетевого статуса виджета 
            switch (this._networkStatus) {
                case NET_ONLINE: // когда виджет онлайн 
                    // toColor() - метод реализующий плавную смену градиентов цвета (анимация)
                    // this._properties.valuetextcolor.value свойства виджета определяющее цвет главного текста в онлайн режиме (пользователь может назначить свой цвет)
                    this.toColor(this.SVGWidgetText, this._properties.valuetextcolor.value);
                    this.toColor(this.SVGHeaderText, widgetsTheme.info);
                    this.SVGHint.text = getLang("rid_online"); // назначаем текст для нижней подписи виджета (сетевой статус) в этом кейсе
                    this.toColor(this.SVGHint, widgetsTheme.success);
                    break;
                case NET_ERROR: // ошибка сети
                    this.toColor(this.SVGWidgetText, widgetsTheme.danger);
                    this.toColor(this.SVGHeaderText, widgetsTheme.danger);
                    this.SVGHint.text = getLang("rid_error");
                    this.toColor(this.SVGHint, widgetsTheme.danger);
                    break;
                case NET_RECONNECT: // пере подключение (при таком статусе виджет ожидает соединения с сетью)
                    this.toColor(this.SVGWidgetText, widgetsTheme.info);
                    this.toColor(this.SVGHeaderText, widgetsTheme.info);
                    this.SVGHint.text = getLang("rid_connect");
                    this.toColor(this.SVGHint, widgetsTheme.info);
                    break;
                default:
                    //по умолчанию виджет оффлайн, не подключен к сети 
                    this.toColor(this.SVGWidgetText, widgetsTheme.secondary);
                    this.toColor(this.SVGHeaderText, widgetsTheme.secondary);
                    this.SVGHint.text = getLang("rid_offline");
                    this.toColor(this.SVGHint, widgetsTheme.secondary);
                    break;
            }

            // центрируем нижний текст виджета, сетевой статус
            if (this.SVGHint != 0) {
                this.SVGHint.x = this.centreX - this.SVGHint.width / 2;
                this.SVGHint.y = this.height - this.SVGHint.height / 2;
            }
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // отрисовка векторных-графических SVG элементов виджета
        BaseWidget.prototype.drawWidget = function drawWidget() {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
            if (this.SVGBackgroundPanel == undefined) return; // если SVG элементы виджета не готовы ничего не делаем (не был вызван onWidgetHolderLoad())

            // назначаем цвет фона и бордюра фоновой панели
            // this._properties.bordercolor.value свойство виджета хранящая цвет (может быть изменено пользователем - по этой причине переопределяем цвет)
            this.SVGBackgroundPanel.color = this._properties.bordercolor.value;
            this.SVGBackgroundPanel.fill = this._properties.backgroundcolor.value;
            this.SVGBackgroundPanel.opacity = this._properties.backgroundopacity.value; // прозрачность фона виджета так же может меняться
            // назначаем цвет панели заголовка 
            this.SVGHeaderPanel.opacity = this._properties.headeropacity.value;
            this.SVGHeaderPanel.fill = this._properties.headercolor.value;

            // в зависимости от состояния сети, цвет нижней панели виджета меняется 
            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.SVGBackdownpanel.fill = widgetsTheme.success;
                    break;
                case NET_ERROR:
                    this.SVGBackdownpanel.fill = widgetsTheme.danger;
                    break;
                case NET_RECONNECT:
                    this.SVGBackdownpanel.fill = widgetsTheme.info;
                    break;
                default:
                    this.SVGBackdownpanel.fill = widgetsTheme.light;
                    break;
            }

            // рисуем эквалайзер если соответствующий флажок установлен в true
            if (this._properties.showequalizer.value === 'true') {
                for (var x = 0; x < this.eCount; x++) { // обходим все столбцы 
                    var equalizerY = this.equalizerX[x];
                    for (var y = 0; y < 5; y++) { // обходим все элементы в столбцах 
                        if (this._networkStatus == NET_ONLINE) { // если виджет онлайн делаем элемент видимым
                            equalizerY[y].fill = widgetsTheme.secondary; // цвет каждого элемента по умолчанию "неактивен" 
                            equalizerY[y].opacity = (y + 1) * 0.08;
                        } else { // если виджет оффлайн скрываем все элементы эквалайзера 
                            equalizerY[y].opacity = 0.0;
                        }
                    }
                }
                // отмечаем активные элементы эквалайзера 
                if (this._networkStatus == NET_ONLINE) { // если он онлайн 
                    if (this.historyData != undefined) { // если виджету назначили historyData
                        // historyData - CSV строка в специальном формате, при помощи которой внешний код передает виджету данные для отображения в эквалайзере
                        // формат historyData:
                        // количество_элементов;значение_float_первого_элемента;значение_float_второго_элемента;...значение_float_последнего_элемента;
                        // номер последнего_элемента = количество_элементов
                        var splitHistory = this.historyData.split(";"); // парсим содержимое CSV в массив строк
                        var count = splitHistory[0]; // вынимаем количество_элементов
                        var prop = count / this.eCount; // сопоставляем количество присланных элементов с количеством столбцов эквалайзера 
                        var bigValue; // переменная для поиска самого большого значения элемента, изначально undefined
                        // ищем элемент с самым большим значением и помещаем это значение в bigValue
                        for (var x = 0; x < count; x++) {
                            var equalizerY = this.equalizerX[parseInt(x / prop)];
                            var value = splitHistory[x + 1];
                            if (bigValue == undefined || value > bigValue) {
                                bigValue = value;
                            }
                        }
                        // в высоту эквалайзер состоит из 5 элементов, вычисляем шаг возрастания значения элементов исходя из значения самого большого
                        // например если самое большое значение 100, а значение для текущего столбца 30 то:
                        // 100 / 5 = 20 (20 шаг для элементов снизу вверх)
                        // первый элемент с низу 20, выше 40, еще выше 60 и так далее до 100
                        // 20 < 30 - отображаем первый элемент снизу
                        // 40 > 30 - второй и все элементы выше не отображаются 
                        var propValue = parseFloat(bigValue / 5);

                        //обходим все элементы эквалайзера и определяем их цвет для текущих значений historyData
                        for (var x = 0; x < count; x++) { // столбцы 
                            if (count < this.eCount) { // количество данных в historyData может не соответствовать количеству столбцов
                                var equalizerY = this.equalizerX[x]; // если данных меньше 
                            } else { // если данных больше "уплотняем" эквалайзер 
                                var equalizerY = this.equalizerX[parseInt(x / prop)];
                            }
                            // вынимаем значение для текущего столбца, учитывая выравнивание всех столбцов относительно столбца с самым большим значением
                            var value = parseInt(splitHistory[x + 1] / propValue);
                            // value значение данных для текущего столбца, превращенное в количество видимых (окрашенных) элементов снизу-вверх
                            for (var y = 0; y < value; y++) { // изменяем цвет только для элементов согласно текущему значению historyData - относительно значения самого большого элемента из нее
                                equalizerY[4 - y].opacity = (1.0 - parseFloat(y / 4.0)) / 2.0; // прозрачность элемента зависит от его позиции относительно по высоте (самые нижние ярче)
                                equalizerY[4 - y].fill = widgetsTheme.success;
                            }
                        }
                    }
                }
            }
            else { // если эквалайзер отключен, прячем его элементы 
                for (var x = 0; x < this.eCount; x++) {
                    var equalizerY = this.equalizerX[x];
                    for (var y = 0; y < 5; y++) { equalizerY[y].opacity = 0.0; }
                }
            }
            // когда сетевое состояние виджета находится в режиме - пере подключение, отображаем спиннер (анимация)           
            if (this._networkStatus == NET_RECONNECT) {
                this.spinnerAngle += 1.5; // приращение угла вращения спиннера (влияет на скорость вращения, чем больше угол тем быстрее и на оборот)

                if (this.SVGArcSpinner.opacity < 0.8) { // постепенно наращиваем непрозрачность спиннера  
                    this.SVGArcSpinner.opacity += 0.01;
                }
                // рисуем спиннер с вращением на новый угол
                this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
                var _this = this;
                // готовим поток для анимации, браузер вызовет метод drawWidget() когда очередной анимационный фрейм будет возможен 
                // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
                // TODO: привязку ко времени 
                requestAnimationFrame(function () {
                    return _this.drawWidget();
                });
            } else { // если сетевой статус не NET_RECONNECT, прячем спиннер, не вызываем анимацию
                this.SVGArcSpinner.opacity = 0.0;
                this.SVGArcSpinner.hide();
            }
        };

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // вызывается в тот момент когда widgetHolder панель получила свой размер в DOM и виджет должен корректировать свой масштаб согласно новым размерам widgetHolder панели
        BaseWidget.prototype.resize = function resize(size) {
            this.size = size; // сохраняем текущий размер в свойстве виджета            
            if (this.SVGWidgetText == undefined) return; // если виджет "не готов" (не инкапсулированы SVG элементы) выходим
            // все SVG элементы расположенный в SVGViewBox - изменение его размеров повлияет не размеры остальных элементов
            this.SVGViewBox.setAttributeNS(null, "width", size);
            this.SVGViewBox.setAttributeNS(null, "height", size);
        }

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик события document...body.onresize(), вызывается когда браузер меняет свой размер 
        // NOTE: только один виджет назначает body этот обработчик
        BaseWidget.prototype.onPanelResize = function onPanelResize() {
            //see: https://ryanve.com/lab/dimensions/
            //see: https://coderwall.com/p/wpjw4w/change-the-bootstrap-navbar-breakpoint
            var switchToMobile = 768;
            var body = document.getElementsByTagName("BODY")[0]; // ранее, в "конструкторе" мы добавили body свойство widget[] - массив всех созданных виджетов (каждый новый виджет добавляет себя в этот массив)
            for (var widgetKey in body.widgets) { //перечисляем все виджеты и изменяем их размер
                var widget = body.widgets[widgetKey]; // изымаем очередной виджет

                if (window.innerWidth < switchToMobile) {
                    // widget.widgetHolder.className = "col-sm-2";
                }
                else {
                    //widget.widgetHolder.className = "col-sm-1";
                }

                widget.resize(widget.widgetHolder.clientWidth); // меняем размер
            }
        }

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // создает и отображает модальный диалог со свойствами виджета - пользователь может редактировать эти свойства
        // так как вызывается по клику из другого потока, связывается со своим объектом через параметр widget
        BaseWidget.prototype.showProperties = function showProperties(widget) {
            // будет использована для сохранения значений текущих свойств виджета
            widget.storedProperties = {};
            // находим индекс widgetHolder в панеле виджетов widget.parentPanel
            widget.inParentIndex = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.widgetHolder);
            // так как используется bootstrap и виджет будет перенесен в другую панель, запоминаем его текущий bootstrap класс
            widget.inParentClass = widget.widgetHolder.className;
            // удаляем widgetHolder из панели виджетов
            widget.parentPanel.removeChild(widget.widgetHolder);
            // меняем bootstrap класс (обычно с одной ячейки на четыре)
            widget.widgetHolder.className = "col-sm-4";
            // переключаем виджет в режим "работа" - мы будем отображать виджет в диалоге свойств в этом режиме (без кнопок)
            widget.mode = WORK_MODE;
            // подготавливаем  модальный диалог (смотрите функцию makeModalDialog() - она создает универсальные модальные диалоги, где "showProperties" префикс для ID)
            var propDialog = createModalDialog(getLang("showproperties"), "");
            // заполняем modalBody и modalFooter элементами отображающими свойства данного виджета
            // создаем панель в верхней части диалога в которой будем отображать виджет - пользователь сможет видеть результаты изменения свойств виджета
            var widgetDiv = propDialog.formGroup.appendChild(document.createElement("div"));
            widgetDiv.className = "driversWidgetsPanel d-flex justify-content-center widget-editor-panel";
            widgetDiv.appendChild(widget.widgetHolder);

            // свойств очень много - модальный диалог может получится слишком длииным и не влазить в окно браузера, что не очень удобно для пользователя
            // по этому свойства виджета будут размещены в закладках внутри диалога 
            // создаем панель закладок 
            var propUl = propDialog.formGroup.appendChild(document.createElement("ul"));
            propUl.className = "nav nav-tabs widget-editor-nav-tabs";

            var tabContent = propDialog.formGroup.appendChild(document.createElement("div"));
            tabContent.className = "tab-content";

            // размещаем редакторы свойств виджета в закладках диалога 
            var isFirstTab = true; // простой способ определить первое свойство при использование for в режиме энумератора 
            for (var key in widget.properties) { // перебираем все свойства виджета 
                // сохраняем значения текущего свойства (если позже пользователь откажется от изменений (кнопка отмена или закрытие диалога без подтверждения сохранения))
                widget.storedProperties[key] = {
                    tab: widget.properties[key].tab,
                    value: widget.properties[key].value,
                    type: widget.properties[key].type
                }
                // узнаем закладку текущего свойства (смотрите метод defaultWidgetProperties() что бы понять как устроен объект свойств)
                var tabName = widget.properties[key].tab; // можно указать свое название закладки, если не использовать 'G', 'C', 'O'
                if (tabName === 'G') { tabName = "General"; } // дешифруем имя закладки 
                else
                    if (tabName === 'C') { tabName = "Color"; }
                    else
                        if (tabName === 'O') { tabName = "Opacity"; }

                // используем название закладки как часть ее DOM.element.id и узнаем создана ли эта закладка ранее 
                var tabPane = document.getElementById(tabName + "PropTab");
                var formGroup = document.getElementById(tabName + "PropForm");
                if (formGroup == null) { // если закладка еще не создана - создадим ее 
                    // создаем новую кнопку (TAG "li" - не кнопку конечно, но bootstrap представит ее в виде кнопки) с ссылкой в панеле закладок 
                    var propLi = propUl.appendChild(document.createElement("li"));
                    propLi.className = "nav-item";
                    var aHref = propLi.appendChild(document.createElement("a")); // ссылка для закладки
                    aHref.setAttribute("data-toggle", "tab");
                    aHref.href = "#" + tabName + "PropTab"; // id панели для закладки связываем с ссылкой из самой закладки 
                    aHref.innerText = tabName; // название закладки 
                    // создаем панель связанную с закладкой 
                    tabPane = tabContent.appendChild(document.createElement("div"));
                    tabPane.id = tabName + "PropTab";
                    formGroup = tabPane.appendChild(document.createElement("div"));
                    formGroup.className = "form-group";
                    formGroup.id = tabName + "PropForm"; // связываем панель с ссылкой 
                    // если мы создаем первую закладку в панеле 
                    if (isFirstTab) { // сделаем ее активной по умолчанию 
                        aHref.className = "nav-link active";
                        tabPane.className = "tab-pane fade show active";
                        isFirstTab = false; // все остальные закладки не первые 
                    }
                    else { // не первые закладки не активны 
                        aHref.className = "nav-link";
                        tabPane.className = "tab-pane fade";
                    }
                }
                // редакторы свойств реализованы с использованием bootstrap input-group - для более "удобного" внешнего вида
                // создаем редактор очередного свойства виджета 
                var inputGroup = formGroup.appendChild(document.createElement("div"));
                inputGroup.className = "input-group input-group-sm mb-3";

                var prependDiv = inputGroup.appendChild(document.createElement("div"));
                prependDiv.className = "input-group-prepend";
                // название свойства 
                var label = prependDiv.appendChild(document.createElement("label"));
                label.className = "input-group-text smlabel";
                label.setAttribute("for", "hostEdit");
                label.innerText = key;
                // редактор свойства
                // свойство виджета представлено классом, свойство type которого определяет тип свойства - целое число, число со знаком, цвет и так далее 
                // функция createValueEdit реагирует на type и создает соответствующий редактор (например comboBox с палитрой цветов если type = 'c' [color])
                var propEdit = createValueEdit(inputGroup, widget.properties[key].name, widget.properties[key].value, widget.properties[key].type);
                propEdit.style.width = "";
                propEdit.className = "form-control"; // form-control-sm
                propEdit.placeholder = "type value here";
                propEdit.id = "widgetproperty" + key;
                // связываем редактор со свойством виджета - когда пользователь будет изменять в редакторе значения свойств - виджет будет тут же отображать полученный результат
                propEdit.widgetProperty = widget.properties[key];
                // связываем редактор с виджетом
                propEdit.widget = widget;
                // события редактора propEdit.onchange может быть использовано createValueEdit() и другими, ниже мы переопределим этот обработчик - сейчас сохраним в propEdit адрес старого обработчика
                propEdit.originalOnChange = propEdit.onchange;
                // виджет привязывается к событиям редактора и если пользователь что то изменит, виджет среагирует на это
                propEdit.onchange = widget.onPropertyChange;
                propEdit.onkeyup = widget.onPropertyChange;
            } // очередное свойство добавлено, возвращаемся и добавляем следующее в соответствующею закладку

            // кнопка "Применить ко всем", ее придется создать с нуля и добавить в modalFooter элемент  
            // нажатие на эту кнопку приведет к тому, что значения свойств текущего виджета, будут применены ко всем виджетам 
            // это очень удобно если необходимо глобально изменить стиль всех виджетов
            // но так же это опасно, потому как все виджеты изменят свои свойства по эталонну из этого виджета
            var setAllWidgetsPropButton = createButton("allwidgetsModalButton", "btn btn-sm btn-warning", getLang("setallwidgetspropbutton"));
            setAllWidgetsPropButton.button.onclick = widget.setAllWidgetsProperties;
            setAllWidgetsPropButton.button.widget = widget;
            setAllWidgetsPropButton.button.propDialog = propDialog;
            propDialog.footer.appendChild(setAllWidgetsPropButton.button);

            //Show dialog 
            propDialog.widget = widget;
            propDialog.onOK = widget.setProperties;
            propDialog.show();
        };

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик клика на кнопку "Применить" для диалога редактирования свойств виджета 
        BaseWidget.prototype.setProperties = function setProperties(propDialog) {
            // запрещаем все последующие обработчики
            //event.stopPropagation();
            // получаем ссылку на нажатую кнопку из события
            //var button = event.currentTarget;
            // получаем ссылку на виджет из свойства кнопки (свойство добавлено при создании кнопки)
            var widget = propDialog.widget;
            // изымаем виджет из диалога
            widget.widgetHolder.parentElement.removeChild(widget.widgetHolder);
            // возвращаем виджет в панель виджетов
            widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[widget.inParentIndex]);
            // возвращаем bootstrap класс виджета 
            widget.widgetHolder.className = widget.inParentClass;
            // возвращаем режим виджета (отображаем кнопки управления виджета)
            widget.mode = MOVE_MODE;
            // сохраняем измененные свойства виджета в памяти микроконтроллера
            widget.doOnChange();
            // смотрите showProperties()-$('#showPropertiesModal').on('hidden.bs.modal', function (event) 
            // сообщаем обработчику закрытия диалога о том что мы обработали закрытие
            return true;
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик клика на кнопку "Применить ко всем" для диалога редактирования свойств виджета 
        BaseWidget.prototype.setAllWidgetsProperties = function setProperties(event) {
            // так же как для setProperties() - получаем ссылку на виджет, переносим его в панель виджетов
            event.stopPropagation();
            var setAllWidgetsPropButton = event.currentTarget;
            var widget = setAllWidgetsPropButton.widget;
            widget.widgetHolder.parentElement.removeChild(widget.widgetHolder);
            widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[widget.inParentIndex]);
            widget.widgetHolder.className = widget.inParentClass;
            widget.mode = MOVE_MODE;

            // находим все виджеты в системе, применяем измененные свойства текущего виджета ко всем 
            var body = document.getElementsByTagName("BODY")[0];
            for (var widgetKey in body.widgets) {
                var someWidget = body.widgets[widgetKey];
                // перечисляем все свойства очередного виджета
                for (var key in someWidget.properties) {
                    if (key === 'headertext') continue; // игнорируем свойства содержащее текст для заголовка виджета - они у всех виджетов разные
                    // диалог редактирования свойств виджета еще не закрыт, и мы знаем название текущего свойства 
                    // пробуем найти редактор свойства для свойства с текущем именем (key)
                    // NOTE:
                    // все виджеты наследники BaseWidget и многие свойства у них одинаковы, но у разных виджетов будут уникальные свойства
                    // если у "эталонного" виджета (значение свойств которого сейчас применяем ко всем виджетам) не существует свойства как у текущего виджета - не найдем и не изменим его
                    // таким образом если у вас на панели виджетов - три виджета температуры, один влажности и один график, и вы редактировали виджет температура -
                    // свойства "цвет дона" и "тип температуры Цельсий - Фаренгейт" --> фон изменится у всех виджетов, а тип температуры только у виджетов температуры. 
                    var propEdit = document.getElementById("widgetproperty" + key);
                    if (propEdit != null) { //редактор свойства найден  
                        someWidget.properties[key].value = propEdit.value; //используем его значение в качестве нового значения свойства очередного виджета
                    }
                }
                // все свойства очередного виджета перечислены и им назначены новые значения - обратимся к setter .properties для того что бы виджет перерисовал свои SVG элементы
                someWidget.properties = someWidget.properties;
            }
            // сохраняем изменения

            widget.doOnChange();
            // так же как для setProperties(), взводим setProp, закрываем диалог
            setAllWidgetsPropButton.propDialog.hide();
            //document.getElementById("showPropertiesModal").setProp = true;
            //$("#showPropertiesModal").modal('hide');            
            return false;
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик клика на кнопки "Закрыть", "Отменить" для диалога редактирования свойств виджета 
        // так же вызывается самим модальным диалогом в момент его закрытия (если не нажаты "наши" кнопки, но диалог все равно закрывается)
        BaseWidget.prototype.discardProperties = function discardtProperties(event) {
            //event может быть создан не событием и только содержать event.currentTarget, смотрите $('#showPropertiesModal').on('hidden.bs.modal', function (event) в showProperties()
            if (event.stopPropagation != undefined) {
                event.stopPropagation();
            }
            // так же как для setProperties() - получаем ссылку на виджет, переносим его в панель виджетов
            var button = event.currentTarget;
            var widget = button.widget;
            widget.widgetHolder.parentElement.removeChild(widget.widgetHolder);
            widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[widget.inParentIndex]);
            widget.widgetHolder.className = widget.inParentClass;
            widget.mode = MOVE_MODE;
            // возвращаем ранее сохраненные значения свойств виджета смотрите showProperties()
            // используем setter properties - виджет применит сохранные свойства ко всем своим SVG элементам 
            widget.properties = widget.storedProperties;
            // так же как для setProperties(), взводим setProp, закрываем диалог
            document.getElementById("showPropertiesModal").setProp = true;
            $("#showPropertiesModal").modal('hide');
            // NOTE:
            // диалог закроется без вызова $("#showPropertiesModal").modal('hide');
            // потому что кнопкам был задан атрибуты button.setAttribute("data-dismiss", "modal") и button.setAttribute("aria-label", "Close")
            // смотрите функцию makeModalDialog
            return false;
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик события вызывается всеми редакторами свойств виджета, когда пользователь меняет им значение 
        BaseWidget.prototype.onPropertyChange = function onPropertyChange(event) {
            var propEdit = event.currentTarget;
            var widget = propEdit.widget;
            for (var key in widget.properties) {
                var _propEdit = document.getElementById("widgetproperty" + key);
                widget.properties[key].value = _propEdit.value;
            }
            widget.properties = widget.properties;
            if (propEdit.originalOnChange != undefined) {
                propEdit.originalOnChange(event);
            }
            return true;
        };

        BaseWidget.prototype.moveLeft = function moveLeft(event) {
            var widget = event.currentTarget.widget;
            if (widget.mode == MOVE_MODE) {
                var index = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.widgetHolder);
                widget.parentPanel.removeChild(widget.widgetHolder);
                widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[index - 1]);
            }
            return true;
        };

        BaseWidget.prototype.moveRight = function moveRight(event) {
            var widget = event.currentTarget.widget;
            if (widget.mode == MOVE_MODE) {
                var index = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.widgetHolder);
                widget.parentPanel.removeChild(widget.widgetHolder);
                widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[index + 1]);
            }
            return true;
        };
        BaseWidget.prototype.propertiesClick = function movepropertiesClick(event) {
            event.stopPropagation();
            var widget = event.currentTarget.widget;
            if (widget.mode == MOVE_MODE) {
                widget.showProperties(widget);
            }
            return true;
        };
        BaseWidget.prototype.plusSize = function plusSize(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                widget.SVGViewBox.setAttributeNS(null, "width", widget.width += 25);
                widget.SVGViewBox.setAttributeNS(null, "height", widget.height += 25);
            }

            return true;
        };
        BaseWidget.prototype.deleteWidget = function deleteWidget() {
            //this.event это setter, такое обращение приведет к оповещению всех подписантов на события виджета о текущем событии в виджете
            this.event = EVENT_DELETE;
            this.doOnDelete();
            var body = document.getElementsByTagName("BODY")[0];
            if (body.onresize == this.onPanelResize) {
                body.onresize = null;
                for (var widgetKey in body.widgets) {
                    var someWidget = body.widgets[widgetKey];
                    if (someWidget != this) {
                        body.onresize = someWidget.onPanelResize;
                        break;
                    }
                }
            }

            body.widgets.splice(body.widgets.indexOf(this), 1);
            while (this.SVGViewBox.childNodes.length != 0) {
                this.SVGViewBox.removeChild(this.SVGViewBox.childNodes[0]);
            }

            this.widgetHolder.removeChild(this.SVGViewBox);
            this.parentPanel.removeChild(this.widgetHolder);
            this.widgetHolder.innerHTML = "";

            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    delete this[key];
                }
            }
        };

        BaseWidget.prototype.deleteWidgetClick = function deleteWidgetClick(event) {
            var widget = event.currentTarget.widget;
            if (widget.mode == MOVE_MODE) {
                widget.deleteWidget();
                widget = null;
            }
            return true;
        };

        BaseWidget.prototype.modeChangeClick = function modeChangeClick(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == WORK_MODE) {
                widget.mode = MOVE_MODE;
            } else {
                widget.mode = WORK_MODE;
            }
            return true;
        };

        BaseWidget.prototype.clickableToTop = function clickableToTop() {
            this.SVGViewBox.insertBefore(this.SVGWidgetText.SVGText, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGLeftIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGRightIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild); // this.SVGViewBox.insertBefore(this.SVGPlusIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGDeleteIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGPropertiesIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
        };


        BaseWidget.prototype.mouseOver = function mouseOver(event) {
            var widget = event.currentTarget.widget;
            widget.mouseEnter = true;
            widget.drawMouseEnter();
            return true;
        };

        BaseWidget.prototype.mouseOut = function mouseOut(event) {
            var widget = event.currentTarget.widget;
            widget.mouseEnter = false;
            widget.drawMouseEnter();
            return true;
        };

        BaseWidget.prototype.refresh = function refresh(data, widgetText, label, historyData) {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; }

            if (this._data == data && this.widgetText == widgetText && this._properties.headertext == label) return;

            if (this._properties.headertext.value === '---') {
                this._properties.headertext.value = label;
            }
            if (this.widgetText != widgetText) {
                speak(this._properties.headertext + " " + widgetText);
            }
            this.historyData = historyData;
            this._data = data;
            this.widgetText = widgetText;
            this.spinnerAngle = 0;
            this.redrawAll();
        };

        BaseWidget.prototype.redrawAll = function redrawAll() {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; }

            var _this = this;
            this.starttime = 0;
            requestAnimationFrame(function () {
                return _this.drawWidget();
            });
            this.drawText();
        };

        BaseWidget.prototype.toColor = function toColor(element, color, method) {
            if (method == undefined) method = true;
            if (element == null) return;

            if (element.animantion == null) {
                element.animantion = false;
            }

            if (element.animantion) {
                element.animantion = false;
                window.cancelAnimationFrame(element.animantionFrame);
                this.animateColor(element, color, method);
            }
            element.animantion = true;
            this.animateColor(element, color, method);
        };

        BaseWidget.prototype.animateColor = function animateColor(element, color, method) {
            var _this2 = this;
            if (!element.animantion) return;
            var rgbSrc = element.colorRGB;
            var rgbDst = colorToRGB(color);

            if (rgbSrc[0] == rgbDst[0] && rgbSrc[1] == rgbDst[1] && rgbSrc[2] == rgbDst[2]) {
                window.cancelAnimationFrame(element.animantionFrame);
                element.animantion = false;
                return;
            }

            if (rgbSrc[0] != rgbDst[0]) if (rgbSrc[0] < rgbDst[0]) rgbSrc[0]++; else rgbSrc[0]--;
            if (rgbSrc[1] != rgbDst[1]) if (rgbSrc[1] < rgbDst[1]) rgbSrc[1]++; else rgbSrc[1]--;
            if (rgbSrc[2] != rgbDst[2]) if (rgbSrc[2] < rgbDst[2]) rgbSrc[2]++; else rgbSrc[2]--;
            element.colorRGB = rgbSrc;

            if (!method) {
                element.fillRGB = rgbSrc;
            }

            if (element.animantion) {
                element.animantionFrame = window.requestAnimationFrame(function () {
                    return _this2.animateColor(element, color, method);
                });
            }
        };
        //Изменение яркости видждета при наведения мыши, учитывает два варианта - при наведение становится ярче, либо угосает. 
        BaseWidget.prototype.drawMouseEnter = function drawMouseEnter() {
            if (this._mode != WORK_MODE) return;
            var _this = this;
            var lamda = 0.05; //становится ярче
            if (this._properties.backgroundselectopacity.value > this._properties.backgroundopacity.value) {
                lamda = -0.05; //угасает
            }
            if (this.mouseEnter) {
                if (this.SVGBackgroundPanel.opacity * lamda > this._properties.backgroundselectopacity.value * lamda) {
                    this.SVGBackgroundPanel.opacity -= lamda;
                    requestAnimationFrame(function () {
                        return _this.drawMouseEnter();
                    });
                }
            } else {
                if (this.SVGBackgroundPanel.opacity * lamda < this._properties.backgroundopacity.value * lamda) {
                    this.SVGBackgroundPanel.opacity += lamda;
                    requestAnimationFrame(function () {
                        return _this.drawMouseEnter();
                    });
                }
            }
        };
        // возвращает объект свойств виджета по умолчанию - цвета, прозрачность, основные размеры элементов, все дочерний виджеты наследуют и дополняют эти свойства
        // виджет вызывает эту функцию что бы настроить свой стиль отображения по умолчанию. Программа или пользователь могут менять эти свойства, создавая новые стили виджета
        // ConfigCore.js сохраняет новые и измененные свойства виджетов в память микроконтроллера.
        BaseWidget.prototype.defaultWidgetProperties = function defaultWidgetProperties() {
            /*
            каждое свойство виджета представлено отдельным объектом с тремя собственными свойствами(у всех свойств эти объекты одинаковы)    
            название_свойства: {
                tab: -> код или имя закладки для диалога управления свойствами виджета, допустимы коды:
                "G" - закладка General
                "C" - закладка Color
                "O" - закладка Opacity
                если значение поля не G C O, то допустимо любое значение, соответствующая закладка появится в диалоге свойств
                эелемнт управления свойством объекта будет помещен в указанную закладку
                value: -> значение свойства
                type: -> тип свойства(флажок):
                "i" - integer
                "f" - float
                "b" - boolean
                "c" - color
                "p" - password(*** значение свойства будет замаскировано)
                "s" - selected - редактор значения свойства будет выделен отдельным цветом
            }
            */
            return { // вернем созданный объект как результат этой функции
                headertext: { // свойство виджета - текст заголовка (верхний текст в виджете, по умолчанию "---")
                    tab: "G", // закладка General
                    value: "---",
                    type: "s" // редактор выделен
                },

                headercolor: { // цвет панели заголовка           
                    tab: "C", // закладка Colors
                    value: widgetsTheme.secondary,
                    type: "c" // тип редактора - редактор цветов
                },

                headeropacity: { // прозрачность панели заголовка            
                    tab: "O",
                    value: 0.1,
                    type: "f"
                },

                backgroundcolor: { // цвет фона виджета           
                    tab: "C",
                    value: widgetsTheme.dark,
                    type: "c"
                },

                backgroundopacity: { // прозрачность фона          
                    tab: "O",
                    value: 0.6,
                    type: "f"
                },

                bordercolor: { // цвет бордюра           
                    tab: "C",
                    value: widgetsTheme.secondary,
                    type: "c"
                },

                backgroundselectopacity: { // прозрачность фона виджета когда пользователь указал на него мышью           
                    tab: "O",
                    value: 0.9,
                    type: "f"
                },

                valuetextcolor: { // цвет основного текста виджета (обычно этот текст отображает данные переданные через метод refresh())            
                    tab: "C",
                    value: widgetsTheme.info,
                    type: "c"
                },

                showequalizer: { // отображать эквалайзер          
                    tab: "G",
                    value: 'false',
                    type: "b"
                }
            }
        };
        BaseWidget.prototype.doOnLoad = function doOnLoad() {
            if (this._onload != undefined) {
                for (var key in this._onload) {
                    this._onload[key](this);

                }
            }
        };
        BaseWidget.prototype.doOnChange = function doOnChange() {
            if (this._onchange != undefined) {
                for (var key in this._onchange) {
                    this._onchange[key](this);
                }
            }
        };
        BaseWidget.prototype.doOnDelete = function doOnDelete() {
            if (this._ondelete != undefined) {
                for (var key in this._ondelete) {
                    this._ondelete[key](this);
                }
            }
        };

        _createClass(BaseWidget, [
            {
                key: "mode",
                set: function set(mode) {
                    if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                    this._mode = mode;
                    if (mode == WORK_MODE) {
                        this.SVGBackgroundPanel.opacity = this._properties.backgroundopacity.value;
                        this.SVGLeftIcon.hide();
                        this.SVGRightIcon.hide(); //  this.SVGPlusIcon.hide();

                        this.SVGDeleteIcon.hide();
                        this.SVGPropertiesIcon.hide();

                    } else if (mode == MOVE_MODE) {
                        this.SVGBackgroundPanel.opacity = this._properties.backgroundopacity.value / 3;
                        this.SVGLeftIcon.draw();
                        this.SVGRightIcon.draw(); //   this.SVGPlusIcon.draw();

                        this.SVGDeleteIcon.draw();
                        this.SVGPropertiesIcon.draw();
                    }
                },
                get: function get() {
                    return this._mode;
                }
            }, {
                key: "networkStatus",
                get: function get() {
                    return this._networkStatus;
                },
                set: function set(networkStatus) {
                    if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                    if (networkStatus >= NET_OFFLINE && networkStatus <= NET_RECONNECT) {
                        this._networkStatus = networkStatus;
                        this.redrawAll();
                    }
                }
            },
            {
                key: "properties",
                get: function get() {
                    return this._properties;
                },
                set: function set(properties) {
                    if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                    if (properties == undefined) return;
                    this._properties = properties;
                    this.drawText();
                    this.drawWidget();
                }
            },
            {
                key: "data",
                get: function get() {
                    return this._data;
                },
                set: function set(data) {
                    if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                    this._data = data;
                    this.redrawAll();
                }
            },
            {
                key: "onload",
                set: function set(onload) {
                    if (this._onload == undefined) {
                        this._onload = [];
                    }
                    this._onload.push(onload);
                }
            },
            {
                key: "onchange",
                set: function set(onchange) {
                    if (this._onchange == undefined) {
                        this._onchange = [];
                    }
                    this._onchange.push(onchange);
                }
            },
            {
                key: "ondelete",
                set: function set(ondelete) {
                    if (this._ondelete == undefined) {
                        this._ondelete = [];
                    }
                    this._ondelete.push(ondelete);
                }
            }
        ]);
        return BaseWidget;
    }();