import { I as Literals, U as NullOr, at as String$1, l as Boolean, o as ArraySchema, ot as Struct } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { safeStorage } from "electron";
import path from "node:path";
import { once } from "node:events";
import { access } from "node:fs/promises";
import { spawn } from "node:child_process";
//#region ../gui-plugins/src/router/contract.ts
var RouterState = Struct({
	/**
	* - `checking`: not asked yet.
	* - `missing`: the router program is not on this machine.
	* - `stopped`: it is installed and not running.
	* - `starting`, `installing`, `running`.
	* - `failed`: starting or installing failed; `message` says why.
	*/
	status: Literals([
		"checking",
		"missing",
		"stopped",
		"starting",
		"installing",
		"running",
		"failed"
	]),
	message: NullOr(String$1),
	/** The app knows the router's client key, so it can list and add connections. */
	hasKey: Boolean,
	/** The key came from the OMNIROUTE_API_KEY environment variable rather than from this page. */
	keyFromEnv: Boolean,
	connections: ArraySchema(Struct({
		id: String$1,
		provider: String$1,
		name: String$1,
		active: Boolean,
		status: NullOr(String$1)
	})),
	/** The provider id a connect is running for. */
	connecting: NullOr(String$1)
});
/** The local AI router (OmniRoute): its process, its client key, and the provider connections it holds. */
var Router = Ipc.define({
	id: "router",
	state: RouterState,
	methods: {
		/** Asks the router again whether it runs and which connections it has. */
		refresh: {},
		/** Starts the router in the background when it is installed and not running. */
		start: {},
		/** Installs the router with npm, then starts it. */
		install: {},
		/** Saves the router's own client key, encrypted with the system's keychain. An empty key forgets it. */
		setKey: { input: String$1 },
		/**
		* Adds a provider connection with the pasted API key, then asks the router to test it. Rejects with the router's
		* message when the key is refused.
		*/
		connect: { input: Struct({
			provider: String$1,
			key: String$1
		}) },
		/** Removes a connection from the router. */
		disconnect: { input: String$1 }
	}
});
//#endregion
//#region ../gui-plugins/src/router/providers.ts
/** The providers offered on the page. Any other provider is added from the router's own dashboard. */
var providers = [
	{
		id: "gemini",
		name: "Gemini (Google AI Studio)",
		keyUrl: "https://aistudio.google.com/apikey",
		free: true
	},
	{
		id: "groq",
		name: "Groq",
		keyUrl: "https://console.groq.com/keys",
		free: true
	},
	{
		id: "openrouter",
		name: "OpenRouter",
		keyUrl: "https://openrouter.ai/settings/keys",
		free: true
	},
	{
		id: "cerebras",
		name: "Cerebras",
		keyUrl: "https://cloud.cerebras.ai/",
		free: true
	},
	{
		id: "mistral",
		name: "Mistral",
		keyUrl: "https://console.mistral.ai/api-keys",
		free: true
	},
	{
		id: "nvidia",
		name: "NVIDIA NIM",
		keyUrl: "https://build.nvidia.com/settings/api-keys",
		free: true
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		keyUrl: "https://platform.deepseek.com/api_keys",
		free: false
	},
	{
		id: "openai",
		name: "OpenAI",
		keyUrl: "https://platform.openai.com/api-keys",
		free: false
	},
	{
		id: "anthropic",
		name: "Anthropic",
		keyUrl: "https://console.anthropic.com/settings/keys",
		free: false
	},
	{
		id: "xai",
		name: "xAI (Grok)",
		keyUrl: "https://console.x.ai/",
		free: false
	}
];
/** The router's local address. The app only ever talks to this machine. */
var routerUrl = "http://127.0.0.1:20128";
var text = (value) => typeof value === "string" ? value : void 0;
function fields(value) {
	return typeof value === "object" && value !== null ? Object.fromEntries(Object.entries(value)) : void 0;
}
/** Reads the router's connection list, keeping only what the page shows. Keys and tokens are never kept. */
function readConnections(body) {
	const list = fields(body)?.connections;
	if (!Array.isArray(list)) return [];
	return list.flatMap((entry) => {
		const item = fields(entry);
		const id = text(item?.id);
		const provider = text(item?.provider);
		if (!item || id === void 0 || provider === void 0) return [];
		return [{
			id,
			provider,
			name: text(item.name) ?? provider,
			active: item.isActive !== false,
			status: text(item.testStatus) ?? null
		}];
	});
}
/** The message of a router error reply, whatever shape it has; undefined when it carries none. */
function readError(body) {
	const record = fields(body);
	const error = record?.error;
	return text(error) ?? text(fields(error)?.message) ?? text(record?.message);
}
/**
* Why the router's key test failed; undefined when the key works. The router answers a refused key with HTTP 200
* and `valid: false`, so the body decides, not the status alone.
*/
function readTestFailure(ok, status, body) {
	const failure = readError(body);
	if (!ok) return failure ?? `The key test answered ${status}.`;
	if (fields(body)?.valid === false) return failure ?? "The provider refused this key.";
}
/** A connection name that is not taken yet: "main", then "main-2", "main-3"... */
function freeName(taken) {
	if (!taken.includes("main")) return "main";
	return Array.from({ length: taken.length + 1 }, (_, index) => `main-${index + 2}`).find((name) => !taken.includes(name)) ?? `main-${taken.length + 2}`;
}
//#endregion
//#region ../gui-plugins/src/router/main.ts
var programName = process.platform === "win32" ? "omniroute.cmd" : "omniroute";
var exists = (file) => access(file).then(() => true, () => false);
var sleep = (ms, signal) => new Promise((resolve) => {
	const timer = setTimeout(resolve, ms);
	signal.addEventListener("abort", () => {
		clearTimeout(timer);
		resolve();
	}, { once: true });
});
var messageOf = (error) => error instanceof Error ? error.message : String(error);
/** The router's command on this machine: npm's global folder first, then `PATH`. Undefined when there is none. */
async function findProgram() {
	const candidates = [...process.env.APPDATA ? [path.join(process.env.APPDATA, "npm", programName)] : [], ...(process.env.PATH ?? "").split(path.delimiter).filter((directory) => directory !== "").map((directory) => path.join(directory, programName))];
	for (const candidate of candidates) if (await exists(candidate)) return candidate;
}
var setup = (ctx) => {
	const log = ctx.log;
	const signal = ctx.signal;
	const savedKey = ctx.storage.store("client-key", {
		schema: String$1,
		initial: ""
	});
	const current = {
		status: "checking",
		message: null,
		connections: [],
		connecting: null
	};
	const clientKey = () => {
		if (process.env.OMNIROUTE_API_KEY) return process.env.OMNIROUTE_API_KEY;
		if (savedKey.value === "" || !safeStorage.isEncryptionAvailable()) return void 0;
		try {
			return safeStorage.decryptString(Buffer.from(savedKey.value, "base64"));
		} catch {
			return;
		}
	};
	const state = () => ({
		status: current.status,
		message: current.message,
		hasKey: clientKey() !== void 0,
		keyFromEnv: !!process.env.OMNIROUTE_API_KEY,
		connections: [...current.connections],
		connecting: current.connecting
	});
	const provider = ctx.provide(Router, {
		state,
		refresh: () => refresh(),
		start: () => start(),
		install: () => install(),
		setKey: (key) => {
			const trimmed = key.trim();
			if (trimmed !== "" && !safeStorage.isEncryptionAvailable()) throw new Error("This system cannot store the key safely.");
			savedKey.set(trimmed === "" ? "" : safeStorage.encryptString(trimmed).toString("base64"));
			return refresh();
		},
		connect: (input) => connect(input.provider, input.key),
		disconnect: (id) => disconnect(id)
	});
	/** Calls the router with its client key. Rejects on a network failure or at the timeout. */
	const call = (route, init = {}) => {
		const key = clientKey();
		return fetch(`${routerUrl}${route}`, {
			method: init.method ?? "GET",
			headers: {
				...key ? { authorization: `Bearer ${key}` } : {},
				...init.body === void 0 ? {} : { "content-type": "application/json" }
			},
			body: init.body === void 0 ? void 0 : JSON.stringify(init.body),
			signal: AbortSignal.any([signal, AbortSignal.timeout(init.timeoutMs ?? 1e4)])
		});
	};
	const running = () => call("/v1/models", { timeoutMs: 3e3 }).then(() => true, () => false);
	const refresh = async () => {
		const up = await running();
		if (signal.aborted) return;
		if (!up) {
			current.connections = [];
			if (current.status !== "starting" && current.status !== "installing" && current.status !== "failed") current.status = await findProgram() ? "stopped" : "missing";
			return provider.changed();
		}
		current.status = "running";
		current.message = null;
		current.connections = clientKey() === void 0 ? [] : await call("/api/providers").then(async (response) => response.ok ? readConnections(await response.json()) : []).catch(() => current.connections);
		provider.changed();
	};
	const start = async () => {
		if (current.status === "running" || current.status === "starting" || current.status === "installing") return;
		const program = await findProgram();
		if (!program) {
			current.status = "missing";
			return provider.changed();
		}
		current.status = "starting";
		current.message = null;
		provider.changed();
		const child = spawn(`"${program}"`, [
			"serve",
			"--daemon",
			"--no-open"
		], {
			shell: true,
			detached: true,
			stdio: "ignore",
			windowsHide: true,
			env: {
				...process.env,
				OMNIROUTE_SERVER_HOST: "127.0.0.1",
				REQUIRE_API_KEY: "true"
			}
		});
		child.on("error", () => void 0);
		child.unref();
		for (const _ of Array.from({ length: 45 })) {
			await sleep(1e3, signal);
			if (signal.aborted) return;
			if (await running()) return refresh();
		}
		current.status = "failed";
		current.message = "The router did not answer after it was started.";
		provider.changed();
	};
	const install = async () => {
		if (current.status !== "missing" && current.status !== "failed") return;
		current.status = "installing";
		current.message = null;
		provider.changed();
		try {
			const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", [
				"install",
				"-g",
				"omniroute"
			], {
				shell: true,
				stdio: "ignore",
				windowsHide: true,
				signal
			});
			const [code] = await once(child, "exit");
			if (code !== 0) throw new Error(`npm install ended with code ${String(code)}. Node.js must be installed.`);
			current.status = "stopped";
			await start();
		} catch (error) {
			if (signal.aborted) return;
			log.write("error", "router: install failed", { error: messageOf(error) });
			current.status = "failed";
			current.message = messageOf(error);
			provider.changed();
		}
	};
	const connect = async (providerID, key) => {
		if (!providers.some((item) => item.id === providerID)) throw new Error("Unknown provider.");
		if (key.trim() === "") throw new Error("The key is empty.");
		if (clientKey() === void 0) throw new Error("The router's own key is missing.");
		current.connecting = providerID;
		provider.changed();
		try {
			const taken = current.connections.filter((item) => item.provider === providerID).map((item) => item.name);
			const created = await call("/api/providers", {
				method: "POST",
				body: {
					provider: providerID,
					name: freeName(taken),
					apiKey: key.trim()
				},
				timeoutMs: 3e4
			});
			const body = await created.json().catch(() => void 0);
			if (!created.ok) throw new Error(readError(body) ?? `The router answered ${created.status}.`);
			await refresh();
			const added = current.connections.find((item) => item.provider === providerID && !taken.includes(item.name));
			if (!added) return;
			const tested = await call(`/api/providers/${encodeURIComponent(added.id)}/test`, {
				method: "POST",
				timeoutMs: 6e4
			});
			const failure = readTestFailure(tested.ok, tested.status, await tested.json().catch(() => void 0));
			if (failure === void 0) return;
			await call(`/api/providers/${encodeURIComponent(added.id)}`, { method: "DELETE" }).catch(() => void 0);
			throw new Error(failure);
		} finally {
			current.connecting = null;
			await refresh();
		}
	};
	const disconnect = async (id) => {
		const response = await call(`/api/providers/${encodeURIComponent(id)}`, {
			method: "DELETE",
			timeoutMs: 3e4
		});
		if (!response.ok) throw new Error(readError(await response.json().catch(() => void 0)) ?? `The router answered ${response.status}.`);
		await refresh();
	};
	refresh().then(() => current.status === "stopped" ? start() : void 0);
};
//#endregion
export { setup as default };
