import { Ac as runForkWith, As as flatMap, Js as logDebug, Ns as fn, Qs as logWarning, Xc as sync, Ys as logError, Zs as logInfo, _s as context, cs as callback, dl as void_, hs as catch_, nl as tryPromise, tl as timeoutOrElse, ts as andThen, ws as fail } from "./Latch-oSncnOpo.js";
import { app, autoUpdater } from "electron";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import pkg from "electron-updater";
//#region ../gui-plugins/src/updater/platform.ts
var updateClient = pkg.autoUpdater;
var execFileAsync = promisify(execFile);
var restartTimeout = 1e4;
var unpackTimeout = 12e4;
var make = fn("Updater.platform")(function* (channel) {
	const userAgent = `opencode/${channel === "prod" ? "latest" : channel}/${app.getVersion()}/desktop`;
	const runFork = runForkWith(yield* context());
	updateClient.logger = {
		info: (...args) => runFork(logInfo(...args)),
		warn: (...args) => runFork(logWarning(...args)),
		error: (...args) => runFork(logError(...args)),
		debug: (...args) => runFork(logDebug(...args))
	};
	updateClient.channel = "latest";
	updateClient.requestHeaders = { "User-Agent": userAgent };
	updateClient.allowPrerelease = false;
	updateClient.allowDowngrade = true;
	updateClient.autoDownload = false;
	updateClient.autoInstallOnAppQuit = process.platform === "darwin";
	yield* logInfo("auto updater configured", {
		channel: updateClient.channel,
		allowPrerelease: updateClient.allowPrerelease,
		allowDowngrade: updateClient.allowDowngrade,
		currentVersion: app.getVersion()
	});
	return {
		checkForUpdate: tryPromise({
			try: async () => {
				const result = await updateClient.checkForUpdates();
				if (!result?.isUpdateAvailable) return void 0;
				const files = result.updateInfo.files;
				const native = files.filter((file) => file.url.includes("arm64"));
				if (process.platform === "win32" && app.runningUnderARM64Translation && native.length > 0) {
					files.splice(0, files.length, ...native);
					runFork(logInfo("updating emulated x64 install to native ARM64", { urls: native.map((file) => file.url) }));
				}
				return {
					mode: "restart",
					version: result.updateInfo.version
				};
			},
			catch: (error) => error
		}),
		stageUpdate,
		installAndRestart
	};
});
function stageUpdate(options) {
	if (process.platform !== "darwin") return tryPromise({
		try: () => {
			updateClient.disableDifferentialDownload = process.platform === "win32" && (!options.differential || app.runningUnderARM64Translation);
			return updateClient.downloadUpdate();
		},
		catch: (error) => error
	}).pipe(flatMap(unpackInstaller));
	return callback((resume) => {
		const cleanup = () => {
			autoUpdater.removeListener("update-downloaded", complete);
			updateClient.removeListener("error", fail$2);
		};
		const complete = () => {
			cleanup();
			resume(void_);
		};
		const fail$2 = (error) => {
			cleanup();
			resume(fail(error));
		};
		autoUpdater.once("update-downloaded", complete);
		updateClient.once("error", fail$2);
		updateClient.downloadUpdate().catch(fail$2);
		return sync(cleanup);
	});
}
function unpackInstaller(files) {
	const installer = files.find((file) => file.endsWith(".exe"));
	if (process.platform !== "win32" || !app.isPackaged || !installer) return void_;
	return tryPromise(() => execFileAsync(installer, ["--stage"], {
		windowsHide: true,
		timeout: unpackTimeout
	})).pipe(andThen(logInfo("update unpacked before restart", { installer })), catch_((error) => logWarning("update not unpacked before restart", {
		installer,
		message: error.cause instanceof Error ? error.cause.message : String(error.cause)
	})));
}
var installAndRestart = callback((resume) => {
	const cleanup = () => {
		autoUpdater.removeListener("before-quit-for-update", started);
		updateClient.removeListener("error", fail$1);
	};
	const started = () => {
		cleanup();
		resume(void_);
	};
	const fail$1 = (error) => {
		cleanup();
		resume(fail(error));
	};
	autoUpdater.once("before-quit-for-update", started);
	updateClient.once("error", fail$1);
	try {
		updateClient.quitAndInstall();
	} catch (error) {
		fail$1(error instanceof Error ? error : new Error(String(error)));
	}
	return sync(cleanup);
}).pipe(timeoutOrElse({
	duration: restartTimeout,
	orElse: () => logError("update restart did not start").pipe(andThen(fail(/* @__PURE__ */ new Error("Update restart did not start"))))
}));
//#endregion
export { make };
