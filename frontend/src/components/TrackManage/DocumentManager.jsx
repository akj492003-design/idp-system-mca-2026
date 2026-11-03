
import { useMemo, useRef, useState } from 'react';
import { Archive, FileText, Upload } from 'lucide-react';
import DocumentToolbar from './DocumentToolbar.jsx';
import { DocumentList } from './DocumentList.jsx';
import DocumentGrid from './DocumentGrid.jsx';

export default function DocumentManager({
  documents,
  folders,
  tags,
  selectedIds,
  showingArchived,
  selectedFolder,
  selectedTag,
  fileType,
  sortOrder,
  view,
  onFolderChange,
  onTagChange,
  onTypeChange,
  onSortChange,
  onViewChange,
  onClearFilters,
  onOpenSidebar,
  onUpload,
  onSelectDocument,
  onToggleSelected,
  onSelectAll,
  onDownload,
  onDelete,
}) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const visibleDocuments = useMemo(() => {
    const result = documents.filter((document) =>
      document.archived === showingArchived &&
      (selectedFolder === 'All' || document.folder === selectedFolder) &&
      (!selectedTag || document.tags.includes(selectedTag)) &&
      (fileType === 'all' || document.type === fileType)
    );

    return result.sort((a, b) => {
      if (sortOrder === 'old') return a.ts - b.ts;
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'size') return b.size - a.size;
      return b.ts - a.ts;
    });
  }, [
    documents,
    showingArchived,
    selectedFolder,
    selectedTag,
    fileType,
    sortOrder,
  ]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    if (event.dataTransfer?.files?.length) {
      onUpload(event.dataTransfer.files);
    }
  };

  let emptyTitle = 'No documents yet';
  let emptyDescription =
    'Upload documents to view, manage and organize them here.';

  if (showingArchived) {
    emptyTitle = 'No archived documents';
    emptyDescription = 'Documents you archive will appear here.';
  } else if (documents.length > 0) {
    emptyTitle = 'No matching documents';
    emptyDescription =
      'Try changing your folder, tag or file type filters.';
  }

  return (
    <section
      aria-label="Documents"
      className="min-w-0 rounded-2xl border border-[#1c48a0] bg-[#051840]/60 p-3 shadow-[0_6px_20px_rgba(0,0,0,.12)] sm:p-4 [.light_&]:border-[#c9d8f0] [.light_&]:bg-white [.light_&]:shadow-[0_5px_18px_rgba(24,50,90,.08)]"
    >
      <DocumentToolbar
        view={view}
        onViewChange={onViewChange}
        type={fileType}
        onTypeChange={onTypeChange}
        folder={selectedFolder}
        onFolderChange={onFolderChange}
        tag={selectedTag}
        onTagChange={onTagChange}
        tags={tags}
        sort={sortOrder}
        onSortChange={onSortChange}
        folders={folders}
        onClear={onClearFilters}
        onOpenSidebar={onOpenSidebar}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        aria-label="Choose documents to upload"
        onChange={(event) => {
          if (event.target.files?.length) {
            onUpload(event.target.files);
          }
          event.target.value = '';
        }}
      />

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();

          if (
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setDragOver(false);
          }
        }}
        onDrop={handleDrop}
        className={`mt-3 min-h-[24rem] rounded-xl border bg-[#03102e]/40 transition-colors [.light_&]:bg-[#f7faff] ${
          dragOver
            ? 'border-[#1d6bff] bg-[#1d6bff]/10'
            : 'border-[#1c48a0] [.light_&]:border-[#d4dfef]'
        }`}
      >
        {visibleDocuments.length === 0 ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-2 p-6 text-center">
            {showingArchived ? (
              <Archive className="mb-2 h-16 w-16 text-indigo-400" />
            ) : (
              <FileText className="mb-2 h-16 w-16 text-indigo-400" />
            )}

            <h3 className="text-xl font-semibold">
              {emptyTitle}
            </h3>

            <p className="max-w-xl text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">
              {emptyDescription}
            </p>

            {!showingArchived && (
              <button
                type="button"
                onClick={openFilePicker}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#1d6bff] px-5 py-3 font-semibold text-white shadow-lg shadow-[#1d6bff]/30 transition hover:-translate-y-0.5 hover:brightness-110 motion-reduce:transform-none"
              >
                <Upload className="h-5 w-5" />
                Upload Document
              </button>
            )}

            {dragOver && (
              <p className="mt-2 text-sm font-medium text-sky-300 [.light_&]:text-[#0759c7]">
                Drop files to upload
              </p>
            )}
          </div>
        ) : view === 'list' ? (
          <DocumentList
            documents={visibleDocuments}
            tags={tags}
            selectedIds={selectedIds}
            onSelect={onSelectDocument}
            onToggleSelected={onToggleSelected}
            onDownload={onDownload}
            onDelete={onDelete}
            onSelectAll={(checked) =>
              onSelectAll(visibleDocuments, checked)
            }
          />
        ) : (
          <DocumentGrid
            documents={visibleDocuments}
            tags={tags}
            selectedIds={selectedIds}
            onSelect={onSelectDocument}
          />
        )}
      </div>

      <p className="mt-3 text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">
        Showing {visibleDocuments.length} of {visibleDocuments.length} documents
      </p>
    </section>
  );
}
