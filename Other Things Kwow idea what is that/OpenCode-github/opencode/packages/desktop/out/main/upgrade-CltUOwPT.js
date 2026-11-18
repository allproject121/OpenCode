import { Xc as sync, Yc as suspend, Zo as acquireRelease, cs as callback, dl as void_, rs as as, ws as fail } from "./Latch-oSncnOpo.js";
import { R as SocketError, z as SocketOpenError } from "./HttpClient-CNGYnc6V.js";
import { n as fromDuplex } from "./NodeSocket-CF13L4WJ.js";
import { Readable, finished } from "node:stream";
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/internal/upgrade.js
/**
* Wraps an upgraded connection. Acquiring the reader runs `open`; releasing
* its scope closes the connection.
*
* No `data` listener is attached before acquisition, so early bytes stay buffered.
*
* @internal
*/
var toSocket = (conn, open = void_) => fromDuplex(acquireRelease(suspend(() => conn.destroyed ? fail(openError("The upgraded connection closed before it was read")) : as(open, conn)), (conn) => sync(() => {
	if (conn.destroyed) return;
	if ("destroySoon" in conn) conn.destroySoon();
	else conn.destroy();
})));
var openError = (cause) => new SocketError({ reason: new SocketOpenError({
	kind: "Unknown",
	cause: typeof cause === "string" ? new Error(cause) : cause
}) });
/**
* Node 25 and older stop parsing at the head of an upgrade request, leaving
* the body in `head` and on the connection. Reads a `Content-Length` body
* from them on demand and returns the bytes after it.
*
* @internal
*/
var frameBody = (conn, head, length) => {
	if (head.length >= length) return {
		body: Readable.from(length === 0 ? [] : [head.subarray(0, length)], { objectMode: false }),
		rest: head.subarray(length)
	};
	let remaining = length - head.length;
	let reading = false;
	const stop = () => {
		conn.off("readable", onReadable);
		conn.off("end", onEnd);
	};
	const onReadable = () => {
		while (remaining > 0) {
			let chunk = conn.read();
			if (chunk === null) return;
			if (chunk.length > remaining) {
				conn.unshift(chunk.subarray(remaining));
				chunk = chunk.subarray(0, remaining);
			}
			remaining -= chunk.length;
			if (!body.push(chunk) && remaining > 0) return;
		}
		stop();
		body.push(null);
	};
	const onEnd = () => {
		stop();
		body.destroy(/* @__PURE__ */ new Error("The connection closed before the request body ended"));
	};
	const body = new Readable({
		read() {
			if (reading) return onReadable();
			reading = true;
			if (head.length > 0) this.push(head);
			if (conn.readableEnded) return onEnd();
			conn.on("readable", onReadable);
			conn.on("end", onEnd);
		},
		destroy(error, callback) {
			stop();
			callback(error);
		}
	});
	body.on("error", () => {});
	return {
		body,
		rest: Buffer.alloc(0)
	};
};
/**
* Waits for the request body to end before the `101` is written, discarding
* any of it the handler did not read, up to `maxBytes`.
*
* @internal
*/
var drainBody = (body, maxBytes) => callback((resume) => {
	if (body.readableEnded) return resume(void_);
	let bytes = 0;
	const cleanup = finished(body, {
		readable: true,
		writable: false
	}, (error) => {
		done();
		resume(error ? fail(openError(error)) : void_);
	});
	function onData(chunk) {
		bytes += chunk.length;
		if (maxBytes !== void 0 && bytes > maxBytes) {
			done();
			resume(fail(openError("The request body exceeds the maximum body size")));
		}
	}
	function done() {
		body.off("data", onData);
		cleanup();
	}
	body.on("data", onData);
	body.resume();
	return sync(done);
});
//#endregion
export { drainBody, frameBody, toSocket };
