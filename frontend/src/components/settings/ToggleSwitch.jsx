export default function ToggleSwitch({ name, checked, onChange }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        data-switch={name}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="block h-5 w-9 rounded-full border border-[#123765] bg-[#09234a] transition-colors duration-200 after:absolute after:left-[3px] after:top-[3px] after:size-3.5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 after:ease-out after:content-[''] motion-reduce:transition-none motion-reduce:after:transition-none peer-checked:border-[#1677ff] peer-checked:bg-[#1677ff] peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1677ff]/60 [.light_&]:peer-[:not(:checked)]:border-[#cbd5e6] [.light_&]:peer-[:not(:checked)]:bg-[#cbd5e6]" />
    </label>
  );
}
