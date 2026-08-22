import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useOS } from "@/lib/os/store";
import { SOURCE_TYPE_TIER, type SourceType } from "@/lib/os/types";
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

const TYPES: { id: SourceType; label: string }[] = [
  { id: "JOB", label: "Job / career page" },
  { id: "GITHUB", label: "GitHub / paper" },
  { id: "REDDIT", label: "Reddit / X / LinkedIn" },
  { id: "NEWS", label: "News / hype" },
];

export function AddSignalDialog({ children }: { children: ReactNode }) {
  const addSignal = useOS((s) => s.addSignal);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("JOB");
  const [url, setUrl] = useState("");
  const [raw, setRaw] = useState("");

  function save() {
    if (!source.trim() || !raw.trim()) {
      toast.error("Source and a note are required.");
      return;
    }
    const signal = addSignal({
      source,
      sourceType,
      url,
      rawContent: raw,
    });
    toast.success(`Logged as Tier ${signal.tier} — not scraped, not averaged.`);
    setOpen(false);
    setSource("");
    setUrl("");
    setRaw("");
    setSourceType("JOB");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a market signal</DialogTitle>
          <DialogDescription>
            Paste a URL and a note. V1 does not scrape. Source type decides the tier.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <Label>Source</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="DeepMind careers, r/MachineLearning…"
            />
          </label>
          <fieldset className="grid gap-2">
            <Label>Kind</Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSourceType(t.id)}
                  className={
                    sourceType === t.id
                      ? "h-11 rounded-lg bg-accent px-3 text-xs text-accent-fg"
                      : "h-11 rounded-lg bg-elevated px-3 text-xs text-muted hover:text-fg"
                  }
                >
                  {t.label}
                  <span className="ml-1.5 text-subtle">T{SOURCE_TYPE_TIER[t.id]}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <label className="grid gap-1.5">
            <Label>URL (optional)</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
          </label>
          <label className="grid gap-1.5">
            <Label>What you noticed</Label>
            <Textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={4} />
          </label>
          <Button onClick={save}>Log signal</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
