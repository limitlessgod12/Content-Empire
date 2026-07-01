"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Prompt = {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
};

type PromptForm = {
  title: string;
  category: string;
  content: string;
  tags: string;
};

const emptyForm: PromptForm = {
  title: "",
  category: "SEO",
  content: "",
  tags: "",
};

export function PromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [form, setForm] = useState<PromptForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadPrompts = async () => {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/prompts");
    if (!response.ok) {
      setError("Prompt library could not be loaded.");
      setLoading(false);
      return;
    }
    const data = (await response.json()) as Prompt[];
    setPrompts(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return prompts;
    }
    return prompts.filter((prompt) => {
      return [prompt.title, prompt.category, prompt.content, prompt.tags ?? ""].join(" ").toLowerCase().includes(term);
    });
  }, [prompts, query]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and prompt content are required.");
      setSaving(false);
      return;
    }

    const response = editingId
      ? await fetch(`/api/prompts/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ? JSON.stringify(payload.error) : "The prompt could not be saved.");
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    setMessage(editingId ? "Prompt updated." : "Prompt saved.");
    await loadPrompts();
    setSaving(false);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingId(prompt.id);
    setForm({
      title: prompt.title,
      category: prompt.category,
      content: prompt.content,
      tags: prompt.tags ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this prompt permanently?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("The prompt could not be deleted.");
      return;
    }

    setMessage("Prompt deleted.");
    await loadPrompts();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Prompt library</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{editingId ? "Update prompt" : "Save a prompt"}</h1>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Prompt title</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Video hook generator"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Category</span>
            <select
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            >
              <option value="SEO">SEO</option>
              <option value="YouTube">YouTube</option>
              <option value="Pinterest">Pinterest</option>
              <option value="System">System</option>
              <option value="Template">Template</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Prompt content</span>
            <textarea
              className="min-h-40 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              placeholder="Write the reusable prompt here"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Tags</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              placeholder="hooks, youtube, ai"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save prompt" : "Save prompt"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setMessage(null);
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Saved prompts</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Search your reusable prompts</h2>
          </div>
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search prompts"
          />
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-400">Loading prompts…</p>
        ) : filteredPrompts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
            No prompts match your search yet.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredPrompts.map((prompt) => (
              <article key={prompt.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{prompt.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{prompt.category}</p>
                  </div>
                  <div className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                    {prompt.tags ?? "general"}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{prompt.content}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(prompt)}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(prompt.id)}
                    className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
