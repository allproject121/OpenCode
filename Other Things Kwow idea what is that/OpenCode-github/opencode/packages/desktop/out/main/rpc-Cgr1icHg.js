import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.js";
//#region ../schema/src/rpc.ts
var rpc_exports = /* @__PURE__ */ __exportAll({
	Rpc: () => rpc_exports,
	define: () => define
});
function define(definition) {
	const reserved = Object.values(definition.methods).flatMap((method) => Object.keys(method.errors ?? {})).find((name) => name.startsWith("rpc."));
	if (reserved) throw new Error(`RPC error names starting with "rpc." are reserved: ${reserved}`);
	return definition;
}
//#endregion
export { rpc_exports as n, define as t };
