import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TipsPage — full shooting-tips guide. Renders the 4 rail tips as a "rules
 * that matter most" quick-start, then groups the remainder by category.
 *
 * Pure presentation; safe to render in a server component. Pass `ctaHref` +
 * `ctaLabel` to surface an action at the bottom (e.g. "Upload your first
 * game →").
 */
import * as React from 'react';
import { Lightbulb } from 'lucide-react';
import { SHOOTING_TIPS, TIP_CATEGORIES, TIP_CATEGORY_ORDER, getRailTips, getTipsByCategory, } from './data.js';
import { resolveTipIcon } from './icons.js';
export function TipsPage({ heading = 'Tips for great game footage', eyebrow = 'Shooting guide', intro = 'The 4 rules that matter most live at the top. The full breakdown by category sits below — phone settings, where to stand, what to do during the game, and the upload workflow that makes the AI work harder for you.', ctaHref, ctaLabel = 'Upload your first game →', linkComponent, className = '', }) {
    const railTips = getRailTips(4);
    const grouped = getTipsByCategory();
    const LinkComponent = linkComponent ?? 'a';
    // Tips with priority < 5 are the rail tips — render them in the
    // quick-start. The category sections render the remainder (priority ≥ 5).
    const railIds = new Set(railTips.map((t) => t.id));
    return (_jsxs("article", { className: `mx-auto max-w-4xl ${className}`.trim(), children: [_jsxs("header", { className: "mb-10", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-amber-400", children: eyebrow }), _jsx("h1", { className: "mt-2 text-3xl font-black tracking-tight text-zinc-100 sm:text-4xl", children: heading }), _jsx("p", { className: "mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400", children: intro })] }), _jsxs("section", { className: "mb-12 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6", "aria-labelledby": "tips-quickstart-heading", children: [_jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsx(Lightbulb, { className: "h-5 w-5 text-amber-400", "aria-hidden": "true" }), _jsx("h2", { id: "tips-quickstart-heading", className: "text-sm font-semibold uppercase tracking-widest text-amber-300", children: "The 4 rules that matter most" })] }), _jsx("ol", { className: "grid gap-3 sm:grid-cols-2", children: railTips.map((tip, i) => {
                            const Icon = resolveTipIcon(tip.icon);
                            return (_jsxs("li", { className: "flex gap-3 rounded-lg border border-amber-500/10 bg-zinc-950/40 p-3", children: [_jsx("span", { className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-300", "aria-hidden": "true", children: _jsx(Icon, { className: "h-4 w-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-amber-400", children: ["Rule ", i + 1] }), _jsx("p", { className: "mt-0.5 font-semibold text-zinc-100", children: tip.title }), _jsx("p", { className: "mt-1 text-xs leading-relaxed text-zinc-400", children: tip.body })] })] }, tip.id));
                        }) })] }), TIP_CATEGORY_ORDER.map((cat) => {
                const tips = grouped[cat].filter((t) => !railIds.has(t.id));
                if (tips.length === 0)
                    return null;
                const meta = TIP_CATEGORIES[cat];
                return (_jsxs("section", { className: "mb-10", children: [_jsx("h2", { className: "text-lg font-semibold text-zinc-100", children: meta.label }), _jsx("p", { className: "mt-1 text-sm text-zinc-400", children: meta.description }), _jsx("ul", { className: "mt-4 space-y-3", children: tips.map((tip) => {
                                const Icon = resolveTipIcon(tip.icon);
                                return (_jsxs("li", { className: "flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4", children: [_jsx("span", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-amber-400", "aria-hidden": "true", children: _jsx(Icon, { className: "h-4 w-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-semibold text-zinc-100", children: tip.title }), _jsx("p", { className: "mt-1 text-sm leading-relaxed text-zinc-400", children: tip.body })] })] }, tip.id));
                            }) })] }, cat));
            }), ctaHref ? (_jsxs("footer", { className: "mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center", children: [_jsxs("p", { className: "text-sm text-zinc-300", children: ["Ready to put these to work? ", SHOOTING_TIPS.length, " tips, one upload."] }), _jsx(LinkComponent, { href: ctaHref, className: "mt-4 inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400", children: ctaLabel })] })) : null] }));
}
//# sourceMappingURL=TipsPage.js.map