export interface ClipTrimmerProps {
    startTime: number;
    endTime: number;
    duration: number;
    onChange: (start: number, end: number) => void;
    /**
     * Fires while the user drags a handle so the parent can seek the video
     * player live (pair with `EnhancedVideoPlayer.seekTo`). Throttled
     * internally to ~60ms — once per frame is enough for a video scrub.
     * Always fires once more on `pointerUp` with the released value so the
     * final frame is exact even if the throttle dropped the last move.
     */
    onSeek?: (time: number, edge: 'start' | 'end') => void;
    className?: string;
}
export declare function ClipTrimmer({ startTime, endTime, duration, onChange, onSeek, className, }: ClipTrimmerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=clip-trimmer.d.ts.map