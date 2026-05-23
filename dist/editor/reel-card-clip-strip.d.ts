import * as React from 'react';
export interface ReelCardClip {
    playbackId: string | null;
    peakTime: number;
}
export interface ReelCardClipStripProps {
    clips: ReelCardClip[];
    totalClipCount: number;
    className?: string;
}
export declare function ReelCardClipStrip({ clips, totalClipCount, className, }: ReelCardClipStripProps): React.ReactElement | null;
//# sourceMappingURL=reel-card-clip-strip.d.ts.map