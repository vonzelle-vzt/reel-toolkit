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
/**
 * iOS Safari detector (including iPadOS Safari masquerading as desktop).
 * Used to gate the `useLargeFileWorkaround` flag — WebKit has a streams
 * bug that breaks multi-GB uploads on iOS Safari (upchunk #134, webkit
 * bug 272600).
 */
export function isIOSSafari() {
    if (typeof navigator === 'undefined')
        return false;
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
        (ua.includes('Mac') && typeof document !== 'undefined' && 'ontouchend' in document);
    const isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
    return isIOS && isSafari;
}
/**
 * Threshold at or above which the iOS Safari WebKit streams workaround
 * fires. Lowered from 1.5 GB → 1 GB (NextPlay 2026-05-17) because the
 * WebKit streams bug starts manifesting on real devices below the 1.5 GB
 * watermark — uploads in the 1.0–1.5 GB range were silently failing.
 * The workaround has no downside for non-affected files.
 */
export const IOS_LARGE_FILE_THRESHOLD = 1 * 1024 * 1024 * 1024;
export function shouldUseLargeFileWorkaround(fileSize) {
    return isIOSSafari() && fileSize >= IOS_LARGE_FILE_THRESHOLD;
}
export function getNetworkProfile() {
    if (typeof navigator === 'undefined') {
        return {
            chunkSizeKB: 30720,
            minChunkSizeKB: 10240,
            maxChunkSizeKB: 51200,
            concurrency: 3,
            isMobile: false,
            isCellular: false,
            isIOSSafari: false,
            effectiveType: 'unknown',
        };
    }
    const nav = navigator;
    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    const isIOS = isIOSSafari();
    const conn = nav.connection;
    const effectiveType = conn?.effectiveType || (isMobile ? '4g' : 'wifi');
    const isCellular = conn?.type === 'cellular' || (isMobile && effectiveType !== 'wifi');
    if (effectiveType === '2g' || effectiveType === 'slow-2g') {
        return {
            chunkSizeKB: 5120,
            minChunkSizeKB: 5120,
            maxChunkSizeKB: 5120,
            concurrency: 1,
            isMobile,
            isCellular: true,
            isIOSSafari: isIOS,
            effectiveType,
        };
    }
    if (effectiveType === '3g') {
        return {
            chunkSizeKB: 5120,
            minChunkSizeKB: 5120,
            maxChunkSizeKB: 10240,
            concurrency: 1,
            isMobile,
            isCellular: true,
            isIOSSafari: isIOS,
            effectiveType,
        };
    }
    if (isMobile) {
        return {
            chunkSizeKB: 10240,
            minChunkSizeKB: 5120,
            maxChunkSizeKB: 20480,
            concurrency: 1,
            isMobile,
            isCellular,
            isIOSSafari: isIOS,
            effectiveType,
        };
    }
    return {
        chunkSizeKB: 30720,
        minChunkSizeKB: 10240,
        maxChunkSizeKB: 51200,
        concurrency: 3,
        isMobile: false,
        isCellular: false,
        isIOSSafari: isIOS,
        effectiveType,
    };
}
//# sourceMappingURL=index.js.map