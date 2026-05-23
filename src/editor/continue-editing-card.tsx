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
 */
import * as React from 'react';
import { AlertCircle, ArrowRight, Clock, FileEdit, GripVertical } from 'lucide-react';
import { cn } from './cn.js';
import type { LinkLikeComponent } from '../tips/TipsPanel.js';

export type ContinueEditingReasonKind =
  | 'failed'
  | 'reordering'
  | 'pending'
  | 'custom';

export interface ContinueEditingItem {
  /** Stable id for the React key. */
  id: string;
  /** Where the row click navigates. */
  href: string;
  /** Already-cleaned title (sport stripped, type-suffix stripped). */
  displayTitle: string;
  /** Pre-computed Mux thumbnail URL, or null to render the placeholder slot. */
  thumbnailSrc: string | null;
  /** One-line message ("Download failed — tap to retry", etc.). */
  reasonText: string;
  /** Maps to the icon next to the message. */
  reasonKind: ContinueEditingReasonKind;
}

export interface ContinueEditingCardProps {
  items: ContinueEditingItem[];
  /** Section heading. Default "Needs your attention". */
  heading?: string;
  /** Link component (next/link or 'a'). Required. */
  linkComponent: LinkLikeComponent;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

function reasonIcon(kind: ContinueEditingReasonKind): React.ReactElement {
  switch (kind) {
    case 'failed':
      return <AlertCircle className="h-3 w-3" />;
    case 'reordering':
      return <GripVertical className="h-3 w-3" />;
    case 'pending':
      return <Clock className="h-3 w-3" />;
    case 'custom':
    default:
      return <FileEdit className="h-3 w-3" />;
  }
}

export function ContinueEditingCard({
  items,
  heading = 'Needs your attention',
  linkComponent,
  className,
}: ContinueEditingCardProps): React.ReactElement | null {
  if (items.length === 0) return null;
  const LinkComponent = linkComponent;

  return (
    <div
      className={cn(
        'rounded-xl border border-amber-500/20 bg-amber-500/5',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-amber-500/10 px-4 py-3 sm:px-5">
        <FileEdit className="h-4 w-4 text-amber-400" />
        <h2 className="font-medium text-zinc-100">{heading}</h2>
        <span className="ml-auto text-[11px] text-zinc-400">
          {items.length} reel{items.length === 1 ? '' : 's'}
        </span>
      </div>
      <ul className="divide-y divide-amber-500/10">
        {items.map((item) => (
          <li key={item.id}>
            <LinkComponent
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-amber-500/5 sm:px-5"
            >
              {/* Tiny thumbnail */}
              <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-800 sm:h-12 sm:w-20">
                {item.thumbnailSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnailSrc}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {item.displayTitle}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-amber-300">
                  {reasonIcon(item.reasonKind)}
                  {item.reasonText}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-amber-400" />
            </LinkComponent>
          </li>
        ))}
      </ul>
    </div>
  );
}
