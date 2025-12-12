import {
  Home,
  Trophy,
  Users,
  Globe,
  Star,
  Shirt,
  Radio,
  UsersRound,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Navigation item configuration
 * Supports both desktop header and mobile bottom nav
 */
export interface NavItem {
  /** Route path */
  href: string;

  /** Display label */
  label: string;

  /** Icon component (required for mobile, optional for desktop) */
  icon?: LucideIcon;

  /** Show in desktop header navigation */
  showOnDesktop: boolean;

  /** Show in mobile bottom navigation bar (max 4 items) */
  showOnMobile: boolean;

  /** Show in mobile hamburger menu sheet */
  showInMobileSheet?: boolean;

  /** Special live indicator (pulsing red dot) */
  isLive?: boolean;

  /** Enable favorites count badge */
  showFavoritesCount?: boolean;
}

/**
 * Centralized navigation items configuration
 * Single source of truth for both desktop header and mobile bottom nav
 *
 * Filtering:
 * - Desktop: filter by showOnDesktop === true
 * - Mobile: filter by showOnMobile === true
 */
export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    showOnDesktop: true,
    showOnMobile: true, // Bottom nav
  },
  {
    href: "/matches",
    label: "Matches",
    icon: Trophy,
    showOnDesktop: true,
    showOnMobile: true, // Bottom nav
  },
  {
    href: "/teams",
    label: "Teams",
    icon: Users,
    showOnDesktop: true,
    showOnMobile: true, // Bottom nav
  },
  {
    href: "/players",
    label: "Players",
    icon: Shirt,
    showOnDesktop: true,
    showOnMobile: false,
    showInMobileSheet: true, // In hamburger menu (moved from bottom nav)
  },
  {
    href: "/coaches",
    label: "Coaches",
    icon: ClipboardList,
    showOnDesktop: true,
    showOnMobile: false,
    showInMobileSheet: true, // In hamburger menu
  },
  {
    href: "/leagues",
    label: "Leagues",
    icon: Globe,
    showOnDesktop: true,
    showOnMobile: false,
    showInMobileSheet: true, // In hamburger menu
  },
  {
    href: "/live",
    label: "Live",
    icon: Radio,
    showOnDesktop: true,
    showOnMobile: true, // Bottom nav (moved from sheet)
    isLive: true,
  },
  {
    href: "/favorites",
    label: "Favorites",
    icon: Star,
    showOnDesktop: true,
    showOnMobile: false,
    showInMobileSheet: true, // In hamburger menu
    showFavoritesCount: true,
  },
  {
    href: "/build-xi",
    label: "Build XI",
    icon: UsersRound,
    showOnDesktop: false, // Only in mobile sheet menu
    showOnMobile: false,
    showInMobileSheet: true,
  },
];

/**
 * Helper functions for filtering navigation items
 */
export const getDesktopNavItems = () =>
  NAV_ITEMS.filter((item) => item.showOnDesktop);

export const getMobileNavItems = () =>
  NAV_ITEMS.filter((item) => item.showOnMobile);

export const getMobileSheetItems = () =>
  NAV_ITEMS.filter((item) => item.showInMobileSheet);
