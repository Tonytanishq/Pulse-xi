"use client";

import { useState } from "react";
import { Formation } from "@/hooks/useFormation";
import { MatchVenue } from "@/lib/matchday";

interface Props {
  formation: Formation;
  onCreateMatchday: (
    opponent: string,
    date: string,
    kickoff: string,
    venue: MatchVenue
  ) => void;
}

export default function MatchdayPanel({
  formation,
  onCreateMatchday,
}: Props) {
  const [venue, setVenue] = useState<MatchVenue>("HOME");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget
    );

    const opponent =
      String(formData.get("opponent") ?? "").trim();

    const date =
      String(formData.get("date") ?? "");

    const kickoff =
      String(formData.get("kickoff") ?? "");

    if (!opponent || !date || !kickoff) {
      window.alert(
        "⚠️ Please enter the opponent, match date and kickoff time."
      );
      return;
    }

    onCreateMatchday(
      opponent,
      date,
      kickoff,
      venue
    );
  }

  return (
    <div className="rounded-3xl border border-purple-400/20 bg-[#111827]/90 p-6 shadow-xl">
      <div className="mb-5">
        <h2 className="text-xl font-black text-purple-300">
          ⚽ Matchday Setup
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Prepare the match before locking your Starting XI
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* OPPONENT */}
        <div>
          <label
            htmlFor="matchday-opponent"
            className="mb-1 block text-[10px] font-black uppercase tracking-wider text-gray-500"
          >
            Opponent
          </label>

          <input
            id="matchday-opponent"
            name="opponent"
            type="text"
            defaultValue=""
            placeholder="Enter opponent"
            autoComplete="off"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-3
              py-2.5
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-gray-600
              focus:border-purple-400/40
              focus:bg-white/10
            "
          />
        </div>

        {/* DATE */}
        <div>
          <label
            htmlFor="matchday-date"
            className="mb-1 block text-[10px] font-black uppercase tracking-wider text-gray-500"
          >
            Match Date
          </label>

          <input
            id="matchday-date"
            name="date"
            type="date"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-3
              py-2.5
              text-sm
              text-white
              outline-none
              transition
              focus:border-purple-400/40
              focus:bg-white/10
            "
          />
        </div>

        {/* KICKOFF */}
        <div>
          <label
            htmlFor="matchday-kickoff"
            className="mb-1 block text-[10px] font-black uppercase tracking-wider text-gray-500"
          >
            Kickoff
          </label>

          <input
            id="matchday-kickoff"
            name="kickoff"
            type="time"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-3
              py-2.5
              text-sm
              text-white
              outline-none
              transition
              focus:border-purple-400/40
              focus:bg-white/10
            "
          />
        </div>

        {/* VENUE */}
        <div>
          <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-gray-500">
            Venue
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVenue("HOME")}
              className={`
                rounded-xl
                border
                px-3
                py-2.5
                text-xs
                font-black
                transition-all
                ${
                  venue === "HOME"
                    ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10"
                }
              `}
            >
              🏠 HOME
            </button>

            <button
              type="button"
              onClick={() => setVenue("AWAY")}
              className={`
                rounded-xl
                border
                px-3
                py-2.5
                text-xs
                font-black
                transition-all
                ${
                  venue === "AWAY"
                    ? "border-orange-400/40 bg-orange-500/15 text-orange-300"
                    : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10"
                }
              `}
            >
              🚌 AWAY
            </button>
          </div>
        </div>

        {/* CURRENT FORMATION */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
              Current Formation
            </span>

            <span className="text-xs font-black text-cyan-300">
              {formation}
            </span>
          </div>
        </div>

        {/* CREATE MATCHDAY */}
        <button
          type="submit"
          className="
            w-full
            rounded-xl
            border
            border-purple-400/30
            bg-purple-500/10
            px-4
            py-3
            text-xs
            font-black
            tracking-wide
            text-purple-300
            transition-all
            hover:scale-[1.02]
            hover:bg-purple-500/20
            hover:text-white
          "
        >
          📋 CREATE MATCHDAY
        </button>
      </form>
    </div>
  );
}