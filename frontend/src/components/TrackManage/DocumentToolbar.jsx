import { LayoutGrid, List, Menu, RotateCw } from 'lucide-react';

const selectClass = 'min-w-0 rounded-lg border border-[#1c48a0] bg-[#051840] px-3 py-2 text-sm text-white outline-none transition hover:border-[#1d6bff] focus:border-[#1d6bff] [.light_&]:border-[#c5d4e8] [.light_&]:bg-white [.light_&]:text-[#172b4d] [.light_&]:shadow-sm';

export default function DocumentToolbar({ view, onViewChange, type, onTypeChange, folder, onFolderChange, sort, onSortChange, folders, onClear, onOpenSidebar }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={onOpenSidebar} aria-label="Open folders and tags" className="rounded-lg border border-[#1c48a0] p-2 text-[#a0b6e1] transition hover:bg-[#1d6bff]/20 lg:hidden [.light_&]:border-[#c5d4e8] [.light_&]:text-[#526783]">
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex rounded-lg border border-[#1c48a0] p-0.5 [.light_&]:border-[#c5d4e8] [.light_&]:bg-[#f3f7fe]" role="group" aria-label="Document view mode">
        <button type="button" aria-label="List view" aria-pressed={view === 'list'} onClick={() => onViewChange('list')} className={`rounded-md p-2 transition ${view === 'list' ? 'bg-[#1d6bff] text-white' : 'text-[#a0b6e1] hover:bg-[#1d6bff]/20 [.light_&]:text-[#526783] [.light_&]:hover:bg-[#e3edfb]'}`}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => onViewChange('grid')} className={`rounded-md p-2 transition ${view === 'grid' ? 'bg-[#1d6bff] text-white' : 'text-[#a0b6e1] hover:bg-[#1d6bff]/20'}`}>
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>

      <label className="sr-only" htmlFor="document-type-filter">File type</label>
      <select id="document-type-filter" value={type} onChange={(event) => onTypeChange(event.target.value)} className={selectClass}>
        <option value="all">All File Types</option>
        <option value="pdf">PDF</option>
        <option value="image">Images</option>
        <option value="doc">Documents</option>
        <option value="sheet">Spreadsheets</option>
        <option value="other">Other</option>
      </select>

      <label className="sr-only" htmlFor="document-folder-filter">Folder</label>
      <select id="document-folder-filter" value={folder} onChange={(event) => onFolderChange(event.target.value)} className={selectClass}>
        <option value="All">All Folders</option>
        {folders.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>

      <label className="sr-only" htmlFor="document-sort">Sort order</label>
      <select id="document-sort" value={sort} onChange={(event) => onSortChange(event.target.value)} className={selectClass}>
        <option value="new">Newest First</option>
        <option value="old">Oldest First</option>
        <option value="name">Name A–Z</option>
        <option value="size">Largest First</option>
      </select>

      <button type="button" onClick={onClear} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#1c48a0] px-3 py-2 text-sm text-white transition hover:bg-[#1d6bff]/20 [.light_&]:border-[#c5d4e8] [.light_&]:text-[#304563] [.light_&]:hover:bg-[#e3edfb]">
        <RotateCw className="h-4 w-4" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
}
