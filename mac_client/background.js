document.write('test')
var ipcRenderer = require('electron').ipcRenderer
var request = require('request')
//ipcRenderer.send('getdata', [Math.round((new Date()).getTime() / 1000), 'test'])

request('http://10.0.0.7:8080/get_plantower_data', function (error, response, body) {
    console.log(error)
    console.log(response)
    console.log(body)
    ipcRenderer.send('getdata', [Math.round((new Date()).getTime() / 1000), body])
})
var timerID = setInterval(function() {
    request('http://10.0.0.7:8080/get_plantower_data', function (error, response, body) {
        console.log(error)
        console.log(response)
        console.log(body)
        ipcRenderer.send('getdata', [Math.round((new Date()).getTime() / 1000), body])
    })

    // testdata = '51|58|60|47|65|55|12915|3576|533|46|8|2|0|235|467|0'
    // ipcRenderer.send('getdata', [Math.round((new Date()).getTime() / 1000), testdata])
}, 300 * 1000); 
