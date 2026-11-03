import SettingsSection from "./SettingsSection";

const globeIcon = (
  <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
  </svg>
);

const selectClass = "h-10 w-full cursor-pointer rounded border border-[#123765] bg-[#09234a] px-2 text-xs transition duration-200 focus:border-[#1677ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677ff]/40 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none lg:h-9 [.light_&]:border-[#d3dcea] [.light_&]:bg-[#f3f6fb] [.light_&]:focus:border-[#1677ff]";
const modelOptions = ["Logistic Regression", "Linear SVM", "KNN (Cosine)", "Multinomial Naive Bayes"];
const imageOptions = ["ResNet18", "MobileNetV2", "EfficientNet-B0"];

function ModelChecklist({ id, items, selected, onChange }) {
  return (
    <div id={id} className="flex flex-col gap-3 sm:gap-2 [.light_&]:[&_label]:text-[#1b2b45]">
      {items.map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-2 text-[11px] text-[#f0f5ff]">
          <input
            type="checkbox"
            value={item}
            checked={selected.includes(item)}
            onChange={(event) => onChange(item, event.target.checked)}
            className="size-3.5 cursor-pointer rounded-sm accent-[#1677ff]"
          />
          {item}
        </label>
      ))}
    </div>
  );
}

export default function AIModelSettings({
  settings,
  availableModels,
  open,
  onToggle,
  onSelectChange,
  onModelToggle,
  onThresholdChange,
  onThresholdCommit,
}) {
  return (
    <SettingsSection
      sectionKey="models"
      title="AI Model Settings"
      description="Select models and configure prediction behavior."
      icon={globeIcon}
      open={open}
      onToggle={onToggle}
      delayClass="motion-safe:delay-100"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr] lg:gap-0">
        <div className="lg:pr-6">
          <p className="mb-2 text-xs font-semibold">Preferred Model</p>
          <select id="preferredModel" value={settings.preferredModel} onChange={(event) => onSelectChange("preferredModel", event.target.value)} className={selectClass}>
            <option value="auto">Automatic (Recommended)</option>
            {availableModels.map((model) => <option key={model} value={model}>{model}</option>)}
          </select>
          <p className="mt-2 text-[0.6875rem] leading-snug sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            The system will choose the best available model based on the document type.
          </p>
        </div>

        <div className="lg:border-l lg:px-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Text Classification Models</p>
          <ModelChecklist id="textModels" items={modelOptions} selected={settings.textModels} onChange={(item, checked) => onModelToggle("textModels", item, checked)} />
        </div>

        <div className="lg:border-l lg:px-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Image Classification Models</p>
          <ModelChecklist id="imageModels" items={imageOptions} selected={settings.imageModels} onChange={(item, checked) => onModelToggle("imageModels", item, checked)} />
        </div>

        <div className="lg:border-l lg:pl-6 border-[#123765] [.light_&]:border-[#d3dcea]">
          <p className="mb-2 text-xs font-semibold">Prediction Handling</p>
          <p className="mb-1 text-[0.6875rem] font-semibold text-[#1677ff] sm:text-xs">When confidence is low:</p>
          <div className="flex items-center gap-2">
            <select data-key="lowAction" value={settings.lowAction} onChange={(event) => onSelectChange("lowAction", event.target.value)} className={selectClass}>
              <option>Mark for manual review</option>
              <option>Use fallback model</option>
              <option>Reject prediction</option>
            </select>
            <svg className="size-3.5 shrink-0 text-[#1677ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
            </svg>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[0.6875rem] font-semibold sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">Low confidence threshold</p>
            <p id="thresholdValue" className="text-xs font-semibold">{settings.threshold}%</p>
          </div>
          <input
            id="threshold"
            type="range"
            min="50"
            max="90"
            step="1"
            value={settings.threshold}
            onChange={(event) => onThresholdChange(Number(event.target.value))}
            onPointerUp={onThresholdCommit}
            onTouchEnd={onThresholdCommit}
            onKeyUp={onThresholdCommit}
            onBlur={onThresholdCommit}
            className="mt-1 h-5 w-full cursor-pointer accent-[#1677ff] sm:h-2"
          />
          <div className="mt-1 flex justify-between text-[0.6875rem] sm:text-xs text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            <span>50%</span><span>70%</span><span>90%</span>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
