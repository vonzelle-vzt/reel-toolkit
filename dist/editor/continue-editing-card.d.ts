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
 *
 * v1.7.0 — optional ACTIONS. The card used to be read-only: it told the user
 * something was broken and offered nowhere to go but the reel page. Consumers
 * can now pass `headerActions` (e.g. "Retry all") and `itemActions` (e.g.
 * "Retry" / "Dismiss"). Both are optional, so existing consumers are
 * unaffected. The card stays presentational — it owns no retry/dismiss logic,
 * it just renders the buttons the app hands it.
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
/**
 * A button the consumer wants rendered. The card never infers actions from
 * `reasonKind` — the app decides which rows get which buttons.
 */
export interface ContinueEditingAction {
    /** Stable key for the React list. */
    key: string;
    /** Visible label. Keep it short — these sit on a crowded row. */
    label: string;
    onClick: () => void;
    /** Renders a spinner and disables the button. */
    pending?: boolean;
    disabled?: boolean;
    /** `primary` = amber solid, `ghost` = quiet text button. Default `ghost`. */
    variant?: 'primary' | 'ghost';
    /** Optional leading icon (already sized by the consumer, ~12px). */
    icon?: React.ReactNode;
}
export interface ContinueEditingCardProps {
    items: ContinueEditingItem[];
    /** Section heading. Default "Needs your attention". */
    heading?: string;
    /** Link component (next/link or 'a'). Required. */
    linkComponent: LinkLikeComponent;
    /** Extra classes on the outer wrapper. */
    className?: string;
    /** Buttons in the card header, e.g. "Retry all" / "Clear all". */
    headerActions?: ContinueEditingAction[];
    /**
     * Per-row buttons. Called once per item so the consumer can vary the
     * buttons by row (only FAILED rows get "Retry", say). Return `[]` for none.
     */
    itemActions?: (item: ContinueEditingItem) => ContinueEditingAction[];
}
export declare function ContinueEditingCard({ items, heading, linkComponent, className, headerActions, itemActions, }: ContinueEditingCardProps): React.ReactElement | null;
//# sourceMappingURL=continue-editing-card.d.ts.map