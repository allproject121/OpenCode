/**
 * Pure, deterministic routing policy.
 *
 * Tiers (cold start, doc sections 11 and 23):
 * - free: purely informational auxiliary work with no code change
 * - fast: behavior-preserving mechanical work
 * - standard: observable behavior changes with known cause
 * - strong: unknown cause, cross-system, or elevated risk
 * - expert: critical concurrency/memory/security/architecture or repeated failure
 *
 * Requests are understood in Spanish (original rules), English and Hinglish
 * (Hindi written in Latin script). Each rule below is one regular expression
 * per language family, combined with `any(...)`.
 *
 * When the request explicitly asks for a local/offline model, the outcome
 * carries `local: true`; the task router then prefers a configured local
 * worker (e.g. an Ollama model) while keeping the tier and reason intact.
 *
 * It intentionally performs no I/O and has no OpenCode dependency. Integrating
 * its result into OpenCode requires a supported dispatch hook that can select a
 * subagent before the LLM issues its Task call.
 */

const any = (...patterns) => new RegExp(patterns.map((p) => `(?:${p.source})`).join("|"))

// --- expert -----------------------------------------------------------------
const CRITICAL_BUG = any(
  /memory leak|fuga de memoria|deadlock|fallo repetid|repeated failure|sigue fallando tras/,
  /out of memory|\boom\b|keeps? failing|still fail(?:s|ing)? after|fails? again after|repeatedly fail/,
  /baa?r[ -]baa?r fail|fix ke baad bhi|phir se fail|memory (?:badh|bhar)|ram (?:badh|bhar)/,
)
const EXPERT = any(
  CRITICAL_BUG,
  /seguridad critic|critical security|arquitectura critic|critical architecture|dos soluciones consecutivas/,
  /critical vulnerabilit|security vulnerabilit|security hole|data leak|sql injection|\bxss\b|remote code execution/,
)

// --- strong -----------------------------------------------------------------
const UNKNOWN_CAUSE = any(
  /intermitent|a veces|sin causa|no sabemos|no .*reproduc|no existe un test.*reprodu/,
  /intermittent|sometimes|randomly|flaky|occasionally|not reproducible|can.?t reproduce|cannot reproduce|unable to reproduce|unknown cause|cause is unknown|no idea why|don.?t know why/,
  /kabhi[ -]kabhi|kabhi kabhar|pata nahi kyu|pata nahi kyon|samajh nahi aa raha kyu|reproduce nahi/,
)
const CROSS_SYSTEM = any(
  /(?:dos|varios|multiples|muchos) modul|cross.system|estado compartid|distribuid|migraci|arquitectura|multiple.*tenant|autenticacion.*tenant/,
  /(?:two|2|multiple|several|many|all) (?:modules|services|systems)|across (?:modules|services|systems)|cross.service|microservice|shared state|distributed|migration|architecture|multi.?tenant/,
  /(?:do|kai|saare|sabhi|sab) (?:modules|services)|alag alag modules/,
)
const HIGH_RISK = any(
  /race condition|concurren|estado compartid|distribuid|migraci|arquitectura|seguridad|autenticacion|rendimiento|performance/,
  /shared state|distributed|migration|architecture|security|authenticat|authori[sz]ation|bottleneck|production incident|outage|encryption/,
)
const UNCLEAR_BUG = any(
  /fallo|bug|login|incidente/,
  /error|crash|fail|incident|issue|problem/,
  /galat|kaam nahi|nahi chal/,
)

// --- standard ---------------------------------------------------------------
const UNIT_TEST = any(
  /prueba unitaria|test unitario/,
  /unit tests?|(?:write|add|create) (?:a |an |some |more )?(?:unit |integration )?tests?\b/,
  /tests? (?:likh|bana|jod|add)/,
)
const FEATURE = any(
  /endpoint|crud|nuevo campo|anade .*campo|feature|funcionalidad/,
  /new field|add (?:a |an )?(?:new |optional )?field|functionality|add support for|implement/,
  /naya field|nayi? field|nayi? feature|naya feature/,
)
const FEATURE_MEDIUM_RISK = /endpoint|crud/
const BUGFIX = any(
  /bug|campo .*incorrect|mapead|mapper|dto/,
  /\bbroken\b|not working|doesn.?t work|isn.?t working|\bcrash|exception|wrong (?:field|value|data|output|result)|incorrect|mapping/,
  /kaam nahi kar|nahi chal raha|galat|kharab/,
)
const BEHAVIOR_PRESERVING = any(
  /renombr.*sin cambiar comportamiento|puramente mecanic/,
  /without changing (?:the )?behaviou?r|no behaviou?r change|purely mechanical|behaviou?r.preserving/,
  /bina behaviou?r badle|behaviou?r same|logic same|logic (?:nahi|na) badl/,
)

// --- free -------------------------------------------------------------------
const INFORMATIONAL = any(
  /explica|que es|como funciona|busca|documenta|resum|diferencia entre/,
  /explain|what is|what are|what does|how does|how do(?:es)? .* work|search|look up|find out|summari[sz]e|summary|difference between/,
  /samjhao|samjha do|samjhaiye|batao|bataiye|kya hai|kya hota|kaise kaam|kaise chalta|dhundo|dhoondo|khojo|fark kya|antar kya/,
)
const CHANGE_CUE = any(
  /corrige|arregla|cambia|implementa|anad|edita|modifica|refactoriza|renombr|typo|bug|fallo|endpoint|test|prueba|migrac|dto|crud|mapper|analiza|race|escribe|crea/,
  /\b(?:fix|change|implement|add|edit|modify|refactor|rename|write|create|update|remove|delete|analy[sz]e)\b|fail|migrat/,
  /theek karo|thik karo|sahi karo|sudhar|badlo|badal do|jodo|hatao|likho|banao|bana do/,
)

// --- fast -------------------------------------------------------------------
const MECHANICAL = any(
  /readme|documentacion|documentaci|typo|formato|comentario/,
  /documentation|\bdocs?\b|formatting|\bformat\b|\bcomments?\b|spelling|indentation/,
)
const RENAME = any(/renombr/, /\brenam/, /naam badl/)

// --- local / offline preference ---------------------------------------------
const LOCAL = any(
  /sin internet|sin conexion|modelo local|en local/,
  /\boffline\b|\bollama\b|local (?:model|llm|ai)|locally|without (?:the )?internet|no internet/,
  /bina internet|internet ke bina|internet nahi|local (?:pe|par|me|mein) (?:chala|karo)/,
)

export function classify(request) {
  const text = normalize(request)
  const has = (pattern) => pattern.test(text)
  const local = has(LOCAL)
  const result = (...args) => withLocal(outcome(...args), local)

  const unknownCause = has(UNKNOWN_CAUSE)
  const crossSystem = has(CROSS_SYSTEM)
  const highRisk = has(HIGH_RISK)

  // EXPERT claims only the most critical markers; validated Phase 1 routes
  // such as race conditions remain strong.
  if (has(EXPERT)) {
    return result(
      "expert",
      has(CRITICAL_BUG) ? "bugfix" : "analysis",
      crossSystem ? "cross-system" : "bounded",
      "high",
      "high",
      "difficult",
    )
  }

  // STRONG rules intentionally precede all localized and mechanical rules.
  if (unknownCause || crossSystem || highRisk) {
    const isUnclearBug = unknownCause || has(UNCLEAR_BUG)
    return result(
      "strong",
      isUnclearBug ? "bugfix" : "analysis",
      crossSystem ? "cross-system" : "bounded",
      highRisk ? "high" : "medium",
      unknownCause || highRisk ? "high" : "low",
      unknownCause || highRisk ? "difficult" : "deterministic",
      unknownCause,
    )
  }

  // STANDARD captures observable changes before FAST can claim a terse request.
  if (has(UNIT_TEST)) return result("standard", "test", "bounded", "low", "low", "deterministic")
  if (has(FEATURE)) {
    const risk = has(FEATURE_MEDIUM_RISK) ? "medium" : "low"
    return result("standard", "feature", "bounded", risk, "low", "deterministic")
  }
  if (has(BUGFIX) && !has(BEHAVIOR_PRESERVING)) {
    return result("standard", "bugfix", "bounded", "medium", "low", "deterministic")
  }

  // FREE only serves purely informational auxiliary work; any change cue
  // (including a README typo or a proposed test) disqualifies it. It precedes
  // FAST because pure documentation *reading* must not be claimed as an edit.
  if (has(INFORMATIONAL) && !has(CHANGE_CUE)) {
    return result("free", "auxiliary", "bounded", "low", "low", "deterministic")
  }

  // FAST is deliberately exclusive to behavior-preserving mechanical work.
  if (has(MECHANICAL) || (has(RENAME) && has(BEHAVIOR_PRESERVING))) {
    return result("fast", "mechanical", "bounded", "low", "low", "deterministic")
  }

  return result("standard", "feature", "bounded", "medium", "low", "deterministic")
}

function outcome(tier, taskType, scope, risk, ambiguity, verification, explore = false) {
  const value = { tier, reason: { taskType, scope, risk, ambiguity, verification } }
  if (explore) value.explore = true
  return value
}

function withLocal(value, local) {
  if (local) value.local = true
  return value
}

function normalize(value) {
  if (typeof value !== "string") throw new TypeError("request must be a string")
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[‘’]/g, "'")
    .toLowerCase()
}
