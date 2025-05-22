import { BrowserWindow, ipcMain } from "electron";

const initWindowControls = () => {
  ipcMain.on('window:minimize', () => {
    const window = BrowserWindow.getFocusedWindow();
    window?.minimize();
  });

  ipcMain.on('window:maximize', () => {
    const window = BrowserWindow.getFocusedWindow();
    if(window?.isMaximized())
      return window.unmaximize();
    window?.maximize();
  });

  ipcMain.on('window:close', () => {
    const window = BrowserWindow.getFocusedWindow();
    window?.close();
  });
};

export default initWindowControls;
