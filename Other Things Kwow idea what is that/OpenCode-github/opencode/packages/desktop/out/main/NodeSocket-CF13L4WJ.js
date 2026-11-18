import { Au as addFinalizer, Bc as scope, Hs as gen, Kc as succeed, Qg as identity, Ru as provide, Wm as Service, Xc as sync, Yc as suspend, Zo as acquireRelease, cs as callback, dl as void_, ll as updateContext, ml as withFiber, nm as ensure, pm as map, r as makeUnsafe, th as merge, tl as timeoutOrElse, ws as fail, xa as value } from "./Latch-oSncnOpo.js";
import { B as SocketReadError, G as make, H as SocketWriteError, L as SocketCloseError, R as SocketError, U as isCloseEvent, V as SocketUpgradeError, z as SocketOpenError } from "./HttpClient-CNGYnc6V.js";
import { Buffer } from "node:buffer";
import * as Tls from "node:tls";
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/NodeSocket.js
/**
* Node socket adapters for Effect sockets.
*
* This module opens `node:net` or `node:tls` connections, or wraps existing
* Node `Duplex` streams, and presents them as `Socket.Socket` values, socket
* channels, or layers. It also exposes the `NetSocket` service tag for the
* underlying Node socket.
*
* @stability unstable
* @since 4.0.0
*/
var isDeno = "Deno" in globalThis;
/**
* Service tag for the underlying Node `net.Socket` associated with the current
* socket connection.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var NetSocket = class extends Service()("@effect/platform-node/NodeSocket/NetSocket") {};
var readAvailable = (conn, chunkSize) => {
	const first = conn.read();
	if (first === null) return void 0;
	const out = [first];
	let chunk;
	while (out.length < chunkSize && (chunk = conn.read()) !== null) out.push(chunk);
	return out;
};
var toBuffers = (input) => map(ensure(input), (value) => Buffer.from(value));
/**
* Adapts a Node `Duplex` into a `Socket.Socket`.
*
* **Details**
*
* Reader acquisition opens the duplex and keeps it paused: each pull reads at
* most `chunkSize` chunks (default 4096) with `stream.read()`. On Node 26+ that
* yields each buffered chunk as a separate batch element with no copy. Earlier Node
* concatenates the buffer into one chunk. The stream is never resumed, so once
* Node's buffer reaches its `highWaterMark` the kernel receive window closes
* and the peer blocks: backpressure is end-to-end with no buffering above
* Node's own.
*
* Writes use `write()` return-value backpressure, awaiting one `drain` when
* the internal buffer is full. `writeAll` corks the stream around the batch.
* Releasing the writer scope half-closes the stream (`end()`).
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var fromDuplex = (open, options) => withFiber((fiber) => {
	let currentSocket;
	const latch = makeUnsafe(false);
	const openServices = fiber.context;
	const isServer = options?.tlsServer === true;
	const requestedChunkSize = options?.chunkSize ?? 4096;
	const chunkSize = requestedChunkSize === Infinity || Number.isSafeInteger(requestedChunkSize) && requestedChunkSize > 0 ? requestedChunkSize : 4096;
	const secureEvent = isServer ? "secure" : "secureConnect";
	const reader = gen(function* () {
		const scope$1 = yield* scope;
		let conn = yield* provide(open, scope$1).pipe(options?.openTimeout !== void 0 ? timeoutOrElse({
			duration: options.openTimeout,
			orElse: () => fail(new SocketError({ reason: new SocketOpenError({
				kind: "Timeout",
				cause: /* @__PURE__ */ new Error("Connection timed out")
			}) }))
		}) : identity);
		let error;
		let waiter;
		let pending;
		let reading = false;
		let closed = false;
		let upgradeAvailable = true;
		function drain() {
			if (waiter === void 0 || reading) return;
			let chunk = pending;
			pending = void 0;
			if (chunk === void 0 && !closed) {
				reading = true;
				try {
					chunk = readAvailable(conn, chunkSize);
				} finally {
					reading = false;
				}
			}
			if (closed) chunk = void 0;
			if (waiter === void 0) {
				pending = chunk;
				return;
			}
			const result = chunk !== void 0 ? succeed(chunk) : error !== void 0 ? fail(error) : void 0;
			if (result === void 0) return;
			const resume = waiter;
			waiter = void 0;
			resume(result);
		}
		function end(err) {
			error ??= err;
			drain();
		}
		function close(err) {
			error ??= err;
			closed = true;
			pending = void 0;
			drain();
		}
		function onEnd() {
			end(new SocketError({ reason: new SocketCloseError({ code: 1e3 }) }));
		}
		function onError(cause) {
			close(new SocketError({ reason: new SocketReadError({ cause }) }));
		}
		function onClose(hadError) {
			const err = new SocketError({ reason: new SocketCloseError({ code: hadError ? 1006 : 1e3 }) });
			if (hadError) close(err);
			else end(err);
		}
		function attachReadListeners(conn) {
			conn.on("readable", drain);
			conn.on("end", onEnd);
			conn.on("error", onError);
			conn.on("close", onClose);
		}
		function detachReadListeners(conn) {
			conn.off("readable", drain);
			conn.off("end", onEnd);
			conn.off("error", onError);
			conn.off("close", onClose);
		}
		if (!isDeno) conn.pause();
		attachReadListeners(conn);
		yield* addFinalizer(scope$1, sync(() => {
			close(new SocketError({ reason: new SocketCloseError({ code: 1006 }) }));
			detachReadListeners(conn);
			latch.closeUnsafe();
			currentSocket = void 0;
			upgradeAvailable = false;
		}));
		currentSocket = conn;
		latch.openUnsafe();
		const pull = callback((resume) => {
			waiter = resume;
			drain();
			if (waiter !== resume) return;
			return sync(() => {
				if (waiter === resume) waiter = void 0;
			});
		});
		const upgrade = (upgradeOptions = {}) => suspend(() => {
			if (!upgradeAvailable) return fail(new SocketError({ reason: new SocketUpgradeError({ cause: /* @__PURE__ */ new Error("socket is already upgraded or closed") }) }));
			const hasKey = upgradeOptions.key !== void 0;
			const hasCert = upgradeOptions.cert !== void 0;
			if (isServer && (!hasKey || !hasCert) || hasKey !== hasCert) return fail(new SocketError({ reason: new SocketUpgradeError({ cause: /* @__PURE__ */ new Error(isServer ? "server TLS upgrade requires both key and cert" : "TLS upgrade credentials must include both key and cert") }) }));
			return callback((resume) => {
				const raw = conn;
				detachReadListeners(raw);
				let tls;
				try {
					const tlsOptions = {
						secureContext: Tls.createSecureContext({
							key: upgradeOptions.key === void 0 ? void 0 : map(ensure(upgradeOptions.key), (value$1) => Buffer.from(value(value$1))),
							cert: upgradeOptions.cert === void 0 ? void 0 : toBuffers(upgradeOptions.cert),
							ca: upgradeOptions.ca === void 0 ? void 0 : toBuffers(upgradeOptions.ca),
							passphrase: upgradeOptions.passphrase === void 0 ? void 0 : value(upgradeOptions.passphrase)
						}),
						ALPNProtocols: upgradeOptions.alpnProtocols === void 0 ? void 0 : [...upgradeOptions.alpnProtocols],
						requestCert: upgradeOptions.requestCert,
						rejectUnauthorized: upgradeOptions.rejectUnauthorized
					};
					tls = isServer ? new Tls.TLSSocket(raw, {
						...tlsOptions,
						isServer: true
					}) : Tls.connect({
						...tlsOptions,
						servername: upgradeOptions.servername,
						socket: raw
					});
				} catch (cause) {
					attachReadListeners(raw);
					resume(fail(new SocketError({ reason: new SocketUpgradeError({ cause }) })));
					return;
				}
				conn = tls;
				currentSocket = tls;
				tls.pause();
				function cleanup() {
					tls.off(secureEvent, succeed);
					tls.off("error", failUpgrade);
					tls.off("close", onUpgradeClose);
				}
				function succeed() {
					cleanup();
					upgradeAvailable = false;
					attachReadListeners(tls);
					resume(void_);
				}
				function failUpgrade(cause) {
					cleanup();
					const upgradeError = new SocketError({ reason: new SocketUpgradeError({ cause }) });
					close(upgradeError);
					resume(fail(upgradeError));
				}
				function onUpgradeClose() {
					failUpgrade(/* @__PURE__ */ new Error("socket closed during TLS upgrade"));
				}
				tls.once(secureEvent, succeed);
				tls.once("error", failUpgrade);
				tls.once("close", onUpgradeClose);
				return sync(() => {
					cleanup();
					close(new SocketError({ reason: new SocketCloseError({ code: 1006 }) }));
					tls.destroy();
				});
			});
		});
		return {
			pull,
			upgrade
		};
	}).pipe(updateContext((input) => merge(openServices, input)));
	const awaitDrain = (conn) => callback((resume) => {
		function cleanup() {
			conn.off("drain", onDrain);
			conn.off("error", onError);
			conn.off("close", onClose);
		}
		function onDrain() {
			cleanup();
			resume(void_);
		}
		function onError(cause) {
			cleanup();
			resume(fail(new SocketError({ reason: new SocketWriteError({ cause }) })));
		}
		function onClose() {
			cleanup();
			resume(fail(new SocketError({ reason: new SocketWriteError({ cause: /* @__PURE__ */ new Error("socket closed") }) })));
		}
		conn.on("drain", onDrain);
		conn.on("error", onError);
		conn.on("close", onClose);
		return sync(cleanup);
	});
	const write = (chunk) => suspend(() => {
		const conn = currentSocket;
		if (conn === void 0) return latch.whenOpen(write(chunk));
		if (isCloseEvent(chunk)) {
			conn.destroy(chunk.code > 1e3 ? /* @__PURE__ */ new Error(`closed with code ${chunk.code}`) : void 0);
			return void_;
		}
		try {
			return conn.write(chunk) ? void_ : awaitDrain(conn);
		} catch (cause) {
			return fail(new SocketError({ reason: new SocketWriteError({ cause }) }));
		}
	});
	const writeAll = (chunks) => suspend(() => {
		const conn = currentSocket;
		if (conn === void 0) return latch.whenOpen(writeAll(chunks));
		let needsDrain = false;
		try {
			if (chunks.length === 1) needsDrain = !conn.write(chunks[0]);
			else {
				conn.cork();
				try {
					for (let i = 0; i < chunks.length; i++) needsDrain = !conn.write(chunks[i]) || needsDrain;
				} finally {
					conn.uncork();
				}
			}
		} catch (cause) {
			return fail(new SocketError({ reason: new SocketWriteError({ cause }) }));
		}
		return needsDrain ? awaitDrain(conn) : void_;
	});
	const writer = acquireRelease(succeed({
		write,
		writeAll
	}), () => sync(() => {
		if (!currentSocket || currentSocket.writableEnded) return;
		currentSocket.end();
	}));
	return succeed(make({
		reader,
		writer
	}));
});
//#endregion
export { fromDuplex as n, NetSocket as t };
