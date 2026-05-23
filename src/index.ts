/**
 * @vonzelle-vzt/reel-toolkit
 *
 * Schema-agnostic video editor primitives shared by NextPlay and FlagPlay.
 *
 * v0.1.0 — types-only skeleton. Each consuming app writes a thin adapter
 * that maps its Prisma rows into these shapes before calling toolkit helpers.
 */

export type { ClipShape, ReelShape } from './types/shapes.js';
export type { ReelType, AspectRatio, ReelStatus, DownloadStatus } from './types/enums.js';
