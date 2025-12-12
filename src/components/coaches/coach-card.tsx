"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { generateCoachSlug } from "@/lib/utils";
import type { CoachSearchResult } from "@/types/football";

interface CoachCardProps {
  coach: CoachSearchResult;
  variant?: "default" | "compact";
}

export function CoachCard({ coach, variant = "default" }: CoachCardProps) {
  const slug = generateCoachSlug(coach.displayName || coach.name, coach.id);

  if (variant === "compact") {
    return (
      <Link href={`/coaches/${slug}`} className="block">
        <Card className="hover:bg-muted/50 transition-colors group">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="relative h-10 w-10 shrink-0">
              {coach.image ? (
                <Image
                  src={coach.image}
                  alt={coach.displayName || coach.name}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="h-full w-full bg-muted rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {coach.displayName || coach.name}
              </p>
              {coach.currentTeamName && (
                <p className="text-xs text-muted-foreground truncate">
                  {coach.currentTeamName}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/coaches/${slug}`} className="block">
      <Card className="hover:bg-muted/50 transition-colors group overflow-hidden">
        <CardContent className="p-0">
          {/* Coach Image */}
          <div className="relative aspect-square bg-gradient-to-b from-muted/50 to-muted">
            {coach.image ? (
              <Image
                src={coach.image}
                alt={coach.displayName || coach.name}
                fill
                className="object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Coach Info */}
          <div className="p-3 space-y-1.5">
            <p className="font-medium truncate">
              {coach.displayName || coach.name}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {coach.currentTeamName && coach.currentTeamLogo && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Image
                    src={coach.currentTeamLogo}
                    alt={coach.currentTeamName}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="truncate">{coach.currentTeamName}</span>
                </div>
              )}
              {coach.country && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {coach.country.flag && (
                    <Image
                      src={coach.country.flag}
                      alt={coach.country.name}
                      width={14}
                      height={10}
                      className="object-contain"
                    />
                  )}
                  <span className="truncate">{coach.country.name}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
