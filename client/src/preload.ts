// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('env', {
  API_URL: process.env.API_URL,
});

contextBridge.exposeInMainWorld('electron', {
  auth: {
    login: (credentials: any) => ipcRenderer.invoke('auth/login', credentials),
    register: (credentials: any) => ipcRenderer.invoke('auth/register', credentials),
  },
});
