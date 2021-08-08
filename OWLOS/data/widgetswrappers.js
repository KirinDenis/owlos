
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

//-----------------------------------------------------------------------------------
//Drivers classes -------------------------------------------------------------------
//Base radial class 
//-----------------------------------------------------------------------------------
var BaseWidgetWrapper =

    function () {
        "use strict";

        function BaseWidgetWrapper(parentPanel, driver, driverProperty, noWidget, configPropertiesWidget, widgetProperties) {
            this.configPropertiesWidget = configPropertiesWidget;
            this.widgetProperties = widgetProperties;

            if (driver == undefined) {
                drivers.addDriverLoadedListner(this.onDriverLoaded, this);
            } else {
                this.driver = driver;
                this.driverProperty = driverProperty;
                this.offlineStarter(parentPanel, driver._id, driverProperty.name, noWidget);

            }
        }

        var _proto = BaseWidgetWrapper.prototype;

        _proto.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
            this.driverId = driverId;
            this.driverPropertyName = driverPropertyName;
            dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

            if (noWidget == undefined || !noWidget) {
                this.widget = new RadialWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
                this.widget.driverClass = this;
                this.widget.onload = this.onWidgetLoad;
            }
        };

        _proto.makeUniqueId = function (id) {
            var count = 1;
            var _id = id;
            while (document.getElementById(_id + "BaseWidget") != undefined) {
                _id = id + count;
                count++;
            }
            return _id;
        }

        _proto.onWidgetLoad = function onWidgetLoad(widget) {
            widget.widgetHolder.onclick = widget.driverClass.widgetClick;

            if (widget.driverClass.widgetProperties != undefined) {
                widget.properties = widget.driverClass.widgetProperties;
            }

            if (widget.driverClass.driver != undefined) {
                widget.driverClass.joinDriver(widget.driverClass.driver, widget.driverClass.driverProperty);
            }

            if (widget.driverClass._onload != undefined) {
                widget.driverClass._onload(widget.driverClass);
            }
        };
        _proto.getWidgetProperties = function () {
            if (this.widget != undefined) {
                return this.widget.properties;
            }
            return undefined;
        };
        _proto.joinDriver = function joinDriver(driver, driverProperty) {
            this.driver = driver;
            this.driverProperty = driverProperty;
            if (this.widget != undefined) {
                if (this.widget.driverClass != undefined) {
                    this.widget.driverClass.driverProperty = driverProperty;
                }
            }
            this.thing = config.getThingByHost(driver._host); //drivers.addNetworkStatusListner(this.onNetworkStatusChange, this);

            this.thing.addNetworkStatusListner(this.onNetworkStatusChange, this);
            if (this.driverProperty != undefined)
            {
                this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
                this.driverProperty.addValueListner(this.onValueChange, this);
            }
        };

        _proto.onDriverLoaded = function onDriverLoaded(sender, driver) {
            if (sender.driver != undefined) return;

            if (sender.driverId == driver._id) {
                sender.joinDriver(driver, driver[sender.driverPropertyName]);
            }
        };

        _proto.onValueChange = function onValueChange(sender, driverProperty) {
            sender.draw();
        };

        _proto.onNetworkStatusChange = function onNetworkStatusChange(sender, driverProperty) {
            if (sender.widget != undefined) {
                sender.widget.networkStatus = driverProperty.networkStatus;
            }
        };

        _proto.onDashboardModeChange = function onDashboardModeChange(sender, mode) {
            if (sender.widget != undefined) {
                if (mode) {
                    sender.widget.mode = WORK_MODE;
                } else {
                    sender.widget.mode = MOVE_MODE;
                }
            }
        };
        _proto.widgetClick = function widgetClick(event) {
            event.stopPropagation();
            var widgetPanel = event.currentTarget;
            var widget = widgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                if (widget.driverClass.driverProperty != undefined) {
                widget.driverClass.driverProperty.getValue();
                }
            }

            return true;
        };

        _proto.refresh = function refresh() { };

        _proto.draw = function draw() { };

        _createClass(BaseWidgetWrapper, [{
            key: "onload",
            get: function get() {
                return this._onload;
            },
            set: function set(onload) {
                this._onload = onload;
            }
        }]);

        return BaseWidgetWrapper;
    }();


var RadialWidgetWrapper =

    function (_BaseWidgetWrapper) {
        "use strict";

        _inheritsLoose(RadialWidgetWrapper, _BaseWidgetWrapper);

        var _proto2 = RadialWidgetWrapper.prototype;

        _proto2.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new RadialWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function RadialWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this;

            _this = _BaseWidgetWrapper.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this);
            return _this;
        }

        _proto2.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, this.driverProperty.value, this.driver._id);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return RadialWidgetWrapper;
    }(BaseWidgetWrapper);

//-----------------------------------------------------------------------------------------------------------------------


var TemperatureWidgetWrapper =

    function (_BaseWidgetWrapper) {
        "use strict";

        _inheritsLoose(TemperatureWidgetWrapper, _BaseWidgetWrapper);

        var _proto2 = TemperatureWidgetWrapper.prototype;

        _proto2.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new TemperatureWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function TemperatureWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this;

            _this = _BaseWidgetWrapper.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this);
            return _this;
        }

        _proto2.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, Math.round(this.driverProperty.value), this.driver._id + "-" + getLang("temperature"), this.driver.temperaturehistorydata.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return TemperatureWidgetWrapper;
    }(BaseWidgetWrapper); //-----------------------------------------------------------------------------------------------------------------------

var ValueWidgetWrapper =

    function (_BaseWidgetWrapper) {
        "use strict";

        _inheritsLoose(ValueWidgetWrapper, _BaseWidgetWrapper);

        var _proto2 = ValueWidgetWrapper.prototype;

        _proto2.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new ValueWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function ValueWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this;

            _this = _BaseWidgetWrapper.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this);
            return _this;
        }

        _proto2.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, this.driverProperty.value, this.driver._id + "-" + getLang("value"));
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return ValueWidgetWrapper;
    }(BaseWidgetWrapper); //-----------------------------------------------------------------------------------------------------------------------


var HumidityWidgetWrapper =

    function (_BaseWidgetWrapper2) {
        "use strict";

        _inheritsLoose(HumidityWidgetWrapper, _BaseWidgetWrapper2);

        function HumidityWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this2;

            _this2 = _BaseWidgetWrapper2.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this2);
            return _this2;
        }


        var _proto3 = HumidityWidgetWrapper.prototype;

        _proto3.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper2.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new RadialWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        _proto3.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, Math.round(this.driverProperty.value) + "%", this.driver._id + "-" + getLang("humidity"), this.driver.humidityhistorydata.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return HumidityWidgetWrapper;
    }(BaseWidgetWrapper); //HistoryData Graph ------------------------------------------------------------------------------------------------------


var HistoryDataGraphWidgetWrapper =

    function (_BaseWidgetWrapper3) {
        "use strict";

        _inheritsLoose(HistoryDataGraphWidgetWrapper, _BaseWidgetWrapper3);

        function HistoryDataGraphWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this3;

            _this3 = _BaseWidgetWrapper3.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this3);
            return _this3;
        }

        var _proto4 = HistoryDataGraphWidgetWrapper.prototype;

        _proto4.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper3.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new GraphWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize, temperatureIcon);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        _proto4.onWidgetLoad = function onWidgetLoad(widget) {
            widget.widgetHolder.onclick = widget.driverClass.widgetClick;

            if (widget.driverClass.widgetProperties != undefined) {
                widget.properties = widget.driverClass.widgetProperties;
            }

            if (widget.driverClass.driver != undefined) {
                widget.driverClass.joinDriver(widget.driverClass.driver, widget.driverClass.driverProperty);
            }

            if (widget.driverClass._onload != undefined) {
                widget.driverClass._onload(widget.driverClass);
            }
        };


        _proto4.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, this.driver._id, this.driverProperty.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return HistoryDataGraphWidgetWrapper;
    }(BaseWidgetWrapper);

var LightWidgetWrapper =

    function (_BaseWidgetWrapper4) {
        "use strict";

        _inheritsLoose(LightWidgetWrapper, _BaseWidgetWrapper4);

        var _proto5 = LightWidgetWrapper.prototype;

        _proto5.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper4.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new LightWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };


        function LightWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this4;

            _this4 = _BaseWidgetWrapper4.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this4);
            return _this4;
        }

        _proto5.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var percent = Math.round((32768.0 - this.driverProperty.value) / (32768.0 / 100.0));

                if (percent < 35) {
                    this.widget.refresh(percent, getLang("low"), this.driver._id, this.driver.historydata.value);
                } else if (percent < 70) {
                    this.widget.refresh(percent, getLang("norm"), this.driver._id, this.driver.historydata.value);
                } else {
                    this.widget.refresh(percent, getLang("high"), this.driver._id, this.driver.historydata.value);
                }

            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return LightWidgetWrapper;
    }(BaseWidgetWrapper);

var SmokeWidgetWrapper =

    function (_BaseWidgetWrapper5) {
        "use strict";

        _inheritsLoose(SmokeWidgetWrapper, _BaseWidgetWrapper5);

        var _proto6 = SmokeWidgetWrapper.prototype;

        _proto6.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper5.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new SmokeWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function SmokeWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this5;

            _this5 = _BaseWidgetWrapper5.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this5);
            return _this5;
        }

        _proto6.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var percent = Math.round(this.driverProperty.value / (32768.0 / 100.0));

                if (percent < 20) {
                    this.widget.refresh(percent, getLang("smokelow"), this.driver._id, this.driver.historydata.value);
                } else if (percent < 40) {
                    this.widget.refresh(percent, getLang("smokenorm"), this.driver._id, this.driver.historydata.value);
                } else {
                    this.widget.refresh(percent, getLang("smokehigh"), this.driver._id, this.driver.historydata.value);
                }
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return SmokeWidgetWrapper;
    }(BaseWidgetWrapper);

var MotionWidgetWrapper =

    function (_BaseWidgetWrapper6) {
        "use strict";

        _inheritsLoose(MotionWidgetWrapper, _BaseWidgetWrapper6);

        var _proto7 = MotionWidgetWrapper.prototype;

        _proto7.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper6.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new MotionWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function MotionWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this6;

            _this6 = _BaseWidgetWrapper6.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this6);
            return _this6;
        }

        _proto7.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var data = this.driverProperty.value;

                if (this.driver.historydata.value != undefined) {
                    var splitHistory = this.driver.historydata.value.split(";");
                    var count = parseInt(splitHistory[0]);
                    var lastMotion = 0;

                    if (count > 6) {
                        //last minute 
                        for (var i = count - 6; i < count + 1; i++) {
                            lastMotion += parseFloat(splitHistory[i]);
                        }
                    } else {
                        for (var i = 1; i < count + 1; i++) {
                            lastMotion += parseFloat(splitHistory[i]);
                        }
                    }

                    if (lastMotion != 0) {
                        data = 1;
                    }
                }

                var text = "notdetect";

                if (data == 1) {
                    text = "detect";
                }

                this.widget.refresh(data, text, this.driver._id, this.driver.historydata.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return MotionWidgetWrapper;
    }(BaseWidgetWrapper);

var SensorWidgetWrapper =

    function (_BaseWidgetWrapper7) {
        "use strict";

        _inheritsLoose(SensorWidgetWrapper, _BaseWidgetWrapper7);

        function SensorWidgetWrapper() {
            return _BaseWidgetWrapper7.apply(this, arguments) || this;
        }

        var _proto8 = SensorWidgetWrapper.prototype;

        _proto8.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var percent = 0;
                var text = getLang("non");

                if (this.driverProperty.value == 1) {
                    percent = 100;
                    text = getLang("yes");
                }

                this.widget.refresh(percent, text, this.driver._id);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return SensorWidgetWrapper;
    }(BaseWidgetWrapper); //Acturator ----------------------------------------------------------------------------------


var ActuatorWidgetWrapper =

    function () {
        "use strict";

        function ActuatorWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            this.configPropertiesWidget = configPropertiesWidget;
            this.widgetProperties = widgetProperties;

            if (driver == undefined) {
                drivers.addDriverLoadedListner(this.onDriverLoaded, this);
            } else {
                this.driver = driver;
                this.driverProperty = driverProperty;
                this.offlineStarter(parentPanel, driver._id, driverProperty.name, false);
            }
        }

        var _proto9 = ActuatorWidgetWrapper.prototype;

        _proto9.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
            this.driverId = driverId;
            this.driverPropertyName = driverPropertyName;
            dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

            if (noWidget == undefined || !noWidget) {
                this.widget = new ActuatorWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
                this.widget.driverClass = this;
                this.widget.onload = this.onWidgetLoad;
            }
        };

        _proto9.makeUniqueId = function (id) {
            var count = 1;
            var _id = id;
            while (document.getElementById(_id + "BaseWidget") != undefined) {
                _id = id + count;
                count++;
            }
            return _id;
        }


        _proto9.onWidgetLoad = function onWidgetLoad(widget) {
            widget.widgetHolder.onclick = widget.driverClass.widgetClick;

            if (widget.driverClass.widgetProperties != undefined) {
                widget.properties = widget.driverClass.widgetProperties;
            }

            if (widget.driverClass.driver != undefined) {
                widget.driverClass.joinDriver(widget.driverClass.driver, widget.driverClass.driverProperty);
            }

            if (widget.driverClass._onload != undefined) {
                widget.driverClass._onload(widget.driverClass);
            }

        };

        _proto9.joinDriver = function joinDriver(driver, driverProperty) {
            this.driver = driver;
            this.driverProperty = driverProperty;
            if (this.widget != undefined) {
                this.widget.driverClass.driverProperty = driverProperty;
            }
            this.thing = config.getThingByHost(driver._host); //drivers.addNetworkStatusListner(this.onNetworkStatusChange, this);

            this.thing.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addValueListner(this.onValueChange, this);
        };

        _proto9.onDriverLoaded = function onDriverLoaded(sender, driver) {
            if (sender.driver != undefined) return;

            if (sender.driverId == driver._id) {
                sender.joinDriver(driver, driver[sender.driverPropertyName]);
            }
        };

        _proto9.onValueChange = function onValueChange(sender, driverProperty) {
            sender.draw();
        };

        _proto9.onNetworkStatusChange = function onNetworkStatusChange(sender, driverProperty) {
            if (sender.widget != undefined) {
                sender.widget.networkStatus = driverProperty.networkStatus;
            }
        };
        _proto9.onDashboardModeChange = function onDashboardModeChange(sender, mode) {
            if (sender.widget != undefined) {
                if (mode) {
                    sender.widget.mode = WORK_MODE;
                } else {
                    sender.widget.mode = MOVE_MODE;
                }
            }
        };

        _proto9.widgetClick = function widgetClick(event) {
            event.stopPropagation();
            var actuatorWidgetPanel = event.currentTarget;
            var widget = actuatorWidgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                var driverProperty = widget.driverClass.driverProperty;
                if (driverProperty == undefined) return;
                if (parseInt(driverProperty.value) == 1) {
                    driverProperty.setValue(0);
                } else {
                    driverProperty.setValue(1);
                }
            } //return actuatorWidget;


            return true;
        };
        _proto9.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var text = "off";

                if (parseInt(this.driverProperty.value) == 1) {
                    text = "on";
                }

                this.widget.refresh(this.driverProperty.value, text, this.driver._id);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        _createClass(ActuatorWidgetWrapper, [{
            key: "onload",
            get: function get() {
                return this._onload;
            },
            set: function set(onload) {
                this._onload = onload;
            }
        }]);
        return ActuatorWidgetWrapper;
    }(); //LCD ----------------------------------------------------------------------------------


var LCDWidgetWrapper =

    function () {
        "use strict";

        function LCDWidgetWrapper(parentPanel, driver, driverProperty, noWidget, configPropertiesWidget, widgetProperties) {
            this.configPropertiesWidget = configPropertiesWidget;

            if (driver == undefined) {
                drivers.addDriverLoadedListner(this.onDriverLoaded, this);
            } else {
                this.offlineStarter(parentPanel, driver._id, driverProperty.name, noWidget);
                this.joinDriver(driver, driverProperty);
            }
        }

        var _proto10 = LCDWidgetWrapper.prototype;

        _proto10.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
            this.driverId = driverId;
            this.driverPropertyName = driverPropertyName;
            dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

            if (noWidget == undefined || !noWidget) {
                this.widget = new LCDWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
                this.widget.driverClass = this; // this.widget.widgetHolder.onclick = this.widgetClick;
                this.widget.onload = this.onWidgetLoad;
            }
        };

        _proto10.makeUniqueId = function (id) {
            var count = 1;
            var _id = id;
            while (document.getElementById(_id + "BaseWidget") != undefined) {
                _id = id + count;
                count++;
            }
            return _id;
        }


        _proto10.onWidgetLoad = function onWidgetLoad(widget) {
            this.widget.lcdButton.onclick = this.lcdTextClick;
            this.widget.lightButton.onclick = this.lcdLightClick;
            this.draw();
        };


        _proto10.joinDriver = function joinDriver(driver, driverProperty) {
            this.driver = driver;
            this.driver["text"].addNetworkStatusListner(this.onTextChange, this);
            this.driver["text"].addValueListner(this.onTextChange, this);
            this.driver["backlight"].addValueListner(this.onLightChange, this);
            this.driverProperty = driverProperty;
            this.widget.driverClass.driverProperty = driverProperty;
            this.thing = config.getThingByHost(driver._host);
            this.thing.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addValueListner(this.onValueChange, this);
        };

        _proto10.onDriverLoaded = function onDriverLoaded(sender, driver) {
            if (sender.driver != undefined) return;

            if (sender.driverId == driver._id) {
                sender.joinDriver(driver, driver[sender.driverPropertyName]);
            }
        } //---------------------------------------

            /*
            offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
                this.driverId = driverId;
                this.driverPropertyName = driverPropertyName;
                drivers.addNetworkStatusListner(this.onNetworkStatusChange, this);
                 dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);
                 this.widget = new LCDWidget(parentPanel, driverId, configProperties.widgetssize);
                this.widget.driverClass = this;
                this.widget.lcdButton.onclick = this.lcdTextClick;
                this.widget.lightButton.onclick = this.lcdLightClick;
                this.draw();
             }
             constructor(parentPanel, driver, driverProperty, configPropertiesWidget) {
                this.configPropertiesWidget = configPropertiesWidget;
                if (driver == undefined) {
                    drivers.addDriverLoadedListner(this.onDriverLoaded, this);
                }
                else {
                    this.offlineStarter(parentPanel, driver._id, driverProperty.name);
                    this.driver = driver;
                    this.driver["text"].addNetworkStatusListner(this.onTextChange, this);
                    this.driver["text"].addValueListner(this.onTextChange, this);
                    this.driver["backlight"].addValueListner(this.onLightChange, this);
                   //  this.driverProperty = driverProperty;
                 //   this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
                 //  this.driverProperty.addValueListner(this.onValueChange, this);
                 }
            }
              onDriverLoaded(sender, driver) {
                if (sender.driver != undefined) return;
                if (sender.driverId == driver._id) {
                    sender.driver = driver;
                     sender.driver["text"].addNetworkStatusListner(sender.onTextChange, sender);
                    sender.driver["text"].addValueListner(sender.onTextChange, sender);
                    sender.driver["backlight"].addValueListner(sender.onLightChange, sender);
                     drivers.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
                 }
            }
            */
            ;

        _proto10.onDashboardModeChange = function onDashboardModeChange(sender, mode) {
            if (sender.widget != undefined) {
                if (mode) {
                    sender.widget.mode = WORK_MODE;
                } else {
                    sender.widget.mode = MOVE_MODE;
                }
            }
        };

        _proto10.onNetworkStatusChange = function onNetworkStatusChange(sender, driverProperty) {
            if (sender.widget != undefined) {
                sender.widget.networkStatus = driverProperty.networkStatus;
            }
        };

        _proto10.onTextChange = function onTextChange(sender, driverProperty) {
            sender.draw();
        };

        _proto10.onLightChange = function onLightChange(sender, driverProperty) {
            sender.draw();
        };

        _proto10.lcdTextClick = function lcdTextClick(event) {
            event.stopPropagation();
            var lcdWidgetPanel = event.currentTarget;
            var widget = lcdWidgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                widget.hideEditor();
                var driverProperty = widget.driverClass.driver["text"];
                driverProperty.setValue(widget.textarea.value);
            }
        };

        _proto10.lcdLightClick = function lcdLightClick(event) {
            event.stopPropagation();
            var lcdWidgetPanel = event.currentTarget;
            var widget = lcdWidgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                widget.hideEditor();
                var driverProperty = widget.driverClass.driver["backlight"];

                if (parseInt(driverProperty.value) == 1) {
                    driverProperty.setValue(0);
                } else {
                    driverProperty.setValue(1);
                }
            }
        };

        _proto10.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driver == undefined) return;

            if (this.driver["text"].networkStatus == NET_ONLINE) {
                if (this.driver["text"].value != undefined) {
                    this.widget.refresh(this.driver["text"].value, this.driver._id, this.driver["backlight"].value);
                } else {
                    this.widget.refresh("", this.driver._id, this.driver["backlight"].value);
                }
            } else {
                this.widget.refresh("", this.driver._id, 0);
            }

            this.widget.networkStatus = this.driver["text"].networkStatus;
            return true;
        } //set _networkStatus(networkStatus) {
            //this.lcdWidget.networkStatus = networkStatus;
            //}
            ;

        return LCDWidgetWrapper;
    }(); //Stepper ----------------------------------------------------------------------------------


var StepperWidgetWrapper =

    function () {
        "use strict";

        function StepperWidgetWrapper(parentPanel, id, propertyName) {
            this.id = id;
            this.propertyName = propertyName;
            this.stepperWidget = new StepperWidget(parentPanel, id, configProperties.widgetssize);
            this.stepperWidget.driverClass = this;
            this.stepperWidget.positionChangeReciever = this.positionChange;
        }

        var _proto11 = StepperWidgetWrapper.prototype;

        _proto11.positionChange = function positionChange(toPercent) {
            //this is caller (stepperWidget)
            if (this.atProcess) {
                //todo cancel
                this.atProcess = false;
                return;
            }

            this.atProcess = true;
            var driverClass = this.driverClass;
            var newToPosition = toPercent * (driverClass.range / 100);
            setDriverPropertyAsyncWithReciever(driverClass.id, "toposition", newToPosition, driverClass.clientCallback, driverClass);
        };

        _proto11.clientCallback = function clientCallback(data, driverClass) {
            if (!data.indexOf("%error") == 0) {
                driverClass.stepperWidget.networkStatus = NET_RECONNECT;
            } else {
                if (!data.indexOf("response") != -1) {//offline 
                    //  driverClass.stepperWidget.networkStatus = NET_OFFLINE;
                } else {
                    //driver error
                    driverClass.draw(data);
                }
            }
        };

        _proto11.refresh = function refresh() {
            if (status_online == NET_ONLINE) {
                this.position = getParsedDriverProperty(this.id, "position");
                this.toposition = getParsedDriverProperty(this.id, "toposition");
                this.range = getParsedDriverProperty(this.id, "range");
                this.draw(this.position, this.toposition, this.range);
            } else {
                this.stepperWidget.networkStatus = status_online;
            }
        };

        _proto11.draw = function draw(position, toposition, range) {
            if (this.driverProperty == undefined) return;

            if (!isNaN(position)) {
                var percent = position / (range / 100);
                var toPercent = toposition / (range / 100);
                this.stepperWidget.refresh(percent, toPercent, Math.round(percent) + "%", this.id);
                this.stepperWidget.networkStatus = NET_ONLINE;
            } else {//TODO
                // this.stepperWidget.refresh(0, 0, "--", this.id);
                // this.stepperWidget.networkStatus = NET_ERROR;
            }
        };

        _createClass(StepperWidgetWrapper, [{
            key: "_networkStatus",
            set: function set(networkStatus) {
                this.stepperWidget.networkStatus = networkStatus;
            }
        }]);

        return StepperWidgetWrapper;
    }(); //Widget layer -------------------------------------------------


var WidgetsLayer = {

    RadialWidget: {
        id: "radialwidget",
        name: getLang("radial"),
        widget: RadialWidgetWrapper,
        driversTypes: "any",
        driversProperties: "any"
    },
    TemperatureWidget: {
        id: "temperature",
        name: getLang("temperature"),
        widget: TemperatureWidgetWrapper,
        driversTypes: ";" + DHTDriverType + ";",
        driversProperties: ";temperature;"
    },
    HumidityWidget: {
        id: "humidity",
        name: getLang("humidity"),
        widget: HumidityWidgetWrapper,
        driversTypes: ";" + DHTDriverType + ";",
        driversProperties: ";humidity;"
    },
    HistoryDataGraphWidget: {
        id: "historydatagraph",
        name: getLang("historydatagraph"),
        widget: HistoryDataGraphWidgetWrapper,
        driversTypes: "any",
        driversProperties: ";historydata;historyfile;temperaturehistorydata;humidityhistorydata;heatindexhistorydata;pressurehistorydata;altitudehistorydata;temperaturehistorydata;chanel_0_historydata;chanel_1_historydata;chanel_2_historydata;chanel_3_historydata;co2historydata;tvochistorydata;resistencehistorydata;temperaturehistorydata;"
    },
    LightWidget: {
        id: "light",
        name: getLang("light"),
        widget: LightWidgetWrapper,
        driversTypes: ";" + LightDriverType + ";"+ SensorDriverType + ";",
        driversProperties: ";data;light;chanel_0;chanel_1;chanel_2;chanel_3"
    },
    SmokeWidget: {
        id: "smoke",
        name: getLang("smoke"),
        widget: SmokeWidgetWrapper,
        driversTypes: ";" + SmokeDriverType + ";"+ SensorDriverType + ";",
        driversProperties: ";data;smoke;chanel_0;chanel_1;chanel_2;chanel_3"
    },
    MotionWidget: {
        id: "motion",
        name: getLang("motion"),
        widget: MotionWidgetWrapper,
        driversTypes: ";" + MotionDriverType + ";"+ SensorDriverType + ";",
        driversProperties: ";data;motion;"
    },
    SensorWidget: {
        id: "sensor",
        name: getLang("sensor"),
        widget: SensorWidgetWrapper,
        driversTypes: ";" + SensorDriverType + ";",
        driversProperties: ";data;"
    },
    LCDWidget: {
        id: "lcd",
        name: getLang("lcd"),
        widget: LCDWidgetWrapper,
        driversTypes: ";" + LCDDriverType + ";",
        driversProperties: "any"
    },
    ActuatorWidget: {
        id: "actuator",
        name: getLang("actuator"),
        widget: ActuatorWidgetWrapper,
        driversTypes: ";" + ActuatorDriverType + ";",
        driversProperties: ";data;"
    },

    ValueWidget: {
        id: "value",
        name: getLang("value"),
        widget: ValueWidgetWrapper,
        driversTypes: "any",
        driversProperties: "any"
    },


    /*
    StepperWidget: {
        id: "stepper",
        name: getLang("stepper"),
        widget: StepperWidgetWrapper,
        driversTypes: ";" + StepperDriverType + ";",
        driversProperties: "any",
     },
    */
    getWidgetById: function getWidgetById(id) {
        if (id == undefined) return undefined;

        for (var widgetProp in WidgetsLayer) {
            if (WidgetsLayer[widgetProp].id == undefined) continue;

            if (WidgetsLayer[widgetProp].id == id) {
                //динамический перевод name (виджеты могут появится ранее словаря языков)
                WidgetsLayer[widgetProp].name = getLang(WidgetsLayer[widgetProp].id);
                return WidgetsLayer[widgetProp];
            }
        }

        return undefined;
    }
};