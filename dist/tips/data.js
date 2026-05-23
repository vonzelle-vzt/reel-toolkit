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
export const SHOOTING_TIPS = [
    // ── Rail tips (priority 1-4) ─────────────────────────────────────
    {
        id: 'horizontal',
        icon: 'Smartphone',
        title: 'Hold the phone horizontal',
        body: 'Landscape (16:9) captures the whole field. Vertical phone footage cuts off 60%+ of the action on the sides — coaches and AI both lose context.',
        category: 'framing',
        priority: 1,
    },
    {
        id: 'stable',
        icon: 'Hand',
        title: 'Stay still — both hands or a tripod',
        body: 'Jittery footage makes the AI miss plays. A $15 phone tripod or both hands held steady at chest height is plenty.',
        category: 'framing',
        priority: 2,
    },
    {
        id: 'no-zoom',
        icon: 'ZoomOut',
        title: "Don't zoom in",
        body: 'Phone digital zoom destroys quality. Frame the whole play wide — we auto-zoom the highlights for you when the reel is produced.',
        category: 'framing',
        priority: 3,
    },
    {
        id: 'record-long',
        icon: 'Video',
        title: 'Record long clips, not snippets',
        body: "10 seconds BEFORE and AFTER each play gives the AI the context it needs. Don't stop-start between plays — just keep rolling.",
        category: 'during-play',
        priority: 4,
    },
    // ── Tips page only (priority 5+) ────────────────────────────────
    {
        id: 'resolution',
        icon: 'Settings',
        title: 'Use 1080p or 4K at 30fps',
        body: 'Open your camera Settings → Video. 1080p is the minimum; 4K gives the AI more detail to crop into for highlights. 60fps only if you want slow-motion replays.',
        category: 'settings',
        priority: 5,
    },
    {
        id: 'lock-focus',
        icon: 'Lock',
        title: 'Tap to lock focus on the field',
        body: 'Phones love to refocus when something walks past the lens. Long-press the field in your camera app to lock focus + exposure before kickoff.',
        category: 'settings',
        priority: 6,
    },
    {
        id: 'stand-high',
        icon: 'ArrowUp',
        title: 'Stand higher than the field',
        body: 'Top of the bleachers or a hill behind the bench gives the AI the cleanest angle. Sideline level is the worst spot — you mostly see backs of players.',
        category: 'position',
        priority: 7,
    },
    {
        id: 'midfield',
        icon: 'Target',
        title: 'Stand at midfield, not behind the goal',
        body: 'Midfield sees both directions of play. Behind the goal / endzone misses half the game.',
        category: 'position',
        priority: 8,
    },
    {
        id: 'light',
        icon: 'Sun',
        title: 'Keep the sun behind you',
        body: "Shooting INTO the sun darkens jerseys, blows out highlights, and confuses the AI's scene classifier. Stand with the sun at your back.",
        category: 'position',
        priority: 9,
    },
    {
        id: 'wide',
        icon: 'Maximize',
        title: 'Frame the whole play, not just your athlete',
        body: 'We track your athlete across the frame and auto-zoom the highlight in post. A wide frame gives us room to work — a tight follow-cam misses too much context.',
        category: 'during-play',
        priority: 10,
    },
    {
        id: 'no-talking',
        icon: 'MicOff',
        title: "Don't narrate over big plays",
        body: 'Our AI listens to crowd noise + commentary to detect when the moment matters. Your voice over impact throws off the audio-excitement score.',
        category: 'during-play',
        priority: 11,
    },
    {
        id: 'labels',
        icon: 'Tag',
        title: 'Add the opponent + game date when you upload',
        body: "Game context (opponent, score, date) feeds the AI scorer AND ends up in your reel's caption + recruiting share. Two seconds at upload time, big payoff downstream.",
        category: 'after-game',
        priority: 12,
    },
    {
        id: 'multiple-games',
        icon: 'Layers',
        title: 'Upload multiple games — let the AI pick the best',
        body: 'A 6-game season reel beats a single-game reel for recruiting every time. Upload everything; combine the best moments later.',
        category: 'after-game',
        priority: 13,
    },
];
export const TIP_CATEGORIES = {
    framing: {
        label: 'Framing',
        description: 'How you hold the phone.',
    },
    settings: {
        label: 'Phone settings',
        description: 'Camera app config to set BEFORE you start recording.',
    },
    position: {
        label: 'Where to stand',
        description: "Get the angle that makes our AI's job easier.",
    },
    'during-play': {
        label: 'During the game',
        description: 'What to do while the play is unfolding.',
    },
    'after-game': {
        label: 'After the game',
        description: 'Upload + label workflow that turns clips into recruiting-grade reels.',
    },
};
/** Ordered category list for rendering the Tips page sections. */
export const TIP_CATEGORY_ORDER = [
    'framing',
    'settings',
    'position',
    'during-play',
    'after-game',
];
/** Top-priority tips that surface on the dashboard rail. */
export function getRailTips(limit = 4) {
    return [...SHOOTING_TIPS]
        .sort((a, b) => a.priority - b.priority)
        .slice(0, limit);
}
/** All tips grouped by category, sorted within each category by priority. */
export function getTipsByCategory() {
    const result = {};
    for (const cat of TIP_CATEGORY_ORDER) {
        result[cat] = SHOOTING_TIPS.filter((t) => t.category === cat).sort((a, b) => a.priority - b.priority);
    }
    return result;
}
//# sourceMappingURL=data.js.map