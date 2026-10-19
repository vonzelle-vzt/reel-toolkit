# Rollback

`@vonzelle-vzt/reel-toolkit` is a library, not a deployed service. It has no
Vercel project, no mobile build, and no database migrations. It ships as a
tagged package to GitHub Packages, and NextPlay and FlagPlay adopt it through
a tarball URL pinned to a tag. Rolling back means pointing the consumers back
at the previous tag.

## Roll back in the consumers (fastest, do this first)

The `notify-consumers` workflow opens a PR in each consumer repo for every new
tag. Rolling back is the same change in reverse.

1. In `vonzelle-vzt/nextplay` and `vonzelle-vzt/FlagPlay` (`apps/web/package.json`),
   revert the merged bump PR, or set the `@vonzelle-vzt/reel-toolkit` tarball URL
   back to the last known-good tag, and refresh the lockfile.
2. Merge. Vercel auto-deploys the app with the old toolkit.
3. If the bad build is already live and you can't wait for a rebuild, promote
   the previous deployment instead: Vercel dashboard → the project →
   Deployments → the last good deployment → **Promote to Production**
   (or `vercel promote <deployment-url>`). Then land the revert PR so the next
   deploy doesn't bring the bad version back.
4. Mobile (NextPlay): if the bad toolkit version reached an OTA update,
   roll that update back with `eas update:rollback` (or republish the
   previous update to the same channel). If it reached a store build, halt
   the phased release (App Store Connect → Phased Release → Pause; Play Console
   → Halt rollout) and ship a fixed build.

## Roll back the toolkit itself

- Don't unpublish a version consumers may already have installed. Fix forward:
  revert the offending commit on `main`, bump the version, and tag it
  (`npm run release`). The tag triggers `publish` and `notify-consumers`.
- Mark the bad version so nobody picks it up by accident:
  `npm deprecate @vonzelle-vzt/reel-toolkit@<bad-version> "use <good-version>"`
  (use the GitHub Packages registry).
- `notify-consumers` can be re-run against an older tag from the Actions tab
  (**Run workflow**, enter the tag) to open consumer PRs back at a good version.

## Database migrations

None. This repo has no database or migrations. For migration rollbacks, see the
consumer repos.
