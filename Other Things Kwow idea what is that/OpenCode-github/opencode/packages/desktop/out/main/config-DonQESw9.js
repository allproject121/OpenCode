import path from "node:path";
//#region ../gui-plugins/src/plugin-store/config.ts
/**
* What a tool server item writes under `mcp.servers`. `directory` is this app's settings folder. A token is never
* written: the header names the user's environment variable as `{user-env:NAME}`, and this build's workflow plugin
* fills it in each time the settings load (OpenCode's own `{env:NAME}` would need the app reopened).
*/
/** How long a tool server started on this machine may take to start and list its tools. */
var localStartupMs = 12e4;
function serverOf(item, directory, platform) {
	if (item.server.type === "remote") return item.token ? {
		type: "remote",
		url: item.server.url,
		oauth: false,
		headers: { Authorization: `Bearer {user-env:${item.token.variable}}` }
	} : {
		type: "remote",
		url: item.server.url
	};
	const environment = Object.fromEntries(Object.entries(item.server.environment ?? {}).map(([name, value]) => [name, value.startsWith("{config}/") ? path.join(directory, value.slice(9)) : value]));
	return {
		type: "local",
		command: platform === "win32" ? [
			"cmd",
			"/c",
			...item.server.command
		] : [...item.server.command],
		...Object.keys(environment).length > 0 ? { environment } : {},
		timeout: {
			startup: localStartupMs,
			catalog: localStartupMs
		}
	};
}
function isObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Removes `//` and block comments and trailing commas from a settings file, leaving strings as they are, so the
* rest parses as JSON.
*/
function stripComments(text) {
	const out = [];
	const state = {
		index: 0,
		string: false
	};
	while (state.index < text.length) {
		const char = text[state.index] ?? "";
		const next = text[state.index + 1] ?? "";
		if (state.string) {
			out.push(char);
			if (char === "\\") {
				out.push(next);
				state.index += 2;
				continue;
			}
			if (char === "\"") state.string = false;
			state.index += 1;
			continue;
		}
		if (char === "\"") {
			state.string = true;
			out.push(char);
			state.index += 1;
			continue;
		}
		if (char === "/" && next === "/") {
			const end = text.indexOf("\n", state.index);
			state.index = end < 0 ? text.length : end;
			continue;
		}
		if (char === "/" && next === "*") {
			const end = text.indexOf("*/", state.index + 2);
			state.index = end < 0 ? text.length : end + 2;
			continue;
		}
		out.push(char);
		state.index += 1;
	}
	return out.join("").replace(/,(\s*[}\]])/g, "$1");
}
/** Reads a settings file's text. Empty text is an empty object; anything that is not an object is rejected. */
function parseConfig(text) {
	const stripped = stripComments(text).trim();
	if (stripped === "") return {};
	const value = JSON.parse(stripped);
	if (!isObject(value)) throw new Error("The settings file does not hold an object.");
	return value;
}
/** Two file paths that name the same place on Windows: either slash, any letter case, no trailing slash. */
function samePath(a, b) {
	const normal = (value) => value.replaceAll("\\", "/").replace(/\/+$/, "").toLowerCase();
	return normal(a) === normal(b);
}
var strings = (value) => Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
/** The `plugins` entries as their package strings; an entry may be a string or `{ package, options }`. */
function pluginSpecs(config) {
	return Array.isArray(config.plugins) ? config.plugins.flatMap((item) => typeof item === "string" ? [item] : isObject(item) && typeof item.package === "string" ? [item.package] : []) : [];
}
var servers = (config) => isObject(config.mcp) && isObject(config.mcp.servers) ? config.mcp.servers : {};
/** Whether the settings already hold this entry. */
function hasEntry(config, entry) {
	if (entry.kind === "mcp") return entry.key in servers(config);
	if (entry.kind === "plugin") return pluginSpecs(config).some((spec) => samePath(spec, entry.spec));
	return strings(config.skills).some((item) => samePath(item, entry.path));
}
/** The settings with the entry added. Settings that already hold it are returned unchanged. */
function addEntry(config, entry) {
	if (hasEntry(config, entry)) return config;
	if (entry.kind === "mcp") return {
		...config,
		mcp: {
			...isObject(config.mcp) ? config.mcp : {},
			servers: {
				...servers(config),
				[entry.key]: entry.server
			}
		}
	};
	if (entry.kind === "plugin") return {
		...config,
		plugins: [...Array.isArray(config.plugins) ? config.plugins : [], entry.spec]
	};
	return {
		...config,
		skills: [...strings(config.skills), entry.path]
	};
}
/** The settings with the entry taken out; everything else, and the order of what stays, is kept. */
function removeEntry(config, entry) {
	if (!hasEntry(config, entry)) return config;
	if (entry.kind === "mcp") {
		const rest = Object.fromEntries(Object.entries(servers(config)).filter(([key]) => key !== entry.key));
		return {
			...config,
			mcp: {
				...isObject(config.mcp) ? config.mcp : {},
				servers: rest
			}
		};
	}
	if (entry.kind === "plugin") return {
		...config,
		plugins: (Array.isArray(config.plugins) ? config.plugins : []).filter((item) => {
			return !samePath(typeof item === "string" ? item : isObject(item) && typeof item.package === "string" ? item.package : "", entry.spec);
		})
	};
	return {
		...config,
		skills: strings(config.skills).filter((item) => !samePath(item, entry.path))
	};
}
/** The text written back: a one-line note, then plain JSON. Comments that were in the file are not kept. */
function formatConfig(config) {
	return `// Apna OpenCode ki settings. Plugins wala panna is file ko khud badalta hai.\n${JSON.stringify(config, null, 2)}\n`;
}
//#endregion
export { removeEntry as a, parseConfig as i, formatConfig as n, serverOf as o, hasEntry as r, addEntry as t };
