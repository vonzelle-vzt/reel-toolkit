import { ArrowUp, Hand, Layers, Lightbulb, Lock, Maximize, MicOff, Settings, Smartphone, Sparkles, Sun, Tag, Target, Video, ZoomOut, } from 'lucide-react';
export const TIP_ICONS = {
    ArrowUp,
    Hand,
    Layers,
    Lightbulb,
    Lock,
    Maximize,
    MicOff,
    Settings,
    Smartphone,
    Sparkles,
    Sun,
    Tag,
    Target,
    Video,
    ZoomOut,
};
export function resolveTipIcon(name) {
    return TIP_ICONS[name] ?? Sparkles;
}
//# sourceMappingURL=icons.js.map