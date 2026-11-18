import { l as Boolean } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import { i as builtinMainContext } from "./host-DQiQeSJn.js";
import { powerSaveBlocker } from "electron";
import { execFile } from "node:child_process";
//#region ../gui-plugins/src/pairing/contract.ts
/**
* Turns on remote access and keeps this machine's display awake while another device uses it. The window asks the
* local server for its remote address and pairing codes through its own `ServerRef`; remote access, which changes
* the background service's settings through the CLI, and the display sleep blocker need the main process.
*/
var Pairing = Ipc.define({
	id: "pairing",
	methods: {
		/** Whether remote access is on: the background service serves an OpenTunnel address. */
		remote: { output: Boolean },
		/**
		* Turns remote access on or off, then starts the background service again. Turning it on the first time creates
		* the tunnel, which can take a minute.
		*/
		setRemote: { input: Boolean },
		/** Whether main holds the display sleep blocker. */
		screenActive: { output: Boolean },
		/** Holds or releases the display sleep blocker, and remembers the choice. */
		setScreenActive: { input: Boolean }
	}
});
//#endregion
//#region ../gui-plugins/src/pairing/dispatch.ts
/**
* The driver loop of a machine: applies one event at a time and runs its effects. An effect may dispatch
* synchronously; its event waits until the current one has applied. A transition or effect that throws never stalls
* the queue: a throwing effect reports `failed(effect)` back to the machine, and an error without such an event, or
* from the transition, surfaces as an unhandled rejection while later events keep applying.
*/
function createDispatch(machine) {
	const queue = [];
	const apply = (event) => {
		const next = machine.transition(machine.read(), event);
		machine.write(next.state);
		next.effects.forEach((effect) => {
			Promise.try(() => machine.run(effect)).catch((cause) => {
				const failure = machine.failed(effect);
				if (!failure) throw cause;
				dispatch(failure);
			});
		});
	};
	const dispatch = (event) => {
		queue.push(event);
		if (queue.length > 1) return;
		while (queue.length > 0) {
			Promise.try(apply, queue[0]);
			queue.shift();
		}
	};
	return dispatch;
}
//#endregion
//#region ../gui-plugins/src/pairing/main-machine.ts
/** Ceiling for `opencode service get remote`. Every command has one, so a hung command never holds the queue. */
var SERVICE_READ_TIMEOUT_MS = 2e4;
/** `opencode service set remote`, which creates the tunnel the first time it turns on. */
var SERVICE_SET_TIMEOUT_MS = 18e4;
/** `opencode service start`, after a change. */
var SERVICE_START_TIMEOUT_MS = 6e4;
var stopped = "Pairing stopped";
function createPairingMainState() {
	return {
		status: "open",
		issued: 0,
		blocker: { status: "released" },
		pending: []
	};
}
function transitionPairingMain(state, event) {
	if (state.status === "disposed") {
		if (event.type === "service.requested") return {
			state,
			effects: [{
				type: "waiter.reject",
				waiter: event.waiter,
				message: stopped
			}]
		};
		if (event.type === "blocker.started") return {
			state,
			effects: [{
				type: "blocker.stop",
				id: event.id
			}]
		};
		return unchanged(state);
	}
	if (event.type === "disposed") return {
		state: { status: "disposed" },
		effects: [
			...state.blocker.status === "held" ? [{
				type: "blocker.stop",
				id: state.blocker.id
			}] : [],
			...state.active ? [{
				type: "service.abort",
				attempt: state.active.attempt
			}, {
				type: "waiter.reject",
				waiter: state.active.waiter,
				message: stopped
			}] : [],
			...state.pending.map((item) => ({
				type: "waiter.reject",
				waiter: item.waiter,
				message: stopped
			}))
		]
	};
	if (event.type === "screen.set") {
		const held = state.blocker.status === "held" && event.started;
		if (event.enabled && held) return {
			state,
			effects: [{
				type: "persist.screen",
				enabled: true
			}]
		};
		return {
			state: state.blocker.status === "released" ? state : {
				...state,
				blocker: { status: "released" }
			},
			effects: [
				...event.enabled ? [{ type: "blocker.start" }] : [],
				...!event.enabled && state.blocker.status === "held" ? [{
					type: "blocker.stop",
					id: state.blocker.id
				}] : [],
				{
					type: "persist.screen",
					enabled: event.enabled
				}
			]
		};
	}
	if (event.type === "blocker.started") return {
		state: {
			...state,
			blocker: {
				status: "held",
				id: event.id
			}
		},
		effects: []
	};
	if (event.type === "service.requested") return advance({
		...state,
		pending: [...state.pending, {
			waiter: event.waiter,
			request: event.request
		}]
	}, []);
	if (event.type === "waiter.cancelled") {
		if (state.pending.some((item) => item.waiter === event.waiter)) return {
			state: {
				...state,
				pending: state.pending.filter((item) => item.waiter !== event.waiter)
			},
			effects: [{
				type: "waiter.reject",
				waiter: event.waiter,
				message: "Aborted"
			}]
		};
		if (state.active?.waiter !== event.waiter || state.active.job.kind !== "get-remote") return unchanged(state);
		return advance({
			...state,
			active: void 0
		}, [{
			type: "service.abort",
			attempt: state.active.attempt
		}, {
			type: "waiter.reject",
			waiter: event.waiter,
			message: "Aborted"
		}]);
	}
	const active = state.active;
	if (active?.attempt !== event.attempt) return unchanged(state);
	if (event.type === "service.failed") return advance({
		...state,
		active: void 0
	}, [{
		type: "waiter.reject",
		waiter: active.waiter,
		message: event.message
	}]);
	if (active.job.kind === "get-remote") return advance({
		...state,
		active: void 0
	}, [{
		type: "waiter.resolve",
		waiter: active.waiter,
		value: event.stdout === "true"
	}]);
	if (active.job.step === "starting") return advance({
		...state,
		active: void 0
	}, [{
		type: "waiter.resolve",
		waiter: active.waiter,
		value: void 0
	}]);
	const attempt = state.issued + 1;
	return {
		state: {
			...state,
			issued: attempt,
			active: {
				attempt,
				waiter: active.waiter,
				job: {
					...active.job,
					step: "starting"
				}
			}
		},
		effects: [{
			type: "service.exec",
			attempt,
			args: ["start"],
			timeoutMs: SERVICE_START_TIMEOUT_MS
		}]
	};
}
/** The display sleep blocker the state holds, which the OS may have dropped since. */
function selectBlocker(state) {
	return state.status === "open" && state.blocker.status === "held" ? state.blocker.id : void 0;
}
/** A command that throws before it runs fails its job, so the queue goes on. */
function pairingMainEffectFailed(effect) {
	if (effect.type === "service.exec") return {
		type: "service.failed",
		attempt: effect.attempt,
		message: "Pairing service command failed"
	};
}
/** Starts the next pending job once none runs. */
function advance(state, effects) {
	const head = state.pending[0];
	if (state.active || !head) return {
		state,
		effects
	};
	const attempt = state.issued + 1;
	const pending = state.pending.slice(1);
	if (head.request.kind === "get-remote") return {
		state: {
			...state,
			issued: attempt,
			pending,
			active: {
				attempt,
				waiter: head.waiter,
				job: { kind: "get-remote" }
			}
		},
		effects: [...effects, {
			type: "service.exec",
			attempt,
			args: ["get", "remote"],
			timeoutMs: SERVICE_READ_TIMEOUT_MS
		}]
	};
	return {
		state: {
			...state,
			issued: attempt,
			pending,
			active: {
				attempt,
				waiter: head.waiter,
				job: {
					kind: "set-remote",
					enabled: head.request.enabled,
					step: "setting"
				}
			}
		},
		effects: [...effects, {
			type: "service.exec",
			attempt,
			args: [
				"set",
				"remote",
				String(head.request.enabled)
			],
			timeoutMs: SERVICE_SET_TIMEOUT_MS
		}]
	};
}
function unchanged(state) {
	return {
		state,
		effects: []
	};
}
//#endregion
//#region ../gui-plugins/src/pairing/main.ts
var setup = (ctx) => {
	const stored = builtinMainContext(ctx).storage.store("keepScreenActive", {
		schema: Boolean,
		initial: false,
		from: { state: ["opencode.settings", "keepScreenActive"] }
	});
	const cli = ctx.cli;
	const log = ctx.log;
	const current = {
		state: createPairingMainState(),
		waiter: 0
	};
	const commands = /* @__PURE__ */ new Map();
	const waiters = /* @__PURE__ */ new Map();
	const dispatch = createDispatch({
		read: () => current.state,
		write: (state) => {
			current.state = state;
		},
		transition: transitionPairingMain,
		run: (effect) => run(effect),
		failed: pairingMainEffectFailed
	});
	const screenActive = () => {
		const id = selectBlocker(current.state);
		return id !== void 0 && powerSaveBlocker.isStarted(id);
	};
	const run = (effect) => {
		if (effect.type === "blocker.start") return dispatch({
			type: "blocker.started",
			id: powerSaveBlocker.start("prevent-display-sleep")
		});
		if (effect.type === "blocker.stop") {
			if (powerSaveBlocker.isStarted(effect.id)) powerSaveBlocker.stop(effect.id);
			return;
		}
		if (effect.type === "persist.screen") return stored.set(effect.enabled);
		if (effect.type === "service.abort") {
			commands.get(effect.attempt)?.abort();
			commands.delete(effect.attempt);
			return;
		}
		if (effect.type === "waiter.resolve" || effect.type === "waiter.reject") {
			const waiter = waiters.get(effect.waiter);
			waiters.delete(effect.waiter);
			if (effect.type === "waiter.resolve") return waiter?.resolve(effect.value);
			return waiter?.reject(new Error(effect.message));
		}
		const attempt = effect.attempt;
		const controller = new AbortController();
		commands.set(attempt, controller);
		execFile(cli.command[0] ?? "opencode", [
			...cli.command.slice(1),
			"service",
			...effect.args
		], {
			signal: AbortSignal.any([ctx.signal, controller.signal]),
			timeout: effect.timeoutMs,
			windowsHide: true
		}, (error, stdout, stderr) => {
			commands.delete(attempt);
			if (!error) return dispatch({
				type: "service.succeeded",
				attempt,
				stdout: stdout.trim()
			});
			log.write("error", "pairing service command failed", {
				args: effect.args,
				error: error.message,
				stderr
			});
			dispatch({
				type: "service.failed",
				attempt,
				message: error.message
			});
		});
	};
	const service = (request, signal) => {
		current.waiter += 1;
		const waiter = current.waiter;
		const cancel = () => dispatch({
			type: "waiter.cancelled",
			waiter
		});
		return new Promise((resolve, reject) => {
			waiters.set(waiter, {
				resolve,
				reject
			});
			signal?.addEventListener("abort", cancel, { once: true });
			dispatch({
				type: "service.requested",
				waiter,
				request
			});
			if (signal?.aborted) cancel();
		}).finally(() => signal?.removeEventListener("abort", cancel));
	};
	if (stored.value) dispatch({
		type: "screen.set",
		enabled: true,
		started: false
	});
	ctx.onCleanup(() => dispatch({ type: "disposed" }));
	ctx.provide(Pairing, {
		remote: async (_, caller) => await service({ kind: "get-remote" }, caller.signal) === true,
		setRemote: async (enabled) => {
			await service({
				kind: "set-remote",
				enabled
			});
		},
		screenActive,
		setScreenActive: (enabled) => dispatch({
			type: "screen.set",
			enabled,
			started: screenActive()
		})
	});
};
//#endregion
export { setup as default };
