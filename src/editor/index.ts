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

export { ClipTrimmer, type ClipTrimmerProps } from './clip-trimmer.js';
export {
  EnhancedVideoPlayer,
  type EnhancedVideoPlayerHandle,
  type EnhancedVideoPlayerProps,
} from './video-player-enhanced.js';

// v1.2.0 — reel-card primitives + reel-type chip helper
export {
  reelTypeMeta,
  type ReelTypeMeta,
  type ReelTypeMetaOptions,
} from './reel-type-meta.js';
export {
  CopyLinkButton,
  type CopyLinkButtonProps,
} from './copy-link-button.js';
export {
  ReelCardClipStrip,
  type ReelCardClipStripProps,
  type ReelCardClip,
} from './reel-card-clip-strip.js';
export {
  ReelCard,
  getRelativeTime,
  type ReelCardProps,
  type ReelCardData,
} from './reel-card.js';
export {
  ContinueEditingCard,
  type ContinueEditingCardProps,
  type ContinueEditingItem,
  type ContinueEditingReasonKind,
} from './continue-editing-card.js';

// v1.5.0 — preview-client primitives (extracted from NextPlay's
// preview-client.tsx so they auto-flow to FlagPlay via toolkit publish).
export {
  PlayerModeTabs,
  type PlayerModeTabsProps,
  type PlayerMode,
} from './player-mode-tabs.js';
export {
  CutLengthTabs,
  type CutLengthTabsProps,
  type CutLength,
} from './cut-length-tabs.js';
export {
  GameContextCard,
  type GameContextCardProps,
  type GameContextAnalysis,
} from './game-context-card.js';

// v1.6.0 — ReorderableClipList drag-to-reorder. Uses @dnd-kit; consumer
// must have @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities installed.
export {
  ReorderableClipList,
  type ReorderableClipListProps,
  type ReorderableClip,
} from './reorderable-clip-list.js';
