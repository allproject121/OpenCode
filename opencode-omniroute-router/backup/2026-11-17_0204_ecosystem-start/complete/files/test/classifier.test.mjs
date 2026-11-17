import test from "node:test"
import assert from "node:assert/strict"

import { classify } from "../src/classifier.mjs"

const cases = [
  ["Explica el cambio para corregir un typo en el README.", "fast", ["mechanical", "bounded", "low", "low", "deterministic"]],
  ["Propón una prueba unitaria para validar un endpoint con un caso correcto y uno inválido.", "standard", ["test", "bounded", "low", "low", "deterministic"]],
  ["Analiza una race condition entre dos módulos que comparten estado y propone cómo investigarla.", "strong", ["analysis", "cross-system", "high", "high", "difficult"]],
  ["Describe cómo implementarías un endpoint CRUD normal con validación y tests.", "standard", ["feature", "bounded", "medium", "low", "deterministic"]],
  ["Corrige un typo en el README y después rediseña una migración entre varios módulos.", "strong", ["analysis", "cross-system", "high", "high", "difficult"]],
  ["Corrige un typo en el README y después rediseña el sistema de autenticación para soportar múltiples tenants.", "strong", ["analysis", "cross-system", "high", "high", "difficult"]],
  ["Tenemos un bug en producción: un campo aparece incorrectamente en una única respuesta porque se está mapeando el nombre equivocado.", "standard", ["bugfix", "bounded", "medium", "low", "deterministic"]],
  ["A veces falla el login y no tengo un error reproducible.", "strong", ["bugfix", "bounded", "medium", "high", "difficult"], true],
  ["Añade un nuevo campo opcional al DTO, mapper y test.", "standard", ["feature", "bounded", "low", "low", "deterministic"]],
  ["Renombra UserDTO a UserResponse en 35 archivos sin cambiar comportamiento.", "fast", ["mechanical", "bounded", "low", "low", "deterministic"]],
  ["Tenemos un fallo que ocurre de forma intermitente al procesar notificaciones. No sabemos todavía dónde está la causa y no existe un test que lo reproduzca.", "strong", ["bugfix", "bounded", "medium", "high", "difficult"], true],
  ["Tenemos que renombrar el campo user_name a username en 42 archivos. El cambio es puramente mecánico, no cambia comportamiento y existe una batería completa de tests.", "fast", ["mechanical", "bounded", "low", "low", "deterministic"]],
]

for (const [request, tier, [taskType, scope, risk, ambiguity, verification], explore = false] of cases) {
  test(request, () => {
    const expected = {
      tier,
      reason: { taskType, scope, risk, ambiguity, verification },
    }
    if (explore) expected.explore = true
    assert.deepEqual(classify(request), expected)
  })
}

test("production field mapping with a known cause remains standard", () => {
  assert.equal(classify("En producción se mapea incorrectamente un campo del DTO; la causa es conocida.").tier, "standard")
})

test("a README typo remains fast", () => {
  assert.equal(classify("No edites archivos. Explica cómo corregir un typo de README.").tier, "fast")
})

test("an endpoint unit test remains standard", () => {
  assert.equal(classify("No edites. Propón un test unitario para un endpoint.").tier, "standard")
})

test("an unreproducible login failure remains strong", () => {
  assert.equal(classify("El login falla intermitentemente, sin causa conocida ni reproducción.").tier, "strong")
})

test("a behavior-preserving rename remains fast at 42 files", () => {
  assert.equal(classify("Renombra user_name a username en 42 archivos sin cambiar comportamiento.").tier, "fast")
})

test("a purely informational request routes to free", () => {
  const outcome = classify("Explica qué es un closure en JavaScript.")
  assert.equal(outcome.tier, "free")
  assert.deepEqual(outcome.reason, { taskType: "auxiliary", scope: "bounded", risk: "low", ambiguity: "low", verification: "deterministic" })
})

test("a documentation search routes to free", () => {
  assert.equal(classify("Busca en la documentación oficial qué opciones acepta la función.").tier, "free")
})

test("an informational request mentioning a change cue does not route to free", () => {
  assert.equal(classify("Explica qué es un DTO y cómo añadiría un campo nuevo.").tier, "standard")
})

test("a memory leak routes to expert", () => {
  const outcome = classify("Tenemos una fuga de memoria en el worker de notificaciones bajo carga.")
  assert.equal(outcome.tier, "expert")
  assert.equal(outcome.reason.taskType, "bugfix")
})

test("critical security work routes to expert", () => {
  const outcome = classify("Rediseña la autenticación por seguridad crítica tras una auditoría.")
  assert.equal(outcome.tier, "expert")
  assert.equal(outcome.reason.taskType, "analysis")
})

test("a repeated failure routes to expert", () => {
  assert.equal(classify("El mismo fallo repetido persiste tras dos soluciones consecutivas.").tier, "expert")
})

test("a race condition remains strong, not expert", () => {
  assert.equal(classify("Analiza una race condition entre dos módulos que comparten estado.").tier, "strong")
})

test("an unknown-cause failure requests exploration", () => {
  assert.equal(classify("El login falla intermitentemente, sin causa conocida ni reproducción.").explore, true)
})

test("clear-change and informational requests never request exploration", () => {
  assert.equal(classify("Corrige un typo en el README.").explore, undefined)
  assert.equal(classify("Propón una prueba unitaria para validar un endpoint.").explore, undefined)
  assert.equal(classify("Explica qué es un closure en JavaScript.").explore, undefined)
})

test("a known-cause race condition does not request exploration", () => {
  assert.equal(classify("Analiza una race condition entre dos módulos que comparten estado.").explore, undefined)
})

// --- English and Hinglish ---------------------------------------------------

const multilingual = [
  // free: purely informational
  ["Explain what a closure is in JavaScript.", "free"],
  ["What is the difference between let and const?", "free"],
  ["Ye function kaise kaam karta hai samjhao", "free"],
  ["useEffect kya hai? batao", "free"],
  // fast: mechanical, behavior-preserving
  ["Fix the typo in the README.", "fast"],
  ["Explain how to fix a typo in the README, do not edit files.", "fast"],
  ["README me spelling theek karo", "fast"],
  ["Rename UserDTO to UserResponse across 35 files without changing behavior.", "fast"],
  ["UserDTO ko rename karke UserResponse karo, bina behaviour badle", "fast"],
  // standard: known, localized behavior change
  ["Fix the bug where the login form rejects valid emails.", "standard"],
  ["Fix the crash when the cart is empty.", "standard"],
  ["Login form valid email reject kar raha hai, bug fix karo", "standard"],
  ["Checkout button kaam nahi kar raha, theek karo", "standard"],
  ["Add a new endpoint to list users.", "standard"],
  ["Write unit tests for the date parser.", "standard"],
  ["Parser ke liye tests likho", "standard"],
  ["Profile page me naya field jodo: phone number", "standard"],
  // strong: unknown cause, cross-system, risk
  ["Analyze a race condition between two modules that share state.", "strong"],
  ["Kabhi kabhi login fail ho jata hai, pata nahi kyu", "strong"],
  ["The upload sometimes fails and we cannot reproduce it.", "strong"],
  ["Plan the database migration for the orders service.", "strong"],
  ["Review the authentication flow for security issues.", "strong"],
  // expert: critical
  ["There is a memory leak in the notification worker under load.", "expert"],
  ["Bug fix ke baad bhi baar baar fail ho raha hai", "expert"],
  ["The import job keeps failing after two consecutive fixes.", "expert"],
  ["Audit the API for SQL injection.", "expert"],
]

for (const [request, tier] of multilingual) {
  test(`[en/hi] ${request} -> ${tier}`, () => {
    assert.equal(classify(request).tier, tier)
  })
}

test("[en/hi] unknown-cause failures request exploration", () => {
  assert.equal(classify("Kabhi kabhi login fail ho jata hai, pata nahi kyu").explore, true)
  assert.equal(classify("The upload sometimes fails and we cannot reproduce it.").explore, true)
  assert.equal(classify("Fix the crash when the cart is empty.").explore, undefined)
})

test("[en/hi] critical bug vs critical analysis task types", () => {
  assert.equal(classify("There is a memory leak in the notification worker under load.").reason.taskType, "bugfix")
  assert.equal(classify("Audit the API for SQL injection.").reason.taskType, "analysis")
})

// --- local / offline preference ----------------------------------------------

test("an explicit offline/local request is flagged local and keeps its tier", () => {
  const outcome = classify("Offline model se ye function samjhao")
  assert.equal(outcome.tier, "free")
  assert.equal(outcome.local, true)
  assert.equal(classify("Use Ollama to fix the typo in the README.").local, true)
  assert.equal(classify("Fix the crash locally, without internet.").tier, "standard")
  assert.equal(classify("Bina internet ke ye bug fix karo").local, true)
})

test("words like localized or local variable do not trigger local", () => {
  assert.equal(classify("Fix the localized bug in the date picker.").local, undefined)
  assert.equal(classify("Rename the local variable count to total without changing behavior.").local, undefined)
  assert.equal(classify("Explica qué es un closure en JavaScript.").local, undefined)
})
