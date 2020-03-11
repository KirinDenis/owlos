![OWLOS в режиме WiFi точки доступа без файлов UI](https://github.com/KirinDenis/owlos/blob/master/OWLOSResource/images/owlos_scheme_WiFIMixedUsage.jpg)

# OWLOS 
### open source network operating system for managing IoT drivers.

- doesn't require internet access or additional servers
- ready to connect with sensors, actuators, LCD, DHT, Stepper and other drivers
- doesn't require programming skills
- built-in user interface - use web browser to access and manage your OWLOS nodes
- built-in RESTful server
- built-in MQTT client
- at the same time WiFi access point and station, in any combination: 
	- can be used autonomously
	- can work on a local network
	- can work via the Internet 
- can integrate with other nodes running under OWLOS - organizing an internal network. without using a servers
- available in source code

# How to build:
  - isnstall Arduino Studio 1.8.9. or upper.
  - isnstall COM port driver if your ESP8266 board use CH340 chip https://wiki.wemos.cc/downloads
  - at Arduino Studio menu File\Preferenses -> Addition board managers -> http://arduino.esp8266.com/stable/package_esp8266com_index.json (NOTE: version 2.5.0)
  - at Arduino Studio menu Tools\Board->Board manager find and install ESP8266 community (https://github.com/esp8266/Arduino)
  * see: https://github.com/wemos/Arduino_D1
  - build and upload OWL firmware on your board.
  * after uploading:  
	- connect to WiFi access point owlunit[YOURESPCHIPID]  PWD: 1122334455
	- browse http://192.168.4.1:8084 to access OWLOS UI LGN: admin PWD: admin
	
# Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)
