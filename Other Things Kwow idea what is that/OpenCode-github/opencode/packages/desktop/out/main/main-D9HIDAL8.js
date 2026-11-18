import { Bt as decodeUnknownOption, Et as Unknown, F as Literal, I as Literals, Lg as isString, U as NullOr, V as NonEmptyString, W as Number$1, X as Record, at as String$1, fh as isNone, l as Boolean$1, o as ArraySchema, ot as Struct, ph as isSome, wt as Union } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import { i as builtinMainContext } from "./host-DQiQeSJn.js";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
//#region ../gui-plugins/src/wsl/contract.ts
var WslServerConfig = Struct({
	id: String$1,
	distro: String$1
});
var WslServerRuntime = Union([
	Struct({ kind: Literal("starting") }),
	Struct({
		kind: Literal("ready"),
		url: String$1,
		password: NullOr(String$1)
	}),
	Struct({
		kind: Literal("failed"),
		message: String$1
	}),
	Struct({ kind: Literal("stopped") })
]);
/** The one job a distro runs; a distro missing from `distroJobs` runs none. */
var WslDistroJob = Literals([
	"probing",
	"installing",
	"updating",
	"starting",
	"removing"
]);
var WslRuntimeCheck = Struct({
	available: Boolean$1,
	version: NullOr(String$1),
	error: NullOr(String$1)
});
var WslInstalledDistro = Struct({
	name: String$1,
	version: NullOr(Number$1),
	isDefault: Boolean$1
});
var WslOnlineDistro = Struct({
	name: String$1,
	label: String$1
});
var WslDistroProbe = Struct({
	name: String$1,
	canExecute: Boolean$1,
	hasBash: Boolean$1,
	hasCurl: Boolean$1,
	error: NullOr(String$1)
});
var WslOpencodeCheck = Struct({
	distro: String$1,
	resolvedPath: NullOr(String$1),
	version: NullOr(String$1),
	expectedVersion: NullOr(String$1),
	matchesDesktop: NullOr(Boolean$1),
	error: NullOr(String$1)
});
var WslServerItem = Struct({
	config: WslServerConfig,
	runtime: WslServerRuntime
});
var WslServersState = Struct({
	runtime: NullOr(WslRuntimeCheck),
	installed: ArraySchema(WslInstalledDistro),
	online: ArraySchema(WslOnlineDistro),
	distroProbes: Record(String$1, WslDistroProbe),
	opencodeChecks: Record(String$1, WslOpencodeCheck),
	pendingRestart: Boolean$1,
	servers: ArraySchema(WslServerItem),
	hostJob: Literals(["idle", "busy"]),
	distroJobs: Record(String$1, WslDistroJob)
});
var Name = Struct({ name: NonEmptyString });
var Id$1 = Struct({ id: NonEmptyString });
/** WSL runtime, distros, and the OpenCode servers the main process runs inside them. */
var Wsl = Ipc.define({
	id: "wsl",
	state: WslServersState,
	methods: {
		probeRuntime: {},
		refreshDistros: {},
		installWsl: {},
		installDistro: { input: Name },
		probeAddable: { input: Struct({ distros: ArraySchema(NonEmptyString) }) },
		installOpencode: { input: Name },
		addServer: {
			input: Struct({ distro: NonEmptyString }),
			output: WslServerConfig
		},
		removeServer: { input: Id$1 },
		startServer: { input: Id$1 }
	}
});
//#endregion
//#region ../gui-plugins/src/wsl/remote-cli.ts
function quote(value) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function requireVersion(version) {
	if (version !== "local" && !/^[0-9][a-zA-Z0-9.+-]*$/.test(version)) throw new Error(version);
	return version;
}
function discoverScript() {
	return `cli=""
if [ -z "$cli" ] && [ -x "$HOME/.opencode/bin/opencode" ]; then cli="$HOME/.opencode/bin/opencode"; fi
if [ -n "$cli" ]; then printf '%s\\n' "$cli"; fi
`;
}
function versionScript(command) {
	return `if [ -x ${command} ]; then ${command} --version 2>/dev/null || true; fi\n`;
}
function parseVersion(output) {
	const line = output.split(/\r?\n/).find((line) => line.trim())?.trim();
	if (!line) return null;
	const marker = line.lastIndexOf(" v");
	const version = marker === -1 ? line : line.slice(marker + 2);
	if (!version) throw new Error("V2 CLI did not provide a version");
	return version;
}
/** The managed CLI installer also configures the user's shell PATH. */
function installScript(input) {
	const version = requireVersion(input.version);
	return `set -eu
curl -fsSL https://raw.githubusercontent.com/anomalyco/opencode/v2/install | bash -s -- ${input.binary ? `--binary ${input.binary}` : `--version ${quote(version)}`}
test "$("$HOME/.opencode/bin/opencode" --version | awk '{print $NF}' | sed 's/^v//')" = ${quote(version)}
`;
}
//#endregion
//#region ../gui-plugins/src/wsl/runtime.ts
var DEFAULT_WSL_TIMEOUT_MS = 2e4;
var DEFAULT_WSL_INSTALL_TIMEOUT_MS = 9e5;
function wslArgs(args, distro, user) {
	return [
		...distro ? ["-d", distro] : [],
		...user ? ["--user", user] : [],
		"--exec",
		...args
	];
}
function wslCliInstallCommand(cli) {
	return installScript({
		version: cli.version,
		binary: cli.binary ? `"$(wslpath -a ${shellEscape(cli.binary)})"` : void 0
	});
}
function summarize(value) {
	return value.split(/\r?\n/g).map((line) => line.trim()).filter(Boolean).join("\n");
}
function shellEscape(value) {
	return `'${value.replace(/'/g, `'"'"'`)}'`;
}
/** WSL commands; `t` resolves the plugin's copy for errors the user sees. */
function createWslRuntime(t) {
	const runWsl = (args, opts = {}) => runCommand("wsl", args, opts);
	const runPowerShell = (command, opts = {}) => runCommand("powershell.exe", [
		"-NoProfile",
		"-NonInteractive",
		"-ExecutionPolicy",
		"Bypass",
		"-Command",
		command
	], opts);
	const runCommand = (command, args, opts = {}) => new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			windowsHide: true,
			signal: opts.signal
		});
		const timeoutMs = opts.timeoutMs ?? DEFAULT_WSL_TIMEOUT_MS;
		const timeoutId = setTimeout(() => {
			try {
				child.kill();
			} catch {}
			reject(new Error(t("error.commandTimeout", {
				command,
				args: args.join(" "),
				timeout: timeoutMs
			})));
		}, timeoutMs);
		let stdout = "";
		let stderr = "";
		const stdoutDecoder = createOutputDecoder();
		const stderrDecoder = createOutputDecoder();
		const append = (stream, chunk) => {
			if (!chunk) return;
			if (stream === "stdout") {
				stdout += chunk;
				return;
			}
			stderr += chunk;
		};
		child.stdout.on("data", (chunk) => {
			append("stdout", stdoutDecoder.decode(chunk));
		});
		child.stdout.on("end", () => {
			append("stdout", stdoutDecoder.flush());
		});
		child.stderr.on("data", (chunk) => {
			append("stderr", stderrDecoder.decode(chunk));
		});
		child.stderr.on("end", () => {
			append("stderr", stderrDecoder.flush());
		});
		child.once("error", (error) => {
			clearTimeout(timeoutId);
			reject(error);
		});
		child.once("close", (code, signal) => {
			clearTimeout(timeoutId);
			resolve({
				code,
				signal,
				stdout,
				stderr
			});
		});
	});
	const runInteractiveCommand = async (command, args, opts = {}, defaultTimeoutMs) => {
		const pty = await import("@lydell/node-pty-win32-x64");
		return new Promise((resolve, reject) => {
			const child = pty.spawn(command, args, {
				name: "xterm-color",
				cols: 80,
				rows: 24,
				cwd: process.cwd(),
				env: process.env,
				useConpty: true
			});
			let settled = false;
			let stdout = "";
			const cleanup = () => {
				clearTimeout(timeoutId);
				abortCleanup?.();
			};
			const timeoutMs = opts.timeoutMs ?? defaultTimeoutMs;
			const timeoutId = setTimeout(() => {
				try {
					child.kill();
				} catch {}
				if (settled) return;
				settled = true;
				cleanup();
				reject(new Error(t("error.commandTimeout", {
					command,
					args: args.join(" "),
					timeout: timeoutMs
				})));
			}, timeoutMs);
			const abortHandler = () => {
				try {
					child.kill();
				} catch {}
				if (settled) return;
				settled = true;
				cleanup();
				reject(new DOMException("Aborted", "AbortError"));
			};
			const abortCleanup = opts.signal ? (() => {
				opts.signal?.addEventListener("abort", abortHandler, { once: true });
				return () => opts.signal?.removeEventListener("abort", abortHandler);
			})() : void 0;
			child.onData((data) => {
				stdout += data;
			});
			child.onExit((event) => {
				if (settled) return;
				settled = true;
				cleanup();
				resolve({
					code: event.exitCode,
					signal: null,
					stdout,
					stderr: ""
				});
			});
		});
	};
	const runWslInDistro = (args, distro, opts) => runWsl(wslArgs(args, distro), opts);
	const runWslSh = (script, distro, opts) => runWslInDistro([
		"sh",
		"-lc",
		script
	], distro, opts);
	const requireSuccess = (result, fallback) => {
		if (result.code === 0) return;
		throw new Error(summarize(result.stderr || result.stdout) || fallback);
	};
	return {
		runWslSh,
		async probeRuntime(opts) {
			const version = await runWsl(["--version"], opts).catch((error) => ({
				code: 1,
				signal: null,
				stdout: "",
				stderr: error instanceof Error ? error.message : String(error)
			}));
			if (version.code !== 0) return {
				available: false,
				version: null,
				error: summarize(version.stderr || version.stdout) || t("error.unavailable")
			};
			return {
				available: true,
				version: firstLine(version.stdout),
				error: null
			};
		},
		async listInstalled(opts) {
			const result = await runWsl(["--list", "--verbose"], opts);
			if (result.code !== 0) throw new Error(summarize(result.stderr || result.stdout) || t("error.listInstalled"));
			return parseInstalledDistros(result.stdout);
		},
		async listOnline(opts) {
			const result = await runWsl(["--list", "--online"], opts);
			if (result.code !== 0) throw new Error(summarize(result.stderr || result.stdout) || t("error.listOnline"));
			return parseOnlineDistros(result.stdout);
		},
		async installRuntimeElevated(opts) {
			const script = [
				"$ErrorActionPreference = 'Stop'",
				"$process = Start-Process -FilePath 'wsl.exe' -Verb RunAs -ArgumentList @('--install','--no-distribution') -Wait -PassThru",
				"if ($null -ne $process.ExitCode) { exit $process.ExitCode }"
			].join("; ");
			const result = await runPowerShell(script, withTimeout(opts, DEFAULT_WSL_INSTALL_TIMEOUT_MS));
			requireSuccess(result, t("error.installWsl"));
		},
		async installDistro(distro, opts) {
			const result = await runInteractiveCommand(system32("wsl.exe"), [
				"--install",
				"-d",
				distro,
				"--web-download",
				"--no-launch"
			], withTimeout(opts, DEFAULT_WSL_INSTALL_TIMEOUT_MS), DEFAULT_WSL_INSTALL_TIMEOUT_MS);
			requireSuccess(result, t("error.installDistro", { distro }));
		},
		async installCli(distro, cli, opts) {
			const result = await runInteractiveCommand(system32("wsl.exe"), wslArgs([
				"bash",
				"-lc",
				wslCliInstallCommand(cli)
			], distro), withTimeout(opts, DEFAULT_WSL_INSTALL_TIMEOUT_MS), DEFAULT_WSL_INSTALL_TIMEOUT_MS);
			requireSuccess(result, t("error.installOpencode"));
		},
		async probeDistro(name, opts) {
			const executable = await runWslInDistro(["/bin/true"], name, opts).catch((error) => ({
				code: 1,
				signal: null,
				stdout: "",
				stderr: error instanceof Error ? error.message : String(error)
			}));
			if (executable.code !== 0) return {
				name,
				canExecute: false,
				hasBash: false,
				hasCurl: false,
				error: summarize(executable.stderr || executable.stdout) || t("error.executeDistro")
			};
			const [bash, curl] = await Promise.all([runWslSh("command -v bash >/dev/null && printf yes || printf no", name, opts), runWslSh("command -v curl >/dev/null && printf yes || printf no", name, opts)]);
			return {
				name,
				canExecute: true,
				hasBash: bash.code === 0 && summarize(bash.stdout) === "yes",
				hasCurl: curl.code === 0 && summarize(curl.stdout) === "yes",
				error: null
			};
		},
		async resolveCli(distro, opts) {
			return firstLine((await runWslSh(discoverScript(), distro, opts)).stdout);
		},
		async readCliVersion(command, distro, opts) {
			return parseVersion((await runWslSh(versionScript(shellEscape(command)), distro, opts)).stdout);
		}
	};
}
function createOutputDecoder() {
	let decoder;
	return {
		decode(chunk) {
			decoder ??= new TextDecoder(detectOutputEncoding(chunk));
			return decoder.decode(chunk, { stream: true });
		},
		flush() {
			return decoder?.decode() ?? "";
		}
	};
}
function detectOutputEncoding(chunk) {
	if (chunk[0] === 255 && chunk[1] === 254) return "utf-16le";
	const pairs = Math.floor(chunk.length / 2);
	if (pairs < 2) return "utf-8";
	const oddZeroes = Array.from({ length: pairs }).filter((_, index) => chunk[index * 2 + 1] === 0).length;
	const evenZeroes = Array.from({ length: pairs }).filter((_, index) => chunk[index * 2] === 0).length;
	return oddZeroes >= Math.ceil(pairs / 3) && evenZeroes * 2 <= oddZeroes ? "utf-16le" : "utf-8";
}
function parseInstalledDistros(output) {
	return output.split(/\r?\n/g).flatMap((line) => {
		if (!line.trim()) return [];
		const match = line.match(/^\s*(\*)?\s*(.*?)\s{2,}\S+\s+(\d+)\s*$/);
		if (!match) return [];
		const [, marker, name, version] = match;
		if (!name || /^name$/i.test(name)) return [];
		return [{
			name: name.trim(),
			version: Number.isNaN(Number.parseInt(version, 10)) ? null : Number.parseInt(version, 10),
			isDefault: marker === "*"
		}];
	});
}
function parseOnlineDistros(output) {
	return output.split(/\r?\n/g).flatMap((line) => {
		const trimmed = line.trim();
		if (!trimmed) return [];
		const match = trimmed.match(/^([A-Za-z0-9._-]+)\s{2,}(.+)$/);
		if (!match) return [];
		const [, name, label] = match;
		if (/^name$/i.test(name)) return [];
		return [{
			name,
			label: label.trim()
		}];
	});
}
function firstLine(value) {
	return value.split(/\r?\n/g).map((line) => line.trim()).find(Boolean) ?? null;
}
function system32(command) {
	const root = process.env.SystemRoot ?? process.env.windir;
	if (!root) return command;
	const resolved = join(root, "System32", command);
	return existsSync(resolved) ? resolved : command;
}
function withTimeout(opts, timeoutMs) {
	return {
		...opts,
		timeoutMs: opts?.timeoutMs ?? timeoutMs
	};
}
//#endregion
//#region ../gui-plugins/src/wsl/machine.ts
function stoppedServer() {
	return { kind: "stopped" };
}
function idleDistro() {
	return {
		status: "idle",
		server: stoppedServer()
	};
}
function createWslMachineState(configured) {
	return {
		status: "open",
		runtime: null,
		installed: [],
		online: [],
		distroProbes: {},
		opencodeChecks: {},
		pendingRestart: false,
		configured,
		host: { status: "idle" },
		distros: {}
	};
}
function transitionWslMachine(state, event) {
	if (state.status === "closed") return closed(state, event);
	if (event.type === "close") return close(state);
	if (event.type === "host") return hostRequested(state, event);
	if (event.type === "runtime.probed") return hostSettled(state, event.attempt, {
		runtime: event.runtime,
		pendingRestart: state.pendingRestart && !event.runtime.available
	});
	if (event.type === "runtime.installed") return hostSettled(state, event.attempt, {
		runtime: event.runtime,
		pendingRestart: !event.runtime.available
	});
	if (event.type === "distros.listed") return hostSettled(state, event.attempt, {
		installed: event.installed,
		online: event.online
	});
	if (event.type === "host.failed") return hostFailed(state, event.attempt, event.message);
	if (event.type === "probe") return probe(state, event.distro, event.attempt);
	if (event.type === "distro.probed") return distroProbed(state, event);
	if (event.type === "cli.inspected") return cliInspected(state, event);
	if (event.type === "install-distro") return installDistro(state, event.distro, event.attempt);
	if (event.type === "distro.installed") return distroInstalled(state, event);
	if (event.type === "update") return update(state, event.distro, event.attempt);
	if (event.type === "cli.installed") return cliInstalled(state, event);
	if (event.type === "job.failed") return jobFailed(state, event);
	if (event.type === "add") return add(state, event.config, event.attempt);
	if (event.type === "start") return start(state, event.id, event.attempt);
	if (event.type === "remove") return remove(state, event.id, event.attempt);
	if (event.type === "server.stopped") return serverStopped(state, event.distro, event.attempt);
	if (event.type === "server.spawned") return serverSpawned(state, event);
	if (event.type === "server.failed") return serverFailed(state, event);
	if (event.type === "server.exited") return serverExited(state, event);
	return cliChecked(state, event.distro, event.check);
}
/** What windows see: the machine's data, each configured server's runtime, and the jobs running now. */
function toServersState(state) {
	const open = state.status === "open" ? state : void 0;
	return {
		runtime: state.runtime,
		installed: state.installed,
		online: state.online,
		distroProbes: state.distroProbes,
		opencodeChecks: state.opencodeChecks,
		pendingRestart: state.pendingRestart,
		servers: state.configured.map((config) => ({
			config,
			runtime: open ? serverRuntime(distroOf(open, config.distro)) : stoppedServer()
		})),
		hostJob: open?.host.status ?? "idle",
		distroJobs: Object.fromEntries(Object.entries(open?.distros ?? {}).flatMap(([distro, job]) => job.status === "idle" ? [] : [[distro, job.status]]))
	};
}
function closed(state, event) {
	if (event.type === "host" || event.type === "probe" || event.type === "install-distro" || event.type === "update" || event.type === "add" || event.type === "start" || event.type === "remove") return next(state, [reject(event.attempt, { kind: "unavailable" })]);
	return next(state);
}
function close(state) {
	const attempts = [...state.host.status === "busy" ? [state.host.attempt] : [], ...Object.values(state.distros).flatMap((job) => job.status === "idle" ? [] : [job.attempt])];
	return next({
		status: "closed",
		runtime: state.runtime,
		installed: state.installed,
		online: state.online,
		distroProbes: state.distroProbes,
		opencodeChecks: state.opencodeChecks,
		pendingRestart: state.pendingRestart,
		configured: state.configured
	}, attempts.map((attempt) => reject(attempt, { kind: "unavailable" })));
}
function hostRequested(state, event) {
	if (state.host.status === "busy") return next(state, [resolve(event.attempt)]);
	return next({
		...state,
		host: {
			status: "busy",
			attempt: event.attempt
		}
	}, [{
		type: "host",
		attempt: event.attempt,
		job: event.job
	}]);
}
function hostSettled(state, attempt, data) {
	if (state.host.status !== "busy" || state.host.attempt !== attempt) return next(state);
	return next({
		...state,
		...data,
		host: { status: "idle" }
	}, [resolve(attempt)]);
}
function hostFailed(state, attempt, message) {
	if (state.host.status !== "busy" || state.host.attempt !== attempt) return next(state);
	return next({
		...state,
		host: { status: "idle" }
	}, [reject(attempt, {
		kind: "error",
		message
	})]);
}
function probe(state, distro, attempt) {
	const current = distroOf(state, distro);
	if (current.status !== "idle") return next(state, [resolve(attempt)]);
	const probing = {
		status: "probing",
		attempt,
		server: current.server
	};
	if (!state.distroProbes[distro]) return next(put(state, distro, probing), [{
		type: "probe-distro",
		distro,
		attempt
	}]);
	if (needsCliCheck(state, distro)) return next(put(state, distro, probing), [{
		type: "inspect-cli",
		distro,
		attempt
	}]);
	return next(state, [resolve(attempt)]);
}
function distroProbed(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "probing" || current.attempt !== event.attempt) return next(state);
	const probed = {
		...state,
		distroProbes: {
			...state.distroProbes,
			[event.distro]: event.probe
		}
	};
	if (needsCliCheck(probed, event.distro)) return next(probed, [{
		type: "inspect-cli",
		distro: event.distro,
		attempt: event.attempt
	}]);
	return next(put(probed, event.distro, {
		status: "idle",
		server: current.server
	}), [resolve(event.attempt)]);
}
function cliInspected(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "probing" || current.attempt !== event.attempt) return next(state);
	return next(put(withCheck(state, event.distro, event.check), event.distro, {
		status: "idle",
		server: current.server
	}), [resolve(event.attempt)]);
}
function installDistro(state, distro, attempt) {
	const current = distroOf(state, distro);
	if (current.status === "installing") return next(state, [resolve(attempt)]);
	if (configuredDistro(state, distro)) return next(state, [reject(attempt, {
		kind: "already-added",
		distro
	})]);
	if (current.status !== "idle") return next(state, [reject(attempt, {
		kind: "busy",
		distro
	})]);
	return next(put(state, distro, {
		status: "installing",
		attempt
	}), [{
		type: "install-distro",
		distro,
		attempt
	}]);
}
function distroInstalled(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "installing" || current.attempt !== event.attempt) return next(state);
	return next(put({
		...state,
		installed: event.installed,
		online: event.online,
		distroProbes: {
			...state.distroProbes,
			[event.distro]: event.probe
		}
	}, event.distro, idleDistro()), [resolve(event.attempt)]);
}
function update(state, distro, attempt) {
	const current = distroOf(state, distro);
	if (current.status === "updating") return next(state, [resolve(attempt)]);
	const updating = {
		status: "updating",
		attempt
	};
	if (current.status === "starting") return next(put(state, distro, updating), [resolve(current.attempt), {
		type: "stop",
		distro,
		attempt,
		server: current.attempt
	}]);
	if (current.status !== "idle") return next(state, [reject(attempt, {
		kind: "busy",
		distro
	})]);
	if (current.server.kind === "ready") return next(put(state, distro, updating), [{
		type: "stop",
		distro,
		attempt,
		server: current.server.attempt
	}]);
	return next(put(state, distro, updating), [{
		type: "install-cli",
		distro,
		attempt
	}]);
}
function cliInstalled(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "updating" || current.attempt !== event.attempt) return next(state);
	const checked = withCheck(state, event.distro, event.check);
	if (!configuredDistro(state, event.distro)) return next(put(checked, event.distro, idleDistro()), [resolve(event.attempt)]);
	return next(put(checked, event.distro, {
		status: "starting",
		attempt: event.attempt
	}), [{
		type: "spawn",
		distro: event.distro,
		attempt: event.attempt
	}]);
}
function jobFailed(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "probing" && current.status !== "installing" && current.status !== "updating" || current.attempt !== event.attempt) return next(state);
	const checked = event.check ? withCheck(state, event.distro, event.check) : state;
	const idle = current.status === "probing" ? {
		status: "idle",
		server: current.server
	} : idleDistro();
	return next(put(checked, event.distro, idle), [reject(event.attempt, {
		kind: "error",
		message: event.message
	})]);
}
function add(state, config, attempt) {
	const distro = config.distro;
	if (state.configured.some((item) => item.id === config.id || item.distro === distro)) return next(state, [reject(attempt, {
		kind: "already-added",
		distro
	})]);
	if (distroOf(state, distro).status !== "idle") return next(state, [reject(attempt, {
		kind: "busy",
		distro
	})]);
	const configured = [...state.configured, config];
	return next(put({
		...state,
		configured
	}, distro, {
		status: "starting",
		attempt
	}), [
		{
			type: "persist",
			servers: configured
		},
		{
			type: "spawn",
			distro,
			attempt
		},
		{
			type: "check-cli",
			distro
		},
		resolve(attempt)
	]);
}
function start(state, id, attempt) {
	const distro = state.configured.find((item) => item.id === id)?.distro;
	if (!distro) return next(state, [resolve(attempt)]);
	const current = distroOf(state, distro);
	if (current.status === "starting" || current.status === "updating") return next(state, [resolve(attempt)]);
	if (current.status !== "idle") return next(state, [reject(attempt, {
		kind: "busy",
		distro
	})]);
	const starting = put(state, distro, {
		status: "starting",
		attempt
	});
	if (current.server.kind === "ready") return next(starting, [{
		type: "stop",
		distro,
		attempt,
		server: current.server.attempt
	}, {
		type: "check-cli",
		distro
	}]);
	return next(starting, [{
		type: "spawn",
		distro,
		attempt
	}, {
		type: "check-cli",
		distro
	}]);
}
function remove(state, id, attempt) {
	const distro = state.configured.find((item) => item.id === id)?.distro;
	if (!distro) return next(state, [resolve(attempt)]);
	const current = distroOf(state, distro);
	if (current.status === "removing") return next(state, [resolve(attempt)]);
	const removing = put(state, distro, {
		status: "removing",
		attempt
	});
	if (current.status === "starting") return next(removing, [resolve(current.attempt), {
		type: "stop",
		distro,
		attempt,
		server: current.attempt
	}]);
	if (current.status !== "idle") return next(state, [reject(attempt, {
		kind: "busy",
		distro
	})]);
	if (current.server.kind === "ready") return next(removing, [{
		type: "stop",
		distro,
		attempt,
		server: current.server.attempt
	}]);
	const removed = withoutDistro(state, distro);
	return next(removed, [{
		type: "persist",
		servers: removed.configured
	}, resolve(attempt)]);
}
function serverStopped(state, distro, attempt) {
	const current = distroOf(state, distro);
	if (current.status === "idle" || current.status === "probing" || current.attempt !== attempt) return next(state);
	if (current.status === "starting") return next(state, [{
		type: "spawn",
		distro,
		attempt
	}]);
	if (current.status === "updating") return next(state, [{
		type: "install-cli",
		distro,
		attempt
	}]);
	if (current.status !== "removing") return next(state);
	const removed = withoutDistro(state, distro);
	return next(removed, [{
		type: "persist",
		servers: removed.configured
	}, resolve(attempt)]);
}
function serverSpawned(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "starting" || current.attempt !== event.attempt) return next(state);
	const server = {
		kind: "ready",
		attempt: event.attempt,
		url: event.url,
		password: event.password
	};
	return next(put(state, event.distro, {
		status: "idle",
		server
	}), [
		resolve(event.attempt),
		{
			type: "check-cli",
			distro: event.distro
		},
		{
			type: "log",
			level: "info",
			message: "wsl sidecar ready",
			data: {
				distro: event.distro,
				url: event.url
			}
		}
	]);
}
function serverFailed(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "starting" || current.attempt !== event.attempt) return next(state);
	return next(put(state, event.distro, {
		status: "idle",
		server: {
			kind: "failed",
			message: event.message
		}
	}), [resolve(event.attempt), {
		type: "log",
		level: "error",
		message: "wsl sidecar failed to start",
		data: {
			distro: event.distro,
			message: event.message
		}
	}]);
}
function serverExited(state, event) {
	const current = distroOf(state, event.distro);
	if (current.status !== "idle" && current.status !== "probing") return next(state);
	if (current.server.kind !== "ready" || current.server.attempt !== event.attempt) return next(state);
	return next(put(state, event.distro, {
		...current,
		server: {
			kind: "failed",
			message: event.message
		}
	}), [{
		type: "log",
		level: "error",
		message: "wsl sidecar exited",
		data: {
			distro: event.distro,
			code: event.code,
			signal: event.signal
		}
	}]);
}
function cliChecked(state, distro, check) {
	const status = distroOf(state, distro).status;
	if (!configuredDistro(state, distro) || status === "updating" || status === "removing") return next(state);
	return next(withCheck(state, distro, check));
}
function serverRuntime(job) {
	if (job.status === "starting") return { kind: "starting" };
	if (job.status !== "idle" && job.status !== "probing") return stoppedServer();
	if (job.server.kind === "ready") return {
		kind: "ready",
		url: job.server.url,
		password: job.server.password
	};
	if (job.server.kind === "failed") return {
		kind: "failed",
		message: job.server.message
	};
	return stoppedServer();
}
function distroOf(state, distro) {
	return state.distros[distro] ?? idleDistro();
}
function needsCliCheck(state, distro) {
	const probe = state.distroProbes[distro];
	return !!probe && probe.canExecute && probe.hasBash && probe.hasCurl && !state.opencodeChecks[distro];
}
function configuredDistro(state, distro) {
	return state.configured.some((item) => item.distro === distro);
}
function put(state, distro, job) {
	return {
		...state,
		distros: {
			...state.distros,
			[distro]: job
		}
	};
}
function withCheck(state, distro, check) {
	return {
		...state,
		opencodeChecks: {
			...state.opencodeChecks,
			[distro]: check
		}
	};
}
function withoutDistro(state, distro) {
	return {
		...state,
		configured: state.configured.filter((item) => item.distro !== distro),
		distros: Object.fromEntries(Object.entries(state.distros).filter(([name]) => name !== distro)),
		distroProbes: Object.fromEntries(Object.entries(state.distroProbes).filter(([name]) => name !== distro)),
		opencodeChecks: Object.fromEntries(Object.entries(state.opencodeChecks).filter(([name]) => name !== distro))
	};
}
function resolve(attempt) {
	return {
		type: "resolve",
		attempt
	};
}
function reject(attempt, failure) {
	return {
		type: "reject",
		attempt,
		failure
	};
}
function next(state, effects = []) {
	return {
		state,
		effects
	};
}
//#endregion
//#region ../gui-plugins/src/wsl/servers.ts
function wslServerIdForDistro(distro) {
	return `wsl:${distro}`;
}
/** Runs the WSL machine's effects and reports their outcomes back to it; the machine alone decides what is current. */
function createWslServersController(options) {
	const t = options.t;
	const runtime = options.runtime;
	const listeners = /* @__PURE__ */ new Set();
	const waiters = /* @__PURE__ */ new Map();
	const starts = /* @__PURE__ */ new Map();
	const running = /* @__PURE__ */ new Map();
	const halts = /* @__PURE__ */ new Map();
	const current = { machine: createWslMachineState(options.readServers()) };
	const published = { state: toServersState(current.machine) };
	const dispatch = (event) => {
		const transition = transitionWslMachine(current.machine, event);
		if (transition.state !== current.machine) {
			current.machine = transition.state;
			published.state = toServersState(transition.state);
			listeners.forEach((listener) => listener());
		}
		transition.effects.forEach(run);
	};
	const request = (event) => {
		const attempt = randomUUID();
		const waiter = Promise.withResolvers();
		waiters.set(attempt, waiter);
		dispatch(event(attempt));
		return waiter.promise;
	};
	const run = (effect) => {
		if (effect.type === "resolve") return settle(effect.attempt)?.resolve();
		if (effect.type === "reject") return settle(effect.attempt)?.reject(failure(effect.failure));
		if (effect.type === "persist") return options.writeServers([...effect.servers]);
		if (effect.type === "log") return options.log(effect.level, effect.message, effect.data);
		if (effect.type === "spawn") return spawn(effect.distro, effect.attempt);
		if (effect.type === "stop") {
			halt(effect.server).then(() => dispatch({
				type: "server.stopped",
				distro: effect.distro,
				attempt: effect.attempt
			}));
			return;
		}
		if (effect.type === "check-cli") {
			inspectCli(effect.distro).then((check) => dispatch({
				type: "cli.checked",
				distro: effect.distro,
				check
			}), (error) => options.log("error", "wsl CLI check failed", {
				distro: effect.distro,
				message: message(error)
			}));
			return;
		}
		if (effect.type === "host") {
			hostJob(effect.job, effect.attempt).then(dispatch, (error) => dispatch({
				type: "host.failed",
				attempt: effect.attempt,
				message: message(error)
			}));
			return;
		}
		distroJob(effect).then(dispatch, (error) => dispatch({
			type: "job.failed",
			distro: effect.distro,
			attempt: effect.attempt,
			message: message(error)
		}));
	};
	const settle = (attempt) => {
		const waiter = waiters.get(attempt);
		waiters.delete(attempt);
		return waiter;
	};
	const failure = (reason) => {
		if (reason.kind === "busy") return new Error(t("error.busy", { distro: reason.distro }));
		if (reason.kind === "already-added") return new Error(t("error.alreadyAdded", { distro: reason.distro }));
		if (reason.kind === "unavailable") return new Error(t("error.unavailable"));
		return new Error(reason.message);
	};
	const inspectCli = async (distro) => {
		const resolved = await runtime.resolveCli(distro);
		const version = resolved ? await runtime.readCliVersion(resolved, distro) : null;
		return cliCheck(t, distro, resolved, version, options.cli.version);
	};
	const listDistros = async () => {
		const [installed, online] = await Promise.all([runtime.listInstalled(), runtime.listOnline()]);
		return {
			installed,
			online
		};
	};
	const hostJob = async (job, attempt) => {
		if (job === "probe-runtime") return {
			type: "runtime.probed",
			attempt,
			runtime: await runtime.probeRuntime()
		};
		if (job === "refresh-distros") return {
			type: "distros.listed",
			attempt,
			...await listDistros()
		};
		await runtime.installRuntimeElevated();
		return {
			type: "runtime.installed",
			attempt,
			runtime: await runtime.probeRuntime()
		};
	};
	const distroJob = async (effect) => {
		const distro = effect.distro;
		const attempt = effect.attempt;
		if (effect.type === "probe-distro") return {
			type: "distro.probed",
			distro,
			attempt,
			probe: await runtime.probeDistro(distro)
		};
		if (effect.type === "inspect-cli") return {
			type: "cli.inspected",
			distro,
			attempt,
			check: await inspectCli(distro)
		};
		if (effect.type === "install-distro") {
			await runtime.installDistro(distro);
			return {
				type: "distro.installed",
				distro,
				attempt,
				...await listDistros(),
				probe: await runtime.probeDistro(distro)
			};
		}
		await options.installCli(distro, options.cli);
		const check = await inspectCli(distro);
		if (check.version === options.cli.version) return {
			type: "cli.installed",
			distro,
			attempt,
			check
		};
		const expected = options.cli.version;
		const installed = check.version ?? t("error.noVersion");
		return {
			type: "job.failed",
			distro,
			attempt,
			check,
			message: t("error.updateVersion", {
				distro,
				installed,
				expected
			})
		};
	};
	const spawn = (distro, attempt) => {
		const abort = new AbortController();
		options.log("info", "wsl sidecar starting", { distro });
		const done = options.spawnSidecar(distro, abort.signal).then((sidecar) => {
			running.set(attempt, sidecar);
			sidecar.onExit((code, signal) => {
				running.delete(attempt);
				const text = t("error.serverExited", {
					code: code ?? "null",
					signal: signal ?? "null"
				});
				dispatch({
					type: "server.exited",
					distro,
					attempt,
					code,
					signal,
					message: text
				});
			});
			dispatch({
				type: "server.spawned",
				distro,
				attempt,
				url: sidecar.url,
				password: sidecar.password
			});
		}, (error) => dispatch({
			type: "server.failed",
			distro,
			attempt,
			message: message(error)
		})).finally(() => starts.delete(attempt));
		starts.set(attempt, {
			abort,
			done
		});
	};
	const halt = (attempt) => {
		const pending = halts.get(attempt) ?? stopSidecar(attempt).finally(() => halts.delete(attempt));
		halts.set(attempt, pending);
		return pending;
	};
	const stopSidecar = async (attempt) => {
		const start = starts.get(attempt);
		start?.abort.abort();
		await start?.done;
		const sidecar = running.get(attempt);
		running.delete(attempt);
		await sidecar?.stop();
	};
	return {
		getState() {
			return published.state;
		},
		subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		startConfiguredServers() {
			published.state.servers.forEach((item) => dispatch({
				type: "start",
				id: item.config.id,
				attempt: randomUUID()
			}));
		},
		probeRuntime() {
			return request((attempt) => ({
				type: "host",
				attempt,
				job: "probe-runtime"
			}));
		},
		refreshDistros() {
			return request((attempt) => ({
				type: "host",
				attempt,
				job: "refresh-distros"
			}));
		},
		installWsl() {
			return request((attempt) => ({
				type: "host",
				attempt,
				job: "install-wsl"
			}));
		},
		installDistro(distro) {
			return request((attempt) => ({
				type: "install-distro",
				distro,
				attempt
			}));
		},
		async probeAddable(distros) {
			await Promise.all([...new Set(distros)].map((distro) => request((attempt) => ({
				type: "probe",
				distro,
				attempt
			}))));
		},
		installOpencode(distro) {
			return request((attempt) => ({
				type: "update",
				distro,
				attempt
			}));
		},
		async addServer(distro) {
			const config = {
				id: wslServerIdForDistro(distro),
				distro
			};
			await request((attempt) => ({
				type: "add",
				config,
				attempt
			}));
			return config;
		},
		removeServer(id) {
			return request((attempt) => ({
				type: "remove",
				id,
				attempt
			}));
		},
		startServer(id) {
			return request((attempt) => ({
				type: "start",
				id,
				attempt
			}));
		},
		async stopServers() {
			dispatch({ type: "close" });
			await Promise.all([.../* @__PURE__ */ new Set([
				...starts.keys(),
				...running.keys(),
				...halts.keys()
			])].map(halt));
		}
	};
}
function cliCheck(t, distro, resolvedPath, version, expectedVersion) {
	if (!resolvedPath) return {
		distro,
		resolvedPath: null,
		version: null,
		expectedVersion,
		matchesDesktop: null,
		error: t("error.opencodeMissing")
	};
	if (!version) return {
		distro,
		resolvedPath,
		version: null,
		expectedVersion,
		matchesDesktop: null,
		error: t("error.opencodeCannotRun")
	};
	return {
		distro,
		resolvedPath,
		version,
		expectedVersion,
		matchesDesktop: version === expectedVersion,
		error: null
	};
}
function message(cause) {
	return cause instanceof Error ? cause.message : String(cause);
}
//#endregion
//#region ../gui-plugins/src/wsl/sidecar.ts
async function spawnWslSidecar(distro, opts) {
	const t = opts.t;
	const opencode = await opts.runtime.resolveCli(distro, { signal: opts.signal });
	if (!opencode) throw new Error(t("error.opencodeNotInstalled", { distro }));
	const port = await allocatePort(t);
	opts.signal.throwIfAborted();
	const password = randomUUID();
	const script = [
		"set -euo pipefail",
		"cd \"$HOME\" || cd /",
		"PATH=$(awk -v RS=: -v ORS=: '$0 !~ /^\\/mnt\\//' <<<\"$PATH\" | sed \"s/:$//\")",
		"export PATH",
		"export WSLENV=",
		"export OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER=true",
		"export OPENCODE_CLIENT=desktop",
		`export OPENCODE_SERVER_PASSWORD=${shellEscape(password)}`,
		"export XDG_STATE_HOME=\"$HOME/.local/state\"",
		`exec ${shellEscape(opencode)} --log-level ${opts.packaged ? "warn" : "info"} serve --hostname 0.0.0.0 --port ${port}`
	].join("\n");
	const child = spawn("wsl", wslArgs(["bash", "-se"], distro), {
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		],
		windowsHide: true
	});
	child.stdin.end(script);
	const recentOutput = [];
	const emit = (line) => {
		if (!line.text.trim()) return;
		recentOutput.push(`[${line.stream}] ${line.text}`);
		if (recentOutput.length > 12) recentOutput.shift();
		opts.onLine?.(line);
	};
	forwardLines(child.stdout, "stdout", emit);
	forwardLines(child.stderr, "stderr", emit);
	const exit = new Promise((_, reject) => {
		child.once("error", reject);
		child.once("exit", (code, signal) => reject(new Error(t("error.serverExitedBeforeHealthy", {
			code: code ?? "null",
			signal: signal ?? "null",
			output: recentOutput.length ? `\n${recentOutput.join("\n")}` : ""
		}))));
	});
	const aborted = Promise.withResolvers();
	const abort = () => aborted.reject(opts.signal.reason);
	opts.signal.addEventListener("abort", abort, { once: true });
	const url = `http://127.0.0.1:${port}`;
	const startup = new AbortController();
	const health = pollWslHealth(() => checkHealth(url, password), startup.signal);
	const timeoutMs = opts.healthTimeoutMs ?? 3e4;
	let timeout;
	const timedOut = new Promise((_, reject) => timeout = setTimeout(() => reject(new Error(t("error.healthTimeout", {
		distro,
		timeout: timeoutMs
	}))), timeoutMs));
	await Promise.race([
		health,
		exit,
		timedOut,
		aborted.promise
	]).catch(async (error) => {
		await stop(child);
		throw error;
	}).finally(() => {
		clearTimeout(timeout);
		startup.abort();
		opts.signal.removeEventListener("abort", abort);
	});
	return {
		stop: () => stop(child),
		onExit: (cb) => child.once("exit", cb),
		url,
		password
	};
}
function stop(child) {
	if (child.pid === void 0 || child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
	return new Promise((resolve) => {
		child.once("exit", () => resolve());
		child.kill();
	});
}
async function checkHealth(url, password) {
	const auth = Buffer.from(`opencode:${password}`).toString("base64");
	return fetch(new URL("/api/info", url), {
		method: "GET",
		headers: { authorization: `Basic ${auth}` },
		signal: AbortSignal.timeout(3e3)
	}).then((res) => res.ok, () => false);
}
async function pollWslHealth(check, signal) {
	while (!signal.aborted) {
		if (await check()) return;
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}
function allocatePort(t) {
	return new Promise((resolve, reject) => {
		const server = createServer();
		server.on("error", reject);
		server.listen(0, "127.0.0.1", () => {
			const address = server.address();
			if (!address || isString(address)) {
				server.close();
				reject(new Error(t("error.failedPort")));
				return;
			}
			server.close(() => resolve(address.port));
		});
	});
}
function forwardLines(stream, source, onLine) {
	let pending = "";
	stream.setEncoding("utf8");
	stream.on("data", (chunk) => {
		pending += chunk;
		const lines = pending.split(/\r?\n/g);
		pending = lines.pop() ?? "";
		lines.forEach((text) => onLine({
			stream: source,
			text
		}));
	});
	stream.on("end", () => {
		if (pending) onLine({
			stream: source,
			text: pending
		});
	});
}
//#endregion
//#region ../gui-plugins/src/wsl/main.ts
var Distro = Struct({ distro: NonEmptyString });
var Id = Struct({ id: NonEmptyString });
var Saved = Struct({ servers: ArraySchema(Unknown) });
var setup = (ctx) => {
	const cli = ctx.cli;
	const packaged = ctx.app.packaged;
	const desktopLog = ctx.log;
	const t = ctx.t;
	const runtime = createWslRuntime(t);
	const saved = builtinMainContext(ctx).storage.store("servers", {
		schema: Saved,
		initial: { servers: [] },
		from: { settings: "wslServers" }
	});
	const local = packaged || !process.env.OPENCODE_DESKTOP_WSL_CLI_BUILD || !process.env.OPENCODE_DESKTOP_WSL_CLI_OUTPUT ? void 0 : {
		script: process.env.OPENCODE_DESKTOP_WSL_CLI_BUILD,
		output: process.env.OPENCODE_DESKTOP_WSL_CLI_OUTPUT
	};
	const log = (level, message, data) => desktopLog.write(level, `[wsl] ${message}`, data);
	const controller = createWslServersController({
		cli: { version: cli.version },
		runtime,
		t,
		log,
		readServers: () => saved.value.servers.flatMap((value) => {
			const record = decodeUnknownOption(Distro)(value);
			if (isNone(record)) return [];
			const distro = record.value.distro;
			const id = decodeUnknownOption(Id)(value);
			return [{
				id: isSome(id) ? id.value.id : wslServerIdForDistro(distro),
				distro
			}];
		}),
		writeServers: (servers) => saved.set({ servers }),
		installCli: local ? async (distro) => {
			const { buildLocalWslCli } = await import("./local-Dkm_S8Bb.js");
			const binary = await buildLocalWslCli({
				...local,
				version: cli.version
			});
			await runtime.installCli(distro, {
				version: cli.version,
				binary
			});
		} : (distro, build) => runtime.installCli(distro, build),
		spawnSidecar: (distro, signal) => {
			log("info", "spawning wsl sidecar", { distro });
			return spawnWslSidecar(distro, {
				runtime,
				t,
				packaged,
				signal,
				onLine: (line) => log("info", "wsl sidecar", {
					distro,
					stream: line.stream,
					text: line.text
				})
			});
		}
	});
	const provider = ctx.provide(Wsl, {
		state: () => controller.getState(),
		probeRuntime: () => controller.probeRuntime(),
		refreshDistros: () => controller.refreshDistros(),
		installWsl: () => controller.installWsl(),
		installDistro: (input) => controller.installDistro(input.name),
		probeAddable: (input) => controller.probeAddable(input.distros),
		installOpencode: (input) => controller.installOpencode(input.name),
		addServer: (input) => controller.addServer(input.distro),
		removeServer: (input) => controller.removeServer(input.id),
		startServer: (input) => controller.startServer(input.id)
	});
	ctx.onCleanup(controller.subscribe(() => provider.changed()));
	ctx.onCleanup(() => controller.stopServers());
	controller.startConfiguredServers();
};
//#endregion
export { setup as default };
