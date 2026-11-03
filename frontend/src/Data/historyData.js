export const TYPES = {
  'Document Uploaded': { icon: 'upload-cloud', color: '#1b74ff' },
  'Text Extraction Completed': { icon: 'doc', color: '#1b6df0' },
  'Document Completed': { icon: 'globe', color: '#6a4cff' },
  'OCR Processing Started': { icon: 'download', color: '#12bfae' },
  'OCR Processing Failed': { icon: 'scan', color: '#e0553a' },
  'Settings Changed': { icon: 'warning', color: '#f0364a' },
  'Document Deleted': { icon: 'trash', color: '#f0364a' },
};

export const STATUSES = ['Success', 'In Progress', 'Failed', 'Processing'];
export const STATUS_CLASS = {
  Success: 'bg-[#0b8f66]',
  'In Progress': 'bg-[#1b74ff] shadow-[0_0_10px_rgba(27,116,255,.65)]',
  Failed: 'bg-[#f0364a] shadow-[0_0_8px_rgba(240,54,74,.5)]',
  Processing: 'bg-[#6a4cff] shadow-[0_0_10px_rgba(106,76,255,.55)]',
};
export const RANGES = [
  { label: 'Today', days: 1 },
  { label: 'Yesterday', days: 'y' },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];
export const DEFAULT_RANGE = 2;
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const descriptions = {
  'Document Uploaded': (file) => `${file} was uploaded to the system.`,
  'Text Extraction Completed': (file) => `Text extraction finished for ${file}.`,
  'Document Completed': (file) => `Processing finished for ${file}.`,
  'OCR Processing Started': (file) => `OCR processing started for ${file}.`,
  'OCR Processing Failed': (file) => `OCR processing failed for ${file}. The scan could not be read.`,
  'Settings Changed': (file) => `Application setting changed: ${file}.`,
  'Document Deleted': (file) => `${file} was deleted from the system.`,
};

const demoRows = [
  ['EVT-1001', 'DOC-2041', 'Document Uploaded', 'invoice_001.pdf', 'Success', '2023-09-07 14:43:00', 'admin'],
  ['EVT-1002', 'DOC-2041', 'Text Extraction Completed', 'invoice_001.pdf', 'Success', '2023-09-07 14:53:00', 'system'],
  ['EVT-1003', 'DOC-2041', 'Document Completed', 'invoice_001.pdf', 'Success', '2023-09-07 19:17:00', 'system'],
  ['EVT-1004', 'DOC-2042', 'OCR Processing Started', 'scanned_doc.pdf', 'In Progress', '2023-09-07 15:22:00', 'system'],
  ['EVT-1005', 'DOC-2042', 'OCR Processing Failed', 'scanned_doc.pdf', 'Failed', '2023-09-07 19:25:00', 'system'],
  ['EVT-1006', '—', 'Settings Changed', 'Theme changed to light', 'Success', '2023-09-07 16:18:00', 'admin'],
  ['EVT-1007', 'DOC-2043', 'Document Deleted', 'dict_foll.pdf', 'Success', '2023-09-07 17:08:00', 'admin'],
  ['EVT-1008', 'DOC-2044', 'Document Uploaded', 'contract_new.docx', 'Success', '2023-09-07 17:08:00', 'emt_life'],
  ['EVT-1009', 'DOC-2045', 'Document Uploaded', 'report_q3.docx', 'Success', '2023-09-07 17:05:00', 'emt_life'],
  ['EVT-1010', 'DOC-2046', 'OCR Processing Failed', 'scanned_doc2.pdf', 'Failed', '2023-09-07 15:25:00', 'system'],
  ['EVT-1011', 'DOC-2039', 'Document Uploaded', 'passport_scan.pdf', 'Success', '2023-09-06 10:12:00', 'admin'],
  ['EVT-1012', 'DOC-2037', 'OCR Processing Started', 'lease_agreement.pdf', 'Processing', '2023-09-05 09:40:00', 'system'],
  ['EVT-1013', 'DOC-2031', 'Document Deleted', 'old_notes.pdf', 'Success', '2023-08-28 16:02:00', 'admin'],
  ['EVT-1014', '—', 'Settings Changed', 'Notification preferences updated', 'Success', '2023-08-10 11:30:00', 'admin'],
];

export const DEMO_EVENTS = demoRows.map(([id, docId, type, file, status, ts, user]) => ({
  id, docId, type, file, status, ts, user, desc: descriptions[type](file),
}));

export const pad2 = (value) => String(value).padStart(2, '0');
export const dateToString = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
export const shiftDate = (date, amount) => new Date(Date.parse(`${date}T00:00:00Z`) + amount * 864e5).toISOString().slice(0, 10);
export const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
export const validTime = (value) => /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value);

export function getCalendarDefaults(referenceDate) {
  const [year, month] = referenceDate.split('-').map(Number);
  return {
    from: new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 10),
    to: new Date(Date.UTC(year, month + 1, 0)).toISOString().slice(0, 10),
    st: '00:00:00',
    et: '23:59:59',
  };
}

export function presetWindow(index, referenceDate) {
  const range = RANGES[index];
  if (range.days === 'y') {
    const yesterday = shiftDate(referenceDate, -1);
    return [`${yesterday} 00:00:00`, `${yesterday} 23:59:59`];
  }
  return [
    `${shiftDate(referenceDate, -(range.days - 1))} 00:00:00`,
    `${referenceDate} 23:59:59`,
  ];
}
