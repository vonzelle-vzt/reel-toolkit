'use client';

import { useRef, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from './cn.js';

export interface ClipTrimmerProps {
  startTime: number;
  endTime: number;
  duration: number;
  onChange: (start: number, end: number) => void;
  /**
   * Fires while the user drags a handle so the parent can seek the video
   * player live (pair with `EnhancedVideoPlayer.seekTo`). Throttled
   * internally to ~60ms — once per frame is enough for a video scrub.
   * Always fires once more on `pointerUp` with the released value so the
   * final frame is exact even if the throttle dropped the last move.
   */
  onSeek?: (time: number, edge: 'start' | 'end') => void;
  className?: string;
}

const SNAP_INCREMENT = 0.1;
const SEEK_THROTTLE_MS = 60;

function snap(value: number): number {
  return Math.round(value / SNAP_INCREMENT) * SNAP_INCREMENT;
}

function formatTimeMs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function ClipTrimmer({
  startTime,
  endTime,
  duration,
  onChange,
  onSeek,
  className,
}: ClipTrimmerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);
  const [originalStart] = useState(startTime);
  const [originalEnd] = useState(endTime);
  const lastSeekAtRef = useRef(0);

  const fireSeek = useCallback(
    (time: number, edge: 'start' | 'end', { force }: { force?: boolean } = {}) => {
      if (!onSeek) return;
      const now = Date.now();
      if (!force && now - lastSeekAtRef.current < SEEK_THROTTLE_MS) return;
      lastSeekAtRef.current = now;
      onSeek(time, edge);
    },
    [onSeek],
  );

  const toPercent = useCallback(
    (time: number) => (duration > 0 ? (time / duration) * 100 : 0),
    [duration],
  );

  const toTime = useCallback(
    (pct: number) => snap(Math.max(0, Math.min(duration, (pct / 100) * duration))),
    [duration],
  );

  function handlePointerDown(handle: 'start' | 'end') {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(handle);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const time = toTime(Math.max(0, Math.min(100, pct)));

    if (dragging === 'start') {
      const newStart = Math.min(time, endTime - SNAP_INCREMENT);
      onChange(newStart, endTime);
      fireSeek(newStart, 'start');
    } else {
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

  return (
    <div className={cn('select-none', className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-medium text-zinc-400">
          Trim Clip &middot; {clipDuration.toFixed(1)}s
        </span>
        <button
          onClick={handleReset}
          type="button"
          className="flex items-center gap-1 text-[10px] text-zinc-500 transition-colors hover:text-zinc-300"
          title="Reset to original boundaries"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          Reset
        </button>
      </div>

      <div
        ref={trackRef}
        className="relative h-8 w-full cursor-default rounded-md bg-zinc-800"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="absolute inset-y-0 rounded-sm border-y border-sky-500/40 bg-sky-500/20"
          style={{
            left: `${startPct}%`,
            width: `${endPct - startPct}%`,
          }}
        />

        {/* Handles: 24px wide on mobile (tap target), 12px on sm+. translate-x:-50%
            centers regardless of width. touch-none stops iOS Safari page-scroll. */}
        <div
          className={cn(
            'absolute inset-y-0 z-10 flex w-6 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center rounded-l-sm sm:w-3',
            dragging === 'start' ? 'bg-sky-400' : 'bg-sky-500/70 hover:bg-sky-400',
          )}
          style={{ left: `${startPct}%` }}
          onPointerDown={handlePointerDown('start')}
        >
          <div className="h-3 w-0.5 rounded-full bg-white/60" />
        </div>

        <div
          className={cn(
            'absolute inset-y-0 z-10 flex w-6 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center rounded-r-sm sm:w-3',
            dragging === 'end' ? 'bg-sky-400' : 'bg-sky-500/70 hover:bg-sky-400',
          )}
          style={{ left: `${endPct}%` }}
          onPointerDown={handlePointerDown('end')}
        >
          <div className="h-3 w-0.5 rounded-full bg-white/60" />
        </div>

        <div
          className="absolute -bottom-5 font-mono text-[9px] text-sky-400"
          style={{ left: `${startPct}%`, transform: 'translateX(-50%)' }}
        >
          {formatTimeMs(startTime)}
        </div>

        <div
          className="absolute -bottom-5 font-mono text-[9px] text-sky-400"
          style={{ left: `${endPct}%`, transform: 'translateX(-50%)' }}
        >
          {formatTimeMs(endTime)}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
