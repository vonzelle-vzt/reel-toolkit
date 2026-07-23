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
 *
 * v1.7.0 — optional ACTIONS. The card used to be read-only: it told the user
 * something was broken and offered nowhere to go but the reel page. Consumers
 * can now pass `headerActions` (e.g. "Retry all") and `itemActions` (e.g.
 * "Retry" / "Dismiss"). Both are optional, so existing consumers are
 * unaffected. The card stays presentational — it owns no retry/dismiss logic,
 * it just renders the buttons the app hands it.
 */
import * as React from 'react';
import { AlertCircle, ArrowRight, Clock, FileEdit, GripVertical, Loader2 } from 'lucide-react';
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

/**
 * A button the consumer wants rendered. The card never infers actions from
 * `reasonKind` — the app decides which rows get which buttons.
 */
export interface ContinueEditingAction {
  /** Stable key for the React list. */
  key: string;
  /** Visible label. Keep it short — these sit on a crowded row. */
  label: string;
  onClick: () => void;
  /** Renders a spinner and disables the button. */
  pending?: boolean;
  disabled?: boolean;
  /** `primary` = amber solid, `ghost` = quiet text button. Default `ghost`. */
  variant?: 'primary' | 'ghost';
  /** Optional leading icon (already sized by the consumer, ~12px). */
  icon?: React.ReactNode;
}

export interface ContinueEditingCardProps {
  items: ContinueEditingItem[];
  /** Section heading. Default "Needs your attention". */
  heading?: string;
  /** Link component (next/link or 'a'). Required. */
  linkComponent: LinkLikeComponent;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Buttons in the card header, e.g. "Retry all" / "Clear all". */
  headerActions?: ContinueEditingAction[];
  /**
   * Per-row buttons. Called once per item so the consumer can vary the
   * buttons by row (only FAILED rows get "Retry", say). Return `[]` for none.
   */
  itemActions?: (item: ContinueEditingItem) => ContinueEditingAction[];
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

function ActionButton({ action }: { action: ContinueEditingAction }): React.ReactElement {
  const isPrimary = action.variant === 'primary';
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.pending || action.disabled}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-md px-2 text-[11px] font-medium transition-colors disabled:opacity-50',
        // ≥32px touch target on mobile, tighter on desktop (v6.54 rule).
        'min-h-[32px] py-1.5 sm:min-h-0 sm:py-1',
        isPrimary
          ? 'bg-amber-500/20 text-amber-100 hover:bg-amber-500/30'
          : 'text-zinc-400 hover:bg-amber-500/10 hover:text-zinc-200',
      )}
    >
      {action.pending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        action.icon ?? null
      )}
      {action.label}
    </button>
  );
}

export function ContinueEditingCard({
  items,
  heading = 'Needs your attention',
  linkComponent,
  className,
  headerActions,
  itemActions,
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
      <div className="flex flex-wrap items-center gap-2 border-b border-amber-500/10 px-4 py-3 sm:px-5">
        <FileEdit className="h-4 w-4 shrink-0 text-amber-400" />
        <h2 className="font-medium text-zinc-100">{heading}</h2>
        <span className="text-[11px] text-zinc-400">
          {items.length} reel{items.length === 1 ? '' : 's'}
        </span>
        {headerActions && headerActions.length > 0 ? (
          <div className="ml-auto flex items-center gap-1.5">
            {headerActions.map((action) => (
              <ActionButton key={action.key} action={action} />
            ))}
          </div>
        ) : null}
      </div>
      <ul className="divide-y divide-amber-500/10">
        {items.map((item) => {
          const actions = itemActions?.(item) ?? [];
          return (
            <li
              key={item.id}
              className={cn(
                'transition-colors hover:bg-amber-500/5',
                // Actions STACK below the text on mobile and sit inline on
                // desktop. Inline-at-375px truncated titles to "Jonathan
                // Perry'…" — the buttons ate the row. Stacking gives the
                // title the full width and keeps the labels readable
                // instead of degrading them to bare icons.
                actions.length > 0
                  ? 'flex flex-col gap-1 pb-2 sm:flex-row sm:items-center sm:gap-2 sm:pb-0 sm:pr-3'
                  : 'flex items-center gap-2 pr-2 sm:pr-3',
              )}
            >
              {/* The link covers thumbnail + text only. Action buttons are
                  SIBLINGS, not children — a <button> inside an <a> is invalid
                  HTML and the anchor swallows the tap on mobile. */}
              <LinkComponent
                href={item.href}
                className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 pr-3 sm:pl-5 sm:pr-0"
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

                {actions.length === 0 ? (
                  <ArrowRight className="h-4 w-4 shrink-0 text-amber-400" />
                ) : null}
              </LinkComponent>

              {actions.length > 0 ? (
                <div className="flex shrink-0 items-center justify-end gap-1 pl-4 pr-2 sm:pl-0 sm:pr-0">
                  {actions.map((action) => (
                    <ActionButton key={action.key} action={action} />
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
