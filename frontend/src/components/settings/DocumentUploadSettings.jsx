import SettingsSection from "./SettingsSection";
import ToggleSwitch from "./ToggleSwitch";

const uploadIcon = (
  <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
    <path d="M12 12v9" /><path d="m16 16-4-4-4 4" />
  </svg>
);

const selectClass = "h-10 w-full cursor-pointer rounded border border-[#123765] bg-[#09234a] px-2 text-xs transition duration-200 focus:border-[#1677ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677ff]/40 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none lg:h-9 [.light_&]:border-[#d3dcea] [.light_&]:bg-[#f3f6fb] [.light_&]:focus:border-[#1677ff]";
const formats = ["PDF", "JPG", "PNG", "JPEG", "DOCX", "XLSX", "PPTX", "TXT", "CSV", "BSON", "JSON", "XML", "ZIP", "RAR"];

function FormatChecklist({ selected, onToggle }) {
  return (
    <div id="formats" className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-y-2 [.light_&]:[&_label]:text-[#1b2b45]">
      {formats.map((format) => (
        <label key={format} className="flex cursor-pointer items-center gap-2 text-[11px] text-[#f0f5ff]">
          <input
            type="checkbox"
            value={format}
            checked={selected.includes(format)}
            onChange={(event) => onToggle(format, event.target.checked)}
            className="size-3.5 cursor-pointer rounded-sm accent-[#1677ff]"
          />
          {format}
        </label>
      ))}
    </div>
  );
}

export default function DocumentUploadSettings({ settings, open, onToggle, onSelectChange, onFormatToggle, onSwitchChange }) {
  return (
    <SettingsSection
      sectionKey="upload"
      title="Document Upload Settings"
      description="Configure file types, size limits and validation rules."
      icon={uploadIcon}
      open={open}
      onToggle={onToggle}
      delayClass="motion-safe:delay-200"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 lg:grid-cols-[2.2fr_1.2fr_1.3fr_1.3fr] lg:gap-0">
        <div className="lg:pr-6">
          <p className="mb-2 text-xs font-semibold">Allowed File Formats</p>
          <FormatChecklist selected={settings.formats} onToggle={onFormatToggle} />
          <p className="mt-3 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            PDF is enabled by default. Add image formats when OCR is fully integrated.
          </p>
        </div>

        <div className="lg:border-l lg:px-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Max File Size</p>
          <select data-key="maxSize" value={settings.maxSize} onChange={(event) => onSelectChange("maxSize", event.target.value)} className={selectClass}>
            <option>5 MB</option>
            <option>10 MB</option>
            <option>25 MB</option>
            <option>50 MB</option>
          </select>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">Allowed maximum file size per upload.</p>
        </div>

        <div className="lg:border-l lg:px-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Reject Empty or Invalid Files</p>
          <div className="flex items-center gap-2">
            <ToggleSwitch name="rejectState" checked={settings.switches.rejectState} onChange={(checked) => onSwitchChange("rejectState", checked)} />
            <span id="rejectState" className="text-xs">{settings.switches.rejectState ? "Enabled" : "Disabled"}</span>
          </div>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">Prevents processing of corrupted or empty files.</p>
        </div>

        <div className="lg:border-l lg:pl-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Detect Scanned PDFs (OCR)</p>
          <div className="flex items-center gap-2">
            <ToggleSwitch name="ocrState" checked={settings.switches.ocrState} onChange={(checked) => onSwitchChange("ocrState", checked)} />
            <span id="ocrState" className="text-xs">{settings.switches.ocrState ? "Enabled" : "Disabled"}</span>
          </div>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">Automatically flags PDFs with no/low text.</p>
        </div>
      </div>
    </SettingsSection>
  );
}
