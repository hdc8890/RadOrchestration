#!/usr/bin/env node
// pipeline.js — entry point for the orchestration pipeline engine
//
// Delegates all arguments to the pre-built pipeline.bundle.js.
// No npm install or compilation required at runtime.
//
// Usage:
//   node {orchRoot}/skills/orchestration/scripts/pipeline.js --event <event> --project-dir <dir> [...]

import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundlePath = join(__dirname, 'pipeline.bundle.js');

if (!existsSync(bundlePath)) {
  process.stderr.write(
    '[pipeline] pipeline.bundle.js not found — run npm run build in the scripts directory\n',
  );
  process.stdout.write(
    JSON.stringify(
      {
        success: false,
        action: null,
        context: { error: 'Pipeline bundle not found' },
        mutations_applied: [],
        orchRoot: '.claude',
        error: {
          message:
            'pipeline.bundle.js not found — run npm run build in the scripts directory',
          event: 'unknown',
        },
      },
      null,
      2,
    ) + '\n',
  );
  process.exit(1);
}

// ── Delegate to pipeline.bundle.js ───────────────────────────────────────────

try {
  const result = execFileSync(
    process.execPath,
    [bundlePath, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'inherit'],
    },
  );
  process.stdout.write(result);
} catch (err) {
  if (err.stdout) process.stdout.write(err.stdout);
  process.exitCode = err.status ?? 1;
}

