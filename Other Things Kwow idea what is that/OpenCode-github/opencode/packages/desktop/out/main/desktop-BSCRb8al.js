import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.js";
import { $c as tapError, $m as make$11, $n as link$1, $o as addFinalizer$1, $s as logWithLevel, Ac as runForkWith, As as flatMap, Au as addFinalizer, B as NonEmptyArray, Bc as scope, Bn as isSchema, Bs as forkScoped, Bt as decodeUnknownOption, Cs as exit, Cu as provide$2, D as Finite, Dg as isBoolean, Du as unwrap, Ed as fail$1, Et as Unknown, Fd as hasInterruptsOnly, Fs as forEach, Fu as forkUnsafe, Gc as sleep, Gd as squash, Gg as constTrue, Gm as add, Gs as interrupt, Gt as encodeSync, Gu as _await, Hi as defaultFormatter, Hs as gen, I as Literals, Ii as transformEffect, Iu as make$10, Jg as constant, Js as logDebug, Kc as succeed, Kg as constUndefined, Km as empty, Lg as isString, Lp as TaggedError, Ls as forkChild, Lu as makeUnsafe$1, Md as hasDies, Mu as close$1, N as Json, Nn as isMinLength, Np as externalSpan, Ns as fn, Nt as declare, Nu as closeUnsafe, Ot as Void, Ou as Scope, Pc as runPromiseWith, Pd as hasInterrupts, Ps as fnUntraced, Pt as decode$1, Qc as tapCause, Qg as identity, Qs as logWarning, Rc as runSyncWith, Rt as decodeUnknownEffect, Ru as provide, Ss as ensuring, Su as mergeAll, T as Exit, Tg as hasProperty, Ts as failCause, Tu as succeed$1, U as NullOr, Um as Reference, Uo as toNumber, Ut as decodeUnknownSync, Vc as scoped$1, Vu as MinimumLogLevel, W as Number$1, Wc as serviceOption, Wm as Service$9, Ws as ignoreCause, X as Record, Xc as sync, Xg as flow, Xl as catchDone, Xm as getOrUndefinedUnsafe, Xs as logFatal, Xt as fromJsonString, Yc as suspend, Yg as dual, Ym as getOrUndefined, Ys as logError, Zc as tap, Zm as getUnsafe, Zo as acquireRelease, Zs as logInfo, Zu as isDeferred, _c as promise$1, _h as orElse, _s as context, _u as effect, ad as die, ah as flatMap$1, ar as optional, as as asVoid, at as String$1, bc as provideService, bs as die$1, bt as Uint8Array$2, cc as matchEffect, ch as getOrElse, cl as uninterruptibleMask, cs as callback, da as fromInput, dc as onExit, dl as void_, e_ as pipe, eh as makeUnsafe$2, es as all, fd as isSuccess, fh as isNone, gc as orElseSucceed, gd as void_$1, gh as none, gl as withSpan, gt as Tuple, h as Class, hc as orDie, hs as catch_, i as Any, ji as passthrough, jp as ParentSpan, kc as runFork, kn as isMaxLength, l as Boolean, lc as never, ld as interrupt$1, lr as toCodecJson, ls as catchCause, lt as TaggedClass, mc as option, mh as map$1, ml as withFiber, n_ as pipeArguments, ni as defaultParseOptions, nl as tryPromise, nn as isBetween, nr as makeFilter, ns as annotateLogs, o as ArraySchema, oh as fromNullishOr, op as reportCauseUnsafe, or as optionalKey, ot as Struct, pc as onInterrupt, ph as isSome, pl as whileLoop, qg as constVoid, qm as get, qs as isEffect, qt as encodeUnknownEffect, qu as doneUnsafe, r as makeUnsafe, rl as try_, rs as as, tc as map, td as makeUnsafe$3, th as merge, tl as timeoutOrElse, tr as make$9, ts as andThen, uc as onError, ud as isExit, uh as getOrUndefined$1, us as catchDefect, vc as provide$1, vh as some, vs as contextWith, vu as effectContext, wd as die$2, ws as fail, wt as Union, wu as provideMerge, xd as StackTrace, xs as effectify, xu as merge$1, y as Defect, yc as provideContext, yu as effectDiscard, z as Never, zo as bytes, zs as forkIn } from "./Latch-oSncnOpo.js";
import { $t as take, At as badArgument, C as Path$1, D as WatchBackend, E as FileTypeId, Gt as failCauseUnsafe, Ht as make$12, I as empty$1, Jt as offerAllUnsafe, K as fromQueue, O as make$13, Ot as BadArgument, St as unwrap$1, T as FileSystem, Ut as makeUnsafe$4, Wt as endUnsafe, Y as isStream, Yt as offerUnsafe, Zt as shutdown, _ as layer$15, an as runIn, b as make$15, ct as runCollect, dt as runForEach, en as takeAll, ft as runForEachArray, g as formatStructured, jt as systemError, k as callback$1, nn as getCurrent, ot as provideContext$1, qt as offer, s as makeRunMain, tn as unbounded, v as make$16, w as make$14, x as runtime$1, y as symbol } from "./dist-DWveHAM-.js";
import { $ as takeSidecarProbe, A as nextDesktopZoomLevel, B as ZOOM_LEVEL_KEY, C as tone, D as desktopMenuVisible, E as desktopMenuKey, F as FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY, G as readEnableState, H as resolveLocalFilePath, I as PINCH_ZOOM_ENABLED_KEY, J as isRendererUrl, K as isCliDatabase, L as SPELLCHECK_ENABLED_KEY, M as getStore, N as BACKGROUND_COLOR_KEY, O as desktopMenuWithPlugins, P as BUNDLED_CLI_VERSION_KEY, Q as windowDataFile, R as SPELLCHECK_LANGUAGES_KEY, S as titlebarOverlay, T as DESKTOP_MENU, U as setStorageSnapshotObserver, V as resolveExternalURL, W as setStorageSnapshotProvider, X as DragCancelEvent, Y as loadWindow, Z as IpcTransportPort, _ as glassEnabled, a as windowStateFile, b as storedBackgroundColor, c as wireRendererHeaders, et as VERSION, f as ready$2, g as setProtocolReporter, h as registerRendererProtocol, i as resolveWindowState, j as windowArguments, k as desktopZoomLevels, m as createWindowRegistry, n as manageWindowState, o as allowRendererPermissions, p as set, q as migrateDatabase, r as readWindowState, rt as marks, s as wireNavigationPolicy, t as restoreEarlyWindow, v as platformFrame, w as windowGlass, x as storedZoomLevel, y as savedBackgroundColor, z as WINDOW_IDS_KEY } from "./index.js";
import { BrowserWindow, Menu, MessageChannelMain, app, clipboard, crashReporter, dialog, nativeImage, nativeTheme, netLog, screen, session, shell, systemPreferences, webContents } from "electron";
import * as Crypto from "node:crypto";
import { createHash, randomUUID } from "node:crypto";
import * as NFS from "node:fs";
import { existsSync, readFileSync, renameSync } from "node:fs";
import * as OS from "node:os";
import { homedir, userInfo } from "node:os";
import * as Path from "node:path";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import * as NodeUrl from "node:url";
import http from "node:http";
import util, { promisify } from "node:util";
import { getCACertificates, setDefaultCACertificates } from "node:tls";
import { readFile, stat } from "node:fs/promises";
import { execFile, spawn } from "node:child_process";
import log from "electron-log/main.js";
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/internal/utils.js
/** @internal */
var handleErrnoException = (module, method) => (err, [path]) => {
	let reason = "Unknown";
	switch (err.code) {
		case "ENOENT":
			reason = "NotFound";
			break;
		case "EACCES":
		case "EPERM":
			reason = "PermissionDenied";
			break;
		case "EEXIST":
			reason = "AlreadyExists";
			break;
		case "EISDIR":
			reason = "BadResource";
			break;
		case "ENOTDIR":
			reason = "BadResource";
			break;
		case "EBUSY":
			reason = "Busy";
			break;
		case "ELOOP": reason = "BadResource";
	}
	return systemError({
		_tag: reason,
		module,
		method,
		pathOrDescriptor: path,
		syscall: err.syscall,
		cause: err
	});
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/workers/Transferable.js
/**
* Marks encoded worker message fields that should move through `postMessage` as
* transfer-list entries.
*
* Worker messages still pass through schema encoding and structured clone, but
* schemas wrapped with `schema` can also report backing resources such as
* `ArrayBuffer`, `ImageData.data.buffer`, or `MessagePort` to a `Collector`.
* Worker platforms then pass the collected values as the transfer list for the
* same `postMessage` call, avoiding copies for large payloads and ports.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Service for collecting `Transferable` objects while encoding worker messages
* so they can be passed to `postMessage` transfer lists.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var Collector = class extends Service$9()("effect/workers/Transferable/Collector") {};
/**
* Creates a mutable `Collector` service directly, exposing unsafe synchronous
* methods for reading, adding, and clearing collected transferables.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var makeCollectorUnsafe = () => {
	let tranferables = [];
	const unsafeAddAll = (transfers) => {
		tranferables.push(...transfers);
	};
	const unsafeRead = () => tranferables;
	const unsafeClear = () => {
		const prev = tranferables;
		tranferables = [];
		return prev;
	};
	return Collector.of({
		addAllUnsafe: unsafeAddAll,
		addAll: (transferables) => sync(() => unsafeAddAll(transferables)),
		readUnsafe: unsafeRead,
		read: sync(unsafeRead),
		clearUnsafe: unsafeClear,
		clear: sync(unsafeClear)
	});
};
/**
* Creates a schema getter that records transferables derived from a value in
* the current `Collector` while passing the value through unchanged.
*
* @stability unstable
* @category getters
* @since 4.0.0
*/
var getterAddAll = (f) => transformEffect((e) => contextWith((services) => {
	const collector = getOrUndefined(services, Collector);
	if (!collector) return succeed(e);
	collector.addAllUnsafe(f(e));
	return succeed(e);
}));
/**
* Wraps a schema so encoding records transferables selected from the encoded
* value, enabling worker messages to populate a `postMessage` transfer list.
*
* @stability unstable
* @category schemas
* @since 4.0.0
*/
var schema$1 = /*#__PURE__*/ dual(2, (self, f) => self.annotate({ toCodecJson: () => passthroughLink }).pipe(decode$1({
	decode: passthrough(),
	encode: getterAddAll(f)
})));
var passthroughLink = /*#__PURE__*/ link$1()(Any, {
	decode: /*#__PURE__*/ passthrough(),
	encode: /*#__PURE__*/ passthrough()
});
/**
* Schema for transferring `Uint8Array` values with their backing buffer.
*
* @stability unstable
* @category schemas
* @since 4.0.0
*/
var Uint8Array$1 = /*#__PURE__*/ schema$1(Uint8Array$2, (_) => [_.buffer]);
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/internal/tracing.js
/**
* Names the span after the RPC method, or `${spanPrefix}.${tag}` when a prefix
* is configured.
*
* @internal
*/
var spanName = (spanPrefix, tag) => spanPrefix === void 0 ? tag : `${spanPrefix}.${tag}`;
/**
* Default RPC span attributes, overridden by user `spanAttributes`.
*
* @internal
*/
var spanAttributes = (tag, attributes) => ({
	"rpc.system.name": "effect_rpc",
	"rpc.method": tag,
	...attributes
});
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/RpcSchema.js
/**
* RPC schema markers and interruption annotations.
*
* This module contains the small pieces of schema metadata that the RPC
* declaration, client, server, cluster, and reactivity layers share. It marks
* streamed responses and annotates interruptions that came from a remote client
* closing or cancelling a request.
*
* @stability unstable
* @since 4.0.0
*/
var StreamSchemaTypeId = "~effect/rpc/RpcSchema/StreamSchema";
/**
* Returns `true` when a schema is an RPC stream schema created by
* `RpcSchema.Stream`.
*
* @stability unstable
* @category guards
* @since 4.0.0
*/
function isStreamSchema(schema) {
	return hasProperty(schema, StreamSchemaTypeId);
}
/**
* @internal
*/
function getStreamSchemas(schema) {
	return isStreamSchema(schema) ? some({
		success: schema.success,
		error: schema.error
	}) : none();
}
var schema = /*#__PURE__*/ declare(isStream);
/**
* Creates an RPC stream schema from a stream element success schema and stream
* error schema.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
function Stream(success, error) {
	return make$9(schema.ast, {
		[StreamSchemaTypeId]: StreamSchemaTypeId,
		success,
		error
	});
}
/**
* Annotation that marks interruptions that originate from an RPC client
* abort.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var ClientAbort = class extends Service$9()("effect/rpc/RpcSchema/ClientAbort") {
	static annotation = /*#__PURE__*/ this.context(true).pipe(/*#__PURE__*/ add(StackTrace, {
		name: "ClientAbort",
		stack: constUndefined,
		parent: void 0
	}));
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/Rpc.js
var TypeId = "~effect/rpc/Rpc";
/**
* Represents server-side metadata for the client associated with an RPC request.
*
* **When to use**
*
* Use to inspect or annotate the connected client while handling an RPC request
* on the server.
*
* **Details**
*
* It stores the client id and request annotations that handlers can read or
* extend.
*
* @stability unstable
* @category models
* @since 4.0.0
*/
var ServerClient = class {
	id;
	annotations;
	constructor(id) {
		this.id = id;
		this.annotations = empty();
	}
	annotate(tag, value) {
		this.annotations = add(this.annotations, tag, value);
		return this;
	}
};
var Proto = {
	[TypeId]: TypeId,
	pipe() {
		return pipeArguments(this, arguments);
	},
	setSuccess(successSchema) {
		return makeProto$1({
			_tag: this._tag,
			payloadSchema: this.payloadSchema,
			successSchema,
			errorSchema: this.errorSchema,
			defectSchema: this.defectSchema,
			annotations: this.annotations,
			middlewares: this.middlewares
		});
	},
	setError(errorSchema) {
		return makeProto$1({
			_tag: this._tag,
			payloadSchema: this.payloadSchema,
			successSchema: this.successSchema,
			errorSchema,
			defectSchema: this.defectSchema,
			annotations: this.annotations,
			middlewares: this.middlewares
		});
	},
	setPayload(payloadSchema) {
		return makeProto$1({
			_tag: this._tag,
			payloadSchema: isSchema(payloadSchema) ? payloadSchema : Struct(payloadSchema),
			successSchema: this.successSchema,
			errorSchema: this.errorSchema,
			defectSchema: this.defectSchema,
			annotations: this.annotations,
			middlewares: this.middlewares
		});
	},
	middleware(middleware) {
		return makeProto$1({
			_tag: this._tag,
			payloadSchema: this.payloadSchema,
			successSchema: this.successSchema,
			errorSchema: this.errorSchema,
			defectSchema: this.defectSchema,
			annotations: this.annotations,
			middlewares: /* @__PURE__ */ new Set([...this.middlewares, middleware])
		});
	},
	prefix(prefix) {
		return makeProto$1({
			_tag: `${prefix}${this._tag}`,
			payloadSchema: this.payloadSchema,
			successSchema: this.successSchema,
			errorSchema: this.errorSchema,
			defectSchema: this.defectSchema,
			annotations: this.annotations,
			middlewares: this.middlewares
		});
	},
	annotate(tag, value) {
		return makeProto$1({
			_tag: this._tag,
			payloadSchema: this.payloadSchema,
			successSchema: this.successSchema,
			errorSchema: this.errorSchema,
			defectSchema: this.defectSchema,
			middlewares: this.middlewares,
			annotations: add(this.annotations, tag, value)
		});
	},
	annotateMerge(context) {
		return makeProto$1({
			_tag: this._tag,
			payloadSchema: this.payloadSchema,
			successSchema: this.successSchema,
			errorSchema: this.errorSchema,
			defectSchema: this.defectSchema,
			middlewares: this.middlewares,
			annotations: merge(this.annotations, context)
		});
	}
};
var makeProto$1 = (options) => {
	function Rpc() {}
	Object.setPrototypeOf(Rpc, Proto);
	Object.assign(Rpc, options);
	Rpc.key = `effect/rpc/Rpc/${options._tag}`;
	return Rpc;
};
/**
* Creates an RPC definition with the supplied tag and optional schemas.
*
* **Details**
*
* Payload options can be either a schema or struct fields. `stream: true` wraps
* the success and error schemas in a stream schema and sets the normal error
* schema to `Schema.Never`. `primaryKey` creates a payload class with a
* primary key derived from the payload value.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$8 = (tag, options) => {
	const successSchema = options?.success ?? Void;
	const errorSchema = options?.error ?? Never;
	const defectSchema = options?.defect ?? Defect();
	let payloadSchema;
	if (options?.primaryKey) payloadSchema = class Payload extends Class(`effect/rpc/Rpc/${tag}`)(options.payload) {
		[symbol]() {
			return options.primaryKey(this);
		}
	};
	else payloadSchema = isSchema(options?.payload) ? options?.payload : options?.payload ? Struct(options?.payload) : Void;
	return makeProto$1({
		_tag: tag,
		payloadSchema,
		successSchema: options?.stream ? Stream(successSchema, errorSchema) : successSchema,
		errorSchema: options?.stream ? Never : errorSchema,
		defectSchema,
		annotations: empty(),
		middlewares: /* @__PURE__ */ new Set()
	});
};
var exitSchemaCache = /*#__PURE__*/ new WeakMap();
/**
* Builds the `Schema.Exit` used to encode and decode RPC results.
*
* **Details**
*
* The failure side includes the RPC error schema, middleware error schemas, and
* stream error schema for streaming RPCs. Streaming RPCs use `Schema.Void` for
* the exit success value. The schema is cached per RPC definition.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var exitSchema = (self) => {
	if (exitSchemaCache.has(self)) return exitSchemaCache.get(self);
	const rpc = self;
	const failures = /* @__PURE__ */ new Set([rpc.errorSchema]);
	const streamSchemas = getStreamSchemas(rpc.successSchema);
	if (isSome(streamSchemas)) failures.add(streamSchemas.value.error);
	for (const middleware of rpc.middlewares) failures.add(middleware.error);
	const schema = Exit(isSome(streamSchemas) ? Void : rpc.successSchema, Union([...failures]), rpc.defectSchema);
	exitSchemaCache.set(self, schema);
	return schema;
};
/**
* Annotation that sets the schema parse options used by `RpcClient` and
* `RpcServer` when encoding and decoding an RPC's payload, success values,
* stream chunks, and exits.
*
* **Details**
*
* The default value is `SchemaAST.defaultParseOptions`. Set `concurrency` to
* parse product elements concurrently, which lets decoding transformations that
* call `Effect.request` share `RequestResolver` batches. Annotate a single RPC
* with `annotate`, or every RPC in a group with `RpcGroup.annotateRpcs`.
*
* @stability unstable
* @category annotations
* @since 4.0.0
*/
var ParseOptions = /*#__PURE__*/ Reference("effect/rpc/Rpc/ParseOptions", { defaultValue: () => defaultParseOptions });
var WrapperTypeId = "~effect/rpc/Rpc/Wrapper";
/**
* Returns `true` when the value is an RPC `Wrapper`.
*
* @stability unstable
* @category guards
* @since 4.0.0
*/
var isWrapper = (u) => WrapperTypeId in u;
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/RpcMessage.js
/**
* Converts a bigint or string request id into the branded `RequestId` type.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var RequestId = (id) => id;
/**
* Creates a transport-encoded defect response around an already-encoded defect.
*
* **Details**
*
* Encode the defect with `protocol.codecFor(Schema.Defect())` before wrapping
* it, because the codec that fills the defect hole belongs to the protocol.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var ResponseDefectEncoded = (encodedDefect) => ({
	_tag: "Defect",
	defect: encodedDefect
});
/**
* Represents the reusable `Pong` message value.
*
* @stability unstable
* @category constants
* @since 4.0.0
*/
var constPong = { _tag: "Pong" };
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/RpcSerialization.js
/**
* Serializes RPC protocol messages for transports.
*
* `RpcSerialization` is the boundary between `RpcMessage` envelopes and the
* bytes or strings carried by a transport. This module provides built-in
* serializers for JSON, newline-delimited JSON, JSON-RPC 2.0, and SchemaBinary,
* including framed formats that can decode multiple messages
* from streaming chunks.
*
* @stability unstable
* @since 4.0.0
*/
var codecForJson = toCodecJson;
var sharedTextDecoder;
var decodeText = (bytes) => (sharedTextDecoder ??= new TextDecoder()).decode(bytes);
/**
* Service that describes how RPC protocol messages are encoded and decoded,
* including the content type and whether the serialization format provides
* message framing.
*
* **When to use**
*
* Use to provide the serialization boundary shared by RPC clients and servers
* for a chosen wire format.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var RpcSerialization = class extends Service$9()("effect/rpc/RpcSerialization") {};
TaggedError("MaxBufferSizeExceeded");
TaggedError("NdjsonDecodeError");
/**
* JSON RPC serialization for whole message payloads. It does not include
* message framing, so it is intended for transports that frame responses
* themselves.
*
* @stability unstable
* @category serialization
* @since 4.0.0
*/
var json$1 = /*#__PURE__*/ RpcSerialization.of({
	contentType: "application/json",
	includesFraming: false,
	codecFor: codecForJson,
	makeUnsafe: () => ({
		decode: (bytes) => {
			const decoded = JSON.parse(typeof bytes === "string" ? bytes : decodeText(bytes));
			return Array.isArray(decoded) ? decoded : [decoded];
		},
		encode: (response) => JSON.stringify(response)
	})
});
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/Utils.js
/**
* Buffers writes until `run` replays them with their original contexts and
* installs the writer. Restores the previous writer when `run` ends.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var withRun = () => (f) => suspend(() => {
	const semaphore = makeUnsafe$4(1);
	let buffer = [];
	let write = (...args) => contextWith((context) => {
		buffer.push([args, context]);
		return void_;
	});
	return map(f((...args) => write(...args)), (a) => ({
		...a,
		run(f) {
			return semaphore.withPermits(1)(gen(function* () {
				const prev = write;
				for (const [args, context] of buffer) yield* provideContext(suspend(() => f(...args)), context);
				buffer = [];
				write = f;
				return yield* onExit(never, () => {
					write = prev;
					return void_;
				});
			}));
		}
	}));
});
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/RpcServer.js
/**
* Creates an RPC server for an already-decoded message channel, running
* handlers for a group and sending decoded server responses through
* `onFromServer`.
*
* **Details**
*
* If writing a stream `Chunk` fails with anything other than an interruption,
* the request fails with that cause. `onFromServer` is assumed to have already
* answered the client and reported it, so nothing else is sent or reported.
*
* A request with `isNotification` set runs like any other, but no `Exit`,
* `Chunk` or `Defect` is sent for it. Its failures are still reported.
*
* A request with `discard` set is acknowledged with a successful `Exit` once
* its handler starts, after the concurrency permit is taken and the
* middleware has run. Nothing else is sent for it after that, and its
* failures are only reported. A failure before the acknowledgement is sent as
* a failed `Exit` for that request.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var makeNoSerialization = /*#__PURE__*/ fnUntraced(function* (group, options) {
	const enableTracing = options.disableTracing !== true;
	const enableSpanPropagation = options.disableSpanPropagation !== true;
	const supportsAck = options.disableClientAcks !== true;
	const spanPrefix = options.spanPrefix;
	const concurrency = options.concurrency ?? "unbounded";
	const disableFatalDefects = options.disableFatalDefects ?? false;
	const services = yield* context();
	const scope = get(services, Scope);
	const trackFiber = runIn(forkUnsafe(scope, "parallel"));
	const concurrencySemaphore = concurrency === "unbounded" ? void 0 : yield* make$12(concurrency);
	const clients = /* @__PURE__ */ new Map();
	let isShutdown = false;
	const shutdownLatch = makeUnsafe(false);
	yield* addFinalizer(scope, withFiber((parent) => {
		isShutdown = true;
		for (const client of clients.values()) {
			client.ended = true;
			if (client.fibers.size === 0) {
				trackFiber(runForkWith(services)(endClient(client)));
				continue;
			}
			for (const fiber of client.fibers.values()) fiber.interruptUnsafe(parent.id);
		}
		if (clients.size === 0) return void_;
		return shutdownLatch.await;
	}));
	const disconnect = (clientId) => withFiber((parent) => {
		const client = clients.get(clientId);
		if (!client) return void_;
		for (const fiber of client.fibers.values()) fiber.interruptUnsafe(parent.id);
		clients.delete(clientId);
		return void_;
	});
	const write = (clientId, message, opts) => catchDefect(withFiber((requestFiber) => {
		if (isShutdown) return interrupt;
		let client = clients.get(clientId);
		if (!client) {
			client = {
				id: clientId,
				latches: void 0,
				fibers: /* @__PURE__ */ new Map(),
				ended: false,
				serverClient: new ServerClient(clientId)
			};
			clients.set(clientId, client);
		} else if (client.ended && (message._tag !== "Interrupt" && message._tag !== "Ack" || !client.fibers.has(message.requestId))) return interrupt;
		switch (message._tag) {
			case "Request": return handleRequest(requestFiber, client, message, opts);
			case "Ack": {
				const latch = client.latches?.get(message.requestId);
				return latch ? asVoid(latch.open) : void_;
			}
			case "Interrupt": {
				const fiber = client.fibers.get(message.requestId);
				if (fiber) {
					fiber.interruptUnsafe(requestFiber.id, ClientAbort.annotation);
					return void_;
				}
				return options.onFromServer({
					_tag: "Exit",
					clientId,
					requestId: message.requestId,
					exit: interrupt$1()
				});
			}
			case "Eof":
				client.ended = true;
				if (client.fibers.size > 0) return void_;
				return endClient(client);
			default: return sendDefect(client, `Unknown request tag: ${message._tag}`);
		}
	}), (defect) => sendDefect(clients.get(clientId), defect));
	const endClient = (client) => {
		clients.delete(client.id);
		const write = options.onFromServer({
			_tag: "ClientEnd",
			clientId: client.id
		});
		if (isShutdown && clients.size === 0) return andThen(write, shutdownLatch.open);
		return write;
	};
	const handleRequest = (requestFiber, client, request, opts) => {
		if (client.fibers.has(request.id)) return interrupt;
		const isNotification = request.isNotification === true;
		const isDiscard = !isNotification && request.discard === true;
		let acknowledged = false;
		const respond = (exit) => isNotification || acknowledged ? void_ : options.onFromServer({
			_tag: "Exit",
			clientId: client.id,
			requestId: request.id,
			exit
		});
		const rpc = group.requests.get(request.tag);
		const entry = getOrUndefinedUnsafe(services, rpc?.key);
		if (!rpc || !entry) {
			const write = catchDefect(respond(die(`Unknown request tag: ${request.tag}`)), (defect) => sendDefect(client, defect));
			if (!client.ended || client.fibers.size > 0) return write;
			return ensuring(write, endClient(client));
		}
		const isStream = isStreamSchema(rpc.successSchema);
		const metadata = {
			rpc,
			client: client.serverClient,
			requestId: request.id,
			headers: request.headers,
			payload: request.payload
		};
		let handlerResult;
		let constructionFailed = false;
		try {
			handlerResult = entry.handler(request.payload, metadata);
		} catch (defect) {
			handlerResult = die$1(defect);
			constructionFailed = true;
		}
		const result = handlerResult;
		const isWrapper$1 = isWrapper(result);
		const isFork = isWrapper$1 && result.fork;
		const isUninterruptible = isWrapper$1 && result.uninterruptible;
		const streamOrEffect = isWrapper$1 ? result.value : result;
		let writeFailure;
		let handler = isStream && !constructionFailed ? streamEffect(client, request, streamOrEffect, (cause) => {
			writeFailure = cause;
		}) : streamOrEffect;
		if (isDiscard && !constructionFailed) handler = andThen(suspend(() => {
			const ack = respond(void_$1);
			acknowledged = true;
			return ack;
		}), handler);
		const withMiddleware = rpc.middlewares.size === 0 ? handler : isStream ? flatMap(exit(applyMiddleware(services, handler, metadata)), (exit) => writeFailure ? failCause(writeFailure) : exit) : applyMiddleware(services, handler, metadata);
		let responded = false;
		const scope = makeUnsafe$1();
		let deferred = void 0;
		let effect = onExit(withMiddleware, (exit) => {
			responded = true;
			let write;
			if (exit._tag === "Success") {
				if (isDeferred(exit.value)) {
					deferred = exit.value;
					write = void_;
				} else write = respond(exit);
			} else if (writeFailure) return closeUnsafe(scope, exit) ?? void_;
			else if (!disableFatalDefects && !isNotification && !isDiscard && hasDies(exit.cause) && !hasInterrupts(exit.cause)) write = sendDefect(client, squash(exit.cause));
			else write = respond(exit);
			const close = closeUnsafe(scope, exit);
			if (exit._tag === "Failure") reportCauseUnsafe(getCurrent(), exit.cause);
			return close ? ensuring(write, close) : write;
		});
		if (opts?.onRequest) effect = opts.onRequest(effect);
		if (enableTracing) {
			const parentSpan = getOrUndefined(requestFiber.context, ParentSpan);
			effect = withSpan(effect, spanName(spanPrefix, request.tag), {
				captureStackTrace: false,
				kind: "server",
				attributes: spanAttributes(request.tag, options.spanAttributes),
				parent: enableSpanPropagation && request.spanId ? externalSpan({
					traceId: request.traceId,
					spanId: request.spanId,
					sampled: request.sampled
				}) : void 0,
				links: enableSpanPropagation && parentSpan ? [{
					span: parentSpan,
					attributes: {}
				}] : void 0
			});
		}
		if (!isFork && concurrencySemaphore) effect = concurrencySemaphore.withPermit(effect);
		const runFork = runForkWith(add(handlerContext(entry, requestFiber.context), Scope, scope));
		trackFiber(runFork(withFiber((fiber) => {
			client.fibers.set(request.id, fiber);
			return effect;
		}), isUninterruptible ? { uninterruptible: true } : void 0)).addObserver(function onExit$1(exit) {
			if (deferred) {
				const fiber = trackFiber(runFork(onExit(_await(deferred), (exit) => {
					if (exit._tag === "Failure" && (isNotification || acknowledged)) reportCauseUnsafe(getCurrent(), exit.cause);
					return respond(exit);
				})));
				client.fibers.set(request.id, fiber);
				deferred = void 0;
				fiber.addObserver(onExit$1);
				return;
			}
			if (!responded && !isNotification && !acknowledged && exit._tag === "Failure") trackFiber(runFork(respond(interrupt$1())));
			client.fibers.delete(request.id);
			client.latches?.delete(request.id);
			if (client.ended && client.fibers.size === 0) trackFiber(runFork(endClient(client)));
		});
		return void_;
	};
	const streamEffect = (client, request, stream, onWriteFailure) => {
		const silent = request.isNotification === true || request.discard === true;
		const writeChunk = (values) => silent ? void_ : onError(options.onFromServer({
			_tag: "Chunk",
			clientId: client.id,
			requestId: request.id,
			values
		}), (cause) => {
			if (!hasInterruptsOnly(cause)) onWriteFailure(cause);
			return void_;
		});
		let latch;
		if (supportsAck && !silent) {
			client.latches ??= /* @__PURE__ */ new Map();
			latch = client.latches.get(request.id);
			if (!latch) {
				latch = makeUnsafe(false);
				client.latches.set(request.id, latch);
			}
		}
		if (isEffect(stream)) return stream.pipe(flatMap((queue) => whileLoop({
			while: constTrue,
			body: constant(flatMap(takeAll(queue), (values) => {
				const write = writeChunk(values);
				if (!latch) return write;
				latch.closeUnsafe();
				return flatMap(write, () => latch.await);
			})),
			step: constVoid
		})), catchDone(() => void_), scoped$1);
		return runForEachArray(stream, (values) => {
			const write = writeChunk(values);
			if (!latch) return write;
			latch.closeUnsafe();
			return andThen(write, latch.await);
		});
	};
	const sendDefect = (client, defect) => suspend(() => {
		const shouldEnd = client.ended && client.fibers.size === 0;
		const write = options.onFromServer({
			_tag: "Defect",
			clientId: client.id,
			defect
		});
		if (!shouldEnd) return write;
		return andThen(write, endClient(client));
	});
	return identity({
		write,
		disconnect
	});
});
var isSharedCodecFor = (codecFor) => codecFor === json$1.codecFor;
var sharedRpcCodecs = /*#__PURE__*/ new WeakMap();
var rpcCodecs = (codecFor, rpc) => {
	const shared = isSharedCodecFor(codecFor);
	let codecs = shared ? sharedRpcCodecs.get(rpc) : void 0;
	if (codecs === void 0) {
		const streamSchemas = getStreamSchemas(rpc.successSchema);
		const parseOptions = get(rpc.annotations, ParseOptions);
		codecs = {
			decode: decodeUnknownEffect(codecFor(rpc.payloadSchema), parseOptions),
			encodeChunk: encodeUnknownEffect(codecFor(NonEmptyArray(isSome(streamSchemas) ? streamSchemas.value.success : Any)), parseOptions),
			encodeExit: encodeUnknownEffect(codecFor(exitSchema(rpc)), parseOptions)
		};
		if (shared) sharedRpcCodecs.set(rpc, codecs);
	}
	return codecs;
};
var sharedDefectCodecs;
var makeDefectCodecs = (codecFor) => ({
	encodeDefectUnsafe: encodeSync(codecFor(Defect())),
	encodeUnknownRequestExit: encodeUnknownEffect(codecFor(Exit(Never, Never, Defect())))
});
var defectCodecs = (codecFor) => isSharedCodecFor(codecFor) ? sharedDefectCodecs ??= makeDefectCodecs(codecFor) : makeDefectCodecs(codecFor);
var handlerContextCache = /*#__PURE__*/ new WeakMap();
var handlerContext = (entry, fiberContext) => {
	let cache = handlerContextCache.get(entry);
	if (cache === void 0) {
		cache = /* @__PURE__ */ new WeakMap();
		handlerContextCache.set(entry, cache);
	}
	let merged = cache.get(fiberContext);
	if (merged === void 0) {
		merged = merge(entry.context, fiberContext);
		cache.set(fiberContext, merged);
	}
	return merged;
};
var applyMiddleware = (context, handler, options) => {
	for (const service of options.rpc.middlewares) handler = getUnsafe(context, service)(handler, options);
	return handler;
};
/**
* Runs an RPC server for a group using the current server `Protocol`, decoding
* requests, invoking handlers, encoding responses, and managing in-flight
* request lifetime.
*
* **Details**
*
* The server consumes `Protocol.disconnects` to interrupt a disconnected
* client's requests, so use the `onDisconnect` option to observe disconnects
* instead of taking from that queue.
*
* `onDisconnect` is called for each disconnect reported by the `Protocol`,
* after the server has requested interruption of that client's in-flight
* requests. It does not wait for those requests to finish. It is not called
* when a client ends its input normally, or for clients still connected when
* the server stops.
*
* Each callback runs in its own fiber, so a slow callback does not delay
* cleanup for other clients, and callbacks may run concurrently. Pending
* callbacks are interrupted when the server stops. Failures are ignored and
* logged at `References.UnhandledLogLevel`.
*
* @stability unstable
* @category running
* @since 4.0.0
*/
var make$7 = /*#__PURE__*/ fnUntraced(function* (group, options) {
	const { codecFor, disconnects, end, run, send, supportsAck, supportsSpanPropagation, supportsTransferables } = yield* Protocol;
	const { encodeDefectUnsafe, encodeUnknownRequestExit } = defectCodecs(codecFor);
	const services = yield* context();
	const scope = yield* make$10();
	const server = yield* makeNoSerialization(group, {
		...options,
		disableClientAcks: !supportsAck,
		disableSpanPropagation: !supportsSpanPropagation,
		onFromServer(response) {
			const client = clients.get(response.clientId);
			if (!client) return void_;
			switch (response._tag) {
				case "Chunk": {
					const schemas = client.schemas.get(response.requestId);
					if (!schemas) return void_;
					return handleEncode(client, response.requestId, schemas, schemas.encodeChunk(response.values), "Chunk");
				}
				case "Exit": {
					const schemas = client.schemas.get(response.requestId);
					if (!schemas) return void_;
					client.schemas.delete(response.requestId);
					return handleEncode(client, response.requestId, schemas, schemas.encodeExit(response.exit), "Exit");
				}
				case "Defect": return sendDefect(client, response.defect);
				case "ClientEnd":
					clients.delete(response.clientId);
					return end(response.clientId);
			}
		}
	}).pipe(provide(scope));
	const onDisconnect = options?.onDisconnect;
	const handleDisconnect = onDisconnect ? (clientId) => andThen(server.disconnect(clientId), ignoreCause(suspend(() => onDisconnect(clientId)), {
		log: "Unhandled",
		message: "RpcServer onDisconnect hook failed"
	}).pipe(forkIn(scope))) : server.disconnect;
	yield* forkChild(whileLoop({
		while: constTrue,
		body: constant(flatMap(take(disconnects), (clientId) => {
			clients.delete(clientId);
			return handleDisconnect(clientId);
		})),
		step: constVoid
	}));
	const schemasCache = /* @__PURE__ */ new WeakMap();
	const getSchemas = (rpc) => {
		let schemas = schemasCache.get(rpc);
		if (!schemas) {
			const entry = getOrUndefinedUnsafe(services, rpc.key);
			schemas = {
				tag: rpc._tag,
				...rpcCodecs(codecFor, rpc),
				context: entry.context
			};
			schemasCache.set(rpc, schemas);
		}
		return schemas;
	};
	const discardSchemasCache = /* @__PURE__ */ new WeakMap();
	const getDiscardSchemas = (rpc, schemas) => {
		let discardSchemas = discardSchemasCache.get(rpc);
		if (!discardSchemas) {
			const exitSchema$1 = exitSchema(rpc);
			discardSchemas = {
				...schemas,
				encodeExit: encodeUnknownEffect(codecFor(Exit(Void, exitSchema$1.error, exitSchema$1.defect)), get(rpc.annotations, ParseOptions))
			};
			discardSchemasCache.set(rpc, discardSchemas);
		}
		return discardSchemas;
	};
	const clients = /* @__PURE__ */ new Map();
	const responseEnvelope = (requestId, tag, value) => tag === "Chunk" ? {
		_tag: "Chunk",
		requestId,
		values: value
	} : {
		_tag: "Exit",
		requestId,
		exit: value
	};
	const handleEncode = (client, requestId, schemas, effect, tag) => {
		const collector = schemas.collector;
		let encodeFailed = false;
		const write = isExit(effect) && isSuccess(effect) ? send(client.id, responseEnvelope(requestId, tag, effect.value), collector && collector.clearUnsafe()) : flatMap(catch_(provideContext(collector ? provideService(effect, Collector, collector) : effect, schemas.context), (error) => withFiber((fiber) => {
			const defect = die$2(`Failed to encode response for RPC "${schemas.tag}": ${defaultFormatter(error.issue)}`);
			reportCauseUnsafe(fiber, defect);
			encodeFailed = true;
			return failCause(defect);
		})), (value) => send(client.id, responseEnvelope(requestId, tag, value), collector && collector.clearUnsafe()));
		return catchCause(write, (cause) => {
			client.schemas.delete(requestId);
			return andThen(sendRequestDefect(client, requestId, schemas.encodeExit, squash(cause)), encodeFailed ? failCause(cause) : server.write(client.id, {
				_tag: "Interrupt",
				requestId,
				interruptors: []
			}));
		});
	};
	const sendRequestDefect = (client, requestId, encodeExit, defect) => catchCause(flatMap(encodeExit(die(defect)), (exit) => send(client.id, responseEnvelope(requestId, "Exit", exit))), (cause) => sendDefect(client, squash(cause)));
	const sendDefect = (client, defect) => catchCause(send(client.id, ResponseDefectEncoded(encodeDefectUnsafe(defect))), (cause) => annotateLogs(logDebug(cause), {
		module: "RpcServer",
		method: "sendDefect"
	}));
	const dropNotification = (reason) => annotateLogs(logDebug(`Dropped RPC notification: ${reason}`), {
		module: "RpcServer",
		method: "dropNotification"
	});
	const writeDecodedRequest = (client, requestId, schemas, request, payload) => {
		if (request.isNotification !== true) client.schemas.set(requestId, supportsTransferables ? {
			...schemas,
			collector: makeCollectorUnsafe()
		} : schemas);
		const decoded = request;
		decoded.id = requestId;
		decoded.payload = payload;
		decoded.headers = fromInput(request.headers);
		return server.write(client.id, decoded);
	};
	let notificationCount = 0;
	return yield* run((clientId, request) => {
		let client = clients.get(clientId);
		if (!client) {
			client = {
				id: clientId,
				schemas: /* @__PURE__ */ new Map()
			};
			clients.set(clientId, client);
		}
		switch (request._tag) {
			case "Request": {
				const tag = Object.hasOwn(request, "tag") ? request.tag : "";
				const isNotification = request.isNotification === true;
				let requestId;
				if (isNotification) requestId = RequestId(`@effect/rpc/notification/${notificationCount++}`);
				else switch (typeof request.id) {
					case "number":
					case "string":
						requestId = RequestId(request.id);
						break;
					default: return sendDefect(client, `Invalid request id: ${request.id}`);
				}
				const rpc = group.requests.get(tag);
				if (!rpc) {
					const reason = `Unknown request tag: ${tag}`;
					return isNotification ? dropNotification(reason) : sendRequestDefect(client, requestId, encodeUnknownRequestExit, reason);
				}
				const schemas = getSchemas(rpc);
				const replySchemas = !isNotification && request.discard === true ? getDiscardSchemas(rpc, schemas) : schemas;
				const decoded = schemas.decode(request.payload);
				if (isExit(decoded) && isSuccess(decoded)) return writeDecodedRequest(client, requestId, replySchemas, request, decoded.value);
				return matchEffect(provideContext(decoded, schemas.context), {
					onFailure: (error) => {
						const reason = defaultFormatter(error.issue);
						return isNotification ? dropNotification(reason) : sendRequestDefect(client, requestId, replySchemas.encodeExit, reason);
					},
					onSuccess: (payload) => writeDecodedRequest(client, requestId, replySchemas, request, payload)
				});
			}
			case "Ping": return catchCause(send(client.id, constPong), (cause) => sendDefect(client, squash(cause)));
			case "Eof": return server.write(clientId, request);
			case "Ack": return server.write(clientId, request);
			case "Interrupt": return server.write(clientId, {
				...request,
				requestId: RequestId(request.requestId),
				interruptors: []
			});
			default: return sendDefect(client, `Unknown request tag: ${request._tag}`);
		}
	}).pipe(tapCause((cause) => logFatal("BUG: RpcServer protocol crashed", cause)), onExit((exit) => close$1(scope, exit)));
});
/**
* Provides a scoped layer that starts an RPC server for a group using the
* current server `Protocol`.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer$14 = (group, options) => effectDiscard(forkScoped(make$7(group, options)));
/**
* Defines the service interface for an RPC server transport, responsible for receiving
* encoded client messages, sending encoded responses, tracking clients, and
* declaring transport capabilities.
*
* **When to use**
*
* Use to provide the transport boundary for RPC servers over HTTP, WebSocket,
* workers, sockets, or custom protocols.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var Protocol = class extends Service$9()("effect/rpc/RpcServer/Protocol") {
	/**
	* Creates a server protocol service from the supplied RPC implementation.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	static make = /*#__PURE__*/ withRun();
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/rpc/RpcGroup.js
var RpcGroupProto = {
	add(...rpcs) {
		const requests = new Map(this.requests);
		for (const rpc of rpcs) requests.set(rpc._tag, rpc);
		return makeProto({
			requests,
			annotations: this.annotations
		});
	},
	merge(...groups) {
		const requests = new Map(this.requests);
		const annotations = new Map(this.annotations.mapUnsafe);
		for (const group of groups) {
			for (const [tag, rpc] of group.requests) requests.set(tag, rpc);
			for (const [key, value] of group.annotations.mapUnsafe) annotations.set(key, value);
		}
		return makeProto({
			requests,
			annotations: makeUnsafe$2(annotations)
		});
	},
	omit(...tags) {
		const requests = new Map(this.requests);
		for (const tag of tags) requests.delete(tag);
		return makeProto({
			requests,
			annotations: this.annotations
		});
	},
	middleware(middleware) {
		const requests = /* @__PURE__ */ new Map();
		for (const [tag, rpc] of this.requests) requests.set(tag, rpc.middleware(middleware));
		return makeProto({
			requests,
			annotations: this.annotations
		});
	},
	toHandlers(build) {
		const self = this;
		return gen(function* () {
			const services = yield* context();
			const handlers = isEffect(build) ? yield* build : build;
			const contextMap = /* @__PURE__ */ new Map();
			self.requests.forEach((rpc, tag) => {
				contextMap.set(rpc.key, {
					tag: rpc._tag,
					handler: handlers[tag],
					context: services
				});
			});
			return makeUnsafe$2(contextMap);
		});
	},
	prefix(prefix) {
		const requests = /* @__PURE__ */ new Map();
		for (const rpc of this.requests.values()) {
			const newRpc = rpc.prefix(prefix);
			requests.set(newRpc._tag, newRpc);
		}
		return makeProto({
			requests,
			annotations: this.annotations
		});
	},
	toLayer(build) {
		return effectContext(this.toHandlers(build));
	},
	of: identity,
	toLayerHandler(service, build) {
		const self = this;
		return effectContext(gen(function* () {
			const services = yield* context();
			const handler = isEffect(build) ? yield* build : build;
			const contextMap = /* @__PURE__ */ new Map();
			const rpc = self.requests.get(service);
			contextMap.set(rpc.key, {
				handler,
				context: services
			});
			return makeUnsafe$2(contextMap);
		}));
	},
	accessHandler(service) {
		return contextWith((parentContext) => {
			const rpc = this.requests.get(service);
			const { handler, context } = getOrUndefinedUnsafe(parentContext, rpc.key);
			return succeed((payload, options) => {
				options.rpc = rpc;
				const result = handler(payload, options);
				const effectOrStream = isWrapper(result) ? result.value : result;
				return isEffect(effectOrStream) ? provide$1(effectOrStream, context) : provideContext$1(effectOrStream, context);
			});
		});
	},
	annotate(service, value) {
		return makeProto({
			requests: this.requests,
			annotations: add(this.annotations, service, value)
		});
	},
	annotateRpcs(service, value) {
		return this.annotateRpcsMerge(make$11(service, value));
	},
	annotateMerge(context) {
		return makeProto({
			requests: this.requests,
			annotations: merge(this.annotations, context)
		});
	},
	annotateRpcsMerge(context) {
		const requests = /* @__PURE__ */ new Map();
		for (const [tag, rpc] of this.requests) requests.set(tag, rpc.annotateMerge(merge(context, rpc.annotations)));
		return makeProto({
			requests,
			annotations: this.annotations
		});
	}
};
var makeProto = (options) => Object.assign(function() {}, RpcGroupProto, {
	requests: options.requests,
	annotations: options.annotations
});
/**
* Creates an `RpcGroup` from one or more RPC definitions.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$6 = (...rpcs) => makeProto({
	requests: new Map(rpcs.map((rpc) => [rpc._tag, rpc])),
	annotations: empty()
});
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/NodeFileSystem.js
/**
* Shared Node-compatible implementation of Effect's `FileSystem` service.
*
* This module adapts Node's `node:fs`, `node:os`, and `node:path` APIs into a
* `FileSystem` layer for Effect programs running on Node-compatible runtimes.
* Platform packages use it to provide file and directory I/O, permissions,
* links, metadata, temporary files and directories, and file watching through
* the shared `FileSystem` service.
*
* @stability unstable
* @since 4.0.0
*/
var handleBadArgument = (method) => (err) => badArgument({
	module: "FileSystem",
	method,
	description: err.message ?? String(err)
});
var bigintToNumber = (value, field) => {
	const number = Number(value);
	if (!Number.isSafeInteger(number)) throw new RangeError(`${field} exceeds the safe integer range: ${value}`);
	return number;
};
var bigintToNumberOption = (value) => flatMap$1(fromNullishOr(value), toNumber);
var toUint64 = (value) => BigInt.asUintN(64, value);
var toUint64Option = (value) => map$1(fromNullishOr(value), toUint64);
var positionToNumber = (position, method) => try_({
	try: () => bigintToNumber(position, "position"),
	catch: handleBadArgument(method)
});
var access$1 = /*#__PURE__*/ (() => {
	const nodeAccess = /*#__PURE__*/ effectify(NFS.access, /*#__PURE__*/ handleErrnoException("FileSystem", "access"), /*#__PURE__*/ handleBadArgument("access"));
	return (path, options) => {
		let mode = NFS.constants.F_OK;
		if (options?.readable) mode |= NFS.constants.R_OK;
		if (options?.writable) mode |= NFS.constants.W_OK;
		return nodeAccess(path, mode);
	};
})();
var copy = /*#__PURE__*/ (() => {
	const nodeCp = /*#__PURE__*/ effectify(NFS.cp, /*#__PURE__*/ handleErrnoException("FileSystem", "copy"), /*#__PURE__*/ handleBadArgument("copy"));
	return (fromPath, toPath, options) => nodeCp(fromPath, toPath, {
		force: options?.overwrite ?? false,
		preserveTimestamps: options?.preserveTimestamps ?? false,
		recursive: true
	});
})();
var copyFile$1 = /*#__PURE__*/ (() => {
	const nodeCopyFile = /*#__PURE__*/ effectify(NFS.copyFile, /*#__PURE__*/ handleErrnoException("FileSystem", "copyFile"), /*#__PURE__*/ handleBadArgument("copyFile"));
	return (fromPath, toPath) => nodeCopyFile(fromPath, toPath);
})();
var chmod = /*#__PURE__*/ (() => {
	const nodeChmod = /*#__PURE__*/ effectify(NFS.chmod, /*#__PURE__*/ handleErrnoException("FileSystem", "chmod"), /*#__PURE__*/ handleBadArgument("chmod"));
	return (path, mode) => nodeChmod(path, mode);
})();
var chown = /*#__PURE__*/ (() => {
	const nodeChown = /*#__PURE__*/ effectify(NFS.chown, /*#__PURE__*/ handleErrnoException("FileSystem", "chown"), /*#__PURE__*/ handleBadArgument("chown"));
	return (path, uid, gid) => nodeChown(path, uid, gid);
})();
var link = /*#__PURE__*/ (() => {
	const nodeLink = /*#__PURE__*/ effectify(NFS.link, /*#__PURE__*/ handleErrnoException("FileSystem", "link"), /*#__PURE__*/ handleBadArgument("link"));
	return (existingPath, newPath) => nodeLink(existingPath, newPath);
})();
var makeDirectory = /*#__PURE__*/ (() => {
	const nodeMkdir = /*#__PURE__*/ effectify(NFS.mkdir, /*#__PURE__*/ handleErrnoException("FileSystem", "makeDirectory"), /*#__PURE__*/ handleBadArgument("makeDirectory"));
	return (path, options) => nodeMkdir(path, {
		recursive: options?.recursive ?? false,
		mode: options?.mode
	});
})();
var makeTempDirectoryFactory = (method) => {
	const nodeMkdtemp = effectify(NFS.mkdtemp, handleErrnoException("FileSystem", method), handleBadArgument(method));
	return (options) => suspend(() => {
		const prefix = options?.prefix ?? "";
		const directory = typeof options?.directory === "string" ? Path.join(options.directory, ".") : OS.tmpdir();
		return nodeMkdtemp(prefix ? Path.join(directory, prefix) : directory + "/");
	});
};
var makeTempDirectory = /*#__PURE__*/ makeTempDirectoryFactory("makeTempDirectory");
var removeFactory = (method) => {
	const nodeRm = effectify(NFS.rm, handleErrnoException("FileSystem", method), handleBadArgument(method));
	return (path, options) => nodeRm(path, {
		recursive: options?.recursive ?? false,
		force: options?.force ?? false
	});
};
var remove = /*#__PURE__*/ removeFactory("remove");
var makeTempDirectoryScoped = /*#__PURE__*/ (() => {
	const makeDirectory = /*#__PURE__*/ makeTempDirectoryFactory("makeTempDirectoryScoped");
	const removeDirectory = /*#__PURE__*/ removeFactory("makeTempDirectoryScoped");
	return (options) => acquireRelease(makeDirectory(options), (directory) => orDie(removeDirectory(directory, {
		recursive: true,
		force: true
	})));
})();
var openFlagBits = (flag) => {
	const { O_APPEND, O_CREAT, O_EXCL, O_RDONLY, O_RDWR, O_TRUNC, O_WRONLY } = NFS.constants;
	switch (flag) {
		case "r": return O_RDONLY;
		case "r+": return O_RDWR;
		case "w": return O_TRUNC | O_CREAT | O_WRONLY;
		case "wx": return O_TRUNC | O_CREAT | O_WRONLY | O_EXCL;
		case "w+": return O_TRUNC | O_CREAT | O_RDWR;
		case "wx+": return O_TRUNC | O_CREAT | O_RDWR | O_EXCL;
		case "a": return O_APPEND | O_CREAT | O_WRONLY;
		case "ax": return O_APPEND | O_CREAT | O_WRONLY | O_EXCL;
		case "a+": return O_APPEND | O_CREAT | O_RDWR;
		case "ax+": return O_APPEND | O_CREAT | O_RDWR | O_EXCL;
	}
};
var noFollowFlags = (method, flag) => suspend(() => {
	const { O_NOFOLLOW } = NFS.constants;
	if (process.platform === "win32" || typeof O_NOFOLLOW !== "number" || O_NOFOLLOW === 0) return fail(badArgument({
		module: "FileSystem",
		method,
		description: "noFollow is not supported on this platform"
	}));
	return succeed(openFlagBits(flag) | O_NOFOLLOW);
});
var openFactory = (method) => {
	const nodeOpen = effectify(NFS.open, handleErrnoException("FileSystem", method), handleBadArgument(method));
	const nodeClose = effectify(NFS.close, handleErrnoException("FileSystem", method), handleBadArgument(method));
	return (path, options) => pipe(acquireRelease(options?.noFollow === true ? flatMap(noFollowFlags(method, options.flag ?? "r"), (flags) => nodeOpen(path, flags, options.mode)) : nodeOpen(path, options?.flag ?? "r", options?.mode), (fd) => orDie(nodeClose(fd))), map((fd) => makeFile(fd, options?.flag?.startsWith("a") ?? false)));
};
var open$1 = /*#__PURE__*/ openFactory("open");
var negativePosition = (method) => badArgument({
	module: "FileSystem",
	method,
	description: "Cannot read before the start of the file"
});
var makeFile = /*#__PURE__*/ (() => {
	const nodeReadFactory = (method) => effectify(NFS.read, handleErrnoException("FileSystem", method), handleBadArgument(method));
	const nodeRead = /*#__PURE__*/ nodeReadFactory("read");
	const nodeReadAlloc = /*#__PURE__*/ nodeReadFactory("readAlloc");
	const nodeStat = /*#__PURE__*/ effectify(NFS.fstat, /*#__PURE__*/ handleErrnoException("FileSystem", "stat"), /*#__PURE__*/ handleBadArgument("stat"));
	const nodeTruncate = /*#__PURE__*/ effectify(NFS.ftruncate, /*#__PURE__*/ handleErrnoException("FileSystem", "truncate"), /*#__PURE__*/ handleBadArgument("truncate"));
	const nodeSync = /*#__PURE__*/ effectify(NFS.fsync, /*#__PURE__*/ handleErrnoException("FileSystem", "sync"), /*#__PURE__*/ handleBadArgument("sync"));
	const nodeWriteFactory = (method) => effectify(NFS.write, handleErrnoException("FileSystem", method), handleBadArgument(method));
	const nodeWrite = /*#__PURE__*/ nodeWriteFactory("write");
	const nodeWriteAll = /*#__PURE__*/ nodeWriteFactory("writeAll");
	class FileImpl {
		[FileTypeId];
		fd;
		append;
		position = /*#__PURE__*/ BigInt(0);
		constructor(fd, append) {
			this[FileTypeId] = FileTypeId;
			this.fd = fd;
			this.append = append;
		}
		get stat() {
			return flatMap(nodeStat(this.fd, { bigint: true }), makeFileInfo);
		}
		get sync() {
			return nodeSync(this.fd);
		}
		seek(offset, from) {
			return suspend(() => {
				const position = from === "start" ? offset : this.position + offset;
				if (position < BigInt(0)) return fail(badArgument({
					module: "FileSystem",
					method: "seek",
					description: "Cannot seek before the start of the file"
				}));
				this.position = position;
				return succeed(position);
			});
		}
		read(buffer, options) {
			return suspend(() => {
				const explicit = options?.position;
				if (explicit !== void 0) return explicit < BigInt(0) ? fail(negativePosition("read")) : nodeRead(this.fd, {
					buffer,
					position: explicit
				});
				const position = this.position;
				return map(nodeRead(this.fd, {
					buffer,
					position
				}), (bytesRead) => {
					this.position = position + BigInt(bytesRead);
					return bytesRead;
				});
			});
		}
		readAlloc(size, options) {
			return suspend(() => {
				try {
					if (!Number.isInteger(size) || size < 0) throw new RangeError("size must be a non-negative integer");
					const explicit = options?.position;
					if (explicit !== void 0 && explicit < BigInt(0)) return fail(negativePosition("readAlloc"));
					const buffer = Buffer.allocUnsafeSlow(size);
					const position = explicit ?? this.position;
					return map(nodeReadAlloc(this.fd, {
						buffer,
						position
					}), (bytesRead) => {
						if (bytesRead === 0) return none();
						if (explicit === void 0) this.position = position + BigInt(bytesRead);
						if (bytesRead === size) return some(buffer);
						const dst = Buffer.allocUnsafeSlow(bytesRead);
						buffer.copy(dst, 0, 0, bytesRead);
						return some(dst);
					});
				} catch (cause) {
					return fail(handleBadArgument("readAlloc")(cause));
				}
			});
		}
		truncate(length) {
			return map(nodeTruncate(this.fd, length || void 0), () => {
				if (!this.append) {
					const len = BigInt(length ?? 0);
					if (this.position > len) this.position = len;
				}
			});
		}
		write(buffer) {
			return suspend(() => {
				const position = this.position;
				return flatMap(this.append ? succeed(void 0) : positionToNumber(position, "write"), (nodePosition) => map(nodeWrite(this.fd, buffer, void 0, void 0, nodePosition), (bytesWritten) => {
					if (!this.append) this.position = position + BigInt(bytesWritten);
					return bytesWritten;
				}));
			});
		}
		writeAllChunk(buffer) {
			return suspend(() => {
				const position = this.position;
				return flatMap(this.append ? succeed(void 0) : positionToNumber(position, "writeAll"), (nodePosition) => flatMap(nodeWriteAll(this.fd, buffer, void 0, void 0, nodePosition), (bytesWritten) => {
					if (bytesWritten === 0) return fail(systemError({
						module: "FileSystem",
						method: "writeAll",
						_tag: "WriteZero",
						pathOrDescriptor: this.fd,
						description: "write returned 0 bytes written"
					}));
					if (!this.append) this.position = position + BigInt(bytesWritten);
					return bytesWritten < buffer.length ? this.writeAllChunk(buffer.subarray(bytesWritten)) : void_;
				}));
			});
		}
		writeAll(buffer) {
			return buffer.length === 0 ? void_ : this.writeAllChunk(buffer);
		}
	}
	return (fd, append) => new FileImpl(fd, append);
})();
var makeTempFileFactory = (method) => {
	const makeDirectory = makeTempDirectoryFactory(method);
	return fnUntraced(function* (options) {
		const directory = yield* makeDirectory(options);
		const random = Crypto.randomBytes(6).toString("hex");
		const name = Path.join(directory, options?.suffix ? `${random}${options.suffix}` : random);
		yield* writeFile$1(name, /* @__PURE__ */ new Uint8Array(0));
		return name;
	});
};
var makeTempFile = /*#__PURE__*/ makeTempFileFactory("makeTempFile");
var makeTempFileScoped = /*#__PURE__*/ (() => {
	const makeFile = /*#__PURE__*/ makeTempFileFactory("makeTempFileScoped");
	const removeDirectory = /*#__PURE__*/ removeFactory("makeTempFileScoped");
	return (options) => acquireRelease(makeFile(options), (file) => orDie(removeDirectory(Path.dirname(file), {
		recursive: true,
		force: true
	})));
})();
var readDirectory = (path, options) => tryPromise({
	try: () => NFS.promises.readdir(path, options),
	catch: (err) => handleErrnoException("FileSystem", "readDirectory")(err, [path])
});
var readDirectoryEntries = (path) => tryPromise({
	try: () => NFS.promises.readdir(path, { withFileTypes: true }),
	catch: (err) => handleErrnoException("FileSystem", "readDirectoryEntries")(err, [path])
}).pipe(map((entries) => entries.map((entry) => ({
	name: entry.name,
	type: fileType(entry)
}))));
var readFile$1 = (path) => callback((resume, signal) => {
	try {
		NFS.readFile(path, { signal }, (err, data) => {
			if (err) resume(fail(handleErrnoException("FileSystem", "readFile")(err, [path])));
			else resume(succeed(data));
		});
	} catch (err) {
		resume(fail(handleBadArgument("readFile")(err)));
	}
});
var readLink = /*#__PURE__*/ (() => {
	const nodeReadLink = /*#__PURE__*/ effectify(NFS.readlink, /*#__PURE__*/ handleErrnoException("FileSystem", "readLink"), /*#__PURE__*/ handleBadArgument("readLink"));
	return (path) => nodeReadLink(path);
})();
var realPath = /*#__PURE__*/ (() => {
	const nodeRealPath = /*#__PURE__*/ effectify(process.platform === "win32" ? NFS.realpath.native : NFS.realpath, /*#__PURE__*/ handleErrnoException("FileSystem", "realPath"), /*#__PURE__*/ handleBadArgument("realPath"));
	return (path) => nodeRealPath(path);
})();
var rename$1 = /*#__PURE__*/ (() => {
	const nodeRename = /*#__PURE__*/ effectify(NFS.rename, /*#__PURE__*/ handleErrnoException("FileSystem", "rename"), /*#__PURE__*/ handleBadArgument("rename"));
	return (oldPath, newPath) => nodeRename(oldPath, newPath);
})();
var fileType = (stat) => stat.isFile() ? "File" : stat.isDirectory() ? "Directory" : stat.isSymbolicLink() ? "SymbolicLink" : stat.isBlockDevice() ? "BlockDevice" : stat.isCharacterDevice() ? "CharacterDevice" : stat.isFIFO() ? "FIFO" : stat.isSocket() ? "Socket" : "Unknown";
var makeFileInfo = (stat, method = "stat") => try_({
	try: () => ({
		type: fileType(stat),
		mtime: fromNullishOr(stat.mtime),
		atime: fromNullishOr(stat.atime),
		birthtime: fromNullishOr(stat.birthtime),
		dev: toUint64(stat.dev),
		rdev: toUint64Option(stat.rdev),
		ino: toUint64Option(stat.ino),
		mode: bigintToNumber(stat.mode, "mode"),
		nlink: toUint64Option(stat.nlink),
		uid: bigintToNumberOption(stat.uid),
		gid: bigintToNumberOption(stat.gid),
		size: bytes(stat.size),
		blksize: stat.blksize !== void 0 ? some(bytes(stat.blksize)) : none(),
		blocks: fromNullishOr(stat.blocks)
	}),
	catch: handleBadArgument(method)
});
var statFactory = (method, nodeStatFn) => {
	const nodeStat = effectify(nodeStatFn, handleErrnoException("FileSystem", method), handleBadArgument(method));
	return (path) => flatMap(nodeStat(path, { bigint: true }), (stat) => makeFileInfo(stat, method));
};
var stat$1 = /*#__PURE__*/ statFactory("stat", NFS.stat);
var lstat = /*#__PURE__*/ statFactory("lstat", NFS.lstat);
var symlink = /*#__PURE__*/ (() => {
	const nodeSymlink = /*#__PURE__*/ effectify(NFS.symlink, /*#__PURE__*/ handleErrnoException("FileSystem", "symlink"), /*#__PURE__*/ handleBadArgument("symlink"));
	return (target, path) => nodeSymlink(target, path);
})();
var truncate = /*#__PURE__*/ (() => {
	const nodeTruncate = /*#__PURE__*/ effectify(NFS.truncate, /*#__PURE__*/ handleErrnoException("FileSystem", "truncate"), /*#__PURE__*/ handleBadArgument("truncate"));
	return (path, length) => nodeTruncate(path, length);
})();
var utimes = /*#__PURE__*/ (() => {
	const nodeUtimes = /*#__PURE__*/ effectify(NFS.utimes, /*#__PURE__*/ handleErrnoException("FileSystem", "utime"), /*#__PURE__*/ handleBadArgument("utime"));
	return (path, atime, mtime) => nodeUtimes(path, atime, mtime);
})();
var watchNode = (path, info, options) => callback$1((queue) => acquireRelease(sync(() => {
	const directory = info.type === "Directory" ? path : Path.dirname(path);
	const watcher = NFS.watch(path, { recursive: options?.recursive ?? false }, (event, path) => {
		if (!path) return;
		switch (event) {
			case "rename":
				runFork(matchEffect(stat$1(Path.resolve(directory, path)), {
					onSuccess: (_) => offer(queue, {
						_tag: "Create",
						path
					}),
					onFailure: (_) => offer(queue, {
						_tag: "Remove",
						path
					})
				}));
				return;
			case "change":
				offerUnsafe(queue, {
					_tag: "Update",
					path
				});
				return;
		}
	});
	watcher.on("error", (error) => {
		failCauseUnsafe(queue, fail$1(systemError({
			module: "FileSystem",
			_tag: "Unknown",
			method: "watch",
			pathOrDescriptor: path,
			cause: error
		})));
	});
	watcher.on("close", () => {
		endUnsafe(queue);
	});
	return watcher;
}), (watcher) => sync(() => watcher.close())).pipe(tap(() => sync(() => options?.onReady?.()))));
var watch = (backend, path, options) => all([stat$1(path), serviceOption(WatchBackend)]).pipe(map(([stat, callerBackend]) => orElse(callerBackend, () => backend).pipe(flatMap$1((_) => _.register(path, stat, options)), getOrElse(() => watchNode(path, stat, options)))), unwrap$1);
var writeFile$1 = (path, data, options) => callback((resume, signal) => {
	try {
		NFS.writeFile(path, data, {
			signal,
			flag: options?.flag,
			mode: options?.mode
		}, (err) => {
			if (err) resume(fail(handleErrnoException("FileSystem", "writeFile")(err, [path])));
			else resume(void_);
		});
	} catch (err) {
		resume(fail(handleBadArgument("writeFile")(err)));
	}
});
var makeFileSystem = /*#__PURE__*/ map(/*#__PURE__*/ serviceOption(WatchBackend), (backend) => make$13({
	access: access$1,
	chmod,
	chown,
	copy,
	copyFile: copyFile$1,
	link,
	lstat,
	makeDirectory,
	makeTempDirectory,
	makeTempDirectoryScoped,
	makeTempFile,
	makeTempFileScoped,
	open: open$1,
	readDirectory,
	readDirectoryEntries,
	readFile: readFile$1,
	readLink,
	realPath,
	remove,
	rename: rename$1,
	stat: stat$1,
	symlink,
	truncate,
	utimes,
	watch(path, options) {
		return watch(backend, path, options);
	},
	writeFile: writeFile$1
}));
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/NodeFileSystem.js
/**
* Node.js `FileSystem` layer for programs that perform real filesystem I/O.
*
* The exported layer satisfies the platform-independent `FileSystem` service
* with Node-backed operations for files, directories, metadata, permissions,
* links, temporary paths, and path watching. Effects still call the service from
* `effect/FileSystem`; this module only chooses the Node implementation.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Provides the `FileSystem` service backed by Node filesystem APIs.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer$12 = /* @__PURE__ */ effect(FileSystem)(makeFileSystem);
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/NodePath.js
/**
* Node-backed provider for Effect's `Path` service.
*
* This module turns Node's `node:path` and `node:url` APIs into `Path` layers.
* `layer` uses the host platform path implementation, while `layerPosix` and
* `layerWin32` provide fixed POSIX and Windows variants. All three layers also
* include helpers for converting between file paths and file URLs.
*
* @stability unstable
* @since 4.0.0
*/
var fileUrlOps = (windows) => ({
	fromFileUrl: (url) => try_({
		try: () => NodeUrl.fileURLToPath(url, { windows }),
		catch: (cause) => new BadArgument({
			module: "Path",
			method: "fromFileUrl",
			cause
		})
	}),
	toFileUrl: (path) => try_({
		try: () => NodeUrl.pathToFileURL(path, { windows }),
		catch: (cause) => new BadArgument({
			module: "Path",
			method: "toFileUrl",
			cause
		})
	})
});
({
	...Path.posix,
	.../*#__PURE__*/ fileUrlOps(false)
});
({
	...Path.win32,
	.../*#__PURE__*/ fileUrlOps(true)
});
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/NodePath.js
/**
* Node.js layers for Effect's `Path` service.
*
* This module provides the default, POSIX, and Windows variants of the
* platform-independent `Path` service by reusing the shared Node path
* implementation. The provided path services include Node file URL conversion
* behavior.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Provides the default Node `Path` service using the platform's `node:path`
* implementation.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer$10 = /* @__PURE__ */ succeed$1(Path$1)(/*#__PURE__*/ make$14({
	...Path,
	.../*#__PURE__*/ fileUrlOps(void 0)
}));
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/NodeRuntime.js
/**
* Node.js process runner for Effect programs.
*
* This module exports `runMain`, which runs one Effect as the main process
* fiber in Node.js. It reuses the shared Node runtime runner, including its
* error reporting, `SIGINT` / `SIGTERM` interruption, and optional teardown
* behavior.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Helps you run a main effect with built-in error handling, logging, and signal management.
*
* **When to use**
*
* Use to run a Node.js application's main Effect with structured error
* handling, log management, interrupt support, or advanced teardown
* capabilities.
*
* **Details**
*
* This function launches an Effect as the main entry point, setting exit codes
* based on success or failure, handling interrupts (e.g., Ctrl+C), and optionally
* logging errors. By default, it logs errors and uses a "pretty" format, but both
* behaviors can be turned off. You can also provide custom teardown logic to
* finalize resources or produce different exit codes.
*
* The optional configuration object can include:
* - `disableErrorReporting`: Turn off automatic error logging.
* - `teardown`: Provide custom finalization logic.
*
* @stability unstable
* @category running
* @since 4.0.0
*/
var runMain = /* @__PURE__ */ makeRunMain(({ fiber, teardown }) => {
	let receivedSignal = false;
	fiber.addObserver((exit) => {
		process.removeListener("SIGINT", onSigint);
		process.removeListener("SIGTERM", onSigint);
		teardown(exit, (code) => {
			if (receivedSignal || code !== 0) process.exit(code);
		});
	});
	function onSigint() {
		receivedSignal = true;
		fiber.interruptUnsafe(fiber.id);
	}
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigint);
});
//#endregion
//#region src/shared/ipc-rpc/plugins.ts
var text$1 = (maximum) => String$1.check(isMinLength(1), isMaxLength(maximum));
var id = text$1(256);
var PluginPayload = declare((_) => true, { toCodecJson: () => void 0 });
var PluginErrorCode = Literals([
	"unavailable",
	"method",
	"input",
	"output",
	"failed",
	"notFound",
	"builtin"
]);
var PluginFailure = Struct({
	code: PluginErrorCode,
	message: optionalKey(String$1)
});
var channel = Finite.check(isBetween({
	minimum: 0,
	maximum: 255
}));
var rgba = Tuple([
	channel,
	channel,
	channel,
	channel
]);
var PluginLayout = Struct({
	visible: Boolean,
	bounds: optionalKey(Struct({
		x: Finite,
		y: Finite,
		width: Finite,
		height: Finite
	})),
	viewport: optionalKey(Struct({
		width: Finite,
		height: Finite
	})),
	background: optionalKey(rgba),
	radius: optionalKey(Finite.check(isBetween({
		minimum: 0,
		maximum: 100
	}))),
	border: optionalKey(Struct({
		color: rgba,
		width: Finite.check(isBetween({
			minimum: 0,
			maximum: 10
		}))
	}))
});
var PluginEndpoint = Struct({
	id: text$1(16384),
	url: text$1(16384),
	password: optionalKey(String$1.check(isMaxLength(4096)))
});
var PluginInstalled = Struct({
	id: String$1,
	builtin: Boolean,
	enabled: Boolean,
	error: optionalKey(String$1),
	server: optionalKey(Boolean),
	tui: optionalKey(Boolean),
	unsupported: optionalKey(Boolean)
});
var PluginGuis = Struct({
	plugins: ArraySchema(Struct({
		id,
		revision: text$1(256),
		code: String$1,
		options: Record(String$1, Json)
	})),
	reserved: ArraySchema(id)
});
var PluginMenubarItem = Struct({
	menu: String$1,
	id: String$1,
	label: String$1,
	after: optionalKey(String$1),
	enabled: Boolean
});
var PluginRpcs = make$6(make$8("PluginCall", {
	payload: {
		ipc: id,
		method: id,
		input: optionalKey(PluginPayload)
	},
	success: PluginPayload,
	error: PluginFailure
}), make$8("PluginSubscribe", {
	payload: { ipc: id },
	success: Struct({
		available: Boolean,
		state: optionalKey(PluginPayload)
	})
}), make$8("PluginEmbed", { payload: {
	id,
	layout: optionalKey(PluginLayout)
} }), make$8("PluginCapture", {
	payload: { id },
	success: NullOr(Uint8Array$1)
}), make$8("PluginMenubarItem", { payload: { id } }), make$8("PluginMenubarItems", { success: ArraySchema(PluginMenubarItem) }), make$8("PluginConfigure", { payload: { servers: ArraySchema(PluginEndpoint) } }), make$8("PluginGuis", { success: PluginGuis }), make$8("PluginList", { success: ArraySchema(PluginInstalled) }), make$8("PluginEnable", {
	payload: { id },
	error: PluginFailure
}), make$8("PluginDisable", {
	payload: { id },
	error: PluginFailure
}), make$8("PluginReload", {
	payload: { id },
	error: PluginFailure
}));
//#endregion
//#region src/shared/ipc-rpc/events.ts
var DeepLinksOpened = class extends TaggedClass()("DeepLinksOpened", {
	attempt: Number$1,
	urls: ArraySchema(String$1)
}) {};
var MenuCommandTriggered = class extends TaggedClass()("MenuCommandTriggered", { id: String$1 }) {};
var WindowFullscreenChanged = class extends TaggedClass()("WindowFullscreenChanged", { fullscreen: Boolean }) {};
var WindowFocusChanged = class extends TaggedClass()("WindowFocusChanged", { focused: Boolean }) {};
var WindowPinchZoomChanged = class extends TaggedClass()("WindowPinchZoomChanged", { enabled: Boolean }) {};
var WindowZoomChanged = class extends TaggedClass()("WindowZoomChanged", {
	factor: Number$1,
	level: Literals(desktopZoomLevels)
}) {};
var StorageChanged = class extends TaggedClass()("StorageChanged", {
	name: String$1,
	insert: Record(String$1, String$1),
	remove: ArraySchema(String$1),
	revision: Number$1
}) {};
var PluginState = class extends TaggedClass()("PluginState", {
	ipc: String$1,
	state: PluginPayload
}) {};
var PluginEvent = class extends TaggedClass()("PluginEvent", {
	ipc: String$1,
	name: String$1,
	data: PluginPayload
}) {};
var PluginAvailable = class extends TaggedClass()("PluginAvailable", {
	ipc: String$1,
	available: Boolean
}) {};
var PluginsChanged = class extends TaggedClass()("PluginsChanged", { list: ArraySchema(PluginInstalled) }) {};
var PluginGuisChanged = class extends TaggedClass()("PluginGuisChanged", PluginGuis.fields) {};
var PluginMenubarItemsChanged = class extends TaggedClass()("PluginMenubarItemsChanged", { items: ArraySchema(PluginMenubarItem) }) {};
var SidecarChanged = class extends TaggedClass()("SidecarChanged", { url: String$1 }) {};
var EventRpcs = make$6(make$8("DesktopEvents", {
	success: Union([
		DeepLinksOpened,
		SidecarChanged,
		MenuCommandTriggered,
		WindowFullscreenChanged,
		WindowFocusChanged,
		WindowPinchZoomChanged,
		WindowZoomChanged,
		StorageChanged,
		PluginState,
		PluginEvent,
		PluginAvailable,
		PluginsChanged,
		PluginGuisChanged,
		PluginMenubarItemsChanged
	]),
	stream: true
}));
//#endregion
//#region src/main/ipc-events.ts
var sink;
function setIpcEventSink(next) {
	sink = next;
	return () => {
		if (sink === next) sink = void 0;
	};
}
/** Returns false when the renderer has no event stream to receive the event, now or once its document binds. */
function emitIpcEvent(sender, event) {
	return sink ? sink(sender, event) : false;
}
//#endregion
//#region src/main/native/logging-machine.ts
var NETLOG_TIMEOUT_MS = 5e3;
var EXPORT_ARCHIVE_TIMEOUT_MS = 6e4;
var DISPOSED_ERROR$1 = /* @__PURE__ */ new Error("Desktop logging is disposed");
function initialLoggingState() {
	return {
		status: "idle",
		attempt: 0,
		netLog: "off",
		netLogPath: void 0
	};
}
function transitionLogging(state, event) {
	if (state.status === "disposed") {
		if (event.type === "export.requested") return unchanged$11(state, [{
			type: "reject-export",
			replies: [event.reply],
			error: DISPOSED_ERROR$1
		}]);
		return unchanged$11(state);
	}
	if (event.type === "disposed") return {
		state: { status: "disposed" },
		commands: state.status === "idle" || state.exports.length === 0 ? [] : [{
			type: "reject-export",
			replies: state.exports,
			error: DISPOSED_ERROR$1
		}]
	};
	if (state.status === "idle") return idle$2(state, event);
	if (event.type === "network.requested") return state.status === "archiving" && !state.resumeNetLog ? {
		state: {
			...state,
			resumeNetLog: true
		},
		commands: []
	} : unchanged$11(state);
	if (event.type === "export.requested") return {
		state: {
			...state,
			exports: [...state.exports, event.reply]
		},
		commands: []
	};
	if (event.type === "export.cancelled") return state.exports.includes(event.reply) ? {
		state: {
			...state,
			exports: state.exports.filter((reply) => reply !== event.reply)
		},
		commands: []
	} : unchanged$11(state);
	if (event.attempt !== state.attempt) return unchanged$11(state);
	if (state.status === "starting-netlog" && (event.type === "netlog.started" || event.type === "netlog.start-failed")) {
		const netLogPath = event.type === "netlog.started" ? event.path : state.netLogPath;
		if (state.exports.length === 0) return {
			state: {
				status: "idle",
				attempt: state.attempt,
				netLog: event.type === "netlog.started" ? "active" : "off",
				netLogPath
			},
			commands: []
		};
		if (event.type === "netlog.started") return stop$1(state.attempt + 1, netLogPath, state.exports);
		return archive(state.attempt + 1, false, netLogPath, state.exports);
	}
	if (state.status === "stopping-netlog" && event.type === "netlog.stopped") return archive(state.attempt + 1, true, state.netLogPath, state.exports);
	if (state.status === "archiving" && (event.type === "archive.succeeded" || event.type === "archive.failed")) {
		const settle = event.type === "archive.succeeded" ? {
			type: "resolve-export",
			replies: state.exports,
			output: event.output
		} : {
			type: "reject-export",
			replies: state.exports,
			error: event.error
		};
		if (!state.resumeNetLog) return {
			state: {
				status: "idle",
				attempt: state.attempt,
				netLog: "off",
				netLogPath: state.netLogPath
			},
			commands: [settle]
		};
		return {
			state: {
				status: "starting-netlog",
				attempt: state.attempt + 1,
				netLogPath: state.netLogPath,
				exports: []
			},
			commands: [settle, {
				type: "start-netlog",
				attempt: state.attempt + 1,
				mode: "restart"
			}]
		};
	}
	return unchanged$11(state);
}
function idle$2(state, event) {
	if (event.type === "network.requested") {
		if (state.netLog === "active") return unchanged$11(state);
		const attempt = state.attempt + 1;
		return {
			state: {
				status: "starting-netlog",
				attempt,
				netLogPath: state.netLogPath,
				exports: []
			},
			commands: [{
				type: "start-netlog",
				attempt,
				mode: "start"
			}]
		};
	}
	if (event.type !== "export.requested") return unchanged$11(state);
	if (state.netLog === "active") return stop$1(state.attempt + 1, state.netLogPath, [event.reply]);
	return archive(state.attempt + 1, false, state.netLogPath, [event.reply]);
}
function stop$1(attempt, netLogPath, exports) {
	return {
		state: {
			status: "stopping-netlog",
			attempt,
			netLogPath,
			exports
		},
		commands: [{
			type: "stop-netlog",
			attempt
		}]
	};
}
function archive(attempt, resumeNetLog, netLogPath, exports) {
	return {
		state: {
			status: "archiving",
			attempt,
			resumeNetLog,
			netLogPath,
			exports
		},
		commands: [{
			type: "write-archive",
			attempt,
			netLogPath
		}]
	};
}
function unchanged$11(state, commands = []) {
	return {
		state,
		commands
	};
}
//#endregion
//#region src/main/native/logging.ts
var EXPORT_WINDOW = 864e5;
var MAX_EXPORT_FILE_SIZE = 52428800;
var NET_LOG_SIZE = 20971520;
var root = "";
var run$2 = "";
var Service$8 = class extends Service$9()("opencode/desktop/DesktopLogging") {};
var serviceLayer = effect(Service$8, gen(function* () {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	yield* initLogging(fs, path).pipe(orDie);
	yield* forkScoped(cleanup(fs, path).pipe(catch_(() => void_)));
	marks.logging = Date.now();
	yield* logInfo("app starting", {
		version: VERSION,
		packaged: app.isPackaged,
		onboardingTest: process.env.OPENCODE_TEST_ONBOARDING === "1",
		marks
	});
	const fibers = yield* make$15();
	const runFiber = yield* runtime$1(fibers)();
	const current = { state: initialLoggingState() };
	const dispatch = (event) => {
		const next = transitionLogging(current.state, event);
		current.state = next.state;
		next.commands.forEach(perform);
	};
	const report = (effect, failed) => void runFiber(effect.pipe(exit, flatMap((exit) => {
		if (isSuccess(exit)) return sync(() => dispatch(exit.value));
		if (hasInterruptsOnly(exit.cause)) return void_;
		const error = squash(exit.cause);
		return failed(error instanceof Error ? error : new Error(String(error))).pipe(flatMap((event) => sync(() => dispatch(event))));
	})));
	const perform = (command) => {
		if (command.type === "start-netlog") {
			const attempt = command.attempt;
			return report(suspend(() => {
				const target = path.join(run$2, "network.netlog");
				if (netLog.currentlyLogging) return succeed(target);
				return tryPromise(() => netLog.startLogging(target, {
					captureMode: "default",
					maxFileSize: NET_LOG_SIZE
				})).pipe(as(target));
			}).pipe(timeoutOrElse({
				duration: NETLOG_TIMEOUT_MS,
				orElse: () => fail(/* @__PURE__ */ new Error("net log timed out"))
			}), tap((target) => scoped("network", logInfo("net log started", { path: target }))), map((target) => ({
				type: "netlog.started",
				attempt,
				path: target
			}))), (error) => scoped("network", logWarning(`failed to ${command.mode} net log`, { error })).pipe(map(() => ({
				type: "netlog.start-failed",
				attempt
			}))));
		}
		if (command.type === "stop-netlog") {
			const attempt = command.attempt;
			return report(suspend(() => netLog.currentlyLogging ? tryPromise(() => netLog.stopLogging()) : void_).pipe(timeoutOrElse({
				duration: NETLOG_TIMEOUT_MS,
				orElse: () => fail(/* @__PURE__ */ new Error("net log timed out"))
			}), map(() => ({
				type: "netlog.stopped",
				attempt
			}))), (error) => scoped("network", logWarning("failed to stop net log", { error })).pipe(map(() => ({
				type: "netlog.stopped",
				attempt
			}))));
		}
		if (command.type === "write-archive") {
			const attempt = command.attempt;
			return report(writeDebugArchive(fs, path, command.netLogPath).pipe(timeoutOrElse({
				duration: EXPORT_ARCHIVE_TIMEOUT_MS,
				orElse: () => fail(/* @__PURE__ */ new Error("Debug log export timed out"))
			}), map((output) => ({
				type: "archive.succeeded",
				attempt,
				output
			}))), (error) => logError("failed to export debug logs", { error }).pipe(map(() => ({
				type: "archive.failed",
				attempt,
				error
			}))));
		}
		if (command.type === "resolve-export") return command.replies.forEach((reply) => reply.resolve(command.output));
		command.replies.forEach((reply) => reply.reject(command.error));
	};
	yield* addFinalizer$1(() => sync(() => dispatch({ type: "disposed" })));
	return Service$8.of({
		startNetwork: sync(() => dispatch({ type: "network.requested" })),
		startCrashReporter: initCrashReporter(fs, path).pipe(tap(() => sync(() => marks.crash = Date.now())), catch_((error) => logWarning("failed to start crash reporter", { error }))),
		exportDebug: callback((resume) => {
			const reply = {
				resolve: (output) => resume(succeed(output)),
				reject: (error) => resume(die$1(error))
			};
			dispatch({
				type: "export.requested",
				reply
			});
			return sync(() => dispatch({
				type: "export.cancelled",
				reply
			}));
		})
	});
}));
var nativeLogger = make$16((options) => {
	try {
		if (!run$2) return;
		const entry = formatStructured.log(options);
		const scope = isString(entry.annotations.scope) ? entry.annotations.scope : "main";
		const annotations = Object.fromEntries(Object.entries(entry.annotations).filter(([key]) => key !== "scope"));
		const context = Object.fromEntries(Object.entries({
			annotations: Object.keys(annotations).length === 0 ? void 0 : annotations,
			spans: Object.keys(entry.spans).length === 0 ? void 0 : entry.spans,
			cause: entry.cause
		}).filter(([, value]) => value !== void 0));
		const messages = Array.isArray(options.message) ? options.message : [options.message];
		log.scope(safeLogName(scope))[methods[options.logLevel]](...messages, ...Object.keys(context).length === 0 ? [] : [context]);
	} catch {}
});
var methods = {
	All: "silly",
	Trace: "silly",
	Debug: "debug",
	Info: "info",
	Warn: "warn",
	Error: "error",
	Fatal: "error",
	None: "silly"
};
var nativeLoggerLayer = merge$1(layer$15([nativeLogger], { mergeWithExisting: false }), succeed$1(MinimumLogLevel, "All"));
var layer$9 = serviceLayer.pipe(provideMerge(nativeLoggerLayer));
function initLogging(fs, path) {
	return gen(function* () {
		yield* initRunDirectory(fs, path);
		yield* sync(() => {
			log.transports.file.maxSize = 5242880;
			log.transports.file.resolvePathFn = (_vars, message) => path.join(run$2, `${safeLogName(message?.scope ?? (message?.variables?.processType === "renderer" ? "renderer" : "main"))}.log`);
			log.initialize({
				preload: false,
				spyRendererConsole: true
			});
			initConsoleTransport();
		});
	});
}
function initCrashReporter(fs, path) {
	return gen(function* () {
		const dir = path.join(app.getPath("userData"), "Crashpad");
		yield* fs.makeDirectory(dir, { recursive: true });
		yield* sync(() => {
			app.setPath("crashDumps", dir);
			crashReporter.start({
				uploadToServer: false,
				compress: true
			});
		});
		yield* scoped("crash", logInfo("crash reporter started", { path: dir }));
	});
}
function writeDebugArchive(fs, path, netLogPath) {
	return gen(function* () {
		const output = path.join(app.getPath("downloads"), `opencode-debug-${stamp()}.zip`);
		yield* logInfo("exporting debug logs", { output });
		const files = [
			...yield* collect$1(fs, path, root, "desktop"),
			...(yield* forEach(serverLogRoots(path), (dir, i) => collect$1(fs, path, dir, `server-${i + 1}`))).flat(),
			...yield* collect$1(fs, path, app.getPath("crashDumps"), "crashpad")
		];
		const truncated = files.flatMap((file) => file.offset > 0 ? [file.name] : []);
		yield* writeZip(fs, output, [{
			name: "manifest.json",
			data: Buffer.from(JSON.stringify({
				...manifest(path, netLogPath),
				truncated
			}, null, 2))
		}, ...files]);
		yield* sync(() => shell.showItemInFolder(output));
		return output;
	});
}
function initRunDirectory(fs, path) {
	root = path.join(app.getPath("userData"), "logs");
	run$2 = path.join(root, stamp());
	return fs.makeDirectory(run$2, { recursive: true });
}
function stamp() {
	return (/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "");
}
function safeLogName(name) {
	return name.replace(/[^a-z0-9_.-]/gi, "_") || "main";
}
function cleanup(fs, path) {
	return gen(function* () {
		const dir = root || path.dirname(log.transports.file.getFile().path);
		const cutoff = Date.now() - 6048e5;
		const entries = yield* fs.readDirectory(dir);
		yield* forEach(entries, (entry) => gen(function* () {
			const file = path.join(dir, entry);
			const info = yield* fs.stat(file);
			if (getOrElse(info.mtime, () => /* @__PURE__ */ new Date(0)).getTime() < cutoff) yield* fs.remove(file, {
				recursive: true,
				force: true
			});
		}).pipe(catch_(() => void_)), { discard: true });
	});
}
function manifest(path, netLogPath) {
	return {
		generated: (/* @__PURE__ */ new Date()).toISOString(),
		version: VERSION,
		name: app.getName(),
		packaged: app.isPackaged,
		platform: process.platform,
		arch: process.arch,
		versions: process.versions,
		uptime: process.uptime(),
		userData: app.getPath("userData"),
		logs: root,
		currentRun: run$2,
		crashDumps: app.getPath("crashDumps"),
		serverLogs: serverLogRoots(path),
		netLog: netLogPath
	};
}
function serverLogRoots(path) {
	const xdgData = process.env.XDG_DATA_HOME || path.join(homedir(), ".local", "share");
	return [.../* @__PURE__ */ new Set([path.join(xdgData, "opencode", "log"), path.join(app.getPath("userData"), "opencode", "log")])];
}
function collect$1(fs, path, dir, prefix) {
	return gen(function* () {
		if (!(yield* fs.exists(dir).pipe(orElseSucceed(() => false)))) return [];
		const cutoff = Date.now() - EXPORT_WINDOW;
		const entries = yield* fs.readDirectory(dir, { recursive: true });
		return (yield* forEach(entries, (entry) => gen(function* () {
			const file = path.join(dir, entry);
			const info = yield* fs.stat(file);
			if (info.type === "Directory") return null;
			if (getOrElse(info.mtime, () => /* @__PURE__ */ new Date(0)).getTime() < cutoff) return null;
			if (file.endsWith(".heapsnapshot")) return null;
			const offset = Math.max(0, Number(info.size) - MAX_EXPORT_FILE_SIZE);
			return {
				name: path.join(prefix, entry).replace(/\\/g, "/"),
				path: file,
				offset
			};
		}))).filter((entry) => entry !== null);
	});
}
function writeZip(fs, output, entries) {
	return gen(function* () {
		const { BlobReader, BlobWriter, ZipWriter } = yield* promise$1(() => import("@zip.js/zip.js"));
		const writer = new ZipWriter(new BlobWriter("application/zip"), { dataDescriptorSignature: true });
		yield* forEach(entries, (entry) => gen(function* () {
			const data = "data" in entry ? entry.data : entry.offset === 0 ? yield* fs.readFile(entry.path) : Buffer.concat(yield* runCollect(fs.stream(entry.path, { offset: entry.offset })));
			yield* tryPromise(() => writer.add(entry.name, new BlobReader(new Blob([new Uint8Array(data)]))));
		}), {
			concurrency: 1,
			discard: true
		});
		const zip = yield* tryPromise(() => writer.close());
		yield* fs.writeFile(output, new Uint8Array(yield* tryPromise(() => zip.arrayBuffer())));
	});
}
function initConsoleTransport() {
	if (app.isPackaged) {
		log.transports.console.level = false;
		return;
	}
	const writeConsole = log.transports.console.writeFn.bind(log.transports.console);
	log.transports.console.writeFn = (options) => {
		try {
			writeConsole(options);
		} catch (err) {
			if (!isBrokenPipe(err)) throw err;
			log.transports.console.level = false;
		}
	};
}
function isBrokenPipe(cause) {
	return hasProperty(cause, "code") && cause.code === "EPIPE";
}
function scoped(name, effect) {
	return effect.pipe(annotateLogs("scope", name));
}
//#endregion
//#region ../app/src/runtime/i18n/desktop-native.ts
var DESKTOP_NATIVE_LOCALES = [
	"en",
	"zh",
	"zht",
	"ko",
	"de",
	"es",
	"fr",
	"da",
	"ja",
	"pl",
	"ru",
	"uk",
	"bs",
	"ar",
	"he",
	"no",
	"br",
	"th",
	"tr",
	"hi",
	"nl",
	"id",
	"vi",
	"it",
	"ur",
	"pa",
	"az",
	"fi",
	"sv",
	"am",
	"bg",
	"bn",
	"ca",
	"cs",
	"dv",
	"dz",
	"el",
	"et",
	"fa",
	"fo",
	"hr",
	"hu",
	"hy",
	"is",
	"ka",
	"km",
	"lo",
	"lt",
	"lv",
	"mk",
	"mn",
	"ms",
	"my",
	"ne",
	"ro",
	"si",
	"sk",
	"sl",
	"sq",
	"sr",
	"tg",
	"tk",
	"uz"
];
var DESKTOP_NATIVE_LOCALE_TAGS = {
	en: "en",
	zh: "zh-Hans",
	zht: "zh-Hant",
	ko: "ko",
	de: "de",
	es: "es",
	fr: "fr",
	da: "da",
	ja: "ja",
	pl: "pl",
	ru: "ru",
	uk: "uk",
	bs: "bs",
	ar: "ar",
	he: "he-IL",
	no: "nb-NO",
	br: "pt-BR",
	th: "th",
	tr: "tr",
	hi: "hi-IN",
	nl: "nl-NL",
	id: "id-ID",
	vi: "vi-VN",
	it: "it-IT",
	ur: "ur-PK",
	pa: "pa-Arab-PK",
	az: "az-Latn-AZ",
	fi: "fi-FI",
	sv: "sv-SE",
	am: "am-ET",
	bg: "bg-BG",
	bn: "bn-BD",
	ca: "ca-AD",
	cs: "cs-CZ",
	dv: "dv-MV",
	dz: "dz-BT",
	el: "el-GR",
	et: "et-EE",
	fa: "fa-IR",
	fo: "fo-FO",
	hr: "hr-HR",
	hu: "hu-HU",
	hy: "hy-AM",
	is: "is-IS",
	ka: "ka-GE",
	km: "km-KH",
	lo: "lo-LA",
	lt: "lt-LT",
	lv: "lv-LV",
	mk: "mk-MK",
	mn: "mn-MN",
	ms: "ms-MY",
	my: "my-MM",
	ne: "ne-NP",
	ro: "ro-RO",
	si: "si-LK",
	sk: "sk-SK",
	sl: "sl-SI",
	sq: "sq-AL",
	sr: "sr-Cyrl-RS",
	tg: "tg-Cyrl-TJ",
	tk: "tk-Latn-TM",
	uz: "uz-Latn-UZ"
};
var DESKTOP_NATIVE_ENGLISH = {
	"desktop.microphoneUsage": "OpenCode uses your microphone for voice calls.",
	"desktop.documentsFolderUsage": "OpenCode uses files in your Documents folder for projects you open and commands you run there.",
	"desktop.desktopFolderUsage": "OpenCode uses files on your Desktop for projects you open and commands you run there.",
	"desktop.downloadsFolderUsage": "OpenCode uses files in your Downloads folder for projects you open and commands you run there.",
	"desktop.networkVolumesUsage": "OpenCode uses files on network volumes for projects you open and commands you run there.",
	"desktop.removableVolumesUsage": "OpenCode uses files on removable volumes for projects you open and commands you run there.",
	"desktop.menu.app": "OpenCode",
	"desktop.menu.file": "File",
	"desktop.menu.edit": "Edit",
	"desktop.menu.view": "View",
	"desktop.menu.go": "Go",
	"desktop.menu.window": "Window",
	"desktop.menu.help": "Help",
	"desktop.menu.installCli": "Install CLI…",
	"desktop.menu.settings": "Settings",
	"desktop.menu.reloadWebview": "Reload Webview",
	"desktop.menu.restart": "Restart",
	"desktop.menu.exportLogs": "Export Logs…",
	"desktop.menu.newSession": "New Session",
	"desktop.menu.openProject": "Open Project…",
	"desktop.menu.newWindow": "New Window",
	"desktop.menu.closeWindow": "Close Window",
	"desktop.menu.undo": "Undo",
	"desktop.menu.redo": "Redo",
	"desktop.menu.cut": "Cut",
	"desktop.menu.copy": "Copy",
	"desktop.menu.paste": "Paste",
	"desktop.menu.delete": "Delete",
	"desktop.menu.selectAll": "Select All",
	"desktop.menu.toggleSidebar": "Toggle Sidebar",
	"desktop.menu.toggleTerminal": "Toggle Terminal",
	"desktop.menu.toggleFileTree": "Toggle File Tree",
	"desktop.menu.reload": "Reload",
	"desktop.menu.toggleDeveloperTools": "Toggle Developer Tools",
	"desktop.menu.actualSize": "Actual Size",
	"desktop.menu.zoomIn": "Zoom In",
	"desktop.menu.zoomOut": "Zoom Out",
	"desktop.menu.toggleFullScreen": "Toggle Full Screen",
	"desktop.menu.back": "Back",
	"desktop.menu.forward": "Forward",
	"desktop.menu.previousSession": "Previous Session",
	"desktop.menu.nextSession": "Next Session",
	"desktop.menu.previousProject": "Previous Project",
	"desktop.menu.nextProject": "Next Project",
	"desktop.menu.minimize": "Minimize",
	"desktop.menu.maximize": "Maximize",
	"desktop.menu.documentation": "OpenCode Documentation",
	"desktop.menu.supportForum": "Support Forum",
	"desktop.menu.shareFeedback": "Share Feedback",
	"desktop.menu.reportBug": "Report a Bug",
	"desktop.menu.ariaLabel": "OpenCode menu",
	"desktop.cli.installed.title": "CLI Installed",
	"desktop.cli.installed.message": "CLI installed to {{path}}\n\nRestart your terminal to use the 'opencode' command.",
	"desktop.cli.failed.title": "Installation Failed",
	"desktop.cli.failed.message": "Failed to install CLI: {{error}}",
	"desktop.recovery.action.relaunch": "Relaunch",
	"desktop.recovery.action.exportLogs": "Export Logs",
	"desktop.recovery.action.keepWaiting": "Keep Waiting",
	"desktop.recovery.action.quit": "Quit",
	"desktop.recovery.loadFailed": "OpenCode failed to load",
	"desktop.recovery.terminated": "OpenCode window terminated unexpectedly",
	"desktop.recovery.unresponsive": "OpenCode is not responding",
	"desktop.recovery.unresponsive.detail": "You can relaunch the app, open the logs, or keep waiting.",
	"desktop.recovery.loadFailed.detail": "Window: {{window}}\nURL: {{url}}\nError: {{code}} {{description}}",
	"desktop.recovery.terminated.detail": "Window: {{window}}\nReason: {{reason}}\nCode: {{code}}",
	"desktop.recovery.unknown": "<unknown>",
	"desktop.dialog.chooseFolder": "Choose a folder",
	"desktop.dialog.chooseFile": "Choose a file",
	"desktop.dialog.saveFile": "Save file",
	"desktop.dialog.files": "Files",
	"desktop.onboarding.defaultProject": "Default Project",
	"desktop.picker.error.notSelected": "File was not selected by the picker",
	"desktop.picker.error.sizeLimit": "Selected attachments exceed the {{limit}} MB limit",
	"desktop.contextMenu.spellcheck": "Spellcheck",
	"desktop.contextMenu.spellcheckLanguages": "Spellcheck Languages"
};
var DESKTOP_NATIVE_KEYS = Object.keys(DESKTOP_NATIVE_ENGLISH);
var DESKTOP_NATIVE_MAX_PAYLOAD_BYTES = 65536;
var DesktopNativeBundleSchema = Struct({
	locale: Literals(DESKTOP_NATIVE_LOCALES),
	messages: Record(Literals(DESKTOP_NATIVE_KEYS), String$1)
}).check(makeFilter((bundle) => new TextEncoder().encode(JSON.stringify(bundle)).byteLength <= DESKTOP_NATIVE_MAX_PAYLOAD_BYTES));
var decodeDesktopNativeBundle = decodeUnknownOption(DesktopNativeBundleSchema, { onExcessProperty: "error" });
/** Validates a bundle the renderer sent over IPC: a supported locale, exactly the native keys, and a bounded size. */
var parseDesktopNativeBundle = flow(decodeDesktopNativeBundle, getOrUndefined$1);
function formatDesktopNativeMessage(message, params) {
	if (!params) return message;
	return message.replace(/\{\{([^{}]+)\}\}/g, (match, key) => {
		const value = params[key];
		return value === void 0 ? match : String(value);
	});
}
//#endregion
//#region src/main/native/translations.ts
var bundle = {
	locale: "en",
	messages: { ...DESKTOP_NATIVE_ENGLISH }
};
var listeners = /* @__PURE__ */ new Set();
function setNativeTranslations(next) {
	if (next.locale === bundle.locale && DESKTOP_NATIVE_KEYS.every((key) => next.messages[key] === bundle.messages[key])) return false;
	bundle = next;
	listeners.forEach((listener) => listener());
	return true;
}
function nativeT(key, params) {
	return formatDesktopNativeMessage(bundle.messages[key], params);
}
/** Language tags with their names in the app locale, sorted for a menu. */
function nativeLanguageOptions(tags) {
	const locale = DESKTOP_NATIVE_LOCALE_TAGS[bundle.locale];
	const names = new Intl.DisplayNames([locale], { type: "language" });
	return tags.map((tag) => ({
		tag,
		label: names.of(tag) ?? tag
	})).toSorted((a, b) => a.label.localeCompare(b.label, locale));
}
/** The app locale the renderer last pushed. GUI plugin catalogs resolve against it. */
function nativeLocale() {
	return bundle.locale;
}
/** Runs after the renderer pushes a different bundle, such as when the user switches language. */
function onNativeTranslations(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
/** A shared app message for a key that is only known at runtime, such as one a plugin asks for. */
function nativeMessage(key) {
	const messages = bundle.messages;
	return Object.hasOwn(messages, key) ? messages[key] : void 0;
}
function nativePluralCategory(count) {
	return new Intl.PluralRules(DESKTOP_NATIVE_LOCALE_TAGS[bundle.locale]).select(count);
}
function formatNativeTemplate(template, params) {
	if (!params) return template;
	return template.replace(/\{\{\s*([^{}\s]+)\s*\}\}/g, (match, key) => Object.hasOwn(params, key) ? String(params[key]) : match);
}
//#endregion
//#region src/main/files/attachment-picker-machine.ts
function createPickedFileState() {
	return {
		status: "open",
		nextAttempt: 1,
		pickers: /* @__PURE__ */ new Map(),
		selections: /* @__PURE__ */ new Map()
	};
}
function transitionPickedFiles(state, event) {
	if (state.status === "disposed") {
		if (event.type === "read.requested" || event.type === "read.succeeded" || event.type === "read.failed") return reject$2(state, "not-selected");
		return {
			state,
			commands: []
		};
	}
	switch (event.type) {
		case "picker.opened": {
			const picker = state.nextAttempt;
			return watched(state, {
				...state,
				nextAttempt: picker + 1,
				pickers: new Map(state.pickers).set(picker, event.sender)
			}, [event.sender], [{
				type: "picker-opened",
				picker
			}]);
		}
		case "picker.closed": {
			const sender = state.pickers.get(event.picker);
			if (sender === void 0) return {
				state,
				commands: []
			};
			return watched(state, {
				...state,
				pickers: without$2(state.pickers, event.picker)
			}, [sender], []);
		}
		case "selection.granted": {
			const sender = state.pickers.get(event.picker);
			if (sender === void 0) return {
				state,
				commands: []
			};
			const pickers = without$2(state.pickers, event.picker);
			const paths = [...new Set(event.paths)];
			if (paths.length === 0) return watched(state, {
				...state,
				pickers
			}, [sender], []);
			const selection = {
				sender,
				remaining: event.budget,
				files: new Map(paths.map((path) => [path, UNREAD]))
			};
			return watched(state, {
				...state,
				pickers,
				selections: new Map(state.selections).set(event.token, selection)
			}, [sender], [{
				type: "granted",
				token: event.token
			}]);
		}
		case "read.requested": {
			const selection = state.selections.get(event.token);
			if (selection?.sender !== event.sender || selection.files.get(event.path)?.status !== "unread") return reject$2(state, "not-selected");
			const attempt = state.nextAttempt;
			return {
				state: {
					...state,
					nextAttempt: attempt + 1,
					selections: withFile(state.selections, event.token, selection, event.path, {
						status: "reading",
						attempt
					})
				},
				commands: [{
					type: "read",
					attempt,
					maxBytes: selection.remaining
				}]
			};
		}
		case "read.succeeded": {
			const selection = current(state, event);
			if (!selection) return reject$2(state, "not-selected");
			if (event.bytes.byteLength > selection.remaining) return reject$2({
				...state,
				selections: withFile(state.selections, event.token, selection, event.path, UNREAD)
			}, "size-limit");
			const files = without$2(selection.files, event.path);
			const selections = files.size === 0 ? without$2(state.selections, event.token) : new Map(state.selections).set(event.token, {
				...selection,
				remaining: selection.remaining - event.bytes.byteLength,
				files
			});
			return watched(state, {
				...state,
				selections
			}, [selection.sender], [{ type: "resolve" }]);
		}
		case "read.failed": {
			const selection = current(state, event);
			if (!selection) return reject$2(state, "not-selected");
			return reject$2({
				...state,
				selections: withFile(state.selections, event.token, selection, event.path, UNREAD)
			}, "read-failed");
		}
		case "read.cancelled": {
			const selection = current(state, event);
			if (!selection) return {
				state,
				commands: []
			};
			return {
				state: {
					...state,
					selections: withFile(state.selections, event.token, selection, event.path, UNREAD)
				},
				commands: []
			};
		}
		case "selection.released":
			if (state.selections.get(event.token)?.sender !== event.sender) return {
				state,
				commands: []
			};
			return watched(state, {
				...state,
				selections: without$2(state.selections, event.token)
			}, [event.sender], []);
		case "sender.cleared":
			if (!senderLive(state, event.sender)) return {
				state,
				commands: []
			};
			return watched(state, {
				...state,
				pickers: new Map([...state.pickers].filter((entry) => entry[1] !== event.sender)),
				selections: new Map([...state.selections].filter((entry) => entry[1].sender !== event.sender))
			}, [event.sender], []);
		case "disposed": return {
			state: { status: "disposed" },
			commands: liveSenders(state).map((sender) => ({
				type: "unwatch-sender",
				sender
			}))
		};
	}
}
var UNREAD = Object.freeze({ status: "unread" });
function current(state, event) {
	const selection = state.selections.get(event.token);
	const file = selection?.files.get(event.path);
	if (file?.status !== "reading" || file.attempt !== event.attempt) return void 0;
	return selection;
}
function senderLive(state, sender) {
	return [...state.pickers.values()].includes(sender) || [...state.selections.values()].some((selection) => selection.sender === sender);
}
function liveSenders(state) {
	return [.../* @__PURE__ */ new Set([...state.pickers.values(), ...[...state.selections.values()].map((item) => item.sender)])];
}
function watched(previous, next, senders, commands) {
	return {
		state: next,
		commands: [...senders.flatMap((sender) => {
			const before = senderLive(previous, sender);
			const after = senderLive(next, sender);
			if (before === after) return [];
			return [after ? {
				type: "watch-sender",
				sender
			} : {
				type: "unwatch-sender",
				sender
			}];
		}), ...commands]
	};
}
function withFile(selections, token, selection, path, file) {
	return new Map(selections).set(token, {
		...selection,
		files: new Map(selection.files).set(path, file)
	});
}
function without$2(map, key) {
	const next = new Map(map);
	next.delete(key);
	return next;
}
function reject$2(state, reason) {
	return {
		state,
		commands: [{
			type: "reject",
			reason
		}]
	};
}
//#endregion
//#region src/main/files/attachment-picker.ts
var MAX_ATTACHMENT_BYTES = 20971520;
/**
* The files each renderer picked and may read. `watch` follows a renderer while it holds an open dialog or a selection,
* and calls `clear` once that renderer reloads or closes; it returns a function that stops following.
*/
function createPickedFileAuthorizations(read, watch) {
	let state = createPickedFileState();
	const watchers = /* @__PURE__ */ new Map();
	const dispatch = (event) => {
		const next = transitionPickedFiles(state, event);
		state = next.state;
		next.commands.forEach((command) => {
			if (command.type === "watch-sender" && watch) watchers.set(command.sender, watch(command.sender, () => dispatch({
				type: "sender.cleared",
				sender: command.sender
			})));
			if (command.type !== "unwatch-sender") return;
			watchers.get(command.sender)?.();
			watchers.delete(command.sender);
		});
		return next.commands.find((command) => command.type !== "watch-sender" && command.type !== "unwatch-sender");
	};
	return {
		/** Starts a native file dialog for `sender`; returns its id, or undefined once disposed. */
		open(sender) {
			const reply = dispatch({
				type: "picker.opened",
				sender
			});
			return reply?.type === "picker-opened" ? reply.picker : void 0;
		},
		/** Grants the dialog's files; undefined when its renderer reloaded or closed while the dialog was open. */
		grant(picker, paths) {
			const reply = dispatch({
				type: "selection.granted",
				picker,
				token: randomUUID(),
				paths,
				budget: MAX_ATTACHMENT_BYTES
			});
			return reply?.type === "granted" ? reply.token : void 0;
		},
		/** Ends a dialog that granted nothing. */
		close(picker) {
			dispatch({
				type: "picker.closed",
				picker
			});
		},
		read: fn("DesktopFiles.readPickedFile")(function* (sender, token, path) {
			const claim = dispatch({
				type: "read.requested",
				sender,
				token,
				path
			});
			if (claim?.type !== "read") throw rejection$2(claim);
			const exit$1 = yield* read(path, claim.maxBytes).pipe(onInterrupt(() => sync(() => dispatch({
				type: "read.cancelled",
				attempt: claim.attempt,
				token,
				path
			}))), exit);
			const settled = dispatch(isSuccess(exit$1) ? {
				type: "read.succeeded",
				attempt: claim.attempt,
				token,
				path,
				bytes: exit$1.value
			} : {
				type: "read.failed",
				attempt: claim.attempt,
				token,
				path
			});
			if (settled?.type === "resolve" || settled?.type === "reject" && settled.reason === "read-failed") return yield* exit$1;
			throw rejection$2(settled);
		}),
		release(sender, token) {
			dispatch({
				type: "selection.released",
				sender,
				token
			});
		},
		dispose() {
			dispatch({ type: "disposed" });
		}
	};
}
function rejection$2(reply) {
	if ((reply?.type === "reject" ? reply.reason : "not-selected") === "size-limit") return new Error(nativeT("desktop.picker.error.sizeLimit", { limit: MAX_ATTACHMENT_BYTES / 1024 / 1024 }));
	return new Error(nativeT("desktop.picker.error.notSelected"));
}
function assertAttachmentBudget(files) {
	if (files.reduce((sum, file) => sum + file.size, 0) <= 20971520) return;
	throw new Error(nativeT("desktop.picker.error.sizeLimit", { limit: MAX_ATTACHMENT_BYTES / 1024 / 1024 }));
}
function readAttachment(filePath, maxBytes = MAX_ATTACHMENT_BYTES) {
	return scoped$1(gen(function* () {
		const file = yield* (yield* FileSystem).open(filePath, { flag: "r" });
		const info = yield* file.stat;
		if (info.size > bytes(maxBytes)) throw new Error(nativeT("desktop.picker.error.sizeLimit", { limit: MAX_ATTACHMENT_BYTES / 1024 / 1024 }));
		const bytes$1 = new Uint8Array(Number(info.size));
		let offset = 0;
		while (offset < bytes$1.byteLength) {
			const read = Number(yield* file.read(bytes$1.subarray(offset)));
			if (read === 0) break;
			offset += read;
		}
		return bytes$1.buffer.slice(0, offset);
	}));
}
//#endregion
//#region src/main/files/index.ts
var Service$7 = class extends Service$9()("opencode/desktop/DesktopFiles") {};
var layer$8 = effect(Service$7, gen(function* () {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const pickedFiles = createPickedFileAuthorizations((file, maxBytes) => readAttachment(file, maxBytes).pipe(provideService(FileSystem, fs)), watchRenderer);
	yield* addFinalizer$1(() => sync(pickedFiles.dispose));
	return Service$7.of(make$5(fs, path, pickedFiles));
}));
function watchRenderer(sender, clear) {
	const contents = webContents.fromId(sender);
	if (!contents || contents.isDestroyed()) {
		queueMicrotask(clear);
		return () => {};
	}
	const navigated = (event) => {
		if (event.isMainFrame && !event.isSameDocument) clear();
	};
	contents.on("did-start-navigation", navigated);
	contents.once("destroyed", clear);
	return () => {
		if (contents.isDestroyed()) return;
		contents.off("did-start-navigation", navigated);
		contents.off("destroyed", clear);
	};
}
function make$5(fs, path, pickedFiles) {
	return {
		openDirectoryPicker: fn("DesktopFiles.openDirectoryPicker")(function* (options) {
			const result = yield* promise$1(() => dialog.showOpenDialog({
				properties: [
					"openDirectory",
					...options?.multiple ? ["multiSelections"] : [],
					"createDirectory"
				],
				title: options?.title ?? nativeT("desktop.dialog.chooseFolder"),
				defaultPath: options?.defaultPath
			}));
			if (result.canceled) return null;
			return options?.multiple ? result.filePaths : result.filePaths[0];
		}),
		openFilePicker: fn("DesktopFiles.openFilePicker")(function* (sender, options) {
			const picker = pickedFiles.open(sender);
			if (picker === void 0) return null;
			return yield* gen(function* () {
				const result = yield* promise$1(() => dialog.showOpenDialog({
					properties: ["openFile", ...options?.multiple ? ["multiSelections"] : []],
					title: options?.title ?? nativeT("desktop.dialog.chooseFile"),
					defaultPath: options?.defaultPath,
					filters: pickerFilters(options?.extensions)
				}));
				if (result.canceled) return null;
				const files = yield* forEach(result.filePaths, fnUntraced(function* (file) {
					const info = yield* fs.stat(file);
					return {
						path: file,
						name: path.basename(file),
						size: Number(info.size)
					};
				}), { concurrency: "unbounded" });
				assertAttachmentBudget(files);
				const token = pickedFiles.grant(picker, result.filePaths);
				return token === void 0 ? null : {
					token,
					files
				};
			}).pipe(ensuring(sync(() => pickedFiles.close(picker))));
		}),
		readPickedFile: pickedFiles.read,
		releasePickedFiles: pickedFiles.release,
		saveFile: fn("DesktopFiles.saveFile")(function* (options, content) {
			const result = yield* promise$1(() => dialog.showSaveDialog({
				title: options?.title ?? nativeT("desktop.dialog.saveFile"),
				defaultPath: options?.defaultPath
			}));
			if (result.canceled) return false;
			if (!result.filePath) return false;
			yield* fs.writeFile(result.filePath, new TextEncoder().encode(content));
			return true;
		}),
		openPath: fn("DesktopFiles.openPath")(function* (target, application) {
			if (!application) {
				const error = yield* promise$1(() => shell.openPath(target));
				if (error) return yield* fail(new Error(error));
				return;
			}
			if (process.platform === "win32" && /^powershell(\.exe)?$/i.test(path.basename(application))) {
				const cwd = (yield* fs.stat(target)).type === "Directory" ? target : path.dirname(target);
				return yield* tryPromise(() => new Promise((resolve, reject) => {
					spawn("cmd.exe", [
						"/d",
						"/c",
						"start",
						"",
						application,
						"-NoExit"
					], {
						cwd,
						stdio: "ignore",
						windowsHide: true
					}).once("error", reject).once("exit", (code) => code === 0 ? resolve() : reject(/* @__PURE__ */ new Error(`start exited with code ${code}`)));
				}));
			}
			yield* tryPromise(() => new Promise((resolve, reject) => {
				const command = process.platform === "darwin" ? {
					file: "open",
					arguments: [
						"-a",
						application,
						target
					]
				} : {
					file: application,
					arguments: [target]
				};
				execFile(command.file, command.arguments, (error) => error ? reject(error) : resolve());
			}));
		}),
		revealPath: fn("DesktopFiles.revealPath")(function* (target) {
			if (!(yield* fs.exists(target).pipe(orElseSucceed(() => false)))) return false;
			shell.showItemInFolder(target);
			return true;
		}),
		readClipboardImage: fn("DesktopFiles.readClipboardImage")(function* () {
			const items = yield* promise$1(() => clipboard.read());
			const found = clipboardImageTypes.flatMap((mime) => items.filter((item) => item.types.includes(mime)).map((item) => ({
				item,
				mime
			}))).at(0);
			if (!found) return null;
			const payload = yield* promise$1(async () => found.item.getType(found.mime));
			if (!(payload instanceof Blob)) return null;
			const bytes = yield* promise$1(() => payload.arrayBuffer());
			const image = nativeImage.createFromBuffer(Buffer.from(bytes));
			if (image.isEmpty()) return null;
			const size = image.getSize();
			return {
				buffer: new Uint8Array(image.toPNG()),
				width: size.width,
				height: size.height
			};
		}),
		writeClipboardText: fn("DesktopFiles.writeClipboardText")(function* (text) {
			yield* promise$1(() => clipboard.writeText(text));
		})
	};
}
var clipboardImageTypes = ["image/png", "image/jpeg"];
var openExternalURL = fn("DesktopFiles.openExternalURL")(function* (value) {
	const url = resolveExternalURL(value);
	if (!url) {
		yield* scoped("window", logWarning("blocked external target", { url: value }));
		return false;
	}
	return yield* tryPromise(() => shell.openExternal(url)).pipe(as(true), catch_((error) => scoped("window", logError("failed to open external target", {
		url,
		error
	})).pipe(as(false))));
});
var openLocalFileURL = fn("DesktopFiles.openLocalFileURL")(function* (value) {
	const path = resolveLocalFilePath(value);
	if (!path) {
		yield* scoped("window", logWarning("blocked local file target", { url: value }));
		return;
	}
	const error = yield* promise$1(() => shell.openPath(path));
	if (error) yield* scoped("window", logError("failed to open local file", {
		path,
		error
	}));
});
function pickerFilters(extensions) {
	if (!extensions?.length) return void 0;
	return [{
		name: nativeT("desktop.dialog.files"),
		extensions
	}];
}
//#endregion
//#region src/main/paths.ts
var resolve$1 = gen(function* () {
	const path = yield* Path$1;
	const root = path.dirname(yield* path.fromFileUrl(new URL(import.meta.url)));
	return {
		developmentResourcesRoot: path.join(root, "../../resources"),
		preloadPath: path.join(root, "../preload/index.cjs"),
		rendererRoot: path.join(root, "../renderer")
	};
}).pipe(orDie);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
function is(value, type) {
	if (!value || typeof value !== "object") return false;
	if (value instanceof type) return true;
	let cls = Object.getPrototypeOf(value)?.constructor;
	while (cls) {
		if (entityKind in cls && cls[entityKind] === type[entityKind]) return true;
		cls = Object.getPrototypeOf(cls);
	}
	return false;
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/column-common.js
var OriginalColumn = Symbol.for("drizzle:OriginalColumn");
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/column.js
var noop = (v) => v;
noop.isNoop = true;
var Column = class {
	static [entityKind] = "Column";
	/** @internal */
	codec;
	name;
	keyAsName;
	primary;
	notNull;
	default;
	defaultFn;
	onUpdateFn;
	hasDefault;
	isUnique;
	uniqueName;
	uniqueType;
	dataType;
	columnType;
	enumValues = void 0;
	generated = void 0;
	generatedIdentity = void 0;
	length;
	isLengthExact;
	isAlias;
	/** @internal */
	config;
	/** @internal */
	table;
	/** @internal */
	onInit() {}
	constructor(table, config) {
		this.config = config;
		this.onInit();
		this.table = table;
		this.name = config.name;
		this.isAlias = false;
		this.keyAsName = config.keyAsName;
		this.notNull = config.notNull;
		this.default = config.default;
		this.defaultFn = config.defaultFn;
		this.onUpdateFn = config.onUpdateFn;
		this.hasDefault = config.hasDefault;
		this.primary = config.primaryKey;
		this.isUnique = config.isUnique;
		this.uniqueName = config.uniqueName;
		this.uniqueType = config.uniqueType;
		this.dataType = config.dataType;
		this.columnType = config.columnType;
		this.generated = config.generated;
		this.generatedIdentity = config.generatedIdentity;
		this.length = config["length"];
		this.isLengthExact = config["isLengthExact"];
	}
	mapFromDriverValue = noop;
	mapToDriverValue = noop;
	/** @internal */
	postBuild() {
		return this;
	}
	/** @internal */
	shouldDisableInsert() {
		return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
	}
	/** @internal */
	[OriginalColumn]() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/table.utils.js
/** @internal */
var TableName = Symbol.for("drizzle:Name");
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/table.js
/** @internal */
var TableSchema = Symbol.for("drizzle:Schema");
/** @internal */
var TableColumns = Symbol.for("drizzle:Columns");
/** @internal */
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
/** @internal */
var OriginalName = Symbol.for("drizzle:OriginalName");
/** @internal */
var BaseName = Symbol.for("drizzle:BaseName");
/** @internal */
var IsAlias = Symbol.for("drizzle:IsAlias");
/** @internal */
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
	static [entityKind] = "Table";
	/** @internal */
	static Symbol = {
		Name: TableName,
		Schema: TableSchema,
		OriginalName,
		Columns: TableColumns,
		ExtraConfigColumns,
		BaseName,
		IsAlias,
		ExtraConfigBuilder
	};
	/**
	* @internal
	* Can be changed if the table is aliased.
	*/
	[TableName];
	/**
	* @internal
	* Used to store the original name of the table, before any aliasing.
	*/
	[OriginalName];
	/** @internal */
	[TableSchema];
	/** @internal */
	[TableColumns];
	/** @internal */
	[ExtraConfigColumns];
	/**
	*  @internal
	* Used to store the table name before the transformation via the `tableCreator` functions.
	*/
	[BaseName];
	/** @internal */
	[IsAlias] = false;
	/** @internal */
	[IsDrizzleTable] = true;
	/** @internal */
	[ExtraConfigBuilder] = void 0;
	constructor(name, schema, baseName) {
		this[TableName] = this[OriginalName] = name;
		this[TableSchema] = schema;
		this[BaseName] = baseName;
	}
};
function getTableName(table) {
	return table[TableName];
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/subquery.js
var Subquery = class {
	static [entityKind] = "Subquery";
	constructor(sql, fields, alias, isWith = false, usedTables = []) {
		this._ = {
			brand: "Subquery",
			sql,
			selectedFields: fields,
			alias,
			isWith,
			usedTables
		};
	}
};
var WithSubquery = class extends Subquery {
	static [entityKind] = "WithSubquery";
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
	return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
var StringChunk = class {
	static [entityKind] = "StringChunk";
	constructor(value) {
		this.value = value;
	}
	getSQL() {
		return new SQL([this]);
	}
};
var SQL = class SQL {
	static [entityKind] = "SQL";
	/** @internal */
	decoder = noopDecoder;
	/** @internal */
	shouldInlineParams = false;
	/** @internal */
	_usedTables;
	/** @internal */
	get usedTables() {
		if (this._usedTables) return this._usedTables;
		this._usedTables = [];
		for (let i = 0; i < this.queryChunks.length; ++i) {
			const chunk = this.queryChunks[i];
			if (is(chunk, Table)) {
				const schemaName = chunk[Table.Symbol.Schema];
				this._usedTables.push(schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]);
			}
		}
		return this._usedTables;
	}
	constructor(queryChunks) {
		this.queryChunks = queryChunks;
	}
	append(query) {
		this.queryChunks.push(...query.queryChunks);
		return this;
	}
	toQuery(config) {
		return this.buildQueryFromSourceParams(this.queryChunks, config);
	}
	buildQueryFromSourceParams(chunks, _config) {
		const strings = [];
		const params = [];
		const bounds = _config.tagged ? [] : void 0;
		this.collectSQL(chunks, _config, _config.paramStartIndex || { value: 0 }, _config.inlineParams || this.shouldInlineParams, strings, params, bounds);
		if (bounds === void 0) return {
			sql: strings.join(""),
			params
		};
		const segments = new Array(bounds.length);
		for (let i = 0; i < bounds.length; ++i) {
			const end = i + 1 < bounds.length ? bounds[i + 1] : strings.length;
			let segment = "";
			for (let j = bounds[i]; j < end; ++j) segment += strings[j];
			segments[i] = segment;
		}
		return {
			sql: strings.join(""),
			params,
			_sql: Object.assign(segments, { raw: segments })
		};
	}
	collectSQL(chunks, config, paramStartIndex, inlineParams, strings, params, bounds) {
		const { escapeName, escapeParam, codecs, invokeSource } = config;
		for (let i = 0; i < chunks.length; ++i) {
			if (bounds !== void 0) bounds.push(strings.length);
			const chunk = chunks[i];
			if (is(chunk, StringChunk)) {
				strings.push(chunk.value);
				continue;
			}
			if (is(chunk, SQL)) {
				this.collectSQL(chunk.queryChunks, config, paramStartIndex, inlineParams || chunk.shouldInlineParams, strings, params, void 0);
				continue;
			}
			if (is(chunk, Name)) {
				strings.push(escapeName(chunk.value));
				continue;
			}
			if (chunk === void 0) continue;
			if (is(chunk, Column)) {
				const columnName = chunk.name;
				if (invokeSource === "indexes") {
					strings.push(escapeName(columnName));
					continue;
				}
				const schemaName = invokeSource === "mssql-check" ? void 0 : chunk.table[Table.Symbol.Schema];
				strings.push(chunk.isAlias ? escapeName(chunk.name) : chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName));
				continue;
			}
			if (is(chunk, Param)) {
				if (is(chunk.value, SQL)) {
					const nested = chunk.value;
					this.collectSQL(nested.queryChunks, config, paramStartIndex, inlineParams || nested.shouldInlineParams, strings, params, void 0);
					continue;
				}
				const useCodecs = codecs && is(chunk.encoder, Column);
				if (is(chunk.value, Placeholder)) {
					const escaped = escapeParam(paramStartIndex.value++, chunk);
					chunk.codec = useCodecs ? (value) => codecs.apply(chunk.encoder, "normalizeParam", value) : void 0;
					strings.push(useCodecs ? codecs.apply(chunk.encoder, "castParam", escaped) : escaped);
					params.push(chunk);
					continue;
				}
				let mappedValue;
				if (chunk.value === null) mappedValue = chunk.value;
				else {
					mappedValue = chunk.encoder.mapToDriverValue.isNoop ? chunk.value : chunk.encoder.mapToDriverValue(chunk.value);
					if (is(mappedValue, SQL)) {
						const nested = mappedValue;
						this.collectSQL(nested.queryChunks, config, paramStartIndex, inlineParams || nested.shouldInlineParams, strings, params, void 0);
						continue;
					}
					if (useCodecs) mappedValue = codecs.apply(chunk.encoder, "normalizeParam", mappedValue);
				}
				if (inlineParams) {
					strings.push(this.mapInlineParam(mappedValue, config));
					continue;
				}
				const escaped = escapeParam(paramStartIndex.value++, mappedValue);
				strings.push(useCodecs ? codecs.apply(chunk.encoder, "castParam", escaped) : escaped);
				params.push(mappedValue);
				continue;
			}
			if (is(chunk, Placeholder)) {
				strings.push(escapeParam(paramStartIndex.value++, chunk));
				params.push(chunk);
				continue;
			}
			if (is(chunk, Table)) {
				const schemaName = chunk[Table.Symbol.Schema];
				const tableName = chunk[Table.Symbol.Name];
				if (invokeSource === "mssql-view-with-schemabinding") {
					strings.push((schemaName === void 0 ? escapeName("dbo") : escapeName(schemaName)) + "." + escapeName(tableName));
					continue;
				}
				strings.push(schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName));
				continue;
			}
			if (is(chunk, View)) {
				const schemaName = chunk[ViewBaseConfig].schema;
				const viewName = chunk[ViewBaseConfig].name;
				strings.push(schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName));
				continue;
			}
			if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== void 0) {
				strings.push((chunk.origin !== void 0 ? escapeName(chunk.origin) + "." : "") + escapeName(chunk.fieldAlias));
				continue;
			}
			if (is(chunk, Subquery)) {
				if (chunk._.isWith) {
					strings.push(escapeName(chunk._.alias));
					continue;
				}
				const nested = chunk._.sql;
				strings.push("(");
				this.collectSQL(nested.queryChunks, config, paramStartIndex, inlineParams || nested.shouldInlineParams, strings, params, void 0);
				strings.push(") " + escapeName(chunk._.alias));
				continue;
			}
			if (typeof chunk === "function" && "enumName" in chunk) {
				if ("schema" in chunk && chunk.schema) {
					strings.push(escapeName(chunk.schema) + "." + escapeName(chunk.enumName));
					continue;
				}
				strings.push(escapeName(chunk.enumName));
				continue;
			}
			if (isSQLWrapper(chunk)) {
				const nested = chunk.getSQL();
				const nestedInlineParams = inlineParams || nested.shouldInlineParams;
				if (chunk.shouldOmitSQLParens?.()) {
					this.collectSQL(nested.queryChunks, config, paramStartIndex, nestedInlineParams, strings, params, void 0);
					continue;
				}
				strings.push("(");
				this.collectSQL(nested.queryChunks, config, paramStartIndex, nestedInlineParams, strings, params, void 0);
				strings.push(")");
				continue;
			}
			if (Array.isArray(chunk)) {
				strings.push("(");
				const element = [void 0];
				for (let j = 0; j < chunk.length; ++j) {
					if (j > 0) strings.push(", ");
					element[0] = chunk[j];
					this.collectSQL(element, config, paramStartIndex, inlineParams, strings, params, void 0);
				}
				strings.push(")");
				continue;
			}
			if (inlineParams) {
				strings.push(this.mapInlineParam(chunk, config));
				continue;
			}
			strings.push(escapeParam(paramStartIndex.value++, chunk));
			params.push(chunk);
		}
	}
	mapInlineParam(chunk, { escapeString }) {
		if (chunk === null) return "null";
		if (typeof chunk === "number" || typeof chunk === "boolean" || typeof chunk === "bigint") return chunk.toString();
		if (typeof chunk === "string") return escapeString(chunk);
		if (typeof chunk === "object") {
			const mappedValueAsString = chunk.toString();
			if (mappedValueAsString === "[object Object]") return escapeString(JSON.stringify(chunk));
			return escapeString(mappedValueAsString);
		}
		throw new Error("Unexpected param value: " + chunk);
	}
	getSQL() {
		return this;
	}
	as(alias) {
		if (alias === void 0) return this;
		return new SQL.Aliased(this, alias);
	}
	mapWith(decoder) {
		this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
		return this;
	}
	nullable() {
		return this;
	}
	inlineParams() {
		this.shouldInlineParams = true;
		return this;
	}
	/**
	* This method is used to conditionally include a part of the query.
	*
	* @param condition - Condition to check
	* @returns itself if the condition is `true`, otherwise `undefined`
	*/
	if(condition) {
		return condition ? this : void 0;
	}
};
/**
* Any DB name (table, column, index etc.)
*/
var Name = class {
	static [entityKind] = "Name";
	brand;
	constructor(value) {
		this.value = value;
	}
	getSQL() {
		return new SQL([this]);
	}
};
function isDriverValueEncoder(value) {
	return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = { mapFromDriverValue: (value) => value };
noopDecoder.mapFromDriverValue.isNoop = true;
var noopEncoder = { mapToDriverValue: (value) => value };
noopEncoder.mapToDriverValue.isNoop = true;
({
	...noopDecoder,
	...noopEncoder
});
/** Parameter value that is optionally bound to an encoder (for example, a column). */
var Param = class {
	static [entityKind] = "Param";
	brand;
	/**
	* @param value - Parameter value
	* @param encoder - Encoder to convert the value to a driver parameter
	*/
	constructor(value, encoder = noopEncoder, codec) {
		this.value = value;
		this.encoder = encoder;
		this.codec = codec;
	}
	getSQL() {
		return new SQL([this]);
	}
};
function sql(strings, ...params) {
	const startWithString = params.length > 0 || strings.length > 0 && strings[0] !== "";
	const chunkCount = startWithString ? strings.length + params.length : strings.length - 1;
	const queryChunks = new Array(chunkCount < 0 ? 0 : chunkCount);
	let writeIdx = 0;
	if (startWithString) queryChunks[writeIdx++] = new StringChunk(strings[0]);
	for (let paramIdx = 0; paramIdx < params.length; ++paramIdx) {
		const param = params[paramIdx];
		queryChunks[writeIdx++] = param;
		queryChunks[writeIdx++] = new StringChunk(strings[paramIdx + 1]);
	}
	return new SQL(queryChunks);
}
(function(_sql) {
	function empty() {
		return new SQL([]);
	}
	_sql.empty = empty;
	function fromList(list) {
		return new SQL(list);
	}
	_sql.fromList = fromList;
	function raw(str) {
		return new SQL([new StringChunk(str)]);
	}
	_sql.raw = raw;
	function join(chunks, separator) {
		const { length } = chunks;
		if (separator === void 0 || length === 0) return new SQL(chunks.slice());
		const result = new Array(length * 2 - 1);
		for (let i = 0, writeIdx = 0; i < length; ++i) {
			result[writeIdx++] = chunks[i];
			if (i < length - 1) result[writeIdx++] = separator;
		}
		return new SQL(result);
	}
	_sql.join = join;
	function identifier(value) {
		return new Name(value);
	}
	_sql.identifier = identifier;
	function placeholder(name) {
		return new Placeholder(name);
	}
	_sql.placeholder = placeholder;
	function param(value, encoder) {
		return new Param(value, encoder);
	}
	_sql.param = param;
	function comment(input) {
		const encoded = sqlCommenter(input);
		if (!encoded.length) return void 0;
		return sql.raw(encoded);
	}
	_sql.comment = comment;
})(sql || (sql = {}));
function sqlCommenter(input) {
	const encoded = sqlCommenter.encodeInput(input);
	if (!encoded.length) return "";
	return `/*${encoded}*/`;
}
(function(_sqlCommenter) {
	function merge(input1, input2) {
		let encoded;
		if (typeof input1 === "object" && typeof input2 === "object") encoded = encodeInput({
			...input1,
			...input2
		});
		else if (input1 && input2) encoded = [encodeInput(input1), encodeInput(input2)].filter((i) => i.length).join(",");
		else if (input2) encoded = encodeInput(input2);
		else if (input1) encoded = encodeInput(input1);
		else return "";
		if (!encoded.length) return "";
		return `/*${encoded}*/`;
	}
	_sqlCommenter.merge = merge;
	function encodeInput(input) {
		if (typeof input === "string") {
			if (!input.length) return input;
			return sanitizeStringInput(input);
		}
		const parts = [];
		for (const [key, value] of Object.entries(input)) {
			if (value === null || value === void 0 || value === "") continue;
			const encodedKey = sanitizeObjectElement(key);
			const encodedValue = sanitizeObjectElement(String(value));
			parts.push(`${encodedKey}='${encodedValue}'`);
		}
		if (!parts.length) return "";
		return parts.sort().join(",");
	}
	_sqlCommenter.encodeInput = encodeInput;
	function sanitizeObjectElement(key) {
		return encodeURIComponent(key).replace(/'/g, `\\'`);
	}
	_sqlCommenter.sanitizeObjectElement = sanitizeObjectElement;
	function sanitizeStringInput(input) {
		return input.replace(/\/\*/g, "/ *").replace(/\*\//g, "* /");
	}
	_sqlCommenter.sanitizeStringInput = sanitizeStringInput;
})(sqlCommenter || (sqlCommenter = {}));
(function(_SQL) {
	class Aliased {
		static [entityKind] = "SQL.Aliased";
		/** @internal */
		isSelectionField = false;
		/** @internal */
		origin;
		constructor(sql, fieldAlias) {
			this.sql = sql;
			this.fieldAlias = fieldAlias;
		}
		getSQL() {
			return this.sql;
		}
		/** @internal */
		clone() {
			return new Aliased(this.sql, this.fieldAlias);
		}
	}
	_SQL.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
	static [entityKind] = "Placeholder";
	constructor(name) {
		this.name = name;
	}
	getSQL() {
		return new SQL([this]);
	}
};
function fillPlaceholders(params, values) {
	return params.map((p) => {
		if (is(p, Placeholder)) {
			if (!(p.name in values)) throw new Error(`No value for placeholder "${p.name}" was provided`);
			return values[p.name];
		}
		if (is(p, Param) && is(p.value, Placeholder)) {
			if (!(p.value.name in values)) throw new Error(`No value for placeholder "${p.value.name}" was provided`);
			const value = values[p.value.name];
			if (value === null) return value;
			const mapped = p.encoder.mapToDriverValue.isNoop ? value : p.encoder.mapToDriverValue(value);
			return p.codec ? p.codec(mapped) : mapped;
		}
		return p;
	});
}
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
	static [entityKind] = "View";
	/** @internal */
	[ViewBaseConfig];
	/** @internal */
	[IsDrizzleView] = true;
	/** @internal */
	get [TableName]() {
		return this[ViewBaseConfig].name;
	}
	/** @internal */
	get [TableSchema]() {
		return this[ViewBaseConfig].schema;
	}
	/** @internal */
	get [IsAlias]() {
		return this[ViewBaseConfig].isAlias;
	}
	/** @internal */
	get [OriginalName]() {
		return this[ViewBaseConfig].originalName;
	}
	/** @internal */
	get [TableColumns]() {
		return this[ViewBaseConfig].selectedFields;
	}
	constructor({ name, schema, selectedFields, query }) {
		this[ViewBaseConfig] = {
			name,
			originalName: name,
			schema,
			selectedFields,
			query,
			isExisting: !query,
			isAlias: false
		};
	}
};
Column.prototype.getSQL = function() {
	return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
	return new SQL([this]);
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
	static [entityKind] = "ConsoleLogWriter";
	write(message) {
		console.log(message);
	}
};
var DefaultLogger = class {
	static [entityKind] = "DefaultLogger";
	writer;
	constructor(config) {
		this.writer = config?.writer ?? new ConsoleLogWriter();
	}
	logQuery(query, params) {
		const stringifiedParams = params.map((p) => {
			try {
				return JSON.stringify(p);
			} catch {
				return String(p);
			}
		});
		const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
		this.writer.write(`Query: ${query}${paramsStr}`);
	}
};
var NoopLogger = class {
	static [entityKind] = "NoopLogger";
	logQuery() {}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/utils.js
/** @internal */
function resolveNullableObjectPaths(columns, joinsNotNullableMap) {
	if (!joinsNotNullableMap) return void 0;
	const tableOf = /* @__PURE__ */ new Map();
	const order = [];
	const seen = /* @__PURE__ */ new Set();
	for (const { path, field, fieldType } of columns) {
		if (path.length < 2) continue;
		const key = path[0];
		if (!seen.has(key)) {
			seen.add(key);
			order.push(key);
		}
		if (fieldType !== "Column") continue;
		const tableName = getTableName(field.table);
		const current = tableOf.get(key);
		if (current === void 0) tableOf.set(key, tableName);
		else if (current !== false && current !== tableName) tableOf.set(key, false);
	}
	const result = [];
	for (const key of order) {
		const table = tableOf.get(key);
		if (typeof table === "string" && !joinsNotNullableMap[table]) result.push(key);
	}
	return result;
}
function nullablePathTargets(columns, nullableObjectPaths) {
	const targets = new Array(nullableObjectPaths.length);
	for (let i = 0; i < nullableObjectPaths.length; ++i) {
		const key = nullableObjectPaths[i];
		const leaves = [];
		for (let j = 0; j < columns.length; ++j) {
			const cp = columns[j].path;
			if (cp.length > 1 && cp[0] === key) leaves.push(j);
		}
		targets[i] = {
			key,
			leaves
		};
	}
	return targets;
}
/** @internal bypass bundle-time filtering */
var FnConstructor = Object.getPrototypeOf(() => null).constructor;
/** @internal */
function makeJitQueryMapperInner(columns, nullableObjectPaths) {
	const preFn = [];
	const fn = [];
	fn.push(`const [ ${columns.map((_, i) => `c${i}`).join(", ")} ] = rows[i];`);
	const descendantIds = {};
	const nullableKeys = new Set(nullableObjectPaths ?? []);
	const decodes = new Array(columns.length);
	for (let idx = 0; idx < columns.length; ++idx) {
		const { field, fieldType, path, codec, arrayDimensions } = columns[idx];
		let decoder;
		let decoderStr;
		let decoderFieldDestructure;
		switch (fieldType) {
			case "Column":
				decoder = field;
				decoderFieldDestructure = `field: decoder${idx}`;
				break;
			case "SQL":
				decoder = field.decoder;
				decoderFieldDestructure = `field: { decoder: decoder${idx} }`;
				break;
			case "Subquery":
				decoder = field._.sql.decoder;
				decoderFieldDestructure = `field: { _: { sql: { decoder: decoder${idx} } } }`;
				break;
			default:
				decoder = field.sql.decoder;
				decoderFieldDestructure = `field: { sql: { decoder: decoder${idx} } }`;
		}
		decoderStr = `decoder${idx}.mapFromDriverValue`;
		if (decoder.mapFromDriverValue.isNoop) decoderStr = "";
		if (decoderStr) preFn.push(`const { ${decoderFieldDestructure}${codec ? `, codec: codec${idx}` : ""} } = columns[${idx}];`);
		else if (codec) preFn.push(`const { codec: codec${idx} } = columns[${idx}];`);
		const colStr = `c${idx}`;
		let decodedValue = colStr;
		if (codec) decodedValue = `codec${idx}(${decodedValue}, ${arrayDimensions})`;
		if (decoderStr) decodedValue = `${decoderStr}(${decodedValue})`;
		decodes[idx] = colStr === decodedValue ? `${colStr}` : `${colStr} === null ? ${colStr} : ${decodedValue}`;
		if (path.length > 1) (descendantIds[path[0]] ??= []).push(colStr);
	}
	fn.push(`mapped[i] = {`);
	let currentObjectPath = [];
	for (let idx = 0; idx < columns.length; ++idx) {
		const { path } = columns[idx];
		const jsonPath = path.map((e) => JSON.stringify(e));
		const decodedValue = decodes[idx];
		const objectPath = path.slice(0, -1);
		let commonLen = 0;
		while (commonLen < currentObjectPath.length && commonLen < objectPath.length && currentObjectPath[commonLen] === objectPath[commonLen]) commonLen++;
		for (let d = currentObjectPath.length - 1; d >= commonLen; --d) fn.push(`${"	".repeat(d + 1)}},`);
		for (let d = commonLen; d < objectPath.length; ++d) {
			const nullable = d === 0 && nullableKeys.has(path[0]);
			fn.push(`${"	".repeat(d + 1)}${jsonPath[d]}: ${nullable ? `${descendantIds[path[0]].map((c) => `${c} === null`).join(" && ")} ? null : {` : "{"}`);
		}
		currentObjectPath = objectPath;
		fn.push(`${"	".repeat(path.length)}${jsonPath[path.length - 1]}: ${decodedValue},`);
	}
	for (let d = currentObjectPath.length - 1; d >= 0; --d) fn.push(`${"	".repeat(d + 1)}},`);
	fn.push(`};`);
	return `${preFn.length ? `${preFn.join("\n	")}\n\t` : ""}for (let i = 0; i < length; ++i) {
		${fn.join("\n		")}
	}`;
}
function makeJitQueryMapper(columns, nullableObjectPaths) {
	const internals = `\t"use strict";
	const { columns } = this;
	const { length } = rows;
	const mapped = new Array(length);
	${makeJitQueryMapperInner(columns, nullableObjectPaths)}
	return mapped;
	//# sourceURL=drizzle:jit-query-mapper`;
	return Object.assign(new FnConstructor("rows", internals).bind({ columns }), { body: `function jitQueryMapper (rows) {\n${internals}\n}` });
}
/** @internal */
function jitCompatCheck(isEnabled) {
	if (!isEnabled) return false;
	try {
		const res = new FnConstructor("input", "\"use strict\"; return input;")(true);
		if (res !== true) {
			console.warn("Unable to use jit mappers due to incompatibility: corrupted jit function output.\nFalling back to premade mappers.\nError details:");
			console.error(`Expected to receive \`true\`, got: ${res}`);
		}
		return true;
	} catch (e) {
		console.warn("Unable to use jit mappers due to incompatibility.\nFalling back to premade mappers.\nError details:");
		console.error(e);
		return false;
	}
}
function makeDefaultQueryMapper(columns, nullableObjectPaths) {
	const interpretedData = new Array(columns.length);
	for (let i = 0; i < columns.length; ++i) {
		const { field, fieldType, codec, arrayDimensions } = columns[i];
		let decoderSrc;
		switch (fieldType) {
			case "Column":
				decoderSrc = field;
				break;
			case "SQL":
				decoderSrc = field.decoder;
				break;
			case "Subquery":
				decoderSrc = field._.sql.decoder;
				break;
			default: decoderSrc = field.sql.decoder;
		}
		let decoder;
		if (decoderSrc.mapFromDriverValue.isNoop) decoder = codec ? (v) => codec(v, arrayDimensions) : void 0;
		else decoder = codec ? (v) => decoderSrc.mapFromDriverValue(codec(v, arrayDimensions)) : (v) => decoderSrc.mapFromDriverValue(v);
		interpretedData[i] = decoder;
	}
	const targets = nullableObjectPaths?.length ? nullablePathTargets(columns, nullableObjectPaths) : void 0;
	return ((rows) => {
		const { length: rowLength } = rows;
		const output = new Array(rowLength);
		for (let j = 0; j < rowLength; ++j) {
			const row = rows[j];
			const result = {};
			for (let i = 0; i < columns.length; ++i) {
				const { path } = columns[i];
				let node = result;
				for (let p = 0; p < path.length; ++p) {
					const pathChunk = path[p];
					if (p < path.length - 1) {
						if (!(pathChunk in node)) node[pathChunk] = {};
						node = node[pathChunk];
					} else {
						const decoder = interpretedData[i];
						const rawValue = row[i];
						node[pathChunk] = rawValue === null ? null : decoder ? decoder(rawValue) : rawValue;
					}
				}
			}
			if (targets) for (let i = 0; i < targets.length; ++i) {
				const { key, leaves } = targets[i];
				let allNull = true;
				for (let j = 0; j < leaves.length; ++j) if (row[leaves[j]] !== null) {
					allNull = false;
					break;
				}
				if (allNull) result[key] = null;
			}
			output[j] = result;
		}
		return output;
	});
}
/** @internal */
function orderSelectedFields(fields, pathPrefix, codecs, result = []) {
	const entries = Object.entries(fields);
	for (let i = 0; i < entries.length; ++i) {
		const [name, field] = entries[i];
		if (typeof name !== "string") return result;
		const newPath = pathPrefix ? [...pathPrefix, name] : [name];
		if (is(field, Column)) result.push({
			path: newPath,
			field,
			fieldType: "Column",
			codec: codecs?.get(field, "normalize"),
			arrayDimensions: field.dimensions,
			column: field
		});
		else if (is(field, SQL)) {
			const col = getColumnFromDecoder(field);
			result.push(col ? {
				path: newPath,
				field,
				fieldType: "SQL",
				codec: codecs?.get(col, "normalize"),
				arrayDimensions: col.dimensions,
				column: col
			} : {
				path: newPath,
				field,
				fieldType: "SQL"
			});
		} else if (is(field, SQL.Aliased)) {
			const col = getColumnFromDecoder(field);
			result.push(col ? {
				path: newPath,
				field,
				fieldType: "SQL.Aliased",
				codec: codecs?.get(col, "normalize"),
				arrayDimensions: col.dimensions,
				column: col
			} : {
				path: newPath,
				field,
				fieldType: "SQL.Aliased"
			});
		} else if (is(field, Subquery)) {
			let column;
			const entry = Object.values(field._.selectedFields)[0];
			let fieldDecoder;
			if (is(entry, Column)) {
				column = entry;
				fieldDecoder = entry;
			} else if (is(entry, SQL)) {
				column = getColumnFromDecoder(entry);
				fieldDecoder = entry.decoder;
			} else {
				column = getColumnFromDecoder(entry);
				fieldDecoder = entry.sql.decoder;
			}
			if (fieldDecoder) field._.sql.decoder = fieldDecoder;
			result.push(column ? {
				path: newPath,
				field,
				fieldType: "Subquery",
				codec: codecs?.get(column, "normalize"),
				arrayDimensions: column.dimensions,
				column
			} : {
				path: newPath,
				field,
				fieldType: "Subquery"
			});
		} else if (is(field, Table)) orderSelectedFields(field[Table.Symbol.Columns], newPath, codecs, result);
		else orderSelectedFields(field, newPath, codecs, result);
	}
	return result;
}
function getColumnFromDecoder(source) {
	const query = source.getSQL();
	if (is(query.decoder, Column)) return query.decoder;
}
function haveSameKeys(left, right) {
	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);
	if (leftKeys.length !== rightKeys.length) return false;
	for (const [index, key] of leftKeys.entries()) if (key !== rightKeys[index]) return false;
	return true;
}
/** @internal */
function mapUpdateSet(table, values) {
	const entries = Object.entries(values).filter(([, value]) => value !== void 0);
	if (entries.length === 0) throw new Error("No values to set");
	const mapped = new Array(entries.length);
	for (let i = 0; i < entries.length; ++i) {
		const [key, value] = entries[i];
		if (is(value, SQL) || is(value, Column)) mapped[i] = [key, value];
		else mapped[i] = [key, new Param(value, table[Table.Symbol.Columns][key])];
	}
	return Object.fromEntries(mapped);
}
/** @internal */
function applyMixins(baseClass, extendedClasses) {
	for (const extendedClass of extendedClasses) for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
		if (name === "constructor") continue;
		Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null));
	}
}
function getTableColumns(table) {
	return table[Table.Symbol.Columns];
}
/** @internal */
function getTableLikeName(table) {
	return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
/** @internal */
function getColumnNameAndConfig(a, b) {
	return {
		name: typeof a === "string" && a.length > 0 ? a : "",
		config: typeof a === "object" ? a : b
	};
}
var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();
function assertUnreachable(_x) {
	throw new Error("Didn't expect to get here");
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
	static [entityKind] = "QueryPromise";
	[Symbol.toStringTag] = "QueryPromise";
	catch(onRejected) {
		return this.then(void 0, onRejected);
	}
	finally(onFinally) {
		return this.then((value) => {
			onFinally?.();
			return value;
		}, (reason) => {
			onFinally?.();
			throw reason;
		});
	}
	then(onFulfilled, onRejected) {
		return this.execute().then(onFulfilled, onRejected);
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/count.js
var SQLiteCountBuilder = class SQLiteCountBuilder extends SQL {
	static [entityKind] = "SQLiteCountBuilder";
	dialect;
	session;
	static buildCount(source, filters, parens) {
		const query = sql`select count(*) from ${source}${sql` where ${filters}`.if(filters)}`;
		return parens ? sql`(${query})` : query;
	}
	constructor(countConfig) {
		super(SQLiteCountBuilder.buildCount(countConfig.source, countConfig.filters, true).queryChunks);
		this.countConfig = countConfig;
		this.dialect = countConfig.dialect;
		this.session = countConfig.session;
		this.mapWith((e) => {
			if (typeof e === "number") return e;
			return Number(e ?? 0);
		});
	}
	executableSql;
	build() {
		if (!this.executableSql) {
			const { source, filters } = this.countConfig;
			this.executableSql = SQLiteCountBuilder.buildCount(source, filters);
		}
		return this.dialect.sqlToQuery(this.executableSql);
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/count.js
var SQLiteAsyncCountBuilder = class extends SQLiteCountBuilder {
	static [entityKind] = "SQLiteAsyncCountBuilder";
	constructor(countConfig) {
		super(countConfig);
	}
	/** @internal */
	executeRaw(placeholderValues) {
		return this.session.prepareQuery(this.build(), "arrays", false, "all", (rows) => {
			const v = rows[0]?.[0];
			if (typeof v === "number") return v;
			return v ? Number(v) : 0;
		}).execute(placeholderValues);
	}
	async execute(placeholderValues) {
		return await this.executeRaw(placeholderValues);
	}
};
applyMixins(SQLiteAsyncCountBuilder, [QueryPromise]);
var SQLiteSyncCountBuilder = class extends SQLiteAsyncCountBuilder {
	static [entityKind] = "SQLiteSyncCountBuilder";
	sync(placeholderValues) {
		return this.executeRaw(placeholderValues).sync();
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/query.js
var RelationalQueryBuilder = class {
	static [entityKind] = "SQLiteRelationalQueryBuilderV2";
	constructor(mode, schema, table, tableConfig, dialect, session, forbidJsonb, builder = SQLiteRelationalQuery) {
		this.mode = mode;
		this.schema = schema;
		this.table = table;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.forbidJsonb = forbidJsonb;
		this.builder = builder;
	}
	findMany(config) {
		return new this.builder(this.mode, this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "many", this.forbidJsonb);
	}
	findFirst(config) {
		return new this.builder(this.mode, this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "first", this.forbidJsonb);
	}
};
var SQLiteRelationalQuery = class {
	static [entityKind] = "SQLiteRelationalQueryV2";
	/** @internal */
	mode;
	/** @internal */
	table;
	/** @internal */
	resultKind;
	constructor(resultKind, schema, table, tableConfig, dialect, session, config, mode, forbidJsonb) {
		this.schema = schema;
		this.tableConfig = tableConfig;
		this.dialect = dialect;
		this.session = session;
		this.config = config;
		this.forbidJsonb = forbidJsonb;
		this.resultKind = resultKind;
		this.mode = mode;
		this.table = table;
	}
	getSQL() {
		return this._getQuery().sql;
	}
	_getQuery() {
		const jsonb = this.forbidJsonb ? sql`json` : sql`jsonb`;
		return this.dialect.buildRelationalQuery({
			schema: this.schema,
			table: this.table,
			tableConfig: this.tableConfig,
			queryConfig: this.config,
			mode: this.mode,
			jsonb
		});
	}
	_toSQL() {
		const query = this._getQuery();
		return {
			query,
			builtQuery: this.dialect.sqlToQuery(query.sql)
		};
	}
	toSQL() {
		return this._toSQL().builtQuery;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/query.js
var SQLiteAsyncRelationalQuery = class extends SQLiteRelationalQuery {
	static [entityKind] = "SQLiteAsyncRelationalQueryV2";
	/** @internal */
	_prepare(prepare = false) {
		const { query, builtQuery } = this._toSQL();
		const mapper = this.dialect.mapperGenerators.relationalRows({
			isFirst: this.mode === "first",
			parseJson: true,
			parseJsonIfString: false,
			rootJsonMappers: false,
			selection: query.selection,
			arrayModeRoot: true
		});
		return this.session.prepareQuery(builtQuery, "arrays", prepare, "all", mapper);
	}
	prepare() {
		return this._prepare(true);
	}
	async execute(placeholderValues) {
		return this._prepare().execute(placeholderValues);
	}
};
var SQLiteSyncRelationalQuery = class extends SQLiteAsyncRelationalQuery {
	static [entityKind] = "SQLiteSyncRelationalQueryV2";
	sync(placeholderValues) {
		return this._prepare().execute(placeholderValues).sync();
	}
};
applyMixins(SQLiteAsyncRelationalQuery, [QueryPromise]);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/alias.js
var ColumnTableAliasProxyHandler = class {
	static [entityKind] = "ColumnTableAliasProxyHandler";
	constructor(table, ignoreColumnAlias) {
		this.table = table;
		this.ignoreColumnAlias = ignoreColumnAlias;
	}
	get(columnObj, prop) {
		if (prop === "table") return this.table;
		if (prop === "isAlias" && this.ignoreColumnAlias) return false;
		if (prop === OriginalColumn && !this.ignoreColumnAlias) return () => columnObj;
		return columnObj[prop];
	}
};
var ViewSelectionAliasProxyHandler = class {
	static [entityKind] = "ViewSelectionAliasProxyHandler";
	constructor(view, selection, ignoreColumnAlias) {
		this.view = view;
		this.selection = selection;
		this.ignoreColumnAlias = ignoreColumnAlias;
	}
	get(selection, prop) {
		const value = selection[prop];
		if (is(value, Column)) return new Proxy(value, new ColumnTableAliasProxyHandler(this.view, this.ignoreColumnAlias));
		if (is(value, Subquery) || is(value, SQL) || is(value, SQL.Aliased) || isSQLWrapper(value) || typeof value !== "object" || value === null) return value;
		return new Proxy(value, this);
	}
};
var TableAliasProxyHandler = class {
	static [entityKind] = "TableAliasProxyHandler";
	constructor(alias, replaceOriginalName, ignoreColumnAlias) {
		this.alias = alias;
		this.replaceOriginalName = replaceOriginalName;
		this.ignoreColumnAlias = ignoreColumnAlias;
	}
	get(target, prop) {
		if (prop === Table.Symbol.IsAlias) return true;
		if (prop === Table.Symbol.Name) return this.alias;
		if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) return this.alias;
		if (prop === ViewBaseConfig) return {
			...target[ViewBaseConfig],
			name: this.alias,
			isAlias: true,
			selectedFields: new Proxy(target[ViewBaseConfig].selectedFields, new ViewSelectionAliasProxyHandler(new Proxy(target, this), target[ViewBaseConfig].selectedFields, this.ignoreColumnAlias))
		};
		if (prop === Table.Symbol.Columns) {
			const columns = target[Table.Symbol.Columns];
			if (!columns) return columns;
			if (is(target, View)) return new Proxy(target[Table.Symbol.Columns], new ViewSelectionAliasProxyHandler(new Proxy(target, this), target[Table.Symbol.Columns], this.ignoreColumnAlias));
			const proxiedColumns = {};
			Object.keys(columns).map((key) => {
				proxiedColumns[key] = new Proxy(columns[key], new ColumnTableAliasProxyHandler(new Proxy(target, this), this.ignoreColumnAlias));
			});
			return proxiedColumns;
		}
		const value = target[prop];
		if (is(value, Column)) return new Proxy(value, new ColumnTableAliasProxyHandler(new Proxy(target, this), this.ignoreColumnAlias));
		return value;
	}
};
var ColumnAliasProxyHandler = class {
	static [entityKind] = "ColumnAliasProxyHandler";
	constructor(alias) {
		this.alias = alias;
	}
	get(target, prop) {
		if (prop === "isAlias") return true;
		if (prop === "name") return this.alias;
		if (prop === "keyAsName") return false;
		if (prop === OriginalColumn) return () => target;
		return target[prop];
	}
};
function aliasedTable(table, tableAlias) {
	return new Proxy(table, new TableAliasProxyHandler(tableAlias, false, false));
}
function aliasedColumn(column, alias) {
	return new Proxy(column, new ColumnAliasProxyHandler(alias));
}
Column.prototype.as = function(alias) {
	return aliasedColumn(this, alias);
};
function getOriginalColumnFromAlias(column) {
	return column[OriginalColumn]();
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class SelectionProxyHandler {
	static [entityKind] = "SelectionProxyHandler";
	config;
	constructor(config) {
		this.config = { ...config };
	}
	get(subquery, prop) {
		if (prop === "_") return {
			...subquery["_"],
			selectedFields: new Proxy(subquery._.selectedFields, this)
		};
		if (prop === ViewBaseConfig) return {
			...subquery[ViewBaseConfig],
			selectedFields: new Proxy(subquery[ViewBaseConfig].selectedFields, this)
		};
		if (typeof prop === "symbol") return subquery[prop];
		const value = (is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery)[prop];
		if (is(value, SQL.Aliased)) {
			if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) return value.sql;
			const newValue = value.clone();
			newValue.isSelectionField = true;
			newValue.origin = this.config.alias;
			return newValue;
		}
		if (is(value, SQL)) {
			if (this.config.sqlBehavior === "sql") return value;
			throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
		}
		if (is(value, Column)) {
			if (this.config.alias) return new Proxy(value, new ColumnTableAliasProxyHandler(new Proxy(value.table, new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false, true)), true));
			return value;
		}
		if (typeof value !== "object" || value === null) return value;
		return new Proxy(value, new SelectionProxyHandler(this.config));
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var ForeignKeyBuilder = class {
	static [entityKind] = "SQLiteForeignKeyBuilder";
	/** @internal */
	reference;
	/** @internal */
	_onUpdate;
	/** @internal */
	_onDelete;
	constructor(config, actions) {
		this.reference = () => {
			const { name, columns, foreignColumns } = config();
			return {
				name,
				columns,
				foreignTable: foreignColumns[0].table,
				foreignColumns
			};
		};
		if (actions) {
			this._onUpdate = actions.onUpdate;
			this._onDelete = actions.onDelete;
		}
	}
	onUpdate(action) {
		this._onUpdate = action;
		return this;
	}
	onDelete(action) {
		this._onDelete = action;
		return this;
	}
	/** @internal */
	build(table) {
		return new ForeignKey(table, this);
	}
};
var ForeignKey = class {
	static [entityKind] = "SQLiteForeignKey";
	reference;
	onUpdate;
	onDelete;
	constructor(table, builder) {
		this.table = table;
		this.reference = builder.reference;
		this.onUpdate = builder._onUpdate;
		this.onDelete = builder._onDelete;
	}
	getName() {
		const { name, columns, foreignColumns } = this.reference();
		const columnNames = columns.map((column) => column.name);
		const foreignColumnNames = foreignColumns.map((column) => column.name);
		const chunks = [
			this.table[TableName],
			...columnNames,
			foreignColumns[0].table[TableName],
			...foreignColumnNames
		];
		return name ?? `${chunks.join("_")}_fk`;
	}
	isNameExplicit() {
		return !!this.reference().name;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
	static [entityKind] = "ColumnBuilder";
	/** @internal */
	config;
	constructor(name, dataType, columnType) {
		this.config = {
			name,
			keyAsName: name === "",
			notNull: false,
			default: void 0,
			hasDefault: false,
			primaryKey: false,
			isUnique: false,
			uniqueName: void 0,
			uniqueType: void 0,
			dataType,
			columnType,
			generated: void 0
		};
	}
	/**
	* Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
	*
	* @example
	* ```ts
	* const users = pgTable('users', {
	* 	id: integer('id').$type<UserId>().primaryKey(),
	* 	details: json('details').$type<UserDetails>().notNull(),
	* });
	* ```
	*/
	$type() {
		return this;
	}
	/**
	* Adds a `not null` clause to the column definition.
	*
	* Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
	*/
	notNull() {
		this.config.notNull = true;
		return this;
	}
	/**
	* Adds a `default <value>` clause to the column definition.
	*
	* Affects the `insert` model of the table - columns *with* `default` are optional on insert.
	*
	* If you need to set a dynamic default value, use {@link $defaultFn} instead.
	*/
	default(value) {
		this.config.default = value;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Adds a dynamic default value to the column.
	* The function will be called when the row is inserted, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$defaultFn(fn) {
		this.config.defaultFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $defaultFn}.
	*/
	$default(fn) {
		return this.$defaultFn(fn);
	}
	/**
	* Adds a dynamic update value to the column.
	* The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
	* If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$onUpdateFn(fn) {
		this.config.onUpdateFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $onUpdateFn}.
	*/
	$onUpdate(fn) {
		return this.$onUpdateFn(fn);
	}
	/**
	* Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
	*
	* In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
	*/
	primaryKey() {
		this.config.primaryKey = true;
		this.config.notNull = true;
		return this;
	}
	/** @internal Sets the name of the column to the key within the table definition if a name was not given. */
	setName(name, casingFn) {
		if (this.config.name !== "") return;
		this.config.name = casingFn(name);
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder = class extends ColumnBuilder {
	static [entityKind] = "SQLiteColumnBuilder";
	foreignKeyConfigs = [];
	references(ref, actions = {}) {
		this.foreignKeyConfigs.push({
			ref,
			actions
		});
		return this;
	}
	unique(name) {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		return this;
	}
	generatedAlwaysAs(as, config) {
		this.config.generated = {
			as,
			type: "always",
			mode: config?.mode ?? "virtual"
		};
		return this;
	}
	/** @internal */
	buildForeignKeys(column, table) {
		return this.foreignKeyConfigs.map(({ ref, actions }) => {
			return ((ref, actions) => {
				const builder = new ForeignKeyBuilder(() => {
					const foreignColumn = ref();
					return {
						columns: [column],
						foreignColumns: [foreignColumn]
					};
				});
				if (actions.onUpdate) builder.onUpdate(actions.onUpdate);
				if (actions.onDelete) builder.onDelete(actions.onDelete);
				return builder.build(table);
			})(ref, actions);
		});
	}
};
var SQLiteColumn = class extends Column {
	static [entityKind] = "SQLiteColumn";
	/** @internal */
	table;
	constructor(table, config) {
		super(table, config);
		this.table = table;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/blob.js
function hexToText(hexString) {
	let result = "";
	for (let i = 0; i < hexString.length; i += 2) {
		const hexPair = hexString.slice(i, i + 2);
		const decimalValue = Number.parseInt(hexPair, 16);
		result += String.fromCodePoint(decimalValue);
	}
	return result;
}
var SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBigIntBuilder";
	constructor(name) {
		super(name, "bigint int64", "SQLiteBigInt");
	}
	/** @internal */
	build(table) {
		return new SQLiteBigInt(table, this.config);
	}
};
var SQLiteBigInt = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBigInt";
	getSQLType() {
		return "blob";
	}
	mapFromDriverValue = (value) => {
		if (typeof value === "string") return BigInt(hexToText(value));
		if (typeof Buffer !== "undefined" && Buffer.from) {
			const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
			return BigInt(buf.toString("utf8"));
		}
		return BigInt(textDecoder.decode(value));
	};
	mapToDriverValue = (value) => {
		return Buffer.from(value.toString());
	};
};
var SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBlobJsonBuilder";
	constructor(name) {
		super(name, "object json", "SQLiteBlobJson");
	}
	/** @internal */
	build(table) {
		return new SQLiteBlobJson(table, this.config);
	}
};
var SQLiteBlobJson = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBlobJson";
	getSQLType() {
		return "blob";
	}
	mapFromDriverValue = (value) => {
		if (typeof value === "string") return JSON.parse(hexToText(value));
		if (typeof Buffer !== "undefined" && Buffer.from) {
			const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
			return JSON.parse(buf.toString("utf8"));
		}
		return JSON.parse(textDecoder.decode(value));
	};
	mapToDriverValue = (value) => {
		return Buffer.from(JSON.stringify(value));
	};
};
var SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBlobBufferBuilder";
	constructor(name) {
		super(name, "object buffer", "SQLiteBlobBuffer");
	}
	/** @internal */
	build(table) {
		return new SQLiteBlobBuffer(table, this.config);
	}
};
var SQLiteBlobBuffer = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBlobBuffer";
	mapFromDriverValue = (value) => {
		if (Buffer.isBuffer(value)) return value;
		if (typeof value === "string") return Buffer.from(value, "hex");
		return Buffer.from(value);
	};
	getSQLType() {
		return "blob";
	}
};
function blob(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "bigint") return new SQLiteBigIntBuilder(name);
	if (config?.mode === "buffer") return new SQLiteBlobBufferBuilder(name);
	return new SQLiteBlobJsonBuilder(name);
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/custom.js
var SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteCustomColumnBuilder";
	constructor(name, fieldConfig, customTypeParams) {
		super(name, "custom", "SQLiteCustomColumn");
		this.config.fieldConfig = fieldConfig;
		this.config.customTypeParams = customTypeParams;
	}
	/** @internal */
	build(table) {
		return new SQLiteCustomColumn(table, this.config);
	}
};
var SQLiteCustomColumn = class extends SQLiteColumn {
	static [entityKind] = "SQLiteCustomColumn";
	sqlName;
	mapTo;
	mapFrom;
	mapJson;
	forJsonSelect;
	constructor(table, config) {
		super(table, config);
		this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
		this.mapTo = config.customTypeParams.toDriver;
		this.mapFrom = config.customTypeParams.fromDriver;
		this.mapJson = config.customTypeParams.fromJson;
		this.forJsonSelect = config.customTypeParams.forJsonSelect;
	}
	getSQLType() {
		return this.sqlName;
	}
	mapFromDriverValue = (value) => {
		return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
	};
	mapFromJsonValue(value) {
		return typeof this.mapJson === "function" ? this.mapJson(value) : this.mapFromDriverValue(value);
	}
	jsonSelectIdentifier(identifier, sql) {
		if (typeof this.forJsonSelect === "function") return this.forJsonSelect(identifier, sql);
		const rawType = this.getSQLType().toLowerCase();
		const parenPos = rawType.indexOf("(");
		switch (parenPos + 1 ? rawType.slice(0, parenPos) : rawType) {
			case "numeric":
			case "decimal":
			case "bigint": return sql`cast(${identifier} as text)`;
			case "blob": return sql`hex(${identifier})`;
			default: return identifier;
		}
	}
	mapToDriverValue = (value) => {
		return typeof this.mapTo === "function" ? this.mapTo(value) : value;
	};
};
/**
* Custom sqlite database data type generator
*/
function customType(customTypeParams) {
	return (a, b) => {
		const { name, config } = getColumnNameAndConfig(a, b);
		return new SQLiteCustomColumnBuilder(name, config, customTypeParams);
	};
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/integer.js
var SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBaseIntegerBuilder";
	constructor(name, dataType, columnType) {
		super(name, dataType, columnType);
		this.config.autoIncrement = false;
	}
	primaryKey(config) {
		if (config?.autoIncrement) this.config.autoIncrement = true;
		this.config.hasDefault = true;
		return super.primaryKey();
	}
};
var SQLiteBaseInteger = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBaseInteger";
	autoIncrement = this.config.autoIncrement;
	getSQLType() {
		return "integer";
	}
};
var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
	static [entityKind] = "SQLiteIntegerBuilder";
	constructor(name) {
		super(name, "number int53", "SQLiteInteger");
	}
	build(table) {
		return new SQLiteInteger(table, this.config);
	}
};
var SQLiteInteger = class extends SQLiteBaseInteger {
	static [entityKind] = "SQLiteInteger";
};
var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
	static [entityKind] = "SQLiteTimestampBuilder";
	constructor(name, mode) {
		super(name, "object date", "SQLiteTimestamp");
		this.config.mode = mode;
	}
	/**
	* @deprecated Use `default()` with your own expression instead.
	*
	* Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
	*/
	defaultNow() {
		return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
	}
	build(table) {
		return new SQLiteTimestamp(table, this.config);
	}
};
var SQLiteTimestamp = class extends SQLiteBaseInteger {
	static [entityKind] = "SQLiteTimestamp";
	mode = this.config.mode;
	mapFromDriverValue = (value) => {
		if (typeof value === "string") return new Date(value.replaceAll("\"", ""));
		if (this.config.mode === "timestamp") return /* @__PURE__ */ new Date(value * 1e3);
		return new Date(value);
	};
	mapToDriverValue = (value) => {
		if (typeof value === "number") return value;
		const unix = value.getTime();
		if (this.config.mode === "timestamp") return Math.floor(unix / 1e3);
		return unix;
	};
};
var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
	static [entityKind] = "SQLiteBooleanBuilder";
	constructor(name, mode) {
		super(name, "boolean", "SQLiteBoolean");
		this.config.mode = mode;
	}
	build(table) {
		return new SQLiteBoolean(table, this.config);
	}
};
var SQLiteBoolean = class extends SQLiteBaseInteger {
	static [entityKind] = "SQLiteBoolean";
	mode = this.config.mode;
	mapFromDriverValue = (value) => {
		return Number(value) === 1;
	};
	mapToDriverValue = (value) => {
		return value ? 1 : 0;
	};
};
function integer(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") return new SQLiteTimestampBuilder(name, config.mode);
	if (config?.mode === "boolean") return new SQLiteBooleanBuilder(name, config.mode);
	return new SQLiteIntegerBuilder(name);
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/numeric.js
var SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteNumericBuilder";
	constructor(name) {
		super(name, "string numeric", "SQLiteNumeric");
	}
	/** @internal */
	build(table) {
		return new SQLiteNumeric(table, this.config);
	}
};
var SQLiteNumeric = class extends SQLiteColumn {
	static [entityKind] = "SQLiteNumeric";
	mapFromDriverValue = (value) => {
		if (typeof value === "string") return value;
		return String(value);
	};
	getSQLType() {
		return "numeric";
	}
};
var SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteNumericNumberBuilder";
	constructor(name) {
		super(name, "number", "SQLiteNumericNumber");
	}
	/** @internal */
	build(table) {
		return new SQLiteNumericNumber(table, this.config);
	}
};
var SQLiteNumericNumber = class extends SQLiteColumn {
	static [entityKind] = "SQLiteNumericNumber";
	mapFromDriverValue = (value) => {
		if (typeof value === "number") return value;
		return Number(value);
	};
	mapToDriverValue = String;
	getSQLType() {
		return "numeric";
	}
};
var SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteNumericBigIntBuilder";
	constructor(name) {
		super(name, "bigint int64", "SQLiteNumericBigInt");
	}
	/** @internal */
	build(table) {
		return new SQLiteNumericBigInt(table, this.config);
	}
};
var SQLiteNumericBigInt = class extends SQLiteColumn {
	static [entityKind] = "SQLiteNumericBigInt";
	mapFromDriverValue = BigInt;
	mapToDriverValue = String;
	getSQLType() {
		return "numeric";
	}
};
function numeric(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	const mode = config?.mode;
	return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/real.js
var SQLiteRealBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteRealBuilder";
	constructor(name) {
		super(name, "number double", "SQLiteReal");
	}
	/** @internal */
	build(table) {
		return new SQLiteReal(table, this.config);
	}
};
var SQLiteReal = class extends SQLiteColumn {
	static [entityKind] = "SQLiteReal";
	getSQLType() {
		return "real";
	}
};
function real(name) {
	return new SQLiteRealBuilder(name ?? "");
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/text.js
var SQLiteTextBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteTextBuilder";
	constructor(name, config) {
		super(name, config.enum?.length ? "string enum" : "string", "SQLiteText");
		this.config.enumValues = config.enum;
		this.config.length = config.length;
	}
	/** @internal */
	build(table) {
		return new SQLiteText(table, this.config);
	}
};
var SQLiteText = class extends SQLiteColumn {
	static [entityKind] = "SQLiteText";
	enumValues = this.config.enumValues;
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return `text${this.config.length ? `(${this.config.length})` : ""}`;
	}
};
var SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteTextJsonBuilder";
	constructor(name) {
		super(name, "object json", "SQLiteTextJson");
	}
	/** @internal */
	build(table) {
		return new SQLiteTextJson(table, this.config);
	}
};
var SQLiteTextJson = class extends SQLiteColumn {
	static [entityKind] = "SQLiteTextJson";
	getSQLType() {
		return "text";
	}
	mapFromDriverValue = (value) => {
		return JSON.parse(value);
	};
	mapToDriverValue = (value) => {
		return JSON.stringify(value);
	};
};
function text(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config.mode === "json") return new SQLiteTextJsonBuilder(name);
	return new SQLiteTextBuilder(name, config);
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
	return {
		blob,
		customType,
		integer,
		numeric,
		real,
		text
	};
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((acc, word, i) => {
		return acc + (i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`);
	}, "");
}
function getCasingFn(casing) {
	if (casing === "snake_case") return toSnakeCase;
	if (casing === "camelCase") return toCamelCase;
	return (name) => name;
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/table.js
/** @internal */
var InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var SQLiteTable = class extends Table {
	static [entityKind] = "SQLiteTable";
	/** @internal */
	static Symbol = Object.assign({}, Table.Symbol, { InlineForeignKeys });
	/** @internal */
	[Table.Symbol.Columns];
	/** @internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[Table.Symbol.ExtraConfigBuilder] = void 0;
};
/** @internal */
function sqliteTableBase(name, columns, extraConfig, schema, casing, baseName = name) {
	const casingFn = getCasingFn(casing);
	const rawTable = new SQLiteTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name, casingFn);
		const column = colBuilder.build(rawTable).postBuild();
		rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
		return [name, column];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[Table.Symbol.Columns] = builtColumns;
	table[Table.Symbol.ExtraConfigColumns] = builtColumns;
	if (extraConfig) table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return table;
}
/** @internal */
function sqliteTableWithCasing(casing) {
	return (name, columns, extraConfig) => sqliteTableBase(name, columns, extraConfig, void 0, casing);
}
var sqliteTable = sqliteTableWithCasing(void 0);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/primary-keys.js
function primaryKey(...config) {
	if (config[0].columns) return new PrimaryKeyBuilder(config[0].columns, config[0].name);
	return new PrimaryKeyBuilder(config);
}
var PrimaryKeyBuilder = class {
	static [entityKind] = "SQLitePrimaryKeyBuilder";
	/** @internal */
	columns;
	/** @internal */
	name;
	constructor(columns, name) {
		this.columns = columns;
		this.name = name;
	}
	/** @internal */
	build(table) {
		return new PrimaryKey(table, this.columns, this.name);
	}
};
var PrimaryKey = class {
	static [entityKind] = "SQLitePrimaryKey";
	columns;
	name;
	isNameExplicit;
	constructor(table, columns, name) {
		this.table = table;
		this.columns = columns;
		this.name = name;
		this.isNameExplicit = !!name;
	}
	getName() {
		return this.name ?? `${this.table[SQLiteTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/utils.js
function extractUsedTable(table) {
	if (is(table, SQLiteTable)) return [`${table[Table.Symbol.BaseName]}`];
	if (is(table, Subquery)) return table._.usedTables ?? [];
	if (is(table, SQL)) return table.usedTables ?? [];
	return [];
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var SQLiteDeleteBase = class {
	static [entityKind] = "SQLiteDelete";
	/** @internal */
	config;
	constructor(table, session, dialect, withList) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.config = {
			table,
			withList
		};
	}
	/**
	* Adds a `where` clause to the query.
	*
	* Calling this method will delete only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/delete}
	*
	* @param where the `where` clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be deleted.
	*
	* ```ts
	* // Delete all cars with green color
	* db.delete(cars).where(eq(cars.color, 'green'));
	* // or
	* db.delete(cars).where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Delete all BMW cars with a green color
	* db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Delete all cars with the green or blue color
	* db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		this.config.where = where;
		return this;
	}
	orderBy(...columns) {
		if (typeof columns[0] === "function") {
			const orderBy = columns[0](new Proxy(this.config.table[Table.Symbol.Columns], new SelectionProxyHandler({
				sqlAliasedBehavior: "alias",
				sqlBehavior: "sql"
			})));
			const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
			this.config.orderBy = orderByArray;
		} else {
			const orderByArray = columns;
			this.config.orderBy = orderByArray;
		}
		return this;
	}
	limit(limit) {
		this.config.limit = limit;
		return this;
	}
	returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
		this.config.returning = orderSelectedFields(fields);
		return this;
	}
	getSQL() {
		return this.dialect.buildDeleteQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	$dynamic() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/delete.js
var SQLiteAsyncDeleteBase = class extends SQLiteDeleteBase {
	static [entityKind] = "SQLiteAsyncDelete";
	/** @internal */
	_prepare(prepare = false) {
		return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), "arrays", prepare, this.config.returning ? "all" : "run", this.config.returning ? this.dialect.mapperGenerators.rows(this.config.returning, void 0) : void 0, {
			type: "delete",
			tables: extractUsedTable(this.config.table)
		});
	}
	prepare() {
		return this._prepare(true);
	}
	run = (placeholderValues) => {
		return this._prepare().run(placeholderValues);
	};
	all = (placeholderValues) => {
		return this._prepare().all(placeholderValues);
	};
	get = (placeholderValues) => {
		return this._prepare().get(placeholderValues);
	};
	values = (placeholderValues) => {
		return this._prepare().values(placeholderValues);
	};
	async execute(placeholderValues) {
		return this._prepare().execute(placeholderValues);
	}
};
applyMixins(SQLiteAsyncDeleteBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/view-base.js
var SQLiteViewBase = class extends View {
	static [entityKind] = "SQLiteViewBase";
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
	static [entityKind] = "TypedQueryBuilder";
	/** @internal */
	getSelectedFields() {
		return this._.selectedFields;
	}
	/** @internal */
	withoutSelectionCastCodecs() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/select.js
var SQLiteSelectBuilder = class {
	static [entityKind] = "SQLiteSelectBuilder";
	fields;
	session;
	dialect;
	withList;
	distinct;
	constructor(config, builder = SQLiteSelectBase) {
		this.builder = builder;
		this.fields = config.fields;
		this.session = config.session;
		this.dialect = config.dialect;
		this.withList = config.withList;
		this.distinct = config.distinct;
	}
	from(source) {
		const isPartialSelect = !!this.fields;
		let fields;
		if (this.fields) fields = this.fields;
		else if (is(source, Subquery)) fields = Object.fromEntries(Object.keys(source._.selectedFields).map((key) => [key, source[key]]));
		else if (is(source, SQLiteViewBase)) fields = source[ViewBaseConfig].selectedFields;
		else if (is(source, SQL)) fields = {};
		else fields = getTableColumns(source);
		return new this.builder({
			table: source,
			fields,
			isPartialSelect,
			session: this.session,
			dialect: this.dialect,
			withList: this.withList ?? [],
			distinct: this.distinct
		});
	}
};
var SQLiteSelectBase = class extends TypedQueryBuilder {
	static [entityKind] = "SQLiteSelectQueryBuilder";
	_;
	/** @internal */
	config;
	joinsNotNullableMap;
	tableName;
	isPartialSelect;
	session;
	dialect;
	cacheConfig = void 0;
	usedTables = /* @__PURE__ */ new Set();
	constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
		super();
		this.config = {
			withList,
			table,
			fields: { ...fields },
			distinct,
			setOperators: []
		};
		this.isPartialSelect = isPartialSelect;
		this.session = session;
		this.dialect = dialect;
		this._ = {
			selectedFields: fields,
			config: this.config
		};
		this.tableName = getTableLikeName(table);
		this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
		for (const item of extractUsedTable(table)) this.usedTables.add(item);
	}
	/** @internal */
	getUsedTables() {
		return [...this.usedTables];
	}
	createJoin(joinType) {
		return (table, on) => {
			const baseTableName = this.tableName;
			const tableName = getTableLikeName(table);
			for (const item of extractUsedTable(table)) this.usedTables.add(item);
			if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) throw new Error(`Alias "${tableName}" is already used in this query`);
			if (!this.isPartialSelect) {
				if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") this.config.fields = { [baseTableName]: this.config.fields };
				if (typeof tableName === "string" && !is(table, SQL)) {
					const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
					this.config.fields[tableName] = selection;
				}
			}
			if (typeof on === "function") on = on(new Proxy(this.config.fields, new SelectionProxyHandler({
				sqlAliasedBehavior: "sql",
				sqlBehavior: "sql"
			})));
			if (!this.config.joins) this.config.joins = [];
			this.config.joins.push({
				on,
				table,
				joinType,
				alias: tableName
			});
			if (typeof tableName === "string") switch (joinType) {
				case "left":
					this.joinsNotNullableMap[tableName] = false;
					break;
				case "right":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "cross":
				case "inner":
					this.joinsNotNullableMap[tableName] = true;
					break;
				case "full":
					this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
					this.joinsNotNullableMap[tableName] = false;
					break;
			}
			return this;
		};
	}
	/**
	* Executes a `left join` operation by adding another table to the current query.
	*
	* Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
	*   .from(users)
	*   .leftJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .leftJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	leftJoin = this.createJoin("left");
	/**
	* Executes a `right join` operation by adding another table to the current query.
	*
	* Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
	*   .from(users)
	*   .rightJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .rightJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	rightJoin = this.createJoin("right");
	/**
	* Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
	*
	* Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
	*   .from(users)
	*   .innerJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .innerJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	innerJoin = this.createJoin("inner");
	/**
	* Executes a `full join` operation by combining rows from two tables into a new table.
	*
	* Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
	*
	* @param table the table to join.
	* @param on the `on` clause.
	*
	* @example
	*
	* ```ts
	* // Select all users and their pets
	* const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
	*   .from(users)
	*   .fullJoin(pets, eq(users.id, pets.ownerId))
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .fullJoin(pets, eq(users.id, pets.ownerId))
	* ```
	*/
	fullJoin = this.createJoin("full");
	/**
	* Executes a `cross join` operation by combining rows from two tables into a new table.
	*
	* Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
	*
	* See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
	*
	* @param table the table to join.
	*
	* @example
	*
	* ```ts
	* // Select all users, each user with every pet
	* const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
	*   .from(users)
	*   .crossJoin(pets)
	*
	* // Select userId and petId
	* const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
	*   userId: users.id,
	*   petId: pets.id,
	* })
	*   .from(users)
	*   .crossJoin(pets)
	* ```
	*/
	crossJoin = this.createJoin("cross");
	createSetOperator(type, isAll) {
		return (rightSelection) => {
			const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
			if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
			this.config.setOperators.push({
				type,
				isAll,
				rightSelect
			});
			return this;
		};
	}
	/**
	* Adds `union` set operator to the query.
	*
	* Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
	*
	* @example
	*
	* ```ts
	* // Select all unique names from customers and users tables
	* await db.select({ name: users.name })
	*   .from(users)
	*   .union(
	*     db.select({ name: customers.name }).from(customers)
	*   );
	* // or
	* import { union } from 'drizzle-orm/sqlite-core'
	*
	* await union(
	*   db.select({ name: users.name }).from(users),
	*   db.select({ name: customers.name }).from(customers)
	* );
	* ```
	*/
	union = this.createSetOperator("union", false);
	/**
	* Adds `union all` set operator to the query.
	*
	* Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
	*
	* @example
	*
	* ```ts
	* // Select all transaction ids from both online and in-store sales
	* await db.select({ transaction: onlineSales.transactionId })
	*   .from(onlineSales)
	*   .unionAll(
	*     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
	*   );
	* // or
	* import { unionAll } from 'drizzle-orm/sqlite-core'
	*
	* await unionAll(
	*   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
	*   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
	* );
	* ```
	*/
	unionAll = this.createSetOperator("union", true);
	/**
	* Adds `intersect` set operator to the query.
	*
	* Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
	*
	* @example
	*
	* ```ts
	* // Select course names that are offered in both departments A and B
	* await db.select({ courseName: depA.courseName })
	*   .from(depA)
	*   .intersect(
	*     db.select({ courseName: depB.courseName }).from(depB)
	*   );
	* // or
	* import { intersect } from 'drizzle-orm/sqlite-core'
	*
	* await intersect(
	*   db.select({ courseName: depA.courseName }).from(depA),
	*   db.select({ courseName: depB.courseName }).from(depB)
	* );
	* ```
	*/
	intersect = this.createSetOperator("intersect", false);
	/**
	* Adds `except` set operator to the query.
	*
	* Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
	*
	* @example
	*
	* ```ts
	* // Select all courses offered in department A but not in department B
	* await db.select({ courseName: depA.courseName })
	*   .from(depA)
	*   .except(
	*     db.select({ courseName: depB.courseName }).from(depB)
	*   );
	* // or
	* import { except } from 'drizzle-orm/sqlite-core'
	*
	* await except(
	*   db.select({ courseName: depA.courseName }).from(depA),
	*   db.select({ courseName: depB.courseName }).from(depB)
	* );
	* ```
	*/
	except = this.createSetOperator("except", false);
	/** @internal */
	addSetOperators(setOperators) {
		this.config.setOperators.push(...setOperators);
		return this;
	}
	/**
	* Adds a `where` clause to the query.
	*
	* Calling this method will select only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#filtering}
	*
	* @param where the `where` clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be selected.
	*
	* ```ts
	* // Select all cars with green color
	* await db.select().from(cars).where(eq(cars.color, 'green'));
	* // or
	* await db.select().from(cars).where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Select all BMW cars with a green color
	* await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Select all cars with the green or blue color
	* await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		if (typeof where === "function") where = where(new Proxy(this.config.fields, new SelectionProxyHandler({
			sqlAliasedBehavior: "sql",
			sqlBehavior: "sql"
		})));
		this.config.where = where;
		return this;
	}
	/**
	* Adds a `having` clause to the query.
	*
	* Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
	*
	* @param having the `having` clause.
	*
	* @example
	*
	* ```ts
	* // Select all brands with more than one car
	* await db.select({
	* 	brand: cars.brand,
	* 	count: sql<number>`cast(count(${cars.id}) as int)`,
	* })
	*   .from(cars)
	*   .groupBy(cars.brand)
	*   .having(({ count }) => gt(count, 1));
	* ```
	*/
	having(having) {
		if (typeof having === "function") having = having(new Proxy(this.config.fields, new SelectionProxyHandler({
			sqlAliasedBehavior: "sql",
			sqlBehavior: "sql"
		})));
		this.config.having = having;
		return this;
	}
	groupBy(...columns) {
		if (typeof columns[0] === "function") {
			const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
				sqlAliasedBehavior: "alias",
				sqlBehavior: "sql"
			})));
			this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
		} else this.config.groupBy = columns;
		return this;
	}
	orderBy(...columns) {
		if (typeof columns[0] === "function") {
			const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
				sqlAliasedBehavior: "alias",
				sqlBehavior: "sql"
			})));
			const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
			if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).orderBy = orderByArray;
			else this.config.orderBy = orderByArray;
		} else {
			const orderByArray = columns;
			if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).orderBy = orderByArray;
			else this.config.orderBy = orderByArray;
		}
		return this;
	}
	/**
	* Adds a `limit` clause to the query.
	*
	* Calling this method will set the maximum number of rows that will be returned by this query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
	*
	* @param limit the `limit` clause.
	*
	* @example
	*
	* ```ts
	* // Get the first 10 people from this query.
	* await db.select().from(people).limit(10);
	* ```
	*/
	limit(limit) {
		if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).limit = limit;
		else this.config.limit = limit;
		return this;
	}
	/**
	* Adds an `offset` clause to the query.
	*
	* Calling this method will skip a number of rows when returning results from this query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
	*
	* @param offset the `offset` clause.
	*
	* @example
	*
	* ```ts
	* // Get the 10th-20th people from this query.
	* await db.select().from(people).offset(10).limit(10);
	* ```
	*/
	offset(offset) {
		if (this.config.setOperators.length > 0) this.config.setOperators.at(-1).offset = offset;
		else this.config.offset = offset;
		return this;
	}
	$withCache(config) {
		this.cacheConfig = config === void 0 ? {
			config: {},
			enabled: true,
			autoInvalidate: true
		} : config === false ? { enabled: false } : {
			enabled: true,
			autoInvalidate: true,
			...config
		};
		return this;
	}
	getSQL() {
		this.config.fieldsFlat = orderSelectedFields(this.config.fields);
		return this.dialect.buildSelectQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	as(alias) {
		const usedTables = [];
		usedTables.push(...extractUsedTable(this.config.table));
		if (this.config.joins) for (const it of this.config.joins) usedTables.push(...extractUsedTable(it.table));
		return new Proxy(new Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]), new SelectionProxyHandler({
			alias,
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		}));
	}
	/** @internal */
	getSelectedFields() {
		return new Proxy(this.config.fields, new SelectionProxyHandler({
			alias: this.tableName,
			sqlAliasedBehavior: "alias",
			sqlBehavior: "error"
		}));
	}
	/** @internal */
	withoutSelectionCastCodecs() {
		return this;
	}
	$dynamic() {
		return this;
	}
};
function createSetOperator(type, isAll) {
	return (leftSelect, rightSelect, ...restSelects) => {
		const setOperators = [rightSelect, ...restSelects].map((select) => ({
			type,
			isAll,
			rightSelect: select
		}));
		for (const setOperator of setOperators) if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
		return leftSelect.addSetOperators(setOperators);
	};
}
var getSQLiteSetOperators = () => ({
	union,
	unionAll,
	intersect,
	except
});
/**
* Adds `union` set operator to the query.
*
* Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
*
* @example
*
* ```ts
* // Select all unique names from customers and users tables
* import { union } from 'drizzle-orm/sqlite-core'
*
* await union(
*   db.select({ name: users.name }).from(users),
*   db.select({ name: customers.name }).from(customers)
* );
* // or
* await db.select({ name: users.name })
*   .from(users)
*   .union(
*     db.select({ name: customers.name }).from(customers)
*   );
* ```
*/
var union = createSetOperator("union", false);
/**
* Adds `union all` set operator to the query.
*
* Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
*
* @example
*
* ```ts
* // Select all transaction ids from both online and in-store sales
* import { unionAll } from 'drizzle-orm/sqlite-core'
*
* await unionAll(
*   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
*   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
* );
* // or
* await db.select({ transaction: onlineSales.transactionId })
*   .from(onlineSales)
*   .unionAll(
*     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
*   );
* ```
*/
var unionAll = createSetOperator("union", true);
/**
* Adds `intersect` set operator to the query.
*
* Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
*
* @example
*
* ```ts
* // Select course names that are offered in both departments A and B
* import { intersect } from 'drizzle-orm/sqlite-core'
*
* await intersect(
*   db.select({ courseName: depA.courseName }).from(depA),
*   db.select({ courseName: depB.courseName }).from(depB)
* );
* // or
* await db.select({ courseName: depA.courseName })
*   .from(depA)
*   .intersect(
*     db.select({ courseName: depB.courseName }).from(depB)
*   );
* ```
*/
var intersect = createSetOperator("intersect", false);
/**
* Adds `except` set operator to the query.
*
* Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
*
* See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
*
* @example
*
* ```ts
* // Select all courses offered in department A but not in department B
* import { except } from 'drizzle-orm/sqlite-core'
*
* await except(
*   db.select({ courseName: depA.courseName }).from(depA),
*   db.select({ courseName: depB.courseName }).from(depB)
* );
* // or
* await db.select({ courseName: depA.courseName })
*   .from(depA)
*   .except(
*     db.select({ courseName: depB.courseName }).from(depB)
*   );
* ```
*/
var except = createSetOperator("except", false);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
	static [entityKind] = "DrizzleError";
	constructor({ message, cause }) {
		super(message);
		this.name = "DrizzleError";
		this.cause = cause;
	}
};
var DrizzleQueryError = class DrizzleQueryError extends Error {
	static [entityKind] = "DrizzleQueryError";
	constructor(query, params, cause) {
		super(`Failed query: ${query}\nparams: ${params}`);
		this.query = query;
		this.params = params;
		this.cause = cause;
		this.name = "DrizzleQueryError";
		Error.captureStackTrace(this, DrizzleQueryError);
		if (cause) this.cause = cause;
	}
};
var TransactionRollbackError = class extends DrizzleError {
	static [entityKind] = "TransactionRollbackError";
	constructor() {
		super({ message: "Rollback" });
		this.name = "TransactionRollbackError";
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
	if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) return new Param(value, column);
	return value;
}
/**
* Test that two values are equal.
*
* Remember that the SQL standard dictates that
* two NULL values are not equal, so if you want to test
* whether a value is null, you may want to use
* `isNull` instead.
*
* ## Examples
*
* ```ts
* // Select cars made by Ford
* db.select().from(cars)
*   .where(eq(cars.make, 'Ford'))
* ```
*
* @see isNull for a way to test equality to NULL.
*/
var eq = (left, right) => {
	return sql`${left} = ${bindIfParam(right, left)}`;
};
/**
* Test that two values are not equal.
*
* Remember that the SQL standard dictates that
* two NULL values are not equal, so if you want to test
* whether a value is not null, you may want to use
* `isNotNull` instead.
*
* ## Examples
*
* ```ts
* // Select cars not made by Ford
* db.select().from(cars)
*   .where(ne(cars.make, 'Ford'))
* ```
*
* @see isNotNull for a way to test whether a value is not null.
*/
var ne = (left, right) => {
	return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions.map((c) => sql`(${c})`), new StringChunk(" and ")),
		new StringChunk(")")
	]);
}
function or(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions.map((c) => sql`(${c})`), new StringChunk(" or ")),
		new StringChunk(")")
	]);
}
/**
* Negate the meaning of an expression using the `not` keyword.
*
* ## Examples
*
* ```ts
* // Select cars _not_ made by GM or Ford.
* db.select().from(cars)
*   .where(not(inArray(cars.make, ['GM', 'Ford'])))
* ```
*/
function not(condition) {
	if (!condition) return void 0;
	return is(condition, SQL) ? sql`not (${condition})` : sql`not ${condition}`;
}
/**
* Test that the first expression passed is greater than
* the second expression.
*
* ## Examples
*
* ```ts
* // Select cars made after 2000.
* db.select().from(cars)
*   .where(gt(cars.year, 2000))
* ```
*
* @see gte for greater-than-or-equal
*/
var gt = (left, right) => {
	return sql`${left} > ${bindIfParam(right, left)}`;
};
/**
* Test that the first expression passed is greater than
* or equal to the second expression. Use `gt` to
* test whether an expression is strictly greater
* than another.
*
* ## Examples
*
* ```ts
* // Select cars made on or after 2000.
* db.select().from(cars)
*   .where(gte(cars.year, 2000))
* ```
*
* @see gt for a strictly greater-than condition
*/
var gte = (left, right) => {
	return sql`${left} >= ${bindIfParam(right, left)}`;
};
/**
* Test that the first expression passed is less than
* the second expression.
*
* ## Examples
*
* ```ts
* // Select cars made before 2000.
* db.select().from(cars)
*   .where(lt(cars.year, 2000))
* ```
*
* @see lte for less-than-or-equal
*/
var lt = (left, right) => {
	return sql`${left} < ${bindIfParam(right, left)}`;
};
/**
* Test that the first expression passed is less than
* or equal to the second expression.
*
* ## Examples
*
* ```ts
* // Select cars made before 2000.
* db.select().from(cars)
*   .where(lte(cars.year, 2000))
* ```
*
* @see lt for a strictly less-than condition
*/
var lte = (left, right) => {
	return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`1 = 0`;
		return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`1 = 1`;
		return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} not in ${bindIfParam(values, column)}`;
}
/**
* Test whether an expression is NULL. By the SQL standard,
* NULL is neither equal nor not equal to itself, so
* it's recommended to use `isNull` and `notIsNull` for
* comparisons to NULL.
*
* ## Examples
*
* ```ts
* // Select cars that have no discontinuedAt date.
* db.select().from(cars)
*   .where(isNull(cars.discontinuedAt))
* ```
*
* @see isNotNull for the inverse of this test
*/
function isNull(value) {
	return sql`(${value} is null)`;
}
/**
* Test whether an expression is not NULL. By the SQL standard,
* NULL is neither equal nor not equal to itself, so
* it's recommended to use `isNull` and `notIsNull` for
* comparisons to NULL.
*
* ## Examples
*
* ```ts
* // Select cars that have been discontinued.
* db.select().from(cars)
*   .where(isNotNull(cars.discontinuedAt))
* ```
*
* @see isNull for the inverse of this test
*/
function isNotNull(value) {
	return sql`(${value} is not null)`;
}
/**
* Test whether a subquery evaluates to have any rows.
*
* ## Examples
*
* ```ts
* // Users whose `homeCity` column has a match in a cities
* // table.
* db
*   .select()
*   .from(users)
*   .where(
*     exists(db.select()
*       .from(cities)
*       .where(eq(users.homeCity, cities.id))),
*   );
* ```
*
* @see notExists for the inverse of this test
*/
function exists$1(subquery) {
	return sql`exists ${subquery}`;
}
/**
* Test whether a subquery doesn't include any result
* rows.
*
* ## Examples
*
* ```ts
* // Users whose `homeCity` column doesn't match
* // a row in the cities table.
* db
*   .select()
*   .from(users)
*   .where(
*     notExists(db.select()
*       .from(cities)
*       .where(eq(users.homeCity, cities.id))),
*   );
* ```
*
* @see exists for the inverse of this test
*/
function notExists(subquery) {
	return sql`not exists ${subquery}`;
}
function between(column, min, max) {
	return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function notBetween(column, min, max) {
	return sql`${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
/**
* Compare a column to a pattern, which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* ## Examples
*
* ```ts
* // Select all cars with 'Turbo' in their names.
* db.select().from(cars)
*   .where(like(cars.name, '%Turbo%'))
* ```
*
* @see ilike for a case-insensitive version of this condition
*/
function like(column, value) {
	return sql`${column} like ${value}`;
}
/**
* The inverse of like - this tests that a given column
* does not match a pattern, which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* ## Examples
*
* ```ts
* // Select all cars that don't have "ROver" in their name.
* db.select().from(cars)
*   .where(notLike(cars.name, '%Rover%'))
* ```
*
* @see like for the inverse condition
* @see notIlike for a case-insensitive version of this condition
*/
function notLike(column, value) {
	return sql`${column} not like ${value}`;
}
/**
* Case-insensitively compare a column to a pattern,
* which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* Unlike like, this performs a case-insensitive comparison.
*
* ## Examples
*
* ```ts
* // Select all cars with 'Turbo' in their names.
* db.select().from(cars)
*   .where(ilike(cars.name, '%Turbo%'))
* ```
*
* @see like for a case-sensitive version of this condition
*/
function ilike(column, value) {
	return sql`${column} ilike ${value}`;
}
/**
* The inverse of ilike - this case-insensitively tests that a given column
* does not match a pattern, which can include `%` and `_`
* characters to match multiple variations. Including `%`
* in the pattern matches zero or more characters, and including
* `_` will match a single character.
*
* ## Examples
*
* ```ts
* // Select all cars that don't have "Rover" in their name.
* db.select().from(cars)
*   .where(notLike(cars.name, '%Rover%'))
* ```
*
* @see ilike for the inverse condition
* @see notLike for a case-sensitive version of this condition
*/
function notIlike(column, value) {
	return sql`${column} not ilike ${value}`;
}
function arrayContains(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("arrayContains requires at least one value");
		const par = bindIfParam(values, column);
		return sql`${column} @> ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
	}
	return sql`${column} @> ${bindIfParam(values, column)}`;
}
function arrayContained(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("arrayContained requires at least one value");
		const par = bindIfParam(values, column);
		return sql`${column} <@ ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
	}
	return sql`${column} <@ ${bindIfParam(values, column)}`;
}
function arrayOverlaps(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("arrayOverlaps requires at least one value");
		const par = bindIfParam(values, column);
		return sql`${column} && ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
	}
	return sql`${column} && ${bindIfParam(values, column)}`;
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sql/expressions/select.js
/**
* Used in sorting, this specifies that the given
* column or expression should be sorted in ascending
* order. By the SQL standard, ascending order is the
* default, so it is not usually necessary to specify
* ascending sort order.
*
* ## Examples
*
* ```ts
* // Return cars, starting with the oldest models
* // and going in ascending order to the newest.
* db.select().from(cars)
*   .orderBy(asc(cars.year));
* ```
*
* @see desc to sort in descending order
*/
function asc(column) {
	return sql`${column} asc`;
}
/**
* Used in sorting, this specifies that the given
* column or expression should be sorted in descending
* order.
*
* ## Examples
*
* ```ts
* // Select users, with the most recently created
* // records coming first.
* db.select().from(users)
*   .orderBy(desc(users.createdAt));
* ```
*
* @see asc to sort in ascending order
*/
function desc(column) {
	return sql`${column} desc`;
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/relations.js
var operators = {
	and,
	between,
	eq,
	exists: exists$1,
	gt,
	gte,
	ilike,
	inArray,
	arrayContains,
	arrayContained,
	arrayOverlaps,
	isNull,
	isNotNull,
	like,
	lt,
	lte,
	ne,
	not,
	notBetween,
	notExists,
	notLike,
	notIlike,
	notInArray,
	or,
	sql
};
var orderByOperators = {
	sql,
	asc,
	desc
};
function mapRelationalRow(rows, isOne, buildQueryResultSelection, parseJson = false, parseJsonIfString = false, useJsonMappers = true) {
	const maxIdx = isOne ? 1 : rows.length;
	const decoders = buildQueryResultSelection.map(({ field, fieldType, codec, arrayDimensions }) => {
		let decoder;
		switch (fieldType) {
			case "Column":
				decoder = field;
				break;
			case "SQL":
				decoder = field.decoder;
				break;
			case "SQL.Aliased":
				decoder = field.sql.decoder;
				break;
			case "Nested":
				decoder = noopDecoder;
				break;
			default: decoder = field.getSQL().decoder;
		}
		if (useJsonMappers && field.mapFromJsonValue) return (v) => field.mapFromJsonValue(v);
		return decoder.mapFromDriverValue.isNoop ? codec ? (value) => codec(value, arrayDimensions) : void 0 : codec ? (value) => decoder.mapFromDriverValue(codec(value, arrayDimensions)) : (value) => decoder.mapFromDriverValue(value);
	});
	for (let i = 0; i < maxIdx; ++i) {
		const row = isOne ? rows : rows[i];
		for (let selectionItemIdx = 0; selectionItemIdx < buildQueryResultSelection.length; ++selectionItemIdx) {
			const selectionItem = buildQueryResultSelection[selectionItemIdx];
			if (selectionItem.selection) {
				if (row[selectionItem.key] === null) continue;
				if (parseJson) {
					row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
					if (row[selectionItem.key] === null) continue;
				} else if (parseJsonIfString && typeof row[selectionItem.key] === "string") row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
				if (selectionItem.isArray) {
					mapRelationalRow(row[selectionItem.key], false, selectionItem.selection, false, parseJsonIfString);
					continue;
				}
				mapRelationalRow(row[selectionItem.key], true, selectionItem.selection, false, parseJsonIfString);
				continue;
			}
			if (row[selectionItem.key] === null) continue;
			const decoder = decoders[selectionItemIdx];
			if (!decoder) continue;
			row[selectionItem.key] = decoder(row[selectionItem.key]);
		}
	}
	return rows;
}
function mapRelationalRowFromArrays(rows, isOne, buildQueryResultSelection, parseJson = false, parseJsonIfString = false) {
	const maxIdx = isOne ? 1 : rows.length;
	const decoders = buildQueryResultSelection.map(({ field, fieldType, codec, arrayDimensions }) => {
		let decoder;
		switch (fieldType) {
			case "Column":
				decoder = field;
				break;
			case "SQL":
				decoder = field.decoder;
				break;
			case "SQL.Aliased":
				decoder = field.sql.decoder;
				break;
			case "Nested":
				decoder = noopDecoder;
				break;
			default: decoder = field.getSQL().decoder;
		}
		return decoder.mapFromDriverValue.isNoop ? codec ? (value) => codec(value, arrayDimensions) : void 0 : codec ? (value) => decoder.mapFromDriverValue(codec(value, arrayDimensions)) : (value) => decoder.mapFromDriverValue(value);
	});
	const results = new Array(maxIdx);
	for (let i = 0; i < maxIdx; ++i) {
		const row = isOne ? rows : rows[i];
		const result = {};
		for (let selectionItemIdx = 0; selectionItemIdx < buildQueryResultSelection.length; ++selectionItemIdx) {
			const selectionItem = buildQueryResultSelection[selectionItemIdx];
			let value = row[selectionItemIdx];
			if (selectionItem.selection) {
				if (value === null) {
					result[selectionItem.key] = null;
					continue;
				}
				if (parseJson) {
					value = JSON.parse(value);
					if (value === null) {
						result[selectionItem.key] = null;
						continue;
					}
				} else if (parseJsonIfString && typeof value === "string") value = JSON.parse(value);
				if (selectionItem.isArray) mapRelationalRow(value, false, selectionItem.selection, false, parseJsonIfString);
				else mapRelationalRow(value, true, selectionItem.selection, false, parseJsonIfString);
				result[selectionItem.key] = value;
				continue;
			}
			if (value === null) {
				result[selectionItem.key] = null;
				continue;
			}
			const decoder = decoders[selectionItemIdx];
			result[selectionItem.key] = decoder ? decoder(value) : value;
		}
		results[i] = result;
	}
	return isOne ? results[0] : results;
}
function makeDefaultRqbMapper({ selection, isFirst, parseJson, parseJsonIfString, rootJsonMappers, arrayModeRoot }) {
	return ((rows) => {
		if (isFirst && !rows[0]) return rows[0];
		return arrayModeRoot ? mapRelationalRowFromArrays(isFirst ? rows[0] : rows, isFirst, selection, parseJson, parseJsonIfString) : mapRelationalRow(isFirst ? rows[0] : rows, isFirst, selection, parseJson, parseJsonIfString, rootJsonMappers);
	});
}
function makeJitRqbMapperInner(selection, rowExpr, selectionVar, parseJson, parseJsonIfString, useJsonMappers, preFn, counter, accessByIdx) {
	const bodyStmts = [];
	const literalEntries = [];
	let hasWork = false;
	const fieldVars = selection.map(() => `c${counter.n++}`);
	const destructurePieces = selection.map((item, idx) => accessByIdx ? fieldVars[idx] : `${JSON.stringify(item.key)}: ${fieldVars[idx]}`);
	bodyStmts.push(accessByIdx ? `let [ ${destructurePieces.join(", ")} ] = ${rowExpr};` : `let { ${destructurePieces.join(", ")} } = ${rowExpr};`);
	for (const [idx, { field, fieldType, key, codec, isArray, selection: innerSelection, arrayDimensions }] of selection.entries()) {
		const sel = `${selectionVar}[${idx}]`;
		const keyStr = JSON.stringify(key);
		const slot = fieldVars[idx];
		if (innerSelection) {
			if (parseJson) {
				bodyStmts.push(`if (${slot} !== null) ${slot} = JSON.parse(${slot});`);
				hasWork = true;
			} else if (parseJsonIfString) {
				bodyStmts.push(`if (typeof ${slot} === 'string') ${slot} = JSON.parse(${slot});`);
				hasWork = true;
			}
			const nestedSelVar = `s${counter.n++}`;
			const savedPreFnLen = preFn.length;
			preFn.push(`const { selection: ${nestedSelVar} } = ${sel};`);
			if (isArray) {
				const j = `j${counter.n++}`;
				const inner = makeJitRqbMapperInner(innerSelection, `${slot}[${j}]`, nestedSelVar, false, parseJsonIfString, true, preFn, counter, false);
				if (inner.hasWork) {
					hasWork = true;
					bodyStmts.push(`if (${slot} !== null) {`);
					bodyStmts.push(`\tfor (let ${j} = 0; ${j} < ${slot}.length; ++${j}) {`);
					for (const s of inner.bodyStmts) bodyStmts.push(`\t\t${s}`);
					bodyStmts.push(`\t\t${slot}[${j}] = ${inner.literal};`);
					bodyStmts.push(`\t}`);
					bodyStmts.push(`}`);
				} else preFn.splice(savedPreFnLen, 1);
			} else {
				const inner = makeJitRqbMapperInner(innerSelection, slot, nestedSelVar, false, parseJsonIfString, true, preFn, counter, false);
				if (inner.hasWork) {
					hasWork = true;
					bodyStmts.push(`if (${slot} !== null) {`);
					for (const s of inner.bodyStmts) bodyStmts.push(`\t${s}`);
					bodyStmts.push(`\t${slot} = ${inner.literal};`);
					bodyStmts.push(`}`);
				} else preFn.splice(savedPreFnLen, 1);
			}
			literalEntries.push(`${keyStr}: ${slot}`);
			continue;
		}
		let decoderExpr = "";
		let destructure = "";
		let bypassCodecs = false;
		switch (fieldType) {
			case "Column":
				if (useJsonMappers && field.mapFromJsonValue) {
					bypassCodecs = true;
					const id = counter.n++;
					destructure = `field: dec${id}`;
					decoderExpr = `dec${id}.mapFromJsonValue`;
				} else if (!field.mapFromDriverValue.isNoop) {
					const id = counter.n++;
					destructure = `field: dec${id}`;
					decoderExpr = `dec${id}.mapFromDriverValue`;
				}
				break;
			case "SQL":
				if (useJsonMappers && field.decoder.mapFromJsonValue) {
					bypassCodecs = true;
					const id = counter.n++;
					destructure = `field: { decoder: dec${id} }`;
					decoderExpr = `dec${id}.mapFromJsonValue`;
				} else if (!field.decoder.mapFromDriverValue.isNoop) {
					const id = counter.n++;
					destructure = `field: { decoder: dec${id} }`;
					decoderExpr = `dec${id}.mapFromDriverValue`;
				}
				break;
			case "SQL.Aliased":
				if (useJsonMappers && field.sql.decoder.mapFromJsonValue) {
					bypassCodecs = true;
					const id = counter.n++;
					destructure = `field: { sql: { decoder: dec${id} } }`;
					decoderExpr = `dec${id}.mapFromJsonValue`;
				} else if (!field.sql.decoder.mapFromDriverValue.isNoop) {
					const id = counter.n++;
					destructure = `field: { sql: { decoder: dec${id} } }`;
					decoderExpr = `dec${id}.mapFromDriverValue`;
				}
				break;
			case "Nested": break;
			default: {
				const sqlExpr = field.getSQL();
				if (useJsonMappers && sqlExpr.decoder.mapFromJsonValue) {
					bypassCodecs = true;
					const id = counter.n++;
					preFn.push(`const dec${id} = ${sel}.field.getSQL().decoder;`);
					decoderExpr = `dec${id}.mapFromJsonValue`;
				} else if (!sqlExpr.decoder.mapFromDriverValue.isNoop) {
					const id = counter.n++;
					preFn.push(`const dec${id} = ${sel}.field.getSQL().decoder;`);
					decoderExpr = `dec${id}.mapFromDriverValue`;
				}
			}
		}
		let codecVar = "";
		if (!bypassCodecs && codec) codecVar = `codec${counter.n++}`;
		if (destructure || codecVar) {
			const parts = [];
			if (destructure) parts.push(destructure);
			if (codecVar) parts.push(`codec: ${codecVar}`);
			preFn.push(`const { ${parts.join(", ")} } = ${sel};`);
		}
		if (decoderExpr || codecVar) {
			hasWork = true;
			let decoded = slot;
			if (codecVar) decoded = `${codecVar}(${decoded}, ${arrayDimensions})`;
			if (decoderExpr) decoded = `${decoderExpr}(${decoded})`;
			literalEntries.push(`${keyStr}: ${slot} === null ? null : ${decoded}`);
		} else literalEntries.push(`${keyStr}: ${slot}`);
	}
	return {
		bodyStmts,
		literal: `{ ${literalEntries.join(", ")} }`,
		hasWork
	};
}
function makeJitRqbMapper({ selection, isFirst, parseJson, parseJsonIfString, rootJsonMappers, arrayModeRoot }) {
	const preFn = [];
	const inner = makeJitRqbMapperInner(selection, "row", "selection", parseJson, parseJsonIfString, arrayModeRoot ? false : rootJsonMappers, preFn, { n: 0 }, !!arrayModeRoot);
	const lines = [];
	lines.push(`\t"use strict";
	const { selection } = this;`);
	for (const p of preFn) lines.push(`\t${p}`);
	if (arrayModeRoot) if (isFirst) {
		lines.push(`\tconst row = rows[0];`);
		lines.push(`\tif (!row) return undefined;`);
		for (const s of inner.bodyStmts) lines.push(`\t${s}`);
		lines.push(`\treturn ${inner.literal};`);
	} else {
		lines.push(`\tconst { length } = rows;`);
		lines.push(`\tconst mapped = new Array(length);`);
		lines.push(`\tfor (let i = 0; i < length; ++i) {`);
		lines.push(`\t\tconst row = rows[i];`);
		for (const s of inner.bodyStmts) lines.push(`\t\t${s}`);
		lines.push(`\t\tmapped[i] = ${inner.literal};`);
		lines.push(`\t}`);
		lines.push(`\treturn mapped;`);
	}
	else if (!inner.hasWork) lines.push(isFirst ? `\treturn rows[0];` : `\treturn rows;`);
	else if (isFirst) {
		lines.push(`\tconst row = rows[0];`);
		lines.push(`\tif (!row) return undefined;`);
		for (const s of inner.bodyStmts) lines.push(`\t${s}`);
		lines.push(`\trows[0] = ${inner.literal};`);
		lines.push(`\treturn rows[0];`);
	} else {
		lines.push(`\tfor (let i = 0; i < rows.length; ++i) {`);
		lines.push(`\t\tconst row = rows[i];`);
		for (const s of inner.bodyStmts) lines.push(`\t\t${s}`);
		lines.push(`\t\trows[i] = ${inner.literal};`);
		lines.push(`\t}`);
		lines.push(`\treturn rows;`);
	}
	lines.push("	//# sourceURL=drizzle:jit-relational-query-mapper");
	const compiled = lines.join("\n");
	return Object.assign(new FnConstructor("rows", compiled).bind({ selection }), { body: `function jitRqbMapper (rows) {\n${compiled}\n}` });
}
/** @internal */
function fieldSelectionToSQL(table, target) {
	const field = table[TableColumns][target];
	return field ? is(field, Column) ? field : is(field, SQL.Aliased) ? sql`${table}.${sql.identifier(field.fieldAlias)}` : sql`${table}.${sql.identifier(target)}` : sql`${table}.${sql.identifier(target)}`;
}
function relationsFieldFilterToSQL(column, filter) {
	if (filter === EmptyFilter) return void 0;
	if (filter === void 0) throw new Error(`Unexpected 'undefined' in filter value. Use 'EmptyFilter' if you want the filter field to be skipped.`);
	if (typeof filter !== "object" || is(filter, Placeholder)) return eq(column, filter);
	const entries = Object.entries(filter);
	if (!entries.length) return void 0;
	const parts = [];
	for (const [target, value] of entries) {
		if (value === EmptyFilter) continue;
		if (value === void 0) throw new Error(`Unexpected 'undefined' in filter value. Use 'EmptyFilter' if you want the filter field to be skipped.`);
		switch (target) {
			case "NOT": {
				const res = relationsFieldFilterToSQL(column, value);
				if (!res) continue;
				parts.push(not(res));
				continue;
			}
			case "OR":
				if (!value.length) throw new Error("Unexpected empty array in filters' 'OR' section. Omit field or use 'EmptyFilter' if you want filter to be skipped.");
				parts.push(or(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
				continue;
			case "AND":
				if (!value.length) throw new Error("Unexpected empty array in filters' 'AND' section. Omit field or use 'EmptyFilter' if you want filter to be skipped.");
				parts.push(and(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
				continue;
			case "isNotNull":
			case "isNull":
				if (!value) continue;
				parts.push(operators[target](column));
				continue;
			case "in":
				parts.push(operators.inArray(column, value));
				continue;
			case "notIn":
				parts.push(operators.notInArray(column, value));
				continue;
			default:
				parts.push(operators[target](column, value));
				continue;
		}
	}
	if (!parts.length) return void 0;
	return and(...parts);
}
function relationsFilterToSQL(table, filter, tableRelations = {}, tablesRelations = {}, depth = 0) {
	if (filter === EmptyFilter) return void 0;
	if (filter === void 0) throw new Error(`Unexpected 'undefined' in filter value. Use 'EmptyFilter' if you want the filter field to be skipped.`);
	const entries = Object.entries(filter);
	if (!entries.length) return void 0;
	const parts = [];
	for (const [target, value] of entries) {
		if (value === EmptyFilter) continue;
		if (value === void 0) throw new Error(`Unexpected 'undefined' in filter value. Use 'EmptyFilter' if you want the filter field to be skipped.`);
		switch (target) {
			case "RAW": {
				const processed = typeof value === "function" ? value(table, operators) : value.getSQL();
				if (processed === EmptyFilter) continue;
				parts.push(processed);
				continue;
			}
			case "OR":
				if (!value.length) throw new Error("Unexpected empty array in filters' 'OR' section. Omit field or use 'EmptyFilter' if you want filter to be skipped.");
				parts.push(or(...value.map((subFilter) => relationsFilterToSQL(table, subFilter, tableRelations, tablesRelations, depth))));
				continue;
			case "AND":
				if (!value.length) throw new Error("Unexpected empty array in filters' 'AND' section. Omit field or use 'EmptyFilter' if you want filter to be skipped.");
				parts.push(and(...value.map((subFilter) => relationsFilterToSQL(table, subFilter, tableRelations, tablesRelations, depth))));
				continue;
			case "NOT": {
				const built = relationsFilterToSQL(table, value, tableRelations, tablesRelations, depth);
				if (!built) continue;
				parts.push(not(built));
				continue;
			}
			default: {
				if (Object.prototype.hasOwnProperty.call(table[TableColumns], target) && table[TableColumns][target]) {
					const colFilter = relationsFieldFilterToSQL(fieldSelectionToSQL(table, target), value);
					if (colFilter) parts.push(colFilter);
					continue;
				}
				const relation = Object.prototype.hasOwnProperty.call(tableRelations, target) ? tableRelations[target] : void 0;
				if (!relation) throw new DrizzleError({ message: `Unknown relational filter field: "${target}"` });
				const targetTable = aliasedTable(relation.targetTable, `f${depth}`);
				const throughTable = relation.throughTable ? aliasedTable(relation.throughTable, `ft${depth}`) : void 0;
				const targetConfig = tablesRelations[relation.targetTableName];
				const { filter: relationFilter, joinCondition } = relationToSQL(relation, table, targetTable, throughTable);
				const filter = and(relationFilter, typeof value === "boolean" ? void 0 : relationsFilterToSQL(targetTable, value, targetConfig.relations, tablesRelations, depth + 1));
				const subquery = throughTable ? sql`(select * from ${getTableAsAliasSQL(targetTable)} inner join ${getTableAsAliasSQL(throughTable)} on ${joinCondition}${sql` where ${filter}`.if(filter)} limit 1)` : sql`(select * from ${getTableAsAliasSQL(targetTable)}${sql` where ${filter}`.if(filter)} limit 1)`;
				if (filter) parts.push((value ? exists$1 : notExists)(subquery));
			}
		}
	}
	return and(...parts);
}
function relationsOrderToSQL(table, orders) {
	if (typeof orders === "function") {
		const data = orders(table, orderByOperators);
		if (!data) return void 0;
		return is(data, SQL) ? data : Array.isArray(data) ? data.length ? sql.join(data.map((o) => is(o, SQL) ? o : asc(o)), new StringChunk(`, `)) : void 0 : is(data, Column) ? asc(data) : void 0;
	}
	const entries = Object.entries(orders).filter(([_, value]) => value);
	if (!entries.length) return void 0;
	return sql.join(entries.map(([target, value]) => (value === "asc" ? asc : desc)(fieldSelectionToSQL(table, target))), new StringChunk(`, `));
}
function relationExtrasToSQL(table, extras, codecs, inJson) {
	const subqueries = [];
	const selection = [];
	for (const [key, field] of Object.entries(extras)) {
		const extra = typeof field === "function" ? field(table, { sql: operators.sql }) : field;
		if (!extra) continue;
		const subq = extra.getSQL();
		const column = codecs ? getColumnFromDecoder(subq) : void 0;
		const query = column && (!inJson || !column.jsonSelectIdentifier) ? sql`${codecs.apply(column, inJson ? "castInJson" : "cast", sql`(${subq})`)} as ${sql.identifier(key)}` : sql`(${subq}) as ${sql.identifier(key)}`;
		query.decoder = subq.decoder;
		subqueries.push(query);
		selection.push(column && (!inJson || !column.mapFromJsonValue) ? {
			key,
			field: query,
			fieldType: "SQL",
			codec: codecs.get(column, inJson ? "normalizeInJson" : "normalize"),
			arrayDimensions: column.dimensions
		} : {
			key,
			field: query,
			fieldType: "SQL"
		});
	}
	return {
		sql: subqueries.length ? sql.join(subqueries, new StringChunk(`, `)) : void 0,
		selection
	};
}
function relationToSQL(relation, sourceTable, targetTable, throughTable) {
	if (relation.through) {
		const outerColumnWhere = relation.sourceColumns.map((s, i) => {
			const t = relation.through.source[i];
			return eq(sql`${sourceTable}.${sql.identifier(s.name)}`, sql`${throughTable}.${sql.identifier(is(t._.column, Column) ? t._.column.name : t._.key)}`);
		});
		const innerColumnWhere = relation.targetColumns.map((s, i) => {
			const t = relation.through.target[i];
			return eq(sql`${throughTable}.${sql.identifier(is(t._.column, Column) ? t._.column.name : t._.key)}`, sql`${targetTable}.${sql.identifier(s.name)}`);
		});
		return {
			filter: and(relationsFilterToSQL(relation.isFilterReversed ? sourceTable : targetTable, relation.where), ...outerColumnWhere),
			joinCondition: and(...innerColumnWhere)
		};
	}
	return { filter: and(...relation.sourceColumns.map((s, i) => {
		const t = relation.targetColumns[i];
		return eq(sql`${sourceTable}.${sql.identifier(s.name)}`, sql`${targetTable}.${sql.identifier(t.name)}`);
	}), relationsFilterToSQL(relation.isFilterReversed ? sourceTable : targetTable, relation.where)) };
}
function getTableAsAliasSQL(table) {
	return sql`${table[IsAlias] ? sql`${sql`${sql.identifier(table[TableSchema] ?? "")}.`.if(table[TableSchema])}${sql.identifier(table[OriginalName])} as ${table}` : table}`;
}
var EmptyFilter = Symbol.for("drizzle:EmptyFilter");
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/dialect.js
var SQLiteDialect = class {
	static [entityKind] = "SQLiteDialect";
	mapperGenerators;
	constructor(config) {
		this.mapperGenerators = config?.useJitMappers ? {
			rows: makeJitQueryMapper,
			relationalRows: makeJitRqbMapper
		} : {
			rows: makeDefaultQueryMapper,
			relationalRows: makeDefaultRqbMapper
		};
	}
	escapeName(name) {
		return `"${name.replace(/"/g, "\"\"")}"`;
	}
	escapeParam(_num) {
		return "?";
	}
	escapeString(str) {
		return `'${str.replace(/'/g, "''")}'`;
	}
	buildWithCTE(queries) {
		if (!queries?.length) return void 0;
		const queriesLen = queries.length;
		const withSqlChunks = new Array(queriesLen + 1);
		let writeIdx = 0;
		withSqlChunks[writeIdx++] = new StringChunk("with ");
		for (let i = 0; i < queriesLen; ++i) {
			const w = queries[i];
			withSqlChunks[writeIdx++] = i < queriesLen - 1 ? sql`${sql.identifier(w._.alias)} as (${w._.sql}), ` : sql`${sql.identifier(w._.alias)} as (${w._.sql}) `;
		}
		return new SQL(withSqlChunks);
	}
	buildDeleteQuery({ table, where, returning, withList, limit, orderBy }) {
		const withSql = this.buildWithCTE(withList);
		const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
			isSingleTable: true,
			table
		})}` : void 0;
		return sql`${withSql}delete from ${table}${where ? sql` where ${where}` : void 0}${returningSql}${this.buildOrderBy(orderBy)}${this.buildLimit(limit)}`;
	}
	buildUpdateSet(table, set) {
		const tableColumns = table[Table.Symbol.Columns];
		const columnNames = Object.keys(tableColumns).filter((colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0);
		const setLength = columnNames.length;
		const setArr = new Array(setLength);
		for (let i = 0; i < columnNames.length; ++i) {
			const colName = columnNames[i];
			const col = tableColumns[colName];
			let value;
			if (set[colName] !== void 0) value = set[colName];
			else {
				const updateRes = col.onUpdateFn?.();
				value = is(updateRes, SQL) ? updateRes : sql.param(updateRes, col);
			}
			setArr[i] = i < setLength - 1 ? sql`${sql.identifier(col.name)} = ${value}, ` : sql`${sql.identifier(col.name)} = ${value}`;
		}
		return new SQL(setArr);
	}
	buildUpdateQuery({ table, set, where, returning, withList, joins, from, limit, orderBy }) {
		const withSql = this.buildWithCTE(withList);
		const setSql = this.buildUpdateSet(table, set);
		const fromSql = from && new SQL([new StringChunk(" from "), this.buildFromTable(from)]);
		const joinsSql = this.buildJoins(joins);
		const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
			isSingleTable: true,
			table
		})}` : void 0;
		return sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${where ? sql` where ${where}` : void 0}${returningSql}${this.buildOrderBy(orderBy)}${this.buildLimit(limit)}`;
	}
	/**
	* Builds selection SQL with provided fields/expressions
	*
	* Examples:
	*
	* `select <selection> from`
	*
	* `insert ... returning <selection>`
	*
	* If `isSingleTable` is true, then columns won't be prefixed with table name
	*/
	buildSelection(fields, { isSingleTable = false, table } = {}) {
		const { length: columnsLen } = fields;
		const chunks = [];
		const tableName = table ? is(table, SQL) || is(table, Subquery) ? void 0 : table[Table.Symbol.IsAlias] || table[Table.Symbol.Schema] === void 0 ? table[Table.Symbol.Name] : `${table[Table.Symbol.Schema]}.${table[Table.Symbol.Name]}` : void 0;
		for (let i = 0; i < columnsLen; ++i) {
			const { field, fieldType } = fields[i];
			switch (fieldType) {
				case "Column":
					if (field.columnType === "SQLiteNumericBigInt" || field.columnType === "SQLiteNumeric") if (isSingleTable) chunks.push(field.isAlias ? sql`cast(${sql.identifier(getOriginalColumnFromAlias(field).name)} as text) as ${field}` : sql`cast(${sql.identifier(field.name)} as text)`);
					else chunks.push(field.isAlias ? sql`cast(${getOriginalColumnFromAlias(field)} as text) as ${field}` : sql`cast(${field} as text)`);
					else if (isSingleTable) chunks.push(field.isAlias ? sql`${sql.identifier(getOriginalColumnFromAlias(field).name)} as ${field}` : sql.identifier(field.name));
					else chunks.push(field.isAlias ? sql`${getOriginalColumnFromAlias(field)} as ${field}` : field);
					break;
				case "SQL.Aliased":
					if (field.isSelectionField) {
						if (!isSingleTable && field.origin !== void 0) chunks.push(sql.identifier(field.origin), new StringChunk("."));
						chunks.push(sql.identifier(field.fieldAlias));
					} else {
						if (isSingleTable && tableName !== void 0) {
							const { queryChunks } = field.sql;
							const newChunks = new Array(queryChunks.length);
							let abort = false;
							for (let i = 0; i < queryChunks.length; ++i) {
								const c = queryChunks[i];
								if (is(c, Column)) {
									const { table } = c;
									if ((table[Table.Symbol.IsAlias] || table[Table.Symbol.Schema] === void 0 ? table[Table.Symbol.Name] : `${table[Table.Symbol.Schema]}.${table[Table.Symbol.Name]}`) !== tableName) {
										abort = true;
										break;
									}
									newChunks[i] = sql.identifier(c.name);
								} else newChunks[i] = c;
							}
							if (abort) chunks.push(field.sql);
							else {
								const newSql = new SQL(newChunks);
								if (field.sql.shouldInlineParams) newSql.inlineParams();
								chunks.push(newSql);
							}
						} else chunks.push(field.sql);
						chunks.push(sql` as ${sql.identifier(field.fieldAlias)}`);
					}
					break;
				case "SQL":
					if (isSingleTable && tableName !== void 0) {
						const { queryChunks } = field;
						const newChunks = new Array(queryChunks.length);
						let abort = false;
						for (let i = 0; i < queryChunks.length; ++i) {
							const c = queryChunks[i];
							if (is(c, Column)) {
								const { table } = c;
								if ((table[Table.Symbol.IsAlias] || table[Table.Symbol.Schema] === void 0 ? table[Table.Symbol.Name] : `${table[Table.Symbol.Schema]}.${table[Table.Symbol.Name]}`) !== tableName) {
									abort = true;
									break;
								}
								newChunks[i] = sql.identifier(c.name);
							} else newChunks[i] = c;
						}
						if (abort) chunks.push(field);
						else {
							const newSql = new SQL(newChunks);
							if (field.shouldInlineParams) newSql.inlineParams();
							chunks.push(newSql);
						}
					} else chunks.push(field);
					break;
				case "Subquery": if (!field._.isWith) chunks.push(sql`(${field._.sql}) ${sql.identifier(field._.alias)}`);
				else chunks.push(field);
			}
			if (i < columnsLen - 1) chunks.push(new StringChunk(", "));
		}
		return new SQL(chunks);
	}
	buildJoins(joins) {
		if (!joins || joins.length === 0) return;
		const joinsArray = [];
		if (joins) for (const [index, joinMeta] of joins.entries()) {
			if (index === 0) joinsArray.push(new StringChunk(" "));
			const table = joinMeta.table;
			const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
			if (is(table, SQLiteTable)) {
				const tableName = table[SQLiteTable.Symbol.Name];
				const tableSchema = table[SQLiteTable.Symbol.Schema];
				const origTableName = table[SQLiteTable.Symbol.OriginalName];
				const alias = tableName === origTableName ? void 0 : joinMeta.alias;
				joinsArray.push(sql`${new StringChunk(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`);
			} else joinsArray.push(sql`${new StringChunk(joinMeta.joinType)} join ${table}${onSql}`);
			if (index < joins.length - 1) joinsArray.push(new StringChunk(" "));
		}
		return new SQL(joinsArray);
	}
	buildLimit(limit) {
		return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
	}
	buildOrderBy(orderBy) {
		const orderByList = [];
		if (orderBy) for (const [index, orderByValue] of orderBy.entries()) {
			orderByList.push(orderByValue);
			if (index < orderBy.length - 1) orderByList.push(new StringChunk(", "));
		}
		return orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
	}
	buildFromTable(table) {
		if (is(table, Table) && table[Table.Symbol.IsAlias]) return sql`${sql`${sql.identifier(table[Table.Symbol.Schema] ?? "")}.`.if(table[Table.Symbol.Schema])}${sql.identifier(table[Table.Symbol.OriginalName])} ${sql.identifier(table[Table.Symbol.Name])}`;
		if (is(table, View) && table[ViewBaseConfig].isAlias) {
			let fullName = sql`${sql.identifier(table[ViewBaseConfig].originalName)}`;
			if (table[ViewBaseConfig].schema) fullName = sql`${sql.identifier(table[ViewBaseConfig].schema)}.${fullName}`;
			return sql`${fullName} ${sql.identifier(table[ViewBaseConfig].name)}`;
		}
		return table;
	}
	buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, distinct, setOperators }) {
		const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
		for (const f of fieldsList) if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, SQLiteViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table) => joins?.some(({ alias }) => alias === (table[Table.Symbol.IsAlias] ? getTableName(table) : table[Table.Symbol.BaseName])))(f.field.table)) {
			const tableName = getTableName(f.field.table);
			throw new Error(`Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
		}
		const isSingleTable = !joins || joins.length === 0;
		const withSql = this.buildWithCTE(withList);
		const distinctSql = distinct ? sql` distinct` : void 0;
		const selection = this.buildSelection(fieldsList, {
			isSingleTable,
			table
		});
		const tableSql = this.buildFromTable(table);
		const joinsSql = this.buildJoins(joins);
		const whereSql = where ? sql` where ${where}` : void 0;
		const havingSql = having ? sql` having ${having}` : void 0;
		const groupByList = [];
		if (groupBy) for (const [index, groupByValue] of groupBy.entries()) {
			groupByList.push(groupByValue);
			if (index < groupBy.length - 1) groupByList.push(new StringChunk(", "));
		}
		const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0}${havingSql}${this.buildOrderBy(orderBy)}${this.buildLimit(limit)}${offset ? sql` offset ${offset}` : void 0}`;
		if (setOperators.length > 0) return this.buildSetOperations(finalQuery, setOperators);
		return finalQuery;
	}
	buildSetOperations(leftSelect, setOperators) {
		const [setOperator, ...rest] = setOperators;
		if (!setOperator) throw new Error("Cannot pass undefined values to any set operator");
		if (rest.length === 0) return this.buildSetOperationQuery({
			leftSelect,
			setOperator
		});
		return this.buildSetOperations(this.buildSetOperationQuery({
			leftSelect,
			setOperator
		}), rest);
	}
	buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset } }) {
		const leftChunk = sql`${leftSelect.getSQL()} `;
		const rightChunk = sql`${rightSelect.getSQL()}`;
		let orderBySql;
		if (orderBy && orderBy.length > 0) {
			const orderByValues = [];
			for (const singleOrderBy of orderBy) if (is(singleOrderBy, SQLiteColumn)) orderByValues.push(sql.identifier(singleOrderBy.name));
			else if (is(singleOrderBy, SQL)) {
				for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
					const chunk = singleOrderBy.queryChunks[i];
					if (is(chunk, SQLiteColumn)) singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
				}
				orderByValues.push(sql`${singleOrderBy}`);
			} else orderByValues.push(sql`${singleOrderBy}`);
			orderBySql = sql` order by ${sql.join(orderByValues, new StringChunk(", "))}`;
		}
		const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
		const operatorChunk = new StringChunk(`${type} ${isAll ? "all " : ""}`);
		const offsetSql = offset ? sql` offset ${offset}` : void 0;
		return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
	}
	buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, columnList }) {
		const columns = table[Table.Symbol.Columns];
		const colEntries = columnList ? columnList.map((name) => [name, columns[name]]) : Object.entries(columns);
		const colEntriesFiltered = select && !is(valuesOrSelect, SQL) ? Object.keys(valuesOrSelect.getSelectedFields()).map((key) => [key, columns[key]]) : colEntries.filter(([_, col]) => !col.shouldDisableInsert());
		const insertOrderArr = new Array(colEntriesFiltered.length * 2 + 1);
		let writeIdx = 0;
		insertOrderArr[writeIdx++] = new StringChunk("(");
		for (let i = 0; i < colEntriesFiltered.length; ++i) {
			const [, { name }] = colEntriesFiltered[i];
			insertOrderArr[writeIdx++] = sql.identifier(name);
			if (i < colEntriesFiltered.length - 1) insertOrderArr[writeIdx++] = new StringChunk(", ");
		}
		insertOrderArr[writeIdx++] = new StringChunk(")");
		const insertOrder = new SQL(insertOrderArr);
		const valuesSqlList = Array.from({ length: select ? 1 : (colEntriesFiltered.length * 2 + 1) * valuesOrSelect.length + valuesOrSelect.length });
		if (select) valuesSqlList[0] = valuesOrSelect.getSQL();
		else {
			const values = valuesOrSelect;
			let writeIdx = 0;
			valuesSqlList[writeIdx++] = new StringChunk("values ");
			for (let valueIndex = 0; valueIndex < values.length; ++valueIndex) {
				const value = values[valueIndex];
				valuesSqlList[writeIdx++] = new StringChunk("(");
				for (let i = 0; i < colEntriesFiltered.length; ++i) {
					const [fieldName, col] = colEntriesFiltered[i];
					const colValue = value[fieldName];
					if (colValue === void 0) {
						let defaultValue;
						if (col.defaultFn !== void 0) {
							const defaultFnResult = col.defaultFn();
							defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
						} else if (col.default !== null && col.default !== void 0) defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
						else if (col.onUpdateFn !== void 0) {
							const onUpdateFnResult = col.onUpdateFn();
							defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
						} else defaultValue = new StringChunk("null");
						valuesSqlList[writeIdx++] = defaultValue;
					} else valuesSqlList[writeIdx++] = is(colValue, SQL) ? colValue : new Param(colValue, col);
					if (i < colEntriesFiltered.length - 1) valuesSqlList[writeIdx++] = new StringChunk(", ");
				}
				valuesSqlList[writeIdx++] = new StringChunk(")");
				if (valueIndex < values.length - 1) valuesSqlList[writeIdx++] = new StringChunk(`, `);
			}
		}
		const withSql = this.buildWithCTE(withList);
		const valuesSql = new SQL(valuesSqlList);
		const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
			isSingleTable: true,
			table
		})}` : void 0;
		return sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflict?.length ? sql.join(onConflict) : void 0}${returningSql}`;
	}
	sqlToQuery(sql, invokeSource) {
		return sql.toQuery({
			escapeName: this.escapeName,
			escapeParam: this.escapeParam,
			escapeString: this.escapeString,
			invokeSource
		});
	}
	buildRqbColumn(table, field, key, inJson, selection, tableTsName) {
		let fieldType;
		let output;
		if (is(field, Column)) {
			fieldType = "Column";
			const name = sql`${table}.${sql.identifier(field.name)}`;
			switch (field.columnType) {
				case "SQLiteBigInt":
				case "SQLiteBlobJson":
				case "SQLiteBlobBuffer":
					output = !inJson ? sql`${name} as ${sql.identifier(key)}` : sql`hex(${name}) as ${sql.identifier(key)}`;
					break;
				case "SQLiteNumeric":
				case "SQLiteNumericNumber":
				case "SQLiteNumericBigInt":
					output = sql`cast(${name} as text) as ${sql.identifier(key)}`;
					break;
				case "SQLiteCustomColumn":
					output = !inJson ? sql`${name} as ${sql.identifier(key)}` : sql`${field.jsonSelectIdentifier(name, sql)} as ${sql.identifier(key)}`;
					break;
				default: output = sql`${name} as ${sql.identifier(key)}`;
			}
		} else if (is(field, SQL)) {
			fieldType = "SQL";
			output = sql`${table}.${sql.identifier(key)} as ${sql.identifier(key)}`;
		} else if (is(field, SQL.Aliased)) {
			fieldType = "SQL.Aliased";
			output = sql`${table}.${sql.identifier(field.fieldAlias)} as ${sql.identifier(key)}`;
		} else if (isSQLWrapper(field)) {
			fieldType = "SQLWrapper";
			output = sql`${table}.${sql.identifier(key)} as ${sql.identifier(key)}`;
		} else throw new DrizzleError({ message: field === void 0 ? `Unknown column: "${tableTsName}"."${key}"` : `Views with nested selections are not supported by the relational query builder` });
		selection.push({
			key,
			field,
			fieldType
		});
		return output;
	}
	getSelectedTableColumns = (table, columns) => {
		const selectedColumns = [];
		const columnContainer = table[TableColumns];
		const entries = Object.entries(columns);
		let colSelectionMode;
		for (const [k, v] of entries) {
			if (v === void 0) continue;
			colSelectionMode = colSelectionMode || v;
			if (v) {
				const column = columnContainer[k];
				selectedColumns.push({
					column,
					tsName: k
				});
			}
		}
		if (colSelectionMode === false) for (const [k, v] of Object.entries(columnContainer)) {
			if (columns[k] === false) continue;
			selectedColumns.push({
				column: v,
				tsName: k
			});
		}
		return selectedColumns;
	};
	buildColumns = (table, selection, inJson, tableTsName, config) => {
		if (!config?.columns) return sql.join(Object.entries(table[TableColumns]).map(([k, v]) => {
			return this.buildRqbColumn(table, v, k, inJson, selection, tableTsName);
		}), new StringChunk(", "));
		const columnIdentifiers = [];
		const selectedColumns = this.getSelectedTableColumns(table, config?.columns);
		for (const { column, tsName } of selectedColumns) columnIdentifiers.push(this.buildRqbColumn(table, column, tsName, inJson, selection, tableTsName));
		return columnIdentifiers.length ? sql.join(columnIdentifiers, new StringChunk(", ")) : void 0;
	};
	buildRelationalQuery({ schema, table, tableConfig, queryConfig: config, relationWhere, mode, isNested, errorPath, depth, throughJoin, jsonb }) {
		const selection = [];
		const isSingle = mode === "first";
		const params = config === true ? void 0 : config;
		const currentPath = errorPath ?? "";
		const currentDepth = depth ?? 0;
		if (!currentDepth) table = aliasedTable(table, `d${currentDepth}`);
		const limit = isSingle ? 1 : params?.limit;
		const offset = params?.offset;
		const columns = this.buildColumns(table, selection, !!isNested, tableConfig.name, params);
		const where = params && "where" in params && relationWhere ? and(relationsFilterToSQL(table, params.where, tableConfig.relations, schema), relationWhere) : params && "where" in params ? relationsFilterToSQL(table, params.where, tableConfig.relations, schema) : relationWhere;
		const order = params?.orderBy ? relationsOrderToSQL(table, params.orderBy) : void 0;
		const extras = params?.extras ? relationExtrasToSQL(table, params.extras) : void 0;
		if (extras) selection.push(...extras.selection);
		let joins;
		switch (params) {
			case void 0: break;
			default: {
				const { with: withParam } = params;
				if (!withParam) break;
				const withEntries = Object.entries(withParam).filter(([_, v]) => v);
				if (!withEntries.length) break;
				const joinChunks = new Array(withEntries.length * 2 - 1);
				for (let readIdx = 0, writeIdx = 0; readIdx < withEntries.length; ++readIdx) {
					const [k, join] = withEntries[readIdx];
					const relation = tableConfig.relations[k];
					if (!relation) throw new DrizzleError({ message: `Unknown relation "${tableConfig.name}" -> "${k}"` });
					const isSingle = relation.relationType === "one";
					const targetTable = aliasedTable(relation.targetTable, `d${currentDepth + 1}`);
					const throughTable = relation.throughTable ? aliasedTable(relation.throughTable, `tr${currentDepth}`) : void 0;
					const { filter, joinCondition } = relationToSQL(relation, table, targetTable, throughTable);
					const throughJoin = throughTable ? sql` inner join ${getTableAsAliasSQL(throughTable)} on ${joinCondition}` : void 0;
					const innerQuery = this.buildRelationalQuery({
						table: targetTable,
						mode: isSingle ? "first" : "many",
						schema,
						queryConfig: join,
						tableConfig: schema[relation.targetTableName],
						relationWhere: filter,
						isNested: true,
						errorPath: `${currentPath.length ? `${currentPath}.` : ""}${k}`,
						depth: currentDepth + 1,
						throughJoin,
						jsonb
					});
					selection.push({
						field: targetTable,
						fieldType: "Nested",
						key: k,
						selection: innerQuery.selection,
						isArray: !isSingle,
						isOptional: (relation.optional ?? false) || join !== true && !!join.where
					});
					const jsonColumns = sql.join(innerQuery.selection.map((s) => {
						return sql`${new StringChunk(this.escapeString(s.key))}, ${s.selection ? sql`${jsonb}(${sql.identifier(s.key)})` : sql.identifier(s.key)}`;
					}), new StringChunk(", "));
					const json = isNested ? jsonb : sql`json`;
					const joinQuery = isSingle ? sql`(select ${json}_object(${jsonColumns}) as ${sql.identifier("r")} from (${innerQuery.sql}) as ${sql.identifier("t")}) as ${sql.identifier(k)}` : sql`coalesce((select ${json}_group_array(json_object(${jsonColumns})) as ${sql.identifier("r")} from (${innerQuery.sql}) as ${sql.identifier("t")}), ${jsonb}_array()) as ${sql.identifier(k)}`;
					joinChunks[writeIdx++] = joinQuery;
					if (readIdx < withEntries.length - 1) joinChunks[writeIdx++] = new StringChunk(", ");
				}
				joins = new SQL(joinChunks);
				break;
			}
		}
		const selectionArr = [
			columns,
			extras?.sql,
			joins
		].filter((e) => e !== void 0);
		if (!selectionArr.length) throw new DrizzleError({ message: `No fields selected for table "${tableConfig.name}"${currentPath ? ` ("${currentPath}")` : ""}` });
		return {
			sql: sql`select ${sql.join(selectionArr, new StringChunk(", "))} from ${getTableAsAliasSQL(table)}${throughJoin}${sql` where ${where}`.if(where)}${sql` order by ${order}`.if(order)}${sql` limit ${limit}`.if(limit !== void 0)}${sql` offset ${offset}`.if(offset !== void 0)}`,
			selection
		};
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var QueryBuilder = class {
	static [entityKind] = "SQLiteQueryBuilder";
	dialect;
	dialectConfig;
	constructor(dialect) {
		this.dialect = is(dialect, SQLiteDialect) ? dialect : void 0;
		this.dialectConfig = is(dialect, SQLiteDialect) ? void 0 : dialect;
	}
	$with = (alias, selection) => {
		const queryBuilder = this;
		const as = (qb) => {
			if (typeof qb === "function") qb = qb(queryBuilder);
			return new Proxy(new WithSubquery(qb.getSQL(), selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true), new SelectionProxyHandler({
				alias,
				sqlAliasedBehavior: "alias",
				sqlBehavior: "error"
			}));
		};
		return { as };
	};
	with(...queries) {
		const self = this;
		function select(fields) {
			return new SQLiteSelectBuilder({
				fields: fields ?? void 0,
				session: void 0,
				dialect: self.getDialect(),
				withList: queries
			});
		}
		function selectDistinct(fields) {
			return new SQLiteSelectBuilder({
				fields: fields ?? void 0,
				session: void 0,
				dialect: self.getDialect(),
				withList: queries,
				distinct: true
			});
		}
		return {
			select,
			selectDistinct
		};
	}
	select(fields) {
		return new SQLiteSelectBuilder({
			fields: fields ?? void 0,
			session: void 0,
			dialect: this.getDialect()
		});
	}
	selectDistinct(fields) {
		return new SQLiteSelectBuilder({
			fields: fields ?? void 0,
			session: void 0,
			dialect: this.getDialect(),
			distinct: true
		});
	}
	getDialect() {
		if (!this.dialect) this.dialect = new SQLiteDialect(this.dialectConfig);
		return this.dialect;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var SQLiteInsertBuilder = class {
	static [entityKind] = "SQLiteInsertBuilder";
	constructor(table, session, dialect, withList, columnList, builder = SQLiteInsertBase) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.withList = withList;
		this.columnList = columnList;
		this.builder = builder;
	}
	values(values) {
		values = Array.isArray(values) ? values : [values];
		if (values.length === 0) throw new Error("values() must be called with at least one value");
		return new this.builder(this.table, values, this.session, this.dialect, this.withList, false, this.columnList);
	}
	select(selectQuery) {
		const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
		if (!is(select, SQL)) {
			const insertCols = Object.keys(this.table[Table.Symbol.Columns]);
			const selected = Object.keys(select._.selectedFields);
			for (const col of selected) if (!insertCols.includes(col)) throw new Error(`Insert select error: column "${col}" does not exist in table "${this.table[Table.Symbol.Name]}"`);
		}
		return new this.builder(this.table, select, this.session, this.dialect, this.withList, true, this.columnList);
	}
};
var SQLiteInsertBase = class {
	static [entityKind] = "SQLiteInsert";
	/** @internal */
	config;
	constructor(table, values, session, dialect, withList, select, columnList) {
		this.session = session;
		this.dialect = dialect;
		this.config = {
			table,
			values,
			withList,
			select,
			columnList
		};
	}
	returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
		this.config.returning = orderSelectedFields(fields);
		return this;
	}
	/**
	* Adds an `on conflict do nothing` clause to the query.
	*
	* Calling this method simply avoids inserting a row as its alternative action.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
	*
	* @param config The `target` and `where` clauses.
	*
	* @example
	* ```ts
	* // Insert one row and cancel the insert if there's a conflict
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoNothing();
	*
	* // Explicitly specify conflict target
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoNothing({ target: cars.id });
	* ```
	*/
	onConflictDoNothing(config = {}) {
		if (!this.config.onConflict) this.config.onConflict = [];
		if (config.target === void 0) this.config.onConflict.push(sql` on conflict do nothing`);
		else {
			const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
			const whereSql = config.where ? sql` where ${config.where}` : sql``;
			this.config.onConflict.push(sql` on conflict ${targetSql} do nothing${whereSql}`);
		}
		return this;
	}
	/**
	* Adds an `on conflict do update` clause to the query.
	*
	* Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
	*
	* See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
	*
	* @param config The `target`, `set` and `where` clauses.
	*
	* @example
	* ```ts
	* // Update the row if there's a conflict
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoUpdate({
	*     target: cars.id,
	*     set: { brand: 'Porsche' }
	*   });
	*
	* // Upsert with 'where' clause
	* await db.insert(cars)
	*   .values({ id: 1, brand: 'BMW' })
	*   .onConflictDoUpdate({
	*     target: cars.id,
	*     set: { brand: 'newBMW' },
	*     where: sql`${cars.createdAt} > '2023-01-01'::date`,
	*   });
	* ```
	*/
	onConflictDoUpdate(config) {
		if (config.where && (config.targetWhere || config.setWhere)) throw new Error("You cannot use both \"where\" and \"targetWhere\"/\"setWhere\" at the same time - \"where\" is deprecated, use \"targetWhere\" or \"setWhere\" instead.");
		if (!this.config.onConflict) this.config.onConflict = [];
		const whereSql = config.where ? sql` where ${config.where}` : void 0;
		const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
		const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
		const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
		const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
		this.config.onConflict.push(sql` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`);
		return this;
	}
	getSQL() {
		return this.dialect.buildInsertQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	$dynamic() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/insert.js
var SQLiteAsyncInsertBase = class extends SQLiteInsertBase {
	static [entityKind] = "SQLiteAsyncInsert";
	/** @internal */
	_prepare(prepare = false) {
		return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), "arrays", prepare, this.config.returning ? "all" : "run", this.config.returning ? this.dialect.mapperGenerators.rows(this.config.returning, void 0) : void 0, {
			type: "insert",
			tables: extractUsedTable(this.config.table)
		});
	}
	prepare() {
		return this._prepare(true);
	}
	run = (placeholderValues) => {
		return this._prepare().run(placeholderValues);
	};
	all = (placeholderValues) => {
		return this._prepare().all(placeholderValues);
	};
	get = (placeholderValues) => {
		return this._prepare().get(placeholderValues);
	};
	values = (placeholderValues) => {
		return this._prepare().values(placeholderValues);
	};
	async execute() {
		return this._prepare().execute();
	}
};
applyMixins(SQLiteAsyncInsertBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
var SQLiteRaw = class {
	static [entityKind] = "SQLiteRaw";
	constructor(prepared, sql, query) {
		this.prepared = prepared;
		this.sql = sql;
		this.query = query;
	}
	getSQL() {
		return this.sql;
	}
	getQuery() {
		return this.query;
	}
	_prepare() {
		return this.prepared;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/raw.js
var SQLiteAsyncRaw = class extends SQLiteRaw {
	static [entityKind] = "SQLiteAsyncRaw";
	constructor(prepared, sql, query) {
		super(prepared, sql, query);
	}
	execute(placeholderValues) {
		return this.prepared.execute(placeholderValues);
	}
};
applyMixins(SQLiteAsyncRaw, [QueryPromise]);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/select.js
var SQLiteAsyncSelectBase = class extends SQLiteSelectBase {
	static [entityKind] = "SQLiteAsyncSelect";
	/** @internal */
	_prepare(prepare = false) {
		const query = this.dialect.sqlToQuery(this.getSQL());
		const fieldsList = this.config.fieldsFlat;
		const mapper = this.dialect.mapperGenerators.rows(fieldsList, resolveNullableObjectPaths(fieldsList, this.joinsNotNullableMap));
		return this.session.prepareQuery(query, "arrays", prepare, "all", mapper, {
			type: "select",
			tables: [...this.usedTables]
		}, this.cacheConfig);
	}
	prepare() {
		return this._prepare(true);
	}
	run = (placeholderValues) => {
		return this._prepare().run(placeholderValues);
	};
	all = (placeholderValues) => {
		return this._prepare().all(placeholderValues);
	};
	get = (placeholderValues) => {
		return this._prepare().get(placeholderValues);
	};
	values = (placeholderValues) => {
		return this._prepare().values(placeholderValues);
	};
	async execute() {
		return this._prepare().execute();
	}
};
applyMixins(SQLiteAsyncSelectBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/query-builders/update.js
var SQLiteUpdateBuilder = class {
	static [entityKind] = "SQLiteUpdateBuilder";
	constructor(table, session, dialect, withList, builder = SQLiteUpdateBase) {
		this.table = table;
		this.session = session;
		this.dialect = dialect;
		this.withList = withList;
		this.builder = builder;
	}
	set(values) {
		return new this.builder(this.table, mapUpdateSet(this.table, values), this.session, this.dialect, this.withList);
	}
};
var SQLiteUpdateBase = class {
	static [entityKind] = "SQLiteUpdate";
	/** @internal */
	config;
	constructor(table, set, session, dialect, withList) {
		this.session = session;
		this.dialect = dialect;
		this.config = {
			set,
			table,
			withList,
			joins: []
		};
	}
	from(source) {
		this.config.from = source;
		return this;
	}
	createJoin(joinType) {
		return ((table, on) => {
			const tableName = getTableLikeName(table);
			if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) throw new Error(`Alias "${tableName}" is already used in this query`);
			if (typeof on === "function") {
				const from = this.config.from ? is(table, SQLiteTable) ? table[Table.Symbol.Columns] : is(table, Subquery) ? table._.selectedFields : is(table, SQLiteViewBase) ? table[ViewBaseConfig].selectedFields : void 0 : void 0;
				on = on(new Proxy(this.config.table[Table.Symbol.Columns], new SelectionProxyHandler({
					sqlAliasedBehavior: "sql",
					sqlBehavior: "sql"
				})), from && new Proxy(from, new SelectionProxyHandler({
					sqlAliasedBehavior: "sql",
					sqlBehavior: "sql"
				})));
			}
			this.config.joins.push({
				on,
				table,
				joinType,
				alias: tableName
			});
			return this;
		});
	}
	leftJoin = this.createJoin("left");
	rightJoin = this.createJoin("right");
	innerJoin = this.createJoin("inner");
	fullJoin = this.createJoin("full");
	/**
	* Adds a 'where' clause to the query.
	*
	* Calling this method will update only those rows that fulfill a specified condition.
	*
	* See docs: {@link https://orm.drizzle.team/docs/update}
	*
	* @param where the 'where' clause.
	*
	* @example
	* You can use conditional operators and `sql function` to filter the rows to be updated.
	*
	* ```ts
	* // Update all cars with green color
	* db.update(cars).set({ color: 'red' })
	*   .where(eq(cars.color, 'green'));
	* // or
	* db.update(cars).set({ color: 'red' })
	*   .where(sql`${cars.color} = 'green'`)
	* ```
	*
	* You can logically combine conditional operators with `and()` and `or()` operators:
	*
	* ```ts
	* // Update all BMW cars with a green color
	* db.update(cars).set({ color: 'red' })
	*   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
	*
	* // Update all cars with the green or blue color
	* db.update(cars).set({ color: 'red' })
	*   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
	* ```
	*/
	where(where) {
		this.config.where = where;
		return this;
	}
	orderBy(...columns) {
		if (typeof columns[0] === "function") {
			const orderBy = columns[0](new Proxy(this.config.table[Table.Symbol.Columns], new SelectionProxyHandler({
				sqlAliasedBehavior: "alias",
				sqlBehavior: "sql"
			})));
			const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
			this.config.orderBy = orderByArray;
		} else {
			const orderByArray = columns;
			this.config.orderBy = orderByArray;
		}
		return this;
	}
	limit(limit) {
		this.config.limit = limit;
		return this;
	}
	returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
		this.config.returning = orderSelectedFields(fields);
		return this;
	}
	getSQL() {
		return this.dialect.buildUpdateQuery(this.config);
	}
	toSQL() {
		return this.dialect.sqlToQuery(this.getSQL());
	}
	$dynamic() {
		return this;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/update.js
var SQLiteAsyncUpdateBase = class extends SQLiteUpdateBase {
	static [entityKind] = "SQLiteAsyncUpdate";
	/** @internal */
	_prepare(prepare = false) {
		return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), "arrays", prepare, this.config.returning ? "all" : "run", this.config.returning ? this.dialect.mapperGenerators.rows(this.config.returning, void 0) : void 0, {
			type: "update",
			tables: extractUsedTable(this.config.table)
		});
	}
	prepare() {
		return this._prepare(true);
	}
	run = (placeholderValues) => {
		return this._prepare().run(placeholderValues);
	};
	all = (placeholderValues) => {
		return this._prepare().all(placeholderValues);
	};
	get = (placeholderValues) => {
		return this._prepare().get(placeholderValues);
	};
	values = (placeholderValues) => {
		return this._prepare().values(placeholderValues);
	};
	async execute() {
		return this.config.returning ? this.all() : this.run();
	}
};
applyMixins(SQLiteAsyncUpdateBase, [QueryPromise]);
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/db.js
var SQLiteAsyncDatabase = class {
	static [entityKind] = "BaseSQLiteDatabase";
	query;
	constructor(resultKind, dialect, session, relations, forbidJsonb) {
		this.resultKind = resultKind;
		this.dialect = dialect;
		this.session = session;
		this.forbidJsonb = forbidJsonb;
		this._ = {
			relations,
			session,
			resultKind
		};
		this.query = {};
		for (const [tableName, relation] of Object.entries(relations)) this.query[tableName] = new RelationalQueryBuilder(resultKind, relations, relations[relation.name].table, relation, dialect, session, forbidJsonb, resultKind === "sync" ? SQLiteSyncRelationalQuery : SQLiteAsyncRelationalQuery);
		this.$cache = { invalidate: async (_params) => {} };
	}
	/**
	* Creates a subquery that defines a temporary named result set as a CTE.
	*
	* It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
	*
	* @param alias The alias for the subquery.
	*
	* Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
	*
	* @example
	*
	* ```ts
	* // Create a subquery with alias 'sq' and use it in the select query
	* const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
	*
	* const result = await db.with(sq).select().from(sq);
	* ```
	*
	* To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
	*
	* ```ts
	* // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
	* const sq = db.$with('sq').as(db.select({
	*   name: sql<string>`upper(${users.name})`.as('name'),
	* })
	* .from(users));
	*
	* const result = await db.with(sq).select({ name: sq.name }).from(sq);
	* ```
	*/
	$with = (alias, selection) => {
		const self = this;
		const as = (qb) => {
			if (typeof qb === "function") qb = qb(new QueryBuilder(self.dialect));
			return new Proxy(new WithSubquery(qb.getSQL(), selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true), new SelectionProxyHandler({
				alias,
				sqlAliasedBehavior: "alias",
				sqlBehavior: "error"
			}));
		};
		return { as };
	};
	$count(source, filters) {
		return this.resultKind === "async" ? new SQLiteAsyncCountBuilder({
			source,
			filters,
			session: this.session,
			dialect: this.dialect
		}) : new SQLiteSyncCountBuilder({
			source,
			filters,
			session: this.session,
			dialect: this.dialect
		});
	}
	/**
	* Incorporates a previously defined CTE (using `$with`) into the main query.
	*
	* This method allows the main query to reference a temporary named result set.
	*
	* See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
	*
	* @param queries The CTEs to incorporate into the main query.
	*
	* @example
	*
	* ```ts
	* // Define a subquery 'sq' as a CTE using $with
	* const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
	*
	* // Incorporate the CTE 'sq' into the main query and select from it
	* const result = await db.with(sq).select().from(sq);
	* ```
	*/
	with(...queries) {
		const self = this;
		function select(fields) {
			return new SQLiteSelectBuilder({
				fields: fields ?? void 0,
				session: self.session,
				dialect: self.dialect,
				withList: queries
			}, SQLiteAsyncSelectBase);
		}
		function selectDistinct(fields) {
			return new SQLiteSelectBuilder({
				fields: fields ?? void 0,
				session: self.session,
				dialect: self.dialect,
				withList: queries,
				distinct: true
			}, SQLiteAsyncSelectBase);
		}
		/**
		* Creates an update query.
		*
		* Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
		*
		* Use `.set()` method to specify which values to update.
		*
		* See docs: {@link https://orm.drizzle.team/docs/update}
		*
		* @param table The table to update.
		*
		* @example
		*
		* ```ts
		* // Update all rows in the 'cars' table
		* await db.update(cars).set({ color: 'red' });
		*
		* // Update rows with filters and conditions
		* await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
		*
		* // Update with returning clause
		* const updatedCar: Car[] = await db.update(cars)
		*   .set({ color: 'red' })
		*   .where(eq(cars.id, 1))
		*   .returning();
		* ```
		*/
		function update(table) {
			return new SQLiteUpdateBuilder(table, self.session, self.dialect, queries, SQLiteAsyncUpdateBase);
		}
		function insert(into, ...columns) {
			return new SQLiteInsertBuilder(into, self.session, self.dialect, queries, columns.length ? columns : void 0, SQLiteAsyncInsertBase);
		}
		/**
		* Creates a delete query.
		*
		* Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
		*
		* See docs: {@link https://orm.drizzle.team/docs/delete}
		*
		* @param table The table to delete from.
		*
		* @example
		*
		* ```ts
		* // Delete all rows in the 'cars' table
		* await db.delete(cars);
		*
		* // Delete rows with filters and conditions
		* await db.delete(cars).where(eq(cars.color, 'green'));
		*
		* // Delete with returning clause
		* const deletedCar: Car[] = await db.delete(cars)
		*   .where(eq(cars.id, 1))
		*   .returning();
		* ```
		*/
		function delete_(from) {
			return new SQLiteAsyncDeleteBase(from, self.session, self.dialect, queries);
		}
		return {
			select,
			selectDistinct,
			update,
			insert,
			delete: delete_
		};
	}
	select(fields) {
		return new SQLiteSelectBuilder({
			fields: fields ?? void 0,
			session: this.session,
			dialect: this.dialect
		}, SQLiteAsyncSelectBase);
	}
	selectDistinct(fields) {
		return new SQLiteSelectBuilder({
			fields: fields ?? void 0,
			session: this.session,
			dialect: this.dialect,
			distinct: true
		}, SQLiteAsyncSelectBase);
	}
	/**
	* Creates an update query.
	*
	* Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
	*
	* Use `.set()` method to specify which values to update.
	*
	* See docs: {@link https://orm.drizzle.team/docs/update}
	*
	* @param table The table to update.
	*
	* @example
	*
	* ```ts
	* // Update all rows in the 'cars' table
	* await db.update(cars).set({ color: 'red' });
	*
	* // Update rows with filters and conditions
	* await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
	*
	* // Update with returning clause
	* const updatedCar: Car[] = await db.update(cars)
	*   .set({ color: 'red' })
	*   .where(eq(cars.id, 1))
	*   .returning();
	* ```
	*/
	update(table) {
		return new SQLiteUpdateBuilder(table, this.session, this.dialect, void 0, SQLiteAsyncUpdateBase);
	}
	$cache;
	insert(into, ...columns) {
		return new SQLiteInsertBuilder(into, this.session, this.dialect, void 0, columns.length ? columns : void 0, SQLiteAsyncInsertBase);
	}
	/**
	* Creates a delete query.
	*
	* Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
	*
	* See docs: {@link https://orm.drizzle.team/docs/delete}
	*
	* @param table The table to delete from.
	*
	* @example
	*
	* ```ts
	* // Delete all rows in the 'cars' table
	* await db.delete(cars);
	*
	* // Delete rows with filters and conditions
	* await db.delete(cars).where(eq(cars.color, 'green'));
	*
	* // Delete with returning clause
	* const deletedCar: Car[] = await db.delete(cars)
	*   .where(eq(cars.id, 1))
	*   .returning();
	* ```
	*/
	delete(from) {
		return new SQLiteAsyncDeleteBase(from, this.session, this.dialect);
	}
	run(query) {
		const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
		const builtQuery = this.dialect.sqlToQuery(sequel);
		const prepared = this.session.prepareQuery(builtQuery, "raw", false, "run");
		if (this.resultKind === "async") return new SQLiteAsyncRaw(prepared, sequel, builtQuery);
		return this.session.run(sequel);
	}
	all(query) {
		const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
		const builtQuery = this.dialect.sqlToQuery(sequel);
		const prepared = this.session.prepareQuery(builtQuery, "objects", false, "all");
		if (this.resultKind === "async") return new SQLiteAsyncRaw(prepared, sequel, builtQuery);
		return this.session.objects(sequel);
	}
	get(query) {
		const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
		const builtQuery = this.dialect.sqlToQuery(sequel);
		const prepared = this.session.prepareQuery(builtQuery, "objects", false, "get");
		if (this.resultKind === "async") return new SQLiteAsyncRaw(prepared, sequel, builtQuery);
		return this.session.object(sequel);
	}
	values(query) {
		const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
		const builtQuery = this.dialect.sqlToQuery(sequel);
		const prepared = this.session.prepareQuery(builtQuery, "objects", false, "values");
		if (this.resultKind === "async") return new SQLiteAsyncRaw(prepared, sequel, builtQuery);
		return this.session.arrays(sequel);
	}
	transaction(transaction, config) {
		return this.session.transaction(transaction, config);
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/cache/core/cache.js
var Cache = class {
	static [entityKind] = "Cache";
};
var NoopCache = class extends Cache {
	static [entityKind] = "NoopCache";
	strategy() {
		return "all";
	}
	async get(_key) {}
	async put(_hashedQuery, _response, _tables, _config) {}
	async onMutate(_params) {}
};
var strategyFor = async (query, params, queryMetadata, withCacheConfig) => {
	if (!queryMetadata) return { type: "skip" };
	const { type, tables } = queryMetadata;
	if ((type === "insert" || type === "update" || type === "delete") && tables.length > 0) return {
		type: "invalidate",
		tables
	};
	if (!withCacheConfig) return { type: "skip" };
	if (!withCacheConfig.enabled) return { type: "skip" };
	if (type === "select") return {
		type: "try",
		key: withCacheConfig.tag ?? await hashQuery(query, params),
		isTag: typeof withCacheConfig.tag !== "undefined",
		autoInvalidate: withCacheConfig.autoInvalidate,
		tables: queryMetadata.tables,
		config: withCacheConfig.config
	};
	return { type: "skip" };
};
var SHA256_K = /* @__PURE__ */ new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
function rotr(x, n) {
	return x >>> n | x << 32 - n;
}
function sha256(bytes) {
	const h = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
	const byteLength = bytes.length;
	const padded = new Uint8Array(Math.ceil((byteLength + 9) / 64) * 64);
	padded.set(bytes);
	padded[byteLength] = 128;
	const view = new DataView(padded.buffer);
	const bitLength = byteLength * 8;
	view.setUint32(padded.length - 8, Math.floor(bitLength / 4294967296));
	view.setUint32(padded.length - 4, bitLength >>> 0);
	const w = /* @__PURE__ */ new Uint32Array(64);
	for (let offset = 0; offset < padded.length; offset += 64) {
		for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
		for (let i = 16; i < 64; i++) {
			const a0 = w[i - 15];
			const a1 = w[i - 2];
			const s0 = rotr(a0, 7) ^ rotr(a0, 18) ^ a0 >>> 3;
			const s1 = rotr(a1, 17) ^ rotr(a1, 19) ^ a1 >>> 10;
			w[i] = w[i - 16] + s0 + w[i - 7] + s1 >>> 0;
		}
		let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
		for (let i = 0; i < 64; i++) {
			const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
			const ch = e & f ^ ~e & g;
			const t1 = hh + s1 + ch + SHA256_K[i] + w[i] >>> 0;
			const t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + (a & b ^ a & c ^ b & c) >>> 0;
			hh = g;
			g = f;
			f = e;
			e = d + t1 >>> 0;
			d = c;
			c = b;
			b = a;
			a = t1 + t2 >>> 0;
		}
		h[0] = h[0] + a;
		h[1] = h[1] + b;
		h[2] = h[2] + c;
		h[3] = h[3] + d;
		h[4] = h[4] + e;
		h[5] = h[5] + f;
		h[6] = h[6] + g;
		h[7] = h[7] + hh;
	}
	const out = /* @__PURE__ */ new Uint8Array(32);
	const outView = new DataView(out.buffer);
	for (let i = 0; i < 8; i++) outView.setUint32(i * 4, h[i]);
	return out;
}
var HEX = /* @__PURE__ */ (() => {
	const table = new Array(256);
	for (let i = 0; i < 256; i++) table[i] = i.toString(16).padStart(2, "0");
	return table;
})();
function toHex(bytes) {
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += HEX[bytes[i]];
	return hex;
}
var nodeCreateHash;
function getNodeCreateHash() {
	if (nodeCreateHash !== void 0) return nodeCreateHash;
	let resolved;
	try {
		const nodeCrypto = globalThis.process?.getBuiltinModule?.("node:crypto");
		resolved = typeof nodeCrypto?.createHash === "function" ? nodeCrypto.createHash : null;
	} catch {
		resolved = null;
	}
	return nodeCreateHash = resolved;
}
var encoder;
async function hashQuery(sql, params) {
	const dataToHash = `${sql}-${JSON.stringify(params, (_, v) => typeof v === "bigint" ? `${v}n` : v)}`;
	const createHash = getNodeCreateHash();
	if (createHash) return createHash("sha256").update(dataToHash).digest("hex");
	encoder ??= new TextEncoder();
	const data = encoder.encode(dataToHash);
	const subtle = typeof globalThis.crypto !== "undefined" ? globalThis.crypto.subtle : void 0;
	return toHex(subtle ? new Uint8Array(await subtle.digest("SHA-256", data)) : sha256(data));
}
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/session.js
var SQLitePreparedQuery = class {
	static [entityKind] = "SQLiteBasePreparedQuery";
	/** @internal */
	mapper;
	/** @internal */
	executeMethod;
	constructor(executeMethod, query, mapper, mode) {
		this.query = query;
		this.mode = mode;
		this.mapper = mapper;
		this.executeMethod = executeMethod;
	}
	getQuery() {
		return this.query;
	}
};
var SQLiteSession = class {
	static [entityKind] = "SQLiteSession";
	constructor(dialect) {
		this.dialect = dialect;
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/sqlite-core/async/session.js
var ExecuteResultSync = class extends QueryPromise {
	static [entityKind] = "ExecuteResultSync";
	constructor(resultCb) {
		super();
		this.resultCb = resultCb;
	}
	async execute() {
		return this.resultCb();
	}
	sync() {
		return this.resultCb();
	}
};
var SQLiteAsyncPreparedQuery = class extends SQLitePreparedQuery {
	static [entityKind] = "SQLiteAsyncPreparedQuery";
	fastPath;
	constructor(resultKind, executeMethod = "all", executors, query, mapper, mode, logger, cache, queryMetadata, cacheConfig) {
		super(executeMethod, query, mapper, mode);
		this.resultKind = resultKind;
		this.executors = executors;
		this.logger = logger;
		this.cache = cache;
		this.queryMetadata = queryMetadata;
		this.cacheConfig = cacheConfig;
		if (cache && cache.strategy() === "all" && cacheConfig === void 0) this.cacheConfig = {
			enabled: true,
			autoInvalidate: true
		};
		if (!this.cacheConfig?.enabled) this.cacheConfig = void 0;
		this.fastPath = cacheConfig === void 0 && (cache === void 0 || is(cache, NoopCache));
	}
	/** @internal */
	async queryWithCache(queryString, params, executeMethod, query) {
		const cacheStrat = this.cache !== void 0 && !is(this.cache, NoopCache) ? await strategyFor(queryString, params, this.queryMetadata, this.cacheConfig) : { type: "skip" };
		if (cacheStrat.type === "skip") return query().catch((e) => {
			throw new DrizzleQueryError(queryString, params, e);
		});
		const cache = this.cache;
		if (cacheStrat.type === "invalidate") return Promise.all([query(), cache.onMutate({ tables: cacheStrat.tables })]).then((res) => res[0]).catch((e) => {
			throw new DrizzleQueryError(queryString, params, e);
		});
		if (cacheStrat.type === "try") {
			const { tables, key: _key, isTag, autoInvalidate, config } = cacheStrat;
			const key = `${executeMethod}_${_key}`;
			const fromCache = await cache.get(key, tables, isTag, autoInvalidate);
			if (fromCache === void 0) {
				const result = await query().catch((e) => {
					throw new DrizzleQueryError(queryString, params, e);
				});
				await cache.put(key, result, autoInvalidate ? tables : [], isTag, config);
				return result;
			}
			return fromCache;
		}
		assertUnreachable(cacheStrat);
	}
	run(placeholderValues = {}) {
		const { query, logger, executors, fastPath, resultKind } = this;
		const sql = query._sql ? query._sql.join(" ") : query.sql;
		const params = query.params.length === 0 ? query.params : fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(sql, params);
		if (resultKind === "sync") try {
			return executors.run(params);
		} catch (e) {
			throw new DrizzleQueryError(sql, params, e);
		}
		return fastPath ? executors.run(params).catch((e) => {
			throw new DrizzleQueryError(sql, params, e);
		}) : this.queryWithCache(sql, params, "run", () => executors.run(params));
	}
	all(placeholderValues = {}) {
		const { query, logger, executors, mapper, fastPath, resultKind } = this;
		const sql = query._sql ? query._sql.join(" ") : query.sql;
		const params = query.params.length === 0 ? query.params : fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(sql, params);
		if (resultKind === "sync") {
			let res;
			try {
				res = executors.all(params);
			} catch (e) {
				throw new DrizzleQueryError(sql, params, e);
			}
			if (!mapper) return res;
			return mapper(res);
		}
		const res = fastPath ? executors.all(params).catch((e) => {
			throw new DrizzleQueryError(sql, params, e);
		}) : this.queryWithCache(sql, params, "all", () => executors.all(params));
		if (!mapper) return res;
		return res.then((rows) => mapper(rows));
	}
	get(placeholderValues = {}) {
		const { query, logger, executors, mapper, fastPath, resultKind } = this;
		const sql = query._sql ? query._sql.join(" ") : query.sql;
		const params = query.params.length === 0 ? query.params : fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(sql, params);
		if (resultKind === "sync") {
			let res;
			try {
				res = executors.get(params);
			} catch (e) {
				throw new DrizzleQueryError(sql, params, e);
			}
			if (!res) return void 0;
			if (!mapper) return res;
			return mapper([res])[0];
		}
		const res = fastPath ? executors.get(params).catch((e) => {
			throw new DrizzleQueryError(sql, params, e);
		}) : this.queryWithCache(sql, params, "get", () => executors.get(params));
		if (!mapper) return res.then((row) => row ? row : void 0);
		return res.then((row) => row ? mapper([row])[0] : void 0);
	}
	values(placeholderValues = {}) {
		const { query, logger, executors, fastPath, resultKind } = this;
		const sql = query._sql ? query._sql.join(" ") : query.sql;
		const params = query.params.length === 0 ? query.params : fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(sql, params);
		if (resultKind === "sync") try {
			return executors.values(params);
		} catch (e) {
			throw new DrizzleQueryError(sql, params, e);
		}
		return fastPath ? executors.values(params).catch((e) => {
			throw new DrizzleQueryError(sql, params, e);
		}) : this.queryWithCache(sql, params, "values", () => executors.values(params));
	}
	execute(placeholderValues) {
		if (this.resultKind === "async") return this[this.executeMethod](placeholderValues);
		return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
	}
};
var SQLiteAsyncSession = class extends SQLiteSession {
	static [entityKind] = "SQLiteAsyncSession";
	constructor(dialect, resultKind) {
		super(dialect);
		this.resultKind = resultKind;
	}
	run(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query), "raw", false).run();
	}
	objects(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query), "objects", false).all();
	}
	object(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query), "objects", false).get();
	}
	arrays(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query), "arrays", false).all();
	}
	array(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query), "arrays", false).get();
	}
};
var SQLiteAsyncTransaction = class extends SQLiteAsyncDatabase {
	static [entityKind] = "SQLiteAsyncTransaction";
	constructor(resultType, dialect, session, relations, nestedIndex = 0, forbidJsonb) {
		super(resultType, dialect, session, relations, forbidJsonb);
		this.nestedIndex = nestedIndex;
	}
	rollback() {
		throw new TransactionRollbackError();
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/node-sqlite/session.js
var NodeSQLiteSession = class extends SQLiteAsyncSession {
	static [entityKind] = "SQLJsSession";
	logger;
	constructor(client, dialect, relations, options = {}) {
		super(dialect, "sync");
		this.client = client;
		this.relations = relations;
		this.options = options;
		this.logger = options.logger ?? new NoopLogger();
	}
	prepareQuery(query, mode, _prepare, executeMethod, mapper, queryMetadata) {
		let stmt;
		try {
			stmt = this.client.prepare(query.sql);
		} catch (e) {
			throw new DrizzleQueryError(query.sql, query.params, e);
		}
		return new SQLiteAsyncPreparedQuery("sync", executeMethod, {
			all: (params) => {
				stmt.setReturnArrays(mode === "arrays");
				const res = stmt.all(...params);
				if (mode === "objects") return res.map((row) => ({ ...row }));
				return res;
			},
			get: (params) => {
				stmt.setReturnArrays(mode === "arrays");
				const res = stmt.get(...params);
				if (res && mode === "objects") return { ...res };
				return res;
			},
			run: (params) => {
				stmt.setReturnArrays(false);
				return stmt.run(...params);
			},
			values: (params) => {
				stmt.setReturnArrays(true);
				return stmt.all(...params);
			}
		}, query, mapper, mode, this.logger, void 0, queryMetadata, void 0);
	}
	transaction(transaction, config = {}) {
		if (config?.behavior === "concurrent") throw new Error("Concurrent transactions are not supported by driver");
		const tx = new NodeSQLiteTransaction("sync", this.dialect, this, this.relations);
		this.run(sql.raw(`begin${config.behavior ? ` ${config.behavior}` : ""}`));
		try {
			const result = transaction(tx);
			this.run(sql`commit`);
			return result;
		} catch (err) {
			this.run(sql`rollback`);
			throw err;
		}
	}
};
var NodeSQLiteTransaction = class NodeSQLiteTransaction extends SQLiteAsyncTransaction {
	static [entityKind] = "SQLJsTransaction";
	transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new NodeSQLiteTransaction("sync", this.dialect, this.session, this._.relations, this.nestedIndex + 1);
		tx.run(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = transaction(tx);
			tx.run(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			tx.run(sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
//#endregion
//#region ../../node_modules/.bun/drizzle-orm@1.0.0-rc.5-169397b+615addbc028ae414/node_modules/drizzle-orm/node-sqlite/driver.js
var NodeSQLiteDatabase = class extends SQLiteAsyncDatabase {
	static [entityKind] = "NodeSQLiteDatabase";
};
function construct(client, config = {}) {
	const dialect = new SQLiteDialect({ useJitMappers: jitCompatCheck(config.jit) });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	const relations = config.relations ?? {};
	const db = new NodeSQLiteDatabase("sync", dialect, new NodeSQLiteSession(client, dialect, relations, { logger }), relations);
	db.$client = client;
	return db;
}
function drizzle(...params) {
	if (params[0] === void 0 || typeof params[0] === "string") return construct(params[0] === void 0 ? new DatabaseSync(":memory:") : new DatabaseSync(params[0]), params[1]);
	const { connection, client, ...config } = params[0];
	if (client) return construct(client, config);
	if (typeof connection === "object") {
		const { path, ...options } = connection;
		return construct(new DatabaseSync(path ?? ":memory:", options), config);
	}
	return construct(new DatabaseSync(connection ?? ":memory:"), config);
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));
//#endregion
//#region src/main/storage/database.ts
function openDatabase(filename) {
	const opened = openOwnDatabase(filename);
	opened.native.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA temp_store=MEMORY");
	const db = drizzle({ client: opened.native });
	migrate(db);
	return {
		db,
		moved: opened.moved,
		close: () => opened.native.close()
	};
}
function migrate(db) {
	return migrateDatabase(db.$client);
}
function openOwnDatabase(filename) {
	const native = new DatabaseSync(filename);
	if (!isCliDatabase(native)) return { native };
	native.close();
	const moved = `${filename}.cli-${Date.now()}`;
	renameSync(filename, moved);
	return {
		native: new DatabaseSync(filename),
		moved
	};
}
var COLLECT_INTERVAL_MS = 6e4;
var BLOB_GRACE_MS = 9e5;
function initialDraftGcTransition(openAt, startupDelayMs) {
	return schedule(0, openAt, openAt + startupDelayMs, openAt);
}
function transitionDraftGc(state, event) {
	if (state.status === "closed") return unchanged$10(state);
	if (event.type === "close.requested") return {
		state: { status: "closed" },
		commands: state.status === "scheduled" ? [{ type: "cancel-timer" }] : []
	};
	if (state.status === "collecting") return collected(state, event);
	if (event.type === "blob.uploaded") {
		if (state.status === "scheduled") return unchanged$10(state);
		return schedule(state.attempt, state.lastCollectedAt, Math.max(state.lastCollectedAt + COLLECT_INTERVAL_MS, event.at + BLOB_GRACE_MS + 1), event.at);
	}
	if (event.type === "documents.written") {
		if (event.at - state.lastCollectedAt >= 6e4) return collect(state.attempt, event.at);
		const dueAt = state.lastCollectedAt + COLLECT_INTERVAL_MS;
		if (state.status === "scheduled" && state.dueAt <= dueAt) return unchanged$10(state);
		return schedule(state.attempt, state.lastCollectedAt, dueAt, event.at);
	}
	if (event.type === "timer.fired" && state.status === "scheduled" && event.attempt === state.attempt) return collect(state.attempt, event.at);
	return unchanged$10(state);
}
function collected(state, event) {
	if (event.type === "collect.failed" && event.attempt === state.attempt) {
		const retry = schedule(state.attempt, event.at, event.at + COLLECT_INTERVAL_MS, event.at);
		return {
			state: retry.state,
			commands: [...retry.commands, {
				type: "report-error",
				error: event.error
			}]
		};
	}
	if (event.type !== "collect.succeeded" || event.attempt !== state.attempt) return unchanged$10(state);
	if (event.oldestOrphanAt === null) return {
		state: {
			status: "clean",
			attempt: state.attempt,
			lastCollectedAt: event.at
		},
		commands: []
	};
	return schedule(state.attempt, event.at, Math.max(event.at + COLLECT_INTERVAL_MS, event.oldestOrphanAt + BLOB_GRACE_MS + 1), event.at);
}
function schedule(attempt, lastCollectedAt, dueAt, at) {
	return {
		state: {
			status: "scheduled",
			attempt: attempt + 1,
			lastCollectedAt,
			dueAt
		},
		commands: [{
			type: "start-timer",
			attempt: attempt + 1,
			delayMs: Math.max(0, dueAt - at)
		}]
	};
}
function collect(attempt, at) {
	return {
		state: {
			status: "collecting",
			attempt: attempt + 1
		},
		commands: [{ type: "cancel-timer" }, {
			type: "collect",
			attempt: attempt + 1,
			at,
			before: at - BLOB_GRACE_MS
		}]
	};
}
function unchanged$10(state) {
	return {
		state,
		commands: []
	};
}
//#endregion
//#region src/main/storage/schema.ts
var document = sqliteTable("document", {
	key: text().primaryKey(),
	value: text().notNull()
});
var blobs = sqliteTable("blob", {
	id: text().primaryKey(),
	data: blob({ mode: "buffer" }).notNull(),
	touched_at: integer().notNull().default(0)
});
var state = sqliteTable("state", {
	name: text().notNull(),
	key: text().notNull(),
	value: text().notNull(),
	updated_at: integer().notNull()
}, (table) => [primaryKey({ columns: [table.name, table.key] })]);
var plugin = sqliteTable("plugin", {
	id: text().primaryKey(),
	enabled: integer({ mode: "boolean" }).notNull().default(true),
	manifest: text(),
	revision: text()
});
var IDLE = Object.freeze({ status: "idle" });
var CLOSED$2 = Object.freeze({ status: "closed" });
var EMPTY = /* @__PURE__ */ new Map();
function initialWriteBehindState() {
	return IDLE;
}
function transitionWriteBehind(state, event, delay) {
	if (state.status === "closed") return event.type === "set" ? unchanged$9(state, [{ type: "reject-closed" }]) : unchanged$9(state);
	if (state.status === "idle") {
		if (event.type === "close.requested") return {
			state: CLOSED$2,
			commands: []
		};
		if (event.type !== "set") return unchanged$9(state);
		return {
			state: {
				status: "scheduled",
				pending: /* @__PURE__ */ new Map([[event.key, event.value]]),
				attempt: 1,
				failures: 0
			},
			commands: [{
				type: "start-timer",
				attempt: 1,
				delayMs: delay
			}]
		};
	}
	if (state.status === "scheduled") return scheduled(state, event);
	return flushing(state, event, delay);
}
function scheduled(state, event) {
	if (event.type === "set") return {
		state: {
			...state,
			pending: put(state.pending, event.key, event.value)
		},
		commands: []
	};
	if (event.type === "drop") {
		const pending = without$1(state.pending, event.predicate);
		if (pending === state.pending) return unchanged$9(state);
		if (pending.size === 0) return {
			state: IDLE,
			commands: [{ type: "cancel-timer" }]
		};
		return {
			state: {
				...state,
				pending
			},
			commands: []
		};
	}
	if (event.type === "timer.fired" && event.attempt !== state.attempt) return unchanged$9(state);
	if (event.type === "timer.fired" || event.type === "flush.requested" || event.type === "close.requested") {
		const attempt = state.attempt + 1;
		return {
			state: {
				status: "flushing",
				inFlight: state.pending,
				queued: EMPTY,
				attempt,
				failures: state.failures,
				closing: event.type === "close.requested"
			},
			commands: [{ type: "cancel-timer" }, {
				type: "write",
				attempt,
				batch: new Map(state.pending)
			}]
		};
	}
	return unchanged$9(state);
}
function flushing(state, event, delay) {
	if (event.type === "set") {
		if (state.closing) return unchanged$9(state, [{ type: "reject-closed" }]);
		return {
			state: {
				...state,
				queued: put(state.queued, event.key, event.value)
			},
			commands: []
		};
	}
	if (event.type === "drop") {
		const inFlight = without$1(state.inFlight, event.predicate);
		const queued = without$1(state.queued, event.predicate);
		if (inFlight === state.inFlight && queued === state.queued) return unchanged$9(state);
		return {
			state: {
				...state,
				inFlight,
				queued
			},
			commands: []
		};
	}
	if (event.type === "close.requested") return state.closing ? unchanged$9(state) : {
		state: {
			...state,
			closing: true
		},
		commands: []
	};
	if (event.type !== "write.succeeded" && event.type !== "write.failed") return unchanged$9(state);
	if (event.attempt !== state.attempt) return unchanged$9(state);
	const attempt = state.attempt + 1;
	if (event.type === "write.succeeded") {
		if (state.closing) return {
			state: CLOSED$2,
			commands: []
		};
		if (state.queued.size === 0) return {
			state: IDLE,
			commands: []
		};
		return {
			state: {
				status: "scheduled",
				pending: state.queued,
				attempt,
				failures: 0
			},
			commands: [{
				type: "start-timer",
				attempt,
				delayMs: delay
			}]
		};
	}
	const report = {
		type: "report-error",
		error: event.error
	};
	if (state.closing) return {
		state: CLOSED$2,
		commands: [report]
	};
	const pending = new Map([...state.inFlight, ...state.queued]);
	if (pending.size === 0) return {
		state: IDLE,
		commands: [report]
	};
	return {
		state: {
			status: "scheduled",
			pending,
			attempt,
			failures: state.failures + 1
		},
		commands: [{
			type: "start-timer",
			attempt,
			delayMs: delay * 2 ** Math.min(state.failures, 6)
		}, report]
	};
}
function put(map, key, value) {
	return new Map(map).set(key, value);
}
function without$1(map, predicate) {
	const kept = new Map([...map].filter(([, value]) => !predicate(value)));
	return kept.size === map.size ? map : kept;
}
function unchanged$9(state, commands = []) {
	return {
		state,
		commands
	};
}
/** New rows are refused: the buffer closed, or closes once its last write settles. */
function isWriteBehindClosed(state) {
	return state.status === "closed" || state.status === "flushing" && state.closing;
}
/** The rows not yet written, by key; a row set during a write wins over the one being written. */
function selectPendingRows(state) {
	if (state.status === "scheduled") return state.pending;
	if (state.status === "flushing") return state.queued.size === 0 ? state.inFlight : new Map([...state.inFlight, ...state.queued]);
	return EMPTY;
}
//#endregion
//#region src/main/storage/write-behind.ts
function createWriteBehind(input) {
	const current = { state: initialWriteBehindState() };
	const timers = /* @__PURE__ */ new Set();
	const dispatch = (event) => {
		const next = transitionWriteBehind(current.state, event, input.delay);
		current.state = next.state;
		next.commands.forEach(perform);
	};
	const perform = (command) => {
		if (command.type === "write") return dispatch(write(command.attempt, command.batch));
		if (command.type === "report-error") {
			if (!input.onError) throw command.error;
			return input.onError(command.error);
		}
		if (command.type === "reject-closed") throw new Error("Write-behind buffer is closed");
		timers.forEach(clearTimeout);
		timers.clear();
		if (command.type === "start-timer") timers.add(setTimeout(() => dispatch({
			type: "timer.fired",
			attempt: command.attempt
		}), command.delayMs));
	};
	const write = (attempt, batch) => {
		try {
			input.write(batch);
			return {
				type: "write.succeeded",
				attempt
			};
		} catch (error) {
			return {
				type: "write.failed",
				attempt,
				error
			};
		}
	};
	return {
		get: (key) => selectPendingRows(current.state).get(key),
		has: (key) => selectPendingRows(current.state).has(key),
		entries: () => selectPendingRows(current.state).values(),
		/** Refuses new rows once closing, so a caller never acknowledges a write that will not happen. */
		closed: () => isWriteBehindClosed(current.state),
		set: (key, value) => dispatch({
			type: "set",
			key,
			value
		}),
		drop: (predicate) => dispatch({
			type: "drop",
			predicate
		}),
		flush: () => dispatch({ type: "flush.requested" }),
		close: () => dispatch({ type: "close.requested" })
	};
}
//#endregion
//#region src/main/storage/drafts.ts
var referenced = (value) => sql`
  SELECT json_extract(node.value, '$.id') AS id
  FROM json_tree(${value}) AS node
  WHERE node.key = 'blob' AND node.type = 'object' AND json_type(node.value, '$.id') = 'text'
  UNION
  SELECT chunk.value AS id
  FROM json_tree(${value}) AS node, json_each(node.value, '$.ids') AS chunk
  WHERE node.key = 'blob' AND node.type = 'object' AND json_type(node.value, '$.ids') = 'array'
`;
function createDraftStore(db, input = {}) {
	const gc = createDraftGc(db, input);
	const byKey = eq(document.key, sql.placeholder("key"));
	const read = db.select({ value: document.value }).from(document).where(byKey).prepare();
	const remove = db.delete(document).where(byKey).prepare();
	const upsert = db.insert(document).values({
		key: sql.placeholder("key"),
		value: sql.placeholder("value")
	}).onConflictDoUpdate({
		target: document.key,
		set: { value: sql.placeholder("value") }
	}).prepare();
	const writer = createWriteBehind({
		delay: 500,
		onError: input.onError,
		write: (batch) => {
			const at = Date.now();
			db.transaction(() => {
				for (const [key, value] of batch) {
					if (value === null) {
						remove.run({ key });
						continue;
					}
					upsert.run({
						key,
						value
					});
					if (json(value)) db.run(sql`UPDATE ${blobs} SET touched_at = ${at} WHERE ${blobs.id} IN (${referenced(value)})`);
				}
			});
			gc.dispatch({
				type: "documents.written",
				at
			});
		}
	});
	return {
		get(key) {
			if (writer.has(key)) return writer.get(key) ?? null;
			return read.get({ key })?.value ?? null;
		},
		set(key, value, strict = false) {
			const missing = value === null || !json(value) ? [] : db.all(sql`SELECT ref.id FROM (${referenced(value)}) AS ref WHERE ref.id NOT IN (SELECT ${blobs.id} FROM ${blobs})`).map((row) => row.id);
			if (!strict || missing.length === 0) writer.set(key, value);
			return missing;
		},
		putBlob(data) {
			const id = createHash("sha256").update(data).digest("hex");
			const touched_at = Date.now();
			db.insert(blobs).values({
				id,
				data: Buffer.from(data),
				touched_at
			}).onConflictDoUpdate({
				target: blobs.id,
				set: { touched_at }
			}).run();
			gc.dispatch({
				type: "blob.uploaded",
				at: touched_at
			});
			return id;
		},
		getBlob(id) {
			const data = db.select({ data: blobs.data }).from(blobs).where(eq(blobs.id, id)).get()?.data;
			return data ? data : null;
		},
		flush: writer.flush,
		close() {
			gc.dispatch({ type: "close.requested" });
			writer.close();
		}
	};
}
function json(value) {
	return value.startsWith("{") || value.startsWith("[");
}
function createDraftGc(db, input) {
	const initial = initialDraftGcTransition(Date.now(), input.collectDelay ?? 1e4);
	const current = { state: initial.state };
	const timers = /* @__PURE__ */ new Set();
	const dispatch = (event) => {
		const next = transitionDraftGc(current.state, event);
		current.state = next.state;
		next.commands.forEach(perform);
	};
	const perform = (command) => {
		if (command.type === "collect") return dispatch(collect(command.attempt, command.at, command.before));
		if (command.type === "report-error") return input.onError?.(command.error);
		timers.forEach(clearTimeout);
		timers.clear();
		if (command.type === "cancel-timer") return;
		const timer = setTimeout(() => dispatch({
			type: "timer.fired",
			attempt: command.attempt,
			at: Date.now()
		}), command.delayMs);
		timer.unref();
		timers.add(timer);
	};
	const collect = (attempt, at, before) => {
		try {
			return {
				type: "collect.succeeded",
				attempt,
				at,
				oldestOrphanAt: collectBlobs(db, before)
			};
		} catch (error) {
			return {
				type: "collect.failed",
				attempt,
				at,
				error
			};
		}
	};
	initial.commands.forEach(perform);
	return { dispatch };
}
var stored = sql`
  SELECT json_extract(node.value, '$.id')
  FROM ${document}, json_tree(${document.value}) AS node
  WHERE json_valid(${document.value}) AND node.key = 'blob' AND node.type = 'object'
    AND json_type(node.value, '$.id') = 'text'
  UNION
  SELECT chunk.value
  FROM ${document}, json_tree(${document.value}) AS node, json_each(node.value, '$.ids') AS chunk
  WHERE json_valid(${document.value}) AND node.key = 'blob' AND node.type = 'object'
    AND json_type(node.value, '$.ids') = 'array'
`;
function collectBlobs(db, before) {
	return db.transaction(() => {
		if (!db.get(sql`SELECT EXISTS (SELECT 1 FROM ${blobs}) AS found`)?.found) return null;
		db.run(sql`DELETE FROM ${blobs} WHERE ${blobs.touched_at} < ${before} AND ${blobs.id} NOT IN (${stored})`);
		return db.get(sql`SELECT MIN(${blobs.touched_at}) AS oldest FROM ${blobs} WHERE ${blobs.id} NOT IN (${stored})`)?.oldest ?? null;
	});
}
//#endregion
//#region src/main/storage/legacy.ts
var DRAFT_RETENTION_MS = 2592e6;
var DRAFT_KEEP_RECENT = 100;
var Entries = fromJsonString(Record(String$1, Unknown));
var decode = decodeUnknownOption(Entries);
var importLegacyStores = fn("DesktopStorage.importLegacyStores")(function* (db, userData) {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const names = (yield* fs.readDirectory(userData).pipe(orElseSucceed(() => []))).filter(isStoreFile);
	const candidates = (yield* forEach(names, fnUntraced(function* (name) {
		const file = path.join(userData, name);
		const stats = yield* fs.stat(file).pipe(orElseSucceed(() => void 0));
		if (stats?.type !== "File") return;
		const raw = yield* fs.readFileString(file).pipe(orElseSucceed(() => void 0));
		if (raw === void 0) return;
		const entries = decode(raw);
		if (isNone(entries)) {
			yield* logWarning("legacy store is not readable, leaving it in place", { name });
			return;
		}
		return {
			name,
			path: file,
			modified: getOrElse(stats.mtime, () => /* @__PURE__ */ new Date(0)).getTime(),
			entries: entries.value
		};
	}), { concurrency: 5 })).filter((file) => !!file);
	const kept = new Set(candidates.filter((file) => isDraft(file.name) && Object.keys(file.entries).length > 0).filter((file) => Date.now() - file.modified <= DRAFT_RETENTION_MS).sort((a, b) => b.modified - a.modified).slice(0, DRAFT_KEEP_RECENT).map((file) => file.name));
	const rows = candidates.filter((file) => !isDraft(file.name) || kept.has(file.name)).flatMap((file) => Object.entries(file.entries).map(([key, value]) => ({
		name: file.name,
		key,
		value: typeof value === "string" ? value : JSON.stringify(value),
		updated_at: file.modified
	})));
	if (rows.length > 0) db.transaction((tx) => {
		rows.forEach((row) => tx.insert(state).values(row).onConflictDoNothing().run());
	});
	yield* forEach(candidates, (file) => fs.remove(file.path, { force: true }), {
		concurrency: "unbounded",
		discard: true
	});
	return {
		imported: rows.length,
		removed: candidates.map((file) => file.name)
	};
});
function isStoreFile(name) {
	return name === "default.dat" || /^opencode\..+\.dat$/.test(name);
}
function isDraft(name) {
	return name.startsWith("opencode.draft.");
}
//#endregion
//#region src/main/storage/state.ts
function createStateStore(db, input = {}) {
	const byKey = and(eq(state.name, sql.placeholder("name")), eq(state.key, sql.placeholder("key")));
	const read = db.select({ value: state.value }).from(state).where(byKey).prepare();
	const remove = db.delete(state).where(byKey).prepare();
	const upsert = db.insert(state).values({
		name: sql.placeholder("name"),
		key: sql.placeholder("key"),
		value: sql.placeholder("value"),
		updated_at: sql.placeholder("updated_at")
	}).onConflictDoUpdate({
		target: [state.name, state.key],
		set: {
			value: sql.placeholder("value"),
			updated_at: sql.placeholder("updated_at")
		}
	}).prepare();
	const writer = createWriteBehind({
		delay: 250,
		onError: input.onError,
		write: (batch) => db.transaction(() => {
			const updated_at = Date.now();
			for (const row of batch.values()) if (row.value === null) remove.run({
				name: row.name,
				key: row.key
			});
			else upsert.run({
				name: row.name,
				key: row.key,
				value: row.value,
				updated_at
			});
		})
	});
	const id = (name, key) => `${name}\0${key}`;
	const set = (name, key, value) => writer.set(id(name, key), {
		name,
		key,
		value
	});
	const unset = (name, key) => writer.set(id(name, key), {
		name,
		key,
		value: null
	});
	let revision = 0;
	return {
		get(name, key) {
			const queued = writer.get(id(name, key));
			if (queued) return queued.value;
			return read.get({
				name,
				key
			})?.value ?? null;
		},
		set,
		delete: unset,
		items(name) {
			const items = Object.fromEntries(db.select({
				key: state.key,
				value: state.value
			}).from(state).where(eq(state.name, name)).all().map((row) => [row.key, row.value]));
			for (const row of writer.entries()) {
				if (row.name !== name) continue;
				if (row.value === null) delete items[row.key];
				else items[row.key] = row.value;
			}
			return {
				items,
				revision
			};
		},
		update(name, insert, removed) {
			if (writer.closed()) throw new Error("Write-behind buffer is closed");
			for (const [key, value] of Object.entries(insert)) set(name, key, value);
			for (const key of removed) unset(name, key);
			return ++revision;
		},
		clear(name) {
			writer.drop((row) => row.name === name);
			db.delete(state).where(eq(state.name, name)).run();
		},
		flush: writer.flush,
		close: writer.close
	};
}
//#endregion
//#region src/main/storage/index.ts
var Service$6 = class extends Service$9()("opencode/desktop/DesktopStorage") {};
var layer$7 = effect(Service$6, gen(function* () {
	const path = yield* Path$1;
	const runFork = runForkWith(yield* context());
	const userData = app.getPath("userData");
	const storage = make$4(path.join(userData, "drafts.sqlite"), (error) => runFork(logError("storage flush failed", { error })));
	if (storage.moved) yield* logWarning("drafts.sqlite was the OpenCode CLI database; moved it aside", { to: storage.moved });
	yield* importLegacyStores(storage.db, userData).pipe(tap((result) => result.removed.length === 0 ? void_ : logInfo("imported legacy store files", {
		imported: result.imported,
		files: result.removed
	})), catch_((error) => logWarning("failed to import legacy store files", { error })));
	const wire = (_event, win) => win.on("session-end", storage.flush);
	app.on("before-quit", storage.flush);
	app.on("browser-window-created", wire);
	BrowserWindow.getAllWindows().forEach((win) => wire(void 0, win));
	yield* addFinalizer$1(() => sync(() => {
		app.off("before-quit", storage.flush);
		app.off("browser-window-created", wire);
		BrowserWindow.getAllWindows().forEach((win) => win.off("session-end", storage.flush));
		storage.close();
	}));
	setStorageSnapshotProvider((names) => ({
		storage: Object.fromEntries(names.map((name) => [name, storage.state.items(name)])),
		plugins: readEnableState(storage.db.$client)
	}));
	marks.storage = Date.now();
	return Service$6.of(storage);
}));
function make$4(filename, onError) {
	const database = openDatabase(filename);
	const state = createStateStore(database.db, { onError });
	const drafts = createDraftStore(database.db, { onError });
	return {
		db: database.db,
		moved: database.moved,
		state,
		drafts,
		flush() {
			state.flush();
			drafts.flush();
		},
		close() {
			state.close();
			drafts.close();
			database.close();
		}
	};
}
//#endregion
//#region src/main/lifecycle/machine.ts
function initialState$1() {
	return {
		status: "running",
		attempt: 0
	};
}
function transition$2(state, event) {
	if (event.type === "restart.requested") return restartRequested(state, event);
	if (event.type === "exit.requested") return exitRequested(state, event.mode);
	if (event.type === "session.ending") return state.status === "stopping" && state.exit === "relaunch" ? {
		state: {
			...state,
			exit: "quit"
		},
		commands: []
	} : exitRequested(state, "quit");
	if (event.type === "before.quit") return state.status === "handing-off" ? unchanged$8(state) : exitRequested(state, "quit");
	if (event.type === "will.quit") return willQuit(state);
	return stepSettled(state, event);
}
/** The app starts no plugin, and the windows that close are restored on the next launch. */
var isQuitting = (state) => state.status !== "running" && state.status !== "resuming";
/** The scope a stop leaves running: the restart caller's, until the handoff settled. */
var keptScope = (state) => state.status === "suspending" || state.status === "handing-off" ? state.keep : void 0;
/** The macOS dock reopens windows until a real quit starts; a restart handoff can still fail and keep the app. */
var restoresWindows = (state) => state.status !== "stopping" && state.status !== "quitting";
/** Electron's `before-quit` waits for the plugins to stop first. */
var preventsQuit = (state) => state.status !== "handing-off" && state.status !== "quitting";
/**
* On macOS the app outlives its windows, except during a quit: Electron emits `window-all-closed` instead of `will-quit`
* when it lost track of one, so finish it.
*/
var quitsWhenAllWindowsClosed = (state, platform) => platform !== "darwin" || state.status === "stopping" || state.status === "quitting";
function restartRequested(state, event) {
	if (state.status === "running") return {
		state: {
			status: "suspending",
			attempt: state.attempt + 1,
			keep: event.keep,
			handoff: event.handoff,
			reply: event.reply
		},
		commands: [{
			type: "stop-plugins",
			attempt: state.attempt + 1
		}]
	};
	const kind = state.status === "stopping" || state.status === "quitting" ? "quitting" : "busy";
	return unchanged$8(state, [{
		type: "reject",
		reply: event.reply,
		reason: { kind }
	}]);
}
function exitRequested(state, mode) {
	if (state.status === "quitting") return unchanged$8(state);
	if (state.status === "stopping") {
		const exit = state.exit === "relaunch" ? "relaunch" : mode;
		return exit === state.exit ? unchanged$8(state) : {
			state: {
				...state,
				exit
			},
			commands: []
		};
	}
	return {
		state: {
			status: "stopping",
			attempt: state.attempt + 1,
			exit: mode
		},
		commands: [...superseded(state), {
			type: "stop-plugins",
			attempt: state.attempt + 1
		}]
	};
}
function willQuit(state) {
	if (state.status === "quitting") return unchanged$8(state);
	if (state.status === "stopping") return {
		state: { status: "quitting" },
		commands: []
	};
	return {
		state: { status: "quitting" },
		commands: [...superseded(state), {
			type: "stop-plugins",
			attempt: state.attempt + 1
		}]
	};
}
function stepSettled(state, event) {
	if (state.status === "quitting" || state.attempt !== event.attempt) return unchanged$8(state);
	if (event.type === "plugins.stopped" && state.status === "suspending") {
		if (state.handoff) return {
			state: {
				status: "handing-off",
				attempt: state.attempt,
				keep: state.keep,
				reply: state.reply
			},
			commands: [{
				type: "run-handoff",
				attempt: state.attempt,
				handoff: state.handoff
			}]
		};
		return {
			state: { status: "quitting" },
			commands: [{
				type: "resolve",
				reply: state.reply
			}, {
				type: "exit",
				mode: "relaunch"
			}]
		};
	}
	if (event.type === "plugins.stopped" && state.status === "stopping") return {
		state: { status: "quitting" },
		commands: [{
			type: "exit",
			mode: state.exit
		}]
	};
	if (event.type === "handoff.succeeded" && state.status === "handing-off") return {
		state: { status: "quitting" },
		commands: [{
			type: "resolve",
			reply: state.reply
		}]
	};
	if (event.type === "handoff.failed" && state.status === "handing-off") return {
		state: {
			status: "resuming",
			attempt: state.attempt,
			error: event.error,
			reply: state.reply
		},
		commands: [{
			type: "resume-plugins",
			attempt: state.attempt
		}]
	};
	if (event.type === "plugins.resumed" && state.status === "resuming") return {
		state: {
			status: "running",
			attempt: state.attempt
		},
		commands: [{
			type: "reject",
			reply: state.reply,
			reason: {
				kind: "failed",
				error: state.error
			}
		}]
	};
	return unchanged$8(state);
}
/** Rejects the restart a quit supersedes; a resuming one already failed. */
function superseded(state) {
	if (state.status === "resuming") return [{
		type: "reject",
		reply: state.reply,
		reason: {
			kind: "failed",
			error: state.error
		}
	}];
	if (state.status === "suspending" || state.status === "handing-off") return [{
		type: "reject",
		reply: state.reply,
		reason: { kind: "quitting" }
	}];
	return [];
}
function unchanged$8(state, commands = []) {
	return {
		state,
		commands
	};
}
/**
* Runs the machine: it applies each event, then performs the commands, each of which reports back through a later
* event. It holds no other state.
*/
function createDriver$2(input) {
	const current = { state: initialState$1() };
	const dispatch = (event) => {
		const next = transition$2(current.state, event);
		current.state = next.state;
		next.commands.forEach(perform);
	};
	const perform = (command) => {
		if (command.type === "stop-plugins") {
			const done = () => dispatch({
				type: "plugins.stopped",
				attempt: command.attempt
			});
			input.stop().then(done, done);
			return;
		}
		if (command.type === "run-handoff") return void Promise.resolve().then(command.handoff).then(() => dispatch({
			type: "handoff.succeeded",
			attempt: command.attempt
		}), (cause) => dispatch({
			type: "handoff.failed",
			attempt: command.attempt,
			error: cause
		}));
		if (command.type === "resume-plugins") {
			const done = () => dispatch({
				type: "plugins.resumed",
				attempt: command.attempt
			});
			input.resume().then(done, done);
			return;
		}
		if (command.type === "resolve") return command.reply.resolve();
		if (command.type === "reject") return command.reply.reject(rejection$1(command.reason));
		input.exit(command.mode);
	};
	return {
		state: () => current.state,
		dispatch,
		/** Stops every plugin but `keep`, then runs the handoff, or relaunches without one. Rejects when the handoff fails. */
		restart: (keep, handoff) => new Promise((resolve, reject) => dispatch({
			type: "restart.requested",
			keep,
			handoff,
			reply: {
				resolve,
				reject
			}
		}))
	};
}
function rejection$1(reason) {
	if (reason.kind === "failed") return reason.error;
	if (reason.kind === "busy") return /* @__PURE__ */ new Error("Application restart is already in progress");
	return /* @__PURE__ */ new Error("Application is quitting");
}
//#endregion
//#region src/main/windows/appearance.ts
var titlebarThemes = /* @__PURE__ */ new WeakMap();
var pinchZoomEnabled = /* @__PURE__ */ new WeakMap();
var maxZoomLevel = 10;
var minZoomLevel = .2;
var backgroundColor;
function windowAppearance(path, paths) {
	return {
		title: "Apna OpenCode",
		icon: iconPath(path, paths),
		backgroundColor: backgroundColor ?? storedBackgroundColor(),
		...windowGlass,
		...platformFrame(tone(), storedZoomLevel()),
		webPreferences: {
			preload: paths.preloadPath,
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true
		}
	};
}
function setDockIcon(path, paths) {
	if (process.platform !== "darwin") return;
	const icon = nativeImage.createFromPath(path.join(iconsDir(path, paths), "dock.png"));
	if (!icon.isEmpty()) app.dock?.setIcon(icon);
}
function setBackgroundColor(color) {
	if (getBackgroundColor() !== color) getStore().set(BACKGROUND_COLOR_KEY, color);
	backgroundColor = color;
	BrowserWindow.getAllWindows().forEach((win) => {
		if (!glassEnabled) win.setBackgroundColor(color);
		if (process.platform === "darwin") win.invalidateShadow();
	});
}
function getBackgroundColor() {
	return backgroundColor ?? savedBackgroundColor();
}
function setTitlebar(win, theme = {}) {
	titlebarThemes.set(win, theme);
	if (process.platform === "darwin" || process.platform === "win32") nativeTheme.themeSource = theme.scheme ?? theme.mode ?? "system";
	updateTitlebar(win);
}
function setTrafficLightsPosition(win, position) {
	if (process.platform !== "darwin") return;
	win.setWindowButtonPosition({
		x: Math.round(position.x),
		y: Math.round(position.y)
	});
}
function updateTitlebar(win) {
	if (process.platform !== "win32") return;
	win.setTitleBarOverlay(overlay(titlebarThemes.get(win), win.webContents.getZoomFactor()));
}
function setPinchZoomEnabled(enabled) {
	getStore().set(PINCH_ZOOM_ENABLED_KEY, enabled);
	BrowserWindow.getAllWindows().forEach((win) => {
		pinchZoomEnabled.set(win, enabled);
		emitIpcEvent(win.webContents, new WindowPinchZoomChanged({ enabled }));
		if (!enabled) win.webContents.setZoomFactor(storedZoomLevel());
		updateZoom(win);
	});
}
function getPinchZoomEnabled() {
	return getStore().get(PINCH_ZOOM_ENABLED_KEY) === true;
}
function setZoomLevel(level) {
	if (storedZoomLevel() !== level) getStore().set(ZOOM_LEVEL_KEY, level);
	BrowserWindow.getAllWindows().forEach((win) => {
		win.webContents.setZoomFactor(level);
		updateZoom(win);
	});
}
function wireZoom(win) {
	pinchZoomEnabled.set(win, getPinchZoomEnabled());
	win.webContents.setZoomFactor(storedZoomLevel());
	updateTitlebar(win);
	win.webContents.on("zoom-changed", (event, direction) => {
		event.preventDefault();
		if (pinchZoomEnabled.get(win)) {
			const delta = direction === "in" ? .2 : -.2;
			win.webContents.setZoomFactor(clampZoom(win.webContents.getZoomFactor() + delta));
			updateZoom(win);
			return;
		}
		win.webContents.setZoomFactor(storedZoomLevel());
		updateZoom(win);
	});
}
function wireFullscreen(win) {
	const send = (fullscreen) => {
		if (win.isDestroyed() || win.webContents.isDestroyed()) return;
		emitIpcEvent(win.webContents, new WindowFullscreenChanged({ fullscreen }));
	};
	win.on("enter-full-screen", () => send(true));
	win.on("leave-full-screen", () => send(false));
}
function wireFocus(win) {
	const send = (focused) => {
		if (win.isDestroyed() || win.webContents.isDestroyed()) return;
		emitIpcEvent(win.webContents, new WindowFocusChanged({ focused }));
	};
	win.on("focus", () => send(true));
	win.on("blur", () => send(false));
}
function iconsDir(path, paths) {
	return app.isPackaged ? path.join(process.resourcesPath, "icons") : path.join(paths.developmentResourcesRoot, "icons");
}
function iconPath(path, paths) {
	return path.join(iconsDir(path, paths), `icon.${process.platform === "win32" ? "ico" : "png"}`);
}
function overlay(theme = {}, zoom = 1) {
	return titlebarOverlay(theme.mode ?? tone(), zoom);
}
function clampZoom(value) {
	return Math.min(Math.max(value, minZoomLevel), maxZoomLevel);
}
function updateZoom(win) {
	updateTitlebar(win);
	emitIpcEvent(win.webContents, new WindowZoomChanged({
		factor: win.webContents.getZoomFactor(),
		level: storedZoomLevel()
	}));
}
//#endregion
//#region src/main/windows/recovery-machine.ts
/** Delay between JavaScript call-stack samples while a renderer is unresponsive. */
var SAMPLE_INTERVAL_MS = 1e3;
/** How long one unresponsive call-stack sampling session lasts. */
var SAMPLE_PERIOD_MS = 15e3;
/** Bounds a debug-log export, so a hung export never leaves the window without a recovery prompt. */
var EXPORT_TIMEOUT_MS = 3e4;
var ERR_ABORTED = -3;
var INITIAL = Object.freeze({
	status: "idle",
	attempt: 0
});
var CLOSED$1 = Object.freeze({ status: "closed" });
var UNRESPONSIVE = Object.freeze({ kind: "unresponsive" });
var UNRESPONSIVE_ACTIONS = Object.freeze([
	"relaunch",
	"export-logs",
	"keep-waiting"
]);
var FATAL_ACTIONS = Object.freeze([
	"relaunch",
	"export-logs",
	"quit"
]);
var PRIORITY = {
	unresponsive: 1,
	"load-failed": 2,
	terminated: 3
};
function initialRecoveryState() {
	return INITIAL;
}
function transitionRecovery(state, event) {
	if (state.status === "closed") return unchanged$7(state);
	switch (event.type) {
		case "window.closed": return close(state);
		case "load.failed":
			if (!event.isMainFrame || event.code === ERR_ABORTED) return unchanged$7(state);
			return report(state, {
				kind: "load-failed",
				url: event.url,
				code: event.code,
				description: event.description
			}, false);
		case "process.gone": return report(state, {
			kind: "terminated",
			reason: event.reason,
			exitCode: event.exitCode
		}, false);
		case "renderer.unresponsive": return report(state, UNRESPONSIVE, event.devtoolsOpen);
		case "renderer.responsive": return recover(state);
		case "dialog.responded":
		case "dialog.failed": return answer(state, event);
		case "export.succeeded":
		case "export.failed":
		case "export.timed-out": return settleExport(state, event);
		case "sample.tick":
		case "sample.collected":
		case "sample.failed":
		case "sample.window-elapsed": return sample(state, event);
	}
}
/** The dialog the window shows now, or undefined when none should be open. */
function selectDialog(state) {
	if (state.status !== "dialog") return void 0;
	return {
		attempt: state.attempt,
		incident: state.incident,
		actions: state.incident.kind === "unresponsive" ? UNRESPONSIVE_ACTIONS : FATAL_ACTIONS,
		defaultId: 0,
		cancelId: 2
	};
}
/** Formats aggregated unresponsive call-stack samples, most frequent first. */
function formatUnresponsiveSamples(windowName, url, samples) {
	const entries = [...samples.entries()].sort((a, b) => b[1] - a[1]);
	return [
		"renderer unresponsive samples",
		`Window: ${windowName}`,
		`URL: ${url}`,
		...entries.map((entry) => `<${entry[1]}> ${entry[0]}`),
		`Total Samples: ${entries.reduce((sum, entry) => sum + entry[1], 0)}`
	].join("\n");
}
function close(state) {
	if (state.status === "idle") return {
		state: CLOSED$1,
		commands: []
	};
	if (state.status === "sampling") return {
		state: CLOSED$1,
		commands: stopSample(state.sample)
	};
	if (state.status === "exporting") return {
		state: CLOSED$1,
		commands: [{ type: "cancel-export-timeout" }]
	};
	return {
		state: CLOSED$1,
		commands: [...stopSample(state.sample), {
			type: "close-dialog",
			attempt: state.attempt
		}]
	};
}
function report(state, incident, devtoolsOpen) {
	if (state.status === "idle") return open(state.attempt, incident, incident.kind === "unresponsive" && !devtoolsOpen, []);
	if (state.status === "sampling") {
		if (incident.kind === "unresponsive") return {
			state: {
				status: "dialog",
				attempt: state.attempt + 1,
				incident,
				sample: state.sample
			},
			commands: [{ type: "reveal" }, {
				type: "open-dialog",
				attempt: state.attempt + 1
			}]
		};
		return open(state.attempt, incident, false, stopSample(state.sample));
	}
	if (state.status === "dialog") {
		if (PRIORITY[incident.kind] <= PRIORITY[state.incident.kind]) return unchanged$7(state);
		return open(state.attempt, incident, false, [...stopSample(state.sample), {
			type: "close-dialog",
			attempt: state.attempt
		}]);
	}
	if (state.incident && PRIORITY[incident.kind] <= PRIORITY[state.incident.kind]) return unchanged$7(state);
	return {
		state: {
			...state,
			incident,
			resumeSampling: incident.kind === "unresponsive" && !devtoolsOpen
		},
		commands: []
	};
}
function recover(state) {
	if (state.status === "sampling") return {
		state: idle$1(state.attempt),
		commands: stopSample(state.sample)
	};
	if (state.status === "dialog" && state.incident.kind === "unresponsive") return {
		state: idle$1(state.attempt),
		commands: [...stopSample(state.sample), {
			type: "close-dialog",
			attempt: state.attempt
		}]
	};
	if (state.status === "exporting" && state.incident?.kind === "unresponsive") return {
		state: {
			...state,
			incident: void 0,
			resumeSampling: false
		},
		commands: []
	};
	return unchanged$7(state);
}
function answer(state, event) {
	if (state.status !== "dialog" || state.attempt !== event.attempt) return unchanged$7(state);
	if (event.type === "dialog.failed") return {
		state: dismiss(state),
		commands: [{
			type: "log-error",
			kind: "dialog",
			error: event.error
		}]
	};
	if (event.action === "export-logs") return {
		state: {
			status: "exporting",
			attempt: state.attempt + 1,
			incident: state.incident,
			resumeSampling: state.sample !== void 0
		},
		commands: [
			...stopSample(state.sample),
			{
				type: "export-logs",
				attempt: state.attempt + 1
			},
			{
				type: "start-export-timeout",
				attempt: state.attempt + 1
			}
		]
	};
	if (event.action === "relaunch") return {
		state: CLOSED$1,
		commands: [...stopSample(state.sample), { type: "relaunch" }]
	};
	if (event.action === "quit") return {
		state: CLOSED$1,
		commands: [...stopSample(state.sample), { type: "quit" }]
	};
	return {
		state: dismiss(state),
		commands: []
	};
}
function settleExport(state, event) {
	if (state.status !== "exporting" || state.attempt !== event.attempt) return unchanged$7(state);
	const commands = exportOutcome(event);
	if (!state.incident) return {
		state: idle$1(state.attempt),
		commands
	};
	return open(state.attempt, state.incident, state.incident.kind === "unresponsive" && state.resumeSampling && !event.devtoolsOpen, commands);
}
function exportOutcome(event) {
	if (event.type === "export.succeeded") return [{ type: "cancel-export-timeout" }];
	if (event.type === "export.failed") return [{ type: "cancel-export-timeout" }, {
		type: "log-error",
		kind: "export",
		error: event.error
	}];
	return [{
		type: "log-error",
		kind: "export-timeout"
	}];
}
function sample(state, event) {
	if (state.status !== "sampling" && state.status !== "dialog") return unchanged$7(state);
	const session = state.sample;
	if (!session || session.attempt !== event.attempt) return unchanged$7(state);
	if (event.type === "sample.window-elapsed") return {
		state: state.status === "sampling" ? idle$1(state.attempt) : {
			...state,
			sample: void 0
		},
		commands: stopSample(session)
	};
	if (event.type === "sample.tick") {
		if (session.collecting) return unchanged$7(state);
		return {
			state: {
				...state,
				sample: {
					...session,
					collecting: true
				}
			},
			commands: [{
				type: "collect-sample",
				attempt: session.attempt
			}]
		};
	}
	if (!session.collecting) return unchanged$7(state);
	const tick = {
		type: "start-sample-tick",
		attempt: session.attempt
	};
	if (event.type === "sample.failed") return {
		state: {
			...state,
			sample: {
				...session,
				collecting: false
			}
		},
		commands: [{
			type: "log-error",
			kind: "sample",
			error: event.error
		}, tick]
	};
	return {
		state: {
			...state,
			sample: {
				...session,
				collecting: false,
				samples: event.stack ? new Map(session.samples).set(event.stack, (session.samples.get(event.stack) ?? 0) + 1) : session.samples
			}
		},
		commands: [tick]
	};
}
function open(attempt, incident, sampling, commands) {
	const dialog = sampling ? attempt + 2 : attempt + 1;
	return {
		state: {
			status: "dialog",
			attempt: dialog,
			incident,
			sample: sampling ? {
				attempt: attempt + 1,
				collecting: false,
				samples: /* @__PURE__ */ new Map()
			} : void 0
		},
		commands: [
			...commands,
			...sampling ? [{
				type: "start-sample-tick",
				attempt: attempt + 1
			}, {
				type: "start-sample-window",
				attempt: attempt + 1
			}] : [],
			{ type: "reveal" },
			{
				type: "open-dialog",
				attempt: dialog
			}
		]
	};
}
function dismiss(state) {
	return state.sample ? {
		status: "sampling",
		attempt: state.attempt,
		sample: state.sample
	} : idle$1(state.attempt);
}
function stopSample(session) {
	if (!session) return [];
	if (session.samples.size === 0) return [{ type: "cancel-sample-timers" }];
	return [{ type: "cancel-sample-timers" }, {
		type: "flush-samples",
		samples: session.samples
	}];
}
function idle$1(attempt) {
	return {
		status: "idle",
		attempt
	};
}
function unchanged$7(state) {
	return {
		state,
		commands: []
	};
}
/** Runs one window's recovery machine and owns its timers, dialog and export. */
function createRecoveryDriver(input) {
	const current = { state: initialRecoveryState() };
	const handles = {
		timers: {
			tick: void 0,
			window: void 0,
			export: void 0
		},
		dialog: void 0
	};
	const dispatch = (event) => {
		const next = transitionRecovery(current.state, event);
		current.state = next.state;
		next.commands.forEach((command) => Promise.try(() => perform(command)).catch((error) => input.logError({
			kind: "command",
			error
		})));
	};
	const arm = (timer, delay, event) => {
		clearTimeout(handles.timers[timer]);
		handles.timers[timer] = setTimeout(() => dispatch(event()), delay);
	};
	const disarm = (timer) => {
		clearTimeout(handles.timers[timer]);
		handles.timers[timer] = void 0;
	};
	const answered = (controller, event) => {
		if (controller.signal.aborted) return;
		dispatch(input.isDestroyed() ? { type: "window.closed" } : event);
	};
	const openDialog = (attempt) => {
		const controller = new AbortController();
		const settled = (handles.dialog?.settled ?? Promise.resolve()).then(() => {
			const view = selectDialog(current.state);
			if (controller.signal.aborted || view?.attempt !== attempt) return;
			if (input.isDestroyed()) return dispatch({ type: "window.closed" });
			return input.showDialog(view, controller.signal).then((response) => answered(controller, {
				type: "dialog.responded",
				attempt,
				action: view.actions[response]
			}), (error) => answered(controller, {
				type: "dialog.failed",
				attempt,
				error
			}));
		}).finally(() => {
			if (handles.dialog?.controller === controller) handles.dialog = void 0;
		});
		handles.dialog = {
			attempt,
			controller,
			settled
		};
	};
	const perform = (command) => {
		switch (command.type) {
			case "reveal": return input.reveal();
			case "open-dialog": return openDialog(command.attempt);
			case "close-dialog":
				if (handles.dialog?.attempt === command.attempt) handles.dialog.controller.abort();
				return;
			case "export-logs":
				input.exportLogs().then(() => dispatch({
					type: "export.succeeded",
					attempt: command.attempt,
					devtoolsOpen: input.isDevToolsOpen()
				}), (error) => dispatch({
					type: "export.failed",
					attempt: command.attempt,
					error,
					devtoolsOpen: input.isDevToolsOpen()
				}));
				return;
			case "start-export-timeout": return arm("export", EXPORT_TIMEOUT_MS, () => ({
				type: "export.timed-out",
				attempt: command.attempt,
				devtoolsOpen: input.isDevToolsOpen()
			}));
			case "cancel-export-timeout": return disarm("export");
			case "start-sample-tick": return arm("tick", SAMPLE_INTERVAL_MS, () => ({
				type: "sample.tick",
				attempt: command.attempt
			}));
			case "start-sample-window": return arm("window", SAMPLE_PERIOD_MS, () => ({
				type: "sample.window-elapsed",
				attempt: command.attempt
			}));
			case "cancel-sample-timers":
				disarm("tick");
				return disarm("window");
			case "collect-sample":
				input.collectSample().then((stack) => dispatch({
					type: "sample.collected",
					attempt: command.attempt,
					stack
				}), (error) => dispatch({
					type: "sample.failed",
					attempt: command.attempt,
					error
				}));
				return;
			case "flush-samples": return input.flushSamples(command.samples);
			case "log-error": return input.logError(command);
			case "relaunch": return input.relaunch();
			case "quit": return input.quit();
		}
	};
	return {
		state: () => current.state,
		dispatch
	};
}
//#endregion
//#region src/main/windows/state.ts
var destroyedWindowURL = "<destroyed>";
function safeWebContentsURL(webContents) {
	try {
		if (webContents.isDestroyed()) return destroyedWindowURL;
		return webContents.getURL();
	} catch {
		return destroyedWindowURL;
	}
}
function safeWindowURL(win) {
	try {
		if (win.isDestroyed()) return destroyedWindowURL;
		return safeWebContentsURL(win.webContents);
	} catch {
		return destroyedWindowURL;
	}
}
//#endregion
//#region src/main/windows/recovery.ts
var ACTION_LABELS = {
	relaunch: "desktop.recovery.action.relaunch",
	"export-logs": "desktop.recovery.action.exportLogs",
	"keep-waiting": "desktop.recovery.action.keepWaiting",
	quit: "desktop.recovery.action.quit"
};
var ERROR_MESSAGES = {
	dialog: "failed to show recovery dialog",
	export: "failed to export debug logs",
	"export-timeout": "debug log export timed out",
	sample: "failed to collect unresponsive sample",
	command: "recovery command failed"
};
var windowRecovery = gen(function* () {
	const context$4 = yield* context();
	const runFork = runForkWith(context$4);
	const runPromise = runPromiseWith(context$4);
	const logging = yield* Service$8;
	function wireWindowRecovery(win, name, options) {
		const isDevToolsOpen = () => !win.isDestroyed() && win.webContents.isDevToolsOpened();
		const recovery = createRecoveryDriver({
			reveal: options.reveal,
			showDialog: (view, signal) => {
				const text = dialogText(view.incident, name);
				return dialog.showMessageBox(win, {
					type: "warning",
					buttons: view.actions.map((action) => nativeT(ACTION_LABELS[action])),
					defaultId: view.defaultId,
					cancelId: view.cancelId,
					message: text.message,
					detail: text.detail,
					signal
				}).then((result) => result.response);
			},
			exportLogs: () => runPromise(asVoid(logging.exportDebug)),
			collectSample: async () => {
				if (win.isDestroyed() || win.webContents.isDestroyed() || win.webContents.mainFrame.isDestroyed()) return;
				return await win.webContents.mainFrame.collectJavaScriptCallStack() || void 0;
			},
			flushSamples: (samples) => runFork(scoped("window", logError(formatUnresponsiveSamples(name, safeWindowURL(win), samples)))),
			logError: (failure) => runFork(scoped("window", logError(ERROR_MESSAGES[failure.kind], {
				window: name,
				error: failure.error
			}))),
			isDevToolsOpen,
			isDestroyed: () => win.isDestroyed(),
			relaunch: options.relaunch,
			quit: () => app.quit()
		});
		const failed = (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
			runFork(scoped("window", logError("renderer load failed", {
				window: name,
				event,
				errorCode,
				errorDescription,
				validatedURL,
				currentURL: safeWindowURL(win),
				isMainFrame
			})));
			recovery.dispatch({
				type: "load.failed",
				url: validatedURL,
				code: errorCode,
				description: errorDescription,
				isMainFrame
			});
		};
		win.webContents.on("did-fail-load", (_event, code, description, url, mainFrame) => {
			failed("did-fail-load", code, description, url, mainFrame);
		});
		win.webContents.on("did-fail-provisional-load", (_event, code, description, url, mainFrame) => {
			failed("did-fail-provisional-load", code, description, url, mainFrame);
		});
		win.webContents.on("render-process-gone", (_event, details) => {
			runFork(scoped("window", logError("renderer process gone", {
				window: name,
				currentURL: safeWindowURL(win),
				details
			})));
			recovery.dispatch({
				type: "process.gone",
				reason: details.reason,
				exitCode: details.exitCode
			});
		});
		win.on("unresponsive", () => {
			runFork(scoped("window", logError("renderer unresponsive", {
				window: name,
				currentURL: safeWindowURL(win)
			})));
			recovery.dispatch({
				type: "renderer.unresponsive",
				devtoolsOpen: isDevToolsOpen()
			});
		});
		win.on("responsive", () => {
			runFork(scoped("window", logError("renderer responsive", {
				window: name,
				currentURL: safeWindowURL(win)
			})));
			recovery.dispatch({ type: "renderer.responsive" });
		});
		win.once("closed", () => recovery.dispatch({ type: "window.closed" }));
		win.webContents.on("console-message", (event) => {
			if (event.message.toLowerCase().includes("terminal") || event.sourceId.toLowerCase().includes("terminal")) runFork(scoped("pty", logInfo("console", {
				window: name,
				level: event.level,
				message: event.message,
				line: event.lineNumber,
				sourceId: event.sourceId
			})));
		});
		win.webContents.on("preload-error", (_event, path, error) => {
			runFork(scoped("preload", logError("preload error", {
				window: name,
				preloadPath: path,
				error
			})));
		});
	}
	return wireWindowRecovery;
});
function dialogText(incident, window) {
	if (incident.kind === "unresponsive") return {
		message: nativeT("desktop.recovery.unresponsive"),
		detail: nativeT("desktop.recovery.unresponsive.detail")
	};
	if (incident.kind === "load-failed") return {
		message: nativeT("desktop.recovery.loadFailed"),
		detail: nativeT("desktop.recovery.loadFailed.detail", {
			window,
			url: incident.url,
			code: incident.code,
			description: incident.description
		})
	};
	return {
		message: nativeT("desktop.recovery.terminated"),
		detail: nativeT("desktop.recovery.terminated.detail", {
			window,
			reason: incident.reason,
			code: incident.exitCode ?? nativeT("desktop.recovery.unknown")
		})
	};
}
//#endregion
//#region src/main/windows/reveal-machine.ts
/** How long a hidden window waits for its content and theme before it shows anyway. */
var REVEAL_TIMEOUT_MS = 3e3;
var LOADING = Object.freeze({ status: "loading" });
var CONTENT_READY = Object.freeze({ status: "content-ready" });
var THEME_READY = Object.freeze({ status: "theme-ready" });
var SHOWN = Object.freeze({ status: "shown" });
var CLOSED = Object.freeze({ status: "closed" });
function initialRevealState(early) {
	return early ? SHOWN : LOADING;
}
function transitionReveal(state, event) {
	if (state.status === "closed") return unchanged$6(state);
	if (event.type === "window.closed") return {
		state: CLOSED,
		commands: state.status === "shown" ? [] : [{ type: "cancel-timeout" }]
	};
	if (state.status === "shown") return unchanged$6(state);
	if (event.type === "reveal.timed-out") return show("timeout");
	if (event.type === "recovery.requested") return show("recovery");
	if (event.type === "content.ready") {
		if (state.status === "theme-ready") return show("ready");
		return state.status === "content-ready" ? unchanged$6(state) : {
			state: CONTENT_READY,
			commands: []
		};
	}
	if (state.status === "content-ready") return show("ready");
	return state.status === "theme-ready" ? unchanged$6(state) : {
		state: THEME_READY,
		commands: []
	};
}
function show(reason) {
	return {
		state: SHOWN,
		commands: [{ type: "cancel-timeout" }, {
			type: "show",
			reason
		}]
	};
}
function unchanged$6(state) {
	return {
		state,
		commands: []
	};
}
/** Runs one window's reveal machine and owns its fallback timer. */
function createRevealDriver(input) {
	const current = { state: initialRevealState(input.early) };
	const dispatch = (event) => {
		const next = transitionReveal(current.state, event);
		current.state = next.state;
		next.commands.forEach(perform);
	};
	const timer = input.early ? void 0 : setTimeout(() => dispatch({ type: "reveal.timed-out" }), REVEAL_TIMEOUT_MS);
	const perform = (command) => {
		if (command.type === "cancel-timeout") return clearTimeout(timer);
		input.show(command.reason);
	};
	return { dispatch };
}
//#endregion
//#region src/main/windows/index.ts
var revealDrivers = /* @__PURE__ */ new WeakMap();
var displays = {
	all: () => screen.getAllDisplays().map((display) => display.bounds),
	primary: () => screen.getPrimaryDisplay().bounds,
	matching: (bounds) => screen.getDisplayMatching(bounds).bounds
};
var registry = createWindowRegistry({
	read: () => getStore().get(WINDOW_IDS_KEY),
	write: (ids) => getStore().set(WINDOW_IDS_KEY, ids)
});
var opened = /* @__PURE__ */ new Set();
function getLastFocusedWindow() {
	const focused = BrowserWindow.getFocusedWindow();
	if (focused) return focused;
	const win = registry.lastFocused();
	if (!win || win.isDestroyed()) return null;
	return win;
}
function getWindowByID(id) {
	const win = registry.get(id);
	if (!win || win.isDestroyed()) return null;
	return win;
}
/** The persistent id of an app window, or undefined for popups and other native windows. */
function getWindowID(win) {
	return registry.persisted().find((id) => registry.get(id) === win);
}
/** App windows that host the renderer, excluding popups and other native windows. */
function getMainWindows() {
	return registry.list().filter((win) => !win.isDestroyed());
}
/** Runs for each app window as it registers, before its renderer loads. */
function onMainWindow(listener) {
	opened.add(listener);
	return () => {
		opened.delete(listener);
	};
}
function setWindowThemeReady(win) {
	revealDrivers.get(win)?.dispatch({ type: "theme.ready" });
}
var mainWindows = fn("Window.make")(function* (input) {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const paths = yield* resolve$1;
	const storage = yield* Service$6;
	const runFork = runForkWith(yield* context());
	const wireWindowRecovery = yield* windowRecovery;
	const restore = () => restoreEarlyWindow({
		ids: registry.persisted(),
		fallbackId: randomUUID(),
		openExternal: (url) => runFork(openExternalURL(url))
	}).map((step) => create(step.id, step.kind === "adopt" ? step.entry : void 0));
	const create = (id = randomUUID(), early) => {
		const stateFile = path.join(app.getPath("userData"), windowStateFile(id));
		const state = early?.state ?? resolveWindowState(readWindowState(stateFile), {
			width: 1280,
			height: 800
		}, displays);
		const appearance = windowAppearance(path, paths);
		const win = early?.win ?? new BrowserWindow({
			x: state.x,
			y: state.y,
			width: state.width,
			height: state.height,
			show: false,
			autoHideMenuBar: true,
			...appearance,
			webPreferences: {
				...appearance.webPreferences,
				additionalArguments: windowArguments(id)
			}
		});
		if (!early) {
			allowRendererPermissions(win);
			wireNavigationPolicy(win, (url) => runFork(openExternalURL(url)));
			wireRendererHeaders(win);
			manageWindowState(win, stateFile, state, displays);
		}
		const focusForTests = () => {
			if (app.isPackaged || process.env.OPENCODE_TEST_ONBOARDING !== "1") return;
			if (process.platform === "darwin") app.focus({ steal: true });
			win.focus();
		};
		const reveal = createRevealDriver({
			early: !!early,
			show: (reason) => {
				if (win.isDestroyed()) return;
				win.show();
				focusForTests();
				runFork(logInfo("main window visible", reason === "ready" ? { window: id } : {
					window: id,
					reason
				}));
			}
		});
		revealDrivers.set(win, reveal);
		wireWindowRecovery(win, id, {
			relaunch: input.relaunch,
			reveal: () => reveal.dispatch({ type: "recovery.requested" })
		});
		register(win, id);
		wireFullscreen(win);
		wireFocus(win);
		if (!early) loadWindow(win, "index.html");
		wireZoom(win);
		if (early) {
			focusForTests();
			runFork(logInfo("main window visible", {
				window: id,
				shownAt: early.shownAt
			}));
		}
		const contentReady = () => reveal.dispatch({ type: "content.ready" });
		win.once("ready-to-show", contentReady);
		if (process.platform === "linux") win.webContents.once("did-finish-load", contentReady);
		win.once("closed", () => {
			reveal.dispatch({ type: "window.closed" });
			revealDrivers.delete(win);
		});
		return win;
	};
	const register = (win, id) => {
		registry.register(id, win);
		win.on("focus", () => registry.focused(id));
		win.on("session-end", input.sessionEnding);
		win.on("closed", () => {
			if (!registry.closed(id, isQuitting(input.appState()))) return;
			runFork(gen(function* () {
				yield* try_(() => storage.state.clear(windowDataFile(id)));
				yield* fs.remove(path.join(app.getPath("userData"), windowStateFile(id)), { force: true });
			}).pipe(catch_((error) => scoped("window", logError("failed to clean window state", {
				id,
				error
			})))));
		});
		opened.forEach((listener) => listener(win, id));
	};
	return {
		create,
		restore
	};
});
//#endregion
//#region src/main/lifecycle/deep-link.ts
function consoleReturnWindow(value) {
	try {
		const url = new URL(value);
		if (url.protocol !== "opencode:" || url.hostname !== "console" || url.pathname !== "/authorized") return;
		const id = url.searchParams.get("window");
		if (!id || id.length > 256 || /[\u0000-\u001f\u007f]/.test(id)) return;
		return id;
	} catch {
		return;
	}
}
//#endregion
//#region src/main/deep-links/machine.ts
function createDeepLinkState() {
	return {
		windows: {},
		focusedWindowID: void 0,
		links: [],
		nextAttempt: 1
	};
}
function transitionDeepLinks(state, event) {
	switch (event.type) {
		case "links.received": {
			if (event.urls.length === 0) return unchanged$5(state);
			const links = event.urls.map((url) => ({
				status: "queued",
				url,
				target: consoleReturnWindow(url)
			}));
			const focus = links.find((link) => link.target && state.windows[link.target])?.target ?? preferredWindowID(state);
			const next = drain({
				...state,
				links: [...state.links, ...links]
			});
			return {
				state: next.state,
				commands: focus ? [...next.commands, {
					type: "window.focus",
					windowID: focus
				}] : next.commands
			};
		}
		case "window.opened":
			if (state.windows[event.windowID]) return unchanged$5(state);
			return drain({
				...state,
				windows: {
					...state.windows,
					[event.windowID]: { status: "loading" }
				}
			});
		case "window.focused":
			if (!state.windows[event.windowID] || state.focusedWindowID === event.windowID) return unchanged$5(state);
			return drain({
				...state,
				focusedWindowID: event.windowID
			});
		case "window.ready": {
			const current = state.windows[event.windowID];
			if (current?.status === "ready" && current.clientID === event.clientID) return unchanged$5(state);
			return drain({
				...state,
				windows: {
					...state.windows,
					[event.windowID]: {
						status: "ready",
						clientID: event.clientID
					}
				},
				links: current?.status === "ready" ? requeue(state.links, current.clientID) : state.links
			});
		}
		case "window.closed": {
			const current = state.windows[event.windowID];
			if (!current) return unchanged$5(state);
			return drain({
				...state,
				windows: Object.fromEntries(Object.entries(state.windows).filter(([id]) => id !== event.windowID)),
				focusedWindowID: state.focusedWindowID === event.windowID ? void 0 : state.focusedWindowID,
				links: current.status === "ready" ? requeue(state.links, current.clientID) : state.links
			});
		}
		case "client.disconnected": {
			const windowID = Object.entries(state.windows).find(([, window]) => window.status === "ready" && window.clientID === event.clientID)?.[0];
			const delivered = state.links.some((link) => link.status === "delivered" && link.clientID === event.clientID);
			if (!windowID && !delivered) return unchanged$5(state);
			return drain({
				...state,
				windows: windowID ? {
					...state.windows,
					[windowID]: { status: "loading" }
				} : state.windows,
				links: requeue(state.links, event.clientID)
			});
		}
		case "delivery.acknowledged": {
			const links = state.links.filter((link) => link.status !== "delivered" || link.clientID !== event.clientID || link.attempt !== event.attempt);
			if (links.length === state.links.length) return unchanged$5(state);
			return {
				state: {
					...state,
					links
				},
				commands: []
			};
		}
	}
}
function preferredWindowID(state) {
	return state.focusedWindowID ?? Object.keys(state.windows)[0];
}
function recipientOf(state, link) {
	const windowID = link.target && state.windows[link.target] ? link.target : preferredWindowID(state);
	const window = windowID ? state.windows[windowID] : void 0;
	if (!windowID || window?.status !== "ready") return;
	return {
		windowID,
		clientID: window.clientID
	};
}
function drain(state) {
	const routed = state.links.map((link) => ({
		link,
		recipient: link.status === "queued" ? recipientOf(state, link) : void 0
	}));
	const recipients = routed.flatMap((item) => item.recipient ? [item.recipient] : []);
	const batches = recipients.filter((recipient, index) => recipients.findIndex((other) => other.windowID === recipient.windowID) === index).map((recipient, index) => ({
		...recipient,
		attempt: state.nextAttempt + index,
		urls: routed.flatMap((item) => item.recipient?.windowID === recipient.windowID ? [item.link.url] : [])
	}));
	if (batches.length === 0) return {
		state,
		commands: []
	};
	const links = routed.map((item) => {
		const batch = batches.find((candidate) => candidate.windowID === item.recipient?.windowID);
		if (!batch) return item.link;
		return {
			status: "delivered",
			url: item.link.url,
			target: item.link.target,
			clientID: batch.clientID,
			attempt: batch.attempt
		};
	});
	return {
		state: {
			...state,
			links,
			nextAttempt: state.nextAttempt + batches.length
		},
		commands: batches.map((batch) => ({
			type: "links.deliver",
			...batch
		}))
	};
}
function requeue(links, clientID) {
	return links.map((link) => link.status === "delivered" && link.clientID === clientID ? {
		status: "queued",
		url: link.url,
		target: link.target
	} : link);
}
function unchanged$5(state) {
	return {
		state,
		commands: []
	};
}
//#endregion
//#region src/main/deep-links/index.ts
/** Routes deep links to app windows through the delivery machine for as long as the caller's scope lives. */
var make$3 = fn("DeepLinks.make")(function* (focus) {
	let state = createDeepLinkState();
	const dispatch = (event) => {
		const next = transitionDeepLinks(state, event);
		state = next.state;
		next.commands.forEach((command) => {
			if (command.type === "window.focus") return focus(getWindowByID(command.windowID));
			const win = getWindowByID(command.windowID);
			const opened = new DeepLinksOpened({
				attempt: command.attempt,
				urls: command.urls
			});
			if (!(!!win && emitIpcEvent(win.webContents, opened))) dispatch({
				type: "client.disconnected",
				clientID: command.clientID
			});
		});
	};
	const stop = onMainWindow((win, windowID) => {
		dispatch({
			type: "window.opened",
			windowID
		});
		if (win.isFocused()) dispatch({
			type: "window.focused",
			windowID
		});
		win.on("focus", () => dispatch({
			type: "window.focused",
			windowID
		}));
		win.once("closed", () => dispatch({
			type: "window.closed",
			windowID
		}));
	});
	yield* addFinalizer$1(() => sync(stop));
	return {
		receive: (urls) => dispatch({
			type: "links.received",
			urls
		}),
		ready: (windowID, clientID) => dispatch({
			type: "window.ready",
			windowID,
			clientID
		}),
		acknowledge: (clientID, attempt) => dispatch({
			type: "delivery.acknowledged",
			clientID,
			attempt
		}),
		disconnect: (clientID) => dispatch({
			type: "client.disconnected",
			clientID
		})
	};
});
//#endregion
//#region src/main/storage/install-state.ts
function hasExistingAppState(entries) {
	return entries.some((entry) => {
		if (entry.name === "opencode.settings") return true;
		if (entry.name.endsWith(".dat")) return true;
		if (entry.name === "drafts.sqlite") return true;
		if (/^window-state-.+\.json$/.test(entry.name)) return true;
		return entry.directory && entry.name === "opencode";
	});
}
//#endregion
//#region src/main/lifecycle/onboarding-machine.ts
var UNKNOWN = Object.freeze({ status: "unknown" });
var COMPLETED = Object.freeze({ status: "completed" });
function createMainOnboardingState() {
	return UNKNOWN;
}
function transitionMainOnboarding(state, event) {
	switch (event.type) {
		case "initialized":
			if (state.status !== "unknown") return unchanged$4(state);
			return {
				state: event.complete ? COMPLETED : {
					status: "pending",
					nextAttempt: 1
				},
				commands: []
			};
		case "finish.requested":
			if (state.status !== "pending") return unchanged$4(state);
			if (event.directory === null) return {
				state: COMPLETED,
				commands: [{ type: "persist-complete" }]
			};
			return {
				state: {
					status: "finishing",
					attempt: state.nextAttempt
				},
				commands: [{
					type: "make-directory",
					attempt: state.nextAttempt,
					directory: event.directory
				}]
			};
		case "finish.succeeded":
			if (state.status !== "finishing" || state.attempt !== event.attempt) return unchanged$4(state);
			return {
				state: COMPLETED,
				commands: [{ type: "persist-complete" }]
			};
		case "finish.failed":
			if (state.status !== "finishing" || state.attempt !== event.attempt) return unchanged$4(state);
			return {
				state: {
					status: "pending",
					nextAttempt: state.attempt + 1
				},
				commands: []
			};
	}
}
/** Whether a window should still run onboarding; false while another window's run is in flight. */
var selectOnboardingPending = (state) => state.status === "pending";
function unchanged$4(state) {
	return {
		state,
		commands: []
	};
}
//#endregion
//#region src/main/lifecycle/onboarding.ts
var onboarding = { state: createMainOnboardingState() };
var dispatch$1 = (event) => {
	const next = transitionMainOnboarding(onboarding.state, event);
	onboarding.state = next.state;
	if (next.commands.some((command) => command.type === "persist-complete")) getStore().set(FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY, true);
	return next.commands;
};
var initializeFirstLaunchOnboarding = fn("Onboarding.initialize")(function* (userDataPath) {
	const store = getStore();
	const current = store.get(FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY);
	if (isBoolean(current)) {
		dispatch$1({
			type: "initialized",
			complete: current
		});
		return current;
	}
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const names = (yield* fs.exists(userDataPath)) ? yield* fs.readDirectory(userDataPath) : [];
	const complete = hasExistingAppState(yield* forEach(names, fnUntraced(function* (name) {
		const info = yield* fs.stat(path.join(userDataPath, name)).pipe(option);
		return {
			name,
			directory: isSome(info) && info.value.type === "Directory"
		};
	}), { concurrency: "unbounded" }));
	store.set(FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY, complete);
	dispatch$1({
		type: "initialized",
		complete
	});
	return complete;
});
var isFirstLaunchOnboardingPending = fn("Onboarding.isPending")(function* () {
	const pending = selectOnboardingPending(onboarding.state);
	yield* scoped("onboarding", logInfo("first launch onboarding pending checked", { pending }));
	return pending;
});
var finishFirstLaunchOnboarding = fn("Onboarding.finish")(function* (createDefaultProject) {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const defaultProject = createDefaultProject ? path.join(app.getPath("documents"), nativeT("desktop.onboarding.defaultProject")) : null;
	const commands = dispatch$1({
		type: "finish.requested",
		directory: defaultProject
	});
	const make = commands.find((command) => command.type === "make-directory");
	if (commands.length === 0) {
		yield* scoped("onboarding", logInfo("first launch onboarding already completed"));
		return null;
	}
	if (make) {
		const attempt = make.attempt;
		yield* fs.makeDirectory(make.directory, { recursive: true }).pipe(onExit((exit) => sync(() => dispatch$1(isSuccess(exit) ? {
			type: "finish.succeeded",
			attempt
		} : {
			type: "finish.failed",
			attempt
		}))));
	}
	yield* scoped("onboarding", logInfo("first launch onboarding completed", {
		createDefaultProject,
		defaultProject
	}));
	return defaultProject;
});
//#endregion
//#region src/main/lifecycle/shutdown.ts
var Service$5 = class extends Service$9()("opencode/desktop/Shutdown") {};
var layer$6 = effect(Service$5, gen(function* () {
	const participants = /* @__PURE__ */ new Set();
	const each = (step) => suspend(() => forEach(participants, step, {
		concurrency: "unbounded",
		discard: true
	}));
	return Service$5.of({
		add: (participant) => sync(() => {
			participants.add(participant);
			return () => participants.delete(participant);
		}),
		stop: each((participant) => participant.stop),
		resume: each((participant) => participant.resume)
	});
}));
//#endregion
//#region src/main/lifecycle/index.ts
var Service$4 = class extends Service$9()("opencode/desktop/ApplicationLifecycle") {};
var runtime = effect(Service$4, gen(function* () {
	const shutdown = yield* Service$5;
	const context$3 = yield* context();
	const runFork = runForkWith(context$3);
	const runPromise = runPromiseWith(context$3);
	const exits = /* @__PURE__ */ new Set();
	const driver = createDriver$2({
		stop: () => runPromise(shutdown.stop.pipe(timeoutOrElse({
			duration: "10 seconds",
			orElse: () => logError("shutdown timed out, continuing anyway")
		}))),
		resume: () => runPromise(shutdown.resume.pipe(timeoutOrElse({
			duration: "10 seconds",
			orElse: () => logError("resume timed out, continuing anyway")
		}))),
		exit: (mode) => {
			const exit = setImmediate(() => {
				exits.delete(exit);
				if (mode === "relaunch") app.relaunch();
				app.quit();
			});
			exits.add(exit);
		}
	});
	const relaunch = () => driver.dispatch({
		type: "exit.requested",
		mode: "relaunch"
	});
	const windows = yield* mainWindows({
		appState: driver.state,
		relaunch,
		sessionEnding: () => driver.dispatch({ type: "session.ending" })
	});
	const createWindow = windows.create;
	const restoreWindows = windows.restore;
	const focusWindow = (win) => {
		if (!win) return;
		if (win.isMinimized()) win.restore();
		win.show();
		win.focus();
	};
	const deepLinks = yield* make$3(focusWindow);
	const secondInstance = (_event, argv) => {
		const urls = argv.filter((arg) => arg.startsWith("opencode://"));
		if (urls.length) {
			runFork(logInfo("deep link received via second-instance", { urls }));
			deepLinks.receive(urls);
		}
		if (!urls.length) focusWindow(getLastFocusedWindow());
	};
	const openUrl = (event, url) => {
		event.preventDefault();
		runFork(logInfo("deep link received via open-url", { url }));
		deepLinks.receive([url]);
	};
	const beforeQuit = (event) => {
		if (preventsQuit(driver.state())) event.preventDefault();
		driver.dispatch({ type: "before.quit" });
	};
	const willQuit = () => driver.dispatch({ type: "will.quit" });
	const childProcessGone = (_event, details) => {
		runFork(scoped("utility", logError("child process gone", { details })));
	};
	const renderProcessGone = (_event, webContents, details) => {
		runFork(scoped("window", logError("app render process gone", {
			url: safeWebContentsURL(webContents),
			details
		})));
	};
	const signal = () => driver.dispatch({
		type: "exit.requested",
		mode: "quit"
	});
	const windowAllClosed = () => {
		if (quitsWhenAllWindowsClosed(driver.state(), process.platform)) app.quit();
	};
	const activate = () => {
		if (!restoresWindows(driver.state())) return;
		if (BrowserWindow.getAllWindows().length === 0) restoreWindows();
	};
	let windowsWired = false;
	app.on("second-instance", secondInstance);
	app.on("open-url", openUrl);
	app.on("before-quit", beforeQuit);
	app.on("will-quit", willQuit);
	app.on("child-process-gone", childProcessGone);
	app.on("render-process-gone", renderProcessGone);
	process.on("SIGINT", signal);
	process.on("SIGTERM", signal);
	yield* addFinalizer$1(() => sync(() => {
		app.off("second-instance", secondInstance);
		app.off("open-url", openUrl);
		app.off("before-quit", beforeQuit);
		app.off("will-quit", willQuit);
		app.off("child-process-gone", childProcessGone);
		app.off("render-process-gone", renderProcessGone);
		app.off("window-all-closed", windowAllClosed);
		app.off("activate", activate);
		process.off("SIGINT", signal);
		process.off("SIGTERM", signal);
		exits.forEach(clearImmediate);
		exits.clear();
	}));
	return Service$4.of({
		relaunch,
		deepLinks,
		state: driver.state,
		restart: driver.restart,
		createWindow,
		restoreWindows: () => {
			if (!restoresWindows(driver.state())) return [];
			if (!windowsWired) {
				windowsWired = true;
				app.on("window-all-closed", windowAllClosed);
				app.on("activate", activate);
			}
			return restoreWindows();
		}
	});
}));
var platform = mergeAll(layer$9, layer$6, layer$7.pipe(provide$2(layer$9)));
var layer$5 = unwrap(gen(function* () {
	yield* initializeFirstLaunchOnboarding(app.getPath("userData"));
	marks.onboarding = Date.now();
	return runtime.pipe(provideMerge(platform));
}));
//#endregion
//#region ../../install?raw
var install_raw_default = "#!/usr/bin/env bash\r\nset -euo pipefail\r\nAPP=opencode\r\nSOURCE_APP=opencode\r\n\r\nMUTED='\\033[0;2m'\r\nRED='\\033[0;31m'\r\nORANGE='\\033[38;5;214m'\r\nNC='\\033[0m' # No Color\r\n\r\nusage() {\r\n    cat <<EOF\r\nOpenCode Installer\r\n\r\nUsage: install.sh [options]\r\n\r\nOptions:\r\n    -h, --help              Display this help message\r\n    -v, --version <version> Install a specific version (e.g., 0.0.0-beta-17236)\r\n    -b, --binary <path>     Install from a local binary instead of downloading\r\n        --no-modify-path    Don't modify shell config files (.zshrc, .bashrc, etc.)\r\n\r\nExamples:\r\n    curl -fsSL https://opencode.ai/v2/install | bash\r\n    curl -fsSL https://opencode.ai/v2/install | bash -s -- --version 0.0.0-beta-17236\r\n    ./install --binary /path/to/opencode\r\nEOF\r\n}\r\n\r\nrequested_version=${VERSION:-}\r\nno_modify_path=false\r\nbinary_path=\"\"\r\n\r\nwhile [[ $# -gt 0 ]]; do\r\n    case \"$1\" in\r\n        -h|--help)\r\n            usage\r\n            exit 0\r\n            ;;\r\n        -v|--version)\r\n            if [[ -n \"${2:-}\" ]]; then\r\n                requested_version=\"$2\"\r\n                shift 2\r\n            else\r\n                echo -e \"${RED}Error: --version requires a version argument${NC}\"\r\n                exit 1\r\n            fi\r\n            ;;\r\n        -b|--binary)\r\n            if [[ -n \"${2:-}\" ]]; then\r\n                binary_path=\"$2\"\r\n                shift 2\r\n            else\r\n                echo -e \"${RED}Error: --binary requires a path argument${NC}\"\r\n                exit 1\r\n            fi\r\n            ;;\r\n        --no-modify-path)\r\n            no_modify_path=true\r\n            shift\r\n            ;;\r\n        *)\r\n            echo -e \"${ORANGE}Warning: Unknown option '$1'${NC}\" >&2\r\n            shift\r\n            ;;\r\n    esac\r\ndone\r\n\r\nINSTALL_DIR=$HOME/.opencode/bin\r\nmkdir -p \"$INSTALL_DIR\"\r\n\r\n# If --binary is provided, skip all download/detection logic\r\nif [ -n \"$binary_path\" ]; then\r\n    if [ ! -f \"$binary_path\" ]; then\r\n        echo -e \"${RED}Error: Binary not found at ${binary_path}${NC}\"\r\n        exit 1\r\n    fi\r\n    specific_version=\"local\"\r\nelse\r\n    raw_os=$(uname -s)\r\n    os=$(echo \"$raw_os\" | tr '[:upper:]' '[:lower:]')\r\n    case \"$raw_os\" in\r\n      Darwin*) os=\"darwin\" ;;\r\n      Linux*) os=\"linux\" ;;\r\n      MINGW*|MSYS*|CYGWIN*) os=\"windows\" ;;\r\n    esac\r\n\r\n    arch=$(uname -m)\r\n    if [[ \"$arch\" == \"aarch64\" ]]; then\r\n      arch=\"arm64\"\r\n    fi\r\n    if [[ \"$arch\" == \"x86_64\" ]]; then\r\n      arch=\"x64\"\r\n    fi\r\n\r\n    if [ \"$os\" = \"darwin\" ] && [ \"$arch\" = \"x64\" ]; then\r\n      rosetta_flag=$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)\r\n      if [ \"$rosetta_flag\" = \"1\" ]; then\r\n        arch=\"arm64\"\r\n      fi\r\n    fi\r\n\r\n    # Git Bash and MSYS2 run as emulated x64 on Windows ARM64, so `uname -m` reports x86_64.\r\n    # The host CPU still shows in the `uname -s` suffix and in PROCESSOR_IDENTIFIER.\r\n    if [ \"$os\" = \"windows\" ] && [ \"$arch\" = \"x64\" ]; then\r\n      if [[ \"$raw_os\" == *-ARM64 || \"${PROCESSOR_IDENTIFIER:-}\" == ARM* ]]; then\r\n        arch=\"arm64\"\r\n      fi\r\n    fi\r\n\r\n    combo=\"$os-$arch\"\r\n    case \"$combo\" in\r\n      linux-x64|linux-arm64|darwin-x64|darwin-arm64|windows-x64|windows-arm64)\r\n        ;;\r\n      *)\r\n        echo -e \"${RED}Unsupported OS/Arch: $os/$arch${NC}\"\r\n        exit 1\r\n        ;;\r\n    esac\r\n\r\n    is_musl=false\r\n    if [ \"$os\" = \"linux\" ]; then\r\n      if [ -f /etc/alpine-release ]; then\r\n        is_musl=true\r\n      fi\r\n\r\n      if command -v ldd >/dev/null 2>&1; then\r\n        if ldd --version 2>&1 | grep -qi musl; then\r\n          is_musl=true\r\n        fi\r\n      fi\r\n    fi\r\n\r\n    needs_baseline=false\r\n    if [ \"$arch\" = \"x64\" ]; then\r\n      if [ \"$os\" = \"linux\" ]; then\r\n        if ! grep -qwi avx2 /proc/cpuinfo 2>/dev/null; then\r\n          needs_baseline=true\r\n        fi\r\n      fi\r\n\r\n      if [ \"$os\" = \"darwin\" ]; then\r\n        avx2=$(sysctl -n hw.optional.avx2_0 2>/dev/null || echo 0)\r\n        if [ \"$avx2\" != \"1\" ]; then\r\n          needs_baseline=true\r\n        fi\r\n      fi\r\n\r\n      if [ \"$os\" = \"windows\" ]; then\r\n        ps=\"(Add-Type -MemberDefinition \\\"[DllImport(\\\"\\\"kernel32.dll\\\"\\\")] public static extern bool IsProcessorFeaturePresent(int ProcessorFeature);\\\" -Name Kernel32 -Namespace Win32 -PassThru)::IsProcessorFeaturePresent(40)\"\r\n        out=\"\"\r\n        if command -v powershell.exe >/dev/null 2>&1; then\r\n          out=$(powershell.exe -NoProfile -NonInteractive -Command \"$ps\" 2>/dev/null || true)\r\n        elif command -v pwsh >/dev/null 2>&1; then\r\n          out=$(pwsh -NoProfile -NonInteractive -Command \"$ps\" 2>/dev/null || true)\r\n        fi\r\n        out=$(echo \"$out\" | tr -d '\\r' | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')\r\n        if [ \"$out\" != \"true\" ] && [ \"$out\" != \"1\" ]; then\r\n          needs_baseline=true\r\n        fi\r\n      fi\r\n    fi\r\n\r\n    target=\"$os-$arch\"\r\n    if [ \"$needs_baseline\" = \"true\" ]; then\r\n      target=\"$target-baseline\"\r\n    fi\r\n    if [ \"$is_musl\" = \"true\" ]; then\r\n      target=\"$target-musl\"\r\n    fi\r\n\r\n    if ! command -v tar >/dev/null 2>&1; then\r\n        echo -e \"${RED}Error: 'tar' is required but not installed.${NC}\"\r\n        exit 1\r\n    fi\r\n\r\n    package_scope=\"@opencode\"\r\n    if [ -z \"$requested_version\" ]; then\r\n        metadata=$(curl -fsSL https://opencode.ai/update/api/latest/cli/npm || true)\r\n        specific_version=$(echo \"$metadata\" | sed -n 's/.*\"version\":\"\\([^\"]*\\)\".*/\\1/p')\r\n        package=$(echo \"$metadata\" | sed -n 's/.*\"package\":\"\\([^\"]*\\)\".*/\\1/p')\r\n\r\n        if [ -z \"$specific_version\" ] || [ -z \"$package\" ]; then\r\n            echo -e \"${RED}Failed to fetch version information${NC}\"\r\n            exit 1\r\n        fi\r\n        package_scope=\"${package%/cli}\"\r\n    else\r\n        # Strip leading 'v' if present\r\n        requested_version=\"${requested_version#v}\"\r\n        specific_version=$requested_version\r\n    fi\r\n\r\n    package_name=\"$package_scope/cli-$target\"\r\n    http_status=$(curl -s -o /dev/null -w \"%{http_code}\" \"https://registry.npmjs.org/$package_scope%2fcli-$target/$specific_version\" || true)\r\n    # Older clients install the minimum release before they can migrate package names.\r\n    if [ \"$http_status\" = \"404\" ] && [ -n \"$requested_version\" ]; then\r\n        package_name=\"@opencode-ai/cli-$target\"\r\n        http_status=$(curl -s -o /dev/null -w \"%{http_code}\" \"https://registry.npmjs.org/@opencode-ai%2fcli-$target/$specific_version\" || true)\r\n    fi\r\n    if [ \"$http_status\" = \"404\" ]; then\r\n        echo -e \"${RED}Error: Version ${specific_version} is not available for $target${NC}\"\r\n        echo -e \"${MUTED}Available versions: https://www.npmjs.com/package/$package_name?activeTab=versions${NC}\"\r\n        exit 1\r\n    fi\r\n    if [ \"$http_status\" != \"200\" ]; then\r\n        echo -e \"${RED}Failed to fetch package information${NC}\"\r\n        exit 1\r\n    fi\r\n\r\n    filename=\"cli-$target-$specific_version.tgz\"\r\n    url=\"https://registry.npmjs.org/$package_name/-/$filename\"\r\n    binary_name=\"$SOURCE_APP\"\r\n    if [ \"$os\" = \"windows\" ]; then\r\n        binary_name=\"$SOURCE_APP.exe\"\r\n    fi\r\nfi\r\n\r\nprint_message() {\r\n    local level=$1\r\n    local message=$2\r\n    local color=\"\"\r\n\r\n    case $level in\r\n        info) color=\"${NC}\" ;;\r\n        warning) color=\"${NC}\" ;;\r\n        error) color=\"${RED}\" ;;\r\n    esac\r\n\r\n    echo -e \"${color}${message}${NC}\"\r\n}\r\n\r\ncheck_version() {\r\n    if command -v \"$APP\" >/dev/null 2>&1; then\r\n        opencode_path=$(which \"$APP\")\r\n\r\n        ## Check the installed version\r\n        installed_version=$(\"$APP\" --version 2>/dev/null || echo \"\")\r\n        installed_version=\"${installed_version##* }\"\r\n        installed_version=\"${installed_version#v}\"\r\n\r\n        print_message info \"${MUTED}Installed version: ${NC}$installed_version.\"\r\n    fi\r\n}\r\n\r\nprint_progress() {\r\n    local bytes=\"$1\"\r\n    local length=\"$2\"\r\n    [ \"$length\" -gt 0 ] || return 0\r\n\r\n    local width=50\r\n    local percent=$(( bytes * 100 / length ))\r\n    [ \"$percent\" -gt 100 ] && percent=100\r\n    local on=$(( percent * width / 100 ))\r\n    local off=$(( width - on ))\r\n\r\n    local filled=$(printf \"%*s\" \"$on\" \"\")\r\n    filled=${filled// /■}\r\n    local empty=$(printf \"%*s\" \"$off\" \"\")\r\n    empty=${empty// /･}\r\n\r\n    printf \"\\r${ORANGE}%s%s %3d%%${NC}\" \"$filled\" \"$empty\" \"$percent\" >&4\r\n}\r\n\r\ndownload_with_progress() {\r\n    local url=\"$1\"\r\n    local output=\"$2\"\r\n\r\n    if [ -t 2 ]; then\r\n        exec 4>&2\r\n    else\r\n        exec 4>/dev/null\r\n    fi\r\n\r\n    local headers=\"${output}.headers\"\r\n\r\n    # Hide cursor\r\n    printf \"\\033[?25l\" >&4\r\n\r\n    trap \"trap - RETURN; rm -f \\\"$headers\\\"; printf '\\033[?25h' >&4; exec 4>&-\" RETURN\r\n\r\n    # Poll the file size on a timer so rendering cost stays fixed no matter how many bytes arrive.\r\n    # Read the size with ls because busybox wc -c reads the whole file.\r\n    curl -fsL -D \"$headers\" -o \"$output\" \"$url\" &\r\n    local curl_pid=$!\r\n\r\n    local length bytes\r\n    while kill -0 \"$curl_pid\" 2>/dev/null; do\r\n        if [ -f \"$output\" ]; then\r\n            length=$(grep -i '^content-length:' \"$headers\" 2>/dev/null | tail -n 1 | tr -dc '0-9' || true)\r\n            bytes=$(ls -ln \"$output\" | awk '{print $5}')\r\n            print_progress \"$bytes\" \"${length:-0}\"\r\n        fi\r\n        sleep 0.1 2>/dev/null || sleep 1\r\n    done\r\n\r\n    local ret=0\r\n    wait \"$curl_pid\" || ret=$?\r\n    if [ \"$ret\" -eq 0 ]; then\r\n        bytes=$(ls -ln \"$output\" | awk '{print $5}')\r\n        print_progress \"$bytes\" \"$bytes\"\r\n    fi\r\n    echo \"\" >&4\r\n    return $ret\r\n}\r\n\r\ndownload_and_install() {\r\n    print_message info \"\\n${MUTED}Installing ${NC}$APP ${MUTED}version: ${NC}$specific_version\"\r\n    local tmp_dir=\"${TMPDIR:-/tmp}/opencode_install_$$\"\r\n    mkdir -p \"$tmp_dir\"\r\n\r\n    if [[ \"$os\" == \"windows\" ]] || ! [ -t 2 ] || ! download_with_progress \"$url\" \"$tmp_dir/$filename\"; then\r\n        # Fallback to standard curl on Windows, non-TTY environments, or if custom progress fails\r\n        local ret=0\r\n        curl -f -# -L -o \"$tmp_dir/$filename\" \"$url\" || ret=$?\r\n        # curl exits 23 when it cannot write the file, usually because the temporary directory is full.\r\n        if [ \"$ret\" -eq 23 ]; then\r\n            print_message error \"Could not write the download to $tmp_dir. Make sure it has enough free space, or set TMPDIR to another directory, then try again.\" >&2\r\n        fi\r\n        if [ \"$ret\" -ne 0 ]; then\r\n            exit \"$ret\"\r\n        fi\r\n    fi\r\n\r\n    tar -xzf \"$tmp_dir/$filename\" -C \"$tmp_dir\"\r\n    local installed_binary=\"$APP\"\r\n    if [ \"$os\" = \"windows\" ]; then\r\n        installed_binary=\"$APP.exe\"\r\n    fi\r\n    mv \"$tmp_dir/package/bin/$binary_name\" \"$INSTALL_DIR/$installed_binary\"\r\n    chmod 755 \"$INSTALL_DIR/$installed_binary\"\r\n    rm -rf \"$tmp_dir\"\r\n}\r\n\r\ninstall_from_binary() {\r\n    print_message info \"\\n${MUTED}Installing ${NC}$APP ${MUTED}from: ${NC}$binary_path\"\r\n    local installed_binary=\"$APP\"\r\n    case \"$(uname -s)\" in\r\n        MINGW*|MSYS*|CYGWIN*) installed_binary=\"$APP.exe\" ;;\r\n    esac\r\n    cp \"$binary_path\" \"$INSTALL_DIR/$installed_binary\"\r\n    chmod 755 \"$INSTALL_DIR/$installed_binary\"\r\n}\r\n\r\ninstall_legacy_shim() {\r\n    local shim_os=\"${os:-}\"\r\n    if [[ -z \"$shim_os\" ]]; then\r\n        case \"$(uname -s)\" in\r\n            MINGW*|MSYS*|CYGWIN*) shim_os=\"windows\" ;;\r\n        esac\r\n    fi\r\n    rm -f \"$INSTALL_DIR/opencode2\" \"$INSTALL_DIR/opencode2.exe\" \"$INSTALL_DIR/opencode2.cmd\"\r\n    if [[ \"$shim_os\" == \"windows\" ]]; then\r\n        cat > \"$INSTALL_DIR/opencode2.cmd\" <<'EOF'\r\n@echo off\r\n\"%~dp0opencode.exe\" %*\r\nexit /b %errorlevel%\r\nEOF\r\n        return\r\n    fi\r\n    cat > \"$INSTALL_DIR/opencode2\" <<'EOF'\r\n#!/bin/sh\r\nexec \"$(dirname \"$0\")/opencode\" \"$@\"\r\nEOF\r\n    chmod 755 \"$INSTALL_DIR/opencode2\"\r\n}\r\n\r\nif [ -n \"$binary_path\" ]; then\r\n    install_from_binary\r\nelse\r\n    check_version\r\n    download_and_install\r\nfi\r\ninstall_legacy_shim\r\n\r\n\r\npath_added=false\r\nadd_to_path() {\r\n    local config_file=$1\r\n    local command=$2\r\n\r\n    if grep -Fxq \"$command\" \"$config_file\"; then\r\n        print_message info \"Command already exists in $config_file, skipping write.\"\r\n    elif [[ -w $config_file ]]; then\r\n        echo -e \"\\n# opencode\" >> \"$config_file\"\r\n        echo \"$command\" >> \"$config_file\"\r\n        path_added=true\r\n        print_message info \"${MUTED}Successfully added ${NC}opencode ${MUTED}to \\$PATH in ${NC}$config_file\"\r\n    else\r\n        print_message warning \"Manually add the directory to $config_file (or similar):\"\r\n        print_message info \"  $command\"\r\n    fi\r\n}\r\n\r\nXDG_CONFIG_HOME=${XDG_CONFIG_HOME:-$HOME/.config}\r\n\r\ncurrent_shell=$(basename \"$SHELL\")\r\ncase $current_shell in\r\n    fish)\r\n        config_files=\"$HOME/.config/fish/config.fish\"\r\n    ;;\r\n    zsh)\r\n        config_files=\"${ZDOTDIR:-$HOME}/.zshrc ${ZDOTDIR:-$HOME}/.zshenv $XDG_CONFIG_HOME/zsh/.zshrc $XDG_CONFIG_HOME/zsh/.zshenv\"\r\n    ;;\r\n    bash)\r\n        config_files=\"$HOME/.bashrc $HOME/.bash_profile $HOME/.profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile\"\r\n    ;;\r\n    ash)\r\n        config_files=\"$HOME/.ashrc $HOME/.profile /etc/profile\"\r\n    ;;\r\n    sh)\r\n        config_files=\"$HOME/.ashrc $HOME/.profile /etc/profile\"\r\n    ;;\r\n    *)\r\n        # Default case if none of the above matches\r\n        config_files=\"$HOME/.bashrc $HOME/.bash_profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile\"\r\n    ;;\r\nesac\r\n\r\nif [[ \"$no_modify_path\" != \"true\" ]]; then\r\n    config_file=\"\"\r\n    for file in $config_files; do\r\n        if [[ -f $file ]]; then\r\n            config_file=$file\r\n            break\r\n        fi\r\n    done\r\n\r\n    # A new Mac has no ~/.zshrc, so create the shell's main config file rather than leaving opencode off PATH.\r\n    if [[ -z $config_file ]]; then\r\n        case $current_shell in\r\n            zsh) new_config_file=\"${ZDOTDIR:-$HOME}/.zshrc\" ;;\r\n            fish) new_config_file=\"$HOME/.config/fish/config.fish\" ;;\r\n            *) new_config_file=\"\" ;;\r\n        esac\r\n        if [[ -n $new_config_file ]] && mkdir -p \"$(dirname \"$new_config_file\")\" 2>/dev/null && touch \"$new_config_file\" 2>/dev/null; then\r\n            config_file=$new_config_file\r\n        fi\r\n    fi\r\n\r\n    if [[ -z $config_file ]]; then\r\n        print_message warning \"No config file found for $current_shell. You may need to manually add to PATH:\"\r\n        print_message info \"  export PATH=$INSTALL_DIR:\\$PATH\"\r\n    elif [[ \":$PATH:\" != *\":$INSTALL_DIR:\"* ]]; then\r\n        case $current_shell in\r\n            fish)\r\n                add_to_path \"$config_file\" \"fish_add_path $INSTALL_DIR\"\r\n            ;;\r\n            zsh)\r\n                add_to_path \"$config_file\" \"export PATH=$INSTALL_DIR:\\$PATH\"\r\n            ;;\r\n            bash)\r\n                add_to_path \"$config_file\" \"export PATH=$INSTALL_DIR:\\$PATH\"\r\n            ;;\r\n            ash)\r\n                add_to_path \"$config_file\" \"export PATH=$INSTALL_DIR:\\$PATH\"\r\n            ;;\r\n            sh)\r\n                add_to_path \"$config_file\" \"export PATH=$INSTALL_DIR:\\$PATH\"\r\n            ;;\r\n            *)\r\n                export PATH=$INSTALL_DIR:$PATH\r\n                print_message warning \"Manually add the directory to $config_file (or similar):\"\r\n                print_message info \"  export PATH=$INSTALL_DIR:\\$PATH\"\r\n            ;;\r\n        esac\r\n    fi\r\nfi\r\n\r\nif [ -n \"${GITHUB_ACTIONS-}\" ] && [ \"${GITHUB_ACTIONS}\" == \"true\" ]; then\r\n    echo \"$INSTALL_DIR\" >> $GITHUB_PATH\r\n    print_message info \"Added $INSTALL_DIR to \\$GITHUB_PATH\"\r\nfi\r\n\r\necho -e \"\"\r\necho -e \"${MUTED}\xA0                   ${NC}             ▄     \"\r\necho -e \"${MUTED}█▀▀█ █▀▀█ █▀▀█ █▀▀▄ ${NC}█▀▀▀ █▀▀█ █▀▀█ █▀▀█\"\r\necho -e \"${MUTED}█░░█ █░░█ █▀▀▀ █░░█ ${NC}█░░░ █░░█ █░░█ █▀▀▀\"\r\necho -e \"${MUTED}▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀  ▀ ${NC}▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀\"\r\necho -e \"\"\r\necho -e \"\"\r\necho -e \"${MUTED}OpenCode includes free models, to start:${NC}\"\r\necho -e \"\"\r\nif [[ $path_added == \"true\" ]]; then\r\n    echo -e \"exec \\$SHELL   ${MUTED}# Reload PATH (or open a new terminal)${NC}\"\r\nfi\r\necho -e \"cd <project>  ${MUTED}# Open directory${NC}\"\r\necho -e \"opencode      ${MUTED}# Run command${NC}\"\r\necho -e \"\"\r\necho -e \"${MUTED}For more information visit ${NC}https://opencode.ai/docs\"\r\necho -e \"\"\r\necho -e \"\"\r\n";
//#endregion
//#region src/main/service/cli-version.ts
function parseCliVersion(output) {
	const marker = output.lastIndexOf(" v");
	const version = marker === -1 ? output : output.slice(marker + 2);
	if (!version) throw new Error("V2 CLI did not provide a version");
	return version;
}
function serviceVersion(input) {
	if (input.mode === "reconnect") return void 0;
	if (input.channel === "beta" && !input.isolated) return void 0;
	return input.version;
}
function shouldRetryEnsure(version, message) {
	if (version !== void 0) return false;
	return message === "Background service failed to start" || message === "Timed out waiting for the background service to start";
}
function stageName(version, arch = process.arch) {
	return `${version}-${arch}`.replace(/[^a-zA-Z0-9._-]/g, "-");
}
function keptStages(bundledVersion, runningVersion, arch = process.arch) {
	const stages = [stageName(bundledVersion, arch)];
	if (runningVersion && runningVersion !== bundledVersion) stages.push(stageName(runningVersion, arch));
	return stages;
}
//#endregion
//#region src/main/service/desktop-cli-state.ts
function idle() {
	return { status: "idle" };
}
/**
* Runs `load` once for every caller that arrives while it runs, and keeps only a success. It runs in the layer's
* scope, so a caller that gives up does not interrupt it for the others, and closing the scope interrupts it.
*/
var make$2 = fnUntraced(function* (load) {
	const scope$1 = yield* scope;
	const current = { state: idle() };
	return uninterruptibleMask((restore) => suspend(() => {
		const state = current.state;
		if (state.status === "resolved") return succeed(state.value);
		if (state.status === "resolving") return restore(_await(state.deferred));
		const deferred = makeUnsafe$3();
		current.state = {
			status: "resolving",
			deferred
		};
		return forkIn(load, scope$1).pipe(map((fiber) => fiber.addObserver((exit) => {
			current.state = isSuccess(exit) ? {
				status: "resolved",
				value: exit.value
			} : idle();
			doneUnsafe(deferred, exit);
		})), andThen(restore(_await(deferred))));
	}));
});
//#endregion
//#region src/main/service/desktop-cli.ts
var execFileAsync = promisify(execFile);
var RUN_TIMEOUT_MS = 3e4;
var Service$3 = class extends Service$9()("opencode/desktop/DesktopCli") {};
var layer$4 = effect(Service$3, gen(function* () {
	const path = yield* Path$1;
	const resolve = yield* make$2(make$1().pipe(provide$1(yield* context()), orDie));
	const install = gen(function* () {
		if (process.platform !== "darwin") return yield* fail(/* @__PURE__ */ new Error("CLI installation requires macOS"));
		const cli = yield* resolve;
		if (!cli.binary) return yield* fail(/* @__PURE__ */ new Error("Bundled CLI executable is unavailable"));
		const home = app.getPath("home");
		yield* runInstaller(cli.binary, home);
		return path.join(home, ".opencode", "bin", "opencode");
	});
	return Service$3.of({
		resolve,
		install
	});
}));
var make$1 = fn("DesktopCli.resolve")(function* () {
	const development = !app.isPackaged && process.env.OPENCODE_DESKTOP_CLI_DEV;
	const version = process.env.OPENCODE_VERSION ?? "local";
	return development ? {
		version,
		command: [
			"bun",
			"run",
			"--cwd",
			development,
			"--define=OPENCODE_VERSION=process.env.OPENCODE_VERSION",
			"src/index.ts"
		],
		binary: void 0
	} : yield* resolveBundledCli(!app.isPackaged && process.env.OPENCODE_DESKTOP_ISOLATED_SERVER === "1");
});
var resolveBundledCli = fn("DesktopCli.resolveBundled")(function* (isolated) {
	const path = yield* Path$1;
	const paths = yield* resolve$1;
	const bundled = app.isPackaged ? path.join(process.resourcesPath, executableName()) : path.join(paths.developmentResourcesRoot, isolated ? developmentExecutableName() : executableName());
	yield* logInfo("v2 CLI executable resolved", {
		bundled,
		packaged: app.isPackaged
	});
	const version = yield* bundledVersion(bundled);
	const binary = app.isPackaged || isolated ? yield* installCli(bundled, version) : bundled;
	return {
		version,
		binary,
		command: [binary]
	};
});
var bundledVersion = fn("DesktopCli.bundledVersion")(function* (bundled) {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const shipped = yield* sync(() => {
		try {
			return readFileSync(path.join(path.dirname(bundled), "opencode-cli.version"), "utf8").trim();
		} catch {
			return "";
		}
	});
	if (shipped) {
		yield* logInfo("v2 CLI version bundled", { version: shipped });
		return shipped;
	}
	const stat = yield* fs.stat(bundled).pipe(orElseSucceed(() => void 0));
	const identity = stat ? `${stat.size}:${getOrUndefined$1(stat.mtime)?.getTime() ?? ""}` : void 0;
	const store = getStore();
	const cached = getOrUndefined$1(decodeUnknownOption(VersionCache)(store.get(BUNDLED_CLI_VERSION_KEY)));
	if (identity && cached?.path === bundled && cached.identity === identity) {
		yield* logInfo("v2 CLI version reused", { version: cached.version });
		return cached.version;
	}
	const version = parseCliVersion(yield* run$1(bundled, ["--version"]));
	if (identity) store.set(BUNDLED_CLI_VERSION_KEY, {
		path: bundled,
		identity,
		version
	});
	return version;
});
var VersionCache = Struct({
	path: String$1,
	identity: String$1,
	version: String$1
});
var ExecFailure = Struct({
	stdout: optional(String$1),
	stderr: optional(String$1)
});
var installCli = fn("DesktopCli.install")(function* (source, version) {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const stage = stageName(version);
	const directory = path.join(app.getPath("userData"), "cli", stage);
	const destination = path.join(directory, executableName());
	if (existsSync(destination)) {
		yield* logInfo("v2 CLI staged executable reused", {
			path: destination,
			version
		});
		return destination;
	}
	const temp = destination + `.${process.pid}.tmp`;
	yield* fs.makeDirectory(directory, { recursive: true });
	yield* fs.copyFile(source, temp);
	if (process.platform !== "win32") yield* fs.chmod(temp, 493);
	yield* fs.rename(temp, destination).pipe(catch_((error) => fs.remove(temp, { force: true }).pipe(andThen(fail(error)))));
	yield* logInfo("v2 CLI executable staged", {
		source,
		path: destination,
		version
	});
	return destination;
});
var run$1 = fn("DesktopCli.run")(function* (binary, args) {
	yield* logInfo("v2 CLI command started", {
		binary,
		args
	});
	const result = yield* tryPromise(() => execFileAsync(binary, args, {
		windowsHide: true,
		timeout: RUN_TIMEOUT_MS
	})).pipe(tapError((error) => {
		const output = getOrUndefined$1(decodeUnknownOption(ExecFailure)(error.cause));
		return logError("v2 CLI command failed", {
			args,
			error: error.cause instanceof Error ? error.cause.message : String(error.cause),
			stdout: output?.stdout?.trim() ?? "",
			stderr: output?.stderr?.trim() ?? ""
		});
	}));
	const stdout = result.stdout.trim();
	const stderr = result.stderr.trim();
	yield* logInfo("v2 CLI command completed", {
		args,
		stdout,
		stderr
	});
	return stdout;
});
var INSTALL_TIMEOUT_MS = 6e4;
var runInstaller = fn("DesktopCli.installForUser")(function* (binary, home) {
	yield* callback((resume) => {
		const child = spawn("/bin/bash", [
			"-s",
			"--",
			"--binary",
			binary
		], {
			env: {
				...process.env,
				HOME: home
			},
			stdio: [
				"pipe",
				"ignore",
				"pipe"
			]
		});
		let stderr = "";
		child.stderr.on("data", (chunk) => stderr += chunk);
		child.on("error", (error) => resume(fail(error)));
		child.on("close", (code) => {
			if (code === 0) return resume(void_);
			resume(fail(new Error(stderr.trim() || `CLI installer exited with code ${code}`)));
		});
		child.stdin.on("error", () => {});
		child.stdin.end(install_raw_default);
		return sync(() => {
			if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
		});
	}).pipe(timeoutOrElse({
		duration: INSTALL_TIMEOUT_MS,
		orElse: () => fail(/* @__PURE__ */ new Error("CLI installation timed out"))
	}));
});
function executableName() {
	return process.platform === "win32" ? "opencode-cli.exe" : "opencode-cli";
}
function developmentExecutableName() {
	return process.platform === "win32" ? "opencode-cli-dev.exe" : "opencode-cli-dev";
}
//#endregion
//#region src/main/plugin/error.ts
/** A failure the renderer maps to its own copy by `code`. */
var PluginError = class extends Error {
	code;
	constructor(code, options) {
		super(options?.message ?? code, options);
		this.code = code;
	}
};
function pluginFailure(error) {
	if (error instanceof PluginError) return {
		code: error.code,
		message: error.message
	};
	return {
		code: "failed",
		message: error instanceof Error ? error.message : String(error)
	};
}
//#endregion
//#region src/main/plugin/machine.ts
/** Bounds one load of the host module and the CLI, so no caller waits on a hung load forever. */
var LOAD_TIMEOUT_MS = 3e4;
function initialState() {
	return {
		status: "idle",
		attempt: 0,
		started: false
	};
}
function transition$1(state, event) {
	if (state.status === "disposed") return disposed(state, event);
	if (event.type === "disposed") return dispose(state);
	if (event.type === "stop.requested") return stop(state, event.reply);
	if (event.type === "resume.requested") return resume(state, event.reply);
	if (state.status === "ready") return ready$1(state, event);
	if (state.status === "loading") return loading(state, event);
	if (event.type === "load.succeeded" && state.status === "idle" && event.attempt === state.attempt) return loaded(event.host, state.started, [], []);
	if (event.type === "host.requested") {
		if (state.status === "stopped") return unchanged$3(state, [reject$1([event.reply], { kind: "unavailable" })]);
		return load(state, { hosts: [event.reply] });
	}
	if (event.type === "start.requested") {
		if (state.status === "stopped") return {
			state: {
				...state,
				started: true
			},
			commands: [{
				type: "resolve",
				replies: [event.reply]
			}]
		};
		return load(state, {
			started: true,
			starts: [event.reply]
		});
	}
	if (event.type === "demand.requested" && state.status === "idle") return load(state, {});
	return unchanged$3(state);
}
/** The host once it loaded, until the app disposed it. */
var loadedHost = (state) => state.status === "ready" ? state.host : void 0;
/** Whether the machine still takes the load `attempt`: the one in flight, or one that timed out and nothing replaced. */
var isCurrentLoad = (state, attempt) => (state.status === "loading" || state.status === "idle") && state.attempt === attempt;
/** Claims the next load in the same event that asked for it. */
function load(state, input) {
	const attempt = state.attempt + 1;
	return {
		state: {
			status: "loading",
			attempt,
			started: state.started || !!input.started,
			hosts: input.hosts ?? [],
			starts: input.starts ?? []
		},
		commands: [{
			type: "load",
			attempt
		}]
	};
}
function loading(state, event) {
	if (event.type === "host.requested") return {
		state: {
			...state,
			hosts: [...state.hosts, event.reply]
		},
		commands: []
	};
	if (event.type === "start.requested") return {
		state: {
			...state,
			started: true,
			starts: [...state.starts, event.reply]
		},
		commands: []
	};
	if (event.type !== "load.succeeded" && event.type !== "load.failed" && event.type !== "load.timed-out") return unchanged$3(state);
	if (event.attempt !== state.attempt) return unchanged$3(state);
	if (event.type === "load.succeeded") return loaded(event.host, state.started, state.hosts, state.starts);
	return {
		state: {
			status: "idle",
			attempt: state.attempt,
			started: state.started
		},
		commands: waiters(state, event.type === "load.failed" ? {
			kind: "failed",
			error: event.error
		} : { kind: "timed-out" })
	};
}
function loaded(host, started, hosts, starts) {
	return {
		state: {
			status: "ready",
			host,
			started
		},
		commands: [...hosts.length ? [{
			type: "resolve-host",
			host,
			replies: hosts
		}] : [], started ? {
			type: "start",
			host,
			replies: starts
		} : {
			type: "demand-subscribed",
			host
		}]
	};
}
function ready$1(state, event) {
	if (event.type === "host.requested") return unchanged$3(state, [{
		type: "resolve-host",
		host: state.host,
		replies: [event.reply]
	}]);
	if (event.type === "demand.requested") return unchanged$3(state, [{
		type: "demand",
		host: state.host,
		ipc: event.ipc
	}]);
	if (event.type === "start.requested") {
		if (state.started) return unchanged$3(state, [{
			type: "resolve",
			replies: [event.reply]
		}]);
		return {
			state: {
				...state,
				started: true
			},
			commands: [{
				type: "start",
				host: state.host,
				replies: [event.reply]
			}]
		};
	}
	return unchanged$3(state);
}
function stop(state, reply) {
	if (state.status === "ready") return unchanged$3(state, [{
		type: "stop",
		host: state.host,
		reply
	}]);
	if (state.status === "stopped") return unchanged$3(state, [{
		type: "resolve",
		replies: [reply]
	}]);
	if (state.status === "loading") return {
		state: {
			status: "stopped",
			attempt: state.attempt,
			started: state.started
		},
		commands: [...state.hosts.length ? [reject$1(state.hosts, { kind: "unavailable" })] : [], {
			type: "resolve",
			replies: [...state.starts, reply]
		}]
	};
	return {
		state: {
			status: "stopped",
			attempt: state.attempt,
			started: state.started
		},
		commands: [{
			type: "resolve",
			replies: [reply]
		}]
	};
}
function resume(state, reply) {
	if (state.status === "ready") return unchanged$3(state, [{
		type: "resume",
		host: state.host,
		reply
	}]);
	if (state.status !== "stopped") return unchanged$3(state, [{
		type: "resolve",
		replies: [reply]
	}]);
	if (state.started) return load(state, { starts: [reply] });
	return {
		state: {
			status: "idle",
			attempt: state.attempt,
			started: false
		},
		commands: [{
			type: "resolve",
			replies: [reply]
		}]
	};
}
function dispose(state) {
	if (state.status !== "loading") return {
		state: { status: "disposed" },
		commands: []
	};
	return {
		state: { status: "disposed" },
		commands: [...state.hosts.length ? [reject$1(state.hosts, { kind: "unavailable" })] : [], ...state.starts.length ? [{
			type: "resolve",
			replies: state.starts
		}] : []]
	};
}
function disposed(state, event) {
	if (event.type === "host.requested") return unchanged$3(state, [reject$1([event.reply], { kind: "unavailable" })]);
	if (event.type === "start.requested" || event.type === "stop.requested" || event.type === "resume.requested") return unchanged$3(state, [{
		type: "resolve",
		replies: [event.reply]
	}]);
	return unchanged$3(state);
}
function waiters(state, reason) {
	const replies = [...state.hosts, ...state.starts];
	return replies.length ? [reject$1(replies, reason)] : [];
}
function reject$1(replies, reason) {
	return {
		type: "reject",
		replies,
		reason
	};
}
function unchanged$3(state, commands = []) {
	return {
		state,
		commands
	};
}
/**
* Runs the machine: it applies each event, then performs the commands, each of which reports back through a later
* event. Besides the load timers it holds no other state.
*/
function createDriver$1(input) {
	const current = { state: initialState() };
	const timers = /* @__PURE__ */ new Map();
	const dispatch = (event) => {
		const previous = current.state;
		const next = transition$1(previous, event);
		current.state = next.state;
		if (previous.status === "loading" && next.state.status !== "loading") {
			clearTimeout(timers.get(previous.attempt));
			timers.delete(previous.attempt);
		}
		next.commands.forEach(perform);
	};
	const perform = (command) => {
		if (command.type === "load") {
			timers.set(command.attempt, setTimeout(() => dispatch({
				type: "load.timed-out",
				attempt: command.attempt
			}), LOAD_TIMEOUT_MS));
			Promise.resolve().then(input.load).then((build) => isCurrentLoad(current.state, command.attempt) ? build() : void 0).then((host) => {
				if (host) dispatch({
					type: "load.succeeded",
					attempt: command.attempt,
					host
				});
			}, (cause) => dispatch({
				type: "load.failed",
				attempt: command.attempt,
				error: cause
			}));
			return;
		}
		if (command.type === "start") return void Promise.resolve().then(() => command.host.start()).then(() => command.replies.forEach((reply) => reply.resolve()), (cause) => {
			if (!command.replies.length) return input.log("plugins failed to start", { error: cause });
			command.replies.forEach((reply) => reply.reject(cause));
		});
		if (command.type === "demand") return command.host.demand(command.ipc);
		if (command.type === "demand-subscribed") return input.subscribed().forEach((ipc) => command.host.demand(ipc));
		if (command.type === "stop") return void Promise.resolve().then(() => command.host.stop()).catch((cause) => input.log("plugins failed to stop", { error: cause })).then(() => command.reply.resolve());
		if (command.type === "resume") return void Promise.resolve().then(() => command.host.resume()).then(command.reply.resolve, command.reply.reject);
		if (command.type === "resolve-host") return command.replies.forEach((reply) => reply.resolve(command.host));
		if (command.type === "resolve") return command.replies.forEach((reply) => reply.resolve());
		const cause = rejection(command.reason);
		command.replies.forEach((reply) => reply.reject(cause));
	};
	const ask = (event) => new Promise((resolve, reject) => dispatch(event({
		resolve,
		reject
	})));
	return {
		state: () => current.state,
		/** Loads the host on first use, and again after a load failed. */
		host: () => ask((reply) => ({
			type: "host.requested",
			reply
		})),
		/** Loads the host and activates main plugins; a later load activates them when this one fails. */
		start: () => ask((reply) => ({
			type: "start.requested",
			reply
		})),
		demand: (ipc) => dispatch({
			type: "demand.requested",
			ipc
		}),
		stop: () => ask((reply) => ({
			type: "stop.requested",
			reply
		})),
		resume: () => ask((reply) => ({
			type: "resume.requested",
			reply
		})),
		dispose: () => dispatch({ type: "disposed" })
	};
}
function rejection(reason) {
	if (reason.kind === "failed") return reason.error;
	if (reason.kind === "timed-out") return new PluginError("failed", { message: "plugin host load timed out" });
	return new PluginError("unavailable");
}
//#endregion
//#region src/main/plugin/index.ts
var LEVELS = {
	debug: "Debug",
	info: "Info",
	warn: "Warn",
	error: "Error"
};
var Service$2 = class extends Service$9()("opencode/desktop/Plugins") {};
var layer$3 = effect(Service$2, gen(function* () {
	const storage = yield* Service$6;
	const shutdown = yield* Service$5;
	const lifecycle = yield* Service$4;
	const desktopCli = yield* Service$3;
	const context$2 = yield* context();
	const runFork = runForkWith(context$2);
	const runPromise = runPromiseWith(context$2);
	const subscriptions = /* @__PURE__ */ new Map();
	const servers = /* @__PURE__ */ new Map();
	const driver = createDriver$1({
		load: async () => {
			const [module, cli] = await Promise.all([import("./host-DQiQeSJn.js").then((n) => n.t), runPromise(desktopCli.resolve)]);
			return () => module.createHost({
				db: storage.db,
				state: storage.state,
				cli: {
					version: cli.version,
					command: cli.command,
					binary: cli.binary,
					development: !app.isPackaged && !cli.binary
				},
				subscriptions,
				servers,
				appState: lifecycle.state,
				restart: lifecycle.restart,
				log: (message, data) => runFork(logError(message, data)),
				write: (level, message, data) => runFork(logWithLevel(LEVELS[level])(message, data))
			});
		},
		subscribed: () => [...subscriptions].flatMap((entry) => entry[1].size ? [entry[0]] : []),
		log: (message, data) => runFork(logError(message, data))
	});
	const remove = yield* shutdown.add({
		stop: promise$1(driver.stop),
		resume: tryPromise(driver.resume).pipe(catch_((error) => logError("plugins failed to resume", { error })))
	});
	yield* addFinalizer$1(() => sync(() => {
		remove();
		driver.dispose();
	}));
	return Service$2.of({
		host: driver.host,
		loaded: () => loadedHost(driver.state()),
		start: tryPromise(driver.start).pipe(catch_((error) => logError("plugins failed to start", { error }))),
		subscribe(ipc, window) {
			const ids = subscriptions.get(ipc) ?? /* @__PURE__ */ new Set();
			ids.add(window);
			subscriptions.set(ipc, ids);
			driver.demand(ipc);
			return loadedHost(driver.state())?.snapshot(ipc, window) ?? { available: false };
		},
		configure(window, list) {
			servers.delete(window);
			servers.set(window, list);
		}
	});
}));
//#endregion
//#region src/shared/ipc-rpc/app.ts
var ServerReadyData = Struct({ url: String$1 });
var AppAwaitInitialization = make$8("AppAwaitInitialization", { success: ServerReadyData });
var AppReconnectService = make$8("AppReconnectService", { success: ServerReadyData });
var AppReadyDeepLinks = make$8("AppReadyDeepLinks");
var AppAcknowledgeDeepLinks = make$8("AppAcknowledgeDeepLinks", { payload: { attempt: Number$1 } });
var AppIsFirstLaunchOnboardingPending = make$8("AppIsFirstLaunchOnboardingPending", { success: Boolean });
var AppFinishFirstLaunchOnboarding = make$8("AppFinishFirstLaunchOnboarding", {
	payload: { createDefaultProject: Boolean },
	success: NullOr(String$1)
});
var AppCheckAppExists = make$8("AppCheckAppExists", {
	payload: { appName: String$1 },
	success: Boolean
});
var AppResolveAppPath = make$8("AppResolveAppPath", {
	payload: { appName: String$1 },
	success: NullOr(String$1)
});
var AppSetBackgroundColor = make$8("AppSetBackgroundColor", { payload: { color: String$1 } });
var AppExportDebugLogs = make$8("AppExportDebugLogs", { success: String$1 });
var AppSetForceFocus = make$8("AppSetForceFocus", { payload: { enabled: Boolean } });
var AppRecordFatalRendererError = make$8("AppRecordFatalRendererError", { payload: { error: Struct({
	error: String$1,
	url: String$1,
	version: optionalKey(String$1),
	platform: String$1,
	os: optionalKey(String$1)
}) } });
var AppRpcs = make$6(AppAwaitInitialization, AppReconnectService, AppReadyDeepLinks, AppAcknowledgeDeepLinks, AppIsFirstLaunchOnboardingPending, AppFinishFirstLaunchOnboarding, AppCheckAppExists, AppResolveAppPath, AppSetBackgroundColor, AppExportDebugLogs, AppSetForceFocus, make$8("AppGetSpellcheckEnabled", { success: Boolean }), make$8("AppSetSpellcheckEnabled", { payload: { enabled: Boolean } }), AppRecordFatalRendererError, make$8("AppSetNativeTranslations", { payload: { value: Unknown } }), make$8("AppRelaunch"));
//#endregion
//#region src/shared/ipc-rpc/files.ts
var OptionalString = optional(String$1);
var PickerOptions = Struct({
	multiple: optional(Boolean),
	title: OptionalString,
	defaultPath: OptionalString
});
var FilePickerOptions = Struct({
	multiple: optional(Boolean),
	title: OptionalString,
	defaultPath: OptionalString,
	extensions: optional(ArraySchema(String$1))
});
var SavePickerOptions = Struct({
	title: OptionalString,
	defaultPath: OptionalString
});
var PickedFiles = Struct({
	token: String$1,
	files: ArraySchema(Struct({
		path: String$1,
		name: String$1,
		size: Number$1
	}))
});
var ClipboardImage = Struct({
	buffer: Uint8Array$1,
	width: Number$1,
	height: Number$1
});
var FileRpcs = make$6(make$8("FilesOpenDirectoryPicker", {
	payload: { options: optional(PickerOptions) },
	success: NullOr(Union([String$1, ArraySchema(String$1)]))
}), make$8("FilesOpenFilePicker", {
	payload: { options: optional(FilePickerOptions) },
	success: NullOr(PickedFiles)
}), make$8("FilesReadPickedFile", {
	payload: {
		token: String$1,
		path: String$1
	},
	success: Uint8Array$1
}), make$8("FilesReleasePickedFiles", { payload: { token: String$1 } }), make$8("FilesSaveFile", {
	payload: {
		options: SavePickerOptions,
		content: String$1
	},
	success: Boolean
}), make$8("FilesOpenExternal", { payload: { url: String$1 } }), make$8("FilesOpenBrowser", {
	payload: { url: String$1 },
	success: Boolean
}), make$8("FilesOpenLocalFile", { payload: { url: String$1 } }), make$8("FilesOpenPath", {
	payload: {
		path: String$1,
		application: optional(String$1)
	},
	success: NullOr(String$1)
}), make$8("FilesRevealPath", {
	payload: { path: String$1 },
	success: Boolean
}), make$8("FilesReadClipboardImage", { success: NullOr(ClipboardImage) }), make$8("FilesWriteClipboardText", { payload: { text: String$1 } }));
var MenuRpcs = make$6(make$8("MenuRunAction", { payload: { action: Literals([
	"app.installCli",
	"app.relaunch",
	"edit.undo",
	"edit.redo",
	"edit.cut",
	"edit.copy",
	"edit.paste",
	"edit.delete",
	"edit.selectAll",
	"view.reload",
	"view.toggleDevTools",
	"view.resetZoom",
	"view.zoomIn",
	"view.zoomOut",
	"view.toggleFullscreen",
	"window.new",
	"window.close",
	"window.minimize",
	"window.toggleMaximize"
]) } }));
var StorageRpcs = make$6(make$8("StorageItems", {
	payload: { name: String$1 },
	success: Struct({
		items: Record(String$1, String$1),
		revision: Number$1
	})
}), make$8("StorageUpdate", {
	payload: {
		name: String$1,
		insert: Record(String$1, String$1),
		remove: ArraySchema(String$1)
	},
	success: Number$1
}), make$8("StorageClear", { payload: { name: String$1 } }), make$8("DraftsGet", {
	payload: { key: String$1 },
	success: NullOr(String$1)
}), make$8("DraftsSet", {
	payload: {
		key: String$1,
		value: String$1,
		strict: Boolean
	},
	success: ArraySchema(String$1)
}), make$8("DraftsDelete", { payload: { key: String$1 } }), make$8("DraftsPutBlob", {
	payload: { data: Uint8Array$1 },
	success: String$1
}), make$8("DraftsGetBlob", {
	payload: { id: String$1 },
	success: NullOr(Uint8Array$1)
}));
//#endregion
//#region src/shared/ipc-rpc/window.ts
var WindowThemeReady = make$8("WindowThemeReady");
var WindowRpcs = make$6(make$8("WindowRequestMicrophone", { success: Boolean }), make$8("WindowSetVoiceCallActive", { payload: { active: Boolean } }), WindowThemeReady, make$8("WindowGetFocused", { success: Boolean }), make$8("WindowGetFullscreen", { success: Boolean }), make$8("WindowSetFocus"), make$8("WindowShow"), make$8("WindowGetZoomFactor", { success: Number$1 }), make$8("WindowSetZoomFactor", { payload: { factor: Number$1 } }), make$8("WindowGetZoomLevel", { success: Literals(desktopZoomLevels) }), make$8("WindowSetZoomLevel", { payload: { level: Literals(desktopZoomLevels) } }), make$8("WindowGetPinchZoomEnabled", { success: Boolean }), make$8("WindowSetPinchZoomEnabled", { payload: { enabled: Boolean } }), make$8("WindowSetTitlebar", { payload: { theme: Struct({
	mode: Literals(["light", "dark"]),
	scheme: optionalKey(Literals([
		"system",
		"light",
		"dark"
	]))
}) } }), make$8("WindowSetTrafficLightsPosition", { payload: {
	x: Number$1,
	y: Number$1
} }));
//#endregion
//#region src/shared/ipc-rpc.ts
var DesktopRpcs = AppRpcs.merge(StorageRpcs, FileRpcs, WindowRpcs, MenuRpcs, EventRpcs, PluginRpcs);
//#endregion
//#region src/main/files/hex.ts
var uninstallKey = String.raw`HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\{6ED48C92-5177-41F4-B8D6-37B7B02CFDF4}_is1`;
function hexPaths(platform, home, env) {
	if (platform === "win32") {
		const roaming = env.APPDATA || path.win32.join(home, "AppData/Roaming");
		return {
			support: path.win32.join(roaming, "hex"),
			registry: path.win32.join(env.SystemRoot || "C:\\Windows", "System32/reg.exe")
		};
	}
	if (platform === "darwin") return {
		support: path.posix.join(home, "Library/Application Support/hex"),
		bundles: ["/Applications/Hex.app", path.posix.join(home, "Applications/Hex.app")]
	};
	const data = env.XDG_DATA_HOME && path.posix.isAbsolute(env.XDG_DATA_HOME) ? env.XDG_DATA_HOME : path.posix.join(home, ".local/share");
	const support = path.posix.join(data, "hex");
	if (platform !== "linux") return { support };
	const absoluteDirs = (list) => list.split(":").filter((dir) => path.posix.isAbsolute(dir));
	const dirs = /* @__PURE__ */ new Set([data, ...absoluteDirs(env.XDG_DATA_DIRS || "/usr/local/share:/usr/share")]);
	const bins = /* @__PURE__ */ new Set([path.posix.join(home, ".local/bin"), ...absoluteDirs(env.PATH ?? "")]);
	return {
		support,
		entries: [...dirs].flatMap((dir) => ["anomaly.hex.desktop", "hex.desktop"].map((name) => path.posix.join(dir, "applications", name))),
		binaries: [...bins].map((dir) => path.posix.join(dir, "hex"))
	};
}
var metadata = (file) => stat(file).catch(() => void 0);
async function detectHex(paths) {
	if (await metadata(path.join(paths.support, "local-api.json"))) return true;
	if (paths.registry) {
		const version = await readFile(path.join(paths.support, "current-version"), "utf8").then((text) => text.trim(), () => void 0);
		if (version && (await metadata(path.join(paths.support, "versions", version, "hex.exe")))?.isFile()) return true;
		return promisify(execFile)(paths.registry, ["query", uninstallKey], {
			windowsHide: true,
			timeout: 1e3
		}).then(() => true, () => false);
	}
	for (const bundle of paths.bundles ?? []) if ((await metadata(bundle))?.isDirectory()) return true;
	for (const entry of paths.entries ?? []) if ((await metadata(entry))?.isFile()) return true;
	for (const binary of paths.binaries ?? []) {
		const info = await metadata(binary);
		if (info?.isFile() && (info.mode & 73) !== 0) return true;
	}
	return false;
}
//#endregion
//#region src/main/files/apps.ts
var execFilePromise = util.promisify(execFile);
var hex;
var checkAppExists = fn("DesktopFiles.checkAppExists")(function* (appName) {
	if (appName === "hex") return yield* promise$1(() => hex ??= detectHex(hexPaths(process.platform, homedir(), process.env)));
	if (process.platform === "win32") return true;
	if (process.platform === "linux") return true;
	return yield* checkMacosApp(appName);
});
var resolveAppPath = fn("DesktopFiles.resolveAppPath")(function* (appName) {
	if (process.platform !== "win32") return appName;
	return yield* resolveWindowsAppPath(appName);
});
var checkMacosApp = fn("DesktopFiles.checkMacosApp")(function* (appName) {
	const fs = yield* FileSystem;
	const locations = [`/Applications/${appName}.app`, `/System/Applications/${appName}.app`];
	const home = process.env.HOME;
	if (home) locations.push(`${home}/Applications/${appName}.app`);
	for (const location of locations) if (yield* exists(fs, location)) return true;
	return yield* tryPromise(() => execFilePromise("which", [appName])).pipe(as(true), orElseSucceed(() => false));
});
var resolveWindowsAppPath = fn("DesktopFiles.resolveWindowsAppPath")(function* (appName) {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const result = yield* tryPromise(() => execFilePromise("where", [appName], { windowsHide: true })).pipe(orElseSucceed(() => void 0));
	if (!result) return null;
	const paths = result.stdout.toString().split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
	const hasExt = (value, ext) => path.extname(value).toLowerCase() === `.${ext}`;
	const exe = paths.find((path) => hasExt(path, "exe"));
	if (exe) return exe;
	const resolveCmd = fnUntraced(function* (file) {
		const content = yield* fs.readFileString(file);
		for (const token of content.split("\"").map((value) => value.trim())) {
			const lower = token.toLowerCase();
			if (!lower.includes(".exe")) continue;
			const index = lower.indexOf("%~dp0");
			if (index >= 0) {
				const base = path.dirname(file);
				const resolved = token.slice(index + 5).replace(/\//g, "\\").split("\\").filter((part) => part && part !== ".").reduce((current, part) => {
					if (part === "..") return path.dirname(current);
					return path.join(current, part);
				}, base);
				if (yield* exists(fs, resolved)) return resolved;
			}
			if (yield* exists(fs, token)) return token;
		}
		return null;
	});
	for (const file of paths) {
		if (hasExt(file, "cmd") || hasExt(file, "bat")) {
			const resolved = yield* resolveCmd(file);
			if (resolved) return resolved;
		}
		if (!path.extname(file)) {
			const cmd = `${file}.cmd`;
			if (yield* exists(fs, cmd)) {
				const resolved = yield* resolveCmd(cmd);
				if (resolved) return resolved;
			}
			const bat = `${file}.bat`;
			if (yield* exists(fs, bat)) {
				const resolved = yield* resolveCmd(bat);
				if (resolved) return resolved;
			}
		}
	}
	const key = appName.split("").filter((value) => /[a-z0-9]/i.test(value)).map((value) => value.toLowerCase()).join("");
	if (key) for (const file of paths) {
		const dirs = [
			path.dirname(file),
			path.dirname(path.dirname(file)),
			path.dirname(path.dirname(path.dirname(file)))
		];
		for (const dir of dirs) {
			const entries = yield* fs.readDirectory(dir).pipe(orElseSucceed(() => []));
			for (const entry of entries) {
				const candidate = path.join(dir, entry);
				if (!hasExt(candidate, "exe")) continue;
				const name = entry.replace(/\.exe$/i, "").split("").filter((value) => /[a-z0-9]/i.test(value)).map((value) => value.toLowerCase()).join("");
				if (name.includes(key) || key.includes(name)) return candidate;
			}
		}
	}
	return paths[0] ?? null;
});
function exists(fs, path) {
	return fs.exists(path).pipe(orElseSucceed(() => false));
}
//#endregion
//#region src/main/native/force-focus-machine.ts
var initialForceFocusState = Object.freeze({
	status: "off",
	attempt: 0
});
function transitionForceFocus(state, event) {
	if (state.status === "disposed") {
		if (event.type !== "request") return unchanged$2(state);
		return {
			state,
			commands: settleSplit([event.request], /* @__PURE__ */ new Error("Window closed"))
		};
	}
	switch (event.type) {
		case "request": {
			const request = event.request;
			const attempt = state.attempt + 1;
			if (state.status === "enabling" || state.status === "disabling") return {
				state: {
					...state,
					desired: request.enabled,
					requests: [...state.requests, request]
				},
				commands: []
			};
			if (state.status === "off" && !request.enabled) return {
				state,
				commands: settle([request])
			};
			const owned = state.status === "on" && state.owned;
			const nodeIds = state.status === "on" ? state.nodeIds : [];
			if (request.enabled) return {
				state: {
					status: "enabling",
					attempt,
					owned,
					nodeIds,
					desired: true,
					requests: [request]
				},
				commands: [{
					type: "enable",
					attempt
				}]
			};
			return {
				state: {
					status: "disabling",
					attempt,
					owned,
					nodeIds,
					desired: false,
					requests: [request]
				},
				commands: [{
					type: "disable",
					attempt,
					owned,
					nodeIds
				}]
			};
		}
		case "debugger.attached":
			if (state.status !== "enabling" || state.attempt !== event.attempt || state.owned) return unchanged$2(state);
			return {
				state: {
					...state,
					owned: true
				},
				commands: []
			};
		case "enable.succeeded": {
			if (state.status !== "enabling" || state.attempt !== event.attempt) return unchanged$2(state);
			const nodeIds = [.../* @__PURE__ */ new Set([...state.nodeIds, ...event.nodeIds])];
			if (state.desired) return {
				state: {
					status: "on",
					attempt: state.attempt,
					owned: state.owned,
					nodeIds
				},
				commands: [{ type: "cancel-timer" }, ...settle(state.requests)]
			};
			const attempt = state.attempt + 1;
			return {
				state: {
					...state,
					status: "disabling",
					attempt,
					nodeIds,
					requests: wanting(state.requests, false)
				},
				commands: [...settle(wanting(state.requests, true)), {
					type: "disable",
					attempt,
					owned: state.owned,
					nodeIds
				}]
			};
		}
		case "enable.failed":
			if (state.status !== "enabling" || state.attempt !== event.attempt) return unchanged$2(state);
			return failEnable(state, event.error);
		case "disable.settled":
			if (state.status !== "disabling" || state.attempt !== event.attempt) return unchanged$2(state);
			return finishDisable(state, []);
		case "timed-out":
			if (state.status === "enabling" && state.attempt === event.attempt) return failEnable(state, /* @__PURE__ */ new Error("Timed out forcing focus styles"));
			if (state.status !== "disabling" || state.attempt !== event.attempt) return unchanged$2(state);
			return finishDisable(state, state.owned ? [{ type: "detach" }] : []);
		case "debugger.detached":
			if (state.status === "off") return unchanged$2(state);
			if (state.status === "on") return {
				state: {
					status: "off",
					attempt: state.attempt
				},
				commands: []
			};
			if (state.status === "disabling") return finishDisable(state, []);
			return {
				state: {
					status: "off",
					attempt: state.attempt
				},
				commands: [{ type: "cancel-timer" }, ...settleSplit(state.requests, /* @__PURE__ */ new Error("Debugger detached"))]
			};
		case "destroyed":
			if (state.status === "off" || state.status === "on") return {
				state: { status: "disposed" },
				commands: []
			};
			return {
				state: { status: "disposed" },
				commands: [{ type: "cancel-timer" }, ...settleSplit(state.requests, /* @__PURE__ */ new Error("Window closed"))]
			};
	}
}
/** Whether a CDP command for `attempt` still belongs to the live state. */
function isCurrentForceFocusAttempt(state, attempt) {
	return (state.status === "enabling" || state.status === "disabling") && state.attempt === attempt;
}
function failEnable(state, error) {
	const settled = settleSplit(state.requests, error);
	if (state.owned) return {
		state: {
			status: "off",
			attempt: state.attempt
		},
		commands: [
			{ type: "cancel-timer" },
			{ type: "detach" },
			...settled
		]
	};
	if (state.nodeIds.length === 0) return {
		state: {
			status: "off",
			attempt: state.attempt
		},
		commands: [{ type: "cancel-timer" }, ...settled]
	};
	const attempt = state.attempt + 1;
	return {
		state: {
			status: "disabling",
			attempt,
			owned: false,
			nodeIds: state.nodeIds,
			desired: false,
			requests: []
		},
		commands: [...settled, {
			type: "disable",
			attempt,
			owned: false,
			nodeIds: state.nodeIds
		}]
	};
}
function finishDisable(state, commands) {
	if (!state.desired) return {
		state: {
			status: "off",
			attempt: state.attempt
		},
		commands: [
			{ type: "cancel-timer" },
			...commands,
			...settle(state.requests)
		]
	};
	const attempt = state.attempt + 1;
	return {
		state: {
			status: "enabling",
			attempt,
			owned: false,
			nodeIds: [],
			desired: true,
			requests: wanting(state.requests, true)
		},
		commands: [
			...commands,
			...settle(wanting(state.requests, false)),
			{
				type: "enable",
				attempt
			}
		]
	};
}
function wanting(requests, enabled) {
	return requests.filter((request) => request.enabled === enabled);
}
function settleSplit(requests, error) {
	return [...settle(wanting(requests, false)), ...settle(wanting(requests, true), error)];
}
function settle(requests, error) {
	const replies = requests.map((request) => request.reply);
	if (replies.length === 0) return [];
	if (!error) return [{
		type: "settle",
		replies
	}];
	return [{
		type: "settle",
		replies,
		error
	}];
}
function unchanged$2(state) {
	return {
		state,
		commands: []
	};
}
//#endregion
//#region src/main/native/debug.ts
var focusableSelector = `
  a[href],
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  summary,
  [contenteditable="true"],
  [tabindex]:not([tabindex="-1"])
`;
var COMMAND_TIMEOUT_MS = 1e4;
var DocumentResult = Struct({ root: Struct({ nodeId: Number$1 }) });
var QuerySelectorAllResult = Struct({ nodeIds: ArraySchema(Number$1) });
var drivers = /* @__PURE__ */ new WeakMap();
function setForceFocus(contents, enabled) {
	if (contents.isDestroyed()) return enabled ? Promise.reject(/* @__PURE__ */ new Error("Window closed")) : Promise.resolve();
	const dispatch = drivers.get(contents) ?? createDriver(contents);
	return new Promise((resolve, reject) => dispatch({
		type: "request",
		request: {
			enabled,
			reply: {
				resolve,
				reject
			}
		}
	}));
}
function createDriver(contents) {
	const debuggerApi = contents.debugger;
	const queue = [];
	let state = initialForceFocusState;
	let timer;
	let draining = false;
	const dispatch = (event) => {
		queue.push(event);
		if (draining) return;
		draining = true;
		for (let next = queue.shift(); next; next = queue.shift()) {
			const result = transitionForceFocus(state, next);
			state = result.state;
			result.commands.forEach(run);
		}
		draining = false;
	};
	const onDetach = () => dispatch({ type: "debugger.detached" });
	const detach = () => {
		if (!debuggerApi.isAttached()) return;
		debuggerApi.off("detach", onDetach);
		debuggerApi.detach();
		debuggerApi.on("detach", onDetach);
	};
	const arm = (attempt) => {
		clearTimeout(timer);
		timer = setTimeout(() => dispatch({
			type: "timed-out",
			attempt
		}), COMMAND_TIMEOUT_MS);
	};
	const enable = async (attempt) => {
		if (!debuggerApi.isAttached()) {
			debuggerApi.attach("1.3");
			dispatch({
				type: "debugger.attached",
				attempt
			});
		}
		await debuggerApi.sendCommand("DOM.enable");
		await debuggerApi.sendCommand("CSS.enable");
		const document = decodeUnknownSync(DocumentResult)(await debuggerApi.sendCommand("DOM.getDocument", {
			depth: -1,
			pierce: true
		}));
		const nodes = decodeUnknownSync(QuerySelectorAllResult)(await debuggerApi.sendCommand("DOM.querySelectorAll", {
			nodeId: document.root.nodeId,
			selector: focusableSelector
		}));
		if (!isCurrentForceFocusAttempt(state, attempt)) return nodes.nodeIds;
		await Promise.allSettled(nodes.nodeIds.map((nodeId) => debuggerApi.sendCommand("CSS.forcePseudoState", {
			nodeId,
			forcedPseudoClasses: ["focus", "focus-visible"]
		})));
		return nodes.nodeIds;
	};
	const disable = async (command) => {
		await Promise.allSettled(command.nodeIds.map((nodeId) => debuggerApi.sendCommand("CSS.forcePseudoState", {
			nodeId,
			forcedPseudoClasses: []
		})));
		if (command.owned && isCurrentForceFocusAttempt(state, command.attempt)) detach();
	};
	const run = (command) => {
		switch (command.type) {
			case "enable":
				arm(command.attempt);
				enable(command.attempt).then((nodeIds) => dispatch({
					type: "enable.succeeded",
					attempt: command.attempt,
					nodeIds
				}), (cause) => dispatch({
					type: "enable.failed",
					attempt: command.attempt,
					error: cause instanceof Error ? cause : new Error(String(cause))
				}));
				return;
			case "disable":
				arm(command.attempt);
				disable(command).then(() => dispatch({
					type: "disable.settled",
					attempt: command.attempt
				}));
				return;
			case "detach": return detach();
			case "cancel-timer":
				clearTimeout(timer);
				timer = void 0;
				return;
			case "settle": return command.replies.forEach((reply) => command.error ? reply.reject(command.error) : reply.resolve());
		}
	};
	debuggerApi.on("detach", onDetach);
	contents.once("destroyed", () => {
		debuggerApi.off("detach", onDetach);
		dispatch({ type: "destroyed" });
	});
	drivers.set(contents, dispatch);
	return dispatch;
}
//#endregion
//#region src/main/native/spellcheck-languages.ts
var base = (tag) => tag.split("-")[0].toLowerCase();
function defaultSpellcheckLanguages(available, preferred) {
	const find = (tag) => available.find((language) => language.toLowerCase() === tag.toLowerCase());
	const languages = preferred.flatMap((tag) => find(tag) ?? find(base(tag)) ?? []).filter((language, index, all) => all.findIndex((other) => base(other) === base(language)) === index);
	if (languages.some((language) => base(language) === "en") || !available.includes("en-US")) return languages;
	return [...languages, "en-US"];
}
//#endregion
//#region src/main/native/spellcheck.ts
var choosesLanguages = process.platform !== "darwin";
function applySpellcheck() {
	if (choosesLanguages) session.defaultSession.setSpellCheckerLanguages(spellcheckLanguages());
	session.defaultSession.setSpellCheckerEnabled(getSpellcheckEnabled());
}
function getSpellcheckEnabled() {
	return getStore().get(SPELLCHECK_ENABLED_KEY) !== false;
}
function setSpellcheckEnabled(enabled) {
	getStore().set(SPELLCHECK_ENABLED_KEY, enabled);
	session.defaultSession.setSpellCheckerEnabled(enabled);
}
function spellcheckMenuItems() {
	const enabled = getSpellcheckEnabled();
	const current = session.defaultSession.getSpellCheckerLanguages();
	const toggle = {
		label: nativeT("desktop.contextMenu.spellcheck"),
		type: "checkbox",
		checked: enabled,
		click: () => setSpellcheckEnabled(!enabled)
	};
	if (!choosesLanguages) return [{ type: "separator" }, toggle];
	return [
		{ type: "separator" },
		toggle,
		{
			label: nativeT("desktop.contextMenu.spellcheckLanguages"),
			enabled,
			submenu: nativeLanguageOptions(session.defaultSession.availableSpellCheckerLanguages).map((option) => ({
				label: option.label,
				type: "checkbox",
				checked: current.includes(option.tag),
				enabled: !(current.length === 1 && current[0] === option.tag),
				click: () => {
					const next = current.includes(option.tag) ? current.filter((language) => language !== option.tag) : [...current, option.tag];
					getStore().set(SPELLCHECK_LANGUAGES_KEY, next);
					session.defaultSession.setSpellCheckerLanguages(next);
				}
			}))
		}
	];
}
function spellcheckLanguages() {
	const available = session.defaultSession.availableSpellCheckerLanguages;
	const stored = getStore().get(SPELLCHECK_LANGUAGES_KEY);
	const chosen = Array.isArray(stored) ? available.filter((language) => stored.includes(language)) : [];
	return chosen.length ? chosen : defaultSpellcheckLanguages(available, app.getPreferredSystemLanguages());
}
function createIpcTransportState() {
	return {
		status: "open",
		nextClientId: 0,
		senders: /* @__PURE__ */ new Map(),
		clients: /* @__PURE__ */ new Map()
	};
}
function transitionIpcTransport(state, event) {
	if (state.status === "disposed") {
		if (event.type === "port.bound") return {
			state,
			commands: [{
				type: "close-port",
				port: event.port
			}, {
				type: "shutdown-events",
				events: event.events
			}]
		};
		return {
			state,
			commands: []
		};
	}
	switch (event.type) {
		case "sender.prepared": {
			const current = state.senders.get(event.senderId);
			if (current?.status === "awaiting-port") return {
				state,
				commands: []
			};
			if (!current) return {
				state: withSender(state, event.senderId, awaiting(event.sender, void 0)),
				commands: [{
					type: "watch-sender",
					senderId: event.senderId,
					sender: event.sender
				}]
			};
			return {
				state: withSender(state, event.senderId, awaiting(current.sender, {
					clientId: current.clientId,
					port: current.port
				})),
				commands: [{
					type: "shutdown-events",
					events: current.events
				}, {
					type: "notify-disconnect",
					clientId: current.clientId
				}]
			};
		}
		case "event.emitted": {
			const current = state.senders.get(event.senderId);
			if (current?.status !== "awaiting-port" || current.buffered.length >= 1024) return {
				state,
				commands: []
			};
			return {
				state: withSender(state, event.senderId, {
					...current,
					buffered: [...current.buffered, event.event]
				}),
				commands: []
			};
		}
		case "port.bound": {
			const current = state.senders.get(event.senderId);
			const clientId = state.nextClientId;
			const clients = new Map(state.clients);
			const released = current?.status === "bound" ? current.clientId : current?.draining?.clientId;
			if (released !== void 0) clients.delete(released);
			clients.set(clientId, event.senderId);
			const senders = new Map(state.senders);
			senders.set(event.senderId, {
				status: "bound",
				sender: current?.sender ?? event.sender,
				clientId,
				port: event.port,
				events: event.events
			});
			return {
				state: {
					status: "open",
					nextClientId: clientId + 1,
					senders,
					clients
				},
				commands: [
					...current ? release(current) : [{
						type: "watch-sender",
						senderId: event.senderId,
						sender: event.sender
					}],
					{
						type: "attach-port",
						clientId,
						port: event.port
					},
					...current?.status === "awaiting-port" && current.buffered.length > 0 ? [{
						type: "offer-events",
						events: event.events,
						items: current.buffered
					}] : []
				]
			};
		}
		case "client.closed": {
			const senderId = state.clients.get(event.clientId);
			const current = senderId === void 0 ? void 0 : state.senders.get(senderId);
			if (senderId === void 0 || !current) return {
				state,
				commands: []
			};
			const clients = new Map(state.clients);
			clients.delete(event.clientId);
			if (current.status === "awaiting-port") return {
				state: {
					...state,
					senders: new Map(state.senders).set(senderId, {
						...current,
						draining: void 0
					}),
					clients
				},
				commands: release(current)
			};
			const senders = new Map(state.senders);
			senders.delete(senderId);
			return {
				state: {
					...state,
					senders,
					clients
				},
				commands: [...release(current), {
					type: "unwatch-sender",
					senderId,
					sender: current.sender
				}]
			};
		}
		case "sender.destroyed": {
			const current = state.senders.get(event.senderId);
			if (!current) return {
				state,
				commands: []
			};
			const senders = new Map(state.senders);
			senders.delete(event.senderId);
			const clients = new Map(state.clients);
			const clientId = current.status === "bound" ? current.clientId : current.draining?.clientId;
			if (clientId !== void 0) clients.delete(clientId);
			return {
				state: {
					...state,
					senders,
					clients
				},
				commands: [...release(current), {
					type: "unwatch-sender",
					senderId: event.senderId,
					sender: current.sender
				}]
			};
		}
		case "disposed": return {
			state: { status: "disposed" },
			commands: [...state.senders].flatMap(([senderId, current]) => [...release(current), {
				type: "unwatch-sender",
				senderId,
				sender: current.sender
			}])
		};
	}
}
/** The event queue of a sender's bound renderer; read on every `emitIpcEvent`, so it allocates nothing. */
function selectBoundEventQueue(state, senderId) {
	if (state.status !== "open") return;
	const current = state.senders.get(senderId);
	return current?.status === "bound" ? current.events : void 0;
}
/** The event queue a client streams; none for a draining client, so an unloading document never reads its successor's events. */
function selectClientEventQueue(state, clientId) {
	const current = senderOf(state, clientId);
	return current?.status === "bound" && current.clientId === clientId ? current.events : void 0;
}
/** The port of a bound or draining client, which still answers its RPCs. */
function selectClientPort(state, clientId) {
	const current = senderOf(state, clientId);
	if (current?.status === "bound") return current.port;
	return current?.draining?.port;
}
function selectClientSender(state, clientId) {
	return senderOf(state, clientId)?.sender;
}
/** The client that receives a sender's events, if its current document has bound one. */
function selectBoundClientId(state, senderId) {
	if (state.status !== "open") return;
	const current = state.senders.get(senderId);
	return current?.status === "bound" ? current.clientId : void 0;
}
function selectClientIds(state) {
	return new Set(state.status === "open" ? state.clients.keys() : []);
}
function senderOf(state, clientId) {
	if (state.status !== "open") return;
	const senderId = state.clients.get(clientId);
	return senderId === void 0 ? void 0 : state.senders.get(senderId);
}
function awaiting(sender, draining) {
	return {
		status: "awaiting-port",
		sender,
		buffered: [],
		draining
	};
}
function withSender(state, senderId, sender) {
	return {
		...state,
		senders: new Map(state.senders).set(senderId, sender)
	};
}
function release(current) {
	if (current.status === "bound") return [
		{
			type: "shutdown-events",
			events: current.events
		},
		{
			type: "close-port",
			port: current.port
		},
		{
			type: "notify-disconnect",
			clientId: current.clientId
		},
		{
			type: "end-client",
			clientId: current.clientId
		}
	];
	if (!current.draining) return [];
	return [{
		type: "close-port",
		port: current.draining.port
	}, {
		type: "end-client",
		clientId: current.draining.clientId
	}];
}
//#endregion
//#region src/main/ipc-transport.ts
var IpcPortHandoff = class extends Service$9()("opencode/desktop/IpcPortHandoff") {};
var IpcServerProtocolLive = unwrap(gen(function* () {
	const runSync = runSyncWith(yield* context());
	const disconnects = yield* unbounded();
	const inbound = yield* unbounded();
	const disconnected = /* @__PURE__ */ new Set();
	const senderListeners = /* @__PURE__ */ new Map();
	const portListeners = /* @__PURE__ */ new Map();
	let state = createIpcTransportState();
	const dispatch = (event) => {
		const next = transitionIpcTransport(state, event);
		state = next.state;
		next.commands.forEach(perform);
	};
	const perform = (command) => {
		switch (command.type) {
			case "watch-sender": {
				const onDestroyed = () => dispatch({
					type: "sender.destroyed",
					senderId: command.senderId
				});
				senderListeners.set(command.senderId, onDestroyed);
				command.sender.once("destroyed", onDestroyed);
				return;
			}
			case "unwatch-sender": {
				const onDestroyed = senderListeners.get(command.senderId);
				senderListeners.delete(command.senderId);
				if (onDestroyed) command.sender.off("destroyed", onDestroyed);
				return;
			}
			case "attach-port": {
				const listeners = {
					onMessage: (event) => {
						offerUnsafe(inbound, [command.clientId, event.data]);
					},
					onClose: () => dispatch({
						type: "client.closed",
						clientId: command.clientId
					})
				};
				portListeners.set(command.port, listeners);
				command.port.on("message", listeners.onMessage);
				command.port.on("close", listeners.onClose);
				command.port.start();
				return;
			}
			case "close-port": {
				const listeners = portListeners.get(command.port);
				portListeners.delete(command.port);
				if (listeners) {
					command.port.off("message", listeners.onMessage);
					command.port.off("close", listeners.onClose);
				}
				command.port.close();
				return;
			}
			case "offer-events":
				offerAllUnsafe(command.events, command.items);
				return;
			case "shutdown-events":
				runSync(shutdown(command.events));
				return;
			case "notify-disconnect": return disconnected.forEach((listener) => listener(command.clientId));
			case "end-client":
				offerUnsafe(disconnects, command.clientId);
				return;
		}
	};
	const protocol = yield* Protocol.make(fnUntraced(function* (writeRequest) {
		yield* fromQueue(inbound).pipe(runForEach(([id, message]) => selectClientPort(state, id) ? writeRequest(id, message) : void_), forkScoped);
		return {
			codecFor: toCodecJson,
			disconnects,
			send: (clientId, response) => sync(() => {
				selectClientPort(state, clientId)?.postMessage(response);
			}),
			end: (clientId) => sync(() => dispatch({
				type: "client.closed",
				clientId
			})),
			clientIds: sync(() => selectClientIds(state)),
			initialMessage: succeed(none()),
			supportsAck: true,
			supportsTransferables: false,
			supportsSpanPropagation: false,
			supportsNotifications: true
		};
	}));
	const clearSink = setIpcEventSink((sender, event) => {
		const queue = selectBoundEventQueue(state, sender.id);
		if (queue) return offerUnsafe(queue, event);
		const before = state;
		dispatch({
			type: "event.emitted",
			senderId: sender.id,
			event
		});
		return state !== before;
	});
	yield* addFinalizer$1(() => sync(() => {
		clearSink();
		dispatch({ type: "disposed" });
	}));
	return merge$1(succeed$1(Protocol)(protocol), succeed$1(IpcPortHandoff)({
		prepare: (sender) => {
			if (!sender.isDestroyed()) dispatch({
				type: "sender.prepared",
				senderId: sender.id,
				sender
			});
		},
		bind: (sender, port) => {
			if (sender.isDestroyed()) return port.close();
			dispatch({
				type: "port.bound",
				senderId: sender.id,
				sender,
				port,
				events: runSync(unbounded())
			});
		},
		sender: (clientId) => selectClientSender(state, clientId),
		events: (clientId) => selectClientEventQueue(state, clientId),
		isCurrentClient: (sender, clientId) => selectBoundClientId(state, sender.id) === clientId,
		onDisconnect: (listener) => {
			disconnected.add(listener);
			return () => {
				disconnected.delete(listener);
			};
		}
	}));
}));
//#endregion
//#region src/main/service/background-service-machine.ts
var DISPOSED_ERROR = /* @__PURE__ */ new Error("Background service is disposed");
function initialTransition() {
	return {
		state: {
			status: "connecting",
			attempt: 1,
			waiters: []
		},
		commands: [{
			type: "connect",
			attempt: 1,
			mode: "initial"
		}]
	};
}
function transition(state, event) {
	if (state.status === "disposed") {
		if (event.type === "connection.requested" || event.type === "reconnect.requested") return {
			state,
			commands: [{
				type: "reject",
				replies: [event.reply],
				error: DISPOSED_ERROR
			}]
		};
		return unchanged$1(state);
	}
	if (event.type === "disposed") return {
		state: { status: "disposed" },
		commands: reject(pending(state), DISPOSED_ERROR)
	};
	if (state.status === "connecting") return connecting(state, event);
	if (state.status === "reconnecting") return reconnecting(state, event);
	if (state.status === "ready") return ready(state, event);
	if (event.type !== "connection.requested" && event.type !== "reconnect.requested") return unchanged$1(state);
	const attempt = state.attempt + 1;
	if (state.last) return {
		state: {
			status: "reconnecting",
			attempt,
			data: state.last,
			waiters: event.type === "reconnect.requested" ? [event.reply] : [],
			joiners: event.type === "connection.requested" ? [event.reply] : []
		},
		commands: [{
			type: "connect",
			attempt,
			mode: "reconnect"
		}]
	};
	return {
		state: {
			status: "connecting",
			attempt,
			waiters: [event.reply]
		},
		commands: [{
			type: "connect",
			attempt,
			mode: "initial"
		}]
	};
}
function connecting(state, event) {
	if (event.type === "connection.requested" || event.type === "reconnect.requested") return {
		state: {
			...state,
			waiters: [...state.waiters, event.reply]
		},
		commands: []
	};
	if (event.type === "waiter.cancelled") {
		if (!state.waiters.includes(event.reply)) return unchanged$1(state);
		return {
			state: {
				...state,
				waiters: without(state.waiters, event.reply)
			},
			commands: []
		};
	}
	if (!("attempt" in event) || event.attempt !== state.attempt) return unchanged$1(state);
	if (event.type === "probe.succeeded") return {
		state: {
			status: "ready",
			attempt: state.attempt,
			data: event.data
		},
		commands: [
			{
				type: "publish",
				data: event.data
			},
			...resolve(state.waiters, event.data),
			{
				type: "verify",
				attempt: state.attempt
			}
		]
	};
	if (event.type === "connect.succeeded") return {
		state: {
			status: "ready",
			attempt: state.attempt,
			data: event.data
		},
		commands: [{
			type: "publish",
			data: event.data
		}, ...resolve(state.waiters, event.data)]
	};
	if (event.type === "connect.failed") return {
		state: {
			status: "failed",
			attempt: state.attempt,
			error: event.error,
			last: void 0
		},
		commands: reject(state.waiters, event.error)
	};
	return unchanged$1(state);
}
function reconnecting(state, event) {
	if (event.type === "reconnect.requested") return {
		state: {
			...state,
			waiters: [...state.waiters, event.reply]
		},
		commands: []
	};
	if (event.type === "connection.requested") return {
		state: {
			...state,
			joiners: [...state.joiners, event.reply]
		},
		commands: []
	};
	if (event.type === "waiter.cancelled") {
		if (!state.waiters.includes(event.reply) && !state.joiners.includes(event.reply)) return unchanged$1(state);
		return {
			state: {
				...state,
				waiters: without(state.waiters, event.reply),
				joiners: without(state.joiners, event.reply)
			},
			commands: []
		};
	}
	if (event.type !== "connect.succeeded" && event.type !== "connect.failed") return unchanged$1(state);
	if (event.attempt !== state.attempt) return unchanged$1(state);
	if (event.type === "connect.succeeded") return {
		state: {
			status: "ready",
			attempt: state.attempt,
			data: event.data
		},
		commands: [...same(state.data, event.data) ? [] : [{
			type: "publish",
			data: event.data
		}], ...resolve([...state.waiters, ...state.joiners], event.data)]
	};
	return {
		state: {
			status: "failed",
			attempt: state.attempt,
			error: event.error,
			last: state.data
		},
		commands: [...resolve(state.joiners, state.data), ...reject(state.waiters, event.error)]
	};
}
function ready(state, event) {
	if (event.type === "connection.requested") return {
		state,
		commands: [{
			type: "resolve",
			replies: [event.reply],
			data: state.data
		}]
	};
	if (event.type === "reconnect.requested") {
		const attempt = state.attempt + 1;
		return {
			state: {
				status: "reconnecting",
				attempt,
				data: state.data,
				waiters: [event.reply],
				joiners: []
			},
			commands: [{
				type: "connect",
				attempt,
				mode: "reconnect"
			}]
		};
	}
	if (event.type === "verify.succeeded" && event.attempt === state.attempt && !same(state.data, event.data)) return {
		state: {
			status: "ready",
			attempt: state.attempt,
			data: event.data
		},
		commands: [{
			type: "publish",
			data: event.data
		}]
	};
	return unchanged$1(state);
}
function resolve(replies, data) {
	return replies.length > 0 ? [{
		type: "resolve",
		replies,
		data
	}] : [];
}
function reject(replies, error) {
	return replies.length > 0 ? [{
		type: "reject",
		replies,
		error
	}] : [];
}
/** Every caller still waiting on an attempt. */
function pending(state) {
	if (state.status === "connecting") return state.waiters;
	if (state.status === "reconnecting") return [...state.waiters, ...state.joiners];
	return [];
}
function without(replies, reply) {
	return replies.filter((item) => item !== reply);
}
function same(a, b) {
	return a.url === b.url && a.password === b.password;
}
function unchanged$1(state) {
	return {
		state,
		commands: []
	};
}
/**
* Runs the machine for the scope's lifetime. The initial connect starts at once, in the background: windows are
* created as soon as the main process is up, and their renderers load while the CLI service is resolved.
*/
var make = fn("BackgroundServiceMachine.make")(function* (input) {
	const fibers = yield* make$15();
	const run = yield* runtime$1(fibers)();
	const initial = initialTransition();
	const current = { state: initial.state };
	const dispatch = (event) => {
		const next = transition(current.state, event);
		current.state = next.state;
		next.commands.forEach(perform);
	};
	const report = (effect, failed) => run(effect.pipe(exit, flatMap((exit) => {
		if (isSuccess(exit)) return sync(() => dispatch(exit.value));
		if (hasInterruptsOnly(exit.cause)) return void_;
		const error = squash(exit.cause);
		const event = failed(error instanceof Error ? error : new Error(String(error)));
		return logError("v2 CLI background service failed", { event }).pipe(andThen(sync(() => dispatch(event))));
	})));
	const perform = (command) => {
		if (command.type === "connect") {
			const attempt = command.attempt;
			const connect = (mode) => input.ensure(mode).pipe(map((data) => ({
				type: "connect.succeeded",
				attempt,
				data
			})));
			report(command.mode === "reconnect" ? connect("reconnect") : input.probe.pipe(orElseSucceed(() => void 0), flatMap((data) => data ? succeed({
				type: "probe.succeeded",
				attempt,
				data
			}) : connect("initial"))), (error) => ({
				type: "connect.failed",
				attempt,
				error
			}));
			return;
		}
		if (command.type === "verify") {
			const attempt = command.attempt;
			report(input.ensure("initial").pipe(map((data) => ({
				type: "verify.succeeded",
				attempt,
				data
			}))), (error) => ({
				type: "verify.failed",
				attempt,
				error
			}));
			return;
		}
		if (command.type === "publish") return input.publish(command.data);
		if (command.type === "resolve") return command.replies.forEach((reply) => reply.resolve(command.data));
		command.replies.forEach((reply) => reply.reject(command.error));
	};
	const request = (type) => callback((resume) => {
		const reply = {
			resolve: (data) => resume(succeed(data)),
			reject: (error) => resume(die$1(error))
		};
		dispatch({
			type,
			reply
		});
		return sync(() => dispatch({
			type: "waiter.cancelled",
			reply
		}));
	});
	yield* addFinalizer$1(() => sync(() => dispatch({ type: "disposed" })));
	initial.commands.forEach(perform);
	return {
		connection: request("connection.requested"),
		reconnect: request("reconnect.requested")
	};
});
//#endregion
//#region src/main/service/cli-stages.ts
var cleanStages = fn("DesktopCli.cleanStages")(function* (binary, options) {
	const fs = yield* FileSystem;
	const path = yield* Path$1;
	const current = path.dirname(binary);
	const root = path.dirname(current);
	const keep = /* @__PURE__ */ new Set([path.basename(current), ...options?.keep ?? []]);
	const entries = yield* fs.readDirectory(root);
	yield* forEach(entries, fnUntraced(function* (entry) {
		if (keep.has(entry)) return;
		const target = path.join(root, entry);
		if ((yield* fs.stat(target).pipe(orElseSucceed(() => void 0)))?.type !== "Directory") return;
		yield* fs.remove(target, {
			recursive: true,
			force: true
		}).pipe(catch_((error) => logError("failed to clean staged v2 CLI", {
			path: target,
			error
		})));
	}), { concurrency: "unbounded" });
});
//#endregion
//#region src/main/service/background-service.ts
var RegisteredService = Struct({ version: optional(String$1) });
var Service$1 = class extends Service$9()("opencode/desktop/BackgroundService") {};
var layer$2 = effect(Service$1, gen(function* () {
	const context$1 = yield* context();
	return Service$1.of(yield* make({
		probe: probe$1().pipe(provide$1(context$1)),
		ensure: (mode) => ensure(mode).pipe(provide$1(context$1)),
		publish: (data) => {
			set(data);
			const event = new SidecarChanged({ url: data.url });
			getMainWindows().forEach((win) => emitIpcEvent(win.webContents, event));
		}
	}));
}));
var probe$1 = fn("BackgroundService.probe")(function* () {
	const service = yield* promise$1(takeSidecarProbe);
	if (!service) return void 0;
	return (yield* adopt(yield* prepare("initial"), service, true)).credentials;
});
var ensure = fn("BackgroundService.ensure")(function* (mode) {
	const runFork = runForkWith(yield* context());
	const setup = yield* prepare(mode);
	const run = (version = setup.version) => setup.client.Service.ensure({
		file: setup.file,
		version,
		command: [
			...setup.cli.command,
			"serve",
			"--service",
			...setup.isolated ? [
				"--hostname",
				"0.0.0.0",
				"--port",
				String(3084)
			] : []
		],
		onStart: (reason, previousVersion) => runFork(logInfo("v2 CLI background service starting", {
			reason,
			previousVersion
		}))
	});
	const ready = yield* adopt(setup, yield* tryPromise(() => run().catch((error) => {
		if (!shouldRetryEnsure(setup.version, error instanceof Error ? error.message : String(error))) throw error;
		return run(setup.cli.version);
	})), false);
	if (mode === "initial" && (app.isPackaged || setup.isolated) && setup.cli.binary && ready.runningVersion) runFork(cleanStages(setup.cli.binary, { keep: keptStages(setup.cli.version, ready.runningVersion) }).pipe(catch_((error) => logError("failed to clean staged v2 CLIs", { error }))));
	return ready.credentials;
});
var prepare = fn("BackgroundService.prepare")(function* (mode) {
	yield* logInfo("starting v2 background service");
	const path = yield* Path$1;
	const desktopCli = yield* Service$3;
	const isolated = !app.isPackaged && process.env.OPENCODE_DESKTOP_ISOLATED_SERVER === "1";
	const cli = yield* desktopCli.resolve;
	const version = serviceVersion({
		channel: "dev",
		isolated,
		mode,
		version: cli.version
	});
	if (isolated) process.env.XDG_STATE_HOME = app.getPath("userData");
	return {
		cli,
		client: yield* promise$1(() => import("./service-TLAGzubs.js")),
		file: process.env.OPENCODE_DESKTOP_SERVER_CHANNEL === "local" ? path.join(process.env.XDG_STATE_HOME ?? path.join(app.getPath("home"), ".local", "state"), "opencode", "service-local.json") : void 0,
		isolated,
		version
	};
});
var adopt = fn("BackgroundService.adopt")(function* (setup, service, probed) {
	const fs = yield* FileSystem;
	if (service.auth?.type !== "basic") throw new Error("V2 CLI background service did not provide authentication");
	const url = new URL(service.url);
	if (url.hostname === "0.0.0.0") url.hostname = "127.0.0.1";
	const runningVersion = yield* fs.readFileString(setup.file ?? setup.client.fallback()).pipe(map((text) => getOrUndefined$1(decodeUnknownOption(fromJsonString(RegisteredService))(text))?.version), orElseSucceed(() => void 0));
	yield* logInfo("v2 CLI background service ready", {
		version: setup.version,
		runningVersion,
		probed,
		...endpoint(url.origin)
	});
	return {
		credentials: {
			url: url.origin,
			password: service.auth.password
		},
		runningVersion
	};
});
function endpoint(url) {
	if (!url || !URL.canParse(url)) return {};
	const parsed = new URL(url);
	return {
		url,
		hostname: parsed.hostname,
		port: parsed.port
	};
}
//#endregion
//#region src/main/ipc-handlers/context.ts
function sender(handoff, context) {
	const contents = handoff.sender(context.client.id);
	if (!contents || contents.isDestroyed()) throw new Error("Renderer connection not found");
	return contents;
}
//#endregion
//#region src/main/ipc-handlers/app.ts
var appHandlers = AppRpcs.toLayer(gen(function* () {
	const handoff = yield* IpcPortHandoff;
	const lifecycle = yield* Service$4;
	const background = yield* Service$1;
	const logging = yield* Service$8;
	return AppRpcs.of({
		AppAwaitInitialization: () => background.connection.pipe(map(ready$2)),
		AppReconnectService: () => background.reconnect.pipe(map(ready$2)),
		AppReadyDeepLinks: (_request, context) => sync(() => {
			const contents = sender(handoff, context);
			const win = BrowserWindow.fromWebContents(contents);
			const id = win?.webContents === contents ? getWindowID(win) : void 0;
			if (id) lifecycle.deepLinks.ready(id, context.client.id);
		}),
		AppAcknowledgeDeepLinks: ({ attempt }, context) => sync(() => lifecycle.deepLinks.acknowledge(context.client.id, attempt)),
		AppIsFirstLaunchOnboardingPending: isFirstLaunchOnboardingPending,
		AppFinishFirstLaunchOnboarding: ({ createDefaultProject }) => finishFirstLaunchOnboarding(createDefaultProject).pipe(orDie),
		AppCheckAppExists: ({ appName }) => checkAppExists(appName).pipe(orDie),
		AppResolveAppPath: ({ appName }) => resolveAppPath(appName).pipe(orDie),
		AppSetBackgroundColor: ({ color }) => sync(() => setBackgroundColor(color)),
		AppGetSpellcheckEnabled: () => sync(getSpellcheckEnabled),
		AppSetSpellcheckEnabled: ({ enabled }) => sync(() => setSpellcheckEnabled(enabled)),
		AppExportDebugLogs: () => logging.exportDebug,
		AppSetForceFocus: ({ enabled }, context) => promise(() => setForceFocus(sender(handoff, context), enabled)),
		AppRecordFatalRendererError: ({ error }) => scoped("renderer", logError("fatal renderer error", { ...error })),
		AppSetNativeTranslations: ({ value }, context) => sync(() => {
			const contents = sender(handoff, context);
			const win = BrowserWindow.fromWebContents(contents);
			if (!win || win.isDestroyed() || win.webContents !== contents) throw new Error("Invalid native translation sender");
			const bundle = parseDesktopNativeBundle(value);
			if (!bundle) throw new Error("Invalid native translation bundle");
			setNativeTranslations(bundle);
		}),
		AppRelaunch: () => sync(lifecycle.relaunch)
	});
}));
function promise(evaluate) {
	return tryPromise(async () => evaluate()).pipe(orDie);
}
//#endregion
//#region src/main/ipc-handlers/events.ts
var eventHandlers = EventRpcs.toLayer(gen(function* () {
	const handoff = yield* IpcPortHandoff;
	return EventRpcs.of({ DesktopEvents: (_request, context) => {
		const events = handoff.events(context.client.id);
		return events ? fromQueue(events) : empty$1;
	} });
}));
//#endregion
//#region src/main/ipc-handlers/plugins.ts
var pluginHandlers = PluginRpcs.toLayer(gen(function* () {
	const handoff = yield* IpcPortHandoff;
	const plugins = yield* Service$2;
	const caller = (context) => {
		const contents = sender(handoff, context);
		const win = BrowserWindow.fromWebContents(contents);
		if (!win || win.isDestroyed() || win.webContents !== contents || !isRendererUrl(contents.getURL())) throw new Error("plugin.caller.invalid");
		return win.id;
	};
	const manage = (run) => tryPromise({
		try: () => plugins.host().then(run),
		catch: pluginFailure
	});
	return PluginRpcs.of({
		PluginCall: (request, context) => tryPromise({
			try: (signal) => plugins.host().then((host) => host.call(request, {
				window: caller(context),
				signal
			})),
			catch: pluginFailure
		}),
		PluginSubscribe: ({ ipc }, context) => sync(() => plugins.subscribe(ipc, caller(context))),
		PluginEmbed: ({ id, layout }, context) => sync(() => plugins.loaded()?.embed(caller(context), id, layout)),
		PluginCapture: ({ id }, context) => promise$1(async () => await plugins.loaded()?.capture(caller(context), id) ?? null),
		PluginMenubarItem: ({ id }, context) => sync(() => plugins.loaded()?.runMenubarItem(caller(context), id)),
		PluginMenubarItems: () => sync(() => plugins.loaded()?.listMenubarItems() ?? []),
		PluginConfigure: ({ servers }, context) => sync(() => plugins.configure(caller(context), servers)),
		PluginGuis: () => promise$1(() => plugins.host().then((host) => host.pluginGuis())),
		PluginList: () => promise$1(() => plugins.host().then((host) => host.list())),
		PluginEnable: ({ id }) => manage((host) => host.enable(id)),
		PluginDisable: ({ id }) => manage((host) => host.disable(id)),
		PluginReload: ({ id }) => manage((host) => host.reload(id))
	});
}));
//#endregion
//#region src/main/ipc-handlers/files.ts
var fileHandlers = FileRpcs.toLayer(gen(function* () {
	const files = yield* Service$7;
	const handoff = yield* IpcPortHandoff;
	return FileRpcs.of({
		FilesOpenDirectoryPicker: ({ options }) => files.openDirectoryPicker(options),
		FilesOpenFilePicker: ({ options }, context) => files.openFilePicker(sender(handoff, context).id, options ? {
			...options,
			extensions: options.extensions && [...options.extensions]
		} : void 0).pipe(orDie),
		FilesReadPickedFile: ({ token, path }, context) => files.readPickedFile(sender(handoff, context).id, token, path).pipe(map((buffer) => new Uint8Array(buffer)), orDie),
		FilesReleasePickedFiles: ({ token }, context) => sync(() => files.releasePickedFiles(sender(handoff, context).id, token)),
		FilesSaveFile: ({ options, content }) => files.saveFile(options, content).pipe(orDie),
		FilesOpenExternal: ({ url }) => openExternalURL(url).pipe(asVoid),
		FilesOpenBrowser: ({ url }) => /^https?:/i.test(url) ? openExternalURL(url) : succeed(false),
		FilesOpenLocalFile: ({ url }) => openLocalFileURL(url),
		FilesOpenPath: ({ path, application }) => files.openPath(path, application).pipe(map((result) => result ?? null), orDie),
		FilesRevealPath: ({ path }) => files.revealPath(path),
		FilesReadClipboardImage: () => files.readClipboardImage(),
		FilesWriteClipboardText: ({ text }) => files.writeClipboardText(text)
	});
}));
//#endregion
//#region src/main/native/menu-actions.ts
function runDesktopMenuAction(win, action, handlers = {}) {
	switch (action) {
		case "app.installCli":
			handlers.installCli?.();
			return;
		case "app.relaunch":
			handlers.relaunch?.();
			return;
		case "window.new":
			handlers.createWindow?.();
			return;
		case "window.close":
			win?.close();
			return;
		case "window.minimize":
			win?.minimize();
			return;
		case "window.toggleMaximize":
			if (win?.isMaximized()) {
				win.unmaximize();
				return;
			}
			win?.maximize();
			return;
		case "view.reload":
			win?.reload();
			return;
		case "view.toggleDevTools":
			win?.webContents.toggleDevTools();
			return;
		case "view.resetZoom":
			setZoomLevel(1);
			return;
		case "view.zoomIn":
			if (win) setZoomLevel(nextDesktopZoomLevel(win.webContents.getZoomFactor(), "in"));
			return;
		case "view.zoomOut":
			if (win) setZoomLevel(nextDesktopZoomLevel(win.webContents.getZoomFactor(), "out"));
			return;
		case "view.toggleFullscreen":
			win?.setFullScreen(!win.isFullScreen());
			return;
		case "edit.undo":
			win?.webContents.undo();
			return;
		case "edit.redo":
			win?.webContents.redo();
			return;
		case "edit.cut":
			win?.webContents.cut();
			return;
		case "edit.copy":
			win?.webContents.copy();
			return;
		case "edit.paste":
			win?.webContents.paste();
			return;
		case "edit.delete":
			win?.webContents.delete();
			return;
		case "edit.selectAll":
			win?.webContents.selectAll();
			return;
	}
}
//#endregion
//#region src/main/ipc-handlers/menu.ts
var menuHandlers = MenuRpcs.toLayer(gen(function* () {
	const handoff = yield* IpcPortHandoff;
	const lifecycle = yield* Service$4;
	return MenuRpcs.of({ MenuRunAction: ({ action }, context) => sync(() => runDesktopMenuAction(BrowserWindow.fromWebContents(sender(handoff, context)), action, {
		createWindow: lifecycle.createWindow,
		relaunch: lifecycle.relaunch
	})) });
}));
//#endregion
//#region src/main/ipc-handlers/storage.ts
var storageHandlers = StorageRpcs.toLayer(gen(function* () {
	const storage = yield* Service$6;
	const handoff = yield* IpcPortHandoff;
	return StorageRpcs.of({
		StorageItems: ({ name }) => sync(() => storage.state.items(name)),
		StorageUpdate: ({ name, insert, remove }, context) => sync(() => {
			const revision = storage.state.update(name, insert, remove);
			const event = new StorageChanged({
				name,
				insert,
				remove,
				revision
			});
			for (const win of BrowserWindow.getAllWindows()) if (!handoff.isCurrentClient(win.webContents, context.client.id)) emitIpcEvent(win.webContents, event);
			return revision;
		}),
		StorageClear: ({ name }) => sync(() => storage.state.clear(name)),
		DraftsGet: ({ key }) => sync(() => storage.drafts.get(key)),
		DraftsSet: ({ key, value, strict }) => sync(() => storage.drafts.set(key, value, strict)),
		DraftsDelete: ({ key }) => sync(() => void storage.drafts.set(key, null)),
		DraftsPutBlob: ({ data }) => sync(() => storage.drafts.putBlob(data)),
		DraftsGetBlob: ({ id }) => sync(() => storage.drafts.getBlob(id))
	});
}));
//#endregion
//#region src/main/windows/focus.ts
function showWindow(win) {
	if (!win) return;
	if (win.isMinimized()) win.restore();
	win.show();
}
function focusWindow(win, app) {
	if (!win) return;
	if (win.isMinimized()) win.restore();
	if (process.platform === "darwin") app.focus({ steal: true });
	win.focus();
}
//#endregion
//#region src/main/ipc-handlers/window.ts
var windowHandlers = WindowRpcs.toLayer(gen(function* () {
	const handoff = yield* IpcPortHandoff;
	return WindowRpcs.of({
		WindowRequestMicrophone: () => promise$1(() => process.platform === "darwin" ? systemPreferences.askForMediaAccess("microphone") : Promise.resolve(true)),
		WindowSetVoiceCallActive: ({ active }, context) => sync(() => {
			sender(handoff, context).setBackgroundThrottling(!active);
		}),
		WindowThemeReady: (_args, context) => sync(() => {
			const win = BrowserWindow.fromWebContents(sender(handoff, context));
			if (!win) throw new Error("Window not found");
			setWindowThemeReady(win);
		}),
		WindowGetFocused: (_args, context) => sync(() => BrowserWindow.fromWebContents(sender(handoff, context))?.isFocused() ?? false),
		WindowGetFullscreen: (_args, context) => sync(() => BrowserWindow.fromWebContents(sender(handoff, context))?.isFullScreen() ?? false),
		WindowSetFocus: (_args, context) => sync(() => focusWindow(BrowserWindow.fromWebContents(sender(handoff, context)), app)),
		WindowShow: (_args, context) => sync(() => showWindow(BrowserWindow.fromWebContents(sender(handoff, context)))),
		WindowGetZoomFactor: (_args, context) => sync(() => sender(handoff, context).getZoomFactor()),
		WindowSetZoomFactor: ({ factor }, context) => sync(() => {
			const contents = sender(handoff, context);
			contents.setZoomFactor(factor);
			const win = BrowserWindow.fromWebContents(contents);
			if (win) updateTitlebar(win);
		}),
		WindowGetZoomLevel: () => sync(storedZoomLevel),
		WindowSetZoomLevel: ({ level }) => sync(() => setZoomLevel(level)),
		WindowGetPinchZoomEnabled: () => sync(getPinchZoomEnabled),
		WindowSetPinchZoomEnabled: ({ enabled }) => sync(() => setPinchZoomEnabled(enabled)),
		WindowSetTitlebar: ({ theme }, context) => sync(() => {
			const win = BrowserWindow.fromWebContents(sender(handoff, context));
			if (win) setTitlebar(win, theme);
		}),
		WindowSetTrafficLightsPosition: (position, context) => sync(() => {
			const win = BrowserWindow.fromWebContents(sender(handoff, context));
			if (win) setTrafficLightsPosition(win, position);
		})
	});
}));
//#endregion
//#region src/main/native/install-cli-machine.ts
function initialInstallCliState() {
	return {
		status: "idle",
		attempt: 0
	};
}
function transitionInstallCli(state, event) {
	if (state.status === "disposed") return unchanged(state);
	if (event.type === "disposed") return {
		state: { status: "disposed" },
		commands: []
	};
	if (event.type === "install.requested") {
		if (state.status !== "idle") return unchanged(state);
		const attempt = state.attempt + 1;
		return {
			state: {
				status: "installing",
				attempt
			},
			commands: [{
				type: "run-install",
				attempt
			}]
		};
	}
	if (event.attempt !== state.attempt) return unchanged(state);
	if (state.status === "installing" && event.type !== "dialog.dismissed") {
		const outcome = event.type === "install.succeeded" ? {
			ok: true,
			path: event.path
		} : {
			ok: false,
			error: event.error
		};
		return {
			state: {
				status: "presenting",
				attempt: state.attempt,
				outcome
			},
			commands: [{
				type: "show-dialog",
				attempt: state.attempt,
				outcome
			}]
		};
	}
	if (state.status === "presenting" && event.type === "dialog.dismissed") return {
		state: {
			status: "idle",
			attempt: state.attempt
		},
		commands: []
	};
	return unchanged(state);
}
function unchanged(state) {
	return {
		state,
		commands: []
	};
}
//#endregion
//#region src/main/native/install-cli.ts
/** Runs the `Install CLI…` machine for the scope's lifetime and returns the menu action. */
var createCliInstaller = fn("CliInstaller.make")(function* (desktopCli) {
	const fibers = yield* make$15();
	const run = yield* runtime$1(fibers)();
	const current = { state: initialInstallCliState() };
	const dispatch = (event) => {
		const next = transitionInstallCli(current.state, event);
		current.state = next.state;
		next.commands.forEach(perform);
	};
	const perform = (command) => {
		const attempt = command.attempt;
		if (command.type === "run-install") return void run(desktopCli.install.pipe(exit, flatMap((exit) => {
			if (isSuccess(exit)) return sync(() => dispatch({
				type: "install.succeeded",
				attempt,
				path: exit.value
			}));
			if (hasInterruptsOnly(exit.cause)) return void_;
			const error = squash(exit.cause);
			return logError("CLI installation failed", { error }).pipe(andThen(sync(() => dispatch({
				type: "install.failed",
				attempt,
				error: error instanceof Error ? error.message : String(error)
			}))));
		})));
		const outcome = command.outcome;
		run(promise$1(() => dialog.showMessageBox(outcome.ok ? {
			type: "info",
			message: nativeT("desktop.cli.installed.message", { path: outcome.path }),
			title: nativeT("desktop.cli.installed.title")
		} : {
			type: "error",
			message: nativeT("desktop.cli.failed.message", { error: outcome.error }),
			title: nativeT("desktop.cli.failed.title")
		})).pipe(ensuring(sync(() => dispatch({
			type: "dialog.dismissed",
			attempt
		})))));
	};
	yield* addFinalizer$1(() => sync(() => dispatch({ type: "disposed" })));
	return () => dispatch({ type: "install.requested" });
});
//#endregion
//#region src/main/native/menu-machine.ts
function createMenuState() {
	return {
		status: "uninstalled",
		provider: () => []
	};
}
function transitionMenu(state, event) {
	if (event.type === "installed") return build$1({
		status: "installed",
		deps: event.deps,
		provider: state.provider
	});
	if (event.type === "provider.changed") {
		if (event.provider === state.provider) return {
			state,
			commands: []
		};
		return state.status === "installed" ? build$1({
			...state,
			provider: event.provider
		}) : {
			state: {
				...state,
				provider: event.provider
			},
			commands: []
		};
	}
	if (state.status === "uninstalled") return {
		state,
		commands: []
	};
	if (event.type === "refreshed") return build$1(state);
	return {
		state: {
			status: "uninstalled",
			provider: state.provider
		},
		commands: []
	};
}
/**
* The window a menu action (Close Window, Reload, Paste) applies to: the focused one, else the visible window whose
* detached DevTools hold focus. With neither the action does nothing, so it never reaches a window the user cannot see.
*/
function selectMenuActionWindow(focused, windows) {
	if (focused) return focused;
	return windows.find((win) => !win.isDestroyed() && win.isVisible() && !win.isMinimized() && win.webContents.isDevToolsFocused()) ?? null;
}
function build$1(state) {
	return {
		state,
		commands: [{
			type: "build",
			deps: state.deps,
			provider: state.provider
		}]
	};
}
//#endregion
//#region src/main/native/menu.ts
var installation = { state: createMenuState() };
function dispatch(event) {
	const next = transitionMenu(installation.state, event);
	installation.state = next.state;
	next.commands.forEach((command) => build(command.deps, command.provider));
}
/** Contributions are read on every build; setting a provider rebuilds an installed menu. */
function setMenubarProvider(provider) {
	dispatch({
		type: "provider.changed",
		provider
	});
}
/** Rebuilds an installed menu after its contributions or translations changed. */
function refreshMenu() {
	dispatch({ type: "refreshed" });
}
function createMenu(deps) {
	dispatch({
		type: "installed",
		deps
	});
}
/** Later contributions and translations no longer rebuild the menu. */
function disposeMenu() {
	dispatch({ type: "disposed" });
}
function build(deps, provider) {
	if (process.platform !== "darwin") return;
	const extra = provider();
	const template = DESKTOP_MENU.filter((menu) => desktopMenuVisible(menu, "macos")).map((menu) => nativeMenu(menu, extra.filter((item) => item.menu === menu.id), deps));
	const built = Menu.buildFromTemplate(template);
	const refresh = () => extra.forEach((item) => {
		const target = built.getMenuItemById(item.id);
		if (target) target.enabled = item.enabled();
	});
	if (extra.length) built.items.forEach((item) => item.submenu?.on("menu-will-show", refresh));
	Menu.setApplicationMenu(built);
}
function sendMenuCommand(win, id) {
	emitIpcEvent(win.webContents, new MenuCommandTriggered({ id }));
}
function nativeMenu(menu, extra, deps) {
	if (menu.role && !extra.length) return {
		role: nativeRole(menu.role),
		label: nativeT(menu.labelKey)
	};
	const items = desktopMenuWithPlugins((menu.items ?? []).filter((entry) => desktopMenuVisible(entry, "macos")).map((entry) => ({
		key: desktopMenuKey(entry),
		entry
	})), extra);
	const options = {
		label: nativeT(menu.labelKey),
		submenu: items.map((item) => {
			const entry = item.entry;
			if ("menu" in entry) return {
				id: entry.id,
				label: entry.label,
				enabled: entry.enabled(),
				click: () => entry.run()
			};
			return nativeItem(entry, deps);
		})
	};
	if (menu.role) options.role = nativeRole(menu.role);
	return options;
}
function nativeItem(entry, deps) {
	if (entry.type === "separator") return { type: "separator" };
	if (entry.role) return {
		role: nativeRole(entry.role),
		label: entry.labelKey ? nativeT(entry.labelKey) : void 0,
		accelerator: entry.accelerator?.macos
	};
	const item = {
		label: entry.labelKey ? nativeT(entry.labelKey) : void 0,
		accelerator: entry.accelerator?.macos
	};
	if (entry.command) {
		const command = entry.command;
		item.click = () => {
			const win = deps.commandWindow();
			if (win) sendMenuCommand(win, command);
		};
	}
	if (entry.action) {
		const action = entry.action;
		item.click = () => {
			runDesktopMenuAction(selectMenuActionWindow(BrowserWindow.getFocusedWindow(), BrowserWindow.getAllWindows()), action, {
				installCli: deps.installCli,
				createWindow: deps.createWindow,
				relaunch: deps.relaunch
			});
		};
	}
	if (entry.href) {
		const href = entry.href;
		item.click = () => deps.openExternal(href);
	}
	return item;
}
function nativeRole(role) {
	return role;
}
//#endregion
//#region src/main/ipc.ts
var services = mergeAll(layer$8, layer$3);
var handlers = mergeAll(appHandlers, storageHandlers, fileHandlers, windowHandlers, menuHandlers, eventHandlers, pluginHandlers);
var layer$1 = layer$14(DesktopRpcs, { disableFatalDefects: true }).pipe(provide$2(handlers), provideMerge(IpcServerProtocolLive), provideMerge(services));
var registerIpcHandlers = gen(function* () {
	const handoff = yield* IpcPortHandoff;
	const lifecycle = yield* Service$4;
	const desktopCli = yield* Service$3;
	const runFork = runForkWith(yield* context());
	const menu = {
		commandWindow: getLastFocusedWindow,
		installCli: yield* createCliInstaller(desktopCli),
		createWindow: lifecycle.createWindow,
		openExternal: (url) => runFork(openExternalURL(url)),
		relaunch: lifecycle.relaunch
	};
	const wire = (win) => {
		win.webContents.on("before-input-event", (_event, input) => {
			win.webContents.setIgnoreMenuShortcuts(input.control && !input.meta && !input.alt && input.key.toLowerCase() === "r");
			if (input.type !== "keyDown" || input.key !== "Escape") return;
			win.webContents.send(DragCancelEvent);
		});
		const post = () => {
			if (win.isDestroyed() || win.webContents.isDestroyed()) return;
			const channel = new MessageChannelMain();
			handoff.bind(win.webContents, channel.port1);
			win.webContents.postMessage(IpcTransportPort, null, [channel.port2]);
		};
		win.webContents.on("did-navigate", (_event, url) => {
			if (isRendererUrl(url)) handoff.prepare(win.webContents);
		});
		win.webContents.on("did-finish-load", post);
		if (!win.webContents.isLoading() && win.webContents.getURL()) post();
	};
	const onWindowCreated = (_event, win) => wire(win);
	const stopDisconnects = handoff.onDisconnect(lifecycle.deepLinks.disconnect);
	yield* addFinalizer$1(() => sync(stopDisconnects));
	const stopSnapshots = setStorageSnapshotObserver(handoff.prepare);
	yield* addFinalizer$1(() => sync(stopSnapshots));
	const stopTranslations = onNativeTranslations(refreshMenu);
	yield* addFinalizer$1(() => sync(() => {
		stopTranslations();
		disposeMenu();
	}));
	yield* sync(() => {
		app.on("browser-window-created", onWindowCreated);
		BrowserWindow.getAllWindows().forEach((win) => wire(win));
	});
	yield* addFinalizer$1(() => sync(() => app.off("browser-window-created", onWindowCreated)));
	return { installMenu: () => createMenu(menu) };
});
//#endregion
//#region src/main/service/shell-env.ts
var TIMEOUT = 5e3;
function resolveUserShell(envShell, loginShell) {
	return envShell || (loginShell && loginShell !== "unknown" ? loginShell : void 0) || "/bin/sh";
}
function getUserShell() {
	try {
		return resolveUserShell(process.env.SHELL, userInfo().shell);
	} catch {
		return resolveUserShell(process.env.SHELL, void 0);
	}
}
function parseShellEnv(out) {
	const env = {};
	for (const line of out.toString("utf8").split("\0")) {
		if (!line) continue;
		const ix = line.indexOf("=");
		if (ix <= 0) continue;
		env[line.slice(0, ix)] = line.slice(ix + 1);
	}
	return env;
}
var run = (shell, mode) => callback((resume) => {
	const child = spawn(shell, [
		mode,
		"-c",
		"env -0"
	], {
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		],
		windowsHide: true
	});
	const chunks = [];
	child.stdout.on("data", (chunk) => chunks.push(chunk));
	child.on("error", (error) => resume(succeed({
		type: "Error",
		error
	})));
	child.on("close", (status) => resume(succeed({
		type: "Exited",
		status,
		stdout: Buffer.concat(chunks)
	})));
	return sync(() => {
		if (child.exitCode === null && child.signalCode === null) child.kill();
	});
}).pipe(timeoutOrElse({
	duration: TIMEOUT,
	orElse: () => succeed({ type: "Timeout" })
}));
var probe = fn("ShellEnv.probe")(function* (shell, mode) {
	const out = yield* run(shell, mode);
	if (out.type === "Timeout") return { type: "Timeout" };
	if (out.type === "Error") {
		yield* logWarning(`[server] Shell env probe failed for ${shell} ${mode}: ${out.error.message}`);
		return { type: "Unavailable" };
	}
	if (out.status !== 0) {
		yield* logWarning(`[server] Shell env probe exited with non-zero status for ${shell} ${mode}`);
		return { type: "Unavailable" };
	}
	const env = parseShellEnv(out.stdout);
	if (Object.keys(env).length === 0) {
		yield* logWarning(`[server] Shell env probe returned empty env for ${shell} ${mode}`);
		return { type: "Unavailable" };
	}
	return {
		type: "Loaded",
		value: env
	};
});
var isNushell = fn("ShellEnv.isNushell")(function* (shell) {
	const name = (yield* Path$1).basename(shell).toLowerCase();
	const raw = shell.toLowerCase();
	return name === "nu" || name === "nu.exe" || raw.endsWith("\\nu.exe");
});
var loadShellEnv = fn("ShellEnv.load")(function* (shell) {
	if (yield* isNushell(shell)) {
		yield* logInfo(`[server] Skipping shell env probe for nushell: ${shell}`);
		return null;
	}
	const interactive = yield* probe(shell, "-il");
	if (interactive.type === "Loaded") {
		yield* logInfo(`[server] Loaded shell environment with -il (${Object.keys(interactive.value).length} vars)`);
		return interactive.value;
	}
	if (interactive.type === "Timeout") {
		yield* logInfo(`[server] Interactive shell env probe timed out: ${shell}`);
		return null;
	}
	const login = yield* probe(shell, "-l");
	if (login.type === "Loaded") {
		yield* logInfo(`[server] Loaded shell environment with -l (${Object.keys(login.value).length} vars)`);
		return login.value;
	}
	yield* logInfo(`[server] Falling back to app environment: ${shell}`);
	return null;
});
//#endregion
//#region src/main/lifecycle/environment.ts
var installContextMenu = gen(function* () {
	const { default: contextMenu } = yield* promise$1(() => import("electron-context-menu"));
	contextMenu({
		showSaveImageAs: true,
		showLookUpSelection: false,
		showSearchWithGoogle: false,
		labels: {
			get cut() {
				return nativeT("desktop.menu.cut");
			},
			get copy() {
				return nativeT("desktop.menu.copy");
			},
			get paste() {
				return nativeT("desktop.menu.paste");
			},
			get selectAll() {
				return nativeT("desktop.menu.selectAll");
			}
		},
		append: (_actions, params) => params.isEditable ? spellcheckMenuItems() : []
	});
});
var prepareApplicationEnvironment = gen(function* () {
	yield* loadSystemCertificates;
	yield* loadProxyEnvironment;
});
var preferApplicationEnvironment = gen(function* () {
	const shell = process.platform === "win32" ? null : getUserShell();
	const shellEnv = shell ? yield* loadShellEnv(shell) : null;
	yield* sync(() => {
		if (!shellEnv?.XDG_STATE_HOME) delete process.env.XDG_STATE_HOME;
		Object.assign(process.env, {
			...shellEnv,
			OPENCODE_EXPERIMENTAL_ICON_DISCOVERY: "true",
			OPENCODE_EXPERIMENTAL_FILEWATCHER: "true",
			OPENCODE_CLIENT: "desktop"
		});
	});
});
var prepareDesktop = gen(function* () {
	const path = yield* Path$1;
	const paths = yield* resolve$1;
	if (app.isPackaged || process.env.OPENCODE_DESKTOP_DISABLE_PROTOCOL_REGISTRATION !== "1") app.setAsDefaultProtocolClient("opencode");
	const runFork = runForkWith(yield* context());
	setProtocolReporter((level, message, data) => runFork(scoped("protocol", level === "error" ? logError(message, data) : logWarning(message, data))));
	registerRendererProtocol(paths.rendererRoot);
	setDockIcon(path, paths);
	applySpellcheck();
});
var loadProxyEnvironment = gen(function* () {
	yield* try_(() => {
		ensureLoopbackNoProxy();
		http.setGlobalProxyFromEnv();
	}).pipe(catch_((error) => logWarning("failed to load proxy environment", { error })));
});
var loadSystemCertificates = try_({
	try: () => {
		setDefaultCACertificates([.../* @__PURE__ */ new Set([...getCACertificates("default"), ...getCACertificates("system")])]);
	},
	catch: (error) => error
}).pipe(catch_((error) => logWarning("failed to load system certificates", { error })));
function ensureLoopbackNoProxy() {
	const noProxy = [...new Set([
		process.env.NO_PROXY,
		process.env.no_proxy,
		"127.0.0.1,localhost,::1"
	].flatMap((value) => (value ?? "").split(",").flatMap((entry) => entry.trim() || [])))].join(",");
	process.env.NO_PROXY = noProxy;
	process.env.no_proxy = noProxy;
}
//#endregion
//#region src/main/lifecycle/desktop-initialization.ts
var Service = class extends Service$9()("opencode/desktop/DesktopInitialization") {};
var layer = effect(Service, gen(function* () {
	const logging = yield* Service$8;
	yield* preferApplicationEnvironment;
	yield* forkScoped(prepareApplicationEnvironment.pipe(andThen(loadProxyEnvironment), andThen(logging.startNetwork)));
	yield* promise$1(() => app.whenReady());
	yield* prepareDesktop;
	marks.init = Date.now();
	return Service.of({ version: app.getVersion() });
}));
//#endregion
//#region src/main/desktop.ts
var desktop_exports = /* @__PURE__ */ __exportAll({});
marks.bundle = Date.now();
fn("Desktop.runIpc")(function* () {
	const lifecycle = yield* Service$4;
	const plugins = yield* Service$2;
	marks.layers = Date.now();
	yield* logInfo("layers ready", { marks });
	const ipc = yield* registerIpcHandlers;
	yield* forkScoped(plugins.start);
	if (lifecycle.restoreWindows().length) ipc.installMenu();
	yield* sleep("500 millis");
	yield* (yield* Service$8).startCrashReporter;
	yield* installContextMenu;
	yield* callback((resume) => {
		const quit = () => resume(void_);
		app.once("will-quit", quit);
		return sync(() => app.off("will-quit", quit));
	});
})().pipe(provide$1(layer$1), provide$1(layer$2), provide$1(layer$4), provide$1(layer), provide$1(layer$5), provide$1(merge$1(layer$12, layer$10)), scoped$1, runMain);
//#endregion
export { layer$10 as C, PluginsChanged as S, handleErrnoException as T, PluginAvailable as _, getLastFocusedWindow as a, PluginMenubarItemsChanged as b, isQuitting as c, formatNativeTemplate as d, nativeLocale as f, emitIpcEvent as g, onNativeTranslations as h, PluginError as i, keptScope as l, nativePluralCategory as m, refreshMenu as n, getMainWindows as o, nativeMessage as p, setMenubarProvider as r, onMainWindow as s, desktop_exports as t, plugin as u, PluginEvent as v, layer$12 as w, PluginState as x, PluginGuisChanged as y };
