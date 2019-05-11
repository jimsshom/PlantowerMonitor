const electron = require('electron')
const {app, BrowserWindow, Tray, Menu, nativeImage, ipcMain} = require('electron')

let appIcon
let backWindow
let dispWindow
let currentData
const lowimage = nativeImage.createFromPath('/Users/jimsshom/Works/GitRepo/PlantowerMonitor/mac_client/low.png')
const middleimage = nativeImage.createFromPath('/Users/jimsshom/Works/GitRepo/PlantowerMonitor/mac_client/middle.png')
const highimage = nativeImage.createFromPath('/Users/jimsshom/Works/GitRepo/PlantowerMonitor/mac_client/high.png')

function createDisplayWindow(x, y) {
    dispWindow = new BrowserWindow({
        width: 300,
        height: 200,
        x: x,
        y: y,
        show: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    //dispWindow.webContents.openDevTools()
    dispWindow.loadFile('display.html')
    dispWindow.once('ready-to-show', () => {
        dispWindow.webContents.send('showdata', currentData)
        dispWindow.show()
    })
    dispWindow.on('close', () => {
        dispWindow = null
    })
}

function closeDisplayWindow() {
    if (dispWindow != null) {
        dispWindow.close()
    }
}

function triggerDisplayWindow(x, y) {
    if (dispWindow == null) {
        createDisplayWindow(x, y)
    } else {
        closeDisplayWindow()
    }
}

function createBackWindow() {
    let displays = electron.screen.getAllDisplays()
    let externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    if (externalDisplay) {
        backWindow = new BrowserWindow({
            x: externalDisplay.bounds.x + 800,
            y: externalDisplay.bounds.y + 400,
            show: true,
            webPreferences: {
                nodeIntegration: true
            }
        })
    } else {
        backWindow = new BrowserWindow({
            show: true,
            webPreferences: {
                nodeIntegration: true
            }
        })
    }
    backWindow.webContents.openDevTools()
    backWindow.loadFile('background.html')
}

function createTray() {
    appIcon = new Tray(lowimage)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'item1', type: 'radio'
        }
    ])
    appIcon.setTitle('waiting')
    appIcon.setToolTip('just for test')
    //appIcon.setContextMenu(contextMenu)
    appIcon.on('click', (event, bounds, position) => {
        //新建窗口并且实时查询
        //createDisplayWindow()
        console.log(bounds)
        console.log(position)
        let x = bounds.x
        let y = bounds.height
        triggerDisplayWindow(x, y)
    })
    appIcon.on('mouse-leave', (event, position) => {
        //关闭窗口
        //closeDisplayWindow()
    })
}

app.on('ready', () => {
    createTray()
    ipcMain.on('getdata', (event, arg) => {
        //CF=1(ug/m3) PM1.0/PM2.5/PM10
        //STD(ug/m3)  PM1.0/PM2.5/PM10
        //>(/0.1L)    0.3um/0.5um/1.0um/2.5um/5.0um/10um
        //HCHO  Temperature   Humidity
        ts = arg[0]
        data = arg[1]
        var [cf1_10,cf1_25,cf1_100,std_10,std_25,std_100,um_3,um_5,um_10,um_25,um_50,um_100,hcho,temp,hum,check] = data.split('|')
        var aqi = Math.max(cf1_10, cf1_25, cf1_100, std_10, std_25, std_100)
        if (aqi > 120) {
            appIcon.setImage(highimage)
        } else if (aqi > 70) {
            appIcon.setImage(middleimage)
        } else {
            appIcon.setImage(lowimage)
        }
        appIcon.setTitle(aqi.toString(10))
        //mainWindow.webContents.send('showdata', arg)
        currentData = arg
        if (dispWindow != null) {
            dispWindow.webContents.send('showdata', currentData)
        }
    })
    createBackWindow()
})

app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})