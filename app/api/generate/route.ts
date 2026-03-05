
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { retrieveAnchors } from "../../../lib/retrieval";
import type { Brief } from "../../../lib/retrieval";
import { systemPrompt, userPrompt } from "../../../lib/prompt";
import { generateMock } from "../../../lib/mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_COUNTRIES = ["Thailand","Singapore","Vietnam","Indonesia","Philippines"];

export async function POST(req: Request) {
  try {
    const brief = (await req.json()) as Brief;

    if (!ALLOWED_COUNTRIES.includes((brief.country || "").trim())) {
      return NextResponse.json(
        { ok: false, error: "Country must match the library sheet name exactly: Thailand, Singapore, Vietnam, Indonesia, Philippines." },
        { status: 400 }
      );
    }

    const anchors = retrieveAnchors(brief, 24);

    if (!process.env.OPENAI_API_KEY) {
      const data = generateMock(brief, anchors);
      return NextResponse.json({ ok: true, data, mode: "mock" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-5.2";

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: userPrompt(brief, anchors) }
      ]
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty model response");
    const parsed = JSON.parse(content);

    parsed.anchors_used = anchors.slice(0, 12);
    return NextResponse.json({ ok: true, data: parsed, mode: "ai" });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed" }, { status: 500 });
  }
}
