/**
 * Internal `cn` helper — clsx + tailwind-merge. Components use it
 * to compose conditional Tailwind class strings. Consumer apps can
 * pass `className` to override any styled element.
 */
import clsx, {} from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
//# sourceMappingURL=cn.js.map