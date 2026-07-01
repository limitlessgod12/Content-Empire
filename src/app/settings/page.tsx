"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";

type SettingsState = {
  provider: string;
  apiKey: string;
  model: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    provider: "OpenAI",
    apiKey: "",
    model: "gpt-4o-mini",
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("content-empire-settings");
    if (stored) {
      setSettings(JSON.parse(stored) as SettingsState);
    }
  }, []);

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    window.localStorage.setItem("content-empire-settings", JSON.stringify(settings));
    setMessage("Settings saved locally.");
  };

  return (
    <AppShell>
      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Settings</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Configure your AI providers</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Store your provider preference and model selection locally so the app can route future requests correctly.
          </p>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Provider</span>
            <select
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={settings.provider}
              onChange={(event) => setSettings((current) => ({ ...current, provider: event.target.value }))}
            >
              <option value="OpenAI">OpenAI</option>
              <option value="Anthropic">Anthropic</option>
              <option value="Gemini">Gemini</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Model</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={settings.model}
              onChange={(event) => setSettings((current) => ({ ...current, model: event.target.value }))}
              placeholder="gpt-4o-mini"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300 md:col-span-2">
            <span>API key</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={settings.apiKey}
              onChange={(event) => setSettings((current) => ({ ...current, apiKey: event.target.value }))}
              placeholder="Paste a provider API key"
              type="password"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95"
            >
              Save settings
            </button>
            {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
          </div>
        </form>
      </section>
    </AppShell>
  );
}
