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
// Pure helpers (Node + browser)
export { CURRENT_CLIP_LOGIC_VERSION, } from './logic-version/index.js';
export { getClipPlayableWindow, } from './clip-window/index.js';
export { getNetworkProfile, isIOSSafari, shouldUseLargeFileWorkaround, IOS_LARGE_FILE_THRESHOLD, } from './network-profile/index.js';
// React components are NOT re-exported from the root — import from subpaths
// so apps that only use the helpers don't pay the React peer-dep cost.
//   import { ClipTrimmer } from '@vonzelle-vzt/reel-toolkit/editor';
//   import { EnhancedVideoPlayer } from '@vonzelle-vzt/reel-toolkit/editor';
//# sourceMappingURL=index.js.map