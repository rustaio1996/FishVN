const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gameDatabase", {
  saveData: (key, data) => ipcRenderer.invoke("db-save", key, data),
  loadData: (key) => ipcRenderer.invoke("db-load", key),
  clearData: () => ipcRenderer.invoke("db-clear"),
});
