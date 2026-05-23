/**
 * TipsPage — full shooting-tips guide. Renders the 4 rail tips as a "rules
 * that matter most" quick-start, then groups the remainder by category.
 *
 * Pure presentation; safe to render in a server component. Pass `ctaHref` +
 * `ctaLabel` to surface an action at the bottom (e.g. "Upload your first
 * game →").
 */
import * as React from 'react';
import { Lightbulb } from 'lucide-react';
import {
  SHOOTING_TIPS,
  TIP_CATEGORIES,
  TIP_CATEGORY_ORDER,
  getRailTips,
  getTipsByCategory,
} from './data.js';
import { resolveTipIcon } from './icons.js';
import type { LinkLikeComponent } from './TipsPanel.js';

export interface TipsPageProps {
  /** Page heading. Default "Tips for great game footage". */
  heading?: string;
  /** Eyebrow above the heading. Default "Shooting guide". */
  eyebrow?: string;
  /** Lede paragraph beneath the heading. */
  intro?: string;
  /** Footer CTA href. When omitted, no CTA renders. */
  ctaHref?: string;
  /** Footer CTA label. Default "Upload your first game →". */
  ctaLabel?: string;
  /** Link component for the CTA. Defaults to plain anchor. */
  linkComponent?: LinkLikeComponent;
  /** Extra classes appended to the outer wrapper. */
  className?: string;
}

export function TipsPage({
  heading = 'Tips for great game footage',
  eyebrow = 'Shooting guide',
  intro = 'The 4 rules that matter most live at the top. The full breakdown by category sits below — phone settings, where to stand, what to do during the game, and the upload workflow that makes the AI work harder for you.',
  ctaHref,
  ctaLabel = 'Upload your first game →',
  linkComponent,
  className = '',
}: TipsPageProps): React.ReactElement {
  const railTips = getRailTips(4);
  const grouped = getTipsByCategory();
  const LinkComponent: LinkLikeComponent = linkComponent ?? 'a';

  // Tips with priority < 5 are the rail tips — render them in the
  // quick-start. The category sections render the remainder (priority ≥ 5).
  const railIds = new Set(railTips.map((t) => t.id));

  return (
    <article className={`mx-auto max-w-4xl ${className}`.trim()}>
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-100 sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
          {intro}
        </p>
      </header>

      {/* ── Quick-start: the 4 rules that matter most ───────────────── */}
      <section
        className="mb-12 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6"
        aria-labelledby="tips-quickstart-heading"
      >
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" aria-hidden="true" />
          <h2
            id="tips-quickstart-heading"
            className="text-sm font-semibold uppercase tracking-widest text-amber-300"
          >
            The 4 rules that matter most
          </h2>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {railTips.map((tip, i) => {
            const Icon = resolveTipIcon(tip.icon);
            return (
              <li
                key={tip.id}
                className="flex gap-3 rounded-lg border border-amber-500/10 bg-zinc-950/40 p-3"
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-300"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                    Rule {i + 1}
                  </p>
                  <p className="mt-0.5 font-semibold text-zinc-100">
                    {tip.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {tip.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Category sections (priority ≥ 5) ────────────────────────── */}
      {TIP_CATEGORY_ORDER.map((cat) => {
        const tips = grouped[cat].filter((t) => !railIds.has(t.id));
        if (tips.length === 0) return null;
        const meta = TIP_CATEGORIES[cat];
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-lg font-semibold text-zinc-100">{meta.label}</h2>
            <p className="mt-1 text-sm text-zinc-400">{meta.description}</p>
            <ul className="mt-4 space-y-3">
              {tips.map((tip) => {
                const Icon = resolveTipIcon(tip.icon);
                return (
                  <li
                    key={tip.id}
                    className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4"
                  >
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-amber-400"
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-100">{tip.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                        {tip.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {/* ── Footer CTA ──────────────────────────────────────────────── */}
      {ctaHref ? (
        <footer className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
          <p className="text-sm text-zinc-300">
            Ready to put these to work? {SHOOTING_TIPS.length} tips, one upload.
          </p>
          <LinkComponent
            href={ctaHref}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
          >
            {ctaLabel}
          </LinkComponent>
        </footer>
      ) : null}
    </article>
  );
}
