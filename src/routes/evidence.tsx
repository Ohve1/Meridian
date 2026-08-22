import { createFileRoute } from "@tanstack/react-router";
import { EvidenceView } from "@/components/os/evidence-view";

export const Route = createFileRoute("/evidence")({ component: EvidencePage });

function EvidencePage() {
  return <EvidenceView />;
}
