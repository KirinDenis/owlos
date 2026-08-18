[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

### 📢 [Updates from Ukrainian Open Source Community](https://github.com/KirinDenis/owlos/blob/master/docs/CommunityUpdates.md)

### 🇷🇺 [Обращение к гражданам России](https://github.com/KirinDenis/owlos/blob/master/docs/ToRussianPeople.md)

---

[![OWLOS UX](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlosux.jpg)](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlosux.jpg)

# OWLOS

## Open Source IoT firmware and toolset for ESP32 / ESP8266

OWLOS is a DIY open source firmware platform for ESP32 and ESP8266 microcontrollers, paired with desktop and web management tools. It lets you connect sensors, actuators and other peripherals to a local network — and manage them through a built-in web interface or a desktop application — without needing to write code, without requiring internet access, and without any cloud dependency.

The name "OWLOS" reflects the ecosystem nature of the project: multiple nodes can coexist and communicate via MQTT, each running the same firmware with its own configuration.

 🌎 **Related project:** [OWLOS Air Quality](https://github.com/KirinDenis/OWLOSAirQuality) — a complete IoT solution for air quality monitoring built on top of OWLOS.

 ### 💬 Community: [facebook.com/groups/OWLOS](https://www.facebook.com/groups/OWLOS)

---

[![OWLOS SCHEME](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlos-scheme.png)](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlos-scheme.png)

---

## What OWLOS actually does

OWLOS is firmware that runs on an ESP32 or ESP8266 board. Once flashed, the board:

- hosts a **built-in HTTP(S) RESTful server** so you can interact with it directly from a browser or any HTTP client
- connects to your **WiFi network** (or acts as an access point itself)
- exposes all connected peripherals — sensors, actuators, LCDs, relays, etc. — through a unified **REST API and MQTT topics**
- runs a **built-in scripting interpreter** that allows you to define automation rules without programming
- can be **updated over-the-air (OTA)** — no need to reconnect a USB cable for firmware updates
- supports **UART AT+ commands** for serial control

The board does not need the internet. Everything runs locally.

---

## Supported hardware & drivers

- DHT11, DHT22, AM2301 — temperature & humidity
- BMP280, BME680 — barometric pressure
- CCS811 — eCO2 and TVOC
- SI7021 — temperature & humidity
- ADS1X15 — ADC (for analog sensors like MQ7, MQ135, photoresistor)
- Stepper motors
- LCD displays (LiquidCrystal I2C)
- DS3231 RTC — real-time clock
- Generic actuators (relays, LEDs, etc.)

Hardware support is configured through `config.h` before flashing.

---

## Management tools

**Web UX** — a JavaScript single-page application embedded into the firmware and served directly from the ESP board. Works in any browser on the local network.

**OWLOSAdmin** — a .NET Core WPF desktop application for Windows. Connects to one or multiple OWLOS nodes over HTTP/MQTT and provides a richer management interface.

**OWLOSEcosystem** — an experimental .NET Core WPF + OpenGL desktop application for visualizing and managing a network of multiple OWLOS nodes as an ecosystem.

---

## Source code structure

| Folder | Contents |
|---|---|
| `/OWLOS/` | C/C++ firmware source code (ESP32, ESP8266) |
| `/OWLOS/data/` | JavaScript web UX (embedded into firmware) |
| `/OWLOSAdmin/` | .NET Core C# WPF desktop management app |
| `/OWLOSEcosystem/` | (experimental) .NET Core C# WPF + OpenGL ecosystem viewer |
| `/OWLOSResource/` | Blender 3D models, schematics and image resources |
| `/OWLStarter/` | C/C++ HTTP updater — flashes OWLOS firmware from GitHub releases |

**Languages used:** C/C++ (firmware), JavaScript (web UX), C# (desktop tools), HTML/CSS

---

## How to build and flash

1. Install [PlatformIO IDE](https://platformio.org/)
2. Install COM port drivers for your board
3. Open the OWLOS workspace in PlatformIO
4. Configure your build in `config.h`
5. Build and upload to your board

[**Detailed installation guide (EN)**](https://github.com/KirinDenis/owlos/wiki/How-to-install-EN) | [**Инструкция по установке (RU)**](https://github.com/KirinDenis/owlos/wiki/How-to-install-RU)

For ESP8266 boards: [ESP8266 prepared assembly branch](https://github.com/KirinDenis/owlos/tree/ESP8266_Build)

---

## Wiki

- [Home](https://github.com/KirinDenis/owlos/wiki)
- [Features EN](https://github.com/KirinDenis/owlos/wiki/Features-EN)
- [How to install EN](https://github.com/KirinDenis/owlos/wiki/How-to-install-EN)

---

## License

Open Source under [GPL-3.0 License](LICENSE)

---

## Special thanks to

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

---

## Copyright 2019 – 2021 by

- Mónica ([rovt@ua.fm](mailto:rovt@ua.fm))
- Yan Sokolov ([Dadras279@gmail.com](mailto:Dadras279@gmail.com))
- Ddone Deedone (https://techadv.xyz/)
- Serhii Lehkii ([sergey@light.kiev.ua](mailto:sergey@light.kiev.ua))
- Konstantin Brul ([konstabrul@gmail.com](mailto:konstabrul@gmail.com))
- Vitalii Glushchenko ([cehoweek@gmail.com](mailto:cehoweek@gmail.com))
- Stanislav Kvashchuk ([skat@ukr.net](mailto:skat@ukr.net))
- Vladimir Kovalevich ([covalevich@gmail.com](mailto:covalevich@gmail.com))
- Denys Melnychuk ([meldenvar@gmail.com](mailto:meldenvar@gmail.com))
- Denis Kirin ([deniskirinacs@gmail.com](mailto:deniskirinacs@gmail.com))

[We on Facebook](https://www.facebook.com/groups/OWLOS)
