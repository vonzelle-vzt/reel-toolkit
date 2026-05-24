import * as React from 'react';
export type CutLength = 'full' | 'hero' | 15 | 60 | 90;
export interface CutLengthTabsProps {
    cut: CutLength;
    onChange: (next: CutLength) => void;
    /** Which cuts to render. Default: all five. */
    cuts?: ReadonlyArray<CutLength>;
    /**
     * When provided + cut !== 'full', renders a "Xs · N clips" caption to the
     * right of the tab strip. Pass { visible: N, total: M } to get "N of M".
     */
    clipCounts?: {
        visible: number;
        total: number;
    };
    /** Extra classes on the outer wrapper. */
    className?: string;
}
export declare function CutLengthTabs({ cut, onChange, cuts, clipCounts, className, }: CutLengthTabsProps): React.ReactElement;
//# sourceMappingURL=cut-length-tabs.d.ts.map