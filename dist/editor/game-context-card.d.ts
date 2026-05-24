import * as React from 'react';
export interface GameContextAnalysis {
    pipeline?: string;
    strategy?: string;
    totalDuration?: number;
    chunksProcessed?: number;
    framesExtracted?: number;
    framesAfterFiltering?: number;
    scenesClassified?: number;
    livePlayPercent?: number;
    pass1Candidates?: number;
    pass2Confirmed?: number;
    processingTimeMs?: number;
    transcriptLength?: number;
    scoreboardReads?: number;
}
export interface GameContextCardProps {
    opponent?: string | null;
    gameDate?: string | Date | null;
    gameScore?: string | null;
    sport?: string | null;
    duration?: number | null;
    analysisData?: GameContextAnalysis | null;
    /** Extra classes on the wrapper. */
    className?: string;
}
export declare function GameContextCard({ opponent, gameDate, gameScore, sport, duration, analysisData, className, }: GameContextCardProps): React.ReactElement | null;
//# sourceMappingURL=game-context-card.d.ts.map