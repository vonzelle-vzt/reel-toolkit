/**
 * ReelCardClipStrip — horizontal sliver of clip thumbnails for a reel card.
 *
 * Mobile collapses to a tappable strip (3px sliver per clip) that expands
 * inline on tap. Desktop renders the full thumbnails always.
 *
 * Schema-agnostic: takes an array of `{ playbackId, peakTime }` and a
 * total count for the "+N" overflow badge. Mux thumbnail URL is built
 * inline — if your CDN is different, fork this component or PR an
 * `urlBuilder` prop.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useState } from 'react';
import { cn } from './cn.js';
export function ReelCardClipStrip({ clips, totalClipCount, className, }) {
    const [expandedOnMobile, setExpandedOnMobile] = useState(false);
    if (clips.length === 0)
        return null;
    const extra = Math.max(0, totalClipCount - clips.length);
    return (_jsxs("button", { type: "button", onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpandedOnMobile((v) => !v);
        }, className: cn('group/strip flex w-full items-center gap-1 overflow-hidden text-left', className), title: `${totalClipCount} clip${totalClipCount === 1 ? '' : 's'}`, "aria-label": `${totalClipCount} clips in this reel`, children: [clips.map((c, i) => {
                const thumb = c.playbackId
                    ? `https://image.mux.com/${c.playbackId}/thumbnail.jpg?time=${c.peakTime}&width=120&height=68&fit_mode=smartcrop`
                    : null;
                return (_jsx("div", { className: cn('relative shrink-0 overflow-hidden rounded-sm bg-zinc-800 transition-all', expandedOnMobile ? 'h-8 w-12' : 'h-8 w-3 sm:w-12'), children: thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    _jsx("img", { src: thumb, alt: "", className: "h-full w-full object-cover", loading: "lazy" })) : null }, i));
            }), extra > 0 && (_jsxs("span", { className: cn('flex shrink-0 items-center justify-center rounded-sm bg-zinc-800 px-1.5 text-[10px] font-medium text-zinc-300 transition-all', expandedOnMobile ? 'h-8' : 'h-8 sm:h-8'), children: ["+", extra] }))] }));
}
//# sourceMappingURL=reel-card-clip-strip.js.map