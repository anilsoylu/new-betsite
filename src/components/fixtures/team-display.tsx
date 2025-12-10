"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type TeamDisplaySize = "xs" | "sm" | "md" | "lg";

interface TeamDisplayProps {
  /** Team name */
  name: string;
  /** Team logo URL */
  logo?: string | null;
  /** Team short code (e.g., "FCB", "MCI") */
  shortCode?: string | null;
  /**
   * Size variant:
   * - xs: 16x16 logo, text-xs (for very compact displays)
   * - sm: 20x20 logo, text-sm (for match rows)
   * - md: 24x24 logo, text-sm (default, for cards)
   * - lg: 32x32 logo, text-base (for featured/expanded views)
   */
  size?: TeamDisplaySize;
  /** Whether this team is the winner (shows bold text) */
  isWinner?: boolean;
  /** Text alignment - affects flex direction */
  align?: "left" | "right";
  /** Show short code instead of full name when available */
  preferShortCode?: boolean;
  /** Additional className for customization */
  className?: string;
}

const sizeConfig: Record<
  TeamDisplaySize,
  { logo: number; text: string; fallback: string }
> = {
  xs: { logo: 16, text: "text-xs", fallback: "text-[8px]" },
  sm: { logo: 20, text: "text-sm", fallback: "text-[10px]" },
  md: { logo: 24, text: "text-sm", fallback: "text-[10px]" },
  lg: { logo: 32, text: "text-base", fallback: "text-xs" },
};

/**
 * Unified team display component with logo and name.
 * Handles missing logos with a fallback initial badge.
 *
 * @example
 * // In a match row (left-aligned)
 * <TeamDisplay name={homeTeam.name} logo={homeTeam.logo} isWinner={homeTeam.isWinner} />
 *
 * @example
 * // In a match row (right-aligned for away team)
 * <TeamDisplay name={awayTeam.name} logo={awayTeam.logo} align="right" />
 *
 * @example
 * // Featured card with larger size
 * <TeamDisplay name={team.name} logo={team.logo} size="lg" />
 */
export function TeamDisplay({
  name,
  logo,
  shortCode,
  size = "md",
  isWinner = false,
  align = "left",
  preferShortCode = false,
  className,
}: TeamDisplayProps) {
  const config = sizeConfig[size];
  const displayName = preferShortCode && shortCode ? shortCode : name;

  const LogoElement = logo ? (
    <Image
      src={logo}
      alt={name}
      width={config.logo}
      height={config.logo}
      className="object-contain shrink-0"
    />
  ) : (
    <div
      className={cn(
        "rounded bg-muted flex items-center justify-center font-semibold shrink-0",
        config.fallback,
      )}
      style={{ width: config.logo, height: config.logo }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );

  const NameElement = (
    <span
      className={cn(
        "truncate",
        config.text,
        isWinner ? "font-semibold text-foreground" : "text-muted-foreground",
        align === "right" && "text-right",
      )}
    >
      {displayName}
    </span>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2 min-w-0",
        align === "right" && "flex-row-reverse justify-end",
        className,
      )}
    >
      {LogoElement}
      {NameElement}
    </div>
  );
}

/**
 * Just the team logo with fallback - for use when you only need the logo.
 *
 * @example
 * <TeamLogo name={team.name} logo={team.logo} size="sm" />
 */
export function TeamLogo({
  name,
  logo,
  size = "md",
  className,
}: Pick<TeamDisplayProps, "name" | "logo" | "size" | "className">) {
  const config = sizeConfig[size ?? "md"];

  if (logo) {
    return (
      <Image
        src={logo}
        alt={name}
        width={config.logo}
        height={config.logo}
        className={cn("object-contain shrink-0", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded bg-muted flex items-center justify-center font-semibold shrink-0",
        config.fallback,
        className,
      )}
      style={{ width: config.logo, height: config.logo }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
