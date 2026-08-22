import { createFileRoute } from "@tanstack/react-router";
import { ProjectsView } from "@/components/os/projects-view";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

function ProjectsPage() {
  return <ProjectsView />;
}
