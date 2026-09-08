# `@dappermountain/agent-payload`

Payload CMS **agent rules**, **`payload-host` overlay skill**, and helpers to vendor [payloadcms/skills](https://github.com/payloadcms/skills). Optional peer: [`@dappermountain/agent-practices`](https://www.npmjs.com/package/@dappermountain/agent-practices).

## Install

```bash
npm install -D @dappermountain/agent-practices @dappermountain/agent-payload
# or: bun add -d @dappermountain/agent-practices @dappermountain/agent-payload
```

Installing the packages does **not** activate rules or skills in Cursor. Sync (and optionally vendor the upstream Payload skill):

```bash
npx @dappermountain/agent-payload sync
npx skills add payloadcms/skills --skill payload -y --copy -a cursor
```

Recommended `package.json` scripts:

```json
{
  "scripts": {
    "agents:sync": "agent-payload sync",
    "skills:install": "bunx skills add payloadcms/skills --skill payload -y --copy -a cursor",
    "skills:update": "bunx skills update payload -y -p",
    "skills:check": "bunx skills check -p"
  }
}
```

`agent-payload sync` runs **practices sync first** when `@dappermountain/agent-practices` is installed (`--skip-practices` to skip).

Use `-a cursor` (or an explicit agent list). Passing `-a '*'` is often glob-expanded by the shell before the skills CLI sees it.

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

## Database policy

Shared overlay is **adapter-agnostic**. Stricter database policy belongs in a host product overlay skill, not in this package.

## CLI

```text
agent-payload sync [cwd] [--postgres] [--no-postgres] [--skip-practices]
```

## License

MIT
