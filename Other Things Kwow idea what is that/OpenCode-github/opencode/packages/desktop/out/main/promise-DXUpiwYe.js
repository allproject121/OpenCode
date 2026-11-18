import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.js";
import { t as make$2 } from "./shared-events-CZzWYkyV.js";
//#region ../client/src/promise/generated/client-error.ts
var ClientError = class extends Error {
	reason;
	name = "ClientError";
	constructor(reason, options) {
		const detail = options?.detail ?? (options?.cause instanceof Error ? options.cause.message : void 0);
		super(detail ? `${reason}: ${detail}` : reason, options);
		this.reason = reason;
	}
};
//#endregion
//#region ../client/src/promise/generated/client.ts
var maxSseEventBytes = 16777216;
function make$1(options) {
	const fetch = options.fetch ?? globalThis.fetch;
	const prepare = (descriptor, requestOptions) => {
		const baseUrl = new URL(options.baseUrl);
		if (!baseUrl.pathname.endsWith("/")) baseUrl.pathname += "/";
		const url = new URL(descriptor.path.slice(1), baseUrl);
		for (const [key, value] of Object.entries(descriptor.query ?? {})) appendQuery(url.searchParams, key, value);
		const headers = new Headers(options.headers);
		for (const [key, value] of Object.entries(descriptor.headers ?? {})) if (value !== void 0 && value !== null) headers.set(key, String(value));
		for (const [key, value] of new Headers(requestOptions?.headers)) headers.set(key, value);
		if (descriptor.body !== void 0 && !headers.has("content-type")) headers.set("content-type", descriptor.binaryBody ? "application/octet-stream" : "application/json");
		return {
			url,
			init: {
				method: descriptor.method,
				signal: requestOptions?.signal,
				headers,
				body: descriptor.body === void 0 ? void 0 : descriptor.binaryBody ? descriptor.body : JSON.stringify(descriptor.body)
			}
		};
	};
	const execute = async (descriptor, requestOptions) => {
		try {
			const prepared = prepare(descriptor, requestOptions);
			return await fetch(prepared.url, prepared.init);
		} catch (cause) {
			throw new ClientError("Transport", { cause });
		}
	};
	const responseError = async (response, descriptor) => {
		if (descriptor.declaredStatuses.includes(response.status)) throw declared(await json(response));
		try {
			await response.body?.cancel();
		} catch {}
		throw new ClientError("UnexpectedStatus", {
			cause: { status: response.status },
			detail: String(response.status)
		});
	};
	const request = async (descriptor, requestOptions) => {
		const response = await execute(descriptor, requestOptions);
		if (response.status !== descriptor.successStatus) return responseError(response, descriptor);
		if (descriptor.binary) return new Uint8Array(await response.arrayBuffer());
		if (descriptor.empty) {
			try {
				await response.body?.cancel();
			} catch {}
			return;
		}
		return await json(response);
	};
	const sse = (descriptor, requestOptions) => ({ async *[Symbol.asyncIterator]() {
		const response = await execute(descriptor, requestOptions);
		if (response.status !== descriptor.successStatus) await responseError(response, descriptor);
		if (!isContentType(response, "text/event-stream")) {
			try {
				await response.body?.cancel();
			} catch {}
			throw new ClientError("UnsupportedContentType", { detail: response.headers.get("content-type") });
		}
		if (response.body === null) throw new ClientError("MalformedResponse");
		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = "";
		try {
			while (true) {
				let next;
				try {
					next = await reader.read();
				} catch (cause) {
					throw new ClientError("Transport", { cause });
				}
				if (!next.done) requestOptions?.onActivity?.();
				buffer += decoder.decode(next.value, { stream: !next.done });
				if (buffer.length > maxSseEventBytes) throw new ClientError("SseEventTooLarge");
				const trailingCarriageReturn = !next.done && buffer.endsWith("\r");
				if (trailingCarriageReturn) buffer = buffer.slice(0, -1);
				buffer = buffer.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
				if (trailingCarriageReturn) buffer += "\r";
				if (next.done && buffer !== "") buffer += "\n\n";
				let boundary = buffer.indexOf("\n\n");
				while (boundary >= 0) {
					const block = buffer.slice(0, boundary);
					buffer = buffer.slice(boundary + 2);
					const data = block.split("\n").flatMap((line) => line.startsWith("data:") ? [line.slice(5).trimStart()] : []).join("\n");
					if (data !== "") try {
						yield JSON.parse(data);
					} catch (cause) {
						throw new ClientError("MalformedResponse", { cause });
					}
					boundary = buffer.indexOf("\n\n");
				}
				if (next.done) return;
			}
		} finally {
			try {
				await reader.cancel();
			} catch {}
			reader.releaseLock();
		}
	} });
	const client = {
		server: {
			info: (requestOptions) => request({
				method: "GET",
				path: `/api/info`,
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions),
			pair: (requestOptions) => request({
				method: "POST",
				path: `/api/pair`,
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions),
			connect: (input, requestOptions) => request({
				method: "GET",
				path: `/auth/connect/${encodeURIComponent(input.code)}`,
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions)
		},
		location: {
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/location`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			reload: (requestOptions) => request({
				method: "POST",
				path: `/api/location/reload`,
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					503
				],
				empty: true
			}, requestOptions)
		},
		agent: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/agent`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/agent/${encodeURIComponent(input.agentID)}`,
				query: { location: input["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions)
		},
		plugin: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/plugin`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			gui: (input, requestOptions) => request({
				method: "GET",
				path: `/api/plugin/gui`,
				query: {
					location: input["location"],
					id: input["id"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			check: (input, requestOptions) => request({
				method: "POST",
				path: `/api/plugin/check`,
				query: { location: input?.["location"] },
				body: { target: input?.["target"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			update: (input, requestOptions) => request({
				method: "POST",
				path: `/api/plugin/update`,
				query: { location: input["location"] },
				body: { targets: input["targets"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: true
			}, requestOptions)
		},
		session: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/session`,
				query: {
					limit: input?.["limit"],
					order: input?.["order"],
					search: input?.["search"],
					parentID: input?.["parentID"],
					archived: input?.["archived"],
					directory: input?.["directory"],
					project: input?.["project"],
					subpath: input?.["subpath"],
					cursor: input?.["cursor"]
				},
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions),
			create: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session`,
				body: {
					id: input?.["id"],
					parentID: input?.["parentID"],
					title: input?.["title"],
					agent: input?.["agent"],
					model: input?.["model"],
					location: input?.["location"],
					metadata: input?.["metadata"],
					permissions: input?.["permissions"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			active: (requestOptions) => request({
				method: "GET",
				path: `/api/session/active`,
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions).then((value) => value.data),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/session/${encodeURIComponent(input.sessionID)}`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			remove: (input, requestOptions) => request({
				method: "DELETE",
				path: `/api/session/${encodeURIComponent(input.sessionID)}`,
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			fork: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/fork`,
				body: { before: input["before"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			switchAgent: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/agent`,
				body: { agent: input["agent"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			switchModel: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/model`,
				body: { model: input["model"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			update: (input, requestOptions) => request({
				method: "PATCH",
				path: `/api/session/${encodeURIComponent(input.sessionID)}`,
				body: {
					title: input["title"],
					metadata: input["metadata"],
					permissions: input["permissions"],
					archived: input["archived"]
				},
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			move: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/move`,
				body: {
					directory: input["directory"],
					delivery: input["delivery"]
				},
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			prompt: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/prompt`,
				body: {
					id: input["id"],
					text: input["text"],
					files: input["files"],
					agents: input["agents"],
					skills: input["skills"],
					metadata: input["metadata"],
					delivery: input["delivery"],
					resume: input["resume"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					409
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			command: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/command`,
				body: {
					name: input["name"],
					text: input["text"],
					files: input["files"],
					agents: input["agents"],
					skills: input["skills"],
					delivery: input["delivery"]
				},
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404,
					500
				],
				empty: true
			}, requestOptions),
			synthetic: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/synthetic`,
				body: {
					id: input["id"],
					text: input["text"],
					description: input["description"],
					metadata: input["metadata"],
					delivery: input["delivery"],
					resume: input["resume"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					409
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			shell: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/shell`,
				body: {
					id: input["id"],
					command: input["command"]
				},
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			compact: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/compact`,
				body: {
					id: input["id"],
					delivery: input["delivery"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					409
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			revert: {
				stage: (input, requestOptions) => request({
					method: "POST",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/revert/stage`,
					body: {
						messageID: input["messageID"],
						files: input["files"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						409,
						500
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				clear: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/revert`,
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						409,
						500
					],
					empty: true
				}, requestOptions),
				commit: (input, requestOptions) => request({
					method: "POST",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/revert/commit`,
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						409
					],
					empty: true
				}, requestOptions)
			},
			context: (input, requestOptions) => request({
				method: "GET",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/context`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					500
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			diff: (input, requestOptions) => request({
				method: "GET",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/diff`,
				query: {
					from: input["from"],
					to: input["to"],
					context: input["context"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					500
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			inbox: {
				list: (input, requestOptions) => request({
					method: "GET",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/inbox`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				cancel: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/inbox/${encodeURIComponent(input.inboxID)}`,
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				update: (input, requestOptions) => request({
					method: "PATCH",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/inbox/${encodeURIComponent(input.inboxID)}`,
					body: { delivery: input["delivery"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						409
					],
					empty: true
				}, requestOptions)
			},
			generate: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/generate`,
				body: { prompt: input["prompt"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			interrupt: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/interrupt`,
				query: { resume: input["resume"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			background: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/background`,
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			message: { get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/message/${encodeURIComponent(input.messageID)}`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data) },
			form: {
				list: (input, requestOptions) => request({
					method: "GET",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/form`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				create: (input, requestOptions) => request({
					method: "POST",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/form`,
					body: {
						id: input["id"],
						title: input["title"],
						metadata: input["metadata"],
						fields: input["fields"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						409
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				get: (input, requestOptions) => request({
					method: "GET",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/form/${encodeURIComponent(input.formID)}`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				reply: (input, requestOptions) => request({
					method: "POST",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/form/${encodeURIComponent(input.formID)}/reply`,
					body: { answer: input["answer"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						409
					],
					empty: true
				}, requestOptions),
				cancel: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/session/${encodeURIComponent(input.sessionID)}/form/${encodeURIComponent(input.formID)}`,
					query: { message: input["message"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						409
					],
					empty: true
				}, requestOptions)
			},
			environment: (input, requestOptions) => request({
				method: "PUT",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/environment`,
				body: { variables: input["variables"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			view: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/view`,
				body: { idle: input["idle"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions)
		},
		experimental: {
			session: {
				stats: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/session/stats`,
					query: {
						from: input?.["from"],
						to: input?.["to"],
						project: input?.["project"],
						timezone: input?.["timezone"],
						tools: input?.["tools"]
					},
					successStatus: 200,
					declaredStatuses: [400, 401],
					empty: false
				}, requestOptions).then((value) => value.data),
				import: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/session/import`,
					body: {
						info: input["info"],
						messages: input["messages"],
						location: input["location"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						409
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				export: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/export`,
					query: { sanitize: input["sanitize"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						500
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				skill: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/skill`,
					body: {
						id: input["id"],
						resume: input["resume"]
					},
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				wait: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/wait`,
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						503
					],
					empty: true
				}, requestOptions),
				instructions: { entry: {
					list: (input, requestOptions) => request({
						method: "GET",
						path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/instructions/entries`,
						successStatus: 200,
						declaredStatuses: [
							400,
							401,
							404
						],
						empty: false
					}, requestOptions).then((value) => value.data),
					put: (input, requestOptions) => request({
						method: "PUT",
						path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/instructions/entries/${encodeURIComponent(input.key)}`,
						body: { value: input["value"] },
						successStatus: 204,
						declaredStatuses: [
							400,
							401,
							404,
							413
						],
						empty: true
					}, requestOptions),
					remove: (input, requestOptions) => request({
						method: "DELETE",
						path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/instructions/entries/${encodeURIComponent(input.key)}`,
						successStatus: 204,
						declaredStatuses: [
							400,
							401,
							404
						],
						empty: true
					}, requestOptions)
				} },
				log: (input, requestOptions) => sse({
					method: "GET",
					path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/log`,
					query: {
						after: input["after"],
						follow: input["follow"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions)
			},
			generate: {
				text: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/generate/text`,
					body: {
						prompt: input["prompt"],
						model: input["model"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						422,
						502,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				image: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/generate/image`,
					body: {
						model: input["model"],
						prompt: input["prompt"],
						images: input["images"],
						n: input["n"],
						aspect: input["aspect"],
						resolution: input["resolution"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						422,
						502,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				video: {
					create: (input, requestOptions) => request({
						method: "POST",
						path: `/api/experimental/generate/video`,
						body: {
							model: input["model"],
							prompt: input["prompt"],
							start: input["start"],
							end: input["end"],
							references: input["references"],
							duration: input["duration"],
							aspect: input["aspect"],
							resolution: input["resolution"],
							sound: input["sound"]
						},
						successStatus: 200,
						declaredStatuses: [
							400,
							401,
							403,
							404,
							422,
							502,
							503
						],
						empty: false
					}, requestOptions).then((value) => value.data),
					get: (input, requestOptions) => request({
						method: "GET",
						path: `/api/experimental/generate/video/${encodeURIComponent(input.id)}`,
						successStatus: 200,
						declaredStatuses: [
							400,
							401,
							403,
							404
						],
						empty: false
					}, requestOptions).then((value) => value.data)
				},
				decisions: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/generate/decisions`,
					body: {
						model: input["model"],
						input: input["input"],
						questions: input["questions"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						422,
						502,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data)
			},
			voice: {
				models: (requestOptions) => request({
					method: "GET",
					path: `/api/experimental/voice/models`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				session: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/voice/session`,
					body: {
						model: input["model"],
						session: input["session"],
						transport: input["transport"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data)
			},
			integration: { wellknown: { add: (input, requestOptions) => request({
				method: "POST",
				path: `/api/experimental/integration/wellknown`,
				query: { location: input["location"] },
				body: { url: input["url"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions) } },
			mcp: {
				add: (input, requestOptions) => request({
					method: "PUT",
					path: `/api/experimental/mcp/${encodeURIComponent(input.server)}`,
					query: { location: input["location"] },
					body: { config: input["config"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				remove: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/experimental/mcp/${encodeURIComponent(input.server)}`,
					query: { location: input["location"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				connect: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/mcp/${encodeURIComponent(input.server)}/connect`,
					query: { location: input["location"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				disconnect: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/mcp/${encodeURIComponent(input.server)}/disconnect`,
					query: { location: input["location"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				client: { token: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/client-mcp/token`,
					query: {
						location: input["location"],
						name: input["name"]
					},
					headers: { "x-opencode-ticket": input["x-opencode-ticket"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404
					],
					empty: false
				}, requestOptions) }
			},
			file: {
				write: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/fs/write`,
					query: {
						location: input["location"],
						path: input["path"]
					},
					body: input["payload"],
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false,
					binaryBody: true
				}, requestOptions),
				watch: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/fs/watch`,
					query: { location: input["location"] },
					body: { path: input["path"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						503
					],
					empty: true
				}, requestOptions),
				unwatch: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/experimental/fs/watch`,
					query: { location: input["location"] },
					body: { path: input["path"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions)
			},
			persistentPty: {
				read: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/terminal/read`,
					query: { lines: input["lines"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				list: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/terminal`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				create: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/terminal`,
					body: {
						command: input["command"],
						args: input["args"],
						cwd: input["cwd"],
						title: input["title"],
						env: input["env"],
						size: input["size"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				shutdown: (requestOptions) => request({
					method: "POST",
					path: `/api/experimental/persistent-pty/shutdown`,
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						503
					],
					empty: true
				}, requestOptions),
				handoff: (requestOptions) => request({
					method: "POST",
					path: `/api/experimental/persistent-pty/handoff`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						503
					],
					empty: false
				}, requestOptions),
				get: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				update: (input, requestOptions) => request({
					method: "PUT",
					path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}`,
					body: {
						attachmentID: input["attachmentID"],
						size: input["size"],
						title: input["title"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						501,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				snapshot: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}/snapshot`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				remove: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}`,
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404,
						503
					],
					empty: true
				}, requestOptions),
				connectToken: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}/connect-token`,
					headers: { "x-opencode-ticket": input["x-opencode-ticket"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: false
				}, requestOptions).then((value) => value.data)
			},
			media: { get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/experimental/media/${encodeURIComponent(input.hash)}`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false,
				binary: true
			}, requestOptions) },
			blob: { get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/experimental/blob/${encodeURIComponent(input.id)}`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false,
				binary: true
			}, requestOptions) },
			automation: {
				create: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/automation`,
					body: {
						sessionID: input["sessionID"],
						directory: input["directory"],
						name: input["name"],
						trigger: input["trigger"],
						action: input["action"],
						expires: input["expires"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				list: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/automation`,
					query: {
						sessionID: input?.["sessionID"],
						directory: input?.["directory"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				get: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/automation/${encodeURIComponent(input.automationID)}`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				pause: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/automation/${encodeURIComponent(input.automationID)}/pause`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				resume: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/automation/${encodeURIComponent(input.automationID)}/resume`,
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				delete: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/experimental/automation/${encodeURIComponent(input.automationID)}`,
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						403,
						404
					],
					empty: true
				}, requestOptions)
			},
			artifacts: {
				providers: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/artifacts/providers`,
					query: { location: input?.["location"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: false
				}, requestOptions),
				list: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/artifacts`,
					query: {
						location: input?.["location"],
						sessionID: input?.["sessionID"],
						provider: input?.["provider"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: false
				}, requestOptions),
				create: (input, requestOptions) => request({
					method: "POST",
					path: `/api/experimental/artifacts`,
					query: { location: input["location"] },
					body: {
						title: input["title"],
						files: input["files"],
						entry: input["entry"],
						provider: input["provider"],
						sessionID: input["sessionID"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: false
				}, requestOptions),
				get: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}`,
					query: { location: input["location"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: false
				}, requestOptions),
				update: (input, requestOptions) => request({
					method: "PATCH",
					path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}`,
					query: { location: input["location"] },
					body: {
						title: input["title"],
						files: input["files"],
						entry: input["entry"],
						sessionID: input["sessionID"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: false
				}, requestOptions),
				delete: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}`,
					query: { location: input["location"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: true
				}, requestOptions),
				view: (input, requestOptions) => request({
					method: "GET",
					path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}/view/${encodePath(input.path)}`,
					query: { location: input["location"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						403,
						404,
						503
					],
					empty: false,
					binary: true
				}, requestOptions)
			},
			job: { list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/experimental/job`,
				query: {
					sessionID: input?.["sessionID"],
					kind: input?.["kind"],
					status: input?.["status"],
					descendants: input?.["descendants"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data) },
			migration: { v1: { status: (requestOptions) => request({
				method: "GET",
				path: `/api/experimental/migration/v1`,
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions) } },
			usage: { limits: (input, requestOptions) => request({
				method: "GET",
				path: `/api/experimental/usage/limits`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions) },
			config: { update: (input, requestOptions) => request({
				method: "PATCH",
				path: `/api/experimental/config`,
				body: { shell: input["shell"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions) }
		},
		message: { list: (input, requestOptions) => request({
			method: "GET",
			path: `/api/session/${encodeURIComponent(input.sessionID)}/message`,
			query: {
				limit: input["limit"],
				order: input["order"],
				cursor: input["cursor"],
				type: input["type"]
			},
			successStatus: 200,
			declaredStatuses: [
				400,
				401,
				404,
				500
			],
			empty: false
		}, requestOptions) },
		model: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/model`,
				query: {
					location: input?.["location"],
					types: input?.["types"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions),
			default: (input, requestOptions) => request({
				method: "GET",
				path: `/api/model/default`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions)
		},
		provider: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/provider`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/provider/${encodeURIComponent(input.providerID)}`,
				query: { location: input["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions)
		},
		integration: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/integration`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/integration/${encodeURIComponent(input.integrationID)}`,
				query: { location: input["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			connect: {
				key: (input, requestOptions) => request({
					method: "POST",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/key`,
					query: { location: input["location"] },
					body: {
						key: input["key"],
						answer: input["answer"],
						label: input["label"]
					},
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				external: (input, requestOptions) => request({
					method: "POST",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/external`,
					query: { location: input["location"] },
					body: {
						methodID: input["methodID"],
						answer: input["answer"],
						label: input["label"]
					},
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions)
			},
			oauth: {
				connect: (input, requestOptions) => request({
					method: "POST",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth`,
					query: { location: input["location"] },
					body: {
						methodID: input["methodID"],
						answer: input["answer"],
						label: input["label"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions),
				status: (input, requestOptions) => request({
					method: "GET",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth/${encodeURIComponent(input.attemptID)}`,
					query: { location: input["location"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions),
				complete: (input, requestOptions) => request({
					method: "POST",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth/${encodeURIComponent(input.attemptID)}/complete`,
					query: { location: input["location"] },
					body: { code: input["code"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions),
				cancel: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth/${encodeURIComponent(input.attemptID)}`,
					query: { location: input["location"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions)
			},
			command: {
				connect: (input, requestOptions) => request({
					method: "POST",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/command`,
					query: { location: input["location"] },
					body: {
						methodID: input["methodID"],
						label: input["label"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions),
				status: (input, requestOptions) => request({
					method: "GET",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/command/${encodeURIComponent(input.attemptID)}`,
					query: { location: input["location"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions),
				cancel: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/command/${encodeURIComponent(input.attemptID)}`,
					query: { location: input["location"] },
					successStatus: 204,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: true
				}, requestOptions)
			}
		},
		mcp: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/mcp`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			resource: { catalog: (input, requestOptions) => request({
				method: "GET",
				path: `/api/mcp/resource`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions) }
		},
		credential: {
			list: (requestOptions) => request({
				method: "GET",
				path: `/api/credential`,
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions).then((value) => value.data),
			create: (input, requestOptions) => request({
				method: "POST",
				path: `/api/credential`,
				body: {
					id: input["id"],
					integrationID: input["integrationID"],
					label: input["label"],
					value: input["value"],
					activate: input["activate"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					409
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			update: (input, requestOptions) => request({
				method: "PATCH",
				path: `/api/credential/${encodeURIComponent(input.credentialID)}`,
				body: { label: input["label"] },
				successStatus: 204,
				declaredStatuses: [400, 401],
				empty: true
			}, requestOptions),
			activate: (input, requestOptions) => request({
				method: "POST",
				path: `/api/credential/${encodeURIComponent(input.credentialID)}/activate`,
				successStatus: 204,
				declaredStatuses: [400, 401],
				empty: true
			}, requestOptions),
			remove: (input, requestOptions) => request({
				method: "DELETE",
				path: `/api/credential/${encodeURIComponent(input.credentialID)}`,
				successStatus: 204,
				declaredStatuses: [400, 401],
				empty: true
			}, requestOptions)
		},
		project: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/project`,
				query: { archived: input?.["archived"] },
				successStatus: 200,
				declaredStatuses: [400, 401],
				empty: false
			}, requestOptions),
			update: (input, requestOptions) => request({
				method: "PATCH",
				path: `/api/project/${encodeURIComponent(input.projectID)}`,
				body: {
					canonical: input["canonical"],
					name: input["name"],
					icon: input["icon"],
					commands: input["commands"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions)
		},
		form: { list: (input, requestOptions) => request({
			method: "GET",
			path: `/api/form`,
			query: { location: input?.["location"] },
			successStatus: 200,
			declaredStatuses: [
				400,
				401,
				404
			],
			empty: false
		}, requestOptions) },
		permission: {
			request: { list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/permission/request`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions) },
			saved: {
				list: (input, requestOptions) => request({
					method: "GET",
					path: `/api/permission/saved`,
					query: { projectID: input?.["projectID"] },
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				update: (input, requestOptions) => request({
					method: "PATCH",
					path: `/api/permission/saved/${encodeURIComponent(input.id)}`,
					body: {
						action: input["action"],
						resource: input["resource"]
					},
					successStatus: 200,
					declaredStatuses: [
						400,
						401,
						404,
						409
					],
					empty: false
				}, requestOptions).then((value) => value.data),
				remove: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/permission/saved/${encodeURIComponent(input.id)}`,
					successStatus: 204,
					declaredStatuses: [400, 401],
					empty: true
				}, requestOptions)
			},
			create: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/permission`,
				body: {
					id: input["id"],
					action: input["action"],
					resources: input["resources"],
					save: input["save"],
					metadata: input["metadata"],
					source: input["source"],
					agent: input["agent"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/permission`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/permission/${encodeURIComponent(input.requestID)}`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions).then((value) => value.data),
			reply: (input, requestOptions) => request({
				method: "POST",
				path: `/api/session/${encodeURIComponent(input.sessionID)}/permission/${encodeURIComponent(input.requestID)}/reply`,
				body: {
					decision: input["decision"],
					message: input["message"]
				},
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions)
		},
		file: {
			read: (input, requestOptions) => request({
				method: "GET",
				path: `/api/fs/read/${encodePath(input.path)}`,
				query: { location: input["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false,
				binary: true
			}, requestOptions),
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/fs/list`,
				query: {
					location: input?.["location"],
					path: input?.["path"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			find: (input, requestOptions) => request({
				method: "GET",
				path: `/api/fs/find`,
				query: {
					location: input["location"],
					query: input["query"],
					type: input["type"],
					limit: input["limit"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions)
		},
		command: { list: (input, requestOptions) => request({
			method: "GET",
			path: `/api/command`,
			query: { location: input?.["location"] },
			successStatus: 200,
			declaredStatuses: [
				400,
				401,
				404
			],
			empty: false
		}, requestOptions) },
		skill: { list: (input, requestOptions) => request({
			method: "GET",
			path: `/api/skill`,
			query: { location: input?.["location"] },
			successStatus: 200,
			declaredStatuses: [
				400,
				401,
				404
			],
			empty: false
		}, requestOptions) },
		rpc: { call: (input, requestOptions) => request({
			method: "POST",
			path: `/api/rpc/${encodeURIComponent(input.rpcID)}/${encodeURIComponent(input.method)}`,
			query: { location: input["location"] },
			body: { input: input["input"] },
			successStatus: 200,
			declaredStatuses: [
				400,
				401,
				404,
				500
			],
			empty: false
		}, requestOptions) },
		event: { subscribe: (input, requestOptions) => sse({
			method: "GET",
			path: `/api/event`,
			query: { types: input?.["types"] },
			successStatus: 200,
			declaredStatuses: [400, 401],
			empty: false
		}, requestOptions) },
		pty: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/pty`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			create: (input, requestOptions) => request({
				method: "POST",
				path: `/api/pty`,
				query: { location: input?.["location"] },
				body: {
					command: input?.["command"],
					args: input?.["args"],
					cwd: input?.["cwd"],
					title: input?.["title"],
					env: input?.["env"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/pty/${encodeURIComponent(input.ptyID)}`,
				query: { location: input["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			update: (input, requestOptions) => request({
				method: "PUT",
				path: `/api/pty/${encodeURIComponent(input.ptyID)}`,
				query: { location: input["location"] },
				body: {
					title: input["title"],
					size: input["size"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			remove: (input, requestOptions) => request({
				method: "DELETE",
				path: `/api/pty/${encodeURIComponent(input.ptyID)}`,
				query: { location: input["location"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			connect: { token: (input, requestOptions) => request({
				method: "POST",
				path: `/api/pty/${encodeURIComponent(input.ptyID)}/connect-token`,
				query: { location: input["location"] },
				headers: { "x-opencode-ticket": input["x-opencode-ticket"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					403,
					404
				],
				empty: false
			}, requestOptions) }
		},
		shell: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/shell`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			create: (input, requestOptions) => request({
				method: "POST",
				path: `/api/shell`,
				query: { location: input["location"] },
				body: {
					command: input["command"],
					cwd: input["cwd"],
					timeout: input["timeout"],
					metadata: input["metadata"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/shell/${encodeURIComponent(input.id)}`,
				query: { location: input["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			output: (input, requestOptions) => request({
				method: "GET",
				path: `/api/shell/${encodeURIComponent(input.id)}/output`,
				query: {
					location: input["location"],
					cursor: input["cursor"],
					limit: input["limit"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			remove: (input, requestOptions) => request({
				method: "DELETE",
				path: `/api/shell/${encodeURIComponent(input.id)}`,
				query: { location: input["location"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions)
		},
		reference: { list: (input, requestOptions) => request({
			method: "GET",
			path: `/api/reference`,
			query: { location: input?.["location"] },
			successStatus: 200,
			declaredStatuses: [
				400,
				401,
				404
			],
			empty: false
		}, requestOptions) },
		worktree: {
			list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/worktree`,
				query: { projectID: input["projectID"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			create: (input, requestOptions) => request({
				method: "POST",
				path: `/api/worktree`,
				body: {
					projectID: input["projectID"],
					from: input["from"],
					branch: input["branch"],
					directory: input["directory"],
					name: input["name"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			remove: (input, requestOptions) => request({
				method: "DELETE",
				path: `/api/worktree`,
				body: {
					projectID: input["projectID"],
					directory: input["directory"],
					force: input["force"]
				},
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions),
			refresh: (input, requestOptions) => request({
				method: "POST",
				path: `/api/worktree/refresh`,
				body: { projectID: input["projectID"] },
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: true
			}, requestOptions)
		},
		vcs: {
			init: (input, requestOptions) => request({
				method: "POST",
				path: `/api/vcs/init`,
				query: {
					location: input?.["location"],
					provider: input?.["provider"]
				},
				successStatus: 204,
				declaredStatuses: [
					400,
					401,
					404,
					409,
					501,
					503
				],
				empty: true
			}, requestOptions),
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/vcs`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			base: (input, requestOptions) => request({
				method: "GET",
				path: `/api/vcs/base`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions),
			status: (input, requestOptions) => request({
				method: "GET",
				path: `/api/vcs/status`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			branch: { list: (input, requestOptions) => request({
				method: "GET",
				path: `/api/vcs/branch`,
				query: {
					location: input?.["location"],
					search: input?.["search"],
					limit: input?.["limit"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions) },
			diff: (input, requestOptions) => request({
				method: "GET",
				path: `/api/vcs/diff`,
				query: {
					location: input["location"],
					mode: input["mode"],
					base: input["base"],
					context: input["context"],
					untracked: input["untracked"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions)
		},
		debug: {
			heapDump: (input, requestOptions) => request({
				method: "POST",
				path: `/api/debug/heap-dump`,
				query: { directory: input?.["directory"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					500
				],
				empty: false
			}, requestOptions),
			location: {
				list: (requestOptions) => request({
					method: "GET",
					path: `/api/debug/location`,
					successStatus: 200,
					declaredStatuses: [400, 401],
					empty: false
				}, requestOptions),
				evict: (input, requestOptions) => request({
					method: "DELETE",
					path: `/api/debug/location`,
					query: { location: input?.["location"] },
					successStatus: 204,
					declaredStatuses: [400, 401],
					empty: true
				}, requestOptions)
			}
		},
		websearch: {
			providers: (input, requestOptions) => request({
				method: "GET",
				path: `/api/websearch/provider`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions),
			query: (input, requestOptions) => request({
				method: "POST",
				path: `/api/websearch`,
				query: { location: input["location"] },
				body: {
					query: input["query"],
					providerID: input["providerID"]
				},
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404,
					503
				],
				empty: false
			}, requestOptions)
		},
		config: {
			get: (input, requestOptions) => request({
				method: "GET",
				path: `/api/config`,
				query: { location: input?.["location"] },
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions),
			shells: (requestOptions) => request({
				method: "GET",
				path: `/api/config/shell`,
				successStatus: 200,
				declaredStatuses: [
					400,
					401,
					404
				],
				empty: false
			}, requestOptions)
		}
	};
	return {
		...client,
		session: {
			...client.session,
			/** @deprecated Use `client.experimental.session.stats`. Removed in the next minor. */
			stats: client.experimental.session.stats,
			/** @deprecated Use `client.experimental.session.import`. Removed in the next minor. */
			import: client.experimental.session.import,
			/** @deprecated Use `client.experimental.session.export`. Removed in the next minor. */
			export: client.experimental.session.export,
			/** @deprecated Use `client.experimental.session.skill`. Removed in the next minor. */
			skill: client.experimental.session.skill,
			/** @deprecated Use `client.experimental.session.wait`. Removed in the next minor. */
			wait: client.experimental.session.wait,
			/** @deprecated Use `client.experimental.session.instructions`. Removed in the next minor. */
			instructions: { 
			/** @deprecated Use `client.experimental.session.instructions.entry`. Removed in the next minor. */
entry: {
				/** @deprecated Use `client.experimental.session.instructions.entry.list`. Removed in the next minor. */
				list: client.experimental.session.instructions.entry.list,
				/** @deprecated Use `client.experimental.session.instructions.entry.put`. Removed in the next minor. */
				put: client.experimental.session.instructions.entry.put,
				/** @deprecated Use `client.experimental.session.instructions.entry.remove`. Removed in the next minor. */
				remove: client.experimental.session.instructions.entry.remove
			} },
			/** @deprecated Use `client.experimental.session.log`. Removed in the next minor. */
			log: client.experimental.session.log
		},
		/** @deprecated Use `client.experimental.generate`. Removed in the next minor. */
		generate: {
			/** @deprecated Use `client.experimental.generate.text`. Removed in the next minor. */
			text: client.experimental.generate.text,
			/** @deprecated Use `client.experimental.generate.image`. Removed in the next minor. */
			image: client.experimental.generate.image,
			/** @deprecated Use `client.experimental.generate.decisions`. Removed in the next minor. */
			decisions: client.experimental.generate.decisions
		},
		/** @deprecated Use `client.experimental.voice`. Removed in the next minor. */
		voice: {
			/** @deprecated Use `client.experimental.voice.models`. Removed in the next minor. */
			models: client.experimental.voice.models,
			/** @deprecated Use `client.experimental.voice.session`. Removed in the next minor. */
			session: client.experimental.voice.session
		},
		integration: {
			...client.integration,
			/** @deprecated Use `client.experimental.integration.wellknown`. Removed in the next minor. */
			wellknown: { 
			/** @deprecated Use `client.experimental.integration.wellknown.add`. Removed in the next minor. */
add: client.experimental.integration.wellknown.add }
		},
		mcp: {
			...client.mcp,
			/** @deprecated Use `client.experimental.mcp.add`. Removed in the next minor. */
			add: client.experimental.mcp.add,
			/** @deprecated Use `client.experimental.mcp.remove`. Removed in the next minor. */
			remove: client.experimental.mcp.remove,
			/** @deprecated Use `client.experimental.mcp.connect`. Removed in the next minor. */
			connect: client.experimental.mcp.connect,
			/** @deprecated Use `client.experimental.mcp.disconnect`. Removed in the next minor. */
			disconnect: client.experimental.mcp.disconnect,
			/** @deprecated Use `client.experimental.mcp.client`. Removed in the next minor. */
			client: { 
			/** @deprecated Use `client.experimental.mcp.client.token`. Removed in the next minor. */
token: client.experimental.mcp.client.token }
		},
		file: {
			...client.file,
			/** @deprecated Use `client.experimental.file.write`. Removed in the next minor. */
			write: client.experimental.file.write,
			/** @deprecated Use `client.experimental.file.watch`. Removed in the next minor. */
			watch: client.experimental.file.watch,
			/** @deprecated Use `client.experimental.file.unwatch`. Removed in the next minor. */
			unwatch: client.experimental.file.unwatch
		},
		/** @deprecated Use `client.experimental.migration`. Removed in the next minor. */
		migration: { 
		/** @deprecated Use `client.experimental.migration.v1`. Removed in the next minor. */
v1: { 
		/** @deprecated Use `client.experimental.migration.v1.status`. Removed in the next minor. */
status: client.experimental.migration.v1.status } },
		/** @deprecated Use `client.experimental.usage`. Removed in the next minor. */
		usage: { 
		/** @deprecated Use `client.experimental.usage.limits`. Removed in the next minor. */
limits: client.experimental.usage.limits },
		config: {
			...client.config,
			/** @deprecated Use `client.experimental.config.update`. Removed in the next minor. */
			update: client.experimental.config.update
		}
	};
}
function encodePath(value) {
	return value.split("/").map(encodeURIComponent).join("/");
}
function appendQuery(params, key, value) {
	if (value === void 0) return;
	if (value === null) {
		params.append(key, "null");
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) appendQuery(params, key, item);
		return;
	}
	if (typeof value === "object") {
		for (const [child, item] of Object.entries(value)) appendQuery(params, `${key}[${child}]`, item);
		return;
	}
	params.append(key, String(value));
}
async function json(response) {
	if (!isContentType(response, "application/json") && !response.headers.get("content-type")?.includes("+json")) {
		try {
			await response.body?.cancel();
		} catch {}
		throw new ClientError("UnsupportedContentType", { detail: response.headers.get("content-type") });
	}
	let text;
	try {
		text = await response.text();
	} catch (cause) {
		throw new ClientError("Transport", { cause });
	}
	if (text === "") throw new ClientError("MalformedResponse");
	try {
		return JSON.parse(text);
	} catch (cause) {
		throw new ClientError("MalformedResponse", { cause });
	}
}
/** Throw declared error bodies as Errors. The body's fields stay on the error, so narrowing on `_tag` or `name` still works. */
function declared(body) {
	const error = Object.assign(new Error(body.message ?? body.data?.message), body);
	if (body._tag) error.name = body._tag;
	return error;
}
function isContentType(response, expected) {
	return response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() === expected;
}
//#endregion
//#region ../client/src/promise/generated/types.ts
var isInvalidRequestError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "InvalidRequestError";
var isUnauthorizedError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "UnauthorizedError";
var isLocationNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "LocationNotFoundError";
var isServiceUnavailableError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ServiceUnavailableError";
var isAgentNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "AgentNotFoundError";
var isPluginNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "PluginNotFoundError";
var isInvalidCursorError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "InvalidCursorError";
var isSessionNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "SessionNotFoundError";
var isMessageNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "MessageNotFoundError";
var isConflictError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ConflictError";
var isCommandNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "CommandNotFoundError";
var isCommandExecutionError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "CommandExecutionError";
var isSessionBusyError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "SessionBusyError";
var isUnknownError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "UnknownError";
var isFormNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "FormNotFoundError";
var isFormInvalidAnswerError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "FormInvalidAnswerError";
var isFormAlreadySettledError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "FormAlreadySettledError";
var isSkillNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "SkillNotFoundError";
var isInstructionEntryValueTooLargeError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "InstructionEntryValueTooLargeError";
var isProviderNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ProviderNotFoundError";
var isModelNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ModelNotFoundError";
var isUnsupportedModelError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "UnsupportedModelError";
var isProviderRequestError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ProviderRequestError";
var isForbiddenError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ForbiddenError";
var isVideoNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "VideoNotFoundError";
var isIntegrationNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "IntegrationNotFoundError";
var isIntegrationAttemptNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "IntegrationAttemptNotFoundError";
var isIntegrationMethodNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "IntegrationMethodNotFoundError";
var isMcpServerNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "McpServerNotFoundError";
var isProjectNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ProjectNotFoundError";
var isPermissionSavedNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "PermissionSavedNotFoundError";
var isPermissionNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "PermissionNotFoundError";
var isFileNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "FileNotFoundError";
var isRpcError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "RpcError";
var isRpcInternalError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "RpcInternalError";
var isPtyNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "PtyNotFoundError";
var isPtyFeatureUnsupportedError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "PtyFeatureUnsupportedError";
var isBlobNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "BlobNotFoundError";
var isAutomationNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "AutomationNotFoundError";
var isArtifactNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ArtifactNotFoundError";
var isShellNotFoundError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "ShellNotFoundError";
var isWorktreeError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "WorktreeError";
var isVcsInitNotSupportedError = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "VcsInitNotSupportedError";
//#endregion
//#region ../client/src/promise/rpc.ts
function makeRpc(raw, events) {
	return (definition) => {
		const subscribe = (name, options) => {
			if (!Object.hasOwn(definition.events, name)) throw new Error(`Unknown RPC event: ${definition.id}.${name}`);
			const type = eventType(definition, name);
			return { [Symbol.asyncIterator]() {
				const controller = new AbortController();
				const signal = options?.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal;
				const iterator = (async function* () {
					try {
						for await (const published of events.subscribe({ signal })) {
							if (signal.aborted) return;
							if (published.type !== type) continue;
							yield published;
						}
					} catch (error) {
						if (!signal.aborted) throw error;
					} finally {
						controller.abort();
					}
				})();
				return {
					next: () => iterator.next(),
					return: () => {
						controller.abort();
						return iterator.return();
					}
				};
			} };
		};
		return Object.assign(Object.fromEntries(Object.keys(definition.methods).map((name) => [name, async (input, options) => {
			try {
				return (await raw.rpc.call({
					rpcID: definition.id,
					method: name,
					input,
					location: options?.location
				}, {
					signal: options?.signal,
					headers: options?.headers
				})).output;
			} catch (error) {
				if (!isRpcError(error) && !isRpcInternalError(error)) throw error;
				throw error.data === void 0 ? {
					type: error.type,
					message: error.message
				} : {
					type: error.type,
					message: error.message,
					data: error.data
				};
			}
		}])), { events: {
			subscribe,
			on: (name, handler, options) => {
				const controller = new AbortController();
				const signal = options?.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal;
				const source = subscribe(name, { signal });
				(async () => {
					for await (const event of source) await handler(event);
				})().catch((error) => console.error(error));
				return () => controller.abort();
			}
		} });
	};
}
function eventType(definition, name) {
	return `rpc.${definition.id}.${name}`;
}
//#endregion
//#region ../client/src/promise/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	OpenCode: () => client_exports,
	make: () => make
});
function make(options) {
	const raw = make$1(options);
	const events = make$2((signal, onActivity) => raw.event.subscribe(void 0, {
		signal,
		onActivity
	}));
	return {
		...raw,
		rpc: Object.assign(makeRpc(raw, events), raw.rpc),
		event: events
	};
}
//#endregion
//#region ../client/src/promise/media.ts
var MEDIA_URI_CAPABILITY = "experimental-media-uri";
var CAPABILITIES_HEADER = "X-OpenCode-Capabilities";
var MEDIA_REF = /^media:([0-9a-f]{64})$/;
/** The blob hash in a `media:<hash>` ref, the only form the server sends stored media in. */
function mediaHashFromUri(uri) {
	if (!uri) return void 0;
	return MEDIA_REF.exec(uri)?.[1];
}
/**
* Opts a client into the experimental `experimental-media-uri` capability: while `experimental.media_blob` is on,
* stored media comes back as `media:<hash>` refs, whose bytes `experimental.media.get` reads.
*
* Only the message and inbox reads can return refs, so only they carry the capability.
* A custom header makes a cross-origin request preflighted, which every other request must keep avoiding.
*/
function withMediaRefs(api) {
	return {
		...api,
		message: {
			...api.message,
			list: (input, options) => api.message.list(input, mediaRefOptions(options))
		},
		session: {
			...api.session,
			message: {
				...api.session.message,
				get: (input, options) => api.session.message.get(input, mediaRefOptions(options))
			},
			inbox: {
				...api.session.inbox,
				list: (input, options) => api.session.inbox.list(input, mediaRefOptions(options))
			}
		}
	};
}
function mediaRefOptions(options) {
	if (options?.mediaRefs === false) return options;
	const headers = new Headers(options?.headers);
	headers.set(CAPABILITIES_HEADER, MEDIA_URI_CAPABILITY);
	return {
		...options,
		headers
	};
}
//#endregion
//#region ../client/src/promise/index.ts
var promise_exports = /* @__PURE__ */ __exportAll({
	ClientError: () => ClientError,
	OpenCode: () => client_exports,
	isAgentNotFoundError: () => isAgentNotFoundError,
	isArtifactNotFoundError: () => isArtifactNotFoundError,
	isAutomationNotFoundError: () => isAutomationNotFoundError,
	isBlobNotFoundError: () => isBlobNotFoundError,
	isCommandExecutionError: () => isCommandExecutionError,
	isCommandNotFoundError: () => isCommandNotFoundError,
	isConflictError: () => isConflictError,
	isFileNotFoundError: () => isFileNotFoundError,
	isForbiddenError: () => isForbiddenError,
	isFormAlreadySettledError: () => isFormAlreadySettledError,
	isFormInvalidAnswerError: () => isFormInvalidAnswerError,
	isFormNotFoundError: () => isFormNotFoundError,
	isInstructionEntryValueTooLargeError: () => isInstructionEntryValueTooLargeError,
	isIntegrationAttemptNotFoundError: () => isIntegrationAttemptNotFoundError,
	isIntegrationMethodNotFoundError: () => isIntegrationMethodNotFoundError,
	isIntegrationNotFoundError: () => isIntegrationNotFoundError,
	isInvalidCursorError: () => isInvalidCursorError,
	isInvalidRequestError: () => isInvalidRequestError,
	isLocationNotFoundError: () => isLocationNotFoundError,
	isMcpServerNotFoundError: () => isMcpServerNotFoundError,
	isMessageNotFoundError: () => isMessageNotFoundError,
	isModelNotFoundError: () => isModelNotFoundError,
	isPermissionNotFoundError: () => isPermissionNotFoundError,
	isPermissionSavedNotFoundError: () => isPermissionSavedNotFoundError,
	isPluginNotFoundError: () => isPluginNotFoundError,
	isProjectNotFoundError: () => isProjectNotFoundError,
	isProviderNotFoundError: () => isProviderNotFoundError,
	isProviderRequestError: () => isProviderRequestError,
	isPtyFeatureUnsupportedError: () => isPtyFeatureUnsupportedError,
	isPtyNotFoundError: () => isPtyNotFoundError,
	isRpcError: () => isRpcError,
	isRpcInternalError: () => isRpcInternalError,
	isServiceUnavailableError: () => isServiceUnavailableError,
	isSessionBusyError: () => isSessionBusyError,
	isSessionNotFoundError: () => isSessionNotFoundError,
	isShellNotFoundError: () => isShellNotFoundError,
	isSkillNotFoundError: () => isSkillNotFoundError,
	isUnauthorizedError: () => isUnauthorizedError,
	isUnknownError: () => isUnknownError,
	isUnsupportedModelError: () => isUnsupportedModelError,
	isVcsInitNotSupportedError: () => isVcsInitNotSupportedError,
	isVideoNotFoundError: () => isVideoNotFoundError,
	isWorktreeError: () => isWorktreeError,
	mediaHashFromUri: () => mediaHashFromUri,
	withMediaRefs: () => withMediaRefs
});
//#endregion
export { make as n, ClientError as r, promise_exports as t };
