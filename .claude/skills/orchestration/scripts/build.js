#!/usr/bin/env node
// build.js — Bundles main.ts + all dependencies into a single pipeline.bundle.js
// Run: npm run build
// Output: pipeline.bundle.js (committed to repo as a distribution artifact)

import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  await build({
    entryPoints: [join(__dirname, 'main.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: join(__dirname, 'pipeline.bundle.js'),
    banner: {
      js: '// AUTO-GENERATED — do not edit directly.\n// Source: main.ts + lib/*.ts | Rebuild: npm run build in scripts/\n',
    },
  });
  console.log('✓ pipeline.bundle.js built successfully');
} catch (err) {
  console.error('✗ Build failed:', err.message);
  process.exit(1);
}
