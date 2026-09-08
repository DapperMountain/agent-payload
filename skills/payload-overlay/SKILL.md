---
name: payload-overlay
description: >-
  Host-app overlay for Payload CMS projects. Use with the vendored payload
  skill. Covers config path, Bun vs upstream pnpm docs, host-owned
  migrations/seed, and not hand-editing vendored skills. Database-agnostic
  by default.
---

# Payload host overlay

Read this skill **before** generic guidance in the vendored [payload skill](../payload/SKILL.md).

Upstream Payload skill docs often assume `pnpm`, a default `src/payload.config.ts` path, and a particular database. Prefer this overlay + the host’s `AGENTS.md` for project facts.

## Reading order

1. This skill (`payload-overlay`) — and any product-specific overlay the host maintains on top.
2. Vendored [payload/SKILL.md](../payload/SKILL.md).
3. Synced rules under `.agents/rules/` (`security-critical`, Payload `i18n`, plus practices from `@dappermountain/agent-practices` when present).

## Config path

Payload config may live outside the upstream default `src/payload.config.ts`. Document and use the **host’s real path** (e.g. `src/payload.config.ts`, `src/config/payload.ts`, or monorepo `apps/<app>/src/...`). Do not invent a path from upstream examples.

## Package manager

Ignore upstream **pnpm** assumptions in vendored Payload skill docs. The host’s runtime package manager comes from `agent-practices` / the host (`bun` in DapperMountain consumers). Do not restate a full Bun rulebook here — follow `bun.mdc` when synced.

## Security and Local API

Prefer Local API / access / hooks patterns from `.agents/rules/security-critical.mdc`:

- When passing `user`, set `overrideAccess: false`
- Pass `req` into nested hook operations
- Use `context` flags to avoid hook loops

Adapter-conditional transaction notes (Mongo **and** Postgres) in that rule apply when the host uses those adapters.

## Migrations and seed

The **host** owns schema migrations and product seed. Plugin packages stay product-agnostic: they may export seed helpers the host calls, but the host decides when/how to migrate and seed.

## Database

**Database-agnostic by default** — do not ban Mongo or require Postgres in this shared overlay. Product hosts may add a stricter overlay (e.g. Postgres-only).

Optional Postgres notes land at [references/database-postgres.md](references/database-postgres.md) only when `agents:sync` detects `@payloadcms/db-postgres` or `--postgres` is passed.

## Vendored payload skill

- Hub: `.agents/skills/payload/SKILL.md`
- Install / update via the host’s `skills:install` / `skills:update` (wrapping `bunx skills … payloadcms/skills`)
- **Do not hand-edit** vendored `skills/payload/` — update with the skills CLI

## Keeping docs in sync

After changes that affect config path, env, migrations/seed layout, or adapter choice, update this overlay’s references and the host `AGENTS.md` in the same session. See `agent-workflow.mdc` documentation-sync section.
