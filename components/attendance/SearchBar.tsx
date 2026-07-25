interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <input
      type="text"
      placeholder="🔍 Search Player..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-8 w-full rounded-xl border border-cyan-500/20 bg-white/5 p-4 outline-none"
    />
  );
}