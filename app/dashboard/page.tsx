"use client";

import { Users, UserCheck, UserX, Activity } from "lucide-react";

import AppShell from "@/components/app/AppShell";
import StatCard from "@/components/ui/StatCard";
import UpcomingMatch from "@/components/dashboard/UpcomingMatch";
import FormGuide from "@/components/dashboard/FormGuide";
import TopPerformers from "@/components/dashboard/TopPerformers";
import QuickActions from "@/components/dashboard/QuickActions";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

import { players, teamStats } from "@/lib/players";

// Derived "today" snapshot — present = healthy + available.
const present = Math.round((players.length * teamStats.avgAttendance) / 100);
const absent = players.length - present;

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Captain overview · matchday control room">
      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Squad"
          value={players.length}
          icon={Users}
          accent="#22d3ee"
          hint="Registered players"
        />
        <StatCard
          label="Present Today"
          value={present}
          icon={UserCheck}
          accent="#34d399"
          hint="Checked in"
          delay={0.06}
        />
        <StatCard
          label="Absent"
          value={absent}
          icon={UserX}
          accent="#f43f5e"
          hint="Not available"
          delay={0.12}
        />
        <StatCard
          label="Attendance"
          value={teamStats.avgAttendance}
          suffix="%"
          icon={Activity}
          accent="#3b82f6"
          hint="Season average"
          delay={0.18}
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <QuickActions />
      </div>

      {/* Main grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UpcomingMatch />
          <ActivityFeed />
        </div>
        <div className="space-y-6">
          <FormGuide />
          <TopPerformers />
        </div>
      </div>
    </AppShell>
  );
}
