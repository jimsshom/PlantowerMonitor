#!/usr/bin/env python
# -*- coding: UTF-8 -*-
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


print readContent()
updateContent('OK!3')
