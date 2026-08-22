import { Link } from "@tanstack/react-router";
import { conversionByPositioning, daysAgo } from "@/lib/os/intelligence";
import { useOS } from "@/lib/os/store";
import { STAGE_LABEL, type AppStage } from "@/lib/os/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STAGES: AppStage[] = ["applied", "recruiter", "interview", "offer", "rejected"];

export function PipelineView() {
  const applications = useOS((s) => s.applications);
  const jobs = useOS((s) => s.jobs);
  const cvs = useOS((s) => s.cvs);
  const evidence = useOS((s) => s.evidence);
  const setApplicationStage = useOS((s) => s.setApplicationStage);
  const conv = conversionByPositioning(applications, cvs);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">Decision world</p>
        <h1 className="font-display text-4xl tracking-tight">Pipeline and CVs</h1>
        <p className="max-w-xl text-muted">
          What you sent, to whom, and what the market did with it. Outcomes are how evidence gets a
          grade.
        </p>
      </header>

      <section className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-xl tracking-tight">Conversion by positioning</h2>
        <ul className="mt-4 divide-y divide-line">
          {conv.map((c) => (
            <li key={c.positioning} className="flex items-baseline justify-between py-3 text-sm">
              <span>{c.positioning}</span>
              <span className="tabular-nums text-muted">
                {c.screens}/{c.apps} screens
                <span className="ml-3 text-fg">{c.rate}%</span>
              </span>
            </li>
          ))}
        </ul>
        {conv.some((c) => c.rate >= 50) && conv.some((c) => c.apps >= 3 && c.rate <= 25) ? (
          <p className="mt-4 text-sm text-muted">
            Current evidence matches the product/strategy market more cleanly than pure AI
            engineering. That is a positioning fact, not a pep talk.
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl tracking-tight">Applications</h2>
        <ul className="space-y-2">
          {applications.map((a) => {
            const job = jobs.find((j) => j.id === a.jobId);
            const cv = cvs.find((c) => c.id === a.cvId);
            if (!job) return null;
            const stale = a.stage === "applied" && daysAgo(a.date) >= 6;
            return (
              <li
                key={a.id}
                className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      to="/jobs/$jobId"
                      params={{ jobId: job.id }}
                      className="text-sm text-fg hover:underline"
                    >
                      {job.title}
                      <span className="text-muted"> — {job.company}</span>
                    </Link>
                    <p className="mt-1 text-xs text-subtle">
                      {cv?.name ?? "CV"} · {a.date}
                      {stale ? ` · follow up (${daysAgo(a.date)}d)` : null}
                      {a.rejectStage ? ` · rejected at ${a.rejectStage}` : null}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-subtle">
                    Stage
                    <select
                      value={a.stage}
                      onChange={(e) =>
                        setApplicationStage(
                          a.id,
                          e.target.value as AppStage,
                          e.target.value === "rejected" ? a.rejectStage ?? "CV" : undefined,
                        )
                      }
                      className="h-11 rounded-md bg-elevated px-2 text-sm text-fg shadow-[var(--shadow-border)]"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {STAGE_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl tracking-tight">CV versions</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {cvs.map((cv) => (
            <li key={cv.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-lg tracking-tight">{cv.name}</h3>
                <Badge>{cv.positioning}</Badge>
              </div>
              <p className="mt-2 text-xs text-subtle">{cv.evidenceIds.length} evidence items</p>
              <ul className="mt-3 space-y-1">
                {cv.evidenceIds.map((id) => {
                  const e = evidence.find((x) => x.id === id);
                  return (
                    <li key={id} className="text-sm text-muted">
                      {e?.title ?? id}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <Button asChild variant="secondary">
        <Link to="/market">Match a job and build another CV</Link>
      </Button>
    </div>
  );
}

