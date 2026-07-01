export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { deletePrompt, getPrompt, updatePrompt } from "@/lib/store";

const promptSchema = z.object({
  title: z.string().trim().min(1, "A prompt title is required"),
  category: z.string().trim().min(1, "A category is required"),
  content: z.string().trim().min(1, "Prompt content is required"),
  tags: z.string().trim().optional().or(z.literal("")),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = await getPrompt(id);

  if (!prompt) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json(prompt);
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
  const parsed = promptSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const prompt = await updatePrompt(id, {
    title: parsed.data.title,
    category: parsed.data.category,
    content: parsed.data.content,
    tags: parsed.data.tags ?? null,
  });

  if (!prompt) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json(prompt);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deletePrompt(id);
  if (!deleted) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
