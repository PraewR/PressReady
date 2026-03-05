
import type { Brief, LibraryItem } from "./retrieval";

const intents = ["Clarify","Verify","Challenge","Compare","Accountability","Human Impact"] as const;
const diffs = ["Easy","Medium","Hard"] as const;
const trapTypes = ["Proof Gap","Pressure","Contradiction","Numbers","Accountability","Reputation","Ethics","Human Impact"] as const;

function pick<T>(arr: readonly T[], i: number) { return arr[i % arr.length]; }

export function generateMock(brief: Brief, anchors: LibraryItem[]) {
  const likely = Array.from({length: 12}).map((_,i)=>({
    id: `LQ-${i+1}`,
    question: anchors[i]?.question || `How does this announcement change your strategy in ${brief.country}?`,
    difficulty: pick(diffs, i),
    intent: pick(intents, i),
    rationale: "A journalist will clarify the announcement and its implications."
  }));

  const tough = Array.from({length: 8}).map((_,i)=>({
    id: `TQ-${i+1}`,
    question: `What evidence supports your key claim — and what would you say to skeptics about ${brief.risks || "risk"}?`,
    difficulty: "Hard" as const,
    intent: pick(intents, i+2),
    rationale: "High-pressure challenge on credibility and accountability."
  }));

  const followups = [
    {
      base_question_id: "LQ-1",
      followups: [
        { question: "What independent proof can you point to (audits, partners, benchmarks)?", trap_type: pick(trapTypes, 0), rationale: "Forces external validation." },
        { question: "If you can’t share numbers, why should audiences trust this claim?", trap_type: pick(trapTypes, 1), rationale: "Pressure test on transparency." }
      ]
    }
  ];

  const themes = [
    { theme: "Strategy & Positioning", questions: ["LQ-1","LQ-2","TQ-1"] },
    { theme: "Proof & Credibility", questions: ["LQ-3","TQ-2","TQ-3"] },
    { theme: "Risk & Accountability", questions: ["TQ-4","TQ-5"] }
  ];

  return {
    likely_questions: likely,
    tough_questions: tough,
    followups_and_traps: followups,
    theme_buckets: themes,
    spokesperson_coaching: {
      talking_points: [
        "State the announcement in one sentence, then explain the benefit in plain language.",
        "Use one concrete proof point per claim (data, customer example, third-party validation)."
      ],
      bridging_lines: [
        "The key point is…",
        "What matters for customers is…",
        "Let me put that in context…"
      ],
      evidence_to_prepare: [
        "Third-party validation for key claims (audits, benchmarks, partners)",
        "Clear scope, timeline, and definition of success"
      ]
    },
    quick_clarifiers: [
      "What is the most important public proof point you can share?",
      "What is the biggest concern you expect journalists to raise?",
      "Who is the spokesperson and what is their role/title?"
    ]
  };
}
