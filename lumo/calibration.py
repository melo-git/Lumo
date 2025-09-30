# Write your code here :-)
import lvgl as lv

from machine import Pin, SPI

#import espidf as esp
lv.init()

import gc
print("Free:", gc.mem_free(), "Allocated:", gc.mem_alloc())


import ili9XXX
import xpt2046
cs_touch = Pin(4, Pin.OUT)

# SPI bus
spi = SPI(
    2,
    baudrate=40_000_000,
    sck=Pin(18),
    mosi=Pin(23),
    miso=Pin(19)
)

# Display driver (ILI9341)
disp = ili9XXX.Ili9341(spi=spi,cs=5,dc=21,rst=22,factor=4, rot=ili9XXX.ILI9XXX_LANDSCAPE)
#touch = xpt2046.Xpt2046(spi=spi,cs=cs_touch, width=240,height=320)

print("After display init → free:", gc.mem_free())
# Touch driver (XPT2046)



scr = lv.obj()
btn = lv.button(scr)
btn.set_size(100, 50)
btn.center()
label = lv.label(btn)
label.set_text("Hello Dominic")
def btn_event_cb(e):
    code = e.get_code()
    if code == lv.EVENT.CLICKED:
        print("✅ Button Pressed!")

while True:
    btn.add_event_cb(btn_event_cb, lv.EVENT.ALL, None)
    lv.screen_load(scr)
    time.sleep(0.2)
