
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { formatBytes } from '../../services/documentService.js';

const inputClass =
  'w-full rounded-lg border border-[#1c48a0] bg-[#03102e] px-3 py-2 text-sm text-white outline-none transition placeholder:text-[#7893c2] focus:border-[#1d6bff] focus:ring-2 focus:ring-[#1d6bff]/30 [.light_&]:border-[#c5d4e8] [.light_&]:bg-white [.light_&]:text-[#172b4d] [.light_&]:placeholder:text-[#71829a]';

const secondaryButton =
  'rounded-lg border border-[#1c48a0] bg-[#1d6bff]/10 px-3 py-2 text-sm text-[#a0b6e1] transition hover:bg-[#1d6bff]/25 hover:text-white [.light_&]:border-[#c5d4e8] [.light_&]:bg-[#f1f6ff] [.light_&]:text-[#304563] [.light_&]:hover:bg-[#e2edff]';

const primaryButton =
  'rounded-lg bg-[#1d6bff] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#1d6bff]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50';

function ManageDialogContent({
  dialog,
  folders,
  tags,
  selectedDocuments,
  storageUsed,
  storageByType,
  onClose,
  onConfirm,
  onRemoveItem,
}) {
  // Initialize state directly from props instead of using an effect.
  const [name, setName] = useState(() =>
    dialog.type === 'rename' ? (dialog.documentName ?? '') : ''
  );

  const [folder, setFolder] = useState(() =>
    dialog.type === 'move' ? (dialog.currentFolder ?? '') : ''
  );

  const [checkedTags, setCheckedTags] = useState(() => {
    if (dialog.type !== 'assign-tags') return [];

    return selectedDocuments.length
      ? tags
          .filter((tag) =>
            selectedDocuments.every((document) =>
              document.tags.includes(tag.name)
            )
          )
          .map((tag) => tag.name)
      : [];
  });

  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Effect only handles DOM focus.
  useEffect(() => {
    const focusTimer = window.setTimeout(
      () => (inputRef.current ?? panelRef.current)?.focus(),
      30
    );

    return () => window.clearTimeout(focusTimer);
  }, []);

  const titles = {
    'manage-folders': 'Manage folders',
    'manage-tags': 'Manage tags',
    rename: 'Rename document',
    move: 'Move to folder',
    'assign-tags': 'Manage tags',
    delete: 'Delete documents',
    storage: 'Storage details',
  };

  const isManager =
    dialog.type === 'manage-folders' ||
    dialog.type === 'manage-tags';

  const isTagsManager = dialog.type === 'manage-tags';

  const managerItems = isTagsManager ? tags : folders;

  const storageFree = Math.max(
    0,
    5 * 1024 ** 3 - storageUsed
  );

  const submit = (event) => {
    event.preventDefault();

    if (dialog.type === 'rename') {
      onConfirm({ name: name.trim() });
    } else if (dialog.type === 'move') {
      onConfirm({ folder });
    } else if (dialog.type === 'assign-tags') {
      onConfirm({ tags: checkedTags });
    } else if (isManager) {
      onConfirm({ name: name.trim() });
      setName('');
    } else if (dialog.type === 'delete') {
      onConfirm({});
    } else {
      onClose();
    }
  };

  const trapFocus = (event) => {
    if (event.key !== 'Tab' || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      window.document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      window.document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  };

  const toggleTag = (tagName, checked) => {
    setCheckedTags((current) =>
      checked
        ? [...current, tagName]
        : current.filter((item) => item !== tagName)
    );
  };

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={panelRef}
        tabIndex={-1}
        onKeyDown={trapFocus}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-dialog-title"
        className="dialog-panel my-auto max-h-[min(88vh,44rem)] w-[92vw] max-w-md overflow-y-auto rounded-2xl border border-[#1c48a0] bg-[#051840] text-white shadow-2xl shadow-black/50 [.light_&]:border-[#c9d8f0] [.light_&]:bg-white [.light_&]:text-[#172b4d] [.light_&]:shadow-[0_16px_48px_rgba(24,50,90,.18)]"
      >
        <header className="flex items-center justify-between border-b border-[#1c48a0] px-5 py-4 [.light_&]:border-[#d4dfef]">
          <h2
            id="manage-dialog-title"
            className="text-lg font-semibold"
          >
            {titles[dialog.type] ?? 'Manage documents'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-[#a0b6e1] transition hover:bg-[#1d6bff]/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {dialog.type === 'storage' ? (
          <div className="p-5">
            <p className="mb-3 text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">
              {storageUsed === 0
                ? '0 GB'
                : formatBytes(storageUsed)}{' '}
              of 5 GB used · {formatBytes(storageFree)} free
            </p>

            <ul className="space-y-1">
              {Object.entries(storageByType).length ? (
                Object.entries(storageByType).map(
                  ([type, bytes]) => (
                    <li
                      key={type}
                      className="flex justify-between rounded-lg bg-[#1d6bff]/10 px-3 py-2 text-sm"
                    >
                      <span className="uppercase">{type}</span>
                      <span>{formatBytes(bytes)}</span>
                    </li>
                  )
                )
              ) : (
                <li className="text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">
                  No files stored yet.
                </li>
              )}
            </ul>

            <div className="mt-5 flex justify-end">
              <button
                ref={inputRef}
                type="button"
                onClick={onClose}
                className={secondaryButton}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5">
            {isManager && (
              <>
                <ul className="mb-3 max-h-48 space-y-1 overflow-y-auto">
                  {managerItems.map((item) => {
                    const itemName = isTagsManager
                      ? item.name
                      : item;

                    return (
                      <li
                        key={itemName}
                        className="flex items-center justify-between gap-3 rounded-lg bg-[#1d6bff]/10 px-3 py-2 text-sm"
                      >
                        <span className="min-w-0 truncate">
                          {itemName}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(itemName)}
                          aria-label={`Delete ${itemName}`}
                          className="shrink-0 rounded p-1 text-red-400 transition hover:bg-red-500/15 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}

                  {!managerItems.length && (
                    <li className="text-sm text-[#a0b6e1]">
                      No {isTagsManager ? 'tags' : 'folders'} yet.
                    </li>
                  )}
                </ul>

                <label
                  htmlFor="manager-new-name"
                  className="mb-1 block text-sm text-[#a0b6e1] [.light_&]:text-[#526783]"
                >
                  New {isTagsManager ? 'tag' : 'folder'} name
                </label>

                <input
                  ref={inputRef}
                  id="manager-new-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={`Enter ${isTagsManager ? 'tag' : 'folder'} name`}
                  className={inputClass}
                  maxLength={48}
                />
              </>
            )}

            {dialog.type === 'rename' && (
              <>
                <label
                  htmlFor="rename-document"
                  className="mb-1 block text-sm text-[#a0b6e1]"
                >
                  Document name
                </label>

                <input
                  ref={inputRef}
                  id="rename-document"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={180}
                  className={inputClass}
                />
              </>
            )}

            {dialog.type === 'move' && (
              <>
                <label
                  htmlFor="move-document-folder"
                  className="mb-1 block text-sm text-[#a0b6e1]"
                >
                  Destination folder
                </label>

                <select
                  ref={inputRef}
                  id="move-document-folder"
                  value={folder}
                  onChange={(event) => setFolder(event.target.value)}
                  className={inputClass}
                >
                  <option value="">No folder</option>

                  {folders.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </>
            )}

            {dialog.type === 'assign-tags' && (
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <label
                    key={tag.name}
                    className="flex cursor-pointer items-center gap-2 py-1 text-sm"
                  >
                    <input
                      ref={index === 0 ? inputRef : undefined}
                      type="checkbox"
                      checked={checkedTags.includes(tag.name)}
                      onChange={(event) =>
                        toggleTag(tag.name, event.target.checked)
                      }
                      className="h-4 w-4 accent-blue-500"
                    />

                    <span>{tag.name}</span>
                  </label>
                ))}

                {!tags.length && (
                  <p className="text-sm text-[#a0b6e1]">
                    No tags available. Create a tag first.
                  </p>
                )}
              </div>
            )}

            {dialog.type === 'delete' && (
              <p className="text-sm leading-6 text-[#d7e3fb]">
                Permanently delete {dialog.count} document
                {dialog.count === 1 ? '' : 's'}? This cannot be undone.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                ref={dialog.type === 'delete' ? inputRef : undefined}
                type="button"
                onClick={onClose}
                className={secondaryButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`${primaryButton} ${
                  dialog.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-500'
                    : ''
                }`}
                disabled={
                  (isManager || dialog.type === 'rename') &&
                  !name.trim()
                }
              >
                {dialog.type === 'delete'
                  ? 'Delete'
                  : dialog.type === 'move'
                    ? 'Move'
                    : dialog.type === 'rename'
                      ? 'Save'
                      : dialog.type === 'assign-tags'
                        ? 'Save Tags'
                        : 'Add'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

// Wrapper: changing the dialog identity resets its local state.
export default function ManageDialog(props) {
  if (!props.dialog) return null;

  const dialogKey = [
    props.dialog.type,
    props.dialog.documentId ?? '',
    props.dialog.documentName ?? '',
    props.dialog.currentFolder ?? '',
  ].join('-');

  return (
    <ManageDialogContent
      key={dialogKey}
      {...props}
    />
  );
}
