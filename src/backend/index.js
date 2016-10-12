import { app, BrowserWindow } from 'electron';
import electronDebug from 'electron-debug';

electronDebug({ enabled: true });
let win;

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(`file://${__dirname}/../index.html`);

  win.on('closed', () => {
    win = null;
  });

  win.webContents.on('crashed', function () {
    console.log('crash', arguments);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

process.on('uncaughtException', function (error) {
  console.log('error', error);
});
