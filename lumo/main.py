import ujson as json
import lvgl as lv
from machine import Pin, SPI
import time
import network
import urequests as req


API_URL = "https://lumosol.pythonanywhere.com/api/terminal/address-log"
DEVICE_SERIAL_ID = "LUMO-A2"
USER_AGENT = "ESP32-Micropython"

wlan = network.WLAN(network.STA_IF)

# log IP address to the server when connected to the internet
IP_ADDR = "0.0.0.0"
merchant_id = None
if wlan.isconnected():
    global merchant_id
    IP_ADDR = wlan.ifconfig()[0]

    payload = {"device_serial_id": DEVICE_SERIAL_ID, "ip_addr_used": IP_ADDR, "user_agent": USER_AGENT}

    try:
        headers = {"Content-Type": "application/json"}
        res = req.post(API_URL, data=json.dumps(payload), headers=headers)

        print("Status:", res.status_code)
        _data = res.json()
        merchant_id = _data['merchant_id']
        print("Response:", res.json())

        res.close()

    except Exception as e:
        print("Error sending log:", e)





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
    disp = ili9XXX.Ili9341(spi=spi, cs=5, dc=21, rst=22, factor=16, rot=ili9XXX.ILI9XXX_LANDSCAPE)
    print("Display initialized")
except Exception as e:
    print("Display init skipped/failed (ok if already initialized elsewhere):", e)



# Polling loop
# -------------------------
def poll_server():
    global merchant_id
    try:
        headers = {"Content-Type": "application/json"}
        res = req.get(f"https://lumosol.pythonanywhere.com/api/payment-link/{merchant_id}", headers=headers)
        if res.status_code == 200:
            data = res.json()
            pay_link = data["pay_link"]
            if pay_link:
                handle_incoming_link(pay_link)
        else:
            print("Poll failed:", res.status_code)
        res.close()
    except Exception as e:
        print("Polling error:", e)

# Show QR screen (big)

if not hasattr(lv, "qrcode"):
    raise RuntimeError("lv.qrcode not available in this build. Enable LV_USE_QRCODE in lv_conf.h and rebuild.")

# colors and size
dark_col = lv.color_hex(0x000000)
light_col = lv.color_hex(0xFFFFFF)

# create qrcode
qr = lv.qrcode(lv.screen_active())
qr.set_size(220)      # make sure this fits inside your 240x320 display
qr.align(lv.ALIGN.CENTER, 0, 0)

def update_qr(qrobj, url):
    try:
        # try update(data, len)
        qrobj.update(url, len(url))
        qr.set_dark_color(lv.color_hex(0x000000))  # black modules
        qr.set_light_color(lv.color_hex(0xFFFFFF))
    except TypeError:
        # some python bindings accept update(data) only
        qrobj.update(url)




def handle_incoming_link(link):
    ("Incoming link:", link)
    # show it
    update_qr(qr, link)
    #send_nfc(link)


try:
    lv.screen_load(scr)
except Exception:
    try:
        lv.scr_load(scr)
    except Exception:
        pass
try:
    while True:
        #lv.timer_handler()
        # periodic checks (non-blocking)
        poll_server()
        time.sleep(5)  # poll every 5s
except KeyboardInterrupt:
    print("Stopped")
