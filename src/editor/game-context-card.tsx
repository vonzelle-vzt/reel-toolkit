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

import * as React from 'react';
import { useState } from 'react';
import {
  Activity,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Layers,
  Mic,
  Trophy,
} from 'lucide-react';
import { cn } from './cn.js';

export interface GameContextAnalysis {
  pipeline?: string;
  strategy?: string;
  totalDuration?: number;
  chunksProcessed?: number;
  framesExtracted?: number;
  framesAfterFiltering?: number;
  scenesClassified?: number;
  livePlayPercent?: number;
  pass1Candidates?: number;
  pass2Confirmed?: number;
  processingTimeMs?: number;
  transcriptLength?: number;
  scoreboardReads?: number;
}

export interface GameContextCardProps {
  opponent?: string | null;
  gameDate?: string | Date | null;
  gameScore?: string | null;
  sport?: string | null;
  duration?: number | null;
  analysisData?: GameContextAnalysis | null;
  /** Extra classes on the wrapper. */
  className?: string;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

function formatSport(s: string): string {
  return s
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatGameDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function GameContextCard({
  opponent,
  gameDate,
  gameScore,
  sport,
  duration,
  analysisData,
  className,
}: GameContextCardProps): React.ReactElement | null {
  const [expanded, setExpanded] = useState(false);
  const hasAnalysis = Boolean(analysisData && Object.keys(analysisData).length > 0);
  if (!opponent && !gameScore && !hasAnalysis) return null;

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden',
        className,
      )}
    >
      {/* Header — always visible */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <Trophy className="h-5 w-5 text-orange-400" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-zinc-100">
              {opponent ? `vs ${opponent}` : 'Game Context'}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              {sport ? <span>{formatSport(sport)}</span> : null}
              {gameDate ? <span>· {formatGameDate(gameDate)}</span> : null}
              {duration ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatDuration(duration)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {gameScore ? (
          <div className="ml-3 rounded-md bg-zinc-800 px-3 py-1.5 font-mono text-sm font-bold text-zinc-100">
            {gameScore}
          </div>
        ) : null}
        {hasAnalysis ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            aria-label={expanded ? 'Collapse pipeline details' : 'Expand pipeline details'}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {/* Expanded — AI pipeline metrics */}
      {expanded && hasAnalysis && analysisData ? (
        <div className="border-t border-zinc-800 bg-zinc-950/50 px-4 py-3">
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            {analysisData.pipeline ? (
              <Stat icon={<Activity className="h-3 w-3" />} label="Pipeline" value={analysisData.pipeline} />
            ) : null}
            {analysisData.strategy ? (
              <Stat icon={<Layers className="h-3 w-3" />} label="Strategy" value={analysisData.strategy} />
            ) : null}
            {typeof analysisData.chunksProcessed === 'number' ? (
              <Stat
                icon={<BarChart3 className="h-3 w-3" />}
                label="Chunks"
                value={String(analysisData.chunksProcessed)}
              />
            ) : null}
            {typeof analysisData.framesExtracted === 'number' ? (
              <Stat
                icon={<BarChart3 className="h-3 w-3" />}
                label="Frames"
                value={`${analysisData.framesExtracted}${
                  typeof analysisData.framesAfterFiltering === 'number'
                    ? ` → ${analysisData.framesAfterFiltering}`
                    : ''
                }`}
              />
            ) : null}
            {typeof analysisData.livePlayPercent === 'number' ? (
              <Stat
                icon={<Activity className="h-3 w-3" />}
                label="Live play"
                value={`${Math.round(analysisData.livePlayPercent * 100)}%`}
              />
            ) : null}
            {typeof analysisData.scoreboardReads === 'number' ? (
              <Stat
                icon={<Trophy className="h-3 w-3" />}
                label="Scoreboard"
                value={`${analysisData.scoreboardReads} reads`}
              />
            ) : null}
            {typeof analysisData.transcriptLength === 'number' ? (
              <Stat
                icon={<Mic className="h-3 w-3" />}
                label="Transcript"
                value={`${analysisData.transcriptLength.toLocaleString()} chars`}
              />
            ) : null}
            {typeof analysisData.pass2Confirmed === 'number' ? (
              <Stat
                icon={<FileText className="h-3 w-3" />}
                label="Confirmed plays"
                value={`${analysisData.pass2Confirmed}${
                  typeof analysisData.pass1Candidates === 'number'
                    ? ` of ${analysisData.pass1Candidates}`
                    : ''
                }`}
              />
            ) : null}
            {typeof analysisData.processingTimeMs === 'number' ? (
              <Stat
                icon={<Clock className="h-3 w-3" />}
                label="Processed in"
                value={formatDuration(analysisData.processingTimeMs / 1000)}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-zinc-500">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className="truncate text-zinc-300">{value}</p>
      </div>
    </div>
  );
}
