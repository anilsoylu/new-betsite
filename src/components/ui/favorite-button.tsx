"use client";

import { useState, useCallback } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type FavoriteSize = "sm" | "md" | "lg";

interface FavoriteButtonProps {
  /** Whether the item is currently favorited */
  isFavorite: boolean;
  /** Callback when favorite status should toggle */
  onToggle: () => void;
  /**
   * Size variant:
   * - sm: 28x28 button, 16x16 icon (for dense lists)
   * - md: 32x32 button, 20x20 icon (default)
   * - lg: 40x40 button, 24x24 icon (for featured cards)
   */
  size?: FavoriteSize;
  /** Additional className for customization */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

const sizeConfig: Record<FavoriteSize, { button: string; icon: string }> = {
  sm: { button: "h-7 w-7", icon: "h-4 w-4" },
  md: { button: "h-8 w-8", icon: "h-5 w-5" },
  lg: { button: "h-10 w-10", icon: "h-6 w-6" },
};

/**
 * Animated favorite star button with pop animation on toggle.
 * Self-contained animation state - no external state management needed.
 *
 * @example
 * const isFavorite = favoritesStore.isFavorite("teams", teamId);
 *
 * <FavoriteButton
 *   isFavorite={isFavorite}
 *   onToggle={() => favoritesStore.toggleFavorite("teams", teamId)}
 *   size="sm"
 * />
 */
export function FavoriteButton({
  isFavorite,
  onToggle,
  size = "md",
  className,
  ariaLabel,
}: FavoriteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { button: buttonSize, icon: iconSize } = sizeConfig[size];

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);

      // Call toggle handler
      onToggle();
    },
    [onToggle],
  );

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full transition-all active:scale-90",
        buttonSize,
        isFavorite
          ? "text-yellow-500"
          : "text-muted-foreground/50 hover:text-muted-foreground",
        className,
      )}
      aria-label={
        ariaLabel || (isFavorite ? "Favorilerden çıkar" : "Favorilere ekle")
      }
      aria-pressed={isFavorite}
    >
      <Star
        className={cn(
          "transition-transform",
          iconSize,
          isFavorite && "fill-yellow-500",
          isAnimating && "animate-star-pop",
        )}
      />
    </button>
  );
}
