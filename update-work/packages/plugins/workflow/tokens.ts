// apna-opencode: tokens for tool servers that take one, such as GitHub.
// The Plugins page writes a header like "Bearer {user-env:GITHUB_PERSONAL_ACCESS_TOKEN}" and keeps the token in the
// user's environment variable of that name, never in a file. OpenCode's own `{env:NAME}` reads the variables the
// server started with, so a token saved while the app is open would need the app reopened. This reads the user's
// variables as they are now, each time the settings load, so a saved token works at once.

const marker = /\{user-env:([^}]+)\}/g

/** The user's environment variables from the output of `reg query HKCU\Environment`. */
export function parseUserVariables(output: string) {
  const found: Record<string, string> = {}

  for (const line of output.split(/\r?\n/)) {
    const match = /^\s+(\S+)\s+REG_(?:EXPAND_)?SZ\s{4}(.*)$/.exec(line)

    if (match?.[1]) found[match[1]] = match[2] ?? ""
  }

  return found
}

/**
 * Headers with every `{user-env:NAME}` replaced by that variable's value. Undefined when no header has one;
 * `missing` when a named variable is empty or not set, which leaves the server unable to sign in.
 */
export function resolveHeaders(headers: Readonly<Record<string, string>>, variables: Readonly<Record<string, string>>) {
  if (!Object.values(headers).some((value) => value.includes("{user-env:"))) return undefined
  const missing = { value: false }
  const resolved = Object.fromEntries(
    Object.entries(headers).map(([name, value]) => [
      name,
      value.replace(marker, (_, variable: string) => {
        const found = (variables[variable] ?? "").trim()

        if (found === "") missing.value = true

        return found
      }),
    ]),
  )

  return { headers: resolved, missing: missing.value }
}
