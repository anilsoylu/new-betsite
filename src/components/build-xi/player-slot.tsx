"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";
import type { LineupSlotPlayer, PositionSlot } from "@/types/build-xi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlayerSlotProps {
  slot: PositionSlot;
  player: LineupSlotPlayer | null;
  isSelected: boolean;
  onSelect: () => void;
  onClear: () => void;
}

export function PlayerSlot({
  slot,
  player,
  isSelected,
  onSelect,
  onClear,
}: PlayerSlotProps) {
  const initials = player?.displayName
    ? player.displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  // Empty slot
  if (!player) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex flex-col items-center gap-1 transition-all duration-200",
          "hover:scale-110 cursor-pointer group",
        )}
      >
        <div
          className={cn(
            "w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-dashed",
            "flex items-center justify-center transition-all",
            isSelected
              ? "border-primary bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-green-600"
              : "border-white/50 bg-white/10 backdrop-blur-sm group-hover:border-white group-hover:bg-white/20",
          )}
        >
          <Plus
            className={cn(
              "w-5 h-5 transition-colors",
              isSelected
                ? "text-primary"
                : "text-white/70 group-hover:text-white",
            )}
          />
        </div>
        <span
          className={cn(
            "text-[10px] sm:text-xs font-medium transition-colors",
            isSelected
              ? "text-primary"
              : "text-white/70 group-hover:text-white",
          )}
        >
          {slot.label}
        </span>
      </button>
    );
  }

  // Filled slot
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200",
            "hover:scale-110 cursor-pointer",
          )}
        >
          <Avatar
            className={cn(
              "w-9 h-9 sm:w-11 sm:h-11 border-2 shadow-lg transition-all",
              isSelected
                ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-green-600"
                : "border-white",
            )}
          >
            <AvatarImage
              src={player.image ?? undefined}
              alt={player.displayName}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-[9px] sm:text-[10px] font-medium text-white text-center max-w-[60px] truncate drop-shadow-md">
            {player.displayName.split(" ").pop()}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40">
        <DropdownMenuItem onClick={onSelect}>
          <Plus className="w-4 h-4 mr-2" />
          Change Player
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClear} className="text-destructive">
          <X className="w-4 h-4 mr-2" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
