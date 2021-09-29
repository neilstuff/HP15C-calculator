'use strict';

const config = require('./config.json');

const {app, protocol, BrowserWindow} = require('electron');

const path = require('path');

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
    mainWindow.loadURL(`file:///${path.join(__dirname, 'index.html')}`);


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