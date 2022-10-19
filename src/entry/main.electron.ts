import * as path from 'path';
import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 这里的 mainWindow 是打包后的路径 dist/main.js
  mainWindow.loadFile(path.join(__dirname, '../', './src', './entry', 'index.html'));

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
