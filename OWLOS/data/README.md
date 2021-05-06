# OWLOS UX
DIY Open Source OS for building IoT ecosystems

Pack and uploading JavaScript files into the microcontroller flash file system and use it independently (autonomous).

Or open index.html in your browser and type IP address of OWLOS microcontroller.

In both cases, pay attention to the restclientcore.js file the boardhost variable - it contains the default IP address of OWLOS microcontroller. 
Please see:
[How to install](https://github.com/KirinDenis/owlos/wiki/How-to-install-EN) (5.x) 
[Video instruction here](https://www.youtube.com/watch?v=wqaX4ojn0hw)

### Files map:
- *core.js - UI core files (use them as a basis for developing your own UI)
- *ui.js - UI elements
- *widget.js - widgets, you can use them separately from this project. (see widgetswrapper.js to understand how widgets interact with UI and Core)

### Note
We put copies of: bootstrap.min.css, bootstrap.min.js, dataTables.min.css, jquery.dataTables.min.js, jquery.min.js, - why? - Because OWLOS (in particular its UX) can work without Internet access (completely autonomous), however, for rendering UX we use jQuery and Bootstrap - so we are forced to move copies of these libraries with along with the UX.
See the file bootcore.js - at boot, an attempt is made to download the jQuery library from Internet, if the Internet is unavailable - a locally stored jQuery copy is used.


