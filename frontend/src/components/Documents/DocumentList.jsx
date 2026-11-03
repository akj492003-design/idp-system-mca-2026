import { useRef } from 'react';
import {
  Archive,
  FileText,
  Upload,
  Download,
  Trash2,
} from 'lucide-react';

export default function DocumentList({
  docs,
  f,
  sel,
  ICON,
  fmt,
  chips,
  onSelectAll,
  onToggle,
  onSelectOnly,
  onDownload,
  onDelete,
  onUploadClick,
  onDrop,
}) {
  const dropRef = useRef(null);

  const handleDrag = (e, enter) => {
    e.preventDefault();
    if (dropRef.current) {
      if (enter) {
        dropRef.current.classList.add('border-[#1d6bff]', 'bg-[#1d6bff]/10');
      } else {
        dropRef.current.classList.remove('border-[#1d6bff]', 'bg-[#1d6bff]/10');
      }
    }
  };

  // Map type → Lucide component (fallback to FileText)
  const getIcon = (type) => {
    const Icon = ICON?.[type] || FileText;
    return Icon;
  };

  return (
    <div
      id="drop"
      ref={dropRef}
      className="mt-3 min-h-[24rem] rounded-xl border border-[#1c48a0] bg-[#03102e]/40 transition"
      onDragEnter={(e) => handleDrag(e, true)}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={(e) => {
        e.preventDefault();
        handleDrag(e, false);
        onDrop(e.dataTransfer.files);
      }}
    >
      <div
        id="head"
        className={`hidden grid-cols-[24px_2fr_70px_80px_100px_100px_1.2fr_70px] items-center gap-2 border-b border-[#1c48a0] px-3 py-3 text-sm font-medium md:grid ${
          f.view === 'list' && docs.length > 0 ? '' : 'hidden'
        }`}
      >
        <input
          id="all"
          type="checkbox"
          aria-label="Select all"
          className="h-4 w-4 accent-blue-500"
          checked={docs.length > 0 && docs.every((x) => sel.has(x.id))}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
        <span>Name</span>
        <span>Type</span>
        <span>Size</span>
        <span>Uploaded</span>
        <span>Folder</span>
        <span>Tags</span>
        <span>Actions</span>
      </div>

      <div id="list">
        {!docs.length ? (
          <div className="flex min-h-[22rem] flex-col items-center justify-center gap-2 p-6 text-center">
            {f.arch ? (
              <Archive className="mb-2 h-16 w-16 text-indigo-400" />
            ) : (
              <FileText className="mb-2 h-16 w-16 text-indigo-400" />
            )}
            <h3 className="text-xl font-semibold">
              {f.arch ? 'No archived documents' : 'No documents yet'}
            </h3>
            <p className="text-sm text-[#a0b6e1]">
              {f.arch
                ? 'Try clearing your filters.'
                : 'Upload documents to view, manage and organize them here.'}
            </p>
            <button
              data-upload
              onClick={onUploadClick}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#1d6bff] px-5 py-3 font-semibold text-white shadow-lg shadow-[#1d6bff]/30 transition hover:-translate-y-0.5 hover:brightness-110 motion-reduce:translate-none"
            >
              <Upload className="h-5 w-5" />
              Upload Document
            </button>
          </div>
        ) : f.view === 'list' ? (
          docs.map((x) => {
            const Icon = getIcon(x.type);
            return (
              <div
                key={x.id}
                data-id={x.id}
                tabIndex={0}
                className={`grid cursor-pointer grid-cols-[24px_1fr_auto] items-center gap-2 border-b border-[#1c48a0]/50 px-3 py-2.5 text-sm transition hover:bg-[#1d6bff]/10 md:grid-cols-[24px_2fr_70px_80px_100px_100px_1.2fr_70px] ${
                  sel.has(x.id) ? 'bg-[#1d6bff]/20' : ''
                }`}
                onClick={(e) => {
                  if (e.target.closest('[data-chk]')) {
                    onToggle(x.id);
                  } else if (e.target.closest('[data-a="dl"]')) {
                    onDownload(x.id);
                  } else if (e.target.closest('[data-a="del"]')) {
                    onDelete(x.id);
                  } else {
                    onSelectOnly(x.id);
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.id) {
                    e.preventDefault();
                    onSelectOnly(+e.target.dataset.id);
                  }
                }}
              >
                <input
                  data-chk
                  type="checkbox"
                  aria-label={`Select ${x.name}`}
                  className="h-4 w-4 accent-blue-500"
                  checked={sel.has(x.id)}
                  onChange={() => {}}
                />
                <span className="flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span className="truncate">{x.name}</span>
                </span>
                <span className="hidden uppercase md:block">{x.type}</span>
                <span className="hidden md:block">{fmt(x.size)}</span>
                <span className="hidden md:block">{x.date}</span>
                <span className="hidden truncate md:block">{x.folder || '—'}</span>
                <span className="hidden flex-wrap gap-1 md:flex">{chips(x)}</span>
                <span className="flex gap-1">
                  <button
                    data-a="dl"
                    aria-label="Download"
                    className="rounded-sm p-1.5 hover:bg-[#1d6bff]/25"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    data-a="del"
                    aria-label="Delete"
                    className="rounded-sm p-1.5 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </div>
            );
          })
        ) : (
          <div className="grid gap-3 p-3 min-[480px]:grid-cols-2 2xl:grid-cols-3">
            {docs.map((x) => {
              const Icon = getIcon(x.type);
              return (
                <div
                  key={x.id}
                  data-id={x.id}
                  tabIndex={0}
                  className={`cursor-pointer rounded-xl border p-3 transition hover:-translate-y-0.5 hover:border-[#1d6bff] motion-reduce:translate-none ${
                    sel.has(x.id)
                      ? 'border-[#1d6bff] bg-[#1d6bff]/20'
                      : 'border-[#1c48a0] bg-[#051840]'
                  }`}
                  onClick={() => onSelectOnly(x.id)}
                >
                  <Icon className="mb-2 h-8 w-8 text-indigo-400" />
                  <p className="truncate text-sm font-medium">{x.name}</p>
                  <p className="text-xs text-[#a0b6e1]">
                    {fmt(x.size)} · {x.date}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">{chips(x)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}