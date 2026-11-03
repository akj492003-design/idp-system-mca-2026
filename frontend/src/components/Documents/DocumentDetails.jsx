const B =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#1c48a0] bg-[#1d6bff]/10 px-3 py-2 text-sm text-[#a0b6e1] transition hover:bg-[#1d6bff]/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1d6bff] disabled:pointer-events-none disabled:opacity-40';

export default function DocumentDetails({
  selectedDocs,
  single,
  ICON,
  fmt,
  chips,
  onClose,
  onAction,
}) {
  const n = selectedDocs.length;
  const z = !n;
  const o = n !== 1;

  let top;
  if (!n) {
    top = (
      <div className="py-8 text-center">
        <i data-lucide="file-text" className="mx-auto mb-3 h-14 w-14 text-indigo-400" />
        <p className="font-semibold">No document selected</p>
        <p className="mx-auto mt-1 max-w-[16rem] text-sm text-[#a0b6e1]">
          Select a document from the list to view its details.
        </p>
      </div>
    );
  } else if (n > 1) {
    top = (
      <div className="py-8 text-center">
        <i data-lucide="files" className="mx-auto mb-3 h-14 w-14 text-indigo-400" />
        <p className="font-semibold">{n} documents selected</p>
        <p className="text-sm text-[#a0b6e1]">
          {fmt(selectedDocs.reduce((a, x) => a + x.size, 0))} total
        </p>
      </div>
    );
  } else {
    const d = single;
    top = (
      <div className="space-y-2 py-4 text-sm">
        {d.type === 'image' ? (
          <img src={d.url} alt={`Preview of ${d.name}`} className="mx-auto max-h-40 rounded-lg" />
        ) : (
          <i data-lucide={ICON[d.type]} className="mx-auto h-14 w-14 text-indigo-400" />
        )}
        <p className="break-words text-center font-semibold">{d.name}</p>
        <dl className="grid grid-cols-[5rem_1fr] gap-1 text-[#a0b6e1]">
          <dt>Type</dt>
          <dd className="uppercase text-white">{d.type}</dd>
          <dt>Size</dt>
          <dd className="text-white">{fmt(d.size)}</dd>
          <dt>Uploaded</dt>
          <dd className="text-white">{d.date}</dd>
          <dt>Folder</dt>
          <dd className="text-white">{d.folder || '—'}</dd>
          <dt>Tags</dt>
          <dd className="flex flex-wrap gap-1">{chips(d).length ? chips(d) : '—'}</dd>
        </dl>
      </div>
    );
  }

  const btn = (id, ic, l, dis, c = '') => (
    <button
      key={id}
      data-d={id}
      disabled={dis}
      onClick={() => onAction(id)}
      className={`${B} ${c}`}
    >
      <i data-lucide={ic} className="h-4 w-4" />
      {l}
    </button>
  );

  return (
    <aside
      id="det"
      className={`fixed inset-y-0 right-0 z-40 w-80 max-w-[90vw] overflow-auto border-l border-[#1c48a0] bg-[#03102e] p-4 transition-transform duration-200 ease-out xl:static xl:z-auto xl:w-auto xl:max-w-none xl:translate-x-0 xl:rounded-2xl xl:border xl:bg-[#051840]/60 ${
        !n ? 'translate-x-full' : 'translate-x-0'
      }`}
      aria-label="Document details"
    >
      <div className="flex items-center justify-between border-b border-[#1c48a0] pb-3">
        <h2 className="text-lg font-semibold">Document Details</h2>
        <button id="closeDet" aria-label="Close details" onClick={onClose} className="rounded-sm p-1 hover:bg-[#1d6bff]/20">
          <i data-lucide="x" className="h-5 w-5" />
        </button>
      </div>
      <div id="detBody">
        {top}
        <h3 className="mt-2 border-t border-[#1c48a0] pt-3 font-semibold">File Actions</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {btn('dl', 'download', 'Download', z)}
          {btn('rn', 'pencil', 'Rename', o)}
          {btn('mv', 'folder', 'Move to Folder', z)}
          {btn('ar', 'archive', single?.arch ? 'Restore' : 'Archive', z)}
          {btn('del', 'trash-2', 'Delete', z, 'border-red-500/60! text-red-400!')}
        </div>
        <h3 className="mt-4 border-t border-[#1c48a0] pt-3 font-semibold">Folder &amp; Tag Management</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {btn('mv', 'folder', 'Change Folder', z)}
          {btn('tg', 'tag', 'Manage Tags', z)}
        </div>
        <h3 className="mt-4 border-t border-[#1c48a0] pt-3 font-semibold">Quick Preview</h3>
        <div className="mt-2">{btn('open', 'external-link', 'Open in New Tab', o, 'w-full')}</div>
      </div>
    </aside>
  );
}