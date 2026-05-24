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

import * as React from 'react';
import { useState, useId } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Loader2, Star, Trash2 } from 'lucide-react';
import { cn } from './cn.js';

export interface ReorderableClip {
  /** The row whose `position` we move (ReelClip.id in NextPlay). */
  reelClipId: string;
  /** Underlying Clip / ClipCandidate id (used by pin / remove callbacks). */
  clipId: string;
  /** Optional source DetectedEvent id (for remove logic that needs it). */
  eventId?: string | null;
  startTime: number;
  endTime: number;
  peakTime: number;
  eventType?: string | null;
  description?: string | null;
  compositeScore?: number | null;
  isHeroPlay?: boolean;
  /** Mux playback id for the thumbnail; null hides the thumbnail. */
  playbackId?: string | null;
}

export interface ReorderableClipListProps {
  clips: ReorderableClip[];
  /**
   * Persist the new order. Return `{ok: true}` to keep the optimistic
   * update; return `{ok: false, error?}` (or throw) to revert + surface
   * the error. The toolkit calls this with the new reelClipId order.
   */
  onReorder: (
    orderedReelClipIds: string[],
  ) => Promise<{ ok: boolean; error?: string }>;
  /** Optional Pin Hero action. Button hides when not provided. */
  onPinHero?: (clipId: string, alreadyHero: boolean) => Promise<void> | void;
  /** Optional Remove action. Button hides when not provided. */
  onRemove?: (clipId: string, eventId: string | null) => Promise<void> | void;
  /** Consumer-driven loading state for the Pin button (one row at a time). */
  pinningClipId?: string | null;
  /** Consumer-driven loading state for the Remove button. */
  removingClipId?: string | null;
  /** Fires after a successful reorder. Wire to your toast library. */
  onSaveSuccess?: () => void;
  /** Fires after a failed reorder. Receives the error message. */
  onSaveError?: (error: string) => void;
  /** Section heading. Default "Reorder clips". */
  heading?: string;
  /** Sub-heading. Default mentions auto re-render. */
  subheading?: string;
  /** Extra classes on the wrapper. */
  className?: string;
}

function formatEvent(s: string | null | undefined): string {
  if (!s) return 'Clip';
  return s
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDuration(seconds: number): string {
  const s = Math.max(0, seconds);
  if (s < 10) return `${s.toFixed(1)}s`;
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

export function ReorderableClipList({
  clips,
  onReorder,
  onPinHero,
  onRemove,
  pinningClipId,
  removingClipId,
  onSaveSuccess,
  onSaveError,
  heading = 'Reorder clips',
  subheading = 'Drag to set the order. The download will re-render automatically.',
  className,
}: ReorderableClipListProps): React.ReactElement {
  // Local order — applied optimistically on drag-end, reverted on
  // onReorder failure. Parent's `clips` prop is the canonical-on-success
  // source; we sync from it via the key so consumers can force a reset.
  const [localOrder, setLocalOrder] = useState<ReorderableClip[]>(clips);
  React.useEffect(() => {
    setLocalOrder(clips);
  }, [clips]);

  const [savingOrder, setSavingOrder] = useState(false);
  const listId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent): Promise<void> {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localOrder.findIndex((c) => c.reelClipId === active.id);
    const newIndex = localOrder.findIndex((c) => c.reelClipId === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(localOrder, oldIndex, newIndex);
    const previous = localOrder;
    setLocalOrder(reordered);
    setSavingOrder(true);

    try {
      const result = await onReorder(
        reordered.map((c) => c.reelClipId),
      );
      if (result.ok) {
        onSaveSuccess?.();
      } else {
        setLocalOrder(previous);
        onSaveError?.(result.error ?? 'Reorder failed');
      }
    } catch (err) {
      setLocalOrder(previous);
      onSaveError?.(err instanceof Error ? err.message : 'Reorder failed');
    } finally {
      setSavingOrder(false);
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-800 bg-zinc-900',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div>
          <h3 className="text-sm font-medium text-zinc-100">{heading}</h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">{subheading}</p>
        </div>
        {savingOrder && (
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
          </span>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          id={listId}
          items={localOrder.map((c) => c.reelClipId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="divide-y divide-zinc-800">
            {localOrder.map((clip, i) => (
              <SortableClipRow
                key={clip.reelClipId}
                clip={clip}
                index={i}
                onPinHero={onPinHero}
                onRemove={onRemove}
                isPinning={pinningClipId === clip.clipId}
                isRemoving={removingClipId === clip.clipId}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableClipRow({
  clip,
  index,
  onPinHero,
  onRemove,
  isPinning,
  isRemoving,
}: {
  clip: ReorderableClip;
  index: number;
  onPinHero?: (clipId: string, alreadyHero: boolean) => Promise<void> | void;
  onRemove?: (clipId: string, eventId: string | null) => Promise<void> | void;
  isPinning: boolean;
  isRemoving: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: clip.reelClipId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const duration = clip.endTime - clip.startTime;
  const thumbUrl = clip.playbackId
    ? `https://image.mux.com/${clip.playbackId}/thumbnail.jpg?time=${clip.peakTime}&width=200&height=112&fit_mode=smartcrop`
    : null;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 bg-zinc-900',
        isDragging && 'ring-1 ring-amber-400 z-10',
      )}
    >
      {/* Drag handle — touch-action: none so iOS doesn't start a scroll. */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="-ml-1 flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        aria-label={`Drag clip ${index + 1}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="w-5 shrink-0 text-center text-xs font-medium text-zinc-500">
        {index + 1}
      </span>

      {/* Thumbnail */}
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-800 sm:h-14 sm:w-24">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        {clip.isHeroPlay ? (
          <div className="absolute left-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px]">
            <Star className="h-2.5 w-2.5 fill-white text-white" />
          </div>
        ) : null}
      </div>

      {/* Meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">
          {formatEvent(clip.eventType)}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-500">
          {formatDuration(duration)}
          {clip.compositeScore != null && (
            <> · score {Math.round(clip.compositeScore * 100)}</>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {onPinHero ? (
          <button
            type="button"
            onClick={() => void onPinHero(clip.clipId, Boolean(clip.isHeroPlay))}
            disabled={isPinning}
            title={
              clip.isHeroPlay
                ? 'Unpin as Play of the Game'
                : 'Pin as Play of the Game'
            }
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
              clip.isHeroPlay
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'text-zinc-500 hover:bg-zinc-800 hover:text-amber-300',
              isPinning && 'opacity-60',
            )}
          >
            {isPinning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Star
                className={cn('h-3.5 w-3.5', clip.isHeroPlay && 'fill-current')}
              />
            )}
          </button>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            onClick={() => void onRemove(clip.clipId, clip.eventId ?? null)}
            disabled={isRemoving}
            title="Remove this clip from the reel"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-400',
              isRemoving && 'opacity-50',
            )}
          >
            {isRemoving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        ) : null}
      </div>
    </li>
  );
}
