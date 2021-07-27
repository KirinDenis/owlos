//Michael Schnyder (michael.schnyder@outlook.com)
//http://blog.emtwo.ch
//https://gist.github.com/michaelschnyder/39cd6dd31d0a2d09a803e9a7748b5184

#ifndef COLORS_H
#define COLORS_H

#define BGR16(color) rgb32_to_bgr16(color)
#define rgb32_to_bgr16(color) rgbc32_to_bgr16((color & 0xFF0000) >> 16, (color & 0x00FF00) >> 8, (color & 0x0000FF))
#define rgbc32_to_bgr16(red, green, blue) ((blue & 0b11111000) << 8) | ((green & 0b11111100) << 3) | (red >> 3)

#define RGB16(color) rgb32_to_rgb16(color)
#define rgb32_to_rgb16(color) rgbc32_to_rgb16((color & 0xFF0000) >> 16, (color & 0x00FF00) >> 8, (color & 0x0000FF))
#define rgbc32_to_rgb16(red, green, blue) ((red & 0b11111000) << 8) | ((green & 0b11111100) << 3) | (blue >> 3)

#endif
