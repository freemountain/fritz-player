var app = require('app');
var BrowserWindow = require('browser-window');
const electron = require('electron');
var ipc = electron.ipcMain;
const powerSaveBlocker = electron.powerSaveBlocker;

const Rx = require('rx');
const utils = require('./node/utils.js');
var Backend = require('./backend');

var mainWindow = null;

app.on('ready', function() {
  var id = powerSaveBlocker.start('prevent-display-sleep');

  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  var _ipc = {
    send: mainWindow.webContents.send.bind(mainWindow.webContents),
    on: ipc.on.bind(ipc)
  };
  var ipcBackend = utils.getIpcSubject('backend', _ipc);
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  var backend = Backend();
  backend.subscribe(ipcBackend);


  mainWindow.openDevTools({detach: true});
  mainWindow.on('closed', function() {
    powerSaveBlocker.stop(id);
    mainWindow = null
  });
});
