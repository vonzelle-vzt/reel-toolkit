/**
 * ReorderableClipList — drag-to-reorder list of clips with optional Pin Hero
 * + Remove per-row actions.
 *
 * Schema-agnostic. The consumer owns:
 *   - The clip data shape (passed via `clips` prop, conforming to
 *     ReorderableClip).
 *   - The network call that persists the new order (`onReorder` callback;
 *     returns `{ ok, error? }` so the toolkit knows whether to revert).
 *   - Toast / notification wiring (consumer reacts to onReorder's return).
 *   - Pin Hero + Remove implementations (optional callbacks; their buttons
 *     hide when not provided).
 *
 * The toolkit owns:
 *   - @dnd-kit setup (PointerSensor for mouse, TouchSensor with 250ms
 *     long-press delay for mobile scroll-vs-drag disambiguation,
 *     KeyboardSensor for a11y).
 *   - Optimistic local state — applies the new order immediately, reverts
 *     on `onReorder` failure.
 *   - Per-row layout: drag handle / position number / Mux thumbnail / event
 *     type + duration + score / Pin Hero button / Remove button.
 *
 * Ported from NextPlay's components/highlights/reorderable-clip-list.tsx
 * with the Titanium-Signal palette swapped for standard Tailwind so any
 * consumer can adopt without forking. NextPlay's local version becomes a
 * thin adapter (sonner toast wiring + the fetch URL).
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { useState, useId } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Loader2, Star, Trash2 } from 'lucide-react';
import { cn } from './cn.js';
function formatEvent(s) {
    if (!s)
        return 'Clip';
    return s
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatDuration(seconds) {
    const s = Math.max(0, seconds);
    if (s < 10)
        return `${s.toFixed(1)}s`;
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    if (mins === 0)
        return `${secs}s`;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}
export function ReorderableClipList({ clips, onReorder, onPinHero, onRemove, pinningClipId, removingClipId, onSaveSuccess, onSaveError, heading = 'Reorder clips', subheading = 'Drag to set the order. The download will re-render automatically.', className, }) {
    // Local order — applied optimistically on drag-end, reverted on
    // onReorder failure. Parent's `clips` prop is the canonical-on-success
    // source; we sync from it via the key so consumers can force a reset.
    const [localOrder, setLocalOrder] = useState(clips);
    React.useEffect(() => {
        setLocalOrder(clips);
    }, [clips]);
    const [savingOrder, setSavingOrder] = useState(false);
    const listId = useId();
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, {
        activationConstraint: { delay: 250, tolerance: 8 },
    }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    async function handleDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id)
            return;
        const oldIndex = localOrder.findIndex((c) => c.reelClipId === active.id);
        const newIndex = localOrder.findIndex((c) => c.reelClipId === over.id);
        if (oldIndex < 0 || newIndex < 0)
            return;
        const reordered = arrayMove(localOrder, oldIndex, newIndex);
        const previous = localOrder;
        setLocalOrder(reordered);
        setSavingOrder(true);
        try {
            const result = await onReorder(reordered.map((c) => c.reelClipId));
            if (result.ok) {
                onSaveSuccess?.();
            }
            else {
                setLocalOrder(previous);
                onSaveError?.(result.error ?? 'Reorder failed');
            }
        }
        catch (err) {
            setLocalOrder(previous);
            onSaveError?.(err instanceof Error ? err.message : 'Reorder failed');
        }
        finally {
            setSavingOrder(false);
        }
    }
    return (_jsxs("div", { className: cn('rounded-xl border border-zinc-800 bg-zinc-900', className), children: [_jsxs("div", { className: "flex items-center justify-between border-b border-zinc-800 px-4 py-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-zinc-100", children: heading }), _jsx("p", { className: "mt-0.5 text-[11px] text-zinc-500", children: subheading })] }), savingOrder && (_jsxs("span", { className: "flex items-center gap-1.5 text-[11px] text-zinc-400", children: [_jsx(Loader2, { className: "h-3 w-3 animate-spin" }), " Saving\u2026"] }))] }), _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { id: listId, items: localOrder.map((c) => c.reelClipId), strategy: verticalListSortingStrategy, children: _jsx("ul", { className: "divide-y divide-zinc-800", children: localOrder.map((clip, i) => (_jsx(SortableClipRow, { clip: clip, index: i, onPinHero: onPinHero, onRemove: onRemove, isPinning: pinningClipId === clip.clipId, isRemoving: removingClipId === clip.clipId }, clip.reelClipId))) }) }) })] }));
}
function SortableClipRow({ clip, index, onPinHero, onRemove, isPinning, isRemoving, }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: clip.reelClipId });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    const duration = clip.endTime - clip.startTime;
    const thumbUrl = clip.playbackId
        ? `https://image.mux.com/${clip.playbackId}/thumbnail.jpg?time=${clip.peakTime}&width=200&height=112&fit_mode=smartcrop`
        : null;
    return (_jsxs("li", { ref: setNodeRef, style: style, className: cn('flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 bg-zinc-900', isDragging && 'ring-1 ring-amber-400 z-10'), children: [_jsx("button", { type: "button", ...attributes, ...listeners, className: "-ml-1 flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 active:cursor-grabbing", style: { touchAction: 'none' }, "aria-label": `Drag clip ${index + 1}`, children: _jsx(GripVertical, { className: "h-4 w-4" }) }), _jsx("span", { className: "w-5 shrink-0 text-center text-xs font-medium text-zinc-500", children: index + 1 }), _jsxs("div", { className: "relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-800 sm:h-14 sm:w-24", children: [thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    _jsx("img", { src: thumbUrl, alt: "", className: "h-full w-full object-cover", loading: "lazy" })) : null, clip.isHeroPlay ? (_jsx("div", { className: "absolute left-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px]", children: _jsx(Star, { className: "h-2.5 w-2.5 fill-white text-white" }) })) : null] }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-sm font-medium text-zinc-100", children: formatEvent(clip.eventType) }), _jsxs("p", { className: "mt-0.5 truncate text-[11px] text-zinc-500", children: [formatDuration(duration), clip.compositeScore != null && (_jsxs(_Fragment, { children: [" \u00B7 score ", Math.round(clip.compositeScore * 100)] }))] })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [onPinHero ? (_jsx("button", { type: "button", onClick: () => void onPinHero(clip.clipId, Boolean(clip.isHeroPlay)), disabled: isPinning, title: clip.isHeroPlay
                            ? 'Unpin as Play of the Game'
                            : 'Pin as Play of the Game', className: cn('flex h-8 w-8 items-center justify-center rounded-md transition-colors', clip.isHeroPlay
                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                            : 'text-zinc-500 hover:bg-zinc-800 hover:text-amber-300', isPinning && 'opacity-60'), children: isPinning ? (_jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" })) : (_jsx(Star, { className: cn('h-3.5 w-3.5', clip.isHeroPlay && 'fill-current') })) })) : null, onRemove ? (_jsx("button", { type: "button", onClick: () => void onRemove(clip.clipId, clip.eventId ?? null), disabled: isRemoving, title: "Remove this clip from the reel", className: cn('flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-400', isRemoving && 'opacity-50'), children: isRemoving ? (_jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" })) : (_jsx(Trash2, { className: "h-3.5 w-3.5" })) })) : null] })] }));
}
//# sourceMappingURL=reorderable-clip-list.js.map