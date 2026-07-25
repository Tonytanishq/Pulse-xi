"use client";

import { useMemo, useState } from "react";
import { CheckCheck, XCircle, Save, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import AppShell from "@/components/app/AppShell";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import PlayerCard from "@/components/attendance/PlayerCard";
import PlayerModal from "@/components/attendance/PlayerModal";

import { Player, players } from "@/lib/players";

type Status = "present" | "absent";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Record<number, Status>>(() => {
    const initial: Record<number, Status> = {};
    players.forEach((p) => (initial[p.id] = "present"));
    return initial;
  });

  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPlayers = useMemo(
    () =>
      players.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const presentCount = Object.values(attendance).filter(
    (s) => s === "present",
  ).length;

  function updateAttendance(id: number, status: Status) {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  }

  function markEveryone(status: Status) {
    const updated: Record<number, Status> = {};
    players.forEach((p) => (updated[p.id] = status));
    setAttendance(updated);
    toast(status === "present" ? "All marked present" : "All marked absent", {
      icon: status === "present" ? "✅" : "❌",
    });
  }

  return (
    <AppShell
      title="Attendance"
      subtitle="Saturday Training · mark the squad in"
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#0b1120",
            color: "#e8ecf4",
            border: "1px solid rgba(34,211,238,0.25)",
          },
        }}
      />

      <AttendanceStats present={presentCount} total={players.length} />

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3">
          <Search size={17} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => markEveryone("present")}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
          >
            <CheckCheck size={17} /> All Present
          </button>
          <button
            onClick={() => markEveryone("absent")}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/25"
          >
            <XCircle size={17} /> All Absent
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlayers.map((player, i) => (
          <PlayerCard
            key={player.id}
            player={player}
            status={attendance[player.id]}
            index={i}
            onToggle={(status) => updateAttendance(player.id, status)}
            onViewProfile={() => {
              setSelectedPlayer(player);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Save bar */}
      <div className="sticky bottom-4 mt-10 flex justify-end">
        <button
          onClick={() =>
            toast.success(
              `Attendance saved · ${presentCount}/${players.length} present`,
            )
          }
          className="btn-pulse shadow-2xl"
        >
          <Save size={18} /> Save Attendance
        </button>
      </div>

      <PlayerModal
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedPlayer(null);
          setIsModalOpen(false);
        }}
      />
    </AppShell>
  );
}
