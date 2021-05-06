![OWLOS Web UX](https://github.com/KirinDenis/owlos/raw/master/OWLOSResource/images/owlos_webux.jpg)

# OWLOS Web UX

Open index.html in your browser and type IP address of OWLOS microcontroller.

Or, pack and uploading JavaScript files into the microcontroller flash file system and use it independently (autonomous).

In both cases, pay attention to the restclientcore.js file contains the boardhost variable - the default IP address of OWLOS microcontroller. 

### Please see:
[How to install](https://github.com/KirinDenis/owlos/wiki/How-to-install-EN) (5.x) 

[Video instruction](https://www.youtube.com/watch?v=wqaX4ojn0hw)

### Files map:
- NNNNcore.js - UX core files (use them as a basis for developing your own UI)
- NNNNui.js – UX elements
- NNNNwidget.js - widgets, you can use it separately from OWLOS UX. (see widgetswrapper.js to understand how widgets interact with UX and Core)

### Note:
Copies of: bootstrap.min.css, bootstrap.min.js, dataTables.min.css, jquery.dataTables.min.js, jquery.min.js must be at this data folder. 
Why? 

Because OWLOS can work without Internet access (completely autonomous), however, for rendering UX we use jQuery and Bootstrap - so we are forced to move copies of these libraries with along with the UX.
See: the file bootcore.js - at boot, an attempt is try to download the jQuery library from Internet, if the Internet is unavailable - a locally stored jQuery copy is used.


