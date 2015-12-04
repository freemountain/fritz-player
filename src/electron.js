var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;

var Backend = require('./backend');

var mainWindow = null;

app.on('ready', function() {

  ipc.on('set-fullscreen', function(e, f) {
    mainWindow.setFullScreen(f);
  });



  mainWindow = new BrowserWindow({width: 800, height: 600});

  var backend = new Backend();
  backend._onEmit = function(event, arg) {
    console.log('oneEss');
    mainWindow.webContents.send('backend', {event, arg});
  };

  ipc.on('backend', function(event, arg) {
    backend.inject(arg.event, arg.arg);
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.on('did-finish-load', function() {
    backend._promiseLoad();
  });
  mainWindow.openDevTools({detach: true});

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

});
