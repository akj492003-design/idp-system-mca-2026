import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StorageOverview from '../components/TrackManage/StorageOverview';
import SummaryCards from '../components/TrackManage/SummaryCards';
import FolderSidebar from '../components/TrackManage/FolderSidebar';
import DocumentManager from '../components/TrackManage/DocumentManager';
import DocumentDetails from '../components/TrackManage/DocumentDetails';
import ManageDialog from '../components/TrackManage/ManageDialog';
import Toast from '../components/TrackManage/Toast';

import { downloadDocument as downloadServerDocument, listDocuments, uploadDocument, updateDocument, deleteDocument as deleteServerDocument, getSettings, saveSettings } from '../services/idpService.js';
import { getApiErrorMessage } from '../services/api.js';

const extensionToType = (extension) => ({ pdf: 'pdf', png: 'image', jpg: 'image', jpeg: 'image', tif: 'image', tiff: 'image', bmp: 'image', webp: 'image', docx: 'doc', rtf: 'doc', txt: 'doc', md: 'doc', xlsx: 'sheet', xlsm: 'sheet', csv: 'sheet' }[String(extension || '').toLowerCase()] || 'other');
const mapServerDocument = (item) => { const extension = item.extension || String(item.type || '').toLowerCase(); const created = item.created_at ? new Date(item.created_at) : new Date(); return { id: item.id, name: item.name || item.file_name || 'Document', type: extensionToType(extension), extension, size: Number(item.size || 0), folder: item.folder || '', tags: Array.isArray(item.tags) ? item.tags : [], archived: Boolean(item.archived), date: created.toLocaleDateString(), ts: created.getTime(), url: '' }; };

const DEFAULT_FOLDERS = ['Invoices', 'Forms', 'Resumes', 'College', 'Personal', 'Work'];
const DEFAULT_TAGS = [
  { name: 'Important', tone: 'violet' },
  { name: 'Urgent', tone: 'rose' },
  { name: 'Reviewed', tone: 'emerald' },
  { name: 'Pending', tone: 'amber' },
];
const TAG_TONES = ['violet', 'rose', 'emerald', 'amber', 'sky', 'pink'];

export default function TrackManage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const [selectedFolder, setSelectedFolder] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [fileType, setFileType] = useState('all');
  const [sortOrder, setSortOrder] = useState('new');
  const [view, setView] = useState('list');
  const [showingArchived, setShowingArchived] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);

  const selectedDocuments = useMemo(
    () => documents.filter((document) => selectedIds.has(document.id)),
    [documents, selectedIds],
  );
  const storageUsed = useMemo(
    () => documents.reduce((total, document) => total + document.size, 0),
    [documents],
  );
  const storageByType = useMemo(() => documents.reduce((totals, document) => {
    totals[document.type] = (totals[document.type] ?? 0) + document.size;
    return totals;
  }, {}), [documents]);
  const archivedCount = useMemo(() => documents.filter((document) => document.archived).length, [documents]);
  useEffect(() => {
    try { localStorage.setItem('selectedDocuments', JSON.stringify(selectedDocuments.map((item) => ({ id: item.id, name: item.name, sizeMB: item.size / (1024 * 1024) })))); } catch { /* Storage may be disabled by the browser. */ }
  }, [selectedDocuments]);

  const notify = (message, type = 'success') => {
    setToast({ message, type, id: `${Date.now()}-${Math.random()}` });
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (dialog) {
        setDialog(null);
        return;
      }
      setSidebarOpen(false);
      setSelectedIds(new Set());
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [dialog]);

  useEffect(() => {
    let active = true;
    Promise.all([listDocuments({ page: 1, limit: 100 }), getSettings()]).then(([payload, savedSettings]) => {
      if (!active) return;
      setDocuments((payload?.items || []).map(mapServerDocument));
      if (Array.isArray(savedSettings?.managedFolders)) setFolders(savedSettings.managedFolders);
      if (Array.isArray(savedSettings?.managedTags)) setTags(savedSettings.managedTags);
    }).catch((error) => { if (active) notify(getApiErrorMessage(error, 'Could not load documents and saved manager settings.'), 'error'); });
    return () => { active = false; };
  }, []);

  const persistManagedSettings = async (patch) => {
    const current = await getSettings();
    const saved = await saveSettings({ ...(current || {}), ...patch });
    window.dispatchEvent(new CustomEvent('idp:settings-changed', { detail: saved }));
    return saved;
  };

  const uploadFiles = async (fileList) => {
    const incoming = Array.from(fileList ?? []);
    if (!incoming.length) return;
    let uploaded = 0;
    for (const file of incoming) {
      try {
        const payload = await uploadDocument(file);
        const mapped = mapServerDocument(payload.document);
        if (selectedFolder !== 'All' && selectedFolder) {
          await updateDocument(mapped.id, { folder: selectedFolder });
          mapped.folder = selectedFolder;
        }
        setDocuments((current) => [mapped, ...current]);
        uploaded += 1;
      } catch (error) {
        const message = getApiErrorMessage(error, 'Upload failed.');
        notify(message, 'error');
        if (error?.response?.status === 429) break;
      }
    }
    if (uploaded) { setShowingArchived(false); setSelectedIds(new Set()); notify(`${uploaded} document${uploaded === 1 ? '' : 's'} accepted for scanning`, 'success'); }
    window.dispatchEvent(new Event('idp:dashboard-refresh'));
  };

  const selectDocument = (id) => {
    setSelectedIds(new Set([id]));
    setSidebarOpen(false);
  };

  const toggleDocumentSelected = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = (visibleDocuments, checked) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleDocuments.forEach((document) => {
        if (checked) next.add(document.id);
        else next.delete(document.id);
      });
      return next;
    });
  };

  const downloadDocument = async (document) => {
    try { await downloadServerDocument(document.id, document.name); notify(`Download started: ${document.name}`, 'info'); }
    catch (error) { notify(getApiErrorMessage(error, 'Download failed.'), 'error'); }
  };

  const downloadSelected = () => {
    if (!selectedDocuments.length) return;
    selectedDocuments.forEach((document) => { downloadServerDocument(document.id, document.name).catch((error) => notify(getApiErrorMessage(error), 'error')); });
    notify(`Download started for ${selectedDocuments.length} document${selectedDocuments.length === 1 ? '' : 's'}`, 'info');
  };

  const requestDelete = (ids = Array.from(selectedIds)) => {
    if (!ids.length) return;
    setDialog({ type: 'delete', documentIds: ids, count: ids.length });
  };

  const confirmDialog = async (payload) => {
    if (!dialog) return;

    if (dialog.type === 'rename') {
      const nextName = payload.name.trim();
      if (!nextName) return;
      const documentId = dialog.documentId;
      try {
        await updateDocument(documentId, { name: nextName });
        setDocuments((current) => current.map((document) => document.id === documentId ? { ...document, name: nextName } : document));
        notify('Document renamed');
      } catch (error) { notify(getApiErrorMessage(error, 'Rename failed.'), 'error'); return; }
      setDialog(null);
      return;
    }

    if (dialog.type === 'move') {
      const ids = new Set(dialog.documentIds);
      try {
        await Promise.all([...ids].map((id) => updateDocument(id, { folder: payload.folder })));
        setDocuments((current) => current.map((document) => ids.has(document.id) ? { ...document, folder: payload.folder } : document));
        notify('Document folder updated');
      } catch (error) { notify(getApiErrorMessage(error, 'Folder update failed.'), 'error'); return; }
      setDialog(null);
      return;
    }

    if (dialog.type === 'assign-tags') {
      const ids = new Set(dialog.documentIds);
      try {
        await Promise.all([...ids].map((id) => updateDocument(id, { tags: payload.tags })));
        setDocuments((current) => current.map((document) => ids.has(document.id) ? { ...document, tags: payload.tags } : document));
        notify('Tags updated');
      } catch (error) { notify(getApiErrorMessage(error, 'Tag update failed.'), 'error'); return; }
      setDialog(null);
      return;
    }

    if (dialog.type === 'delete') {
      const ids = new Set(dialog.documentIds);
      try {
        await Promise.all([...ids].map((id) => deleteServerDocument(id)));
        setDocuments((current) => current.filter((document) => !ids.has(document.id)));
        setSelectedIds((current) => new Set([...current].filter((id) => !ids.has(id))));
        notify(`${ids.size} document${ids.size === 1 ? '' : 's'} deleted`);
      } catch (error) { notify(getApiErrorMessage(error, 'Delete failed.'), 'error'); return; }
      setDialog(null);
      return;
    }

    if (dialog.type === 'manage-folders') {
      const nextName = payload.name.trim();
      if (!nextName) return;
      if (folders.some((folder) => folder.toLowerCase() === nextName.toLowerCase())) {
        notify('That folder already exists', 'error');
        return;
      }
      const nextFolders = [...folders, nextName];
      try {
        await persistManagedSettings({ managedFolders: nextFolders, managedTags: tags });
        setFolders(nextFolders);
        notify('Folder added');
      } catch (error) { notify(getApiErrorMessage(error, 'Could not save folder.'), 'error'); return; }
      setDialog((current) => current ? { ...current, refreshKey: Date.now() } : current);
      return;
    }

    if (dialog.type === 'manage-tags') {
      const nextName = payload.name.trim();
      if (!nextName) return;
      if (tags.some((tag) => tag.name.toLowerCase() === nextName.toLowerCase())) {
        notify('That tag already exists', 'error');
        return;
      }
      const nextTags = [...tags, { name: nextName, tone: TAG_TONES[tags.length % TAG_TONES.length] }];
      try {
        await persistManagedSettings({ managedFolders: folders, managedTags: nextTags });
        setTags(nextTags);
        notify('Tag added');
      } catch (error) { notify(getApiErrorMessage(error, 'Could not save tag.'), 'error'); return; }
      setDialog((current) => current ? { ...current, refreshKey: Date.now() } : current);
    }
  };

  const removeManagedItem = async (itemName) => {
    try {
      if (dialog?.type === 'manage-folders') {
        const affected = documents.filter((document) => document.folder === itemName);
        await Promise.all(affected.map((document) => updateDocument(document.id, { folder: '' })));
        const nextFolders = folders.filter((folder) => folder !== itemName);
        await persistManagedSettings({ managedFolders: nextFolders, managedTags: tags });
        setFolders(nextFolders);
        setDocuments((current) => current.map((document) => document.folder === itemName ? { ...document, folder: '' } : document));
        if (selectedFolder === itemName) setSelectedFolder('All');
        notify('Folder deleted; its documents were moved to No folder', 'info');
      }
      if (dialog?.type === 'manage-tags') {
        const affected = documents.filter((document) => document.tags.includes(itemName));
        await Promise.all(affected.map((document) => updateDocument(document.id, { tags: document.tags.filter((tag) => tag !== itemName) })));
        const nextTags = tags.filter((tag) => tag.name !== itemName);
        await persistManagedSettings({ managedFolders: folders, managedTags: nextTags });
        setTags(nextTags);
        setDocuments((current) => current.map((document) => ({ ...document, tags: document.tags.filter((tag) => tag !== itemName) })));
        if (selectedTag === itemName) setSelectedTag('');
        notify('Tag deleted');
      }
      setDialog((current) => current ? { ...current, refreshKey: Date.now() } : current);
    } catch (error) {
      notify(getApiErrorMessage(error, 'Could not update the folder or tag.'), 'error');
    }
  };

  const archiveSelected = async () => {
    if (!selectedDocuments.length) return;
    // All selected rows normally belong to the active or archive view. Set a
    // shared target state instead of toggling each row independently.
    const shouldArchive = !selectedDocuments.every((document) => document.archived);
    const ids = new Set(selectedDocuments.map((document) => document.id));
    try {
      await Promise.all([...ids].map((id) => updateDocument(id, { archived: shouldArchive })));
      setDocuments((current) => current.map((document) => ids.has(document.id) ? { ...document, archived: shouldArchive } : document));
      setSelectedIds(new Set());
      notify(shouldArchive ? 'Documents archived' : 'Documents restored');
    } catch (error) { notify(getApiErrorMessage(error, 'Archive update failed.'), 'error'); }
  };

  const openRenameDialog = () => {
    if (selectedDocuments.length !== 1) return;
    setDialog({ type: 'rename', documentId: selectedDocuments[0].id, documentName: selectedDocuments[0].name });
  };

  const openMoveDialog = () => {
    if (!selectedDocuments.length) return;
    setDialog({ type: 'move', documentIds: selectedDocuments.map((document) => document.id), currentFolder: selectedDocuments[0].folder ?? '' });
  };

  const openTagDialog = () => {
    if (!selectedDocuments.length) return;
    setDialog({ type: 'assign-tags', documentIds: selectedDocuments.map((document) => document.id) });
  };

  const openDocument = () => {
    if (selectedDocuments.length !== 1) return;
    navigate(`/scanning-result/${selectedDocuments[0].id}`);
  };

  const toggleArchivedView = () => {
    setShowingArchived((current) => !current);
    setSelectedFolder('All');
    setSelectedTag('');
    setSelectedIds(new Set());
    setSidebarOpen(false);
  };

  const clearFilters = () => {
    setFileType('all');
    setSelectedFolder('All');
    setSelectedTag('');
    setSortOrder('new');
    setShowingArchived(false);
    setSelectedIds(new Set());
    notify('Filters cleared', 'info');
  };

  const selectFolder = (folder) => {
    setSelectedFolder(folder);
    setShowingArchived(false);
    setSidebarOpen(false);
  };

  const selectTag = (tagName) => {
    setSelectedTag((current) => current === tagName ? '' : tagName);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-dvh w-full scroll-smooth overflow-x-hidden bg-[#050b1f] text-[#e6eeff] [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] motion-reduce:scroll-auto">
      <main className="mx-auto min-h-dvh w-full max-w-[1700px] space-y-4 p-3 sm:p-4 md:p-5 2xl:max-w-[1900px]">
        
      <StorageOverview usedBytes={storageUsed} onOpenDetails={() => setDialog({ type: 'storage' })} />

      <SummaryCards
        folderCount={folders.length}
        tagCount={tags.length}
        archivedCount={archivedCount}
        onManageFolders={() => setDialog({ type: 'manage-folders' })}
        onManageTags={() => setDialog({ type: 'manage-tags' })}
        onToggleArchived={toggleArchivedView}
        showingArchived={showingArchived}
      />

      <div className="grid min-w-0 gap-4 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <FolderSidebar
          folders={folders}
          tags={tags}
          documents={documents}
          selectedFolder={selectedFolder}
          selectedTag={selectedTag}
          showingArchived={showingArchived}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectFolder={selectFolder}
          onSelectTag={selectTag}
          onManageFolders={() => setDialog({ type: 'manage-folders' })}
          onManageTags={() => setDialog({ type: 'manage-tags' })}
        />

        <DocumentManager
          documents={documents}
          folders={folders}
          tags={tags}
          selectedIds={selectedIds}
          showingArchived={showingArchived}
          selectedFolder={selectedFolder}
          selectedTag={selectedTag}
          fileType={fileType}
          sortOrder={sortOrder}
          view={view}
          onFolderChange={setSelectedFolder}
          onTagChange={setSelectedTag}
          onTypeChange={setFileType}
          onSortChange={setSortOrder}
          onViewChange={setView}
          onClearFilters={clearFilters}
          onOpenSidebar={() => setSidebarOpen(true)}
          onUpload={uploadFiles}
          onSelectDocument={selectDocument}
          onToggleSelected={toggleDocumentSelected}
          onSelectAll={selectAllVisible}
          onDownload={downloadDocument}
          onDelete={requestDelete}
        />

        {selectedDocuments.length > 0 && (
          <button type="button" aria-label="Close document details panel" onClick={() => setSelectedIds(new Set())} className="fixed inset-0 z-30 bg-black/60 xl:hidden" />
        )}
        <DocumentDetails
          selectedDocuments={selectedDocuments}
          tags={tags}
          isMobileOpen={selectedDocuments.length > 0}
          onClose={() => setSelectedIds(new Set())}
          onDownload={downloadSelected}
          onRename={openRenameDialog}
          onMove={openMoveDialog}
          onArchive={archiveSelected}
          onDelete={() => requestDelete()}
          onManageTags={openTagDialog}
          onOpen={openDocument}
        />
      </div>

      <ManageDialog
        dialog={dialog}
        folders={folders}
        tags={tags}
        selectedDocuments={selectedDocuments}
        storageUsed={storageUsed}
        storageByType={storageByType}
        onClose={() => setDialog(null)}
        onConfirm={confirmDialog}
        onRemoveItem={removeManagedItem}
      />
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <p className="pb-1 text-center text-xs text-[#7893c2]">IDP System · Track &amp; Manage · Stored securely in your account</p>
      </main>
    </div>
  );
}
