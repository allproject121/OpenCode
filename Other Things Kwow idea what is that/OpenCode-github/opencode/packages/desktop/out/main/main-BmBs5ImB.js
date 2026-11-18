import { I as Literals, U as NullOr, Ut as decodeUnknownSync, W as Number$1, ar as optional, at as String$1, l as Boolean, o as ArraySchema, or as optionalKey, ot as Struct } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { app } from "electron";
import { createReadStream, createWriteStream } from "node:fs";
import { homedir, tmpdir, totalmem } from "node:os";
import path from "node:path";
import { once } from "node:events";
import { access, copyFile, mkdir, mkdtemp, readFile, readdir, rename, rm, stat, statfs } from "node:fs/promises";
import { spawn } from "node:child_process";
//#region ../gui-plugins/src/local-models/contract.ts
/** A model the local engine holds. */
var InstalledModel = Struct({
	name: String$1,
	size: Number$1,
	/** Parameter count as the engine reports it, such as "7.6B". */
	params: NullOr(String$1),
	/** Quantization as the engine reports it, such as "Q4_K_M". */
	quant: NullOr(String$1),
	/** A complete copy of this model is in the copy folder. */
	copied: Boolean
});
/**
* One download. `queued` waits for the one before it; `retrying` waits before it asks the engine again, which
* resumes from the bytes already on disk; `paused` waits for the user and keeps those bytes.
*/
var Download = Struct({
	name: String$1,
	phase: Literals([
		"queued",
		"downloading",
		"retrying",
		"paused",
		"finishing",
		"done",
		"failed",
		"cancelled"
	]),
	completed: Number$1,
	total: Number$1,
	/** Bytes per second over the last few seconds. */
	speed: Number$1,
	/** 1 for the first try. */
	attempt: Number$1,
	error: NullOr(String$1)
});
/** Bytes moved by a long copy or by the engine download. */
var Transfer = Struct({
	name: String$1,
	completed: Number$1,
	total: Number$1
});
var LocalModelsState = Struct({
	/**
	* - `checking`: not asked yet.
	* - `missing`: no engine program on this machine.
	* - `stopped`: the program exists and is not running.
	* - `starting`, `running`, `installing`.
	* - `failed`: starting or installing failed; `message` says why.
	*/
	engine: Literals([
		"checking",
		"missing",
		"stopped",
		"starting",
		"running",
		"installing",
		"failed"
	]),
	version: NullOr(String$1),
	message: NullOr(String$1),
	/** Whether this system can install the engine from inside the app. */
	canInstall: Boolean,
	install: NullOr(Transfer),
	modelsDir: String$1,
	freeBytes: NullOr(Number$1),
	ramBytes: Number$1,
	installed: ArraySchema(InstalledModel),
	downloads: ArraySchema(Download),
	copy: Struct({
		/** Copy every finished download to `folder` by itself. */
		auto: Boolean,
		/** Where copies go: the chosen folder, or the Cloud-SSD folder while `cloud` is on. Empty when there is none. */
		folder: String$1,
		/** Cloud-SSD is connected: models are kept on its cloud drive, found by itself on every use. */
		cloud: Boolean,
		/** With `cloud`: a model is taken off this machine once its full copy is on Cloud-SSD. */
		free: Boolean,
		busy: NullOr(Transfer),
		error: NullOr(String$1),
		/** Models that are in the copy folder and not on this machine. */
		restorable: ArraySchema(String$1)
	})
});
/** Offline models: the engine on this machine, its models, downloads, and the second copy. */
var LocalModels = Ipc.define({
	id: "local-models",
	state: LocalModelsState,
	methods: {
		/** Asks the engine again for its version and models. */
		refresh: {},
		/** Starts the engine program when it is installed and not running. */
		start: {},
		/** Downloads the engine into the app's own folder, then starts it. Resumes a partial download. */
		install: {},
		/** Queues a model download; a name already queued or downloading is left alone. */
		pull: { input: String$1 },
		/** Stops a download for now. Its row and the bytes already on disk stay, so Resume continues from them. */
		pause: { input: String$1 },
		/** Continues a paused or failed download from the bytes on disk. */
		resume: { input: String$1 },
		/** Stops a download, removes its row and deletes its unfinished files, so their space comes back. */
		cancel: { input: String$1 },
		/** Removes a finished, failed or cancelled download from the list. */
		dismiss: { input: String$1 },
		/** Deletes a model from this machine. Its copy in the copy folder stays. */
		remove: { input: String$1 },
		/** Saves the copy folder and whether finished downloads are copied by themselves. */
		setCopy: { input: Struct({
			auto: Boolean,
			folder: String$1,
			cloud: Boolean,
			free: Boolean
		}) },
		/**
		* Copies one model, or every model with "*", to the copy folder now. With Cloud-SSD connected and `free` on,
		* each model is then taken off this machine.
		*/
		copyNow: { input: String$1 },
		/** Copies a model from the copy folder back to this machine. */
		restore: { input: String$1 }
	}
});
//#endregion
//#region ../gui-plugins/src/local-models/progress.ts
var emptyProgress = {
	layers: {},
	status: ""
};
/** Adds one stream line. A layer never moves backwards: a retry reports the bytes on disk again from a lower count. */
function foldPull(progress, event) {
	const status = event.status ?? progress.status;
	if (!event.digest || typeof event.total !== "number") return {
		layers: progress.layers,
		status
	};
	const previous = progress.layers[event.digest];
	return {
		status,
		layers: {
			...progress.layers,
			[event.digest]: {
				total: event.total,
				completed: Math.max(previous?.completed ?? 0, Math.min(event.completed ?? 0, event.total))
			}
		}
	};
}
/** The whole model's bytes so far. `total` grows while the engine is still announcing layers. */
function pullTotals(progress) {
	return Object.values(progress.layers).reduce((sum, layer) => ({
		completed: sum.completed + layer.completed,
		total: sum.total + layer.total
	}), {
		completed: 0,
		total: 0
	});
}
/** Splits streamed text into complete lines and the unfinished rest. */
function splitLines(buffer) {
	const parts = buffer.split("\n");
	return {
		lines: parts.slice(0, -1).filter((line) => line.trim() !== ""),
		rest: parts.at(-1) ?? ""
	};
}
var text = (value) => typeof value === "string" ? value : void 0;
var count = (value) => typeof value === "number" ? value : void 0;
/** Reads the fields of a parsed JSON object; undefined for anything else. */
function fields(value) {
	return typeof value === "object" && value !== null ? Object.fromEntries(Object.entries(value)) : void 0;
}
/** Parses one stream line; a line that is not a JSON object is skipped. */
function parsePullLine(line) {
	try {
		const record = fields(JSON.parse(line));
		if (!record) return void 0;
		return {
			status: text(record.status),
			digest: text(record.digest),
			total: count(record.total),
			completed: count(record.completed),
			error: text(record.error)
		};
	} catch {
		return;
	}
}
var defaultHost = "registry.ollama.ai";
/**
* Where the engine keeps a model's manifest, relative to its `manifests` folder: host, namespace, model, tag.
* "qwen2.5:7b" is registry.ollama.ai/library/qwen2.5/7b; "hf.co/user/repo:Q4" is hf.co/user/repo/Q4.
* Undefined for a name that would leave that folder.
*/
function manifestSegments(name) {
	const slash = name.lastIndexOf("/");
	const colon = name.indexOf(":", slash + 1);
	const tag = colon < 0 ? "latest" : name.slice(colon + 1);
	const parts = (colon < 0 ? name : name.slice(0, colon)).split("/");
	const unsafe = (part) => part === "" || part === "." || part === ".." || /[\\/:*?"<>|+]/.test(part);
	if (unsafe(tag) || parts.some(unsafe) || parts.length > 3) return void 0;
	if (parts.length === 1) return [
		defaultHost,
		"library",
		parts[0] ?? "",
		tag
	];
	if (parts.length === 2) return [
		defaultHost,
		parts[0] ?? "",
		parts[1] ?? "",
		tag
	];
	return [
		parts[0] ?? "",
		parts[1] ?? "",
		parts[2] ?? "",
		tag
	];
}
/** The model name for a manifest path, the reverse of `manifestSegments`. */
function modelName(segments) {
	const [host, namespace, model, tag] = segments;
	if (host === defaultHost && namespace === "library") return `${model}:${tag}`;
	if (host === defaultHost) return `${namespace}/${model}:${tag}`;
	return `${host}/${namespace}/${model}:${tag}`;
}
/**
* A model's manifest in the copy folder. That folder is flat (one folder, no tree), because every new folder on a
* cloud drive is a slow remote call: "qwen2.5:7b" is stored as "manifest+registry.ollama.ai+library+qwen2.5+7b.json".
*/
function storedManifestFile(segments) {
	return `manifest+${segments.join("+")}.json`;
}
/** The model name of a copy-folder manifest file; undefined for any other file. */
function storedModelName(file) {
	const segments = /^manifest\+(.+)\.json$/.exec(file)?.[1]?.split("+") ?? [];
	return segments.length === 4 && segments.every((part) => part !== "") ? modelName(segments) : void 0;
}
/** The blob file name of a digest: "sha256:abc…" is stored as "sha256-abc…". Undefined for anything else. */
function blobFile(digest) {
	return /^sha256:[0-9a-f]{64}$/.test(digest) ? digest.replace(":", "-") : void 0;
}
/** The files a manifest needs: its config and every layer. */
function manifestDigests(manifest) {
	const record = fields(manifest);
	if (!record) return [];
	return [record.config, ...Array.isArray(record.layers) ? record.layers : []].flatMap((entry) => {
		const item = fields(entry);
		const digest = text(item?.digest);
		const size = count(item?.size);
		return digest !== void 0 && size !== void 0 ? [{
			digest,
			size
		}] : [];
	});
}
/** Bytes per second between the oldest and newest sample; 0 with fewer than two. */
function speedOf(samples) {
	const first = samples[0];
	const last = samples.at(-1);
	if (!first || !last || last.at <= first.at) return 0;
	return Math.max(0, (last.bytes - first.bytes) * 1e3 / (last.at - first.at));
}
//#endregion
//#region ../gui-plugins/src/local-models/shelf.ts
var sizeOf$1 = (file) => stat(file).then((info) => info.size, () => void 0);
/** Copies one file through `to.part`, reporting each chunk's bytes. A target of the same size is left alone. */
async function copyFile$1(from, to, moved, signal) {
	const size = await sizeOf$1(from);
	if (size === void 0) throw new Error(`Missing file: ${from}`);
	if (await sizeOf$1(to) === size) return moved(size);
	await mkdir(path.dirname(to), { recursive: true });
	const output = createWriteStream(`${to}.part`);
	try {
		for await (const chunk of createReadStream(from, {
			signal,
			highWaterMark: 4194304
		})) {
			if (!output.write(chunk)) await once(output, "drain");
			moved(chunk.byteLength);
		}
	} finally {
		output.end();
		await once(output, "close");
	}
	await rename(`${to}.part`, to);
}
/** Moves a file; across disks, where a rename cannot, by copying it and deleting the source. */
async function moveFile(from, to) {
	await rename(from, to).catch(async (error) => {
		if (!(error instanceof Error && "code" in error && error.code === "EXDEV")) throw error;
		await copyFile(from, to);
		await rm(from, { force: true });
	});
}
/** A plain folder: a disk, a USB stick, or any folder the user picked. */
function folderShelf(folder) {
	return {
		label: folder,
		list: async () => {
			const names = await readdir(folder).catch(() => []);
			const sizes = await Promise.all(names.map((name) => sizeOf$1(path.join(folder, name))));
			return names.flatMap((name, index) => {
				const size = sizes[index];
				return size === void 0 || name.endsWith(".part") ? [] : [{
					name,
					size
				}];
			});
		},
		put: (from, name, moved, signal) => copyFile$1(from, path.join(folder, name), moved, signal),
		get: (name, to, moved, signal) => copyFile$1(path.join(folder, name), to, moved, signal)
	};
}
/** Reads the Cloud-SSD app's link file. Only a loopback address is accepted, so the key never leaves this machine. */
function parseLink(text) {
	try {
		const value = JSON.parse(text.replace(/^﻿/, ""));
		if (typeof value !== "object" || value === null) return void 0;
		const url = Reflect.get(value, "url");
		const key = Reflect.get(value, "key");
		const pid = Reflect.get(value, "pid");
		if (typeof url !== "string" || typeof key !== "string" || key === "" || typeof pid !== "number") return void 0;
		const address = new URL(url);
		if (address.protocol !== "http:" || address.hostname !== "127.0.0.1") return void 0;
		return {
			url: address.origin,
			key,
			pid
		};
	} catch {
		return;
	}
}
/** The Cloud-SSD app's link file. */
var linkFile = () => path.join(process.env.LOCALAPPDATA ?? "", "Cloud-SSD", "app-link.json");
var readLink = async () => parseLink(await readFile(linkFile(), "utf8").catch(() => ""));
var errorOf = async (response) => {
	const body = await response.json().catch(() => void 0);
	const error = typeof body === "object" && body !== null ? Reflect.get(body, "error") : void 0;
	return typeof error === "string" && error !== "" ? error : `Cloud-SSD answered HTTP ${response.status}`;
};
/**
* Calls the Cloud-SSD app. The key changes at every start of that app, so a refused key reads the link file once
* more and tries again.
*/
async function call(route, init = {}) {
	for (const attempt of [1, 2]) {
		const link = await readLink();
		if (!link) throw new Error("Cloud-SSD is not running. Open the Cloud-SSD app, then try again.");
		const response = await fetch(`${link.url}${route}`, {
			method: init.method ?? "GET",
			headers: {
				authorization: `Bearer ${link.key}`,
				"x-app": "OpenCode"
			},
			signal: AbortSignal.any([AbortSignal.timeout(3e4), ...init.signal ? [init.signal] : []])
		}).catch((error) => {
			if (init.signal?.aborted) throw error;
			throw new Error("Cloud-SSD is not answering. Open the Cloud-SSD app, then try again.");
		});
		if (response.status === 401 && attempt === 1) continue;
		if (!response.ok) throw new Error(await errorOf(response));
		return response.json();
	}
	throw new Error("Cloud-SSD refused the key.");
}
var field = (value, key) => typeof value === "object" && value !== null ? Reflect.get(value, key) : void 0;
/** Waits for a Cloud-SSD job, reporting the bytes it moved since the last look. */
async function follow(job, moved, signal) {
	const seen = { bytes: 0 };
	while (!signal.aborted) {
		const state = await call(`/api/link/job?id=${encodeURIComponent(job)}`, { signal });
		const bytes = Number(field(state, "bytes") ?? 0);
		if (bytes > seen.bytes) moved(bytes - seen.bytes);
		seen.bytes = Math.max(seen.bytes, bytes);
		if (field(state, "done") === true) {
			if (field(state, "ok") === true) return;
			const error = field(state, "error");
			throw new Error(typeof error === "string" && error !== "" ? error : "Cloud-SSD could not finish the transfer.");
		}
		await new Promise((resolve) => setTimeout(resolve, 1e3));
	}
	throw new Error("Stopped.");
}
/** Whether the Cloud-SSD app answers now. */
async function linkReady() {
	return call("/api/link/info").then(() => true, () => false);
}
/**
* The cloud reached through the Cloud-SSD app. Files go straight to the cloud and come straight back; nothing is
* written through the cloud drive's letter, so no second copy is left in its cache on this machine.
*/
function linkShelf(folder) {
	const query = (input) => new URLSearchParams(input).toString();
	return {
		label: `Cloud-SSD › ${folder}`,
		list: async () => {
			const items = field(await call(`/api/link/list?${query({ dir: folder })}`), "items");
			return (Array.isArray(items) ? items : []).flatMap((item) => {
				const name = field(item, "name");
				const size = field(item, "size");
				return typeof name === "string" && typeof size === "number" && field(item, "isDir") !== true ? [{
					name,
					size
				}] : [];
			});
		},
		put: async (from, name, moved, signal) => {
			const temp = path.basename(from) === name ? void 0 : await mkdtemp(path.join(tmpdir(), "apna-shelf-"));
			const source = temp ? path.join(temp, name) : from;
			try {
				if (temp) await copyFile(from, source);
				const started = await call(`/api/link/store?${query({
					path: source,
					to: folder,
					move: temp ? "1" : "0"
				})}`, {
					method: "POST",
					signal
				});
				await follow(String(field(started, "job")), moved, signal);
			} finally {
				if (temp) await rm(temp, {
					recursive: true,
					force: true
				});
			}
		},
		get: async (name, to, moved, signal) => {
			const temp = await mkdtemp(path.join(tmpdir(), "apna-fetch-"));
			try {
				const started = await call(`/api/link/fetch?${query({
					from: `${folder}/${name}`,
					to: temp
				})}`, {
					method: "POST",
					signal
				});
				await follow(String(field(started, "job")), moved, signal);
				await mkdir(path.dirname(to), { recursive: true });
				await moveFile(path.join(temp, name), to);
			} finally {
				await rm(temp, {
					recursive: true,
					force: true
				});
			}
		},
		settle: async () => {
			await call(`/api/link/free?${query({ dir: folder })}`, { method: "POST" });
		}
	};
}
//#endregion
//#region ../gui-plugins/src/local-models/engine.ts
/** The engine's local address. The app only ever talks to this machine. */
var engineUrl = "http://127.0.0.1:11434";
/** The engine's release for 64-bit Windows: the program without an installer, made to run inside another app. */
var engineDownloadUrl = "https://github.com/ollama/ollama/releases/latest/download/ollama-windows-amd64.zip";
var programName = process.platform === "win32" ? "ollama.exe" : "ollama";
var exists = (file) => access(file).then(() => true, () => false);
var sizeOf = (file) => stat(file).then((info) => info.size, () => void 0);
/** Calls the engine. Rejects on a network failure, at the timeout, or when `signal` aborts. */
function engineFetch(route, init) {
	const signals = [init.signal, init.timeoutMs ? AbortSignal.timeout(init.timeoutMs) : void 0].filter((signal) => signal !== void 0);
	return fetch(`${engineUrl}${route}`, {
		method: init.method ?? "GET",
		headers: init.body === void 0 ? void 0 : { "content-type": "application/json" },
		body: init.body === void 0 ? void 0 : JSON.stringify(init.body),
		signal: signals.length > 0 ? AbortSignal.any(signals) : void 0
	});
}
/** The running engine's version; undefined while nothing answers. */
async function engineVersion() {
	try {
		const response = await engineFetch("/api/version", { timeoutMs: 2500 });
		const body = await response.json();
		return response.ok && typeof body === "object" && body !== null && "version" in body && typeof body.version === "string" ? body.version : void 0;
	} catch {
		return;
	}
}
/** Where the engine keeps its models: `OLLAMA_MODELS`, else `.ollama/models` in the home folder. */
function modelsDirectory() {
	return process.env.OLLAMA_MODELS || path.join(homedir(), ".ollama", "models");
}
/** Free bytes on the drive that holds `directory`; undefined when it cannot be read. */
function freeBytes(directory) {
	return statfs(directory).then((info) => info.bavail * info.bsize, () => void 0);
}
/**
* The engine program on this machine: the app's own copy first, then the usual install folder, then `PATH`.
* Undefined when there is none.
*/
async function findProgram(privateDirectory) {
	const candidates = [
		path.join(privateDirectory, programName),
		...process.env.LOCALAPPDATA ? [path.join(process.env.LOCALAPPDATA, "Programs", "Ollama", programName)] : [],
		...(process.env.PATH ?? "").split(path.delimiter).filter((directory) => directory !== "").map((directory) => path.join(directory, programName))
	];
	for (const candidate of candidates) if (await exists(candidate)) return candidate;
}
/**
* Starts the engine in the background, listening on this machine only. It keeps running after the app closes, so
* the terminal and other tools can use the same models.
*/
function startProgram(program) {
	const child = spawn(program, ["serve"], {
		detached: true,
		stdio: "ignore",
		windowsHide: true,
		env: {
			...process.env,
			OLLAMA_HOST: "127.0.0.1:11434"
		}
	});
	child.on("error", () => void 0);
	child.unref();
}
/**
* Downloads `url` to `file` through `file.part`, continuing a partial file from where it stopped. `progress` gets
* the bytes on disk and the full size (0 while unknown).
*/
async function downloadFile(url, file, progress, signal) {
	const partial = `${file}.part`;
	await mkdir(path.dirname(file), { recursive: true });
	const have = await sizeOf(partial) ?? 0;
	const response = await fetch(url, {
		signal,
		headers: have > 0 ? { range: `bytes=${have}-` } : void 0
	});
	if (response.status === 416) return rename(partial, file);
	if (!response.ok || !response.body) throw new Error(`Download failed: HTTP ${response.status}`);
	const resumed = response.status === 206;
	const offset = resumed ? have : 0;
	const total = offset + Number(response.headers.get("content-length") ?? 0);
	const output = createWriteStream(partial, { flags: resumed ? "a" : "w" });
	const counted = { bytes: offset };
	try {
		for await (const chunk of response.body) {
			if (!output.write(chunk)) await once(output, "drain");
			counted.bytes += chunk.byteLength;
			progress(counted.bytes, total);
		}
	} finally {
		output.end();
		await once(output, "close");
	}
	if (total > 0 && counted.bytes < total) throw new Error("Download stopped early");
	await rename(partial, file);
}
/** Unpacks a zip into `directory` with the system's `tar`, which reads zip files on Windows 10 and later. */
async function unpack(archive, directory) {
	const child = spawn("tar", [
		"-xf",
		archive,
		"-C",
		directory
	], {
		stdio: "ignore",
		windowsHide: true
	});
	const [code] = await once(child, "exit");
	if (code !== 0) throw new Error(`Unpacking failed with code ${String(code)}`);
}
/** The blob files a manifest's text names; undefined when it is not a usable manifest. */
function manifestBlobs(content) {
	if (content === void 0) return void 0;
	try {
		return manifestDigests(JSON.parse(content)).flatMap((item) => {
			const file = blobFile(item.digest);
			return file ? [{
				file,
				size: item.size
			}] : [];
		});
	} catch {
		return;
	}
}
var readText = (file) => readFile(file, "utf8").catch(() => void 0);
/**
* Whether the shelf holds this installed model in full: its manifest and every blob at full size. The blob list
* comes from the engine's own manifest, so only the shelf's file list is read.
*/
async function hasStored(name, models, shelf) {
	const segments = manifestSegments(name);
	if (!segments) return false;
	const blobs = manifestBlobs(await readText(path.join(models, "manifests", ...segments)));
	if (!blobs || blobs.length === 0) return false;
	const there = new Map((await shelf.list()).map((file) => [file.name, file.size]));
	return there.has(storedManifestFile(segments)) && blobs.every((blob) => there.get(blob.file) === blob.size);
}
/** Counts the bytes of a model's blobs as they move, for one progress line. */
var counter = (blobs, progress) => {
	const total = blobs.reduce((sum, blob) => sum + blob.size, 0);
	const counted = { bytes: 0 };
	return (bytes) => {
		counted.bytes += bytes;
		progress(counted.bytes, total);
	};
};
/**
* Puts an installed model on the shelf, one file at a time: its blobs, then its manifest last, so a copy that stops
* half way never looks complete. Blobs already there at full size are skipped, so pressing copy again continues.
*/
async function storeModel(name, models, shelf, progress, signal) {
	const segments = manifestSegments(name);
	const manifest = segments ? path.join(models, "manifests", ...segments) : void 0;
	const blobs = manifest ? manifestBlobs(await readText(manifest)) : void 0;
	if (!segments || !manifest || !blobs) throw new Error(`Model files not found: ${name}`);
	const there = new Map((await shelf.list()).map((file) => [file.name, file.size]));
	const moved = counter(blobs, progress);
	for (const blob of blobs) if (there.get(blob.file) === blob.size) moved(blob.size);
	else await shelf.put(path.join(models, "blobs", blob.file), blob.file, moved, signal);
	await shelf.put(manifest, storedManifestFile(segments), () => void 0, signal);
}
/** Brings a model from the shelf back into the engine's models folder. Blobs already here are kept as they are. */
async function restoreModel(name, models, shelf, progress, signal) {
	const segments = manifestSegments(name);
	if (!segments) throw new Error(`Copy not found: ${name}`);
	const temp = await mkdtemp(path.join(tmpdir(), "apna-manifest-"));
	const staged = path.join(temp, "manifest");
	try {
		await shelf.get(storedManifestFile(segments), staged, () => void 0, signal);
		const blobs = manifestBlobs(await readText(staged));
		if (!blobs) throw new Error(`Copy not found: ${name}`);
		const moved = counter(blobs, progress);
		for (const blob of blobs) {
			const target = path.join(models, "blobs", blob.file);
			if (await sizeOf(target) === blob.size) moved(blob.size);
			else await shelf.get(blob.file, target, moved, signal);
		}
		await mkdir(path.dirname(path.join(models, "manifests", ...segments)), { recursive: true });
		await copyFile$1(staged, path.join(models, "manifests", ...segments), () => void 0, signal);
	} finally {
		await rm(temp, {
			recursive: true,
			force: true
		});
	}
}
/** The names of the models the shelf holds a manifest for. */
async function listStored(shelf) {
	return (await shelf.list()).flatMap((file) => storedModelName(file.name) ?? []);
}
/**
* Deletes the unfinished files of the given layers from a models folder. The engine keeps a layer it is still
* downloading as "sha256-<hash>-partial" plus numbered parts beside it; finished layers are never touched.
*/
async function removePartials(models, digests) {
	const folder = path.join(models, "blobs");
	const prefixes = digests.flatMap((digest) => {
		const file = blobFile(digest);
		return file ? [`${file}-partial`] : [];
	});
	if (prefixes.length === 0) return;
	const files = await readdir(folder).catch(() => []);
	await Promise.all(files.filter((file) => prefixes.some((prefix) => file.startsWith(prefix))).map((file) => rm(path.join(folder, file), { force: true }).catch(() => void 0)));
}
/** Deletes a file, ignoring one that is not there. */
function removeFile(file) {
	return rm(file, { force: true });
}
//#endregion
//#region ../gui-plugins/src/local-models/main.ts
/** The folder in the user's cloud that holds the models while Cloud-SSD is connected. */
var cloudModelsFolder = "Ollama-Models";
var CopySettings = Struct({
	auto: Boolean,
	folder: String$1,
	cloud: optionalKey(Boolean),
	free: optionalKey(Boolean)
});
/** A slow link stalls single parts of a download; asking again resumes, so a pull is retried this many times. */
var pullAttempts = 12;
/** No bytes and no status for this long counts as stalled. */
var stallMs = 12e4;
var publishMs = 250;
var sleep = (ms, signal) => new Promise((resolve) => {
	const timer = setTimeout(resolve, ms);
	signal.addEventListener("abort", () => {
		clearTimeout(timer);
		resolve();
	}, { once: true });
});
var messageOf = (error) => error instanceof Error ? error.message : String(error);
/** Errors the engine reports for a model that will never download, so a retry would only repeat them. */
var permanent = (message) => /not found|does not exist|unauthorized|invalid model|manifest unknown/i.test(message);
var Tags = Struct({ models: ArraySchema(Struct({
	name: String$1,
	size: Number$1,
	details: Struct({
		parameter_size: String$1.pipe(optional),
		quantization_level: String$1.pipe(optional)
	}).pipe(optional)
})) });
var setup = (ctx) => {
	const log = ctx.log;
	const signal = ctx.signal;
	const settings = ctx.storage.store("copy", {
		schema: CopySettings,
		initial: {
			auto: false,
			folder: ""
		}
	});
	const privateDirectory = path.join(app.getPath("userData"), "engine");
	const canInstall = process.platform === "win32" && process.arch === "x64";
	const current = {
		engine: "checking",
		version: null,
		message: null,
		install: null,
		freeBytes: null,
		models: [],
		jobs: [],
		pulling: false,
		copied: /* @__PURE__ */ new Set(),
		restorable: [],
		copyBusy: null,
		copyError: null,
		copyQueue: [],
		copying: false,
		folder: ""
	};
	const state = () => ({
		engine: current.engine,
		version: current.version,
		message: current.message,
		canInstall,
		install: current.install,
		modelsDir: modelsDirectory(),
		freeBytes: current.freeBytes,
		ramBytes: totalmem(),
		installed: current.models.map((model) => ({
			...model,
			copied: current.copied.has(model.name)
		})),
		downloads: current.jobs.map((job) => ({
			name: job.name,
			phase: job.phase,
			completed: job.completed,
			total: job.total,
			speed: job.phase === "downloading" ? speedOf(job.samples) : 0,
			attempt: job.attempt,
			error: job.error
		})),
		copy: {
			auto: settings.value.auto,
			folder: current.folder,
			cloud: settings.value.cloud ?? false,
			free: settings.value.free ?? false,
			busy: current.copyBusy,
			error: current.copyError,
			restorable: current.restorable
		}
	});
	const provider = ctx.provide(LocalModels, {
		state,
		refresh: () => refresh(),
		start: () => start(),
		install: () => install(),
		pull: (name) => pull(name),
		pause: (name) => pause(name),
		resume: (name) => resume(name),
		cancel: (name) => cancel(name),
		dismiss: (name) => {
			current.jobs = current.jobs.filter((job) => job.name !== name || ![
				"done",
				"failed",
				"cancelled"
			].includes(job.phase));
			provider.changed();
		},
		remove: (name) => remove(name),
		setCopy: (next) => {
			const connecting = next.cloud && !settings.value.cloud;
			settings.set({
				auto: next.auto,
				folder: next.folder.trim(),
				cloud: next.cloud,
				free: next.free
			});
			current.copyError = null;
			provider.changed();
			scanCopies();
			if (connecting) settle();
		},
		copyNow: (name) => {
			(name === "*" ? current.models.map((model) => model.name) : [name]).forEach((item) => {
				if (!current.copied.has(item)) return queueCopy(item, false);
				if (freeing()) resolveShelf().then((shelf) => shelf ? freeLocal(item, shelf) : void 0).catch(() => void 0);
			});
		},
		restore: (name) => queueCopy(name, true)
	});
	const publish = () => {
		if (current.publishTimer) return;
		current.publishTimer = setTimeout(() => {
			current.publishTimer = void 0;
			provider.changed();
		}, publishMs);
	};
	const readModels = async () => {
		const response = await engineFetch("/api/tags", {
			timeoutMs: 1e4,
			signal
		});
		return decodeUnknownSync(Tags)(await response.json()).models.map((model) => ({
			name: model.name,
			size: model.size,
			params: model.details?.parameter_size || null,
			quant: model.details?.quantization_level || null
		})).toSorted((a, b) => a.name.localeCompare(b.name));
	};
	const resolveShelf = async () => {
		const shelf = settings.value.cloud ? await linkReady() ? linkShelf(cloudModelsFolder) : void 0 : settings.value.folder === "" ? void 0 : folderShelf(settings.value.folder);
		current.folder = shelf?.label ?? "";
		return shelf;
	};
	const settle = async () => {
		await (await resolveShelf())?.settle?.().catch((error) => log.write("warn", "local models: Cloud-SSD could not free its cache", { error: messageOf(error) }));
	};
	const freeing = () => !!settings.value.cloud && !!settings.value.free;
	const freeLocal = async (name, shelf) => {
		if (!await hasStored(name, modelsDirectory(), shelf)) return;
		const response = await engineFetch("/api/ps", {
			timeoutMs: 1e4,
			signal
		});
		if (decodeUnknownSync(Tags)(await response.json()).models.some((model) => model.name === name)) return;
		await remove(name);
	};
	const scanCopies = async () => {
		const shelf = await resolveShelf();
		const label = current.folder;
		if (!shelf) {
			current.copied = /* @__PURE__ */ new Set();
			current.restorable = [];
			return provider.changed();
		}
		const installed = current.models.map((model) => model.name);
		const copied = /* @__PURE__ */ new Set();
		const read = await (async () => {
			for (const name of installed) if (await hasStored(name, modelsDirectory(), shelf)) copied.add(name);
			return listStored(shelf);
		})().catch((error) => {
			log.write("warn", "local models: could not read the copies", { error: messageOf(error) });
		});
		if (signal.aborted || label !== current.folder || read === void 0) return;
		const stored = read;
		current.copied = copied;
		current.restorable = stored.filter((name) => !installed.includes(name)).toSorted();
		provider.changed();
	};
	const refresh = async () => {
		const version = await engineVersion();
		if (signal.aborted) return;
		current.freeBytes = await freeBytes(modelsDirectory()) ?? null;
		if (version === void 0) {
			current.version = null;
			current.models = [];
			if (current.engine !== "starting" && current.engine !== "installing" && current.engine !== "failed") current.engine = await findProgram(privateDirectory) ? "stopped" : "missing";
			return provider.changed();
		}
		current.version = version;
		current.engine = "running";
		current.message = null;
		current.models = await readModels().catch((error) => {
			log.write("warn", "local models: listing failed", { error: messageOf(error) });
			return current.models;
		});
		provider.changed();
		scanCopies();
	};
	const start = async () => {
		if (current.engine === "running" || current.engine === "starting" || current.engine === "installing") return;
		const program = await findProgram(privateDirectory);
		if (!program) {
			current.engine = "missing";
			return provider.changed();
		}
		current.engine = "starting";
		current.message = null;
		provider.changed();
		startProgram(program);
		for (const _ of Array.from({ length: 30 })) {
			await sleep(1e3, signal);
			if (signal.aborted) return;
			if (await engineVersion() !== void 0) return refresh();
		}
		current.engine = "failed";
		current.message = "The engine did not answer after it was started.";
		provider.changed();
	};
	const install = async () => {
		if (!canInstall || current.engine === "installing" || current.engine === "running") return;
		const archive = path.join(privateDirectory, "engine.zip");
		current.engine = "installing";
		current.message = null;
		current.install = {
			name: "engine",
			completed: 0,
			total: 0
		};
		provider.changed();
		try {
			for (const attempt of Array.from({ length: pullAttempts }, (_, index) => index + 1)) {
				const failure = await downloadFile(engineDownloadUrl, archive, (completed, total) => {
					current.install = {
						name: "engine",
						completed,
						total
					};
					publish();
				}, signal).then(() => void 0, (error) => error);
				if (failure === void 0) break;
				if (signal.aborted) return;
				if (attempt === pullAttempts) throw failure;
				await sleep(Math.min(3e4, attempt * 3e3), signal);
			}
			await unpack(archive, privateDirectory);
			await removeFile(archive);
			current.install = null;
			current.engine = "stopped";
			await start();
		} catch (error) {
			if (signal.aborted) return;
			log.write("error", "local models: engine install failed", { error: messageOf(error) });
			current.install = null;
			current.engine = "failed";
			current.message = messageOf(error);
			provider.changed();
		}
	};
	const pull = (input) => {
		const name = input.trim();
		if (name === "" || !manifestSegments(name)) throw new Error("That is not a model name.");
		const active = current.jobs.find((job) => job.name === name);
		if (active && working(active)) return;
		if (active && (active.phase === "paused" || active.phase === "failed")) return resume(name);
		current.jobs = [...current.jobs.filter((job) => job.name !== name), {
			name,
			phase: "queued",
			completed: 0,
			total: 0,
			attempt: 0,
			error: null,
			samples: [],
			progress: emptyProgress
		}];
		provider.changed();
		drainPulls();
	};
	const working = (job) => [
		"queued",
		"downloading",
		"retrying",
		"finishing"
	].includes(job.phase);
	const pause = (name) => {
		const job = current.jobs.find((item) => item.name === name);
		if (!job || !working(job)) return;
		job.phase = "paused";
		job.samples = [];
		job.controller?.abort();
		provider.changed();
	};
	const resume = (name) => {
		const job = current.jobs.find((item) => item.name === name);
		if (!job || working(job) || job.phase === "done") return;
		job.phase = "queued";
		job.error = null;
		provider.changed();
		drainPulls();
	};
	const cancel = (name) => {
		const job = current.jobs.find((item) => item.name === name);
		if (!job || job.phase === "done") return;
		const unfinished = Object.entries(job.progress.layers).flatMap(([digest, layer]) => layer.completed < layer.total ? [digest] : []);
		job.phase = "cancelled";
		job.controller?.abort();
		current.jobs = current.jobs.filter((item) => item !== job);
		provider.changed();
		sleep(1500, signal).then(() => removePartials(modelsDirectory(), unfinished)).then(() => refresh());
	};
	const drainPulls = async () => {
		if (current.pulling) return;
		current.pulling = true;
		try {
			while (!signal.aborted) {
				const job = current.jobs.find((item) => item.phase === "queued");
				if (!job) return;
				await runPull(job);
			}
		} finally {
			current.pulling = false;
		}
	};
	const runPull = async (job) => {
		if (current.engine !== "running") await start();
		const stopped = () => job.phase === "cancelled" || job.phase === "paused" || signal.aborted;
		for (const attempt of Array.from({ length: pullAttempts }, (_, index) => index + 1)) {
			if (stopped()) return;
			job.attempt = attempt;
			job.phase = "downloading";
			job.error = null;
			provider.changed();
			const failure = await pullOnce(job).then(() => void 0, (error) => messageOf(error));
			if (stopped()) return;
			if (failure === void 0) {
				job.phase = "done";
				job.completed = job.total;
				provider.changed();
				await refresh();
				if (settings.value.cloud || settings.value.auto && settings.value.folder !== "") queueCopy(job.name, false);
				return;
			}
			log.write("warn", "local models: pull attempt failed", {
				model: job.name,
				attempt,
				error: failure
			});
			job.error = failure;
			if (permanent(failure) || attempt === pullAttempts) {
				job.phase = "failed";
				return provider.changed();
			}
			job.phase = "retrying";
			provider.changed();
			job.controller = new AbortController();
			await sleep(Math.min(3e4, attempt * 3e3), AbortSignal.any([signal, job.controller.signal]));
		}
	};
	const pullOnce = async (job) => {
		const controller = new AbortController();
		const watch = { stalled: false };
		const touch = () => {
			clearTimeout(watch.timer);
			watch.timer = setTimeout(() => {
				watch.stalled = true;
				controller.abort();
			}, stallMs);
		};
		job.controller = controller;
		touch();
		try {
			const response = await engineFetch("/api/pull", {
				method: "POST",
				body: {
					model: job.name,
					stream: true
				},
				signal: AbortSignal.any([signal, controller.signal])
			});
			if (!response.ok || !response.body) throw new Error(await response.text() || `HTTP ${response.status}`);
			const decoder = new TextDecoder();
			const pending = {
				text: "",
				success: false
			};
			for await (const chunk of response.body) {
				touch();
				const split = splitLines(pending.text + decoder.decode(chunk, { stream: true }));
				pending.text = split.rest;
				for (const line of split.lines) {
					const event = parsePullLine(line);
					if (!event) continue;
					if (event.error) throw new Error(event.error);
					if (event.status === "success") pending.success = true;
					job.progress = foldPull(job.progress, event);
				}
				const totals = pullTotals(job.progress);
				job.completed = totals.completed;
				job.total = totals.total;
				if (job.phase === "downloading" || job.phase === "finishing") job.phase = totals.total > 0 && totals.completed >= totals.total ? "finishing" : "downloading";
				job.samples = [...job.samples.filter((sample) => Date.now() - sample.at < 8e3), {
					at: Date.now(),
					bytes: totals.completed
				}];
				publish();
			}
			if (!pending.success) throw new Error("The download stopped before it finished.");
		} catch (error) {
			throw watch.stalled ? /* @__PURE__ */ new Error("No data for two minutes; trying again.") : error;
		} finally {
			clearTimeout(watch.timer);
		}
	};
	const remove = async (name) => {
		const response = await engineFetch("/api/delete", {
			method: "DELETE",
			body: { model: name },
			timeoutMs: 3e4,
			signal
		});
		if (!response.ok) throw new Error(await response.text() || `HTTP ${response.status}`);
		await refresh();
	};
	const queueCopy = (name, restore) => {
		if (!settings.value.cloud && settings.value.folder === "") return;
		if (current.copyQueue.some((item) => item.name === name && item.restore === restore)) return;
		current.copyQueue = [...current.copyQueue, {
			name,
			restore,
			free: !restore && freeing()
		}];
		drainCopies();
	};
	const drainCopies = async () => {
		if (current.copying) return;
		current.copying = true;
		try {
			while (!signal.aborted) {
				if (current.copyQueue.length === 0) return;
				const shelf = await resolveShelf();
				const local = modelsDirectory();
				const [next, ...rest] = current.copyQueue;
				if (!next) return;
				if (!shelf) {
					current.copyQueue = [];
					current.copyError = settings.value.cloud ? "Cloud-SSD is not running. Open the Cloud-SSD app, then try again." : "No copy folder is chosen.";
					return provider.changed();
				}
				current.copyQueue = rest;
				current.copyBusy = {
					name: next.name,
					completed: 0,
					total: 0
				};
				current.copyError = null;
				provider.changed();
				const failure = await (next.restore ? restoreModel : storeModel)(next.name, local, shelf, (completed, total) => {
					current.copyBusy = {
						name: next.name,
						completed,
						total
					};
					publish();
				}, signal).then(() => void 0, (error) => messageOf(error));
				if (signal.aborted) return;
				current.copyBusy = null;
				if (failure !== void 0) {
					log.write("error", "local models: copy failed", {
						model: next.name,
						restore: next.restore,
						error: failure
					});
					current.copyError = `${next.name}: ${failure}`;
				}
				if (failure === void 0 && next.free) await freeLocal(next.name, shelf).catch((error) => log.write("warn", "local models: could not free the local copy", {
					model: next.name,
					error: messageOf(error)
				}));
				await refresh();
			}
		} finally {
			current.copying = false;
		}
	};
	ctx.onCleanup(() => {
		clearTimeout(current.publishTimer);
		current.jobs.forEach((job) => job.controller?.abort());
	});
	refresh().then(() => current.engine === "stopped" ? start() : void 0);
};
//#endregion
export { setup as default };
