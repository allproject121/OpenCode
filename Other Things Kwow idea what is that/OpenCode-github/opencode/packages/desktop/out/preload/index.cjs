let electron = require("electron");
//#region src/shared/ipc-transport.ts
var IpcTransportPort = "desktop-rpc-port";
var DragCancelEvent = "opencode:drag-cancel";
var WindowSnapshotChannel = "desktop-window-snapshot";
function storageSnapshotNames(windowID) {
	return [
		"opencode.global.dat",
		"default.dat",
		windowDataFile(windowID)
	];
}
function windowDataFile(id) {
	return `opencode.window.${id.replace(/[^a-zA-Z0-9._-]/g, "-")}.dat`;
}
//#endregion
//#region src/shared/window-bootstrap.ts
var prefix = "--opencode-window=";
function windowBootstrapFromArguments(args) {
	const value = args.find((arg) => arg.startsWith(prefix))?.slice(18);
	if (!value) throw new Error("Window bootstrap argument not found");
	return JSON.parse(decodeURIComponent(value));
}
//#endregion
//#region src/preload/index.ts
electron.ipcRenderer.on(IpcTransportPort, (event) => {
	const port = event.ports[0];
	if (port) window.postMessage(IpcTransportPort, "*", [port]);
});
electron.ipcRenderer.on(DragCancelEvent, () => window.dispatchEvent(new Event(DragCancelEvent)));
var bootstrap = windowBootstrapFromArguments(process.argv);
var snapshot = electron.ipcRenderer.invoke(WindowSnapshotChannel, storageSnapshotNames(bootstrap.id)).catch(() => ({ storage: {} }));
electron.contextBridge.exposeInMainWorld("electron", {
	windowID: bootstrap.id,
	bootstrap,
	storageSnapshot: snapshot.then((snapshot) => snapshot.storage),
	plugins: snapshot.then((snapshot) => snapshot.plugins),
	getPathForFile: (file) => electron.webUtils.getPathForFile(file)
});
//#endregion
