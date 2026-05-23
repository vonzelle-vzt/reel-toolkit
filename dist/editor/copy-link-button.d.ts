import * as React from 'react';
export interface CopyLinkButtonProps {
    /** The reel's public share token. Component returns null when null. */
    shareToken: string | null | undefined;
    /** Path prefix between origin and token. Default '/reel/'. */
    pathPrefix?: string;
    /** Fired after a successful clipboard write. Wire to your toast lib. */
    onSuccess?: (url: string) => void;
    /** Fired when the clipboard write fails (typically Safari permissions). */
    onError?: (error: unknown) => void;
    /** Override the wrapper className. Useful for absolute positioning. */
    className?: string;
}
export declare function CopyLinkButton({ shareToken, pathPrefix, onSuccess, onError, className, }: CopyLinkButtonProps): React.ReactElement | null;
//# sourceMappingURL=copy-link-button.d.ts.map