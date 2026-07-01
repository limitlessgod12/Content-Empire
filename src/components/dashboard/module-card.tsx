type ModuleCardProps = {
  title: string;
  description: string;
  status: string;
  accent: string;
};

export function ModuleCard({ title, description, status, accent }: ModuleCardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-semibold text-white">{title}</p>
        <span className="rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
          {status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}
