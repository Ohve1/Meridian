import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "../utils";
import { extractFromJd } from "./extract";
import { rankEvidenceForCV } from "./intelligence";
import { seedState, suggestEvidenceIds } from "./seed";
import type {
  Application,
  AppStage,
  CVVersion,
  Evidence,
  Job,
  JobSkill,
  JobStatus,
  MarketSignal,
  OSState,
  Project,
  ProjectStatus,
} from "./types";


interface Actions {
  resetDemo: () => void;
  addJobFromText: (input: {
    company: string;
    title: string;
    location?: string;
    url?: string;
    description: string;
    salary?: string;
    seniority?: string;
    keywords?: string[];
    requiredSkills?: JobSkill[];
  }) => Job;
  updateJobStatus: (id: string, status: JobStatus) => void;
  toggleCandidate: (jobId: string, evidenceId: string) => void;
  addEvidence: (e: Omit<Evidence, "id" | "createdAt">) => Evidence;
  addProject: (p: Omit<Project, "id" | "createdAt">) => Project;
  setProjectStatus: (id: string, status: ProjectStatus) => void;
  completeProject: (id: string, points: string[]) => Evidence | null;
  buildCV: (jobId: string) => CVVersion | null;
  applyToJob: (jobId: string, cvId: string) => Application | null;
  setApplicationStage: (id: string, stage: AppStage, rejectStage?: string) => void;
}

export type Store = OSState & Actions;

export const useOS = create<Store>()(
  persist(
    (set, get) => ({
      ...seedState(),

      resetDemo: () => set({ ...seedState() }),

      addJobFromText: (input) => {
        const { skills, evidence, signals } = get();
        const extracted = extractFromJd(input.description, skills);
        const id = uid("job");
        const signalId = uid("sig");
        const job: Job = {
          id,
          company: input.company.trim(),
          title: input.title.trim(),
          location: input.location?.trim() || "London",
          seniority: input.seniority ?? extracted.seniority,
          description: input.description.trim(),
          salary: input.salary,
          url: input.url,
          jobType: extracted.jobType,
          priority: "medium",
          status: "watching",
          requiredSkills:
            input.requiredSkills && input.requiredSkills.length > 0
              ? input.requiredSkills
              : extracted.requiredSkills,
          keywords:
            input.keywords && input.keywords.length > 0 ? input.keywords : extracted.keywords,
          candidateEvidenceIds: [],
          createdAt: new Date().toISOString().slice(0, 10),
          signalId,
        };
        job.candidateEvidenceIds = suggestEvidenceIds(job, evidence);
        const signal: MarketSignal = {
          id: signalId,
          source: `${job.company} careers`,
          sourceType: "JOB",
          tier: 1,
          url: input.url,
          timestamp: job.createdAt,
          rawContent: `${job.title} at ${job.company}. ${input.description.slice(0, 280)}`,
          credibility: 0.9,
          extractedTopics: extracted.requiredSkills.map((s) => s.skillId),
          jobId: id,
        };
        set({ jobs: [job, ...get().jobs], signals: [signal, ...signals] });
        return job;
      },

      updateJobStatus: (id, status) =>
        set({ jobs: get().jobs.map((j) => (j.id === id ? { ...j, status } : j)) }),

      toggleCandidate: (jobId, evidenceId) =>
        set({
          jobs: get().jobs.map((j) => {
            if (j.id !== jobId) return j;
            const has = j.candidateEvidenceIds.includes(evidenceId);
            return {
              ...j,
              candidateEvidenceIds: has
                ? j.candidateEvidenceIds.filter((x) => x !== evidenceId)
                : [...j.candidateEvidenceIds, evidenceId],
            };
          }),
        }),

      addEvidence: (e) => {
        const item: Evidence = {
          ...e,
          id: uid("ev"),
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set({ evidence: [item, ...get().evidence] });
        return item;
      },

      addProject: (p) => {
        const item: Project = {
          ...p,
          id: uid("proj"),
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set({ projects: [item, ...get().projects] });
        return item;
      },

      setProjectStatus: (id, status) =>
        set({
          projects: get().projects.map((p) => (p.id === id ? { ...p, status } : p)),
        }),

      completeProject: (id, points) => {
        const proj = get().projects.find((p) => p.id === id);
        if (!proj) return null;
        const ev: Evidence = {
          id: uid("ev"),
          title: proj.name,
          summary: `Harvested from completed project: ${proj.description}`,
          source: "Project",
          strength: 4,
          skillIds: proj.targetSkillIds,
          verifiablePoints: points.filter(Boolean),
          createdAt: new Date().toISOString().slice(0, 10),
          projectId: id,
        };
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, status: "completed" } : p,
          ),
          evidence: [ev, ...get().evidence],
        });
        return ev;
      },

      buildCV: (jobId) => {
        const { jobs, evidence, cvs } = get();
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return null;
        const selected = rankEvidenceForCV(job, evidence);
        const n =
          cvs.filter((c) => c.name.startsWith(job.title.split(" ")[0] ?? "CV")).length + 1;
        const cv: CVVersion = {
          id: uid("cv"),
          name: `${job.title} v${n}`,
          positioning: job.title,
          evidenceIds: selected.map((e) => e.id),
          targetSkillIds: job.requiredSkills.map((s) => s.skillId),
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set({
          cvs: [cv, ...cvs],
          jobs: jobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: j.status === "applied" ? j.status : "ready",
                  candidateEvidenceIds: cv.evidenceIds,
                }
              : j,
          ),
        });
        return cv;
      },

      applyToJob: (jobId, cvId) => {
        const { jobs, applications } = get();
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return null;
        const app: Application = {
          id: uid("app"),
          jobId,
          cvId,
          date: new Date().toISOString().slice(0, 10),
          stage: "applied",
        };
        set({
          applications: [app, ...applications],
          jobs: jobs.map((j) => (j.id === jobId ? { ...j, status: "applied" } : j)),
        });
        return app;
      },

      setApplicationStage: (id, stage, rejectStage) =>
        set({
          applications: get().applications.map((a) =>
            a.id === id ? { ...a, stage, rejectStage } : a,
          ),
        }),
    }),
    { name: "meridian-os-v1", skipHydration: true },
  ),
);
