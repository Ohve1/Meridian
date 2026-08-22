import { pct } from "../utils";
import type {
  Application,
  CVVersion,
  Evidence,
  Job,
  MarketSignal,
  OSState,
  Project,
  SignalTier,
  Skill,
} from "./types";

export interface SkillDemand {
  skillId: string;
  name: string;
  jobs: number;
  must: number;
  pct: number;
  delta: number;
}

export interface SkillGap {
  skillId: string;
  name: string;
  demandPct: number;
  demandJobs: number;
  evidenceStrength: number;
  evidenceCount: number;
  gap: number;
  band: "strong" | "medium" | "weak" | "none";
}

export interface Trend {
  id: string;
  name: string;
  skillIds: string[];
  confidence: { demand: number; technology: number; practitioner: number; hype: number };
  delta30d: number;
  narrative: string;
}

export interface NextAction {
  id: string;
  kind: "project" | "cv" | "followup" | "apply" | "outcome";
  kicker: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  impact?: string;
  effort?: string;
}

export function strengthForSkill(skillId: string, evidence: Evidence[]): number {
  const hits = evidence.filter((e) => e.skillIds.includes(skillId));
  if (hits.length === 0) return 0;
  return Math.max(...hits.map((e) => e.strength));
}

export function band(strength: number): SkillGap["band"] {
  if (strength <= 0) return "none";
  if (strength <= 2) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
}

export function demandBySkill(jobs: Job[], skills: Skill[]): SkillDemand[] {
  return skills
    .map((sk) => {
      const hits = jobs.filter((j) => j.requiredSkills.some((r) => r.skillId === sk.id));
      const must = jobs.filter((j) =>
        j.requiredSkills.some((r) => r.skillId === sk.id && r.importance === "must"),
      ).length;
      return {
        skillId: sk.id,
        name: sk.name,
        jobs: hits.length,
        must,
        pct: pct(hits.length, jobs.length),
        delta: sk.demandDelta,
      };
    })
    .sort((a, b) => b.pct - a.pct);
}

export function gapsForJob(job: Job, evidence: Evidence[], skills: Skill[]): SkillGap[] {
  return job.requiredSkills.map((req) => {
    const sk = skills.find((s) => s.id === req.skillId);
    const strength = strengthForSkill(req.skillId, evidence);
    const count = evidence.filter((e) => e.skillIds.includes(req.skillId)).length;
    const weight = req.importance === "must" ? 2 : 0.9;
    return {
      skillId: req.skillId,
      name: sk?.name ?? req.skillId,
      demandPct: 0,
      demandJobs: 1,
      evidenceStrength: strength,
      evidenceCount: count,
      gap: weight * (5 - strength),
      band: band(strength),
    };
  });
}

export function marketGaps(state: OSState): SkillGap[] {
  const demand = demandBySkill(state.jobs, state.skills);
  return demand
    .map((d) => {
      const strength = strengthForSkill(d.skillId, state.evidence);
      const count = state.evidence.filter((e) => e.skillIds.includes(d.skillId)).length;
      const gapScore = (d.pct / 100) * (1 + Math.max(0, d.delta) / 40) * (5 - strength);
      return {
        skillId: d.skillId,
        name: d.name,
        demandPct: d.pct,
        demandJobs: d.jobs,
        evidenceStrength: strength,
        evidenceCount: count,
        gap: gapScore,
        band: band(strength),
      };
    })
    .sort((a, b) => b.gap - a.gap);
}

export function matchScore(job: Job, evidence: Evidence[]): number {
  if (job.requiredSkills.length === 0) return 0;
  const weighted = job.requiredSkills.map((req) => {
    const s = strengthForSkill(req.skillId, evidence);
    const w = req.importance === "must" ? 1.4 : 0.7;
    return { w, v: (s / 5) * w };
  });
  const tot = weighted.reduce((a, x) => a + x.w, 0);
  return Math.round((weighted.reduce((a, x) => a + x.v, 0) / tot) * 100);
}

export function computeTrends(jobs: Job[], signals: MarketSignal[], skills: Skill[]): Trend[] {
  const demand = demandBySkill(jobs, skills);
  const byTier = (tier: SignalTier, skillId: string) => {
    const pool = signals.filter((s) => s.tier === tier);
    if (pool.length === 0) return 0;
    const hits = pool.filter((s) => s.extractedTopics.includes(skillId));
    const cred =
      hits.reduce((a, s) => a + s.credibility, 0) / Math.max(1, hits.length);
    return Math.min(0.99, (hits.length / pool.length) * 0.7 + cred * 0.3);
  };

  const agents = demand.find((d) => d.skillId === "agents");
  const evalD = demand.find((d) => d.skillId === "evaluation");
  const mcp = demand.find((d) => d.skillId === "mcp");
  const rag = demand.find((d) => d.skillId === "rag");

  const trends: Trend[] = [
    {
      id: "trend_agentic",
      name: "Agentic AI engineering",
      skillIds: ["agents", "mcp", "evaluation"],
      confidence: {
        demand: round2((agents?.pct ?? 0) / 100),
        technology: round2(byTier(2, "agents")),
        practitioner: round2(byTier(3, "agents")),
        hype: round2(byTier(4, "agents")),
      },
      delta30d: skills.find((s) => s.id === "agents")?.demandDelta ?? 0,
      narrative:
        "Agentic AI appears to be an accelerating market capability — demand, tooling, and practitioner talk agree. Hype is loud; do not treat it as demand.",
    },
    {
      id: "trend_eval",
      name: "Evaluation as the bottleneck",
      skillIds: ["evaluation", "observability"],
      confidence: {
        demand: round2((evalD?.pct ?? 0) / 100),
        technology: round2(byTier(2, "evaluation")),
        practitioner: round2(byTier(3, "evaluation")),
        hype: round2(byTier(4, "evaluation")),
      },
      delta30d: skills.find((s) => s.id === "evaluation")?.demandDelta ?? 0,
      narrative:
        "JDs and practitioner threads both treat reliability measurement as the scarce skill, not model choice.",
    },
    {
      id: "trend_mcp",
      name: "Tool use / MCP literacy",
      skillIds: ["mcp", "agents"],
      confidence: {
        demand: round2((mcp?.pct ?? 0) / 100),
        technology: round2(byTier(2, "mcp")),
        practitioner: round2(byTier(3, "mcp")),
        hype: round2(byTier(4, "mcp")),
      },
      delta30d: skills.find((s) => s.id === "mcp")?.demandDelta ?? 0,
      narrative:
        "Technology and practitioner tiers are ahead of raw JD share — a leading indicator, not yet universal demand.",
    },
    {
      id: "trend_rag",
      name: "RAG is table stakes",
      skillIds: ["rag"],
      confidence: {
        demand: round2((rag?.pct ?? 0) / 100),
        technology: round2(byTier(2, "rag")),
        practitioner: round2(byTier(3, "rag")),
        hype: 0.15,
      },
      delta30d: skills.find((s) => s.id === "rag")?.demandDelta ?? 0,
      narrative:
        "Still required, no longer differentiating. Practitioners call it commoditised; JD share is flat.",
    },
  ];
  return trends;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export interface ConversionRow {
  positioning: string;
  apps: number;
  screens: number;
  rate: number;
}

export function conversionByPositioning(
  applications: Application[],
  cvs: CVVersion[],
): ConversionRow[] {
  const groups = new Map<string, { apps: number; screens: number }>();
  for (const app of applications) {
    const cv = cvs.find((c) => c.id === app.cvId);
    const key = cv?.positioning ?? "Unknown";
    const g = groups.get(key) ?? { apps: 0, screens: 0 };
    g.apps += 1;
    if (app.stage === "recruiter" || app.stage === "interview" || app.stage === "offer") {
      g.screens += 1;
    }
    groups.set(key, g);
  }
  return [...groups.entries()]
    .map(([positioning, g]) => ({
      positioning,
      apps: g.apps,
      screens: g.screens,
      rate: g.apps ? Math.round((g.screens / g.apps) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate);
}

export function nextActions(state: OSState): NextAction[] {
  const actions: NextAction[] = [];
  const now = Date.now();
  const gaps = marketGaps(state);
  const topGap = gaps[0];
  const demand = demandBySkill(state.jobs, state.skills);

  const stale = state.applications.filter((a) => {
    if (a.stage !== "applied") return false;
    const days = (now - new Date(a.date).getTime()) / 86400000;
    return days >= 6;
  });
  for (const a of stale) {
    const job = state.jobs.find((j) => j.id === a.jobId);
    if (!job) continue;
    const days = Math.round((now - new Date(a.date).getTime()) / 86400000);
    actions.push({
      id: `follow_${a.id}`,
      kind: "followup",
      kicker: "Follow up",
      title: `${job.company}`,
      body: `Applied ${days} days ago. Still sitting at Applied — a short follow-up is cheaper than another cold application.`,
      cta: "Open pipeline",
      href: "/pipeline",
      impact: `${job.title}`,
    });
  }

  if (topGap && topGap.band !== "strong") {
    const proj =
      state.projects.find(
        (p) =>
          p.status !== "completed" && p.targetSkillIds.includes(topGap.skillId),
      ) ?? state.projects.find((p) => p.status === "planned");
    if (proj) {
      const nJobs = demand.find((d) => d.skillId === topGap.skillId)?.jobs ?? topGap.demandJobs;
      actions.push({
        id: `proj_${proj.id}`,
        kind: "project",
        kicker: "Next action",
        title: proj.name,
        body: `Largest market-relevant evidence gap: ${topGap.name} (${topGap.evidenceStrength}/5). ${nJobs} target jobs ask for it.`,
        cta: proj.status === "planned" ? "Start project" : "Open project",
        href: "/projects",
        effort: proj.estimatedDays,
        impact: `Strengthens ${proj.targetJobIds.length || nJobs} applications`,
      });
    }
  }

  const unapplied = state.jobs
    .filter((j) => j.status === "watching" || j.status === "ready")
    .map((j) => ({ job: j, score: matchScore(j, state.evidence) }))
    .sort((a, b) => b.score - a.score);
  const ready = unapplied.find((x) => x.score >= 70);
  if (ready) {
    actions.push({
      id: `cv_${ready.job.id}`,
      kind: "cv",
      kicker: "CV ready",
      title: `${ready.job.title} — ${ready.job.company}`,
      body: `Match ${ready.score}%. Evidence already covers the must-haves well enough to ship a version, not another week of polishing.`,
      cta: "Review match",
      href: `/jobs/${ready.job.id}`,
      impact: `${ready.score}% match`,
    });
  }

  const conv = conversionByPositioning(state.applications, state.cvs);
  const weak = conv.find((c) => c.apps >= 3 && c.rate <= 25);
  const strong = conv.find((c) => c.rate >= 50);
  if (weak && strong) {
    actions.push({
      id: "outcome_reposition",
      kind: "outcome",
      kicker: "Market feedback",
      title: `${strong.positioning} converts. ${weak.positioning} does not.`,
      body: `${strong.positioning}: ${strong.screens}/${strong.apps} screens. ${weak.positioning}: ${weak.screens}/${weak.apps}. Current evidence matches the product/strategy market more than pure engineering.`,
      cta: "See pipeline",
      href: "/pipeline",
    });
  }

  return actions;
}

export function relevantEvidence(job: Job, evidence: Evidence[]): Evidence[] {
  const required = new Set(job.requiredSkills.map((s) => s.skillId));
  return [...evidence]
    .map((e) => ({
      e,
      score: e.skillIds.filter((s) => required.has(s)).length * e.strength,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.e);
}

export function rankEvidenceForCV(job: Job, evidence: Evidence[]): Evidence[] {
  return relevantEvidence(job, evidence).slice(0, 5);
}

export function suggestedProjectForGap(gap: SkillGap, jobs: Job[]): Omit<Project, "id" | "createdAt"> {
  const targetJobIds = jobs
    .filter((j) => j.requiredSkills.some((r) => r.skillId === gap.skillId))
    .slice(0, 6)
    .map((j) => j.id);
  if (gap.skillId === "evaluation") {
    return {
      name: "Production agent evaluation framework",
      description: "Trajectory eval, tool-call correctness, regression set. The evidence this market is actually buying.",
      targetSkillIds: ["evaluation", "agents", "python"],
      targetJobIds,
      status: "planned",
      estimatedDays: "3–5 days",
      suggestedEvidence: [
        "Implemented a trajectory-level evaluation harness",
        "Benchmarked 3 agent strategies on tool-call correctness",
        "Published a regression set that catches a known failure mode",
      ],
    };
  }
  if (gap.skillId === "mcp") {
    return {
      name: "MCP tool-use workshop",
      description: "Two real tools through MCP, measured selection accuracy.",
      targetSkillIds: ["mcp", "agents"],
      targetJobIds,
      status: "planned",
      estimatedDays: "2–4 days",
      suggestedEvidence: [
        "Shipped an MCP server exposing two tools",
        "Measured tool-selection accuracy against a gold set",
      ],
    };
  }
  return {
    name: `${gap.name} evidence sprint`,
    description: `A short, verifiable artefact aimed at the ${gap.name} gap the market is currently pricing.`,
    targetSkillIds: [gap.skillId],
    targetJobIds,
    status: "planned",
    estimatedDays: "2–4 days",
    suggestedEvidence: [`Shipped a verifiable ${gap.name} artefact with a measured result`],
  };
}

export function daysAgo(iso: string, now = Date.now()) {
  return Math.max(0, Math.round((now - new Date(iso).getTime()) / 86400000));
}
