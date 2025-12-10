"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function DatePicker({
  selectedDate,
  onDateChange,
  className,
}: DatePickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 15 days: 7 before today, today, 7 after
  const today = new Date();
  const dates = Array.from({ length: 15 }, (_, i) =>
    addDays(subDays(today, 7), i),
  );

  // Scroll to selected date on mount
  useEffect(() => {
    if (scrollRef.current) {
      const selectedIndex = dates.findIndex((d) => isSameDay(d, selectedDate));
      const button = scrollRef.current.children[selectedIndex] as HTMLElement;
      if (button) {
        button.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, []);

  const scrollTo = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isSameDay(date, addDays(today, 1))) return "Tomorrow";
    if (isSameDay(date, subDays(today, 1))) return "Yesterday";
    return format(date, "EEE");
  };

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 hidden sm:flex"
        onClick={() => scrollTo("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Date Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[60px] transition-all",
                "hover:bg-muted/80 active:scale-95",
                isSelected && "bg-primary text-primary-foreground",
                !isSelected && isTodayDate && "ring-1 ring-primary/50",
              )}
            >
              <span
                className={cn(
                  "text-[10px] uppercase font-medium",
                  isSelected
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {getDateLabel(date)}
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  isSelected ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {format(date, "d")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 hidden sm:flex"
        onClick={() => scrollTo("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
