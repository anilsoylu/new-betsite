"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { format, addDays, subDays } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { DATE_FORMATS } from "@/lib/constants"

interface DateItem {
  date: Date
  dateString: string
  label: string
  dayNumber: string
  isToday: boolean
  isSelected: boolean
}

interface DateNavigationProps {
  dates: DateItem[]
}

export function DateNavigation({ dates }: DateNavigationProps) {
  const router = useRouter()
  const selectedDate = dates.find((d) => d.isSelected)?.date || new Date()

  const handlePrevWeek = () => {
    const newDate = subDays(selectedDate, 7)
    router.push(`/matches?date=${format(newDate, DATE_FORMATS.apiDate)}`)
  }

  const handleNextWeek = () => {
    const newDate = addDays(selectedDate, 7)
    router.push(`/matches?date=${format(newDate, DATE_FORMATS.apiDate)}`)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      router.push(`/matches?date=${format(date, DATE_FORMATS.apiDate)}`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Previous Week Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevWeek}
        className="shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Date Pills */}
      <div className="flex-1 flex justify-center gap-1 overflow-x-auto scrollbar-hide">
        {dates.map((item) => (
          <Link
            key={item.dateString}
            href={`/matches?date=${item.dateString}`}
            className={cn(
              "flex flex-col items-center px-3 py-2 rounded-lg min-w-[60px] transition-colors",
              item.isSelected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
              item.isToday && !item.isSelected && "border border-primary"
            )}
          >
            <span className="text-xs font-medium uppercase">{item.label}</span>
            <span className="text-lg font-bold">{item.dayNumber}</span>
          </Link>
        ))}
      </div>

      {/* Next Week Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextWeek}
        className="shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Calendar Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Calendar className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
