import { Bt as decodeUnknownOption, Dg as isBoolean, Lg as isString, M as Int, N as Json, X as Record, Xt as fromJsonString, ar as optional, at as String$1, l as Boolean$1, ot as Struct, ph as isSome, uh as getOrUndefined } from "./Latch-oSncnOpo.js";
import { enableCompileCache } from "node:module";
import electron, { BrowserWindow, app, ipcMain, nativeTheme, net, protocol, screen, shell } from "electron";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, pathToFileURL } from "node:url";
//#region src/main/lifecycle/marks.ts
var marks = { entry: Date.now() };
//#endregion
//#region ../gui-plugins/src/debug/options.ts
/**
* Builds with the debug tools: the dev server and Beta, as for the debug bar's Motion tools. Stable builds never run
* memory diagnostics or open a debugging port, whatever the environment says.
*/
function debugBuild(build) {
	return !build.packaged || build.channel === "beta";
}
/** Invalid values disable diagnostics rather than turning a bad interval into a hot timer. */
function memoryLogInterval(value) {
	if (!value || !/^\d+(\.\d+)?$/.test(value)) return void 0;
	const seconds = Number(value);
	return seconds >= 1 && seconds <= 2147483 ? seconds * 1e3 : void 0;
}
var VERSION = app.isPackaged ? app.getVersion() : process.env.OPENCODE_VERSION ?? app.getVersion();
var appNames = {
	dev: "OpenCode Dev",
	beta: "OpenCode Beta",
	prod: "OpenCode"
};
var appIDs = {
	dev: "ai.opencode.desktop.dev",
	beta: "ai.opencode.desktop.beta",
	prod: "ai.opencode.desktop"
};
var APP_NAME = app.isPackaged ? appNames["dev"] : "Apna OpenCode";
var APP_ID = app.isPackaged ? appIDs["dev"] : "ai.opencode.desktop.dev";
//#endregion
//#region src/main/diagnostics/options.ts
/**
* The remote debugging port, only in debug builds. The dev server opens 9222 unless told otherwise; Beta opens one only
* when `OPENCODE_DESKTOP_REMOTE_DEBUGGING_PORT` names it. `0` lets Chromium pick a free port.
*/
function remoteDebuggingPort(build, value) {
	if (!debugBuild(build)) return void 0;
	if (value === void 0) return build.packaged ? void 0 : "9222";
	if (!/^\d+$/.test(value)) return void 0;
	return Number(value) <= 65535 ? String(Number(value)) : void 0;
}
//#endregion
//#region src/main/lifecycle/configure.ts
var testOnboarding = process.env.OPENCODE_TEST_ONBOARDING === "1";
var jsCallStackFeature = "DocumentPolicyIncludeJSCallStacksInCrashReports";
function configureApplication() {
	try {
		process.chdir(homedir());
	} catch {}
	process.env.OPENCODE_DISABLE_EMBEDDED_WEB_UI = "true";
	app.setName(APP_NAME);
	app.setAppUserModelId(APP_ID);
	app.commandLine.appendSwitch("proxy-bypass-list", "<-loopback>");
	const features = app.commandLine.getSwitchValue("enable-features");
	app.commandLine.appendSwitch("enable-features", features ? `${jsCallStackFeature},${features}` : jsCallStackFeature);
	if (process.platform === "linux") app.commandLine.appendSwitch("disable-smooth-scrolling");
	const build = {
		packaged: app.isPackaged,
		channel: "dev"
	};
	const debugPort = remoteDebuggingPort(build, process.env.OPENCODE_DESKTOP_REMOTE_DEBUGGING_PORT);
	if (debugPort) app.commandLine.appendSwitch("remote-debugging-port", debugPort);
	if (app.commandLine.hasSwitch("remote-debugging-port")) app.commandLine.appendSwitch("remote-debugging-address", "127.0.0.1");
	if (debugBuild(build) && memoryLogInterval(process.env.OPENCODE_DESKTOP_MEMORY_LOG) !== void 0) app.commandLine.appendSwitch("enable-precise-memory-info");
	const testRoot = createTestRoot();
	app.setPath("userData", testRoot ? path.join(testRoot, "desktop") : path.join(app.getPath("appData"), APP_ID));
	if (testRoot) {
		app.setPath("sessionData", path.join(testRoot, "session"));
		if (testOnboarding) app.setPath("documents", path.join(testRoot, "documents"));
	}
	enableCompileCache(path.join(app.getPath("userData"), "compile-cache"));
}
function acquireApplicationLock() {
	if (app.requestSingleInstanceLock()) return true;
	app.quit();
	return false;
}
function createTestRoot() {
	const root = testOnboarding ? path.join(tmpdir(), `opencode-onboarding-${randomUUID()}`) : process.env.OPENCODE_DESKTOP_TEST_ROOT;
	if (!root) return void 0;
	if (testOnboarding) rmSync(root, {
		recursive: true,
		force: true
	});
	for (const dir of [
		"data",
		"config",
		"cache",
		"state",
		"desktop",
		"session",
		"documents"
	]) mkdirSync(path.join(root, dir), { recursive: true });
	if (testOnboarding) process.env.OPENCODE_DB = ":memory:";
	process.env.XDG_DATA_HOME = path.join(root, "data");
	process.env.XDG_CONFIG_HOME = path.join(root, "config");
	process.env.XDG_CACHE_HOME = path.join(root, "cache");
	process.env.XDG_STATE_HOME = path.join(root, "state");
	return root;
}
//#endregion
//#region src/main/service/sidecar-probe.ts
var probe;
function startSidecarProbe() {
	if (!app.isPackaged) return;
	const version = bundledVersion();
	if (version === "") return;
	probe = import("./service-TLAGzubs.js").then(({ Service }) => Service.discover({ version })).catch(() => void 0);
}
/** The probe's result, once: a later connect must not adopt a service that may have exited since boot. */
function takeSidecarProbe() {
	const result = probe ?? Promise.resolve(void 0);
	probe = void 0;
	return result;
}
function bundledVersion() {
	try {
		return readFileSync(path.join(process.resourcesPath, "opencode-cli.version"), "utf8").trim();
	} catch {
		return "";
	}
}
//#endregion
//#region src/shared/ipc-transport.ts
var IpcTransportPort = "desktop-rpc-port";
var DragCancelEvent = "opencode:drag-cancel";
var WindowSnapshotChannel = "desktop-window-snapshot";
function windowDataFile(id) {
	return `opencode.window.${id.replace(/[^a-zA-Z0-9._-]/g, "-")}.dat`;
}
var rendererHost = "renderer";
function loadWindow(win, html) {
	const devUrl = process.env.ELECTRON_RENDERER_URL;
	if (devUrl) {
		win.loadURL(new URL(html, devUrl).toString());
		return;
	}
	win.loadURL(`oc://${rendererHost}/${html}`);
}
function isRendererUrl(value, html = false) {
	if (!value || !URL.canParse(value)) return false;
	const url = new URL(value);
	if (html && !url.pathname.endsWith(".html")) return false;
	if (url.protocol === `oc:` && url.host === "renderer") return true;
	const devUrl = process.env.ELECTRON_RENDERER_URL;
	if (!devUrl || !URL.canParse(devUrl)) return false;
	return url.origin === new URL(devUrl).origin;
}
function registerRendererScheme() {
	electron.protocol.registerSchemesAsPrivileged([{
		scheme: "oc",
		privileges: {
			secure: true,
			standard: true,
			supportFetchAPI: true,
			corsEnabled: true,
			stream: true,
			codeCache: true
		}
	}]);
}
//#endregion
//#region src/main/storage/migration.gen.ts
var migrations = [
	{
		id: "20260906234153_drafts",
		statements: ["CREATE TABLE `blob` (\n	`id` text PRIMARY KEY,\n	`data` blob NOT NULL\n);", "CREATE TABLE `document` (\n	`key` text PRIMARY KEY,\n	`value` text NOT NULL\n);"]
	},
	{
		id: "20260906234220_state",
		statements: ["CREATE TABLE `state` (\n	`name` text NOT NULL,\n	`key` text NOT NULL,\n	`value` text NOT NULL,\n	`updated_at` integer NOT NULL,\n	CONSTRAINT `state_pk` PRIMARY KEY(`name`, `key`)\n);"]
	},
	{
		id: "20260907031611_blob-touched",
		statements: ["ALTER TABLE `blob` ADD `touched_at` integer DEFAULT 0 NOT NULL;"]
	},
	{
		id: "20260930041551_extension",
		statements: ["CREATE TABLE `extension` (\n	`id` text PRIMARY KEY,\n	`enabled` integer DEFAULT true NOT NULL,\n	`manifest` text,\n	`revision` text\n);", "CREATE TABLE `extension_file` (\n	`extension_id` text NOT NULL,\n	`path` text NOT NULL,\n	`data` blob NOT NULL,\n	CONSTRAINT `extension_file_pk` PRIMARY KEY(`extension_id`, `path`)\n);"]
	},
	{
		id: "20261013231314_drop-extension-files",
		statements: ["DROP TABLE `extension_file`;"]
	},
	{
		id: "20261014210000_rename-extension-to-plugin",
		statements: ["ALTER TABLE `extension` RENAME TO `plugin`;", "CREATE VIEW `extension` AS SELECT `id`, `enabled`, `manifest`, `revision` FROM `plugin`;"]
	}
];
//#endregion
//#region src/main/storage/migration.ts
/** The desktop journal, usable by the early preload read without loading Drizzle or Effect. */
function migrateDatabase(db) {
	if (isCliDatabase(db)) throw new Error("drafts.sqlite is the OpenCode CLI database");
	db.exec("CREATE TABLE IF NOT EXISTS migration (id TEXT PRIMARY KEY, time_completed INTEGER NOT NULL)");
	const applied = new Set(db.prepare("SELECT id FROM migration").all().map((row) => row.id));
	const legacy = applied.size === 0 && db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'document'").get() !== void 0;
	const pending = migrations.filter((migration) => !applied.has(migration.id));
	if (pending.length === 0) return [];
	db.exec("BEGIN");
	try {
		const record = db.prepare("INSERT INTO migration (id, time_completed) VALUES (?, ?)");
		pending.forEach((migration, index) => {
			if (!(legacy && index === 0)) migration.statements.forEach((statement) => db.exec(statement));
			record.run(migration.id, Date.now());
		});
		db.exec("COMMIT");
	} catch (error) {
		db.exec("ROLLBACK");
		throw error;
	}
	return pending.map((migration) => migration.id);
}
/** The CLI's opencode.db, reached through a symlink or a copy. Both apps define `blob` and `migration`, so they can't share one file. */
function isCliDatabase(db) {
	return db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('session', 'session_v2')").get() !== void 0;
}
//#endregion
//#region src/main/plugin/enable-state.ts
/** Explicit settings only: both startup readers and the manager resolve absent rows through the same SDK rule. */
function readEnableState(db) {
	return db.prepare("SELECT id, enabled FROM plugin").all().map((row) => {
		return {
			id: row.id,
			enabled: row.enabled === 1
		};
	});
}
//#endregion
//#region src/main/storage/window-snapshot.ts
function readWindowSnapshot(userData, names) {
	const file = path.join(userData, "drafts.sqlite");
	if (!existsSync(file)) return {
		storage: {},
		plugins: []
	};
	try {
		const legacy = readdirSync(userData).some((name) => name === "default.dat" || /^opencode\..+\.dat$/.test(name));
		const db = new DatabaseSync(file);
		try {
			migrateDatabase(db);
			const rows = db.prepare("SELECT key, value FROM state WHERE name = ?");
			return {
				storage: legacy ? {} : Object.fromEntries(names.map((name) => [name, {
					items: Object.fromEntries(rows.all(name).map((row) => [row.key, row.value])),
					revision: 0
				}])),
				plugins: readEnableState(db)
			};
		} finally {
			db.close();
		}
	} catch {
		return { storage: {} };
	}
}
//#endregion
//#region src/main/storage/snapshot.ts
var provider = (names) => readWindowSnapshot(app.getPath("userData"), names);
function setStorageSnapshotProvider(next) {
	provider = next;
}
var observer;
function setStorageSnapshotObserver(next) {
	observer = next;
	return () => {
		if (observer === next) observer = void 0;
	};
}
function registerStorageSnapshotHandler() {
	ipcMain.handle(WindowSnapshotChannel, (event, names) => {
		if (!isRendererUrl(event.senderFrame?.url)) return { storage: {} };
		if (!Array.isArray(names) || !names.every((name) => typeof name === "string")) return { storage: {} };
		observer?.(event.sender);
		return provider(names);
	});
}
//#endregion
//#region src/main/files/external-url.ts
function resolveExternalURL(value) {
	if (!URL.canParse(value)) return void 0;
	const url = new URL(value);
	if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") return url.href;
}
function resolveLocalFilePath(value) {
	if (!URL.canParse(value)) return void 0;
	const url = new URL(value);
	if (url.protocol !== "file:" || url.hostname) return void 0;
	try {
		return fileURLToPath(url);
	} catch {
		return;
	}
}
//#endregion
//#region src/shared/window-bootstrap.ts
var prefix = "--opencode-window=";
function windowBootstrapArgument(bootstrap) {
	return prefix + encodeURIComponent(JSON.stringify(bootstrap));
}
//#endregion
//#region src/main/storage/keys.ts
var SETTINGS_STORE = "opencode.settings";
var FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY = "firstLaunchOnboardingComplete";
var PINCH_ZOOM_ENABLED_KEY = "pinchZoomEnabled";
var ZOOM_LEVEL_KEY = "zoomLevel";
var SPELLCHECK_ENABLED_KEY = "spellcheckEnabled";
var SPELLCHECK_LANGUAGES_KEY = "spellcheckLanguages";
var BACKGROUND_COLOR_KEY = "backgroundColor";
var WINDOW_IDS_KEY = "windowIds";
var BUNDLED_CLI_VERSION_KEY = "bundledCliVersion";
//#endregion
//#region src/main/storage/store.ts
/** The file: one JSON object, each key a setting whose reader decodes its value. */
var SettingsFile = fromJsonString(Record(String$1, Json));
var cache = /* @__PURE__ */ new Map();
function getStore(name = SETTINGS_STORE) {
	const cached = cache.get(name);
	if (cached) return cached;
	const next = createSettingsStore(path.join(electron.app.getPath("userData"), name));
	cache.set(name, next);
	return next;
}
function createSettingsStore(file) {
	let data = read(file);
	const write = () => {
		mkdirSync(path.dirname(file), { recursive: true });
		writeFileSync(`${file}.tmp`, JSON.stringify(data, null, "	"));
		renameSync(`${file}.tmp`, file);
	};
	return {
		path: file,
		get: (key) => data[key],
		set: (key, value) => {
			if (value === void 0) throw new TypeError(`Use \`delete()\` to clear values: ${key}`);
			data = {
				...data,
				[key]: value
			};
			write();
		},
		delete: (key) => {
			data = Object.fromEntries(Object.entries(data).filter(([item]) => item !== key));
			write();
		}
	};
}
function read(file) {
	if (!existsSync(file)) return {};
	const parsed = decodeUnknownOption(SettingsFile)(readFileSync(file, "utf8"));
	if (isSome(parsed)) return parsed.value;
	renameSync(file, `${file}.corrupt`);
	return {};
}
//#endregion
//#region src/main/windows/bootstrap.ts
function windowBootstrap(id) {
	const complete = getStore().get(FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY);
	return {
		id,
		firstLaunchPending: isBoolean(complete) ? !complete : void 0,
		packaged: app.isPackaged
	};
}
function windowArguments(id) {
	return [windowBootstrapArgument(windowBootstrap(id))];
}
//#endregion
//#region ../ui/src/theme/color.ts
function clamp(v, min, max) {
	return Math.max(min, Math.min(max, v));
}
function hue(v) {
	return (v % 360 + 360) % 360;
}
function hexToRgb(hex) {
	const h = hex.replace("#", "");
	const full = h.length === 3 || h.length === 4 ? h.split("").map((c) => c + c).join("") : h;
	const rgb = full.length === 8 ? full.slice(0, 6) : full;
	const num = parseInt(rgb, 16);
	return {
		r: (num >> 16 & 255) / 255,
		g: (num >> 8 & 255) / 255,
		b: (num & 255) / 255
	};
}
function rgbToHex(r, g, b) {
	const toHex = (v) => {
		const clamped = clamp(v, 0, 1);
		return Math.round(clamped * 255).toString(16).padStart(2, "0");
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function linearToSrgb(c) {
	if (c <= .0031308) return c * 12.92;
	return 1.055 * Math.pow(c, 1 / 2.4) - .055;
}
function srgbToLinear(c) {
	if (c <= .04045) return c / 12.92;
	return Math.pow((c + .055) / 1.055, 2.4);
}
function rgbToOklch(r, g, b) {
	const lr = srgbToLinear(r);
	const lg = srgbToLinear(g);
	const lb = srgbToLinear(b);
	const l_ = .4122214708 * lr + .5363325363 * lg + .0514459929 * lb;
	const m_ = .2119034982 * lr + .6806995451 * lg + .1073969566 * lb;
	const s_ = .0883024619 * lr + .2817188376 * lg + .6299787005 * lb;
	const l = Math.cbrt(l_);
	const m = Math.cbrt(m_);
	const s = Math.cbrt(s_);
	const L = .2104542553 * l + .793617785 * m - .0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s;
	const bOk = .0259040371 * l + .7827717662 * m - .808675766 * s;
	const C = Math.sqrt(a * a + bOk * bOk);
	let H = Math.atan2(bOk, a) * (180 / Math.PI);
	if (H < 0) H += 360;
	return {
		l: L,
		c: C,
		h: H
	};
}
function oklchToRgb(oklch) {
	const { l: L, c: C, h: H } = oklch;
	const a = C * Math.cos(H * Math.PI / 180);
	const b = C * Math.sin(H * Math.PI / 180);
	const l = L + .3963377774 * a + .2158037573 * b;
	const m = L - .1055613458 * a - .0638541728 * b;
	const s = L - .0894841775 * a - 1.291485548 * b;
	const l3 = l * l * l;
	const m3 = m * m * m;
	const s3 = s * s * s;
	const lr = 4.0767416621 * l3 - 3.3077115913 * m3 + .2309699292 * s3;
	const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - .3413193965 * s3;
	const lb = -.0041960863 * l3 - .7034186147 * m3 + 1.707614701 * s3;
	return {
		r: linearToSrgb(lr),
		g: linearToSrgb(lg),
		b: linearToSrgb(lb)
	};
}
function hexToOklch(hex) {
	const { r, g, b } = hexToRgb(hex);
	return rgbToOklch(r, g, b);
}
function fitOklch(oklch) {
	const base = {
		l: clamp(oklch.l, 0, 1),
		c: Math.max(0, oklch.c),
		h: hue(oklch.h)
	};
	const rgb = oklchToRgb(base);
	if (rgb.r >= 0 && rgb.r <= 1 && rgb.g >= 0 && rgb.g <= 1 && rgb.b >= 0 && rgb.b <= 1) return base;
	let c = base.c;
	for (let i = 0; i < 24; i++) {
		c *= .9;
		const next = {
			...base,
			c
		};
		const out = oklchToRgb(next);
		if (out.r >= 0 && out.r <= 1 && out.g >= 0 && out.g <= 1 && out.b >= 0 && out.b <= 1) return next;
	}
	return {
		...base,
		c: 0
	};
}
function oklchToHex(oklch) {
	const { r, g, b } = oklchToRgb(fitOklch(oklch));
	return rgbToHex(r, g, b);
}
function generateScale(seed, isDark) {
	const base = hexToOklch(seed);
	const scale = [];
	const lightSteps = isDark ? [
		.118,
		.138,
		.167,
		.202,
		.246,
		.304,
		.378,
		.468,
		clamp(base.l * .825, .53, .705),
		clamp(base.l * .89, .61, .79),
		clamp(base.l + .033, .868, .943),
		.984
	] : [
		.993,
		.983,
		.962,
		.936,
		.906,
		.866,
		.811,
		.74,
		base.l,
		Math.max(0, base.l - .036),
		.49,
		.27
	];
	const chromaMultipliers = isDark ? [
		.52,
		.68,
		.86,
		1.02,
		1.14,
		1.24,
		1.36,
		1.48,
		1.56,
		1.64,
		1.62,
		1.15
	] : [
		.12,
		.24,
		.46,
		.68,
		.84,
		.98,
		1.08,
		1.16,
		1.22,
		1.26,
		1.18,
		.98
	];
	for (let i = 0; i < 12; i++) scale.push(oklchToHex({
		l: lightSteps[i],
		c: base.c * chromaMultipliers[i],
		h: base.h
	}));
	return scale;
}
function generateNeutralScale(seed, isDark, ink) {
	if (ink) {
		const base = hexToOklch(seed);
		const lift = (tone) => oklchToHex({
			l: base.l + (1 - base.l) * tone,
			c: base.c * Math.max(0, 1 - tone),
			h: base.h
		});
		const sink = (tone) => oklchToHex({
			l: base.l * (1 - tone),
			c: base.c * Math.max(0, 1 - tone * (isDark ? .12 : .3)),
			h: base.h
		});
		const bg = isDark ? sink(clamp(.19 + Math.max(0, base.l - .12) * .33 + base.c * 1.95, .17, .27)) : base.l < .82 ? lift(.86) : lift(clamp(.1 + base.c * 3.2 + Math.max(0, .95 - base.l) * .35, .1, .28));
		return (isDark ? [
			0,
			.018,
			.039,
			.064,
			.097,
			.143,
			.212,
			.31,
			.46,
			.649,
			.845,
			.984
		] : [
			0,
			.022,
			.042,
			.068,
			.102,
			.146,
			.208,
			.296,
			.432,
			.61,
			.81,
			.965
		]).map((step) => mixColors(bg, ink, step));
	}
	const base = hexToOklch(seed);
	const scale = [];
	const neutralChroma = Math.min(base.c, isDark ? .068 : .04);
	const lightSteps = isDark ? [
		.138,
		.156,
		.178,
		.202,
		.232,
		.272,
		.326,
		.404,
		clamp(base.l * .83, .43, .55),
		.596,
		.719,
		.956
	] : [
		.991,
		.979,
		.964,
		.946,
		.931,
		.913,
		.891,
		.83,
		base.l,
		.617,
		.542,
		.205
	];
	for (let i = 0; i < 12; i++) scale.push(oklchToHex({
		l: lightSteps[i],
		c: neutralChroma,
		h: base.h
	}));
	return scale;
}
function mixColors(color1, color2, amount) {
	const c1 = hexToOklch(color1);
	const c2 = hexToOklch(color2);
	const delta = ((c2.h - c1.h) % 360 + 540) % 360 - 180;
	return oklchToHex({
		l: c1.l + (c2.l - c1.l) * amount,
		c: c1.c + (c2.c - c1.c) * amount,
		h: c1.h + delta * amount
	});
}
function shift(color, value) {
	const base = hexToOklch(color);
	return oklchToHex({
		l: base.l + (value.l ?? 0),
		c: base.c * (value.c ?? 1),
		h: base.h + (value.h ?? 0)
	});
}
function blend(color, background, alpha) {
	const fg = hexToRgb(color);
	const bg = hexToRgb(background);
	return rgbToHex(fg.r * alpha + bg.r * (1 - alpha), fg.g * alpha + bg.g * (1 - alpha), fg.b * alpha + bg.b * (1 - alpha));
}
function withAlpha(color, alpha) {
	const { r, g, b } = hexToRgb(color);
	return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
}
//#endregion
//#region ../ui/src/theme/resolve.ts
function resolveThemeVariant(variant, isDark) {
	const colors = getColors(variant);
	const { overrides = {} } = variant;
	const neutral = generateNeutralScale(colors.neutral, isDark, colors.ink);
	const primary = generateScale(colors.primary, isDark);
	const accent = generateScale(colors.accent, isDark);
	const success = generateScale(colors.success, isDark);
	const warning = generateScale(colors.warning, isDark);
	const error = generateScale(colors.error, isDark);
	const info = generateScale(colors.info, isDark);
	const interactive = generateScale(colors.interactive, isDark);
	const amber = generateScale(shift(colors.warning, isDark ? {
		h: -16,
		l: -.058,
		c: 1.14
	} : {
		h: -22,
		l: -.082,
		c: .94
	}), isDark);
	const blue = generateScale(shift(colors.interactive, {
		h: -12,
		l: .128,
		c: 1.12
	}), isDark);
	const diffAdd = generateScale(colors.diffAdd ?? shift(colors.success, {
		c: isDark ? .7 : .55,
		l: isDark ? -.18 : .14
	}), isDark);
	const diffDelete = generateScale(colors.diffDelete ?? shift(colors.error, {
		c: isDark ? .82 : .7,
		l: isDark ? -.08 : .08
	}), isDark);
	const ink = colors.ink ?? colors.neutral;
	const tint = colors.compact ? hexToOklch(ink) : void 0;
	const body = tint ? shift(ink, {
		l: isDark ? Math.max(0, .88 - tint.l) * .4 : -Math.max(0, tint.l - .18) * .24,
		c: isDark ? 1.04 : 1.02
	}) : void 0;
	const backgroundOverride = overrides["background-base"];
	const backgroundHex = getHex(backgroundOverride);
	const overlay = Boolean(backgroundOverride) && !backgroundHex;
	const content = (seed, scale) => {
		const base = hexToOklch(seed);
		return shift(isDark ? base.l > .84 ? shift(seed, { c: 1.18 }) : scale[10] : scale[10], {
			l: isDark ? .034 : -.024,
			c: isDark ? 1.3 : 1.18
		});
	};
	const modified = () => {
		if (!colors.compact) return isDark ? "#ffba92" : "#FF8C00";
		const warningHue = hexToOklch(colors.warning).h;
		const deleteHue = hexToOklch(colors.diffDelete ?? colors.error).h;
		if (Math.abs(((deleteHue - warningHue) % 360 + 540) % 360 - 180) < 48) return isDark ? "#ffba92" : "#FF8C00";
		return content(colors.warning, warning);
	};
	const surface = (seed, alpha) => {
		return {
			base: alphaTone(seed, alpha.base),
			weak: alphaTone(seed, alpha.weak),
			weaker: alphaTone(seed, alpha.weaker),
			strong: alphaTone(seed, alpha.strong),
			stronger: alphaTone(seed, alpha.stronger)
		};
	};
	const background = backgroundHex ?? neutral[0];
	const alphaTone = (color, alpha) => overlay ? withAlpha(color, alpha) : blend(color, background, alpha);
	const borderTone = (light, dark) => alphaTone(ink, isDark ? Math.min(1, dark + .024 + (colors.compact ? .08 : 0)) : Math.min(1, light + .024));
	const diffHiddenSurface = surface(isDark ? shift(colors.interactive, {
		c: .55,
		l: 0
	}) : shift(colors.interactive, {
		c: .45,
		l: .08
	}), isDark ? {
		base: .14,
		weak: .08,
		weaker: .18,
		strong: .26,
		stronger: .42
	} : {
		base: .12,
		weak: .08,
		weaker: .16,
		strong: .24,
		stronger: .36
	});
	const neutralAlpha = generateNeutralAlphaScale(neutral, isDark);
	const brandb = primary[8];
	const brandh = primary[9];
	const interb = interactive[isDark ? 6 : 4];
	const interh = interactive[isDark ? 7 : 5];
	const interw = interactive[isDark ? 5 : 3];
	const succb = success[isDark ? 6 : 4];
	const succw = success[isDark ? 5 : 3];
	const succs = success[10];
	const warnb = warning[isDark ? 6 : 4];
	const warnw = warning[isDark ? 5 : 3];
	const warns = warning[10];
	const critb = error[isDark ? 6 : 4];
	const critw = error[isDark ? 5 : 3];
	const crits = error[10];
	const infob = info[isDark ? 6 : 4];
	const infow = info[isDark ? 5 : 3];
	const infos = info[10];
	const lum = (hex) => {
		const rgb = hexToRgb(hex);
		const lift = (v) => v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
		return .2126 * lift(rgb.r) + .7152 * lift(rgb.g) + .0722 * lift(rgb.b);
	};
	const hit = (a, b) => {
		const x = lum(a);
		const y = lum(b);
		const light = Math.max(x, y);
		const dark = Math.min(x, y);
		return (light + .05) / (dark + .05);
	};
	const on = (fill) => {
		const light = "#ffffff";
		const dark = "#000000";
		return hit(light, fill) > hit(dark, fill) ? light : dark;
	};
	const tokens = {};
	tokens["background-base"] = neutral[0];
	tokens["background-weak"] = neutral[2];
	tokens["background-strong"] = neutral[0];
	tokens["background-stronger"] = isDark ? neutral[1] : "#fcfcfc";
	tokens["surface-base"] = neutralAlpha[1];
	tokens["base"] = neutralAlpha[1];
	tokens["surface-base-hover"] = neutralAlpha[2];
	tokens["surface-base-active"] = neutralAlpha[2];
	tokens["surface-base-interactive-active"] = withAlpha(interactive[2], .3);
	tokens["base2"] = neutralAlpha[1];
	tokens["base3"] = neutralAlpha[1];
	tokens["surface-inset-base"] = neutralAlpha[1];
	tokens["surface-inset-base-hover"] = neutralAlpha[2];
	tokens["surface-inset-strong"] = isDark ? withAlpha(neutral[0], .5) : withAlpha(neutral[3], .09);
	tokens["surface-inset-strong-hover"] = tokens["surface-inset-strong"];
	tokens["surface-raised-base"] = neutralAlpha[0];
	tokens["surface-float-base"] = isDark ? neutral[1] : neutral[11];
	tokens["surface-float-base-hover"] = isDark ? neutral[2] : neutral[10];
	tokens["surface-raised-base-hover"] = neutralAlpha[1];
	tokens["surface-raised-base-active"] = neutralAlpha[2];
	tokens["surface-raised-strong"] = isDark ? neutralAlpha[3] : neutral[0];
	tokens["surface-raised-strong-hover"] = isDark ? neutralAlpha[5] : "#ffffff";
	tokens["surface-raised-stronger"] = isDark ? neutralAlpha[5] : "#ffffff";
	tokens["surface-raised-stronger-hover"] = isDark ? neutralAlpha[6] : "#ffffff";
	tokens["surface-weak"] = neutralAlpha[2];
	tokens["surface-weaker"] = neutralAlpha[3];
	tokens["surface-strong"] = isDark ? neutralAlpha[6] : "#ffffff";
	tokens["surface-raised-stronger-non-alpha"] = isDark ? neutral[2] : "#ffffff";
	tokens["surface-brand-base"] = brandb;
	tokens["surface-brand-hover"] = brandh;
	tokens["surface-interactive-base"] = interb;
	tokens["surface-interactive-hover"] = interh;
	tokens["surface-interactive-weak"] = interw;
	tokens["surface-interactive-weak-hover"] = interb;
	tokens["surface-success-base"] = succb;
	tokens["surface-success-weak"] = succw;
	tokens["surface-success-strong"] = succs;
	tokens["surface-warning-base"] = warnb;
	tokens["surface-warning-weak"] = warnw;
	tokens["surface-warning-strong"] = warns;
	tokens["surface-critical-base"] = critb;
	tokens["surface-critical-weak"] = critw;
	tokens["surface-critical-strong"] = crits;
	tokens["surface-info-base"] = infob;
	tokens["surface-info-weak"] = infow;
	tokens["surface-info-strong"] = infos;
	tokens["surface-diff-unchanged-base"] = isDark ? neutral[0] : "#ffffff00";
	tokens["surface-diff-skip-base"] = isDark ? neutralAlpha[0] : neutral[1];
	tokens["surface-diff-hidden-base"] = diffHiddenSurface.base;
	tokens["surface-diff-hidden-weak"] = diffHiddenSurface.weak;
	tokens["surface-diff-hidden-weaker"] = diffHiddenSurface.weaker;
	tokens["surface-diff-hidden-strong"] = diffHiddenSurface.strong;
	tokens["surface-diff-hidden-stronger"] = diffHiddenSurface.stronger;
	tokens["surface-diff-add-base"] = diffAdd[2];
	tokens["surface-diff-add-weak"] = diffAdd[isDark ? 3 : 1];
	tokens["surface-diff-add-weaker"] = diffAdd[isDark ? 2 : 0];
	tokens["surface-diff-add-strong"] = diffAdd[4];
	tokens["surface-diff-add-stronger"] = diffAdd[isDark ? 10 : 8];
	tokens["surface-diff-delete-base"] = diffDelete[2];
	tokens["surface-diff-delete-weak"] = diffDelete[isDark ? 3 : 1];
	tokens["surface-diff-delete-weaker"] = diffDelete[isDark ? 2 : 0];
	tokens["surface-diff-delete-strong"] = diffDelete[isDark ? 4 : 5];
	tokens["surface-diff-delete-stronger"] = diffDelete[isDark ? 10 : 8];
	tokens["input-base"] = isDark ? neutral[1] : neutral[0];
	tokens["input-hover"] = isDark ? neutral[2] : neutral[1];
	tokens["input-active"] = isDark ? interactive[6] : interactive[0];
	tokens["input-selected"] = isDark ? interactive[7] : interactive[3];
	tokens["input-focus"] = isDark ? interactive[6] : interactive[0];
	tokens["input-disabled"] = neutral[3];
	tokens["text-base"] = colors.compact ? body : neutral[10];
	tokens["text-weak"] = colors.compact ? shift(body, {
		l: isDark ? -.11 : .11,
		c: .9
	}) : neutral[8];
	tokens["text-weaker"] = colors.compact ? shift(body, {
		l: isDark ? -.2 : .21,
		c: isDark ? .78 : .72
	}) : neutral[7];
	tokens["text-strong"] = colors.compact ? isDark ? blend("#ffffff", body, .9) : shift(body, {
		l: -.07,
		c: 1.04
	}) : neutral[11];
	tokens["text-invert-base"] = isDark ? neutral[10] : neutral[1];
	tokens["text-invert-weak"] = isDark ? neutral[8] : neutral[2];
	tokens["text-invert-weaker"] = isDark ? neutral[7] : neutral[3];
	tokens["text-invert-strong"] = isDark ? neutral[11] : neutral[0];
	tokens["text-interactive-base"] = interactive[isDark ? 10 : 9];
	tokens["text-on-brand-base"] = on(brandb);
	tokens["text-on-interactive-base"] = on(interb);
	tokens["text-on-interactive-weak"] = on(interb);
	tokens["text-on-success-base"] = on(succb);
	tokens["text-on-critical-base"] = on(critb);
	tokens["text-on-critical-weak"] = on(critb);
	tokens["text-on-critical-strong"] = on(crits);
	tokens["text-on-warning-base"] = on(warnb);
	tokens["text-on-info-base"] = on(infob);
	tokens["text-diff-add-base"] = diffAdd[10];
	tokens["text-diff-delete-base"] = diffDelete[9];
	tokens["text-diff-delete-strong"] = diffDelete[11];
	tokens["text-diff-add-strong"] = diffAdd[isDark ? 7 : 11];
	tokens["text-on-info-weak"] = on(infob);
	tokens["text-on-info-strong"] = on(infos);
	tokens["text-on-warning-weak"] = on(warnb);
	tokens["text-on-warning-strong"] = on(warns);
	tokens["text-on-success-weak"] = on(succb);
	tokens["text-on-success-strong"] = on(succs);
	tokens["text-on-brand-weak"] = on(brandb);
	tokens["text-on-brand-weaker"] = on(brandb);
	tokens["text-on-brand-strong"] = on(brandh);
	tokens["button-primary-base"] = neutral[11];
	tokens["button-secondary-base"] = isDark ? neutral[2] : neutral[0];
	tokens["button-secondary-hover"] = isDark ? neutral[3] : neutral[1];
	tokens["button-ghost-hover"] = neutralAlpha[1];
	tokens["button-ghost-hover2"] = neutralAlpha[2];
	tokens["border-base"] = colors.compact ? borderTone(.22, .16) : neutralAlpha[6];
	tokens["border-hover"] = colors.compact ? borderTone(.28, .2) : neutralAlpha[7];
	tokens["border-active"] = colors.compact ? borderTone(.34, .24) : neutralAlpha[8];
	tokens["border-selected"] = withAlpha(interactive[8], isDark ? .9 : .99);
	tokens["border-disabled"] = colors.compact ? borderTone(.18, .12) : neutralAlpha[7];
	tokens["border-focus"] = colors.compact ? borderTone(.34, .24) : neutralAlpha[8];
	tokens["border-weak-base"] = colors.compact ? borderTone(.1, .08) : neutralAlpha[isDark ? 5 : 4];
	tokens["border-strong-base"] = colors.compact ? borderTone(.34, .24) : neutralAlpha[isDark ? 7 : 6];
	tokens["border-strong-hover"] = colors.compact ? borderTone(.4, .28) : neutralAlpha[7];
	tokens["border-strong-active"] = colors.compact ? borderTone(.46, .32) : neutralAlpha[isDark ? 7 : 6];
	tokens["border-strong-selected"] = withAlpha(interactive[5], .6);
	tokens["border-strong-disabled"] = colors.compact ? borderTone(.14, .1) : neutralAlpha[5];
	tokens["border-strong-focus"] = colors.compact ? borderTone(.46, .32) : neutralAlpha[isDark ? 7 : 6];
	tokens["border-weak-hover"] = colors.compact ? borderTone(.16, .12) : neutralAlpha[isDark ? 6 : 5];
	tokens["border-weak-active"] = colors.compact ? borderTone(.22, .16) : neutralAlpha[isDark ? 7 : 6];
	tokens["border-weak-selected"] = withAlpha(interactive[4], isDark ? .6 : .5);
	tokens["border-weak-disabled"] = colors.compact ? borderTone(.08, .06) : neutralAlpha[5];
	tokens["border-weak-focus"] = colors.compact ? borderTone(.22, .16) : neutralAlpha[isDark ? 7 : 6];
	tokens["border-weaker-base"] = colors.compact ? borderTone(.06, .04) : neutralAlpha[2];
	tokens["border-interactive-base"] = interactive[6];
	tokens["border-interactive-hover"] = interactive[7];
	tokens["border-interactive-active"] = interactive[8];
	tokens["border-interactive-selected"] = interactive[8];
	tokens["border-interactive-disabled"] = neutral[7];
	tokens["border-interactive-focus"] = interactive[8];
	tokens["border-success-base"] = success[isDark ? 6 : 6];
	tokens["border-success-hover"] = success[isDark ? 7 : 7];
	tokens["border-success-selected"] = success[8];
	tokens["border-warning-base"] = warning[isDark ? 6 : 6];
	tokens["border-warning-hover"] = warning[isDark ? 7 : 7];
	tokens["border-warning-selected"] = warning[8];
	tokens["border-critical-base"] = error[isDark ? 6 : 6];
	tokens["border-critical-hover"] = error[isDark ? 7 : 7];
	tokens["border-critical-selected"] = error[8];
	tokens["border-info-base"] = info[isDark ? 6 : 6];
	tokens["border-info-hover"] = info[isDark ? 7 : 7];
	tokens["border-info-selected"] = info[8];
	tokens["border-color"] = "#ffffff";
	tokens["icon-base"] = colors.compact && !isDark ? tokens["text-weak"] : neutral[isDark ? 9 : 8];
	tokens["icon-hover"] = colors.compact && !isDark ? tokens["text-base"] : neutral[10];
	tokens["icon-active"] = colors.compact && !isDark ? tokens["text-strong"] : neutral[11];
	tokens["icon-selected"] = colors.compact && !isDark ? tokens["text-strong"] : neutral[11];
	tokens["icon-disabled"] = neutral[isDark ? 6 : 7];
	tokens["icon-focus"] = colors.compact && !isDark ? tokens["text-strong"] : neutral[11];
	tokens["icon-invert-base"] = isDark ? neutral[0] : "#ffffff";
	tokens["icon-weak-base"] = neutral[isDark ? 5 : 6];
	tokens["icon-weak-hover"] = neutral[isDark ? 11 : 7];
	tokens["icon-weak-active"] = neutral[8];
	tokens["icon-weak-selected"] = neutral[isDark ? 8 : 9];
	tokens["icon-weak-disabled"] = neutral[isDark ? 3 : 5];
	tokens["icon-weak-focus"] = neutral[8];
	tokens["icon-strong-base"] = neutral[11];
	tokens["icon-strong-hover"] = isDark ? "#f6f3f3" : "#151313";
	tokens["icon-strong-active"] = isDark ? "#fcfcfc" : "#020202";
	tokens["icon-strong-selected"] = isDark ? "#fdfcfc" : "#020202";
	tokens["icon-strong-disabled"] = neutral[7];
	tokens["icon-strong-focus"] = isDark ? "#fdfcfc" : "#020202";
	tokens["icon-brand-base"] = isDark ? "#ffffff" : neutral[11];
	tokens["icon-interactive-base"] = interactive[8];
	tokens["icon-success-base"] = success[isDark ? 8 : 6];
	tokens["icon-success-hover"] = success[9];
	tokens["icon-success-active"] = success[10];
	tokens["icon-warning-base"] = amber[isDark ? 8 : 6];
	tokens["icon-warning-hover"] = amber[9];
	tokens["icon-warning-active"] = amber[10];
	tokens["icon-critical-base"] = error[isDark ? 8 : 9];
	tokens["icon-critical-hover"] = error[9];
	tokens["icon-critical-active"] = error[10];
	tokens["icon-info-base"] = info[isDark ? 8 : 6];
	tokens["icon-info-hover"] = info[isDark ? 9 : 7];
	tokens["icon-info-active"] = info[10];
	tokens["icon-on-brand-base"] = on(brandb);
	tokens["icon-on-brand-hover"] = on(brandh);
	tokens["icon-on-brand-selected"] = on(brandh);
	tokens["icon-on-interactive-base"] = on(interb);
	tokens["icon-agent-plan-base"] = info[8];
	tokens["icon-agent-docs-base"] = amber[8];
	tokens["icon-agent-ask-base"] = blue[8];
	tokens["icon-agent-build-base"] = interactive[isDark ? 10 : 8];
	tokens["icon-on-success-base"] = on(succb);
	tokens["icon-on-success-hover"] = on(succs);
	tokens["icon-on-success-selected"] = on(succs);
	tokens["icon-on-warning-base"] = on(warnb);
	tokens["icon-on-warning-hover"] = on(warns);
	tokens["icon-on-warning-selected"] = on(warns);
	tokens["icon-on-critical-base"] = on(critb);
	tokens["icon-on-critical-hover"] = on(crits);
	tokens["icon-on-critical-selected"] = on(crits);
	tokens["icon-on-info-base"] = on(infob);
	tokens["icon-on-info-hover"] = on(infos);
	tokens["icon-on-info-selected"] = on(infos);
	tokens["icon-diff-add-base"] = diffAdd[10];
	tokens["icon-diff-add-hover"] = diffAdd[isDark ? 9 : 11];
	tokens["icon-diff-add-active"] = diffAdd[isDark ? 10 : 11];
	tokens["icon-diff-delete-base"] = diffDelete[9];
	tokens["icon-diff-delete-hover"] = diffDelete[isDark ? 10 : 10];
	tokens["icon-diff-modified-base"] = modified();
	if (colors.compact) {
		tokens["syntax-comment"] = "var(--text-weak)";
		tokens["syntax-regexp"] = "var(--text-base)";
		tokens["syntax-string"] = content(colors.success, success);
		tokens["syntax-keyword"] = content(colors.accent, accent);
		tokens["syntax-primitive"] = content(colors.primary, primary);
		tokens["syntax-operator"] = isDark ? "var(--text-weak)" : "var(--text-base)";
		tokens["syntax-variable"] = "var(--text-strong)";
		tokens["syntax-property"] = content(colors.info, info);
		tokens["syntax-type"] = content(colors.warning, warning);
		tokens["syntax-constant"] = content(colors.accent, accent);
		tokens["syntax-punctuation"] = isDark ? "var(--text-weak)" : "var(--text-base)";
		tokens["syntax-object"] = "var(--text-strong)";
		tokens["syntax-success"] = success[10];
		tokens["syntax-warning"] = amber[10];
		tokens["syntax-critical"] = error[10];
		tokens["syntax-info"] = content(colors.info, info);
		tokens["syntax-diff-add"] = diffAdd[10];
		tokens["syntax-diff-delete"] = diffDelete[10];
		tokens["syntax-diff-unknown"] = "#ff0000";
		tokens["markdown-heading"] = content(colors.primary, primary);
		tokens["markdown-text"] = tokens["text-base"];
		tokens["markdown-link"] = content(colors.interactive, interactive);
		tokens["markdown-link-text"] = content(colors.info, info);
		tokens["markdown-code"] = content(colors.success, success);
		tokens["markdown-block-quote"] = content(colors.warning, warning);
		tokens["markdown-emph"] = content(colors.warning, warning);
		tokens["markdown-strong"] = content(colors.accent, accent);
		tokens["markdown-horizontal-rule"] = tokens["border-base"];
		tokens["markdown-list-item"] = content(colors.interactive, interactive);
		tokens["markdown-list-enumeration"] = content(colors.info, info);
		tokens["markdown-image"] = content(colors.interactive, interactive);
		tokens["markdown-image-text"] = content(colors.info, info);
		tokens["markdown-code-block"] = tokens["text-base"];
	}
	if (!colors.compact) {
		tokens["syntax-comment"] = "var(--text-weak)";
		tokens["syntax-regexp"] = "var(--text-base)";
		tokens["syntax-string"] = isDark ? "#00ceb9" : "#006656";
		tokens["syntax-keyword"] = "var(--text-weak)";
		tokens["syntax-primitive"] = isDark ? "#ffba92" : "#fb4804";
		tokens["syntax-operator"] = isDark ? "var(--text-weak)" : "var(--text-base)";
		tokens["syntax-variable"] = "var(--text-strong)";
		tokens["syntax-property"] = isDark ? "#ff9ae2" : "#ed6dc8";
		tokens["syntax-type"] = isDark ? "#ecf58c" : "#596600";
		tokens["syntax-constant"] = isDark ? "#93e9f6" : "#007b80";
		tokens["syntax-punctuation"] = isDark ? "var(--text-weak)" : "var(--text-base)";
		tokens["syntax-object"] = "var(--text-strong)";
		tokens["syntax-success"] = success[10];
		tokens["syntax-warning"] = amber[10];
		tokens["syntax-critical"] = error[10];
		tokens["syntax-info"] = isDark ? "#93e9f6" : "#0092a8";
		tokens["syntax-diff-add"] = diffAdd[10];
		tokens["syntax-diff-delete"] = diffDelete[10];
		tokens["syntax-diff-unknown"] = "#ff0000";
		tokens["markdown-heading"] = isDark ? "#9d7cd8" : "#d68c27";
		tokens["markdown-text"] = isDark ? "#eeeeee" : "#1a1a1a";
		tokens["markdown-link"] = isDark ? "#fab283" : "#3b7dd8";
		tokens["markdown-link-text"] = isDark ? "#56b6c2" : "#318795";
		tokens["markdown-code"] = isDark ? "#7fd88f" : "#3d9a57";
		tokens["markdown-block-quote"] = isDark ? "#e5c07b" : "#b0851f";
		tokens["markdown-emph"] = isDark ? "#e5c07b" : "#b0851f";
		tokens["markdown-strong"] = isDark ? "#f5a742" : "#d68c27";
		tokens["markdown-horizontal-rule"] = isDark ? "#808080" : "#8a8a8a";
		tokens["markdown-list-item"] = isDark ? "#fab283" : "#3b7dd8";
		tokens["markdown-list-enumeration"] = isDark ? "#56b6c2" : "#318795";
		tokens["markdown-image"] = isDark ? "#fab283" : "#3b7dd8";
		tokens["markdown-image-text"] = isDark ? "#56b6c2" : "#318795";
		tokens["markdown-code-block"] = isDark ? "#eeeeee" : "#1a1a1a";
	}
	tokens["avatar-background-pink"] = isDark ? "#501b3f" : "#feeef8";
	tokens["avatar-background-mint"] = isDark ? "#033a34" : "#e1fbf4";
	tokens["avatar-background-orange"] = isDark ? "#5f2a06" : "#fff1e7";
	tokens["avatar-background-purple"] = isDark ? "#432155" : "#f9f1fe";
	tokens["avatar-background-cyan"] = isDark ? "#0f3058" : "#e7f9fb";
	tokens["avatar-background-lime"] = isDark ? "#2b3711" : "#eefadc";
	tokens["avatar-text-pink"] = isDark ? "#e34ba9" : "#cd1d8d";
	tokens["avatar-text-mint"] = isDark ? "#95f3d9" : "#147d6f";
	tokens["avatar-text-orange"] = isDark ? "#ff802b" : "#ed5f00";
	tokens["avatar-text-purple"] = isDark ? "#9d5bd2" : "#8445bc";
	tokens["avatar-text-cyan"] = isDark ? "#369eff" : "#0894b3";
	tokens["avatar-text-lime"] = isDark ? "#c4f042" : "#5d770d";
	for (const [key, value] of Object.entries(overrides)) tokens[key] = value;
	if (colors.compact && "text-weak" in overrides && !("text-weaker" in overrides)) {
		const weak = tokens["text-weak"];
		if (weak.startsWith("#")) tokens["text-weaker"] = shift(weak, {
			l: isDark ? -.12 : .12,
			c: .75
		});
		else tokens["text-weaker"] = weak;
	}
	if (colors.compact) {
		if (!("markdown-text" in overrides)) tokens["markdown-text"] = tokens["text-base"];
		if (!("markdown-code-block" in overrides)) tokens["markdown-code-block"] = tokens["text-base"];
	}
	if (!("text-stronger" in overrides)) tokens["text-stronger"] = tokens["text-strong"];
	return tokens;
}
function getColors(variant) {
	const input = variant;
	if (input.palette && input.seeds) throw new Error("Theme variant cannot define both `palette` and `seeds`");
	if (variant.palette) return {
		compact: true,
		neutral: variant.palette.neutral,
		ink: variant.palette.ink,
		primary: variant.palette.primary,
		accent: variant.palette.accent ?? variant.palette.info,
		success: variant.palette.success,
		warning: variant.palette.warning,
		error: variant.palette.error,
		info: variant.palette.info,
		interactive: variant.palette.interactive ?? variant.palette.primary,
		diffAdd: variant.palette.diffAdd,
		diffDelete: variant.palette.diffDelete
	};
	if (variant.seeds) return {
		compact: false,
		neutral: variant.seeds.neutral,
		ink: void 0,
		primary: variant.seeds.primary,
		accent: variant.seeds.info,
		success: variant.seeds.success,
		warning: variant.seeds.warning,
		error: variant.seeds.error,
		info: variant.seeds.info,
		interactive: variant.seeds.interactive,
		diffAdd: variant.seeds.diffAdd,
		diffDelete: variant.seeds.diffDelete
	};
	throw new Error("Theme variant requires `palette` or `seeds`");
}
function generateNeutralAlphaScale(neutralScale, isDark) {
	return (isDark ? [
		.038,
		.066,
		.1,
		.142,
		.19,
		.252,
		.334,
		.446,
		.58,
		.718,
		.854,
		.985
	] : [
		.03,
		.06,
		.1,
		.145,
		.2,
		.265,
		.35,
		.47,
		.61,
		.74,
		.86,
		.97
	]).map((alpha) => blend(neutralScale[11], neutralScale[0], alpha));
}
function getHex(value) {
	if (!value?.startsWith("#")) return;
	return value;
}
//#endregion
//#region ../app/src/shell/commands/desktop-menu.ts
var desktopZoomLevels = [
	.5,
	.67,
	.75,
	.8,
	.9,
	1,
	1.1,
	1.25,
	1.5,
	1.75,
	2
];
/** The level after `factor` in `direction`. A pinch can leave `factor` between two levels. */
function nextDesktopZoomLevel(factor, direction) {
	if (direction === "in") return desktopZoomLevels.find((level) => level > factor + .01) ?? desktopZoomLevels[desktopZoomLevels.length - 1];
	return desktopZoomLevels.findLast((level) => level < factor - .01) ?? desktopZoomLevels[0];
}
var DESKTOP_MENU = [
	{
		id: "app",
		labelKey: "desktop.menu.app",
		platforms: ["macos"],
		items: [
			{
				type: "item",
				role: "about"
			},
			{
				type: "item",
				labelKey: "desktop.menu.installCli",
				action: "app.installCli"
			},
			{
				type: "item",
				labelKey: "desktop.menu.settings",
				command: "settings.open",
				accelerator: { macos: "Cmd+," }
			},
			{
				type: "item",
				labelKey: "desktop.menu.reloadWebview",
				action: "view.reload"
			},
			{
				type: "item",
				labelKey: "desktop.menu.restart",
				action: "app.relaunch"
			},
			{
				type: "item",
				labelKey: "desktop.menu.exportLogs",
				command: "logs.export"
			},
			{ type: "separator" },
			{
				type: "item",
				role: "hide"
			},
			{
				type: "item",
				role: "hideOthers"
			},
			{
				type: "item",
				role: "unhide"
			},
			{ type: "separator" },
			{
				type: "item",
				role: "quit"
			}
		]
	},
	{
		id: "file",
		labelKey: "desktop.menu.file",
		items: [
			{
				type: "item",
				labelKey: "desktop.menu.newSession",
				command: "tab.new",
				accelerator: { macos: "Cmd+N" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.settings",
				command: "settings.open",
				accelerator: { windows: "Ctrl+," },
				platforms: ["windows"]
			},
			{
				type: "item",
				labelKey: "desktop.menu.newWindow",
				action: "window.new",
				accelerator: {
					macos: "Cmd+Shift+N",
					windows: "Ctrl+Shift+N"
				}
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.closeWindow",
				action: "window.close",
				role: "close",
				accelerator: {
					macos: "Shift+Cmd+W",
					windows: "Ctrl+Shift+W"
				}
			}
		]
	},
	{
		id: "edit",
		labelKey: "desktop.menu.edit",
		items: [
			{
				type: "item",
				labelKey: "desktop.menu.undo",
				action: "edit.undo",
				role: "undo",
				accelerator: { windows: "Ctrl+Z" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.redo",
				action: "edit.redo",
				role: "redo",
				accelerator: { windows: "Ctrl+Y" }
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.cut",
				action: "edit.cut",
				role: "cut",
				accelerator: { windows: "Ctrl+X" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.copy",
				action: "edit.copy",
				role: "copy",
				accelerator: { windows: "Ctrl+C" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.paste",
				action: "edit.paste",
				role: "paste",
				accelerator: { windows: "Ctrl+V" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.delete",
				action: "edit.delete"
			},
			{
				type: "item",
				labelKey: "desktop.menu.selectAll",
				action: "edit.selectAll",
				role: "selectAll",
				accelerator: { windows: "Ctrl+A" }
			}
		]
	},
	{
		id: "view",
		labelKey: "desktop.menu.view",
		items: [
			{
				type: "item",
				labelKey: "desktop.menu.toggleSidebar",
				command: "sidebar.toggle",
				accelerator: { macos: "Shift+Cmd+B" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.toggleTerminal",
				command: "terminal.toggle",
				accelerator: { macos: "Ctrl+`" }
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.reload",
				action: "view.reload",
				role: "reload"
			},
			{
				type: "item",
				labelKey: "desktop.menu.toggleDeveloperTools",
				action: "view.toggleDevTools",
				role: "toggleDevTools"
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.actualSize",
				action: "view.resetZoom",
				accelerator: {
					macos: "Cmd+0",
					windows: "Ctrl+0"
				}
			},
			{
				type: "item",
				labelKey: "desktop.menu.zoomIn",
				action: "view.zoomIn",
				accelerator: {
					macos: "Cmd+=",
					windows: "Ctrl++"
				}
			},
			{
				type: "item",
				labelKey: "desktop.menu.zoomOut",
				action: "view.zoomOut",
				accelerator: {
					macos: "Cmd+-",
					windows: "Ctrl+-"
				}
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.toggleFullScreen",
				action: "view.toggleFullscreen",
				role: "togglefullscreen"
			}
		]
	},
	{
		id: "go",
		labelKey: "desktop.menu.go",
		items: [
			{
				type: "item",
				labelKey: "desktop.menu.back",
				command: "common.goBack",
				accelerator: { macos: "Cmd+[" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.forward",
				command: "common.goForward",
				accelerator: { macos: "Cmd+]" }
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.previousSession",
				command: "session.previous",
				accelerator: { macos: "Option+Up" }
			},
			{
				type: "item",
				labelKey: "desktop.menu.nextSession",
				command: "session.next",
				accelerator: { macos: "Option+Down" }
			}
		]
	},
	{
		id: "window",
		labelKey: "desktop.menu.window",
		role: "windowMenu",
		items: [
			{
				type: "item",
				labelKey: "desktop.menu.minimize",
				action: "window.minimize"
			},
			{
				type: "item",
				labelKey: "desktop.menu.maximize",
				action: "window.toggleMaximize"
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.closeWindow",
				action: "window.close"
			}
		]
	},
	{
		id: "help",
		labelKey: "desktop.menu.help",
		items: [
			{
				type: "item",
				labelKey: "desktop.menu.documentation",
				href: "https://opencode.ai/docs"
			},
			{
				type: "item",
				labelKey: "desktop.menu.supportForum",
				href: "https://discord.com/invite/opencode"
			},
			{
				type: "item",
				labelKey: "desktop.menu.exportLogs",
				command: "logs.export"
			},
			{ type: "separator" },
			{
				type: "item",
				labelKey: "desktop.menu.shareFeedback",
				href: "https://github.com/anomalyco/opencode/issues/new?template=feature_request.yml"
			},
			{
				type: "item",
				labelKey: "desktop.menu.reportBug",
				href: "https://github.com/anomalyco/opencode/issues/new?template=bug_report.yml"
			}
		]
	}
];
function desktopMenuVisible(item, platform) {
	return !item.platforms || item.platforms.includes(platform);
}
/** What a GUI plugin's menubar item names in `after`: a built-in item's command, action, or role. */
function desktopMenuKey(entry) {
	if (entry.type === "separator") return void 0;
	return entry.command ?? entry.action ?? entry.role;
}
/** Places plugin items after the entry their `after` names, or at the end of the menu. */
function desktopMenuWithPlugins(base, extra) {
	const list = [...base];
	extra.forEach((item) => {
		const next = {
			key: item.id,
			entry: item
		};
		const index = item.after ? list.findIndex((entry) => entry.key === item.after) : -1;
		list.splice(index < 0 ? list.length : index + 1, 0, next);
	});
	return list;
}
//#endregion
//#region src/main/windows/defaults.ts
var oc2Theme = {
	$schema: "https://opencode.ai/desktop-theme.json",
	name: "OpenCode",
	id: "oc-2",
	light: {
		"palette": {
			"neutral": "#f7f7f7",
			"ink": "#171311",
			"primary": "#dcde8d",
			"success": "#12c905",
			"warning": "#ffdc17",
			"error": "#fc533a",
			"info": "#a753ae",
			"interactive": "#034cff",
			"diffAdd": "#9ff29a",
			"diffDelete": "#fc533a"
		},
		"overrides": {
			"text-strong": "#171717",
			"text-base": "#6F6F6F",
			"text-weak": "#8F8F8F",
			"text-weaker": "#C7C7C7",
			"text-diff-add-base": "var(--v2-state-fg-success)",
			"text-diff-delete-base": "var(--v2-state-fg-danger)",
			"border-weak-base": "#DBDBDB",
			"border-weaker-base": "#E8E8E8",
			"icon-base": "#8F8F8F",
			"icon-weak-base": "#C7C7C7",
			"surface-raised-base": "#F3F3F3",
			"surface-raised-base-hover": "#EDEDED",
			"surface-base": "#F8F8F8",
			"surface-base-hover": "#0000000A",
			"surface-interactive-weak": "#F5FAFF",
			"icon-success-base": "#0ABE00",
			"surface-success-base": "#E6FFE5",
			"syntax-comment": "var(--v2-text-text-muted)",
			"syntax-keyword": "var(--v2-pink-800)",
			"syntax-string": "var(--v2-green-800)",
			"syntax-primitive": "var(--v2-pink-800)",
			"syntax-property": "var(--v2-orange-800)",
			"syntax-type": "var(--v2-purple-800)",
			"syntax-constant": "#007b80",
			"syntax-critical": "var(--v2-red-800)",
			"syntax-diff-add": "var(--v2-state-fg-success)",
			"syntax-diff-delete": "var(--v2-state-fg-danger)",
			"syntax-diff-unknown": "#a753ae",
			"surface-critical-base": "#FFF2F0"
		},
		"v2Overrides": {
			"v2-grey-50": "#ffffffff",
			"v2-grey-100": "#fafafaff",
			"v2-grey-200": "#f2f2f2ff",
			"v2-grey-300": "#eeeeeeff",
			"v2-grey-400": "#dbdbdbff",
			"v2-grey-500": "#aeaeaeff",
			"v2-grey-600": "#808080ff",
			"v2-grey-700": "#5c5c5cff",
			"v2-grey-800": "#3a3a3aff",
			"v2-grey-900": "#2e2e2eff",
			"v2-grey-1000": "#242424ff",
			"v2-grey-1100": "#161616ff",
			"v2-grey-1200": "#080808ff",
			"v2-red-100": "#fcecebff",
			"v2-red-200": "#f6d5d3ff",
			"v2-red-300": "#f2bbb7ff",
			"v2-red-400": "#f29b96ff",
			"v2-red-500": "#f17471ff",
			"v2-red-600": "#f1484fff",
			"v2-red-700": "#d92e3cff",
			"v2-red-800": "#b82d35ff",
			"v2-red-900": "#97252bff",
			"v2-red-1000": "#7a1f23ff",
			"v2-red-1100": "#5f1a1cff",
			"v2-red-1200": "#461516ff",
			"v2-orange-100": "#fdf2edff",
			"v2-orange-200": "#ffe7dcff",
			"v2-orange-300": "#ffd8c6ff",
			"v2-orange-400": "#ffc1a4ff",
			"v2-orange-500": "#ffa478ff",
			"v2-orange-600": "#ff8648ff",
			"v2-orange-700": "#ee7330ff",
			"v2-orange-800": "#d16427ff",
			"v2-orange-900": "#b35624ff",
			"v2-orange-1000": "#954c27ff",
			"v2-orange-1100": "#723d22ff",
			"v2-orange-1200": "#5a2c14ff",
			"v2-yellow-100": "#fefaecff",
			"v2-yellow-200": "#fcefd0ff",
			"v2-yellow-300": "#f7e5b5ff",
			"v2-yellow-400": "#f3da9bff",
			"v2-yellow-500": "#f2cf76ff",
			"v2-yellow-600": "#f6c251ff",
			"v2-yellow-700": "#e7af36ff",
			"v2-yellow-800": "#cb9f34ff",
			"v2-yellow-900": "#ac8833ff",
			"v2-yellow-1000": "#8e7231ff",
			"v2-yellow-1100": "#68552bff",
			"v2-yellow-1200": "#4b4025ff",
			"v2-green-100": "#e7f9eaff",
			"v2-green-200": "#d0f0d5ff",
			"v2-green-300": "#b8e9c1ff",
			"v2-green-400": "#96e3a6ff",
			"v2-green-500": "#6bd586ff",
			"v2-green-600": "#49c970ff",
			"v2-green-700": "#2eaf5aff",
			"v2-green-800": "#198b43ff",
			"v2-green-900": "#1d783cff",
			"v2-green-1000": "#196130ff",
			"v2-green-1100": "#164c26ff",
			"v2-green-1200": "#14361dff",
			"v2-cyan-100": "#e2f7fbff",
			"v2-cyan-200": "#c4edf4ff",
			"v2-cyan-300": "#a3e4efff",
			"v2-cyan-400": "#65d9ebff",
			"v2-cyan-500": "#00c5dfff",
			"v2-cyan-600": "#00abcfff",
			"v2-cyan-700": "#0096b8ff",
			"v2-cyan-800": "#007d9bff",
			"v2-cyan-900": "#006c85ff",
			"v2-cyan-1000": "#005a6eff",
			"v2-cyan-1100": "#004756ff",
			"v2-cyan-1200": "#00353fff",
			"v2-blue-100": "#f5f8ffff",
			"v2-blue-200": "#ecf1feff",
			"v2-blue-300": "#c3d4fdff",
			"v2-blue-400": "#a2bcffff",
			"v2-blue-500": "#7698fdff",
			"v2-blue-600": "#3b5cf6ff",
			"v2-blue-700": "#0b34f4ff",
			"v2-blue-800": "#3250dfff",
			"v2-blue-900": "#2c47c8ff",
			"v2-blue-1000": "#263fa9ff",
			"v2-blue-1100": "#22388fff",
			"v2-blue-1200": "#021945ff",
			"v2-purple-100": "#ebecfeff",
			"v2-purple-200": "#d5d5fcff",
			"v2-purple-300": "#b9b8f5ff",
			"v2-purple-400": "#9e99f7ff",
			"v2-purple-500": "#8271f8ff",
			"v2-purple-600": "#7152f4ff",
			"v2-purple-700": "#623be2ff",
			"v2-purple-800": "#5230c2ff",
			"v2-purple-900": "#442aa1ff",
			"v2-purple-1000": "#361f83ff",
			"v2-purple-1100": "#2b1b6aff",
			"v2-purple-1200": "#221358ff",
			"v2-pink-100": "#fdecf3ff",
			"v2-pink-200": "#f7d5e4ff",
			"v2-pink-300": "#fabcd8ff",
			"v2-pink-400": "#f799c6ff",
			"v2-pink-500": "#f26cb2ff",
			"v2-pink-600": "#f64aabff",
			"v2-pink-700": "#e4429eff",
			"v2-pink-800": "#c83d8bff",
			"v2-pink-900": "#aa3576ff",
			"v2-pink-1000": "#8c2d61ff",
			"v2-pink-1100": "#6f284fff",
			"v2-pink-1200": "#5c1d3fff",
			"v2-background-bg-base": "var(--v2-grey-50)",
			"v2-background-bg-deep": "var(--v2-grey-100)",
			"v2-background-bg-layer-01": "var(--v2-grey-100)",
			"v2-background-bg-layer-02": "var(--v2-grey-200)",
			"v2-background-bg-layer-03": "var(--v2-grey-300)",
			"v2-background-bg-layer-04": "var(--v2-grey-400)",
			"v2-background-bg-inverse": "var(--v2-grey-1100)",
			"v2-background-bg-contrast": "var(--v2-grey-1000)",
			"v2-background-bg-icon-button-contrast": "var(--v2-background-bg-contrast)",
			"v2-background-bg-button-neutral": "var(--v2-grey-50)",
			"v2-background-bg-accent": "var(--v2-blue-600)",
			"v2-background-bg-code-path": "var(--v2-cyan-100)",
			"v2-text-text-base": "var(--v2-grey-1100)",
			"v2-text-text-muted": "var(--v2-grey-700)",
			"v2-text-text-faint": "var(--v2-grey-600)",
			"v2-text-text-inverse": "var(--v2-grey-50)",
			"v2-text-text-contrast": "var(--v2-grey-50)",
			"v2-text-text-accent": "var(--v2-blue-600)",
			"v2-text-text-accent-hover": "var(--v2-blue-700)",
			"v2-text-text-code-accent": "var(--v2-blue-900)",
			"v2-text-text-code-path": "var(--v2-blue-900)",
			"v2-icon-icon-base": "var(--v2-grey-800)",
			"v2-icon-icon-muted": "var(--v2-grey-600)",
			"v2-icon-icon-faint": "var(--v2-grey-500)",
			"v2-icon-icon-inverse": "var(--v2-grey-50)",
			"v2-icon-icon-contrast": "var(--v2-grey-100)",
			"v2-icon-icon-accent": "var(--v2-blue-600)",
			"v2-icon-icon-accent-hover": "var(--v2-blue-700)",
			"v2-border-border-muted": "var(--v2-alpha-dark-8)",
			"v2-border-border-base": "var(--v2-alpha-dark-10)",
			"v2-border-border-strong": "var(--v2-alpha-dark-20)",
			"v2-border-border-inverse": "var(--v2-grey-1000)",
			"v2-border-border-focus": "var(--v2-blue-500)",
			"v2-overlay-simple-overlay-hover": "var(--v2-alpha-dark-4)",
			"v2-overlay-simple-overlay-pressed": "var(--v2-alpha-dark-8)",
			"v2-overlay-simple-overlay-contrast-hover": "var(--v2-alpha-light-12)",
			"v2-overlay-simple-overlay-contrast-pressed": "var(--v2-alpha-light-24)",
			"v2-overlay-simple-overlay-scrim": "var(--v2-alpha-dark-40)",
			"v2-overlay-gradient-depth-overlay-depth-top": "var(--v2-alpha-light-100)",
			"v2-overlay-gradient-depth-overlay-depth-bot": "var(--v2-alpha-light-0)",
			"v2-overlay-simple-tab-active-scrim": "#fafafa00",
			"v2-overlay-simple-tab-hover-scrim": "#eeeeee00",
			"v2-overlay-simple-tab-scrim": "#fafafa00",
			"v2-state-bg-success": "var(--v2-green-100)",
			"v2-state-fg-success": "var(--v2-green-800)",
			"v2-state-border-success": "var(--v2-green-300)",
			"v2-state-bg-warning": "var(--v2-yellow-100)",
			"v2-state-fg-warning": "var(--v2-yellow-800)",
			"v2-state-border-warning": "var(--v2-yellow-300)",
			"v2-state-bg-danger": "var(--v2-red-100)",
			"v2-state-fg-danger": "var(--v2-red-800)",
			"v2-state-border-danger": "var(--v2-red-300)",
			"v2-state-bg-info": "var(--v2-blue-200)",
			"v2-state-fg-info": "var(--v2-blue-800)",
			"v2-state-border-info": "var(--v2-blue-300)",
			"v2-agent-plan-solid": "var(--v2-pink-800)",
			"v2-agent-plan-border": "rgba(200, 61, 139, 0.2)",
			"v2-agent-plan-background": "rgba(253, 236, 243, 0.1)",
			"v2-agent-build-solid": "var(--v2-blue-800)",
			"v2-agent-build-border": "rgba(44, 71, 200, 0.1)",
			"v2-agent-build-background": "rgba(236, 241, 254, 0.1)",
			"v2-agent-explore-solid": "var(--v2-yellow-900)",
			"v2-agent-explore-border": "rgba(203, 159, 52, 0.2)",
			"v2-agent-explore-background": "rgba(254, 250, 236, 0.1)",
			"v2-agent-review-solid": "var(--v2-green-800)",
			"v2-agent-writer-solid": "var(--v2-purple-700)",
			"v2-avatar-bg-orange": "#ee7330ff",
			"v2-avatar-border-orange": "#d16427ff",
			"v2-avatar-bg-yellow": "#e7af36ff",
			"v2-avatar-border-yellow": "#cb9f34ff",
			"v2-avatar-bg-cyan": "#0096b8ff",
			"v2-avatar-border-cyan": "#007d9bff",
			"v2-avatar-bg-green": "#2eaf5aff",
			"v2-avatar-border-green": "#198b43ff",
			"v2-avatar-bg-red": "#d92e3cff",
			"v2-avatar-border-red": "#b82d35ff",
			"v2-avatar-bg-pink": "#e4429eff",
			"v2-avatar-border-pink": "#c83d8bff",
			"v2-avatar-bg-blue": "#3250dfff",
			"v2-avatar-border-blue": "#2c47c8ff",
			"v2-avatar-bg-purple": "#623be2ff",
			"v2-avatar-border-purple": "#5230c2ff",
			"v2-avatar-bg-gray": "#5c5c5cff",
			"v2-avatar-border-gray": "#3a3a3aff",
			"v2-elevation-raised": "0px 2px 4px 0px var(--v2-alpha-dark-4), 0px 1px 2px -1px var(--v2-alpha-dark-8), 0px 0px 0px 0.5px var(--v2-alpha-dark-12), 0px 0px 0px 0px var(--v2-alpha-dark-0)",
			"v2-elevation-floating": "0px 8px 16px 0px var(--v2-alpha-dark-4), 0px 4px 8px 0px var(--v2-alpha-dark-8), 0px 0px 0px 0.5px var(--v2-alpha-dark-12), 0px 0px 0px 0px var(--v2-alpha-dark-0)",
			"v2-elevation-overlay": "0px 16px 32px 0px var(--v2-alpha-dark-4), 0px 8px 16px 0px var(--v2-alpha-dark-8), 0px 0px 0px 0.5px var(--v2-alpha-dark-12), 0px 0px 0px 0px var(--v2-alpha-dark-0)",
			"v2-elevation-input": "0px 1px 1.5px 0px var(--v2-alpha-dark-10), 0px 0px 0px 0.5px var(--v2-alpha-dark-14), 0px 0px 0px 0px var(--v2-alpha-dark-0)",
			"v2-elevation-button-neutral": "0px 1px 1.5px 0px var(--v2-alpha-dark-10), 0px 0px 0px 0.5px var(--v2-alpha-dark-14), 0px 0px 0px 0px var(--v2-alpha-dark-0)",
			"v2-elevation-button-contrast": "0px 1px 1.5px 0px var(--v2-alpha-dark-20), 0px 0px 0px 0.5px var(--v2-grey-800), inset 0px 1px 2px 0px var(--v2-alpha-light-14), inset 0px -1px 2px 0px var(--v2-alpha-dark-6), 0px 0px 0px 0px var(--v2-alpha-dark-0)",
			"v2-elevation-elements": "0px 0.5px 0.5px 0px var(--v2-alpha-dark-40)",
			"v2-elevation-switch-off": "inset 0px 1px 1px 0px var(--v2-alpha-dark-8), inset 0px 0.5px 0.5px 0px var(--v2-alpha-dark-8), inset 0px 0px 0px 0.5px var(--v2-alpha-dark-10)",
			"v2-elevation-switch-on": "inset 0px 2px 2px 0px var(--v2-alpha-dark-10), inset 0px 1px 1px 0px var(--v2-alpha-dark-10), inset 0px 0px 0px 0.5px var(--v2-alpha-dark-20)",
			"v2-illustration-illustration-layer-01": "var(--v2-grey-300)",
			"v2-illustration-illustration-layer-02": "var(--v2-grey-400)",
			"v2-illustration-illustration-layer-03": "var(--v2-grey-500)",
			"v2-font-family-code": "var(--font-family-mono)"
		}
	},
	dark: {
		"palette": {
			"neutral": "#1f1f1f",
			"ink": "#f1ece8",
			"primary": "#fab283",
			"success": "#12c905",
			"warning": "#fcd53a",
			"error": "#fc533a",
			"info": "#edb2f1",
			"interactive": "#034cff",
			"diffAdd": "#c8ffc4",
			"diffDelete": "#fc533a"
		},
		"overrides": {
			"text-strong": "#EDEDED",
			"text-base": "#A0A0A0",
			"text-weak": "#707070",
			"text-weaker": "#505050",
			"text-diff-add-base": "var(--v2-state-fg-success)",
			"text-diff-delete-base": "var(--v2-state-fg-danger)",
			"border-weak-base": "#282828",
			"border-weaker-base": "#232323",
			"icon-base": "#7E7E7E",
			"icon-weak-base": "#343434",
			"surface-raised-base": "#232323",
			"surface-raised-base-hover": "#282828",
			"surface-base": "#1C1C1C",
			"surface-base-hover": "#FFFFFF0D",
			"surface-interactive-weak": "#0D172B",
			"surface-success-base": "#022B00",
			"syntax-comment": "var(--v2-text-text-muted)",
			"syntax-keyword": "var(--v2-pink-400)",
			"syntax-string": "var(--v2-green-400)",
			"syntax-primitive": "var(--v2-pink-400)",
			"syntax-property": "var(--v2-orange-400)",
			"syntax-type": "var(--v2-purple-400)",
			"syntax-constant": "#93e9f6",
			"syntax-critical": "var(--v2-red-400)",
			"syntax-diff-add": "var(--v2-state-fg-success)",
			"syntax-diff-delete": "var(--v2-state-fg-danger)",
			"syntax-diff-unknown": "#edb2f1",
			"surface-critical-base": "#1F0603"
		},
		"v2Overrides": {
			"v2-grey-50": "#ffffffff",
			"v2-grey-100": "#fafafaff",
			"v2-grey-200": "#f2f2f2ff",
			"v2-grey-300": "#eeeeeeff",
			"v2-grey-400": "#dbdbdbff",
			"v2-grey-500": "#aeaeaeff",
			"v2-grey-600": "#808080ff",
			"v2-grey-700": "#5c5c5cff",
			"v2-grey-800": "#3a3a3aff",
			"v2-grey-900": "#2e2e2eff",
			"v2-grey-1000": "#242424ff",
			"v2-grey-1100": "#161616ff",
			"v2-grey-1200": "#080808ff",
			"v2-red-100": "#fcecebff",
			"v2-red-200": "#f6d5d3ff",
			"v2-red-300": "#f2bbb7ff",
			"v2-red-400": "#f29b96ff",
			"v2-red-500": "#f17471ff",
			"v2-red-600": "#f1484fff",
			"v2-red-700": "#d92e3cff",
			"v2-red-800": "#b82d35ff",
			"v2-red-900": "#97252bff",
			"v2-red-1000": "#7a1f23ff",
			"v2-red-1100": "#5f1a1cff",
			"v2-red-1200": "#461516ff",
			"v2-orange-100": "#fdf2edff",
			"v2-orange-200": "#ffe7dcff",
			"v2-orange-300": "#ffd8c6ff",
			"v2-orange-400": "#ffc1a4ff",
			"v2-orange-500": "#ffa478ff",
			"v2-orange-600": "#ff8648ff",
			"v2-orange-700": "#ee7330ff",
			"v2-orange-800": "#d16427ff",
			"v2-orange-900": "#b35624ff",
			"v2-orange-1000": "#954c27ff",
			"v2-orange-1100": "#723d22ff",
			"v2-orange-1200": "#5a2c14ff",
			"v2-yellow-100": "#fefaecff",
			"v2-yellow-200": "#fcefd0ff",
			"v2-yellow-300": "#f7e5b5ff",
			"v2-yellow-400": "#f3da9bff",
			"v2-yellow-500": "#f2cf76ff",
			"v2-yellow-600": "#f6c251ff",
			"v2-yellow-700": "#e7af36ff",
			"v2-yellow-800": "#cb9f34ff",
			"v2-yellow-900": "#ac8833ff",
			"v2-yellow-1000": "#8e7231ff",
			"v2-yellow-1100": "#68552bff",
			"v2-yellow-1200": "#4b4025ff",
			"v2-green-100": "#e7f9eaff",
			"v2-green-200": "#d0f0d5ff",
			"v2-green-300": "#b8e9c1ff",
			"v2-green-400": "#96e3a6ff",
			"v2-green-500": "#6bd586ff",
			"v2-green-600": "#49c970ff",
			"v2-green-700": "#2eaf5aff",
			"v2-green-800": "#198b43ff",
			"v2-green-900": "#1d783cff",
			"v2-green-1000": "#196130ff",
			"v2-green-1100": "#164c26ff",
			"v2-green-1200": "#14361dff",
			"v2-cyan-100": "#e2f7fbff",
			"v2-cyan-200": "#c4edf4ff",
			"v2-cyan-300": "#a3e4efff",
			"v2-cyan-400": "#65d9ebff",
			"v2-cyan-500": "#00c5dfff",
			"v2-cyan-600": "#00abcfff",
			"v2-cyan-700": "#0096b8ff",
			"v2-cyan-800": "#007d9bff",
			"v2-cyan-900": "#006c85ff",
			"v2-cyan-1000": "#005a6eff",
			"v2-cyan-1100": "#004756ff",
			"v2-cyan-1200": "#00353fff",
			"v2-blue-100": "#f5f8ffff",
			"v2-blue-200": "#ecf1feff",
			"v2-blue-300": "#c3d4fdff",
			"v2-blue-400": "#a2bcffff",
			"v2-blue-500": "#7698fdff",
			"v2-blue-600": "#3b5cf6ff",
			"v2-blue-700": "#0b34f4ff",
			"v2-blue-800": "#3250dfff",
			"v2-blue-900": "#2c47c8ff",
			"v2-blue-1000": "#263fa9ff",
			"v2-blue-1100": "#22388fff",
			"v2-blue-1200": "#021945ff",
			"v2-purple-100": "#ebecfeff",
			"v2-purple-200": "#d5d5fcff",
			"v2-purple-300": "#b9b8f5ff",
			"v2-purple-400": "#9e99f7ff",
			"v2-purple-500": "#8271f8ff",
			"v2-purple-600": "#7152f4ff",
			"v2-purple-700": "#623be2ff",
			"v2-purple-800": "#5230c2ff",
			"v2-purple-900": "#442aa1ff",
			"v2-purple-1000": "#361f83ff",
			"v2-purple-1100": "#2b1b6aff",
			"v2-purple-1200": "#221358ff",
			"v2-pink-100": "#fdecf3ff",
			"v2-pink-200": "#f7d5e4ff",
			"v2-pink-300": "#fabcd8ff",
			"v2-pink-400": "#f799c6ff",
			"v2-pink-500": "#f26cb2ff",
			"v2-pink-600": "#f64aabff",
			"v2-pink-700": "#e4429eff",
			"v2-pink-800": "#c83d8bff",
			"v2-pink-900": "#aa3576ff",
			"v2-pink-1000": "#8c2d61ff",
			"v2-pink-1100": "#6f284fff",
			"v2-pink-1200": "#5c1d3fff",
			"v2-background-bg-base": "var(--v2-grey-1100)",
			"v2-background-bg-deep": "var(--v2-grey-1200)",
			"v2-background-bg-layer-01": "var(--v2-grey-1000)",
			"v2-background-bg-layer-02": "var(--v2-grey-900)",
			"v2-background-bg-layer-03": "var(--v2-grey-800)",
			"v2-background-bg-layer-04": "var(--v2-grey-700)",
			"v2-background-bg-inverse": "var(--v2-grey-50)",
			"v2-background-bg-contrast": "var(--v2-grey-700)",
			"v2-background-bg-icon-button-contrast": "var(--v2-grey-400)",
			"v2-background-bg-button-neutral": "var(--v2-alpha-light-6)",
			"v2-background-bg-accent": "var(--v2-blue-600)",
			"v2-background-bg-code-path": "var(--v2-cyan-1200)",
			"v2-text-text-base": "var(--v2-grey-100)",
			"v2-text-text-muted": "var(--v2-grey-500)",
			"v2-text-text-faint": "var(--v2-grey-600)",
			"v2-text-text-inverse": "var(--v2-grey-1100)",
			"v2-text-text-contrast": "var(--v2-grey-50)",
			"v2-text-text-accent": "var(--v2-blue-400)",
			"v2-text-text-accent-hover": "var(--v2-blue-300)",
			"v2-text-text-code-accent": "var(--v2-blue-400)",
			"v2-text-text-code-path": "var(--v2-blue-300)",
			"v2-icon-icon-base": "var(--v2-grey-400)",
			"v2-icon-icon-muted": "var(--v2-grey-600)",
			"v2-icon-icon-faint": "var(--v2-grey-700)",
			"v2-icon-icon-inverse": "var(--v2-grey-1100)",
			"v2-icon-icon-contrast": "var(--v2-grey-100)",
			"v2-icon-icon-accent": "var(--v2-blue-400)",
			"v2-icon-icon-accent-hover": "var(--v2-blue-300)",
			"v2-border-border-muted": "var(--v2-alpha-light-8)",
			"v2-border-border-base": "var(--v2-alpha-light-10)",
			"v2-border-border-strong": "var(--v2-alpha-light-20)",
			"v2-border-border-inverse": "var(--v2-grey-100)",
			"v2-border-border-focus": "var(--v2-blue-500)",
			"v2-overlay-simple-overlay-hover": "var(--v2-alpha-light-6)",
			"v2-overlay-simple-overlay-pressed": "var(--v2-alpha-light-10)",
			"v2-overlay-simple-overlay-contrast-hover": "var(--v2-alpha-dark-24)",
			"v2-overlay-simple-overlay-contrast-pressed": "var(--v2-alpha-dark-40)",
			"v2-overlay-simple-overlay-scrim": "var(--v2-alpha-dark-60)",
			"v2-overlay-gradient-depth-overlay-depth-top": "var(--v2-alpha-light-100)",
			"v2-overlay-gradient-depth-overlay-depth-bot": "var(--v2-alpha-light-0)",
			"v2-overlay-simple-tab-active-scrim": "#24242400",
			"v2-overlay-simple-tab-hover-scrim": "#3a3a3a00",
			"v2-overlay-simple-tab-scrim": "#08080800",
			"v2-state-bg-success": "var(--v2-green-1200)",
			"v2-state-fg-success": "var(--v2-green-500)",
			"v2-state-border-success": "var(--v2-green-900)",
			"v2-state-bg-warning": "var(--v2-yellow-1200)",
			"v2-state-fg-warning": "var(--v2-yellow-500)",
			"v2-state-border-warning": "var(--v2-yellow-900)",
			"v2-state-bg-danger": "var(--v2-red-1200)",
			"v2-state-fg-danger": "var(--v2-red-500)",
			"v2-state-border-danger": "var(--v2-red-900)",
			"v2-state-bg-info": "var(--v2-blue-1200)",
			"v2-state-fg-info": "var(--v2-blue-500)",
			"v2-state-border-info": "var(--v2-blue-900)",
			"v2-agent-plan-solid": "var(--v2-pink-400)",
			"v2-agent-plan-border": "rgba(247, 153, 198, 0.2)",
			"v2-agent-plan-background": "rgba(170, 53, 118, 0.05)",
			"v2-agent-build-solid": "var(--v2-blue-300)",
			"v2-agent-build-border": "rgba(162, 188, 255, 0.2)",
			"v2-agent-build-background": "rgba(38, 63, 169, 0.05)",
			"v2-agent-explore-solid": "var(--v2-yellow-300)",
			"v2-agent-explore-border": "rgba(243, 218, 155, 0.2)",
			"v2-agent-explore-background": "rgba(172, 136, 51, 0.05)",
			"v2-agent-review-solid": "var(--v2-green-300)",
			"v2-agent-writer-solid": "var(--v2-purple-400)",
			"v2-avatar-bg-orange": "#723d22ff",
			"v2-avatar-border-orange": "#ff8648ff",
			"v2-avatar-bg-yellow": "#68552bff",
			"v2-avatar-border-yellow": "#e7af36ff",
			"v2-avatar-bg-cyan": "#005a6eff",
			"v2-avatar-border-cyan": "#0096b8ff",
			"v2-avatar-bg-green": "#196130ff",
			"v2-avatar-border-green": "#49c970ff",
			"v2-avatar-bg-red": "#7a1f23ff",
			"v2-avatar-border-red": "#d92e3cff",
			"v2-avatar-bg-pink": "#8c2d61ff",
			"v2-avatar-border-pink": "#e4429eff",
			"v2-avatar-bg-blue": "#263fa9ff",
			"v2-avatar-border-blue": "#7698fdff",
			"v2-avatar-bg-purple": "#361f83ff",
			"v2-avatar-border-purple": "#7152f4ff",
			"v2-avatar-bg-gray": "#5c5c5cff",
			"v2-avatar-border-gray": "#aeaeaeff",
			"v2-elevation-raised": "0px 2px 4px 0px var(--v2-alpha-dark-30), 0px 1px 2px 0px var(--v2-alpha-dark-30), 0px 0px 0px 0.5px var(--v2-alpha-light-16), 0px -0.5px 0px 0px var(--v2-alpha-light-6)",
			"v2-elevation-floating": "0px 8px 16px 0px var(--v2-alpha-dark-30), 0px 4px 8px 0px var(--v2-alpha-dark-30), 0px 0px 0px 0.5px var(--v2-alpha-light-16), 0px -0.5px 0px 0px var(--v2-alpha-light-6)",
			"v2-elevation-overlay": "0px 16px 32px 0px var(--v2-alpha-dark-30), 0px 8px 16px 0px var(--v2-alpha-dark-30), 0px 0px 0px 0.5px var(--v2-alpha-light-16), 0px -0.5px 0px 0px var(--v2-alpha-light-6)",
			"v2-elevation-input": "0px 1px 2px 0px var(--v2-alpha-dark-0), 0px 0px 0px 0.5px var(--v2-alpha-light-16), 0px -0.5px 0px 0px var(--v2-alpha-light-6)",
			"v2-elevation-button-neutral": "0px 1px 2px 0px var(--v2-alpha-dark-40), 0px 0px 0px 0.5px var(--v2-alpha-light-20), 0px -0.5px 0px 0px var(--v2-alpha-light-10)",
			"v2-elevation-button-contrast": "0px 1px 2px 0px var(--v2-alpha-dark-40), 0px 0px 0px 0.5px var(--v2-alpha-light-40), inset 0px 0px 0px 0px var(--v2-alpha-light-0), inset 0px 0px 0px 0px var(--v2-alpha-light-0), 0px -0.5px 0px 0px var(--v2-alpha-light-30)",
			"v2-elevation-elements": "0px 0.5px 0.5px 0px var(--v2-alpha-dark-40)",
			"v2-elevation-switch-off": "inset 0px -0.5px 0px 0px var(--v2-alpha-light-10), inset 0px 0px 0px 0px var(--v2-alpha-light-0), inset 0px 0px 0px 0.5px var(--v2-alpha-light-16)",
			"v2-elevation-switch-on": "inset 0px -0.5px 0px 0px var(--v2-alpha-light-10), inset 0px 0px 0px 0px var(--v2-alpha-light-0), inset 0px 0px 0px 0.5px var(--v2-alpha-light-16)",
			"v2-illustration-illustration-layer-01": "var(--v2-grey-900)",
			"v2-illustration-illustration-layer-02": "var(--v2-grey-800)",
			"v2-illustration-illustration-layer-03": "var(--v2-grey-700)"
		}
	}
};
function tone() {
	return nativeTheme.shouldUseDarkColors ? "dark" : "light";
}
function storedBackgroundColor() {
	const saved = savedBackgroundColor();
	if (saved !== void 0) return saved;
	const dark = tone() === "dark";
	return resolveThemeVariant(dark ? oc2Theme.dark : oc2Theme.light, dark)["background-base"];
}
function savedBackgroundColor() {
	const stored = getStore().get(BACKGROUND_COLOR_KEY);
	return isString(stored) ? stored : void 0;
}
function storedZoomLevel() {
	const stored = getStore().get(ZOOM_LEVEL_KEY);
	return desktopZoomLevels.find((level) => level === stored) ?? 1;
}
function titlebarOverlay(mode = tone(), zoom = 1) {
	return {
		color: "#00000000",
		symbolColor: mode === "dark" ? "white" : "black",
		height: Math.max(44, Math.round(44 * zoom))
	};
}
function platformFrame(mode, zoom) {
	const frame = {};
	if (process.platform === "darwin") {
		frame.titleBarStyle = "hidden";
		frame.trafficLightPosition = {
			x: 14,
			y: 14
		};
	}
	if (process.platform === "win32") {
		frame.frame = false;
		frame.titleBarStyle = "hidden";
		frame.titleBarOverlay = titlebarOverlay(mode, zoom);
	}
	return frame;
}
/**
* apna-opencode: on Windows 11 the window itself is glass. The system blurs whatever is behind the window (acrylic),
* and the app paints its panels half see-through on top (packages/app/src/apna-glass.css). APNA_GLASS=0 turns it
* off, for a machine where the effect misbehaves.
*/
var glassEnabled = process.platform === "win32" && process.env.APNA_GLASS !== "0";
/** Window options for glass: a clear background and the acrylic material. Empty where glass is off. */
var windowGlass = glassEnabled ? {
	backgroundColor: "#00000000",
	backgroundMaterial: "acrylic"
} : {};
//#endregion
//#region src/main/windows/early-machine.ts
var NONE = Object.freeze({ status: "none" });
var CLOSED = Object.freeze({ status: "closed" });
function initialEarlyWindowState() {
	return NONE;
}
function transitionEarlyWindow(state, event) {
	if (event.type === "early.created") return state.status === "none" ? {
		state: {
			status: "pending",
			id: event.id,
			entry: event.entry
		},
		commands: []
	} : unchanged$1(state);
	if (event.type === "restore.requested") return restore(state, event);
	if (state.status !== "pending" && state.status !== "adopted") return unchanged$1(state);
	if (event.entry !== state.entry) return unchanged$1(state);
	if (event.type === "external.opened") return unchanged$1(state, state.status === "pending" ? [{
		type: "open-external-early",
		url: event.url
	}] : [{
		type: "open-external-adopted",
		url: event.url,
		openExternal: state.openExternal
	}]);
	if (state.status === "pending") return {
		state: CLOSED,
		commands: [{ type: "quit" }]
	};
	return {
		state: NONE,
		commands: []
	};
}
function restore(state, event) {
	if (state.status === "closed") return unchanged$1(state);
	if (state.status === "pending" && event.destroyed) return {
		state: CLOSED,
		commands: [{ type: "quit" }]
	};
	if (state.status !== "pending") return unchanged$1(state, [{
		type: "restore-windows",
		plan: (event.ids.length ? event.ids : [event.fallbackId]).map((id) => ({
			kind: "create",
			id
		}))
	}]);
	const ids = event.ids.length ? event.ids : [state.id];
	const plan = ids.map((id) => id === state.id ? {
		kind: "adopt",
		id,
		entry: state.entry
	} : {
		kind: "create",
		id
	});
	if (!ids.includes(state.id)) return {
		state: NONE,
		commands: [{
			type: "destroy-early",
			entry: state.entry
		}, {
			type: "restore-windows",
			plan
		}]
	};
	return {
		state: {
			status: "adopted",
			id: state.id,
			entry: state.entry,
			openExternal: event.openExternal
		},
		commands: [{
			type: "restore-windows",
			plan
		}]
	};
}
function unchanged$1(state, commands = []) {
	return {
		state,
		commands
	};
}
/** The first window closed before the layers adopted it, so the app is quitting. */
var isEarlyWindowClosed = (state) => state.status === "closed";
//#endregion
//#region src/main/windows/headers.ts
var documentPolicyHeader = "Document-Policy";
var jsCallStacksDocumentPolicy = "include-js-call-stacks-in-crash-reports";
function addRendererHeaders(headers, options) {
	upsertHeader(headers, "Access-Control-Allow-Origin", ["*"]);
	if (!hasHeader(headers, "Access-Control-Allow-Headers")) upsertHeader(headers, "Access-Control-Allow-Headers", ["*, authorization"]);
	if (!hasHeader(headers, "Access-Control-Max-Age")) upsertHeader(headers, "Access-Control-Max-Age", ["7200"]);
	if (options.document) upsertHeader(headers, documentPolicyHeader, [jsCallStacksDocumentPolicy]);
}
function hasHeader(headers, key) {
	return Object.keys(headers).some((header) => header.toLowerCase() === key.toLowerCase());
}
function upsertHeader(headers, key, value) {
	const current = Object.keys(headers).find((header) => header.toLowerCase() === key.toLowerCase());
	headers[current ?? key] = value;
}
//#endregion
//#region src/main/windows/protocol-machine.ts
var SETTLED = Object.freeze({ status: "settled" });
function createProtocolBurstState() {
	return {
		status: "idle",
		inflight: 0,
		served: false
	};
}
function transitionProtocolBurst(state, event) {
	if (state.status === "settled") return event.type === "wait.requested" ? unchanged(state, [{
		type: "resolve",
		replies: [event.reply]
	}]) : unchanged(state);
	if (state.status === "idle") return idle(state, event);
	switch (event.type) {
		case "wait.requested": return to({
			...state,
			replies: [...state.replies, event.reply]
		});
		case "cap.elapsed":
		case "cancelled": return settle(state.replies);
		case "request.started":
			if (state.status === "serving") return to({
				...state,
				inflight: state.inflight + 1
			});
			return {
				state: {
					status: "serving",
					inflight: 1,
					quietMs: state.quietMs,
					attempt: state.status === "quiet" ? state.attempt : 0,
					replies: state.replies
				},
				commands: state.status === "quiet" ? [{ type: "cancel-quiet-timer" }] : []
			};
		case "request.finished":
			if (state.status !== "serving") return unchanged(state);
			if (state.inflight > 1) return to({
				...state,
				inflight: state.inflight - 1
			});
			return quiet(state.quietMs, state.attempt + 1, state.replies);
		case "quiet.elapsed":
			if (state.status !== "quiet" || state.attempt !== event.attempt) return unchanged(state);
			return settle(state.replies);
	}
}
function idle(state, event) {
	switch (event.type) {
		case "request.started": return to({
			...state,
			inflight: state.inflight + 1
		});
		case "request.finished":
			if (state.inflight === 0) return unchanged(state);
			return to({
				...state,
				inflight: state.inflight - 1,
				served: true
			});
		case "cancelled": return to(SETTLED);
		case "wait.requested": {
			const cap = {
				type: "start-cap-timer",
				delayMs: event.capMs
			};
			if (state.inflight > 0) return {
				state: {
					status: "serving",
					inflight: state.inflight,
					quietMs: event.quietMs,
					attempt: 0,
					replies: [event.reply]
				},
				commands: [cap]
			};
			if (state.served) {
				const next = quiet(event.quietMs, 1, [event.reply]);
				return {
					state: next.state,
					commands: [cap, ...next.commands]
				};
			}
			return {
				state: {
					status: "awaiting-first",
					quietMs: event.quietMs,
					replies: [event.reply]
				},
				commands: [cap]
			};
		}
	}
	return unchanged(state);
}
function quiet(quietMs, attempt, replies) {
	return {
		state: {
			status: "quiet",
			quietMs,
			attempt,
			replies
		},
		commands: [{
			type: "start-quiet-timer",
			attempt,
			delayMs: quietMs
		}]
	};
}
function settle(replies) {
	return {
		state: SETTLED,
		commands: [{ type: "clear-timers" }, {
			type: "resolve",
			replies
		}]
	};
}
function to(state) {
	return {
		state,
		commands: []
	};
}
function unchanged(state, commands = []) {
	return {
		state,
		commands
	};
}
/** Requests after the burst settled are not tracked. */
var isProtocolBurstSettled = (state) => state.status === "settled";
//#endregion
//#region src/main/windows/protocol.ts
var report = (level, message, data) => console[level === "error" ? "error" : "warn"](message, data);
function setProtocolReporter(reporter) {
	report = reporter;
}
var burst = { state: createProtocolBurstState() };
var timers = {};
var dispatch$1 = (event) => {
	const next = transitionProtocolBurst(burst.state, event);
	burst.state = next.state;
	next.commands.forEach(perform$1);
};
var perform$1 = (command) => {
	switch (command.type) {
		case "start-cap-timer":
			clearTimeout(timers.cap);
			timers.cap = setTimeout(() => dispatch$1({ type: "cap.elapsed" }), command.delayMs);
			return;
		case "start-quiet-timer":
			clearTimeout(timers.quiet);
			timers.quiet = setTimeout(() => dispatch$1({
				type: "quiet.elapsed",
				attempt: command.attempt
			}), command.delayMs);
			return;
		case "cancel-quiet-timer":
			clearTimeout(timers.quiet);
			timers.quiet = void 0;
			return;
		case "clear-timers":
			clearTimeout(timers.cap);
			clearTimeout(timers.quiet);
			timers.cap = void 0;
			timers.quiet = void 0;
			return;
		case "resolve": return command.replies.forEach((reply) => reply());
	}
};
function rendererAssetsServed(options) {
	return new Promise((reply) => dispatch$1({
		type: "wait.requested",
		...options,
		reply
	}));
}
/** The first window closed before the bundle loaded: the app quits, so nothing waits for its assets. */
function cancelRendererAssetsServed() {
	dispatch$1({ type: "cancelled" });
}
function registerRendererProtocol(rendererRoot) {
	if (protocol.isProtocolHandled("oc")) return;
	protocol.handle("oc", async (request) => {
		if (isProtocolBurstSettled(burst.state)) return serve(request, rendererRoot);
		dispatch$1({ type: "request.started" });
		try {
			return await serve(request, rendererRoot);
		} finally {
			dispatch$1({ type: "request.finished" });
		}
	});
}
async function serve(request, rendererRoot) {
	const url = new URL(request.url);
	if (url.host !== "renderer") {
		report("warning", "rejected host", { url: request.url });
		return new Response("Not found", { status: 404 });
	}
	const file = path.resolve(rendererRoot, `.${decodeURIComponent(url.pathname)}`);
	const rel = path.relative(rendererRoot, file);
	if (rel.startsWith("..") || path.isAbsolute(rel)) {
		report("warning", "rejected path", {
			url: request.url,
			file
		});
		return new Response("Not found", { status: 404 });
	}
	try {
		const range = request.headers.get("range");
		const response = await net.fetch(pathToFileURL(file).toString(), { headers: range ? { range } : void 0 });
		if (response.status >= 400) report("error", "fetch failed", {
			url: request.url,
			file,
			status: response.status,
			statusText: response.statusText
		});
		return addDocumentPolicy(response, file);
	} catch (error) {
		report("error", "fetch error", {
			url: request.url,
			file,
			error: error instanceof Error ? error : String(error)
		});
		return new Response("Not found", { status: 404 });
	}
}
function addDocumentPolicy(response, file) {
	if (!file.toLowerCase().endsWith(".html")) return response;
	const headers = new Headers(response.headers);
	headers.set(documentPolicyHeader, jsCallStacksDocumentPolicy);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
//#endregion
//#region src/main/windows/registry.ts
/** The valid ids in the persisted window list. The early window and the registry must agree on them. */
function persistedWindowIDs(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((id) => isString(id) && id.length > 0);
}
function createWindowRegistry(persistence) {
	const windows = /* @__PURE__ */ new Map();
	let lastFocusedID;
	const persisted = () => persistedWindowIDs(persistence.read());
	return {
		persisted,
		register(id, window) {
			windows.set(id, window);
			const ids = persisted();
			if (!ids.includes(id)) persistence.write([...ids, id]);
		},
		focused(id) {
			lastFocusedID = id;
		},
		lastFocused() {
			if (!lastFocusedID) return;
			return windows.get(lastFocusedID);
		},
		get(id) {
			return windows.get(id);
		},
		list() {
			return [...windows.values()];
		},
		/** `quitting` is the app lifecycle's `isQuitting`. */
		closed(id, quitting) {
			windows.delete(id);
			if (lastFocusedID === id) lastFocusedID = windows.keys().next().value;
			if (quitting || windows.size === 0) return false;
			persistence.write(persisted().filter((item) => item !== id));
			return true;
		}
	};
}
//#endregion
//#region src/main/service/sidecar-credentials.ts
var current$1;
var listeners = /* @__PURE__ */ new Set();
function set(data) {
	current$1 = data;
	listeners.forEach((listener) => listener());
}
function get() {
	return current$1;
}
/** Runs `listener` after each `set`: the first connection and every reconnect. Returns a function that stops it. */
function onChange(listener) {
	listeners.add(listener);
	return () => void listeners.delete(listener);
}
/** What the renderer learns about the sidecar: its origin, never its credential. */
function ready(data) {
	return { url: data.url };
}
/** The Basic credential for a request to the sidecar origin, or undefined for any other URL. */
function authorization(sidecar, url) {
	if (!sidecar?.password || !URL.canParse(url)) return;
	if (new URL(url).origin !== sidecar.url) return;
	return `Basic ${Buffer.from(`opencode:${sidecar.password}`).toString("base64")}`;
}
//#endregion
//#region src/main/windows/security.ts
var rendererPermissions = /* @__PURE__ */ new Set(["clipboard-sanitized-write", "notifications"]);
var allowedBySession = /* @__PURE__ */ new WeakMap();
var wiredHeaderSessions = /* @__PURE__ */ new WeakSet();
function allowRendererPermissions(win) {
	if (win.isDestroyed() || win.webContents.isDestroyed()) return;
	const webContents = win.webContents;
	const session = webContents.session;
	const allowed = allowedBySession.get(session) ?? registerPermissionHandlers(session);
	const id = webContents.id;
	if (allowed.has(id)) return;
	allowed.add(id);
	const remove = () => {
		allowed.delete(id);
	};
	webContents.once("destroyed", remove);
	win.once("closed", remove);
}
function registerPermissionHandlers(session) {
	const allowed = /* @__PURE__ */ new Set();
	allowedBySession.set(session, allowed);
	session.setPermissionRequestHandler((webContents, permission, callback, details) => {
		if (permission === "media") {
			callback(allowed.has(webContents.id) && isRendererUrl(details.requestingUrl) && details.isMainFrame && "mediaTypes" in details && !!details.mediaTypes?.length && details.mediaTypes.every((type) => type === "audio"));
			return;
		}
		callback(rendererPermissions.has(permission) && isRendererUrl(details.requestingUrl) && allowed.has(webContents.id));
	});
	session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
		if (permission === "media") return webContents !== null && allowed.has(webContents.id) && isRendererUrl(details.requestingUrl) && details.isMainFrame && details.mediaType === "audio";
		if (!rendererPermissions.has(permission)) return false;
		if (webContents ? !allowed.has(webContents.id) : allowed.size === 0) return false;
		return isRendererUrl(details.requestingUrl) || isRendererUrl(requestingOrigin);
	});
	return allowed;
}
function wireNavigationPolicy(win, openExternalURL) {
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (!isRendererUrl(url)) openExternalURL(url);
		return { action: "deny" };
	});
	win.webContents.on("will-navigate", (event, url) => {
		if (isRendererUrl(url)) return;
		event.preventDefault();
		openExternalURL(url);
	});
}
function wireRendererHeaders(win) {
	const session = win.webContents.session;
	if (wiredHeaderSessions.has(session)) return;
	wiredHeaderSessions.add(session);
	session.webRequest.onBeforeSendHeaders({ urls: ["http://127.0.0.1/*", "http://localhost/*"] }, (details, callback) => {
		const frame = details.frame;
		const authorization$1 = !!frame && frame.parent === null && isRendererUrl(frame.url) && authorization(get(), details.url);
		if (authorization$1 && !hasHeader(details.requestHeaders, "Authorization")) upsertHeader(details.requestHeaders, "Authorization", authorization$1);
		callback({ requestHeaders: details.requestHeaders });
	});
	session.webRequest.onHeadersReceived((details, callback) => {
		const responseHeaders = details.responseHeaders ?? {};
		addRendererHeaders(responseHeaders, { document: isRendererUrl(details.url, true) });
		callback({ responseHeaders });
	});
}
//#endregion
//#region src/main/windows/window-state.ts
var StateFile = fromJsonString(Struct({
	x: optional(Int),
	y: optional(Int),
	width: optional(Int),
	height: optional(Int),
	displayBounds: optional(Struct({
		x: Int,
		y: Int,
		width: Int,
		height: Int
	})),
	isMaximized: optional(Boolean$1),
	isFullScreen: optional(Boolean$1)
}));
function resolveWindowState(saved, defaults, displays) {
	if (!saved) return {
		width: defaults.width,
		height: defaults.height
	};
	if (!hasBounds(saved)) return saved.isMaximized || saved.isFullScreen ? {
		...saved,
		width: defaults.width,
		height: defaults.height
	} : {
		width: defaults.width,
		height: defaults.height
	};
	const savedDisplay = saved.displayBounds;
	if (!savedDisplay) return saved;
	const all = displays.all();
	const target = saved.isMaximized || saved.isFullScreen ? all.find((bounds) => sameBounds(bounds, savedDisplay)) : void 0;
	if (target && !within(saved, target)) {
		const width = Math.min(saved.width, target.width);
		const height = Math.min(saved.height, target.height);
		return {
			...saved,
			x: target.x + Math.floor((target.width - width) / 2),
			y: target.y + Math.floor((target.height - height) / 2),
			width,
			height
		};
	}
	if (all.some((bounds) => within(saved, bounds))) return saved;
	const primary = displays.primary();
	return {
		width: defaults.width,
		height: defaults.height,
		x: primary.x,
		y: primary.y,
		displayBounds: primary,
		isMaximized: saved.isMaximized,
		isFullScreen: saved.isFullScreen
	};
}
function windowStateFile(id) {
	return `window-state-${id.replace(/[^a-zA-Z0-9._-]/g, "-")}.json`;
}
function readWindowState(file) {
	if (!existsSync(file)) return void 0;
	return getOrUndefined(decodeUnknownOption(StateFile)(readFileSync(file, "utf8")));
}
function manageWindowState(win, file, initial, displays) {
	const state = { ...initial };
	if (state.isMaximized) win.maximize();
	if (state.isFullScreen) win.setFullScreen(true);
	let timer;
	const update = () => {
		if (win.isDestroyed()) return;
		const bounds = win.getBounds();
		if (!win.isMaximized() && !win.isMinimized() && !win.isFullScreen()) {
			state.x = bounds.x;
			state.y = bounds.y;
			state.width = bounds.width;
			state.height = bounds.height;
		}
		state.isMaximized = win.isMaximized();
		state.isFullScreen = win.isFullScreen();
		state.displayBounds = displays.matching(bounds);
	};
	const changed = () => {
		clearTimeout(timer);
		timer = setTimeout(update, 100);
	};
	const closed = () => {
		clearTimeout(timer);
		win.off("resize", changed);
		win.off("move", changed);
		win.off("close", update);
		win.off("closed", closed);
		mkdirSync(path.dirname(file), { recursive: true });
		writeFileSync(`${file}.tmp`, JSON.stringify(state));
		renameSync(`${file}.tmp`, file);
	};
	win.on("resize", changed);
	win.on("move", changed);
	win.on("close", update);
	win.on("closed", closed);
}
function hasBounds(state) {
	return state.x !== void 0 && state.y !== void 0 && (state.width ?? 0) > 0 && (state.height ?? 0) > 0;
}
function within(state, bounds) {
	return state.x >= bounds.x && state.y >= bounds.y && state.x + state.width <= bounds.x + bounds.width && state.y + state.height <= bounds.y + bounds.height;
}
function sameBounds(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
//#endregion
//#region src/main/windows/early.ts
var current = { state: initialEarlyWindowState() };
var dispatch = (event) => {
	const next = transitionEarlyWindow(current.state, event);
	current.state = next.state;
	next.commands.forEach(perform);
	return next.commands;
};
var perform = (command) => {
	if (command.type === "open-external-early") {
		const target = resolveExternalURL(command.url);
		if (target) shell.openExternal(target);
		return;
	}
	if (command.type === "open-external-adopted") return command.openExternal(command.url);
	if (command.type === "destroy-early") {
		if (!command.entry.win.isDestroyed()) command.entry.win.destroy();
		return;
	}
	if (command.type !== "quit") return;
	cancelRendererAssetsServed();
	app.quit();
};
var displays = {
	all: () => screen.getAllDisplays().map((display) => display.bounds),
	primary: () => screen.getPrimaryDisplay().bounds,
	matching: (bounds) => screen.getDisplayMatching(bounds).bounds
};
function createEarlyWindow() {
	const id = persistedWindowIDs(getStore().get("windowIds"))[0] ?? randomUUID();
	const root = path.dirname(fileURLToPath(import.meta.url));
	const file = path.join(app.getPath("userData"), windowStateFile(id));
	const state = resolveWindowState(readWindowState(file), {
		width: 1280,
		height: 800
	}, displays);
	const zoom = storedZoomLevel();
	const icons = app.isPackaged ? path.join(process.resourcesPath, "icons") : path.join(root, "../../resources/icons");
	const deferReveal = process.platform === "win32" && state.isMaximized;
	const win = new BrowserWindow({
		x: state.x,
		y: state.y,
		width: state.width,
		height: state.height,
		show: !deferReveal,
		autoHideMenuBar: true,
		title: "Apna OpenCode",
		icon: path.join(icons, `icon.${process.platform === "win32" ? "ico" : "png"}`),
		backgroundColor: storedBackgroundColor(),
		...windowGlass,
		...platformFrame(tone(), zoom),
		webPreferences: {
			preload: path.join(root, "../preload/index.cjs"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
			zoomFactor: zoom,
			additionalArguments: windowArguments(id)
		}
	});
	manageWindowState(win, file, state, displays);
	if (deferReveal) win.show();
	const entry = {
		id,
		win,
		state,
		shownAt: Date.now()
	};
	dispatch({
		type: "early.created",
		id,
		entry
	});
	win.once("closed", () => dispatch({
		type: "early.closed",
		entry
	}));
	registerRendererProtocol(path.join(root, "../renderer"));
	allowRendererPermissions(win);
	wireNavigationPolicy(win, (url) => dispatch({
		type: "external.opened",
		entry,
		url
	}));
	wireRendererHeaders(win);
	loadWindow(win, "index.html");
}
/** The user closed the first window before the layers adopted it, so the app is quitting. */
function earlyWindowClosed() {
	return isEarlyWindowClosed(current.state);
}
/**
* Plans the windows to restore: the early window is adopted when its id is still persisted, and nothing is restored
* once it closed. Its external links switch to `openExternal`.
*/
function restoreEarlyWindow(input) {
	const pending = current.state.status === "pending" ? current.state.entry : void 0;
	return dispatch({
		type: "restore.requested",
		ids: input.ids,
		fallbackId: input.fallbackId,
		destroyed: !!pending?.win.isDestroyed(),
		openExternal: input.openExternal
	}).flatMap((command) => command.type === "restore-windows" ? command.plan : []);
}
//#endregion
//#region src/main/index.ts
configureApplication();
if (acquireApplicationLock()) {
	registerRendererScheme();
	app.whenReady().then(async () => {
		marks.ready = Date.now();
		registerStorageSnapshotHandler();
		createEarlyWindow();
		marks.window = Date.now();
		startSidecarProbe();
		if (!process.env.ELECTRON_RENDERER_URL) await rendererAssetsServed({
			quietMs: 40,
			capMs: 400
		});
		marks.served = Date.now();
		if (earlyWindowClosed()) return;
		return import("./desktop-BSCRb8al.js").then((n) => n.t);
	});
}
//#endregion
export { takeSidecarProbe as $, nextDesktopZoomLevel as A, ZOOM_LEVEL_KEY as B, tone as C, desktopMenuVisible as D, desktopMenuKey as E, FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY as F, readEnableState as G, resolveLocalFilePath as H, PINCH_ZOOM_ENABLED_KEY as I, isRendererUrl as J, isCliDatabase as K, SPELLCHECK_ENABLED_KEY as L, getStore as M, BACKGROUND_COLOR_KEY as N, desktopMenuWithPlugins as O, BUNDLED_CLI_VERSION_KEY as P, windowDataFile as Q, SPELLCHECK_LANGUAGES_KEY as R, titlebarOverlay as S, DESKTOP_MENU as T, setStorageSnapshotObserver as U, resolveExternalURL as V, setStorageSnapshotProvider as W, DragCancelEvent as X, loadWindow as Y, IpcTransportPort as Z, glassEnabled as _, windowStateFile as a, storedBackgroundColor as b, wireRendererHeaders as c, onChange as d, VERSION as et, ready as f, setProtocolReporter as g, registerRendererProtocol as h, resolveWindowState as i, windowArguments as j, desktopZoomLevels as k, authorization as l, createWindowRegistry as m, manageWindowState as n, memoryLogInterval as nt, allowRendererPermissions as o, set as p, migrateDatabase as q, readWindowState as r, marks as rt, wireNavigationPolicy as s, restoreEarlyWindow as t, debugBuild as tt, get as u, platformFrame as v, windowGlass as w, storedZoomLevel as x, savedBackgroundColor as y, WINDOW_IDS_KEY as z };
