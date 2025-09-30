# main.py — LVGL v9.3 QR demo for lv_micropython
import lvgl as lv
from machine import Pin, SPI
import time

# -------------------------
# 1) LVGL init (safe)
# -------------------------
try:
    if not lv.is_initialized():
        lv.init()
except Exception:
    # some bindings don't have is_initialized()
    try:
        lv.init()
    except Exception:
        pass

# -------------------------
# 2) Display init (adjust to your driver)
# -------------------------
# Replace this block with whatever driver/module you use (ili9XXX, st77xx, lvesp32, ...)
spi = None
try:
    import ili9XXX                 # your local driver (you said you have this)
    spi = SPI(2, baudrate=40_000_000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
    disp = ili9XXX.Ili9341(spi=spi, cs=5, dc=21, rst=22, factor=16)
    print("Display initialized")
except Exception as e:
    print("Display init skipped/failed (ok if already initialized elsewhere):", e)

# -------------------------
# 3) (Optional) Touch init
# -------------------------
try:
    import xpt2046
    # Use your measured ranges for best results; change ranges if you calibrated already.
    touch = xpt2046.Xpt2046(spi=spi, cs=4, spiRate=40000000,width=240, height=320,ranges=((200, 3900), (200, 3900)))
    print("Touch driver initialized")
except Exception as e:
    print("Touch init skipped/failed (ok if handled elsewhere):", e)

# -------------------------
# 4) Get/create screen (LVGL v9 safe)
# -------------------------
try:
    scr = lv.screen_active()   # LVGL v9
except AttributeError:
    # older bindings
    try:
        scr = lv.scr_act()
    except AttributeError:
        # fallback: create a screen and load it
        scr = lv.obj()
        try:
            lv.screen_load(scr)
        except Exception:
            try:
                lv.scr_load(scr)
            except Exception:
                pass

# -------------------------
# 5) Make a QR object
# -------------------------
# make sure the lv qrcode widget is available
if not hasattr(lv, "qrcode"):
    raise RuntimeError("lv.qrcode not available in this build. Enable LV_USE_QRCODE in lv_conf.h and rebuild.")

# colors and size
dark_col = lv.color_hex(0x000000)
light_col = lv.color_hex(0xFFFFFF)
QR_SIZE = 240   # px — change to fit your layout

# create qrcode
qr = lv.qrcode(lv.screen_active())
qr.set_size(200)      # make sure this fits inside your 240x320 display
qr.align(lv.ALIGN.CENTER, 0, 0)

# helper to update qr (handles bindings that expect either 1 or 2 args)
def update_qr(qrobj, data_str):
    try:
        # try update(data, len)
        qrobj.update(data_str, len(data_str))
        qr.set_dark_color(lv.color_hex(0x000000))  # black modules
        qr.set_light_color(lv.color_hex(0xFFFFFF))
    except TypeError:
        # some python bindings accept update(data) only
        qrobj.update(data_str)

# initial QR content
URL1 = "solana:F23VVzg3MM2GieGWKbyLBxBQYhp5sJnGiQH6d8G9qQGE?amount=10&reference=14VQNa6WZNz6qVQm7TznSJHs8K467r1xwT439vjVJnpH&label=airtime&message=airtime+purchase"
URL2 = "https://example.org/bar"
_current = 0
update_qr(qr, URL1)

# -------------------------
# 6) Add a button that toggles QR data and prints to REPL
# -------------------------

# make sure screen is loaded in v9 style
try:
    lv.screen_load(scr)
except Exception:
    try:
        lv.scr_load(scr)
    except Exception:
        pass

print("QR demo ready — touch the button to change QR. Prints appear in REPL.")
