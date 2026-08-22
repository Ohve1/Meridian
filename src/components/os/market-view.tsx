import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { computeTrends, demandBySkill, matchScore } from "@/lib/os/intelligence";
import { useOS } from "@/lib/os/store";
import { TIER_LABEL, TIER_QUESTION, type SignalTier } from "@/lib/os/types";
import { DemandBar } from "@/components/os/skill-meter";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TABS = ["Trends", "Jobs", "Signals"] as const;

export function MarketView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Trends");
  const jobs = useOS((s) => s.jobs);
  const skills = useOS((s) => s.skills);
  const signals = useOS((s) => s.signals);
  const evidence = useOS((s) => s.evidence);
  const demand = demandBySkill(jobs, skills).filter((d) => d.jobs > 0);
  const trends = computeTrends(jobs, signals, skills);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">Market world</p>
        <h1 className="font-display text-4xl tracking-tight">What the labour market is buying</h1>
        <p className="max-w-2xl text-muted">
          Jobs are signals, not the top of the ontology. Tier 1 is demand. Hype is not demand.
        </p>
      </header>

      <div className="flex gap-1 rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "h-11 flex-1 rounded-lg text-sm transition-colors duration-150",
              tab === t ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Trends" ? (
        <div className="space-y-8">
          <section className="space-y-3 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-xl tracking-tight">Demand in the current job set</h2>
            <p className="text-sm text-muted">
              Share of {jobs.length} ingested roles mentioning each skill. Deltas are 30-day
              directional, not a Twitter trendline.
            </p>
            <div className="space-y-3 pt-2">
              {demand.slice(0, 10).map((d) => (
                <DemandBar key={d.skillId} name={d.name} pct={d.pct} delta={d.delta} />
              ))}
            </div>
          </section>

          <div className="grid gap-4">
            {trends.map((t) => (
              <article key={t.id} className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl tracking-tight">{t.name}</h3>
                  <span
                    className={cn(
                      "font-mono text-sm tabular-nums",
                      t.delta30d >= 10 ? "text-up" : t.delta30d < 0 ? "text-down" : "text-muted",
                    )}
                  >
                    {t.delta30d >= 0 ? "+" : ""}
                    {t.delta30d}% 30d
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{t.narrative}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Conf label="Demand" v={t.confidence.demand} />
                  <Conf label="Technology" v={t.confidence.technology} />
                  <Conf label="Practitioner" v={t.confidence.practitioner} />
                  <Conf label="Hype" v={t.confidence.hype} muted />
                </dl>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "Jobs" ? (
        <ul className="divide-y divide-line rounded-2xl bg-surface shadow-[var(--shadow-border)]">
          {jobs.map((j) => {
            const score = matchScore(j, evidence);
            return (
              <li key={j.id}>
                <Link
                  to="/jobs/$jobId"
                  params={{ jobId: j.id }}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-elevated/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm text-fg">
                      {j.title}
                      <span className="text-muted"> — {j.company}</span>
                    </div>
                    <div className="mt-1 text-xs text-subtle">
                      {j.location} · {j.seniority} · {j.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs tabular-nums">
                    <span className="text-muted">{j.requiredSkills.length} skills</span>
                    <span className="text-fg">{score}% match</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      {tab === "Signals" ? (
        <div className="space-y-6">
          <p className="text-sm text-muted">
            Four tiers, never averaged. A viral post does not move a hiring budget.
          </p>
          {([1, 2, 3, 4] as SignalTier[]).map((tier) => {
            const rows = signals.filter((s) => s.tier === tier);
            return (
              <section key={tier}>
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-xl tracking-tight">
                    Tier {tier} — {TIER_LABEL[tier]}
                  </h2>
                  <span className="text-xs text-subtle">{TIER_QUESTION[tier]}</span>
                </div>
                <ul className="space-y-2">
                  {rows.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{s.sourceType}</Badge>
                        <span className="text-sm text-fg">{s.source}</span>
                        <span className="ml-auto font-mono text-xs tabular-nums text-subtle">
                          cred {s.credibility.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted">{s.rawContent}</p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Conf({ label, v, muted }: { label: string; v: number; muted?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className={`mt-1 font-mono text-base tabular-nums ${muted ? "text-muted" : "text-fg"}`}>
        {v.toFixed(2)}
      </dd>
    </div>
  );
}
