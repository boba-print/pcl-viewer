"use strict";
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
/// const {autoUpdater} = require('electron-updater');
const { is } = require("electron-util");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
const fs = require("fs");
const {
	convertPCLtoPDF,
	openItemWithOSDefault,
	openFileDialog,
} = require("./util.js");

unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAsDefaultProtocolClient("pslpclconverter", process.execPath, ["%1"]);
app.setAppUserModelId("com.psl.pclconverter");

// Prevent window from being garbage collected
let mainWindow;


const createMainWindow = async () => {
	const iconPath = is.macos
		? path.join(__dirname, "static/icons/icon.icns")
		: is.linux
		? path.join(__dirname, "static/icons/512x512.png")
		: path.join(__dirname, "static/icons/icon.ico");
	const window_ = new BrowserWindow({
		title: app.name,
		show: false,
		width: 600,
		height: 600,
		icon: iconPath,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			devTools: false,
		},
	});

	window_.on("ready-to-show", () => {
		window_.show();
	});

	window_.on("closed", () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await window_.loadFile(path.join(__dirname, "index.html"));

	return window_;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

/**
 * Event Listeners
 */
app.on("open-file", async (event, filePath) => {
	const outputPath = `${filePath}.pdf`;
	const output = await convertPCLtoPDF({
		inputPath: filePath,
		outputFile: outputPath,
	});

	await openItemWithOSDefault({ filePath: output });
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(null);
	mainWindow = await createMainWindow();

	/**
	 * Add IpcMain Handler
	 */
	ipcMain.handle("convertPCLtoPDF", async (event, args) => {
		return convertPCLtoPDF(args);
	});

	ipcMain.handle("openItemWithOSDefault", async (event, args) => {
		return openItemWithOSDefault(args);
	});

	ipcMain.handle("openFileDialog", async (event, args) => {
		return openFileDialog(args);
	});
})();

// If development environment
if (!app.isPackaged) {
	require("electron-reload")(__dirname, {
		electron: path.join(__dirname, "node_modules", ".bin", "electron"),
		hardResetMethod: "exit",
	});
}
