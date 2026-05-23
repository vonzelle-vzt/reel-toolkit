/**
 * Resolve a tip's icon name (string) to a lucide-react component.
 *
 * Tips declare `icon` as a string so the content layer stays plain-data
 * (serializable, no React imports). The panel + page resolve to components
 * at render time via this map. Unknown names fall through to Sparkles so a
 * future tip-author typo never blows up the render.
 */
import type { LucideIcon } from 'lucide-react';
export declare const TIP_ICONS: Record<string, LucideIcon>;
export declare function resolveTipIcon(name: string): LucideIcon;
//# sourceMappingURL=icons.d.ts.map