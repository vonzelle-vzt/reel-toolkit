import * as React from 'react';
import { type ReelTypeMetaOptions } from './reel-type-meta.js';
import { type ReelCardClip } from './reel-card-clip-strip.js';
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
export declare function ReelCard({ reel, previewHref, editHref, linkComponent, deleteSlot, isReadOnly, labelOverrides, onCopySuccess, onCopyError, className, }: ReelCardProps): React.ReactElement;
/** Compute a human-readable relative-time string. Exported for app reuse so
 *  apps don't have to reinvent the same formatter. */
export declare function getRelativeTime(date: Date | string): string;
//# sourceMappingURL=reel-card.d.ts.map