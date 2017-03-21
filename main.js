const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow
let initWindow
var ipc = require('electron').ipcMain;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 430,
        height: 480,
        frame: true
    })

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {

        mainWindow = null
    })

}

function createInitWindow() {
    initWindow = new BrowserWindow({
        width: 576,
        height: 556,
        frame: true
    })

    initWindow.loadURL(`file://${__dirname}/app/init.html`);

    initWindow.webContents.openDevTools()

    initWindow.on('closed', function() {

        initWindow = null
    })

}

ipc.on('create-init-window', function() {
    subWindow = new BrowserWindow({
        width: 576,
        height: 556,
        fullscreen: false,
        resizable: true,
        skipTaskbar: false,
        frame: true,
        alwaysOnTop: false
    })
    subWindow.webContents.openDevTools()
    subWindow.loadURL('file://' + __dirname + '/app/init.html')
    mainWindow.hide()
})

ipc.on('create-main-window', function() {
    mainWindow = new BrowserWindow({
        width: 430,
        height: 480,
        fullscreen: false,
        resizable: true,
        skipTaskbar: false,
        frame: true,
        alwaysOnTop: false
    })
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL('file://' + __dirname + '/app/index.html')
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
        app.quit()
})




