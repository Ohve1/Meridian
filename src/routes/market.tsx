import { createFileRoute } from "@tanstack/react-router";
import { MarketView } from "@/components/os/market-view";

export const Route = createFileRoute("/market")({ component: MarketPage });

function MarketPage() {
  return <MarketView />;
}
