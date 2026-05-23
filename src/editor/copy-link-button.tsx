/**
 * CopyLinkButton — one-tap copy of a reel's share URL.
 *
 * Schema-agnostic. The app passes a `shareToken` (the reel's
 * publicly-shareable URL slug) and the button assembles
 * `${origin}${pathPrefix}${shareToken}` (default pathPrefix `/reel/`).
 *
 * Toast handling is decoupled: pass `onSuccess` / `onError` callbacks to
 * wire up Sonner, react-toastify, or any other library. Without callbacks
 * the button still gives visual feedback (icon swap to Check for 2s).
 *
 * Stops event propagation so a parent card `<Link>` doesn't navigate.
 */
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { cn } from './cn.js';

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

export function CopyLinkButton({
  shareToken,
  pathPrefix = '/reel/',
  onSuccess,
  onError,
  className,
}: CopyLinkButtonProps): React.ReactElement | null {
  const [copied, setCopied] = useState(false);

  if (!shareToken) return null;

  async function handleClick(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${pathPrefix}${shareToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onSuccess?.(url);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      onError?.(err);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Copy share link"
      title="Copy share link"
      className={cn(
        'absolute bottom-2 right-2 z-20 flex h-7 items-center gap-1 rounded-full bg-black/70 px-2.5 text-[10px] font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:bg-amber-500 sm:h-6 sm:opacity-0 sm:group-hover:opacity-100',
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
      {copied ? 'Copied' : 'Share link'}
    </button>
  );
}
