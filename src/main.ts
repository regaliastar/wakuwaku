import * as path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 800,
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 自定义事件监听
ipcMain.on('toMain', (event, args) => {
  mainWindow.webContents.send('fromMain', args + ' by toMain response');
  event.sender.send('toRenderer', 'pong');
});
