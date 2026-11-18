import { Ap as DisablePropagation, As as flatMap, C as Error$1, Ca as fromSetCookie, Fc as runSync, Ft as decodeEffect, Gg as constTrue, I as Literals, Kc as succeed, Lp as TaggedError$1, M as Int, Nm as isSuccess, Pd as hasInterrupts, Rm as try_, Tg as hasProperty, Ts as failCause, Um as Reference, Uu as TracerTimingEnabled, Wg as constFalse, Wm as Service, Xc as sync, Xt as fromJsonString, Yc as suspend, Yg as dual, _a as setAll, _u as effect, aa as setAll$1, ag as NodeInspectSymbol, ar as optional, at as String$1, ca as unwrap, cg as format, cl as uninterruptibleMask, cr as tag, da as fromInput$1, ea as CurrentRedactedNames$1, eg as getStackTraceLimit, fa as fromRecordUnsafe, fg as redact, fh as isNone, ga as set, gh as none, ha as remove, hh as match, hl as withParentSpan, ia as redactUrl, jm as isFailure, la as CurrentRedactedNames, ll as updateContext, lr as toCodecJson, lu as Clock, ml as withFiber, n_ as pipeArguments, na as empty$2, ng as BaseProto, nl as tryPromise, oa as toString, oc as matchCauseEffect, od as fail$1, oh as fromNullishOr, pa as isRedactedName, pc as onInterrupt, ra as fromInput, rg as Class, rl as try_$1, sa as fromBody, ss as cached, ta as appendAll, tc as map, tg as setStackTraceLimit, th as merge, ua as empty$3, uh as getOrUndefined, ul as useSpan, ut as TaggedError, vh as some, vs as contextWith, ws as fail, wt as Union, y as Defect } from "./Latch-oSncnOpo.js";
import { L as ensuring, R as fail$2, ht as suspend$1, q as fromReadableStream } from "./dist-DWveHAM-.js";
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/socket/Socket.js
/**
* Runtime type identifier attached to `Socket` services.
*
* @stability unstable
* @category type IDs
* @since 4.0.0
*/
var TypeId$6 = "~effect/socket/Socket";
/**
* Returns `true` when a value is a `Socket`.
*
* @stability unstable
* @category guards
* @since 4.0.0
*/
var isSocket = (u) => hasProperty(u, TypeId$6);
/**
* Service tag for bidirectional socket transports.
*
* **When to use**
*
* Use to access or provide the socket implementation used by programs that
* read and write frames through the Effect environment.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var Socket = /*#__PURE__*/ Service("effect/socket/Socket");
/**
* Constructs a `Socket` from a reader acquisition and a scoped writer.
*
* **Details**
*
* The reader must fail a suspended pull when its acquisition scope closes; see
* `Socket` for why. A reader that leaves a pull blocked forever will hang any
* consumer that shuts the socket down by closing that scope.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$3 = (options) => Socket.of({
	[TypeId$6]: TypeId$6,
	reader: options.reader,
	writer: options.writer
});
var encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
* Acquires the socket's binary `pull`, encoding any string frames as UTF-8
* bytes.
*
* **Details**
*
* When a pulled batch contains no string frames it is returned as-is, so
* transports that only emit bytes (TCP) pay no per-chunk cost.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var readerBytes = (self) => map(self.reader, ({ pull }) => map(pull, (chunk) => {
	for (let i = 0; i < chunk.length; i++) if (typeof chunk[i] === "string") {
		const out = new Array(chunk.length);
		for (let j = 0; j < chunk.length; j++) {
			const item = chunk[j];
			out[j] = typeof item === "string" ? encoder$1.encode(item) : item;
		}
		return out;
	}
	return chunk;
}));
var CloseEventTypeId = "~effect/socket/Socket/CloseEvent";
/**
* Returns `true` when a value is a `CloseEvent`.
*
* @stability unstable
* @category guards
* @since 4.0.0
*/
var isCloseEvent = (u) => hasProperty(u, CloseEventTypeId);
/**
* Runtime type identifier attached to `SocketError` values.
*
* @stability unstable
* @category type IDs
* @since 4.0.0
*/
var SocketErrorTypeId = "~effect/socket/Socket/SocketError";
/**
* Returns `true` when a value is a `SocketError`.
*
* @stability unstable
* @category guards
* @since 4.0.0
*/
var isSocketError = (u) => hasProperty(u, SocketErrorTypeId);
/**
* Typed error for failures that occur while reading from a socket.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketReadError = class extends Error$1("effect/socket/Socket/SocketReadError")({
	_tag: /*#__PURE__*/ tag("SocketReadError"),
	cause: /*#__PURE__*/ Defect()
}) {
	/**
	* Default message used for socket read failures.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	message = `An error occurred during Read`;
};
/**
* Typed error for failures that occur while writing to a socket.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketWriteError = class extends Error$1("effect/socket/Socket/SocketWriteError")({
	_tag: /*#__PURE__*/ tag("SocketWriteError"),
	cause: /*#__PURE__*/ Defect()
}) {
	/**
	* Default message used for socket write failures.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	message = `An error occurred during Write`;
};
/**
* Typed error for failures that occur while opening a socket, including
* unknown open failures and open timeouts.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketOpenError = class extends Error$1("effect/socket/Socket/SocketOpenError")({
	_tag: /*#__PURE__*/ tag("SocketOpenError"),
	kind: /*#__PURE__*/ Literals(["Unknown", "Timeout"]),
	cause: /*#__PURE__*/ Defect()
}) {
	/**
	* Formats timeout and unknown open failures for display.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		return this.kind === "Timeout" ? `timeout waiting for "open"` : `An error occurred during Open`;
	}
};
/**
* Typed error for an unsupported or failed in-place TLS upgrade.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketUpgradeError = class SocketUpgradeError extends Error$1("effect/socket/Socket/SocketUpgradeError")({
	_tag: /*#__PURE__*/ tag("SocketUpgradeError"),
	cause: /*#__PURE__*/ optional(/*#__PURE__*/ Defect())
}) {
	/**
	* An upgrade implementation for transports that cannot wrap the connection
	* with TLS.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	static unsupported = () => fail(new SocketError({ reason: new SocketUpgradeError({}) }));
	get message() {
		return this.cause === void 0 ? `Socket does not support TLS upgrade` : `An error occurred during TLS upgrade`;
	}
};
/**
* Typed error for a socket close, carrying the close code and optional close
* reason.
*
* **Details**
*
* Sockets never classify closes: any close, whatever the code, fails the
* reader with a `SocketError` wrapping this reason. Consumers that treat a
* close as normal catch it.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketCloseError = class extends Error$1("effect/socket/Socket/SocketCloseError")({
	_tag: /*#__PURE__*/ tag("SocketCloseError"),
	code: Int,
	closeReason: /*#__PURE__*/ optional(String$1)
}) {
	get message() {
		if (this.closeReason) return `${this.code}: ${this.closeReason}`;
		return `${this.code}`;
	}
};
/**
* Schema for all socket-specific error reasons.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketErrorReason = /*#__PURE__*/ Union([
	SocketReadError,
	SocketWriteError,
	SocketOpenError,
	SocketUpgradeError,
	SocketCloseError
]);
/**
* Tagged error that wraps socket read, write, open, upgrade, and close failures
* while preserving the underlying reason.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketError = class extends TaggedError(SocketErrorTypeId)("SocketError", {
	_tag: /*#__PURE__*/ tag("SocketError"),
	reason: SocketErrorReason
}) {
	constructor(props) {
		if ("cause" in props.reason) super({
			...props,
			cause: props.reason.cause
		});
		else super(props);
	}
	/**
	* Marks this value as a socket error wrapper for runtime guards.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	[SocketErrorTypeId] = SocketErrorTypeId;
	/**
	* Returns `true` when the value is a `SocketError`.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	static is(u) {
		return isSocketError(u);
	}
	message = this.reason.message;
};
Service()("~effect/socket/Socket/WebSocket");
Service()("@effect/platform/Socket/WebSocketConstructor");
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpBody.js
var TypeId$5 = "~effect/http/HttpBody";
/**
* Returns `true` if the provided value is an `HttpBody`.
*
* @stability unstable
* @category guards
* @since 4.0.0
*/
var isHttpBody = (u) => hasProperty(u, TypeId$5);
TaggedError$1("HttpBodyError");
var Proto$2 = class {
	[TypeId$5];
	constructor() {
		this[TypeId$5] = TypeId$5;
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	toString() {
		return format(this, { ignoreToString: true });
	}
};
/**
* HTTP body variant representing the absence of request content.
*
* @stability unstable
* @category models
* @since 4.0.0
*/
var Empty = class extends Proto$2 {
	_tag = "Empty";
	toJSON() {
		return {
			_id: "effect/HttpBody",
			_tag: "Empty"
		};
	}
};
/**
* Provides the singleton empty HTTP body.
*
* **When to use**
*
* Use when you need an HTTP body value that represents no body content.
*
* @stability unstable
* @category constants
* @since 4.0.0
*/
var empty$1 = /*#__PURE__*/ new Empty();
/**
* HTTP body variant backed by a `Uint8Array`.
*
* **Details**
*
* It stores the bytes, content type, and byte length.
*
* @stability unstable
* @category models
* @since 4.0.0
*/
var Uint8Array$1 = class extends Proto$2 {
	_tag = "Uint8Array";
	contentType;
	contentLength;
	/** Original text retained for adapters that can skip encoding. */
	text;
	_body;
	constructor(body, contentType, contentLength, text) {
		super();
		this._body = body;
		this.text = text;
		this.contentType = contentType;
		this.contentLength = contentLength;
	}
	get body() {
		return this._body ??= encodeText(this.text);
	}
	toJSON() {
		return {
			_id: "effect/HttpBody",
			_tag: "Uint8Array",
			body: this.contentType.startsWith("text/") || this.contentType.endsWith("json") ? new TextDecoder().decode(this.body) : `Uint8Array(${this.body.length})`,
			contentType: this.contentType,
			contentLength: this.contentLength
		};
	}
};
/**
* Creates a byte-array HTTP body.
*
* **Details**
*
* The content type defaults to `application/octet-stream`, and the content length is the byte array length.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var uint8Array = (body, contentType) => new Uint8Array$1(body, contentType ?? "application/octet-stream", body.length);
var encoder = /*#__PURE__*/ new TextEncoder();
var buffer = globalThis.Buffer;
var encodeText = buffer !== void 0 ? (body) => buffer.from(body, "utf8") : (body) => encoder.encode(body);
/**
* Creates a UTF-8 encoded text HTTP body.
*
* **Details**
*
* The content type defaults to `text/plain`. Text bodies are encoded lazily.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var text = (body, contentType) => {
	if (typeof body !== "string") body = body === void 0 ? "" : String(body);
	if (buffer !== void 0) return new Uint8Array$1(void 0, contentType ?? "text/plain", buffer.byteLength(body, "utf8"), body);
	const bytes = encoder.encode(body);
	return new Uint8Array$1(bytes, contentType ?? "text/plain", bytes.length, body);
};
/**
* Creates a JSON HTTP body using `JSON.stringify`, throwing if serialization fails.
*
* **Details**
*
* The content type defaults to `application/json`.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var jsonUnsafe = (body, contentType) => text(JSON.stringify(body), contentType ?? "application/json");
/**
* Creates an `application/x-www-form-urlencoded` HTTP body from `UrlParams`.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var urlParams = (urlParams, contentType) => text(toString(fromInput(urlParams)), contentType ?? "application/x-www-form-urlencoded");
/**
* HTTP body variant backed by Web `FormData`.
*
* **Details**
*
* The content type and content length are left unset so the runtime can supply multipart boundaries.
*
* @stability unstable
* @category models
* @since 4.0.0
*/
var FormData = class extends Proto$2 {
	_tag = "FormData";
	contentType = void 0;
	contentLength = void 0;
	formData;
	constructor(formData) {
		super();
		this.formData = formData;
	}
	toJSON() {
		return {
			_id: "effect/HttpBody",
			_tag: "FormData",
			formData: this.formData
		};
	}
};
/**
* Wraps a Web `FormData` value as an HTTP body.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var formData = (body) => new FormData(body);
/**
* HTTP body variant backed by a stream of `Uint8Array` chunks.
*
* @stability unstable
* @category models
* @since 4.0.0
*/
var Stream = class extends Proto$2 {
	_tag = "Stream";
	stream;
	contentType;
	contentLength;
	constructor(stream, contentType, contentLength) {
		super();
		this.stream = stream;
		this.contentType = contentType;
		this.contentLength = contentLength;
	}
	toJSON() {
		return {
			_id: "effect/HttpBody",
			_tag: "Stream",
			contentType: this.contentType,
			contentLength: this.contentLength
		};
	}
};
/**
* Creates a streaming HTTP body from a stream of byte chunks.
*
* **Details**
*
* The content type defaults to `application/octet-stream`; content length is optional.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var stream = (body, contentType, contentLength) => new Stream(body, contentType ?? "application/octet-stream", contentLength);
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpClientError.js
/**
* Typed failure model for Effect HTTP client operations.
*
* HTTP clients wrap request construction, transport, status-code validation, and
* response decoding failures in `HttpClientError`. The wrapper keeps the failed
* request and the specific failure reason together, so callers can handle client
* failures uniformly while still matching on the reason `_tag` for retry
* policy, logging, metrics, and user-facing messages.
*
* @stability unstable
* @since 4.0.0
*/
var TypeId$4 = "~effect/http/HttpClientError";
/**
* Returns `true` when a value is an `HttpClientError`.
*
* @stability unstable
* @category guards
* @since 4.0.0
*/
var isHttpClientError = (u) => hasProperty(u, TypeId$4);
/**
* Error wrapper for HTTP client failures, exposing the failed request and the optional response through its `reason`.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var HttpClientError = class extends TaggedError$1("HttpClientError") {
	constructor(props) {
		if ("cause" in props.reason) super({
			...props,
			cause: props.reason.cause
		});
		else super(props);
	}
	/**
	* Marks this value as an HTTP client error for runtime guards.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	[TypeId$4] = TypeId$4;
	/**
	* HTTP request associated with the client failure.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get request() {
		return this.reason.request;
	}
	/**
	* HTTP response associated with the client failure, when one was received.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get response() {
		return "response" in this.reason ? this.reason.response : void 0;
	}
	get message() {
		return this.reason.message;
	}
};
var formatReason = (tag) => tag.endsWith("Error") ? tag.slice(0, -5) : tag;
var formatMessage = (reason, description, info) => description ? `${reason}: ${description} (${info})` : `${reason} error (${info})`;
var formatMethodAndUrl = (request) => `${request.method} ${redactUrl(request.url)}`;
var reasonToJSON = (reason, json) => ({
	...json,
	request: {
		_id: "HttpClientRequest",
		method: reason.request.method,
		url: redactUrl(reason.request.url)
	},
	..."response" in reason ? { response: {
		_id: "HttpClientResponse",
		status: reason.response.status
	} } : void 0
});
/**
* Error describing transport-level failures that occur while sending an HTTP request.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var TransportError = class extends TaggedError$1("TransportError") {
	/**
	* Formats the request method and URL for transport error messages.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get methodAndUrl() {
		return formatMethodAndUrl(this.request);
	}
	/**
	* Builds the transport error message from the optional description and request details.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		return formatMessage(formatReason(this._tag), this.description, this.methodAndUrl);
	}
	toJSON() {
		return reasonToJSON(this, super.toJSON());
	}
};
/**
* Error describing failures while encoding an HTTP request body.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var EncodeError = class extends TaggedError$1("EncodeError") {
	/**
	* Formats the request method and URL for request encoding error messages.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get methodAndUrl() {
		return formatMethodAndUrl(this.request);
	}
	/**
	* Builds the request encoding error message from the optional description and request details.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		return formatMessage(formatReason(this._tag), this.description, this.methodAndUrl);
	}
	toJSON() {
		return reasonToJSON(this, super.toJSON());
	}
};
/**
* Error describing failures while constructing a URL from an HTTP client request.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var InvalidUrlError = class extends TaggedError$1("InvalidUrlError") {
	/**
	* Formats the request method and URL for invalid URL error messages.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get methodAndUrl() {
		return formatMethodAndUrl(this.request);
	}
	/**
	* Builds the invalid URL error message from the optional description and request details.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		return formatMessage(formatReason(this._tag), this.description, this.methodAndUrl);
	}
	toJSON() {
		return reasonToJSON(this, super.toJSON());
	}
};
/**
* Response error for HTTP responses rejected because of their status code.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var StatusCodeError = class extends TaggedError$1("StatusCodeError") {
	/**
	* Formats the request method and URL for status code error messages.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get methodAndUrl() {
		return formatMethodAndUrl(this.request);
	}
	/**
	* Builds the status code error message from the response status, optional description, and request details.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		const info = `${this.response.status} ${this.methodAndUrl}`;
		return formatMessage(formatReason(this._tag), this.description, info);
	}
	toJSON() {
		return reasonToJSON(this, super.toJSON());
	}
};
/**
* Response error for failures while decoding an HTTP response, including a
* response with an undeclared status.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var DecodeError = class extends TaggedError$1("DecodeError") {
	/**
	* Formats the request method and URL for response decoding error messages.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get methodAndUrl() {
		return formatMethodAndUrl(this.request);
	}
	/**
	* Builds the response decoding error message from the response status, optional description, and request details.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		const info = `${this.response.status} ${this.methodAndUrl}`;
		return formatMessage(formatReason(this._tag), this.description, info);
	}
	toJSON() {
		return reasonToJSON(this, super.toJSON());
	}
};
/**
* Response error for operations that expected a response body but received an empty body.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var EmptyBodyError = class extends TaggedError$1("EmptyBodyError") {
	/**
	* Formats the request method and URL for empty response body error messages.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get methodAndUrl() {
		return formatMethodAndUrl(this.request);
	}
	/**
	* Builds the empty body error message from the response status, optional description, and request details.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		const info = `${this.response.status} ${this.methodAndUrl}`;
		return formatMessage(formatReason(this._tag), this.description, info);
	}
	toJSON() {
		return reasonToJSON(this, super.toJSON());
	}
};
Error$1(TypeId$4)({
	_tag: /*#__PURE__*/ tag("HttpError"),
	kind: /*#__PURE__*/ Literals([
		"EncodeError",
		"DecodeError",
		"TransportError",
		"InvalidUrlError",
		"StatusCodeError",
		"EmptyBodyError"
	]),
	cause: /*#__PURE__*/ optional(/*#__PURE__*/ Defect())
});
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpMethod.js
/**
* Defines supported HTTP method names for the unstable HTTP modules.
*
* Values are uppercase string literals such as `"GET"` and `"POST"`, matching
* the method tokens used by HTTP requests and routes. This module also includes
* helpers for checking whether a method can carry a request body and whether an
* unknown value is one of the supported methods.
*
* @stability unstable
* @since 4.0.0
*/
function hasBody(method) {
	return method !== "GET" && method !== "HEAD" && method !== "OPTIONS" && method !== "TRACE";
}
/**
* Provides tuples mapping each supported HTTP method to its short
* request-constructor name.
*
* **When to use**
*
* Use when you need the mapping from supported HTTP method literals to their
* short request-constructor names.
*
* @stability unstable
* @category constants
* @since 4.0.0
*/
var allShort = [
	["GET", "get"],
	["POST", "post"],
	["PUT", "put"],
	["DELETE", "del"],
	["PATCH", "patch"],
	["HEAD", "head"],
	["OPTIONS", "options"],
	["TRACE", "trace"],
	["QUERY", "query"]
];
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/internal/httpBody.js
/**
* @internal
*/
var updateHeaders = (headers, body) => {
	if (body._tag === "Empty" || body._tag === "FormData") return remove(remove(headers, "content-type"), "content-length");
	headers = body.contentType === void 0 ? remove(headers, "content-type") : set(headers, "content-type", body.contentType);
	return updateContentLength(headers, body);
};
/**
* @internal
*/
var updateContentLength = (headers, body) => {
	const contentLength = body._tag === "Empty" || body._tag === "FormData" ? void 0 : body.contentLength;
	return contentLength === void 0 ? remove(headers, "content-length") : set(headers, "content-length", contentLength.toString());
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/Url.js
/**
* Error returned when constructing a `URL` fails.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var UrlError = class extends TaggedError$1("UrlError") {};
/**
* Creates a `URL` safely by appending `UrlParams` and an optional hash to a URL string.
*
* **Details**
*
* Returns a `Result` that fails with `UrlError` if the URL cannot be constructed.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$2 = (url, params, hash) => try_({
	try: () => {
		const urlInstance = new URL(url, baseUrl());
		for (let i = 0; i < params.params.length; i++) {
			const [key, value] = params.params[i];
			if (value !== void 0) urlInstance.searchParams.append(key, unwrap(value));
		}
		if (hash !== void 0) urlInstance.hash = hash;
		return urlInstance;
	},
	catch: (cause) => new UrlError({ cause })
});
var baseUrl = () => {
	if ("location" in globalThis && globalThis.location !== void 0 && globalThis.location.origin !== void 0 && globalThis.location.pathname !== void 0) {
		const base = location.origin + location.pathname;
		try {
			return new URL(base).href;
		} catch {
			return;
		}
	}
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpClientRequest.js
var TypeId$3 = "~effect/http/HttpClientRequest";
var Proto$1 = {
	[TypeId$3]: TypeId$3,
	...BaseProto,
	toJSON() {
		return {
			_id: "HttpClientRequest",
			method: this.method,
			url: redactUrl(this.url),
			urlParams: this.urlParams,
			hash: this.hash,
			headers: redact(this.headers),
			body: this.body.toJSON()
		};
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/**
* Constructs an `HttpClientRequest` from fully normalized request components.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
function makeWith$1(method, url, urlParams, hash, headers, body) {
	const self = Object.create(Proto$1);
	self.method = method;
	self.url = url;
	self.urlParams = urlParams;
	self.hash = hash;
	self.headers = headers;
	self.body = body;
	return self;
}
/**
* An empty `GET` request with no URL, query parameters, hash, headers, or body.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var empty = /*#__PURE__*/ makeWith$1("GET", "", empty$2, /*#__PURE__*/ none(), empty$3, empty$1);
/**
* Creates a request constructor for the specified HTTP method.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$1 = (method) => (url, options) => modify(empty, {
	method,
	url,
	...options ?? void 0
});
/**
* Applies request options to an `HttpClientRequest`, returning a new request.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var modify = /*#__PURE__*/ dual(2, (self, options) => {
	let result = self;
	if (options.method) result = setMethod(result, options.method);
	if (options.url) result = setUrl(result, options.url);
	if (options.headers) result = setHeaders(result, options.headers);
	if (options.urlParams) result = setUrlParams(result, options.urlParams);
	if (options.hash) result = setHash(result, options.hash);
	if (options.body) result = setBody(result, options.body);
	if (options.accept) result = accept(result, options.accept);
	if (options.acceptJson) result = acceptJson(result);
	return result;
});
/**
* Sets the HTTP method on a request, returning a new request.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var setMethod = /*#__PURE__*/ dual(2, (self, method) => makeWith$1(method, self.url, self.urlParams, self.hash, self.headers, self.body));
/**
* Sets a single request header, replacing any existing value for that header.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var setHeader = /*#__PURE__*/ dual(3, (self, key, value) => makeWith$1(self.method, self.url, self.urlParams, self.hash, set(self.headers, key, value), self.body));
/**
* Sets multiple request headers from an input collection, replacing existing values with matching names.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var setHeaders = /*#__PURE__*/ dual(2, (self, input) => makeWith$1(self.method, self.url, self.urlParams, self.hash, setAll(self.headers, input), self.body));
/**
* Sets the `Accept` header to the specified media type.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var accept = /*#__PURE__*/ dual(2, (self, mediaType) => setHeader(self, "Accept", mediaType));
/**
* Sets the `Accept` header to `application/json`.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var acceptJson = /*#__PURE__*/ accept("application/json");
/**
* Asks the server to switch the connection to another protocol by setting the
* `Connection: Upgrade` and `Upgrade` headers.
*
* **When to use**
*
* Use to switch an HTTP/1.1 connection to a raw byte stream, such as Docker's
* `Upgrade: tcp` for container attach. For WebSocket, use `Socket.makeWebSocket`.
*
* **Details**
*
* The request is otherwise ordinary, so client transforms such as base URLs,
* authentication, and tracing apply to it. When the server answers `101
* Switching Protocols`, `HttpClientResponse.upgrade` hands over the
* connection as a `Socket`. Any other response is read as usual.
*
* **Example** (Attaching to a Docker container)
*
* ```ts
* import { Effect } from "effect"
* import { HttpClient, HttpClientRequest } from "effect/http"
*
* const program = Effect.gen(function*() {
*   const client = yield* HttpClient.HttpClient
*   const response = yield* client.execute(
*     HttpClientRequest.post("/containers/abc/attach?stream=1&stdout=1").pipe(
*       HttpClientRequest.upgrade("tcp")
*     )
*   )
*   const socket = yield* response.upgrade
*   const reader = yield* socket.reader
*   return yield* reader.pull
* })
* ```
*
* @stability unstable
* @category combinators
* @since 4.0.6
*/
var upgrade = /*#__PURE__*/ dual(2, (self, protocol) => makeWith$1(self.method, self.url, self.urlParams, self.hash, set(set(self.headers, "connection", "Upgrade"), "upgrade", protocol), self.body));
/**
* Sets the request URL. When given a `URL`, its search parameters and hash are extracted into the request's structured fields.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var setUrl = /*#__PURE__*/ dual(2, (self, url) => {
	if (typeof url === "string") return makeWith$1(self.method, url, self.urlParams, self.hash, self.headers, self.body);
	const clone = new URL(url.toString());
	const urlParams = fromInput(clone.searchParams);
	const hash = fromNullishOr(clone.hash === "" ? void 0 : clone.hash.slice(1));
	clone.search = "";
	clone.hash = "";
	return makeWith$1(self.method, clone.toString(), urlParams, hash, self.headers, self.body);
});
/**
* Prepends a URL segment to the request URL, inserting or trimming one slash as needed.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var prependUrl = /*#__PURE__*/ dual(2, (self, path) => {
	if (path === "") return self;
	return makeWith$1(self.method, joinSegments(path, self.url), self.urlParams, self.hash, self.headers, self.body);
});
var joinSegments = (first, second) => {
	const endsWithSlash = first.endsWith("/");
	const startsWithSlash = second.startsWith("/");
	return endsWithSlash && startsWithSlash ? first + second.slice(1) : !endsWithSlash && !startsWithSlash ? first + "/" + second : first + second;
};
/**
* Sets query parameters from an input collection, replacing existing values for matching names.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var setUrlParams = /*#__PURE__*/ dual(2, (self, input) => makeWith$1(self.method, self.url, setAll$1(self.urlParams, input), self.hash, self.headers, self.body));
/**
* Appends query parameters from an input collection without removing existing values for matching names.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var appendUrlParams = /*#__PURE__*/ dual(2, (self, input) => makeWith$1(self.method, self.url, appendAll(self.urlParams, input), self.hash, self.headers, self.body));
/**
* Sets the URL fragment on a request without the leading `#`.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var setHash = /*#__PURE__*/ dual(2, (self, hash) => makeWith$1(self.method, self.url, self.urlParams, some(hash), self.headers, self.body));
/**
* Sets the request body and updates `Content-Type` and `Content-Length` headers from the body metadata when available.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var setBody = /*#__PURE__*/ dual(2, (self, body) => {
	return makeWith$1(self.method, self.url, self.urlParams, self.hash, updateHeaders(self.headers, body), body);
});
/**
* Sets a `FormData` request body.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
var bodyFormData = /*#__PURE__*/ dual(2, (self, body) => setBody(self, formData(body)));
/**
* Builds a `URL` from the request URL, query parameters, and hash, returning `Option.none()` if the URL is invalid.
*
* @stability unstable
* @category combinators
* @since 4.0.0
*/
function toUrl(self) {
	const r = make$2(self.url, self.urlParams, getOrUndefined(self.hash));
	if (isSuccess(r)) return some(r.success);
	return none();
}
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpIncomingMessage.js
/**
* Type identifier for `HttpIncomingMessage` values.
*
* @stability unstable
* @category type IDs
* @since 4.0.0
*/
var TypeId$2 = "~effect/http/HttpIncomingMessage";
/**
* Creates a decoder that reads an incoming message's JSON body and decodes it with the supplied schema.
*
* @stability unstable
* @category schemas
* @since 4.0.0
*/
var schemaBodyJson = (schema, options) => {
	const decode = decodeEffect(toCodecJson(schema));
	const decodeJson = options?.reviver === void 0 ? void 0 : decodeEffect(fromJsonString(toCodecJson(schema), options));
	return (self) => decodeJson === void 0 ? flatMap(self.json, (u) => decode(u, options)) : flatMap(self.text, (body) => body === "" ? flatMap(self.json, (u) => decode(u, options)) : decodeJson(body, options));
};
/**
* Context reference for the optional maximum size allowed when reading an incoming message body.
*
* @stability unstable
* @category references
* @since 4.0.0
*/
var MaxBodySize = /*#__PURE__*/ Reference("effect/http/HttpIncomingMessage/MaxBodySize", { defaultValue: () => void 0 });
/**
* Builds an inspectable object for an incoming message and redacts headers.
* The body is left unread.
*
* @stability unstable
* @category converting
* @since 4.0.0
*/
var inspect = (self, that) => {
	return {
		...that,
		headers: redact(self.headers),
		remoteAddress: self.remoteAddress
	};
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/internal/webResponse.js
/**
* Returns the original Web `Response` of a fetch-backed client response.
* Wrappers forward it to the response they wrap.
*
* @internal
*/
var WebSourceSymbol = "~effect/http/HttpClientResponse/WebSource";
/**
* @internal
*/
var getWebSource = (self) => self[WebSourceSymbol]?.();
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpClientResponse.js
/**
* Represents responses returned by the Effect HTTP client.
*
* An `HttpClientResponse` keeps the original request together with the response
* status, headers, cookies, and body accessors from the shared incoming-message
* model. This module includes constructors, schema-based decoders, helpers for
* streaming response bodies, and utilities for matching or filtering by HTTP
* status.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Type identifier for `HttpClientResponse` values.
*
* @stability unstable
* @category type IDs
* @since 4.0.0
*/
var TypeId$1 = "~effect/http/HttpClientResponse";
/**
* Wraps a Web `Response` and its original `HttpClientRequest` as an `HttpClientResponse`.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var fromWeb = (request, source) => new WebHttpClientResponse(request, source);
/**
* Succeeds with the response only when its status is in the 2xx range, otherwise fails with `HttpClientError`.
*
* @stability unstable
* @category filtering
* @since 4.0.0
*/
var filterStatusOk = (self) => self.status >= 200 && self.status < 300 ? succeed(self) : fail(new HttpClientError({ reason: new StatusCodeError({
	response: self,
	request: self.request,
	description: "non 2xx status code"
}) }));
var WebHttpClientResponse = class extends Class {
	[TypeId$2];
	[TypeId$1];
	request;
	source;
	constructor(request, source) {
		super();
		this.request = request;
		this.source = source;
		this[TypeId$2] = TypeId$2;
		this[TypeId$1] = TypeId$1;
	}
	toJSON() {
		return inspect(this, {
			_id: "HttpClientResponse",
			request: this.request.toJSON(),
			status: this.status
		});
	}
	get status() {
		return this.source.status;
	}
	get url() {
		if (this.source.url) return this.source.url.split("#")[0];
		const url = toUrl(this.request);
		if (isNone(url)) return "";
		url.value.hash = "";
		return url.value.href;
	}
	get headers() {
		return fromInput$1(this.source.headers);
	}
	cachedCookies;
	get cookies() {
		if (this.cachedCookies) return this.cachedCookies;
		return this.cachedCookies = fromSetCookie(this.source.headers.getSetCookie?.() ?? []);
	}
	get remoteAddress() {
		return none();
	}
	[WebSourceSymbol]() {
		return this.source;
	}
	get stream() {
		return this.source.body ? fromReadableStream({
			evaluate: () => this.source.body,
			onError: (cause) => new HttpClientError({ reason: new DecodeError({
				request: this.request,
				response: this,
				cause
			}) })
		}) : fail$2(new HttpClientError({ reason: new EmptyBodyError({
			request: this.request,
			response: this,
			description: "can not create stream from empty body"
		}) }));
	}
	get json() {
		return flatMap(this.text, (text) => try_$1({
			try: () => text === "" ? null : JSON.parse(text),
			catch: (cause) => new HttpClientError({ reason: new DecodeError({
				request: this.request,
				response: this,
				cause
			}) })
		}));
	}
	textBody;
	get text() {
		return this.textBody ??= map(this.arrayBuffer, (_) => new TextDecoder().decode(_));
	}
	get urlParamsBody() {
		return flatMap(this.arrayBuffer, (bytes) => try_$1({
			try: () => fromInput(fromBody(bytes)),
			catch: (cause) => new HttpClientError({ reason: new DecodeError({
				request: this.request,
				response: this,
				cause
			}) })
		}));
	}
	formDataBody;
	get formData() {
		return this.formDataBody ??= tryPromise({
			try: () => this.source.formData(),
			catch: (cause) => new HttpClientError({ reason: new DecodeError({
				request: this.request,
				response: this,
				cause
			}) })
		}).pipe(cached, runSync);
	}
	arrayBufferBody;
	get arrayBuffer() {
		if (this.arrayBufferBody) return this.arrayBufferBody;
		this.arrayBufferBody = tryPromise({
			try: () => this.source.arrayBuffer(),
			catch: (cause) => new HttpClientError({ reason: new DecodeError({
				request: this.request,
				response: this,
				cause
			}) })
		}).pipe(cached, runSync);
		return this.arrayBufferBody;
	}
	get upgrade() {
		return fail(new HttpClientError({ reason: new StatusCodeError({
			request: this.request,
			response: this,
			description: "fetch cannot hand over the connection of an HTTP upgrade"
		}) }));
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpTraceContext.js
/**
* HTTP propagation helpers for Effect tracing context.
*
* This module converts Effect `Tracer.Span` values into outbound trace headers
* and decodes inbound propagation headers into `Tracer.ExternalSpan` parents.
* HTTP clients use it to continue the current span across outgoing requests, and
* server middleware uses it to parent request spans from upstream services.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Encodes a span into HTTP trace propagation headers.
*
* **Details**
*
* The generated headers include both compact B3 (`b3`) and W3C `traceparent`
* formats.
*
* @stability unstable
* @category encoding
* @since 4.0.0
*/
var toHeaders = (span) => fromRecordUnsafe({
	b3: `${span.traceId}-${span.spanId}-${span.sampled ? "1" : "0"}${match(span.parent, {
		onNone: () => "",
		onSome: (parent) => `-${parent.spanId}`
	})}`,
	traceparent: `00-${span.traceId.padStart(32, "0")}-${span.spanId}-${span.sampled ? "01" : "00"}`
});
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/internal/tracing.js
var defaultPorts = {
	"http:": 80,
	"https:": 443,
	"ws:": 80,
	"wss:": 443
};
/**
* Records `url.*` and `server.*` attributes with URL redaction.
*
* @internal
*/
var addUrlAttributes = (span, url, redactedNames) => {
	const query = redactUrl(url.search, redactedNames).slice(1);
	span.attribute("url.full", redactUrl(url.href, redactedNames));
	span.attribute("url.path", url.pathname);
	if (query !== "") span.attribute("url.query", query);
	span.attribute("url.scheme", url.protocol.slice(0, -1));
	if (url.hostname !== "") {
		span.attribute("server.address", url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname);
		const port = url.port === "" ? defaultPorts[url.protocol] : Number(url.port);
		if (port !== void 0) span.attribute("server.port", port);
	}
};
/**
* Adds the names of `Redacted` parameters to the redacted names.
*
* @internal
*/
var redactedNames = (urlParams, redactedNames) => {
	const keys = urlParams.params.filter(([, value]) => typeof value !== "string").map(([key]) => key);
	return keys.length === 0 ? redactedNames : [...redactedNames, ...new URLSearchParams(keys.map((key) => [key, ""])).keys()];
};
/** @internal */
var addHeaderAttributes = (span, phase, headers, filter, redactedNames) => {
	for (const name in headers) {
		if (!filter(name, phase)) continue;
		span.attribute(`http.${phase}.header.${name}`, isRedactedName(name, redactedNames) ? "<redacted>" : headers[name]);
	}
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/HttpClient.js
var TypeId = "~effect/http/HttpClient";
/**
* Service tag for the default outgoing HTTP client service.
*
* **When to use**
*
* Use to provide the default outgoing HTTP client service used by request
* accessors such as `execute`, `get`, and `post`.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var HttpClient = /*#__PURE__*/ Service("effect/HttpClient");
/**
* Transforms a client by applying an effectful transformation to each response effect.
*
* @stability unstable
* @category mapping
* @since 4.0.0
*/
var transformResponse = /*#__PURE__*/ dual(2, (self, f) => makeWith((request) => f(self.postprocess(request)), self.preprocess));
/**
* Constructs an `HttpClient.With` from a preprocessing function and a postprocessing function.
*
* **Details**
*
* `execute` applies preprocessing to the request and then passes the resulting request effect to postprocessing.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var makeWith = (postprocess, preprocess) => {
	const self = Object.create(Proto);
	self.preprocess = preprocess;
	self.postprocess = postprocess;
	self.execute = function(request) {
		return postprocess(preprocess(request));
	};
	return self;
};
var Proto = {
	[TypeId]: TypeId,
	pipe() {
		return pipeArguments(this, arguments);
	},
	...BaseProto,
	toJSON() {
		return { _id: "effect/HttpClient" };
	},
	.../*#__PURE__*/ Object.fromEntries(/*#__PURE__*/ allShort.map(([fullMethod, method]) => [method, function(url, options) {
		return this.execute(make$1(fullMethod)(url, options));
	}]))
};
/**
* Constructs an `HttpClient` from a low-level request runner.
*
* **Details**
*
* The runner receives the request, resolved URL, abort signal, and current fiber. The client wrapper handles URL construction failures, tracing and propagation, header redaction, and aborting non-scoped requests on interruption.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make = (f) => makeWith((effect) => flatMap(effect, (request) => withFiber((fiber) => {
	const scopedController = scopedRequests.get(request);
	const controller = scopedController ?? new AbortController();
	const urlResult = make$2(request.url, request.urlParams, getOrUndefined(request.hash));
	if (isFailure(urlResult)) return fail(new HttpClientError({ reason: new InvalidUrlError({
		request,
		cause: urlResult.failure
	}) }));
	const url = urlResult.success;
	if (fiber.getRef(DisablePropagation) || fiber.getRef(TracerDisabledWhen)(request)) {
		const effect = f(request, url, controller.signal, fiber);
		if (scopedController) return map(effect, (response) => trackResponse(response, controller, true));
		return uninterruptibleMask((restore) => matchCauseEffect(restore(effect), {
			onSuccess(response) {
				return succeed(trackResponse(response, controller, false));
			},
			onFailure(cause) {
				if (hasInterrupts(cause)) controller.abort();
				return failCause(cause);
			}
		}));
	}
	return useSpan(fiber.getRef(SpanNameGenerator)(request), { kind: "client" }, (span) => {
		span.attribute("http.request.method", request.method);
		const redactedHeaderNames = fiber.getRef(CurrentRedactedNames);
		addUrlAttributes(span, url, redactedNames(request.urlParams, fiber.getRef(CurrentRedactedNames$1)));
		const headerFilter = fiber.getRef(TracerHeaderFilter);
		addHeaderAttributes(span, "request", request.headers, headerFilter, redactedHeaderNames);
		request = fiber.getRef(TracerPropagationEnabled) ? setHeaders(request, toHeaders(span)) : request;
		return uninterruptibleMask((restore) => restore(f(request, url, controller.signal, fiber)).pipe(withParentSpan(span, { captureStackTrace: false }), matchCauseEffect({
			onSuccess: (response) => {
				span.attribute("http.response.status_code", response.status);
				addHeaderAttributes(span, "response", response.headers, headerFilter, redactedHeaderNames);
				if (response.status >= 400 && response.status < 600) {
					span.attribute("error.type", String(response.status));
					endSpanWithStatusError(fiber, span, request, response);
				}
				return succeed(trackResponse(response, controller, scopedController !== void 0));
			},
			onFailure(cause) {
				if (!scopedController && hasInterrupts(cause)) controller.abort();
				return failCause(cause);
			}
		})));
	});
})), succeed);
var endSpanWithStatusError = (fiber, span, request, response) => {
	const stackTraceLimit = getStackTraceLimit();
	setStackTraceLimit(0);
	let exit;
	try {
		exit = fail$1(new HttpClientError({ reason: new StatusCodeError({
			request,
			response
		}) }));
	} finally {
		setStackTraceLimit(stackTraceLimit);
	}
	span.end(fiber.getRef(TracerTimingEnabled) ? fiber.getRef(Clock).currentTimeNanosUnsafe() : BigInt(0), exit);
};
/**
* Appends a transformation of the request object before sending it.
*
* @stability unstable
* @category mapping
* @since 4.0.0
*/
var mapRequest = /*#__PURE__*/ dual(2, (self, f) => makeWith(self.postprocess, (request) => map(self.preprocess(request), f)));
/**
* Appends an effectful transformation of the request object before sending it.
*
* @stability unstable
* @category mapping
* @since 4.0.0
*/
var mapRequestEffect = /*#__PURE__*/ dual(2, (self, f) => makeWith(self.postprocess, (request) => flatMap(self.preprocess(request), f)));
/**
* Context reference for a predicate that disables client-side tracing for matching outgoing requests.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var TracerDisabledWhen = /*#__PURE__*/ Reference("effect/http/HttpClient/TracerDisabledWhen", { defaultValue: () => constFalse });
/**
* Context reference for filtering request and response headers added to client spans.
*
* **Details**
*
* Header capture is opt-in: the default filter records no headers. Captured
* headers listed in `Headers.CurrentRedactedNames` are recorded as `<redacted>`.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var TracerHeaderFilter = /*#__PURE__*/ Reference("effect/http/HttpClient/TracerHeaderFilter", { defaultValue: () => constFalse });
/**
* Context reference that controls whether outgoing client spans are propagated to request headers.
*
* **Details**
*
* When this is `true`, the client writes the compact B3 `b3` header and the
* W3C `traceparent` header. The default is on. The client span is still
* created when this is `false`.
*
* **Gotchas**
*
* A browser preflight fails when the target does not list `b3` and
* `traceparent` in `Access-Control-Allow-Headers`. Set this to `false` for
* those requests.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var TracerPropagationEnabled = /*#__PURE__*/ Reference("effect/http/HttpClient/TracerPropagationEnabled", { defaultValue: constTrue });
/**
* Context reference for generating the span name used for outgoing client request spans.
*
* **Details**
*
* Defaults to the request method unchanged.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var SpanNameGenerator = /*#__PURE__*/ Reference("effect/http/HttpClient/SpanNameGenerator", { defaultValue: () => (request) => request.method });
/**
* Creates an `HttpClient` layer and merges the layer construction context into client response effects.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layerMergedContext = (effect$1) => effect(HttpClient)(contextWith((context) => map(effect$1, (client) => transformResponse(client, updateContext((input) => merge(context, input))))));
var responseRegistry = /*#__PURE__*/ (() => {
	if ("FinalizationRegistry" in globalThis && globalThis.FinalizationRegistry) {
		const registry = /*#__PURE__*/ new FinalizationRegistry((controller) => {
			try {
				controller.abort();
			} catch {}
		});
		return {
			register(response, controller) {
				registry.register(response, controller, response);
			},
			unregister(response) {
				registry.unregister(response);
			}
		};
	}
	const timers = /*#__PURE__*/ new WeakMap();
	return {
		register(response, controller) {
			timers.set(response, setTimeout(() => controller.abort(), 5e3));
		},
		unregister(response) {
			const timer = timers.get(response);
			if (timer === void 0) return;
			clearTimeout(timer);
			timers.delete(response);
		}
	};
})();
var scopedRequests = /*#__PURE__*/ new WeakMap();
var responseControllers = /*#__PURE__*/ new WeakMap();
var trackResponse = (response, controller, scoped) => {
	if (!scoped) {
		responseRegistry.register(response, controller);
		response = new InterruptibleResponse(response, controller);
	}
	responseControllers.set(response, controller);
	return response;
};
var InterruptibleResponse = class {
	original;
	controller;
	constructor(original, controller) {
		this.original = original;
		this.controller = controller;
	}
	[TypeId$1] = TypeId$1;
	[TypeId$2] = TypeId$2;
	applyInterrupt(effect) {
		return suspend(() => {
			responseRegistry.unregister(this.original);
			return onInterrupt(effect, () => sync(() => {
				this.controller.abort();
			}));
		});
	}
	get request() {
		return this.original.request;
	}
	get url() {
		return this.original.url;
	}
	get status() {
		return this.original.status;
	}
	get headers() {
		return this.original.headers;
	}
	get cookies() {
		return this.original.cookies;
	}
	get remoteAddress() {
		return this.original.remoteAddress;
	}
	get formData() {
		return this.applyInterrupt(this.original.formData);
	}
	get text() {
		return this.applyInterrupt(this.original.text);
	}
	get json() {
		return this.applyInterrupt(this.original.json);
	}
	get urlParamsBody() {
		return this.applyInterrupt(this.original.urlParamsBody);
	}
	get arrayBuffer() {
		return this.applyInterrupt(this.original.arrayBuffer);
	}
	get upgrade() {
		return this.applyInterrupt(this.original.upgrade);
	}
	[WebSourceSymbol]() {
		const source = getWebSource(this.original);
		if (source !== void 0) responseRegistry.unregister(this.original);
		return source;
	}
	get stream() {
		return suspend$1(() => {
			responseRegistry.unregister(this.original);
			return ensuring(this.original.stream, sync(() => {
				this.controller.abort();
			}));
		});
	}
	toJSON() {
		return this.original.toJSON();
	}
	[NodeInspectSymbol]() {
		return this.original[NodeInspectSymbol]();
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
//#endregion
export { empty$1 as A, SocketReadError as B, hasBody as C, StatusCodeError as D, HttpClientError as E, uint8Array as F, make$3 as G, SocketWriteError as H, urlParams as I, readerBytes as K, SocketCloseError as L, jsonUnsafe as M, stream as N, TransportError as O, text as P, SocketError as R, upgrade as S, EncodeError as T, isCloseEvent as U, SocketUpgradeError as V, isSocket as W, prependUrl as _, mapRequestEffect as a, setUrl as b, fromWeb as c, inspect as d, schemaBodyJson as f, make$1 as g, empty as h, mapRequest as i, isHttpBody as j, isHttpClientError as k, MaxBodySize as l, bodyFormData as m, layerMergedContext as n, TypeId$1 as o, appendUrlParams as p, make as r, filterStatusOk as s, HttpClient as t, TypeId$2 as u, setBody as v, DecodeError as w, toUrl as x, setHeaders as y, SocketOpenError as z };
