'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from './cn.js';
const SNAP_INCREMENT = 0.1;
const SEEK_THROTTLE_MS = 60;
function snap(value) {
    return Math.round(value / SNAP_INCREMENT) * SNAP_INCREMENT;
}
function formatTimeMs(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}
export function ClipTrimmer({ startTime, endTime, duration, onChange, onSeek, className, }) {
    const trackRef = useRef(null);
    const [dragging, setDragging] = useState(null);
    const [originalStart] = useState(startTime);
    const [originalEnd] = useState(endTime);
    const lastSeekAtRef = useRef(0);
    const fireSeek = useCallback((time, edge, { force } = {}) => {
        if (!onSeek)
            return;
        const now = Date.now();
        if (!force && now - lastSeekAtRef.current < SEEK_THROTTLE_MS)
            return;
        lastSeekAtRef.current = now;
        onSeek(time, edge);
    }, [onSeek]);
    const toPercent = useCallback((time) => (duration > 0 ? (time / duration) * 100 : 0), [duration]);
    const toTime = useCallback((pct) => snap(Math.max(0, Math.min(duration, (pct / 100) * duration))), [duration]);
    function handlePointerDown(handle) {
        return (e) => {
            e.preventDefault();
            setDragging(handle);
            e.target.setPointerCapture(e.pointerId);
        };
    }
    function handlePointerMove(e) {
        if (!dragging || !trackRef.current)
            return;
        const rect = trackRef.current.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        const time = toTime(Math.max(0, Math.min(100, pct)));
        if (dragging === 'start') {
            const newStart = Math.min(time, endTime - SNAP_INCREMENT);
            onChange(newStart, endTime);
            fireSeek(newStart, 'start');
        }
        else {
            const newEnd = Math.max(time, startTime + SNAP_INCREMENT);
            onChange(startTime, newEnd);
            fireSeek(newEnd, 'end');
        }
    }
    function handlePointerUp() {
        if (dragging) {
            const time = dragging === 'start' ? startTime : endTime;
            fireSeek(time, dragging, { force: true });
        }
        setDragging(null);
    }
    function handleReset() {
        onChange(originalStart, originalEnd);
    }
    const startPct = toPercent(startTime);
    const endPct = toPercent(endTime);
    const clipDuration = endTime - startTime;
    return (_jsxs("div", { className: cn('select-none', className), children: [_jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [_jsxs("span", { className: "text-[10px] font-medium text-zinc-400", children: ["Trim Clip \u00B7 ", clipDuration.toFixed(1), "s"] }), _jsxs("button", { onClick: handleReset, type: "button", className: "flex items-center gap-1 text-[10px] text-zinc-500 transition-colors hover:text-zinc-300", title: "Reset to original boundaries", children: [_jsx(RotateCcw, { className: "h-2.5 w-2.5" }), "Reset"] })] }), _jsxs("div", { ref: trackRef, className: "relative h-8 w-full cursor-default rounded-md bg-zinc-800", onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, children: [_jsx("div", { className: "absolute inset-y-0 rounded-sm border-y border-sky-500/40 bg-sky-500/20", style: {
                            left: `${startPct}%`,
                            width: `${endPct - startPct}%`,
                        } }), _jsx("div", { className: cn('absolute inset-y-0 z-10 flex w-6 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center rounded-l-sm sm:w-3', dragging === 'start' ? 'bg-sky-400' : 'bg-sky-500/70 hover:bg-sky-400'), style: { left: `${startPct}%` }, onPointerDown: handlePointerDown('start'), children: _jsx("div", { className: "h-3 w-0.5 rounded-full bg-white/60" }) }), _jsx("div", { className: cn('absolute inset-y-0 z-10 flex w-6 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center rounded-r-sm sm:w-3', dragging === 'end' ? 'bg-sky-400' : 'bg-sky-500/70 hover:bg-sky-400'), style: { left: `${endPct}%` }, onPointerDown: handlePointerDown('end'), children: _jsx("div", { className: "h-3 w-0.5 rounded-full bg-white/60" }) }), _jsx("div", { className: "absolute -bottom-5 font-mono text-[9px] text-sky-400", style: { left: `${startPct}%`, transform: 'translateX(-50%)' }, children: formatTimeMs(startTime) }), _jsx("div", { className: "absolute -bottom-5 font-mono text-[9px] text-sky-400", style: { left: `${endPct}%`, transform: 'translateX(-50%)' }, children: formatTimeMs(endTime) })] }), _jsx("div", { className: "h-4" })] }));
}
//# sourceMappingURL=clip-trimmer.js.map