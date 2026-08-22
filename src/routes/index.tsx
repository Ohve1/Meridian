import { createFileRoute } from "@tanstack/react-router";
import { TodayView } from "@/components/os/today-view";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <TodayView />;
}
