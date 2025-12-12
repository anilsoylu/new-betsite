"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for Build XI page
 * Matches the layout structure for smooth transition
 */
export function BuildXISkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header Skeleton */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          {/* Bottom Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full sm:w-[140px]" />
            <Skeleton className="h-10 w-full sm:w-[180px]" />
            <Skeleton className="h-10 w-full sm:max-w-xs flex-1" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px]">
          {/* Left Panel Skeleton */}
          <aside className="hidden lg:block">
            <Card className="p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </aside>

          {/* Pitch Skeleton */}
          <main>
            <Card className="aspect-[3/4] sm:aspect-[4/3] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-700">
                {/* Pitch markings skeleton */}
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full" />
                </div>
                {/* Player slots skeleton */}
                <div className="absolute inset-0 flex flex-col items-center justify-around py-8">
                  {[1, 2, 3, 4].map((row) => (
                    <div key={row} className="flex justify-around w-full px-8">
                      {Array.from({ length: row === 1 ? 1 : row === 4 ? 3 : 4 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Mobile Team Prefill Skeleton */}
            <div className="mt-6 lg:hidden">
              <Card className="p-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            </div>
          </main>

          {/* Right Panel Skeleton */}
          <aside className="hidden lg:block space-y-4">
            <Card className="p-4">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
            <Card className="p-4">
              <Skeleton className="h-6 w-36 mb-4" />
              <Skeleton className="h-20 w-full" />
            </Card>
          </aside>
        </div>

        {/* Mobile Side Panel Skeleton */}
        <div className="mt-6 lg:hidden space-y-4">
          <Card className="p-4">
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
