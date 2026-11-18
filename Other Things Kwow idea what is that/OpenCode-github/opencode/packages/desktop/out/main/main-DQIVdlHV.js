import { I as Literals, U as NullOr, at as String$1, l as Boolean, o as ArraySchema, ot as Struct } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { i as parseConfig, n as formatConfig } from "./config-DonQESw9.js";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import path from "node:path";
import { access, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
//#region ../gui-plugins/src/customize/contract.ts
var DocKind = Literals([
	"skill",
	"command",
	"agent"
]);
/** A skill, a slash command or an agent the user wrote. See `docs.ts`. */
var Doc = Struct({
	kind: DocKind,
	name: String$1,
	description: String$1,
	body: String$1,
	/** Skill only: the AI may pick it up by itself. */
	auto: Boolean,
	/** Agent only: who starts it. */
	mode: Literals([
		"subagent",
		"primary",
		"all"
	])
});
/** A tool server in the settings file. */
var Connector = Struct({
	name: String$1,
	type: Literals(["remote", "local"]),
	/** The web address, or the command line. */
	target: String$1,
	/** It signs in with a token saved on the Plugins page; without one the app's server leaves it out. */
	token: Boolean
});
/** A command that runs by itself at a moment in the AI's work. See `settings.ts`. */
var Hook = Struct({
	id: String$1,
	name: String$1,
	event: Literals([
		"before-tool",
		"after-tool",
		"finished"
	]),
	tools: String$1,
	command: String$1,
	enabled: Boolean
});
var CustomizeState = Struct({
	/** The settings folder everything here is stored in. */
	directory: String$1,
	/** The user's own skills, commands and agents, as read from their files. */
	docs: ArraySchema(Doc),
	/** The always-on instructions: the text of `AGENTS.md` in the settings folder. Empty when there is none. */
	instructions: String$1,
	/** The saved memories (`memory.md`), one short fact each; every chat sees them. */
	memories: ArraySchema(String$1),
	/** The response style in use: `normal`, `short`, `explain`, `learn`, `hinglish` or `custom`. */
	style: String$1,
	/** The user's own style text; empty unless `style` is `custom`. */
	styleText: String$1,
	connectors: ArraySchema(Connector),
	hooks: ArraySchema(Hook),
	/** Why something could not be read; null when all of it reads fine. */
	problem: NullOr(String$1)
});
/** The Customize page's work in the main process: the files and settings behind what the user makes. */
var Customize = Ipc.define({
	id: "customize",
	state: CustomizeState,
	methods: {
		/** Reads everything again from disk. */
		refresh: {},
		/**
		* Writes a skill, command or agent. `previous` is the name it was opened under: null for a new one, which is
		* rejected when the name is taken; a different name moves it. Rejects with the reason on a bad name.
		*/
		saveDoc: { input: Struct({
			doc: Doc,
			previous: NullOr(String$1)
		}) },
		/** Deletes a skill (its whole folder), command or agent. */
		deleteDoc: { input: Struct({
			kind: DocKind,
			name: String$1
		}) },
		/** Replaces the always-on instructions; empty text removes the file. */
		saveInstructions: { input: String$1 },
		/** Replaces the saved memories; an empty list removes the file. */
		saveMemories: { input: ArraySchema(String$1) },
		/** Sets the response style; `text` is used only by `custom`. */
		setStyle: { input: Struct({
			id: String$1,
			text: String$1
		}) },
		/** Adds a tool server to the settings file, or replaces the one with that name. Rejects with the reason. */
		saveConnector: { input: Connector },
		/** Takes a tool server out of the settings file. */
		deleteConnector: { input: String$1 },
		/** Adds a hook (empty `id`) or replaces the one with that id. */
		saveHook: { input: Hook },
		deleteHook: { input: String$1 }
	}
});
//#endregion
//#region ../gui-plugins/src/customize/docs.ts
/** Names are folder and file names and slash-command words: small letters, digits and dashes. */
function validName(name) {
	return /^[a-z0-9][a-z0-9-]{0,47}$/.test(name);
}
/** The folder of one kind inside the settings folder. */
function kindFolder(kind, directory) {
	return path.join(directory, kind === "skill" ? "skills" : kind === "command" ? "commands" : "agents");
}
/** The file a doc is stored in. */
function docFile(kind, directory, name) {
	const folder = kindFolder(kind, directory);
	return kind === "skill" ? path.join(folder, name, "SKILL.md") : path.join(folder, `${name}.md`);
}
var quote = (value) => JSON.stringify(value);
/** The file's text: front matter, then the body. */
function formatDoc(doc) {
	return `---\n${(doc.kind === "skill" ? [
		`name: ${quote(doc.name)}`,
		`description: ${quote(doc.description)}`,
		...doc.auto ? [] : ["disable-model-invocation: true"]
	] : doc.kind === "command" ? [`description: ${quote(doc.description)}`] : [`description: ${quote(doc.description)}`, `mode: ${doc.mode}`]).join("\n")}\n---\n\n${doc.body.trim()}\n`;
}
/** One front matter value: a quoted string as written by `formatDoc`, or plain text as a person writes it. */
function readValue(raw) {
	const value = raw.trim();
	if (value.startsWith("\"") && value.endsWith("\"") && value.length >= 2) try {
		const parsed = JSON.parse(value);
		if (typeof parsed === "string") return parsed;
	} catch {
		return value.slice(1, -1);
	}
	return value.replace(/^'(.*)'$/, "$1");
}
/** Reads a file's text back. A file without front matter is all body. */
function parseDoc(kind, name, text) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
	const fields = new Map((match?.[1] ?? "").split(/\r?\n/).flatMap((line) => {
		const at = line.indexOf(":");
		return at > 0 ? [[line.slice(0, at).trim(), readValue(line.slice(at + 1))]] : [];
	}));
	const mode = fields.get("mode");
	return {
		kind,
		name,
		description: fields.get("description") ?? "",
		body: (match ? match[2] ?? "" : text).trim(),
		auto: fields.get("disable-model-invocation") !== "true",
		mode: mode === "primary" || mode === "all" ? mode : "subagent"
	};
}
/** A command line split into its words; double quotes keep spaces together. */
function splitCommand(text) {
	return [...text.matchAll(/"([^"]*)"|(\S+)/g)].map((match) => match[1] ?? match[2] ?? "");
}
//#endregion
//#region ../gui-plugins/src/customize/memory.ts
var header = "# Memory\n\nThings the user asked the AI to remember. One per line.\n\n";
/** The memories in a memory file, in order. Lines that are not "- ..." bullets are ignored. */
function parseMemories(text) {
	return (text ?? "").split(/\r?\n/).flatMap((line) => {
		const match = line.match(/^\s*[-*]\s+(.*\S)\s*$/);
		return match ? [match[1]] : [];
	});
}
/** The memory file for a list of memories. */
function formatMemories(memories) {
	return header + memories.map((memory) => `- ${memory.replace(/\s+/g, " ").trim()}`).join("\n") + "\n";
}
/** The list with one more memory; unchanged when it is empty or already there (ignoring case). */
function addMemory(memories, text) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (clean === "" || memories.some((memory) => memory.toLowerCase() === clean.toLowerCase())) return [...memories];
	return [...memories, clean];
}
//#endregion
//#region ../gui-plugins/src/customize/settings.ts
function isObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Connector names are settings keys and the name the AI calls the tools by. */
function validConnectorName(name) {
	return /^[a-z0-9][a-z0-9_-]{0,39}$/.test(name);
}
var serversOf = (config) => isObject(config.mcp) && isObject(config.mcp.servers) ? config.mcp.servers : {};
/** The settings with a tool server added under `name`, replacing one already there. */
function withConnector(config, name, server) {
	return {
		...config,
		mcp: {
			...isObject(config.mcp) ? config.mcp : {},
			servers: {
				...serversOf(config),
				[name]: server
			}
		}
	};
}
/** The settings with the tool server `name` taken out; unchanged when there is none. */
function withoutConnector(config, name) {
	if (!(name in serversOf(config))) return config;
	const rest = Object.fromEntries(Object.entries(serversOf(config)).filter(([key]) => key !== name));
	return {
		...config,
		mcp: {
			...isObject(config.mcp) ? config.mcp : {},
			servers: rest
		}
	};
}
/** Every tool server in the settings, by name. */
function listConnectors(config) {
	const servers = serversOf(config);
	return Object.entries(servers).flatMap(([name, server]) => {
		if (!isObject(server)) return [];
		if (server.type === "remote" && typeof server.url === "string") {
			const token = (isObject(server.headers) ? Object.values(server.headers) : []).some((value) => typeof value === "string" && value.includes("{user-env:"));
			return [{
				name,
				type: "remote",
				target: server.url,
				token
			}];
		}
		if (server.type !== "local" || !Array.isArray(server.command)) return [];
		const words = server.command.filter((word) => typeof word === "string");
		return [{
			name,
			type: "local",
			target: (words[0] === "cmd" && words[1] === "/c" ? words.slice(2) : words).map((word) => /\s/.test(word) ? `"${word}"` : word).join(" "),
			token: false
		}];
	});
}
/**
* What a connector writes under `mcp.servers`. Throws with the reason for a web address that is not http(s) or an
* empty command.
*/
function connectorServer(input, platform) {
	if (input.type === "remote") {
		const url = URL.parse(input.target.trim());
		if (!url || url.protocol !== "https:" && url.protocol !== "http:") throw new Error("The address must start with https:// or http://");
		return {
			type: "remote",
			url: url.href
		};
	}
	const words = splitCommand(input.target);
	if (words.length === 0) throw new Error("Type the command that starts the server.");
	return {
		type: "local",
		command: platform === "win32" ? [
			"cmd",
			"/c",
			...words
		] : words
	};
}
var strings = (value) => Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
var samePath = (a, b) => {
	const normal = (value) => value.replaceAll("\\", "/").toLowerCase();
	return normal(a) === normal(b);
};
/** The settings with `file` in, or out of, the instruction files OpenCode loads into every chat. */
function withInstructionFile(config, file, present) {
	const rest = strings(config.instructions).filter((item) => !samePath(item, file));
	const next = present ? [...rest, file] : rest;
	if (next.length === 0) {
		const { instructions: _dropped, ...others } = config;
		return others;
	}
	return {
		...config,
		instructions: next
	};
}
/**
* A response style: standing instructions about how the AI answers, as apart from what it knows.
* `normal` adds nothing; `custom` is the user's own text.
*/
var styles = {
	normal: "",
	short: "Keep every answer short. Lead with the result in one or two sentences. Do not narrate your steps or repeat what the user said. Use a list only when there are three or more separate items. Give detail only when the user asks for it.",
	explain: "While you work, explain your choices. After each meaningful step, add two or three plain sentences: what you did, why you chose this way over the obvious alternative, and what to watch out for. Keep the explanations separate from the code so they are easy to skip.",
	learn: "The user is learning to code. Do the work, and teach while you do it: name each concept the first time you use it and say in one plain sentence what it means, show the smallest example that works before the full version, and end with one small thing the user can try changing to see what happens.",
	hinglish: "Reply in simple Hinglish: Hindi written in Latin letters, mixed with the common English technical words. Use short sentences and everyday words. When you must use a technical term, say in a few words what it means. Keep code, file names and commands exactly as they are, in English."
};
var styleMark = /^<!-- apna-style: ([a-z]+) -->\r?\n?/;
/** The response style file's text. */
function formatStyle(id, custom) {
	return `<!-- apna-style: ${id} -->\n# Response style\n\n${id === "custom" ? custom.trim() : styles[id]}\n`;
}
/** Reads the response style file back; a missing or foreign file is `normal`. */
function parseStyle(text) {
	const id = text === void 0 ? void 0 : styleMark.exec(text)?.[1];
	if (id === "custom") return {
		id,
		custom: (text ?? "").replace(styleMark, "").replace(/^# Response style\r?\n/, "").trim()
	};
	return {
		id: id !== void 0 && id in styles ? id : "normal",
		custom: ""
	};
}
/** Reads `hooks.json`; anything that is not a well-formed hook is left out. */
function parseHooks(text) {
	if (text === void 0 || text.trim() === "") return [];
	const parsed = JSON.parse(text);
	return (isObject(parsed) && Array.isArray(parsed.hooks) ? parsed.hooks : []).flatMap((item) => {
		if (!isObject(item)) return [];
		const event = item.event;
		if (event !== "before-tool" && event !== "after-tool" && event !== "finished") return [];
		if (typeof item.id !== "string" || typeof item.command !== "string") return [];
		return [{
			id: item.id,
			name: typeof item.name === "string" ? item.name : item.id,
			event,
			tools: typeof item.tools === "string" ? item.tools : "*",
			command: item.command,
			enabled: item.enabled !== false
		}];
	});
}
function formatHooks(hooks) {
	return `${JSON.stringify({ hooks }, null, 2)}\n`;
}
//#endregion
//#region ../gui-plugins/src/customize/main.ts
var exists = (file) => access(file).then(() => true, () => false);
var readText = (file) => readFile(file, "utf8").catch(() => void 0);
var messageOf = (error) => error instanceof Error ? error.message : String(error);
var kinds = [
	"skill",
	"command",
	"agent"
];
var setup = (ctx) => {
	const log = ctx.log;
	const directory = process.env.OPENCODE_CONFIG_DIR || path.join(homedir(), ".config", "opencode");
	const instructionsFile = path.join(directory, "AGENTS.md");
	const styleFile = path.join(directory, "response-style.md");
	const hooksFile = path.join(directory, "hooks.json");
	const memoryFile = path.join(directory, "memory.md");
	const shown = { value: {
		directory,
		docs: [],
		instructions: "",
		memories: [],
		style: "normal",
		styleText: "",
		connectors: [],
		hooks: [],
		problem: null
	} };
	/** Written beside the file and moved into place, so a crash never leaves half a file. */
	const write = async (file, text) => {
		await mkdir(path.dirname(file), { recursive: true });
		await writeFile(`${file}.tmp`, text, "utf8");
		await rename(`${file}.tmp`, file);
	};
	/** The settings file: an existing `opencode.json` keeps its name, else `opencode.jsonc`. */
	const configFile = async () => {
		const jsonc = path.join(directory, "opencode.jsonc");
		const json = path.join(directory, "opencode.json");
		return await exists(jsonc) || !await exists(json) ? jsonc : json;
	};
	const readConfig = async () => parseConfig(await readText(await configFile()) ?? "");
	/** Reads the settings right before changing them, so a change made elsewhere since is kept. */
	const changeConfig = async (change) => {
		const config = await readConfig();
		const next = change(config);
		if (next !== config) await write(await configFile(), formatConfig(next));
	};
	const readDocs = async (kind) => {
		const entries = await readdir(kindFolder(kind, directory), { withFileTypes: true }).catch(() => []);
		const names = kind === "skill" ? entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name) : entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md")).map((entry) => entry.name.slice(0, -3));
		return (await Promise.all(names.map(async (name) => {
			const text = await readText(docFile(kind, directory, name));
			return text === void 0 ? void 0 : parseDoc(kind, name, text);
		}))).filter((doc) => doc !== void 0).toSorted((a, b) => a.name.localeCompare(b.name));
	};
	const refresh = async () => {
		try {
			const style = parseStyle(await readText(styleFile));
			shown.value = {
				directory,
				docs: (await Promise.all(kinds.map(readDocs))).flat(),
				instructions: await readText(instructionsFile) ?? "",
				memories: parseMemories(await readText(memoryFile)),
				style: style.id,
				styleText: style.custom,
				connectors: listConnectors(await readConfig()),
				hooks: parseHooks(await readText(hooksFile)),
				problem: null
			};
		} catch (error) {
			shown.value = {
				...shown.value,
				problem: messageOf(error)
			};
		}
		provider.changed();
	};
	/** Runs a change, then shows what is on disk; a failure is logged and passed on to the page. */
	const act = async (name, change) => {
		try {
			await change();
		} catch (error) {
			log.write("error", `customize: ${name} failed`, { error: messageOf(error) });
			throw error;
		} finally {
			await refresh();
		}
	};
	const saveDoc = (input) => act("save", async () => {
		const doc = input.doc;
		const kind = doc.kind;
		if (!validName(doc.name)) throw new Error("Use small letters, digits and dashes for the name, such as my-skill.");
		if (doc.body.trim() === "") throw new Error("Write what it should do.");
		const file = docFile(kind, directory, doc.name);
		const moved = input.previous !== null && input.previous !== doc.name;
		if ((input.previous === null || moved) && await exists(file)) throw new Error(`"${doc.name}" already exists.`);
		if (moved && validName(input.previous ?? "")) {
			const from = kind === "skill" ? path.dirname(docFile(kind, directory, input.previous ?? "")) : docFile(kind, directory, input.previous ?? "");
			const to = kind === "skill" ? path.dirname(file) : file;
			await mkdir(path.dirname(to), { recursive: true });
			await rename(from, to);
		}
		await write(file, formatDoc(doc));
	});
	const deleteDoc = (input) => act("delete", async () => {
		if (!validName(input.name)) throw new Error("That is not a name from this page.");
		const file = docFile(input.kind, directory, input.name);
		await rm(input.kind === "skill" ? path.dirname(file) : file, {
			recursive: true,
			force: true
		});
	});
	const saveInstructions = (text) => act("instructions", async () => {
		if (text.trim() === "") return rm(instructionsFile, { force: true });
		await write(instructionsFile, `${text.trim()}\n`);
	});
	const saveMemories = (list) => act("memory", async () => {
		const clean = list.reduce((kept, memory) => addMemory(kept, memory), []);
		if (clean.length === 0) return rm(memoryFile, { force: true });
		await write(memoryFile, formatMemories(clean));
	});
	const setStyle = (input) => act("style", async () => {
		const id = input.id === "custom" || input.id in styles ? input.id : "normal";
		const on = id !== "normal" && (id !== "custom" || input.text.trim() !== "");
		if (id === "custom" && !on) throw new Error("Write how the AI should answer.");
		if (on) await write(styleFile, formatStyle(id, input.text));
		await changeConfig((config) => withInstructionFile(config, styleFile, on));
		if (!on) await rm(styleFile, { force: true });
	});
	const saveConnector = (input) => act("connector", async () => {
		if (!validConnectorName(input.name)) throw new Error("Use small letters, digits, dashes and underscores for the name, such as my-tools.");
		const server = connectorServer(input, process.platform);
		await changeConfig((config) => withConnector(config, input.name, server));
	});
	const deleteConnector = (name) => act("connector", () => changeConfig((config) => withoutConnector(config, name)));
	const saveHook = (input) => act("hook", async () => {
		if (input.command.trim() === "") throw new Error("Type the command to run.");
		if (input.name.trim() === "") throw new Error("Give it a name.");
		const hooks = parseHooks(await readText(hooksFile));
		const hook = {
			...input,
			id: input.id === "" ? randomUUID() : input.id,
			name: input.name.trim(),
			command: input.command.trim(),
			tools: input.tools.trim() === "" ? "*" : input.tools.trim()
		};
		await write(hooksFile, formatHooks(hooks.some((item) => item.id === hook.id) ? hooks.map((item) => item.id === hook.id ? hook : item) : [...hooks, hook]));
	});
	const deleteHook = (id) => act("hook", async () => {
		const hooks = parseHooks(await readText(hooksFile));
		await write(hooksFile, formatHooks(hooks.filter((item) => item.id !== id)));
	});
	const provider = ctx.provide(Customize, {
		state: () => shown.value,
		refresh,
		saveDoc,
		deleteDoc,
		saveInstructions,
		saveMemories,
		setStyle,
		saveConnector,
		deleteConnector,
		saveHook,
		deleteHook
	});
	refresh();
};
//#endregion
export { setup as default };
