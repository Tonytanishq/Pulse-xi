import { Users, UserCheck, UserX, Percent } from "lucide-react";

interface Props {
  present: number;
  total: number;
}

export default function AttendanceStats({ present, total }: Props) {
  const absent = total - present;
  const percentage = total ? Math.round((present / total) * 100) : 0;

  const tiles = [
    { label: "Total", value: total, icon: Users, accent: "#22d3ee" },
    { label: "Present", value: present, icon: UserCheck, accent: "#34d399" },
    { label: "Absent", value: absent, icon: UserX, accent: "#f43f5e" },
    { label: "Rate", value: `${percentage}%`, icon: Percent, accent: "#3b82f6" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <div
            key={t.label}
            className="glass relative overflow-hidden rounded-2xl p-5"
          >
            <div
              className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl"
              style={{ background: `${t.accent}22` }}
            />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  {t.label}
                </p>
                <p className="mt-1 text-3xl font-black">{t.value}</p>
              </div>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  color: t.accent,
                  borderColor: `${t.accent}40`,
                  background: `${t.accent}14`,
                }}
              >
                <Icon size={20} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
