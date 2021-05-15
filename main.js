'use strict';

const config = require('./config.json');

const electron = require('electron');
const {app, protocol} = require('electron');
const BrowserWindow = electron.BrowserWindow;

const path = require('path')
const url = require('url')

var mainWindow = null;
app.allowRendererProcessReuse = true;

function createWindow () {

    mainWindow = new BrowserWindow({width: config.mode == 'test' ? 1007 : config.mode == 'debug' ? 1200: 805, height: 485, 
        resizable: false, autoHideMenuBar: true,  
        webPreferences: {
        }
    });

    if (config.mode == "debug") {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.setMenu(null);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', () => {
        mainWindow = null
    })

}
 
app.on('ready', createWindow)

app.on('window-all-closed',  () => {
    app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }

});