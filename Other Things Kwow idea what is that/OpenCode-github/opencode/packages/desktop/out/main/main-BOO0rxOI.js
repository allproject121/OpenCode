import { I as Literals, U as NullOr, X as Record, at as String$1, o as ArraySchema, ot as Struct } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { createReadStream } from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { once } from "node:events";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
//#region ../gui-plugins/src/apna-tools/contract.ts
var RunState = Struct({
	/**
	* - `installing`: `npm install` runs first because the project has no `node_modules`.
	* - `starting`: the server was started and has not printed its address yet.
	* - `running`: it runs; `url` is set when it printed one (a static server always has one).
	* - `stopped`: the user stopped it, or it ended by itself (`message` then says how).
	* - `failed`: it could not start; `message` says why.
	*/
	status: Literals([
		"installing",
		"starting",
		"running",
		"stopped",
		"failed"
	]),
	/** What runs, as the user would type it, e.g. `npm run dev` or "Built-in web server". */
	command: String$1,
	url: NullOr(String$1),
	message: NullOr(String$1),
	/** The last lines the server printed. */
	log: ArraySchema(String$1)
});
var ApnaToolsState = Struct({ 
/** Each project folder the Run button started, by folder path. */
runs: Record(String$1, RunState) });
/** Small helpers that need the main process: running the open project, voice typing, saving a chat. */
var ApnaTools = Ipc.define({
	id: "apna-tools",
	state: ApnaToolsState,
	methods: {
		/** Starts the project in this folder (`npm run dev`, a static web server, ...). Rejects when it finds no way. */
		run: { input: String$1 },
		/** Stops what Run started in this folder. */
		stop: { input: String$1 },
		/** Opens Windows voice typing (Win+H) over the focused text box. */
		dictate: {},
		/** Writes a chat as a Markdown file into the project folder and shows it; returns the file's path. */
		saveChat: {
			input: Struct({
				directory: String$1,
				name: String$1,
				content: String$1
			}),
			output: String$1
		}
	}
});
//#endregion
//#region ../gui-plugins/src/apna-tools/detect.ts
/** npm scripts that start something to look at, best first. */
var scripts = [
	"dev",
	"start",
	"serve",
	"preview"
];
/** Folders that may hold the site's index.html, best first. */
var roots = [
	"",
	"public",
	"dist",
	"build",
	"src",
	"site",
	"docs"
];
/** Picks how to run a project folder, or undefined when nothing fits. */
async function detect(look) {
	const pkg = await look.read("package.json");
	if (pkg !== void 0) {
		const json = parse(pkg);
		const found = scripts.find((name) => typeof json?.scripts?.[name] === "string");
		if (found) return {
			kind: "npm",
			script: found,
			install: Object.keys({
				...json?.dependencies ?? {},
				...json?.devDependencies ?? {}
			}).length > 0 && !await look.has("node_modules")
		};
	}
	if (await look.has("manage.py")) return {
		kind: "python",
		args: ["manage.py", "runserver"]
	};
	for (const file of ["app.py", "main.py"]) {
		const text = await look.read(file);
		if (text && /Flask\(|FastAPI\(|streamlit/.test(text)) {
			if (/streamlit/.test(text)) return {
				kind: "python",
				args: [
					"-m",
					"streamlit",
					"run",
					file
				]
			};
			if (/FastAPI\(/.test(text)) return {
				kind: "python",
				args: [
					"-m",
					"uvicorn",
					`${file.replace(/\.py$/, "")}:app`
				]
			};
			return {
				kind: "python",
				args: [file]
			};
		}
	}
	for (const root of roots) if (await look.has(root ? `${root}/index.html` : "index.html")) return {
		kind: "static",
		root
	};
}
var parse = (text) => {
	try {
		return JSON.parse(text);
	} catch {
		return;
	}
};
/** The first local web address in a line a server printed, with 0.0.0.0 / [::] turned into localhost. */
function findUrl(line) {
	return line.replace(/\u001b\[[0-9;]*m/g, "").match(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1?\]):\d+[^\s'"<>)]*/)?.[0].replace(/0\.0\.0\.0|\[::1?\]/, "localhost").replace(/[.,;]+$/, "");
}
/** What the user reads as the command. */
function describe(plan) {
	if (plan.kind === "npm") return plan.script === "start" ? "npm start" : `npm run ${plan.script}`;
	if (plan.kind === "python") return `python ${plan.args.join(" ")}`;
	return plan.root ? `Web server (${plan.root}/)` : "Web server";
}
//#endregion
//#region ../gui-plugins/src/apna-tools/main.ts
var exists = (file) => access(file).then(() => true, () => false);
var messageOf = (error) => error instanceof Error ? error.message : String(error);
var types = {
	".html": "text/html; charset=utf-8",
	".htm": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".txt": "text/plain; charset=utf-8",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".mp4": "video/mp4",
	".mp3": "audio/mpeg"
};
var setup = (ctx) => {
	const log = ctx.log;
	const signal = ctx.signal;
	const runs = /* @__PURE__ */ new Map();
	const state = () => ({ runs: Object.fromEntries([...runs].map(([folder, run]) => [folder, {
		...run.state,
		log: [...run.state.log]
	}])) });
	const provider = ctx.provide(ApnaTools, {
		state,
		run: (folder) => run(folder),
		stop: (folder) => stop(folder),
		dictate: () => dictate(),
		saveChat: (input) => saveChat(input)
	});
	const update = (folder, change) => {
		const current = runs.get(folder);
		if (!current) return;
		current.state = {
			...current.state,
			...change
		};
		provider.changed();
	};
	const addLines = (folder, text) => {
		const current = runs.get(folder);
		if (!current) return;
		const lines = text.split(/\r?\n/).map((line) => line.replace(/\u001b\[[0-9;?]*[A-Za-z]/g, "").trimEnd()).filter((line) => line.trim() !== "");
		if (lines.length === 0) return;
		const url = current.state.url ?? lines.map(findUrl).find((found) => found !== void 0);
		current.state = {
			...current.state,
			log: [...current.state.log, ...lines].slice(-60),
			url: url ?? null,
			status: url && current.state.status === "starting" ? "running" : current.state.status
		};
		provider.changed();
	};
	/** Runs a command line in the project and resolves with its exit code; output goes to the project's log. */
	const exec = (folder, line, keep) => {
		const child = spawn("cmd.exe", [
			"/d",
			"/s",
			"/c",
			line
		], {
			cwd: folder,
			windowsHide: true,
			env: {
				...process.env,
				BROWSER: "none",
				FORCE_COLOR: "0",
				NO_COLOR: "1"
			}
		});
		keep(child);
		child.stdout?.on("data", (chunk) => addLines(folder, chunk.toString()));
		child.stderr?.on("data", (chunk) => addLines(folder, chunk.toString()));
		return new Promise((resolve) => {
			child.on("error", (error) => {
				addLines(folder, messageOf(error));
				resolve(-1);
			});
			child.on("exit", (code) => resolve(code));
		});
	};
	/** Serves a folder of web files on the first free port from 5500. */
	const serveStatic = async (folder, root) => {
		const base = path.resolve(folder, root);
		const server = createServer((request, response) => {
			const url = new URL(request.url ?? "/", "http://localhost");
			const wanted = path.resolve(base, `.${decodeURIComponent(url.pathname)}`);
			if (wanted !== base && !wanted.startsWith(base + path.sep)) {
				response.writeHead(403).end();
				return;
			}
			stat(wanted).then((info) => info.isDirectory() ? path.join(wanted, "index.html") : wanted).then((file) => stat(file).then(() => {
				response.writeHead(200, {
					"content-type": types[path.extname(file).toLowerCase()] ?? "application/octet-stream",
					"cache-control": "no-store"
				});
				createReadStream(file).pipe(response);
				addLines(folder, `GET ${url.pathname} 200`);
			})).catch(() => {
				response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
				addLines(folder, `GET ${url.pathname} 404`);
			});
		});
		for (let port = 5500; port < 5600; port++) if (await new Promise((resolve) => {
			server.once("error", () => resolve(false));
			server.listen(port, "127.0.0.1", () => resolve(true));
		})) return {
			server,
			url: `http://localhost:${port}/`
		};
		throw new Error("No free port between 5500 and 5599.");
	};
	const start = async (folder, plan) => {
		if (plan.kind === "static") {
			const { server, url } = await serveStatic(folder, plan.root);
			const current = runs.get(folder);
			if (!current) return server.close();
			current.server = server;
			update(folder, {
				status: "running",
				url
			});
			addLines(folder, `Serving ${path.resolve(folder, plan.root)} at ${url}`);
			return;
		}
		if (plan.kind === "npm" && plan.install) {
			update(folder, { status: "installing" });
			addLines(folder, "> npm install");
			const code = await exec(folder, "npm install", (child) => {
				const current = runs.get(folder);
				if (current) current.child = child;
			});
			if (runs.get(folder)?.state.status !== "installing") return;
			if (code !== 0) {
				update(folder, {
					status: "failed",
					message: `npm install ended with code ${String(code)}.`
				});
				return;
			}
		}
		update(folder, { status: "starting" });
		const line = plan.kind === "npm" ? describe(plan) : `python ${plan.args.join(" ")}`;
		addLines(folder, `> ${line}`);
		const code = await exec(folder, line, (child) => {
			const current = runs.get(folder);
			if (current) current.child = child;
		});
		const current = runs.get(folder);
		if (!current || current.state.status === "stopped") return;
		update(folder, {
			status: code === 0 ? "stopped" : "failed",
			message: code === 0 ? "The server ended." : `It ended with code ${String(code)}. See the lines below.`
		});
	};
	const run = async (folder) => {
		const active = runs.get(folder);
		if (active && [
			"installing",
			"starting",
			"running"
		].includes(active.state.status)) return;
		const plan = await detect({
			read: (file) => readFile(path.join(folder, file), "utf8").catch(() => void 0),
			has: (file) => exists(path.join(folder, file))
		});
		if (!plan) throw new Error("No package.json script, Python app or index.html found in this folder.");
		runs.set(folder, { state: {
			status: "starting",
			command: describe(plan),
			url: null,
			message: null,
			log: []
		} });
		provider.changed();
		start(folder, plan).catch((error) => {
			log.write("error", "apna-tools: run failed", {
				folder,
				error: messageOf(error)
			});
			update(folder, {
				status: "failed",
				message: messageOf(error)
			});
		});
	};
	/** Ends a process with everything it started (npm starts node, which may start more). */
	const kill = async (child) => {
		if (child.exitCode !== null || child.pid === void 0) return;
		const killer = spawn("taskkill", [
			"/pid",
			String(child.pid),
			"/t",
			"/f"
		], {
			stdio: "ignore",
			windowsHide: true
		});
		await once(killer, "exit").catch(() => void 0);
	};
	const stop = async (folder) => {
		const current = runs.get(folder);
		if (!current) return;
		current.state = {
			...current.state,
			status: "stopped",
			message: "Stopped."
		};
		provider.changed();
		current.server?.close();
		current.server = void 0;
		if (current.child) await kill(current.child);
		current.child = void 0;
	};
	const dictate = async () => {
		if (process.platform !== "win32") throw new Error("Voice typing needs Windows.");
		const script = [
			"Add-Type -Namespace Apna -Name Keys -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte k, byte s, uint f, System.UIntPtr e);'",
			"[Apna.Keys]::keybd_event(0x5B, 0, 0, [UIntPtr]::Zero)",
			"[Apna.Keys]::keybd_event(0x48, 0, 0, [UIntPtr]::Zero)",
			"[Apna.Keys]::keybd_event(0x48, 0, 2, [UIntPtr]::Zero)",
			"[Apna.Keys]::keybd_event(0x5B, 0, 2, [UIntPtr]::Zero)"
		].join("; ");
		const child = spawn("powershell.exe", [
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			script
		], {
			stdio: "ignore",
			windowsHide: true
		});
		const [code] = await once(child, "exit");
		if (code !== 0) throw new Error(`Voice typing could not be opened (code ${String(code)}).`);
	};
	const saveChat = async (input) => {
		const clean = input.name.replace(/[<>:"/\\|?*\u0000-\u001f]+/g, " ").trim().slice(0, 80) || "chat";
		const folder = path.join(input.directory, "chats");
		const file = path.join(folder, `${clean}.md`);
		await mkdir(folder, { recursive: true });
		await writeFile(file, input.content, "utf8");
		return file;
	};
	signal.addEventListener("abort", () => {
		for (const current of runs.values()) {
			current.server?.close();
			if (current.child) kill(current.child);
		}
	});
};
//#endregion
export { setup as default };
