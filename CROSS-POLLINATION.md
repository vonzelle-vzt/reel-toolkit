# Cross-Pollination Protocol — `@vonzelle-vzt/reel-toolkit`

How shared code flows between **NextPlay** and **FlagPlay** through this toolkit.
Read this BEFORE making changes that touch primitives in either app.

## The map (as of 2026-05-23, v1.3.0)

```
                  ┌─────────────────────┐
                  │   reel-toolkit      │  ← src of truth for shared primitives
                  │   GitHub tarball    │
                  └────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
      ┌───────▼────────┐       ┌────────▼────────┐
      │   NextPlay     │       │    FlagPlay     │
      │  (source app)  │       │  (consumer app) │
      └────────────────┘       └─────────────────┘
```

Both apps install via:
```json
"@vonzelle-vzt/reel-toolkit": "https://github.com/vonzelle-vzt/reel-toolkit/archive/refs/tags/vX.Y.Z.tar.gz"
```

**No npm registry, no PAT, no `read:packages` scope.** Public GitHub tarball — works on Vercel out of the box.

## Workflow for a change

### Scenario A: Edit shared primitive (tips, ReelCard, ClipTrimmer, etc.)

1. Edit `src/<subpath>/<file>.ts` in `reel-toolkit`.
2. `npm run build` (regenerates `dist/`).
3. Bump `package.json` version (minor for additive, patch for fixes, major for breaking).
4. `git add src/<subpath> dist/<subpath> package.json`
5. `git commit -m "feat(<subpath>): …"`
6. `git tag vX.Y.Z`
7. `git push origin main && git push origin vX.Y.Z`
8. **In BOTH consumer apps**: bump the tarball URL in `package.json` to the new tag + `npm install` + push + deploy.

### Scenario B: Add a new primitive

1. Decide if it's schema-agnostic (good — extract) or schema-coupled (no — keep app-local).
2. Add `src/<subpath>/` to the toolkit.
3. Add the subpath to `package.json` `exports` field.
4. Follow Scenario A from step 2.

### Scenario C: NextPlay developer edits a LOCAL file that's a toolkit duplicate

**This is the bug we're guarding against.** When in doubt, ask:

> "Is this file also in the toolkit?"

If yes:
- DO NOT edit the local file.
- Edit the toolkit version, publish, bump.
- If you can't / don't want to publish right now, at least open a TODO + log it as drift.

We mitigate by **deleting local copies** as soon as a toolkit version exists. See `src/lib/content/tips.ts` deletion in `bb29b5c`. If you find another local copy, delete it after wiring imports.

## Boundary rules — what NEVER goes in the toolkit

| Pattern | Why |
|---|---|
| `db.<...>` (Prisma) | Schema-coupled; NextPlay's `HighlightReel` ≠ FlagPlay's `Reel` |
| `createClient()` / Supabase clients | Auth keys are app-specific |
| API routes (`/app/api/.../route.ts`) | Auth + ownership checks per app |
| Server actions | Need Prisma + Supabase |
| AI agents / orchestrators | Tight NextPlay-only coupling |
| `next.config.ts`, `middleware.ts` | App-level config |

If a primitive needs Prisma data, it should:
1. Accept that data via props/args (e.g. `ReelCard` takes a `ReelCardData` shape).
2. The app's adapter (`src/lib/reels/toolkit-adapters.ts` in FlagPlay) maps its Prisma rows into the shape.

## What's currently shared (v1.3.0)

| Subpath | Exports |
|---|---|
| root | `CURRENT_CLIP_LOGIC_VERSION`, `getClipPlayableWindow`, `getNetworkProfile`, `isIOSSafari`, `shouldUseLargeFileWorkaround`, `ClipShape`, `ReelShape` |
| `/editor` | `ClipTrimmer`, `EnhancedVideoPlayer`, `ReelCard`, `ReelCardClipStrip`, `CopyLinkButton`, `reelTypeMeta`, `ContinueEditingCard`, `getRelativeTime` |
| `/tips` | `SHOOTING_TIPS`, `TipsPanel`, `TipsPage`, `TIP_ICONS`, `resolveTipIcon`, `getRailTips`, `getTipsByCategory` |
| `/clip-window` | `getClipPlayableWindow` |
| `/logic-version` | `CURRENT_CLIP_LOGIC_VERSION` |
| `/network-profile` | network helpers |

## Local-copies-to-delete-next (drift risk)

NextPlay still has local copies of these — should be swapped + deleted in subsequent passes:

- `src/components/highlights/copy-link-button.tsx` (toolkit has it)
- `src/components/highlights/reel-card-clip-strip.tsx` (toolkit has it)
- `src/lib/utils/reel-type-label.ts` (toolkit has `reelTypeMeta`)
- `src/components/dashboard/continue-editing.tsx` (toolkit has it)

These weren't swapped in `bb29b5c` because (a) Tips was lowest-risk content-only and (b) ReelCard etc. have label-vocab differences NextPlay uses ("Highlight" vs FlagPlay's "Highlight Reel"). The toolkit's `reelTypeMeta` accepts a `labelOverrides` prop to handle this — see `apps/web/src/app/studio/page.tsx` in FlagPlay for the pattern.

## Tailwind v4 gotcha

Both consumer apps MUST add the toolkit's `dist/` to Tailwind's source scan, or component classes won't ship:

```css
/* app's globals.css */
@import "tailwindcss";
@source "../../node_modules/@vonzelle-vzt/reel-toolkit/dist/**/*.js";
```

FlagPlay: `apps/web/src/app/globals.css`. NextPlay: TBD (add when porting more toolkit components).

## Peer-dep requirements for consumers

- `react ^19`
- `lucide-react >= 0.300`
- `tailwindcss v4`
- `@mux/mux-player-react ^3` (optional, only for `/editor` MuxPlayer-based primitives)
