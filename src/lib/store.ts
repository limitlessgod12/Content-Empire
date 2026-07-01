import { promises as fs } from "fs";
import path from "path";

export type ProjectRecord = {
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

export type PromptRecord = {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
};

type StoreData = {
  projects: ProjectRecord[];
  prompts: PromptRecord[];
};

const storePath = path.join(process.cwd(), "data", "app-data.json");

async function readStore(): Promise<StoreData> {
  try {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    const raw = await fs.readFile(storePath, "utf-8");
    if (!raw.trim()) {
      return { projects: [], prompts: [] };
    }
    return JSON.parse(raw) as StoreData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeStore({ projects: [], prompts: [] });
      return { projects: [], prompts: [] };
    }
    throw error;
  }
}

async function writeStore(data: StoreData) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function listProjects() {
  const data = await readStore();
  return data.projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function createProject(input: Omit<ProjectRecord, "id" | "createdAt" | "updatedAt">) {
  const data = await readStore();
  const now = new Date().toISOString();
  const project: ProjectRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  data.projects = [project, ...data.projects];
  await writeStore(data);
  return project;
}

export async function getProject(id: string) {
  const data = await readStore();
  return data.projects.find((project) => project.id === id) ?? null;
}

export async function updateProject(id: string, input: Omit<ProjectRecord, "id" | "createdAt" | "updatedAt">) {
  const data = await readStore();
  const index = data.projects.findIndex((project) => project.id === id);
  if (index === -1) {
    return null;
  }
  const updated: ProjectRecord = {
    ...data.projects[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  data.projects[index] = updated;
  await writeStore(data);
  return updated;
}

export async function deleteProject(id: string) {
  const data = await readStore();
  const next = data.projects.filter((project) => project.id !== id);
  if (next.length === data.projects.length) {
    return false;
  }
  data.projects = next;
  await writeStore(data);
  return true;
}

export async function listPrompts() {
  const data = await readStore();
  return data.prompts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function createPrompt(input: Omit<PromptRecord, "id" | "createdAt" | "updatedAt">) {
  const data = await readStore();
  const now = new Date().toISOString();
  const prompt: PromptRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  data.prompts = [prompt, ...data.prompts];
  await writeStore(data);
  return prompt;
}

export async function getPrompt(id: string) {
  const data = await readStore();
  return data.prompts.find((prompt) => prompt.id === id) ?? null;
}

export async function updatePrompt(id: string, input: Omit<PromptRecord, "id" | "createdAt" | "updatedAt">) {
  const data = await readStore();
  const index = data.prompts.findIndex((prompt) => prompt.id === id);
  if (index === -1) {
    return null;
  }
  const updated: PromptRecord = {
    ...data.prompts[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  data.prompts[index] = updated;
  await writeStore(data);
  return updated;
}

export async function deletePrompt(id: string) {
  const data = await readStore();
  const next = data.prompts.filter((prompt) => prompt.id !== id);
  if (next.length === data.prompts.length) {
    return false;
  }
  data.prompts = next;
  await writeStore(data);
  return true;
}
