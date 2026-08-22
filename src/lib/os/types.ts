export type SourceType =
  | "JOB"
  | "PAPER"
  | "GITHUB"
  | "REDDIT"
  | "X"
  | "LINKEDIN"
  | "NEWS"
  | "KAGGLE"
  | "COMPANY";

export type SignalTier = 1 | 2 | 3 | 4;

/** Skill is what employers ask for. Technology is a market object. */
export type SkillLayer = "capability" | "skill";

export type Importance = "must" | "nice";

export type JobStatus = "watching" | "ready" | "applied" | "closed";

export type ProjectStatus = "planned" | "active" | "completed";

export type AppStage =
  | "applied"
  | "recruiter"
  | "interview"
  | "offer"
  | "rejected";

export interface Profile {
  name: string;
  location: string;
  focus: string;
}

/** What exists in the market. Not a skill. Not evidence. */
export interface Technology {
  id: string;
  name: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  layer: SkillLayer;
  aliases: string[];
  description: string;
  /** Technologies this skill operates on. */
  technologyIds: string[];
  /** Synthetic 30-day demand change, in percentage points. */
  demandDelta: number;
}

export interface MarketSignal {
  id: string;
  source: string;
  sourceType: SourceType;
  tier: SignalTier;
  url?: string;
  author?: string;
  timestamp: string;
  rawContent: string;
  credibility: number;
  engagement?: number;
  extractedTopics: string[];
  jobId?: string;
}

export interface JobSkill {
  skillId: string;
  importance: Importance;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  seniority: string;
  description: string;
  salary?: string;
  url?: string;
  jobType: string;
  priority: "low" | "medium" | "high";
  status: JobStatus;
  deadline?: string;
  signalId?: string;
  requiredSkills: JobSkill[];
  keywords: string[];
  candidateEvidenceIds: string[];
  createdAt: string;
}

export interface Evidence {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  strength: 1 | 2 | 3 | 4 | 5;
  skillIds: string[];
  verifiablePoints: string[];
  createdAt: string;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  targetSkillIds: string[];
  targetJobIds: string[];
  status: ProjectStatus;
  estimatedDays?: string;
  suggestedEvidence?: string[];
  createdAt: string;
}

export interface CVVersion {
  id: string;
  name: string;
  positioning: string;
  evidenceIds: string[];
  targetSkillIds: string[];
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  cvId: string;
  date: string;
  stage: AppStage;
  rejectStage?: string;
  notes?: string;
}

export interface OSState {
  profile: Profile;
  technologies: Technology[];
  skills: Skill[];
  signals: MarketSignal[];
  jobs: Job[];
  evidence: Evidence[];
  projects: Project[];
  cvs: CVVersion[];
  applications: Application[];
}

export const TIER_LABEL: Record<SignalTier, string> = {
  1: "Demand",
  2: "Technology",
  3: "Practitioner",
  4: "Hype",
};

export const TIER_QUESTION: Record<SignalTier, string> = {
  1: "What will companies pay for?",
  2: "Where is the technology going?",
  3: "What are practitioners actually discussing?",
  4: "What is the market shouting?",
};

export const TIER_SOURCES: Record<SignalTier, string[]> = {
  1: ["Job postings", "Career pages", "Recruiter hiring"],
  2: ["GitHub", "Papers", "Hugging Face", "Kaggle", "Engineering blogs"],
  3: ["Reddit", "X", "LinkedIn"],
  4: ["Viral news", "Influencer posts"],
};

export const STAGE_LABEL: Record<AppStage, string> = {
  applied: "Applied",
  recruiter: "Recruiter screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const SOURCE_TYPE_TIER: Record<SourceType, SignalTier> = {
  JOB: 1,
  COMPANY: 1,
  PAPER: 2,
  GITHUB: 2,
  KAGGLE: 2,
  REDDIT: 3,
  X: 3,
  LINKEDIN: 3,
  NEWS: 4,
};
