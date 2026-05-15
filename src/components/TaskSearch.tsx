type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TaskSearch({ value, onChange }: Props) {
  return (
    <div className="search">
      <input
        type="search"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks"
      />
    </div>
  );
}

