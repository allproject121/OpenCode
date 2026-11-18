import { homedir } from "node:os";
import { join } from "node:path";
import { readFile, rename, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
//#region ../client/src/service-contender.ts
var stderrLimit = 8192;
function spawnServiceContender(command, args, env) {
	const child = spawn(command, args, {
		detached: true,
		windowsHide: true,
		stdio: [
			"ignore",
			"ignore",
			"pipe"
		],
		env: {
			...process.env,
			...env
		}
	});
	let error;
	let closed = false;
	let stderr = Buffer.alloc(0);
	const onStderr = (chunk) => {
		const tail = chunk.subarray(-8192);
		stderr = tail.length === stderrLimit ? Buffer.from(tail) : Buffer.concat([stderr.subarray(-(stderrLimit - tail.length)), tail]);
	};
	child.stderr?.on("data", onStderr);
	if (child.stderr !== null && "unref" in child.stderr && typeof child.stderr.unref === "function") child.stderr.unref();
	child.once("error", (cause) => {
		error = new Error("Failed to start server", { cause });
	});
	child.once("close", () => {
		closed = true;
	});
	child.unref();
	return {
		child,
		error: () => error,
		closed: () => closed,
		stderr: () => stderr.toString("utf8").trim(),
		release: () => {
			child.stderr?.off("data", onStderr);
			child.stderr?.resume();
			stderr = Buffer.alloc(0);
		}
	};
}
/**
* The startup attempts of one `ensure()` call. It keeps at most two attempts alive, remembers
* the first startup failure, and backs off when attempts exit cleanly because another one won.
*/
function contenderPool(timing) {
	const contenders = /* @__PURE__ */ new Set();
	let failure;
	let spawnDelay = timing.spawnDelay;
	let lastSpawn = 0;
	return {
		/** The first startup failure seen since the last eviction. */
		failure: () => failure,
		/** A registered service answered, so the next attempt waits the base delay again. */
		serviceAnswered() {
			spawnDelay = timing.spawnDelay;
		},
		/**
		* The owner `pid` was replaced. Drop its attempt and any finished ones, forget their
		* failure, and restart the spawn clock.
		*/
		evict(pid) {
			for (const item of contenders) if (item.child.pid === pid || contenderFinished(item)) {
				item.release();
				contenders.delete(item);
			}
			failure = void 0;
			lastSpawn = 0;
		},
		/** Let the next attempt start without waiting a spawn delay. */
		recruitNow() {
			lastSpawn = Date.now() - spawnDelay;
		},
		/** Collect finished attempts. Returns the startup failure once no attempt is left alive. */
		reap() {
			const finished = [...contenders].filter(contenderFinished);
			failure ??= finished.map(contenderFailure).find((error) => error !== void 0);
			if (finished.some((item) => item.child.exitCode === 0)) spawnDelay = Math.min(spawnDelay * 2, timing.maxSpawnDelay);
			finished.forEach((item) => contenders.delete(item));
			return contenders.size === 0 ? failure : void 0;
		},
		/**
		* Whether to start another attempt now. A registration that has not answered yet gets one
		* spawn delay before an attempt competes with it.
		*/
		shouldRecruit(registered) {
			if (lastSpawn === 0 && registered) lastSpawn = Date.now();
			return failure === void 0 && contenders.size < 2 && Date.now() - lastSpawn >= spawnDelay;
		},
		add(contender) {
			contenders.add(contender);
			lastSpawn = Date.now();
		},
		releaseAll() {
			contenders.forEach((contender) => contender.release());
		}
	};
}
function contenderFailure(contender) {
	const error = contender.error();
	if (error !== void 0) return error;
	if (contender.child.exitCode !== null && contender.child.exitCode !== 0) return startupError(`Server process exited with code ${contender.child.exitCode}`, contender.stderr());
	if (contender.child.signalCode !== null) return startupError(`Server process terminated by ${contender.child.signalCode}`, contender.stderr());
}
function contenderFinished(contender) {
	return contender.error() !== void 0 || contender.closed();
}
function startupError(message, stderr) {
	return new Error(stderr ? `${message}\n${stderr}` : message);
}
//#endregion
//#region ../client/src/service-timing.ts
var timings = /* @__PURE__ */ new WeakMap();
var defaultEnsureTiming = {
	pollInterval: 25,
	requestTimeout: 2e3,
	spawnDelay: 5e3,
	maxSpawnDelay: 3e4,
	promiseTimeout: 12e4,
	stopPollInterval: 50,
	stopPollAttempts: 100
};
function ensureTiming(options) {
	return timings.get(options) ?? defaultEnsureTiming;
}
//#endregion
//#region ../client/src/service-version.ts
function matchesVersion(version, options) {
	if (options.version === void 0) return true;
	if (version === void 0) return false;
	if (typeof options.version === "function") return options.version(version);
	return version === options.version;
}
//#endregion
//#region ../client/src/service-probe.ts
/**
* What `ensure()` does with a registered service that answered: return it, keep polling while
* it starts, replace it because its version does not meet the requirement, or fail.
*/
function decide(service, options) {
	if (!matchesVersion(service.version, options)) return {
		_tag: "replace",
		pty: service.state === "ready" ? "handoff" : "clear"
	};
	if (!service.compatible) return fail("Background service uses an incompatible health protocol. Update this client or explicitly restart the service.");
	if (service.state === "ready") return { _tag: "reuse" };
	if (service.state === "failed") return fail("Background service failed to start");
	return { _tag: "wait" };
}
function fail(message) {
	return {
		_tag: "fail",
		error: new Error(message)
	};
}
/** The default registration file. */
function fallback() {
	return join(process.env["XDG_STATE_HOME"] ?? join(homedir(), ".local", "state"), "opencode", "service.json");
}
/** Whether two registrations describe the same service instance. */
function same$1(left, right) {
	return left.id === right.id && left.version === right.version && left.url === right.url && left.pid === right.pid;
}
/** Ask a registered owner for its health and classify the answer. */
async function probeResult(info, timeout = defaultEnsureTiming.requestTimeout) {
	const endpoint = {
		url: info.url,
		auth: info.password === void 0 ? void 0 : {
			type: "basic",
			username: "opencode",
			password: info.password
		}
	};
	const signal = AbortSignal.timeout(timeout);
	const result = await fetch(new URL("/api/info", info.url), {
		headers: headers(endpoint),
		signal
	}).then(async (response) => ({
		response,
		body: response.status === 404 ? void 0 : await response.json()
	})).catch(() => void 0);
	if (result === void 0) return {
		service: void 0,
		timedOut: signal.aborted
	};
	const response = result.response;
	if (response.status === 404) return {
		service: {
			info,
			endpoint,
			version: info.version,
			state: "ready",
			compatible: false
		},
		timedOut: false
	};
	const serverInfo = decodeInfo(result.body);
	if (serverInfo === void 0) return {
		service: void 0,
		timedOut: false
	};
	if (serverInfo.pid !== info.pid) return {
		service: void 0,
		timedOut: false
	};
	if (info.version !== void 0 && serverInfo.version !== info.version) return {
		service: void 0,
		timedOut: false
	};
	return {
		service: {
			info,
			endpoint,
			version: serverInfo.version,
			state: response.ok ? "ready" : response.status === 500 ? "failed" : "waiting",
			compatible: true
		},
		timedOut: false
	};
}
/** Create HTTP authentication headers for a service endpoint. */
function headers(endpoint) {
	if (endpoint.auth === void 0) return void 0;
	return { authorization: "Basic " + Buffer.from(endpoint.auth.username + ":" + endpoint.auth.password).toString("base64") };
}
function decodeInfo(input) {
	if (typeof input !== "object" || input === null) return;
	if (!("version" in input) || typeof input.version !== "string") return;
	if (!("pid" in input) || typeof input.pid !== "number" || !Number.isInteger(input.pid) || input.pid < 0) return;
	return {
		version: input.version,
		pid: input.pid
	};
}
//#endregion
//#region ../client/src/pty-handoff.ts
/**
* Publish the ticket before stopping its owner so every replacement contender can adopt it.
* Never throws: terminals are best-effort, so any failure replaces the service without a handoff.
*/
async function prepare(file, info, timeout) {
	const existing = await read$1(file);
	if (existing !== void 0 && existing.expiresAt > Date.now() && same(existing.source, info)) return;
	const { OpenCode } = await import("./promise-DXUpiwYe.js").then((n) => n.t);
	const client = OpenCode.make({
		baseUrl: info.url,
		headers: headers({
			url: info.url,
			auth: info.password === void 0 ? void 0 : {
				type: "basic",
				username: "opencode",
				password: info.password
			}
		})
	});
	const handoff = await client.experimental.persistentPty.handoff({ signal: AbortSignal.timeout(timeout) }).then(parse).catch(async (cause) => {
		const concurrent = await read$1(file);
		if (concurrent !== void 0 && concurrent.expiresAt > Date.now() && same(concurrent.source, info)) return;
		console.warn("Background service cannot hand off persistent terminals; shutting them down before replacement", cause);
		await client.experimental.persistentPty.shutdown({ signal: AbortSignal.timeout(timeout) }).catch(() => {});
		return null;
	});
	if (handoff === void 0) return;
	await publish(file, info, handoff).catch((cause) => console.warn("Failed to publish persistent terminal handoff", cause));
}
function parse(body) {
	if (typeof body !== "object" || body === null || !("handoff" in body)) throw new Error("Invalid persistent terminal handoff response");
	if (body.handoff === null) return null;
	if (!isHandoff(body.handoff) || body.handoff.expiresAt <= Date.now()) throw new Error("Invalid or expired persistent terminal handoff");
	return body.handoff;
}
async function publish(file, info, handoff) {
	const temporary = `${file}.pty-handoff.${crypto.randomUUID()}.tmp`;
	await writeFile(temporary, JSON.stringify({
		source: {
			id: info.id,
			pid: info.pid,
			url: info.url
		},
		handoff,
		expiresAt: handoff?.expiresAt ?? Date.now() + 3e4
	}), {
		mode: 384,
		flag: "wx"
	});
	await rename(temporary, file + ".pty-handoff").finally(() => rm(temporary, { force: true }));
}
async function environment(file, env) {
	const record = await read$1(file);
	const current = await readFile(file, "utf8").then((text) => JSON.parse(text)).catch(() => void 0);
	const handoff = record !== void 0 && record.expiresAt > Date.now() && (current === void 0 || same(record.source, current)) ? record.handoff : void 0;
	return {
		...env,
		OPENCODE_PTY_HANDOFF: handoff == null ? void 0 : JSON.stringify(handoff)
	};
}
async function complete(file, info) {
	const record = await read$1(file);
	if (record !== void 0 && !same(record.source, info)) await clear(file);
}
async function clear(file) {
	await rm(file + ".pty-handoff", { force: true });
}
async function read$1(file) {
	const value = await readFile(file + ".pty-handoff", "utf8").then((text) => JSON.parse(text)).catch(() => void 0);
	if (typeof value !== "object" || value === null || !("source" in value) || !("handoff" in value)) return;
	if (typeof value.source !== "object" || value.source === null) return;
	if (!("pid" in value.source) || typeof value.source.pid !== "number") return;
	if (!("url" in value.source) || typeof value.source.url !== "string") return;
	if ("id" in value.source && typeof value.source.id !== "string") return;
	if (value.handoff !== null && !isHandoff(value.handoff)) return;
	if (!("expiresAt" in value) || typeof value.expiresAt !== "number" || !Number.isFinite(value.expiresAt)) return;
	return {
		source: {
			id: "id" in value.source && typeof value.source.id === "string" ? value.source.id : void 0,
			pid: value.source.pid,
			url: value.source.url
		},
		handoff: value.handoff,
		expiresAt: value.expiresAt
	};
}
function same(left, right) {
	return left.id === right.id && left.pid === right.pid && left.url === right.url;
}
function isHandoff(value) {
	return typeof value === "object" && value !== null && "directory" in value && typeof value.directory === "string" && "instanceID" in value && typeof value.instanceID === "string" && "ticket" in value && typeof value.ticket === "string" && "expiresAt" in value && typeof value.expiresAt === "number" && Number.isFinite(value.expiresAt);
}
//#endregion
//#region ../client/src/promise/service.ts
/** Discover a healthy, compatible local service without starting one. */
async function discover(options = {}) {
	const found = (await registered(options.file)).service;
	if (found?.state !== "ready") return void 0;
	if (!found.compatible) return void 0;
	if (!matchesVersion(found.version, options)) return void 0;
	return found.endpoint;
}
/** Ensure a healthy, compatible local service is running. */
async function ensure(options = {}) {
	const timing = ensureTiming(options);
	const deadline = Date.now() + timing.promiseTimeout;
	const pool = contenderPool(timing);
	let timeouts;
	let announced = false;
	const announce = (reason, previousVersion) => {
		if (announced) return;
		announced = true;
		options.onStart?.(reason, previousVersion);
	};
	const spawnContender = async () => {
		const [command, ...args] = options.command ?? [
			"opencode",
			"serve",
			"--service"
		];
		if (command === void 0) throw new Error("Missing service command");
		try {
			return spawnServiceContender(command, args, await environment(options.file ?? fallback(), options.env));
		} catch (cause) {
			throw new Error("Failed to start server", { cause });
		}
	};
	try {
		while (true) {
			if (Date.now() >= deadline) throw pool.failure() ?? /* @__PURE__ */ new Error("Timed out waiting for the background service to start");
			const registration = await registered(options.file, timing.requestTimeout);
			if (registration.timedOut && registration.info !== void 0) {
				timeouts = {
					info: registration.info,
					count: timeouts !== void 0 && same$1(timeouts.info, registration.info) ? timeouts.count + 1 : 1
				};
				if (timeouts.count >= 3) {
					announce("missing");
					console.warn("Background service is unresponsive; recovery cannot preserve persistent terminals");
					await clear(options.file ?? fallback());
					await terminate(registration.info, options, timing);
					pool.evict(registration.info.pid);
					pool.recruitNow();
					timeouts = void 0;
				}
			} else timeouts = void 0;
			if (registration.service !== void 0) {
				pool.serviceAnswered();
				const service = registration.service;
				const decision = decide(service, options);
				if (decision._tag === "fail") throw decision.error;
				if (decision._tag === "reuse") {
					await complete(options.file ?? fallback(), service.info);
					return service.endpoint;
				}
				if (decision._tag === "replace") {
					announce("version-mismatch", service.version);
					if (service.state !== "ready") console.warn("Background service is not ready; replacement cannot preserve persistent terminals");
					await stop({
						file: options.file,
						pty: decision.pty
					}).catch(() => void 0);
					pool.evict(service.info.pid);
				}
			} else {
				const failed = pool.reap();
				if (failed !== void 0) throw failed;
				if (pool.shouldRecruit(registration.info !== void 0)) {
					announce("missing");
					pool.add(await spawnContender());
				}
			}
			await delay(timing.pollInterval);
		}
	} finally {
		pool.releaseAll();
	}
}
/** Stop the registered local service. */
async function stop(options = {}) {
	const info = await read(options.file);
	await (options.pty === "handoff" && info !== void 0 ? prepare(options.file ?? fallback(), info, defaultEnsureTiming.requestTimeout) : clear(options.file ?? fallback())).catch((cause) => console.warn("Failed to prepare persistent terminals for replacement", cause));
	if (info !== void 0) await terminate(info, options, ensureTiming(options));
}
async function read(file) {
	const text = await readFile(file ?? fallback(), "utf8").catch(() => void 0);
	if (text === void 0) return void 0;
	try {
		return JSON.parse(text);
	} catch {
		return;
	}
}
async function registered(file, timeout) {
	const info = await read(file);
	if (info === void 0) return {
		info: void 0,
		service: void 0,
		timedOut: false
	};
	return {
		info,
		...await probeResult(info, timeout)
	};
}
function signal(pid, name) {
	try {
		process.kill(pid, name);
	} catch {}
}
function stopped(pid) {
	try {
		process.kill(pid, 0);
		return false;
	} catch {
		return true;
	}
}
async function waitUntilStopped(pid, timing) {
	for (let attempt = 0; attempt <= timing.stopPollAttempts; attempt++) {
		if (stopped(pid)) return true;
		if (attempt < timing.stopPollAttempts) await delay(timing.stopPollInterval);
	}
	return false;
}
async function terminate(info, options, timing) {
	const current = await read(options.file);
	if (current === void 0 || !same$1(current, info)) return;
	signal(info.pid, "SIGTERM");
	if (!await waitUntilStopped(info.pid, timing)) {
		signal(info.pid, "SIGKILL");
		if (!await waitUntilStopped(info.pid, timing)) throw new Error(`Server process ${info.pid} is still running`);
	}
	const latest = await read(options.file);
	if (latest === void 0 || !same$1(latest, info)) return;
	await rm(options.file ?? fallback(), { force: true });
}
function delay(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
/** Promise-based local service lifecycle operations. */
var Service = {
	discover,
	ensure,
	stop,
	headers
};
//#endregion
export { Service, discover, ensure, fallback, headers, stop };
