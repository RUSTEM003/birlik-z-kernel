const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icons/icon.png')
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../web/out/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    osVersion: os.release(),
    osName: os.type()
  };
});

ipcMain.handle('secure-store-get', async (event, key) => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'secure-store.json');
    if (!fs.existsSync(dataPath)) {
      return null;
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return data[key] || null;
  } catch (error) {
    console.error('Error reading from secure store:', error);
    return null;
  }
});

ipcMain.handle('secure-store-set', async (event, key, value) => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'secure-store.json');
    let data = {};
    
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    
    data[key] = value;
    fs.writeFileSync(dataPath, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error writing to secure store:', error);
    return false;
  }
});
