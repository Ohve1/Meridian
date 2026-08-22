import type { Importance, JobSkill, Skill } from "./types";

const SENIORITY_RULES: { re: RegExp; label: string }[] = [
  { re: /\b(staff|principal|distinguished)\b/i, label: "Staff+" },
  { re: /\b(senior|sr\.?)\b/i, label: "Senior" },
  { re: /\b(junior|jr\.?|graduate|intern)\b/i, label: "Junior" },
  { re: /\b(mid-senior|mid level|mid-level)\b/i, label: "Mid-Senior" },
];

export interface ExtractedJob {
  seniority: string;
  keywords: string[];
  requiredSkills: JobSkill[];
  jobType: string;
}

export function extractFromJd(text: string, skills: Skill[]): ExtractedJob {
  const lower = text.toLowerCase();
  const seniority =
    SENIORITY_RULES.find((r) => r.re.test(text))?.label ?? "Mid";

  const niceSection = /nice[- ]to[- ]have|preferred|plus|bonus/i.test(text);

  const requiredSkills: JobSkill[] = [];
  for (const sk of skills) {
    const hit = [sk.name, ...sk.aliases].some((a) => {
      const needle = a.toLowerCase();
      return lower.includes(needle);
    });
    if (!hit) continue;
    let importance: Importance = "must";
    if (niceSection) {
      const idx = firstIndex(lower, [sk.name, ...sk.aliases]);
      const niceIdx = lower.search(/nice[- ]to[- ]have|preferred|plus|bonus/);
      if (idx >= 0 && niceIdx >= 0 && idx > niceIdx) importance = "nice";
    }
    requiredSkills.push({ skillId: sk.id, importance });
  }

  const keywords = pickKeywords(text);
  const jobType = /\b(contract|freelance)\b/i.test(text)
    ? "contract"
    : /\bintern/i.test(text)
      ? "internship"
      : "full-time";

  return { seniority, keywords, requiredSkills, jobType };
}

function firstIndex(hay: string, aliases: string[]) {
  let min = Infinity;
  for (const a of aliases) {
    const i = hay.indexOf(a.toLowerCase());
    if (i >= 0 && i < min) min = i;
  }
  return min === Infinity ? -1 : min;
}

function pickKeywords(text: string): string[] {
  const candidates = [
    "production",
    "reliability",
    "evaluation",
    "orchestration",
    "tool use",
    "MCP",
    "RAG",
    "agents",
    "stakeholder",
    "roadmap",
    "SQL",
    "Python",
  ];
  const hits = candidates.filter((c) =>
    text.toLowerCase().includes(c.toLowerCase()),
  );
  return hits.slice(0, 6);
}
