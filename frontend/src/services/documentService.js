/**
 * Local prototype service.
 *
 * This module deliberately does not invent backend routes. Replace the local
 * object-URL operations with your documented Flask/FastAPI API contract when
 * those endpoints and response shapes are finalized.
 */
export const STORAGE_CAP_BYTES = 5 * 1024 ** 3;

export function getDocumentType(filename = '') {
  const extension = filename.split('.').pop()?.toLowerCase() ?? '';
  if (extension === 'pdf') return 'pdf';
  if (/^(png|jpe?g|gif|webp|svg)$/.test(extension)) return 'image';
  if (/^(docx?|txt|md|rtf|odt)$/.test(extension)) return 'doc';
  if (/^(xlsx?|csv|ods)$/.test(extension)) return 'sheet';
  return 'other';
}

export function formatBytes(bytes = 0) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function makeLocalDocument(file, folder = '') {
  const now = Date.now();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${now}-${Math.random().toString(16).slice(2)}`,
    name: file.name,
    type: getDocumentType(file.name),
    size: file.size,
    ts: now,
    date: new Date(now).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
    }),
    folder,
    tags: [],
    archived: false,
    url: URL.createObjectURL(file),
  };
}

export function downloadLocalDocument(document) {
  if (!document?.url) return;
  const anchor = window.document.createElement('a');
  anchor.href = document.url;
  anchor.download = document.name;
  anchor.rel = 'noopener';
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function releaseLocalDocument(document) {
  if (document?.url?.startsWith('blob:')) URL.revokeObjectURL(document.url);
}
