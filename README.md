This repository contains **Readme Banners** (and some useful docs) that can be used by OSS projects to spread the word, support and help Ukraine in this disastrous situation. Like this **(click to open)**:

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

### 📢 [Updates from Ukrainian Open Source Community](/docs/CommunityUpdates.md)
### 🇷🇺 [Обращение к гражданам России](/docs/ToRussianPeople.md)

## For Maintainers and Authors

1. Spread the word. [Add one of the banners](/docs/AddBanner.md) to your **`README.md`**. Badges are also available
2. Get rid of [Russian software and dependencies](/docs/Boycott.md)
3. Deliver [a message](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/ToRussianPeople.md) to your users (esp. those in Russia) along with your next release. See [example here](https://github.com/vshymanskyy/StandWithUkraine/issues/4)
4. Follow the [cyber safety guide](/docs/CyberSafety.md)


![OWLOS UX](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlosux.jpg)

# OWLOS 
### DIY Open Source OS for building IoT ecosystems
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

![OWLOS SCHEME](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlos_scheme.jpg)

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
