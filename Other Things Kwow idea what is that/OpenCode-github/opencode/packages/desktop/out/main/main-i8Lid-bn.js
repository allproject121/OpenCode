import { U as NullOr, W as Number, at as String$1, o as ArraySchema, ot as Struct } from "./Latch-oSncnOpo.js";
import { n as Ipc } from "./core-sLvezBSn.js";
import "./host-DQiQeSJn.js";
import { homedir } from "node:os";
import path from "node:path";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
//#region ../gui-plugins/src/apna-images/contract.ts
var Picture = Struct({
	file: String$1,
	prompt: String$1,
	model: String$1,
	/** When it was made, in ms. */
	time: Number
});
var ImagesState = Struct({
	/** The folder pictures are saved in. */
	folder: String$1,
	/** Image models the router offers, best first. */
	models: ArraySchema(String$1),
	/** A picture is being made: what was asked, and since when (ms). */
	making: NullOr(Struct({
		prompt: String$1,
		model: String$1,
		since: Number
	})),
	/** The newest first. */
	pictures: ArraySchema(Picture),
	/** Why the router could not be asked; null when fine. */
	problem: NullOr(String$1)
});
/** Making pictures through the router (OmniRoute) and keeping them in a folder on this PC. */
var Images = Ipc.define({
	id: "apna-images",
	state: ImagesState,
	methods: {
		/** Asks the router again for its image models and reads the folder again. */
		refresh: {},
		/** Makes one picture; resolves with its file. Rejects with the router's message. */
		make: {
			input: Struct({
				prompt: String$1,
				model: String$1,
				size: String$1,
				/** A photo the user picked to change (img2img); null for a new picture. */
				photo: NullOr(String$1)
			}),
			output: String$1
		},
		/** A photo the user picked, as a small data: URL to show in the composer. Only picture files are read. */
		photo: {
			input: String$1,
			output: String$1
		},
		/** A picture as a data: URL, for showing it in the window. */
		read: {
			input: String$1,
			output: String$1
		},
		/** Deletes a picture from the folder. */
		remove: { input: String$1 }
	}
});
//#endregion
//#region ../gui-plugins/src/apna-images/pictures.ts
/** Picture formats by their first bytes. */
var kinds = [
	{
		test: (b) => b[0] === 137 && b[1] === 80,
		ext: ".png",
		mime: "image/png"
	},
	{
		test: (b) => b[0] === 255 && b[1] === 216,
		ext: ".jpg",
		mime: "image/jpeg"
	},
	{
		test: (b) => b[0] === 82 && b[1] === 73 && b[8] === 87 && b[9] === 69,
		ext: ".webp",
		mime: "image/webp"
	},
	{
		test: (b) => b[0] === 71 && b[1] === 73,
		ext: ".gif",
		mime: "image/gif"
	}
];
var extensionOf = (bytes) => kinds.find((kind) => kind.test(bytes))?.ext ?? ".png";
var mimeOf = (bytes) => kinds.find((kind) => kind.test(bytes))?.mime ?? "image/png";
/** Free, quick, general-purpose AI Horde models that make good first picks, best first. */
var preferred = [
	"aihorde/Dreamshaper",
	"aihorde/Deliberate",
	"aihorde/AlbedoBase XL (SDXL)",
	"aihorde/Juggernaut XL"
];
/**
* The router's image models, best first: the preferred free ones, then other picture models from paid providers
* (Gemini image models), then the rest of AI Horde in their order. Video models are left out.
*/
function rankModels(models) {
	const ids = models.map((model) => model.id);
	const horde = models.filter((model) => model.owned_by === "aihorde").map((model) => model.id);
	const other = ids.filter((id) => /image/i.test(id) && !id.startsWith("aihorde/"));
	const first = preferred.filter((id) => horde.includes(id));
	return [
		...first,
		...other,
		...horde.filter((id) => !first.includes(id))
	];
}
//#endregion
//#region ../gui-plugins/src/apna-images/main.ts
var messageOf = (error) => error instanceof Error ? error.message : String(error);
var router = "http://127.0.0.1:20128";
var setup = (ctx) => {
	const log = ctx.log;
	const folder = path.join(homedir(), "Pictures", "Apna-OpenCode");
	const index = path.join(folder, "pictures.json");
	const current = {
		models: [],
		pictures: [],
		making: null,
		problem: null
	};
	const state = () => ({
		folder,
		models: [...current.models],
		making: current.making,
		pictures: [...current.pictures],
		problem: current.problem
	});
	const provider = ctx.provide(Images, {
		state,
		refresh: () => refresh(),
		make: (input) => make(input),
		photo: (file) => photoURL(file),
		read: (file) => read(file),
		remove: (file) => remove(file)
	});
	const headers = () => {
		const key = process.env.OMNIROUTE_API_KEY;
		if (!key) throw new Error("The router key (OMNIROUTE_API_KEY) is not set. Open Settings > Router.");
		return {
			authorization: `Bearer ${key}`,
			"content-type": "application/json"
		};
	};
	const readIndex = async () => {
		const text = await readFile(index, "utf8").catch(() => "[]");
		try {
			const list = JSON.parse(text);
			return Array.isArray(list) ? list : [];
		} catch {
			return [];
		}
	};
	const refresh = async () => {
		current.pictures = (await readIndex()).sort((a, b) => b.time - a.time);
		try {
			const response = await fetch(`${router}/v1/models`, {
				headers: headers(),
				signal: AbortSignal.timeout(1e4)
			});
			if (!response.ok) throw new Error(`The router answered ${response.status}.`);
			const json = await response.json();
			current.models = rankModels(json.data ?? []);
			current.problem = null;
		} catch (error) {
			current.problem = messageOf(error);
		}
		provider.changed();
	};
	const photoURL = async (file) => {
		if (!/\.(png|jpe?g|webp|gif)$/i.test(file)) throw new Error("Pick a PNG, JPG, WEBP or GIF picture.");
		if ((await stat(file)).size > 15728640) throw new Error("The photo is bigger than 15 MB.");
		const bytes = await readFile(file);
		return `data:${mimeOf(bytes)};base64,${bytes.toString("base64")}`;
	};
	const make = async (input) => {
		const prompt = input.prompt.trim();
		if (!prompt) throw new Error("Write what the picture should show.");
		if (current.making) throw new Error("A picture is already being made.");
		current.making = {
			prompt,
			model: input.model,
			since: Date.now()
		};
		provider.changed();
		try {
			const response = await fetch(`${router}/v1/images/generations`, {
				method: "POST",
				headers: headers(),
				body: JSON.stringify({
					model: input.model,
					prompt,
					n: 1,
					size: input.size,
					...input.photo ? { image: await photoURL(input.photo) } : {}
				}),
				signal: AbortSignal.timeout(6e5)
			});
			const text = await response.text();
			const json = (() => {
				try {
					return JSON.parse(text);
				} catch {
					return;
				}
			})();
			if (!response.ok || !json?.data?.[0]) throw new Error(json?.error?.message ?? `The router answered ${response.status}: ${text.slice(0, 200)}`);
			const first = json.data[0];
			const bytes = first.b64_json ? Buffer.from(first.b64_json, "base64") : first.url ? Buffer.from(await (await fetch(first.url, { signal: AbortSignal.timeout(12e4) })).arrayBuffer()) : void 0;
			if (!bytes || bytes.length === 0) throw new Error("The router sent no picture.");
			const time = Date.now();
			const name = `${new Date(time).toISOString().replace(/[:.]/g, "-")}${extensionOf(bytes)}`;
			const file = path.join(folder, name);
			await mkdir(folder, { recursive: true });
			await writeFile(file, bytes);
			const pictures = [{
				file,
				prompt,
				model: input.model,
				time
			}, ...await readIndex()];
			await writeFile(index, JSON.stringify(pictures, null, 2), "utf8");
			current.pictures = pictures.sort((a, b) => b.time - a.time);
			return file;
		} catch (error) {
			log.write("error", "images: make failed", {
				model: input.model,
				error: messageOf(error)
			});
			throw error;
		} finally {
			current.making = null;
			provider.changed();
		}
	};
	const known = (file) => current.pictures.some((picture) => picture.file === file);
	const read = async (file) => {
		if (!known(file)) throw new Error("Unknown picture.");
		const bytes = await readFile(file);
		return `data:${mimeOf(bytes)};base64,${bytes.toString("base64")}`;
	};
	const remove = async (file) => {
		if (!known(file)) throw new Error("Unknown picture.");
		await rm(file, { force: true });
		const pictures = (await readIndex()).filter((picture) => picture.file !== file);
		await writeFile(index, JSON.stringify(pictures, null, 2), "utf8");
		current.pictures = pictures.sort((a, b) => b.time - a.time);
		provider.changed();
	};
	refresh();
};
//#endregion
export { setup as default };
