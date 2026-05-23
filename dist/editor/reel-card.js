/**
 * ReelCard — schema-agnostic visual card for a single reel.
 *
 * Renders the rich NextPlay-style card UI: thumbnail with fallback chain,
 * reel-type chip, metadata pills (clip count, runtime, custom-order, ready/
 * rendering), inline clip-thumbnail strip, copy-link button, reorder
 * shortcut, and an optional delete-button slot.
 *
 * The app owns:
 *   - Routing (pass `previewHref` + optional `editHref`).
 *   - The link component (pass `linkComponent` — next/link or 'a').
 *   - The delete affordance (pass `deleteSlot` — usually a server-action-
 *     backed button the app owns).
 *   - Optional toast wiring for the copy-link button (pass `onCopySuccess`
 *     / `onCopyError`).
 *
 * The toolkit owns: thumbnail chain, chip styling, metadata pills, layout.
 *
 * Per [[no-fake-recruiting-data]]: never falls back to the source video's
 * playbackId for the reel thumbnail. The fallback chain is:
 *   1. props.thumbnailUrl (explicit cover)
 *   2. props.muxPlaybackId  (rendered reel asset)
 *   3. props.heroClipPlaybackId at heroClipPeakTime (first clip's frame)
 *   4. Film-icon placeholder
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Download, Film, GripVertical, Layers, Loader, Play, } from 'lucide-react';
import { cn } from './cn.js';
import { reelTypeMeta } from './reel-type-meta.js';
import { ReelCardClipStrip, } from './reel-card-clip-strip.js';
import { CopyLinkButton } from './copy-link-button.js';
function formatDuration(seconds) {
    const s = Math.max(0, Math.round(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    if (mins === 0)
        return `${secs}s`;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}
export function ReelCard({ reel, previewHref, editHref, linkComponent, deleteSlot, isReadOnly = false, labelOverrides, onCopySuccess, onCopyError, className, }) {
    const LinkComponent = linkComponent;
    const meta = reelTypeMeta(reel.reelType, { labelOverrides });
    const ChipIcon = meta.icon;
    const heroClip = reel.topClips?.[0];
    const thumbnailSrc = reel.thumbnailUrl
        ? reel.thumbnailUrl
        : reel.muxPlaybackId
            ? `https://image.mux.com/${reel.muxPlaybackId}/thumbnail.jpg?width=400&height=225&time=2`
            : (reel.heroClipPlaybackId ?? heroClip?.playbackId)
                ? `https://image.mux.com/${reel.heroClipPlaybackId ?? heroClip.playbackId}/thumbnail.jpg?width=400&height=225&time=${Math.max(0, Math.round(reel.heroClipPeakTime ?? heroClip?.peakTime ?? 0))}`
                : null;
    const clipCount = reel.clipCount ?? 0;
    const totalSeconds = reel.totalSeconds ?? 0;
    const sourceVideoCount = reel.sourceVideoCount ?? 0;
    return (_jsxs("div", { className: cn('group relative rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition-all hover:border-amber-400/30', className), children: [_jsxs(LinkComponent, { href: previewHref, className: "block", children: [_jsxs("div", { className: "relative aspect-video rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden", children: [thumbnailSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            _jsx("img", { src: thumbnailSrc, alt: "", className: "absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105", loading: "lazy" })) : (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx(Film, { className: "h-8 w-8 text-zinc-700" }) })), _jsxs("span", { className: cn('absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm', meta.chipClass), children: [_jsx(ChipIcon, { className: "h-3 w-3" }), " ", meta.label] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform group-hover:scale-110", children: _jsx(Play, { className: "h-5 w-5 text-white fill-white" }) }) })] }), _jsxs("div", { className: "mt-2.5", children: [_jsx("p", { className: "text-sm font-medium text-zinc-100 truncate", children: reel.displayTitle }), _jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-1", children: [sourceVideoCount > 1 && (_jsxs("span", { className: "flex items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300", children: [_jsx(Layers, { className: "h-2.5 w-2.5" }), " ", sourceVideoCount, " games combined"] })), clipCount > 0 && (_jsxs("span", { className: "rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400", children: [clipCount, " clips"] })), totalSeconds > 0 && (_jsx("span", { className: "rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400", children: formatDuration(totalSeconds) })), reel.downloadStatus === 'READY' && reel.downloadPlaybackId && (_jsxs("span", { className: "flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300", children: [_jsx(Download, { className: "h-2.5 w-2.5" }), " Ready"] })), reel.downloadStatus === 'RENDERING' && (_jsxs("span", { className: "flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-300", children: [_jsx(Loader, { className: "h-2.5 w-2.5 animate-spin" }), " Rendering"] })), reel.userReorderedAt && (_jsx("span", { className: "rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300", children: "Custom order" }))] }), reel.topClips && reel.topClips.length > 0 && (_jsx("div", { className: "mt-1.5", children: _jsx(ReelCardClipStrip, { clips: reel.topClips, totalClipCount: clipCount }) })), reel.relativeTime && (_jsx("div", { className: "mt-1.5 flex items-center justify-end", children: _jsx("span", { className: "text-[10px] text-zinc-500", children: reel.relativeTime }) }))] })] }), editHref && clipCount > 1 && !isReadOnly && (_jsx(LinkComponent, { href: editHref, className: "absolute right-12 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur-sm transition-all hover:bg-black/70 sm:right-10 sm:top-5 sm:h-6 sm:w-6 sm:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100", children: _jsx(GripVertical, { className: "h-3 w-3" }) })), !isReadOnly && deleteSlot, _jsx(CopyLinkButton, { shareToken: reel.shareToken, onSuccess: onCopySuccess, onError: onCopyError })] }));
}
/** Compute a human-readable relative-time string. Exported for app reuse so
 *  apps don't have to reinvent the same formatter. */
export function getRelativeTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1)
        return 'just now';
    if (diffMins < 60)
        return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
        return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7)
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
}
//# sourceMappingURL=reel-card.js.map