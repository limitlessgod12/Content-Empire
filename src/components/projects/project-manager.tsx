"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Project = {
  id: string;
  title: string;
  platform: string;
  niche: string | null;
  goals: string | null;
  keywords: string | null;
  status: string;
  ideas: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProjectForm = {
  title: string;
  platform: string;
  niche: string;
  goals: string;
  keywords: string;
  status: string;
  ideas: string;
  notes: string;
};

const emptyForm: ProjectForm = {
  title: "",
  platform: "YouTube",
  niche: "",
  goals: "",
  keywords: "",
  status: "planning",
  ideas: "",
  notes: "",
};

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/projects");
    if (!response.ok) {
      setError("Projects could not be loaded.");
      setLoading(false);
      return;
    }
    const data = (await response.json()) as Project[];
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    if (!form.title.trim() || !form.platform.trim()) {
      setError("Title and platform are required.");
      setSaving(false);
      return;
    }

    const body = {
      ...form,
      niche: form.niche.trim(),
      goals: form.goals.trim(),
      keywords: form.keywords.trim(),
      status: form.status.trim(),
      ideas: form.ideas.trim(),
      notes: form.notes.trim(),
    };

    const response = editingId
      ? await fetch(`/api/projects/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ? JSON.stringify(payload.error) : "The project could not be saved.");
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    setMessage(editingId ? "Project updated." : "Project created.");
    await loadProjects();
    setSaving(false);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      platform: project.platform,
      niche: project.niche ?? "",
      goals: project.goals ?? "",
      keywords: project.keywords ?? "",
      status: project.status,
      ideas: project.ideas ?? "",
      notes: project.notes ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this project permanently?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("The project could not be deleted.");
      return;
    }

    setMessage("Project deleted.");
    await loadProjects();
  };

  const summary = useMemo(() => {
    return `${projects.length} active ${projects.length === 1 ? "project" : "projects"}`;
  }, [projects.length]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Project workspace</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{editingId ? "Update project" : "Create a new project"}</h1>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
            {summary}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Project title</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none ring-0"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="e.g. Summer YouTube growth sprint"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Platform</span>
            <select
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.platform}
              onChange={(event) => setForm((current) => ({ ...current, platform: event.target.value }))}
            >
              <option value="YouTube">YouTube</option>
              <option value="Pinterest">Pinterest</option>
              <option value="Cross-platform">Cross-platform</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Niche</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.niche}
              onChange={(event) => setForm((current) => ({ ...current, niche: event.target.value }))}
              placeholder="Small-space living"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Status</span>
            <select
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300 md:col-span-2">
            <span>Goals</span>
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.goals}
              onChange={(event) => setForm((current) => ({ ...current, goals: event.target.value }))}
              placeholder="Describe the business goal for this project"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300 md:col-span-2">
            <span>Keywords</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.keywords}
              onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))}
              placeholder="keyword one, keyword two"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300 md:col-span-2">
            <span>Ideas</span>
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.ideas}
              onChange={(event) => setForm((current) => ({ ...current, ideas: event.target.value }))}
              placeholder="Capture content ideas or campaign concepts"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300 md:col-span-2">
            <span>Notes</span>
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Any research or strategic notes"
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
            {saving ? "Saving..." : editingId ? "Save changes" : "Create project"}
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Saved projects</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Your active workspaces</h2>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-400">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
            No projects yet. Create one to start organizing your content and growth workflow.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{project.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{project.platform}</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                    {project.status}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">{project.goals || "No goals captured yet."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(project.id)}
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
