import { Download, File, FileImage, FileSpreadsheet, FileText, Trash2 } from 'lucide-react';
import { formatBytes } from '../../services/documentService.js';

const fileIcons = {
  pdf: FileText,
  image: FileImage,
  doc: FileText,
  sheet: FileSpreadsheet,
  other: File,
};
const tagTone = {
  violet: 'bg-violet-600', rose: 'bg-rose-500', emerald: 'bg-emerald-600',
  amber: 'bg-amber-500', sky: 'bg-sky-600', pink: 'bg-pink-600',
};

export function DocumentList({ documents, tags, selectedIds, onSelect, onToggleSelected, onDownload, onDelete, onSelectAll }) {
  const allSelected = documents.length > 0 && documents.every((document) => selectedIds.has(document.id));

  return (
    <div>
      <div className="hidden grid-cols-[24px_minmax(0,2fr)_70px_80px_100px_100px_minmax(110px,1.2fr)_70px] items-center gap-2 border-b border-[#1c48a0] px-3 py-3 text-sm font-medium text-white md:grid [.light_&]:border-[#d4dfef] [.light_&]:text-[#263b59]">
        <input type="checkbox" aria-label="Select all visible documents" checked={allSelected} onChange={(event) => onSelectAll(event.target.checked)} className="h-4 w-4 accent-blue-500" />
        <span>Name</span><span>Type</span><span>Size</span><span>Uploaded</span><span>Folder</span><span>Tags</span><span>Actions</span>
      </div>

      {documents.map((document) => {
        const Icon = fileIcons[document.type] ?? File;
        const selected = selectedIds.has(document.id);
        return (
          <div key={document.id} className={`grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 border-b border-[#1c48a0]/50 px-3 py-2.5 text-sm transition hover:bg-[#1d6bff]/10 md:grid-cols-[24px_minmax(0,2fr)_70px_80px_100px_100px_minmax(110px,1.2fr)_70px] ${selected ? 'bg-[#1d6bff]/20' : ''} [.light_&]:border-[#dce5f2] [.light_&]:hover:bg-[#edf4ff]`}>
            <input type="checkbox" aria-label={`Select ${document.name}`} checked={selected} onChange={() => onToggleSelected(document.id)} className="h-4 w-4 accent-blue-500" />
            <button type="button" onClick={() => onSelect(document.id)} className="flex min-w-0 items-center gap-2 text-left" title={`View details for ${document.name}`}>
              <Icon className="h-4 w-4 shrink-0 text-indigo-400" />
              <span className="truncate">{document.name}</span>
            </button>
            <span className="hidden uppercase md:block">{document.type}</span>
            <span className="hidden md:block">{formatBytes(document.size)}</span>
            <span className="hidden md:block">{document.date}</span>
            <span className="hidden truncate md:block">{document.folder || '—'}</span>
            <span className="hidden flex-wrap gap-1 md:flex">
              {document.tags.map((tagName) => {
                const tag = tags.find((item) => item.name === tagName);
                return tag ? <span key={tagName} className={`rounded-full px-2 py-0.5 text-xs text-white ${tagTone[tag.tone] ?? 'bg-sky-600'}`}>{tagName}</span> : null;
              })}
            </span>
            <span className="flex items-center justify-end gap-1">
              <button type="button" onClick={() => onDownload(document)} aria-label={`Download ${document.name}`} title="Download" className="rounded-sm p-1.5 text-[#a0b6e1] transition hover:bg-[#1d6bff]/25 hover:text-white [.light_&]:text-[#526783] [.light_&]:hover:text-[#17365f]">
                <Download className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onDelete([document.id])} aria-label={`Delete ${document.name}`} title="Delete" className="rounded-sm p-1.5 text-red-400 transition hover:bg-red-500/20">
                <Trash2 className="h-4 w-4" />
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
