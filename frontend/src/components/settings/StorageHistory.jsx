import { useEffect, useRef, useState } from "react";
import SettingsSection from "./SettingsSection";

const storageIcon = (
  <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14a9 3 0 0 0 18 0V5" />
    <path d="M3 12a9 3 0 0 0 18 0" />
  </svg>
);

const retentionNotes = {
  "Keep until manually deleted": "Documents will be stored until you delete them.",
  "30 days": "Documents will be deleted automatically after 30 days.",
  "90 days": "Documents will be deleted automatically after 90 days.",
  "1 year": "Documents will be deleted automatically after 1 year.",
};

function formatSize(mb) {
  return mb >= 1024
    ? `${(mb / 1024).toFixed(2).replace(/\.?0+$/, "")} GB`
    : `${Math.round(mb)} MB`;
}

export default function StorageHistory({
  settings,
  docs,
  open,
  onToggle,
  onRetentionChange,
  onGoTrack,
  goTrackButtonLabel,
  goTrackFlashing,
  onDeleteSelected,
  deleteButtonLabel,
  deleteFlashing,
}) {
  const percent = Math.min(100, Math.round((docs.usedMB / 1024) * 100));
  const [ringPercent, setRingPercent] = useState(0);
  const firstRender = useRef(true);
  const circumference = 2 * Math.PI * 21;

  useEffect(() => {
    if (firstRender.current) {
      let secondFrame;
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setRingPercent(percent);
          firstRender.current = false;
        });
      });
      return () => {
        cancelAnimationFrame(firstFrame);
        if (secondFrame) cancelAnimationFrame(secondFrame);
      };
    }
    setRingPercent(percent);
  }, [percent]);

  const ringColor = percent < 70 ? "#00d6a0" : percent < 90 ? "#ffa726" : "#ff5368";

  return (
    <SettingsSection
      sectionKey="storage"
      title="Storage & History"
      description="Manage document retention and saved records."
      icon={storageIcon}
      open={open}
      onToggle={onToggle}
      delayClass="motion-safe:delay-300"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 lg:grid-cols-[1.5fr_1.3fr_1.3fr_1.3fr] lg:gap-0">
        <div className="lg:pr-6">
          <p className="mb-2 text-xs font-semibold">Document Retention</p>
          <select
            data-key="retention"
            value={settings.retention}
            onChange={(event) => onRetentionChange(event.target.value)}
            className="h-10 w-full cursor-pointer rounded border border-[#123765] bg-[#09234a] px-2 text-xs transition duration-200 focus:border-[#1677ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677ff]/40 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none lg:h-9 [.light_&]:border-[#d3dcea] [.light_&]:bg-[#f3f6fb] [.light_&]:focus:border-[#1677ff]"
          >
            <option>Keep until manually deleted</option>
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
          </select>
          <p id="retentionNote" className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            {retentionNotes[settings.retention] || ""}
          </p>
        </div>

        <div className="lg:border-l lg:px-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">View Document History</p>
          <button
            type="button"
            id="goTrack"
            data-flashing={goTrackFlashing ? "1" : undefined}
            onClick={onGoTrack}
            className="h-10 w-full cursor-pointer rounded bg-[#1677ff] px-3 text-xs font-semibold text-white transition duration-200 hover:bg-[#3a8bff] hover:shadow-lg hover:shadow-[#1677ff]/30 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transition-none lg:h-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677ff]"
          >
            {goTrackButtonLabel}
          </button>
        </div>

        <div className="lg:border-l lg:px-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Delete Document</p>
          <button
            type="button"
            id="deleteSel"
            data-flashing={deleteFlashing ? "1" : undefined}
            onClick={onDeleteSelected}
            className="h-10 w-full cursor-pointer rounded bg-[#d63a4e] px-3 text-xs font-semibold text-white transition duration-200 hover:bg-[#ff5368] hover:shadow-lg hover:shadow-[#ff5368]/30 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transition-none lg:h-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677ff]"
          >
            {deleteButtonLabel}
          </button>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            This action will remove the record and stored file permanently.
          </p>
        </div>

        <div className="lg:border-l lg:pl-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Storage Usage</p>
          <div className="flex items-center gap-3">
            <div className="relative size-13 shrink-0">
              <svg className="size-full -rotate-90" viewBox="0 0 52 52" aria-label={`Storage usage ${percent}%`} role="img">
                <circle id="ringTrack" cx="26" cy="26" r="21" fill="none" stroke="#123765" strokeWidth="5" className="[.light_&]:stroke-[#d3dcea]" />
                <circle
                  id="ring"
                  cx="26"
                  cy="26"
                  r="21"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(circumference * ringPercent / 100).toFixed(2)} ${circumference.toFixed(2)}`}
                  className="transition-[stroke-dasharray,stroke] duration-[600ms] ease-out motion-reduce:transition-none"
                />
              </svg>
              <span id="ringText" className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                {percent}%
              </span>
            </div>
            <div className="text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
              <p>Used</p>
              <p id="usageText" className="text-xs font-semibold text-[#f0f5ff] [.light_&]:text-[#1b2b45]">
                {formatSize(docs.usedMB)} / {formatSize(1024)}
              </p>
              <p>Total Documents</p>
              <p id="docCount" className="text-xs font-semibold text-[#f0f5ff] [.light_&]:text-[#1b2b45]">
                {docs.count}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
