# owlos UI
Open Source IoT Operation System

You can load UI files into the microcontroller flash file system and use it directly - in this case, your microcontroller will be an independent, with an autonomous
firmware and UI. You don’t even need Internet access to fully use OWL OS.

Also, you can open index.html in your browser directly from stored UI files on your disk (it work faster, but microcontroller has only firmware on board).

In both cases, pay attention to the restclientcore.js files with the boardhost variable - it contains either the address of the microcontroller on the network or a blank line. 
(empty line used if UIs are loaded from the microcontroller).

Files map:
- *core.js - UI core files (use them as a basis for developing your own UI)
- *ui.js - UI elements
- *indicator.js - indicators, you can use them separately from this project. (see indicatorswrapper.js to understand how indicators interact with UI and Core)

We also put copies of: bootstrap.min.css, bootstrap.min.js, dataTables.min.css, jquery.dataTables.min.js, jquery.min.js, popper.min.js - why? - Because OWL OS (in particular its UI) can work without Internet access (completely autonomous), however, for rendering UI we use jQuery and Bootstrap - so we are forced to move copies of these libraries with along with the UI.
See the file bootcore.js - at boot, an attempt is made to downalod the jQuery library from Internet, if the Internet is unavailable - a locally stored jQuery copy is used.


