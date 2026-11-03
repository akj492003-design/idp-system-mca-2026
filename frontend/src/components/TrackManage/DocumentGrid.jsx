import { File, FileImage, FileSpreadsheet, FileText } from 'lucide-react';
import { formatBytes } from '../../services/documentService';

const fileIcons = { pdf: FileText, image: FileImage, doc: FileText, sheet: FileSpreadsheet, other: File };
const tagTone = {
  violet: 'bg-violet-600', rose: 'bg-rose-500', emerald: 'bg-emerald-600',
  amber: 'bg-amber-500', sky: 'bg-sky-600', pink: 'bg-pink-600',
};

export default function DocumentGrid({ documents, tags, selectedIds, onSelect }) {
  return (
    <div className="grid gap-3 p-3 min-[480px]:grid-cols-2 2xl:grid-cols-3">
      {documents.map((document) => {
        const Icon = fileIcons[document.type] ?? File;
        const selected = selectedIds.has(document.id);
        return (
          <button
            type="button"
            key={document.id}
            onClick={() => onSelect(document.id)}
            aria-pressed={selected}
            className={`min-w-0 rounded-xl border p-3 text-left transition duration-150 hover:-translate-y-0.5 hover:border-[#1d6bff] motion-reduce:transform-none ${selected ? 'border-[#1d6bff] bg-[#1d6bff]/20' : 'border-[#1c48a0] bg-[#051840]'} [.light_&]:border-[#c9d8f0] [.light_&]:bg-white [.light_&]:text-[#172b4d] [.light_&]:shadow-[0_3px_12px_rgba(24,50,90,.08)]`}
          >
            <Icon className="mb-2 h-8 w-8 text-indigo-400" />
            <p className="truncate text-sm font-medium" title={document.name}>{document.name}</p>
            <p className="text-xs text-[#a0b6e1] [.light_&]:text-[#526783]">{formatBytes(document.size)} · {document.date}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {document.tags.map((tagName) => {
                const tag = tags.find((item) => item.name === tagName);
                return tag ? <span key={tagName} className={`rounded-full px-2 py-0.5 text-xs text-white ${tagTone[tag.tone] ?? 'bg-sky-600'}`}>{tagName}</span> : null;
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}
