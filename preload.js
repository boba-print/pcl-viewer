const { contextBridge, ipcRenderer } = require("electron");

const electronHandler = {
	ipcRenderer: {
		invoke: async (channel, data) => ipcRenderer.invoke(channel, data),
	},
};

contextBridge.exposeInMainWorld("electron", electronHandler);
