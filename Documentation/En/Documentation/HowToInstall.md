# How to build:
  - isnstall Arduino Studio 1.8.9.
  - isnstall COM port driver if your ESP8266 board use CH340 chip https://wiki.wemos.cc/downloads
  - at Arduino Studio menu File\Preferenses -> Addition board managers -> http://arduino.esp8266.com/stable/package_esp8266com_index.json (NOTE: version 2.5.0)
  - at Arduino Studio menu Tools\Board->Board manager find and install ESP8266 community (https://github.com/esp8266/Arduino)
  * see: https://github.com/wemos/Arduino_D1
  - build and upload OWL firmware on your board.
  * after uploading:  
	- connect to WiFi access point owlunit[YOURESPCHIPID]  PWD: 1122334455
	- browse http://192.168.4.1:8084 to access OWLOS UI LGN: admin PWD: admin
