import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { InstallPrompt } from "@/components/ui/install-prompt";

const metrics = [
  {
    title: "Projected revenue",
    value: "$12.4k",
    change: "+18%",
    detail: "Estimated from active affiliate and content workflows",
    tone: "positive" as const,
  },
  {
    title: "Weekly growth",
    value: "+24.6%",
    change: "Momentum",
    detail: "Traffic and saves are compounding across both channels",
  },
  {
    title: "Automation health",
    value: "94%",
    change: "Stable",
    detail: "Scheduling, reminders, and workflow checks are running",
  },
];

const projects = [
  {
    name: "YouTube authority playbook",
    platform: "YouTube",
    status: "Researching hooks",
    focus: "3 scripts • 2 thumbnails • 1 SEO pass",
  },
  {
    name: "Pinterest evergreen funnel",
    platform: "Pinterest",
    status: "Drafting pins",
    focus: "12 pins • 4 boards • 1 affiliate landing page",
  },
];

const tasks = [
  "Generate a keyword cluster for the next 5 blog posts",
  "Prepare a Pinterest pin batch for small-space organization",
  "Review thumbnail options for the next video concept",
  "Schedule automation reminders for the weekly publishing loop",
];

export default function Home() {
  return (
    <AppShell>
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Launch cockpit</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Grow YouTube and Pinterest from one autonomous business command center.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Content Empire AI combines research, content generation, optimization, analytics, and scheduling into a modular workflow built for creators, teams, and agencies.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <InstallPrompt />
            <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95">
              + New project
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {metrics.map((item) => (
            <MetricCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active projects</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Momentum across your growth channels</h2>
            </div>
            <button className="text-sm text-cyan-300">View all</button>
          </div>

          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <div key={project.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-medium text-white">{project.name}</p>
                    <p className="text-sm text-slate-400">{project.platform}</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                    {project.status}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400">{project.focus}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Next best actions</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Your AI agents are prioritizing</h2>
          <ul className="mt-6 space-y-3">
            {tasks.map((task) => (
              <li key={task} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                {task}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
