# PostgreSQL adapter notes (opt-in)

Synced only when the consumer depends on `@payloadcms/db-postgres` or `--postgres` is passed. Not a hard “Postgres only” policy for all hosts.

## Adapter

Use `@payloadcms/db-postgres` (Drizzle). Follow Payload’s migration workflow for that adapter (`migrationDir`, `prodMigrations`, host migrate scripts).

## Transactions

Nested Local API calls in hooks must pass `req` so operations share the same Drizzle transaction (see `security-critical.mdc`).

## Host ownership

Connection env, pool options, and migrate/seed commands belong to the host app. Prefer documenting the host’s real commands in `AGENTS.md` or a product skill.
