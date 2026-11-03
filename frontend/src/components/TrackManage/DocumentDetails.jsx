import {
  Archive, Download, ExternalLink, File, FileImage, FileSpreadsheet,
  FileText, Folder, Pencil, Tag, Trash2, X,
} from 'lucide-react';
import { formatBytes } from '../../services/documentService.js';

const fileIcons = { pdf: FileText, image: FileImage, doc: FileText, sheet: FileSpreadsheet, other: File };
const tagTone = {
  violet: 'bg-violet-600', rose: 'bg-rose-500', emerald: 'bg-emerald-600',
  amber: 'bg-amber-500', sky: 'bg-sky-600', pink: 'bg-pink-600',
};
const actionButton = 'inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border border-[#1c48a0] bg-[#1d6bff]/10 px-2.5 py-2 text-xs text-[#a0b6e1] transition hover:bg-[#1d6bff]/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1d6bff] disabled:pointer-events-none disabled:opacity-35 sm:text-sm [.light_&]:border-[#c5d4e8] [.light_&]:bg-[#f1f6ff] [.light_&]:text-[#304563] [.light_&]:hover:bg-[#e2edff] [.light_&]:hover:text-[#17365f]';

export default function DocumentDetails({
  selectedDocuments,
  tags,
  isMobileOpen,
  onClose,
  onDownload,
  onRename,
  onMove,
  onArchive,
  onDelete,
  onManageTags,
  onOpen,
}) {
  const count = selectedDocuments.length;
  const document = selectedDocuments[0];
  const Icon = document ? (fileIcons[document.type] ?? File) : FileText;
  const single = count === 1;
  const disabled = count === 0;

  return (
    <aside
      aria-label="Document details"
      className={`custom-scrollbar fixed inset-y-0 right-0 z-40 w-80 max-w-[90vw] overflow-y-auto border-l border-[#1c48a0] bg-[#03102e] p-4 text-white shadow-xl shadow-black/20 transition-transform duration-200 ease-out xl:static xl:z-auto xl:w-auto xl:max-w-none xl:translate-x-0 xl:rounded-2xl xl:border xl:bg-[#051840]/60 [.light_&]:border-[#c9d8f0] [.light_&]:bg-white [.light_&]:text-[#172b4d] [.light_&]:shadow-[0_5px_18px_rgba(24,50,90,.08)] ${isMobileOpen ? 'visible translate-x-0' : 'invisible translate-x-full xl:visible'}`}
    >
      <div className="flex items-center justify-between border-b border-[#1c48a0] pb-3 [.light_&]:border-[#d4dfef]">
        <h2 className="text-lg font-semibold">Document Details</h2>
        <button type="button" onClick={onClose} aria-label="Close document details" className="rounded-sm p-1 transition hover:bg-[#1d6bff]/20 [.light_&]:text-[#526783]">
          <X className="h-5 w-5" />
        </button>
      </div>

      {!count ? (
        <div className="py-8 text-center">
          <FileText className="mx-auto mb-3 h-14 w-14 text-indigo-400" />
          <p className="font-semibold">No document selected</p>
          <p className="mx-auto mt-1 max-w-[16rem] text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">Select a document from the list to view its details.</p>
        </div>
      ) : count > 1 ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center text-indigo-400">
            <FileText className="h-10 w-10" />
          </div>
          <p className="font-semibold">{count} documents selected</p>
          <p className="text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">{formatBytes(selectedDocuments.reduce((total, item) => total + item.size, 0))} total</p>
        </div>
      ) : (
        <div className="space-y-2 py-4 text-sm">
          {document.type === 'image' ? (
            <img src={document.url} alt={`Preview of ${document.name}`} className="mx-auto max-h-40 max-w-full rounded-lg object-contain" />
          ) : (
            <Icon className="mx-auto h-14 w-14 text-indigo-400" />
          )}
          <p className="break-words text-center font-semibold">{document.name}</p>
          <dl className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-2 gap-y-1 text-[#a0b6e1] [.light_&]:text-[#526783]">
            <dt>Type</dt><dd className="uppercase text-white [.light_&]:text-[#263b59]">{document.type}</dd>
            <dt>Size</dt><dd className="text-white [.light_&]:text-[#263b59]">{formatBytes(document.size)}</dd>
            <dt>Uploaded</dt><dd className="text-white [.light_&]:text-[#263b59]">{document.date}</dd>
            <dt>Folder</dt><dd className="break-words text-white [.light_&]:text-[#263b59]">{document.folder || '—'}</dd>
            <dt>Tags</dt>
            <dd className="flex flex-wrap gap-1">
              {document.tags.length ? document.tags.map((tagName) => {
                const tag = tags.find((item) => item.name === tagName);
                return tag ? <span key={tagName} className={`rounded-full px-2 py-0.5 text-xs text-white ${tagTone[tag.tone] ?? 'bg-sky-600'}`}>{tagName}</span> : null;
              }) : '—'}
            </dd>
          </dl>
        </div>
      )}

      <section className="mt-2 border-t border-[#1c48a0] pt-3 [.light_&]:border-[#d4dfef]">
        <h3 className="font-semibold">File Actions</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" disabled={disabled} onClick={onDownload} className={actionButton}><Download className="h-4 w-4 shrink-0" />Download</button>
          <button type="button" disabled={!single} onClick={onRename} className={actionButton}><Pencil className="h-4 w-4 shrink-0" />Rename</button>
          <button type="button" disabled={disabled} onClick={onMove} className={actionButton}><Folder className="h-4 w-4 shrink-0" />Move to Folder</button>
          <button type="button" disabled={disabled} onClick={onArchive} className={actionButton}><Archive className="h-4 w-4 shrink-0" />{document?.archived ? 'Restore' : 'Archive'}</button>
          <button type="button" disabled={disabled} onClick={onDelete} className={`${actionButton} border-red-500/40 text-red-400 hover:bg-red-500/15 hover:text-red-300`}><Trash2 className="h-4 w-4 shrink-0" />Delete</button>
        </div>
      </section>

      <section className="mt-4 border-t border-[#1c48a0] pt-3 [.light_&]:border-[#d4dfef]">
        <h3 className="font-semibold">Folder &amp; Tag Management</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" disabled={disabled} onClick={onMove} className={actionButton}><Folder className="h-4 w-4 shrink-0" />Change Folder</button>
          <button type="button" disabled={disabled} onClick={onManageTags} className={actionButton}><Tag className="h-4 w-4 shrink-0" />Manage Tags</button>
        </div>
      </section>

      <section className="mt-4 border-t border-[#1c48a0] pt-3">
        <h3 className="font-semibold">Quick Preview</h3>
        <div className="mt-2">
          <button type="button" disabled={!single} onClick={onOpen} className={`${actionButton} w-full`}>
            <ExternalLink className="h-4 w-4 shrink-0" />Open in New Tab
          </button>
        </div>
      </section>
    </aside>
  );
}
