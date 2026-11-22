# Spec: notwallet monorepo structure

| Field        | Value |
| ------------ | ----- |
| Status       | In progress |
| Owner        | Seto Elkahfi |
| Created      | 2026-11-22 |
| Last updated | 2026-11-22 |
| Services     | notwallet (desktop and mobile app, `apps/web`, `apps/extension`) |

## 1. Summary

notwallet follows the same monorepo shape as `sigit-app`: the root is the Tauri app, web
sub-projects live under `apps/<name>/` with their own `pnpm-workspace.yaml`, deployables are
declared in a root `.smb/config.toml` (`runner = 255`), CI is split into path-scoped `ci-check-*`
workflows and per-channel `release-*` workflows, and agent guidance lives in `AGENTS.md` and
`.agents/`. This spec records the move. The reference is `sigit-app/.agents/specs/monorepo-structure.md`.

## 2. Problem & Motivation

The marketing site (`notwallet-web`) and the browser extension (`notwallet-extension`) were
separate repositories with separate CI, package managers (yarn in the extension) and deploy
flows (`git push deploy` for the site). Release workflows ran on every push to `main`, so a
merge could start five store builds. There was no agent guidance, and implementation summaries
in `docs/` had drifted from the code.

## 3. Goals

- One repository for the app, the site and the extension.
- Each `apps/*` project installs and builds on its own, with pnpm.
- A PR touching only one area runs only that area's checks.
- A release starts only from a `release/*` branch or a manual run.

## 4. Non-Goals

- Folding in `notwallet-api` (a Loco Rust service), `notdax` or `thestablefoundationorg`.
- Changing how the web site is served in production (see §8).
- Changing signing or store credentials.

## 5. Requirements

- **Locked:** `apps/web` and `apps/extension` each keep their own `pnpm-workspace.yaml` and
  lockfile; the root workspace never installs them.
- **Locked:** the root `.smb/config.toml` has `runner = 255`.
- **Locked:** release workflows trigger on `release/*` push or `workflow_dispatch`, never on `main`.
- **Locked:** PR checks use path filters; config-only changes under `src-tauri/tauri*.json` run
  `ci-check-tauri-config.yml`, not the cargo matrix.
- Tool config is found by walking up the filesystem, so a sub-project that uses a different
  major version of a tool than the root (Tailwind 3 at the root, 4 in the extension) needs its
  own config file to stop the search.

## 6. Design / Proposed Solution

```
notwallet/
├── src/, app/, src-tauri/   # Tauri app
├── _crates/, _spm/, _gems/  # wallet core and bindings
├── apps/
│   ├── web/                 # Astro SSR marketing site (was notwallet-web)
│   └── extension/           # Chrome and Firefox extension (was notwallet-extension)
├── .smb/config.toml         # smbCloud monorepo config
├── .agents/                 # skills and specs
└── .github/workflows/       # ci-check-*.yml, release-notwallet-*.yml
```

| Sub-project | Runtime | Deploy |
|---|---|---|
| app | Tauri | App Store, Play, Microsoft Store, direct download (see the `releases` skill) |
| `apps/web` | Astro SSR, Node | smbCloud, once its FrontendApp is registered |
| `apps/extension` | Vite and crxjs | built by CI, uploaded by hand to the browser stores |

## 7. Implementation Plan

1. Repo hygiene: `.gitignore`, `.xcode-version`.
2. Agent docs and specs (this change).
3. `check:*` scripts, `tauri` and `ts` package scripts, Makefile targets.
4. CI split and release triggers.
5. Fold `notwallet-web` into `apps/web`.
6. Fold `notwallet-extension` into `apps/extension`.

Each step is its own PR.

## 8. Risks, Tradeoffs & Open Questions

- **Open:** the site's FrontendApp id must come from the smbCloud console; until then its
  `[[projects]]` entry stays commented out and the old `git push deploy` remote is the deploy path.
- **Open:** production runs `run-server.js` (Astro middleware mode with Express on `:3020`).
  The `astro-ssr` runner starts `node dist/server/entry.mjs`, so adopting it means switching the
  adapter to standalone mode. Not part of the move.
- **Open:** archive the two old repositories with a pointer here once the move is merged.
- **Tradeoff:** sub-workspaces mean three installs instead of one, in exchange for no version
  clashes between Tailwind 3, Tailwind 4 and Astro.

## 9. Dependencies & Sequencing

Steps 5 and 6 add paths that the workflows from step 4 filter on; they can merge in any order
but each needs its own `ci-check-*` workflow, which ships with it.

## 10. Validation & Success Criteria

- `pnpm build` at the root still passes with `apps/*` present.
- `pnpm build` in `apps/web` and `pnpm build:chrome` and `pnpm build:firefox` in `apps/extension` pass.
- A PR that edits only `apps/web/**` runs only the web check.
- Pushing a commit to `main` starts no release workflow.

## 11. References

- `sigit-app/.agents/specs/monorepo-structure.md`
- `AGENTS.md`
