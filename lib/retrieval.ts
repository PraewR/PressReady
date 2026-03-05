
import library from "../data/question_library.json";

export type LibraryItem = {
  id: string;
  country: string;
  client: string;
  industry: string;
  category: string;
  scenario: string;
  tone: string;
  question: string;
};

export type Brief = {
  client: string;
  industry: string;
  country: string;
  topic: string;
  messages: string;
  risks: string;
  mediaOutlet?: string;
  journalistName?: string;
  interviewFormat?: string;
  spokespersonRole?: string;
};

function tokenize(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 500);
}

export function retrieveAnchors(brief: Brief, k = 24): LibraryItem[] {
  const items: LibraryItem[] = (library as any).items || [];
  const country = (brief.country || "").trim();
  const pool = items.filter((x) => x.country === country);

  const queryTokens = new Set([
    ...tokenize(brief.client),
    ...tokenize(brief.industry),
    ...tokenize(brief.topic),
    ...tokenize(brief.messages),
    ...tokenize(brief.risks),
    ...tokenize(brief.mediaOutlet || ""),
  ]);

  function score(it: LibraryItem) {
    const text = `${it.client} ${it.industry} ${it.category} ${it.scenario} ${it.tone} ${it.question}`;
    const toks = tokenize(text);
    let s = 0;
    for (const t of toks) if (queryTokens.has(t)) s += 1;

    if (it.industry && brief.industry && it.industry.toLowerCase().includes(brief.industry.toLowerCase())) s += 8;
    if (it.category && (brief.risks || "").toLowerCase().includes(it.category.toLowerCase())) s += 5;
    return s;
  }

  const ranked = pool
    .map((x) => ({ x, s: score(x) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((r) => r.x);

  return ranked.length ? ranked : pool.slice(0, k);
}
