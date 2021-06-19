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
Sidebar (меню) построено на основе:
https://github.com/azouaoui-med/pro-sidebar-template
Спасибо автору: azouaoui.med@gmail.com
Используется как главное меню OWLOS UX 
Этот модуль реализует управление пунктами меню - создание, удаления, стиль, события и так далее. 
Смотрите метод Create, он  должен быть вызван один раз в начале построения UX, так как меню существует весь жизненный цикл UX.
*/


//Tак как в меню всегда будeт три основных пункта  - dashboard, узлы и консоль 
//в этом же модуле реализованы обработчики кликов на эти пункты меню, а также переключения между этими пунктами 
//влечет за собой изменение других элементов UX - кнопки вверхней части управляющие виджетами, кнопка сохранить многое другое 
//эти обработчики ниже данный метод управляет внешний вид UX

//клик на любой пункт SideBar обязан вызвать этот обработчик.
//этот обработчик реализует переключение флажка 'active' для пунктов, а также настраивает статусные панели и кнопки в хиадере UX
function sidebarItemClick(event) {
    headerPanelUI.hideAllStatusesPanels();
    headerPanelUI.hideAllButtons();
    var aHref = event.currentTarget;
    $(aHref).removeClass('active');    
    document.location = aHref.href;
    var thing = aHref.thing;
    if (thing != undefined) {
        //любой пункт меню связаный с нодой (узлом)
        headerPanelUI.showStatusPanel(thing);
        //проверяем не является ли выбранный пункт - пунктом "свойства узла"
        if (aHref.deleteThingButton != undefined) {
            aHref.deleteThingButton.style.display = "";
        }
        else
            if (aHref.deleteDriverButton != undefined) {
                aHref.deleteDriverButton.style.display = "";
            }
    }

    if (aHref.saveWidgetsButton != undefined) {
        aHref.saveWidgetsButton.style.display = "";
    }

    if (aHref.headerModeButton != undefined) {
        aHref.headerModeButton.style.display = "";
    }

    if (aHref.addWidgetButton != undefined) {
        aHref.addWidgetButton.style.display = "";
    }

    if (aHref.scriptExecuteButton != undefined) {
        aHref.scriptExecuteButton.style.display = "";
    }

    if (aHref.scriptPauseButton != undefined) {
        aHref.scriptPauseButton.style.display = "";
    }

    if (aHref.scriptDebugButton != undefined) {
        aHref.scriptDebugButton.style.display = "";
    }

    if (aHref.scriptDeleteButton != undefined) {
        aHref.scriptDeleteButton.style.display = "";
    }

    if (aHref.uploadSpan != undefined) {
        aHref.uploadSpan.style.display = "";
    }

    return false;
}

//Объект элемента 
function createSidebar() {
    var sideBar = {
        sideBarWrapper: undefined,
        sideBar: undefined,
        sideBarHeader: undefined,

        sideBarHeaderInfo: undefined,
        sideBarHeaderInfoVersion: undefined,
        sideBarHeaderInfoRole: undefined,
        sideBarHeaderInfoStatus: undefined,
        sideBarHeaderInfoRoleSpan: undefined,

        dashboardItem: undefined,
        thingItem: undefined,
        thingSubItem: undefined,
        addThingItem: undefined,
        consoleItem: undefined,

        createBrand: function (_version) {
            var sideBarBrand = this.sideBar.appendChild(document.createElement("div"));
            sideBarBrand.className = "sidebar-item sidebar-brand";
            var hRef = sideBarBrand.appendChild(document.createElement("a"));
            hRef.href = "https://github.com/KirinDenis/owlos";
            hRef.target = "_blank";
            hRef.innerText = "OWLOS";
            sideBarBrand.appendChild(document.createElement("div")).innerHTML = "version <strong>" + _version + "</strong>";

            this.sideBarHeader = this.sideBar.appendChild(document.createElement("div"));
            this.sideBarHeader.className = "sidebar-item sidebar-header d-flex flex-nowrap";
        },

        createUserInfo: function (_role, _name, _networkStatus) {

            this.sideBarHeaderInfo = this.sideBarHeader.appendChild(document.createElement("div"));
            this.sideBarHeaderInfo.className = "user-info";
            this.sideBarHeaderInfoRole = this.sideBarHeaderInfo.appendChild(document.createElement("span"));
            this.sideBarHeaderInfoRole.className = "user-role";

            this.sideBarHeaderInfoStatus = this.sideBarHeaderInfo.appendChild(document.createElement("span"));
            this.sideBarHeaderInfoStatus.appendChild(document.createElement("i")).className = "fa fa-circle";
            this.sideBarHeaderInfoStatus.className = "user-status";
            this.sideBarHeaderInfoRoleSpan = this.sideBarHeaderInfoStatus.appendChild(document.createElement("span"));

            this.setUserInfo(_role, _name, _networkStatus);
        },

        setUserInfo: function (_role, _name, _networkStatus) {
            this.sideBarHeaderInfoRole.innerHTML = _role + " " + _name;
            switch (_networkStatus) {
                case NET_ONLINE:

                    this.sideBarHeaderInfoRoleSpan.innerHTML = "online";
                    break;
                default: //NET_OFFLINE    

                    this.sideBarHeaderInfoRoleSpan.innerHTML = "offline";
                    break;
            }
        },

        createItem: function (_parent, _id, _href, _text, _onclick, _icon, _span) {
            var item = _parent.appendChild(document.createElement("li"));
            item.id = _id;
            item.className = "nav-item";
            var itemHref = item.appendChild(document.createElement("a"));
            itemHref.id = _id + "href";
            itemHref.className = "menu-href";

            itemHref.href = _href; 
            itemHref.setAttribute("data-toggle", "tab");
            itemHref.onclick = _onclick;
            itemHref.appendChild(document.createElement("i")).className = _icon; 
            item.href = itemHref;

            var itemTextSpan = itemHref.appendChild(document.createElement("span"));
            itemTextSpan.className = "menu-text";
            itemTextSpan.innerHTML = _text;
            itemHref.textSpan = itemTextSpan;
            

            if (_span != undefined) {
                var itemSpan = itemHref.appendChild(document.createElement("span"));
                itemSpan.className = "badge badge-pill badge-success";
                itemSpan.id = _id + "span";
                itemSpan.innerHTML = _span;
                item.span = itemSpan;

            }
            return item;

        },

        createSubItem: function (_parent, _id) {
            _parent.className = "sidebar-dropdown active";
            var itemSubmenu = _parent.appendChild(document.createElement("div"));
            itemSubmenu.className = "sidebar-submenu";
            itemSubmenu.style.display = "block";
            var itemSubmenuUl = itemSubmenu.appendChild(document.createElement("ul"));
            itemSubmenuUl.id = _id;
            return itemSubmenuUl;
        },

        createDeepItem: function (_parent, _id) {

            _parent.className = "";
            _parent.href.setAttribute("data-toggle", "collapse");
            _parent.href.setAttribute("aria-expanded", "false");
            _parent.href.className = "nav-link collapsed menu-href";

            var itemSubmenuUl = _parent.appendChild(document.createElement("ul"));
            itemSubmenuUl.className = "collapse";
            itemSubmenuUl.id = _id;
            return itemSubmenuUl;
        },

        //Конструктор    
        create: function () {

            headerPanelUI.addButton("toggle-sidebar", "fa fa-bars", getLang("tooglesidebar"), headerPanelUI.sideBarButtonRole);
            headerPanelUI.addButton("pin-sidebar", "fa fa-anchor", getLang("pinsidebar"), headerPanelUI.sideBarButtonRole);

            var pageWrapper = document.getElementById("pagewrapper");

            this.sideBarWrapper = pageWrapper.appendChild(document.createElement("nav"));
            this.sideBarWrapper.id = "sidebarwrapper";
            this.sideBarWrapper.className = "sidebar-wrapper";

            var sideBarContent = this.sideBarWrapper.appendChild(document.createElement("div"));
            sideBarContent.className = "sidebar-content";

            this.sideBar = sideBarContent.appendChild(document.createElement("div"));
            this.sideBar.id = "sideBar";
            this.sideBar.className = "sidebar-item sidebar-menu";
            //TODO: read version from thing
            this.createBrand("1.8 (RC)");
            this.createUserInfo("Role", "administrator", NET_ONLINE);

            //Main menu 
            var sideBarUl = this.sideBar.appendChild(document.createElement("ul"));
            //Панель управления 
            this.dashboardItem = this.createItem(sideBarUl, "dashboarditem", "#dashboard", getLang("dashboardTab"), sidebarItemClick, "fa fa-tachometer-alt", configProperties.dashboards[0].widgets.length);
            //настройки  
            this.thingItem = this.createItem(sideBarUl, "thingItem", "#settings", getLang("settingsTab"), function (event) { $(this).removeClass('active'); }, "fa fa-cogs", undefined);
            this.thingSubItem = this.createSubItem(this.thingItem, "settingsSideBarUl");

            this.addThingItem = this.createItem(this.thingSubItem, "addthingitem", "#home", getLang("addthing"), settingsUI.addThingClick, "fa fa-plus", undefined);
            this.addThingItem.href.style.color = theme.warning;
            //панель не видна, она существует для организии SideBar, сами панели со свойствами драйвер сделаны на основе navBar - так сложилось исторически, SideBar только переключает их
            var thingPropAnchors = document.getElementById("thingPropAnchors");
            //NavTabs панель для панелей со свойствами нод
            var thingPropNavBar = thingPropAnchors.appendChild(document.createElement("ul"));
            thingPropNavBar.style.height = "0px";
            thingPropNavBar.id = "thingPropNavBar";
            thingPropNavBar.className = "nav nav-tabs";

            this.consoleItem = this.createItem(sideBarUl, "consoleitem", "#console", getLang("consoleTab"), sidebarItemClick, "fa fa-file-code", undefined);

            $(".page-wrapper").toggleClass("toggled"); //открыть по умолчанию панель меню
            jQuery(function ($) {

                // Dropdown menu
                $(".sidebar-dropdown > a").click(function () {
                    $(".sidebar-submenu").slideUp(200);

                    if ($(this).parent().hasClass("active")) {
                        // $(".sidebar-dropdown").removeClass("active");
                        $(this).parent().removeClass("active");
                    } else {
                        $(".sidebar-dropdown").removeClass("active");
                        $(this).next(".sidebar-submenu").slideDown(200);
                        $(this).parent().addClass("active");
                    }


                });

                //toggle sidebar
                $("#toggle-sidebar").click(function () {
                    $(".page-wrapper").toggleClass("toggled");
                });
                //Pin sidebar
                $("#pin-sidebar").click(function () {
                    if ($(".page-wrapper").hasClass("pinned")) {
                        // unpin sidebar when hovered
                        $(".page-wrapper").removeClass("pinned");
                        $("#sidebar").unbind("hover");
                    } else {
                        $(".page-wrapper").addClass("pinned");
                        $("#sidebar").hover(
                            function () {
                                console.log("mouseenter");
                                $(".page-wrapper").addClass("sidebar-hovered");
                            },
                            function () {
                                console.log("mouseout");
                                $(".page-wrapper").removeClass("sidebar-hovered");
                            }
                        )

                    }
                });

                //toggle sidebar overlay
                $("#overlay").click(function () {
                    $(".page-wrapper").toggleClass("toggled");
                });

                //switch between themes 
                var themes = "default-theme legacy-theme chiller-theme ice-theme cool-theme light-theme";
                $('[data-theme]').click(function () {
                    $('[data-theme]').removeClass("selected");
                    $(this).addClass("selected");
                    $('.page-wrapper').removeClass(themes);
                    $('.page-wrapper').addClass($(this).attr('data-theme'));
                });

                // switch between background images
                var bgs = "bg1 bg2 bg3 bg4";
                $('[data-bg]').click(function () {
                    $('[data-bg]').removeClass("selected");
                    $(this).addClass("selected");
                    $('.page-wrapper').removeClass(bgs);
                    $('.page-wrapper').addClass($(this).attr('data-bg'));
                });

                // toggle background image
                $("#toggle-bg").change(function (e) {
                    e.preventDefault();
                    $('.page-wrapper').toggleClass("sidebar-bg");
                });

                // toggle border radius
                $("#toggle-border-radius").change(function (e) {
                    e.preventDefault();
                    $('.page-wrapper').toggleClass("border-radius-on");
                });

            });
        }

    }
    sideBar.create();
    return sideBar;
}
