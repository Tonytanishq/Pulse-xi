"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock3,
  Plus,
  ShieldAlert,
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
          String(player.id) === secondaryPlayerId
      ),
    [players, secondaryPlayerId]
  );

  const matchScore = useMemo(() => {
    let bvrit = 0;
    let opponent = 0;

    events.forEach((event) => {
      if (event.type !== "GOAL") {
        return;
      }

      if (event.team === "BVRIT") {
        bvrit += 1;
      } else {
        opponent += 1;
      }
    });

    return { bvrit, opponent };
  }, [events]);

  function resetForm() {
    setType("GOAL");
    setTeam("BVRIT");
    setPlayerId("");
    setSecondaryPlayerId("");
    setMinute("1");
    setAddedTime("");
    setNotes("");
  }

  function closeForm() {
    resetForm();
    setShowForm(false);
  }

  function handleTypeChange(
    nextType: MatchEventType
  ) {
    setType(nextType);
    setPlayerId("");
    setSecondaryPlayerId("");
  }

  function handleTeamChange(
    nextTeam: MatchEventTeam
  ) {
    setTeam(nextTeam);
    setPlayerId("");
    setSecondaryPlayerId("");
  }

  function handleCreateEvent() {
    const parsedMinute = Number(minute);
    const parsedAddedTime =
      addedTime.trim() === ""
        ? undefined
        : Number(addedTime);

    if (
      !Number.isFinite(parsedMinute) ||
      parsedMinute < 0 ||
      parsedMinute > 130
    ) {
      window.alert(
        "⚠️ Enter a valid minute between 0 and 130."
      );
      return;
    }

    if (
      parsedAddedTime !== undefined &&
      (!Number.isFinite(parsedAddedTime) ||
        parsedAddedTime < 0 ||
        parsedAddedTime > 30)
    ) {
      window.alert(
        "⚠️ Enter valid added time between 0 and 30."
      );
      return;
    }

    const requiresPrimaryPlayer =
      team === "BVRIT" ||
      type === "SUBSTITUTION";

    if (requiresPrimaryPlayer && !playerId) {
      window.alert("⚠️ Select a player.");
      return;
    }

    const selectedPlayer =
      playerId.length > 0
        ? players.find(
            (player) =>
              String(player.id) === playerId
          )
        : undefined;

    if (requiresPrimaryPlayer && !selectedPlayer) {
      window.alert("⚠️ Player not found.");
      return;
    }

    const requiresSecondaryPlayer =
      type === "ASSIST" ||
      type === "SUBSTITUTION";

    if (
      requiresSecondaryPlayer &&
      !secondaryPlayerId
    ) {
      window.alert(
        type === "SUBSTITUTION"
          ? "⚠️ Select the player coming off."
          : "⚠️ Select the player receiving the assist."
      );
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

    if (
      requiresSecondaryPlayer &&
      !secondaryPlayer
    ) {
      window.alert("⚠️ Secondary player not found.");
      return;
    }

    if (
      type === "ASSIST" &&
      selectedPlayer &&
      secondaryPlayer &&
      selectedPlayer.id === secondaryPlayer.id
    ) {
      window.alert(
        "⚠️ The assister and scorer must be different players."
      );
      return;
    }

    if (
      type === "SUBSTITUTION" &&
      selectedPlayer &&
      secondaryPlayer &&
      selectedPlayer.id === secondaryPlayer.id
    ) {
      window.alert(
        "⚠️ The players coming on and off must be different."
      );
      return;
    }

    if (
      team === "OPPONENT" &&
      !selectedPlayer &&
      !notes.trim()
    ) {
      window.alert(
        "⚠️ Add a note describing the opponent event."
      );
      return;
    }

    createMatchEvent({
      matchdayId,
      minute: parsedMinute,
      addedTime: parsedAddedTime,
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
    closeForm();
  }

  function handleDeleteEvent(
    event: MatchEvent
  ) {
    const confirmed = window.confirm(
      `Delete ${getEventLabel(event.type)} at ${getEventMinuteLabel(
        event
      )}?`
    );

    if (!confirmed) {
      return;
    }

    deleteMatchEvent(event.id);
    setEvents(getMatchEvents(matchdayId));
  }

  function getEventAccent(
    event: MatchEvent
  ) {
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

  function getEventIconContainer(
    event: MatchEvent
  ) {
    switch (event.type) {
      case "GOAL":
        return "border-emerald-400/20 bg-emerald-400/10";

      case "ASSIST":
        return "border-cyan-400/20 bg-cyan-400/10";

      case "YELLOW_CARD":
        return "border-yellow-400/20 bg-yellow-400/10";

      case "RED_CARD":
        return "border-red-400/20 bg-red-400/10";

      case "SUBSTITUTION":
        return "border-purple-400/20 bg-purple-400/10";

      default:
        return "border-white/10 bg-white/5";
    }
  }

  function renderPlayerName(
    player?: Player
  ) {
    if (!player) {
      return "Unknown player";
    }

    return `#${player.jersey} ${player.name}`;
  }

  function renderEventContent(
    event: MatchEvent
  ) {
    if (event.type === "GOAL") {
      return (
        <div>
          <p className="text-base font-black text-white">
            {event.player
              ? renderPlayerName(event.player)
              : event.team === "OPPONENT"
                ? "Opponent goal"
                : "BVRIT goal"}
          </p>

          {event.notes && (
            <p className="mt-1 text-xs font-medium leading-5 text-gray-500">
              {event.notes}
            </p>
          )}
        </div>
      );
    }

    if (event.type === "ASSIST") {
      return (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-white">
              {renderPlayerName(event.player)}
            </p>

            <span className="text-xs font-black text-cyan-400">
              →
            </span>

            <p className="text-sm font-bold text-gray-300">
              {renderPlayerName(
                event.secondaryPlayer
              )}
            </p>
          </div>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">
            Assist → scorer
          </p>

          {event.notes && (
            <p className="mt-2 text-xs font-medium leading-5 text-gray-500">
              {event.notes}
            </p>
          )}
        </div>
      );
    }

    if (event.type === "SUBSTITUTION") {
      return (
        <div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-xl border border-white/5 bg-black/10 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <ArrowDownToLine
                  size={14}
                  className="text-red-400"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-600">
                  Off
                </span>
              </div>

              <p className="mt-1 text-sm font-black text-gray-300">
                {renderPlayerName(
                  event.secondaryPlayer
                )}
              </p>
            </div>

            <span className="hidden text-purple-400 sm:block">
              →
            </span>

            <div className="rounded-xl border border-white/5 bg-black/10 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <ArrowUpFromLine
                  size={14}
                  className="text-emerald-400"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-600">
                  On
                </span>
              </div>

              <p className="mt-1 text-sm font-black text-gray-300">
                {renderPlayerName(event.player)}
              </p>
            </div>
          </div>

          {event.notes && (
            <p className="mt-2 text-xs font-medium leading-5 text-gray-500">
              {event.notes}
            </p>
          )}
        </div>
      );
    }

    return (
      <div>
        <p className="text-base font-black text-white">
          {event.player
            ? renderPlayerName(event.player)
            : event.team === "OPPONENT"
              ? "Opponent player"
              : "BVRIT player"}
        </p>

        {event.notes && (
          <p className="mt-1 text-xs font-medium leading-5 text-gray-500">
            {event.notes}
          </p>
        )}
      </div>
    );
  }

  function shouldShowMinuteSeparator(
    index: number
  ) {
    if (index === 0) {
      return true;
    }

    const previous = events[index - 1];
    const current = events[index];

    return (
      previous.minute !== current.minute ||
      (previous.addedTime ?? 0) !==
        (current.addedTime ?? 0)
    );
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
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
            Live Match Timeline
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Record the key moments as the match unfolds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {events.some(
            (event) => event.type === "GOAL"
          ) && (
            <div className="hidden items-center gap-2 rounded-xl border border-white/5 bg-black/10 px-3 py-2 sm:flex">
              <span className="text-xs font-black text-gray-500">
                SCORE
              </span>

              <span className="text-sm font-black text-cyan-300">
                {matchScore.bvrit}
              </span>

              <span className="text-xs text-gray-700">
                —
              </span>

              <span className="text-sm font-black text-red-300">
                {matchScore.opponent}
              </span>
            </div>
          )}

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
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-black/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white">
                New Match Event
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Add a moment to the live match centre.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
              aria-label="Close event form"
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
                  handleTypeChange(
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
                  handleTeamChange(
                    event.target.value as MatchEventTeam
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

            <label
              className={`block ${
                type === "ASSIST" ||
                type === "SUBSTITUTION"
                  ? "sm:col-span-2"
                  : "sm:col-span-2 lg:col-span-2"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {type === "SUBSTITUTION"
                  ? "Player Coming On"
                  : team === "OPPONENT"
                    ? "Player / Event Subject"
                    : "Player"}
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
                    {team === "OPPONENT" &&
                    type !== "SUBSTITUTION"
                      ? "Optional — use notes if unknown"
                      : "Select player"}
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

            {type === "ASSIST" && (
              <label className="block sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Scorer
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
                    Select scorer
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

            {type === "SUBSTITUTION" && (
              <label className="block sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Player Coming Off
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
                placeholder={
                  team === "OPPONENT"
                    ? "Describe the opponent event if player is unknown..."
                    : "Optional match note..."
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080D1C] px-3 py-3 text-sm font-semibold text-white outline-none placeholder:text-gray-700 focus:border-cyan-400/40"
              />
            </label>
          </div>

          {(selectedPlayer ||
            selectedSecondaryPlayer) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedPlayer && (
                <span className="rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1.5 text-xs font-bold text-cyan-300">
                  {type === "SUBSTITUTION"
                    ? `ON · ${selectedPlayer.name}`
                    : selectedPlayer.name}
                </span>
              )}

              {selectedSecondaryPlayer && (
                <span className="rounded-full border border-purple-400/15 bg-purple-400/5 px-3 py-1.5 text-xs font-bold text-purple-300">
                  {type === "SUBSTITUTION"
                    ? `OFF · ${selectedSecondaryPlayer.name}`
                    : `SCORER · ${selectedSecondaryPlayer.name}`}
                </span>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
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
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-cyan-500/15 bg-black/10 px-6 py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_55%)]" />

            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5 text-2xl">
                ⚽
              </div>

              <p className="mt-4 text-sm font-black text-gray-300">
                Kick-off hasn't made the timeline yet
              </p>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-600">
                Add goals, cards, assists or substitutions
                as the match develops.
              </p>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-cyan-400 transition hover:bg-cyan-400/10 hover:text-cyan-300"
              >
                <Plus size={13} />
                Record first event
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-5 left-[27px] top-5 w-px bg-gradient-to-b from-cyan-400/20 via-white/5 to-transparent" />

            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={event.id}>
                  {shouldShowMinuteSeparator(index) && (
                    <div className="mb-3 ml-[58px] flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-700">
                        {getEventMinuteLabel(event)}
                      </span>

                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                  )}

                  <div
                    className={`relative rounded-2xl border p-4 transition hover:border-white/10 ${getEventAccent(
                      event
                    )}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg ${getEventIconContainer(
                          event
                        )}`}
                      >
                        {getEventIcon(event.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white">
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

                        <div className="mt-3">
                          {renderEventContent(event)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteEvent(event)
                        }
                        className="shrink-0 rounded-lg p-2 text-gray-700 transition hover:bg-red-400/10 hover:text-red-400"
                        aria-label={`Delete ${getEventLabel(
                          event.type
                        )}`}
                        title="Delete event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {events.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-600">
            <ShieldAlert size={13} />
            {events.length} recorded{" "}
            {events.length === 1
              ? "event"
              : "events"}
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.14em]">
            <span className="text-cyan-500/70">
              BVRIT {matchScore.bvrit}
            </span>

            <span className="text-gray-700">
              —
            </span>

            <span className="text-red-400/70">
              OPP {matchScore.opponent}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
