import { Bt as decodeUnknownOption, Et as Unknown, Tg as hasProperty, U as NullOr, Ut as decodeUnknownSync, Vt as decodeUnknownPromise, W as Number, X as Record, Xt as fromJsonString, ar as optional, at as String$1, l as Boolean, o as ArraySchema, ot as Struct, yh as toArray } from "./Latch-oSncnOpo.js";
import { nt as memoryLogInterval, tt as debugBuild } from "./index.js";
import { n as make, r as ClientError } from "./promise-DXUpiwYe.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { app, contentTracing, screen, webContents } from "electron";
import path from "node:path";
import { appendFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { getHeapSpaceStatistics, getHeapStatistics, writeHeapSnapshot } from "node:v8";
//#region ../gui-plugins/src/debug/contract.ts
/**
* Captures memory for debugging leaks. Heap snapshots of the main process and every app window can only be taken
* from main, and the desktop server's snapshot is moved next to them, so one folder holds the whole app.
*/
var HeapSnapshots = Ipc.define({
	id: "debug.heap",
	methods: { 
	/**
	* Writes heap snapshots of the desktop's own server, every app window and the main process into a new folder,
	* with a `manifest.json` written last. One capture runs at a time; a call while one runs gets that capture's result. A snapshot
	* that fails is recorded in the manifest and the others are still written.
	*/
write: { output: Struct({
		/** The new folder. */
		directory: String$1,
		/** Whether every snapshot was written. */
		complete: Boolean
	}) } }
});
/**
* Memory diagnostics, offered only in debug builds (the dev server and Beta) and off until turned on: a JSONL memory
* log in the desktop logs, and SIGUSR2 heap snapshots when `OPENCODE_DESKTOP_HEAP_DIRECTORY` names an absolute folder.
* The debug bar's toggle turns them on and remembers it; `OPENCODE_DESKTOP_MEMORY_LOG=<seconds>` turns them on for one
* launch, and the toggle cannot turn that off.
*/
var MemoryDiagnostics = Ipc.define({
	id: "debug.memory",
	state: Struct({
		/** Whether diagnostics are running. */
		on: Boolean,
		/** Whether the environment turned them on. */
		env: Boolean
	}),
	methods: { 
	/** Turns the stored toggle on or off. */
set: { input: Boolean } }
});
//#endregion
//#region ../gui-plugins/src/debug/heap-machine.ts
function createHeapCaptureState() {
	return {
		status: "idle",
		attempt: 0
	};
}
function transitionHeapCapture(state, event) {
	if (state.status === "disposed") {
		if (event.type !== "command.requested") return {
			state,
			effects: []
		};
		return {
			state,
			effects: [settle([event.reply], {
				ok: false,
				error: /* @__PURE__ */ new Error("Heap capture disposed")
			})]
		};
	}
	if (event.type === "disposed") {
		if (state.status === "idle") return {
			state: { status: "disposed" },
			effects: []
		};
		const replies = [state.active, state.pending].flatMap((job) => job?.source === "command" ? job.replies : []);
		return {
			state: { status: "disposed" },
			effects: replies.length ? [settle(replies, {
				ok: false,
				error: /* @__PURE__ */ new Error("Heap capture disposed")
			})] : []
		};
	}
	if (event.type === "command.requested") {
		if (state.status === "idle") return start(state.attempt + 1, {
			source: "command",
			root: event.root,
			includeServer: event.includeServer,
			replies: [event.reply]
		});
		if (state.active.source === "command") return {
			state: {
				...state,
				active: {
					...state.active,
					replies: [...state.active.replies, event.reply]
				}
			},
			effects: []
		};
		return {
			state: {
				...state,
				pending: {
					source: "command",
					root: event.root,
					includeServer: event.includeServer,
					replies: state.pending?.source === "command" ? [...state.pending.replies, event.reply] : [event.reply]
				}
			},
			effects: []
		};
	}
	if (event.type === "signal.received") {
		if (state.status === "idle") return start(state.attempt + 1, {
			source: "signal",
			root: event.root,
			includeServer: event.includeServer
		});
		if (state.active.source === "signal" || state.pending) return {
			state,
			effects: []
		};
		return {
			state: {
				...state,
				pending: {
					source: "signal",
					root: event.root,
					includeServer: event.includeServer
				}
			},
			effects: []
		};
	}
	if (state.status === "idle" || event.attempt !== state.attempt) return {
		state,
		effects: []
	};
	const outcome = event.type === "capture.succeeded" ? {
		ok: true,
		result: event.result
	} : {
		ok: false,
		error: event.error
	};
	const settled = state.active.source === "command" ? [settle(state.active.replies, outcome)] : outcome.ok ? [] : [{
		type: "signal.failed",
		error: outcome.error.message
	}];
	if (!state.pending) return {
		state: {
			status: "idle",
			attempt: state.attempt
		},
		effects: settled
	};
	const next = start(state.attempt + 1, state.pending);
	return {
		state: next.state,
		effects: [...settled, ...next.effects]
	};
}
function start(attempt, job) {
	return {
		state: {
			status: "capturing",
			attempt,
			active: job,
			pending: void 0
		},
		effects: [{
			type: "capture.run",
			attempt,
			root: job.root,
			includeServer: job.includeServer
		}]
	};
}
function settle(replies, outcome) {
	return {
		type: "replies.settle",
		replies,
		outcome
	};
}
//#endregion
//#region ../gui-plugins/src/debug/memory-infra.ts
/** The trace config that makes Chromium dump every process's memory, broken down by allocator. */
var traceConfig = {
	included_categories: ["disabled-by-default-memory-infra"],
	excluded_categories: ["*"],
	memory_dump_config: { triggers: [{
		mode: "detailed",
		periodic_interval_ms: 1e3
	}] }
};
var Size = Struct({ value: String$1 });
var Event = Struct({
	pid: Number,
	ph: String$1,
	id: optional(String$1),
	name: optional(String$1),
	args: optional(Struct({
		name: optional(String$1),
		labels: optional(String$1),
		dumps: optional(Struct({
			process_totals: optional(Struct({
				private_footprint_bytes: optional(String$1),
				resident_set_bytes: optional(String$1)
			})),
			allocators: optional(Record(String$1, Struct({ attrs: optional(Struct({
				size: optional(Size),
				effective_size: optional(Size)
			})) })))
		}))
	}))
});
var decodeTrace = decodeUnknownSync(fromJsonString(Struct({ traceEvents: ArraySchema(Unknown) })));
var decodeEvent = decodeUnknownOption(Event);
/**
* Summarizes a memory-infra trace: for each process, the last detailed dump's totals and allocator sizes.
*
* @param json - The trace file's text, as `contentTracing.stopRecording` wrote it.
* @returns One entry per process that dumped, largest private footprint first.
*/
function summarize(json) {
	const events = decodeTrace(json).traceEvents.flatMap((value) => toArray(decodeEvent(value)));
	const names = new Map(events.flatMap((event) => event.ph === "M" && event.name === "process_name" ? [[event.pid, event.args?.name]] : []));
	const labels = new Map(events.flatMap((event) => event.ph === "M" && event.name === "process_labels" ? [[event.pid, event.args?.labels]] : []));
	const dumps = events.flatMap((event) => event.ph === "v" && event.args?.dumps ? [{
		...event,
		dumps: event.args.dumps
	}] : []);
	const pids = [...new Set(dumps.map((event) => event.pid))];
	const latest = [...new Set(dumps.map((event) => event.id))].findLast((id) => pids.every((pid) => {
		const own = dumps.filter((event) => event.id === id && event.pid === pid);
		return own.some((event) => event.dumps.allocators) && own.some((event) => event.dumps.process_totals);
	})) ?? dumps.findLast((event) => event.dumps.allocators)?.id;
	const current = dumps.filter((event) => event.id === latest);
	return [...new Set(current.map((event) => event.pid))].map((pid) => {
		const own = current.filter((event) => event.pid === pid);
		const sizes = own.flatMap((event) => Object.entries(event.dumps.allocators ?? {}).flatMap(([key, value]) => {
			const size = value.attrs?.effective_size ?? value.attrs?.size;
			return size ? [[key, mib(parseInt(size.value, 16))]] : [];
		}));
		const totals = own.find((event) => event.dumps.process_totals)?.dumps.process_totals;
		return {
			pid,
			name: names.get(pid),
			labels: labels.get(pid),
			totals: {
				privateFootprint: hexMib(totals?.private_footprint_bytes),
				resident: hexMib(totals?.resident_set_bytes)
			},
			allocators: Object.fromEntries(sizes.filter(([key, size]) => !key.includes("/") && size > 0).sort((a, b) => b[1] - a[1])),
			detail: Object.fromEntries(sizes.filter(([key, size]) => key.includes("/") && key.split("/").length <= 3 && size >= 1 && !/^(global|shared_memory)\//.test(key)).sort((a, b) => b[1] - a[1]))
		};
	}).sort((a, b) => (b.totals.privateFootprint ?? 0) - (a.totals.privateFootprint ?? 0));
}
function hexMib(value) {
	return value === void 0 ? void 0 : mib(parseInt(value, 16));
}
function mib(bytes) {
	return Math.round(bytes / 1024 / 1024 * 10) / 10;
}
//#endregion
//#region ../gui-plugins/src/debug/memory-record.ts
var RendererMemory = Struct({
	jsHeap: NullOr(Struct({
		used: Number,
		total: Number,
		limit: Number
	})),
	domElements: Number
});
function memoryRecord(metrics, renderers, preciseJsHeap) {
	return {
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		mainPid: process.pid,
		nativeMemoryUnit: "KiB",
		jsHeapUnit: "bytes",
		preciseJsHeap,
		processes: metrics.map((metric) => ({
			type: metric.type,
			pid: metric.pid,
			workingSetSize: metric.memory.workingSetSize,
			privateBytes: metric.memory.privateBytes ?? null
		})),
		renderers: renderers.map((renderer) => ({
			...renderer,
			nativeMemory: metrics.find((metric) => metric.pid === renderer.pid)?.memory ?? null
		}))
	};
}
//#endregion
//#region ../gui-plugins/src/debug/memory-log.ts
var RENDERER_PROBE_TIMEOUT_MS = 2e3;
var probe = `(() => {
  const memory = performance.memory;
  return {
    jsHeap: memory ? { used: memory.usedJSHeapSize, total: memory.totalJSHeapSize, limit: memory.jsHeapSizeLimit } : null,
    domElements: document.getElementsByTagName('*').length
  };
})()`;
/** A new JSONL file in the desktop logs, which exported debug logs include. */
function memoryLogFile() {
	return path.join(app.getPath("userData"), "logs", `memory-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "")}.jsonl`);
}
/**
* Collects one sample line for `file`, creating its folder, so appending it is the only step left. A renderer whose
* earlier probe has not settled is skipped, and a probe that takes too long is reported without waiting for it.
*/
async function collectMemorySample(file, precise, probes) {
	const metrics = app.getAppMetrics();
	const renderers = await Promise.all(webContents.getAllWebContents().map(async (contents) => {
		const identity = {
			id: contents.id,
			pid: contents.getOSProcessId(),
			type: contents.getType()
		};
		if (probes.pending(contents.id)) return {
			...identity,
			error: "Previous renderer sample is still pending"
		};
		probes.started(contents.id);
		let deadline;
		const reading = contents.executeJavaScript(probe).then(decodeUnknownSync(RendererMemory));
		reading.finally(() => probes.settled(contents.id)).catch(() => void 0);
		return Promise.race([reading, new Promise((_, reject) => {
			deadline = setTimeout(() => reject(/* @__PURE__ */ new Error("Renderer sample timed out")), RENDERER_PROBE_TIMEOUT_MS);
		})]).then((sample) => ({
			...identity,
			sample
		}), (error) => ({
			...identity,
			error: error.message
		})).finally(() => clearTimeout(deadline));
	}));
	await mkdir(path.dirname(file), { recursive: true });
	return `${JSON.stringify(memoryRecord(metrics, renderers, precise))}\n`;
}
//#endregion
//#region ../gui-plugins/src/debug/memory-machine.ts
function createMemoryDiagnosticsState() {
	return {
		status: "off",
		issued: 0,
		probing: /* @__PURE__ */ new Set()
	};
}
function transitionMemoryDiagnostics(state, event) {
	if (state.status === "disposed") return {
		state,
		effects: []
	};
	if (event.type === "disposed") return {
		state: { status: "disposed" },
		effects: state.status === "on" ? stop(state.run) : []
	};
	if (event.type === "probe.started") {
		if (state.probing.has(event.contentsId)) return {
			state,
			effects: []
		};
		return {
			state: {
				...state,
				probing: /* @__PURE__ */ new Set([...state.probing, event.contentsId])
			},
			effects: []
		};
	}
	if (event.type === "probe.settled") {
		if (!state.probing.has(event.contentsId)) return {
			state,
			effects: []
		};
		return {
			state: {
				...state,
				probing: new Set([...state.probing].filter((id) => id !== event.contentsId))
			},
			effects: []
		};
	}
	if (event.type === "synced") {
		if (event.enabled === (state.status === "on")) return {
			state,
			effects: []
		};
		if (state.status === "on") return {
			state: {
				status: "off",
				issued: state.issued,
				probing: state.probing
			},
			effects: stop(state.run)
		};
		const run = state.issued + 1;
		return {
			state: {
				status: "on",
				issued: run,
				run,
				sampling: void 0,
				probing: state.probing
			},
			effects: [{
				type: "log.start",
				run
			}, {
				type: "timer.schedule",
				run
			}]
		};
	}
	if (state.status === "off") return {
		state,
		effects: []
	};
	if (event.type === "tick") {
		if (event.run !== state.run || state.sampling !== void 0) return {
			state,
			effects: []
		};
		const attempt = state.issued + 1;
		return {
			state: {
				...state,
				issued: attempt,
				sampling: attempt
			},
			effects: [{
				type: "sample.collect",
				attempt
			}]
		};
	}
	if (event.attempt !== state.sampling) return {
		state,
		effects: []
	};
	if (event.type === "sample.collected") return {
		state,
		effects: [{
			type: "sample.write",
			attempt: event.attempt,
			line: event.line
		}]
	};
	return {
		state: {
			...state,
			sampling: void 0
		},
		effects: [...event.type === "sample.failed" ? [{
			type: "sample.report",
			error: event.error
		}] : [], {
			type: "timer.schedule",
			run: state.run
		}]
	};
}
/** Whether diagnostics run, as the debug bar shows them. */
function isMemoryDiagnosticsOn(state) {
	return state.status === "on";
}
/** Whether a renderer's earlier probe is still unanswered, so the next sample skips it. */
function isRendererProbing(state, contentsId) {
	return state.status !== "disposed" && state.probing.has(contentsId);
}
function stop(run) {
	return [{ type: "timer.cancel" }, {
		type: "log.stop",
		run
	}];
}
//#endregion
//#region ../gui-plugins/src/debug/server-heap.ts
/**
* Asks the desktop's own server to write a heap snapshot into `directory`. Never rejects: a failure becomes an
* `error` entry.
*
* @param endpoint - The desktop's server, or undefined while it is not running.
* @param directory - An absolute folder on this machine; the server creates it when missing.
* @param signal - Aborts the request; the server still finishes the file it started.
*/
async function captureServer(endpoint, directory, signal) {
	if (!endpoint) return {
		process: "server",
		error: "The server is not running."
	};
	return make({
		baseUrl: endpoint.url,
		headers: endpoint.headers
	}).debug.heapDump({ directory }, { signal }).then((snapshot) => path.join(directory, path.basename(snapshot.path)) === snapshot.path ? {
		process: "server",
		pid: snapshot.pid,
		file: path.basename(snapshot.path),
		memory: snapshot.memory
	} : {
		process: "server",
		pid: snapshot.pid,
		path: snapshot.path,
		memory: snapshot.memory
	}, (error) => ({
		process: "server",
		error: unsupported(error) ? "The server does not support heap dumps. Update and restart it." : error.message || String(error)
	}));
}
function unsupported(error) {
	return error instanceof ClientError && error.reason === "UnexpectedStatus" && hasProperty(error.cause, "status") && error.cause.status === 404;
}
//#endregion
//#region ../gui-plugins/src/debug/signal.ts
/** Where SIGUSR2 writes heap snapshots while memory diagnostics are on: a caller-chosen absolute folder, or none. */
function snapshotDirectory(env) {
	const directory = env.OPENCODE_DESKTOP_HEAP_DIRECTORY;
	return directory && path.isAbsolute(directory) ? directory : void 0;
}
/** Server heap serialization blocks all of its sessions; signal captures require a separate opt-in. */
function signalIncludesServer(env) {
	return env.OPENCODE_DESKTOP_HEAP_INCLUDE_SERVER === "1";
}
//#endregion
//#region ../util/src/process-signal.ts
var handlers = /* @__PURE__ */ new Map();
/** Install once at process startup. Removing subscribers never restores the signal's default action. */
function install(signal, unavailable) {
	if (handlers.has(signal)) return;
	const listeners = /* @__PURE__ */ new Set();
	handlers.set(signal, listeners);
	process.on(signal, () => {
		if (!listeners.size) return unavailable();
		listeners.forEach((listener) => listener());
	});
}
/** Subscribe only to an installed signal. The returned cleanup removes this subscriber, not the process handler. */
function subscribe(signal, listener) {
	const listeners = handlers.get(signal);
	listeners?.add(listener);
	return () => {
		listeners?.delete(listener);
	};
}
//#endregion
//#region ../gui-plugins/src/debug/main.ts
/** How long a step that waits on another process may take before the manifest records it as failed. */
var SNAPSHOT_TIMEOUT_MS = 3e5;
/** What a window's page holds, read from inside it. */
var PageStats = Struct({
	elements: Number,
	images: Struct({
		count: Number,
		decodedMiB: Number
	}),
	canvases: Struct({
		count: Number,
		MiB: Number
	}),
	svgUses: Number,
	devicePixelRatio: Number,
	viewport: Struct({
		width: Number,
		height: Number
	}),
	jsHeap: optional(Struct({
		usedJSHeapSize: Number,
		totalJSHeapSize: Number,
		jsHeapSizeLimit: Number
	}))
});
var decodePageStats = decodeUnknownPromise(PageStats);
var pageStatsScript = `(() => {
  const mib = (bytes) => Math.round(bytes / 1048576 * 10) / 10
  const images = [...document.images]
  const canvases = [...document.querySelectorAll("canvas")]
  const memory = performance.memory
  return {
    elements: document.getElementsByTagName("*").length,
    images: { count: images.length, decodedMiB: mib(images.reduce((t, i) => t + i.naturalWidth * i.naturalHeight * 4, 0)) },
    canvases: { count: canvases.length, MiB: mib(canvases.reduce((t, c) => t + c.width * c.height * 4, 0)) },
    svgUses: document.getElementsByTagName("use").length,
    devicePixelRatio: window.devicePixelRatio,
    viewport: { width: innerWidth, height: innerHeight },
    jsHeap: memory && { usedJSHeapSize: memory.usedJSHeapSize, totalJSHeapSize: memory.totalJSHeapSize, jsHeapSizeLimit: memory.jsHeapSizeLimit },
  }
})()`;
var setup = (ctx) => {
	const capture = async (root, includeServer) => {
		const directory = path.join(root, `opencode-heap-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "")}`);
		await mkdir(directory, {
			recursive: true,
			mode: 448
		});
		ctx.log.write("info", "capturing heap snapshots", {
			directory,
			includeServer
		});
		const before = {
			metrics: app.getAppMetrics(),
			mainMemory: process.memoryUsage(),
			mainHeap: getHeapStatistics(),
			mainHeapSpaces: getHeapSpaceStatistics(),
			system: process.getSystemMemoryInfo()
		};
		const native = await recordNative(directory);
		const windows = ctx.windows.list();
		const pages = await Promise.all(windows.map((window) => describeWindow(window)));
		const [serverSnapshot, windowSnapshots] = await Promise.all([includeServer ? captureServer(ctx.serverEndpoints.get("sidecar"), directory, AbortSignal.any([ctx.signal, AbortSignal.timeout(SNAPSHOT_TIMEOUT_MS)])) : void 0, (async () => {
			const list = [];
			for (const window of windows) list.push(await captureWindow(window, directory));
			return list;
		})()]);
		const main = await Promise.resolve().then(() => writeHeapSnapshot(path.join(directory, `main-${process.pid}.heapsnapshot`))).then((file) => ({
			process: "main",
			pid: process.pid,
			file: path.basename(file)
		}), (error) => ({
			process: "main",
			pid: process.pid,
			error: error.message
		}));
		const snapshots = await Promise.all([
			...serverSnapshot ? [serverSnapshot] : [],
			...windowSnapshots,
			main
		].map(async (snapshot) => {
			if ("error" in snapshot) return snapshot;
			const file = "file" in snapshot ? path.join(directory, snapshot.file) : snapshot.path;
			const bytes = await stat(file).then((info) => info.size, () => null);
			ctx.log.write("info", "heap snapshot written", {
				file,
				bytes
			});
			return {
				...snapshot,
				bytes
			};
		}));
		const gpu = await within(app.getGPUInfo("basic"), 15e3, "The GPU process did not answer within 15 seconds.").catch((error) => ({ error: error.message }));
		await write(directory, "memory.json", {
			unit: "MiB",
			native: "summary" in native ? native.summary : native,
			server: !serverSnapshot || "error" in serverSnapshot || !serverSnapshot.memory ? void 0 : mibs(serverSnapshot.memory),
			pages,
			note: "native: Chromium's memory-infra dump per process, before the heap snapshots. Some allocators overlap: cc, skia, gpu and web_cache report memory that malloc, discardable or shared_memory also count. pages: what each app window's page held. server: the server's process.memoryUsage()."
		});
		await write(directory, "gpu.json", gpu);
		await write(directory, "manifest.json", {
			created: (/* @__PURE__ */ new Date()).toISOString(),
			includeServer,
			app: {
				name: app.getName(),
				version: app.getVersion(),
				packaged: app.isPackaged,
				uptimeSeconds: process.uptime(),
				platform: process.platform,
				arch: process.arch,
				versions: process.versions
			},
			files: {
				"memory.json": "Where the memory is, per process, in MiB. Start here.",
				"memory-infra.json": "Chromium's raw memory dump trace. Open it in https://ui.perfetto.dev.",
				"gpu.json": "The GPU and driver.",
				"*.heapsnapshot": "Heap snapshots. Open them in the Memory panel of Chrome DevTools."
			},
			snapshots,
			metricsMemoryUnit: "KiB",
			before,
			after: {
				metrics: app.getAppMetrics(),
				mainMemory: process.memoryUsage()
			}
		});
		const complete = snapshots.every((snapshot) => !("error" in snapshot)) && !("error" in native);
		ctx.log.write(complete ? "info" : "warn", "heap snapshots captured", {
			directory,
			complete
		});
		return {
			directory,
			complete
		};
	};
	let heapState = createHeapCaptureState();
	const dispatchHeap = (event) => {
		const next = transitionHeapCapture(heapState, event);
		heapState = next.state;
		next.effects.forEach((effect) => void Promise.try(() => runHeap(effect)).catch((cause) => ctx.log.write("error", "heap snapshot queue effect failed", { error: String(cause) })));
	};
	const runHeap = (effect) => {
		if (effect.type === "replies.settle") {
			const outcome = effect.outcome;
			return effect.replies.forEach((reply) => outcome.ok ? reply.resolve(outcome.result) : reply.reject(outcome.error));
		}
		if (effect.type === "signal.failed") return ctx.log.write("error", "heap snapshot capture failed", { error: effect.error });
		Promise.try(() => capture(effect.root, effect.includeServer)).then((result) => dispatchHeap({
			type: "capture.succeeded",
			attempt: effect.attempt,
			result
		}), (cause) => dispatchHeap({
			type: "capture.failed",
			attempt: effect.attempt,
			error: cause instanceof Error ? cause : new Error(String(cause))
		}));
	};
	ctx.onCleanup(() => dispatchHeap({ type: "disposed" }));
	ctx.provide(HeapSnapshots, { write: () => new Promise((resolve, reject) => dispatchHeap({
		type: "command.requested",
		root: app.getPath("downloads"),
		includeServer: true,
		reply: {
			resolve,
			reject
		}
	})) });
	if (!debugBuild(ctx.app)) return;
	const envInterval = memoryLogInterval(process.env.OPENCODE_DESKTOP_MEMORY_LOG);
	const interval = envInterval ?? 3e4;
	const precise = app.commandLine.hasSwitch("enable-precise-memory-info");
	const stored = ctx.storage.store("memory", {
		schema: Boolean,
		initial: false
	});
	const directory = process.platform === "win32" ? void 0 : snapshotDirectory(process.env);
	let memoryState = createMemoryDiagnosticsState();
	let memoryTimer;
	let memoryFile = "";
	let unsubscribeSignal;
	const onSignal = () => {
		if (!directory) return;
		dispatchHeap({
			type: "signal.received",
			root: directory,
			includeServer: signalIncludesServer(process.env)
		});
	};
	const dispatchMemory = (event) => {
		const next = transitionMemoryDiagnostics(memoryState, event);
		memoryState = next.state;
		next.effects.forEach((effect) => void Promise.try(() => runMemory(effect)).catch((cause) => ctx.log.write("error", "memory diagnostics effect failed", { error: String(cause) })));
	};
	const runMemory = (effect) => {
		if (effect.type === "log.start") {
			memoryFile = memoryLogFile();
			ctx.log.write("info", "memory diagnostics started", {
				file: memoryFile,
				intervalMs: interval,
				precise
			});
			if (!directory) return;
			install("SIGUSR2", () => ctx.log.write("warn", "heap snapshot signal ignored: diagnostics are off"));
			unsubscribeSignal = subscribe("SIGUSR2", onSignal);
			ctx.log.write("info", "heap snapshot signal enabled", {
				pid: process.pid,
				signal: "SIGUSR2",
				directory
			});
			return;
		}
		if (effect.type === "log.stop") {
			unsubscribeSignal?.();
			unsubscribeSignal = void 0;
			ctx.log.write("info", "memory diagnostics stopped", { file: memoryFile });
			return;
		}
		if (effect.type === "timer.schedule") {
			memoryTimer = setTimeout(() => dispatchMemory({
				type: "tick",
				run: effect.run
			}), interval);
			return;
		}
		if (effect.type === "timer.cancel") return clearTimeout(memoryTimer);
		if (effect.type === "sample.report") return ctx.log.write("error", "memory diagnostics sample failed", { error: effect.error });
		const failed = (cause) => dispatchMemory({
			type: "sample.failed",
			attempt: effect.attempt,
			error: cause instanceof Error ? cause.message : String(cause)
		});
		if (effect.type === "sample.write") {
			Promise.try(() => appendFile(memoryFile, effect.line, { mode: 384 })).then(() => dispatchMemory({
				type: "sample.written",
				attempt: effect.attempt
			}), failed);
			return;
		}
		Promise.try(() => collectMemorySample(memoryFile, precise, {
			pending: (contentsId) => isRendererProbing(memoryState, contentsId),
			started: (contentsId) => dispatchMemory({
				type: "probe.started",
				contentsId
			}),
			settled: (contentsId) => dispatchMemory({
				type: "probe.settled",
				contentsId
			})
		})).then((line) => dispatchMemory({
			type: "sample.collected",
			attempt: effect.attempt,
			line
		}), failed);
	};
	const sync = () => dispatchMemory({
		type: "synced",
		enabled: envInterval !== void 0 || stored.value
	});
	sync();
	ctx.onCleanup(() => dispatchMemory({ type: "disposed" }));
	const provider = ctx.provide(MemoryDiagnostics, {
		state: () => ({
			on: isMemoryDiagnosticsOn(memoryState),
			env: envInterval !== void 0
		}),
		set: (enabled) => {
			stored.set(enabled);
			sync();
			provider.changed();
		}
	});
};
async function recordNative(directory) {
	const file = path.join(directory, "memory-infra.json");
	return within(contentTracing.startRecording(traceConfig).then(() => new Promise((resolve) => setTimeout(resolve, 2500))).then(() => contentTracing.stopRecording(file)).then(async () => ({
		file: path.basename(file),
		summary: summarize(await readFile(file, "utf8"))
	})), 15e3, "The memory trace did not finish within 15 seconds.").catch((error) => ({ error: error.message }));
}
async function describeWindow(window) {
	const contents = window.webContents;
	const page = await within(contents.executeJavaScript(pageStatsScript).then(decodePageStats), 3e3, "The window did not answer within 3 seconds.").catch((error) => ({ error: error.message }));
	return {
		window: window.id,
		pid: contents.getOSProcessId(),
		title: window.getTitle(),
		contentSize: window.getContentSize(),
		scaleFactor: screen.getDisplayMatching(window.getBounds()).scaleFactor,
		zoomFactor: contents.getZoomFactor(),
		page
	};
}
function captureWindow(window, directory) {
	const contents = window.webContents;
	const pid = contents.getOSProcessId();
	const file = `window-${window.id}-${pid}.heapsnapshot`;
	return within(contents.takeHeapSnapshot(path.join(directory, file)), SNAPSHOT_TIMEOUT_MS, "The window did not write its heap snapshot within 5 minutes.").then(() => ({
		process: "window",
		pid,
		window: window.id,
		file
	}), (error) => ({
		process: "window",
		pid,
		window: window.id,
		error: error.message
	}));
}
/** Rejects with `message` when `promise` takes longer than `ms`. */
function within(promise, ms, message) {
	let deadline;
	return Promise.race([promise, new Promise((_, reject) => {
		deadline = setTimeout(() => reject(new Error(message)), ms);
	})]).finally(() => clearTimeout(deadline));
}
function write(directory, file, value) {
	return writeFile(path.join(directory, file), JSON.stringify(value, null, 2), { mode: 384 });
}
function mibs(bytes) {
	return Object.fromEntries(Object.entries(bytes).map(([key, value]) => [key, Math.round(value / 1048576 * 10) / 10]));
}
//#endregion
export { setup as default };
