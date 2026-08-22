import { createFileRoute } from "@tanstack/react-router";
import { PipelineView } from "@/components/os/pipeline-view";

export const Route = createFileRoute("/pipeline")({ component: PipelinePage });

function PipelinePage() {
  return <PipelineView />;
}
