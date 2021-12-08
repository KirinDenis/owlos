![OWLOS UX](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlosux.jpg)

# OWLOS 

## DIY Open Source OS for building IoT ecosystems

### The project of the future based on OWLOS to monitoring air quality issue. 
### Please visit [OWLOS Air Quality](https://github.com/KirinDenis/OWLOSAirQuality) :sunny:	:umbrella: :cloud:

[ESP32, ESP8266]
- built-in sensors, actuators, LCDs, DHTs, Steppers and other drivers
- built-in script language interpreter 
- built-in HTTP(S) RESTful server, RESTful client, MQTT client
- WiFi access point/station modes
- OTA supported 
- UART AT+ interface supported
- flexible assembly configuration (config.h)
- Web and desktop UX
- doesn't require programming skills
- doesn't require internet and additional servers
- Open Source under GPL-3.0 License 

![OWLOS SCHEME](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlos-scheme.png)

### Source Code map

- **/OWLOS/** C/C++ firmware source code (ESP32, ESP8266)
- **/OWLOS/data/** JavaScript  stand-alone and embedded UX 
- **/OWLOSAdmin/** .Net Core C# WPF UX
- **/OWLOSEcosystem/** (FFR) .Net Core C# WPF + OpenGL UX
- **/OWLOSResource/** Blendar 3D models, schematics and images resources
- **/OWLOSStarter/** C/C++ for uploading OWLOS firmware bin from GitHub (HTTP Updater)

### How to build

1. install [PlatformIO IDE](https://platformio.org/)
2. install COM port drivers for your board
3. in PlatformIO open OWLOS workspace 
4. setup your build configuration in config.h file
5. build and upload OWLOS firmware to your board

[**More detailed**](https://github.com/KirinDenis/owlos/wiki/How-to-install-EN) instruction here

if your board based on ESP8266 -> [ESP8266 prepared assembly](https://github.com/KirinDenis/owlos/tree/ESP8266_Build)

### WiKi

- [Home](https://github.com/KirinDenis/owlos/wiki)
- [Home RU](https://github.com/KirinDenis/owlos/wiki/Home-RU)
- [Оperating modes RU](https://github.com/KirinDenis/owlos/wiki/%D0%9Eperating-modes-RU)
- [WiFi modes RU](https://github.com/KirinDenis/owlos/wiki/WiFi-modes-RU)
- [UI RU](https://github.com/KirinDenis/owlos/wiki/UI-RU)
- [Widgets RU](https://github.com/KirinDenis/owlos/wiki/Widgets-RU) 
- [Features EN](https://github.com/KirinDenis/owlos/wiki/Features-EN)
- [Features RU](https://github.com/KirinDenis/owlos/wiki/Features-RU)
- [How to install EN](https://github.com/KirinDenis/owlos/wiki/How-to-install-EN)
- [How to install RU](https://github.com/KirinDenis/owlos/wiki/How-to-install-RU)
- [Supported hardware RU](https://github.com/KirinDenis/owlos/wiki/Supported-hardware-RU)

### Special thanks to

- [PlatformIO IDE](https://platformio.org/)
- [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)
- [me-no-dev/AsyncTCP (ESP32)](https://github.com/me-no-dev/AsyncTCP)
- [ESP32 HTTPS Server](https://github.com/fhessel/esp32_https_server)
- [Async MQTT Client](http://platformio.org/lib/show/346/AsyncMqttClient)
- [Pro Sidebar](https://github.com/azouaoui-med/pro-sidebar-template)
- [DS3231 Real-Time Clock](http://www.jarzebski.pl/arduino/komponenty/zegar-czasu-rzeczywistego-rtc-ds3231.html)
- [Adafruit Unified Sensor Library](https://github.com/adafruit/Adafruit_Sensor)
- [DHT-sensor-library](https://github.com/adafruit/DHT-sensor-library)
- [LiquidCrystal_I2C](https://gitlab.com/tandembyte/liquidcrystal_i2c)	

### Copyright 2019, 2020, 2021 by

- Mónica (rovt@ua.fm)
- Yan Sokolov (Dadras279@gmail.com)
- Ddone Deedone (https://techadv.xyz/)
- Serhii Lehkii (sergey@light.kiev.ua)
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Stanislav Kvashchuk (skat@ukr.net)
- Vladimir Kovalevich (covalevich@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

[We on Facebook](https://www.facebook.com/groups/OWLOS)
