import SettingsSection from "./SettingsSection";

const paletteIcon = (
  <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="13.5" cy="6.5" r="1" />
    <circle cx="17.5" cy="10.5" r="1" />
    <circle cx="8.5" cy="7.5" r="1" />
    <circle cx="6.5" cy="12.5" r="1" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.8-10-8.8z" />
  </svg>
);

function ThemeCard({ themeName, currentTheme, onSelect }) {
  const active = currentTheme === themeName;
  const isNavy = themeName === "navy";

  return (
    <button
      type="button"
      data-theme={themeName}
      aria-pressed={active}
      onClick={() => onSelect(themeName)}
      className={`relative flex h-19 w-full cursor-pointer items-center gap-3 rounded-md border-2 p-2 text-left transition duration-200 hover:shadow-lg hover:shadow-[#1677ff]/20 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677ff] ${active ? "border-[#1677ff]" : "border-[#123765]"} ${isNavy ? "bg-[#09234a]" : "bg-[#eef3fb]"}`}
    >
      <span className={`h-full w-24 shrink-0 rounded border p-1 ${isNavy ? "border-[#123765] bg-[#03132e] [.light_&]:border-[#d3dcea]" : "border-[#d3dcea] bg-white"}`}>
        <span className={`mb-1 block h-1.5 w-full rounded-sm ${isNavy ? "bg-[#123765]" : "bg-[#d3dcea]"}`} />
        <span className="flex gap-1">
          <span className={`h-8 w-4 rounded-sm ${isNavy ? "bg-[#0b2a57]" : "bg-[#e3eaf5]"}`} />
          <span className={`h-8 flex-1 rounded-sm ${isNavy ? "bg-[#0e3470]" : "bg-[#edf1f8]"}`} />
        </span>
      </span>
      <span className="min-w-0">
        <span className={`block text-xs font-semibold ${isNavy ? "text-[#f0f5ff]" : "text-[#1b2b45]"}`}>
          {isNavy ? "Navy Blue" : "White / Light"}
        </span>
        <span
          data-sub
          data-default={isNavy ? "Dark and professional" : "Clean and bright<br>appearance"}
          data-muted={isNavy ? "#91a9cf" : "#5b6b85"}
          className={`block text-xs ${isNavy ? "text-[#91a9cf]" : "leading-tight text-[#5b6b85]"} ${active ? "text-[#1677ff]" : ""}`}
        >
          {active ? "Current theme" : isNavy ? "Dark and professional" : <>Clean and bright<br />appearance</>}
        </span>
      </span>
      <span
        data-radio
        className={`absolute bottom-2 right-2 flex size-3.5 items-center justify-center rounded-full border-2 transition-colors duration-200 ${active ? "border-[#1677ff] bg-[#1677ff]" : isNavy ? "border-[#8a99b3] bg-transparent" : "border-[#8a99b3] bg-transparent"}`}
      >
        <span className={`size-1.5 rounded-full transition-colors duration-200 ${active ? "bg-white" : "bg-transparent"}`} />
      </span>
    </button>
  );
}

export default function ThemeSettings({ theme, onThemeChange, open, onToggle }) {
  return (
    <SettingsSection
      sectionKey="appearance"
      title="Appearance & Theme"
      description="Customize the look and feel of your dashboard."
      icon={paletteIcon}
      open={open}
      onToggle={onToggle}
      delayClass="motion-safe:delay-0"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <p className="mb-2 text-xs font-semibold">Theme</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ThemeCard themeName="navy" currentTheme={theme} onSelect={onThemeChange} />
            <ThemeCard themeName="light" currentTheme={theme} onSelect={onThemeChange} />
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
