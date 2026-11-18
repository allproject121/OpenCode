import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.js";
import { Bn as isSchema, Bt as decodeUnknownOption, Et as Unknown, Gt as encodeSync, I as Literals, It as decodeSync, Jt as encodeUnknownExit, Lg as isString, Nt as declare, Qt as is, Tg as hasProperty, Ud as pretty, Vt as decodeUnknownPromise, W as Number, X as Record, Xt as fromJsonString, Yt as encodeUnknownPromise, ar as optional, at as String$1, ch as getOrElse, dd as isFailure, fd as isSuccess, gh as none, kg as isFunction, l as Boolean, lr as toCodecJson, o as ArraySchema, or as optionalKey, ot as Struct, ph as isSome, uh as getOrUndefined, zt as decodeUnknownExit } from "./Latch-oSncnOpo.js";
import { f as orElse, m as when, p as value } from "./dist-DWveHAM-.js";
import { G as readEnableState, M as getStore, d as onChange, et as VERSION, l as authorization, u as get } from "./index.js";
import { S as PluginsChanged, _ as PluginAvailable, a as getLastFocusedWindow, b as PluginMenubarItemsChanged, c as isQuitting, d as formatNativeTemplate, f as nativeLocale, g as emitIpcEvent, h as onNativeTranslations, i as PluginError, l as keptScope, m as nativePluralCategory, n as refreshMenu, o as getMainWindows, p as nativeMessage, r as setMenubarProvider, s as onMainWindow, u as plugin, v as PluginEvent, x as PluginState, y as PluginGuisChanged } from "./desktop-BSCRb8al.js";
import { i as Store, r as Registry } from "./core-sLvezBSn.js";
import { createRequire, isBuiltin } from "node:module";
import { BrowserWindow, ImageView, app, nativeImage, screen } from "electron";
import { randomUUID } from "node:crypto";
//#region ../plugin/src/gui/scope.ts
/**
* Creates scopes. The main host makes one per plugin instance.
*
* @example
* ```ts
* const scope = Scope.make("example", { timeout: 3_000, log: (message, data) => console.error(message, data) })
* ```
*/
var Scope = { 
/**
* Creates an open scope.
*
* @param name - Labels the scope in logs.
* @param options - The deadline and the log.
*/
make: (name, options) => create$1(name, options) };
function create$1(name, options, detach) {
	const controller = new AbortController();
	const finalizers = /* @__PURE__ */ new Set();
	const running = /* @__PURE__ */ new Map();
	const closing = {
		closed: false,
		chain: Promise.resolve()
	};
	const start = (finalizer) => {
		const run = Promise.resolve().then(finalizer.run).then(() => void 0, (cause) => options.log("scope finalizer failed", {
			scope: name,
			error: cause
		})).finally(() => running.delete(run));
		running.set(run, finalizer.label);
		return run;
	};
	const settle = (deadline) => Promise.race([Promise.all([closing.chain, ...running.keys()]), deadline.passed]).then(() => void 0).finally(deadline.cancel);
	const deadline = () => {
		const passed = Promise.withResolvers();
		const timer = setTimeout(() => {
			running.forEach((label, run) => {
				running.delete(run);
				if (label !== void 0) options.log("scope finalizer timed out", {
					scope: name,
					finalizer: label
				});
			});
			passed.resolve();
		}, options.timeout);
		return {
			passed: passed.promise,
			cancel: () => clearTimeout(timer)
		};
	};
	return {
		signal: controller.signal,
		addFinalizer(fn) {
			const finalizer = {
				label: fn.name || "anonymous",
				run: fn
			};
			if (closing.closed) {
				start(finalizer);
				return () => {};
			}
			finalizers.add(finalizer);
			return () => {
				if (finalizers.delete(finalizer)) return fn();
			};
		},
		fork(child) {
			const finalizer = { run: () => forked.close() };
			const forked = create$1(`${name}/${child}`, options, () => finalizers.delete(finalizer));
			if (closing.closed) forked.close();
			else finalizers.add(finalizer);
			return forked;
		},
		close() {
			if (closing.closed) return settle(deadline());
			detach?.();
			controller.abort();
			const first = deadline();
			const ordered = [...finalizers].reverse();
			finalizers.clear();
			closing.closed = true;
			closing.chain = ordered.reduce((chain, finalizer) => chain.then(() => Promise.race([start(finalizer), first.passed]).then(() => void 0)), Promise.resolve());
			return settle(first);
		}
	};
}
//#endregion
//#region ../../node_modules/.bun/solid-js@1.9.17/node_modules/solid-js/dist/server.js
var ERROR = Symbol("error");
function castError(err) {
	if (err instanceof Error) return err;
	return new Error(typeof err === "string" ? err : "Unknown error", { cause: err });
}
function handleError(err, owner = Owner) {
	const fns = owner && owner.context && owner.context[ERROR];
	const error = castError(err);
	if (!fns) throw error;
	try {
		for (const f of fns) f(error);
	} catch (e) {
		handleError(e, owner && owner.owner || null);
	}
}
var Owner = null;
function createOwner() {
	const o = {
		owner: Owner,
		context: Owner ? Owner.context : null,
		owned: null,
		cleanups: null
	};
	if (Owner) {
		if (!Owner.owned) Owner.owned = [o];
		else Owner.owned.push(o);
	}
	return o;
}
function createMemo(fn, value) {
	Owner = createOwner();
	let v;
	try {
		v = fn(value);
	} catch (err) {
		handleError(err);
	} finally {
		Owner = Owner.owner;
	}
	return () => v;
}
function createContext(defaultValue) {
	const id = Symbol("context");
	return {
		id,
		Provider: createProvider(id),
		defaultValue
	};
}
function children(fn) {
	const memo = createMemo(() => resolveChildren(fn()));
	memo.toArray = () => {
		const c = memo();
		return Array.isArray(c) ? c : c != null ? [c] : [];
	};
	return memo;
}
function resolveChildren(children) {
	if (typeof children === "function" && !children.length) return resolveChildren(children());
	if (Array.isArray(children)) {
		const results = [];
		for (let i = 0; i < children.length; i++) {
			const result = resolveChildren(children[i]);
			if (Array.isArray(result)) {
				if (result.length < 32768) results.push.apply(results, result);
				else for (let j = 0; j < result.length; j++) results.push(result[j]);
			} else results.push(result);
		}
		return results;
	}
	return children;
}
function createProvider(id) {
	return function provider(props) {
		return createMemo(() => {
			Owner.context = {
				...Owner.context,
				[id]: props.value
			};
			return children(() => props.children);
		});
	};
}
createContext();
createContext();
createContext();
createContext();
createContext();
//#endregion
//#region ../plugin/src/gui/modules.ts
/**
* The modules only a window provides to a plugin's `./gui-experimental` bundle; main gives the bundle an inert
* placeholder.
*/
var pluginWindowModules = [
	"solid-js",
	"solid-js/web",
	"solid-js/store",
	"@opencode/plugin/gui/file",
	"@opencode/plugin/gui/review",
	"@opencode/plugin/gui/browser",
	"@opencode/client/solid"
];
//#endregion
//#region ../plugin/src/gui/host.ts
/**
* Composes the app's built-in plugins for one process, the way the host lists them: each built-in's `Plugin.define`
* declarations plus the entries the host loads lazily (`windowEntry`, `mainEntry`), under its id.
*
* @param entries - Every built-in of one process, by id, in the order the host lists them.
* @returns The entries, each with its id.
*
* @example
* ```ts
* export const builtins = compose({ pairing: { ...pairing, mainEntry: () => import("./pairing/main") }, review })
* ```
*/
function compose(entries) {
	return Object.entries(entries).map(([id, entry]) => ({
		...entry,
		id
	}));
}
/**
* Whether a plugin runs on this system: it lists no OS, or lists this one. On the web, where no OS is known, only a
* plugin that lists none runs. Both hosts apply it to built-ins and plugins alike.
*
* @param declarations - The plugin's declared `os`.
* @param os - This system, or undefined on the web.
* @returns True when the plugin runs here.
*/
function runsOn(declarations, os) {
	return !declarations.os || !!os && declarations.os.includes(os);
}
/**
* Resolves desktop enable state. A built-in always runs, whatever row is saved under its id; any other plugin follows
* the row saved under its id, or is enabled when there is none. Both hosts use this rule, including a window's preload
* snapshot.
*
* @param plugin - The plugin, and whether it ships with the app.
* @param state - Explicit saved rows, or the manager's resolved list.
* @returns Whether the plugin is enabled.
*/
function pluginEnabled(plugin, state) {
	if (plugin.builtin) return true;
	return state.find((item) => item.id === plugin.id)?.enabled ?? true;
}
/**
* A placeholder for a module that exists only in the other process, so one plugin `./gui-experimental` bundle runs in
* both: a window gets one for `electron` and Node built-ins, main gets one for Solid and the window-only modules.
* Bundlers hoist `require` calls and Solid hoists template creation to module scope, so the placeholder accepts any
* property read, call or construction and returns itself, and ignores writes. It is never a thenable, so a promise
* never waits on it, and nothing is an instance of it. Code that actually runs in the wrong process gets placeholders
* back instead of working values; keep each process's code in its entry.
*
* @param name - The module's name, shown when the placeholder is converted to a string.
* @returns The placeholder.
*/
function inertModule(name) {
	const label = `[inert module ${name}]`;
	const placeholder = new Proxy(function inert() {}, {
		get(_, key) {
			if (key === "then") return void 0;
			if (key === Symbol.toPrimitive || key === "toString") return () => label;
			if (key === Symbol.hasInstance) return () => false;
			return placeholder;
		},
		set: () => true,
		defineProperty: () => true,
		deleteProperty: () => true,
		apply: () => placeholder,
		construct: () => placeholder
	});
	return placeholder;
}
/**
* Evaluates a plugin's `./gui-experimental` bundle, a CommonJS module whose default export is its `Plugin.define`, and
* checks it: the declarations the host reads and at least one setup. Both hosts call it, each with its own `require`.
* The bundle's code is trusted as much as the server that runs the app, which already loads the plugin.
*
* @param code - The bundle's CommonJS code.
* @param host - The process evaluating it.
* @returns The checked plugin.
* @throws When evaluation throws, the default export is not a `Plugin.define` this app supports, or it has no setup.
*/
function evaluatePluginBundle(code, host) {
	const module = { exports: {} };
	new Function("require", "module", "exports", code)(host.require, module, module.exports);
	const plugin = hasProperty(module.exports, "default") ? module.exports.default : module.exports;
	if (!matchesPlugin(plugin)) {
		const decoded = decodeUnknownExit(BundleDefinition)(plugin);
		const problem = isFailure(decoded) ? pretty(decoded.cause) : "it does not match";
		throw new Error(`A plugin's ./gui-experimental bundle must default-export a \`Plugin.define\` from \`@opencode/plugin/gui\`: ${problem}`);
	}
	if (!plugin.setup && !plugin.main) throw new Error("A plugin's GUI must have a window `setup`, a `main` setup, or both");
	return {
		definition: {
			os: plugin.os,
			stores: plugin.stores,
			i18n: plugin.i18n && {
				...plugin.i18n,
				en: plugin.i18n.en ?? {}
			}
		},
		setup: plugin.setup,
		main: plugin.main
	};
}
var Setup = declare(isFunction);
var BundleDefinition = Struct({
	os: optional(ArraySchema(Literals([
		"macos",
		"windows",
		"linux"
	]))),
	stores: optional(Record(String$1, Struct({
		scope: Literals(["global", "session"]),
		schema: declare(isSchema)
	}))),
	i18n: optional(Record(String$1, Record(String$1, String$1))),
	setup: optional(Setup),
	main: optional(Setup)
});
var matchesPlugin = is(BundleDefinition);
/**
* Whether a plugin's GUI may take an id. Built-ins win: a plugin cannot take a built-in's id, an id that nests under
* one or that one nests under (tokens and stored keys resolve by dot-separated prefix), or the `opencode` namespace.
* Both hosts check it, each against its own built-ins.
*
* @param id - The server plugin's id.
* @param builtins - The host's built-in definitions, on every OS.
* @returns True when no built-in claims the id.
*/
function pluginIdAvailable(id, builtins) {
	return [{ id: "opencode" }, ...builtins].every((taken) => id !== taken.id && !id.startsWith(`${taken.id}.`) && !taken.id.startsWith(`${id}.`));
}
/**
* Whether a server plugin's GUI loads: an active plugin with an id, not one of the server's own built-ins, that exports
* `./gui-experimental`. Main lists plugins with it; `pluginIdAvailable` then checks the id against the built-ins.
*
* @param plugin - A plugin as the server lists it.
* @returns True when the plugin's `./gui-experimental` bundle should load.
*/
function shipsPluginGui(plugin) {
	return !!plugin.id && plugin.source.type !== "builtin" && plugin.state.status === "active" && !!plugin.features.gui;
}
Registry.define("command");
Registry.define("panel");
Registry.define("slot");
/**
* Declares a built-in's window state, as `Store` does, with older homes that may be parts of shared app keys.
*
* @example
* ```ts
* stores: { seen: BuiltinStore.global(Seen, {}, "highlights.v1") }
* ```
*/
var BuiltinStore = {
	/**
	* One value for the app, as `Store.global`.
	*
	* @param schema - Decodes the stored JSON; an object schema.
	* @param initial - The value before anything is stored.
	* @param from - Older homes to import the value from once.
	*/
	global: (schema, initial, from) => ({
		scope: "global",
		schema,
		initial,
		builtinFrom: from
	}),
	/**
	* One value per session, as `Store.session`.
	*
	* @param schema - Decodes the stored JSON; an object schema.
	* @param initial - The value before anything is stored.
	* @param from - Older homes to import the value from once; `{ key, sessions, pick }` reads one session's entry of a
	*   global key.
	*/
	session: (schema, initial, from) => ({
		scope: "session",
		schema,
		initial,
		builtinFrom: from
	})
};
/**
* The members only built-ins use, on a main context.
*
* @param ctx - The plugin's main context.
* @returns The same object, typed with the built-in members.
*
* @example
* ```ts
* const lifecycle = builtinMainContext(ctx).lifecycle
* ```
*/
function builtinMainContext(ctx) {
	return ctx;
}
/**
* Declares a built-in's catalog with lazily loaded locales. Both hosts load a locale's loader when the user picks it;
* a plugin bundle's catalog is checked to be inline.
*
* @param catalog - English inline, other locales inline or as loaders.
* @returns The catalog, as `Plugin.define` takes it.
*/
function builtinCatalog(catalog) {
	return catalog;
}
Registry.define("command");
Registry.define("menu-item");
Registry.define("panel");
Registry.define("settings-page");
Registry.define("server");
Registry.define("link-handler");
Registry.define("titlebar-item");
Registry.define("composer-pill");
Registry.define("code-block");
Registry.define("code-block-action");
Registry.define("slot");
Registry.define("style");
Registry.define("theme");
//#endregion
//#region ../plugin/src/gui/plugin.ts
var plugin_exports = /* @__PURE__ */ __exportAll({ define: () => define });
/**
* Returns the plugin as it is; the overloads above carry its types.
*
* @param plugin - The declarations, with any setups.
* @returns The same object.
*/
function define(plugin) {
	return plugin;
}
//#endregion
//#region ../gui-plugins/src/context/index.ts
var context_default = define({ i18n: builtinCatalog({
	en: {
		"tab.title": "Context",
		"mobile.title": "Usage",
		"usage.tokens": "Tokens",
		"usage.usage": "Context",
		"usage.cost": "Cost",
		"usage.view": "View context usage",
		"usage.toggle": "Toggle session context",
		"systemPrompt.title": "System Prompt",
		"rawMessages.title": "Raw messages",
		"export.session": "Export session",
		"stats.session": "Session",
		"stats.messages": "Messages",
		"stats.provider": "Provider",
		"stats.model": "Model",
		"stats.limit": "Context Limit",
		"stats.totalTokens": "Total Tokens",
		"stats.usage": "Usage",
		"stats.inputTokens": "Input Tokens",
		"stats.outputTokens": "Output Tokens",
		"stats.reasoningTokens": "Reasoning Tokens",
		"stats.cacheTokens": "Cache Tokens (read/write)",
		"stats.userMessages": "User Messages",
		"stats.assistantMessages": "Assistant Messages",
		"stats.totalCost": "Total Cost",
		"stats.sessionCreated": "Session Created",
		"stats.lastActivity": "Last Activity",
		"export.success.title": "Session exported",
		"export.success.description": "Saved session to {{filename}}",
		"export.failed.title": "Failed to export session",
		"export.failed.description": "An error occurred while exporting the session"
	},
	am: () => import("./am-B_ReSs8g.js"),
	ar: () => import("./ar-DbP6KvsZ.js"),
	az: () => import("./az-dp51U5dC.js"),
	bg: () => import("./bg-DMg3ZvYW.js"),
	bn: () => import("./bn-BypMsfcI.js"),
	br: () => import("./br-CpBsG1jY.js"),
	bs: () => import("./bs-BZVF6qQE.js"),
	ca: () => import("./ca-CUxTMZ3E.js"),
	cs: () => import("./cs-D57jM-ZW.js"),
	da: () => import("./da-JUxYhpGh.js"),
	de: () => import("./de-BO0Sb_Bp.js"),
	dv: () => import("./dv-Tk4TjLSi.js"),
	dz: () => import("./dz-D7Sh0MYi.js"),
	el: () => import("./el-C48XfqwY.js"),
	es: () => import("./es-aWRhJ1Kq.js"),
	et: () => import("./et-ChBI2VZm.js"),
	fa: () => import("./fa-ie2Kh6ZW.js"),
	fi: () => import("./fi-DEKzq7cB.js"),
	fo: () => import("./fo-M_BtFkIm.js"),
	fr: () => import("./fr-63Ab12un.js"),
	he: () => import("./he-BlRm3uEk.js"),
	hi: () => import("./hi-D1KPI23f.js"),
	hr: () => import("./hr-B76qsPO2.js"),
	hu: () => import("./hu-DaiPJgUh.js"),
	hy: () => import("./hy-B7aEQyEN.js"),
	id: () => import("./id-bMP1hFwl.js"),
	is: () => import("./is-i1vNZb7c.js"),
	it: () => import("./it-C_JCHaBT.js"),
	ja: () => import("./ja-R3c2XUx8.js"),
	ka: () => import("./ka-DIq6DWt1.js"),
	km: () => import("./km-BCqU0vJ6.js"),
	ko: () => import("./ko-DfWwq7s5.js"),
	lo: () => import("./lo-C2qQxM68.js"),
	lt: () => import("./lt-bvgx652h.js"),
	lv: () => import("./lv-B2lRc7-Y.js"),
	mk: () => import("./mk-DBt7nrFt.js"),
	mn: () => import("./mn-CxOyBTv4.js"),
	ms: () => import("./ms-DSiz19HQ.js"),
	my: () => import("./my-CH09vNDB.js"),
	ne: () => import("./ne-BbC9D5Wz.js"),
	nl: () => import("./nl-Beg49b4L.js"),
	no: () => import("./no-CP_gF2Oj.js"),
	pa: () => import("./pa-9fxr3JGT.js"),
	pl: () => import("./pl-CwnFe1g-.js"),
	ro: () => import("./ro-BCog7_-m.js"),
	ru: () => import("./ru-CJjDj2_g.js"),
	si: () => import("./si-D2aksbeh.js"),
	sk: () => import("./sk-BucD4LT_.js"),
	sl: () => import("./sl-Bq_mhmJ_.js"),
	sq: () => import("./sq-BpQSFO0c.js"),
	sr: () => import("./sr-BsEU5OSx.js"),
	sv: () => import("./sv-CXGh7_uz.js"),
	tg: () => import("./tg-C57VT23h.js"),
	th: () => import("./th-DqQ2lh53.js"),
	tk: () => import("./tk-DhF4Lk4k.js"),
	tr: () => import("./tr-BTCk5z9S.js"),
	uk: () => import("./uk-ComhhEnD.js"),
	ur: () => import("./ur-DBTGMDPZ.js"),
	uz: () => import("./uz--hLh9W81.js"),
	vi: () => import("./vi-BTaweqxn.js"),
	zh: () => import("./zh-CbfuUi_6.js"),
	zht: () => import("./zht-D5s2IYpN.js")
}) });
//#endregion
//#region ../gui-plugins/src/btw/i18n/en.ts
var en_default$20 = {
	"command.title": "Ask a side question",
	"command.description": "Get a one-shot answer without adding to the conversation",
	"tab.title": "/btw",
	"question.required": "Add a question after /btw",
	error: "Couldn’t answer that question",
	"error.empty": "The model replied without any text.",
	"error.timeout": "The model took too long to reply.",
	retry: "Retry",
	copy: "Copy answer"
};
//#endregion
//#region ../gui-plugins/src/btw/index.ts
var ChatModel = Struct({
	providerID: String$1,
	id: String$1,
	variant: optional(String$1)
});
var Chats = Struct({ chats: ArraySchema(Struct({
	id: String$1,
	question: String$1,
	answer: optional(String$1),
	agent: optional(String$1),
	model: optional(ChatModel),
	created: optional(Number),
	duration: optional(Number)
})) });
var btw_default = define({
	stores: { chats: Store.session(Chats, { chats: [] }) },
	i18n: { en: en_default$20 }
});
//#endregion
//#region ../gui-plugins/src/debug/index.ts
var debug_default = define({
	stores: { bar: Store.global(Struct({
		visible: Boolean,
		motion: Boolean
	}), {
		visible: false,
		motion: false
	}) },
	i18n: builtinCatalog({
		en: {
			"command.toggle": "Toggle debug bar",
			"close.label": "Hide debug bar",
			"close.tip": "Hide debug bar. Bring it back from the command palette: Toggle debug bar.",
			"command.heap": "Capture heap snapshots",
			"command.heap.description": "Saves the memory of the app and its server to a folder",
			"heap.loading": "Capturing heap snapshots…",
			"heap.done": "Heap snapshots saved",
			"heap.partial": "Some heap snapshots failed. See manifest.json.",
			"heap.failed": "Could not capture heap snapshots",
			"heap.reveal": "Show in folder",
			providerAriaLabel: "Provider performance diagnostics",
			na: "n/a",
			"duration.label": "TIME",
			"duration.tip": "Time from the prompt that started the latest turn until its response completed.",
			"tps.label": "TPS",
			"tps.tip": "Output and reasoning tokens per second across the latest turn's model requests, excluding tool time.",
			"session.label": "SESSION",
			"session.tip": "{{id}}. Click to copy.",
			"session.none": "No session open",
			"session.copyFailed": "Failed to copy session ID",
			"memory.label": "MEMLOG",
			"memory.tip": "Memory diagnostics: log app memory to the desktop logs every 30 seconds. Stays on across restarts until turned off; the bar stays open while it runs.",
			"memory.tipEnv": "Memory diagnostics are on for this launch: OPENCODE_DESKTOP_MEMORY_LOG is set.",
			"memory.env": "ENV",
			"motion.label": "KNOBS",
			"motion.title": "Knobs",
			"motion.tip": "Tune live. Changes persist on this device.",
			"motion.close": "Close Knobs",
			"motion.off": "Off",
			"motion.shipped": "Shipped",
			"motion.replay": "Replay",
			"motion.focus": "Focus",
			"motion.enabled": "Enabled",
			"components.label": "COMPONENTS",
			"components.tip": "Open the components lab: every story, with live controls and its states",
			"speed.label": "SPEED",
			"speed.tip": "Global animation speed. Click to step through 0.5× and 0.25× back to 1×.",
			"slow.label": "SLOW",
			"slow.tip": "Run every tuned animation at a quarter speed.",
			"focus.label": "FOCUS",
			"focus.tip": "Force focus styles on all interactive elements",
			"focus.on": "ON",
			"focus.off": "OFF",
			"direction.label": "DIR",
			"direction.tip": "Force the full app layout direction without changing the selected language",
			"direction.ltr": "LTR",
			"direction.rtl": "RTL"
		},
		am: () => import("./am-eKR9p64O.js"),
		ar: () => import("./ar-B7T7IRpJ.js"),
		az: () => import("./az-Bw6a4ybi.js"),
		bg: () => import("./bg-DaaBJCM5.js"),
		bn: () => import("./bn-DNYtphMA.js"),
		br: () => import("./br-GpGmZ_zv.js"),
		bs: () => import("./bs-DaZUHOmJ.js"),
		ca: () => import("./ca-BqL00exY.js"),
		cs: () => import("./cs-DMjeEtdR.js"),
		da: () => import("./da-PZQjFPHx.js"),
		de: () => import("./de-CFTo5uAQ.js"),
		dv: () => import("./dv-DQhE_LRO.js"),
		dz: () => import("./dz-CUcLu2XB.js"),
		el: () => import("./el-CwpuMbfC.js"),
		es: () => import("./es-Ci60HUtE.js"),
		et: () => import("./et-CE8EcnXz.js"),
		fa: () => import("./fa-CF_Z7kd7.js"),
		fi: () => import("./fi-DV-_4JtG.js"),
		fo: () => import("./fo-1iRablit.js"),
		fr: () => import("./fr-CE1HnnKf.js"),
		he: () => import("./he-DJZ0WNis.js"),
		hi: () => import("./hi-Db-QNeTN.js"),
		hr: () => import("./hr-D-qVV3M0.js"),
		hu: () => import("./hu-JakSsdJb.js"),
		hy: () => import("./hy-BMT427I0.js"),
		id: () => import("./id-CAQrT6Mp.js"),
		is: () => import("./is-5wVdnPsQ.js"),
		it: () => import("./it-2zfKU_Sv.js"),
		ja: () => import("./ja-JCUawHy8.js"),
		ka: () => import("./ka-CnRAKuwR.js"),
		km: () => import("./km-CIXncoj5.js"),
		ko: () => import("./ko-V6Ew7-a_.js"),
		lo: () => import("./lo-DwwV1Ieo.js"),
		lt: () => import("./lt-CHVa6MFu.js"),
		lv: () => import("./lv-Dcehnaox.js"),
		mk: () => import("./mk-DcaL7-6z.js"),
		mn: () => import("./mn-DjxL0Y4_.js"),
		ms: () => import("./ms-CsTPJU8A.js"),
		my: () => import("./my-DyD-tIaJ.js"),
		ne: () => import("./ne-BPGph-FY.js"),
		nl: () => import("./nl-DcbIJiBx.js"),
		no: () => import("./no-DfiQ4RZY.js"),
		pa: () => import("./pa-aCqV6mBY.js"),
		pl: () => import("./pl-D5zv5aM6.js"),
		ro: () => import("./ro-CT4P_j0M.js"),
		ru: () => import("./ru-BytlTCsL.js"),
		si: () => import("./si-BccmkCTr.js"),
		sk: () => import("./sk-DsP1o6Jj.js"),
		sl: () => import("./sl-DlW7cgTr.js"),
		sq: () => import("./sq-BxLuGR0h.js"),
		sr: () => import("./sr-CjCsHxql.js"),
		sv: () => import("./sv-D3eSsRjs.js"),
		tg: () => import("./tg-LZjAREPn.js"),
		th: () => import("./th-D0uY3U88.js"),
		tk: () => import("./tk-BLdeZMAv.js"),
		tr: () => import("./tr-By4eqPu_.js"),
		uk: () => import("./uk-BMaKHOl_.js"),
		ur: () => import("./ur-DAi4G67a.js"),
		uz: () => import("./uz-CU3fMNWc.js"),
		vi: () => import("./vi-KgJVDecl.js"),
		zh: () => import("./zh-B0V7LVQ8.js"),
		zht: () => import("./zht-C-zudQbp.js")
	})
});
//#endregion
//#region ../gui-plugins/src/terminal/index.ts
var terminal_default = define({ i18n: builtinCatalog({
	en: {
		"command.category": "Terminal",
		"command.toggle": "Toggle terminal",
		"command.new": "New terminal",
		"command.new.description": "Create a new terminal tab",
		"location.open": "Open in terminal",
		loading: "Loading terminal…",
		"list.failed": "Couldn't load terminals",
		unavailable: "Terminals aren't available on this server",
		"title.numbered": "Terminal {{number}}",
		close: "Close terminal",
		"close.failed": "Couldn't close the terminal",
		"request.timedOut": "The server took too long to answer",
		"create.failed": "Couldn't create a terminal",
		"create.unsupported": "This server is too old for terminals. Update OpenCode on this server.",
		"rename.failed": "Couldn't rename the terminal",
		"rename.unsupported": "Terminal renaming will be available after OpenCode's terminal service restarts",
		disconnected: "Terminal disconnected",
		connectionFailed: "Terminal connection failed",
		serverOutdated: "This server is too old for terminals; update OpenCode on it",
		"tab.title": "Terminal",
		"quote.actions": "Quote selection",
		"quote.add": "Quote",
		"quote.addWithComment": "Quote and comment",
		"quote.addWithoutComment": "Quote without comment",
		"quote.tooLong": "Selection too long",
		"quote.label": "Terminal"
	},
	am: () => import("./am-aeD-2QqB.js"),
	ar: () => import("./ar-Dn9G_BQ8.js"),
	az: () => import("./az-DSI-j2R-.js"),
	bg: () => import("./bg-uqYAJOcl.js"),
	bn: () => import("./bn-B3LvQz3p.js"),
	br: () => import("./br-DPSpThs2.js"),
	bs: () => import("./bs-CAsE8sd9.js"),
	ca: () => import("./ca-DAheNrN8.js"),
	cs: () => import("./cs-CP9UoYQ9.js"),
	da: () => import("./da-BHtXHNBQ.js"),
	de: () => import("./de-_recn2BT.js"),
	dv: () => import("./dv-D460jvZX.js"),
	dz: () => import("./dz-BD-zJBzg.js"),
	el: () => import("./el-BgY_-2Zi.js"),
	es: () => import("./es-BE9C7LG3.js"),
	et: () => import("./et-BbY-gKdb.js"),
	fa: () => import("./fa-B9SSTUjw.js"),
	fi: () => import("./fi-CtAN8fmB.js"),
	fo: () => import("./fo-l5qiRGMS.js"),
	fr: () => import("./fr-BDPOt3aR.js"),
	he: () => import("./he-C0MDA4Fm.js"),
	hi: () => import("./hi--UawVR5m.js"),
	hr: () => import("./hr-DbASehKE.js"),
	hu: () => import("./hu-B2wVYMUg.js"),
	hy: () => import("./hy-BSULYeTY.js"),
	id: () => import("./id-DJQCRyWa.js"),
	is: () => import("./is-5KHz4Uic.js"),
	it: () => import("./it-CUi-rlrT.js"),
	ja: () => import("./ja-DcuPZ6eb.js"),
	ka: () => import("./ka-Bf1XyHOr.js"),
	km: () => import("./km-DCrmiqMD.js"),
	ko: () => import("./ko-DwJd1nrS.js"),
	lo: () => import("./lo-ClXFtLQb.js"),
	lt: () => import("./lt-ikmSf4oo.js"),
	lv: () => import("./lv-eF356ODo.js"),
	mk: () => import("./mk-DlZmlhVe.js"),
	mn: () => import("./mn-DU9V2k1u.js"),
	ms: () => import("./ms-BSHD6XH5.js"),
	my: () => import("./my-CGMvM-wC.js"),
	ne: () => import("./ne-C5Xrdlbx.js"),
	nl: () => import("./nl-xQNKLgnA.js"),
	no: () => import("./no-lVYERLCS.js"),
	pa: () => import("./pa-CIlqHC6Z.js"),
	pl: () => import("./pl-CmNy4yQs.js"),
	ro: () => import("./ro-CXeMOnno.js"),
	ru: () => import("./ru-CRVVY9na.js"),
	si: () => import("./si-BPR_N4YE.js"),
	sk: () => import("./sk-i8TtuPPh.js"),
	sl: () => import("./sl-uwmfmAac.js"),
	sq: () => import("./sq-CcvjsY6s.js"),
	sr: () => import("./sr-C5U7yD56.js"),
	sv: () => import("./sv-CDloG7MA.js"),
	tg: () => import("./tg-BIQepzeS.js"),
	th: () => import("./th-BYmkSJS1.js"),
	tk: () => import("./tk-ClewVQAJ.js"),
	tr: () => import("./tr-Bk7BPVD8.js"),
	uk: () => import("./uk-PlaTM0yB.js"),
	ur: () => import("./ur-BaRbtUvr.js"),
	uz: () => import("./uz-Ao1SrOIt.js"),
	vi: () => import("./vi-CorhGdp5.js"),
	zh: () => import("./zh-DLFtsMem.js"),
	zht: () => import("./zht-Bzdub8h0.js")
}) });
var OpenAppPreferences = Struct({ app: Literals([
	"vscode",
	"cursor",
	"zed",
	"textmate",
	"antigravity",
	"finder",
	"terminal",
	"iterm2",
	"ghostty",
	"warp",
	"xcode",
	"android-studio",
	"powershell",
	"sublime-text"
]) });
//#endregion
//#region ../gui-plugins/src/file/index.ts
var file_default = define({
	stores: { app: Store.global(OpenAppPreferences, { app: "finder" }, "open.app") },
	i18n: builtinCatalog({
		en: {
			"tree.all": "All files",
			"tab.notFound": "File not found: {{name}}",
			"load.failed": "Failed to load file",
			"load.timeout": "Opening {{name}} took too long.",
			"mobile.title": "Files",
			"mobile.openTabs": "Open files",
			"view.preview": "Preview",
			"view.fit": "Fit",
			"view.source": "Source",
			"view.viewSource": "View source",
			"view.viewPreview": "View preview",
			"view.copyContent": "Copy content",
			"view.actions": "File actions",
			"view.download": "Download",
			"view.reveal": "Reveal in {{app}}",
			"view.openInBrowser": "Open in browser",
			"view.fullscreen": "Enter full screen",
			"view.binary": "Binary file · {{size}}",
			"view.loadFailed": "Couldn't load this file.",
			"view.table.rows.one": "{{count}} row",
			"view.table.rows.other": "{{count}} rows",
			"view.table.columns.one": "{{count}} column",
			"view.table.columns.other": "{{count}} columns",
			"view.table.truncated": "Showing the first {{shown}} of {{total}} rows.",
			"view.table.copyCell": "Copy cell",
			"view.table.copyFailed": "Couldn't copy this cell.",
			"view.fontSample": "Sphinx of black quartz, judge my vow.",
			"view.properties": "Properties",
			"view.properties.showAll": "Show all {{count}} properties",
			"open.in": "Open in",
			"open.ariaLabel": "Open in {{app}}",
			"open.menu": "Open options",
			"open.copyPath": "Copy path",
			"open.app.vscode": "VS Code",
			"open.app.cursor": "Cursor",
			"open.app.zed": "Zed",
			"open.app.textmate": "TextMate",
			"open.app.antigravity": "Antigravity",
			"open.app.terminal": "Terminal",
			"open.app.iterm2": "iTerm2",
			"open.app.ghostty": "Ghostty",
			"open.app.warp": "Warp",
			"open.app.xcode": "Xcode",
			"open.app.androidStudio": "Android Studio",
			"open.app.powershell": "PowerShell",
			"open.app.sublimeText": "Sublime Text",
			selectToOpen: "Select a file to open",
			"open.finder": "Finder",
			"open.fileExplorer": "File Explorer",
			"open.fileManager": "File Manager",
			"command.open": "Open file",
			"search.failed": "Couldn't search files",
			"search.timeout": "The server took too long to answer",
			"search.offline": "Can't reach this server"
		},
		am: () => import("./am-DUfCVdfq.js"),
		ar: () => import("./ar-DdvWPem9.js"),
		az: () => import("./az-D53VnICu.js"),
		bg: () => import("./bg-BLn6t3Ms.js"),
		bn: () => import("./bn-C1dnCK6v.js"),
		br: () => import("./br-d5m2DXpD.js"),
		bs: () => import("./bs-WPm8va_n.js"),
		ca: () => import("./ca-BcXiLnSP.js"),
		cs: () => import("./cs-zDJo4IoF.js"),
		da: () => import("./da-CAfevHmc.js"),
		de: () => import("./de-CJ92rGyL.js"),
		dv: () => import("./dv-DpHo_RyL.js"),
		dz: () => import("./dz-BZ0c_nve.js"),
		el: () => import("./el-DHJYPnrl.js"),
		es: () => import("./es-C2B2XPGI.js"),
		et: () => import("./et-CgmK7wVd.js"),
		fa: () => import("./fa-COe7LmaA.js"),
		fi: () => import("./fi-CVL6nvBY.js"),
		fo: () => import("./fo-C_QAKjtm.js"),
		fr: () => import("./fr-Dcww3wgs.js"),
		he: () => import("./he-JA_EyKGC.js"),
		hi: () => import("./hi-BaZBnwPu.js"),
		hr: () => import("./hr-BjFZ7_9E.js"),
		hu: () => import("./hu-C3MPW8uC.js"),
		hy: () => import("./hy-DQJBWBVx.js"),
		id: () => import("./id-CnXahreR.js"),
		is: () => import("./is-BlY9hOU0.js"),
		it: () => import("./it-DgFaMMAs.js"),
		ja: () => import("./ja-pDiqKLiy.js"),
		ka: () => import("./ka-JGT0TmzW.js"),
		km: () => import("./km-Db_IRkGu.js"),
		ko: () => import("./ko-D-609r4S.js"),
		lo: () => import("./lo-DGmnV1jp.js"),
		lt: () => import("./lt-B-vVyUyI.js"),
		lv: () => import("./lv-a4iF0hqS.js"),
		mk: () => import("./mk-BprcVsK-.js"),
		mn: () => import("./mn-D0uytCrL.js"),
		ms: () => import("./ms-BA5HU3fS.js"),
		my: () => import("./my-DzFDwlr2.js"),
		ne: () => import("./ne-DpaXLgEu.js"),
		nl: () => import("./nl-CZyUiMqD.js"),
		no: () => import("./no-CUEM2D4t.js"),
		pa: () => import("./pa-DsWJ29WZ.js"),
		pl: () => import("./pl-CB8vE0HV.js"),
		ro: () => import("./ro-MPFqjn7y.js"),
		ru: () => import("./ru-DaK9qJZV.js"),
		si: () => import("./si-D7sBPplp.js"),
		sk: () => import("./sk-DM5-d5Tq.js"),
		sl: () => import("./sl-BXgyzTQs.js"),
		sq: () => import("./sq-npzkkIQX.js"),
		sr: () => import("./sr-DNWaH89g.js"),
		sv: () => import("./sv-CtG9QYd0.js"),
		tg: () => import("./tg-B12x-jBq.js"),
		th: () => import("./th-CaplLhhg.js"),
		tk: () => import("./tk-CV9TG_Wt.js"),
		tr: () => import("./tr-CcSk9un1.js"),
		uk: () => import("./uk-zVqcy0mj.js"),
		ur: () => import("./ur-C2aRXSrO.js"),
		uz: () => import("./uz-BzuyKt8p.js"),
		vi: () => import("./vi-Byr2wnqG.js"),
		zh: () => import("./zh-CAPf3S1W.js"),
		zht: () => import("./zht-C5ZTxAQG.js")
	})
});
//#endregion
//#region ../gui-plugins/src/review/i18n/en.ts
var en_default$16 = {
	"tab.title": "Review",
	"tab.count.one": "Files Changed {{count}}",
	"tab.count.other": "Files Changed {{count}}",
	"menu.count.one": "{{count}} file changed",
	"menu.count.other": "{{count}} files changed",
	"folder.more": "{{count}} · more not shown",
	"folder.failed": "Couldn't load changes",
	"command.open": "Open review",
	"mobile.title.one": "Change",
	"mobile.title.other": "Changes",
	"empty.git": "No uncommitted changes yet",
	"empty.branch": "No branch changes yet",
	"git.title": "Create a Git repository",
	"git.description": "Track, review, and undo changes in this project",
	loadingChanges: "Loading changes…",
	noChanges: "No changes",
	"load.failed": "Couldn't load changes",
	"load.timeout": "The server took too long to answer",
	offline: "Can't reach this server",
	"settings.wrapLines.title": "Wrap lines",
	"settings.wrapLines.description": "Wrap long lines in mobile diffs instead of scrolling horizontally"
};
//#endregion
//#region ../gui-plugins/src/review/index.ts
var DiffState = Struct({ diffStyle: Literals(["unified", "split"]) });
var PanelState = Struct({ expandMode: Literals(["expand", "collapse"]) });
var MobileDiff = Struct({ wrap: Boolean });
var SessionState = Struct({
	mode: optional(Literals([
		"git",
		"branch",
		"turn"
	])),
	file: optional(String$1),
	open: ArraySchema(String$1)
});
var review_default = define({
	stores: {
		diff: BuiltinStore.global(DiffState, { diffStyle: "split" }, {
			key: "layout",
			pick: (value) => {
				const diffStyle = value?.review?.diffStyle;
				return diffStyle === void 0 ? void 0 : { diffStyle };
			}
		}),
		panel: BuiltinStore.global(PanelState, { expandMode: "collapse" }, {
			key: "review-panel-v2",
			pick: (value) => {
				const expandMode = value?.expandMode;
				return expandMode === void 0 ? void 0 : { expandMode };
			}
		}),
		mobileDiff: BuiltinStore.global(MobileDiff, { wrap: true }, {
			key: "settings.v3",
			pick: (value) => {
				const wrap = value?.general?.mobileDiffWrap;
				return wrap === void 0 ? void 0 : { wrap };
			}
		}),
		session: BuiltinStore.session(SessionState, { open: [] }, {
			key: "layout",
			sessions: "sessionView",
			pick: (entry) => entry && [
				entry.reviewMode,
				entry.reviewFile,
				entry.reviewOpen
			].some((field) => field !== void 0) ? {
				mode: entry.reviewMode,
				file: entry.reviewFile,
				open: entry.reviewOpen
			} : void 0
		})
	},
	i18n: builtinCatalog({
		en: en_default$16,
		am: () => import("./am-BeYzUk6o.js"),
		ar: () => import("./ar-BjlPaZf7.js"),
		az: () => import("./az-BhUqZOne.js"),
		bg: () => import("./bg-D03sxNM7.js"),
		bn: () => import("./bn-9_isROt5.js"),
		br: () => import("./br-DP5UvJq_.js"),
		bs: () => import("./bs-Cn2bvfrl.js"),
		ca: () => import("./ca-BjaaBZIi.js"),
		cs: () => import("./cs-CcoimJL-.js"),
		da: () => import("./da-C_eg23aw.js"),
		de: () => import("./de-DRGuBgka.js"),
		dv: () => import("./dv-CeSj_5i0.js"),
		dz: () => import("./dz-CfJtKDGD.js"),
		el: () => import("./el-B_tdLHCN.js"),
		es: () => import("./es-DIpzThAt.js"),
		et: () => import("./et-BkVtQy_t.js"),
		fa: () => import("./fa-BxkuzrGO.js"),
		fi: () => import("./fi-BycSDomD.js"),
		fo: () => import("./fo-5pBcbmZ8.js"),
		fr: () => import("./fr-CHAR0r8e.js"),
		he: () => import("./he-BurNC6Cx.js"),
		hi: () => import("./hi-Cki1DSKg.js"),
		hr: () => import("./hr-oGvfPCND.js"),
		hu: () => import("./hu-C-nNhZC5.js"),
		hy: () => import("./hy-dFeI_jDP.js"),
		id: () => import("./id-BqXecrWb.js"),
		is: () => import("./is-CFbltIj5.js"),
		it: () => import("./it-Cnv2YUEz.js"),
		ja: () => import("./ja-DLaWiM2Y.js"),
		ka: () => import("./ka-CcQQdIS5.js"),
		km: () => import("./km-9GtIBlsO.js"),
		ko: () => import("./ko-Cc7vT6yF.js"),
		lo: () => import("./lo-DYFotnqY.js"),
		lt: () => import("./lt-DuT7c8uU.js"),
		lv: () => import("./lv-DXaMQzq4.js"),
		mk: () => import("./mk-iM-vzBmQ.js"),
		mn: () => import("./mn-B2g-mkOx.js"),
		ms: () => import("./ms-D-x-cdWn.js"),
		my: () => import("./my-DUYViz5Y.js"),
		ne: () => import("./ne-Bj9zg4iX.js"),
		nl: () => import("./nl-BhmqNsib.js"),
		no: () => import("./no-BLZCF40t.js"),
		pa: () => import("./pa-Dg5KVU_i.js"),
		pl: () => import("./pl-ChYN_TgC.js"),
		ro: () => import("./ro-BE7T7hDR.js"),
		ru: () => import("./ru-HoU8OfBJ.js"),
		si: () => import("./si-V-NFB0jD.js"),
		sk: () => import("./sk-mhBAsVhq.js"),
		sl: () => import("./sl-tP5AN591.js"),
		sq: () => import("./sq-DzA1R267.js"),
		sr: () => import("./sr-CACrTiq3.js"),
		sv: () => import("./sv-uxx24Mvc.js"),
		tg: () => import("./tg-D1cbpvD_.js"),
		th: () => import("./th-DWMerEfJ.js"),
		tk: () => import("./tk-yVk3r1qU.js"),
		tr: () => import("./tr-B4WrFAtT.js"),
		uk: () => import("./uk-BN2-QrF2.js"),
		ur: () => import("./ur-BmxNHE1r.js"),
		uz: () => import("./uz-XB5LlUoi.js"),
		vi: () => import("./vi-Dyd8wFgV.js"),
		zh: () => import("./zh-CUZkDTDj.js"),
		zht: () => import("./zht-DOpXDenF.js")
	})
});
//#endregion
//#region ../gui-plugins/src/details/index.ts
var details_default = define({ i18n: builtinCatalog({
	en: {
		title: "Session details",
		tooltip: "Session details",
		"command.toggle": "Toggle session details",
		noBranch: "No branch",
		"move.title": "Move to worktree",
		"move.menu": "Move session to",
		"move.failed": "Failed to move session",
		"move.running": "The session is running. Try again once it finishes.",
		"move.removeFailed": "Failed to delete worktree",
		"move.recovery.title": "Session not moved",
		"move.recovery.description": "The new worktree {{name}} is ready, but the session is still in its current location.",
		"move.recovery.keep": "Keep worktree",
		"move.recovery.remove": "Delete worktree",
		server: "Extensions",
		mcp: "MCP",
		"mcp.empty": "No MCP servers configured",
		"mcp.manage": "Manage MCP servers",
		plugins: "Plugins",
		"plugins.empty": "No plugins configured",
		skills: "Skills",
		"skills.empty": "No skills configured",
		failed: "Failed",
		retry: "Retry",
		connecting: "Connecting…",
		needsAuth: "Sign in required",
		configure: "Configuration file",
		copyConfigPath: "Copy configuration file path",
		configFileMissing: "No configuration file found",
		timedOut: "The server took too long to respond",
		"setup.mcp": "Add a server with OpenCode",
		"setup.mcp.prompt": "Help me add an MCP server to my global OpenCode config. Ask me which service I want to connect, then set it up and check that it connects.",
		"setup.plugins": "Add a plugin with OpenCode",
		"setup.plugins.prompt": "Help me add a plugin to my global OpenCode config. Ask me what I want it to do, suggest a plugin, then add it.",
		"setup.skills": "New skill with OpenCode",
		"setup.skills.prompt": "Help me write a new OpenCode skill in my global config. Ask me what it should teach you, then write its SKILL.md.",
		loadingChanges: "Loading changes…",
		noChanges: "No changes",
		changesFailed: "Couldn't load changes",
		changesOffline: "Can't reach this server",
		basedOn: "Based on {{branch}}",
		"workspace.local": "Local repository",
		"workspace.existing": "Worktree",
		"workspace.new": "New worktree",
		"mcp.interactiveAuth": "MCP server {{name}} requires an interactive authentication form",
		"mcp.signIn": "Sign in",
		"mcp.signingIn": "Signing in…",
		"mcp.connected": "Connected",
		"mcp.disabled": "Disabled",
		"mcp.error.action": "Details",
		"mcp.error.status": "Connection failed",
		"mcp.error.actionLabel": "Details for {{name}}",
		"mcp.signIn.open": "Sign in to {{name}}",
		"mcp.signIn.description": "Your browser opens so you can sign in to {{name}}. If it can't reach the machine running OpenCode, paste the URL it was redirected to below.",
		"mcp.signIn.waiting": "Waiting for authorization…",
		"mcp.signIn.failed": "Authorization failed: {{error}}",
		"mcp.signIn.expired": "Authorization expired",
		"mcp.signIn.openBrowser": "Open browser",
		"mcp.signIn.syncFailed": "Signed in, but couldn't refresh {{name}}: {{error}}",
		"mcp.error.open": "{{name}} failed, view error",
		"mcp.error.title": "MCP server: {{name}}",
		"mcp.error.copy": "Copy details",
		"mcp.error.copyFailed": "Couldn't copy error details",
		"mcp.error.disable": "Disable",
		"mcp.timedOut": "{{name}} took too long to respond",
		"mcp.error.details": "MCP server: {{name}}\nStatus: failed\nConfiguration: mcp.servers.{{name}}\nError: {{error}}"
	},
	am: () => import("./am-OnhFqN-z.js"),
	ar: () => import("./ar-gViJ1zDK.js"),
	az: () => import("./az-CLo-9zXF.js"),
	bg: () => import("./bg-CFhUujSe.js"),
	bn: () => import("./bn-D1jAkarn.js"),
	br: () => import("./br-BeiMPxMN.js"),
	bs: () => import("./bs-C4Sl9OWB.js"),
	ca: () => import("./ca-CtJnHCEr.js"),
	cs: () => import("./cs-EZ1llWNk.js"),
	da: () => import("./da-DYA4TsiT.js"),
	de: () => import("./de-qUELtTpX.js"),
	dv: () => import("./dv-DKgYIb1C.js"),
	dz: () => import("./dz-DcKnsvTD.js"),
	el: () => import("./el-DYUaFuyf.js"),
	es: () => import("./es-B1gomTTA.js"),
	et: () => import("./et-TpCgT5D0.js"),
	fa: () => import("./fa-BOygEe9O.js"),
	fi: () => import("./fi-B6K1RDyz.js"),
	fo: () => import("./fo-SQ55dkF_.js"),
	fr: () => import("./fr-C7eR6owO.js"),
	he: () => import("./he-DajDbjFs.js"),
	hi: () => import("./hi-o0fsVSvC.js"),
	hr: () => import("./hr-DZlx0BRy.js"),
	hu: () => import("./hu-DTUJBTW3.js"),
	hy: () => import("./hy-mTOWhonV.js"),
	id: () => import("./id-BfBeXGyI.js"),
	is: () => import("./is-CgrhsLfq.js"),
	it: () => import("./it-CcI7S7tk.js"),
	ja: () => import("./ja-DqWTdkbo.js"),
	ka: () => import("./ka-DGNQ7OvP.js"),
	km: () => import("./km-BghHlVHg.js"),
	ko: () => import("./ko-KNpOmF7M.js"),
	lo: () => import("./lo-BLmEbh9Q.js"),
	lt: () => import("./lt-7Aj9SCt6.js"),
	lv: () => import("./lv-DkrhJkja.js"),
	mk: () => import("./mk-DFPD0q6L.js"),
	mn: () => import("./mn-BgxbYCj4.js"),
	ms: () => import("./ms-s4QVhAty.js"),
	my: () => import("./my-CN_pmdPq.js"),
	ne: () => import("./ne-Ugog8fve.js"),
	nl: () => import("./nl-qPd-QX4K.js"),
	no: () => import("./no-v2ofTD_t.js"),
	pa: () => import("./pa-Bx_txUqh.js"),
	pl: () => import("./pl-yyWSIpA1.js"),
	ro: () => import("./ro-Ddgt07km.js"),
	ru: () => import("./ru-ClfSWz_2.js"),
	si: () => import("./si-CgEsc-z1.js"),
	sk: () => import("./sk-CF2eT43w.js"),
	sl: () => import("./sl-BQey_fge.js"),
	sq: () => import("./sq-BNZYWfDc.js"),
	sr: () => import("./sr-D3wKa-ZP.js"),
	sv: () => import("./sv-Q4PolVQX.js"),
	tg: () => import("./tg-C3g3giMm.js"),
	th: () => import("./th-fbmF92x3.js"),
	tk: () => import("./tk-D7a7tewY.js"),
	tr: () => import("./tr-BeWa2FhS.js"),
	uk: () => import("./uk-DP6nRnsM.js"),
	ur: () => import("./ur-DPDlW-Kn.js"),
	uz: () => import("./uz-CCmlni8S.js"),
	vi: () => import("./vi-CqG-7AJ-.js"),
	zh: () => import("./zh-B5zKp5lA.js"),
	zht: () => import("./zht-DDaokEi4.js")
}) });
//#endregion
//#region ../gui-plugins/src/browser/history.ts
/** A page the browser showed, newest first in the history. */
var Visit = Struct({
	url: String$1,
	title: String$1,
	/** The page's icon as a data URL, when it was small enough to keep. */
	icon: optionalKey(String$1)
});
var History = Struct({ visits: ArraySchema(Visit) });
//#endregion
//#region ../gui-plugins/src/browser/index.ts
var browser_default = define({
	stores: { history: Store.global(History, { visits: [] }) },
	i18n: builtinCatalog({
		en: {
			"model.timedOut": "The browser took too long to load",
			"command.open": "Open browser",
			"command.reload": "Reload browser page",
			"command.inspect": "Select an element in the browser page",
			"command.address": "Focus browser address",
			"command.close": "Close browser tab",
			"command.newTab": "New browser tab",
			"tab.title": "Browser",
			"tab.new": "New tab",
			"address.label": "Browser address",
			"address.search": "Search or enter a URL",
			"address.suggestions": "Suggestions",
			"refused.web": "Only web pages can open here.",
			"refused.workspace": "Only web pages and files inside this session's workspace can open here.",
			"refused.credentials": "Addresses with a user name or password can't open here.",
			inspect: "Select an element to comment on",
			"inspect.active": "Click an element in the page to comment on it. Press Escape to cancel.",
			"comment.label": "Comment on this element",
			"comment.placeholder": "Add an optional comment...",
			"comment.cancel": "Cancel element comment",
			"comment.submit": "Add element comment",
			"comment.attach": "Add element",
			"comment.annotation": "Browser annotation",
			"action.stop": "Stop",
			replaced: "Browser control moved to another desktop window.",
			unsupported: "This desktop app does not support the browser pane.",
			suspended: "Browser suspended. Interact with this session to reconnect.",
			"home.title": "Open a page",
			"home.description": "Preview your app, read docs, or browse the web.",
			"home.recent": "Recent",
			"failed.title": "URL can't be reached",
			"failed.description": "Check the URL and your connection, then try again.",
			"action.reload": "Reload",
			"site.info": "Site information",
			"site.secure": "Connection is secure",
			"site.insecure": "Connection is not secure",
			"site.insecure.description": "Don't enter passwords or other private information on this page.",
			"site.local": "Local server",
			"site.local.description": "Local addresses open on the machine that runs the OpenCode server.",
			"site.file": "Workspace file",
			"site.file.description": "Only files inside this session's workspace can open here.",
			"site.network": "Pages load through the network of {{server}}.",
			"site.cookies": "Cookies and site data",
			"site.cookies.count.one": "{{count}} cookie in use",
			"site.cookies.count.other": "{{count}} cookies in use",
			"site.cookies.clear": "Clear",
			"site.permissions": "Permissions are blocked",
			"site.permissions.description": "Camera, microphone, location, and notifications don't work in this browser.",
			"site.agent": "Agent can use this page",
			"site.agent.description": "It can read the page, run scripts, and fill in forms.",
			"page.add": "Add page to session",
			"page.placeholder": "Add context about this page",
			"external.open": "Open in system browser",
			"external.menu": "Open in browser",
			"external.unavailable": "This address only works on the server's machine.",
			options: "Browser options",
			"zoom.in": "Zoom in",
			"zoom.out": "Zoom out",
			"zoom.reset": "Reset zoom",
			"zoom.percent": "{{percent}}%",
			"link.copy": "Copy link",
			"history.clear": "Clear history"
		},
		am: () => import("./am-CcRUNztq.js"),
		ar: () => import("./ar-xSanhlTM.js"),
		az: () => import("./az-DgcsloUI.js"),
		bg: () => import("./bg-FPZ77v6I.js"),
		bn: () => import("./bn-1afzYUpd.js"),
		br: () => import("./br-Bx-0IwU8.js"),
		bs: () => import("./bs-B2vJ0IV_.js"),
		ca: () => import("./ca-7N0ns6We.js"),
		cs: () => import("./cs-nFP2U7wc.js"),
		da: () => import("./da-XZkLEH9o.js"),
		de: () => import("./de-D-7smScF.js"),
		dv: () => import("./dv-Bmjd1mXj.js"),
		dz: () => import("./dz-Cl6t0ktK.js"),
		el: () => import("./el-CIBfhiqW.js"),
		es: () => import("./es-BM2Fo-sf.js"),
		et: () => import("./et-BitX0p14.js"),
		fa: () => import("./fa-DNQpJcjA.js"),
		fi: () => import("./fi-C3JvwrER.js"),
		fo: () => import("./fo-aWFmW11f.js"),
		fr: () => import("./fr-BjFOpsC_.js"),
		he: () => import("./he-DtSiBmYh.js"),
		hi: () => import("./hi-CSJeW26K.js"),
		hr: () => import("./hr-CGNbK6uS.js"),
		hu: () => import("./hu-D4b3CQy5.js"),
		hy: () => import("./hy-Bh8SzRaK.js"),
		id: () => import("./id-C29YOdJf.js"),
		is: () => import("./is-BlCDOpg4.js"),
		it: () => import("./it-Bmzzr7jD.js"),
		ja: () => import("./ja-BBAL_Mm8.js"),
		ka: () => import("./ka-zfRubGyu.js"),
		km: () => import("./km-Crwof1ib.js"),
		ko: () => import("./ko-BPHnGo-R.js"),
		lo: () => import("./lo-CBSAA70D.js"),
		lt: () => import("./lt-CUy7L0Hq.js"),
		lv: () => import("./lv-Ov5ZRvk5.js"),
		mk: () => import("./mk-D864cbkM.js"),
		mn: () => import("./mn-DjYO_WAC.js"),
		ms: () => import("./ms-Oi2pj1m_.js"),
		my: () => import("./my-ClEwW0k5.js"),
		ne: () => import("./ne-DEoyuXsK.js"),
		nl: () => import("./nl-DQBH77NY.js"),
		no: () => import("./no-CObkqTJ9.js"),
		pa: () => import("./pa-D932DAKG.js"),
		pl: () => import("./pl-Bsee4zBg.js"),
		ro: () => import("./ro-nF5UbHB8.js"),
		ru: () => import("./ru-Cf1JmCP6.js"),
		si: () => import("./si-D3QLwRWJ.js"),
		sk: () => import("./sk-bCRiHXha.js"),
		sl: () => import("./sl-iT6SMP0z.js"),
		sq: () => import("./sq-BpqgQirP.js"),
		sr: () => import("./sr-CVhNys-h.js"),
		sv: () => import("./sv-BlZmw0z0.js"),
		tg: () => import("./tg-U1uQtdvq.js"),
		th: () => import("./th-BFeGNGvi.js"),
		tk: () => import("./tk-SDu_FrnM.js"),
		tr: () => import("./tr-DJXmP6m6.js"),
		uk: () => import("./uk-x-TUkppZ.js"),
		ur: () => import("./ur-52mhynza.js"),
		uz: () => import("./uz-c7jpMkg5.js"),
		vi: () => import("./vi-MqU5j8V8.js"),
		zh: () => import("./zh-C4uXQc-E.js"),
		zht: () => import("./zht-BCpXy_ys.js")
	})
});
//#endregion
//#region ../gui-plugins/src/pairing/index.ts
var pairing_default = define({ i18n: { en: {
	"command.title": "Pair device",
	title: "Pairing",
	description: "Connect another device to this machine's OpenCode server.",
	"pair.title": "Pair a device",
	"pair.description": "Connect a phone, tablet, or another computer from anywhere through an end-to-end encrypted tunnel.",
	"pair.open": "Pair device",
	"pair.unavailable": "Pairing is unavailable right now.",
	"dialog.description": "Scan the code with the OpenCode app on another device, or copy the link.",
	"remote.title": "Remote access",
	"remote.description": "Paired devices reach this computer's OpenCode server over the internet. Turning it off disconnects them until you pair them again.",
	"remote.error": "Could not update remote access. Try again.",
	"setup.title": "Setting up remote access…",
	"setup.description": "This can take a minute.",
	"setup.error": "Could not set up remote access.",
	retry: "Try again",
	"screenActive.title": "Keep screen active",
	"screenActive.description": "Prevent this computer’s display from sleeping while OpenCode is running.",
	"screenActive.error": "Could not update the screen activity setting. Try again.",
	qr: "Pairing QR code",
	copyLink: "Copy link",
	"copy.error": "Could not copy pairing details. Try again.",
	error: "Could not update pairing details. Try again.",
	expires: "Expires in {{time}}",
	refresh: "Refresh code"
} } });
//#endregion
//#region ../gui-plugins/src/updater/i18n/en.ts
var en_default$12 = {
	"status.label": "Update",
	"action.checkNow": "Check now",
	"action.checking": "Checking…",
	"action.downloading": "Downloading…",
	"action.installRestart": "Install and restart",
	"action.download": "Download OpenCode",
	"action.installing": "Installing…",
	"action.reload": "Reload to update",
	"action.reloading": "Reloading…",
	"toast.latest.title": "You're up to date",
	"toast.latest.description": "You're running the latest version of OpenCode.",
	"migration.title": "Move from Beta to Stable",
	"migration.description": "For now, OpenCode Beta is moving to OpenCode Stable. Download version {{version}}, then install OpenCode from the disk image to continue receiving updates.",
	"section.title": "Updates",
	"releaseNotes.title": "Release notes",
	"releaseNotes.description": "Show What's New popups after updates",
	"check.title": "Check for updates",
	"check.description": "Manually check for updates and install if available",
	"menu.check": "Check for Updates…",
	"dialog.checkFailed.message": "Update check failed.",
	"dialog.checkFailed.title": "Update Error",
	"dialog.upToDate.message": "You're up to date.",
	"dialog.upToDate.title": "No Updates",
	"dialog.ready.message": "Update {{version}} downloaded. Restart now?",
	"dialog.ready.title": "Update Ready",
	"dialog.restart": "Restart",
	"dialog.later": "Later",
	"web.ready.title": "Update ready",
	"web.ready.message": "A new version of OpenCode is ready. Reload to use it in every open window.",
	"web.reload": "Reload",
	"web.reset.title": "Reload from server",
	"web.reset.description": "Clear the saved copy of the app and load the server's current version",
	"web.reset.action": "Reload from server",
	"releaseNotes.action.getStarted": "Get started",
	"releaseNotes.action.next": "Next",
	"releaseNotes.action.hideFuture": "Don't show these in the future",
	"releaseNotes.media.alt": "Release preview"
};
//#endregion
//#region ../gui-plugins/src/updater/index.ts
var ReleaseNotes = Struct({ enabled: Boolean });
var Seen = Struct({ version: optional(String$1) });
var updater_default = define({
	stores: {
		releaseNotes: BuiltinStore.global(ReleaseNotes, { enabled: true }, {
			key: "settings.v3",
			pick: (value) => {
				const enabled = value?.general?.releaseNotes;
				return enabled === void 0 ? void 0 : { enabled };
			}
		}),
		seen: Store.global(Seen, {}, "highlights.v1")
	},
	i18n: builtinCatalog({
		en: en_default$12,
		am: () => import("./am-EAt3dPfP.js"),
		ar: () => import("./ar-BjrrQs5l.js"),
		az: () => import("./az-BmmcYu7u.js"),
		bg: () => import("./bg-DpoPqTX8.js"),
		bn: () => import("./bn-BkYPhr01.js"),
		br: () => import("./br-BjcDHiOb.js"),
		bs: () => import("./bs-K-ZIluF_.js"),
		ca: () => import("./ca-C6Fvra25.js"),
		cs: () => import("./cs-BCCVscYv.js"),
		da: () => import("./da-Cbai-fMv.js"),
		de: () => import("./de-DakL9-vO.js"),
		dv: () => import("./dv-BtxNMTyP.js"),
		dz: () => import("./dz-FdsRyAvf.js"),
		el: () => import("./el-CKcd6Qsn.js"),
		es: () => import("./es-qKuaky7H.js"),
		et: () => import("./et-CzE_F-RS.js"),
		fa: () => import("./fa-B9DV-CXP.js"),
		fi: () => import("./fi-BBpj2sBo.js"),
		fo: () => import("./fo-DifPj46O.js"),
		fr: () => import("./fr-Ck8ub3Pw.js"),
		he: () => import("./he-QBOEZLKn.js"),
		hi: () => import("./hi-DpdwO5rV.js"),
		hr: () => import("./hr-wWTZbM5b.js"),
		hu: () => import("./hu-DrsFBPNc.js"),
		hy: () => import("./hy-D9TrK5lX.js"),
		id: () => import("./id-CJnWe8KO.js"),
		is: () => import("./is-9e_x4_kF.js"),
		it: () => import("./it-DcWnhsMV.js"),
		ja: () => import("./ja-Dv9C9T_U.js"),
		ka: () => import("./ka-D60ScI1O.js"),
		km: () => import("./km-BZ8_jMei.js"),
		ko: () => import("./ko-B6DFlpa_.js"),
		lo: () => import("./lo-BaoITAAL.js"),
		lt: () => import("./lt-Bayoqdy4.js"),
		lv: () => import("./lv-DpSm_ocL.js"),
		mk: () => import("./mk-B9GKIj_X.js"),
		mn: () => import("./mn-_jVQ7PSH.js"),
		ms: () => import("./ms-CjvJ6jxi.js"),
		my: () => import("./my-vai320cR.js"),
		ne: () => import("./ne-Dw_yk32O.js"),
		nl: () => import("./nl-BNLev-qW.js"),
		no: () => import("./no-ChNdSMLe.js"),
		pa: () => import("./pa-C3h2lLh2.js"),
		pl: () => import("./pl-pGE7Nz-o.js"),
		ro: () => import("./ro-ChAdjUOH.js"),
		ru: () => import("./ru-CdRmgc-_.js"),
		si: () => import("./si-lPGpFTmV.js"),
		sk: () => import("./sk-BXFSXGmq.js"),
		sl: () => import("./sl-B2GydA68.js"),
		sq: () => import("./sq-DPOtdNxn.js"),
		sr: () => import("./sr-DtnIfJKG.js"),
		sv: () => import("./sv-DitO6i7a.js"),
		tg: () => import("./tg-B4MazjGx.js"),
		th: () => import("./th-BKsx1GMh.js"),
		tk: () => import("./tk-ByzcFc1W.js"),
		tr: () => import("./tr-Cl4qeVNl.js"),
		uk: () => import("./uk-BE9ChZ7e.js"),
		ur: () => import("./ur-BtxkVeV2.js"),
		uz: () => import("./uz-D3EWuRzU.js"),
		vi: () => import("./vi-D0-sph5j.js"),
		zh: () => import("./zh-Bbl-C2wA.js"),
		zht: () => import("./zht-BsrDJiZ0.js")
	})
});
//#endregion
//#region ../gui-plugins/src/ssh/index.ts
var ssh_default = define({ i18n: builtinCatalog({
	en: {
		label: "SSH",
		placeholder: "ssh user@example.com",
		add: "Add SSH server",
		"server.menu.label": "SSH server",
		target: "Host or SSH command",
		connect: "Connect",
		connectTo: "Connect to {{host}}",
		authenticate: "SSH authentication",
		"session.disconnected": "SSH connection inactive",
		"session.connecting": "Connecting to SSH server",
		"session.reconnectDescription": "Reconnect to view this session and continue working. Your remote session is preserved.",
		"session.reconnect": "Reconnect",
		trust: "Trust and connect",
		continue: "Continue",
		update: "Update and reconnect",
		project: "Open project on {{host}}",
		"stage.incompatible": "Server update required",
		"error.input": "Enter a host or SSH connection command. Remote commands and unsupported SSH options aren’t allowed.",
		"error.connection": "Could not establish the SSH connection. Check your network and SSH configuration.",
		"error.platform": "This remote platform is not supported. Automatic setup currently requires Linux or macOS on x64 or arm64.",
		"error.version": "The remote service must match this Desktop version before connecting.",
		"error.install": "Could not install the remote server. Check connectivity, disk space, and that tar is installed.",
		"error.unpublished": "This Desktop version has no published remote server. For development builds, install and start V2 on the host, then retry.",
		"error.service": "SSH connected, but the OpenCode server did not become ready.",
		"error.host-key": "The host’s identity could not be verified. Verify its fingerprint before updating your SSH known hosts.",
		"error.ssh-missing": "OpenSSH was not found. Install an OpenSSH client and ensure ssh is available on PATH.",
		"error.unavailable": "SSH is unavailable",
		"action.authenticate": "Authenticate",
		"stage.connecting": "Connecting over SSH…",
		"stage.authentication": "Authentication required",
		"form.name": "Server name (optional)",
		"form.namePlaceholder": "Localhost",
		"form.add": "Add server",
		"menu.delete": "Delete"
	},
	am: () => import("./am-Circ_-Do.js"),
	ar: () => import("./ar-DgpfTolb.js"),
	az: () => import("./az-2g7RyfLx.js"),
	bg: () => import("./bg-Bo-XG111.js"),
	bn: () => import("./bn-CyQhe3qx.js"),
	br: () => import("./br-B1EwepLy.js"),
	bs: () => import("./bs-Cyft-UCG.js"),
	ca: () => import("./ca-HlWI5gYR.js"),
	cs: () => import("./cs-CzLzpEwK.js"),
	da: () => import("./da-TnkOXUEr.js"),
	de: () => import("./de-BsuT0Q8u.js"),
	dv: () => import("./dv-TA82xoP1.js"),
	dz: () => import("./dz-BuvrN4AR.js"),
	el: () => import("./el-DeBiADHI.js"),
	es: () => import("./es-BC0ki1R4.js"),
	et: () => import("./et-4mKCMKUu.js"),
	fa: () => import("./fa-ChmLPgpo.js"),
	fi: () => import("./fi-BgF-LIVZ.js"),
	fo: () => import("./fo-CQcTzoX7.js"),
	fr: () => import("./fr-vDifkc-B.js"),
	he: () => import("./he-RgG2XIpM.js"),
	hi: () => import("./hi-DBvq0BJC.js"),
	hr: () => import("./hr-DWe97jyg.js"),
	hu: () => import("./hu-B3sQ6iNg.js"),
	hy: () => import("./hy-C0zYDSw0.js"),
	id: () => import("./id-DkIQ5t4B.js"),
	is: () => import("./is-OI49Y3q6.js"),
	it: () => import("./it-DcVE0txp.js"),
	ja: () => import("./ja-CsW_I2ds.js"),
	ka: () => import("./ka-BsoJh3jg.js"),
	km: () => import("./km-BqMzwNzp.js"),
	ko: () => import("./ko-QJRS9rmc.js"),
	lo: () => import("./lo-CjO2PUWr.js"),
	lt: () => import("./lt-CmOWQ4Sv.js"),
	lv: () => import("./lv-CFg-coUu.js"),
	mk: () => import("./mk-Tt7gaSfb.js"),
	mn: () => import("./mn-Dwj7vzDb.js"),
	ms: () => import("./ms-CuwJ4MoO.js"),
	my: () => import("./my-DzU8EikK.js"),
	ne: () => import("./ne-DrbuA-P7.js"),
	nl: () => import("./nl-CdzXSuzf.js"),
	no: () => import("./no-B3yWS_xX.js"),
	pa: () => import("./pa-DsLwu1RN.js"),
	pl: () => import("./pl-C0sIA7tn.js"),
	ro: () => import("./ro-D72_p2fw.js"),
	ru: () => import("./ru-CeRonUTh.js"),
	si: () => import("./si-BuOa9EJN.js"),
	sk: () => import("./sk-Ccp8GzRT.js"),
	sl: () => import("./sl-DPA_6JE0.js"),
	sq: () => import("./sq-_tgURw1P.js"),
	sr: () => import("./sr-NGC3ZLP2.js"),
	sv: () => import("./sv-B5gW-b-0.js"),
	tg: () => import("./tg-BMHa00Qc.js"),
	th: () => import("./th-DVGpiqyE.js"),
	tk: () => import("./tk-B7gMQr-I.js"),
	tr: () => import("./tr-oHd4IgfO.js"),
	uk: () => import("./uk-qEMmKWQ8.js"),
	ur: () => import("./ur-CACoceVO.js"),
	uz: () => import("./uz-B9PA7oHw.js"),
	vi: () => import("./vi-CzFdVZM7.js"),
	zh: () => import("./zh-D68TNHxL.js"),
	zht: () => import("./zht-a5bUiMMC.js")
}) });
//#endregion
//#region ../gui-plugins/src/wsl/index.ts
var wsl_default = define({
	os: ["windows"],
	i18n: builtinCatalog({
		en: {
			"server.add": "Add WSL server",
			"server.label": "WSL",
			"server.menu.label": "WSL server",
			"server.retryStart": "Retry start",
			"server.updating": "Updating…",
			"onboarding.restartRequired": "Windows needs a restart to finish installing WSL.",
			"onboarding.distroNotInstalled": "{{distro}} is not installed yet.",
			"onboarding.openDistroOnce": "Open {{distro}} once to finish setup.",
			"onboarding.updatingOpencode": "Updating OpenCode…",
			"onboarding.updateOpencode": "Update OpenCode",
			"onboarding.installOpencode": "Install OpenCode",
			"onboarding.installedDistros": "Installed distros",
			"onboarding.checkAgain": "Check again",
			"onboarding.distroStatus.ready": "Ready",
			"onboarding.distroStatus.checking": "Checking…",
			"onboarding.distroStatus.opencodeMissing": "OpenCode not installed",
			"onboarding.distroStatus.missingTools": "Missing bash, curl",
			"onboarding.distroStatus.unsupported": "Unsupported · Use WSL 2",
			"onboarding.needAnotherDistro": "Need another distro?",
			"onboarding.needAnotherDistroHint": "Install a Linux distribution from the WSL catalog",
			"onboarding.wslNotInstalled.title": "WSL not installed",
			"onboarding.wslNotInstalled.description": "WSL (Windows Subsystem for Linux) is required before OpenCode can add a WSL server",
			"onboarding.wslUnavailable.title": "WSL unavailable",
			"onboarding.wslUnavailable.description": "OpenCode could not verify WSL on this machine.",
			"onboarding.installWsl": "Install WSL",
			"onboarding.windowsRestartRequired": "Restart Windows to finish installing WSL, then reopen OpenCode.",
			"onboarding.allDistrosAdded": "All installed distros are already added.",
			"onboarding.noDistros": "No distros detected yet.",
			"onboarding.installDistro": "Install distro",
			"onboarding.searchDistros": "Search distros",
			"onboarding.adding": "Adding…",
			"error.unavailable": "WSL is unavailable",
			"error.listInstalled": "Failed to list installed WSL distros",
			"error.listOnline": "Failed to list online WSL distros",
			"error.executeDistro": "Cannot execute commands in distro",
			"error.installWsl": "WSL installation failed",
			"error.installDistro": "Failed to install distro: {{distro}}",
			"error.installOpencode": "OpenCode installation failed",
			"error.alreadyAdded": "{{distro}} is already added",
			"error.busy": "{{distro}} is busy with another task. Try again when it finishes.",
			"error.opencodeMissing": "opencode is not installed in this distro",
			"error.opencodeCannotRun": "opencode is installed but could not run",
			"error.opencodeNotInstalled": "OpenCode is not installed in {{distro}}",
			"error.updateVersion": "OpenCode update finished but {{distro}} still reports {{installed}}; expected {{expected}}",
			"error.noVersion": "no version",
			"error.serverExited": "WSL server exited after startup (code={{code}} signal={{signal}})",
			"error.serverExitedBeforeHealthy": "WSL server exited before becoming healthy (code={{code}} signal={{signal}}){{output}}",
			"error.healthTimeout": "Sidecar for {{distro}} health check timed out after {{timeout}}ms",
			"error.commandTimeout": "{{command}} {{args}} timed out after {{timeout}}ms",
			"error.failedPort": "Failed to get port",
			"menu.remove": "Remove"
		},
		am: () => import("./am-CU4lCuPJ.js"),
		ar: () => import("./ar-BwT-6ejl.js"),
		az: () => import("./az-CuZ8nfDO.js"),
		bg: () => import("./bg-DMumY0Gg.js"),
		bn: () => import("./bn-D7V5lxe7.js"),
		br: () => import("./br-DUam0jtH.js"),
		bs: () => import("./bs-BgK3HmJN.js"),
		ca: () => import("./ca-Cvk9B7ma.js"),
		cs: () => import("./cs-CODFA4iW.js"),
		da: () => import("./da-CK75J-ol.js"),
		de: () => import("./de-DXV_IKTP.js"),
		dv: () => import("./dv-B1wH5-IZ.js"),
		dz: () => import("./dz-B1eCdeZs.js"),
		el: () => import("./el-DJai71sp.js"),
		es: () => import("./es-C88kTRst.js"),
		et: () => import("./et-3Ip3xqNQ.js"),
		fa: () => import("./fa-DwVAUxds.js"),
		fi: () => import("./fi-Cq-1I2vU.js"),
		fo: () => import("./fo-Di2oHjsS.js"),
		fr: () => import("./fr-6AlkcFqt.js"),
		he: () => import("./he-Dxeat5v2.js"),
		hi: () => import("./hi-CsgsK4wP.js"),
		hr: () => import("./hr-BrJkTEjq.js"),
		hu: () => import("./hu-CCKR-AyS.js"),
		hy: () => import("./hy-BBkUwV8Y.js"),
		id: () => import("./id-B8JeRi8e.js"),
		is: () => import("./is-DrCbA8Rx.js"),
		it: () => import("./it-BF8gVQ3W.js"),
		ja: () => import("./ja-C49kzAFw.js"),
		ka: () => import("./ka-DZ1DaHEi.js"),
		km: () => import("./km-BKY1arUD.js"),
		ko: () => import("./ko-iUx9aV6R.js"),
		lo: () => import("./lo-mrAHGrRH.js"),
		lt: () => import("./lt-DsCGT0Oz.js"),
		lv: () => import("./lv-Chifo70z.js"),
		mk: () => import("./mk-B5iLWhT9.js"),
		mn: () => import("./mn-bMVRisU_.js"),
		ms: () => import("./ms-CBTLSJHW.js"),
		my: () => import("./my-CY3EddPn.js"),
		ne: () => import("./ne-7_5u0Fah.js"),
		nl: () => import("./nl-BIWFqbng.js"),
		no: () => import("./no-D_y8EdOT.js"),
		pa: () => import("./pa-BN-6Bz2f.js"),
		pl: () => import("./pl-CkTdPi3S.js"),
		ro: () => import("./ro-Dsgk91Pd.js"),
		ru: () => import("./ru-BHvh9KZ9.js"),
		si: () => import("./si-BDXCG9cO.js"),
		sk: () => import("./sk-COkB4WO9.js"),
		sl: () => import("./sl-DURgKdw6.js"),
		sq: () => import("./sq-Dmb1Qe6m.js"),
		sr: () => import("./sr-DpThE4Px.js"),
		sv: () => import("./sv-BD2JTLC-.js"),
		tg: () => import("./tg-ImaQhS6n.js"),
		th: () => import("./th-BWeM1Dsg.js"),
		tk: () => import("./tk-BaGhvutM.js"),
		tr: () => import("./tr-C-UItICX.js"),
		uk: () => import("./uk-B-CYuGWp.js"),
		ur: () => import("./ur-D0lqFtqv.js"),
		uz: () => import("./uz-BIx8WbnR.js"),
		vi: () => import("./vi-C6bwnwYA.js"),
		zh: () => import("./zh-nGxFp_eJ.js"),
		zht: () => import("./zht-C3s_7RUq.js")
	})
});
//#endregion
//#region ../gui-plugins/src/microsoft-office/index.ts
/** Read-only previews of Word, Excel and PowerPoint files in the file view. */
var microsoft_office_default = define({ i18n: { en: {
	"pages.one": "{{count}} page",
	"pages.other": "{{count}} pages",
	"slides.one": "{{count}} slide",
	"slides.other": "{{count}} slides",
	"sheets.one": "{{count}} sheet",
	"sheets.other": "{{count}} sheets",
	page: "Page {{number}}",
	slide: "Slide {{number}}",
	hiddenSlide: "Hidden slide",
	slideFailed: "This slide could not be shown",
	speakerNotes: "Speaker notes",
	"document.pageFailed": "This page could not be shown",
	"document.layoutFailed": "The rest of this document could not be laid out",
	"sheet.copyTooLarge": "The selection is too large to copy",
	"sheet.copyFailed": "The cells could not be copied",
	"sheet.openFailed": "This sheet could not be opened",
	"sheet.paintFailed": "This part of the sheet could not be shown",
	"sheet.tabs": "Sheets",
	"problem.compound": "This file is password-protected or saved in an older Office format.",
	"problem.format": "This file is not a valid Office document."
} } });
//#endregion
//#region ../gui-plugins/src/sources/index.ts
var sources_default = define({ i18n: { en: { "tab.count": "Sources · {{count}}" } } });
//#endregion
//#region ../gui-plugins/src/goal/index.ts
var goal_default = define({ i18n: { en: {
	title: "Goal",
	paused: "Goal paused",
	met: "Goal met",
	pause: "Pause",
	resume: "Resume",
	clear: "Clear"
} } });
//#endregion
//#region ../gui-plugins/src/local-models/index.ts
var local_models_default = define({ i18n: builtinCatalog({
	en: {
		title: "Offline models",
		description: "AI models that run without the internet (Ollama). Download them, remove them, and keep a second copy.",
		"command.title": "Open offline models",
		"command.group": "Models",
		"engine.title": "Engine (Ollama)",
		"engine.checking": "Checking…",
		"engine.running": "Running (version {{version}})",
		"engine.stopped": "Installed, not running",
		"engine.starting": "Starting…",
		"engine.missing": "The engine is not on this PC",
		"engine.installing": "Downloading the engine… {{done}} / {{total}}",
		"engine.failed": "Something went wrong: {{message}}",
		"engine.start": "Start",
		"engine.install": "Download the engine here (about 1.5 GB)",
		"engine.cannotInstall": "On this system the engine is installed from ollama.com.",
		"engine.refresh": "Check again",
		"engine.folder": "Models folder: {{folder}}",
		"engine.free": "Free space: {{free}}",
		"engine.unavailable": "This page works only in the desktop app.",
		"get.title": "Download a model",
		"get.name": "Model name",
		"get.placeholder": "e.g.  qwen2.5:7b",
		"get.download": "Download",
		"get.library": "See every model (website)",
		"get.hint": "Type any name from ollama.com/library. A few picked models are listed below.",
		"get.installed": "Installed",
		"get.queued": "Queued",
		"get.heavy": "Heavy for this laptop",
		"get.size": "about {{size}}",
		"use.qwen2.5:7b": "Coding and tool use (a good fit for this app)",
		"use.qwen2.5-coder:7b": "Writing and explaining code only",
		"use.qwen2.5-coder:1.5b": "Very light and fast, for small jobs",
		"use.qwen3:8b": "A newer general model that reasons before answering",
		"use.llama3.2:3b": "Light general chat",
		"use.gemma3:4b": "Light, and it understands pictures",
		"use.deepseek-r1:8b": "Questions that need reasoning",
		"use.phi4-mini": "Small, fast, low memory",
		"use.mistral:7b": "An older, dependable general model",
		"use.nomic-embed-text": "Search / embeddings (not chat)",
		"use.qwen2.5-coder:14b": "Smarter coding, but heavy",
		"use.gpt-oss:20b": "A large open model that needs a lot of memory",
		"downloads.title": "Downloads",
		"downloads.queued": "Queued",
		"downloads.downloading": "{{percent}}%  ·  {{done}} / {{total}}  ·  {{speed}}/s  ·  {{left}} left",
		"downloads.paused": "Paused at {{percent}}%  ·  {{done}} / {{total}}",
		"downloads.pause": "Pause",
		"downloads.resume": "Resume",
		"downloads.keep": "Keep downloading",
		"downloads.cancelConfirm": "Cancel the download of {{name}}? The {{done}} downloaded so far will be deleted.",
		"pill.downloading": "{{name}} {{percent}}%",
		"pill.paused": "{{name}} paused {{percent}}%",
		"pill.title": "Model download: open to pause or cancel",
		"downloads.starting": "Starting…",
		"downloads.retrying": "It stalled; continuing from where it stopped (try {{attempt}}): {{error}}",
		"downloads.finishing": "Verifying…",
		"downloads.done": "Done",
		"downloads.failed": "Failed: {{error}}",
		"downloads.cancelled": "Cancelled",
		"downloads.cancel": "Cancel",
		"downloads.dismiss": "Dismiss",
		"downloads.retry": "Retry",
		"left.unknown": "?",
		"left.hours": "{{hours}} h {{minutes}} min",
		"left.minutes": "{{minutes}} min",
		"left.seconds": "{{seconds}} s",
		"installed.title": "Models on this PC",
		"installed.empty": "No models yet.",
		"installed.delete": "Remove",
		"installed.deleteConfirm": "Remove {{name}} from this PC? ({{size}} will be freed)",
		"installed.copy": "Make a copy",
		"installed.copied": "Copied",
		"copy.title": "Cloud-SSD and second copy",
		"cloud.title": "Cloud-SSD",
		"cloud.off": "Connect once. After that every model you download is kept on Cloud-SSD and taken off this laptop, until you disconnect.",
		"cloud.connect": "Connect Cloud-SSD",
		"cloud.on": "Cloud-SSD is connected",
		"cloud.folder": "Models are kept in {{folder}}",
		"cloud.missing": "The Cloud-SSD drive is not there right now. Open the Cloud-SSD app; nothing is lost.",
		"cloud.disconnect": "Disconnect",
		"cloud.free": "Take models off this laptop",
		"cloud.free.description": "Once a model is fully on Cloud-SSD it is removed from this laptop. To chat with it, bring it back with one press.",
		"cloud.all": "Send every model to Cloud-SSD now",
		"cloud.all.button": "Send all now",
		"cloud.restorable": "On Cloud-SSD, not on this laptop",
		"cloud.restore": "Bring to this laptop",
		"copy.folder": "Copy folder",
		"copy.folder.none": "No folder chosen yet",
		"copy.choose": "Choose folder",
		"copy.clear": "Clear",
		"copy.auto": "Copy every new download there too",
		"copy.auto.description": "A model lands on this PC first (it must be here to run offline); then a copy goes to that folder.",
		"copy.all": "Copy all now",
		"copy.busy": "Copying: {{name}}  ·  {{done}} / {{total}}",
		"copy.error": "Copy problem: {{message}}",
		"copy.restorable": "In the copy folder, not on this PC",
		"copy.restore": "Bring back",
		"error.action": "That did not work: {{message}}"
	},
	hi: () => import("./hi-DZUPs9UH.js")
}) });
//#endregion
//#region ../gui-plugins/src/router/index.ts
var router_default = define({ i18n: builtinCatalog({
	en: {
		title: "Router",
		description: "Every AI provider in one place. The router (OmniRoute) starts with the app; when one model is down it moves to another.",
		"command.title": "Open router",
		"command.group": "Models",
		"status.title": "Router (OmniRoute)",
		"status.checking": "Checking…",
		"status.running": "Running",
		"status.stopped": "Installed, not running",
		"status.starting": "Starting…",
		"status.installing": "Installing (with npm)…",
		"status.missing": "The router is not on this PC",
		"status.failed": "Something went wrong: {{message}}",
		"status.address": "Address: {{url}} (this PC only)",
		"status.start": "Start",
		"status.install": "Install the router",
		"status.refresh": "Check again",
		"status.dashboard": "Open dashboard",
		"status.unavailable": "This page works only in the desktop app.",
		"key.title": "The router's own key",
		"key.description": "The router asks for its own key on every request. Copy it from Dashboard > API Keys and paste it here. It is stored encrypted on this PC.",
		"key.label": "Router key",
		"key.save": "Save",
		"key.env": "The key came from the Windows variable OMNIROUTE_API_KEY.",
		"key.saved": "The key is saved.",
		"key.forget": "Forget key",
		"key.opencode": "The same key was given to the app.",
		"key.opencodeFailed": "The key is saved, but giving it to the app failed: {{message}}",
		"add.title": "Add a provider",
		"add.hint": "1. Press \"Get key\"; the website opens.  2. Make a key there and copy it.  3. Paste it here and press \"Connect\".",
		"add.getKey": "Get key",
		"add.label": "{{name}} key",
		"add.placeholder": "Paste the key here",
		"add.connect": "Connect",
		"add.free": "Free tier",
		"add.connected": "Connected",
		"add.done": "{{name}} is connected. Its models now appear in the model list.",
		"add.failed": "{{name}} was not connected: {{message}}",
		"add.needRouter": "The router must be running first.",
		"add.needKey": "Enter the router's own key above first.",
		"note.gemini": "Google's models; a free allowance every day",
		"note.groq": "Very fast answers; free tier",
		"note.openrouter": "One key for many models; some are free",
		"note.cerebras": "Fast open models; free tier",
		"note.mistral": "Mistral / Codestral; free tier",
		"note.nvidia": "Many open models; free credits",
		"note.deepseek": "A low-cost coding model",
		"note.openai": "GPT models (paid)",
		"note.anthropic": "Claude models (paid)",
		"note.xai": "Grok models (paid)",
		"connections.title": "Connected providers",
		"connections.empty": "No provider is connected yet.",
		"connections.ok": "OK",
		"connections.off": "Off",
		"connections.remove": "Remove",
		"connections.removeConfirm": "Remove {{name}} from the router?",
		"error.action": "That did not work: {{message}}"
	},
	hi: () => import("./hi-CZS5R2Sz.js")
}) });
//#endregion
//#region ../gui-plugins/src/plugin-store/index.ts
var plugin_store_default = define({ i18n: builtinCatalog({
	en: {
		title: "Plugins",
		description: "Give the AI new tools and skills with one press. What you add works from the next chat.",
		"command.title": "Open plugins",
		"command.group": "Plugins",
		unavailable: "This page works only in the desktop app.",
		problem: "The settings file could not be read: {{message}}",
		file: "Settings file: {{file}}",
		"search": "Search plugins",
		"search.placeholder": "Search: docs, database, deploy, design…",
		"category.all": "All",
		"category.code": "Code & docs",
		"category.browser": "Browser & testing",
		"category.design": "Design",
		"category.search": "Search & knowledge",
		"category.data": "Databases",
		"category.deploy": "Deploy & cloud",
		"category.work": "Productivity",
		"category.think": "Thinking & memory",
		"category.skills": "Skill packs",
		"item.context7": "Up-to-date library docs straight to the AI: less outdated or wrong code.",
		"item.playwright": "The AI opens a browser itself to run and test a website.",
		"item.chrome-devtools": "Console errors, network and speed checks in real Chrome.",
		"item.github": "Work on issues, pull requests and repositories.",
		"item.figma": "Design to code and code to design with Figma.",
		"item.sequential-thinking": "A tool for working through a hard question step by step.",
		"item.memory": "Lets the AI remember things (in a small file on this PC).",
		"item.figma-plugin": "Figma's official skills: design to code, libraries, diagrams, slides.",
		"item.superpowers": "A whole way of working: brainstorm, plan, test first, root-cause debugging, review.",
		"item.anthropic-skills": "Anthropic's skill pack: Word, PDF, Excel and PowerPoint files, front-end design, testing web apps.",
		"item.deepwiki": "Ask about any public GitHub repository and get answers from its docs and code.",
		"item.svelte": "Official Svelte and SvelteKit docs and a code checker for the AI.",
		"item.sentry": "Read your app's errors and crashes from Sentry and fix them.",
		"item.semgrep": "Scan code for security problems.",
		"item.canva": "Make and edit Canva designs.",
		"item.exa": "Search the web and read pages for fresh information.",
		"item.microsoft-learn": "Official Microsoft docs: .NET, Azure, Windows, Office, TypeScript.",
		"item.huggingface": "Find AI models, datasets and demos on Hugging Face.",
		"item.supabase": "Create and manage Supabase databases, tables and auth.",
		"item.neon": "Create and query Neon Postgres databases.",
		"item.vercel": "Deploy websites to Vercel and read their logs.",
		"item.netlify": "Deploy websites to Netlify and manage them.",
		"item.cloudflare": "Work with Cloudflare Workers, KV, R2 and D1.",
		"item.cloudflare-docs": "Official Cloudflare docs for the AI.",
		"item.aws-knowledge": "Official AWS docs and best practices.",
		"item.notion": "Read and write your Notion pages and databases.",
		"item.linear": "Read and update Linear issues and projects.",
		"item.atlassian": "Work with Jira issues and Confluence pages.",
		"status.connected": "Connected",
		"status.needs_auth": "Sign-in needed",
		"status.failed": "Failed: {{error}}",
		"status.pending": "Starting…",
		"status.disabled": "Turned off",
		"status.missing": "Starting… (the first time can take a minute)",
		"status.token.missing": "Needs a token (below)",
		"status.token.rejected": "The token is wrong or has expired. Make a new one (below).",
		signInAction: "Sign in",
		add: "Add",
		remove: "Remove",
		added: "Added",
		more: "Learn more",
		signIn: "Sign-in needed",
		needsToken: "Needs a token",
		"token.title": "{{name}} token",
		"token.missing": "{{name}} does not allow sign-in from this app. Press Get token, make the token on the website, copy it, paste it here and press Save.",
		"token.ready": "A token is saved on this PC. To change it, paste a new one and press Save.",
		"token.get": "Get token",
		"token.placeholder": "Paste the token",
		"token.save": "Save",
		"token.clear": "Clear",
		"token.saved": "{{name}} token saved. It connects in a few seconds.",
		"token.cleared": "{{name}} token cleared.",
		"done.add": "{{name}} was added. It shows up in the next chat.",
		"done.remove": "{{name}} was removed.",
		"done.token": "{{name}} was added. Now give it a token in the row below.",
		"done.signIn": "{{name}} was added. Now sign in under Settings > Extensions > MCPs.",
		failed: "{{name}}: that did not work. {{message}}",
		reloadFailed: "It was added, but telling the app failed. It will show after the app is opened again."
	},
	hi: () => import("./hi-DFSL3XNe.js")
}) });
//#endregion
//#region ../gui-plugins/src/customize/index.ts
var customize_default = define({ i18n: builtinCatalog({
	en: {
		title: "Customize",
		description: "Make the AI work your way: your own skills, connectors, agents, commands, standing instructions and hooks. What you save here is used from your next message.",
		"command.title": "Open Customize",
		"command.group": "Customize",
		unavailable: "This page works only in the desktop app.",
		problem: "Something here could not be read: {{message}}",
		failed: "That did not work: {{message}}",
		folder: "Everything on this page is stored in: {{folder}}",
		"tab.skill": "Skills",
		"tab.connector": "Connectors",
		"tab.agent": "Agents",
		"tab.command": "Commands",
		"tab.instructions": "Instructions",
		"tab.hook": "Hooks",
		"tab.memory": "Memory",
		"memory.title": "Memory",
		"memory.row": "Things the AI remembers about you",
		"memory.help": "Every chat sees these. Add one here, or tell the AI \"remember that ...\" in a chat and it saves it itself. Tell it \"forget ...\" to remove one.",
		"memory.placeholder": "e.g. I talk in Hinglish and want short answers",
		"memory.add": "Add",
		"memory.added": "Saved to memory.",
		"memory.removed": "Removed from memory.",
		"memory.clear": "Clear all",
		"memory.clearConfirm": "Forget everything in memory?",
		"memory.cleared": "Memory cleared.",
		"memory.empty": "Nothing saved yet.",
		"memory.file": "Saved in {{file}}",
		"tab.plugins": "Plugins",
		"status.active": "Active",
		"status.waiting": "Saved; loading…",
		"status.unknown": "Saved",
		new: "New",
		edit: "Edit",
		delete: "Delete",
		save: "Save",
		cancel: "Cancel",
		saved: "{{name}} saved.",
		deleted: "{{name}} deleted.",
		deleteConfirm: "Delete {{name}}? This cannot be undone.",
		noDescription: "No description",
		othersTitle: "Already in the app",
		"field.name": "Name",
		"field.nameHint": "Small letters, digits and dashes, such as my-notes.",
		"field.nameSaved": "Saved as: {{name}}",
		"field.nameCommand": "You will type: /{{name}}",
		"skill.mine": "Your skills",
		"skill.new": "New skill",
		"skill.edit": "Edit skill",
		"skill.help": "A skill is a set of steps the AI follows for one kind of task. It reads the skill when your request matches the \"when to use\" line.",
		"skill.others": "Other skills in the app ({{count}})",
		"skill.namePlaceholder": "release-notes",
		"skill.description": "When to use it",
		"skill.descriptionPlaceholder": "Use when the user asks for release notes or a changelog.",
		"skill.body": "What the AI should do",
		"skill.bodyPlaceholder": "1. Read the recent commits.\n2. Write one short line per change.\n3. Group them under Added, Fixed, Changed.",
		"skill.auto": "The AI may use it by itself",
		"skill.autoHelp": "Off: it is used only when you name the skill in your message.",
		"command.mine": "Your commands",
		"command.new": "New command",
		"command.edit": "Edit command",
		"command.help": "A command is a prompt you send by typing / and its name. Write $ARGUMENTS where the words you type after the name should go.",
		"command.others": "Other commands in the app ({{count}})",
		"command.namePlaceholder": "explain",
		"command.description": "What it does (shown in the / list)",
		"command.descriptionPlaceholder": "Explain a file in simple words",
		"command.body": "The prompt that is sent",
		"command.bodyPlaceholder": "Explain $ARGUMENTS in simple words. Start with what it is for, then how it works.",
		"agent.mine": "Your agents",
		"agent.new": "New agent",
		"agent.edit": "Edit agent",
		"agent.help": "An agent is a helper with its own instructions. The main AI hands it a piece of work and gets a summary back, or you pick it in the chat box.",
		"agent.others": "Other agents in the app ({{count}})",
		"agent.namePlaceholder": "code-reviewer",
		"agent.description": "When to hand work to it",
		"agent.descriptionPlaceholder": "Reviews changed code for bugs and unclear names. Use after writing code.",
		"agent.body": "Its instructions",
		"agent.bodyPlaceholder": "You review code. Read the changed files, list real bugs first, then unclear names. Say the file and line for each. Do not change any file.",
		"agent.mode": "Who starts it",
		"agent.mode.subagent": "The AI",
		"agent.mode.primary": "Me",
		"agent.mode.all": "Both",
		"agent.mode.subagent.help": "The main AI hands work to it when the task fits.",
		"agent.mode.primary.help": "You pick it in the chat box and talk to it directly.",
		"agent.mode.all.help": "The main AI can hand work to it, and you can also pick it in the chat box.",
		"instructions.title": "Standing instructions",
		"instructions.row": "Rules the AI follows in every chat",
		"instructions.help": "For things that are always true: how you like answers, what never to do, how your projects are set up.",
		"instructions.placeholder": "- Reply in simple Hinglish.\n- Ask before deleting any file.\n- Use pnpm, not npm.",
		"instructions.file": "Saved in: {{file}}",
		"instructions.saved": "Instructions saved.",
		"instructions.cleared": "Instructions cleared.",
		"style.title": "Response style",
		"style.row": "How the AI answers",
		"style.apply": "Apply",
		"style.saved": "Response style: {{name}}",
		"style.custom": "Your own style",
		"style.customPlaceholder": "Answer like a patient teacher. Use an example for every idea.",
		"style.normal": "Normal",
		"style.short": "Short",
		"style.explain": "Explain while working",
		"style.learn": "Teach me",
		"style.hinglish": "Simple Hinglish",
		"style.normal.help": "The app's usual way of answering. Nothing is added.",
		"style.short.help": "Short answers that start with the result.",
		"style.explain.help": "The AI says why it chose each approach as it works.",
		"style.learn.help": "The AI does the work and teaches the ideas behind it in plain words.",
		"style.hinglish.help": "Answers in simple Hinglish; code and commands stay in English.",
		"style.custom.help": "Write your own: a role, a tone or a format.",
		"connector.mine": "Connectors (tool servers)",
		"connector.new": "New connector",
		"connector.help": "A connector (MCP server) gives the AI new tools: a web address someone gives you, or a program that runs on this PC.",
		"connector.ready": "Ready-made ones",
		"connector.add": "Add",
		"connector.saved": "{{name}} was added. It connects in a moment.",
		"connector.namePlaceholder": "my-tools",
		"connector.type": "Kind",
		"connector.type.remote": "Web address",
		"connector.type.local": "Program on this PC",
		"connector.type.remote.help": "A server on the internet, reached by its address.",
		"connector.type.local.help": "A command that starts the server on this PC, such as one that begins with npx.",
		"connector.target.remote": "Address",
		"connector.target.local": "Command",
		"connector.target.remote.placeholder": "https://example.com/mcp",
		"connector.target.local.placeholder": "npx -y @modelcontextprotocol/server-everything",
		"connector.signIn": "Sign in",
		"connector.deleteConfirm": "Remove the connector {{name}}?",
		"connector.status.connected": "Connected",
		"connector.status.needs_auth": "Sign-in needed",
		"connector.status.failed": "Failed: {{error}}",
		"connector.status.pending": "Starting…",
		"connector.status.disabled": "Turned off",
		"connector.status.token": "Needs a token (on the Plugins page)",
		"connector.status.missing": "Starting… (the first time can take a minute)",
		"hook.mine": "Hooks",
		"hook.new": "New hook",
		"hook.edit": "Edit hook",
		"hook.help": "A hook is a command that runs by itself at a set moment, every time, without the AI deciding. Use it for checks that must always happen.",
		"hook.namePlaceholder": "Format after edits",
		"hook.event": "When",
		"hook.event.before-tool": "Before a tool",
		"hook.event.after-tool": "After a tool",
		"hook.event.finished": "When the AI finishes",
		"hook.event.before-tool.help": "Runs first. If the command fails, the tool is stopped and the AI is told why.",
		"hook.event.after-tool.help": "Runs after the tool. What the command prints is shown to the AI.",
		"hook.event.finished.help": "Runs when the AI has finished its answer.",
		"hook.tools": "Which tools",
		"hook.toolsHint": "Tool names with commas between them, or * for every tool. File changes: edit,write,patch. Commands: shell.",
		"hook.command": "Command to run",
		"hook.commandPlaceholder": "npx prettier --write \"%APNA_FILE%\"",
		"hook.commandHint": "Runs in the project folder. It can read %APNA_TOOL% (the tool), %APNA_FILE% (the file, when there is one) and %APNA_INPUT% (the tool's input).",
		"hook.enabled": "{{name}} is on",
		"plugins.title": "Plugins",
		"plugins.row": "Ready-made tools and skill packs",
		"plugins.help": "Context7, Playwright, GitHub, Figma, Memory, Superpowers and more: add each with one press.",
		"plugins.open": "Open Plugins"
	},
	hi: () => import("./hi-ZSlbYhBA.js")
}) });
//#endregion
//#region ../gui-plugins/src/cloud-projects/index.ts
var cloud_projects_default = define({ i18n: builtinCatalog({
	en: {
		title: "Cloud-SSD projects",
		description: "Keep your coding projects on Cloud-SSD. They run from this laptop at full speed, and Cloud-SSD copies them to your cloud by itself.",
		"command.title": "Open Cloud-SSD projects",
		"command.new": "New project on Cloud-SSD",
		"command.group": "Projects",
		unavailable: "This page works only in the desktop app.",
		"place.title": "Where the projects are kept",
		"place.missing": "Cloud-SSD's fast drive was not found. Open the Cloud-SSD app and switch the fast drive on.",
		"place.uploaded": "{{folder}}  ·  Last copied to the cloud: {{time}}",
		"place.never": "{{folder}}  ·  Not copied to the cloud yet",
		"place.refresh": "Check again",
		"place.note": "Cloud-SSD copies the folder to your cloud about 20 seconds after work in it stops. A copy also stays on this laptop: a project must be here to run. Folders a project builds again, such as node_modules and dist, stay off the cloud. Files you delete or rename here are deleted or renamed in the cloud too (deleted ones wait 30 days in Google's trash).",
		"new.title": "New project",
		"new.description": "Makes an empty folder on Cloud-SSD and opens a new chat in it.",
		"new.label": "Project name",
		"new.placeholder": "e.g.  my-website",
		"new.create": "Create and open",
		"list.title": "Projects on Cloud-SSD",
		"list.empty": "No projects yet.",
		"list.open": "Open",
		"bring.title": "Bring a folder you already have",
		"bring.description": "Copies a folder from this laptop to Cloud-SSD and opens it. Your original stays where it is. node_modules and build folders are left behind.",
		"bring.choose": "Choose folder",
		"bring.busy": "Copying {{name}}…",
		failed: "That did not work: {{message}}"
	},
	hi: () => import("./hi-CDzMejCM.js")
}) });
//#endregion
//#region ../gui-plugins/src/apna-tools/index.ts
var apna_tools_default = define({ i18n: builtinCatalog({
	en: {
		group: "Tools",
		"desktop.only": "This works only in the desktop app.",
		"terminal.toggle": "Show or hide terminal (Ctrl+`)",
		"run.title": "Run this project",
		"run.idle": "Not running",
		"run.start": "Run it (npm run dev / web server)",
		"run.again": "Run again",
		"run.stop": "Stop",
		"run.open": "Open {{url}} here",
		"run.external": "Open in my browser",
		"run.started": "Starting the project",
		"run.failed": "Could not run the project",
		"run.status.installing": "Installing packages…",
		"run.status.starting": "Starting…",
		"run.status.running": "Running",
		"run.status.stopped": "Stopped",
		"run.status.failed": "Failed",
		"share.title": "Share",
		"share.copy": "Copy chat as text",
		"share.save": "Save chat as a file (in the project's chats folder)",
		"share.json": "Export chat (JSON)…",
		"share.folder": "Show project folder",
		"share.copied": "Chat copied",
		"share.saved": "Chat saved",
		"share.failed": "Could not share the chat",
		"share.untitled": "Chat",
		"dictate.title": "Voice typing (mic)"
	},
	hi: () => import("./hi-DLc-k4vf.js")
}) });
//#endregion
//#region ../gui-plugins/src/apna-images/index.ts
var apna_images_default = define({ i18n: builtinCatalog({
	en: {
		title: "Images",
		"command.title": "Open Images",
		unavailable: "This page works only in the desktop app.",
		"tab.trending": "Trending",
		"tab.templates": "Templates",
		"tab.mine": "My images",
		"templates.hint": "Pick a style, then describe what to draw, or add your own photo with + to change it into this style.",
		"mine.empty": "Images you make will appear here",
		"mine.emptyHelp": "Describe an image below, or start from Trending.",
		"composer.placeholder": "Describe a new image",
		model: "Model",
		aspect: "Aspect ratio",
		mic: "Voice typing",
		make: "Make image",
		making: "Making… {{seconds}} s",
		made: "Image ready",
		failed: "The image could not be made",
		folder: "Saved in {{folder}}",
		"photo.add": "Add a photo to change",
		"photo.pick": "Pick a photo",
		"photo.chip": "Your photo",
		"photo.failed": "That photo could not be used",
		"style.chip": "Style: {{name}}",
		preview: "Image",
		prompt: "Prompt",
		remix: "Remix (use this prompt)",
		edit: "Edit this image",
		open: "Open",
		showFolder: "Show in folder",
		remove: "Delete",
		previous: "Previous image",
		next: "Next image",
		close: "Close"
	},
	hi: () => import("./hi-C5kWtRMz.js")
}) });
//#endregion
//#region ../gui-plugins/src/main.ts
/** Built-in plugins with their main entries, by id. Lists every built-in so their ids stay reserved. */
var builtins = compose({
	context: context_default,
	btw: btw_default,
	debug: {
		...debug_default,
		mainEntry: () => import("./main-B9sl7myf.js")
	},
	terminal: terminal_default,
	file: file_default,
	review: review_default,
	details: details_default,
	browser: {
		...browser_default,
		mainEntry: () => import("./main-CHF0X1JO.js").then((n) => n.t)
	},
	pairing: {
		...pairing_default,
		mainEntry: () => import("./main-DOhgu_9y.js")
	},
	updater: {
		...updater_default,
		mainEntry: () => import("./main-BuEXRup3.js")
	},
	ssh: {
		...ssh_default,
		mainEntry: () => import("./main-CnmUZMlB.js")
	},
	wsl: {
		...wsl_default,
		mainEntry: () => import("./main-D9HIDAL8.js")
	},
	"microsoft-office": microsoft_office_default,
	sources: sources_default,
	goal: goal_default,
	"local-models": {
		...local_models_default,
		mainEntry: () => import("./main-BmBs5ImB.js")
	},
	router: {
		...router_default,
		mainEntry: () => import("./main-DjvKpvlg.js")
	},
	"plugin-store": {
		...plugin_store_default,
		mainEntry: () => import("./main-BbnAYLtI.js")
	},
	customize: {
		...customize_default,
		mainEntry: () => import("./main-DQIVdlHV.js")
	},
	"cloud-projects": {
		...cloud_projects_default,
		mainEntry: () => import("./main-iLVnHLOY.js")
	},
	"apna-tools": {
		...apna_tools_default,
		mainEntry: () => import("./main-BOO0rxOI.js")
	},
	"apna-images": {
		...apna_images_default,
		mainEntry: () => import("./main-i8Lid-bn.js")
	}
});
//#endregion
//#region ../plugin/src/gui/main.ts
/**
* The registry of native app menu items, contributed from main entries. Windows without a native menubar show them
* in the in-app menu.
*
* @example
* ```ts
* ctx.add(MenubarItem, {
*   menu: "help",
*   id: "check",
*   get label() {
*     return ctx.t("menu.check")
*   },
*   run: () => void check(),
* })
* ```
*/
var MenubarItem = Registry.define("menubar-item");
//#endregion
//#region src/main/plugin/lifecycle-machine.ts
function createLifecycleState() {
	return {
		issued: 0,
		plugins: {}
	};
}
function transitionLifecycle(state, event) {
	const ctx = {
		id: event.id,
		issued: state.issued,
		commands: []
	};
	const entry = Object.hasOwn(state.plugins, event.id) ? state.plugins[event.id] : void 0;
	const next = step(ctx, entry, event);
	if (next === entry && ctx.issued === state.issued) return {
		state,
		commands: ctx.commands
	};
	return {
		state: {
			issued: ctx.issued,
			plugins: write(state.plugins, event.id, next)
		},
		commands: ctx.commands
	};
}
/** The failure Settings shows for the plugin. */
var selectPluginFailure = (state, id) => Object.hasOwn(state.plugins, id) ? state.plugins[id].error : void 0;
/** Whether a live instance has `scope`: the only scope a restart handoff may keep. */
var selectHasPluginScope = (state, scope) => Object.values(state.plugins).some((entry) => held(entry, scope) !== void 0);
/** The plugins a stop reaches: every one with an instance, a step in flight or a failure. */
var selectPluginIds = (state) => Object.keys(state.plugins);
function step(ctx, entry, event) {
	switch (event.type) {
		case "activate.requested":
			if (entry === void 0 || entry.status === "failed") return load(ctx, {
				kept: void 0,
				fallback: void 0,
				error: entry?.error,
				replies: [event.reply],
				queue: []
			});
			if (entry.status !== "active") return {
				...entry,
				queue: [...entry.queue, {
					kind: "activate",
					reply: event.reply
				}]
			};
			resolve(ctx, [event.reply]);
			return entry;
		case "deactivate.requested": return deactivate(ctx, entry, event.after ? [event.after] : [], event.reply);
		case "stop.requested": {
			const kept = held(entry, event.keep);
			if (!kept) return deactivate(ctx, entry, [], event.reply);
			if (kept.status === "loading") {
				resolve(ctx, [
					...kept.replies,
					...replies(kept.queue),
					event.reply
				]);
				return unloaded(kept, kept.error);
			}
			if (kept.status === "active") {
				resolve(ctx, [event.reply]);
				return kept;
			}
			resolve(ctx, [...replies(kept.queue), event.reply]);
			return {
				...kept,
				queue: []
			};
		}
		case "reload.requested": return reload(ctx, entry, event.keep, event.reply);
		case "forget.requested":
			if (entry === void 0) return entry;
			if (entry.status === "failed") return void 0;
			return entry.error === void 0 ? entry : {
				...entry,
				error: void 0
			};
		case "load.started":
			if (entry?.status !== "loading" || entry.attempt !== event.attempt || entry.error === void 0) return entry;
			notify(ctx);
			return {
				...entry,
				error: void 0
			};
		case "load.cancelled":
			if (entry?.status !== "loading" || entry.attempt !== event.attempt) return entry;
			resolve(ctx, entry.replies);
			return drain(ctx, unloaded(entry, entry.error), entry.fallback, entry.queue);
		case "load.failed": {
			if (entry?.status !== "loading" || entry.attempt !== event.attempt) return entry;
			const error = fail(ctx, event);
			if (!entry.kept && entry.fallback !== void 0) return create(ctx, {
				...pending(entry),
				error,
				revision: entry.fallback,
				fallback: entry.fallback,
				isFallback: true
			});
			resolve(ctx, entry.replies);
			return drain(ctx, unloaded(entry, error), entry.fallback, entry.queue);
		}
		case "load.succeeded":
			if (entry?.status !== "loading" || entry.attempt !== event.attempt) return entry;
			if (entry.kept) return dispose(ctx, {
				...pending(entry),
				running: entry.kept.running,
				fallback: entry.fallback,
				next: {
					revision: event.revision,
					isFallback: false
				},
				after: []
			});
			return create(ctx, {
				...pending(entry),
				revision: event.revision,
				fallback: entry.fallback,
				isFallback: false
			});
		case "instance.created":
			if (entry?.status !== "creating" || entry.attempt !== event.attempt) {
				ctx.commands.push({
					type: "dispose",
					id: ctx.id,
					running: event.running
				});
				return entry;
			}
			ctx.commands.push({
				type: "await-ready",
				id: ctx.id,
				attempt: entry.attempt,
				running: event.running
			});
			return {
				...entry,
				status: "preparing",
				running: event.running
			};
		case "instance.ready":
			if (entry?.status !== "preparing" || entry.attempt !== event.attempt) return entry;
			if (!event.canRun) return dispose(ctx, {
				...pending(entry),
				running: entry.running,
				fallback: entry.fallback,
				next: void 0,
				after: []
			});
			ctx.commands.push({
				type: "run-setup",
				id: ctx.id,
				attempt: entry.attempt,
				running: entry.running
			});
			return {
				...entry,
				status: "setting-up"
			};
		case "setup.succeeded": {
			if (entry?.status !== "setting-up" || entry.attempt !== event.attempt) return entry;
			resolve(ctx, entry.replies);
			const error = entry.isFallback ? entry.error : void 0;
			return drain(ctx, {
				status: "active",
				running: entry.running,
				revision: entry.revision,
				error
			}, entry.revision, entry.queue);
		}
		case "setup.failed": {
			if (entry?.status !== "setting-up" || entry.attempt !== event.attempt) return entry;
			const error = fail(ctx, event);
			const fallback = entry.isFallback ? void 0 : entry.fallback;
			return dispose(ctx, {
				...pending(entry),
				error,
				running: entry.running,
				fallback,
				next: fallback === void 0 ? void 0 : {
					revision: fallback,
					isFallback: true
				},
				after: []
			});
		}
		case "dispose.settled":
			if (entry?.status !== "disposing" || entry.attempt !== event.attempt) return entry;
			if (entry.next && event.canRun) return create(ctx, {
				...pending(entry),
				revision: entry.next.revision,
				fallback: entry.fallback,
				isFallback: entry.next.isFallback
			});
			runAfter(ctx, entry.after);
			resolve(ctx, entry.replies);
			return drain(ctx, idle(entry.error), entry.fallback, entry.queue);
	}
}
/**
* Stops the plugin at once: whatever is in flight or waiting ends, and an instance withdraws everything now. The
* replies settle, after `after` ran, once its finalizers finished.
*/
function deactivate(ctx, entry, after, reply) {
	if (entry === void 0 || entry.status === "failed") {
		runAfter(ctx, after);
		resolve(ctx, [reply]);
		return entry;
	}
	if (entry.status === "disposing") return {
		...entry,
		fallback: void 0,
		next: void 0,
		replies: [
			...entry.replies,
			...replies(entry.queue),
			reply
		],
		after: [...entry.after, ...after],
		queue: []
	};
	const waiting = entry.status === "active" ? [] : [...entry.replies, ...replies(entry.queue)];
	const running = live(entry);
	if (!running) {
		resolve(ctx, waiting);
		runAfter(ctx, after);
		resolve(ctx, [reply]);
		return idle(entry.error);
	}
	return dispose(ctx, {
		error: entry.error,
		replies: [...waiting, reply],
		queue: [],
		running,
		fallback: void 0,
		next: void 0,
		after
	});
}
/**
* Replaces the plugin with its current code. A good instance keeps running until that code loaded; one still
* starting stops at once. Whatever was in flight or waiting ends. The kept instance of a restart handoff stays as it is.
*/
function reload(ctx, entry, scope, reply) {
	if (held(entry, scope)) {
		resolve(ctx, [reply]);
		return entry;
	}
	if (entry?.error !== void 0) notify(ctx);
	if (entry === void 0 || entry.status === "failed") return load(ctx, {
		kept: void 0,
		fallback: void 0,
		error: void 0,
		replies: [reply],
		queue: []
	});
	if (entry.status === "active") return load(ctx, {
		kept: {
			running: entry.running,
			revision: entry.revision
		},
		fallback: entry.revision,
		error: void 0,
		replies: [reply],
		queue: []
	});
	const superseded = [...entry.replies, ...replies(entry.queue)];
	if (entry.status === "disposing") return {
		...entry,
		error: void 0,
		next: void 0,
		replies: superseded,
		queue: [{
			kind: "reload",
			reply
		}]
	};
	if (entry.status === "preparing" || entry.status === "setting-up") return dispose(ctx, {
		error: void 0,
		replies: superseded,
		queue: [{
			kind: "reload",
			reply
		}],
		running: entry.running,
		fallback: entry.fallback,
		next: void 0,
		after: []
	});
	resolve(ctx, superseded);
	return load(ctx, {
		kept: entry.status === "loading" ? entry.kept : void 0,
		fallback: entry.fallback,
		error: void 0,
		replies: [reply],
		queue: []
	});
}
/** Runs the operations that waited for the step that settled, until one starts a step of its own. */
function drain(ctx, settled, fallback, queue) {
	const item = queue[0];
	if (!item) return settled;
	const rest = queue.slice(1);
	if (item.kind === "activate") {
		if (settled?.status !== "active") return load(ctx, {
			kept: void 0,
			fallback: void 0,
			error: settled?.error,
			replies: [item.reply],
			queue: rest
		});
		resolve(ctx, [item.reply]);
		return drain(ctx, settled, fallback, rest);
	}
	if (settled?.error !== void 0) notify(ctx);
	if (settled?.status === "active") return load(ctx, {
		kept: {
			running: settled.running,
			revision: settled.revision
		},
		fallback: settled.revision,
		error: void 0,
		replies: [item.reply],
		queue: rest
	});
	return load(ctx, {
		kept: void 0,
		fallback,
		error: void 0,
		replies: [item.reply],
		queue: rest
	});
}
function load(ctx, fields) {
	const attempt = ++ctx.issued;
	ctx.commands.push({
		type: "load",
		id: ctx.id,
		attempt
	});
	return {
		...fields,
		status: "loading",
		attempt
	};
}
function create(ctx, fields) {
	const attempt = ++ctx.issued;
	ctx.commands.push({
		type: "create",
		id: ctx.id,
		attempt,
		revision: fields.revision
	});
	return {
		...fields,
		status: "creating",
		attempt
	};
}
function dispose(ctx, fields) {
	const attempt = ++ctx.issued;
	ctx.commands.push({
		type: "dispose",
		id: ctx.id,
		attempt,
		running: fields.running
	});
	return {
		...fields,
		status: "disposing",
		attempt
	};
}
/** The step's replies and waiting operations, carried into the next phase. */
function pending(entry) {
	return {
		error: entry.error,
		replies: entry.replies,
		queue: entry.queue
	};
}
/** The kept instance again, or nothing, when a reload ends without replacing it. */
function unloaded(entry, error) {
	if (!entry.kept) return idle(error);
	return {
		status: "active",
		running: entry.kept.running,
		revision: entry.kept.revision,
		error
	};
}
function idle(error) {
	return error === void 0 ? void 0 : {
		status: "failed",
		error
	};
}
/** The entry when its live instance has `scope`. */
function held(entry, scope) {
	if (scope === void 0 || entry === void 0 || entry.status === "failed" || entry.status === "disposing") return void 0;
	return live(entry)?.instance.scope === scope ? entry : void 0;
}
/** The instance running or starting: the kept one while a reload loads, none while one is being created. */
function live(entry) {
	if (entry.status === "loading") return entry.kept?.running;
	if (entry.status === "creating") return void 0;
	return entry.running;
}
function replies(queue) {
	return queue.map((item) => item.reply);
}
function resolve(ctx, list) {
	if (list.length) ctx.commands.push({
		type: "resolve",
		replies: list
	});
}
function notify(ctx) {
	ctx.commands.push({ type: "notify-changed" });
}
/** Records the failure the event reports and returns the message Settings shows. */
function fail(ctx, event) {
	ctx.commands.push({
		type: "log-failure",
		id: ctx.id,
		error: event.error
	}, { type: "notify-changed" });
	return event.error instanceof Error ? event.error.message : String(event.error);
}
function runAfter(ctx, callbacks) {
	if (callbacks.length) ctx.commands.push({
		type: "run-after",
		callbacks
	});
}
function write(plugins, id, entry) {
	if (entry) return {
		...plugins,
		[id]: entry
	};
	return Object.fromEntries(Object.entries(plugins).filter(([key]) => key !== id));
}
//#endregion
//#region src/main/plugin/lifecycle.ts
/** How long disposal waits for an instance's finalizers and a setup still running. */
var CLEANUP_TIMEOUT_MS = 3e3;
/** A setup still running after this long is logged once. */
var SETUP_STALL_MS = 1e4;
/**
* The plugin lifecycle without Electron: one serialized queue of operations per plugin, the instances they
* start and stop, and what the host withdraws when an instance goes away. `lifecycle-machine.ts` holds where each
* plugin stands; this runs its commands.
*/
function createLifecycle(input) {
	const current = { state: createLifecycleState() };
	const queue = [];
	const canRun = (id) => input.enabled(id) && !isQuitting(input.state());
	const dispatch = (event) => {
		queue.push(event);
		if (queue.length === 1) drain();
	};
	const drain = () => {
		const event = queue[0];
		if (!event) return;
		try {
			const next = transitionLifecycle(current.state, event);
			current.state = next.state;
			next.commands.forEach((command) => Promise.try(() => perform(command)).catch((error) => input.log("plugin lifecycle command failed", {
				command: command.type,
				error
			})));
		} finally {
			queue.shift();
		}
		drain();
	};
	const perform = (command) => {
		if (command.type === "run-after") return command.callbacks.forEach((callback) => callback());
		if (command.type === "resolve") return command.replies.forEach((reply) => reply());
		if (command.type === "notify-changed") return input.changed();
		const id = command.id;
		switch (command.type) {
			case "load": {
				const attempt = command.attempt;
				const loader = canRun(id) ? input.loader(id) : void 0;
				if (!loader) return dispatch({
					type: "load.cancelled",
					id,
					attempt
				});
				dispatch({
					type: "load.started",
					id,
					attempt
				});
				Promise.try(loader).then((revision) => dispatch(canRun(id) ? {
					type: "load.succeeded",
					id,
					attempt,
					revision
				} : {
					type: "load.cancelled",
					id,
					attempt
				}), (error) => dispatch(canRun(id) ? {
					type: "load.failed",
					id,
					attempt,
					error
				} : {
					type: "load.cancelled",
					id,
					attempt
				}));
				return;
			}
			case "create": return dispatch({
				type: "instance.created",
				id,
				attempt: command.attempt,
				running: create(id, command.revision)
			});
			case "await-ready": {
				const attempt = command.attempt;
				command.running.ready.then(() => dispatch({
					type: "instance.ready",
					id,
					attempt,
					canRun: canRun(id)
				}));
				return;
			}
			case "run-setup": {
				const attempt = command.attempt;
				command.running.start().then((outcome) => dispatch(outcome.ok ? {
					type: "setup.succeeded",
					id,
					attempt
				} : {
					type: "setup.failed",
					id,
					attempt,
					error: outcome.error
				}));
				return;
			}
			case "dispose": {
				const attempt = command.attempt;
				const disposed = command.running.dispose();
				if (attempt === void 0) return;
				const settled = () => dispatch({
					type: "dispose.settled",
					id,
					attempt,
					canRun: canRun(id)
				});
				disposed.then(settled, settled);
				return;
			}
			case "log-failure": return input.log("plugin failed", {
				id,
				error: command.error
			});
		}
	};
	const create = (id, revision) => {
		const scope = Scope.make(id, {
			timeout: CLEANUP_TIMEOUT_MS,
			log: input.log
		});
		const contributions = /* @__PURE__ */ new Set();
		const withdraw = (fn) => {
			try {
				fn();
			} catch (error) {
				input.log("plugin withdrawal failed", {
					id,
					error
				});
			}
		};
		const instance = {
			id,
			scope,
			contribute(fn) {
				if (scope.signal.aborted) {
					withdraw(fn);
					return () => {};
				}
				const remove = () => {
					if (contributions.delete(remove)) fn();
				};
				contributions.add(remove);
				return remove;
			}
		};
		const prepared = Promise.try(() => revision(instance));
		const progress = { setup: Promise.resolve(void 0) };
		return {
			instance,
			ready: prepared.then((value) => value.ready).catch(() => void 0),
			start() {
				const stall = setTimeout(() => input.log("plugin setup stalled", {
					id,
					ms: SETUP_STALL_MS
				}), SETUP_STALL_MS);
				const outcome = prepared.then((value) => value.setup()).then(() => ({ ok: true }), (cause) => ({
					ok: false,
					error: cause
				})).finally(() => clearTimeout(stall));
				progress.setup = outcome;
				return outcome;
			},
			dispose() {
				if (progress.disposed) return progress.disposed;
				const closed = scope.close();
				[...contributions].reverse().forEach(withdraw);
				const settled = within(progress.setup.then(() => scope.close()), () => input.log("plugin cleanup timed out", { id }));
				progress.disposed = Promise.all([closed, settled]).then(() => void 0);
				return progress.disposed;
			}
		};
	};
	const request = (event) => new Promise((resolve) => dispatch(event(resolve)));
	return {
		activate: (id) => request((reply) => ({
			type: "activate.requested",
			id,
			reply
		})),
		/**
		* Stops the plugin at once and queues its teardown: activations queued before it go stale, the instance
		* withdraws everything it contributed now, and the queue moves on only after its disposal settled. `after`
		* runs inside the queue once the teardown finished.
		*/
		deactivate: (id, after) => request((reply) => ({
			type: "deactivate.requested",
			id,
			after,
			reply
		})),
		/**
		* Replaces the plugin with its current code. A good instance keeps running until that code loaded; a reload that
		* fails to load or set up leaves the last good revision running, with the failure recorded. A restart handoff's
		* kept instance stays as it is.
		*/
		reload: (id) => request((reply) => ({
			type: "reload.requested",
			id,
			keep: keptScope(input.state()),
			reply
		})),
		failure: (id) => selectPluginFailure(current.state, id),
		forget: (id) => dispatch({
			type: "forget.requested",
			id
		}),
		/**
		* Restarts the app keeping `keep`, an instance's scope: stopping skips that instance while the handoff runs, so a
		* failed handoff leaves it working. Rejects without running the handoff when no instance has that scope.
		*/
		restart(keep, handoff) {
			if (!selectHasPluginScope(current.state, keep)) return Promise.reject(/* @__PURE__ */ new Error("Lifecycle.restart keeps only an active plugin's ctx.scope"));
			return input.restart(keep, handoff);
		},
		/** Stops every plugin but the one the app keeps; settles once each lifecycle has. */
		async stop() {
			const keep = keptScope(input.state());
			await Promise.all(selectPluginIds(current.state).map((id) => request((reply) => ({
				type: "stop.requested",
				id,
				keep,
				reply
			}))));
		}
	};
}
/** Waits for the promise until the cleanup deadline, then reports and stops waiting. */
function within(promise, timedOut) {
	const deadline = Promise.withResolvers();
	const timer = setTimeout(() => {
		timedOut();
		deadline.resolve();
	}, CLEANUP_TIMEOUT_MS);
	return Promise.race([promise, deadline.promise]).finally(() => clearTimeout(timer));
}
//#endregion
//#region src/main/plugin/manager.ts
/** Plugin enable state in the desktop database. Built-ins always run; `builtins` are their ids. */
function createManager(db, builtins) {
	return {
		/** Always true for a built-in; otherwise the setting saved under the id, and no setting means enabled. */
		enabled(id) {
			return pluginEnabled({
				id,
				builtin: builtins.includes(id)
			}, readEnableState(db.$client));
		},
		/** Saves the setting under the id; a built-in always runs, so it throws a `builtin` PluginError for one. */
		setEnabled(id, enabled) {
			if (builtins.includes(id)) throw new PluginError("builtin");
			db.insert(plugin).values({
				id,
				enabled
			}).onConflictDoUpdate({
				target: plugin.id,
				set: { enabled }
			}).run();
		}
	};
}
//#endregion
//#region src/main/plugin/host-machine.ts
var WATCH_RETRY_MS = 1e3;
var LIST_TIMEOUT_MS = 3e4;
/** How long a locale's catalog may load before the plugin falls back to English. */
var CATALOG_TIMEOUT_MS = 5e3;
function createHostState(locale) {
	return {
		status: "stopped",
		nextAttempt: 1,
		menubarQueued: false,
		locale,
		catalogs: /* @__PURE__ */ new Map()
	};
}
function transitionHost(state, event) {
	switch (event.type) {
		case "locale.changed":
		case "catalog.registered":
		case "catalog.unregistered":
		case "catalog.loaded":
		case "catalog.failed":
		case "catalog.timed-out": return transitionCatalogs(state, event);
		case "menubar.scheduled":
			if (state.menubarQueued) return unchanged(state);
			return {
				state: {
					...state,
					menubarQueued: true
				},
				commands: [{ type: "queue-menubar" }]
			};
		case "menubar.flushed":
			if (!state.menubarQueued) return unchanged(state);
			return {
				state: {
					...state,
					menubarQueued: false
				},
				commands: event.quitting ? [] : [{ type: "publish-menubar" }]
			};
		case "resumed": {
			const queued = transitionHost(state, { type: "menubar.scheduled" });
			const started = transitionHost(queued.state, {
				...event,
				type: "started"
			});
			return {
				state: started.state,
				commands: [...queued.commands, ...started.commands]
			};
		}
		case "started":
			if (state.status === "following") return follow(state, event.endpoint, event.quitting);
			if (event.quitting) return unchanged(state);
			return follow({
				...state,
				status: "following",
				endpoint: void 0,
				watch: IDLE_WATCH,
				list: IDLE_LIST
			}, event.endpoint, false, [{ type: "subscribe-credentials" }]);
		case "stopped":
			if (state.status === "stopped") return unchanged(state);
			return {
				state: {
					status: "stopped",
					nextAttempt: state.nextAttempt,
					menubarQueued: state.menubarQueued,
					locale: state.locale,
					catalogs: state.catalogs
				},
				commands: [{ type: "unsubscribe-credentials" }, ...cancelled(state)]
			};
	}
	if (state.status !== "following") return unchanged(state);
	switch (event.type) {
		case "endpoint.changed": return follow(state, event.endpoint, event.quitting);
		case "watch.ended": {
			if (state.watch.status !== "streaming" || state.watch.attempt !== event.attempt) return unchanged(state);
			if (event.quitting) return {
				state: {
					...state,
					watch: IDLE_WATCH
				},
				commands: []
			};
			const attempt = state.nextAttempt;
			return {
				state: {
					...state,
					nextAttempt: attempt + 1,
					watch: {
						status: "retrying",
						attempt
					}
				},
				commands: [{
					type: "schedule-watch-retry",
					attempt,
					delayMs: WATCH_RETRY_MS
				}]
			};
		}
		case "watch.retry-due": {
			if (state.watch.status !== "retrying" || state.watch.attempt !== event.attempt) return unchanged(state);
			if (event.quitting || !state.endpoint) return {
				state: {
					...state,
					watch: IDLE_WATCH
				},
				commands: []
			};
			const attempt = state.nextAttempt;
			return {
				state: {
					...state,
					nextAttempt: attempt + 1,
					watch: {
						status: "streaming",
						attempt
					}
				},
				commands: [{
					type: "start-watch",
					attempt,
					endpoint: state.endpoint
				}]
			};
		}
		case "relist.requested":
			if (event.quitting || !state.endpoint) return unchanged(state);
			if (state.watch.status !== "streaming" || state.watch.attempt !== event.watchAttempt) return unchanged(state);
			if (state.list.status === "listing") return state.list.queued ? unchanged(state) : {
				state: {
					...state,
					list: {
						...state.list,
						queued: true
					}
				},
				commands: []
			};
			return list(state, state.endpoint, []);
		case "list.succeeded":
			if (!currentList(state, event.attempt)) return unchanged(state);
			if (event.quitting) return settleList(state, [], true);
			return settleList(state, [{
				type: "apply-listing",
				listing: event.listing
			}], false);
		case "list.failed":
			if (!currentList(state, event.attempt)) return unchanged(state);
			return settleList(state, [{
				type: "log-list-error",
				cause: event.cause
			}], event.quitting);
		case "list.timed-out":
			if (!currentList(state, event.attempt)) return unchanged(state);
			return settleList(state, [{ type: "cancel-list" }, {
				type: "log-list-error",
				cause: /* @__PURE__ */ new Error(`Plugin listing timed out after ${LIST_TIMEOUT_MS} ms`)
			}], event.quitting);
	}
}
/** Whether a watch started with `attempt` is still the one to run. */
function isCurrentHostWatch(state, attempt) {
	return state.status === "following" && state.watch.status === "streaming" && state.watch.attempt === attempt;
}
function sameHostEndpoint(a, b) {
	return a?.url === b?.url && a?.authorization === b?.authorization;
}
var IDLE_WATCH = Object.freeze({ status: "idle" });
var IDLE_LIST = Object.freeze({ status: "idle" });
function currentList(state, attempt) {
	return state.list.status === "listing" && state.list.attempt === attempt;
}
function follow(state, endpoint, quitting, before = []) {
	const same = sameHostEndpoint(state.endpoint, endpoint);
	if (quitting && same && state.watch.status === "idle" && state.list.status === "idle" && before.length === 0) return unchanged(state);
	const stopsList = quitting || !same;
	const commands = [
		...before,
		...state.watch.status === "idle" ? [] : [{ type: "cancel-watch" }],
		...stopsList && state.list.status !== "idle" ? [{ type: "cancel-list" }] : []
	];
	const listing = stopsList ? IDLE_LIST : state.list;
	if (quitting || !endpoint) return {
		state: {
			...state,
			endpoint,
			watch: IDLE_WATCH,
			list: listing
		},
		commands
	};
	const attempt = state.nextAttempt;
	return {
		state: {
			...state,
			endpoint,
			nextAttempt: attempt + 1,
			watch: {
				status: "streaming",
				attempt
			},
			list: listing
		},
		commands: [...commands, {
			type: "start-watch",
			attempt,
			endpoint
		}]
	};
}
function list(state, endpoint, before) {
	const attempt = state.nextAttempt;
	return {
		state: {
			...state,
			nextAttempt: attempt + 1,
			list: {
				status: "listing",
				attempt,
				queued: false
			}
		},
		commands: [...before, {
			type: "start-list",
			attempt,
			endpoint,
			timeoutMs: LIST_TIMEOUT_MS
		}]
	};
}
function settleList(state, commands, quitting) {
	if (!quitting && state.list.status === "listing" && state.list.queued && state.endpoint) return list(state, state.endpoint, commands);
	return {
		state: {
			...state,
			list: IDLE_LIST
		},
		commands
	};
}
function cancelled(state) {
	return [...state.watch.status === "idle" ? [] : [{ type: "cancel-watch" }], ...state.list.status === "idle" ? [] : [{ type: "cancel-list" }]];
}
function unchanged(state) {
	return {
		state,
		commands: []
	};
}
/** The plugin instance's copy in the app locale; English while its locale loads for the first time. */
function selectCatalogMessages(state, owner) {
	return state.catalogs.get(owner)?.messages ?? {};
}
function transitionCatalogs(state, event) {
	switch (event.type) {
		case "catalog.registered": {
			const source = catalogSource(event.catalog, state.locale);
			if (source.kind === "sync") return {
				state: {
					...state,
					catalogs: put(state.catalogs, event.owner, {
						status: "ready",
						catalog: event.catalog,
						messages: source.messages
					})
				},
				commands: [{
					type: "resolve-catalog-ready",
					replies: [event.reply]
				}]
			};
			const attempt = state.nextAttempt;
			return {
				state: {
					...state,
					nextAttempt: attempt + 1,
					catalogs: put(state.catalogs, event.owner, {
						status: "loading",
						catalog: event.catalog,
						messages: event.catalog?.en ?? {},
						attempt,
						ready: event.reply
					})
				},
				commands: [loadCatalog(event.owner, attempt, source.load)]
			};
		}
		case "catalog.unregistered": {
			const entry = state.catalogs.get(event.owner);
			if (!entry) return unchanged(state);
			const catalogs = new Map(state.catalogs);
			catalogs.delete(event.owner);
			if (entry.status === "ready") return {
				state: {
					...state,
					catalogs
				},
				commands: []
			};
			return publishWhenLoaded({
				state: {
					...state,
					catalogs
				},
				commands: [{
					type: "cancel-catalog-timer",
					owner: event.owner
				}, ...waiting(entry)]
			}, !entry.ready);
		}
		case "catalog.loaded":
		case "catalog.failed":
		case "catalog.timed-out": {
			const entry = state.catalogs.get(event.owner);
			if (entry?.status !== "loading" || entry.attempt !== event.attempt) return unchanged(state);
			const english = entry.catalog?.en ?? {};
			return publishWhenLoaded({
				state: {
					...state,
					catalogs: put(state.catalogs, event.owner, {
						status: "ready",
						catalog: entry.catalog,
						messages: event.type === "catalog.loaded" ? {
							...english,
							...event.messages
						} : english
					})
				},
				commands: [{
					type: "cancel-catalog-timer",
					owner: event.owner
				}, ...waiting(entry)]
			}, !entry.ready);
		}
		case "locale.changed": {
			if (event.locale === state.locale) return publishWhenLoaded({
				state,
				commands: []
			}, true);
			const commands = [];
			const replies = [];
			const first = state.nextAttempt;
			const catalogs = new Map([...state.catalogs].map(([owner, entry], index) => {
				const source = catalogSource(entry.catalog, event.locale);
				const ready = entry.status === "loading" ? entry.ready : void 0;
				if (source.kind === "async") {
					const attempt = first + index;
					commands.push(loadCatalog(owner, attempt, source.load));
					return [owner, {
						status: "loading",
						catalog: entry.catalog,
						messages: entry.messages,
						attempt,
						ready
					}];
				}
				if (entry.status === "loading") commands.push({
					type: "cancel-catalog-timer",
					owner
				});
				if (ready) replies.push(ready);
				return [owner, {
					status: "ready",
					catalog: entry.catalog,
					messages: source.messages
				}];
			}));
			return publishWhenLoaded({
				state: {
					...state,
					nextAttempt: first + state.catalogs.size,
					locale: event.locale,
					catalogs
				},
				commands: [...commands, ...replies.length ? [{
					type: "resolve-catalog-ready",
					replies
				}] : []]
			}, true);
		}
	}
}
function catalogSource(catalog, locale) {
	const english = catalog?.en ?? {};
	const source = locale === "en" ? void 0 : catalog?.[locale];
	if (!source) return {
		kind: "sync",
		messages: english
	};
	if (isFunction(source)) return {
		kind: "async",
		load: source
	};
	return {
		kind: "sync",
		messages: {
			...english,
			...source
		}
	};
}
function loadCatalog(owner, attempt, load) {
	return {
		type: "load-catalog",
		owner,
		attempt,
		load,
		timeoutMs: CATALOG_TIMEOUT_MS
	};
}
/** Lets an instance's setup run once its first copy settled, or once it went away. */
function waiting(entry) {
	return entry.status === "loading" && entry.ready ? [{
		type: "resolve-catalog-ready",
		replies: [entry.ready]
	}] : [];
}
function put(catalogs, owner, entry) {
	return new Map(catalogs).set(owner, entry);
}
function publishWhenLoaded(next, running) {
	if (!running) return next;
	if ([...next.state.catalogs.values()].some((entry) => entry.status === "loading" && !entry.ready)) return next;
	const queued = transitionHost(next.state, { type: "menubar.scheduled" });
	return {
		state: queued.state,
		commands: [...next.commands, ...queued.commands]
	};
}
//#endregion
//#region src/main/plugin/module.ts
var native = createRequire(import.meta.url);
var shared = {
	effect: () => import("./dist-DWveHAM-.js").then((n) => n.t),
	"@opencode/plugin/gui": () => import("./main-C5H6mxzq.js"),
	"@opencode/plugin/gui/main": () => import("./main-C5H6mxzq.js"),
	"@opencode/plugin/rpc": () => import("./rpc-CxBu5GwB.js"),
	"@opencode/schema/rpc": () => import("./rpc-Cgr1icHg.js").then((n) => n.n),
	"@opencode/client": () => import("./promise-DXUpiwYe.js").then((n) => n.t),
	"@opencode/client/effect": () => import("./effect-Dj-xfPCk.js")
};
var windowOnly = new Set(pluginWindowModules);
/**
* Evaluates a plugin's `./gui-experimental` bundle in main and returns what main runs: its `Plugin.define`'s `main`
* setup, or one that does nothing for a plugin with none, and its `os` and catalog. `electron`
* and Node built-ins are the real modules; the window-only modules are inert placeholders.
*/
async function evaluateMain(code) {
	const modules = new Map(await Promise.all(Object.entries(shared).map(async ([name, load]) => [name, await load()])));
	const bundle = evaluatePluginBundle(code, {
		process: "main",
		require: (name) => {
			const loaded = modules.get(name);
			if (loaded) return loaded;
			if (name === "electron" || isBuiltin(name)) return native(name);
			if (windowOnly.has(name)) return inertModule(name);
			throw new Error(`Plugin GUI bundle requires a module the app does not share: ${name}`);
		}
	});
	return {
		setup: bundle.main ?? (() => {}),
		i18n: bundle.definition.i18n,
		os: bundle.definition.os
	};
}
//#endregion
//#region src/main/plugin/storage.ts
/**
* Each plugin's values live in the `state` table under `plugin.<id>`, stored as canonical JSON. Writes are rare, so
* each one reaches the database before it returns and survives a crash. A built-in's `from` imports an older value
* once from a settings file or another state namespace, and every store of a built-in first imports from
* `extension.<id>`, where builds before the plugin rename kept it. Other plugins never stored values there.
*/
function createStorage(state, settings, id, builtin) {
	const name = `plugin.${id}`;
	const keys = /* @__PURE__ */ new Map();
	const shared = (key) => {
		const existing = keys.get(key);
		if (existing) return existing;
		const created = {};
		keys.set(key, created);
		return created;
	};
	const sources = (key, from) => [...builtin ? [{ state: [`extension.${id}`, key] }] : [], ...[from ?? []].flat()].map((item) => source(state, settings, item));
	const remove = (key, from) => {
		sources(key, from).forEach((older) => older.remove());
		if (state.get(name, key) !== null) state.delete(name, key);
		state.flush();
		const entry = keys.get(key);
		if (entry) entry.json = null;
	};
	return {
		store(key, options) {
			const codec = toCodecJson(options.schema);
			const legacy = sources(key, options.from);
			const entry = shared(key);
			const decoded = {};
			const read = () => {
				const stored = state.get(name, key);
				if (stored !== null) return stored;
				const found = legacy.reduce((match, older) => {
					if (match) return match;
					const value = older.read();
					return value !== void 0 && isSome(decodeUnknownOption(codec)(value)) ? { value } : void 0;
				}, void 0);
				if (!found) return null;
				const json = JSON.stringify(found.value);
				state.set(name, key, json);
				return json;
			};
			const current = () => {
				if (entry.json === void 0) entry.json = read();
				const json = entry.json;
				const cached = decoded.value;
				if (cached && cached.json === json) return cached.current;
				const value = json === null ? none() : decodeUnknownOption(fromJsonString(codec))(json);
				const next = {
					json,
					current: getOrElse(value, () => options.initial)
				};
				decoded.value = next;
				return next.current;
			};
			const write = (value) => {
				const encoded = encodeSync(codec)(value);
				const json = JSON.stringify(encoded);
				state.set(name, key, json);
				state.flush();
				entry.json = json;
				decoded.value = {
					json,
					current: decodeSync(codec)(encoded)
				};
			};
			return {
				get value() {
					return current();
				},
				ready: () => true,
				update(mutate) {
					const draft = decodeSync(codec)(encodeSync(codec)(current()));
					if (mutate(draft) !== void 0) throw new Error("Persisted.update must not return a value. Use set(next) to replace the value.");
					write(draft);
				},
				set: write
			};
		},
		remove: (key, options) => remove(key, options?.from)
	};
}
/** One older home: a key of a settings file, or of another state namespace. */
function source(state, settings, from) {
	if ("settings" in from) {
		const store = () => settings(from.file);
		return {
			read: () => store().get(from.settings),
			remove() {
				if (store().get(from.settings) !== void 0) store().delete(from.settings);
			}
		};
	}
	const [space, key] = from.state;
	return {
		read() {
			const value = state.get(space, key);
			if (value === null) return void 0;
			return getOrUndefined(decodeUnknownOption(fromJsonString(Unknown))(value));
		},
		remove() {
			if (state.get(space, key) !== null) state.delete(space, key);
		}
	};
}
//#endregion
//#region src/main/native/corners.ts
function createCornerImages(color, radius, scale, border) {
	const size = Math.max(1, Math.round(radius * scale));
	const ring = (border?.width ?? 0) * scale;
	const coverage = (edge, distance) => Math.max(0, Math.min(1, edge - distance + .5));
	return [false, true].map((right) => {
		const pixels = Buffer.alloc(size * size * 4);
		for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
			const distance = Math.hypot(right ? x + .5 : size - x - .5, y + .5);
			const inside = coverage(size, distance);
			const base = (1 - inside) * color[3] / 255;
			const line = border ? (coverage(size + ring, distance) - inside) * border.color[3] / 255 : 0;
			const channel = (index) => Math.round((border ? border.color[index] : 0) * line + color[index] * base * (1 - line));
			const offset = (y * size + x) * 4;
			pixels[offset] = channel(2);
			pixels[offset + 1] = channel(1);
			pixels[offset + 2] = channel(0);
			pixels[offset + 3] = Math.round(255 * (line + base * (1 - line)));
		}
		return nativeImage.createFromBitmap(pixels, {
			width: size,
			height: size,
			scaleFactor: scale
		});
	});
}
//#endregion
//#region src/main/plugin/embeds.ts
var WINDOW_GUTTER = 24;
/**
* The web pages main plugins hand to the host. Each stays hidden until its window's renderer lays
* it out and the plugin shows it; the renderer's bounds already include the window zoom.
*/
function createEmbeds() {
	const entries = /* @__PURE__ */ new Map();
	const resizing = /* @__PURE__ */ new WeakSet();
	const apply = (entry) => {
		if (entry.window.isDestroyed()) return;
		const layout = entry.layout?.bounds;
		const viewport = entry.layout?.viewport;
		const [width = 0, height = 0] = entry.window.getContentSize();
		const zoom = entry.window.webContents.getZoomFactor();
		const follow = (inset, change) => inset <= WINDOW_GUTTER * zoom && Math.abs(change) >= zoom + 1 ? change : 0;
		const dx = layout && viewport ? follow(viewport.width - layout.x - layout.width, width - viewport.width) : 0;
		const dy = layout && viewport ? follow(viewport.height - layout.y - layout.height, height - viewport.height) : 0;
		const bounds = layout && {
			x: Math.round(layout.x),
			y: Math.round(layout.y),
			width: Math.round(layout.width + dx),
			height: Math.round(layout.height + dy)
		};
		const placed = !!entry.layout?.visible && !!bounds && bounds.width > 0 && bounds.height > 0;
		if (placed && bounds) {
			entry.view.setBounds(bounds);
			const size = Math.min(Math.round(entry.layout?.radius ?? 0), Math.floor(bounds.width / 2), Math.floor(bounds.height / 2));
			const background = entry.layout?.background;
			const border = entry.layout?.border;
			const scale = screen.getDisplayMatching(entry.window.getBounds()).scaleFactor;
			const key = background && size > 0 ? `${background}:${size}:${scale}:${border?.color ?? ""}:${border?.width ?? ""}` : "";
			if (background && key && key !== entry.cornerKey) createCornerImages(background, size, scale, border).forEach((image, index) => entry.corners[index]?.setImage(image));
			entry.cornerKey = key;
			entry.corners.forEach((corner, index) => corner.setBounds({
				x: bounds.x + (index ? bounds.width - size : 0),
				y: bounds.y + bounds.height - size,
				width: size,
				height: size
			}));
		}
		const visible = placed && entry.shown;
		entry.corners.forEach((corner) => corner.setVisible(placed && !!entry.cornerKey));
		entry.view.setVisible(visible);
		if (visible === entry.onscreen) return;
		entry.onscreen = visible;
		entry.listeners.forEach((listener) => listener(visible));
	};
	const release = (id) => {
		const entry = entries.get(id);
		if (!entry) return;
		entries.delete(id);
		entry.listeners.clear();
		if (entry.window.isDestroyed()) return;
		entry.view.setVisible(false);
		entry.corners.forEach((corner) => entry.window.contentView.removeChildView(corner));
		entry.window.contentView.removeChildView(entry.view);
	};
	const owned = (windowID, id) => {
		const entry = entries.get(id);
		return entry?.windowID === windowID ? entry : void 0;
	};
	return {
		create(owner, view, window) {
			const id = randomUUID();
			if (!resizing.has(window)) {
				resizing.add(window);
				const refresh = () => entries.forEach((entry) => entry.window === window && apply(entry));
				window.on("resize", refresh);
				window.on("move", refresh);
				screen.on("display-metrics-changed", refresh);
				window.once("closed", () => screen.off("display-metrics-changed", refresh));
			}
			const corners = [new ImageView(), new ImageView()];
			view.setVisible(false);
			window.contentView.addChildView(view);
			corners.forEach((corner) => {
				corner.setBackgroundBlur(0);
				corner.setVisible(false);
				window.contentView.addChildView(corner);
			});
			const entry = {
				owner,
				window,
				windowID: window.id,
				view,
				corners,
				cornerKey: "",
				shown: false,
				onscreen: false,
				listeners: /* @__PURE__ */ new Set()
			};
			entries.set(id, entry);
			return {
				id,
				show(visible) {
					entry.shown = visible;
					if (entries.get(id) === entry) apply(entry);
				},
				on(_event, handler) {
					entry.listeners.add(handler);
					return () => {
						entry.listeners.delete(handler);
					};
				},
				capture: () => capture(entry),
				dispose: () => release(id)
			};
		},
		layout(windowID, id, layout) {
			const entry = owned(windowID, id);
			if (!entry) return;
			entry.layout = layout;
			apply(entry);
		},
		capture(windowID, id) {
			const entry = owned(windowID, id);
			return entry ? capture(entry) : Promise.resolve(void 0);
		},
		/** The window's renderer is reloading; it lays its embeds out again once it is back. */
		reset(windowID) {
			entries.forEach((entry) => {
				if (entry.windowID !== windowID) return;
				entry.layout = void 0;
				apply(entry);
			});
		},
		releaseWindow(windowID) {
			entries.forEach((entry, id) => {
				if (entry.windowID === windowID) release(id);
			});
		},
		/** Releases one plugin instance's embeds; a replacement of the same plugin keeps its own. */
		releaseOwner(owner) {
			entries.forEach((entry, id) => {
				if (entry.owner === owner) release(id);
			});
		}
	};
}
async function capture(entry) {
	if (entry.window.isDestroyed() || entry.view.webContents.isDestroyed() || !entry.view.getVisible()) return;
	const image = await entry.view.webContents.capturePage();
	return image.isEmpty() ? void 0 : image;
}
//#endregion
//#region src/main/plugin/host.ts
var host_exports = /* @__PURE__ */ __exportAll({ createHost: () => createHost });
var loadClient = () => import("./promise-DXUpiwYe.js").then((n) => n.t);
var os = value(process.platform).pipe(when("darwin", () => "macos"), when("win32", () => "windows"), orElse(() => "linux"));
/**
* The main-process GUI plugin host. Every main plugin is an app-scoped singleton; windows
* reach its Ipcs over the bridge and main scopes state and events by `caller.window`.
*/
function createHost(input) {
	const definitions = builtins;
	const local = definitions.filter((definition) => runsOn(definition, os));
	const manager = createManager(input.db, definitions.map((definition) => definition.id));
	const embeds = createEmbeds();
	const plugins = /* @__PURE__ */ new Map();
	const inventory = {
		reserved: [],
		server: /* @__PURE__ */ new Set(),
		tui: /* @__PURE__ */ new Set(),
		unsupported: /* @__PURE__ */ new Set(),
		unreadable: /* @__PURE__ */ new Map()
	};
	const skipped = /* @__PURE__ */ new Map();
	const entries = /* @__PURE__ */ new Map();
	const ipcs = /* @__PURE__ */ new Map();
	const closed = /* @__PURE__ */ new Set();
	let nextEntry = 0;
	const broadcast = (event) => getMainWindows().forEach((win) => emitIpcEvent(win.webContents, event));
	const changed = () => broadcast(new PluginsChanged({ list: installed() }));
	const subscribers = (ipc, window) => {
		const ids = input.subscriptions.get(ipc);
		if (!ids) return [];
		return [...ids].filter((id) => window === void 0 || id === window).flatMap((id) => {
			const win = BrowserWindow.fromId(id);
			if (win && !win.isDestroyed()) return [win];
			ids.delete(id);
			return [];
		});
	};
	const pushState = (ipc, provider, window) => {
		const schema = provider.spec.state;
		const stateOf = provider.state;
		if (!schema || !stateOf) return;
		subscribers(ipc, window).forEach((win) => {
			const encoded = encodeUnknownExit(schema)(stateOf(win.id));
			if (isFailure(encoded)) return input.log("plugin state encoding failed", {
				ipc,
				cause: String(encoded.cause)
			});
			emitIpcEvent(win.webContents, new PluginState({
				ipc,
				state: encoded.value
			}));
		});
	};
	const menubarItems = () => {
		const items = [...entries.values()].flatMap((entry) => {
			if (entry.registry !== MenubarItem.id) return [];
			const item = read(entry);
			return isMenubarItem(item) ? [{
				id: `${entry.plugin}.${item.id}`,
				plugin: entry.plugin,
				item
			}] : [];
		});
		const published = new Set(items.map((item) => item.id));
		return items.map((entry) => {
			const after = entry.item.after;
			const sibling = `${entry.plugin}.${after}`;
			return {
				...entry,
				after: after === void 0 ? void 0 : published.has(sibling) ? sibling : after
			};
		});
	};
	const scheduleMenubar = () => dispatch({ type: "menubar.scheduled" });
	const listMenubarItems = () => menubarItems().map((entry) => {
		const item = {
			menu: entry.item.menu,
			id: entry.id,
			label: entry.item.label,
			enabled: entry.item.enabled?.() ?? true
		};
		return entry.after === void 0 ? item : {
			...item,
			after: entry.after
		};
	});
	const server = (id) => {
		const sidecar = get();
		if (id === "sidecar") {
			if (!sidecar) return void 0;
			const authorization$1 = authorization(sidecar, sidecar.url);
			return {
				id,
				url: sidecar.url,
				headers: authorization$1 ? { authorization: authorization$1 } : {},
				sameMachine: true
			};
		}
		const endpoint = [...input.servers].reverse().flatMap(([window, list]) => {
			if (BrowserWindow.fromId(window)) return list;
			input.servers.delete(window);
			return [];
		}).find((item) => item.id === id);
		if (!endpoint) return void 0;
		const authorization$2 = endpoint.password ? `Basic ${Buffer.from(`opencode:${endpoint.password}`).toString("base64")}` : authorization(sidecar, endpoint.url);
		return {
			id,
			url: endpoint.url,
			headers: authorization$2 ? { authorization: authorization$2 } : {},
			sameMachine: !!sidecar && URL.canParse(endpoint.url) && new URL(endpoint.url).origin === sidecar.url,
			password: endpoint.password
		};
	};
	const about = {
		name: "opencode",
		version: VERSION,
		channel: "dev",
		platform: "desktop",
		packaged: app.isPackaged
	};
	const serverEndpoints = { get: server };
	const desktopLog = { write: (level, message, data) => input.write(level, message, data ?? {}) };
	const lifecycle = createLifecycle({
		loader: (id) => loader(id),
		enabled: (id) => manager.enabled(id),
		changed: () => changed(),
		state: input.appState,
		restart: input.restart,
		log: input.log
	});
	const loader = (id) => {
		const builtin = local.find((definition) => definition.id === id);
		if (builtin) {
			const main = builtin.mainEntry;
			if (!main) return void 0;
			return () => main().then((module) => prepare(id, {
				setup: module.default,
				i18n: builtin.i18n
			}));
		}
		const plugin = plugins.get(id);
		if (!plugin) return void 0;
		return async () => {
			if (!plugin.loaded.ok) throw plugin.loaded.cause;
			return prepare(id, {
				...plugin.loaded.value,
				options: plugin.bundle.options,
				client: sidecarClient
			});
		};
	};
	const sidecar = {};
	const unavailableClient = () => {
		if (!sidecar.module) throw new Error("The app's own server is unavailable");
		return sidecar.unavailable ??= sidecar.module.OpenCode.make({
			baseUrl: "http://unavailable.invalid/",
			fetch: () => Promise.reject(/* @__PURE__ */ new Error("The app's own server is unavailable"))
		});
	};
	const loadModule = async () => sidecar.module ??= await loadClient();
	const sidecarEndpoint = () => {
		const credentials = get();
		if (!credentials) return void 0;
		return {
			url: credentials.url,
			authorization: authorization(credentials, credentials.url)
		};
	};
	const clientFor = (module, endpoint) => {
		if (sidecar.active && sameHostEndpoint(sidecar.active.endpoint, endpoint)) return sidecar.active.client;
		const headers = endpoint.authorization ? { authorization: endpoint.authorization } : {};
		const client = module.OpenCode.make({
			baseUrl: endpoint.url,
			headers
		});
		sidecar.active = {
			endpoint,
			client
		};
		return client;
	};
	const sidecarClient = () => {
		const endpoint = sidecarEndpoint();
		if (!endpoint || !sidecar.module) return void 0;
		return clientFor(sidecar.module, endpoint);
	};
	let following = createHostState(nativeLocale());
	const resources = { catalogTimers: /* @__PURE__ */ new Map() };
	const quitting = () => isQuitting(input.appState());
	const dispatch = (event) => {
		const next = transitionHost(following, event);
		following = next.state;
		next.commands.forEach((command) => Promise.try(() => perform(command)).catch((cause) => input.log("plugin host command failed", {
			command: command.type,
			cause: String(cause)
		})));
	};
	const perform = (command) => {
		switch (command.type) {
			case "subscribe-credentials":
				resources.unfollow = onChange(() => dispatch({
					type: "endpoint.changed",
					endpoint: sidecarEndpoint(),
					quitting: quitting()
				}));
				return;
			case "unsubscribe-credentials":
				resources.unfollow?.();
				resources.unfollow = void 0;
				return;
			case "start-watch":
				watchPlugins(command.attempt, command.endpoint);
				return;
			case "schedule-watch-retry":
				clearTimeout(resources.watchTimer);
				resources.watchTimer = setTimeout(() => dispatch({
					type: "watch.retry-due",
					attempt: command.attempt,
					quitting: quitting()
				}), command.delayMs);
				return;
			case "cancel-watch":
				resources.watch?.abort();
				resources.watch = void 0;
				clearTimeout(resources.watchTimer);
				resources.watchTimer = void 0;
				return;
			case "start-list":
				listPlugins(command.attempt, command.endpoint, command.timeoutMs);
				return;
			case "cancel-list":
				resources.list?.abort();
				resources.list = void 0;
				clearTimeout(resources.listTimer);
				resources.listTimer = void 0;
				return;
			case "apply-listing":
				command.listing.skipped.forEach((revision, id) => skipped.set(id, revision));
				return applyPlugins(command.listing.plugins, command.listing.reserved, command.listing.parts);
			case "log-list-error": return input.log("plugin listing failed", { cause: String(command.cause) });
			case "queue-menubar": return queueMicrotask(() => dispatch({
				type: "menubar.flushed",
				quitting: quitting()
			}));
			case "publish-menubar":
				refreshMenu();
				return broadcast(new PluginMenubarItemsChanged({ items: listMenubarItems() }));
			case "load-catalog": {
				const owner = command.owner;
				const attempt = command.attempt;
				clearTimeout(resources.catalogTimers.get(owner));
				resources.catalogTimers.set(owner, setTimeout(() => dispatch({
					type: "catalog.timed-out",
					owner,
					attempt
				}), command.timeoutMs));
				Promise.try(command.load).then((module) => dispatch({
					type: "catalog.loaded",
					owner,
					attempt,
					messages: module.default
				}), () => dispatch({
					type: "catalog.failed",
					owner,
					attempt
				}));
				return;
			}
			case "cancel-catalog-timer":
				clearTimeout(resources.catalogTimers.get(command.owner));
				resources.catalogTimers.delete(command.owner);
				return;
			case "resolve-catalog-ready": return command.replies.forEach((reply) => reply());
		}
	};
	const watchPlugins = async (attempt, endpoint) => {
		resources.watch?.abort();
		const controller = new AbortController();
		resources.watch = controller;
		const module = await loadModule().catch((cause) => {
			input.log("plugin watch failed", { cause: String(cause) });
		});
		if (module && !controller.signal.aborted && isCurrentHostWatch(following, attempt)) await readEvents(clientFor(module, endpoint), attempt, controller.signal).catch(() => void 0);
		if (!controller.signal.aborted) dispatch({
			type: "watch.ended",
			attempt,
			quitting: quitting()
		});
	};
	const readEvents = async (client, attempt, signal) => {
		for await (const event of client.event.subscribe({ signal })) if (event.type === "plugin.updated" || event.type === "server.connected") dispatch({
			type: "relist.requested",
			watchAttempt: attempt,
			quitting: quitting()
		});
	};
	const listPlugins = async (attempt, endpoint, timeoutMs) => {
		resources.list?.abort();
		clearTimeout(resources.listTimer);
		const controller = new AbortController();
		resources.list = controller;
		resources.listTimer = setTimeout(() => dispatch({
			type: "list.timed-out",
			attempt,
			quitting: quitting()
		}), timeoutMs);
		const event = await readListing(endpoint, controller.signal).then((listing) => ({
			type: "list.succeeded",
			attempt,
			listing,
			quitting: quitting()
		}), (cause) => ({
			type: "list.failed",
			attempt,
			cause,
			quitting: quitting()
		}));
		if (controller.signal.aborted) return;
		clearTimeout(resources.listTimer);
		resources.list = void 0;
		resources.listTimer = void 0;
		dispatch(event);
	};
	const readListing = async (endpoint, signal) => {
		const client = clientFor(await loadModule(), endpoint);
		const shipped = (await client.plugin.list(void 0, { signal })).data.filter(shipsPluginGui);
		const reserved = shipped.flatMap((plugin) => pluginIdAvailable(plugin.id, definitions) ? [] : [plugin.id]);
		const parts = {
			server: new Set(shipped.flatMap((plugin) => plugin.features.server ? [plugin.id] : [])),
			tui: new Set(shipped.flatMap((plugin) => plugin.features.tui ? [plugin.id] : [])),
			unsupported: /* @__PURE__ */ new Set(),
			unreadable: /* @__PURE__ */ new Map()
		};
		const found = /* @__PURE__ */ new Map();
		const read = await Promise.all(shipped.filter((plugin) => !reserved.includes(plugin.id)).map((plugin) => readPlugin(client, plugin.id, {
			...parts,
			skipped: found
		}, signal)));
		return {
			plugins: new Map(read.flatMap((entry) => entry ? [entry] : [])),
			reserved,
			parts,
			skipped: found
		};
	};
	const readPlugin = async (client, id, parts, signal) => {
		const previous = plugins.get(id);
		const bundle = await client.plugin.gui({ id }, { signal }).then((result) => result.data, (cause) => {
			if (signal.aborted) return;
			input.log("plugin bundle read failed", {
				id,
				cause: String(cause)
			});
			if (!previous) parts.unreadable.set(id, cause instanceof Error ? cause.message : String(cause));
		});
		if (!bundle) return previous && [id, previous];
		if (previous?.bundle.revision === bundle.revision) return [id, previous];
		if (skipped.get(id) === bundle.revision) return void parts.unsupported.add(id);
		if (signal.aborted || quitting()) return void 0;
		const loaded = await evaluateMain(bundle.code).then((value) => ({
			ok: true,
			value
		}), (cause) => ({
			ok: false,
			cause
		}));
		if (!loaded.ok || runsOn(loaded.value, os)) return [id, {
			bundle,
			loaded
		}];
		parts.skipped.set(id, bundle.revision);
		parts.unsupported.add(id);
	};
	const applyPlugins = (next, reserved, parts) => {
		const removed = [...plugins.keys()].filter((id) => !next.has(id));
		const changes = [...next].flatMap(([id, plugin]) => {
			const previous = plugins.get(id);
			if (previous === plugin) return [];
			return [{
				id,
				plugin,
				previous
			}];
		});
		if (removed.length === 0 && changes.length === 0 && reserved.join("\n") === inventory.reserved.join("\n") && [...parts.server].join("\n") === [...inventory.server].join("\n") && [...parts.tui].join("\n") === [...inventory.tui].join("\n") && [...parts.unsupported].join("\n") === [...inventory.unsupported].join("\n") && [...parts.unreadable].join("\n") === [...inventory.unreadable].join("\n")) return;
		removed.forEach((id) => plugins.delete(id));
		changes.forEach((change) => plugins.set(change.id, change.plugin));
		inventory.reserved = reserved;
		inventory.server = parts.server;
		inventory.tui = parts.tui;
		inventory.unsupported = parts.unsupported;
		inventory.unreadable = parts.unreadable;
		changed();
		broadcast(new PluginGuisChanged(pluginGuis()));
		removed.forEach((id) => void lifecycle.deactivate(id, () => lifecycle.forget(id)));
		changes.forEach((change) => {
			if (!change.previous) return void lifecycle.activate(change.id);
			if (manager.enabled(change.id)) lifecycle.reload(change.id);
		});
	};
	const pluginGuis = () => ({
		plugins: [...plugins].map(([id, plugin]) => ({
			id,
			revision: plugin.bundle.revision,
			code: plugin.bundle.code,
			options: plugin.bundle.options
		})),
		reserved: inventory.reserved
	});
	/** A loaded revision of the plugin's main code; each instance of it gets its own setup context. */
	const prepare = (id, loaded) => (instance) => createContext(id, loaded, instance);
	const createContext = (id, loaded, instance) => {
		const signal = instance.scope.signal;
		const contribute = instance.contribute;
		contribute(() => embeds.releaseOwner(instance));
		const ready = new Promise((reply) => dispatch({
			type: "catalog.registered",
			owner: instance,
			catalog: loaded.i18n,
			reply
		}));
		contribute(() => dispatch({
			type: "catalog.unregistered",
			owner: instance
		}));
		const created = {};
		function add(registry, item) {
			if (signal.aborted) return () => {};
			const key = `${id}/${++nextEntry}`;
			entries.set(key, {
				registry: registry.id,
				plugin: id,
				value: item
			});
			if (registry.id === MenubarItem.id) scheduleMenubar();
			return contribute(() => {
				if (entries.delete(key) && registry.id === MenubarItem.id) scheduleMenubar();
			});
		}
		function list(registry) {
			return [...entries.values()].flatMap((entry) => {
				if (entry.registry !== registry.id) return [];
				const value = read(entry);
				return value === void 0 ? [] : [value];
			});
		}
		function provide(token, impl) {
			if (token.kind !== "ipc") throw new Error("Contracts are provided by a plugin's renderer entry");
			const ipc = token.id;
			if (ipc !== id && !ipc.startsWith(`${id}.`)) throw new Error(`${id} provides only its own Ipcs, not "${ipc}"`);
			const current = ipcs.get(ipc);
			if (current && current.plugin !== id) throw new Error(`Ipc "${ipc}" is already provided by ${current.plugin}`);
			const methods = new Map(Object.keys(token.spec.methods).map((name) => {
				const method = hasProperty(impl, name) ? impl[name] : void 0;
				if (!isMethod(method)) throw new Error(`Ipc "${ipc}" is missing method "${name}"`);
				return [name, (value, caller) => method.call(impl, value, caller)];
			}));
			const stateOf = hasProperty(impl, "state") ? impl.state : void 0;
			const provider = {
				plugin: id,
				signal,
				spec: token.spec,
				methods,
				state: isState(stateOf) ? (window) => stateOf.call(impl, window) : void 0
			};
			const live = () => ipcs.get(ipc) === provider;
			const dispose = signal.aborted ? () => {} : contribute(() => {
				if (!live()) return;
				ipcs.delete(ipc);
				broadcast(new PluginAvailable({
					ipc,
					available: false
				}));
			});
			if (!signal.aborted) {
				ipcs.set(ipc, provider);
				broadcast(new PluginAvailable({
					ipc,
					available: true
				}));
				pushState(ipc, provider);
			}
			return {
				changed(window) {
					if (live()) pushState(ipc, provider, window);
				},
				emit(name, data, window) {
					if (!live()) return;
					const schema = token.spec.events?.[name];
					if (!schema) throw new Error(`Ipc "${ipc}" has no event "${name}"`);
					const encoded = encodeUnknownExit(schema)(data);
					if (isFailure(encoded)) return input.log("plugin event encoding failed", {
						ipc,
						name,
						cause: String(encoded.cause)
					});
					const event = new PluginEvent({
						ipc,
						name,
						data: encoded.value
					});
					if (window === void 0) return broadcast(event);
					const win = BrowserWindow.fromId(window);
					if (win && !win.isDestroyed()) emitIpcEvent(win.webContents, event);
				},
				dispose
			};
		}
		const builtin = definitions.some((definition) => definition.id === id);
		const storage = () => created.storage ??= createStorage(input.state, getStore, id, builtin);
		const context = {
			id,
			options: loaded.options ?? {},
			get client() {
				return loaded.client?.() ?? unavailableClient();
			},
			signal,
			onCleanup: (fn) => void instance.scope.addFinalizer(fn),
			get storage() {
				return storage();
			},
			get log() {
				return desktopLog;
			},
			get lifecycle() {
				return created.lifecycle ??= { restart: (handoff) => lifecycle.restart(instance.scope, handoff) };
			},
			get app() {
				return about;
			},
			get serverEndpoints() {
				return serverEndpoints;
			},
			get windows() {
				return created.windows ??= {
					get: (window) => getMainWindows().find((win) => win.id === window),
					list: getMainWindows,
					focused: () => getLastFocusedWindow() ?? void 0,
					on: (event, handler) => {
						if (event === "open") return contribute(onMainWindow(handler));
						closed.add(handler);
						return contribute(() => {
							closed.delete(handler);
						});
					}
				};
			},
			get embeds() {
				return created.embeds ??= { create: (view, win) => {
					const embed = embeds.create(instance, view, win);
					if (signal.aborted) contribute(embed.dispose);
					return embed;
				} };
			},
			get cli() {
				return input.cli;
			},
			add,
			list,
			provide,
			t: (key, params) => formatNativeTemplate(selectCatalogMessages(following, instance)[key] ?? nativeMessage(key) ?? key, params),
			plural: (key, count, params) => {
				const category = nativePluralCategory(count);
				const messages = selectCatalogMessages(following, instance);
				const template = messages[`${key}.${category}`] ?? messages[`${key}.other`] ?? nativeMessage(`${key}.${category}`) ?? nativeMessage(`${key}.other`) ?? key;
				return formatNativeTemplate(template, {
					...params,
					count
				});
			}
		};
		return {
			ready,
			setup: () => Promise.resolve(loaded.setup(context)).then((cleanup) => {
				if (isFunction(cleanup)) instance.scope.addFinalizer(cleanup);
			})
		};
	};
	const known = (id) => local.some((definition) => definition.id === id) || plugins.has(id);
	const installed = () => [
		...local.map((definition) => ({
			id: definition.id,
			builtin: true,
			enabled: manager.enabled(definition.id),
			...failure(lifecycle.failure(definition.id))
		})),
		...[...plugins.keys()].map((id) => ({
			id,
			builtin: false,
			enabled: manager.enabled(id),
			server: inventory.server.has(id),
			tui: inventory.tui.has(id),
			...failure(lifecycle.failure(id))
		})),
		...[...inventory.unsupported].map((id) => ({
			id,
			builtin: false,
			enabled: manager.enabled(id),
			server: inventory.server.has(id),
			tui: inventory.tui.has(id),
			unsupported: true
		})),
		...[...inventory.unreadable].map(([id, error]) => ({
			id,
			builtin: false,
			enabled: manager.enabled(id),
			server: inventory.server.has(id),
			tui: inventory.tui.has(id),
			error
		}))
	];
	const wire = (win) => {
		const window = win.id;
		const forget = () => input.subscriptions.forEach((ids) => ids.delete(window));
		win.webContents.on("did-start-navigation", (event) => {
			if (!event.isMainFrame || event.isSameDocument) return;
			embeds.reset(window);
			forget();
		});
		win.once("closed", () => {
			embeds.releaseWindow(window);
			forget();
			input.servers.delete(window);
			closed.forEach((listener) => listener(win));
		});
	};
	getMainWindows().forEach(wire);
	onMainWindow(wire);
	onNativeTranslations(() => dispatch({
		type: "locale.changed",
		locale: nativeLocale()
	}));
	setMenubarProvider(() => menubarItems().map((entry) => ({
		menu: entry.item.menu,
		id: entry.id,
		label: entry.item.label,
		after: entry.after,
		enabled: () => entry.item.enabled?.() ?? true,
		run: () => entry.item.run(getLastFocusedWindow() ?? void 0)
	})));
	const activateAll = () => Promise.all([...local.map((definition) => definition.id), ...plugins.keys()].map((id) => lifecycle.activate(id)));
	return {
		/**
		* Activates every enabled main plugin, then follows the app's own server for plugin GUIs. The app calls this once
		* its first window is up.
		*/
		async start() {
			dispatch({
				type: "started",
				endpoint: sidecarEndpoint(),
				quitting: quitting()
			});
			await activateAll();
		},
		/** Starts again what `stop` stopped, once a restart handoff failed. */
		async resume() {
			dispatch({
				type: "resumed",
				endpoint: sidecarEndpoint(),
				quitting: quitting()
			});
			await activateAll();
		},
		/** Stops every main plugin but one a restart handoff keeps, and the follow of the server; awaits their cleanups. */
		async stop() {
			dispatch({ type: "stopped" });
			await lifecycle.stop();
		},
		/** Activates the plugin whose id the Ipc's id names, ahead of `start`. */
		demand(ipc) {
			if (ipcs.has(ipc)) return;
			const id = [...local.map((definition) => definition.id), ...plugins.keys()].find((id) => ipc === id || ipc.startsWith(`${id}.`));
			if (id) lifecycle.activate(id);
		},
		snapshot(ipc, window) {
			const provider = ipcs.get(ipc);
			if (!provider) return { available: false };
			const schema = provider.spec.state;
			const stateOf = provider.state;
			if (!schema || !stateOf) return { available: true };
			const encoded = encodeUnknownExit(schema)(stateOf(window));
			if (isSuccess(encoded)) return {
				available: true,
				state: encoded.value
			};
			input.log("plugin state encoding failed", {
				ipc,
				cause: String(encoded.cause)
			});
			return { available: true };
		},
		async call(request, caller) {
			const provider = ipcs.get(request.ipc);
			if (!provider) throw new PluginError("unavailable");
			const method = provider.methods.get(request.method);
			const spec = method ? provider.spec.methods[request.method] : void 0;
			if (!method || !spec) throw new PluginError("method");
			const value = spec.input ? await decodeUnknownPromise(spec.input)(request.input).catch((cause) => {
				throw new PluginError("input", {
					cause,
					message: String(cause)
				});
			}) : void 0;
			if (ipcs.get(request.ipc) !== provider) throw new PluginError("unavailable");
			const output = await method(value, {
				window: caller.window,
				signal: AbortSignal.any([caller.signal, provider.signal])
			});
			if (!spec.output) return void 0;
			return encodeUnknownPromise(spec.output)(output).catch((cause) => {
				throw new PluginError("output", {
					cause,
					message: String(cause)
				});
			});
		},
		embed: (window, id, layout) => embeds.layout(window, id, layout),
		capture: (window, id) => embeds.capture(window, id).then((image) => image ? new Uint8Array(image.toJPEG(90)) : void 0),
		listMenubarItems,
		runMenubarItem(window, id) {
			const entry = menubarItems().find((item) => item.id === id);
			if (!entry || !(entry.item.enabled?.() ?? true)) return;
			entry.item.run(BrowserWindow.fromId(window) ?? void 0);
		},
		list: installed,
		async enable(id) {
			if (!known(id)) throw new PluginError("notFound");
			manager.setEnabled(id, true);
			changed();
			await lifecycle.activate(id);
		},
		async disable(id) {
			if (!known(id)) throw new PluginError("notFound");
			manager.setEnabled(id, false);
			changed();
			await lifecycle.deactivate(id);
			lifecycle.forget(id);
			changed();
		},
		/**
		* Reloads a plugin. A reload that fails keeps the last good revision running. A plugin reruns the bundle main
		* last read; a new bundle arrives through the listing.
		*/
		async reload(id) {
			if (!known(id)) throw new PluginError("notFound");
			await lifecycle.reload(id);
			changed();
		},
		/** The plugin GUIs main runs, which windows load; `PluginGuisChanged` brings each change. */
		pluginGuis
	};
}
function read(entry) {
	return isGetter(entry.value) ? entry.value() : entry.value;
}
function isGetter(value) {
	return isFunction(value);
}
function isMethod(value) {
	return isFunction(value);
}
function isState(value) {
	return isFunction(value);
}
function isMenubarItem(value) {
	return hasProperty(value, "id") && hasProperty(value, "menu") && hasProperty(value, "label") && hasProperty(value, "run") && isString(value.id) && isString(value.label) && isFunction(value.run);
}
function failure(value) {
	return value === void 0 ? {} : { error: value };
}
//#endregion
export { createHost, builtinMainContext as i, MenubarItem as n, plugin_exports as r, host_exports as t };
