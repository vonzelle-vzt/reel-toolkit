/**
 * Shapes the toolkit's helpers consume. Each consuming app maps its
 * own Prisma row types into these via a thin adapter (~50 LOC).
 *
 * Keep these minimal — add a field only when a toolkit helper actually
 * needs it. Optional fields are values a helper can degrade without.
 */

import type { AspectRatio, DownloadStatus, ReelStatus, ReelType } from './enums.js';

/**
 * A single play / clip the editor renders. Times are in SECONDS (not ms)
 * so they line up with HTMLMediaElement / Mux Player APIs out of the box.
 */
export interface ClipShape {
  /** Stable id; in NextPlay this is Clip.id, in FlagPlay it's ClipCandidate.id. */
  id: string;

  /** Mux playback id for the SOURCE video this clip plays from. */
  playbackId: string;

  /** Trim start in seconds. */
  startTime: number;

  /** Trim end in seconds. */
  endTime: number;

  /**
   * AI's detected play-end in seconds (DetectedEvent.endTime → Clip.eventEndTime).
   * Used by `getClipPlayableWindow` to cap the last clip's tail without
   * cutting plays mid-action. Null for legacy clips — helper degrades gracefully.
   */
  eventEndTime?: number | null;

  /** Highest-action moment in seconds (snap, contact, score). Optional. */
  peakTime?: number | null;

  /** AI's score for this clip. Higher = better. Optional. */
  highlightScore?: number | null;

  /** AI-labelled event type ("TACKLE", "BIG_PLAY", etc.). Optional. */
  eventType?: string | null;
}

/**
 * A reel — the container that holds an ordered list of clips and a few
 * render-pipeline flags. Toolkit helpers consume this when they need
 * to reason about the reel as a whole (e.g. last-clip detection, render
 * queue gating).
 */
export interface ReelShape {
  /** Stable id; in NextPlay this is HighlightReel.id, in FlagPlay it's Reel.id. */
  id: string;

  /** Drives clip-window caps + aspect logic. */
  reelType: ReelType;

  /** Drives composition aspect + objectFit defaults. */
  aspectRatio: AspectRatio;

  /** Lifecycle state (PUBLISHED is the auto-publish default per NextPlay v6.23). */
  status: ReelStatus;

  /** Status of the stitched downloadable MP4 (separate from preview asset). */
  downloadStatus?: DownloadStatus | null;

  /** Debounced re-render trigger — cron sweeps for `pendingRenderAt <= now()`. */
  pendingRenderAt?: Date | string | null;

  /** Set when the user dragged clips; signals cut logic to honor position over score. */
  userReorderedAt?: Date | string | null;

  /**
   * Clip-selection / clip-window logic version. Bumping
   * `CURRENT_CLIP_LOGIC_VERSION` (TBD in v1) triggers cron auto-tighten.
   * v1 = pre-v6.48, v2 = v6.48+ (dead-ball filter + smart cap + last-clip tail cap).
   */
  clipLogicVersion?: number;
}
