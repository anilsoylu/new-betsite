"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LeagueNavTabsProps {
  slug: string;
  hasStandings: boolean;
}

const tabs = [
  { id: "overview", label: "Overview", path: "" },
  { id: "standings", label: "Standings", path: "/standings" },
  { id: "fixtures", label: "Fixtures", path: "/fixtures" },
  { id: "stats", label: "Stats", path: "/stats" },
];

export function LeagueNavTabs({ slug, hasStandings }: LeagueNavTabsProps) {
  const pathname = usePathname();
  const basePath = `/leagues/${slug}`;

  const getActiveTab = () => {
    if (pathname === basePath || pathname === `${basePath}/`) return "overview";
    if (pathname.includes("/standings")) return "standings";
    if (pathname.includes("/fixtures")) return "fixtures";
    if (pathname.includes("/stats")) return "stats";
    return "overview";
  };

  const activeTab = getActiveTab();

  return (
    <div className="border-b border-border">
      <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          // Hide standings tab if no standings data
          if (tab.id === "standings" && !hasStandings) return null;

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
