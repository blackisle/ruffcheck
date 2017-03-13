const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow
let initWindow
var ipc = require('electron').ipcMain;

function createMainWindow() {
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

function createInitWindow() {
    initWindow = new BrowserWindow({
        width: 640,
        height: 480,
        frame: true
    })

    initWindow.loadURL(`file://${__dirname}/init.html`);

    initWindow.webContents.openDevTools()

    initWindow.on('closed', function() {

        initWindow = null
    })

}

ipc.on('create-init-window', function() {
    subWindow = new BrowserWindow({
        width: 640,
        height: 480,
        fullscreen: false,
        resizable: false,
        skipTaskbar: true,
        frame: false,
        alwaysOnTop: true
    })
    subWindow.webContents.openDevTools()
    subWindow.loadURL('file://' + __dirname + '/init.html')
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
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL('file://' + __dirname + '/index.html')
    initWindow.hide()
})

global.sharedObject = {
  selectedSerial: ''
}

app.on('ready', createInitWindow);

ipc.on('close', function() {
    app.quit()
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})




