/**
 * TipsPage — full shooting-tips guide. Renders the 4 rail tips as a "rules
 * that matter most" quick-start, then groups the remainder by category.
 *
 * Pure presentation; safe to render in a server component. Pass `ctaHref` +
 * `ctaLabel` to surface an action at the bottom (e.g. "Upload your first
 * game →").
 */
import * as React from 'react';
import type { LinkLikeComponent } from './TipsPanel.js';
export interface TipsPageProps {
    /** Page heading. Default "Tips for great game footage". */
    heading?: string;
    /** Eyebrow above the heading. Default "Shooting guide". */
    eyebrow?: string;
    /** Lede paragraph beneath the heading. */
    intro?: string;
    /** Footer CTA href. When omitted, no CTA renders. */
    ctaHref?: string;
    /** Footer CTA label. Default "Upload your first game →". */
    ctaLabel?: string;
    /** Link component for the CTA. Defaults to plain anchor. */
    linkComponent?: LinkLikeComponent;
    /** Extra classes appended to the outer wrapper. */
    className?: string;
}
export declare function TipsPage({ heading, eyebrow, intro, ctaHref, ctaLabel, linkComponent, className, }: TipsPageProps): React.ReactElement;
//# sourceMappingURL=TipsPage.d.ts.map