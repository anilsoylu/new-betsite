"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TeamNavTabsProps {
  slug: string;
  hasStats?: boolean;
  hasTransfers?: boolean;
  hasHistory?: boolean;
}

const tabs = [
  { id: "overview", label: "Overview", path: "" },
  { id: "matches", label: "Matches", path: "/matches" },
  { id: "squad", label: "Squad", path: "/squad" },
  { id: "stats", label: "Statistics", path: "/stats" },
  { id: "transfers", label: "Transfers", path: "/transfers" },
  { id: "history", label: "History", path: "/history" },
];

export function TeamNavTabs({
  slug,
  hasStats = true,
  hasTransfers = true,
  hasHistory = true,
}: TeamNavTabsProps) {
  const pathname = usePathname();
  const basePath = `/teams/${slug}`;

  const getActiveTab = () => {
    if (pathname === basePath || pathname === `${basePath}/`) return "overview";
    if (pathname.includes("/matches")) return "matches";
    if (pathname.includes("/squad")) return "squad";
    if (pathname.includes("/stats")) return "stats";
    if (pathname.includes("/transfers")) return "transfers";
    if (pathname.includes("/history")) return "history";
    return "overview";
  };

  const activeTab = getActiveTab();

  // Filter tabs based on data availability
  const visibleTabs = tabs.filter((tab) => {
    if (tab.id === "stats" && !hasStats) return false;
    if (tab.id === "transfers" && !hasTransfers) return false;
    if (tab.id === "history" && !hasHistory) return false;
    return true;
  });

  return (
    <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const href = `${basePath}${tab.path}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
