# Cross-Pollination Protocol — `@vonzelle-vzt/reel-toolkit`

How shared code flows between **NextPlay** and **FlagPlay** through this toolkit.
Read this BEFORE making changes that touch primitives in either app.

**Status (2026-05-24, v1.4.0):** Cross-pollination is now fully automated.
Editing a shared primitive in this toolkit → push tag → both consumer apps
get an auto-PR within ~1 minute via `.github/workflows/notify-consumers.yml`.
Merge the PR; Vercel auto-deploys. **The maintainer never edits the consumer
apps' `package.json` toolkit URL by hand.**

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

**That's it.** The `notify-consumers` workflow fires on the tag push and
opens an auto-PR on both FlagPlay and NextPlay bumping their toolkit URL.
Review + merge each PR; Vercel auto-deploys. No manual `package.json`
editing on the consumer side.

If the PR fails to open (e.g. PAT expired, consumer repo branch protection
issue), the workflow logs the failure. Fall back to the manual step:
edit consumer's `package.json` tarball URL → `npm install` → push → deploy.

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

## What's currently shared (v1.4.0)

| Subpath | Exports |
|---|---|
| root | `CURRENT_CLIP_LOGIC_VERSION`, `getClipPlayableWindow`, `getNetworkProfile`, `isIOSSafari`, `shouldUseLargeFileWorkaround`, `ClipShape`, `ReelShape` |
| `/editor` | `ClipTrimmer`, `EnhancedVideoPlayer`, `ReelCard`, `ReelCardClipStrip`, `CopyLinkButton`, `reelTypeMeta` (with `chipClassOverrides`), `ContinueEditingCard`, `getRelativeTime` |
| `/tips` | `SHOOTING_TIPS`, `TipsPanel`, `TipsPage`, `TIP_ICONS`, `resolveTipIcon`, `getRailTips`, `getTipsByCategory` |
| `/clip-window` | `getClipPlayableWindow` |
| `/logic-version` | `CURRENT_CLIP_LOGIC_VERSION` |
| `/network-profile` | network helpers |

## Consumer-side adapter pattern (NextPlay v6.56)

When a consumer needs app-specific wiring (toasts, custom palette, data
mapping from app-specific Prisma rows), keep a thin **adapter file** at the
consumer's old import path so existing callsites don't change. The adapter
calls the toolkit with the app-specific bits baked in.

Examples from NextPlay (commit `84497e5`):

```ts
// nextplay/src/components/highlights/copy-link-button.tsx
import { toast } from "sonner";
import { CopyLinkButton as ToolkitCopyLinkButton } from "@vonzelle-vzt/reel-toolkit/editor";

export function CopyLinkButton(props) {
  return (
    <ToolkitCopyLinkButton
      {...props}
      onSuccess={() => toast.success("Share link copied")}
      onError={() => toast.error("Couldn't copy")}
    />
  );
}
```

```ts
// nextplay/src/lib/utils/reel-type-label.ts
import { reelTypeMeta as toolkitMeta } from "@vonzelle-vzt/reel-toolkit/editor";

const NEXTPLAY_CHIP_PALETTE = {
  SOCIAL_VERTICAL: "border-accent-500/30 bg-accent-500/15 text-accent-200",
  RECRUITING: "border-brand-500/30 bg-brand-500/15 text-brand-200",
  // ... custom palette mappings
};

export function reelTypeMeta(type) {
  return toolkitMeta(type, { chipClassOverrides: NEXTPLAY_CHIP_PALETTE });
}
```

The adapter has 3 jobs:
1. Match the consumer's old import path so callsites don't move
2. Bake in app-specific config (toast library, palette tokens, data shape)
3. Delegate everything else to the toolkit

**All visible/behavioral changes go in the toolkit.** Adapters just plumb.

## Still-NOT-shared (potential extraction candidates)

These NextPlay editor files are NOT yet in the toolkit. Updates to them
in NextPlay do NOT flow to FlagPlay. Extract when there's product value:

- `src/app/(dashboard)/reel-preview/[reelId]/preview-client.tsx` — the
  main reel preview UI with 3 player-mode tabs (Clips/Highlight/Movie),
  cut-length tabs, game-context card, music section, cinematic options.
  Toolkit PR 2 in the original crossover plan.
- `src/app/(dashboard)/editor/[reelId]/editor-client.tsx` — the advanced
  editor with settings sidebar, brand overlay, annotations layer, player
  spotlight, AI feedback, content kit. Toolkit PR 3 in the original plan.
- `src/components/upload/video-uploader.tsx` — multi-file upload queue
  with progress / ETA / iOS large-file workaround / retry.
- `src/components/dashboard/recent-highlights.tsx` — the section parent
  that wraps the toolkit `ReelCard` in NextPlay's pagination + filtering
  + section heading. FlagPlay has its own `/studio/page.tsx` that uses
  the toolkit `ReelCard` directly, so this isn't strictly a duplicate.

## Recently-swapped (NextPlay v6.56, commit 84497e5)

These NextPlay-local files are now thin adapters around the toolkit
versions. Edits to behavior should go in the toolkit; edits to
NextPlay-specific wiring (toast lib, palette, data shape) stay in the
adapter:

- ✅ `src/components/highlights/copy-link-button.tsx` — wraps toolkit
  with Sonner toast callbacks
- ✅ `src/components/highlights/reel-card-clip-strip.tsx` — pure
  re-export
- ✅ `src/lib/utils/reel-type-label.ts` — wraps toolkit with
  `chipClassOverrides` for NextPlay's accent/brand palette
- ✅ `src/components/dashboard/continue-editing.tsx` — wraps toolkit
  with reels → ContinueEditingItem mapper
- ✅ `src/app/(dashboard)/tips/page.tsx` + `whats-next-card.tsx` —
  import directly from toolkit (local `tips.ts` deleted)

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
