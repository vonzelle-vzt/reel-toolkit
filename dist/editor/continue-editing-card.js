import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ContinueEditingCard — surfaces reels still needing the user's attention.
 *
 * Schema-agnostic: the app pre-computes WHY each reel is in the list
 * (failed download, re-render queued, etc.) and passes a flat
 * `ContinueEditingItem[]` of already-formatted display data. The toolkit
 * just renders + provides recognizable icons per `reasonKind`.
 *
 * Hides entirely when items is empty — no "you're all caught up" card.
 * That's intentional: an attention-grabbing card with nothing useful in
 * it would erode trust in the surface.
 */
import * as React from 'react';
import { AlertCircle, ArrowRight, Clock, FileEdit, GripVertical } from 'lucide-react';
import { cn } from './cn.js';
function reasonIcon(kind) {
    switch (kind) {
        case 'failed':
            return _jsx(AlertCircle, { className: "h-3 w-3" });
        case 'reordering':
            return _jsx(GripVertical, { className: "h-3 w-3" });
        case 'pending':
            return _jsx(Clock, { className: "h-3 w-3" });
        case 'custom':
        default:
            return _jsx(FileEdit, { className: "h-3 w-3" });
    }
}
export function ContinueEditingCard({ items, heading = 'Needs your attention', linkComponent, className, }) {
    if (items.length === 0)
        return null;
    const LinkComponent = linkComponent;
    return (_jsxs("div", { className: cn('rounded-xl border border-amber-500/20 bg-amber-500/5', className), children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-amber-500/10 px-4 py-3 sm:px-5", children: [_jsx(FileEdit, { className: "h-4 w-4 text-amber-400" }), _jsx("h2", { className: "font-medium text-zinc-100", children: heading }), _jsxs("span", { className: "ml-auto text-[11px] text-zinc-400", children: [items.length, " reel", items.length === 1 ? '' : 's'] })] }), _jsx("ul", { className: "divide-y divide-amber-500/10", children: items.map((item) => (_jsx("li", { children: _jsxs(LinkComponent, { href: item.href, className: "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-amber-500/5 sm:px-5", children: [_jsx("div", { className: "relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-800 sm:h-12 sm:w-20", children: item.thumbnailSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                _jsx("img", { src: item.thumbnailSrc, alt: "", className: "h-full w-full object-cover", loading: "lazy" })) : null }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-sm font-medium text-zinc-100", children: item.displayTitle }), _jsxs("p", { className: "mt-0.5 flex items-center gap-1 text-[11px] text-amber-300", children: [reasonIcon(item.reasonKind), item.reasonText] })] }), _jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-amber-400" })] }) }, item.id))) })] }));
}
//# sourceMappingURL=continue-editing-card.js.map