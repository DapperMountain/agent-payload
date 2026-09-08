# `@dappermountain/agent-payload`

Payload CMS **agent rules**, **`payload-overrides` skill** (host conventions that override the vendored Payload skill), and helpers to vendor [payloadcms/skills](https://github.com/payloadcms/skills). Optional peer: [`@dappermountain/agent-practices`](https://www.npmjs.com/package/@dappermountain/agent-practices).

## Install

```bash
bun add -d @dappermountain/agent-practices @dappermountain/agent-payload
```

Installing the packages does **not** activate rules or skills in Cursor. Sync (and optionally vendor the upstream Payload skill):

```bash
bunx @dappermountain/agent-payload sync
bunx skills add payloadcms/skills --skill payload -y --copy -a cursor
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

`agent-payload sync` runs **practices sync first** when `@dappermountain/agent-practices` is installed (`--skip-practices` to skip). Pass `--skip-overrides` when the consumer does not want the shared overrides skill (e.g. only a product skill under `apps/<app>/.agents/skills/`).

Use `-a cursor` for `skills:install` (shells often expand `*`).

## What sync copies

| Artifact | Destination | Notes |
| --- | --- | --- |
| `security-critical.mdc` | `.agents/rules/` | Local API / hooks / transactions |
| `i18n.mdc` | `.agents/rules/` | Payload i18n vs localization only |
| `skills/payload-overrides/` | `.agents/skills/payload-overrides/` | Host overrides for the vendored payload skill |

Also ensures `.cursor/rules` → `.agents/rules` and `.cursor/skills` → `.agents/skills`, and removes legacy `payload-overlay` / `payload-host` skill folders.

## `payload-overrides` contents

| Reference | Covers |
| --- | --- |
| `CONFIG.md` | Config path, typed env, `src/types.ts` (not `payload-types.ts`) |
| `LAYOUT.md` | Folder-per-collection, co-located access/hooks, barrels |
| `HOST.md` | Host-owned migrations/seed; plugins stay product-agnostic |

## CLI

```text
agent-payload sync [cwd] [--skip-practices] [--skip-overrides]
```

## License

MIT
