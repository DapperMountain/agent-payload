# Config, env, and generated types

Overrides upstream Payload skill defaults for host apps.

## Config entry path

Payload config may live **outside** `src/payload.config.ts`. Common host patterns:

| Pattern | Example |
|---------|---------|
| App `config/` package | `config/payload.ts` with alias `@payload-config` |
| Colocated under `src/` | `src/payload.config.ts` (upstream default) |
| Monorepo app | `apps/<app>/config/payload.ts` |

Document the **real** path in the host `AGENTS.md`. Set `PAYLOAD_CONFIG_PATH` (or equivalent) for CLI/scripts. Do not invent paths from upstream examples.

## Typed application config

Prefer a **validated config module** (e.g. Zod) over scattering `process.env` reads:

- Parse once at the config boundary; export a typed `config` object
- Map env → Payload/DB options in small adapters next to that config
- Secrets and feature flags belong in config, not hardcoded in collections/hooks

Alias pattern (optional): `@config` → validated config; `@payload-config` → `buildConfig` file.

Build-time vs runtime: Next/`payload` builds may need placeholders for secrets that only exist at runtime — document that in the host config README, not by reading raw env in feature code.

## Generated TypeScript types

Upstream docs often use `payload-types.ts` at the project root.

**Preferred host convention:**

- Emit types to a stable path such as `src/types.ts` via `typescript.outputFile` in `buildConfig`
- Import as `@/types` (or the host’s alias) — **not** `@/payload-types`
- **Do not** barrel-export generated types from a feature `index.ts`
- After schema changes: regenerate types (`payload generate:types` / host script) and keep the file committed if other packages depend on it

GraphQL schema output (if used) should likewise use an explicit `schemaOutputFile` under the host app.
