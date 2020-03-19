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

var unitId;
var nodesRefreshHandle;
var autorefreshbutton;
var refreshbutton;

var status_online = NET_OFFLINE;
var status_wifiap = NET_OFFLINE;
var status_wifist = NET_OFFLINE;
var status_restful = NET_OFFLINE;
var status_mqtt = NET_OFFLINE;
var status_ota = NET_OFFLINE;

var theme = {};

var wifiap = 0;

//Connection state for WiFiST and MQTTClient
var mqttState = getLang("disconnected");
var wifiSTconection = getLang("disconnected");

var firstTime = true;

$(document).ready(function () {

    addToLogNL("OK loading scripts");
    addToLogNL("[START]", 1);

    //Check languages DEBUG
    //langCompare(langua, langru, document.getElementById("bootLog"));

    jQuery.readyException = function (error) {
        addToLogNL("jQuery error: " + error, 2);
    };

    $(document).ajaxError(function (event, request, settings) {
        addToLogNL("Ajax error: " + settings.url, 2);
    });

    var style = window.getComputedStyle(document.body, null);
    theme.primary = style.getPropertyValue('--primary');
    theme.secondary = style.getPropertyValue('--secondary');
    theme.success = style.getPropertyValue('--success');
    theme.info = style.getPropertyValue('--info');
    theme.warning = style.getPropertyValue('--warning');
    theme.danger = style.getPropertyValue('--danger');
    theme.light = style.getPropertyValue('--light');
    theme.dark = style.getPropertyValue('--dark');
    theme.fontFamily = style.fontFamily;

    if (theme.primary === '') { //default dark
        theme.primary = '#3A3F44';
        theme.secondary = '#7A8288';
        theme.success = '#62c462';
        theme.info = '#5bc0de';
        theme.warning = '#f89406';
        theme.danger = '#ee5f5b';
        theme.light = '#e9ecef';
        theme.dark = '#272B30';
    }

    addToLogNL("get UI configuration...");
   try {

 
    config.onLoad = onConfigLoad;
    config.onLoad = settingsUI.onConfigLoad;
    config.onLoad = dashboardUI.onConfigLoad;
    if (config.load()) {
        
        status_online = NET_ONLINE;
        speak("OWLOS is started");

        addToLogNL(getLang("prepareUnit"));

        drivers.addDriverLoadedListner(settingsUI.onDriverLoaded, settingsUI);
        nodesRefresh();

        var boot = document.getElementById("boot");
        boot.parentElement.removeChild(boot);
        document.getElementById("consolePanel").appendChild(boot);

        nodesRefreshHandle = setInterval(nodesRefresh, 10000);
        

        /*
        $("#createScript").click(function (event) {
            var textArea = document.getElementById("scriptText");
            httpPostAsyncWithErrorReson(boardhost + "createscript", "?name=main1", escape(textArea.value));
        });
        */

        speak("OWLOS is ready");
    }
    else {
        status_online = NET_OFFLINE;
        speak("ERROR with host: " + boardhost);
        addToLogNL("ERROR with host: " + boardhost, 2);
    }
    }


        catch (exception) {
          status_online = NET_OFFLINE;
    addToLogNL("ERROR starting exception: " + exception, 2);
    addToLogNL("ERROR delete configurations files can help fix it: [your host]/deletefile?name=web.config", 2);
    }
   }
);


function onConfigLoad(configProperties) {
    createProSidebar();
    $(".page-wrapper").toggleClass("toggled");

    document.getElementById("toggle-sidebar").style.display = "block";
    document.getElementById("pin-sidebar").style.display = "block";
    document.getElementById("nodeStatusPanelText").style.display = "block";
    document.getElementById("sidebarText").style.display = "block";

}

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


function createProSidebar() {
    

    var pageWrapper = document.getElementById("pagewrapper");
    var sideBar = pageWrapper.appendChild(document.createElement("nav"));
    sideBar.id = "sidebar";
    sideBar.className = "sidebar-wrapper";
    var sideBarContent = sideBar.appendChild(document.createElement("div"));
    sideBarContent.className = "sidebar-content";
    var mainSideBar = sideBarContent.appendChild(document.createElement("div"));
    mainSideBar.id = "mainSideBar";
    mainSideBar.className = "sidebar-item sidebar-menu";

//    var mainSideBar = document.getElementById("mainSideBar");
    var sideBarOWLOS = mainSideBar.appendChild(document.createElement("div"));
    sideBarOWLOS.className = "sidebar-item sidebar-brand";
    var hRef = sideBarOWLOS.appendChild(document.createElement("a"));
    hRef.href = "https://github.com/KirinDenis/owlos";
    hRef.innerText = "OWLOS";

    var sideBarHeader = mainSideBar.appendChild(document.createElement("div"));
    sideBarHeader.className = "sidebar-item sidebar-header d-flex flex-nowrap";
    var sideBarHeaderInfo = sideBarHeader.appendChild(document.createElement("div"));
    sideBarHeaderInfo.className = "user-info";
    var sideBarHeaderInfoVersion = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoVersion.className = "user-name";
    sideBarHeaderInfoVersion.innerHTML = "version<strong> 1.7</strong>";
    var sideBarHeaderInfoRole = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoRole.className = "user-role";
    sideBarHeaderInfoRole.innerHTML = "Administrator";
    var sideBarHeaderInfoStatus = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoStatus.className = "user-status";
    sideBarHeaderInfoStatus.appendChild(document.createElement("i")).className = "fa fa-circle";
    
    var sideBarHeaderInfoRoleSpan = sideBarHeaderInfoStatus.appendChild(document.createElement("span"));
    sideBarHeaderInfoRoleSpan.innerHTML = "Online";

    var sideBarUl = mainSideBar.appendChild(document.createElement("ul"));

    //Панель управления 
    var sideBarDashboardLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarDashboardLi.id = "sideBarDashboardLi";
    sideBarDashboardLi.className = "nav-item";
    var sideBarDashboardAhref = sideBarDashboardLi.appendChild(document.createElement("a"));
    sideBarDashboardAhref.id = "sideBarDashboardAhref";
    sideBarDashboardAhref.className = "nav-link";
    
    sideBarDashboardAhref.href = "#dashboard";
    sideBarDashboardAhref.setAttribute("data-toggle", "tab");
    sideBarDashboardAhref.onclick = proSideBarDashboardMenuClick; 
    sideBarDashboardAhref.addressText = getLang("dashboardTab");


    sideBarDashboardAhref.appendChild(document.createElement("i")).className = "fa fa-tachometer-alt";
    var sideBarDashboardAhrefSpan = sideBarDashboardAhref.appendChild(document.createElement("span"));
    sideBarDashboardAhrefSpan.className = "menu-text";    
    sideBarDashboardAhrefSpan.innerText = sideBarDashboardAhref.addressText;
    document.getElementById("sidebarText").innerText = sideBarDashboardAhref.addressText;

    sideBarDashboardAhrefSpan = sideBarDashboardAhref.appendChild(document.createElement("span"));
    sideBarDashboardAhrefSpan.className = "badge badge-pill badge-success";
    sideBarDashboardAhrefSpan.id = "sideBarDashboardAhrefSpan";
    

    config.onLoad = function (configProperties) {
        sideBarDashboardAhrefSpan.innerHTML = configProperties.dashboards[0].widgets.length;
    }

    config.onChange = function (configProperties) {
        sideBarDashboardAhrefSpan.innerHTML = configProperties.dashboards[0].widgets.length;
    }


    //настройки  
    var sideBarSettingsLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarSettingsLi.className = "sidebar-dropdown";
    var sideBarSettingsAhref = sideBarSettingsLi.appendChild(document.createElement("a"));
    sideBarSettingsAhref.className = "nav-link";
    sideBarSettingsAhref.href = "#settings";
    sideBarSettingsAhref.setAttribute("data-toggle", "tab");
    sideBarSettingsAhref.onclick = function (event) { $(this).removeClass('active'); };

    sideBarSettingsAhref.appendChild(document.createElement("i")).className = "fa fa-cogs";
    var sideBarSettingsAhrefSpan = sideBarSettingsAhref.appendChild(document.createElement("span"));
    sideBarSettingsAhrefSpan.className = "menu-text";
    sideBarSettingsAhrefSpan.id = "settings-tab";
    sideBarSettingsAhrefSpan.innerText = getLang("settingsTab");

    var sideBarSettingsLiSubmenu = sideBarSettingsLi.appendChild(document.createElement("div"));
    sideBarSettingsLiSubmenu.className = "sidebar-submenu";
    sideBarSettingsLiSubmenu.style.display = "block";
    var sideBarSettingsLiSubmenuUl = sideBarSettingsLiSubmenu.appendChild(document.createElement("ul"));
    sideBarSettingsLiSubmenuUl.id = "settingsSideBarUl";

    var sideBarConsoleLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarConsoleLi.className = "nav-item";
    var sideBarConsoleAhref = sideBarConsoleLi.appendChild(document.createElement("a"));
    sideBarConsoleAhref.className = "nav-link";
    sideBarConsoleAhref.href = "#console";
    sideBarConsoleAhref.setAttribute("data-toggle", "tab");
    sideBarConsoleAhref.addressText = getLang("consoleTab");
    sideBarConsoleAhref.onclick = proSideBarConsoleMenuClick;

    sideBarConsoleAhref.appendChild(document.createElement("i")).className = "fa fa-file-code";
    var sideBarConsoleAhrefSpan = sideBarConsoleAhref.appendChild(document.createElement("span"));
    sideBarConsoleAhrefSpan.className = "menu-text";
    sideBarConsoleAhrefSpan.innerText = sideBarConsoleAhref.addressText;


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

function nodesRefresh() {
    for (var node in configProperties.nodes) {
        drivers.refresh(configProperties.nodes[node]);
        scriptsManager.refresh(configProperties.nodes[node]);
    }
}

function sleep(time) {

    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
    /*
    return new Promise((resolve) => setTimeout(resolve, time));
    */
}





//--------------------------------------------------------------------------------------------------------------------
function makeModalDialog(parentId, id, titleText, bodyText) {
    document.getElementById("addDriverPanel").innerHTML = ""; //TODO: remake this modal to

    var parentPanel = document.getElementById(parentId);
    parentPanel.innerHTML = "";
    var modalFade = parentPanel.appendChild(document.createElement("div"));

    modalFade.className = "modal fade";
    modalFade.id = id + "Modal";
    modalFade.tabindex = "-1";
    modalFade.setAttribute("role", "dialog");
    modalFade.setAttribute("aria-labelledby", id + "ModalLabel");
    modalFade.setAttribute("aria-hidden", "true");

    var modalDialog = modalFade.appendChild(document.createElement("div"));
    modalDialog.className = "modal-dialog";
    modalDialog.role = "document";

    var modalContent = modalDialog.appendChild(document.createElement("div"));
    modalContent.className = "modal-content";

    var modalHeader = modalContent.appendChild(document.createElement("div"));
    modalHeader.className = "modal-header";

    var modalTitle = modalHeader.appendChild(document.createElement("h5"));

    modalTitle.className = "modal-title";
    modalTitle.id = id + "ModalLabel";
    modalTitle.innerText = titleText;

    var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));

    closeHeaderButton.type = "button"
    closeHeaderButton.className = "close"
    closeHeaderButton.id = id + "closeHeaderButton";
    closeHeaderButton.setAttribute("data-dismiss", "modal");
    closeHeaderButton.setAttribute("aria-label", "Close");

    var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerText = "x"

    var modalBody = modalContent.appendChild(document.createElement("div"));
    modalBody.id = id + "ModalBody"
    modalBody.className = "modal-body";
    modalBody.innerText = bodyText;

    var modalFooter = modalContent.appendChild(document.createElement("div"));
    modalFooter.id = id + "ModalFooter";
    modalFooter.className = "modal-footer";

    var closeButton = modalFooter.appendChild(document.createElement("button"));
    closeButton.type = "button";
    closeButton.className = "btn btn-sm btn-info";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.innerText = getLang("cancel");
    closeButton.id = id + "closeButton";
}


function createValueEdit(parentElement, propertyName, propertyValue, propertyType) {
    var edit = "";

    if (!propertyType.indexOf("r") != -1) {
        if (propertyType.indexOf("b") != -1) //boolean
        {
            edit = parentElement.appendChild(document.createElement('select'));
            edit.className = "form-control form-control-sm";
            edit.style.width = "100%";
            var valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "true";
            valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "false";
            if ((propertyValue === "1") || (propertyValue === 'true')) edit.selectedIndex = 0; else edit.selectedIndex = 1;
        }
        else
            if (propertyType.indexOf("c") != -1) {
                edit = parentElement.appendChild(document.createElement('select'));
                edit.className = "form-control form-control-sm";
                edit.style.width = "100%";
                edit.style.backgroundColor = propertyValue;
                edit.onchange = colorSelectOnChange;
                var valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = propertyValue;
                valueSelectOption.style.backgroundColor = propertyValue;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.primary;
                valueSelectOption.style.backgroundColor = theme.primary;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.secondary;
                valueSelectOption.style.backgroundColor = theme.secondary;


                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.success;
                valueSelectOption.style.backgroundColor = theme.success;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.info;
                valueSelectOption.style.backgroundColor = theme.info;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.warning;
                valueSelectOption.style.backgroundColor = theme.warning;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.danger;
                valueSelectOption.style.backgroundColor = theme.danger;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.light;
                valueSelectOption.style.backgroundColor = theme.light;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.dark;
                valueSelectOption.style.backgroundColor = theme.dark;

                edit.selectedIndex = 0;
            }
            else {
                edit = parentElement.appendChild(document.createElement('input'));
                edit.className = "form-control form-control-sm";

                if (propertyType.indexOf("p") != -1) //password
                {
                    edit.type = "password";
                    edit.placeholder = "Password";
                }

                if (propertyType.indexOf("i") != -1) //integer
                {
                    edit.type = "number";
                }

                if (propertyType.indexOf("f") != -1) //float
                {
                    edit.type = "number";
                    edit.step = "0.01";
                }

                edit.style.width = "100%";
                edit.value = propertyValue;
            }

        if (propertyType.indexOf("s") != -1) //selected
        {
            edit.style.backgroundColor = "#FAFAF0";
        }

        edit.id = "propValueInput_" + propertyName;
        edit.propname = propertyName;
        edit.propvalue = propertyValue; //default

        edit.proptype = propertyType;
    }

    return edit;
}

function colorSelectOnChange(event) {
    var select = event.currentTarget;
    select.style.backgroundColor = select.options[select.selectedIndex].style.backgroundColor;
    return false;
}


