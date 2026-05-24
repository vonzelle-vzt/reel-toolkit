/**
 * React editor components — Mux player + clip trimmer with live preview sync.
 *
 * Both components use Tailwind classes baked-in with sensible defaults
 * (zinc + sky palette). Override via `className` for app-specific theming.
 *
 * Peer dependencies:
 *   - react ^19
 *   - @mux/mux-player-react ^3 (EnhancedVideoPlayer only)
 *   - lucide-react (icons)
 *   - tailwindcss (for the class names to resolve at build time)
 */
export { ClipTrimmer } from './clip-trimmer.js';
export { EnhancedVideoPlayer, } from './video-player-enhanced.js';
// v1.2.0 — reel-card primitives + reel-type chip helper
export { reelTypeMeta, } from './reel-type-meta.js';
export { CopyLinkButton, } from './copy-link-button.js';
export { ReelCardClipStrip, } from './reel-card-clip-strip.js';
export { ReelCard, getRelativeTime, } from './reel-card.js';
export { ContinueEditingCard, } from './continue-editing-card.js';
// v1.5.0 — preview-client primitives (extracted from NextPlay's
// preview-client.tsx so they auto-flow to FlagPlay via toolkit publish).
export { PlayerModeTabs, } from './player-mode-tabs.js';
export { CutLengthTabs, } from './cut-length-tabs.js';
export { GameContextCard, } from './game-context-card.js';
//# sourceMappingURL=index.js.map