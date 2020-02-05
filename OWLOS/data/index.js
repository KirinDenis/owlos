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

    jQuery.readyException = function (error) {
        addToLogNL("jQuery error: " + error, 2);
    };

    $(document).ajaxError(function (event, request, settings) {
        addToLogNL("Ajax error: " + settings.url, 2);
    });

    /*
    window.onresize = function (event) {
        var width = window.screen.availWidth;
        var height = window.screen.availHeight;

        var content = document.getElementById("content");
        content.style.width = (width - 300) + "px";

        
    };
    */

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
  // try {
    doProSidebar();         
    config.onLoad = settingsUI.onConfigLoad;
    config.onLoad = dashboardUI.onConfigLoad;
        if (config.load()) {
            status_online = NET_ONLINE;
            speak("OWL OS is started");

            
            document.getElementById("home-tab").innerText = getLang("homeTab");
            document.getElementById("settings-tab").innerText = getLang("settingsTab");
            document.getElementById("console-tab").innerText = getLang("consoleTab");

            addToLogNL(getLang("prepareUnit"));



            devices.addDeviceLoadedListner(settingsUI.onDeviceLoaded, settingsUI);
            nodesRefresh();

            

        //    document.getElementById("mainContainer").style.display = "block";
            var boot = document.getElementById("boot");
            boot.parentElement.removeChild(boot);
            document.getElementById("consolePanel").appendChild(boot);

            nodesRefreshHandle = setInterval(nodesRefresh, 10000);

            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
            });

            

            speak("OWL OS is ready");
        }
        else {
            status_online = NET_OFFLINE;
            speak("ERROR with host: " + host);
            addToLogNL("ERROR with host: " + host, 2);
        }


    }


//    catch (exception) {
  //      status_online = NET_OFFLINE;
        //addToLogNL("ERROR starting exception: " + exception, 2);
        //addToLogNL("ERROR delete configurations files can help fix it: [your host]/deletefile?name=web.config", 2);
    //}
//}
);

function doProSidebar() {
    var mainSideBar = document.getElementById("mainSideBar");
    var sideBarOWLOS = mainSideBar.appendChild(document.createElement("div"));
    sideBarOWLOS.className = "sidebar-item sidebar-brand";
    var hRef = sideBarOWLOS.appendChild(document.createElement("a"));
    hRef.href = "https://github.com/KirinDenis/owlos";
    hRef.innerText = "OWL OS";

    var sideBarHeader = mainSideBar.appendChild(document.createElement("div"));
    sideBarHeader.className = "sidebar-item sidebar-header d-flex flex-nowrap";
    var sideBarHeaderInfo = sideBarHeader.appendChild(document.createElement("div"));
    sideBarHeaderInfo.className = "user-info";
    var sideBarHeaderInfoVersion = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoVersion.className = "user-name";
    sideBarHeaderInfoVersion.innerHTML = "version<strong>1.7</strong>";
    var sideBarHeaderInfoRole = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoRole.className = "user-role";
    sideBarHeaderInfoRole.innerHTML = "Administrator";
    var sideBarHeaderInfoStatus = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoStatus.className = "user-status";
    var sideBarHeaderInfoRoleI = sideBarHeaderInfoStatus.appendChild(document.createElement("i"));
    sideBarHeaderInfoRoleI.className = "fa fa-circle";
    var sideBarHeaderInfoRoleSpan = sideBarHeaderInfoStatus.appendChild(document.createElement("span"));
    sideBarHeaderInfoRoleSpan.innerHTML = "Online";
    
    var sideBarUl = mainSideBar.appendChild(document.createElement("ul"));

    var sideBarDashboardLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarDashboardLi.className = "nav-item";
    var sideBarDashboardaHref = sideBarDashboardLi.appendChild(document.createElement("a"));
    sideBarDashboardaHref.className = "nav-link";
    sideBarDashboardaHref.href = "#dashboard";
    sideBarDashboardaHref.setAttribute("data-toggle", "tab");    
    sideBarDashboardaHref.onclick = function (event) { $(this).removeClass('active'); };

    sideBarDashboardaHref.appendChild(document.createElement("i")).className = "fa fa-tachometer-alt";
    var sideBarDashboardaHrefSpan = sideBarDashboardaHref.appendChild(document.createElement("span"));
    sideBarDashboardaHrefSpan.className = "menu-text";
    sideBarDashboardaHrefSpan.id = "home-tab"; 
    sideBarDashboardaHrefSpan = sideBarDashboardaHref.appendChild(document.createElement("span"));
    sideBarDashboardaHrefSpan.className = "badge badge-pill badge-success";
    sideBarDashboardaHrefSpan.id = "sideBarDashboardaHrefOnlineSpan";
    
    sideBarDashboardaHrefSpan = sideBarDashboardaHref.appendChild(document.createElement("span"));
    sideBarDashboardaHrefSpan.className = "badge badge-pill badge-secondary";
    sideBarDashboardaHrefSpan.id = "sideBarDashboardaHrefOfflineSpan";


    var sideBarSettingsLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarSettingsLi.className = "sidebar-dropdown";
    var sideBarSettingsaHref = sideBarSettingsLi.appendChild(document.createElement("a"));
    sideBarSettingsaHref.className = "nav-link";
    sideBarSettingsaHref.href = "#settings";
    sideBarSettingsaHref.setAttribute("data-toggle", "tab");
    sideBarSettingsaHref.onclick = function (event) { $(this).removeClass('active'); };

    sideBarSettingsaHref.appendChild(document.createElement("i")).className = "fa fa-cog";
    var sideBarSettingsaHrefSpan = sideBarSettingsaHref.appendChild(document.createElement("span"));
    sideBarSettingsaHrefSpan.className = "menu-text";
    sideBarSettingsaHrefSpan.id = "settings-tab"; 


    var sideBarSettingsLiSubmenu = sideBarSettingsLi.appendChild(document.createElement("div"));
    sideBarSettingsLiSubmenu.className = "sidebar-submenu";
    sideBarSettingsLiSubmenu.style.display = "block";
    var sideBarSettingsLiSubmenuUl = sideBarSettingsLiSubmenu.appendChild(document.createElement("ul"));
    sideBarSettingsLiSubmenuUl.id = "settingsSideBarUl";

    var sideBarConsoleLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarConsoleLi.className = "nav-item";
    var sideBarConsoleaHref = sideBarConsoleLi.appendChild(document.createElement("a"));
    sideBarConsoleaHref.className = "nav-link";
    sideBarConsoleaHref.href = "#console";
    sideBarConsoleaHref.setAttribute("data-toggle", "tab");
        
    sideBarConsoleaHref.onclick = function (event) { $(this).removeClass('active'); };

    sideBarConsoleaHref.appendChild(document.createElement("i")).className = "fa fa-file-code";
    var sideBarConsoleaHrefSpan = sideBarConsoleaHref.appendChild(document.createElement("span"));
    sideBarConsoleaHrefSpan.className = "menu-text";
    sideBarConsoleaHrefSpan.id = "console-tab"; 


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
        devices.refresh(configProperties.nodes[node]);
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

function resetClick(event) {
    reset(event.currentTarget.deviceHost);

    sleep(5000).then(function () {
        location.reload();
        return false;
    });

    /*
    sleep(5000).then(() => {
        location.reload();
        return false;
    });
    */
}


//--------------------------------------------------------------------------------------------------------------------
function makeModalDialog(parentId, id, titleText, bodyText) {
    document.getElementById("addDevicePanel").innerHTML = ""; //TODO: remake this modal to

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

//---------------------------------------------------------------------------------------------------------------------------------------
// Объект создает таблицы отображающе свойства устройств
// Реализован упрощенно, для работы в паре с devices парсером - не запоминает ссылкии на созданные таблицы - подразумевается что таблицы и строки 
// будут создаваться в той же последовательности в которой парястся устройства - device1, prop1, prop2...propN, device2, prop1, prop2...propN...DeviceN...
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


