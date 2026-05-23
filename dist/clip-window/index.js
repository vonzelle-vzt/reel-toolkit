/**
 * Clip playable window — last-clip tail cap + middle-clip smart cap.
 *
 * History (NextPlay):
 *   v6.40 baseline: full AI window. User: "stuck at the end" (dead tail).
 *   v6.41: peakTime ± per-reel-type caps. Cut touchdown mid-air —
 *          peakTime is unreliable (snap, not score).
 *   v6.42: eventEndTime ± per-reel-type caps. Still too tight, lost
 *          play context (run-up + follow-through).
 *   v6.43: REVERTED to identity pass — clips play their full AI window.
 *   v6.44: identity pass for MIDDLE clips; cap ONLY the last clip at
 *          eventEndTime + LAST_CLIP_TAIL_SECONDS.
 *   v6.48: middle clips ALSO cap, but only when (a) eventEndTime is set
 *          AND (b) the post-event tail is > MIDDLE_CAP_TRIGGER_SECONDS
 *          — i.e. obvious dead air. Tail budget per reel type.
 *
 * Hard rule: do NOT lower MIDDLE_CAP_TRIGGER_SECONDS below 3 — that
 * re-enters v6.41/v6.42 territory where middle plays got cut mid-action.
 */
const LAST_CLIP_TAIL_SECONDS = 3;
const MIDDLE_CAP_TRIGGER_SECONDS = 3;
/**
 * Per-reel-type tail budget for middle clips when the smart-cap trigger
 * fires. RECRUITING / SEASON_RECAP get 2s of celebration (player landing
 * + half-beat reaction). SOCIAL gets 1.5s for TikTok-tight rhythm.
 * FULL_GAME / CUSTOM keep the 5s context window for film study.
 *
 * Hard rule: never go below 1.5s — that re-enters mid-play-cut territory
 * for plays with mislabeled eventEndTime.
 */
const MIDDLE_TAIL_BY_REEL_TYPE = {
    SOCIAL_VERTICAL: 1.5,
    SOCIAL_HORIZONTAL: 1.5,
    RECRUITING: 2.0,
    SEASON_RECAP: 2.0,
    FULL_GAME: 5.0,
    CUSTOM: 5.0,
};
const DEFAULT_MIDDLE_TAIL = 2.0;
export function getClipPlayableWindow(clip, reelType, isLastClip = false) {
    const startTime = clip.startTime;
    let endTime = clip.endTime;
    const hasEventEnd = typeof clip.eventEndTime === 'number' &&
        clip.eventEndTime > startTime &&
        clip.eventEndTime <= endTime;
    if (isLastClip && hasEventEnd) {
        endTime = Math.min(endTime, clip.eventEndTime + LAST_CLIP_TAIL_SECONDS);
    }
    else if (!isLastClip && hasEventEnd) {
        const tail = clip.endTime - clip.eventEndTime;
        if (tail > MIDDLE_CAP_TRIGGER_SECONDS) {
            const budget = reelType
                ? (MIDDLE_TAIL_BY_REEL_TYPE[reelType] ?? DEFAULT_MIDDLE_TAIL)
                : DEFAULT_MIDDLE_TAIL;
            endTime = Math.min(endTime, clip.eventEndTime + budget);
        }
    }
    return {
        startTime,
        endTime,
        duration: Math.max(0, endTime - startTime),
    };
}
//# sourceMappingURL=index.js.map