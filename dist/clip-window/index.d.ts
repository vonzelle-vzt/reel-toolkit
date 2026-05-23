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
export interface ClipPlayableWindow {
    startTime: number;
    endTime: number;
    duration: number;
}
export interface ClipForWindow {
    startTime: number;
    endTime: number;
    peakTime?: number | null;
    eventEndTime?: number | null;
}
export declare function getClipPlayableWindow(clip: ClipForWindow, reelType: string | null | undefined, isLastClip?: boolean): ClipPlayableWindow;
//# sourceMappingURL=index.d.ts.map