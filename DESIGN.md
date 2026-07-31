# DESIGN.md — `@vonzelle-vzt/reel-toolkit`

> **This is a LIBRARY CONTRACT, not a product taste cache.** This repo ships no app and no
> stylesheet. It publishes React primitives that render *inside* NextPlay and FlagPlay. So this
> file answers three questions for a consumer: **what the toolkit provides, what a host may
> override, and what is structural and must never be overridden.** Read `## The override
> contract` before changing any class string here — a class edited in this repo restyles two
> production apps within ~3 minutes via `notify-consumers.yml` auto-merge.

```yaml
version: 1
name: reel-toolkit
description: >
  A dark-only, zinc-surfaced video reel editor kit. The mood is a workbench, not a
  brochure: near-black surfaces, hairline zinc borders, tiny dense type, and no shadows —
  so the only bright thing on screen is the footage. Three accents carry meaning and are
  never decorative: AMBER is the product (brand chrome, hero/star, attention, CTAs), SKY is
  clip geometry (trim window, clip in/out edges), PINK is live playback position (playhead,
  transport speed, volume). Player chrome over arbitrary footage uses pure black/white
  scrims on purpose — that is correct, not debt. Deliberately restrained: no light mode, no
  shadow ladder, one breakpoint.

# ── Token source of truth ───────────────────────────────────────────────────
# There is NO CSS file, no tailwind.config, no CSS-in-JS, and no design-token
# module anywhere in this repo. Verified: `find` for *.css/*.scss/*.less,
# tailwind.config.*, postcss.config.*, components.json, tokens.*, theme.ts,
# colors.ts returns ZERO matches; package.json declares no styled-components /
# emotion / vanilla-extract / stitches / tailwindcss.
#
# The token layer is the STOCK TAILWIND v4 DEFAULT PALETTE, referenced by
# utility class strings inside the .tsx sources. That is a deliberate contract,
# stated in src/editor/reel-type-meta.ts:8-11 and src/editor/index.ts:5 —
# "no custom accent-*/brand-*/surface-* names, so the chip renders identically
# in NextPlay, FlagPlay, and any future consumer."
source: src/**/*.tsx  (utility class strings) → mirrored into committed dist/**/*.js
sourceNote: >
  A library cannot know its own hex values. `bg-zinc-900` resolves to whatever
  --color-zinc-900 is in the CONSUMER's Tailwind theme. Recording hexes here
  would be inventing values this repo does not declare, and would be wrong for
  any consumer that redefines the family. The class name IS the token.

# ── Base layer ──────────────────────────────────────────────────────────────
# Every entry below was read out of a real class string in src/. Counts are
# occurrences across src/**/*.tsx. 50 distinct palette classes, 204 occurrences.
colors:
  # Surface ladder — background steps, darkest to lightest
  surface-page:      bg-zinc-950        # player letterbox bed, expanded-panel bed
  surface-card:      bg-zinc-900        # every card, panel, tab strip (8×)
  surface-raised:    bg-zinc-800        # thumbnails, pills, tracks, hover, active tab (23×)
  surface-translucent: bg-zinc-950/60   # TipsPanel aside; bg-zinc-950/40 tip rows

  # Borders — hairline only, never a shadow
  border-default:    border-zinc-800    # cards, panels, dividers (8×)
  border-control:    border-zinc-700    # tab strips, player transport bar
  divider:           divide-zinc-800    # ReorderableClipList row rule

  # Text ladder
  text-primary:      text-zinc-100      # titles, headings, values (12×)
  text-secondary:    text-zinc-300      # body, control glyphs (14×)
  text-muted:        text-zinc-400      # captions, inactive glyphs (13×)
  text-faint:        text-zinc-500      # metadata, timestamps, idle icons (15×)
  text-on-amber:     text-zinc-950      # only on the solid amber CTA (TipsPage)
  text-placeholder:  text-zinc-700      # Film icon in the empty-thumbnail slot

  # AMBER — the product accent. Brand, hero/star, attention, CTA.
  accent:            text-amber-400     # icons, active tab label, arrows (11×)
  accent-soft:       text-amber-300     # pill labels, reason text (10×)
  accent-solid:      bg-amber-500       # solid CTA + hero-star badge (19× incl. /N tints)
  accent-hover:      bg-amber-400
  accent-ring:       ring-amber-400     # DRAGGING row outline
  accent-ring-soft:  ring-amber-500/40  # Hero cut tab
  accent-border:     border-amber-500   # attention card, quickstart, chips (8×)
  accent-border-hover: border-amber-400/30  # ReelCard hover

  # SKY — clip geometry ONLY. Trim window and clip in/out edges.
  clip-window-fill:  bg-sky-500/20      # ClipTrimmer selected range
  clip-window-edge:  border-sky-500/40  # range top/bottom hairline
  clip-window-scrub: bg-sky-500/25      # same range projected onto the player scrubber
  handle-idle:       bg-sky-500/70
  handle-hover:      bg-sky-400
  handle-dragging:   bg-sky-400
  clip-marker:       bg-sky-400         # 2px in/out markers on the scrubber
  timecode-accent:   text-sky-400       # trim in/out timecode labels
  loop-active:       bg-sky-500/20 text-sky-400

  # PINK — live playback position ONLY. Never a surface, never a brand color.
  playhead:          bg-pink-500        # progress fill
  speed-active:      bg-pink-600        # active playback-rate button
  volume:            accent-pink-400    # native range input accent

  # Semantic
  status-ready:      bg-emerald-500/15 text-emerald-300
  status-rendering:  bg-amber-500/15 text-amber-300
  status-destructive: text-red-400      # Remove button hover ONLY (no solid danger)
  game-context:      bg-orange-500/10 text-orange-400

  # Player chrome — pure black/white over arbitrary footage. CORRECT, not debt.
  # Excluded from every gate below. See "## Player chrome is not debt".
  scrim-strong:      bg-black/70        # copy-link + reorder buttons on a thumbnail (3×)
  scrim-medium:      bg-black/50
  scrim-soft:        bg-black/40        # play-overlay disc
  chrome-fg:         text-white / fill-white
  handle-grip:       bg-white/60        # the 2px grip line inside a trim handle

typography:
  # No font-family is ever declared. The toolkit INHERITS the consumer's font
  # stack for everything except `font-mono`, which it applies to numerics.
  page-title:   { class: "text-3xl sm:text-4xl", weight: font-black, tracking: tracking-tight }
  section:      { class: text-lg,  weight: font-semibold }
  card-title:   { class: text-sm,  weight: font-medium }
  body:         { class: text-sm,  leading: leading-relaxed }
  control:      { class: text-xs,  weight: font-medium }   # tabs, captions
  meta:         { class: "text-[11px]" }                   # subheadings, reason text
  pill:         { class: "text-[10px]", weight: font-medium }
  micro:        { class: "text-[9px]",  weight: font-medium }  # ReelCard metadata pills
  numeric:      { class: font-mono }                       # timecodes, score, stat labels
  eyebrow:      { class: "text-xs", weight: font-semibold, tracking: "tracking-widest / tracking-[0.3em]", transform: uppercase }

rounded:
  sm:   rounded-sm     # clip-strip thumbs, trim handle caps (rounded-l-sm / -r-sm)
  md:   rounded-md     # buttons, thumbnails, pills, trim track (16× — the default)
  lg:   rounded-lg     # tab strips, player top/bottom (rounded-t-lg / -b-lg), tip rows
  xl:   rounded-xl     # every CARD (6×)
  2xl:  rounded-2xl    # TipsPage quickstart panel only
  full: rounded-full   # status/metadata pills, play disc, hero-star badge (12×)

motion:
  colors:    transition-colors      # 9× — the default for any interactive state
  all:       transition-all         # 5× — cards, opacity/position combos
  transform: transition-transform   # thumbnail scale-105, play-disc scale-110 on hover
  playhead:  "transition-[width] duration-75"   # ONLY explicit duration in the repo
  pending:   animate-spin           # Loader2 / Loader, 5×
  # No custom easing, no duration tokens, no reduced-motion handling. See Known gaps.

elevation:
  # There is ONE shadow in the entire library (shadow-lg on CopyLinkButton, which
  # floats over video). Lift is otherwise expressed as a surface step + hairline
  # border. Do not add shadows.
  card:    "bg-zinc-900 + border border-zinc-800 + rounded-xl"
  raised:  "bg-zinc-800 (no border)"
  overlay: "bg-black/N + backdrop-blur-sm"   # 4× — the only blur use

# ── Variant layers ──────────────────────────────────────────────────────────
# There are NO CSS variant scopes in this repo. Verified: zero occurrences of
# :root, .dark, [data-theme], [data-*-skin], or @media (prefers-*) — there is no
# CSS at all to hold them. Theming happens through PROPS, at the consumer
# boundary. These are the real variant mechanisms:
variants:
  'className prop (every component)':
    description: >
      Merged through `cn()` = clsx + tailwind-merge (src/editor/cn.ts). Last-wins
      PER UTILITY GROUP, so a host passing `bg-white` replaces `bg-zinc-900` but
      leaves `border-zinc-800` and `rounded-xl` intact. This is the primary and
      often the ONLY theming hook. TipsPanel/TipsPage are the exception — they
      use raw template-string concat, not `cn()`, so a host class APPENDS rather
      than replaces and loses to specificity ties.
  'chipClassOverrides (reel-type-meta only)':
    description: >
      The one first-class palette-swap seam. `reelTypeMeta(type, {chipClassOverrides})`
      lets a host replace the whole chip class string per reel type. NextPlay uses it
      to map the toolkit's stock chips onto its own accent-*/brand-* tokens
      (nextplay/src/lib/utils/reel-type-label.ts). Defaults are stock-only so a
      consumer that passes nothing still renders.
  'labelOverrides (reel-type-meta, PlayerModeTabs)':
    description: Copy vocabulary only. Icons and colors stay fixed — that is what makes cards recognizable across apps.
  'sm: breakpoint':
    description: >
      The ONLY responsive variant. 36 `sm:` usages, ZERO md:/lg:/xl:. Mobile is the
      base layer; `sm:` is the desktop refinement. See "## Responsive behavior".
  'consumer @source scan (NOT a style variant — a compile gate)':
    description: >
      Tailwind v4 does not scan node_modules. A consumer MUST add
      `@source "../../node_modules/@vonzelle-vzt/reel-toolkit/dist/**/*.js";`
      to its globals.css or these classes emit NO CSS. FlagPlay has it
      (apps/web/src/app/globals.css:6). NextPlay DOES NOT — see Known gaps #1.

components:
  ClipTrimmer:
    track:        "h-8 w-full rounded-md {colors.surface-raised}"
    range:        "{colors.clip-window-fill} + border-y {colors.clip-window-edge}"
    handle:       "w-6 sm:w-3, -translate-x-1/2, touch-none, cursor-ew-resize, rounded-l-sm/-r-sm"
    handleGrip:   "h-3 w-0.5 rounded-full {colors.handle-grip}"
    states:       "idle {colors.handle-idle} / hover+dragging {colors.handle-hover} / no focus ring (gap)"
    timecodes:    "-bottom-5, font-mono text-[9px] {colors.timecode-accent}, m:ss.cc"
    header:       "text-[10px] font-medium {colors.text-muted} + Reset button {colors.text-faint}→zinc-300"
  EnhancedVideoPlayer:
    stage:        "{colors.surface-page} rounded-t-lg, aspect-ratio 16/9, --media-object-fit: contain (LETTERBOX)"
    scrubber:     "h-2 {colors.surface-raised}, click-to-seek anywhere"
    playhead:     "{colors.playhead} + {motion.playhead}"
    clipOverlay:  "{colors.clip-window-scrub} range + two w-0.5 {colors.clip-marker} edges"
    transport:    "rounded-b-lg border border-t-0 {colors.border-control} {colors.surface-card} px-3 py-2"
    timecode:     "min-w-[110px] font-mono text-xs — width RESERVED so the row never jitters"
    states:       "speed active {colors.speed-active} text-white / loop active {colors.loop-active} / icon hover bg-zinc-800"
  ReorderableClipList:
    shell:        "rounded-xl border {colors.border-default} {colors.surface-card}; rows divide-zinc-800"
    row:          "px-3 py-2.5 sm:px-4 sm:py-3, {colors.surface-card} (opaque — required so a dragged row is not see-through)"
    dragging:     "opacity 0.5 (inline style) + ring-1 {colors.accent-ring} + z-10"
    handle:       "h-8 w-8, cursor-grab → active:cursor-grabbing, touchAction:none, aria-label 'Drag clip N'"
    sensors:      "Pointer distance 6px · Touch delay 250ms tolerance 8 · Keyboard (a11y)"
    thumbnail:    "h-12 w-20 sm:h-14 sm:w-24 rounded-md {colors.surface-raised}, object-cover, Mux 200×112 smartcrop @ peakTime"
    heroBadge:    "h-4 w-4 rounded-full {colors.accent-solid} + Star fill-white, top-left 2px inset"
    states:       "pin active bg-amber-500/20 text-amber-300 / pinning opacity-60 / removing opacity-50 / remove hover text-red-400 / saving 'Saving…' + animate-spin"
  ReelCard:
    shell:        "rounded-xl border {colors.border-default} {colors.surface-card} p-3, hover:{colors.accent-border-hover}"
    thumbnail:    "aspect-video, bg-gradient-to-br from-zinc-800 to-zinc-900, object-cover, group-hover:scale-105"
    chip:         "absolute left-2 top-2, rounded-full border px-2 py-0.5 text-[10px] backdrop-blur-sm, class from reelTypeMeta"
    playOverlay:  "h-10 w-10 rounded-full {colors.scrim-soft} backdrop-blur-sm, group-hover:scale-110"
    pills:        "rounded-full px-1.5 py-0.5 text-[9px] font-medium — zinc-800 neutral, amber-500/N attention, emerald-500/15 ready"
    empty:        "Film icon h-8 w-8 {colors.text-placeholder} — NEVER falls back to the source video's playbackId"
    states:       "hover reveals reorder + copy-link on sm: (opacity-0 → group-hover:opacity-100); both stay VISIBLE on mobile"
  ReelCardClipStrip:
    collapsed:    "h-8 w-3 slivers on mobile; h-8 sm:w-12 full thumbs on desktop"
    expanded:     "tap toggles h-8 w-12 inline (mobile only affordance)"
    overflow:     "'+N' chip, {colors.surface-raised} text-zinc-300 text-[10px]"
  PlayerModeTabs / CutLengthTabs:
    strip:        "flex gap-1 rounded-lg border {colors.border-control} {colors.surface-card} p-1 w-fit, role=tablist"
    tab:          "rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
    states:       "active bg-zinc-800 {colors.accent} / idle {colors.text-faint} hover:text-zinc-300"
    heroTab:      "bg-amber-500/20 text-amber-300 ring-1 {colors.accent-ring-soft} — deliberately louder than the other cuts"
  GameContextCard:
    shell:        "rounded-xl border {colors.border-default} {colors.surface-card} overflow-hidden"
    icon:         "h-10 w-10 rounded-lg {colors.game-context}"
    score:        "rounded-md {colors.surface-raised} px-3 py-1.5 font-mono text-sm font-bold"
    expanded:     "border-t {colors.border-default} bg-zinc-950/50, grid-cols-2 sm:grid-cols-3"
    statLabel:    "font-mono text-[10px] uppercase tracking-wider {colors.text-faint}"
    empty:        "returns null when there is no opponent, no score and no analysis — never an empty card"
  ContinueEditingCard:
    shell:        "rounded-xl border border-amber-500/20 bg-amber-500/5 — the ONLY amber-tinted container; it means 'needs you'"
    row:          "divide-amber-500/10, hover:bg-amber-500/5"
    action:       "min-h-[32px] py-1.5 sm:min-h-0 sm:py-1 — explicit ≥32px mobile touch target"
    states:       "primary bg-amber-500/20 text-amber-100 / ghost text-zinc-400 hover:bg-amber-500/10 / pending Loader2 + disabled:opacity-50"
    empty:        "returns null when items is empty — no 'all caught up' card, by design"
  CopyLinkButton:
    base:         "absolute bottom-2 right-2, h-7 sm:h-6 rounded-full {colors.scrim-strong} text-white shadow-lg backdrop-blur-sm"
    states:       "hover:bg-amber-500 / copied → Check icon + 'Copied' for 2000ms / hidden when shareToken is null"
  TipsPanel / TipsPage:
    panel:        "rounded-xl border {colors.border-default} bg-zinc-950/60 p-4"
    quickstart:   "rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6"
    cta:          "rounded-md {colors.accent-solid} px-5 py-2.5 text-sm font-semibold {colors.text-on-amber} hover:{colors.accent-hover}"
    note:         "these two use raw string concat, NOT cn() — className appends, it does not override"
```

---

## Overview

`reel-toolkit` is a workbench, not a brochure. Everything in it exists to sit around a video
frame without competing with it: near-black surfaces (`zinc-900` / `zinc-950`), hairline
`zinc-800` borders instead of shadows, and type that runs small and dense — `text-[9px]` and
`text-[10px]` pills are normal here, not a mistake.

The defining characteristics:

- **Dark-only, and structurally so.** There is no light mode and no mechanism that could
  produce one. Every surface is a literal `zinc-9xx` class; there is no `:root`, no `.dark`,
  no `prefers-color-scheme`.
- **Three accents, each with one job.** Amber = product. Sky = clip geometry. Pink = live
  playback position. An agent that swaps one for another breaks a *semantic*, not a style.
- **Stock palette by contract.** No `brand-*`, `accent-*`, or `surface-*` names appear
  anywhere. That is what makes the same component render in two apps with different themes,
  and it is enforced by Gate 1 below.
- **No shadow ladder.** One `shadow-lg` in the whole library, on a button that floats over
  video. Depth is a surface step plus a hairline.
- **One breakpoint.** 36 `sm:` usages; zero `md:` / `lg:` / `xl:`. Mobile is the base.

## The override contract

This is the section a consumer needs. Three tiers:

| Tier | What | How a host changes it |
|---|---|---|
| **Provided — overridable** | Container surface, border, radius, padding, positioning | Pass `className`; `cn()` merges last-wins per utility group |
| **Provided — swappable by prop** | Reel-type chip palette, all user-facing labels, which tabs/modes render | `chipClassOverrides`, `labelOverrides`, `modes` / `cuts` arrays |
| **Structural — never override** | Handle hit targets, `touch-none` / `touchAction:none`, `-translate-x-1/2` centering, drag sensor thresholds, `min-w-[110px]` timecode reservation, `--media-object-fit: contain`, `role=tablist` / `aria-selected`, the `opacity: 0.5` drag state | Do not. These are interaction correctness, not taste. Overriding them breaks touch scrolling, frame-accurate scrubbing, or a11y. |

**Interior elements are NOT reachable.** `className` lands on the outer wrapper only. There is
no `classNames={{ handle, track, row }}` slot API. A host that needs a different trim-handle
color today has to fork the component — that is the largest gap in this contract (Known gaps
#4). Consumers should therefore treat the toolkit's *interior* palette as fixed and theme only
the shell.

## Editor rules

These are the rules re-derived on every timeline UI and almost never written down. All of them
were read out of this repo.

**Hit targets.** Trim handles are `w-6` (24px) on mobile and `sm:w-3` (12px) on desktop, both
`-translate-x-1/2` so the grab area stays centered on the boundary regardless of width. The
drag handle is `h-8 w-8`. `ContinueEditingCard` actions reserve `min-h-[32px]` on mobile. Any
new draggable affordance follows the same shape: ≥24px touch, tighten at `sm:`.

**Touch vs scroll.** Every draggable element sets `touch-none` (Tailwind) or
`style={{touchAction:'none'}}` (dnd-kit rows). Without it iOS Safari steals the gesture as a
page scroll. `TouchSensor` additionally requires a **250ms long-press** with 8px tolerance so a
flick still scrolls the list; `PointerSensor` needs only 6px of travel. Never lower the touch
delay to match the pointer distance.

**Playhead vs clip edges.** The playhead is `bg-pink-500` and is the only thing that moves with
time; it is the sole user of `transition-[width] duration-75` (fast enough to look continuous,
slow enough not to strobe). Clip in/out markers are static `w-0.5 bg-sky-400`. Two colors
because they answer two different questions — *where am I* vs *where does the clip start*.

**Clip states.** Idle `bg-sky-500/70` → hover `bg-sky-400` → dragging `bg-sky-400`. Hover and
dragging are currently the same value: on a touch device there is no hover, so the dragging
state reads as "the handle lit up". List rows: hovered is a background shift, **selected has no
treatment at all** (the list has no selection model), and **dragging** is `opacity: 0.5` plus
`ring-1 ring-amber-400 z-10` — the ring is the drop-source indicator, and amber is used here
precisely because it is *not* sky or pink and cannot be confused with clip geometry.

**Drag feedback.** Reordering is optimistic: the new order applies immediately, and reverts to
the previous array if `onReorder` resolves `{ok:false}` or throws. The header shows
`Loader2 animate-spin` + "Saving…" for the duration. There is no drop-placeholder and no
between-rows insertion line — `verticalListSortingStrategy` translates the neighbours instead.

**Thumbnails letterbox in the player, smartcrop in the strip.** The player sets
`--media-object-fit: contain` at a fixed `aspect-ratio: 16/9` — footage is **never** cropped
during editing, because a cropped preview lies about the render. Every *thumbnail*, by
contrast, is `object-cover` at a 16:9 box (`aspect-video` on ReelCard, `h-12 w-20 sm:h-14
sm:w-24` on rows, `h-8 w-12` in the strip) and requests Mux with `fit_mode=smartcrop`. Rule:
**contain where the user is judging frames, cover where they are only recognizing a clip.**

**Processing and disabled.** `disabled:opacity-50` is the base; in-flight row actions dim to
`opacity-60` (pinning) or `opacity-50` (removing) *and* swap their icon for
`Loader2 animate-spin`. A render in progress is an amber `Rendering` pill with a spinning
`Loader`; a finished render is an emerald `Ready` pill. Buttons are never hidden while busy —
they dim in place so the row does not reflow.

**Time codes are always mono.** Every numeric that changes — trim in/out (`m:ss.cc`), the
transport readout (`mm:ss.mmm`), the game score, and stat labels — carries `font-mono`. The
transport readout also reserves `min-w-[110px]` so the controls to its right never jitter as
digits change. Monospace gives tabular figures for free; **if this ever moves to a
proportional font, `tabular-nums` becomes mandatory** and the reserved width is not a
substitute.

## Player chrome is not debt

`bg-black/40`, `bg-black/50`, `bg-black/70`, `bg-white/60`, `text-white`, and `fill-white`
appear 14 times, all of them on controls that sit **over arbitrary user footage**. A theme
color cannot guarantee contrast against a frame that might be a floodlit stadium or a night
game; a hard scrim plus pure white can. These are correct and are **explicitly excluded from
every gate below**. Do not "tokenize" them, and do not file them as violations.

## Layout

Spacing is Tailwind's default 4px scale, used narrowly: card padding `p-3` / `p-4` / `p-6`,
row padding `px-3 py-2.5 sm:px-4 sm:py-3`, control padding `px-3 py-1.5`, pill padding
`px-1.5 py-0.5`, gaps `gap-1` (control clusters) / `gap-2` (rows) / `gap-3` (media + text).
Vertical rhythm inside a card is `mt-0.5` (label→value), `mt-1.5` (block→block), `mt-2.5`
(media→info). `TipsPage` is the only component with a container: `mx-auto max-w-4xl`.

The whitespace rule: **the toolkit is dense on purpose.** These components are secondary
chrome around a video, so tighten before you loosen. If a row feels cramped, cut content, do
not add padding.

## Responsive behavior

| Step | Width | Behavior |
|---|---|---|
| base | < 640px | Trim handles 24px. Clip strip collapses to 3px slivers, tap to expand. Reorder + copy-link buttons **always visible**. Card actions **stack** below the title. Row padding tightens. |
| `sm:` | ≥ 640px | Handles 12px. Strip shows full thumbnails. Hover-only affordances (`sm:opacity-0 sm:group-hover:opacity-100`). Actions go inline. Stat grid 2→3 columns. |

There are no other breakpoints. Two rules that must not regress: **hover-reveal is desktop-only**
(a `sm:`-gated `opacity-0` — an ungated one hides the button forever on touch), and
**actions stack on mobile** — `ContinueEditingCard` carries a comment recording that inline
buttons at 375px truncated titles to `Jonathan Perry'…`.

---

## Token source of truth

| | |
|---|---|
| **Authoritative file** | None. The tokens are stock Tailwind v4 palette names embedded as utility class strings in `src/**/*.tsx`. Verified absent: any `*.css`, `tailwind.config.*`, `postcss.config.*`, `components.json`, `tokens.*`, `theme.ts`, `colors.ts`, and any CSS-in-JS dependency. |
| **This file's role** | Derived. Regenerate with `/vzt-ui extract` after changing any class string. |
| **Shipped artifact** | `dist/**/*.js` — **committed to the repo** and the thing consumers' Tailwind actually scans. `src/` is the source you edit; `dist/` is the source that *styles production*. Gate 2 proves they agree. |
| **Consumers** | `nextplay` (8 files), `FlagPlay/apps/web` (3 files). `nextplay-mobile/src/theme/reel-type.ts` and `flagplay-mobile/src/theme/reel-type.ts` re-derive the reel-type vocabulary for React Native — **DERIVED, and not covered by any gate here.** |
| **Publish path** | Tag push → `notify-consumers.yml` auto-PRs **and auto-merges** both consumers → Vercel deploys. ~3 min end to end. A class edited here is in production without human review. |

## Compliance

Runnable verbatim from the repo root. Every baseline below was produced by running the
command, and **every gate was falsified** against a copy with `bg-brand-500 text-accent-200`
injected into `player-mode-tabs.tsx` — a gate that returns the same number for the real tree
and the broken one is measuring nothing.

```bash
#!/usr/bin/env bash
# Gate 1 — NON-STOCK COLOR FAMILY.  This is the primary gate for this repo.
# A class like `bg-brand-500` compiles to NOTHING in a consumer whose theme
# lacks that family, so the component silently renders unstyled. The stock-only
# rule is the library's stated contract (src/editor/reel-type-meta.ts:8-11).
STOCK='slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
N=$(find src -name '*.tsx' | wc -l | tr -d ' ')
[ "$N" -ge 10 ] || { echo "FAIL: only $N .tsx scanned — wrong path"; exit 1; }   # zero-subject guard
grep -rInoE "\b(bg|text|border|ring|from|to|via|divide|accent|fill|outline|shadow)-[a-z]{3,}-[0-9]{2,3}\b" \
  src --include='*.tsx' --include='*.ts' \
  | grep -vE ":[0-9]+:(bg|text|border|ring|from|to|via|divide|accent|fill|outline|shadow)-($STOCK)-[0-9]{2,3}$" \
  | wc -l
# BASELINE: 0   (files scanned: 12)  ← this one is a HARD ZERO, not a ratchet.
# FALSIFIED: injecting `bg-brand-500 text-accent-200` returns 2. Bogus path trips
#            the zero-subject guard instead of silently passing.

# Gate 2 — src ↔ dist PALETTE PARITY. dist/ is committed and is what consumers
# scan; editing src without `npm run build` ships the OLD styling to production.
PAL='\b(bg|text|border|ring|from|to|via|divide|accent|fill|outline|shadow)-[a-z]{3,}-[0-9]{2,3}\b'
printf '%s\n' "$(find src -name '*.tsx' | sort)" | while read -r f; do   # NOT `for x in $LIST` — zsh does not word-split
  [ -n "$f" ] || continue
  rel="${f#src/}"; js="dist/${rel%.tsx}.js"
  s=$(grep -ohE "$PAL" "$f"  2>/dev/null | sort -u | md5)
  d=$(grep -ohE "$PAL" "$js" 2>/dev/null | sort -u | md5)
  [ "$s" = "$d" ] || echo "DRIFT: $rel"
done
# BASELINE: 0 DRIFT lines across 12 components.
# FALSIFIED: editing src without rebuilding dist prints `DRIFT: editor/player-mode-tabs.tsx`.

# Gate 3 — CONSUMER @source COVERAGE. The highest-value gate for a library:
# Tailwind v4 does not scan node_modules, so a consumer without the @source
# line gets ZERO CSS for these classes. Skips cleanly if a sibling is absent.
PAL2='\b(bg|text|border|ring|from|to|via|divide|accent|fill)-[a-z]{3,}-[0-9]{2,3}\b'
grep -rhoE "$PAL2" src --include='*.tsx' --include='*.ts' | sort -u > /tmp/rt_classes.txt
printf '%s\n' "../nextplay:src/app/globals.css" "../FlagPlay/apps/web:src/app/globals.css" \
| while IFS=: read -r app css; do
  [ -d "$app" ] || { echo "SKIP $app (absent)"; continue; }
  if grep -q 'reel-toolkit' "$app/$css" 2>/dev/null; then echo "OK   $app — @source present"; else
    grep -rhoE "$PAL2" "$app/src" --include='*.tsx' --include='*.ts' 2>/dev/null | sort -u > /tmp/app_classes.txt
    echo "FAIL $app — no @source; $(comm -23 /tmp/rt_classes.txt /tmp/app_classes.txt | grep -c .) toolkit classes compile to nothing"
  fi
done
# BASELINE (2026-07-30):
#   OK   ../FlagPlay/apps/web — @source present  (globals.css:6)
#   FAIL ../nextplay — no @source; 13 toolkit classes compile to nothing
# The gate VARIES across the two consumers, which is the proof it measures something.
```

**Gates deliberately NOT used, and why.** The protocol's standard raw-Tailwind-palette count
would score **204** here and is an *anti-gate on this repo*: every one of those 204 is the
library correctly honoring its stock-only contract, so ratcheting them punishes the right
behavior. The standard raw-hex gate returns **1**, and that match is `#134` — a GitHub issue
number inside a comment in `src/network-profile/index.ts:35`. Both are constants that cannot
distinguish good code from bad here. The black/white player chrome is excluded by design (see
above).

## Known gaps

1. **NextPlay renders these components with 13 of their 50 palette classes uncompiled — live,
   today.** NextPlay imports the toolkit in 8 files (`PlayerModeTabs`, `CutLengthTabs`,
   `ReorderableClipList`, `ReelCardClipStrip`, `CopyLinkButton`, `ContinueEditingCard`, the
   tips surfaces) but `nextplay/src/app/globals.css` has only `@import "tailwindcss"` — no
   `@source` for the toolkit's `dist/`. Confirmed empirically against NextPlay's built CSS
   (`.next/static/chunks/*.css`): a control class NextPlay uses itself (`.text-zinc-400`) is
   present, while `.text-zinc-100`, `.ring-amber-500`, `.divide-zinc-800`, `.bg-pink-600`,
   `.accent-pink-400` and `.to-zinc-900` are all **absent**. Visible consequences: toolkit
   card and row titles inherit their color instead of `zinc-100`; `ReorderableClipList` loses
   its row dividers; the `★ Hero` cut tab loses the amber ring the code comments call out as
   its whole point. `CROSS-POLLINATION.md:215` already records this as "NextPlay: TBD" — it
   was never done. **Fix is one line in NextPlay's `globals.css`, not a change in this repo.**
2. **No focus-visible treatment anywhere.** Zero occurrences of `focus:`, `focus-visible:`, or
   `ring-offset` across all 12 components — including the drag handle, the trim handles, and
   both tablists, which already carry `role="tab"` / `aria-selected` and a `KeyboardSensor`.
   The keyboard path exists and is invisible. There is no focus-ring token to apply; one has
   to be decided.
3. **The `selected` clip state does not exist.** The brief's selected-vs-hovered-vs-dragging
   triad is only two-thirds present: rows have hover and dragging, but no selection model and
   no selected styling. Anything needing multi-select or a current-clip highlight is
   undesigned — ask before inventing one.
4. **No interior slot API.** `className` reaches the outer wrapper only. A host cannot restyle
   a trim handle, a playhead, a pill, or a row without forking. `chipClassOverrides` is the
   single exception and the model to copy if this is ever extended.
5. **Three accent families, and pink is overloaded.** `bg-pink-500` is the playhead *and*
   `border-pink-500/30 bg-pink-500/15 text-pink-200` is the `SOCIAL_VERTICAL` chip. Sky
   appears only in `ClipTrimmer` and `EnhancedVideoPlayer`; amber owns everything else. This
   is documented as-is because it is what ships — but no rule says which accent a *new*
   component should take. Ask.
6. **No reduced-motion handling.** `animate-spin`, `scale-105`/`scale-110`, and dnd-kit
   transforms all run unconditionally; there is no `motion-reduce:` anywhere.
7. **`TipsPanel` and `TipsPage` bypass `cn()`.** They concatenate `className` with a raw
   template string, so a host class appends rather than replacing and loses utility conflicts
   to source order. Every other component uses `cn()`. Inconsistent override semantics.
8. **The two mobile mirrors are unchecked.** `nextplay-mobile/src/theme/reel-type.ts` and
   `flagplay-mobile/src/theme/reel-type.ts` re-implement the reel-type vocabulary for React
   Native. Nothing verifies they still agree with `src/editor/reel-type-meta.ts`. A parity
   check like the NextPlay↔mobile one belongs here but does not exist yet.
9. **No error, empty-search, or form styling.** `text-red-400` exists only as a *hover* color
   on the Remove button. There is no error surface, no destructive-confirm treatment, no
   validation styling, and no loading skeleton (in-flight states dim existing content instead).
   `GameContextCard` and `ContinueEditingCard` return `null` rather than render an empty
   state — that is deliberate, not a gap.
