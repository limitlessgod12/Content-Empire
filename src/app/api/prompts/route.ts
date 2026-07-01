export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createPrompt, listPrompts } from "@/lib/store";

const promptSchema = z.object({
  title: z.string().trim().min(1, "A prompt title is required"),
  category: z.string().trim().min(1, "A category is required"),
  content: z.string().trim().min(1, "Prompt content is required"),
  tags: z.string().trim().optional().or(z.literal("")),
});

export async function GET() {
  const prompts = await listPrompts();
  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
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

  const prompt = await createPrompt({
    title: parsed.data.title,
    category: parsed.data.category,
    content: parsed.data.content,
    tags: parsed.data.tags ?? null,
  });

  return NextResponse.json(prompt, { status: 201 });
}
