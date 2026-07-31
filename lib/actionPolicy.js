const ACTION_TYPES = new Set([
  'CREATE',
  'UPDATE',
  'DELETE',
  'READ',
  'OPEN_BROWSER',
  'NONE',
]);

const CONFIRMATION_TYPES = new Set(['CREATE', 'UPDATE', 'DELETE', 'OPEN_BROWSER']);
const MAX_FILE_NAME_LENGTH = 120;
const MAX_FILE_CONTENT_LENGTH = 100_000;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isBlockedHostname(hostname) {
  const host = hostname.toLowerCase().replace(/\.$/, '');

  if (
    host === 'localhost'
    || host.endsWith('.localhost')
    || host.endsWith('.local')
    || host.endsWith('.lan')
    || host.endsWith('.internal')
    || !host.includes('.')
    || host.includes(':')
  ) {
    return true;
  }

  const octets = host.split('.').map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [first, second] = octets;
  return (
    first === 0
    || first === 10
    || first === 127
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 198 && (second === 18 || second === 19))
    || first >= 224
  );
}

export function normalizeFileName(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const name = value.trim();
  if (
    name.length === 0
    || name.length > MAX_FILE_NAME_LENGTH
    || name === '.'
    || name === '..'
    || /[/\\\u0000-\u001f\u007f\u200e\u200f\u202a-\u202e\u2066-\u2069]/u.test(name)
  ) {
    return null;
  }

  return name;
}

export function findFileByName(files, fileName) {
  const normalizedName = normalizeFileName(fileName);
  if (!Array.isArray(files) || normalizedName === null) {
    return null;
  }

  return files.find(
    (file) => typeof file?.name === 'string'
      && file.name.toLowerCase() === normalizedName.toLowerCase(),
  ) ?? null;
}

export function normalizeBrowserUrl(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 2_048) {
    return null;
  }

  const candidate = /^[a-z][a-z\d+.-]*:/iu.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (
      url.protocol !== 'https:'
      || url.port !== ''
      || url.username !== ''
      || url.password !== ''
      || isBlockedHostname(url.hostname)
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

export function requiresConfirmation(actionType) {
  return CONFIRMATION_TYPES.has(actionType);
}

export function validateAgentAction(action, files = []) {
  if (!isPlainObject(action) || !ACTION_TYPES.has(action.type)) {
    return { ok: false, error: 'Unbekannter oder fehlender Aktionstyp.' };
  }

  if (action.type === 'NONE') {
    return { ok: true, value: { type: 'NONE' } };
  }

  if (action.type === 'OPEN_BROWSER') {
    const url = normalizeBrowserUrl(action.url);
    return url === null
      ? { ok: false, error: 'Die Browser-URL ist nicht erlaubt.' }
      : { ok: true, value: { type: 'OPEN_BROWSER', url } };
  }

  const fileName = normalizeFileName(action.fileName);
  if (fileName === null) {
    return { ok: false, error: 'Der Dateiname ist ungültig.' };
  }

  const existingFile = findFileByName(files, fileName);
  if (action.type === 'CREATE') {
    if (existingFile !== null) {
      return { ok: false, error: 'Eine Datei mit diesem Namen existiert bereits.' };
    }
    if (typeof action.content !== 'string' || action.content.length > MAX_FILE_CONTENT_LENGTH) {
      return { ok: false, error: 'Der neue Dateiinhalt ist ungültig oder zu groß.' };
    }

    return {
      ok: true,
      value: { type: 'CREATE', fileName, content: action.content },
    };
  }

  if (existingFile === null) {
    return { ok: false, error: 'Die Zieldatei existiert nicht.' };
  }

  if (action.type === 'UPDATE') {
    if (typeof action.content !== 'string' || action.content.length > MAX_FILE_CONTENT_LENGTH) {
      return { ok: false, error: 'Der Dateiinhalt ist ungültig oder zu groß.' };
    }

    return {
      ok: true,
      value: { type: 'UPDATE', fileName: existingFile.name, content: action.content },
    };
  }

  return {
    ok: true,
    value: { type: action.type, fileName: existingFile.name },
  };
}
