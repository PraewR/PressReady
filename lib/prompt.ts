
import type { Brief, LibraryItem } from "./retrieval";

export function systemPrompt() {
  return [
    "You are PressReady — an AI-powered media interview preparation system for PR consultants.",
    "Simulate how journalists actually question executives: direct, conversational, occasionally skeptical.",
    "Do NOT produce PR-coded questions. Avoid corporate fluff.",
    "Do NOT invent confidential facts. Use placeholders like [Company], [Metric] when needed.",
    "Return ONLY valid JSON."
  ].join("\n");
}

export function userPrompt(brief: Brief, anchors: LibraryItem[]) {
  const anchorLines = anchors.slice(0, 24).map((a) => {
    const meta = [a.category, a.scenario, a.tone].filter(Boolean).join(" | ");
    return `- (${a.id}) ${meta}: ${a.question}`;
  }).join("\n");

  return [
    "## Brief",
    `Client: ${brief.client}`,
    `Industry: ${brief.industry}`,
    `Country (must match sheet name): ${brief.country}`,
    `Announcement topic: ${brief.topic}`,
    `Key messages: ${brief.messages}`,
    `Sensitive issues: ${brief.risks}`,
    `Media outlet: ${brief.mediaOutlet || ""}`,
    `Journalist name (optional): ${brief.journalistName || ""}`,
    `Interview format: ${brief.interviewFormat || ""}`,
    `Spokesperson role (optional): ${brief.spokespersonRole || ""}`,
    "",
    "## Anchor questions (from Vero library)",
    "Use these as behavioral patterns for framing and escalation. Do not copy verbatim.",
    anchorLines,
    "",
    "## Output JSON schema (keys must match)",
    JSON.stringify({
      likely_questions: [{
        id: "LQ-1",
        question: "string",
        difficulty: "Easy|Medium|Hard",
        intent: "Clarify|Verify|Challenge|Compare|Accountability|Human Impact",
        rationale: "why a journalist would ask"
      }],
      tough_questions: [{
        id: "TQ-1",
        question: "string",
        difficulty: "Easy|Medium|Hard",
        intent: "Clarify|Verify|Challenge|Compare|Accountability|Human Impact",
        rationale: "why this is difficult"
      }],
      followups_and_traps: [{
        base_question_id: "LQ-1 or TQ-1",
        followups: [{
          question: "string",
          trap_type: "Proof Gap|Pressure|Contradiction|Numbers|Accountability|Reputation|Ethics|Human Impact",
          rationale: "what it is trying to expose"
        }]
      }],
      theme_buckets: [{ theme: "string", questions: ["LQ-1","TQ-2"] }],
      spokesperson_coaching: {
        talking_points: ["string"],
        bridging_lines: ["string"],
        evidence_to_prepare: ["string"]
      },
      quick_clarifiers: ["up to 3 questions to improve accuracy next round"]
    }, null, 2),
    "",
    "Now generate:",
    "- Top 12 Likely Questions (most probable first)",
    "- 6–10 Tough Questions (high-pressure)",
    "- Follow-ups & Traps paired to base question IDs",
    "- Theme buckets referencing question IDs",
    "- Spokesperson coaching",
    "- Up to 3 quick clarifiers (only if missing info)"
  ].join("\n");
}
