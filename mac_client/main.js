const {app, BrowserWindow, Tray, Menu, nativeImage, ipcMain} = require('electron')

let mainWindow
let appIcon
let backWindow
const lowimage = nativeImage.createFromPath('/Users/jimsshom/Works/GitRepo/PlantowerMonitor/mac_client/low.png')
const middleimage = nativeImage.createFromPath('/Users/jimsshom/Works/GitRepo/PlantowerMonitor/mac_client/middle.png')
const highimage = nativeImage.createFromPath('/Users/jimsshom/Works/GitRepo/PlantowerMonitor/mac_client/high.png')

function createBackWindow() {
    backWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegrationInWorker: true
        }
    })
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
    appIcon.setContextMenu(contextMenu)
}

app.on('ready', () => {
    ipcMain.on('getdata', (event, arg) => {
      appIcon.setTitle(arg[0].toString(10))
      appIcon.setImage(highimage)
      mainWindow.webContents.send('showdata', arg)
    })
  
    createTray()
})

app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})