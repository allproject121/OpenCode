import { U as NullOr, W as Number$1, at as String, o as ArraySchema, ot as Struct } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { homedir } from "node:os";
import path from "node:path";
import { cp, mkdir, readFile, readdir, stat } from "node:fs/promises";
//#region ../gui-plugins/src/cloud-projects/contract.ts
/** One project folder on Cloud-SSD. */
var CloudProject = Struct({
	name: String,
	/** The folder's full path on this machine. */
	directory: String
});
var CloudProjectsState = Struct({
	/** The projects folder inside Cloud-SSD's fast drive; null when Cloud-SSD is not installed or its fast drive is off. */
	folder: NullOr(String),
	projects: ArraySchema(CloudProject),
	/** When Cloud-SSD last finished uploading the projects folder, as epoch milliseconds; null before the first time. */
	uploadedAt: NullOr(Number$1),
	/** The folder being brought in right now; null while idle. */
	bringing: NullOr(String)
});
/** Coding projects kept in Cloud-SSD's fast drive: they run from this machine and Cloud-SSD uploads them by itself. */
var CloudProjects = Ipc.define({
	id: "cloud-projects",
	state: CloudProjectsState,
	methods: {
		/** Looks for the fast drive and lists the projects again. */
		refresh: {},
		/** Makes an empty project folder and returns its path. Rejects when the name cannot be used or is taken. */
		create: {
			input: String,
			output: String
		},
		/**
		* Copies a folder into the projects folder under its own name and returns the new path. Folders a project builds
		* again by itself, such as `node_modules`, are left behind. The original is not touched.
		*/
		bring: {
			input: String,
			output: String
		}
	}
});
//#endregion
//#region ../gui-plugins/src/cloud-projects/folders.ts
/** The folder inside Cloud-SSD's fast drive that holds the coding projects. */
var projectsFolderName = "Coding-Projects";
/**
* Folders a project can build again by itself. They are left behind when a folder is brought to Cloud-SSD: they hold
* tens of thousands of files and would keep the upload busy for hours.
*/
var skipped = [
	"node_modules",
	"dist",
	"build",
	"out",
	"target",
	".next",
	".nuxt",
	".turbo",
	".cache",
	".venv",
	"venv",
	"__pycache__"
];
/**
* The real folder behind Cloud-SSD's fast drive, read from the text of the Cloud-SSD app's settings file. New things
* in it are plain local folders that the Cloud-SSD app uploads by itself. Undefined when the fast drive is off or the
* file cannot be read.
*
* @param home - The user's home folder; the fast drive sits under it unless the settings name another place.
*/
function fastFolder(settings, home) {
	try {
		const parsed = JSON.parse(settings.replace(/^\uFEFF/, ""));
		const hybrid = typeof parsed === "object" && parsed !== null ? Reflect.get(parsed, "Hybrid") : void 0;
		if (typeof hybrid !== "object" || hybrid === null || Reflect.get(hybrid, "Enabled") !== true) return void 0;
		const root = Reflect.get(hybrid, "Root");
		return typeof root === "string" && root.trim() !== "" ? root : path.join(home, "Cloud-SSD", "All Accounts");
	} catch {
		return;
	}
}
/** Names Windows keeps for devices; a folder cannot have one. */
var reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
/**
* Why a project name cannot be used, or undefined when it can. A name is one folder name: letters, digits, spaces,
* dots, dashes and underscores, starting with a letter or digit.
*/
function nameProblem(name) {
	const trimmed = name.trim();
	if (trimmed === "") return "empty";
	if (!/^[\p{L}\p{N}][\p{L}\p{M}\p{N} ._-]{0,59}$/u.test(trimmed) || /[ .]$/.test(trimmed)) return "characters";
	return reserved.test(trimmed) ? "reserved" : void 0;
}
/** Whether a file or folder is brought along when a folder is copied to Cloud-SSD. */
function carried(source, entry) {
	return !path.relative(source, entry).split(/[\\/]/).some((part) => skipped.includes(part));
}
//#endregion
//#region ../gui-plugins/src/cloud-projects/main.ts
var problems = {
	empty: "Give the project a name.",
	characters: "Use letters, digits, spaces, dots, dashes and underscores only, starting with a letter or digit.",
	reserved: "Windows keeps that name for itself. Pick another one."
};
var setup = (ctx) => {
	const cloudSsd = path.join(process.env.LOCALAPPDATA ?? "", "Cloud-SSD");
	const current = {
		folder: null,
		projects: [],
		uploadedAt: null,
		bringing: null
	};
	const state = () => ({ ...current });
	const provider = ctx.provide(CloudProjects, {
		state,
		refresh: () => refresh(),
		create: (name) => create(name),
		bring: (source) => bring(source)
	});
	const readUploadedAt = async () => {
		try {
			const parsed = JSON.parse((await readFile(path.join(cloudSsd, "hybrid-state.json"), "utf8")).replace(/^\uFEFF/, ""));
			const uploaded = typeof parsed === "object" && parsed !== null ? Reflect.get(parsed, "Uploaded") : null;
			const time = typeof uploaded === "object" && uploaded !== null ? Reflect.get(uploaded, projectsFolderName) : null;
			const value = typeof time === "string" ? Date.parse(time) : NaN;
			return Number.isNaN(value) ? null : value;
		} catch {
			return null;
		}
	};
	const refresh = async () => {
		const fast = fastFolder(await readFile(path.join(cloudSsd, "settings.json"), "utf8").catch(() => ""), homedir());
		const there = fast ? await stat(fast).then((item) => item.isDirectory(), () => false) : false;
		current.folder = fast && there ? path.join(fast, projectsFolderName) : null;
		const entries = current.folder ? await readdir(current.folder, { withFileTypes: true }).catch(() => []) : [];
		const folder = current.folder ?? "";
		current.projects = entries.filter((entry) => entry.isDirectory()).map((entry) => ({
			name: entry.name,
			directory: path.join(folder, entry.name)
		})).toSorted((a, b) => a.name.localeCompare(b.name));
		current.uploadedAt = await readUploadedAt();
		provider.changed();
	};
	/** The path a new project gets. Rejects for a bad name, a taken name, or while the fast drive is not there. */
	const target = async (name) => {
		await refresh();
		const problem = nameProblem(name);
		if (problem) throw new Error(problems[problem]);
		if (!current.folder) throw new Error("Cloud-SSD's fast drive was not found. Open the Cloud-SSD app and switch it on.");
		const directory = path.join(current.folder, name.trim());
		if (await stat(directory).then(() => true, () => false)) throw new Error(`A project named "${name.trim()}" is already there.`);
		return directory;
	};
	const create = async (name) => {
		const directory = await target(name);
		await mkdir(directory, { recursive: true });
		await refresh();
		return directory;
	};
	const bring = async (source) => {
		if (current.bringing) throw new Error("Another folder is being brought in.");
		const directory = await target(path.basename(source));
		current.bringing = path.basename(source);
		provider.changed();
		try {
			await cp(source, directory, {
				recursive: true,
				filter: (entry) => carried(source, entry)
			});
		} finally {
			current.bringing = null;
			await refresh();
		}
		return directory;
	};
	refresh();
};
//#endregion
export { setup as default };
