import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  computeTrends,
  conversionByPositioning,
  marketGaps,
  nextActions,
} from "@/lib/os/intelligence";
import { useOS } from "@/lib/os/store";
import { greeting } from "@/lib/utils";
import { AddJobDialog } from "@/components/os/add-job-dialog";
import { SkillMeter } from "@/components/os/skill-meter";
import { Button } from "@/components/ui/button";

export function TodayView() {
  const state = useOS();
  const actions = nextActions(state);
  const gaps = marketGaps(state).slice(0, 5);
  const trends = computeTrends(state.jobs, state.signals, state.skills);
  const lead = trends[0];
  const conv = conversionByPositioning(state.applications, state.cvs);
  const primary = actions.find((a) => a.kind === "project") ?? actions[0];
  const rest = actions.filter((a) => a.id !== primary?.id).slice(0, 3);

  return (
    <div className="stagger-in mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">Today</p>
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">
          {greeting()}, {state.profile.name}.
        </h1>
        <p className="max-w-xl text-muted">
          {state.applications.filter((a) => a.stage !== "rejected" && a.stage !== "offer").length}{" "}
          live applications. The question is not what to track — it is what to do in the next hour.
        </p>
      </header>

      {lead ? (
        <section className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">Market shift</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">{lead.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{lead.narrative}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Conf label="Demand" value={lead.confidence.demand} />
            <Conf label="Technology" value={lead.confidence.technology} />
            <Conf label="Practitioner" value={lead.confidence.practitioner} />
            <Conf label="Hype" value={lead.confidence.hype} warn />
          </dl>
        </section>
      ) : null}

      {primary ? (
        <section className="rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)] md:p-6">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">
            {primary.kicker}
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">{primary.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{primary.body}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs tabular-nums text-subtle">
            {primary.effort ? <span>Effort {primary.effort}</span> : null}
            {primary.impact ? <span>{primary.impact}</span> : null}
          </div>
          <div className="mt-5">
            <Button asChild>
              <Link to={primary.href as "/"}>
                {primary.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-xl tracking-tight">Your market-weighted gaps</h2>
          <Link to="/evidence" className="text-xs text-muted hover:text-fg">
            Evidence bank
          </Link>
        </div>
        <div className="space-y-3 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
          {gaps.map((g) => (
            <SkillMeter key={g.skillId} gap={g} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {rest.map((a) => (
          <Link
            key={a.id}
            to={a.href as "/"}
            className="block rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] transition-shadow duration-150 hover:shadow-[var(--shadow-border-hover)]"
          >
            <p className="text-xs font-medium tracking-widest text-subtle uppercase">{a.kicker}</p>
            <h3 className="mt-2 font-display text-xl tracking-tight">{a.title}</h3>
            <p className="mt-2 text-sm text-muted">{a.body}</p>
            <p className="mt-4 text-sm text-accent">{a.cta}</p>
          </Link>
        ))}
      </section>

      {conv.length > 0 ? (
        <section className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl tracking-tight">Outcome by positioning</h2>
          <p className="mt-1 text-sm text-muted">
            Screens reached, not vibes. This is how the market is scoring your current evidence.
          </p>
          <ul className="mt-4 divide-y divide-line">
            {conv.map((c) => (
              <li key={c.positioning} className="flex items-baseline justify-between gap-3 py-3">
                <span className="text-sm">{c.positioning}</span>
                <span className="text-sm tabular-nums text-muted">
                  {c.screens}/{c.apps} screens
                  <span className="ml-3 text-fg">{c.rate}%</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <AddJobDialog>
          <Button variant="secondary">Add a job signal</Button>
        </AddJobDialog>
        <Button variant="ghost" asChild>
          <Link to="/market">Open market world</Link>
        </Button>
      </div>
    </div>
  );
}

function Conf({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className={`mt-1 font-mono text-lg tabular-nums ${warn ? "text-muted" : "text-fg"}`}>
        {value.toFixed(2)}
      </dd>
    </div>
  );
}
