import { contextBridge, ipcRenderer } from 'electron';

const modules = {
  auth: ['login', 'register'],
};

const buildIpcAPI = (struct: Record<string, string[]>) => {
  const api: Record<string, any> = {};
  for(const module in struct) {
    const methods = struct[module];
    if(methods.length < 1)
      continue;
    api[module] = new Object();
    for(const method of methods) {
      api[module][method] = (...args: any[]) => ipcRenderer.invoke(`${module}/${method}`, ...args);
    };
  };
  return api;
};

contextBridge.exposeInMainWorld('electron', buildIpcAPI(modules));

contextBridge.exposeInMainWorld('env', {
  API_URL: process.env.API_URL,
});
