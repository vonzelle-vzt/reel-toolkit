/**
 * @vonzelle-vzt/reel-toolkit
 *
 * Schema-agnostic video editor primitives shared by NextPlay and FlagPlay.
 *
 * Apps consume the modules they need via subpath exports — see `exports`
 * in package.json. Each consuming app writes a thin adapter that maps its
 * Prisma rows into the toolkit's `ClipShape` / `ReelShape` types before
 * calling toolkit helpers.
 */
export type { ClipShape, ReelShape } from './types/shapes.js';
export type { ReelType, AspectRatio, ReelStatus, DownloadStatus } from './types/enums.js';
export { CURRENT_CLIP_LOGIC_VERSION, } from './logic-version/index.js';
export { getClipPlayableWindow, type ClipPlayableWindow, type ClipForWindow, } from './clip-window/index.js';
export { getNetworkProfile, isIOSSafari, shouldUseLargeFileWorkaround, IOS_LARGE_FILE_THRESHOLD, type NetworkProfile, } from './network-profile/index.js';
//# sourceMappingURL=index.d.ts.map