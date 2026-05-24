/**
 * Map a reel-type enum value to user-facing copy + a Tailwind chip style.
 *
 * Apps that use different vocabulary (FlagPlay calls SOCIAL_VERTICAL
 * "Highlight"; future apps might call it something else) pass `labelOverrides`
 * to swap labels without rebuilding the chip-style logic. Icons + colors stay
 * consistent across consumers — that's what makes the cards recognizable.
 *
 * Palette uses standard Tailwind colors that ship with every install (no
 * custom `accent-*` / `brand-*` / `surface-*` names) so the chip renders
 * identically in NextPlay, FlagPlay, and any future consumer.
 */
import { type LucideIcon } from 'lucide-react';
export interface ReelTypeMeta {
    label: string;
    icon: LucideIcon;
    /**
     * Pre-composed Tailwind class string for a small pill chip
     * (border + bg tint + text color). Designed for the top-left
     * thumbnail badge slot on reel cards.
     */
    chipClass: string;
}
export interface ReelTypeMetaOptions {
    /** Override the default label for any reel type. Keys are the enum string. */
    labelOverrides?: Partial<Record<string, string>>;
    /**
     * Override the default Tailwind chip class for any reel type. Keys are the
     * enum string. Use this to swap the toolkit's default palette
     * (zinc/pink/amber/orange/emerald/green — works in any Tailwind v4 install)
     * for an app's custom palette (e.g. NextPlay's `accent-*` / `brand-*`).
     * Apps that don't pass an override get the toolkit defaults.
     */
    chipClassOverrides?: Partial<Record<string, string>>;
}
export declare function reelTypeMeta(type: string | null | undefined, options?: ReelTypeMetaOptions): ReelTypeMeta;
//# sourceMappingURL=reel-type-meta.d.ts.map