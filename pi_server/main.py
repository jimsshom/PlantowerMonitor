#!/usr/bin/env python
import time
import serial
import struct
import requests 

url = 'https://shrib.com/zuex/api.php'
cookies = {
    '_ga':'GA1.2.1774380445.1553093305',
    '_gid':'GA1.2.1854892775.1553093305',
    'guetsli':'lBDzbt7ldFiFXQFPKuoqu72PaRQPOYnwB6Hcp7qd'
}

def updateContent(text):
    data = {
        'note': 'GmHBtNFlusKaovqg5u4R',
        'text': text
    }
    r = requests.post(url=url, data=data, verify=False, cookies=cookies)
    j = r.json()
    if j['id'] == True:
        print 'update success'
        return
    else:
        raise Exception('updateContent exception')

def readContent():
    data = {
        'action': 'init',
        'qll': 'https://www.google.com/',
        'note': 'GmHBtNFlusKaovqg5u4R'
    }
    r = requests.post(url=url, data=data, verify=False, cookies=cookies)
    j = r.json()
    if j['id'] == True:
        return j['text']
    else:
        raise Exception('readContent exception')


ser = serial.Serial(
        port='/dev/ttyS0',
        baudrate = 9600,
        timeout=2
        )

def readData(_port):
    rv = b''
    while True:
        ch1 = ser.read()
        if ch1 == b'\x42':
            ch2 = ser.read()
            if ch2 == b'\x4d':
                rv += ch1 + ch2
                rv += ser.read(38)
                return rv

def removeOldData(content):
    segs = content.split('Plantower PMS5003ST')
    result = ''
    if len(segs) > 10:
        segs = segs[len(segs)-10:]
    for seg in segs:
        if seg.strip() == '':
            continue
        result += 'Plantower PMS5003ST' + seg
    return result

recv = readData(ser)
tmp = recv[4:36]
datas = struct.unpack('>hhhhhhhhhhhhhhhh', tmp)

content = '''
Plantower PMS5003ST,Updated: %s
CF=1(ug/m3) PM1.0/PM2.5/PM10: %d,%d,%d
STD(ug/m3)  PM1.0/PM2.5/PM10: %d,%d,%d
>(/0.1L)    0.3um/0.5um/1.0um/2.5um/5.0um/10um: %d,%d,%d,%d,%d,%d
HCHO       : %.3fmg/m3
Temperature: %.1fC     Humidity   : %.1f%%
''' % (time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        datas[0], datas[1], datas[2], datas[3], datas[4], datas[5], datas[6], datas[7], datas[8], datas[9], datas[10], datas[11], datas[12]/1000.0, datas[13]/10.0, datas[14]/10.0)

print content

originalContent = readContent()
content = originalContent + '\n' + content
content = removeOldData(content)
updateContent(content)
