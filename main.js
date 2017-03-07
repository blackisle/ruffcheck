const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow
var ipc = require('electron').ipcMain;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        frame: true
    })

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {

        mainWindow = null
    })

}

ipc.on('create-sub-window', function() {
    subWindow = new BrowserWindow({
        width: 640,
        height: 480,
        fullscreen: false,
        resizable: false,
        skipTaskbar: true,
        frame: false,
        alwaysOnTop: true
    })
    //subWindow.webContents.openDevTools()
    subWindow.loadURL('file://' + __dirname + '/sub.html')
    mainWindow.hide()
})

ipc.on('create-main-window', function() {
    mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        fullscreen: false,
        resizable: false,
        skipTaskbar: true,
        frame: false,
        alwaysOnTop: true
    })
    //subWindow.webContents.openDevTools()
    mainWindow.loadURL('file://' + __dirname + '/index.html')
    subWindow.hide()
})

app.on('ready', createWindow);

ipc.on('close', function() {
    app.quit()
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})




