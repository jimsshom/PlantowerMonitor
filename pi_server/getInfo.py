#!/usr/bin/env python
import time
import serial
import struct

def _read_data(_port):
    rv = b''
    while True:
        ch1 = _port.read()
        if ch1 == b'\x42':
            ch2 = _port.read()
            if ch2 == b'\x4d':
                rv += ch1 + ch2
                rv += _port.read(38)
                return rv

def get_plantower_data():
    ser = serial.Serial(
        port='/dev/ttyS0',
        baudrate = 9600,
        timeout=2
    )
    recv = _read_data(ser)
    tmp = recv[4:36]
    datas = struct.unpack('>hhhhhhhhhhhhhhhh', tmp)
    return datas

if __name__ == "__main__":
    datas = get_plantower_data()
    content = '''Plantower PMS5003ST,Updated: %s
CF=1(ug/m3) PM1.0/PM2.5/PM10: %d,%d,%d
STD(ug/m3)  PM1.0/PM2.5/PM10: %d,%d,%d
>(/0.1L)    0.3um/0.5um/1.0um/2.5um/5.0um/10um: %d,%d,%d,%d,%d,%d
HCHO       : %.3fmg/m3
Temperature: %.1fC     Humidity   : %.1f%%''' % (time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                datas[0], datas[1], datas[2], datas[3], datas[4], datas[5], datas[6], datas[7], datas[8], datas[9], datas[10], datas[11], datas[12]/1000.0, datas[13]/10.0, datas[14]/10.0)
    print content

