import { $c as tapError, $o as addFinalizer, Ad as findErrorOption, As as flatMap, Bs as forkScoped, Bt as decodeUnknownOption, Ca as fromSetCookie, Cc as raceFirst, Cu as provide, D as Finite, Ec as retry, Et as Unknown, Fc as runSync, Gl as spaced, Gt as encodeSync, Gu as _await, Hl as exponential, Hs as gen, Kc as succeed, N as Json, Ns as fn, Qs as logWarning, Rs as forkDetach, Sa as empty$1, Sc as raceAllFirst, Ss as ensuring, Tg as hasProperty, U as NullOr, Ut as decodeUnknownSync, Vc as scoped, Vn as isSchemaError, Wl as min, Wm as Service, X as Record, Xc as sync, Xg as flow, Xt as fromJsonString, Yc as suspend, Zc as tap, Zo as acquireRelease, _c as promise, _u as effect, ac as matchCause, ar as optional, at as String$1, bc as provideService, bo as encode$1, cs as callback, da as fromInput, dl as void_, ed as make$1, el as timeout, fh as isNone, hh as match, jc as runPromise, lc as never, ls as catchCause, ml as withFiber, n_ as pipeArguments, nd as succeed$1, nl as tryPromise, o as ArraySchema, oh as fromNullishOr, or as optionalKey, ot as Struct, qg as constVoid, ra as fromInput$1, rg as Class, rl as try_, ss as cached, tc as map, ts as andThen, uc as onError, ws as fail$1, wt as Union, yl as zipWith, zg as isTagged } from "./Latch-oSncnOpo.js";
import { H as fromArray, K as fromQueue, St as unwrap, V as flatten, Yt as offerUnsafe, dt as runForEach, et as mapError, h as make$2, in as join$1, mt as succeed$2, q as fromReadableStream, st as run, tn as unbounded } from "./dist-DWveHAM-.js";
import { D as StatusCodeError, E as HttpClientError, O as TransportError, T as EncodeError, d as inspect, i as mapRequest, l as MaxBodySize, n as layerMergedContext, o as TypeId$1, r as make$3, t as HttpClient, u as TypeId, w as DecodeError, y as setHeaders } from "./HttpClient-CNGYnc6V.js";
import { ct as SessionID } from "./session-C4fzCy4h.js";
import { t as make$4 } from "./effect-Dj-xfPCk.js";
import { n as toArrayBuffer, r as fromWritable, t as fromReadable } from "./NodeStream-BV2blk9q.js";
import { a as FileID, c as Outcome, d as Tab, f as TabID, i as Definition, l as Ref, m as createRefs, p as TunnelTarget, r as Control, s as MAX_TEXT, u as TUNNEL_CHUNK_BYTES } from "./main-CHF0X1JO.js";
import { createRequire } from "node:module";
import electron, { nativeImage, net, session } from "electron";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Agent, createServer, request } from "node:http";
import { Duplex, Readable } from "node:stream";
import { gunzipSync, gzipSync } from "node:zlib";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/internal/http.js
var require = /*#__PURE__*/ createRequire(typeof __filename === "string" ? __filename : import.meta.url);
var http$1 = /*#__PURE__*/ require("node:http");
var https = /*#__PURE__*/ require("node:https");
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/NodeHttpIncomingMessage.js
/**
* Adapter base for exposing Node `http.IncomingMessage` values as Effect HTTP
* incoming messages.
*
* Server requests and Node client responses both arrive as Node readable
* streams with raw header objects, socket metadata, and one-shot body
* consumption. This module's `NodeHttpIncomingMessage` class keeps the original
* Node message available while presenting Effect's `HttpIncomingMessage` shape:
* typed headers, remote address lookup, stream access, and text, JSON,
* URL-encoded, and array-buffer body readers.
*
* @stability unstable
* @since 4.0.0
*/
var textDecoder = /*#__PURE__*/ new TextDecoder();
var formDecoder$1 = /*#__PURE__*/ new TextDecoder("utf-8", { ignoreBOM: true });
/**
* Adapts a Node `IncomingMessage` to Effect HTTP incoming messages.
*
* **When to use**
*
* Use to implement Node HTTP request or response adapters that expose the
* Effect HTTP incoming-message interface.
*
* **Details**
*
* The adapter exposes headers, remote address, stream access, and cached body
* decoders. Subclasses provide the error mapping for unknown Node errors.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var NodeHttpIncomingMessage = class extends Class {
	/**
	* Marks this value as an HTTP incoming message for runtime guards.
	*
	* @since 4.0.0
	*/
	[TypeId];
	source;
	onError;
	remoteAddressOverride;
	destroyOnOverflow = true;
	closeOnDone = true;
	constructor(source, onError, remoteAddressOverride) {
		super();
		this[TypeId] = TypeId;
		this.source = source;
		this.onError = onError;
		this.remoteAddressOverride = remoteAddressOverride;
	}
	get headers() {
		return fromInput(this.source.headers);
	}
	get remoteAddress() {
		return this.remoteAddressOverride ?? fromNullishOr(this.source.socket?.remoteAddress);
	}
	textEffect;
	get text() {
		if (this.textEffect) return this.textEffect;
		this.textEffect = map(this.arrayBuffer, (_) => textDecoder.decode(_));
		return this.textEffect;
	}
	get textUnsafe() {
		return runSync(this.text);
	}
	get json() {
		return flatMap(this.text, (text) => try_({
			try: () => text === "" ? null : JSON.parse(text),
			catch: this.onError
		}));
	}
	get jsonUnsafe() {
		return runSync(this.json);
	}
	get urlParamsBody() {
		return flatMap(this.arrayBuffer, (bytes) => try_({
			try: () => fromInput$1(new URLSearchParams(formDecoder$1.decode(bytes).replace(/^\?/, "%3F"))),
			catch: this.onError
		}));
	}
	/**
	* The readable the body is read from, `source` unless a subclass reads the
	* body from elsewhere.
	*/
	get bodySource() {
		return this.source;
	}
	get stream() {
		return fromReadable({
			evaluate: () => this.bodySource,
			onError: this.onError,
			closeOnDone: this.closeOnDone
		});
	}
	arrayBufferEffect;
	get arrayBuffer() {
		if (this.arrayBufferEffect) return this.arrayBufferEffect;
		this.arrayBufferEffect = withFiber((fiber) => toArrayBuffer(() => this.bodySource, {
			onError: this.onError,
			destroyOnOverflow: this.destroyOnOverflow,
			maxBytes: fiber.getRef(MaxBodySize)
		})).pipe(cached, runSync);
		this.textEffect = map(this.arrayBufferEffect, (_) => textDecoder.decode(_));
		return this.arrayBufferEffect;
	}
};
Service()("@effect/platform-node/NodeHttpClient/Dispatcher");
var loadUpgrade = /*#__PURE__*/ promise(() => import("./upgrade-CltUOwPT.js"));
var takeOver = (conn, head, signal) => {
	if (head !== void 0 && head.length > 0) conn.unshift(head);
	conn.on("error", constVoid);
	if (signal.aborted) conn.destroy();
	else {
		const onAbort = () => conn.destroy();
		signal.addEventListener("abort", onAbort, { once: true });
		conn.once("close", () => signal.removeEventListener("abort", onAbort));
	}
	return conn;
};
var upgradeSocket = (response, upgraded) => {
	if (upgraded !== void 0) return flatMap(loadUpgrade, (_) => _.toSocket(upgraded));
	return fail$1(new HttpClientError({ reason: response.status === 101 ? new TransportError({
		request: response.request,
		description: "the runtime did not hand over the connection of the upgrade"
	}) : new StatusCodeError({
		request: response.request,
		response,
		description: "expected 101 Switching Protocols"
	}) }));
};
/**
* Service tag for the paired Node `http` and `https` agents used by the
* node:http-backed HTTP client.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var HttpAgent = class extends Service()("@effect/platform-node/NodeHttpClient/HttpAgent") {};
/**
* Acquires Node `http` and `https` agents with the supplied options and
* destroys both agents when the enclosing scope is finalized.
*
* @stability unstable
* @category resource management
* @since 4.0.0
*/
var makeAgent = (options) => zipWith(acquireRelease(sync(() => new http$1.Agent(options)), (agent) => sync(() => agent.destroy())), acquireRelease(sync(() => new https.Agent(options)), (agent) => sync(() => agent.destroy())), (http, https) => ({
	http,
	https
}));
/**
* Provides the `HttpAgent` service using default scoped Node `http` and
* `https` agents.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layerAgent = /*#__PURE__*/ (/* @__PURE__ */ flow(makeAgent, /*#__PURE__*/ effect(HttpAgent)))();
/**
* Creates an `HttpClient` backed by Node `http` and `https`, using the
* current `HttpAgent`, streaming request bodies, and wrapping Node responses
* as `HttpClientResponse` values.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var makeNodeHttp = /*#__PURE__*/ gen(function* () {
	const agent = yield* HttpAgent;
	return make$3((request, url, signal) => {
		const nodeRequest = url.protocol === "https:" ? https.request(url, {
			agent: agent.https,
			method: request.method,
			headers: request.headers,
			signal
		}) : http$1.request(url, {
			agent: agent.http,
			method: request.method,
			headers: request.headers,
			signal
		});
		return sendBody(nodeRequest, request, request.body).pipe(onError(() => sync(() => nodeRequest.destroy())), forkDetach, flatMap((upload) => {
			const stopUpload = () => upload.interruptUnsafe();
			nodeRequest.once("close", stopUpload);
			return raceFirst(waitForResponse(nodeRequest, request, signal), join$1(upload).pipe(andThen(never))).pipe(map((result) => {
				result[0].once("close", stopUpload);
				return result;
			}));
		}), onError(() => sync(() => nodeRequest.destroy())), map(([response, upgraded]) => new NodeHttpResponse(request, response, url.href.split("#")[0], upgraded)));
	});
});
var sendBody = (nodeRequest, request, body) => suspend(() => {
	switch (body._tag) {
		case "Empty":
			nodeRequest.end();
			return waitForFinish(nodeRequest, request);
		case "Uint8Array":
		case "Raw":
			nodeRequest.end(body.body);
			return waitForFinish(nodeRequest, request);
		case "FormData": {
			const { contentType, stream } = formDataBody(body.formData, request);
			nodeRequest.setHeader("content-type", contentType);
			return sendStream(nodeRequest, request, stream);
		}
		case "Stream": return sendStream(nodeRequest, request, mapError(body.stream, (cause) => new HttpClientError({ reason: new EncodeError({
			request,
			cause
		}) })));
	}
});
var sendStream = (nodeRequest, request, stream) => run(stream, fromWritable({
	evaluate: () => nodeRequest,
	endOnDone: false,
	onError: (cause) => new HttpClientError({ reason: new TransportError({
		request,
		cause
	}) })
})).pipe(andThen(() => {
	nodeRequest.end();
	return waitForFinish(nodeRequest, request);
}));
/**
* Encodes form data as multipart with the global `Response`, so the encoding
* comes from the runtime instead of the external undici package.
*
* Some Node.js versions read every file eagerly when encoding and never report
* read failures. Files are therefore encoded as empty placeholders and their
* contents are streamed into the placeholder parts.
*/
var formDataBody = (formData, request) => {
	const transportError = (cause) => new HttpClientError({ reason: new TransportError({
		request,
		cause
	}) });
	const entries = Array.from(formData);
	const placeholders = new globalThis.FormData();
	for (const [key, value] of entries) if (typeof value === "string") placeholders.append(key, value);
	else placeholders.append(key, new Blob([], { type: value.type }), value.name);
	const response = new globalThis.Response(placeholders);
	const contentType = response.headers.get("content-type");
	const delimiter = `--${contentType.slice(contentType.indexOf("boundary=") + 9)}`;
	return {
		contentType,
		stream: unwrap(map(promise(() => response.arrayBuffer()), (buffer) => {
			const encoded = Buffer.from(buffer);
			const streams = [];
			let start = 0;
			let delimiterAt = 0;
			for (const [, value] of entries) {
				delimiterAt = encoded.indexOf(delimiter, delimiterAt + delimiter.length);
				if (typeof value === "string") continue;
				const end = delimiterAt - 2;
				streams.push(succeed$2(encoded.subarray(start, end)), unwrap(map(try_({
					try: () => value.stream(),
					catch: transportError
				}), (readable) => fromReadableStream({
					evaluate: () => readable,
					onError: transportError
				}))));
				start = end;
			}
			streams.push(succeed$2(encoded.subarray(start)));
			return flatten(fromArray(streams));
		}))
	};
};
var waitForResponse = (nodeRequest, request, signal) => callback((resume) => {
	function onError(cause) {
		resume(fail$1(new HttpClientError({ reason: new TransportError({
			request,
			cause
		}) })));
	}
	nodeRequest.on("error", onError);
	function onResponse(response) {
		nodeRequest.off("error", onError);
		resume(succeed([response]));
	}
	nodeRequest.on("response", onResponse);
	function onUpgrade(response, socket, head) {
		nodeRequest.off("error", onError);
		resume(succeed([response, takeOver(socket, head, signal)]));
	}
	nodeRequest.on("upgrade", onUpgrade);
	return sync(() => {
		nodeRequest.off("error", onError);
		nodeRequest.off("upgrade", onUpgrade);
		nodeRequest.off("response", onResponse);
	});
});
var waitForFinish = (nodeRequest, request) => callback((resume) => {
	function onError(cause) {
		resume(fail$1(new HttpClientError({ reason: new TransportError({
			request,
			cause
		}) })));
	}
	nodeRequest.once("error", onError);
	function onFinish() {
		nodeRequest.off("error", onError);
		resume(void_);
	}
	nodeRequest.once("finish", onFinish);
	return sync(() => {
		nodeRequest.off("error", onError);
		nodeRequest.off("finish", onFinish);
	});
});
var NodeHttpResponse = class extends NodeHttpIncomingMessage {
	[TypeId$1];
	request;
	url;
	upgraded;
	constructor(request, source, url, upgraded) {
		super(source, (cause) => new HttpClientError({ reason: new DecodeError({
			request,
			response: this,
			cause
		}) }));
		this[TypeId$1] = TypeId$1;
		this.request = request;
		this.url = url;
		this.upgraded = upgraded;
	}
	get status() {
		return this.source.statusCode;
	}
	get upgrade() {
		return upgradeSocket(this, this.upgraded);
	}
	cachedCookies;
	get cookies() {
		if (this.cachedCookies !== void 0) return this.cachedCookies;
		const header = this.source.headers["set-cookie"];
		return this.cachedCookies = header ? fromSetCookie(header) : empty$1;
	}
	get formData() {
		return tryPromise({
			try: () => {
				const init = { headers: new globalThis.Headers(this.source.headers) };
				if (this.source.statusCode) init.status = this.source.statusCode;
				if (this.source.statusMessage) init.statusText = this.source.statusMessage;
				return new globalThis.Response(Readable.toWeb(this.source), init).formData();
			},
			catch: this.onError
		});
	}
	toJSON() {
		return inspect(this, {
			_id: "effect/http/HttpClientResponse",
			request: this.request.toJSON(),
			status: this.status
		});
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/**
* Provides a node:http-backed `HttpClient` together with default scoped Node
* `http` and `https` agents.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layerNodeHttp = /*#__PURE__*/ provide(/* @__PURE__ */ layerMergedContext(makeNodeHttp), layerAgent);
//#endregion
//#region ../gui-plugins/src/browser/errors.ts
function protocolError(method, error) {
	const detail = message(error);
	const recovery = method === "DOM.setFileInputFiles" && /not.*file input/i.test(detail) ? "Target is not a file input. Call browser.snapshot({tabID}) and choose an input[type=file] ref for browser.files.upload, or use browser.files.drop for a drop area." : method === "Runtime.callFunctionOn" && /not evaluate to a function/i.test(detail) ? "With ref, browser.evaluate needs a function that receives the element, for example (element) => element.textContent." : /(?:node|object).*(?:not found|not exist)|(?:find|resolve).*(?:node|object)|detached/i.test(detail) ? "The element may have detached. Call browser.snapshot({tabID}) and use a fresh ref from that tab." : /context.*(?:destroyed|not found)|find.*context|session.*not found/i.test(detail) ? "The document or frame changed. Call browser.frames({tabID}) and browser.snapshot({tabID}); use current frame IDs and refs." : /wasn't found|method not found|not implemented|not allowed/i.test(detail) ? "This Chromium target does not support or allow the operation. Check desktop/plugin compatibility and report it; do not retry unchanged or disable browser security." : "Inspect browser.tabs.list({}) and the target tab before deciding to retry; a partially completed action is not automatically safe to repeat.";
	return new Error(`${recovery} Chromium command ${method} failed: ${detail}`, { cause: error });
}
function browserFailure(action, error) {
	const detail = message(error, 1700);
	const network = [
		"tabs.open",
		"navigate",
		"back",
		"forward",
		"reload"
	].includes(action.type) ? detail.match(/\bERR_[A-Z_]+\b/)?.[0] : void 0;
	const hint = network === "ERR_CONNECTION_REFUSED" ? "The browser could not connect to the site. Check its hostname/port on the connected server. localhost means that server, not the desktop." : network === "ERR_NAME_NOT_RESOLVED" ? "The connected server could not resolve the hostname. Check the URL spelling and the server's DNS/network connection." : network?.startsWith("ERR_CERT_") || network?.startsWith("ERR_SSL_") ? "The desktop rejected the site's TLS connection. Ask the user to fix the certificate or trust configuration; do not bypass certificate checks." : network === "ERR_ABORTED" ? "Navigation was interrupted or became a download. Inspect browser.tabs.list({}) and browser.files.list({tabID}) before deciding to navigate again." : network ? "The site failed to load through the connected server. Check its URL/network and the OC2 connection before retrying; inspect the current tab first." : action.type === "screenshot" && /UnknownVizError|capture.*(?:failed|unavailable)/i.test(detail) ? "Chromium could not capture a rendered frame. Call browser.tabs.focus({tabID}) and keep the desktop window visible. If it is already visible, report the capture failure instead of repeating it unchanged." : void 0;
	return {
		type: "failure",
		code: network ? "navigation_failed" : "operation_failed",
		message: `browser.${action.type} failed. ${hint ? `${hint} Details: ${detail.slice(0, 400)}` : detail}`.slice(0, 2048)
	};
}
function message(error, limit = 400) {
	return (error instanceof Error ? error.message : String(error)).slice(0, limit);
}
//#endregion
//#region ../gui-plugins/src/browser/cdp.ts
function createCdp(contents) {
	const listeners = /* @__PURE__ */ new Map();
	const sessions = /* @__PURE__ */ new Set([""]);
	const receive = (_event, name, params, sessionID) => {
		if (!sessions.has(sessionID ?? "")) return;
		if (name === "Target.attachedToTarget") {
			const event = params;
			if (event.targetInfo.type === "iframe") sessions.add(event.sessionId);
		}
		if (name === "Target.detachedFromTarget") sessions.delete(params.sessionId);
		listeners.get(name)?.forEach((callback) => callback(params, sessionID || void 0));
	};
	contents.debugger.on("message", receive);
	return {
		async send(method, params = {}, sessionID) {
			if (contents.isDestroyed()) throw new Error("Browser tab was closed. Call browser.tabs.list({}) and choose an existing tabID, or browser.tabs.open({}) if no tabs remain.");
			try {
				if (!contents.debugger.isAttached()) contents.debugger.attach("1.3");
				return await contents.debugger.sendCommand(method, params, sessionID);
			} catch (error) {
				throw protocolError(method, error);
			}
		},
		on(method, callback) {
			const handler = (params, sessionID) => callback(params, sessionID);
			const handlers = listeners.get(method) ?? /* @__PURE__ */ new Set();
			handlers.add(handler);
			listeners.set(method, handlers);
			return () => {
				handlers.delete(handler);
				if (!handlers.size) listeners.delete(method);
			};
		},
		dispose() {
			contents.debugger.off("message", receive);
			listeners.clear();
		}
	};
}
function abortError(signal) {
	if (signal.aborted) throw new Error("Browser operation was cancelled. Inspect the tab before deciding to repeat an action; cancellation does not undo changes already made.");
}
async function waitFor(check, signal, timeoutMs = 1e4) {
	const deadline = Date.now() + timeoutMs;
	const timeout = () => /* @__PURE__ */ new Error(`Condition was not met within ${timeoutMs} ms.`);
	while (true) {
		abortError(signal);
		const remaining = deadline - Date.now();
		if (remaining <= 0) throw timeout();
		let timer;
		const expired = new Promise((_, reject) => {
			timer = setTimeout(() => reject(timeout()), remaining);
		});
		if (await Promise.race([check(), expired]).finally(() => clearTimeout(timer))) return;
		await new Promise((resolve) => setTimeout(resolve, 50));
	}
}
//#endregion
//#region ../gui-plugins/src/browser/files.ts
function createBrowserFiles(source) {
	const directory = path.join(tmpdir(), `opencode-browser-client-${crypto.randomUUID()}`);
	const files = /* @__PURE__ */ new Map();
	const ready = mkdir(directory, {
		recursive: true,
		mode: 448
	});
	return {
		directory,
		ready,
		list: () => Array.from(files.values()).map(({ path: _path, resources: _resources, ...file }) => file),
		add(name, mime, resources = source()) {
			const id = FileID.make(`file_${crypto.randomUUID()}`);
			const target = path.join(directory, id);
			mkdirSync(target, {
				recursive: true,
				mode: 448
			});
			const file = {
				id,
				name: name.slice(0, 2048),
				mime,
				bytes: 0,
				state: "pending",
				path: path.join(target, name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/[. ]+$/, "").slice(-120) || "file"),
				resources: [...new Set(resources)].sort()
			};
			files.set(id, file);
			return file;
		},
		async save(name, mime, data, resources = source()) {
			if (data.byteLength > 5242880) throw new Error("Capture exceeds the 5 MiB transfer limit. Reduce screenshot maxWidth/quality or trace duration; for a heap snapshot, use a smaller page/test case. Do not retry an identical capture.");
			await ready;
			const file = this.add(name, mime, resources);
			await writeFile(file.path, data, { mode: 384 }).catch((error) => {
				file.state = "failed";
				throw new Error("Cannot write the capture on the desktop. Ask the user to check desktop temporary-directory access and free space before retrying.", { cause: error });
			});
			file.bytes = data.byteLength;
			file.state = "completed";
			return file.id;
		},
		get(id) {
			const file = files.get(id);
			if (!file) throw new Error("File ID is not retained in this tab. Call browser.files.list({tabID}) and use an exact returned fileID from the same tab, not a server path or request ID.");
			if (file.state === "pending") throw new Error("File is still being downloaded or captured. Check browser.files.list({tabID}) again and wait for state completed; do not start a duplicate download.");
			if (file.state === "failed") throw new Error("The download or capture failed, so this file cannot be read. Inspect browser.console and browser.network.list for the cause before deciding to start it again.");
			return file;
		},
		async transfer(id, authorized) {
			const file = this.get(id);
			if (authorized && file.resources.some((url) => !authorized.includes(url))) throw new Error("Capture source changed before export. Inspect the tab and request the file again to check its source permissions; no bytes were exported.");
			if ((await stat(file.path).catch((error) => {
				throw unavailableFile(error);
			})).size > 5242880) throw new Error("File exceeds the 5 MiB transfer limit. Choose a smaller completed file; repeating browser.files.get for this file will not help.");
			const data = await readFile(file.path).catch((error) => {
				throw unavailableFile(error);
			});
			return {
				id,
				name: file.name,
				mime: file.mime,
				data: new Uint8Array(data)
			};
		},
		dispose: () => ready.then(() => rm(directory, {
			recursive: true,
			force: true
		}))
	};
}
function unavailableFile(error) {
	return new Error("The retained file cannot be read on the desktop. Its temporary copy may have been removed. Use an already exported server-local path if available, or deliberately create a new capture.", { cause: error });
}
var EMPTY = {
	hops: [],
	requestWire: [],
	responseWire: []
};
/**
* Returns `chain` itself when the event does not apply, and undefined when the request ID has
* nothing left worth keeping.
*/
function transitionChain(chain, event) {
	const current = chain ?? EMPTY;
	const latest = current.hops.at(-1);
	switch (event.type) {
		case "request": {
			const redirect = event.event.redirectResponse;
			const hops = latest && redirect ? replaceLast(current.hops, redirected(latest, redirect, event.event)) : supersede(current.hops, event.event.timestamp);
			return append({
				...current,
				hops
			}, {
				id: event.id,
				nativeID: event.event.requestId,
				sessionID: event.sessionID,
				url: event.event.request.url.slice(0, 16384),
				method: event.event.request.method,
				resourceType: resourceType((event.event.type ?? "other").toLowerCase()),
				timestampMs: event.event.wallTime * 1e3,
				request: {
					headers: event.event.request.headers,
					hasPostData: event.event.request.hasPostData,
					postData: event.event.request.postData
				},
				started: event.event.timestamp
			});
		}
		case "ws.created": return append({
			...current,
			hops: supersede(current.hops, void 0)
		}, {
			id: event.id,
			nativeID: event.event.requestId,
			sessionID: event.sessionID,
			url: event.event.url.slice(0, 16384),
			method: "GET",
			resourceType: "websocket",
			timestampMs: event.wallTime * 1e3,
			request: {
				headers: {},
				hasPostData: false
			},
			started: void 0
		});
		case "request.extra": {
			const index = current.hops.findIndex((hop) => hop.wire === "both" || hop.wire === "request");
			if (index === -1) {
				if (current.requestWire.length >= 16) return chain;
				return {
					...current,
					requestWire: [...current.requestWire, event.headers]
				};
			}
			return {
				...current,
				hops: replaceAt(current.hops, index, requestWire(current.hops[index], event.headers))
			};
		}
		case "response.extra": return responseExtra(chain, current, event.wire);
		case "response": {
			if (!latest || latest.phase.status !== "pending") return chain;
			const headers = trimHeaders({
				...event.event.response.headers,
				...latest.response?.headers
			});
			return {
				...current,
				hops: replaceLast(current.hops, {
					...latest,
					response: {
						mimeType: event.event.response.mimeType,
						headers: headers.headers
					},
					headersTruncated: latest.headersTruncated || headers.truncated,
					statusCode: latest.statusCode ?? event.event.response.status,
					wire: event.event.hasExtraInfo ? latest.wire : "none"
				})
			};
		}
		case "ws.request": {
			if (!latest || latest.resourceType !== "websocket" || !open(latest)) return chain;
			const headers = trimHeaders({
				...event.event.request.headers,
				...latest.request.headers
			});
			return {
				...current,
				hops: replaceLast(current.hops, {
					...latest,
					request: {
						...latest.request,
						headers: headers.headers
					},
					headersTruncated: latest.headersTruncated || headers.truncated,
					timestampMs: event.event.wallTime * 1e3,
					phase: {
						status: "pending",
						started: event.event.timestamp
					}
				})
			};
		}
		case "ws.response": {
			if (!latest || latest.resourceType !== "websocket" || !open(latest)) return chain;
			const headers = trimHeaders({
				...event.event.response.headers,
				...latest.response?.headers
			});
			return {
				...current,
				hops: replaceLast(current.hops, {
					...latest,
					response: {
						mimeType: latest.response?.mimeType ?? "",
						headers: headers.headers
					},
					headersTruncated: latest.headersTruncated || headers.truncated,
					statusCode: latest.statusCode ?? event.event.response.status,
					phase: {
						status: "completed",
						durationMs: elapsed(latest.phase, event.event.timestamp)
					}
				})
			};
		}
		case "ws.error":
		case "ws.closed":
			if (!latest || latest.resourceType !== "websocket" || !open(latest)) return chain;
			return {
				...current,
				hops: replaceLast(current.hops, fail(latest, event.timestamp, event.type === "ws.error" ? event.message : "Closed before the handshake completed"))
			};
		case "finished":
		case "failed":
			if (!latest) return void 0;
			if (!open(latest)) return chain;
			return {
				...current,
				hops: replaceLast(current.hops, event.type === "failed" ? fail(latest, event.timestamp, event.errorText) : {
					...latest,
					phase: {
						status: "completed",
						durationMs: elapsed(latest.phase, event.timestamp)
					}
				})
			};
		case "detached":
			if (!latest) return void 0;
			if (current.hops.every((hop) => hop.wire === "none" && !open(hop)) && !current.requestWire.length && !current.responseWire.length) return chain;
			return {
				hops: current.hops.map((hop) => open(hop) ? {
					...hop,
					wire: "none",
					phase: {
						status: "failed",
						durationMs: 0,
						failure: "Frame detached before request completed"
					}
				} : hop.wire === "none" ? hop : {
					...hop,
					wire: "none"
				}),
				requestWire: [],
				responseWire: []
			};
	}
}
/** Removes an evicted hop; undefined when the request ID has no hops left. */
function evictHop(chain, id) {
	const hops = chain.hops.filter((hop) => hop.id !== id);
	return hops.length ? {
		...chain,
		hops
	} : void 0;
}
/** The hop as the browser tools report it. */
function networkRequest(hop) {
	const base = {
		id: hop.id,
		url: hop.url,
		method: hop.method,
		resourceType: hop.resourceType,
		timestampMs: hop.timestampMs,
		statusCode: hop.statusCode
	};
	switch (hop.phase.status) {
		case "connecting":
		case "pending": return {
			...base,
			state: "pending"
		};
		case "redirected":
		case "completed": return {
			...base,
			state: "completed",
			durationMs: hop.phase.durationMs
		};
		case "failed": return {
			...base,
			state: "failed",
			durationMs: hop.phase.durationMs,
			failure: hop.phase.failure
		};
	}
}
/** The captured request body, bounded to `max` characters. */
function requestBody(hop, includeBody, max) {
	if (!includeBody) return { state: "notRequested" };
	if (hop.request.postData !== void 0) return {
		state: "text",
		text: hop.request.postData.slice(0, max),
		truncated: hop.postDataTruncated || hop.request.postData.length > max
	};
	return hop.request.hasPostData ? {
		state: "unavailable",
		reason: "notCaptured"
	} : { state: "empty" };
}
/** The response body when it is known without asking Chromium, else `fetch`. */
function responseBody(hop, includeBody) {
	if (!includeBody) return { state: "notRequested" };
	if (open(hop)) return { state: "pending" };
	if (hop.phase.status === "redirected" || !hop.response || hop.resourceType === "websocket") return {
		state: "unavailable",
		reason: "notCaptured"
	};
	if (!/^(text\/|application\/(json|.*\+json|javascript|xml|.*\+xml|x-www-form-urlencoded))/i.test(hop.response.mimeType)) return {
		state: "unavailable",
		reason: "binary"
	};
	return "fetch";
}
function responseExtra(chain, current, wire) {
	const index = current.hops.findIndex(awaitsResponse);
	if (index === -1) {
		if (current.responseWire.length >= 16) return chain;
		return {
			...current,
			responseWire: [...current.responseWire, wire]
		};
	}
	const later = current.hops.findIndex((hop, at) => at > index && hop.phase.status !== "redirected" && awaitsResponse(hop));
	if (current.hops[index].phase.status === "redirected" && !isRedirect(wire.statusCode) && later !== -1) return {
		...current,
		hops: current.hops.map((hop, at) => at === later ? responseWire(hop, wire) : at >= index && at < later ? {
			...hop,
			wire: "none"
		} : hop)
	};
	return {
		...current,
		hops: replaceAt(current.hops, index, responseWire(current.hops[index], wire))
	};
}
function append(chain, input) {
	const headers = trimHeaders(input.request.headers);
	const created = {
		id: input.id,
		nativeID: input.nativeID,
		sessionID: input.sessionID,
		url: input.url,
		method: input.method,
		resourceType: input.resourceType,
		timestampMs: input.timestampMs,
		statusCode: void 0,
		request: {
			...input.request,
			headers: headers.headers,
			postData: input.request.postData?.slice(0, 2e4)
		},
		response: void 0,
		headersTruncated: headers.truncated,
		postDataTruncated: (input.request.postData?.length ?? 0) > 2e4,
		wire: "both",
		phase: input.started === void 0 ? { status: "connecting" } : {
			status: "pending",
			started: input.started
		}
	};
	const requested = chain.requestWire.length ? requestWire(created, chain.requestWire[0]) : created;
	const hop = chain.responseWire.length ? responseWire(requested, chain.responseWire[0]) : requested;
	return {
		hops: [...chain.hops, hop],
		requestWire: chain.requestWire.slice(1),
		responseWire: chain.responseWire.slice(1)
	};
}
/** The previous hop when the renderer reused its request ID without a redirect: it will hear nothing more. */
function supersede(hops, timestamp) {
	const latest = hops.at(-1);
	if (!latest || latest.wire === "none" && !open(latest)) return hops;
	if (!open(latest)) return replaceLast(hops, {
		...latest,
		wire: "none"
	});
	return replaceLast(hops, {
		...fail(latest, timestamp, "Superseded by a new request"),
		wire: "none"
	});
}
function redirected(hop, redirect, event) {
	const headers = trimHeaders({
		...redirect.headers,
		...hop.response?.headers
	});
	return {
		...hop,
		response: {
			mimeType: redirect.mimeType,
			headers: headers.headers
		},
		headersTruncated: hop.headersTruncated || headers.truncated,
		statusCode: hop.statusCode ?? redirect.status,
		wire: event.redirectHasExtraInfo ? hop.wire : "none",
		phase: {
			status: "redirected",
			durationMs: elapsed(hop.phase, event.timestamp)
		}
	};
}
function requestWire(hop, headers) {
	const trimmed = trimHeaders({
		...hop.request.headers,
		...headers
	});
	return {
		...hop,
		request: {
			...hop.request,
			headers: trimmed.headers
		},
		headersTruncated: hop.headersTruncated || trimmed.truncated,
		wire: hop.wire === "both" ? "response" : "none"
	};
}
function responseWire(hop, wire) {
	const trimmed = trimHeaders({
		...hop.response?.headers,
		...wire.headers
	});
	return {
		...hop,
		response: {
			mimeType: hop.response?.mimeType ?? "",
			headers: trimmed.headers
		},
		headersTruncated: hop.headersTruncated || trimmed.truncated,
		statusCode: wire.statusCode,
		wire: hop.wire === "both" ? "request" : "none"
	};
}
function fail(hop, timestamp, failure) {
	return {
		...hop,
		phase: {
			status: "failed",
			durationMs: elapsed(hop.phase, timestamp),
			failure: failure.slice(0, 2048)
		}
	};
}
function open(hop) {
	return hop.phase.status === "connecting" || hop.phase.status === "pending";
}
function awaitsResponse(hop) {
	return hop.wire === "both" || hop.wire === "response";
}
function isRedirect(statusCode) {
	return statusCode >= 300 && statusCode < 400;
}
/** A WebSocket's creation carries no monotonic time, so superseding one by it reports 0. */
function elapsed(phase, timestamp) {
	return phase.status === "pending" && timestamp !== void 0 ? Math.max(0, (timestamp - phase.started) * 1e3) : 0;
}
function replaceLast(hops, hop) {
	return replaceAt(hops, hops.length - 1, hop);
}
function replaceAt(hops, index, hop) {
	return hops.map((item, at) => at === index ? hop : item);
}
function resourceType(type) {
	switch (type) {
		case "document":
		case "stylesheet":
		case "image":
		case "media":
		case "font":
		case "script":
		case "xhr":
		case "fetch":
		case "eventsource":
		case "websocket":
		case "manifest": return type;
		default: return "other";
	}
}
var redacted = [
	"cookie",
	"set-cookie",
	"authorization",
	"proxy-authorization"
];
function trimHeaders(headers) {
	const entries = Object.entries(headers);
	const kept = [];
	let size = 0;
	let truncated = entries.length > 100;
	for (const [key, value] of entries.slice(0, 100)) {
		const name = key.toLowerCase().slice(0, 2048);
		const text = redacted.includes(name) ? "<redacted>" : String(value);
		const remaining = Math.max(0, 16e3 - size - name.length);
		if (!remaining) {
			truncated = true;
			break;
		}
		const bounded = text.slice(0, Math.min(2e3, remaining));
		truncated ||= bounded.length < text.length || name.length < key.length;
		kept.push([name, bounded]);
		size += name.length + bounded.length;
	}
	return {
		headers: Object.fromEntries(kept),
		truncated
	};
}
//#endregion
//#region ../gui-plugins/src/browser/diagnostics.ts
var levels = [
	"debug",
	"info",
	"warning",
	"error"
];
function createDiagnostics(cdp) {
	const messages = [];
	const requests = /* @__PURE__ */ new Map();
	const chains = /* @__PURE__ */ new Map();
	const stashed = /* @__PURE__ */ new Set();
	const scope = crypto.randomUUID();
	let sequence = 0;
	let droppedMessages = 0;
	let droppedRequests = 0;
	const add = (level, text, timestampMs, source) => {
		const entry = {
			id: `${scope}:${++sequence}`,
			timestampMs,
			level,
			text: text.slice(0, 2e3),
			textTruncated: text.length > 2e3
		};
		messages.push(source ? {
			...entry,
			source
		} : entry);
		if (messages.length > 500) {
			messages.shift();
			droppedMessages++;
		}
	};
	const apply = (key, event) => {
		const previous = chains.get(key);
		const next = transitionChain(previous, event);
		if (next === previous) return;
		if (!next) {
			chains.delete(key);
			stashed.delete(key);
			return;
		}
		chains.set(key, next);
		if (!next.hops.length) {
			stashed.add(key);
			const oldest = stashed.values().next().value;
			if (stashed.size > 128 && oldest !== void 0) {
				stashed.delete(oldest);
				chains.delete(oldest);
			}
			return;
		}
		stashed.delete(key);
		next.hops.forEach((hop, index) => {
			if (previous?.hops[index] !== hop) requests.set(hop.id, hop);
		});
		while (requests.size > 500) {
			const first = requests.values().next().value;
			if (!first) break;
			requests.delete(first.id);
			droppedRequests++;
			const firstKey = `${first.sessionID ?? ""}:${first.nativeID}`;
			const chain = chains.get(firstKey);
			const rest = chain && evictHop(chain, first.id);
			if (rest) chains.set(firstKey, rest);
			if (!rest) chains.delete(firstKey);
		}
	};
	cdp.on("Runtime.consoleAPICalled", (event) => {
		const source = event.stackTrace?.callFrames[0];
		add(event.type === "error" || event.type === "assert" ? "error" : event.type === "warning" ? "warning" : event.type === "debug" ? "debug" : "info", event.args.map((arg) => arg.type === "string" ? String(arg.value) : arg.value !== void 0 ? JSON.stringify(arg.value) : arg.description ?? arg.unserializableValue ?? arg.type).join(" "), event.timestamp, source ? {
			url: source.url.slice(0, MAX_TEXT),
			line: source.lineNumber + 1,
			column: source.columnNumber + 1
		} : void 0);
	});
	cdp.on("Log.entryAdded", (event) => {
		const entry = event.entry;
		add(entry.level === "verbose" ? "debug" : entry.level, entry.text, entry.timestamp, entry.url ? {
			url: entry.url.slice(0, MAX_TEXT),
			line: (entry.lineNumber ?? 0) + 1,
			column: 1
		} : void 0);
	});
	cdp.on("Runtime.exceptionThrown", (event) => {
		const error = event.exceptionDetails;
		add("error", error.exception?.description ?? error.text, event.timestamp, error.url ? {
			url: error.url,
			line: error.lineNumber + 1,
			column: error.columnNumber + 1
		} : void 0);
	});
	cdp.on("Network.requestWillBeSent", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "request",
		id: `${scope}:${++sequence}`,
		sessionID,
		event
	}));
	cdp.on("Network.requestWillBeSentExtraInfo", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "request.extra",
		headers: event.headers
	}));
	cdp.on("Network.responseReceived", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "response",
		event
	}));
	cdp.on("Network.responseReceivedExtraInfo", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "response.extra",
		wire: {
			headers: event.headers,
			statusCode: event.statusCode
		}
	}));
	cdp.on("Network.webSocketCreated", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "ws.created",
		id: `${scope}:${++sequence}`,
		sessionID,
		event,
		wallTime: Date.now() / 1e3
	}));
	cdp.on("Network.webSocketWillSendHandshakeRequest", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "ws.request",
		event
	}));
	cdp.on("Network.webSocketHandshakeResponseReceived", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "ws.response",
		event
	}));
	cdp.on("Network.webSocketFrameError", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "ws.error",
		timestamp: event.timestamp,
		message: event.errorMessage
	}));
	cdp.on("Network.webSocketClosed", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "ws.closed",
		timestamp: event.timestamp
	}));
	cdp.on("Network.loadingFinished", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "finished",
		timestamp: event.timestamp
	}));
	cdp.on("Network.loadingFailed", (event, sessionID) => apply(`${sessionID ?? ""}:${event.requestId}`, {
		type: "failed",
		timestamp: event.timestamp,
		errorText: event.errorText
	}));
	cdp.on("Target.detachedFromTarget", (event) => Array.from(chains.keys()).filter((key) => key.startsWith(`${event.sessionId}:`)).forEach((key) => apply(key, { type: "detached" })));
	const retained = (id, message) => {
		const hop = requests.get(id);
		if (!hop) throw new Error(message);
		return hop;
	};
	return {
		clear() {
			messages.length = 0;
			requests.clear();
			chains.clear();
			stashed.clear();
			droppedMessages = 0;
			droppedRequests = 0;
		},
		async enable(sessionID) {
			await cdp.send("Runtime.enable", {}, sessionID);
			await cdp.send("Log.enable", {}, sessionID);
			await cdp.send("Network.enable", {
				maxTotalBufferSize: 5242880,
				maxResourceBufferSize: 1048576,
				maxPostDataSize: 2e4
			}, sessionID);
		},
		console(input) {
			const matching = messages.filter((entry) => levels.indexOf(entry.level) >= levels.indexOf(input.level ?? "info"));
			const result = bounded(matching, input.limit ?? 100);
			return {
				messages: result,
				truncated: matching.length > result.length,
				dropped: droppedMessages
			};
		},
		list(input) {
			const matching = Array.from(requests.values()).filter((hop) => (!input.urlContains || hop.url.includes(input.urlContains)) && (!input.resourceType || input.resourceType === hop.resourceType)).map(networkRequest);
			const result = bounded(matching, input.limit ?? 100);
			return {
				requests: result,
				truncated: matching.length > result.length,
				dropped: droppedRequests
			};
		},
		info(id) {
			return networkRequest(retained(id, "Request is no longer retained. Call browser.network.list({tabID}) and use a current request id. Do not reload or resend it just to inspect it."));
		},
		async get(input) {
			const hop = retained(input.id, "Request ID is no longer retained in this tab or belongs to another tab. Call browser.network.list({tabID}) and copy a current id into browser.network.get with the same tabID. Do not reload or resend a request just to inspect it.");
			const max = input.maxBodyChars ?? 2e4;
			const fetchBody = async () => {
				const body = await cdp.send("Network.getResponseBody", { requestId: hop.nativeID }, hop.sessionID).catch(() => void 0);
				if (!body) return {
					state: "unavailable",
					reason: "backendUnavailable"
				};
				const value = body.base64Encoded ? Buffer.from(body.body, "base64").toString("utf8") : body.body;
				return value.length ? {
					state: "text",
					text: value.slice(0, max),
					truncated: value.length > max
				} : { state: "empty" };
			};
			const known = responseBody(hop, input.includeBody);
			return {
				request: networkRequest(hop),
				requestHeaders: headerEntries(hop.request.headers),
				responseHeaders: headerEntries(hop.response?.headers ?? {}),
				headersTruncated: hop.headersTruncated,
				requestBody: requestBody(hop, input.includeBody, max),
				responseBody: known === "fetch" ? await fetchBody() : known
			};
		}
	};
}
function bounded(items, limit) {
	const selected = [];
	let size = 0;
	for (const item of items.slice(-limit).reverse()) {
		size += JSON.stringify(item).length;
		if (size > 1e5) break;
		selected.push(item);
	}
	return selected.reverse();
}
function headerEntries(headers) {
	return Object.entries(headers).map(([name, value]) => ({
		name,
		value: String(value)
	}));
}
//#endregion
//#region ../gui-plugins/src/browser/icon.ts
/**
* The first of a page's icon candidates that loads, as a data URL small enough to report and store. An SVG stays as
* it is; any other format is redrawn as a PNG of at most 32px, which also drops anything that is not an image. Never
* rejects: a candidate that fails falls through to the next.
*/
function loadIcon(candidates, network) {
	return candidates.filter((url) => /^(?:https?:|data:image\/)/i.test(url)).slice(0, 3).reduce((found, url) => found.then(async (icon) => {
		if (icon) return icon;
		const fetched = /^data:/i.test(url) ? inline(url) : await network?.icon(url).catch(() => void 0);
		return fetched ? encode(fetched) : void 0;
	}), Promise.resolve(void 0));
}
function inline(url) {
	const match = /^data:(image\/[\w.+-]+)(;base64)?,(.*)$/is.exec(url);
	if (!match) return;
	const body = match[3] ?? "";
	return {
		mime: (match[1] ?? "").toLowerCase(),
		data: match[2] ? Buffer.from(body, "base64") : unescape(body)
	};
}
function unescape(text) {
	return Buffer.concat(text.split(/(%[\da-f]{2})/i).map((part) => /^%[\da-f]{2}$/i.test(part) ? Buffer.from([parseInt(part.slice(1), 16)]) : Buffer.from(part)));
}
function encode(fetched) {
	if (fetched.mime === "image/svg+xml") {
		if (!/<svg[\s>]/i.test(fetched.data.toString("utf8"))) return;
		const url = `data:image/svg+xml;base64,${fetched.data.toString("base64")}`;
		return url.length <= 24576 ? url : void 0;
	}
	const image = nativeImage.createFromBuffer(fetched.data);
	if (image.isEmpty()) return;
	const size = image.getSize();
	const url = (Math.max(size.width, size.height) <= 32 ? image : image.resize(size.width >= size.height ? {
		width: 32,
		quality: "best"
	} : {
		height: 32,
		quality: "best"
	})).toDataURL();
	return url.length <= 24576 ? url : void 0;
}
//#endregion
//#region ../gui-plugins/src/browser/keys.ts
var shellKeys = [
	"t",
	"w",
	"l",
	"n",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	",",
	"\\"
];
var shellShiftKeys = [
	"t",
	"[",
	"]",
	"r",
	"p",
	"l",
	"e",
	"o",
	"s"
];
var launcherKeys = [
	"r",
	"b",
	"p"
];
/**
* The letter a page key press names, as the app's keybinds read it: the layout's character, so Dvorak's C is "c"
* although it sits on the physical I key. A layout that types no Latin letter falls back to the physical key.
*/
function pageLetter(input) {
	const key = input.key.toLowerCase();
	if (key === "{" || key === "}") return key === "{" ? "[" : "]";
	if (/^[^\x00-\x7f]$/u.test(key) && /^Bracket(Left|Right)$/.test(input.code)) return input.code === "BracketLeft" ? "[" : "]";
	if (/^[a-z]$/.test(key) || !/^Key[A-Z]$/.test(input.code)) return key;
	return input.code.slice(3).toLowerCase();
}
/**
* Whether a page key press is the system browser's reload: F5, or the platform's modifier with R. The focused page
* reloads itself; left to the window, the Reload menu item would reload the whole app.
*/
function pageReload(input, mac) {
	if (input.alt || input.shift) return false;
	if (input.key === "F5") return !input.meta && !input.control;
	return (mac ? input.meta && !input.control : input.control && !input.meta) && pageLetter(input) === "r";
}
/**
* Returns the shortcut to forward to the app window when a focused page receives a key press that belongs to the
* browser pane or app shell, or `undefined` when the key belongs to the page (typing, editing, clipboard, find,
* history, or in-page shortcuts like ⌘K and ⌘B).
*/
function pageShortcut(input, mac) {
	const key = pageLetter(input);
	const mod = mac ? input.meta && !input.control : input.control && !input.meta;
	const launcher = mac ? input.meta && input.control && !input.alt : input.control && input.alt && !input.meta;
	if (!(input.control && !input.meta && !input.alt && (key === "tab" || key === "`" && !input.shift) || launcher && !input.shift && launcherKeys.includes(input.key.toLowerCase()) || mod && (input.alt ? !input.shift && (key === "arrowleft" || key === "arrowright") : input.shift ? shellShiftKeys.includes(key) : shellKeys.includes(key)))) return void 0;
	return {
		key: /^[a-z[\]]$/.test(key) ? key : input.key,
		code: input.code,
		ctrl: input.control,
		meta: input.meta,
		shift: input.shift,
		alt: input.alt
	};
}
//#endregion
//#region ../gui-plugins/src/browser/policy.ts
function destinationOrigin(input) {
	if (!URL.canParse(input)) return;
	const url = new URL(input);
	return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.origin : void 0;
}
/** A file URL for this machine: no host, so UNC shares and remote hosts are rejected. */
function localFileURL(input) {
	if (!URL.canParse(input)) return;
	const url = new URL(input);
	return url.protocol === "file:" && !url.hostname ? url.href : void 0;
}
/** Case-insensitive on Windows, where drive letters and paths compare that way. */
function canonicalPath(input) {
	const value = decodeURIComponent(input).replaceAll("\\", "/").replace(/^\/([A-Za-z]:\/)/, "$1");
	return process.platform === "win32" ? value.toLowerCase() : value;
}
/**
* Whether a file URL points inside one of the allowed directories. The agent already has read
* access to the session's workspace, so files there may be shown; anything else stays behind the
* server's file permissions.
*/
function fileURLWithin(input, roots) {
	const href = localFileURL(input);
	if (!href || roots.length === 0) return false;
	const path = canonicalPath(new URL(href).pathname);
	return roots.some((root) => {
		const prefix = canonicalPath(root).replace(/\/+$/, "");
		return path === prefix || path.startsWith(`${prefix}/`);
	});
}
function allowedDestination(input, policy) {
	return !!destinationOrigin(input) || fileURLWithin(input, policy?.fileRoots ?? []);
}
function normalizeURL(input, policy) {
	const url = withScheme(input);
	const reason = refusal(url, policy);
	if (reason === "browser.address.credentials") throw new Error("URLs with a user name or password are not supported. Remove them from the URL.");
	if (reason) throw new Error(policy?.fileRoots?.length ? "Only HTTP, HTTPS, about:blank, and file URLs inside the workspace are supported." : "Only HTTP, HTTPS, and about:blank URLs are supported.");
	return url;
}
/**
* Why the pane does not open an address, as the code the window explains it with; undefined when it opens.
* - `browser.address.credentials`: a web page address with a user name or password.
* - `browser.address.workspace`: anything but a web page or a file in the workspace.
* - `browser.address.web`: anything but a web page, where no files open.
*/
function refusal(input, policy) {
	const url = withScheme(input);
	if (url === "about:blank" || allowedDestination(url, policy)) return;
	if (URL.canParse(url) && /^https?:$/.test(new URL(url).protocol)) return "browser.address.credentials";
	return policy?.fileRoots?.length ? "browser.address.workspace" : "browser.address.web";
}
function withScheme(input) {
	const value = input.trim();
	if (!value || /^about:blank$/i.test(value)) return "about:blank";
	if (/^[a-z][a-z\d+.-]*:\/\//i.test(value)) return value;
	return `${/^(?:(?:[a-z\d-]+\.)*localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:[/?#]|$)/i.test(value) ? "http" : "https"}://${value}`;
}
/**
* Electron rejects `loadURL` with ERR_FAILED (-2) whenever loading stops before `did-finish-load`. Chromium's media
* viewer for a video or audio URL commits its document and stops that way, so a committed navigation has loaded. A
* download never commits, so it still fails.
*/
function committedLoad(error, committed) {
	return committed && "errno" in error && error.errno === -2;
}
//#endregion
//#region ../gui-plugins/src/browser/page-machine.ts
var CLOSED$2 = { status: "closed" };
var RESET = { type: "reset-document" };
var CLEAR = { type: "clear-diagnostics" };
var PUBLISH$1 = { type: "publish" };
var DETAIL = { type: "detail" };
function createDocumentState(restore) {
	const document = {
		url: "about:blank",
		title: "",
		origin: "",
		icon: void 0,
		iconAttempt: 0,
		pending: void 0,
		busy: false
	};
	if (restore) return {
		...document,
		status: "restoring",
		url: restore.url || "about:blank",
		title: restore.title,
		generation: restore.generation
	};
	return {
		...document,
		status: "blank",
		generation: 0
	};
}
function transitionDocument(state, event) {
	if (state.status === "closed") return unchanged$2(state);
	switch (event.type) {
		case "disposed": return {
			state: CLOSED$2,
			effects: []
		};
		case "loading.started": return state.busy ? unchanged$2(state) : settle$1(state, {
			...state,
			busy: true
		}, []);
		case "loading.stopped": return stopped(state, event.title);
		case "navigation.started":
			if (!event.isMainFrame || event.isSameDocument) return unchanged$2(state);
			return settle$1(state, {
				...state,
				pending: event.url
			}, [CLEAR, PUBLISH$1]);
		case "navigation.committed": return committed(state, event);
		case "navigation.failed": return failed(state, event);
		case "navigation.in-page":
			if (!event.isMainFrame) return unchanged$2(state);
			return settle$1(state, state.status === "loaded" ? {
				...state,
				url: event.url,
				title: event.title
			} : {
				...state,
				title: event.title
			}, [PUBLISH$1]);
		case "document.ready": return state.status === "loaded" && !state.revealed ? settle$1(state, {
			...state,
			revealed: true
		}, []) : unchanged$2(state);
		case "title.updated": return event.title === state.title ? unchanged$2(state) : settle$1(state, {
			...state,
			title: event.title
		}, [PUBLISH$1]);
		case "icon.updated": {
			const attempt = state.iconAttempt + 1;
			return {
				state: {
					...state,
					iconAttempt: attempt
				},
				effects: [{
					type: "load-icon",
					attempt,
					favicons: event.favicons
				}]
			};
		}
		case "icon.loaded":
			if (event.attempt !== state.iconAttempt || event.icon === state.icon) return unchanged$2(state);
			return {
				state: {
					...state,
					icon: event.icon
				},
				effects: [DETAIL]
			};
	}
}
function isDocumentClosed(state) {
	return state.status === "closed";
}
function documentGeneration(state) {
	return state.status === "closed" ? 0 : state.generation;
}
/** Whether the native surface holds a document worth exposing over the themed background. */
function documentVisible(state) {
	return state.status === "loaded" && state.revealed;
}
function documentIcon(state) {
	return state.status === "closed" ? void 0 : state.icon;
}
/** A blank document's load is not shown as loading; a navigation away from it is. */
function isDocumentLoading(state) {
	if (state.status === "closed" || !state.busy) return false;
	if (state.pending !== void 0) return state.pending !== "about:blank";
	return state.status === "loaded";
}
function documentTab(state, history) {
	if (state.status === "closed") return {
		...history,
		url: "",
		title: "",
		loading: false,
		generation: 0
	};
	const loading = isDocumentLoading(state);
	const tab = {
		id: history.id,
		url: state.url.slice(0, 16384),
		title: state.title.slice(0, 2048),
		loading,
		canGoBack: history.canGoBack,
		canGoForward: history.canGoForward,
		generation: state.generation
	};
	return state.status === "failed" && !loading ? {
		...tab,
		loadError: state.message
	} : tab;
}
function committed(state, event) {
	const origin = destinationOrigin(event.url) ?? event.url;
	const same = origin === state.origin;
	const document = {
		generation: state.status === "restoring" ? state.generation : state.generation + 1,
		url: event.url,
		title: same ? state.title : event.title,
		origin,
		icon: same ? state.icon : void 0,
		iconAttempt: same ? state.iconAttempt : state.iconAttempt + 1,
		pending: void 0,
		busy: state.busy
	};
	return settle$1(state, event.url === "about:blank" ? {
		...document,
		status: "blank"
	} : event.status === 502 ? {
		...document,
		status: "failed",
		message: `${event.status} ${event.statusText}`.trim().slice(0, 2048)
	} : {
		...document,
		status: "loaded",
		revealed: documentVisible(state)
	}, [
		RESET,
		PUBLISH$1,
		DETAIL
	]);
}
function failed(state, event) {
	if (!event.isMainFrame || event.code === -3) return unchanged$2(state);
	const replaced = state.pending !== void 0 || state.status === "restoring";
	return settle$1(state, {
		status: "failed",
		generation: replaced && state.status !== "restoring" ? state.generation + 1 : state.generation,
		url: event.url,
		title: state.title,
		origin: state.origin,
		icon: state.icon,
		iconAttempt: state.iconAttempt,
		pending: void 0,
		busy: state.busy,
		message: event.description.slice(0, 2048)
	}, replaced ? [RESET, PUBLISH$1] : [PUBLISH$1]);
}
function stopped(state, title) {
	const document = {
		title,
		pending: void 0,
		busy: false
	};
	if (state.status === "restoring") return settle$1(state, {
		...state,
		...document,
		status: "blank",
		url: "about:blank"
	}, [PUBLISH$1]);
	return settle$1(state, state.status === "loaded" ? {
		...state,
		...document,
		revealed: true
	} : {
		...state,
		...document
	}, [PUBLISH$1]);
}
/** Adds the effects a change implies: showing or hiding the surface, and publishing a change of loading. */
function settle$1(previous, next, effects) {
	const visible = documentVisible(next);
	const shown = visible === documentVisible(previous) ? [] : [{
		type: "show",
		visible
	}];
	const publish = isDocumentLoading(next) !== isDocumentLoading(previous) && !effects.includes(PUBLISH$1);
	return {
		state: next,
		effects: [
			...shown,
			...effects,
			...publish ? [PUBLISH$1] : []
		]
	};
}
function unchanged$2(state) {
	return {
		state,
		effects: []
	};
}
//#endregion
//#region ../gui-plugins/src/browser/picker-machine.ts
/** How long each phase may last before its timeout ends it. */
var PICKER_TIMEOUT_MS = {
	/** Chromium answers Overlay.setInspectMode at once; past this the picker counts as failed to start. */
	arming: 2e3,
	/** Describing a picked element reads the DOM, layout and accessibility tree; past this the pick is dropped. */
	describing: 5e3,
	/** How long a revealed element stays highlighted. */
	flashing: 1500
};
var initialPickerState = {
	status: "off",
	attempt: 0
};
var CLOSED$1 = { status: "closed" };
var DISARM = { type: "disarm" };
var HIDE = { type: "hide-highlight" };
var ON = {
	type: "report",
	active: true
};
var OFF = {
	type: "report",
	active: false
};
function transitionPicker(state, event) {
	if (state.status === "closed") return unchanged$1(state);
	switch (event.type) {
		case "disposed": return {
			state: CLOSED$1,
			effects: []
		};
		case "inspect.set":
			if (!event.enabled) return state.status === "off" ? {
				state,
				effects: [OFF]
			} : stop(state);
			if (state.status === "armed") return {
				state,
				effects: [ON]
			};
			return state.status === "arming" ? unchanged$1(state) : arm(state);
		case "inspect.toggled": return isPickerActive(state) ? stop(state) : arm(state);
		case "escape.pressed":
		case "pointer.command": return isPickerActive(state) ? stop(state) : unchanged$1(state);
		case "document.changed":
		case "embed.hidden": return state.status === "off" ? unchanged$1(state) : stop(state);
		case "frame.attached":
			if (!isPickerActive(state)) return unchanged$1(state);
			return {
				state,
				effects: [{
					type: "arm-frame",
					attempt: state.attempt,
					sessionID: event.sessionID
				}]
			};
		case "arm.succeeded":
			if (state.status !== "arming" || event.attempt !== state.attempt) return unchanged$1(state);
			return {
				state: {
					status: "armed",
					attempt: state.attempt
				},
				effects: [ON]
			};
		case "arm.failed": return state.status === "arming" && event.attempt === state.attempt ? stop(state) : unchanged$1(state);
		case "node.picked": {
			if (!isPickerActive(state)) return unchanged$1(state);
			const attempt = state.attempt + 1;
			return {
				state: {
					status: "describing",
					attempt
				},
				effects: [{
					type: "timer",
					phase: "describing",
					attempt
				}, {
					type: "describe",
					attempt,
					backendID: event.backendID,
					sessionID: event.sessionID
				}]
			};
		}
		case "describe.succeeded":
			if (state.status === "describing" && event.attempt === state.attempt) return {
				state: {
					status: "off",
					attempt: state.attempt
				},
				effects: [{
					type: "pick",
					target: event.target,
					element: event.element
				}]
			};
			return stale(state);
		case "describe.failed": return state.status === "describing" && event.attempt === state.attempt ? stop(state) : stale(state);
		case "highlight.requested":
			if (event.target) return flash(state, event.target);
			return state.status === "off" || state.status === "flashing" ? stop(state) : unchanged$1(state);
		case "flash.shown":
			if (state.status !== "flashing" || event.attempt !== state.attempt) return unchanged$1(state);
			return {
				state,
				effects: [{
					type: "timer",
					phase: "flashing",
					attempt: state.attempt
				}]
			};
		case "flash.failed": return state.status === "flashing" && event.attempt === state.attempt ? stop(state) : unchanged$1(state);
		case "timeout": return state.status === event.phase && event.attempt === state.attempt ? stop(state) : unchanged$1(state);
	}
}
/** The picker waits for a click: Escape and agent input stop it. */
function isPickerActive(state) {
	return state.status === "arming" || state.status === "armed";
}
/** The attempt a driver checks before an answer changes the page; none once closed. */
function pickerAttempt(state) {
	return state.status === "closed" ? -1 : state.attempt;
}
function arm(state) {
	const attempt = state.attempt + 1;
	return {
		state: {
			status: "arming",
			attempt
		},
		effects: [{
			type: "timer",
			phase: "arming",
			attempt
		}, {
			type: "arm",
			attempt
		}]
	};
}
/** Ends whatever runs: a running picker is disarmed, any highlight hides, and the window hears the picker is off. */
function stop(state) {
	const next = {
		status: "off",
		attempt: state.attempt + 1
	};
	if (isPickerActive(state)) return {
		state: next,
		effects: [
			DISARM,
			HIDE,
			OFF
		]
	};
	if (state.status === "describing") return {
		state: next,
		effects: [HIDE, OFF]
	};
	return {
		state: next,
		effects: [HIDE]
	};
}
/** A highlight for a picked element ends the picker, as the element is already chosen. */
function flash(state, target) {
	const attempt = state.attempt + 1;
	const ended = isPickerActive(state) ? [DISARM, OFF] : state.status === "describing" ? [OFF] : [];
	return {
		state: {
			status: "flashing",
			attempt
		},
		effects: [...ended, {
			type: "flash",
			attempt,
			target
		}]
	};
}
/** A description that finished after its pick was cancelled may have highlighted the element; an idle page hides it. */
function stale(state) {
	return state.status === "off" ? {
		state,
		effects: [HIDE]
	} : unchanged$1(state);
}
function unchanged$1(state) {
	return {
		state,
		effects: []
	};
}
//#endregion
//#region ../gui-plugins/src/browser/analysis.ts
var number = Finite;
var Trace = Struct({ traceEvents: ArraySchema(Struct({
	name: optionalKey(String$1),
	ph: optionalKey(String$1),
	pid: optionalKey(number),
	tid: optionalKey(number),
	ts: optionalKey(number),
	dur: optionalKey(number)
})) });
var Cpu = Struct({
	startTime: number,
	endTime: number,
	nodes: ArraySchema(Struct({
		id: number,
		callFrame: Struct({
			functionName: String$1,
			url: String$1,
			lineNumber: number
		})
	})),
	samples: optionalKey(ArraySchema(number)),
	timeDeltas: optionalKey(ArraySchema(number))
});
var Heap = Struct({
	snapshot: Struct({ meta: Struct({
		node_fields: ArraySchema(String$1),
		node_types: ArraySchema(Union([String$1, ArraySchema(String$1)])),
		edge_fields: ArraySchema(String$1),
		edge_types: ArraySchema(Union([String$1, ArraySchema(String$1)]))
	}) }),
	nodes: ArraySchema(number),
	edges: ArraySchema(number),
	strings: ArraySchema(String$1)
});
function analyzeTrace(value, limit = 100) {
	const decoded = decodeUnknownOption(Trace)(value);
	if (decoded._tag === "None") throw new Error("Selected file is not a Chromium performance trace. Use a fileID returned by browser.trace.stop for this tab; CPU profiles and heap snapshots use their own analysis tools.");
	const trace = decoded.value;
	const events = /* @__PURE__ */ new Map();
	const longTasks = [];
	trace.traceEvents.forEach((event) => {
		if (event.ph !== "X" || !event.name || event.dur === void 0) return;
		const duration = event.dur / 1e3;
		const item = events.get(event.name) ?? {
			name: event.name.slice(0, 2048),
			count: 0,
			totalMs: 0,
			maxMs: 0
		};
		item.count++;
		item.totalMs += duration;
		item.maxMs = Math.max(item.maxMs, duration);
		events.set(event.name, item);
		if ((event.name === "RunTask" || event.name === "ThreadControllerImpl::RunTask") && duration > 50) longTasks.push(duration);
	});
	return {
		metrics: [
			{
				name: "recordedEvents",
				value: trace.traceEvents.length,
				unit: "count"
			},
			{
				name: "longTasks",
				value: longTasks.length,
				unit: "count"
			},
			{
				name: "longTaskBlocking",
				value: longTasks.reduce((sum, duration) => sum + duration - 50, 0),
				unit: "ms"
			}
		],
		events: Array.from(events.values()).sort((a, b) => b.totalMs - a.totalMs).slice(0, limit),
		insights: [
			"Event durations can overlap and must not be summed into total page time.",
			longTasks.length ? `${longTasks.length} recorded tasks exceeded 50 ms; inspect their stacks in the exported trace.` : "No tasks over 50 ms were observed in the retained trace. This is not proof that the page has no long tasks.",
			"This renderer-process trace does not calculate LCP, INP, CLS, or Lighthouse performance scores."
		]
	};
}
function analyzeCpu(value, limit = 100) {
	const decoded = decodeUnknownOption(Cpu)(value);
	if (decoded._tag === "None") throw new Error("Selected file is not a CPU profile. Use a fileID returned by browser.cpu.stop for this tab, not a trace or heap snapshot.");
	const profile = decoded.value;
	const times = /* @__PURE__ */ new Map();
	profile.samples?.forEach((id, index) => times.set(id, (times.get(id) ?? 0) + (profile.timeDeltas?.[index] ?? 0) / 1e3));
	return {
		durationMs: Math.max(0, (profile.endTime - profile.startTime) / 1e3),
		functions: profile.nodes.map((node) => ({
			name: node.callFrame.functionName.slice(0, 2048),
			url: node.callFrame.url.slice(0, 1e5),
			line: Math.max(0, node.callFrame.lineNumber + 1),
			selfMs: times.get(node.id) ?? 0
		})).filter((node) => node.selfMs > 0).sort((a, b) => b.selfMs - a.selfMs).slice(0, limit)
	};
}
var malformedHeap = () => /* @__PURE__ */ new Error("Heap snapshot layout is unsupported or incomplete. Use a complete capture from browser.heap.snapshot; if this tool produced it, report a parser/Chromium compatibility issue instead of repeatedly capturing the same heap.");
function parseHeap(value) {
	const decoded = decodeUnknownOption(Heap)(value);
	if (decoded._tag === "None") throw new Error("Selected file is not a V8 heap snapshot. Use a fileID returned by browser.heap.snapshot for this tab, not a trace or CPU profile.");
	const heap = decoded.value;
	const fields = heap.snapshot.meta.node_fields;
	const edgeFields = heap.snapshot.meta.edge_fields;
	const width = fields.length;
	const edgeWidth = edgeFields.length;
	const indexes = {
		type: fields.indexOf("type"),
		name: fields.indexOf("name"),
		id: fields.indexOf("id"),
		size: fields.indexOf("self_size"),
		count: fields.indexOf("edge_count"),
		edgeType: edgeFields.indexOf("type"),
		edgeName: edgeFields.indexOf("name_or_index"),
		to: edgeFields.indexOf("to_node")
	};
	if (!width || !edgeWidth || Object.values(indexes).some((index) => index < 0) || heap.nodes.length % width || heap.edges.length % edgeWidth) throw malformedHeap();
	const types = heap.snapshot.meta.node_types[indexes.type];
	const edgeTypes = heap.snapshot.meta.edge_types[indexes.edgeType];
	if (!Array.isArray(types) || !Array.isArray(edgeTypes)) throw new Error("Heap snapshot type tables are unsupported. Use a complete capture from browser.heap.snapshot and report the compatibility issue if it persists.");
	const node = (offset) => ({
		id: heap.nodes[offset + indexes.id],
		name: (heap.strings[heap.nodes[offset + indexes.name]] ?? "").slice(0, 1e5),
		type: types[heap.nodes[offset + indexes.type]] ?? "unknown",
		selfBytes: heap.nodes[offset + indexes.size],
		edgeCount: heap.nodes[offset + indexes.count]
	});
	const classes = /* @__PURE__ */ new Map();
	let selfBytes = 0;
	let edgeTotal = 0;
	for (let offset = 0; offset < heap.nodes.length; offset += width) {
		const item = node(offset);
		if (!Number.isSafeInteger(item.edgeCount) || item.edgeCount < 0) throw malformedHeap();
		edgeTotal += item.edgeCount;
		const name = item.name.slice(0, 2048);
		const entry = classes.get(name) ?? {
			name,
			count: 0,
			bytes: 0
		};
		entry.count++;
		entry.bytes += item.selfBytes;
		selfBytes += item.selfBytes;
		classes.set(name, entry);
	}
	if (edgeTotal * edgeWidth !== heap.edges.length) throw malformedHeap();
	for (let offset = indexes.to; offset < heap.edges.length; offset += edgeWidth) {
		const to = heap.edges[offset];
		if (!Number.isSafeInteger(to) || to < 0 || to >= heap.nodes.length || to % width) throw malformedHeap();
	}
	return {
		summary(limit = 100) {
			return {
				nodes: heap.nodes.length / width,
				edges: heap.edges.length / edgeWidth,
				selfBytes,
				classes: Array.from(classes.values()).sort((a, b) => b.bytes - a.bytes).slice(0, limit)
			};
		},
		classes,
		query(name = "", limit = 100) {
			const found = [];
			for (let offset = 0; offset < heap.nodes.length; offset += width) {
				const item = node(offset);
				if (item.name.toLowerCase().includes(name.toLowerCase())) found.push(item);
			}
			return {
				nodes: found.sort((a, b) => b.selfBytes - a.selfBytes).slice(0, limit),
				truncated: found.length > limit
			};
		},
		object(id, limit = 100) {
			const target = heap.nodes.findIndex((value, index) => index % width === indexes.id && value === id) - indexes.id;
			if (target < 0) throw new Error("Object ID was not found in this heap snapshot. Call browser.heap.query with the same tabID and fileID, then copy an exact returned object id. Object IDs cannot be reused across snapshots.");
			const references = [];
			const retainers = [];
			let edgeOffset = 0;
			let truncated = false;
			for (let offset = 0; offset < heap.nodes.length; offset += width) {
				const count = heap.nodes[offset + indexes.count];
				for (let index = 0; index < count; index++, edgeOffset += edgeWidth) {
					const to = heap.edges[edgeOffset + indexes.to];
					if (offset !== target && to !== target) continue;
					const type = edgeTypes[heap.edges[edgeOffset + indexes.edgeType]];
					const raw = heap.edges[edgeOffset + indexes.edgeName];
					const name = (type === "element" || type === "hidden" ? String(raw) : heap.strings[raw] ?? "").slice(0, 1e5);
					if (offset === target) {
						if (references.length < limit) references.push({
							name,
							node: node(to)
						});
						else truncated = true;
					}
					if (to === target && type !== "weak") {
						if (retainers.length < limit) retainers.push({
							name,
							node: node(offset)
						});
						else truncated = true;
					}
				}
			}
			return {
				node: node(target),
				references,
				retainers,
				truncated
			};
		}
	};
}
//#endregion
//#region ../gui-plugins/src/browser/profiling-machine.ts
/** How long Chromium may take to flush a trace once tracing ended. */
var TRACE_STOP_TIMEOUT_MS = 1e4;
/** A CPU profile stops by itself after this. */
var CPU_MAX_DURATION_MS = 3e4;
/** How long `Profiler.stop` and saving the profile may take. */
var CPU_STOP_TIMEOUT_MS = 1e4;
/** How long taking and saving a heap snapshot may take. */
var HEAP_CAPTURE_TIMEOUT_MS = 3e4;
var IDLE = { status: "idle" };
var createProfilingState = (owner) => ({
	owner,
	lifecycle: "open",
	issued: 0,
	trace: IDLE,
	cpu: IDLE,
	heap: IDLE
});
function transitionProfiling(state, shared, event) {
	switch (event.type) {
		case "frame.navigated": return navigated(state, shared, event.url);
		case "trace.start.requested": {
			if (state.lifecycle !== "open") return refuse(state, shared, "closed");
			if (shared || active(state.trace)) return refuse(state, shared, !shared || shared.owner === state.owner ? "trace-active-here" : "trace-active-elsewhere");
			const attempt = state.issued + 1;
			return {
				state: {
					...state,
					issued: attempt,
					trace: {
						status: "starting",
						attempt,
						key: event.key,
						pid: event.pid,
						durationMs: event.durationMs,
						resources: event.resources,
						stopRequested: false
					}
				},
				shared: {
					owner: state.owner,
					attempt
				},
				effects: [{
					type: "start-trace",
					attempt
				}],
				reply: {
					status: "pending",
					attempt
				}
			};
		}
		case "trace.start.succeeded": {
			const trace = state.trace;
			if (trace.status !== "starting" || trace.attempt !== event.attempt) return unchanged(state, shared);
			const started = {
				type: "settle-trace-start",
				attempt: trace.attempt,
				outcome: {
					ok: true,
					value: void 0
				}
			};
			if (trace.stopRequested || state.lifecycle !== "open") return {
				state: {
					...state,
					trace: {
						status: "stopping",
						attempt: trace.attempt,
						key: trace.key,
						resources: trace.resources
					}
				},
				shared,
				effects: [started, ...endTrace(trace, trace.pid, 0)]
			};
			return {
				state: {
					...state,
					trace: {
						status: "recording",
						attempt: trace.attempt,
						key: trace.key,
						pid: trace.pid,
						startedAt: event.now,
						resources: trace.resources
					}
				},
				shared,
				effects: [started, {
					type: "schedule",
					timer: "trace.duration",
					attempt: trace.attempt,
					delayMs: trace.durationMs
				}]
			};
		}
		case "trace.start.failed": {
			const trace = state.trace;
			if (trace.status !== "starting" || trace.attempt !== event.attempt) return unchanged(state, shared);
			const failed = {
				ok: false,
				error: event.error
			};
			return settleDispose({
				state: {
					...state,
					trace: IDLE
				},
				shared: release(state, shared, trace.attempt),
				effects: [{
					type: "settle-trace-start",
					attempt: trace.attempt,
					outcome: failed
				}, ...trace.stopRequested ? [{
					type: "settle-trace-stop",
					attempt: trace.attempt,
					outcome: failed
				}] : []]
			});
		}
		case "trace.duration.elapsed":
			if (state.trace.status !== "recording" || state.trace.attempt !== event.attempt) return unchanged(state, shared);
			return stopTrace(state, shared, event.now);
		case "trace.stop.requested": return stopTrace(state, shared, event.now);
		case "trace.stop.succeeded":
		case "trace.stop.failed": {
			const trace = state.trace;
			if (trace.status !== "stopping" || trace.attempt !== event.attempt) return unchanged(state, shared);
			return settleDispose({
				state: {
					...state,
					trace: {
						...trace,
						status: "stopped"
					}
				},
				shared: release(state, shared, trace.attempt),
				effects: [{
					type: "cancel",
					timer: "trace.stop"
				}, {
					type: "settle-trace-stop",
					attempt: trace.attempt,
					outcome: event.type === "trace.stop.succeeded" ? {
						ok: true,
						value: event.value
					} : {
						ok: false,
						error: event.error
					}
				}]
			});
		}
		case "cpu.start.requested": {
			if (state.lifecycle !== "open") return refuse(state, shared, "closed");
			if (active(state.cpu)) return refuse(state, shared, "cpu-active");
			const attempt = state.issued + 1;
			return {
				state: {
					...state,
					issued: attempt,
					cpu: {
						status: "starting",
						attempt,
						key: event.key,
						resources: event.resources,
						stopRequested: false
					}
				},
				shared,
				effects: [{
					type: "start-cpu",
					attempt
				}],
				reply: {
					status: "pending",
					attempt
				}
			};
		}
		case "cpu.start.succeeded": {
			const cpu = state.cpu;
			if (cpu.status !== "starting" || cpu.attempt !== event.attempt) return unchanged(state, shared);
			const started = {
				type: "settle-cpu-start",
				attempt: cpu.attempt,
				outcome: {
					ok: true,
					value: void 0
				}
			};
			if (cpu.stopRequested || state.lifecycle !== "open") return {
				state: {
					...state,
					cpu: {
						status: "stopping",
						attempt: cpu.attempt,
						key: cpu.key,
						resources: cpu.resources
					}
				},
				shared,
				effects: [started, ...stopCpu(cpu)]
			};
			return {
				state: {
					...state,
					cpu: {
						status: "recording",
						attempt: cpu.attempt,
						key: cpu.key,
						resources: cpu.resources
					}
				},
				shared,
				effects: [started, {
					type: "schedule",
					timer: "cpu.duration",
					attempt: cpu.attempt,
					delayMs: CPU_MAX_DURATION_MS
				}]
			};
		}
		case "cpu.start.failed": {
			const cpu = state.cpu;
			if (cpu.status !== "starting" || cpu.attempt !== event.attempt) return unchanged(state, shared);
			const failed = {
				ok: false,
				error: event.error
			};
			return settleDispose({
				state: {
					...state,
					cpu: IDLE
				},
				shared,
				effects: [{
					type: "settle-cpu-start",
					attempt: cpu.attempt,
					outcome: failed
				}, ...cpu.stopRequested ? [{
					type: "settle-cpu-stop",
					attempt: cpu.attempt,
					outcome: failed
				}] : []]
			});
		}
		case "cpu.duration.elapsed":
			if (state.cpu.status !== "recording" || state.cpu.attempt !== event.attempt) return unchanged(state, shared);
			return requestCpuStop(state, shared);
		case "cpu.stop.requested": return requestCpuStop(state, shared);
		case "cpu.stop.succeeded":
		case "cpu.stop.failed": {
			const cpu = state.cpu;
			if (cpu.status !== "stopping" || cpu.attempt !== event.attempt) return unchanged(state, shared);
			return settleDispose({
				state: {
					...state,
					cpu: {
						...cpu,
						status: "stopped"
					}
				},
				shared,
				effects: [{
					type: "cancel",
					timer: "cpu.stop"
				}, {
					type: "settle-cpu-stop",
					attempt: cpu.attempt,
					outcome: event.type === "cpu.stop.succeeded" ? {
						ok: true,
						value: event.value
					} : {
						ok: false,
						error: event.error
					}
				}]
			});
		}
		case "heap.requested": {
			if (state.lifecycle !== "open") return refuse(state, shared, "closed");
			if (state.heap.status === "capturing") return refuse(state, shared, "heap-active");
			const attempt = state.issued + 1;
			return {
				state: {
					...state,
					issued: attempt,
					heap: {
						status: "capturing",
						attempt
					}
				},
				shared,
				effects: [{
					type: "schedule",
					timer: "heap",
					attempt,
					delayMs: HEAP_CAPTURE_TIMEOUT_MS
				}, {
					type: "capture-heap",
					attempt,
					resources: event.resources
				}],
				reply: {
					status: "pending",
					attempt
				}
			};
		}
		case "heap.succeeded":
		case "heap.failed":
			if (state.heap.status !== "capturing" || state.heap.attempt !== event.attempt) return unchanged(state, shared);
			return {
				state: {
					...state,
					heap: IDLE
				},
				shared,
				effects: [{
					type: "cancel",
					timer: "heap"
				}, {
					type: "settle-heap",
					attempt: event.attempt,
					outcome: event.type === "heap.succeeded" ? {
						ok: true,
						value: event.id
					} : {
						ok: false,
						error: event.error
					}
				}]
			};
		case "dispose.requested": {
			if (state.lifecycle !== "open") return unchanged(state, shared);
			const disposing = {
				...state,
				lifecycle: "disposing"
			};
			const trace = active(state.trace) ? stopTrace(disposing, shared, event.now) : unchanged(disposing, shared);
			const cpu = active(trace.state.cpu) ? requestCpuStop(trace.state, trace.shared) : unchanged(trace.state, trace.shared);
			return settleDispose({
				state: cpu.state,
				shared: cpu.shared,
				effects: [...trace.effects, ...cpu.effects]
			});
		}
	}
}
/** What a stop asks permission for: the recording's pages and an identity that changes with each recording. */
function selectProfilingTarget(state, type) {
	const phase = type === "trace" ? state.trace : state.cpu;
	if (phase.status === "idle") return {
		resources: [],
		key: ""
	};
	return {
		resources: [...phase.resources].sort(),
		key: phase.key
	};
}
/** Whether the export of `attempt` is still wanted; a timed-out or disposed export stops reading. */
function isTraceStoppingAttempt(state, attempt) {
	return state.trace.status === "stopping" && state.trace.attempt === attempt;
}
function navigated(state, shared, url) {
	const trace = recordsPages(state.trace) && !state.trace.resources.includes(url) ? withResource(state.trace, url) : state.trace;
	const cpu = recordsPages(state.cpu) && !state.cpu.resources.includes(url) ? withResource(state.cpu, url) : state.cpu;
	if (trace === state.trace && cpu === state.cpu) return unchanged(state, shared);
	return {
		state: {
			...state,
			trace,
			cpu
		},
		shared,
		effects: []
	};
}
function stopTrace(state, shared, now) {
	const trace = state.trace;
	if (trace.status === "idle") return refuse(state, shared, "no-trace");
	const reply = {
		status: "pending",
		attempt: trace.attempt
	};
	if (trace.status === "starting") return {
		state: trace.stopRequested ? state : {
			...state,
			trace: {
				...trace,
				stopRequested: true
			}
		},
		shared,
		effects: [],
		reply
	};
	if (trace.status !== "recording") return {
		state,
		shared,
		effects: [],
		reply
	};
	return {
		state: {
			...state,
			trace: {
				status: "stopping",
				attempt: trace.attempt,
				key: trace.key,
				resources: trace.resources
			}
		},
		shared,
		effects: [{
			type: "cancel",
			timer: "trace.duration"
		}, ...endTrace(trace, trace.pid, Math.max(0, now - trace.startedAt))],
		reply
	};
}
function requestCpuStop(state, shared) {
	const cpu = state.cpu;
	if (cpu.status === "idle") return refuse(state, shared, "no-cpu");
	const reply = {
		status: "pending",
		attempt: cpu.attempt
	};
	if (cpu.status === "starting") return {
		state: cpu.stopRequested ? state : {
			...state,
			cpu: {
				...cpu,
				stopRequested: true
			}
		},
		shared,
		effects: [],
		reply
	};
	if (cpu.status !== "recording") return {
		state,
		shared,
		effects: [],
		reply
	};
	return {
		state: {
			...state,
			cpu: {
				...cpu,
				status: "stopping"
			}
		},
		shared,
		effects: [{
			type: "cancel",
			timer: "cpu.duration"
		}, ...stopCpu(cpu)],
		reply
	};
}
function endTrace(trace, pid, durationMs) {
	return [{
		type: "schedule",
		timer: "trace.stop",
		attempt: trace.attempt,
		delayMs: TRACE_STOP_TIMEOUT_MS
	}, {
		type: "end-trace",
		attempt: trace.attempt,
		pid,
		durationMs,
		resources: trace.resources
	}];
}
function stopCpu(cpu) {
	return [{
		type: "schedule",
		timer: "cpu.stop",
		attempt: cpu.attempt,
		delayMs: CPU_STOP_TIMEOUT_MS
	}, {
		type: "stop-cpu",
		attempt: cpu.attempt,
		resources: cpu.resources
	}];
}
/** A disposal finishes once neither the trace nor the CPU profile is still starting, recording or stopping. */
function settleDispose(next) {
	if (next.state.lifecycle !== "disposing" || active(next.state.trace) || active(next.state.cpu)) return next;
	return {
		...next,
		state: {
			...next.state,
			lifecycle: "disposed"
		},
		effects: [...next.effects, { type: "settle-dispose" }]
	};
}
/** Frees the app-wide trace when this page's `attempt` holds it. */
function release(state, shared, attempt) {
	return shared?.owner === state.owner && shared.attempt === attempt ? void 0 : shared;
}
function active(phase) {
	return phase.status === "starting" || phase.status === "recording" || phase.status === "stopping";
}
function recordsPages(phase) {
	return phase.status === "starting" || phase.status === "recording";
}
function withResource(phase, url) {
	return {
		...phase,
		resources: [...phase.resources, url]
	};
}
function refuse(state, shared, refusal) {
	return {
		state,
		shared,
		effects: [],
		reply: {
			status: "refused",
			refusal
		}
	};
}
function unchanged(state, shared) {
	return {
		state,
		shared,
		effects: []
	};
}
//#endregion
//#region ../gui-plugins/src/browser/profiling.ts
var refusals = {
	"trace-active-here": "A performance trace is already active in this tab. Use browser.trace.stop({tabID}) to finish it before starting another.",
	"trace-active-elsewhere": "Another tab owns the active performance trace. Wait for its owner to finish; do not stop or replace another tab's recording.",
	"no-trace": "This tab has no performance trace to stop. Call browser.trace.start({tabID}), perform the interaction to inspect, then browser.trace.stop({tabID}).",
	"cpu-active": "A CPU profile is already active in this tab. Use browser.cpu.stop({tabID}) before starting another profile.",
	"no-cpu": "No CPU profile has been started in this tab. Call browser.cpu.start({tabID}), perform the interaction to inspect, then browser.cpu.stop({tabID}).",
	"heap-active": "A heap snapshot is already being captured in this tab. Await that call before taking another; do not capture the same tab's heaps in parallel.",
	closed: "Browser tab was closed. Call browser.tabs.list({}) and choose an existing tabID; do not reuse the closed tab's refs."
};
var TRACE_FLUSH_TIMEOUT = "Chromium did not finish flushing the trace within 10 seconds. No complete export is confirmed. Check browser.files.list({tabID}); do not start another recording until the current trace has finished or the user resolves the failure.";
var CPU_STOP_TIMEOUT = "Chromium did not stop the CPU profile within 10 seconds. No profile export is confirmed. Check browser.files.list({tabID}) before starting another profile; do not repeat the stop.";
var HEAP_TIMEOUT = "Heap snapshot did not finish within 30 seconds. No snapshot is confirmed. Use a smaller page/test case or ask the user to inspect the heap with desktop developer tools; do not repeat the same capture unchanged.";
/** Only one trace records across every tab of the app; `shared.trace` names the page that owns it. */
function createProfiling(contents, cdp, files, source, shared) {
	let profilingState = createProfilingState(crypto.randomUUID());
	const timers = /* @__PURE__ */ new Map();
	const traceStarts = /* @__PURE__ */ new Map();
	const traceStops = /* @__PURE__ */ new Map();
	const cpuStarts = /* @__PURE__ */ new Map();
	const cpuStops = /* @__PURE__ */ new Map();
	const heaps = /* @__PURE__ */ new Map();
	const disposed = Promise.withResolvers();
	const dispatch = (event) => {
		const next = transitionProfiling(profilingState, shared.trace, event);
		profilingState = next.state;
		shared.trace = next.shared;
		next.effects.forEach(run);
		return next.reply;
	};
	const request = (event, waiters) => {
		const reply = dispatch(event);
		if (reply?.status === "pending") return waiter(waiters, reply.attempt).promise;
		return Promise.reject(new Error(refusals[reply?.refusal ?? "closed"]));
	};
	const run = (effect) => {
		switch (effect.type) {
			case "start-trace":
				cdp.send("Tracing.start", {
					transferMode: "ReturnAsStream",
					traceConfig: {
						recordMode: "recordUntilFull",
						traceBufferSizeInKb: 8192,
						includedCategories: [
							"devtools.timeline",
							"disabled-by-default-devtools.timeline",
							"disabled-by-default-devtools.timeline.stack",
							"v8.execute",
							"blink.user_timing",
							"disabled-by-default-v8.cpu_profiler"
						],
						excludedCategories: ["*"]
					}
				}).then(() => dispatch({
					type: "trace.start.succeeded",
					attempt: effect.attempt,
					now: performance.now()
				}), (error) => dispatch({
					type: "trace.start.failed",
					attempt: effect.attempt,
					error
				}));
				return;
			case "end-trace":
				exportTrace(effect).then((value) => dispatch({
					type: "trace.stop.succeeded",
					attempt: effect.attempt,
					value
				}), (error) => dispatch({
					type: "trace.stop.failed",
					attempt: effect.attempt,
					error
				}));
				return;
			case "start-cpu":
				cdp.send("Profiler.enable").then(() => cdp.send("Profiler.start")).then(() => dispatch({
					type: "cpu.start.succeeded",
					attempt: effect.attempt
				}), (error) => dispatch({
					type: "cpu.start.failed",
					attempt: effect.attempt,
					error
				}));
				return;
			case "stop-cpu":
				cdp.send("Profiler.stop").then(async ({ profile }) => ({
					id: await files.save("profile.cpuprofile", "application/json", Buffer.from(JSON.stringify(profile)), [...effect.resources]),
					durationMs: (profile.endTime - profile.startTime) / 1e3
				})).then((value) => dispatch({
					type: "cpu.stop.succeeded",
					attempt: effect.attempt,
					value
				}), (error) => dispatch({
					type: "cpu.stop.failed",
					attempt: effect.attempt,
					error
				}));
				return;
			case "capture-heap":
				captureHeap(effect.resources).then((id) => dispatch({
					type: "heap.succeeded",
					attempt: effect.attempt,
					id
				}), (error) => dispatch({
					type: "heap.failed",
					attempt: effect.attempt,
					error
				}));
				return;
			case "schedule":
				clearTimeout(timers.get(effect.timer));
				timers.set(effect.timer, setTimeout(() => dispatch(expired(effect.timer, effect.attempt)), effect.delayMs));
				return;
			case "cancel":
				clearTimeout(timers.get(effect.timer));
				timers.delete(effect.timer);
				return;
			case "settle-trace-start": return settle(traceStarts, effect.attempt, effect.outcome);
			case "settle-trace-stop": return settle(traceStops, effect.attempt, effect.outcome);
			case "settle-cpu-start": return settle(cpuStarts, effect.attempt, effect.outcome);
			case "settle-cpu-stop": return settle(cpuStops, effect.attempt, effect.outcome);
			case "settle-heap": return settle(heaps, effect.attempt, effect.outcome);
			case "settle-dispose": disposed.resolve();
		}
	};
	const exportTrace = async (effect) => {
		const complete = Promise.withResolvers();
		const off = cdp.on("Tracing.tracingComplete", (event) => complete.resolve(event));
		try {
			const result = await cdp.send("Tracing.end").then(() => complete.promise);
			if (!isTraceStoppingAttempt(profilingState, effect.attempt)) throw new Error(TRACE_FLUSH_TIMEOUT);
			if (!result.stream) throw new Error("Chromium stopped tracing without returning a trace stream. No export is available. Check desktop/plugin compatibility and report the failure; repeating trace.stop cannot recover a missing stream.");
			const chunks = [];
			let bytes = 0;
			try {
				while (true) {
					if (!isTraceStoppingAttempt(profilingState, effect.attempt)) throw new Error(TRACE_FLUSH_TIMEOUT);
					const part = await cdp.send("IO.read", {
						handle: result.stream,
						size: 262144
					});
					const buffer = Buffer.from(part.data, part.base64Encoded ? "base64" : "utf8");
					bytes += buffer.byteLength;
					if (bytes > 67108864) throw new Error("Trace exceeded its 64 MiB desktop capture limit. Record a shorter interaction with a smaller durationMs in browser.trace.start; do not repeat the same recording unchanged.");
					chunks.push(buffer);
					if (part.eof) break;
				}
			} finally {
				await cdp.send("IO.close", { handle: result.stream });
			}
			const traceEvents = decodeUnknownSync(fromJsonString(Struct({ traceEvents: ArraySchema(Record(String$1, Json)) })))(Buffer.concat(chunks).toString("utf8")).traceEvents.filter((event) => event.pid === effect.pid);
			return {
				id: await files.save("trace.json.gz", "application/gzip", gzipSync(JSON.stringify({
					traceEvents,
					metadata: {
						source: "opencode",
						scope: "renderer-process",
						processId: effect.pid
					}
				})), [...effect.resources]),
				durationMs: effect.durationMs,
				incomplete: result.dataLossOccurred || contents.isDestroyed() || contents.getOSProcessId() !== effect.pid
			};
		} finally {
			off();
		}
	};
	const captureHeap = async (resources) => {
		const chunks = [];
		let size = 0;
		let overflow = false;
		const off = cdp.on("HeapProfiler.addHeapSnapshotChunk", ({ chunk }) => {
			size += Buffer.byteLength(chunk);
			if (size > 134217728) overflow = true;
			if (!overflow) chunks.push(chunk);
		});
		try {
			await cdp.send("HeapProfiler.enable");
			await cdp.send("HeapProfiler.takeHeapSnapshot", { reportProgress: false });
		} finally {
			off();
		}
		if (overflow) throw new Error("Heap snapshot exceeded the 128 MiB desktop capture limit. Use a smaller page/test case or ask the user to inspect the heap with desktop developer tools; this tool has no size override.");
		return files.save("heap.heapsnapshot.gz", "application/gzip", gzipSync(chunks.join("")), [...resources, ...source()]);
	};
	const json = async (id) => {
		const file = await files.transfer(id);
		try {
			const data = Buffer.from(file.data);
			return decodeUnknownSync(fromJsonString(Unknown))((file.name.endsWith(".gz") ? gunzipSync(data, { maxOutputLength: 134217728 }) : data).toString("utf8"));
		} catch (error) {
			throw new Error("Selected file cannot be decoded as a JSON capture, or expands beyond the 128 MiB analysis limit. Call browser.files.list({tabID}) and choose the fileID from the matching trace, CPU, or heap capture, not a screenshot/download. Do not retry the same invalid file.", { cause: error });
		}
	};
	cdp.on("Page.frameNavigated", ({ frame }) => dispatch({
		type: "frame.navigated",
		url: frame.url
	}));
	return {
		target(type) {
			return selectProfilingTarget(profilingState, type);
		},
		startTrace(durationMs = 1e4) {
			return request({
				type: "trace.start.requested",
				key: crypto.randomUUID(),
				pid: contents.getOSProcessId(),
				durationMs,
				resources: source()
			}, traceStarts);
		},
		stopTrace() {
			return request({
				type: "trace.stop.requested",
				now: performance.now()
			}, traceStops);
		},
		startCpu() {
			return request({
				type: "cpu.start.requested",
				key: crypto.randomUUID(),
				resources: source()
			}, cpuStarts);
		},
		stopCpu() {
			return request({ type: "cpu.stop.requested" }, cpuStops);
		},
		heap() {
			return request({
				type: "heap.requested",
				resources: source()
			}, heaps);
		},
		async analyze(action) {
			if (action.type === "heap.compare") {
				const before = parseHeap(await json(action.before)).classes;
				const after = parseHeap(await json(action.after)).classes;
				return { classes: Array.from(/* @__PURE__ */ new Set([...before.keys(), ...after.keys()])).map((name) => ({
					name,
					countDelta: (after.get(name)?.count ?? 0) - (before.get(name)?.count ?? 0),
					bytesDelta: (after.get(name)?.bytes ?? 0) - (before.get(name)?.bytes ?? 0)
				})).filter((item) => item.countDelta || item.bytesDelta).sort((a, b) => Math.abs(b.bytesDelta) - Math.abs(a.bytesDelta)).slice(0, action.limit ?? 100) };
			}
			const value = await json(action.fileID);
			if (action.type === "trace.analyze") return analyzeTrace(value, action.limit);
			if (action.type === "cpu.analyze") return analyzeCpu(value, action.limit);
			const heap = parseHeap(value);
			if (action.type === "heap.summary") return heap.summary(action.limit);
			if (action.type === "heap.query") return heap.query(action.name, action.limit);
			return heap.object(action.id, action.limit);
		},
		/** Stops this page's trace and CPU profile; resolves once both settled, each within its stop timeout. */
		dispose() {
			dispatch({
				type: "dispose.requested",
				now: performance.now()
			});
			return disposed.promise;
		}
	};
}
/** The attempt's waiter; a new attempt drops the settled waiters of earlier ones. */
function waiter(waiters, attempt) {
	const existing = waiters.get(attempt);
	if (existing) return existing;
	const created = Promise.withResolvers();
	created.promise.catch(() => void 0);
	waiters.clear();
	waiters.set(attempt, created);
	return created;
}
function settle(waiters, attempt, outcome) {
	const target = waiter(waiters, attempt);
	if (outcome.ok) return target.resolve(outcome.value);
	target.reject(outcome.error);
}
function expired(timer, attempt) {
	switch (timer) {
		case "trace.duration": return {
			type: "trace.duration.elapsed",
			attempt,
			now: performance.now()
		};
		case "trace.stop": return {
			type: "trace.stop.failed",
			attempt,
			error: /* @__PURE__ */ new Error(TRACE_FLUSH_TIMEOUT)
		};
		case "cpu.duration": return {
			type: "cpu.duration.elapsed",
			attempt
		};
		case "cpu.stop": return {
			type: "cpu.stop.failed",
			attempt,
			error: /* @__PURE__ */ new Error(CPU_STOP_TIMEOUT)
		};
		case "heap": return {
			type: "heap.failed",
			attempt,
			error: /* @__PURE__ */ new Error(HEAP_TIMEOUT)
		};
	}
}
//#endregion
//#region ../gui-plugins/src/browser/dialog-machine.ts
var PUBLISH = { type: "publish" };
var createDialogGateState = () => ({
	status: "active",
	issued: 0,
	modal: {
		open: false,
		revision: 0
	},
	runs: /* @__PURE__ */ new Map()
});
function transitionDialogGate(state, event) {
	if (state.status === "disposed") {
		if (event.type !== "run.started") return {
			state,
			effects: []
		};
		return {
			state,
			effects: [],
			reply: {
				status: "refused",
				reason: event.aborted ? "cancelled" : "closed"
			}
		};
	}
	switch (event.type) {
		case "dialog.opened": {
			const interrupted = [...state.runs].filter(([, actionType]) => actionType !== "dialog");
			return {
				state: {
					...state,
					modal: {
						open: true,
						revision: state.modal.revision + 1,
						url: event.url,
						dialog: {
							type: event.dialogType,
							message: event.message,
							defaultValue: event.defaultPrompt
						}
					},
					runs: interrupted.length ? new Map([...state.runs].filter(([, actionType]) => actionType === "dialog")) : state.runs
				},
				effects: [...interrupted.map(([runID, actionType]) => ({
					type: "interrupt-run",
					runID,
					reason: "dialog-interrupted",
					abort: actionType !== "navigate"
				})), PUBLISH]
			};
		}
		case "dialog.closed":
			if (!state.modal.open) return {
				state,
				effects: []
			};
			return {
				state: {
					...state,
					modal: {
						open: false,
						revision: state.modal.revision + 1
					}
				},
				effects: [PUBLISH]
			};
		case "dialog.handled":
			if (!state.modal.open || state.modal.revision !== event.revision) return {
				state,
				effects: []
			};
			return {
				state: {
					...state,
					modal: {
						open: false,
						revision: state.modal.revision + 1
					}
				},
				effects: [PUBLISH]
			};
		case "run.started": {
			if (event.aborted) return {
				state,
				effects: [],
				reply: {
					status: "refused",
					reason: "cancelled"
				}
			};
			if (state.modal.open && event.actionType !== "dialog") return {
				state,
				effects: [],
				reply: {
					status: "refused",
					reason: "dialog-open"
				}
			};
			const runID = state.issued + 1;
			return {
				state: {
					...state,
					issued: runID,
					runs: new Map([...state.runs, [runID, event.actionType]])
				},
				effects: [],
				reply: {
					status: "accepted",
					runID
				}
			};
		}
		case "run.cancelled":
			if (!state.runs.has(event.runID)) return {
				state,
				effects: []
			};
			return {
				state: {
					...state,
					runs: without(state.runs, event.runID)
				},
				effects: [{
					type: "interrupt-run",
					runID: event.runID,
					reason: "cancelled",
					abort: true
				}]
			};
		case "run.finished":
			if (!state.runs.has(event.runID)) return {
				state,
				effects: []
			};
			return {
				state: {
					...state,
					runs: without(state.runs, event.runID)
				},
				effects: []
			};
		case "disposed": return {
			state: { status: "disposed" },
			effects: [...state.runs.keys()].map((runID) => ({
				type: "interrupt-run",
				runID,
				reason: "closed",
				abort: true
			}))
		};
	}
}
/** The open dialog, as `browser.dialog` reports it; null while none is open. */
function selectDialog(state) {
	return state.status === "active" && state.modal.open ? state.modal.dialog : null;
}
/** The open dialog and its revision, which a handle passes back so it closes only that dialog. */
function selectOpenDialog(state) {
	return state.status === "active" && state.modal.open ? state.modal : void 0;
}
/** What a dialog command asks permission for: the dialog's page, or the current page while none is open. */
function selectDialogTarget(state, generation, pageURL) {
	const modal = state.status === "active" ? state.modal : void 0;
	return {
		resources: [modal?.open ? modal.url : pageURL],
		key: `${generation}:${modal?.revision ?? 0}:${Boolean(modal?.open)}`
	};
}
function without(runs, runID) {
	return new Map([...runs].filter(([id]) => id !== runID));
}
//#endregion
//#region ../gui-plugins/src/browser/chromium.ts
var retainedOperations = [
	"navigate",
	"files.list",
	"files.get",
	"trace.stop",
	"trace.analyze",
	"cpu.stop",
	"cpu.analyze",
	"heap.summary",
	"heap.query",
	"heap.object",
	"heap.compare"
];
var pointerOperations = [
	"click",
	"hover",
	"drag",
	"fill",
	"fill_form",
	"select",
	"check",
	"press",
	"scroll",
	"files.drop"
];
var inspectHighlight = {
	showInfo: true,
	showStyles: true,
	showAccessibilityInfo: true,
	colorFormat: "hex",
	contrastAlgorithm: "aa",
	contentColor: {
		r: 111,
		g: 168,
		b: 220,
		a: .66
	},
	paddingColor: {
		r: 147,
		g: 196,
		b: 125,
		a: .55
	},
	borderColor: {
		r: 255,
		g: 229,
		b: 153,
		a: .66
	},
	marginColor: {
		r: 246,
		g: 178,
		b: 107,
		a: .66
	},
	eventTargetColor: {
		r: 255,
		g: 196,
		b: 196,
		a: .66
	},
	shapeColor: {
		r: 96,
		g: 82,
		b: 177,
		a: .8
	},
	shapeMarginColor: {
		r: 96,
		g: 82,
		b: 127,
		a: .6
	}
};
var pickedHighlight = {
	...inspectHighlight,
	showInfo: false,
	showStyles: false,
	showAccessibilityInfo: false
};
var inspectOff = {
	mode: "none",
	highlightConfig: inspectHighlight
};
var zoomSteps = [
	.25,
	.33,
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
	2,
	2.5,
	3,
	4,
	5
];
/** The zoom a key press asks for: the system browser's zoom keys, with the platform's modifier already checked. */
function zoomKey(input) {
	if (input.key === "=" || input.key === "+" || input.code === "NumpadAdd") return "in";
	if (input.key === "-" || input.code === "NumpadSubtract") return "out";
	if (input.key === "0") return "reset";
}
/**
* The address a cookie is removed by: its domain without the leading dot, its path, and its scheme. An IPv6 host
* needs its brackets in a URL.
*/
function cookieURL(cookie) {
	const domain = (cookie.domain ?? "").replace(/^\./, "");
	const host = domain.includes(":") && !domain.startsWith("[") ? `[${domain}]` : domain;
	return `${cookie.secure ? "https" : "http"}://${host}${cookie.path ?? "/"}`;
}
/** The next preset in the direction, or 100%; the current factor at either end. */
function zoomStep(current, direction) {
	if (direction === "reset") return 1;
	if (direction === "in") return zoomSteps.find((step) => step > current + .001) ?? current;
	return zoomSteps.findLast((step) => step < current - .001) ?? current;
}
/** What a command that stopped, or never started, tells the agent. */
function runStopError(reason) {
	switch (reason) {
		case "dialog-open": return /* @__PURE__ */ new Error("A JavaScript dialog is open. Inspect it with browser.dialog({tabID,action:\"get\"}), then explicitly accept or dismiss it before continuing.");
		case "dialog-interrupted": return /* @__PURE__ */ new Error("A JavaScript dialog opened while the action was running. Inspect it with browser.dialog({tabID,action:\"get\"}) and accept or dismiss it. Do not repeat the original action just to close the dialog.");
		case "cancelled": return /* @__PURE__ */ new Error("Browser operation was cancelled. Inspect the tab before deciding to repeat an action; cancellation does not undo changes already made.");
		case "closed": return /* @__PURE__ */ new Error("Browser tab was closed. Call browser.tabs.list({}) and choose an existing tabID; do not reuse the closed tab's refs.");
	}
}
function createBrowserPage(win, options) {
	const policy = { get fileRoots() {
		return options.fileRoots?.() ?? [];
	} };
	const view = new electron.WebContentsView({
		...options.popupOptions,
		webPreferences: {
			partition: options.partition,
			nodeIntegration: false,
			contextIsolation: true,
			sandbox: true,
			webSecurity: true,
			webviewTag: false,
			devTools: false,
			backgroundThrottling: false,
			focusOnNavigation: false
		}
	});
	const contents = view.webContents;
	const detachNetwork = options.network?.attach(contents);
	contents.on("before-input-event", (event, input) => {
		if (input.type !== "keyDown") return;
		if (pageReload(input, process.platform === "darwin")) {
			event.preventDefault();
			contents.reload();
			return;
		}
		if (input.key === "Escape" && isPickerActive(pickerState)) {
			event.preventDefault();
			dispatchPicker({ type: "escape.pressed" });
			return;
		}
		const shortcut = pageShortcut(input, process.platform === "darwin");
		if (shortcut) {
			event.preventDefault();
			options.shortcut?.(shortcut);
			return;
		}
		if (input.alt || !(process.platform === "darwin" ? input.meta : input.control)) return;
		if (input.shift && pageLetter(input) === "c") {
			event.preventDefault();
			dispatchPicker({ type: "inspect.toggled" });
			return;
		}
		const direction = zoomKey(input);
		if (!direction) return;
		event.preventDefault();
		zoom(direction);
	});
	contents.on("zoom-changed", (_event, direction) => zoom(direction));
	const zoom = (direction) => {
		const current = contents.getZoomFactor();
		const next = zoomStep(current, direction);
		if (next === current) return;
		contents.setZoomFactor(next);
		options.zoomed?.();
	};
	let documentState = createDocumentState(options.restore);
	const closed = () => isDocumentClosed(documentState);
	let reported = "";
	const detail = () => {
		if (closed()) return;
		const next = { zoom: Math.min(5, Math.max(.25, contents.getZoomFactor())) };
		const icon = documentIcon(documentState);
		if (icon) next.icon = icon;
		const key = `${next.zoom}:${next.icon ?? ""}`;
		if (key === reported) return;
		reported = key;
		options.detail?.(next);
	};
	const cdp = createCdp(contents);
	const documents = /* @__PURE__ */ new Map();
	const sourceURLs = () => [.../* @__PURE__ */ new Set([contents.getURL(), ...documents.values()])].sort();
	const files = createBrowserFiles(sourceURLs);
	const diagnostics = createDiagnostics(cdp);
	const profiling = createProfiling(contents, cdp, files, sourceURLs, options.shared);
	const refs = /* @__PURE__ */ new Map();
	const picked = /* @__PURE__ */ new Map();
	let pickerState = initialPickerState;
	let pickerTimer;
	const sessions = /* @__PURE__ */ new Map();
	const parents = /* @__PURE__ */ new Map();
	const contexts = /* @__PURE__ */ new Map();
	let dialogGate = createDialogGateState();
	const runs = /* @__PURE__ */ new Map();
	let revision = 0;
	cdp.on("Page.frameNavigated", ({ frame }) => {
		documents.set(frame.id, frame.url);
		revision++;
	});
	cdp.on("Page.frameDetached", ({ frameId }) => {
		documents.delete(frameId);
		revision++;
	});
	const state = () => documentTab(documentState, {
		id: options.id,
		canGoBack: contents.navigationHistory.canGoBack(),
		canGoForward: contents.navigationHistory.canGoForward()
	});
	const publish = (error) => {
		if (!closed()) options.publish(error);
	};
	const dispatch = (event) => {
		const next = transitionDocument(documentState, event);
		documentState = next.state;
		next.effects.forEach((effect) => {
			switch (effect.type) {
				case "reset-document":
					documents.clear();
					refs.clear();
					picked.clear();
					dispatchPicker({ type: "document.changed" });
					break;
				case "clear-diagnostics":
					diagnostics.clear();
					break;
				case "show":
					embed.show(effect.visible);
					break;
				case "publish":
					publish();
					break;
				case "detail":
					detail();
					break;
				case "load-icon": loadIcon(effect.favicons, options.network).then((icon) => dispatch({
					type: "icon.loaded",
					attempt: effect.attempt,
					icon
				}));
			}
		});
	};
	const dispatchDialog = (event) => {
		const next = transitionDialogGate(dialogGate, event);
		dialogGate = next.state;
		next.effects.forEach((effect) => {
			if (effect.type === "publish") return publish();
			const run = runs.get(effect.runID);
			if (!run) return;
			runs.delete(effect.runID);
			if (effect.abort) run.controller.abort();
			run.interrupted.reject(runStopError(effect.reason));
		});
		return next.reply;
	};
	contents.on("did-start-loading", () => dispatch({ type: "loading.started" }));
	contents.on("did-stop-loading", () => dispatch({
		type: "loading.stopped",
		title: contents.getTitle()
	}));
	contents.on("did-start-navigation", (event) => dispatch({
		type: "navigation.started",
		url: event.url,
		isMainFrame: event.isMainFrame,
		isSameDocument: event.isSameDocument
	}));
	contents.on("did-navigate", (_event, url, status, statusText) => dispatch({
		type: "navigation.committed",
		url,
		status,
		statusText,
		title: contents.getTitle()
	}));
	contents.on("did-fail-load", (_event, code, description, url, isMainFrame) => dispatch({
		type: "navigation.failed",
		code,
		description,
		url,
		isMainFrame
	}));
	contents.on("did-navigate-in-page", (_event, url, isMainFrame) => dispatch({
		type: "navigation.in-page",
		url,
		title: contents.getTitle(),
		isMainFrame
	}));
	contents.on("dom-ready", () => dispatch({ type: "document.ready" }));
	contents.on("page-title-updated", () => dispatch({
		type: "title.updated",
		title: contents.getTitle()
	}));
	contents.on("page-favicon-updated", (_event, favicons) => dispatch({
		type: "icon.updated",
		favicons
	}));
	contents.on("focus", () => {
		if (!closed()) options.focused?.();
	});
	contents.on("render-process-gone", () => {
		if (!closed()) options.fail();
	});
	contents.debugger.on("detach", () => {
		if (!closed()) options.fail();
	});
	contents.session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
	contents.session.setPermissionCheckHandler(() => false);
	contents.session.setDevicePermissionHandler(() => false);
	contents.session.setDisplayMediaRequestHandler((_request, callback) => callback({}));
	contents.on("content-bounds-updated", (event) => event.preventDefault());
	const guard = (event) => {
		if (event.url === "about:blank") return;
		if (event.isMainFrame ? allowedDestination(event.url, policy) : !localFileURL(event.url)) return;
		if (!event.isMainFrame && fileURLWithin(event.url, policy.fileRoots ?? [])) return;
		event.preventDefault();
		publish(refusal(event.url, policy) ?? "ERR_BLOCKED_BY_CLIENT");
	};
	contents.on("will-frame-navigate", guard);
	contents.on("will-redirect", guard);
	contents.setWindowOpenHandler(({ url, disposition }) => url === "about:blank" || destinationOrigin(url) ? {
		action: "allow",
		outlivesOpener: true,
		overrideBrowserWindowOptions: { webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			sandbox: true,
			webSecurity: true,
			webviewTag: false,
			devTools: false,
			focusOnNavigation: false,
			partition: options.partition
		} },
		createWindow: (popupOptions) => options.popup(popupOptions, disposition === "background-tab")
	} : { action: "deny" });
	const download = (_event, item, source) => {
		if (source !== contents) return;
		try {
			const file = files.add(item.getFilename(), item.getMimeType() || "application/octet-stream", [...sourceURLs(), ...item.getURLChain()]);
			item.setSavePath(file.path);
			item.on("updated", () => {
				file.bytes = item.getReceivedBytes();
				if (file.bytes > 5242880) item.cancel();
			});
			item.once("done", (_event, status) => {
				file.bytes = item.getReceivedBytes();
				file.state = status === "completed" ? "completed" : "failed";
			});
		} catch {
			item.cancel();
			publish("download_failed");
		}
	};
	contents.session.on("will-download", download);
	cdp.on("Runtime.executionContextCreated", ({ context }, sessionID) => {
		const aux = context.auxData;
		if (aux?.frameId && aux.isDefault) contexts.set(aux.frameId, {
			id: context.id,
			sessionID
		});
	});
	cdp.on("Runtime.executionContextDestroyed", ({ executionContextId }, sessionID) => {
		contexts.forEach((context, key) => {
			if (context.id === executionContextId && context.sessionID === sessionID) contexts.delete(key);
		});
	});
	cdp.on("Target.attachedToTarget", ({ sessionId, targetInfo }, parentSessionID) => {
		if (targetInfo.type !== "iframe") return;
		const parentID = targetInfo.parentFrameId ?? Array.from(sessions).find(([, id]) => id === parentSessionID)?.[0];
		if (parentID) parents.set(targetInfo.targetId, parentID);
		sessions.set(targetInfo.targetId, sessionId);
		Promise.all([
			diagnostics.enable(sessionId),
			cdp.send("Page.enable", {}, sessionId),
			cdp.send("Target.setAutoAttach", {
				autoAttach: true,
				waitForDebuggerOnStart: false,
				flatten: true,
				filter: [{
					type: "iframe",
					exclude: false
				}, { exclude: true }]
			}, sessionId)
		]).catch(() => void 0);
		dispatchPicker({
			type: "frame.attached",
			sessionID: sessionId
		});
	});
	cdp.on("Overlay.inspectNodeRequested", ({ backendNodeId }, sessionID) => void dispatchPicker({
		type: "node.picked",
		backendID: backendNodeId,
		sessionID
	}));
	cdp.on("Target.detachedFromTarget", ({ sessionId }) => {
		sessions.forEach((id, frameID) => {
			if (id === sessionId) {
				sessions.delete(frameID);
				parents.delete(frameID);
			}
		});
	});
	cdp.on("Page.javascriptDialogOpening", (event) => dispatchDialog({
		type: "dialog.opened",
		url: event.url,
		dialogType: event.type,
		message: event.message.slice(0, MAX_TEXT),
		defaultPrompt: event.defaultPrompt ?? ""
	}));
	cdp.on("Page.javascriptDialogClosed", () => dispatchDialog({ type: "dialog.closed" }));
	view.setBounds({
		x: 0,
		y: 0,
		width: 1e3,
		height: 700
	});
	const embed = options.embeds.create(view, win);
	embed.on("visible", (visible) => {
		if (!visible) dispatchPicker({ type: "embed.hidden" });
	});
	const load = (url) => {
		let committed = false;
		const commit = () => {
			committed = true;
		};
		contents.once("did-navigate", commit);
		return contents.loadURL(url).catch((error) => {
			if (!committedLoad(error, committed)) throw error;
		}).finally(() => contents.off("did-navigate", commit));
	};
	const ready = Promise.all([
		files.ready,
		...options.initialize === false ? [] : [load(normalizeURL(options.restore?.url || "about:blank", policy)).catch((error) => {
			if (!options.restore) throw error;
			publish(error.message);
		})],
		diagnostics.enable(),
		cdp.send("Page.enable"),
		cdp.send("DOM.enable"),
		cdp.send("Target.setAutoAttach", {
			autoAttach: true,
			waitForDebuggerOnStart: false,
			flatten: true,
			filter: [{
				type: "iframe",
				exclude: false
			}, { exclude: true }]
		})
	]).then(() => void 0);
	return {
		view,
		contents,
		state,
		ready,
		/** The host embed the renderer lays this page out with. */
		embed: embed.id,
		async inspect(enabled) {
			if (closed()) return;
			await ready;
			await dispatchPicker({
				type: "inspect.set",
				enabled
			});
		},
		async highlight(ref) {
			if (closed()) return;
			await dispatchPicker({
				type: "highlight.requested",
				target: ref ? picked.get(ref.replace(/^@/, "")) : void 0
			});
		},
		zoom(direction) {
			if (!closed()) zoom(direction);
		},
		async site() {
			const url = contents.getURL();
			if (closed() || !destinationOrigin(url)) return { cookies: 0 };
			return { cookies: (await contents.session.cookies.get({ url })).length };
		},
		/**
		* Deletes what the page's site stored: the cookies its address can read, and its origin's storage. Resolves once
		* the page reloaded without them, so a count read next includes what the reload set again.
		*/
		async clearSite() {
			const url = contents.getURL();
			const origin = destinationOrigin(url);
			if (closed() || !origin) return;
			const cookies = await contents.session.cookies.get({ url });
			await Promise.all(cookies.map((cookie) => contents.session.cookies.remove(cookieURL(cookie), cookie.name)));
			await contents.session.clearStorageData({
				origin,
				storages: [
					"localstorage",
					"indexdb",
					"serviceworkers",
					"cachestorage",
					"filesystem",
					"shadercache"
				]
			});
			if (closed()) return;
			contents.reload();
			await waitFor(() => closed() || !contents.isLoading(), new AbortController().signal, 3e4).catch(() => void 0);
		},
		/** Reports the page's icon and zoom when either changed since the last report. */
		detail,
		async execute(command, signal) {
			await ready;
			const reply = dispatchDialog({
				type: "run.started",
				actionType: command.action.type,
				aborted: signal.aborted
			});
			if (reply?.status !== "accepted") throw runStopError(reply?.reason ?? "closed");
			const runID = reply.runID;
			const run = {
				controller: new AbortController(),
				interrupted: Promise.withResolvers()
			};
			runs.set(runID, run);
			const cancel = () => dispatchDialog({
				type: "run.cancelled",
				runID
			});
			signal.addEventListener("abort", cancel, { once: true });
			try {
				return await Promise.race([perform(command, run.controller.signal), run.interrupted.promise]);
			} finally {
				signal.removeEventListener("abort", cancel);
				runs.delete(runID);
				dispatchDialog({
					type: "run.finished",
					runID
				});
			}
		},
		async dispose() {
			if (closed()) return;
			dispatch({ type: "disposed" });
			dispatchDialog({ type: "disposed" });
			dispatchPicker({ type: "disposed" });
			clearTimeout(pickerTimer);
			detachNetwork?.();
			contents.session.off("will-download", download);
			await profiling.dispose();
			cdp.dispose();
			refs.clear();
			picked.clear();
			embed.dispose();
			if (!contents.isDestroyed()) contents.close({ waitForBeforeUnload: false });
			await files.dispose();
		}
	};
	async function perform(command, signal) {
		if (isPickerActive(pickerState) && pointerOperations.includes(command.action.type)) await dispatchPicker({ type: "pointer.command" });
		if (command.inspect) return {
			value: await inspect(command.action),
			files: []
		};
		if (command.target && JSON.stringify(await inspect(command.action)) !== JSON.stringify(command.target)) throw new Error("Browser target changed while permission was pending. Take a fresh snapshot or listing and request the action again; it was not executed.");
		if (command.generation !== void 0 && command.generation !== documentGeneration(documentState) && !retainedOperations.includes(command.action.type)) throw new Error("The document changed before this operation ran. Call browser.tabs.list({}) to check its current URL, then browser.snapshot({tabID}) for fresh refs. Reconsider the action before retrying on the new page.");
		abortError(signal);
		return execute(command.action, command.files, signal, command.target);
	}
	async function execute(action, transfers, signal, approved) {
		const captureSources = sourceURLs();
		const transfer = (id) => files.transfer(id, approved?.resources);
		const result = (value, attached = []) => {
			const json = decodeUnknownSync(Json)(value);
			if (JSON.stringify(json).length > 512e3) throw new Error("Browser result exceeds 512000 JSON characters. Request fewer entries, reduce snapshot depth, or return only selected fields from the evaluation script. Repeating the same request will not reduce its output.");
			return {
				value: json,
				files: attached
			};
		};
		switch (action.type) {
			case "navigate": {
				const url = normalizeURL(action.url, policy);
				const cancel = () => contents.stop();
				signal.addEventListener("abort", cancel, { once: true });
				try {
					await load(url);
				} finally {
					signal.removeEventListener("abort", cancel);
				}
				abortError(signal);
				return result(state());
			}
			case "back":
			case "forward":
			case "reload":
			case "stop":
				if (action.type === "back" && contents.navigationHistory.canGoBack()) contents.navigationHistory.goBack();
				if (action.type === "forward" && contents.navigationHistory.canGoForward()) contents.navigationHistory.goForward();
				if (action.type === "reload") contents.reload();
				if (action.type === "stop") contents.stop();
				if (action.type !== "stop") await waitFor(() => !contents.isLoading(), signal, 3e4);
				return result(state());
			case "frames": return result({
				tab: state(),
				frames: await frames()
			});
			case "snapshot":
			case "find": return result({
				tab: state(),
				...await snapshot(action)
			});
			case "evaluate": {
				if (action.ref && action.frameID) throw new Error("Pass either ref or frameID to browser.evaluate, not both. A ref already runs in its element's frame.");
				const context = action.frameID ? contexts.get(action.frameID) : void 0;
				if (action.frameID && !context) throw new Error("Frame context is unavailable. Call browser.frames({tabID}) and use a current frameID from this tab, or omit frameID to target the main frame.");
				const element = action.ref ? target(action.ref) : void 0;
				const objectId = element ? await resolve(element) : void 0;
				const value = await (element && objectId ? cdp.send("Runtime.callFunctionOn", {
					objectId,
					functionDeclaration: action.script,
					arguments: [{ objectId }],
					awaitPromise: true,
					returnByValue: true,
					userGesture: true
				}, element.sessionID).finally(() => cdp.send("Runtime.releaseObject", { objectId }, element.sessionID).catch(() => void 0)) : cdp.send("Runtime.evaluate", {
					expression: action.script,
					contextId: context?.id,
					awaitPromise: true,
					returnByValue: true,
					userGesture: true
				}, context?.sessionID));
				if (value.exceptionDetails) throw new Error(`Page JavaScript threw an exception. Check the script and ${action.ref ? "ref" : "frameID"}; inspect the page before repeating code with side effects. Details: ${(value.exceptionDetails.exception?.description ?? value.exceptionDetails.text).slice(0, 800)}`);
				abortError(signal);
				return result({
					tab: state(),
					value: value.result.value ?? null
				});
			}
			case "click":
				await click(target(action.ref), action.button ?? "left", action.count ?? 1, action.modifiers);
				break;
			case "hover":
				await cdp.send("Input.dispatchMouseEvent", {
					type: "mouseMoved",
					...await point(target(action.ref))
				});
				break;
			case "drag": {
				const source = target(action.from);
				const destination = target(action.to);
				await point(destination);
				const from = await point(source);
				const box = await rect(destination);
				const to = {
					x: box.x + box.width / 2,
					y: box.y + box.height / 2
				};
				const html5 = await call(source, "function() { return this.draggable; }");
				let data;
				const off = cdp.on("Input.dragIntercepted", (event) => {
					data = event.data;
				});
				await cdp.send("Input.setInterceptDrags", { enabled: true });
				await cdp.send("Input.dispatchMouseEvent", {
					type: "mouseMoved",
					...from
				});
				await cdp.send("Input.dispatchMouseEvent", {
					type: "mousePressed",
					...from,
					button: "left",
					buttons: 1,
					clickCount: 1
				});
				try {
					for (let i = 1; i <= 10; i++) {
						abortError(signal);
						await cdp.send("Input.dispatchMouseEvent", {
							type: "mouseMoved",
							x: from.x + (to.x - from.x) * i / 10,
							y: from.y + (to.y - from.y) * i / 10,
							button: "left",
							buttons: 1
						});
					}
					if (html5) await waitFor(() => data !== void 0, signal, 2e3);
					if (data) for (const type of [
						"dragEnter",
						"dragOver",
						"drop"
					]) await cdp.send("Input.dispatchDragEvent", {
						type,
						...to,
						data
					});
				} finally {
					off();
					await cdp.send("Input.setInterceptDrags", { enabled: false });
					await cdp.send("Input.dispatchMouseEvent", {
						type: "mouseReleased",
						...to,
						button: "left",
						clickCount: 1
					});
				}
				break;
			}
			case "fill":
				await fill(target(action.ref), action.text, signal);
				break;
			case "fill_form":
				for (const field of action.fields) {
					abortError(signal);
					if (field.type === "text") await fill(target(field.ref), field.value, signal);
					if (field.type === "select") await select(target(field.ref), field.values);
					if (field.type === "check") await check(target(field.ref), field.checked);
				}
				break;
			case "select":
				await select(target(action.ref), action.values);
				break;
			case "check":
				await check(target(action.ref), action.checked);
				break;
			case "press":
				await key(action.key);
				break;
			case "scroll": {
				const bounds = view.getBounds();
				await cdp.send("Input.dispatchMouseEvent", {
					type: "mouseWheel",
					x: bounds.width / 2,
					y: bounds.height / 2,
					deltaX: action.deltaX ?? 0,
					deltaY: action.deltaY
				});
				break;
			}
			case "wait":
				if (action.condition !== "load" && !action.text) throw new Error("browser.wait requires non-empty text for condition \"text\" or \"textGone\". Use condition \"load\" without text to wait for loading.");
				await waitFor(async () => {
					if (action.condition === "load") return !contents.isLoading();
					const context = action.frameID ? contexts.get(action.frameID) : void 0;
					if (action.frameID && !context) throw new Error("Frame context is unavailable. Call browser.frames({tabID}) and use a frameID from this tab.");
					const value = await cdp.send("Runtime.evaluate", {
						expression: `document.body?.innerText.includes(${JSON.stringify(action.text)}) ?? false`,
						returnByValue: true,
						contextId: context?.id
					}, context?.sessionID);
					return Boolean(value.result.value) === (action.condition === "text");
				}, signal, action.timeoutMs).catch((error) => {
					if (signal.aborted) throw error;
					throw new Error(`browser.wait failed for condition ${JSON.stringify(action.condition)} (timeoutMs: ${action.timeoutMs ?? 1e4}). Inspect browser.snapshot({tabID}) and check text/frameID before retrying; timeoutMs can be increased up to 30000 for a genuinely slow page. Details: ${error instanceof Error ? error.message : String(error)}`);
				});
				break;
			case "screenshot": {
				if (action.ref && action.fullPage) throw new Error("Choose either ref for an element screenshot or fullPage:true for the whole page. Remove the other argument before retrying.");
				await waitFor(() => view.getVisible() && win.isVisible() && !win.isMinimized(), signal, 3e3).catch((error) => {
					if (signal.aborted) throw error;
					throw new Error("Screenshot needs a visible tab. Call browser.tabs.focus and keep its desktop window visible.");
				});
				const element = action.ref ? await rect(target(action.ref), true) : void 0;
				const metrics = await cdp.send("Page.getLayoutMetrics");
				const bounds = element ? {
					...element,
					x: element.x + metrics.cssVisualViewport.pageX,
					y: element.y + metrics.cssVisualViewport.pageY
				} : action.fullPage ? metrics.cssContentSize : {
					x: metrics.cssVisualViewport.pageX,
					y: metrics.cssVisualViewport.pageY,
					width: metrics.cssVisualViewport.clientWidth,
					height: metrics.cssVisualViewport.clientHeight
				};
				const pixelRatio = contents.getZoomFactor() * electron.screen.getDisplayMatching(win.getBounds()).scaleFactor;
				const scale = Math.min(1, (action.maxWidth ?? 2e3) / (bounds.width * pixelRatio));
				if (bounds.width <= 0 || bounds.height <= 0) throw new Error("Element or page has no visible screenshot area. Take a fresh snapshot and choose a visible element, or omit ref to capture the viewport.");
				if (bounds.width * bounds.height * (scale * pixelRatio) ** 2 > 16e6) throw new Error("Screenshot exceeds 16 megapixels; capture an element or use a smaller maxWidth.");
				const format = action.format ?? "jpeg";
				const capture = await cdp.send("Page.captureScreenshot", {
					format,
					quality: format === "png" ? void 0 : action.quality ?? 80,
					captureBeyondViewport: true,
					clip: {
						...bounds,
						scale
					}
				});
				const id = await files.save(`screenshot.${format}`, `image/${format}`, Buffer.from(capture.data, "base64"), [...captureSources, ...sourceURLs()]);
				return result({ tab: state() }, [await transfer(id)]);
			}
			case "dialog":
				if (action.action !== "get") {
					const open = selectOpenDialog(dialogGate);
					if (!open) throw new Error("This tab has no JavaScript dialog to handle. browser.dialog({tabID,action:\"get\"}) returns null when none is open; continue without accepting or dismissing one.");
					await cdp.send("Page.handleJavaScriptDialog", {
						accept: action.action === "accept",
						promptText: action.promptText
					});
					dispatchDialog({
						type: "dialog.handled",
						revision: open.revision
					});
				}
				return result({
					tab: state(),
					dialog: selectDialog(dialogGate)
				});
			case "files.upload":
			case "files.drop": {
				if (!transfers.length) throw new Error("Upload command has no file bytes. Supply server-local paths to browser.files.upload/drop; do not call the desktop RPC directly with desktop paths. If paths were supplied, report a client/server transfer mismatch.");
				const local = await Promise.all(transfers.map(async (file) => files.get(await files.save(file.name, file.mime, file.data)).path));
				const element = target(action.ref);
				if (action.type === "files.upload") await cdp.send("DOM.setFileInputFiles", {
					files: local,
					backendNodeId: element.backendID
				}, element.sessionID);
				if (action.type === "files.drop") {
					const position = await point(element);
					for (const type of [
						"dragEnter",
						"dragOver",
						"drop"
					]) await cdp.send("Input.dispatchDragEvent", {
						type,
						...position,
						data: {
							items: [],
							files: local,
							dragOperationsMask: 1
						}
					});
				}
				break;
			}
			case "files.list": return result({
				tab: state(),
				files: files.list()
			});
			case "files.get": return result({ tab: state() }, [await transfer(action.fileID)]);
			case "console": return result({
				tab: state(),
				...diagnostics.console(action)
			});
			case "network.list": return result({
				tab: state(),
				...diagnostics.list(action)
			});
			case "network.get": return result({
				tab: state(),
				...await diagnostics.get(action)
			});
			case "trace.start":
				await profiling.startTrace(action.durationMs);
				return result({
					tab: state(),
					recording: true
				});
			case "trace.stop": {
				const value = await profiling.stopTrace();
				return result({
					tab: state(),
					durationMs: value.durationMs,
					incomplete: value.incomplete
				}, [await transfer(value.id)]);
			}
			case "cpu.start":
				await profiling.startCpu();
				return result({
					tab: state(),
					recording: true
				});
			case "cpu.stop": {
				const value = await profiling.stopCpu();
				return result({
					tab: state(),
					durationMs: value.durationMs
				}, [await transfer(value.id)]);
			}
			case "heap.snapshot": return result({ tab: state() }, [await transfer(await profiling.heap())]);
			case "trace.analyze":
			case "cpu.analyze":
			case "heap.summary":
			case "heap.query":
			case "heap.object":
			case "heap.compare": return result({
				tab: state(),
				...await profiling.analyze(action)
			});
			case "lighthouse": {
				const { audit } = await import("./lighthouse-vg_B9Ahh.js");
				const report = await audit(contents, files, cdp, captureSources);
				return result({
					tab: state(),
					scores: report.scores,
					failures: report.failures
				}, await Promise.all(report.files.map(transfer)));
			}
			default: throw new Error("This operation was routed to a page instead of the tab manager. Report a desktop/plugin routing mismatch; changing tab IDs or repeating the operation will not fix it.");
		}
		abortError(signal);
		return result(state());
	}
	async function inspect(action) {
		if (action.type === "dialog") return selectDialogTarget(dialogGate, documentGeneration(documentState), contents.getURL());
		const fileIDs = action.type === "heap.compare" ? [action.before, action.after] : "fileID" in action ? [action.fileID] : [];
		if (fileIDs.length) return {
			resources: [...new Set(fileIDs.flatMap((id) => files.get(id).resources))].sort(),
			key: JSON.stringify(fileIDs)
		};
		if (action.type === "network.get") return {
			resources: [diagnostics.info(action.id).url],
			key: action.id
		};
		if (action.type === "trace.stop" || action.type === "cpu.stop") return profiling.target(action.type === "trace.stop" ? "trace" : "cpu");
		const tree = await frames();
		tree.forEach((frame) => documents.set(frame.id, frame.url));
		const selected = (action.type === "drag" ? [action.from, action.to] : action.type === "fill_form" ? action.fields.map((field) => field.ref) : "ref" in action && action.ref ? [action.ref] : []).map(target);
		const urls = (selected.length ? selected.map((element) => element.frameID) : "frameID" in action && action.frameID ? [action.frameID] : []).map((id) => {
			const frame = tree.find((frame) => frame.id === id);
			if (!frame) throw new Error("Frame is unavailable. Call browser.frames({tabID}) and use a current frameID.");
			return frame.url;
		});
		const capture = [
			"screenshot",
			"lighthouse",
			"trace.start",
			"cpu.start",
			"heap.snapshot"
		].includes(action.type);
		return {
			resources: [...new Set(action.type === "navigate" ? [new URL(normalizeURL(action.url, policy)).href] : capture ? sourceURLs() : urls.length ? urls : [contents.getURL()])].sort(),
			key: JSON.stringify([
				documentGeneration(documentState),
				revision,
				selected
			])
		};
	}
	function target(ref) {
		const key = ref.replace(/^@/, "");
		const value = refs.get(key) ?? picked.get(key);
		if (!value) throw new Error("Element ref is stale or belongs to another tab. Call browser.snapshot({tabID}) and use a ref from that tab's newest snapshot. Do not reuse refs after navigation or a newer snapshot.");
		return value;
	}
	async function frames() {
		const root = await cdp.send("Page.getFrameTree");
		const result = [];
		const walk = (tree, parentID) => {
			if (!result.some((frame) => frame.id === tree.frame.id)) result.push(tree.frame.parentId || parentID ? {
				id: tree.frame.id,
				parentID: tree.frame.parentId ?? parentID,
				url: tree.frame.url,
				name: tree.frame.name ?? ""
			} : {
				id: tree.frame.id,
				url: tree.frame.url,
				name: tree.frame.name ?? ""
			});
			tree.childFrames?.forEach((child) => walk(child, tree.frame.id));
		};
		walk(root.frameTree);
		(await Promise.all(Array.from(sessions, async ([id, sessionID]) => ({
			id,
			tree: await cdp.send("Page.getFrameTree", {}, sessionID).catch(() => void 0)
		})))).forEach(({ id, tree }) => {
			if (tree) walk(tree.frameTree, parents.get(id) ?? root.frameTree.frame.id);
		});
		return result;
	}
	async function call(element, functionDeclaration, args = []) {
		const objectId = await resolve(element);
		try {
			const result = await cdp.send("Runtime.callFunctionOn", {
				objectId,
				functionDeclaration,
				arguments: args.map((value) => ({ value })),
				returnByValue: true,
				awaitPromise: true,
				userGesture: true
			}, element.sessionID);
			if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
			return result.result.value;
		} finally {
			await cdp.send("Runtime.releaseObject", { objectId }, element.sessionID).catch(() => void 0);
		}
	}
	async function resolve(element) {
		const object = await cdp.send("DOM.resolveNode", { backendNodeId: element.backendID }, element.sessionID);
		if (!object.object.objectId) throw new Error("Element is no longer available. Call browser.snapshot({tabID}) and use a fresh ref; the page may have replaced the element.");
		return object.object.objectId;
	}
	async function rect(element, scroll = false) {
		if (scroll) {
			await cdp.send("DOM.scrollIntoViewIfNeeded", { backendNodeId: element.backendID }, element.sessionID);
			await contents.capturePage(void 0, {
				stayHidden: false,
				stayAwake: true
			});
		}
		const bounds = Struct({
			x: Finite,
			y: Finite,
			width: Finite,
			height: Finite
		});
		const value = { ...decodeUnknownSync(bounds)(await call(element, "function() { const r = this.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; }")) };
		const tree = await frames();
		let frame = tree.find((frame) => frame.id === element.frameID);
		while (frame?.parentID) {
			const parent = {
				frameID: frame.parentID,
				sessionID: sessionFor(frame.parentID, tree)
			};
			const owner = await cdp.send("DOM.getFrameOwner", { frameId: frame.id }, parent.sessionID);
			const box = decodeUnknownSync(Struct({
				...bounds.fields,
				scaleX: Finite,
				scaleY: Finite
			}))(await call({
				backendID: owner.backendNodeId,
				...parent
			}, "function() { const r = this.getBoundingClientRect(); const sx = this.offsetWidth ? r.width / this.offsetWidth : 1; const sy = this.offsetHeight ? r.height / this.offsetHeight : 1; return {x:r.x+this.clientLeft*sx,y:r.y+this.clientTop*sy,width:r.width,height:r.height,scaleX:sx,scaleY:sy}; }"));
			value.x = box.x + value.x * box.scaleX;
			value.y = box.y + value.y * box.scaleY;
			value.width *= box.scaleX;
			value.height *= box.scaleY;
			frame = tree.find((item) => item.id === frame?.parentID);
		}
		return value;
	}
	function sessionFor(frameID, tree) {
		let id = frameID;
		while (id && !sessions.has(id)) id = tree.find((frame) => frame.id === id)?.parentID;
		return id ? sessions.get(id) : void 0;
	}
	async function point(element) {
		const box = await rect(element, true);
		return {
			x: box.x + box.width / 2,
			y: box.y + box.height / 2
		};
	}
	async function click(element, button = "left", count = 1, modifiers = []) {
		const position = await point(element);
		const flags = modifiers.reduce((mask, key) => mask | ({
			Alt: 1,
			Control: 2,
			Meta: 4,
			Shift: 8
		}[key] ?? 0), 0);
		await cdp.send("Input.dispatchMouseEvent", {
			type: "mouseMoved",
			...position,
			modifiers: flags
		});
		for (let clickCount = 1; clickCount <= count; clickCount++) {
			await cdp.send("Input.dispatchMouseEvent", {
				type: "mousePressed",
				...position,
				button,
				clickCount,
				modifiers: flags
			});
			await cdp.send("Input.dispatchMouseEvent", {
				type: "mouseReleased",
				...position,
				button,
				clickCount,
				modifiers: flags
			});
		}
	}
	async function fill(element, value, signal) {
		const kind = await call(element, "function() { if (this.disabled || this.readOnly) return; if (this instanceof HTMLTextAreaElement || this.isContentEditable) return 'text'; if (!(this instanceof HTMLInputElement)) return; if (['date','time','datetime-local','month','week'].includes(this.type)) return 'structured'; if (!['file','checkbox','radio','button','submit','reset','image','hidden','range','color'].includes(this.type)) return 'text'; }");
		if (!kind) throw new Error("Target is not an enabled editable text field. Take a fresh snapshot and choose a textbox; use browser.select for dropdowns, browser.check for checkboxes/radios, or browser.files.upload for file inputs.");
		if (kind === "structured") {
			await call(element, "function(value) { const previous = this.value; this.focus(); this.value = value; if (this.value !== value) { this.value = previous; throw new Error('The ' + this.type + ' input rejected this value and keeps its previous one. Use its required format, for example 2026-09-07 for date, 14:45 for time, 2026-09-07T14:45 for datetime-local, 2026-09 for month, or 2026-W37 for week.'); } this.dispatchEvent(new Event('input',{bubbles:true})); this.dispatchEvent(new Event('change',{bubbles:true})); }", [value]);
			return;
		}
		await cdp.send("DOM.focus", { backendNodeId: element.backendID }, element.sessionID);
		abortError(signal);
		await key(process.platform === "darwin" ? "Meta+A" : "Control+A");
		await key("Backspace");
		abortError(signal);
		await cdp.send("Input.insertText", { text: value });
	}
	async function select(element, values) {
		await call(element, `function(values) { if (!(this instanceof HTMLSelectElement) || this.disabled) throw new Error('Target is not an enabled HTML select. Take a fresh snapshot and choose an enabled dropdown ref.'); if (!this.multiple && values.length !== 1) throw new Error('This dropdown accepts exactly one value; pass a one-item values array.'); for (const value of values) if (!Array.from(this.options).some(option => option.value === value && !option.disabled)) throw new Error('Option value was not found or is disabled. Inspect option values with browser.evaluate before retrying browser.select; values are not visible labels.'); for (const option of this.options) option.selected = values.includes(option.value); this.dispatchEvent(new Event('input',{bubbles:true})); this.dispatchEvent(new Event('change',{bubbles:true})); }`, [values]);
	}
	async function check(element, checked) {
		if (await call(element, "function(checked) { if (!(this instanceof HTMLInputElement) || !['checkbox','radio'].includes(this.type) || this.disabled) throw new Error('Target is not an enabled checkbox or radio. Take a fresh snapshot and choose the correct ref.'); if (this.type === 'radio' && this.checked && !checked) throw new Error('A selected radio cannot be cleared by clicking it. Select a different radio in its group instead.'); return this.checked; }", [checked]) !== checked) await click(element);
		if (await call(element, "function() { return this.checked; }") !== checked) throw new Error("The page did not keep the requested checked state. Inspect the current snapshot and page validation before retrying; do not blindly toggle the control again.");
	}
	async function key(chord) {
		if (!chord) throw new Error("A key is required. Use a named key such as Enter or ArrowDown, a single character, or a chord such as Control+A.");
		const parts = (chord.endsWith("+") ? chord.slice(0, -1) : chord).split("+");
		const key = parts.pop() || "+";
		const modifiers = parts.reduce((mask, key) => {
			const bit = {
				Alt: 1,
				Control: 2,
				Meta: 4,
				Shift: 8
			}[key];
			if (!bit) throw new Error(`Unknown key modifier ${JSON.stringify(key)}. Supported modifiers are Alt, Control, Meta, and Shift; for example Control+A. Use Meta for macOS command shortcuts.`);
			return mask | bit;
		}, 0);
		const code = {
			Enter: 13,
			Tab: 9,
			Escape: 27,
			Backspace: 8,
			Delete: 46,
			ArrowUp: 38,
			ArrowDown: 40,
			ArrowLeft: 37,
			ArrowRight: 39,
			PageUp: 33,
			PageDown: 34,
			Home: 36,
			End: 35,
			Space: 32
		}[key] ?? (key.length === 1 ? key.toUpperCase().charCodeAt(0) : /^F([1-9]|1[0-2])$/.test(key) ? 111 + Number(key.slice(1)) : void 0);
		if (code === void 0) throw new Error(`Unknown key ${JSON.stringify(key)}. Use Enter, Tab, Escape, Backspace, Delete, ArrowUp/Down/Left/Right, PageUp/Down, Home, End, Space, F1–F12, or one character. Use browser.fill for text.`);
		const text = key === "Enter" ? "\r" : key === "Space" ? " " : key.length === 1 ? key : void 0;
		const event = {
			key: key === "Space" ? " " : key,
			windowsVirtualKeyCode: code,
			modifiers
		};
		const params = text !== void 0 && !(modifiers & 6) ? {
			...event,
			text
		} : event;
		await cdp.send("Input.dispatchKeyEvent", {
			type: "keyDown",
			...params
		});
		await cdp.send("Input.dispatchKeyEvent", {
			type: "keyUp",
			...params
		});
	}
	async function snapshot(action) {
		const tree = await frames();
		const selected = action.type === "snapshot" && action.ref ? target(action.ref) : void 0;
		const frameID = selected?.frameID ?? action.frameID ?? tree[0]?.id;
		if (!frameID || !tree.some((frame) => frame.id === frameID)) throw new Error("Frame is unavailable. Call browser.frames({tabID}) and use a current frameID from this tab; omit frameID for the main frame.");
		const sessionID = sessionFor(frameID, tree);
		const depth = action.type === "snapshot" ? action.depth ?? 8 : 8;
		const ax = await cdp.send("Accessibility.getFullAXTree", {
			frameId: frameID,
			depth
		}, sessionID);
		const nodes = new Map(ax.nodes.map((node) => [node.nodeId, node]));
		const root = selected ? ax.nodes.find((node) => node.backendDOMNodeId === selected.backendID) : ax.nodes[0];
		if (!root) throw new Error("Element is absent from this frame's accessibility snapshot. Retry browser.snapshot with the same tabID and no ref to refresh the frame, then choose a returned ref.");
		refs.clear();
		const pinned = new Map(Array.from(picked, ([ref, element]) => [`${element.frameID}:${element.backendID}`, ref]));
		const lines = [];
		let truncated = false;
		const walk = async (node, level) => {
			if (level > depth || lines.length >= 500) {
				truncated = true;
				return;
			}
			const role = String(node.role?.value ?? "node").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
			const properties = new Map(node.properties?.map((property) => [property.name, property.value.value]) ?? []);
			if (!node.ignored) {
				const actionable = role !== "RootWebArea" && (properties.get("focusable") || /^(button|link|textbox|combobox|checkbox|radio|option)$/.test(role));
				const known = node.backendDOMNodeId ? pinned.get(`${frameID}:${node.backendDOMNodeId}`) : void 0;
				const ref = known ?? (actionable && node.backendDOMNodeId ? options.shared.ref() : "");
				const element = node.backendDOMNodeId ? {
					backendID: node.backendDOMNodeId,
					frameID,
					sessionID
				} : void 0;
				if (ref && element && !known) refs.set(ref, element);
				const flags = [
					"checked",
					"disabled",
					"expanded",
					"selected"
				].flatMap((name) => properties.has(name) ? [`${name}=${properties.get(name)}`] : []);
				const box = action.type === "snapshot" && action.boxes && ref && element ? await rect(element).catch(() => void 0) : void 0;
				lines.push(`${"  ".repeat(level)}${ref ? `@${ref} ` : ""}[${role}] ${JSON.stringify(String(node.name?.value ?? "").replace(/\s+/g, " ").slice(0, 300))} ${flags.join(" ")}${box ? ` box=${JSON.stringify(box)}` : ""}`);
			}
			if (["textbox", "searchbox"].includes(role) || properties.get("editable")) return;
			for (const childID of node.childIds ?? []) {
				const child = nodes.get(childID);
				if (child) await walk(child, level + 1);
			}
		};
		await walk(root, 0);
		const content = (action.type === "find" ? lines.filter((line) => line.toLowerCase().includes(action.text.toLowerCase())) : lines).join("\n");
		return {
			content: content.slice(0, MAX_TEXT),
			truncated: truncated || content.length > 1e5
		};
	}
	/** Moves the picker and runs its effects; resolves once they ran, so input waits for the picker to disarm. */
	async function dispatchPicker(event) {
		const next = transitionPicker(pickerState, event);
		pickerState = next.state;
		await Promise.all(next.effects.map(runPicker));
	}
	async function runPicker(effect) {
		switch (effect.type) {
			case "arm": {
				const attempt = effect.attempt;
				const frames = Array.from(sessions.values(), (id) => arm(attempt, id).catch(() => void 0));
				return Promise.all([arm(attempt), ...frames]).then(() => dispatchPicker({
					type: "arm.succeeded",
					attempt
				}), () => dispatchPicker({
					type: "arm.failed",
					attempt
				}));
			}
			case "arm-frame": return arm(effect.attempt, effect.sessionID).catch(() => void 0);
			case "disarm": return disarm();
			case "describe": {
				const attempt = effect.attempt;
				return describePick(effect.backendID, effect.sessionID).then((pick) => dispatchPicker({
					type: "describe.succeeded",
					attempt,
					target: pick.target,
					element: pick.element
				}), () => dispatchPicker({
					type: "describe.failed",
					attempt
				}));
			}
			case "pick": {
				const ref = options.shared.ref();
				picked.set(ref, effect.target);
				if (!win.isDestroyed() && win.isFocused()) win.webContents.focus();
				options.inspect?.({
					active: false,
					element: {
						ref: Ref.make(ref),
						...effect.element
					}
				});
				return;
			}
			case "flash": {
				const attempt = effect.attempt;
				const target = effect.target;
				return cdp.send("DOM.scrollIntoViewIfNeeded", { backendNodeId: target.backendID }, target.sessionID).then(() => cdp.send("Overlay.highlightNode", {
					backendNodeId: target.backendID,
					highlightConfig: pickedHighlight
				}, target.sessionID)).then(() => dispatchPicker({
					type: "flash.shown",
					attempt
				}), () => dispatchPicker({
					type: "flash.failed",
					attempt
				}));
			}
			case "hide-highlight": return hideHighlight();
			case "report":
				options.inspect?.({ active: effect.active });
				return;
			case "timer": {
				const attempt = effect.attempt;
				const phase = effect.phase;
				clearTimeout(pickerTimer);
				pickerTimer = setTimeout(() => void dispatchPicker({
					type: "timeout",
					phase,
					attempt
				}), PICKER_TIMEOUT_MS[phase]);
			}
		}
	}
	async function arm(attempt, sessionID) {
		if (sessionID) await cdp.send("DOM.enable", {}, sessionID);
		await cdp.send("Overlay.enable", {}, sessionID);
		if (pickerAttempt(pickerState) !== attempt) return;
		await cdp.send("Overlay.setInspectMode", {
			mode: "searchForNode",
			highlightConfig: inspectHighlight
		}, sessionID);
	}
	async function disarm() {
		await Promise.all([void 0, ...sessions.values()].map((id) => cdp.send("Overlay.setInspectMode", inspectOff, id).catch(() => void 0)));
	}
	async function describePick(backendID, sessionID) {
		await disarm();
		await cdp.send("Overlay.highlightNode", {
			backendNodeId: backendID,
			highlightConfig: pickedHighlight
		}, sessionID);
		const target = {
			backendID,
			frameID: await frameOf(backendID, sessionID),
			sessionID
		};
		const [details, box, accessible] = await Promise.all([
			describe(target),
			rect(target),
			accessibility(target)
		]);
		await painted(sessionID);
		const zoom = contents.getZoomFactor();
		return {
			target,
			element: {
				...details,
				...accessible,
				rect: {
					x: box.x * zoom,
					y: box.y * zoom,
					width: box.width * zoom,
					height: box.height * zoom
				}
			}
		};
	}
	async function hideHighlight() {
		await Promise.all([void 0, ...sessions.values()].map((sessionID) => cdp.send("Overlay.hideHighlight", {}, sessionID).catch(() => void 0)));
	}
	async function frameOf(backendID, sessionID) {
		const tree = await frames();
		const owned = tree.filter((frame) => sessionFor(frame.id, tree) === sessionID);
		const root = owned.find((frame) => !frame.parentID || sessionFor(frame.parentID, tree) !== sessionID) ?? tree[0];
		const nested = owned.filter((frame) => frame !== root);
		if (!nested.length) return root.id;
		const objectGroup = `frame-of-${crypto.randomUUID()}`;
		const described = await (async () => {
			const node = await cdp.send("DOM.resolveNode", {
				backendNodeId: backendID,
				objectGroup
			}, sessionID);
			const document = node.object.objectId ? await cdp.send("Runtime.callFunctionOn", {
				objectId: node.object.objectId,
				functionDeclaration: "function() { return this.ownerDocument; }",
				objectGroup
			}, sessionID) : void 0;
			return document?.result.objectId ? await cdp.send("DOM.describeNode", { objectId: document.result.objectId }, sessionID) : void 0;
		})().finally(() => void cdp.send("Runtime.releaseObjectGroup", { objectGroup }, sessionID).catch(() => void 0));
		return (await Promise.all(nested.map(async (frame) => {
			const owner = await cdp.send("DOM.getFrameOwner", { frameId: frame.id }, sessionID).catch(() => void 0);
			const iframe = owner ? await cdp.send("DOM.describeNode", { backendNodeId: owner.backendNodeId }, sessionID).catch(() => void 0) : void 0;
			return {
				id: frame.id,
				document: iframe?.node.contentDocument?.backendNodeId
			};
		}))).find((owner) => owner.document === described?.node.backendNodeId)?.id ?? root.id;
	}
	async function describe(element) {
		return decodeUnknownSync(Struct({
			label: String$1,
			selector: String$1,
			text: optionalKey(String$1)
		}))(await call(element, `function() {
          const clip = (value, max) => (value.length > max ? value.slice(0, max - 1) + "\u2026" : value)
          const label = this.localName + (this.id ? "#" + this.id : "") + Array.from(this.classList, (name) => "." + name).join("")
          // One segment per document or shadow root, outermost first; " >>> " steps into a host's shadow root.
          const segments = []
          for (let start = this; start; ) {
            const root = start.getRootNode()
            const path = []
            for (let node = start; node; node = node.parentElement) {
              if (node.id && root.querySelectorAll("#" + CSS.escape(node.id)).length === 1) {
                path.unshift("#" + CSS.escape(node.id))
                break
              }
              if (node === node.ownerDocument.body) {
                path.unshift("body")
                break
              }
              const same = Array.from(node.parentNode?.children ?? []).filter((child) => child.localName === node.localName)
              path.unshift(CSS.escape(node.localName) + (same.length > 1 ? ":nth-of-type(" + (same.indexOf(node) + 1) + ")" : ""))
            }
            segments.unshift(path.join(" > "))
            start = root instanceof ShadowRoot ? root.host : undefined
          }
          const selector = segments.join(" >>> ")
          const text = clip((this.innerText ?? this.textContent ?? "").replace(/\\s+/g, " ").trim(), 160)
          // A cut selector is invalid syntax; leave it out rather than pass it off as usable.
          return { label: clip(label, 200), selector: selector.length > 2000 ? "" : selector, ...(text ? { text } : {}) }
        }`));
	}
	async function accessibility(element) {
		const node = (await cdp.send("Accessibility.getPartialAXTree", {
			backendNodeId: element.backendID,
			fetchRelatives: false
		}, element.sessionID).catch(() => void 0))?.nodes.find((node) => node.backendDOMNodeId === element.backendID && !node.ignored);
		const role = String(node?.role?.value ?? "");
		const name = String(node?.name?.value ?? "").replace(/\s+/g, " ").trim().slice(0, 160);
		const labeled = role && ![
			"generic",
			"none",
			"presentation"
		].includes(role) ? { role: role.slice(0, 128) } : {};
		return name ? {
			...labeled,
			name
		} : labeled;
	}
	async function painted(sessionID) {
		await Promise.race([cdp.send("Runtime.evaluate", {
			expression: "new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
			awaitPromise: true
		}, sessionID).catch(() => void 0), new Promise((resolve) => setTimeout(resolve, 150))]);
	}
}
//#endregion
//#region ../plugin-browser/src/proxy-machine.ts
var initial = { status: "open" };
var CLOSED = { status: "closed" };
function transition(state, event) {
	if (state.status === "closed") return {
		state,
		effects: []
	};
	switch (event.type) {
		case "close": return {
			state: CLOSED,
			effects: ["shutdown"]
		};
	}
}
/**
* Whether a client connection or a tunnel that just opened may join the proxy. One that arrives
* after `close` is destroyed instead, since shutdown already ran.
*/
function admits(state) {
	return state.status === "open";
}
/** Returns `state` itself when the event does not apply, so callers compare to see whether to act. */
function transitionRead(state, event) {
	if (state === "destroyed") return state;
	if (event === "destroyed") return "destroyed";
	if (event === "pull") return state === "idle" ? "reading" : state;
	if (state !== "reading") return state;
	return event === "eof" ? "ended" : "idle";
}
//#endregion
//#region ../plugin-browser/src/proxy.ts
async function make(transport) {
	const username = randomBytes(16).toString("hex");
	const password = randomBytes(32).toString("hex");
	const expected = Buffer.from(`Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`);
	const clients = /* @__PURE__ */ new Set();
	const tunnels = /* @__PURE__ */ new Set();
	const pending = /* @__PURE__ */ new Set();
	const closed = Promise.withResolvers();
	let state = initial;
	const authorized = (value) => {
		if (!value) return false;
		const actual = Buffer.from(value);
		return actual.length === expected.length && timingSafeEqual(actual, expected);
	};
	const connect = async (target, signal) => {
		if (!admits(state)) throw new Error("Browser proxy is closed");
		const abort = new AbortController();
		const cancel = () => abort.abort();
		signal.addEventListener("abort", cancel, { once: true });
		if (signal.aborted) cancel();
		pending.add(abort);
		try {
			const socket = new TunnelSocket(transport, await transport.open(target, abort.signal));
			if (!admits(state) || abort.signal.aborted) {
				socket.destroy();
				throw new Error("Browser proxy connection was cancelled");
			}
			tunnels.add(socket);
			socket.once("close", () => tunnels.delete(socket));
			return socket;
		} finally {
			pending.delete(abort);
			signal.removeEventListener("abort", cancel);
		}
	};
	const server = createServer({ maxHeaderSize: 65536 }, (incoming, response) => {
		forward(incoming, response, connect, authorized).catch(() => {
			if (!response.headersSent) {
				response.writeHead(502);
				response.end();
				return;
			}
			response.destroy();
		});
	});
	server.requestTimeout = 3e4;
	server.headersTimeout = 1e4;
	server.on("connection", (socket) => {
		if (!admits(state)) {
			socket.destroy();
			return;
		}
		clients.add(socket);
		socket.on("error", () => socket.destroy());
		socket.once("close", () => clients.delete(socket));
	});
	const upgrade = (incoming, socket, head, connectMethod) => {
		let opened;
		(async () => {
			if (!authorized(incoming.headers["proxy-authorization"])) {
				socket.end("HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm=\"OpenCode Browser Proxy\"\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
				return;
			}
			const url = parseURL(connectMethod ? `https://${incoming.url ?? ""}` : incoming.url);
			if (!url || !connectMethod && incoming.headers.upgrade?.toLowerCase() !== "websocket") {
				socket.end("HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
				return;
			}
			const abort = new AbortController();
			const cancel = () => abort.abort();
			socket.once("close", cancel);
			socket.pause();
			try {
				const tunnel = await connect(target(url), abort.signal);
				opened = tunnel;
				if (socket.destroyed) {
					tunnel.destroy();
					return;
				}
				if (connectMethod) socket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
				if (!connectMethod) {
					const headers = forwardedHeaders(incoming.headers);
					headers.host = url.host;
					headers.connection = "Upgrade";
					headers.upgrade = "websocket";
					tunnel.write(`${incoming.method} ${url.pathname}${url.search} HTTP/1.1\r\n${Object.entries(headers).flatMap(([key, value]) => value === void 0 ? [] : (Array.isArray(value) ? value : [value]).map((item) => `${key}: ${item}\r\n`)).join("")}\r\n`);
				}
				if (head.byteLength) tunnel.write(head);
				socket.once("close", () => tunnel.destroy());
				tunnel.once("close", () => socket.destroy());
				socket.pipe(tunnel);
				tunnel.pipe(socket);
				socket.resume();
			} finally {
				socket.off("close", cancel);
			}
		})().catch(() => {
			opened?.destroy();
			if (!socket.destroyed) socket.end("HTTP/1.1 502 Bad Gateway\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
		});
	};
	server.on("connect", (incoming, socket, head) => upgrade(incoming, socket, head, true));
	server.on("upgrade", (incoming, socket, head) => upgrade(incoming, socket, head, false));
	server.on("clientError", (_error, socket) => {
		if (!socket.destroyed) socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
	});
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => {
			server.off("error", reject);
			resolve();
		});
	});
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("Browser proxy did not bind a TCP address");
	return {
		url: `http://127.0.0.1:${address.port}`,
		host: "127.0.0.1",
		port: address.port,
		credentials: {
			username,
			password
		},
		close() {
			const next = transition(state, { type: "close" });
			state = next.state;
			next.effects.forEach(() => {
				pending.forEach((abort) => abort.abort());
				tunnels.forEach((socket) => socket.destroy());
				clients.forEach((socket) => socket.destroy());
				server.close(() => closed.resolve());
			});
			return closed.promise;
		}
	};
}
async function forward(incoming, response, connect, authorized) {
	if (!authorized(incoming.headers["proxy-authorization"])) {
		response.writeHead(407, { "Proxy-Authenticate": "Basic realm=\"OpenCode Browser Proxy\"" });
		response.end();
		return;
	}
	const url = parseURL(incoming.url);
	if (!url || url.protocol !== "http:") {
		response.writeHead(400);
		response.end();
		return;
	}
	const abort = new AbortController();
	const cancel = () => abort.abort();
	incoming.once("aborted", cancel);
	response.once("close", cancel);
	const agent = new Agent({
		keepAlive: false,
		maxSockets: 1
	});
	let opened;
	try {
		const tunnel = await connect(target(url), abort.signal);
		opened = tunnel;
		agent.createConnection = () => tunnel;
		const headers = forwardedHeaders(incoming.headers);
		headers.host = url.host;
		headers.connection = "close";
		await new Promise((resolve, reject) => {
			const upstream = request({
				agent,
				hostname: url.hostname,
				port: url.port || 80,
				path: `${url.pathname}${url.search}`,
				method: incoming.method,
				headers,
				signal: abort.signal
			}, (result) => {
				response.writeHead(result.statusCode ?? 502, result.statusMessage, {
					...forwardedHeaders(result.headers),
					connection: "close"
				});
				result.once("error", reject);
				response.once("finish", resolve);
				result.pipe(response);
			});
			upstream.once("error", reject);
			incoming.pipe(upstream);
		});
	} finally {
		incoming.off("aborted", cancel);
		response.off("close", cancel);
		agent.destroy();
		opened?.destroy();
	}
}
function forwardedHeaders(input) {
	const headers = { ...input };
	headers.connection?.split(",").forEach((name) => delete headers[name.trim().toLowerCase()]);
	[
		"connection",
		"keep-alive",
		"proxy-authenticate",
		"proxy-authorization",
		"proxy-connection",
		"te",
		"trailer",
		"transfer-encoding",
		"upgrade"
	].forEach((name) => delete headers[name]);
	return headers;
}
function parseURL(value) {
	if (!value || !URL.canParse(value)) return;
	const url = new URL(value);
	if (![
		"http:",
		"https:",
		"ws:",
		"wss:"
	].includes(url.protocol) || url.username || url.password) return;
	return url;
}
function target(url) {
	return decodeUnknownSync(TunnelTarget)({
		host: url.hostname.replace(/^\[|\]$/g, ""),
		port: url.port ? Number(url.port) : url.protocol === "https:" || url.protocol === "wss:" ? 443 : 80
	});
}
var TunnelSocket = class extends Duplex {
	transport;
	id;
	connecting = false;
	abort = new AbortController();
	reads = "idle";
	constructor(transport, id) {
		super({
			highWaterMark: TUNNEL_CHUNK_BYTES,
			allowHalfOpen: true
		});
		this.transport = transport;
		this.id = id;
		this.on("error", () => this.destroy());
	}
	_read() {
		if (!this.advance("pull")) return;
		this.transport.read(this.id, this.abort.signal).then((result) => {
			if (!this.advance(result.eof ? "eof" : "chunk")) return;
			if (result.eof) {
				this.push(null);
				return;
			}
			if (this.push(result.data)) this._read();
		}, (error) => this.destroy(asError(error)));
	}
	advance(event) {
		const next = transitionRead(this.reads, event);
		if (next === this.reads) return false;
		this.reads = next;
		return true;
	}
	_write(chunk, encoding, callback) {
		const data = typeof chunk === "string" ? Buffer.from(chunk, encoding) : chunk;
		(async () => {
			for (let offset = 0; offset < data.byteLength; offset += TUNNEL_CHUNK_BYTES) await this.transport.write(this.id, data.subarray(offset, offset + TUNNEL_CHUNK_BYTES), false, this.abort.signal);
		})().then(() => callback(), (error) => callback(asError(error)));
	}
	_final(callback) {
		this.transport.write(this.id, /* @__PURE__ */ new Uint8Array(), true, this.abort.signal).then(() => callback(), (error) => callback(asError(error)));
	}
	_destroy(error, callback) {
		this.advance("destroyed");
		this.abort.abort();
		this.transport.close(this.id).catch(() => void 0).then(() => callback(error));
	}
	setKeepAlive() {
		return this;
	}
	setNoDelay() {
		return this;
	}
	setTimeout(_timeout, callback) {
		if (callback) this.once("timeout", callback);
		return this;
	}
	ref() {
		return this;
	}
	unref() {
		return this;
	}
};
function asError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
//#endregion
//#region ../gui-plugins/src/browser/network.ts
var createBrowserNetwork = fn("BrowserNetwork.create")(function* (input) {
	const options = { location: input.location };
	const proxy = yield* acquireRelease(tryPromise(() => make({
		open: (target, signal) => runPromise(input.rpc["tunnel.open"]({
			...input.attachment,
			target
		}, options), { signal }),
		read: (tunnelID, signal) => runPromise(input.rpc["tunnel.read"]({
			...input.attachment,
			tunnelID
		}, options), { signal }),
		write: (tunnelID, data, end, signal) => runPromise(input.rpc["tunnel.write"]({
			...input.attachment,
			tunnelID,
			data: encode$1(data),
			end
		}, options), { signal }),
		close: (tunnelID) => runPromise(input.rpc["tunnel.close"]({
			...input.attachment,
			tunnelID
		}, options).pipe(timeout("5 seconds")))
	})), (proxy) => promise(() => proxy.close()));
	const partition = session.fromPartition(input.partition);
	yield* addFinalizer(() => promise(() => partition.closeAllConnections()));
	yield* tryPromise(() => partition.setProxy({
		mode: "fixed_servers",
		proxyRules: proxy.url,
		proxyBypassRules: "<-loopback>"
	}));
	yield* tryPromise(() => partition.closeAllConnections());
	return {
		attach(contents) {
			const login = (event, _details, auth, callback) => {
				if (!auth.isProxy || auth.scheme !== "basic" || auth.host !== proxy.host || auth.port !== proxy.port || auth.realm !== "OpenCode Browser Proxy") return;
				event.preventDefault();
				callback(proxy.credentials.username, proxy.credentials.password);
			};
			contents.on("login", login);
			contents.setWebRTCIPHandlingPolicy("disable_non_proxied_udp");
			return () => contents.off("login", login);
		},
		/**
		* Fetches a page icon through the server's network, as the page loaded it. Resolves undefined for anything but a
		* small image: a failure, a timeout, another content type, or more than `MAX_ICON_BYTES`.
		*/
		icon: (url) => new Promise((resolve) => {
			const request = net.request({
				url,
				session: partition,
				useSessionCookies: true,
				redirect: "follow"
			});
			const chunks = [];
			const finish = (value) => {
				clearTimeout(timeout);
				resolve(value);
			};
			const fail = () => {
				request.abort();
				finish();
			};
			const timeout = setTimeout(fail, 5e3);
			request.on("login", (auth, callback) => {
				if (auth.isProxy && auth.host === proxy.host && auth.port === proxy.port) return callback(proxy.credentials.username, proxy.credentials.password);
				callback();
			});
			request.on("response", (response) => {
				const header = response.headers["content-type"];
				const mime = (Array.isArray(header) ? header[0] : header)?.split(";")[0]?.trim().toLowerCase() ?? "";
				if (response.statusCode !== 200 || !mime.startsWith("image/")) return fail();
				response.on("data", (chunk) => {
					chunks.push(chunk);
					if (chunks.reduce((size, item) => size + item.length, 0) > MAX_ICON_BYTES) fail();
				});
				response.on("end", () => finish({
					mime,
					data: Buffer.concat(chunks)
				}));
				response.on("error", fail);
			});
			request.on("error", fail);
			request.end();
		})
	};
});
/** Icons larger than this are not worth reducing; sites list a favicon of a few kilobytes. */
var MAX_ICON_BYTES = 262144;
//#endregion
//#region ../gui-plugins/src/browser/pane-machine.ts
/** How long a binding may wait for the server's `attached` handshake before it closes. */
var REGISTER_TIMEOUT_MS = 15e3;
var ControlHeader = Struct({
	connectionID: String$1,
	type: optional(String$1)
});
var decodeControlHeader = decodeUnknownOption(ControlHeader);
var decodeControl = decodeUnknownOption(Control);
function createPaneState() {
	return {
		status: "active",
		bindings: /* @__PURE__ */ new Map()
	};
}
/** Reads a control event. Only an `attached` handshake this desktop cannot decode makes the server unsupported. */
function resolveControlFrame(connectionID, header, control) {
	if (isNone(header) || header.value.connectionID !== connectionID) return { kind: "foreign" };
	if (isNone(control)) return header.value.type === "attached" ? { kind: "incompatible" } : {
		kind: "unrecognized",
		controlType: header.value.type
	};
	if (control.value.type === "attached") return { kind: "attached" };
	return {
		kind: control.value.type,
		requestID: control.value.requestID
	};
}
function attachmentFailure(cause) {
	if (isTagged(cause, "SessionNotFoundError")) return "missing";
	const type = hasProperty(cause, "type") ? cause.type : void 0;
	if (type === "rpc.unavailable") return "unavailable";
	if (type === "rpc.method_not_found" || type === "rpc.invalid_input") return "unsupported";
	return "closed";
}
function transitionPane(state, event) {
	if (state.status === "disposed") return {
		state,
		effects: []
	};
	if (event.type === "disposed") return {
		state: { status: "disposed" },
		effects: Array.from(state.bindings.values()).flatMap((binding) => transitionBinding(binding, { type: "pane.disposed" }).effects)
	};
	if (event.type === "registered") {
		if (state.bindings.has(event.binding)) return {
			state,
			effects: []
		};
		return {
			state: {
				status: "active",
				bindings: new Map(state.bindings).set(event.binding, createConnecting(event))
			},
			effects: [{
				type: "start-timer",
				binding: event.binding,
				ms: REGISTER_TIMEOUT_MS
			}]
		};
	}
	const binding = state.bindings.get(event.binding);
	if (!binding) return {
		state,
		effects: []
	};
	const next = transitionBinding(binding, event.event);
	if (next.state === binding) return {
		state,
		effects: next.effects
	};
	const bindings = new Map(state.bindings);
	if (next.state.status === "closed") bindings.delete(event.binding);
	if (next.state.status !== "closed") bindings.set(event.binding, next.state);
	return {
		state: {
			status: "active",
			bindings
		},
		effects: next.effects
	};
}
function transitionBinding(state, event) {
	if (state.status === "closed") return {
		state,
		effects: []
	};
	const reason = closeReason(state, event);
	if (reason) return close(state, reason, event.type === "client.closed" || reason === "browser.pane.missing");
	if (event.type === "control.unrecognized") return {
		state,
		effects: [{
			type: "warn",
			message: "Ignored an unrecognized browser control event",
			detail: event.controlType
		}]
	};
	if (state.status === "attached") return transitionAttached(state, event);
	if (event.type !== "server.attached") return {
		state,
		effects: []
	};
	const next = publish({
		...state,
		status: "attached",
		fileRoots: event.fileRoots,
		requests: /* @__PURE__ */ new Map(),
		published: void 0
	});
	return {
		state: next.state,
		effects: [{
			type: "resolve-register",
			binding: state.binding
		}, ...next.effects]
	};
}
function closeReason(state, event) {
	if (event.type === "handshake.unsupported") return "browser.pane.unsupported";
	if (event.type === "owner.closed" || event.type === "client.closed") return "browser.pane.registration.closed";
	if (event.type === "pane.disposed") return "browser.pane.suspended";
	if (event.type === "register.timed-out") return state.status === "connecting" ? "browser.pane.registration.closed" : void 0;
	if (event.type !== "attachment.ended") return void 0;
	if (event.outcome === "replaced") return "browser.pane.replaced";
	if (event.outcome === "missing") return "browser.pane.missing";
	if (event.outcome === "unsupported") return "browser.pane.unsupported";
	if (event.outcome === "unavailable") return state.status === "attached" ? "browser.pane.suspended" : "browser.pane.unsupported";
	return "browser.pane.registration.closed";
}
function close(state, reason, forget) {
	const requestIDs = state.status === "attached" ? Array.from(state.requests.keys()) : [];
	const attempts = Array.from(state.tabs.values()).flatMap((slot) => slot.status === "live" ? [slot.attempt] : []);
	const effects = [];
	if (forget) effects.push({
		type: "remove-restore",
		storageKey: state.storageKey
	});
	if (requestIDs.length) effects.push({
		type: "abort-requests",
		binding: state.binding,
		requestIDs
	});
	effects.push({
		type: "emit",
		binding: state.binding,
		event: {
			type: "state",
			state: reason === "browser.pane.suspended" ? selectInventory(state) : null,
			error: reason
		}
	});
	if (attempts.length) effects.push({
		type: "release-pages",
		binding: state.binding,
		attempts
	});
	effects.push({
		type: "teardown",
		binding: state.binding
	});
	return {
		state: {
			status: "closed",
			binding: state.binding,
			reason
		},
		effects
	};
}
function transitionAttached(state, event) {
	if (event.type === "request.started") {
		if (state.requests.has(event.requestID)) return {
			state,
			effects: []
		};
		return {
			state: {
				...state,
				requests: new Map(state.requests).set(event.requestID, void 0)
			},
			effects: []
		};
	}
	if (event.type === "request.targeted") {
		if (!state.requests.has(event.requestID)) return {
			state,
			effects: []
		};
		return {
			state: {
				...state,
				requests: new Map(state.requests).set(event.requestID, event.tabID)
			},
			effects: []
		};
	}
	if (event.type === "request.cancelled" || event.type === "request.finished") {
		if (!state.requests.has(event.requestID)) return {
			state,
			effects: []
		};
		const requests = new Map(state.requests);
		requests.delete(event.requestID);
		return {
			state: {
				...state,
				requests
			},
			effects: event.type === "request.cancelled" ? [{
				type: "abort-requests",
				binding: state.binding,
				requestIDs: [event.requestID]
			}] : []
		};
	}
	if (event.type === "tab.focused") {
		if (!state.tabs.has(event.tabID)) return {
			state,
			effects: []
		};
		const next = publish({
			...state,
			focusedTabID: event.tabID
		});
		return {
			state: next.state,
			effects: [...next.effects, {
				type: "emit",
				binding: state.binding,
				event: {
					type: "focus",
					tabID: event.tabID
				}
			}]
		};
	}
	if (event.type === "tab.opened") {
		if (event.attempt !== state.nextAttempt || state.tabs.get(event.tabID)?.status === "live") return {
			state,
			effects: []
		};
		return {
			state: {
				...state,
				tabs: new Map(state.tabs).set(event.tabID, {
					status: "live",
					attempt: event.attempt,
					tab: event.tab,
					url: event.tab.url
				}),
				nextAttempt: event.attempt + 1
			},
			effects: []
		};
	}
	if (event.type === "tab.closed") {
		const closed = state.tabs.get(event.tabID);
		if (!closed) return {
			state,
			effects: []
		};
		const tabs = new Map(state.tabs);
		tabs.delete(event.tabID);
		const focusedTabID = state.focusedTabID === event.tabID ? tabs.keys().next().value ?? null : state.focusedTabID;
		return withoutTab({
			...state,
			tabs,
			focusedTabID
		}, event.tabID, closed, void 0);
	}
	if (event.type !== "tab.published" && event.type !== "tab.crashed") return {
		state,
		effects: []
	};
	const slot = state.tabs.get(event.tabID);
	if (slot?.status !== "live" || slot.attempt !== event.attempt) return {
		state,
		effects: []
	};
	if (event.type === "tab.published") {
		const tabs = new Map(state.tabs).set(event.tabID, {
			...slot,
			tab: event.tab,
			url: event.tab.url || slot.url
		});
		return publish({
			...state,
			tabs
		}, event.error);
	}
	const latest = event.tab ?? slot.tab;
	const tabs = new Map(state.tabs).set(event.tabID, {
		status: "unloaded",
		tab: {
			id: event.tabID,
			url: latest.url || slot.url || "about:blank",
			title: latest.title,
			loading: false,
			loadError: "page_crashed",
			canGoBack: false,
			canGoForward: false,
			generation: latest.generation + 1
		}
	});
	return withoutTab({
		...state,
		tabs
	}, event.tabID, slot, "page_crashed");
}
/** Aborts the requests that target a tab whose page went away, releases that page, and publishes the result. */
function withoutTab(state, tabID, slot, error) {
	const targeting = Array.from(state.requests).flatMap(([requestID, target]) => target === tabID ? [requestID] : []);
	const requests = new Map(state.requests);
	targeting.forEach((requestID) => requests.delete(requestID));
	const next = publish({
		...state,
		requests
	}, error);
	const effects = [];
	if (targeting.length) effects.push({
		type: "abort-requests",
		binding: state.binding,
		requestIDs: targeting
	});
	if (slot.status === "live") effects.push({
		type: "release-pages",
		binding: state.binding,
		attempts: [slot.attempt]
	});
	return {
		state: next.state,
		effects: [...effects, ...next.effects]
	};
}
/** Saves the tabs for the next launch, and reports the state unless it repeats the last one reported. */
function publish(state, error) {
	const inventory = selectInventory(state);
	const event = error === void 0 ? {
		type: "state",
		state: inventory
	} : {
		type: "state",
		state: inventory,
		error
	};
	const published = JSON.stringify(event);
	const save = {
		type: "save-restore",
		storageKey: state.storageKey,
		snapshot: {
			tabs: Array.from(state.tabs.values(), (slot) => ({
				id: slot.tab.id,
				url: slot.tab.url || (slot.status === "live" ? slot.url : "") || "about:blank"
			})),
			focusedTabID: state.focusedTabID
		}
	};
	if (published === state.published) return {
		state,
		effects: [save]
	};
	return {
		state: {
			...state,
			published
		},
		effects: [save, {
			type: "report",
			binding: state.binding,
			event
		}]
	};
}
function createConnecting(event) {
	const restore = event.restore ?? {
		tabs: event.saved.tabs.map((tab) => ({
			id: tab.id,
			url: tab.url,
			title: "",
			loading: false,
			canGoBack: false,
			canGoForward: false,
			generation: 0
		})),
		focusedTabID: event.saved.focusedTabID
	};
	const tabs = new Map(restore.tabs.map((tab) => [tab.id, {
		status: "unloaded",
		tab: {
			...tab,
			loading: false,
			canGoBack: false,
			canGoForward: false,
			generation: tab.generation + 1
		}
	}]));
	return {
		status: "connecting",
		binding: event.binding,
		window: event.window,
		storageKey: event.storageKey,
		tabs,
		focusedTabID: restore.focusedTabID !== null && tabs.has(restore.focusedTabID) ? restore.focusedTabID : tabs.keys().next().value ?? null,
		nextAttempt: 1
	};
}
function isPaneDisposed(state) {
	return state.status === "disposed";
}
function selectBinding(state, binding) {
	return state.status === "active" ? state.bindings.get(binding) : void 0;
}
/** The binding when `window` registered it. */
function selectOwnedBinding(state, window, binding) {
	const entry = selectBinding(state, binding);
	return entry?.window === window ? entry : void 0;
}
function selectFileRoots(state, binding) {
	const entry = selectBinding(state, binding);
	return entry?.status === "attached" ? entry.fileRoots : [];
}
function selectInventory(entry) {
	return {
		tabs: Array.from(entry.tabs.values(), (slot) => slot.tab),
		focusedTabID: entry.focusedTabID
	};
}
function selectTabSlot(state, binding, tabID) {
	const entry = selectBinding(state, binding);
	return entry?.status === "attached" ? entry.tabs.get(tabID) : void 0;
}
/** The attempt of the tab's current page, if it has one. */
function selectPageAttempt(state, binding, tabID) {
	const slot = selectTabSlot(state, binding, tabID);
	return slot?.status === "live" ? slot.attempt : void 0;
}
function isCurrentPage(state, binding, tabID, attempt) {
	return selectPageAttempt(state, binding, tabID) === attempt;
}
function isFocusedPage(state, binding, tabID, attempt) {
	return isCurrentPage(state, binding, tabID, attempt) && selectBinding(state, binding)?.focusedTabID === tabID;
}
//#endregion
//#region ../gui-plugins/src/browser/restore.ts
var Stored = Struct({
	tabs: ArraySchema(Struct({
		id: TabID,
		url: Tab.fields.url
	})),
	focusedTabID: NullOr(TabID)
});
var empty = {
	tabs: [],
	focusedTabID: null
};
/** Tab URLs and focus per `${server}\n${session}`, imported once from the desktop's own `opencode.browser.dat` rows. */
function createBrowserRestoreStore(storage) {
	const from = (key) => ({ state: ["opencode.browser.dat", key] });
	const open = (key) => storage.store(`restore:${key}`, {
		schema: Stored,
		initial: empty,
		from: from(key)
	});
	const stores = /* @__PURE__ */ new Map();
	const store = (key) => {
		const existing = stores.get(key);
		if (existing) return existing;
		const created = open(key);
		stores.set(key, created);
		return created;
	};
	return {
		load: (key) => store(key).value,
		save(key, state) {
			const target = store(key);
			const value = {
				tabs: state.tabs.map((tab) => ({
					id: tab.id,
					url: tab.url
				})),
				focusedTabID: state.focusedTabID
			};
			if (JSON.stringify(target.value) !== JSON.stringify(value)) target.set(value);
		},
		remove(key) {
			storage.remove(`restore:${key}`, { from: from(key) });
			stores.delete(key);
		}
	};
}
//#endregion
//#region ../gui-plugins/src/browser/pane.ts
function createBrowserPane(input) {
	const machine = { state: createPaneState() };
	const handles = /* @__PURE__ */ new Map();
	const restore = createBrowserRestoreStore(input.storage);
	const shared = { ref: createRefs(input.refs) };
	const releasing = /* @__PURE__ */ new Set();
	const disposals = /* @__PURE__ */ new WeakMap();
	const runtime = make$2(layerNodeHttp);
	return {
		async register(window, binding, target) {
			const server = input.serverEndpoints.get(target.server);
			if (isPaneDisposed(machine.state) || !server || !destinationOrigin(server.url)) throw new Error("browser.pane.registration.invalid");
			const win = input.windows.get(window);
			if (!win || selectBinding(machine.state, binding) || handles.has(binding)) throw new Error("browser.pane.owner.invalid");
			if (win.isDestroyed() || win.webContents.isDestroyed()) throw new Error("browser.pane.owner.unavailable");
			const sessionID = SessionID.make(target.session);
			const storageKey = `${target.server}\n${sessionID}`;
			const partition = `opencode-browser-${crypto.randomUUID()}`;
			electron.session.fromPartition(partition).webRequest.onBeforeRequest({ urls: ["file://*/*"] }, (details, callback) => callback({ cancel: !fileURLWithin(details.url, selectFileRoots(machine.state, binding)) }));
			const closed = () => dispatchBinding(binding, { type: "owner.closed" });
			const navigate = (event) => {
				if (event.isMainFrame && !event.isSameDocument) closed();
			};
			win.webContents.once("destroyed", closed);
			win.webContents.on("did-start-navigation", navigate);
			const handle = {
				window,
				win,
				partition,
				abort: new AbortController(),
				registered: Promise.withResolvers(),
				cleanup: () => {
					if (win.isDestroyed()) return;
					win.webContents.off("destroyed", closed);
					win.webContents.off("did-start-navigation", navigate);
				},
				pages: /* @__PURE__ */ new Map(),
				requests: /* @__PURE__ */ new Map()
			};
			handles.set(binding, handle);
			dispatch({
				type: "registered",
				binding,
				window,
				storageKey,
				restore: target.restore,
				saved: restore.load(storageKey)
			});
			runtime.runPromise(gen(function* () {
				const http = yield* HttpClient;
				const client = yield* make$4({ baseUrl: server.url }).pipe(provideService(HttpClient, Object.keys(server.headers).length ? mapRequest(http, setHeaders(server.headers)) : http));
				const session = yield* client.session.get({ sessionID });
				const fileRoots = server.sameMachine ? [session.location.directory] : [];
				const options = { location: {
					directory: session.location.directory,
					workspace: session.location.workspaceID
				} };
				const attachment = {
					sessionID,
					connectionID: crypto.randomUUID()
				};
				const rpc = client.rpc(Definition);
				handle.network = yield* createBrowserNetwork({
					rpc,
					attachment,
					location: options.location,
					partition
				});
				const connected = yield* make$1();
				const outbound = yield* unbounded();
				const send = (effect) => offerUnsafe(outbound, effect.pipe(catchCause((cause) => logWarning("Browser send failed", cause))));
				const reply = (requestID, outcome) => send(rpc.result({
					...attachment,
					requestID,
					outcome: encodeSync(Outcome)(outcome)
				}, options));
				handle.sendState = (state) => send(rpc.state({
					...attachment,
					state
				}, options).pipe(retry({
					while: (error) => !("type" in error && error.type === "unavailable"),
					schedule: min([exponential("250 millis"), spaced("10 seconds")])
				})));
				const run = (requestID, abort) => rpc.command({
					...attachment,
					requestID
				}, options).pipe(flatMap((command) => promise(async () => {
					if ("tabID" in command.action) dispatchBinding(binding, {
						type: "request.targeted",
						requestID,
						tabID: command.action.tabID
					});
					reply(requestID, await execute(binding, command, abort.signal).then((result) => ({
						type: "success",
						result
					}), (cause) => browserFailure(command.action, cause)));
				})), ensuring(sync(() => {
					handle.requests.delete(requestID);
					dispatchBinding(binding, {
						type: "request.finished",
						requestID
					});
				})), tapError((error) => sync(() => {
					if (!isSchemaError(error)) return;
					reply(requestID, {
						type: "failure",
						code: "unsupported",
						message: "This desktop app does not support the requested browser operation. Ask the user to update the desktop app, or use another operation."
					});
				})), catchCause((cause) => abort.signal.aborted ? void_ : logWarning("Browser command failed", cause)), forkScoped);
				const receive = client.event.subscribe().pipe(runForEach((event) => gen(function* () {
					if (event.type === "server.connected") {
						yield* succeed$1(connected, void 0);
						return;
					}
					if (event.type !== "rpc.experimental.browser.control") return;
					const frame = resolveControlFrame(attachment.connectionID, decodeControlHeader(event.data), decodeControl(event.data));
					if (frame.kind === "foreign") return;
					if (frame.kind === "attached") return dispatchBinding(binding, {
						type: "server.attached",
						fileRoots
					});
					if (frame.kind === "incompatible") return dispatchBinding(binding, { type: "handshake.unsupported" });
					if (frame.kind === "unrecognized") return dispatchBinding(binding, {
						type: "control.unrecognized",
						controlType: frame.controlType
					});
					if (frame.kind === "cancel") return dispatchBinding(binding, {
						type: "request.cancelled",
						requestID: frame.requestID
					});
					const abort = new AbortController();
					handle.requests.set(frame.requestID, abort);
					dispatchBinding(binding, {
						type: "request.started",
						requestID: frame.requestID
					});
					yield* run(frame.requestID, abort);
				})));
				return yield* raceAllFirst([
					receive,
					fromQueue(outbound).pipe(runForEach((send) => send)),
					_await(connected).pipe(andThen(rpc.attach({
						...attachment,
						version: 4
					}, options)))
				]);
			}).pipe(matchCause({
				onSuccess: (result) => result === "replaced" ? "replaced" : "closed",
				onFailure: (cause) => match(findErrorOption(cause), {
					onNone: () => "closed",
					onSome: attachmentFailure
				})
			}), tap((outcome) => sync(() => dispatchBinding(binding, {
				type: "attachment.ended",
				outcome
			}))), scoped), { signal: handle.abort.signal }).catch(() => dispatchBinding(binding, {
				type: "attachment.ended",
				outcome: "closed"
			}));
			await handle.registered.promise;
			if (!selectBinding(machine.state, binding)) throw new Error("browser.pane.registration.closed");
		},
		load(window, binding, tabID) {
			owned(window, binding);
			load(binding, tabID);
		},
		async inspect(window, binding, tabID, enabled) {
			owned(window, binding);
			await page(binding, tabID)?.inspect(enabled);
		},
		async highlight(window, binding, tabID, ref) {
			owned(window, binding);
			await page(binding, tabID)?.highlight(ref);
		},
		zoom(window, binding, tabID, direction) {
			owned(window, binding);
			page(binding, tabID)?.zoom(direction);
		},
		async site(window, binding, tabID) {
			owned(window, binding);
			return await page(binding, tabID)?.site() ?? { cookies: 0 };
		},
		async clearSite(window, binding, tabID) {
			owned(window, binding);
			await page(binding, tabID)?.clearSite();
		},
		async command(window, binding, command) {
			owned(window, binding);
			const url = command.type === "navigate" || command.type === "tabs.open" ? command.url : void 0;
			const reason = url === void 0 ? void 0 : refusal(url, { fileRoots: selectFileRoots(machine.state, binding) });
			if (reason) throw new Error(reason);
			await execute(binding, {
				action: command,
				files: []
			}, new AbortController().signal).catch((error) => {
				if (!("code" in error) || error.code !== "ERR_ABORTED") throw error;
			});
		},
		async close(window, binding) {
			owned(window, binding);
			dispatchBinding(binding, { type: "client.closed" });
		},
		/**
		* The plugin is going away (reload, disable, or quit). Windows keep each pane's tabs as a
		* suspended attachment, like an idle server eviction, and register again once the pane is back.
		*/
		async dispose() {
			dispatch({ type: "disposed" });
			await Promise.all(releasing);
			await runtime.dispose();
		}
	};
	function dispatch(event) {
		const next = transitionPane(machine.state, event);
		machine.state = next.state;
		next.effects.forEach(perform);
	}
	function dispatchBinding(binding, event) {
		dispatch({
			type: "binding",
			binding,
			event
		});
	}
	function perform(effect) {
		if (effect.type === "save-restore") return restore.save(effect.storageKey, effect.snapshot);
		if (effect.type === "remove-restore") return restore.remove(effect.storageKey);
		if (effect.type === "warn") return void runtime.runFork(logWarning(effect.message, effect.detail));
		const handle = handles.get(effect.binding);
		if (!handle) return;
		if (effect.type === "start-timer") {
			handle.timer = setTimeout(() => dispatchBinding(effect.binding, { type: "register.timed-out" }), effect.ms);
			return;
		}
		if (effect.type === "resolve-register") {
			clearTimeout(handle.timer);
			return handle.registered.resolve();
		}
		if (effect.type === "emit") return emit(effect.binding, effect.event);
		if (effect.type === "report") {
			emit(effect.binding, effect.event);
			return handle.sendState?.(effect.event.state);
		}
		if (effect.type === "abort-requests") return effect.requestIDs.forEach((requestID) => handle.requests.get(requestID)?.abort());
		if (effect.type === "release-pages") return effect.attempts.forEach((attempt) => {
			const page = handle.pages.get(attempt);
			handle.pages.delete(attempt);
			if (page) release(page);
		});
		handles.delete(effect.binding);
		clearTimeout(handle.timer);
		handle.registered.reject(/* @__PURE__ */ new Error("browser.pane.registration.closed"));
		handle.cleanup();
		handle.abort.abort();
	}
	function owned(window, binding) {
		if (!selectOwnedBinding(machine.state, window, binding)) throw new Error("browser.pane.unavailable");
	}
	/** To the window only, while the binding's handle exists; a close event goes out before its teardown. */
	function emit(binding, event) {
		const handle = handles.get(binding);
		if (!handle || handle.win.isDestroyed() || handle.win.webContents.isDestroyed()) return;
		input.emit(handle.window, {
			binding,
			event
		});
	}
	function release(page) {
		const done = page.dispose();
		const settled = done.catch(() => void 0);
		disposals.set(page, done);
		releasing.add(settled);
		settled.finally(() => releasing.delete(settled));
	}
	function inventory(binding) {
		const entry = selectBinding(machine.state, binding);
		return entry ? selectInventory(entry) : {
			tabs: [],
			focusedTabID: null
		};
	}
	/** The tab's current page. */
	function page(binding, tabID) {
		const attempt = selectPageAttempt(machine.state, binding, tabID);
		return attempt === void 0 ? void 0 : handles.get(binding)?.pages.get(attempt);
	}
	/** The tab's page, created the first time the pane shows a restored or crashed tab or a command names it. */
	function load(binding, tabID) {
		const existing = page(binding, tabID);
		if (existing) return existing;
		const slot = selectTabSlot(machine.state, binding, tabID);
		if (slot?.status !== "unloaded") return void 0;
		const tab = slot.tab;
		return create(binding, { restore: {
			id: tab.id,
			url: tab.url,
			title: tab.title,
			loading: false,
			canGoBack: false,
			canGoForward: false,
			generation: tab.generation
		} });
	}
	function create(binding, options = {}) {
		const entry = selectBinding(machine.state, binding);
		const handle = handles.get(binding);
		if (entry?.status !== "attached" || !handle?.network) throw new Error("Browser network is not ready; no tab was opened.");
		const id = options.restore?.id ?? TabID.make(`tab_${crypto.randomUUID()}`);
		const attempt = entry.nextAttempt;
		const win = handle.win;
		const current = () => isCurrentPage(machine.state, binding, id, attempt);
		const focused = () => isFocusedPage(machine.state, binding, id, attempt);
		const fail = () => {
			if (current()) dispatchBinding(binding, {
				type: "tab.crashed",
				tabID: id,
				attempt,
				tab: page.contents.isDestroyed() ? void 0 : page.state()
			});
		};
		const page = createBrowserPage(win, {
			id,
			partition: handle.partition,
			network: handle.network,
			initialize: options.initialize,
			restore: options.restore,
			popupOptions: options.popupOptions,
			fileRoots: () => selectFileRoots(machine.state, binding),
			shared,
			embeds: input.embeds,
			fail,
			publish: (error) => {
				if (current()) dispatchBinding(binding, {
					type: "tab.published",
					tabID: id,
					attempt,
					tab: page.state(),
					error
				});
			},
			inspect: (event) => {
				if (current()) emit(binding, {
					type: "inspect",
					tabID: id,
					...event
				});
			},
			detail: (value) => {
				if (current()) emit(binding, {
					type: "page",
					tabID: id,
					...value
				});
			},
			zoomed: () => handles.get(binding)?.pages.forEach((page) => page.detail()),
			shortcut: (shortcut) => {
				if (!focused() || win.isDestroyed()) return;
				if (win.isFocused()) win.webContents.focus();
				emit(binding, {
					type: "shortcut",
					...shortcut
				});
			},
			focused: () => {
				if (focused()) emit(binding, {
					type: "focused",
					tabID: id
				});
			},
			popup: (popupOptions, background) => {
				const popup = create(binding, {
					initialize: false,
					popupOptions
				});
				if (!background) dispatchBinding(binding, {
					type: "tab.focused",
					tabID: popup.state().id
				});
				return popup.contents;
			}
		});
		handle.pages.set(attempt, page);
		dispatchBinding(binding, {
			type: "tab.opened",
			tabID: id,
			attempt,
			tab: options.restore ?? page.state()
		});
		emit(binding, {
			type: "embed",
			tabID: id,
			embed: page.embed
		});
		page.ready.then(() => {
			if (current()) dispatchBinding(binding, {
				type: "tab.published",
				tabID: id,
				attempt,
				tab: page.state()
			});
		}, fail);
		return page;
	}
	/** Reports the page's state after a command, which may have changed it without a page event yet. */
	function refresh(binding, tabID, page) {
		const attempt = selectPageAttempt(machine.state, binding, tabID);
		if (attempt === void 0 || handles.get(binding)?.pages.get(attempt) !== page) return;
		dispatchBinding(binding, {
			type: "tab.published",
			tabID,
			attempt,
			tab: page.state()
		});
	}
	async function execute(binding, command, signal) {
		const action = command.action;
		if (signal.aborted) throw new Error("Browser request was cancelled. Do not repeat a mutating action until you have inspected its outcome.");
		if (action.type === "tabs.list") return {
			value: inventory(binding),
			files: []
		};
		if (action.type === "preview") {
			emit(binding, {
				type: "preview",
				path: action.path
			});
			return {
				value: { path: action.path },
				files: []
			};
		}
		if (action.type === "tabs.open") {
			const page = create(binding);
			const tabID = page.state().id;
			if (action.focus !== false) dispatchBinding(binding, {
				type: "tab.focused",
				tabID
			});
			await page.ready;
			if (action.url !== void 0) await page.execute({
				action: {
					type: "navigate",
					tabID,
					url: action.url
				},
				files: []
			}, signal);
			refresh(binding, tabID, page);
			return {
				value: page.state(),
				files: []
			};
		}
		const slot = selectTabSlot(machine.state, binding, action.tabID);
		if (!slot) throw new Error("Browser tab is unavailable. Call browser.tabs.list({}) and use an existing tabID from this session; a closed tab is not replaced automatically.");
		if (action.type === "tabs.focus") {
			dispatchBinding(binding, {
				type: "tab.focused",
				tabID: action.tabID
			});
			return {
				value: slot.tab,
				files: []
			};
		}
		if (action.type === "tabs.close") {
			const closing = page(binding, action.tabID);
			dispatchBinding(binding, {
				type: "tab.closed",
				tabID: action.tabID
			});
			if (closing) await disposals.get(closing);
			return {
				value: inventory(binding),
				files: []
			};
		}
		const target = load(binding, action.tabID);
		if (!target) throw new Error("Browser tab is unavailable. Call browser.tabs.list({}) and use an existing tabID.");
		await target.ready;
		const result = await target.execute(command, signal);
		refresh(binding, action.tabID, target);
		return result;
	}
}
//#endregion
export { createBrowserPane };
