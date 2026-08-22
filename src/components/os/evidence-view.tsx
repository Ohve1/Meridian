import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { strengthForSkill } from "@/lib/os/intelligence";
import { useOS } from "@/lib/os/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EvidenceView() {
  const evidence = useOS((s) => s.evidence);
  const skills = useOS((s) => s.skills);
  const [filter, setFilter] = useState<string | "all">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return evidence.filter((e) => {
      if (filter !== "all" && !e.skillIds.includes(filter)) return false;
      if (query && !`${e.title} ${e.summary} ${e.source}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [evidence, filter, query]);

  const grouped = skills
    .map((sk) => ({
      sk,
      strength: strengthForSkill(sk.id, evidence),
      items: evidence.filter((e) => e.skillIds.includes(sk.id)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">Person world</p>
          <h1 className="font-display text-4xl tracking-tight">Evidence bank</h1>
          <p className="max-w-xl text-muted">
            Evidence proves a skill. It is not the skill, and it is not the technology. Strength is
            honesty, not optimism.
          </p>
        </div>
        <AddEvidenceDialog />
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Show evidence relevant to…"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {skills
          .filter((s) => evidence.some((e) => e.skillIds.includes(s.id)))
          .map((s) => (
            <FilterChip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
              {s.name}
            </FilterChip>
          ))}
      </div>

      {filter === "all" && !query ? (
        <div className="space-y-8">
          {grouped.map((g) => (
            <section key={g.sk.id}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-xl tracking-tight">{g.sk.name}</h2>
                <span className="font-mono text-xs tabular-nums text-muted">
                  proves · {g.strength}/5 · {g.items.length}
                </span>
              </div>
              <ul className="space-y-2">
                {g.items.map((e) => (
                  <EvidenceCard key={e.id} title={e.title} source={e.source} strength={e.strength} summary={e.summary} points={e.verifiablePoints} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((e) => (
            <EvidenceCard
              key={e.id}
              title={e.title}
              source={e.source}
              strength={e.strength}
              summary={e.summary}
              points={e.verifiablePoints}
            />
          ))}
          {rows.length === 0 ? <p className="text-sm text-muted">Nothing in the bank matches.</p> : null}
        </ul>
      )}
    </div>
  );
}

function EvidenceCard({
  title,
  source,
  strength,
  summary,
  points,
}: {
  title: string;
  source: string;
  strength: number;
  summary: string;
  points: string[];
}) {
  return (
    <li className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm text-fg">{title}</h3>
        <span className="font-mono text-xs tabular-nums text-muted">{strength}/5</span>
      </div>
      <p className="mt-1 text-xs text-subtle">{source}</p>
      <p className="mt-2 text-sm text-muted">{summary}</p>
      {points.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {points.map((p) => (
            <li key={p} className="text-xs text-muted">
              {p}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "h-9 rounded-full bg-accent px-3 text-xs text-accent-fg"
          : "h-9 rounded-full bg-elevated px-3 text-xs text-muted hover:text-fg"
      }
    >
      {children}
    </button>
  );
}

function AddEvidenceDialog() {
  const skills = useOS((s) => s.skills);
  const addEvidence = useOS((s) => s.addEvidence);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [summary, setSummary] = useState("");
  const [url, setUrl] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  function save() {
    if (!title.trim()) return;
    addEvidence({
      title: title.trim(),
      source: source.trim() || "Personal",
      url: url.trim() || undefined,
      summary: summary.trim(),
      strength: 3,
      skillIds: picked,
      verifiablePoints: summary
        .split("\n")
        .map((s) => s.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 4),
    });
    toast.success("Added to the evidence bank.");
    setOpen(false);
    setTitle("");
    setSource("");
    setUrl("");
    setSummary("");
    setPicked([]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add evidence</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New evidence</DialogTitle>
          <DialogDescription>Proof, not a bullet. What can someone verify?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="grid gap-1.5">
            <Label>Source</Label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Sertie, MSc, project…" />
          </label>
          <label className="grid gap-1.5">
            <Label>URL (optional)</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Repo, paper, write-up…" />
          </label>
          <label className="grid gap-1.5">
            <Label>What is verifiable</Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
          </label>
          <div>
            <Label>Skills</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((s) => {
                const on = picked.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setPicked((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))
                    }
                  >
                    <Badge variant={on ? "accent" : "default"}>{s.name}</Badge>
                  </button>
                );
              })}
            </div>
          </div>
          <Button onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
