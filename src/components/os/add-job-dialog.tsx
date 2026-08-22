import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeJd } from "@/lib/ai/analyze-jd";
import { useOS } from "@/lib/os/store";
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

export function AddJobDialog({
  children,
  onAdded,
}: {
  children: ReactNode;
  onAdded?: (jobId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"add" | "ai" | null>(null);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("London");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const addJobFromText = useOS((s) => s.addJobFromText);
  const skills = useOS((s) => s.skills);
  const navigate = useNavigate();

  function reset() {
    setCompany("");
    setTitle("");
    setLocation("London");
    setUrl("");
    setDescription("");
  }

  function add() {
    if (!company.trim() || !title.trim() || !description.trim()) {
      toast.error("Company, title, and a JD are required.");
      return;
    }
    setBusy("add");
    const job = addJobFromText({ company, title, location, url, description });
    toast.success(`${job.company} — ${job.title} ingested as a demand signal.`);
    setBusy(null);
    setOpen(false);
    reset();
    onAdded?.(job.id);
    void navigate({ to: "/jobs/$jobId", params: { jobId: job.id } });
  }

  async function withAi() {
    if (!description.trim()) {
      toast.error("Paste a job description first.");
      return;
    }
    setBusy("ai");
    try {
      const result = await analyzeJd({
        data: {
          jd: description,
          company,
          title,
          catalog: skills.map((s) => ({ id: s.id, name: s.name, aliases: s.aliases })),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const mapped = result.skills
        .map((s) => {
          const id =
            s.matchedId && skills.some((x) => x.id === s.matchedId)
              ? s.matchedId
              : skills.find((x) => x.name.toLowerCase() === s.name.toLowerCase())?.id;
          return id ? { skillId: id, importance: s.importance } : null;
        })
        .filter((x): x is { skillId: string; importance: "must" | "nice" } => Boolean(x));
      const job = addJobFromText({
        company: company || "Unknown company",
        title: title || "Untitled role",
        location,
        url,
        description,
        seniority: result.seniority,
        keywords: result.keywords,
        requiredSkills: mapped,
      });
      toast.success(result.summary || "Job analysed and added.");
      setOpen(false);
      reset();
      onAdded?.(job.id);
      void navigate({ to: "/jobs/$jobId", params: { jobId: job.id } });
    } catch {
      toast.error("Could not reach the model. Added locally instead.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a job signal</DialogTitle>
          <DialogDescription>
            Paste a JD. Meridian treats it as market demand — not a row in a tracker.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company">
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Anthropic" />
            </Field>
            <Field label="Role">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AI Business Analyst" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </Field>
            <Field label="URL">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
            </Field>
          </div>
          <Field label="Job description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the JD. Skills, seniority, and keywords are extracted on add."
            />
          </Field>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={withAi} disabled={busy !== null}>
              {busy === "ai" ? <Loader2 className="size-4 animate-spin" /> : null}
              Analyse with AI
            </Button>
            <Button onClick={add} disabled={busy !== null}>
              {busy === "add" ? <Loader2 className="size-4 animate-spin" /> : null}
              Ingest signal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
