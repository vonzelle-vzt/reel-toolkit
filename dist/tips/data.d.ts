/**
 * Shooting-tips content shared across consumer apps.
 *
 * Customer pain: families shoot phone-vertical, jumpy, zoomed-in footage.
 * The AI pipeline does heroic work but garbage in = garbage out. Surfacing
 * these tips raises the floor on every reel by changing the raw inputs.
 *
 * `priority` drives rail visibility: the lowest priority N (default 4) render
 * on the dashboard rail. Everything ≥5 only renders on the full Tips page.
 * Add a new tip by appending to SHOOTING_TIPS — the panel + page auto-update.
 *
 * Schema-agnostic; no DB, no React, safe in any runtime.
 */
export type TipCategory = 'framing' | 'settings' | 'position' | 'during-play' | 'after-game';
export interface ShootingTip {
    id: string;
    /** lucide-react icon name as a string — resolved at render via icons.ts map */
    icon: string;
    title: string;
    body: string;
    category: TipCategory;
    /** lower = more important; rail surfaces priority 1..N */
    priority: number;
}
export declare const SHOOTING_TIPS: ShootingTip[];
export interface TipCategoryMeta {
    label: string;
    description: string;
}
export declare const TIP_CATEGORIES: Record<TipCategory, TipCategoryMeta>;
/** Ordered category list for rendering the Tips page sections. */
export declare const TIP_CATEGORY_ORDER: TipCategory[];
/** Top-priority tips that surface on the dashboard rail. */
export declare function getRailTips(limit?: number): ShootingTip[];
/** All tips grouped by category, sorted within each category by priority. */
export declare function getTipsByCategory(): Record<TipCategory, ShootingTip[]>;
//# sourceMappingURL=data.d.ts.map