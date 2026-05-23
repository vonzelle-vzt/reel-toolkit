'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import MuxPlayer from '@mux/mux-player-react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Repeat,
} from 'lucide-react';
import { cn } from './cn.js';

export interface EnhancedVideoPlayerProps {
  playbackId: string;
  startTime?: number;
  endTime?: number;
  className?: string;
  onTimeUpdate?: (time: number) => void;
}

/**
 * Imperative handle so editor widgets (ClipTrimmer, etc.) can drive
 * playback without round-tripping through React state. `seekTo` pauses
 * by default — a dragging user doesn't want playback fighting their
 * frame-picking.
 */
export interface EnhancedVideoPlayerHandle {
  seekTo: (time: number, opts?: { pause?: boolean }) => void;
  pause: () => void;
  play: () => void;
}

const FRAME_STEP = 1 / 30;
const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2] as const;

function formatTimeMs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(3, '0')}`;
}

export const EnhancedVideoPlayer = forwardRef<EnhancedVideoPlayerHandle, EnhancedVideoPlayerProps>(
  function EnhancedVideoPlayer(
    { playbackId, startTime, endTime, className, onTimeUpdate },
    ref,
  ) {
    const playerRef = useRef<HTMLElement & { media?: HTMLMediaElement }>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLooping, setIsLooping] = useState(false);

    const getMedia = useCallback((): HTMLMediaElement | null => {
      const el = playerRef.current;
      if (!el) return null;
      return (
        (el as unknown as { media?: { nativeEl?: HTMLMediaElement } }).media?.nativeEl ??
        el.querySelector('video') ??
        null
      );
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        seekTo: (time, opts) => {
          const media = getMedia();
          if (!media) return;
          const pause = opts?.pause ?? true;
          if (pause && !media.paused) {
            media.pause();
            setIsPlaying(false);
          }
          const clamped = Math.max(0, Math.min(media.duration || time, time));
          media.currentTime = clamped;
          setCurrentTime(clamped);
        },
        pause: () => {
          const media = getMedia();
          if (!media) return;
          media.pause();
          setIsPlaying(false);
        },
        play: () => {
          const media = getMedia();
          if (!media) return;
          void media.play();
          setIsPlaying(true);
        },
      }),
      [getMedia],
    );

    useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        const media = getMedia();
        if (!media) return;

        switch (e.key) {
          case ' ':
            e.preventDefault();
            if (media.paused) {
              void media.play();
            } else {
              media.pause();
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            media.pause();
            media.currentTime = Math.max(0, media.currentTime - FRAME_STEP);
            break;
          case 'ArrowRight':
            e.preventDefault();
            media.pause();
            media.currentTime = Math.min(media.duration, media.currentTime + FRAME_STEP);
            break;
          case 'j':
          case 'J':
            media.playbackRate = 0.5;
            setSpeed(0.5);
            break;
          case 'k':
          case 'K':
            media.pause();
            break;
          case 'l':
          case 'L':
            media.playbackRate = 2;
            setSpeed(2);
            break;
        }
      }

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [getMedia]);

    useEffect(() => {
      if (!isLooping || startTime == null || endTime == null) return;

      const interval = setInterval(() => {
        const media = getMedia();
        if (!media) return;
        if (media.currentTime >= endTime) {
          media.currentTime = startTime;
          void media.play();
        }
      }, 100);

      return () => clearInterval(interval);
    }, [isLooping, startTime, endTime, getMedia]);

    function handleTimeUpdate() {
      const media = getMedia();
      if (!media) return;
      setCurrentTime(media.currentTime);
      setDuration(media.duration || 0);
      onTimeUpdate?.(media.currentTime);
    }

    function handlePlayPause() {
      const media = getMedia();
      if (!media) return;
      if (media.paused) {
        void media.play();
        setIsPlaying(true);
      } else {
        media.pause();
        setIsPlaying(false);
      }
    }

    function handleStepFrame(direction: -1 | 1) {
      const media = getMedia();
      if (!media) return;
      media.pause();
      setIsPlaying(false);
      media.currentTime = Math.max(
        0,
        Math.min(media.duration, media.currentTime + direction * FRAME_STEP),
      );
    }

    function handleSpeedChange(newSpeed: number) {
      const media = getMedia();
      if (!media) return;
      media.playbackRate = newSpeed;
      setSpeed(newSpeed);
    }

    function handleVolumeChange(val: number) {
      const media = getMedia();
      if (!media) return;
      media.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    }

    function handleToggleMute() {
      const media = getMedia();
      if (!media) return;
      media.muted = !media.muted;
      setIsMuted(media.muted);
    }

    function handleFullscreen() {
      const el = playerRef.current;
      if (!el) return;
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      } else {
        void el.requestFullscreen?.();
      }
    }

    function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
      const media = getMedia();
      if (!media) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      media.currentTime = pct * media.duration;
    }

    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
    const clipStartPct = startTime != null && duration > 0 ? (startTime / duration) * 100 : null;
    const clipEndPct = endTime != null && duration > 0 ? (endTime / duration) * 100 : null;

    return (
      <div className={cn('flex flex-col', className)}>
        <div className="relative overflow-hidden rounded-t-lg bg-zinc-950">
          <MuxPlayer
            ref={playerRef as React.Ref<never>}
            playbackId={playbackId}
            streamType="on-demand"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={() => {
              const media = getMedia();
              if (media) setDuration(media.duration);
            }}
            style={{
              width: '100%',
              aspectRatio: '16/9',
              '--controls': 'none' as string,
              '--media-object-fit': 'contain' as string,
            }}
            className="block"
          />
        </div>

        <div className="relative h-2 cursor-pointer bg-zinc-800" onClick={handleProgressClick}>
          {clipStartPct != null && clipEndPct != null && (
            <div
              className="absolute inset-y-0 bg-sky-500/25"
              style={{
                left: `${clipStartPct}%`,
                width: `${clipEndPct - clipStartPct}%`,
              }}
            />
          )}
          <div
            className="absolute inset-y-0 left-0 bg-pink-500 transition-[width] duration-75"
            style={{ width: `${progressPct}%` }}
          />
          {clipStartPct != null && (
            <div
              className="absolute inset-y-0 w-0.5 bg-sky-400"
              style={{ left: `${clipStartPct}%` }}
            />
          )}
          {clipEndPct != null && (
            <div
              className="absolute inset-y-0 w-0.5 bg-sky-400"
              style={{ left: `${clipEndPct}%` }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 rounded-b-lg border border-t-0 border-zinc-700 bg-zinc-900 px-3 py-2">
          <button
            onClick={handlePlayPause}
            type="button"
            className="rounded p-1.5 text-zinc-200 hover:bg-zinc-800"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={() => handleStepFrame(-1)}
            type="button"
            className="rounded p-1.5 text-zinc-300 hover:bg-zinc-800"
            title="Step back 1 frame (Left)"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleStepFrame(1)}
            type="button"
            className="rounded p-1.5 text-zinc-300 hover:bg-zinc-800"
            title="Step forward 1 frame (Right)"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>

          <span className="min-w-[110px] font-mono text-xs text-zinc-300">
            {formatTimeMs(currentTime)} / {formatTimeMs(duration)}
          </span>

          <div className="flex items-center gap-0.5">
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                type="button"
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                  speed === s
                    ? 'bg-pink-600 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
                )}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {startTime != null && endTime != null && (
            <button
              onClick={() => setIsLooping(!isLooping)}
              type="button"
              className={cn(
                'rounded p-1.5 transition-colors',
                isLooping
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-zinc-400 hover:bg-zinc-800',
              )}
              title="Loop clip preview"
            >
              <Repeat className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={handleToggleMute}
            type="button"
            className="rounded p-1.5 text-zinc-300 hover:bg-zinc-800"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="h-1 w-16 accent-pink-400"
          />

          <button
            onClick={handleFullscreen}
            type="button"
            className="rounded p-1.5 text-zinc-300 hover:bg-zinc-800"
            title="Fullscreen"
          >
            <Maximize className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  },
);
