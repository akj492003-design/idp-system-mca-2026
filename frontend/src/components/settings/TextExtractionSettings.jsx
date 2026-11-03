import SettingsSection from "./SettingsSection";
import ToggleSwitch from "./ToggleSwitch";

const extractionIcon = (
  <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
    <path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h5" />
  </svg>
);

const selectClass = "h-10 w-full cursor-pointer rounded border border-[#123765] bg-[#09234a] px-2 text-xs transition duration-200 focus:border-[#1677ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677ff]/40 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none lg:h-9 [.light_&]:border-[#d3dcea] [.light_&]:bg-[#f3f6fb] [.light_&]:focus:border-[#1677ff]";

export default function TextExtractionSettings({ settings, open, onToggle, onSelectChange, onSwitchChange }) {
  return (
    <SettingsSection
      sectionKey="extraction"
      title="Text Extraction Preferences"
      description="Control how extracted text and OCR are handled."
      icon={extractionIcon}
      open={open}
      onToggle={onToggle}
      delayClass="motion-safe:delay-400"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 lg:grid-cols-[1fr_1.5fr_1fr] lg:gap-0">
        <div className="lg:pr-6">
          <p className="mb-2 text-xs font-semibold">Show Extracted Text in Results</p>
          <div className="flex items-center gap-2">
            <ToggleSwitch name="showState" checked={settings.switches.showState} onChange={(checked) => onSwitchChange("showState", checked)} />
            <span id="showState" className="text-xs">{settings.switches.showState ? "Enabled" : "Disabled"}</span>
          </div>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            Display extracted text in the document details view.
          </p>
        </div>

        <div className="lg:border-l lg:px-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">OCR Status Display</p>
          <select
            data-key="ocrDisplay"
            value={settings.ocrDisplay}
            disabled={!settings.switches.ocrState}
            title={settings.switches.ocrState ? "" : 'Enable "Detect Scanned PDFs (OCR)" to change this'}
            onChange={(event) => onSelectChange("ocrDisplay", event.target.value)}
            className={`${selectClass} ${!settings.switches.ocrState ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <option>Show status (Required / Completed / Failed)</option>
            <option>Show only failures</option>
            <option>Hide status</option>
          </select>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            Indicates when OCR is used and its result.
          </p>
        </div>

        <div className="lg:border-l lg:pl-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Preserve Original File</p>
          <div className="flex items-center gap-2">
            <ToggleSwitch name="preserveState" checked={settings.switches.preserveState} onChange={(checked) => onSwitchChange("preserveState", checked)} />
            <span id="preserveState" className="text-xs">{settings.switches.preserveState ? "Enabled" : "Disabled"}</span>
          </div>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            Keep the original file in storage (recommended).
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}
