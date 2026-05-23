/**
 * Clip-logic versioning (originated in NextPlay v6.50).
 *
 * Single source of truth for the version of clip-selection + clip-window
 * logic a reel was created under. Stamped on every reel at creation; the
 * app's cron sweep compares each reel's stored value against
 * `CURRENT_CLIP_LOGIC_VERSION` and auto-re-tightens stale ones — skipping
 * user-reordered reels (those are user-curated, not stale).
 *
 * Bumping this constant in the toolkit + republishing triggers a mass
 * auto-tighten across BOTH apps the next time they install the bump.
 * Only bump when a change in clip-selection or clip-window logic is
 * significant enough that existing reels are worse off being left as-is.
 *
 * Changelog
 * ─────────
 * v1 — pre-NextPlay-v6.48
 *   - No dead-ball filter
 *   - clip-window identity-pass (no caps)
 *
 * v2 — NextPlay v6.48–v6.49 (current)
 *   - Dead-ball filter (referee/whistle/timeout/etc. dropped)
 *   - Middle-clip smart cap (eventEndTime + reel-type-specific budget,
 *     gated on tail > MIDDLE_CAP_TRIGGER_SECONDS)
 *   - Last-clip tail cap (eventEndTime + LAST_CLIP_TAIL_SECONDS)
 */
export declare const CURRENT_CLIP_LOGIC_VERSION = 2;
//# sourceMappingURL=index.d.ts.map