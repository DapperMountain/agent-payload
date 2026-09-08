# PostgreSQL adapter notes (opt-in)

This file is copied into the consumer only when sync detects `@payloadcms/db-postgres` or `--postgres` is passed. It is **not** a hard “Postgres only” policy for all Payload hosts.

## Adapter

Use `@payloadcms/db-postgres` (Drizzle) when the host chooses Postgres. Follow Payload’s migration workflow for that adapter.

## Transactions

Nested Local API calls in hooks must pass `req` so operations share the same Drizzle transaction (see `security-critical.mdc`).

## Host ownership

Migrations and connection env vars belong to the host app, not to plugin packages. Prefer documenting the host’s real migrate/seed commands in `AGENTS.md` or a product overlay skill.
