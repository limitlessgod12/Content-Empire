type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  detail: string;
  tone?: "positive" | "neutral";
};

export function MetricCard({ title, value, change, detail, tone = "neutral" }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/15 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            tone === "positive"
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-cyan-500/15 text-cyan-300"
          }`}
        >
          {change}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
