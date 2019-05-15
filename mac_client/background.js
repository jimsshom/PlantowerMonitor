const ipcRenderer = require('electron').ipcRenderer
const storage = require('electron-json-storage')
const request = require('request')

let targetUrl, refreshSec, timerId

//let targetUrl = 'http://10.0.0.7:8080/get_plantower_data'
//let refreshSec = 300

function onSettingUpdated() {
    let newUrl, newSec
    storage.has('setting', (error, hasKey) => {
        if (error) throw error;
        if (hasKey) {
            storage.get('setting', (error, data) => {
                if (error) throw error
                //console.log(data)
                newUrl = data['url']
                newSec = data['interval']

                if (newUrl != targetUrl) {
                    targetUrl = newUrl
                    requestOnce()
                }
                if (newSec != refreshSec) {
                    refreshSec = newSec
                    clearInterval(timerId)
                    setTimer()
                }
            })
        }
    })
}

function requestOnce() {
    if (targetUrl == null) {
        return
    }
    var options = {
        url:  targetUrl,
        timeout: 2000
    }
    request(options, function (error, response, body) {
        console.log(body)
        if (body == null) {
            ipcRenderer.send('getdata', [Math.round((new Date()).getTime() / 1000), 'requestError'])
        } else {
            ipcRenderer.send('getdata', [Math.round((new Date()).getTime() / 1000), body])
        }
    })
}

function clearTimer() {
    if (timerId != null) {
        clearInterval(timerId)
        timerId = null
    }
}

function setTimer() {
    if (refreshSec == null) {
        return
    }
    timerId = setInterval(() => {
        requestOnce()
    }, refreshSec * 1000);
}

ipcRenderer.on('settingUpdated', (event, arg) => {
    onSettingUpdated()
})

onSettingUpdated()