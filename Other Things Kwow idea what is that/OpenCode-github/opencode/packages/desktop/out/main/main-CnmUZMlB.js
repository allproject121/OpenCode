import { $o as addFinalizer, $u as isDoneUnsafe, Ac as runForkWith, Ag as isNotNull, Am as getOrThrow, As as flatMap, Au as addFinalizer$1, Bg as isUndefined, Bs as forkScoped, Bt as decodeUnknownOption, Cc as raceFirst, Fd as hasInterruptsOnly, Fs as forEach, Gc as sleep, Gd as squash, Gl as spaced, Gm as add, Gs as interrupt, Gu as _await, Hs as gen, I as Literals, Iu as make$6, Ju as fail$2, Kc as succeed, Lg as isString, Lh as Prototype, Lm as succeed$1, Lp as TaggedError, M as Int, Mu as close$1, Ng as isNullish, Ns as fn, Om as fail$1, Ou as Scope, Ps as fnUntraced, Pu as fork, Qu as isDone, Rn as isPattern, Rt as decodeUnknownEffect, Ru as provide, Sr as unixPathAddress, Ss as ensuring, Su as mergeAll, Tu as succeed$3, U as NullOr, Um as Reference, Us as ignore, Vc as scoped, Vs as fromResult, W as Number$1, Wm as Service, Ws as ignoreCause, Xc as sync, Xt as fromJsonString, Yc as suspend, Ym as getOrUndefined, Ys as logError, Zm as getUnsafe, Zo as acquireRelease, Zp as toMillis, _s as context, _u as effect, ar as optional, as as asVoid, at as String$1, ba as make$5, bc as provideService, cs as callback, da as fromInput, dl as void_, du as currentTimeMillis, e_ as pipe, ed as make$7, el as timeout, es as all, gc as orElseSucceed, gd as void_$1, ha as remove, hc as orDie, hd as succeed$2, hh as match, hs as catch_, jg as isNotUndefined, l as Boolean$1, lc as never, ls as catchCause, ma as merge, nd as succeed$4, ng as BaseProto, nh as omit, nl as tryPromise, o as ArraySchema, od as fail$3, ot as Struct, pc as onInterrupt, ph as isSome, pn as isGreaterThan, qu as doneUnsafe, rc as mapError, rl as try_, rs as as, sh as fromUndefinedOr, sl as uninterruptible, tc as map, td as makeUnsafe, ts as andThen, uc as onError, ut as TaggedError$1, wc as repeat, ws as fail, wu as provideMerge, xa as value, xr as inetAddressFromIpString, ya as isRedacted, zg as isTagged, zs as forkIn } from "./Latch-oSncnOpo.js";
import { $ as mapEffect, $t as take, At as badArgument, C as Path, Ct as get, Dt as isSink, F as drainFork, G as fromPubSub, Ht as make$13, I as empty, J as interruptWhen, Kt as make$9, L as ensuring$1, Lt as publish, N as decodeText, Qt as sliding, R as fail$4, Rt as shutdown, St as unwrap$2, T as FileSystem, Tt as drain, Vt as nominal, Wt as endUnsafe, X as make$12, Xt as poll, Y as isStream, Yt as offerUnsafe, a as Stdio, an as runIn, bt as transduce, ct as runCollect, d as update, dt as runForEach, gt as tapError, h as make$15, ht as suspend$1, i as make$11, in as join, jt as systemError, kt as PlatformError, l as get$1, lt as runDrain, n as QuitError, nt as mkArrayBuffer, o as make$8, pt as splitLines, r as Terminal, rn as interrupt$1, rt as mkString, st as run, tt as merge$1, u as make$14, ut as runFold, vt as toReadableStreamEffect, wt as make$10, zt as unbounded } from "./dist-DWveHAM-.js";
import { E as HttpClientError, K as readerBytes, L as SocketCloseError, O as TransportError, R as SocketError, T as EncodeError, c as fromWeb, f as schemaBodyJson, n as layerMergedContext, r as make$16, s as filterStatusOk, t as HttpClient, z as SocketOpenError } from "./HttpClient-CNGYnc6V.js";
import { n as fromDuplex, t as NetSocket } from "./NodeSocket-CF13L4WJ.js";
import { r as fromWritable, t as fromReadable } from "./NodeStream-BV2blk9q.js";
import { C as layer$8, T as handleErrnoException, w as layer$7 } from "./desktop-BSCRb8al.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import { i as builtinMainContext } from "./host-DQiQeSJn.js";
import { randomUUID } from "node:crypto";
import * as Net from "node:net";
import { PassThrough } from "node:stream";
import * as NodeChildProcess from "node:child_process";
import * as readline from "node:readline";
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/http/FetchHttpClient.js
/**
* Fetch-based implementation of the Effect HTTP client service.
*
* This module provides an `HttpClient` layer that executes requests through a
* Web Fetch API implementation. It is the transport to use in browsers, edge
* runtimes, and Node.js environments where `globalThis.fetch` is available, or
* anywhere a compatible fetch function can be supplied.
*
* Requests with an `Upgrade` header fail with `TransportError` before anything
* is sent because fetch cannot hand over the connection.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Context reference for the `fetch` implementation used by the fetch-based HTTP client.
*
* **Details**
*
* Defaults to `globalThis.fetch`.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var Fetch = /*#__PURE__*/ Reference("effect/http/FetchHttpClient/Fetch", { defaultValue: () => globalThis.fetch });
/**
* Context reference controlling stream bodies when the runtime does not support streaming requests.
*
* **Details**
*
* Defaults to `"error"`, which fails with an `EncodeError` without sending the
* request. Set to `"buffer"` to collect the entire stream in memory and send it
* as a single body instead. Runtimes with streaming support always send the stream.
*
* **Gotchas**
*
* Buffering keeps the entire upload in memory and can exhaust memory for large
* or unbounded uploads. Support is detected once, on the first stream body sent,
* using the global `Request` implementation even when a custom `Fetch` is provided.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var StreamBodyFallback = /*#__PURE__*/ Reference("effect/http/FetchHttpClient/StreamBodyFallback", { defaultValue: () => "error" });
/**
* Service that contains default fetch options for the fetch-based HTTP client.
*
* **When to use**
*
* Use to provide default credentials, cache, redirect, integrity, or other
* fetch options for outgoing HTTP requests.
*
* **Details**
*
* Request-specific method, headers, body, and abort signal are supplied by the client when a request is executed.
*
* @see {@link HttpClient.followRedirects} for following redirects in the client, which needs `{ redirect: "manual" }` here
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var RequestInit = class extends Service()("effect/http/FetchHttpClient/RequestInit") {};
var supportsStreamBody;
var detectStreamBodySupport = () => {
	try {
		let duplexAccessed = false;
		const body = new ReadableStream();
		const request = new Request("https://example.com", {
			method: "POST",
			body,
			get duplex() {
				duplexAccessed = true;
				return "half";
			}
		});
		return (duplexAccessed || request.body === body) && !request.headers.has("Content-Type");
	} catch {
		return false;
	}
};
/**
* Layer that provides an `HttpClient` implementation backed by the configured
* `Fetch` function.
*
* **When to use**
*
* Use when an Effect program should execute `HttpClient` requests through the
* platform `fetch` implementation, especially in browser, edge, or Node.js
* runtimes with `globalThis.fetch`.
*
* **Details**
*
* The layer uses the current `Fetch` reference and optional `RequestInit`
* service for each request. Request-specific method, headers, body, and abort
* signal are supplied by the client and override matching `RequestInit` fields.
*
* **Gotchas**
*
* Fetch behavior comes from the runtime's implementation, so CORS, cookies,
* redirects, abort handling, and streaming support can vary by platform.
* `fetch` follows redirects itself by default, so `HttpClient.followRedirects`
* has no effect unless `RequestInit` sets `redirect: "manual"`. Trace
* propagation is on by default, and a browser preflight fails unless the
* target allows `b3` and `traceparent`. Stream request bodies are sent as Web
* streams with `duplex: "half"` when the runtime supports it; see
* `StreamBodyFallback` for the unsupported case. Any `content-length` header is
* removed before calling `fetch`. Chrome passes the support check but rejects
* streaming uploads over HTTP/1.1, which surfaces as a `TransportError`, and
* browsers only deliver the response after the entire request body has been sent.
*
* @see {@link Fetch} for supplying the fetch implementation used by this layer
* @see {@link RequestInit} for default `RequestInit` options applied before request-specific fields
* @see {@link StreamBodyFallback} for opting into buffering on unsupported runtimes
* @see {@link HttpClient.TracerPropagationEnabled} for leaving `b3` and `traceparent` off a browser request
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer$6 = /*#__PURE__*/ layerMergedContext(/*#__PURE__*/ succeed(/* @__PURE__ */ make$16((request, url, signal, fiber) => {
	if (request.headers.upgrade !== void 0) return fail(new HttpClientError({ reason: new TransportError({
		request,
		description: "fetch cannot send an HTTP upgrade request"
	}) }));
	const fetch = fiber.getRef(Fetch);
	const options = getOrUndefined(fiber.context, RequestInit) ?? {};
	let headers = options.headers ? merge(fromInput(options.headers), request.headers) : request.headers;
	if (headers["content-length"]) headers = remove(headers, "content-length");
	let uploadController;
	const stopUpload = sync(() => uploadController?.abort());
	const send = (body) => map(tryPromise({
		try: () => fetch(url, {
			...options,
			method: request.method,
			headers,
			body,
			duplex: typeof ReadableStream !== "undefined" && body instanceof ReadableStream ? "half" : void 0,
			signal: uploadController ? AbortSignal.any([signal, uploadController.signal]) : signal
		}),
		catch: (cause) => new HttpClientError({ reason: new TransportError({
			request,
			cause
		}) })
	}), (response) => {
		const original = fromWeb(request, response);
		if (!uploadController) return original;
		if (response.body === null) uploadController.abort();
		return Object.create(original, {
			...Object.fromEntries([
				"arrayBuffer",
				"text",
				"json",
				"formData",
				"urlParamsBody"
			].map((key) => [key, { get: () => ensuring(original[key], stopUpload) }])),
			stream: { get: () => ensuring$1(original.stream, stopUpload) }
		});
	}).pipe(onError(() => stopUpload));
	switch (request.body._tag) {
		case "Raw":
		case "Uint8Array": return send(request.body.body);
		case "FormData": return send(request.body.formData);
		case "Stream":
			supportsStreamBody ??= detectStreamBodySupport();
			if (supportsStreamBody) {
				uploadController = new AbortController();
				const uploadSignal = AbortSignal.any([signal, uploadController.signal]);
				const stopped = callback((resume) => {
					const onAbort = () => resume(interrupt);
					if (uploadSignal.aborted) {
						onAbort();
						return;
					}
					uploadSignal.addEventListener("abort", onAbort, { once: true });
					return sync(() => uploadSignal.removeEventListener("abort", onAbort));
				});
				return flatMap(toReadableStreamEffect(interruptWhen(request.body.stream, stopped)), send);
			}
			if (fiber.getRef(StreamBodyFallback) === "error") return fail(new HttpClientError({ reason: new EncodeError({
				request,
				description: "Streaming request bodies are not supported in this runtime"
			}) }));
			return mkArrayBuffer(request.body.stream).pipe(mapError((cause) => new HttpClientError({ reason: new EncodeError({
				request,
				cause
			}) })), flatMap(send));
	}
	return send(void 0);
})));
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/process/ChildProcessSpawner.js
/**
* Service boundary for starting and controlling child processes.
*
* `ChildProcessSpawner` is the service used by `ChildProcess` commands to start
* operating-system processes. A spawner turns a command description into a
* handle that can write to stdin, read stdout and stderr, wait for exit, kill
* the process, and manage whether the process keeps its parent alive. Platform
* backends implement this service, while most application code uses the higher
* level `ChildProcess` module.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Constructs branded child process `ExitCode` values.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var ExitCode = /*#__PURE__*/ nominal();
/**
* Constructs branded child process `ProcessId` values.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var ProcessId = /*#__PURE__*/ nominal();
var HandleTypeId = "~effect/process/ChildProcessSpawner/ChildProcessHandle";
var HandleProto = {
	[HandleTypeId]: HandleTypeId,
	...BaseProto,
	toJSON() {
		return {
			_id: "ChildProcessHandle",
			pid: this.pid
		};
	}
};
/**
* Constructs a new `ChildProcessHandle`.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var makeHandle = (params) => Object.setPrototypeOf({ ...params }, HandleProto);
/**
* Creates a `ChildProcessSpawner` service from a `spawn` function, deriving
* helpers for exit codes and output collection from that implementation.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$4 = (spawn) => {
	const streamString = (command, options) => spawn(command).pipe(map((handle) => decodeText(options?.includeStderr === true ? handle.all : drainFork(handle.stdout, handle.stderr))), unwrap$2);
	const streamLines = (command, options) => splitLines(streamString(command, options));
	return ChildProcessSpawner.of({
		spawn,
		exitCode: (command) => scoped(flatMap(spawn(command), (handle) => raceFirst(handle.exitCode, andThen(runDrain(handle.all), never)))),
		streamString,
		streamLines,
		lines: (command, options) => runCollect(streamLines(command, options)),
		string: (command, options) => mkString(streamString(command, options))
	});
};
/**
* Service tag for child process spawning.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var ChildProcessSpawner = class extends Service()("effect/process/ChildProcessSpawner") {};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/process/CommandLine.js
/**
* Builds command lines, the single strings that a shell or a Windows program
* turns back into arguments, and argument lists from templates. It is
* unrelated to `effect/cli`, which parses the arguments of your own program.
*
* The rules depend on what parses the string, not on the platform that builds
* it, so `quote`, `join` and `display` take an explicit `format`:
*
* - `"posix"` (the default) for `sh`, `dash`, `bash` and `zsh`. Quoted output
*   is also read the same way by `fish`.
* - `"powershell"` for PowerShell 7.3 or later.
* - `"windows"` for the Microsoft C runtime rules that most Windows programs
*   use to split their command line.
*
* SSH sends one command line to the login shell of the remote account, so the
* format must match that shell. The remote shell must be a POSIX shell or
* PowerShell: Windows OpenSSH uses `cmd.exe` by default, which no format
* supports, so set its `DefaultShell` to PowerShell. Docker and Kubernetes exec
* take argument lists and need no command line at all.
*
* Arguments can be `Redacted` strings. `quote` and `join` include their values,
* because their output is meant to run, while `display` replaces them with
* `<redacted>`.
*
* @stability unstable
* @since 4.0.7
*/
/**
* Error returned when a command line or a template cannot be built.
*
* **Details**
*
* - `NulCharacter`: an argument passed to {@link quote} or {@link join}
*   contains a NUL character, which no command line can carry.
* - `InvalidArgument`: the format cannot carry an argument: a Windows program
*   name with a double quote, or the argument `--%`, which PowerShell drops
*   when it calls a native program.
* - `InvalidEscape`: template text ends with a backslash that escapes nothing,
*   or contains an invalid JavaScript escape sequence.
* - `UnterminatedQuote`: a quoted section of a template is not closed.
* - `UnsupportedSyntax`: template text contains shell syntax that cannot work
*   without a shell, such as operators, expansions, globs, comments or
*   variable assignments, or an interpolated array is not a separate argument.
*
* Messages never include the input, which may contain secrets.
*
* @stability unstable
* @category errors
* @since 4.0.7
*/
var CommandLineError = class extends TaggedError("CommandLineError") {};
/**
* Renders a command for logs and error messages.
*
* **When to use**
*
* Use when you show a command to a person, for example in an error message,
* and secrets and control characters must not reach the output.
*
* **Details**
*
* - Quotes like {@link join}, so commands without control characters or
*   secrets can be copied into a terminal of the given format.
* - Replaces `Redacted` arguments with `<redacted>`.
* - Writes control characters and Unicode line separators as escapes such as
*   `\n` or `\u001b`, so output cannot move the cursor or inject terminal
*   sequences.
* - Never fails: input that {@link join} rejects is rendered anyway.
*
* **Gotchas**
*
* The output is for reading only. It is not a reliable command line: escapes
* and `<redacted>` change what a shell would run.
*
* **Example** (Showing a command with a secret)
*
* ```ts import.meta.vitest
* import { Redacted } from "effect"
* import { CommandLine } from "effect/process"
*
* const token = Redacted.make("hunter2")
*
* CommandLine.display(["curl", "-H", token, "https://x.dev/a b"]) // => "curl -H <redacted> 'https://x.dev/a b'"
* ```
*
* @see {@link join} for building a command line to run
*
* @stability unstable
* @category encoding
* @since 4.0.7
*/
var display = (words, options) => {
	if (words.length === 0) return "";
	const format = options?.format ?? "posix";
	return joinWords(format, words.map((word, i) => isRedacted(word) ? "<redacted>" : escapeControlCharacters(quoteWord(format, word, i === 0))));
};
/**
* Builds an argument list from a template literal.
*
* **When to use**
*
* Use to write a command as it would look in a shell while keeping every
* interpolated value a literal argument.
*
* **Details**
*
* - The template text is split into words as a POSIX shell does: spaces,
*   tabs and line breaks separate words, and quotes and backslash escapes are
*   removed. A long command can span several lines.
* - Text that would need a shell fails with `UnsupportedSyntax`: operators
*   (`| & ; < > ( )`), expansions (`$NAME`, `${...}`, `$(...)`, backticks, a
*   leading `~`, braces such as `{a,b}`, and a leading `=` that `zsh`
*   expands), globs (`* ? [`), comments (`#` at the start of a word), and a
*   variable assignment in the program position. Quote such characters to
*   pass them literally.
* - No shell runs, so a program such as `if` or `time` names an executable.
* - Each `${}` value is inserted literally, without splitting or quote
*   processing. Next to other text or inside quotes, it becomes part of the
*   surrounding argument.
* - An array adds one argument per element and must stand alone as a whole
*   argument.
* - Numbers and booleans are converted with `String`.
* - An argument that contains a `Redacted` value becomes `Redacted` as a
*   whole.
*
* **Gotchas**
*
* - An invalid JavaScript escape sequence in the text, such as `\u` without
*   hex digits, fails with `InvalidEscape`. Use `String.raw` or a `${}` value
*   for backslashes.
* - Neither the text nor the values are checked for NUL characters.
*   {@link join} and the child process spawners reject them where they would
*   truncate an argument.
*
* **Example** (Building arguments with interpolated values)
*
* ```ts import.meta.vitest
* import { Redacted, Result } from "effect"
* import { CommandLine } from "effect/process"
*
* const msg = "fix: handle $HOME"
* const files = ["a.ts", "b.ts"]
*
* CommandLine.template`git commit -m ${msg} ${files}` // => Result.succeed(["git", "commit", "-m", msg, ...files])
*
* const password = Redacted.make("hunter2")
* const words = Result.getOrThrow(CommandLine.template`psql "--password=${password}"`)
*
* CommandLine.display(words) // => "psql <redacted>"
* ```
*
* @stability unstable
* @category constructors
* @since 4.0.7
*/
var template = (strings, ...expressions) => {
	const index = strings.findIndex((text) => text === void 0);
	if (index !== -1) return fail$1(new CommandLineError({
		reason: "InvalidEscape",
		message: `Template part ${index} contains an invalid escape sequence`
	}));
	return parseTemplate$1(strings, expressions);
};
var unwrap$1 = (item) => isRedacted(item) ? value(item) : String(item);
var toWord = (item) => isRedacted(item) ? item : String(item);
var reservedWords = /*#__PURE__*/ new Set([
	"!",
	"{",
	"}",
	"and",
	"begin",
	"case",
	"coproc",
	"do",
	"done",
	"elif",
	"else",
	"end",
	"esac",
	"fi",
	"for",
	"foreach",
	"function",
	"if",
	"in",
	"nocorrect",
	"not",
	"or",
	"repeat",
	"select",
	"switch",
	"then",
	"time",
	"until",
	"while"
]);
var quoteWord = (format, value, program) => {
	switch (format) {
		case "posix": return program && reservedWords.has(value) ? `'${value}'` : quotePosix(value);
		case "powershell": return quotePowerShell(value);
		case "windows": return program && !value.includes("\"") ? quoteWindowsProgram(value) : quoteWindowsArgument(value);
	}
};
var joinWords = (format, quoted) => format === "powershell" ? `& ${quoted.join(" ")}` : quoted.join(" ");
var posixSafe = /^[A-Za-z0-9_@+:,./-]+$/;
var quotePosix = (value) => posixSafe.test(value) ? value : `'${value.replace(/['\\]/g, (char) => `'\\${char}'`)}'`;
var quotePowerShell = (value) => `'${value.replace(/['\u2018\u2019\u201A\u201B]/g, "$&$&")}'`;
var windowsNeedsQuotes = /[ \t\n\v"]/;
var quoteWindowsArgument = (value) => {
	if (value.length > 0 && !windowsNeedsQuotes.test(value)) return value;
	let out = "\"";
	let backslashes = 0;
	for (const char of value) if (char === "\\") backslashes++;
	else if (char === "\"") {
		out += "\\".repeat(backslashes * 2 + 1) + "\"";
		backslashes = 0;
	} else {
		out += "\\".repeat(backslashes) + char;
		backslashes = 0;
	}
	return out + "\\".repeat(backslashes * 2) + "\"";
};
var quoteWindowsProgram = (value) => value.length > 0 && !/[ \t]/.test(value) ? value : `"${value}"`;
var controlCharacters = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;
var controlEscapes = {
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
};
var escapeControlCharacters = (value) => value.replace(controlCharacters, (char) => controlEscapes[char] ?? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
var operators = "|&;<>()";
var globs = "*?[";
var expansionStart = /[A-Za-z_0-9{(@*#?$!'"-]/;
var quotedExpansionStart = /[A-Za-z_0-9{(@*#?$!-]/;
var assignmentName = /^[A-Za-z_][A-Za-z0-9_]*\+?$/;
var isBlank = (char) => char === " " || char === "	" || char === "\n";
var unsupportedSyntax = (char, next, wordStart) => {
	if (operators.includes(char)) return `The operator "${char}" needs a shell`;
	if (char === "`") return "Command substitution needs a shell";
	if (char === "$" && next !== void 0 && expansionStart.test(next)) return `The expansion "$${next}" needs a shell`;
	if (globs.includes(char)) return `The glob character "${char}" needs a shell`;
	if (!wordStart) return void 0;
	if (char === "#") return "A comment needs a shell";
	if (char === "~") return "Tilde expansion needs a shell";
	if (char === "=" && next !== void 0 && !isBlank(next)) return "A leading \"=\" is expanded by zsh";
};
var parseTemplate$1 = (texts, values) => {
	const words = [];
	let word = [];
	let plain = true;
	let braceDepth = 0;
	let quote = void 0;
	let quotePart = 0;
	let part = 0;
	const error = (reason, message, at = part) => fail$1(new CommandLineError({
		reason,
		message: `${message} in template part ${at}`
	}));
	const endWord = () => {
		if (word.length === 0) return;
		const value = word.map(unwrap$1).join("");
		words.push(word.length === 1 && isRedacted(word[0]) ? word[0] : word.some(isRedacted) ? make$5(value) : value);
		word = [];
		plain = true;
		braceDepth = 0;
	};
	const scan = (text) => {
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const next = text[i + 1];
			if (quote === "'") {
				if (char === "'") quote = void 0;
				else word.push(char);
			} else if (quote === "\"") {
				if (char === "\"") quote = void 0;
				else if (char === "\\" && next !== void 0 && "$`\"\\\n".includes(next)) {
					if (next !== "\n") word.push(next);
					i++;
				} else if (char === "`") return error("UnsupportedSyntax", "Command substitution needs a shell");
				else if (char === "$" && next !== void 0 && quotedExpansionStart.test(next)) return error("UnsupportedSyntax", `The expansion "$${next}" needs a shell`);
				else word.push(char);
			} else if (isBlank(char)) endWord();
			else if (char === "\\") {
				if (next === void 0) return error("InvalidEscape", "A trailing backslash escapes nothing");
				if (next !== "\n") {
					word.push(next);
					plain = false;
				}
				i++;
			} else if (char === "'" || char === "\"") {
				quote = char;
				quotePart = part;
				word.push("");
				plain = false;
			} else {
				const unsupported = unsupportedSyntax(char, next, word.length === 0);
				if (unsupported !== void 0) return error("UnsupportedSyntax", unsupported);
				if (char === "{") braceDepth++;
				else if (char === "}") {
					if (braceDepth > 0) braceDepth--;
				} else if (braceDepth > 0 && (char === "," || char === "." && next === ".")) return error("UnsupportedSyntax", "Brace expansion needs a shell");
				else if (char === "=" && words.length === 0 && plain && assignmentName.test(word.join(""))) return error("UnsupportedSyntax", "A variable assignment needs a shell");
				word.push(char);
			}
		}
	};
	for (; part < texts.length; part++) {
		const failure = scan(texts[part]);
		if (failure !== void 0) return failure;
		if (part === values.length) break;
		const expression = values[part];
		if (Array.isArray(expression)) {
			const after = texts[part + 1][0];
			if (word.length > 0 || (after === void 0 ? part + 1 < values.length : !isBlank(after))) return error("UnsupportedSyntax", "An interpolated array must be a separate argument");
			for (const item of expression) words.push(toWord(item));
		} else {
			word.push(toWord(expression));
			plain = false;
		}
	}
	if (quote !== void 0) return error("UnterminatedQuote", "The quote is not closed", quotePart);
	endWord();
	return succeed$1(words);
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/process/ChildProcess.js
/**
* Describes child processes before they are started.
*
* A `Command` stores the executable, arguments, environment, standard streams,
* working directory, and other process options. Commands can also be piped
* together. A command is an `Effect`; running it asks the
* `ChildProcessSpawner` service to start the process and returns a
* `ChildProcessHandle`.
*
* @stability unstable
* @since 4.0.0
*/
var TypeId = "~effect/process/ChildProcess";
var Proto = {
	.../*#__PURE__*/ Prototype({
		label: "Command",
		evaluate(fiber) {
			return getUnsafe(fiber.context, ChildProcessSpawner).spawn(this);
		}
	}),
	[TypeId]: TypeId
};
var makeStandardCommand = (command, args, options) => Object.assign(Object.create(Proto), {
	_tag: "StandardCommand",
	command,
	args,
	options
});
/**
* Create a command from a template literal, options + template, or array form.
*
* **Details**
*
* This function supports three calling conventions:
* 1. Template literal: `make\`npm run build\``
* 2. Options + template literal: `make({ cwd: "/app" })\`npm run build\``
* 3. Array form: `make("npm", ["run", "build"], options?)`
*
* Templates are split with `CommandLine.template`: quotes group words, each
* `${}` value is one literal argument, and an argument that contains a
* `Redacted` value stays `Redacted`. Arguments in the array form can be
* `Redacted` too.
*
* With the `shell` option, the template text is the shell script and is kept
* as written.
*
* **Gotchas**
*
* - A template is parsed when `make` is called. Shell syntax such as `|`,
*   `$HOME`, `*` or `~` throws a `CommandLine.CommandLineError`: quote it, or
*   pass the value with `${}`.
* - A template with the `shell` option cannot contain `${}` values, because
*   their quoting depends on the shell. Build the script with
*   `CommandLine.quote` and pass it as a string.
* - The program name, the first word, cannot be `Redacted`.
* - A NUL character in the command, an argument or an `env` value fails with
*   a `BadArgument` error when the command is spawned.
*
* **Example** (Creating commands)
*
* ```ts import.meta.vitest
* import { ChildProcess } from "effect/process"
*
* // Template literal form; quotes group words
* const cmd1 = ChildProcess.make`echo "hello world"`
*
* // With options
* const cmd2 = ChildProcess.make({ cwd: "/tmp" })`ls -la`
*
* // Array form
* const cmd3 = ChildProcess.make("git", ["status"])
*
* const result = [cmd1.args[0], cmd2.options.cwd, cmd3.args[0]] // => ["hello world", "/tmp", "status"]
* ```
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$3 = function make(...args) {
	if (isTemplateString(args[0])) {
		const [templates, ...expressions] = args;
		const [command, cmdArgs] = parseTemplate(templates, expressions);
		return makeStandardCommand(command, cmdArgs, {});
	}
	if (typeof args[0] === "object" && !Array.isArray(args[0]) && !isTemplateString(args[0])) {
		const options = args[0];
		return function(templates, ...expressions) {
			if (options.shell !== void 0 && options.shell !== false) return makeStandardCommand(shellScript(templates, expressions), [], options);
			const [command, cmdArgs] = parseTemplate(templates, expressions);
			return makeStandardCommand(command, cmdArgs, options);
		};
	}
	if (typeof args[0] === "string" && !Array.isArray(args[1])) {
		const [command, options = {}] = args;
		return makeStandardCommand(command, [], options);
	}
	const [command, cmdArgs = [], options = {}] = args;
	return makeStandardCommand(command, cmdArgs, options);
};
var isTemplateString = (u) => Array.isArray(u) && "raw" in u && Array.isArray(u.raw);
/**
* Parses an fd name like "fd3" to its numeric index.
* Returns undefined if the name is invalid.
*
* @stability unstable
* @category converting
* @since 4.0.0
*/
var parseFdName = (name) => {
	const match = /^fd(\d+)$/.exec(name);
	if (match === null) return void 0;
	const fd = parseInt(match[1], 10);
	return fd >= 3 ? fd : void 0;
};
/**
* Create an fd name from its numeric index.
*
* @stability unstable
* @category converting
* @since 4.0.0
*/
var fdName = (fd) => `fd${fd}`;
var parseTemplate = (templates, expressions) => {
	const [program = "", ...args] = getOrThrow(template(templates, ...expressions));
	if (typeof program !== "string") throw new CommandLineError({
		reason: "InvalidArgument",
		message: "The program name of a command cannot be Redacted"
	});
	return [program, args];
};
var shellScript = (templates, expressions) => {
	if (expressions.length > 0) throw new CommandLineError({
		reason: "UnsupportedSyntax",
		message: "A shell template cannot interpolate values; build the script with CommandLine.quote"
	});
	const script = templates[0];
	if (script === void 0) throw new CommandLineError({
		reason: "InvalidEscape",
		message: "Template part 0 contains an invalid escape sequence"
	});
	return script;
};
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/internal/nodeChildProcessSpawner.js
var buildSpawnOptions = (options, base, platform) => {
	const detached = options.detached ?? platform !== "win32";
	return {
		...base,
		detached,
		shell: options.shell,
		windowsHide: options.windowsHide ?? !detached
	};
};
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/NodeChildProcessSpawner.js
var toError = (error) => error instanceof globalThis.Error ? error : new globalThis.Error(String(error));
var toPlatformError = (method, error, command) => {
	const { commands } = flattenCommand(command);
	const format = globalThis.process.platform === "win32" ? "windows" : "posix";
	const commandStr = commands.map((cmd) => display([cmd.command, ...cmd.args], { format })).join(" | ");
	return handleErrnoException("ChildProcess", method)(error, [commandStr]);
};
var unwrap = (value$1) => isRedacted(value$1) ? value(value$1) : value$1;
var findNulCharacter = (command) => {
	if (command.command.includes("\0")) return "The command contains a NUL character";
	const index = command.args.findIndex((arg) => unwrap(arg).includes("\0"));
	if (index !== -1) return `Argument ${index + 1} contains a NUL character`;
	for (const [name, value] of Object.entries(command.options.env ?? {})) if (value !== void 0 && unwrap(value).includes("\0")) return `The environment variable ${name} contains a NUL character`;
};
var processGroupGraceMillis = 1e3;
var processGroupPollIntervalMillis = 10;
var handleInputErrors = (writable) => {
	const onError = () => {};
	writable.on("error", onError);
	writable.once("close", () => writable.off("error", onError));
};
/** Node has recorded the leader's exit, after which its PID may be reused by an unrelated process. */
var hasExited = (childProcess) => childProcess.exitCode !== null || childProcess.signalCode !== null;
/**
* A non-detached leader shares its parent's process group, so once it has
* exited there is no group of its own left to signal or poll.
*/
var ownsProcessGroup = (command, childProcess) => command.options.detached !== false || !hasExited(childProcess);
/**
* The process group exists but has no member that can be signalled, such as
* on macOS when its remaining members are zombies.
*/
var isUnsignallableProcessGroup = (error) => error?.code === "EPERM";
/** The leader has not exited, or a member of its process group still exists. */
var isProcessAlive = (command, childProcess) => {
	if (!hasExited(childProcess)) return true;
	if (globalThis.process.platform === "win32" || !ownsProcessGroup(command, childProcess)) return false;
	try {
		globalThis.process.kill(-childProcess.pid, 0);
		return true;
	} catch (error) {
		return isUnsignallableProcessGroup(error);
	}
};
var taskkill = (childProcess, onExit = () => {}) => {
	if (hasExited(childProcess)) {
		onExit(null);
		return;
	}
	NodeChildProcess.execFile("taskkill", [
		"/pid",
		String(childProcess.pid),
		"/T",
		"/F"
	], { windowsHide: true }, onExit);
};
/**
* Layer that provides the `NodeChildProcessSpawner` implementation.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer$5 = /*#__PURE__*/ effect(ChildProcessSpawner, /* @__PURE__ */ gen(function* () {
	const fs = yield* FileSystem;
	const path = yield* Path;
	const resolveWorkingDirectory = fnUntraced(function* (options) {
		if (isUndefined(options.cwd)) return void 0;
		yield* fs.access(options.cwd);
		return path.resolve(options.cwd);
	});
	const resolveEnvironment = (options) => {
		if (options.env === void 0) return void 0;
		const env = options.extendEnv === true ? { ...globalThis.process.env } : {};
		for (const [key, value] of Object.entries(options.env)) if (value === void 0) delete env[key];
		else env[key] = unwrap(value);
		return env;
	};
	const inputToStdioOption = (input) => isStream(input) ? "pipe" : input;
	const outputToStdioOption = (input) => isSink(input) ? "pipe" : input;
	const resolveStdinOption = (options) => {
		const defaultConfig = {
			stream: "pipe",
			encoding: "utf-8",
			endOnDone: true
		};
		if (isUndefined(options.stdin)) return defaultConfig;
		if (typeof options.stdin === "string") return {
			...defaultConfig,
			stream: options.stdin
		};
		if (isStream(options.stdin)) return {
			...defaultConfig,
			stream: options.stdin
		};
		return {
			stream: options.stdin.stream,
			encoding: options.stdin.encoding ?? defaultConfig.encoding,
			endOnDone: options.stdin.endOnDone ?? defaultConfig.endOnDone
		};
	};
	const resolveOutputOption = (options, streamName) => {
		const option = options[streamName];
		if (isUndefined(option)) return { stream: "pipe" };
		if (typeof option === "string") return { stream: option };
		if (isSink(option)) return { stream: option };
		return { stream: option.stream };
	};
	const resolveAdditionalFds = (options) => {
		if (isUndefined(options.additionalFds)) return [];
		const result = [];
		for (const [name, config] of Object.entries(options.additionalFds)) {
			const fd = parseFdName(name);
			if (isNotUndefined(fd)) result.push({
				fd,
				config
			});
		}
		return result.sort((a, b) => a.fd - b.fd);
	};
	const buildStdioArray = (stdinConfig, stdoutConfig, stderrConfig, additionalFds) => {
		const stdio = [
			inputToStdioOption(stdinConfig.stream),
			outputToStdioOption(stdoutConfig.stream),
			outputToStdioOption(stderrConfig.stream)
		];
		if (additionalFds.length === 0) return stdio;
		const maxFd = additionalFds.reduce((max, { fd }) => Math.max(max, fd), 2);
		for (let i = 3; i <= maxFd; i++) stdio[i] = "ignore";
		for (const { fd } of additionalFds) stdio[fd] = "pipe";
		return stdio;
	};
	const runInputStream = (stream, sink, inputFailure) => forkScoped(run(tapError(stream, (error) => fail$2(inputFailure, error)), sink));
	const setupAdditionalFds = fnUntraced(function* (command, childProcess, additionalFds, inputFailure) {
		if (additionalFds.length === 0) return {
			getInputFd: () => drain,
			getOutputFd: () => empty
		};
		const inputSinks = /* @__PURE__ */ new Map();
		const outputStreams = /* @__PURE__ */ new Map();
		const setupInput = (fd, nodeStream, stream) => suspend(() => {
			let sink = drain;
			if (nodeStream && "write" in nodeStream) {
				handleInputErrors(nodeStream);
				sink = fromWritable({
					evaluate: () => nodeStream,
					onError: (error) => toPlatformError(`fromWritable(fd${fd})`, toError(error), command)
				});
			}
			if (stream) return map(runInputStream(stream, sink, inputFailure), () => {
				inputSinks.set(fd, sink);
			});
			inputSinks.set(fd, sink);
			return void_;
		});
		const setupOutput = (fd, nodeStream, sink) => {
			let stream = empty;
			if (nodeStream && "read" in nodeStream) {
				const passThrough = new PassThrough();
				let error = void 0;
				passThrough.on("error", (cause) => {
					error ??= cause;
				});
				nodeStream.on("error", (cause) => passThrough.destroy(cause));
				nodeStream.pipe(passThrough);
				const onError = (cause) => toPlatformError(`fromReadable(fd${fd})`, toError(cause), command);
				stream = suspend$1(() => error === void 0 ? fromReadable({
					evaluate: () => passThrough,
					onError
				}) : fail$4(onError(error)));
			}
			if (sink) stream = transduce(stream, sink);
			outputStreams.set(fd, stream);
		};
		for (const { config, fd } of additionalFds) {
			const nodeStream = childProcess.stdio[fd];
			switch (config.type) {
				case "input":
					yield* setupInput(fd, nodeStream, config.stream);
					break;
				case "output":
					setupOutput(fd, nodeStream, config.sink);
					break;
				case "duplex":
					if (nodeStream && "allowHalfOpen" in nodeStream) nodeStream.allowHalfOpen = true;
					setupOutput(fd, nodeStream, config.sink);
					yield* setupInput(fd, nodeStream, config.stream);
			}
		}
		return {
			getInputFd: (fd) => inputSinks.get(fd) ?? drain,
			getOutputFd: (fd) => outputStreams.get(fd) ?? empty
		};
	});
	const setupChildStdin = (command, childProcess, config, inputFailure) => suspend(() => {
		let sink = drain;
		if (isNotNull(childProcess.stdin)) {
			handleInputErrors(childProcess.stdin);
			sink = fromWritable({
				evaluate: () => childProcess.stdin,
				onError: (error) => toPlatformError("fromWritable(stdin)", toError(error), command),
				endOnDone: config.endOnDone,
				encoding: config.encoding
			});
		}
		if (isStream(config.stream)) return as(runInputStream(config.stream, sink, inputFailure), sink);
		return succeed(sink);
	});
	const setupChildOutputStreams = (command, childProcess, stdoutConfig, stderrConfig) => {
		let stdout = childProcess.stdout ? (() => {
			const passThrough = new PassThrough();
			childProcess.stdout.on("error", (error) => passThrough.destroy(error));
			childProcess.stdout.pipe(passThrough);
			return fromReadable({
				evaluate: () => passThrough,
				onError: (error) => toPlatformError("fromReadable(stdout)", toError(error), command)
			});
		})() : empty;
		let stderr = childProcess.stderr ? (() => {
			const passThrough = new PassThrough();
			childProcess.stderr.on("error", (error) => passThrough.destroy(error));
			childProcess.stderr.pipe(passThrough);
			return fromReadable({
				evaluate: () => passThrough,
				onError: (error) => toPlatformError("fromReadable(stderr)", toError(error), command)
			});
		})() : empty;
		if (isSink(stdoutConfig.stream)) stdout = transduce(stdout, stdoutConfig.stream);
		if (isSink(stderrConfig.stream)) stderr = transduce(stderr, stderrConfig.stream);
		const all = merge$1(stdout, stderr);
		return {
			stdout,
			stderr,
			all
		};
	};
	const spawn = (command, spawnOptions) => callback((resume) => {
		const deferred = makeUnsafe();
		const handle = NodeChildProcess.spawn(command.command, command.args.map(unwrap), spawnOptions);
		handle.on("error", (error) => {
			if (command.args.some(isRedacted)) Object.assign(error, { spawnargs: [command.command, ...command.args.map((arg) => isRedacted(arg) ? "<redacted>" : arg)] });
			resume(fail(toPlatformError("spawn", error, command)));
		});
		handle.on("exit", (...args) => {
			doneUnsafe(deferred, succeed$2(args));
		});
		handle.on("spawn", () => {
			resume(succeed([handle, deferred]));
		});
		return sync(() => {
			handle.kill("SIGTERM");
		});
	});
	const killProcessGroup = (command, childProcess, signal) => {
		if (globalThis.process.platform === "win32") return callback((resume) => {
			taskkill(childProcess, (error) => {
				if (error) resume(fail(toPlatformError("kill", toError(error), command)));
				else resume(void_);
			});
		});
		return try_({
			try: () => {
				globalThis.process.kill(-childProcess.pid, signal);
			},
			catch: (error) => toPlatformError("kill", toError(error), command)
		});
	};
	const killProcessGroupOnExit = (childProcess, signal) => {
		if (globalThis.process.platform === "win32") {
			taskkill(childProcess);
			return;
		}
		try {
			globalThis.process.kill(-childProcess.pid, signal);
		} catch {}
	};
	const killProcess = (command, childProcess, signal) => suspend(() => {
		if (!childProcess.kill(signal)) {
			const error = new globalThis.Error("Failed to kill child process");
			return fail(toPlatformError("kill", error, command));
		}
		return void_;
	});
	/** Waits for the leader and its process group, bounded by native time. */
	const awaitProcessExit = (command, childProcess, timeoutMillis) => callback((resume) => {
		const deadline = Date.now() + timeoutMillis;
		let timer;
		const stop = () => {
			clearTimeout(timer);
			childProcess.removeListener("exit", poll);
		};
		const poll = () => {
			clearTimeout(timer);
			if (Date.now() >= deadline || !isProcessAlive(command, childProcess)) {
				stop();
				resume(void_);
				return;
			}
			timer = setTimeout(poll, processGroupPollIntervalMillis);
		};
		childProcess.on("exit", poll);
		poll();
		return sync(stop);
	});
	const terminateProcessGroup = fnUntraced(function* (command, childProcess, exitSignal, options) {
		const signalGroup = (signal) => ownsProcessGroup(command, childProcess) ? killProcessGroup(command, childProcess, signal).pipe(catch_((error) => hasExited(childProcess) && isUnsignallableProcessGroup(error.cause) ? void_ : killProcess(command, childProcess, signal))) : killProcess(command, childProcess, signal);
		yield* signalGroup(options?.killSignal ?? "SIGTERM");
		if (isUndefined(options?.forceKillAfter)) {
			yield* _await(exitSignal);
			yield* awaitProcessExit(command, childProcess, processGroupGraceMillis);
		} else {
			yield* awaitProcessExit(command, childProcess, toMillis(options.forceKillAfter));
			if (isProcessAlive(command, childProcess)) {
				yield* signalGroup("SIGKILL");
				yield* awaitProcessExit(command, childProcess, processGroupGraceMillis);
			}
		}
		yield* _await(exitSignal);
	});
	/**
	* Get the appropriate source stream from a process handle based on the
	* `from` pipe option.
	*/
	const getSourceStream = (handle, from) => {
		const fromOption = from ?? "stdout";
		switch (fromOption) {
			case "stdout": return handle.stdout;
			case "stderr": return handle.stderr;
			case "all": return handle.all;
			default: {
				const fd = parseFdName(fromOption);
				if (isNotUndefined(fd)) return handle.getOutputFd(fd);
				return handle.stdout;
			}
		}
	};
	const spawnCommand = fnUntraced(function* (cmd) {
		switch (cmd._tag) {
			case "StandardCommand": {
				if (cmd.options.shell !== void 0 && cmd.options.shell !== false && cmd.args.length > 0) return yield* fail(badArgument({
					module: "ChildProcess",
					method: "spawn",
					description: "The shell option cannot be combined with arguments; pass the whole script as the command"
				}));
				const nulCharacter = findNulCharacter(cmd);
				if (nulCharacter !== void 0) return yield* fail(badArgument({
					module: "ChildProcess",
					method: "spawn",
					description: nulCharacter
				}));
				const stdinConfig = resolveStdinOption(cmd.options);
				const stdoutConfig = resolveOutputOption(cmd.options, "stdout");
				const stderrConfig = resolveOutputOption(cmd.options, "stderr");
				const resolvedAdditionalFds = resolveAdditionalFds(cmd.options);
				let isReferenced = true;
				const cwd = yield* resolveWorkingDirectory(cmd.options);
				const env = resolveEnvironment(cmd.options);
				const stdio = buildStdioArray(stdinConfig, stdoutConfig, stderrConfig, resolvedAdditionalFds);
				const [childProcess, exitSignal] = yield* acquireRelease(spawn(cmd, buildSpawnOptions(cmd.options, {
					cwd,
					env,
					stdio
				}, process.platform)), fnUntraced(function* ([childProcess, exitSignal]) {
					if (yield* isDone(exitSignal)) {
						const [code] = yield* _await(exitSignal);
						if (code !== 0 && isNotNull(code)) yield* ignore(terminateProcessGroup(cmd, childProcess, exitSignal, cmd.options));
						else if (isReferenced && process.platform !== "win32" && cmd.options.detached !== false) yield* ignore(terminateProcessGroup(cmd, childProcess, exitSignal, cmd.options));
						return;
					}
					if (!isReferenced) return;
					yield* ignore(terminateProcessGroup(cmd, childProcess, exitSignal, cmd.options));
				}));
				const pid = ProcessId(childProcess.pid);
				if (cmd.options.detached !== false) childProcess.on("exit", (code) => {
					if (code !== 0 && isNotNull(code)) killProcessGroupOnExit(childProcess, cmd.options.killSignal ?? "SIGTERM");
				});
				const reref = sync(() => {
					if (!isReferenced) {
						childProcess.ref();
						isReferenced = true;
					}
				});
				const unref = sync(() => {
					if (isReferenced) {
						childProcess.unref();
						isReferenced = false;
					}
					return reref;
				});
				const inputFailure = makeUnsafe();
				const stdin = yield* setupChildStdin(cmd, childProcess, stdinConfig, inputFailure);
				const { all, stderr, stdout } = setupChildOutputStreams(cmd, childProcess, stdoutConfig, stderrConfig);
				const { getInputFd, getOutputFd } = yield* setupAdditionalFds(cmd, childProcess, resolvedAdditionalFds, inputFailure);
				const isRunning = map(isDone(exitSignal), (done) => !done);
				const exitCode = flatMap(raceFirst(_await(exitSignal), _await(inputFailure)), ([code, signal]) => {
					if (isDoneUnsafe(inputFailure)) return _await(inputFailure);
					if (isNotNull(code)) return succeed(ExitCode(code));
					const error = new globalThis.Error(`Process interrupted due to receipt of signal: '${signal}'`);
					return fail(toPlatformError("exitCode", error, cmd));
				});
				const kill = (options) => terminateProcessGroup(cmd, childProcess, exitSignal, options);
				return makeHandle({
					pid,
					exitCode,
					isRunning,
					kill,
					stdin,
					stdout,
					stderr,
					all,
					getInputFd,
					getOutputFd,
					unref
				});
			}
			case "PipedCommand": {
				const { commands, pipeOptions } = flattenCommand(cmd);
				const [root, ...pipeline] = commands;
				const handles = [yield* spawnCommand(root)];
				for (let i = 0; i < pipeline.length; i++) {
					const command = pipeline[i];
					const options = pipeOptions[i] ?? {};
					const stdinConfig = resolveStdinOption(command.options);
					const sourceStream = unwrap$2(succeed(getSourceStream(handles[handles.length - 1], options.from)));
					const toOption = options.to ?? "stdin";
					if (toOption === "stdin") handles.push(yield* spawnCommand(make$3(command.command, command.args, {
						...command.options,
						stdin: {
							...stdinConfig,
							stream: sourceStream
						}
					})));
					else {
						const fd = parseFdName(toOption);
						if (isNotUndefined(fd)) {
							const fdName$1 = fdName(fd);
							const existingFds = command.options.additionalFds ?? {};
							const existingFd = existingFds[fdName$1];
							const fdConfig = existingFd?.type === "duplex" ? {
								...existingFd,
								stream: sourceStream
							} : {
								type: "input",
								stream: sourceStream
							};
							handles.push(yield* spawnCommand(make$3(command.command, command.args, {
								...command.options,
								additionalFds: {
									...existingFds,
									[fdName$1]: fdConfig
								}
							})));
						} else handles.push(yield* spawnCommand(make$3(command.command, command.args, {
							...command.options,
							stdin: {
								...stdinConfig,
								stream: sourceStream
							}
						})));
					}
				}
				const handle = handles[handles.length - 1];
				const kill = (options) => forEach([...handles].reverse(), (handle) => ignore(handle.kill(options)), { discard: true });
				const unref = gen(function* () {
					const rerefs = [];
					for (const handle of handles) rerefs.push(yield* handle.unref);
					return forEach([...rerefs].reverse(), (reref) => reref, { discard: true });
				});
				return makeHandle({
					pid: handle.pid,
					exitCode: handle.exitCode,
					isRunning: handle.isRunning,
					kill,
					stdin: handles[0].stdin,
					stdout: handle.stdout,
					stderr: handle.stderr,
					all: handle.all,
					getInputFd: handle.getInputFd,
					getOutputFd: handle.getOutputFd,
					unref
				});
			}
		}
	});
	return make$4(spawnCommand);
}));
/**
* Flattens a `Command` into an array of `StandardCommand`s along with pipe
* options for each connection.
*
* @stability unstable
* @category transforming
* @since 4.0.0
*/
var flattenCommand = (command) => {
	const commands = [];
	const pipeOptions = [];
	const flatten = (cmd) => {
		switch (cmd._tag) {
			case "StandardCommand":
				commands.push(cmd);
				break;
			case "PipedCommand":
				flatten(cmd.left);
				pipeOptions.push(cmd.options);
				flatten(cmd.right);
		}
	};
	flatten(command);
	if (commands.length === 0) throw new Error("flattenCommand produced empty commands array");
	const [first, ...rest] = commands;
	return {
		commands: [first, ...rest],
		pipeOptions
	};
};
//#endregion
//#region ../../node_modules/.bun/effect@4.1.0/node_modules/effect/dist/socket/SocketServer.js
/**
* Service contract for servers that accept socket connections.
*
* `SocketServer` exposes the bound server `address` and a long-running `run`
* loop that hands each accepted connection to a handler as a `Socket.Socket`.
* Bound addresses use the shared `NetAddress.SocketAddress` model. This module also
* defines server-level errors reported while opening or running a server.
* Platform layers provide concrete implementations of this service.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Context service for a socket server, exposing its bound address and a run
* loop that handles each accepted `Socket`.
*
* @stability unstable
* @category services
* @since 4.0.0
*/
var SocketServer = class extends Service()("@effect/platform/SocketServer") {};
/**
* Runtime type identifier attached to `SocketServerError` values.
*
* @stability unstable
* @category type IDs
* @since 4.0.0
*/
var ErrorTypeId = "@effect/platform/SocketServer/SocketServerError";
/**
* Error reason for failures that occur while opening a socket server.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketServerOpenError = class extends TaggedError("SocketServerOpenError") {
	get message() {
		return "Open";
	}
};
TaggedError("SocketServerUnknownError");
/**
* Tagged socket server error that wraps a server error reason and exposes its
* cause.
*
* @stability unstable
* @category errors
* @since 4.0.0
*/
var SocketServerError = class extends TaggedError("SocketServerError") {
	constructor(props) {
		super({
			...props,
			cause: props.reason.cause
		});
	}
	/**
	* Marks this value as a socket server error for runtime guards.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	[ErrorTypeId] = ErrorTypeId;
	/**
	* Delegates the public message to the underlying socket server error reason.
	*
	* @stability unstable
	* @since 4.0.0
	*/
	get message() {
		return this.reason.message;
	}
};
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node-shared@4.1.0+2155bb14b3e64f80/node_modules/@effect/platform-node-shared/dist/NodeSocketServer.js
/**
* Node socket server adapters for Effect's unstable socket server API.
*
* This module turns `node:net` TCP or Unix-domain servers, `node:tls` servers,
* and `ws` WebSocket servers into scoped `SocketServer.SocketServer` services.
* Use the TCP and TLS constructors when handlers should receive a
* `Socket.Socket` backed by a Node `net.Socket`; use the WebSocket
* constructors when handlers should receive a `Socket.Socket` backed by `ws`
* and have access to the per-connection WebSocket and `IncomingMessage`
* services.
*
* @stability unstable
* @since 4.0.0
*/
var isDeno = "Deno" in globalThis;
var socketAddressFromNode = (address) => typeof address === "string" ? succeed(unixPathAddress(address)) : fromResult(inetAddressFromIpString(address.address, address.port)).pipe(mapError((cause) => new SocketServerError({ reason: new SocketServerOpenError({ cause }) })));
Service()("@effect/platform-node-shared/NodeSocketServer/IncomingMessage");
/**
* Creates a scoped TCP `SocketServer` from a Node `net.Server`, starts
* listening with the supplied options, queues pending connections until `run`
* is called, and closes the server when the scope ends.
*
* @stability unstable
* @category constructors
* @since 4.0.0
*/
var make$1 = (options) => makeNetServer({
	listenOptions: options,
	connectionEvent: "connection",
	createServer: () => Net.createServer(options)
});
var makeNetServer = /*#__PURE__*/ fnUntraced(function* (options) {
	const errorDeferred = makeUnsafe();
	const pending = /* @__PURE__ */ new Map();
	function defaultOnConnection(conn) {
		const remove = () => {
			pending.delete(conn);
			conn.off("close", remove);
			conn.off("error", remove);
		};
		pending.set(conn, remove);
		conn.on("close", remove);
		conn.on("error", remove);
	}
	let onConnection = defaultOnConnection;
	let server;
	yield* addFinalizer(() => callback((resume) => {
		pending.forEach((remove, conn) => {
			remove();
			conn.destroy();
		});
		server?.close(() => resume(void_));
	}));
	server = options.createServer();
	server.on(options.connectionEvent, (conn) => {
		if (!isDeno) conn.pause();
		onConnection(conn);
	});
	server.on("error", (err) => doneUnsafe(errorDeferred, fail$3(err)));
	yield* callback((resume) => {
		server.listen(options.listenOptions, () => resume(void_));
	}).pipe(raceFirst(mapError(_await(errorDeferred), (err) => new SocketServerError({ reason: new SocketServerOpenError({ cause: err }) }))));
	const run = fnUntraced(function* (handler) {
		const scope = yield* make$6();
		const services = omit(Scope)(yield* context());
		const trackFiber = runIn(scope);
		const prevOnConnection = onConnection;
		onConnection = function(conn) {
			let error;
			conn.on("error", (err) => {
				error = err;
			});
			pipe(fromDuplex(acquireRelease(suspend(() => {
				if (error) return fail(new SocketError({ reason: new SocketOpenError({
					kind: "Unknown",
					cause: error
				}) }));
				else if (conn.closed) return fail(new SocketError({ reason: new SocketCloseError({ code: 1e3 }) }));
				return succeed(conn);
			}), (conn) => sync(() => {
				if (conn.closed === false) conn.destroySoon();
			})), { tlsServer: true }), flatMap(handler), ignoreCause({
				log: "Unhandled",
				message: "Unhandled error in SocketServer"
			}), runForkWith(add(services, NetSocket, conn)), trackFiber);
		};
		pending.forEach((remove, conn) => {
			remove();
			onConnection(conn);
		});
		return yield* callback((_resume) => {
			return suspend(() => {
				onConnection = prevOnConnection;
				return close$1(scope, void_$1);
			});
		});
	});
	const boundAddress = yield* socketAddressFromNode(server.address());
	return SocketServer.of({
		address: boundAddress,
		run
	});
});
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/NodeStdio.js
/**
* Node.js `Stdio` layer for the current process.
*
* The exported layer reuses the shared Node stdio implementation. It satisfies
* the platform-independent `Stdio` service by reading command-line arguments
* from `process.argv`, consuming input from `process.stdin`, and writing output
* streams to `process.stdout` and `process.stderr`.
*
* @stability unstable
* @since 4.0.0
*/
/**
* Provides the `Stdio` service backed by the current process arguments,
* stdin, stdout, and stderr streams.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer$3 = /* @__PURE__ */ succeed$3(Stdio, /*#__PURE__*/ make$8({
	args: /*#__PURE__*/ sync(() => process.argv.slice(2)),
	stdinIsTerminal: /*#__PURE__*/ sync(() => process.stdin.isTTY === true),
	stdoutIsTerminal: /*#__PURE__*/ sync(() => process.stdout.isTTY === true),
	stderrIsTerminal: /*#__PURE__*/ sync(() => process.stderr.isTTY === true),
	stdout: (options) => fromWritable({
		evaluate: () => process.stdout,
		onError: (cause) => systemError({
			module: "Stdio",
			method: "stdout",
			_tag: "Unknown",
			cause
		}),
		endOnDone: options?.endOnDone ?? false
	}),
	stderr: (options) => fromWritable({
		evaluate: () => process.stderr,
		onError: (cause) => systemError({
			module: "Stdio",
			method: "stderr",
			_tag: "Unknown",
			cause
		}),
		endOnDone: options?.endOnDone ?? false
	}),
	stdin: /*#__PURE__*/ fromReadable({
		evaluate: () => process.stdin,
		onError: (cause) => systemError({
			module: "Stdio",
			method: "stdin",
			_tag: "Unknown",
			cause
		}),
		closeOnDone: false
	})
}));
/**
* Provides the default process-backed `Terminal` service, ending key input on
* bare Esc, Ctrl+C, or Ctrl+D.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer$2 = /*#__PURE__*/ effect(Terminal, /*#__PURE__*/ (/* @__PURE__ */ fnUntraced(function* (shouldQuit = defaultShouldQuit) {
	const stdin = process.stdin;
	const stdout = process.stdout;
	const lines = yield* make$9();
	let inputEnded = stdin.readableEnded;
	let readlineActive = false;
	const onStdinEnd = () => {
		inputEnded = true;
		if (!readlineActive) endUnsafe(lines);
	};
	stdin.once("end", onStdinEnd);
	yield* addFinalizer(() => sync(() => stdin.off("end", onStdinEnd)));
	const rlRef = yield* make$10({
		acquire: acquireRelease(sync(() => {
			const rl = readline.createInterface({
				input: stdin,
				escapeCodeTimeout: 50
			});
			const onLine = (line) => offerUnsafe(lines, line);
			const onClose = () => {
				readlineActive = false;
				endUnsafe(lines);
			};
			readlineActive = true;
			readline.emitKeypressEvents(stdin, rl);
			rl.on("line", onLine);
			rl.once("close", onClose);
			return {
				rl,
				onClose,
				onLine
			};
		}), ({ rl, onClose, onLine }) => sync(() => {
			readlineActive = false;
			rl.off("line", onLine);
			rl.off("close", onClose);
			rl.close();
			if (inputEnded) endUnsafe(lines);
		})),
		idleTimeToLive: "10 millis"
	});
	const setRawMode = (enabled) => sync(() => {
		if (stdin.isTTY) stdin.setRawMode(enabled);
	});
	const rawModeRef = yield* make$10({
		acquire: acquireRelease(setRawMode(true), () => setRawMode(false)),
		idleTimeToLive: "10 millis"
	});
	const columns = sync(() => stdout.columns ?? 0);
	const rows = sync(() => stdout.rows ?? 0);
	const size = gen(function* () {
		const queue = yield* sliding(1);
		const onResize = () => offerUnsafe(queue, {
			columns: stdout.columns ?? 0,
			rows: stdout.rows ?? 0
		});
		yield* addFinalizer(() => sync(() => {
			stdout.off("resize", onResize);
			endUnsafe(queue);
		}));
		stdout.on("resize", onResize);
		onResize();
		return queue;
	});
	const readInput = gen(function* () {
		const queue = yield* make$9();
		const handleKeypress = (s, k) => {
			const userInput = {
				input: fromUndefinedOr(s),
				key: {
					name: k.name ?? "",
					ctrl: !!k.ctrl,
					meta: !!k.meta,
					shift: !!k.shift
				}
			};
			offerUnsafe(queue, userInput);
			if (shouldQuit(userInput)) endUnsafe(queue);
		};
		const keepAlive = setInterval(() => {}, 2147483647);
		const handleEnd = () => {
			clearInterval(keepAlive);
			endUnsafe(queue);
		};
		yield* addFinalizer(() => sync(() => {
			clearInterval(keepAlive);
			stdin.off("keypress", handleKeypress);
			stdin.off("end", handleEnd);
		}));
		stdin.on("keypress", handleKeypress);
		if (inputEnded) handleEnd();
		else {
			yield* get(rlRef);
			yield* get(rawModeRef);
			stdin.once("end", handleEnd);
		}
		return queue;
	});
	const readLine = suspend(() => poll(lines).pipe(flatMap(match({
		onNone: () => scoped(andThen(get(rlRef), take(lines))),
		onSome: succeed
	})), mapError(() => new QuitError({}))));
	const display = (prompt) => uninterruptible(callback((resume) => {
		stdout.write(prompt, (err) => isNullish(err) ? resume(void_) : resume(fail(badArgument({
			module: "Terminal",
			method: "display",
			description: "Failed to write prompt to stdout",
			cause: err
		}))));
	}));
	return make$11({
		columns,
		rows,
		size,
		readInput,
		readLine,
		display
	});
}))(defaultShouldQuit));
function defaultShouldQuit(input) {
	const key = input.key;
	return key.name === "escape" || key.ctrl && (key.name === "c" || key.name === "d");
}
//#endregion
//#region ../../node_modules/.bun/@effect+platform-node@4.1.0+cdfe17b7ee0d326d/node_modules/@effect/platform-node/dist/NodeServices.js
/**
* Provides the default Node implementations for child process spawning,
* filesystem, path, stdio, and terminal services.
*
* @stability unstable
* @category layers
* @since 4.0.0
*/
var layer = /*#__PURE__*/ provideMerge(layer$5, /*#__PURE__*/ mergeAll(layer$7, layer$8, layer$3, layer$2));
//#endregion
//#region ../gui-plugins/src/ssh/remote-cli.ts
var Failure = class extends TaggedError$1()("RemoteCliFailure", {
	code: Literals([
		"platform",
		"version",
		"install"
	]),
	detail: String$1
}) {
	get message() {
		return this.detail;
	}
};
function quote$1(value) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function requireVersion(version) {
	if (version !== "local" && !/^[0-9][a-zA-Z0-9.+-]*$/.test(version)) throw new Failure({
		code: "version",
		detail: version
	});
	return version;
}
function discoverScript$1(options = {}) {
	return `cli=${options.fromPath ? "$(command -v opencode || true)" : "\"\""}
if [ -z "$cli" ] && [ -x "$HOME/.opencode/bin/opencode" ]; then cli="$HOME/.opencode/bin/opencode"; fi
${options.cache ? `if [ -z "$cli" ]; then
  for binary in "$HOME"/${quote$1(options.cache.directory)}/${quote$1(options.cache.prefix)}*/opencode; do
    if [ -x "$binary" ]; then cli="$binary"; fi
  done
fi
` : ""}if [ -n "$cli" ]; then printf '%s\\n' "$cli"; fi
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
var probeScript = `set -eu
os=$(uname -s | tr '[:upper:]' '[:lower:]')
arch=$(uname -m)
case "$os" in linux|darwin) ;; *) exit 2 ;; esac
case "$arch" in x86_64|amd64) arch=x64 ;; aarch64|arm64) arch=arm64 ;; *) exit 2 ;; esac
target="$os-$arch"
if [ "$arch" = x64 ]; then target="$target-baseline"; fi
if [ "$os" = linux ]; then
  if [ -f /etc/alpine-release ] || (ldd --version 2>&1 | grep -qi musl); then target="$target-musl"; fi
fi
printf 'OPENCODE_REMOTE_TARGET=%s\\n' "$target"
`;
function archiveUrl(target, version) {
	if (!/^(linux|darwin)-(x64-baseline|arm64)(-musl)?$/.test(target)) throw new Failure({
		code: "platform",
		detail: target
	});
	return `https://registry.npmjs.org/@opencode/cli-${target}/-/cli-${target}-${requireVersion(version)}.tgz`;
}
function installScript(input) {
	const version = requireVersion(input.version);
	if (input.source.type === "installer") return `set -eu
curl -fsSL https://raw.githubusercontent.com/anomalyco/opencode/v2/install | bash -s -- ${input.source.binary ? `--binary ${input.source.binary}` : `--version ${quote$1(version)}`}
${verifyScript("\"$HOME/.opencode/bin/opencode\"", version)}
`;
	return `set -eu
umask 077
destination="$HOME"/${quote$1(`${input.directory ?? ".opencode/bin"}/opencode`)}
mkdir -p "$(dirname "$destination")"
stage=$(mktemp -d "$(dirname "$destination")/.install-XXXXXX")
trap 'rm -rf "$stage"' EXIT
${stageBinary(input.source)}
chmod 755 "$stage/package/bin/opencode"
${verifyScript("\"$stage/package/bin/opencode\"", version)}
mv "$stage/package/bin/opencode" "$destination"
`;
}
function stageBinary(source) {
	if (source.type === "archive") return "cat > \"$stage/archive.tgz\"\ntar -xzf \"$stage/archive.tgz\" -C \"$stage\"";
	return `url=${quote$1(source.url)}
if command -v curl >/dev/null 2>&1; then
  curl -fsSL --connect-timeout 15 --max-time 180 "$url" -o "$stage/archive.tgz"
else
  wget -T 180 -O "$stage/archive.tgz" "$url"
fi
tar -xzf "$stage/archive.tgz" -C "$stage"`;
}
function verifyScript(command, version) {
	return `test "$(${command} --version | awk '{print $NF}' | sed 's/^v//')" = ${quote$1(version)}`;
}
var Beta = Struct({ version: String$1.check(isPattern(/^0\.0\.0-beta-\d+(?:\.\d+)?$/)) });
var latestBeta = fn("RemoteCli.latestBeta")(function* () {
	return (yield* (yield* HttpClient).get("https://registry.npmjs.org/@opencode%2fcli/beta").pipe(flatMap(filterStatusOk), flatMap(schemaBodyJson(Beta)), timeout("30 seconds"), mapError(() => new Failure({
		code: "install",
		detail: "https://registry.npmjs.org/@opencode%2fcli/beta"
	})))).version;
});
//#endregion
//#region ../gui-plugins/src/ssh/command.ts
var SshFailure = class SshFailure extends TaggedError$1()("SshFailure", {
	code: Literals([
		"input",
		"connection",
		"platform",
		"version",
		"install",
		"service",
		"unpublished",
		"ssh-missing"
	]),
	detail: String$1
}) {
	constructor(code, detail = "") {
		super({
			code,
			detail
		});
	}
	get message() {
		return this.detail;
	}
	static from(cause) {
		if (cause instanceof Failure) return new SshFailure(cause.code, cause.detail);
		if (cause instanceof PlatformError && isTagged(cause.reason, "NotFound") && cause.reason.method === "spawn") return new SshFailure("ssh-missing", cause.message);
		return cause instanceof SshFailure ? cause : new SshFailure("connection", cause instanceof Error ? cause.message : String(cause));
	}
};
function quote(value) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function parseTarget(input) {
	const tokens = [];
	const state = {
		word: "",
		quote: "",
		started: false
	};
	for (let i = 0; i < input.length; i++) {
		const c = input[i] ?? "";
		if (c === "\n" || c === "\r" || c === "\0") throw new SshFailure("input");
		if (c === "\\" && state.quote !== "'" && i + 1 < input.length && /[\s\\"']/.test(input[i + 1] ?? "")) {
			state.word += input[++i];
			state.started = true;
			continue;
		}
		if (state.quote) {
			if (c === state.quote) state.quote = "";
			else state.word += c;
			continue;
		}
		if (c === "'" || c === "\"") {
			state.quote = c;
			state.started = true;
			continue;
		}
		if (/\s/.test(c)) {
			if (state.started) tokens.push(state.word);
			state.word = "";
			state.started = false;
			continue;
		}
		state.word += c;
		state.started = true;
	}
	if (state.quote) throw new SshFailure("input");
	if (state.started) tokens.push(state.word);
	if (tokens[0] === "ssh") tokens.shift();
	const args = [];
	const options = /* @__PURE__ */ new Set([
		"hostname",
		"user",
		"port",
		"identityfile",
		"identityagent",
		"identitiesonly",
		"proxyjump",
		"proxycommand",
		"connecttimeout",
		"addressfamily"
	]);
	while (tokens[0]?.startsWith("-")) {
		const token = tokens.shift() ?? "";
		if ([
			"-4",
			"-6",
			"-C",
			"-A",
			"-a"
		].includes(token)) {
			args.push(token);
			continue;
		}
		const flag = token.slice(0, 2);
		if (![
			"-p",
			"-l",
			"-i",
			"-F",
			"-J",
			"-o"
		].includes(flag)) throw new SshFailure("input");
		const value = token.length > 2 ? token.slice(2) : tokens.shift();
		if (!value || value.startsWith("-")) throw new SshFailure("input");
		if (flag === "-p" && (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535)) throw new SshFailure("input");
		if (flag === "-o" && !options.has((value.split(/[=\s]/)[0] ?? "").toLowerCase())) throw new SshFailure("input");
		args.push(flag, value);
	}
	const host = tokens[0];
	if (tokens.length !== 1 || !host || !/^[a-zA-Z0-9_@.:[\]%-]+$/.test(host) || host.startsWith("-")) throw new SshFailure("input");
	if (host.includes("@") && host.slice(0, host.lastIndexOf("@")).includes(":")) throw new SshFailure("input");
	return {
		host,
		args
	};
}
var sshExecutable = () => process.platform === "win32" ? "ssh.exe" : "ssh";
function sshArgs(target) {
	return [
		"-T",
		"-o",
		"ConnectTimeout=10",
		"-o",
		"ServerAliveInterval=15",
		"-o",
		"ServerAliveCountMax=3",
		"-o",
		"RemoteCommand=none",
		"-o",
		"RequestTTY=no",
		"-o",
		"PermitLocalCommand=no",
		...target.args
	];
}
function tunnelArgs(target, localPort, remote) {
	return [
		"-o",
		"ControlMaster=no",
		"-o",
		"ControlPersist=no",
		...sshArgs(target),
		"-o",
		"ExitOnForwardFailure=yes",
		"-L",
		`127.0.0.1:${localPort}:${remote.host}:${remote.port}`,
		target.host,
		"sh -c 'exec cat >/dev/null'"
	];
}
var runSsh = fn("Ssh.run")(function* (input) {
	const spawner = yield* ChildProcessSpawner;
	return yield* gen(function* () {
		const child = yield* spawner.spawn(make$3(sshExecutable(), input.args, {
			env: input.env,
			extendEnv: true,
			windowsHide: true,
			killSignal: "SIGTERM",
			forceKillAfter: "2 seconds",
			stdin: input.stdin === void 0 ? "ignore" : {
				stream: make$12(isString(input.stdin) ? new TextEncoder().encode(input.stdin) : input.stdin),
				endOnDone: true
			}
		}));
		const output = yield* all({
			stdout: child.stdout.pipe(decodeText(), runFold(() => "", (tail, text) => (tail + text).slice(-1048576))),
			stderr: child.stderr.pipe(decodeText(), runFold(() => "", (tail, text) => (tail + text).slice(-16384))),
			code: child.exitCode
		}, { concurrency: "unbounded" });
		if (output.code !== 0) return yield* fail(new SshFailure("connection", commandFailureDetail(output.code, output)));
		return output.stdout;
	}).pipe(scoped, timeout(input.timeout ?? 6e5), mapError(SshFailure.from));
});
function commandFailureDetail(code, output) {
	const stdout = output.stdout.replace(/OPENCODE_SSH_REGISTRATION_BEGIN[\s\S]*?(?:OPENCODE_SSH_REGISTRATION_END|$)/g, "").trim();
	return [output.stderr.trim(), stdout].filter(Boolean).join("\n") || JSON.stringify({ exitCode: code });
}
//#endregion
//#region ../gui-plugins/src/ssh/contract.ts
var SshConfig = Struct({
	id: String$1,
	target: String$1,
	name: String$1
});
var SshHttp = Struct({
	url: String$1,
	password: String$1
});
var SshStage = Literals([
	"disconnected",
	"connecting",
	"ready",
	"authentication",
	"incompatible",
	"failed"
]);
var SshPrompt = Struct({
	id: String$1,
	text: String$1,
	confirm: Boolean$1
});
var SshError = Literals([
	"connection",
	"input",
	"platform",
	"version",
	"install",
	"service",
	"host-key",
	"ssh-missing",
	"unpublished"
]);
var SshItem = Struct({
	config: SshConfig,
	saved: Boolean$1,
	destination: optional(String$1),
	stage: SshStage,
	/** Set only while `stage` is `ready`. */
	http: optional(SshHttp),
	prompt: optional(SshPrompt),
	authenticatingElsewhere: optional(Boolean$1),
	/** A `failed` server that main reconnects by itself; without it, the server waits for the user. */
	retrying: optional(Boolean$1),
	detail: String$1,
	error: optional(SshError)
});
/** `revision` grows with every push, so a caller can wait for the state that follows its request. */
var SshState = Struct({
	servers: ArraySchema(SshItem),
	revision: Number$1
});
var SshStart = Struct({
	id: String$1,
	target: String$1,
	name: String$1,
	replace: optional(Boolean$1),
	background: optional(Boolean$1)
});
var Id = Struct({ id: String$1 });
/** SSH connections, owned by the main process. Prompts reach only the window that started the attempt. */
var Ssh = Ipc.define({
	id: "ssh",
	state: SshState,
	methods: {
		/** Resolves with the state revision that includes the admitted attempt. */
		start: {
			input: SshStart,
			output: Number$1
		},
		resolve: {
			input: Id,
			output: NullOr(SshHttp)
		},
		respond: { input: Struct({
			id: String$1,
			prompt: String$1,
			value: String$1
		}) },
		cancel: { input: Id },
		forget: { input: Id }
	}
});
//#endregion
//#region ../gui-plugins/src/ssh/askpass.ts
var Request$1 = fromJsonString(Struct({
	token: String$1,
	text: String$1,
	confirm: Boolean$1
}));
var createAskpass = fn("Ssh.askpass")(function* (input) {
	const token = randomUUID();
	const pending = /* @__PURE__ */ new Map();
	const prompts = yield* make$13(1);
	const server = yield* make$1({
		host: "127.0.0.1",
		port: 0
	}).pipe(mapError(SshFailure.from));
	if (isTagged(server.address, "UnixPathAddress")) return yield* fail(new SshFailure("connection"));
	const serving = yield* server.run((socket) => gen(function* () {
		const request = yield* make$7();
		const reader = yield* gen(function* () {
			const pull = yield* readerBytes(socket);
			const decoder = new TextDecoder();
			let buffer = "";
			while (!buffer.includes("\n")) {
				for (const chunk of yield* pull) buffer += decoder.decode(chunk, { stream: true });
				if (buffer.length > 16384) return yield* new SshFailure("connection");
			}
			yield* succeed$4(request, buffer.trim());
			yield* pull;
			return yield* new SshFailure("connection");
		}).pipe(ensuring(fail$2(request, new SshFailure("connection"))), forkScoped);
		const message = yield* _await(request).pipe(flatMap(decodeUnknownEffect(Request$1)));
		if (message.token !== token) return;
		yield* prompts.withPermit(gen(function* () {
			const id = randomUUID();
			const response = yield* make$7();
			yield* acquireRelease(sync(() => pending.set(id, response)), () => sync(() => pending.delete(id)).pipe(andThen(input.clear(id))));
			yield* input.prompt({
				id,
				text: message.text,
				confirm: message.confirm
			});
			const value = yield* _await(response);
			yield* (yield* socket.writer).write(JSON.stringify({ value }));
		}).pipe(scoped)).pipe(raceFirst(join(reader)));
	}).pipe(scoped, timeout("5 minutes"), ignore)).pipe(mapError(SshFailure.from), forkScoped({ startImmediately: true }));
	return {
		env: {
			SSH_ASKPASS: input.binary,
			SSH_ASKPASS_REQUIRE: "force",
			DISPLAY: process.env.DISPLAY || "opencode",
			OPENCODE_SSH_ASKPASS_PORT: String(server.address.port),
			OPENCODE_SSH_ASKPASS_TOKEN: token
		},
		closed: join(serving),
		respond: fn("Ssh.askpass.respond")(function* (id, value) {
			const response = pending.get(id);
			if (response) yield* succeed$4(response, value);
		})
	};
});
//#endregion
//#region ../gui-plugins/src/ssh/bootstrap.ts
var registrationScript = `status=$("$cli" service status) || exit 0
if [ "$status" = stopped ]; then exit 0; fi
printf 'OPENCODE_SSH_STATUS=%s\\n' "$status"
for file in "\${XDG_STATE_HOME:-$HOME/.local/state}"/opencode/service*.json; do
  if [ ! -f "$file" ]; then continue; fi
  printf 'OPENCODE_SSH_REGISTRATION_BEGIN\\n'
  cat "$file"
  printf '\\nOPENCODE_SSH_REGISTRATION_END\\n'
done
`;
var discoverScript = `set -eu
${discoverScript$1({
	fromPath: true,
	cache: {
		directory: ".opencode/desktop-ssh",
		prefix: "0.0.0-beta-"
	}
})}
if [ -z "$cli" ]; then exit 0; fi
${registrationScript}`;
function startScript(version, replace = false) {
	return `set -eu
cli="${binaryPath(version)}"
"$cli" service ${replace ? "restart" : "start"}
${registrationScript}`;
}
var Registration = fromJsonString(Struct({
	url: String$1,
	password: String$1,
	version: String$1,
	pid: Int.check(isGreaterThan(0))
}));
function parseRegistration(output) {
	const status = output.split(/\r?\n/).findLast((line) => line.startsWith("OPENCODE_SSH_STATUS="))?.slice(20);
	if (!status) return void 0;
	for (const match of output.matchAll(/OPENCODE_SSH_REGISTRATION_BEGIN\r?\n([\s\S]*?)\r?\nOPENCODE_SSH_REGISTRATION_END/g)) {
		const result = decodeUnknownOption(Registration)(match[1]);
		if (isSome(result) && result.value.url === status) return result.value;
	}
}
function binaryPath(version) {
	return `$HOME/.opencode/desktop-ssh/${requireVersion(version)}/opencode`;
}
function connectionAddress(address, password) {
	const url = new URL(address);
	if (url.protocol !== "http:" || ![
		"127.0.0.1",
		"localhost",
		"0.0.0.0",
		"[::]",
		"[::1]"
	].includes(url.hostname)) throw new SshFailure("service");
	return {
		host: url.hostname === "[::1]" ? "[::1]" : "127.0.0.1",
		port: Number(url.port || 80),
		password
	};
}
var bootstrap = fn("Ssh.bootstrap")(function* (input) {
	const run = (script) => runSsh({
		args: [
			...sshArgs(input.target),
			input.target.host,
			"sh -l -s"
		],
		env: input.env,
		stdin: script
	});
	const registered = parseRegistration(yield* run(discoverScript));
	if (registered && (input.development || registered.version === input.version)) return yield* try_({
		try: () => connectionAddress(registered.url, registered.password),
		catch: SshFailure.from
	});
	if (registered && !input.replace) return yield* fail(new SshFailure("version", registered.version));
	const staged = parseVersion(yield* run(versionScript(`"${yield* try_({
		try: () => binaryPath(input.version),
		catch: SshFailure.from
	})}"`))) === input.version;
	const version = input.development && !staged ? yield* latestBeta().pipe(mapError(SshFailure.from)) : input.version;
	const setup = {
		version,
		directory: `.opencode/desktop-ssh/${version}`
	};
	if (!staged) {
		const target = (yield* run(probeScript).pipe(mapError(() => new SshFailure("platform")))).split(/\r?\n/).findLast((line) => line.startsWith("OPENCODE_REMOTE_TARGET="))?.split("=")[1];
		const url = yield* try_({
			try: () => archiveUrl(target ?? "", version),
			catch: SshFailure.from
		});
		yield* run(installScript({
			...setup,
			source: {
				type: "download",
				url
			}
		})).pipe(catch_(fnUntraced(function* (error) {
			const response = yield* (yield* HttpClient).get(url).pipe(mapError(SshFailure.from));
			if (response.status < 200 || response.status >= 300) return yield* fail(new SshFailure(response.status === 404 ? "unpublished" : "install", JSON.stringify({
				version,
				target,
				url,
				status: response.status
			})));
			const archive = new Uint8Array(yield* response.arrayBuffer.pipe(mapError(SshFailure.from)));
			return yield* runSsh({
				args: [
					...sshArgs(input.target),
					input.target.host,
					`sh -c ${quote(installScript({
						...setup,
						source: { type: "archive" }
					}))}`
				],
				env: input.env,
				stdin: archive
			}).pipe(mapError(() => new SshFailure("install", error.message)));
		})));
	}
	const registration = parseRegistration(yield* run(startScript(version, input.replace)));
	if (!registration) return yield* fail(new SshFailure("service"));
	if (!input.development && registration.version !== input.version) return yield* fail(new SshFailure("version", registration.version));
	return yield* try_({
		try: () => connectionAddress(registration.url, registration.password),
		catch: SshFailure.from
	});
});
var SSH_RETRY_DELAY_MS = 3e3;
var DISCONNECTED = { status: "disconnected" };
function createSshMainState(configs) {
	return {
		status: "open",
		issued: 0,
		servers: configs.map((config) => ({
			config,
			savedConfig: config,
			phase: DISCONNECTED,
			waiters: []
		}))
	};
}
function transitionSshMain(state, event) {
	if (state.status === "closed") {
		if (event.type === "resolve.requested") return {
			state,
			effects: [resolved([event.waiter], null)]
		};
		return unchanged(state);
	}
	if (event.type === "start") return start(state, event.request, event.owner);
	if (event.type === "close") return close(state);
	if (event.type === "window.detached") return state.servers.reduce((result, server) => {
		const next = cancel(result.state, server.config.id, event.owner);
		return {
			state: next.state,
			effects: [...result.effects, ...next.effects]
		};
	}, unchanged(state));
	if (event.type === "cancel") return cancel(state, event.id, event.owner);
	const server = state.servers.find((item) => item.config.id === event.id);
	if (!server) {
		if (event.type === "resolve.requested") return {
			state,
			effects: [resolved([event.waiter], null)]
		};
		return unchanged(state);
	}
	const phase = server.phase;
	if (event.type === "forget") return {
		state: {
			...state,
			servers: state.servers.filter((item) => item !== server)
		},
		effects: [
			...halt(phase),
			...release(server.waiters),
			...server.savedConfig ? [save(state.servers.filter((item) => item !== server))] : []
		]
	};
	if (event.type === "resolve.requested") {
		if (phase.status === "ready") return {
			state: put(state, {
				...server,
				waiters: [...server.waiters, event.waiter]
			}),
			effects: [{
				type: "health.probe",
				id: event.id,
				attempt: phase.attempt,
				http: phase.http,
				waiter: event.waiter
			}]
		};
		if (isActive(phase) || phase.status === "failed" && phase.retry) return {
			state: put(state, {
				...server,
				waiters: [...server.waiters, event.waiter]
			}),
			effects: []
		};
		return {
			state,
			effects: [resolved([event.waiter], null)]
		};
	}
	if (event.type === "resolve.aborted") {
		if (!server.waiters.includes(event.waiter)) return unchanged(state);
		return {
			state: put(state, {
				...server,
				waiters: without(server.waiters, event.waiter)
			}),
			effects: []
		};
	}
	if (event.type === "health.probed") {
		if (!server.waiters.includes(event.waiter) || phase.status !== "ready") return unchanged(state);
		if (event.healthy || phase.attempt !== event.attempt) return {
			state: put(state, {
				...server,
				waiters: without(server.waiters, event.waiter)
			}),
			effects: [resolved([event.waiter], phase.http)]
		};
		const attempt = state.issued + 1;
		return {
			state: put({
				...state,
				issued: attempt
			}, {
				...server,
				phase: {
					status: "connecting",
					attempt,
					failures: 0,
					resting: { status: "disconnected" }
				}
			}),
			effects: [{
				type: "attempt.stop",
				attempt: phase.attempt
			}, {
				type: "attempt.start",
				id: event.id,
				attempt,
				config: server.config,
				replace: false
			}]
		};
	}
	if (event.type === "retry.due") {
		if (phase.status !== "failed" || phase.retry?.attempt !== event.attempt) return unchanged(state);
		const attempt = state.issued + 1;
		return {
			state: put({
				...state,
				issued: attempt
			}, {
				...server,
				phase: {
					status: "connecting",
					attempt,
					failures: phase.failures,
					resting: {
						status: "failed",
						code: phase.code,
						detail: phase.detail,
						failures: phase.failures
					}
				}
			}),
			effects: [{
				type: "attempt.start",
				id: event.id,
				attempt,
				config: server.config,
				replace: false
			}]
		};
	}
	if (event.type === "respond") {
		if (phase.status !== "authenticating" || phase.owner !== event.owner || phase.prompt.id !== event.promptID) return unchanged(state);
		return {
			state,
			effects: [{
				type: "attempt.respond",
				attempt: phase.attempt,
				promptID: event.promptID,
				value: event.value
			}]
		};
	}
	if (event.type === "attempt.failed") {
		if (!isActive(phase) && phase.status !== "ready" || phase.attempt !== event.attempt) return unchanged(state);
		return failed(state, server, event.code, event.detail, (phase.status === "ready" ? 0 : phase.failures) + 1);
	}
	if (!isActive(phase) || phase.attempt !== event.attempt) return unchanged(state);
	if (event.type === "destination.resolved") return {
		state: put(state, {
			...server,
			destination: event.destination
		}),
		effects: []
	};
	if (event.type === "prompt.received") {
		if (phase.owner === void 0) return {
			state: put(state, {
				...server,
				phase: { status: "authentication" },
				waiters: []
			}),
			effects: [{
				type: "attempt.stop",
				attempt: phase.attempt
			}, ...release(server.waiters)]
		};
		return {
			state: put(state, {
				...server,
				phase: {
					...phase,
					status: "authenticating",
					owner: phase.owner,
					prompt: event.prompt
				}
			}),
			effects: []
		};
	}
	if (event.type === "prompt.cleared") {
		if (phase.status !== "authenticating" || phase.prompt.id !== event.promptID) return unchanged(state);
		return {
			state: put(state, {
				...server,
				phase: {
					status: "connecting",
					attempt: phase.attempt,
					owner: phase.owner,
					failures: phase.failures,
					resting: phase.resting
				}
			}),
			effects: []
		};
	}
	const ready = put(state, {
		...server,
		savedConfig: server.config,
		phase: {
			status: "ready",
			attempt: phase.attempt,
			http: event.http
		},
		waiters: []
	});
	return {
		state: ready,
		effects: [save(ready.servers), ...server.waiters.length ? [resolved(server.waiters, event.http)] : []]
	};
}
/** Every window's view of the servers; a prompt reaches only the window that started its attempt. */
function selectSshServers(state, viewer) {
	return state.servers.map((server) => {
		const phase = server.phase;
		return {
			config: server.config,
			saved: !!server.savedConfig,
			destination: server.destination,
			stage: phase.status === "authenticating" ? "authentication" : phase.status,
			http: phase.status === "ready" ? phase.http : void 0,
			prompt: phase.status === "authenticating" && phase.owner === viewer ? phase.prompt : void 0,
			authenticatingElsewhere: phase.status === "authenticating" && phase.owner !== viewer,
			retrying: phase.status === "failed" && phase.retry ? true : void 0,
			detail: phase.status === "failed" || phase.status === "incompatible" ? phase.detail : "",
			error: error(phase)
		};
	});
}
function error(phase) {
	if (phase.status === "failed") return phase.code;
	if (phase.status === "incompatible") return "version";
}
/** An interactive attempt waits on its prompt; the remote service may take that long to answer. */
function selectSshAuthenticating(state, id, attempt) {
	const phase = state.servers.find((server) => server.config.id === id)?.phase;
	return phase?.status === "authenticating" && phase.attempt === attempt;
}
function start(state, request, owner) {
	const id = request.id;
	if (!/^[a-zA-Z0-9-]{1,80}$/.test(id)) return unchanged(state);
	const server = state.servers.find((item) => item.config.id === id);
	const phase = server?.phase ?? DISCONNECTED;
	if (isActive(phase) && phase.owner !== void 0 && phase.owner !== owner) return unchanged(state);
	if (request.background && (isActive(phase) || phase.status === "ready")) return unchanged(state);
	const attempt = state.issued + 1;
	const config = {
		id,
		target: request.target.trim(),
		name: request.name.trim()
	};
	return {
		state: put({
			...state,
			issued: attempt
		}, {
			config,
			savedConfig: server?.savedConfig,
			destination: server?.destination,
			phase: {
				status: "connecting",
				attempt,
				owner: request.background ? void 0 : owner,
				failures: request.background && phase.status === "failed" ? phase.failures : 0,
				resting: resting(phase)
			},
			waiters: server?.waiters ?? []
		}),
		effects: [...halt(phase), {
			type: "attempt.start",
			id,
			attempt,
			config,
			replace: !!request.replace
		}]
	};
}
function failed(state, server, reported, detail, failures) {
	const code = /REMOTE HOST IDENTIFICATION HAS CHANGED|Host key verification failed/.test(detail) ? "host-key" : /spawn .*ENOENT/.test(detail) ? "ssh-missing" : reported;
	const config = server.savedConfig ?? server.config;
	if (code === "version") return {
		state: put(state, {
			...server,
			config,
			phase: {
				status: "incompatible",
				detail
			},
			waiters: []
		}),
		effects: release(server.waiters)
	};
	if (!(!!server.savedConfig && failures < 5 && ![
		"input",
		"platform",
		"unpublished",
		"host-key",
		"ssh-missing"
	].includes(code) && !/Permission denied/.test(detail))) return {
		state: put(state, {
			...server,
			config,
			phase: {
				status: "failed",
				code,
				detail,
				failures
			},
			waiters: []
		}),
		effects: release(server.waiters)
	};
	const attempt = state.issued + 1;
	return {
		state: put({
			...state,
			issued: attempt
		}, {
			...server,
			config,
			phase: {
				status: "failed",
				code,
				detail,
				failures,
				retry: { attempt }
			}
		}),
		effects: [{
			type: "retry.schedule",
			id: server.config.id,
			attempt,
			delayMs: SSH_RETRY_DELAY_MS
		}]
	};
}
function cancel(state, id, owner) {
	const server = state.servers.find((item) => item.config.id === id);
	const phase = server?.phase;
	if (!server || !phase || !isActive(phase) || phase.owner !== owner) return unchanged(state);
	const effects = [{
		type: "attempt.stop",
		attempt: phase.attempt
	}, ...release(server.waiters)];
	if (!server.savedConfig) return {
		state: {
			...state,
			servers: state.servers.filter((item) => item !== server)
		},
		effects
	};
	return {
		state: put(state, {
			...server,
			config: server.savedConfig,
			phase: phase.resting,
			waiters: []
		}),
		effects
	};
}
function close(state) {
	return {
		state: {
			...state,
			status: "closed",
			servers: state.servers.map((server) => ({
				...server,
				phase: DISCONNECTED,
				waiters: []
			}))
		},
		effects: [...state.servers.flatMap((server) => halt(server.phase)), ...release(state.servers.flatMap((server) => server.waiters))]
	};
}
function resting(phase) {
	if (isActive(phase)) return phase.resting;
	if (phase.status === "authentication") return phase;
	if (phase.status === "incompatible") return {
		status: "incompatible",
		detail: phase.detail
	};
	if (phase.status === "failed") return {
		status: "failed",
		code: phase.code,
		detail: phase.detail,
		failures: phase.failures
	};
	return { status: "disconnected" };
}
/** Stops whatever runs for the server: its connect, its tunnel, or its scheduled retry. */
function halt(phase) {
	if (isActive(phase) || phase.status === "ready") return [{
		type: "attempt.stop",
		attempt: phase.attempt
	}];
	if (phase.status === "failed" && phase.retry) return [{
		type: "retry.cancel",
		attempt: phase.retry.attempt
	}];
	return [];
}
function isActive(phase) {
	return phase.status === "connecting" || phase.status === "authenticating";
}
function put(state, server) {
	const found = state.servers.some((item) => item.config.id === server.config.id);
	return {
		...state,
		servers: found ? state.servers.map((item) => item.config.id === server.config.id ? server : item) : [...state.servers, server]
	};
}
function save(servers) {
	return {
		type: "configs.save",
		configs: servers.flatMap((server) => server.savedConfig ? [server.savedConfig] : [])
	};
}
function release(waiters) {
	return waiters.length ? [resolved(waiters, null)] : [];
}
function resolved(waiters, http) {
	return {
		type: "waiters.resolve",
		waiters,
		http
	};
}
function without(waiters, waiter) {
	return waiters.filter((item) => item !== waiter);
}
function unchanged(state) {
	return {
		state,
		effects: []
	};
}
//#endregion
//#region ../gui-plugins/src/ssh/controller.ts
/** Runs the SSH machine's effects and reports their outcomes back to it; the machine alone decides what is current. */
var createSshController = fn("Ssh.controller")(function* (input) {
	const fs = yield* FileSystem;
	const path = yield* Path;
	const spawner = yield* ChildProcessSpawner;
	const httpClient = yield* HttpClient;
	const parent = yield* Scope;
	const lifetime = yield* fork(parent);
	const changed = yield* unbounded();
	yield* addFinalizer$1(lifetime, shutdown(changed));
	const current = { machine: createSshMainState(input.configs) };
	const connections = /* @__PURE__ */ new Map();
	const responders = /* @__PURE__ */ new Map();
	const timers = /* @__PURE__ */ new Map();
	const waiters = /* @__PURE__ */ new Map();
	const issued = { waiter: 0 };
	const dispatch = (event) => suspend(() => {
		const transition = transitionSshMain(current.machine, event);
		const updated = transition.state !== current.machine;
		current.machine = transition.state;
		return forEach(transition.effects, run, { discard: true }).pipe(andThen(updated ? publish(changed, void 0) : void_), asVoid);
	}).pipe(uninterruptible);
	const run = (effect) => {
		if (effect.type === "attempt.start") return startAttempt(effect);
		if (effect.type === "attempt.stop") {
			const connection = connections.get(effect.attempt);
			return connection ? interrupt$1(connection.fiber).pipe(forkIn(lifetime), asVoid) : void_;
		}
		if (effect.type === "attempt.respond") return responders.get(effect.attempt)?.(effect.promptID, effect.value) ?? void_;
		if (effect.type === "retry.schedule") return sleep(effect.delayMs).pipe(andThen(dispatch({
			type: "retry.due",
			id: effect.id,
			attempt: effect.attempt
		})), ensuring(sync(() => timers.delete(effect.attempt))), forkIn(lifetime), map((fiber) => void timers.set(effect.attempt, fiber)));
		if (effect.type === "retry.cancel") {
			const timer = timers.get(effect.attempt);
			return timer ? interrupt$1(timer).pipe(asVoid) : void_;
		}
		if (effect.type === "health.probe") return checkHealth(effect.http).pipe(provideService(HttpClient, httpClient), flatMap((healthy) => dispatch({
			type: "health.probed",
			id: effect.id,
			attempt: effect.attempt,
			waiter: effect.waiter,
			healthy
		})), forkIn(lifetime), asVoid);
		if (effect.type === "waiters.resolve") return forEach(effect.waiters, (id) => {
			const waiter = waiters.get(id);
			waiters.delete(id);
			return waiter ? succeed$4(waiter, effect.http) : void_;
		}, { discard: true });
		return input.save(effect.configs).pipe(catch_((error) => logError("Failed to save SSH servers", error)));
	};
	const startAttempt = fnUntraced(function* (effect) {
		const previous = [...connections.values()].filter((connection) => connection.id === effect.id);
		const fiber = yield* forEach(previous, (connection) => interrupt$1(connection.fiber), { discard: true }).pipe(andThen(connect(effect.config, effect.attempt, effect.replace)), catchCause((cause) => {
			if (hasInterruptsOnly(cause)) return void_;
			const failure = SshFailure.from(squash(cause));
			return dispatch({
				type: "attempt.failed",
				id: effect.id,
				attempt: effect.attempt,
				code: failure.code,
				detail: failure.message
			});
		}), ensuring(sync(() => connections.delete(effect.attempt))), forkIn(lifetime, { uninterruptible: false }));
		connections.set(effect.attempt, {
			id: effect.id,
			fiber
		});
	});
	const exec = (options) => runSsh(options).pipe(provideService(ChildProcessSpawner, spawner));
	const connect = fn("Ssh.connect")(function* (config, attempt, replace) {
		const id = config.id;
		const target = yield* try_({
			try: () => parseTarget(config.target),
			catch: SshFailure.from
		});
		const directory = yield* fs.makeTempDirectoryScoped({ prefix: "oc-ssh-" });
		const control = path.join(directory, "s");
		const helper = input.command && input.command.length > 1 && process.platform !== "win32" ? path.join(directory, "askpass") : input.binary;
		if (helper !== input.binary) yield* fs.writeFileString(helper, `#!/bin/sh\nexec ${input.command?.map(quote).join(" ")} "$@"\n`, { mode: 448 });
		if (process.platform !== "win32") {
			target.args.unshift("-o", "ControlMaster=auto", "-o", "ControlPersist=60", "-o", `ControlPath=${control}`);
			yield* addFinalizer(() => exec({
				args: [
					"-o",
					`ControlPath=${control}`,
					"-O",
					"exit",
					target.host
				],
				timeout: 2e3
			}).pipe(ignore));
		}
		const askpass = yield* createAskpass({
			binary: helper,
			prompt: (prompt) => dispatch({
				type: "prompt.received",
				id,
				attempt,
				prompt
			}),
			clear: (promptID) => dispatch({
				type: "prompt.cleared",
				id,
				attempt,
				promptID
			})
		});
		responders.set(attempt, askpass.respond);
		yield* addFinalizer(() => sync(() => responders.delete(attempt)));
		yield* gen(function* () {
			const resolved = yield* exec({
				args: [
					...sshArgs(target),
					"-G",
					target.host
				],
				timeout: 1e4
			}).pipe(orElseSucceed(() => ""));
			const fields = new Map(resolved.split(/\r?\n/).map((line) => {
				const separator = line.indexOf(" ");
				return [line.slice(0, separator), line.slice(separator + 1)];
			}));
			if (fields.has("hostname")) yield* dispatch({
				type: "destination.resolved",
				id,
				attempt,
				destination: `${fields.get("user") ?? ""}@${fields.get("hostname")}:${fields.get("port") ?? "22"}`
			});
			const remote = yield* bootstrap({
				target,
				version: input.version,
				development: input.development,
				env: askpass.env,
				replace
			}).pipe(provideService(ChildProcessSpawner, spawner), provideService(HttpClient, httpClient));
			const port = yield* freePort;
			const http = {
				url: `http://127.0.0.1:${port}`,
				password: remote.password
			};
			const tunnel = yield* spawner.spawn(make$3(sshExecutable(), tunnelArgs(target, port, remote), {
				env: askpass.env,
				extendEnv: true,
				windowsHide: true,
				stdin: "pipe",
				stdout: "ignore",
				killSignal: "SIGTERM",
				forceKillAfter: "2 seconds"
			}));
			const detail = yield* make$14("");
			const stderr = yield* tunnel.stderr.pipe(decodeText(), runForEach((text) => update(detail, (tail) => (tail + text).slice(-8192))), forkScoped);
			const closed = gen(function* () {
				const exitCode = yield* tunnel.exitCode;
				yield* join(stderr);
				return yield* fail(new SshFailure("connection", (yield* get$1(detail)) || JSON.stringify({ exitCode })));
			});
			yield* waitReady(http, () => selectSshAuthenticating(current.machine, id, attempt)).pipe(provideService(HttpClient, httpClient), catch_(() => get$1(detail).pipe(flatMap((detail) => fail(new SshFailure("service", detail))))), raceFirst(closed));
			yield* dispatch({
				type: "attempt.ready",
				id,
				attempt,
				http
			});
			yield* closed;
		}).pipe(raceFirst(askpass.closed));
	}, scoped);
	const close = dispatch({ type: "close" }).pipe(andThen(suspend(() => forEach([...connections.values()], (connection) => interrupt$1(connection.fiber), {
		concurrency: "unbounded",
		discard: true
	}))), andThen(close$1(lifetime, void_$1)));
	yield* addFinalizer(() => close);
	const state = (owner) => sync(() => ({ servers: selectSshServers(current.machine, owner) }));
	return {
		state,
		changes: (owner) => fromPubSub(changed).pipe(mapEffect(() => state(owner))),
		start: (request, owner) => dispatch({
			type: "start",
			request,
			owner
		}),
		/** Waits until the server is ready, or until main stops reconnecting it by itself (`null`). */
		resolve: fn("Ssh.resolve")(function* (id) {
			const waiter = ++issued.waiter;
			const deferred = yield* make$7();
			waiters.set(waiter, deferred);
			yield* dispatch({
				type: "resolve.requested",
				id,
				waiter
			});
			return yield* _await(deferred).pipe(onInterrupt(() => sync(() => waiters.delete(waiter)).pipe(andThen(dispatch({
				type: "resolve.aborted",
				id,
				waiter
			})))));
		}),
		respond: (id, prompt, value, owner) => dispatch({
			type: "respond",
			id,
			promptID: prompt,
			value,
			owner
		}),
		cancel: (id, owner) => dispatch({
			type: "cancel",
			id,
			owner
		}),
		forget: (id) => dispatch({
			type: "forget",
			id
		}),
		detach: (owner) => dispatch({
			type: "window.detached",
			owner
		}),
		close
	};
});
var freePort = gen(function* () {
	const server = yield* make$1({
		host: "127.0.0.1",
		port: 0
	});
	if (isTagged(server.address, "UnixPathAddress")) return yield* fail(new SshFailure("connection"));
	return server.address.port;
}).pipe(scoped);
var waitReady = fn("Ssh.waitReady")(function* (http, authenticating) {
	const clock = { deadline: (yield* currentTimeMillis) + 3e4 };
	yield* gen(function* () {
		const now = yield* currentTimeMillis;
		if (authenticating()) clock.deadline = now + 3e4;
		if (now >= clock.deadline) return yield* fail(new SshFailure("service"));
		return yield* checkHealth(http);
	}).pipe(repeat({
		until: (ready) => ready,
		schedule: spaced(100)
	}));
});
var checkHealth = fn("Ssh.checkHealth")(function* (http) {
	return yield* (yield* HttpClient).get(`${http.url}/api/info`, { headers: { authorization: `Basic ${Buffer.from(`opencode:${http.password}`).toString("base64")}` } }).pipe(timeout(2e3), map((response) => response.status >= 200 && response.status < 300), orElseSucceed(() => false));
});
//#endregion
//#region ../gui-plugins/src/ssh/main.ts
var setup = async (ctx) => {
	const cli = ctx.cli;
	const saved = builtinMainContext(ctx).storage.store("servers", {
		schema: ArraySchema(SshConfig),
		initial: [],
		from: { settings: "ssh.servers" }
	});
	const runtime = make$15(mergeAll(layer, layer$6));
	ctx.onCleanup(() => runtime.dispose());
	const scope = await runtime.runPromise(make$6());
	ctx.onCleanup(() => runtime.runPromise(close$1(scope, void_$1)));
	if (ctx.signal.aborted) return;
	const controller = await runtime.runPromise(createSshController({
		version: cli.version,
		development: cli.development,
		binary: cli.binary ?? cli.command[0] ?? "opencode",
		command: cli.command,
		configs: saved.value,
		save: (configs) => try_({
			try: () => saved.set(configs),
			catch: SshFailure.from
		})
	}).pipe(provide(scope)));
	ctx.onCleanup(() => runtime.runPromise(controller.close));
	if (ctx.signal.aborted) return;
	const status = { revision: 0 };
	const provider = ctx.provide(Ssh, {
		state: (window) => ({
			...runtime.runSync(controller.state(window)),
			revision: status.revision
		}),
		start: async (input, caller) => {
			await runtime.runPromise(controller.start(input, input.background ? void 0 : caller.window));
			return push();
		},
		resolve: (input, caller) => runtime.runPromise(controller.resolve(input.id), { signal: caller.signal }),
		respond: (input, caller) => runtime.runPromise(controller.respond(input.id, input.prompt, input.value, caller.window)),
		cancel: (input, caller) => runtime.runPromise(controller.cancel(input.id, caller.window)),
		forget: (input) => runtime.runPromise(controller.forget(input.id).pipe(orDie))
	});
	function push() {
		status.revision++;
		provider.changed();
		return status.revision;
	}
	const changes = runtime.runFork(controller.changes().pipe(runForEach(() => sync(push))));
	ctx.onCleanup(() => runtime.runPromise(interrupt$1(changes)));
	ctx.windows.on("close", (win) => void runtime.runPromise(controller.detach(win.id)));
};
//#endregion
export { setup as default };
