"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { label: "Dashboard", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Prompt Library", href: "/prompt-library" },
  { label: "Settings", href: "/settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(135deg,#07111f_0%,#101b2e_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:flex-row lg:gap-6 lg:px-8 lg:py-6">
        <aside className="w-full rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 text-lg font-semibold shadow-lg shadow-cyan-500/20">
              CE
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Content Empire AI</p>
              <p className="text-sm text-slate-400">Autonomous growth OS</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Platform scope</p>
            <p className="mt-2 text-sm text-slate-200">YouTube + Pinterest agents are ready to scale.</p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  }`}
                >
                  <span>{item.label}</span>
                  {active ? <span className="text-cyan-300">↗</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-200">AI status</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Multi-agent workflow online
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Context memory, SEO agents, analytics, and scheduling are integrated into the workflow layer.
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-6 py-2 lg:py-0">{children}</main>
      </div>
    </div>
  );
}
