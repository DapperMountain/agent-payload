# `@dappermountain/agent-payload`

Payload CMS **agent rules**, **`payload-host` overlay skill**, and helpers to vendor [payloadcms/skills](https://github.com/payloadcms/skills). Pairs with [`@dappermountain/agent-practices`](https://github.com/DapperMountain/agent-practices) (optional peer).

## Install (GitHub first)

```bash
bun add -d github:DapperMountain/agent-practices github:DapperMountain/agent-payload
```

Then:

```bash
bun run agents:sync    # practices + payload rules/overlay + Cursor symlinks
bun run skills:install # vendor payloadcms/skills into .agents/skills/payload
```

Recommended consumer scripts:

```json
{
  "scripts": {
    "agents:sync": "bunx @dappermountain/agent-payload sync",
    "skills:install": "bunx skills add payloadcms/skills --skill payload -y --copy -a cursor",
    "skills:update": "bunx skills update payload -y -p",
    "skills:check": "bunx skills check -p"
  }
}
```

`agent-payload sync` runs **practices sync first** when `@dappermountain/agent-practices` is installed (pass `--skip-practices` to skip).

## What sync copies

| Artifact | Destination | Notes |
| --- | --- | --- |
| `security-critical.mdc` | `.agents/rules/` | Local API / hooks / transactions |
| `i18n.mdc` | `.agents/rules/` | Payload i18n vs localization only |
| `skills/payload-host/` | `.agents/skills/payload-host/` | Host overlay |
| `database-postgres.md` | under overlay `references/` | Only if `@payloadcms/db-postgres` is a dependency, or `--postgres` |

Also ensures:

```text
.cursor/rules  -> ../.agents/rules
.cursor/skills -> ../.agents/skills
```

## Prefer sync over postinstall

Bun blocks untrusted lifecycle scripts for GitHub deps. Run `agents:sync` and `skills:install` explicitly after install / upgrade.

## Database policy

Shared overlay is **adapter-agnostic**. Hard Postgres-only policy belongs in a product overlay (e.g. a host’s `grim-payload-app`), not here.

## License

MIT

### `skills:install` agent flag

Use `-a cursor` in scripts. Passing `-a cursor` is often glob-expanded by the shell/Bun before the skills CLI sees it. For multiple agents, list them explicitly (e.g. `-a cursor -a claude-code`) rather than `*`.
