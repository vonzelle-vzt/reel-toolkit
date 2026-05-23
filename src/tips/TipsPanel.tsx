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
import { getRailTips, type ShootingTip } from './data.js';
import { resolveTipIcon } from './icons.js';

export type LinkLikeProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export type LinkLikeComponent =
  | React.ComponentType<LinkLikeProps>
  | 'a';

export interface TipsPanelProps {
  /** Number of tips to surface on the rail. Default 4. */
  limit?: number;
  /** Path the "Full guide" link points at. Default '/tips'. */
  fullGuideHref?: string;
  /** Optional override for the section heading. Default "Shooting tips". */
  heading?: string;
  /** Link component to use (next/link recommended). Defaults to plain anchor. */
  linkComponent?: LinkLikeComponent;
  /** Extra classes appended to the wrapper. */
  className?: string;
}

export function TipsPanel({
  limit = 4,
  fullGuideHref = '/tips',
  heading = 'Shooting tips',
  linkComponent,
  className = '',
}: TipsPanelProps): React.ReactElement {
  const tips = getRailTips(limit);
  const LinkComponent: LinkLikeComponent = linkComponent ?? 'a';

  return (
    <aside
      className={`rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 ${className}`.trim()}
      aria-labelledby="tips-panel-heading"
    >
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-400" aria-hidden="true" />
        <h2
          id="tips-panel-heading"
          className="text-xs font-semibold uppercase tracking-widest text-zinc-300"
        >
          {heading}
        </h2>
      </div>
      <ul className="space-y-3">
        {tips.map((tip: ShootingTip) => {
          const Icon = resolveTipIcon(tip.icon);
          return (
            <li key={tip.id} className="flex gap-3">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-400"
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-100">{tip.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                  {tip.body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 border-t border-zinc-800 pt-3">
        <LinkComponent
          href={fullGuideHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
        >
          Full guide →
        </LinkComponent>
      </div>
    </aside>
  );
}
