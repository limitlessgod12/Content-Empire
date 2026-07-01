export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteProject, getProject, updateProject } from "@/lib/store";

const projectSchema = z.object({
  title: z.string().trim().min(1, "A project title is required"),
  platform: z.string().trim().min(1, "A platform is required"),
  niche: z.string().trim().optional().or(z.literal("")),
  goals: z.string().trim().optional().or(z.literal("")),
  keywords: z.string().trim().optional().or(z.literal("")),
  status: z.string().trim().optional().or(z.literal("")),
  ideas: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await request.text();
  let payload: unknown = {};
  try {
    payload = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    payload = {};
  }
  const parsed = projectSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const project = await updateProject(id, {
    title: parsed.data.title,
    platform: parsed.data.platform,
    niche: parsed.data.niche ?? null,
    goals: parsed.data.goals ?? null,
    keywords: parsed.data.keywords ?? null,
    status: parsed.data.status || "planning",
    ideas: parsed.data.ideas ?? null,
    notes: parsed.data.notes ?? null,
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteProject(id);
  if (!deleted) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
