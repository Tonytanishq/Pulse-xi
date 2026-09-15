"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  createMatchEvent,
  deleteMatchEvent,
  getEventIcon,
  getEventLabel,
  getEventMinuteLabel,
  getMatchEvents,
  MatchEvent,
  MatchEventTeam,
  MatchEventType,
} from "@/lib/match-events";

import { Player } from "@/lib/players";

interface MatchEventPanelProps {
  matchdayId: string;
  players: Player[];
}

const EVENT_TYPES: MatchEventType[] = [
  "GOAL",
  "ASSIST",
  "YELLOW_CARD",
  "RED_CARD",
  "SUBSTITUTION",
];

export default function MatchEventPanel({
  matchdayId,
  players,
}: MatchEventPanelProps) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [type, setType] =
    useState<MatchEventType>("GOAL");

  const [team, setTeam] =
    useState<MatchEventTeam>("BVRIT");

  const [playerId, setPlayerId] = useState("");

  const [secondaryPlayerId, setSecondaryPlayerId] =
    useState("");

  const [minute, setMinute] = useState("1");

  const [addedTime, setAddedTime] = useState("");

  const [notes, setNotes] = useState("");

  useEffect(() => {
    setEvents(getMatchEvents(matchdayId));
  }, [matchdayId]);

  const selectedPlayer = useMemo(
    () =>
      players.find(
        (player) =>
          String(player.id) === playerId
      ),
    [players, playerId]
  );

  const selectedSecondaryPlayer = useMemo(
    () =>
      players.find(
        (player) =>
          String(player.id) ===
          secondaryPlayerId
      ),
    [players, secondaryPlayerId]
  );

  function resetForm() {
    setType("GOAL");
    setTeam("BVRIT");
    setPlayerId("");
    setSecondaryPlayerId("");
    setMinute("1");
    setAddedTime("");
    setNotes("");
  }

  function handleCreateEvent() {
    if (!playerId) {
      window.alert("⚠️ Select a player.");
      return;
    }

    const selectedPlayer =
      players.find(
        (player) =>
          String(player.id) === playerId
      );

    if (!selectedPlayer) {
      window.alert("⚠️ Player not found.");
      return;
    }

    const secondaryPlayer =
      secondaryPlayerId
        ? players.find(
            (player) =>
              String(player.id) ===
              secondaryPlayerId
          )
        : undefined;

    createMatchEvent({
      matchdayId,
      minute: Number(minute),
      addedTime:
        addedTime.trim() === ""
          ? undefined
          : Number(addedTime),
      type,
      team,
      player: selectedPlayer,
      secondaryPlayer,
      notes:
        notes.trim() === ""
          ? undefined
          : notes.trim(),
    });

    setEvents(getMatchEvents(matchdayId));
    resetForm();
    setShowForm(false);
  }

  function handleDeleteEvent(event: MatchEvent) {
    const confirmed = window.confirm(
      `Delete ${getEventLabel(event.type)} at ${getEventMinuteLabel(event)}?`
    );

    if (!confirmed) {
      return;
    }

    deleteMatchEvent(event.id);
    setEvents(getMatchEvents(matchdayId));
  }

  function getEventAccent(event: MatchEvent) {
    switch (event.type) {
      case "GOAL":
        return "border-emerald-400/20 bg-emerald-400/[0.05]";

      case "ASSIST":
        return "border-cyan-400/20 bg-cyan-400/[0.05]";

      case "YELLOW_CARD":
        return "border-yellow-400/20 bg-yellow-400/[0.05]";

      case "RED_CARD":
        return "border-red-400/20 bg-red-400/[0.05]";

      case "SUBSTITUTION":
        return "border-purple-400/20 bg-purple-400/[0.05]";

      default:
        return "border-white/5 bg-white/[0.03]";
    }
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity
              size={15}
              className="text-cyan-400"
            />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Match Events
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-white">
            Match Timeline
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Record goals, assists, cards and substitutions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/15 hover:text-white"
        >
          <Plus size={15} />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-black/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white">
                New Match Event
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Add an event to the match timeline.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Event
              </span>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as MatchEventType
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080D1C] px-3 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/40"
              >
                {EVENT_TYPES.map((eventType) => (
                  <option
                    key={eventType}
                    value={eventType}
                  >
                    {getEventIcon(eventType)}{" "}
                    {getEventLabel(eventType)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Team
              </span>

              <select
                value={team}
                onChange={(event) =>
                  setTeam(
                    event.target
                      .value as MatchEventTeam
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080D1C] px-3 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/40"
              >
                <option value="BVRIT">
                  BVRIT
                </option>

                <option value="OPPONENT">
                  Opponent
                </option>
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Minute
              </span>

              <div className="relative mt-2">
                <Clock3
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="number"
                  min="0"
                  max="130"
                  value={minute}
                  onChange={(event) =>
                    setMinute(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#080D1C] py-3 pl-9 pr-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/40"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Added Time
              </span>

              <input
                type="number"
                min="0"
                max="30"
                value={addedTime}
                onChange={(event) =>
                  setAddedTime(event.target.value)
                }
                placeholder="Optional"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080D1C] px-3 py-3 text-sm font-semibold text-white outline-none placeholder:text-gray-700 focus:border-cyan-400/40"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Player
              </span>

              <div className="relative mt-2">
                <UserRound
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <select
                  value={playerId}
                  onChange={(event) =>
                    setPlayerId(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#080D1C] py-3 pl-9 pr-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="">
                    Select player
                  </option>

                  {players.map((player) => (
                    <option
                      key={String(player.id)}
                      value={String(player.id)}
                    >
                      #{player.jersey}{" "}
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            {(type === "ASSIST" ||
              type === "SUBSTITUTION") && (
              <label className="block sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {type === "SUBSTITUTION"
                    ? "Player Coming In"
                    : "Secondary Player"}
                </span>

                <select
                  value={secondaryPlayerId}
                  onChange={(event) =>
                    setSecondaryPlayerId(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#080D1C] px-3 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="">
                    Select player
                  </option>

                  {players.map((player) => (
                    <option
                      key={String(player.id)}
                      value={String(player.id)}
                    >
                      #{player.jersey}{" "}
                      {player.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block sm:col-span-2 lg:col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Notes
              </span>

              <input
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Optional match note..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080D1C] px-3 py-3 text-sm font-semibold text-white outline-none placeholder:text-gray-700 focus:border-cyan-400/40"
              />
            </label>
          </div>

          {(selectedPlayer ||
            selectedSecondaryPlayer) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedPlayer && (
                <span className="rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1.5 text-xs font-bold text-cyan-300">
                  {selectedPlayer.name}
                </span>
              )}

              {selectedSecondaryPlayer && (
                <span className="rounded-full border border-purple-400/15 bg-purple-400/5 px-3 py-1.5 text-xs font-bold text-purple-300">
                  {selectedSecondaryPlayer.name}
                </span>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateEvent}
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-400/15 hover:text-white"
            >
              Save Event
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {events.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-cyan-500/15 bg-black/10">
            <div className="text-center">
              <div className="text-3xl">
                ⚽
              </div>

              <p className="mt-3 text-sm font-bold text-gray-300">
                No match events yet
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Add the first event to start the timeline.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-3 left-[23px] top-3 w-px bg-white/5" />

            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`relative rounded-2xl border p-4 ${getEventAccent(
                    event
                  )}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#080D1C] text-lg">
                      {getEventIcon(event.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-white">
                          {getEventLabel(event.type)}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-bold text-gray-500">
                          {getEventMinuteLabel(event)}
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                            event.team === "BVRIT"
                              ? "bg-cyan-400/10 text-cyan-300"
                              : "bg-red-400/10 text-red-300"
                          }`}
                        >
                          {event.team === "BVRIT"
                            ? "BVRIT"
                            : "OPPONENT"}
                        </span>
                      </div>

                      {event.player && (
                        <p className="mt-2 text-sm font-bold text-gray-200">
                          #{event.player.jersey}{" "}
                          {event.player.name}
                        </p>
                      )}

                      {event.secondaryPlayer && (
                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          ↳ {event.secondaryPlayer.name}
                        </p>
                      )}

                      {event.notes && (
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          {event.notes}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteEvent(event)
                      }
                      className="shrink-0 rounded-lg p-2 text-gray-600 transition hover:bg-red-400/10 hover:text-red-400"
                      aria-label="Delete event"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
