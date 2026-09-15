import { Player } from "@/lib/players";

export type MatchEventType =
  | "GOAL"
  | "ASSIST"
  | "YELLOW_CARD"
  | "RED_CARD"
  | "SUBSTITUTION";

export type MatchEventTeam = "BVRIT" | "OPPONENT";

export interface MatchEvent {
  id: string;
  matchdayId: string;
  minute: number;
  addedTime?: number;
  type: MatchEventType;
  team: MatchEventTeam;

  /**
   * Primary player involved in the event.
   *
   * GOAL          -> scorer
   * ASSIST        -> assisting player
   * YELLOW/RED    -> booked player
   * SUBSTITUTION  -> player coming on
   */
  player?: Player;

  /**
   * Secondary player involved in an event.
   *
   * ASSIST        -> player who received the assist / scorer
   * SUBSTITUTION  -> player coming off
   */
  secondaryPlayer?: Player;

  notes?: string;
  createdAt: string;
}

const MATCH_EVENTS_STORAGE_KEY =
  "pulse-xi-match-events";

function generateEventId(): string {
  return `event-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function isValidEventType(
  type: unknown
): type is MatchEventType {
  return (
    type === "GOAL" ||
    type === "ASSIST" ||
    type === "YELLOW_CARD" ||
    type === "RED_CARD" ||
    type === "SUBSTITUTION"
  );
}

function isValidEventTeam(
  team: unknown
): team is MatchEventTeam {
  return (
    team === "BVRIT" ||
    team === "OPPONENT"
  );
}

function normalizeMinute(
  value: unknown
): number {
  const minute = Number(value);

  if (!Number.isFinite(minute)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(130, Math.floor(minute))
  );
}

function normalizeAddedTime(
  value: unknown
): number | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const addedTime = Number(value);

  if (
    !Number.isFinite(addedTime) ||
    addedTime <= 0
  ) {
    return undefined;
  }

  return Math.floor(addedTime);
}

function normalizePlayer(
  player: unknown
): Player | undefined {
  if (
    !player ||
    typeof player !== "object"
  ) {
    return undefined;
  }

  const candidate =
    player as Partial<Player>;

  /*
   * Player IDs in Pulse XI are not assumed
   * to be strings. We only require the player
   * object to contain a valid id value.
   */
  if (
    candidate.id === undefined ||
    candidate.id === null
  ) {
    return undefined;
  }

  return candidate as Player;
}

function normalizeEvent(
  event: MatchEvent
): MatchEvent {
  return {
    ...event,

    id:
      typeof event.id === "string" &&
      event.id.length > 0
        ? event.id
        : generateEventId(),

    matchdayId:
      typeof event.matchdayId === "string"
        ? event.matchdayId
        : "",

    minute: normalizeMinute(
      event.minute
    ),

    addedTime: normalizeAddedTime(
      event.addedTime
    ),

    type: isValidEventType(event.type)
      ? event.type
      : "GOAL",

    team: isValidEventTeam(event.team)
      ? event.team
      : "BVRIT",

    player: normalizePlayer(
      event.player
    ),

    secondaryPlayer:
      normalizePlayer(
        event.secondaryPlayer
      ),

    notes:
      typeof event.notes === "string" &&
      event.notes.trim().length > 0
        ? event.notes.trim()
        : undefined,

    createdAt:
      typeof event.createdAt === "string" &&
      event.createdAt.length > 0
        ? event.createdAt
        : new Date().toISOString(),
  };
}

function readEvents(): MatchEvent[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        MATCH_EVENTS_STORAGE_KEY
      );

    if (!raw) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (event): event is MatchEvent =>
          Boolean(
            event &&
              typeof event === "object"
          )
      )
      .map(normalizeEvent);
  } catch {
    return [];
  }
}

function saveEvents(
  events: MatchEvent[]
): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    window.localStorage.setItem(
      MATCH_EVENTS_STORAGE_KEY,
      JSON.stringify(events)
    );
  } catch {
    // Ignore localStorage failures.
  }
}

export interface CreateMatchEventInput {
  matchdayId: string;
  minute: number;
  addedTime?: number;
  type: MatchEventType;
  team: MatchEventTeam;
  player?: Player;
  secondaryPlayer?: Player;
  notes?: string;
}

export function createMatchEvent(
  input: CreateMatchEventInput
): MatchEvent {
  const event: MatchEvent = {
    id: generateEventId(),
    matchdayId: input.matchdayId,
    minute: normalizeMinute(
      input.minute
    ),
    addedTime: normalizeAddedTime(
      input.addedTime
    ),
    type: input.type,
    team: input.team,
    player: input.player,
    secondaryPlayer:
      input.secondaryPlayer,
    notes:
      input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const events = readEvents();

  events.push(event);

  saveEvents(events);

  return event;
}

export function getMatchEvents(
  matchdayId: string
): MatchEvent[] {
  return readEvents()
    .filter(
      (event) =>
        event.matchdayId ===
        matchdayId
    )
    .sort((a, b) => {
      if (
        a.minute !== b.minute
      ) {
        return (
          a.minute - b.minute
        );
      }

      const addedA =
        a.addedTime ?? 0;

      const addedB =
        b.addedTime ?? 0;

      if (
        addedA !== addedB
      ) {
        return (
          addedA - addedB
        );
      }

      return (
        new Date(
          a.createdAt
        ).getTime() -
        new Date(
          b.createdAt
        ).getTime()
      );
    });
}

export function getAllMatchEvents(): MatchEvent[] {
  return readEvents().sort(
    (a, b) => {
      const dateA =
        new Date(
          a.createdAt
        ).getTime();

      const dateB =
        new Date(
          b.createdAt
        ).getTime();

      return dateA - dateB;
    }
  );
}

export function getMatchEvent(
  eventId: string
): MatchEvent | undefined {
  return readEvents().find(
    (event) =>
      event.id === eventId
  );
}

export function updateMatchEvent(
  eventId: string,
  updates: Partial<
    Omit<
      MatchEvent,
      "id" | "createdAt"
    >
  >
): MatchEvent | undefined {
  const events = readEvents();

  const index =
    events.findIndex(
      (event) =>
        event.id === eventId
    );

  if (index === -1) {
    return undefined;
  }

  const updatedEvent =
    normalizeEvent({
      ...events[index],
      ...updates,
      id: events[index].id,
      createdAt:
        events[index].createdAt,
    });

  events[index] =
    updatedEvent;

  saveEvents(events);

  return updatedEvent;
}

export function deleteMatchEvent(
  eventId: string
): boolean {
  const events = readEvents();

  const filteredEvents =
    events.filter(
      (event) =>
        event.id !== eventId
    );

  if (
    filteredEvents.length ===
    events.length
  ) {
    return false;
  }

  saveEvents(filteredEvents);

  return true;
}

export function clearMatchEvents(
  matchdayId: string
): void {
  const events = readEvents();

  saveEvents(
    events.filter(
      (event) =>
        event.matchdayId !==
        matchdayId
    )
  );
}

export function clearAllMatchEvents(): void {
  saveEvents([]);
}

export function getEventLabel(
  type: MatchEventType
): string {
  switch (type) {
    case "GOAL":
      return "Goal";

    case "ASSIST":
      return "Assist";

    case "YELLOW_CARD":
      return "Yellow Card";

    case "RED_CARD":
      return "Red Card";

    case "SUBSTITUTION":
      return "Substitution";

    default:
      return "Match Event";
  }
}

export function getEventIcon(
  type: MatchEventType
): string {
  switch (type) {
    case "GOAL":
      return "⚽";

    case "ASSIST":
      return "🅰️";

    case "YELLOW_CARD":
      return "🟨";

    case "RED_CARD":
      return "🟥";

    case "SUBSTITUTION":
      return "🔄";

    default:
      return "•";
  }
}

export function getEventMinuteLabel(
  event: MatchEvent
): string {
  if (
    event.addedTime !== undefined &&
    event.addedTime > 0
  ) {
    return `${event.minute}+${event.addedTime}'`;
  }

  return `${event.minute}'`;
}