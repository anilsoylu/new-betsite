"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  User,
  Star,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { POPULAR_LEAGUES } from "@/lib/constants";
import { getLeagueUrl } from "@/lib/utils";

const quickLinks = [
  {
    href: "/",
    icon: Home,
    title: "Home",
    description: "Back to homepage",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    href: "/matches",
    icon: Calendar,
    title: "Matches",
    description: "Today's fixtures",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    href: "/teams",
    icon: Users,
    title: "Teams",
    description: "Browse all teams",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    href: "/leagues",
    icon: Trophy,
    title: "Leagues",
    description: "Competitions & standings",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    href: "/players",
    icon: User,
    title: "Players",
    description: "Search players",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    href: "/favorites",
    icon: Star,
    title: "Favorites",
    description: "Your saved items",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
];

// Use POPULAR_LEAGUES from constants with proper URLs
const topLeagues = POPULAR_LEAGUES.slice(0, 6).map((league) => ({
  href: getLeagueUrl(league.name, league.id),
  name: league.name,
  flag: getLeagueFlag(league.shortCode),
}));

function getLeagueFlag(shortCode: string): string {
  const flags: Record<string, string> = {
    ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    ESP: "🇪🇸",
    GER: "🇩🇪",
    ITA: "🇮🇹",
    FRA: "🇫🇷",
    UEFA: "🇪🇺",
  };
  return flags[shortCode] || "⚽";
}

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Animated 404 */}
          <div className="relative mb-6">
            {/* Background glow effect */}
            <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-primary via-secondary to-accent animate-pulse" />

            {/* 404 Number with floating icon */}
            <div className="relative inline-block">
              <h1 className="text-[120px] sm:text-[150px] md:text-[180px] font-bold leading-none tracking-tighter bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in select-none">
                404
              </h1>

              {/* Floating football icon */}
              <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0 animate-float">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-lg glow-primary">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Offside! Page Not Found
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
              Looks like this page got a red card. Don&apos;t worry, let&apos;s
              get you back in the game with these options.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 animate-slide-up stagger-1">
            <Button asChild size="lg" className="w-full sm:w-auto btn-press">
              <Link href="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto btn-press"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Quick Navigation Grid */}
        <div className="animate-slide-up stagger-2">
          <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/30 card-lift">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${link.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <link.icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${link.color}`}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-sm">
                        {link.title}
                      </span>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {link.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Leagues */}
        <div className="mt-10 animate-slide-up stagger-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Popular Leagues
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {topLeagues.map((league) => (
              <Button
                key={league.href}
                asChild
                variant="outline"
                size="sm"
                className="btn-press"
              >
                <Link href={league.href}>
                  <span className="mr-1">{league.flag}</span>
                  {league.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-12 text-center animate-fade-in stagger-4">
          <Card className="inline-block glass">
            <CardContent className="px-6 py-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Fun fact:</span> The
                term &quot;404&quot; comes from the room number at CERN where
                the original web servers were located.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
