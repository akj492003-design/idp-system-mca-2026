import { Database, Folder } from 'lucide-react';
import { formatBytes, STORAGE_CAP_BYTES } from '../../services/documentService.js';

export default function StorageOverview({ usedBytes, onOpenDetails }) {
  const percentage = Math.min(100, (usedBytes / STORAGE_CAP_BYTES) * 100);
  const displayedPercentage = percentage > 0 && percentage < 1 ? '<1' : `${Math.round(percentage)}`;
  const usedLabel = usedBytes === 0 ? '0 GB' : formatBytes(usedBytes);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#1c48a0] bg-linear-to-r from-[#051840] via-[#1d6bff]/20 to-[#051840] shadow-[0_8px_24px_rgba(0,0,0,.16)] [.light_&]:border-[#c9d8f0] [.light_&]:from-white [.light_&]:via-[#e8f0fc] [.light_&]:to-white [.light_&]:shadow-[0_8px_24px_rgba(24,50,90,.10)] p-4 sm:p-5 motion-safe:animate-[pulse_8s_ease-in-out_infinite]">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1d6bff] shadow-lg shadow-[#1d6bff]/40 sm:h-16 sm:w-16" aria-hidden="true">
          <Folder className="h-7 w-7 text-white" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl [.light_&]:text-[#172b4d]">Track &amp; Manage</h1>
          <p className="text-sm text-[#a0b6e1] sm:text-base [.light_&]:text-[#526783]">Organize, manage and control your documents and storage.</p>
        </div>

        <button
          type="button"
          onClick={onOpenDetails}
          className="flex w-full items-center gap-4 rounded-xl border border-[#1c48a0] bg-[#03102e]/40 p-3 text-left transition hover:border-[#1d6bff] sm:w-auto sm:min-w-[22rem] [.light_&]:border-[#c9d8f0] [.light_&]:bg-white/85 [.light_&]:shadow-[0_3px_10px_rgba(24,50,90,.08)]"
          aria-label="Open storage details"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1d6bff]" aria-hidden="true">
            <Database className="h-6 w-6 text-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-[#a0b6e1] [.light_&]:text-[#526783]">Storage Used</span>
            <span className="block text-xl font-semibold [.light_&]:text-[#172b4d]">{usedLabel} <span className="text-sm font-normal text-[#a0b6e1] [.light_&]:text-[#526783]">/ 5 GB</span></span>
            <span className="mt-1 flex items-center gap-3">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1c48a0]/50">
                <span className="block h-full origin-left rounded-full bg-[#1d6bff] transition-transform duration-300 ease-out" style={{ transform: `scaleX(${percentage / 100})` }} />
              </span>
              <span className="text-xs font-semibold tabular-nums [.light_&]:text-[#425875]">{displayedPercentage}%</span>
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}
