"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/** Shared layout for all authenticated app pages. */
export default function AppShell({ title, subtitle, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />

      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
          <Topbar
            title={title}
            subtitle={subtitle}
            onMenu={() => setMobileOpen(true)}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
