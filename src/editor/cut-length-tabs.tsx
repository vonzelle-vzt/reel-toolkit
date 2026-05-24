/**
 * CutLengthTabs — 5-tab segmented control for picking the reel's cut length:
 * Full (uncut), Hero (★ single best play), 15s / 60s / 90s (timed cuts).
 *
 * Pure presentation primitive — schema-agnostic. The consumer owns:
 *   - active cut state
 *   - what happens on change (typically updates a `cutLength` state that the
 *     player + share-URL logic both read)
 *   - the optional "X of Y clips" caption shown when a timed cut is active
 *
 * Hero is visually distinct (amber ring) because it's the single highest-
 * impact play — the recruiting-coach-watches-on-mute hook frame. The other
 * timed cuts are flat segmented buttons.
 *
 * NextPlay v5.6 share-link contract: `?cut=15|60|90` appended to the share
 * URL when a non-Full cut is active. The toolkit's tab keys (15 | 60 | 90)
 * match the share-URL keys; consumers wire the URL append themselves.
 */
'use client';

import * as React from 'react';
import { cn } from './cn.js';

export type CutLength = 'full' | 'hero' | 15 | 60 | 90;

export interface CutLengthTabsProps {
  cut: CutLength;
  onChange: (next: CutLength) => void;
  /** Which cuts to render. Default: all five. */
  cuts?: ReadonlyArray<CutLength>;
  /**
   * When provided + cut !== 'full', renders a "Xs · N clips" caption to the
   * right of the tab strip. Pass { visible: N, total: M } to get "N of M".
   */
  clipCounts?: { visible: number; total: number };
  /** Extra classes on the outer wrapper. */
  className?: string;
}

const DEFAULT_CUTS: ReadonlyArray<CutLength> = ['full', 'hero', 15, 60, 90];

function cutLabel(c: CutLength): string {
  if (c === 'full') return 'Full reel';
  if (c === 'hero') return 'Hero play';
  return `${c}s cut`;
}

function cutDisplayText(c: CutLength): string {
  if (c === 'full') return 'Full';
  if (c === 'hero') return '★ Hero';
  return `${c}s`;
}

export function CutLengthTabs({
  cut,
  onChange,
  cuts = DEFAULT_CUTS,
  clipCounts,
  className,
}: CutLengthTabsProps): React.ReactElement {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div
        className="flex gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1 w-fit"
        role="tablist"
        aria-label="Reel cut length"
      >
        {cuts.map((c) => (
          <button
            key={String(c)}
            type="button"
            role="tab"
            aria-selected={cut === c}
            onClick={() => onChange(c)}
            title={cutLabel(c)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              cut === c
                ? c === 'hero'
                  ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                  : 'bg-zinc-800 text-amber-400'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            {cutDisplayText(c)}
          </button>
        ))}
      </div>
      {cut !== 'full' && clipCounts && (
        <span className="text-xs text-zinc-500">
          {cutLabel(cut)} · {clipCounts.visible}{' '}
          {clipCounts.visible === 1
            ? 'clip'
            : `of ${clipCounts.total} clips`}
        </span>
      )}
    </div>
  );
}
