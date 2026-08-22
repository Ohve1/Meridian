import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { gapsForJob, matchScore, relevantEvidence } from "@/lib/os/intelligence";
import { useOS } from "@/lib/os/store";
import { SkillMeter } from "@/components/os/skill-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function JobDetail({ jobId }: { jobId: string }) {
  const job = useOS((s) => s.jobs.find((j) => j.id === jobId));
  const skills = useOS((s) => s.skills);
  const evidence = useOS((s) => s.evidence);
  const cvs = useOS((s) => s.cvs);
  const toggleCandidate = useOS((s) => s.toggleCandidate);
  const buildCV = useOS((s) => s.buildCV);
  const applyToJob = useOS((s) => s.applyToJob);
  const navigate = useNavigate();

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-muted">That job is not in the vault.</p>
        <Button asChild variant="secondary" className="mt-4">
          <Link to="/market">Back to market</Link>
        </Button>
      </div>
    );
  }

  const gaps = gapsForJob(job, evidence, skills);
  const score = matchScore(job, evidence);
  const pool = relevantEvidence(job, evidence);
  const biggest = [...gaps].sort((a, b) => b.gap - a.gap)[0];

  function onBuild() {
    const cv = buildCV(jobId);
    if (cv) toast.success(`Built ${cv.name} from ranked evidence.`);
  }

  function onApply() {
    const cv =
      cvs.find((c) => c.targetSkillIds.some((id) => job!.requiredSkills.some((r) => r.skillId === id))) ??
      cvs[0];
    if (!cv) {
      toast.error("Build a CV version first.");
      return;
    }
    applyToJob(jobId, cv.id);
    toast.success(`Applied to ${job!.company} with ${cv.name}.`);
    void navigate({ to: "/pipeline" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link to="/market" className="text-xs text-muted hover:text-fg">
        ← Market
      </Link>
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">
          {job.company} · {job.location}
        </p>
        <h1 className="font-display text-4xl tracking-tight">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{job.seniority}</span>
          {job.salary ? <span>· {job.salary}</span> : null}
          <Badge>{job.status}</Badge>
          <span className="ml-auto font-mono tabular-nums text-fg">{score}% match</span>
        </div>
      </header>

      <p className="text-sm leading-relaxed text-muted">{job.description}</p>

      <section className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-xl tracking-tight">Evidence against this JD</h2>
        {biggest ? (
          <p className="mt-1 mb-4 text-sm text-muted">
            Biggest skill gap: {biggest.name} ({biggest.evidenceStrength}/5)
            {biggest.band === "weak" || biggest.band === "none"
              ? " — this is a project, not a wording problem."
              : "."}
          </p>
        ) : null}
        <div className="space-y-3">
          {gaps.map((g) => (
            <SkillMeter key={g.skillId} gap={g} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl tracking-tight">Candidate evidence</h2>
        <p className="text-sm text-muted">
          Select what you would actually show. Build CV ranks the strongest overlap.
        </p>
        <ul className="space-y-2">
          {pool.map((e) => {
            const on = job.candidateEvidenceIds.includes(e.id);
            return (
              <li key={e.id}>
                <button
                  onClick={() => toggleCandidate(job.id, e.id)}
                  className={cn(
                    "w-full rounded-xl p-4 text-left shadow-[var(--shadow-border)] transition-colors",
                    on ? "bg-elevated" : "bg-surface hover:bg-elevated/40",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-fg">{e.title}</span>
                    <span className="font-mono text-xs tabular-nums text-muted">
                      {e.strength}/5
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-subtle">
                    {e.source} · {e.skillIds.map((id) => skills.find((s) => s.id === id)?.name).join(" · ")}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onBuild}>Build CV</Button>
        <Button variant="secondary" onClick={onApply} disabled={job.status === "applied"}>
          {job.status === "applied" ? "Already applied" : "Apply"}
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/projects">Create evidence</Link>
        </Button>
      </div>
    </div>
  );
}
