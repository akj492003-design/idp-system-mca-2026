import { Folder, FolderOpen, Plus, Star, X } from 'lucide-react';

const tagTone = {
  violet: 'bg-violet-600',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  sky: 'bg-sky-600',
  pink: 'bg-pink-600',
};

export default function FolderSidebar({
  folders,
  tags,
  documents,
  selectedFolder,
  selectedTag,
  showingArchived,
  isOpen,
  onClose,
  onSelectFolder,
  onSelectTag,
  onManageFolders,
  onManageTags,
}) {
  const activeCount = (folder) => documents.filter((document) => !document.archived && (folder === 'All' || document.folder === folder)).length;
  const tagCount = (tagName) => documents.filter((document) => !document.archived && document.tags.includes(tagName)).length;

  return (
    <>
      <button
        type="button"
        aria-label="Close folder navigation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity lg:hidden ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      />
      <aside
        id="folder-sidebar"
        aria-label="Folders and tags"
        className={`custom-scrollbar fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] overflow-y-auto border-r border-[#1c48a0] bg-[#03102e] p-4 text-white shadow-xl shadow-black/20 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-2xl lg:border lg:bg-[#051840]/60 [.light_&]:border-[#c9d8f0] [.light_&]:bg-white [.light_&]:text-[#172b4d] [.light_&]:shadow-[0_5px_18px_rgba(24,50,90,.08)] ${isOpen ? 'visible translate-x-0' : 'invisible -translate-x-full lg:visible'}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Folders</h2>
          <div className="flex items-center gap-1">
            <button type="button" onClick={onManageFolders} aria-label="Add or manage folders" className="rounded-lg border border-[#1c48a0] p-1.5 transition hover:bg-[#1d6bff]/20 [.light_&]:border-[#cbd8ea] [.light_&]:text-[#526783]">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" onClick={onClose} aria-label="Close folder navigation" className="rounded-lg p-1.5 text-[#a0b6e1] hover:bg-[#1d6bff]/20 lg:hidden">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="space-y-1" aria-label="Document folders">
          {['All', ...folders].map((folder) => {
            const active = selectedFolder === folder && !showingArchived;
            const Icon = folder === 'All' ? FolderOpen : Folder;
            return (
              <button
                type="button"
                key={folder}
                aria-current={active ? 'page' : undefined}
                onClick={() => onSelectFolder(folder)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${active ? 'bg-[#1d6bff] text-white shadow-sm shadow-blue-950/40' : 'text-white hover:bg-[#1d6bff]/20 [.light_&]:text-[#304563] [.light_&]:hover:bg-[#e8f1ff]'}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{folder === 'All' ? 'All Documents' : folder}</span>
                <span className="tabular-nums">{activeCount(folder)}</span>
              </button>
            );
          })}
        </nav>

        <hr className="my-4 border-[#1c48a0] [.light_&]:border-[#d4dfef]" />

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tags</h2>
          <button type="button" onClick={onManageTags} aria-label="Add or manage tags" className="rounded-lg border border-[#1c48a0] p-1.5 transition hover:bg-[#1d6bff]/20 [.light_&]:border-[#cbd8ea] [.light_&]:text-[#526783]">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {tags.map((tag) => (
            <button type="button" key={tag.name} onClick={() => onSelectTag(tag.name)} aria-pressed={selectedTag === tag.name} className="flex w-full items-center gap-2 text-sm">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium text-white transition hover:brightness-110 ${tagTone[tag.tone] ?? 'bg-sky-600'} ${selectedTag === tag.name ? 'ring-2 ring-white ring-offset-2 ring-offset-[#051840]' : ''}`}>
                <Star className="h-3.5 w-3.5 fill-white" />
                {tag.name}
              </span>
              <span className="ml-auto tabular-nums">{tagCount(tag.name)}</span>
            </button>
          ))}
          {tags.length === 0 && <p className="text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">No tags yet.</p>}
        </div>
      </aside>
    </>
  );
}
