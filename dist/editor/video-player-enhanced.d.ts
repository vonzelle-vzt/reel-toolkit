export interface EnhancedVideoPlayerProps {
    playbackId: string;
    startTime?: number;
    endTime?: number;
    className?: string;
    onTimeUpdate?: (time: number) => void;
}
/**
 * Imperative handle so editor widgets (ClipTrimmer, etc.) can drive
 * playback without round-tripping through React state. `seekTo` pauses
 * by default — a dragging user doesn't want playback fighting their
 * frame-picking.
 */
export interface EnhancedVideoPlayerHandle {
    seekTo: (time: number, opts?: {
        pause?: boolean;
    }) => void;
    pause: () => void;
    play: () => void;
}
export declare const EnhancedVideoPlayer: import("react").ForwardRefExoticComponent<EnhancedVideoPlayerProps & import("react").RefAttributes<EnhancedVideoPlayerHandle>>;
//# sourceMappingURL=video-player-enhanced.d.ts.map