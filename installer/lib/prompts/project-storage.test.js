// installer/lib/prompts/project-storage.test.js

import { describe, it, before, mock } from 'node:test';
import assert from 'node:assert/strict';

// Create mock functions before registering module mocks
const selectMock = mock.fn(async () => 'SCREAMING_CASE');
const inputMock = mock.fn(async () => 'orchestration-projects');
const normalizePathMock = mock.fn((v) => v); // default: pass-through

// Register module mock BEFORE dynamic import of the module under test
mock.module('@inquirer/prompts', {
  namedExports: { select: selectMock, input: inputMock },
});

mock.module('../path-utils.js', {
  namedExports: { normalizePath: normalizePathMock },
});

// Dynamic import after mock registration so the module uses the mocked @inquirer/prompts
const { promptProjectStorage } = await import('./project-storage.js');

describe('promptProjectStorage', () => {
  let result;
  let inputArgs;
  let selectArgs;

  before(async () => {
    selectMock.mock.resetCalls();
    inputMock.mock.resetCalls();
    inputMock.mock.mockImplementation(async () => 'orchestration-projects');
    selectMock.mock.mockImplementation(async () => 'SCREAMING_CASE');

    result = await promptProjectStorage();
    inputArgs = inputMock.mock.calls[0].arguments[0];
    selectArgs = selectMock.mock.calls[0].arguments[0];
  });

  it('calls input() with message "Project storage path"', () => {
    assert.equal(inputArgs.message, 'Project storage path');
  });

  it('calls input() with default "orchestration-projects"', () => {
    assert.equal(inputArgs.default, 'orchestration-projects');
  });

  it('calls select() with message "Project folder naming convention"', () => {
    assert.equal(selectArgs.message, 'Project folder naming convention');
  });

  it('select has exactly 3 choices', () => {
    assert.equal(selectArgs.choices.length, 3);
  });

  it('choices are SCREAMING_CASE, lowercase, numbered', () => {
    const values = selectArgs.choices.map((c) => c.value);
    assert.deepEqual(values, ['SCREAMING_CASE', 'lowercase', 'numbered']);
  });

  it('"SCREAMING_CASE" is the default', () => {
    assert.equal(selectArgs.default, 'SCREAMING_CASE');
  });

  it('returns an object with projectsBasePath and projectsNaming properties', () => {
    assert.ok(Object.hasOwn(result, 'projectsBasePath'), 'result has projectsBasePath property');
    assert.ok(Object.hasOwn(result, 'projectsNaming'), 'result has projectsNaming property');
  });

  it('projectsBasePath is the string returned by input()', () => {
    assert.equal(result.projectsBasePath, 'orchestration-projects');
  });

  it('projectsNaming is the value returned by select()', () => {
    assert.equal(result.projectsNaming, 'SCREAMING_CASE');
  });

  describe('with custom values', () => {
    let customResult;

    before(async () => {
      selectMock.mock.resetCalls();
      inputMock.mock.resetCalls();
      inputMock.mock.mockImplementation(async () => '/custom/path');
      selectMock.mock.mockImplementation(async () => 'lowercase');

      customResult = await promptProjectStorage();
    });

    it('returns projectsBasePath matching input return value', () => {
      assert.equal(customResult.projectsBasePath, '/custom/path');
    });

    it('returns projectsNaming matching select return value', () => {
      assert.equal(customResult.projectsNaming, 'lowercase');
    });
  });
});

describe('promptProjectStorage — normalization', () => {
  before(async () => {
    inputMock.mock.resetCalls();
    selectMock.mock.resetCalls();
    normalizePathMock.mock.resetCalls();
  });

  it('calls normalizePath with the raw input value', async () => {
    inputMock.mock.mockImplementation(async () => '\\docs\\projects\\');
    selectMock.mock.mockImplementation(async () => 'SCREAMING_CASE');
    normalizePathMock.mock.mockImplementation((v) => v.replace(/\\/g, '/').replace(/\/$/, ''));
    await promptProjectStorage();
    assert.equal(normalizePathMock.mock.calls.length, 1);
    assert.equal(normalizePathMock.mock.calls[0].arguments[0], '\\docs\\projects\\');
  });

  it('returns the normalized value as projectsBasePath', async () => {
    inputMock.mock.mockImplementation(async () => '\\docs\\projects\\');
    selectMock.mock.mockImplementation(async () => 'SCREAMING_CASE');
    normalizePathMock.mock.mockImplementation(() => 'docs/projects');
    const result = await promptProjectStorage();
    assert.equal(result.projectsBasePath, 'docs/projects');
  });
});
