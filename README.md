# @vonzelle-vzt/reel-toolkit

Schema-agnostic video editor primitives shared by [NextPlay](https://github.com/vonzelle-vzt/nextplay) and [FlagPlay](https://github.com/vonzelle-vzt/flagplay).

## Status

**v0.1.0 — types-only skeleton.** Real modules land in v1.0.0:

- `editor/EnhancedVideoPlayer` — Mux player with ref-based `seekTo` / `pause` / `play` API
- `editor/ClipTrimmer` — dual-handle clip trimmer with live preview sync
- `clip-window/getClipPlayableWindow` — last-clip tail cap anchored on `eventEndTime`
- `logic-version` — `CURRENT_CLIP_LOGIC_VERSION` constant + cron auto-tighten contract
- `upload/UpChunkWrapper` — Mux upload with iOS large-file workaround + retry / offline events
- `stitch/stitchClipsToMp4` — ffmpeg trim + scale + concat (server-only)
- `mux/createReelRenderUpload` + `verifyMuxWebhook` — Mux SDK helpers

## Install (consumer apps)

```bash
# In ~/.npmrc on dev machines, or .npmrc at repo root for CI:
@vonzelle-vzt:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

# Then:
npm install @vonzelle-vzt/reel-toolkit
```

Vercel needs `NODE_AUTH_TOKEN` as a project env var (PAT with `read:packages` scope) to install during build.

## Publish (this repo)

Publishing is automated. Bump the version in `package.json`, commit, then tag and push:

```bash
npm version patch  # or minor / major
git push origin main --tags
```

The GitHub Actions workflow at `.github/workflows/publish.yml` builds and publishes to GitHub Packages on every `v*` tag. The auto-issued `GITHUB_TOKEN` has the `write:packages` permission granted by the workflow YAML — no PAT setup needed.

## Schema philosophy

The toolkit deliberately does NOT consume Prisma row types directly. Each consuming app writes a thin adapter (~50 LOC) that maps its rows into the toolkit's `ClipShape` / `ReelShape` types. That keeps the toolkit independent of either app's schema (NextPlay's `HighlightReel + ReelClip + Clip` vs FlagPlay's `Reel + ClipCandidate`) and lets the schemas evolve independently.

See `src/types/shapes.ts` for the full contract.
