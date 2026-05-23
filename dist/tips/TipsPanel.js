import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TipsPanel — compact rail of the top-priority shooting tips.
 *
 * Intended for the dashboard left rail or the upload page sidebar. Always
 * visible; not dismissable (the tips matter forever, unlike onboarding).
 *
 * Defaults to a zinc + brand-accent palette. Apps override the wrapper
 * styling via `className` and can swap the link component via `linkComponent`
 * (pass `Link` from next/link, or `'a'` for plain HTML).
 */
import * as React from 'react';
import { Lightbulb } from 'lucide-react';
import { getRailTips } from './data.js';
import { resolveTipIcon } from './icons.js';
export function TipsPanel({ limit = 4, fullGuideHref = '/tips', heading = 'Shooting tips', linkComponent, className = '', }) {
    const tips = getRailTips(limit);
    const LinkComponent = linkComponent ?? 'a';
    return (_jsxs("aside", { className: `rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 ${className}`.trim(), "aria-labelledby": "tips-panel-heading", children: [_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx(Lightbulb, { className: "h-4 w-4 text-amber-400", "aria-hidden": "true" }), _jsx("h2", { id: "tips-panel-heading", className: "text-xs font-semibold uppercase tracking-widest text-zinc-300", children: heading })] }), _jsx("ul", { className: "space-y-3", children: tips.map((tip) => {
                    const Icon = resolveTipIcon(tip.icon);
                    return (_jsxs("li", { className: "flex gap-3", children: [_jsx("span", { className: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-400", "aria-hidden": "true", children: _jsx(Icon, { className: "h-4 w-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-zinc-100", children: tip.title }), _jsx("p", { className: "mt-0.5 text-xs leading-relaxed text-zinc-400", children: tip.body })] })] }, tip.id));
                }) }), _jsx("div", { className: "mt-4 border-t border-zinc-800 pt-3", children: _jsx(LinkComponent, { href: fullGuideHref, className: "inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300", children: "Full guide \u2192" }) })] }));
}
//# sourceMappingURL=TipsPanel.js.map