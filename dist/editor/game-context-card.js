/**
 * GameContextCard — info card displaying game metadata: opponent, date,
 * score, sport, runtime. Optionally expandable to show AI-pipeline stats
 * (chunks processed, scenes classified, live-play percent, etc.) when the
 * consumer's pipeline emits them.
 *
 * Pure presentation — schema-agnostic. Consumer maps its DB rows (NextPlay
 * VideoUpload, FlagPlay Game) into the GameContextData shape and renders.
 * Returns null when there's nothing meaningful to show (no opponent,
 * no score, no analysisData) — don't render an empty card.
 *
 * Originally lived at NextPlay's
 * src/components/highlights/game-context-card.tsx; this version drops the
 * Titanium-Signal palette in favor of standard Tailwind (zinc/orange/amber)
 * so it works in any consumer. NextPlay can override colors via a wrapper
 * className if needed.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useState } from 'react';
import { Activity, BarChart3, ChevronDown, ChevronUp, Clock, FileText, Layers, Mic, Trophy, } from 'lucide-react';
import { cn } from './cn.js';
function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
        return `${h}h ${m}m`;
    return `${m}m ${s}s`;
}
function formatSport(s) {
    return s
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatGameDate(d) {
    const date = typeof d === 'string' ? new Date(d) : d;
    if (Number.isNaN(date.getTime()))
        return '';
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
export function GameContextCard({ opponent, gameDate, gameScore, sport, duration, analysisData, className, }) {
    const [expanded, setExpanded] = useState(false);
    const hasAnalysis = Boolean(analysisData && Object.keys(analysisData).length > 0);
    if (!opponent && !gameScore && !hasAnalysis)
        return null;
    return (_jsxs("div", { className: cn('rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden', className), children: [_jsxs("div", { className: "flex items-center justify-between p-4", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10", children: _jsx(Trophy, { className: "h-5 w-5 text-orange-400" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "truncate text-sm font-medium text-zinc-100", children: opponent ? `vs ${opponent}` : 'Game Context' }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-zinc-500", children: [sport ? _jsx("span", { children: formatSport(sport) }) : null, gameDate ? _jsxs("span", { children: ["\u00B7 ", formatGameDate(gameDate)] }) : null, duration ? (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), " ", formatDuration(duration)] })) : null] })] })] }), gameScore ? (_jsx("div", { className: "ml-3 rounded-md bg-zinc-800 px-3 py-1.5 font-mono text-sm font-bold text-zinc-100", children: gameScore })) : null, hasAnalysis ? (_jsx("button", { type: "button", onClick: () => setExpanded((v) => !v), className: "ml-2 flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300", "aria-label": expanded ? 'Collapse pipeline details' : 'Expand pipeline details', children: expanded ? _jsx(ChevronUp, { className: "h-4 w-4" }) : _jsx(ChevronDown, { className: "h-4 w-4" }) })) : null] }), expanded && hasAnalysis && analysisData ? (_jsx("div", { className: "border-t border-zinc-800 bg-zinc-950/50 px-4 py-3", children: _jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs sm:grid-cols-3", children: [analysisData.pipeline ? (_jsx(Stat, { icon: _jsx(Activity, { className: "h-3 w-3" }), label: "Pipeline", value: analysisData.pipeline })) : null, analysisData.strategy ? (_jsx(Stat, { icon: _jsx(Layers, { className: "h-3 w-3" }), label: "Strategy", value: analysisData.strategy })) : null, typeof analysisData.chunksProcessed === 'number' ? (_jsx(Stat, { icon: _jsx(BarChart3, { className: "h-3 w-3" }), label: "Chunks", value: String(analysisData.chunksProcessed) })) : null, typeof analysisData.framesExtracted === 'number' ? (_jsx(Stat, { icon: _jsx(BarChart3, { className: "h-3 w-3" }), label: "Frames", value: `${analysisData.framesExtracted}${typeof analysisData.framesAfterFiltering === 'number'
                                ? ` → ${analysisData.framesAfterFiltering}`
                                : ''}` })) : null, typeof analysisData.livePlayPercent === 'number' ? (_jsx(Stat, { icon: _jsx(Activity, { className: "h-3 w-3" }), label: "Live play", value: `${Math.round(analysisData.livePlayPercent * 100)}%` })) : null, typeof analysisData.scoreboardReads === 'number' ? (_jsx(Stat, { icon: _jsx(Trophy, { className: "h-3 w-3" }), label: "Scoreboard", value: `${analysisData.scoreboardReads} reads` })) : null, typeof analysisData.transcriptLength === 'number' ? (_jsx(Stat, { icon: _jsx(Mic, { className: "h-3 w-3" }), label: "Transcript", value: `${analysisData.transcriptLength.toLocaleString()} chars` })) : null, typeof analysisData.pass2Confirmed === 'number' ? (_jsx(Stat, { icon: _jsx(FileText, { className: "h-3 w-3" }), label: "Confirmed plays", value: `${analysisData.pass2Confirmed}${typeof analysisData.pass1Candidates === 'number'
                                ? ` of ${analysisData.pass1Candidates}`
                                : ''}` })) : null, typeof analysisData.processingTimeMs === 'number' ? (_jsx(Stat, { icon: _jsx(Clock, { className: "h-3 w-3" }), label: "Processed in", value: formatDuration(analysisData.processingTimeMs / 1000) })) : null] }) })) : null] }));
}
function Stat({ icon, label, value, }) {
    return (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "mt-0.5 text-zinc-500", children: icon }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-zinc-500", children: label }), _jsx("p", { className: "truncate text-zinc-300", children: value })] })] }));
}
//# sourceMappingURL=game-context-card.js.map