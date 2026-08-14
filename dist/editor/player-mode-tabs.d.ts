import * as React from 'react';
export type PlayerMode = 'clips' | 'produced' | 'movie' | 'hype';
export interface PlayerModeTabsProps {
    mode: PlayerMode;
    onChange: (next: PlayerMode) => void;
    /** Which modes to render. Default: all four. */
    modes?: ReadonlyArray<PlayerMode>;
    /** Override the default labels. */
    labelOverrides?: Partial<Record<PlayerMode, string>>;
    /** Extra classes on the outer wrapper. */
    className?: string;
}
export declare function PlayerModeTabs({ mode, onChange, modes, labelOverrides, className, }: PlayerModeTabsProps): React.ReactElement;
//# sourceMappingURL=player-mode-tabs.d.ts.map