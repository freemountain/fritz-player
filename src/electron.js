var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;

var mainWindow = null;
console.log('\n\n\n\nhuhu\n\n\n\n');
app.on('ready', function() {

  ipc.on('set-fullscreen', function(e, f) {
    mainWindow.setFullScreen(f);
  })

  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.openDevTools({detach: true});

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

});
