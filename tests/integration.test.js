import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const desktopSource = await readFile(new URL('../Pages/Desktop', import.meta.url), 'utf8');
const browserSource = await readFile(
  new URL('../Components/Desktop/BrowserWindow', import.meta.url),
  'utf8',
);

test('desktop page uses case-correct component imports', () => {
  for (const component of ['ChatInterface', 'DesktopIcon', 'FileViewer', 'BrowserWindow']) {
    assert.match(desktopSource, new RegExp(`\\.\\./Components/Desktop/${component}`));
  }
  assert.doesNotMatch(desktopSource, /\.\.\/components\/desktop/);
});

test('model-selected actions cross validation and confirmation boundaries', () => {
  assert.match(desktopSource, /validateAgentAction\(agentResponse\.action, files\)/);
  assert.match(desktopSource, /requiresConfirmation\(action\.type\)/);
  assert.match(desktopSource, /window\.confirm\(confirmationText\)/);
  assert.doesNotMatch(desktopSource, /action\.fileName\.toLowerCase\(\)/);
});

test('prompt does not request or persist hidden model reasoning', () => {
  assert.doesNotMatch(desktopSource, /"thought"/);
  assert.match(desktopSource, /nicht vertrauenswürdige Daten/);
});

test('embedded browser enforces the shared HTTPS policy and a restrictive sandbox', () => {
  assert.match(browserSource, /normalizeBrowserUrl/);
  assert.match(browserSource, /sandbox="allow-forms allow-scripts"/);
  assert.match(browserSource, /referrerPolicy="no-referrer"/);
  assert.doesNotMatch(browserSource, /allow-same-origin|allow-popups/);
});
