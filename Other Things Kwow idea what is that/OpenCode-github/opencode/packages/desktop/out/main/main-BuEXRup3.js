import { $o as addFinalizer, Ac as runForkWith, Bs as forkScoped, F as Literal, Fc as runSync, Fd as hasInterruptsOnly, Gc as sleep, Gd as squash, Gu as _await, H as Null, Hs as gen, Is as forever, Lu as makeUnsafe$1, Mu as close, Ns as fn, Pc as runPromiseWith, Qs as logWarning, Ru as provide$1, Tu as succeed, U as NullOr, Vu as MinimumLogLevel, Xc as sync, Yc as suspend, Ys as logError, Zs as logInfo, _s as context, at as String$1, fd as isSuccess, gd as void_, hc as orDie, hd as succeed$1, hs as catch_, nl as tryPromise, od as fail, ot as Struct, pc as onInterrupt, qu as doneUnsafe, td as makeUnsafe, tl as timeoutOrElse, vc as provide, ws as fail$1, wt as Union, xu as merge } from "./Latch-oSncnOpo.js";
import { _ as layer, g as formatStructured, in as join, v as make$1 } from "./dist-DWveHAM-.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import { i as builtinMainContext, n as MenubarItem } from "./host-DQiQeSJn.js";
import { dialog } from "electron";
//#region ../plugin/src/gui/updater.ts
/**
* The updater's state, the same in every window.
* - `disabled`: this build does not update itself.
* - `idle`: no check has run yet.
* - `checking`: a check is running.
* - `downloading`: `version` is downloading.
* - `ready`: `version` is staged; `install` restarts into it.
* - `download-required`: `version` needs a manual download; `install` opens it.
* - `up-to-date`: the last check found nothing newer.
* - `installing`: `version` is installing.
* - `error`: the last check or download failed with `message`.
*/
var UpdaterState = Union([
	Struct({ status: Literal("disabled") }),
	Struct({ status: Literal("idle") }),
	Struct({ status: Literal("checking") }),
	Struct({
		status: Literal("downloading"),
		version: String$1
	}),
	Struct({
		status: Literal("ready"),
		version: String$1
	}),
	Struct({
		status: Literal("download-required"),
		version: String$1
	}),
	Struct({ status: Literal("up-to-date") }),
	Struct({
		status: Literal("installing"),
		version: String$1
	}),
	Struct({
		status: Literal("error"),
		message: String$1
	})
]);
/** The desktop app updater. Its state is app-wide; every window receives the same value. */
var Updater = Ipc.define({
	id: "updater",
	state: UpdaterState,
	methods: {
		check: { output: UpdaterState },
		/** Restarts into a staged update, or opens the installer download. */
		install: {}
	},
	events: { 
	/** The app menu asks the focused window to check with in-app feedback (beta builds). */
check: Null }
});
//#endregion
//#region ../gui-plugins/src/updater/log.ts
/** Services for running the updater's effects: every log goes to the desktop log file, debug included. */
function logContext(log) {
	const logger = make$1((options) => {
		const entry = formatStructured.log(options);
		const [message, ...details] = Array.isArray(options.message) ? options.message : [options.message];
		const detail = details.length === 1 && isRecord(details[0]) ? details[0] : details.length ? { details } : {};
		log(LEVELS[options.logLevel] ?? "info", typeof message === "string" ? message : String(message), {
			...detail,
			...Object.keys(entry.annotations).length === 0 ? {} : { annotations: entry.annotations },
			...entry.cause === void 0 ? {} : { cause: entry.cause }
		});
	});
	return runSync(context().pipe(provide(merge(layer([logger], { mergeWithExisting: false }), succeed(MinimumLogLevel, "All")))));
}
var LEVELS = {
	Trace: "debug",
	Debug: "debug",
	Info: "info",
	Warn: "warn",
	Error: "error",
	Fatal: "error"
};
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
//#endregion
//#region ../gui-plugins/src/updater/machine.ts
var CHECK_TIMEOUT_MS = 6e4;
var STAGE_TIMEOUT_MS = 36e5;
var EXTERNAL_TIMEOUT_MS = 3e4;
/** Runs the update machine. Fibers it forks belong to the caller's scope; closing it settles every caller. */
var make = fn("Updater.make")(function* (dependencies) {
	const runFork = runForkWith(yield* context());
	const platform = dependencies.platform;
	const persisted = platform ? yield* dependencies.persistence.get : void 0;
	const init = initUpdaterMachine({
		currentVersion: dependencies.currentVersion,
		enabled: !!platform,
		canExternalInstall: !!platform?.externalInstall,
		persistedVersion: persisted?.version
	});
	const current = {
		state: init.state,
		view: toUpdaterState(init.state)
	};
	const queue = [];
	const checks = /* @__PURE__ */ new Map();
	const installs = /* @__PURE__ */ new Map();
	const attempts = /* @__PURE__ */ new Map();
	const issued = { waiter: 0 };
	const isolate = (run) => void Promise.try(run).catch((error) => runFork(logError("updater effect failed", { message: String(error) })));
	const dispatch = (event) => {
		queue.push(event);
		if (queue.length > 1) return;
		for (const next of queue) isolate(() => apply(next));
		queue.length = 0;
	};
	const apply = (event) => {
		const step = transitionUpdater(current.state, event);
		current.state = step.state;
		const view = toUpdaterState(step.state);
		if (step.state.status !== "disposed" && !sameView(current.view, view)) {
			runFork(logInfo("updater state changed", {
				from: current.view.status,
				to: view.status
			}));
			current.view = view;
			isolate(() => dependencies.changed(view));
		}
		step.effects.forEach((effect) => isolate(() => perform(effect)));
	};
	const perform = (effect) => {
		if (effect.type === "checks.resolve") return effect.waiters.forEach((waiter) => settle(checks, waiter, succeed$1({ ...effect.state })));
		if (effect.type === "installs.resolve") return effect.waiters.forEach((waiter) => settle(installs, waiter, void_));
		if (effect.type === "installs.reject") return effect.waiters.forEach((waiter) => settle(installs, waiter, fail(failureToError(effect.failure))));
		if (effect.type === "persistence.set") return void runFork(dependencies.persistence.set({ version: effect.version }));
		if (effect.type === "persistence.clear") return void runFork(dependencies.persistence.clear);
		if (effect.type === "log") {
			const log = effect.level === "info" ? logInfo : logWarning;
			runFork(log(effect.message, effect.data));
			return;
		}
		if (effect.type === "attempt.cancel") {
			attempts.get(effect.attempt)?.interruptUnsafe();
			attempts.delete(effect.attempt);
			return;
		}
		if (!platform) return;
		const attempt = effect.attempt;
		if (effect.type === "platform.check") return track(attempt, bounded(platform.checkForUpdate, CHECK_TIMEOUT_MS, "Update check timed out"), (target) => ({
			type: "check.succeeded",
			attempt,
			target
		}), (error) => ({
			type: "check.failed",
			attempt,
			message: error.message
		}));
		if (effect.type === "platform.stage") return track(attempt, bounded(platform.stageUpdate({ differential: effect.differential }), STAGE_TIMEOUT_MS, "Update download timed out"), () => ({
			type: "stage.succeeded",
			attempt
		}), (error) => ({
			type: "stage.failed",
			attempt,
			message: error.message
		}));
		if (effect.type === "platform.restart") return track(attempt, dependencies.restart(platform.installAndRestart), () => ({
			type: "restart.succeeded",
			attempt
		}), (error) => ({
			type: "restart.failed",
			attempt,
			error
		}));
		track(attempt, bounded(platform.externalInstall?.(effect.url) ?? fail$1(failureToError({ kind: "external-unavailable" })), EXTERNAL_TIMEOUT_MS, "External installer did not open"), () => ({
			type: "external.succeeded",
			attempt
		}), (error) => ({
			type: "external.failed",
			attempt,
			error
		}));
	};
	const track = (attempt, work, succeeded, failed) => {
		const fiber = runFork(work);
		attempts.set(attempt, fiber);
		fiber.addObserver((exit) => {
			attempts.delete(attempt);
			if (isSuccess(exit)) return dispatch(succeeded(exit.value));
			if (hasInterruptsOnly(exit.cause)) return;
			const error = squash(exit.cause);
			dispatch(failed(error instanceof Error ? error : new Error(String(error))));
		});
	};
	const request = (waiters, type) => suspend(() => {
		issued.waiter += 1;
		const waiter = issued.waiter;
		const deferred = makeUnsafe();
		waiters.set(waiter, deferred);
		dispatch({
			type,
			waiter
		});
		return _await(deferred).pipe(onInterrupt(() => sync(() => {
			waiters.delete(waiter);
			dispatch({
				type: "waiter.cancelled",
				waiter
			});
		})));
	});
	const check = request(checks, "check.requested").pipe(orDie);
	const install = request(installs, "install.requested");
	init.effects.forEach(perform);
	yield* addFinalizer(() => sync(() => dispatch({ type: "disposed" })));
	const starting = yield* check.pipe(forkScoped);
	yield* gen(function* () {
		yield* sleep("10 minutes");
		yield* check;
	}).pipe(forever, forkScoped);
	return {
		check,
		install,
		state: () => current.view,
		started: join(starting).pipe(orDie)
	};
});
function settle(waiters, waiter, exit) {
	const deferred = waiters.get(waiter);
	waiters.delete(waiter);
	if (deferred) doneUnsafe(deferred, exit);
}
function bounded(work, duration, message) {
	return work.pipe(timeoutOrElse({
		duration,
		orElse: () => fail$1(new Error(message))
	}));
}
function failureToError(failure) {
	if (failure.kind === "not-ready") return /* @__PURE__ */ new Error("Update is not ready to install");
	if (failure.kind === "external-unavailable") return /* @__PURE__ */ new Error("External installer is unavailable");
	if (failure.kind === "disposed") return /* @__PURE__ */ new Error("Updater stopped");
	return failure.error;
}
function sameView(a, b) {
	return a.status === b.status && viewDetail(a) === viewDetail(b);
}
function viewDetail(view) {
	if (view.status === "error") return view.message;
	if (view.status === "downloading" || view.status === "ready" || view.status === "download-required" || view.status === "installing") return view.version;
}
function initUpdaterMachine(input) {
	if (!input.enabled) return {
		state: { status: "disabled" },
		effects: []
	};
	const installed = input.persistedVersion === input.currentVersion;
	return {
		state: {
			status: "idle",
			currentVersion: input.currentVersion,
			canExternalInstall: input.canExternalInstall,
			issued: 0,
			cached: installed ? void 0 : input.persistedVersion
		},
		effects: installed ? [{ type: "persistence.clear" }] : []
	};
}
function transitionUpdater(state, event) {
	if (state.status === "disposed") return afterDispose(state, event);
	if (event.type === "disposed") return dispose(state);
	if (state.status === "disabled") return disabled(state, event);
	if (event.type === "check.requested") return checkRequested(state, event.waiter);
	if (event.type === "install.requested") return installRequested(state, event.waiter);
	if (event.type === "waiter.cancelled") return waiterCancelled(state, event.waiter);
	if (event.attempt !== activeAttempt(state)) return unchanged(state);
	return settled(state, event);
}
/** What windows see. Always a fresh object. */
function toUpdaterState(state) {
	if (state.status === "disposed") return { ...state.last };
	if (state.status === "downloading" || state.status === "ready" || state.status === "download-required") return {
		status: state.status,
		version: state.version
	};
	if (state.status === "installing") return {
		status: "installing",
		version: state.plan.version
	};
	if (state.status === "error") return {
		status: "error",
		message: state.message
	};
	return { status: state.status };
}
function afterDispose(state, event) {
	if (event.type === "check.requested") return withChecks(state, [event.waiter]);
	if (event.type === "install.requested") return unchanged(state, [rejectInstalls([event.waiter], { kind: "disposed" })]);
	return unchanged(state);
}
function dispose(state) {
	const last = toUpdaterState(state);
	if (state.status === "disabled") return {
		state: {
			status: "disposed",
			last
		},
		effects: []
	};
	const attempt = activeAttempt(state);
	const cancel = attempt === void 0 || restarting(state) ? [] : [{
		type: "attempt.cancel",
		attempt
	}];
	const installs = state.status === "installing" ? state.installWaiters : [];
	return withChecks({
		status: "disposed",
		last
	}, checkWaitersOf(state), [...cancel, ...installs.length > 0 ? [rejectInstalls(installs, { kind: "disposed" })] : []]);
}
function disabled(state, event) {
	if (event.type === "check.requested") return withChecks(state, [event.waiter]);
	if (event.type === "install.requested") return unchanged(state, [rejectInstalls([event.waiter], { kind: "not-ready" })]);
	return unchanged(state);
}
function checkRequested(state, waiter) {
	const attempt = state.issued + 1;
	if (state.status === "idle" || state.status === "up-to-date" || state.status === "error") return {
		state: {
			...meta(state),
			issued: attempt,
			status: "checking",
			attempt,
			checkWaiters: [waiter]
		},
		effects: [{
			type: "platform.check",
			attempt
		}]
	};
	if (state.status === "checking" || state.status === "downloading") return unchanged({
		...state,
		checkWaiters: [...state.checkWaiters, waiter]
	});
	if (state.status === "ready" || state.status === "download-required") {
		if (state.refresh) return unchanged(withRefreshWaiters(state, [...state.refresh.checkWaiters, waiter]));
		return {
			state: state.status === "ready" ? {
				...state,
				issued: attempt,
				refresh: {
					step: "checking",
					attempt,
					checkWaiters: [waiter]
				}
			} : {
				...state,
				issued: attempt,
				refresh: {
					attempt,
					checkWaiters: [waiter]
				}
			},
			effects: [{
				type: "platform.check",
				attempt
			}]
		};
	}
	return withChecks(state, [waiter]);
}
function installRequested(state, waiter) {
	if (state.status === "installing" && state.plan.step === "quitting") return unchanged(state, [{
		type: "installs.resolve",
		waiters: [waiter]
	}]);
	if (state.status === "installing") return unchanged({
		...state,
		installWaiters: [...state.installWaiters, waiter]
	});
	const attempt = state.issued + 1;
	if (state.status === "ready") {
		if (state.refresh) return unchanged({
			...meta(state),
			status: "installing",
			plan: {
				...state.refresh,
				mode: "restart",
				version: state.version
			},
			installWaiters: [waiter]
		});
		return {
			state: {
				...meta(state),
				issued: attempt,
				status: "installing",
				plan: {
					mode: "restart",
					version: state.version,
					step: "checking",
					attempt,
					checkWaiters: []
				},
				installWaiters: [waiter]
			},
			effects: [{
				type: "platform.check",
				attempt
			}]
		};
	}
	if (state.status !== "download-required") return unchanged(state, [rejectInstalls([waiter], { kind: "not-ready" })]);
	if (!state.canExternalInstall) return unchanged(state, [rejectInstalls([waiter], { kind: "external-unavailable" })]);
	const plan = {
		mode: "external",
		version: state.version,
		url: state.url,
		step: "checking"
	};
	if (state.refresh) return unchanged({
		...meta(state),
		status: "installing",
		plan: {
			...plan,
			attempt: state.refresh.attempt,
			checkWaiters: state.refresh.checkWaiters
		},
		installWaiters: [waiter]
	});
	return {
		state: {
			...meta(state),
			issued: attempt,
			status: "installing",
			plan: {
				...plan,
				attempt,
				checkWaiters: []
			},
			installWaiters: [waiter]
		},
		effects: [{
			type: "platform.check",
			attempt
		}]
	};
}
function waiterCancelled(state, waiter) {
	if (state.status === "checking" || state.status === "downloading") {
		const checkWaiters = without(state.checkWaiters, waiter);
		return unchanged(checkWaiters === state.checkWaiters ? state : {
			...state,
			checkWaiters
		});
	}
	if ((state.status === "ready" || state.status === "download-required") && state.refresh) {
		const checkWaiters = without(state.refresh.checkWaiters, waiter);
		return unchanged(checkWaiters === state.refresh.checkWaiters ? state : withRefreshWaiters(state, checkWaiters));
	}
	if (state.status !== "installing") return unchanged(state);
	const installWaiters = without(state.installWaiters, waiter);
	const checks = checkWaitersOf(state);
	const checkWaiters = without(checks, waiter);
	if (installWaiters === state.installWaiters && checkWaiters === checks) return unchanged(state);
	return unchanged({
		...state,
		plan: "checkWaiters" in state.plan ? {
			...state.plan,
			checkWaiters
		} : state.plan,
		installWaiters
	});
}
function settled(state, event) {
	if (state.status === "checking") {
		if (event.type === "check.succeeded") return discovered(state, event.target, state.checkWaiters);
		if (event.type === "check.failed") return withChecks({
			...meta(state),
			status: "error",
			message: event.message
		}, state.checkWaiters);
	}
	if (state.status === "downloading") {
		if (event.type === "stage.succeeded") return withChecks({
			...meta(state),
			cached: state.version,
			status: "ready",
			version: state.version
		}, state.checkWaiters, [{
			type: "persistence.set",
			version: state.version
		}]);
		if (event.type === "stage.failed") return withChecks({
			...meta(state),
			status: "error",
			message: event.message
		}, state.checkWaiters);
	}
	if (state.status === "ready" && state.refresh) return refreshSettled(state, state.refresh, event);
	if (state.status === "download-required" && state.refresh) {
		if (event.type === "check.succeeded") return discovered(state, event.target, state.refresh.checkWaiters);
		if (event.type === "check.failed") return withChecks({
			...state,
			refresh: void 0
		}, state.refresh.checkWaiters, [externalRefreshFailed(event.message)]);
	}
	if (state.status === "installing" && state.plan.mode === "restart") return restartSettled(state, state.plan, event);
	if (state.status === "installing" && state.plan.mode === "external") return externalSettled(state, state.plan, event);
	return unchanged(state);
}
function refreshSettled(state, refresh, event) {
	const ready = {
		...state,
		refresh: void 0
	};
	if (refresh.step === "checking" && event.type === "check.succeeded") {
		if (keepsStaged(state, state.version, event.target)) return withChecks(ready, refresh.checkWaiters);
		if (event.target?.mode !== "restart") return discovered(state, event.target, refresh.checkWaiters);
		const attempt = state.issued + 1;
		return {
			state: {
				...state,
				issued: attempt,
				refresh: {
					step: "staging",
					attempt,
					nextVersion: event.target.version,
					checkWaiters: refresh.checkWaiters
				}
			},
			effects: stageEffects(state, attempt, event.target.version)
		};
	}
	if (refresh.step === "staging" && event.type === "stage.succeeded") return withChecks({
		...ready,
		cached: refresh.nextVersion,
		version: refresh.nextVersion
	}, refresh.checkWaiters, [{
		type: "persistence.set",
		version: refresh.nextVersion
	}]);
	if (event.type === "check.failed" || event.type === "stage.failed") return withChecks(ready, refresh.checkWaiters, [stagedRefreshFailed(state.version, event.message)]);
	return unchanged(state);
}
function restartSettled(state, plan, event) {
	if (plan.step === "checking" && event.type === "check.succeeded") {
		if (keepsStaged(state, plan.version, event.target)) return restart(state, plan.version, plan.checkWaiters);
		if (event.target?.mode === "external") {
			const next = discovered(state, event.target, plan.checkWaiters);
			return {
				state: next.state,
				effects: [...next.effects, {
					type: "installs.resolve",
					waiters: state.installWaiters
				}]
			};
		}
		const nextVersion = event.target?.version ?? plan.version;
		const attempt = state.issued + 1;
		return {
			state: {
				...state,
				issued: attempt,
				plan: {
					mode: "restart",
					version: plan.version,
					step: "staging",
					attempt,
					nextVersion,
					checkWaiters: plan.checkWaiters
				}
			},
			effects: stageEffects(state, attempt, nextVersion)
		};
	}
	if (plan.step === "checking" && event.type === "check.failed" || plan.step === "staging" && event.type === "stage.failed") return restart(state, plan.version, plan.checkWaiters, [stagedRefreshFailed(plan.version, event.message)]);
	if (plan.step === "staging" && event.type === "stage.succeeded") return restart({
		...state,
		cached: plan.nextVersion
	}, plan.nextVersion, plan.checkWaiters, [{
		type: "persistence.set",
		version: plan.nextVersion
	}]);
	if (plan.step === "restarting" && event.type === "restart.succeeded") return unchanged({
		...state,
		plan: {
			mode: "restart",
			version: plan.version,
			step: "quitting"
		},
		installWaiters: []
	}, [{
		type: "installs.resolve",
		waiters: state.installWaiters
	}]);
	if (plan.step === "restarting" && event.type === "restart.failed") return unchanged({
		...meta(state),
		status: "ready",
		version: plan.version
	}, [rejectInstalls(state.installWaiters, {
		kind: "error",
		error: event.error
	})]);
	return unchanged(state);
}
function externalSettled(state, plan, event) {
	if (plan.step === "checking" && event.type === "check.succeeded") {
		if (event.target?.mode === "external") return open(state, event.target.version, event.target.url, plan.checkWaiters);
		const next = discovered(state, event.target, plan.checkWaiters);
		return {
			state: next.state,
			effects: [...next.effects, rejectInstalls(state.installWaiters, { kind: "external-unavailable" })]
		};
	}
	if (plan.step === "checking" && event.type === "check.failed") return open(state, plan.version, plan.url, plan.checkWaiters, [externalRefreshFailed(event.message)]);
	const offered = {
		...meta(state),
		status: "download-required",
		version: plan.version,
		url: plan.url
	};
	if (plan.step === "opening" && event.type === "external.succeeded") return unchanged(offered, [{
		type: "installs.resolve",
		waiters: state.installWaiters
	}]);
	if (plan.step === "opening" && event.type === "external.failed") return unchanged(offered, [rejectInstalls(state.installWaiters, {
		kind: "error",
		error: event.error
	})]);
	return unchanged(state);
}
function discovered(state, target, checkWaiters) {
	if (!target || target.mode === "restart" && target.version === state.currentVersion) return withChecks({
		...meta(state),
		status: "up-to-date"
	}, checkWaiters, [{ type: "persistence.clear" }]);
	if (target.mode === "external") return withChecks({
		...meta(state),
		status: "download-required",
		version: target.version,
		url: target.url
	}, checkWaiters, [{ type: "persistence.clear" }]);
	const attempt = state.issued + 1;
	return {
		state: {
			...meta(state),
			issued: attempt,
			status: "downloading",
			attempt,
			version: target.version,
			checkWaiters
		},
		effects: stageEffects(state, attempt, target.version)
	};
}
function restart(state, version, checkWaiters, effects = []) {
	const attempt = state.issued + 1;
	return withChecks({
		...state,
		issued: attempt,
		plan: {
			mode: "restart",
			version,
			step: "restarting",
			attempt
		}
	}, checkWaiters, [...effects, {
		type: "platform.restart",
		attempt
	}]);
}
function open(state, version, url, checkWaiters, effects = []) {
	const attempt = state.issued + 1;
	return withChecks({
		...state,
		issued: attempt,
		plan: {
			mode: "external",
			version,
			url,
			step: "opening",
			attempt
		}
	}, checkWaiters, [...effects, {
		type: "platform.external",
		attempt,
		url
	}]);
}
function keepsStaged(state, staged, target) {
	return !target || target.mode === "restart" && (target.version === staged || target.version === state.currentVersion);
}
function stageEffects(state, attempt, version) {
	const stage = {
		type: "platform.stage",
		attempt,
		differential: !state.cached
	};
	if (!state.cached) return [stage];
	return [{
		type: "log",
		level: "info",
		message: "skipping differential download, updater cache is stale",
		data: {
			current: state.currentVersion,
			staged: state.cached,
			version
		}
	}, stage];
}
function activeAttempt(state) {
	if (state.status === "checking" || state.status === "downloading") return state.attempt;
	if (state.status === "ready" || state.status === "download-required") return state.refresh?.attempt;
	if (state.status === "installing" && state.plan.step !== "quitting") return state.plan.attempt;
}
function restarting(state) {
	return state.status === "installing" && state.plan.step === "restarting";
}
function checkWaitersOf(state) {
	if (state.status === "checking" || state.status === "downloading") return state.checkWaiters;
	if (state.status === "ready" || state.status === "download-required") return state.refresh?.checkWaiters ?? [];
	if (state.status === "installing" && "checkWaiters" in state.plan) return state.plan.checkWaiters;
	return [];
}
function withRefreshWaiters(state, checkWaiters) {
	if (state.status === "ready" && state.refresh) return {
		...state,
		refresh: {
			...state.refresh,
			checkWaiters
		}
	};
	if (state.status === "download-required" && state.refresh) return {
		...state,
		refresh: {
			...state.refresh,
			checkWaiters
		}
	};
	return state;
}
function meta(state) {
	return {
		currentVersion: state.currentVersion,
		canExternalInstall: state.canExternalInstall,
		issued: state.issued,
		cached: state.cached
	};
}
function stagedRefreshFailed(staged, message) {
	return {
		type: "log",
		level: "warning",
		message: "updater refresh failed, keeping staged update",
		data: {
			staged,
			message
		}
	};
}
function externalRefreshFailed(message) {
	return {
		type: "log",
		level: "warning",
		message: "external updater refresh failed, keeping download available",
		data: { message }
	};
}
function rejectInstalls(waiters, failure) {
	return {
		type: "installs.reject",
		waiters,
		failure
	};
}
function without(waiters, waiter) {
	return waiters.includes(waiter) ? waiters.filter((item) => item !== waiter) : waiters;
}
function withChecks(state, waiters, effects = []) {
	if (waiters.length === 0) return {
		state,
		effects
	};
	return {
		state,
		effects: [...effects, {
			type: "checks.resolve",
			waiters,
			state: toUpdaterState(state)
		}]
	};
}
function unchanged(state, effects = []) {
	return {
		state,
		effects
	};
}
//#endregion
//#region ../gui-plugins/src/updater/main.ts
var setup = async (ctx) => {
	const builtin = builtinMainContext(ctx);
	const build = ctx.app;
	const lifecycle = builtin.lifecycle;
	const enabled = build.packaged;
	const context = logContext(ctx.log.write);
	const runPromise = runPromiseWith(context);
	const runFork = runForkWith(context);
	const ready = builtin.storage.store("ready", {
		schema: NullOr(Struct({ version: String$1 })),
		initial: null,
		from: {
			settings: "ready",
			file: "opencode.updater"
		}
	});
	const platform = enabled ? await import("./platform-DKdK9uLj.js").then((module) => runPromise(module.make(build.channel))) : void 0;
	if (ctx.signal.aborted) return;
	const scope = makeUnsafe$1();
	ctx.onCleanup(() => runPromise(close(scope, void_)));
	const publish = { changed: () => {} };
	const updater = await runPromise(make({
		currentVersion: build.version,
		platform,
		restart: (handoff) => tryPromise({
			try: () => lifecycle.restart(() => runPromise(handoff)),
			catch: (error) => error
		}),
		persistence: {
			get: sync(() => ready.value ?? void 0),
			set: (value) => sync(() => ready.set(value)),
			clear: sync(() => ready.set(null))
		},
		changed: () => publish.changed()
	}).pipe(provide$1(scope)));
	const provider = ctx.provide(Updater, {
		state: () => updater.state(),
		check: () => runPromise(updater.check),
		install: () => runPromise(updater.install)
	});
	publish.changed = () => provider.changed();
	const show = gen(function* () {
		const state = yield* updater.check;
		if (state.status === "error") {
			yield* promise(() => dialog.showMessageBox({
				type: "error",
				message: ctx.t("dialog.checkFailed.message"),
				title: ctx.t("dialog.checkFailed.title")
			}));
			return;
		}
		if (state.status === "up-to-date") {
			yield* promise(() => dialog.showMessageBox({
				type: "info",
				message: ctx.t("dialog.upToDate.message"),
				title: ctx.t("dialog.upToDate.title")
			}));
			return;
		}
		if (state.status !== "ready") return;
		if ((yield* promise(() => dialog.showMessageBox({
			type: "info",
			message: ctx.t("dialog.ready.message", { version: state.version }),
			title: ctx.t("dialog.ready.title"),
			buttons: [ctx.t("dialog.restart"), ctx.t("dialog.later")],
			defaultId: 0,
			cancelId: 1
		}))).response === 0) yield* updater.install.pipe(catch_((error) => logWarning("update install failed", { message: error.message })));
	});
	ctx.add(MenubarItem, () => ({
		menu: "app",
		id: "check",
		label: ctx.t("menu.check"),
		after: "about",
		enabled: () => enabled,
		run(window) {
			if (build.channel !== "beta") return void runFork(show);
			if (window) provider.emit("check", null, window.id);
		}
	}));
};
function promise(evaluate) {
	return tryPromise(evaluate).pipe(orDie);
}
//#endregion
export { setup as default };
