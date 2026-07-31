import assert from 'node:assert/strict';
import test from 'node:test';

import {
  findFileByName,
  normalizeBrowserUrl,
  normalizeFileName,
  requiresConfirmation,
  validateAgentAction,
} from '../lib/actionPolicy.js';

const files = [
  { id: 'one', name: 'Notes.md', content: 'hello' },
  { id: 'two', name: 'Roadmap.txt', content: 'next' },
];

test('normalizes safe file names and rejects path-like names', () => {
  assert.equal(normalizeFileName('  Notes.md  '), 'Notes.md');
  assert.equal(normalizeFileName('../secret.txt'), null);
  assert.equal(normalizeFileName('folder/file.txt'), null);
  assert.equal(normalizeFileName('bad\u0000name'), null);
  assert.equal(normalizeFileName('invoice\u202Efdp.exe'), null);
});

test('finds existing files case-insensitively without crashing on malformed input', () => {
  assert.equal(findFileByName(files, 'notes.MD')?.id, 'one');
  assert.equal(findFileByName(files, undefined), null);
  assert.equal(findFileByName(null, 'Notes.md'), null);
});

test('normalizes allow-listed HTTPS destinations only', () => {
  assert.equal(normalizeBrowserUrl('example.com/path'), 'https://example.com/path');
  assert.equal(normalizeBrowserUrl('https://example.com'), 'https://example.com/');
  assert.equal(normalizeBrowserUrl('http://example.com'), null);
  assert.equal(normalizeBrowserUrl('javascript:alert(1)'), null);
  assert.equal(normalizeBrowserUrl('https://user:pass@example.com'), null);
  assert.equal(normalizeBrowserUrl('https://example.com:8443'), null);
  assert.equal(normalizeBrowserUrl('https://example.com:443/path'), 'https://example.com/path');
  assert.equal(normalizeBrowserUrl('https://localhost:3000'), null);
  assert.equal(normalizeBrowserUrl('https://127.0.0.1'), null);
  assert.equal(normalizeBrowserUrl('https://192.168.1.2'), null);
  assert.equal(normalizeBrowserUrl('https://[::1]'), null);
});

test('validates create and update payloads against existing files', () => {
  assert.deepEqual(
    validateAgentAction({ type: 'CREATE', fileName: 'New.md', content: 'safe' }, files),
    {
      ok: true,
      value: { type: 'CREATE', fileName: 'New.md', content: 'safe' },
    },
  );

  assert.equal(
    validateAgentAction({ type: 'CREATE', fileName: 'notes.md', content: 'duplicate' }, files).ok,
    false,
  );

  assert.deepEqual(
    validateAgentAction({ type: 'UPDATE', fileName: 'notes.md', content: 'changed' }, files),
    {
      ok: true,
      value: { type: 'UPDATE', fileName: 'Notes.md', content: 'changed' },
    },
  );

  assert.equal(
    validateAgentAction({ type: 'UPDATE', fileName: 'missing.txt', content: 'changed' }, files).ok,
    false,
  );
});

test('validates read, delete, browser, and no-op actions', () => {
  assert.deepEqual(validateAgentAction({ type: 'READ', fileName: 'Notes.md' }, files), {
    ok: true,
    value: { type: 'READ', fileName: 'Notes.md' },
  });
  assert.deepEqual(validateAgentAction({ type: 'DELETE', fileName: 'Roadmap.txt' }, files), {
    ok: true,
    value: { type: 'DELETE', fileName: 'Roadmap.txt' },
  });
  assert.deepEqual(validateAgentAction({ type: 'OPEN_BROWSER', url: 'example.com' }, files), {
    ok: true,
    value: { type: 'OPEN_BROWSER', url: 'https://example.com/' },
  });
  assert.deepEqual(validateAgentAction({ type: 'NONE' }, files), {
    ok: true,
    value: { type: 'NONE' },
  });
  assert.equal(validateAgentAction({ type: 'EXECUTE', fileName: 'Notes.md' }, files).ok, false);
});

test('requires confirmation for every model-selected side effect', () => {
  for (const actionType of ['CREATE', 'UPDATE', 'DELETE', 'OPEN_BROWSER']) {
    assert.equal(requiresConfirmation(actionType), true);
  }
  assert.equal(requiresConfirmation('READ'), false);
  assert.equal(requiresConfirmation('NONE'), false);
});
