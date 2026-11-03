import { Archive, FolderOpen, Tag } from 'lucide-react';

const cards = [
  { key: 'folders', title: 'Folders', Icon: FolderOpen, tone: 'bg-[#1d6bff]', action: 'Manage folders' },
  { key: 'tags', title: 'Tags', Icon: Tag, tone: 'bg-violet-700', action: 'Manage tags' },
  { key: 'archived', title: 'Archived', Icon: Archive, tone: 'bg-[#1d6bff]', action: 'View archived' },
];

export default function SummaryCards({ folderCount, tagCount, archivedCount, onManageFolders, onManageTags, onToggleArchived, showingArchived }) {
  const values = { folders: folderCount, tags: tagCount, archived: archivedCount };
  const handlers = { folders: onManageFolders, tags: onManageTags, archived: onToggleArchived };

  return (
    <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3" aria-label="Document summary">
      {cards.map(({ key, title, Icon, tone, action }) => (
        <article key={key} className={`flex items-center gap-4 rounded-2xl border border-[#1c48a0] bg-[#051840] p-4 text-white shadow-[0_6px_18px_rgba(0,0,0,.14)] transition duration-150 hover:-translate-y-0.5 hover:border-[#1d6bff] motion-reduce:transform-none [.light_&]:border-[#c9d8f0] [.light_&]:bg-white [.light_&]:text-[#172b4d] [.light_&]:shadow-[0_5px_18px_rgba(24,50,90,.09)] ${key === 'archived' ? 'min-[480px]:max-lg:col-span-2' : ''}`}>
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tone}`} aria-hidden="true">
            <Icon className="h-7 w-7 text-white" />
          </span>
          <div>
            <p className="text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">{title}</p>
            <p className="text-2xl font-bold tabular-nums">{values[key]}</p>
            <button type="button" onClick={handlers[key]} className="text-sm text-sky-400 transition hover:text-sky-300 hover:underline [.light_&]:text-[#0759c7] [.light_&]:hover:text-[#06449b]">
              {key === 'archived' && showingArchived ? 'View active' : action} <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
