import { useState } from "react";
import { toast } from "sonner";
import { marketGaps, suggestedProjectForGap } from "@/lib/os/intelligence";
import { useOS } from "@/lib/os/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ProjectsView() {
  const state = useOS();
  const setProjectStatus = useOS((s) => s.setProjectStatus);
  const completeProject = useOS((s) => s.completeProject);
  const addProject = useOS((s) => s.addProject);
  const gaps = marketGaps(state);
  const top = gaps[0];
  const [harvestId, setHarvestId] = useState<string | null>(null);
  const harvest = state.projects.find((p) => p.id === harvestId);

  function start(id: string) {
    setProjectStatus(id, "active");
    toast.success("Project is active. The output is evidence, not a tick.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">Person world</p>
        <h1 className="font-display text-4xl tracking-tight">Projects manufacture evidence</h1>
        <p className="max-w-xl text-muted">
          You do not manage a kanban. You close a skill gap the market is currently pricing.
        </p>
      </header>

      {top && top.band !== "strong" ? (
        <section className="rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)]">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">Recommended</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            Close {top.name} ({top.evidenceStrength}/5)
          </h2>
          <p className="mt-2 text-sm text-muted">
            {top.demandJobs} jobs in the current set ask for it. Demand share {top.demandPct}%.
          </p>
          {!state.projects.some(
            (p) => p.status !== "completed" && p.targetSkillIds.includes(top.skillId),
          ) ? (
            <Button
              className="mt-4"
              onClick={() => {
                addProject(suggestedProjectForGap(top, state.jobs));
                toast.success("Project added from the gap engine.");
              }}
            >
              Create suggested project
            </Button>
          ) : null}
        </section>
      ) : null}

      <ul className="space-y-4">
        {state.projects.map((p) => (
          <li key={p.id} className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl tracking-tight">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
              </div>
              <Badge variant={p.status === "completed" ? "up" : p.status === "active" ? "accent" : "default"}>
                {p.status}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.targetSkillIds.map((id) => (
                <Badge key={id}>{state.skills.find((s) => s.id === id)?.name ?? id}</Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-subtle">
              {p.estimatedDays ? `Effort ${p.estimatedDays}` : null}
              {p.targetJobIds.length ? ` · ${p.targetJobIds.length} target jobs` : null}
            </p>
            {p.status !== "completed" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.status === "planned" ? (
                  <Button size="sm" onClick={() => start(p.id)}>
                    Start project
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setHarvestId(p.id)}>
                    Complete and harvest
                  </Button>
                )}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <HarvestDialog
        open={Boolean(harvest)}
        points={harvest?.suggestedEvidence ?? []}
        name={harvest?.name ?? ""}
        onOpenChange={(o) => {
          if (!o) setHarvestId(null);
        }}
        onConfirm={(points) => {
          if (!harvestId) return;
          completeProject(harvestId, points);
          toast.success("Evidence added to the bank.");
          setHarvestId(null);
        }}
      />
    </div>
  );
}

function HarvestDialog({
  open,
  points,
  name,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  points: string[];
  name: string;
  onOpenChange: (o: boolean) => void;
  onConfirm: (points: string[]) => void;
}) {
  const [text, setText] = useState("");
  const initial = points.join("\n");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What evidence did this produce?</DialogTitle>
          <DialogDescription>
            {name}. Only keep claims someone could verify.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          defaultValue={initial}
          onChange={(e) => setText(e.target.value)}
          className="min-h-40"
        />
        <Button
          onClick={() =>
            onConfirm(
              (text || initial)
                .split("\n")
                .map((s) => s.replace(/^[-•✓]\s*/, "").trim())
                .filter(Boolean),
            )
          }
        >
          Add to evidence bank
        </Button>
      </DialogContent>
    </Dialog>
  );
}
