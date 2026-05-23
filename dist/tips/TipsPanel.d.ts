/**
 * TipsPanel — compact rail of the top-priority shooting tips.
 *
 * Intended for the dashboard left rail or the upload page sidebar. Always
 * visible; not dismissable (the tips matter forever, unlike onboarding).
 *
 * Defaults to a zinc + brand-accent palette. Apps override the wrapper
 * styling via `className` and can swap the link component via `linkComponent`
 * (pass `Link` from next/link, or `'a'` for plain HTML).
 */
import * as React from 'react';
export type LinkLikeProps = {
    href: string;
    className?: string;
    children: React.ReactNode;
};
export type LinkLikeComponent = React.ComponentType<LinkLikeProps> | 'a';
export interface TipsPanelProps {
    /** Number of tips to surface on the rail. Default 4. */
    limit?: number;
    /** Path the "Full guide" link points at. Default '/tips'. */
    fullGuideHref?: string;
    /** Optional override for the section heading. Default "Shooting tips". */
    heading?: string;
    /** Link component to use (next/link recommended). Defaults to plain anchor. */
    linkComponent?: LinkLikeComponent;
    /** Extra classes appended to the wrapper. */
    className?: string;
}
export declare function TipsPanel({ limit, fullGuideHref, heading, linkComponent, className, }: TipsPanelProps): React.ReactElement;
//# sourceMappingURL=TipsPanel.d.ts.map