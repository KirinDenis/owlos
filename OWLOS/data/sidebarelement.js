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



function proSideBarMenuClick(event) {
    var nodeStatusPanel = document.getElementById("nodeStatusPanel");
    if (nodeStatusPanel != undefined) {
        if (nodeStatusPanel.currentStatusPanel != undefined) {
            nodeStatusPanel.currentStatusPanel.style.display = "none";
            nodeStatusPanel.currentStatusPanel.nodeStatusPanelText.style.display = "none";
        }
    }
    return false;
}

function proSideBarDashboardMenuClick(event) {
    $(this).removeClass('active');
    document.getElementById("sidebarText").style.display = "block";
    document.getElementById("sidebarText").innerText = event.currentTarget.addressText;
    document.getElementById("dashboardButtonsPanel").style.display = "block";
    return proSideBarMenuClick(event);
}

function proSideBarConsoleMenuClick(event) {
    $(this).removeClass('active');
    document.getElementById("sidebarText").style.display = "none";
    document.getElementById("sidebarText").innerText = "";
    document.getElementById("dashboardButtonsPanel").style.display = "none";
    return proSideBarMenuClick(event);
}


function createSidebar() {

    var sideBar = {

        sideBarWrapper: undefined,
        sideBar: undefined, 
        sideBarHeader:  undefined, 

        sideBarHeaderInfo: undefined, 
        sideBarHeaderInfoVersion: undefined, 
        sideBarHeaderInfoRole: undefined, 
        sideBarHeaderInfoStatus: undefined, 
        sideBarHeaderInfoRoleSpan: undefined, 

        dashboardItem: undefined, 
        settingsItem: undefined, 
        consoleItem: undefined, 

        createBrand: function (_version) {
            var sideBarBrand = this.sideBar.appendChild(document.createElement("div"));
            sideBarBrand.className = "sidebar-item sidebar-brand";
            var hRef = sideBarBrand.appendChild(document.createElement("a"));
            hRef.href = "https://github.com/KirinDenis/owlos";
            hRef.innerText = "OWLOS";

            this.sideBarHeader = this.sideBar.appendChild(document.createElement("div"));
            this.sideBarHeader.className = "sidebar-item sidebar-header d-flex flex-nowrap";
            
        },

        createUserInfo: function(_name, _role, _networkStatus) {

            this.sideBarHeaderInfo = this.sideBarHeader.appendChild(document.createElement("div"));
            this.sideBarHeaderInfo.className = "user-info";

            this.sideBarHeaderInfoVersion = this.sideBarHeaderInfo.appendChild(document.createElement("span"));
            this.sideBarHeaderInfoVersion.className = "user-name";

            this.sideBarHeaderInfoRole = this.sideBarHeaderInfo.appendChild(document.createElement("span"));
            this.sideBarHeaderInfoRole.className = "user-role";

            this.sideBarHeaderInfoStatus = this.sideBarHeaderInfo.appendChild(document.createElement("span"));
            this.sideBarHeaderInfoStatus.appendChild(document.createElement("i")).className = "fa fa-circle";
            this.sideBarHeaderInfoStatus.className = "user-status";
            this.sideBarHeaderInfoRoleSpan = this.sideBarHeaderInfoStatus.appendChild(document.createElement("span"));

            this.setUserInfo(_name, _role, _networkStatus);

        },

        setUserInfo: function(_name, _role, _networkStatus) {
            this.sideBarHeaderInfoVersion.innerHTML = _name;
            this.sideBarHeaderInfoRole.innerHTML = _role;
            switch(_networkStatus ) 
            {
                case NET_ONLINE: 
                    
                    this.sideBarHeaderInfoRoleSpan.innerHTML = "online";
                    break;
                default: //NET_OFFLINE    
            
                    this.sideBarHeaderInfoRoleSpan.innerHTML = "offline";
                break;
            }
        },

        createItem: function(_parent, _id, _href, _text, _onclick, _icon, _span) {
            var item = _parent.appendChild(document.createElement("li"));
            item.id = _id;
            item.className = "nav-item";
           // item.className = "sidebar-dropdown";
            var itemHref = item.appendChild(document.createElement("a"));
            itemHref.id = "sideBarDashboardAhref";
            itemHref.className = "nav-link";

            itemHref.href = _href; //"#dashboard";
            itemHref.setAttribute("data-toggle", "tab");
             // proSideBarDashboardMenuClick;
            //itemHref.addressText = _text; // getLang("dashboardTab");
            itemHref.onclick = _onclick;

            itemHref.appendChild(document.createElement("i")).className = _icon; // "fa fa-tachometer-alt";

            var itemTextSpan = itemHref.appendChild(document.createElement("span"));
            itemTextSpan.className = "menu-text";
            itemTextSpan.innerText = _text;
            //document.getElementById("sidebarText").innerText = sideBarDashboardAhref.addressText;

            if (_span != undefined) {
            var itemSpan = itemHref.appendChild(document.createElement("span"));
            itemSpan.className = "badge badge-pill badge-success";
            itemSpan.id = "sideBarDashboardAhrefSpan";
            itemSpan.innerHTML = _span;
            }
            
            return item;

        },

        createSubItem: function(_parent, _id) {
            _parent.className = "sidebar-dropdown  active";
            var itemSubmenu = _parent.appendChild(document.createElement("div"));
            itemSubmenu.className = "sidebar-submenu";
            itemSubmenu.style.display = "block";
            var itemSubmenuUl = itemSubmenu.appendChild(document.createElement("ul"));
            itemSubmenuUl.id =  _id;            
        }, 

        create: function () {
            var pageWrapper = document.getElementById("pagewrapper");

            this.sideBarWrapper = pageWrapper.appendChild(document.createElement("nav"));
            this.sideBarWrapper.id = "sidebarwrapper";
            this.sideBarWrapper.className = "sidebar-wrapper";

            var sideBarContent = this.sideBarWrapper.appendChild(document.createElement("div"));
            sideBarContent.className = "sidebar-content";

            this.sideBar = sideBarContent.appendChild(document.createElement("div"));
            this.sideBar.id = "sideBar";
            this.sideBar.className = "sidebar-item sidebar-menu";
            
            this.createBrand("1.7");
            this.createUserInfo("version: 1.7", "Administrator", NET_ONLINE);

            //Main menu 
            var sideBarUl = this.sideBar.appendChild(document.createElement("ul"));
            //Панель управления 
            this.dashboardItem = this.createItem(sideBarUl, "dashboarditem", "#dashboard", getLang("dashboardTab"), proSideBarDashboardMenuClick, "fa fa-tachometer-alt", configProperties.dashboards[0].widgets.length);
            //настройки  
            this.settingsItem = this.createItem(sideBarUl, "settingsitem", "#settings", getLang("settingsTab"), function (event) { $(this).removeClass('active'); }, "fa fa-cogs", undefined);
            this.createSubItem(this.settingsItem, "settingsSideBarUl");

            this.consoleItem = this.createItem(sideBarUl, "consoleitem", "#console", getLang("consoleTab"), proSideBarConsoleMenuClick, "fa fa-file-code", undefined);

            $(".page-wrapper").toggleClass("toggled"); //открыть по умолчанию панель меню

            document.getElementById("toggle-sidebar").style.display = "block";
            document.getElementById("pin-sidebar").style.display = "block";
            document.getElementById("nodeStatusPanelText").style.display = "block";
            document.getElementById("sidebarText").style.display = "block";


            jQuery(function ($) {

                // Dropdown menu
                $(".sidebar-dropdown > a").click(function () {
                    $(".sidebar-submenu").slideUp(200);
                    if ($(this).parent().hasClass("active")) {
                        $(".sidebar-dropdown").removeClass("active");
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

                //custom scroll bar is only used on desktop
                /*
                if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    $(".sidebar-content").mCustomScrollbar({
                        axis: "y",
                        autoHideScrollbar: true,
                        scrollInertia: 300
                    });
                    $(".sidebar-content").addClass("desktop");
        
                }
                */
            });
        }
        
    }
    sideBar.create();
    return sideBar;

}
