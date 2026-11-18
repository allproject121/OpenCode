import { I as Literals, U as NullOr, X as Record, at as String$1, o as ArraySchema, ot as Struct } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { a as removeEntry, i as parseConfig, n as formatConfig, o as serverOf, r as hasEntry, t as addEntry } from "./config-DonQESw9.js";
import { homedir } from "node:os";
import path from "node:path";
import { once } from "node:events";
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
//#region ../gui-plugins/src/plugin-store/catalog.ts
/**
* The list offered on the page. Tool servers come first: in a coding agent most useful "plugins" are tool servers.
* Every entry is a public, widely used project; nothing here is fetched until the user presses Add.
*/
var catalog = [
	{
		id: "context7",
		category: "code",
		kind: "mcp",
		name: "Context7",
		link: "https://github.com/upstash/context7",
		server: {
			type: "remote",
			url: "https://mcp.context7.com/mcp"
		}
	},
	{
		id: "playwright",
		category: "browser",
		kind: "mcp",
		name: "Playwright",
		link: "https://github.com/microsoft/playwright-mcp",
		server: {
			type: "local",
			command: [
				"npx",
				"-y",
				"@playwright/mcp@latest"
			]
		}
	},
	{
		id: "chrome-devtools",
		category: "browser",
		kind: "mcp",
		name: "Chrome DevTools",
		link: "https://github.com/ChromeDevTools/chrome-devtools-mcp",
		server: {
			type: "local",
			command: [
				"npx",
				"-y",
				"chrome-devtools-mcp@latest"
			]
		}
	},
	{
		id: "github",
		category: "code",
		kind: "mcp",
		name: "GitHub",
		link: "https://github.com/github/github-mcp-server",
		token: {
			variable: "GITHUB_PERSONAL_ACCESS_TOKEN",
			page: "https://github.com/settings/tokens/new?description=Apna%20OpenCode&scopes=repo,read:org,read:user"
		},
		server: {
			type: "remote",
			url: "https://api.githubcopilot.com/mcp/"
		}
	},
	{
		id: "figma",
		category: "design",
		kind: "mcp",
		name: "Figma",
		link: "https://github.com/figma/mcp-server-guide",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.figma.com/mcp"
		}
	},
	{
		id: "sequential-thinking",
		category: "think",
		kind: "mcp",
		name: "Sequential Thinking",
		link: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
		server: {
			type: "local",
			command: [
				"npx",
				"-y",
				"@modelcontextprotocol/server-sequential-thinking"
			]
		}
	},
	{
		id: "memory",
		category: "think",
		kind: "mcp",
		name: "Memory",
		link: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
		server: {
			type: "local",
			command: [
				"npx",
				"-y",
				"@modelcontextprotocol/server-memory"
			],
			environment: { MEMORY_FILE_PATH: "{config}/memory.jsonl" }
		}
	},
	{
		id: "figma-plugin",
		category: "design",
		kind: "plugin",
		name: "Figma skills (OpenCode ka plugin)",
		link: "https://github.com/anomalyco/opencode/tree/dev/packages/plugins/figma",
		needsSignIn: true,
		local: "packages/plugins/figma",
		spec: "git+https://github.com/anomalyco/opencode.git#path:packages/plugins/figma"
	},
	{
		id: "superpowers",
		category: "skills",
		kind: "skills",
		name: "Superpowers (skills)",
		link: "https://github.com/obra/superpowers",
		repository: "https://github.com/obra/superpowers.git",
		folder: "skills"
	},
	{
		id: "anthropic-skills",
		category: "skills",
		kind: "skills",
		name: "Anthropic skills (docs, PDF, Excel, PowerPoint, design)",
		link: "https://github.com/anthropics/skills",
		repository: "https://github.com/anthropics/skills.git",
		folder: "skills"
	},
	{
		id: "deepwiki",
		category: "code",
		kind: "mcp",
		name: "DeepWiki",
		link: "https://docs.devin.ai/work-with-devin/deepwiki-mcp",
		server: {
			type: "remote",
			url: "https://mcp.deepwiki.com/mcp"
		}
	},
	{
		id: "svelte",
		category: "code",
		kind: "mcp",
		name: "Svelte docs",
		link: "https://svelte.dev/docs/mcp/overview",
		server: {
			type: "remote",
			url: "https://mcp.svelte.dev/mcp"
		}
	},
	{
		id: "sentry",
		category: "code",
		kind: "mcp",
		name: "Sentry",
		link: "https://docs.sentry.io/product/sentry-mcp/",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.sentry.dev/mcp"
		}
	},
	{
		id: "semgrep",
		category: "code",
		kind: "mcp",
		name: "Semgrep (security scan)",
		link: "https://github.com/semgrep/mcp",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.semgrep.ai/mcp"
		}
	},
	{
		id: "canva",
		category: "design",
		kind: "mcp",
		name: "Canva",
		link: "https://www.canva.dev/docs/connect/canva-mcp-server-setup/",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.canva.com/mcp"
		}
	},
	{
		id: "exa",
		category: "search",
		kind: "mcp",
		name: "Exa web search",
		link: "https://docs.exa.ai/reference/exa-mcp",
		server: {
			type: "remote",
			url: "https://mcp.exa.ai/mcp"
		}
	},
	{
		id: "microsoft-learn",
		category: "search",
		kind: "mcp",
		name: "Microsoft Learn docs",
		link: "https://github.com/MicrosoftDocs/mcp",
		server: {
			type: "remote",
			url: "https://learn.microsoft.com/api/mcp"
		}
	},
	{
		id: "huggingface",
		category: "search",
		kind: "mcp",
		name: "Hugging Face",
		link: "https://huggingface.co/settings/mcp",
		server: {
			type: "remote",
			url: "https://huggingface.co/mcp"
		}
	},
	{
		id: "supabase",
		category: "data",
		kind: "mcp",
		name: "Supabase",
		link: "https://supabase.com/docs/guides/getting-started/mcp",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.supabase.com/mcp"
		}
	},
	{
		id: "neon",
		category: "data",
		kind: "mcp",
		name: "Neon (Postgres)",
		link: "https://neon.com/docs/ai/neon-mcp-server",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.neon.tech/mcp"
		}
	},
	{
		id: "vercel",
		category: "deploy",
		kind: "mcp",
		name: "Vercel",
		link: "https://vercel.com/docs/mcp/vercel-mcp",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.vercel.com"
		}
	},
	{
		id: "netlify",
		category: "deploy",
		kind: "mcp",
		name: "Netlify",
		link: "https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://netlify-mcp.netlify.app/mcp"
		}
	},
	{
		id: "cloudflare",
		category: "deploy",
		kind: "mcp",
		name: "Cloudflare (Workers, KV, D1)",
		link: "https://github.com/cloudflare/mcp-server-cloudflare",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://bindings.mcp.cloudflare.com/mcp"
		}
	},
	{
		id: "cloudflare-docs",
		category: "deploy",
		kind: "mcp",
		name: "Cloudflare docs",
		link: "https://github.com/cloudflare/mcp-server-cloudflare",
		server: {
			type: "remote",
			url: "https://docs.mcp.cloudflare.com/mcp"
		}
	},
	{
		id: "aws-knowledge",
		category: "deploy",
		kind: "mcp",
		name: "AWS docs",
		link: "https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server",
		server: {
			type: "remote",
			url: "https://knowledge-mcp.global.api.aws"
		}
	},
	{
		id: "notion",
		category: "work",
		kind: "mcp",
		name: "Notion",
		link: "https://developers.notion.com/docs/mcp",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.notion.com/mcp"
		}
	},
	{
		id: "linear",
		category: "work",
		kind: "mcp",
		name: "Linear",
		link: "https://linear.app/docs/mcp",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.linear.app/mcp"
		}
	},
	{
		id: "atlassian",
		category: "work",
		kind: "mcp",
		name: "Jira & Confluence (Atlassian)",
		link: "https://support.atlassian.com/rovo/docs/getting-started-with-the-atlassian-remote-mcp-server/",
		needsSignIn: true,
		server: {
			type: "remote",
			url: "https://mcp.atlassian.com/v1/mcp"
		}
	}
];
//#endregion
//#region ../gui-plugins/src/plugin-store/contract.ts
var PluginStoreState = Struct({
	/** The settings file the page changes. */
	file: String$1,
	/** Catalog ids that the settings file holds now. */
	installed: ArraySchema(String$1),
	/** The id being added or removed; null while idle. */
	busy: NullOr(String$1),
	/** Why the settings file could not be read; null when it reads fine. */
	problem: NullOr(String$1),
	/** For each catalog id that works with a token: whether one is saved (`ready`) or not (`missing`). */
	tokens: Record(String$1, Literals(["missing", "ready"]))
});
/** The Plugins page's work in the main process: reading and changing this app's settings file. */
var PluginStore = Ipc.define({
	id: "plugin-store",
	state: PluginStoreState,
	methods: {
		/** Reads the settings file again. */
		refresh: {},
		/** Adds a catalog item to the settings file, fetching a skills pack first. Rejects with the reason on failure. */
		add: { input: String$1 },
		/** Takes a catalog item out of the settings file. A fetched skills pack stays on disk. */
		remove: { input: String$1 },
		/**
		* Saves an item's token as the user's environment variable, or clears it when `value` is empty. Never written
		* to a file. Rejects with the reason on failure.
		*/
		setToken: { input: Struct({
			id: String$1,
			value: String$1
		}) }
	}
});
//#endregion
//#region ../gui-plugins/src/plugin-store/main.ts
var exists = (file) => access(file).then(() => true, () => false);
var messageOf = (error) => error instanceof Error ? error.message : String(error);
var setup = (ctx) => {
	const log = ctx.log;
	const cli = ctx.cli;
	const signal = ctx.signal;
	const directory = process.env.OPENCODE_CONFIG_DIR || path.join(homedir(), ".config", "opencode");
	const current = {
		file: path.join(directory, "opencode.jsonc"),
		config: {},
		busy: null,
		problem: null
	};
	const source = () => {
		const index = cli.command.indexOf("--cwd");
		const folder = cli.development && index >= 0 ? cli.command[index + 1] : void 0;
		return folder ? path.resolve(folder, "..", "..") : void 0;
	};
	/** What an item writes into the settings on this machine. */
	const entryOf = async (item) => {
		if (item.kind === "mcp") return {
			kind: "mcp",
			key: item.id,
			server: serverOf(item, directory, process.platform)
		};
		if (item.kind === "skills") return {
			kind: "skills",
			path: path.join(directory, "packs", item.id, item.folder)
		};
		const root = source();
		const local = root ? path.join(root, item.local) : void 0;
		return {
			kind: "plugin",
			spec: local && await exists(local) ? local : item.spec
		};
	};
	const installed = async () => {
		const ids = [];
		for (const item of catalog) if (hasEntry(current.config, await entryOf(item))) ids.push(item.id);
		return ids;
	};
	const shown = { installed: [] };
	const withToken = catalog.flatMap((item) => item.kind === "mcp" && item.token ? [{
		id: item.id,
		...item.token
	}] : []);
	const tokens = /* @__PURE__ */ new Set();
	/** Whether a user environment variable is set. Only the answer is read, never the value. */
	const hasUserVariable = async (name) => {
		if (process.platform !== "win32") return (process.env[name] ?? "") !== "";
		const child = spawn("reg", [
			"query",
			"HKCU\\Environment",
			"/v",
			name
		], {
			stdio: "ignore",
			windowsHide: true,
			signal
		});
		const [code] = await once(child, "exit");
		return code === 0;
	};
	const readTokens = async () => {
		const found = await Promise.all(withToken.map((item) => hasUserVariable(item.variable).catch(() => false)));
		tokens.clear();
		withToken.forEach((item, index) => {
			if (found[index]) tokens.add(item.id);
		});
	};
	const state = () => ({
		file: current.file,
		installed: [...shown.installed],
		busy: current.busy,
		problem: current.problem,
		tokens: Object.fromEntries(withToken.map((item) => [item.id, tokens.has(item.id) ? "ready" : "missing"]))
	});
	/** Sets or clears a user environment variable. The value travels in the child's environment, never on a command line. */
	const setUserVariable = async (name, value) => {
		if (process.platform !== "win32") throw new Error(`Set the environment variable ${name} yourself on this system.`);
		const child = spawn("powershell.exe", [
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			"[Environment]::SetEnvironmentVariable($env:APNA_NAME, $(if ($env:APNA_VALUE) { $env:APNA_VALUE } else { $null }), 'User')"
		], {
			stdio: "ignore",
			windowsHide: true,
			signal,
			env: {
				...process.env,
				APNA_NAME: name,
				APNA_VALUE: value
			}
		});
		const [code] = await once(child, "exit");
		if (code !== 0) throw new Error(`Saving the variable ended with code ${String(code)}.`);
	};
	const setToken = async (input) => {
		const item = withToken.find((entry) => entry.id === input.id);
		if (!item) throw new Error("This item takes no token.");
		const value = input.value.trim();
		if (/\s/.test(value)) throw new Error("A token has no spaces in it.");
		await setUserVariable(item.variable, value);
		await readTokens();
		provider.changed();
	};
	const provider = ctx.provide(PluginStore, {
		state,
		refresh: () => refresh(),
		add: (id) => change(id, true),
		remove: (id) => change(id, false),
		setToken: (input) => setToken(input)
	});
	const read = async () => {
		const json = path.join(directory, "opencode.json");
		current.file = await exists(path.join(directory, "opencode.jsonc")) || !await exists(json) ? current.file : json;
		const text = await readFile(current.file, "utf8").catch(() => "");
		current.config = parseConfig(text);
	};
	const refresh = async () => {
		try {
			await read();
			current.problem = null;
			shown.installed = await installed();
		} catch (error) {
			current.problem = messageOf(error);
			shown.installed = [];
		}
		await readTokens();
		provider.changed();
	};
	/** Fetches a skills pack once; a pack already on disk is used as it is. */
	const fetchPack = async (item) => {
		const target = path.join(directory, "packs", item.id);
		if (await exists(path.join(target, item.folder))) return;
		await mkdir(path.dirname(target), { recursive: true });
		const child = spawn("git", [
			"clone",
			"--depth",
			"1",
			item.repository,
			target
		], {
			stdio: "ignore",
			windowsHide: true,
			signal
		});
		const [code] = await once(child, "exit");
		if (code !== 0) throw new Error(`git clone ended with code ${String(code)}. Git and the internet are needed.`);
	};
	const change = async (id, add) => {
		const item = catalog.find((entry) => entry.id === id);
		if (!item) throw new Error("Unknown item.");
		if (current.busy) throw new Error("Another change is running.");
		current.busy = id;
		provider.changed();
		try {
			if (add && item.kind === "skills") await fetchPack(item);
			await read();
			const entry = await entryOf(item);
			const next = add ? addEntry(current.config, entry) : removeEntry(current.config, entry);
			if (next !== current.config) {
				await mkdir(directory, { recursive: true });
				await writeFile(`${current.file}.tmp`, formatConfig(next), "utf8");
				await rename(`${current.file}.tmp`, current.file);
				current.config = next;
			}
			current.problem = null;
			shown.installed = await installed();
		} catch (error) {
			log.write("error", "plugin store: change failed", {
				id,
				add,
				error: messageOf(error)
			});
			throw error;
		} finally {
			current.busy = null;
			provider.changed();
		}
	};
	refresh();
};
//#endregion
export { setup as default };
