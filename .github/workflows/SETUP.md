# Workflow setup: `notify-consumers`

One-time configuration so the auto-PR workflow can write to FlagPlay + NextPlay.

## What this workflow does

On every tag push (`v*`) to the toolkit repo, opens an auto-PR on both
`vonzelle-vzt/FlagPlay` and `vonzelle-vzt/nextplay` bumping their
`@vonzelle-vzt/reel-toolkit` tarball URL to the new tag. The PR includes
links to release notes + compare URL so the maintainer can review the
changelog before merging.

After merge, Vercel auto-deploys each app. **No manual `package.json`
edits.** The maintainer's workflow becomes:

```
edit toolkit → git tag vX.Y.Z → push tag → review 2 PRs → merge
```

## Setup steps (one-time)

### 1. Create a fine-grained Personal Access Token

GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.

- **Token name:** `reel-toolkit-consumer-bot`
- **Expiration:** 1 year (set a calendar reminder to rotate)
- **Resource owner:** `vonzelle-vzt`
- **Repository access:** Only select repositories → `FlagPlay`, `nextplay`
- **Permissions:**
  - Contents: **Read and write** (clone repo + push branch)
  - Pull requests: **Read and write** (open PR)
  - Metadata: **Read-only** (auto-included)

Click Generate. Copy the token value.

### 2. Add the token as a secret on the toolkit repo

`vonzelle-vzt/reel-toolkit` → Settings → Secrets and variables → Actions → New repository secret.

- **Name:** `CONSUMER_REPO_PAT`
- **Value:** the token from step 1

### 3. Verify

Push any new tag (e.g. a patch bump `v1.4.1`). Within ~1 minute, both
consumer repos should have an auto-PR titled
`chore(deps): bump @vonzelle-vzt/reel-toolkit to v1.4.1`. Merge to adopt.

## Rotation

When the PAT expires (annually):

1. Regenerate the token at GitHub → Settings → Developer settings.
2. Update the `CONSUMER_REPO_PAT` secret value on the toolkit repo.
3. No code changes needed.

## Disabling temporarily

If the workflow opens too many PRs during a refactor (e.g. you're tagging
v1.5.0, v1.5.1, v1.5.2 rapidly), close the PRs without merging — they're
auto-generated and safe to abandon. Or comment out the `on.push.tags`
trigger in `notify-consumers.yml` for the duration.
