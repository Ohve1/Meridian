import { createFileRoute } from "@tanstack/react-router";
import { JobDetail } from "@/components/os/job-detail";

export const Route = createFileRoute("/jobs/$jobId")({ component: JobPage });

function JobPage() {
  const { jobId } = Route.useParams();
  return <JobDetail jobId={jobId} />;
}
