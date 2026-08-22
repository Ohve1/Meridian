import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  Compass,
  FolderKanban,
  Layers3,
  RotateCcw,
  ScrollText,
} from "lucide-react";
import { Toaster } from "sonner";
import { useOS } from "@/lib/os/store";
import { cn } from "@/lib/utils";
import { AddJobDialog } from "@/components/os/add-job-dialog";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Today", icon: Compass },
  { to: "/market", label: "Market", icon: Layers3 },
  { to: "/evidence", label: "Evidence", icon: ScrollText },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/pipeline", label: "Pipeline", icon: Briefcase },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/market") return pathname === "/market" || pathname.startsWith("/jobs");
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useOS.persist.rehydrate();
  }, []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const resetDemo = useOS((s) => s.resetDemo);
  const profile = useOS((s) => s.profile);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "font-sans",
          style: {
            background: "#1c1d19",
            color: "#eeeee6",
            border: "1px solid #2a2b26",
          },
        }}
      />
      <div className="mx-auto flex min-h-dvh max-w-7xl">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-line px-4 py-6 md:flex">
          <Link to="/" className="px-2">
            <div className="font-display text-xl tracking-tight">Meridian</div>
            <div className="mt-0.5 text-xs text-subtle">Market · Evidence · Action</div>
          </Link>
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                    active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-3 px-1">
            <div className="text-xs text-subtle">
              {profile.name}
              <span className="mx-1">·</span>
              {profile.location}
            </div>
            <AddJobDialog>
              <Button className="w-full">Add job</Button>
            </AddJobDialog>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-subtle"
              onClick={() => resetDemo()}
            >
              <RotateCcw className="size-3.5" />
              Reset demo
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:hidden">
            <Link to="/" className="font-display text-lg tracking-tight">
              Meridian
            </Link>
            <AddJobDialog>
              <Button size="sm">Add job</Button>
            </AddJobDialog>
          </header>
          <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-xs",
                  active ? "text-fg" : "text-subtle",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
