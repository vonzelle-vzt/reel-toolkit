/**
 * Enum-like string unions used across both NextPlay (HighlightReel) and
 * FlagPlay (Reel) data models. App-side Prisma enums map onto these.
 */
export type ReelType = 'SOCIAL_VERTICAL' | 'SOCIAL_HORIZONTAL' | 'RECRUITING' | 'FULL_GAME' | 'SEASON_RECAP' | 'CUSTOM';
export type AspectRatio = 'PORTRAIT' | 'LANDSCAPE';
export type ReelStatus = 'PENDING' | 'RENDERING' | 'READY' | 'PUBLISHED' | 'FAILED';
export type DownloadStatus = 'NONE' | 'RENDERING' | 'READY' | 'FAILED';
//# sourceMappingURL=enums.d.ts.map