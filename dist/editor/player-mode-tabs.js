/**
 * PlayerModeTabs — 3-tab segmented control for switching between the reel's
 * playback modes: Clips (raw MuxPlayer clip-by-clip), Highlight (cinematic
 * Remotion-produced version), Movie (NFL Films-style cinematic letterbox).
 *
 * Pure presentation primitive — schema-agnostic. The consumer owns:
 *   - which modes are available (some reels don't have a produced Movie
 *     render yet — pass a smaller `modes` array to hide it)
 *   - the active mode state
 *   - what happens on change
 *
 * The internal mode keys (`clips` / `produced` / `movie`) are LOAD-BEARING
 * for NextPlay's share-link `?view=…` query param (introduced v5.6) and the
 * public reel viewer's mode detection. Don't rename them without updating
 * `apps/web/src/app/(public)/reel/[token]/reel-viewer.tsx` in NextPlay AND
 * `apps/web/src/app/reel/[token]/page.tsx` in FlagPlay.
 *
 * Label vocabulary: NextPlay v6.34 dropped "Social" / "Produced" in favor of
 * "Highlight" for the produced mode. The toolkit defaults match.
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from './cn.js';
const DEFAULT_LABELS = {
    clips: 'Clips',
    produced: 'Highlight',
    movie: 'Movie',
};
const DEFAULT_MODES = ['clips', 'produced', 'movie'];
export function PlayerModeTabs({ mode, onChange, modes = DEFAULT_MODES, labelOverrides, className, }) {
    return (_jsx("div", { className: cn('flex gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1 w-fit', className), role: "tablist", "aria-label": "Reel playback mode", children: modes.map((m) => (_jsx("button", { type: "button", role: "tab", "aria-selected": mode === m, onClick: () => onChange(m), className: cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', mode === m
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-500 hover:text-zinc-300'), children: labelOverrides?.[m] ?? DEFAULT_LABELS[m] }, m))) }));
}
//# sourceMappingURL=player-mode-tabs.js.map