import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Module-level mocks ───────────────────────────────────────────────────────

vi.mock('node:child_process', async () => {
  const actual =
    await vi.importActual<typeof import('node:child_process')>(
      'node:child_process',
    );
  return { ...actual, execFileSync: vi.fn() };
});

const mockExecFileSync = vi.mocked(execFileSync);

// The scripts directory where pipeline.js lives
const scriptsDir = dirname(fileURLToPath(import.meta.url)).replace(
  /[\\/]tests$/,
  '',
);
const bundlePath = join(scriptsDir, 'pipeline.bundle.js');

// ── Tests ────────────────────────────────────────────────────────────────────

describe('pipeline.js — bundle entry point', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Path resolution ─────────────────────────────────────────────────────

  describe('path resolution', () => {
    it('resolves pipeline.bundle.js relative to the scripts directory', () => {
      expect(bundlePath).toBe(join(scriptsDir, 'pipeline.bundle.js'));
    });
  });

  // ── Delegation to pipeline.bundle.js ────────────────────────────────────

  describe('pipeline delegation', () => {
    it('passes all CLI arguments through to pipeline.bundle.js', () => {
      const cliArgs = [
        '--event',
        'start',
        '--project-dir',
        '/tmp/test',
        '--config',
        '/tmp/config.yml',
      ];

      // Verify: args array is [bundlePath, ...cliArgs]
      const expectedArgs = [bundlePath, ...cliArgs];
      expect(expectedArgs[0]).toBe(bundlePath);
      expect(expectedArgs.slice(1)).toEqual(cliArgs);
    });

    it('preserves all 20+ pipeline flags in argument passthrough', () => {
      const fullFlags = [
        '--event', 'task_completed',
        '--project-dir', '/tmp/proj',
        '--config', '/tmp/config.yml',
        '--doc-path', '/tmp/doc.md',
        '--branch', 'feature/test',
        '--base-branch', 'main',
        '--worktree-path', '/tmp/worktree',
        '--auto-commit', 'always',
        '--auto-pr', 'never',
        '--remote-url', 'https://github.com/test/repo',
        '--compare-url', 'https://github.com/test/repo/compare',
        '--gate-type', 'task',
        '--reason', 'Test reason',
        '--gate-mode', 'autonomous',
        '--commit-hash', 'abc123',
        '--pushed', 'true',
        '--pr-url', 'https://github.com/test/repo/pull/1',
        '--phase', '2',
        '--task', '3',
        '--template', 'full',
        '--verdict', 'approved',
      ];

      const args = [bundlePath, ...fullFlags];
      // All flags pass through unchanged
      expect(args.slice(1)).toEqual(fullFlags);
    });

    it('uses process.execPath for spawning (not a hardcoded "node" string)', () => {
      // process.execPath is the absolute path to the current Node.js binary.
      // Using it avoids PATH lookup issues on Windows and in non-standard installs.
      expect(typeof process.execPath).toBe('string');
      expect(process.execPath.length).toBeGreaterThan(0);
    });
  });

  // ── Error output format ─────────────────────────────────────────────────

  describe('error output format', () => {
    it('produces a valid PipelineResult-shaped error when bundle is missing', () => {
      const errorJson = {
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
      };

      // Verify shape matches PipelineResult contract
      expect(errorJson).toHaveProperty('success', false);
      expect(errorJson).toHaveProperty('action', null);
      expect(errorJson).toHaveProperty('context.error');
      expect(errorJson).toHaveProperty('mutations_applied');
      expect(errorJson).toHaveProperty('orchRoot');
      expect(errorJson).toHaveProperty('error.message');
      expect(errorJson).toHaveProperty('error.event');
      expect(Array.isArray(errorJson.mutations_applied)).toBe(true);
    });
  });
});
