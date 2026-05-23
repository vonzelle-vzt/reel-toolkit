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
import { Calendar, ClipboardList, Film, GraduationCap, Sparkles, } from 'lucide-react';
export function reelTypeMeta(type, options = {}) {
    const override = type ? options.labelOverrides?.[type] : undefined;
    switch (type) {
        case 'SOCIAL_VERTICAL':
            return {
                label: override ?? 'Highlight',
                icon: Sparkles,
                chipClass: 'border-pink-500/30 bg-pink-500/15 text-pink-200',
            };
        case 'SOCIAL_HORIZONTAL':
            return {
                label: override ?? 'Highlight',
                icon: Sparkles,
                chipClass: 'border-purple-500/30 bg-purple-500/15 text-purple-200',
            };
        case 'RECRUITING':
            return {
                label: override ?? 'Recruiting Highlight',
                icon: GraduationCap,
                chipClass: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
            };
        case 'FULL_GAME':
        case 'FULL_GAME_EDIT':
            return {
                label: override ?? 'Game Tape',
                icon: Film,
                chipClass: 'border-orange-500/30 bg-orange-500/15 text-orange-200',
            };
        case 'CUSTOM':
        case 'COACH_FILM':
            return {
                label: override ?? 'Coach Film',
                icon: ClipboardList,
                chipClass: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
            };
        case 'SEASON_RECAP':
            return {
                label: override ?? 'Season Recap',
                icon: Calendar,
                chipClass: 'border-green-500/30 bg-green-500/15 text-green-200',
            };
        default:
            return {
                label: override ?? 'Reel',
                icon: Sparkles,
                chipClass: 'border-zinc-700 bg-zinc-800/80 text-zinc-300',
            };
    }
}
//# sourceMappingURL=reel-type-meta.js.map