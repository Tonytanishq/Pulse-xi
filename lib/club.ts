// ============================================================
// PULSE XI — Club config, navigation, fixtures & activity
// ============================================================

import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  LayoutGrid,
  Trophy,
  BarChart3,
  Radio,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const CLUB = {
  name: "BVRIT FOOTBALL CLUB",
  short: "BVRIT FC",
  product: "PULSE XI",
  tagline: "The Digital Operating System for Modern Football Clubs",
  season: "2025 / 26",
  founded: 2019,
};

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
}

export const NAV: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { name: "Squad", href: "/admin", icon: Users },
  { name: "Formation", href: "/formation", icon: LayoutGrid },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Analytics", href: "/analytics", icon: BarChart3, soon: true },
  { name: "Team Hub", href: "/hub", icon: Radio, soon: true },
  { name: "Settings", href: "/settings", icon: Settings, soon: true },
];

export interface Fixture {
  opponent: string;
  competition: string;
  venue: string;
  home: boolean;
  kickoff: string; // ISO
}

export const UPCOMING_MATCH: Fixture = {
  opponent: "CVR United",
  competition: "Inter-College Premier Cup",
  venue: "BVRIT Main Ground",
  home: true,
  kickoff: "2026-08-02T16:30:00+05:30",
};

export interface ResultLine {
  opponent: string;
  scored: number;
  conceded: number;
  competition: string;
}

export const RECENT_RESULTS: ResultLine[] = [
  { opponent: "VNR Titans", scored: 3, conceded: 1, competition: "Premier Cup" },
  { opponent: "MGIT Rovers", scored: 2, conceded: 2, competition: "League" },
  { opponent: "Sreenidhi SC", scored: 4, conceded: 0, competition: "League" },
  { opponent: "CBIT Athletic", scored: 1, conceded: 2, competition: "Premier Cup" },
  { opponent: "GRIET FC", scored: 2, conceded: 0, competition: "League" },
];

export function matchResult(r: ResultLine): "W" | "D" | "L" {
  if (r.scored > r.conceded) return "W";
  if (r.scored === r.conceded) return "D";
  return "L";
}

export interface Activity {
  icon: string;
  text: string;
  time: string;
  tone: "pulse" | "win" | "caution" | "electric";
}

export const ACTIVITY: Activity[] = [
  { icon: "✅", text: "Attendance submitted for Friday session", time: "12m ago", tone: "win" },
  { icon: "⚽", text: "Saturday practice scheduled · 6:00 AM", time: "1h ago", tone: "pulse" },
  { icon: "🏆", text: "Coach approved the 4-3-3 lineup", time: "3h ago", tone: "electric" },
  { icon: "📈", text: "Weekly performance report generated", time: "Yesterday", tone: "pulse" },
  { icon: "🩺", text: "2 players flagged for fitness review", time: "Yesterday", tone: "caution" },
];
