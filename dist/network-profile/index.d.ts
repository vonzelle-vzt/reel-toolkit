/**
 * Network profile for video uploads.
 *
 * Picks chunk-size bounds + concurrency based on the user's connection.
 * Reads `navigator.connection.effectiveType` (Network Information API;
 * Chrome / Edge / Android, missing on Safari). Falls back to UA sniffing
 * for iOS / Android when the API is missing.
 *
 * Chunk sizes are in KB (the unit @mux/upchunk expects). Min/max bounds
 * drive UpChunk's `dynamicChunkSize` adaptive sizer.
 */
export type NetworkProfile = {
    chunkSizeKB: number;
    minChunkSizeKB: number;
    maxChunkSizeKB: number;
    concurrency: number;
    isMobile: boolean;
    isCellular: boolean;
    isIOSSafari: boolean;
    effectiveType: string;
};
/**
 * iOS Safari detector (including iPadOS Safari masquerading as desktop).
 * Used to gate the `useLargeFileWorkaround` flag — WebKit has a streams
 * bug that breaks multi-GB uploads on iOS Safari (upchunk #134, webkit
 * bug 272600).
 */
export declare function isIOSSafari(): boolean;
/**
 * Threshold at or above which the iOS Safari WebKit streams workaround
 * fires. Lowered from 1.5 GB → 1 GB (NextPlay 2026-05-17) because the
 * WebKit streams bug starts manifesting on real devices below the 1.5 GB
 * watermark — uploads in the 1.0–1.5 GB range were silently failing.
 * The workaround has no downside for non-affected files.
 */
export declare const IOS_LARGE_FILE_THRESHOLD: number;
export declare function shouldUseLargeFileWorkaround(fileSize: number): boolean;
export declare function getNetworkProfile(): NetworkProfile;
//# sourceMappingURL=index.d.ts.map