import initWindowControls from './scripts/server/ipc/windowControls';
import handlersSetup from './scripts/server/ipc/handlersSetup';
import { app, BrowserWindow } from 'electron';
import dotEnv from 'dotenv';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

dotEnv.config();

if (require('electron-squirrel-startup')) {
  app.quit();
};

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minHeight: 580,
    frame: false,
    titleBarStyle: 'hidden',
    minWidth: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
  createWindow();
  handlersSetup();
  initWindowControls();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  };
});
