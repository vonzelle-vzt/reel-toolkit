#!/usr/bin/env node
/**
 * One-command toolkit release.
 *
 *   node scripts/release.mjs patch    # 1.4.1 → 1.4.2
 *   node scripts/release.mjs minor    # 1.4.1 → 1.5.0
 *   node scripts/release.mjs major    # 1.4.1 → 2.0.0
 *   node scripts/release.mjs 1.5.0    # explicit version
 *
 * Or via npm:  `npm run release -- patch` (npm passes args after --).
 *
 * Pipeline:
 *   1. Verify working tree is clean (no uncommitted changes)
 *   2. Verify on main branch + up-to-date with origin
 *   3. Bump package.json version
 *   4. `npm run build` → regenerate dist/
 *   5. `git add src/ dist/ package.json`
 *   6. `git commit -m "feat: vX.Y.Z"`
 *   7. `git tag vX.Y.Z`
 *   8. `git push origin main && git push origin vX.Y.Z`
 *
 * The .github/workflows/notify-consumers.yml workflow takes it from there:
 * opens auto-PRs on FlagPlay + NextPlay, auto-merges, Vercel auto-deploys.
 *
 * End-to-end: one `node scripts/release.mjs patch` → ~3 minutes →
 * both consumer apps live on the new toolkit version. Zero manual steps.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PKG = path.join(ROOT, 'package.json');

function run(cmd, opts = {}) {
  console.log(`→ ${cmd}`);
  return execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts });
}

function readPkg() {
  return JSON.parse(readFileSync(PKG, 'utf8'));
}

function bumpVersion(current, kind) {
  if (/^\d+\.\d+\.\d+$/.test(kind)) {
    return kind;
  }
  const [maj, min, pat] = current.split('.').map(Number);
  if (kind === 'patch') return `${maj}.${min}.${pat + 1}`;
  if (kind === 'minor') return `${maj}.${min + 1}.0`;
  if (kind === 'major') return `${maj + 1}.0.0`;
  throw new Error(
    `Unknown bump kind: '${kind}'. Use patch|minor|major or an explicit version like 1.5.0.`,
  );
}

function ensureCleanTree() {
  const out = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
  if (out.trim()) {
    throw new Error(
      `Working tree not clean. Commit or stash changes first:\n${out}`,
    );
  }
}

function ensureMainNotBehind() {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  if (branch !== 'main') {
    throw new Error(`Not on main (current: ${branch}). Release only from main.`);
  }
  run('git fetch origin main --quiet');
  // Local must be at or ahead of origin/main. If origin has commits not in
  // local, the operator should pull first (their work would be lost).
  // Local being ahead of origin is normal — we just committed.
  const behindCount = execSync('git rev-list --count HEAD..origin/main', {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  if (behindCount !== '0') {
    throw new Error(
      `Local main is ${behindCount} commit(s) behind origin/main. Pull first.`,
    );
  }
}

const kind = process.argv[2];
if (!kind) {
  console.error(
    'Usage: node scripts/release.mjs <patch|minor|major|X.Y.Z>',
  );
  process.exit(1);
}

ensureCleanTree();
ensureMainNotBehind();

const pkg = readPkg();
const current = pkg.version;
const next = bumpVersion(current, kind);
console.log(`\nReleasing ${current} → ${next}\n`);

// 1. Build first (verifies tsc clean before we change anything).
run('npm run build');

// 2. Bump version in package.json.
pkg.version = next;
writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log(`✓ package.json bumped to ${next}`);

// 3. Stage + commit + tag + push.
run('git add src dist package.json');
run(`git commit -m "release: v${next}"`);
run(`git tag v${next}`);
run('git push origin main');
run(`git push origin v${next}`);

console.log(`\n✓ v${next} published.`);
console.log(
  `  Watch: https://github.com/vonzelle-vzt/reel-toolkit/actions`,
);
console.log(
  `  In ~3 min: FlagPlay + NextPlay both running v${next}.`,
);
