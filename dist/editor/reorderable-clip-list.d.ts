import * as React from 'react';
export interface ReorderableClip {
    /** The row whose `position` we move (ReelClip.id in NextPlay). */
    reelClipId: string;
    /** Underlying Clip / ClipCandidate id (used by pin / remove callbacks). */
    clipId: string;
    /** Optional source DetectedEvent id (for remove logic that needs it). */
    eventId?: string | null;
    startTime: number;
    endTime: number;
    peakTime: number;
    eventType?: string | null;
    description?: string | null;
    compositeScore?: number | null;
    isHeroPlay?: boolean;
    /** Mux playback id for the thumbnail; null hides the thumbnail. */
    playbackId?: string | null;
}
export interface ReorderableClipListProps {
    clips: ReorderableClip[];
    /**
     * Persist the new order. Return `{ok: true}` to keep the optimistic
     * update; return `{ok: false, error?}` (or throw) to revert + surface
     * the error. The toolkit calls this with the new reelClipId order.
     */
    onReorder: (orderedReelClipIds: string[]) => Promise<{
        ok: boolean;
        error?: string;
    }>;
    /** Optional Pin Hero action. Button hides when not provided. */
    onPinHero?: (clipId: string, alreadyHero: boolean) => Promise<void> | void;
    /** Optional Remove action. Button hides when not provided. */
    onRemove?: (clipId: string, eventId: string | null) => Promise<void> | void;
    /** Consumer-driven loading state for the Pin button (one row at a time). */
    pinningClipId?: string | null;
    /** Consumer-driven loading state for the Remove button. */
    removingClipId?: string | null;
    /** Fires after a successful reorder. Wire to your toast library. */
    onSaveSuccess?: () => void;
    /** Fires after a failed reorder. Receives the error message. */
    onSaveError?: (error: string) => void;
    /** Section heading. Default "Reorder clips". */
    heading?: string;
    /** Sub-heading. Default mentions auto re-render. */
    subheading?: string;
    /** Extra classes on the wrapper. */
    className?: string;
}
export declare function ReorderableClipList({ clips, onReorder, onPinHero, onRemove, pinningClipId, removingClipId, onSaveSuccess, onSaveError, heading, subheading, className, }: ReorderableClipListProps): React.ReactElement;
//# sourceMappingURL=reorderable-clip-list.d.ts.map