import type {
  Application,
  CVVersion,
  Evidence,
  Job,
  MarketSignal,
  OSState,
  Profile,
  Project,
  Skill,
} from "./types";

export const PROFILE: Profile = {
  name: "Kenbun",
  location: "London, UK",
  focus: "AI Engineer · AI Product",
};

export const SKILLS: Skill[] = [
  {
    id: "python",
    name: "Python",
    layer: "technology",
    aliases: ["python", "fastapi", "pandas"],
    description: "Production Python for backends, data, and eval harnesses.",
    demandDelta: 2,
  },
  {
    id: "llm",
    name: "LLM",
    layer: "capability",
    aliases: ["llm", "large language", "gpt", "transformer", "foundation model"],
    description: "Working with large language models in products.",
    demandDelta: 8,
  },
  {
    id: "rag",
    name: "RAG",
    layer: "capability",
    aliases: ["rag", "retrieval augmented", "retrieval-augmented", "vector search", "embeddings"],
    description: "Retrieval-augmented generation systems.",
    demandDelta: 5,
  },
  {
    id: "agents",
    name: "Agentic AI",
    layer: "capability",
    aliases: ["agent", "agentic", "multi-agent", "orchestration", "langgraph"],
    description: "Designing and shipping agentic systems.",
    demandDelta: 42,
  },
  {
    id: "evaluation",
    name: "LLM Evaluation",
    layer: "capability",
    aliases: ["eval", "evaluation", "benchmark", "llm-as-judge", "reliability", "recall@"],
    description: "Measuring quality, reliability, and regressions of LLM systems.",
    demandDelta: 37,
  },
  {
    id: "mcp",
    name: "MCP",
    layer: "technology",
    aliases: ["mcp", "model context protocol", "tool use", "tool calling", "function calling"],
    description: "Tool use and Model Context Protocol integrations.",
    demandDelta: 31,
  },
  {
    id: "product",
    name: "AI Product",
    layer: "skill",
    aliases: ["product", "roadmap", "discovery", "user research", "pm"],
    description: "Shaping AI products from problem to shipped surface.",
    demandDelta: 11,
  },
  {
    id: "strategy",
    name: "Strategy",
    layer: "skill",
    aliases: ["strategy", "economics", "game theory", "business case"],
    description: "Structuring messy markets into decisions.",
    demandDelta: 4,
  },
  {
    id: "communication",
    name: "Communication",
    layer: "skill",
    aliases: ["communication", "stakeholder", "writing", "presentation"],
    description: "Clear writing and stakeholder work.",
    demandDelta: 1,
  },
  {
    id: "cloud",
    name: "Cloud",
    layer: "technology",
    aliases: ["aws", "gcp", "azure", "cloud", "kubernetes"],
    description: "Cloud infrastructure for ML systems.",
    demandDelta: -3,
  },
  {
    id: "sql",
    name: "SQL",
    layer: "technology",
    aliases: ["sql", "warehouse", "analytics engineering"],
    description: "Analytical SQL and warehouse work.",
    demandDelta: 0,
  },
  {
    id: "backend",
    name: "Backend",
    layer: "skill",
    aliases: ["backend", "api", "service", "production system"],
    description: "Shipping reliable backend services.",
    demandDelta: 6,
  },
  {
    id: "observability",
    name: "AI Observability",
    layer: "capability",
    aliases: ["observability", "tracing", "monitoring", "telemetry"],
    description: "Tracing and monitoring production agents.",
    demandDelta: 19,
  },
];

function job(
  partial: Omit<Job, "candidateEvidenceIds" | "createdAt" | "jobType" | "priority"> &
    Partial<Pick<Job, "candidateEvidenceIds" | "createdAt" | "jobType" | "priority" | "salary" | "url" | "deadline">>,
): Job {
  return {
    jobType: "full-time",
    priority: "medium",
    candidateEvidenceIds: [],
    createdAt: "2026-08-12",
    ...partial,
  };
}

export const JOBS: Job[] = [
  job({
    id: "job_anthropic",
    company: "Anthropic",
    title: "AI Business Analyst",
    location: "London",
    seniority: "Mid",
    salary: "£90–120k",
    status: "watching",
    priority: "high",
    description:
      "Partner with GTM and product to size AI deployment opportunities. Translate customer problems into evaluation criteria for Claude-based workflows. Must-have: structured problem solving, product sense, and the ability to brief researchers. Nice-to-have: light Python and LLM evaluation literacy.",
    requiredSkills: [
      { skillId: "product", importance: "must" },
      { skillId: "strategy", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "communication", importance: "must" },
      { skillId: "evaluation", importance: "nice" },
    ],
    keywords: ["evaluation criteria", "Claude", "GTM", "problem solving"],
    url: "https://www.anthropic.com/careers",
  }),
  job({
    id: "job_deepmind",
    company: "Google DeepMind",
    title: "Research Engineer, Agents",
    location: "London",
    seniority: "Mid-Senior",
    salary: "£120–160k",
    status: "watching",
    priority: "high",
    description:
      "Build and evaluate agentic systems for research prototypes moving toward product. Required: Python, multi-agent orchestration, LLM evaluation, and production-minded backend work. Experience with tool use and reliability measurement is a strong plus.",
    requiredSkills: [
      { skillId: "python", importance: "must" },
      { skillId: "agents", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "evaluation", importance: "must" },
      { skillId: "backend", importance: "must" },
      { skillId: "mcp", importance: "nice" },
    ],
    keywords: ["multi-agent", "reliability", "tool use", "orchestration"],
  }),
  job({
    id: "job_google_pa",
    company: "Google",
    title: "AI Product Analyst",
    location: "London",
    seniority: "Mid",
    salary: "£85–110k",
    status: "ready",
    priority: "high",
    description:
      "Measure how Gemini features land with users. Mix product analytics, SQL, and qualitative research. You will define success metrics for agentic surfaces and brief PMs. LLM literacy required; RAG experience helpful.",
    requiredSkills: [
      { skillId: "product", importance: "must" },
      { skillId: "sql", importance: "must" },
      { skillId: "strategy", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "rag", importance: "nice" },
    ],
    keywords: ["Gemini", "success metrics", "agentic surfaces"],
  }),
  job({
    id: "job_adept",
    company: "Adept",
    title: "Agent Engineer",
    location: "Remote UK",
    seniority: "Mid",
    salary: "£100–140k",
    status: "watching",
    description:
      "Ship production agents that take actions in software via tool calling and MCP. Required: Python, agent orchestration, evaluation harnesses. We care more about reliability than demos.",
    requiredSkills: [
      { skillId: "agents", importance: "must" },
      { skillId: "mcp", importance: "must" },
      { skillId: "python", importance: "must" },
      { skillId: "evaluation", importance: "must" },
      { skillId: "backend", importance: "nice" },
    ],
    keywords: ["MCP", "tool calling", "reliability", "production agents"],
  }),
  job({
    id: "job_cohere",
    company: "Cohere",
    title: "Applied AI Engineer",
    location: "London",
    seniority: "Mid",
    status: "applied",
    description:
      "Build RAG systems on Command models for enterprise search. Python, retrieval, backend APIs. Evaluation of retrieval quality is increasingly important.",
    requiredSkills: [
      { skillId: "rag", importance: "must" },
      { skillId: "python", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "backend", importance: "must" },
      { skillId: "evaluation", importance: "nice" },
    ],
    keywords: ["enterprise search", "Command", "retrieval quality"],
  }),
  job({
    id: "job_palantir",
    company: "Palantir",
    title: "Forward Deployed AI Engineer",
    location: "London",
    seniority: "Mid",
    status: "applied",
    description:
      "Embed with customers to productionise LLM workflows. Python, product judgement, communication with operators. Agent tooling is showing up in more deployments.",
    requiredSkills: [
      { skillId: "python", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "product", importance: "must" },
      { skillId: "communication", importance: "must" },
      { skillId: "agents", importance: "nice" },
    ],
    keywords: ["forward deployed", "productionise", "operators"],
  }),
  job({
    id: "job_intercom",
    company: "Intercom",
    title: "AI Engineer",
    location: "London",
    seniority: "Mid",
    status: "applied",
    description:
      "Fin, Intercom's AI agent, needs better tool use, RAG over workspace data, and evaluation of conversation quality. Python, agents, RAG required.",
    requiredSkills: [
      { skillId: "rag", importance: "must" },
      { skillId: "agents", importance: "must" },
      { skillId: "python", importance: "must" },
      { skillId: "evaluation", importance: "must" },
      { skillId: "llm", importance: "must" },
    ],
    keywords: ["Fin", "conversation quality", "workspace data"],
  }),
  job({
    id: "job_darktrace",
    company: "Darktrace",
    title: "ML Engineer",
    location: "Cambridge",
    seniority: "Mid",
    status: "applied",
    description:
      "Apply LLMs to threat detection. Python, cloud, and the ability to evaluate model precision in high-cost-of-error settings.",
    requiredSkills: [
      { skillId: "python", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "cloud", importance: "must" },
      { skillId: "evaluation", importance: "nice" },
    ],
    keywords: ["threat detection", "precision", "high-cost-of-error"],
  }),
  job({
    id: "job_faculty",
    company: "Faculty",
    title: "AI Consultant",
    location: "London",
    seniority: "Mid",
    status: "applied",
    priority: "high",
    description:
      "Advise UK government and enterprise on applied AI. Strategy, communication, LLM literacy. Growing demand for agent workflow design.",
    requiredSkills: [
      { skillId: "strategy", importance: "must" },
      { skillId: "product", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "communication", importance: "must" },
      { skillId: "agents", importance: "nice" },
    ],
    keywords: ["government", "enterprise", "workflow design"],
  }),
  job({
    id: "job_wayve",
    company: "Wayve",
    title: "ML Engineer, Evaluation",
    location: "London",
    seniority: "Mid",
    status: "watching",
    description:
      "Build evaluation pipelines for foundation models in autonomy. Python, evaluation design, cloud. Not a classic RAG role.",
    requiredSkills: [
      { skillId: "python", importance: "must" },
      { skillId: "evaluation", importance: "must" },
      { skillId: "cloud", importance: "must" },
      { skillId: "llm", importance: "nice" },
    ],
    keywords: ["autonomy", "evaluation pipelines", "foundation models"],
  }),
  job({
    id: "job_stability",
    company: "Stability AI",
    title: "AI Engineer",
    location: "London",
    seniority: "Mid",
    status: "applied",
    description:
      "Backend for generative systems. Python, RAG over internal research, production APIs. Agents are on the 2026 roadmap.",
    requiredSkills: [
      { skillId: "python", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "backend", importance: "must" },
      { skillId: "rag", importance: "must" },
      { skillId: "agents", importance: "nice" },
    ],
    keywords: ["generative", "production APIs", "roadmap"],
  }),
  job({
    id: "job_multiverse",
    company: "Multiverse",
    title: "AI Product Manager",
    location: "London",
    seniority: "Mid",
    status: "watching",
    description:
      "Own the apprentice-facing AI tutor. Product discovery, LLM product sense, light evaluation of learning outcomes. SQL a plus.",
    requiredSkills: [
      { skillId: "product", importance: "must" },
      { skillId: "strategy", importance: "must" },
      { skillId: "llm", importance: "must" },
      { skillId: "evaluation", importance: "nice" },
      { skillId: "sql", importance: "nice" },
    ],
    keywords: ["tutor", "learning outcomes", "discovery"],
  }),
  job({
    id: "job_bcgx",
    company: "BCG X",
    title: "AI Engineer",
    location: "London",
    seniority: "Mid",
    status: "watching",
    description:
      "Build client-facing agent prototypes. Python, RAG, agents, enough product sense to sit with partners. MCP familiarity helpful.",
    requiredSkills: [
      { skillId: "python", importance: "must" },
      { skillId: "rag", importance: "must" },
      { skillId: "agents", importance: "must" },
      { skillId: "product", importance: "must" },
      { skillId: "mcp", importance: "nice" },
    ],
    keywords: ["client-facing", "prototypes", "partners"],
  }),
  job({
    id: "job_eleven",
    company: "ElevenLabs",
    title: "Agent Platform Engineer",
    location: "Remote UK",
    seniority: "Senior",
    status: "watching",
    priority: "medium",
    description:
      "Conversational agents in production. Tool calling, MCP, evaluation of voice-agent reliability, observability. Python and backend required.",
    requiredSkills: [
      { skillId: "agents", importance: "must" },
      { skillId: "mcp", importance: "must" },
      { skillId: "evaluation", importance: "must" },
      { skillId: "observability", importance: "must" },
      { skillId: "python", importance: "must" },
      { skillId: "backend", importance: "must" },
    ],
    keywords: ["voice-agent", "reliability", "tool calling"],
  }),
];

export const SIGNALS: MarketSignal[] = [
  {
    id: "sig_barometer",
    source: "PwC UK AI Jobs Barometer 2026",
    sourceType: "NEWS",
    tier: 1,
    timestamp: "2026-08-04",
    rawContent:
      "UK specialist AI job postings up 61% year on year. Fastest growth in agentic systems, evaluation, and applied product roles — not generic prompt engineering.",
    credibility: 0.92,
    extractedTopics: ["agents", "evaluation", "product"],
  },
  {
    id: "sig_adept_jd",
    source: "Adept careers",
    sourceType: "JOB",
    tier: 1,
    timestamp: "2026-08-18",
    author: "Adept recruiting",
    rawContent:
      "Agent Engineer posting emphasises production reliability, MCP, and evaluation harnesses over demo-quality agents.",
    credibility: 0.95,
    extractedTopics: ["agents", "mcp", "evaluation"],
    jobId: "job_adept",
  },
  {
    id: "sig_dm_agents",
    source: "DeepMind careers",
    sourceType: "JOB",
    tier: 1,
    timestamp: "2026-08-16",
    rawContent:
      "Research Engineer, Agents: orchestration + evaluation as first-class requirements in a London posting.",
    credibility: 0.95,
    extractedTopics: ["agents", "evaluation"],
    jobId: "job_deepmind",
  },
  {
    id: "sig_paper_eval",
    source: "arXiv",
    sourceType: "PAPER",
    tier: 2,
    timestamp: "2026-08-09",
    author: "Various",
    rawContent:
      "Wave of papers on agentic RAG plus process-level evaluation. Benchmarks shifting from single-turn QA to tool-using trajectories.",
    credibility: 0.84,
    extractedTopics: ["agents", "rag", "evaluation"],
  },
  {
    id: "sig_mcp_gh",
    source: "GitHub — modelcontextprotocol",
    sourceType: "GITHUB",
    tier: 2,
    timestamp: "2026-08-14",
    rawContent:
      "MCP server ecosystem still compounding. Tool-use adapters showing up in agent frameworks as the default integration layer.",
    credibility: 0.88,
    extractedTopics: ["mcp", "agents"],
  },
  {
    id: "sig_langgraph",
    source: "LangChain engineering blog",
    sourceType: "COMPANY",
    tier: 2,
    timestamp: "2026-08-11",
    rawContent:
      "LangGraph durable execution and eval integrations. The pitch has moved from 'build an agent' to 'operate an agent'.",
    credibility: 0.8,
    extractedTopics: ["agents", "evaluation", "observability"],
  },
  {
    id: "sig_reddit",
    source: "r/MachineLearning",
    sourceType: "REDDIT",
    tier: 3,
    timestamp: "2026-08-17",
    author: "thread",
    rawContent:
      "Consensus forming: RAG is commoditised. Production agents are hard. Evaluation is the bottleneck. Tool calling / MCP is the new literacy.",
    credibility: 0.62,
    engagement: 840,
    extractedTopics: ["rag", "agents", "evaluation", "mcp"],
  },
  {
    id: "sig_x_eng",
    source: "X — AI engineer thread",
    sourceType: "X",
    tier: 3,
    timestamp: "2026-08-19",
    author: "@applied-eng",
    rawContent:
      "Three-post sequence: MCP → tool use → agent orchestration. Comments keep returning to eval harnesses, not model choice.",
    credibility: 0.58,
    engagement: 1200,
    extractedTopics: ["mcp", "agents", "evaluation"],
  },
  {
    id: "sig_li_hiring",
    source: "LinkedIn hiring posts",
    sourceType: "LINKEDIN",
    tier: 3,
    timestamp: "2026-08-20",
    rawContent:
      "London recruiters posting 'Agent Engineer' more than 'RAG Engineer' for the second consecutive month.",
    credibility: 0.7,
    extractedTopics: ["agents", "rag"],
  },
  {
    id: "sig_hype",
    source: "Weekend tech press",
    sourceType: "NEWS",
    tier: 4,
    timestamp: "2026-08-16",
    rawContent:
      "Viral claim that agents will replace junior software roles this year. High engagement, low hiring-data support.",
    credibility: 0.28,
    engagement: 24000,
    extractedTopics: ["agents"],
  },
];

export const EVIDENCE: Evidence[] = [
  {
    id: "ev_sertie_agent",
    title: "Built an AI mentor agent at Sertie",
    summary:
      "Shipped a mentor agent that routes learner questions, calls internal tools, and drafts feedback. Production-adjacent, not a notebook.",
    source: "Sertie",
    strength: 4,
    skillIds: ["llm", "agents", "product", "python"],
    verifiablePoints: [
      "Designed tool-routing for a mentor agent used by real learners",
      "Shipped the workflow into Sertie's backend, not a prototype chat",
      "Partnered with product on failure cases and escalation",
    ],
    createdAt: "2026-03-12",
  },
  {
    id: "ev_sertie_rag",
    title: "RAG backend workflow at Sertie",
    summary:
      "Retrieval over curriculum and session notes. Hybrid search, citation of sources, basic offline checks — not a full eval suite.",
    source: "Sertie",
    strength: 4,
    skillIds: ["rag", "backend", "python", "llm"],
    verifiablePoints: [
      "Implemented hybrid retrieval over internal content",
      "Exposed a backend workflow with source citations",
      "Wrote a small regression set of questions — not a benchmark",
    ],
    createdAt: "2026-02-02",
  },
  {
    id: "ev_msc",
    title: "MSc applied project",
    summary: "End-to-end prototype combining retrieval and a lightweight agent loop for a research question.",
    source: "MSc",
    strength: 3,
    skillIds: ["python", "llm", "rag"],
    verifiablePoints: [
      "Built a retrieval + generation prototype from scratch",
      "Documented failure modes in the write-up",
    ],
    createdAt: "2025-09-01",
  },
  {
    id: "ev_game_theory",
    title: "Game theory dissertation + economics degree",
    summary:
      "Formal training in incentives, strategy, and messy markets. The rare evidence that is actually a degree.",
    source: "University",
    strength: 5,
    skillIds: ["strategy", "communication"],
    verifiablePoints: [
      "First-class economics degree",
      "Dissertation on strategic interaction under incomplete information",
    ],
    createdAt: "2024-07-01",
  },
  {
    id: "ev_analytics",
    title: "Product analytics at a startup",
    summary: "Defined metrics, SQL, and the narrative that moved a roadmap. Human stakeholders, not dashboards for their own sake.",
    source: "Startup",
    strength: 4,
    skillIds: ["product", "sql", "communication", "strategy"],
    verifiablePoints: [
      "Owned a product metric stack used in weekly decisions",
      "Wrote the strategy memo that killed a feature",
    ],
    createdAt: "2025-04-18",
  },
  {
    id: "ev_personal_rag",
    title: "Personal RAG prototype",
    summary: "Weekend retrieval system over personal notes. Useful as a learning artefact, weak as proof of production judgement.",
    source: "Personal",
    strength: 3,
    skillIds: ["rag", "python"],
    verifiablePoints: ["Working prototype with vector search and citations"],
    createdAt: "2026-01-20",
  },
  {
    id: "ev_course_eval",
    title: "Coursework evaluation write-up",
    summary: "A homework-scale eval: a handful of prompts, no harness, no regression story. Honest weak signal.",
    source: "Coursework",
    strength: 1,
    skillIds: ["evaluation", "llm"],
    verifiablePoints: ["Compared three prompting strategies on a toy set"],
    createdAt: "2025-11-02",
  },
  {
    id: "ev_stakeholders",
    title: "Stakeholder communication across functions",
    summary: "Repeated evidence of briefing non-technical partners without losing the technical claim.",
    source: "Sertie + startup",
    strength: 4,
    skillIds: ["communication", "product"],
    verifiablePoints: [
      "Ran weekly briefings with non-technical stakeholders",
      "Turned ambiguous asks into scoped experiments",
    ],
    createdAt: "2026-05-01",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "proj_eval",
    name: "Production agent evaluation framework",
    description:
      "A small, honest eval harness: trajectory scoring, tool-call correctness, and a regression set against 3 agent strategies. This is the evidence the London market is paying for.",
    targetSkillIds: ["evaluation", "agents", "python"],
    targetJobIds: ["job_deepmind", "job_adept", "job_intercom", "job_eleven", "job_wayve"],
    status: "planned",
    estimatedDays: "3–5 days",
    suggestedEvidence: [
      "Implemented a trajectory-level evaluation harness",
      "Benchmarked 3 agent strategies on tool-call correctness",
      "Published a regression set that catches a known failure mode",
      "Improved a reliability metric with a documented delta",
    ],
    createdAt: "2026-08-20",
  },
  {
    id: "proj_mcp",
    name: "MCP tool-use workshop",
    description: "Wire two real tools through MCP and measure whether the agent actually uses them. Secondary gap after evaluation.",
    targetSkillIds: ["mcp", "agents"],
    targetJobIds: ["job_adept", "job_eleven", "job_bcgx"],
    status: "planned",
    estimatedDays: "2–4 days",
    suggestedEvidence: [
      "Shipped an MCP server exposing two production-like tools",
      "Measured tool-selection accuracy against a gold set",
    ],
    createdAt: "2026-08-20",
  },
  {
    id: "proj_sertie",
    name: "Sertie mentor agent",
    description: "The original shipped agent. Already harvested into the evidence bank.",
    targetSkillIds: ["agents", "llm", "product"],
    targetJobIds: [],
    status: "completed",
    estimatedDays: "shipped",
    createdAt: "2026-01-15",
  },
];

export const CVS: CVVersion[] = [
  {
    id: "cv_engineer",
    name: "AI Engineer v3",
    positioning: "AI Engineer",
    evidenceIds: ["ev_sertie_agent", "ev_sertie_rag", "ev_msc", "ev_personal_rag"],
    targetSkillIds: ["python", "llm", "rag", "agents", "backend"],
    createdAt: "2026-07-28",
  },
  {
    id: "cv_strategy",
    name: "AI Strategy v2",
    positioning: "AI Product / Strategy",
    evidenceIds: ["ev_analytics", "ev_game_theory", "ev_stakeholders", "ev_sertie_agent"],
    targetSkillIds: ["product", "strategy", "communication", "llm"],
    createdAt: "2026-08-02",
  },
];

export const APPLICATIONS: Application[] = [
  {
    id: "app_anthropic",
    jobId: "job_anthropic",
    cvId: "cv_strategy",
    date: "2026-08-08",
    stage: "recruiter",
    notes: "Screen booked. Strategy CV.",
  },
  {
    id: "app_faculty",
    jobId: "job_faculty",
    cvId: "cv_strategy",
    date: "2026-08-01",
    stage: "interview",
  },
  {
    id: "app_google",
    jobId: "job_google_pa",
    cvId: "cv_strategy",
    date: "2026-08-05",
    stage: "interview",
  },
  {
    id: "app_cohere",
    jobId: "job_cohere",
    cvId: "cv_engineer",
    date: "2026-07-22",
    stage: "rejected",
    rejectStage: "CV",
  },
  {
    id: "app_intercom",
    jobId: "job_intercom",
    cvId: "cv_engineer",
    date: "2026-07-25",
    stage: "rejected",
    rejectStage: "CV",
  },
  {
    id: "app_palantir",
    jobId: "job_palantir",
    cvId: "cv_engineer",
    date: "2026-07-29",
    stage: "rejected",
    rejectStage: "Recruiter",
  },
  {
    id: "app_darktrace",
    jobId: "job_darktrace",
    cvId: "cv_engineer",
    date: "2026-07-18",
    stage: "rejected",
    rejectStage: "CV",
  },
  {
    id: "app_stability",
    jobId: "job_stability",
    cvId: "cv_engineer",
    date: "2026-08-15",
    stage: "applied",
    notes: "No reply. Follow up.",
  },
];

export function seedState(): OSState {
  const jobs = JOBS.map((j) => ({
    ...j,
    candidateEvidenceIds: suggestEvidenceIds(j, EVIDENCE),
  }));
  return {
    profile: PROFILE,
    skills: SKILLS,
    signals: SIGNALS,
    jobs,
    evidence: EVIDENCE,
    projects: PROJECTS,
    cvs: CVS,
    applications: APPLICATIONS,
  };
}

export function suggestEvidenceIds(job: Job, evidence: Evidence[]): string[] {
  const required = new Set(job.requiredSkills.map((s) => s.skillId));
  return evidence
    .map((e) => ({
      id: e.id,
      score: e.skillIds.filter((s) => required.has(s)).length * e.strength,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.id);
}
