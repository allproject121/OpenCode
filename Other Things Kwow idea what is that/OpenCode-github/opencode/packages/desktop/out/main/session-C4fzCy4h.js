import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.js";
import { At as brand, B as NonEmptyArray, D as Finite, Dr as omit, Ei as transform$1, Et as Unknown, F as Literal, Fi as transform, Gt as encodeSync, H as Null, Hn as isStartingWith, I as Literals, Kc as succeed, Kr as make, Kt as encodeTo, Li as transformOptional, Lt as decodeTo, M as Int, N as Json, Or as pick, Rn as isPattern, Rt as decodeUnknownEffect, U as NullOr, W as Number$1, X as Record, Xt as fromJsonString, Yc as suspend$1, _ as DateTimeUtc, _o as toEpochMillis, ar as optional$1, at as String, cr as tag, dr as toEncoded, dt as TemplateLiteral, fr as toEquivalence, gn as isGreaterThanOrEqualTo, go as makeUnsafe, gr as withConstructorDefault, h as Class, i as Any, ih as filter, ji as passthrough, jm as isFailure, kt as annotate, l as Boolean, mr as toType, nn as isBetween, nr as makeFilter, o as ArraySchema, or as optionalKey, ot as Struct, pn as isGreaterThan, pr as toTaggedUnion, rc as mapError, sr as suspend, st as StructWithRest, ut as TaggedError, vo as decodeString, ws as fail, wt as Union, y as Defect, yo as encode } from "./Latch-oSncnOpo.js";
//#region ../schema/src/schema.ts
var PositiveInt = Int.check(isGreaterThan(0));
var NonNegativeInt = Int.check(isGreaterThanOrEqualTo(0));
var RelativePath = String.pipe(brand("RelativePath"), annotate({ identifier: "RelativePath" }));
var AbsolutePath = String.pipe(brand("AbsolutePath"), annotate({ identifier: "AbsolutePath" }));
var optional = (schema) => optionalKey(schema).pipe(decodeTo(optional$1(toType(schema)), {
	decode: passthrough({ strict: false }),
	encode: transformOptional(filter((value) => value !== void 0))
}));
var withStatics = (schema, methods) => Object.defineProperties(schema, Object.getOwnPropertyDescriptors(methods));
var statics = (methods) => (schema) => withStatics(schema, methods(schema));
var DateTimeUtcFromMillis = Finite.pipe(decodeTo(DateTimeUtc, {
	decode: transform((value) => makeUnsafe(value)),
	encode: transform((value) => toEpochMillis(value))
}));
//#endregion
//#region ../schema/src/identifier.ts
var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var lastTimestamp = 0;
var counter = 0;
function ascending() {
	return create(false);
}
function descending() {
	return create(true);
}
function create(descending, timestamp = Date.now()) {
	if (timestamp !== lastTimestamp) {
		lastTimestamp = timestamp;
		counter = 0;
	}
	counter++;
	const current = BigInt(timestamp) * 4096n + BigInt(counter);
	const value = descending ? ~current : current;
	const time = Array.from({ length: 6 }, (_, index) => Number(value >> BigInt(40 - 8 * index) & 255n).toString(16).padStart(2, "0")).join("");
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(14));
	return time + Array.from(bytes, (byte) => chars[byte % 62]).join("");
}
//#endregion
//#region ../schema/src/project-id.ts
var ProjectID = String.pipe(brand("Project.ID"), annotate({ identifier: "Project.ID" }), statics((schema) => ({ global: schema.make("global") })));
//#endregion
//#region ../schema/src/workspace-id.ts
var WorkspaceID = String.check(isStartingWith("wrk")).pipe(brand("Workspace.ID"), annotate({ identifier: "Workspace.ID" }), statics((schema) => {
	const create = () => schema.make("wrk_" + ascending());
	return {
		ascending: (id) => {
			if (!id) return create();
			return schema.make(id);
		},
		create
	};
}));
//#endregion
//#region ../schema/src/location.ts
var location_exports = /* @__PURE__ */ __exportAll({
	Info: () => Info$15,
	Location: () => location_exports,
	PublicInfo: () => PublicInfo,
	PublicRef: () => PublicRef,
	Ref: () => Ref$2,
	response: () => response
});
var Ref$2 = Struct({
	directory: AbsolutePath,
	workspaceID: optional(WorkspaceID)
}).annotate({ identifier: "Location.Ref" });
var PublicRef = Struct(omit(Ref$2.fields, ["workspaceID"])).annotate({ identifier: "Location.PublicRef" });
var Info$15 = class extends Class("Location.Info")({
	directory: AbsolutePath,
	workspaceID: optional(WorkspaceID),
	project: Struct({
		id: ProjectID,
		directory: AbsolutePath,
		canonical: AbsolutePath
	})
}) {};
var PublicInfo = Struct(omit(Info$15.fields, ["workspaceID"])).annotate({ identifier: "Location.PublicInfo" });
function response(data) {
	return Struct({
		location: PublicRef,
		data
	});
}
//#endregion
//#region ../schema/src/event.ts
var event_exports = /* @__PURE__ */ __exportAll({
	Event: () => event_exports,
	ID: () => ID$13,
	Seq: () => Seq,
	Version: () => Version,
	durable: () => durable,
	durableMap: () => durableMap,
	ephemeral: () => ephemeral,
	inventory: () => inventory,
	latest: () => latest,
	versionedType: () => versionedType
});
var ID$13 = String.check(isStartingWith("evt_")).pipe(brand("Event.ID"), annotate({ identifier: "Event.ID" }), statics((schema) => ({ create: () => schema.make("evt_" + ascending()) })));
/**
* Position in one aggregate's durable log. Values originate from the durable
* event envelope and synced markers;
* `after` cursors accept only values that came from those sources.
*/
var Seq = Int.check(isGreaterThanOrEqualTo(0)).pipe(brand("Event.Seq"), annotate({ identifier: "Event.Seq" }));
/** Durable schema version of one event type, from the event definition that committed it. */
var Version = Int.check(isGreaterThanOrEqualTo(1)).pipe(brand("Event.Version"), annotate({ identifier: "Event.Version" }));
var DurableEnvelope = Struct({
	aggregateID: String,
	seq: Seq,
	version: Version
});
function durable(input) {
	const data = Struct(input.schema);
	const durable = Struct({
		aggregateID: DurableEnvelope.fields.aggregateID,
		seq: DurableEnvelope.fields.seq,
		version: Literal(input.durable.version).pipe(decodeTo(toType(Version), transform$1({
			decode: () => Version.make(input.durable.version),
			encode: () => input.durable.version
		})))
	});
	return Struct({
		id: ID$13,
		created: Finite,
		metadata: optional(Record(String, Unknown)),
		type: Literal(input.type),
		durable,
		location: optional(Ref$2),
		data
	}).annotate({ identifier: input.identifier ?? input.type }).pipe(statics(() => ({
		type: input.type,
		durability: "durable",
		durable: input.durable,
		data
	})));
}
function ephemeral(input) {
	const data = Struct(input.schema);
	return Struct({
		id: ID$13,
		created: Finite,
		metadata: optional(Record(String, Unknown)),
		type: Literal(input.type),
		location: optional(Ref$2),
		data
	}).annotate({ identifier: input.identifier ?? input.type }).pipe(statics(() => ({
		type: input.type,
		durability: "ephemeral",
		durable: void 0,
		data
	})));
}
function inventory(...definitions) {
	return Object.freeze(definitions);
}
function latest(definitions) {
	return readonlyMap(definitions.reduce((result, definition) => {
		const existing = result.get(definition.type);
		if (!existing) {
			result.set(definition.type, definition);
			return result;
		}
		if (definition.durable && existing.durable && definition.durable.version !== existing.durable.version) {
			if (definition.durable.version > existing.durable.version) result.set(definition.type, definition);
			return result;
		}
		if (definition !== existing) throw new Error(`Duplicate latest event definition for ${definition.type}`);
		return result;
	}, /* @__PURE__ */ new Map()));
}
function versionedType(type, version) {
	return `${type}.${version}`;
}
function durableMap(definitions) {
	return readonlyMap(definitions.reduce((result, definition) => {
		if (definition.durability !== "durable") return result;
		const key = versionedType(definition.type, definition.durable.version);
		if (result.has(key)) throw new Error(`Duplicate durable event definition for ${key}`);
		result.set(key, definition);
		return result;
	}, /* @__PURE__ */ new Map()));
}
function readonlyMap(map) {
	const result = Object.freeze({
		get size() {
			return map.size;
		},
		entries: () => map.entries(),
		forEach: (callback, thisArg) => map.forEach((value, key) => callback.call(thisArg, value, key, result)),
		get: (key) => map.get(key),
		has: (key) => map.has(key),
		keys: () => map.keys(),
		values: () => map.values(),
		[Symbol.iterator]: () => map[Symbol.iterator]()
	});
	return result;
}
//#endregion
//#region ../schema/src/skill.ts
var skill_exports = /* @__PURE__ */ __exportAll({
	DirectorySource: () => DirectorySource,
	EmbeddedSource: () => EmbeddedSource,
	Event: () => Event$10,
	ID: () => ID$12,
	Info: () => Info$14,
	Name: () => Name$1,
	Skill: () => skill_exports,
	Source: () => Source$1,
	UrlSource: () => UrlSource
});
var ID$12 = String.pipe(brand("Skill.ID"), annotate({ identifier: "Skill.ID" }));
var Name$1 = String.pipe(brand("Skill.Name"), annotate({ identifier: "Skill.Name" }));
var DirectorySource = Struct({
	type: tag("directory"),
	path: AbsolutePath
}).annotate({ identifier: "Skill.DirectorySource" });
var UrlSource = Struct({
	type: tag("url"),
	url: String
}).annotate({ identifier: "Skill.UrlSource" });
var Info$14 = Struct({
	id: ID$12,
	name: Name$1,
	description: String.pipe(optional),
	autoinvoke: Boolean.pipe(optional),
	path: AbsolutePath,
	content: String
}).annotate({ identifier: "Skill.Info" });
var Updated$6 = ephemeral({
	type: "skill.updated",
	schema: {}
});
var Event$10 = {
	Updated: Updated$6,
	Definitions: inventory(Updated$6)
};
var EmbeddedSource = Struct({
	type: tag("embedded"),
	skill: suspend(() => Info$14)
}).annotate({ identifier: "Skill.EmbeddedSource" });
var Source$1 = Object.assign(Union([
	DirectorySource,
	UrlSource,
	EmbeddedSource
]).pipe(toTaggedUnion("type"), annotate({ identifier: "Skill.Source" })), {
	equals: (a, b) => {
		if (a.type !== b.type) return false;
		if (a.type === "directory" && b.type === "directory") return a.path === b.path;
		if (a.type === "url" && b.type === "url") return a.url === b.url;
		if (a.type === "embedded" && b.type === "embedded") return a.skill.id === b.skill.id;
		return false;
	},
	key: (source) => source.type === "directory" ? `directory:${source.path}` : source.type === "url" ? `url:${source.url}` : `embedded:${source.skill.id}`
});
//#endregion
//#region ../schema/src/integration-id.ts
var IntegrationID = String.pipe(brand("Integration.ID"), annotate({ identifier: "Integration.ID" }));
var IntegrationMethodID = String.pipe(brand("Integration.MethodID"), annotate({ identifier: "Integration.MethodID" }));
//#endregion
//#region ../schema/src/credential.ts
var credential_exports = /* @__PURE__ */ __exportAll({
	CreateInput: () => CreateInput$1,
	Credential: () => credential_exports,
	Entry: () => Entry,
	Event: () => Event$9,
	External: () => External,
	ID: () => ID$11,
	Key: () => Key$2,
	OAuth: () => OAuth,
	Value: () => Value$1
});
var ID$11 = String.pipe(brand("Credential.ID"), annotate({ identifier: "Credential.ID" }), statics((schema) => ({ create: () => schema.make("cred_" + ascending()) })));
var Updated$5 = ephemeral({
	type: "credential.updated",
	schema: {
		integrationID: IntegrationID,
		credentialID: ID$11
	}
});
var Switched = ephemeral({
	type: "credential.switched",
	schema: {
		integrationID: IntegrationID,
		credentialID: NullOr(ID$11)
	}
});
var Event$9 = {
	Updated: Updated$5,
	Switched,
	Definitions: inventory(Updated$5, Switched)
};
var OAuth = Struct({
	type: Literal("oauth"),
	methodID: IntegrationMethodID,
	refresh: String,
	access: String,
	expires: NonNegativeInt,
	metadata: optional(Record(String, Unknown))
}).annotate({ identifier: "Credential.OAuth" });
var Key$2 = Struct({
	type: Literal("key"),
	key: String,
	metadata: optional(Record(String, Unknown))
}).annotate({ identifier: "Credential.Key" });
var External = Struct({
	type: Literal("external"),
	methodID: IntegrationMethodID,
	metadata: optional(Record(String, Unknown))
}).annotate({ identifier: "Credential.External" });
var Value$1 = Union([
	OAuth,
	Key$2,
	External
]).pipe(toTaggedUnion("type")).annotate({ identifier: "Credential.Value" });
var Entry = Struct({
	id: ID$11,
	integrationID: IntegrationID,
	label: String,
	active: Boolean,
	value: Value$1
}).annotate({ identifier: "Credential.Entry" });
var CreateInput$1 = Struct({
	id: optional(ID$11),
	integrationID: IntegrationID,
	label: optional(String),
	value: Value$1,
	activate: optional(Boolean)
}).annotate({ identifier: "Credential.CreateInput" });
//#endregion
//#region ../schema/src/connection.ts
var Status$1 = Struct({
	status: Literals(["needs_auth"]),
	message: String,
	url: optional(String)
}).annotate({ identifier: "Connection.Status" });
var CredentialInfo = Struct({
	type: Literal("credential"),
	id: ID$11,
	label: String,
	/** Whether the connection stores a key, an OAuth grant, or an external credential-source reference. */
	method: Literals([
		"key",
		"oauth",
		"external"
	]),
	status: optional(Status$1)
}).annotate({ identifier: "Connection.CredentialInfo" });
var EnvInfo = Struct({
	type: Literal("env"),
	name: String,
	status: optional(Status$1)
}).annotate({ identifier: "Connection.EnvInfo" });
var Info$13 = Union([CredentialInfo, EnvInfo]).pipe(toTaggedUnion("type")).annotate({ identifier: "Connection.Info" });
//#endregion
//#region ../schema/src/form.ts
var form_exports = /* @__PURE__ */ __exportAll({
	Answer: () => Answer,
	BooleanField: () => BooleanField,
	Detail: () => Detail,
	Event: () => Event$8,
	ExternalField: () => ExternalField,
	Field: () => Field,
	Fields: () => Fields,
	Form: () => form_exports,
	ID: () => ID$10,
	Info: () => Info$12,
	IntegerField: () => IntegerField,
	Metadata: () => Metadata$2,
	MultiselectField: () => MultiselectField,
	NumberField: () => NumberField,
	Option: () => Option,
	Reply: () => Reply$1,
	State: () => State,
	StringField: () => StringField,
	Value: () => Value,
	When: () => When
});
var ID$10 = String.check(isStartingWith("frm_")).pipe(brand("Form.ID"), annotate({ identifier: "Form.ID" })).pipe(statics((schema) => ({ create: (id) => schema.make(id ?? "frm_" + ascending()) })));
var Metadata$2 = Record(String, Unknown).annotate({ identifier: "Form.Metadata" });
var Option = Struct({
	value: String,
	label: String,
	description: String.pipe(optional)
}).annotate({ identifier: "Form.Option" });
var When = Struct({
	key: String,
	op: Literals(["eq", "neq"]),
	value: Union([
		String,
		Number$1,
		Boolean
	])
}).annotate({ identifier: "Form.When" });
var FieldBase = {
	key: String,
	title: String.pipe(optional),
	description: String.pipe(optional),
	required: Boolean.pipe(optional),
	hidden: Boolean.pipe(optional).annotate({ description: "Skip the interactive authentication prompt and use the default unless an answer is supplied" }),
	when: ArraySchema(When).pipe(optional)
};
var StringField = Struct({
	...FieldBase,
	type: Literal("string"),
	format: Literals([
		"email",
		"uri",
		"date",
		"date-time"
	]).pipe(optional),
	minLength: NonNegativeInt.pipe(optional),
	maxLength: NonNegativeInt.pipe(optional),
	pattern: String.pipe(optional),
	placeholder: String.pipe(optional),
	default: String.pipe(optional),
	options: ArraySchema(Option).pipe(optional),
	custom: Boolean.pipe(optional)
}).annotate({ identifier: "Form.StringField" });
var NumberField = Struct({
	...FieldBase,
	type: Literal("number"),
	minimum: Number$1.pipe(optional),
	maximum: Number$1.pipe(optional),
	default: Number$1.pipe(optional)
}).annotate({ identifier: "Form.NumberField" });
var IntegerField = Struct({
	...FieldBase,
	type: Literal("integer"),
	minimum: Number$1.pipe(optional),
	maximum: Number$1.pipe(optional),
	default: Number$1.pipe(optional)
}).annotate({ identifier: "Form.IntegerField" });
var BooleanField = Struct({
	...FieldBase,
	type: Literal("boolean"),
	default: Boolean.pipe(optional)
}).annotate({ identifier: "Form.BooleanField" });
var MultiselectField = Struct({
	...FieldBase,
	type: Literal("multiselect"),
	options: ArraySchema(Option),
	minItems: NonNegativeInt.pipe(optional),
	maxItems: NonNegativeInt.pipe(optional),
	custom: Boolean.pipe(optional),
	default: ArraySchema(String).pipe(optional)
}).annotate({ identifier: "Form.MultiselectField" });
var ExternalField = Struct({
	key: String,
	type: Literal("external"),
	url: String,
	title: String.pipe(optional),
	description: String.pipe(optional)
}).annotate({ identifier: "Form.ExternalField" });
var Field = Union([
	StringField,
	NumberField,
	IntegerField,
	BooleanField,
	MultiselectField,
	ExternalField
]).pipe(toTaggedUnion("type"), annotate({ identifier: "Form.Field" }));
var Fields = NonEmptyArray(Field).annotate({ identifier: "Form.Fields" });
var InfoBase = {
	id: ID$10,
	sessionID: String,
	title: String,
	metadata: Metadata$2.pipe(optional)
};
var Info$12 = Struct({
	...InfoBase,
	fields: Fields
}).annotate({ identifier: "Form.Info" });
var Value = Union([
	String,
	Number$1,
	Boolean,
	ArraySchema(String)
]).annotate({ identifier: "Form.Value" });
var Answer = Record(String, Value).annotate({ identifier: "Form.Answer" });
var State = Union([
	Struct({ status: Literal("pending") }),
	Struct({
		status: Literal("answered"),
		answer: Answer
	}),
	Struct({
		status: Literal("cancelled"),
		message: String.pipe(optional)
	})
]).pipe(toTaggedUnion("status")).annotate({ identifier: "Form.State" });
var Detail = Struct({
	...Info$12.fields,
	state: State
}).annotate({ identifier: "Form.Detail" });
var Reply$1 = Struct({ answer: Answer }).annotate({ identifier: "Form.Reply" });
var Created$2 = ephemeral({
	type: "form.created",
	schema: { form: Info$12 }
});
var Replied$1 = ephemeral({
	type: "form.replied",
	schema: {
		id: ID$10,
		sessionID: String,
		answer: Answer
	}
});
var Cancelled = ephemeral({
	type: "form.cancelled",
	schema: {
		id: ID$10,
		sessionID: String
	}
});
var Event$8 = {
	Created: Created$2,
	Replied: Replied$1,
	Cancelled,
	Definitions: inventory(Created$2, Replied$1, Cancelled)
};
//#endregion
//#region ../schema/src/integration.ts
var integration_exports = /* @__PURE__ */ __exportAll({
	Attempt: () => Attempt,
	AttemptID: () => AttemptID,
	AttemptStatus: () => AttemptStatus,
	CommandAttempt: () => CommandAttempt,
	CommandAttemptStatus: () => CommandAttemptStatus,
	CommandMethod: () => CommandMethod,
	EnvMethod: () => EnvMethod,
	Event: () => Event$7,
	ExternalMethod: () => ExternalMethod,
	ID: () => ID$9,
	Info: () => Info$11,
	Integration: () => integration_exports,
	KeyMethod: () => KeyMethod,
	Method: () => Method,
	MethodID: () => MethodID,
	OAuthMethod: () => OAuthMethod,
	Ref: () => Ref$1
});
var ID$9 = IntegrationID;
var MethodID = IntegrationMethodID;
var OAuthMethod = Struct({
	id: MethodID,
	type: Literal("oauth"),
	label: String,
	form: optional(Fields)
}).annotate({ identifier: "Integration.OAuthMethod" });
var CommandMethod = Struct({
	id: MethodID,
	type: Literal("command"),
	label: String,
	command: ArraySchema(String)
}).annotate({ identifier: "Integration.CommandMethod" });
var KeyMethod = Struct({
	type: Literal("key"),
	label: optional(String),
	form: optional(Fields)
}).annotate({ identifier: "Integration.KeyMethod" });
var ExternalMethod = Struct({
	id: MethodID,
	type: Literal("external"),
	label: String,
	form: optional(Fields)
}).annotate({ identifier: "Integration.ExternalMethod" });
var EnvMethod = Struct({
	type: Literal("env"),
	names: ArraySchema(String)
}).annotate({ identifier: "Integration.EnvMethod" });
var Method = Union([
	OAuthMethod,
	CommandMethod,
	KeyMethod,
	ExternalMethod,
	EnvMethod
]).pipe(toTaggedUnion("type")).annotate({ identifier: "Integration.Method" });
var Updated$4 = ephemeral({
	type: "integration.updated",
	schema: {}
});
var Event$7 = {
	Updated: Updated$4,
	Definitions: inventory(Updated$4)
};
var Ref$1 = Struct({
	id: ID$9,
	name: String,
	metadata: optional(Record(String, Any))
}).annotate({ identifier: "Integration.Ref" });
var Info$11 = Struct({
	id: ID$9,
	name: String,
	metadata: optional(Record(String, Any)),
	methods: ArraySchema(Method),
	connections: ArraySchema(Info$13)
}).annotate({ identifier: "Integration.Info" });
var AttemptID = String.pipe(brand("Integration.AttemptID"), annotate({ identifier: "Integration.AttemptID" }), statics((schema) => ({ create: () => schema.make("con_" + ascending()) })));
var AttemptTime = Struct({
	created: Number$1,
	expires: Number$1
});
var Attempt = class extends Class("Integration.Attempt")({
	attemptID: AttemptID,
	url: String,
	instructions: String,
	mode: Literals(["auto", "code"]),
	/** An `auto` attempt also accepts the redirect URL pasted from the browser as its `code`. */
	paste: optionalKey(Literal(true)),
	time: AttemptTime
}) {};
var AttemptStatus = Union([
	Struct({
		status: Literal("pending"),
		time: AttemptTime
	}),
	Struct({
		status: Literal("complete"),
		time: AttemptTime
	}),
	Struct({
		status: Literal("failed"),
		message: String,
		time: AttemptTime
	}),
	Struct({
		status: Literal("expired"),
		time: AttemptTime
	})
]).pipe(toTaggedUnion("status")).annotate({ identifier: "Integration.AttemptStatus" });
var CommandAttempt = Struct({
	attemptID: AttemptID,
	time: AttemptTime
}).annotate({ identifier: "Integration.CommandAttempt" });
var CommandAttemptStatus = Union([
	Struct({
		status: Literal("pending"),
		message: optional(String),
		time: AttemptTime
	}),
	Struct({
		status: Literal("complete"),
		time: AttemptTime
	}),
	Struct({
		status: Literal("failed"),
		message: String,
		time: AttemptTime
	}),
	Struct({
		status: Literal("expired"),
		time: AttemptTime
	})
]).pipe(toTaggedUnion("status")).annotate({ identifier: "Integration.CommandAttemptStatus" });
//#endregion
//#region ../schema/src/model-compatibility.ts
var ReasoningField = Union([Literals([
	"reasoning",
	"reasoning_content",
	"reasoning_text"
]), String]).annotate({ identifier: "Model.ReasoningField" });
var MaxTokensField = Literals(["max_completion_tokens", "max_tokens"]).annotate({ identifier: "Model.MaxTokensField" });
/** Where a System One decision host reads media, from models.dev `compatibility.media_input`. */
var MediaInput = Literals([
	"assets",
	"state",
	"root"
]).annotate({ identifier: "Model.MediaInput" });
var CacheFormat = Literals(["anthropic", "alibaba"]).annotate({ identifier: "Model.CacheFormat" });
var Compatibility = Struct({
	/** OpenAI Chat: assistant-message field that carries reasoning. Unset uses the streamed field, else `reasoning_content`. */
	reasoningField: ReasoningField.pipe(optional),
	/** OpenAI Chat: send the reasoning field on every prior assistant message, even when empty. */
	requireReasoning: Boolean.pipe(optional),
	/** OpenAI Chat: body field for the output token limit. Unset detects it from the provider. */
	maxTokensField: MaxTokensField.pipe(optional),
	/** OpenAI Chat: fail a stream that ends without `finish_reason`. Defaults to true. */
	requireFinishReason: Boolean.pipe(optional),
	/** OpenAI Chat: insert an assistant message between a tool result and the next user message. */
	requireAssistantAfterTool: Boolean.pipe(optional),
	/** OpenAI Chat, OpenAI Responses and Mistral: whether the endpoint accepts `prompt_cache_key`. */
	supportsPromptCacheKey: Boolean.pipe(optional),
	/** OpenAI Chat: request usage in the stream with `stream_options.include_usage`. Defaults to true. */
	streamUsage: Boolean.pipe(optional),
	/** Prompt-cache marker syntax the endpoint accepts. Overrides the route default; both send `cache_control`, and `alibaba` skips tool definitions. */
	cacheFormat: CacheFormat.pipe(optional),
	/** Anthropic Messages and Bedrock Converse: supports Anthropic's thinking-prefix mismatch controls. Overrides model-ID detection. */
	supportsThinkingBlockBinding: Boolean.pipe(optional),
	/** Anthropic Messages and OpenAI Responses: supports per-message effort updates. Overrides model-ID detection. */
	supportsEffortUpdates: Boolean.pipe(optional),
	/** System One: where the decision host reads media. Unset keeps the route default. */
	mediaInput: MediaInput.pipe(optional)
}).annotate({ identifier: "Model.Compatibility" });
var ProviderCompatibility = Struct(omit(Compatibility.fields, ["supportsThinkingBlockBinding", "supportsEffortUpdates"])).annotate({ identifier: "Provider.Compatibility" });
//#endregion
//#region ../schema/src/provider.ts
var provider_exports = /* @__PURE__ */ __exportAll({
	Activation: () => Activation,
	Cache: () => Cache,
	CacheTTL: () => CacheTTL,
	CacheWarming: () => CacheWarming,
	Compaction: () => Compaction$3,
	Encoding: () => Encoding,
	Event: () => Event$6,
	ID: () => ID$8,
	Info: () => Info$10,
	Overlays: () => Overlays$1,
	Package: () => Package,
	Provider: () => provider_exports,
	Request: () => Request$1,
	Settings: () => Settings$1,
	Tls: () => Tls,
	Transport: () => Transport
});
var ID$8 = String.pipe(brand("Provider.ID"), annotate({ identifier: "Provider.ID" }), statics((schema) => ({
	opencode: schema.make("opencode"),
	anthropic: schema.make("anthropic"),
	openai: schema.make("openai"),
	google: schema.make("google"),
	googleVertex: schema.make("google-vertex"),
	githubCopilot: schema.make("github-copilot"),
	claudeAgent: schema.make("claude-agent"),
	amazonBedrock: schema.make("amazon-bedrock"),
	azure: schema.make("azure"),
	openrouter: schema.make("openrouter"),
	mistral: schema.make("mistral"),
	gitlab: schema.make("gitlab")
})));
var Updated$3 = ephemeral({
	type: "provider.updated",
	schema: {}
});
var Event$6 = {
	Updated: Updated$3,
	Definitions: inventory(Updated$3)
};
var Package = String;
var Activation = Literals([
	"auto",
	"enabled",
	"disabled"
]);
var Compaction$3 = Union([Struct({ type: Literal("summary") }), Struct({ type: Literal("native") })]).pipe(toTaggedUnion("type")).annotate({ identifier: "Provider.Compaction" });
/** "websocket" on a route without a WebSocket channel warns and falls back to HTTP. */
var Transport = Literals(["http", "websocket"]).annotate({ identifier: "Provider.Transport" });
/** Prompt-cache lifetime such as "5m", "30m", "1h" or "24h", in models.dev's duration format. */
var CacheTTL = TemplateLiteral([Number$1, Literals([
	"ms",
	"s",
	"m",
	"h",
	"d"
])]).check(isPattern(/^\d+(ms|s|m|h|d)$/)).annotate({ identifier: "Provider.CacheTTL" });
/** Keep-alive requests for this provider's or model's sessions; overrides the top-level `warming`. */
var CacheWarming = Union([Boolean, Struct({
	interval: Union([Literal("auto"), String]).pipe(optional).annotate({ description: "Duration such as \"4 minutes\", or \"auto\" (default) for 90% of the model's cache.ttl" }),
	duration: String.pipe(optional).annotate({ description: "Duration such as \"30 minutes\"" })
})]).annotate({ identifier: "Provider.CacheWarming" });
/** Prompt-cache settings. `ttl` is sent to the provider as given; each provider accepts its own set. */
var Cache = Struct({
	ttl: CacheTTL.pipe(optional),
	warming: CacheWarming.pipe(optional)
}).annotate({ identifier: "Provider.Cache" });
/** HTTP request body compression; only endpoints known to decode it should enable it. */
var Encoding = Literals([
	"zstd",
	"gzip",
	"none"
]).annotate({ identifier: "Provider.Encoding" });
var Timeout = Union([Finite, Literal(false)]).pipe(optional);
/** Client certificate for gateways that require mutual TLS. Values are PEM text; use `{file:...}` to read a file. */
var Tls = Struct({
	cert: String.annotate({ description: "PEM client certificate, usually `{file:/path/to/client.pem}`" }),
	key: String.annotate({ description: "PEM private key, usually `{file:/path/to/client.key}`" }),
	passphrase: String.pipe(optional).annotate({ description: "Passphrase for an encrypted private key" })
}).annotate({ identifier: "Provider.Tls" });
var Settings$1 = StructWithRest(Struct({
	timeout: Timeout,
	headerTimeout: Timeout,
	chunkTimeout: Timeout,
	compaction: Compaction$3.pipe(optional),
	cache: Cache.pipe(optional),
	transport: Transport.pipe(optional),
	encoding: Encoding.pipe(optional),
	tls: Tls.pipe(optional)
}), [Record(String, Any)]).annotate({ identifier: "Provider.Settings" });
var Overlays$1 = {
	settings: Settings$1.pipe(optional),
	headers: Record(String, String).pipe(optional),
	body: Record(String, Any).pipe(optional)
};
var Request$1 = Struct({
	settings: Settings$1.pipe(withConstructorDefault(succeed({}))),
	headers: Record(String, String),
	body: Record(String, Any)
}).annotate({ identifier: "Provider.Request" });
var Info$10 = Struct({
	id: ID$8,
	canonical: ID$8.pipe(optional),
	integrationID: ID$9.pipe(optional),
	name: String,
	activation: Activation,
	package: Package,
	/** Inherited by every model of this provider; model compatibility overrides individual fields. */
	compatibility: ProviderCompatibility.pipe(optional),
	...Overlays$1
}).annotate({ identifier: "Provider.Info" }).pipe(statics(() => ({ empty: (id) => ({
	id,
	name: id,
	activation: "auto",
	package: ""
}) })));
//#endregion
//#region ../schema/src/money.ts
var USD = Finite.pipe(brand("Money.USD"), annotate({ identifier: "Money.USD" }), statics((schema) => ({ zero: schema.make(0) })));
var USDPerMillionTokens = Finite.pipe(brand("Money.USDPerMillionTokens"), annotate({ identifier: "Money.USDPerMillionTokens" }), statics((schema) => ({ zero: schema.make(0) })));
//#endregion
//#region ../schema/src/tool.ts
/** Optional wire encoding of a tool's single required string field. Execution still receives the object. */
var Freeform = Union([
	Struct({ type: Literal("text") }),
	Struct({
		type: Literal("regex"),
		pattern: String
	}),
	Struct({
		type: Literal("lark"),
		grammar: String
	})
]).annotate({ identifier: "Tool.Freeform" });
var FreeformFormat = Literals(Freeform.members.map((member) => member.fields.type.literal)).annotate({ identifier: "Tool.FreeformFormat" });
String.pipe(brand("Tool.CallID"));
TaggedError()("Tool.Error", {
	message: String,
	error: optional$1(Defect()),
	metadata: optional$1(Record(String, Unknown))
});
var TextContent = Struct({
	type: Literal("text"),
	text: String
}).annotate({ identifier: "Tool.TextContent" });
var FileContent = Struct({
	type: Literal("file"),
	uri: String,
	mime: String,
	name: optional$1(String)
}).annotate({ identifier: "Tool.FileContent" });
var Content = Union([TextContent, FileContent]).pipe(toTaggedUnion("type")).annotate({ identifier: "Tool.Content" });
//#endregion
//#region ../schema/src/model.ts
var model_exports = /* @__PURE__ */ __exportAll({
	Capabilities: () => Capabilities,
	Compatibility: () => Compatibility,
	Cost: () => Cost,
	Event: () => Event$5,
	Family: () => Family,
	ID: () => ID$7,
	Info: () => Info$9,
	MaxTokensField: () => MaxTokensField,
	MediaInput: () => MediaInput,
	Model: () => model_exports,
	Overlays: () => Overlays,
	ReasoningField: () => ReasoningField,
	Ref: () => Ref,
	Settings: () => Settings,
	Type: () => Type,
	Variant: () => Variant,
	VariantID: () => VariantID
});
var ID$7 = String.pipe(brand("Model.ID"));
var Updated$2 = ephemeral({
	type: "model.updated",
	schema: {}
});
var Event$5 = {
	Updated: Updated$2,
	Definitions: inventory(Updated$2)
};
var VariantID = String.pipe(brand("Model.VariantID"));
var Ref = Struct({
	id: ID$7,
	providerID: ID$8,
	variant: VariantID.pipe(optional)
}).annotate({ identifier: "Model.Ref" }).pipe(statics((schema) => ({ parse: (input) => {
	const providerEnd = input.indexOf("/");
	if (providerEnd <= 0) throw new Error(`Invalid model reference: ${input}`);
	const providerID = input.slice(0, providerEnd);
	const variantStart = input.indexOf("#", providerEnd + 1);
	const id = input.slice(providerEnd + 1, variantStart === -1 ? void 0 : variantStart);
	const variant = variantStart === -1 ? void 0 : input.slice(variantStart + 1);
	if (!id || providerID.includes("#") || variant !== void 0 && (!variant || variant.includes("#"))) throw new Error(`Invalid model reference: ${input}`);
	return schema.make({
		providerID: ID$8.make(providerID),
		id: ID$7.make(id),
		...variant ? { variant: VariantID.make(variant) } : {}
	});
} })));
var Family = String.pipe(brand("Model.Family"));
var Type = Union([Literals([
	"chat",
	"decision",
	"image",
	"video"
]), String]).annotate({ identifier: "Model.Type" });
var Settings = StructWithRest(Struct(pick(Settings$1.schema.fields, [
	"compaction",
	"cache",
	"encoding"
])), [Record(String, Any)]).annotate({ identifier: "Model.Settings" });
var VariantSettings = StructWithRest(Struct(omit(Settings.schema.fields, ["cache"])), Settings.records).annotate({ identifier: "Model.VariantSettings" });
var Overlays = {
	settings: Settings.pipe(optional),
	headers: Record(String, String).pipe(optional),
	body: Record(String, Any).pipe(optional)
};
var Capabilities = Struct({
	tools: Boolean,
	/** Freeform tool input formats advertised by the selected API. Absent or empty means JSON tools only. */
	freeform: ArraySchema(FreeformFormat).pipe(optional),
	input: ArraySchema(String),
	output: ArraySchema(String),
	/** Whether the model accepts a sampling temperature. Unknown when unset. */
	temperature: Boolean.pipe(optional)
}).annotate({ identifier: "Model.Capabilities" }).pipe(statics(() => ({ default: () => ({
	tools: true,
	input: ["text", "image"],
	output: ["text"]
}) })));
var Cost = Struct({
	tier: Struct({
		type: tag("context"),
		size: Int
	}).pipe(optional),
	input: USDPerMillionTokens,
	output: USDPerMillionTokens,
	cache: Struct({
		read: USDPerMillionTokens,
		write: USDPerMillionTokens
	})
}).annotate({ identifier: "Model.Cost" });
var Variant = Struct({
	id: VariantID,
	...Overlays,
	settings: VariantSettings.pipe(optional)
}).annotate({ identifier: "Model.Variant" });
var Info$9 = Struct({
	id: ID$7,
	modelID: ID$7,
	providerID: ID$8,
	canonical: ID$8.pipe(optional),
	type: Type.pipe(optional),
	family: Family.pipe(optional),
	name: String,
	compatibility: Compatibility.pipe(optional),
	package: Package.pipe(optional),
	...Overlays,
	capabilities: Capabilities,
	variants: ArraySchema(Variant),
	time: Struct({ released: Finite }),
	cost: ArraySchema(Cost),
	status: Literals([
		"alpha",
		"beta",
		"deprecated",
		"active"
	]),
	enabled: Boolean,
	limit: Struct({
		context: Int,
		input: Int.pipe(optional),
		output: Int
	})
}).annotate({ identifier: "Model.Info" }).pipe(statics(() => ({ default: (providerID, id) => ({
	id,
	modelID: id,
	providerID,
	name: id,
	capabilities: Capabilities.default(),
	variants: [],
	time: { released: 0 },
	cost: [],
	status: "active",
	enabled: true,
	limit: {
		context: 2e5,
		output: 32e3
	}
}) })));
//#endregion
//#region ../schema/src/prompt.ts
var PromptMention = Struct({
	start: Finite,
	end: Finite,
	text: String
}).annotate({ identifier: "Prompt.Mention" });
var FileSource = Union([Struct({ type: Literal("inline") }), Struct({
	type: Literal("uri"),
	uri: String
})]).pipe(toTaggedUnion("type")).annotate({ identifier: "Prompt.FileSource" });
var Base64 = String.check(makeFilter((value) => value.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/u.test(value), isPattern(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u).annotations)).annotate({ identifier: "Prompt.Base64" });
var FileAttachment = Struct({
	data: Base64,
	mime: String,
	source: FileSource,
	name: String.pipe(optional),
	description: String.pipe(optional),
	mention: PromptMention.pipe(optional)
}).annotate({ identifier: "Prompt.FileAttachment" }).pipe(statics((schema) => ({ create: (input) => schema.make({
	data: input.data,
	mime: input.mime,
	source: input.source,
	name: input.name,
	description: input.description,
	mention: input.mention
}) })));
/** `media:` and the lowercase hex SHA-256 of a stored blob's bytes. Names no server route. */
var MediaRef = String.check(isPattern(/^media:[0-9a-f]{64}$/)).annotate({ identifier: "Prompt.MediaRef" });
var { data: _, ...fileAttachmentFields } = FileAttachment.fields;
var MediaFileAttachment = Struct({
	...fileAttachmentFields,
	uri: MediaRef,
	bytes: Int.pipe(optional),
	width: Int.pipe(optional),
	height: Int.pipe(optional)
}).annotate({ identifier: "Prompt.MediaFileAttachment" });
var Attachment = Union([FileAttachment, MediaFileAttachment]).annotate({ identifier: "Prompt.Attachment" });
var AgentAttachment = Struct({
	name: String,
	mention: PromptMention.pipe(optional)
}).annotate({ identifier: "Prompt.AgentAttachment" });
var SkillAttachment = Struct({
	id: ID$12,
	name: Name$1,
	text: String.pipe(optional),
	mention: PromptMention.pipe(optional)
}).annotate({ identifier: "Prompt.SkillAttachment" });
var Prompt = Struct({
	text: String,
	files: ArraySchema(FileAttachment).pipe(optional),
	agents: ArraySchema(AgentAttachment).pipe(optional),
	skills: ArraySchema(SkillAttachment).pipe(optional)
}).annotate({ identifier: "Prompt" }).pipe(statics((schema) => ({
	equivalence: toEquivalence(schema),
	fromUserMessage: (input) => schema.make({
		text: input.text,
		...input.files === void 0 ? {} : { files: input.files },
		...input.agents === void 0 ? {} : { agents: input.agents },
		...input.skills === void 0 ? {} : { skills: input.skills }
	})
})));
//#endregion
//#region ../schema/src/session-id.ts
var SessionID = String.check(isStartingWith("ses")).pipe(brand("SessionID"), annotate({ identifier: "Session.ID" }), statics((schema) => ({ create: () => schema.make("ses_" + descending()) })));
//#endregion
//#region ../schema/src/permission.ts
var permission_exports = /* @__PURE__ */ __exportAll({
	Effect: () => Effect,
	Event: () => Event$4,
	ID: () => ID$6,
	Permission: () => permission_exports,
	Reply: () => Reply,
	Request: () => Request,
	Rule: () => Rule,
	Ruleset: () => Ruleset,
	Source: () => Source
});
var ID$6 = String.check(isStartingWith("per")).pipe(brand("Permission.ID"), annotate({ identifier: "Permission.ID" }), statics((schema) => ({ create: (id) => schema.make(id ?? "per_" + ascending()) })));
var Source = Union([Struct({
	type: Literal("tool"),
	messageID: String,
	id: String
})]).annotate({ identifier: "Permission.Source" });
var RequestFields = {
	sessionID: SessionID,
	action: String,
	resources: ArraySchema(String),
	save: ArraySchema(String).pipe(optional),
	metadata: Record(String, Unknown).pipe(optional),
	source: Source.pipe(optional),
	message: String.pipe(optional)
};
var Request = Struct({
	id: ID$6,
	...RequestFields
}).annotate({ identifier: "Permission.Request" });
var Reply = Literals([
	"once",
	"always",
	"reject"
]).annotate({ identifier: "Permission.Reply" });
var Asked = ephemeral({
	type: "permission.asked",
	schema: Request.fields
});
var Replied = ephemeral({
	type: "permission.replied",
	schema: {
		sessionID: SessionID,
		requestID: ID$6,
		reply: Reply
	}
});
var Event$4 = {
	Asked,
	Replied,
	Definitions: inventory(Asked, Replied)
};
var Effect = Literals([
	"allow",
	"deny",
	"ask"
]).annotate({ identifier: "Permission.Effect" });
var Rule = Struct({
	action: String,
	resource: String,
	effect: Effect
}).annotate({ identifier: "Permission.Rule" });
var Ruleset = ArraySchema(Rule).annotate({ identifier: "Permission.Ruleset" });
//#endregion
//#region ../schema/src/agent.ts
var agent_exports = /* @__PURE__ */ __exportAll({
	Agent: () => agent_exports,
	Color: () => Color,
	Event: () => Event$3,
	ID: () => ID$5,
	Info: () => Info$8,
	Name: () => Name
});
var Updated$1 = ephemeral({
	type: "agent.updated",
	schema: {}
});
var ID$5 = String.pipe(brand("Agent.ID"), annotate({ identifier: "Agent.ID" }));
var Name = String.pipe(brand("Agent.Name"));
var Color = String.annotate({ identifier: "Agent.Color" });
var Info$8 = Struct({
	id: ID$5,
	name: Name,
	model: Ref.pipe(optional),
	request: Request$1,
	system: String.pipe(optional),
	description: String.pipe(optional),
	mode: Literals([
		"subagent",
		"primary",
		"all"
	]),
	hidden: Boolean,
	color: Color.pipe(optional),
	steps: PositiveInt.pipe(optional),
	permissions: Ruleset
}).annotate({ identifier: "Agent.Info" }).pipe(statics(() => ({ default: (id) => ({
	id,
	name: Name.make(id),
	request: {
		settings: {},
		headers: {},
		body: {}
	},
	mode: "primary",
	hidden: false,
	permissions: [
		{
			action: "*",
			resource: "*",
			effect: "allow"
		},
		{
			action: "read",
			resource: "*.env",
			effect: "ask"
		},
		{
			action: "read",
			resource: "*.env.*",
			effect: "ask"
		},
		{
			action: "read",
			resource: "*.env.example",
			effect: "allow"
		}
	]
}) })));
var Event$3 = {
	Updated: Updated$1,
	Definitions: inventory(Updated$1)
};
//#endregion
//#region ../schema/src/project.ts
var project_exports = /* @__PURE__ */ __exportAll({
	Commands: () => Commands,
	Current: () => Current,
	Event: () => Event$2,
	ID: () => ID$4,
	Icon: () => Icon,
	Info: () => Info$7,
	Project: () => project_exports,
	Time: () => Time$1,
	UpdateInput: () => UpdateInput,
	Vcs: () => Vcs
});
var ID$4 = ProjectID;
var Vcs = String.check(isPattern(/^[a-z][a-z0-9._-]*$/u)).annotate({ identifier: "Project.Vcs" });
var Current = Struct({
	id: ID$4,
	directory: AbsolutePath,
	canonical: AbsolutePath
}).annotate({ identifier: "Project.Current" });
var Icon = Struct({
	url: optional(String),
	override: optional(String),
	color: optional(String)
}).annotate({ identifier: "Project.Icon" });
var Commands = Struct({ start: optional(String.annotate({ description: "Startup script to run when creating a new workspace (worktree)" })) }).annotate({ identifier: "Project.Commands" });
var Time$1 = Struct({
	created: NonNegativeInt,
	updated: NonNegativeInt,
	active: NonNegativeInt,
	archived: optional(NonNegativeInt)
}).annotate({ identifier: "Project.Time" });
var Info$7 = Struct({
	id: ID$4,
	canonical: AbsolutePath,
	vcs: optional(Vcs),
	name: optional(String),
	icon: optional(Icon),
	commands: optional(Commands),
	time: Time$1,
	sandboxes: ArraySchema(String)
}).annotate({ identifier: "Project" });
var UpdateInput = Struct({
	projectID: ID$4,
	canonical: optional(AbsolutePath),
	name: optional(String),
	icon: optional(Icon),
	commands: optional(Commands)
}).annotate({ identifier: "Project.UpdateInput" });
var Updated = ephemeral({
	type: "project.updated",
	schema: Info$7.fields
});
var Event$2 = {
	Updated,
	Definitions: inventory(Updated)
};
//#endregion
//#region ../schema/src/llm.ts
var FinishReason = Literals([
	"stop",
	"length",
	"tool-calls",
	"content-filter",
	"error",
	"unknown"
]);
//#endregion
//#region ../schema/src/session-metadata.ts
/**
* Host-supplied session annotations, durable and opaque to core. Keys are
* arbitrary; values must be JSON-serializable. Children and forks inherit
* the parent's current metadata unless the creator supplies its own.
*/
var SessionMetadata = Record(String, Json).annotate({ identifier: "Session.Metadata" });
var ID$3 = String.check(isStartingWith("sh_")).pipe(brand("Shell.ID"), annotate({ identifier: "Shell.ID" })).pipe(statics((schema) => {
	const create = () => schema.make("sh_" + ascending());
	return {
		create,
		ascending: (id) => id === void 0 ? create() : schema.make(id)
	};
}));
var Status = Literals([
	"running",
	"exited",
	"timeout",
	"killed"
]);
var Time = Struct({
	started: Finite.annotate({ description: "Start time in milliseconds since the Unix epoch" }),
	completed: optional(Finite).annotate({ description: "Completion time in milliseconds since the Unix epoch" })
});
var Metadata$1 = Record(String, Unknown);
var Info$6 = Struct({
	id: ID$3,
	status: Status,
	command: String,
	cwd: String,
	shell: String,
	file: String,
	pid: optional(NonNegativeInt),
	exit: optional(Finite),
	signal: optional(String),
	metadata: Metadata$1,
	time: Time
}).annotate({ identifier: "Shell.Info" });
var Created$1 = ephemeral({
	type: "shell.created",
	schema: { info: Info$6 }
});
var Exited = ephemeral({
	type: "shell.exited",
	schema: {
		id: ID$3,
		exit: optional(Finite),
		status: Status
	}
});
var Deleted$1 = ephemeral({
	type: "shell.deleted",
	schema: { id: ID$3 }
});
var Event$1 = {
	Created: Created$1,
	Exited,
	Deleted: Deleted$1,
	Definitions: inventory(Created$1, Exited, Deleted$1)
};
var CreateInput = Struct({
	command: String,
	cwd: optional(String),
	timeout: optional(NonNegativeInt),
	metadata: optional(Metadata$1)
});
var OutputInput = Struct({
	cursor: optional(NonNegativeInt),
	limit: optional(NonNegativeInt)
});
var Output = Struct({
	output: String,
	cursor: NonNegativeInt,
	size: NonNegativeInt,
	truncated: Boolean
});
//#endregion
//#region ../schema/src/session-error.ts
var Error$1 = Struct({
	type: String,
	message: String,
	status: Int.check(isBetween({
		minimum: 100,
		maximum: 599
	})).pipe(optional),
	response: Struct({ body: String }).pipe(optional),
	/** How long the provider asked to wait before trying again, counted from when the failure was recorded. */
	retryAfterMs: NonNegativeInt.pipe(optional)
}).annotate({ identifier: "Session.StructuredError" });
//#endregion
//#region ../schema/src/snapshot.ts
var ID$2 = String.pipe(brand("Snapshot.ID"), annotate({ identifier: "Snapshot.ID" }));
//#endregion
//#region ../schema/src/token-usage.ts
var Info$5 = Struct({
	input: Finite,
	output: Finite,
	reasoning: Finite,
	cache: Struct({
		read: Finite,
		write: Finite
	})
}).annotate({ identifier: "TokenUsage.Info" });
//#endregion
//#region ../schema/src/session-message.ts
var session_message_exports = /* @__PURE__ */ __exportAll({
	AgentSelected: () => AgentSelected$1,
	Assistant: () => Assistant,
	AssistantContent: () => AssistantContent,
	AssistantContentEncoded: () => AssistantContentEncoded,
	AssistantReasoning: () => AssistantReasoning,
	AssistantRetry: () => AssistantRetry,
	AssistantText: () => AssistantText,
	AssistantTool: () => AssistantTool,
	Compaction: () => Compaction$2,
	CompactionCompleted: () => CompactionCompleted,
	CompactionFailed: () => CompactionFailed,
	CompactionRunning: () => CompactionRunning,
	ID: () => ID$1,
	Idle: () => Idle,
	Info: () => Info$4,
	LocationSwitched: () => LocationSwitched,
	MediaInfo: () => MediaInfo$1,
	MediaUser: () => MediaUser$1,
	ModelSelected: () => ModelSelected$1,
	Native: () => Native,
	SessionMessage: () => session_message_exports,
	Shell: () => Shell$1,
	Skill: () => Skill$1,
	Synthetic: () => Synthetic$2,
	System: () => System,
	ToolState: () => ToolState,
	ToolStateCompleted: () => ToolStateCompleted,
	ToolStateError: () => ToolStateError,
	ToolStateRunning: () => ToolStateRunning,
	ToolStateStreaming: () => ToolStateStreaming,
	User: () => User$1
});
var ID$1 = String.check(isStartingWith("msg_")).pipe(brand("Session.Message.ID"), annotate({ identifier: "Session.Message.ID" }), statics((schema) => ({
	create: () => schema.make("msg_" + ascending()),
	fromEvent: (eventID) => schema.make(eventID.replace(/^evt_/, "msg_"))
})));
var Base$1 = {
	id: ID$1,
	metadata: Record(String, Unknown).pipe(optional),
	time: Struct({ created: DateTimeUtcFromMillis })
};
/**
* Provider-owned replay data, keyed by the producing provider's metadata fields and echoed back verbatim. A tool's
* result data is merged into its call data, so adapters must not reuse a key with a different value across the two.
*/
var Native = Record(String, Unknown).annotate({ identifier: "Session.Message.Native" });
var AgentSelected$1 = Struct({
	...Base$1,
	type: tag("agent-switched"),
	agent: ID$5,
	previous: ID$5.pipe(optional)
}).annotate({ identifier: "Session.Message.AgentSelected" });
var ModelSelected$1 = Struct({
	...Base$1,
	type: tag("model-switched"),
	model: Ref,
	previous: Ref.pipe(optional)
}).annotate({ identifier: "Session.Message.ModelSelected" });
var LocationSwitched = Struct({
	...Base$1,
	type: tag("location-switched"),
	location: Ref$2,
	projectID: ID$4.pipe(optional),
	subpath: RelativePath.pipe(optional),
	previous: Struct({
		location: Ref$2,
		projectID: ID$4.pipe(optional),
		subpath: RelativePath.pipe(optional)
	}).pipe(optional)
}).annotate({ identifier: "Session.Message.LocationSwitched" });
var User$1 = Struct({
	...Base$1,
	text: Prompt.fields.text,
	files: Prompt.fields.files,
	agents: Prompt.fields.agents,
	skills: Prompt.fields.skills,
	type: tag("user")
}).annotate({ identifier: "Session.Message.User" });
var MediaUser$1 = Struct({
	...User$1.fields,
	files: ArraySchema(Attachment).pipe(optional)
}).annotate({ identifier: "Session.Message.MediaUser" });
var Synthetic$2 = Struct({
	...Base$1,
	text: String,
	description: String.pipe(optional),
	type: tag("synthetic")
}).annotate({ identifier: "Session.Message.Synthetic" });
var System = Struct({
	...Base$1,
	type: tag("system"),
	/** The model-facing update text, frozen at emit time. */
	text: String,
	/** A short human-readable summary for transcript display. */
	description: String.pipe(optional)
}).annotate({ identifier: "Session.Message.System" });
var Skill$1 = Struct({
	...Base$1,
	type: tag("skill"),
	skill: ID$12,
	name: Name$1,
	text: String
}).annotate({ identifier: "Session.Message.Skill" });
var Shell$1 = Struct({
	...Base$1,
	type: tag("shell"),
	shellID: ID$3,
	command: String,
	status: Status,
	exit: Number$1.pipe(optional),
	output: Output.pipe(optional),
	time: Struct({
		created: DateTimeUtcFromMillis,
		completed: DateTimeUtcFromMillis.pipe(optional)
	})
}).annotate({ identifier: "Session.Message.Shell" });
var ToolStateStreaming = Struct({
	status: tag("streaming"),
	input: String
}).annotate({ identifier: "Session.Message.ToolState.Streaming" });
var ToolStateRunning = Struct({
	status: tag("running"),
	input: Record(String, Unknown),
	metadata: Record(String, Json)
}).annotate({ identifier: "Session.Message.ToolState.Running" });
var ToolStateCompleted = Struct({
	status: tag("completed"),
	input: Record(String, Unknown),
	content: NonEmptyArray(Content),
	metadata: Record(String, Json).pipe(optional)
}).annotate({ identifier: "Session.Message.ToolState.Completed" });
var ToolStateError = Struct({
	status: tag("error"),
	input: Record(String, Unknown),
	error: Error$1,
	content: NonEmptyArray(Content).pipe(optional),
	metadata: Record(String, Json).pipe(optional)
}).annotate({ identifier: "Session.Message.ToolState.Error" });
var ToolState = Union([
	ToolStateStreaming,
	ToolStateRunning,
	ToolStateCompleted,
	ToolStateError
]).pipe(toTaggedUnion("status"));
var AssistantTool = Struct({
	type: tag("tool"),
	id: String,
	name: String,
	executed: Boolean.pipe(optional),
	native: Native.pipe(optional),
	state: ToolState,
	time: Struct({
		created: DateTimeUtcFromMillis,
		ran: DateTimeUtcFromMillis.pipe(optional),
		completed: DateTimeUtcFromMillis.pipe(optional)
	})
}).annotate({ identifier: "Session.Message.Assistant.Tool" });
var AssistantText = Struct({
	type: tag("text"),
	text: String,
	native: Native.pipe(optional)
}).annotate({ identifier: "Session.Message.Assistant.Text" });
var AssistantReasoning = Struct({
	type: tag("reasoning"),
	text: String,
	native: Native.pipe(optional),
	time: Struct({
		created: DateTimeUtcFromMillis,
		completed: DateTimeUtcFromMillis.pipe(optional)
	}).pipe(optional)
}).annotate({ identifier: "Session.Message.Assistant.Reasoning" });
var AssistantContent = Union([
	AssistantText,
	AssistantReasoning,
	AssistantTool
]).pipe(toTaggedUnion("type"));
var AssistantContentEncoded = toEncoded(AssistantContent).annotate({ identifier: "Session.Message.AssistantContent.Encoded" });
var AssistantRetry = Struct({
	attempt: PositiveInt,
	at: DateTimeUtcFromMillis,
	error: Error$1
}).annotate({ identifier: "Session.Message.Assistant.Retry" });
var Assistant = Struct({
	...Base$1,
	type: tag("assistant"),
	agent: ID$5,
	model: Ref,
	content: AssistantContent.pipe(ArraySchema),
	snapshot: Struct({
		start: ID$2.pipe(optional),
		end: ID$2.pipe(optional),
		files: ArraySchema(RelativePath).pipe(optional)
	}).pipe(optional),
	finish: FinishReason.pipe(optional),
	rawFinish: String.pipe(optional),
	/** Step-level native data, such as a provider's reason for blocking a response. */
	native: Native.pipe(optional),
	cost: USD.pipe(optional),
	tokens: Info$5.pipe(optional),
	error: Error$1.pipe(optional),
	retry: AssistantRetry.pipe(optional),
	time: Struct({
		created: DateTimeUtcFromMillis,
		/** When the provider streamed the first output token, before the rest of the response. */
		firstToken: DateTimeUtcFromMillis.pipe(optional),
		/** When the provider response body ended, before tool settlement. */
		streamed: DateTimeUtcFromMillis.pipe(optional),
		completed: DateTimeUtcFromMillis.pipe(optional)
	})
}).annotate({ identifier: "Session.Message.Assistant" });
var CompactionBase = {
	type: tag("compaction"),
	...Base$1
};
/** Usage of the compaction request itself, not the size of the resulting context. */
var CompactionUsage = {
	cost: USD.pipe(optional),
	tokens: Info$5.pipe(optional)
};
var CompactionRunning = Struct({
	...CompactionBase,
	status: tag("running"),
	reason: Literals(["auto", "manual"]),
	summary: String
}).annotate({ identifier: "Session.Message.Compaction.Running" });
var CompactionCompleted = Struct({
	...CompactionBase,
	status: tag("completed"),
	reason: Literals(["auto", "manual"]),
	model: Ref.pipe(optional),
	/** A provider compaction stores its replacement window in `native.messages`, replayed instead of `summary`. */
	native: Native.pipe(optional),
	summary: String,
	...CompactionUsage
}).annotate({ identifier: "Session.Message.Compaction.Completed" });
var CompactionFailed = Struct({
	...CompactionBase,
	status: tag("failed"),
	reason: Literals(["auto", "manual"]),
	error: Error$1,
	...CompactionUsage
}).annotate({ identifier: "Session.Message.Compaction.Failed" });
var Compaction$2 = Union([
	CompactionRunning,
	CompactionCompleted,
	CompactionFailed
]).pipe(toTaggedUnion("status"), annotate({ identifier: "Session.Message.Compaction" }));
var Idle = Struct({
	...Base$1,
	type: tag("idle"),
	outcome: Literals([
		"succeeded",
		"failed",
		"interrupted"
	]),
	error: Error$1.pipe(optional)
}).annotate({ identifier: "Session.Message.Idle" });
var Info$4 = Union([
	AgentSelected$1,
	ModelSelected$1,
	LocationSwitched,
	User$1,
	Synthetic$2,
	System,
	Skill$1,
	Shell$1,
	Assistant,
	Compaction$2,
	Idle
]).annotate({ identifier: "Session.Message.Info" });
/** {@link Info} with {@link MediaUser} for clients that opt into `experimental-media-uri`. */
var MediaInfo$1 = Union([
	AgentSelected$1,
	ModelSelected$1,
	LocationSwitched,
	MediaUser$1,
	Synthetic$2,
	System,
	Skill$1,
	Shell$1,
	Assistant,
	Compaction$2,
	Idle
]).annotate({ identifier: "Session.Message.MediaInfo" });
//#endregion
//#region ../schema/src/file-diff.ts
var Info$3 = Struct({
	file: String,
	patch: String,
	additions: NonNegativeInt,
	deletions: NonNegativeInt,
	status: Literals([
		"added",
		"deleted",
		"modified"
	]),
	/** Marks the entry a folder listing adds for itself when it stopped before showing or checking every entry. */
	more: Literal(true).pipe(optional)
}).annotate({ identifier: "FileDiff.Info" });
/** V1 snapshot and persisted session diff shape. */
var LegacyInfo = Struct({
	file: String.pipe(optional),
	patch: String.pipe(optional),
	additions: Finite,
	deletions: Finite,
	status: Literals([
		"added",
		"deleted",
		"modified"
	]).pipe(optional)
}).annotate({ identifier: "FileDiff.LegacyInfo" });
//#endregion
//#region ../schema/src/session-revert.ts
var Revert = Struct({
	messageID: ID$1,
	/** Legacy V1 compatibility state. */
	partID: String.pipe(optional),
	snapshot: ID$2.pipe(optional),
	files: ArraySchema(Info$3).pipe(optional)
}).annotate({ identifier: "Session.Revert" });
var FileDiffV1 = Struct({
	path: String,
	status: Literals([
		"added",
		"modified",
		"deleted"
	]),
	additions: Finite,
	deletions: Finite,
	patch: String
});
var RevertV1 = Struct({
	messageID: ID$1,
	partID: String.pipe(optional),
	snapshot: String.pipe(optional),
	diff: String.pipe(optional),
	files: ArraySchema(FileDiffV1).pipe(optional)
}).annotate({ identifier: "Session.RevertV1" });
var PersistedCurrent = Revert.pipe(decodeTo(Struct({
	source: tag("current"),
	revert: toType(Revert)
}), transform$1({
	decode: (revert) => ({
		source: "current",
		revert
	}),
	encode: (value) => value.revert
})));
var PersistedLegacy = RevertV1.pipe(decodeTo(Struct({
	source: tag("legacy"),
	revert: toType(RevertV1)
}), transform$1({
	decode: (revert) => ({
		source: "legacy",
		revert
	}),
	encode: (value) => value.revert
})));
Union([PersistedCurrent, PersistedLegacy]).pipe(toTaggedUnion("source"), decodeTo(toType(Revert), transform$1({
	decode: (persisted) => {
		if (persisted.source === "current") return persisted.revert;
		return Revert.make({
			messageID: persisted.revert.messageID,
			partID: persisted.revert.partID,
			snapshot: persisted.revert.snapshot ? ID$2.make(persisted.revert.snapshot) : void 0,
			files: persisted.revert.files?.map((file) => ({
				file: file.path,
				status: file.status,
				additions: file.additions,
				deletions: file.deletions,
				patch: file.patch
			}))
		});
	},
	encode: (revert) => ({
		source: "current",
		revert
	})
})), annotate({ identifier: "Session.Revert.Persisted" }));
//#endregion
//#region ../schema/src/instruction.ts
var Key$1 = String.check(isPattern(/^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._/-]*$/u)).pipe(brand("Instruction.Key"), annotate({ identifier: "Instruction.Key" }));
var Hash = String.check(isPattern(/^[a-f0-9]{64}$/u)).pipe(brand("Instruction.Hash"), annotate({ identifier: "Instruction.Hash" }));
var Values = Record(Key$1, Hash);
var Removed = Literal("removed");
Removed.make("removed");
var Delta = Record(String, Union([Hash, Removed]));
//#endregion
//#region ../schema/src/instruction-entry.ts
/**
* Slash-free client-facing key for one API-managed instruction entry. The server
* derives the namespaced Instructions key as `api/<key>`, keeping the
* `api/*` namespace enforced by construction.
*/
var Key = String.check(isPattern(/^[a-z0-9][a-z0-9._-]*$/u)).annotate({
	identifier: "InstructionEntry.Key",
	description: "Instruction entry key (lowercase alphanumerics plus . _ -)"
});
var Info$2 = Struct({
	key: Key,
	value: Json.annotate({ description: "JSON value attached to the session's instructions" })
}).annotate({ identifier: "InstructionEntry.Info" });
var Snapshot = ArraySchema(Struct({
	...Info$2.fields,
	removed: Boolean
})).annotate({ identifier: "InstructionEntry.Snapshot" });
var ValueTooLargeError = class extends TaggedError()("InstructionEntryValueTooLargeError", {
	actualBytes: Int,
	maxBytes: Int,
	message: String
}, { httpApiStatus: 413 }) {};
//#endregion
//#region ../schema/src/session-inbox.ts
var session_inbox_exports = /* @__PURE__ */ __exportAll({
	Compaction: () => Compaction$1,
	CompactionPayload: () => CompactionPayload,
	Delivery: () => Delivery,
	Info: () => Info$1,
	Item: () => Item,
	MediaInfo: () => MediaInfo,
	MediaUser: () => MediaUser,
	MediaUserPayload: () => MediaUserPayload,
	Move: () => Move,
	MovePayload: () => MovePayload,
	SessionInbox: () => session_inbox_exports,
	Synthetic: () => Synthetic$1,
	SyntheticPayload: () => SyntheticPayload,
	User: () => User,
	UserPayload: () => UserPayload
});
var Delivery = Literals(["steer", "queue"]).annotate({ identifier: "Session.Inbox.Delivery" });
var UserPayload = Struct({
	...Prompt.fields,
	metadata: Record(String, Unknown).pipe(optional)
}).annotate({ identifier: "Session.Inbox.UserPayload" });
var MediaUserPayload = Struct({
	...UserPayload.fields,
	files: ArraySchema(Attachment).pipe(optional)
}).annotate({ identifier: "Session.Inbox.MediaUserPayload" });
var SyntheticPayload = Struct({
	text: String,
	description: String.pipe(optional),
	metadata: Record(String, Unknown).pipe(optional)
}).annotate({ identifier: "Session.Inbox.SyntheticPayload" });
var CompactionPayload = Struct({}).annotate({ identifier: "Session.Inbox.CompactionPayload" });
var MovePayload = Struct({
	location: Ref$2,
	projectID: ID$4,
	subpath: RelativePath.pipe(optional)
}).annotate({ identifier: "Session.Inbox.MovePayload" });
var UserItem = Struct({
	type: tag("user"),
	payload: UserPayload,
	delivery: Delivery
});
var SyntheticItem = Struct({
	type: tag("synthetic"),
	payload: SyntheticPayload,
	delivery: Delivery
});
var CompactionItem = Struct({
	type: tag("compaction"),
	payload: CompactionPayload,
	delivery: Delivery
});
var MoveItem = Struct({
	type: tag("move"),
	payload: MovePayload,
	delivery: Delivery
});
var Item = Union([
	UserItem,
	SyntheticItem,
	CompactionItem,
	MoveItem
]).pipe(toTaggedUnion("type"), annotate({ identifier: "Session.Inbox.Item" }));
var Enqueued = {
	id: ID$1,
	sessionID: SessionID,
	time: Struct({ created: DateTimeUtcFromMillis })
};
var User = Struct({
	...Enqueued,
	...UserItem.fields
}).annotate({ identifier: "Session.Inbox.User" });
var MediaUser = Struct({
	...User.fields,
	payload: MediaUserPayload
}).annotate({ identifier: "Session.Inbox.MediaUser" });
var Synthetic$1 = Struct({
	...Enqueued,
	...SyntheticItem.fields
}).annotate({ identifier: "Session.Inbox.Synthetic" });
var Compaction$1 = Struct({
	...Enqueued,
	...CompactionItem.fields
}).annotate({ identifier: "Session.Inbox.Compaction" });
var Move = Struct({
	...Enqueued,
	...MoveItem.fields
}).annotate({ identifier: "Session.Inbox.Move" });
var Info$1 = Union([
	User,
	Synthetic$1,
	Compaction$1,
	Move
]).pipe(toTaggedUnion("type"), annotate({ identifier: "Session.Inbox.Info" }));
/** {@link Info} with {@link MediaUser} for clients that opt into `experimental-media-uri`. */
var MediaInfo = Union([
	MediaUser,
	Synthetic$1,
	Compaction$1,
	Move
]).pipe(toTaggedUnion("type"), annotate({ identifier: "Session.Inbox.MediaInfo" }));
//#endregion
//#region ../schema/src/session-fork.ts
var Boundary = Union([Struct({
	type: Literal("before"),
	messageID: ID$1
}), Struct({
	type: Literal("through"),
	messageID: ID$1
})]).annotate({ identifier: "Session.ForkBoundary" });
//#endregion
//#region ../schema/src/session-event.ts
var session_event_exports = /* @__PURE__ */ __exportAll({
	AgentSelected: () => AgentSelected,
	All: () => All,
	Archived: () => Archived,
	Compaction: () => Compaction,
	Created: () => Created,
	Definitions: () => Definitions,
	Deleted: () => Deleted,
	Durable: () => Durable,
	DurableDefinitions: () => DurableDefinitions,
	EphemeralDefinitions: () => EphemeralDefinitions,
	Execution: () => Execution,
	Forked: () => Forked,
	InboxCancelled: () => InboxCancelled,
	InboxDelivered: () => InboxDelivered,
	InboxDeliveryChanged: () => InboxDeliveryChanged,
	InboxEnqueued: () => InboxEnqueued,
	InstructionsUpdated: () => InstructionsUpdated,
	MessageContentUpdated: () => MessageContentUpdated,
	MetadataUpdated: () => MetadataUpdated,
	ModelSelected: () => ModelSelected,
	Moved: () => Moved,
	Permissions: () => Permissions,
	Reasoning: () => Reasoning,
	Renamed: () => Renamed,
	RetryScheduled: () => RetryScheduled,
	RevertEvent: () => RevertEvent,
	SessionEvent: () => session_event_exports,
	Shell: () => Shell,
	Skill: () => Skill,
	Step: () => Step,
	Synthetic: () => Synthetic,
	Text: () => Text,
	Tool: () => Tool,
	Unarchived: () => Unarchived,
	UsageRecorded: () => UsageRecorded,
	UsageUpdated: () => UsageUpdated,
	Viewed: () => Viewed
});
var Base = { sessionID: SessionID };
var options = { durable: {
	aggregate: "sessionID",
	version: 1
} };
var Created = durable({
	type: "session.created",
	...options,
	schema: {
		...Base,
		projectID: ID$4,
		location: Ref$2,
		subpath: RelativePath.pipe(optional),
		parentID: SessionID.pipe(optional),
		slug: String,
		title: String.pipe(optional),
		agent: ID$5.pipe(optional),
		model: Ref.pipe(optional),
		/** Host-supplied annotations resolved at creation, including any inherited from a parent. */
		metadata: SessionMetadata.pipe(optional),
		permissions: Ruleset.pipe(optional),
		version: String
	}
});
var AgentSelected = durable({
	type: "session.agent.selected",
	...options,
	schema: {
		...Base,
		agent: ID$5,
		previous: ID$5.pipe(optional)
	}
});
var ModelSelected = durable({
	type: "session.model.selected",
	...options,
	schema: {
		...Base,
		model: Ref,
		previous: Ref.pipe(optional)
	}
});
var Moved = durable({
	type: "session.moved",
	...options,
	schema: {
		...Base,
		...MovePayload.fields
	}
});
var Renamed = durable({
	type: "session.renamed",
	...options,
	schema: {
		...Base,
		title: String
	}
});
var MetadataUpdated = durable({
	type: "session.metadata.updated",
	...options,
	schema: {
		...Base,
		metadata: SessionMetadata
	}
});
var Permissions = durable({
	type: "session.permissions",
	...options,
	schema: {
		...Base,
		permissions: Ruleset
	}
});
var Viewed = durable({
	type: "session.viewed",
	...options,
	schema: {
		...Base,
		/** Epoch-millisecond idle watermark the viewer observed; projection never marks a newer idle transition viewed. */
		idle: Finite
	}
});
var Archived = durable({
	type: "session.archived",
	...options,
	schema: Base
});
var Unarchived = durable({
	type: "session.unarchived",
	...options,
	schema: Base
});
var MessageContentUpdated = durable({
	type: "session.message.content.updated",
	...options,
	schema: {
		...Base,
		messageID: ID$1,
		content: ArraySchema(AssistantContentEncoded)
	}
});
var UsageRecorded = durable({
	type: "session.usage.recorded",
	...options,
	schema: {
		...Base,
		source: Literals([
			"title",
			"compaction",
			"generate"
		]),
		cost: USD,
		tokens: Info$5
	}
});
var UsageUpdated = ephemeral({
	type: "session.usage.updated",
	schema: {
		...Base,
		cost: USD,
		tokens: Info$5
	}
});
var Deleted = durable({
	type: "session.deleted",
	durable: {
		aggregate: "sessionID",
		version: 2
	},
	schema: Base
});
var Forked = durable({
	type: "session.forked",
	durable: {
		aggregate: "sessionID",
		version: 2
	},
	schema: {
		...Base,
		parentID: SessionID,
		boundary: Boundary,
		instructions: Values.pipe(optional),
		instructionEntries: Snapshot.pipe(optional)
	}
});
var InboxRef = {
	...Base,
	inboxID: ID$1
};
var InboxDelivered = durable({
	type: "session.inbox.delivered",
	...options,
	schema: InboxRef
});
var InboxEnqueued = durable({
	type: "session.inbox.enqueued",
	...options,
	schema: {
		...InboxRef,
		item: Item
	}
});
var InboxCancelled = durable({
	type: "session.inbox.cancelled",
	...options,
	schema: InboxRef
});
var InboxDeliveryChanged = durable({
	type: "session.inbox.delivery.changed",
	...options,
	schema: {
		...InboxRef,
		delivery: Delivery
	}
});
var Execution;
(function(_Execution) {
	_Execution.Started = durable({
		type: "session.execution.started",
		...options,
		schema: Base
	});
	_Execution.Succeeded = durable({
		type: "session.execution.succeeded",
		...options,
		schema: Base
	});
	_Execution.Failed = durable({
		type: "session.execution.failed",
		...options,
		schema: {
			...Base,
			error: Error$1
		}
	});
	_Execution.Interrupted = durable({
		type: "session.execution.interrupted",
		...options,
		schema: {
			...Base,
			reason: Literals([
				"user",
				"shutdown",
				"superseded",
				"inactivity"
			])
		}
	});
})(Execution || (Execution = {}));
var InstructionsUpdated = durable({
	type: "session.instructions.updated",
	durable: {
		aggregate: "sessionID",
		version: 2
	},
	schema: {
		...Base,
		delta: Delta,
		/**
		* The rendered chronological update shown to the model, frozen at emit time.
		* Absent for the initial baseline observation and for deltas that render empty.
		*/
		text: String.pipe(optional)
	}
});
var Synthetic = durable({
	type: "session.synthetic",
	...options,
	schema: {
		...Base,
		text: String,
		description: String.pipe(optional),
		metadata: Record(String, Unknown).pipe(optional)
	}
});
var Skill;
(function(_Skill) {
	_Skill.Activated = durable({
		type: "session.skill.activated",
		...options,
		schema: {
			...Base,
			id: ID$12,
			name: Name$1,
			text: String
		}
	});
})(Skill || (Skill = {}));
var Shell;
(function(_Shell) {
	_Shell.Started = durable({
		type: "session.shell.started",
		...options,
		schema: {
			...Base,
			shell: Info$6
		}
	});
	_Shell.Ended = durable({
		type: "session.shell.ended",
		...options,
		schema: {
			...Base,
			shell: Info$6,
			output: Output
		}
	});
})(Shell || (Shell = {}));
var Step;
(function(_Step) {
	_Step.Started = durable({
		type: "session.step.started",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1,
			agent: ID$5,
			model: Ref,
			snapshot: ID$2.pipe(optional),
			/** Request dispatch time, before waiting for provider output. */
			started: NonNegativeInt
		}
	});
	_Step.FirstToken = durable({
		type: "session.step.first-token",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1
		}
	});
	_Step.Streamed = durable({
		type: "session.step.streamed",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1
		}
	});
	_Step.Ended = durable({
		type: "session.step.ended",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1,
			finish: FinishReason,
			rawFinish: String.pipe(optional),
			native: Native.pipe(optional),
			cost: USD,
			tokens: Info$5,
			snapshot: ID$2.pipe(optional),
			files: ArraySchema(RelativePath).pipe(optional)
		}
	});
	_Step.Failed = durable({
		type: "session.step.failed",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1,
			error: Error$1,
			finish: Literals(["content-filter"]).pipe(optional),
			rawFinish: String.pipe(optional),
			native: Native.pipe(optional),
			cost: USD.pipe(optional),
			tokens: Info$5.pipe(optional),
			snapshot: ID$2.pipe(optional),
			files: ArraySchema(RelativePath).pipe(optional)
		}
	});
})(Step || (Step = {}));
var Text;
(function(_Text) {
	_Text.Started = durable({
		type: "session.text.started",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1,
			ordinal: NonNegativeInt
		}
	});
	_Text.Delta = ephemeral({
		type: "session.text.delta",
		schema: {
			...Base,
			assistantMessageID: ID$1,
			ordinal: NonNegativeInt,
			delta: String
		}
	});
	_Text.Ended = durable({
		type: "session.text.ended",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1,
			ordinal: NonNegativeInt,
			text: String,
			native: Native.pipe(optional)
		}
	});
})(Text || (Text = {}));
var Reasoning;
(function(_Reasoning) {
	_Reasoning.Started = durable({
		type: "session.reasoning.started",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1,
			ordinal: NonNegativeInt,
			native: Native.pipe(optional)
		}
	});
	_Reasoning.Delta = ephemeral({
		type: "session.reasoning.delta",
		schema: {
			...Base,
			assistantMessageID: ID$1,
			ordinal: NonNegativeInt,
			delta: String
		}
	});
	_Reasoning.Ended = durable({
		type: "session.reasoning.ended",
		...options,
		schema: {
			...Base,
			assistantMessageID: ID$1,
			ordinal: NonNegativeInt,
			text: String,
			native: Native.pipe(optional)
		}
	});
})(Reasoning || (Reasoning = {}));
var Tool;
(function(_Tool) {
	const ToolBase = {
		...Base,
		assistantMessageID: ID$1,
		id: String
	};
	let Input;
	(function(_Input) {
		_Input.Started = durable({
			type: "session.tool.input.started",
			...options,
			schema: {
				...ToolBase,
				name: String
			}
		});
		_Input.Delta = ephemeral({
			type: "session.tool.input.delta",
			schema: {
				...ToolBase,
				delta: String
			}
		});
		_Input.Ended = durable({
			type: "session.tool.input.ended",
			...options,
			schema: {
				...ToolBase,
				text: String
			}
		});
	})(Input || (Input = _Tool.Input || (_Tool.Input = {})));
	_Tool.Called = durable({
		type: "session.tool.called",
		...options,
		schema: {
			...ToolBase,
			input: Record(String, Unknown),
			executed: Boolean,
			native: Native.pipe(optional)
		}
	});
	_Tool.Progress = ephemeral({
		type: "session.tool.progress",
		schema: {
			...ToolBase,
			metadata: Record(String, Json)
		}
	});
	_Tool.Success = durable({
		type: "session.tool.success",
		durable: {
			aggregate: "sessionID",
			version: 2
		},
		schema: {
			...ToolBase,
			content: NonEmptyArray(Content),
			metadata: Record(String, Json).pipe(optional),
			executed: Boolean,
			native: Native.pipe(optional)
		}
	});
	_Tool.Failed = durable({
		type: "session.tool.failed",
		durable: {
			aggregate: "sessionID",
			version: 2
		},
		schema: {
			...ToolBase,
			error: Error$1,
			content: NonEmptyArray(Content).pipe(optional),
			metadata: Record(String, Json).pipe(optional),
			executed: Boolean,
			native: Native.pipe(optional)
		}
	});
})(Tool || (Tool = {}));
var RetryScheduled = durable({
	type: "session.retry.scheduled",
	...options,
	schema: {
		...Base,
		assistantMessageID: ID$1,
		attempt: PositiveInt,
		at: NonNegativeInt,
		error: Error$1
	}
});
var Compaction;
(function(_Compaction) {
	const Started = _Compaction.Started = durable({
		type: "session.compaction.started",
		...options,
		schema: {
			...Base,
			reason: Literals(["auto", "manual"]),
			inputID: ID$1.pipe(optional)
		}
	});
	_Compaction.Delta = ephemeral({
		type: "session.compaction.delta",
		schema: {
			...Base,
			text: String
		}
	});
	_Compaction.Ended = durable({
		type: "session.compaction.ended",
		...options,
		schema: {
			...Base,
			reason: Started.data.fields.reason,
			model: CompactionCompleted.fields.model,
			native: CompactionCompleted.fields.native,
			text: String,
			cost: CompactionCompleted.fields.cost,
			tokens: CompactionCompleted.fields.tokens
		}
	});
	_Compaction.Failed = durable({
		type: "session.compaction.failed",
		...options,
		schema: {
			...Base,
			reason: Started.data.fields.reason,
			error: Error$1,
			inputID: ID$1.pipe(optional),
			cost: CompactionFailed.fields.cost,
			tokens: CompactionFailed.fields.tokens
		}
	});
})(Compaction || (Compaction = {}));
var RevertEvent;
(function(_RevertEvent) {
	_RevertEvent.Staged = durable({
		type: "session.revert.staged",
		...options,
		schema: {
			...Base,
			revert: Revert
		}
	});
	_RevertEvent.Cleared = durable({
		type: "session.revert.cleared",
		...options,
		schema: Base
	});
	_RevertEvent.Committed = durable({
		type: "session.revert.committed",
		...options,
		schema: {
			...Base,
			to: ID$1
		}
	});
})(RevertEvent || (RevertEvent = {}));
var Definitions = inventory(Created, AgentSelected, ModelSelected, Moved, Renamed, MetadataUpdated, Permissions, Viewed, Archived, Unarchived, UsageUpdated, Deleted, Forked, InboxDelivered, InboxEnqueued, InboxCancelled, InboxDeliveryChanged, Execution.Started, Execution.Succeeded, Execution.Failed, Execution.Interrupted, InstructionsUpdated, Synthetic, Skill.Activated, Shell.Started, Shell.Ended, Step.Started, Step.FirstToken, Step.Streamed, Step.Ended, Step.Failed, Text.Started, Text.Delta, Text.Ended, Reasoning.Started, Reasoning.Delta, Reasoning.Ended, Tool.Input.Started, Tool.Input.Delta, Tool.Input.Ended, Tool.Called, Tool.Progress, Tool.Success, Tool.Failed, RetryScheduled, Compaction.Started, Compaction.Delta, Compaction.Ended, Compaction.Failed, RevertEvent.Staged, RevertEvent.Cleared, RevertEvent.Committed);
var DurableDefinitions = inventory(...Definitions.filter((definition) => definition.durability === "durable"), UsageRecorded, MessageContentUpdated);
var EphemeralDefinitions = inventory(...Definitions.filter((definition) => definition.durability === "ephemeral"));
var Durable = Union(DurableDefinitions, { mode: "oneOf" }).annotate({ identifier: "Session.Event.Durable" }).pipe(toTaggedUnion("type"));
var All = Union([Durable, ...EphemeralDefinitions], { mode: "oneOf" }).pipe(toTaggedUnion("type"));
//#endregion
//#region ../schema/src/session.ts
var session_exports = /* @__PURE__ */ __exportAll({
	Event: () => Event,
	ForkBoundary: () => ForkBoundary,
	ID: () => ID,
	Info: () => Info,
	ListAnchor: () => ListAnchor,
	ListCursor: () => ListCursor,
	ListFilter: () => ListFilter,
	Metadata: () => Metadata,
	Revert: () => Revert,
	Session: () => session_exports
});
var ID = SessionID;
var Metadata = SessionMetadata;
var Event = session_event_exports;
var ForkBoundary = Boundary;
var Info = Struct({
	id: ID,
	parentID: ID.pipe(optional),
	fork: Struct({
		sessionID: ID,
		boundary: ForkBoundary
	}).pipe(optional),
	projectID: ID$4,
	agent: ID$5.pipe(optional),
	model: Ref.pipe(optional),
	cost: USD,
	tokens: Info$5,
	/** Outcome of the last completed execution, recorded at `time.idle`. Absent until a run reaches a terminal transition. */
	outcome: Literals([
		"succeeded",
		"failed",
		"interrupted"
	]).pipe(optional),
	time: Struct({
		created: DateTimeUtcFromMillis,
		updated: DateTimeUtcFromMillis,
		/** Start of the most recent execution. While it runs, `idle` still holds the previous execution's end. Resuming after a restart starts a new execution. */
		busy: DateTimeUtcFromMillis.pipe(optional),
		/** End of the most recent completed execution. */
		idle: DateTimeUtcFromMillis.pipe(optional),
		viewed: DateTimeUtcFromMillis.pipe(optional),
		archived: DateTimeUtcFromMillis.pipe(optional)
	}),
	title: String.pipe(optional),
	location: Ref$2,
	subpath: RelativePath.pipe(optional),
	metadata: Metadata.pipe(optional),
	/** Evaluated after the agent's rules; the last matching rule wins. */
	permissions: Ruleset.pipe(optional),
	revert: Revert.pipe(optional)
}).annotate({ identifier: "Session.Info" });
var ListAnchor = Struct({
	id: ID,
	time: Finite,
	direction: Literals(["previous", "next"])
}).annotate({ identifier: "Session.ListAnchor" });
var ListFilterFields = {
	order: Literals(["asc", "desc"]).pipe(optional$1).annotate({ description: "Session order for the first page. Use desc for newest first or asc for oldest first." }),
	search: String.pipe(optional$1),
	parentID: Union([ID, Null.pipe(encodeTo(Literal("null"), {
		decode: transform(() => null),
		encode: transform(() => "null")
	}))]).annotate({ description: "Filter by parent session. Use null to return only root sessions." }).pipe(optional$1),
	archived: Literals(["true", "false"]).pipe(decodeTo(Boolean, {
		decode: transform((value) => value === "true"),
		encode: transform((value) => value ? "true" : "false")
	})).annotate({ description: "Filter by archive state. Use true to return only archived sessions or false to exclude them. Omit to include both." }).pipe(optional$1)
};
var ListFilter = Struct({
	...ListFilterFields,
	directory: AbsolutePath.pipe(optional$1),
	project: ID$4.pipe(optional$1),
	subpath: RelativePath.pipe(optional$1)
}).annotate({ identifier: "Session.ListFilter" });
var ListCursorInput = Union([
	Struct({
		...ListFilterFields,
		directory: AbsolutePath,
		anchor: ListAnchor
	}),
	Struct({
		...ListFilterFields,
		project: ID$4,
		subpath: RelativePath.pipe(optional$1),
		anchor: ListAnchor
	}),
	Struct({
		...ListFilterFields,
		anchor: ListAnchor
	})
]);
var ListCursorJson = fromJsonString(ListCursorInput);
var encodeListCursor = encodeSync(ListCursorJson);
var decodeListCursor = decodeUnknownEffect(ListCursorJson);
var ListCursor = String.pipe(brand("SessionsCursor"), annotate({
	identifier: "SessionsCursor",
	description: "Opaque pagination cursor returned as cursor.previous or cursor.next in the previous response."
}), statics((schema) => {
	const make$1 = make(schema);
	return {
		make: (input) => make$1(encode(encodeListCursor(input))),
		parse: (input) => suspend$1(() => {
			const result = decodeString(input);
			return isFailure(result) ? fail("Invalid cursor") : decodeListCursor(result.success).pipe(mapError(() => "Invalid cursor"));
		})
	};
}));
//#endregion
export { Info$8 as $, ID$11 as $t, LocationSwitched as A, provider_exports as At, CreateInput as B, Info$11 as Bt, Info$3 as C, DateTimeUtcFromMillis as Cn, model_exports as Ct, Compaction$2 as D, optional as Dn, ID$8 as Dt, Assistant as E, RelativePath as En, Event$6 as Et, Synthetic$2 as F, AttemptStatus as Ft, OutputInput as G, Event$8 as Gt, ID$3 as H, integration_exports as Ht, System as I, CommandAttempt as It, Info$7 as J, Reply$1 as Jt, Event$2 as K, ID$10 as Kt, User$1 as L, CommandAttemptStatus as Lt, ModelSelected$1 as M, ProviderCompatibility as Mt, Shell$1 as N, Attempt as Nt, ID$1 as O, statics as On, Info$10 as Ot, Skill$1 as P, AttemptID as Pt, ID$5 as Q, Event$9 as Qt, session_message_exports as R, Event$7 as Rt, Revert as S, AbsolutePath as Sn, VariantID as St, AgentSelected$1 as T, PositiveInt as Tn, USDPerMillionTokens as Tt, Info$6 as U, Answer as Ut, Event$1 as V, MethodID as Vt, Output as W, Detail as Wt, project_exports as X, CreateInput$1 as Xt, UpdateInput as Y, form_exports as Yt, Event$3 as Z, Entry as Zt, UserPayload as _, response as _n, ID$7 as _t, Metadata as a, skill_exports as an, Request as at, Key as b, ascending as bn, Settings as bt, Durable as c, durable as cn, SessionID as ct, Delivery as d, event_exports as dn, FileSource as dt, credential_exports as en, agent_exports as et, MediaUser as f, inventory as fn, Prompt as ft, User as g, location_exports as gn, Family as gt, Synthetic$1 as h, PublicRef as hn, Event$5 as ht, ListFilter as i, Info$14 as in, Reply as it, MediaUser$1 as j, Compatibility as jt, Idle as k, Settings$1 as kt, DurableDefinitions as l, durableMap as ln, AgentAttachment as lt, MovePayload as m, PublicInfo as mn, Capabilities as mt, Info as n, Event$10 as nn, Event$4 as nt, session_exports as o, ID$13 as on, Ruleset as ot, Move as p, latest as pn, PromptMention as pt, ID$4 as q, Info$12 as qt, ListCursor as r, ID$12 as rn, ID$6 as rt, Definitions as s, Seq as sn, permission_exports as st, ID as t, IntegrationID as tn, Effect as tt, Compaction$1 as u, ephemeral as un, Base64 as ut, session_inbox_exports as v, WorkspaceID as vn, Info$9 as vt, LegacyInfo as w, NonNegativeInt as wn, USD as wt, ValueTooLargeError as x, descending as xn, Type as xt, Info$2 as y, ProjectID as yn, Ref as yt, Info$5 as z, ID$9 as zt };
