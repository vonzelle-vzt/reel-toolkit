/**
 * ReelCard — schema-agnostic visual card for a single reel.
 *
 * Renders the rich NextPlay-style card UI: thumbnail with fallback chain,
 * reel-type chip, metadata pills (clip count, runtime, custom-order, ready/
 * rendering), inline clip-thumbnail strip, copy-link button, reorder
 * shortcut, and an optional delete-button slot.
 *
 * The app owns:
 *   - Routing (pass `previewHref` + optional `editHref`).
 *   - The link component (pass `linkComponent` — next/link or 'a').
 *   - The delete affordance (pass `deleteSlot` — usually a server-action-
 *     backed button the app owns).
 *   - Optional toast wiring for the copy-link button (pass `onCopySuccess`
 *     / `onCopyError`).
 *
 * The toolkit owns: thumbnail chain, chip styling, metadata pills, layout.
 *
 * Per [[no-fake-recruiting-data]]: never falls back to the source video's
 * playbackId for the reel thumbnail. The fallback chain is:
 *   1. props.thumbnailUrl (explicit cover)
 *   2. props.muxPlaybackId  (rendered reel asset)
 *   3. props.heroClipPlaybackId at heroClipPeakTime (first clip's frame)
 *   4. Film-icon placeholder
 */
'use client';

import * as React from 'react';
import {
  Download,
  Film,
  GripVertical,
  Layers,
  Loader,
  Play,
} from 'lucide-react';
import { cn } from './cn.js';
import { reelTypeMeta, type ReelTypeMetaOptions } from './reel-type-meta.js';
import {
  ReelCardClipStrip,
  type ReelCardClip,
} from './reel-card-clip-strip.js';
import { CopyLinkButton } from './copy-link-button.js';
import type { LinkLikeComponent } from '../tips/TipsPanel.js';

export interface ReelCardData {
  id: string;
  /** Already-cleaned title to display. App is responsible for stripping
   *  sport names / reel-type substrings before passing in. */
  displayTitle: string;
  reelType: string | null;
  /** Used by the chip + thumbnail chain. */
  thumbnailUrl?: string | null;
  /** Rendered reel asset Mux id (not the source video). */
  muxPlaybackId?: string | null;
  /** First clip's Mux playback id for the hero-frame fallback. */
  heroClipPlaybackId?: string | null;
  /** First clip's peak time in seconds. */
  heroClipPeakTime?: number;
  downloadStatus?: 'NONE' | 'RENDERING' | 'READY' | 'FAILED' | null;
  downloadPlaybackId?: string | null;
  userReorderedAt?: Date | string | null;
  /** Used by the CopyLinkButton; if null/undefined the button hides. */
  shareToken?: string | null;
  /** Length of the underlying sourceVideoIds array. */
  sourceVideoCount?: number;
  /** Total clip count from the reel's ReelClip rows (or equivalent). */
  clipCount?: number;
  /** Total runtime in seconds. */
  totalSeconds?: number;
  /** Top-N clips for the inline thumbnail strip. */
  topClips?: ReelCardClip[];
  /** Relative-time string like "3 hr ago". Pre-computed by the app. */
  relativeTime?: string;
}

export interface ReelCardProps {
  reel: ReelCardData;
  /** Where the card itself links to (the reel preview page). */
  previewHref: string;
  /** Optional reorder-shortcut link. Hidden when undefined. */
  editHref?: string;
  /** Required Link component. Pass next/link's default export, or 'a'. */
  linkComponent: LinkLikeComponent;
  /** Slot for an app-owned delete button (renders absolute top-right). */
  deleteSlot?: React.ReactNode;
  /** Suppress the reorder + delete affordances (admin-view mode). */
  isReadOnly?: boolean;
  /** Optional label overrides for the reel-type chip. */
  labelOverrides?: ReelTypeMetaOptions['labelOverrides'];
  /** Fires after a successful share-link copy. Wire to your toast lib. */
  onCopySuccess?: (url: string) => void;
  /** Fires when the clipboard write throws (Safari permissions, etc.). */
  onCopyError?: (error: unknown) => void;
  /** Extra classes on the outer card. */
  className?: string;
}

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

export function ReelCard({
  reel,
  previewHref,
  editHref,
  linkComponent,
  deleteSlot,
  isReadOnly = false,
  labelOverrides,
  onCopySuccess,
  onCopyError,
  className,
}: ReelCardProps): React.ReactElement {
  const LinkComponent = linkComponent;
  const meta = reelTypeMeta(reel.reelType, { labelOverrides });
  const ChipIcon = meta.icon;

  const heroClip = reel.topClips?.[0];
  const thumbnailSrc = reel.thumbnailUrl
    ? reel.thumbnailUrl
    : reel.muxPlaybackId
      ? `https://image.mux.com/${reel.muxPlaybackId}/thumbnail.jpg?width=400&height=225&time=2`
      : (reel.heroClipPlaybackId ?? heroClip?.playbackId)
        ? `https://image.mux.com/${
            reel.heroClipPlaybackId ?? heroClip!.playbackId!
          }/thumbnail.jpg?width=400&height=225&time=${Math.max(
            0,
            Math.round(reel.heroClipPeakTime ?? heroClip?.peakTime ?? 0),
          )}`
        : null;

  const clipCount = reel.clipCount ?? 0;
  const totalSeconds = reel.totalSeconds ?? 0;
  const sourceVideoCount = reel.sourceVideoCount ?? 0;

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition-all hover:border-amber-400/30',
        className,
      )}
    >
      <LinkComponent href={previewHref} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
          {thumbnailSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="h-8 w-8 text-zinc-700" />
            </div>
          )}
          {/* Reel-type chip */}
          <span
            className={cn(
              'absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm',
              meta.chipClass,
            )}
          >
            <ChipIcon className="h-3 w-3" /> {meta.label}
          </span>
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform group-hover:scale-110">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-2.5">
          <p className="text-sm font-medium text-zinc-100 truncate">
            {reel.displayTitle}
          </p>

          {/* Metadata pills */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {sourceVideoCount > 1 && (
              <span className="flex items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
                <Layers className="h-2.5 w-2.5" /> {sourceVideoCount} games combined
              </span>
            )}
            {clipCount > 0 && (
              <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                {clipCount} clips
              </span>
            )}
            {totalSeconds > 0 && (
              <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                {formatDuration(totalSeconds)}
              </span>
            )}
            {reel.downloadStatus === 'READY' && reel.downloadPlaybackId && (
              <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">
                <Download className="h-2.5 w-2.5" /> Ready
              </span>
            )}
            {reel.downloadStatus === 'RENDERING' && (
              <span className="flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
                <Loader className="h-2.5 w-2.5 animate-spin" /> Rendering
              </span>
            )}
            {reel.userReorderedAt && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
                Custom order
              </span>
            )}
          </div>

          {/* Inline thumbnail strip */}
          {reel.topClips && reel.topClips.length > 0 && (
            <div className="mt-1.5">
              <ReelCardClipStrip
                clips={reel.topClips}
                totalClipCount={clipCount}
              />
            </div>
          )}

          {reel.relativeTime && (
            <div className="mt-1.5 flex items-center justify-end">
              <span className="text-[10px] text-zinc-500">
                {reel.relativeTime}
              </span>
            </div>
          )}
        </div>
      </LinkComponent>

      {/* Reorder shortcut — only when there's >1 clip + we're not read-only. */}
      {editHref && clipCount > 1 && !isReadOnly && (
        <LinkComponent
          href={editHref}
          className="absolute right-12 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur-sm transition-all hover:bg-black/70 sm:right-10 sm:top-5 sm:h-6 sm:w-6 sm:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <GripVertical className="h-3 w-3" />
        </LinkComponent>
      )}

      {/* App-owned delete button slot. */}
      {!isReadOnly && deleteSlot}

      <CopyLinkButton
        shareToken={reel.shareToken}
        onSuccess={onCopySuccess}
        onError={onCopyError}
      />
    </div>
  );
}

/** Compute a human-readable relative-time string. Exported for app reuse so
 *  apps don't have to reinvent the same formatter. */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
}
