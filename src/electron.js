var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;
const Rx = require('rx');
const utils = require('./node/utils.js');
var Backend = require('./backend');

var mainWindow = null;

app.on('ready', function() {
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
  mainWindow.on('closed', () => mainWindow = null);
});
