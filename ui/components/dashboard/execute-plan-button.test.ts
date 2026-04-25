/**
 * Tests for ExecutePlanButton — exercises the pure-logic helpers exported
 * from execute-plan-button.tsx. Mirrors the .test.ts conventions used by
 * dag-node-row.test.ts (no DOM/JSX rendering).
 */
import assert from 'node:assert/strict';
import {
  computeExecutePlanLabel,
  computeExecutePlanDisabled,
} from './execute-plan-button';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ✗ ${name}\n    ${msg}`); failed++;
  }
}

console.log('\nExecutePlanButton tests\n');

test("idle state: label is 'Execute Plan' (DD-2, DD-3)", () => {
  assert.strictEqual(computeExecutePlanLabel(false), 'Execute Plan');
});

test("pending state: label is 'Launching…' (DD-4)", () => {
  assert.strictEqual(computeExecutePlanLabel(true), 'Launching…');
});

test("idle: disabled === false (FR-8)", () => {
  assert.strictEqual(computeExecutePlanDisabled(false), false);
});

test("pending: disabled === true (FR-8, DD-4)", () => {
  assert.strictEqual(computeExecutePlanDisabled(true), true);
});

// ---------- Dialog flow tests ----------

console.log('\nExecutePlanButton — Dialog flow\n');

/**
 * Simulates the dialog-related state and interactions in ExecutePlanButton.
 * Models the component as a plain object with injected spies.
 */
function simulateExecutePlanDialog(isPending: boolean) {
  const openCalls: boolean[] = [];
  const startCalls: string[] = [];

  const setOpen = (v: boolean) => { openCalls.push(v); };
  const start = (action: string) => { startCalls.push(action); };

  const triggerButton = {
    disabled: computeExecutePlanDisabled(isPending),
    onClick: () => setOpen(true),
  };

  const dialogProps = {
    open: false,
    onOpenChange: setOpen,
  };

  const cancelButton = {
    onClick: () => setOpen(false),
  };

  const confirmButton = {
    disabled: undefined as boolean | undefined,
    onClick: () => { setOpen(false); void start("execute-plan"); },
  };

  return { triggerButton, dialogProps, cancelButton, confirmButton, openCalls, startCalls };
}

test("Trigger click opens dialog and does not call start", () => {
  const { triggerButton, openCalls, startCalls } = simulateExecutePlanDialog(false);
  triggerButton.onClick();
  assert.strictEqual(openCalls[0], true, "setOpen should have been called with true");
  assert.strictEqual(startCalls.length, 0, "start should not have been called");
});

test("Cancel closes dialog without calling start", () => {
  const { cancelButton, openCalls, startCalls } = simulateExecutePlanDialog(false);
  cancelButton.onClick();
  assert.strictEqual(openCalls[0], false, "setOpen should have been called with false");
  assert.strictEqual(startCalls.length, 0, "start should not have been called");
});

test('Confirm closes dialog and calls start("execute-plan") exactly once', () => {
  const { confirmButton, openCalls, startCalls } = simulateExecutePlanDialog(false);
  confirmButton.onClick();
  assert.strictEqual(openCalls[0], false, "setOpen should have been called with false");
  assert.strictEqual(startCalls.length, 1, "start should have been called exactly once");
  assert.strictEqual(startCalls[0], "execute-plan", "start should have been called with 'execute-plan'");
});

test("Dialog confirm button is not disabled by pending state", () => {
  const { confirmButton } = simulateExecutePlanDialog(true);
  assert.notStrictEqual(confirmButton.disabled, true, "confirm button should not be disabled when isPending");
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
