
import type { FilterMode } from "../types/task";

type Props = {
  value: FilterMode;
  onChange: (mode: FilterMode) => void;
};

const OPTIONS: { value: FilterMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function TaskFilters({ value, onChange }: Props) {
  return (
    <div className="filters" role="tablist" aria-label="Filter tasks">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={value === opt.value ? "active" : ""}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}