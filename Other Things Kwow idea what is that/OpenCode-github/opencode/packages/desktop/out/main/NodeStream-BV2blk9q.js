import { $l as isDoneCause, As as flatMap, Au as addFinalizer, Bo as fromInputUnsafe, Cc as raceFirst, Ds as failSync, Gu as _await, Is as forever, Kc as succeed, Qg as identity, Sd as UnknownError, Ss as ensuring, Td as done, Xc as sync, Xl as catchDone, Yc as suspend, cs as callback, dl as void_, ml as withFiber, mm as of, od as fail$1, qg as constVoid, qu as doneUnsafe, r as makeUnsafe$1, rs as as, td as makeUnsafe, ts as andThen, uc as onError, vd as Done, ws as fail } from "./Latch-oSncnOpo.js";
import { Bt as make, Et as fromChannel, Ft as mapDone, Nt as fromTransform, W as fromChannel$1 } from "./dist-DWveHAM-.js";
import { finished } from "node:stream";
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/internal/stream.js
var destroyStream = (stream, cleanup, onDestroyed) => {
	if (!("closed" in stream)) {
		cleanup();
		onDestroyed?.();
		return;
	}
	const onDone = () => {
		clearImmediate(immediate);
		stream.off("error", onDone);
		stream.off("close", onDone);
		onDestroyed?.();
	};
	const onClosed = () => {
		if (stream.closed) onDone();
		else {
			immediate = setImmediate(onClosed);
			if (!onDestroyed) immediate.unref();
		}
	};
	let immediate = setImmediate(onClosed);
	if (!onDestroyed) immediate.unref();
	stream.once("error", onDone);
	stream.once("close", onDone);
	cleanup();
	if (!stream.closed) stream.destroy();
};
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/NodeSink.js
/**
* Creates a `Sink` that writes chunks to a Node writable stream, respecting
* backpressure and mapping writable errors with `onError`. Unless `endOnDone`
* is `false`, the writable is ended on completion and destroyed on upstream
* failure or interruption.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var fromWritable = (options) => fromChannel(mapDone(fromWritableChannel(options), (_) => [_]));
/**
* Creates a `Channel` that pulls chunks from upstream and writes them to a
* Node writable stream, respecting backpressure. Unless `endOnDone` is
* `false`, the writable is ended when upstream is done and destroyed on
* upstream failure or interruption.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var fromWritableChannel = (options) => fromTransform((pull) => {
	const writable = options.evaluate();
	const write = pullIntoWritable({
		...options,
		writable,
		pull
	});
	return succeed(options.endOnDone === false ? write : onError(write, (cause) => isDoneCause(cause) ? void_ : releaseWritable(writable)));
});
var releaseWritable = (writable) => callback((resume) => {
	const onDestroyed = () => resume(void_);
	if (writable.closed) {
		const cleanup = finished(writable, { readable: false }, () => {
			cleanup();
			onDestroyed();
		});
	} else destroyStream(writable, constVoid, onDestroyed);
});
/**
* Writes Effect chunks into a Node writable stream.
*
* **When to use**
*
* Use to implement custom Node stream adapters that already have an upstream
* pull and need direct control over a writable stream.
*
* **Details**
*
* The loop waits for `drain` when needed, fails on writable errors, and ends
* the writable on upstream completion unless `endOnDone` is `false`.
*
* @stability unstable
* @category converting
* @since 4.0.0
*/
var pullIntoWritable = (options) => withFiber((fiber) => {
	const dispatcher = fiber.currentDispatcher;
	const completion = makeUnsafe();
	const failure = makeUnsafe();
	const onError = (error) => doneUnsafe(failure, failSync(() => options.onError(error)));
	let errorEmitted = false;
	const onStreamError = (error) => {
		errorEmitted = true;
		onError(error);
	};
	options.writable.on("error", onStreamError);
	const cleanup = finished(options.writable, { readable: false }, (error) => {
		if (error) onError(error);
		else doneUnsafe(completion, void_);
	});
	return options.pull.pipe(flatMap((chunk) => {
		let i = 0;
		return callback((resume) => {
			let cancelled = false;
			const onFinish = () => dispatcher.scheduleTask(loop, 0);
			const loop = () => {
				options.writable.off("drain", loop);
				options.writable.off("finish", onFinish);
				for (; i < chunk.length;) {
					if (cancelled) return;
					if (!options.writable.write(chunk[i++], options.encoding, (error) => {
						if (!error) return;
						if (options.writable.closed) onError(error);
						else dispatcher.scheduleTask(() => onError(error), 0);
					})) {
						if (!cancelled) {
							options.writable.once("drain", loop);
							options.writable.once("finish", onFinish);
						}
						return;
					}
				}
				if (!cancelled) resume(void_);
			};
			loop();
			return sync(() => {
				cancelled = true;
				options.writable.off("drain", loop);
				options.writable.off("finish", onFinish);
			});
		});
	}), forever({ disableYield: true }), options.endOnDone !== false ? catchDone((_) => {
		options.writable.end();
		return andThen(_await(completion), done(_));
	}) : identity, raceFirst(_await(failure)), ensuring(sync(() => {
		cleanup();
		const removeErrorListener = () => {
			options.writable.off("error", onStreamError);
			options.writable.off("error", removeErrorListener);
			options.writable.off("close", removeErrorListener);
		};
		if (options.writable.errored && !options.writable.closed && !errorEmitted) {
			options.writable.once("error", removeErrorListener);
			options.writable.once("close", removeErrorListener);
		} else removeErrorListener();
	})));
});
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/NodeStream.js
/**
* Adapters between Node streams and Effect streams, channels, and readables.
*
* This module is the stream boundary for Node APIs. It wraps `Readable` and
* `Duplex` values as Effect `Stream`s and `Channel`s, pipes Effect streams
* through Node duplex streams, exposes an Effect `Stream` back to Node as a
* `Readable`, and collects readable payloads into strings, array buffers, or
* `Uint8Array`s with optional byte limits.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Error indicating that a buffered Node stream exceeded its byte limit.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var MaxBytesError = class extends Error {
	_tag = "MaxBytesError";
	maxBytes;
	constructor(maxBytes) {
		super("maxBytes exceeded");
		this.maxBytes = maxBytes;
	}
};
/**
* Converts a Node readable stream into an Effect `Stream`, reading chunks with
* independent read sizes and batch limits, mapping stream errors with `onError`,
* and destroying the readable on completion unless `closeOnDone` is `false`.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var fromReadable = (options) => fromChannel$1(fromReadableChannel(options));
/**
* Creates a `Channel` that pulls chunks from a Node readable stream, mapping
* errors with `onError` and destroying the readable on completion unless
* `closeOnDone` is `false`.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var fromReadableChannel = (options) => fromTransform((_, scope) => readableToPullUnsafe({
	scope,
	readable: options.evaluate(),
	onError: options.onError ?? defaultOnError,
	chunkSize: options.chunkSize,
	readSize: options.readSize,
	closeOnDone: options.closeOnDone
}));
/**
* Consumes a Node readable stream into an `ArrayBuffer`, failing through
* `onError` on stream errors or when `maxBytes` is exceeded and destroying the
* stream on interruption or failure.
* Set `destroyOnOverflow` to `false` to drain the remaining data instead of
* destroying the stream when the byte limit is exceeded.
*
* @stability unstable
* @category converting
* @since 4.0.0
*/
var toArrayBuffer = (readable, options) => {
	const maxBytesNumber = toMaxBytes(options?.maxBytes);
	const onError = options?.onError ?? defaultOnError;
	return callback((resume) => {
		const stream = readable();
		const buffers = [];
		let bytes = 0;
		const cleanup = finished(stream, {
			readable: true,
			writable: false
		}, (err) => {
			stream.off("data", onData);
			if (err) {
				destroyStream(stream, cleanup);
				return resume(fail(onError(err)));
			}
			cleanup();
			const buffer = buffers.length === 1 ? buffers[0] : Buffer.concat(buffers);
			if (buffer.byteOffset === 0 && buffer.buffer.byteLength === buffer.byteLength) return resume(succeed(buffer.buffer));
			resume(succeed(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)));
		});
		function onData(chunk) {
			buffers.push(chunk);
			bytes += chunk.length;
			if (maxBytesNumber !== void 0 && bytes > maxBytesNumber) {
				stream.off("data", onData);
				if (options?.destroyOnOverflow === false) drainReadable(stream, cleanup);
				else destroyStream(stream, cleanup);
				resume(fail(onError(new MaxBytesError(maxBytesNumber))));
			}
		}
		stream.on("data", onData);
		return sync(() => {
			stream.off("data", onData);
			destroyStream(stream, cleanup);
		});
	});
};
var drainReadable = (stream, cleanup) => {
	cleanup();
	const done = finished(stream, {
		readable: true,
		writable: false
	}, () => done());
	stream.resume();
};
var readableToPullUnsafe = (options) => {
	const readable = options.readable;
	const chunkSize = options.chunkSize ?? 4096;
	const closeOnDone = options.closeOnDone ?? true;
	const exit = options.exit ?? make(void 0);
	const latch = options.latch ?? makeUnsafe$1(false);
	function onReadable() {
		latch.openUnsafe();
	}
	readable.on("readable", onReadable);
	const cleanup = finished(readable, {
		readable: true,
		writable: false
	}, (error) => {
		exit.current ??= fail$1(error ? options.onError(error) : Done());
		latch.openUnsafe();
	});
	const pull = suspend(function loop() {
		let item = options.readable.read(options.readSize);
		if (item === null) {
			if (exit.current) return exit.current;
			if (readable.readableEnded) return fail(Done());
			latch.closeUnsafe();
			return flatMap(latch.await, loop);
		}
		const chunk = of(item);
		while (chunk.length < chunkSize) {
			item = options.readable.read(options.readSize);
			if (item === null) break;
			chunk.push(item);
		}
		return succeed(chunk);
	});
	return as(addFinalizer(options.scope, sync(() => {
		readable.off("readable", onReadable);
		if (closeOnDone) destroyStream(readable, cleanup);
		else cleanup();
	})), pull);
};
var defaultOnError = (error) => new UnknownError(error);
var toMaxBytes = (maxBytes) => maxBytes === void 0 || maxBytes === Infinity ? void 0 : Number(fromInputUnsafe(maxBytes));
//#endregion
export { toArrayBuffer as n, fromWritable as r, fromReadable as t };
