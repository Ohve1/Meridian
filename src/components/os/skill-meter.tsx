import { cn } from "@/lib/utils";
import type { SkillGap } from "@/lib/os/intelligence";

export function SkillMeter({ gap, compact }: { gap: SkillGap; compact?: boolean }) {
  const filled = Math.round(gap.evidenceStrength);
  return (
    <div className="grid grid-cols-[minmax(0,7rem)_1fr_auto] items-center gap-3">
      <div className="truncate text-sm text-fg">{gap.name}</div>
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-sm",
              i < filled ? tone(gap.band) : "bg-elevated",
            )}
          />
        ))}
      </div>
      <div className="w-16 text-right text-xs tabular-nums text-muted">
        {compact ? `${filled}/5` : label(gap.band)}
      </div>
    </div>
  );
}

function tone(band: SkillGap["band"]) {
  if (band === "strong") return "bg-up";
  if (band === "medium") return "bg-accent";
  if (band === "weak") return "bg-down";
  return "bg-line-strong";
}

function label(band: SkillGap["band"]) {
  if (band === "strong") return "Strong";
  if (band === "medium") return "Medium";
  if (band === "weak") return "Weak";
  return "None";
}

export function DemandBar({
  name,
  pct,
  delta,
}: {
  name: string;
  pct: number;
  delta: number;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,8rem)_1fr_auto] items-center gap-3">
      <div className="truncate text-sm text-fg">{name}</div>
      <div className="h-2 rounded-full bg-elevated">
        <div
          className="h-2 rounded-full bg-accent"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <div className="flex w-20 items-baseline justify-end gap-1.5 text-xs tabular-nums">
        <span className="text-fg">{pct}%</span>
        <span className={delta >= 0 ? "text-up" : "text-down"}>
          {delta >= 0 ? "+" : ""}
          {delta}
        </span>
      </div>
    </div>
  );
}
