// Live check of the Offline models page's Cloud-SSD link (the Cloud-SSD app must be running and answering on its
// link file). Puts one model in the cloud through the link, checks it is complete there, and lists the models there.
// It deletes nothing: neither the model on this PC nor the copy in the cloud.
// Run:  bun run test-cloud.ts [model]
import {
  hasStored,
  listStored,
  modelsDirectory,
  storeModel,
} from "../opencode/packages/gui-plugins/src/local-models/engine";
import {
  linkReady,
  linkShelf,
} from "../opencode/packages/gui-plugins/src/local-models/shelf";

const name = process.argv[2] ?? "all-minilm:latest";

console.log("Cloud-SSD link answers:", await linkReady());
const shelf = linkShelf("Ollama-Models");
const started = Date.now();
const seen = { bytes: 0, total: 0 };

await storeModel(
  name,
  modelsDirectory(),
  shelf,
  (bytes, total) => Object.assign(seen, { bytes, total }),
  new AbortController().signal,
);
console.log(
  `put ${name}: ${(seen.bytes / 1e6).toFixed(0)} of ${(seen.total / 1e6).toFixed(0)} MB in ${((Date.now() - started) / 1000).toFixed(1)} s`,
);
console.log(
  "complete in the cloud:",
  await hasStored(name, modelsDirectory(), shelf),
);
console.log("models in the cloud:", (await listStored(shelf)).join(", "));
