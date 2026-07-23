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
 *
 * v1.7.0 — optional ACTIONS. The card used to be read-only: it told the user
 * something was broken and offered nowhere to go but the reel page. Consumers
 * can now pass `headerActions` (e.g. "Retry all") and `itemActions` (e.g.
 * "Retry" / "Dismiss"). Both are optional, so existing consumers are
 * unaffected. The card stays presentational — it owns no retry/dismiss logic,
 * it just renders the buttons the app hands it.
 */
import * as React from 'react';
import { AlertCircle, ArrowRight, Clock, FileEdit, GripVertical, Loader2 } from 'lucide-react';
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
function ActionButton({ action }) {
    const isPrimary = action.variant === 'primary';
    return (_jsxs("button", { type: "button", onClick: action.onClick, disabled: action.pending || action.disabled, className: cn('inline-flex shrink-0 items-center gap-1 rounded-md px-2 text-[11px] font-medium transition-colors disabled:opacity-50', 
        // ≥32px touch target on mobile, tighter on desktop (v6.54 rule).
        'min-h-[32px] py-1.5 sm:min-h-0 sm:py-1', isPrimary
            ? 'bg-amber-500/20 text-amber-100 hover:bg-amber-500/30'
            : 'text-zinc-400 hover:bg-amber-500/10 hover:text-zinc-200'), children: [action.pending ? (_jsx(Loader2, { className: "h-3 w-3 animate-spin" })) : (action.icon ?? null), action.label] }));
}
export function ContinueEditingCard({ items, heading = 'Needs your attention', linkComponent, className, headerActions, itemActions, }) {
    if (items.length === 0)
        return null;
    const LinkComponent = linkComponent;
    return (_jsxs("div", { className: cn('rounded-xl border border-amber-500/20 bg-amber-500/5', className), children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 border-b border-amber-500/10 px-4 py-3 sm:px-5", children: [_jsx(FileEdit, { className: "h-4 w-4 shrink-0 text-amber-400" }), _jsx("h2", { className: "font-medium text-zinc-100", children: heading }), _jsxs("span", { className: "text-[11px] text-zinc-400", children: [items.length, " reel", items.length === 1 ? '' : 's'] }), headerActions && headerActions.length > 0 ? (_jsx("div", { className: "ml-auto flex items-center gap-1.5", children: headerActions.map((action) => (_jsx(ActionButton, { action: action }, action.key))) })) : null] }), _jsx("ul", { className: "divide-y divide-amber-500/10", children: items.map((item) => {
                    const actions = itemActions?.(item) ?? [];
                    return (_jsxs("li", { className: cn('transition-colors hover:bg-amber-500/5', 
                        // Actions STACK below the text on mobile and sit inline on
                        // desktop. Inline-at-375px truncated titles to "Jonathan
                        // Perry'…" — the buttons ate the row. Stacking gives the
                        // title the full width and keeps the labels readable
                        // instead of degrading them to bare icons.
                        actions.length > 0
                            ? 'flex flex-col gap-1 pb-2 sm:flex-row sm:items-center sm:gap-2 sm:pb-0 sm:pr-3'
                            : 'flex items-center gap-2 pr-2 sm:pr-3'), children: [_jsxs(LinkComponent, { href: item.href, className: "flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 pr-3 sm:pl-5 sm:pr-0", children: [_jsx("div", { className: "relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-800 sm:h-12 sm:w-20", children: item.thumbnailSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        _jsx("img", { src: item.thumbnailSrc, alt: "", className: "h-full w-full object-cover", loading: "lazy" })) : null }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-sm font-medium text-zinc-100", children: item.displayTitle }), _jsxs("p", { className: "mt-0.5 flex items-center gap-1 text-[11px] text-amber-300", children: [reasonIcon(item.reasonKind), item.reasonText] })] }), actions.length === 0 ? (_jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-amber-400" })) : null] }), actions.length > 0 ? (_jsx("div", { className: "flex shrink-0 items-center justify-end gap-1 pl-4 pr-2 sm:pl-0 sm:pr-0", children: actions.map((action) => (_jsx(ActionButton, { action: action }, action.key))) })) : null] }, item.id));
                }) })] }));
}
//# sourceMappingURL=continue-editing-card.js.map