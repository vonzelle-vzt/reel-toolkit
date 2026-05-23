/**
 * Tips module — shooting-tips content + React rail + full-guide page.
 *
 * Peer deps required by consumers:
 *   - react ^19
 *   - lucide-react (any version ≥ 0.300)
 *   - tailwindcss (the components use Tailwind class names)
 *
 * Apps that only want the data can import from `./data.js` directly without
 * pulling in React.
 */
export { SHOOTING_TIPS, TIP_CATEGORIES, TIP_CATEGORY_ORDER, getRailTips, getTipsByCategory, } from './data.js';
export { TIP_ICONS, resolveTipIcon } from './icons.js';
export { TipsPanel } from './TipsPanel.js';
export { TipsPage } from './TipsPage.js';
//# sourceMappingURL=index.js.map