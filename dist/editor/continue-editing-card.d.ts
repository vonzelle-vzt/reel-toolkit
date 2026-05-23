/**
 * ContinueEditingCard — surfaces reels still needing the user's attention.
 *
 * Schema-agnostic: the app pre-computes WHY each reel is in the list
 * (failed download, re-render queued, etc.) and passes a flat
 * `ContinueEditingItem[]` of already-formatted display data. The toolkit
 * just renders + provides recognizable icons per `reasonKind`.
 *
 * Hides entirely when items is empty — no "you're all caught up" card.
 * That's intentional: an attention-grabbing card with nothing useful in
 * it would erode trust in the surface.
 */
import * as React from 'react';
import type { LinkLikeComponent } from '../tips/TipsPanel.js';
export type ContinueEditingReasonKind = 'failed' | 'reordering' | 'pending' | 'custom';
export interface ContinueEditingItem {
    /** Stable id for the React key. */
    id: string;
    /** Where the row click navigates. */
    href: string;
    /** Already-cleaned title (sport stripped, type-suffix stripped). */
    displayTitle: string;
    /** Pre-computed Mux thumbnail URL, or null to render the placeholder slot. */
    thumbnailSrc: string | null;
    /** One-line message ("Download failed — tap to retry", etc.). */
    reasonText: string;
    /** Maps to the icon next to the message. */
    reasonKind: ContinueEditingReasonKind;
}
export interface ContinueEditingCardProps {
    items: ContinueEditingItem[];
    /** Section heading. Default "Needs your attention". */
    heading?: string;
    /** Link component (next/link or 'a'). Required. */
    linkComponent: LinkLikeComponent;
    /** Extra classes on the outer wrapper. */
    className?: string;
}
export declare function ContinueEditingCard({ items, heading, linkComponent, className, }: ContinueEditingCardProps): React.ReactElement | null;
//# sourceMappingURL=continue-editing-card.d.ts.map